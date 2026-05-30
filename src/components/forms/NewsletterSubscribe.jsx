import { useState } from "react";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-xs text-stone-400">
        You're on the list. Watch your inbox.
      </p>
    );
  }

  return (
    <>
      <form className="mx-auto flex max-w-lg flex-col gap-4 md:flex-row" onSubmit={handleSubmit}>
        <label htmlFor="inner-circle-email" className="sr-only">
          Email address
        </label>
        <input
          id="inner-circle-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="ritual@email.com"
          className="min-h-12 flex-1 border-b border-stone-700 bg-transparent py-3 font-light italic text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-candera-ember"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-12 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-stone-900 shadow-xl transition-colors hover:bg-candera-ember/10 disabled:opacity-50"
        >
          {status === "loading" ? "Requesting…" : "Request Entry"}
        </button>
      </form>
      {status === "error" && (
        <p role="status" className="mt-4 text-xs text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </>
  );
}
