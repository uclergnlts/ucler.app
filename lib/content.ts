// İçerik tek kaynaktan gelir: content/*.json. Biçim için docs/ICERIK-SPEC.md'ye bak.
import fizik from "@/content/fizik.json";
import kimya from "@/content/kimya.json";
import biyoloji from "@/content/biyoloji.json";
import fizikEn from "@/content/en/fizik.json";
import kimyaEn from "@/content/en/kimya.json";
import biyolojiEn from "@/content/en/biyoloji.json";
import { DIL } from "./dil";
import { DERS_IDS, DERSLER, type DersId, type Entry, type Question, type Topic } from "./dersler";
import { adimliDers } from "./adimli";
import { sureDk } from "./asama";
import { soruIzi } from "./iz";

export * from "./dersler";
// JSON'dan gelen "tur" alanı string olarak çıkarılır; biçimi tools/check.py doğrular.
const TR = { fizik, kimya, biyoloji } as unknown as Record<DersId, Record<string, Topic>>;
// İngilizce kopyada çevrilmiş konular content/en/<ders>.json'dan gelir (tools/ceviri.py birlestir üretir);
// henüz çevrilmemiş konu Türkçe kalır.
const EN = { fizik: fizikEn, kimya: kimyaEn, biyoloji: biyolojiEn } as unknown as Record<DersId, Record<string, Topic>>;
const DATA = DIL === "en"
  ? (Object.fromEntries(DERS_IDS.map((d) => [d, { ...TR[d], ...EN[d] }])) as Record<DersId, Record<string, Topic>>)
  : TR;
/** Konu bu kopyanın dilinde mi? (İngilizce kopyada henüz çevrilmemiş konular için false.) */
export const cevrili = (d: DersId, id: string) => DIL !== "en" || id in EN[d];
/** Konunun İngilizce çevirisi var mı? (Hangi kopyada derlendiğinden bağımsız; hreflang ve site haritası için.) */
export const enHazir = (d: DersId, id: string) => id in EN[d];

export const topic = (d: DersId, id: string): Topic | undefined => DATA[d][id];

export function entries(d: DersId): Entry[] {
  let unite = 0, uniteAd = "", uniteKod = "";
  return DERSLER[d].konular.map((k, i) => {
    if (k.unite) { unite++; uniteAd = k.unite; uniteKod = k.uniteKod ?? String(unite); }
    const t = k.id ? topic(d, k.id) : undefined;
    if (!k.id || !t) return { ders: d, no: i + 1, ad: k.ad, sinav: k.sinav, unite, uniteAd, uniteKod };
    return {
      ders: d, no: i + 1, ad: k.ad, id: k.id, title: cevrili(d, k.id) ? t.title : k.ad, summary: t.summary, on: k.on, sinav: k.sinav, unite, uniteAd, uniteKod,
      cardCount: t.cards.length, quizCount: t.quiz.length, headings: t.cards.map((c) => c.h).join(" "),
      dk: sureDk(t.cards.length, adimliDers(k.id)?.adimlar.length ?? 0, t.quiz.length),
    };
  });
}

/** Bir ünitenin testi için ünitedeki konuların bütün soruları; anahtar "ders.konu.soru sırası" (tekrar ile aynı). */
export function uniteSorulari(d: DersId, u: number): Record<string, TekrarSoru> {
  const out: Record<string, TekrarSoru> = {};
  for (const e of entries(d)) {
    if (e.unite !== u || !e.id) continue;
    const t = topic(d, e.id)!;
    t.quiz.forEach((q, j) => { out[`${d}.${e.id}.${j}`] = { ...q, ders: d, konu: e.id!, baslik: t.title }; });
  }
  return out;
}

/** Bir dersin bütün test soruları (seviye testi bunlardan konunun öncesini seçer); anahtar tekrar ile aynı. */
export function dersSorulari(d: DersId): Record<string, TekrarSoru> {
  const out: Record<string, TekrarSoru> = {};
  for (const e of entries(d)) {
    if (!e.id) continue;
    const t = topic(d, e.id)!;
    t.quiz.forEach((q, j) => { out[`${d}.${e.id}.${j}`] = { ...q, ders: d, konu: e.id!, baslik: t.title }; });
  }
  return out;
}

export const allEntries = () => Object.fromEntries(DERS_IDS.map((d) => [d, entries(d)])) as Record<DersId, Entry[]>;

/** Aynı dersteki bir sonraki hazır konu. */
export function nextTopic(d: DersId, id: string): Entry | undefined {
  const list = entries(d);
  const k = list.findIndex((e) => e.id === id);
  return list.slice(k + 1).find((e) => e.id);
}

export function readyTopics(): { ders: DersId; id: string }[] {
  return DERS_IDS.flatMap((d) => entries(d).filter((e) => e.id).map((e) => ({ ders: d, id: e.id! })));
}

/** Tekrar ekranı için bütün test soruları; anahtar "ders.konu.soru sırası" (lib/store.ts Tekrar ile aynı). */
export type TekrarSoru = Question & { ders: DersId; konu: string; baslik: string };
export function tumSorular(): Record<string, TekrarSoru> {
  const out: Record<string, TekrarSoru> = {};
  for (const { ders, id } of readyTopics()) {
    const t = topic(ders, id)!;
    t.quiz.forEach((q, j) => { out[`${ders}.${id}.${j}`] = { ...q, ders, konu: id, baslik: t.title }; });
  }
  return out;
}

/** Profil'deki "Anlamadığım kartlar" için her konunun kart başlıkları; anahtar "ders.konu". */
export function kartBasliklari(): Record<string, string[]> {
  return Object.fromEntries(readyTopics().map(({ ders, id }) => [`${ders}.${id}`, topic(ders, id)!.cards.map((c) => c.h)]));
}

/** Günün sorusu havuzu: konu testlerindeki etkileşimli sorular (sırala, eşleştir, ayır, sayı). Sahne sorusu ve
 *  kartlara/şekle gönderme yapan sorular kart olmadan anlaşılmayacağı için dışarıda kalır. Seçim: lib/gunsoru.ts. */
// Havuz ve iz her dilde Türkçe kaynaktan hesaplanır: İngilizce kopyada da aynı gün aynı soru çıkar ve sunucu
// (supabase/functions/gunun-sorusu, Türkçe gunsoru-cevap.json) cevabı puanlayabilir.
export function gunSorusuHavuzu(): Record<string, TekrarSoru & { iz: string }> {
  const out: Record<string, TekrarSoru & { iz: string }> = {};
  for (const [key, q] of Object.entries(tumSorular())) {
    const tr = TR[q.ders][q.konu]?.quiz[Number(key.split(".")[2])];
    if (!tr || tr.tur !== q.tur) continue;
    if (q.tur !== "sirala" && q.tur !== "eslestir" && q.tur !== "ayir" && q.tur !== "sayi") continue;
    if (/yukarı|şekil|grafik|tablo|kartta|bu konu/i.test(tr.q)) continue;
    out[key] = { ...q, iz: soruIzi(tr.q) };
  }
  return out;
}
