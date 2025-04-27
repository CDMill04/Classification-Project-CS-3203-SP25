import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[var(--primary-color)] text-white flex flex-col p-4 rounded-r-2xl min-h-screen">
      {/* Logo placeholder */}
      <div className="mb-8">
        <div className="bg-white rounded-md w-20 h-20 mx-auto mb-4" />
        <h1 className="text-center text-xl font-bold">LessonHub</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        <Link href="/upload" className="hover:underline text-lg">Upload</Link>
        <Link href="/review" className="hover:underline text-lg">Review</Link>
        <Link href="/profile" className="hover:underline text-lg">Profile</Link>
        <Link href="/school" className="hover:underline text-lg">School</Link>
      </nav>
    </aside>
  );
}