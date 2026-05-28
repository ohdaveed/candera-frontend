import { createHash, randomBytes } from "node:crypto";

const AUTH_URL = "https://www.etsy.com/oauth/connect";
const COOKIE_MAX_AGE = 600; // 10 minutes

function base64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const keystring = process.env.ETSY_KEYSTRING;
  const redirectUri = process.env.ETSY_REDIRECT_URI;
  const scopes = process.env.ETSY_SCOPES || "listings_r shops_r";

  if (!keystring || !redirectUri) {
    res.statusCode = 500;
    res.json({ error: "ETSY_KEYSTRING and ETSY_REDIRECT_URI must be set" });
    return;
  }

  let redirectUrl;
  try {
    redirectUrl = new URL(redirectUri);
  } catch {
    res.statusCode = 500;
    res.json({ error: "ETSY_REDIRECT_URI must be a valid URL" });
    return;
  }

  if (redirectUrl.protocol !== "https:") {
    res.statusCode = 500;
    res.json({
      error: "ETSY_REDIRECT_URI must use https:// and match the Etsy app redirect URI exactly",
    });
    return;
  }

  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());
  const state = base64url(randomBytes(16));

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `etsy_pkce=${codeVerifier}|${state}; HttpOnly${secure}; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`,
  );

  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", keystring);
  url.searchParams.set("redirect_uri", redirectUrl.toString());
  url.searchParams.set("scope", scopes);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  res.statusCode = 302;
  res.setHeader("Location", url.toString());
  res.end();
}
