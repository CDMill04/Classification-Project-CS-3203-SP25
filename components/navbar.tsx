import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Mixed Pages Demo
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-700">
              Home
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-md hover:bg-gray-700">
              About
            </Link>
            <a href="/services.html" className="px-3 py-2 rounded-md hover:bg-gray-700">
              Services
            </a>
            <a href="/contact.html" className="px-3 py-2 rounded-md hover:bg-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

