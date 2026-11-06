# Doğal Türkçe denetimi (2026-11-06)

Bu rapor `npm run dogal-turkce` ile üretilir, elle düzenleme. Kurallar ve gerekçeleri: `docs/DOGAL-TURKCE.md`.

Taranan metin parçası: İçerik 9094, Adımlı ders 4200, Video ve yenilik 99, Video seslendirme 231, Arayüz 1437, E-posta 48.

**5 kesin**, **378 göz at** bulgu, 313 üslup notu (yalnızca sayılır, örnekleri en altta).

## Kurala göre

| Düzey | Kural | Sayı |
|---|---|---|
| KESİN | Sayı aralığında orta çizgi (–) | 5 |
| GÖZ AT | Noktalı virgülle bağlanmış iki cümle | 361 |
| GÖZ AT | Ara söz için orta çizgi ( – ) | 7 |
| GÖZ AT | Geçiş dolgusu: bununla birlikte / öte yandan | 2 |
| GÖZ AT | Şişirme: ...nın kanıtıdır | 1 |
| GÖZ AT | Başlıkta her kelime büyük harfle (Title Case) | 1 |
| GÖZ AT | Saatte iki nokta (12:00) | 1 |
| GÖZ AT | Kof yardımcı fiil | 1 |
| GÖZ AT | Gereksiz 'bir' (a/an çevirisi) | 1 |
| GÖZ AT | -mAktAdIr eki | 1 |
| GÖZ AT | Kapanış etiketi: sonuç olarak | 1 |
| GÖZ AT | Yüzde işaretinden sonra boşluk | 1 |
| ÜSLUP | Bağlaçtan önce virgül (ama / fakat) | 313 |

## Kesin


### Adımlı ders

- `content/adimli/endokrin.json` adimlar[3].metin: **Sayı aralığında orta çizgi (–)** «–». Aralıkta kısa çizgi: 2024-2026, 38-39 °C.  
  > Kan şekeri normalde yaklaşık 70–110 mg/dL arasında tutulur. Kan şekerini değiştir ve pankreasın yanıtını izle.
- `content/adimli/karisimlar.json` adimlar[0].metin: **Sayı aralığında orta çizgi (–)** «–». Aralıkta kısa çizgi: 2024-2026, 38-39 °C.  
  > Çözeltide dağılan tanecikler çok küçüktür. Koloitte daha büyüktür (yaklaşık 1–1000 nm) ama yine de dibe çökmez. İki bardağa yandan ışık tutacağız.

### İçerik

- `content/kimya.json` atomun-yapisi › cards[1].p: **Sayı aralığında orta çizgi (–)** «–». Aralıkta kısa çizgi: 2024-2026, 38-39 °C.  
  > Proton ve nötronların bulunduğu çekirdek, atomdan 10.000–100.000 kat küçüktür ama kütlenin %99,9'undan fazlası oradadır.
- `content/kimya.json` enerji-kaynaklari › cards[11].p: **Sayı aralığında orta çizgi (–)** «–». Aralıkta kısa çizgi: 2024-2026, 38-39 °C.  
  > 1 nm, 10−9 m'dir. 1–100 nm boyutunda yüzey/hacim oranı büyür ve atomların çoğu yüzeyde bulunur. Bu yüzden madde daha etkin tepkimeye girer ve iyi bir katalizör olur.
- `content/kimya.json` karisimlar › cards[4].key: **Sayı aralığında orta çizgi (–)** «–». Aralıkta kısa çizgi: 2024-2026, 38-39 °C.  
  > Koloit taneciklerinin boyutu yaklaşık 1–1000 nm'dir. Sis ve duman koloit aerosollerdir. Sisli havada far ışığının demet gibi görünmesi de Tyndall etkisidir.

## Göz at


### Adımlı ders

- `content/adimli/bitki-biyolojisi.json` adimlar[6].metin: **Noktalı virgülle bağlanmış iki cümle** «Pencere kenarındaki fide ışığa doğru eğilir; buna fototropizma denir». İki ayrı cümle yaz.  
  > Pencere kenarındaki fide ışığa doğru eğilir; buna fototropizma denir. Bu eğilmeyi oksin hormonu yönetir. Oynatmadan önce tahmin et.
- `content/adimli/bitki-biyolojisi.json` adimlar[7].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « Su alan tohumda enzimler çalışır ve depo besin solunumla harcanır; solunum için de oksije». İki ayrı cümle yaz.  
  > Su, oksijen ve uygun sıcaklık yeterli oldu. Su alan tohumda enzimler çalışır ve depo besin solunumla harcanır; solunum için de oksijen gerekir. Çoğu tohum ışığa ihtiyaç duymaz, ama bazıları duyar. Yaprak açıp fotosenteze…
- `content/adimli/bitkiler-alemi.json` adimlar[3].metin: **Noktalı virgülle bağlanmış iki cümle** «İki dölden biri büyük ve uzun ömürlüdür; buna baskın döl denir». İki ayrı cümle yaz.  
  > İki dölden biri büyük ve uzun ömürlüdür; buna baskın döl denir. Grubu değiştir ve gametofit ile sporofitin boyunu karşılaştır.
- `content/adimli/biyomolekuller.json` adimlar[3].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** «11 g yağ yaklaşık 99 kcal verir; karbonhidratta aynı enerji için 25 g gerekir». İki ayrı cümle yaz.  
  > 11 g yağ yaklaşık 99 kcal verir; karbonhidratta aynı enerji için 25 g gerekir. Yağ aynı enerjiyi yarıdan az kütleyle taşır. Bu yüzden uzun süreli depo yağdır.
- `content/adimli/biyomolekuller.json` adimlar[5].gorev.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «Urasil de timin gibi adeninle eşleşir; timinden yalnızca bir metil grubu eksiktir». İki ayrı cümle yaz.  
  > Urasil de timin gibi adeninle eşleşir; timinden yalnızca bir metil grubu eksiktir.
- `content/adimli/biyomolekuller.json` adimlar[5].metin: **Noktalı virgülle bağlanmış iki cümle** « Ekranda DNA'nın bazları var; RNA'ya geç ve bazları karşılaştır». İki ayrı cümle yaz.  
  > Kalıtsal bilgiyi iki molekül taşır: DNA ve RNA. Ekranda DNA'nın bazları var; RNA'ya geç ve bazları karşılaştır.
- `content/adimli/biyomolekuller.json` kapanis[2]: **Noktalı virgülle bağlanmış iki cümle** «Yağ gramda yaklaşık 9 kcal, karbonhidrat yaklaşık 4 kcal verir; yağ uzun süreli depodur». İki ayrı cümle yaz.  
  > Yağ gramda yaklaşık 9 kcal, karbonhidrat yaklaşık 4 kcal verir; yağ uzun süreli depodur.
- `content/adimli/canlilarin-ozellikleri.json` adimlar[1].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «ATP'nin yalnızca son fosfatı ayrılır; adenin ve riboz yerinde kalır». İki ayrı cümle yaz.  
  > ATP'nin yalnızca son fosfatı ayrılır; adenin ve riboz yerinde kalır.
- `content/adimli/canlilarin-ozellikleri.json` adimlar[2].gorev.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «Küçük moleküllerden büyük bir molekül kurulur ve ATP harcanır; bu bir anabolizmadır». İki ayrı cümle yaz.  
  > Küçük moleküllerden büyük bir molekül kurulur ve ATP harcanır; bu bir anabolizmadır. Glikozdan nişasta yapmak da anabolizmadır.
- `content/adimli/canlilarin-ozellikleri.json` adimlar[2].metin: **Noktalı virgülle bağlanmış iki cümle** «Hücre küçük moleküllerden büyüklerini kurar; buna anabolizma (yapım) denir». İki ayrı cümle yaz.  
  > Hücre küçük moleküllerden büyüklerini kurar; buna anabolizma (yapım) denir. Glikozları birleştir ve ne değiştiğine bak.
- `content/adimli/destek-hareket.json` adimlar[0].gorev.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** «Plaktaki kıkırdak çoğalır ve kemikleşir; böylece kemik iki ucundan uzar». İki ayrı cümle yaz.  
  > Plaktaki kıkırdak çoğalır ve kemikleşir; böylece kemik iki ucundan uzar. Ergenlik bitince plak kemikleşir ve boy uzaması durur.
- `content/adimli/destek-hareket.json` adimlar[3].gorev.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «Sarkomer kısalır ve Z çizgileri birbirine yaklaşır; boy 2,4 µm'den 2,0 µm'ye iner». İki ayrı cümle yaz.  
  > Sarkomer kısalır ve Z çizgileri birbirine yaklaşır; boy 2,4 µm'den 2,0 µm'ye iner.
- `content/adimli/destek-hareket.json` adimlar[3].gorev.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** « İplikler kısalmaz, birbirinin üzerinde kayar; I bandı ve H bölgesi ise daralır». İki ayrı cümle yaz.  
  > A bandı miyozinin boyu kadardır ve miyozin kısalmaz. İplikler kısalmaz, birbirinin üzerinde kayar; I bandı ve H bölgesi ise daralır.
- `content/adimli/destek-hareket.json` adimlar[4].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « Ölümden sonra ATP bitince başlar ayrılamaz; buna ölüm sertliği denir». İki ayrı cümle yaz.  
  > Kas kasıldı. Gevşemek için de ATP gerekir, çünkü miyozin başı ancak ATP bağlayınca aktinden ayrılır. Ca²⁺ da ATP harcanarak sarkoplazmik retikuluma geri pompalanır. Ölümden sonra ATP bitince başlar ayrılamaz; buna ölüm s…
- `content/adimli/destek-hareket.json` adimlar[6].gorev.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «İskelet kası çizgilidir, ama istemlidir; onu sen kasarsın». İki ayrı cümle yaz.  
  > İskelet kası çizgilidir, ama istemlidir; onu sen kasarsın.
- `content/adimli/dna-genetik-kod.json` adimlar[3].gorev.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** «İki eski iplik iki ayrı moleküle gider; böylece 2 karma ve 2 hafif DNA oluşur». İki ayrı cümle yaz.  
  > İki eski iplik iki ayrı moleküle gider; böylece 2 karma ve 2 hafif DNA oluşur. İlk eşlenmede ise moleküllerin hepsi karmadır. Her yeni molekülde bir eski ve bir yeni iplik bulunur; buna yarı korunumlu eşlenme denir.
- `content/adimli/dna-genetik-kod.json` adimlar[3].gorev.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** « Her yeni molekülde bir eski ve bir yeni iplik bulunur; buna yarı korunumlu eşlenme denir». İki ayrı cümle yaz.  
  > İki eski iplik iki ayrı moleküle gider; böylece 2 karma ve 2 hafif DNA oluşur. İlk eşlenmede ise moleküllerin hepsi karmadır. Her yeni molekülde bir eski ve bir yeni iplik bulunur; buna yarı korunumlu eşlenme denir.
- `content/adimli/dna-genetik-kod.json` kapanis[4]: **Noktalı virgülle bağlanmış iki cümle** «PCR'da her döngü kopya sayısını ikiye katlar; n döngüde 2ⁿ kopya oluşur». İki ayrı cümle yaz.  
  > PCR'da her döngü kopya sayısını ikiye katlar; n döngüde 2ⁿ kopya oluşur.
- `content/adimli/ekosistem.json` adimlar[5].gorev.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** « Onları ayrıştıran bakteriler çoğalır ve solunumla suyun oksijenini tüketir; balıklar ölür». İki ayrı cümle yaz.  
  > Gübre algleri aşırı çoğaltır ve algler ölüp dibe çöker. Onları ayrıştıran bakteriler çoğalır ve solunumla suyun oksijenini tüketir; balıklar ölür. Buna ötrofikasyon denir.
- `content/adimli/ekosistem.json` kapanis[3]: **Noktalı virgülle bağlanmış iki cümle** « Fotosentez CO₂'yi bağlar; solunum, ayrışma ve yanma geri verir». İki ayrı cümle yaz.  
  > Madde döngü hâlinde dolaşır. Fotosentez CO₂'yi bağlar; solunum, ayrışma ve yanma geri verir. Azotu ise bakteriler bağlar, dönüştürür ve havaya geri verir.
- `content/adimli/ekosistem.json` kapanis[4]: **Noktalı virgülle bağlanmış iki cümle** « Ölü algleri ayrıştıran bakteriler oksijeni tüketir; buna ötrofikasyon denir». İki ayrı cümle yaz.  
  > Gübre göle karışınca algler çoğalır. Ölü algleri ayrıştıran bakteriler oksijeni tüketir; buna ötrofikasyon denir.
- `content/adimli/endokrin.json` kapanis[3]: **Noktalı virgülle bağlanmış iki cümle** «Tiroksin, TRH ve TSH'yi frenler; buna negatif geri bildirim denir». İki ayrı cümle yaz.  
  > Tiroksin, TRH ve TSH'yi frenler; buna negatif geri bildirim denir.
- `content/adimli/enzimler.json` adimlar[3].gorev.bulgular[1].tamam: **Noktalı virgülle bağlanmış iki cümle** «Soğukta enzim yavaşladı ama bozulmadı; ısınınca eski hızına döndü». İki ayrı cümle yaz.  
  > Soğukta enzim yavaşladı ama bozulmadı; ısınınca eski hızına döndü. Soğuk enzimi bozmaz, yalnızca yavaşlatır.
- `content/adimli/enzimler.json` adimlar[3].gorev.bulgular[2].tamam: **Noktalı virgülle bağlanmış iki cümle** «Sıcaklık 55 °C'yi geçince enzimin üç boyutlu şekli bozuldu; buna denatürasyon denir». İki ayrı cümle yaz.  
  > Sıcaklık 55 °C'yi geçince enzimin üç boyutlu şekli bozuldu; buna denatürasyon denir. Soğutsan da aktif bölge geri gelmedi. Pişen yumurta akı da aynı şekilde çiğ hâline dönmez.
- `content/adimli/enzimler.json` adimlar[4].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « pH 8'de ise neredeyse durur; orada tripsin çalışır». İki ayrı cümle yaz.  
  > Pepsin midenin asidinde (pH ≈ 2) en hızlı çalışır. pH 8'de ise neredeyse durur; orada tripsin çalışır.
- `content/adimli/enzimler.json` kapanis[4]: **Noktalı virgülle bağlanmış iki cümle** «Aktif bölgeler dolunca hız sabitlenir; buna doygunluk denir». İki ayrı cümle yaz.  
  > Aktif bölgeler dolunca hız sabitlenir; buna doygunluk denir. Yarışmalı inhibitörün etkisi ise substrat artınca azalır.
- `content/adimli/fotosentez.json` adimlar[0].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «Işığa bağımlı evrede su parçalanır ve O₂ açığa çıkar; buna fotoliz denir». İki ayrı cümle yaz.  
  > Işığa bağımlı evrede su parçalanır ve O₂ açığa çıkar; buna fotoliz denir. Bu yüzden işaretli su verilince işaretli O₂ açığa çıkar.
- `content/adimli/fotosentez.json` adimlar[4].metin: **Noktalı virgülle bağlanmış iki cümle** « Işığı, CO₂'yi ve sıcaklığı değiştir; kabarcıklar ve grafik anında değişir». İki ayrı cümle yaz.  
  > Su bitkisi, fotosentez yaptıkça O₂ kabarcıkları çıkarır. Işığı, CO₂'yi ve sıcaklığı değiştir; kabarcıklar ve grafik anında değişir. Aşağıdakileri kendin bul.
- `content/adimli/fotosentez.json` kapanis[3]: **Noktalı virgülle bağlanmış iki cümle** «Fotosentezin hızını en kıt faktör sınırlar; bu faktör ışık, CO₂ ya da sıcaklık olabilir». İki ayrı cümle yaz.  
  > Fotosentezin hızını en kıt faktör sınırlar; bu faktör ışık, CO₂ ya da sıcaklık olabilir.
- `content/adimli/hucresel-solunum.json` adimlar[1].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** « Glikolizde CO₂ de çıkmaz; ilk CO₂ pirüvat oksidasyonunda açığa çıkar». İki ayrı cümle yaz.  
  > ATP, CO₂ ile atılmaz. Glikolizde CO₂ de çıkmaz; ilk CO₂ pirüvat oksidasyonunda açığa çıkar.
- `content/adimli/kaldirma-kuvveti.json` adimlar[5].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** « Su alınca G &gt; Fk olur ve denizaltı dalar». İki ayrı cümle yaz.  
  > Denizaltı hacmini değil, ağırlığını değiştirir. Su alınca G &gt; Fk olur ve denizaltı dalar. Su basınçlı havayla atılınca G &lt; Fk olur ve denizaltı yükselir. G = Fk olursa askıda kalır.
- `content/adimli/kaldirma-kuvveti.json` adimlar[5].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** « Su basınçlı havayla atılınca G &lt; Fk olur ve denizaltı yükselir». İki ayrı cümle yaz.  
  > Denizaltı hacmini değil, ağırlığını değiştirir. Su alınca G &gt; Fk olur ve denizaltı dalar. Su basınçlı havayla atılınca G &lt; Fk olur ve denizaltı yükselir. G = Fk olursa askıda kalır.
- `content/adimli/kalitim.json` adimlar[2].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** « Demek ki mor bitki gametlerinin yarısına a aleli veriyor; yani Aa'dır». İki ayrı cümle yaz.  
  > 52 mor ve 48 beyaz yavru yaklaşık 1:1 oranıdır. Demek ki mor bitki gametlerinin yarısına a aleli veriyor; yani Aa'dır.
- `content/adimli/kalitim.json` adimlar[4].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** « IAIB çocukta iki alel birden etkisini gösterir; buna eş baskınlık denir». İki ayrı cümle yaz.  
  > Dört kan grubunun hepsi ¼ olasılıkla mümkündür. IAIB çocukta iki alel birden etkisini gösterir; buna eş baskınlık denir. Alyuvarlarında hem A hem B antijeni bulunur.
- `content/adimli/kalitim.json` kapanis[0]: **Noktalı virgülle bağlanmış iki cümle** « Gamete bunlardan yalnızca biri gider; buna ayrılma yasası denir». İki ayrı cümle yaz.  
  > Her özellik için biri anneden, biri babadan gelen iki alel vardır. Gamete bunlardan yalnızca biri gider; buna ayrılma yasası denir.
- `content/adimli/kimya-bilimi.json` adimlar[1].gorev.tamam: **Gereksiz 'bir' (a/an çevirisi)** «büyük bir fark». 'büyük etki', 'ciddi artış'.  
  > CO₂'nin adı karbon dioksittir. Tek bir oksijen farkı büyük bir fark yaratır. CO kandaki hemoglobine yapışır ve oksijen taşınmasını engeller. CO₂ ise soluduğun havada zaten bulunur.
- `content/adimli/madde-gecisi.json` adimlar[5].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** «Dış ortam artık hücrenin içinden daha tuzlu; buna hipertonik ortam denir». İki ayrı cümle yaz.  
  > Dış ortam artık hücrenin içinden daha tuzlu; buna hipertonik ortam denir. Su hücreden dışarı çıkar ve alyuvar büzüşür.
- `content/adimli/manyetizma.json` adimlar[3].metin: **-mAktAdIr eki** «durmaktadır». Ders anlatımında geniş zaman ya da şimdiki zaman: 'hızlanır', 'hızlanıyor'.  
  > Bu, Oersted'in deneyidir ve tel ekrana dik durmaktadır. Sağ el kuralında başparmak akım yönünü, kıvrılan parmaklar alan yönünü gösterir. Akımı aç, yönünü çevir ve pusulalara bak.
- `content/adimli/mayoz.json` adimlar[5].metin: **Noktalı virgülle bağlanmış iki cümle** «Bazen homolog kromozomlar ya da kardeş kromatitler ayrılmaz; buna ayrılmama denir». İki ayrı cümle yaz.  
  > Bazen homolog kromozomlar ya da kardeş kromatitler ayrılmaz; buna ayrılmama denir. Bu insan hücresinde mayoz I'de bir homolog çift ayrılmıyor, mayoz II ise normal geçiyor. Önce tahmin et, sonra oynat.
- `content/adimli/protein-sentezi.json` adimlar[0].metin: **Noktalı virgülle bağlanmış iki cümle** «Bilgi önce DNA'dan RNA'ya kopyalanır; buna transkripsiyon denir». İki ayrı cümle yaz.  
  > Bilgi önce DNA'dan RNA'ya kopyalanır; buna transkripsiyon denir. RNA polimeraz yalnızca kalıp ipliği okur ve tamamlayıcı RNA nükleotitlerini ekler.
