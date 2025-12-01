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
          bgColor: "#0D0716",
          textColor: "#fff",
          links: [
            { label: "All Classes", href: "/all-classes", ariaLabel: "All Classes" },
            { label: "Request a Class", href: "/", ariaLabel: "Request a Class" },
          ]
        },
        {
          label: "My Classes", 
          bgColor: "#170D27",
          textColor: "#fff",
          links: [
            { label: "Class 1", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Class 2", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Class 3", href: "/my-classes", ariaLabel: "My Classes" },
            { label: "Manage Classes", href: "/my-classes", ariaLabel: "My Classes" },
          ]
        },
        {
          label: "Settings",
          bgColor: "#271E37", 
          textColor: "#fff",
          links: [
            { label: "Account", href: "/settings/account", ariaLabel: "Account" },
            { label: "Notifications", href: "/settings/notifications", ariaLabel: "Notifications" },
          ]
        }
    ];
    return (
        <CardNav logo="/assets/placeholderLogo.png"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="elastic.out(1,0.8)"
      />
    );
}