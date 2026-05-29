import { afterEach, describe, it, expect, vi } from "vitest";
import {
  CATALOG_STATUS,
  FALLBACK_REASONS,
  extractMetadata,
  fetchStudioCatalog,
  toProductShape,
} from "./useProductSync";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useProductSync parsing logic", () => {
  describe("extractMetadata", () => {
    it("should extract scent profile from description", () => {
      const description = "A beautiful candle. Top: Lavender | Heart: Vanilla | Base: Sandalwood.";
      const tags = [];
      const result = extractMetadata(description, tags, 0);

      expect(result.scent_profile).toEqual({
        top: "Lavender",
        heart: "Vanilla",
        base: "Sandalwood",
      });
    });

    it("should fallback to tags for scent profile if not in description", () => {
      const description = "A beautiful candle.";
      const tags = ["Rose", "Jasmine", "Amber"];
      const result = extractMetadata(description, tags, 0);

      expect(result.scent_profile).toEqual({
        top: "Rose",
        heart: "Jasmine",
        base: "Amber",
      });
    });

    it("should extract sensory coordinates from description", () => {
      const description = "Sensory Map: [40, 60]";
      const result = extractMetadata(description, [], 0);

      expect(result.sensory).toEqual({ x: 40, y: 60 });
    });

    it("should extract batch/vessel number", () => {
      const description = "Batch: 123";
      const result = extractMetadata(description, [], 0);
      expect(result.vessel).toBe("123");
    });

    it("should extract burn time", () => {
      const description = "Burn Time: 65+ Hours";
      const result = extractMetadata(description, [], 0);
      expect(result.burn_time).toBe("65+ Hours");
    });
  });

  describe("toProductShape", () => {
    it("should generate a valid product object from Etsy listing", () => {
      const listing = {
        listing_id: "12345",
        title: "Ocean Breeze Candle",
        description:
          "Fresh and airy. Top: Sea Salt | Heart: Lily | Base: Driftwood. Sensory Map: [10, 20]",
        price: { amount: 3800, divisor: 100 },
        tags: ["Coastal", "Bestseller"],
        url: "https://etsy.com/listing/12345",
        image_url: "https://example.com/image.jpg",
      };

      const product = toProductShape(listing, 0);

      expect(product.name).toBe("Ocean Breeze Candle");
      expect(product.slug).toBe("ocean-breeze-candle");
      expect(product.price).toBe(38);
      expect(product.tagline).toBe("Fresh and airy");
      expect(product.scent_profile.top).toBe("Sea Salt");
      expect(product.sensory).toEqual({ x: 10, y: 20 });
      expect(product.tag).toBe("Bestseller");
    });
  });

  describe("fetchStudioCatalog", () => {
    it("returns live status for valid Etsy payloads", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              listing_id: "12345",
              title: "Ocean Breeze Candle",
              description: "Fresh and airy.",
              price: { amount: 3800, divisor: 100 },
              tags: ["Coastal"],
            },
          ],
        }),
      });

      const result = await fetchStudioCatalog({ endpoint: "/api/etsy/listings" });

      expect(result.status).toBe(CATALOG_STATUS.LIVE);
      expect(result.items).toHaveLength(1);
      expect(result.error).toBeNull();
    });

    it("returns fallback status when Etsy returns no active listings", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      });

      const result = await fetchStudioCatalog({ endpoint: "/api/etsy/listings" });

      expect(result.status).toBe(CATALOG_STATUS.FALLBACK);
      expect(result.fallbackReason).toBe(FALLBACK_REASONS.NO_ACTIVE_LISTINGS);
      expect(result.error).toBeNull();
      expect(result.items.length).toBeGreaterThan(0);
    });

    it("returns error status with fallback products for unreachable APIs", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 503,
      });

      const result = await fetchStudioCatalog({ endpoint: "/api/etsy/listings" });

      expect(result.status).toBe(CATALOG_STATUS.ERROR);
      expect(result.error.message).toBe("Product sync failed with 503");
      expect(result.items.length).toBeGreaterThan(0);
    });
  });
});
