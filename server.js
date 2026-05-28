import express from "express";
import { createHash, randomBytes } from "node:crypto";

const AUTH_URL = "https://www.etsy.com/oauth/connect";
const TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const PING_URL = "https://api.etsy.com/v3/application/openapi-ping";
const USER_URL = "https://api.etsy.com/v3/application/users";

const app = express();

let latestVerifier = "";
let latestState = "";

function base64URLEncode(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAuthUrl() {
  const keystring = process.env.ETSY_KEYSTRING || "";
  const redirectUri = process.env.ETSY_REDIRECT_URI || "http://localhost:3003/oauth/redirect";
  const scopes = process.env.ETSY_SCOPES || "email_r";

  latestVerifier = base64URLEncode(randomBytes(32));
  latestState = base64URLEncode(randomBytes(16));

  const codeChallenge = base64URLEncode(sha256(latestVerifier));
  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("client_id", keystring);
  url.searchParams.set("state", latestState);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return {
    codeChallenge,
    state: latestState,
    url: url.toString(),
    verifier: latestVerifier,
  };
}

app.get("/ping", async (req, res) => {
  const keystring = process.env.ETSY_KEYSTRING || "";
  const sharedSecret = process.env.ETSY_SHARED_SECRET || "";

  if (!keystring || !sharedSecret) {
    res.status(500).send("ETSY_KEYSTRING and ETSY_SHARED_SECRET must be set");
    return;
  }

  const response = await fetch(PING_URL, {
    method: "GET",
    headers: {
      "x-api-key": `${keystring}:${sharedSecret}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    res.json(data);
    return;
  }

  const body = await response.text().catch(() => "");
  res.status(response.status).send(body || "oops");
});

app.get("/", (req, res) => {
  const auth = buildAuthUrl();

  res.type("html").send(`
    <!DOCTYPE html>
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
          <p>Generate a fresh PKCE verifier and challenge, then start Etsy authorization from this local helper.</p>
          <a class="button" href="${escapeHtml(auth.url)}">Authenticate with Etsy</a>
          <div class="grid">
            <section class="card"><strong>State</strong><pre>${escapeHtml(auth.state)}</pre></section>
            <section class="card"><strong>Code verifier</strong><pre>${escapeHtml(auth.verifier)}</pre></section>
            <section class="card"><strong>Code challenge</strong><pre>${escapeHtml(auth.codeChallenge)}</pre></section>
            <section class="card"><strong>Full URL</strong><pre>${escapeHtml(auth.url)}</pre></section>
          </div>
          <p>Use this helper only for local/manual flows. The app route remains <code>/api/etsy/oauth/authorize</code>.</p>
        </main>
      </body>
    </html>
  `);
});

app.get("/oauth/redirect", async (req, res) => {
  const authCode = req.query.code;
  const returnedState = req.query.state;
  const oauthError = req.query.error;
  const oauthErrorDescription = req.query.error_description;

  if (oauthError) {
    res.status(400).send(escapeHtml(oauthErrorDescription || oauthError));
    return;
  }

  if (!authCode || !returnedState) {
    res.status(400).send("Missing code or state");
    return;
  }

  if (!latestVerifier || returnedState !== latestState) {
    res.status(400).send("State mismatch or missing PKCE verifier. Restart the flow from /");
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING || "";
  const redirectUri = process.env.ETSY_REDIRECT_URI || "http://localhost:3003/oauth/redirect";

  if (!keystring) {
    res.status(500).send("ETSY_KEYSTRING must be set");
    return;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: keystring,
      redirect_uri: redirectUri,
      code: String(authCode),
      code_verifier: latestVerifier,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.status(502).send(`Token exchange failed (${response.status}): ${escapeHtml(body)}`);
    return;
  }

  const tokenData = await response.json();
  res.setHeader("Set-Cookie", "access_token=" + tokenData.access_token + "; HttpOnly; SameSite=Lax; Path=/");
  res.redirect("/welcome");
});

app.get("/welcome", async (req, res) => {
  const accessToken = latestAccessToken;
  const clientID = process.env.ETSY_KEYSTRING || "";

  if (!accessToken) {
    res.status(400).send("No active OAuth session — visit / to start the flow");
    return;
  }

  const rawUserId = String(accessToken).split(".")[0];
  if (!/^\d+$/.test(rawUserId)) {
    res.status(400).send("Invalid access_token format");
    return;
  }
  const userId = rawUserId;
  const response = await fetch(`${USER_URL}/${encodeURIComponent(userId)}`, {
    headers: {
      "x-api-key": clientID,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.status(502).send(`User lookup failed (${response.status}): ${escapeHtml(body)}`);
    return;
  }

  const userData = await response.json();
  res.type("html").send(`
    <!DOCTYPE html>
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
            <p>The OAuth exchange succeeded and Etsy returned a valid access token.</p>
          </div>
        </main>
      </body>
    </html>
  `);
});

const port = Number.parseInt(process.env.PORT || "3003", 10);

app.listen(port, () => {
  console.log(`Etsy helper server listening at http://localhost:${port}`);
});
