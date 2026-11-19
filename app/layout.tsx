import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Tabs from "@/components/Tabs";
import Gunluk from "@/components/Gunluk";
import Bulut from "@/components/Bulut";
import Yerel from "@/components/Yerel";
import TemaIzle from "@/components/TemaIzle";
import { UMAMI_ID } from "@/lib/olay";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ucler", template: "%s · ucler" },
  description: "Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve mini testler.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#10182a" },
  ],
  colorScheme: "light dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

// Görünüm (lib/tema.ts): React yüklenmeden önce <html data-tema> konur ki sayfa yanlış renkte yanıp sönmesin.
const TEMA_BETIGI = `try{var t=JSON.parse(localStorage.getItem("tf-tema")||'"sistem"');var k=t==="koyu"||(t!=="acik"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.tema=k?"koyu":"acik"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEMA_BETIGI }} />
      </head>
      <body>
        {children}
        <Tabs />
        <Gunluk />
        <Bulut />
        <Yerel />
        <TemaIzle />
        {UMAMI_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
