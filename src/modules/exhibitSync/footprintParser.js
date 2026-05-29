const PDF_SIGNATURE = "%PDF";
const TIFF_LITTLE_ENDIAN = 0x4949;
const TIFF_BIG_ENDIAN = 0x4d4d;
const TIFF_MAGIC = 42;
const BIG_TIFF_MAGIC = 43;

async function readBlobText(blob) {
  if (typeof blob.text === "function") return blob.text();
  const buffer = await blob.arrayBuffer();
  return new TextDecoder("latin1").decode(buffer);
}

function getUint16(view, offset, littleEndian) {
  if (offset + 2 > view.byteLength) return null;
  return view.getUint16(offset, littleEndian);
}

function getUint32(view, offset, littleEndian) {
  if (offset + 4 > view.byteLength) return null;
  return view.getUint32(offset, littleEndian);
}

export async function parsePdfPageFootprint(blob) {
  const content = await readBlobText(blob);
  const countMatches = [...content.matchAll(/\/Count\s+(\d+)/g)]
    .map((match) => Number.parseInt(match[1], 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (countMatches.length > 0) {
    return Math.max(...countMatches);
  }

  const pageMatches = content.match(/\/Type\s*\/Page\b/g);
  return pageMatches?.length || 1;
}

export async function parseTiffPageFootprint(blob) {
  const buffer = await blob.arrayBuffer();
  const view = new DataView(buffer);
  const byteOrder = getUint16(view, 0, false);
  const littleEndian =
    byteOrder === TIFF_LITTLE_ENDIAN ? true : byteOrder === TIFF_BIG_ENDIAN ? false : null;

  if (littleEndian === null) return 1;

  const magic = getUint16(view, 2, littleEndian);
  if (magic !== TIFF_MAGIC && magic !== BIG_TIFF_MAGIC) return 1;
  if (magic === BIG_TIFF_MAGIC) return 1;

  let ifdOffset = getUint32(view, 4, littleEndian);
  let frameCount = 0;
  const visitedOffsets = new Set();

  while (ifdOffset && ifdOffset < view.byteLength && !visitedOffsets.has(ifdOffset)) {
    visitedOffsets.add(ifdOffset);
    const entryCount = getUint16(view, ifdOffset, littleEndian);
    if (entryCount === null) break;

    frameCount += 1;
    const nextOffsetPosition = ifdOffset + 2 + entryCount * 12;
    const nextOffset = getUint32(view, nextOffsetPosition, littleEndian);
    ifdOffset = nextOffset ?? 0;
  }

  return frameCount || 1;
}

export async function parsePageFootprint(blob) {
  const headerBuffer = await blob.slice(0, 8).arrayBuffer();
  const headerBytes = new Uint8Array(headerBuffer);
  const headerText = new TextDecoder("latin1").decode(headerBytes);

  if (headerText.startsWith(PDF_SIGNATURE)) {
    return parsePdfPageFootprint(blob);
  }

  if (
    (headerBytes[0] === 0x49 && headerBytes[1] === 0x49) ||
    (headerBytes[0] === 0x4d && headerBytes[1] === 0x4d)
  ) {
    return parseTiffPageFootprint(blob);
  }

  return 1;
}
