import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Stack } from "@/components/ui";

const candleNames = {
  "seashell-garden-glow": "Seashell Garden Glow",
  "meadowlight-botanical": "Meadowlight Botanical",
  "crimson-noir": "Crimson Noir",
  "ever-after-glow": "Ever After Glow",
};

const inputClass =
  "bg-transparent border border-candera-stone px-4 py-3 text-sm text-candera-obsidian placeholder:text-candera-stone focus:outline-none focus:border-candera-obsidian transition-colors";

export default function InnerCircle() {
  const [searchParams] = useSearchParams();
  const match = searchParams.get("match");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, match }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="pt-24 min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6 text-center">
          Limited Access
        </p>
        <h1 className="font-display text-4xl text-candera-obsidian text-center mb-6 leading-tight">
          The Inner Circle
        </h1>
        {match && candleNames[match] && (
          <p className="text-center text-xs text-candera-sage mb-4 italic">
            Your ritual match: <span className="text-candera-obsidian">{candleNames[match]}</span>
          </p>
        )}

        <Stack className="border-t border-candera-stone/40 pt-8 mb-10 gap-4">
          <p className="text-sm text-candera-obsidian/70 leading-relaxed">
            Each Candera batch is numbered and finite. Before the studio opens to the public,
            members of the Inner Circle receive early access — first right to numbered vessels,
            batch announcements, and collector releases.
          </p>
          <p className="text-sm text-candera-obsidian/70 leading-relaxed">
            This is not a newsletter. It is a correspondence between the studio and those who
            collect with intention.
          </p>
        </Stack>

        {status === "success" ? (
          <div className="text-center py-8">
            <p className="font-serif text-2xl text-candera-obsidian mb-3">Request received.</p>
            <p className="text-sm text-candera-sage">
              We'll be in touch before the next batch drops.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs tracking-widest uppercase text-candera-sage">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs tracking-widest uppercase text-candera-sage">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
            {status === "error" && (
              <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 px-8 py-4 bg-candera-obsidian text-candera-vellum text-xs tracking-widest uppercase hover:bg-candera-obsidian/80 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Requesting..." : "Request Entry"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
