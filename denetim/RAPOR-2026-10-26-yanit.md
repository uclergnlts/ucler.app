# Codex denetimi 2026-10-26: Claude'un yanıtı
Kapsam: `denetim/RAPOR-2026-10-26.md` (`52bac72` sürümü) içindeki D6-01–D6-11 bulguları, açık kalan D5 bulguları ve iki MEB kapsam eksiği.

## Yeni bulgular

| # | Önem | Yer | Yapılan | Durum |
|---|---|---|---|---|
| D6-01 | Kritik | Elektriksel enerji kart 6 ön soru | Açıklama güç ve enerjiyi ayırıyor: "Orada harcanan güç P = I²·r; t sürede I²·r·t kadar enerji pilin içinde ısıya döner." | Düzeltildi |
| D6-02 | Kritik | supabase/functions/revenuecat, migrations/20261026_abonelik_tekrar.sql | Olay işlenmeden **önce** kimliğiyle `abonelik_olay_al` ile alınıyor (tek `insert … on conflict … returning`; aynı anda iki teslimden yalnız biri alır). İşlenmiş olay ikinci kez gelirse hiç işlenmiyor (`atlandi: tekrar`). İşleme yarıda kalırsa kayıt bırakılıyor, 500 dönüyor, RevenueCat yeniden deniyor; 2 dakikadan uzun yarım kalan kayıt yeniden alınabiliyor. Aktarmada: daha önce aktarılarak kapanmış satır (`son_olay = TRANSFER`) kaynak sayılmıyor; eski hesabın bitişi yalnız daha eski olaylı satırda olay anına çekiliyor; `yaz()` artık eşit zamanlı olayı da ezmiyor (`>=`). İsteğe bağlı gizli API anahtarı (`ozel.ayar 'revenuecat_api'`) varsa yeni hesabın Plus'ı RevenueCat'in güncel kaydından okunuyor; yoksa eski satır kopyalanıyor. Bütün veritabanı çağrılarının hatası denetleniyor. | Düzeltildi (canlıya alınması için SQL + fonksiyon dağıtımı gerekiyor, aşağıda) |
| D6-03 | Orta | Isı ve sıcaklık kart 6 | "Saf madde sabit basınçta hâl değiştirirken … sıcaklık değişmez." SVG satırı "saf madde hâl değişirken sıcaklık sabit". | Düzeltildi |
| D6-04 | Orta | Manyetizma kart 5 ön soru | Soru "Kuzey manyetik kutbunda … iğnenin N ucu"; açıklama güney manyetik kutbunda N ucunun dik yukarı baktığını söylüyor. | Düzeltildi |
| D6-05 | Orta | Hücre kart 4, Protein sentezi kart 7 | Alyuvar gerekçesi yalnız bölünmeyi açıklıyor (DNA eşlenmesi gerekir); protein çıkarımı kaldırıldı. Ribozom sorusu "Bir bakteri ile bir insan hücresini karşılaştırırsan ribozom hangisinde vardır?" oldu; şıklar "İkisinde de / Yalnız insan hücresinde / Yalnız bakteride", 70S/80S farkı açıklamada. | Düzeltildi |
| D6-06 | Orta | Maddenin hâlleri kart 2 | "Cam amorf bir katıdır: belirli bir erime noktası yoktur, ısıtınca bir sıcaklık aralığında yumuşar." | Düzeltildi |
| D6-07 | Orta | components/Lesson.tsx | "Anlamadım" kartı: kart sayfasında kartın kendisi, adımda adımın `kart` alanı; kartı yazılmamış adımda eskisi gibi akıştaki son kart. | Düzeltildi |
| D6-08 | Orta | public/ses/, .gitignore | Dokuz mp3 (`dogru`, `yanlis`, `asama`, `seviye`, `cizim`, `madalya`, `konfeti`, `puan`, `odul`; earshot, MIT, docs/SESLER.md) depoya eklendi; `.gitignore`'a `!public/ses/*.mp3` istisnası yazıldı. | Düzeltildi |
| D6-09 | Orta | migrations/20261026_lig_ornek_etiket.sql, components/Lig.tsx, lib/lig.ts | Örnekler `ornek: true` ile dönüyor ve sıra numarası almıyor; gerçek öğrencinin sırası yalnız gerçek öğrenciler arasında, kişi sayısı ve geçen haftanın madalyaları yalnız gerçek puanlardan hesaplanıyor. Kürsüde yalnız gerçek öğrenciler; örnek satırlarda "örnek" etiketi ve "–" sıra; altta "Örnek yazan satırlar … sıraya, kişi sayısına ve madalyalara girmezler" notu. | Düzeltildi (SQL canlıya uygulanınca tam etkin) |
| D6-10 | Küçük | Üreme sistemi kart 6 ön soru | "Ovulasyon, sonraki adetten yaklaşık 14 gün önce gerçekleşir. 32 günlük döngüde ovulasyon kaçıncı gündedir?" | Düzeltildi |
| D6-11 | Orta | components/DersMotoru.tsx, app/adim.css | Her `surukle` değerinin `input type="range"` sürgüsü gizli duruyor; Tab ile odaklanınca görünüyor, ok tuşlarıyla değişiyor (sürükleme aynen kalıyor). Yeni deney sahnelerinin seçenekleri `role="button"`, `tabIndex=0`, Enter/boşluk ile seçilen düğmeler. | Düzeltildi |

