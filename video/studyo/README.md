# Üçler Stüdyo

Yüzlü, yatay (16:9) YouTube videoları için Mac'te çalışan kurgu stüdyosu. Üçler bölüm bölüm çeker ve klipleri stüdyoya bırakır. Claude kurguyu yapar. İkisi de aynı ekranda izler, Üçler zamana not bırakır.

Sitenin derlemesine girmez. Kendi `package.json` dosyası vardır ve yalnızca bu Mac'te (`localhost`) çalışır.

## Üçler için
1. **Aç:** Finder'da `video/studyo/Stüdyoyu Aç.command` dosyasına çift tıkla. Tarayıcıda `http://localhost:4100` açılır. Terminal penceresi açık kaldığı sürece stüdyo çalışır. Dosyayı Dock'a sürükleyip kısayol yapabilirsin.
2. **Video seç:** Üstteki listeden videoyu seç ya da "+ Yeni video" ile yenisini aç.
3. **Klip bırak:** iPhone'dan AirDrop ile gelen klipleri tarayıcı penceresine sürükle. Her klip için önizleme kopyası ve altyazı otomatik çıkar. "Klipler" sekmesinde "hazır" yazınca kurguya eklenir.
   Çekim ayarı: 4K, 30 fps, HDR kapalı, her bölüm ayrı dosya.
4. **İzle ve not bırak:** Boşluk tuşu oynatır ve durdurur, ok tuşları 1 sn ileri ve geri götürür. İstediğin anda durdur, "Notlar" sekmesine yaz, "Not bırak"a bas. Claude kurguyu değiştirince ekran kendiliğinden yenilenir.
5. **Videoyu çıkar:** Sağ üstten 1080p ya da 4K seçip "Videoyu çıkar"a bas. Bitince "Çıktılar" sekmesinde görünür.

Telefondan izlemek için stüdyo şu komutla başlatılır: `STUDYO_AG=1 npm start`. Mac ve telefon aynı Wi-Fi'de olmalı. Bu modda stüdyo yerel ağdaki herkese açılır.

## Nerede ne var
| Yol | Ne |
|---|---|
| `projeler/<ad>/kurgu.json` | Kurgu: klip sırası ve kesimleri, sahneler, altyazı, görüntü ayarları, müzik. Depoda tutulur. |
| `projeler/<ad>/sahneler/*.html` | Çizimli ya da animasyonlu sahneler. Depoda tutulur. |
| `projeler/<ad>/metin/<klip>.json` | Whisper'ın kelime zamanlı metni. Yazım hataları burada düzeltilir. |
| `projeler/<ad>/notlar.json` | Üçler'in zamanlı notları. Claude yanıtı `yanit` alanına, durumu `"yapıldı"` olarak yazar. |
| `~/Movies/ucler-studyo/<ad>/ham` | Ham çekimler. Depoya girmez. |
| `~/Movies/ucler-studyo/<ad>/vekil`, `maske`, `gecici` | Önizleme kopyaları, kişi maskeleri ve ara dosyalar. Hepsi yeniden üretilebilir. |
| `~/Movies/ucler-studyo/<ad>/cikti` | Bitmiş videolar. |
| `~/Movies/ucler-studyo/<ad>/muzik`, `arka` | Fon müziği ve arka plan görselleri. |
| `~/Movies/ucler-studyo/_modeller` | Whisper modeli (ggml-large-v3-turbo-q5_0, Türkçe dahil). |

## Claude için: kurgu.json
```jsonc
{
  "baslik": "Uzay-zaman ilişkisi",
  "konusmaDili": "tr",            // Whisper dili
  "fps": 30,
  "klipler": [                    // sırayla uç uca; gir/cik klibin kendi saniyesi
    { "dosya": "IMG_0001.MOV", "gir": 0.48, "cik": 9.59 },
    { "bosluk": 2.0 },            // yüz yok, yalnız sahne için boş süre
    { "dosya": "IMG_0001.MOV", "gir": 14.2, "cik": 31.0 }  // aynı klipten ikinci parça (tekrar çekimi atlamak için)
  ],
  "cikarilan": ["IMG_0003.MOV"],  // kurguya otomatik eklenmesin
  "sahneler": [
    // "klip"+"an": sahne konuşmanın o anına bağlanır, başka yerde kesme yapılınca kaymaz. Ya da "bas": çıktı saniyesi.
    { "id": "doku", "dosya": "uzay-dokusu.html", "klip": "IMG_0001.MOV", "an": 3.0, "sure": 5,
      "yerlesim": "sol",          // "tam" (yüzü kapatır) | "sol" | "sag" (yan panel; yüz öbür yana kayar)
      "gecis": "daire",           // tam ekran için: "daire" | "solma"
      "altyazi": true, "arkaplan": true,
      "ayar": { "baslik": "..." } // sahneye SAHNE.ayar olarak gider
    }
  ],
  "altyazi": { "acik": true, "harf": 36 },
  "goruntu": {
    "renk": { "parlaklik": 0.03, "kontrast": 1.06, "doygunluk": 1.08, "sicaklik": 6000 },
    "cilt": 0.4,                  // 0..1 hafif cilt yumuşatma (yalnız son videoda)
    "gizle": [ { "x": 60, "y": 60, "w": 280, "h": 280, "tur": "bulanik" } ],  // 1920x1080 kadraja göre
    "arka": { "tur": "bulanik", "guc": 30 }  // ya da {"tur":"renk","renk":"#F6F2EA"} | {"tur":"resim","dosya":"oda.jpg"}
  },
  "muzik": { "dosya": "fon.mp3", "ses": 0.12 }  // konuşma olunca kendiliğinden kısılır
}
```

**Sahne dosyası:** `<script src="/studyo/sahne-kit.js"></script>` yükler ve `window.render(t)` tanımlar (`t`, sahnenin başından beri geçen saniye). Çizim alanı `SAHNE.w × SAHNE.h` boyutundadır: tam ekranda 1920×1080, yan panelde 846×1080. Yardımcılar `K` içindedir (`ez`, `back`, `win`, `renk`, `canvas`). Örnek: `projeler/uzay-zaman/sahneler/uzay-dokusu.html`.

**Kontrol:**
- Kurguya bakmak için tek kareler: `curl "localhost:4100/api/p/<ad>/kare?t=3,12.5"`. Dosyalar `gecici/kare/` klasörüne yazılır.
- Video çıkarmak için: `curl -X POST -d '{"cozunurluk":"1080"}' localhost:4100/api/p/<ad>/render`.

**Nasıl çalışır:** Önizlemede tarayıcı 720p kopyaları oynatır. Sahneleri ve altyazıyı `public/katman.js` aynı anda çizer. Son videoda ham çekimler ffmpeg ile kesilir (değişmeyen parçalar önbellekte kalır). Katman, Chrome'da kare kare saydam PNG olarak üç sekmede paralel çizilir. Yüzün kayması ve ses ayarı (`loudnorm`, -14 LUFS) ffmpeg'de yapılır. Önizleme ile son video aynı hesabı (`public/motor.js`) kullanır.

Gerekenler: Homebrew'dan `ffmpeg` ve `whisper-cpp`, Google Chrome, Xcode'un `swiftc` aracı (kişi maskesi için ilk kullanımda derlenir), Node 20 ve üstü.
