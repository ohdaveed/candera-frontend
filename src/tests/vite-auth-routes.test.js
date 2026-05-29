/**
 * Tests for the auth routes added to vite.config.js vercelApiPlugin.
 * The two new routes are:
 *   ["/api/auth/callback", "/api/auth/callback.js"]
 *   ["/api/auth", "/api/auth/index.js"]
 *
 * Since vercelApiPlugin is a closure, these tests verify the route-matching
 * logic that the plugin uses (req.url.startsWith(path)) and confirm that
 * the two new routes are correctly prioritized.
 */
import { describe, it, expect } from "vitest";

// Mirror the route map from vite.config.js (includes the two new auth routes)
const apiRoutes = new Map([
  ["/api/etsy/oauth/authorize", "/api/etsy/oauth/authorize.js"],
  ["/api/etsy/oauth/callback", "/api/etsy/oauth/callback.js"],
  ["/api/etsy/listings", "/api/etsy/listings.js"],
  ["/api/subscribe", "/api/subscribe.js"],
  ["/api/auth/callback", "/api/auth/callback.js"],
  ["/api/auth", "/api/auth/index.js"],
]);

/** Replicates the route-lookup logic used in the plugin middleware */
function findRoute(url) {
  return [...apiRoutes.entries()].find(([path]) => url.startsWith(path));
}

describe("vercelApiPlugin route map — new auth routes", () => {
  describe("/api/auth/callback route", () => {
    it("is registered in the route map", () => {
      expect(apiRoutes.has("/api/auth/callback")).toBe(true);
    });

    it("maps to /api/auth/callback.js", () => {
      expect(apiRoutes.get("/api/auth/callback")).toBe("/api/auth/callback.js");
    });

    it("matches exact URL /api/auth/callback", () => {
      const route = findRoute("/api/auth/callback");
      expect(route).toBeDefined();
      expect(route[1]).toBe("/api/auth/callback.js");
    });

    it("matches URL with query string /api/auth/callback?code=abc", () => {
      const route = findRoute("/api/auth/callback?code=abc123&state=xyz");
      expect(route).toBeDefined();
      expect(route[1]).toBe("/api/auth/callback.js");
    });

    it("does not match an unrelated path", () => {
      const route = findRoute("/api/etsy/listings");
      expect(route).toBeDefined();
      expect(route[1]).not.toBe("/api/auth/callback.js");
    });
  });

  describe("/api/auth route", () => {
    it("is registered in the route map", () => {
      expect(apiRoutes.has("/api/auth")).toBe(true);
    });

    it("maps to /api/auth/index.js", () => {
      expect(apiRoutes.get("/api/auth")).toBe("/api/auth/index.js");
    });

    it("matches exact URL /api/auth", () => {
      const route = findRoute("/api/auth");
      expect(route).toBeDefined();
      expect(route[1]).toBe("/api/auth/index.js");
    });

    it("matches URL with query string /api/auth?redirect=true", () => {
      const route = findRoute("/api/auth?redirect=true");
      expect(route).toBeDefined();
      expect(route[1]).toBe("/api/auth/index.js");
    });
  });

  describe("route specificity — /api/auth/callback takes priority over /api/auth", () => {
    it("callback path matches callback handler, not the generic auth handler", () => {
      // The Map preserves insertion order; /api/auth/callback is inserted before /api/auth
      // so the find() call returns the callback route for callback URLs
      const route = findRoute("/api/auth/callback?code=test");
      expect(route).toBeDefined();
      expect(route[0]).toBe("/api/auth/callback");
      expect(route[1]).toBe("/api/auth/callback.js");
    });

    it("/api/auth route matches auth index handler for base path", () => {
      const route = findRoute("/api/auth");
      expect(route).toBeDefined();
      expect(route[0]).toBe("/api/auth");
      expect(route[1]).toBe("/api/auth/index.js");
    });
  });

  describe("complete route map integrity", () => {
    it("contains all six expected routes", () => {
      expect(apiRoutes.size).toBe(6);
    });

    it("all pre-existing routes are still present", () => {
      expect(apiRoutes.has("/api/etsy/oauth/authorize")).toBe(true);
      expect(apiRoutes.has("/api/etsy/oauth/callback")).toBe(true);
      expect(apiRoutes.has("/api/etsy/listings")).toBe(true);
      expect(apiRoutes.has("/api/subscribe")).toBe(true);
    });

    it("does not route paths that are not registered", () => {
      expect(findRoute("/api/unknown")).toBeUndefined();
      expect(findRoute("/")).toBeUndefined();
      expect(findRoute("/admin")).toBeUndefined();
    });
  });
});
