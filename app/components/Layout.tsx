import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login";

  return (
    <div className="flex min-h-screen bg-white">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}