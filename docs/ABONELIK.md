# ucler Plus: abonelik kurulumu

**Karar (Üçler 2026-10-24):** aylık 199,99 TL, ilk kez abone olana 7 gün ücretsiz deneme; deneme bitince ilk ücret alınır.
Her dersin ilk konusu ücretsiz. Videolar, oyunlar, ünite ve seviye testleri herkese açık; öteki konu anlatımları Plus ister.

## Nasıl çalışır
| Parça | Ne yapar |
|---|---|
| `lib/abonelik.ts` | Plus durumu, ücretsiz konu kuralı, satın alma / geri yükleme (RevenueCat Capacitor eklentisi). |
| `components/Plus.tsx` | Plus ekranı: Plus isteyen konuda konunun yerinde, Profil'den `/plus/` sayfasında. |
| `supabase/migrations/20261024_abonelik.sql` | `abonelik` tablosu (öğrenci yalnızca kendi satırını okur), olay kaydı, webhook anahtarı. |
| `supabase/functions/revenuecat` | RevenueCat webhook'u: satın alma, yenileme, iptal, bitiş olaylarını `abonelik`'e yazar. |
| `app/kosullar/` | Kullanım koşulları (abonelik ve deneme koşulları dahil). |

- Satın alma yalnızca uygulamada, mağaza aboneliğiyle (Apple ve Google başka ödeme yoluna izin vermiyor).
- Uygulama, giriş yapmış öğrenciyi RevenueCat'e Supabase kullanıcı kimliğiyle tanıtır. Böylece webhook aboneliği hesaba yazar ve
  aynı hesapla web sitesine giren öğrencide de bütün konular açılır. Hesapsız da abone olunabilir (Apple bunu ister); o zaman Plus yalnızca o telefonda açıktır.
- Sitede satın alma yok. Plus'ı olmayan öğrenci "Plus'a telefon uygulamasından abone olabilirsin" ekranını görür.
- **Ödeme duvarı şimdilik kapalı.** Kodda her şey hazır ama `NEXT_PUBLIC_ABONELIK=1` ile derlenmedikçe hiçbir konu kilitlenmez,
  Plus hiçbir yerde görünmez. Uygulama App Store'da yayınlanınca açılır (Vercel'de ortam değişkeni + uygulama derlemesi).

## Üçler'in yapacakları (bir kez)

### 1. Supabase (5 dk)
1. [SQL Editor](https://supabase.com/dashboard/project/ergxksjvcykgmckpsrlw/sql/new)'ü aç, `kurulum/abonelik.sql` dosyasının tamamını yapıştır, **Run**.
2. Aynı yere şunu yaz ve çalıştır; çıkan `Bearer ...` satırını kopyala (4. adımda RevenueCat'e yapıştırılacak):
   `select 'Bearer ' || deger from ozel.ayar where ad = 'revenuecat_anahtar';`
3. Sol menü **Edge Functions > Deploy a new function > Via Editor**. Adı `revenuecat` yaz, kutudaki örneği sil,
   `kurulum/revenuecat-fonksiyonu.ts` dosyasının tamamını yapıştır, **Deploy**.
4. Fonksiyonun **Details** sekmesinde **Enforce JWT verification**'ı kapat, kaydet (RevenueCat Supabase oturumu taşımaz; fonksiyon kendi anahtarını doğrular).

### 2. App Store Connect (20 dk)
1. **Business > Agreements**: *Paid Apps* sözleşmesini kabul et, banka hesabını ve vergi formunu (W-8BEN) doldur. Bu bitmeden abonelik satılamaz.
2. **Apps**: `app.ucler` paket kimliğiyle uygulama kaydı yoksa **+ > New App** ile aç (ad: ucler, dil: Türkçe).
3. Uygulamada **Monetization > Subscriptions**: abonelik grubu oluştur: `ucler Plus`.
4. Grubun içinde abonelik ekle: Reference name `ucler Plus Aylık`, **Product ID `app.ucler.plus.aylik`** (tam böyle), süre **1 Month**.
5. **Subscription Prices**: ülke Türkiye, **199,99 TL**; öteki ülkeleri Apple'ın önerdiği gibi bırak.
6. **Introductory Offers > +**: bütün ülkeler, tür **Free**, süre **1 Week**. (7 günlük ücretsiz deneme budur; Apple daha önce kullananlara yeniden vermez.)
7. **App Store Localization**: Türkçe, görünen ad `ucler Plus`, açıklama `Bütün konular, her ay`. İnceleme için Plus ekranının bir ekran görüntüsünü ekle.
8. **Users and Access > Integrations > In-App Purchase > +**: anahtar üret, `.p8` dosyasını indir; **Key ID** ve **Issuer ID**'yi not al.
9. **Users and Access > Sandbox > Testers**: deneme için bir sandbox hesabı aç (gerçek ücret alınmaz).

### 3. RevenueCat (15 dk, ücretsiz: aylık 2.500 $ gelire kadar)
1. [app.revenuecat.com](https://app.revenuecat.com)'da hesap aç, proje oluştur: `ucler`.
2. **Apps & providers > + App Store**: Bundle ID `app.ucler`; 2.8'deki `.p8` dosyasını, Key ID ve Issuer ID'yi yükle.
3. **Product catalog > Products**: `app.ucler.plus.aylik`'i içe aktar.
4. **Entitlements > +**: kimlik **`plus`** (tam böyle), ürünü bağla.
5. **Offerings**: `default` teklifinde **Monthly** paketi oluştur, ürünü bağla.
6. **Project settings > API keys**: iOS için `appl_` ile başlayan herkese açık anahtarı **bana gönder** (gizli değil, koda girecek).
7. **Integrations > Webhooks > +**: URL `https://ergxksjvcykgmckpsrlw.supabase.co/functions/v1/revenuecat`,
   **Authorization header**: 1.2'de kopyaladığın `Bearer ...` satırı. Kaydet, **Send test event**'e bas.

### 4. Xcode
1. `npx cap open ios` > **App** > **Signing & Capabilities > + Capability > In-App Purchase**.
2. Denemek için: `NEXT_PUBLIC_ABONELIK=1 npm run app`, sonra ▶. iPhone'da **Ayarlar > App Store > Sandbox Account**'ta 2.9'daki hesapla gir.
   Sandbox'ta bir ay birkaç dakikada geçer.

### Google Play (hesap açılınca)
Play Console'da abonelik: ürün kimliği `app.ucler.plus.aylik`, temel plan aylık 199,99 TL, **ücretsiz deneme teklifi 7 gün**.
RevenueCat'e Google Play uygulaması eklenir (servis hesabı JSON'u), `goog_` anahtarı `lib/abonelik.ts` içindeki `RC_ANAHTAR.android`'e yazılır.

## Ödeme duvarını açmak (yayın günü)
1. `lib/abonelik.ts`: `RC_ANAHTAR` ve `MAGAZA` (mağaza sayfası adresleri) dolu olmalı.
2. Vercel > Project > Settings > Environment Variables: `NEXT_PUBLIC_ABONELIK` = `1`, yeniden yayınla.
3. Uygulamayı `NEXT_PUBLIC_ABONELIK=1 npm run app` ile derleyip mağazaya gönder.
Açılınca sitede ve uygulamada her dersin ilk konusundan sonraki konular Plus ister; başlanmış konular da dahil.
