# Codex denetimi 2026-10-19 (ikinci tur): Claude'un yanıtı
Kapsam: Codex'in `0ebeaed` sürümü için yazdığı ikinci tur raporundaki D2-01–D2-07 ve V02 bulguları.

| # | Önem | Yer | Yapılan | Durum |
|---|---|---|---|---|
| D2-01 | Kritik | BIY-07 kapak / ilk kare | Video tarafına iletildi: "39 °C: sorun yok" kaldırılacak, ateş koşullu anlatılacak. Yalnız görsel değiştiği için yeni ses gerekmiyor; sahne yeniden üretilecek. | Açık (video) |
| D2-02 | Kritik | BIY-07, 26–29 sn | "Enzim … bir proteindir" cümlesi seslendirmede geçiyor. Önerilen yeni cümle: "Enzimlerin çoğu, belirli bir şekle katlanmış proteinlerdir." Üçler'den yeni ses bekleniyor; sonra senaryo, altyazı, görsel ve ses birlikte güncellenecek. | Açık (ses bekleniyor) |
| D2-03 | Kritik | biyoloji › kalitim › kart 11 (metin + SVG) | Kellik artık gerçek kalıtım kuralı olarak sunulmuyor: "Ders kitapları kelliği bu basit modelle anlatır; gerçek kellikte birçok gen ve hormon birlikte rol oynar." SVG başlığı "Eşeyden etkilenen", alt yazısı "basit model: otozomal gen", alt notu "gerçekte çok genli". | Düzeltildi |
| D2-04 | Orta | lib/puan.ts | Seri artık gün sayaçlarından değil `seri` ve `seriSon` alanlarından okunuyor; sayaçlar 120 günde budansa da seri büyümeye devam ediyor. Eski kayıtlar ilk yazımda, budamadan önce sayaçlardan aktarılıyor. 130 günlük deneme geçmişi bir kart etkinliğinden sonra 131 gün oldu (profilde de 131). | Düzeltildi |
| D2-05 | Orta | components/Tekrar.tsx | Sonuç metni gerçek duruma göre yazılıyor: öğrenilip sıradan çıkan ("artık sorulmayacak"), doğru olup sırada kalan ("birkaç gün sonra yeniden gelecek") ve yanlış ("yarın yeniden gelecek") ayrı sayılıyor. Tek soruluk son basamak denemesinde "1 soruyu öğrendin, artık sorulmayacak." ve kuyruk `{}`. | Düzeltildi |
| D2-06 | Orta | components/Harita.tsx | Ayrıntıyı açan konu düğmesi saklanıyor; Sheet kapanınca (`onCloseAutoFocus`) odak ona dönüyor. Enter → Escape sonrası odak "1. Fizik bilimine giriş" düğmesinde. | Düzeltildi |
| D2-07 | Orta | components/Profile.tsx | "İlerlemeyi sıfırla"dan hemen sonra `girisYap()` çağrılıyor: bugünün üç görevi yeniden kuruluyor ve giriş puanı yeniden veriliyor (sıfırlama yeni bir başlangıç sayılıyor). Uygulama içinden ana sayfaya dönünce 3 görev satırı görünüyor. | Düzeltildi |
| V02 | Orta | BIY-06 seslendirme | Değişiklik yok; yeni ses bekleniyor. | Açık (ses bekleniyor) |

Kontroller: `python3 tools/check.py` TAMAM, `npm run lint` ve `npm run build` hatasız. D2-04–D2-07 ayrıca tarayıcıda (Playwright) yukarıdaki senaryolarla denendi; sayfa hatası yok.
