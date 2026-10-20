// Konular sırayla açılır: bir konu, bir önceki konu bitince açılır. Öğrenci bir üniteyi biliyorsa ünite testini
// en az GECME puanla geçer; o ünitenin bütün konuları ve sonraki ünitenin ilk konusu açılır.
// Daha önce açılmış (başlanmış ya da bitirilmiş) konu kilitlenmez.
import type { Entry } from "./dersler";
import type { Asama, Prog, Unite, Yer } from "./store";

/** Ünite testini geçmek için gereken en az puan (100 üzerinden). */
export const GECME = 80;
/** Ünite testinde en çok kaç soru sorulur. */
export const UNITE_SORU = 10;

export type Durumlar = { prog: Prog; asama: Asama; yer: Yer; unite: Unite };

export type Unitem = { no: number; ad: string; konular: Entry[] };
/** Dersin üniteleri, sırayla (yalnızca yazılmış konular). */
export function uniteler(list: Entry[]): Unitem[] {
  const out: Unitem[] = [];
  for (const e of list) {
    if (!e.id) continue;
    let u = out[out.length - 1];
    if (!u || u.no !== e.unite) out.push((u = { no: e.unite, ad: e.uniteAd, konular: [] }));
    u.konular.push(e);
  }
  return out;
}

export const uniteGecti = (ders: string, u: number, d: Durumlar) => (d.unite[`${ders}.${u}`] ?? 0) >= GECME;
const bitti = (e: Entry, d: Durumlar) => !!d.prog[`${e.ders}.${e.id}`];
/** Konu geçildi mi: testi bitti ya da ünitesinin testi geçildi. */
const gecildi = (e: Entry, d: Durumlar) => bitti(e, d) || uniteGecti(e.ders, e.unite, d);
/** Öğrenci bu konuya daha önce başlamış mı (aşama bitirmiş ya da bir aşamanın ortasında kalmış). */
const baslandi = (e: Entry, d: Durumlar) => {
  const k = `${e.ders}.${e.id}`;
  return (d.asama[k] ?? 0) > 0 || !!d.yer[k];
};

/** Konu açık mı? */
export function acik(list: Entry[], id: string, d: Durumlar): boolean {
  const hazir = list.filter((e) => e.id);
  const i = hazir.findIndex((e) => e.id === id);
  if (i < 0) return false;
  const e = hazir[i];
  return i === 0 || gecildi(e, d) || baslandi(e, d) || gecildi(hazir[i - 1], d);
}

/** Konu açılmak için hangi konunun bitmesini bekliyor (kilitliyse). */
export function bekledigi(list: Entry[], id: string): Entry | undefined {
  const hazir = list.filter((e) => e.id);
  const i = hazir.findIndex((e) => e.id === id);
  return i > 0 ? hazir[i - 1] : undefined;
}

/** Sıradaki konu: bitmemiş ilk açık konu. Testi geçilmiş ünitelerin konuları atlanır (isteyen yine açabilir). */
export function siradaki(list: Entry[], d: Durumlar): Entry | undefined {
  const aday = (e: Entry) => !!e.id && !bitti(e, d) && acik(list, e.id, d);
  return list.find((e) => aday(e) && !uniteGecti(e.ders, e.unite, d)) ?? list.find(aday);
}

/** Ünitenin testi çözülebilir mi: ünitenin ilk konusu açıksa. */
export const uniteAcik = (list: Entry[], u: Unitem, d: Durumlar) => acik(list, u.konular[0].id!, d);

/** Ünite testinin adresi. */
export const uniteHref = (ders: string, u: number) => `/unite/${ders}/${u}/`;

/** Kilitli konuya atlamak için çözülecek ünite testi: konunun ünitesi açıksa o, değilse sıradaki konunun ünitesi. */
export function atlamaUnitesi(list: Entry[], e: Entry, d: Durumlar): Unitem | undefined {
  const uler = uniteler(list);
  const h = uler.find((u) => u.no === e.unite);
  if (h && uniteAcik(list, h, d)) return h;
  const s = siradaki(list, d);
  return uler.find((u) => u.no === s?.unite);
}
