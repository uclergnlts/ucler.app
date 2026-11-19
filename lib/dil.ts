// Uygulamanın dili derleme anında belli olur: `NEXT_PUBLIC_DIL=en` ile derlenen kopya İngilizcedir ve /en/ altında
// yayınlanır (next.config.ts basePath). Türkçe kopya kökte durur. İki kopya aynı tarayıcı deposunu (ilerleme, ayarlar)
// paylaşır. Dil değişimi karşı kopyadaki aynı sayfaya gitmektir (components/profil/Ayarlar.tsx, app/layout.tsx).
//
// Görünen her metin kodda Türkçe yazılır ve cev("…") içine alınır; İngilizcesi lib/ceviri/en.json'da Türkçe metin
// anahtarıyla durur. Sözlükte olmayan metin Türkçe kalır; `node tools/ceviri-ui.js eksik` eksikleri listeler.
import EN from "./ceviri/en.json";

export type Dil = "tr" | "en";
export const DIL: Dil = process.env.NEXT_PUBLIC_DIL === "en" ? "en" : "tr";
/** İngilizce kopyanın kök yolu; Türkçe kopyada boştur. Düz <a href>, location ve public/ dosyaları için. */
export const DIL_KOK = DIL === "en" ? "/en" : "";
const SOZLUK: Record<string, string> | null = DIL === "en" ? (EN as Record<string, string>) : null;

/** Sayı biçimi: Türkçede ondalık virgül (2,5), İngilizcede nokta (2.5). toLocaleString(SAYI_YEREL, …) ile kullanılır. */
export const SAYI_YEREL = DIL === "en" ? "en-US" : "tr-TR";
export const ONDALIK = DIL === "en" ? "." : ",";
/** toLocaleString çıktısındaki binlik ayraç (boşlukla değiştirmek için). */
export const BINLIK = DIL === "en" ? /,/g : /\./g;

/**
 * Metni uygulamanın dilinde verir. {0}, {1}… yer tutucuları sırayla verilen değerlerle dolar.
 * Aynı Türkçe kelime iki yerde farklı çevriliyorsa bağlam "§" ile eklenir: cev("hız§bonus"). "§" ve sonrası
 * Türkçede gösterilmez, yalnızca sözlük anahtarını ayırır.
 */
export function cev(tr: string, ...v: unknown[]): string {
  const s = SOZLUK?.[tr] ?? (tr.includes("§") ? tr.slice(0, tr.indexOf("§")) : tr);
  return v.length ? s.replace(/\{(\d+)\}/g, (_, i) => String(v[+i])) : s;
}

/** Dil seçimi "tf-dil" anahtarında durur (app/layout.tsx içindeki betik de okur). Seçilmemişse null. */
export const DIL_ANAHTAR = "tf-dil";
export function dilSecimi(): Dil | null {
  try { const d = JSON.parse(localStorage.getItem(DIL_ANAHTAR) ?? "null"); return d === "en" || d === "tr" ? d : null; } catch { return null; }
}
/** Dili değiştirir: seçimi yazar ve aynı sayfanın öbür dildeki kopyasına gider. */
export function dilDegistir(d: Dil) {
  try { localStorage.setItem(DIL_ANAHTAR, JSON.stringify(d)); } catch {}
  if (d === DIL) return;
  const yol = location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  location.replace((d === "en" ? "/en" : "") + yol + location.search);
}
