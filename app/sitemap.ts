import type { MetadataRoute } from "next";
import { DERS_IDS } from "@/lib/dersler";
import { enHazir, readyTopics } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Site haritası: ana sayfalar, ders sayfaları ve hazır konular. Statik çıktıda /sitemap.xml olarak yazılır.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const sayfalar = ["/", "/tr/", "/drawings/", "/tr/cizimler/", "/kesfet/", "/hakkinda/", "/gizlilik/", "/kosullar/"];
  // /videolar/ haritada yok: sayfanın HTML'inde neredeyse metin yok, içerik tarayıcıda yükleniyor.
  return [
    ...sayfalar.map((y) => ({ url: SITE_URL + y })),
    ...DERS_IDS.map((d) => ({ url: `${SITE_URL}/${d}/` })),
    ...readyTopics().map((t) => ({ url: `${SITE_URL}/${t.ders}/${t.id}/` })),
    // İngilizce kopya (/en/): ders sayfaları ve çevirisi hazır konular.
    ...DERS_IDS.map((d) => ({ url: `${SITE_URL}/en/${d}/` })),
    ...readyTopics().filter((t) => enHazir(t.ders, t.id)).map((t) => ({ url: `${SITE_URL}/en/${t.ders}/${t.id}/` })),
  ];
}
