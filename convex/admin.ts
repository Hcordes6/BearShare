import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Submit a course request
 */
export const submitCourseRequest = mutation({
    args: {
        className: v.string(),
        classTag: v.string(),
        description: v.optional(v.string()),
    },
    returns: v.id("courseRequests"),
    handler: async (ctx, args) => {
        return await ctx.db.insert("courseRequests", {
            className: args.className,
            classTag: args.classTag,
            description: args.description,
            status: "pending",
        });
    },
});

/**
 * Get all course requests (admin only - simple password check)
 */
export const getCourseRequests = query({
    args: {
        adminPassword: v.string(),
    },
    returns: v.union(
        v.array(
            v.object({
                _id: v.id("courseRequests"),
                _creationTime: v.number(),
                className: v.string(),
                classTag: v.string(),
                description: v.optional(v.string()),
                status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
            })
        ),
        v.null()
    ),
    handler: async (ctx, args) => {
        // Simple password check - in production, use proper authentication
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (args.adminPassword !== correctPassword) {
            return null;
        }

        const requests = await ctx.db
            .query("courseRequests")
            .withIndex("by_status", (q) => q.eq("status", "pending"))
            .collect();

        return requests;
    },
});

/**
 * Create a course (admin only)
 */
export const createCourse = mutation({
    args: {
        name: v.string(),
        tag: v.string(),
        adminPassword: v.string(),
    },
    returns: v.union(v.id("courses"), v.null()),
    handler: async (ctx, args) => {
        // Simple password check
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (args.adminPassword !== correctPassword) {
            return null;
        }

        return await ctx.db.insert("courses", {
            name: args.name,
            tag: args.tag,
            memberCount: 0,
        });
    },
});

/**
 * Approve a course request and create the course (admin only)
 */
export const approveCourseRequest = mutation({
    args: {
        requestId: v.id("courseRequests"),
        adminPassword: v.string(),
    },
    returns: v.union(v.id("courses"), v.null()),
    handler: async (ctx, args) => {
        // Simple password check
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (args.adminPassword !== correctPassword) {
            return null;
        }

        const request = await ctx.db.get(args.requestId);
        if (!request || request.status !== "pending") {
            return null;
        }

        // Create the course
        const courseId = await ctx.db.insert("courses", {
            name: request.className,
            tag: request.classTag,
            memberCount: 0,
        });

        // Update request status
        await ctx.db.patch(args.requestId, {
            status: "approved",
        });

        return courseId;
    },
});

/**
 * Reject a course request (admin only)
 */
export const rejectCourseRequest = mutation({
    args: {
        requestId: v.id("courseRequests"),
        adminPassword: v.string(),
    },
    returns: v.union(v.boolean(), v.null()),
    handler: async (ctx, args) => {
        // Simple password check
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (args.adminPassword !== correctPassword) {
            return null;
        }

        const request = await ctx.db.get(args.requestId);
        if (!request || request.status !== "pending") {
            return null;
        }

        await ctx.db.patch(args.requestId, {
            status: "rejected",
        });

        return true;
    },
});

