# Codex denetimi 2026-10-19: Claude'un yanıtı
Kapsam: Codex'in `b77dd6c` sürümü için yazdığı 2026-10-19 raporundaki S01–S07, T01 ve V02 bulguları.

| # | Önem | Yer | Yapılan | Durum |
|---|---|---|---|---|
| S01 | Kritik | fizik › kutle-cekimi › kart 10 | Yer durağan tanımına "dairesel yörüngede" şartı eklendi. Anahtar not artık sabit yüksekliği yalnızca 24 saatlik dairesel yörüngeye bağlıyor; "yer eşzamanlı uyduların yüksekliği tektir" genellemesi kaldırıldı. | Düzeltildi |
| S02 | Kritik | biyoloji › dolasim-bagisiklik › kart 14 | "Yalnızca tek yumurta ikizlerinde aynıdır" yerine "kalıtsal olduğundan kardeşlerde tam uyum bulunabilir, tek yumurta ikizlerinde aynıdır". | Düzeltildi |
| S03 | Kritik | biyoloji › kalitim › kart 11 (metin + SVG) | Kulak kıllılığı örneği çıkarıldı; yerine Y kromozomundaki SRY geni (erkek gelişimini başlatır) kondu. | Düzeltildi |
| S04 | Kritik | kimya › modern-atom-teorisi › kart 4 | "n büyüdükçe enerji artar" kaldırıldı: "Hidrojende enerji yalnız n'ye bağlıdır; çok elektronlu atomlarda ℓ de etkiler." | Düzeltildi |
| S05 | Orta | kimya › modern-atom-teorisi kart 14; periyodik-tablo kart 11 | İki karta helyum istisnası eklendi (He 1s², s bloğu, 8A). Periyodik tablo SVG'sinde He notu zaten vardı. | Düzeltildi |
| S06 | Orta | fizik › basinc › kart 5 | "Her zaman G" yerine "Dengedeki katı cisim ise başka düşey kuvvet yoksa zemine G kadar kuvvet uygular." | Düzeltildi |
| S07 | Orta | biyoloji › duyu-organlari › kart 11 | "Ses şiddeti desibelle ölçülür" → "Ses şiddet düzeyi desibelle (dB) ölçülür". | Düzeltildi |
| T01 | Orta | tools/ekran.js | Araç yeni akışı biliyor: kartlar ile adımları Lesson.tsx'teki sırayla dolaşıyor; her adımda örneği izliyor, "Şimdi sen dene"ye basıyor, tahmin/seçim/ayar görevini (gerekirse "Çözümü göster" ile) bitirip öyle "Devam" diyor. Dosya adı kart ve adımı ayrı yazıyor (`<ders>.<konu>.<sıra>-k<kart>.png`, `-a<adım>.png`, `-a<adım>-bitti.png`). Konu süzgeci eklendi: `node tools/ekran.js <klasör> kimya/mol fizik`. Bitirilemeyen adım "Tamamlanamayan adımlar" olarak yazılır ve çıkış kodu 1 olur. | Düzeltildi |
| V02 | Orta | BIY-06 seslendirme | Yeni ses (Üçler'in ElevenLabs kaydı) bekleniyor; gelince senaryo, altyazı ve video birlikte yeniden üretilecek. | Açık (ses bekleniyor) |
