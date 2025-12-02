import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";

interface PostCardProps {
    courseId: Id<"courses">;
}

export default function PostCard({ courseId }: PostCardProps) {
    const posts = useQuery(api.posts.getPosts, { courseId });

    if (posts === undefined) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Loading posts...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No posts yet. Be the first to share something!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {posts.map(post => (
                <div 
                    key={post._id}
                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(post._creationTime).toLocaleDateString()}
                        </span>
                    </div>
                    {post.content && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                            {post.content}
                        </p>
                    )}
                    {post.fileUrl && (
                        <div className="mt-4">
                            <a
                                href={post.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <Image 
                                    src={post.fileUrl} 
                                    alt={post.title} 
                                    width={400} 
                                    height={300}
                                    className="rounded-lg border border-gray-200 dark:border-gray-700 max-w-full h-auto"
                                />
                            </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}