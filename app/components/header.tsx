"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CardNav from "./animations/cardNav";

export default function Header() {
    const pathname = usePathname();

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
          links: [
            { label: "Class 1", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Class 2", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Class 3", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Manage Classes", href: "/my-classes", ariaLabel: "My Classes" },
          ]
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