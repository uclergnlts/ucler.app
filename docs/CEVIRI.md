# Çeviri: uygulamanın İngilizcesi

Üçler'in kararı (2026-11-19): uygulama Türkçe ve İngilizce olur. İngilizce önce Fizik'te açılır, Kimya ve Biyoloji sonra gelir.
Türkçe tek kaynaktır; İngilizce her zaman Türkçeden üretilir.

## Nasıl çalışır

- Dil **derleme anında** bellidir (`lib/dil.ts`). `npm run build` iki kopya üretir: Türkçe kökte (`out/`), İngilizce `/en/` altında
  (`out/en/`, `NEXT_PUBLIC_DIL=en`, `next.config.ts` basePath). İki kopya aynı tarayıcı deposunu paylaşır; ilerleme, puan ve
  ayarlar dil değişince kaybolmaz.
- Dil seçimi `tf-dil` anahtarında durur. `app/layout.tsx` içindeki küçük betik, sayfa yanlış kopyada açıldıysa boyamadan önce
  doğru kopyaya geçirir. Adrese `?dil=en` ya da `?dil=tr` yazmak seçimi değiştirir.
- **Önizleme:** Ayarlar'daki "Dil" bölümü, çeviri bitene kadar yalnızca dili adresle bir kez seçmiş cihazda görünür
  (`https://ucler.app/ogren/?dil=en`). Fizik tamamlanınca `components/profil/Ayarlar.tsx` içindeki `DIL_HERKESE` açılır.
  İngilizce kopya o zamana kadar arama motorlarına kapalıdır (`app/layout.tsx`).
- public/ dosyaları (yazı tipi, ses, görsel) iki kopyada da kökten okunur; `tools/en-birlestir.js` İngilizce çıktıdaki kopyaları taşımaz.

## Arayüz ve sahne metinleri

Koddaki her görünen metin Türkçe yazılır ve `cev("…")` içine alınır. İngilizcesi `lib/ceviri/en.json` dosyasında Türkçe metin
anahtarıyla durur. Sözlükte olmayan metin Türkçe kalır.

- Değişken: `cev("{0}. ünite", no)`. Cümle parçalara bölünmez; kelime sırası dile göre değişir.
- Aynı kelime iki yerde farklı çevrilecekse bağlam eklenir: `cev("hız§bonus")`. "§" ve sonrası Türkçede görünmez.
- Sayılar: `toLocaleString(SAYI_YEREL, …)`, ondalık ayracı `ONDALIK`. Türkçede 2,5, İngilizcede 2.5.
- Yeni bileşen yazınca: `node tools/metin-sar.js --yaz <dosya>` metinleri sarar, `node tools/metin-kalan.js <dosya>` gözden
  kaçan küçük harfli kısa metinleri listeler (elle bakılır).
- `node tools/ceviri-ui.js say | eksik | ekle | denetle`: eksikleri listeler, çevirileri numarayla ekler, yer tutucuları denetler.

## Ders içeriği

Çeviriler konu başına `content/en/kaynak/<ders>/<konu>.json` dosyasındadır: "yol → İngilizce metin". Yol, metnin Türkçe
dosyadaki yeridir (`cards.0.p`, `quiz.2.o.1`, SVG içindeki n. yazı için `cards.3.svg#n`, adımlı ders için `A:adimlar.0.metin`).

```
python3 tools/ceviri.py cikar fizik <konu>          # çevrilecek metinler
python3 tools/ceviri.py al fizik <konu> <dosya>     # "yol<TAB>İngilizce" satırlarını al
python3 tools/ceviri.py birlestir --damgala         # content/en/*.json üret, Türkçe kaynağın özetini kaydet
python3 tools/ceviri.py denetle                     # eksik, bayat (Türkçesi değişmiş), biçimi bozuk çeviri
```

- `content/en/fizik.json`, `kimya.json`, `biyoloji.json`, `adimli.json` **üretilir**; elle düzenlenmez.
- Türkçe bir kart değişirse o yolun çevirisi "BAYAT" olur ve denetim hata verir: çeviriyi güncelle, sonra `birlestir --damgala`.
- Ders, ünite ve konu adları `content/en/dersler.json` içindedir.
- Çeviriden sonra `DIL=en METIN=1 node tools/ekran.js <klasör> fizik/<konu>` ile ekranlara bakılır: İngilizce metin çoğu
  zaman daha uzundur, SVG içinde taşma ancak gözle görülür.

## İngilizce yazım kuralları

Türkçe için `docs/DOGAL-TURKCE.md` neyse İngilizce için bu bölüm odur.

