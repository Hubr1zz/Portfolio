import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leon-zhou-portfolio.leonzhouziang.chatgpt.site";
const siteOrigin = new URL(siteUrl).origin;
const socialImage = `${siteOrigin}${basePath}/og.png`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Leon Zhou — Technical Designer",
  description: "Technical design, gameplay programming, and real-time graphics by Leon Zhou.",
  icons: { icon: `${basePath}/favicon.png`, shortcut: `${basePath}/favicon.png` },
  openGraph: {
    title: "Leon Zhou — Technical Designer",
    description: "Technical design, gameplay systems, production tools, and real-time graphics.",
    type: "website",
    url: siteUrl,
    images: [{ url: socialImage, width: 1672, height: 940, alt: "Leon Zhou — Technical Design · Gameplay Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leon Zhou — Technical Designer",
    description: "Technical design, gameplay systems, production tools, and real-time graphics.",
    images: [socialImage],
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
      </body>
    </html>
  );
}
