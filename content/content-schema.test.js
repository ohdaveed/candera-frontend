import { describe, it, expect } from "vitest";
import home from "./home.json";
import about from "./about.json";
import ritual from "./ritual.json";
import site from "./site.json";

describe("content/home.json schema", () => {
  it("has required top-level string fields", () => {
    expect(typeof home.heroTag).toBe("string");
    expect(home.heroTag.length).toBeGreaterThan(0);

    expect(typeof home.heroHeadline).toBe("string");
    expect(home.heroHeadline.length).toBeGreaterThan(0);

    expect(typeof home.heroSubheading).toBe("string");
    expect(home.heroSubheading.length).toBeGreaterThan(0);

    expect(typeof home.collectionTag).toBe("string");
    expect(home.collectionTag.length).toBeGreaterThan(0);

    expect(typeof home.collectionHeadline).toBe("string");
    expect(home.collectionHeadline.length).toBeGreaterThan(0);

    expect(typeof home.collectionDescription).toBe("string");
    expect(home.collectionDescription.length).toBeGreaterThan(0);

    expect(typeof home.innerCircleHeadline).toBe("string");
    expect(home.innerCircleHeadline.length).toBeGreaterThan(0);

    expect(typeof home.innerCircleDescription).toBe("string");
    expect(home.innerCircleDescription.length).toBeGreaterThan(0);

    expect(typeof home.testimonialsTag).toBe("string");
    expect(home.testimonialsTag.length).toBeGreaterThan(0);
  });

  it("has a testimonials array with at least one entry", () => {
    expect(Array.isArray(home.testimonials)).toBe(true);
    expect(home.testimonials.length).toBeGreaterThan(0);
  });

  it("each testimonial has required fields of correct types", () => {
    for (const testimonial of home.testimonials) {
      expect(typeof testimonial.quote).toBe("string");
      expect(testimonial.quote.length).toBeGreaterThan(0);

      expect(typeof testimonial.author).toBe("string");
      expect(testimonial.author.length).toBeGreaterThan(0);

      expect(typeof testimonial.location).toBe("string");
      expect(testimonial.location.length).toBeGreaterThan(0);

      expect(typeof testimonial.badge).toBe("string");
      expect(testimonial.badge.length).toBeGreaterThan(0);
    }
  });

  it("testimonial does not use legacy 'loc' or 'status' field names", () => {
    // Ensure the Home component's updated field names are respected
    for (const testimonial of home.testimonials) {
      expect(testimonial).not.toHaveProperty("loc");
      expect(testimonial).not.toHaveProperty("status");
    }
  });
});

