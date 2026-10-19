# Öğrenci gözüyle denetim (2026-10-19)

Üçler'in isteği: siteyi beş farklı kullanıcının gözüyle tek tek incelemek. Eksik sayfa, eksik kavram, kavram yanılgısı riski, fazla ya da sıkışık içerik ve tekrarlar aranacaktı. 82 konunun hepsi (kartlar, adımlar, testler) ve sitenin bütün sayfaları incelendi. Site telefon boyutunda (390×844) derlenip gezildi.

Ayrıntılı bulgular `denetim/ogrenci-gozu-2026-10-19/` klasöründe, her grup için ayrı dosyada:
- Fizik: `F1.md` (konu 1-10), `F2.md` (11-19), `F3.md` (20-28)
- Kimya: `K1.md` (1-9), `K2.md` (10-18), `K3.md` (19-26)
- Biyoloji: `B1.md` (1-10), `B2.md` (11-19), `B3.md` (20-28)
- `SITE.md`: sayfalar ve arayüz
- `OTOMATIK.md`: konu istatistikleri ve kart ile adım arasında neredeyse aynı olan cümleler

## Beş kullanıcı
| Kullanıcı | Kim | Neye takıldı |
|---|---|---|
| Elif | 9. sınıf, konuları ilk kez görüyor | Tanımlanmadan kullanılan terimler (sin/cos, NAD⁺, temel hâl, polar molekül). Sonraki konuda anlatılan kavramın önceki konuda kullanılması. Ana sayfada nereden başlayacağının yazmaması. |
| Kerem | 12. sınıf, YKS'ye hazırlanıyor | TYT/AYT etiketi yok. Bazı klasik sınav kalıpları eksik. Testler kartta çözülen soruyu tekrar sorduğu için sınav düzeyinin altında kalıyor. Yanlışlarını göremiyor, testi yeniden çözemiyor. |
| Zeynep | Mezun, hızlı tekrar istiyor | Aynı bilgiyi kart, adım, özet kartı ve kapanışta 3-6 kez okuyor. Doğrudan teste atlayamıyor. "Kaldığın yerden devam" onu aşamanın başına döndürüyor. |
| Murat | 33 yaşında, merak ediyor | Videolar ve günlük hayat örnekleri onu çekiyor. Puan, seri, konfeti ve madalya ona ağır geliyor. Hakkında ya da gizlilik sayfası yok. |
| Deniz | Üniversite 1. sınıf | Bilimsel doğruluk genel olarak yüksek. Bütün sayısal cevaplar yeniden hesaplandı ve yanlış işaretlenmiş test cevabı çıkmadı. Birkaç yanlış genelleme ve bozuk görünen bir formül buldu. |

## Sayılar
- İçerikte 693 bulgu var (site hariç).
  - Türe göre yaklaşık: tekrar 210, eksik 150, sıra/spoiler 95, test 75, yanılgı 70, fazla 60, hata 32.
  - Öneme göre: 16 yüksek, 333 orta, 344 düşük.
- Sitede 30 bulgu var: 5 yüksek, 10 orta, 15 düşük.
- Ortalama bir konu 14 kart ve 7 adım, toplam 21 ekran. 45 kelimeyi aşan kart yok.
- Otomatik taramada 82 konunun 71'inde, bir adımın metniyle kartın metni arasında neredeyse aynı 268 cümle bulundu.

## Konular boyunca tekrar eden 6 sorun
Bunlar tek tek bulgulardan daha önemli. Her biri onlarca konuda aynı biçimde görülüyor.

1. **Adım kartı tekrarlıyor.** Adımın giriş metni kartın ilk cümlelerini kopyalıyor, doğru şıkkın "neden" metni de kartın gövdesini ya da ANAHTAR'ını yineliyor. Üçler'in Simya'da fark ettiği tekrar bunun bir örneği. Simya'da altın hedefi 16 kez, "kimyasal tepkime elementi değiştirmez" 8 kez, "felsefe taşı" 8 kez geçiyor.
   **Öneri:** Adım girişi tek cümleyle doğrudan göreve geçsin. "Neden" metni en çok 1-2 cümle olsun ve kartta yazanı yinelemesin.
2. **Tahmin sorusunun cevabı önceden veriliyor.** Kartın ANAHTAR satırı ya da çözümlü örneği, hemen ardından gelen tahmin adımının cevabını veriyor. Örnekler: fizik 09'da 5 adımın 4'ü, mol'de 36 g su, Kc hesabı, oksin gölgede birikir. Tersi de oluyor: adım önce geliyor, sonra kart adımın cevabını aynen anlatıyor.
   **Öneri:** Kart genel kuralı versin, adım aynı yöntemi yeni sayılarla uygulatsın. Tahmin sorusu, cevabı henüz verilmemiş bir yerde dursun.
