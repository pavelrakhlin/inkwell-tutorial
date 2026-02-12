import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(91,127,165,0.04),transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-warm-900 leading-tight tracking-tight">
            Write with
            <span className="block text-accent">clarity & context</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-warm-500 font-sans leading-relaxed max-w-2xl mx-auto"
        >
          Inkwell is your AI-powered writing companion. Add reference materials,
          and let intelligent assistance help you craft documents that draw from
          your knowledge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/auth">
            <Button size="lg" className="text-base px-8">
              Start Writing
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg" className="text-base">
              Learn More
            </Button>
          </a>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-16 mx-auto max-w-xl"
        >
          <div className="relative bg-white rounded-2xl shadow-soft-lg border border-warm-100 p-8">
            <div className="space-y-3">
              <div className="h-3 bg-warm-100 rounded-full w-3/4" />
              <div className="h-3 bg-warm-100 rounded-full w-full" />
              <div className="h-3 bg-warm-100 rounded-full w-5/6" />
              <div className="h-3 bg-warm-100 rounded-full w-2/3" />
            </div>
            <div className="absolute -right-3 -top-3 bg-accent text-white text-xs font-sans font-medium px-3 py-1.5 rounded-full shadow-soft-md">
              AI Writing
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
