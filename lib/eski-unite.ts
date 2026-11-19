// 2026-11-19'dan önceki ünite yapısı (MEB sırası). Ünite testleri o zaman "ders.sıra" anahtarıyla kaydedildi (ör. "fizik.3").
// Konular dünya geneline göre yeniden gruplanınca yeni üniteler "ders.kod" anahtarını kullanır (content/dersler.json uniteKod).
// Eski anahtarla geçilmiş bir ünitenin konuları geçilmiş sayılmaya devam eder (lib/kilit.ts). Bu dosya değiştirilmez.
export const ESKI_UNITE: Record<string, string[]> = {
  "fizik.1": [
    "fizik-bilimine-giris",
    "madde-ozellikleri",
    "basinc",
    "kaldirma-kuvveti",
    "isi-sicaklik"
  ],
  "fizik.2": [
    "vektorler",
    "bir-boyutta-hareket",
    "newton-yasalari",
    "iki-boyutta-hareket",
    "bagil-hareket"
  ],
  "fizik.3": [
    "is-enerji-guc",
    "basit-makineler",
    "momentum",
    "tork-denge"
  ],
  "fizik.4": [
    "cembersel-hareket",
    "kutle-cekimi"
  ],
  "fizik.5": [
    "elektrostatik",
    "elektrik-akimi",
    "elektriksel-enerji",
    "manyetizma",
    "induksiyon-ac",
    "yari-iletkenler"
  ],
  "fizik.6": [
    "basit-harmonik-hareket",
    "dalgalar",
    "deprem",
    "optik",
    "dalga-optigi"
  ],
  "fizik.7": [
    "ozel-gorelilik",
    "kuantum",
    "radyoaktivite"
  ],
  "kimya.1": [
    "simya",
    "kimya-bilimi",
    "madde"
  ],
  "kimya.2": [
    "atom-modelleri",
    "atomun-yapisi",
    "modern-atom-teorisi",
    "periyodik-tablo"
  ],
  "kimya.3": [
    "kimyasal-baglar",
    "maddenin-halleri",
    "karisimlar"
  ],
  "kimya.4": [
    "temel-kanunlar",
    "tepkimeler",
    "mol",
    "asit-baz",
    "kimya-her-yerde"
  ],
  "kimya.5": [
    "gazlar",
    "cozeltiler"
  ],
  "kimya.6": [
    "tepkime-enerjisi",
    "tepkime-hizi",
    "kimyasal-denge"
  ],
  "kimya.7": [
    "redoks",
    "elektrokimya"
  ],
  "kimya.8": [
    "organik-giris",
    "hidrokarbonlar",
    "fonksiyonel-gruplar",
    "enerji-kaynaklari",
    "yesil-kimya"
  ],
  "biyoloji.1": [
    "canlilarin-ozellikleri",
    "biyomolekuller",
    "enzimler",
    "hucre-organeller",
    "madde-gecisi"
  ],
  "biyoloji.2": [
    "siniflandirma",
    "hayvanlar-alemi",
    "bitkiler-alemi"
  ],
  "biyoloji.3": [
    "mitoz",
    "mayoz",
    "kalitim"
  ],
  "biyoloji.4": [
    "ekosistem",
    "bitki-biyolojisi"
  ],
  "biyoloji.5": [
    "dna-genetik-kod",
    "protein-sentezi"
  ],
  "biyoloji.6": [
    "fotosentez",
    "hucresel-solunum"
  ],
  "biyoloji.7": [
    "sinir-sistemi",
    "endokrin",
    "duyu-organlari",
    "destek-hareket"
  ],
  "biyoloji.8": [
    "sindirim",
    "dolasim-bagisiklik",
    "solunum",
    "bosaltim",
    "ureme-sistemi"
  ],
  "biyoloji.9": [
    "populasyon-komunite",
    "evrim"
  ]
};
