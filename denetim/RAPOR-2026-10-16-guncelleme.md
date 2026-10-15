# Güncelleme denetimi: 2026-10-16

Kapsam: İlk incelemedeki `058e905` sürümünden güncel `main` sürümüne yapılan içerik eklemeleri, önceki bulguların uygulama durumu ve Next.js'e taşınan sitenin temel kullanım akışları.

İncelenen HEAD: `24d784cd3d090f19dee8c0d77f12402a6ee22709` (Next.js geçişi artık main dalında).

Özet: Bu yeniden incelemede **2 kritik, 4 orta, 2 küçük bulgu; 0 düzeltme** kaydedildi. Bunlar iki yeni bilimsel sorun, önceki düzeltmelerden kalan tutarsızlıklar ve yeni uygulamadaki kullanım/biçim sorunlarıdır. Önceki rapordaki kapsam önerilerinin tamamının kapandığı anlamına gelmez.

## Sonuç

Yeni site sürümü derleniyor; temel kullanım akışları çalışıyor. İçerik eklemeleri önceki rapordaki önemli boşlukları kapatmış. Ancak yeni eklenen vitamin ve karışım özkütlesi anlatımlarında koşulsuz genellemeler var. Hız–sürat ayrımında test açıklamasının dili de daha açık kurulabilir. Öncelik yeni eklemelerdeki iki bilimsel genellemeyi düzeltmek olmalı.

## Bulgular

| # | Önem | Yer | Sorun | Öneri / düzeltme | Durum |
|---|---|---|---|---|---|
| Y01 | Kritik | Biyomoleküller › Vitaminler | “Suda çözünenler (B grubu, C) depolanmaz” kesin kural. B12 suda çözünür ve vücutta depolanır. | “Çoğu” diye sınırla; B12 istisnasını metne ve görsele işle. [NIH](https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/) | Düzeltildi (Claude) |
| Y02 | Kritik | Madde ve özellikleri › kart 5, özet, soru 2 | `d=(m₁+m₂)/(V₁+V₂)` ve eşit hacimde ortalama, hacimlerin toplandığı varsayımı verilmeden öğretiliyor. | Genel ifade `d=m_toplam/V_son`; hacim toplama koşulunu görsel, özet ve soruya taşı. [UW](https://chem.washington.edu/lecture-demos/non-additive-volumes) | Düzeltildi (Claude) |
| Y03 | Orta | Fizik bilimine giriş › soru 1 açıklaması | “Hız, yol ve zamandan türetilir” hız–sürat ayrımını bulanıklaştırıyor. | Hızı yer değiştirme/zaman üzerinden yaz. | Düzeltildi (Claude) |
| Y04 | Orta | Newton yasaları › Sürtünme kuvveti SVG | Kayan kutuda `fs ≈ 29 N`, `μ = 0,3`. | `f_k`, `μ_k` yap. | Düzeltildi (Claude) |
| Y05 | Orta | Kimyanın dili ve güvenliği › Tehlike işaretleri SVG | Aşındırıcıda el/yüzey, patlayıcıda patlayan bomba standarda uymuyor. | Standart GHS sembollerini tanınabilir biçimde aktar. [OSHA](https://www.osha.gov/hazcom/pictograms) | Düzeltildi (Claude) |
| Y06 | Orta | `lib/store.ts` | Depolama engelliyken “Konuyu kaydet” işe yaramıyor, kullanıcıya söylenmiyor. | Oturum içi bellek değeri tut; kısa açıklama göster. | Düzeltildi (Claude) |
| Y07 | Küçük | 10 kart | 45 kelime hedefi aşılmış; doğrulayıcı 55'e kadar izin verdiği için yakalamıyor. | Sadeleştir; hedefi ayrı ölç. | Düzeltildi (Claude) |
| Y08 | Küçük | `/favicon.ico` | Tek 404 kaydı favicon isteği. | İkon ekle. | Düzeltildi (Claude) |

Geçiş notu: Eski `/#kimya.simya` biçimindeki adres yeni sitede dersi açmıyordu. Yönlendirme eklendi (Claude).

Önceki raporun uygulama kontrolü, yapılan kontroller ve kanıtlar Codex'in teslim ettiği tam raporda; özetle hâlâ açık olanlar: #8 (kristal/amorf görsel adı), #12 (Vx = 0 özel durumu), #17 (periyodik istisnaların nedeni), #18 (vitamin görevleri karşılaştırması), #19 (hücre iskeleti), #21 (ikincil aktif taşıma), #23 (diğer testlerde beceri–soru eşleşmesi), #24 (resmî kazanım eşleştirmesi), #25 (KIM-01 gerçek süre, ses bekleniyor).

## Claude'un uygulaması (2026-10-16)

| # | Ne yapıldı |
|---|---|
| Y01 | Metin: “Suda çözünenlerin çoğu depolanmaz… İstisna: B12 karaciğerde yıllarca depolanır.” Görsel: “çoğu depolanmaz”, “istisna: B₁₂ depolanır”. |
| Y02 | Kart: `d = m_toplam / V_son`; “hacim değişmiyorsa V_son = V₁ + V₂”; eşit hacimde ortalama ve “iki özkütle arasında” yalnızca bu durumda. Not: su–alkol karışımında hacim azalır. Görsel, özet kartı ve soru 2 (koşul + açıklama) aynı biçimde. |
| Y03 | “Hız, yer değiştirmenin zamana bölümüdür; birimi m/s olduğu için uzunluk ve zamandan türetilmiş bir büyüklüktür.” |
| Y04 | Görsel `fk ≈ 29 N`, `μk = 0,3`; metinde `μ_k yüzeylere bağlıdır`. |
| Y05 | Patlayıcı: patlayan bomba (bomba + patlama yıldızı + parçalar). Aşındırıcı: iki tüpten ele ve yüzeye damlayan sıvı, aşınmış el ve yüzey. Metin buna göre güncellendi. |
| Y06 | `lib/store.ts`: depolama engellenirse değerler sekme boyunca bellekte tutulur; kaydetme, kaydedilenler ve ilerleme çalışır. Profil “Tarayıcın kayıt tutmaya izin vermiyor…” uyarısını gösterir. Playwright ile engelli depolamada doğrulandı. |
| Y07 | 10 kartın hepsi 45 kelimeye indi (koşullar korunarak). `tools/check.py` artık 45'i aşanları UYARI olarak yazar, 55'i aşanları hata sayar. |
| Y08 | `app/icon.svg` eklendi (ucler. kelime işaretinden “u.”). |
| Geçiş notu | Ana sayfa eski `#ders.konu`, `#kesfet`, `#kayit`, `#profil` adreslerini yeni adreslere yönlendirir. |
