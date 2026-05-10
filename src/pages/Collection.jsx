import { Link } from 'react-router-dom'
import seashell from '../assets/seashell-garden.jpg'
import meadowlight from '../assets/meadowlight-botanical.jpg'
import crimson from '../assets/crimson-noir.jpg'
import everAfter from '../assets/ever-after-glow.jpg'
import anyasEyes from '../assets/anyas-eyes.jpg'
import scarletBloom from '../assets/scarlet-bloom.jpg'

const candles = [
  { slug: 'seashell-garden-glow', name: 'Seashell Garden Glow', vessel: '001', price: '$38', note: 'Sea breeze · Driftwood · Salt air', img: seashell },
  { slug: 'meadowlight-botanical', name: 'Meadowlight Botanical', vessel: '002', price: '$38', note: 'Lily of the valley · Wildflower · Fresh green', img: meadowlight },
  { slug: 'crimson-noir', name: 'Crimson Noir', vessel: '003', price: '$38', note: 'Merlot · Dark berry · Vetiver', img: crimson },
  { slug: 'ever-after-glow', name: 'Ever After Glow', vessel: '004', price: '$38', note: 'Blue hydrangea · White lilac · Soft green', img: everAfter },
  { slug: 'anyas-eyes', name: "Anya's Eyes", vessel: '005', price: '$38', note: 'Pressed pansies · Lilac · Natural wax', img: anyasEyes },
  { slug: 'scarlet-bloom', name: 'Scarlet Bloom', vessel: '006', price: '$38', note: 'Botanical rose · Fresh florals', img: scarletBloom },
]

export default function Collection() {
  return (
    <main className="pt-24 px-6 md:px-16 py-16">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">The Studio</p>
        <h1 className="font-serif text-4xl md:text-5xl text-candera-obsidian">Current Collection</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-candera-stone">
        {candles.map((candle) => (
          <Link
            key={candle.slug}
            to={`/collection/${candle.slug}`}
            className="group bg-candera-vellum p-8 flex flex-col gap-4 hover:bg-candera-stone/20 transition-colors"
          >
            <div className="aspect-square overflow-hidden mb-2">
              <img src={candle.img} alt={candle.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span className="text-xs text-candera-sage tracking-widest">{candle.vessel}</span>
            <h2 className="font-serif text-lg text-candera-obsidian group-hover:italic transition-all leading-snug">{candle.name}</h2>
            <p className="text-xs text-candera-sage-text leading-relaxed flex-1">{candle.note}</p>
            <span className="text-sm text-candera-obsidian">{candle.price}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
