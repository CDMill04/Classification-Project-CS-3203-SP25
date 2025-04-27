import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function Layout({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";

  return (
    <div className={`flex min-h-screen ${className}`}>
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}