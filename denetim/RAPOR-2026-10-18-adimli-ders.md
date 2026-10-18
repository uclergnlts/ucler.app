# Denetim raporu: 2026-10-18 — Adımlı dersler ve BIY-04–06

Denetçi: Codex. İncelenen sürüm: `c674b33`. Raporun tamamı Üçler'e proje sohbetinde iletildi; bu dosya bulguları ve durumlarını kayda geçirir.

Özet: 2 kritik, 5 orta bulgu. Önceki F01, E01 ve F02 kapandı.

## Bulgular ve durum

| # | Önem | Yer | Sorun | Durum |
|---|---|---|---|---|
| A01 | Kritik | Bir boyutta hareket (adımlı) › kapanış | "Hız her saniye alınan yol" sürati tanımlıyordu ve konum-zaman eğimiyle eşitleniyordu. Kaynak: OpenStax Physics 2.2. | Düzeltildi. Kapanış: "Hız = yer değiştirme / süre (v = Δx / Δt); konum-zaman grafiğinin eğimidir. Toplam yolun süreye oranı ise sürattir; geri dönülen bir yolculukta ikisi farklıdır." |
| A02 | Kritik | Atomun yapısı (adımlı) › adım 2 ve kapanış | "Her atom üç taneciğin birleşimidir" ifadesi nötronsuz ¹H'yi dışlıyordu. | Düzeltildi. "Atomu üç temel tanecikle açıklarız" + "Tek istisna en yaygın hidrojen atomudur (¹H): çekirdeği yalnızca bir protondur, nötronu yoktur." Kapanışta da ¹H notu var. |
| A03 | Orta | Bir boyutta hareket › adım 5 | Yalnızca SVG olan üç şıkkın erişilebilir adı boştu. | Düzeltildi. Şıklara `etiket` alanı eklendi ve düğmeye `aria-label` olarak yazılıyor: "Kareler eşit aralıklı", "Kareler arası açılıyor", "Kareler arası daralıyor". `tools/check.py` artık yalnızca görsel olan şıkta etiket arıyor. Tarayıcıda doğrulandı. |
| A04 | Orta | Bir boyutta hareket › adım 4 (konum-zaman) | Koşu bitince araba x = 0'a dönüyor, grafik 20 m'de kalıyordu. | Düzeltildi. Araba konumu oynatma zamanından çiziliyor; bitişte grafik ucuyla aynı yerde duruyor, değer değişince ya da yeni koşuda birlikte başa dönüyor. 4 m/s × 5 s sonunda araba x = 20 m'de (svg x = 142). |
| V01 | Orta | BIY-04 › Cevabı gör | Ayçiçeği/kolzanın yağlı oluşu rüzgârla yayılmaya bağlanıyordu (ayçiçeği tohumları hayvanlarla yayılır). | Düzeltildi. Cevap: "Yağ olarak. Yağ aynı enerjiyi nişastanın yaklaşık yarısı kadar kütlede taşır (1 g yağ ≈ 9 kcal, 1 g nişasta ≈ 4 kcal). Böylece tohum hafif kalır ve rüzgârla daha kolay taşınır." Örnek bitkiler çıkarıldı. |
| V02 | Orta | BIY-06 › 59,9–69,7 sn | Vitaminlerin tümü "enzimin yardımcısı" olarak gösteriliyordu. | Kısmen düzeltildi. Ekrandaki başlık "Birçok vitamin: enzimin yardımcısı" oldu ve video yeniden üretildi. Seslendirmedeki "Görevleri, enzimlerin düzgün çalışmasına yardım etmektir" cümlesi için yeni ses bekleniyor (önerilen cümle Üçler'e iletildi); ses gelince senaryo ve altyazı da değişecek. |
| V03 | Orta | BIY-06 › 14,3–33,7 sn başlığı | "1747: ilk kontrollü deney" tarihsel olarak fazla kesin (Paré, 1575). | Düzeltildi. Başlık "1747: öncü bir klinik deney"; video yeniden üretildi. Seslendirmede "ilk" iddiası yok. |

## Öneri

- Adımlı ders dosyaları için doğrulama: uygulandı. `tools/check.py` sahne adını, tek doğru şıkkı, şıklarda `neden`i, görsel şıkta `etiket`i, kontrol başlangıç değerlerini ve `ayarla` hedeflerinin kontrolle ulaşılabilir olmasını denetliyor.
