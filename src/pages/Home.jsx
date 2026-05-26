import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star, Mail, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getImage } from "../data/productImages";
import { useProductSync } from "../hooks/useProductSync";
import RedirectButton from "../components/RedirectButton";
const heroImg =
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=2400";

const TESTIMONIALS = [
  {
    quote:
      "The scent profile is unlike anything mass-produced. It fills the room without overwhelming the senses.",
    author: "Elena R.",
    loc: "Los Angeles",
    status: "Verified Ritualist",
  },
  {
    quote:
      "I reuse the stoneware vessels for my succulents. They are truly objects of art, even after the burn.",
    author: "James T.",
    loc: "Austin",
    status: "Repeat Collector",
  },
  {
    quote: "A ritual I look forward to every evening. This is the soul of my living room.",
    author: "Sarah L.",
    loc: "Brooklyn",
    status: "Verified Ritualist",
  },
];

export default function Home({ openQuiz }) {
  const { products } = useProductSync();
  const [formStatus, setFormStatus] = useState("");

  return (
    <main>
      {/* ── Hero ── */}
      <header className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-110"
            style={{ filter: "brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-stone-950/30" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto space-y-8">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[11px] md:text-[12px] tracking-[0.6em] uppercase block text-stone-300"
          >
            Hand-Poured in the High Desert
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-9xl font-serif italic leading-[1.05]">
              An invitation <br className="hidden md:block" /> to slow down.
            </h1>
            <p className="text-stone-300 text-sm md:text-base font-light italic tracking-wide">
              Limited Release: Batch 014 now curing in the studio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center pt-4"
          >
            <button
              onClick={() =>
                document.getElementById("collection").scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-stone-900 text-[11px] px-12 py-5 uppercase tracking-[0.2em] font-bold hover:bg-stone-100 transition-all flex items-center gap-3 shadow-xl"
            >
              Explore the Collection <ArrowRight size={14} />
            </button>
            <button
              onClick={openQuiz}
              className="text-white text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-stone-400 py-3 hover:border-white transition-colors"
            >
              Take the Scent Quiz
            </button>
          </motion.div>
        </div>
      </header>

      {/* ── Collection ── */}
      <section id="collection" className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-warm font-bold">
                The Current Batch
              </span>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight italic">
                Rooted in Earth,
                <br />
                Released in Air.
              </h2>
            </div>
            <p className="text-stone-500 font-light italic max-w-xs text-sm leading-relaxed pb-2">
              Each vessel is part of a numbered micro-batch, hand-labeled and inspected for peak
              botanical clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-24">
            {products.map((candle) => {
              const price = Number(candle?.price);
              const metadata = candle?.metadata ?? {};
              const scent = candle?.scent_profile ?? {};
              if (!candle?.slug || !candle?.name || Number.isNaN(price)) return null;
              return (
                <div key={candle.slug} className="group space-y-8">
                  {/* Image */}
                  <Link
                    to={`/collection/${candle.slug}`}
                    className="block relative aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm"
                  >
                    <img
                      src={getImage(candle.slug)}
                      alt={candle.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-bold shadow-sm">
                        {candle.tag}
                      </span>
                      <span className="bg-stone-900/80 text-white backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-widest font-medium self-start">
                        Batch {metadata.batch ?? "—"}
                      </span>
                    </div>
                  </Link>

                  {/* Card details */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline border-b border-stone-100 pb-4">
                      <Link to={`/collection/${candle.slug}`}>
                        <h3 className="text-3xl font-serif italic hover:text-candera-warm transition-colors">
                          {candle.name}
                        </h3>
                      </Link>
                      <span className="text-stone-400 font-light tracking-widest">
                        ${price.toFixed(2)}
                      </span>
                    </div>

                    {/* Fragrance profile */}
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                        Fragrance Profile
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-widest font-medium text-stone-600">
                        <div className="border-r border-stone-200 pr-2">
                          <span className="text-candera-warm block mb-1">Top</span>
                          {scent.top ?? "—"}
                        </div>
                        <div className="border-r border-stone-200 px-2">
                          <span className="text-candera-warm block mb-1">Heart</span>
                          {scent.heart ?? "—"}
                        </div>
                        <div className="pl-2">
                          <span className="text-candera-warm block mb-1">Base</span>
                          {scent.base ?? "—"}
                        </div>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        {metadata.burn_time ?? "—"}
                      </div>
                      <span className="italic text-candera-warm/60 lowercase font-serif text-sm normal-case">
                        {candle.atmosphere}
                      </span>
                    </div>

                    <RedirectButton
                      url={candle.etsy_link}
                      className="w-full py-4 bg-stone-900 text-white uppercase tracking-widest text-[10px] font-bold hover:bg-candera-warm transition-all shadow-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-32 px-6 md:px-12 bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-candera-warm font-bold">
            Voices of the Inner Circle
          </span>
          <div className="grid md:grid-cols-3 gap-12">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="space-y-6 px-4">
                <div className="flex justify-center gap-1 text-candera-warm/40" aria-hidden="true">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg font-serif italic text-stone-600 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-900">
                    — {t.author}, {t.loc}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[8px] text-candera-warm font-bold uppercase tracking-[0.15em]">
                    <BadgeCheck size={10} aria-hidden="true" />
                    {t.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inner Circle CTA ── */}
      <section className="py-40 px-6 md:px-12 bg-stone-900 text-stone-100 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 opacity-10 pointer-events-none">
          <img
            src={getImage("crimson-noir")}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <Mail className="mx-auto text-candera-warm/50" size={40} strokeWidth={1} />
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif italic">Join the Inner Circle</h2>
            <p className="text-stone-400 font-light max-w-xl mx-auto leading-relaxed">
              Our batches often sell out in days. Join our list to receive early access to new scent
              drops and personal ritual invitations.
            </p>
          </div>
          <form
            className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setFormStatus("You're on the list. Watch your inbox.");
            }}
          >
            <label htmlFor="inner-circle-email" className="sr-only">
              Email address
            </label>
            <input
              id="inner-circle-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="ritual@email.com"
              className="flex-1 bg-transparent border-b border-stone-700 py-3 text-stone-100 outline-none focus:border-candera-warm transition-colors placeholder:text-stone-600 font-light italic"
            />
            <button
              type="submit"
              className="bg-white text-stone-900 px-10 py-4 uppercase tracking-widest text-[11px] font-bold hover:bg-candera-warm/10 transition-colors shadow-xl"
            >
              Request Entry
            </button>
          </form>
          {formStatus && (
            <p role="status" className="text-xs text-stone-400 mt-4">
              {formStatus}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
