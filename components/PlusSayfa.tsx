"use client";
// /plus/: Profil'deki "ucler Plus" satırından açılır. Ödeme duvarı kapalıyken (lib/abonelik.ts) Profil'e döner.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ABONELIK } from "@/lib/abonelik";
import { GeriTop, Govde } from "./temel";
import PlusEkran from "./Plus";

export default function PlusSayfa() {
  const router = useRouter();
  useEffect(() => { if (!ABONELIK) router.replace("/profil/"); }, [router]);
  if (!ABONELIK) return null;
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" baslik="ucler Plus" />
      <Govde><PlusEkran /></Govde>
    </div>
  );
}
