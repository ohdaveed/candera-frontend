import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { cn } from '../lib/utils'

export default function RedirectButton({ url, className = '', children }) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const redirectTimer = useRef(null)
  const isDisabled = isRedirecting || !url

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        window.clearTimeout(redirectTimer.current)
      }
    }
  }, [])

  function handleClick() {
    if (isDisabled) return

    setIsRedirecting(true)
    redirectTimer.current = window.setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
      setIsRedirecting(false)
      redirectTimer.current = null
    }, 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'group flex items-center justify-center gap-2 transition-all active:scale-95 disabled:cursor-default disabled:opacity-70',
        !isDisabled && 'cursor-pointer',
        className,
      )}
      aria-label={isRedirecting ? 'Opening Etsy' : 'View on Etsy'}
    >
      {isRedirecting ? (
        <span className="text-amber-800 italic animate-pulse text-[10px] uppercase tracking-widest">
          Preparing your vessel...
        </span>
      ) : !url ? (
        <span className="text-[10px] uppercase tracking-widest">
          Etsy listing unavailable
        </span>
      ) : (
        <>
          {children ?? 'View on Etsy Shop'}
          <ExternalLink
            size={11}
            className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
          />
        </>
      )}
    </button>
  )
}
