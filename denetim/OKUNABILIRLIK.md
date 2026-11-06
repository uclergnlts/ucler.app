# Türkçe anlaşılırlık ve zorluk sırası raporu

Bu dosya `npm run okunabilirlik` komutuyla üretilir; elle düzenleme, yeniden çalıştırınca silinir.
Puanlar yol göstericidir. Fen metinlerinde bazı uzun terimler zorunlu olduğundan puan doğal olarak düşer.

## Kısa özet

- 85 konu, 1202 kart, 584 adımlı ders adımı tarandı.
- Tüm kartların Ateşman puanı **74** (kolay), Bezirci-Yılmaz sınıf düzeyi **7.2**.
- Kesin düzeltilmesi önerilen: **0** (28 kelimeyi aşan cümle).
- Bir göz atılması önerilen: **5** uzun ya da ağır kelimeli cümle, **6** zor metinli kart.
- Sıra: **5** konu zordan kolaya gidiyor, **2** konunun ilk kartı fazla zor, **0** konu ön koşulundan belirgin kolay, **78** terim tanıtılmadan önce kullanılıyor.

Puanların anlamı: Ateşman 90+ çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor. Bezirci-Yılmaz yaklaşık sınıf düzeyidir (9-12 lise, 13-16 üniversite). Zorluk 0-100 arasıdır: metin ağırlığı, karttaki yeni terim sayısı, formül/sayı yükü ve uzunluktan hesaplanır.

## 1. Kesin düzeltilmesi önerilenler

28 kelimeyi aşan cümleler. İkiye bölmek genellikle yeter.

Yok.

## 2. Terim tanıtılmadan önce kullanılıyor

Bir terim **kalın** yazılarak tanıtıldığı karttan önce düz metinde geçiyor. Ya tanımı öne al, ya da ilk geçtiği yerde kısaca açıkla. Kelime gündelik anlamıyla geçiyorsa (ör. “hareket”) yok sayılabilir.

