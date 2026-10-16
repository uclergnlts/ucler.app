# Videolar

Videolar dikey 9:16 (1080×1920) ve 45-60 saniyedir. Her video tek başına durur ve bir soruyla biter. Kuralların tamamı `docs/KARARLAR.md` dosyasında.

## Klasörler
- `senaryolar/`: Her video için bir `.md` dosyası (örnek: `KIM-01.md`). İçinde konuşma metni (ElevenLabs'a aynen yapıştırılır), görsel plan ve kapanış sorusu bulunur.
- `sablon/style.html`: "Sade bilgi grafiği" stilinin örnek kareleri. Manrope + Inter, ızgaralı açık zemin, sabit altyazı şeridi (y 1405-1515), altında ilerleme çubuğu, kapanışta "DÜŞÜN" kartı. Ders vurgu rengi kimya için #d63c63, sarı vurgu #ffd95a.
- `sablon/shot.js`: Kare kare görüntü alma aracı.
- `ornek/KIM-01-ornek-kareler.png`: Onaylanan stilin örneği.

## Senaryo kalıbı
| Süre | Bölüm |
|---|---|
| 0-5 sn | Kanca |
| 5-15 sn | Hikâye |
| 15-40 sn | Açıklama |
| 40-50 sn | Bağlantı |
| 50-60 sn | Düşündüren soru |

- Seslendirme (ElevenLabs "Damla" sesi) saniyede yaklaşık 2,6 kelime okur. Bu yüzden metin **120-150 kelime** olmalı.
- Sayılar seslendirme için yazıyla yazılır.
- Kodlar: `KIM-nn`, `FIZ-nn`, `BIY-nn`.

## Üretim
1. Üçler mp3 ve srt dosyasını gönderir.
2. Cümle zamanları sessizliklerden çıkarılır: `ffmpeg -i ses.mp3 -af silencedetect=n=-35dB:d=0.25 -f null -`
3. Sahne dosyası (`scene.html`) `window.render(t)` fonksiyonunu dışa açar ve t saniyedeki kareyi çizer.
4. Kareler alınır: `mkdir frames && NODE_PATH=$(npm root -g) node shot.js frames <saniye>` (kontrol için tek kareler: `node shot.js stills 1,10,30`).
5. Kareler sesle birleştirilir: `ffmpeg -framerate 30 -i frames/f%05d.jpg -i ses.mp3 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart cikti.mp4`

Ses ve video dosyaları depoya konmaz, çünkü çok büyükler.

## Siteye ekleme
Biten video video deposuna yüklenir ve `content/videolar.json` dosyasına konu ve kart numarasıyla yazılır. Ayrıntı: `docs/VIDEOLAR.md`.
