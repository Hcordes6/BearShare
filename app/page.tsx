"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/header";
import AddPost from "./components/addPost";

export default function Home() {
  
  const posts = useQuery(api.posts.getPosts);

  return (
    <div className="flex flex-col p-4 h-screen">
      <Header />
      <AddPost />
      <div className="flex flex-col gap-4">
        <div className="bg-gray-200 p-4 rounded-md text-black text-center max-w-md mx-auto">
          <div className="text-lg font-bold object-cover">
            {posts?.map(post => (
              <div key={post._id}>
                <h1>{post.title}</h1>
                <p >{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
