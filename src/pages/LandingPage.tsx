import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Button from "../components/ui/Button";

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-warm-white"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-white/80 backdrop-blur-md border-b border-warm-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="font-serif text-xl font-bold text-warm-800">
              Inkwell
            </span>
          </Link>
          <Link to="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      <div className="pt-16">
        <Hero />
        <Features />
        <Footer />
      </div>
    </motion.div>
  );
}