- `content/adimli/protein-sentezi.json` adimlar[3].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** «150 amino asit ve bir dur kodonu 151 kodon eder; 3 · 151 = 453 nükleotit olur». İki ayrı cümle yaz.  
  > 150 amino asit ve bir dur kodonu 151 kodon eder; 3 · 151 = 453 nükleotit olur. Zincirde 150 − 1 = 149 peptit bağı vardır ve her bağda bir su açığa çıkmıştır.
- `content/adimli/protein-sentezi.json` adimlar[4].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « Bu tek değişiklik hemoglobinin şeklini bozar ve alyuvarlar orak biçimini alır; buna orak ». İki ayrı cümle yaz.  
  > GAG kodonu GUG'ye dönüştü ve glutamik asidin yerine valin (Val) geldi. Bu tek değişiklik hemoglobinin şeklini bozar ve alyuvarlar orak biçimini alır; buna orak hücre anemisi denir. Bu bir yanlış anlamlı nokta mutasyonudu…
- `content/adimli/protein-sentezi.json` adimlar[5].gorev.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «Genetik kod dejeneredir; bir amino asidi birden fazla kodon şifreleyebilir». İki ayrı cümle yaz.  
  > Genetik kod dejeneredir; bir amino asidi birden fazla kodon şifreleyebilir. GAG ve GAA ikisi de Glu'yu şifreler, bu yüzden protein aynı kalır. Buna sessiz mutasyon denir.
- `content/adimli/sinir-sistemi.json` adimlar[1].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « Na⁺ kanalları açıldı, Na⁺ iyonları içeri girdi ve zar +30 mV'a çıktı; buna depolarizasyon». İki ayrı cümle yaz.  
  > Eşik aşıldı. Na⁺ kanalları açıldı, Na⁺ iyonları içeri girdi ve zar +30 mV'a çıktı; buna depolarizasyon denir. Sonra K⁺ iyonları dışarı çıktı ve zar eski hâline döndü; buna da repolarizasyon denir. Bu akışlar ATP harcamaz…
- `content/adimli/sinir-sistemi.json` adimlar[1].gorev.tamam: **Noktalı virgülle bağlanmış iki cümle** « Sonra K⁺ iyonları dışarı çıktı ve zar eski hâline döndü; buna da repolarizasyon denir». İki ayrı cümle yaz.  
  > Eşik aşıldı. Na⁺ kanalları açıldı, Na⁺ iyonları içeri girdi ve zar +30 mV'a çıktı; buna depolarizasyon denir. Sonra K⁺ iyonları dışarı çıktı ve zar eski hâline döndü; buna da repolarizasyon denir. Bu akışlar ATP harcamaz…
- `content/adimli/sinir-sistemi.json` adimlar[4].metin: **Noktalı virgülle bağlanmış iki cümle** «Nöronlar birbirine dokunmaz; aralarında sinaps adı verilen bir boşluk vardır». İki ayrı cümle yaz.  
  > Nöronlar birbirine dokunmaz; aralarında sinaps adı verilen bir boşluk vardır. Akson ucuna impuls gelince ne olduğunu izle.

### Arayüz

- `app/gizlilik/page.tsx` satır 15: **Noktalı virgülle bağlanmış iki cümle** « Google ya da Apple ile girersen şifre almayız; bu hizmetler bize yalnızca e-posta adresin». İki ayrı cümle yaz.  
  > ucler&apos;i hesap açmadan da kullanabilirsin. Hesap açarsan yalnızca e-posta adresini, şifreni ve istersen adını alırız. Google ya da Apple ile girersen şifre almayız; bu hizmetler bize yalnızca e-posta adresini ve adın…
- `app/hakkinda/page.tsx` satır 24: **Noktalı virgülle bağlanmış iki cümle** « Ana sayfada &quot;Tekrar zamanı&quot». İki ayrı cümle yaz.  
  > Yanlış yaptığın sorular tekrar sırana girer ve birkaç gün arayla yeniden sorulur. Ana sayfada &quot;Tekrar zamanı&quot; olarak görünür.
- `app/hakkinda/page.tsx` satır 25: **Noktalı virgülle bağlanmış iki cümle** « simgesiyle işaretle; Profil&apos». İki ayrı cümle yaz.  
  > Anlamadığın kartı sağ üstteki ? simgesiyle işaretle; Profil&apos;deki Anlamadıklarım ekranında listelenir.
- `app/hesap-silme/page.tsx` satır 22: **Noktalı virgülle bağlanmış iki cümle** «Hesabımı sil&quot;e dokun ve onayla». İki ayrı cümle yaz.  
  > Profil &gt; Ayarlar&apos;da &quot;Hesabımı sil&quot;e dokun ve onayla.
- `app/kosullar/page.tsx` satır 15: **Noktalı virgülle bağlanmış iki cümle** « Kendi çalışman için kullanabilirsin; izin almadan kopyalayıp yayımlayamaz ya da satamazsı». İki ayrı cümle yaz.  
  > İçerik (metinler, görseller, videolar) ucler&apos;indir. Kendi çalışman için kullanabilirsin; izin almadan kopyalayıp yayımlayamaz ya da satamazsın.
- `app/kosullar/page.tsx` satır 26: **Noktalı virgülle bağlanmış iki cümle** «İade istekleri Apple ya da Google&apos;ın kendi kurallarına göre, onların üzerinden yapılı». İki ayrı cümle yaz.  
  > İade istekleri Apple ya da Google&apos;ın kendi kurallarına göre, onların üzerinden yapılır. Hesabını silmek aboneliği iptal etmez.
- `app/kosullar/page.tsx` satır 27: **Noktalı virgülle bağlanmış iki cümle** «Fiyat değişirse mağaza seni önceden bilgilendirir; yeni fiyat ancak senin onayınla ya da m». İki ayrı cümle yaz.  
  > Fiyat değişirse mağaza seni önceden bilgilendirir; yeni fiyat ancak senin onayınla ya da mağazanın kurallarına göre uygulanır.
- `components/Giris.tsx` satır 66: **Noktalı virgülle bağlanmış iki cümle** «Hesabın olunca ilerlemen, puanın ve serin kaybolmaz; telefonunu değiştirsen de kaldığın ye». İki ayrı cümle yaz.  
  > Hesabın olunca ilerlemen, puanın ve serin kaybolmaz; telefonunu değiştirsen de kaldığın yerden devam edersin.
- `components/GunSorusu.tsx` satır 284: **Noktalı virgülle bağlanmış iki cümle** «Ücretsiz hesap aç; yarından itibaren günün sorusu puanların haftalık lige eklensin». İki ayrı cümle yaz.  
  > Ücretsiz hesap aç; yarından itibaren günün sorusu puanların haftalık lige eklensin.
- `components/KayitDavet.tsx` satır 30: **Noktalı virgülle bağlanmış iki cümle** «Ücretsiz hesap aç; bitirdiğin aşamalar, puanın ve serin her cihazda seninle olsun». İki ayrı cümle yaz.  
  > Ücretsiz hesap aç; bitirdiğin aşamalar, puanın ve serin her cihazda seninle olsun.
- `components/KayitDavet.tsx` satır 55: **Noktalı virgülle bağlanmış iki cümle** «Ücretsiz hesap aç; bu konu Kaydedilenler». İki ayrı cümle yaz.  
  > Ücretsiz hesap aç; bu konu Kaydedilenler
- `components/Onay.tsx` satır 34: **Noktalı virgülle bağlanmış iki cümle** « İlerlemen artık hesabına kaydediliyor; başka bir cihazda aynı e-postayla giriş yaparsan k». İki ayrı cümle yaz.  
  > E-postanı doğruladın. İlerlemen artık hesabına kaydediliyor; başka bir cihazda aynı e-postayla giriş yaparsan kaldığın yerden devam edersin.
- `components/OrganelOyun.tsx` satır 18: **Noktalı virgülle bağlanmış iki cümle** «Çekirdek porlu çift zarla çevrilidir; içinde DNA (kromatin) ve çekirdekçik bulunur». İki ayrı cümle yaz.  
  > Çekirdek porlu çift zarla çevrilidir; içinde DNA (kromatin) ve çekirdekçik bulunur.
- `components/OrganelOyun.tsx` satır 21: **Noktalı virgülle bağlanmış iki cümle** «Granüllü ER çekirdeğin hemen yanındadır; ürettiği proteinleri keseciklerle Golgi». İki ayrı cümle yaz.  
  > Granüllü ER çekirdeğin hemen yanındadır; ürettiği proteinleri keseciklerle Golgi
- `components/OrganelOyun.tsx` satır 22: **Noktalı virgülle bağlanmış iki cümle** «Granülsüz ER ribozom taşımaz; kas hücresinde Ca²⁺ depolar». İki ayrı cümle yaz.  
  > Granülsüz ER ribozom taşımaz; kas hücresinde Ca²⁺ depolar.
- `components/OrganelOyun.tsx` satır 26: **Noktalı virgülle bağlanmış iki cümle** «Peroksizom küçük, tek zarlı bir kesecik; karaciğerde boldur, bitki hücresinde de bulunur». İki ayrı cümle yaz.  
  > Peroksizom küçük, tek zarlı bir kesecik; karaciğerde boldur, bitki hücresinde de bulunur.
- `components/OrganelOyun.tsx` satır 27: **Noktalı virgülle bağlanmış iki cümle** «Hücre bölünürken iğ ipliklerini düzenler; birbirine dik iki küçük silindirden oluşur». İki ayrı cümle yaz.  
  > Hücre bölünürken iğ ipliklerini düzenler; birbirine dik iki küçük silindirden oluşur.
- `components/OrganelOyun.tsx` satır 28: **Noktalı virgülle bağlanmış iki cümle** « Bitkide selülozdandır; hayvan hücresinde yoktur». İki ayrı cümle yaz.  
  > Hücre duvarı zarın dışındadır. Bitkide selülozdandır; hayvan hücresinde yoktur.
- `components/OrganelOyun.tsx` satır 30: **Noktalı virgülle bağlanmış iki cümle** «Su, besin, pigment ve atık depolayan kese; su alınca bitki hücresini gergin tutar». İki ayrı cümle yaz.  
  > Su, besin, pigment ve atık depolayan kese; su alınca bitki hücresini gergin tutar.
- `components/OrganelOyun.tsx` satır 30: **Noktalı virgülle bağlanmış iki cümle** «Bitki hücresinde tek ve büyük bir merkezi koful vardır; hayvan hücresinin kofulları küçükt». İki ayrı cümle yaz.  
  > Bitki hücresinde tek ve büyük bir merkezi koful vardır; hayvan hücresinin kofulları küçüktür.
- `components/Road.tsx` satır 137: **Noktalı virgülle bağlanmış iki cümle** « Her dersin ilk konusu ücretsiz; Plus ile bütün konular açılır». İki ayrı cümle yaz.  
  > &apos;ta. Her dersin ilk konusu ücretsiz; Plus ile bütün konular açılır.
- `components/Tekrar.tsx` satır 180: **Noktalı virgülle bağlanmış iki cümle** «Yanlış yaptığın ${n - right} soru tekrar sırana eklendi; yarın yeniden gelecek». İki ayrı cümle yaz.  
  > Yanlış yaptığın ${n - right} soru tekrar sırana eklendi; yarın yeniden gelecek.
- `components/profil/Ayarlar.tsx` satır 29: **Noktalı virgülle bağlanmış iki cümle** «Şu an buluta kaydedilemedi; ilerlemen bu cihazda duruyor, bağlantı gelince yeniden denenec». İki ayrı cümle yaz.  
  > Şu an buluta kaydedilemedi; ilerlemen bu cihazda duruyor, bağlantı gelince yeniden denenecek.
- `components/profil/Ayarlar.tsx` satır 43: **Noktalı virgülle bağlanmış iki cümle** «Hesabını silmek ucler Plus aboneliğini iptal etmez; aboneliğin varsa App Store ya da Googl». İki ayrı cümle yaz.  
  > Hesabını silmek ucler Plus aboneliğini iptal etmez; aboneliğin varsa App Store ya da Google Play ayarlarından iptal et.
- `components/sahne/biyoloji1.tsx` satır 146: **Noktalı virgülle bağlanmış iki cümle** «Küçükten büyük molekül kurulur; ATP harcanır». İki ayrı cümle yaz.  
  > Küçükten büyük molekül kurulur; ATP harcanır.
- `components/sahne/biyoloji10.tsx` satır 609: **Noktalı virgülle bağlanmış iki cümle** «Ca²⁺ salınmadan aktindeki bağlanma yerleri kapalı kalır; miyozin tutunamaz». İki ayrı cümle yaz.  
  > Ca²⁺ salınmadan aktindeki bağlanma yerleri kapalı kalır; miyozin tutunamaz. Ca²⁺
- `components/sahne/biyoloji11.tsx` satır 141: **Noktalı virgülle bağlanmış iki cümle** «Yüzey ${n} katına çıktı; enzimin değdiği yer arttı». İki ayrı cümle yaz.  
  > Yüzey ${n} katına çıktı; enzimin değdiği yer arttı
- `components/sahne/biyoloji11.tsx` satır 861: **Noktalı virgülle bağlanmış iki cümle** «Karıncık kasılınca ikili kapakçık kapanmadı; kanın yarısı kulakçığa döndü». İki ayrı cümle yaz.  
  > Karıncık kasılınca ikili kapakçık kapanmadı; kanın yarısı kulakçığa döndü. Kapakçıkları onar ve yeniden oynat.
- `components/sahne/biyoloji12.tsx` satır 113: **Noktalı virgülle bağlanmış iki cümle** «Hava alveole ulaştı; yemek borusuna hiç girmedi». İki ayrı cümle yaz.  
  > Hava alveole ulaştı; yemek borusuna hiç girmedi
- `components/sahne/biyoloji12.tsx` satır 163: **Noktalı virgülle bağlanmış iki cümle** «Hacim arttı, basınç düştü; ama hacim daha da artabilir». İki ayrı cümle yaz.  
  > Hacim arttı, basınç düştü; ama hacim daha da artabilir
- `components/sahne/biyoloji12.tsx` satır 258: **Noktalı virgülle bağlanmış iki cümle** «Kan O₂ aldı, CO₂ verdi; ATP harcanmadı». İki ayrı cümle yaz.  
  > Kan O₂ aldı, CO₂ verdi; ATP harcanmadı
- `components/sahne/biyoloji13.tsx` satır 117: **Noktalı virgülle bağlanmış iki cümle** «Sperm testiste üretildi; nereye gidiyor». İki ayrı cümle yaz.  
  > Sperm testiste üretildi; nereye gidiyor?
- `components/sahne/biyoloji13.tsx` satır 251: **Noktalı virgülle bağlanmış iki cümle** «Sitoplazma eşit bölünmüyor; besin büyük hücrede kalıyor». İki ayrı cümle yaz.  
  > Sitoplazma eşit bölünmüyor; besin büyük hücrede kalıyor
- `components/sahne/biyoloji13.tsx` satır 347: **Noktalı virgülle bağlanmış iki cümle** «Ovulasyon oldu; oynat ve izle». İki ayrı cümle yaz.  
  > Ovulasyon oldu; oynat ve izle
- `components/sahne/biyoloji13.tsx` satır 556: **Noktalı virgülle bağlanmış iki cümle** «Kaynak öbek öbek; sürü ya da aile hâlinde yaşam». İki ayrı cümle yaz.  
  > Kaynak öbek öbek; sürü ya da aile hâlinde yaşam
- `components/sahne/biyoloji13.tsx` satır 753: **Noktalı virgülle bağlanmış iki cümle** «Av çoğalıyor; avcının besini artıyor». İki ayrı cümle yaz.  
  > Av çoğalıyor; avcının besini artıyor
- `components/sahne/biyoloji13.tsx` satır 810: **Noktalı virgülle bağlanmış iki cümle** «İkisi de çoğalıyor; besin azalıyor». İki ayrı cümle yaz.  
  > İkisi de çoğalıyor; besin azalıyor
- `components/sahne/biyoloji14.tsx` satır 161: **Noktalı virgülle bağlanmış iki cümle** «ü önceden dirençli; antibiyotik duyarlıları öldürür, dirençliler çoğalır». İki ayrı cümle yaz.  
  > ü önceden dirençli; antibiyotik duyarlıları öldürür, dirençliler çoğalır
- `components/sahne/biyoloji6.tsx` satır 540: **Noktalı virgülle bağlanmış iki cümle** «Işık sağdan geliyor; oksin fidenin ucunda». İki ayrı cümle yaz.  
  > Işık sağdan geliyor; oksin fidenin ucunda
- `components/sahne/biyoloji6.tsx` satır 578: **Noktalı virgülle bağlanmış iki cümle** «Tohum çimlenmedi; eksik: ${eksik}». İki ayrı cümle yaz.  
  > Tohum çimlenmedi; eksik: ${eksik}
