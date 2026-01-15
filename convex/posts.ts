import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createTextPost = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.string(),
        content: v.string(),
        likes: v.array(v.id("users")),
        dislikes: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to create a post");
        }

        const userId = identity.subject;

        // Check if user is a member of the course
        const membership = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user_and_course", (q) =>
                q.eq("userId", userId).eq("courseId", args.courseId)
            )
            .first();

        if (!membership) {
            throw new Error("You must join the course before posting");
        }

        const post = await ctx.db.insert("posts", {
            courseId: args.courseId,
            title: args.title,
            content: args.content,
            likes: args.likes,
            dislikes: args.dislikes,
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to create a post");
        }

        const userId = identity.subject;

        // Check if user is a member of the course
        const membership = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user_and_course", (q) =>
                q.eq("userId", userId).eq("courseId", args.courseId)
            )
            .first();

        if (!membership) {
            throw new Error("You must join the course before posting");
        }

        await ctx.db.insert("posts", {
            courseId: args.courseId,
            file: args.storageId,
            title: args.title,
            likes: [],
            dislikes: [],
        });
    },
});

export const getPosts = query({
    args: { courseId: v.id("courses") },
    returns: v.array(
        v.object({
            _id: v.id("posts"),
            _creationTime: v.number(),
            courseId: v.id("courses"),
            title: v.string(),
            content: v.optional(v.string()),
            file: v.optional(v.id("_storage")),
            fileUrl: v.union(v.string(), v.null()),
            likes: v.array(v.id("users")),
            dislikes: v.array(v.id("users")),
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
                likes: post.likes,
                dislikes: post.dislikes,
            }))
        );
    },
});

export const likePost = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to like a post");
        }
        const userId = identity.subject;
        const post = await ctx.db.get(args.postId);
        if (post?.likes.includes(userId)) {
            await ctx.db.patch(args.postId, { likes: post?.likes.filter((id: Id<"users">) => id !== userId) || [] });
        } else {
            await ctx.db.patch(args.postId, { likes: [...post?.likes || [], userId as Id<"users">] });
        }
        return post;
    },
});