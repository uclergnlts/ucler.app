"use client";
// Haftalık lig: pazartesi 00:00 - pazar 23:59 (Türkiye saati) arasında kazanılan puanlar.
// Liste sunucuda kurulur (supabase/migrations/20261021_haftalik_lig.sql, haftalik_lig fonksiyonu): yalnızca hesabı olan ve
// "Haftalık ligde görün" anahtarı açık öğrenciler; dönen yalnızca ad, puan, sıra. Günlük puan en çok 600 sayılır.
import { sb, simdiEsitle } from "./bulut";

/** madalya: geçen haftanın ilk üçündeyse 1, 2 ya da 3. */
export type LigSatir = { sira: number; ad: string; puan: number; ben?: boolean | null; madalya?: number | null };
export type Lig = {
  bas: string;
  /** Haftanın bittiği an (gelecek pazartesi 00:00, Türkiye). */
  bitis: string;
  kisi: number;
  liste: LigSatir[];
  /** Giriş yapan öğrencinin satırı; ligde: listede görünüyor mu. */
  ben: (LigSatir & { ligde: boolean }) | null;
};

/** Ligi okur. Giriş yapılmışsa önce bekleyen puanı buluta yazar. Okunamazsa null. */
export async function ligOku(girisli: boolean): Promise<Lig | null> {
  if (girisli) await simdiEsitle().catch(() => false);
  const { data, error } = await sb().rpc("haftalik_lig");
  return error || !data ? null : (data as Lig);
}

/** "2 gün 5 saat", "3 saat 12 dk", "8 dk". */
export function kalanSure(bitis: string, simdi = Date.now()) {
  const dk = Math.max(0, Math.floor((Date.parse(bitis) - simdi) / 60_000));
  const g = Math.floor(dk / 1440), s = Math.floor((dk % 1440) / 60), d = dk % 60;
  return g ? `${g} gün ${s} saat` : s ? `${s} saat ${d} dk` : `${d} dk`;
}
