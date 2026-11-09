# Sinematik hikâye videoları (Remotion, dikey 9:16)

tepkinne'nin video düzeninden uyarlandı (Üçler, 2026-11-09: "aynı ona benzer bir video").
Videolar React ile koddan çizilir. Lisanslı bir motor gerekmez, her Mac'te çalışır.

- **Format:** 1080×1920, 30 fps, Instagram Reels / YouTube Shorts.
- **Görünüm:** tam ekran 2D sahneler, sürekli hareket eden kamera, çekim başına 2-3,5 sn, kenar karartması, film greni.
- **Kahraman:** hardal sarısı kapüşonlu öğrenci (`src/hikaye/kit.tsx`, `Kahraman`, `DevYuz`).
- **Altyazı:** seslendirmenin kelime zamanlarıyla akar (`src/components/Caption.tsx`).
- **Kaynak künyesi:** sayı ya da tarih olan çekimde sol üstte küçük yazı. Sağ üstte "ucler.app".
- **Sesler:** `public/sfx/` depoya girmez (mp3). Üretmek için: `pip3 install numpy && python3 scripts/make_sfx.py` (genel efektler ve müzikler) ve `sh scripts/make_onkasim_sfx.sh` (siren, rüzgâr, yas müziği). Hepsi koddan sentezlenir, telif yok.

## Kurulum
```bash
cd video/hikaye
npm install
npm run studio          # tarayıcıda canlı önizleme
```
ffmpeg gerekir (`brew install ffmpeg`).

## Yeni video
1. Seslendirme mp3'ü `public/<konu>/ses.mp3` olarak konur (depoya girmez).
2. Satır zamanları whisper ile çıkarılır: `whisper-cli -m ggml-small.bin -l tr -f ses.wav` (16 kHz mono wav). Satır başı/sonu saniyeleri `scripts/<konu>_captions.py` içindeki `LINES` listesine yazılır, betik `src/<konu>/captions.ts` dosyasını üretir.
3. Çekimler `src/<konu>/shots.tsx`, sıralama ve sesler `src/<konu>/Video.tsx` (`PLAN`: her çekim bir kelimeye bağlanır).
4. `src/Root.tsx` dosyasına `Composition` eklenir.

## 10 Kasım: "Dokuzu beş geçe" (OZEL-10KASIM)
```bash
npm run render:onkasim   # out/OZEL-10KASIM-hikaye.mp4 (H.264, yuv420p, faststart, -14 LUFS)
npm run still:onkasim    # kapak
```
Ses: Üçler'in 2026-11-09 07:01 ElevenLabs kaydı (Damla, sp100), 101 sn, 21 satır.
Atatürk çizilmez; varlığı nesnelerle anlatılır (09.05'te duran saat, boş masa, tahta, bayrak).
