import type { Metadata } from "next";
import { paylasim } from "@/lib/seo";
import Cizimler from "@/components/Cizimler";

// Çizim galerisinin İngilizcesi; Türkçesi /tr/cizimler/ adresindedir.
export const metadata: Metadata = {
  title: { absolute: "Drawings · ucler" },
  description: "Every engraving-style drawing from the ucler YouTube videos, in one place.",
  alternates: { canonical: "/drawings/", languages: { en: "/drawings/", tr: "/tr/cizimler/", "x-default": "/drawings/" } },
  ...paylasim("Drawings · ucler", "Every engraving-style drawing from the ucler YouTube videos, in one place.", "en"),
};

export default function Page() {
  return <Cizimler dil="en" />;
}
