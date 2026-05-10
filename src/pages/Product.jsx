import { useParams, Link } from 'react-router-dom'
import products from '../data/products.json'
import { getImage } from '../data/productImages'
import RedirectButton from '../components/RedirectButton'

const productMap = Object.fromEntries(products.map((p) => [p.slug, p]))

export default function Product() {
  const { slug } = useParams()
  const product = productMap[slug]

  if (!product) {
    return (
      <main className="pt-32 px-6 text-center">
        <p className="text-candera-sage">Vessel not found.</p>
        <Link to="/collection" className="text-xs tracking-widest uppercase underline mt-4 inline-block">
          Return to Collection
        </Link>
      </main>
    )
  }

  const img = getImage(product.slug)

  return (
    <main className="pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
          <img src={img} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs text-candera-sage tracking-widest">Vessel {product.vessel}</span>
            <h1 className="font-serif text-4xl text-candera-obsidian mt-2 leading-tight">{product.name}</h1>
            <p className="text-candera-sage-text text-sm mt-3 italic">{product.tagline}</p>
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-candera-obsidian/80 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          {/* Scent profile */}
          <div className="border-t border-candera-stone/40 pt-6">
            <p className="text-xs tracking-widest uppercase text-candera-sage mb-3">Scent Profile</p>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {Object.entries(product.scent_profile).map(([tier, note]) => (
                <div key={tier} className="border border-candera-stone/40 p-3">
                  <dt className="text-[10px] tracking-widest uppercase text-candera-sage mb-1">{tier}</dt>
                  <dd className="text-xs text-candera-obsidian">{note}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            <p className="text-xs tracking-widest uppercase text-candera-sage mb-3">Fragrance Notes</p>
            <div className="flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span key={note} className="text-xs px-3 py-1 border border-candera-stone text-candera-obsidian">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            <p className="text-xs tracking-widest uppercase text-candera-sage mb-3">Details</p>
            <ul className="flex flex-col gap-1">
              {product.details.map((d) => (
                <li key={d} className="text-xs text-candera-obsidian/70">{d}</li>
              ))}
            </ul>
            <p className="text-xs text-candera-sage mt-2">
              Burn time: {product.metadata.burn_time} · Batch {product.metadata.batch}
            </p>
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-2xl text-candera-obsidian">${product.price.toFixed(2)}</span>
            </div>
            <RedirectButton url={product.etsy_link} />
          </div>
        </div>
      </div>

      <div className="border-t border-candera-stone/40 px-6 md:px-16 py-8 text-center">
        <Link to="/collection" className="text-xs tracking-widest uppercase text-candera-sage hover:text-candera-obsidian transition-colors">
          ← Return to Collection
        </Link>
      </div>
    </main>
  )
}
