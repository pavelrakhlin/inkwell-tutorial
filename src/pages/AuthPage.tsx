import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

// TODO: Replace with real Clerk <SignIn /> and <SignUp /> when Clerk is configured.
// import { SignIn, SignUp } from "@clerk/clerk-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-warm-white flex flex-col"
    >
      {/* Header */}
      <nav className="px-6 h-16 flex items-center border-b border-warm-100">
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
      </nav>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl font-bold text-warm-900">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-warm-500">
              {mode === "sign-in"
                ? "Sign in to continue writing"
                : "Start your writing journey with Inkwell"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            {/* Placeholder form — will be replaced by Clerk SignIn/SignUp */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-soft-lg border border-warm-100 p-8 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-sans text-warm-600">
                  Email
                </label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-sans text-warm-600">
                  Password
                </label>
                <Input type="password" placeholder="Enter your password" />
              </div>
              {mode === "sign-up" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-sans text-warm-600">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
              <Button type="submit" className="w-full mt-2">
                {mode === "sign-in" ? "Sign In" : "Create Account"}
              </Button>
              <p className="text-center text-xs text-warm-400 mt-3">
                Auth placeholder — Clerk will be wired in later.
              </p>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() =>
                setMode(mode === "sign-in" ? "sign-up" : "sign-in")
              }
              className="text-sm text-warm-500 hover:text-accent transition-colors font-sans cursor-pointer"
            >
              {mode === "sign-in"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
