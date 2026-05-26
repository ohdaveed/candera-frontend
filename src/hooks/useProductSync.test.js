import { describe, it, expect } from "vitest";
import { extractMetadata, toProductShape } from "./useProductSync";

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
});
