import { useState } from 'react'
import { X, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  {
    question: 'Where do you find your deepest sense of calm?',
    options: ['An ancient, sun-dappled forest', 'A crisp, high-altitude desert', 'A hidden, dew-covered garden', 'A cozy study by the fire'],
  },
  {
    question: 'Select a sensory texture that resonates with you.',
    options: ['Rough-hewn linen', 'Smooth, cold ceramic', 'Aged, weathered leather', 'Soft, wild silk'],
  },
  {
    question: 'What is your preferred ritual time?',
    options: ['Early morning clarity', 'Mid-day pause', 'The golden hour', 'The quiet of midnight'],
  },
  {
    question: 'Which atmosphere calls to your spirit?',
    options: ['Mystical and Smokey', 'Bright and Botanical', 'Earthy and Grounded', 'Clean and Ethereal'],
  },
  {
    question: 'What is the primary intention for your space?',
    options: ['Focus and Creativity', 'Deep Restoration', 'Energy and Awakening', 'Comfort and Intimacy'],
  },
]

export default function ScentQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const total = QUESTIONS.length
  const progress = ((step + 1) / (total + 1)) * 100

  function handleNext() {
    if (step < total) setStep(step + 1)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleClose() {
    onClose()
    // Reset after close animation
    setTimeout(() => { setStep(0); setEmail(''); setSubmitted(false) }, 300)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4">
      <div className="bg-[#FDFBF7] w-full max-w-xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-stone-200">
        <button
          onClick={handleClose}
          aria-label="Close quiz"
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-stone-100">
          <div
            className="h-full bg-candera-warm transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!submitted ? (
          <div>
            {step < total ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-candera-warm font-bold">
                    Ritual Inquiry {step + 1} of {total}
                  </span>
                  <h3 className="text-3xl font-serif leading-tight">{QUESTIONS[step].question}</h3>
                </div>
                <div className="grid gap-3">
                  {QUESTIONS[step].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={handleNext}
                      className="text-left p-5 border border-stone-200 hover:border-candera-warm hover:bg-candera-warm/20 transition-all group flex justify-between items-center"
                    >
                      <span className="text-stone-700 font-light italic">{option}</span>
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-candera-warm" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-center">
                <div className="space-y-4">
                  <Sparkles className="mx-auto text-candera-warm" size={32} strokeWidth={1} />
                  <h3 className="text-3xl font-serif leading-tight">Your Sensory Profile is Ready.</h3>
                  <p className="text-stone-500 font-light text-sm">
                    Join the Inner Circle to unlock your matched scent and receive early access to the next batch.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="ritual@example.com"
                    className="w-full bg-transparent border-b border-stone-300 py-3 text-center focus:border-stone-900 outline-none placeholder:text-stone-300 font-light"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-[11px] font-bold hover:bg-candera-warm transition-colors"
                  >
                    Reveal My Match
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-6">
            <CheckCircle2 className="mx-auto text-candera-warm" size={48} strokeWidth={1} />
            <div className="space-y-2">
              <h3 className="text-3xl font-serif">Welcome to the Inner Circle.</h3>
              <p className="text-stone-500 font-light max-w-sm mx-auto">
                Check your inbox for your exclusive access code.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="border-b-2 border-stone-900 pb-1 text-[11px] uppercase tracking-widest font-bold hover:text-candera-warm hover:border-candera-warm transition-colors"
            >
              Explore the Collection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
