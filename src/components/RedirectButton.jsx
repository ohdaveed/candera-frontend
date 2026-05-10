import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export default function RedirectButton({ url, className = '', children }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  function handleClick() {
    if (isRedirecting) return
    setIsRedirecting(true)
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
      setIsRedirecting(false)
    }, 1200)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isRedirecting}
      className={`flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 group cursor-pointer disabled:cursor-default ${className}`}
      aria-label={isRedirecting ? 'Opening Etsy…' : 'View on Etsy'}
    >
      {isRedirecting ? (
        <span className="text-amber-800 italic animate-pulse text-[10px] uppercase tracking-widest">
          Preparing your vessel…
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
