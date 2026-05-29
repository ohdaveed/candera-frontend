import { describe, expect, it } from "vitest";
import { generateSequentialSequence, getExhibitCode } from "./sequence";

describe("exhibit sequence generation", () => {
  it("generates bijective exhibit codes", () => {
    expect(getExhibitCode(0)).toBe("Exhibit A");
    expect(getExhibitCode(25)).toBe("Exhibit Z");
    expect(getExhibitCode(26)).toBe("Exhibit AA");
    expect(getExhibitCode(27)).toBe("Exhibit AB");
  });

  it("sorts chronologically and assigns padded page ranges", () => {
    const result = generateSequentialSequence([
      {
        id: "second",
        timestamp: "2026-01-02T00:00:00.000Z",
        pageFootprint: 3,
      },
      {
        id: "first",
        timestamp: "2026-01-01T00:00:00.000Z",
        pageFootprint: 2,
      },
    ]);

    expect(result.map((item) => item.id)).toEqual(["first", "second"]);
    expect(result[0]).toMatchObject({
      exhibitCode: "Exhibit A",
      pageRange: { start: "0001", end: "0002" },
    });
    expect(result[1]).toMatchObject({
      exhibitCode: "Exhibit B",
      pageRange: { start: "0003", end: "0005" },
    });
  });
});
