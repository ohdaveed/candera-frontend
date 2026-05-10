import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import About from './pages/About'
import Ritual from './pages/Ritual'
import Quiz from './pages/Quiz'
import InnerCircle from './pages/InnerCircle'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:slug" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/ritual" element={<Ritual />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/inner-circle" element={<InnerCircle />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
