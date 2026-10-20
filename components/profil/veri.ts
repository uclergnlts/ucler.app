"use client";
// Profil ekranlarının ortak verisi: bitirilen konular, doğru oranı, kaydedilenler ve anlamadım listeleri.
// Ana Profil ekranı ve alt ekranlar (İstatistikler, Kaydedilenler, Anlamadıklarım) aynı hesabı buradan alır.
import { type DersId, type Entry, isDers } from "@/lib/dersler";
import { aktif, usePuan } from "@/lib/puan";
import { doneKeys, useAnlamadim, useAsama, useProg, useSaved, useYer, type Prog } from "@/lib/store";

/** "3/4 doğru" gibi sonuçları taşıyan bitmiş konular ve testlerdeki toplam doğru/soru. */
export function bitenler(prog: Prog) {
  const done = doneKeys(prog).filter((k) => /\//.test(prog[k]));
  let right = 0, total = 0;
  for (const k of done) {
    const m = String(prog[k]).match(/(\d+)\/(\d+)/);
    if (m) { right += +m[1]; total += +m[2]; }
  }
  return { done, right, total };
}

/** Profil verisi. yeni: hiç etkinlik yok (yalnızca günlük giriş puanı olabilir), bitmiş ya da yarım konu yok. */
export function useProfil() {
  const puan = usePuan(), prog = useProg(), asama = useAsama(), yer = useYer();
  const { done, right, total } = bitenler(prog);
  const yeni =
    done.length === 0 &&
    !Object.keys(asama).length &&
    !Object.keys(yer).length &&
    !Object.values(puan.gunler ?? {}).some(aktif);
  return { puan, prog, done, right, total, yeni };
}

/** Kaydedilen konular (silinmiş konular atlanır). */
export function useKaydedilenler(all: Record<DersId, Entry[]>) {
  const saved = useSaved();
  return saved.flatMap((k) => {
    const [d, id] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    return e ? [e] : [];
  });
}

/** "ders.konu.kart no" → konu ve kart başlığı; silinmiş kartlar atlanır. */
export function useAnlamadiklarim(all: Record<DersId, Entry[]>, basliklar: Record<string, string[]>) {
  const anlamadim = useAnlamadim();
  return anlamadim.flatMap((k) => {
    const [d, id, no] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    const h = basliklar[`${d}.${id}`]?.[+no - 1];
    return e && h ? [{ k, e, no: +no, h }] : [];
  });
}
