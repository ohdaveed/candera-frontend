export default function About() {
  return (
    <div className="pt-32">
      {/* ── Methodology hero ── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-warm font-bold">The Methodology</span>
              <h1 className="text-5xl md:text-7xl font-serif italic leading-tight">72 Hours of Intent.</h1>
              <p className="text-stone-500 font-light text-xl leading-relaxed">
                In a world that demands speed, we choose the opposite. Our candles are cultivated through a series of slow, deliberate rituals that ensure the highest fragrance throw and the cleanest burn.
              </p>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1200"
                alt="Wax melting process in the Candera studio"
                className="w-full h-full object-cover brightness-95"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-step process ── */}
      <section className="py-32 px-6 md:px-12 bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              {
                step: '01',
                title: 'Botanical Sourcing',
                desc: 'We partner with sustainable apiaries and soy farms in the Midwest to ensure our base is 100% biodegradable and phthalate-free.',
              },
              {
                step: '02',
                title: 'Precision Infusion',
                desc: 'Our oils are blended at precisely 185°F to ensure the fragrance molecules bond perfectly with the wax matrix for a consistent scent.',
              },
              {
                step: '03',
                title: 'The Hand Pour',
                desc: 'Every vessel is pre-heated and hand-poured in micro-batches to prevent air pockets and ensure a perfectly level surface.',
              },
              {
                step: '04',
                title: 'Curing Silence',
                desc: 'Finished candles sit in a temperature-controlled dark room for two full weeks to "cure," allowing the scent to reach its peak complexity.',
              },
            ].map((item) => (
              <div key={item.step} className="space-y-6">
                <span className="text-4xl font-serif text-candera-warm/30 italic">{item.step}</span>
                <h3 className="text-lg font-bold tracking-tight uppercase">{item.title}</h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                  alt="Clara Thorne, Founder of Candera"
                  className="w-full h-full object-cover grayscale brightness-95"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <span className="text-[10px] tracking-[0.4em] uppercase text-candera-warm font-bold">Behind the Vessel</span>
              <h2 className="text-4xl font-serif">Meet the Maker</h2>
              <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                <p>
                  "Candera began as a personal necessity. Living in the high desert, I found that the mass-produced candles in my home were causing headaches and burning far too quickly. I wanted something that echoed the silence of the canyon."
                </p>
                <p>
                  With a background in botanical chemistry and a passion for minimalist design, two years were spent perfecting the formula. Today, every single candle that leaves the studio is personally inspected.
                </p>
              </div>
              <div className="pt-6 border-t border-stone-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Founder & Lead Maker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-32 px-6 md:px-12 bg-stone-900 text-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h3 className="text-4xl font-serif italic">Care & Logistics</h3>
            <p className="text-stone-400 font-light">Common inquiries for the intentional collector.</p>
          </div>
          <div className="grid gap-12">
            {[
              {
                q: "How do I maximize my candle's lifespan?",
                a: "Always trim the wick to 1/4 inch before lighting. On your first burn, allow the wax to melt across the entire surface to prevent 'tunneling.'",
              },
              {
                q: 'Are the vessels reusable?',
                a: "Yes. Once 1/2 inch of wax remains, pour boiling water into the vessel to lift the remaining wax. The stoneware is food-safe and perfect for plants or storage.",
              },
              {
                q: 'Why are batches limited?',
                a: 'Quality control is paramount. By pouring in small micro-batches, we ensure the fragrance oil is perfectly distributed and the wicks are centered manually.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-stone-800 pb-8">
                <h4 className="text-lg font-serif mb-4 flex justify-between items-center text-stone-100">
                  {faq.q}
                  <span className="text-stone-700 text-2xl font-light">+</span>
                </h4>
                <p className="text-stone-400 font-light text-sm leading-relaxed max-w-2xl">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
