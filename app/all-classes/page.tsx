"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Header from "../components/header";

interface ClassCard {
  id: Id<"courses">;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  color: string;
}

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

export default function AllClasses() {
  const [joinedClasses, setJoinedClasses] = useState<Set<Id<"courses">>>(new Set());
  const courses = useQuery(api.courses.getAllCourses);

  // Map courses from database to ClassCard format
  const classes: ClassCard[] = courses
    ? courses.map((course) => {
        const { category, color } = getCategoryAndColor(course.tag, course.name);
        return {
          id: course._id,
          name: course.name,
          description: course.tag,
          memberCount: course.memberCount,
          category,
          color,
        };
      })
    : [];

  const handleJoin = (classId: Id<"courses">) => {
    setJoinedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
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

  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">All Classes</h1>
            <p className="text-gray-600">
              Discover and join classes to start sharing and learning together
            </p>
          </div>

          {courses === undefined ? (
            <div className="text-center text-gray-500 py-8">
              Loading classes...
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No classes available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => {
              const isJoined = joinedClasses.has(classItem.id);
              const colors = getColorClasses(classItem.color);
              
              return (
                <div
                  key={classItem.id}
                  className={`${colors.bg} ${colors.hover} rounded-xl p-6 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg}`}>
                      {classItem.category}
                    </span>
                  </div>

                  {/* Class Name */}
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {classItem.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {classItem.description}
                  </p>

                  {/* Member Count and Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
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
                          {classItem.memberCount} {classItem.memberCount === 1 ? "member" : "members"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleJoin(classItem.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                          isJoined
                            ? "bg-gray-600 hover:bg-gray-700"
                            : `${colors.button}`
                        }`}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </button>
                    </div>
                    <Link
                      href={`/courses/${classItem.id}`}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                        colors.button
                      } text-white hover:opacity-90 block`}
                    >
                      View Class Page
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

