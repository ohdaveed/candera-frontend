# Etsy API v3 Backend Logic Fix - Design Spec

**Date:** 2026-05-26
**Status:** Approved
**Topic:** etsy-backend-logic-fix

## 1. Objective

Align the Etsy backend proxy logic with the Etsy API v3 requirements to fix authentication failures and ensure product images are correctly retrieved.

## 2. Problem Statement

The current Etsy integration in `api/etsy/listings.js` fails because:

1. It only provides the `keystring` in the `x-api-key` header, whereas v3 requires `keystring:shared_secret`.
2. The `includes` parameter uses lowercase `images`, which is case-sensitive in v3 and must be `Images`.

## 3. Proposed Changes

### 3.1 Backend Proxy (`api/etsy/listings.js`)

- **Authentication Header:** Update the `x-api-key` header to use the format `${process.env.ETSY_KEYSTRING}:${process.env.ETSY_SHARED_SECRET}`.
- **Request Parameters:** Update the `includes` query parameter from `images` to `Images`.
- **Environment Variables:**
  - Use `ETSY_SHARED_SECRET` (new).
  - Ensure `ETSY_KEYSTRING` and `ETSY_SHOP_ID` are still correctly utilized.

### 3.2 Environment Configuration

- Update `.env.example` to include `ETSY_SHARED_SECRET`.

## 4. Architecture & Data Flow

1. **Frontend:** Calls `/api/etsy/listings`.
2. **Backend Proxy:**
   - Construct request to `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active?includes=Images&limit=${ETSY_LISTINGS_LIMIT}`.
   - Add header `x-api-key: ${ETSY_KEYSTRING}:${ETSY_SHARED_SECRET}`.
   - Fetch and normalize the response.
3. **Frontend:** Receives normalized product data, including image URLs.

## 5. Security Considerations

- The `ETSY_SHARED_SECRET` is never exposed to the client.
- The proxy strictly handles `GET` requests to public endpoints.

## 6. Testing Strategy

- **Manual Verification:** Verify that the proxy returns a 200 OK with valid product data and images when the correct environment variables are set.
- **E2E Test:** Run `npx playwright test` to ensure the integration is verified by the automated test suite (after resolving the Playwright environment issue).

## 7. Success Criteria

- The `/api/etsy/listings` endpoint returns active listings with image URLs.
- Authentication errors (401/403) are resolved.
- Product images are visible on the frontend.
