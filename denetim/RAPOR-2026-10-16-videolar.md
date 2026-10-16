# Denetim raporu: 2026-10-16 — videolar ve son düzeltmeler

Denetçi: Codex. İncelenen sürüm: `06d537c`. Raporun tamamı Üçler'e proje sohbetinde iletildi; bu dosya bulguları ve durumlarını kayda geçirir.

Özet: 1 kritik, 4 orta, 1 küçük bulgu. Önceki S01–S06'nın hepsi kapandı.

## Bulgular ve durum

| # | Önem | Yer | Sorun | Durum |
|---|---|---|---|---|
| V01 | Kritik | KIM-02 › 22,5–33,6 sn | Gül yağı örneği, buharla damıtma yerine "kaynama noktası düşük olan önce buharlaşır" kuralıyla anlatılıyor. | Senaryo düzeltildi (2. sürüm: su buharı kokulu yağı taşır, yağ suyun üstünde katman olur). **Yeni ses bekleniyor**; sahne ve video yeni sesle yeniden üretilecek. |
| V02 | Orta | Video akışı › boyutlandırma | Küçük, yatay ve masaüstü ekranlarda video kendi alanını aşıp "Konuya git" bağlantısını örtüyor. | Düzeltildi. Video yüksekliği kapsayıcı birimleriyle (`cqh`/`cqw`) alana sığdırılıyor; kısa alanda ses düğmesi küçülüp altyazının altına iniyor. 320×568, 390×844, 844×390, 1280×800'de video alana sığdı ve bağlantı tıklanabilir çıktı. |
| V03 | Orta | KIM-02 › 26–34 sn | Mavi soğutucu, buharın geçtiği borudan ayrı çizilmiş. | Kaynak sahnede düzeltildi: soğutucu ana borunun üstüne hizalandı. Video, V01 için gelecek yeni sesle birlikte yeniden üretilecek. |
| V04 | Orta | KIM-01/KIM-02 kaynak sahneleri | `fonts-local.css` kaynak klasöründe yok; yazı tipleri yüklenmiyor. | Düzeltildi. Sahneler `../../sablon/fonts-local.css` dosyasını kullanıyor; kendi klasöründen açıldığında Manrope ve Inter yüklendi, 404 yok. Kopyalama tarifi `video/README.md` içinde güncellendi. |
| V05 | Orta | KIM-03 senaryosu | Giriş, Lavoisier öncesi görüşleri "insanlar maddenin yok olduğunu düşündü" diye tek inanca indiriyor. | Seslendirmeden önce düzeltildi: "Yanarken çıkan gazları kimse tartmıyordu. Bu yüzden yanmayı açıklamak yüzyıllarca zor oldu." |
| V06 | Küçük | KIM-02 › 34–36 sn | "Simyacılar altını hiç bulamadı" amaçlanan anlamı taşımıyor. | Senaryoda "Simyacılar kurşunu hiçbir zaman altına çeviremedi" oldu. Yeni sesle videoya girecek. |

## Ek

- `docs/DENETIM.md` içindeki eski 120-150 kelime hedefi, ölçülen okuma hızına göre 100-115 kelimeye çekildi.
- Bu ortamdaki Chromium H.264 çözemediği için otomatik oynatma burada doğrulanamadı. Video artık alanına tamamen sığdığından %60 görünürlük eşiği her boyutta sağlanıyor; gerçek tarayıcıda yeniden denenmeli.
