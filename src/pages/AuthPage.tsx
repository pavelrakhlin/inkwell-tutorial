import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  const clerkAppearance = {
    elements: {
      rootBox: "mx-auto",
      card: "shadow-soft-lg border border-warm-100 rounded-2xl",
      headerTitle: "font-serif text-warm-900",
      headerSubtitle: "text-warm-500",
      formButtonPrimary:
        "bg-warm-800 hover:bg-warm-900 text-sm font-sans rounded-lg",
      formFieldInput:
        "border-warm-200 rounded-lg focus:ring-accent focus:border-accent font-sans",
      formFieldLabel: "text-warm-600 font-sans text-sm",
      footerActionLink: "text-accent hover:text-accent-dark font-sans",
      identityPreviewText: "font-sans text-warm-600",
      identityPreviewEditButton: "text-accent",
      dividerLine: "bg-warm-200",
      dividerText: "text-warm-400 font-sans",
      socialButtonsBlockButton:
        "border-warm-200 text-warm-700 font-sans rounded-lg hover:bg-warm-50",
    },
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
        <div className="w-full max-w-md">
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
            {mode === "sign-in" ? (
              <SignIn
                appearance={clerkAppearance}
                routing="hash"
                afterSignInUrl="/dashboard"
                signUpUrl="#sign-up"
              />
            ) : (
              <SignUp
                appearance={clerkAppearance}
                routing="hash"
                afterSignUpUrl="/dashboard"
                signInUrl="#sign-in"
              />
            )}
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
