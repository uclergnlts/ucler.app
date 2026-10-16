# Denetim raporu: 2026-10-16 — videolar ve son düzeltmeler

Denetçi: Codex. İncelenen sürüm: `06d537c`. Raporun tamamı Üçler'e proje sohbetinde iletildi; bu dosya bulguları ve durumlarını kayda geçirir.

Özet: 1 kritik, 4 orta, 1 küçük bulgu. Önceki S01–S06'nın hepsi kapandı.

## Bulgular ve durum

| # | Önem | Yer | Sorun | Durum |
|---|---|---|---|---|
| V01 | Kritik | KIM-02 › 22,5–33,6 sn | Gül yağı örneği, buharla damıtma yerine "kaynama noktası düşük olan önce buharlaşır" kuralıyla anlatılıyor. | Düzeltildi. Senaryo 2. sürüm; yeni sesle sahne ve video yeniden üretildi (51,7 sn): yapraklar suyla ısıtılıyor, buhar yağı taşıyor, toplama kabında yağ suyun üstünde katman oluyor. |
| V02 | Orta | Video akışı › boyutlandırma | Küçük, yatay ve masaüstü ekranlarda video kendi alanını aşıp "Konuya git" bağlantısını örtüyor. | Düzeltildi. Video yüksekliği kapsayıcı birimleriyle (`cqh`/`cqw`) alana sığdırılıyor; kısa alanda ses düğmesi küçülüp altyazının altına iniyor. 320×568, 390×844, 844×390, 1280×800'de video alana sığdı ve bağlantı tıklanabilir çıktı. |
| V03 | Orta | KIM-02 › 26–34 sn | Mavi soğutucu, buharın geçtiği borudan ayrı çizilmiş. | Düzeltildi: soğutucu ana borunun üstüne hizalandı; yeni videoda tanecikler soğutucunun içinden geçiyor. |
| V04 | Orta | KIM-01/KIM-02 kaynak sahneleri | `fonts-local.css` kaynak klasöründe yok; yazı tipleri yüklenmiyor. | Düzeltildi. Sahneler `../../sablon/fonts-local.css` dosyasını kullanıyor; kendi klasöründen açıldığında Manrope ve Inter yüklendi, 404 yok. Kopyalama tarifi `video/README.md` içinde güncellendi. |
| V05 | Orta | KIM-03 senaryosu | Giriş, Lavoisier öncesi görüşleri "insanlar maddenin yok olduğunu düşündü" diye tek inanca indiriyor. | Seslendirmeden önce düzeltildi: "Yanarken çıkan gazları kimse tartmıyordu. Bu yüzden yanmayı açıklamak yüzyıllarca zor oldu." |
| V06 | Küçük | KIM-02 › 34–36 sn | "Simyacılar altını hiç bulamadı" amaçlanan anlamı taşımıyor. | Düzeltildi. "Simyacılar kurşunu hiçbir zaman altına çeviremedi" yeni seste ve altyazıda. |

## Ek

- `docs/DENETIM.md` içindeki eski 120-150 kelime hedefi, ölçülen okuma hızına göre 100-115 kelimeye çekildi.
- Bu ortamdaki Chromium H.264 çözemediği için otomatik oynatma burada doğrulanamadı. Video artık alanına tamamen sığdığından %60 görünürlük eşiği her boyutta sağlanıyor; gerçek tarayıcıda yeniden denenmeli.

## İkinci tur: yeni senaryolar ve KIM-02 sürüm 2 (Codex, `6c289de`)

Önceki V01, V02, V03, V04 ve V06 kapandı. V05 kısmen açıktı; dört yeni bulgu geldi.

| # | Önem | Yer | Sorun | Durum |
|---|---|---|---|---|
| D01 | Kritik | KIM-07 | Buzun yoğunluğu birimsiz ("gram") okunuyordu. | Düzeltildi: "santimetreküp başına yaklaşık sıfır virgül dokuz iki gram". |
| D02 | Orta | KIM-04 | "Önce işareti tanı, sonra dokun" yanlış yönlendirebilir. | Düzeltildi: "önce etiketi ve kullanım talimatını oku, ürünü talimata uygun kullan." |
| D03 | Orta | KIM-09 | "Bağ kurmadan bir aradadır" moleküller arası etkileşimi dışlıyor. | Düzeltildi: "yeni bir bileşik oluşturmadan karışır." |
| D04 | Orta | Video akışı, 844×390 | Ses düğmesi gömülü altyazıyı örtüyordu. | Düzeltildi: yatay alanda düğme videonun sağına çıkıyor. Dört boyutta altyazı örtüşmesi yok; düğme ve "Konuya git" tıklanabilir. |
| V05 | Orta | KIM-03 | "Gazları kimse tartmıyordu" genellemesi. | Düzeltildi: "Yalnızca külü tartarsan, yanarken çıkan gazları hesaba katmamış olursun. Kütle de eksilmiş gibi görünür." |

İsteğe bağlı öneri de uygulandı: KIM-05'te "Formülde bir oksijen daha olursa hidrojen peroksit olur."
