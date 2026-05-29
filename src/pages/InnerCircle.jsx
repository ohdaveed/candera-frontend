import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Stack } from "@/components/ui/stack";

const candleNames = {
  "seashell-garden-glow": "Seashell Garden Glow",
  "meadowlight-botanical": "Meadowlight Botanical",
  "crimson-noir": "Crimson Noir",
  "ever-after-glow": "Ever After Glow",
};

function SuccessConfirmation({ name, match }) {
  const firstName = name?.trim()?.split(" ")[0] || null;
  const candleName = (match && candleNames[match]) || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center py-10"
    >
      <div className="flex items-center justify-center mb-8">
        <div className="h-px w-10 bg-candera-stone/40" />
        <div className="mx-3 w-1.5 h-1.5 rounded-full bg-candera-sage/60" />
        <div className="mx-1 w-1 h-1 rounded-full bg-candera-sage/30" />
        <div className="mx-3 w-1.5 h-1.5 rounded-full bg-candera-sage/60" />
        <div className="h-px w-10 bg-candera-stone/40" />
      </div>

      <p className="font-display text-3xl text-candera-obsidian mb-5 leading-tight">
        {firstName ? `Welcome, ${firstName}.` : "You're in."}
      </p>

      <p className="text-sm text-candera-obsidian/70 leading-relaxed mb-3 max-w-xs mx-auto">
        Your request has been received. Before the next batch opens to the public, you'll hear from
        us first.
      </p>

      <p className="text-xs text-candera-stone leading-relaxed max-w-xs mx-auto">
        Watch for a quiet note from the studio — no noise, just your window.
      </p>

      {candleName && (
        <p className="text-xs text-candera-sage italic mt-8">
          Your ritual match — <span className="text-candera-obsidian not-italic">{candleName}</span>{" "}
          — has been noted.
        </p>
      )}
    </motion.div>
  );
}

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

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <SuccessConfirmation key="success" name={name} match={match} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="inner-circle-name"
                  className="text-xs tracking-widest uppercase text-candera-sage"
                >
                  Name
                </label>
                <input
                  id="inner-circle-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="bg-transparent border border-candera-stone px-4 py-3 text-sm text-candera-obsidian placeholder:text-candera-stone focus:outline-none focus:border-candera-obsidian transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="inner-circle-email"
                  className="text-xs tracking-widest uppercase text-candera-sage"
                >
                  Email
                </label>
                <input
                  id="inner-circle-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="bg-transparent border border-candera-stone px-4 py-3 text-sm text-candera-obsidian placeholder:text-candera-stone focus:outline-none focus:border-candera-obsidian transition-colors"
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
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
