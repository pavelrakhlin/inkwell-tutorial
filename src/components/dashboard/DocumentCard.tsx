import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { formatDate, truncateText } from "../../lib/utils";
import { motion } from "framer-motion";

interface DocumentCardProps {
  id: Id<"documents">;
  title: string;
  content: string;
  lastSavedAt: number;
}

export default function DocumentCard({
  id,
  title,
  content,
  lastSavedAt,
}: DocumentCardProps) {
  const navigate = useNavigate();
  const removeDocument = useMutation(api.documents.remove);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      await removeDocument({ id });
    }
  };

  // Try to extract plain text from content for preview
  const getPreview = (content: string): string => {
    if (!content) return "Empty document";
    try {
      const parsed = JSON.parse(content);
      const extractText = (node: Record<string, unknown>): string => {
        if (node.text) return node.text as string;
        if (node.content && Array.isArray(node.content)) {
          return (node.content as Record<string, unknown>[]).map(extractText).join(" ");
        }
        return "";
      };
      const text = extractText(parsed);
      return text || "Empty document";
    } catch {
      return content || "Empty document";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/document/${id}`)}
      className="group bg-white rounded-2xl border border-warm-100 p-6 cursor-pointer hover:shadow-soft-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-lg font-semibold text-warm-800 truncate pr-4">
          {title}
        </h3>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-warm-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
          title="Delete document"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>

      <p className="text-sm text-warm-400 leading-relaxed mb-4">
        {truncateText(getPreview(content), 120)}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-warm-400">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span>{formatDate(lastSavedAt)}</span>
      </div>
    </motion.div>
  );
}
