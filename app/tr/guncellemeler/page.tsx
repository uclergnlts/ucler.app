import type { Metadata } from "next";
import { paylasim } from "@/lib/seo";
import SurumNotlari from "@/components/SurumNotlari";

// Sürüm notlarının Türkçesi; İngilizcesi /updates/ adresindedir.
// Metinler cev() ile değil, content/surumler.json ve components/SurumNotlari.tsx içindeki METIN ile yazılır.
export const metadata: Metadata = {
  title: { absolute: "Sürüm notları · ucler" },
  description: "ucler uygulamasının iPhone ve Android'deki bütün güncellemeleri, en yenisi en üstte.",
  alternates: { canonical: "/tr/guncellemeler/", languages: { en: "/updates/", tr: "/tr/guncellemeler/", "x-default": "/updates/" } },
  ...paylasim("Sürüm notları · ucler", "ucler uygulamasının iPhone ve Android'deki bütün güncellemeleri, en yenisi en üstte.", "tr"),
};

export default function Page() {
  return <SurumNotlari dil="tr" />;
}
