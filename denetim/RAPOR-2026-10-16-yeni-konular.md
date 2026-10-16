# Yeni konuların denetimi: 2026-10-16

Denetleyen: Codex. İncelenen sürüm: `002f96c` (59 yeni konu, 236 yeni soru). Codex'in tam raporu proje sohbetinde; bu dosya bulguların özetini ve uygulamayı tutar.

## Sonuç

6 kritik, 4 orta, 1 küçük bulgu; Codex düzeltme yapmadı. Kontroller (`tools/check.py`, `npm run lint`, `npm run build`, `tools/ekran.js`, 308 sorunun tarayıcıda cevaplanması) geçti. Önceki raporun Y01–Y08 bulguları kapandı (Y06'nın kalan kısmı N11).

## Bulgular

| # | Önem | Yer | Sorun |
|---|---|---|---|
| N01 | Kritik | Fizik › Optik › kart 10 | İşaretli uzaklıkla büyütme `h_g/h_c = d_g/d_c` uyumsuz; sanal görüntüde yanlış sınıflandırma. |
| N02 | Kritik | Kimya › Asit-baz › kart 11 | Eşdeğerlik, başlangıçtaki serbest H₃O⁺ molüyle tanımlanmış; zayıf asitte yanlış. |
| N03 | Kritik | Biyoloji › Solunum sistemi › kart 1 | “ATP her hücrenin mitokondrisinde üretilir” genellemesi; glikoliz ve alyuvar dışlanmış. |
| N04 | Kritik | Kimya › Fonksiyonel gruplar › kart 2 | “−OH taşıyan bileşik alkoldür” fenol ve karboksilik asidi de kapsıyor. |
| N05 | Kritik | Kimya › Fonksiyonel gruplar › kart 9, özet | Bütün aldehitler Fehling verir deniyor; benzaldehit istisnası yok. |
| N06 | Kritik | Kimya › Hidrokarbonlar › kart 6 | Bromlu su sikloalkan–alkeni koşulsuz ayırır deniyor; siklopropan istisna. |
| N07 | Orta | Biyoloji › Dolaşım › kart 9 | Genel verici/alıcı kuralında alyuvar–plazma ayrımı yok. |
| N08 | Orta | Biyoloji › Kalıtım › kart 8 | Anti-D koşulsuz önleme gibi anlatılmış. |
| N09 | Orta | Fizik › Dalgalar › kart 11 | Şiddet (W/m²) ile şiddet düzeyi (dB) karıştırılmış. |
| N10 | Öneri | Kapsam | BHH hesapları, dalga optiği, hayvan ve bitki grupları eksik; 4 soru her kartı ölçmüyor. |
| N11 | Küçük | Profil | Depolama engelliyken verinin yenilemede de silindiği söylenmiyor. |

## Claude'un uygulaması (2026-10-16)

| # | Ne yapıldı |
|---|---|
| N01 | Kart: `m = −d_g/d_c`, boy oranı `|m|`; not: “m negatifse ters, pozitifse düz; |m| > 1 ise büyük”. Görsel iki örnekle yeniden çizildi: çukur ayna (d_g = +15 cm, m = −0,5: gerçek, ters, yarı boy) ve yakınsak mercek (d_g = −10 cm, m = +2: sanal, düz, 2 kat). Soru 1 açıklaması `m = −2`. |
| N02 | “Eklenen baz, asidin tamamıyla tepkime oranına göre eşleşince… Zayıf asitte de yalnız serbest H₃O⁺ değil, toplam asit sayılır.” Görsele “25 mL 0,1 M CH₃COOH de 25 mL ister” eklendi; soru 3 ile tutarlı. |
| N03 | “Glikoliz sitoplazmada, oksijenli evreler mitokondride yürür.” Görsel: “sitoplazma + mitokondri”, “ATP'yi her canlı hücre (akciğer hücreleri dahil) kendi içinde üretir”. Not: mitokondrisiz alyuvar ATP'yi glikolizle üretir. |
| N04 | Tanım “−OH grubu doymuş (sp³) bir karbona bağlı”; not: fenolde −OH halkaya, asetik asitte C=O karbonuna bağlıdır, ikisi de alkol değildir. |
| N05 | Kart, görsel ve özet: Fehling alifatik aldehitle; “benzaldehit: Tollens +, Fehling −”. Özet tablosundaki aldehit örneği asetaldehit. |
| N06 | Kart: siklopropanın halkası açılarak katılma verebildiği eklendi; not: “Bromlu su siklohekzanı alkenden ayırır; gergin siklopropan ise halka açılıp Br₂ katabilir.” |
| N07 | “Nakilden önce her zaman uygunluk testi yapılır.” Not: “Alyuvarda O Rh− genel verici, AB Rh+ genel alıcıdır; plazmada ise AB genel vericidir.” |
| N08 | Not: “Anti-D, duyarlanmamış Rh− annede antikor oluşmasını önler; oluşmuş antikoru silmez.” Tedavi talimatı (72 saat) çıkarıldı. |
| N09 | “Şiddeti (W/m²) genlikle artar; kulağın duyduğu şiddet düzeyi desibelle (dB) ölçülür ve her +10 dB şiddetin 10 katı demektir.” Görsel: 10⁻⁵ W/m² · 70 dB ve 10⁻⁶ W/m² · 60 dB. |
| N11 | Profil: “…sayfayı yenilersen ya da sekmeyi kapatırsan silinir.” |
| N10 | Bkz. aşağıdaki kapsam satırı. |
