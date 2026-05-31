import dotenv from "dotenv";
import { getAccessToken } from "../api/etsy/lib/token.js";
import { buildXApiKey } from "../api/etsy/config.js";

dotenv.config({ path: ".env" });

void (async () => {
  const SHOP = process.argv[2] || process.env.ETSY_SHOP_ID;
  if (!SHOP) {
    console.error("Usage: node get-shop-info.mjs <shop-id-or-name>");
    process.exit(1);
  }
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const xApiKey = buildXApiKey(KEY);
  const token = await getAccessToken().catch(() => null);
  const headers = { "x-api-key": xApiKey };
  if (token) headers.Authorization = `Bearer ${token}`;

  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const url = `${API_BASE}/v3/application/shops/${SHOP}`;
  try {
    const res = await fetch(url, { headers });
    console.log("Status:", res.status);
    const txt = await res.text();
    try {
      console.log(JSON.stringify(JSON.parse(txt), null, 2));
    } catch {
      console.log("Body:", txt);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
