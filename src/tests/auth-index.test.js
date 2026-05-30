import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import handler from "../../api/auth/index.js";

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
    _setCookie: null,
    redirect(url) {
      this._redirectUrl = url;
    },
    setHeader(name, value) {
      headers[name] = value;
      this._headers = headers;
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

    it("sets CSRF cookie on the response", () => {
      const req = {};
      const res = makeRes();
      handler(req, res);
      expect(res._headers["Set-Cookie"]).toContain("_csrf_state=");
      expect(res._headers["Set-Cookie"]).toContain("HttpOnly");
      expect(res._headers["Set-Cookie"]).toContain("SameSite=Lax");
    });

    it("uses res.writeHead(307) when res.redirect is not a function", () => {
      const req = {};
      const res = makeRes();
      delete res.redirect;
      handler(req, res);
      expect(res.statusCode).toBe(307);
      expect(res._headers["Location"]).toBeDefined();
      expect(res._headers["Set-Cookie"]).toContain("_csrf_state=");
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
      expect(states.size).toBe(10);
    });
  });
});
