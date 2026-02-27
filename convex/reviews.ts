import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { create } from "domain";

export const createReview = mutation({
    args: {
        courseId: v.id("courses"),
        rating: v.number(),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to create a review");
        }
        await ctx.db.insert("reviews", {
            courseId: args.courseId,
            authorId: identity.subject,
            rating: args.rating,
            comment: args.comment,
        });
    },
})

export const getReviews = query({
    args: { courseId: v.id("courses") },
    returns: v.array(
        v.object({
            _id: v.id("reviews"),
            _creationTime: v.number(),
            courseId: v.id("courses"),
            authorId: v.string(),
            rating: v.number(),
            comment: v.optional(v.string()),
        })
    ),
    handler: async (ctx, args) => {
        const reviews = await ctx.db.query("reviews").withIndex("by_course", (q) => q.eq("courseId", args.courseId)).collect();
        return reviews;
    },
});