import "../styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/theme-provider";

export const metadata: Metadata = {
  title: "Classification LMS",
  description: "A streamlined learning management system",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (  // Had to change the next line in order to not throw hydration errors. Specified client-side settings
    <html lang="en" className="light" style={{ colorScheme: "light" }}> 
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}