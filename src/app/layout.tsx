import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DataInitializer from "./components/DataInitializer";
import Script from "next/script";
import PyodideLoader from "./components/PyodideLoader";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "DSA Deliberate Play",
  description: "Master Data Structures and Algorithms through deliberate play",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload Pyodide */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script 
          src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
          strategy="beforeInteractive"
        />
        <DataInitializer />
        <PyodideLoader />
        {children}
      </body>
    </html>
  );
}