describe("content/about.json schema", () => {
  it("has required methodology string fields", () => {
    expect(typeof about.methodologyTag).toBe("string");
    expect(about.methodologyTag.length).toBeGreaterThan(0);

    expect(typeof about.methodologyHeadline).toBe("string");
    expect(about.methodologyHeadline.length).toBeGreaterThan(0);

    expect(typeof about.methodologyDescription).toBe("string");
    expect(about.methodologyDescription.length).toBeGreaterThan(0);

    expect(typeof about.methodologyImageAlt).toBe("string");
    expect(about.methodologyImageAlt.length).toBeGreaterThan(0);
  });

  it("has methodologySteps array with exactly 4 steps", () => {
    expect(Array.isArray(about.methodologySteps)).toBe(true);
    expect(about.methodologySteps).toHaveLength(4);
  });

  it("each methodology step has required fields", () => {
    for (const item of about.methodologySteps) {
      expect(typeof item.step).toBe("string");
      expect(item.step.length).toBeGreaterThan(0);

      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);

      // Must use 'description' not 'desc' — the About component uses item.description
      expect(typeof item.description).toBe("string");
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it("methodology steps do not use legacy 'desc' field name", () => {
    for (const item of about.methodologySteps) {
      expect(item).not.toHaveProperty("desc");
    }
  });

  it("has required founder fields", () => {
    expect(typeof about.founderTag).toBe("string");
    expect(about.founderTag.length).toBeGreaterThan(0);

    expect(typeof about.founderHeadline).toBe("string");
    expect(about.founderHeadline.length).toBeGreaterThan(0);

    expect(typeof about.founderImageUrl).toBe("string");
    expect(about.founderImageUrl.length).toBeGreaterThan(0);

    expect(typeof about.founderImageAlt).toBe("string");
    expect(about.founderImageAlt.length).toBeGreaterThan(0);

    expect(typeof about.founderStory1).toBe("string");
    expect(about.founderStory1.length).toBeGreaterThan(0);

    expect(typeof about.founderStory2).toBe("string");
    expect(about.founderStory2.length).toBeGreaterThan(0);

    expect(typeof about.founderRole).toBe("string");
    expect(about.founderRole.length).toBeGreaterThan(0);
  });

  it("has required FAQ fields", () => {
    expect(typeof about.faqHeadline).toBe("string");
    expect(about.faqHeadline.length).toBeGreaterThan(0);

    expect(typeof about.faqSubheading).toBe("string");
    expect(about.faqSubheading.length).toBeGreaterThan(0);

    expect(Array.isArray(about.faq)).toBe(true);
    expect(about.faq.length).toBeGreaterThan(0);
  });

  it("each FAQ entry has question and answer fields", () => {
    for (const item of about.faq) {
      // About component uses item.question and item.answer
      expect(typeof item.question).toBe("string");
      expect(item.question.length).toBeGreaterThan(0);

      expect(typeof item.answer).toBe("string");
      expect(item.answer.length).toBeGreaterThan(0);
    }
  });

  it("FAQ entries do not use legacy 'q' or 'a' field names", () => {
    for (const item of about.faq) {
      expect(item).not.toHaveProperty("q");
      expect(item).not.toHaveProperty("a");
    }
  });

  it("founderImageUrl is a valid URL string", () => {
    expect(() => new URL(about.founderImageUrl)).not.toThrow();
  });
});

describe("content/ritual.json schema", () => {
  it("has required philosophy fields", () => {
    expect(typeof ritual.philosophyTag).toBe("string");
    expect(ritual.philosophyTag.length).toBeGreaterThan(0);

    expect(typeof ritual.philosophyHeadline).toBe("string");
    expect(ritual.philosophyHeadline.length).toBeGreaterThan(0);
  });

  it("has philosophyParagraphs as a non-empty array of strings", () => {
    expect(Array.isArray(ritual.philosophyParagraphs)).toBe(true);
    expect(ritual.philosophyParagraphs.length).toBeGreaterThan(0);
    for (const para of ritual.philosophyParagraphs) {
      expect(typeof para).toBe("string");
      expect(para.length).toBeGreaterThan(0);
    }
  });

  it("has careTipsTag string field", () => {
    expect(typeof ritual.careTipsTag).toBe("string");
    expect(ritual.careTipsTag.length).toBeGreaterThan(0);
  });

  it("has careTips array with at least one entry", () => {
    expect(Array.isArray(ritual.careTips)).toBe(true);
    expect(ritual.careTips.length).toBeGreaterThan(0);
  });

  it("each careTip has title and body fields", () => {
    for (const tip of ritual.careTips) {
      expect(typeof tip.title).toBe("string");
      expect(tip.title.length).toBeGreaterThan(0);

      expect(typeof tip.body).toBe("string");
      expect(tip.body.length).toBeGreaterThan(0);
    }
  });

  it("has materialsTag string field", () => {
    expect(typeof ritual.materialsTag).toBe("string");
    expect(ritual.materialsTag.length).toBeGreaterThan(0);
  });

  it("has materialsParagraphs as a non-empty array of strings", () => {
    expect(Array.isArray(ritual.materialsParagraphs)).toBe(true);
    expect(ritual.materialsParagraphs.length).toBeGreaterThan(0);
    for (const para of ritual.materialsParagraphs) {
      expect(typeof para).toBe("string");
      expect(para.length).toBeGreaterThan(0);
    }
  });
});

describe("content/site.json schema", () => {
  it("has required string fields", () => {
    expect(typeof site.brandName).toBe("string");
    expect(site.brandName.length).toBeGreaterThan(0);

    expect(typeof site.footerTagline).toBe("string");
    expect(site.footerTagline.length).toBeGreaterThan(0);

    expect(typeof site.instagramUrl).toBe("string");
    expect(site.instagramUrl.length).toBeGreaterThan(0);

    expect(typeof site.etsyUrl).toBe("string");
    expect(site.etsyUrl.length).toBeGreaterThan(0);

    expect(typeof site.websiteUrl).toBe("string");
    expect(site.websiteUrl.length).toBeGreaterThan(0);

    expect(typeof site.copyrightYear).toBe("string");
    expect(site.copyrightYear.length).toBeGreaterThan(0);

    expect(typeof site.copyrightName).toBe("string");
    expect(site.copyrightName.length).toBeGreaterThan(0);
  });

  it("social and website URLs are valid URL strings", () => {
    expect(() => new URL(site.instagramUrl)).not.toThrow();
    expect(() => new URL(site.etsyUrl)).not.toThrow();
    expect(() => new URL(site.websiteUrl)).not.toThrow();
  });

  it("copyrightYear is a numeric string representing a plausible year", () => {
    const year = parseInt(site.copyrightYear, 10);
    expect(isNaN(year)).toBe(false);
    expect(year).toBeGreaterThanOrEqual(2000);
    expect(year).toBeLessThanOrEqual(2100);
  });
});
