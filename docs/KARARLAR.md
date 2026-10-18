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
- **Alt menü:** Ana sayfa · Keşfet · Videolar · Oyunlar · Profil. Alt menüde **ders adları olmaz.** Videolar sekmesi 2026-10-16'da eklendi (Üçler: "YouTube Shorts, Instagram Reels mantığı gibi ayrı bir menüde"). 2026-10-16 akşamki yeniden tasarımda Oyunlar sekmesi Kaydedilenler'in yerini aldı; kaydedilen konular Profil'in içinde durur.
- **Yeniden tasarım (Üçler, 2026-10-16 19:10):** "Mobilde çok kullanışlı değil, tasarımsal olarak daha sade olmalı, videolar Reels/Shorts mantığıyla çalışmalı." Sonuç: düz açık zemin (ızgara yok), beyaz yüzeyler, 1px ince çizgiler, renk yalnızca küçük vurgularda; Videolar sekmesi tam ekran dikey akış.
- **Arayüz kütüphanesi (Üçler, 2026-10-18):** Site shadcn/ui ve Motion (eski adıyla Framer Motion) ile yazılır; amaç Brilliant gibi sade görünüm. Zemin beyaz, ana düğme dersin rengi, geçişler kısa ve sakin.

## Videolar
- **Biçim:** Dikey 9:16 (1080×1920). **Süre en az 1, en çok 3 dakika** (Üçler, 2026-10-16 17:31: "biraz daha uzun yapabiliriz … maksimum 3 dk min 1 dk"). İlk 10 kimya videosu (KIM-01–KIM-10) 45-60 saniye olarak kalır. Videolar hem uygulamada hem sosyal medyada kullanılacak.
- **Bağımsızlık:** Her video tek başına durur. "Sıradaki videoda" ya da "2/4" gibi ifadeler kullanılmaz. Uzun konular birden fazla bağımsız videoya bölünür.
- **Kapanış:** **Her video, izleyiciyi düşündüren bir soruyla biter.**
- **Altyazı:** Sabit bir yerde, videonun alt kısmına yakın durur. Ekranda gezmez.
- **Görsel stil:** "Sade bilgi grafiği". Izgaralı açık zemin, sabit altyazı şeridi ve ince ilerleme çubuğu kullanılır.
- **Sitede yeri (Üçler, 2026-10-16):** Videolar tek yerde saklanır (`content/videolar.json`). Alt menüdeki **Videolar** sekmesinde Shorts/Reels gibi dikey akış olarak durur; Keşfet'te video olmaz. Akıştaki her videodan "Konuya git" ile ilgili karta geçilir; videosu olan kartın altında da video düğmesi çıkar. Ayrıntı: `docs/VIDEOLAR.md`.
- **Videolarda maskot ya da süs karakteri yok;** tasarım ilkelerine uyan sade bilgi grafiği (Üçler, 2026-10-16'da yeniden vurguladı).
- **Stil standardı (Üçler, 2026-10-16):** KIM-01 onaylandı ("tek kelime ile harika"); bütün videolar onun yazı stili, tasarımı ve hareket kurallarıyla üretilir. Ayrıntı: `video/STIL.md`, kaynak: `video/kaynak/KIM-01/scene.html`.
- **İş akışı:**
  1. Claude senaryoyu ve konuşma metnini yazar.
  2. Üçler metni ElevenLabs'ta ("Damla" sesi) seslendirip mp3 ve srt dosyasını gönderir.
  3. Claude videoyu üretir.

## Konu yolları (sınav listeleriyle, 2026-10-15)
Sıralama `content/dersler.json` dosyasındadır. Fizik 28, kimya 26, biyoloji 28 konudan oluşur.
- TYT konuları Üçler'in gönderdiği listelerden alındı.
- **AYT konuları Claude'un müfredat bilgisinden eklendi ve resmi listeyle henüz karşılaştırılmadı.**

## Teknoloji (Üçler, 2026-10-15)
- Site **Next.js + React + TypeScript + Tailwind CSS** ile yapılır; arayüz parçaları **shadcn/ui**, animasyonlar **Motion** (2026-10-18). İçerik `content/` altındaki JSON dosyalarında durur.
- Yayın için **Vercel** düşünülüyor; `ucler.app` alan adı oraya bağlanacak. Her PR için önizleme adresi çıkar.
- İleride hesap ve ilerleme için Supabase, ödeme için iyzico veya Stripe değerlendirilecek (karar değil).

## Şimdilik bekleyenler
- Ücretli üyelik, kayıt ve giriş. Bunlar için sunucu, veritabanı ve ödeme altyapısı gerekiyor.
- Konularla ilgili oyunlar ve konu anlatımında etkileşimli öğeler (2026-10-15). Bunlar ayrıca planlanacak; ayrıntı için `docs/YOL-HARITASI.md` dosyasına bak.
