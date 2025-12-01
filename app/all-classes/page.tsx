"use client";

import Header from "../components/header";

export default function AllClasses() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            View all available classes
          </p>
        </div>
      </main>
    </div>
  );
}