3. **Konu sonu testi içerideki etkileşimi kopyalıyor.** Hemen her konuda en az bir test sorusu, kartın etkileşiminin ya da adımın aynısı (çoğu zaman aynı sayılarla). Örnekler: Manyetizma Q1, Kuantum Q1, Optik Q1, Hardy-Weinberg üç kez 0,16 → 0,48. Bu yüzden konunun asıl sınav kalıpları testte yer bulamıyor: Hess, molarite, soy ağacı, kan grubu tablosu, DNA–kromozom grafiği.
   **Öneri:** Test soruları yeni sayı ve senaryo kullansın.
4. **Bir konuda iki üç özet var.** Her konuda hem "Özet" kartı hem de akışın sonunda "Kapanış" listesi var ve ikisi büyük ölçüde aynı maddeleri taşıyor. Bazı konularda buna bir de "Sık yapılan hatalar" kartı ekleniyor.
   **Öneri:** Bunlardan birini kaldırmak.
5. **Aynı bilgi birden çok konuda baştan anlatılıyor.** Örnekler:
   - Dalgalar, ön koşulu olan basit harmonik hareketi yeniden anlatıyor (Kart 1-2).
   - Madde ↔ Maddenin halleri; atom modelleri ↔ atomun yapısı ↔ modern atom teorisi.
   - Petrol damıtma tablosu ve cis-trans ikişer konuda aynı.
   - Döl almaşı bitkiler âlemi ↔ mayoz.
   - Mutasyon tanımı üç konuda tekrarlanıyor.
   - Metanın yanması 6 yerde geçiyor.

   **Öneri:** Her bilgi asıl konusunda kalsın, öbür konularda tek cümlelik bir göndermeye insin.
6. **Terim tanımlanmadan önce kullanılıyor.** Örnekler:
   - sin/cos ve 37°/53° hiç verilmiyor, oysa dinamik ve atışlar bunlara dayanıyor.
   - NAD⁺/NADP⁺/FAD hiçbir yerde tanımlanmıyor.
   - Bitkiler âlemi, mayoz ve n/2n'yi bu konulardan önce kullanıyor.
   - Asit-baz, Ka/Ksu/tamponu denge konusundan 6 konu önce anlatıyor.
   - Momentum, kütle merkezini bir sonraki konudan alıyor.

## Yüksek önemli bulgular
| Ders / konu | Sorun | Durum |
|---|---|---|
| Fizik / tork-denge Kart 13 | ANAHTAR'daki "μs < b/h … μs > b/h" ifadesi HTML etiketi sanılıyor ve kuralın yarısı ekranda kayboluyor | **düzeltildi** |
| Kimya / çözeltiler Kart 4 | Görselde NaOH ve H₂SO₄ için "T artınca çözünürlük azalır" yazıyor. Yanlış: NaOH'un çözünürlüğü sıcaklıkla artar, H₂SO₄ suyla her oranda karışır | **düzeltildi** (etiket kaldırıldı) |
| Kimya / tepkimeler Kart 11 | N₂ + 3H₂ → 2NH₃ "oluşum tepkimesi" diye geçiyor. Bu, tepkime enerjisindeki "1 mol bileşik" tanımıyla çelişiyor | öneri |
| Kimya / asit-baz | Ksu, Ka/Kb, hidroliz ve tampon, denge konusundan önce anlatılıyor. Denge konusu da bunlara değinmiyor | öneri: konuyu TYT ve AYT diye ikiye böl |
| Kimya / bağlar | İnorganik bileşiklerin adlandırılması (iyonik/kovalent, çok atomlu iyonlar) hiçbir konuda yok. Bu TYT kapsamında | öneri |
| Kimya / modern atom teorisi | "Temel hâl" testte soruluyor ama tanımlanmıyor; "uyarılmış hâl" hiç yok | öneri |
| Kimya / elektrokimya | Yükseltgenme potansiyelinden pil gerilimi hesaplama (işaret çevirme) anlatılmıyor | öneri |
| Kimya / simya, atom modelleri | Yukarıdaki 1. ve 2. sorunun en belirgin örnekleri | öneri |
| Fizik / iki boyutta hareket | 5 tahmin adımının 4'ünün cevabı bir önceki kartta yazılı | öneri |
| Fizik / dalgalar | Ön koşul konusu BHH baştan anlatılıyor | öneri |
| Fizik / manyetizma, kuantum | Test Q1, adımdaki soruyla aynı sayıları kullanıyor | öneri |
| Biyoloji / bitkiler âlemi | Döl almaşı ve Q3, henüz anlatılmamış mayoz/mitoz bilgisine dayanıyor | öneri |
| Biyoloji / dolaşım ve bağışıklık | Serumla kan grubu belirleme (anti-A/B/D çökelme tablosu) yok | öneri |

