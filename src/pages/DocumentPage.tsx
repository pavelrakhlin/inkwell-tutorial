import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import DocumentHeader from "../components/editor/DocumentHeader";
import TiptapEditor from "../components/editor/Editor";
import KnowledgeSidebar from "../components/editor/KnowledgeSidebar";
import AIChatSidebar from "../components/editor/AIChatSidebar";

// TODO: When Clerk is configured, restore auth guards:
// import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const documentId = id as Id<"documents">;
  const document = useQuery(api.documents.get, { id: documentId });
  const [documentText, setDocumentText] = useState("");

  // Loading state
  if (document === undefined) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-warm-300 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-warm-400 font-sans">
            Loading document...
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (document === null) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col bg-warm-white overflow-hidden"
    >
      {/* Document Header */}
      <DocumentHeader
        documentId={documentId}
        title={document.title}
        lastSavedAt={document.lastSavedAt}
      />

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Knowledge */}
        <KnowledgeSidebar documentId={documentId} />

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TiptapEditor
            documentId={documentId}
            initialContent={document.content}
            onContentChange={setDocumentText}
          />
        </div>

        {/* Right sidebar - AI Chat */}
        <AIChatSidebar
          documentId={documentId}
          documentContent={documentText}
        />
      </div>
    </motion.div>
  );
}
