import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createTextPost = mutation({
    args: {
        title: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.insert("posts", {
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
    args: { storageId: v.id("_storage"), title: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("posts", {
            file: args.storageId,
            title: args.title,
        });
    },
});

export const getPosts = query({
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
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").collect();
        return await Promise.all(
            posts.map(async (post) => ({
                ...post,
                fileUrl: post.file ? await ctx.storage.getUrl(post.file) : null,
            }))
        );
    },
});