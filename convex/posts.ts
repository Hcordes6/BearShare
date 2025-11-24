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
    handler: async (ctx) => {
        return await ctx.db.query("posts").collect();
    },
});