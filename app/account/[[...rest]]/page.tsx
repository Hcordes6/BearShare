"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton, useAuth, UserProfile } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Header from "../../components/header";

export default function Account() {
    const { isSignedIn } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-background pt-18 justify-center items-center">
            <Header />
            {isSignedIn ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center">
                    <UserProfile />
                </div>  
            ) : (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold text-foreground mb-6">Please sign in to your account to view your account</h1>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        <SignInButton>
                            <button className="text-white px-4 py-2 rounded-md">Sign in</button>
                        </SignInButton>
                    </div>
                </div>
            )}
        </div>
    );
}

