import crypto from "node:crypto";

export default function handler(req, res) {
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    scope: "repo user",
    state,
  });
  const redirectUrl = `https://github.com/login/oauth/authorize?${params}`;

  const cookie = `_csrf_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`;

  if (typeof res.redirect === "function") {
    res.setHeader("Set-Cookie", cookie);
    res.redirect(redirectUrl);
  } else {
    res.setHeader("Set-Cookie", cookie);
    res.writeHead(307, { Location: redirectUrl, "Set-Cookie": cookie });
    res.end();
  }
}
