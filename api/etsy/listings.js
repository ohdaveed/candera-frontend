import { URL } from "node:url";

const ETSY_KEYSTRING = process.env.ETSY_KEYSTRING || "";
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || "";
const ETSY_LISTINGS_LIMIT = Number.parseInt(process.env.ETSY_LISTINGS_LIMIT || "50", 10);

function normalizeListing(listing) {
  const image = listing?.images?.[0];
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
  if (!ETSY_KEYSTRING || !ETSY_SHOP_ID) {
    throw new Error("Etsy configuration missing: ETSY_KEYSTRING and ETSY_SHOP_ID must be set");
  }

  const endpoint = new URL(
    `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active`,
  );
  endpoint.searchParams.set("limit", String(ETSY_LISTINGS_LIMIT));
  endpoint.searchParams.set("includes", "images");

  const response = await fetch(endpoint, {
    headers: {
      "x-api-key": ETSY_KEYSTRING,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Etsy API request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.map((listing) => normalizeListing(listing));
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
