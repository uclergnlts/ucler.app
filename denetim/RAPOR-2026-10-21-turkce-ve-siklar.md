# Türkçe ve test şıkları düzeltmesi (2026-10-21)

Üçler'in isteği: anlatım bozuklukları ve eksik kelimeler düzeltilsin; etkileşimli testlerde öğrenciyi yanılgıya itebilecek şıklar sadeleşsin ("Kısa ve öz").

## Ne yapıldı

- **Anlatım bozukluğu: 17 düzeltme.** Tüm kartlar, adımlar ve testler okundu. Örnekler:
  - "Bu madde ısı veriyor değil" → "Buz ısı vermiyor, ısı alıyor"
  - "çözeltileri ikisi de berrak." → "çözeltilerinin ikisi de berraktır."
  - "süratı" → "sürati"; "lizozom da Golgi'den kopan bir kesecik; …" → "…keseciktir; …"
  - "laktik asit kas hücresine özgüdür" (yanlış genelleme) → "laktik asit fermantasyonu kas hücresinde ve yoğurt bakterilerinde görülür"
  - Antibiyotik direnci cümlesi kartın başından, örneğin (Sanayi Devrimi kelebekleri) sonuna taşındı.
- **Gerekçeli ya da uzun şık: 94 şık kısaldı** (adımlı derslerde 58, konu sonu testlerinde 36), 3 açıklama metni yeni şıklara uyduruldu, bir soru kökü değişti.
  - simya: "Element: antik çağdan beri öyle bilinir / Bileşik: hidrojen ve oksijenden oluşur / Karışım: …" → "Element / Bileşik / Karışım"
  - asit-baz testi: "pH = 7'dir, çünkü asit ve baz eşit moldür" → "pH = 7'dir"
  - ısı-sıcaklık testi: "Büyür, çünkü levhanın tüm boyutları gibi…" → "Büyür."
  - evrim: "Yarısı geçer; çocuk biraz kaslı doğar" → "Kısmen geçer"
  - çözeltiler testi: "Yanlış; gazların çözünürlüğü…" türü şıklar → "Bu iddia için hangisi doğrudur?" + kısa yargılar
- Gerekçeler kaybolmadı: hepsi zaten cevaptan sonra çıkan `neden` / `e` / `y` metinlerinde vardı.
- "Neden" diye soran sorularda (ör. "Ter buharlaşırken seni neden serinletir?") şıkların kendisi gerekçe olduğu için yalnızca kısaltıldı.

## Yeni kural

`docs/ICERIK-SPEC.md` → "Şık yazımı": şık kısa ve tarafsız, gerekçe yalnızca cevaptan sonra, en fazla 10 kelime.

## Doğrulayıcı

`tools/check.py` → `sik_denetle`:
- Hata: "neden" sorusu olmayan bir soruda şıkta "çünkü / olduğu için / olduğundan / yüzünden / dolayısıyla".
- Uyarı: 10 kelimeyi geçen şık.
- Şu an: hata 0, uyarı 0.

Bilerek dokunulmayanlar: oranlar ("3 kırmızı : 1 beyaz"), etiketli şıklar ("X: propanal, Y: propanon"), iki parçalı yargılar ("Frekans aynı kalır; hız ve dalga boyu artar") — bunlar gerekçe değil, cevabın kendisi.
