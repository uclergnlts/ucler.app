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
Konularla bağlantılı kısa oyunlar. **2026-10-16 deneme:** `/oyunlar/` oyun alanı ve ilk oyun "Periyodik tabloda yerini bul" (ilk 20 element, 10 tur). Liste `lib/oyunlar.ts`; ana sayfada ve ilgili konunun sonunda bağlantı var. Alt menüde yeri Üçler'in kararını bekliyor. Sıradaki fikirler (karar değil):
- **Kimya:** Elementi tabloya yerleştirme, sembol-ad eşleştirme, formüldeki atom sayısını bulma.
- **Fizik:** Vektörleri uç uca ekleyip sonucu tahmin etme, birim dönüştürme yarışı.
- **Biyoloji:** Organeli hücrede doğru yere koyma, organizasyon basamaklarını sıralama.

## Planlanacak: etkileşimli anlatım (Üçler, 2026-10-15)
Konu anlatımında kullanıcının dokunup değiştirebileceği öğeler. **2026-10-16 deneme:** üç kart etkileşimli oldu: Atomun yapısı 4 (atom), Vektörler 7 (vektör), Hücre zarından madde geçişi 6 (osmoz). Biçim `docs/ICERIK-SPEC.md` içinde. Üçler beğenirse her konuya yayılacak.

## Bekleyen (sunucu gerektirir)
- Kayıt, giriş, ücretli üyelik.
- İlerlemenin hesaba bağlanması.
