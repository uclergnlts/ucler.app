# AGENTS.md: Codex için çalışma talimatı

## Projede kim ne yapar
- **Üçler (proje sahibi):** Ürünün yönüne ve tasarımına karar verir. Son söz onundur.
- **Claude (mimar ve inşaat ustası):** Sistemi tasarlar, içeriği yazar, siteyi ve videoları üretir.
- **Codex (müteahhit / denetçi):** Yapılan işi kontrol eder. Eksikleri, hataları ve tutarsızlıkları bulur ve raporlar.

Senin görevin **denetlemek**. Yeniden tasarlamak, ürünün yönünü değiştirmek ya da içeriği baştan yazmak senin işin değil.

## Ne yapabilirsin
1. **Raporla (her zaman).** Bulduğun her sorunu `denetim/RAPOR-YYYY-MM-DD.md` dosyasına, `docs/DENETIM.md` içindeki kalıba göre yaz.
2. **Kesin ve küçük hataları düzelt.** Doğruluğu tartışmasız olan hataları düzeltebilirsin:
   - yazım hataları
   - yanlış bir bilimsel bilgi, formül ya da sayı (kaynağıyla birlikte)
   - yanlış işaretlenmiş test cevabı
   - bozuk kod veya JavaScript hatası
   - kartın dışına taşan SVG yazısı
   - kırık bağlantı

   Her düzeltmeyi ayrı bir commit yap ve raporda "düzeltildi" diye işaretle.
3. **Büyük işleri yalnızca öner.** Yeni konu, yeni özellik, tasarım değişikliği ya da yeniden yapılandırma gerekiyorsa raporda "öneri" olarak yaz ve uygulama.

## Neyi değiştirmeyeceksin
`docs/KARARLAR.md` dosyasındaki kararlar Üçler'indir. Bunlara aykırı bir değişiklik yapma. Bir kararın yanlış olduğunu düşünüyorsan raporda gerekçesiyle belirt. Bunlar arasında şunlar var:
- ad, logo, renkler ve yazı tipleri
- alt menü sekmeleri
- video süresi ve kuralları
- maskot olmaması
- açık tema

## Proje haritası
| Yol | Ne |
|---|---|
| `site/index.html` | Tek sayfalık mobil öncelikli site (uygulama gibi). Konu listeleri `SUBJ` içindedir. |
| `site/fizik.js`, `kimya.js`, `biyoloji.js` | Konu içerikleri (kartlar, SVG görseller, 4 soruluk testler). |
| `tools/check.py` | İçerik doğrulayıcı. |
| `tools/ekran.js` | Her sayfanın ve kartın telefon boyutunda ekran görüntüsünü alır. |
| `video/` | Kısa dikey video şablonu, senaryolar, üretim adımları. |
| `docs/` | Mimari, içerik kuralları, kararlar, yol haritası, denetim listesi. |

## Kontrol komutları
```bash
python3 tools/check.py                              # "TAMAM" yazmalı
NODE_PATH=$(npm root -g) node tools/ekran.js ekran   # "Sayfa hatası yok" yazmalı; ekran/ klasöründeki görüntülere bak
```
Site derleme gerektirmez; `site/index.html` dosyasını tarayıcıda açman yeterli.

## Dil
- İçerik ve raporlar Türkçe yazılır.
- Öğrenciye "sen" diye hitap edilir.
- Hedef kitle 9. sınıftan üniversite 1-2. sınıfa kadar. Ton çocuksu olmamalı, ama sade olmalı.

## Önce oku
1. `docs/KARARLAR.md`
2. `docs/ICERIK-SPEC.md`
3. `docs/MIMARI.md`
4. `docs/DENETIM.md`
5. `docs/YOL-HARITASI.md`
