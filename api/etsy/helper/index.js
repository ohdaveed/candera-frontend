import { createHash, randomBytes } from "node:crypto";

const AUTH_URL = "https://www.etsy.com/oauth/connect";
const COOKIE_MAX_AGE = 600;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING;
  const redirectUri = process.env.ETSY_HELPER_REDIRECT_URI;
  const scopes = process.env.ETSY_SCOPES || "email_r listings_r shops_r";

  if (!keystring || !redirectUri) {
    res.statusCode = 500;
    res.end("ETSY_KEYSTRING and ETSY_HELPER_REDIRECT_URI must be set");
    return;
  }

  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const state = randomBytes(16).toString("base64url");

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `etsy_helper_pkce=${codeVerifier}|${state}; HttpOnly${secure}; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`,
  );

  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", keystring);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  const authUrl = url.toString();

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Etsy OAuth helper</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 32px; background: #0d1117; color: #e6edf3; }
      main { max-width: 900px; margin: 0 auto; }
      .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 20px; margin-top: 16px; }
      a.button { display: inline-block; background: #2f81f7; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 999px; font-weight: 600; }
      pre { white-space: pre-wrap; word-break: break-word; background: #0b1020; border-radius: 12px; padding: 12px; overflow-x: auto; }
      p { color: #8b949e; }
      .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    </style>
  </head>
  <body>
    <main>
      <h1>Etsy OAuth helper</h1>
      <p>A fresh PKCE verifier and challenge have been generated. Click the button to start authorization.</p>
      <a class="button" href="${escapeHtml(authUrl)}">Authenticate with Etsy</a>
      <div class="grid">
        <section class="card"><strong>State</strong><pre>${escapeHtml(state)}</pre></section>
        <section class="card"><strong>Code verifier</strong><pre>${escapeHtml(codeVerifier)}</pre></section>
        <section class="card"><strong>Code challenge</strong><pre>${escapeHtml(codeChallenge)}</pre></section>
        <section class="card"><strong>Full URL</strong><pre>${escapeHtml(authUrl)}</pre></section>
      </div>
      <p>PKCE state is stored in a cookie — keep this tab open until the flow completes.</p>
      <p>Production flow: <code>/api/etsy/oauth/authorize</code> &nbsp;|&nbsp; Ping: <a href="/api/etsy/helper/ping" style="color:#2f81f7">/api/etsy/helper/ping</a></p>
    </main>
  </body>
</html>`);
}
