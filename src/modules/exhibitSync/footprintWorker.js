import { parsePageFootprint } from "./footprintParser";

if (typeof self !== "undefined") {
  self.onmessage = async (event) => {
    const { fileId, blob } = event.data;

    try {
      const pageCount = await parsePageFootprint(blob);
      self.postMessage({ fileId, success: true, pageCount });
    } catch (error) {
      self.postMessage({
        fileId,
        success: false,
        error: error instanceof Error ? error.message : "Unable to parse file footprint",
      });
    }
  };
}
