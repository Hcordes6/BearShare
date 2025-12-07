"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface AddPostProps {
    courseId: Id<"courses">;
}

export default function AddPost({ courseId }: AddPostProps) {
    const createTextPost = useMutation(api.posts.createTextPost);
    {/* This is necessary for temporary url for file upload */}
    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
    const createFilePost = useMutation(api.posts.createFilePost);
    
    // This component should only be rendered inside <Authenticated>, so we can safely query
    const isMember = useQuery(api.memberships.isMember, { courseId });

    // Don't render if user is not a member
    if (!isMember) {
        return null;
    }


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [postType, setPostType] = useState<"file" | "text" | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const handleFileUpload = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile || !title.trim()) {
            return;
        }
        try {
            const url = await generateUploadUrl();
            const result = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": selectedFile.type },
                body: selectedFile,
            });
            const { storageId } = await result.json();

            await createFilePost({ courseId, title: title.trim(), storageId });
            setSelectedFile(null);
            setTitle("");
            setPostType(null);
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ["image/png", "image/jpeg", "application/pdf"];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
            } else {
                alert("Please select a PNG, JPG, or PDF file.");
                event.target.value = "";
            }
        }
    };

    return (
        <div className="flex flex-row justify-end self-end relative" ref={menuRef}>
            {!postType ? (
                /* This is button to add post */
                <>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md cursor-pointer transition-colors duration-200 flex items-center gap-2 shadow-md"
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
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150 cursor-pointer"
                                onClick={() => createTextPost({ courseId, title: title, content: content }).then(() => {
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
                        <form className="flex flex-col gap-4" onSubmit={handleFileUpload}>
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
                                    className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
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
                                        accept="image/png,image/jpeg,application/pdf,.png,.jpg,.jpeg,.pdf"
                                        onChange={handleFileChange}
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
                                            PNG, JPG, or PDF files only
                                        </span>
                                    </label>
                                </div>
                                {selectedFile && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="flex items-center gap-2">
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
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-700 font-medium">
                                                {selectedFile.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={handleCancel}
                                    type="button"
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={!selectedFile || !title.trim()}
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}