import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Arama motorları için: her sayfa taranabilir; site haritası /sitemap.xml. Statik çıktıda /robots.txt olarak yazılır.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
