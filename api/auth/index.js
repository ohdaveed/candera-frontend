export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    scope: "repo,user",
    state: Math.random().toString(36).slice(2),
  });
  const redirectUrl = `https://github.com/login/oauth/authorize?${params}`;
  if (typeof res.redirect === "function") {
    res.redirect(redirectUrl);
  } else {
    res.writeHead(307, { Location: redirectUrl });
    res.end();
  }
}
