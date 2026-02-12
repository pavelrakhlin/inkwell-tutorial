"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const chat = internalAction({
  args: {
    documentContent: v.string(),
    knowledgeItems: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
      })
    ),
    chatHistory: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    userMessage: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const openai = new OpenAI({ apiKey });

    const knowledgeContext =
      args.knowledgeItems.length > 0
        ? `\n\nReference Materials:\n${args.knowledgeItems
            .map((k) => `--- ${k.title} ---\n${k.content}`)
            .join("\n\n")}`
        : "";

    const documentContext = args.documentContent
      ? `\n\nCurrent Document Content:\n${args.documentContent}`
      : "\n\nThe document is currently empty.";

    const systemPrompt = `You are Inkwell, an intelligent writing assistant. You help users write and edit documents. You have access to the current document content and any reference materials the user has added.

When the user asks you to write or edit content, provide the text they can insert into their document. Be articulate, clear, and match the tone the user is going for.

When referencing knowledge items, weave the information naturally into the writing. Do not just copy-paste from references.${documentContext}${knowledgeContext}`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...args.chatHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: args.userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content ?? "I could not generate a response.";
  },
});
