import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Mail, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getImage } from "../data/productImages";
import { useProductSync } from "../hooks/useProductSync";
import RedirectButton from "../components/RedirectButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroNocturnal from "../components/HeroNocturnal";
import { Stack, Cluster } from "@/components/ui/stack";
import { Section, Container, Grid } from "@/components/ui/section";
import { Overlay } from "@/components/ui/overlay";

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

export default function HomeNocturnal({ openQuiz }) {
  const { products } = useProductSync();
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState("");

  return (
    <main className="bg-candera-obsidian text-candera-vellum selection:bg-candera-lavender selection:text-candera-obsidian">
      <HeroNocturnal openQuiz={openQuiz} />

      {/* ── Collection ── */}
      <Section id="collection" className="py-48 bg-candera-obsidian">
        <Container>
          <Grid className="lg:grid-cols-12 gap-20 mb-40">
            <Stack className="lg:col-span-7 gap-8">
              <span className="text-[10px] tracking-[0.5em] uppercase text-candera-lavender font-bold">
                The Curated Batch
              </span>
              <h2 className="text-5xl md:text-8xl font-display leading-[0.85] italic text-candera-lavender">
                Rooted in Earth, <br /> Released in Air.
              </h2>
            </Stack>
            <div className="lg:col-span-5 flex items-end">
              <p className="text-stone-500 font-editorial italic text-xl leading-relaxed border-l border-candera-lavender/10 pl-12">
                Each vessel is part of a numbered micro-batch, hand-labeled and inspected for peak
                botanical clarity. A physical evidence of unhurried handcraft.
              </p>
            </div>
          </Grid>

          <Grid className="md:grid-cols-2 gap-x-24 gap-y-48">
            {products.map((candle, idx) => {
              const price = Number(candle?.price);
              const scent = candle?.scent_profile ?? {};
              if (!candle?.slug || !candle?.name || Number.isNaN(price)) return null;

              const isOffset = idx % 2 !== 0;

              return (
                <Stack key={candle.slug} className={`gap-12 ${isOffset ? "md:pt-32" : ""}`}>
                  <Link
                    to={`/collection/${candle.slug}`}
                    className="group block relative aspect-[4/5] overflow-hidden bg-stone-900 shadow-2xl"
                  >
                    <img
                      src={getImage(candle.slug)}
                      alt={candle.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s] group-hover:scale-105"
                    />
                    {candle.tag && (
                      <Stack className="absolute top-8 left-8 gap-2">
                        <Badge className="bg-candera-lavender text-candera-obsidian px-4 py-1 text-[9px] uppercase tracking-widest font-bold shadow-xl border-none rounded-none">
                          {candle.tag}
                        </Badge>
                      </Stack>
                    )}
                  </Link>

                  <Stack className="gap-10 px-4">
                    <Cluster className="justify-between items-baseline border-b border-candera-lavender/10 pb-8">
                      <Link to={`/collection/${candle.slug}`}>
                        <h3 className="text-5xl font-display italic hover:text-candera-lavender transition-colors">
                          {candle.name}
                        </h3>
                      </Link>
                      <span className="text-stone-500 font-sans tracking-widest text-sm">
                        ${price.toFixed(2)}
                      </span>
                    </Cluster>

                    <Grid className="grid-cols-3 gap-8 text-[10px] uppercase tracking-widest font-medium text-stone-400">
                      <Stack className="gap-2">
                        <span className="text-candera-lavender block font-bold tracking-[0.2em]">
                          Top
                        </span>
                        <p className="text-stone-500">{scent.top ?? "—"}</p>
                      </Stack>
                      <Stack className="gap-2 border-x border-candera-lavender/10 px-8">
                        <span className="text-candera-lavender block font-bold tracking-[0.2em]">
                          Heart
                        </span>
                        <p className="text-stone-500">{scent.heart ?? "—"}</p>
                      </Stack>
                      <Stack className="gap-2">
                        <span className="text-candera-lavender block font-bold tracking-[0.2em]">
                          Base
                        </span>
                        <p className="text-stone-500">{scent.base ?? "—"}</p>
                      </Stack>
                    </Grid>

                    <RedirectButton
                      url={candle.etsy_link}
                      className="w-full py-6 bg-transparent border border-candera-lavender/30 text-candera-lavender uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-candera-lavender hover:text-candera-obsidian transition-all rounded-none h-auto"
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Grid>
        </Container>
      </Section>

      {/* ── Testimonials ── */}
      <Section className="py-60 bg-candera-obsidian border-y border-candera-lavender/5">
        <Container className="text-center space-y-32">
          <span className="text-[10px] tracking-[0.6em] uppercase text-candera-lavender font-bold">
            Voices of the Inner Circle
          </span>
          <Grid className="md:grid-cols-3 gap-24">
            {TESTIMONIALS.map((t, i) => (
              <Stack key={i} className="gap-10 px-8">
                <Cluster
                  className="justify-center gap-2 text-candera-lavender/20"
                  aria-hidden="true"
                >
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} fill="currentColor" stroke="none" />
                  ))}
                </Cluster>
                <p className="text-2xl font-editorial italic text-stone-400 leading-relaxed">
                  "{t.quote}"
                </p>
                <Stack className="gap-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-candera-lavender">
                    &mdash; {t.author}, {t.loc}
                  </p>
                  <Cluster className="justify-center gap-2 text-[8px] text-candera-lavender/40 font-bold uppercase tracking-[0.2em]">
                    <BadgeCheck size={10} aria-hidden="true" />
                    {t.status}
                  </Cluster>
                </Stack>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── Inner Circle CTA ── */}
      <Section className="py-60 bg-candera-obsidian relative overflow-hidden">
        <Overlay className="opacity-10 pointer-events-none grayscale">
          <img
            src={getImage("crimson-noir")}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </Overlay>
        <Container className="max-w-4xl text-center space-y-20 relative z-10">
          <Mail className="mx-auto text-candera-lavender/30" size={56} strokeWidth={1} />
          <Stack className="gap-8">
            <h2 className="text-6xl md:text-[7rem] font-display italic text-candera-lavender leading-tight">
              Join the Inner Circle
            </h2>
            <p className="text-stone-500 font-editorial text-2xl max-w-2xl mx-auto leading-relaxed italic">
              Our batches often sell out in days. Join our list to receive early access to new scent
              drops and personal ritual invitations.
            </p>
          </Stack>
          <form
            className="flex flex-col md:flex-row gap-8 max-w-xl mx-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch("/api/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                if (!res.ok) throw new Error();
                setFormStatus("You're on the list. Watch your inbox.");
              } catch {
                setFormStatus("Something went wrong. Please try again.");
              }
            }}
          >
            <label htmlFor="nocturnal-email" className="sr-only">
              Email address
            </label>
            <input
              id="nocturnal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ritual@email.com"
              className="flex-1 bg-transparent border-b border-candera-lavender/20 py-4 text-candera-vellum outline-none focus:border-candera-lavender transition-colors placeholder:text-stone-800 font-editorial italic text-xl"
            />
            <Button
              type="submit"
              className="bg-candera-lavender text-candera-obsidian px-16 py-6 h-auto uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-candera-vellum transition-all shadow-2xl rounded-none border-none"
            >
              Request Entry
            </Button>
          </form>
          {formStatus && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="status"
              className="text-sm text-candera-lavender/60 mt-12 font-editorial italic tracking-widest"
            >
              {formStatus}
            </motion.p>
          )}
        </Container>
      </Section>
    </main>
  );
}
