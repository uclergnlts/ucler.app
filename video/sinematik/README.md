# Sinematik hikâye videoları (Remotion)

tepkinne'nin video altyapısından uyarlandı (9 Kasım 2026). Dikey 1080×1920, koddan çizilen 2D sahneler,
tekrar eden kahraman (mavi atkılı, sırt çantalı öğrenci), sürekli hareketli kamera, çekim başına 2-3,5 sn,
kelime kelime altyazı, koddan üretilmiş efekt ve müzik (public/sfx, scripts/make_sfx.py).

```bash
cd video/sinematik && npm install
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx tsc --noEmit
npx remotion render OnKasim out/ham.mp4 --concurrency=4
ffmpeg -i out/ham.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -pix_fmt yuv420p -crf 21 -c:a aac -b:a 160k -movflags +faststart out/<KOD>.mp4
```

## Yeni video
1. Ses `public/<konu>/ses.mp3`.
2. Kelime zamanları: faster-whisper (`small`, `language='tr'`, `word_timestamps=True`; ses dosyası yolu yerine numpy dizisi verilir),
   sonra zamanlar senaryo metnine oturtulur ve `src/<konu>/words.json` yazılır (rakamla gösterilecek ifadeler birleştirilir, asıl yazım `k` alanında).
3. `src/<konu>/shots.tsx`: çekimler (kit: `src/kit.tsx`). `src/<konu>/Video.tsx`: çapa kelimeli çekim planı, efektler, müzik.
4. `src/Root.tsx`'e kompozisyon eklenir.

Kit: Shot (kamera: zoom, pan, rot, shake, tint), Kahraman (ifade, kol, canta), DevYuz, Figur, Oda, City, Sema, Takvim, Rakam, Soru, Flash, Dust.
Gerçek kişi çizilmez; geçmiş sahneler sepya tonla (Eski) verilir.
