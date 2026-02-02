import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "trim.it - Simple URL Shortener for Business & Personal Use",
  description:
    "trim.it is a simple and free URL shortener. Create short links, track clicks, and manage your links in one place.",
  icons: {
    icon: new URL("/favicon.ico", baseUrl).toString(),
    apple: new URL("/logo.jpg", baseUrl).toString(),
  },
  openGraph: {
    title: "trim.it - Simple URL Shortener for Business & Personal Use",
    description:
      "trim.it is a simple and free URL shortener. Create short links, track clicks, and manage your links in one place.",
    images: [
      {
        url: new URL("/og-image.svg", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "trim.it - URL Shortener",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "trim.it - Simple URL Shortener for Business & Personal Use",
    description:
      "trim.it is a simple and free URL shortener. Create short links, track clicks, and manage your links in one place.",
    images: [
      {
        url: new URL("/og-image.svg", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "trim.it - URL Shortener",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
