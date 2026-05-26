# Etsy API v3 Backend Logic Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Etsy backend proxy logic with the Etsy API v3 requirements to fix authentication failures and ensure product images are correctly retrieved.

**Architecture:** Update the Vercel API function to use the combined `keystring:shared_secret` header and the capitalized `Images` parameter.

**Tech Stack:** Node.js, Vercel Functions, Playwright (for verification).

---

### Task 1: Fix Playwright Environment

**Files:**

- None (Environment setup)

- [ ] **Step 1: Install Playwright browsers**

Run: `npx playwright install chromium`
Expected: Playwright downloads the necessary browser binaries.

---

### Task 2: Update Environment Documentation

**Files:**

- Modify: `.env.example`

- [ ] **Step 1: Add ETSY_SHARED_SECRET to .env.example**

```javascript
// Add after ETSY_KEYSTRING
ETSY_SHARED_SECRET = your_etsy_shared_secret_here;
```

- [ ] **Step 2: Commit**

Run: `git add .env.example && git commit -m "docs: add ETSY_SHARED_SECRET to .env.example"`

---

### Task 3: Update Etsy Proxy Logic

**Files:**

- Modify: `api/etsy/listings.js`

- [ ] **Step 1: Update fetchActiveEtsyListings function**

Modify the headers and endpoint URL construction in `api/etsy/listings.js`.

```javascript
// api/etsy/listings.js

const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET || ""; // Add this

// Inside fetchActiveEtsyListings()
const endpoint = new URL(
  `https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active`,
);
endpoint.searchParams.set("limit", String(ETSY_LISTINGS_LIMIT));
endpoint.searchParams.set("includes", "Images"); // Change from "images" to "Images"

const response = await fetch(endpoint, {
  headers: {
    "x-api-key": `${ETSY_KEYSTRING}:${ETSY_SHARED_SECRET}`, // Change format
  },
});
```

- [ ] **Step 2: Commit**

Run: `git add api/etsy/listings.js && git commit -m "fix: align Etsy proxy with v3 API requirements"`

---

### Task 4: Verification

**Files:**

- Test: `e2e/etsy-integration.spec.js`

- [ ] **Step 1: Run E2E tests**

Run: `npm run test:e2e`
Expected: The Etsy integration test passes (assuming local env vars are set).

- [ ] **Step 2: Verify normalization logic**

Ensure `normalizeListing` in `api/etsy/listings.js` correctly handles the `Images` array from the v3 response. (The current logic already checks `listing?.images?.[0]`, which should be fine if the API returns it under that key, but we'll confirm).

---
