import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-candera-stone/40 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-widest uppercase text-candera-sage">
      <span className="font-serif text-candera-obsidian">Candera</span>
      <nav className="flex gap-8">
        <Link to="/collection" className="hover:text-candera-obsidian transition-colors">Collection</Link>
        <Link to="/ritual" className="hover:text-candera-obsidian transition-colors">Ritual</Link>
        <Link to="/about" className="hover:text-candera-obsidian transition-colors">About</Link>
        <Link to="/inner-circle" className="hover:text-candera-obsidian transition-colors">Inner Circle</Link>
      </nav>
      <span>High Desert · Micro-Batch · Hand-Poured</span>
    </footer>
  )
}
