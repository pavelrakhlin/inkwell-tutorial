import { useQuery } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import DocumentCard from "../components/dashboard/DocumentCard";
import CreateDocumentButton from "../components/dashboard/CreateDocumentButton";

function DashboardContent() {
  const documents = useQuery(api.documents.list);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="border-b border-warm-100 bg-warm-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl font-bold text-warm-900 mb-1">
            Your Documents
          </h1>
          <p className="text-warm-500 mb-8">
            Create a new document or continue where you left off.
          </p>
        </motion.div>

        {documents === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-warm-50 rounded-2xl border border-warm-100 p-6 animate-pulse min-h-[180px]"
              >
                <div className="h-5 bg-warm-100 rounded w-2/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-warm-100 rounded w-full" />
                  <div className="h-3 bg-warm-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <CreateDocumentButton />
            <AnimatePresence>
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  id={doc._id}
                  title={doc.title}
                  content={doc.content}
                  lastSavedAt={doc.lastSavedAt}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {documents && documents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-warm-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-warm-700 mb-2">
              No documents yet
            </h3>
            <p className="text-warm-400 text-sm">
              Click "New Document" above to start writing your first document.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-warm-white flex items-center justify-center">
          <div className="animate-pulse text-warm-400 font-sans">
            Loading...
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <Navigate to="/auth" replace />
      </Unauthenticated>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
    </>
  );
}
