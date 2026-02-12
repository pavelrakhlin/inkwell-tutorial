import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CreateDocumentButton() {
  const createDocument = useMutation(api.documents.create);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const documentId = await createDocument();
    navigate(`/document/${documentId}`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreate}
      className="group bg-white rounded-2xl border-2 border-dashed border-warm-200 p-6 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 flex flex-col items-center justify-center min-h-[180px]"
    >
      <div className="w-12 h-12 rounded-xl bg-warm-100 group-hover:bg-accent/10 flex items-center justify-center mb-3 transition-colors duration-200">
        <svg
          className="w-6 h-6 text-warm-400 group-hover:text-accent transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <span className="font-sans text-sm font-medium text-warm-500 group-hover:text-accent transition-colors duration-200">
        New Document
      </span>
    </motion.button>
  );
}
