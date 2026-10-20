# Yol haritası

## Durum (2026-10-16)
| Ders | Hazır konu | Toplam |
|---|---|---|
| Fizik | 28 (hepsi hazır) | 28 |
| Kimya | 26 (hepsi hazır) | 26 |
| Biyoloji | 28 (hepsi hazır) | 28 |

Güncel liste için `python3 tools/check.py` çıktısına bakılabilir.

## Sıradaki işler
1. **İçerik:** Her dersin konuları sırayla yazılacak. Her derste sıradaki yazılmamış konu yazılır (2026-10-16: Basınç, kimyasal etkileşimler, sınıflandırma eklendi).
2. **Videolar:** İlk dalgada hazır konular için yaklaşık 45 video çıkacak (KIM-01, FIZ-01, BIY-01 …). KIM-01 senaryosu hazır, ses bekleniyor. Sitedeki yeri hazır (`docs/VIDEOLAR.md`): alt menüdeki Videolar sekmesinde dikey akış, ayrıca ilgili kartın altında. Yayından önce video deposu seçilecek (öneri: Cloudflare R2).
3. **AYT konu listeleri:** Resmi listeyle karşılaştırılacak.
4. **Yayın:** Site Vercel'de, `ucler.app` alan adına bağlı (2026-10-20).

## Planlanacak: oyunlar (Üçler, 2026-10-15)
Konularla bağlantılı kısa oyunlar. **2026-10-16:** `/oyunlar/` oyun alanında dört oyun var: Periyodik tabloda yerini bul, Vektörle hedefi vur, Organeli bul, Formülde atom say. Liste `lib/oyunlar.ts`; ana sayfada ve ilgili konunun sonunda bağlantı var. Alt menüde yeri Üçler'in kararını bekliyor. Sıradaki fikirler (karar değil):
- **Kimya:** Elementi tabloya yerleştirme, sembol-ad eşleştirme, formüldeki atom sayısını bulma.
- **Fizik:** Vektörleri uç uca ekleyip sonucu tahmin etme, birim dönüştürme yarışı.
- **Biyoloji:** Organeli hücrede doğru yere koyma, organizasyon basamaklarını sıralama.

## Planlanacak: etkileşimli anlatım (Üçler, 2026-10-15)
Konu anlatımında kullanıcının dokunup değiştirebileceği öğeler. **2026-10-16:** Üçler pilotu beğendi ("çok güzel devam et"); 81 konunun hepsinde en az bir etkileşimli kart var (toplam 113). Türler ve biçim `docs/ICERIK-SPEC.md` içinde.

## Uygulama yol haritası (2026-10-19)
Hedef (Üçler): uygulama tamamen bitince iOS ve Android uygulaması çıkarmak, bugünkü siteyi tanıtım sitesine çevirmek.

### "Bitti" demek için eksikler
| İş | Sunucu gerekir mi | Durum |
|---|---|---|
| Aşamalı öğrenme (konu 2-4 aşama, hep 1. aşamadan) | Hayır | Yapıldı (2026-10-19) |
| Puan, günlük giriş, seri, günlük görevler | Hayır | Yapıldı, bu cihazda (2026-10-19) |
| Akıllı tekrar, "Bunu anlamadım", konu haritası | Hayır | Yapıldı (2026-10-19) |
| Çevrimdışı çalışma (içerik uygulamanın içinde) | Hayır | Mobil kabukla birlikte |
| Seriyi hatırlatan günlük bildirim | Hayır (cihazdaki yerel bildirim) | Mobil kabukla birlikte |
| Konu başına daha çok soru, "YKS'de çıktı" soruları | Hayır | İçerik işi, sırada |
| Hesap, giriş, ilerlemenin cihazlar arası taşınması | **Evet** | Bekliyor |
| Puan listesi (arkadaşlar, haftalık lig) | **Evet** | Bekliyor |
| Ücretli üyelik | **Evet** (+ mağaza ödeme sistemi) | Bekliyor |
| Toplu "anlamadım" verisi | **Evet** (Umami yeter) | Umami kimliği bekleniyor |
| Uzaktan bildirim (ör. "yeni video çıktı") | **Evet** | Bekliyor |
| Videoların ayrı depoya taşınması (Cloudflare R2) | Depo hesabı | Mağazaya çıkmadan önce |

### Mobile geçiş yolu
**Öneri: mevcut kodu Capacitor ile sarmak.** Site zaten statik çıktı (`out/`) üretiyor; Capacitor bu klasörü iOS ve Android uygulamasının içine koyar. Kod tek kalır, içerik ve tasarım iki platformda da aynı olur.
- Yeniden yazmak (React Native / Flutter) bütün ekranları, sahneleri ve etkileşimli SVG'leri ikinci kez yazmak demek. Kazancı (biraz daha "yerli" his) bu maliyete değmez.
- Apple yalnızca site gösteren uygulamaları reddedebilir (kural 4.2). Bunu aşmak için uygulamada yerel parçalar olacak: çevrimdışı içerik, günlük seri bildirimi (yerel bildirim), titreşim, paylaşım.
- Videolar uygulamanın içine konmaz (boyut büyür); R2'den akışla gelir.
- Aynı depo iki çıktı verir: uygulama derlemesi (bütün dersler) ve tanıtım sitesi (ucler.app: ne olduğu, ekran görüntüleri, örnek bir konu, App Store / Google Play bağlantıları). Bugünkü web uygulaması istenirse `app.ucler.app` adresinde kalabilir.

### Sırası
1. Sunucusuz özellikler (bu cihazda): aşamalar, puan, seri, görevler. **Yapıldı.**
2. Capacitor kabuğu: iOS ve Android projeleri, yerel bildirim, çevrimdışı içerik, simge ve açılış ekranı. **Kabuk, simge ve açılış ekranı yapıldı** (`ios/`, `android/`, bkz. `docs/UYGULAMA.md`); içerik uygulamanın içinde olduğu için çevrimdışı da çalışır. Yerel bildirim bekliyor.
3. Hesap ve puan listesi: Supabase (giriş, ilerleme eşitleme, puan listesi). Cihazdaki sayaçlar (`tf-puan`) ilk girişte hesaba taşınır. **Hesap ve eşitleme yapıldı** (`lib/bulut.ts`); puan listesi bekliyor.
4. Ücretli üyelik: uygulama içi aylık abonelik (Apple ve Google kuralı gereği). RevenueCat iki mağazayı tek yerden yönetir; abonelik durumu Supabase hesabına yazılır. Taslak (Üçler 2026-10-20): her dersin ilk konusu ücretsiz, sonrası abonelikle.
5. Tanıtım sitesi ve mağaza sayfaları; ardından yayın.

### Üçler'in açması gereken hesaplar (zamanı gelince)
- **Apple Developer Program:** yıllık 99 USD. iOS'a çıkmak için şart. Xcode için Mac gerekir (var).
- **Google Play Console:** bir kerelik 25 USD.
- **Supabase:** ücretsiz plan yeter. Hesap ve puan listesi aşamasında gerekir.
- **Cloudflare (R2):** videolar için, mağazaya çıkmadan önce.
- **RevenueCat:** ücretli üyelik aşamasında (ücretsiz başlar).
