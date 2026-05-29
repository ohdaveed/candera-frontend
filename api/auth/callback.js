export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
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

  const { access_token, error } = await tokenRes.json();

  if (error || !access_token) {
    return res.status(401).send(`OAuth error: ${error ?? "no token returned"}`);
  }

  // Decap CMS expects a postMessage in this exact format
  const payload = JSON.stringify({ token: access_token, provider: "github" });
  const message = `authorization:github:success:${payload}`;

  res.setHeader("Content-Type", "text/html");
  res.send(`<!doctype html>
<html>
<body>
<script>
(function () {
  const message = ${JSON.stringify(message)};
  function receiveMessage(e) {
    window.opener.postMessage(message, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`);
}
