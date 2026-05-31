import { getAccessToken } from "./lib/token.js";
import { apiUrl, buildXApiKey } from "./config.js";

const ETSY_KEYSTRING = (process.env.ETSY_KEYSTRING || "").trim();
const ETSY_SHARED_SECRET = (process.env.ETSY_SHARED_SECRET || "").trim();
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || "";
const ETSY_LISTINGS_LIMIT = Number.parseInt(process.env.ETSY_LISTINGS_LIMIT || "0", 10);

const ETSY_PAGE_SIZE = 100; // Etsy v3 max per request
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const BATCH_HYDRATE_SIZE = 100;

let _cachedListings = null;
let _cacheExpiry = 0;
let _pendingFetch = null;
let _cachedListingIndex = new Map();

function normalizeListing(listing) {
  const image =
    listing?.Images?.[0] ||
    listing?.images?.[0] ||
    listing?.image ||
    listing?.primary_image ||
    null;
  const price = listing?.price;
  const amount = Number(price?.amount ?? 0);
  const divisor = Number(price?.divisor ?? 100);

  return {
    id: String(listing?.listing_id ?? ""),
    listing_id: listing?.listing_id,
    title: listing?.title ?? "Untitled listing",
    description: listing?.description ?? "",
    price: {
      amount: Number.isFinite(amount) ? amount : 0,
      divisor: Number.isFinite(divisor) && divisor > 0 ? divisor : 100,
      currency_code: price?.currency_code || "USD",
    },
    tags: Array.isArray(listing?.tags) ? listing.tags : [],
    image_url:
      image?.url_570xN || image?.url_fullxfull || image?.url_75x75 || image?.url_full || null,
    url: listing?.url || listing?.listing_url || listing?.listing_url_full || null,
  };
}

function getListingTimestamp(listing) {
  return Number(
    listing?.updated_timestamp ??
      listing?.last_modified_timestamp ??
      listing?.state_timestamp ??
      listing?.created_timestamp ??
      0,
  );
}

function hasHydrationNeeds(listing) {
  return Boolean(listing?.description || listing?.quantity > 1 || listing?.has_variations);
}

function buildHydrationParams(listingIds) {
  const params = new URLSearchParams();
  params.set("listing_ids", listingIds.join(","));
  params.set("includes", "Images,Inventory,Translations");
  params.set("legacy", "true");
  return params;
}

async function fetchListingsByShop(authHeaders, fetchWithRetries) {
  const allListings = [];
  let offset = 0;

  while (true) {
    const endpoint = new URL(apiUrl(`/v3/application/shops/${ETSY_SHOP_ID}/listings`));
    const limit =
      ETSY_LISTINGS_LIMIT > 0
        ? Math.min(ETSY_PAGE_SIZE, ETSY_LISTINGS_LIMIT - offset)
        : ETSY_PAGE_SIZE;
    endpoint.searchParams.set("state", "active");
    endpoint.searchParams.set("limit", String(limit));
    endpoint.searchParams.set("offset", String(offset));
    endpoint.searchParams.set("includes", "Images,Inventory,Translations");
    endpoint.searchParams.set("legacy", "true");

    const response = await fetchWithRetries(endpoint, { headers: authHeaders });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      if (response.status === 403 && /Shared secret is required/i.test(body)) {
        throw new Error(
          `Etsy API 403: Shared secret required in x-api-key header. Ensure ETSY_KEYSTRING includes ":<secret>" or set ETSY_SHARED_SECRET in your environment. Response: ${body}`,
        );
      }
      throw new Error(`Etsy API request failed (${response.status}): ${body}`);
    }

    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];
    allListings.push(...results);

    const reachedCap = ETSY_LISTINGS_LIMIT > 0 && allListings.length >= ETSY_LISTINGS_LIMIT;
    if (results.length < ETSY_PAGE_SIZE || reachedCap) break;
    offset += ETSY_PAGE_SIZE;
  }

  return ETSY_LISTINGS_LIMIT > 0 ? allListings.slice(0, ETSY_LISTINGS_LIMIT) : allListings;
}

