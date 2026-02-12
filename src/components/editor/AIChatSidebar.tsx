import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ChatMessage from "./ChatMessage";
import Button from "../ui/Button";

interface AIChatSidebarProps {
  documentId: Id<"documents">;
  documentContent: string;
}

export default function AIChatSidebar({
  documentId,
  documentContent,
}: AIChatSidebarProps) {
  const messages = useQuery(api.messages.listByDocument, { documentId });
  const knowledge = useQuery(api.knowledge.listByDocument, { documentId });
  const sendMessage = useMutation(api.messages.send);
  const clearMessages = useMutation(api.messages.clear);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const insertIntoDocument = useCallback((text: string) => {
    const insertFn = (window as unknown as Record<string, (text: string) => void>).__inkwellEditorInsert;
    if (insertFn) {
      insertFn(text);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    // Save user message
    await sendMessage({
      documentId,
      role: "user",
      content: userMessage,
    });

    try {
      // Build context
      const knowledgeItems =
        knowledge?.map((k) => ({
          title: k.title,
          content: k.content,
        })) || [];

      const chatHistory =
        messages?.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })) || [];

      // Call the streaming HTTP endpoint
      const convexSiteUrl = import.meta.env.VITE_CONVEX_URL as string;
      // Derive site URL from cloud URL
      const siteUrl = convexSiteUrl.replace(".cloud", ".site");

      const response = await fetch(`${siteUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentContent,
          knowledgeItems,
          chatHistory,
          userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }
      }

      // Save assistant response
      if (fullResponse) {
        await sendMessage({
          documentId,
          role: "assistant",
          content: fullResponse,
        });
      }
    } catch (error) {
      console.error("AI chat error:", error);
      await sendMessage({
        documentId,
        role: "assistant",
        content:
          "I'm sorry, I encountered an error. Please make sure the OpenAI API key is configured and try again.",
      });
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    await clearMessages({ documentId });
  };

  return (
    <div className="w-80 border-l border-warm-100 bg-warm-white flex flex-col h-full shrink-0">
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
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
            />
          </svg>
          <h2 className="font-serif text-sm font-semibold text-warm-800">
            AI Assistant
          </h2>
        </div>
        {messages && messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-1 rounded-md text-warm-400 hover:text-warm-600 hover:bg-warm-100 transition-colors cursor-pointer"
            title="Clear chat"
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {(!messages || messages.length === 0) && !streamingContent && (
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
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
              />
            </svg>
            <p className="text-xs text-warm-400 leading-relaxed px-4">
              Ask the AI to help you write, edit, or expand your document. It
              will use any added knowledge as context.
            </p>
            <div className="mt-4 space-y-1.5">
              {[
                "Write an introduction paragraph",
                "Summarize the key points",
                "Expand on the last section",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="block w-full text-left px-3 py-2 text-xs text-warm-500 hover:text-warm-700 hover:bg-warm-50 rounded-lg transition-colors cursor-pointer"
                >
                  &ldquo;{suggestion}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages?.map((msg) => (
          <ChatMessage
            key={msg._id}
            role={msg.role}
            content={msg.content}
            onInsertToDocument={
              msg.role === "assistant"
                ? () => insertIntoDocument(msg.content)
                : undefined
            }
          />
        ))}

        {streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            isStreaming
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-warm-100 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI to help you write..."
            className="flex-1 px-3 py-2 text-sm font-sans bg-warm-50 border border-warm-200 rounded-xl text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none max-h-[120px] leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-xl h-9 w-9 p-0 flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
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
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
