// Konular sırayla açılır: bir konu, bir önceki konu bitince açılır. Öğrenci bir üniteyi biliyorsa ünite testini
// en az GECME puanla geçer; o ünitenin bütün konuları ve sonraki ünitenin ilk konusu açılır.
// Seviye testi: kilitli bir konuya atlamak isteyen öğrenci, o konudan önceki bütün konulardan karışık SEVIYE_SORU soru
// çözer; en az GECME alırsa o konu ve öncesindeki bütün konular açılır (öncekiler geçilmiş sayılır).
// Daha önce açılmış (başlanmış ya da bitirilmiş) konu kilitlenmez.
import type { Entry } from "./dersler";
import type { Asama, Prog, Seviye, Unite, Yer } from "./store";

/** Ünite testini geçmek için gereken en az puan (100 üzerinden). */
export const GECME = 80;
/** Ünite testinde en çok kaç soru sorulur. */
export const UNITE_SORU = 10;
/** Seviye testinde en çok kaç soru sorulur. */
export const SEVIYE_SORU = 10;

export type Durumlar = { prog: Prog; asama: Asama; yer: Yer; unite: Unite; seviye: Seviye };

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
/** Seviye testi geçilen en ileri konunun sırası (hazır konular içinde); geçilen yoksa -1. */
function seviyeSiniri(hazir: Entry[], d: Durumlar) {
  for (let i = hazir.length - 1; i > 0; i--) if ((d.seviye[`${hazir[i].ders}.${hazir[i].id}`] ?? 0) >= GECME) return i;
  return -1;
}
/** Konu öğrenmeden atlandı mı: ünitesinin testi ya da daha ileri bir konunun seviye testi geçildi. */
const atlandi = (hazir: Entry[], i: number, d: Durumlar) => uniteGecti(hazir[i].ders, hazir[i].unite, d) || i < seviyeSiniri(hazir, d);
/** Konu geçildi mi: testi bitti ya da atlandı. */
const gecildi = (hazir: Entry[], i: number, d: Durumlar) => bitti(hazir[i], d) || atlandi(hazir, i, d);
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
  return i === 0 || i <= seviyeSiniri(hazir, d) || gecildi(hazir, i, d) || baslandi(hazir[i], d) || gecildi(hazir, i - 1, d);
}

/** Konu açılmak için hangi konunun bitmesini bekliyor (kilitliyse). */
export function bekledigi(list: Entry[], id: string): Entry | undefined {
  const hazir = list.filter((e) => e.id);
  const i = hazir.findIndex((e) => e.id === id);
  return i > 0 ? hazir[i - 1] : undefined;
}

/** Sıradaki konu: bitmemiş ilk açık konu. Ünite ya da seviye testiyle atlanan konular geçilir (isteyen yine açabilir). */
export function siradaki(list: Entry[], d: Durumlar): Entry | undefined {
  const hazir = list.filter((e) => e.id);
  const aday = (e: Entry) => !bitti(e, d) && acik(list, e.id!, d);
  return hazir.find((e, i) => aday(e) && !atlandi(hazir, i, d)) ?? hazir.find(aday);
}

/** Konunun seviye testinde sorulacak konular: dersin bu konudan önceki bütün konuları. İlk konunun testi yoktur. */
export function seviyeKonulari(list: Entry[], id: string): Entry[] {
  const hazir = list.filter((e) => e.id);
  const i = hazir.findIndex((e) => e.id === id);
  return i > 0 ? hazir.slice(0, i) : [];
}

/** Seviye testinin adresi. */
export const seviyeHref = (ders: string, id: string) => `/seviye/${ders}/?konu=${id}`;

/** Ünitenin testi çözülebilir mi: ünitenin ilk konusu açıksa. */
export const uniteAcik = (list: Entry[], u: Unitem, d: Durumlar) => acik(list, u.konular[0].id!, d);

/** Ünite testinin adresi. */
export const uniteHref = (ders: string, u: number) => `/unite/${ders}/${u}/`;
