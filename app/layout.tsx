import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/header";
import Footer from "./components/footer";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BearShare",
  description: "WashU BearShare is a collaborative platform for students to share class resources.",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen bg-background pt-18">
          <ClerkProvider>
            <ConvexClientProvider>
              <Header /> {/* header component */}
              {children}
              <Footer /> {/* footer component */}
            </ConvexClientProvider>
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
