"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CardNav from "./animations/cardNav";
import { useAuth } from "@clerk/nextjs";
import {useQuery} from "convex/react";
import { api } from "@/convex/_generated/api";



export default function Header() {
    const pathname = usePathname();
    const { isSignedIn } = useAuth();
    const enrolledClasses = useQuery(api.memberships.getMyCourses);

    // Build "My Classes" links based on enrollment status
    const myClassesLinks: Array<{ label: string; href: string; ariaLabel: string }> = [];
    if (isSignedIn && enrolledClasses) {
        // Show up to 3 enrolled classes
        const classesToShow = enrolledClasses.slice(0, 3);
        classesToShow.forEach((course) => {
            myClassesLinks.push({
                label: course.name,
                href: `/courses/${course._id}`,
                ariaLabel: course.name,
            });
        });
    }
    // Always include "Manage Classes" link
    myClassesLinks.push({
        label: "Manage Classes",
        href: "/my-classes",
        ariaLabel: "Manage Classes",
    });

    // Header Menu Content -- Change for classes?
    const items = [
        {
          label: "Find a Class",
          bgColor: "#dbeafe", // Light blue
          textColor: "#1e40af",
          links: [
            { label: "All Classes", href: "/all-classes", ariaLabel: "All Classes" },
            { label: "Request a Class", href: "/", ariaLabel: "Request a Class" },
          ]
        },
        {
          label: "My Classes", 
          bgColor: "#ede9fe", // Light purple
          textColor: "#6b21a8",
          links: myClassesLinks,
        },
        {
          label: "Settings",
          bgColor: "#fef3c7", // Light amber
          textColor: "#92400e",
          links: [
            { label: "Account", href: "/settings/account", ariaLabel: "Account" },
            { label: "Notifications", href: "/settings/notifications", ariaLabel: "Notifications" },
          ]
        }
    ];
    return (
        <CardNav logo="/assets/bearShareLogo.png"
        items={items}
        baseColor="#ffffff"
        menuColor="#1a1a1a"
        buttonBgColor="#3b82f6"
        buttonTextColor="#fff"
        ease="elastic.out(1,0.8)"
      />
    );
}