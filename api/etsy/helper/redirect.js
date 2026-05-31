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
  const url = new URL(req.url, `https://${host}`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    res.statusCode = 400;
    res.end(oauthErrorDescription || oauthError);
    return;
  }

  if (!code || !state) {
    res.statusCode = 400;
    res.end("Missing code or state");
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const pkce = cookies.etsy_helper_pkce;
  if (!pkce) {
    res.statusCode = 400;
    res.end("Missing PKCE cookie — restart the flow at /api/etsy/helper");
    return;
  }

  const [codeVerifier, savedState] = pkce.split("|");
  if (state !== savedState) {
    res.statusCode = 400;
    res.end("State mismatch — possible CSRF");
    return;
  }

  const keystring = (process.env.ETSY_KEYSTRING || "").trim();
  const redirectUri = process.env.ETSY_HELPER_REDIRECT_URI;

  if (!keystring || !redirectUri) {
    res.statusCode = 500;
    res.end("ETSY_KEYSTRING and ETSY_HELPER_REDIRECT_URI must be set");
    return;
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  // Clear PKCE cookie
  res.setHeader("Set-Cookie", [
    `etsy_helper_pkce=; HttpOnly${secure}; SameSite=Lax; Max-Age=0; Path=/`,
  ]);

  const clientId = keystring.includes(":") ? keystring.split(":")[0].trim() : keystring;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    res.statusCode = 502;
    res.end(`Token exchange failed (${response.status}): ${body}`);
    return;
  }

  const tokens = await response.json();

  // Store access token in a short-lived cookie for the welcome page
  res.setHeader("Set-Cookie", [
    `etsy_helper_pkce=; HttpOnly${secure}; SameSite=Lax; Max-Age=0; Path=/`,
    `etsy_helper_token=${tokens.access_token}; HttpOnly${secure}; SameSite=Lax; Max-Age=300; Path=/`,
  ]);

  res.statusCode = 302;
  res.setHeader("Location", "/api/etsy/helper/welcome");
  res.end();
}
