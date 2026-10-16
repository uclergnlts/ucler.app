# Denetim listesi (Codex)

Her denetimde aşağıdaki listeyi baştan sona geç. Bulgularını `denetim/RAPOR-YYYY-MM-DD.md` dosyasına, bu sayfanın sonundaki kalıpla yaz.

## 1. Bilimsel doğruluk (en önemli)
- [ ] Her kartın metni bilimsel olarak doğru. Tanımlar, formüller, birimler, sayılar, tarihler ve kişi adları kontrol edildi.
- [ ] Görseldeki bilgi metinle çelişmiyor. Örnek: oklar doğru yönde, değerler tutarlı.
- [ ] Test sorularında işaretli cevap (`a`) gerçekten doğru, diğer üç seçenek gerçekten yanlış. Açıklama (`e`) doğru.
- [ ] Sadeleştirme yanlış bilgiye dönüşmemiş.

## 2. Kapsam
- [ ] Konu, o konunun TYT/AYT'de beklenen temel kavramlarının hepsini kapsıyor. Eksik kavramları listele.
- [ ] Konu yolu (`content/dersler.json`) sınav konularının hepsini içeriyor. Eksik ya da yanlış sıralı konuları listele.
- [ ] Özet kartı konunun ana fikirlerini doğru topluyor.

## 3. Dil ve ton
- [ ] Yazım ve noktalama hataları yok, Türkçe karakterler doğru.
- [ ] Ton çocuksu değil, metin sade ve anlaşılır. Öğrenciye "sen" diye hitap ediliyor.
- [ ] Kart metinleri kısa (≤ 45 kelime) ve her kart tek fikir anlatıyor.

## 4. Görsel ve kullanılabilirlik
- [ ] `tools/ekran.js` görüntülerinde hiçbir yazı karttan taşmıyor, yazılar üst üste binmiyor ve okunabilir.
- [ ] Renkler yalnızca CSS değişkenleri ve yalnızca açık tema. `docs/KARARLAR.md` dosyasına aykırı bir görünüm yok.
- [ ] Telefon genişliğinde (390 px) yatay kaydırma yok.
- [ ] Erişilebilirlik: düğmelerin ve ikonların erişilebilir adı (aria-label) var, renk kontrastı yeterli.

## 5. Kod
- [ ] `python3 tools/check.py` → TAMAM.
- [ ] Tarayıcı konsolunda hata yok (`tools/ekran.js` "Sayfa hatası yok" diyor).
- [ ] Bütün adresler çalışıyor: `/`, `/kesfet/`, `/kaydedilenler/`, `/profil/`, `/<ders>/`, `/<ders>/<konu>/` ve olmayan bir konu adresi (404 sayfası). `npm run build` hatasız bitiyor.
- [ ] Kaydetme ve ilerleme sayfa yenilenince korunuyor. `localStorage` kapalıyken site çökmüyor.
- [ ] Kullanılmayan, eski kod ya da eski tasarımdan kalan parça yok.

## 6. Videolar (senaryo varsa)
- [ ] Konuşma metni 100-115 kelime, yani 45-60 saniye (Damla sesi saniyede yaklaşık 1,95 kelime okur). Asıl ölçüt videonun gerçek süresidir.
- [ ] Video bağımsız: "sıradaki video" gibi ifadeler yok. Video bir soruyla bitiyor.
- [ ] Sayılar yazıyla yazılmış (seslendirme için). Bilgi doğru.

## Bilinen açıklar (Claude'un bildikleri, 2026-10-15)
Bunları da doğrula ve raporuna ekle:
- Kodda ve `localStorage` anahtarlarında eski "Temelden Fen" adının izleri var (`tf-` öneki). Anahtarı değiştirmek mevcut ilerlemeyi siler, bu yüzden yalnızca öner.
- AYT konu listeleri resmi listeyle karşılaştırılmadı.
- Otomatik arayüz testi yok. Yalnızca içerik doğrulayıcı ve ekran görüntüsü aracı var.

## Rapor kalıbı
```markdown
# Denetim raporu: YYYY-MM-DD
Kapsam: (ne denetlendi: örn. content/kimya.json tamamı, site kodu)
Özet: X kritik, Y orta, Z küçük bulgu; N tanesi düzeltildi.

## Bulgular
| # | Önem | Yer | Sorun | Öneri / düzeltme | Durum |
|---|---|---|---|---|---|
| 1 | Kritik | kimya.js › atomun-yapisi › kart 3 | Elektronun kütlesi yanlış yazılmış | 9,11×10⁻³¹ kg olmalı (kaynak) | Düzeltildi (commit abc123) |
| 2 | Orta | dersler.json › biyoloji | "Bitki biyolojisi" AYT'de iki konuya ayrılıyor | Bölünmesi önerilir | Öneri |

Önem: **Kritik** = yanlış bilgi, çalışmayan özellik · **Orta** = eksik kavram, kafa karıştıran anlatım, görsel taşma · **Küçük** = yazım, biçim.

## Kapsam eksikleri
(Konu ve kavram listesi)

## Öneriler
(Büyük işler: uygulanmadı, Üçler'in kararına bırakıldı)
```
