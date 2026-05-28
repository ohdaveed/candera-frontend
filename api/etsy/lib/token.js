const TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const EXPIRY_BUFFER_MS = 60 * 1000;

let _accessToken = null;
let _tokenExpiry = 0;
let _pendingRefresh = null;

export async function getAccessToken() {
  if (_accessToken && Date.now() < _tokenExpiry) {
    return _accessToken;
  }

  // Deduplicate concurrent refresh calls (important in the Express/server.js context)
  if (_pendingRefresh) return _pendingRefresh;

  const keystring = process.env.ETSY_KEYSTRING;
  const refreshToken = process.env.ETSY_REFRESH_TOKEN;
  if (!keystring || !refreshToken) return null;

  _pendingRefresh = (async () => {
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
    // Guard against missing/non-numeric expires_in to prevent NaN expiry
    _tokenExpiry = Date.now() + (Number(data.expires_in) || 3600) * 1000 - EXPIRY_BUFFER_MS;
    return _accessToken;
  })();

  try {
    return await _pendingRefresh;
  } finally {
    _pendingRefresh = null;
  }
}
