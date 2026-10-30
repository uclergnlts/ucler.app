"use client";
// Günün sorusu: herkese aynı etkileşimli soru; gün Türkiye saatiyle 00:00'da değişir, dersler sırayla döner
// (fizik, kimya, biyoloji). Soru konu testlerindeki etkileşimli sorulardan seçilir (havuz: lib/content.ts gunSorusuHavuzu).
// Tek deneme hakkı vardır. Hesabı olan öğrencinin süresi ve puanı sunucuda tutulur ve haftalık lige eklenir
// (supabase/migrations/20261030_gunun_sorusu.sql). Hesabı olmayan da çözebilir; süre cihazda ölçülür, puan kaydedilmez.
// Bu cihazdaki son kayıt (yalnızca bugünün) ana sayfadaki kartı besler ve hesapsız ikinci denemeyi engeller.
import { useSyncExternalStore } from "react";
import { sb } from "./bulut";
import { read, subscribe, write } from "./store";

const ANAHTAR = "tf-gunsoru";

/** Doğru cevabın puanı: 100 + hız bonusu (ilk 10 sn +50, 60. saniyeye kadar azalarak 0). SQL'deki ozel.gun_puan ile aynı. */
export function gunPuan(ms: number) {
  return 100 + (ms <= 10_000 ? 50 : ms >= 60_000 ? 0 : Math.round((50 * (60_000 - ms)) / 50_000));
}
export const bonus = (ms: number) => gunPuan(ms) - 100;

/** Türkiye saatine göre bugünün tarihi (YYYY-AA-GG); sunucu da günü böyle sayar. */
export function trGun(t = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).format(t);
}

/** Bir sonraki Türkiye gece yarısına kalan süre: "5 saat 12 dk". (Türkiye yıl boyu UTC+3.) */
export function yeniSoruya(t = Date.now()) {
  const gece = Date.parse(`${trGun(t)}T00:00:00+03:00`) + 86_400_000;
  const dk = Math.max(1, Math.ceil((gece - t) / 60_000)), s = Math.floor(dk / 60);
  return s ? `${s} saat ${dk % 60} dk` : `${dk} dk`;
}

/** O günün sorusu. Gün sırasıyla ders döner; her dersin havuzunda adım asal sayı olduğu için havuz bitmeden soru tekrar etmez. */
export function gununSorusu(havuz: string[], gun: string): string | undefined {
  const gunNo = Math.floor(Date.parse(`${gun}T00:00:00Z`) / 86_400_000);
  const dersler = [...new Set(havuz.map((k) => k.split(".")[0]))];
  if (!dersler.length) return undefined;
  const ders = dersler[gunNo % dersler.length];
  const liste = havuz.filter((k) => k.startsWith(`${ders}.`));
  const tur = Math.floor(gunNo / dersler.length);
  const adim = [37, 41, 43, 47].find((p) => liste.length % p !== 0) ?? 1;
  return liste[(tur * adim + 11) % liste.length];
}

/** Sonuç. kayitli: puan sunucuya yazıldı (hesap var). ist: bugün cevaplayanlar (yalnız hesapla). */
export type GunSonuc = { dogru: boolean; ms: number; puan: number; kayitli: boolean; seri?: number; ist?: { kisi: number; dogru: number; gectigin: number } | null };
/** Bu cihazdaki kayıt. basla: süre başladığı an (cihaz saati, sunucudan geldiyse ona göre düzeltilmiş). */
/** misafir: hesapsız başlandı; sonradan giriş yapılsa da sunucuya taşınmaz. */
export type GunKayit = { g: string; soru: string; basla: number; misafir?: boolean; sonuc?: GunSonuc };

const BOS = null as GunKayit | null;
const oku = () => {
  const k = read<GunKayit | null>(ANAHTAR, BOS);
  return k && k.g === trGun() ? k : null;
};
export const gunKayitOku = oku;
export const gunKayitYaz = (k: GunKayit) => write(ANAHTAR, k);
export const useGunKayit = () => useSyncExternalStore(subscribe, oku, () => null);

// ---- Sunucu (yalnız giriş yapmış öğrenci) ----
export type SunucuDurum = {
  gun: string;
  kayit: { soru: string; gecen_ms: number; bitti: boolean; dogru: boolean | null; sure_ms: number | null; puan: number } | null;
  seri: number;
  ist: { kisi: number; dogru: number; gectigin: number } | null;
};

async function cagir(ad: string, arg?: Record<string, unknown>): Promise<SunucuDurum> {
  const { data, error } = await sb().rpc(ad, arg);
  if (error || !data) throw error ?? new Error("bos");
  return data as SunucuDurum;
}
export const sunucuDurum = () => cagir("gunun_sorusu_durum");
export const sunucuBasla = (soru: string) => cagir("gunun_sorusu_basla", { p_soru: soru });
export const sunucuBitir = (dogru: boolean) => cagir("gunun_sorusu_bitir", { p_dogru: dogru });

/** Sunucunun bitmiş kaydından sonuç. */
export const sunucuSonuc = (d: SunucuDurum): GunSonuc | undefined =>
  d.kayit?.bitti ? { dogru: !!d.kayit.dogru, ms: d.kayit.sure_ms ?? 0, puan: d.kayit.puan, kayitli: true, seri: d.seri, ist: d.ist } : undefined;
