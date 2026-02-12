import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onInsertToDocument?: () => void;
}

export default function ChatMessage({
  role,
  content,
  isStreaming,
  onInsertToDocument,
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex flex-col gap-1",
        role === "user" ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          role === "user"
            ? "bg-warm-800 text-warm-50"
            : "bg-warm-50 border border-warm-100 text-warm-700"
        )}
      >
        <div className="whitespace-pre-wrap font-sans">{content}</div>
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-accent/60 animate-pulse ml-0.5 align-middle rounded-sm" />
        )}
      </div>

      {role === "assistant" && !isStreaming && content && onInsertToDocument && (
        <button
          onClick={onInsertToDocument}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-warm-400 hover:text-accent transition-all duration-200 px-1 cursor-pointer"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Insert into document
        </button>
      )}
    </motion.div>
  );
}
