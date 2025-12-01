"use client";

import Header from "../components/header";
import CardNav from "../components/animations/cardNav";

export default function MyClasses() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-18">
      <CardNav logo="../../../public/assets/placeholderLogo.png"
        items={[
          {
            label: "My Classes",
            bgColor: "bg-primary",
            textColor: "text-white",
            links: [{
              label: "My Classes",
              href: "/my-classes",
              ariaLabel: "My Classes"
            }]
          }
        ]}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="elastic.out(1,0.8)"
      />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage and view all your enrolled classes
          </p>

        </div>
      </main>
    </div>
  );
}

