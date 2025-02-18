import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer"; // ✅ Ensure the correct path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ IMPROVED SEO METADATA (WITH metadataBase)
export const metadata: Metadata = {
  metadataBase: new URL("https://reels-entertainment.vercel.app"), // ✅ Add this to resolve Open Graph images
  title: "DJ Reels | Live DJ & Event Entertainment",
  description:
    "Experience live DJ performances, event entertainment, and music streams with DJ Reels. Book now for your next event!",
  keywords:
    "DJ Reels, live DJ, event DJ, music streaming, entertainment, Twitch DJ, live music, event booking",
  openGraph: {
    title: "DJ Reels | Live DJ & Event Entertainment",
    description:
      "Book DJ Reels for live events, music streaming, and entertainment. Join the experience!",
    url: "https://reels-entertainment.vercel.app",
    type: "website",
    images: [
      {
        url: "/dj-cover.png", // ✅ No need for `/public/`, Next.js serves static assets directly from `public/`
        width: 1200,
        height: 630,
        alt: "DJ Reels Entertainment",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer /> {/* ✅ Keep Footer at the bottom */}
      </body>
    </html>
  );
}
