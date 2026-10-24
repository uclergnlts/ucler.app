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
- Videolar şimdilik uygulamanın içinde (yaklaşık 60 MB). Video sayısı artınca Cloudflare R2'den akışla gelecek.
- Hesap e-postalarındaki bağlantılar (doğrulama, şifre yenileme) siteyi açar. Öğrenci sonra uygulamada e-posta ve şifresiyle girer.
- Uygulama her açılışta ana sayfadan başlar.
- Abonelik (ucler Plus, RevenueCat): docs/ABONELIK.md
