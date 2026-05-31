# Etsy integration improvements

This PR contains suggested improvements to the Etsy integration: OAuth usage, listing sync, and header construction.

Suggested checklist:

- [ ] Verify OAuth `client_id` is keystring-only in `api/etsy/oauth/*`.
- [ ] Ensure backend calls include `x-api-key: keystring:shared_secret` when `ETSY_SHARED_SECRET` is present.
- [ ] Update listing sync to use `getListingsByShop` + `/listings/batch` hydration.
- [ ] Run `npm run lint` and tests.

Files changed:

- (list files and short descriptions here)

Deployment notes:

- No secrets are committed. To test against Etsy, set env vars locally: `ETSY_KEYSTRING`, `ETSY_SHARED_SECRET`, `ETSY_REFRESH_TOKEN`, `ETSY_SHOP_ID`.
