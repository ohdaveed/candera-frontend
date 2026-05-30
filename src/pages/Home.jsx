import { ArrowRight, Star, Mail, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getImage } from "../data/productImages";
import { useProductSync } from "../hooks/useProductSync";
import { ProductGrid } from "../components/catalog/ProductGrid";
import { NewsletterSubscribe } from "../components/forms/NewsletterSubscribe";
import { Stack, Cluster } from "@/components/ui/stack";
import { Section, Container, Grid } from "@/components/ui/section";
import { Overlay } from "@/components/ui/overlay";
import home from "@content/home.json";

const heroImg = "/images/minimalist-airy-home.png";

export default function Home({ openQuiz }) {
  const { products, noActiveListings, catalogStatus } = useProductSync();

  return (
    <main>
      {/* ── Hero ── */}
      <header className="relative flex min-h-[760px] items-center justify-center overflow-hidden sm:min-h-[820px]">
        <Overlay>
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-105 object-cover"
            style={{ filter: "brightness(0.62)" }}
          />
          <Overlay className="bg-stone-950/30" />
        </Overlay>

        <Container className="relative z-10 max-w-5xl space-y-8 px-5 pt-24 text-center text-white sm:px-6 md:pt-28">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="block text-[11px] uppercase tracking-[0.32em] text-stone-300 sm:tracking-[0.48em] md:text-[12px]"
          >
            {home.heroTag}
          </motion.span>

          <Stack className="gap-4">
            <h1 className="hero-heading font-display italic">{home.heroHeadline}</h1>
            <p className="mx-auto max-w-xl text-sm font-light italic leading-7 tracking-wide text-stone-300 md:text-base">
              {home.heroSubheading}
            </p>
          </Stack>

          <Cluster className="flex-col justify-center gap-4 pt-4 sm:flex-row sm:gap-6">
            <button
              onClick={() =>
                document.getElementById("collection").scrollIntoView({ behavior: "smooth" })
              }
              className="flex min-h-14 w-full items-center justify-center gap-3 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-900 shadow-xl transition-all hover:bg-stone-100 sm:w-auto sm:px-10"
            >
              Explore the Collection <ArrowRight size={14} />
            </button>
            <button
              onClick={openQuiz}
              className="min-h-11 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-200 transition-colors hover:text-white sm:border-b sm:border-stone-400"
            >
              Take the Scent Quiz
            </button>
          </Cluster>
        </Container>
      </header>

      {/* ── Collection ── */}
      <Section id="collection" className="bg-white">
        <Container>
          <Cluster className="mb-14 flex-col items-start justify-between gap-8 md:mb-16 md:flex-row md:items-end">
            <Stack className="max-w-2xl gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-candera-ember">
                {home.collectionTag}
              </span>
              <h2 className="font-display text-4xl italic leading-tight md:text-6xl">
                {home.collectionHeadline}
              </h2>
            </Stack>
            <p className="max-w-md pb-1 text-sm font-light italic leading-7 text-stone-500 md:max-w-xs">
              {home.collectionDescription}
            </p>
          </Cluster>

          {noActiveListings && (
            <div
              role="status"
              className="mb-10 border border-stone-200 bg-stone-50 px-5 py-4 text-left"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-candera-ember font-bold mb-2">
                Etsy is reachable
              </p>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Etsy returned no active listings at the moment. The products shown here are our
                curated fallback set so you can still explore the collection.
              </p>
            </div>
          )}

          {catalogStatus === "loading" && (
            <p role="status" className="mb-8 text-sm font-light italic text-stone-500">
              Gathering the latest studio batch...
            </p>
          )}

          <ProductGrid products={products} />
        </Container>
      </Section>

      {/* ── Testimonials ── */}
      <Section className="border-y border-stone-100 bg-stone-50">
        <Container className="space-y-12 text-center md:space-y-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-candera-ember">
            {home.testimonialsTag}
          </span>
          <Grid className="gap-12 md:grid-cols-3">
            {home.testimonials.map((t, i) => (
              <Stack key={i} className="gap-6 px-4">
                <Cluster className="justify-center gap-1 text-candera-ember/40" aria-hidden="true">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </Cluster>
                <p className="font-editorial text-lg italic leading-8 text-stone-600">
                  "{t.quote}"
                </p>
                <Stack className="gap-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-900">
                    — {t.author}, {t.location}
                  </p>
                  <Cluster className="justify-center gap-1 text-[8px] text-candera-ember font-bold uppercase tracking-[0.15em]">
                    <BadgeCheck size={10} aria-hidden="true" />
                    {t.badge}
                  </Cluster>
                </Stack>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── Inner Circle CTA ── */}
      <Section className="relative overflow-hidden bg-stone-900 py-24 text-stone-100 md:py-32">
        <div className="absolute inset-y-0 right-0 w-1/3 opacity-10 pointer-events-none">
          <img
            src={getImage("crimson-noir")}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
        <Container className="relative z-10 max-w-4xl space-y-10 text-center">
          <Mail className="mx-auto text-candera-ember/50" size={40} strokeWidth={1} />
          <Stack className="gap-4">
            <h2 className="font-display text-4xl italic md:text-6xl">{home.innerCircleHeadline}</h2>
            <p className="mx-auto max-w-xl font-light leading-7 text-stone-400">
              {home.innerCircleDescription}
            </p>
          </Stack>
          <NewsletterSubscribe />
        </Container>
      </Section>
    </main>
  );
}
