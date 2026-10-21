# Mimari

## Şu anki durum
Site bir **Next.js** uygulamasıdır (App Router, React, TypeScript, Tailwind CSS). Derleme sonucu tamamen statiktir (`output: "export"`): `npm run build` komutu `out/` klasörüne düz HTML, CSS ve JS dosyaları üretir. Kendi sunucusu yoktur; isteğe bağlı kullanıcı hesabı ve bulut eşitleme **Supabase** üzerindedir (aşağıda "Hesap ve bulut eşitleme"). Site Vercel'de yayında (https://ucler.app; eski adres https://ucler-app.vercel.app da çalışır; Hobby planı, günde en çok 100 deploy). `vercel.json` yalnız `main` dalını yayınlar; derlemeyi atlama kuralı `tools/vercel-atla.sh` içindedir (diğer dallar önizleme deploy'u açmaz) ve bir push yalnız siteyi etkilemeyen yolları (`denetim/`, `docs/`, `video/`, `tools/`, `android/`, `ios/`, `assets/`, `.github/`, `capacitor.config.ts`, `AGENTS.md`, `README.md`, `supabase/`) değiştiriyorsa derlemeyi atlar (önceki deploy commit'i depoda yoksa, ör. dal yeniden yazıldıysa, derler). Siteye yeni bir klasör eklenirse bu listeye girmez, derlenir. Sitenin canlı adresi `lib/site.ts` içindeki `SITE_URL` sabitindedir; uygulamadaki paylaşım ve e-posta bağlantıları bu adresi kullanır.

**E-postalar:** Supabase edge fonksiyonları Resend ile gönderir ve pg_cron ile her gün çalışır. `seri-hatirlat` 19:00'da (Türkiye) serisi bitmek üzere olanlara yazar. `yenilik-bildir` 12:00'de `https://ucler.app/yenilikler.json` listesini (`app/yenilikler.json/route.ts`, derlemede üretilir) `public.duyurulan` tablosuyla karşılaştırır, yeni ders, konu ya da video varsa bildirimi açık hesaplara tek e-posta gönderir. Yeni içerik yayına girince ertesi 12:00'de duyurulur. Teslim alıcı bazında izlenir: `duyurulan.tamam` herkese ulaşınca `true` olur, e-postası Resend'e kabul edilen alıcı `duyuru_teslim` tablosuna yazılır; gönderilemeyenler ertesi çalışmada yeniden denenir ve aynı kişiye ikinci kez gitmez. Bir içeriği duyurmadan eklemek için kimliğini önceden `duyurulan` tablosuna yaz. Kapatma: Ayarlar'daki anahtarlar ve `/hatirlatma/` sayfası.

```
content/
  dersler.json     her dersin adı, yol başlığı ve sıralı konu listesi  ← konu sırasının tek kaynağı
  fizik.json       { konu-id: {title, summary, cards[], quiz[]} }
  kimya.json
  biyoloji.json
  videolar.json    yayına hazır videolar ve bağlı oldukları konu/kart (docs/VIDEOLAR.md)
app/               sayfalar (adres = klasör)
  layout.tsx       yazı tipleri, alt menü
  globals.css      renk değişkenleri, shadcn/ui jetonları (@theme), eski bileşen sınıfları (oyunlar, video, etkileşimli kartlar)
  page.tsx                 /                ana sayfa
  kesfet/page.tsx          /kesfet/         arama ve ders süzgeci
  kaydedilenler/page.tsx   /kaydedilenler/  eski adres; Profil > Kaydedilenler ekranını gösterir
  oyunlar/                 /oyunlar/        Oyunlar sekmesi ve oyunlar
  profil/page.tsx          /profil/         profil: ad, üç özet sayı, alt ekranlara satırlar
  profil/*/page.tsx        /profil/istatistikler/, /profil/kaydedilenler/, /profil/anlamadiklarim/, /profil/ayarlar/
  videolar/page.tsx        /videolar/       Videolar sekmesi: dikey video akışı
  tekrar/page.tsx          /tekrar/         akıllı tekrar: yanlış yapılan sorulardan bugün sırası gelenler
  [ders]/page.tsx          /<ders>/         konu haritası (ön koşul bağlantılarıyla) ve konu listesi
  [ders]/[konu]/page.tsx   /<ders>/<konu>/  ders ekranı
components/        ekranların kendisi (Home, Road, Lesson, Explore, Profile, Oyunlar, Tabs, VideoPlayer, VideoFeed, temel, icons); profil/ altında Profil'in alt ekranları
components/ui/     shadcn/ui parçaları (Button, Card, Input, Badge, Progress, Sheet); kod projenin içindedir, görünümü biz belirleriz
lib/
  dersler.ts       türler ve ders listesi (tarayıcıya giden küçük kısım)
  content.ts       konu içeriğini okuyan yardımcılar (yalnızca derleme sırasında)
  videolar.ts      videoları karta bağlayan yardımcılar
  store.ts         localStorage üzerindeki ilerleme, kaydedilenler, tekrar sırası, anlamadım işaretleri
  kilit.ts         sıralı konu kilidi ve ünite testleri (hangi konu açık, hangi ünite geçildi)
  bulut.ts         Supabase istemcisi, oturum ve bulut eşitleme
  esitle.ts        eşitlemenin birleştirme kuralları (üç yönlü birleştirme, sıfırlama damgası)
  olay.ts          toplu kullanım olayları (Umami; kimliği boşken hiçbir şey gönderilmez)
```

- **Konu listesi:** `content/dersler.json` içinde her konu `{"id": "...", "ad": "..."}` biçimindedir. `id` olmayan konular henüz yazılmamıştır ve sitede "Yakında" görünür.
- **Sayfalar statik üretilir.** Her hazır konu için `/<ders>/<konu>/` sayfası derleme sırasında oluşturulur; bir konunun kartları yalnızca kendi sayfasına gömülür. Keşfet ve ana sayfa yalnızca başlık ve özetleri taşır.
- **Ders ekranı (`components/Lesson.tsx`):** Kartları tek tek gösterir. Kartlar bitince 4 soruluk test başlar, test bitince sonuç kartı gelir. Kaydırma ve sağ/sol ok tuşları çalışır.
- **Videolar:** Bir kartın videosu varsa kartın altında "Video" düğmesi çıkar; video kartın üstünde açılır. Alt menüdeki Videolar sekmesi (`/videolar/`) dikey akıştır. Ders sayfası `?kart=N` ile açılırsa N. karttan başlar. mp4 dosyaları depoda değil, bir video deposunda durur. Ayrıntı: `docs/VIDEOLAR.md`.
- **Konu kilidi (`lib/kilit.ts`):** Konular sırayla açılır: ilk konu açıktır; bir konu, önceki konu bitince (testi çözülünce) açılır. Konular ünitelere ayrılır (`content/dersler.json` içinde ünitenin ilk konusundaki `"unite"`); ünite testinden (`/unite/<ders>/<no>/`, en çok 10 soru) en az 80 alan, o ünitenin bütün konularını ve sonraki ünitenin ilk konusunu açar. Başlanmış konu bir daha kilitlenmez. Kilitli konunun adresi kilit ekranını gösterir; kilitliyken `?kart=N`, ok tuşları ve ilerleme yazımı çalışmaz (yoksa konu kendi yan etkisiyle açılırdı).
- **Durum (`lib/store.ts`):** Tarayıcının `localStorage` alanında tutulur. Hesap yoksa cihaza özeldir; giriş yapılmışsa ayrıca buluta eşitlenir.
  - `tf-prog`: konu bazında test sonucu (`"ders.konu": "3/4 doğru"`) ve son açılan konu (`_last`)
  - `tf-saved`: kaydedilen konular
  - `tf-tekrar`: akıllı tekrar sırası (`"ders.konu.soru sırası": {s: basamak, g: "YYYY-AA-GG"}`). Testte yanlış yapılan soru 1, 3 ve 7 gün sonra yeniden sorulur; tekrarda yanlış yapılırsa başa döner, üç doğrudan sonra sıradan çıkar.
  - `tf-anlamadim`: "Bunu anlamadım" diye işaretlenen kartlar (`"ders.konu.kart no"`); Profil > Anlamadıklarım ekranında görünür. `lib/olay.ts` içindeki Umami kimliği doldurulursa her işaret toplu olay olarak da gönderilir (kişisel bilgi yok).
  - `tf-gorunum`: ders sayfasında harita mı liste mi seçildiği
  - `tf-asama`: konu bazında bitirilen aşama sayısı (`"ders.konu": 1`). Kartlar 2-4 aşamaya bölünür (`lib/asama.ts`); aşamalar sırayla açılır, test son aşamadan sonra gelir.
  - `tf-puan`: toplam puan, en uzun seri ve gün gün sayaçlar (`gunler["YYYY-AA-GG"] = {kart, adim, soru, dogru, asama, konu, tekrar, oyun, video, p, giris}`). Puan tablosu ve görev havuzu `lib/puan.ts` içinde. Seri: kart, görev, soru, tekrar, oyun ya da video yapılan kesintisiz günler.
  - `tf-gorev`: bugünün üç görevi ve hangilerinin bittiği. Görevler tarihe göre seçilir; tekrar sırasında soru varsa biri tekrar görevidir.
  - `tf-yer`: aşamanın ortasında kalınan yer (`"ders.konu": {a: aşama, i: öğe}`).
  - `tf-unite`: ünite testlerinin en iyi puanı (`"ders.no": 0-100`).
  - `tf-ipucu`: bir kez gösterilen ipuçları.
  - `tf-sifir`: son "İlerlemeyi sıfırla" zamanı (eşitlemede sıfırlamanın eski veriyle geri gelmemesi için).
  - `tf-bulut`: bu cihazın bu hesapla buluta en son eşitlediği veri (eşitlemenin temeli; yalnız giriş yapılmışken).
- **Hesap ve bulut eşitleme (`lib/bulut.ts`, `lib/esitle.ts`):** Hesap isteğe bağlıdır (Supabase Auth; `/giris/`, `/sifre/`, `/onay/`). Giriş yapmış öğrencinin verisi `public.ilerleme` tablosunda tek satırdadır (`veri` jsonb; satır düzeyi güvenlik: herkes yalnız kendi satırını okur ve yazar). Her eşitleme turu buluttakini okur, cihazdaki ve `tf-bulut` temeliyle **üç yönlü** birleştirir, sonucu buluta `veri._surum` koşuluyla yazar (başka cihaz araya yazdıysa yeniden okur) ve cihaza uygular. Temelden beri yalnız bir tarafta değişen değer o taraftan alınır; silme de değişikliktir, bu yüzden bir cihazda silinen kayıt ya da bitirilen tekrar eski cihazdan geri gelmez. İki taraf da değiştiyse ilerleme geri gitmez (en büyük değer). Yeni bir sıfırlama (`sifir` damgası) olan taraf bütünüyle kazanır. Temeli olmayan cihaz (bu hesapla ilk giriş) birleşim alır, hesap açmadan önceki ilerleme kaybolmaz. Okuma ya da yazma başarısız olursa hiçbir şey ezilmez; tur 5 sn'den 2 dk'ya kadar artan aralıklarla ve bağlantı dönünce yeniden denenir, Ayarlar durumu gösterir. Her tur başladığı hesaba ve oturum nesline bağlıdır; çıkış ya da hesap değişince eski turun sonucu atılır. Çıkışta son durum buluta yazılamazsa çıkış yapılmaz.

  Anahtarlardaki `tf-` öneki eski "Temelden Fen" adından kalmıştır. Değiştirilirse kullanıcıların mevcut ilerlemesi kaybolur.
- **Tema:** Renkler `app/globals.css` içinde `:root` CSS değişkenleriyle tanımlıdır. `data-ders` özniteliği dersin vurgu rengini (`--acc`) belirler. Konu SVG'leri de yalnızca bu değişkenleri kullanır. Arayüz **shadcn/ui** (Tailwind + Radix) ve **Motion** (animasyon) ile yazılır (Üçler, 2026-10-18). shadcn jetonları (`bg-primary`, `border-border`, `text-muted-foreground`, `bg-acc`...) `globals.css` içindeki `@theme inline` bloğunda bu değişkenlere bağlıdır, yani renkler yine buradan gelir. Eski sınıflar `@layer components` içindedir; Tailwind sınıfları onların üstüne yazar. Yeni parça gerekirse `npx shadcn add <ad>` ile `components/ui/` altına eklenir ve renkleri jetonlara uydurulur.
- **İçerik HTML'i:** Kart metinleri küçük HTML parçaları taşır (`<b>`, `<em>`, `<sub>`...). Bunlar `components/temel.tsx` içindeki `Html` bileşeniyle basılır. İçerik bizim yazdığımız ve doğrulayıcıdan geçen metindir; kullanıcıdan gelen metin bu yoldan basılmamalı.

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