## Orta önemli olup öne çıkanlar
- **Fizik:**
  - Basınç "kuvvettir" diye tanımlanıyor ve skaler olduğu söylenmiyor.
  - Dört temel kuvvet konu özetinde vaat ediliyor ama hiçbir konuda anlatılmıyor.
  - g bazı yerlerde 9,8, bazı yerlerde 10 alınıyor.
  - Düzgün elektrik alanda yüklü parçacığın hareketi yok.
  - Gerilimin "yükün taşıdığı enerji" diye anlatılması bir yanılgıyı pekiştiriyor.
  - Momentum'daki "Enerji nereye gitti?" adımında metin ile sayılar uyuşmuyor.
- **Kimya:**
  - "Güçlü bağ koparsa kimyasal değişimdir" genellemesi, aynı karttaki NaCl istisnasıyla çelişiyor.
  - Adlandırma kuralları eksik: alfabetik sıra, o/m/p, -al/-on/-oik asit.
- **Biyoloji:**
  - "Alyuvarın içi %0,9 tuzlu" yazıyor. Doğrusu: alyuvar %0,9 NaCl ile izotoniktir.
  - Mayozda DNA–kromozom grafiği yok.
  - Kalıtımda genotip ve fenotip çeşidi formülü (3ⁿ/2ⁿ) yok.
  - Sinir-kas kavşağında asetilkolin yok.
  - Emilimde aktif taşıma yok.
  - "Hücre duvarı" ile "hücre çeperi" ikisi de kullanılıyor ama aynı şey oldukları söylenmiyor.

## Site: yüksek önemli 5 bulgu
1. Yeni kullanıcı nereden başlayacağını göremiyor. Ana sayfayı seri, puan ve görevler kaplıyor; "İlk konuna başla" gibi bir yönlendirme yok.
2. Bugünün görevlerine dokunulamıyor; görevler ilgili sayfaya götürmüyor.
3. Test bitince yanlışlar gösterilmiyor ve testi yeniden çözme düğmesi yok. 2/4 sonucunda bile kupa ve konfeti çıkıyor.
4. TYT/AYT etiketi hiçbir yerde yok; Keşfet'te "tyt" araması boş dönüyor.
5. Hakkında, gizlilik ve iletişim sayfaları yok. Kullanıcılar arasında 18 yaş altı da var ve ileride kullanım ölçümü (Umami) açılacak.

Diğer site bulguları:
- `/ornek/` ve altındaki 82 sayfa hiçbir yerden bağlanmıyor.
- "Bunu anlamadım" düğmesinin yeri için verilen tarif yanlış: düğme sağ üstte yazısız bir "?" simgesi.
- Haritada konular "kilitli" görünüyor ama hepsi açılabiliyor.
- Tekrar sayfasına menüden ulaşılamıyor.

## Bu turda düzeltilenler
Bunlar, doğruluğu tartışmasız küçük hatalar:
- `fizik.json` tork-denge Kart 13: `<` ve `>` yerine `&lt;` ve `&gt;` yazıldı; kuralın tamamı artık görünüyor.
- `kimya.json` çözeltiler Kart 4 görseli: yanlış "T artınca çözünürlük azalır" etiketi kaldırıldı.
- `kimya.json` enerji kaynakları özeti: "Santraller" yerine "Nükleer santraller".
- `adimli/fonksiyonel-gruplar.json`: adım başlığı "Alkolleri yükselt" yerine "Alkolleri yükseltge".
- `adimli/optik.json`: "yansıttığı rengin renginde" yerine "yansıttığı ışığın renginde".
- `biyoloji.json` hücresel solunum: "amino asitin" yerine "amino asidin".

## Üçler'in kararını bekleyenler
1. **Tekrar ve spoiler temizliği** (1. ve 2. sorun). Adım girişleri kısaltılır; cevabı önceden veren kart ve adımlar yer değiştirir ya da adıma yeni sayılar verilir. Bu, konuları kısaltmanın en büyük kaynağı.
2. **Özet kartı mı, Kapanış mı?** İkisinden biri kalkar.
3. **Testlerin yenilenmesi.** Kopya sorular yeni sayı ve senaryoyla yeniden yazılır, eksik sınav kalıpları testlere taşınır.
4. **Eksik YKS kavramlarının eklenmesi.** Her grup dosyasında konu konu listelendi.
5. **Sıra değişiklikleri.** Asit-baz konusunun ikiye bölünmesi ve bitkiler âlemine mayoz ön koşulu eklenmesi.
6. **Site.** Başlangıç yönlendirmesi, görev bağlantıları, test sonu özeti ve yeniden çözme, TYT/AYT etiketleri (önce AYT listesinin resmi listeyle karşılaştırılması gerekiyor), Hakkında/Gizlilik sayfaları.
