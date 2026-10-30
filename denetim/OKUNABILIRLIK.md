# Türkçe anlaşılırlık ve zorluk sırası raporu

Bu dosya `npm run okunabilirlik` komutuyla üretilir; elle düzenleme, yeniden çalıştırınca silinir.
Puanlar yol göstericidir. Fen metinlerinde bazı uzun terimler zorunlu olduğundan puan doğal olarak düşer.

## Kısa özet

- 85 konu, 1202 kart, 584 adımlı ders adımı tarandı.
- Tüm kartların Ateşman puanı **70** (kolay), Bezirci-Yılmaz sınıf düzeyi **7.7**.
- Kesin düzeltilmesi önerilen: **0** (28 kelimeyi aşan cümle).
- Bir göz atılması önerilen: **61** uzun ya da ağır kelimeli cümle, **31** zor metinli kart.
- Sıra: **6** konu zordan kolaya gidiyor, **3** konunun ilk kartı fazla zor, **0** konu ön koşulundan belirgin kolay, **89** terim tanıtılmadan önce kullanılıyor.

Puanların anlamı: Ateşman 90+ çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor. Bezirci-Yılmaz yaklaşık sınıf düzeyidir (9-12 lise, 13-16 üniversite). Zorluk 0-100 arasıdır: metin ağırlığı, karttaki yeni terim sayısı, formül/sayı yükü ve uzunluktan hesaplanır.

## 1. Kesin düzeltilmesi önerilenler

28 kelimeyi aşan cümleler. İkiye bölmek genellikle yeter.

Yok.

## 2. Terim tanıtılmadan önce kullanılıyor

Bir terim **kalın** yazılarak tanıtıldığı karttan önce düz metinde geçiyor. Ya tanımı öne al, ya da ilk geçtiği yerde kısaca açıkla. Kelime gündelik anlamıyla geçiyorsa (ör. “hareket”) yok sayılabilir.

