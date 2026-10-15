# Kararlar ve geri bildirimler

Bu dosyadaki kararları Üçler verdi. Codex bunları değiştirmez. Bir karara itirazı varsa bunu raporda gerekçesiyle belirtir.
Şu ana kadar yapılan her şey denemedir, nihai ürün değildir. Yeni geri bildirimler buraya tarihiyle eklenir.

## Ürün
- **Amaç:** Fizik, kimya ve biyoloji konularını kısa, görsel, sade ve hikâyeli anlatan bir platform kurmak. Platform hem bir site/uygulama hem de kısa videolardan oluşur.
- **Hedef kitle:** 9. sınıftan üniversite 1-2. sınıfa kadar. Ton **çocuksu olmayacak**. Anlatım net, sade, anlaşılır ve hikâyeli olacak.
- **Kapsam:** Belirli bir üniversite dersine bağlı değil. Her ders en temel konudan başlayıp ileri konulara gider. **Üniversite sınavının (TYT/AYT) tüm konuları kapsanmalı.**
- **İçerik ilkesi:** Anlatım kısa olur, görselle desteklenir ve olabildiğince sade tutulur. Ama sadeleştirirken konu **yarım yamalak anlatılmaz**, temel kavramların hepsi kapsanır. Yoksa ders kitabından farkı kalmaz.

## Marka ve görünüm
- **Ad:** `ucler` (geçici). "Temelden Fen" adı reddedildi (uzun bulundu). Kalıcı ad seçilirken şart şu: Instagram'da o adla bir hesap olmamalı. `ucler.app` alan adı alınacak.
- **Logo:** "ucler." yazı logosu. Manrope 800, lacivert #1d3557, nokta #d63c63. Üç daireli simge kullanılmıyor.
- **Maskot yok.** Ateşböceği "Işıl" çok çocuksu bulunup her yerden kaldırıldı.
- **Tema:** Yalnızca açık renkler kullanılır. Tasarım tutarlı bir sistem gibi görünmeli, "yapay zekâ yapımı" gibi durmamalı.
- **Yazı tipleri:** Manrope (başlık) ve Inter (metin). Site ve videolar aynı yazı tiplerini kullanır.
- **Alt menü:** Ana sayfa · Keşfet · Kaydedilenler · Profil. Alt menüde **ders adları olmaz.**

## Videolar
- **Biçim:** Dikey 9:16 (1080×1920), **45-60 saniye.** Videolar hem uygulamada hem sosyal medyada kullanılacak.
- **Bağımsızlık:** Her video tek başına durur. "Sıradaki videoda" ya da "2/4" gibi ifadeler kullanılmaz. Uzun konular birden fazla bağımsız videoya bölünür.
- **Kapanış:** **Her video, izleyiciyi düşündüren bir soruyla biter.**
- **Altyazı:** Sabit bir yerde, videonun alt kısmına yakın durur. Ekranda gezmez.
- **Görsel stil:** "Sade bilgi grafiği". Izgaralı açık zemin, sabit altyazı şeridi ve ince ilerleme çubuğu kullanılır.
- **İş akışı:**
  1. Claude senaryoyu ve konuşma metnini yazar.
  2. Üçler metni ElevenLabs'ta ("Damla" sesi) seslendirip mp3 ve srt dosyasını gönderir.
  3. Claude videoyu üretir.

## Konu yolları (sınav listeleriyle, 2026-10-15)
Sıralama `content/dersler.json` dosyasındadır. Fizik 26, kimya 25, biyoloji 26 konudan oluşur.
- TYT konuları Üçler'in gönderdiği listelerden alındı.
- **AYT konuları Claude'un müfredat bilgisinden eklendi ve resmi listeyle henüz karşılaştırılmadı.**

## Teknoloji (Üçler, 2026-10-15)
- Site **Next.js + React + TypeScript + Tailwind CSS** ile yapılır. İçerik `content/` altındaki JSON dosyalarında durur.
- Yayın için **Vercel** düşünülüyor; `ucler.app` alan adı oraya bağlanacak. Her PR için önizleme adresi çıkar.
- İleride hesap ve ilerleme için Supabase, ödeme için iyzico veya Stripe değerlendirilecek (karar değil).

## Şimdilik bekleyenler
- Ücretli üyelik, kayıt ve giriş. Bunlar için sunucu, veritabanı ve ödeme altyapısı gerekiyor.
- Konularla ilgili oyunlar ve konu anlatımında etkileşimli öğeler (2026-10-15). Bunlar ayrıca planlanacak; ayrıntı için `docs/YOL-HARITASI.md` dosyasına bak.
