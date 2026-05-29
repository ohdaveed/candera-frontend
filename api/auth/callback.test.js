import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import handler from "./callback.js";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.GITHUB_OAUTH_CLIENT_ID;
  delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
});

function makeRes() {
  const headers = {};
  const res = {
    statusCode: 200,
    _body: null,
    _ended: false,
    setHeader(name, value) {
      headers[name] = value;
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

describe("api/auth/callback handler", () => {
  describe("missing code parameter", () => {
    it("returns 400 when req.query has no code and no URL params", async () => {
      const req = { query: {}, url: "/api/auth/callback" };
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._body).toBe("Missing code");
    });

    it("returns 400 when req.query is undefined and URL has no code", async () => {
      const req = { query: undefined, url: "/api/auth/callback?foo=bar" };
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._body).toBe("Missing code");
    });

    it("returns 400 when code is empty string", async () => {
      const req = { query: { code: "" }, url: "/api/auth/callback" };
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._body).toBe("Missing code");
    });
  });

  describe("code extraction from URL when req.query is absent", () => {
    it("extracts code from URL query string when req.query is undefined", async () => {
      const req = {
        query: undefined,
        url: "/api/auth/callback?code=abc123",
      };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_token", error: undefined }),
      });

      await handler(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GitHub token endpoint failure", () => {
    it("returns 500 when GitHub token endpoint returns non-ok response", async () => {
      const req = { query: { code: "validcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 503,
      });

      await handler(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._body).toBe("Failed to fetch access token from GitHub");
    });

    it("returns 500 when GitHub token endpoint returns 401", async () => {
      const req = { query: { code: "badcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      });

      await handler(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._body).toBe("Failed to fetch access token from GitHub");
    });
  });

  describe("GitHub OAuth error in token response", () => {
    it("returns 401 when GitHub returns an error field", async () => {
      const req = { query: { code: "expiredcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ error: "bad_verification_code", access_token: undefined }),
      });

      await handler(req, res);
      expect(res.statusCode).toBe(401);
      expect(res._body).toContain("OAuth error: bad_verification_code");
    });

    it("returns 401 when GitHub returns no access_token and no error", async () => {
      const req = { query: { code: "strangecode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await handler(req, res);
      expect(res.statusCode).toBe(401);
      expect(res._body).toContain("OAuth error: no token returned");
    });

    it("returns 401 with error message when error is present even if access_token exists", async () => {
      const req = { query: { code: "code" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ error: "some_error", access_token: "gho_token" }),
      });

      await handler(req, res);
      expect(res.statusCode).toBe(401);
      expect(res._body).toContain("OAuth error: some_error");
    });
  });

  describe("successful OAuth flow", () => {
    beforeEach(() => {
      process.env.GITHUB_OAUTH_CLIENT_ID = "test-client-id";
      process.env.GITHUB_OAUTH_CLIENT_SECRET = "test-client-secret";
    });

    it("calls GitHub token endpoint with correct parameters", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://github.com/login/oauth/access_token",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
          body: JSON.stringify({
            client_id: "test-client-id",
            client_secret: "test-client-secret",
            code: "goodcode",
          }),
        }),
      );
    });

    it("sets Content-Type to text/html on success", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);

      expect(res._headers["Content-Type"]).toBe("text/html");
    });

    it("responds with HTML containing postMessage script on success", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);

      expect(res._body).toContain("<!doctype html>");
      expect(res._body).toContain("window.opener.postMessage");
      expect(res._body).toContain("authorizing:github");
    });

    it("embeds access token in message payload", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);

      expect(res._body).toContain("gho_testtoken123");
      // The payload is double-encoded inside JSON.stringify, so quotes are escaped
      expect(res._body).toContain('\\"provider\\":\\"github\\"');
      expect(res._body).toContain("authorization:github:success:");
    });

    it("uses JSON.stringify to safely embed message (XSS prevention)", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      // A token with potentially dangerous characters
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_safe_token" }),
      });

      await handler(req, res);

      // The message is embedded via JSON.stringify, so it will be quoted
      // and not render as raw unescaped HTML content
      expect(res._body).toMatch(/var message = "/);
    });

    it("returns status 200 on success", async () => {
      const req = { query: { code: "goodcode" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("response structure", () => {
    it("ends the response in all error paths", async () => {
      const cases = [{ query: {}, url: "/api/auth/callback" }];

      for (const reqData of cases) {
        const res = makeRes();
        await handler(reqData, res);
        expect(res._ended).toBe(true);
      }
    });

    it("ends the response on GitHub fetch failure", async () => {
      const req = { query: { code: "code" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false });

      await handler(req, res);
      expect(res._ended).toBe(true);
    });

    it("ends the response on OAuth error", async () => {
      const req = { query: { code: "code" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ error: "some_error" }),
      });

      await handler(req, res);
      expect(res._ended).toBe(true);
    });

    it("ends the response on success", async () => {
      const req = { query: { code: "code" }, url: "/api/auth/callback" };
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_token" }),
      });

      await handler(req, res);
      expect(res._ended).toBe(true);
    });
  });
});
