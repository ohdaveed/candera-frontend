# Etsy PR Suggestions

Generated: 2026-05-31T05:16:37.874Z

## Summary

Found 17 suggestions.

## Suggestions

### api/etsy/health.js

- **Issue:** Use shop-scoped scan + batch-hydrate
- **Detail:** Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.

### api/etsy/health.js

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### api/etsy/health.js

- **Issue:** Validate PKCE client_id usage
- **Detail:** Ensure OAuth `client_id` uses the keystring-only (no shared secret) while backend requests use full `x-api-key`.

### api/etsy/helper/index.js

- **Issue:** Validate PKCE client_id usage
- **Detail:** Ensure OAuth `client_id` uses the keystring-only (no shared secret) while backend requests use full `x-api-key`.

### api/etsy/helper/ping.js

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### api/etsy/helper/welcome.js

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### api/etsy/listings.js

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### api/etsy/oauth/callback.js

- **Issue:** Validate PKCE client_id usage
- **Detail:** Ensure OAuth `client_id` uses the keystring-only (no shared secret) while backend requests use full `x-api-key`.

### scripts/check-etsy-listings-fullkey.mjs

- **Issue:** Use shop-scoped scan + batch-hydrate
- **Detail:** Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.

### scripts/check-etsy-listings-fullkey.mjs

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### scripts/check-etsy-listings.mjs

- **Issue:** Use shop-scoped scan + batch-hydrate
- **Detail:** Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.

### scripts/check-etsy-listings.mjs

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### scripts/fetch-listings-verbose.mjs

- **Issue:** Use shop-scoped scan + batch-hydrate
- **Detail:** Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.

### scripts/fetch-listings-verbose.mjs

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### scripts/get-shop-info.mjs

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.

### scripts/test-fetch-with-bearer.mjs

- **Issue:** Use shop-scoped scan + batch-hydrate
- **Detail:** Replace public active-listings scan with `getListingsByShop` then hydrate changed IDs with `/v3/application/listings/batch` to avoid missing non-active listings and to support efficient hydration.

### scripts/whoami.mjs

- **Issue:** Ensure x-api-key includes shared secret when required
- **Detail:** Construct `x-api-key` as `keystring:shared_secret` when ETSY_SHARED_SECRET is present; do not commit secrets.
