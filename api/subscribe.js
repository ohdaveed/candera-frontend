const MAILERLITE_API = 'https://connect.mailerlite.com/api'

const GROUP_IDS = {
  'inner-circle': process.env.MAILERLITE_GROUP_INNER_CIRCLE,
  'seashell-garden-glow': process.env.MAILERLITE_GROUP_SEASHELL,
  'meadowlight-botanical': process.env.MAILERLITE_GROUP_MEADOWLIGHT,
  'crimson-noir': process.env.MAILERLITE_GROUP_CRIMSON_NOIR,
  'ever-after-glow': process.env.MAILERLITE_GROUP_EVER_AFTER,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, name, match } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const groups = [GROUP_IDS['inner-circle']]
  if (match && GROUP_IDS[match]) {
    groups.push(GROUP_IDS[match])
  }

  const response = await fetch(`${MAILERLITE_API}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: { name: name || '' },
      groups: groups.filter(Boolean),
      status: 'active',
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('MailerLite error:', error)
    return res.status(500).json({ error: 'Subscription failed' })
  }

  return res.status(200).json({ ok: true })
}
