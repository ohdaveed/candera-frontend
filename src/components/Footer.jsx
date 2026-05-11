import { Link } from 'react-router-dom'
import { Camera, MessageSquare, Globe, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-24 px-6 md:px-12 bg-[#FDFBF7] border-t border-stone-200">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
        {/* Brand */}
        <div className="col-span-2 space-y-8">
          <Link to="/" className="text-3xl font-serif font-bold tracking-tighter text-stone-900 hover:opacity-70 transition-opacity">
            CANDERA
          </Link>
          <p className="text-stone-500 max-w-sm text-sm leading-relaxed font-light italic">
            Cultivating intentional living through scent and micro-batch artisanry. Based in the high desert, shared everywhere.
          </p>
          <div className="flex gap-6 text-stone-400">
            <a href="https://www.instagram.com/canderacandles" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Camera size={20} className="hover:text-stone-900 transition-colors" />
            </a>
            <a href="https://www.etsy.com/shop/CanderaCandles" target="_blank" rel="noopener noreferrer" aria-label="Etsy shop">
              <MessageSquare size={20} className="hover:text-stone-900 transition-colors" />
            </a>
            <a href="https://candera.co" target="_blank" rel="noopener noreferrer" aria-label="Website">
              <Globe size={20} className="hover:text-stone-900 transition-colors" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-stone-400">Navigation</h5>
          <ul className="text-stone-600 text-xs space-y-4 font-semibold">
            <li>
              <Link to="/collection" className="hover:text-candera-warm transition-colors">Current Batch</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-candera-warm transition-colors">The Craft</Link>
            </li>
            <li>
              <Link to="/inner-circle" className="hover:text-candera-warm transition-colors">Inner Circle</Link>
            </li>
            <li>
              <a
                href="https://www.etsy.com/shop/CanderaCandles"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-candera-warm transition-colors flex items-center gap-1"
              >
                View All on Etsy <ExternalLink size={10} />
              </a>
            </li>
          </ul>
        </div>

        {/* Assistance */}
        <div className="space-y-6">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-stone-400">Assistance</h5>
          <ul className="text-stone-600 text-xs space-y-4 font-semibold">
            <li className="hover:text-candera-warm cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-candera-warm cursor-pointer transition-colors">Wholesale</li>
            <li>
              <Link to="/inner-circle" className="hover:text-candera-warm transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
        <p>© 2024 Candera Studio. All rights reserved.</p>
        <div className="flex gap-8">
          <span className="hover:text-stone-900 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-stone-900 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}
