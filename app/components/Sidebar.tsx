'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Wait for client-side render
  }

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex flex-col justify-between sticky top-0 h-screen p-4 bg-[hsl(var(--primary))] text-white">
      {/* Top Section: Logo + Links */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.png" alt="Classification Logo" className="w-28 h-28 mx-auto mb-4" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/file-upload", label: "Upload" },
            { href: "/review", label: "Review" },
            { href: "/profile", label: "Profile" },
            { href: "/school", label: "School" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-lg px-4 py-2 rounded-lg transition 
                ${isActive(href)
                  ? "bg-white text-[hsl(var(--primary))] font-semibold"
                  : "text-white hover:bg-white/20"
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <div className="sticky bottom-6">
        <Button
          variant="outline"
          className="w-full bg-white text-[hsl(var(--primary))] border-white hover:bg-muted hover:text-[hsl(var(--primary))] font-semibold rounded-lg"
          onClick={() => console.log("Logout clicked")}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}