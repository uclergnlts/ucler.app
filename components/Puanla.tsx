"use client";
import { useEffect } from "react";
import { puanIste } from "@/lib/yerel";

/** Kutlama ekranına konur: kutlama bittikten sonra mağazanın puanlama penceresini ister (lib/yerel.ts puanIste). */
export default function Puanla() {
  useEffect(() => {
    const t = setTimeout(() => void puanIste(), 2500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
