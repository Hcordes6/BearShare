"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../contexts/AdminContext";
import Header from "../../components/header";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { setAdminPassword } = useAdmin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple password check - matches the backend
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
        
        if (password === correctPassword) {
            setAdminPassword(password);
            router.push("/admin/panel");
        } else {
            setError("Incorrect password");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background pt-18">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                        Admin Login
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Enter the admin password to access admin features
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}
                        
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                    
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        Default password: admin123
                    </p>
                </div>
            </main>
        </div>
    );
}

