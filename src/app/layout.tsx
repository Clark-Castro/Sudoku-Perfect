import { Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sudoku Perfect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable}`}>{children}</body>
    </html>
  );
}
