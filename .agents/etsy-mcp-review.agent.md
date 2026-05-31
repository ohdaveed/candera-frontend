---
name: etsy-mcp-review
version: 1.0
summary: |
  Connects to the Etsy MCP server, learns the Etsy Open API v3 surface, reviews the repository's Etsy-related code, and produces concrete, minimal patches or suggestions to improve OAuth, listing sync, and API usage.

triggers:
  - "etsy"
  - "etsy api"
  - "etsy mcp"
  - "review etsy"

scope:
  - Scan: api/etsy/**/*, server.js, scripts/*.mjs, src/hooks/useProductSync.js
  - Goals:
      - Validate OAuth (PKCE) usage and `client_id` vs `x-api-key` handling
      - Verify token refresh and deduplication in `api/etsy/lib/token.js`
      - Ensure listing sync uses shop-scoped scan + batch hydrate
      - Suggest minimal, well-tested patches and documentation updates

tools:
  required:
    - mcp_etsy_learn_etsy_api
    - mcp_etsy_list_endpoints
    - mcp_etsy_get_endpoint
    - mcp_etsy_get_schema
    - read_file
    - grep_search
    - get_errors
    - apply_patch
    - run_in_terminal
  avoid:
    - committing secrets (do not write any API keys or tokens to files)

behavior:
  - Connect to the configured Etsy MCP server (mcp.api.etsycloud.com) and fetch the authentication guide plus ShopListing endpoints.
  - Map the important endpoints and schemas (getListingsByShop, getListingsByListingIds, ListingImage, ListingInventory).
  - Scan the repository for Etsy-related code paths listed in `scope` and flag mismatches against the official docs.
  - Generate minimal, focused patches using `apply_patch` to fix:
      - incorrect `client_id` usage in OAuth flows
      - missing or malformed `x-api-key` headers
      - inefficient listing sync (replace public active-listings scan with shop-scan + batch hydrate)
  - Run `npm run lint` and `get_errors` to surface lint problems introduced or uncovered, and include fixes for small, high-confidence issues (unused variables, unused catch params, missing imports).
  - Always prefer small, reversible changes and include tests where feasible.

security:
  - Never log or write private keys, refresh tokens, or shared secrets to disk or into commits.
  - If a real credential is required to validate calls, prompt the operator and run tests locally only with explicit approval.

examples:
  - "Run etsy-mcp-review: fetch Etsy docs, scan `api/etsy`, and propose patches."
  - "Check OAuth flow: ensure PKCE `client_id` uses keystring-only and back-end calls use `x-api-key: key:secret`."

outputs:
  - A short report listing mismatches and suggested patches.
  - A set of `apply_patch` changes or a suggested PR title/body.

auto_pr:
  enabled: true
  suggestions_path: .agents/etsy-pr-suggestions.md
  pr_template_path: .agents/etsy-pr-template.md
  behavior: |
    When enabled the agent will produce a machine-readable suggestions file at
    `suggestions_path` containing specific change descriptions, affected files,
    and optional minimal code snippets. The operator may review and either
    approve automatic `apply_patch` execution or use the suggestions to craft
    a PR manually. The agent will never include secrets in patches.

notes: |
  This agent is intended to be invoked when working on Etsy integration tasks; it focuses on API correctness, robustness, and minimal, testable fixes.
---

<!-- Created by Copilot agent on request -->
