# Mağaza derlemeleri (App Store ve Google Play)

İki derleme de GitHub Actions'ta elle başlatılır (Actions > iş akışı > **Run workflow**). Mac ya da Android Studio gerekmez.
Uygulamanın içeriği (konular, kartlar, testler) pakete gömülüdür: içerik değişikliği öğrenciye ancak yeni sürümle ulaşır. Videolar paketlenmez, ucler.app/video/ üzerinden akar (`npm run app` .mp4/.jpg dosyalarını out/ klasöründen siler).

## iOS: `ios-testflight.yml`
Derler, imzalar, App Store Connect'e yükler; birkaç dakika sonra TestFlight'ta görünür.

| Sır (Settings > Secrets and variables > Actions) | Nereden |
|---|---|
| `APPLE_TAKIM_ID` | developer.apple.com > Account > Membership details > Team ID |
| `ASC_ANAHTAR_ID`, `ASC_YAYINCI_ID`, `ASC_ANAHTAR` | App Store Connect > Users and Access > Integrations > App Store Connect API > Team Keys. Rol **Admin** (bulut imzalama sertifika oluşturabilsin). `ASC_ANAHTAR` = indirilen .p8 dosyasının bütün metni. |

- Girdiler: `surum` (CFBundleShortVersionString, ör. 1.0), `abonelik` (1 = ödeme duvarı açık). Derleme numarası = iş akışı çalışma numarası, her yüklemede artar.
- Uygulama yalnızca iPhone (TARGETED_DEVICE_FAMILY = 1); iPad'de iPhone uyumluluk modunda açılır, iPad ekran görüntüsü gerekmez.
- `ITSAppUsesNonExemptEncryption = false`: yalnızca HTTPS, şifreleme beyanı sorulmaz.

## Android: `android-aab.yml`
İmzalı `.aab` üretir (Actions çalışmasının altında `ucler-aab`). Play Console'a elle yüklenir.

| Sır | Ne |
|---|---|
| `ANDROID_ANAHTAR` | Yükleme anahtarı (keystore, takma ad `ucler`), base64 metni |
| `ANDROID_ANAHTAR_SIFRESI` | Anahtar ve keystore şifresi (ikisi aynı) |

- Play App Signing açık kalır: Google uygulamayı kendi anahtarıyla imzalar, bizimki yalnızca yükleme anahtarıdır. Kaybolursa Play Console'dan sıfırlanabilir.
- `abonelik` girdisi Play faturalandırma ve RevenueCat Android anahtarı (lib/abonelik.ts `RC_ANAHTAR.android`) hazır olana kadar 0 kalmalı; yoksa satın alınamayan bir ödeme duvarı çıkar.
- Play'deki uygulama: "Ucler - Öğren, Eğlen", paket `app.ucler` (iOS ile aynı).
- `targetSdk 36`: Google Play 31 Ağustos 2026'dan beri yeni uygulamalarda Android 16 hedefini istiyor.

Deneme APK'sı (`android-apk.yml`) ayrı ve imzasızdır; her main gönderiminde çalışmaya devam eder.
