# Hesap e-postaları

Supabase'in gönderdiği e-postaların şablonları. Supabase panelinde **Authentication > Emails > Templates** altında ilgili sekmeye konu ve HTML yapıştırılır. E-postalar Resend üzerinden `noreply@ucler.app` adresinden çıkar (Authentication > Emails > SMTP Settings).

| Supabase sekmesi | Konu | Dosya |
|---|---|---|
| Confirm signup | ucler hesabını onayla | `onay.html` |
| Reset password | ucler şifreni yenile | `sifre.html` |
| Change email address | ucler yeni e-postanı doğrula | `eposta-degisimi.html` |

Bağlantılar `https://ucler.app/onay/?token_hash=...&type=...` adresine gider (`components/Onay.tsx`). Kod bu sayfada doğrulanır; bu yüzden bağlantı başka bir tarayıcıda ya da telefonda açılsa da çalışır, e-posta programlarının bağlantıları önceden denetlemesi de tek kullanımlık kodu harcamaz. Şifre yenilemede doğrulamadan sonra `/sifre/` açılır.

Şablonda `{{ .Data.ad }}` kayıtta yazılan addır.

## Spam'e düşmemesi için
- DNS'te DMARC kaydı: TXT `_dmarc` → `v=DMARC1; p=none;`
- Resend'de alan adı ayarlarında **click tracking** ve **open tracking** kapalı (bağlantıları değiştirir, spam puanını artırır).
- Görsel yok, tek bağlantı, düz metin uzunluğunda içerik.
- Yeni alan adının itibarı birkaç hafta içinde oturur; ilk e-postalarda "Spam değil" işaretlemek yardımcı olur.
