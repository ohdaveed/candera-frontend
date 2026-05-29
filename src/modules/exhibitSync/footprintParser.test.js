import { describe, expect, it } from "vitest";
import { parsePageFootprint } from "./footprintParser";

function createLittleEndianTiffWithFrames(frameCount) {
  const bytes = new Uint8Array(8 + frameCount * 18);
  const view = new DataView(bytes.buffer);
  view.setUint16(0, 0x4949, false);
  view.setUint16(2, 42, true);
  view.setUint32(4, 8, true);

  for (let index = 0; index < frameCount; index += 1) {
    const offset = 8 + index * 18;
    const nextOffset = index === frameCount - 1 ? 0 : offset + 18;
    view.setUint16(offset, 1, true);
    view.setUint32(offset + 14, nextOffset, true);
  }

  return new Blob([bytes], { type: "image/tiff" });
}

describe("binary footprint parser", () => {
  it("detects PDF page counts from catalog count keys", async () => {
    const blob = new Blob(["%PDF-1.7\n1 0 obj<</Type /Pages /Count 12>>endobj"], {
      type: "application/pdf",
    });

    await expect(parsePageFootprint(blob)).resolves.toBe(12);
  });

  it("falls back to counting PDF page nodes", async () => {
    const blob = new Blob(["%PDF-1.7\n/Type /Page\n/Type /Page\n/Type /Pages"], {
      type: "application/pdf",
    });

    await expect(parsePageFootprint(blob)).resolves.toBe(2);
  });

  it("counts TIFF image file directories", async () => {
    await expect(parsePageFootprint(createLittleEndianTiffWithFrames(3))).resolves.toBe(3);
  });

  it("treats single-frame images as one page", async () => {
    const blob = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], { type: "image/jpeg" });

    await expect(parsePageFootprint(blob)).resolves.toBe(1);
  });
});
