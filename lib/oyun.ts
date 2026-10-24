"use client";
// Puan, seri, lig ve konfeti isteyen için: Ayarlar'dan kapatılabilir. Kapalıyken puan yine sayılır, yalnızca gösterilmez;
// açınca birikmiş puan ve seri olduğu gibi görünür.
import { useSyncExternalStore } from "react";
import { read, subscribe, write } from "./store";

const ANAHTAR = "tf-oyun";
type Durum = "acik" | "kapali";
const acikMi = () => read<Durum>(ANAHTAR, "acik") === "acik";
export const useOyunAcik = () => useSyncExternalStore(subscribe, acikMi, () => true);
export const oyunAyarla = (acik: boolean) => write(ANAHTAR, acik ? "acik" : "kapali");
