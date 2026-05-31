const DEFAULT_BASE = "https://openapi.etsy.com";

export function getApiBase() {
  const env = (process.env.ETSY_API_BASE || "").trim();
  if (env) return env.replace(/\/$/, "");
  return DEFAULT_BASE;
}

export function apiUrl(path) {
  const base = getApiBase();
  if (!path) return base;
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}

export function buildXApiKey(keystring = "") {
  const raw = (keystring || process.env.ETSY_KEYSTRING || "").toString().trim();
  const shared = (process.env.ETSY_SHARED_SECRET || "").toString().trim();
  if (!raw) return "";
  if (raw.includes(":")) return raw;
  return shared ? `${raw}:${shared}` : raw;
}

export function resolveClientId(keystring = "") {
  const raw = (keystring || process.env.ETSY_KEYSTRING || "").toString().trim();
  if (!raw) return "";
  return raw.includes(":") ? raw.split(":")[0].trim() : raw;
}
