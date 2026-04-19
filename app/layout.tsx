import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Management System",
  description: "CRUD dashboard built with Next.js, TypeScript, MongoDB Atlas, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}