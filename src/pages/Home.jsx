import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import seashell from '../assets/seashell-garden.jpg'
import meadowlight from '../assets/meadowlight-botanical.jpg'
import crimson from '../assets/crimson-noir.jpg'

const featured = [
  { slug: 'seashell-garden-glow', name: 'Seashell Garden Glow', vessel: '001', note: 'Sea breeze · Driftwood · Salt air', img: seashell },
  { slug: 'meadowlight-botanical', name: 'Meadowlight Botanical', vessel: '002', note: 'Lily of the valley · Wildflower · Fresh green', img: meadowlight },
  { slug: 'crimson-noir', name: 'Crimson Noir', vessel: '003', note: 'Merlot · Dark berry · Vetiver', img: crimson },
]

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6"
        >
          High Desert · Micro-Batch · Hand-Poured
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl text-candera-obsidian leading-tight max-w-3xl mb-8"
        >
          An invitation to<br /><em>slow down</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-candera-sage text-sm max-w-md leading-relaxed mb-12"
        >
          Each vessel is numbered, cured in the studio, and made from peak botanical ingredients. Scent as a spiritual practice.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/collection"
            className="px-8 py-3 bg-candera-obsidian text-candera-vellum text-xs tracking-widest uppercase hover:bg-candera-obsidian/80 transition-colors"
          >
            Enter the Studio
          </Link>
          <Link
            to="/quiz"
            className="px-8 py-3 border border-candera-obsidian text-candera-obsidian text-xs tracking-widest uppercase hover:bg-candera-obsidian hover:text-candera-vellum transition-colors"
          >
            Find Your Ritual
          </Link>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="w-px h-16 bg-candera-stone mx-auto" />

      {/* Featured */}
      <section className="px-6 md:px-16 py-24">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage text-center mb-16">Current Batch</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-candera-stone">
          {featured.map((candle) => (
            <Link
              key={candle.slug}
              to={`/collection/${candle.slug}`}
              className="group bg-candera-vellum p-10 flex flex-col gap-4 hover:bg-candera-stone/20 transition-colors"
            >
              <div className="aspect-square overflow-hidden mb-2">
              <img src={candle.img} alt={candle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
              <span className="text-xs text-candera-sage tracking-widest">{candle.vessel}</span>
              <h2 className="font-serif text-xl text-candera-obsidian group-hover:italic transition-all">{candle.name}</h2>
              <p className="text-xs text-candera-sage leading-relaxed">{candle.note}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/collection" className="text-xs tracking-widest uppercase text-candera-obsidian border-b border-candera-obsidian pb-0.5 hover:text-candera-sage hover:border-candera-sage transition-colors">
            View Full Collection
          </Link>
        </div>
      </section>

      {/* Inner Circle CTA */}
      <section className="px-6 py-24 text-center border-t border-candera-stone/40">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">Limited Access</p>
        <h2 className="font-serif text-3xl text-candera-obsidian mb-4">The Inner Circle</h2>
        <p className="text-candera-sage text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          Each batch is numbered and finite. Collectors receive early access before the studio opens to the public.
        </p>
        <Link
          to="/inner-circle"
          className="text-xs tracking-widest uppercase text-candera-obsidian border-b border-candera-obsidian pb-0.5 hover:text-candera-sage hover:border-candera-sage transition-colors"
        >
          Request Entry
        </Link>
      </section>
    </main>
  )
}
