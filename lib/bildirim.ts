"use client";
// Öğrenci bildirimi: "Anlamadım" ya da "Hata var". Ekibe ulaşır (Supabase public.bildirim tablosu; yalnızca ekleme
// izni var, öğrenci kimsenin bildirimini okuyamaz). Giriş yapmamış ziyaretçi de gönderebilir. Tablo ve günlük özet
// e-postası: supabase/migrations/20261024_ogrenci_bildirimi.sql, supabase/functions/bildirim-ozet.
import { Capacitor } from "@capacitor/core";
import { olay } from "./olay";

export type BildirimTur = "anlamadim" | "hata";

/** Bildirimin ilgili olduğu yer. yer: "kart 3", "adım 5", "test sorusu 2", "video KIM-01" gibi. */
export type BildirimYer = { ders: string; konu?: string; yer: string; ozet?: string };

const kirp = (s: string | undefined, n: number) => (s ? s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, n) : null);

/** Bildirimi gönderir; başarısızsa hata fırlatır (bağlantı yok, sınır aşıldı vb.). */
export async function bildirimGonder(tur: BildirimTur, y: BildirimYer, not: string) {
  const { sb } = await import("./bulut");
  const { error } = await sb().from("bildirim").insert({
    tur,
    ders: y.ders.slice(0, 20),
    konu: y.konu?.slice(0, 80) ?? null,
    yer: y.yer.slice(0, 80),
    ozet: kirp(y.ozet, 300),
    not: kirp(not, 600) || null,
    sayfa: (location.pathname + location.search).slice(0, 300),
    platform: Capacitor.getPlatform(),
  });
  if (error) throw error;
  olay("bildirim", { tur, yer: `${y.ders}.${y.konu ?? ""}.${y.yer}` });
}
