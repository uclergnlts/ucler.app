"use client";
// Alt menü ve günlük giriş bildirimi uygulama ekranlarına aittir; web'deki tanıtım sayfasında ("/") ve çizim galerisinde (/drawings/, /tr/cizimler/) gösterilmez.
import { usePathname } from "next/navigation";
import { DIL } from "@/lib/dil";
import { UYGULAMA } from "@/lib/site";
import Tabs from "./Tabs";
import Gunluk from "./Gunluk";

export default function Kabuk() {
  const yol = usePathname() ?? "";
  if (!UYGULAMA && ((DIL === "tr" && /^\/(tr\/?)?$/.test(yol)) || /^\/(tr\/cizimler|drawings)\/?$/.test(yol))) return null;
  return (
    <>
      <Tabs />
      <Gunluk />
    </>
  );
}
