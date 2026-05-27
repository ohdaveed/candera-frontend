const TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const EXPIRY_BUFFER_MS = 60 * 1000;

let _accessToken = null;
let _tokenExpiry = 0;

export async function getAccessToken() {
  if (_accessToken && Date.now() < _tokenExpiry) {
    return _accessToken;
  }

  const keystring = process.env.ETSY_KEYSTRING;
  const refreshToken = process.env.ETSY_REFRESH_TOKEN;
  if (!keystring || !refreshToken) return null;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: keystring,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Token refresh failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  _accessToken = data.access_token;
  _tokenExpiry = Date.now() + data.expires_in * 1000 - EXPIRY_BUFFER_MS;
  return _accessToken;
}
