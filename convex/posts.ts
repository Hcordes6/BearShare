import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createTextPost = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.insert("posts", {
            courseId: args.courseId,
            title: args.title,
            content: args.content,
        });
        return post;
    },
});

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const createFilePost = mutation({
    args: { courseId: v.id("courses"), storageId: v.id("_storage"), title: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("posts", {
            courseId: args.courseId,
            file: args.storageId,
            title: args.title,
        });
    },
});

export const getPosts = query({
    args: { courseId: v.id("courses") },
    returns: v.array(
        v.object({
            _id: v.id("posts"),
            _creationTime: v.number(),
            title: v.string(),
            content: v.optional(v.string()),
            file: v.optional(v.id("_storage")),
            fileUrl: v.union(v.string(), v.null()),
        })
    ),
    handler: async (ctx, args) => {
        // Using index for fast lookup
        const posts = await ctx.db
            .query("posts")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .order("desc")
            .collect();
        
        return await Promise.all(
            posts.map(async (post) => ({
                ...post,
                fileUrl: post.file ? await ctx.storage.getUrl(post.file) : null,
            }))
        );
    },
});