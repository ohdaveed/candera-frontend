export default function About() {
  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6">The Maker</p>
      <h1 className="font-serif text-4xl md:text-5xl text-candera-obsidian mb-12 leading-tight">
        Rooted in the desert.<br /><em>Refined by intention.</em>
      </h1>

      <div className="aspect-video bg-candera-stone/30 mb-12" />

      <div className="flex flex-col gap-6 text-sm text-candera-obsidian/80 leading-relaxed">
        <p>
          Candera was born in the high desert of California — a place where the air is dry and sharp, where sage grows wild along the roadside, and where the silence teaches you to notice things. The studio sits in that quiet, and every candle carries it.
        </p>
        <p>
          Each vessel is hand-poured in micro-batches using a blend of natural soy and beeswax. No shortcuts. No synthetic fillers. The botanicals are selected for their integrity — real flowers, real textures, real presence. Each candle is numbered because no two are identical, and we think that honesty matters.
        </p>
        <p>
          The mission has always been the same: to make something that slows people down. In a world that rewards speed, a candle is a small act of resistance. Light it with intention. Let it do its work.
        </p>
      </div>

      <div className="border-t border-candera-stone/40 mt-16 pt-12">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">Our Mission</p>
        <blockquote className="font-serif text-2xl text-candera-obsidian italic leading-relaxed">
          "To transform scent into a spiritual practice — one numbered vessel at a time."
        </blockquote>
      </div>
    </main>
  )
}