- Amerikan İngilizcesi yazımı: meter, liter, color, aluminum. (Dünyada en yaygın çevrimiçi kullanım; OpenStax ile aynı.)
- Okura "you" diye hitap edilir. Kısa, tam cümleler. Bir cümlede tek fikir.
- Kelime kelime çeviri yapılmaz; cümle İngilizce düşünülerek yeniden kurulur. Türkçedeki "olur", "-dır" kalıpları taşınmaz
  ("= 5 olur" → "= 5").
- Klişe ve dolgu yok: "plays a crucial role", "it is important to note", "not only … but also", "delve", "in order to".
- Uzun çizgi (—) ve noktalı virgülle cümle yapıştırma kullanılmaz.
- Ondalık nokta (2.5), binlik ayraç yok (2700), çarpma işareti × ya da ·, eksi işareti −.
- Şıklar kısa ve tarafsız kalır (Türkçedeki kuralın aynısı); gerekçe yalnızca açıklamada.
- Türkiye'ye özgü örnek kalmaz; para birimi gerekiyorsa $ kullanılır.
- Özel adlar yerleşik İngilizce yazımıyla: Ibn al-Haytham, Marie Curie, Pythagorean theorem, Lami's theorem.

## Terim sözlüğü (Fizik)

Bir terim her yerde aynı çevrilir. Yeni terim çıktıkça buraya eklenir.

| Türkçe | İngilizce | Not |
|---|---|---|
| sürat | speed | skaler |
| hız | velocity | vektör; "hız§bonus" gibi gündelik kullanım "speed" |
| yer değiştirme | displacement | |
| yol (alınan) | distance | |
| konum | position | |
| ivme | acceleration | |
| kütle / ağırlık | mass / weight | |
| özkütle | density | |
| kütle çekimi | gravity, gravitation | konu adı "Gravitation" |
| büyüklük (nicelik) | quantity | "temel büyüklük" = base quantity |
| büyüklük (vektörün) | magnitude | |
| temel / türetilmiş büyüklük | base / derived quantity | |
| birim | unit | |
| önek | prefix | |
| duyarlılık (ölçü aleti) | precision | en küçük bölme |
| skaler / vektörel | scalar / vector | |
| bileşke | resultant | |
| bileşen | component | |
| uç uca ekleme | head-to-tail method | kuyruk = tail, uç = head |
| paralelkenar yöntemi | parallelogram method | |
| denge | equilibrium | günlük anlamda "balance" |
| hipotez / teori / yasa | hypothesis / theory / law | |
| deney / gözlem | experiment / observation | |
| havasız ortam | vacuum | |
| hava direnci | air resistance | |
| kuvvet | force | |
| iş / enerji / güç | work / energy / power | |
| basınç | pressure | |
| kaldırma kuvveti | buoyant force | konu adı "Buoyancy" |
| ısı / sıcaklık | heat / temperature | |
| genleşme | (thermal) expansion | |
| tork | torque | |
| kütle merkezi | center of mass | |
| basit harmonik hareket | simple harmonic motion | |
| girişim / kırınım | interference / diffraction | |
| kırılma / yansıma | refraction / reflection | |
| akım / gerilim / direnç | current / voltage / resistance | |
| aşama (konu içi) | stage | arayüz |
| konu / ünite / ders | topic / unit / subject | arayüz |
| tekrar | review | arayüz |
| seri | streak | arayüz |
| seviye testi | placement test | arayüz |
| ağırlık (simge) | W | Türkçede G; W = m·g. SVG içindeki tek harfli G de W yapılır |
| normal kuvvet | normal force (N) | |
| sürtünme (statik / kinetik) | static / kinetic friction | |
| eylemsizlik | inertia | |
| etki-tepki | action and reaction | |
| ip gerilmesi | tension | |
| eğik düzlem | incline | |
| limit hız | terminal velocity | |
| serbest cisim diyagramı | free-body diagram | |
| bağıl hız | relative velocity | v<sub>rel</sub> |
| referans sistemi | reference frame | |
| akıntı / kayık hızı | current / boat (vc, vb) | Türkçede va, vk |
| sürüklenme | drift | |
| periyot / frekans | period / frequency | |
| çizgisel / açısal hız | linear / angular speed | |
| merkezcil ivme / kuvvet | centripetal acceleration / force | |
| merkezkaç | centrifugal | |
| eylemsizlik momenti | moment of inertia | |
| açısal momentum | angular momentum | |
| eğimli viraj | banked curve | viraj = curve |
| menzil | range | |
| eğik / yatay atış | launch at an angle / horizontal launch | atış hareketi = projectile motion |
| tepe noktası | top (of the path) | |
| uçuş süresi | time of flight | |
