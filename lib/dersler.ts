// Ders listesi ve türler. İstemci bileşenleri yalnızca bunu içe aktarır; konu içerikleri (büyük JSON) lib/content.ts'tedir.
import dersler from "@/content/dersler.json";

/** Etkileşimli kart görseli (components/Etk.tsx). Başlangıç değerleri içerikten gelir. */
export type Etk =
  | { tur: "atom"; p: number; n: number; e: number }
  | { tur: "vektor"; v: number; aci: number }
  | { tur: "osmoz"; c: number }
  | { tur: "sirala"; soru: string; ogeler: string[] }
  | { tur: "eslestir"; soru: string; ciftler: [string, string][] }
  | { tur: "ayir"; soru: string; gruplar: string[]; ogeler: [string, number, string?][] }
  | { tur: "isaretle"; soru: string; noktalar: { x: number; y: number; ad: string; acik: string }[] }
  | {
      tur: "formul";
      soru?: string;
      girdiler: { ad: string; etiket: string; birim?: string; min: number; max: number; adim: number; deger: number }[];
      ciktilar: { ad: string; ifade: string; birim?: string; basamak?: number; max?: number }[];
      yorum?: [number | null, string][];
    };
export type Card = { h: string; p: string; svg: string; key?: string; etk?: Etk };
/**
 * Konu sonu testinin sorusu. tur yazılmazsa çoktan seçmelidir (o: şıklar, a: doğru şıkkın sırası,
 * y: her yanlış şık için o şıktaki düşünce hatasını söyleyen tek cümle; doğru şıkta boş).
 * Etkileşimli türlerde öğrenci cevabını kurar, "Kontrol et" ile bir kez değerlendirilir (components/TestSoru.tsx).
 * sirala: ogeler doğru sırayla yazılır. eslestir: her çiftin sağı, solunun eşidir. ayir: [öğe, grup sırası].
 * sayi: cevap ± tolerans kabul edilir. sahne: adımlı derslerin sahnesi; kontrolleri hedefe getir
 * (sahne "test" modunda hedefi ve cevabı ele veren yazıları gizler, kontrol edince gösterir).
 */
export type Question = { q: string; e: string } & (
  | { tur?: "secim"; o: string[]; a: number; y?: string[] }
  | { tur: "sirala"; ogeler: string[] }
  | { tur: "eslestir"; ciftler: [string, string][] }
  | { tur: "ayir"; gruplar: string[]; ogeler: [string, number][] }
  | { tur: "sayi"; cevap: number; tolerans?: number; birim?: string }
  | {
      tur: "sahne";
      sahne: { tur: string; [k: string]: unknown };
      deger: Record<string, number>;
      kontroller: { ad: string; etiket: string; min: number; max: number; adim?: number; birim?: string; onek?: string; carpan?: number; tur?: "surgu" | "sayac" | "anahtar" }[];
      hedef: Record<string, number | [number, number]>;
    }
);
export type Secmeli = Extract<Question, { o: string[] }>;
export const secmeli = (q: Question): q is Secmeli => !q.tur || q.tur === "secim";
export type Topic = { title: string; summary: string; cards: Card[]; quiz: Question[] };
export type DersId = "fizik" | "kimya" | "biyoloji";
/** on: ön koşul konular (aynı dersten, listede daha önce gelen id'ler). Konu haritası bunlarla çizilir. */
export type Ders = { ad: string; yol: string; konular: { id?: string; ad: string; on?: string[]; sinav?: Sinav }[] };
/** Konunun YKS'de hangi oturumda çıktığı (content/dersler.json "sinav"; tools/check.py doğrular). */
export type Sinav = "TYT" | "AYT" | "TYT-AYT";
export const SINAV_AD: Record<Sinav, string> = { TYT: "TYT", AYT: "AYT", "TYT-AYT": "TYT ve AYT" };

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
  on?: string[];
  sinav?: Sinav;
};

export const DERSLER = dersler as Record<DersId, Ders>;
export const DERS_IDS = Object.keys(DERSLER) as DersId[];
export const isDers = (d: string): d is DersId => d in DERSLER;
