import "dotenv/config";
import { getAccessToken } from "../api/etsy/lib/token.js";
import { buildXApiKey } from "../api/etsy/config.js";

void (async () => {
  const token = await getAccessToken();
  if (!token) {
    console.error("No token");
    process.exit(1);
  }
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const xApiKey = buildXApiKey(KEY);

  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const res = await fetch(`${API_BASE}/v3/application/users/me`, {
    headers: { Authorization: `Bearer ${token}`, "x-api-key": xApiKey },
  });
  console.log("Status:", res.status);
  const json = await res.json().catch(() => null);
  console.log(JSON.stringify(json, null, 2));
})();
