"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/header";
import AddPost from "./components/addPost";
import PostCard from "./components/postCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddPost />
        <PostCard />
      </main>
    </div>
  );
}
