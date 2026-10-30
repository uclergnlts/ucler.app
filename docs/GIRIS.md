# Google ve Apple ile giriş: kurulum

Kod hazır (lib/bulut.ts, components/KayitDavet.tsx DisGiris, components/Yerel.tsx). Düğmeler Supabase'te ilgili giriş
açık olduğunda kendiliğinden görünür. Aşağıdakiler bir kez yapılır.

## Nasıl çalışır
- **Site:** Google/Apple sayfasına gidilir, dönüş `https://ucler.app/giris/`.
- **Uygulama (Google, Android'de Apple):** giriş sayfası uygulama içi tarayıcıda açılır, dönüş
  `app.ucler://giris?code=...` derin bağlantısıyla uygulamaya gelir, oturum orada açılır.
- **iPhone'da Apple:** telefonun kendi Apple ekranı açılır (Face ID), kimlik Supabase'e `signInWithIdToken` ile verilir.
- App Store kuralı 4.8: uygulamada Google girişi varsa Apple ile giriş de olmalı.

## 1. Supabase: uygulama dönüş adresi (Google'ın uygulamada çalışması için)
Authentication → URL Configuration → Redirect URLs → **Add URL**: `app.ucler://giris`

## 2. Apple Developer (developer.apple.com → Certificates, Identifiers & Profiles)
1. **Identifiers → app.ucler** → "Sign In with Apple" kutusunu işaretle → Save.
2. **Identifiers → +** → **Services IDs** → Description `ucler web`, Identifier `app.ucler.web` → Register.
   Sonra listeden `app.ucler.web`'i aç → "Sign In with Apple" işaretle → **Configure**:
   - Primary App ID: `app.ucler`
   - Domains: `ergxksjvcykgmckpsrlw.supabase.co`
   - Return URLs: `https://ergxksjvcykgmckpsrlw.supabase.co/auth/v1/callback`
   → Save → Continue → Save.
3. **Keys → +** → ad `ucler apple giris`, "Sign In with Apple" işaretle → Configure → Primary App ID `app.ucler` →
   Register → **Download** (.p8 dosyası yalnızca bir kez indirilebilir) ve **Key ID**'yi not al.

## 3. Supabase: Apple girişi
Authentication → Sign In / Providers → **Apple** → Enable:
- **Client IDs:** `app.ucler,app.ucler.web`
- **Secret Key (for OAuth):** .p8 dosyasından üretilen anahtar. Supabase'in Apple sayfasındaki üretici ya da Claude
  üretir (Team ID, Key ID, Services ID `app.ucler.web` ve .p8 gerekir). **6 ayda bir yenilenmesi gerekir**; süresi
  dolarsa sitede ve Android'de Apple girişi çalışmaz (iPhone'daki yerel giriş etkilenmez).
→ Save.

## 4. Yeni mağaza sürümü
Derin bağlantı ve Apple yetkisi uygulamanın içinde olduğu için iOS ve Android yeniden derlenmeli
(Actions → iOS TestFlight / Android mağaza paketi).

## Bilinen eksik
Apple, Apple ile açılan hesap silinirken Apple jetonunun iptal edilmesini istiyor (kural 5.1.1(v)). Şu an hesap
silinince Supabase'teki kullanıcı silinir ama Apple tarafındaki bağlantı kullanıcı Apple ayarlarından kaldırana kadar
kalır. İncelemede sorun çıkarsa hesap-sil fonksiyonuna eklenecek.
