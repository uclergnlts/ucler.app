// Konu haritası: ön koşullara (content/dersler.json "on") göre konuların durumu ve haritadaki yeri.
// Kilit yumuşaktır: ön koşulu bitmemiş konu kilitli görünür ama öğrenci isterse yine de açabilir.
import type { Entry } from "./dersler";
import type { Prog } from "./store";

export type Durum = "bitti" | "acik" | "kilitli";

/** Ön koşullarının hepsi bitmişse konu açıktır. */
export function durumlar(ders: string, list: Entry[], prog: Prog): Record<string, Durum> {
  const out: Record<string, Durum> = {};
  for (const e of list) {
    if (!e.id) continue;
    out[e.id] = prog[`${ders}.${e.id}`] ? "bitti" : (e.on ?? []).every((o) => prog[`${ders}.${o}`]) ? "acik" : "kilitli";
  }
  return out;
}

/** Sıradaki konu: listede bitmemiş ilk açık konu. */
export const siradaki = (list: Entry[], d: Record<string, Durum>) => list.find((e) => e.id && d[e.id] === "acik")?.id;

/** Bu konunun açtığı konular (onu ön koşul sayanlar). */
export const actiklari = (list: Entry[], id: string) => list.filter((e) => e.on?.includes(id));

export type Dugum = { e: Entry; serit: number; satir: number };
export type Kenar = { from: string; to: string };

/**
 * Metro haritası gibi yerleşim: konular ders sırasıyla alt alta (her satırda bir konu), solda şeritler.
 * Konu, ön koşullarından birinin son çocuğuysa onun şeridinde devam eder; değilse boş bir şerit açar.
 * Bir şerit, üzerindeki konunun son çocuğuna kadar dolu kalır; böylece hiçbir çizgi başka bir konunun
 * noktasından geçmez. Yazılar şeritlerin sağında durduğu için çizgiler yazıların üstünden geçmez.
 */
export function yerlesim(list: Entry[]): { dugumler: Dugum[]; kenarlar: Kenar[]; serit: number } {
  const hazir = list.filter((e) => e.id);
  const satir: Record<string, number> = {}, son: Record<string, number> = {}, serit: Record<string, number> = {};
  hazir.forEach((e, i) => { satir[e.id!] = son[e.id!] = i; });
  hazir.forEach((e, i) => (e.on ?? []).forEach((o) => { if (o in son) son[o] = Math.max(son[o], i); }));
  const dolu: number[] = []; // şerit -> dolu olduğu son satır
  hazir.forEach((e, i) => {
    let s = (e.on ?? []).map((o) => (son[o] === i ? serit[o] : undefined)).find((x) => x !== undefined);
    if (s === undefined) {
      s = dolu.findIndex((d) => d < i);
      if (s < 0) { s = dolu.length; dolu.push(-1); }
    }
    serit[e.id!] = s;
    dolu[s] = Math.max(dolu[s], son[e.id!]);
  });
  const dugumler = hazir.map((e) => ({ e, serit: serit[e.id!], satir: satir[e.id!] }));
  const kenarlar = hazir.flatMap((e) => (e.on ?? []).filter((o) => o in satir).map((o) => ({ from: o, to: e.id! })));
  return { dugumler, kenarlar, serit: dolu.length };
}
