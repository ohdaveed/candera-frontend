import { buildXApiKey } from "../config.js";

const PING_URL = "https://api.etsy.com/v3/application/openapi-ping";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING || "";
  const xApiKey = buildXApiKey(keystring);

  if (!xApiKey || !xApiKey.includes(":")) {
    res.statusCode = 500;
    res.json({
      error:
        "ETSY_KEYSTRING must include the shared secret or set ETSY_SHARED_SECRET in environment",
    });
    return;
  }

  const response = await fetch(PING_URL, { headers: { "x-api-key": xApiKey } });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.statusCode = response.status;
    res.json({ error: body || "Etsy ping failed" });
    return;
  }

  const data = await response.json();
  res.statusCode = 200;
  res.json(data);
}
