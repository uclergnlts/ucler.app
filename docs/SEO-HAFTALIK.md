# Haftalık SEO önerisi

Her hafta Search Console (ve bağlıysa Bing) verisine bakılır, **kanıtıyla tek bir öneri** yazılır. Araç siteye hiçbir şey yazmaz. Öneri ancak Üçler "uygula" derse uygulanır.

Araç: `tools/seo-haftalik.mjs`. Rapor: `seo/haftalik/oneri-YYYY-AA-GG.md` (ortamda `SEO_CIKTI` ile değişir).

## Haftalık döngü

1. Pazartesi sabahı araç çalışır: son 28 gün ile önceki 28 gün karşılaştırılır (verinin son 3 günü atlanır, Google geç yazar).
2. Önce teknik sağlık: site haritası gönderilmiş mi, hatası var mı, haritadaki ilk 25 sayfanın kaçı dizinde.
3. Bekleyen deney varsa (son 21 günde yapılan değişiklik) yeni öneri yok: "Bu hafta değişiklik yok".
4. Yoksa adaylar puanlanır, en yüksek tahmini tıklama kazancı olan **tek** öneri seçilir.
5. Üçler "uygula" derse değişiklik bir dalda yapılır, `deneyler.json` dosyasına önceki sayılarla birlikte kaydedilir.
6. 28 gün sonra rapor o deneyin sonucunu gösterir.

## Aday türleri ve eşikler (kod: `KURAL`)

| Tür | Ne zaman | Öneri |
| --- | --- | --- |
| Başlık | Sayfa ≥100 gösterim, sıra ≤10, tıklama oranı beklenenin yarısından az | Başlık ve açıklamayı yeniden yaz (3 seçenek) |
| Yakın mesafe | Sayfa+sorgu ≥50 gösterim, sıra 5–20 | Sayfada o soruya doğrudan cevap ver, iç bağlantı ekle |
| Yamyamlık | Bir sorguda iki sayfa, her biri ≥%20 gösterim payı | Asıl sayfayı seç, diğerinden ona bağla |
| Düşen sayfa | Önceki 28 günde ≥10 tık, şimdi %40+ az | Önce neden raporu, sonra öneri |
| İçerik boşluğu | Sorgu ≥30 gösterim ama en iyi sıra >20 | Yeni konu ya da bölüm (haftalık konu planına aday) |

Toplam gösterim 28 günde 300'ün altındaysa ince ayar önerilmez; rapor bunu açıkça söyler ve en güçlü sinyali yalnız bilgi olarak verir.

## Kurulum (bir kez, Üçler)

1. **Search Console:** ucler.app mülkü yoksa https://search.google.com/search-console adresinde "Alan adı" mülkü olarak ekle (Squarespace DNS'e TXT kaydı).
2. **Google Cloud:** https://console.cloud.google.com adresinde bir proje aç, "Google Search Console API" yi etkinleştir, IAM > Servis hesapları > yeni servis hesabı > Anahtarlar > JSON anahtar indir.
3. **Yetki:** Search Console > Ayarlar > Kullanıcılar ve izinler > Kullanıcı ekle: servis hesabının e-postası, izin "Kısıtlanmış" (yalnız okuma).
4. **Anahtar:** JSON dosyasının içeriğini Claude ortamına `GSC_SERVIS_HESABI` gizli değişkeni olarak ekle. Anahtar repoya ve proje dosyalarına konmaz.
5. **Bing (isteğe bağlı):** https://www.bing.com/webmasters > siteyi Search Console'dan içe aktar > Ayarlar > API erişimi > anahtar oluştur > `BING_API_ANAHTARI`.

## Elle çalıştırma

```
GSC_SERVIS_HESABI=/yol/anahtar.json node tools/seo-haftalik.mjs
node tools/seo-haftalik.mjs --veri seo/haftalik/veri-2026-11-25.json   # kayıtlı veriyle
```

## deneyler.json biçimi

```json
[{ "tarih": "2026-12-01", "sayfa": "https://ucler.app/...", "tur": "baslik",
   "degisiklik": "Başlık X -> Y", "once": { "tik": 3, "gosterim": 270, "sira": 8.9 }, "sonuc": null }]
```
