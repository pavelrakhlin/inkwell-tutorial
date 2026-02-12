import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
    return documents.sort((a, b) => b.lastSavedAt - a.lastSavedAt);
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== identity.subject) {
      return null;
    }
    return document;
  },
});

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const documentId = await ctx.db.insert("documents", {
      title: "Untitled Document",
      content: "",
      userId: identity.subject,
      lastSavedAt: Date.now(),
    });
    return documentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== identity.subject) {
      throw new Error("Document not found");
    }
    const updates: Record<string, unknown> = {
      lastSavedAt: Date.now(),
    };
    if (args.title !== undefined) {
      updates.title = args.title;
    }
    if (args.content !== undefined) {
      updates.content = args.content;
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== identity.subject) {
      throw new Error("Document not found");
    }

    // Delete associated knowledge items
    const knowledgeItems = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    for (const item of knowledgeItems) {
      await ctx.db.delete(item._id);
    }

    // Delete associated messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(args.id);
  },
});
