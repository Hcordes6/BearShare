"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "../components/header";

export default function RequestClass() {
    const [submitted, setSubmitted] = useState(false);
    const submitRequest = useMutation(api.admin.submitCourseRequest);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            await submitRequest({
                className: formData.get("className") as string,
                classTag: formData.get("classTag") as string,
                description: formData.get("description") as string || undefined,
            });
            setSubmitted(true);
            e.currentTarget.reset();
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request. Please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background pt-18">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Request a Class
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Can't find the class you're looking for? Request it here and we'll add it to the platform.
                    </p>
                    
                    {submitted && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            Your request has been submitted successfully! An admin will review it shortly.
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-foreground mb-2">
                                Class Name
                            </label>
                            <input
                                type="text"
                                id="className"
                                name="className"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., CSE 240 - Logic and Discrete Math"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="classTag" className="block text-sm font-medium text-foreground mb-2">
                                Class Tag/Code
                            </label>
                            <input
                                type="text"
                                id="classTag"
                                name="classTag"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., CSE 240"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any additional information about the class..."
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Submit Request
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <a
                            href="/admin/login"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            Admin Login
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

