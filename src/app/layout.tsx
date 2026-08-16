import type { Metadata } from "next";
import Script from "next/script";
import { adsConfig } from "@/lib/ads";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: site.name,
  description: "Adults-only model portfolios — photos, videos, and bios. 18+ only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {adsConfig.enabled && adsConfig.network === "exoclick" && (
          <Script
            src={adsConfig.providerScript}
            async
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 font-sans text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
