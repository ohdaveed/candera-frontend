# Changelog

All notable changes to this project are documented in this file.

## Unreleased

- etsy: retry on 429 + improve image/url fallbacks; prefer non-empty tagline (#23) — Adds retry/backoff for Etsy API 429 responses, expands image and URL fallback logic in the Etsy proxy, and prefers a non-empty listing `tagline` before falling back to a generated tagline. Tests pass locally. (2026-05-30)
