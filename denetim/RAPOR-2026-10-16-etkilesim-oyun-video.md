# Denetim raporu: 2026-10-16 — Etkileşimler, oyunlar ve 13 video

Denetçi: Codex. İncelenen sürüm: `1f34947`. Raporun tamamı Üçler'e proje sohbetinde iletildi; bu dosya bulguları ve durumlarını kayda geçirir.

Özet: 1 kritik, 2 orta bulgu. Önceki E02 kapandı; E01 kısmen açıktı (aşağıdaki yeni E01 onun devamı).

## Bulgular ve durum

| # | Önem | Yer | Sorun | Durum |
|---|---|---|---|---|
| F01 | Kritik | Fizik › Kuantum fiziğine giriş › kart 5 (`formul`) | λ = 590 nm, W = 2,1 eV (+0,0017 eV) ve λ = 210 nm, W = 5,9 eV (+0,0048 eV) için "Elektron kopmaz, foton enerjisi W'den küçük" yazıyordu. Neden: yorum, sıfıra kırpılmış E<sub>k</sub> üzerinde 0,005 toleransla seçiliyordu; 2 basamaklı gösterim 0 diyordu. Kaynak: OpenStax University Physics Vol. 3, 6.2. | Düzeltildi. İlk çıktı artık işaretli fark **h·f − W**; yorum bunun üzerinden üç durumu ayrı söylüyor: eşik altı (kopmaz), tam eşik (kopar, E<sub>k</sub> = 0), eşik üstü (kopar; 0,05 eV altında "çok yavaş"). Çıktılar 4 basamak gösteriyor (kaydırıcı ızgarasındaki en küçük sıfır olmayan fark 0,0014 eV). Tarayıcıda denendi: 590/2,1 → 0,0017 eV "kopar ama çok yavaş"; 210/5,9 → 0,0048 eV aynı; 620/2,0 → 0 "tam eşik"; 600/2,1 → −0,0333 "kopmaz"; 400/2,3 → 0,8 "kopar". |
| E01 | Orta | Videolar › 320×450 | Alt şeritteki düğme satırı sığmıyor; ses düğmesi ekran dışında (sol kenar 323,7 px). | Düzeltildi. 359 px ve altında iki hap ("Konuya git", "Cevabı gör") üst satırı paylaşıyor; kaydet, paylaş ve ses ikinci satırda sağda. 320×450, 375×500, 390×844, 844×390 ve 1280×800'de, sesli ve sessiz durumda beş düğmenin hepsi ekranın içinde. |
| F02 | Orta | Videolar › "Cevabı gör" penceresi | Odak arkadaki düğmede kalıyor, Escape kapatmıyor, aşağı ok sıradaki videoya geçip pencereyi kapatıyor. | Düzeltildi. Pencere `aria-modal`; açılınca odak "Kapat"a gidiyor ve Tab ile pencerede kalıyor; Escape kapatıyor; kapanınca odak "Cevabı gör"e dönüyor. Açıkken oklar videoyu değiştirmiyor (uzun cevapta pencereyi kaydırıyor), boşluk ve m kısayolları çalışmıyor. Ders içindeki video penceresiyle (VideoPlayer) aynı davranış. Denendi: açınca odak "Kapat", ↓ sonrası adres hâlâ #KIM-01, Escape kapattı, odak "Cevabı gör", sonraki ↓ #KIM-02'ye geçti. |
