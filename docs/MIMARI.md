# Mimari

## Şu anki durum
Site bir **Next.js** uygulamasıdır (App Router, React, TypeScript, Tailwind CSS). Derleme sonucu tamamen statiktir (`output: "export"`): `npm run build` komutu `out/` klasörüne düz HTML, CSS ve JS dosyaları üretir. Sunucu, veritabanı ve kullanıcı hesabı yoktur. Yayın için Vercel düşünülüyor; `ucler.app` alan adı oraya bağlanacak.

```
content/
  dersler.json     her dersin adı, yol başlığı ve sıralı konu listesi  ← konu sırasının tek kaynağı
  fizik.json       { konu-id: {title, summary, cards[], quiz[]} }
  kimya.json
  biyoloji.json
  videolar.json    yayına hazır videolar ve bağlı oldukları konu/kart (docs/VIDEOLAR.md)
app/               sayfalar (adres = klasör)
  layout.tsx       yazı tipleri, alt menü
  globals.css      bütün stil: renk değişkenleri, bileşen sınıfları
  page.tsx                 /                ana sayfa
  kesfet/page.tsx          /kesfet/         arama ve ders süzgeci
  kaydedilenler/page.tsx   /kaydedilenler/  kaydedilen konular
  profil/page.tsx          /profil/         profil
  videolar/page.tsx        /videolar/       Videolar sekmesi: dikey video akışı
  [ders]/page.tsx          /<ders>/         konu yolu
  [ders]/[konu]/page.tsx   /<ders>/<konu>/  ders ekranı
components/        ekranların kendisi (Home, Road, Lesson, Explore, Saved, Profile, Tabs, VideoPlayer, VideoFeed, ui, icons)
lib/
  dersler.ts       türler ve ders listesi (tarayıcıya giden küçük kısım)
  content.ts       konu içeriğini okuyan yardımcılar (yalnızca derleme sırasında)
  videolar.ts      videoları karta bağlayan yardımcılar
  store.ts         localStorage üzerindeki ilerleme ve kaydedilenler
```

- **Konu listesi:** `content/dersler.json` içinde her konu `{"id": "...", "ad": "..."}` biçimindedir. `id` olmayan konular henüz yazılmamıştır ve sitede "Yakında" görünür.
- **Sayfalar statik üretilir.** Her hazır konu için `/<ders>/<konu>/` sayfası derleme sırasında oluşturulur; bir konunun kartları yalnızca kendi sayfasına gömülür. Keşfet ve ana sayfa yalnızca başlık ve özetleri taşır.
- **Ders ekranı (`components/Lesson.tsx`):** Kartları tek tek gösterir. Kartlar bitince 4 soruluk test başlar, test bitince sonuç kartı gelir. Kaydırma ve sağ/sol ok tuşları çalışır.
- **Videolar:** Bir kartın videosu varsa kartın altında "Video" düğmesi çıkar; video kartın üstünde açılır. Alt menüdeki Videolar sekmesi (`/videolar/`) dikey akıştır. Ders sayfası `?kart=N` ile açılırsa N. karttan başlar. mp4 dosyaları depoda değil, bir video deposunda durur. Ayrıntı: `docs/VIDEOLAR.md`.
- **Durum (`lib/store.ts`):** Tarayıcının `localStorage` alanında tutulur. Hesap olmadığı için cihaza özeldir.
  - `tf-prog`: konu bazında test sonucu (`"ders.konu": "3/4 doğru"`) ve son açılan konu (`_last`)
  - `tf-saved`: kaydedilen konular

  Anahtarlardaki `tf-` öneki eski "Temelden Fen" adından kalmıştır. Değiştirilirse kullanıcıların mevcut ilerlemesi kaybolur.
- **Tema:** Renkler `app/globals.css` içinde `:root` CSS değişkenleriyle tanımlıdır. `data-ders` özniteliği dersin vurgu rengini (`--acc`) belirler. Konu SVG'leri de yalnızca bu değişkenleri kullanır. Tailwind yüklüdür; yeni bileşenlerde yardımcı sınıflar kullanılabilir, ama renkler yine bu değişkenlerden gelir.
- **İçerik HTML'i:** Kart metinleri küçük HTML parçaları taşır (`<b>`, `<em>`, `<sub>`...). Bunlar `components/ui.tsx` içindeki `Html` bileşeniyle basılır. İçerik bizim yazdığımız ve doğrulayıcıdan geçen metindir; kullanıcıdan gelen metin bu yoldan basılmamalı.

### Komutlar
```bash
npm install          # ilk kez
npm run dev          # http://localhost:3000 (değişiklikler anında görünür)
npm run build        # out/ klasörüne statik site
npm run lint         # TypeScript tür denetimi
python3 tools/check.py
NODE_PATH=$(npm root -g) node tools/ekran.js ekran   # önce npm run build
```

## Video hattı
Ayrıntılar `video/README.md` dosyasındadır. Kısaca:
1. HTML/SVG sahnesi `render(t)` fonksiyonunu dışa açar.
2. Playwright sahneyi saniyede 30 kare olarak görüntüler.
3. ffmpeg kareleri ElevenLabs sesiyle birleştirip mp4 üretir.

## İleride gerekecek mimari (henüz yok)
- **Hesap, giriş ve ücretli üyelik:** Sunucu, veritabanı, kimlik doğrulama ve ödeme sağlayıcısı gerekecek. İlerleme `localStorage` yerine hesaba bağlanmalı.
- **Oyunlar ve etkileşimli anlatım:** Ayrıntı `docs/YOL-HARITASI.md` dosyasında. Kart modeline yeni bir kart türü eklenmesi önerilir; örneğin `type: "etkilesim"` ve bir bileşen adı. Bileşen `components/` altında bir React bileşeni olur, `Lesson.tsx` kart türüne göre onu çizer.
