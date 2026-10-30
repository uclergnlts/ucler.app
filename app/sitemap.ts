import type { MetadataRoute } from "next";
import { DERS_IDS } from "@/lib/dersler";
import { readyTopics } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Site haritası: ana sayfalar, ders sayfaları ve hazır konular. Statik çıktıda /sitemap.xml olarak yazılır.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const sayfalar = ["/", "/kesfet/", "/videolar/", "/hakkinda/", "/gizlilik/", "/kosullar/"];
  return [
    ...sayfalar.map((y) => ({ url: SITE_URL + y })),
    ...DERS_IDS.map((d) => ({ url: `${SITE_URL}/${d}/` })),
    ...readyTopics().map((t) => ({ url: `${SITE_URL}/${t.ders}/${t.id}/` })),
  ];
}
