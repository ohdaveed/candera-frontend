import { Stack } from "@/components/ui";

export default function Ritual() {
  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6">The Philosophy</p>
      <h1 className="font-display text-4xl md:text-5xl text-candera-obsidian mb-12 leading-tight">
        Scent is not decoration.
        <br />
        <em>It is practice.</em>
      </h1>

      <Stack className="gap-6 text-sm text-candera-obsidian/80 leading-relaxed mb-16">
        <p>
          A ritual is not a routine. A routine is performed on autopilot. A ritual requires your
          presence — a deliberate act that marks a transition, creates a container, or signals to
          your nervous system that something is different now.
        </p>
        <p>
          When you light a Candera candle, you are making a choice. The choice to slow down. To
          inhabit the room you are in. To let the scent of crushed sage or damp vetiver or wild sea
          air do what scent has always done — carry you somewhere specific, ground you in your body,
          open something up.
        </p>
        <p>
          We design each fragrance around a moment rather than a mood. Not "relaxing," but the
          particular quality of light at 6pm during a sensory revolution when everything goes amber.
          Not "fresh," but the first breath of coastal air when you step off the highway and the
          ocean is suddenly present.
        </p>
      </Stack>

      <div className="border-t border-candera-stone/40 pt-12 mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-8">Candle Care</p>
        <Stack className="gap-6">
          {[
            {
              title: "First burn",
              body: "Allow the wax to melt to the full edge of the vessel on the first burn — typically 2 to 3 hours. This prevents tunneling and ensures an even burn throughout the candle's life.",
            },
            {
              title: "Trim the wick",
              body: "Before each burn, trim the wick to ¼ inch. A long wick produces excess soot and an uneven flame. A trimmed wick burns slower, cleaner, and longer.",
            },
            {
              title: "Natural wax",
              body: "Because this candle is made with 100% natural waxes, slight cratering on the surface after burning is completely normal. It does not affect the scent or performance — it is simply the beauty of working with pure, natural materials.",
            },
            {
              title: "Botanicals",
              body: "The dried botanicals adorning each vessel are decorative. Remove them before lighting if they sit near the wick. Store them — many collectors keep them after the candle is spent.",
            },
          ].map((item) => (
            <Stack key={item.title} className="border-l-2 border-candera-stone pl-6 gap-2">
              <p className="text-xs tracking-widest uppercase text-candera-obsidian">
                {item.title}
              </p>
              <p className="text-sm text-candera-obsidian/70 leading-relaxed">{item.body}</p>
            </Stack>
          ))}
        </Stack>
      </div>

      <div className="border-t border-candera-stone/40 pt-12">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">Wax & Materials</p>
        <Stack className="gap-3 text-sm text-candera-obsidian/80 leading-relaxed">
          <p>
            Every Candera candle is made from a proprietary blend of natural soy wax and beeswax.
            Soy burns clean and slow. Beeswax adds structure, a natural honey undertone, and a
            slightly brighter flame.
          </p>
          <p>
            We use premium fragrance oils blended with botanical extracts — never synthetic bases.
            The result is a scent throw that is present without being aggressive, complex without
            being busy.
          </p>
        </Stack>
      </div>
    </main>
  );
}
