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

        if (!Array.isArray(syncedProducts)) {
          throw new Error('Product sync response must be an array')
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
