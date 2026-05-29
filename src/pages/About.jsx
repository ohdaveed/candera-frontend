import { Stack, Cluster } from "@/components/ui/stack";
import { Section, Container, Grid } from "@/components/ui/section";

export default function About() {
  return (
    <main className="pt-32">
      {/* ── Methodology hero ── */}
      <Section className="py-20 bg-white">
        <Container>
          <Grid className="lg:grid-cols-2 gap-20 items-center">
            <Stack className="gap-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-ember font-bold">
                The Methodology
              </span>
              <h1 className="text-5xl md:text-7xl font-display italic leading-tight">
                16 Hours of Intention.
              </h1>
              <p className="text-stone-500 font-sans font-light text-xl leading-relaxed">
                In a world that demands speed, we choose a sensory revolution. Our pure products are
                cultivated through a series of slow, deliberate rituals that ensure the highest
                fragrance throw and the cleanest burn.
              </p>
            </Stack>
            <div className="aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm">
              <img
                src="/images/minimalist-airy-about.png"
                alt="Wax melting process in the Candera studio"
                className="w-full h-full object-cover brightness-95"
              />
            </div>
          </Grid>
        </Container>
      </Section>

      {/* ── 4-step process ── */}
      <Section className="bg-stone-50 border-y border-stone-100">
        <Container>
          <Grid className="md:grid-cols-4 gap-12">
            {[
              {
                step: "01",
                title: "Botanical Sourcing",
                desc: "We partner with sustainable apiaries and soy farms in the Midwest to ensure our base is 100% biodegradable and phthalate-free.",
              },
              {
                step: "02",
                title: "Precision Infusion",
                desc: "Our oils are blended at precisely 185°F to ensure the fragrance molecules bond perfectly with the wax matrix for a consistent scent.",
              },
              {
                step: "03",
                title: "The Hand Pour",
                desc: "Every vessel is pre-heated and hand-poured in micro-batches to prevent air pockets and ensure a perfectly level surface.",
              },
              {
                step: "04",
                title: "Curing Silence",
                desc: 'Finished candles sit in a temperature-controlled dark room for two full weeks to "cure," allowing the scent to reach its peak complexity.',
              },
            ].map((item) => (
              <Stack key={item.step} className="gap-6">
                <span className="text-4xl font-display text-candera-ember/30 italic">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold tracking-tight uppercase">{item.title}</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">{item.desc}</p>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── Founder ── */}
      <Section className="bg-white">
        <Container className="max-w-5xl">
          <Cluster className="flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                  alt="Clara Thorne, Founder of Candera"
                  className="w-full h-full object-cover grayscale brightness-95"
                />
              </div>
            </div>
            <Stack className="w-full md:w-1/2 gap-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-ember font-bold">
                Behind the Vessel
              </span>
              <h2 className="text-4xl font-display">Meet the Maker</h2>
              <Stack className="gap-6 text-stone-600 font-light leading-relaxed">
                <p>
                  "Candera began as a personal necessity. Working from the studio, I found that the
                  mass-produced candles in my home were causing headaches and burning far too
                  quickly. I wanted something that echoed the silence of the canyon."
                </p>
                <p>
                  With a background in botanical chemistry and a passion for minimalist design, two
                  years were spent perfecting the formula. Today, every single candle that leaves
                  the studio is personally inspected.
                </p>
              </Stack>
              <div className="pt-6 border-t border-stone-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Founder & Lead Maker
                </p>
              </div>
            </Stack>
          </Cluster>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section className="bg-stone-900 text-stone-100">
        <Container className="max-w-4xl">
          <Stack className="text-center mb-20 gap-4">
            <h3 className="text-4xl font-display italic">Care & Logistics</h3>
            <p className="text-stone-400 font-light">
              Common inquiries for the intentional collector.
            </p>
          </Stack>
          <Stack className="gap-12">
            {[
              {
                q: "How do I maximize my candle's lifespan?",
                a: "Always trim the wick to 1/4 inch before lighting. On your first burn, allow the wax to melt across the entire surface to prevent 'tunneling.'",
              },
              {
                q: "Are the vessels reusable?",
                a: "Yes. Once 1/2 inch of wax remains, pour boiling water into the vessel to lift the remaining wax. The stoneware is food-safe and perfect for plants or storage.",
              },
              {
                q: "Why are batches limited?",
                a: "Quality control is paramount. By pouring in small micro-batches, we ensure the fragrance oil is perfectly distributed and the wicks are centered manually.",
              },
            ].map((faq, i) => (
              <Stack key={i} className="border-b border-stone-800 pb-8 gap-4">
                <h4 className="text-lg font-display flex justify-between items-center text-stone-100">
                  {faq.q}
                  <span className="text-stone-700 text-2xl font-light">+</span>
                </h4>
                <p className="text-stone-400 font-light text-sm leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
