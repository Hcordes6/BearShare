"use client";

import Link from "next/link";
import { useQuery, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Header from "../components/header";

// Helper function to determine category and color based on course tag/name
const getCategoryAndColor = (tag: string, name: string): { category: string; color: string } => {
  const tagUpper = tag.toUpperCase();
  const nameLower = name.toLowerCase();

  if (tagUpper.includes("CSE") || tagUpper.includes("CS") || nameLower.includes("computer science") || nameLower.includes("programming") || nameLower.includes("data structures")) {
    return { category: "Computer Science", color: "blue" };
  } else if (tagUpper.includes("MATH") || nameLower.includes("calculus") || nameLower.includes("algebra") || nameLower.includes("statistics")) {
    return { category: "Mathematics", color: "purple" };
  } else if (tagUpper.includes("CHEM") || nameLower.includes("chemistry")) {
    return { category: "Chemistry", color: "green" };
  } else if (tagUpper.includes("PSYCH") || nameLower.includes("psychology")) {
    return { category: "Psychology", color: "pink" };
  } else if (tagUpper.includes("HIST") || nameLower.includes("history")) {
    return { category: "History", color: "orange" };
  } else {
    return { category: "General", color: "blue" };
  }
};

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string; button: string; hover: string }> = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      hover: "hover:bg-blue-100"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      hover: "hover:bg-purple-100"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      hover: "hover:bg-green-100"
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
      hover: "hover:bg-orange-100"
    },
    pink: {
      bg: "bg-pink-50",
      text: "text-pink-600",
      button: "bg-pink-600 hover:bg-pink-700",
      hover: "hover:bg-pink-100"
    }
  };
  return colorMap[color] || colorMap.blue;
};

export default function MyClasses() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Classes</h1>
            <p className="text-gray-600">
              View and manage all your enrolled classes
            </p>
          </div>

          <AuthLoading>
            <div className="text-center text-gray-500 py-8">
              Loading...
            </div>
          </AuthLoading>

          <Unauthenticated>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">
                Please sign in to view your enrolled classes.
              </p>
              <SignInButton mode="modal">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </Unauthenticated>

          <Authenticated>
            <MyClassesContent />
          </Authenticated>
        </div>
      </main>
    </div>
  );
}

function MyClassesContent() {
  const myCourses = useQuery(api.memberships.getMyCourses);

  if (myCourses === undefined) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading classes...
      </div>
    );
  }

  if (myCourses.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 mb-4">
          You haven't joined any classes yet.
        </p>
        <Link
          href="/all-classes"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse All Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myCourses.map((course) => {
        const { category, color } = getCategoryAndColor(course.tag, course.name);
        const colors = getColorClasses(color);

        return (
          <div
            key={course._id}
            className={`${colors.bg} ${colors.hover} rounded-xl p-6 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            {/* Category Badge */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg}`}>
                {category}
              </span>
            </div>

            {/* Class Name */}
            <h2 className="text-xl font-bold text-foreground mb-2">
              {course.name}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.tag}
            </p>

            {/* Member Count and View Button */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {course.memberCount} {course.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
              <Link
                href={`/courses/${course._id}`}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors ${colors.button} text-white hover:opacity-90 block`}
              >
                View Class Page
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  )
}
       
