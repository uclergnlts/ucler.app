"use client";
import { useEffect } from "react";
import { temaIzle, temaUygula } from "@/lib/tema";

/** Görünümü uygular ve telefonun açık/koyu ayarı değişince günceller. Ekrana bir şey çizmez. */
export default function TemaIzle() {
  useEffect(() => { temaUygula(); return temaIzle(); }, []);
  return null;
}
