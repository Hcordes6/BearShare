import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const createPost = mutation({
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

export const getPosts = query({
    handler: async (ctx) => {
        return await ctx.db.query("posts").collect();
    },
});