import http from 'node:http'
import { URL } from 'node:url'

const PORT = Number.parseInt(process.env.PORT || '3000', 10)
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const ETSY_KEYSTRING = process.env.ETSY_KEYSTRING || ''
const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET || ''
const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || ''
const ETSY_LISTINGS_LIMIT = Number.parseInt(process.env.ETSY_LISTINGS_LIMIT || '50', 10)

if (!ETSY_KEYSTRING || !ETSY_SHOP_ID) {
  console.error('Missing required server env vars: ETSY_KEYSTRING and ETSY_SHOP_ID.')
  process.exit(1)
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  })
  res.end(JSON.stringify(payload))
}

function normalizeListing(listing) {
  const image = listing?.images?.[0]
  const price = listing?.price
  const amount = Number(price?.amount ?? 0)
  const divisor = Number(price?.divisor ?? 100)

  return {
    id: String(listing?.listing_id ?? ''),
    listing_id: listing?.listing_id,
    title: listing?.title ?? 'Untitled listing',
    description: listing?.description ?? '',
    price: {
      amount: Number.isFinite(amount) ? amount : 0,
      divisor: Number.isFinite(divisor) && divisor > 0 ? divisor : 100,
      currency_code: price?.currency_code || 'USD',
    },
    tags: Array.isArray(listing?.tags) ? listing.tags : [],
    image_url: image?.url_570xN || image?.url_fullxfull || null,
    url: listing?.url || null,
  }
}

async function fetchActiveEtsyListings() {
  if (!ETSY_KEYSTRING) {
    throw new Error('Missing ETSY_KEYSTRING')
  }
  if (!ETSY_SHOP_ID) {
    throw new Error('Missing ETSY_SHOP_ID')
  }

  const endpoint = new URL(`https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings/active`)
  endpoint.searchParams.set('limit', String(ETSY_LISTINGS_LIMIT))
  endpoint.searchParams.set('includes', 'images')

  const response = await fetch(endpoint, {
    headers: {
      'x-api-key': ETSY_KEYSTRING,
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Etsy API request failed (${response.status}): ${body}`)
  }

  const payload = await response.json()
  const results = Array.isArray(payload?.results) ? payload.results : []
  return results.map((listing) => normalizeListing(listing))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, {
      ok: true,
      etsyConfigured: Boolean(ETSY_KEYSTRING && ETSY_SHOP_ID),
    })
  }

  if (req.method === 'GET' && req.url === '/api/etsy/listings') {
    try {
      const listings = await fetchActiveEtsyListings()
      return sendJson(res, 200, { results: listings })
    } catch (error) {
      console.error('[etsy-proxy]', error)
      return sendJson(res, 500, { error: 'Failed to fetch Etsy listings' })
    }
  }

  return sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  if (!ETSY_SHARED_SECRET) {
    console.warn('Missing ETSY_SHARED_SECRET. This is only needed for OAuth flows.')
  }
  console.log(`Node server listening on http://localhost:${PORT}`)
})
