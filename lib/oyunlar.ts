// Oyun alanındaki oyunlar. Her oyun bir ya da birkaç konuya bağlıdır; konu bitince ders ekranı oyunu önerir.
import { cev } from "@/lib/dil";
import type { DersId } from "./dersler";

export type Oyun = { id: string; ad: string; ozet: string; ders: DersId; konular: string[]; hazir: boolean };

export const OYUNLAR: Oyun[] = [
  { id: "periyodik-tablo", ad: cev("Periyodik tabloda yerini bul"), ozet: cev("Elementi tablodaki doğru kutuya yerleştir."), ders: "kimya", konular: ["atomun-yapisi", "periyodik-tablo"], hazir: true },
  { id: "vektor-hedef", ad: cev("Vektörle hedefi vur"), ozet: cev("Vektörleri uç uca ekleyip hedefe ulaş."), ders: "fizik", konular: ["vektorler"], hazir: true },
  { id: "organel", ad: cev("Organeli bul"), ozet: cev("Görevi verilen organeli hayvan ya da bitki hücresinde bul."), ders: "biyoloji", konular: ["hucre-organeller"], hazir: true },
  { id: "atom-say", ad: cev("Formülde atom say"), ozet: cev("İndis, parantez ve katsayıya dikkat ederek atomları say."), ders: "kimya", konular: ["mol"], hazir: true },
];

export const konuOyunlari = (ders: DersId, konu: string) =>
  OYUNLAR.filter((o) => o.hazir && o.ders === ders && o.konular.includes(konu));
