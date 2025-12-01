"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CardNav from "./animations/cardNav";

export default function Header() {
    const pathname = usePathname();

    // Header Menu Content -- Change for classes?
    const items = [
        {
          label: "About",
          bgColor: "#0D0716",
          textColor: "#fff",
          links: [
            { label: "Company", href: "/about/company", ariaLabel: "About Company" },
            { label: "Careers", href: "/about/careers", ariaLabel: "About Careers" }
          ]
        },
        {
          label: "Projects", 
          bgColor: "#170D27",
          textColor: "#fff",
          links: [
            { label: "Featured", href: "/projects/featured", ariaLabel: "Featured Projects" },
            { label: "Case Studies", href: "/projects/case-studies", ariaLabel: "Project Case Studies" }
          ]
        },
        {
          label: "Contact",
          bgColor: "#271E37", 
          textColor: "#fff",
          links: [
            { label: "Email", href: "mailto:contact@bearshare.com", ariaLabel: "Email us" },
            { label: "Twitter", href: "https://twitter.com/bearshare", ariaLabel: "Twitter" },
            { label: "LinkedIn", href: "https://linkedin.com/company/bearshare", ariaLabel: "LinkedIn" }
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