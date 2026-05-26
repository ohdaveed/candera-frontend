import { useCallback, useEffect, useMemo, useState } from "react";

const legacyProductsApiUrl = import.meta.env.VITE_PRODUCTS_API_URL;
const etsyProductsEndpoint = "/api/etsy/listings";
const etsyBackendApiKey = import.meta.env.VITE_ETSY_BACKEND_API_KEY;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const etsyShopUrl =
  import.meta.env.VITE_ETSY_SHOP_URL || "https://www.etsy.com/shop/CanderaCandles";

// Use legacy URL if provided (likely for Supabase), otherwise use our new Etsy proxy
const productsApiUrl = legacyProductsApiUrl || etsyProductsEndpoint;

// Default values for missing data
const DEFAULT_PRICE = 38;
const SENSORY_X_MULTIPLIER = 17;
const SENSORY_Y_MULTIPLIER = 29;
const SENSORY_COORDINATE_MAX = 100;
const MAX_TAGLINE_LENGTH = 140;

function toSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toPrice(value) {
  function asValidPrice(candidate) {
    return Number.isFinite(candidate) && candidate >= 0 ? candidate : DEFAULT_PRICE;
  }

  if (typeof value === "number") return asValidPrice(value);
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ""));
    return asValidPrice(parsed);
  }
  if (value && typeof value.amount !== "undefined") {
    const amount = Number(value.amount);
    const divisor = Number(value.divisor || 1);
    if (Number.isFinite(amount) && Number.isFinite(divisor) && divisor > 0) {
      return asValidPrice(amount / divisor);
    }
  }
  return DEFAULT_PRICE;
}

export function extractMetadata(description, tags, index) {
  // Extract Scent Profile
  // Looks for patterns like "Top: Sea Breeze | Heart: Driftwood | Base: Salt Air" or similar
  const topMatch = description.match(/Top(?:\s*notes)?:\s*([^|\n,.]+)/i);
  const heartMatch = description.match(/Heart(?:\s*notes)?:\s*([^|\n,.]+)/i);
  const baseMatch = description.match(/Base(?:\s*notes)?:\s*([^|\n,.]+)/i);

  const scent_profile = {
    top: topMatch?.[1]?.trim() ?? tags[0] ?? "Top notes",
    heart: heartMatch?.[1]?.trim() ?? tags[1] ?? "Heart notes",
    base: baseMatch?.[1]?.trim() ?? tags[2] ?? "Base notes",
  };

  // Extract Sensory Coordinates
  // Looks for patterns like "Sensory Map: [25, 50]" or "Map: 25, 50"
  const sensoryMatch = description.match(/Sensory\s*(?:Map)?:\s*\[?(\d+)\s*,\s*(\d+)\]?/i);
  const sensory = {
    x: sensoryMatch
      ? Number.parseInt(sensoryMatch[1], 10)
      : (index * SENSORY_X_MULTIPLIER) % SENSORY_COORDINATE_MAX,
    y: sensoryMatch
      ? Number.parseInt(sensoryMatch[2], 10)
      : (index * SENSORY_Y_MULTIPLIER) % SENSORY_COORDINATE_MAX,
  };

  // Extract Batch/Vessel info
  const batchMatch = description.match(/Batch:\s*(\d+)/i) || description.match(/Vessel:\s*(\d+)/i);
  const vessel = batchMatch?.[1] ?? String(index + 1).padStart(3, "0");

  // Extract Burn Time
  const burnMatch = description.match(/Burn\s*Time:\s*(\d+\+?\s*Hours)/i);
  const burn_time = burnMatch?.[1] ?? "50 Hours";

  return { scent_profile, sensory, vessel, burn_time };
}

export function toProductShape(listing, index) {
  const name = String(listing?.name ?? listing?.title ?? `Product ${index + 1}`);
  const slug = toSlug(listing?.slug ?? name) || `candera-vessel-${index + 1}`;
  const id = String(listing?.id ?? listing?.listing_id ?? slug);
  const description = String(listing?.description ?? "");

  // Tagline logic: use the first sentence
  const firstSentence = description.split(/[.!?]\s/)[0]?.trim();
  const fallbackTagline =
    firstSentence && firstSentence.length <= MAX_TAGLINE_LENGTH
      ? firstSentence
      : "Handcrafted listing from Etsy.";

  const tags = Array.isArray(listing?.tags) ? listing.tags.filter(Boolean) : [];
  const { scent_profile, sensory, vessel, burn_time } = extractMetadata(description, tags, index);

  return {
    id,
    slug,
    name,
    vessel,
    price: toPrice(listing?.price),
    tagline: listing?.tagline ?? fallbackTagline,
    description,
    scent_profile,
    notes: tags.length > 0 ? tags : ["Botanical blend"],
    details: [
      "15 oz · Natural wax blend",
      "Numbered vessel",
      "Micro-batch cured",
      "Ships from California",
    ],
    metadata: {
      burn_time,
      mood: tags[0] ?? "Ritual",
      batch: vessel,
    },
    etsy_id: String(listing?.listing_id ?? ""),
    image: listing?.image_url ?? null,
    etsy_link: listing?.url ?? etsyShopUrl,
    tag: tags.includes("Bestseller") ? "Bestseller" : tags.includes("New") ? "New Release" : null,
    atmosphere: tags[1] ?? "Handcrafted",
    sensory,
  };
}

function normalizeProductsPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : null;
  if (!list) return null;
  return list.map((item, index) => toProductShape(item, index));
}

export function useProductSync() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const isSupabase = productsApiUrl.includes("supabase.co");
        const headers = isSupabase
          ? {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            }
          : etsyBackendApiKey
            ? { "x-api-key": etsyBackendApiKey }
            : undefined;

        const response = await fetch(productsApiUrl, {
          signal: controller.signal,
          headers,
        });

        if (!response.ok) {
          throw new Error(`Product sync failed with ${response.status}`);
        }

        const payload = await response.json();
        const syncedProducts = normalizeProductsPayload(payload);

        if (!syncedProducts) {
          throw new Error("Product sync failed: invalid payload format");
        }
        if (syncedProducts.length === 0) {
          throw new Error("Product sync failed: no products returned");
        }

        setProducts(syncedProducts);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => controller.abort();
  }, []);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.slug, product])),
    [products],
  );

  const getProductBySlug = useCallback((slug) => productMap[slug] ?? null, [productMap]);

  return {
    products,
    productMap,
    getProductBySlug,
    isLoading,
    error,
  };
}
