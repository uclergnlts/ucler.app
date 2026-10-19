# Codex denetimi 2026-10-20 (üçüncü tur): Claude'un yanıtı
Kapsam: Codex'in `297f058` sürümü için yazdığı üçüncü tur raporundaki D3-01–D3-08 bulguları ve önceki turdan açık kalan D2-02, V02.

| # | Önem | Yer | Yapılan | Durum |
|---|---|---|---|---|
| D3-01 | Kritik | components/sahne/simulasyon.tsx › SurtunmeLab | Fiziksel hız artık sınırlanmıyor: `d.hiz += a·dt`. 20 m/s sınırı yalnız zemin çizgilerinin görsel akışında (`d.akis`) kaldı; ekranda yazan hız ve ivme Newton'un 2. yasasıyla tutarlı. | Düzeltildi |
| D3-02 | Kritik | kimya › redoks › test 3 açıklaması | "Metanın yanmasında C yükseltgenir (−4 → +4), O indirgenir (0 → −2); H ise iki tarafta da +1'dir." Sınıflandırma anahtarı değişmedi. | Düzeltildi |
| D3-03 | Kritik | kimya › madde › test 1 açıklaması | "Pişen yumurtada proteinlerin şekli kalıcı olarak bozulup (denatürasyon) birbirine bağlanır." "Yeni proteinler" ifadesi kalktı. | Düzeltildi |
| D3-04 | Kritik | fizik › çembersel hareket › kart 12; kütle çekimi › kart 7 | Genel ifade `L = m·r·v⊥` (v⊥: hızın Güneş yönüne dik bileşeni); "Günberi ve günötede v⊥ = v" koşulu yazıldı. Kepler kartında da `L = m·r·v⊥`. Kart 7'nin anahtar cümlesi zaten günberi/günöteyle sınırlıydı, değişmedi. | Düzeltildi |
| D3-05 | Kritik | fizik › radyoaktivite › kart 15 anahtar cümlesi | "Her parçacığın bir karşıt parçacığı vardır; yüklüyse yükü zıttır: elektronunki pozitrondur. Foton kendi karşıt parçacığıdır." | Düzeltildi |
| D3-06 | Kritik | biyoloji › fotosentez › kart 2 | "Siyanobakterilerde kloroplast yoktur; çoğunda klorofil hücre içindeki tilakoit zarlarındadır." "Çoğunda" kelimesi Gloeobacter gibi istisnalara yer bırakıyor. | Düzeltildi |
| D3-07 | Orta | components/TestSoru.tsx › `sayiOku` | Sayı Türkçe yazımla okunuyor: virgül ondalık, nokta binlik (`2.700` = 2700, `1.250,5` = 1250,5). Virgül yoksa ve noktalar binlik gruplamaya uymuyorsa (`2.5`, `0.125`) nokta ondalık sayılıyor. Kutunun altında biçim yazıyor: "Ondalık virgülle: 2,5 · Binlik: 2.700 ya da 2700". Ders ve Tekrar aynı kodu kullandığı için ikisi birlikte düzeldi. | Düzeltildi |
| D3-08 | Orta | simulasyon.tsx › GuveLab; content/adimli/evrim.json | Mutasyon oranı %0,4'ten %0,1'e indi (seçilimle %80'e çıkış 11 kuşak, temiz havada %30'un altına dönüş 16 kuşak; görevler aynı sürede bitiyor). Kuşsuz 20 kuşakta %29 → %29,8. Geri bildirim modeli açıklıyor: "Avcı kalkınca oran neredeyse durdu; kalan çok yavaş kayma nadir mutasyonlardan gelir." | Düzeltildi |
| D2-02 | Kritik | BIY-07, 26–29 sn | Değişiklik yok; Üçler'den yeni ses bekleniyor (video konusunun başlığında takip ediliyor). | Açık (ses bekleniyor) |
| V02 | Orta | BIY-06 seslendirme | Değişiklik yok; yeni ses bekleniyor. | Açık (ses bekleniyor) |

Kontroller: `python3 tools/check.py` TAMAM, `npm run lint` ve `npm run build` hatasız. `tools/ekran.js` ile `fizik/newton-yasalari`, `fizik/fizik-bilimine-giris` (sayı sorusu) ve `biyoloji/evrim` (güve) tam akışı: "Sayfa hatası yok". `sayiOku` şu girdilerle denendi: `2.700`→2700, `2700`→2700, `2,7`→2,7, `2.7`→2,7, `0.125`→0,125, `1.250,5`→1250,5, `−3,2`→−3,2.
