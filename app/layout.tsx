import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./i18n";

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

// After a deploy, a browser can still hold cached HTML that points at stylesheets the new build removed.
// Reload such a page once with a cache-busting query, then strip the query from the address bar.
const staleStylesheetRecovery = `(() => {
  const url = new URL(location.href);
  let retried = url.searchParams.has("_fresh");
  if (retried) {
    url.searchParams.delete("_fresh");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }
  const recover = () => {
    if (retried)
      return;
    retried = true;
    url.searchParams.set("_fresh", Date.now().toString(36));
    location.replace(url.href);
  };
  document.addEventListener("error", (event) => {
    if (event.target instanceof HTMLLinkElement && event.target.rel === "stylesheet")
      recover();
  }, true);
  window.addEventListener("load", () => {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => !link.sheet))
      recover();
  });
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: staleStylesheetRecovery }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
