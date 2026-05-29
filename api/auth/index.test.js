import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import handler from "./index.js";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.GITHUB_OAUTH_CLIENT_ID;
});

function makeRes() {
  const headers = {};
  const res = {
    statusCode: 200,
    _body: null,
    _ended: false,
    _redirectUrl: null,
    redirect(url) {
      this._redirectUrl = url;
    },
    writeHead(code, headerMap) {
      this.statusCode = code;
      Object.assign(headers, headerMap);
      this._headers = headers;
    },
    end(body) {
      this._body = body ?? null;
      this._ended = true;
    },
  };
  res._headers = headers;
  return res;
}

describe("api/auth/index handler", () => {
  describe("redirect behavior", () => {
    it("calls res.redirect when it is a function", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      expect(res._redirectUrl).not.toBeNull();
    });

    it("uses res.writeHead(307) when res.redirect is not a function", () => {
      const req = {};
      const res = makeRes();
      delete res.redirect;
      handler(req, res);
      expect(res.statusCode).toBe(307);
      expect(res._headers["Location"]).toBeDefined();
      expect(res._ended).toBe(true);
    });

    it("uses res.writeHead(307) when res.redirect is not available", () => {
      const req = {};
      const res = makeRes();
      res.redirect = null;
      handler(req, res);
      expect(res.statusCode).toBe(307);
      expect(res._ended).toBe(true);
    });
  });

  describe("redirect URL construction", () => {
    beforeEach(() => {
      process.env.GITHUB_OAUTH_CLIENT_ID = "my-client-id";
    });

    it("redirects to GitHub OAuth authorize endpoint", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      expect(res._redirectUrl).toContain("https://github.com/login/oauth/authorize");
    });

    it("includes client_id from environment variable", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      expect(res._redirectUrl).toContain("client_id=my-client-id");
    });

    it("includes required scope: repo,user", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      // URLSearchParams encodes comma as %2C
      expect(res._redirectUrl).toMatch(/scope=repo(%2C|,)user/);
    });

    it("includes a state parameter for CSRF protection", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      const url = new URL(res._redirectUrl);
      const state = url.searchParams.get("state");
      expect(state).toBeTruthy();
      expect(state.length).toBeGreaterThan(0);
    });

    it("generates a unique state on each invocation", () => {
      const states = new Set();
      for (let i = 0; i < 10; i++) {
        const req = {};
        const res = makeRes();
        handler(req, res);
        const url = new URL(res._redirectUrl);
        states.add(url.searchParams.get("state"));
      }
      // All 10 states should be unique
      expect(states.size).toBe(10);
    });

    it("uses Location header with correct URL in writeHead path", () => {
      const req = {};
      const res = makeRes();
      delete res.redirect;
      handler(req, res);
      const location = res._headers["Location"];
      expect(location).toContain("https://github.com/login/oauth/authorize");
      expect(location).toContain("client_id=my-client-id");
    });
  });

  describe("redirect URL with undefined client_id", () => {
    it("includes client_id param even when env var is not set", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      // The URL should still have client_id param (with undefined value)
      expect(res._redirectUrl).toContain("client_id=");
    });
  });

  describe("synchronous execution", () => {
    it("does not return a promise (is synchronous)", () => {
      const req = {};
      const res = makeRes();
      const result = handler(req, res);
      expect(result).toBeUndefined();
    });
  });
});
