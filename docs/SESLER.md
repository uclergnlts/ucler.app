# Sesler

Uygulamadaki ses efektleri `public/ses/` altındaki kısa mp3 dosyalarıdır; kod `lib/ses.ts`. Dosya yüklenemezse
aynı olay için `lib/ses.ts` içinde Web Audio ile üretilen sade ses çalar.

Kaynak: [earshot](https://github.com/Leonxlnx/earshot) (MIT, Leon Lin) ses bankası. Bu sesler kayıt değil, earshot'ta
koddan üretilir; `fit/...` ile başlayanlar CC0 kayıtlardan çıkarılmış tariflerdir (biz kullanmıyoruz).
Üretim: `earshot sfx render <id> -o x.wav --sr 44100`, sonra `ffmpeg -i x.wav -ac 1 -b:a 96k x.mp3`.

| dosya | ne zaman | earshot id | not |
|---|---|---|---|
| dogru.mp3 | doğru cevap | `pro_notify/ding_1930` | |
| yanlis.mp3 | yanlış cevap | `notify/mid_wood` | `--pitch E4` (yumuşak, alçak) |
| asama.mp3 | aşama bitti, oyun bitti | `mallet/up4` | |
| seviye.mp3 | konu testi bitti, ünite/seviye testi geçildi | `pro_logo_sting/taps_tone` | |
| cizim.mp3 | ders görseli çizilirken | `swipe/paper` | `--dur 0.9`, ffmpeg `highpass=f=700` iki kez |
| madalya.mp3 | madalya belirince | `ui_pop/wide` | |
| konfeti.mp3 | konfeti | `pro_shimmer/m1` | |
| puan.mp3 | puan sayarken tık | `pro_hover_tick/soft` | perde koddan yükselir |
| odul.mp3 | görev tamam rozeti | `notify/mid_tine` | |

Ses düzeyleri `lib/ses.ts` içindeki `DOSYA` tablosunda. Bir sesi değiştirirken dosyaya yeni ad ver (ör. `dogru-2.mp3`):
eski ad tarayıcılarda ve CDN'de önbellekte kalabilir.
