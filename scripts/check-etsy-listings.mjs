import dotenv from "dotenv";
import { getAccessToken } from "../api/etsy/lib/token.js";

dotenv.config({ path: ".env" });

void (async () => {
  const SHOP_ID = process.env.ETSY_SHOP_ID;
  console.log("SHOP_ID:", SHOP_ID);
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const CLIENT_ID = KEY.includes(":") ? KEY.split(":")[0] : KEY;
  if (!SHOP_ID || !KEY) {
    console.error("Missing ETSY_SHOP_ID or ETSY_KEYSTRING in .env");
    process.exit(1);
  }

  try {
    const token = await getAccessToken();
    const headers = { "x-api-key": CLIENT_ID };
    console.log("Using client id:", CLIENT_ID);
    console.log("Token present:", !!token, token ? `len=${token.length}` : "");
    if (token) headers.Authorization = `Bearer ${token}`;

    const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
    const url = `${API_BASE}/v3/application/shops/${SHOP_ID}/listings/active?limit=5&includes=Images`;
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
      console.log("Response headers:");
      for (const [k, v] of res.headers) console.log(k + ":", v);
    }
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    process.exit(1);
  }
})();

// Also try fetching shop info to verify token permissions
void (async () => {
  const SHOP_ID = process.env.ETSY_SHOP_ID;
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const CLIENT_ID = KEY.includes(":") ? KEY.split(":")[0] : KEY;
  const token = await getAccessToken().catch(() => null);
  const headers = { "x-api-key": CLIENT_ID };
  if (token) headers.Authorization = `Bearer ${token}`;
  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const shopUrl = `${API_BASE}/v3/application/shops/${SHOP_ID}`;
  try {
    const r = await fetch(shopUrl, { headers });
    console.log("\nShop info status:", r.status);
    const txt = await r.text();
    console.log("Shop body:", txt || "<empty>");
  } catch (e) {
    console.error("Error fetching shop info:", e.message);
  }
})();
