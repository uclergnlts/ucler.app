# Telefon uygulaması (iOS ve Android)

Uygulama, sitenin statik çıktısını (`out/`) Capacitor ile iOS ve Android projelerinin içine koyar. Kod tek; ekranlar sitedekiyle aynı.

| Yol | Ne |
|---|---|
| `capacitor.config.ts` | Uygulama kimliği (`app.ucler`), adı, açılış ekranı ayarları. |
| `ios/` | Xcode projesi (Swift Package Manager; CocoaPods yok). |
| `android/` | Android Studio projesi. |
| `assets/` | Simge ve açılış ekranı kaynakları. Değişirse: `npx @capacitor/assets generate --ios --android --iconBackgroundColor '#f6f8fb' --splashBackgroundColor '#ffffff'` |
| `components/Yerel.tsx` | Yalnızca uygulamada çalışan parçalar: üst çubuk ve açılış animasyonu ("u." → "ucler."). Telefonun sabit açılış ekranı "u." gösterir, animasyon aynı yerden devam eder. Sitede `?acilis` ile önizlenir. |

## Her değişiklikten sonra
```bash
npm run app        # next build + cap sync: out/ klasörünü iki projeye kopyalar
```

## iPhone'da denemek (Mac)
1. Xcode'u App Store'dan kur.
2. `npx cap open ios` ile projeyi aç.
3. Sol listede **App**'i seç, **Signing & Capabilities** sekmesinde **Team** olarak kendi Apple Developer hesabını seç.
4. iPhone'u kabloyla bağla, üstteki cihaz listesinden onu seç ve ▶ düğmesine bas.
5. İlk seferde iPhone'da **Ayarlar > Genel > VPN ve Aygıt Yönetimi** altında geliştiriciye güven.

## Android'de denemek
1. Android Studio'yu kur, `npx cap open android` ile projeyi aç.
2. Telefonda **Geliştirici seçenekleri > USB hata ayıklama**yı aç, kabloyla bağla, ▶ düğmesine bas.
Google Play hesabı yalnızca mağazaya yüklemek için gerekir; denemek için gerekmez.

Bilgisayarsız yol: `main`'e her gönderimde GitHub **Actions > Android APK** iş akışı deneme APK'sı üretir (`ucler-apk`, 30 gün saklanır). APK'yı Android telefona indir, "bilinmeyen kaynaklardan yükleme"ye izin ver, kur. Telefon yoksa Android Studio'daki **Device Manager**'dan sanal telefon açılır; APK'yı ekranına sürükleyip bırakmak yeter.

## Bilinen sınırlar
- Videolar pakete girmez, ucler.app/video/ üzerinden (Cloudflare R2) akar.
- Hesap e-postalarındaki bağlantılar (doğrulama, şifre yenileme) siteyi açar. Öğrenci sonra uygulamada e-posta ve şifresiyle girer.
- Uygulama her açılışta ana sayfadan başlar.
- Abonelik (ucler Plus, RevenueCat): docs/ABONELIK.md
- Mağaza derlemeleri (TestFlight, Google Play): docs/MAGAZA.md

## Günün sorusu (2026-10-30)
Ana sayfanın üstünde "Günün sorusu" kartı, ekran `/gunun-sorusu/` (components/GunSorusu.tsx, lib/gunsoru.ts).
Herkese aynı soru; gün Türkiye saatiyle 00:00'da değişir, dersler sırayla döner. Soru konu testlerindeki etkileşimli
sorulardan seçilir (lib/content.ts `gunSorusuHavuzu`). Tek deneme; doğru cevap 100 puan + hız bonusu (ilk 10 sn +50,
60. saniyeye kadar azalarak 0). Hesabı olanın süresi ve puanı sunucuda (supabase/migrations/20261030_gunun_sorusu.sql)
tutulur ve haftalık lige eklenir; hesabı olmayan çözebilir ama puanı kaydedilmez.
