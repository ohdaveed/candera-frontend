import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  PARSE_STATUS,
  createInitialExhibitState,
  exhibitReducer,
  selectExhibitPanels,
} from "./store";

const WORKER_FAILURE_MESSAGE = "Parser worker stopped unexpectedly";

function createItemFromFile(file) {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;

  return {
    id,
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    fileSize: file.size,
    timestamp: new Date(file.lastModified || Date.now()).toISOString(),
    pageFootprint: 1,
    parseStatus: PARSE_STATUS.PENDING,
  };
}

function createFootprintWorker(dispatch, onFailure) {
  const worker = new Worker(new URL("./footprintWorker.js", import.meta.url), {
    type: "module",
  });

  worker.onmessage = (event) => {
    const { fileId, success, pageCount, error } = event.data;
    dispatch({
      type: "item/update",
      id: fileId,
      patch: success
        ? {
            pageFootprint: pageCount,
            parseStatus: PARSE_STATUS.READY,
            parseError: null,
          }
        : {
            pageFootprint: 1,
            parseStatus: PARSE_STATUS.ERROR,
            parseError: error,
          },
    });
  };

  worker.onerror = () => {
    worker.terminate();
    onFailure();
    dispatch({
      type: "items/mark-active-parse-error",
      error: WORKER_FAILURE_MESSAGE,
    });
  };

  worker.onmessageerror = () => {
    worker.terminate();
    onFailure();
    dispatch({
      type: "items/mark-active-parse-error",
      error: WORKER_FAILURE_MESSAGE,
    });
  };

  return worker;
}

export function useExhibitSync() {
  const [state, dispatch] = useReducer(exhibitReducer, undefined, createInitialExhibitState);
  const workerRef = useRef(null);

  useEffect(() => {
    const worker = createFootprintWorker(dispatch, () => {
      workerRef.current = null;
    });
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList ?? []);
    const items = files.map(createItemFromFile);
    dispatch({ type: "items/add", items });

    for (const [index, file] of files.entries()) {
      const item = items[index];
      dispatch({
        type: "item/update",
        id: item.id,
        patch: { parseStatus: PARSE_STATUS.PARSING },
      });
      if (!workerRef.current) {
        workerRef.current = createFootprintWorker(dispatch, () => {
          workerRef.current = null;
        });
      }

      try {
        workerRef.current.postMessage({ fileId: item.id, blob: file });
      } catch (error) {
        dispatch({
          type: "item/update",
          id: item.id,
          patch: {
            pageFootprint: 1,
            parseStatus: PARSE_STATUS.ERROR,
            parseError: error instanceof Error ? error.message : WORKER_FAILURE_MESSAGE,
          },
        });
      }
    }
  }, []);

  const updateTimestamp = useCallback((id, timestamp) => {
    dispatch({
      type: "item/update",
      id,
      patch: { timestamp },
    });
  }, []);

  const updatePageFootprint = useCallback((id, pageFootprint) => {
    dispatch({
      type: "item/update",
      id,
      patch: {
        pageFootprint,
        parseStatus: PARSE_STATUS.READY,
        parseError: null,
      },
    });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: "item/remove", id });
  }, []);

  const clearItems = useCallback(() => {
    dispatch({ type: "items/clear" });
  }, []);

  const panels = useMemo(() => selectExhibitPanels(state), [state]);

  return {
    state,
    panels,
    addFiles,
    updateTimestamp,
    updatePageFootprint,
    removeItem,
    clearItems,
  };
}
