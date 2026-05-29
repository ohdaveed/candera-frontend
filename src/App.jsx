import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScentQuiz from "./components/ScentQuiz";
import Home from "./pages/Home";
import HomeNocturnal from "./pages/HomeNocturnal";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import About from "./pages/About";
import Ritual from "./pages/Ritual";
import Quiz from "./pages/Quiz";
import InnerCircle from "./pages/InnerCircle";
import ExhibitSyncPage from "./modules/exhibitSync/ExhibitSyncPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppInner() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Nav openQuiz={() => setIsQuizOpen(true)} />
      <Routes>
        <Route path="/" element={<Home openQuiz={() => setIsQuizOpen(true)} />} />
        <Route
          path="/variant-nocturnal"
          element={<HomeNocturnal openQuiz={() => setIsQuizOpen(true)} />}
        />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:slug" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/ritual" element={<Ritual />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/inner-circle" element={<InnerCircle />} />
        <Route path="/exhibit-sync" element={<ExhibitSyncPage />} />
      </Routes>
      <Footer />
      <ScentQuiz
        key={isQuizOpen ? "open" : "closed"}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
      <SpeedInsights />
    </BrowserRouter>
  );
}
