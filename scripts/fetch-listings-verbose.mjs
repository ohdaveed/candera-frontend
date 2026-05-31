import dotenv from "dotenv";
import { getAccessToken } from "../api/etsy/lib/token.js";

dotenv.config({ path: ".env" });

void (async () => {
  const SHOP = process.argv[2] || process.env.ETSY_SHOP_ID;
  if (!SHOP) {
    console.error("Usage: node fetch-listings-verbose.mjs <shop-id>");
    process.exit(1);
  }
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const SHARED = (process.env.ETSY_SHARED_SECRET || "").trim();
  const CLIENT_ID = KEY.includes(":") ? KEY.split(":")[0] : KEY;
  const xApiKey = KEY.includes(":") ? KEY : SHARED ? `${CLIENT_ID}:${SHARED}` : CLIENT_ID;
  const token = await getAccessToken().catch(() => null);
  const headers = { "x-api-key": xApiKey, accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const url = `${API_BASE}/v3/application/shops/${SHOP}/listings/active?limit=100`;
  console.log("Fetching", url);
  try {
    const res = await fetch(url, { headers });
    console.log("Status:", res.status);
    const txt = await res.text();
    try {
      const json = JSON.parse(txt);
      console.log("Payload keys:", Object.keys(json));
      console.log("Count:", json.count);
      console.log(
        "Results length:",
        Array.isArray(json.results) ? json.results.length : "no results array",
      );
      console.log("Full payload:");
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log("Non-JSON body:", txt.substring(0, 1000));
    }
    console.log("Response headers:");
    for (const [k, v] of res.headers) console.log(k + ":", v);
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
