import { selectSynchronizedItems, sortItemsChronologically } from "./sequence";

export const PARSE_STATUS = {
  PENDING: "pending",
  PARSING: "parsing",
  READY: "ready",
  ERROR: "error",
};

export function createInitialExhibitState() {
  return {
    items: {},
    itemOrder: [],
  };
}

function orderIds(items) {
  return sortItemsChronologically(Object.values(items)).map((item) => item.id);
}

export function exhibitReducer(state, action) {
  switch (action.type) {
    case "items/add": {
      const nextItems = { ...state.items };
      for (const item of action.items) {
        nextItems[item.id] = {
          ...item,
          pageFootprint: item.pageFootprint ?? 1,
          parseStatus: item.parseStatus ?? PARSE_STATUS.PENDING,
        };
      }
      return {
        items: nextItems,
        itemOrder: orderIds(nextItems),
      };
    }

    case "item/update": {
      const existing = state.items[action.id];
      if (!existing) return state;
      const nextItems = {
        ...state.items,
        [action.id]: {
          ...existing,
          ...action.patch,
        },
      };
      return {
        items: nextItems,
        itemOrder: orderIds(nextItems),
      };
    }

    case "item/remove": {
      if (!state.items[action.id]) return state;
      const nextItems = { ...state.items };
      delete nextItems[action.id];
      return {
        items: nextItems,
        itemOrder: state.itemOrder.filter((id) => id !== action.id),
      };
    }

    case "items/mark-active-parse-error": {
      const nextItems = Object.fromEntries(
        Object.entries(state.items).map(([id, item]) => [
          id,
          item.parseStatus === PARSE_STATUS.PARSING || item.parseStatus === PARSE_STATUS.PENDING
            ? {
                ...item,
                pageFootprint: item.pageFootprint ?? 1,
                parseStatus: PARSE_STATUS.ERROR,
                parseError: action.error,
              }
            : item,
        ]),
      );
      return {
        items: nextItems,
        itemOrder: state.itemOrder,
      };
    }

    case "items/clear":
      return createInitialExhibitState();

    default:
      return state;
  }
}

export function selectExhibitPanels(state) {
  const synchronizedItems = selectSynchronizedItems(state);
  const totalPages = synchronizedItems.reduce((sum, item) => sum + item.pageFootprint, 0);
  const pendingCount = synchronizedItems.filter(
    (item) =>
      item.parseStatus === PARSE_STATUS.PARSING || item.parseStatus === PARSE_STATUS.PENDING,
  ).length;

  return {
    masterItems: synchronizedItems,
    viewerItems: synchronizedItems,
    indexItems: synchronizedItems,
    totalPages,
    pendingCount,
  };
}