async function fetchListingBatch(listingIds, authHeaders, fetchWithRetries) {
  if (listingIds.length === 0) return new Map();

  const enrichedListings = new Map();
  for (let index = 0; index < listingIds.length; index += BATCH_HYDRATE_SIZE) {
    const batchIds = listingIds.slice(index, index + BATCH_HYDRATE_SIZE);
    const endpoint = new URL(apiUrl("/v3/application/listings/batch"));
    endpoint.search = buildHydrationParams(batchIds).toString();

    const response = await fetchWithRetries(endpoint, { headers: authHeaders });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Etsy batch listing request failed (${response.status}): ${body}`);
    }

    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];
    for (const listing of results) {
      enrichedListings.set(String(listing?.listing_id ?? ""), listing);
    }
  }

  return enrichedListings;
}

async function fetchActiveEtsyListings() {
  if (_cachedListings && Date.now() < _cacheExpiry) {
    return _cachedListings;
  }

  if (_pendingFetch) {
    return _pendingFetch;
  }

  _pendingFetch = (async () => {
    const etsyApiKey = buildXApiKey(ETSY_KEYSTRING);
    // If the resolved API key doesn't contain the shared secret and no
    // ETSY_SHARED_SECRET is configured, warn early — some Etsy endpoints
    // require the full `key:secret` in the `x-api-key` header.
    if (!etsyApiKey.includes(":") && !ETSY_SHARED_SECRET) {
      console.warn(
        "[etsy-proxy] Warning: ETSY_SHARED_SECRET is missing — some Etsy endpoints require the shared secret in the x-api-key header. Set ETSY_KEYSTRING to 'key:secret' or provide ETSY_SHARED_SECRET.",
      );
    }
    if (!etsyApiKey || !ETSY_SHOP_ID) {
      throw new Error(
        "Etsy configuration missing: ensure ETSY_KEYSTRING (optionally ETSY_SHARED_SECRET) and ETSY_SHOP_ID are set in your environment.",
      );
    }

    const accessToken = await getAccessToken().catch(() => null);
    const authHeaders = {
      "x-api-key": etsyApiKey,
    };

    if (accessToken) {
      authHeaders.Authorization = `Bearer ${accessToken}`;
    }

    // Helper: fetch with simple retry/backoff for transient errors (429 + network failures)
    async function fetchWithRetries(resource, opts = {}) {
      const maxAttempts = 3;
      let attempt = 0;
      let lastError = null;

      while (attempt < maxAttempts) {
        attempt += 1;
        try {
          const res = await fetch(resource, opts);

          if (res.status === 429) {
            const ra = res.headers.get("retry-after");
            const waitMs = ra ? Number(ra) * 1000 : 1000 * attempt;
            console.warn(`[etsy-proxy] rate limited (429), retrying after ${waitMs}ms`);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }

          return res;
        } catch (err) {
          lastError = err;
          const backoff = 250 * Math.pow(2, attempt - 1);
          await new Promise((r) => setTimeout(r, backoff));
        }
      }

      throw lastError || new Error("Failed to fetch resource after retries");
    }

    const shopListings = await fetchListingsByShop(authHeaders, fetchWithRetries);
    const previousIndex = _cachedListingIndex;
    const nextIndex = new Map();

    const listingsNeedingHydration = [];
    const normalizedSeedListings = [];

    for (const listing of shopListings) {
      const listingId = String(listing?.listing_id ?? "");
      if (!listingId) continue;

      const currentTimestamp = getListingTimestamp(listing);
      nextIndex.set(listingId, currentTimestamp);

      const previousTimestamp = previousIndex.get(listingId);
      const needsHydration =
        !previousTimestamp ||
        previousTimestamp !== currentTimestamp ||
        hasHydrationNeeds(listing) ||
        !listing?.Images?.length;

      if (needsHydration) {
        listingsNeedingHydration.push(listingId);
        continue;
      }

      normalizedSeedListings.push(listing);
    }

    const hydratedListings = await fetchListingBatch(
      listingsNeedingHydration,
      authHeaders,
      fetchWithRetries,
    );

    const mergedListings = shopListings.map((listing) => {
      const listingId = String(listing?.listing_id ?? "");
      const hydrated = hydratedListings.get(listingId);
      return hydrated ? { ...listing, ...hydrated } : listing;
    });

    const normalized = mergedListings.map((listing) => normalizeListing(listing));

    _cachedListings = normalized;
    _cachedListingIndex = nextIndex;
    _cacheExpiry = Date.now() + CACHE_TTL_MS;
    return normalized;
  })();

  try {
    return await _pendingFetch;
  } finally {
    _pendingFetch = null;
  }
}

export default async function handler(req, res) {
  // Basic CORS headers for Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const listings = await fetchActiveEtsyListings();
    res.status(200).json({ results: listings });
  } catch (error) {
    console.error("[etsy-proxy]", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch Etsy listings" });
  }
}
