import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Sparkles } from 'lucide-react'

export default function Nav({ openQuiz }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const transparent = isHome && !scrolled
  const linkBase = `transition-colors text-[11px] uppercase tracking-[0.2em] font-semibold py-3`
  const linkColor = transparent ? 'text-stone-300 hover:text-white' : 'text-stone-500 hover:text-stone-900'

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[150] transition-all duration-700 ${
          transparent ? 'bg-transparent py-8' : 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* Left nav */}
          <nav className="hidden md:flex gap-8 justify-self-start min-w-0">
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `${linkBase} ${linkColor} ${isActive && !transparent ? 'text-stone-900! border-b border-stone-900 pb-1' : ''}`
              }
            >
              Collection
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkBase} ${linkColor} ${isActive && !transparent ? 'text-stone-900! border-b border-stone-900 pb-1' : ''}`
              }
            >
              The Craft
            </NavLink>
            <button
              onClick={openQuiz}
              className={`${linkBase} ${linkColor} hover:text-candera-warm! flex items-center gap-1.5`}
            >
              <Sparkles size={11} />
              Scent Quiz
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <button
            className={`md:hidden ${transparent ? 'text-white' : 'text-stone-900'}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-serif font-bold tracking-tighter transition-opacity hover:opacity-70 text-center justify-self-center ${
              transparent ? 'text-white' : 'text-stone-900'
            }`}
          >
            CANDERA
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-5 justify-self-end min-w-0">
            <div
              className={`transition-all duration-500 hidden md:block ${
                !transparent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <Link
                to="/collection"
                className="bg-stone-900 text-white text-[10px] px-6 py-3 uppercase tracking-widest hover:bg-candera-warm transition-colors font-bold"
              >
                Shop The Batch
              </Link>
            </div>
            <Link
              to="/collection"
              aria-label="Shop the collection"
              className={`relative p-3.5 ${transparent ? 'text-stone-300 hover:text-white' : 'text-stone-500 hover:text-stone-900'} transition-colors`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-8">
          <div className="flex justify-between items-center mb-16">
            <span className="font-serif text-2xl font-bold tracking-tighter">CANDERA</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
          </div>
          <nav className="flex flex-col gap-10 text-3xl font-serif italic text-stone-800">
            <Link to="/collection" onClick={() => setMobileOpen(false)}>The Batch</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>The Craft</Link>
            <button className="text-left" onClick={() => { openQuiz(); setMobileOpen(false) }}>Scent Quiz</button>
            <Link to="/inner-circle" onClick={() => setMobileOpen(false)}>Inner Circle</Link>
          </nav>
        </div>
      )}
    </>
  )
}
