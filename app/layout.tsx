import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AcademicHub | Full-Stack School Management",
  description: "Web-Based School Management System",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F7F8FA]">
        {children}
      </body>
    </html>
  );
}
