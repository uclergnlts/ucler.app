// Videolar tek yerde saklanır (content/videolar.json), iki yerde gösterilir: ilgili kartın altında ve Keşfet'teki akışta.
// Ayrıntı: docs/VIDEOLAR.md
import data from "@/content/videolar.json";
import type { DersId } from "./dersler";

export type VideoYer = { ders: DersId; konu: string; kart?: number };
/** soru: videonun sonundaki DÜŞÜN sorusu; cevap: videonun altında "Cevabı gör" ile açılan kısa açıklama. */
export type Video = { id: string; baslik: string; sure: number; src: string; poster?: string; yerler: VideoYer[]; soru?: string; cevap?: string };

export const VIDEOLAR = data as unknown as Video[];

/** Bu kartta gösterilecek videolar. kart 1'den başlar; kartı yazılmamış video konunun ilk kartında çıkar. */
export const kartVideolari = (ders: DersId, konu: string, kart: number) =>
  VIDEOLAR.filter((v) => v.yerler.some((y) => y.ders === ders && y.konu === konu && (y.kart ?? 1) === kart));

export const sureYaz = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Videodan ilgili karta giden adres. */
export const yerHref = (y: VideoYer) => `/${y.ders}/${y.konu}/${y.kart ? `?kart=${y.kart}` : ""}`;
