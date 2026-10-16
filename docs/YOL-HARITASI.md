# Yol haritası

## Durum (2026-10-16)
| Ders | Hazır konu | Toplam |
|---|---|---|
| Fizik | 28 (hepsi hazır) | 28 |
| Kimya | 25 (hepsi hazır) | 25 |
| Biyoloji | 28 (hepsi hazır) | 28 |

Güncel liste için `python3 tools/check.py` çıktısına bakılabilir.

## Sıradaki işler
1. **İçerik:** Her dersin konuları sırayla yazılacak. Her derste sıradaki yazılmamış konu yazılır (2026-10-16: Basınç, kimyasal etkileşimler, sınıflandırma eklendi).
2. **Videolar:** İlk dalgada hazır konular için yaklaşık 45 video çıkacak (KIM-01, FIZ-01, BIY-01 …). KIM-01 senaryosu hazır, ses bekleniyor. Sitedeki yeri hazır (`docs/VIDEOLAR.md`): alt menüdeki Videolar sekmesinde dikey akış, ayrıca ilgili kartın altında. Yayından önce video deposu seçilecek (öneri: Cloudflare R2).
3. **AYT konu listeleri:** Resmi listeyle karşılaştırılacak.
4. **Yayın:** Site Vercel'e bağlanacak, ardından `ucler.app` alan adı. O zamana kadar claude.ai artifact'ı eski sürümü gösterir.

## Planlanacak: oyunlar (Üçler, 2026-10-15)
Konularla bağlantılı kısa oyunlar eklenecek. Üçler'in örneği: kimyada periyodik tabloda elementin yerini bulmak. Henüz tasarlanmadı. Olası fikirler (karar değil):
- **Kimya:** Elementi tabloya yerleştirme, sembol-ad eşleştirme, formüldeki atom sayısını bulma.
- **Fizik:** Vektörleri uç uca ekleyip sonucu tahmin etme, birim dönüştürme yarışı.
- **Biyoloji:** Organeli hücrede doğru yere koyma, organizasyon basamaklarını sıralama.

## Planlanacak: etkileşimli anlatım (Üçler, 2026-10-15)
Konu anlatımında kullanıcının dokunup değiştirebileceği öğeler olacak. Örneğin kaydırıcıyla açıyı değiştirip vektör bileşenlerini görmek ya da proton sayısını değiştirip elementin değiştiğini görmek. Henüz tasarlanmadı.

## Bekleyen (sunucu gerektirir)
- Kayıt, giriş, ücretli üyelik.
- İlerlemenin hesaba bağlanması.
