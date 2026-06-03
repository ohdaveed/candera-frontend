import { Stack, Cluster } from "@/components/ui/stack";
import { Section, Container, Grid } from "@/components/ui/section";
import about from "@content/about.json";

export default function About() {
  return (
    <main className="pt-32">
      {/* ── Methodology hero ── */}
      <Section className="py-20 bg-candera-vellum">
        <Container>
          <Grid className="lg:grid-cols-2 gap-20 items-center">
            <Stack className="gap-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-ember font-bold">
                {about.methodologyTag}
              </span>
              <h1 className="text-5xl md:text-7xl font-display italic leading-tight">
                {about.methodologyHeadline}
              </h1>
              <p className="text-candera-sage font-sans font-light text-xl leading-relaxed">
                {about.methodologyDescription}
              </p>
            </Stack>
            <div className="aspect-[4/5] overflow-hidden bg-candera-ash shadow-sm">
              <img
                src="/images/minimalist-airy-about.png"
                alt={about.methodologyImageAlt}
                className="w-full h-full object-cover brightness-95"
              />
            </div>
          </Grid>
        </Container>
      </Section>

      {/* ── 4-step process ── */}
      <Section className="bg-candera-ash border-y border-candera-stone/30">
        <Container>
          <Grid className="md:grid-cols-4 gap-12">
            {about.methodologySteps.map((item) => (
              <Stack key={item.step} className="gap-6">
                <span className="text-4xl font-display text-candera-ember/30 italic">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold tracking-tight uppercase">{item.title}</h3>
                <p className="text-sm text-candera-sage font-light leading-relaxed">
                  {item.description}
                </p>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── Founder ── */}
      <Section className="bg-candera-vellum">
        <Container className="max-w-5xl">
          <Cluster className="flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <div className="aspect-[3/4] overflow-hidden bg-candera-ash shadow-sm">
                <img
                  src={about.founderImageUrl}
                  alt={about.founderImageAlt}
                  className="w-full h-full object-cover grayscale brightness-95"
                />
              </div>
            </div>
            <Stack className="w-full md:w-1/2 gap-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-ember font-bold">
                {about.founderTag}
              </span>
              <h2 className="text-4xl font-display">{about.founderHeadline}</h2>
              <Stack className="gap-6 text-candera-sage font-light leading-relaxed">
                <p>{about.founderStory1}</p>
                <p>{about.founderStory2}</p>
              </Stack>
              <div className="pt-6 border-t border-candera-stone/30">
                <p className="text-[10px] uppercase tracking-widest font-bold text-candera-stone">
                  {about.founderRole}
                </p>
              </div>
            </Stack>
          </Cluster>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section className="bg-candera-obsidian text-candera-vellum">
        <Container className="max-w-4xl">
          <Stack className="text-center mb-20 gap-4">
            <h3 className="text-4xl font-display italic">{about.faqHeadline}</h3>
            <p className="text-candera-vellum/60 font-light">{about.faqSubheading}</p>
          </Stack>
          <Stack className="gap-12">
            {about.faq.map((item, i) => (
              <Stack key={i} className="border-b border-candera-lavender/10 pb-8 gap-4">
                <h4 className="text-lg font-display flex justify-between items-center text-candera-vellum">
                  {item.question}
                  <span className="text-candera-vellum/30 text-2xl font-light">+</span>
                </h4>
                <p className="text-candera-vellum/60 font-light text-sm leading-relaxed max-w-2xl">
                  {item.answer}
                </p>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