- `components/sahne/biyoloji8.tsx` satır 515: **Noktalı virgülle bağlanmış iki cümle** «Maya: etil alkol ve CO₂; balon ${Math». İki ayrı cümle yaz.  
  > Maya: etil alkol ve CO₂; balon ${Math.round(balon * 100)}% şişti
- `components/sahne/biyoloji8.tsx` satır 590: **Noktalı virgülle bağlanmış iki cümle** «Gündüz: fotosentez solunumdan hızlı; net CO₂ alır, O₂ verir». İki ayrı cümle yaz.  
  > Gündüz: fotosentez solunumdan hızlı; net CO₂ alır, O₂ verir
- `components/sahne/biyoloji9.tsx` satır 579: **Noktalı virgülle bağlanmış iki cümle** «İnsülin olmadan hücreler glikozu alamıyor; şeker kanda birikiyor». İki ayrı cümle yaz.  
  > İnsülin olmadan hücreler glikozu alamıyor; şeker kanda birikiyor. Tip 1 diyabette olan budur. İnsülini aç ve yeniden oynat.
- `components/sahne/fizik1.tsx` satır 144: **Yüzde işaretinden sonra boşluk** «% 8». %25 (bitişik).  
  > 3 km ${YONLER[Math.round(a / 45) % 8]} yönünde yürüyüş
- `components/sahne/fizik10.tsx` satır 246: **Noktalı virgülle bağlanmış iki cümle** «ekrandan çıkıyor; alan saat yönünün tersine». İki ayrı cümle yaz.  
  > ekrandan çıkıyor; alan saat yönünün tersine
- `components/sahne/fizik11.tsx` satır 541: **Noktalı virgülle bağlanmış iki cümle** « İlk itmeden sonraki tümsek yarım salınımdır; itmeler salıncağın bir tam gidiş-gelişine de». İki ayrı cümle yaz.  
  > İtmeler salınıma uymadı: kimi itme salıncağı hızlandırdı, kimi frenledi. İlk itmeden sonraki tümsek yarım salınımdır; itmeler salıncağın bir tam gidiş-gelişine denk gelmeli.
- `components/sahne/fizik13.tsx` satır 229: **Noktalı virgülle bağlanmış iki cümle** «de bozunurdu; gerçekte yere ulaşıyor». İki ayrı cümle yaz.  
  > de bozunurdu; gerçekte yere ulaşıyor
- `components/sahne/fizik13.tsx` satır 75: **Noktalı virgülle bağlanmış iki cümle** «Top trene göre hep 20 m/s; yere göre hızı ${vt} + 20 oldu». İki ayrı cümle yaz.  
  > Top trene göre hep 20 m/s; yere göre hızı ${vt} + 20 oldu. 50 m/s için tren kaç m/s gitmeli?
- `components/sahne/fizik14.tsx` satır 282: **Noktalı virgülle bağlanmış iki cümle** «β⁻ en çok saptı; γ hiç sapmadı». İki ayrı cümle yaz.  
  > β⁻ en çok saptı; γ hiç sapmadı
- `components/sahne/fizik4.tsx` satır 210: **Noktalı virgülle bağlanmış iki cümle** «Kuvvetler eşitti; hafif olan iki kat hızlı». İki ayrı cümle yaz.  
  > Kuvvetler eşitti; hafif olan iki kat hızlı
- `components/sahne/fizik4.tsx` satır 399: **Noktalı virgülle bağlanmış iki cümle** « Başka bir açı dene; en uzağa gideni bul». İki ayrı cümle yaz.  
  > Menzil ${say(ucus(v.a ?? Number(s.aci ?? 45)).R)} m. Başka bir açı dene; en uzağa gideni bul.
- `components/sahne/fizik7.tsx` satır 459: **Noktalı virgülle bağlanmış iki cümle** « Araban 15 m/s ile gidiyor; sürtünme merkezcil kuvvete yetmedi, araba teğet boyunca kaydı». İki ayrı cümle yaz.  
  > μ = ${say(mu)} iken en büyük güvenli hız √(${say(mu)} · 9,8 · 50) ≈ ${say(vm)} m/s. Araban 15 m/s ile gidiyor; sürtünme merkezcil kuvvete yetmedi, araba teğet boyunca kaydı.
- `components/sahne/fizik8.tsx` satır 491: **Noktalı virgülle bağlanmış iki cümle** «Halat sağlamken asansör duruyor; tartı ağırlığını gösteriyor». İki ayrı cümle yaz.  
  > Halat sağlamken asansör duruyor; tartı ağırlığını gösteriyor. Halatı kes ve yeniden oynat.
- `components/sahne/fizik9.tsx` satır 248: **Noktalı virgülle bağlanmış iki cümle** «Lamba yanıyor; ampermetre lambaya paralel bağlanacak». İki ayrı cümle yaz.  
  > Lamba yanıyor; ampermetre lambaya paralel bağlanacak
- `components/sahne/kimya11.tsx` satır 195: **Noktalı virgülle bağlanmış iki cümle** «Her bağda bir σ (mavi); üçlüde iki π (kırmızı)». İki ayrı cümle yaz.  
  > Her bağda bir σ (mavi); üçlüde iki π (kırmızı)
- `components/sahne/kimya12.tsx` satır 67: **Noktalı virgülle bağlanmış iki cümle** «İskelet hemen hemen aynı; fark gruptan geliyor». İki ayrı cümle yaz.  
  > İskelet hemen hemen aynı; fark gruptan geliyor
- `components/sahne/kimya14.tsx` satır 250: **Noktalı virgülle bağlanmış iki cümle** «Gliserol az olursa zincirler sıkı kalır, film kırılır; çok olursa film yumuşar ve yapışır». İki ayrı cümle yaz.  
  > Gliserol az olursa zincirler sıkı kalır, film kırılır; çok olursa film yumuşar ve yapışır.
- `components/sahne/kimya14.tsx` satır 253: **Noktalı virgülle bağlanmış iki cümle** « "Ortam fazla bazik ya da nötr; biraz asitleştir». İki ayrı cümle yaz.  
  > 6 ? "Ortam fazla bazik ya da nötr; biraz asitleştir." : pH
- `components/sahne/kimya14.tsx` satır 253: **Noktalı virgülle bağlanmış iki cümle** «Ortam fazla bazik ya da nötr; biraz asitleştir». İki ayrı cümle yaz.  
  > Ortam fazla bazik ya da nötr; biraz asitleştir.
- `components/sahne/kimya14.tsx` satır 253: **Noktalı virgülle bağlanmış iki cümle** «Ortam fazla asidik; bakteriler yavaşlar». İki ayrı cümle yaz.  
  > Ortam fazla asidik; bakteriler yavaşlar.
- `components/sahne/kimya14.tsx` satır 253: **Noktalı virgülle bağlanmış iki cümle** «Sıcaklık fazla; bu bakteriler vücut sıcaklığına yakın sever». İki ayrı cümle yaz.  
  > Sıcaklık fazla; bu bakteriler vücut sıcaklığına yakın sever.
- `components/sahne/kimya4.tsx` satır 468: **Noktalı virgülle bağlanmış iki cümle** «İki bileşen de katı toz; ikisi de süzgeç kâğıdında kalır». İki ayrı cümle yaz.  
  > İki bileşen de katı toz; ikisi de süzgeç kâğıdında kalır.
- `components/sahne/kimya4.tsx` satır 468: **Noktalı virgülle bağlanmış iki cümle** «Ayırma hunisi birbirinde çözünmeyen sıvılar içindir; burada sıvı yok». İki ayrı cümle yaz.  
  > Ayırma hunisi birbirinde çözünmeyen sıvılar içindir; burada sıvı yok.
- `components/sahne/kimya4.tsx` satır 468: **Noktalı virgülle bağlanmış iki cümle** «Damıtma sıvıları kaynama noktası farkıyla ayırır; burada sıvı yok». İki ayrı cümle yaz.  
  > Damıtma sıvıları kaynama noktası farkıyla ayırır; burada sıvı yok.
- `components/sahne/kimya4.tsx` satır 472: **Noktalı virgülle bağlanmış iki cümle** «Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok». İki ayrı cümle yaz.  
  > Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok.
- `components/sahne/kimya4.tsx` satır 476: **Noktalı virgülle bağlanmış iki cümle** «Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok». İki ayrı cümle yaz.  
  > Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok.
- `components/sahne/kimya4.tsx` satır 476: **Noktalı virgülle bağlanmış iki cümle** «Tuzlu su tek fazlı bir çözeltidir; katmanlara ayrılmaz». İki ayrı cümle yaz.  
  > Tuzlu su tek fazlı bir çözeltidir; katmanlara ayrılmaz.

### Video seslendirme

- `video/senaryolar/BIY-06.md` paragraf 5: **Noktalı virgülle bağlanmış iki cümle** « Birçoğu, enzimlerin düzgün çalışmasına yardım eder; bazılarının ise koruyucu ya da düzenl». İki ayrı cümle yaz.  
  > Vitaminler enerji vermez. Birçoğu, enzimlerin düzgün çalışmasına yardım eder; bazılarının ise koruyucu ya da düzenleyici görevleri vardır. Bu yüzden az miktar yeter ama hiç olmazsa sistem aksar.
- `video/senaryolar/BIY-08.md` paragraf 7: **Noktalı virgülle bağlanmış iki cümle** «Yani enzim, sert bir kilit değil; doğru eli tanıyınca kapanan bir eldivendir». İki ayrı cümle yaz.  
  > Yani enzim, sert bir kilit değil; doğru eli tanıyınca kapanan bir eldivendir.
- `video/senaryolar/BIY-09.md` paragraf 2: **Noktalı virgülle bağlanmış iki cümle** « Bu maddeler görme sinirine zarar verir; körlüğe, hatta ölüme yol açabilir». İki ayrı cümle yaz.  
  > Metanol, bazı sahte içkilere karışan bir alkoldür. Asıl tehlike metanolün kendisi değil, karaciğer enzimlerinin onu formaldehit ve formik aside çevirmesidir. Bu maddeler görme sinirine zarar verir; körlüğe, hatta ölüme y…
- `video/senaryolar/BIY-10.md` paragraf 6: **Noktalı virgülle bağlanmış iki cümle** « Golgi, proteini düzenler, gerekirse şeker ekler ve etiketler; tıpkı bir kargo merkezi gib». İki ayrı cümle yaz.  
  > Birkaç dakika sonra işaret Golgi aygıtına geçti. Golgi, proteini düzenler, gerekirse şeker ekler ve etiketler; tıpkı bir kargo merkezi gibi.
- `video/senaryolar/BIY-11.md` paragraf 4: **Noktalı virgülle bağlanmış iki cümle** « Glikoz ve oksijen kullanılır; sonunda karbondioksit, su ve ATP oluşur». İki ayrı cümle yaz.  
  > Bu işe oksijenli solunum denir. Glikoz ve oksijen kullanılır; sonunda karbondioksit, su ve ATP oluşur. Verdiğin nefesteki karbondioksit de büyük ölçüde buradan gelir.
- `video/senaryolar/BIY-11.md` paragraf 5: **Noktalı virgülle bağlanmış iki cümle** « İç zar ise defalarca kıvrılır; bu kıvrımlara krista denir». İki ayrı cümle yaz.  
  > Mitokondrinin iki zarı vardır. Dış zar düzdür. İç zar ise defalarca kıvrılır; bu kıvrımlara krista denir. Kıvrımlar yüzeyi büyütür, böylece ATP üreten yapılara daha çok yer açılır.
- `video/senaryolar/BIY-12.md` paragraf 4: **Noktalı virgülle bağlanmış iki cümle** « Hücrenin içi zarlarla bölmelere ayrılmıştır; her organel kendi işini yapar». İki ayrı cümle yaz.  
  > Senin hücren ise bir ökaryottur. DNA'n, çift zarlı bir çekirdeğin içinde korunur. Hücrenin içi zarlarla bölmelere ayrılmıştır; her organel kendi işini yapar.
- `video/senaryolar/FIZ-83.md` paragraf 5: **Geçiş dolgusu: bununla birlikte / öte yandan** «Öte yandan». Sil ya da 'ama', 'ayrıca', 'ise'.  
  > Öte yandan uydular yerden yirmi bin kilometre yüksektedir. Genel göreliliğe göre kütle çekiminin zayıf olduğu yerde zaman daha hızlı akar. Bu yüzden aynı saat her gün kırk beş mikrosaniye ileri gider.
- `video/senaryolar/FIZ-90.md` paragraf 5: **Noktalı virgülle bağlanmış iki cümle** « Ayrıca uranyumun kritik kütle denen bir sınırı aşması gerekir; daha azında nötronlar dışa». İki ayrı cümle yaz.  
  > Bombayı üretmek ise çok zordu. Doğal uranyumun yüzde birinden azı bölünebilen uranyum iki yüz otuz beştir. Bomba için bu oranın çok artırılması gerekiyordu. Ayrıca uranyumun kritik kütle denen bir sınırı aşması gerekir; …
- `video/senaryolar/FIZ-90.md` paragraf 8: **Noktalı virgülle bağlanmış iki cümle** «Peki sence, nükleer santraller de uranyum çekirdeği bölüyor; neden atom bombası gibi patla». İki ayrı cümle yaz.  
  > Peki sence, nükleer santraller de uranyum çekirdeği bölüyor; neden atom bombası gibi patlamazlar?
- `video/senaryolar/KIM-04.md` paragraf 2: **Noktalı virgülle bağlanmış iki cümle** « Bir dairenin üstündeki alev ise yakıcı maddeyi gösterir; başka şeylerin yanmasını hızland». İki ayrı cümle yaz.  
  > Alev, maddenin kolay tutuştuğunu söyler. Bir dairenin üstündeki alev ise yakıcı maddeyi gösterir; başka şeylerin yanmasını hızlandırır. Patlayan bomba patlayıcıyı, kurukafa zehirli maddeyi anlatır. Ele ve yüzeye damlayan…
- `video/senaryolar/KIM-04.md` paragraf 2: **Noktalı virgülle bağlanmış iki cümle** « Ele ve yüzeye damlayan sıvı aşındırıcı demektir; deriyi ve metali yakar». İki ayrı cümle yaz.  
  > Alev, maddenin kolay tutuştuğunu söyler. Bir dairenin üstündeki alev ise yakıcı maddeyi gösterir; başka şeylerin yanmasını hızlandırır. Patlayan bomba patlayıcıyı, kurukafa zehirli maddeyi anlatır. Ele ve yüzeye damlayan…
- `video/senaryolar/KIM-05.md` paragraf 5: **Noktalı virgülle bağlanmış iki cümle** « Formülde bir oksijen daha olursa hidrojen peroksit olur; o artık su değildir». İki ayrı cümle yaz.  
  > Oran değişirse madde de değişir. Formülde bir oksijen daha olursa hidrojen peroksit olur; o artık su değildir.
- `video/senaryolar/KIM-06.md` paragraf 3: **Noktalı virgülle bağlanmış iki cümle** « Zamanla birikir; sinir sistemine, böbreklere ve diğer organlara zarar verir». İki ayrı cümle yaz.  
  > Bazı elementler ise tam tersini yapar. Cıva, kurşun ve kadmiyum gibi ağır metaller vücuttan kolay atılmaz. Zamanla birikir; sinir sistemine, böbreklere ve diğer organlara zarar verir. Eski boyalardaki kurşun ve kırık ter…
- `video/senaryolar/KIM-08.md` paragraf 3: **Noktalı virgülle bağlanmış iki cümle** « Kül, duman ve gazlar oluştu; yani yeni maddeler ortaya çıktı». İki ayrı cümle yaz.  
  > Yanan kibrit ise artık kibrit değildir. Kül, duman ve gazlar oluştu; yani yeni maddeler ortaya çıktı. Buna kimyasal değişim denir. Demirin paslanması ve sütün ekşimesi de böyledir.
- `video/senaryolar/KIM-11.md` paragraf 3: **Noktalı virgülle bağlanmış iki cümle** «Bin sekiz yüz üçte John Dalton atomu içi dolu, bölünemeyen bir küre gibi düşündü; tıpkı bi». İki ayrı cümle yaz.  
  > Bin sekiz yüz üçte John Dalton atomu içi dolu, bölünemeyen bir küre gibi düşündü; tıpkı bir bilardo topu gibi. Bu model, maddelerin neden sabit oranlarda birleştiğini açıklıyordu.
- `video/senaryolar/KIM-44.md` paragraf 8: **Noktalı virgülle bağlanmış iki cümle** «Peki sence, havuz suyunda da klor var; havuzda neden zehirlenmeyiz». İki ayrı cümle yaz.  
  > Peki sence, havuz suyunda da klor var; havuzda neden zehirlenmeyiz?
- `video/senaryolar/KIM-64.md` paragraf 5: **Noktalı virgülle bağlanmış iki cümle** « Çünkü verilen elektron yok olamaz; mutlaka başka bir atom onu alır». İki ayrı cümle yaz.  
  > İkisi her zaman birlikte olur. Çünkü verilen elektron yok olamaz; mutlaka başka bir atom onu alır. Bu yüzden bu tepkimelere, iki adın birleşimiyle redoks denir.

### Video ve yenilik

- `content/videolar.json` [10].cevap: **Noktalı virgülle bağlanmış iki cümle** «Tek bir özellik yetmez; biyoloji bir özellikler listesine bakar: hücreden oluşmak, metabol». İki ayrı cümle yaz.  
  > Tek bir özellik yetmez; biyoloji bir özellikler listesine bakar: hücreden oluşmak, metabolizma, üreme, büyüme, uyarılara tepki, homeostazi ve evrimleşme. Virüs bunların bir kısmını yalnızca hücre içinde gösterir; en çok …
- `content/videolar.json` [10].cevap: **Noktalı virgülle bağlanmış iki cümle** « Virüs bunların bir kısmını yalnızca hücre içinde gösterir; en çok tartışılan eksiği hücre». İki ayrı cümle yaz.  
  > Tek bir özellik yetmez; biyoloji bir özellikler listesine bakar: hücreden oluşmak, metabolizma, üreme, büyüme, uyarılara tepki, homeostazi ve evrimleşme. Virüs bunların bir kısmını yalnızca hücre içinde gösterir; en çok …
- `content/videolar.json` [11].cevap: **Noktalı virgülle bağlanmış iki cümle** «ATP kararsız bir moleküldür; suyla kendiliğinden yavaşça parçalanır, bu yüzden uzun süre s». İki ayrı cümle yaz.  
  > ATP kararsız bir moleküldür; suyla kendiliğinden yavaşça parçalanır, bu yüzden uzun süre saklamaya uygun değildir. Hücre enerjiyi glikojen ve yağ gibi kararlı moleküllerde depolar, ATP'yi ise gerektiği anda solunumla hız…
- `content/videolar.json` [14].cevap: **Noktalı virgülle bağlanmış iki cümle** « Soğutunca zincirler eski düzenli şekillerine kendiliğinden geri katlanamaz; bu yüzden bu ». İki ayrı cümle yaz.  
  > Isı, yumurta akı proteinlerinin katlanmış şeklini açar. Açılan zincirler birbirine yapışıp karışık bir ağ kurar. Soğutunca zincirler eski düzenli şekillerine kendiliğinden geri katlanamaz; bu yüzden bu denatürasyon geri …
- `content/videolar.json` [15].cevap: **Noktalı virgülle bağlanmış iki cümle** «D vitamini yağda çözünür; fazlası atılamaz, yağ dokusunda ve karaciğerde birikir ve zehirl». İki ayrı cümle yaz.  
  > D vitamini yağda çözünür; fazlası atılamaz, yağ dokusunda ve karaciğerde birikir ve zehirlenmeye yol açabilir (kanda kalsiyum aşırı yükselir). C vitamini suda çözünür; fazlası büyük ölçüde idrarla atılır.
- `content/videolar.json` [15].cevap: **Noktalı virgülle bağlanmış iki cümle** « C vitamini suda çözünür; fazlası büyük ölçüde idrarla atılır». İki ayrı cümle yaz.  
  > D vitamini yağda çözünür; fazlası atılamaz, yağ dokusunda ve karaciğerde birikir ve zehirlenmeye yol açabilir (kanda kalsiyum aşırı yükselir). C vitamini suda çözünür; fazlası büyük ölçüde idrarla atılır.
- `content/videolar.json` [17].cevap: **Noktalı virgülle bağlanmış iki cümle** « Çay şekeri (sakkaroz: glikoz + fruktoz) farklı bir şeker içerir; bağlansa bile enzim doğr». İki ayrı cümle yaz.  
  > Laktazın aktif bölgesi yalnızca süt şekerinin (laktoz: galaktoz + glikoz) şekline ve kimyasal gruplarına uyar. Çay şekeri (sakkaroz: glikoz + fruktoz) farklı bir şeker içerir; bağlansa bile enzim doğru biçimde kapanmaz v…
- `content/videolar.json` [17].cevap: **Noktalı virgülle bağlanmış iki cümle** « Buna özgüllük denir; sakkarozu başka bir enzim, sükraz parçalar». İki ayrı cümle yaz.  
  > Laktazın aktif bölgesi yalnızca süt şekerinin (laktoz: galaktoz + glikoz) şekline ve kimyasal gruplarına uyar. Çay şekeri (sakkaroz: glikoz + fruktoz) farklı bir şeker içerir; bağlansa bile enzim doğru biçimde kapanmaz v…
- `content/videolar.json` [18].cevap: **Noktalı virgülle bağlanmış iki cümle** « Hız yeniden en yüksek değerine yaklaşıyorsa inhibitör yarışmalıdır; çok substrat onu akti». İki ayrı cümle yaz.  
  > Ortama giderek daha çok substrat eklenir ve tepkime hızı ölçülür. Hız yeniden en yüksek değerine yaklaşıyorsa inhibitör yarışmalıdır; çok substrat onu aktif bölgeden uzaklaştırır. Ne kadar substrat eklense de en yüksek h…
- `content/videolar.json` [18].cevap: **Noktalı virgülle bağlanmış iki cümle** « Ne kadar substrat eklense de en yüksek hız düşük kalıyorsa inhibitör yarışmasızdır; enzim». İki ayrı cümle yaz.  
  > Ortama giderek daha çok substrat eklenir ve tepkime hızı ölçülür. Hız yeniden en yüksek değerine yaklaşıyorsa inhibitör yarışmalıdır; çok substrat onu aktif bölgeden uzaklaştırır. Ne kadar substrat eklense de en yüksek h…
- `content/videolar.json` [19].cevap: **Noktalı virgülle bağlanmış iki cümle** «Salgılanacak proteinler granüllü ER'deki ribozomlarda üretildiği için amilaz yapılamaz ve ». İki ayrı cümle yaz.  
  > Salgılanacak proteinler granüllü ER'deki ribozomlarda üretildiği için amilaz yapılamaz ve tükürüğe enzim salgılanamaz; hücre zarına gidecek proteinler de eksik kalır. Sitoplazmada kalacak proteinleri ise serbest ribozoml…
- `content/videolar.json` [20].cevap: **Noktalı virgülle bağlanmış iki cümle** «Santral yakıtında bölünebilen uranyum-235 oranı düşüktür (yaklaşık %3-5; bombada çok daha ». İki ayrı cümle yaz.  
  > Santral yakıtında bölünebilen uranyum-235 oranı düşüktür (yaklaşık %3-5; bombada çok daha yüksek), bu yüzden zincir bomba gibi kendi kendine çığ olamaz. Ayrıca kontrol çubukları fazla nötronları yutar ve her bölünmenin o…
- `content/videolar.json` [20].soru: **Noktalı virgülle bağlanmış iki cümle** «Nükleer santraller de uranyum çekirdeği bölüyor; neden atom bombası gibi patlamazlar». İki ayrı cümle yaz.  
  > Nükleer santraller de uranyum çekirdeği bölüyor; neden atom bombası gibi patlamazlar?
- `content/videolar.json` [21].cevap: **Noktalı virgülle bağlanmış iki cümle** « Hızlı alfa taneciklerinin hepsi levhadan geçer, en fazla çok az saparlardı; hiçbiri geri ». İki ayrı cümle yaz.  
  > Thomson modelinde artı yük bütün küreye yayıldığı için hiçbir yerde güçlü bir itme olmazdı. Hızlı alfa taneciklerinin hepsi levhadan geçer, en fazla çok az saparlardı; hiçbiri geri sekmezdi. Geri sekenler görüldüğü için …
- `content/videolar.json` [22].cevap: **Noktalı virgülle bağlanmış iki cümle** «Mitokondrisi olmayan alyuvar oksijenli solunum yapmaz; ATP'sini oksijen kullanmadan glikol». İki ayrı cümle yaz.  
  > Mitokondrisi olmayan alyuvar oksijenli solunum yapmaz; ATP'sini oksijen kullanmadan glikolizle üretir. Böylece taşıdığı oksijeni kendisi harcamaz, hepsini dokulara bırakır. Mitokondri ve çekirdek olmadığı için hücrede he…
- `content/videolar.json` [23].cevap: **Noktalı virgülle bağlanmış iki cümle** « Çinko demirden daha aktif olduğu için elektronu o verir; bu elektronlar demire geçer ve d». İki ayrı cümle yaz.  
  > Önce çinko yükseltgenir. Çinko demirden daha aktif olduğu için elektronu o verir; bu elektronlar demire geçer ve demir iyonlaşmaz. Böylece çinko kendini feda eder, çizik açıkta kalsa bile demir bir süre paslanmaz. Bu yön…
- `content/videolar.json` [25].cevap: **Noktalı virgülle bağlanmış iki cümle** « Otobüs senin altından sola döndüğü için sen otobüse göre sağa kayarsın; seni sağa iten ge». İki ayrı cümle yaz.  
  > Otobüs sola dönerken senin bedenin eylemsizlik yüzünden düz gitmeye devam etmek ister. Otobüs senin altından sola döndüğü için sen otobüse göre sağa kayarsın; seni sağa iten gerçek bir kuvvet yoktur. Seni otobüsle birlik…
- `content/videolar.json` [27].cevap: **Kapanış etiketi: sonuç olarak** «Sonuç olarak». Bir hesabın ya da olayın sonucuysa kalsın; paragraf kapanışıysa sil.  
  > Deniz suyu kanına göre çok tuzludur, yani hipertoniktir. Bu tuz kana geçince osmozla hücrelerden su çekilir ve hücreler su kaybeder. Böbreklerin bu fazla tuzu atabilmesi için de içtiğinden daha fazla su harcaması gerekir…
- `content/videolar.json` [28].cevap: **Noktalı virgülle bağlanmış iki cümle** « Bir yavru hücre o kromozomdan fazla, diğeri eksik alırdı; örneğin biri 47, diğeri 45 krom». İki ayrı cümle yaz.  
  > Kardeş kromatitler ayrılmasaydı iki kopya da aynı kutba giderdi. Bir yavru hücre o kromozomdan fazla, diğeri eksik alırdı; örneğin biri 47, diğeri 45 kromozomlu olurdu. Kromozom sayısı bozuk hücreler genellikle düzgün ça…
- `content/videolar.json` [2].cevap: **Noktalı virgülle bağlanmış iki cümle** « Pas, demirin havadaki oksijen ve suyla birleşmesiyle oluşur; yani çivi havadan madde alır». İki ayrı cümle yaz.  
  > Artar. Pas, demirin havadaki oksijen ve suyla birleşmesiyle oluşur; yani çivi havadan madde alır. Kapalı bir kapta tartarsan toplam kütle yine değişmez: çivinin kazandığı kütle, havanın kaybettiği kadardır.
- `content/videolar.json` [31].soru: **Noktalı virgülle bağlanmış iki cümle** «Havuz suyunda da klor var; havuzda neden zehirlenmeyiz». İki ayrı cümle yaz.  
  > Havuz suyunda da klor var; havuzda neden zehirlenmeyiz?
- `content/videolar.json` [4].cevap: **Noktalı virgülle bağlanmış iki cümle** « C'nin yanında indis yazmadığı için bir karbon vardır; O'nun sağ altındaki 2 ise iki oksij». İki ayrı cümle yaz.  
  > Üç atom: bir karbon ve iki oksijen. C'nin yanında indis yazmadığı için bir karbon vardır; O'nun sağ altındaki 2 ise iki oksijen olduğunu söyler.
- `content/videolar.json` [6].cevap: **Noktalı virgülle bağlanmış iki cümle** «Gemi som demir değildir; gövdesinin içi büyük ölçüde havayla doludur». İki ayrı cümle yaz.  
  > Gemi som demir değildir; gövdesinin içi büyük ölçüde havayla doludur. Bu yüzden geminin ortalama yoğunluğu, yani toplam kütlesinin kapladığı toplam hacme oranı, sudan küçüktür. Gemi kendi ağırlığı kadar suyu yerinden ite…
- `content/videolar.json` [9].cevap: **Noktalı virgülle bağlanmış iki cümle** « Yalnızca çekirdeğe çok yakın geçenler itilip sapar; neredeyse tam üstüne gelen birkaçı ge». İki ayrı cümle yaz.  
  > Çünkü atomun büyük kısmı boşluktur. Kütle ve pozitif yük minicik çekirdekte toplandığı için taneciklerin çoğu çekirdeğe hiç yaklaşmadan geçer. Yalnızca çekirdeğe çok yakın geçenler itilip sapar; neredeyse tam üstüne gele…

### İçerik

- `content/biyoloji.json` bitki-biyolojisi › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** « Nastik hareket ise uyaranın yönünden bağımsızdır; küstüm otunun dokununca kapanması buna ». İki ayrı cümle yaz.  
  > Bitkinin uyaranın yönüne göre büyümesine tropizma denir. Gövde ışığa, kök ise yer çekimine ve suya doğru yönelir. Nastik hareket ise uyaranın yönünden bağımsızdır; küstüm otunun dokununca kapanması buna örnektir.
- `content/biyoloji.json` bitki-biyolojisi › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** « Parankima hücreleri canlı ve ince çeperlidir; fotosentez ya da depolama yapar». İki ayrı cümle yaz.  
  > Koruyucu doku, epidermis ya da mantar dokusundan oluşur. Parankima hücreleri canlı ve ince çeperlidir; fotosentez ya da depolama yapar. Destek dokularından kollenkima canlı ve esnek, sklerenkima ise sert ve ölüdür.
- `content/biyoloji.json` bitki-biyolojisi › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** «Ksilem, su ve mineralleri kökten yaprağa taşır; iletim hücreleri olgunlaşınca ölüdür». İki ayrı cümle yaz.  
  > Ksilem, su ve mineralleri kökten yaprağa taşır; iletim hücreleri olgunlaşınca ölüdür. Floem ise organik maddeleri taşır. Kalburlu boru hücreleri canlıdır ve akış iki yönlü olabilir.
- `content/biyoloji.json` bitki-biyolojisi › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Nemli gecelerde yaprak kenarlarından su damlar; buna gutasyon denir». İki ayrı cümle yaz.  
  > Kök, mineralleri aktif taşımayla ksileme yükler. Su da osmozla içeri girer ve kök basıncı oluşur. Nemli gecelerde yaprak kenarlarından su damlar; buna gutasyon denir. Ancak kök basıncı uzun ağaçlarda suyu tepeye çıkarmay…
- `content/biyoloji.json` bitki-biyolojisi › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Oksin yan tomurcukları baskılar; buna tepe baskınlığı denir». İki ayrı cümle yaz.  
  > Hormonlar çok az miktarda büyümeyi yönetir. Oksin yan tomurcukları baskılar; buna tepe baskınlığı denir. Sitokinin hücre bölünmesini, giberellin uzamayı uyarır. Absisik asit stomayı kapatır, etilen ise meyveyi olgunlaştı…
- `content/biyoloji.json` bitki-biyolojisi › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Küstüm otunun kapanması uyaranın yönünden bağımsızdır ve turgorla olur; bu bir nastik har». İki ayrı cümle yaz.  
  > Işığa yönelmeye fototropizma, yer çekimine göre büyümeye gravitropizma, bir desteğe dolanmaya ise tigmotropizma denir. Küstüm otunun kapanması uyaranın yönünden bağımsızdır ve turgorla olur; bu bir nastik harekettir.
- `content/biyoloji.json` bitkiler-alemi › cards[0].key: **Noktalı virgülle bağlanmış iki cümle** « Embriyonun korunması ise kara bitkilerine özgüdür; bu yüzden onlara embriyolu bitkiler de». İki ayrı cümle yaz.  
  > Klorofil a ve b ile selüloz yeşil alglerde de bulunur. Embriyonun korunması ise kara bitkilerine özgüdür; bu yüzden onlara embriyolu bitkiler denir.
- `content/biyoloji.json` bitkiler-alemi › cards[0].p: **Noktalı virgülle bağlanmış iki cümle** «Bitkiler ökaryot ve çok hücreli canlılardır; hücre duvarları selülozdan yapılmıştır». İki ayrı cümle yaz.  
  > Bitkiler ökaryot ve çok hücreli canlılardır; hücre duvarları selülozdan yapılmıştır. Fotosentezle besin üretir ve fazlasını nişasta olarak depolarlar. Embriyolarını bir dokunun içinde korurlar.
- `content/biyoloji.json` bitkiler-alemi › cards[10].key: **Noktalı virgülle bağlanmış iki cümle** « Palmiye tek çeneklidir; kambiyumu ve yıllık halkası yoktur». İki ayrı cümle yaz.  
  > Kambiyum gövdeyi enine kalınlaştırır ve yıllık halkaları oluşturur. Palmiye tek çeneklidir; kambiyumu ve yıllık halkası yoktur.
- `content/biyoloji.json` bitkiler-alemi › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** «Tek çeneklilerde saçak kök bulunur ve çiçek kısımları 3'ün katlarıdır; buğday ve lale buna». İki ayrı cümle yaz.  
  > Tek çeneklilerde saçak kök bulunur ve çiçek kısımları 3'ün katlarıdır; buğday ve lale buna örnektir. Çift çeneklilerde kazık kök bulunur ve çiçek kısımları 4'ün ya da 5'in katlarıdır; fasulye ve gül buna örnektir. Bir bi…
- `content/biyoloji.json` bitkiler-alemi › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « Çift çeneklilerde kazık kök bulunur ve çiçek kısımları 4'ün ya da 5'in katlarıdır; fasuly». İki ayrı cümle yaz.  
  > Tek çeneklilerde saçak kök bulunur ve çiçek kısımları 3'ün katlarıdır; buğday ve lale buna örnektir. Çift çeneklilerde kazık kök bulunur ve çiçek kısımları 4'ün ya da 5'in katlarıdır; fasulye ve gül buna örnektir. Bir bi…
- `content/biyoloji.json` bitkiler-alemi › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** «Bitkiler karadaki üreticilerdir; oksijen verir ve CO2 bağlarlar». İki ayrı cümle yaz.  
  > Bitkiler karadaki üreticilerdir; oksijen verir ve CO2 bağlarlar. Kökleri erozyonu önler. İnsana besin, kereste, lif ve ilaç sağlarlar. Taş kömürü de eski bitki ormanlarından oluşmuştur.
- `content/biyoloji.json` bitkiler-alemi › cards[3].key: **Noktalı virgülle bağlanmış iki cümle** «Rizoit daha çok tutunmaya yarar; yosun suyu bütün yüzeyinden emer». İki ayrı cümle yaz.  
  > Rizoit daha çok tutunmaya yarar; yosun suyu bütün yüzeyinden emer. Yosunlar, likenlerle birlikte çıplak kayalara ilk yerleşen öncü türlerdendir.
- `content/biyoloji.json` bitkiler-alemi › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** «Eğrelti, at kuyruğu ve kibrit otunda ksilem ve floem bulunur; gerçek kök, gövde ve yaprak ». İki ayrı cümle yaz.  
  > Eğrelti, at kuyruğu ve kibrit otunda ksilem ve floem bulunur; gerçek kök, gövde ve yaprak oluşur. Ancak bu bitkilerde tohum ve çiçek yoktur. Bu bitkiler sporla çoğalır.
- `content/biyoloji.json` bitkiler-alemi › cards[6].key: **Noktalı virgülle bağlanmış iki cümle** « Polen tanesi sperm değildir; sperm yapan küçük bir erkek gametofittir». İki ayrı cümle yaz.  
  > Eğreltinin gametofiti küçük ama bağımsız bir bitkidir ve protallus adını alır. Polen tanesi sperm değildir; sperm yapan küçük bir erkek gametofittir.
- `content/biyoloji.json` bitkiler-alemi › cards[8].p: **Noktalı virgülle bağlanmış iki cümle** «Çam, ladin, köknar ve ardıç açık tohumludur; tohumları kozalak pulunun üstünde açıkta duru». İki ayrı cümle yaz.  
  > Çam, ladin, köknar ve ardıç açık tohumludur; tohumları kozalak pulunun üstünde açıkta durur. Bu bitkilerde çiçek ve meyve yoktur ve polenleri rüzgârla taşınır. Çoğu her mevsim yeşil kalır.
- `content/biyoloji.json` bitkiler-alemi › quiz[3].e: **Noktalı virgülle bağlanmış iki cümle** «İkisi de tohumlu ve damarlı bitkidir; aralarındaki fark tohumun korunmasındadır». İki ayrı cümle yaz.  
  > İkisi de tohumlu ve damarlı bitkidir; aralarındaki fark tohumun korunmasındadır. Çam açık tohumludur ve çiçeği ile meyvesi yoktur. Elma ise kapalı tohumludur.
- `content/biyoloji.json` biyomolekuller › cards[10].etk.ogeler[4][2]: **Noktalı virgülle bağlanmış iki cümle** «C vitamini suda çözünür; fazlası idrarla atılır, düzenli alınmalıdır». İki ayrı cümle yaz.  
  > C vitamini suda çözünür; fazlası idrarla atılır, düzenli alınmalıdır.
- `content/biyoloji.json` biyomolekuller › cards[10].etk.ogeler[6][2]: **Noktalı virgülle bağlanmış iki cümle** «B12 suda çözünür; yine de karaciğerde yıllarca depolanabilir». İki ayrı cümle yaz.  
  > B12 suda çözünür; yine de karaciğerde yıllarca depolanabilir.
- `content/biyoloji.json` biyomolekuller › cards[11].once.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «Proteini biüre gösterir ve rengi mora çevirir; iyot proteini göstermez». İki ayrı cümle yaz.  
  > Proteini biüre gösterir ve rengi mora çevirir; iyot proteini göstermez.
- `content/biyoloji.json` biyomolekuller › cards[11].once.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** «Yağı Sudan III kırmızıya boyar; iyot yağı göstermez». İki ayrı cümle yaz.  
  > Yağı Sudan III kırmızıya boyar; iyot yağı göstermez.
- `content/biyoloji.json` biyomolekuller › cards[1].p: **Noktalı virgülle bağlanmış iki cümle** « Tersinde su eklenir ve bağ kırılır; buna da hidroliz denir». İki ayrı cümle yaz.  
  > Küçük birimler (monomer) birleşip büyük moleküller (polimer) oluşturur. Bu birleşmede su açığa çıkar ve buna dehidrasyon sentezi denir. Tersinde su eklenir ve bağ kırılır; buna da hidroliz denir. Sindirim bir hidroliz ol…
- `content/biyoloji.json` biyomolekuller › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Zincirleri düz olduğu için sıkı dizilirler; bu yüzden tereyağı katıdır». İki ayrı cümle yaz.  
  > Doymuş yağ asitlerinde karbonlar arasında yalnızca tek bağ bulunur. Zincirleri düz olduğu için sıkı dizilirler; bu yüzden tereyağı katıdır. Doymamış yağ asitlerindeki çift bağ zinciri büker. Bükük zincirler sıkı dizileme…
- `content/biyoloji.json` biyomolekuller › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Bükük zincirler sıkı dizilemez; bu yüzden zeytinyağı sıvıdır». İki ayrı cümle yaz.  
  > Doymuş yağ asitlerinde karbonlar arasında yalnızca tek bağ bulunur. Zincirleri düz olduğu için sıkı dizilirler; bu yüzden tereyağı katıdır. Doymamış yağ asitlerindeki çift bağ zinciri büker. Bükük zincirler sıkı dizileme…
- `content/biyoloji.json` biyomolekuller › cards[8].once.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «Isı, proteinin katlanmış şeklini bozdu; buna denatürasyon denir». İki ayrı cümle yaz.  
  > Isı, proteinin katlanmış şeklini bozdu; buna denatürasyon denir. Şekli bozulan protein görevini yapamaz.
- `content/biyoloji.json` biyomolekuller › cards[8].once.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «Yumurta akı hâlâ proteindir; değişen yalnızca şeklidir». İki ayrı cümle yaz.  
  > Yumurta akı hâlâ proteindir; değişen yalnızca şeklidir.
- `content/biyoloji.json` biyomolekuller › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** «Nükleik asitlerin birimi nükleotittir; bir fosfat, bir şeker ve bir bazdan oluşur». İki ayrı cümle yaz.  
  > Nükleik asitlerin birimi nükleotittir; bir fosfat, bir şeker ve bir bazdan oluşur. DNA çift zincirlidir, deoksiriboz şekeri ve A, T, G, C bazlarını taşır, bilgiyi saklar. RNA genellikle tek zincirlidir, riboz taşır, T ye…
- `content/biyoloji.json` canlilarin-ozellikleri › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** « Deneyde yalnızca bir etken değiştirilir; buna bağımsız değişken denir». İki ayrı cümle yaz.  
  > Biyolog önce bir hipotez kurar ve bunu deneyle sınar. Deneyde yalnızca bir etken değiştirilir; buna bağımsız değişken denir. Ölçülen sonuca bağımlı değişken denir. Kontrol grubu ise karşılaştırma yapmayı sağlar.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[11].once.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** « Aşılar ve antibiyotikler bunu büyük ölçüde önledi; temiz su ve hijyen de katkı sağladı». İki ayrı cümle yaz.  
  > Eskiden çocukların çoğu enfeksiyonlardan ölüyordu. Aşılar ve antibiyotikler bunu büyük ölçüde önledi; temiz su ve hijyen de katkı sağladı.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[12].once.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** «Veri, araştırmacının isteğine göre seçilemez; olduğu gibi raporlanmalıdır». İki ayrı cümle yaz.  
  > Veri, araştırmacının isteğine göre seçilemez; olduğu gibi raporlanmalıdır.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[13].p: **Noktalı virgülle bağlanmış iki cümle** « • Homeostaziyle iç dengelerini korurlar; popülasyonlar nesiller boyunca ortama uyum sağla». İki ayrı cümle yaz.  
  > • Canlılar hücrelerden oluşur ve basamaklı bir düzen kurar. • Beslenir, solunum ve boşaltım yapar, enerjiyi ATP ile kullanırlar. • Ürer, büyür, gelişir ve uyarılara tepki verirler. • Homeostaziyle iç dengelerini korurlar…
- `content/biyoloji.json` canlilarin-ozellikleri › cards[1].p: **Noktalı virgülle bağlanmış iki cümle** « Büyük molekülleri parçalamaya katabolizma denir; sindirim ve solunum buna örnektir ve gen». İki ayrı cümle yaz.  
  > Canlıda gerçekleşen bütün kimyasal tepkimelere metabolizma denir. Küçük moleküllerden büyük molekül yapmaya anabolizma denir ve enerji harcanır. Büyük molekülleri parçalamaya katabolizma denir; sindirim ve solunum buna ö…
- `content/biyoloji.json` canlilarin-ozellikleri › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** «Hücre, besindeki enerjiyi doğrudan kullanamaz; önce bu enerjiyi ATP molekülüne yükler». İki ayrı cümle yaz.  
  > Hücre, besindeki enerjiyi doğrudan kullanamaz; önce bu enerjiyi ATP molekülüne yükler. Hücre iş yaparken ATP, ADP ve fosfata ayrılır. Hücrede az miktarda ATP bulunur, bu yüzden ATP sürekli yeniden üretilir.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[3].etk.ogeler[1][2]: **Noktalı virgülle bağlanmış iki cümle** «Klorofili var; fotosentezle besinini kendisi üretir». İki ayrı cümle yaz.  
  > Klorofili var; fotosentezle besinini kendisi üretir.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[3].etk.ogeler[2][2]: **Noktalı virgülle bağlanmış iki cümle** «Mantarda klorofil yoktur; çevredeki hazır besini emer». İki ayrı cümle yaz.  
  > Mantarda klorofil yoktur; çevredeki hazır besini emer.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[3].etk.ogeler[5][2]: **Noktalı virgülle bağlanmış iki cümle** «Maya bir mantardır; şekeri hazır alır». İki ayrı cümle yaz.  
  > Maya bir mantardır; şekeri hazır alır.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** «Eşeysiz üremede tek bir ata kendine benzeyen yavrular oluşturur; bakterinin bölünmesi buna». İki ayrı cümle yaz.  
  > Eşeysiz üremede tek bir ata kendine benzeyen yavrular oluşturur; bakterinin bölünmesi buna örnektir. Eşeyli üremede ise iki gamet birleşir. Katır üreyemez ama yine de canlıdır, çünkü üreme bireyin değil türün devamı için…
- `content/biyoloji.json` canlilarin-ozellikleri › cards[5].once.secenekler[1].neden: **Noktalı virgülle bağlanmış iki cümle** «Hız bir fark değildir; bazı kristaller fideden daha hızlı büyür». İki ayrı cümle yaz.  
  > Hız bir fark değildir; bazı kristaller fideden daha hızlı büyür.
- `content/biyoloji.json` canlilarin-ozellikleri › cards[8].key: **Noktalı virgülle bağlanmış iki cümle** «Bireyler evrimleşmez; popülasyonlar nesiller boyunca evrimleşir». İki ayrı cümle yaz.  
  > Bireyler evrimleşmez; popülasyonlar nesiller boyunca evrimleşir.
- `content/biyoloji.json` canlilarin-ozellikleri › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** «Küçük moleküllerden büyük molekül yapmak anabolizmadır ve enerji harcar; protein, glikojen». İki ayrı cümle yaz.  
  > Küçük moleküllerden büyük molekül yapmak anabolizmadır ve enerji harcar; protein, glikojen ve fotosentezde glikoz üretimi buna örnektir. Büyük molekülleri parçalamak ise katabolizmadır; sindirim, solunum ve yağların yıkı…
- `content/biyoloji.json` canlilarin-ozellikleri › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** « Büyük molekülleri parçalamak ise katabolizmadır; sindirim, solunum ve yağların yıkımı bun». İki ayrı cümle yaz.  
  > Küçük moleküllerden büyük molekül yapmak anabolizmadır ve enerji harcar; protein, glikojen ve fotosentezde glikoz üretimi buna örnektir. Büyük molekülleri parçalamak ise katabolizmadır; sindirim, solunum ve yağların yıkı…
- `content/biyoloji.json` canlilarin-ozellikleri › quiz[3].y[1]: **Noktalı virgülle bağlanmış iki cümle** «Hücre besindeki enerjiyi doğrudan kullanamaz; önce bu enerjiyi ATP'ye aktarması gerekir». İki ayrı cümle yaz.  
  > Hücre besindeki enerjiyi doğrudan kullanamaz; önce bu enerjiyi ATP'ye aktarması gerekir.
- `content/biyoloji.json` canlilarin-ozellikleri › quiz[3].y[3]: **Noktalı virgülle bağlanmış iki cümle** «ATP hücreler arasında taşınmaz; her hücre kendi ATP'sini kendisi üretir». İki ayrı cümle yaz.  
  > ATP hücreler arasında taşınmaz; her hücre kendi ATP'sini kendisi üretir.
- `content/biyoloji.json` destek-hareket › cards[10].key: **Kof yardımcı fiil** «katkıda bulunur». 'katkı sunar', 'artırır', 'azaltır', 'yapar'.  
  > Kısa mesafe koşucusu kreatin fosfata ve fermantasyona, maratoncu ise oksijenli solunuma dayanır. Laktik asidin birikmesi kas yorgunluğuna katkıda bulunur.
- `content/biyoloji.json` destek-hareket › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** «Tek bir uyarı kısa bir kasılmaya yol açar; buna seğirme denir». İki ayrı cümle yaz.  
  > Tek bir uyarı kısa bir kasılmaya yol açar; buna seğirme denir. Uyarılar art arda gelirse kasılmalar birikir ve kas kesintisiz kasılı kalır; buna tetanos denir. ATP azalınca kasın kuvveti düşer; buna da yorgunluk denir.
- `content/biyoloji.json` destek-hareket › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « Uyarılar art arda gelirse kasılmalar birikir ve kas kesintisiz kasılı kalır; buna tetanos». İki ayrı cümle yaz.  
  > Tek bir uyarı kısa bir kasılmaya yol açar; buna seğirme denir. Uyarılar art arda gelirse kasılmalar birikir ve kas kesintisiz kasılı kalır; buna tetanos denir. ATP azalınca kasın kuvveti düşer; buna da yorgunluk denir.
- `content/biyoloji.json` destek-hareket › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « ATP azalınca kasın kuvveti düşer; buna da yorgunluk denir». İki ayrı cümle yaz.  
  > Tek bir uyarı kısa bir kasılmaya yol açar; buna seğirme denir. Uyarılar art arda gelirse kasılmalar birikir ve kas kesintisiz kasılı kalır; buna tetanos denir. ATP azalınca kasın kuvveti düşer; buna da yorgunluk denir.
- `content/biyoloji.json` destek-hareket › cards[12].key: **Noktalı virgülle bağlanmış iki cümle** «Göz ve parmak kaslarında bir nöron az sayıda lifi uyarır; ince işler bu sayede yapılır». İki ayrı cümle yaz.  
  > Göz ve parmak kaslarında bir nöron az sayıda lifi uyarır; ince işler bu sayede yapılır. İzometrik kasılmada da ATP harcanır.
- `content/biyoloji.json` destek-hareket › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** «Uzun kemiğin gövdesine diafiz denir ve diafiz sıkı kemikten yapılmıştır; ortasında ilik bo». İki ayrı cümle yaz.  
  > Uzun kemiğin gövdesine diafiz denir ve diafiz sıkı kemikten yapılmıştır; ortasında ilik boşluğu bulunur. Uçlarına epifiz denir ve epifizler süngerimsi kemikten oluşur. Kemiği saran periost zarı ise kırıkları onarır.
- `content/biyoloji.json` destek-hareket › cards[7].p: **Noktalı virgülle bağlanmış iki cümle** « Düz kas çizgisizdir ve istemsiz çalışır; mide ve damar duvarlarında bulunur». İki ayrı cümle yaz.  
  > İskelet kası çizgilidir ve isteğimizle çalışır. Düz kas çizgisizdir ve istemsiz çalışır; mide ve damar duvarlarında bulunur. Kalp kası ise çizgilidir ama istemsiz çalışır ve hücreleri ara disklerle birbirine bağlanır.
- `content/biyoloji.json` destek-hareket › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Asetilkolin kas zarını uyarır ve Ca²⁺ iyonları salınır; böylece aktindeki bağlanma yerler». İki ayrı cümle yaz.  
  > Kasılma sırasında iplikler kısalmaz, birbirinin üzerinde kayar. Asetilkolin kas zarını uyarır ve Ca²⁺ iyonları salınır; böylece aktindeki bağlanma yerleri açılır. Miyozin başları da ATP'nin enerjisiyle aktini çeker.
- `content/biyoloji.json` dna-genetik-kod › cards[13].key: **Noktalı virgülle bağlanmış iki cümle** « Bilim neyin yapılabileceğini söyler; neyin yapılması gerektiği ise etik bir sorudur». İki ayrı cümle yaz.  
  > Embriyo kullanımı, genetik bilgilerin gizliliği, GDO'ların doğaya etkisi ve insan klonlama biyoetik sorulardır. Bilim neyin yapılabileceğini söyler; neyin yapılması gerektiği ise etik bir sorudur.
- `content/biyoloji.json` dna-genetik-kod › cards[14].key: **Noktalı virgülle bağlanmış iki cümle** «Topuk kanı taraması DNA'ya değil, kandaki maddelere bakar; örneğin fenilketonüride fazla f». İki ayrı cümle yaz.  
  > Topuk kanı taraması DNA'ya değil, kandaki maddelere bakar; örneğin fenilketonüride fazla fenilalanini ölçer. Gebelikte Down sendromu taraması da yapılır. Sonuçlar gizli tutulur.
- `content/biyoloji.json` dna-genetik-kod › cards[14].p: **Noktalı virgülle bağlanmış iki cümle** «Genetik test, DNA'daki belirli değişiklikleri arar; taşıyıcılık testi buna örnektir». İki ayrı cümle yaz.  
  > Genetik test, DNA'daki belirli değişiklikleri arar; taşıyıcılık testi buna örnektir. Genetik danışmanlıkta çiftlere riskler anlatılır ve bu, akraba evliliklerinde özellikle önemlidir. Kararı ise aile verir.
- `content/biyoloji.json` dna-genetik-kod › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** « İki iplik zıt yönlüdür; biri 5'→3', diğeri 3'→5' yönündedir». İki ayrı cümle yaz.  
  > Karşılıklı bazlar hidrojen bağlarıyla birbirine tutunur. A ile T arasında iki, G ile C arasında üç hidrojen bağı vardır. İki iplik zıt yönlüdür; biri 5'→3', diğeri 3'→5' yönündedir.
- `content/biyoloji.json` dna-genetik-kod › cards[4].key: **Noktalı virgülle bağlanmış iki cümle** «T yalnızca DNA'da, U yalnızca RNA'da bulunur; A, G ve C ise ikisinde de vardır». İki ayrı cümle yaz.  
  > T yalnızca DNA'da, U yalnızca RNA'da bulunur; A, G ve C ise ikisinde de vardır. Ayrıntılar Protein sentezi konusundadır.
- `content/biyoloji.json` dna-genetik-kod › cards[9].once.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** «Kromozom sayısı değişmiştir; 46 yerine 47 kromozom vardır». İki ayrı cümle yaz.  
  > Kromozom sayısı değişmiştir; 46 yerine 47 kromozom vardır.
- `content/biyoloji.json` dna-genetik-kod › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Gen mutasyonunda bazlar değişir; orak hücre anemisi buna örnektir». İki ayrı cümle yaz.  
  > DNA'daki kalıcı değişikliğe mutasyon denir. Gen mutasyonunda bazlar değişir; orak hücre anemisi buna örnektir. Kromozom mutasyonunda ise kromozomun bir parçası ya da kromozom sayısı değişir; Down sendromu buna örnektir. …
- `content/biyoloji.json` dna-genetik-kod › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Kromozom mutasyonunda ise kromozomun bir parçası ya da kromozom sayısı değişir; Down send». İki ayrı cümle yaz.  
  > DNA'daki kalıcı değişikliğe mutasyon denir. Gen mutasyonunda bazlar değişir; orak hücre anemisi buna örnektir. Kromozom mutasyonunda ise kromozomun bir parçası ya da kromozom sayısı değişir; Down sendromu buna örnektir. …
- `content/biyoloji.json` duyu-organlari › cards[13].key: **Noktalı virgülle bağlanmış iki cümle** « Sınavlarda sıcak için Ruffini, soğuk için Krause cisimcikleri sorulur; güncel bilgiye gör». İki ayrı cümle yaz.  
  > Dokunmayı Meissner, basıncı Pacini cisimcikleri algılar. Sınavlarda sıcak için Ruffini, soğuk için Krause cisimcikleri sorulur; güncel bilgiye göre ise sıcaklığı asıl serbest sinir uçları algılar.
- `content/biyoloji.json` duyu-organlari › cards[2].etk.noktalar[6].acik: **Noktalı virgülle bağlanmış iki cümle** « Sinirin çıktığı yerde reseptör yoktur; burası kör noktadır». İki ayrı cümle yaz.  
  > Görme siniri, retinadaki impulsları beyne taşır. Sinirin çıktığı yerde reseptör yoktur; burası kör noktadır.
- `content/biyoloji.json` duyu-organlari › cards[4].key: **Noktalı virgülle bağlanmış iki cümle** « Yaş ilerledikçe mercek esnekliğini yitirir ve yakını görmek zorlaşır; buna presbiyopi den». İki ayrı cümle yaz.  
  > Yakına bakarken kas kasılır ve bağlar gevşer. Yaş ilerledikçe mercek esnekliğini yitirir ve yakını görmek zorlaşır; buna presbiyopi denir.
- `content/biyoloji.json` duyu-organlari › cards[7].key: **Noktalı virgülle bağlanmış iki cümle** « Gözlük numarası diyoptriyle ölçülür; −2 D, odak uzaklığı 50 cm olan ıraksak bir mercektir». İki ayrı cümle yaz.  
  > Miyop gözde göz küresi uzun, hipermetrop gözde ise kısadır. Gözlük numarası diyoptriyle ölçülür; −2 D, odak uzaklığı 50 cm olan ıraksak bir mercektir.
- `content/biyoloji.json` duyu-organlari › cards[7].p: **Noktalı virgülle bağlanmış iki cümle** «Miyopide odak retinanın önüne düşer ve uzaktaki nesneler bulanık görünür; düzeltmek için k». İki ayrı cümle yaz.  
  > Miyopide odak retinanın önüne düşer ve uzaktaki nesneler bulanık görünür; düzeltmek için kalın kenarlı mercek kullanılır. Hipermetropide ise odak retinanın arkasına düşer ve yakındaki nesneler bulanık görünür; bunun için…
- `content/biyoloji.json` duyu-organlari › cards[7].p: **Noktalı virgülle bağlanmış iki cümle** « Hipermetropide ise odak retinanın arkasına düşer ve yakındaki nesneler bulanık görünür; b». İki ayrı cümle yaz.  
  > Miyopide odak retinanın önüne düşer ve uzaktaki nesneler bulanık görünür; düzeltmek için kalın kenarlı mercek kullanılır. Hipermetropide ise odak retinanın arkasına düşer ve yakındaki nesneler bulanık görünür; bunun için…
- `content/biyoloji.json` ekosistem › cards[10].key: **Noktalı virgülle bağlanmış iki cümle** «Fosil yakıtlar ve ormanların yok edilmesi sera gazlarını artırır; buzullar erir ve deniz s». İki ayrı cümle yaz.  
  > Fosil yakıtlar ve ormanların yok edilmesi sera gazlarını artırır; buzullar erir ve deniz seviyesi yükselir. Ozon incelmesi küresel ısınmanın nedeni değildir.
- `content/biyoloji.json` ekosistem › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** «Sera etkisi doğal bir olaydır; CO2, metan ve su buharı ısıyı tutar». İki ayrı cümle yaz.  
  > Sera etkisi doğal bir olaydır; CO2, metan ve su buharı ısıyı tutar. Bu gazlar artınca iklim değişikliği başlar. Ozon incelmesi ise ayrı bir sorundur; CFC gazları, UV ışınlarına karşı koruyan ozon tabakasını zayıflatır.
- `content/biyoloji.json` ekosistem › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** « Ozon incelmesi ise ayrı bir sorundur; CFC gazları, UV ışınlarına karşı koruyan ozon tabak». İki ayrı cümle yaz.  
  > Sera etkisi doğal bir olaydır; CO2, metan ve su buharı ısıyı tutar. Bu gazlar artınca iklim değişikliği başlar. Ozon incelmesi ise ayrı bir sorundur; CFC gazları, UV ışınlarına karşı koruyan ozon tabakasını zayıflatır.
- `content/biyoloji.json` ekosistem › cards[11].key: **Noktalı virgülle bağlanmış iki cümle** « Yeni yerlerinde doğal düşmanları olmadığı için hızla yayılırlar; Akdeniz'deki aslan balığ». İki ayrı cümle yaz.  
  > İstilacı türler de biyoçeşitliliği azaltır. Yeni yerlerinde doğal düşmanları olmadığı için hızla yayılırlar; Akdeniz'deki aslan balığı buna örnektir.
- `content/biyoloji.json` ekosistem › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « Bitki örtüsü yok olunca toprak su ve rüzgârla taşınır; buna erozyon denir». İki ayrı cümle yaz.  
  > Az önce gördüğün ötrofikasyonu, gübredeki azot ve fosfor başlatır. Bitki örtüsü yok olunca toprak su ve rüzgârla taşınır; buna erozyon denir. Habitat kaybı ve aşırı avlanma ise biyoçeşitliliği azaltır.
- `content/biyoloji.json` ekosistem › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** « Türkiye'deki bitki türlerinin yaklaşık üçte biri endemiktir; Kazdağı göknarı buna örnekti». İki ayrı cümle yaz.  
  > Doğal olarak yalnızca belirli bir bölgede yaşayan türlere endemik tür denir. Endemik bir tür o bölgede yok olursa dünyadan da silinir. Türkiye'deki bitki türlerinin yaklaşık üçte biri endemiktir; Kazdağı göknarı buna örn…
- `content/biyoloji.json` ekosistem › cards[14].key: **Noktalı virgülle bağlanmış iki cümle** «Doğru sıra önlemek, yeniden kullanmak ve geri dönüştürmektir; gömmek en son çaredir». İki ayrı cümle yaz.  
  > Doğru sıra önlemek, yeniden kullanmak ve geri dönüştürmektir; gömmek en son çaredir. Türkiye'deki Sıfır Atık projesi bu sırayı yaygınlaştırır.
- `content/biyoloji.json` ekosistem › cards[14].p: **Noktalı virgülle bağlanmış iki cümle** «Atık yönetimi, atığı önlemekle başlar; az tüketmek ve eşyaları yeniden kullanmak gerekir». İki ayrı cümle yaz.  
  > Atık yönetimi, atığı önlemekle başlar; az tüketmek ve eşyaları yeniden kullanmak gerekir. Kalan atık kaynağında ayrılır ve geri dönüşüme, komposta ya da pil kutusuna gider. Çöp sahası en son seçenektir.
- `content/biyoloji.json` ekosistem › cards[1].p: **Noktalı virgülle bağlanmış iki cümle** «Bir canlının yaşadığı yere habitat denir; habitat canlının adresi gibidir». İki ayrı cümle yaz.  
  > Bir canlının yaşadığı yere habitat denir; habitat canlının adresi gibidir. Ekolojik niş ise canlının ekosistemdeki rolüdür, yani mesleği gibidir. Canlının ne yediği, ne zaman beslendiği ve hangi kaynakları kullandığı niş…
- `content/biyoloji.json` ekosistem › cards[2].etk.ogeler[6][2]: **Noktalı virgülle bağlanmış iki cümle** «Akbaba leşçildir; ölü hayvanları yer, yani bir tüketicidir». İki ayrı cümle yaz.  
  > Akbaba leşçildir; ölü hayvanları yer, yani bir tüketicidir. Ölü artıkları minerallere kadar parçalayanlar ise ayrıştırıcılardır.
- `content/biyoloji.json` ekosistem › cards[4].key: **Noktalı virgülle bağlanmış iki cümle** « %10 bir ortalamadır; gerçek oran genellikle %5 ile %20 arasındadır». İki ayrı cümle yaz.  
  > Enerji akar, madde döner. %10 bir ortalamadır; gerçek oran genellikle %5 ile %20 arasındadır.
- `content/biyoloji.json` ekosistem › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Ancak birey sayısı piramidi ters olabilir; örneğin bir ağaçta binlerce tırtıl yaşar». İki ayrı cümle yaz.  
  > Az önce gezdiğin enerji piramidi her zaman düzdür. Ancak birey sayısı piramidi ters olabilir; örneğin bir ağaçta binlerce tırtıl yaşar. Biyokütle piramidi de okyanusta ters olabilir.
- `content/biyoloji.json` ekosistem › cards[8].key: **Noktalı virgülle bağlanmış iki cümle** «Ayrıştırıcılar ölü canlılardaki azotu amonyağa çevirir; buna amonifikasyon denir». İki ayrı cümle yaz.  
  > Ayrıştırıcılar ölü canlılardaki azotu amonyağa çevirir; buna amonifikasyon denir. Bitkiler azotu çoğunlukla nitrat olarak alır. Fosfor kayaçlardan toprağa, oradan da canlılara geçer.
- `content/biyoloji.json` ekosistem › quiz[0].e: **Noktalı virgülle bağlanmış iki cümle** « Bitki ölünce ayrıştırıcılar azotu yeniden amonyağa çevirir; buna amonifikasyon denir». İki ayrı cümle yaz.  
  > Bakteriler N₂'yi amonyağa bağlar, nitrifikasyon bakterileri de amonyağı nitrata çevirir. Bitki nitratı kökleriyle alır ve proteinlerine katar. Bitki ölünce ayrıştırıcılar azotu yeniden amonyağa çevirir; buna amonifikasyo…
- `content/biyoloji.json` endokrin › cards[11].key: **Noktalı virgülle bağlanmış iki cümle** « Tip 2 diyabette sorun insülinin yokluğu değil, insülin direncidir; fazla kilo bu riski ar». İki ayrı cümle yaz.  
  > Tip 1 diyabette bağışıklık sistemi β hücrelerini yıkar. Tip 2 diyabette sorun insülinin yokluğu değil, insülin direncidir; fazla kilo bu riski artırır.
- `content/biyoloji.json` endokrin › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** «İnsülin eksik ya da etkisiz olursa kan şekeri yükselir ve şeker idrara geçer; buna şeker h». İki ayrı cümle yaz.  
  > İnsülin eksik ya da etkisiz olursa kan şekeri yükselir ve şeker idrara geçer; buna şeker hastalığı denir. Tip 1 diyabette β hücreleri yıkılır. Tip 2 diyabette ise hücreler insüline yanıt vermez.
- `content/biyoloji.json` endokrin › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** «Sinir sistemi mesajı nöronlarla iletir; bu iletim hızlıdır, kısa sürer ve belirli bir hede». İki ayrı cümle yaz.  
  > Sinir sistemi mesajı nöronlarla iletir; bu iletim hızlıdır, kısa sürer ve belirli bir hedefe gider. Endokrin sistem ise mesajı kanla gönderir; bu iletim yavaştır, uzun sürer ve geniş bir alanı etkiler. İki sistemi hipota…
- `content/biyoloji.json` endokrin › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** « Endokrin sistem ise mesajı kanla gönderir; bu iletim yavaştır, uzun sürer ve geniş bir al». İki ayrı cümle yaz.  
  > Sinir sistemi mesajı nöronlarla iletir; bu iletim hızlıdır, kısa sürer ve belirli bir hedefe gider. Endokrin sistem ise mesajı kanla gönderir; bu iletim yavaştır, uzun sürer ve geniş bir alanı etkiler. İki sistemi hipota…
- `content/biyoloji.json` endokrin › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** « Buna negatif geri bildirim denir; ürün kendi üretimini frenler». İki ayrı cümle yaz.  
  > Hipotalamus TRH, hipofiz ise TSH salgılar ve TSH tiroidi uyarır. Kanda tiroksin artınca TRH ve TSH azalır. Buna negatif geri bildirim denir; ürün kendi üretimini frenler.
- `content/biyoloji.json` endokrin › cards[5].key: **Noktalı virgülle bağlanmış iki cümle** «Arka hipofiz hormon üretmez; hipotalamusun ürettiği hormonları depolar ve salgılar». İki ayrı cümle yaz.  
  > Arka hipofiz hormon üretmez; hipotalamusun ürettiği hormonları depolar ve salgılar. Oksitosin, emzirme sırasında sütün boşalmasını da sağlar.
- `content/biyoloji.json` endokrin › cards[7].p: **Noktalı virgülle bağlanmış iki cümle** « İyot yetersiz olursa bez büyür; buna guatr denir». İki ayrı cümle yaz.  
  > Tiroit, yapısında iyot bulunan tiroksin hormonunu salgılar ve tiroksin metabolizma hızını ayarlar. İyot yetersiz olursa bez büyür; buna guatr denir. İyotlu tuz kullanmak guatrı önler.
- `content/biyoloji.json` endokrin › cards[8].key: **Noktalı virgülle bağlanmış iki cümle** «Parathormon kandaki kalsiyumu artırır, kalsitonin ise azaltır; bu iki hormon zıt (antagoni». İki ayrı cümle yaz.  
  > Parathormon kandaki kalsiyumu artırır, kalsitonin ise azaltır; bu iki hormon zıt (antagonist) etkilidir. Parathormon, böbrekte kalsiyumun geri emilimini ve bağırsakta emilimini de artırır.
- `content/biyoloji.json` endokrin › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Artan kortizol zinciri frenler; buna negatif geri bildirim denir». İki ayrı cümle yaz.  
  > Bu zincir, TRH-TSH-tiroksin zinciriyle aynı mantıkta işler. Hipotalamus ön hipofizi, ACTH ise böbrek üstü kabuğunu uyarır. Artan kortizol zinciri frenler; buna negatif geri bildirim denir.
- `content/biyoloji.json` enzimler › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « • Hızı sıcaklık, pH, substrat ve enzim miktarı etkiler; aşırı sıcak ve uygunsuz pH enzimi». İki ayrı cümle yaz.  
  > • Enzimler aktivasyon enerjisini düşürerek tepkimeyi hızlandırır ve tekrar kullanılır. • Substrat aktif bölgeye özgül olarak bağlanır ve enzim-substrat kompleksi oluşur. • Hızı sıcaklık, pH, substrat ve enzim miktarı etk…
- `content/biyoloji.json` enzimler › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** «Her enzim genellikle yalnızca belirli bir substrata etki eder; buna özgüllük denir». İki ayrı cümle yaz.  
  > Her enzim genellikle yalnızca belirli bir substrata etki eder; buna özgüllük denir. Enzim adlarının çoğu, substratın adına -az eki getirilerek yapılır. Örneğin laktozu parçalayan enzimin adı laktazdır.
- `content/biyoloji.json` enzimler › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** «Enzim, optimum sıcaklıkta en hızlı çalışır; insanda bu sıcaklık yaklaşık 37 °C'dir». İki ayrı cümle yaz.  
  > Enzim, optimum sıcaklıkta en hızlı çalışır; insanda bu sıcaklık yaklaşık 37 °C'dir. Sıcaklık çok artarsa enzimin şekli bozulur. Buna denatürasyon denir ve çoğunlukla geri dönmez. Soğuk ise enzimi bozmaz, yalnızca yavaşla…
- `content/biyoloji.json` enzimler › cards[6].p: **Noktalı virgülle bağlanmış iki cümle** « Bütün aktif bölgeler dolunca hız daha fazla artmaz; buna doygunluk denir». İki ayrı cümle yaz.  
  > Enzim miktarı sabitken substrat arttıkça tepkime hızı da artar. Bütün aktif bölgeler dolunca hız daha fazla artmaz; buna doygunluk denir. Enzim eklemek hızı artırır. Substrat sabitse ürün miktarı değişmez, yalnızca daha …
- `content/biyoloji.json` enzimler › cards[7].once.secenekler[2].neden: **Noktalı virgülle bağlanmış iki cümle** «Selüloz bitki hücre duvarını yapar; insan selülozu sindiremez bile». İki ayrı cümle yaz.  
  > Selüloz bitki hücre duvarını yapar; insan selülozu sindiremez bile.
- `content/biyoloji.json` enzimler › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Örneğin Cl⁻ iyonu, nişastayı sindiren tükürük amilazını; mide asidi de pepsini çalıştırır». İki ayrı cümle yaz.  
  > Enzimin çalışmasını hızlandıran maddeye aktivatör denir. Örneğin Cl⁻ iyonu, nişastayı sindiren tükürük amilazını; mide asidi de pepsini çalıştırır. Tersinir tepkimelerde enzim iki yönü de hızlandırır, dengedeki oranı ise…
- `content/biyoloji.json` enzimler › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** «Enzim aktivasyon enerjisini düşürür; bu yüzden tepkime hızlanır ve denge daha çabuk kurulu». İki ayrı cümle yaz.  
  > Enzim aktivasyon enerjisini düşürür; bu yüzden tepkime hızlanır ve denge daha çabuk kurulur. Ürünün türünü, toplam ürün miktarını, enerji farkını ve dengedeki oranları ise değiştirmez.
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[0][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > İnsan kolu – yarasa kanadı
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[1][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Balina yüzgeci – at ön bacağı
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[2][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Bezelye sülüğü – kaktüs dikeni
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[3][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Kuş kanadı – kelebek kanadı
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[4][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Yarasa kanadı – sinek kanadı
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[5][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Ahtapot gözü – insan gözü
- `content/biyoloji.json` evrim › cards[13].etk.ogeler[6][0]: **Ara söz için orta çizgi ( – )** «–». Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.  
  > Gül dikeni – kaktüs dikeni
- `content/biyoloji.json` fotosentez › cards[11].key: **Noktalı virgülle bağlanmış iki cümle** «Stomalar kapanınca rubisko O₂ bağlamaya başlar; buna fotosolunum denir». İki ayrı cümle yaz.  
  > Stomalar kapanınca rubisko O₂ bağlamaya başlar; buna fotosolunum denir. C4 bitkilerinde CO₂, Calvin döngüsü yapan hücrelerde yoğunlaşır. CAM bitkilerinde ise gece depolanan CO₂ gündüz Calvin döngüsüne girer.
- `content/biyoloji.json` fotosentez › cards[1].key: **Noktalı virgülle bağlanmış iki cümle** « Siyanobakterilerde kloroplast yoktur; klorofil, hücrenin içindeki tilakoit zarlarında bul». İki ayrı cümle yaz.  
  > Granumun çoğulu granadır. Siyanobakterilerde kloroplast yoktur; klorofil, hücrenin içindeki tilakoit zarlarında bulunur.
- `content/biyoloji.json` fotosentez › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Işıkla uyarılan klorofil elektron kaybeder ve bu açığı suyun fotolizi kapatır; bu sırada ». İki ayrı cümle yaz.  
  > Işığa bağımlı tepkimeler tilakoit zarında olur. Işıkla uyarılan klorofil elektron kaybeder ve bu açığı suyun fotolizi kapatır; bu sırada O₂ açığa çıkar. Bu evrede ATP ve NADPH üretilir.
- `content/biyoloji.json` fotosentez › cards[7].key: **Noktalı virgülle bağlanmış iki cümle** « Döngü ışıktan bağımsızdır, ama ışığa muhtaçtır; karanlıkta ATP ve NADPH bitince durur». İki ayrı cümle yaz.  
  > Kalan PGAL glikoz yapımına gider. Bir glikoz için 6 CO₂, 18 ATP ve 12 NADPH harcanır. Döngü ışıktan bağımsızdır, ama ışığa muhtaçtır; karanlıkta ATP ve NADPH bitince durur.
- `content/biyoloji.json` fotosentez › cards[8].p: **Noktalı virgülle bağlanmış iki cümle** « Hız optimum sıcaklıkta en yüksektir; daha yüksek sıcaklıkta enzimler bozulur». İki ayrı cümle yaz.  
  > Işık şiddeti ve CO₂ miktarı arttıkça fotosentez hızı önce artar, sonra sabitlenir. Hız optimum sıcaklıkta en yüksektir; daha yüksek sıcaklıkta enzimler bozulur. Yeşil ışıkta ise hız düşüktür.
- `content/biyoloji.json` fotosentez › cards[9].key: **Noktalı virgülle bağlanmış iki cümle** «Mg ve N, klorofilin yapısında bulunur; eksikliklerinde yapraklar sararır». İki ayrı cümle yaz.  
  > Mg ve N, klorofilin yapısında bulunur; eksikliklerinde yapraklar sararır. Klorofil ve enzim miktarı, stoma sayısı ve yaprak yapısı da hızı etkileyen iç faktörlerdir.
- `content/biyoloji.json` fotosentez › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Kemosentezde ise enerji, inorganik maddelerin oksitlenmesinden gelir; nitrifikasyon bakte». İki ayrı cümle yaz.  
  > Fotosentezde enerji ışıktan gelir ve su ayrışır. Kemosentezde ise enerji, inorganik maddelerin oksitlenmesinden gelir; nitrifikasyon bakterileri buna örnektir. İkisinde de üretici canlı CO₂'den organik madde yapar.
- `content/biyoloji.json` hayvanlar-alemi › cards[0].p: **Noktalı virgülle bağlanmış iki cümle** «Hayvanlar ökaryot, çok hücreli ve heterotrof canlılardır; yani hazır besini yutarak alırla». İki ayrı cümle yaz.  
  > Hayvanlar ökaryot, çok hücreli ve heterotrof canlılardır; yani hazır besini yutarak alırlar. Hücrelerinde hücre duvarı yoktur. Çoğu hareket eder ve kas ile sinir dokuları sayesinde hızlı tepki verir.
- `content/biyoloji.json` hayvanlar-alemi › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** «Balık, iki yaşamlı ve sürüngenlerin vücut sıcaklığı ortamla birlikte değişir; bu hayvanlar». İki ayrı cümle yaz.  
  > Balık, iki yaşamlı ve sürüngenlerin vücut sıcaklığı ortamla birlikte değişir; bu hayvanlar soğukta yavaşlar. Kuşlar ve memeliler ise ısıyı metabolizmayla üretir ve tüy, kıl ya da yağ tabakasıyla korur. Bu yüzden vücut sı…
- `content/biyoloji.json` hayvanlar-alemi › cards[2].key: **Noktalı virgülle bağlanmış iki cümle** « Sölenterler iki tabakalıdır; dokunaçları ve yakıcı hücreleri vardır». İki ayrı cümle yaz.  
  > Süngerlerde doku yoktur ve vücut porludur. Sölenterler iki tabakalıdır; dokunaçları ve yakıcı hücreleri vardır.
- `content/biyoloji.json` hayvanlar-alemi › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** «Sürüngenlerin derisi kuru ve pulludur; bu da su kaybını azaltır». İki ayrı cümle yaz.  
  > Sürüngenlerin derisi kuru ve pulludur; bu da su kaybını azaltır. Sürüngenler akciğerle solur ve karaya kabuklu yumurta bırakır. Çoğunun kalbi üç odacıklıdır, ama timsahın kalbi dört odacıklıdır. Vücut sıcaklıkları ortama…
- `content/biyoloji.json` hayvanlar-alemi › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** « Penguen bir kuştur; yarasa, yunus ve gagalı memeli ise memelidir». İki ayrı cümle yaz.  
  > Vücut sıcaklığı yalnızca kuşlarda ve memelilerde sabittir. Penguen bir kuştur; yarasa, yunus ve gagalı memeli ise memelidir. Balık, iki yaşamlı ve sürüngenlerde vücut sıcaklığı değişkendir.
- `content/biyoloji.json` hucre-organeller › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** « Kesecik hücre zarıyla kaynaşıp salgıyı dışarı bırakır; buna ekzositoz denir». İki ayrı cümle yaz.  
  > Salgılanacak bir protein, bir üretim hattından geçer: ribozom ve granüllü ER, Golgi, kesecik ve son olarak hücre dışı. Kesecik hücre zarıyla kaynaşıp salgıyı dışarı bırakır; buna ekzositoz denir. Gereken enerjiyi mitokon…
- `content/biyoloji.json` hucre-organeller › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** «Hücre zarı hücreyi çevreler ve hangi maddelerin girip çıkacağını seçer; bu yüzden zara seç». İki ayrı cümle yaz.  
  > Hücre zarı hücreyi çevreler ve hangi maddelerin girip çıkacağını seçer; bu yüzden zara seçici geçirgen denir. Hücrenin içini dolduran jöle kıvamındaki sıvıya sitoplazma denir. Organeller ve birçok tepkime sitoplazmada bu…
- `content/biyoloji.json` hucre-organeller › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** « Granüllü ER'nin üzerinde ribozomlar bulunur; salgılanacak proteinleri üretir ve taşır». İki ayrı cümle yaz.  
  > Ribozom zarsız bir yapıdır ve protein üretir. Granüllü ER'nin üzerinde ribozomlar bulunur; salgılanacak proteinleri üretir ve taşır. Granülsüz ER ise lipit üretir ve karaciğerde zararlı maddeleri etkisiz hâle getirir.
- `content/biyoloji.json` hucresel-solunum › cards[13].p: **Noktalı virgülle bağlanmış iki cümle** «• ATP, ADP ve fosfata dönüşerek enerji verir; hücrenin enerji parasıdır». İki ayrı cümle yaz.  
  > • ATP, ADP ve fosfata dönüşerek enerji verir; hücrenin enerji parasıdır. • Glikoliz sitoplazmada, Krebs matrikste, ETS iç zarda olur. • Son elektron alıcısı O₂'dir ve toplam yaklaşık 30-32 ATP elde edilir. • Fermantasyon…
- `content/biyoloji.json` hucresel-solunum › cards[8].key: **Noktalı virgülle bağlanmış iki cümle** « Bazı kitaplar fermantasyona da "oksijensiz solunum" der; bazı bakterilerin oksijensiz sol». İki ayrı cümle yaz.  
  > Fermantasyon sitoplazmada olur. Bazı kitaplar fermantasyona da "oksijensiz solunum" der; bazı bakterilerin oksijensiz solunumunda ise ETS bulunur.
- `content/biyoloji.json` kalitim › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** «Y'ye bağlı genler babadan bütün oğullara geçer, kızlara geçmez; SRY geni buna örnektir». İki ayrı cümle yaz.  
  > Y'ye bağlı genler babadan bütün oğullara geçer, kızlara geçmez; SRY geni buna örnektir. Eşeyden etkilenen özelliklerin geni otozomlarda bulunur, ama etkisi hormonlara göre değişir.
- `content/biyoloji.json` kalitim › cards[11].p: **Noktalı virgülle bağlanmış iki cümle** «Aynı kromozomdaki genler genellikle birlikte aktarılır; bunlara bağlı genler denir». İki ayrı cümle yaz.  
  > Aynı kromozomdaki genler genellikle birlikte aktarılır; bunlara bağlı genler denir. AB/ab bireyi çoğunlukla AB ve ab gametleri yapar. Krossing-over olursa az sayıda Ab ve aB gameti de oluşur.
- `content/biyoloji.json` kalitim › cards[12].key: **Noktalı virgülle bağlanmış iki cümle** « Tek bir genin birçok özelliği etkilemesine ise pleiotropi denir; orak hücre aleli buna ör». İki ayrı cümle yaz.  
  > Etkili alel sayısı arttıkça özellik daha belirgin hâle gelir. Tek bir genin birçok özelliği etkilemesine ise pleiotropi denir; orak hücre aleli buna örnektir.
- `content/biyoloji.json` kalitim › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** «Boy ve deri rengi gibi özellikleri birçok gen birlikte belirler; buna çok genli kalıtım de». İki ayrı cümle yaz.  
  > Boy ve deri rengi gibi özellikleri birçok gen birlikte belirler; buna çok genli kalıtım denir. Çevrenin de etkisiyle kısadan uzuna kesintisiz bir dağılım oluşur. Çeşitliliğin kaynakları krossing-over, bağımsız dağılım, r…
- `content/biyoloji.json` kalitim › cards[13].key: **Noktalı virgülle bağlanmış iki cümle** «Kuzenler ortak bir atadan aynı çekinik aleli almış olabilir; albinizm ve kistik fibrozis b». İki ayrı cümle yaz.  
  > Kuzenler ortak bir atadan aynı çekinik aleli almış olabilir; albinizm ve kistik fibrozis buna örnektir. İki hasta ebeveynin sağlıklı bir çocuğu varsa ise özellik baskındır.
- `content/biyoloji.json` kalitim › cards[3].key: **Noktalı virgülle bağlanmış iki cümle** « Oranlar olasılıktır; 4 yavrudan tam 1'inin beyaz çıkması garanti değildir». İki ayrı cümle yaz.  
  > Punnett karesinde gametler satır ve sütunlara yazılıp birleştirilir. Oranlar olasılıktır; 4 yavrudan tam 1'inin beyaz çıkması garanti değildir.
- `content/biyoloji.json` kalitim › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** « Gamet oluşurken bir gen çiftinin alelleri birbirinden ayrılır; buna ayrılma yasası denir». İki ayrı cümle yaz.  
  > Ebeveynlere P, yavrulara F1, torunlara F2 denir. Gamet oluşurken bir gen çiftinin alelleri birbirinden ayrılır; buna ayrılma yasası denir. Punnett karesine göre Aa × Aa çaprazlamasında genotip oranı 1:2:1, fenotip oranı …
- `content/biyoloji.json` kalitim › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** «Farklı kromozomlardaki genler gametlere birbirinden bağımsız dağılır; buna bağımsız dağılı». İki ayrı cümle yaz.  
  > Farklı kromozomlardaki genler gametlere birbirinden bağımsız dağılır; buna bağımsız dağılım denir. AaBb bireyi dört çeşit gamet yapar: AB, Ab, aB ve ab. AaBb × AaBb çaprazlamasında fenotip oranı 9:3:3:1'dir.
- `content/biyoloji.json` kalitim › cards[6].key: **Noktalı virgülle bağlanmış iki cümle** «Pembe renk bir karışım değildir; F₂'de kırmızı ve beyaz yeniden ortaya çıkar». İki ayrı cümle yaz.  
  > Pembe renk bir karışım değildir; F₂'de kırmızı ve beyaz yeniden ortaya çıkar. AB grubundaki kişinin alyuvarlarında hem A hem B antijeni bulunur.
- `content/biyoloji.json` kalitim › cards[6].p: **Noktalı virgülle bağlanmış iki cümle** «Az önce gördüğün eksik baskınlıkta heterozigot birey ara bir fenotip gösterir; örneğin KB ». İki ayrı cümle yaz.  
  > Az önce gördüğün eksik baskınlıkta heterozigot birey ara bir fenotip gösterir; örneğin KB aslanağzı pembe açar. Eş baskınlıkta ise iki alelin etkisi de tam olarak görülür. Örneğin IAIB genotipli kişinin kan grubu AB'dir.
- `content/biyoloji.json` kalitim › cards[7].p: **Noktalı virgülle bağlanmış iki cümle** «Bir lokusta ikiden fazla alel bulunabilir; buna çok alellilik denir». İki ayrı cümle yaz.  
  > Bir lokusta ikiden fazla alel bulunabilir; buna çok alellilik denir. ABO kan grubu sisteminde üç alel vardır, ama her insan bunlardan yalnızca ikisini taşır. Rh sisteminde ise D aleli (Rh+) baskındır.
- `content/biyoloji.json` kalitim › cards[8].p: **Noktalı virgülle bağlanmış iki cümle** «İnsanda 44 otozom ve 2 eşey kromozomu bulunur; kadın XX, erkek ise XY'dir». İki ayrı cümle yaz.  
  > İnsanda 44 otozom ve 2 eşey kromozomu bulunur; kadın XX, erkek ise XY'dir. Yumurtaların hepsi X kromozomu taşır. Spermlerin ise yarısı X, yarısı Y taşır. Bu yüzden cinsiyeti sperm belirler.
- `content/biyoloji.json` kalitim › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** « AB için iki I aleli, 0 için iki i aleli gerekir; ikisi de mümkün değildir». İki ayrı cümle yaz.  
  > Anne IA ya da IB, baba ise yalnızca i verir. Bu yüzden çocuklar ½ olasılıkla IAi (A), ½ olasılıkla IBi (B) olur. AB için iki I aleli, 0 için iki i aleli gerekir; ikisi de mümkün değildir.
- `content/biyoloji.json` madde-gecisi › cards[0].p: **Noktalı virgülle bağlanmış iki cümle** « Zarın parçaları yana doğru kayabilir; bu yüzden zar akıcıdır». İki ayrı cümle yaz.  
  > Hücre zarı, çift sıra fosfolipitten oluşur ve aralarında proteinler ile karbonhidratlar bulunur. Zarın parçaları yana doğru kayabilir; bu yüzden zar akıcıdır. Farklı parçalar yan yana dizildiği için de mozaik yapıdadır.
- `content/biyoloji.json` madde-gecisi › cards[4].key: **Noktalı virgülle bağlanmış iki cümle** «Su zardan iki yöne de geçer; osmoz, net akışın yönünü gösterir». İki ayrı cümle yaz.  
  > Su zardan iki yöne de geçer; osmoz, net akışın yönünü gösterir. Suyun çoğu akuaporin adı verilen kanallardan geçer.
- `content/biyoloji.json` madde-gecisi › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Alyuvar (kırmızı kan hücresi) şişer ve patlayabilir; buna hemoliz denir». İki ayrı cümle yaz.  
  > Hipotonik ortamda su hücreye girer. Alyuvar (kırmızı kan hücresi) şişer ve patlayabilir; buna hemoliz denir. İzotonik ortamda net su geçişi olmaz. Hipertonik ortamda ise su hücreden çıkar ve alyuvar büzüşür.
- `content/biyoloji.json` madde-gecisi › cards[6].p: **Noktalı virgülle bağlanmış iki cümle** «Hipotonik ortamdaki bitki hücresi su alır ve hücre duvarına bastırır; buna turgor denir». İki ayrı cümle yaz.  
  > Hipotonik ortamdaki bitki hücresi su alır ve hücre duvarına bastırır; buna turgor denir. Hipertonik ortamda ise su kaybeder ve zarı duvardan ayrılır; buna plazmoliz denir. Hücrenin saf suda eski hâline dönmesine deplazmo…
- `content/biyoloji.json` madde-gecisi › cards[6].p: **Noktalı virgülle bağlanmış iki cümle** « Hipertonik ortamda ise su kaybeder ve zarı duvardan ayrılır; buna plazmoliz denir». İki ayrı cümle yaz.  
  > Hipotonik ortamdaki bitki hücresi su alır ve hücre duvarına bastırır; buna turgor denir. Hipertonik ortamda ise su kaybeder ve zarı duvardan ayrılır; buna plazmoliz denir. Hücrenin saf suda eski hâline dönmesine deplazmo…
- `content/biyoloji.json` madde-gecisi › cards[9].p: **Noktalı virgülle bağlanmış iki cümle** « Maddelerin içeri alınmasına endositoz denir; katı alımı fagositoz, sıvı alımı pinositozdu». İki ayrı cümle yaz.  
  > Büyük maddeler, zarın oluşturduğu keseciklerle ve ATP harcanarak taşınır. Maddelerin içeri alınmasına endositoz denir; katı alımı fagositoz, sıvı alımı pinositozdur. Maddelerin dışarı atılmasına ise ekzositoz denir.
- `content/biyoloji.json` madde-gecisi › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Hücre saf suya konursa olay tersine döner; buna deplazmoliz denir». İki ayrı cümle yaz.  
  > Dış ortam daha derişik olunca su hücreden çıkar, koful küçülür ve turgor kaybolur. Sonunda zar duvardan ayrılır. Hücre saf suya konursa olay tersine döner; buna deplazmoliz denir.
- `content/biyoloji.json` mayoz › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** «Erkekte bir ana hücreden dört eşit hücre, yani dört sperm oluşur; buna spermatogenez denir». İki ayrı cümle yaz.  
  > Erkekte bir ana hücreden dört eşit hücre, yani dört sperm oluşur; buna spermatogenez denir. Dişide ise sitoplazma eşit bölünmez. Bir büyük yumurta ve küçük kutup hücreleri oluşur; buna oogenez denir.
- `content/biyoloji.json` mayoz › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** « Bir büyük yumurta ve küçük kutup hücreleri oluşur; buna oogenez denir». İki ayrı cümle yaz.  
  > Erkekte bir ana hücreden dört eşit hücre, yani dört sperm oluşur; buna spermatogenez denir. Dişide ise sitoplazma eşit bölünmez. Bir büyük yumurta ve küçük kutup hücreleri oluşur; buna oogenez denir.
- `content/biyoloji.json` mayoz › cards[1].key: **Noktalı virgülle bağlanmış iki cümle** «Homologlar aynı genin farklı alellerini taşıyabilir; erkekteki X ve Y bunun istisnasıdır». İki ayrı cümle yaz.  
  > Homologlar aynı genin farklı alellerini taşıyabilir; erkekteki X ve Y bunun istisnasıdır. Homologlar anne ve baba kopyalarıdır, kardeş kromatitler ise aynı kromozomun eşlenmiş kopyalarıdır.
- `content/biyoloji.json` mayoz › cards[1].p: **Noktalı virgülle bağlanmış iki cümle** «Diploit bir hücrede her kromozomun bir eşi vardır; biri anneden, diğeri babadan gelir». İki ayrı cümle yaz.  
  > Diploit bir hücrede her kromozomun bir eşi vardır; biri anneden, diğeri babadan gelir. Bu eşlere homolog kromozom denir. Homologların boyu, şekli ve gen sıraları aynıdır. İnsanda 23 homolog çift bulunur.
- `content/biyoloji.json` mayoz › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** « Profaz I'de homolog kromozomlar boydan boya yan yana gelir; buna sinapsis denir». İki ayrı cümle yaz.  
  > Mayozdan önce DNA bir kez eşlenir. Profaz I'de homolog kromozomlar boydan boya yan yana gelir; buna sinapsis denir. Dört kromatitten oluşan bu yapıya tetrat denir. Mitozda tetrat oluşmaz.
- `content/biyoloji.json` mayoz › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** «Tetratta homologların kardeş olmayan kromatitleri birbirinin üzerinden çaprazlaşır; bu nok». İki ayrı cümle yaz.  
  > Tetratta homologların kardeş olmayan kromatitleri birbirinin üzerinden çaprazlaşır; bu noktaya kiazma denir. Kromatitler burada parça değiştirir ve buna krossing-over denir. Böylece anne ve baba genlerini birlikte taşıya…
- `content/biyoloji.json` mayoz › cards[8].p: **Noktalı virgülle bağlanmış iki cümle** « İkincisi, metafaz I'de homologların bağımsız dağılımıdır; bu yolla 2n çeşit gamet oluşur ». İki ayrı cümle yaz.  
  > Çeşitliliğin üç kaynağı vardır. Birincisi krossing-overdır. İkincisi, metafaz I'de homologların bağımsız dağılımıdır; bu yolla 2n çeşit gamet oluşur ve insanda bu sayı yaklaşık 8,4 milyondur. Üçüncüsü ise döllenmede game…
- `content/biyoloji.json` mitoz › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** « Kopan parça tam bir bireye dönüşürse bu bir üremedir; planaryada olduğu gibi». İki ayrı cümle yaz.  
  > Kopan bir kısmın yenilenmesine rejenerasyon denir. Kopan parça tam bir bireye dönüşürse bu bir üremedir; planaryada olduğu gibi. Partenogenezde ise döllenmemiş bir yumurta gelişir. Erkek bal arıları (n) bu yolla oluşur.
- `content/biyoloji.json` mitoz › cards[5].key: **Noktalı virgülle bağlanmış iki cümle** «Bitkide hücre duvarı boğumlanmaya izin vermez; bu yüzden plak Golgi keseciklerinden kurulu». İki ayrı cümle yaz.  
  > Bitkide hücre duvarı boğumlanmaya izin vermez; bu yüzden plak Golgi keseciklerinden kurulur. Mitoz çekirdeği, sitokinez ise sitoplazmayı böler.
- `content/biyoloji.json` mitoz › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « Ardından sitoplazma bölünür; buna sitokinez denir». İki ayrı cümle yaz.  
  > Telofazda kromozomlar gevşer ve çekirdek zarı yeniden oluşur. Ardından sitoplazma bölünür; buna sitokinez denir. Hayvan hücresi ortadan boğumlanarak bölünür. Bitki hücresinde ise ortada bir hücre plağı kurulur.
- `content/biyoloji.json` mitoz › cards[6].key: **Noktalı virgülle bağlanmış iki cümle** « Mitoz kromozom sayısını korur; 2n bir hücreden iki tane 2n hücre oluşur». İki ayrı cümle yaz.  
  > Telofazda her yeni çekirdekte 4 kromozom bulunur. Mitoz kromozom sayısını korur; 2n bir hücreden iki tane 2n hücre oluşur.
- `content/biyoloji.json` mitoz › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Erkek bal arısı ise döllenmemiş yumurtadan gelişir; buna partenogenez denir». İki ayrı cümle yaz.  
  > Amip mitozla bölünür, maya tomurcuklanır, ekmek küfü ise spor kesesinde spor üretir. Kesilen planarya parçası rejenerasyonla tam bir bireye dönüşür. Erkek bal arısı ise döllenmemiş yumurtadan gelişir; buna partenogenez d…
- `content/biyoloji.json` protein-sentezi › cards[0].p: **Noktalı virgülle bağlanmış iki cümle** « Bu bilgi önce RNA'ya kopyalanır; buna transkripsiyon denir». İki ayrı cümle yaz.  
  > Bir proteinin yapım bilgisini taşıyan DNA bölgesine gen denir. Bu bilgi önce RNA'ya kopyalanır; buna transkripsiyon denir. Sonra amino asit diline çevrilir; buna da translasyon denir.
- `content/biyoloji.json` protein-sentezi › cards[0].p: **Noktalı virgülle bağlanmış iki cümle** « Sonra amino asit diline çevrilir; buna da translasyon denir». İki ayrı cümle yaz.  
  > Bir proteinin yapım bilgisini taşıyan DNA bölgesine gen denir. Bu bilgi önce RNA'ya kopyalanır; buna transkripsiyon denir. Sonra amino asit diline çevrilir; buna da translasyon denir.
- `content/biyoloji.json` protein-sentezi › cards[10].p: **Noktalı virgülle bağlanmış iki cümle** «Bir mRNA'yı aynı anda birçok ribozom okuyabilir; buna poliribozom denir». İki ayrı cümle yaz.  
  > Bir mRNA'yı aynı anda birçok ribozom okuyabilir; buna poliribozom denir. Sitoplazmada kalacak proteinleri serbest ribozomlar yapar. Salgılanacak proteinleri ise granüllü ER üzerindeki ribozomlar yapar.
- `content/biyoloji.json` protein-sentezi › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** « Yanlış anlamlı mutasyonda amino asit değişir; orak hücre anemisi buna örnektir». İki ayrı cümle yaz.  
  > DNA'da tek bir baz değişirse nokta mutasyonu olur. Sessiz mutasyonda amino asit aynı kalır. Yanlış anlamlı mutasyonda amino asit değişir; orak hücre anemisi buna örnektir. Anlamsız mutasyonda ise bir dur kodonu oluşur.
- `content/biyoloji.json` protein-sentezi › cards[2].p: **Noktalı virgülle bağlanmış iki cümle** « Prokaryotlarda ise çekirdek yoktur; bu yüzden transkripsiyon ve translasyon aynı anda yür». İki ayrı cümle yaz.  
  > Ökaryotlarda transkripsiyon çekirdekte olur. Bu sırada intronlar kesilip çıkarılır, ekzonlar birleştirilir ve mRNA sitoplazmaya geçer. Prokaryotlarda ise çekirdek yoktur; bu yüzden transkripsiyon ve translasyon aynı anda…
- `content/biyoloji.json` protein-sentezi › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** «Bir amino asidi birden fazla kodon şifreleyebilir; bu yüzden genetik kod dejeneredir». İki ayrı cümle yaz.  
  > Bir amino asidi birden fazla kodon şifreleyebilir; bu yüzden genetik kod dejeneredir. Ancak bir kodon her zaman tek bir amino asidi belirtir. Kod neredeyse bütün canlılarda aynıdır, yani evrenseldir.
- `content/biyoloji.json` protein-sentezi › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « UGA dur kodonu olduğu için protein kısa kalır; bu bir anlamsız mutasyondur». İki ayrı cümle yaz.  
  > Aynı amino asit gelirse mutasyon sessizdir, başka bir amino asit gelirse yanlış anlamlıdır. UGA dur kodonu olduğu için protein kısa kalır; bu bir anlamsız mutasyondur. Bir nükleotit silinince sonraki bütün kodonlar değiş…
- `content/biyoloji.json` protein-sentezi › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** « Bir nükleotit silinince sonraki bütün kodonlar değişir; buna çerçeve kayması denir». İki ayrı cümle yaz.  
  > Aynı amino asit gelirse mutasyon sessizdir, başka bir amino asit gelirse yanlış anlamlıdır. UGA dur kodonu olduğu için protein kısa kalır; bu bir anlamsız mutasyondur. Bir nükleotit silinince sonraki bütün kodonlar değiş…
- `content/biyoloji.json` protein-sentezi › quiz[3].y[2]: **Noktalı virgülle bağlanmış iki cümle** « mRNA kalıba tamamlayıcıdır; T'nin karşısına A, A'nın karşısına U, G'nin karşısına C gelir». İki ayrı cümle yaz.  
  > Kalıp ipliğin aynısını yazdın. mRNA kalıba tamamlayıcıdır; T'nin karşısına A, A'nın karşısına U, G'nin karşısına C gelir.
- `content/biyoloji.json` siniflandirma › cards[0].once.secenekler[0].neden: **Noktalı virgülle bağlanmış iki cümle** « Bu kadar türü tek tek ezberlemek imkânsızdır; bu yüzden canlıları gruplarız». İki ayrı cümle yaz.  
  > Her yıl yeni türler de bulunur. Bu kadar türü tek tek ezberlemek imkânsızdır; bu yüzden canlıları gruplarız.
- `content/biyoloji.json` siniflandirma › cards[1].p: **Noktalı virgülle bağlanmış iki cümle** «Yapay sınıflandırma görünüşe bakar; bu yüzden yarasa ile kartalı "uçanlar" grubuna koyar». İki ayrı cümle yaz.  
  > Yapay sınıflandırma görünüşe bakar; bu yüzden yarasa ile kartalı "uçanlar" grubuna koyar. Doğal sınıflandırma ise akrabalığa bakar ve homolog organları, embriyoyu ve DNA'yı karşılaştırır. Bu sınıflandırmaya göre yarasa b…
- `content/biyoloji.json` siniflandirma › cards[8].p: **Noktalı virgülle bağlanmış iki cümle** « Mantarların kitin duvarı vardır; besini dışarıda sindirip emerler». İki ayrı cümle yaz.  
  > Bitki, mantar ya da hayvan olmayan ökaryotlara protist denir. Bitkilerin selüloz duvarı vardır ve fotosentez yaparlar. Mantarların kitin duvarı vardır; besini dışarıda sindirip emerler. Hayvanlarda ise hücre duvarı yoktu…
- `content/biyoloji.json` siniflandirma › quiz[1].e: **Noktalı virgülle bağlanmış iki cümle** « Amip, öglena, terliksi hayvan ve plazmodyum tek hücreli ökaryot protistlerdir; terliksini». İki ayrı cümle yaz.  
  > Siyanobakteri, fotosentez yapan bir bakteridir. Amip, öglena, terliksi hayvan ve plazmodyum tek hücreli ökaryot protistlerdir; terliksinin adında "hayvan" geçse de o bir protisttir. Maya, küf ve şapkalı mantar ise mantar…
- `content/biyoloji.json` sinir-sistemi › cards[2].key: **Noktalı virgülle bağlanmış iki cümle** « Sonuçta dışarıda Na⁺, içeride K⁺ fazla olur; bu duruma polarizasyon denir». İki ayrı cümle yaz.  
  > Zar K⁺ iyonlarını daha kolay geçirir ve K⁺ dışarı sızar. Sonuçta dışarıda Na⁺, içeride K⁺ fazla olur; bu duruma polarizasyon denir.
- `content/biyoloji.json` sinir-sistemi › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** «Uyarı eşik değeri aşınca Na⁺ iyonları hücreye girer ve zarın içi artı yüklü olur; buna dep». İki ayrı cümle yaz.  
  > Uyarı eşik değeri aşınca Na⁺ iyonları hücreye girer ve zarın içi artı yüklü olur; buna depolarizasyon denir. Sonra K⁺ iyonları dışarı çıkar ve iç taraf yeniden eksi olur; buna da repolarizasyon denir. Bu iyon akışları AT…
- `content/biyoloji.json` sinir-sistemi › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** « Sonra K⁺ iyonları dışarı çıkar ve iç taraf yeniden eksi olur; buna da repolarizasyon deni». İki ayrı cümle yaz.  
  > Uyarı eşik değeri aşınca Na⁺ iyonları hücreye girer ve zarın içi artı yüklü olur; buna depolarizasyon denir. Sonra K⁺ iyonları dışarı çıkar ve iç taraf yeniden eksi olur; buna da repolarizasyon denir. Bu iyon akışları AT…
- `content/biyoloji.json` sinir-sistemi › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « İmpuls boğumdan boğuma sıçrar; böylece iletim hızlanır ve daha az enerji harcanır». İki ayrı cümle yaz.  
  > Miyelin yalıtkan olduğu için iyon akışı yalnızca Ranvier boğumlarında olur. İmpuls boğumdan boğuma sıçrar; böylece iletim hızlanır ve daha az enerji harcanır. Kalın aksonlarda da iletim hızlıdır.
- `content/biyoloji.json` sinir-sistemi › quiz[2].e: **Noktalı virgülle bağlanmış iki cümle** «Merkezi sinir sistemi beyin ve omurilikten oluşur; beyin de uç beyin, beyincik ve beyin sa». İki ayrı cümle yaz.  
  > Merkezi sinir sistemi beyin ve omurilikten oluşur; beyin de uç beyin, beyincik ve beyin sapını içerir. Bunların dışındaki sinirler çevresel sinir sistemini oluşturur. Çevresel sistem somatik bölümden ve otonom bölümün se…
- `content/biyoloji.json` sinir-sistemi › summary: **Noktalı virgülle bağlanmış iki cümle** «Nöron, impuls ve sinaps; beyin, omurilik ve otonom sinir sistemi». İki ayrı cümle yaz.  
  > Nöron, impuls ve sinaps; beyin, omurilik ve otonom sinir sistemi
- `content/biyoloji.json` solunum › cards[10].once.soru: **Noktalı virgülle bağlanmış iki cümle** «Kapalı odada kötü yanan bir soba var; herkesin başı ağrıyor». İki ayrı cümle yaz.  
  > Kapalı odada kötü yanan bir soba var; herkesin başı ağrıyor. İlk ne yapılmalı?
- `content/biyoloji.json` solunum › quiz[3].q: **Noktalı virgülle bağlanmış iki cümle** «Bir kılcalın girişinde PO2 = 100, PCO2 = 40 mmHg; çıkışında PO2 = 40, PCO2 = 45 mmHg ölçül». İki ayrı cümle yaz.  
  > Bir kılcalın girişinde PO2 = 100, PCO2 = 40 mmHg; çıkışında PO2 = 40, PCO2 = 45 mmHg ölçülüyor. Bu kılcal büyük olasılıkla nerededir?
- `content/fizik.json` basinc › cards[3].p: **Noktalı virgülle bağlanmış iki cümle** « Yukarı doğru genişleyen kapta F &lt; G, daralan kapta ise F &gt». İki ayrı cümle yaz.  
  > Tabana etki eden kuvvet F = P·A'dır ve sıvının ağırlığına eşit olmayabilir. Düz kapta F = G olur. Yukarı doğru genişleyen kapta F &lt; G, daralan kapta ise F &gt; G olur.
- `content/fizik.json` basinc › cards[4].once.soru: **Noktalı virgülle bağlanmış iki cümle** «U şeklindeki bir boruya su döküyorsun; bir kolu ince, öbürü kalın». İki ayrı cümle yaz.  
  > U şeklindeki bir boruya su döküyorsun; bir kolu ince, öbürü kalın. Su durgunken yüzeyler nasıl olur?
- `content/fizik.json` basinc › cards[8].once.soru: **Noktalı virgülle bağlanmış iki cümle** «Kapalı bir kaptaki gazı ısıtıyorsun; hacim değişmiyor». İki ayrı cümle yaz.  
  > Kapalı bir kaptaki gazı ısıtıyorsun; hacim değişmiyor. Gazın basıncı ne olur?
- `content/fizik.json` dalga-optigi › cards[1].key: **Şişirme: ...nın kanıtıdır** «kanıtıdır». '...-dığını gösterir'.  
  > Newton ışığı tanecik akımı, Huygens dalga sanmıştı. Çift yarık deseni ışığın dalga doğasının en güçlü kanıtıdır.
- `content/fizik.json` dalgalar › quiz[1].o[0]: **Noktalı virgülle bağlanmış iki cümle** «Frekans aynı kalır; hız ve dalga boyu artar». İki ayrı cümle yaz.  
  > Frekans aynı kalır; hız ve dalga boyu artar
- `content/fizik.json` dalgalar › quiz[1].o[1]: **Noktalı virgülle bağlanmış iki cümle** «Frekans aynı kalır; hız ve dalga boyu azalır». İki ayrı cümle yaz.  
  > Frekans aynı kalır; hız ve dalga boyu azalır
- `content/fizik.json` dalgalar › quiz[1].o[2]: **Noktalı virgülle bağlanmış iki cümle** «Frekans artar; hız ve dalga boyu aynı kalır». İki ayrı cümle yaz.  
  > Frekans artar; hız ve dalga boyu aynı kalır
- `content/fizik.json` deprem › cards[5].etk.soru: **Noktalı virgülle bağlanmış iki cümle** «P ve S'nin hızını ve aradaki süreyi değiştir; uzaklık nasıl değişiyor». İki ayrı cümle yaz.  
  > P ve S'nin hızını ve aradaki süreyi değiştir; uzaklık nasıl değişiyor?
- `content/fizik.json` elektriksel-enerji › cards[9].once.soru: **Noktalı virgülle bağlanmış iki cümle** «Salondaki lambayı kapatıyorsun; buzdolabı çalışmaya devam ediyor». İki ayrı cümle yaz.  
  > Salondaki lambayı kapatıyorsun; buzdolabı çalışmaya devam ediyor. Neden?
- `content/fizik.json` elektriksel-enerji › quiz[3].q: **Noktalı virgülle bağlanmış iki cümle** «Özdeş K ve L ampulleri birbirine paralel bağlı; bu ikili, özdeş M ampulüyle seri bağlanıp ». İki ayrı cümle yaz.  
  > Özdeş K ve L ampulleri birbirine paralel bağlı; bu ikili, özdeş M ampulüyle seri bağlanıp ideal bir üretece takılıyor. Parlaklık sıralaması nedir?
- `content/fizik.json` elektrostatik › cards[1].etk.ogeler[8][2]: **Noktalı virgülle bağlanmış iki cümle** «Kuru tahta yükü taşımaz; ıslanınca iletkenleşir». İki ayrı cümle yaz.  
  > Kuru tahta yükü taşımaz; ıslanınca iletkenleşir.
- `content/fizik.json` elektrostatik › cards[7].etk.soru: **Noktalı virgülle bağlanmış iki cümle** « 0 itme, F &lt; 0 çekme demek». İki ayrı cümle yaz.  
  > Yükleri ve uzaklığı değiştir. F &gt; 0 itme, F &lt; 0 çekme demek. Uzaklık 2 katına çıkınca ne olur?
- `content/fizik.json` fizik-bilimine-giris › cards[11].key: **Noktalı virgülle bağlanmış iki cümle** «Fizik okumak; ölçmeyi, model kurmayı ve problem çözmeyi öğrenmek demektir». İki ayrı cümle yaz.  
  > Fizik okumak; ölçmeyi, model kurmayı ve problem çözmeyi öğrenmek demektir.
- `content/fizik.json` fizik-bilimine-giris › cards[8].etk.ogeler[3][2]: **Noktalı virgülle bağlanmış iki cümle** «Enerjinin yönü yoktur; sayı ve birim yeter». İki ayrı cümle yaz.  
  > Enerjinin yönü yoktur; sayı ve birim yeter.
- `content/fizik.json` fizik-bilimine-giris › cards[8].etk.ogeler[4][2]: **Noktalı virgülle bağlanmış iki cümle** «Sürat yalnızca büyüklüktür; yönlü olanı hızdır». İki ayrı cümle yaz.  
  > Sürat yalnızca büyüklüktür; yönlü olanı hızdır.
- `content/fizik.json` iki-boyutta-hareket › cards[5].etk.soru: **Noktalı virgülle bağlanmış iki cümle** « 30° ile 60°'yi karşılaştır; en uzun menzil hangi açıda». İki ayrı cümle yaz.  
  > Hızı ve açıyı değiştir. 30° ile 60°'yi karşılaştır; en uzun menzil hangi açıda?
- `content/fizik.json` induksiyon-ac › quiz[3].o[0]: **Noktalı virgülle bağlanmış iki cümle** «Saat yönünde; halkanın üst yüzü S olur». İki ayrı cümle yaz.  
  > Saat yönünde; halkanın üst yüzü S olur
- `content/fizik.json` induksiyon-ac › quiz[3].o[1]: **Noktalı virgülle bağlanmış iki cümle** «Saat yönünün tersine; halkanın üst yüzü N olur». İki ayrı cümle yaz.  
  > Saat yönünün tersine; halkanın üst yüzü N olur
- `content/fizik.json` induksiyon-ac › quiz[3].o[2]: **Noktalı virgülle bağlanmış iki cümle** «Saat yönünde; halkanın üst yüzü N olur». İki ayrı cümle yaz.  
  > Saat yönünde; halkanın üst yüzü N olur
- `content/fizik.json` isi-sicaklik › cards[4].etk.soru: **Noktalı virgülle bağlanmış iki cümle** « Isı kaybı yok; ikisi de su olduğu için c aynı». İki ayrı cümle yaz.  
  > Sıcak suyu 20 °C'deki suyla karıştır. Isı kaybı yok; ikisi de su olduğu için c aynı.
- `content/fizik.json` isi-sicaklik › cards[7].once.soru: **Noktalı virgülle bağlanmış iki cümle** « Su 0 °C'ye inerken 4000 cal verir; buzun hepsini eritmek 8000 cal ister». İki ayrı cümle yaz.  
  > 0 °C'de 100 g buzu 20 °C'de 200 g suya atıyorsun. Su 0 °C'ye inerken 4000 cal verir; buzun hepsini eritmek 8000 cal ister. Sonunda ne olur?
- `content/fizik.json` kaldirma-kuvveti › cards[4].p: **Noktalı virgülle bağlanmış iki cümle** « Bu durumda Fk &lt; G olur ve farkı taban taşır». İki ayrı cümle yaz.  
  > dcisim &lt; dsıvı ise cisim yüzer, eşitse askıda kalır. İki durumda da Fk = G olur. Cismin özkütlesi büyükse cisim batar. Bu durumda Fk &lt; G olur ve farkı taban taşır.
- `content/fizik.json` madde-ozellikleri › cards[2].etk.soru: **Noktalı virgülle bağlanmış iki cümle** «Kütleyi ve hacmi değiştir; özkütle nasıl değişiyor». İki ayrı cümle yaz.  
  > Kütleyi ve hacmi değiştir; özkütle nasıl değişiyor? Suyun özkütlesi 1 g/cm³.
- `content/fizik.json` manyetizma › cards[5].etk.ogeler[5][2]: **Noktalı virgülle bağlanmış iki cümle** «Bakır diyamanyetiktir; mıknatısa yapışmaz». İki ayrı cümle yaz.  
  > Bakır diyamanyetiktir; mıknatısa yapışmaz.
- `content/fizik.json` manyetizma › cards[7].once.soru: **Noktalı virgülle bağlanmış iki cümle** «Bobinin sarım sayısını iki katına çıkarıyorsun; akım ve boy aynı». İki ayrı cümle yaz.  
  > Bobinin sarım sayısını iki katına çıkarıyorsun; akım ve boy aynı. İçindeki alan ne olur?
- `content/fizik.json` newton-yasalari › cards[11].once.soru: **Noktalı virgülle bağlanmış iki cümle** «2 kg ve 3 kg'lık iki kutu iple bağlı; sürtünmesiz zeminde 10 N ile çekiliyor». İki ayrı cümle yaz.  
  > 2 kg ve 3 kg'lık iki kutu iple bağlı; sürtünmesiz zeminde 10 N ile çekiliyor. İvme kaç m/s²?
- `content/fizik.json` optik › cards[10].etk.soru: **Noktalı virgülle bağlanmış iki cümle** « Cismi yaklaştırıp uzaklaştır; görüntü nerede». İki ayrı cümle yaz.  
  > Çukur ayna ya da yakınsak mercek (f &gt; 0). Cismi yaklaştırıp uzaklaştır; görüntü nerede?
- `content/fizik.json` tork-denge › quiz[2].q: **Noktalı virgülle bağlanmış iki cümle** «Menteşeli bir çubuğa kuvvet uygulanıyor; r, menteşeden uygulama noktasına uzaklıktır». İki ayrı cümle yaz.  
  > Menteşeli bir çubuğa kuvvet uygulanıyor; r, menteşeden uygulama noktasına uzaklıktır. Torkları küçükten büyüğe sırala.
- `content/fizik.json` yari-iletkenler › cards[4].etk.ogeler[3][2]: **Noktalı virgülle bağlanmış iki cümle** «Gerilim büyük olsa da yön ters; diyot iletmez». İki ayrı cümle yaz.  
  > Gerilim büyük olsa da yön ters; diyot iletmez.
- `content/kimya.json` asit-baz › cards[1].etk.ogeler[3][2]: **Noktalı virgülle bağlanmış iki cümle** «Sirkedeki asetik asittir; suda H⁺ verir (zayıf asit)». İki ayrı cümle yaz.  
  > Sirkedeki asetik asittir; suda H⁺ verir (zayıf asit).
- `content/kimya.json` elektrokimya › cards[5].once.soru: **Noktalı virgülle bağlanmış iki cümle** «Bir kapta 0,01 M, ötekinde 1 M Cu²⁺ var; ikisinde de Cu çubuk». İki ayrı cümle yaz.  
  > Bir kapta 0,01 M, ötekinde 1 M Cu²⁺ var; ikisinde de Cu çubuk. Akım geçer mi?
- `content/kimya.json` enerji-kaynaklari › cards[0].etk.ogeler[7][2]: **Noktalı virgülle bağlanmış iki cümle** «Rezervi sınırlıdır; nükleer yakıt yenilenemez sayılır». İki ayrı cümle yaz.  
  > Rezervi sınırlıdır; nükleer yakıt yenilenemez sayılır.
- `content/kimya.json` enerji-kaynaklari › cards[0].etk.ogeler[8][2]: **Noktalı virgülle bağlanmış iki cümle** «Elektrik başka bir kaynaktan üretilir; kendisi kaynak değildir». İki ayrı cümle yaz.  
  > Elektrik başka bir kaynaktan üretilir; kendisi kaynak değildir.
- `content/kimya.json` enerji-kaynaklari › cards[0].etk.ogeler[9][2]: **Noktalı virgülle bağlanmış iki cümle** «Doğada serbest bulunmaz; enerji harcanarak üretilir». İki ayrı cümle yaz.  
  > Doğada serbest bulunmaz; enerji harcanarak üretilir.
- `content/kimya.json` enerji-kaynaklari › quiz[1].q: **Noktalı virgülle bağlanmış iki cümle** « (Atom ekonomisi = istenen ürünün mol kütlesi / girenlerin mol kütlesi × 100; Ca = 40, C =». İki ayrı cümle yaz.  
  > Kireç taşından sönmemiş kireç üretilir: CaCO₃ → CaO + CO₂. İstenen ürün CaO ise atom ekonomisi yüzde kaçtır? (Atom ekonomisi = istenen ürünün mol kütlesi / girenlerin mol kütlesi × 100; Ca = 40, C = 12, O = 16)
- `content/kimya.json` gazlar › quiz[3].q: **Noktalı virgülle bağlanmış iki cümle** «Hidrojen 27 °C'de su üstünde toplanıyor; kaptaki ve dışarıdaki su düzeyleri eşit, dış bası». İki ayrı cümle yaz.  
  > Hidrojen 27 °C'de su üstünde toplanıyor; kaptaki ve dışarıdaki su düzeyleri eşit, dış basınç 750 mmHg. 27 °C'de su buhar basıncı 27 mmHg ise H₂'nin kısmi basıncı kaç mmHg'dir?
- `content/kimya.json` kimyasal-denge › cards[12].p: **Noktalı virgülle bağlanmış iki cümle** «Karışımda iyon çarpımı Q &gt; Kçç ise çökelek oluşur». İki ayrı cümle yaz.  
  > Karışımda iyon çarpımı Q &gt; Kçç ise çökelek oluşur. Tuzun iyonlarından biri çözeltide zaten varsa (ortak iyon), tuz daha az çözünür.
- `content/kimya.json` kimyasal-denge › cards[13].p: **Noktalı virgülle bağlanmış iki cümle** « K ise tepkime ileri, Q &gt; K ise geri yürür». İki ayrı cümle yaz.  
  > • Dengede ileri ve geri hızlar eşittir, derişimler sabittir. • Katılar ve saf sıvılar K ifadesine yazılmaz. • Q &lt; K ise tepkime ileri, Q &gt; K ise geri yürür. • Denge, etkiyi azaltan yöne kayar ve K'yı yalnızca sıcak…
- `content/kimya.json` kimyasal-denge › cards[5].p: **Noktalı virgülle bağlanmış iki cümle** « K ise tepkime ileri, Q &gt; K ise geri yönde yürür». İki ayrı cümle yaz.  
  > K ifadesine o anki derişimler yazılınca Q bulunur. Q &lt; K ise tepkime ileri, Q &gt; K ise geri yönde yürür. Q = K ise sistem dengededir.
- `content/kimya.json` kimyasal-denge › cards[8].etk.ogeler[2][2]: **Noktalı virgülle bağlanmış iki cümle** «Basınç artar; denge gaz mol sayısı az olan tarafa (2 mol NH₃) kayar». İki ayrı cümle yaz.  
  > Basınç artar; denge gaz mol sayısı az olan tarafa (2 mol NH₃) kayar.
- `content/kimya.json` kimyasal-denge › cards[8].etk.ogeler[3][2]: **Noktalı virgülle bağlanmış iki cümle** «Tepkime ekzotermiktir; sıcaklık artınca denge ısı alan yöne, yani geri kayar». İki ayrı cümle yaz.  
  > Tepkime ekzotermiktir; sıcaklık artınca denge ısı alan yöne, yani geri kayar.
- `content/kimya.json` kimyasal-denge › cards[8].etk.ogeler[5][2]: **Noktalı virgülle bağlanmış iki cümle** «Basınç azalır; denge gaz mol sayısı çok olan tarafa (4 mol) kayar». İki ayrı cümle yaz.  
  > Basınç azalır; denge gaz mol sayısı çok olan tarafa (4 mol) kayar.
- `content/kimya.json` madde › cards[5].etk.ogeler[0][2]: **Noktalı virgülle bağlanmış iki cümle** «Hal değişimidir; buz da su da H₂O'dur». İki ayrı cümle yaz.  
  > Hal değişimidir; buz da su da H₂O'dur.
- `content/kimya.json` madde › cards[5].etk.ogeler[2][2]: **Noktalı virgülle bağlanmış iki cümle** «Şeker molekülleri suya dağılır ama değişmez; su buharlaşınca şeker geri kalır». İki ayrı cümle yaz.  
  > Şeker molekülleri suya dağılır ama değişmez; su buharlaşınca şeker geri kalır.
- `content/kimya.json` modern-atom-teorisi › cards[13].etk.ogeler[7][2]: **Noktalı virgülle bağlanmış iki cümle** «4s² ve 3d¹⁰ tam dolu; eşleşmemiş elektron yok». İki ayrı cümle yaz.  
  > 4s² ve 3d¹⁰ tam dolu; eşleşmemiş elektron yok.
- `content/kimya.json` redoks › quiz[3].o[1]: **Noktalı virgülle bağlanmış iki cümle** «Mg indirgendir ve yükseltgenir; H+ indirgenir». İki ayrı cümle yaz.  
  > Mg indirgendir ve yükseltgenir; H+ indirgenir
- `content/kimya.json` simya › cards[5].h: **Başlıkta her kelime büyük harfle (Title Case)** «Boyle: Şüpheci Kimyager». Türkçede başlık tümce düzeninde yazılır: 'Atomun yapısı'.  
  > Boyle: Şüpheci Kimyager
- `content/kimya.json` simya › cards[7].etk.ogeler[3][2]: **Noktalı virgülle bağlanmış iki cümle** «Başkaları deneyi tekrarlayıp kontrol edemiyordu; bu simyanın kusuruydu». İki ayrı cümle yaz.  
  > Başkaları deneyi tekrarlayıp kontrol edemiyordu; bu simyanın kusuruydu.
- `content/kimya.json` temel-kanunlar › cards[5].key: **Saatte iki nokta (12:00)** «16:32». TDK: 12.00, 21.30.  
  > 12 g karbona karşı oksijen kütleleri 16:32, yani 1:2 oranındadır. Önce ortak elementi eşitle, sonra öbür elementi oranla.
- `content/kimya.json` tepkime-enerjisi › quiz[3].o[1]: **Noktalı virgülle bağlanmış iki cümle** «ΔH = −100 kJ; tepkime ekzotermiktir». İki ayrı cümle yaz.  
  > ΔH = −100 kJ; tepkime ekzotermiktir
- `content/kimya.json` yesil-kimya › cards[12].p: **Geçiş dolgusu: bununla birlikte / öte yandan** «Öte yandan». Sil ya da 'ama', 'ayrıca', 'ise'.  
  > Yapay zekâ veri merkezleri çok elektrik ve soğutma suyu tüketir. Öte yandan yapay zekâ yeni pil ve katalizör malzemelerini hızla tarayabilir, şebekeyi verimli yönetebilir.

## Üslup notları (örnekler)

Bunlar hata değil, tercih. Yeni metin yazarken uyulur; eski metin toplu düzeltilmez.

- `content/fizik.json` madde-ozellikleri › cards[0].once.secenekler[1].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Mıknatıs demiri çeker, ama tahtayı çekmez. Yani manyetiklik her maddede yoktur.
- `content/fizik.json` madde-ozellikleri › cards[1].key: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Kütle ile ağırlık aynı şey değildir. Ay'da kütlen aynı kalır, ama ağırlığın (sana etki eden çekim kuvveti) azalır.
- `content/fizik.json` madde-ozellikleri › cards[6].once.secenekler[1].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Her kenar 2 kat, ama hacimde üç kenar çarpılır.
- `content/fizik.json` basinc › cards[4].once.secenekler[1].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > İnce kolda daha az su var, ama basınç yalnız derinliğe bağlıdır.
- `content/fizik.json` basinc › cards[4].once.secenekler[2].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Kalın kolda su daha çok, ama basınç yalnız derinliğe bağlıdır.
- `content/fizik.json` basinc › cards[5].key: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Kuvvetten kazanırsın, ama yoldan kaybedersin. Büyük piston, alan oranı kadar az yükselir.
- `content/fizik.json` basinc › cards[8].once.secenekler[2].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Tanecik sayısı aynı, ama hızları arttığı için çarpmalar güçlenir.
- `content/fizik.json` basinc › cards[10].once.secenekler[1].neden: **Bağlaçtan önce virgül (ama / fakat)** «, ama»  
  > Sezgi böyle der, ama hızlanan havanın basıncı düşer.
