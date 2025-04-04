import type React from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Classification LMS",
  description: "A streamlined learning management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" type="text/css" href="/Classification.css" />
      </head>
      <body>
        <header>
          <h1>Classification</h1>
          <h2></h2>
        </header>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/courses">Courses</Link>
          <a href="/Ai-Evaluation.html">AI Evaluation</a>
          <a href="/Support.html">Support</a>
          <Link href="/file-upload">File-Upload</Link>
        </nav>
        <div className="container">{children}</div>
        <footer></footer>
      </body>
    </html>
  )
}



import './globals.css'