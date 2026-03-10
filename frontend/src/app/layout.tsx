import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveCursor from "@/components/InteractiveCursor";
import EasterEggManager from "@/components/EasterEggManager";
import GamificationWidget from "@/components/GamificationWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Tech Social Hub | Department of Electronics & Technology",
  description: "The digital home of the E-Tech Department — clubs, achievements, events, and a vibrant tech community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white`}
      >
        <Providers>
          <InteractiveCursor />
          <EasterEggManager />
          <GamificationWidget />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
