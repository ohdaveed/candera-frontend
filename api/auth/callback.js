export default async function handler(req, res) {
  const query =
    req.query || Object.fromEntries(new URL(req.url, "http://localhost").searchParams.entries());
  const { code } = query;

  if (!code) {
    res.statusCode = 400;
    res.end("Missing code");
    return;
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenRes.ok) {
    res.statusCode = 500;
    res.end("Failed to fetch access token from GitHub");
    return;
  }

  const { access_token, error } = await tokenRes.json();

  if (error || !access_token) {
    res.statusCode = 401;
    res.end(`OAuth error: ${error ?? "no token returned"}`);
    return;
  }

  const payload = JSON.stringify({ token: access_token, provider: "github" });
  const message = `authorization:github:success:${payload}`;

  res.setHeader("Content-Type", "text/html");
  res.end(`<!doctype html>
<html><body><script>
(function () {
  var message = ${JSON.stringify(message)};
  var targetOrigin = window.location.origin;
  function receiveMessage(e) {
    if (e.origin !== targetOrigin) return;
    window.opener.postMessage(message, targetOrigin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", targetOrigin);
})();
</script></body></html>`);
}
