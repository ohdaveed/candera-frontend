const PING_URL = "https://api.etsy.com/v3/application/openapi-ping";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING;
  const sharedSecret = process.env.ETSY_SHARED_SECRET;

  if (!keystring || !sharedSecret) {
    res.statusCode = 500;
    res.json({ error: "ETSY_KEYSTRING and ETSY_SHARED_SECRET must be set" });
    return;
  }

  const response = await fetch(PING_URL, {
    headers: { "x-api-key": `${keystring}:${sharedSecret}` },
  });

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
