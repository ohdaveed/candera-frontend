import { getAccessToken } from "./lib/token.js";

const ETSY_KEYSTRING = process.env.ETSY_KEYSTRING || "";
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || "";
const ETSY_LISTINGS_LIMIT = Number.parseInt(process.env.ETSY_LISTINGS_LIMIT || "0", 10);

const ETSY_PAGE_SIZE = 100; // Etsy v3 max per request
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _cachedListings = null;
let _cacheExpiry = 0;
let _pendingFetch = null;

function normalizeListing(listing) {
  const image = listing?.Images?.[0] || listing?.images?.[0];
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
    image_url: image?.url_570xN || image?.url_fullxfull || null,
    url: listing?.url || null,
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
    if (!ETSY_KEYSTRING || !ETSY_SHOP_ID) {
      throw new Error("Etsy configuration missing: ETSY_KEYSTRING and ETSY_SHOP_ID must be set");
    }

    const allListings = [];
    let offset = 0;

    const accessToken = await getAccessToken().catch(() => null);
    const authHeader = {
      "x-api-key": ETSY_KEYSTRING,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    while (true) {
      const endpoint = new URL(
        `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active`,
      );
      endpoint.searchParams.set("limit", String(ETSY_PAGE_SIZE));
      endpoint.searchParams.set("offset", String(offset));
      endpoint.searchParams.set("includes", "Images");

      const response = await fetch(endpoint, { headers: authHeader });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
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
