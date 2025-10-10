import { Inter, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Perfect Sudoku",
  description: "A clean, calm, and elegant Sudoku experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} flex min-h-screen flex-col items-center justify-between bg-slate-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
