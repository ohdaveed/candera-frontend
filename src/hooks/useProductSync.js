import { useCallback, useEffect, useMemo, useState } from 'react'
import localProducts from '../data/products.json'

const productsApiUrl = import.meta.env.VITE_PRODUCTS_API_URL

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
        const response = await fetch(productsApiUrl, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Product sync failed with ${response.status}`)
        }

        const syncedProducts = await response.json()

        function isValidProduct(p) {
          return (
            typeof p?.slug === 'string' &&
            typeof p?.name === 'string' &&
            typeof p?.price === 'number' &&
            Array.isArray(p?.notes) &&
            typeof p?.metadata?.burn_time === 'string'
          )
        }

        if (!Array.isArray(syncedProducts) || !syncedProducts.every(isValidProduct)) {
          throw new Error('Product sync response has an invalid product shape')
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
