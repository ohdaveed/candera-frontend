import dotenv from "dotenv";
import { getAccessToken } from "../api/etsy/lib/token.js";

dotenv.config({ path: ".env" });

void (async () => {
  const SHOP_ID = process.env.ETSY_SHOP_ID;
  const rawKey = (process.env.ETSY_KEYSTRING || "").trim();
  const shared = (process.env.ETSY_SHARED_SECRET || "").trim();
  if (!SHOP_ID || !rawKey) {
    console.error("Missing ETSY_SHOP_ID or ETSY_KEYSTRING in .env");
    process.exit(1);
  }

  // Build x-api-key: prefer rawKey if it already contains secret, otherwise append shared secret if present
  const xApiKey = rawKey.includes(":") ? rawKey : shared ? `${rawKey}:${shared}` : rawKey;

  try {
    const token = await getAccessToken().catch(() => null);
    const headers = { "x-api-key": xApiKey };
    if (token) headers.Authorization = `Bearer ${token}`;

    const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
    const url = `${API_BASE}/v3/application/shops/${SHOP_ID}/listings/active?limit=5&includes=Images`;
    console.log(
      "Calling Etsy with x-api-key mode:",
      xApiKey.includes(":") ? "key:secret" : "key-only",
    );
    const res = await fetch(url, { headers });
    console.log("Status:", res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log(
        "Results length:",
        Array.isArray(json.results) ? json.results.length : "no results array",
      );
      console.log(JSON.stringify(json.results?.slice(0, 2), null, 2));
    } catch {
      console.log("Non-JSON response body:", text || "<empty>");
    }
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    process.exit(1);
  }
})();
