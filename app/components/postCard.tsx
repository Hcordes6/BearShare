import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";

export default function PostCard() {
    const posts = useQuery(api.posts.getPosts);

    return (
        <div className="flex flex-col gap-4 w-full">
            {posts?.map(post => (
                <div key={post._id}>
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    {post.content && <p>{post.content}</p>}
                    {post.fileUrl && (
                        <Image src={post.fileUrl} alt={post.title} width={100} height={100} />
                    )}
                </div>
            ))}
        </div>
    );
}