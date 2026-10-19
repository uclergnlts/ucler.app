# Video stili (KIM-01 standardı)

Üçler KIM-01'i onayladı (2026-10-16: "tek kelime ile harika"). Bütün videolar bu stille üretilir. Yeni yerleşimi de onayladı ("harika, tam da istediğim gibi, tüm videoları bu şekilde yapacağız"). Şablon: `video/sablon/sahne.html`; yeni video için kopyalanır, yalnızca içerik değişir.

## Görünüm
Yerleşim (Üçler, 2026-10-16): üst bant ve başlık yukarıda, altyazı ve ilerleme çubuğu aşağıda; ortadaki görsel alan ferah kalır.

- **Kare:** Dikey 1080×1920, 30 fps, en çok 60 sn.
- **Zemin:** Açık gri `#f6f8fb`, üstünde 60 px'lik ince ızgara (`#e6ecf3`, %55 opaklık).
- **Üst bant (y 120):** Solda ders adı büyük harfle, önünde kısa çizgi (ders vurgu rengi). Sağda "ucler." yazı logosu (Manrope 800, lacivert, nokta vurgu renginde).
- **Başlık (y 195):** Manrope 800, 78 px, iki satır. İkinci satır sarı fosforlu vurgulu (`#ffd95a`, alt %38). Her sahnenin kendi başlığı vardır.
- **Çizimler (y ~450-1550):** Sahne katmanı 1,08 kat büyütülür ve 100 px aşağı kaydırılır, böylece başlıkla altyazı arasındaki geniş alanı doldurur. Sade çizgi grafik. Lacivert `#1d3557` 4-5 px kontur, gri `#9aa6b6` / `#c9d3e0`, vurgu için ders rengi ve sarı. Etiketler Inter 600, ikincil yazı `#5f6f88`. Gölge, gradyan, 3B, fotoğraf, maskot yok.
- **Altyazı şeridi (y 1610-1720):** Beyaz kutu, 2 px `#dbe3ee` kenar, 18 px köşe, Inter 800, 50 px. Ekranda 2-4 kelimelik grup (en çok 24 harf) durur, okunan kelime sarı vurgulanır. Şerit hiç yer değiştirmez; sığmazsa yazı küçülür.
- **İlerleme çubuğu (y 1755):** İnce çizgi, ders renginde dolar.
- **Kapanış:** "DÜŞÜN" etiketi (ders renginde) ve büyük soru (Manrope 800, 92 px), anahtar kelime sarı vurgulu.
- **Renkler:** Kimya `#d63c63`. Fizik ve biyoloji renkleri sitedeki ders renkleriyle aynı olur.

## Hareket
- Sahneler 0,4 sn'de yumuşak geçişle açılır ve kapanır.
- Öğeler konuşmada adları geçtiği anda belirir: 0,5 sn'de 24 px aşağıdan yukarı kayarak.
- Çizgiler kendini çizer (stroke-dashoffset); harita rotası gibi yollar konuşmayla birlikte uzar.
- Sürekli küçük hareketler (ateş titremesi, buhar, dönen elektronlar) sahneyi canlı tutar; dikkat dağıtacak kadar büyük değildir.
- Henüz sırası gelmeyen öğeler soluk (%18) görünebilir, sırası gelince belirginleşir.

## Ses ve zamanlama
- ElevenLabs "Damla - Energetic Content creator" sesi saniyede ~1,95 kelime okur. Metin **120-340 kelime** (1-3 dk) olmalı; KIM-01–KIM-10 100-115 kelimeydi. Uzun videoda görsel 15-20 saniyede bir yeni sahneye geçer, tek sahne uzun süre durağan kalmaz.
- Ses 60 sn'yi aşarsa `atempo` ile en çok %8 hızlandırılır (KIM-01: 64,8 → 60,0 sn).
- Altyazı ElevenLabs srt'sinden değil, senaryodaki metinden yapılır (srt'de filigran ve yazım hatası olabiliyor). Cümle zamanları `silencedetect` ile bulunur; kelime zamanları cümle içinde harf sayısıyla dağıtılır.

## İlk 2-3 saniye (Üçler, 2026-10-19)
Instagram ve YouTube, izleyicinin ilk 2-3 saniyede kaydırıp kaydırmadığına bakarak videoyu başkalarına önerir. Bu yüzden:
- **İlk cümle kancadır:** şaşırtıcı bir iddia ya da merak uyandıran bir soru, en çok ~6 kelime (≤ 3 sn). Tarihle, kişi adıyla ya da "Bu videoda…" diye açılmaz; hikâye (tarih, kişi) ikinci cümlede başlar.
  Örnek: "Bin dokuz yüz elli beş…" yerine "Vücudundaki her protein, yirmi harfli bir alfabeyle yazılmış."
- **İlk kare kancayı gösterir:** kanca 0. saniyede ekranda büyük yazıyla tam görünür (yavaş belirme yok), yanında konuyu anlatan güçlü bir görsel olur. Kapak (poster) karesi de bu karedir.
- Sessiz izleyen için de çalışmalı: altyazı ve büyük yazı, sesi açmadan kancayı anlatır.

## Son 2 saniye: özet kartı (Üçler, 2026-10-19)
BIY-07'den başlayarak her video, kapanış sorusundan sonra 2 saniyelik bir özet kartıyla biter. Amaç kaydetme ve paylaşmayı artırmaktır.
- Seslendirme yoktur; sesin sonuna 2 sn sessizlik eklenir, altyazı şeridi boş kalır.
- Kartta en çok 3 kısa madde olur (videonun ana bilgileri, her biri ~5 kelime), altında "Kaydet, sınavdan önce bak" ve ucler logosu.
- Kart tek seferde görünür (yavaş belirme yok); ekran görüntüsü alınınca tek başına okunabilir olmalıdır.
- Senaryo dosyasının notlarına "Özet kartı" başlığıyla bu 3 madde yazılır.
