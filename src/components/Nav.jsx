import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-candera-vellum/90 backdrop-blur-sm border-b border-candera-stone/40">
      <NavLink to="/" className="font-serif text-xl tracking-widest text-candera-obsidian uppercase">
        Candera
      </NavLink>
      <nav className="flex items-center gap-8 text-xs tracking-widest uppercase text-candera-obsidian/70">
        <NavLink to="/collection" className={({ isActive }) => isActive ? 'text-candera-obsidian' : 'hover:text-candera-obsidian transition-colors'}>
          Collection
        </NavLink>
        <NavLink to="/ritual" className={({ isActive }) => isActive ? 'text-candera-obsidian' : 'hover:text-candera-obsidian transition-colors'}>
          Ritual
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'text-candera-obsidian' : 'hover:text-candera-obsidian transition-colors'}>
          About
        </NavLink>
        <NavLink to="/quiz" className="px-4 py-2 border border-candera-obsidian text-candera-obsidian hover:bg-candera-obsidian hover:text-candera-vellum transition-colors">
          Find Your Ritual
        </NavLink>
      </nav>
    </header>
  )
}
