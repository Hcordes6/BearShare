"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left Section: Logo and Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Logo Placeholder */}
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {/* BearShare Logo Placeholder */}
                                <span>BS</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-foreground">BearShare</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Share & Learn Together</p>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === "/"
                                        ? "bg-gray-100 dark:bg-gray-800 text-foreground"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/my-classes"
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === "/my-classes"
                                        ? "bg-gray-100 dark:bg-gray-800 text-foreground"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
                                }`}
                            >
                                My Classes
                            </Link>
                        </nav>
                    </div>

                    {/* Right Section: Search, Notifications, Profile */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <svg
                                className="h-5 w-5 text-gray-600 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            {/* Notification Badge */}
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>

                        {/* User Profile Placeholder */}
                        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium border-2 border-gray-300 dark:border-gray-700">
                                {/* User Profile Placeholder */}
                                <span>U</span>
                            </div>
                            <svg
                                className="hidden sm:block h-4 w-4 text-gray-600 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <svg
                                className="h-5 w-5 text-gray-600 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}