import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Tracker - Invoice & Payment Management",
  description: "Track jobs, invoices, and payments efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
