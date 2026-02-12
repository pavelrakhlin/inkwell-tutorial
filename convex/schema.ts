import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    lastSavedAt: v.number(),
  }).index("by_user", ["userId"]),

  knowledge: defineTable({
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
    userId: v.string(),
  }).index("by_document", ["documentId"]),

  messages: defineTable({
    documentId: v.id("documents"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    userId: v.string(),
  }).index("by_document", ["documentId"]),
});
