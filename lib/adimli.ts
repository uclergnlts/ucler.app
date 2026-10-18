// Adımlı dersler (Brilliant tarzı): her adımda bir sahne (hareketli görsel), kısa metin ve bir görev.
// İçerik content/adimli/*.json dosyalarındadır; biçim için docs/ICERIK-SPEC.md ("Adımlı ders").
import hareket from "@/content/adimli/bir-boyutta-hareket.json";
import atom from "@/content/adimli/atomun-yapisi.json";
import zar from "@/content/adimli/madde-gecisi.json";
import fizikGiris from "@/content/adimli/fizik-bilimine-giris.json";
import maddeOzellikleri from "@/content/adimli/madde-ozellikleri.json";
import simya from "@/content/adimli/simya.json";
import kimyaBilimi from "@/content/adimli/kimya-bilimi.json";
import canlilar from "@/content/adimli/canlilarin-ozellikleri.json";
import biyomolekuller from "@/content/adimli/biyomolekuller.json";
import basinc from "@/content/adimli/basinc.json";
import kaldirma from "@/content/adimli/kaldirma-kuvveti.json";
import madde from "@/content/adimli/madde.json";
import atomModelleri from "@/content/adimli/atom-modelleri.json";
import enzimler from "@/content/adimli/enzimler.json";
import hucreOrganeller from "@/content/adimli/hucre-organeller.json";
import type { DersId } from "./dersler";

/** etiket: şık yalnızca görselse ekran okuyucunun okuyacağı ad. */
export type Secenek = { yazi: string; etiket?: string; dogru?: boolean; neden: string };

/**
 * Öğrencinin sahnede değiştirdiği değer. "surgu" kaydırma çubuğu, "sayac" − / + düğmeleri, "anahtar" aç/kapa düğmesidir (0 / 1).
 * Gösterilen sayı = değer × carpan (ör. tuz değeri onda bir yüzde: carpan 0.1, onek "%").
 */
export type Kontrol = {
  ad: string; etiket: string; min: number; max: number; adim?: number;
  birim?: string; onek?: string; carpan?: number; tur?: "surgu" | "sayac" | "anahtar";
};

export type Gorev =
  /** Okuyup geçmek; adım hemen tamamlanır. */
  | { tur: "devam" }
  /** Sahneyi oynatmak. */
  | { tur: "oynat" }
  /** Doğru seçeneği bulmak; yanlışta "neden" ipucu olarak çıkar. kosu: soru, sahne bu kadar farklı değerle oynatılınca açılır. */
  | { tur: "secim"; soru: string; secenekler: Secenek[]; kosu?: number }
  /** Önce tahmin, sonra sahne oynar ve doğrusu gösterilir. Her tahmin adımı tamamlar. */
  | { tur: "tahmin"; soru: string; secenekler: Secenek[] }
  /** Değerleri hedefe getirmek. [en az, en çok] aralık da olabilir. Sahne oynatılabiliyorsa hedef değerlerle oynatılmalıdır. */
  | { tur: "ayarla"; hedef: Record<string, number | [number, number]>; tamam: string; ipucu?: string };

export type Sahne = { tur: string; sure?: number; [k: string]: unknown };

export type Adim = {
  baslik: string;
  metin: string;
  sahne: Sahne;
  /** Kontrollerin başlangıç değerleri. */
  deger?: Record<string, number>;
  kontroller?: Kontrol[];
  gorev: Gorev;
};

export type AdimliDers = { id: string; ders: DersId; konu: string; baslik: string; ozet: string; adimlar: Adim[]; kapanis: string[] };

export const ADIMLI: AdimliDers[] = [
  fizikGiris, maddeOzellikleri, basinc, kaldirma, hareket,
  simya, kimyaBilimi, madde, atomModelleri, atom,
  canlilar, biyomolekuller, enzimler, hucreOrganeller, zar,
] as unknown as AdimliDers[];
export const adimliDers = (id: string) => ADIMLI.find((d) => d.id === id);
