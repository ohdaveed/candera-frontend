import { Link } from 'react-router-dom'
import products from '../data/products.json'
import { getImage } from '../data/productImages'
import SensoryMap from '../components/SensoryMap'

export default function Collection() {
  return (
    <main className="pt-24 px-6 md:px-16 py-16">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">The Studio</p>
        <h1 className="font-serif text-4xl md:text-5xl text-candera-obsidian">Current Collection</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-candera-stone">
        {products.map((candle) => (
          <Link
            key={candle.slug}
            to={`/collection/${candle.slug}`}
            className="group bg-candera-vellum p-8 flex flex-col gap-4 hover:bg-candera-stone/20 transition-colors"
          >
            <div className="aspect-square overflow-hidden mb-2">
              <img
                src={getImage(candle.slug)}
                alt={candle.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-xs text-candera-sage tracking-widest">{candle.vessel}</span>
            <h2 className="font-serif text-lg text-candera-obsidian group-hover:italic transition-all leading-snug">
              {candle.name}
            </h2>
            <p className="text-xs text-candera-sage-text leading-relaxed flex-1">
              {candle.notes.slice(0, 3).join(' · ')}
            </p>
            <span className="text-sm text-candera-obsidian">${candle.price.toFixed(2)}</span>
          </Link>
        ))}
      </div>

      {/* Sensory Map */}
      <div className="mt-24 border-t border-candera-stone/40 pt-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">Explore the Collection</p>
          <h2 className="font-serif text-3xl text-candera-obsidian">Sensory Map</h2>
          <p className="text-sm text-candera-sage-text mt-3 max-w-sm mx-auto">
            Each vessel plotted by mood. Find where your senses lead.
          </p>
        </div>
        <SensoryMap products={products} />
      </div>
    </main>
  )
}
