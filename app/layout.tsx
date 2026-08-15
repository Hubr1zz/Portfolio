import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    title: "Leon Zhou — Technical Designer",
    description: "Technical design, gameplay programming, and real-time graphics by Leon Zhou.",
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: {
      title: "Leon Zhou — Technical Designer",
      description: "Technical design, gameplay systems, production tools, and real-time graphics.",
      type: "website",
      url: origin,
      images: [{ url: socialImage, width: 1672, height: 940, alt: "Leon Zhou — Technical Design · Gameplay Systems" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Leon Zhou — Technical Designer",
      description: "Technical design, gameplay systems, production tools, and real-time graphics.",
      images: [socialImage],
    },
  };
}

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
