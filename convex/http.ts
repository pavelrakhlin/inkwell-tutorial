import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import OpenAI from "openai";

const http = httpRouter();

http.route({
  path: "/ai/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response("Unauthorized", { status: 401 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    const body = await request.json();
    const { documentContent, knowledgeItems, chatHistory, userMessage } = body;

    const knowledgeContext =
      knowledgeItems && knowledgeItems.length > 0
        ? `\n\nReference Materials:\n${knowledgeItems
            .map(
              (k: { title: string; content: string }) =>
                `--- ${k.title} ---\n${k.content}`
            )
            .join("\n\n")}`
        : "";

    const documentContext = documentContent
      ? `\n\nCurrent Document Content:\n${documentContent}`
      : "\n\nThe document is currently empty.";

    const systemPrompt = `You are Inkwell, an intelligent writing assistant. You help users write and edit documents. You have access to the current document content and any reference materials the user has added.

When the user asks you to write or edit content, provide the text they can insert into their document. Be articulate, clear, and match the tone the user is going for.

When referencing knowledge items, weave the information naturally into the writing. Do not just copy-paste from references.${documentContext}${knowledgeContext}`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(chatHistory || []).map(
        (msg: { role: "user" | "assistant"; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })
      ),
      { role: "user", content: userMessage },
    ];

    const openai = new OpenAI({ apiKey });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const streamResponse = async () => {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            await writer.write(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
      } finally {
        await writer.close();
      }
    };

    void streamResponse();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }),
});

// Handle CORS preflight
http.route({
  path: "/ai/chat",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }),
});

export default http;