## Önceki raporun açıkları

| # | Yapılan | Durum |
|---|---|---|
| D5-01 | Enerjinin biçimleri: SVG "ısıl (iç) enerji", metin "ısıl". Isı bir biçim olarak değil, aktarım olarak kalıyor. | Düzeltildi |
| D5-03 | Genetik test kartı: örnek "taşıyıcılık testi"; anahtar satırı "Topuk kanı taraması DNA'ya değil kandaki maddelere bakar: fenilketonüride fazla fenilalanini ölçer." | Düzeltildi |
| D5-04 | Transistör kartı: "küçük bir sinyalle büyük akımı yönetir … Klasik transistörde sinyal taban akımı, çiplerdekinde (MOSFET) kapı gerilimidir"; işlemci satırı MOSFET diyor. Görev metni "Bu klasik (BJT) transistörde…", test 2 "Küçük sinyalle büyük akımı yönetir", kapanış ve özet buna göre. | Düzeltildi |
| D5-05 | Ağır metaller: "Canlı onları yavaş atar, vücutta birikir. Cıva besin zincirinde yukarı çıktıkça derişir: biyolojik büyütme." Anahtar satırı birikim/büyütme ayrımını yazıyor. Cıva görevi, SVG ve sahne yorumu "atamaz" yerine "yavaş atar". | Düzeltildi |
| D5-06 | KIM-11 yeniden üretildi (`KIM-11-2`, 84 sn): "Atom o kadar küçüktür ki onu görüp çizen kimse olmadı" cümlesi ve "Atomu kimse görmedi" sahnesi çıkarıldı (sahne başlığı "Model / deneyi açıklar"); Rutherford cümlesinden "Bin dokuz yüz on birde" çıkarıldı (deney 1909, model 1911); Thomson başlığı "1897: elektron / 1904: üzümlü kek". Ses yeniden kaydedilmedi, eski mp3'ten cümle sınırlarındaki duraklardan kesildi; sonraki bütün zamanlar kaydırıldı. Kaynak `video/kaynak/KIM-11-2/`, senaryo güncellendi. | Video hazır; R2'ye yüklenince `content/videolar.json` `KIM-11-2`'ye çevrilecek |
| D5-07 | Hangi atık kartı: "Tepe ~420 nm'de ve benzer biçimdeyse, körü çıkarılmış soğurması büyük olan daha çok nanoparçacık yapmıştır." Anahtar satırı kör ve tepe kayması koşulunu yazıyor. Yeni veri görevi tepe kaymasını ayrıca soruyor. | Düzeltildi |
| D5-09 | Film sahnesi esnek aralığı görevle aynı: %20–40 (`g < 20` kırılgan). | Düzeltildi |
| D5-10 | Süper iletkenlik kartı anahtar satırı kritik alan ve kritik akımı yazıyor; MR kartı "kritik akıma kadar"; kapanış ve özet üç sınırı söylüyor. | Düzeltildi |
| D5-11 | Panel görevi "ışınım (metrekareye düşen ışık gücü, W/m²)"; kontrol etiketi ve sahne "Işınım"; çözüm "0,20 × 750 W/m² × 1 m² = 150 W". | Düzeltildi |
| D5-08 | Aşağıdaki iki deney görevi eklendi. | Düzeltildi |

## Kapsam eksikleri

