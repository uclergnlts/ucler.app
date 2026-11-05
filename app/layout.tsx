import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Tabs from "@/components/Tabs";
import Gunluk from "@/components/Gunluk";
import Bulut from "@/components/Bulut";
import Yerel from "@/components/Yerel";
import { UMAMI_ID } from "@/lib/olay";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ucler", template: "%s · ucler" },
  description: "Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve mini testler.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Tabs />
        <Gunluk />
        <Bulut />
        <Yerel />
        {UMAMI_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
