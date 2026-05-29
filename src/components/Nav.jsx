import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { Cluster } from "@/components/ui/stack";

export default function Nav({ openQuiz }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isNocturnal = pathname === "/variant-nocturnal";
  const isHome = pathname === "/" || isNocturnal;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const transparent = isHome && !scrolled;
  const linkBase = `transition-colors text-[11px] uppercase tracking-[0.2em] font-semibold py-3`;

  let linkColor = "text-stone-500 hover:text-stone-900";
  if (transparent) {
    linkColor = isNocturnal
      ? "text-candera-lavender/60 hover:text-candera-lavender"
      : "text-stone-300 hover:text-white";
  } else if (isNocturnal) {
    linkColor = "text-candera-lavender/80 hover:text-candera-lavender";
  }

  const headerBg = transparent
    ? "bg-transparent py-8"
    : isNocturnal
      ? "bg-candera-obsidian/95 border-b border-candera-lavender/10 py-4 shadow-2xl backdrop-blur-md"
      : "bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-stone-100";

  const logoColor = transparent || isNocturnal ? "text-white" : "text-stone-900";

  return (
    <>
      <header className={`fixed top-0 w-full z-[150] transition-all duration-700 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* Left nav */}
          <nav className="hidden md:flex gap-8 justify-self-start min-w-0">
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `${linkBase} ${linkColor} ${isActive && !transparent ? (isNocturnal ? "text-candera-lavender! border-b border-candera-lavender pb-1" : "text-stone-900! border-b border-stone-900 pb-1") : ""}`
              }
            >
              Collection
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkBase} ${linkColor} ${isActive && !transparent ? (isNocturnal ? "text-candera-lavender! border-b border-candera-lavender pb-1" : "text-stone-900! border-b border-stone-900 pb-1") : ""}`
              }
            >
              The Craft
            </NavLink>
            <button
              onClick={openQuiz}
              className={`${linkBase} ${linkColor} hover:text-candera-ember! flex items-center gap-1.5`}
            >
              <Sparkles size={11} />
              Scent Quiz
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <button
            className={`md:hidden ${logoColor}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-display font-bold tracking-tighter transition-opacity hover:opacity-70 text-center justify-self-center ${logoColor}`}
          >
            CANDERA
          </Link>

          {/* Right actions */}
          <Cluster className="gap-5 justify-self-end min-w-0">
            <div
              className={`transition-all duration-500 hidden md:block ${
                !transparent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <Link
                to="/collection"
                className={`${isNocturnal ? "bg-candera-lavender text-candera-obsidian" : "bg-stone-900 text-white"} text-[10px] px-6 py-3 uppercase tracking-widest hover:bg-candera-ember transition-colors font-bold`}
              >
                Shop The Batch
              </Link>
            </div>
            <Link
              to="/collection"
              aria-label="Shop the collection"
              className={`relative p-3.5 ${transparent ? (isNocturnal ? "text-candera-lavender/60 hover:text-candera-lavender" : "text-stone-300 hover:text-white") : isNocturnal ? "text-candera-lavender/80 hover:text-candera-lavender" : "text-stone-500 hover:text-stone-900"} transition-colors`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
          </Cluster>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 z-[200] p-8 ${isNocturnal ? "bg-candera-obsidian" : "bg-white"}`}
        >
          <Cluster className="justify-between mb-16">
            <span
              className={`font-display text-2xl font-bold tracking-tighter ${isNocturnal ? "text-candera-vellum" : "text-stone-900"}`}
            >
              CANDERA
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className={isNocturnal ? "text-candera-vellum" : "text-stone-900"}
            >
              <X size={24} />
            </button>
          </Cluster>
          <nav
            className={`flex flex-col gap-10 text-3xl font-display italic ${isNocturnal ? "text-candera-lavender" : "text-stone-800"}`}
          >
            <Link to="/collection" onClick={() => setMobileOpen(false)}>
              The Batch
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>
              The Craft
            </Link>
            <button
              className="text-left"
              onClick={() => {
                openQuiz();
                setMobileOpen(false);
              }}
            >
              Scent Quiz
            </button>
            <Link to="/inner-circle" onClick={() => setMobileOpen(false)}>
              Inner Circle
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
