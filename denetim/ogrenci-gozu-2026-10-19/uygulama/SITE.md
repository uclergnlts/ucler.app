# Site bulgularının uygulanması (öğrenci gözü denetimi, 2026-10-19)

Worktree: `/home/claude/ucler.app/.claude/worktrees/agent-a484e5f3b091a8c8d`
Branch: `worktree-agent-a484e5f3b091a8c8d`, commit `b10f095` ("Öğrenci gözü denetimi: site bulguları"). Push edilmedi.

Kontroller: `python3 tools/check.py` → TAMAM · `npm run lint` hatasız · `npm run build` hatasız (186 sayfa) ·
`tools/ekran.js ekran kimya/mol` → "Sayfa hatası yok". Ekran görüntüleri (390x844):
``
(01 ana sayfa ilk açılış, 02 fizik haritası + ayrıntı, 03 Keşfet "ayt", 04-07 konu girişi/akış/kaldığın yer,
08 test sonu 2/4, 09 test sonu 4/4, 10 profil + sıfırlama onayı, 11 hakkında, 12 gizlilik, 13 karışık test, 14 404, 15 oyunlar).

Dokunulmayanlar: alt menü, açık tema, maskot yok kararları; `content/<ders>.json` ve `content/adimli/`.
`content/dersler.json`'a yalnızca `sinav` alanı eklendi.

## Bulgu → ne yapıldı

