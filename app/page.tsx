import type { Metadata } from "next";
import Home from "@/components/Home";
import Tanitim from "@/components/Tanitim";
import { allEntries, gunSorusuHavuzu, readyTopics } from "@/lib/content";
import { DERS_IDS } from "@/lib/dersler";
import { UYGULAMA } from "@/lib/site";

// Web'de "/" İngilizce tanıtım sayfasıdır; telefon uygulamasında (npm run app) ana ekrandır. Bkz. lib/site.ts.
export const metadata: Metadata = UYGULAMA
  ? {}
  : {
      title: { absolute: "ucler: science, explained properly" },
      description: "ucler helps anyone understand science: short interactive lessons in the app and deep-dive videos on YouTube.",
    };

export default function Page() {
  if (UYGULAMA) return <Home all={allEntries()} gunHavuz={Object.keys(gunSorusuHavuzu())} />;
  const konular = readyTopics();
  const sayi = Object.fromEntries(DERS_IDS.map((d) => [d, konular.filter((t) => t.ders === d).length]));
  return <Tanitim sayi={sayi} />;
}
