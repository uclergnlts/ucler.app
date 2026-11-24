import type { Metadata } from "next";
import { paylasim } from "@/lib/seo";
import Cizimler from "@/components/Cizimler";

// Çizim galerisinin Türkçesi; İngilizcesi /drawings/ adresindedir.
// Başlıklar cev() ile değil, components/Cizimler.tsx içindeki METIN ile yazılır: sayfa iki dilde ayrı adreste durur.
export const metadata: Metadata = {
  title: { absolute: "Çizimler · ucler" },
  description: "ucler YouTube videolarındaki bütün gravür çizimleri tek yerde.",
  alternates: { canonical: "/tr/cizimler/", languages: { en: "/drawings/", tr: "/tr/cizimler/", "x-default": "/drawings/" } },
  ...paylasim("Çizimler · ucler", "ucler YouTube videolarındaki bütün gravür çizimleri tek yerde.", "tr"),
};

export default function Page() {
  return <Cizimler dil="tr" />;
}
