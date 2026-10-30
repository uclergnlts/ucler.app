# Türkçe anlaşılırlık ve zorluk sırası raporu

Bu dosya `npm run okunabilirlik` komutuyla üretilir; elle düzenleme, yeniden çalıştırınca silinir.
Puanlar yol göstericidir. Fen metinlerinde bazı uzun terimler zorunlu olduğundan puan doğal olarak düşer.

## Kısa özet

- 85 konu, 1202 kart, 584 adımlı ders adımı tarandı.
- Tüm kartların Ateşman puanı **71** (kolay), Bezirci-Yılmaz sınıf düzeyi **7.5**.
- Kesin düzeltilmesi önerilen: **0** (28 kelimeyi aşan cümle).
- Bir göz atılması önerilen: **5** uzun ya da ağır kelimeli cümle, **17** zor metinli kart.
- Sıra: **11** konu zordan kolaya gidiyor, **0** konunun ilk kartı fazla zor, **0** konu ön koşulundan belirgin kolay, **65** terim tanıtılmadan önce kullanılıyor.

Puanların anlamı: Ateşman 90+ çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor. Bezirci-Yılmaz yaklaşık sınıf düzeyidir (9-12 lise, 13-16 üniversite). Zorluk 0-100 arasıdır: metin ağırlığı, karttaki yeni terim sayısı, formül/sayı yükü ve uzunluktan hesaplanır.

## 1. Kesin düzeltilmesi önerilenler

28 kelimeyi aşan cümleler. İkiye bölmek genellikle yeter.

Yok.

## 2. Terim tanıtılmadan önce kullanılıyor

Bir terim **kalın** yazılarak tanıtıldığı karttan önce düz metinde geçiyor. Ya tanımı öne al, ya da ilk geçtiği yerde kısaca açıkla. Kelime gündelik anlamıyla geçiyorsa (ör. “hareket”) yok sayılabilir.

