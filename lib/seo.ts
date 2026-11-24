// Arama motorları için sayfa adresleri: canonical (sayfanın asıl adresi) ve hreflang (aynı sayfanın öbür dildeki kopyası).
// Türkçe kopya kökte (/fizik/…), İngilizce kopya /en/ altında (/en/fizik/…) yayınlanır. Mutlak adres yazılır çünkü
// İngilizce derlemenin basePath'i (/en) metadata adreslerine kendiliğinden eklenmez.
import type { Metadata } from "next";
import { DIL } from "./dil";
import { SITE_URL } from "./site";

/** yol: "/fizik/vektorler/" gibi dil öneki olmadan. enVar: sayfanın İngilizcesi hazır mı. */
export function dilAdresleri(yol: string, enVar: boolean): Metadata["alternates"] {
  const tr = SITE_URL + yol, en = SITE_URL + "/en" + yol;
  // İngilizce kopyada henüz çevrilmemiş sayfa Türkçe içerik gösterir; asıl adresi Türkçe sayfadır.
  return { canonical: DIL === "en" && enVar ? en : tr, languages: enVar ? { tr, en } : { tr } };
}

/** Paylaşım önizlemesi (WhatsApp, Instagram, X…). Sayfa openGraph yazınca düzendekinin yerine geçtiği için görsel her seferinde eklenir. */
export function paylasim(baslik: string, aciklama: string, dil: "tr" | "en" = DIL): Pick<Metadata, "openGraph" | "twitter"> {
  const gorsel = { url: dil === "en" ? "/og.png" : "/og-tr.png", width: 1200, height: 630, alt: "ucler" };
  return {
    openGraph: { type: "website", siteName: "ucler", title: baslik, description: aciklama, locale: dil === "en" ? "en_US" : "tr_TR", images: [gorsel] },
    twitter: { card: "summary_large_image", title: baslik, description: aciklama, images: [gorsel.url] },
  };
}
