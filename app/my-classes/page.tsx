"use client";

import AddPost from "../components/addPost";
import Header from "../components/header";
import PostCard from "../components/postCard";

export default function MyClasses() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage and view all your enrolled classes
          </p>
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AddPost />
            <PostCard />
          </main>
        </div>
      </main>
    </div>
  );
}

