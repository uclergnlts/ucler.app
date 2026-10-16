# Videolar sitede nerede durur?

Karar (Üçler, 2026-10-16): Videolar **tek yerde saklanır, iki yerde gösterilir.**

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
| `sure` | Saniye. Karar 45-60 sn; dışındaysa doğrulayıcı uyarır. |
| `src` | `https://` ile başlayan adres ya da yerel deneme için `/videolar/...` yolu. |
| `poster` | İsteğe bağlı kapak görseli (9:16). Yoksa videonun ilk karesi görünür. |
| `yerler` | En az bir yer. `kart` 1'den başlar; yazılmazsa video konunun ilk kartında görünür. |

Yalnızca **yayına hazır** videolar bu dosyaya girer. Henüz sesi gelmemiş videolar `video/senaryolar/` altında bekler; sitede "yakında" kutusu çıkmaz.

## 2. Gösterim
1. **Ders ekranında, ilgili kartın altında.** Kartın altında "Video · 0:52" düğmesi çıkar. Dokununca video kartın üstünde açılır, kapatınca öğrenci kaldığı karttan devam eder. Asıl yer burası, çünkü öğrenme o kartta oluyor.
2. **Keşfet'te.** Arama kutusunun altında bir video şeridi durur, oradan `/videolar/` sayfasına gidilir. Bu sayfa Instagram'daki gibi dikey kaydırılan bir akıştır: ekrana gelen video sessiz başlar, dokununca ses açılır. Her videonun altında **"Konuya git"** bağlantısı vardır ve öğrenciyi doğrudan ilgili karta götürür (`/kimya/simya/?kart=2`).

Alt menüye yeni sekme eklenmez (alt menü kararı). Video akışı Keşfet'in bir parçasıdır, bu yüzden orada Keşfet sekmesi seçili görünür.

## 3. Video dosyaları nerede barınır?
mp4 dosyaları depoya konmaz, çünkü çok büyükler (45 video ≈ 300-400 MB). Seçenekler:
- **Yerel deneme:** Dosya `public/videolar/` altına kopyalanır (`.gitignore` mp4'leri dışarıda tutar), `src` `/videolar/KIM-01.mp4` olur.
- **Yayın:** Videolar bir depolama ya da video servisine yüklenir, `src` oranın adresi olur. Önerim **Cloudflare R2**: indirme (trafik) ücreti yok, ilk 10 GB ücretsiz. Alternatif Bunny Stream: düşük internette kaliteyi kendisi ayarlar, az bir aylık ücreti var. Karar site yayına alınırken verilecek; adres değişirse yalnızca `src` alanları değişir.

## 4. Yeni video ekleme adımları
1. Video `video/README.md` adımlarıyla üretilir (`KIM-01.mp4`, kapak için bir kare `KIM-01.jpg`).
2. Dosyalar video deposuna yüklenir.
3. `content/videolar.json` dosyasına bir kayıt eklenir.
4. `python3 tools/check.py` çalıştırılır: konu ve kart numarasının gerçekten var olduğunu, sürenin 45-60 sn olduğunu denetler.
