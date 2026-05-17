import { useCallback, useEffect, useMemo, useState } from 'react'
import localProducts from '../data/products.json'

const legacyProductsApiUrl = import.meta.env.VITE_PRODUCTS_API_URL
const etsyBackendUrl = import.meta.env.VITE_ETSY_BACKEND_URL
const etsyProductsEndpoint = import.meta.env.VITE_ETSY_PRODUCTS_ENDPOINT || '/api/etsy/listings'
const etsyBackendApiKey = import.meta.env.VITE_ETSY_BACKEND_API_KEY
const etsyShopUrl = import.meta.env.VITE_ETSY_SHOP_URL || 'https://www.etsy.com/shop/CanderaCandles'
// Keep the baseline aligned with the existing catalog price point.
const DEFAULT_PRICE = 38
// Prime multipliers reduce repeated overlap when synthesizing fallback map positions.
const SENSORY_X_MULTIPLIER = 17
const SENSORY_Y_MULTIPLIER = 29
const SENSORY_COORDINATE_MAX = 100
const MAX_TAGLINE_LENGTH = 140

function resolveProductsApiUrl() {
  if (legacyProductsApiUrl) return legacyProductsApiUrl
  if (!etsyBackendUrl) return null
  try {
    return new URL(etsyProductsEndpoint, etsyBackendUrl).toString()
  } catch {
    return null
  }
}

function toSlug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toPrice(value) {
  function asValidPrice(candidate) {
    return Number.isFinite(candidate) && candidate >= 0 ? candidate : DEFAULT_PRICE
  }

  if (typeof value === 'number') return asValidPrice(value)
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''))
    return asValidPrice(parsed)
  }
  if (value && typeof value.amount !== 'undefined') {
    const amount = Number(value.amount)
    const divisor = Number(value.divisor || 1)
    if (Number.isFinite(amount) && Number.isFinite(divisor) && divisor > 0) {
      return asValidPrice(amount / divisor)
    }
  }
  return DEFAULT_PRICE
}

function getEtsyId(listing) {
  if (listing?.etsy_id) return String(listing.etsy_id)
  if (listing?.listing_id) return String(listing.listing_id)
  return null
}

function toProductShape(listing, index) {
  const name = String(listing?.name ?? listing?.title ?? `Product ${index + 1}`)
  const slug = toSlug(listing?.slug ?? name) || `candera-vessel-${index + 1}`
  const id = String(listing?.id ?? listing?.listing_id ?? slug)
  const etsyId = getEtsyId(listing)
  const description = String(listing?.description ?? '')
  const firstSentence = description.split('. ')[0]?.trim()
  const fallbackTagline = firstSentence && firstSentence.length <= MAX_TAGLINE_LENGTH ? firstSentence : 'Handcrafted listing from Etsy.'
  const tags = Array.isArray(listing?.tags) ? listing.tags.filter(Boolean) : []
  const notes = Array.isArray(listing?.notes) ? listing.notes : tags.slice(0, 4)
  const metadata = listing?.metadata ?? {}
  const scentProfile = listing?.scent_profile ?? {}

  return {
    id,
    slug,
    name,
    vessel: String(listing?.vessel ?? metadata.batch ?? String(index + 1).padStart(3, '0')),
    price: toPrice(listing?.price),
    tagline: listing?.tagline ?? fallbackTagline,
    description,
    scent_profile: {
      top: scentProfile.top ?? tags[0] ?? 'Top notes',
      heart: scentProfile.heart ?? tags[1] ?? 'Heart notes',
      base: scentProfile.base ?? tags[2] ?? 'Base notes',
    },
    notes: notes.length > 0 ? notes : ['Botanical blend'],
    details: Array.isArray(listing?.details) ? listing.details : ['Hand-poured vessel'],
    metadata: {
      burn_time: metadata.burn_time ?? '—',
      mood: metadata.mood ?? 'Ritual',
      batch: metadata.batch ?? String(index + 1).padStart(3, '0'),
    },
    etsy_id: etsyId,
    image: listing?.image ?? listing?.image_url ?? null,
    etsy_link: listing?.etsy_link ?? listing?.url ?? etsyShopUrl,
    tag: listing?.tag ?? null,
    atmosphere: listing?.atmosphere ?? 'Handcrafted',
    sensory: {
      x: Number.isFinite(listing?.sensory?.x) ? listing.sensory.x : (index * SENSORY_X_MULTIPLIER) % SENSORY_COORDINATE_MAX,
      y: Number.isFinite(listing?.sensory?.y) ? listing.sensory.y : (index * SENSORY_Y_MULTIPLIER) % SENSORY_COORDINATE_MAX,
    },
  }
}

function normalizeProductsPayload(payload) {
  const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.results) ? payload.results : null)
  if (!list) return null
  return list.map((item, index) => toProductShape(item, index))
}

const productsApiUrl = resolveProductsApiUrl()

export function useProductSync() {
  const [products, setProducts] = useState(localProducts)
  const [isLoading, setIsLoading] = useState(Boolean(productsApiUrl))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productsApiUrl) return

    const controller = new AbortController()

    async function fetchProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const headers = etsyBackendApiKey
          ? { 'x-api-key': etsyBackendApiKey }
          : undefined
        const response = await fetch(productsApiUrl, {
          signal: controller.signal,
          headers,
        })

        if (!response.ok) {
          throw new Error(`Product sync failed with ${response.status}`)
        }

        const payload = await response.json()
        const syncedProducts = normalizeProductsPayload(payload)

        if (!syncedProducts) {
          throw new Error('Product sync failed: invalid payload format')
        }
        if (syncedProducts.length === 0) {
          throw new Error('Product sync failed: no products returned')
        }

        setProducts(syncedProducts)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err)
        setProducts(localProducts)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.slug, product])),
    [products],
  )

  const getProductBySlug = useCallback(
    (slug) => productMap[slug] ?? null,
    [productMap],
  )

  return {
    products,
    productMap,
    getProductBySlug,
    isLoading,
    error,
  }
}
