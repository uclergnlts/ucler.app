// Adımlı dersler (Brilliant tarzı): her adımda bir sahne (hareketli görsel), kısa metin ve bir görev.
// İçerik content/adimli/*.json dosyalarındadır; biçim için docs/ICERIK-SPEC.md ("Adımlı ders").
import hareket from "@/content/adimli/bir-boyutta-hareket.json";
import atom from "@/content/adimli/atomun-yapisi.json";
import modernAtom from "@/content/adimli/modern-atom-teorisi.json";
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
import yariIletkenler from "@/content/adimli/yari-iletkenler.json";
import redoks from "@/content/adimli/redoks.json";
import elektrokimya from "@/content/adimli/elektrokimya.json";
import duyuOrganlari from "@/content/adimli/duyu-organlari.json";
import destekHareket from "@/content/adimli/destek-hareket.json";
import bhh from "@/content/adimli/basit-harmonik-hareket.json";
import dalgalar from "@/content/adimli/dalgalar.json";
import deprem from "@/content/adimli/deprem.json";
import organikGiris from "@/content/adimli/organik-giris.json";
import hidrokarbonlar from "@/content/adimli/hidrokarbonlar.json";
import sindirim from "@/content/adimli/sindirim.json";
import dolasim from "@/content/adimli/dolasim-bagisiklik.json";
import optik from "@/content/adimli/optik.json";
import dalgaOptigi from "@/content/adimli/dalga-optigi.json";
import fonksiyonelGruplar from "@/content/adimli/fonksiyonel-gruplar.json";
import enerjiKaynaklari from "@/content/adimli/enerji-kaynaklari.json";
import yesilKimya from "@/content/adimli/yesil-kimya.json";
import solunum from "@/content/adimli/solunum.json";
import bosaltim from "@/content/adimli/bosaltim.json";
import ozelGorelilik from "@/content/adimli/ozel-gorelilik.json";
import kuantum from "@/content/adimli/kuantum.json";
import radyoaktivite from "@/content/adimli/radyoaktivite.json";
import uremeSistemi from "@/content/adimli/ureme-sistemi.json";
import populasyonKomunite from "@/content/adimli/populasyon-komunite.json";
import evrim from "@/content/adimli/evrim.json";
import type { DersId } from "./dersler";

/** etiket: şık yalnızca görselse ekran okuyucunun okuyacağı ad. */
export type Secenek = { yazi: string; etiket?: string; dogru?: boolean; neden: string };

/**
 * Öğrencinin sahnede değiştirdiği değer. "surgu" kaydırma çubuğu, "sayac" − / + düğmeleri, "anahtar" aç/kapa düğmesidir (0 / 1).
 * "dugme" her basışta değeri bir artırır; sahnenin bagla işlevi bunu bir eylem gibi yorumlar (ör. taze enzim koymak).
 * Gösterilen sayı = değer × carpan (ör. tuz değeri onda bir yüzde: carpan 0.1, onek "%").
 */
export type Kontrol = {
  ad: string; etiket: string; min: number; max: number; adim?: number;
  birim?: string; onek?: string; carpan?: number; tur?: "surgu" | "sayac" | "anahtar" | "dugme";
};

/** Hedef: değer adı → tam değer ya da [en az, en çok]. Adlar kontroller ya da sahnenin ölçtüğü değerler (olc) olabilir. */
export type Hedef = Record<string, number | [number, number]>;

/**
 * Canlı simülasyonda bulunacak bir şey. hedef dizi ise hepsine bir kez uğramak gerekir (sirali: verilen sırayla).
 * coz: "Çözümü göster"de kontrollerin sırayla gideceği değerler; tamam: bulununca alttaki çubukta çıkan açıklama.
 */
export type Bulgu = { yazi: string; hedef: Hedef | Hedef[]; sirali?: boolean; coz: Record<string, number>[]; tamam: string };

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
  | { tur: "ayarla"; hedef: Hedef; tamam: string; ipucu?: string }
  /** Canlı simülasyon: sahne sürekli çalışır, öğrenci serbestçe dener; bulguların hepsi bulununca adım tamamlanır. */
  | { tur: "kesfet"; bulgular: Bulgu[] };

export type Sahne = { tur: string; sure?: number; [k: string]: unknown };

export type Adim = {
  baslik: string;
  metin: string;
  sahne: Sahne;
  /** Kontrollerin başlangıç değerleri. */
  deger?: Record<string, number>;
  kontroller?: Kontrol[];
  gorev: Gorev;
  /** Konu anlatımında bu adımın duracağı yer: bu numaralı karttan hemen sonra (1'den başlar). */
  kart?: number;
  /** "Göster": öğrenci denemeden önce sahne bir örneği kendisi oynar. deger: kontrollerin örnekte gideceği
   * değerler (görevin cevabı olmamalı); not: örneğin altındaki kısa açıklama; oynat: false ise sahne oynatılmaz. */
  goster?: { deger?: Record<string, number>; not?: string; oynat?: boolean };
};

export type AdimliDers = { id: string; ders: DersId; konu: string; baslik: string; ozet: string; adimlar: Adim[]; kapanis: string[] };

export const ADIMLI: AdimliDers[] = [
  fizikGiris, maddeOzellikleri, basinc, kaldirma, isiSicaklik, vektorler, hareket, newton, ikiBoyut, bagil, isEnerji, basitMakineler, momentum, tork, cembersel, kutleCekimi, elektrostatik, elektrikAkimi, elektrikselEnerji, manyetizma, induksiyon, yariIletkenler, bhh, dalgalar, deprem, optik, dalgaOptigi, ozelGorelilik, kuantum, radyoaktivite,
  simya, kimyaBilimi, madde, atomModelleri, atom, modernAtom, periyodikTablo, kimyasalBaglar, maddeninHalleri, karisimlar, temelKanunlar, tepkimeler, mol, asitBaz, kimyaHerYerde, gazlar, cozeltiler, tepkimeEnerjisi, tepkimeHizi, kimyasalDenge, redoks, elektrokimya, organikGiris, hidrokarbonlar, fonksiyonelGruplar, enerjiKaynaklari, yesilKimya,
  canlilar, biyomolekuller, enzimler, hucreOrganeller, zar, siniflandirma, hayvanlar, bitkiler, mitoz, mayoz, kalitim, ekosistem, bitkiBiyolojisi, dnaGenetikKod, proteinSentezi, fotosentez, hucreselSolunum, sinirSistemi, endokrin, duyuOrganlari, destekHareket, sindirim, dolasim, solunum, bosaltim, uremeSistemi, populasyonKomunite, evrim,
] as unknown as AdimliDers[];
export const adimliDers = (id: string) => ADIMLI.find((d) => d.id === id);