- “özkütl…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (aynı konuda) **fizik/madde-ozellikleri kart 3 "Özkütle (yoğunluk)"**
- “iletken…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **fizik/elektrostatik kart 2 "İletken ve yalıtkan"**
- “eylemsizlik…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 10 "Özet"**, tanımı (başka konuda) **fizik/newton-yasalari kart 3 "1. yasa: eylemsizlik"**
- “gerilim…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 10 "Özet"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"**
- “ağırlık…”: ilk geçtiği yer **fizik/kaldirma-kuvveti kart 7 "İple bağlı cisim"**, tanımı (başka konuda) **fizik/newton-yasalari kart 6 "Ağırlık ≠ kütle"** (2 yerde önce geçiyor)
- “aynı yönde…”: ilk geçtiği yer **fizik/newton-yasalari kart 4 "2. yasa: F = m·a"**, tanımı (başka konuda) **fizik/momentum kart 2 "Momentum bir vektördür"** (2 yerde önce geçiyor)
- “boyun…”: ilk geçtiği yer **fizik/is-enerji-guc kart 5 "İş–enerji teoremi"**, tanımı (başka konuda) **fizik/dalgalar kart 1 "Dalga: enine ve boyuna"** (2 yerde önce geçiyor)
- “korunur…”: ilk geçtiği yer **fizik/is-enerji-guc kart 7 "Sürtünme: enerji ısıya döner"**, tanımı (başka konuda) **fizik/cembersel-hareket kart 12 "Açısal momentum ve korunumu"** (6 yerde önce geçiyor)
- “potansiyel…”: ilk geçtiği yer **fizik/is-enerji-guc kart 12 "Enerjinin biçimleri"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"** (2 yerde önce geçiyor)
- “kaldıraç…”: ilk geçtiği yer **fizik/basit-makineler kart 1 "Basit makine nedir?"**, tanımı (aynı konuda) **fizik/basit-makineler kart 3 "Kaldıraç ve denge koşulu"**
- “düzgün…”: ilk geçtiği yer **fizik/tork-denge kart 6 "Çubuk ve destek tepkileri"**, tanımı (başka konuda) **fizik/elektrostatik kart 12 "Paralel levhalar: düzgün alan"** (4 yerde önce geçiyor)
- “iç direnc…”: ilk geçtiği yer **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 13 "Emk ve iç direnç"**
- “madde…”: ilk geçtiği yer **kimya/simya kart 2 "Hedef 1: Altın yapmak"**, tanımı (başka konuda) **kimya/madde kart 1 "Madde nedir?"** (6 yerde önce geçiyor)
- “metal…”: ilk geçtiği yer **kimya/simya kart 2 "Hedef 1: Altın yapmak"**, tanımı (başka konuda) **kimya/periyodik-tablo kart 4 "Metaller, ametaller, soy gazlar"** (3 yerde önce geçiyor)
- “alkol…”: ilk geçtiği yer **kimya/simya kart 4 "Kalıcı miras: Laboratuvar"**, tanımı (başka konuda) **kimya/fonksiyonel-gruplar kart 2 "Alkoller: ad ve sınıf"**
- “buhar…”: ilk geçtiği yer **kimya/simya kart 5 "Damıtma: Simyanın yıldızı"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 10 "Gaz mı, buhar mı? Kritik sıcaklık"** (4 yerde önce geçiyor)
- “bileşik…”: ilk geçtiği yer **kimya/kimya-bilimi kart 4 "Bileşik formülleri"**, tanımı (başka konuda) **kimya/madde kart 4 "Saf madde: Element ve bileşik"** (2 yerde önce geçiyor)
- “ağır metal…”: ilk geçtiği yer **kimya/kimya-bilimi kart 10 "Özet"**, tanımı (başka konuda) **kimya/yesil-kimya kart 6 "Ağır metaller ekosistemde"**
- “fiziksel değişim…”: ilk geçtiği yer **kimya/madde kart 6 "Fiziksel ve kimyasal değişim"**, tanımı (başka konuda) **kimya/tepkimeler kart 2 "Atomlar yeniden düzenlenir"** (2 yerde önce geçiyor)
- “yoğunluk…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (aynı konuda) **kimya/madde kart 8 "Yoğunluk"**
- “çözünürlük…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **kimya/cozeltiler kart 13 "Çözünürlük ve doygunluk"** (2 yerde önce geçiyor)
- “elektron…”: ilk geçtiği yer **kimya/atom-modelleri kart 3 "Dalton: İçi dolu küre"**, tanımı (başka konuda) **kimya/atomun-yapisi kart 1 "Üç temel tanecik"** (6 yerde önce geçiyor)
- “molek…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 4 "İyonik bağ ve iyon örgüsü"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (6 yerde önce geçiyor)
- “iyonik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 15 "Özet"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"**
- “metalik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 15 "Özet"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"**
- “çözüc…”: ilk geçtiği yer **kimya/karisimlar kart 9 "Çözünürlük farkı"**, tanımı (başka konuda) **kimya/cozeltiler kart 1 "Hatırla: çözücü, çözünen"** (2 yerde önce geçiyor)
- “redoks…”: ilk geçtiği yer **kimya/tepkimeler kart 13 "Özet"**, tanımı (başka konuda) **kimya/redoks kart 7 "Redoks mu, değil mi?"**
- “kütlece yüzde…”: ilk geçtiği yer **kimya/mol kart 6 "Kütlece yüzde bileşim"**, tanımı (başka konuda) **kimya/cozeltiler kart 4 "Yüzde derişim ve ppm"**
- “asidik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “bazik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “fotosentez…”: ilk geçtiği yer **kimya/tepkime-enerjisi kart 2 "Gündelik örnekler"**, tanımı (başka konuda) **kimya/redoks kart 15 "Günlük hayatta redoks"**
- “elektroliz…”: ilk geçtiği yer **kimya/tepkime-enerjisi kart 2 "Gündelik örnekler"**, tanımı (başka konuda) **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**
- “katalizör…”: ilk geçtiği yer **kimya/tepkime-hizi kart 14 "Katalizör"**, tanımı (başka konuda) **kimya/kimyasal-denge kart 10 "Sıcaklık ve katalizör"** (3 yerde önce geçiyor)
- “tuz köprüs…”: ilk geçtiği yer **kimya/elektrokimya kart 1 "Galvanik pil: Daniell pili"**, tanımı (aynı konuda) **kimya/elektrokimya kart 2 "Tuz köprüsü ve pil gösterimi"**
- “katot…”: ilk geçtiği yer **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**, tanımı (aynı konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (2 yerde önce geçiyor)
- “anotta…”: ilk geçtiği yer **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**, tanımı (aynı konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (2 yerde önce geçiyor)
- “alkan…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 2 "Alkanlar ve ilk 10 alkan"**
- “alken…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 7 "Alkenler: çift bağ"**
- “alkin…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 11 "Alkinler: üçlü bağ"**
- “boşaltım…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 14 "Özet"**, tanımı (başka konuda) **biyoloji/bosaltim kart 1 "Boşaltım ve iç denge"**
- “popülasyon…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 14 "Özet"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 1 "Popülasyon: yoğunluk ve dağılım"**
- “hücre zarı…”: ilk geçtiği yer **biyoloji/biyomolekuller kart 7 "Fosfolipit ve steroitler"**, tanımı (başka konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**
- “tükürük…”: ilk geçtiği yer **biyoloji/enzimler kart 10 "Aktivatörler ve tersinir tepkimeler"**, tanımı (başka konuda) **biyoloji/sindirim kart 3 "Ağız: dişler ve tükürük"** (2 yerde önce geçiyor)
- “sitoplazm…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**
- “çekirdek…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 4 "Çekirdek: yönetim merkezi"**
- “ribozom…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum"** (2 yerde önce geçiyor)
- “alyuvar…”: ilk geçtiği yer **biyoloji/madde-gecisi kart 6 "Hayvan hücresi: üç ortam"**, tanımı (başka konuda) **biyoloji/dolasim-bagisiklik kart 7 "Kanın yapısı"** (2 yerde önce geçiyor)
- “memel…”: ilk geçtiği yer **biyoloji/siniflandirma kart 2 "Yapay ve doğal sınıflandırma"**, tanımı (başka konuda) **biyoloji/hayvanlar-alemi kart 12 "Memeliler"**
- “bakteri…”: ilk geçtiği yer **biyoloji/siniflandirma kart 5 "Tür nedir? Katır örneği"**, tanımı (aynı konuda) **biyoloji/siniflandirma kart 8 "Bakteriler ve arkeler"** (2 yerde önce geçiyor)
- “omurilik…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/sinir-sistemi kart 11 "Omurilik ve refleks yayı"**
- “sinir sistem…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/endokrin kart 4 "Sinirsel ve hormonal düzenleme"** (2 yerde önce geçiyor)
- “kromozom…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 6 "Döl almaşı: gametofit ve sporofit"**, tanımı (başka konuda) **biyoloji/mitoz kart 2 "Kromozom, kromatit, sentromer"**
- “meyve…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 9 "Açık tohumlular"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 13 "Tohum, meyve ve çimlenme"** (3 yerde önce geçiyor)
- “yumurtalık…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 10 "Kapalı tohumlular"**, tanımı (başka konuda) **biyoloji/ureme-sistemi kart 4 "Dişi üreme sistemi"** (2 yerde önce geçiyor)
- “sitok…”: ilk geçtiği yer **biyoloji/mitoz kart 7 "Evrelere göre DNA ve kromozom"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 10 "Bitki hormonları"** (2 yerde önce geçiyor)
- “renk körlüğ…”: ilk geçtiği yer **biyoloji/kalitim kart 10 "X'e bağlı çekinik kalıtım"**, tanımı (başka konuda) **biyoloji/duyu-organlari kart 9 "Astigmatizm, katarakt, renk körlüğü"**
- “mutasyon…”: ilk geçtiği yer **biyoloji/kalitim kart 13 "Çok genli kalıtım ve çeşitlilik"**, tanımı (aynı konuda) **biyoloji/kalitim kart 15 "Modifikasyon ve mutasyon"**
- “kaynak…”: ilk geçtiği yer **biyoloji/ekosistem kart 2 "Habitat ve ekolojik niş"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 9 "Besin taşınması: kaynak ve havuz"**
- “fosil…”: ilk geçtiği yer **biyoloji/ekosistem kart 10 "Kirlilik ve asit yağmuru"**, tanımı (başka konuda) **biyoloji/evrim kart 14 "Kanıtlar: fosiller ve yapılar"**
- “ön hipofiz…”: ilk geçtiği yer **biyoloji/endokrin kart 6 "Hipotalamus ve arka hipofiz"**, tanımı (aynı konuda) **biyoloji/endokrin kart 7 "Ön hipofiz: bezlerin yöneticisi"**
- “aldosteron…”: ilk geçtiği yer **biyoloji/endokrin kart 10 "Böbrek üstü bezleri"**, tanımı (başka konuda) **biyoloji/bosaltim kart 13 "ADH ve aldosteron"**
- “bikarbonat…”: ilk geçtiği yer **biyoloji/endokrin kart 15 "Mide, bağırsak ve yağ hormonları"**, tanımı (başka konuda) **biyoloji/solunum kart 10 "CO₂'nin taşınması"** (2 yerde önce geçiyor)
- “kırmızı ilik…”: ilk geçtiği yer **biyoloji/destek-hareket kart 1 "İskelet: görevleri ve bölümleri"**, tanımı (aynı konuda) **biyoloji/destek-hareket kart 4 "Kemik iliği: kırmızı ve sarı"**
- “salgılam…”: ilk geçtiği yer **biyoloji/sindirim kart 4 "Yutak ve yemek borusu"**, tanımı (başka konuda) **biyoloji/bosaltim kart 11 "3. adım: salgılama ve pH"** (2 yerde önce geçiyor)
- “birincil…”: ilk geçtiği yer **biyoloji/ureme-sistemi kart 3 "Spermatogenez ve spermin yapısı"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 13 "Ekolojik süksesyon"**

## 3. Konu sırası

### Zordan kolaya giden konular

Kartların zorluğu konu ilerledikçe azalıyor (eğilim −1'e yakınsa belirgin). Çoğu zaman sebep, temel kavramları tanıtan ilk kartlarda yeni terimin yoğun olmasıdır; bu “önce temel, sonra uygulama” sırası doğrudur. Kart sırasını değiştirmek yerine yoğun kartlarda terimleri iki karta yaymak ya da cümleleri kısaltmak düşünülebilir.

- **fizik/basit-makineler** “Basit makineler”: eğilim -0.64, kart zorlukları [33.3, 22.6, 20.9, 28.0, 23.4, 22.9, 29.1, 17.5, 12.8, 27.5, 22.1, 18.5, 16.3, 12.6]
- **biyoloji/hayvanlar-alemi** “Hayvanlar âlemi: omurgasız ve omurgalılar”: eğilim -0.61, kart zorlukları [14.9, 42.9, 39.5, 37.3, 27.8, 28.1, 27.3, 26.6, 27.8, 21.8, 11.6, 26.7, 18.4, 13.9]
- **fizik/is-enerji-guc** “İş, enerji ve güç”: eğilim -0.5, kart zorlukları [30.8, 23.0, 18.5, 33.4, 24.3, 20.4, 28.6, 25.5, 15.9, 13.8, 21.6, 19.6]
- **kimya/periyodik-tablo** “Periyodik tablo”: eğilim -0.5, kart zorlukları [27.2, 21.3, 26.3, 36.3, 22.1, 12.8, 14.2, 19.7, 26.6, 21.2, 15.6]
- **fizik/kuantum** “Kuantum fiziğine giriş”: eğilim -0.47, kart zorlukları [28.1, 33.3, 33.0, 27.5, 20.8, 17.2, 10.4, 16.6, 17.4, 28.0, 20.6, 27.8, 18.2, 22.8, 10.8]
- **kimya/cozeltiler** “Çözeltiler ve çözünürlük”: eğilim -0.39, kart zorlukları [26.9, 27.4, 21.5, 36.3, 30.2, 32.7, 10.7, 22.3, 34.5, 27.7, 26.5, 18.2, 23.6, 26.0, 16.2]
- **kimya/kimya-bilimi** “Kimyanın dili ve güvenliği”: eğilim -0.38, kart zorlukları [27.9, 22.0, 9.6, 22.6, 20.2, 22.0, 20.5, 15.9, 20.5]
- **biyoloji/fotosentez** “Fotosentez ve kemosentez”: eğilim -0.38, kart zorlukları [19.4, 22.1, 24.4, 30.2, 23.4, 16.3, 27.0, 13.6, 11.1, 15.9, 23.9, 16.7]
- **fizik/isi-sicaklik** “Isı, sıcaklık ve genleşme”: eğilim -0.37, kart zorlukları [28.2, 25.6, 25.5, 23.8, 23.9, 21.1, 24.0, 15.8, 34.9, 32.8, 15.4, 26.4, 16.1, 19.0, 21.5]
- **fizik/elektriksel-enerji** “Elektriksel enerji ve güç”: eğilim -0.37, kart zorlukları [20.0, 27.0, 21.0, 12.2, 34.8, 25.1, 20.1, 35.2, 16.3, 11.2, 18.6, 24.8, 9.9]
- **biyoloji/ekosistem** “Ekosistem ekolojisi ve güncel çevre sorunları”: eğilim -0.36, kart zorlukları [35.4, 30.9, 37.3, 30.5, 14.8, 26.4, 19.4, 29.3, 33.4, 21.3, 28.8, 29.6, 25.0, 36.6, 9.5]

### İlk kartı fazla zor olan konular

Konuya girişte öğrenci en kolay yerden başlamalı. İlk kart, konunun ortanca zorluğundan belirgin zor.

Yok.

### Ön koşulundan kolay görünen konular

Bir konu, üzerine kurulduğu konudan belirgin kolaysa sıra ters olabilir ya da ön koşul konusu gereğinden ağır yazılmış olabilir.

Yok.

## 4. En zor metinli kartlar

Ateşman puanı 40'ın altında olan kartlar, en zordan başlayarak (ilk 30).

| Kart | Ateşman | Cümle başına kelime |
|---|---|---|
| biyoloji/canlilarin-ozellikleri kart 12 "Biyolojide dönüm noktaları" | 23 | 23.0 |
| fizik/bagil-hareket kart 11 "Geçiş süresi ve sürüklenme" | 34 | 20.0 |
| biyoloji/endokrin kart 9 "Kalsiyum dengesi ve paratiroit" | 35 | 9.0 |
| biyoloji/dolasim-bagisiklik kart 9 "Kan grupları ve kan nakli" | 35 | 8.0 |
| fizik/kaldirma-kuvveti kart 2 "Arşimet ilkesi" | 35 | 15.0 |
| biyoloji/ekosistem kart 14 "Çözümler ve ekolojik ayak izi" | 37 | 6.7 |
| kimya/tepkime-hizi kart 15 "Katalizör türleri ve inhibitör" | 37 | 9.0 |
| biyoloji/sindirim kart 7 "Proteazların etkinleşme zinciri" | 38 | 6.7 |
| biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum" | 38 | 6.3 |
| biyoloji/hucresel-solunum kart 2 "Fosforilasyon: ATP nasıl yapılır?" | 39 | 7.3 |
| biyoloji/duyu-organlari kart 2 "Reseptör türleri ve adaptasyon" | 39 | 9.0 |
| kimya/simya kart 5 "Damıtma: Simyanın yıldızı" | 39 | 10.5 |
| kimya/cozeltiler kart 9 "İyon derişimi" | 39 | 20.0 |
| fizik/fizik-bilimine-giris kart 6 "Temel büyüklükler (SI)" | 40 | 23.0 |
| kimya/kimya-bilimi kart 1 "Kimyanın alanları" | 40 | 8.5 |
| biyoloji/protein-sentezi kart 11 "Poliribozom ve proteinin yolu" | 40 | 9.0 |
| fizik/basinc kart 4 "Tabana etki eden kuvvet" | 40 | 10.5 |

## 5. Bir göz atılması önerilenler

20-28 kelimelik cümleler ve tek cümlede 3+ tane 6+ heceli kelime.

- fizik/bagil-hareket kart 15 "Sık yapılan hatalar": 21 kelimelik cümle: “Dört tuzak: “A'ya göre B”de vA − vB yazmak; zıt yönde hızları çıkarmak; dik hızları düz toplamak; geçiş süresine akıntıyı katmak.”
- kimya/modern-atom-teorisi kart 4 "Orbital sayısı ve spin": 21 kelimelik cümle: “mℓ −ℓ'den +ℓ'ye tam sayılardır; her değer bir orbitaldir: s'de 1, p'de 3, d'de 5, f'de 7. ms +½ (↑) ya da −½ (↓) olur.”
- kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği": 22 kelimelik cümle: “pH = −log[H₃O⁺]: [H₃O⁺] = 10⁻³ M ise pH = 3. 25 °C'de pH + pOH = 14; 7 nötr, altı asidik, üstü baziktir.”
- biyoloji/kalitim kart 16 "Özet": 21 kelimelik cümle: “Aa × Aa: fenotip 3:1, genotip 1:2:1; dihibritte 9:3:3:1. n heterozigot çift: 2n gamet, 3n genotip.”
- fizik/kuantum adım 3 "Einstein denklemi ve durdurma gerilimi": 21 kelimelik cümle: “Kopan elektronun en büyük kinetik enerjisi Ek,max = h·f − W; foton enerjisi E(eV) ≈ 1240/λ(nm), sodyumda W = 2,3 eV.”

## 6. Ders ve konu tablosu

### Fizik: Ateşman 73 (kolay), sınıf düzeyi 6.6, konu zorluk eğilimi 0.22

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Fizik bilimine giriş | 69 | 10.1 | 21.6 | +0.22 |
| 2 | Madde ve özellikleri | 75 | 6.5 | 17.1 | +0.07 |
| 3 | Basınç | 75 | 6.1 | 19.0 | +0.58 |
| 4 | Sıvıların kaldırma kuvveti | 76 | 5.6 | 21.2 | -0.32 |
| 5 | Isı, sıcaklık ve genleşme | 70 | 6.5 | 23.6 | -0.37 |
| 6 | Vektörler | 79 | 7.1 | 16.8 | +0.27 |
| 7 | Bir boyutta hareket | 79 | 5.1 | 20.3 | +0.29 |
| 8 | Newton'un hareket yasaları | 82 | 5.4 | 17.5 | -0.04 |
| 9 | İki boyutta hareket ve atışlar | 80 | 5.2 | 17.9 | +0.23 |
| 10 | Bağıl hareket | 76 | 6.4 | 20.7 | +0.11 |
| 11 | İş, enerji ve güç | 69 | 6.6 | 22.9 | -0.50 |
| 12 | Basit makineler | 76 | 6.1 | 22.0 | -0.64 |
| 13 | Momentum ve çarpışmalar | 75 | 6.3 | 20.1 | -0.03 |
| 14 | Tork, denge ve kütle merkezi | 78 | 5.7 | 17.5 | +0.38 |
| 15 | Çembersel ve dönme hareketi | 76 | 5.8 | 20.3 | +0.44 |
| 16 | Kütle çekimi | 67 | 6.5 | 24.1 | -0.12 |
| 17 | Elektrostatik | 71 | 6.3 | 21.6 | +0.40 |
| 18 | Elektrik akımı ve devreler | 70 | 7.2 | 21.2 | +0.19 |
| 19 | Elektriksel enerji ve güç | 71 | 6.3 | 21.2 | -0.37 |
| 20 | Manyetizma | 77 | 6.6 | 18.1 | -0.02 |
| 21 | Elektromanyetik indüksiyon ve alternatif akım | 69 | 6.7 | 22.7 | -0.03 |
| 22 | Yarı iletkenler ve süper iletkenler | 71 | 6.8 | 19.0 | +0.15 |
| 23 | Basit harmonik hareket | 75 | 5.9 | 16.9 | +0.36 |
| 24 | Titreşimler ve dalgalar | 74 | 7.1 | 21.0 | +0.29 |
| 25 | Deprem ve rezonans | 66 | 7.8 | 21.6 | -0.10 |
| 26 | Optik | 73 | 6.8 | 19.0 | -0.16 |
| 27 | Işığın girişimi ve kırınımı | 76 | 5.9 | 19.0 | -0.24 |
| 28 | Özel görelilik | 76 | 5.7 | 21.1 | +0.07 |
| 29 | Kuantum fiziğine giriş | 71 | 7.5 | 22.2 | -0.47 |
| 30 | Atom çekirdeği ve radyoaktivite | 69 | 7.0 | 23.8 | -0.33 |

### Kimya: Ateşman 70 (kolay), sınıf düzeyi 8.0, konu zorluk eğilimi 0.08

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Simyadan kimyaya | 64 | 8.8 | 21.2 | +0.21 |
| 2 | Kimyanın dili ve güvenliği | 66 | 9.5 | 20.1 | -0.38 |
| 3 | Madde ve özellikleri | 78 | 7.3 | 21.6 | +0.02 |
| 4 | Atom modellerinin tarihi | 63 | 10.3 | 25.6 | -0.27 |
| 5 | Atomun yapısı | 69 | 8.5 | 23.9 | +0.39 |
| 6 | Modern atom teorisi | 73 | 8.1 | 22.4 | -0.19 |
| 7 | Periyodik tablo | 70 | 8.8 | 22.1 | -0.50 |
| 8 | Kimyasal türler arası etkileşimler | 72 | 8.6 | 20.5 | -0.00 |
| 9 | Maddenin halleri | 73 | 6.5 | 23.9 | -0.34 |
| 10 | Karışımlar ve ayırma yöntemleri | 69 | 9.9 | 25.8 | +0.52 |
| 11 | Kimyanın temel kanunları | 64 | 7.4 | 25.2 | +0.15 |
| 12 | Kimyasal tepkimeler ve denklemler | 76 | 7.6 | 21.3 | +0.23 |
| 13 | Mol kavramı ve kimyasal hesaplamalar | 77 | 6.7 | 21.1 | +0.23 |
| 14 | Asitler, bazlar ve tuzlar | 79 | 6.1 | 18.4 | +0.26 |
| 15 | Kimya her yerde | 71 | 8.4 | 19.7 | +0.36 |
| 16 | Gazlar | 74 | 7.3 | 19.4 | +0.26 |
| 17 | Çözeltiler ve çözünürlük | 64 | 7.0 | 25.4 | -0.39 |
| 18 | Kimyasal tepkimelerde enerji | 64 | 7.7 | 25.5 | -0.01 |
| 19 | Tepkime hızı | 68 | 7.5 | 20.8 | -0.03 |
| 20 | Kimyasal denge | 70 | 6.4 | 19.8 | -0.03 |
| 21 | Redoks tepkimeleri | 73 | 6.3 | 21.5 | -0.24 |
| 22 | Elektrokimya | 78 | 5.3 | 22.2 | +0.45 |
| 23 | Karbon ve organik kimyaya giriş | 69 | 9.5 | 23.5 | -0.23 |
| 24 | Hidrokarbonlar | 77 | 7.1 | 20.7 | +0.12 |
| 25 | Fonksiyonel gruplar | 70 | 7.8 | 25.1 | -0.15 |
| 26 | Enerji kaynakları ve bilimsel gelişmeler | 63 | 9.9 | 26.1 | +0.26 |
| 27 | Yeşil kimya ve nanoteknoloji | 63 | 10.6 | 23.1 | +0.25 |

### Biyoloji: Ateşman 69 (orta), sınıf düzeyi 7.9, konu zorluk eğilimi -0.18

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Canlıların ortak özellikleri | 66 | 9.8 | 24.8 | +0.15 |
| 2 | Biyomoleküller | 70 | 6.8 | 24.4 | +0.08 |
| 3 | Enzimler | 66 | 7.4 | 24.0 | -0.02 |
| 4 | Hücre ve organeller | 66 | 8.8 | 27.7 | -0.24 |
| 5 | Hücre zarından madde geçişi | 69 | 8.6 | 25.7 | +0.04 |
| 6 | Canlıların sınıflandırılması | 71 | 8.1 | 21.2 | -0.12 |
| 7 | Hayvanlar âlemi: omurgasız ve omurgalılar | 67 | 8.5 | 26.0 | -0.61 |
| 8 | Bitkiler âlemi ve bitki grupları | 74 | 7.3 | 17.9 | -0.22 |
| 9 | Mitoz ve eşeysiz üreme | 62 | 9.1 | 28.3 | +0.02 |
| 10 | Mayoz ve eşeyli üreme | 71 | 6.9 | 22.1 | +0.37 |
| 11 | Kalıtım (Mendel genetiği) | 67 | 7.7 | 26.0 | -0.18 |
| 12 | Ekosistem ekolojisi ve güncel çevre sorunları | 67 | 8.8 | 27.2 | -0.36 |
| 13 | Bitki biyolojisi | 71 | 7.8 | 27.1 | +0.37 |
| 14 | DNA, eşlenme ve biyoteknoloji | 67 | 8.5 | 24.4 | +0.27 |
| 15 | Protein sentezi | 70 | 8.2 | 21.0 | -0.20 |
| 16 | Fotosentez ve kemosentez | 71 | 7.3 | 20.3 | -0.38 |
| 17 | Hücresel solunum | 71 | 7.9 | 21.0 | -0.13 |
| 18 | Sinir sistemi | 73 | 7.2 | 22.7 | +0.49 |
| 19 | Endokrin sistem | 67 | 7.0 | 22.7 | -0.20 |
| 20 | Duyu organları | 68 | 8.6 | 22.9 | -0.23 |
| 21 | Destek ve hareket sistemi | 72 | 7.2 | 22.7 | +0.73 |
| 22 | Sindirim sistemi | 60 | 10.6 | 24.2 | -0.29 |
| 23 | Dolaşım ve bağışıklık sistemi | 70 | 6.9 | 23.9 | +0.21 |
| 24 | Solunum sistemi | 73 | 5.8 | 21.8 | +0.47 |
| 25 | Boşaltım sistemi | 77 | 6.7 | 16.7 | -0.09 |
| 26 | Üreme sistemi ve embriyonik gelişim | 66 | 6.5 | 22.6 | -0.30 |
| 27 | Komünite ve popülasyon ekolojisi | 67 | 8.1 | 27.4 | +0.11 |
| 28 | Evrim ve doğal seçilim | 60 | 9.0 | 29.1 | +0.54 |

