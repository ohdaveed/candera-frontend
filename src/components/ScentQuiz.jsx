import { useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, Stack } from "@/components/ui";

const QUESTIONS = [
  {
    question: "Where do you find your deepest sense of calm?",
    options: [
      "An ancient, sun-dappled forest",
      "A crisp, high-altitude sanctuary",
      "A hidden, dew-covered garden",
      "A cozy study by the fire",
    ],
  },
  {
    question: "Select a sensory texture that resonates with you.",
    options: [
      "Rough-hewn linen",
      "Smooth, cold ceramic",
      "Aged, weathered leather",
      "Soft, wild silk",
    ],
  },
  {
    question: "What is your preferred ritual time?",
    options: ["Early morning clarity", "Mid-day pause", "The golden hour", "The quiet of midnight"],
  },
  {
    question: "Which atmosphere calls to your spirit?",
    options: [
      "Mystical and Smokey",
      "Bright and Botanical",
      "Earthy and Grounded",
      "Clean and Ethereal",
    ],
  },
  {
    question: "What is the primary intention for your space?",
    options: [
      "Focus and Creativity",
      "Deep Restoration",
      "Energy and Awakening",
      "Comfort and Intimacy",
    ],
  },
];

export default function ScentQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const total = QUESTIONS.length;
  const progress = ((step + 1) / (total + 1)) * 100;

  function handleNext() {
    if (step < total) setStep(step + 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="bg-[#FDFBF7] p-8 md:p-12 max-w-xl sm:max-w-xl gap-0 border-stone-200"
        showCloseButton
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
          <div
            className="h-full bg-candera-ember transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!submitted ? (
          <div>
            {step < total ? (
              <Stack className="gap-8">
                <Stack className="gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-candera-ember font-bold">
                    Ritual Inquiry {step + 1} of {total}
                  </span>
                  <DialogTitle className="text-3xl font-display leading-tight !text-left !normal-case">
                    {QUESTIONS[step].question}
                  </DialogTitle>
                </Stack>
                <Stack className="gap-3">
                  {QUESTIONS[step].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={handleNext}
                      className="text-left p-5 border border-stone-200 hover:border-candera-ember hover:bg-candera-ember/20 transition-all group flex justify-between items-center"
                    >
                      <span className="text-stone-700 font-light italic">{option}</span>
                      <ChevronRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-candera-ember"
                      />
                    </button>
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Stack className="gap-8 text-center">
                <Stack className="gap-4">
                  <Sparkles className="mx-auto text-candera-ember" size={32} strokeWidth={1} />
                  <DialogTitle className="text-3xl font-display leading-tight !text-center !normal-case">
                    Your Sensory Profile is Ready.
                  </DialogTitle>
                  <p className="text-stone-500 font-light text-sm">
                    Join the Inner Circle to unlock your matched scent and receive early access to
                    the next batch.
                  </p>
                </Stack>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label htmlFor="scent-quiz-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="scent-quiz-email"
                    type="email"
                    required
                    placeholder="ritual@example.com"
                    className="w-full bg-transparent border-b border-stone-300 py-3 text-center focus:border-stone-900 outline-none placeholder:text-stone-300 font-light"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-[11px] font-bold hover:bg-candera-ember transition-colors"
                  >
                    Reveal My Match
                  </button>
                </form>
              </Stack>
            )}
          </div>
        ) : (
          <Stack className="text-center py-12 gap-6">
            <CheckCircle2 className="mx-auto text-candera-ember" size={48} strokeWidth={1} />
            <Stack className="gap-2">
              <DialogTitle className="text-3xl font-display !text-center !normal-case">
                Welcome to the Inner Circle.
              </DialogTitle>
              <p className="text-stone-500 font-light max-w-sm mx-auto">
                Check your inbox for your exclusive access code.
              </p>
            </Stack>
            <button
              onClick={onClose}
              className="border-b-2 border-stone-900 pb-1 text-[11px] uppercase tracking-widest font-bold hover:text-candera-ember hover:border-candera-ember transition-colors"
            >
              Explore the Collection
            </button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
