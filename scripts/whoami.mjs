import "dotenv/config";
import { getAccessToken } from "../api/etsy/lib/token.js";

void (async () => {
  const token = await getAccessToken();
  if (!token) {
    console.error("No token");
    process.exit(1);
  }
  const KEY = (process.env.ETSY_KEYSTRING || "").trim();
  const SHARED = (process.env.ETSY_SHARED_SECRET || "").trim();
  const CLIENT_ID = KEY.includes(":") ? KEY.split(":")[0] : KEY;
  const xApiKey = KEY.includes(":") ? KEY : SHARED ? `${CLIENT_ID}:${SHARED}` : CLIENT_ID;

  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const res = await fetch(`${API_BASE}/v3/application/users/me`, {
    headers: { Authorization: `Bearer ${token}`, "x-api-key": xApiKey },
  });
  console.log("Status:", res.status);
  const json = await res.json().catch(() => null);
  console.log(JSON.stringify(json, null, 2));
})();
