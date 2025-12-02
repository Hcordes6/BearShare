import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.

// essentially defining tables for the database -- update mutations in posts.ts 
// when changing the schema
export default defineSchema({
  courses: defineTable({
    name: v.string(),
    tag: v.string(),
    memberCount: v.number(),
  }),
  posts: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    content: v.optional(v.string()),
    file: v.optional(v.id("_storage")),
  }).index("by_course", ["courseId"]), // index to query posts by courseId -- more efficient lookup
});
