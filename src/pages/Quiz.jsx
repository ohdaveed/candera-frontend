import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getImage } from '../data/productImages'
import { useProductSync } from '../hooks/useProductSync'

const questions = [
  {
    id: 'time',
    prompt: 'When do you light a candle?',
    subtext: 'Tell us how you move through your day.',
    options: [
      { label: 'To open the morning slowly', value: 'morning' },
      { label: 'To close the evening with intention', value: 'evening' },
    ],
  },
  {
    id: 'space',
    prompt: 'What does your ideal space feel like?',
    subtext: 'The room where you exhale.',
    options: [
      { label: 'Airy, open, light-filled', value: 'airy' },
      { label: 'Warm, close, a little dramatic', value: 'dramatic' },
    ],
  },
  {
    id: 'draw',
    prompt: 'What draws you?',
    subtext: 'Follow your instinct.',
    options: [
      { label: 'The coast · wild botanicals · something fresh', value: 'fresh' },
      { label: 'Dark florals · candlelight · slow rituals', value: 'dark' },
    ],
  },
]

const results = {
  'morning-airy-fresh': 'seashell-garden-glow',
  'morning-airy-dark': 'meadowlight-botanical',
  'morning-dramatic-fresh': 'meadowlight-botanical',
  'morning-dramatic-dark': 'ever-after-glow',
  'evening-airy-fresh': 'ever-after-glow',
  'evening-airy-dark': 'crimson-noir',
  'evening-dramatic-fresh': 'crimson-noir',
  'evening-dramatic-dark': 'crimson-noir',
}

export default function Quiz() {
  const { getProductBySlug } = useProductSync()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [emailStep, setEmailStep] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [done, setDone] = useState(false)

  const question = questions[step]
  const totalSteps = questions.length

  function handleAnswer(value) {
    const next = { ...answers, [question.id]: value }
    setAnswers(next)
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setEmailStep(true)
    }
  }

  function handleEmailSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    // In production: POST to /api/subscribe with { email, match: resultSlug }
    setDone(true)
  }

  const resultKey = (emailStep || done)
    ? `${answers.time}-${answers.space}-${answers.draw}`
    : null
  const resultSlug = resultKey ? (results[resultKey] ?? 'seashell-garden-glow') : null
  const result = resultSlug ? getProductBySlug(resultSlug) : null

  return (
    <main className="pt-24 min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Progress bar */}
      {!emailStep && !done && (
        <div className="fixed top-16 left-0 right-0 h-px bg-candera-stone" aria-hidden="true">
          <div
            className="h-full bg-candera-lavender transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Questions */}
        {!emailStep && !done && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg w-full text-center"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-3">
              {step + 1} of {totalSteps}
            </p>
            <div className="flex gap-1 justify-center mb-12">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-px w-12 ${i <= step ? 'bg-candera-obsidian' : 'bg-candera-stone'} transition-colors`}
                />
              ))}
            </div>

            <h2 className="font-serif text-3xl text-candera-obsidian mb-3">{question.prompt}</h2>
            <p className="text-sm text-candera-sage mb-12 italic">{question.subtext}</p>

            <div className="flex flex-col gap-4">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full px-8 py-4 border border-candera-stone text-sm text-candera-obsidian hover:border-candera-obsidian hover:bg-candera-stone/20 transition-colors text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Email gate */}
        {emailStep && !done && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full text-center"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6">One last step</p>
            <h2 className="font-serif text-3xl text-candera-obsidian mb-3">Reveal your perfect match</h2>
            <p className="text-sm text-candera-sage-text mb-10 leading-relaxed">
              Enter your email and we'll send you early access to your matched vessel before the next batch opens.
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label htmlFor="quiz-email" className="text-xs tracking-widest uppercase text-candera-sage">
                  Email
                </label>
                <input
                  id="quiz-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  required
                  placeholder="your@email.com"
                  className="bg-transparent border border-candera-stone px-4 py-3 text-sm text-candera-obsidian placeholder:text-candera-stone focus:outline-none focus:border-candera-obsidian transition-colors"
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="mt-2 px-8 py-3 bg-candera-obsidian text-candera-vellum text-xs tracking-widest uppercase hover:bg-candera-obsidian/80 transition-colors"
              >
                Reveal My Match
              </button>
            </form>

            <button
              onClick={() => { setStep(0); setAnswers({}); setEmailStep(false) }}
              className="mt-6 text-xs text-candera-sage tracking-widest uppercase underline hover:text-candera-obsidian transition-colors"
            >
              Start over
            </button>
          </motion.div>
        )}

        {/* Result */}
        {done && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg w-full text-center"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-candera-sage mb-6">Your Ritual Match</p>
            <div className="aspect-square max-w-xs mx-auto overflow-hidden mb-8">
              <img
                src={getImage(result.slug)}
                alt={result.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-serif text-3xl text-candera-obsidian mb-2">{result.name}</h2>
            <p className="text-xs text-candera-sage mb-8">{result.notes.slice(0, 3).join(' · ')}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/collection/${result.slug}`}
                className="px-8 py-3 bg-candera-obsidian text-candera-vellum text-xs tracking-widest uppercase hover:bg-candera-obsidian/80 transition-colors"
              >
                View This Vessel
              </Link>
              <Link
                to={`/inner-circle?match=${result.slug}`}
                className="px-8 py-3 border border-candera-obsidian text-candera-obsidian text-xs tracking-widest uppercase hover:bg-candera-obsidian hover:text-candera-vellum transition-colors"
              >
                Request Early Access
              </Link>
            </div>

            <button
              onClick={() => { setStep(0); setAnswers({}); setEmailStep(false); setEmail(''); setDone(false) }}
              className="mt-8 text-xs text-candera-sage tracking-widest uppercase underline hover:text-candera-obsidian transition-colors"
            >
              Retake the Ritual
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
