import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScentQuiz from './components/ScentQuiz'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import About from './pages/About'
import Ritual from './pages/Ritual'
import Quiz from './pages/Quiz'
import InnerCircle from './pages/InnerCircle'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function AppInner() {
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  return (
    <>
      <ScrollToTop />
      <Nav openQuiz={() => setIsQuizOpen(true)} />
      <Routes>
        <Route path="/" element={<Home openQuiz={() => setIsQuizOpen(true)} />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:slug" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/ritual" element={<Ritual />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/inner-circle" element={<InnerCircle />} />
      </Routes>
      <Footer />
      <ScentQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
