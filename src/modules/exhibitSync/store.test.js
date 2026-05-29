import { describe, expect, it } from "vitest";
import {
  PARSE_STATUS,
  createInitialExhibitState,
  exhibitReducer,
  selectExhibitPanels,
} from "./store";

describe("exhibit sync store", () => {
  it("normalizes inserted records and derives synchronized panels", () => {
    const state = exhibitReducer(createInitialExhibitState(), {
      type: "items/add",
      items: [
        {
          id: "b",
          fileName: "later.pdf",
          timestamp: "2026-01-02T00:00:00.000Z",
          pageFootprint: 4,
          parseStatus: PARSE_STATUS.READY,
        },
        {
          id: "a",
          fileName: "earlier.pdf",
          timestamp: "2026-01-01T00:00:00.000Z",
          pageFootprint: 2,
          parseStatus: PARSE_STATUS.READY,
        },
      ],
    });

    const panels = selectExhibitPanels(state);

    expect(state.itemOrder).toEqual(["a", "b"]);
    expect(panels.totalPages).toBe(6);
    expect(panels.masterItems.map((item) => item.exhibitCode)).toEqual(["Exhibit A", "Exhibit B"]);
  });

  it("reindexes after timestamp updates and purges removed records", () => {
    const inserted = exhibitReducer(createInitialExhibitState(), {
      type: "items/add",
      items: [
        { id: "a", timestamp: "2026-01-01T00:00:00.000Z", pageFootprint: 1 },
        { id: "b", timestamp: "2026-01-02T00:00:00.000Z", pageFootprint: 1 },
      ],
    });

    const updated = exhibitReducer(inserted, {
      type: "item/update",
      id: "b",
      patch: { timestamp: "2025-12-31T00:00:00.000Z" },
    });
    const removed = exhibitReducer(updated, { type: "item/remove", id: "a" });

    expect(updated.itemOrder).toEqual(["b", "a"]);
    expect(selectExhibitPanels(updated).masterItems[0].exhibitCode).toBe("Exhibit A");
    expect(removed.itemOrder).toEqual(["b"]);
  });

  it("marks active parser work as reviewable when the worker fails", () => {
    const inserted = exhibitReducer(createInitialExhibitState(), {
      type: "items/add",
      items: [
        { id: "a", timestamp: "2026-01-01T00:00:00.000Z", pageFootprint: 1 },
        {
          id: "b",
          timestamp: "2026-01-02T00:00:00.000Z",
          pageFootprint: 2,
          parseStatus: PARSE_STATUS.READY,
        },
      ],
    });

    const parsing = exhibitReducer(inserted, {
      type: "item/update",
      id: "a",
      patch: { parseStatus: PARSE_STATUS.PARSING },
    });
    const recovered = exhibitReducer(parsing, {
      type: "items/mark-active-parse-error",
      error: "Parser worker stopped unexpectedly",
    });

    expect(recovered.items.a).toMatchObject({
      pageFootprint: 1,
      parseStatus: PARSE_STATUS.ERROR,
      parseError: "Parser worker stopped unexpectedly",
    });
    expect(recovered.items.b.parseStatus).toBe(PARSE_STATUS.READY);
    expect(recovered.itemOrder).toEqual(["a", "b"]);
  });
});
