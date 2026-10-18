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
import isiSicaklik from "@/content/adimli/isi-sicaklik.json";
import vektorler from "@/content/adimli/vektorler.json";
import periyodikTablo from "@/content/adimli/periyodik-tablo.json";
import kimyasalBaglar from "@/content/adimli/kimyasal-baglar.json";
import siniflandirma from "@/content/adimli/siniflandirma.json";
import hayvanlar from "@/content/adimli/hayvanlar-alemi.json";
import newton from "@/content/adimli/newton-yasalari.json";
import ikiBoyut from "@/content/adimli/iki-boyutta-hareket.json";
import maddeninHalleri from "@/content/adimli/maddenin-halleri.json";
import karisimlar from "@/content/adimli/karisimlar.json";
import bitkiler from "@/content/adimli/bitkiler-alemi.json";
import mitoz from "@/content/adimli/mitoz.json";
import bagil from "@/content/adimli/bagil-hareket.json";
import isEnerji from "@/content/adimli/is-enerji-guc.json";
import temelKanunlar from "@/content/adimli/temel-kanunlar.json";
import tepkimeler from "@/content/adimli/tepkimeler.json";
import mayoz from "@/content/adimli/mayoz.json";
import kalitim from "@/content/adimli/kalitim.json";
import basitMakineler from "@/content/adimli/basit-makineler.json";
import momentum from "@/content/adimli/momentum.json";
import mol from "@/content/adimli/mol.json";
import asitBaz from "@/content/adimli/asit-baz.json";
import ekosistem from "@/content/adimli/ekosistem.json";
import bitkiBiyolojisi from "@/content/adimli/bitki-biyolojisi.json";
import tork from "@/content/adimli/tork-denge.json";
import cembersel from "@/content/adimli/cembersel-hareket.json";
import kimyaHerYerde from "@/content/adimli/kimya-her-yerde.json";
import gazlar from "@/content/adimli/gazlar.json";
import dnaGenetikKod from "@/content/adimli/dna-genetik-kod.json";
import proteinSentezi from "@/content/adimli/protein-sentezi.json";
import kutleCekimi from "@/content/adimli/kutle-cekimi.json";
import elektrostatik from "@/content/adimli/elektrostatik.json";
import cozeltiler from "@/content/adimli/cozeltiler.json";
import tepkimeEnerjisi from "@/content/adimli/tepkime-enerjisi.json";
import fotosentez from "@/content/adimli/fotosentez.json";
import hucreselSolunum from "@/content/adimli/hucresel-solunum.json";
import elektrikAkimi from "@/content/adimli/elektrik-akimi.json";
import elektrikselEnerji from "@/content/adimli/elektriksel-enerji.json";
import tepkimeHizi from "@/content/adimli/tepkime-hizi.json";
import kimyasalDenge from "@/content/adimli/kimyasal-denge.json";
import sinirSistemi from "@/content/adimli/sinir-sistemi.json";
import endokrin from "@/content/adimli/endokrin.json";
import manyetizma from "@/content/adimli/manyetizma.json";
import induksiyon from "@/content/adimli/induksiyon-ac.json";
import redoks from "@/content/adimli/redoks.json";
import elektrokimya from "@/content/adimli/elektrokimya.json";
import duyuOrganlari from "@/content/adimli/duyu-organlari.json";
import destekHareket from "@/content/adimli/destek-hareket.json";
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
  fizikGiris, maddeOzellikleri, basinc, kaldirma, isiSicaklik, vektorler, hareket, newton, ikiBoyut, bagil, isEnerji, basitMakineler, momentum, tork, cembersel, kutleCekimi, elektrostatik, elektrikAkimi, elektrikselEnerji, manyetizma, induksiyon,
  simya, kimyaBilimi, madde, atomModelleri, atom, periyodikTablo, kimyasalBaglar, maddeninHalleri, karisimlar, temelKanunlar, tepkimeler, mol, asitBaz, kimyaHerYerde, gazlar, cozeltiler, tepkimeEnerjisi, tepkimeHizi, kimyasalDenge, redoks, elektrokimya,
  canlilar, biyomolekuller, enzimler, hucreOrganeller, zar, siniflandirma, hayvanlar, bitkiler, mitoz, mayoz, kalitim, ekosistem, bitkiBiyolojisi, dnaGenetikKod, proteinSentezi, fotosentez, hucreselSolunum, sinirSistemi, endokrin, duyuOrganlari, destekHareket,
] as unknown as AdimliDers[];
export const adimliDers = (id: string) => ADIMLI.find((d) => d.id === id);