| # | Durum | Ne yapıldı |
|---|---|---|
| 1 | uygulandı | Hiç konuya girmemiş kullanıcıda: başlığın altında sitenin ne olduğunu söyleyen tek cümle, en üstte "İlk konuna başla: Fizik bilimine giriş" kartı. Seri ve görev kutusu ders listesinin altına iner; ilk konudan sonra eski yerine döner. (`Home.tsx`) |
| 2 | uygulandı | Görev satırları bağlantı: oyun → `/oyunlar/`, video → `/videolar/`, tekrar → `/tekrar/`, aşama/kart/adım/doğru/konu → kalınan konu (yoksa ilk konu). (`Bugun.tsx`) |
| 3 | uygulandı | Test sonu: 4 sorunun doğru/yanlış özeti (yanlış çoktan seçmelide doğru şık yazılı). Yanlış varsa ana düğme "Testi yeniden çöz", altta "Aşamalara dön" ve "Sıradaki konu"; hepsi doğruysa "Sıradaki: …". Konfeti yalnızca 4/4, kupa 3/4 ve üstü; düşük puanda kupa yok, "Testi bitirdin." ve "tamamlandı" yazısı kalktı. (`Lesson.tsx`) |
| 4 | uygulandı | Her konuya `sinav` (TYT / AYT / TYT-AYT). `tools/check.py` alanı doğruluyor; `lib/dersler.ts` `Sinav` tipi ve `SINAV_AD`. Keşfet'te "tyt"/"ayt" araması çalışıyor (TYT-AYT ikisinde de çıkar), satır alt yazısında etiket var; haritada konu adının altında küçük sade "TYT" yazısı; liste görünümünde ve konu girişinde ("TYT ve AYT konusu") de görünür. Ayrıca süzgeç düğmesi eklenmedi (brifing yalnız aramayı istedi, ekran sade kalsın). Tablo aşağıda. |
| 5 | uygulandı | `/hakkinda/` (ne olduğu, nasıl kullanılır, iletişim) ve `/gizlilik/` (hesap yok, veriler yalnız bu cihazda localStorage'da, sıfırlama yolu, şu an kullanım sayımı yok, ileride anonim sayım eklenebilir). Profil'in altında "ucler" bölümü: Hakkında, Gizlilik, İletişim (Instagram @ucler.app). E-posta ya da hukuki iddia yok. Alt menü değişmedi; bu sayfalarda Profil sekmesi seçili. |
| 6 | uygulandı | Profil boş durum metni "ders ekranında sağ üstteki ? simgesine dokun" oldu (simge, bugünkü sadeleştirme kararıyla üst çubukta kaldı). |
| 7 | uygulandı | Kaydet (işaret) simgesi artık her ekranda; akışta "?" simgesiyle yan yana. |
| 8 | uygulandı | Aşama içindeki konum (`tf-yer`) saklanıyor; "Kaldığın yerden devam et" o karttan açıyor (önceki kartlar yukarıda). Konu girişindeki düğme ve balon da "Kaldığın yerden devam et" / "Devam" diyor. (`lib/store.ts`, `Lesson.tsx`) |
| 9 | uygulandı | Profil'de "Tekrar sırası: N soru · ilki yarın" satırı → `/tekrar/`. Test sonundaki cümle: "yarın Ana sayfadaki Tekrar bölümünde karşına çıkacak". |
| 10 | kısmen uygulandı | Karışık test: `/tekrar/?karisik`, bitirilen konulardan rastgele 10 soru; tekrar sırasını ilerletmez, yanlışı tekrar sırasına ekler. Profil'den açılır (en az bir konu bitince). Profil'de ders başına doğru oranı. Deneme sınavı / soru bankası yapılmadı (büyük iş, içerik gerektirir; öneri olarak kalıyor). |
| 11 | uygulandı | "Kilit" dili kalktı: ders sayfası "sırayla önerilir; istediğine atlayabilirsin", ayrıntıda "Önerilen: önce bunlar … Biliyorsan doğrudan başlayabilirsin", düğme her zaman "Başla", liste görünümünde kilit simgesi yerine soluk numara. Gri nokta duruyor. |
| 12 | uygulandı | Konu girişinde mini test düğümü aşamalar bitmeden de dokunulunca açılır (alt yazı "4 soru · istersen hemen çöz", kilit simgesi yerine soluk kupa). Aşamaların kendi sırası değişmedi. |
| 13 | uygulandı | Ders haritası ve 404'te hiçbir sekme seçili görünmüyor. (`Tabs.tsx`) |
| 14 | uygulandı | Tekrar sayacı `flex-none whitespace-nowrap`. |
| 15 | uygulandı | Başlık "Oyunlar". |
| 16 | uygulandı | `/ornek/` → `/kesfet/`, `/ornek/<konu>/` → `/<ders>/<konu>/` istemci yönlendirmesi (`components/Yonlendir.tsx`, `noindex`). `DersMotoru` korundu (`AdimGorunum` Lesson'da kullanılıyor). `ornek.css` → `app/adim.css`. Lesson'daki ölü "Önce yaparak öğren" bağlantısı kaldırıldı (artık kendine yönlenirdi). |
| 17 | uygulandı | "Derslerdeki ilerleme" yerine "Derslere göre doğru oranı" (%x doğru · n / N konu); "hazır" sözcüğü kalktı. |
| 18 | uygulandı | `/kaydedilenler/` → `/profil/#kaydedilenler` yönlendirmesi. |
| 19 | uygulandı | Ad alanının üstünde "Sana nasıl hitap edelim?" etiketi (gerçek `<label>`); "kayıtlı" → "kaydedilen konu". |
| 20 | uygulandı | Etkin olmayan "Hesap oluştur" düğmesi ve yarışma vaadi yerine tek satır not. "İlerlemeyi sıfırla" kırmızı metin düğmesi; onay uygulamanın kendi Dialog'u (`components/ui/dialog.tsx`, shadcn biçimi). |
| 21 | uygulandı | Seri metni "Bugün bir şey öğren, serin başlasın / bitmesin" (kısa tutuldu; dar alana parantezli liste sığmıyordu). |
| 22 | uygulandı | Tekrar boş durumu: "ertesi gün … doğru yaparsan 2 gün sonra, sonra da 4 gün sonra". |
| 23 | uygulanmadı | Karar konusu (oyunlaştırmanın ölçüsü), brifing gereği yalnız raporlanıyor. Not: #1 ile yeni kullanıcıda puan/seri/görev zaten ders listesinin altına indi; "Puan ve seriyi gizle" anahtarı Üçler'in kararını bekliyor. |
| 24 | uygulandı | Harita satırı 80 px, konu adı `line-clamp-2`; "21. Elektromanyetik indüksiyon ve alternatif akım" tam görünüyor. |
| 25 | uygulandı | Konfeti yalnız 4/4'te; düğme alanı `relative z-30` ile konfetinin önünde. |
| 26 | uygulandı | Akışın ikinci kartında bir kez gösterilen ipucu: "Önceki kartlar yukarıda duruyor. Anlamadığın kartta sağ üstteki ? simgesine dokun." (`tf-ipucu`, bir kez görülünce çıkmaz). Simgeye `title` da var. |
| 27 | uygulandı | Videolar'a görünmez `h1`, Tekrar'a (soru varken) görünmez `h1`; 404'te "Sayfa bulunamadı" başlığı, açıklama, Keşfet ve Ana sayfa düğmeleri. |
| 28 | uygulandı | Sol ok tuşu akışta bir önceki karta kaydırıyor; #26'daki tek seferlik ipucu "yukarı kaydırma"yı söylüyor. |
| 29 | uygulandı | `app/manifest.ts` (`force-static`, `/manifest.webmanifest`, tema/zemin #ffffff, standalone), `app/apple-icon.png` (180), `public/simge-192.png`, `simge-512.png`, `simge-maskable-512.png` — `app/icon.svg`'den Manrope 800 ile üretildi. |
| 30 | uygulandı | Üst çubuktaki logo `/` bağlantısı. |

## Ek notlar / Üçler'e
- `INSTAGRAM` sabiti `lib/site.ts`'e taşındı (sunucu sayfalarında da kullanılabilsin); `temel.tsx` yeniden dışa veriyor.
- Hakkında metni "deneme sürümünde" diyor (KARARLAR: "Şu ana kadar yapılan her şey denemedir").
- `tools/ekran.js` değişmedi ve kimya/mol akışını baştan sona hatasız yürüttü.

## TYT/AYT tablosu (Claude'un müfredat bilgisine göre; resmi ÖSYM listesiyle karşılaştırılmalı)
Ölçüt: MEB 2018 programında 9-10. sınıf konusu → TYT, 11-12 → AYT; iki düzeyde de işleniyorsa TYT-AYT.

### Fizik
| # | Konu | Sınav |
|---|---|---|
| 1 | Fizik bilimine giriş | TYT |
| 2 | Madde ve özellikleri | TYT |
| 3 | Basınç | TYT |
| 4 | Sıvıların kaldırma kuvveti | TYT |
| 5 | Isı, sıcaklık ve genleşme | TYT |
| 6 | Vektörler | TYT-AYT |
| 7 | Bir boyutta hareket | TYT-AYT |
| 8 | Newton'un hareket yasaları | TYT-AYT |
| 9 | İki boyutta hareket ve atışlar | AYT |
| 10 | Bağıl hareket | AYT |
| 11 | İş, enerji ve güç | TYT-AYT |
| 12 | Basit makineler | TYT |
| 13 | Momentum ve çarpışmalar | AYT |
| 14 | Tork, denge ve kütle merkezi | AYT |
| 15 | Çembersel ve dönme hareketi | AYT |
| 16 | Kütle çekimi | AYT |
| 17 | Elektrostatik | TYT-AYT |
| 18 | Elektrik akımı ve devreler | TYT |
| 19 | Elektriksel enerji ve güç | TYT |
| 20 | Manyetizma | TYT-AYT |
| 21 | Elektromanyetik indüksiyon ve AC | AYT |
| 22 | Basit harmonik hareket | AYT |
| 23 | Titreşimler ve dalgalar | TYT |
| 24 | Optik | TYT |
| 25 | Işığın girişimi ve kırınımı | AYT |
| 26 | Özel görelilik | AYT |
| 27 | Kuantum fiziğine giriş | AYT |
| 28 | Atom çekirdeği ve radyoaktivite | AYT |

### Kimya
| # | Konu | Sınav |
|---|---|---|
| 1 | Kimya bilimi: simyadan kimyaya | TYT |
| 2 | Kimyanın dili ve güvenliği | TYT |
| 3 | Madde ve özellikleri | TYT |
| 4 | Atom modellerinin tarihi | TYT |
| 5 | Atomun yapısı | TYT |
| 6 | Modern atom teorisi | AYT |
| 7 | Periyodik tablo | TYT-AYT |
| 8 | Kimyasal türler arası etkileşimler | TYT |
| 9 | Maddenin halleri | TYT |
| 10 | Karışımlar ve ayırma yöntemleri | TYT |
| 11 | Kimyanın temel kanunları | TYT |
| 12 | Kimyasal tepkimeler ve denklemler | TYT |
| 13 | Mol kavramı ve kimyasal hesaplamalar | TYT-AYT |
| 14 | Asitler, bazlar ve tuzlar | TYT-AYT |
| 15 | Kimya her yerde | TYT |
| 16 | Gazlar | AYT |
| 17 | Çözeltiler ve çözünürlük | AYT |
| 18 | Kimyasal tepkimelerde enerji | AYT |
| 19 | Tepkime hızı | AYT |
| 20 | Kimyasal denge | AYT |
| 21 | Redoks tepkimeleri | AYT |
| 22 | Elektrokimya | AYT |
| 23 | Karbon ve organik kimyaya giriş | AYT |
| 24 | Hidrokarbonlar | AYT |
| 25 | Fonksiyonel gruplar | AYT |
| 26 | Enerji kaynakları ve bilimsel gelişmeler | AYT |

### Biyoloji
| # | Konu | Sınav |
|---|---|---|
| 1 | Canlıların ortak özellikleri | TYT |
| 2 | Canlıların temel bileşenleri | TYT |
| 3 | Enzimler | TYT |
| 4 | Hücre ve organeller | TYT |
| 5 | Hücre zarından madde geçişi | TYT |
| 6 | Canlıların sınıflandırılması | TYT |
| 7 | Hayvanlar âlemi | TYT |
| 8 | Bitkiler âlemi | TYT |
| 9 | Mitoz ve eşeysiz üreme | TYT |
| 10 | Mayoz ve eşeyli üreme | TYT |
| 11 | Kalıtım | TYT |
| 12 | Ekosistem ekolojisi ve çevre sorunları | TYT |
| 13 | Bitki biyolojisi | AYT |
| 14 | DNA ve genetik kod | TYT-AYT |
| 15 | Protein sentezi | AYT |
| 16 | Fotosentez ve kemosentez | AYT |
| 17 | Hücresel solunum | AYT |
| 18 | Sinir sistemi | AYT |
| 19 | Endokrin sistem | AYT |
| 20 | Duyu organları | AYT |
| 21 | Destek ve hareket sistemi | AYT |
| 22 | Sindirim sistemi | AYT |
| 23 | Dolaşım ve bağışıklık sistemi | AYT |
| 24 | Solunum sistemi | AYT |
| 25 | Boşaltım sistemi | AYT |
| 26 | Üreme sistemi ve embriyonik gelişim | AYT |
| 27 | Komünite ve popülasyon ekolojisi | AYT |
| 28 | Evrim ve doğal seçilim | AYT |

Tartışmalı olanlar (resmi listeyle özellikle bakılmalı): Vektörler (9. sınıfta yalnız skaler/vektörel ayrımı), Elektrostatik, Manyetizma, Titreşimler ve dalgalar (AYT'de dalga mekaniği ayrı), Periyodik tablo, Mol, Asit-baz (AYT'de pH/denge), DNA ve genetik kod, Evrim (2018 programında kapsamı daraldı).
