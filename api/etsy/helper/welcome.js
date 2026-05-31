import { buildXApiKey } from "../config.js";

const USER_URL = "https://api.etsy.com/v3/application/users";

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key.trim(), rest.join("=")];
    }),
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const accessToken = cookies.etsy_helper_token;

  if (!accessToken) {
    res.statusCode = 400;
    res.end("No active OAuth session — visit /api/etsy/helper to start the flow");
    return;
  }

  const rawUserId = String(accessToken).split(".")[0];
  if (!/^\d+$/.test(rawUserId)) {
    res.statusCode = 400;
    res.end("Invalid access_token format");
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING;
  const xApiKey = buildXApiKey(keystring || "");
  const response = await fetch(`${USER_URL}/${encodeURIComponent(rawUserId)}`, {
    headers: {
      "x-api-key": xApiKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.statusCode = 502;
    res.end(`User lookup failed (${response.status}): ${escapeHtml(body)}`);
    return;
  }

  const userData = await response.json();

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 32px; background: #0d1117; color: #e6edf3; }
      main { max-width: 720px; margin: 0 auto; }
      .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 24px; margin-top: 16px; }
      p { color: #8b949e; }
    </style>
  </head>
  <body>
    <main>
      <h1>Welcome, ${escapeHtml(userData.first_name || "friend")}!</h1>
      <div class="card">
        <p>OAuth exchange succeeded. Etsy returned a valid access token.</p>
        <p>Copy the <code>refresh_token</code> from the token exchange response and set it as <code>ETSY_REFRESH_TOKEN</code> in your Vercel environment variables.</p>
      </div>
    </main>
  </body>
</html>`);
}
