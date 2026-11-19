import type { Metadata } from "next";
import Tanitim from "@/components/Tanitim";
import { readyTopics } from "@/lib/content";
import { DERS_IDS } from "@/lib/dersler";

// Tanıtım sayfasının Türkçesi; İngilizcesi "/" adresindedir (app/page.tsx).
export const metadata: Metadata = {
  title: { absolute: "ucler: bilim, hakkını vererek" },
  description: "ucler, herkesin bilimi anlamasına yardım eder: uygulamada kısa ve etkileşimli dersler, YouTube'da uzun videolar.",
  alternates: { canonical: "/tr/", languages: { en: "/", tr: "/tr/" } },
};

export default function Page() {
  const konular = readyTopics();
  const sayi = Object.fromEntries(DERS_IDS.map((d) => [d, konular.filter((t) => t.ders === d).length]));
  return <Tanitim sayi={sayi} dil="tr" />;
}
