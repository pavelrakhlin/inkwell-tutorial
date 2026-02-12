import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const add = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== identity.subject) {
      throw new Error("Document not found");
    }
    return await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      title: args.title,
      content: args.content,
      userId: identity.subject,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("knowledge") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== identity.subject) {
      throw new Error("Knowledge item not found");
    }
    await ctx.db.delete(args.id);
  },
});
