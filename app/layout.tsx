import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import Tabs from "@/components/Tabs";
import Gunluk from "@/components/Gunluk";
import Bulut from "@/components/Bulut";
import { UMAMI_ID } from "@/lib/olay";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], weight: ["600", "700", "800"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });

export const metadata: Metadata = {
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
    <html lang="tr" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        {children}
        <Tabs />
        <Gunluk />
        <Bulut />
        {UMAMI_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
