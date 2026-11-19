"use client";
// Görünüm (Üçler, 2026-11-16): açık "deney defteri" ya da koyu "karanlık oda". Varsayılan telefonun ayarını izler.
// İlk boyamadan önce app/layout.tsx içindeki küçük betik aynı kuralla <html data-tema> değerini koyar; burada yalnız değişiklik uygulanır.
import { useSyncExternalStore } from "react";
import { read, subscribe, write } from "./store";

export type Tema = "sistem" | "acik" | "koyu";
const ANAHTAR = "tf-tema";
const KOYU_SORGU = "(prefers-color-scheme: dark)";
const ZEMIN = { acik: "#f6f1e6", koyu: "#10182a" } as const;

const secili = () => read<Tema>(ANAHTAR, "sistem");
export const useTema = () => useSyncExternalStore(subscribe, secili, () => "sistem" as Tema);

/** Seçime ve telefonun ayarına göre <html data-tema> ile tarayıcı çubuğunun rengini günceller. */
export function temaUygula(t: Tema = secili()) {
  const koyu = t === "koyu" || (t === "sistem" && matchMedia(KOYU_SORGU).matches);
  const ad = koyu ? "koyu" : "acik";
  document.documentElement.dataset.tema = ad;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", ZEMIN[ad]));
}

export function temaAyarla(t: Tema) {
  write(ANAHTAR, t);
  temaUygula(t);
}

/** Telefonun koyu/açık ayarı değişince "Sistem" seçiliyse görünüm de değişir. */
export function temaIzle() {
  const m = matchMedia(KOYU_SORGU);
  const f = () => temaUygula();
  m.addEventListener("change", f);
  return () => m.removeEventListener("change", f);
}
