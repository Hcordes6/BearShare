import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserId } from "./auth";

/**
 * Join a course. Requires authentication (Clerk or Admin).
 */
export const joinCourse = mutation({
    args: { 
        courseId: v.id("courses"),
        adminPassword: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx, args.adminPassword);
        if (!userId) {
            throw new Error("Must be logged in to join a course");
        }

        // Check if already a member
        const existing = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user_and_course", (q) =>
                q.eq("userId", userId).eq("courseId", args.courseId)
            )
            .first();

        if (existing) {
            // Already a member, do nothing
            return null;
        }

        // Add membership
        await ctx.db.insert("userCourseMemberships", {
            userId,
            courseId: args.courseId,
        });

        // Increment member count
        const course = await ctx.db.get(args.courseId);
        if (course) {
            await ctx.db.patch(args.courseId, {
                memberCount: course.memberCount + 1,
            });
        }

        return null;
    },
});

/**
 * Leave a course. Requires authentication (Clerk or Admin).
 */
export const leaveCourse = mutation({
    args: { 
        courseId: v.id("courses"),
        adminPassword: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx, args.adminPassword);
        if (!userId) {
            throw new Error("Must be logged in to leave a course");
        }

        // Find and remove membership
        const existing = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user_and_course", (q) =>
                q.eq("userId", userId).eq("courseId", args.courseId)
            )
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);

            // Decrement member count (don't go below 0)
            const course = await ctx.db.get(args.courseId);
            if (course) {
                await ctx.db.patch(args.courseId, {
                    memberCount: Math.max(0, course.memberCount - 1),
                });
            }
        }

        return null;
    },
});

/**
 * Check if the current user is a member of a course.
 */
export const isMember = query({
    args: { 
        courseId: v.id("courses"),
        adminPassword: v.optional(v.string()),
    },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx, args.adminPassword);
        if (!userId) {
            return false;
        }

        const membership = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user_and_course", (q) =>
                q.eq("userId", userId).eq("courseId", args.courseId)
            )
            .first();

        return membership !== null;
    },
});

/**
 * Get all courses the current user has joined.
 */
export const getMyCourses = query({
    args: {
        adminPassword: v.optional(v.string()),
    } as any, // Make args optional by allowing empty object
    returns: v.array(
        v.object({
            _id: v.id("courses"),
            _creationTime: v.number(),
            name: v.string(),
            tag: v.string(),
            memberCount: v.number(),
        })
    ),
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx, args.adminPassword);
        if (!userId) {
            return [];
        }

        // Get all memberships for this user
        const memberships = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Get the courses
        const courses = await Promise.all(
            memberships.map((membership) => ctx.db.get(membership.courseId))
        );

        // Filter out any null courses and return
        return courses.filter(
            (course): course is NonNullable<typeof course> => course !== null
        );
    },
});

/**
 * Get membership status for multiple courses (returns a map of courseId -> isMember)
 */
export const getMembershipStatus = query({
    args: { 
        courseIds: v.array(v.id("courses")),
        adminPassword: v.optional(v.string()),
    },
    returns: v.record(v.id("courses"), v.boolean()),
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx, args.adminPassword);
        if (!userId) {
            // Return all false if not authenticated
            return Object.fromEntries(
                args.courseIds.map((id) => [id, false])
            ) as Record<string, boolean>;
        }

        // Get all memberships for this user and the specified courses
        const memberships = await ctx.db
            .query("userCourseMemberships")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const status: Record<string, boolean> = {};

        // Initialize all to false
        for (const courseId of args.courseIds) {
            status[courseId] = false;
        }

        // Mark courses where user is a member
        for (const membership of memberships) {
            if (args.courseIds.includes(membership.courseId)) {
                status[membership.courseId] = true;
            }
        }

        return status as Record<string, boolean>;
    },
});

