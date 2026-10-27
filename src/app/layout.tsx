import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoverCraft AI — AI Cover Letter Generator",
  description:
    "Create a personalized, professional cover letter in seconds with AI. Works in demo mode without an API key.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
