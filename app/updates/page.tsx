import type { Metadata } from "next";
import { paylasim } from "@/lib/seo";
import SurumNotlari from "@/components/SurumNotlari";

// Sürüm notlarının İngilizcesi; Türkçesi /tr/guncellemeler/ adresindedir.
export const metadata: Metadata = {
  title: { absolute: "Release notes · ucler" },
  description: "Every update to the ucler app on iPhone and Android, newest first.",
  alternates: { canonical: "/updates/", languages: { en: "/updates/", tr: "/tr/guncellemeler/", "x-default": "/updates/" } },
  ...paylasim("Release notes · ucler", "Every update to the ucler app on iPhone and Android, newest first.", "en"),
};

export default function Page() {
  return <SurumNotlari dil="en" />;
}
