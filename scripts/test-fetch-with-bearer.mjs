import "dotenv/config";
import { getAccessToken } from "../api/etsy/lib/token.js";

void (async () => {
  const token = await getAccessToken();
  if (!token) {
    console.error("No token");
    process.exit(1);
  }
  const API_BASE = (process.env.ETSY_API_BASE || "https://openapi.etsy.com").replace(/\/$/, "");
  const url = `${API_BASE}/v3/application/shops/25894791/listings/active?limit=100&includes=Images`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  console.log("Status:", res.status);
  const json = await res.json().catch(() => null);
  console.log("Body keys:", json ? Object.keys(json) : "non-json");
  if (json) {
    console.log("results len:", (json.results || []).length);
  }
  console.log("Headers:");
  for (const [k, v] of res.headers) console.log(k + ":", v);
})();
