const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

const TAG_NAMES = {
  "inner-circle": "Inner Circle",
  "seashell-garden-glow": "Seashell Garden",
  "meadowlight-botanical": "Meadowlight Botanical",
  "crimson-noir": "Crimson Noir",
  "ever-after-glow": "Ever After Glow",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, match } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.error(
      "MailChimp configuration missing: MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID are required",
    );
    return res.status(500).json({ error: "Subscription service is not configured" });
  }

  const tags = [TAG_NAMES["inner-circle"]];
  if (match && TAG_NAMES[match]) {
    tags.push(TAG_NAMES[match]);
  }

  const dc = MAILCHIMP_SERVER_PREFIX || MAILCHIMP_API_KEY?.split("-")[1] || "us1";
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name || "",
      },
      tags: tags.filter(Boolean),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    // If user already exists, we might want to update them or just return success
    if (response.status === 400 && error.title === "Member Exists") {
      return res.status(200).json({ ok: true, message: "Already subscribed" });
    }

    if (response.status === 400) {
      return res.status(400).json({
        error: error.detail || error.title || "Subscription request is invalid",
      });
    }

    console.error("MailChimp error:", error);
    return res.status(500).json({ error: "Subscription failed" });
  }

  return res.status(200).json({ ok: true });
}
