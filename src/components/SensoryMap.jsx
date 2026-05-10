import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SensoryMap({ products }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="max-w-2xl mx-auto w-full select-none">
      <div className="relative aspect-square border border-candera-stone/60">
        {/* Axis labels */}
        <span className="absolute top-1/2 left-3 -translate-y-1/2 -rotate-90 text-[10px] tracking-widest uppercase text-candera-sage origin-center whitespace-nowrap">
          Earthy
        </span>
        <span className="absolute top-1/2 right-3 -translate-y-1/2 rotate-90 text-[10px] tracking-widest uppercase text-candera-sage origin-center whitespace-nowrap">
          Floral
        </span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-candera-sage">
          Bright
        </span>
        <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-candera-sage">
          Moody
        </span>

        {/* Center crosshairs */}
        <div className="absolute inset-12 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-candera-stone/40" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-candera-stone/40" />
        </div>

        {/* Product dots — plotted within the inset area */}
        <div className="absolute inset-12 pointer-events-none">
          {products.map((product) => {
            const { x, y } = product.sensory
            // x: 0=Bright(bottom) → 100=Moody(top); y: 0=Floral(right) → 100=Earthy(left)
            // CSS top=0 is the top edge (Moody), so invert x; left=0 is left edge (Earthy), so invert y
            const left = `${100 - y}%`
            const top = `${100 - x}%`

            return (
              <Link
                key={product.slug}
                to={`/collection/${product.slug}`}
                className="absolute pointer-events-auto"
                style={{ left, top, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHovered(product.slug)}
                onMouseLeave={() => setHovered(null)}
                aria-label={product.name}
              >
                <span
                  className={`block w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                    hovered === product.slug
                      ? 'bg-candera-obsidian border-candera-obsidian scale-150'
                      : 'bg-candera-lavender border-candera-lavender'
                  }`}
                />
                {hovered === product.slug && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-candera-obsidian text-candera-vellum text-[10px] tracking-wider px-2 py-1 pointer-events-none">
                    <span className="font-serif">{product.name}</span>
                    <span className="block text-candera-lavender">{product.metadata.mood}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {products.map((product) => (
          <Link
            key={product.slug}
            to={`/collection/${product.slug}`}
            className="flex items-center gap-2 group"
            onMouseEnter={() => setHovered(product.slug)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className={`block w-2 h-2 rounded-full transition-colors ${
                hovered === product.slug ? 'bg-candera-obsidian' : 'bg-candera-lavender'
              }`}
            />
            <span className="text-xs text-candera-sage-text group-hover:text-candera-obsidian transition-colors">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
