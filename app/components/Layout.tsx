import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";

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