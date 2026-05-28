import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getImage } from "../data/productImages";
import { useProductSync } from "../hooks/useProductSync";
import SensoryMap from "../components/SensoryMap";
import FilterBar from "../components/FilterBar";
import { cn } from "../lib/utils";

const TAG_STYLES = {
  "Limited Batch": "bg-candera-warm text-white",
  Bestseller: "bg-candera-obsidian text-white",
  "New Release": "bg-candera-lavender text-white",
};

export default function Collection() {
  const { products, noActiveListings } = useProductSync();
  const [activeTag, setActiveTag] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const tags = useMemo(() => [...new Set(products.map((p) => p.tag).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeTag !== "all") list = list.filter((p) => p.tag === activeTag);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeTag, sortBy]);

  return (
    <main className="pt-24 px-6 md:px-16 py-16">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">The Studio</p>
        <h1 className="font-serif text-4xl md:text-5xl text-candera-obsidian">
          Current Collection
        </h1>
      </div>

      <FilterBar
        tags={tags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        sortBy={sortBy}
        onSortChange={setSortBy}
        count={filteredProducts.length}
        total={products.length}
      />

      {noActiveListings && (
        <div
          role="status"
          className="mb-10 rounded-sm border border-candera-stone/60 bg-candera-vellum px-5 py-4"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-candera-sage mb-2">
            Etsy is connected
          </p>
          <p className="text-sm text-candera-obsidian leading-relaxed">
            No active Etsy listings were returned right now. You are viewing our curated fallback
            collection while we wait for the next live batch.
          </p>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-candera-sage-text mb-4">No candles match this filter.</p>
          <button
            onClick={() => setActiveTag("all")}
            className="text-[10px] uppercase tracking-widest text-candera-warm border-b border-candera-warm pb-0.5 hover:text-candera-warm transition-colors"
          >
            View all candles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-candera-stone">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((candle) => (
              <motion.div
                key={candle.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to={`/collection/${candle.slug}`}
                  className="group bg-candera-vellum p-8 flex flex-col gap-4 hover:bg-candera-stone/20 transition-colors h-full"
                >
                  <div className="relative aspect-square overflow-hidden mb-2">
                    <img
                      src={getImage(candle.slug)}
                      alt={candle.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {candle.tag && (
                      <span
                        className={cn(
                          "absolute top-3 right-3 text-[9px] uppercase tracking-widest px-2 py-1",
                          TAG_STYLES[candle.tag],
                        )}
                      >
                        {candle.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-candera-sage tracking-widest">{candle.vessel}</span>
                  <h2 className="font-serif text-lg text-candera-obsidian group-hover:italic transition-all leading-snug">
                    {candle.name}
                  </h2>
                  <p className="text-xs text-candera-sage-text leading-relaxed flex-1">
                    {candle.notes.slice(0, 3).join(" · ")}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-sm text-candera-obsidian">
                        ${candle.price.toFixed(2)}
                      </span>
                      <p className="text-[10px] uppercase tracking-widest text-candera-sage mt-1">
                        {candle.metadata.burn_time} burn · {candle.atmosphere}
                      </p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] uppercase tracking-widest text-candera-warm">
                      View details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Sensory Map */}
      <div className="mt-24 border-t border-candera-stone/40 pt-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">
            Explore the Collection
          </p>
          <h2 className="font-serif text-3xl text-candera-obsidian">Sensory Map</h2>
          <p className="text-sm text-candera-sage-text mt-3 max-w-sm mx-auto">
            Each vessel plotted by mood. Find where your senses lead.
          </p>
        </div>
        <SensoryMap products={products} />
      </div>
    </main>
  );
}
