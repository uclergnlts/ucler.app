import { cev } from "@/lib/dil";
import type { Metadata } from "next";
import Home from "@/components/Home";
import { allEntries, gunSorusuHavuzu } from "@/lib/content";

// Web'de derslerin ana ekranı. Tanıtım sayfası buraya bağlantı vermez; iOS uygulaması yayına girene kadar durur.
export const metadata: Metadata = { title: cev("Dersler"), robots: { index: false } };

export default function Page() {
  return <Home all={allEntries()} gunHavuz={Object.keys(gunSorusuHavuzu())} />;
}
