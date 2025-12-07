"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Header from "../../components/header";
import AddPost from "../../components/addPost";
import PostCard from "../../components/postCard";

export default function CoursePage() {
    const params = useParams();
    const courseId = params.courseId as Id<"courses">;
    const { isSignedIn } = useUser();

    const course = useQuery(api.courses.getCourse, { courseId });
    const isMember = useQuery(
        api.memberships.isMember,
        isSignedIn ? { courseId } : "skip"
    );

    if (course === undefined) {
        return (
            <div className="flex flex-col min-h-screen bg-background pt-18">
                <Header />
                <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">Loading...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (course === null) {
        return (
            <div className="flex flex-col min-h-screen bg-background pt-18">
                <Header />
                <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
                            <p className="text-gray-600">
                                The course you're looking for doesn't exist.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pt-22">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Course Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {course.name}
                        </h1>
                        
                        {/* Tag and AddPost inline */}
                        <div className="flex flex-row items-center justify-between gap-4 mb-4">
                            <p className="text-gray-600">
                                {course.tag}
                            </p>
                            
                            {/* Add Post Component - inline with tag, only show if user is a member */}
                            {isSignedIn && isMember && (
                                <div className="shrink-0">
                                    <AddPost courseId={courseId} />
                                </div>
                            )}
                            {isSignedIn && !isMember && (
                                <div className="shrink-0">
                                    <p className="text-sm text-gray-500 italic">
                                        Join this course to post
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Member Count on separate line */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span>{course.memberCount} {course.memberCount === 1 ? "member" : "members"}</span>
                        </div>
                    </div>

                    {/* Posts */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Posts</h2>
                        <PostCard courseId={courseId} />
                    </div>
                </div>
            </main>
        </div>
    );
}

