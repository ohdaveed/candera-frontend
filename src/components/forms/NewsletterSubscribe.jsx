import { useState } from "react";

export function NewsletterSubscribe() {
  const [formStatus, setFormStatus] = useState("");

  return (
    <>
      <form
        className="mx-auto flex max-w-lg flex-col gap-4 md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setFormStatus("You're on the list. Watch your inbox.");
        }}
      >
        <label htmlFor="inner-circle-email" className="sr-only">
          Email address
        </label>
        <input
          id="inner-circle-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="ritual@email.com"
          className="min-h-12 flex-1 border-b border-stone-700 bg-transparent py-3 font-light italic text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-candera-ember"
        />
        <button
          type="submit"
          className="min-h-12 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-stone-900 shadow-xl transition-colors hover:bg-candera-ember/10"
        >
          Request Entry
        </button>
      </form>
      {formStatus && (
        <p role="status" className="text-xs text-stone-400 mt-4">
          {formStatus}
        </p>
      )}
    </>
  );
}
