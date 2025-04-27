'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Wait for client-side render
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col gap-6">
      {/* Logo section */}
      <div className="mb-8">
        <img src="/logo.png" alt="Classification Logo" className="w-28 h-28 mx-auto mb-4" />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/upload", label: "Upload" },
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
  );
}