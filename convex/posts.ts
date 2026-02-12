import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createTextPost = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.string(),
        content: v.string(),
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
            authorId: userId,
            title: args.title,
            content: args.content,
            likes: [],
            dislikes: [],
        });
        return post;
    },
});

export const generateUploadUrl = mutation({
    args: {},
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
            authorId: userId,
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
            authorId: v.string(),
            title: v.string(),
            content: v.optional(v.string()),
            file: v.optional(v.id("_storage")),
            fileUrl: v.union(v.string(), v.null()),
            likes: v.array(v.string()),
            dislikes: v.array(v.string()),
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
                likes: post.likes || [],
                dislikes: post.dislikes || [],
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
        if (!post) {
            throw new Error("Post not found");
        }
        
        const currentLikes = post.likes || [];
        const currentDislikes = post.dislikes || [];
        
        // If user already liked, remove the like (toggle off)
        if (currentLikes.includes(userId)) {
            await ctx.db.patch(args.postId, { 
                likes: currentLikes.filter((id: string) => id !== userId)
            });
        } else {
            // Add like and remove from dislikes if present (mutual exclusivity)
            await ctx.db.patch(args.postId, { 
                likes: [...currentLikes, userId],
                dislikes: currentDislikes.filter((id: string) => id !== userId)
            });
        }
    },
});

export const dislikePost = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to dislike a post");
        }
        const userId = identity.subject;
        const post = await ctx.db.get(args.postId);
        if (!post) {
            throw new Error("Post not found");
        }
        
        const currentLikes = post.likes || [];
        const currentDislikes = post.dislikes || [];
        
        // If user already disliked, remove the dislike (toggle off)
        if (currentDislikes.includes(userId)) {
            await ctx.db.patch(args.postId, { 
                dislikes: currentDislikes.filter((id: string) => id !== userId)
            });
        } else {
            // Add dislike and remove from likes if present (mutual exclusivity)
            await ctx.db.patch(args.postId, { 
                dislikes: [...currentDislikes, userId],
                likes: currentLikes.filter((id: string) => id !== userId)
            });
        }
    },
});

// Migration function to add likes/dislikes fields to existing posts
// Run this once to fix existing posts in the database
export const migratePostsAddLikesDislikes = mutation({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").collect();
        let updated = 0;
        
        for (const post of posts) {
            const updates: { likes?: string[]; dislikes?: string[] } = {};
            
            if (post.likes === undefined) {
                updates.likes = [];
            }
            if (post.dislikes === undefined) {
                updates.dislikes = [];
            }
            
            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(post._id, updates);
                updated++;
            }
        }
        
        return { updated, total: posts.length };
    },
});

export const getAuthorId = query({
    args: { courseId: v.id("courses") },
    returns: v.array(v.object({ postId: v.id("posts"), authorId: v.string() })),
    handler: async (ctx, args) => {
        const posts = await ctx.db
            .query("posts")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();
        return posts.map((post) => ({
            postId: post._id,
            authorId: post.authorId,
        }));
    }
})