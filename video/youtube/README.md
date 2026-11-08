# Yatay YouTube videoları (konuşmasız, karakterli)

Bu klasörde yalnızca bizim yazdığımız sahne dosyaları var. Videoları çizen "Stickman Studio" motoru (Üçler'in gönderdiği GrowKaz eklentisi) lisanssız olduğu için depoya **konmaz**; yerelde ayrı bir klasöre kurulur.

## Kurulum (yerel)
1. Eklentiyi aç, `studio/` klasörünü kur (`npm install`). Playwright'ı yeniden indirmek yerine makinedeki hazır sürüme bağla.
2. `yt01-ice/ucler-style.js` içindeki `ucler` stilini `engine/styles.js` içindeki `STYLES` nesnesine ekle.
3. `engine/core.js` içindeki `blurLayer` son satırında çizimi `g.setTransform(1,0,0,1,0,0)` ile sıfırlamadan, çağıranın dönüşümüyle yap: `g.drawImage(c.b, 0, 0, E.W, E.H)`. Shorts sarmalayıcısı bunu gerektiriyor; yatay videoda sonuç değişmez.
4. `yt01-ice/` klasörünü `studio/projects/yt01-ice/` olarak kopyala. `assets/` klasörüne `public/fonts/manrope-latin-wght-normal.woff2` dosyasını koy. `input/silence.wav` dosyası boş ses (motor seslendirme dosyası istiyor; bu videolarda konuşma yok).

## Çekim
```
python3 projects/yt01-ice/story/build_shots.py          # çekim tablosu -> story/shots.json
node render.mjs --project projects/yt01-ice --sheet      # her çekimden bir kare
node render.mjs --project projects/yt01-ice --workers 4  # tam video (sessiz)
python3 audio/mix.py --project projects/yt01-ice         # müzik + efekt + birleştirme
```

## Shorts (9:16)
`shorts/build_shorts.py` aynı yatay çekimlerden iki dikey proje kurar (`yt01-short-a`, `yt01-short-b`). `shorts/wrap.js` her yatay çekimi tam yükseklikte çizip `cx` anahtar karelerine göre kaydırarak dikey kadraja oturtur; sayı etiketleri kadrajın içinde kalır.

## Kurallar
- Ekranda kelime yok; yalnızca sayı, birim ve sembol (°C, %, L, g/cm³, ?, ✓).
- Kahraman her videoda aynı: hardal sarısı kapüşonlu, lacivert pantolon (`scenes/cast.js`).
- Sesler motorun kendi sentezlediği efektler ve müzik; dış dosya yok, lisans sorunu yok.
