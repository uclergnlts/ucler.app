# Mimari

## Şu anki durum (prototip)
Site, derleme gerektirmeyen **tek bir statik sayfadır**. Sunucu, veritabanı ve kullanıcı hesabı yoktur. Yayında `claude.ai` artifact'ı olarak durur. İleride `ucler.app` alan adına taşınacak.

```
site/
  index.html     görünüm, stil ve uygulama mantığının tamamı (HTML + CSS + JS)
  fizik.js       window.DERS.fizik    = { konu-id: {title, summary, cards[], quiz[]} }
  kimya.js       window.DERS.kimya
  biyoloji.js    window.DERS.biyoloji
```
`index.html`, içerik dosyalarını `<script src>` ile yükler. Ardından `window.DERS` verisini okuyup sayfayı çizer.

### index.html içinde
- **`SUBJ`:** Her dersin adı, yol başlığı ve sıralı konu listesi (`[id, ad]`). `id` yerine `0` yazan konular henüz hazır değildir ve sitede "yakında" olarak görünür. **Konu sırasının tek kaynağı burasıdır.**
- **Yönlendirme (hash):**

  | Adres | Sayfa |
  |---|---|
  | `#` | ana sayfa |
  | `#kesfet` | arama ve ders süzgeci |
  | `#kayit` | kaydedilen konular |
  | `#profil` | profil |
  | `#<ders>` | konu yolu |
  | `#<ders>.<konu-id>` | ders ekranı |

  Hepsini `route()` fonksiyonu yönetir.
- **Ders ekranı:** `lesson()` ve `drawLesson()` kartları tek tek gösterir. Kartlar bitince 4 soruluk test başlar, test bitince sonuç kartı gelir. `step()` ileri ve geri gitmeyi sağlar, klavyede ok tuşları da çalışır.
- **Durum:** Durum tarayıcının `localStorage` alanında tutulur. Hesap olmadığı için cihaza özeldir.
  - `tf-prog`: konu bazında ilerleme ve test sonucu
  - `tf-saved`: kaydedilen konular

  Anahtarlardaki `tf-` öneki eski "Temelden Fen" adından kalmıştır. Değiştirilirse kullanıcıların mevcut ilerlemesi kaybolur.
- **Tema:** Renkler `:root` içinde CSS değişkenleriyle tanımlıdır. `data-ders` özniteliği dersin vurgu rengini (`--acc`) belirler. SVG'ler de yalnızca bu değişkenleri kullanır.

## Video hattı
Ayrıntılar `video/README.md` dosyasındadır. Kısaca:
1. HTML/SVG sahnesi `render(t)` fonksiyonunu dışa açar.
2. Playwright sahneyi saniyede 30 kare olarak görüntüler.
3. ffmpeg kareleri ElevenLabs sesiyle birleştirip mp4 üretir.

## İleride gerekecek mimari (henüz yok)
- **Hesap, giriş ve ücretli üyelik:** Sunucu, veritabanı, kimlik doğrulama ve ödeme sağlayıcısı gerekecek. İlerleme `localStorage` yerine hesaba bağlanmalı.
- **Oyunlar ve etkileşimli anlatım:** Ayrıntı `docs/YOL-HARITASI.md` dosyasında. Kart modeline yeni bir kart türü eklenmesi önerilir; örneğin `type: "etkilesim"` ve bir bileşen adı. Tek dosyadaki kodun bölünmesi (bileşenler, derleme adımı) o noktada değerlendirilmeli.
- **Konu sayısı:** 74 konuya çıkınca tüm içeriği tek seferde yüklemek ağırlaşabilir. Konu başına ayrı dosya ya da gerektiğinde yükleme değerlendirilmeli.