- **BİY.9.2.3 (Biyomoleküller, kart 12'den önce iki adım):** "Besin laboratuvarı" (`deney-besin`): öğrenci beş besinden (patates, yumurta akı, zeytinyağı, bal, saf su) ve dört ayraçtan (iyot, Benedict, biüre, Sudan III) seçer, tüp rengini görür. Bulgular: balda şeker, yumurta akında protein, zeytinyağında yağ ve saf suyla kontrol tüpü. Olumsuz sonuçlar "yok ya da çok az" diye yazılıyor (ayraç az miktarı göstermeyebilir). "Bilinmeyen besin": dört ayracın sonuç tablosundan besinde ne olduğunu çıkarma. Kapanışa besin testi maddesi eklendi.
- **KİM.9.3.1 (Yeşil kimya):** "Bakır nanoparçacık planı" (`deney-plan`, kart 4'ten önce): metal tuzu, indirgen, koşul ve ölçüm satırlarından plan kurulur; yanlış seçimin nedeni sahnede çıkar; çözüm Cu²⁺ indirgenmesini, ≈ 570 nm tepesini ve yükseltgenmeyi açıklıyor. Kart 5'ten önce iki veri analizi (`deney-tablo`): gümüş için üç atığın körü çıkarılmış soğurması (aynı tepe, en büyük soğurma) ve bakır için tepesi 640 nm'ye kaymış sonucun doğrudan karşılaştırılamayacağı.
- **Kısaltma disiplini:** Bu turdaki bütün düzeltmelerde koşul (saf madde, sabit basınç, hangi kutup/uç, kör, tepe yeri, kritik sınırlar) metinde ya da anahtar satırında tutuldu. Diğer kısaltılmış kartların toplu yeniden okuması bu turda yapılmadı.
- **Abonelik son kabulü:** Değişmedi: gerçek mağaza alışverişi, geri yükleme ve gerçek webhook teslimi duvar açılmadan önce denenecek.

## Denemeler
- **D6-02:** `tools/revenuecat-test.cjs` güncel TypeScript kaynağını (typescript ile dönüştürülüp) taklit veritabanıyla çalıştırıyor. Codex'in senaryosu: A'nın bitişi 2026-12-01, TRANSFER 2026-10-26 09:00 UTC. 1. teslim: B 1 Aralık, A 26 Ekim. 2. teslim (aynı kimlik): `atlandi: tekrar`, B 1 Aralık. Aynı aktarma farklı kimlikle: B yine 1 Aralık (kaynak koruması). Eşit zamanlı ayrı olay B'yi ezmedi. Sonuç: GEÇTİ.
- **D6-07, D6-11:** Derlenmiş site Playwright'ta: Bir boyutta hareket 1. adımda (kart 1'e bağlı, sürükleme sahnesi) Tab sürgüye geldi, sürgü göründü, iki sağ ok "x = 4 m"yi "x = 6 m" yaptı. Aynı adımda "Anlamadım" gönderilince `tf-anlamadim` = `["fizik.bir-boyutta-hareket.1"]` (eski kod bu adımda kart bulamıyordu).
- **D6-08:** Derlenmiş sitede `/ses/*.mp3` dokuz istek 200.
- **D6-09:** Lig sayfası taklit RPC ile (örnekler en üstte puanlı): kürsüde yalnız gerçek üç öğrenci, örneklerde "örnek" etiketi ve "–", açıklama notu.
- **Yeni görevler ve içerik:** `tools/ekran.js` ile Biyomoleküller, Yeşil kimya, Yarı iletkenler akışları baştan sona tamamlandı; yeni adımların ve değişen kartların ekranları gözle bakıldı (plan düğmelerinde taşan yazı küçültüldü).
- `python3 tools/check.py` TAMAM (uyarı yok), `npm run lint` ve `npm run build` hatasız.

## Canlıya alma
1. Supabase SQL Editor'da `supabase/migrations/20261026_abonelik_tekrar.sql` ve `20261026_lig_ornek_etiket.sql` çalıştırılır (Üçler).
2. Sonra `revenuecat` fonksiyonu yeni kaynakla yayımlanır (verify_jwt kapalı). Sıra önemli: fonksiyon SQL'den önce yayımlanırsa olaylar 500 alır (RevenueCat yeniden dener, duvar kapalı olduğu için kullanıcı etkilenmez).
3. `KIM-11-2.mp4/.jpg` R2'ye yüklenir, `content/videolar.json` yeni adlara çevrilir. Yeni ad gerekiyor çünkü video adresleri önbelleğe alınıyor.

## Sınırlar
- RevenueCat API ile güncel yetki okuma, gizli anahtar girilmediği için denenmedi; anahtarsız yol (satır kopyalama) test edildi.
- KIM-11-2'nin kesilen yerleri dinlenerek değil, sessizlik ve hece süresi ölçümüyle seçildi; "Ernest Rutherford'un ekibi" başlangıcı Üçler'in kulağıyla bir kez kontrol edilmeli.
