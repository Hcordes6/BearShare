"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAdmin } from "../../contexts/AdminContext";
import Header from "../../components/header";

export default function AdminPanel() {
    const router = useRouter();
    const { isAdmin, adminPassword, clearAdmin } = useAdmin();

    useEffect(() => {
        // Check if admin is authenticated
        if (!isAdmin || !adminPassword) {
            router.push("/admin/login");
        }
    }, [router, isAdmin, adminPassword]);

    const courseRequests = useQuery(
        api.admin.getCourseRequests,
        isAdmin && adminPassword ? { adminPassword } : "skip"
    );

    const approveRequest = useMutation(api.admin.approveCourseRequest);
    const rejectRequest = useMutation(api.admin.rejectCourseRequest);
    const createCourse = useMutation(api.admin.createCourse);

    const handleApprove = async (requestId: Id<"courseRequests">) => {
        if (!adminPassword) return;
        
        try {
            await approveRequest({
                requestId,
                adminPassword,
            });
            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request");
        }
    };

    const handleReject = async (requestId: Id<"courseRequests">) => {
        if (!adminPassword) return;
        
        try {
            await rejectRequest({
                requestId,
                adminPassword,
            });
            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Failed to reject request");
        }
    };

    const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!adminPassword) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const tag = formData.get("tag") as string;

        try {
            await createCourse({
                name,
                tag,
                adminPassword,
            });
            alert("Course created successfully!");
            e.currentTarget.reset();
        } catch (error) {
            console.error("Error creating course:", error);
            alert("Failed to create course");
        }
    };

    const handleLogout = () => {
        clearAdmin();
        router.push("/admin/login");
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pt-18">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Admin Panel
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Course Requests Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                                Course Requests
                            </h2>
                            
                            {courseRequests === undefined ? (
                                <div className="text-gray-500">Loading requests...</div>
                            ) : courseRequests === null ? (
                                <div className="text-red-600">Authentication failed. Please login again.</div>
                            ) : courseRequests.length === 0 ? (
                                <div className="text-gray-500">No pending course requests.</div>
                            ) : (
                                <div className="space-y-4">
                                    {courseRequests.map((request) => (
                                        <div
                                            key={request._id}
                                            className="border border-gray-300 rounded-lg p-4 bg-white"
                                        >
                                            <h3 className="font-semibold text-lg text-foreground mb-2">
                                                {request.className}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Tag:</strong> {request.classTag}
                                            </p>
                                            {request.description && (
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {request.description}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(request._id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request._id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Create Course Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                                Create Course Manually
                            </h2>
                            
                            <form onSubmit={handleCreateCourse} className="space-y-4 border border-gray-300 rounded-lg p-4 bg-white">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                        Class Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., CSE 240 - Logic and Discrete Math"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="tag" className="block text-sm font-medium text-foreground mb-2">
                                        Class Tag/Code
                                    </label>
                                    <input
                                        type="text"
                                        id="tag"
                                        name="tag"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., CSE 240"
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Create Course
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

