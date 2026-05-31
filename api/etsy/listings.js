import { getAccessToken } from "./lib/token.js";

const ETSY_KEYSTRING = (process.env.ETSY_KEYSTRING || "").trim();
const ETSY_SHARED_SECRET = (process.env.ETSY_SHARED_SECRET || "").trim();
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || "";
const ETSY_LISTINGS_LIMIT = Number.parseInt(process.env.ETSY_LISTINGS_LIMIT || "0", 10);

const ETSY_PAGE_SIZE = 100; // Etsy v3 max per request
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _cachedListings = null;
let _cacheExpiry = 0;
let _pendingFetch = null;

function resolveEtsyApiKey() {
  const raw = ETSY_KEYSTRING.trim();
  if (!raw) return "";
  if (raw.includes(":")) return raw;
  const key = raw;
  const secret = ETSY_SHARED_SECRET.trim();
  return secret ? `${key}:${secret}` : key;
}

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

async function fetchActiveEtsyListings() {
  if (_cachedListings && Date.now() < _cacheExpiry) {
    return _cachedListings;
  }

  if (_pendingFetch) {
    return _pendingFetch;
  }

  _pendingFetch = (async () => {
    const etsyApiKey = resolveEtsyApiKey();
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

    const allListings = [];
    let offset = 0;

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

    while (true) {
      const endpoint = new URL(
        `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active`,
      );
      const limit =
        ETSY_LISTINGS_LIMIT > 0
          ? Math.min(ETSY_PAGE_SIZE, ETSY_LISTINGS_LIMIT - offset)
          : ETSY_PAGE_SIZE;
      endpoint.searchParams.set("limit", String(limit));
      endpoint.searchParams.set("offset", String(offset));
      endpoint.searchParams.set("includes", "Images");

      const response = await fetchWithRetries(endpoint, { headers: authHeaders });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        // Detect common Etsy 403 message and provide actionable guidance
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

    const normalized = (
      ETSY_LISTINGS_LIMIT > 0 ? allListings.slice(0, ETSY_LISTINGS_LIMIT) : allListings
    ).map((listing) => normalizeListing(listing));

    _cachedListings = normalized;
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
