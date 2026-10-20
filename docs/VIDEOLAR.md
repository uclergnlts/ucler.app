# Videolar sitede nerede durur?

Karar (Üçler, 2026-10-16): Videolar **tek yerde saklanır**, alt menüdeki **Videolar** sekmesinde YouTube Shorts / Instagram Reels gibi dikey bir akış olarak gösterilir. Keşfet'te video yoktur.

## 1. Saklama: `content/videolar.json`
Her video bir kez yazılır. `yerler` listesi videonun hangi konuya ve hangi karta (kavrama) ait olduğunu söyler. Bir video birden fazla konuya bağlanabilir; ilk yer videonun asıl konusudur.

```json
[
  {
    "id": "KIM-01",
    "baslik": "Kurşun altına dönüşür mü?",
    "sure": 52,
    "src": "https://<video-deposu>/KIM-01.mp4",
    "poster": "https://<video-deposu>/KIM-01.jpg",
    "yerler": [
      { "ders": "kimya", "konu": "simya", "kart": 2 },
      { "ders": "kimya", "konu": "atomun-yapisi" }
    ]
  }
]
```

| Alan | Kural |
|---|---|
| `id` | `KIM-nn`, `FIZ-nn`, `BIY-nn`. Senaryo dosyasının adıyla aynı (`video/senaryolar/KIM-01.md`). |
| `baslik` | En çok 60 karakter. |
| `sure` | Saniye. Karar 60-180 sn (KIM-01–KIM-10: 45-60 sn); dışındaysa doğrulayıcı uyarır. |
| `src` | `https://` ile başlayan adres ya da yerel deneme için `/videolar/...` yolu. |
| `poster` | İsteğe bağlı kapak görseli (9:16). Yoksa videonun ilk karesi görünür. |
| `yerler` | En az bir yer. `kart` 1'den başlar; yazılmazsa video konunun ilk kartında görünür. |
| `soru`, `cevap` | Videonun sonundaki DÜŞÜN sorusu ve 2-3 cümlelik cevabı (en çok 60 kelime). Cevap videonun altında kapalı durur; öğrenci "Cevabı gör"e dokununca açılır (akışta ve ders penceresinde). Sosyal medyada aynı cevap sabit yoruma yazılır. |

Yalnızca **yayına hazır** videolar bu dosyaya girer. Henüz sesi gelmemiş videolar `video/senaryolar/` altında bekler; sitede "yakında" kutusu çıkmaz.

## 2. Gösterim
1. **Ders ekranında, ilgili kartın altında** (ek kolaylık). Kartın altında "Video · 0:52" düğmesi çıkar. Dokununca video kartın üstünde açılır, kapatınca öğrenci kaldığı karttan devam eder. Asıl yer burası, çünkü öğrenme o kartta oluyor.
2. **Videolar sekmesinde.** Alt menüde ayrı bir sekmedir (`/videolar/`). Reels/Shorts gibi tam ekran, yukarı kaydırılan dikey bir akıştır; her kaydırma tam bir videoya oturur ve yalnızca ekrandaki video oynar. Video sessiz başlar (tarayıcılar sesli otomatik oynatmaya izin vermez): ilk dokunuş sesi açar, sonraki dokunuşlar durdurur ve sürdürür. Videonun altyazısı alt kenara yakın olduğu için düğmeler videonun üstüne değil altındaki beyaz şeride konur: dersin ve konunun adı, **"Konuya git"** (ilgili karta götürür, ör. `/kimya/simya/?kart=2`), **"Cevabı gör"** (alttan açılan pencere), konuyu kaydet, paylaş ve ses. Adres ekrandaki videoyu gösterir (`/videolar/#KIM-03`), böylece paylaşılan bağlantı o videodan açılır. Klavyede aşağı/yukarı ok, boşluk ve `m` çalışır. Ana sayfadaki "Kısa videolar" rafı da bu akışa açılır.

Videolarda maskot ya da süs karakteri olmaz; görsel stil `docs/KARARLAR.md` içindeki "sade bilgi grafiği"dir.

## 3. Video dosyaları nerede barınır?
mp4 dosyaları depoya konmaz, çünkü çok büyükler (45 video ≈ 300-400 MB). Seçenekler:
- **Yerel deneme:** Dosya `public/videolar/` altına kopyalanır (`.gitignore` mp4'leri dışarıda tutar), `src` `/videolar/KIM-01.mp4` olur.
- **Yayın (2026-10-20, Üçler R2'yi seçti):** Videolar Üçler'in Cloudflare R2 deposunda (`ucler-videolar`) durur: `https://pub-d7370c95f24344aebcb621f6c412c2ed.r2.dev/<KOD>.mp4` ve `.jpg`. `src` ve `poster` bu adrestir. Yeni video önce R2'ye yüklenir, sonra `content/videolar.json` dosyasına yazılır. `public/videolar/` depoda yedek olarak kalır ama `.vercelignore` yüzünden Vercel'e gönderilmez (her deploy'u ~60 MB büyütüyordu).

## 4. Yeni video ekleme adımları
1. Video `video/README.md` adımlarıyla üretilir (`KIM-01.mp4`, kapak için bir kare `KIM-01.jpg`).
2. Dosyalar video deposuna yüklenir.
3. `content/videolar.json` dosyasına bir kayıt eklenir.
4. `python3 tools/check.py` çalıştırılır: konu ve kart numarasının gerçekten var olduğunu, sürenin karara uyduğunu denetler.
