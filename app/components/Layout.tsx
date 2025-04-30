'use client';

import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";

  // Clickjacking Protection
  useEffect(() => {
    if (window.top !== window.self) {
      document.body.innerHTML = `
        <div style="display: flex; height: 100vh; align-items: center; justify-content: center; text-align: center; background-color: white; color: red; font-size: 1.5rem;">
          Clickjacking protection triggered. Please open this site directly.
        </div>`;
    }
  }, []);


  return (
    <div className="flex min-h-screen bg-background">
      {!hideSidebar && (
        <aside className="w-52 bg-[hsl(var(--primary))] text-white flex flex-col p-4">
          {/* Sidebar content here */}
          <Sidebar />
        </aside>
      )}

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}