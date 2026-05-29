import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getImage } from "../data/productImages";
import { useProductSync } from "../hooks/useProductSync";
import SensoryMap from "../components/SensoryMap";
import FilterBar from "../components/FilterBar";
import { cn } from "../lib/utils";
import { Stack, Cluster } from "@/components/ui/stack";
import { Grid } from "@/components/ui/section";

const TAG_STYLES = {
  "Limited Batch": "bg-candera-ember text-white",
  Bestseller: "bg-candera-obsidian text-white",
  "New Release": "bg-candera-lavender text-white",
};

export default function Collection() {
  const { products, noActiveListings, catalogStatus } = useProductSync();
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
    <main className="px-5 pb-20 pt-32 sm:px-6 md:px-10">
      <Stack className="mx-auto mb-14 max-w-3xl gap-4 text-center md:mb-16">
        <p className="text-xs uppercase tracking-[0.28em] text-candera-sage">The Studio</p>
        <h1 className="font-display text-4xl leading-tight text-candera-obsidian md:text-5xl">
          Current Collection
        </h1>
      </Stack>

      <div className="mx-auto max-w-7xl">
        <FilterBar
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortBy={sortBy}
          onSortChange={setSortBy}
          count={filteredProducts.length}
          total={products.length}
        />
      </div>

      {noActiveListings && (
        <div
          role="status"
          className="mx-auto mb-10 max-w-7xl rounded-sm border border-candera-stone/60 bg-candera-vellum px-5 py-4"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-candera-sage mb-2">
            Etsy is connected
          </p>
          <p className="text-sm leading-relaxed text-candera-obsidian">
            No active Etsy listings were returned right now. You are viewing our curated fallback
            collection while we wait for the next live batch.
          </p>
        </div>
      )}

      {catalogStatus === "loading" && (
        <p role="status" className="mx-auto mb-10 max-w-7xl text-sm text-candera-sage">
          Gathering the latest studio batch...
        </p>
      )}

      {filteredProducts.length === 0 ? (
        <Stack className="gap-4 py-24 text-center">
          <p className="text-sm text-stone-500">No candles match this filter.</p>
          <button
            onClick={() => setActiveTag("all")}
            className="text-[10px] uppercase tracking-widest text-candera-ember border-b border-candera-ember pb-0.5 hover:text-candera-ember transition-colors"
          >
            View all candles
          </button>
        </Stack>
      ) : (
        <Grid className="mx-auto max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="group flex h-full flex-col gap-4 border border-candera-stone/40 bg-candera-vellum p-5 transition-colors hover:bg-white sm:p-6"
                >
                  <div className="relative mb-2 aspect-[4/5] overflow-hidden bg-candera-ash">
                    <img
                      src={getImage(candle.slug)}
                      alt={candle.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {candle.tag && (
                      <span
                        className={cn(
                          "absolute right-3 top-3 px-2 py-1 text-[9px] uppercase tracking-widest",
                          TAG_STYLES[candle.tag],
                        )}
                      >
                        {candle.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs tracking-widest text-candera-sage">{candle.vessel}</span>
                  <h2 className="font-display text-xl leading-tight text-candera-obsidian transition-all group-hover:italic">
                    {candle.name}
                  </h2>
                  <p className="flex-1 text-xs leading-6 text-stone-500">
                    {candle.notes.slice(0, 3).join(" · ")}
                  </p>
                  <Cluster className="items-end justify-between gap-4">
                    <div>
                      <span className="text-sm text-candera-obsidian">
                        ${candle.price.toFixed(2)}
                      </span>
                      <p className="text-[10px] uppercase tracking-widest text-candera-sage mt-1">
                        {candle.metadata.burn_time} burn · {candle.atmosphere}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-widest text-candera-ember opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                      View details →
                    </span>
                  </Cluster>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Sensory Map */}
      <Stack className="mx-auto mt-20 max-w-7xl gap-12 border-t border-candera-stone/40 pt-16">
        <Stack className="gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-candera-sage">
            Explore the Collection
          </p>
          <h2 className="font-display text-3xl text-candera-obsidian">Sensory Map</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-stone-500">
            Each vessel plotted by mood. Find where your senses lead.
          </p>
        </Stack>
        <SensoryMap products={products} />
      </Stack>
    </main>
  );
}
