import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import handler from "../../api/auth/callback.js";

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

function makeReq(url, cookie) {
  return {
    query: undefined,
    url: url ?? "/api/auth/callback",
    headers: { cookie: cookie ?? "" },
  };
}

describe("api/auth/callback handler", () => {
  describe("missing code parameter", () => {
    it("returns 400 when no code and no state cookie", async () => {
      const req = makeReq("/api/auth/callback");
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(403);
      expect(res._body).toContain("Invalid state parameter");
    });

    it("returns 403 when state cookie exists but state param is missing", async () => {
      const req = makeReq("/api/auth/callback?foo=bar", "_csrf_state=valid-state");
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(403);
    });

    it("returns 400 when code is empty string with valid CSRF state", async () => {
      const req = makeReq("/api/auth/callback?code=&state=valid-state", "_csrf_state=valid-state");
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._body).toBe("Missing code");
    });
  });

  describe("CSRF state validation", () => {
    it("returns 403 when state param does not match cookie", async () => {
      const req = makeReq("/api/auth/callback?code=abc&state=wrong", "_csrf_state=expected-state");
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(403);
      expect(res._body).toContain("Invalid state parameter");
    });

    it("returns 403 when cookie is missing but state param is present", async () => {
      const req = makeReq("/api/auth/callback?code=abc&state=some", "");
      const res = makeRes();
      await handler(req, res);
      expect(res.statusCode).toBe(403);
    });
  });

  describe("successful flow with valid CSRF", () => {
    beforeEach(() => {
      process.env.GITHUB_OAUTH_CLIENT_ID = "test-client-id";
      process.env.GITHUB_OAUTH_CLIENT_SECRET = "test-client-secret";
    });

    it("calls GitHub token endpoint with correct parameters", async () => {
      const req = makeReq("/api/auth/callback?code=goodcode&state=match", "_csrf_state=match");
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
      const req = makeReq("/api/auth/callback?code=goodcode&state=match", "_csrf_state=match");
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);
      expect(res._headers["Content-Type"]).toBe("text/html");
    });

    it("responds with HTML containing postMessage script on success", async () => {
      const req = makeReq("/api/auth/callback?code=goodcode&state=match", "_csrf_state=match");
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

    it("returns status 200 on success", async () => {
      const req = makeReq("/api/auth/callback?code=goodcode&state=match", "_csrf_state=match");
      const res = makeRes();

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_testtoken123" }),
      });

      await handler(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
});
