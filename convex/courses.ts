import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCourse = query({
    args: { courseId: v.id("courses") },
    returns: v.union(
        v.object({
            _id: v.id("courses"),
            _creationTime: v.number(),
            name: v.string(),
            tag: v.string(),
            memberCount: v.number(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const course = await ctx.db.get(args.courseId);
        return course;
    },
});

export const getAllCourses = query({
    returns: v.array(
        v.object({
            _id: v.id("courses"),
            _creationTime: v.number(),
            name: v.string(),
            tag: v.string(),
            memberCount: v.number(),
        })
    ),
    handler: async (ctx) => {
        const courses = await ctx.db.query("courses").collect();
        return courses;
    },
});

