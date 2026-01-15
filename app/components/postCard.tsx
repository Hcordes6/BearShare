import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface PostCardProps {
    courseId: Id<"courses">;
}

export default function PostCard({ courseId }: PostCardProps) {
    const posts = useQuery(api.posts.getPosts, { courseId });
    const { isAuthenticated } = useConvexAuth();
    const { userId } = useAuth();
    const likePost = useMutation(api.posts.likePost);
    const dislikePost = useMutation(api.posts.dislikePost);

    const membershipStatus = useQuery(
        api.memberships.getMembershipStatus,
        isAuthenticated && courseId ? { courseIds: [courseId] } : "skip"
    );
    const isMember = membershipStatus?.[courseId];

    if (posts === undefined) {
        return (
            <div className="text-center text-gray-500 py-8">
                Loading posts...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No posts yet. Be the first to share something!
            </div>
        );
    }

    async function handleLike(postId: Id<"posts">) {
        if (!isAuthenticated) {
            alert("Please sign in to like posts");
            return;
        }
        if (!isMember) {
            alert("You must be a member of the course to like posts");
            return;
        }
        await likePost({ postId });
    }

    async function handleDislike(postId: Id<"posts">) {
        if (!isAuthenticated) {
            alert("Please sign in to dislike posts");
            return;
        }
        if (!isMember) {
            alert("You must be a member of the course to dislike posts");
            return;
        }
        await dislikePost({ postId });
    }
    return (
        <div className="flex flex-col gap-4 w-full">
            {posts.map(post => (
                <div
                    key={post._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
                        <span className="text-xs text-gray-500">
                            {new Date(post._creationTime).toLocaleDateString()}
                        </span>
                    </div>
                    {post.content && (
                        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
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
                                    className="rounded-lg border border-gray-200 max-w-full h-auto"
                                />
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                        <button 
                            onClick={() => handleLike(post._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                userId && post.likes.includes(userId)
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">
                            {post.likes.length}
                        </span>
                        <button 
                            onClick={() => handleDislike(post._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                userId && post.dislikes.includes(userId)
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <ThumbsDown className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">
                            {post.dislikes.length}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}