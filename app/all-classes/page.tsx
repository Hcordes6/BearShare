"use client";

import { useState } from "react";
import Header from "../components/header";

interface ClassCard {
  id: string;
  name: string;
  description: string;
  instructor: string;
  memberCount: number;
  category: string;
  color: string;
}

export default function AllClasses() {
  const [joinedClasses, setJoinedClasses] = useState<Set<string>>(new Set());

  // Prototype class data
  const classes: ClassCard[] = [
    {
      id: "1",
      name: "Introduction to Computer Science",
      description: "Learn the fundamentals of programming, algorithms, and data structures. Perfect for beginners.",
      instructor: "Dr. Sarah Johnson",
      memberCount: 247,
      category: "Computer Science",
      color: "blue"
    },
    {
      id: "2",
      name: "Advanced Calculus",
      description: "Deep dive into multivariable calculus, differential equations, and mathematical analysis.",
      instructor: "Prof. Michael Chen",
      memberCount: 189,
      category: "Mathematics",
      color: "purple"
    },
    {
      id: "3",
      name: "Organic Chemistry",
      description: "Explore the structure, properties, and reactions of organic compounds.",
      instructor: "Dr. Emily Rodriguez",
      memberCount: 312,
      category: "Chemistry",
      color: "green"
    },
    {
      id: "4",
      name: "World History: Ancient Civilizations",
      description: "Study the rise and fall of ancient empires from Mesopotamia to Rome.",
      instructor: "Prof. James Wilson",
      memberCount: 156,
      category: "History",
      color: "orange"
    },
    {
      id: "5",
      name: "Introduction to Psychology",
      description: "Understand human behavior, cognition, and mental processes.",
      instructor: "Dr. Lisa Anderson",
      memberCount: 428,
      category: "Psychology",
      color: "pink"
    },
    {
      id: "6",
      name: "Data Structures and Algorithms",
      description: "Master essential data structures and algorithmic problem-solving techniques.",
      instructor: "Prof. David Kim",
      memberCount: 203,
      category: "Computer Science",
      color: "blue"
    }
  ];

  const handleJoin = (classId: string) => {
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
        bg: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700",
        hover: "hover:bg-blue-100 dark:hover:bg-blue-950/40"
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-950/20",
        text: "text-purple-600 dark:text-purple-400",
        button: "bg-purple-600 hover:bg-purple-700",
        hover: "hover:bg-purple-100 dark:hover:bg-purple-950/40"
      },
      green: {
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-600 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700",
        hover: "hover:bg-green-100 dark:hover:bg-green-950/40"
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-950/20",
        text: "text-orange-600 dark:text-orange-400",
        button: "bg-orange-600 hover:bg-orange-700",
        hover: "hover:bg-orange-100 dark:hover:bg-orange-950/40"
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-950/20",
        text: "text-pink-600 dark:text-pink-400",
        button: "bg-pink-600 hover:bg-pink-700",
        hover: "hover:bg-pink-100 dark:hover:bg-pink-950/40"
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
            <p className="text-gray-600 dark:text-gray-400">
              Discover and join classes to start sharing and learning together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const isJoined = joinedClasses.has(classItem.id);
              const colors = getColorClasses(classItem.color);
              
              return (
                <div
                  key={classItem.id}
                  className={`${colors.bg} ${colors.hover} rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-200 shadow-sm hover:shadow-md`}
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {classItem.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {classItem.instructor}
                    </span>
                  </div>

                  {/* Member Count and Join Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

