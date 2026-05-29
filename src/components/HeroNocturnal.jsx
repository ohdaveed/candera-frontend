import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { Grid } from "@/components/ui/section";
import { Overlay } from "@/components/ui/overlay";

export default function HeroNocturnal({ openQuiz }) {
  return (
    <header className="relative min-h-screen flex flex-col items-center overflow-hidden bg-candera-obsidian pt-32 md:pt-48">
      {/* Background Image with Heavy Editorial Treatment */}
      <Overlay>
        <img
          src="/images/minimalist-airy-home.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover grayscale brightness-50"
        />
        <Overlay className="bg-[radial-gradient(circle_at_center,transparent_20%,rgba(20,20,18,0.9)_100%)]" />
        <Overlay className="bg-candera-obsidian/40" />
      </Overlay>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <Grid className="lg:grid-cols-12 gap-12 items-center">
          {/* Main Headline (Asymmetrical) */}
          <Stack className="lg:col-span-8 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-4"
            >
              <span className="text-[10px] tracking-[0.5em] uppercase block text-candera-lavender font-bold">
                The Evening Practice
              </span>
              <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-display italic leading-[0.9] text-candera-lavender">
                A ritual of <br /> emergence.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col md:flex-row gap-8 items-start pt-4"
            >
              <Button
                onClick={() =>
                  document.getElementById("collection").scrollIntoView({ behavior: "smooth" })
                }
                className="bg-candera-lavender text-candera-obsidian text-[11px] h-auto px-14 py-6 uppercase tracking-[0.3em] font-bold hover:bg-candera-vellum transition-all flex items-center gap-4 shadow-2xl rounded-none"
              >
                Explore the Curation <ArrowRight size={14} />
              </Button>
              <Button
                variant="link"
                onClick={openQuiz}
                className="text-candera-lavender/60 text-[11px] h-auto uppercase tracking-[0.3em] font-bold py-3 hover:text-candera-lavender transition-all mt-3 md:mt-0 px-0"
              >
                Scent Identification
              </Button>
            </motion.div>
          </Stack>

          {/* Pull Quote (Editorial Offset) */}
          <div className="lg:col-span-4 lg:pt-32">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="relative"
            >
              {/* Vertical line as architectural motif */}
              <div className="absolute -left-8 top-0 bottom-0 w-px bg-candera-lavender/20 hidden lg:block" />

              <p className="text-xl md:text-2xl font-editorial italic text-stone-400 leading-relaxed max-w-sm">
                "In the silence of a sensory revolution, scent is not a decoration. It is 16 hours
                of intention that return the spirit to its essence through pure products."
              </p>
              <span className="text-[9px] uppercase tracking-[0.3em] text-candera-lavender/40 font-bold block mt-6">
                &mdash; Journal Note 014
              </span>
            </motion.div>
          </div>
        </Grid>
      </div>

      {/* Decorative Grain Overlay */}
      <Overlay className="pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')]" />
    </header>
  );
}
