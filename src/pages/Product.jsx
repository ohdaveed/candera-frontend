import { useParams, Link } from 'react-router-dom'
import seashell from '../assets/seashell-garden.jpg'
import meadowlight from '../assets/meadowlight-botanical.jpg'
import crimson from '../assets/crimson-noir.jpg'
import everAfter from '../assets/ever-after-glow.jpg'
import anyasEyes from '../assets/anyas-eyes.jpg'
import scarletBloom from '../assets/scarlet-bloom.jpg'

const products = {
  'seashell-garden-glow': {
    name: 'Seashell Garden Glow',
    img: seashell,
    vessel: '001',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/shop/CanderaCandles',
    tagline: 'Bring the calm rhythm of the ocean into your space.',
    description: `This ocean-themed candle captures the fresh, airy scent of a true sea breeze — light, clean, and softly salty, like waves meeting warm sand at sunset.\n\nEach candle is thoughtfully hand-poured using only natural waxes — a blend of natural soy wax and beeswax — for a clean, beautiful burn. It's adorned with real botanicals and natural plants, creating a coastal botanical piece that feels like something gathered by the sea.`,
    notes: ['Sea breeze', 'Driftwood', 'Salt air', 'Warm sand'],
    details: ['15 oz · Soy & beeswax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
  'meadowlight-botanical': {
    name: 'Meadowlight Botanical',
    img: meadowlight,
    vessel: '002',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/shop/CanderaCandles',
    tagline: 'Bring the feeling of a fresh spring morning into your home.',
    description: `The Meadowlight Botanical is hand-poured with natural soy and beeswax and delicately scented with Lily of the Valley — a soft, clean, floral fragrance that feels like sunlight through wildflowers.\n\nEach candle is adorned with real pressed botanicals, creating a romantic cottage garden aesthetic that glows beautifully when lit.`,
    notes: ['Lily of the valley', 'Wildflower', 'Fresh green', 'Morning dew'],
    details: ['15 oz · Soy & beeswax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
  'crimson-noir': {
    name: 'Crimson Noir',
    img: crimson,
    vessel: '003',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/shop/CanderaCandles',
    tagline: 'Step into a deeper, more intimate atmosphere.',
    description: `This candle combines a luxurious scent of ripe berries and velvety wine — not-blaxant of a glass of Merlot, but slightly sweet, and softly intoxicating, filling the space with warmth and depth without overwhelming the senses.\n\nAdorned with deep-toned botanicals, it creates a bold yet refined piece that feels both sensual and grounded.`,
    notes: ['Merlot', 'Dark berry', 'Vetiver', 'Quiet earth'],
    details: ['15 oz · Soy & beeswax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
  'ever-after-glow': {
    name: 'Ever After Glow',
    img: everAfter,
    vessel: '004',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/shop/CanderaCandles',
    tagline: 'A fairy-tale inspired candle that radiates elegance and serenity.',
    description: `Ever After Glow is handcrafted with care, featuring blue hydrangeas and white lilac, soft green stems, and airy spring blossoms — evoking the gentle scent of a blooming garden in full bloom.\n\nPerfect for wedding décor, bridal gifts, romantic evenings, or simply adding a touch of elegance and tranquility to your space.`,
    notes: ['Blue hydrangea', 'White lilac', 'Soft green', 'Spring blossom'],
    details: ['15 oz · Soy & beeswax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
  'anyas-eyes': {
    name: "Anya's Eyes",
    img: anyasEyes,
    vessel: '005',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/listing/4496981320/anyas-eyes-collection-botanical-candle',
    tagline: 'A botanical candle pressed with the quiet beauty of pansies.',
    description: `Anya's Eyes is adorned with real pressed pansies and delicately scented with lilac — soft, powdery, and deeply floral. It captures the feeling of a garden in early bloom, unhurried and full of color.\n\nHand-poured in micro-batches with natural waxes, each vessel is a numbered piece of wearable botanica.`,
    notes: ['Pressed pansy', 'Lilac', 'Soft powder', 'Spring earth'],
    details: ['15 oz · Natural wax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
  'scarlet-bloom': {
    name: 'Scarlet Bloom',
    img: scarletBloom,
    vessel: '006',
    price: '$38',
    etsyUrl: 'https://www.etsy.com/listing/4468801228/scarlet-bloom-botanical-rose-candle',
    tagline: 'Bold botanical florals, grounded in ritual.',
    description: `Scarlet Bloom is a statement vessel — rich red botanicals against natural wax, scented with fresh florals that are present without being overwhelming.\n\nEach candle is hand-poured in limited quantities. The botanicals are selected for their visual integrity as much as their fragrance contribution.`,
    notes: ['Botanical rose', 'Fresh florals', 'Green stem', 'Warm base'],
    details: ['15 oz · Soy & beeswax blend', 'Numbered vessel', 'Micro-batch cured', 'Ships from California'],
  },
}

export default function Product() {
  const { slug } = useParams()
  const product = products[slug]

  if (!product) {
    return (
      <main className="pt-32 px-6 text-center">
        <p className="text-candera-sage">Vessel not found.</p>
        <Link to="/collection" className="text-xs tracking-widest uppercase underline mt-4 inline-block">Return to Collection</Link>
      </main>
    )
  }

  return (
    <main className="pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square overflow-hidden">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs text-candera-sage tracking-widest">Vessel {product.vessel}</span>
            <h1 className="font-serif text-4xl text-candera-obsidian mt-2 leading-tight">{product.name}</h1>
            <p className="text-candera-sage text-sm mt-3 italic">{product.tagline}</p>
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-candera-obsidian/80 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          <div className="border-t border-candera-stone/40 pt-6">
            <p className="text-xs tracking-widest uppercase text-candera-sage mb-3">Fragrance Notes</p>
            <div className="flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span key={note} className="text-xs px-3 py-1 border border-candera-stone text-candera-obsidian">{note}</span>
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
          </div>

          <div className="border-t border-candera-stone/40 pt-6 flex items-center justify-between">
            <span className="font-serif text-2xl text-candera-obsidian">{product.price}</span>
            <a
              href={product.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-candera-obsidian text-candera-vellum text-xs tracking-widest uppercase hover:bg-candera-obsidian/80 transition-colors"
            >
              Acquire on Etsy
            </a>
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
