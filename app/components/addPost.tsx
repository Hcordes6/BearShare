"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState, useRef, useEffect } from "react";

export default function AddPost() {
    const createTextPost = useMutation(api.posts.createTextPost);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [postType, setPostType] = useState<"file" | "text" | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handlePostTypeSelect = (type: "file" | "text") => {
        setPostType(type);
        setIsMenuOpen(false);
    };

    const handleCancel = () => {
        setPostType(null);
    };

    return (
        <div className="flex flex-row justify-end self-end relative" ref={menuRef}>
            {!postType ? (
                /* This is button to add post */
                <>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer transition-colors duration-200 flex items-center gap-2 shadow-md"
                    >
                        <span>+</span>
                        <span>Add Post</span>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
                            {/* This is button to post text */}
                            <button
                                onClick={() => handlePostTypeSelect("text")}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                <span className="text-gray-700">Post Text</span>
                            </button>
                            {/* This is button to post file */}
                            <button
                                onClick={() => handlePostTypeSelect("file")}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 border-t border-gray-200 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <span className="text-gray-700">Post File</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-w-[400px] max-w-[500px]">
                    {/* This is the text post form */}
                    {postType === "text" ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Post Text</h2>
                                {/* This is the button to cancel the text post */}
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {/* This is the title input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter post title..."
                                    className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            {/* This is the content textarea */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    placeholder="Write your post content..."
                                    rows={6}
                                    className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            {/* This is the button to post the text post */}
                            <div className="flex justify-end">
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-150 cursor-pointer"
                                onClick={() => createTextPost({ title: title, content: content }).then(() => {
                                    setTitle("");
                                    setContent("");
                                    setPostType(null);
                                    setIsMenuOpen(false);
                                })}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* This is the file post form */
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Post File</h2>
                                {/* This is the button to cancel the file post */}
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {/* This is the title input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter post title..."
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {/* This is the file input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-blue-400 transition-colors duration-150 cursor-pointer">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <span className="text-gray-600 font-medium">
                                            Click to upload or drag and drop
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            PNG, JPG, PDF, or any file type
                                        </span>
                                    </label>
                                </div>
                            </div>
                            {/* This is the description textarea */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea
                                    placeholder="Add a description for your file..."
                                    rows={3}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                            {/* This is the button to post the file post */}
                            <div className="flex justify-end">
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-150 cursor-pointer">
                                    Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}