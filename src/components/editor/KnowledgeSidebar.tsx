import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AnimatePresence, motion } from "framer-motion";
import KnowledgeItem from "./KnowledgeItem";
import Button from "../ui/Button";

interface KnowledgeSidebarProps {
  documentId: Id<"documents">;
}

export default function KnowledgeSidebar({
  documentId,
}: KnowledgeSidebarProps) {
  const knowledge = useQuery(api.knowledge.listByDocument, { documentId });
  const addKnowledge = useMutation(api.knowledge.add);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    await addKnowledge({
      documentId,
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  return (
    <div className="w-72 border-r border-warm-100 bg-warm-white flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-warm-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          <h2 className="font-serif text-sm font-semibold text-warm-800">
            Knowledge
          </h2>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded-md text-warm-400 hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
            title="Add knowledge"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-warm-100 overflow-hidden"
          >
            <div className="p-3 space-y-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Knowledge title..."
                className="w-full px-2.5 py-1.5 text-sm font-sans bg-white border border-warm-200 rounded-lg text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                autoFocus
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste or type your reference text..."
                className="w-full px-2.5 py-1.5 text-sm font-sans bg-white border border-warm-200 rounded-lg text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none h-32"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} className="flex-1">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {knowledge === undefined ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-warm-50 rounded-xl border border-warm-100 p-3 animate-pulse"
              >
                <div className="h-4 bg-warm-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-warm-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : knowledge.length === 0 && !isAdding ? (
          <div className="text-center py-8">
            <svg
              className="w-8 h-8 text-warm-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="text-xs text-warm-400 leading-relaxed">
              Add reference materials for the AI to use when helping you write.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {knowledge?.map((item) => (
              <KnowledgeItem
                key={item._id}
                id={item._id}
                title={item.title}
                content={item.content}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
