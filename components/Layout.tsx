import { ReactNode } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Determine if we should hide sidebar (for login page)
  const hideSidebar = router.pathname === "/login";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
