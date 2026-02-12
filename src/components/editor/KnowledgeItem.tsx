import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { truncateText } from "../../lib/utils";
import { motion } from "framer-motion";

interface KnowledgeItemProps {
  id: Id<"knowledge">;
  title: string;
  content: string;
}

export default function KnowledgeItem({
  id,
  title,
  content,
}: KnowledgeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const removeKnowledge = useMutation(api.knowledge.remove);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeKnowledge({ id });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="bg-warm-50 rounded-xl border border-warm-100 overflow-hidden"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start gap-2 p-3 cursor-pointer hover:bg-warm-100/50 transition-colors"
      >
        <svg
          className={`w-4 h-4 text-warm-400 mt-0.5 shrink-0 transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-warm-700 truncate">
            {title}
          </h4>
          {!isExpanded && (
            <p className="text-xs text-warm-400 mt-0.5 truncate">
              {truncateText(content, 60)}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="p-1 text-warm-300 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
          title="Remove knowledge"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-3 pb-3"
        >
          <p className="text-xs text-warm-500 leading-relaxed whitespace-pre-wrap pl-6">
            {content}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
