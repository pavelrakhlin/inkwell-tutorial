import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useNavigate } from "react-router-dom";
import { formatLastSaved } from "../../lib/utils";

interface DocumentHeaderProps {
  documentId: Id<"documents">;
  title: string;
  lastSavedAt: number;
}

export default function DocumentHeader({
  documentId,
  title,
  lastSavedAt,
}: DocumentHeaderProps) {
  const [editTitle, setEditTitle] = useState(title);
  const updateDocument = useMutation(api.documents.update);
  const navigate = useNavigate();

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const handleTitleBlur = useCallback(() => {
    if (editTitle !== title) {
      updateDocument({ id: documentId, title: editTitle || "Untitled Document" });
    }
  }, [editTitle, title, documentId, updateDocument]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  // Update saved time display periodically
  const [savedText, setSavedText] = useState(formatLastSaved(lastSavedAt));
  useEffect(() => {
    setSavedText(formatLastSaved(lastSavedAt));
    const interval = setInterval(() => {
      setSavedText(formatLastSaved(lastSavedAt));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  return (
    <div className="flex items-center gap-3 px-4 h-14 border-b border-warm-100 bg-warm-white shrink-0">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="p-1.5 rounded-md text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors cursor-pointer"
        title="Back to Dashboard"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      {/* Inkwell logo */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-warm-200">
        <svg
          className="w-4 h-4 text-accent"
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
        <span className="font-serif text-sm font-semibold text-warm-700 hidden sm:inline">
          Inkwell
        </span>
      </div>

      {/* Title input */}
      <input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 font-serif text-lg font-semibold text-warm-800 bg-transparent border-none outline-none placeholder:text-warm-300 min-w-0"
        placeholder="Untitled Document"
      />

      {/* Save status */}
      <span className="text-xs text-warm-400 font-sans whitespace-nowrap">
        {savedText}
      </span>
    </div>
  );
}
