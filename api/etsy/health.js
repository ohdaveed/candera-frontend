import { getAccessToken, getLastTokenInfo } from "./lib/token.js";
import { apiUrl } from "./config.js";

function maskKey(keystring, shared) {
  const clientId = keystring
    ? keystring.includes(":")
      ? keystring.split(":")[0]
      : keystring
    : null;
  const hasSecretInKey = !!(keystring && keystring.includes(":"));
  const hasShared = !!shared && shared.length > 0;
  return {
    clientId,
    hasSecretInKey,
    hasShared,
    mode: hasSecretInKey ? "full" : hasShared ? "constructed" : "client-only",
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({ error: "Method not allowed" });
    return;
  }

  const keystring = (process.env.ETSY_KEYSTRING || "").trim();
  const shared = (process.env.ETSY_SHARED_SECRET || "").trim();
  const shopEnv = (process.env.ETSY_SHOP_ID || "").trim();

  const keyInfo = maskKey(keystring, shared);

  // Build x-api-key header value without ever echoing the shared secret back
  const xApiKey = keyInfo.hasSecretInKey
    ? keystring
    : keyInfo.hasShared
      ? `${keyInfo.clientId}:${shared}`
      : keyInfo.clientId;

  let token;
  try {
    token = await getAccessToken().catch(() => null);
  } catch {
    token = null;
  }

  const headers = {};
  if (xApiKey) headers["x-api-key"] = xApiKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const out = {
    ok: true,
    key: {
      client_id: keyInfo.clientId || null,
      has_secret_in_key: keyInfo.hasSecretInKey,
      has_shared_secret_env: keyInfo.hasShared,
      mode: keyInfo.mode,
    },
    token: { present: !!token, info: null },
    token_owner: null,
    shop: null,
    listings_sample: null,
    warnings: [],
  };

  // helper to safe fetch and parse JSON
  async function safeFetchJson(url, h) {
    try {
      const r = await fetch(url, { headers: h });
      const txt = await r.text().catch(() => "");
      try {
        return { status: r.status, json: JSON.parse(txt) };
      } catch {
        return { status: r.status, text: txt };
      }
    } catch (e) {
      return { error: e.message };
    }
  }

  // whoami
  const whoami = await safeFetchJson(apiUrl("/v3/application/users/me"), headers);
  if (whoami && whoami.json && whoami.status === 200) {
    out.token_owner = {
      user_id: whoami.json.user_id || null,
      shop_id: whoami.json.shop_id || null,
    };
  } else if (whoami && whoami.status) {
    out.warnings.push(`users/me returned status ${whoami.status}`);
  } else if (whoami && whoami.error) {
    out.warnings.push(`users/me fetch error: ${whoami.error}`);
  }

  // determine shop id to inspect
  const shopToCheck = out.token_owner?.shop_id || shopEnv || null;
  if (shopToCheck) {
    const shopRes = await safeFetchJson(apiUrl(`/v3/application/shops/${shopToCheck}`), headers);
    if (shopRes && shopRes.json && shopRes.status === 200) {
      out.shop = {
        shop_id: shopRes.json.shop_id || null,
        shop_name: shopRes.json.shop_name || null,
        listing_active_count: shopRes.json.listing_active_count || null,
      };
    } else if (shopRes && shopRes.status) {
      out.warnings.push(`shop metadata returned status ${shopRes.status}`);
    }

    // fetch a small sample of active listings to inspect count/visibility
    const listRes = await safeFetchJson(
      apiUrl(`/v3/application/shops/${shopToCheck}/listings/active?limit=10&includes=Images`),
      headers,
    );
    if (listRes && listRes.json && listRes.status === 200) {
      out.listings_sample = (listRes.json.results || [])
        .slice(0, 5)
        .map((r) => ({ listing_id: r.listing_id, state: r.state, title: r.title }));
      out.listings_count = Array.isArray(listRes.json.results) ? listRes.json.results.length : null;
    } else if (listRes && listRes.status) {
      out.warnings.push(`listings returned status ${listRes.status}`);
    } else if (listRes && listRes.error) {
      out.warnings.push(`listings fetch error: ${listRes.error}`);
    }
  }

  // mask any long values
  if (!out.key.client_id) out.warnings.push("No ETSY_KEYSTRING client id found in environment");
  if (!out.token.present)
    out.warnings.push("No access token available (token refresh may be missing or failing)");

  // include token info/scopes if available
  try {
    const info = getLastTokenInfo();
    if (info) {
      out.token.info = {
        scope: info.scope || info.scopes || null,
        expires_in: info.expires_in || null,
      };
      const scopesRaw = info.scope || info.scopes || "";
      const scopes = (scopesRaw || "").toString().split(/\s+/).filter(Boolean);
      if (!scopes.includes("listings_r")) {
        out.warnings.push("Token does not include listings_r scope — reauthorize with listings_r");
      }
    }
  } catch {
    // ignore
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.statusCode = 200;
  res.end(JSON.stringify(out, null, 2));
}
