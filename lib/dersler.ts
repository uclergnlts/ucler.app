// Ders listesi ve türler. İstemci bileşenleri yalnızca bunu içe aktarır; konu içerikleri (büyük JSON) lib/content.ts'tedir.
import dersler from "@/content/dersler.json";

/** Etkileşimli kart görseli (components/Etk.tsx). Başlangıç değerleri içerikten gelir. */
export type Etk =
  | { tur: "atom"; p: number; n: number; e: number }
  | { tur: "vektor"; v: number; aci: number }
  | { tur: "osmoz"; c: number };
export type Card = { h: string; p: string; svg: string; key?: string; etk?: Etk };
export type Question = { q: string; o: string[]; a: number; e: string };
export type Topic = { title: string; summary: string; cards: Card[]; quiz: Question[] };
export type DersId = "fizik" | "kimya" | "biyoloji";
export type Ders = { ad: string; yol: string; konular: { id?: string; ad: string }[] };

/** Ders yolundaki bir konu: hazırsa kısa bilgisiyle, değilse yalnızca adıyla. Kart görsellerini taşımaz. */
export type Entry = {
  ders: DersId;
  no: number;
  ad: string;
  id?: string;
  title?: string;
  summary?: string;
  cardCount?: number;
  quizCount?: number;
  headings?: string;
};

export const DERSLER = dersler as Record<DersId, Ders>;
export const DERS_IDS = Object.keys(DERSLER) as DersId[];
export const isDers = (d: string): d is DersId => d in DERSLER;
