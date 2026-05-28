const TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key.trim(), rest.join("=")];
    }),
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url, `http://${host}`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    res.statusCode = 400;
    res.json({
      error: oauthError,
      error_description: oauthErrorDescription || "Etsy rejected the authorization request",
    });
    return;
  }

  if (!code || !state) {
    res.statusCode = 400;
    res.json({ error: "Missing code or state" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const pkce = cookies.etsy_pkce;
  if (!pkce) {
    res.statusCode = 400;
    res.json({
      error: "Missing PKCE cookie — restart the OAuth flow at /api/etsy/oauth/authorize",
    });
    return;
  }

  const [codeVerifier, savedState] = pkce.split("|");
  if (state !== savedState) {
    res.statusCode = 400;
    res.json({ error: "State mismatch — possible CSRF" });
    return;
  }

  // Clear the PKCE cookie
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `etsy_pkce=; HttpOnly${secure}; SameSite=Lax; Max-Age=0; Path=/`);

  const keystring = process.env.ETSY_KEYSTRING;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

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

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: keystring,
      redirect_uri: redirectUrl.toString(),
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.statusCode = 502;
    res.json({ error: `Token exchange failed (${response.status}): ${body}` });
    return;
  }

  const tokens = await response.json();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(
    JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
      next_step: "Add ETSY_REFRESH_TOKEN=<refresh_token> to your environment variables.",
    }),
  );
}
