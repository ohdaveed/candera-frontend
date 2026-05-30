import { Stack } from "@/components/ui/stack";
import ritual from "@content/ritual.json";

export default function Ritual() {
  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto py-24">
      <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6">
        {ritual.philosophyTag}
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-candera-obsidian mb-12 leading-tight">
        {ritual.philosophyHeadline}
      </h1>

      <Stack className="gap-6 text-sm text-candera-obsidian/80 leading-relaxed mb-16">
        {ritual.philosophyParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </Stack>

      <div className="border-t border-candera-stone/40 pt-12 mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-8">
          {ritual.careTipsTag}
        </p>
        <Stack className="gap-6">
          {ritual.careTips.map((item) => (
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
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-4">
          {ritual.materialsTag}
        </p>
        <Stack className="gap-3 text-sm text-candera-obsidian/80 leading-relaxed">
          {ritual.materialsParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Stack>
      </div>
    </main>
  );
}
