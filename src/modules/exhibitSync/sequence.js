const DEFAULT_PADDING_LENGTH = 4;

function toTimestampMillis(timestamp) {
  const value = new Date(timestamp).getTime();
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
}

function toPageFootprint(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : 1;
}

export function getExhibitCode(index) {
  let cursor = Number(index);
  if (!Number.isInteger(cursor) || cursor < 0) return "Exhibit A";

  let code = "";
  while (cursor >= 0) {
    code = String.fromCharCode((cursor % 26) + 65) + code;
    cursor = Math.floor(cursor / 26) - 1;
  }
  return `Exhibit ${code}`;
}

export function sortItemsChronologically(items) {
  return [...items].sort((a, b) => {
    const timeDelta = toTimestampMillis(a.timestamp) - toTimestampMillis(b.timestamp);
    if (timeDelta !== 0) return timeDelta;
    return String(a.id).localeCompare(String(b.id));
  });
}

export function generateSequentialSequence(items, paddingLength = DEFAULT_PADDING_LENGTH) {
  const sortedItems = sortItemsChronologically(items);
  let currentPagePointer = 1;

  return sortedItems.map((item, index) => {
    const pageFootprint = toPageFootprint(item.pageFootprint);
    const startPage = currentPagePointer;
    const endPage = startPage + pageFootprint - 1;
    currentPagePointer = endPage + 1;

    return {
      ...item,
      pageFootprint,
      exhibitCode: getExhibitCode(index),
      pageRange: {
        start: String(startPage).padStart(paddingLength, "0"),
        end: String(endPage).padStart(paddingLength, "0"),
      },
    };
  });
}

export function selectSynchronizedItems(state, paddingLength = DEFAULT_PADDING_LENGTH) {
  const items = state.itemOrder.map((id) => state.items[id]).filter(Boolean);
  return generateSequentialSequence(items, paddingLength);
}
