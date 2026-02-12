import { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  documentId: Id<"documents">;
  initialContent: string;
  onContentChange?: (text: string) => void;
}

export default function TiptapEditor({
  documentId,
  initialContent,
  onContentChange,
}: EditorProps) {
  const updateDocument = useMutation(api.documents.update);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: initialContent ? (() => {
      try {
        return JSON.parse(initialContent);
      } catch {
        return initialContent;
      }
    })() : "",
    editorProps: {
      attributes: {
        class: "tiptap min-h-[calc(100vh-12rem)] px-12 py-8 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (!isInitializedRef.current) return;

      const json = JSON.stringify(editor.getJSON());
      const text = editor.getText();

      // Notify parent of text content for AI context
      onContentChange?.(text);

      // Debounced auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        updateDocument({ id: documentId, content: json });
      }, 2000);
    },
  });

  // Set initial content only once
  useEffect(() => {
    if (editor && initialContent && !isInitializedRef.current) {
      try {
        const parsed = JSON.parse(initialContent);
        editor.commands.setContent(parsed);
      } catch {
        if (initialContent) {
          editor.commands.setContent(initialContent);
        }
      }
      isInitializedRef.current = true;
    } else if (editor && !initialContent && !isInitializedRef.current) {
      isInitializedRef.current = true;
    }
  }, [editor, initialContent]);

  // Method to insert text at cursor (used by AI chat)
  const insertText = useCallback(
    (text: string) => {
      if (editor) {
        editor.chain().focus().insertContent(text).run();
      }
    },
    [editor]
  );

  // Expose insertText method via ref on a data attribute
  useEffect(() => {
    if (editor) {
      (window as unknown as Record<string, unknown>).__inkwellEditorInsert = insertText;
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__inkwellEditorInsert;
    };
  }, [editor, insertText]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
