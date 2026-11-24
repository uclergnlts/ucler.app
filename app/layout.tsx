import { cev, DIL } from "@/lib/dil";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Kabuk from "@/components/Kabuk";
import Bulut from "@/components/Bulut";
import Yerel from "@/components/Yerel";
import TemaIzle from "@/components/TemaIzle";
import { UMAMI_ID } from "@/lib/olay";
import { SITE_URL, UYGULAMA } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ucler", template: "%s · ucler" },
  description: cev("Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve mini testler."),
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

// Dil (lib/dil.ts): seçilen dil "tf-dil" anahtarında durur. Sayfa öbür dilin kopyasında açıldıysa (e-posta bağlantısı,
// giriş dönüşü, eski yer imi) boyamadan önce aynı sayfanın doğru kopyasına geçilir. Adrese ?dil=en ya da ?dil=tr
// yazmak seçimi değiştirir. Seçim yoksa: cihazda daha önce kullanılmış (ilerleme, hesap) uygulama Türkçe kalır; ilk
// açılışta telefonun/tarayıcının dili Türkçe değilse İngilizce seçilir. Web'deki tanıtım sayfaları ("/" ve "/tr/") ve çizim galerisi (/drawings/, /tr/cizimler/) kendi dil seçimini taşır, onlara dokunulmaz.
const DIL_BETIGI = `try{var L=localStorage,p=location.pathname,en=p==="/en"||p.indexOf("/en/")===0,q=new URLSearchParams(location.search).get("dil"),d=JSON.parse(L.getItem("tf-dil")||"null");if(q==="en"||q==="tr"){d=q;L.setItem("tf-dil",JSON.stringify(d))}else if(d===null){var e=0;for(var i=0;i<L.length;i++){var k=L.key(i)||"";if((k.indexOf("tf-")===0&&!/^tf-(tema|ses)/.test(k))||k.indexOf("sb-")===0)e=1}d=e||/^tr/i.test(navigator.language||"")?"tr":"en";L.setItem("tf-dil",JSON.stringify(d))}var r=location.search+location.hash;if(d==="en"&&!en&&!(${!UYGULAMA}&&/^\\/(tr\\/?|tr\\/cizimler\\/?|drawings\\/?)?$/.test(p)))location.replace("/en"+p+r);else if(d==="tr"&&en)location.replace((p.slice(3)||"/")+r)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DIL} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEMA_BETIGI }} />
        <script dangerouslySetInnerHTML={{ __html: DIL_BETIGI }} />
      </head>
      <body>
        {children}
        <Kabuk />
        <Bulut />
        <Yerel />
        <TemaIzle />
        {UMAMI_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