- “şiddet…”: ilk geçtiği yer **fizik/fizik-bilimine-giris kart 6 "Temel büyüklükler (SI)"**, tanımı (başka konuda) **fizik/dalgalar kart 11 "Sesin yüksekliği, şiddeti, tınısı"**
- “özkütl…”: ilk geçtiği yer **fizik/fizik-bilimine-giris kart 7 "Türetilmiş büyüklükler"**, tanımı (başka konuda) **fizik/madde-ozellikleri kart 3 "Özkütle (yoğunluk)"** (2 yerde önce geçiyor)
- “yer değiştirm…”: ilk geçtiği yer **fizik/fizik-bilimine-giris kart 9 "Skaler ve vektörel büyüklük"**, tanımı (başka konuda) **fizik/bir-boyutta-hareket kart 1 "Konum, yer değiştirme ve yol"**
- “eylemsizlik…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **fizik/newton-yasalari kart 3 "1. yasa: eylemsizlik"** (2 yerde önce geçiyor)
- “iletken…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **fizik/elektrostatik kart 2 "İletken ve yalıtkan"**
- “gerilim…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 10 "Özet"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"**
- “ağırlık…”: ilk geçtiği yer **fizik/kaldirma-kuvveti kart 7 "İple bağlı cisim"**, tanımı (başka konuda) **fizik/newton-yasalari kart 6 "Ağırlık ≠ kütle"** (2 yerde önce geçiyor)
- “joule…”: ilk geçtiği yer **fizik/isi-sicaklik kart 2 "Isı ve iç enerji"**, tanımı (başka konuda) **fizik/is-enerji-guc kart 1 "İş: kuvvet yol aldırınca"**
- “buharlaşm…”: ilk geçtiği yer **fizik/isi-sicaklik kart 6 "Hâl değişimi ve gizli ısı"**, tanımı (aynı konuda) **fizik/isi-sicaklik kart 9 "Buharlaşma ve kaynama"**
- “aynı yönde…”: ilk geçtiği yer **fizik/newton-yasalari kart 4 "2. yasa: F = m·a"**, tanımı (başka konuda) **fizik/momentum kart 2 "Momentum bir vektördür"** (2 yerde önce geçiyor)
- “korunur…”: ilk geçtiği yer **fizik/is-enerji-guc kart 7 "Sürtünme: enerji ısıya döner"**, tanımı (başka konuda) **fizik/cembersel-hareket kart 12 "Açısal momentum ve korunumu"** (6 yerde önce geçiyor)
- “potansiyel…”: ilk geçtiği yer **fizik/is-enerji-guc kart 12 "Enerjinin biçimleri"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"** (2 yerde önce geçiyor)
- “kaldıraç…”: ilk geçtiği yer **fizik/basit-makineler kart 1 "Basit makine nedir?"**, tanımı (aynı konuda) **fizik/basit-makineler kart 3 "Kaldıraç ve denge koşulu"**
- “düzgün…”: ilk geçtiği yer **fizik/tork-denge kart 6 "Çubuk ve destek tepkileri"**, tanımı (başka konuda) **fizik/elektrostatik kart 12 "Paralel levhalar: düzgün alan"** (4 yerde önce geçiyor)
- “ampermetr…”: ilk geçtiği yer **fizik/elektrik-akimi kart 5 "Devre sembolleri"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**
- “voltmetr…”: ilk geçtiği yer **fizik/elektrik-akimi kart 5 "Devre sembolleri"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**
- “iç direnc…”: ilk geçtiği yer **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 13 "Emk ve iç direnç"**
- “fisyon…”: ilk geçtiği yer **fizik/ozel-gorelilik kart 8 "Kütle-enerji eşdeğerliği"**, tanımı (başka konuda) **fizik/radyoaktivite kart 11 "Fisyon ve füzyon"**
- “füzyon…”: ilk geçtiği yer **fizik/ozel-gorelilik kart 8 "Kütle-enerji eşdeğerliği"**, tanımı (başka konuda) **fizik/radyoaktivite kart 11 "Fisyon ve füzyon"**
- “madde…”: ilk geçtiği yer **kimya/simya kart 2 "Hedef 1: Altın yapmak"**, tanımı (başka konuda) **kimya/madde kart 1 "Madde nedir?"** (6 yerde önce geçiyor)
- “metal…”: ilk geçtiği yer **kimya/simya kart 2 "Hedef 1: Altın yapmak"**, tanımı (başka konuda) **kimya/periyodik-tablo kart 4 "Metaller, ametaller, soy gazlar"** (3 yerde önce geçiyor)
- “alkol…”: ilk geçtiği yer **kimya/simya kart 4 "Kalıcı miras: Laboratuvar"**, tanımı (başka konuda) **kimya/fonksiyonel-gruplar kart 2 "Alkoller: ad ve sınıf"**
- “buhar…”: ilk geçtiği yer **kimya/simya kart 5 "Damıtma: Simyanın yıldızı"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 10 "Gaz mı, buhar mı? Kritik sıcaklık"** (4 yerde önce geçiyor)
- “bileşik…”: ilk geçtiği yer **kimya/kimya-bilimi kart 4 "Bileşik formülleri"**, tanımı (başka konuda) **kimya/madde kart 4 "Saf madde: Element ve bileşik"** (3 yerde önce geçiyor)
- “ağır metal…”: ilk geçtiği yer **kimya/kimya-bilimi kart 10 "Özet"**, tanımı (başka konuda) **kimya/yesil-kimya kart 6 "Ağır metaller ekosistemde"**
- “fiziksel değişim…”: ilk geçtiği yer **kimya/madde kart 6 "Fiziksel ve kimyasal değişim"**, tanımı (başka konuda) **kimya/tepkimeler kart 2 "Atomlar yeniden düzenlenir"** (2 yerde önce geçiyor)
- “yoğunluk…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (aynı konuda) **kimya/madde kart 8 "Yoğunluk"**
- “çözünürlük…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **kimya/cozeltiler kart 13 "Çözünürlük ve doygunluk"** (2 yerde önce geçiyor)
- “elektron…”: ilk geçtiği yer **kimya/atom-modelleri kart 3 "Dalton: İçi dolu küre"**, tanımı (başka konuda) **kimya/atomun-yapisi kart 1 "Üç temel tanecik"** (6 yerde önce geçiyor)
- “izotop…”: ilk geçtiği yer **kimya/atom-modelleri kart 3 "Dalton: İçi dolu küre"**, tanımı (başka konuda) **kimya/atomun-yapisi kart 5 "İzotoplar"**
- “katot…”: ilk geçtiği yer **kimya/atom-modelleri kart 4 "Thomson: Üzümlü kek"**, tanımı (başka konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (3 yerde önce geçiyor)
- “soy gazlar…”: ilk geçtiği yer **kimya/atomun-yapisi kart 11 "Değerlik elektronu"**, tanımı (başka konuda) **kimya/periyodik-tablo kart 4 "Metaller, ametaller, soy gazlar"**
- “hidrojen bağı…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 2 "Güçlü ve zayıf etkileşimler"**, tanımı (aynı konuda) **kimya/kimyasal-baglar kart 13 "Hidrojen bağı"**
- “iyonik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 2 "Güçlü ve zayıf etkileşimler"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (2 yerde önce geçiyor)
- “metalik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 2 "Güçlü ve zayıf etkileşimler"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (2 yerde önce geçiyor)
- “molek…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 4 "İyonik bağ ve iyon örgüsü"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (6 yerde önce geçiyor)
- “elektroliz…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 14 "Fiziksel mi, kimyasal mı?"**, tanımı (başka konuda) **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"** (2 yerde önce geçiyor)
- “elmas…”: ilk geçtiği yer **kimya/maddenin-halleri kart 3 "Kristal katı türleri"**, tanımı (başka konuda) **kimya/organik-giris kart 5 "Allotroplar: elmas ve grafit"**
- “çözüc…”: ilk geçtiği yer **kimya/karisimlar kart 9 "Çözünürlük farkı"**, tanımı (başka konuda) **kimya/cozeltiler kart 1 "Hatırla: çözücü, çözünen"** (3 yerde önce geçiyor)
- “basit formül…”: ilk geçtiği yer **kimya/temel-kanunlar kart 8 "Katlı oran ne zaman yoktur?"**, tanımı (başka konuda) **kimya/mol kart 7 "Basit (en basit) formül"**
- “redoks…”: ilk geçtiği yer **kimya/tepkimeler kart 13 "Özet"**, tanımı (başka konuda) **kimya/redoks kart 7 "Redoks mu, değil mi?"**
- “kütlece yüzde…”: ilk geçtiği yer **kimya/mol kart 6 "Kütlece yüzde bileşim"**, tanımı (başka konuda) **kimya/cozeltiler kart 4 "Yüzde derişim ve ppm"**
- “asidik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “bazik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “endotermik…”: ilk geçtiği yer **kimya/cozeltiler kart 16 "Özet"**, tanımı (başka konuda) **kimya/tepkime-enerjisi kart 2 "Gündelik örnekler"**
- “fotosentez…”: ilk geçtiği yer **kimya/tepkime-enerjisi kart 2 "Gündelik örnekler"**, tanımı (başka konuda) **kimya/redoks kart 15 "Günlük hayatta redoks"**
- “katalizör…”: ilk geçtiği yer **kimya/tepkime-hizi kart 14 "Katalizör"**, tanımı (başka konuda) **kimya/kimyasal-denge kart 10 "Sıcaklık ve katalizör"** (3 yerde önce geçiyor)
- “tuz köprüs…”: ilk geçtiği yer **kimya/elektrokimya kart 1 "Galvanik pil: Daniell pili"**, tanımı (aynı konuda) **kimya/elektrokimya kart 2 "Tuz köprüsü ve pil gösterimi"**
- “anotta…”: ilk geçtiği yer **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**, tanımı (aynı konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (2 yerde önce geçiyor)
- “fonksiyonel grup…”: ilk geçtiği yer **kimya/organik-giris kart 14 "Yapı izomerliği"**, tanımı (başka konuda) **kimya/fonksiyonel-gruplar kart 1 "Fonksiyonel grup nedir?"**
- “alkan…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 2 "Alkanlar ve ilk 10 alkan"**
- “alken…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 7 "Alkenler: çift bağ"**
- “alkin…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 11 "Alkinler: üçlü bağ"**
- “aldehit…”: ilk geçtiği yer **kimya/fonksiyonel-gruplar kart 4 "Alkollerin yükseltgenmesi"**, tanımı (aynı konuda) **kimya/fonksiyonel-gruplar kart 8 "Aldehit ve keton: karbonil grubu"**
- “jeotermal…”: ilk geçtiği yer **kimya/enerji-kaynaklari kart 1 "Enerji kaynakları nasıl sınıflanır?"**, tanımı (aynı konuda) **kimya/enerji-kaynaklari kart 6 "Su, jeotermal ve dalga"**
- “popülasyon…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 9 "Adaptasyon ve evrim"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 1 "Popülasyon: yoğunluk ve dağılım"** (2 yerde önce geçiyor)
- “boşaltım…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 14 "Özet"**, tanımı (başka konuda) **biyoloji/bosaltim kart 1 "Boşaltım ve iç denge"**
- “hücre zarı…”: ilk geçtiği yer **biyoloji/biyomolekuller kart 7 "Fosfolipit ve steroitler"**, tanımı (başka konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**
- “tükürük…”: ilk geçtiği yer **biyoloji/enzimler kart 10 "Aktivatörler ve tersinir tepkimeler"**, tanımı (başka konuda) **biyoloji/sindirim kart 3 "Ağız: dişler ve tükürük"** (2 yerde önce geçiyor)
- “amilaz…”: ilk geçtiği yer **biyoloji/enzimler kart 10 "Aktivatörler ve tersinir tepkimeler"**, tanımı (başka konuda) **biyoloji/sindirim kart 6 "Onikiparmak bağırsağı ve pankreas"**
- “sitoplazm…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**
- “çekirdek…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 4 "Çekirdek: yönetim merkezi"**
- “ribozom…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum"** (2 yerde önce geçiyor)
- “mantar…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (başka konuda) **biyoloji/siniflandirma kart 9 "Ökaryot âlemler"**
- “seçici geçirgen…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**, tanımı (başka konuda) **biyoloji/madde-gecisi kart 2 "Seçici geçirgenlik"**
- “alyuvar…”: ilk geçtiği yer **biyoloji/madde-gecisi kart 6 "Hayvan hücresi: üç ortam"**, tanımı (başka konuda) **biyoloji/dolasim-bagisiklik kart 7 "Kanın yapısı"** (2 yerde önce geçiyor)
- “memel…”: ilk geçtiği yer **biyoloji/siniflandirma kart 2 "Yapay ve doğal sınıflandırma"**, tanımı (başka konuda) **biyoloji/hayvanlar-alemi kart 12 "Memeliler"**
- “ayrıştırıc…”: ilk geçtiği yer **biyoloji/siniflandirma kart 11 "Mantarlar ve likenler"**, tanımı (başka konuda) **biyoloji/ekosistem kart 3 "Üretici, tüketici, ayrıştırıcı"**
- “omurilik…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/sinir-sistemi kart 11 "Omurilik ve refleks yayı"**
- “sinir sistem…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/endokrin kart 4 "Sinirsel ve hormonal düzenleme"** (2 yerde önce geçiyor)
- “kromozom…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 6 "Döl almaşı: gametofit ve sporofit"**, tanımı (başka konuda) **biyoloji/mitoz kart 2 "Kromozom, kromatit, sentromer"**
- “meyve…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 9 "Açık tohumlular"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 13 "Tohum, meyve ve çimlenme"** (4 yerde önce geçiyor)
- “endosperm…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 10 "Kapalı tohumlular"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 12 "Çiçek, tozlaşma, çift döllenme"**
- “yumurtalık…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 10 "Kapalı tohumlular"**, tanımı (başka konuda) **biyoloji/ureme-sistemi kart 4 "Dişi üreme sistemi"** (2 yerde önce geçiyor)
- “sitokinez…”: ilk geçtiği yer **biyoloji/mitoz kart 1 "Hücre döngüsü: interfaz ve M"**, tanımı (aynı konuda) **biyoloji/mitoz kart 6 "Telofaz ve sitokinez"**
- “sitok…”: ilk geçtiği yer **biyoloji/mitoz kart 1 "Hücre döngüsü: interfaz ve M"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 10 "Bitki hormonları"** (3 yerde önce geçiyor)
- “renk körlüğ…”: ilk geçtiği yer **biyoloji/kalitim kart 10 "X'e bağlı çekinik kalıtım"**, tanımı (başka konuda) **biyoloji/duyu-organlari kart 9 "Astigmatizm, katarakt, renk körlüğü"**
- “mutasyon…”: ilk geçtiği yer **biyoloji/kalitim kart 13 "Çok genli kalıtım ve çeşitlilik"**, tanımı (aynı konuda) **biyoloji/kalitim kart 15 "Modifikasyon ve mutasyon"**
- “kaynak…”: ilk geçtiği yer **biyoloji/ekosistem kart 2 "Habitat ve ekolojik niş"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 9 "Besin taşınması: kaynak ve havuz"**
- “kemosentez…”: ilk geçtiği yer **biyoloji/ekosistem kart 3 "Üretici, tüketici, ayrıştırıcı"**, tanımı (başka konuda) **biyoloji/fotosentez kart 11 "Kemosentez"**
- “terlem…”: ilk geçtiği yer **biyoloji/ekosistem kart 8 "Su ve karbon döngüsü"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 7 "Terleme çekimi: kohezyon, adezyon"**
- “fosil…”: ilk geçtiği yer **biyoloji/ekosistem kart 10 "Kirlilik ve asit yağmuru"**, tanımı (başka konuda) **biyoloji/evrim kart 14 "Kanıtlar: fosiller ve yapılar"**
- “anemi…”: ilk geçtiği yer **biyoloji/dna-genetik-kod kart 10 "Mutasyonlar"**, tanımı (başka konuda) **biyoloji/dolasim-bagisiklik kart 15 "Bağışıklık ve dolaşım bozuklukları"**
- “ön hipofiz…”: ilk geçtiği yer **biyoloji/endokrin kart 6 "Hipotalamus ve arka hipofiz"**, tanımı (aynı konuda) **biyoloji/endokrin kart 7 "Ön hipofiz: bezlerin yöneticisi"**
- “aldosteron…”: ilk geçtiği yer **biyoloji/endokrin kart 10 "Böbrek üstü bezleri"**, tanımı (başka konuda) **biyoloji/bosaltim kart 13 "ADH ve aldosteron"**
- “bikarbonat…”: ilk geçtiği yer **biyoloji/endokrin kart 15 "Mide, bağırsak ve yağ hormonları"**, tanımı (başka konuda) **biyoloji/solunum kart 10 "CO₂'nin taşınması"** (2 yerde önce geçiyor)
- “kırmızı ilik…”: ilk geçtiği yer **biyoloji/destek-hareket kart 1 "İskelet: görevleri ve bölümleri"**, tanımı (aynı konuda) **biyoloji/destek-hareket kart 4 "Kemik iliği: kırmızı ve sarı"**
- “salgılam…”: ilk geçtiği yer **biyoloji/sindirim kart 4 "Yutak ve yemek borusu"**, tanımı (başka konuda) **biyoloji/bosaltim kart 11 "3. adım: salgılama ve pH"** (2 yerde önce geçiyor)
- “birincil…”: ilk geçtiği yer **biyoloji/ureme-sistemi kart 3 "Spermatogenez ve spermin yapısı"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 13 "Ekolojik süksesyon"**

## 3. Konu sırası

### Zordan kolaya giden konular

Kartların zorluğu konu ilerledikçe azalıyor (eğilim −1'e yakınsa belirgin). Zor kartları sona almak ya da ilk kartları sadeleştirmek düşünülebilir.

- **kimya/periyodik-tablo** “Periyodik tablo”: eğilim -0.65, kart zorlukları [35.3, 26.7, 27.2, 36.3, 22.1, 12.8, 14.2, 19.7, 26.6, 21.2, 18.1]
- **biyoloji/hayvanlar-alemi** “Hayvanlar âlemi: omurgasız ve omurgalılar”: eğilim -0.61, kart zorlukları [14.9, 43.8, 39.5, 37.3, 27.8, 28.1, 27.3, 26.6, 27.8, 21.8, 11.6, 26.7, 18.4, 13.9]
- **fizik/basit-makineler** “Basit makineler”: eğilim -0.59, kart zorlukları [33.3, 26.2, 20.9, 28.0, 23.4, 22.9, 29.1, 17.5, 12.8, 31.1, 22.1, 18.5, 18.1, 16.2]
- **fizik/kuantum** “Kuantum fiziğine giriş”: eğilim -0.45, kart zorlukları [29.9, 36.9, 36.6, 27.5, 20.8, 17.2, 10.4, 16.6, 17.4, 28.0, 22.4, 27.8, 18.2, 22.8, 10.8]
- **biyoloji/fotosentez** “Fotosentez ve kemosentez”: eğilim -0.42, kart zorlukları [19.4, 22.1, 24.4, 30.2, 24.3, 16.3, 27.0, 13.6, 11.1, 15.9, 23.9, 16.7]
- **fizik/is-enerji-guc** “İş, enerji ve güç”: eğilim -0.35, kart zorlukları [30.8, 23.0, 18.5, 40.6, 26.1, 20.4, 28.6, 25.5, 19.5, 13.8, 27.0, 19.6]

### İlk kartı fazla zor olan konular

Konuya girişte öğrenci en kolay yerden başlamalı. İlk kart, konunun ortanca zorluğundan belirgin zor.

- **fizik/dalgalar** ilk kart “Dalga: enine ve boyuna” zorluk 37.4 (ortancadan +16.4)
- **kimya/hidrokarbonlar** ilk kart “Hidrokarbon nedir?” zorluk 35.5 (ortancadan +15.4)
- **biyoloji/kalitim** ilk kart “Gen, alel ve lokus” zorluk 38.7 (ortancadan +15.4)

### Ön koşulundan kolay görünen konular

Bir konu, üzerine kurulduğu konudan belirgin kolaysa sıra ters olabilir ya da ön koşul konusu gereğinden ağır yazılmış olabilir.

Yok.

## 4. En zor metinli kartlar

Ateşman puanı 40'ın altında olan kartlar, en zordan başlayarak (ilk 30).

| Kart | Ateşman | Cümle başına kelime |
|---|---|---|
| kimya/yesil-kimya kart 4 "Atıktan gümüş nanoparçacık" | 18 | 18.0 |
| kimya/kimya-bilimi kart 7 "Tehlike işaretleri" | 19 | 22.0 |
| biyoloji/sinir-sistemi kart 15 "Sinir sistemi sağlığı" | 22 | 15.0 |
| biyoloji/canlilarin-ozellikleri kart 12 "Biyolojide dönüm noktaları" | 23 | 23.0 |
| fizik/elektrostatik kart 11 "İki yükün alanı ve potansiyeli" | 25 | 17.0 |
| biyoloji/mayoz kart 9 "Çeşitliliğin kaynakları" | 26 | 18.0 |
| fizik/isi-sicaklik kart 8 "Karışımda buz kalır mı?" | 26 | 24.0 |
| biyoloji/hucresel-solunum kart 2 "Fosforilasyon: ATP nasıl yapılır?" | 26 | 8.0 |
| kimya/modern-atom-teorisi kart 3 "n ve ℓ: katman ve alt katman" | 26 | 20.0 |
| kimya/tepkime-hizi kart 9 "Hız sabitinin birimi" | 26 | 20.0 |
| biyoloji/dna-genetik-kod kart 5 "DNA ve RNA farkı" | 28 | 23.0 |
| biyoloji/ekosistem kart 14 "Çözümler ve ekolojik ayak izi" | 28 | 9.5 |
| biyoloji/sindirim kart 7 "Proteazların etkinleşme zinciri" | 29 | 9.0 |
| fizik/bir-boyutta-hareket kart 11 "Grafikler arası geçiş" | 30 | 24.0 |
| biyoloji/evrim kart 6 "Hardy–Weinberg dengesi" | 32 | 21.0 |
| kimya/cozeltiler kart 11 "Kaynama yükselir, donma düşer" | 33 | 21.0 |
| fizik/bagil-hareket kart 11 "Geçiş süresi ve sürüklenme" | 34 | 20.0 |
| biyoloji/endokrin kart 9 "Kalsiyum dengesi ve paratiroit" | 35 | 9.0 |
| biyoloji/dolasim-bagisiklik kart 9 "Kan grupları ve kan nakli" | 35 | 8.0 |
| fizik/kaldirma-kuvveti kart 2 "Arşimet ilkesi" | 35 | 15.0 |
| fizik/elektriksel-enerji kart 2 "Elektriksel enerji: W = V·I·t" | 36 | 21.0 |
| kimya/tepkime-hizi kart 15 "Katalizör türleri ve inhibitör" | 37 | 9.0 |
| biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum" | 38 | 6.3 |
| fizik/radyoaktivite kart 9 "Yarı ömür" | 39 | 15.0 |
| biyoloji/duyu-organlari kart 2 "Reseptör türleri ve adaptasyon" | 39 | 9.0 |
| kimya/simya kart 5 "Damıtma: Simyanın yıldızı" | 39 | 10.5 |
| kimya/cozeltiler kart 9 "İyon derişimi" | 39 | 20.0 |
| fizik/fizik-bilimine-giris kart 6 "Temel büyüklükler (SI)" | 40 | 23.0 |
| kimya/kimya-bilimi kart 1 "Kimyanın alanları" | 40 | 8.5 |
| biyoloji/protein-sentezi kart 11 "Poliribozom ve proteinin yolu" | 40 | 9.0 |

## 5. Bir göz atılması önerilenler

20-28 kelimelik cümleler ve tek cümlede 3+ tane 5+ heceli kelime.

- fizik/fizik-bilimine-giris kart 6 "Temel büyüklükler (SI)": 23 kelimelik cümle: “Bu yedi temel büyüklük başka büyüklüklerden türetilmez: uzunluk (m), kütle (kg), zaman (s), akım (A), sıcaklık (K), madde miktarı (mol), ışık şiddeti (cd).”
- fizik/isi-sicaklik kart 8 "Karışımda buz kalır mı?": 24 kelimelik cümle: “Karışımda buz kalıp kalmayacağını bulmak için ısıları karşılaştır: suyun 0 °C'ye inerken verebileceği ısı, buzu eritmeye yetmezse denge 0 °C olur ve buz kalır.”
- fizik/vektorler kart 5 "Bir sayıyla çarpma": 22 kelimelik cümle: “Vektörü k ile çarpınca boyu |k| katına çıkar. k pozitifse yön aynı kalır, negatifse ters döner: −A aynı boyda ama zıt yönlüdür.”
- fizik/bir-boyutta-hareket kart 11 "Grafikler arası geçiş": 24 kelimelik cümle: “x–t eğimi hızı, v–t eğimi ivmeyi verir. v–t altındaki alan Δx'i, a–t altındaki alan Δv'yi verir; eksenin altı eksi sayılır.”
- fizik/bagil-hareket kart 15 "Sık yapılan hatalar": 21 kelimelik cümle: “Dört tuzak: “A'ya göre B”de vA − vB yazmak; zıt yönde hızları çıkarmak; dik hızları düz toplamak; geçiş süresine akıntıyı katmak.”
- fizik/basit-makineler kart 1 "Basit makine nedir?": tek cümlede 3 ağır kelime (büyüklüğünü, değiştirerek, kolaylaştırır): “Basit makine kuvvetin büyüklüğünü, yönünü ya da yolunu değiştirerek işi kolaylaştırır: kaldıraç, makara, eğik düzlem, çıkrık, vida, dişli.”
- fizik/elektrik-akimi kart 10 "Karışık devre adım adım": 23 kelimelik cümle: “Karışık devreyi içten dışa çöz: paralel grupları tek dirence indir, serileri topla, I = V/Reş bul, sonra geri dönüp gerilim ve kol akımlarını hesapla.”
- fizik/elektriksel-enerji kart 2 "Elektriksel enerji: W = V·I·t": 21 kelimelik cümle: “Gerilim 1 C yüke aktarılan enerjidir: 1 V = 1 J/C. t sürede q = I·t yük geçer, harcanan enerji W = V·I·t olur.”
- fizik/manyetizma kart 2 "Tek kutup elde edilemez": tek cümlede 3 ağır kelime (atomlardaki, mıknatısların, dizilmesinden): “Kırılan mıknatısın her parçası yine iki kutupludur: mıknatıslık, atomlardaki küçük mıknatısların aynı yöne dizilmesinden gelir.”
- kimya/simya kart 5 "Damıtma: Simyanın yıldızı": tek cümlede 3 ağır kelime (Simyacıların, geliştirdiği, üretiminde): “Simyacıların geliştirdiği yöntem bugün parfüm ve yakıt üretiminde kullanılır.”
- kimya/kimya-bilimi kart 5 "Günlük hayattaki yaygın adlar": 26 kelimelik cümle: “Bileşiklerin sistematik adı (NaCl: sodyum klorür) yanında yaygın adları da vardır: kireç taşı CaCO₃, tuz ruhu HCl, kezzap HNO₃, zaç yağı H₂SO₄, sud kostik NaOH.”
- kimya/kimya-bilimi kart 6 "Mutfaktan temizliğe yaygın adlar": 23 kelimelik cümle: “Mutfakta ve temizlikte: yemek sodası NaHCO₃, çamaşır sodası Na₂CO₃, potas kostik KOH, amonyak NH₃, göz taşı CuSO₄·5H₂O, çamaşır suyu NaOCl.”
- kimya/kimya-bilimi kart 7 "Tehlike işaretleri": 22 kelimelik cümle: “Kırmızı çerçeveli işaretler tehlikeyi anlatır: alev yanıcı, bomba patlayıcı, alevli daire yakıcı, kurukafa zehirli, ünlem tahriş edici; aşındırıcıda ele damlayan sıvı vardır.”
- kimya/kimya-bilimi kart 9 "Gerekli ve zararlı elementler": tek cümlede 3 ağır kelime (elementlere, hemoglobinde, iletiminde): “Vücut bazı elementlere muhtaçtır: kalsiyum kemikte, demir hemoglobinde, sodyum ve potasyum sinir iletiminde görev alır.”
- kimya/kimya-bilimi kart 10 "Özet": tek cümlede 3 ağır kelime (işaretlerini, laboratuvar, kurallarına): “Tehlike işaretlerini tanı, laboratuvar kurallarına uy.. .”
- kimya/atom-modelleri kart 2 "Democritus: Atomos": tek cümlede 3 ağır kelime (bölünemeyen, taneciklere, ulaşacağını): “Democritus (MÖ 5. yy), maddeyi bölmeye devam edersen bölünemeyen taneciklere ulaşacağını söyledi: atomos.”
- kimya/atom-modelleri kart 4 "Thomson: Üzümlü kek": tek cümlede 3 ağır kelime (ışınlarının, elektronlardan, oluştuğunu): “Thomson 1897'de katot ışınlarının eksi yüklü elektronlardan oluştuğunu gösterdi.”
- kimya/atom-modelleri kart 6 "Rutherford: Altın levha deneyi": tek cümlede 3 ağır kelime (açıklanamazdı, taneciğini, çeviremezdi): “Bu sonuç Thomson modeliyle açıklanamazdı: her yere yayılmış artı yük alfa taneciğini geri çeviremezdi.”
- kimya/modern-atom-teorisi kart 4 "Orbital sayısı ve spin": 21 kelimelik cümle: “mℓ −ℓ'den +ℓ'ye tam sayılardır; her değer bir orbitaldir: s'de 1, p'de 3, d'de 5, f'de 7. ms +½ (↑) ya da −½ (↓) olur.”
- kimya/modern-atom-teorisi kart 13 "Dizilimden periyodik tabloya": 23 kelimelik cümle: “s ya da p ile biten A grubundadır; grup no dış s + p sayısıdır. d ile bitende s + d sayısı B grubunu verir.”
- kimya/modern-atom-teorisi kart 15 "Özet": 27 kelimelik cümle: “Orbital yol değil, olasılık bölgesidir.. . n katman, ℓ alt katman, mℓ yönelim, ms spin.. . n + ℓ küçük önce dolar; Pauli: orbitale en çok 2 e⁻; Hund: önce tek tek.. .”
- kimya/periyodik-tablo kart 3 "Periyot ve grup": tek cümlede 3 ağır kelime (gruptakilerin, elektronları, özellikleri): “Aynı ana gruptakilerin değerlik elektronları ve kimyasal özellikleri benzerdir.”
- kimya/kimyasal-baglar kart 12 "İyon–dipol ve indüklenmiş dipol": tek cümlede 3 ağır kelime (arasındadır, oksijenini, hidrojenini): “İyon–dipol çekimi iyon ile polar molekül arasındadır: tuz çözünürken Na+ suyun δ− oksijenini, Cl− δ+ hidrojenini çeker.”
- kimya/kimyasal-baglar kart 13 "Hidrojen bağı": 26 kelimelik cümle: “Az önce gördüğün çekimi yalnız F, O ya da N'ye bağlı H kurar: H₂O, NH₃, HF arasında hidrojen bağı var; CH₄ ve H₂S'de yok.”
- kimya/maddenin-halleri kart 3 "Kristal katı türleri": 22 kelimelik cümle: “Kristali tutan kuvvet özelliğini belirler: iyonik (NaCl) sert, kırılgan; kovalent ağ (elmas) çok zor erir; moleküler (buz) kolay erir; metalik (Cu) iletir.”
- kimya/tepkimeler kart 4 "Katsayı değişir, indis değişmez": tek cümlede 3 ağır kelime (Denkleştirirken, katsayıları, değiştirirsin): “Denkleştirirken yalnız katsayıları değiştirirsin.”
- kimya/tepkimeler kart 10 "Sentez ve analiz": tek cümlede 3 ağır kelime (elementlerinden, oluşuyorsa, tepkimesidir): “Sentezde iki ya da daha çok madde tek ürün verir; elementlerinden 1 mol bileşik oluşuyorsa oluşum tepkimesidir.”
- kimya/asit-baz kart 13 "Tampon çözelti": 22 kelimelik cümle: “Zayıf asit ile eşlenik bazını (CH₃COOH / CH₃COONa) içeren çözelti tampondur: az asit ya da baz eklenince pH çok az değişir.”
- kimya/gazlar kart 13 "Gerçek gazlar ve sıvılaştırma": tek cümlede 3 ağır kelime (taneciklerinin, aralarında, ideallikten): “Gerçek gaz taneciklerinin hacmi ve aralarında çekim vardır; yüksek basınç ve düşük sıcaklıkta ideallikten saparlar.”
- kimya/cozeltiler kart 11 "Kaynama yükselir, donma düşer": 21 kelimelik cümle: “Uçucu olmayan maddenin çözeltisi daha düşükte donar, daha yüksekte kaynar: ΔT = K·m·i. i tanecik sayısıdır: şeker 1, NaCl 2, CaCl₂ 3.”
- kimya/tepkime-hizi kart 2 "Hız nasıl ölçülür?": 21 kelimelik cümle: “Derişim yerine kolay ölçülen ve tepkimeyle değişen bir özellik izlenir: çıkan gaz hacmi, basınç, renk, iletkenlik ya da açık kapta kütle.”
- kimya/tepkime-hizi kart 7 "Hız denklemi ve derece": tek cümlede 3 ağır kelime (biçimindedir, tepkimelerde, katsayılara): “Hız denklemi hız = k[A]x[B]y biçimindedir. x ve y deneyle bulunur; temel tepkimelerde katsayılara eşittir.”
- kimya/tepkime-hizi kart 16 "Özet": 27 kelimelik cümle: “Etkin çarpışma, yeterli enerji ve uygun yönelim ister.. . ΔH = Ea,ileri − Ea,geri; katalizör Ea'yı düşürür, ΔH'yi değiştirmez.. . hız = k[A]x[B]y; dereceler deneyle bulunur.”
- kimya/tepkime-hizi kart 16 "Özet": tek cümlede 3 ağır kelime (değişimidir, katsayılarla, orantılıdır): “Hız, birim zamandaki derişim değişimidir; hızlar katsayılarla orantılıdır.. .”
- kimya/fonksiyonel-gruplar kart 2 "Alkoller: ad ve sınıf": 22 kelimelik cümle: “−OH doymuş karbona bağlıysa bileşik alkoldür: etanol, 2-propanol. −OH'li karbon 1, 2 ya da 3 karbona bağlıysa alkol 1°, 2°, 3° olur.”
- kimya/enerji-kaynaklari kart 10 "Sürdürülebilirlik ve karbon ayak izi": tek cümlede 4 ağır kelime (Sürdürülebilirlik, ihtiyacını, olanağını, karşılamaktır): “Sürdürülebilirlik, bugünün ihtiyacını gelecek kuşakların olanağını tüketmeden karşılamaktır.”
- kimya/yesil-kimya kart 4 "Atıktan gümüş nanoparçacık": tek cümlede 5 ağır kelime (özütündeki, polifenoller, iyonlarını, nanoparçacık, sarı-kahverengiye): “Çay posası özütündeki polifenoller gümüş nitrattaki Ag⁺ iyonlarını Ag atomuna indirger; atomlar nanoparçacık olarak toplanır, çözelti sarı-kahverengiye döner.”
- kimya/yesil-kimya kart 10 "Biyobozunur polimerler": tek cümlede 3 ağır kelime (nişastasından, fermantasyonla, polimerleşir): “PLA mısır nişastasından yapılır: nişasta şekere, şeker fermantasyonla laktik aside döner, o da polimerleşir.”
- kimya/yesil-kimya kart 13 "Yapay zekâ ve sürdürülebilirlik": tek cümlede 3 ağır kelime (malzemelerini, tarayabilir, yönetebilir): “Öte yandan yapay zekâ yeni pil ve katalizör malzemelerini hızla tarayabilir, şebekeyi verimli yönetebilir.”
- biyoloji/canlilarin-ozellikleri kart 12 "Biyolojide dönüm noktaları": 23 kelimelik cümle: “Bazı keşifler hayatı kökten değiştirdi: hücrenin görülmesi (1665), ilk aşı (1796), mikropların hastalık yapması (1860'lar), penisilin (1928), DNA'nın yapısı (1953), insan genomu (2003).”
- biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum": tek cümlede 3 ağır kelime (ribozomludur, salgılanacak, proteinleri): “Granüllü ER ribozomludur; salgılanacak proteinleri üretip taşır.”
- biyoloji/madde-gecisi kart 1 "Akıcı mozaik zar modeli": tek cümlede 3 ağır kelime (fosfolipittir, aralarında, karbonhidratlar): “Hücre zarı çift sıra fosfolipittir; aralarında proteinler ve karbonhidratlar bulunur.”
- biyoloji/siniflandirma kart 1 "Neden sınıflandırırız?": tek cümlede 3 ağır kelime (Sınıflandırma, özelliklerine, akrabalıkları): “Sınıflandırma, canlıları ortak özelliklerine göre gruplar; böylece tanımak, akrabalıkları görmek ve bilgiyi paylaşmak kolaylaşır.”
- biyoloji/siniflandirma kart 2 "Yapay ve doğal sınıflandırma": tek cümlede 3 ağır kelime (sınıflandırma, akrabalığa, karşılaştırır): “Doğal sınıflandırma akrabalığa bakar; homolog organları, embriyoyu ve DNA'yı karşılaştırır.”
- biyoloji/siniflandirma kart 8 "Bakteriler ve arkeler": tek cümlede 3 ağır kelime (Bakterilerin, peptidoglikan, arkelerinkinde): “Bakterilerin duvarında peptidoglikan var, arkelerinkinde yok.”
- biyoloji/hayvanlar-alemi kart 3 "Süngerler ve sölenterler": tek cümlede 3 ağır kelime (denizanası, tabakalıdır, dokunaçlarındaki): “Sölenterler (denizanası, mercan, hidra) iki hücre tabakalıdır; dokunaçlarındaki yakıcı hücrelerle avlanır.”
- biyoloji/bitkiler-alemi kart 7 "Baskın döl nasıl değişti?": tek cümlede 3 ağır kelime (Tohumlularda, mikroskobiktir, gametofittir): “Tohumlularda gametofit mikroskobiktir: polen erkek, embriyo kesesi dişi gametofittir.”
- biyoloji/kalitim kart 16 "Özet": 21 kelimelik cümle: “Aa × Aa: fenotip 3:1, genotip 1:2:1; dihibritte 9:3:3:1.. . n heterozigot çift: 2n gamet, 3n genotip.. .”
- biyoloji/bitki-biyolojisi kart 2 "Yaprağın iç yapısı": tek cümlede 5 ağır kelime (parankiması, fotosentezin, parankiması, alışverişini, kolaylaştırır): “Sık dizili palizat parankiması fotosentezin çoğunu yapar, gevşek sünger parankiması gaz alışverişini kolaylaştırır.”
- biyoloji/dna-genetik-kod kart 5 "DNA ve RNA farkı": 23 kelimelik cümle: “RNA'da şeker ribozdur, T yerine urasil (U) vardır ve genellikle tek ipliklidir. mRNA bilgiyi taşır, tRNA amino asit getirir, rRNA ribozomun yapısına katılır.”
- biyoloji/protein-sentezi kart 11 "Poliribozom ve proteinin yolu": tek cümlede 3 ağır kelime (proteinlerini, proteinlerini, ribozomları): “Sitoplazma proteinlerini serbest ribozomlar, salgı proteinlerini granüllü ER ribozomları yapar.”
- biyoloji/protein-sentezi kart 14 "Çerçeve kayması": 23 kelimelik cümle: “Bir ya da iki nükleotit eklenir ya da silinirse okuma çerçevesi kayar: sonraki bütün kodonlar değişir, çoğu zaman erken bir dur kodonu çıkar.”
- biyoloji/duyu-organlari kart 2 "Reseptör türleri ve adaptasyon": tek cümlede 4 ağır kelime (mekanoreseptör, termoreseptör, kemoreseptör, fotoreseptör): “Reseptörler uyarıya göre ayrılır: mekanoreseptör (dokunma, ses), termoreseptör, kemoreseptör (tat, koku), fotoreseptör (ışık).”
- biyoloji/sindirim kart 7 "Proteazların etkinleşme zinciri": tek cümlede 6 ağır kelime (pepsinojeni, onikiparmakta, enterokinaz, tripsinojeni, etkinleştirir, diğerlerini): “Midede HCl pepsinojeni, onikiparmakta enterokinaz tripsinojeni etkinleştirir; tripsin diğerlerini açar.”
- biyoloji/evrim kart 1 "Evrim nedir?": tek cümlede 3 ağır kelime (popülasyonun, özelliklerinin, değişmesidir): “Evrim, popülasyonun kalıtsal özelliklerinin kuşaklar boyunca değişmesidir.”
- biyoloji/evrim kart 6 "Hardy–Weinberg dengesi": 21 kelimelik cümle: “Büyük, rastgele çiftleşen; mutasyon, göç ve seçilimin olmadığı popülasyonda frekanslar değişmez: Hardy–Weinberg dengesi. p + q = 1, p² + 2pq + q² = 1.”
- kimya/asit-baz adım 4 "Nötralleşme": 21 kelimelik cümle: “Büretten 0,1 M NaOH ekleyerek 25 mL 0,1 M HCl'yi tam nötralleştir: asit ve bazın mol sayıları eşit olsun.”
- biyoloji/canlilarin-ozellikleri adım 3 "Metabolizma": tek cümlede 3 ağır kelime (moleküllerden, büyüklerini, anabolizma): “Hücre küçük moleküllerden büyüklerini kurar; buna anabolizma (yapım) denir.”
- fizik/elektrostatik adım 6 "Coulomb kuvveti": 26 kelimelik cümle: “İki yük arasındaki kuvvet F = k·q₁·q₂ / r². q₁ = +4 μC. q₂'yi ve uzaklığı ayarla: kuvvet 0,1 N çekme olsun (k ≈ 9·10⁹ N·m²/C²).”
- fizik/kuantum adım 3 "Einstein denklemi ve durdurma gerilimi": 21 kelimelik cümle: “Kopan elektronun en büyük kinetik enerjisi Ek,max = h·f − W; foton enerjisi E(eV) ≈ 1240/λ(nm), sodyumda W = 2,3 eV.”
- kimya/temel-kanunlar adım 1 "Açık kapta kütle": tek cümlede 3 ağır kelime (Lavoisier, tepkimelerde, değişmediğini): “Lavoisier, kapalı kapta yapılan tepkimelerde toplam kütlenin değişmediğini gösterdi.”

## 6. Ders ve konu tablosu

### Fizik: Ateşman 73 (kolay), sınıf düzeyi 6.8, konu zorluk eğilimi 0.29

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Fizik bilimine giriş | 69 | 10.0 | 21.5 | +0.16 |
| 2 | Madde ve özellikleri | 74 | 6.8 | 17.1 | +0.07 |
| 3 | Basınç | 75 | 6.1 | 19.8 | +0.63 |
| 4 | Sıvıların kaldırma kuvveti | 76 | 5.6 | 21.6 | -0.27 |
| 5 | Isı, sıcaklık ve genleşme | 68 | 7.5 | 25.8 | -0.27 |
| 6 | Vektörler | 78 | 7.5 | 18.5 | +0.30 |
| 7 | Bir boyutta hareket | 77 | 5.5 | 21.9 | +0.41 |
| 8 | Newton'un hareket yasaları | 82 | 5.4 | 17.7 | -0.07 |
| 9 | İki boyutta hareket ve atışlar | 80 | 5.2 | 18.5 | +0.27 |
| 10 | Bağıl hareket | 76 | 6.4 | 22.6 | +0.13 |
| 11 | İş, enerji ve güç | 68 | 6.8 | 24.4 | -0.35 |
| 12 | Basit makineler | 75 | 6.2 | 22.9 | -0.59 |
| 13 | Momentum ve çarpışmalar | 75 | 6.3 | 20.1 | -0.03 |
| 14 | Tork, denge ve kütle merkezi | 77 | 6.3 | 18.8 | +0.23 |
| 15 | Çembersel ve dönme hareketi | 75 | 6.0 | 20.3 | +0.44 |
| 16 | Kütle çekimi | 67 | 6.5 | 25.0 | -0.11 |
| 17 | Elektrostatik | 71 | 6.5 | 22.3 | +0.42 |
| 18 | Elektrik akımı ve devreler | 68 | 7.8 | 22.3 | +0.33 |
| 19 | Elektriksel enerji ve güç | 70 | 6.5 | 23.1 | -0.32 |
| 20 | Manyetizma | 77 | 6.6 | 18.2 | -0.02 |
| 21 | Elektromanyetik indüksiyon ve alternatif akım | 68 | 6.9 | 23.4 | -0.01 |
| 22 | Yarı iletkenler ve süper iletkenler | 71 | 7.0 | 20.2 | +0.43 |
| 23 | Basit harmonik hareket | 75 | 6.1 | 17.1 | +0.42 |
| 24 | Titreşimler ve dalgalar | 73 | 7.4 | 21.6 | +0.32 |
| 25 | Deprem ve rezonans | 65 | 8.1 | 22.8 | -0.19 |
| 26 | Optik | 71 | 7.2 | 20.0 | -0.04 |
| 27 | Işığın girişimi ve kırınımı | 75 | 6.3 | 20.1 | -0.30 |
| 28 | Özel görelilik | 74 | 6.2 | 24.3 | +0.05 |
| 29 | Kuantum fiziğine giriş | 71 | 7.5 | 22.9 | -0.45 |
| 30 | Atom çekirdeği ve radyoaktivite | 67 | 7.7 | 25.9 | -0.30 |

### Kimya: Ateşman 70 (kolay), sınıf düzeyi 8.2, konu zorluk eğilimi -0.01

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Simyadan kimyaya | 64 | 8.8 | 22.1 | +0.33 |
| 2 | Kimyanın dili ve güvenliği | 62 | 11.2 | 24.3 | -0.12 |
| 3 | Madde ve özellikleri | 78 | 7.3 | 21.6 | +0.02 |
| 4 | Atom modellerinin tarihi | 63 | 10.3 | 28.4 | -0.10 |
| 5 | Atomun yapısı | 68 | 8.3 | 25.3 | +0.03 |
| 6 | Modern atom teorisi | 69 | 9.2 | 24.4 | +0.02 |
| 7 | Periyodik tablo | 69 | 9.0 | 23.7 | -0.65 |
| 8 | Kimyasal türler arası etkileşimler | 70 | 9.1 | 21.7 | +0.34 |
| 9 | Maddenin halleri | 71 | 7.3 | 26.2 | -0.23 |
| 10 | Karışımlar ve ayırma yöntemleri | 69 | 9.9 | 25.8 | +0.52 |
| 11 | Kimyanın temel kanunları | 64 | 7.4 | 26.3 | +0.05 |
| 12 | Kimyasal tepkimeler ve denklemler | 76 | 7.4 | 20.4 | +0.23 |
| 13 | Mol kavramı ve kimyasal hesaplamalar | 76 | 7.0 | 23.5 | +0.08 |
| 14 | Asitler, bazlar ve tuzlar | 79 | 6.1 | 18.9 | +0.31 |
| 15 | Kimya her yerde | 71 | 8.4 | 19.8 | +0.37 |
| 16 | Gazlar | 73 | 7.5 | 20.3 | +0.19 |
| 17 | Çözeltiler ve çözünürlük | 63 | 7.4 | 27.2 | -0.26 |
| 18 | Kimyasal tepkimelerde enerji | 63 | 8.1 | 26.7 | +0.02 |
| 19 | Tepkime hızı | 65 | 8.7 | 22.3 | -0.15 |
| 20 | Kimyasal denge | 70 | 6.6 | 20.3 | +0.09 |
| 21 | Redoks tepkimeleri | 73 | 6.3 | 21.5 | -0.24 |
| 22 | Elektrokimya | 78 | 5.3 | 23.4 | +0.49 |
| 23 | Karbon ve organik kimyaya giriş | 68 | 9.8 | 24.5 | -0.23 |
| 24 | Hidrokarbonlar | 76 | 6.4 | 21.1 | +0.12 |
| 25 | Fonksiyonel gruplar | 70 | 8.0 | 26.2 | -0.30 |
| 26 | Enerji kaynakları ve bilimsel gelişmeler | 63 | 9.8 | 26.5 | +0.45 |
| 27 | Yeşil kimya ve nanoteknoloji | 61 | 11.2 | 25.0 | +0.00 |

### Biyoloji: Ateşman 68 (orta), sınıf düzeyi 8.0, konu zorluk eğilimi -0.16

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Canlıların ortak özellikleri | 66 | 9.7 | 25.8 | +0.07 |
| 2 | Biyomoleküller | 70 | 6.8 | 24.5 | +0.08 |
| 3 | Enzimler | 66 | 7.3 | 23.8 | -0.13 |
| 4 | Hücre ve organeller | 66 | 8.8 | 28.0 | -0.29 |
| 5 | Hücre zarından madde geçişi | 69 | 8.5 | 25.6 | +0.04 |
| 6 | Canlıların sınıflandırılması | 70 | 8.6 | 22.0 | +0.17 |
| 7 | Hayvanlar âlemi: omurgasız ve omurgalılar | 67 | 8.5 | 26.1 | -0.61 |
| 8 | Bitkiler âlemi ve bitki grupları | 75 | 7.2 | 17.6 | -0.20 |
| 9 | Mitoz ve eşeysiz üreme | 62 | 8.9 | 28.3 | +0.09 |
| 10 | Mayoz ve eşeyli üreme | 71 | 7.3 | 23.2 | +0.30 |
| 11 | Kalıtım (Mendel genetiği) | 66 | 7.7 | 26.4 | -0.16 |
| 12 | Ekosistem ekolojisi ve güncel çevre sorunları | 68 | 8.9 | 27.2 | -0.32 |
| 13 | Bitki biyolojisi | 71 | 7.8 | 27.1 | +0.37 |
| 14 | DNA, eşlenme ve biyoteknoloji | 66 | 8.9 | 26.3 | +0.14 |
| 15 | Protein sentezi | 68 | 8.7 | 22.1 | +0.13 |
| 16 | Fotosentez ve kemosentez | 71 | 7.3 | 20.4 | -0.42 |
| 17 | Hücresel solunum | 71 | 7.9 | 21.2 | -0.08 |
| 18 | Sinir sistemi | 72 | 7.7 | 22.9 | +0.48 |
| 19 | Endokrin sistem | 67 | 7.0 | 22.7 | -0.20 |
| 20 | Duyu organları | 68 | 8.6 | 22.9 | -0.23 |
| 21 | Destek ve hareket sistemi | 72 | 7.2 | 22.7 | +0.73 |
| 22 | Sindirim sistemi | 60 | 10.8 | 24.5 | -0.29 |
| 23 | Dolaşım ve bağışıklık sistemi | 70 | 6.9 | 24.1 | +0.21 |
| 24 | Solunum sistemi | 73 | 5.8 | 22.7 | +0.47 |
| 25 | Boşaltım sistemi | 77 | 6.7 | 16.9 | -0.09 |
| 26 | Üreme sistemi ve embriyonik gelişim | 66 | 6.6 | 22.8 | -0.30 |
| 27 | Komünite ve popülasyon ekolojisi | 67 | 8.1 | 27.9 | +0.18 |
| 28 | Evrim ve doğal seçilim | 60 | 9.2 | 30.2 | +0.34 |

