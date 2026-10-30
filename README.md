# ucler.

Fizik, kimya ve biyolojiyi en temelden başlayıp üniversite sınavı düzeyine kadar **kısa, görsel, sade ve hikâyeli** anlatan bir eğitim platformu. Hedef kitle 9. sınıftan üniversite 1-2. sınıfa kadar.

İki parçadan oluşur:
- **Site / uygulama** (Next.js; içerik `content/`, kod `app/` ve `components/`): Mobil öncelikli. Konular kısa kartlarla anlatılır, her konunun sonunda 4 soruluk bir mini test vardır.
- **Kısa videolar** (`video/`): Dikey, 45-60 saniyelik, sosyal medyada da paylaşılacak bağımsız videolar.

## Hızlı başlangıç
```bash
npm install                                           # ilk kez (Node 20 veya üstü)
npm run dev                                           # http://localhost:3000 adresinde aç
npm run build                                         # out/ klasörüne statik site
python3 tools/check.py                                # içerik doğrulama
npm run okunabilirlik                                 # Türkçe anlaşılırlık ve zorluk sırası raporu (denetim/OKUNABILIRLIK.md)
NODE_PATH=$(npm root -g) node tools/ekran.js ekran     # ekran görüntüleri (önce build; playwright gerekir)
```

## Belgeler
- `AGENTS.md`: Codex'in rolü ve kuralları
- `docs/KARARLAR.md`: ürün ve tasarım kararları
- `docs/ICERIK-SPEC.md`: içerik formatı
- `docs/MIMARI.md`: site ve video mimarisi
- `docs/YOL-HARITASI.md`: durum ve sıradaki işler
- `docs/DENETIM.md`: denetim listesi ve rapor kalıbı

Her şey hâlâ deneme aşamasında; nihai ürün değil.
