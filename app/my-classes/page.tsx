"use client";

import Header from "../components/header";

export default function MyClasses() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Classes</h1>
          <p className="text-gray-600 mb-8">
            Manage and view all your enrolled classes
          </p>
          
          {/* Placeholder for enrolled classes list */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              Your enrolled classes will appear here. Visit the{" "}
              <a href="/all-classes" className="text-blue-600 hover:underline">
                All Classes
              </a>{" "}
              page to join classes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

