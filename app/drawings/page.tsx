import type { Metadata } from "next";
import Cizimler from "@/components/Cizimler";

// Çizim galerisinin İngilizcesi; Türkçesi /tr/cizimler/ adresindedir.
export const metadata: Metadata = {
  title: { absolute: "Drawings · ucler" },
  description: "Every engraving-style drawing from the ucler YouTube videos, in one place.",
  alternates: { canonical: "/drawings/", languages: { en: "/drawings/", tr: "/tr/cizimler/" } },
};

export default function Page() {
  return <Cizimler dil="en" />;
}
