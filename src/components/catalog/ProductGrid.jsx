import { Link } from "react-router-dom";
import { getImage } from "@/data/productImages";
import RedirectButton from "@/components/RedirectButton";
import { FragranceProfileCard } from "./FragranceProfileCard";
import { Cluster, Stack, Grid } from "@/components/ui";

function ProductCard({ candle }) {
  const price = Number(candle?.price);
  const metadata = candle?.metadata ?? {};

  if (!candle?.slug || !candle?.name || Number.isNaN(price)) return null;

  return (
    <Stack className="group gap-6">
      <Link
        to={`/collection/${candle.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm"
      >
        <img
          src={getImage(candle.slug)}
          alt={candle.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        <Stack className="absolute left-4 top-4 gap-2">
          {candle.tag && (
            <span className="bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md">
              {candle.tag}
            </span>
          )}
          <span className="self-start bg-stone-900/80 px-3 py-1 text-[8px] font-medium uppercase tracking-widest text-white backdrop-blur-md">
            Batch {metadata.batch ?? "—"}
          </span>
        </Stack>
      </Link>

      <Stack className="gap-5">
        <Cluster className="items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <Link to={`/collection/${candle.slug}`}>
            <h3 className="font-display text-2xl italic leading-tight transition-colors hover:text-candera-ember md:text-3xl">
              {candle.name}
            </h3>
          </Link>
          <span className="shrink-0 pt-1 font-light tracking-widest text-stone-400">
            ${price.toFixed(2)}
          </span>
        </Cluster>

        <FragranceProfileCard
          profile={candle.scent_profile}
          burnTime={metadata.burn_time}
          atmosphere={candle.atmosphere}
        />

        <RedirectButton
          url={candle.etsy_link}
          className="min-h-12 w-full bg-stone-900 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-candera-ember"
        />
      </Stack>
    </Stack>
  );
}

export function ProductGrid({ products }) {
  return (
    <Grid className="gap-x-8 gap-y-16 md:grid-cols-3 lg:gap-x-12">
      {products.map((candle) => (
        <ProductCard key={candle.slug ?? candle.id} candle={candle} />
      ))}
    </Grid>
  );
}