- “özkütl…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (aynı konuda) **fizik/madde-ozellikleri kart 3 "Özkütle (yoğunluk)"**
- “eylemsizlik…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **fizik/newton-yasalari kart 3 "1. yasa: eylemsizlik"** (2 yerde önce geçiyor)
- “iletken…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 1 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **fizik/elektrostatik kart 2 "İletken ve yalıtkan"**
- “gerilim…”: ilk geçtiği yer **fizik/madde-ozellikleri kart 9 "Yüzey gerilimi"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"** (2 yerde önce geçiyor)
- “ağırlık…”: ilk geçtiği yer **fizik/kaldirma-kuvveti kart 7 "İple bağlı cisim"**, tanımı (başka konuda) **fizik/newton-yasalari kart 6 "Ağırlık ≠ kütle"** (2 yerde önce geçiyor)
- “ısıya…”: ilk geçtiği yer **fizik/isi-sicaklik kart 16 "Özet"**, tanımı (başka konuda) **fizik/is-enerji-guc kart 7 "Sürtünme: enerji ısıya döner"**
- “zıt yönde…”: ilk geçtiği yer **fizik/bagil-hareket kart 5 "Zıt yönde: hızlar toplanır"**, tanımı (başka konuda) **fizik/manyetizma kart 11 "Paralel akımlı teller"** (2 yerde önce geçiyor)
- “potansiyel…”: ilk geçtiği yer **fizik/is-enerji-guc kart 4 "Potansiyel enerji"**, tanımı (başka konuda) **fizik/elektrostatik kart 10 "Elektriksel potansiyel ve gerilim"** (4 yerde önce geçiyor)
- “kaldıraç…”: ilk geçtiği yer **fizik/basit-makineler kart 1 "Basit makine nedir?"**, tanımı (aynı konuda) **fizik/basit-makineler kart 3 "Kaldıraç ve denge koşulu"**
- “düzgün…”: ilk geçtiği yer **fizik/tork-denge kart 6 "Çubuk ve destek tepkileri"**, tanımı (başka konuda) **fizik/elektrostatik kart 12 "Paralel levhalar: düzgün alan"** (4 yerde önce geçiyor)
- “aynı işaretl…”: ilk geçtiği yer **fizik/elektrostatik kart 1 "Elektrik yükü: (+) ve (−)"**, tanımı (aynı konuda) **fizik/elektrostatik kart 6 "Elektroskop"**
- “ampermetr…”: ilk geçtiği yer **fizik/elektrik-akimi kart 5 "Devre sembolleri"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**
- “voltmetr…”: ilk geçtiği yer **fizik/elektrik-akimi kart 5 "Devre sembolleri"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**
- “iç direnc…”: ilk geçtiği yer **fizik/elektrik-akimi kart 12 "Ampermetre ve voltmetre"**, tanımı (aynı konuda) **fizik/elektrik-akimi kart 13 "Emk ve iç direnç"**
- “fisyon…”: ilk geçtiği yer **fizik/ozel-gorelilik kart 8 "Kütle-enerji eşdeğerliği"**, tanımı (başka konuda) **fizik/radyoaktivite kart 11 "Fisyon ve füzyon"**
- “füzyon…”: ilk geçtiği yer **fizik/ozel-gorelilik kart 8 "Kütle-enerji eşdeğerliği"**, tanımı (başka konuda) **fizik/radyoaktivite kart 11 "Fisyon ve füzyon"**
- “metal…”: ilk geçtiği yer **kimya/simya kart 2 "Hedef 1: Altın yapmak"**, tanımı (başka konuda) **kimya/periyodik-tablo kart 4 "Metaller, ametaller, soy gazlar"** (3 yerde önce geçiyor)
- “bileşik…”: ilk geçtiği yer **kimya/kimya-bilimi kart 4 "Bileşik formülleri"**, tanımı (başka konuda) **kimya/madde kart 4 "Saf madde: Element ve bileşik"** (4 yerde önce geçiyor)
- “ağır metal…”: ilk geçtiği yer **kimya/kimya-bilimi kart 10 "Özet"**, tanımı (başka konuda) **kimya/yesil-kimya kart 6 "Ağır metaller ekosistemde"**
- “fiziksel değişim…”: ilk geçtiği yer **kimya/madde kart 6 "Fiziksel ve kimyasal değişim"**, tanımı (başka konuda) **kimya/tepkimeler kart 2 "Atomlar yeniden düzenlenir"** (2 yerde önce geçiyor)
- “yoğunluk…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (aynı konuda) **kimya/madde kart 8 "Yoğunluk"**
- “çözünürlük…”: ilk geçtiği yer **kimya/madde kart 7 "Ortak ve ayırt edici özellikler"**, tanımı (başka konuda) **kimya/cozeltiler kart 13 "Çözünürlük ve doygunluk"** (2 yerde önce geçiyor)
- “izotop…”: ilk geçtiği yer **kimya/atom-modelleri kart 3 "Dalton: İçi dolu küre"**, tanımı (başka konuda) **kimya/atomun-yapisi kart 5 "İzotoplar"**
- “molek…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 4 "İyonik bağ ve iyon örgüsü"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (6 yerde önce geçiyor)
- “iyonik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 5 "İyonik bileşiğin formülü ve adı"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"** (2 yerde önce geçiyor)
- “elektroliz…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 14 "Fiziksel mi, kimyasal mı?"**, tanımı (başka konuda) **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"** (2 yerde önce geçiyor)
- “metalik…”: ilk geçtiği yer **kimya/kimyasal-baglar kart 15 "Özet"**, tanımı (başka konuda) **kimya/maddenin-halleri kart 3 "Kristal katı türleri"**
- “basit formül…”: ilk geçtiği yer **kimya/temel-kanunlar kart 8 "Katlı oran ne zaman yoktur?"**, tanımı (başka konuda) **kimya/mol kart 7 "Basit (en basit) formül"**
- “molekül sayıs…”: ilk geçtiği yer **kimya/temel-kanunlar kart 10 "Avogadro hipotezi"**, tanımı (başka konuda) **kimya/tepkimeler kart 8 "Tepkimede ne korunur?"**
- “çökelek…”: ilk geçtiği yer **kimya/tepkimeler kart 1 "Kimyasal tepkime nedir?"**, tanımı (aynı konuda) **kimya/tepkimeler kart 11 "Çözünme-çökelme tepkimeleri"**
- “redoks…”: ilk geçtiği yer **kimya/tepkimeler kart 13 "Özet"**, tanımı (başka konuda) **kimya/redoks kart 7 "Redoks mu, değil mi?"**
- “kütlece yüzde…”: ilk geçtiği yer **kimya/mol kart 6 "Kütlece yüzde bileşim"**, tanımı (başka konuda) **kimya/cozeltiler kart 4 "Yüzde derişim ve ppm"**
- “asidik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “bazik…”: ilk geçtiği yer **kimya/asit-baz kart 5 "pH, pOH ve pH ölçeği"**, tanımı (aynı konuda) **kimya/asit-baz kart 15 "Asidik, bazik ve amfoter oksitler"**
- “fotosentez…”: ilk geçtiği yer **kimya/tepkime-enerjisi kart 2 "Gündelik örnekler"**, tanımı (başka konuda) **kimya/redoks kart 15 "Günlük hayatta redoks"**
- “katalizör…”: ilk geçtiği yer **kimya/tepkime-hizi kart 14 "Katalizör"**, tanımı (başka konuda) **kimya/kimyasal-denge kart 10 "Sıcaklık ve katalizör"** (3 yerde önce geçiyor)
- “yükseltgen…”: ilk geçtiği yer **kimya/redoks kart 3 "Basamak kuralları"**, tanımı (aynı konuda) **kimya/redoks kart 6 "İndirgen ve yükseltgen madde"**
- “tuz köprüs…”: ilk geçtiği yer **kimya/elektrokimya kart 1 "Galvanik pil: Daniell pili"**, tanımı (aynı konuda) **kimya/elektrokimya kart 2 "Tuz köprüsü ve pil gösterimi"**
- “katot…”: ilk geçtiği yer **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**, tanımı (aynı konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (2 yerde önce geçiyor)
- “anotta…”: ilk geçtiği yer **kimya/elektrokimya kart 8 "Elektroliz: istemsizi yürütmek"**, tanımı (aynı konuda) **kimya/elektrokimya kart 10 "Sulu çözeltilerin elektrolizi"** (2 yerde önce geçiyor)
- “alkan…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 2 "Alkanlar ve ilk 10 alkan"**
- “alken…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 7 "Alkenler: çift bağ"**
- “alkin…”: ilk geçtiği yer **kimya/hidrokarbonlar kart 1 "Hidrokarbon nedir?"**, tanımı (aynı konuda) **kimya/hidrokarbonlar kart 11 "Alkinler: üçlü bağ"**
- “terlem…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 8 "Homeostazi: iç denge"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 7 "Terleme çekimi: kohezyon, adezyon"** (2 yerde önce geçiyor)
- “popülasyon…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 9 "Adaptasyon ve evrim"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 1 "Popülasyon: yoğunluk ve dağılım"** (2 yerde önce geçiyor)
- “boşaltım…”: ilk geçtiği yer **biyoloji/canlilarin-ozellikleri kart 14 "Özet"**, tanımı (başka konuda) **biyoloji/bosaltim kart 1 "Boşaltım ve iç denge"**
- “hücre zarı…”: ilk geçtiği yer **biyoloji/biyomolekuller kart 7 "Fosfolipit ve steroitler"**, tanımı (başka konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"** (2 yerde önce geçiyor)
- “sabit…”: ilk geçtiği yer **biyoloji/enzimler kart 7 "Substrat ve enzim miktarı"**, tanımı (başka konuda) **biyoloji/hayvanlar-alemi kart 13 "Değişken ve sabit vücut sıcaklığı"** (2 yerde önce geçiyor)
- “tükürük…”: ilk geçtiği yer **biyoloji/enzimler kart 10 "Aktivatörler ve tersinir tepkimeler"**, tanımı (başka konuda) **biyoloji/sindirim kart 3 "Ağız: dişler ve tükürük"** (2 yerde önce geçiyor)
- “sitoplazm…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**
- “çekirdek…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 4 "Çekirdek: yönetim merkezi"**
- “ribozom…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (aynı konuda) **biyoloji/hucre-organeller kart 5 "Ribozom ve endoplazmik retikulum"** (2 yerde önce geçiyor)
- “mantar…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 2 "Prokaryot ve ökaryot"**, tanımı (başka konuda) **biyoloji/siniflandirma kart 9 "Ökaryot âlemler"**
- “seçici geçirgen…”: ilk geçtiği yer **biyoloji/hucre-organeller kart 3 "Hücre zarı ve sitoplazma"**, tanımı (başka konuda) **biyoloji/madde-gecisi kart 2 "Seçici geçirgenlik"**
- “alyuvar…”: ilk geçtiği yer **biyoloji/madde-gecisi kart 6 "Hayvan hücresi: üç ortam"**, tanımı (başka konuda) **biyoloji/dolasim-bagisiklik kart 7 "Kanın yapısı"** (2 yerde önce geçiyor)
- “memel…”: ilk geçtiği yer **biyoloji/siniflandirma kart 2 "Yapay ve doğal sınıflandırma"**, tanımı (başka konuda) **biyoloji/hayvanlar-alemi kart 12 "Memeliler"**
- “arkeler…”: ilk geçtiği yer **biyoloji/siniflandirma kart 7 "Üç üst âlem"**, tanımı (aynı konuda) **biyoloji/siniflandirma kart 8 "Bakteriler ve arkeler"**
- “omurilik…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/sinir-sistemi kart 11 "Omurilik ve refleks yayı"**
- “sinir sistem…”: ilk geçtiği yer **biyoloji/hayvanlar-alemi kart 14 "Hayvanlarda sinir sistemi"**, tanımı (başka konuda) **biyoloji/endokrin kart 4 "Sinirsel ve hormonal düzenleme"** (3 yerde önce geçiyor)
- “kromozom…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 6 "Döl almaşı: gametofit ve sporofit"**, tanımı (başka konuda) **biyoloji/mitoz kart 2 "Kromozom, kromatit, sentromer"**
- “yumurtalık…”: ilk geçtiği yer **biyoloji/bitkiler-alemi kart 10 "Kapalı tohumlular"**, tanımı (başka konuda) **biyoloji/ureme-sistemi kart 4 "Dişi üreme sistemi"** (2 yerde önce geçiyor)
- “sitokinez…”: ilk geçtiği yer **biyoloji/mitoz kart 1 "Hücre döngüsü: interfaz ve M"**, tanımı (aynı konuda) **biyoloji/mitoz kart 6 "Telofaz ve sitokinez"**
- “sitok…”: ilk geçtiği yer **biyoloji/mitoz kart 1 "Hücre döngüsü: interfaz ve M"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 10 "Bitki hormonları"** (3 yerde önce geçiyor)
- “bağımsız dağılım…”: ilk geçtiği yer **biyoloji/mayoz kart 14 "Özet"**, tanımı (başka konuda) **biyoloji/kalitim kart 6 "Bağımsız dağılım: 9:3:3:1"**
- “renk körlüğ…”: ilk geçtiği yer **biyoloji/kalitim kart 10 "X'e bağlı çekinik kalıtım"**, tanımı (başka konuda) **biyoloji/duyu-organlari kart 9 "Astigmatizm, katarakt, renk körlüğü"**
- “mutasyon…”: ilk geçtiği yer **biyoloji/kalitim kart 13 "Çok genli kalıtım ve çeşitlilik"**, tanımı (aynı konuda) **biyoloji/kalitim kart 15 "Modifikasyon ve mutasyon"**
- “kaynak…”: ilk geçtiği yer **biyoloji/kalitim kart 13 "Çok genli kalıtım ve çeşitlilik"**, tanımı (başka konuda) **biyoloji/bitki-biyolojisi kart 9 "Besin taşınması: kaynak ve havuz"** (3 yerde önce geçiyor)
- “kemosentez…”: ilk geçtiği yer **biyoloji/ekosistem kart 3 "Üretici, tüketici, ayrıştırıcı"**, tanımı (başka konuda) **biyoloji/fotosentez kart 11 "Kemosentez"**
- “fosil…”: ilk geçtiği yer **biyoloji/ekosistem kart 10 "Kirlilik ve asit yağmuru"**, tanımı (başka konuda) **biyoloji/evrim kart 14 "Kanıtlar: fosiller ve yapılar"**
- “anemi…”: ilk geçtiği yer **biyoloji/dna-genetik-kod kart 10 "Mutasyonlar"**, tanımı (başka konuda) **biyoloji/dolasim-bagisiklik kart 15 "Bağışıklık ve dolaşım bozuklukları"** (2 yerde önce geçiyor)
- “ön hipofiz…”: ilk geçtiği yer **biyoloji/endokrin kart 6 "Hipotalamus ve arka hipofiz"**, tanımı (aynı konuda) **biyoloji/endokrin kart 7 "Ön hipofiz: bezlerin yöneticisi"**
- “doğum…”: ilk geçtiği yer **biyoloji/endokrin kart 6 "Hipotalamus ve arka hipofiz"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 3 "Doğum, ölüm ve göç"** (5 yerde önce geçiyor)
- “aldosteron…”: ilk geçtiği yer **biyoloji/endokrin kart 10 "Böbrek üstü bezleri"**, tanımı (başka konuda) **biyoloji/bosaltim kart 13 "ADH ve aldosteron"**
- “bikarbonat…”: ilk geçtiği yer **biyoloji/endokrin kart 15 "Mide, bağırsak ve yağ hormonları"**, tanımı (başka konuda) **biyoloji/solunum kart 10 "CO₂'nin taşınması"** (2 yerde önce geçiyor)
- “kırmızı ilik…”: ilk geçtiği yer **biyoloji/destek-hareket kart 1 "İskelet: görevleri ve bölümleri"**, tanımı (aynı konuda) **biyoloji/destek-hareket kart 4 "Kemik iliği: kırmızı ve sarı"**
- “kalın bağırsak…”: ilk geçtiği yer **biyoloji/sindirim kart 2 "Sindirim kanalı ve yardımcı organlar"**, tanımı (başka konuda) **biyoloji/bosaltim kart 5 "Böbreğe yardım eden organlar"** (3 yerde önce geçiyor)
- “salgılam…”: ilk geçtiği yer **biyoloji/sindirim kart 4 "Yutak ve yemek borusu"**, tanımı (başka konuda) **biyoloji/bosaltim kart 11 "3. adım: salgılama ve pH"** (2 yerde önce geçiyor)
- “birincil…”: ilk geçtiği yer **biyoloji/ureme-sistemi kart 3 "Spermatogenez ve spermin yapısı"**, tanımı (başka konuda) **biyoloji/populasyon-komunite kart 13 "Ekolojik süksesyon"**

## 3. Konu sırası

### Zordan kolaya giden konular

Kartların zorluğu konu ilerledikçe azalıyor (eğilim −1'e yakınsa belirgin). Çoğu zaman sebep, temel kavramları tanıtan ilk kartlarda yeni terimin yoğun olmasıdır; bu “önce temel, sonra uygulama” sırası doğrudur. Kart sırasını değiştirmek yerine yoğun kartlarda terimleri iki karta yaymak ya da cümleleri kısaltmak düşünülebilir.

- **kimya/maddenin-halleri** “Maddenin halleri”: eğilim -0.48, kart zorlukları [28.2, 27.7, 30.0, 25.9, 23.6, 22.0, 22.8, 20.4, 15.1, 24.5, 22.3, 27.7]
- **biyoloji/hayvanlar-alemi** “Hayvanlar âlemi: omurgasız ve omurgalılar”: eğilim -0.42, kart zorlukları [14.5, 44.4, 39.3, 38.5, 24.8, 24.2, 26.8, 31.0, 36.0, 23.7, 14.3, 32.9, 24.1, 15.3]
- **kimya/kimya-bilimi** “Kimyanın dili ve güvenliği”: eğilim -0.4, kart zorlukları [29.5, 22.0, 14.8, 19.5, 22.5, 21.4, 20.5, 16.7, 19.5]
- **biyoloji/ekosistem** “Ekosistem ekolojisi ve güncel çevre sorunları”: eğilim -0.39, kart zorlukları [42.4, 32.7, 42.0, 36.8, 17.3, 19.4, 22.7, 32.7, 34.9, 25.4, 30.1, 27.9, 23.6, 38.2, 14.0]
- **biyoloji/fotosentez** “Fotosentez ve kemosentez”: eğilim -0.36, kart zorlukları [18.4, 26.5, 23.3, 33.4, 25.1, 17.1, 33.7, 24.6, 13.2, 15.9, 20.6, 19.5]

### İlk kartı fazla zor olan konular

Konuya girişte öğrenci en kolay yerden başlamalı. İlk kart, konunun ortanca zorluğundan belirgin zor.

- **kimya/hidrokarbonlar** ilk kart “Hidrokarbon nedir?” zorluk 38.7 (ortancadan +19.0)
- **fizik/dalgalar** ilk kart “Dalga: enine ve boyuna” zorluk 34.5 (ortancadan +15.0)

### Ön koşulundan kolay görünen konular

Bir konu, üzerine kurulduğu konudan belirgin kolaysa sıra ters olabilir ya da ön koşul konusu gereğinden ağır yazılmış olabilir.

Yok.

## 4. En zor metinli kartlar

Ateşman puanı 40'ın altında olan kartlar, en zordan başlayarak (ilk 30).

| Kart | Ateşman | Cümle başına kelime |
|---|---|---|
| biyoloji/hucresel-solunum kart 2 "Fosforilasyon: ATP nasıl yapılır?" | 34 | 8.0 |
| biyoloji/sindirim kart 7 "Proteazların etkinleşme zinciri" | 36 | 9.0 |
| kimya/kimya-bilimi kart 1 "Kimyanın alanları" | 37 | 9.0 |
| biyoloji/ekosistem kart 14 "Çözümler ve ekolojik ayak izi" | 37 | 8.3 |
| kimya/tepkime-enerjisi kart 6 "Standart oluşum entalpisi" | 38 | 12.0 |
| biyoloji/duyu-organlari kart 2 "Reseptör türleri ve adaptasyon" | 40 | 9.0 |

## 5. Bir göz atılması önerilenler

20-28 kelimelik cümleler ve tek cümlede 3+ tane 6+ heceli kelime.

- fizik/bagil-hareket kart 7 "Yere göre hız: hızları topla": 25 kelimelik cümle: “Tren 20 m/s hızla giderken içinde ileri doğru 2 m/s hızla yürüyen yolcu yere göre 22 m/s, geri yürüyen yolcu ise 18 m/s hızla gider.”
- kimya/kimya-bilimi kart 6 "Mutfaktan temizliğe yaygın adlar": 22 kelimelik cümle: “Bunlar yemek sodası NaHCO₃, çamaşır sodası Na₂CO₃, potas kostik KOH, amonyak NH₃, göz taşı CuSO₄·5H₂O ve çamaşır suyu NaOCl'dir.”
- kimya/tepkime-enerjisi kart 15 "Özet": tek cümlede 3 ağır kelime (entalpilerinden, girenlerinkinin, çıkarılmasıyla): “ΔH, ürünlerin oluşum entalpilerinden girenlerinkinin çıkarılmasıyla bulunur.”
- kimya/organik-giris kart 7 "Hibritleşme: sp³, sp², sp": 22 kelimelik cümle: “Dört tekli bağ yapan C sp³ (109,5°), ikili bağ yapan C sp² (120°), üçlü bağ yapan C ise sp (180°) hibritleşir.”
- biyoloji/duyu-organlari kart 2 "Reseptör türleri ve adaptasyon": tek cümlede 4 ağır kelime (Mekanoreseptörler, termoreseptörler, kemoreseptörler, fotoreseptörler): “Mekanoreseptörler dokunma ve sesi, termoreseptörler sıcaklığı, kemoreseptörler tat ve kokuyu, fotoreseptörler ise ışığı algılar.”

## 6. Ders ve konu tablosu

### Fizik: Ateşman 77 (kolay), sınıf düzeyi 6.2, konu zorluk eğilimi 0.24

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Fizik bilimine giriş | 73 | 8.0 | 20.1 | -0.17 |
| 2 | Madde ve özellikleri | 77 | 6.4 | 17.3 | +0.32 |
| 3 | Basınç | 79 | 5.7 | 17.8 | +0.59 |
| 4 | Sıvıların kaldırma kuvveti | 81 | 5.0 | 19.4 | -0.34 |
| 5 | Isı, sıcaklık ve genleşme | 74 | 6.5 | 23.5 | -0.31 |
| 6 | Vektörler | 80 | 6.6 | 18.7 | +0.64 |
| 7 | Bir boyutta hareket | 79 | 5.8 | 19.3 | -0.15 |
| 8 | Newton'un hareket yasaları | 85 | 5.3 | 16.2 | +0.00 |
| 9 | İki boyutta hareket ve atışlar | 83 | 5.0 | 16.0 | +0.43 |
| 10 | Bağıl hareket | 77 | 6.8 | 20.3 | -0.02 |
| 11 | İş, enerji ve güç | 73 | 6.4 | 22.3 | -0.33 |
| 12 | Basit makineler | 76 | 6.6 | 22.1 | -0.31 |
| 13 | Momentum ve çarpışmalar | 78 | 5.9 | 18.1 | +0.05 |
| 14 | Tork, denge ve kütle merkezi | 79 | 6.5 | 18.3 | +0.51 |
| 15 | Çembersel ve dönme hareketi | 81 | 5.8 | 18.5 | +0.38 |
| 16 | Kütle çekimi | 73 | 6.2 | 23.6 | -0.06 |
| 17 | Elektrostatik | 76 | 5.9 | 21.8 | +0.35 |
| 18 | Elektrik akımı ve devreler | 74 | 7.4 | 21.0 | +0.25 |
| 19 | Elektriksel enerji ve güç | 77 | 5.4 | 20.4 | -0.20 |
| 20 | Manyetizma | 80 | 6.3 | 19.4 | -0.16 |
| 21 | Elektromanyetik indüksiyon ve alternatif akım | 72 | 6.4 | 22.0 | -0.05 |
| 22 | Yarı iletkenler ve süper iletkenler | 75 | 6.0 | 18.7 | +0.05 |
| 23 | Basit harmonik hareket | 80 | 5.3 | 16.4 | +0.33 |
| 24 | Titreşimler ve dalgalar | 81 | 5.6 | 18.6 | +0.01 |
| 25 | Deprem ve rezonans | 74 | 6.1 | 21.2 | -0.02 |
| 26 | Optik | 81 | 5.7 | 18.6 | -0.07 |
| 27 | Işığın girişimi ve kırınımı | 78 | 6.0 | 17.5 | -0.14 |
| 28 | Özel görelilik | 79 | 5.7 | 21.7 | +0.02 |
| 29 | Kuantum fiziğine giriş | 74 | 7.1 | 22.9 | -0.25 |
| 30 | Atom çekirdeği ve radyoaktivite | 75 | 6.1 | 22.5 | -0.25 |

### Kimya: Ateşman 72 (kolay), sınıf düzeyi 7.7, konu zorluk eğilimi -0.05

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Simyadan kimyaya | 67 | 8.4 | 21.2 | +0.33 |
| 2 | Kimyanın dili ve güvenliği | 68 | 9.1 | 20.7 | -0.40 |
| 3 | Madde ve özellikleri | 75 | 8.2 | 23.2 | +0.12 |
| 4 | Atom modellerinin tarihi | 69 | 8.6 | 22.8 | -0.04 |
| 5 | Atomun yapısı | 70 | 7.9 | 23.3 | +0.00 |
| 6 | Modern atom teorisi | 72 | 8.6 | 26.7 | +0.36 |
| 7 | Periyodik tablo | 67 | 9.1 | 26.0 | -0.13 |
| 8 | Kimyasal türler arası etkileşimler | 75 | 7.9 | 20.9 | -0.17 |
| 9 | Maddenin halleri | 75 | 6.4 | 24.2 | -0.48 |
| 10 | Karışımlar ve ayırma yöntemleri | 71 | 9.2 | 27.1 | -0.02 |
| 11 | Kimyanın temel kanunları | 66 | 8.3 | 25.9 | +0.09 |
| 12 | Kimyasal tepkimeler ve denklemler | 75 | 7.0 | 23.7 | +0.10 |
| 13 | Mol kavramı ve kimyasal hesaplamalar | 75 | 6.6 | 23.9 | +0.24 |
| 14 | Asitler, bazlar ve tuzlar | 82 | 5.5 | 18.6 | +0.23 |
| 15 | Kimya her yerde | 70 | 9.2 | 21.2 | +0.24 |
| 16 | Gazlar | 71 | 7.7 | 22.9 | +0.12 |
| 17 | Çözeltiler ve çözünürlük | 69 | 7.1 | 24.9 | -0.11 |
| 18 | Kimyasal tepkimelerde enerji | 64 | 8.7 | 25.2 | +0.02 |
| 19 | Tepkime hızı | 71 | 7.3 | 21.0 | -0.14 |
| 20 | Kimyasal denge | 73 | 6.5 | 20.1 | -0.15 |
| 21 | Redoks tepkimeleri | 72 | 6.8 | 24.6 | -0.24 |
| 22 | Elektrokimya | 82 | 5.2 | 21.7 | +0.30 |
| 23 | Karbon ve organik kimyaya giriş | 74 | 8.0 | 22.7 | -0.10 |
| 24 | Hidrokarbonlar | 78 | 6.7 | 21.5 | +0.13 |
| 25 | Fonksiyonel gruplar | 75 | 7.0 | 23.4 | +0.07 |
| 26 | Enerji kaynakları ve bilimsel gelişmeler | 69 | 8.0 | 24.3 | +0.20 |
| 27 | Yeşil kimya ve nanoteknoloji | 68 | 9.0 | 22.7 | -0.19 |

### Biyoloji: Ateşman 71 (kolay), sınıf düzeyi 7.5, konu zorluk eğilimi -0.14

| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |
|---|---|---|---|---|---|
| 1 | Canlıların ortak özellikleri | 67 | 8.4 | 28.4 | -0.19 |
| 2 | Biyomoleküller | 69 | 7.8 | 28.0 | +0.11 |
| 3 | Enzimler | 69 | 7.1 | 25.1 | +0.44 |
| 4 | Hücre ve organeller | 73 | 6.7 | 27.9 | -0.24 |
| 5 | Hücre zarından madde geçişi | 74 | 7.1 | 26.3 | +0.67 |
| 6 | Canlıların sınıflandırılması | 74 | 7.4 | 21.6 | -0.17 |
| 7 | Hayvanlar âlemi: omurgasız ve omurgalılar | 68 | 8.4 | 27.8 | -0.42 |
| 8 | Bitkiler âlemi ve bitki grupları | 73 | 7.3 | 20.7 | -0.16 |
| 9 | Mitoz ve eşeysiz üreme | 71 | 7.7 | 25.9 | -0.17 |
| 10 | Mayoz ve eşeyli üreme | 74 | 6.3 | 23.0 | +0.14 |
| 11 | Kalıtım (Mendel genetiği) | 68 | 8.3 | 27.8 | -0.19 |
| 12 | Ekosistem ekolojisi ve güncel çevre sorunları | 71 | 8.5 | 29.3 | -0.39 |
| 13 | Bitki biyolojisi | 76 | 6.4 | 27.3 | +0.04 |
| 14 | DNA, eşlenme ve biyoteknoloji | 69 | 7.7 | 28.2 | +0.43 |
| 15 | Protein sentezi | 76 | 6.0 | 21.0 | +0.03 |
| 16 | Fotosentez ve kemosentez | 70 | 7.6 | 22.6 | -0.36 |
| 17 | Hücresel solunum | 71 | 8.0 | 23.2 | -0.04 |
| 18 | Sinir sistemi | 72 | 7.6 | 27.3 | +0.48 |
| 19 | Endokrin sistem | 72 | 6.7 | 22.9 | -0.01 |
| 20 | Duyu organları | 70 | 9.1 | 22.6 | +0.09 |
| 21 | Destek ve hareket sistemi | 74 | 7.1 | 26.6 | +0.20 |
| 22 | Sindirim sistemi | 64 | 8.6 | 25.5 | -0.06 |
| 23 | Dolaşım ve bağışıklık sistemi | 71 | 7.2 | 25.9 | +0.20 |
| 24 | Solunum sistemi | 74 | 6.2 | 23.7 | +0.36 |
| 25 | Boşaltım sistemi | 81 | 6.6 | 16.8 | -0.17 |
| 26 | Üreme sistemi ve embriyonik gelişim | 69 | 6.5 | 23.5 | -0.12 |
| 27 | Komünite ve popülasyon ekolojisi | 70 | 7.9 | 28.3 | -0.04 |
| 28 | Evrim ve doğal seçilim | 67 | 9.3 | 29.1 | +0.26 |

