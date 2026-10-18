# Denetim raporu: 2026-10-18 (kavram denetimi)
Kapsam: 81 konunun kartları (metin, SVG, etkileşim ayarları), 4 soruluk testleri, 81 etkileşimli (adımlı) ders ve sahneleri. Bilgi yanlışı, kavram hatası, kavram yanılgısı ve kavram eksikliği arandı. Üçler'in isteğiyle (2026-10-18) Claude yaptı; dokuz parçaya bölündü, her parçanın tablosu aşağıda.

Özet: 133 bulgu (2 kritik, 64 orta, 62 küçük, 5 yalnızca öneri); 92 tanesi düzeltildi, 41 tanesi öneri olarak bırakıldı. Yanlış işaretlenmiş test cevabı ya da yanlış hesaplanmış sayı çıkmadı.

**Claude'un birleştirmede eklediği düzeltmeler**
| # | Önem | Yer | Sorun | Düzeltme | Durum |
|---|---|---|---|---|---|
| E1 | Orta | biyoloji › biyomolekuller › ATP kartı SVG | "enerji bağları" etiketi "bağ kırılınca enerji açığa çıkar" yanılgısını besliyor | "fosfat bağları" | Düzeltildi |
| E2 | Küçük | biyoloji › kalıtım/mutasyon testi açıklaması | "Yalnızca üreme hücresi mutasyonu yavruya geçer" eşeysiz üremede geçerli değil | "Eşeyli üremede yalnızca ..." | Düzeltildi |
| E3 | Orta | fizik › isi-sicaklik › adımlı ders adım 1 ve sahne fiz3-cay | Sıvıdaki (çaydaki) tanecikler yalnızca "titreşir" deniyordu; sıvıda tanecikler yer de değiştirir | "hareket eder" | Düzeltildi |

**Proje sahibinin kararını bekleyenler**
- `tools/check.py` konu başına en çok 14 kart kabul ediyor. Birçok konu bu sınırda olduğu için bazı eksik kavramlar (ör. organik-giris'te yakma analizi, cozeltiler'de Raoult/osmoz, asit-baz'da çok protonlu asitler) eklenemedi. Sınır 15-16'ya çıkarılabilir ya da bu kavramlar dersler konu anlatımıyla birleşince oraya konabilir.
- Kimyada "Modern atom teorisi" (kuantum sayıları, Hund, Pauli, Cr/Cu istisnaları) ayrı bir AYT konusu olarak hiç yok; yeni konu önerilir.
- "Enerji ısıya dönüşür" dili birkaç fizik konusunda geçiyor; proje genelinde terim kararı önerilir.


### Kavram denetimi: fizik1

Dal: `worktree-agent-ad34a9fe5eb4051dc` · Commit: `c3ac35a`
Kapsam: fizik-bilimine-giris, madde-ozellikleri, basinc, kaldirma-kuvveti, isi-sicaklik, vektorler, bir-boyutta-hareket, newton-yasalari, iki-boyutta-hareket, bagil-hareket (kartlar, SVG'ler, testler, `content/adimli/*`, sahneler `fizik1-5.tsx`, `hareket.tsx`).

Kontrol: Kartlardaki, testlerdeki, etkileşimli derslerdeki ve sahnelerdeki sayıların hepsi yeniden hesaplandı. Hiçbir hesap yanlış çıkmadı. Bazı örnekler: karışım 44 °C ve 50 °C, ray 4,8 mm ve 6 mm, Everest ≈ 0,33 atm ve ≈ 70 °C, 6000 m'de 80 °C, helyum net ≈ 10 N, menzil 35,3 m ve 40,8 m, nehirde 20 s, 60 m, 12 s, 15 s, yağmurda 10 m/s ve 37°. SVG'lerdeki ok yönleri de kontrol edildi: eğik düzlemde N, f ve G; bimetal; manometre; bağıl hız üçgenleri; x–t teğeti. Hepsi doğru.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | fizik › madde-ozellikleri › kart 5 | Kart önce "eşit hacimde sonuç iki özkütlenin ortalamasıdır" diyor. Hemen ardından gelen "Bu durumda sonuç ... çok konulana yakın çıkar" cümlesi bununla çelişiyor; "çok konulan" ifadesi de belirsiz (kütle mi, hacim mi?). | "Sonuç her zaman iki özkütle arasında, hacmi çok olana daha yakın çıkar." | Düzeltildi |
| 2 | Küçük | fizik › madde-ozellikleri › adımlı ders adım 5 | Aynı belirsiz "çok konulana yakındır" ifadesi. | "hacmi çok olana daha yakındır" | Düzeltildi |
| 3 | Orta | fizik › madde-ozellikleri › kart 9 | "Dikkatle bırakılan iğne yüzer" ifadesi, iğneyi kaldırma kuvvetinin taşıdığı yanılgısını besliyor. İğneyi yüzey gerilimi taşır. | "dikkatle bırakılan çelik iğne yüzeyde durur" | Düzeltildi |
| 4 | Orta | fizik › newton-yasalari › kart 2 | "Vücudun hareketini sürdürmek ister" ifadesi, eylemsizliği bir istek ya da kuvvet gibi gösteriyor. | "otobüs yavaşlar, vücudun ise hareketini sürdürür" | Düzeltildi |
| 5 | Küçük | fizik › newton-yasalari › adımlı ders adım 1 | "Duran tabaklar durmayı sürdürmek ister." (aynı sorun) | "Duran tabaklar durgun kalmayı sürdürür." | Düzeltildi |
| 6 | Küçük | fizik › newton-yasalari › test 4 | Soru metninde gereksiz tekrar: "μk = 0,25 olan yatay zeminde kayıyor (μk)". | "(μk)" silindi | Düzeltildi |
| 7 | Orta | sahne fiz4-net (newton adımlı adım 2) | Net kuvvet sıfır değilken sahnede "Kutu net kuvvet yönünde hızlanır" yazıyor. Bu, "cisim kuvvet yönünde hareket eder" yanılgısını besliyor; kutu ters yönde kayıyorsa aslında yavaşlar. | "Kutunun hızı net kuvvet yönünde değişir" | Düzeltildi |
| 8 | Orta | fizik › bir-boyutta-hareket › adımlı ders adım 5 | İvme "hızın her saniye ne kadar arttığı" diye tanımlanmış. Bu tanım yavaşlamayı dışarıda bırakıyor. | "ne kadar değiştiğine" | Düzeltildi |
| 9 | Orta | fizik › bir-boyutta-hareket › adımlı ders kapanış | "İvme ...; kareler giderek açılır" cümlesi ivmeyi her zaman hızlanma gibi gösteriyor. "Grafik yatay ise araba duruyor" cümlesi de grafiğin türünü söylemiyor: v–t grafiği yatay olsaydı araba sabit hızla gidiyor olurdu, bu klasik bir karışıklık. | "hızlanan arabada kareler giderek açılır"; "Konum-zaman grafiği yatay ise ..." | Düzeltildi |
| 10 | Orta (eksik kavram) | fizik › bir-boyutta-hareket | Düşey (yukarı) atış hiç yok. Ne bu konuda ne de atışlar konusunda anlatılıyor. Ayrıca "tepede ivme sıfırdır" yanılgısına karşı bir açıklama yok. | Yeni kart "Yukarı atış": v = v₀ − g·t, tepede v = 0 ama a = g, çıkış süresi v₀/g, h = v₀²/2g, iniş süresi = çıkış süresi. Örnek: 19,6 m/s → 2 s, 19,6 m. | Düzeltildi |
| 11 | Orta (eksik kavram) | fizik › bir-boyutta-hareket | a–t grafiğinin alanı (Δv) ve grafikler arası geçiş yok. "Eksi ivme = yavaşlama" yanılgısı ele alınmamış. | Yeni kart "Grafikler arası geçiş": eğim ve alan ilişkileri, eksen altındaki alan, ivme ile hızın işareti. | Düzeltildi |
| 12 | Orta (eksik kavram) | fizik › basinc | Akışkanlarda hız ile basınç ilişkisi (Bernoulli) yok. Bu, 10. sınıf MEB kazanımı ve TYT'de soruluyor. | Yeni kart "Akan akışkanda basınç": daralan boru, iki kâğıt, çatı, perondaki çizgi. | Düzeltildi |
| 13 | Orta (eksik kavram) | fizik › vektorler | Bileşke yalnızca dik vektörler ve |A − B| ≤ R ≤ A + B aralığı için anlatılıyor. Açılı bileşke (R² = A² + B² + 2AB·cosα) ve eşit vektörlerde 60°, 90° ve 120° sonuçları yok; bunlar AYT'de çok sık soruluyor. | Yeni kart "Aradaki açı α ise". | Düzeltildi |
| 14 | Orta (eksik kavram) | fizik › newton-yasalari | İp gerilmesi (T) ve bağlı cisimler hiç yok. Bu, dinamik sorularının temeli. | Yeni kart "İp gerilmesi ve bağlı cisimler": önce bütün sistem için ivme, sonra tek cisim için T. Örnek: 2 + 3 kg, 20 N → a = 4 m/s², T = 8 N. | Düzeltildi |
| 15 | Orta (eksik kavram + yanılgı) | fizik › newton-yasalari › kart 7 | Kartta "N = G" yazıyor ama ivmeli durum hiç işlenmiyor: asansör ve görünür ağırlık yok. "Ağırlıksızlık = yerçekimi yok" yanılgısı da ele alınmamış. | Yeni kart "Asansörde tartı": N = m(g ± a), serbest düşmede N = 0 ama mg değişmez, belirleyici olan ivmenin yönüdür. | Düzeltildi |
| 16 | Küçük | fizik › isi-sicaklik › adımlı ders adım 1 | "Maddenin tanecikleri durmadan titreşir" denirken örnek çay, yani bir sıvı. Sıvıda tanecikler yalnızca titreşmez, öteleme hareketi de yapar. Kart 1'deki "hareket eder" ifadesi daha doğru. | "titreşir ve yer değiştirir" ya da "hareket eder" denebilir. Sahne (fiz3-tanecik) de yalnızca titreşimi gösteriyor. | Öneri |
| 17 | Küçük | sahne fiz2-rakim | Cıva sütunu 76·e^(−r/8400) ile hesaplanıyor. Bu, 9000 m'de ≈ 26 cmHg veriyor; gerçek değer ≈ 23 cmHg. Kaynama noktası formülü (100 − r/300) ise 6000 m ve 8849 m için doğru sonuç veriyor. | Görsel bir yaklaşım; düzeltme şart değil. İstenirse ölçek yüksekliği ~7600 m alınabilir. | Öneri |
| 18 | Küçük | fizik › kaldirma-kuvveti › adımlı ders adım 4 | "Özkütlesi 0,6'dan küçük sıvıda ise küp batar" deniyor ama eşit özkütlede küpün askıda kalacağı söylenmiyor. Sahne bunu doğru gösteriyor. | Sona "eşitse askıda kalır" eklenebilir. | Öneri |

Not: "Hidrostatik paradoks" adı (basınç kart 4) bazı kaynaklarda yalnızca kabın tabanındaki kuvvetle ağırlık arasındaki farka verilir. Bu yanlış değil, değiştirilmedi.

#### Kapsam eksikleri (eklenmedi, öneri)
- **Fizik bilimine giriş:** Ölçümde hata ve duyarlılık (ölçme aletinin en küçük bölmesi, tekrarlı ölçüm, ortalama). Bilimsel bilginin sınırları da (sahte bilim ile bilim ayrımı) eklenebilir.
- **Madde ve özellikleri:** Esneklik ve plastiklik (Hooke'a giriş) ile katı, sıvı ve gaz özkütlesinin sıcaklıkla değişimi yalnızca kısaca geçiyor. Karışım grafiği soru tipi (karışımın m–V doğrusu iki doğrunun arasında kalır) de eklenebilir.
- **Basınç:** Katı basınç kuvveti ile sıvı basınç kuvvetinin farkı (F = P·A, kap tabanına etki eden kuvvet ile sıvı ağırlığı) yok; YKS'de klasik bir soru tipi. Kapalı kapta gaz ile sıvı basıncının toplanması (P_gaz + h·d·g) de anlatılmıyor.
- **Kaldırma kuvveti:** İki sıvının ara yüzeyinde yüzen cisim (F_k = V₁·d₁·g + V₂·d₂·g) yok. İple tabana bağlı ya da ipe asılı cisimde ip gerilmesi soruları da yok (ip gerilmesi artık Newton'da var).
- **Isı ve sıcaklık:** Isı iletim hızı (kesit alanı, kalınlık, sıcaklık farkı ve madde cinsine bağlılık) yok. Hâl değişimi grafiği okuma soruları için "karışımda buz kalır mı?" kontrolü (önce gerekli ısıları karşılaştırmak) da yok.
- **Vektörler:** Üç kuvvetin dengesi (kapalı üçgen, Lami) ve bileşenlerle toplama örneği (iki eğik vektörün x ve y bileşenlerini toplama) yok.
- **Bir boyutta hareket:** Hava direnci ve limit hız (AYT) yok. Aşağı doğru atış (v = v₀ + g·t) ayrıca anlatılmıyor.
- **Newton yasaları:** Eğik düzlemde kayan cismin ivmesi (a = g·sinθ − μ·g·cosθ) ve makaralı sistemler (Atwood) yok. Atwood için "Basit makineler" konusunda ayrı kart olup olmadığına bakılmalı.
- **İki boyutta hareket:** Yüksekten eğik atış (atıldığı seviyeden farklı yere iniş) ve hareket hâlindeki araçtan atış (bağıl hareketle bağlantı) yok.
- **Bağıl hareket:** Kapsam yeterli. Akıntıya karşı ve akıntı yönünde gidip gelme (toplam süre) ile iki kayığın karşılaşma soruları eklenebilir.

Video bulgusu yok: `videolar.json` dosyasında bu 10 konuya bağlı video yok.

### Kavram denetimi: fizik2

Kapsam: is-enerji-guc, basit-makineler, momentum, tork-denge, cembersel-hareket, kutle-cekimi, elektrostatik, elektrik-akimi, elektriksel-enerji, manyetizma. Her konuda kartlar (metin, SVG yazıları, ok yönleri, `etk` formülleri), 4 soruluk test, `content/adimli/<konu>.json` ve sahneler (`components/sahne/fizik5.tsx` … `fizik10.tsx`) tarandı.

Bütün sayısal örnekler yeniden hesaplandı (iş, KE/PE, verim, kaldıraç/çıkrık/dişli, itme, F–t alanları, çarpışma hızları ve KE kayıpları, tork ve destek tepkileri, kütle merkezi, devrilme açıları (22° ve 45°), merkezcil kuvvet, viraj hızı, yuvarlanma katsayıları (1,41 / 1,20 / 1,15 / 1,00), g(h), Kepler 3 tablosu, Kepler 2 alanları, Coulomb, dokunmayla yük paylaşımı, devre akımları, güç, kWh, sigorta akımları, F = BIL sinθ). Hepsi doğru çıktı. Test cevap indeksleri doğru. Manyetizmada sağ el kuralının bütün yön çizimleri (kart 6, 9, 11, 12, 13; Oersted ve motor sahneleri) vektör çarpımıyla denetlendi. Tek yanlış yön `fiz10-kuvvet` sahnesindeydi (aşağıda #1).

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Kritik | fizik › manyetizma › adımlı ders adım 6 / sahne `fiz10-kuvvet` | B sağa, I sağ-yukarı (ekran düzleminde) gösteriliyor; F = I·L × B sayfanın **içine** yönelir. Sahne ⊙ çizip "kuvvet ekrandan sana doğru" yazıyordu. Bu, kart 9'daki sağ el kuralıyla da çelişiyordu. | Simge ⊗ yapıldı, yazı "⊗ kuvvet ekrana giriyor" oldu. | Düzeltildi |
| 2 | Orta | fizik › kutle-cekimi › kart 12 | AYT'de beklenen çekim potansiyel enerjisi (Eₚ = −GMm/r, sonsuzda sıfır, hep negatif) hiçbir yerde yoktu. Kurtulma hızı formülü gerekçesiz veriliyordu. Konu 14 kartta olduğu için yeni kart eklenemedi (doğrulayıcı en çok 14 kart kabul ediyor). | Kurtulma hızı kartının metni Eₚ = −G·M·m/r ve ½mv² − GMm/R ≥ 0 koşuluyla yeniden yazıldı (42 kelime). | Düzeltildi |
| 3 | Orta | fizik › kutle-cekimi › kart 5 (metin, SVG, key) | Aynı konuda G hem evrensel çekim sabiti (kart 1, 4, 9, 12) hem ağırlık ("G = m·g", "Dünya'da G = 490 N") için kullanılıyordu; öğrenci g = G·M/r² ile G = m·g'yi karıştırabilir. | Bu kartta ağırlık "m·g" ve "ağırlık 490 N" diye yazıldı. | Düzeltildi |
| 4 | Orta | fizik › kutle-cekimi › kart 10 | "Yer eşzamanlı" tanımı ile "yer durağan" (ekvator düzleminde, hep aynı noktanın üstünde) karışıyordu. Eşzamanlı uydu ekvator düzleminde olmak zorunda değildir, gökte sabit görünmez. | Başlık "Yer eşzamanlı ve yer durağan uydu" oldu. Metin iki terimi ayırıyor. | Düzeltildi |
| 5 | Orta | fizik › elektrostatik › kart 12 | "Sığaç yük ve enerji depolar" ifadesi bilinen yanılgıyı (sığacın net yükü var) besliyor. Sığacın net yükü sıfırdır. | "levhalarda +Q ve −Q yük biriktirip enerji depolar" | Düzeltildi |
| 6 | Orta | fizik › elektrostatik › kart 14 (Özet) | "yalnızca elektron taşınır" genelleme olarak yanlış. Aynı konunun kart 2 etkileşiminde tuzlu suda ve vücutta iyonların yük taşıdığı söyleniyor. | "katılarda yalnızca elektron taşınır" | Düzeltildi |
| 7 | Orta | fizik › tork-denge › adımlı ders adım 4 | "Destek de 700 N yukarı iter" deniyor, ama test 3 tahtanın ağırlığı olduğunu varsayıyor. Ağırlıklı tahtada destek tepkisi 700 N'dan büyüktür. | "Tahtanın ağırlığını saymazsak destek de 700 N yukarı iter" | Düzeltildi |
| 8 | Küçük | fizik › cembersel-hareket › kart 9 key | "v ≥ √(gr) ise yolcu koltuğa bastırılır". Eşitlik durumunda koltuk kuvveti sıfırdır, yolcu bastırılmaz. | "v ≥ √(g·r) ise yolcu düşmez; daha hızlıysa koltuğa bastırılır." | Düzeltildi |
| 9 | Küçük | fizik › cembersel-hareket › adımlı ders adım 6 | Islak yol için kart 7 μ ≈ 0,4 diyor, adımlı ders μ ≈ 0,3 (12 m/s) diyordu (tutarsızlık). | μ ≈ 0,4 → √(0,4·9,8·50) ≈ 14 m/s (hikâye aynı: 15 m/s'de savrulur). | Düzeltildi |
| 10 | Küçük | fizik › manyetizma › adımlı ders adım 5 | "akım kesilince mıknatıslık biter" ifadesi kart 8 ile çelişiyordu (kart 8: "büyük ölçüde kaybolur"; yumuşak demirde artık mıknatıslık kalır). | "neredeyse tamamen kaybolur" | Düzeltildi |
| 11 | Küçük | fizik › is-enerji-guc › kart 9 | Elektrik enerjisinin %20'sini ışığa çeviren "ampul" örneği, elektriksel-enerji kart 13'teki akkor ampul ≈ %5 değeriyle çelişiyor. | "LED ampul" yazıldı. | Düzeltildi |
| 12 | Orta | fizik › is-enerji-guc › kart 7 (başlık "enerji ısıya döner"), kart 9; elektriksel-enerji kart 1, 5, 13; momentum kart 10 | "Mekanik enerji ısıya dönüşür" dili, "ısı cismin içindeki enerjidir" yanılgısını besleyebilir. Doğrusu: enerji iç enerjiye (ısıl enerjiye) dönüşür ve ısı olarak çevreye aktarılır. Kart 7'de "(iç enerjiye)" notu var, ama başlık ve diğer kartlar "ısı" diyor. MEB kitapları da "ısı enerjisine dönüşür" dediği için tek tek değiştirilmedi. | Proje genelinde tek bir terim kararı verilsin (ör. "iç enerjiye / ısıl enerjiye dönüşür, ısı olarak yayılır") ve bütün fizik konularına birlikte uygulansın. | Öneri |
| 13 | Küçük | fizik › elektrostatik › kart 4, adımlı ders adım 2 | "Dokunan iletken kürelerde yük yarıçapla orantılı paylaşılır" ifadesi tam olarak yalnızca birbirinden uzak, telle bağlı küreler için doğrudur (kart 4 SVG'si de "tel ile bağlanan" diyor). Dokunan kürelerde yalnızca yaklaşıktır. Ders kitapları bu kuralı böyle kullandığı için değiştirilmedi. | Metne "(yaklaşık; telle bağlı uzak kürelerde tam)" gibi bir not eklenebilir. | Öneri |
| 14 | Küçük | fizik › kutle-cekimi › adımlı ders adım 3 | Dünya yarıçapı adımlı derste 6400 km, kart 5 etkileşiminde 6370 km alınıyor (yuvarlama farkı). | Tek değer seçilebilir (6400 km sade). | Öneri |
| 15 | Küçük | fizik › momentum › sahne `fiz6-yastik` | "yaralanma sınırı ~10 000 N" kaynaksız bir eşik. "~" ile verilmiş, temsilî sayılır. | Etikete "(temsilî)" eklenebilir. | Öneri |
| 16 | Küçük | fizik › kutle-cekimi › kart 10 | Dolanım süresi "≈ 24 saat"; gerçek değer bir yıldız günü (23 sa 56 dk). Yuvarlama olarak kabul edilebilir. | İstenirse "≈ 23 sa 56 dk (bir yıldız günü)" yazılabilir. | Öneri |

#### Kapsam eksikleri
- **İş, enerji ve güç:** P = F·v (sabit hızla çekilen cisimde güç) yok. TYT/AYT güç sorularında sık çıkar.
- **Kütle çekimi:** Eₚ = −GMm/r yalnızca kurtulma hızı kartına sığdırıldı. Yörüngedeki uydunun toplam enerjisi (E = −GMm/2r) ve "uydu alçalınca hızlanır ama toplam enerjisi azalır" fikri yok. Konu 14 kartta olduğu için ileride bir kart bunlarla birleştirilebilir.
- **Çembersel hareket:** Konik sarkaç (T·sinα = mv²/r, T·cosα = mg) ve yatay düzlemde ip ile döndürülen cisim için düzlem dışı denge yok. AYT soru tipleridir.
- **Tork ve denge:** Eğik düzlemde kutunun devrilmeden önce kayabileceği (sürtünme koşulu) belirtilmemiş. Adımlı dersin devrilme sahnesi yalnız devrilmeyi gösteriyor.
- **Elektrik akımı:** Reosta/potansiyometre ile ayarlanabilir direnç ve üretecin verdiği güç (P = ε·I, iç dirençte harcanan I²r) yok.
- **Elektriksel enerji:** Üretecin gücü ve iç dirençte kaybolan güç; en büyük güç aktarımı (R = r) yok.
- **Manyetizma:** Dünya'nın manyetik alanının eğim (inklinasyon) açısı yok; yalnızca sapma açısı var.
- **Momentum:** Kütle merkezinin hızı (v_KM = Σp / Σm) ve çarpışmada kütle merkezinin sabit hızla gitmesi yok.

### Kavram denetimi: fizik3

Dal: `worktree-agent-adcf62147705842a1` · Commit: `c95b1ff`

Konular: induksiyon-ac, basit-harmonik-hareket, dalgalar, optik, dalga-optigi, ozel-gorelilik, kuantum, radyoaktivite.
Denetlenenler: `content/fizik.json` içindeki kartlar (metin, SVG yazıları ve önemli SVG'lerin geometrisi: ok yönleri, kırılma açıları, saçak sırası, sapma yönleri), testler, `etk` formülleri; `content/adimli/<konu>.json`; sahneler `components/sahne/fizik10.tsx` (indüksiyon kısmı), `fizik11.tsx`, `fizik12.tsx`, `fizik13.tsx`, `fizik14.tsx`.

Bütün sayısal örnekler yeniden hesaplandı: Faraday 20 V / 15 V, ε = BLv = 1 V, 325/√2 ≈ 230 V, iletim kaybı (38 kV → 380 kV; %6,9 → %0,07), BHH hız/ivme örnekleri, T = 2π√(m/k), Ay'da √6 ≈ 2,45, 1/4 enerji payı, v = λf, dB değerleri, Snell (n = 1,6; 1,9·10⁸ m/s), sınır açılar (42°, 49°), görünür derinlik, ayna/mercek denklemi örnekleri, etk büyütme formülü, Young (3 mm, 4 mm, 12 mm), tek yarık (20 mm), sıvıda 3 mm, γ (5/3, 1,25, 0,866c, 10,01), müon 656 m / 6,6 km, GPS (−7, +45, ≈ 11 km/gün), 1 g → 9·10¹³ J, Wien (500 nm, 5800 K), 1240/λ, sodyum eşiği ≈ 539 nm, E₄ − E₂ = 2,55 eV → 486 nm, 656 nm, de Broglie (0,12 nm; 2,2·10⁻³⁴ m), He-4 kütle açığı 0,0304 u → 28,3 MeV, 8α + 6β⁻, yarı ömür örnekleri, füzyonda 26,7 MeV. Hepsi doğru çıktı. Testlerde yanlış işaretlenmiş cevap ya da birden fazla doğru seçenek yok. Sahnelerdeki hedef koşullar metinle uyumlu.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | fizik › dalgalar › kart 13 (metin ve SVG) | "Frekans arttıkça … enerji artar" deniyor. Bir dalganın enerjisi genliğe (şiddete) de bağlı olduğu için bu ifade "yüksek frekanslı dalga hep daha enerjilidir" yanılgısını besliyor. Frekansla artan şey tek bir fotonun enerjisidir. | Metin "fotonların enerjisi artar", SVG "frekans ve foton enerjisi artar" yapıldı. | Düzeltildi |
| 2 | Orta | fizik › optik › kart 6 | "Az yoğundan çok yoğun ortama" ifadesi tanımsız kalıyor; kütle yoğunluğuyla karıştırılabilir (örneğin yağ sudan hafiftir ama kırılma indisi daha büyüktür). | "Kırılma indisi küçük (az yoğun) ortamdan büyük (çok yoğun) ortama" yapıldı. | Düzeltildi |
| 3 | Orta | fizik › kuantum › kart 1; adımlı ders adım 1 | "Isıtılan her cisim ışıma yapar" ifadesi "yalnızca sıcak cisimler ışır" yanılgısını besliyor. Aynı kartın ana fikri de 310 K'deki insanın ışıdığını söylüyor, metin bununla çelişiyor. | "Mutlak sıfırın üstündeki her cisim ışıma yapar" yapıldı (kartta ve adımlı derste). | Düzeltildi |
| 4 | Küçük | fizik › kuantum › kart 11 | Bohr modeli sınırı belirtilmeden anlatılıyor. Öğrenci bu modeli bütün atomlara genelleyebilir. | "Model yalnız tek elektronlu atomlarda işler." cümlesi eklendi (43 kelime). | Düzeltildi |
| 5 | Orta | fizik › radyoaktivite › kart 12 | Gıda ışınlama ve sterilizasyon anlatılırken, çok yaygın bir yetişkin yanılgısı olan "ışınlanan şey radyoaktif olur" düşüncesi düzeltilmiyor. | "Gıdalar ışınlanarak daha uzun saklanır; ışınlanan gıda radyoaktif olmaz." yapıldı (40 kelime). | Düzeltildi |
| 6 | Küçük | fizik › radyoaktivite › adımlı ders adım 6 | β⁻'nin en çok sapmasının nedeni yalnızca "7300 kat hafif" olması gibi sunuluyor. Asıl belirleyen yük/kütle oranıdır (α'nın yükü 2 kat, hızı da farklı). Söylenen yanlış değil, ama eksik. | "yük/kütle oranı α'nınkinden binlerce kat büyük olduğu için" biçimine çevrilebilir. | Öneri |
| 7 | Küçük | fizik › basit-harmonik-hareket › kart 4 | "Dengeden başlarsa x = A·sin(ωt)" ifadesi yalnızca cisim + yönde harekete başlıyorsa geçerli. | "dengeden + yönde başlarsa" yazılabilir. | Öneri |
| 8 | Küçük | fizik › optik › kart 3 | "Sağ elini kaldırınca görüntün sol elini kaldırıyormuş gibi görünür." Ders kitaplarında böyle anlatılır ve "gibi görünür" dendiği için yanlış değil. Fiziksel olarak ayna sağ-solu değil, ön-arkayı ters çevirir. | İsterseniz ana fikre "ayna aslında ön-arkayı ters çevirir" notu eklenebilir. | Öneri |
| 9 | Küçük | fizik › dalgalar › kart 11 | "Kulağın duyduğu şiddet düzeyi desibelle ölçülür" ifadesinde fiziksel şiddet düzeyi (dB) ile algılanan ses yüksekliği karışabilir. | "Şiddet düzeyi desibelle (dB) ölçülür" demek yeterli. | Öneri |
| 10 | Küçük | fizik › induksiyon-ac › kart 12 | Kayıp için P = I²R doğru veriliyor. Ama öğrencinin sık yaptığı P = V²/R hatası (V'yi hat gerilimi almak) ayrıca uyarılmıyor. | Ana fikre "V²/R'deki V hat gerilimi değil, hattaki gerilim düşüşüdür" notu eklenebilir. | Öneri |
| 11 | Küçük | sahne `fiz13-hiz`, `fiz13-esz` (kod yorumları) | Yorumlardaki ölçekler (1 m = 1,6 px; c = 60 px/s) koddaki değerlerle (PX = 1,2; C = 40) tutmuyor. Ekranda etkisi yok. | Yorumlar düzeltilebilir. | Öneri |

Toplam: 11 bulgu. Kritik 0, Orta 4, Küçük 7. Düzeltilen 5, öneri 6.

#### Kapsam eksikleri
- **Basit harmonik hareket:** Basit sarkaçta geri getirici kuvvetin kaynağı (mg·sinθ ≈ mg·x/L) gösterilmiyor; T = 2π√(L/g) formülü türetilmeden veriliyor.
- **İndüksiyon ve alternatif akım:** Lenz yönünün sağ el kuralıyla bulunması (halkadaki akımın saat yönü mü, tersi mi olduğu) somut bir örnekle çalıştırılmıyor; AYT'de sık sorulur. Gerçek transformatörde verim ve kayıplar (girdap akımı, ısınma) yalnızca etk açıklamasında geçiyor.
- **Optik:** Işık şiddeti, ışık akısı ve aydınlanma (E = I/d², cosθ etkisi) yalnızca bir ana fikir satırında var; TYT'de ayrı bir kart hak ediyor. Tümsek ayna ve ıraksak mercek için sayısal bir örnek yok.
- **Dalga optiği:** İnce zarda yansımada yarım dalga (π) faz kayması anlatılmıyor. Bu, AYT için şart değil, ileri düzey için not olarak geçebilir.
- **Özel görelilik:** Toplam enerji (E = γmc²) ve göreli kinetik enerji (E<sub>k</sub> = (γ − 1)mc²) yok, oysa `fiz13-sinir` sahnesi bunu kullanıyor. "Göreli kütle artışı" yanılgısına karşı (kütle değişmez, γ momentuma ve enerjiye girer) bir cümle eklenebilir.
- **Kuantum:** Bohr modelinden modern atom modeline (orbital, olasılık bulutu) geçişe atıf yok (kimya › atom-modelleri ile bağlantı kurulabilir).
- **Radyoaktivite:** Aktivite (Bq) ve soğurulan/eşdeğer doz (Gy, Sv) kavramları yok. "Radyasyon" ile "radyoaktif madde (bulaşma)" ayrımı açıkça yapılmıyor.

### Kavram denetimi: kimya1

Dal: `worktree-agent-abddf949e89e36969` · Commit: `ba822d2`
Konular: simya, kimya-bilimi, madde, atom-modelleri, atomun-yapisi, periyodik-tablo, kimyasal-baglar, maddenin-halleri, karisimlar (kartlar, testler, adımlı dersler, sahneler kimya1-4.tsx, atom.tsx).

Kontrol edilen sayılar (hepsi doğru çıktı): iyonlaşma enerjisi grafiği (eV, 20 element) ve sahnedeki kJ/mol değerleri; Pauling elektronegatiflikleri; kovalent yarıçaplar; KNO₃/NaCl çözünürlük eğrileri ve test hesabı (78 g); suyun buhar basıncı tablosu, 526 mmHg ≈ 3000 m; kritik sıcaklıklar (N₂, O₂, C₃H₈, H₂O, CO₂); üçlü noktalar (su 0,006 atm, CO₂ 5,1 atm); CO₂ faz eğrileri; Balmer çizgileri (656/486 nm), Lyman/Paschen; Rutherford sapma formülü; Mendeleyev'in eka-silisyum tahmini; Cl ortalama kütlesi; bağ enerjileri; erime/buharlaşma ısıları; sıvı hava kaynama noktaları; en bol izotop nötron sayıları.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | kimya › madde › kart 1 (metin + SVG) | "Işık, ses ve ısı ... enerjinin biçimleridir" ifadesi "ısı bir enerji türüdür / cisimde depolanır" yanılgısını besliyor. | "ışık ve ses enerji taşır, ısı da sıcaktan soğuğa aktarılan enerjidir"; SVG alt yazısı "enerji, enerji aktarımı" oldu. | Düzeltildi |
| 2 | Orta | kimya › madde › kart 6 | Renk değişimi, gaz, ısı, ışık "kimyasal değişimin ipuçları" diye verilmiş; tek başına kanıt sanılabilir (kaynama da gaz çıkarır). | "ama tek başına kanıt değildir: kaynayan su da gaz çıkarır" eklendi. | Düzeltildi |
| 3 | Orta | kimya › kimya-bilimi › kart 7, test 3 açıklaması | Su aside eklenince tehlikenin "ısınan suyun sıçraması" olduğu söyleniyor; sıçrayan şey asittir (adımlı derste doğru anlatılmış, tutarsızlık). | "az miktardaki su birden kaynar ve asidi sıçratabilir" / test açıklaması uyumlu hâle getirildi. | Düzeltildi |
| 4 | Küçük | kimya › simya › kart 5 | Damıtmayı Câbir ve Râzî "geliştirdi" ifadesi icat ettikleri gibi okunabiliyor; yöntem İskenderiye'de biliniyordu. | "İskenderiye'de bilinen bu yöntemi ... geliştirdi". | Düzeltildi |
| 5 | Orta | kimya › simya › adımlı ders adım 3-4 | Boyle (1661) anlatısının hemen ardından "suya akım ver" deniyor; elektrolizi Boyle yapmış gibi algılanıyor (su elektrolizi 1800). | "Onun ölçütünü suya uygulayan elektroliz deneyi ise 1800'de yapıldı" eklendi. | Düzeltildi |
| 6 | Orta | kimya › atom-modelleri › kart 3 | Dalton modelinin yetersizliği yalnızca elektronla açıklanmış; "aynı elementin atomları özdeştir" varsayımını izotoplar çürütür. | "elektronun ve izotopların keşfiyle yetersiz kaldı". | Düzeltildi |
| 7 | Orta (eksik) | kimya › atom-modelleri | Proton (Rutherford 1919) ve nötron (Chadwick 1932) keşfi hiç yoktu; testte "nötronun varlığı" çeldiricisi var ama kartta karşılığı yok. | Yeni kart 7 "Proton ve nötronun keşfi" (He çekirdeği kütle örneği, keşif sırası). | Düzeltildi |
| 8 | Orta (eksik) | kimya › atomun-yapisi | Yalnızca 2-8-8 katman kuralı var; öğrenci 4. periyotta 2-8-9-2 gibi hatalı dizilime gider; AYT orbital dizilimi (1s 2s 2p...) hiç yok. | Yeni kart 11 "Daha derin: Orbitaller" (s/p/d orbital sayıları, dolma sırası, 3d'nin 4s'den sonra dolması, Ca dizilimi). | Düzeltildi |
| 9 | Orta (eksik) | kimya › periyodik-tablo | Elektron ilgisi ve metalik/ametalik karakter (MEB 9 periyodik özellikler) yoktu. | Yeni kart 9 "Elektron ilgisi ve metalik karakter" (Cl > F istisnası anahtar cümlede). | Düzeltildi |
| 10 | Orta (eksik) | kimya › periyodik-tablo | s, p, d, f blokları, geçiş metalleri, ana grup/B grubu ayrımı yoktu. | Yeni kart 10 "s, p, d, f blokları". | Düzeltildi |
| 11 | Küçük (eksik) | kimya › periyodik-tablo › kart 6 anahtar | İyon yarıçapı (katyon küçülür, anyon büyür) hiç geçmiyor; TYT'de sık soru. | Anahtar cümle: "Katyon atomundan küçük, anyon atomundan büyüktür." | Düzeltildi |
| 12 | Orta (eksik) | kimya › kimyasal-baglar | MEB'in zayıf etkileşimler listesindeki iyon–dipol ve dipol–indüklenmiş dipol yoktu; tuzun suda çözünmesi (karışımlar konusundaki hidratasyon) açıklamasız kalıyordu. | Yeni kart 9 "İyon–dipol ve indüklenmiş dipol" (Na⁺/Cl⁻ çevresinde su yönelimi, O₂'nin suda çözünmesi). | Düzeltildi |
| 13 | Orta | kimya › madde › adımlı ders adım 4 | "Zeytinyağı sudan hafif olduğu için üste çıkar": hafif/ağır ile yoğunluk karıştırılıyor (yaygın yanılgı). | "yoğunluğu sudan küçük olduğu için". | Düzeltildi |
| 14 | Küçük | kimya › madde › adımlı ders adım 6; sahne kim2-degisim | "karbondioksit" yazımı, başka yerlerde (ve TDK'de) "karbon dioksit". | Üç yerde "karbon dioksit" yapıldı. | Düzeltildi |
| 15 | Küçük | kimya › atomun-yapisi › kart 2 / adımlı ders adım 1 | Stadyum benzetmesinde kartta "bilye", adımlı derste "bezelye"; 10⁵ oranıyla 150 m'lik stadyumda çekirdek ~1,5 mm (bezelyeden küçük). | Tek benzetmede birleşmek, oranı "10⁴–10⁵" diye vermek. | Öneri |
| 16 | Küçük | kimya › karisimlar › kart 4-5 | Sis kart 4'te aerosol, kart 5'te koloit örneği; ikisi de doğru (aerosol bir koloit türü) ama öğrenci "hangisi?" diye takılabilir. | Kart 5'e "aerosoller de koloittir" notu. | Öneri |
| 17 | Küçük | kimya › kimyasal-baglar › kart 3 | "H ... 2 elektronla (dublet) kararlıdır": tek başına H'nin 1 elektronu var; bağ kurunca/H⁻ olunca 2'ye ulaşır. | "H bağ kurunca ..." biçiminde netleştirmek. | Öneri |
| 18 | Küçük | kimya › simya › kart 2 | "kimyasal tepkimeyle element dönüşmez" doğru; nükleer tepkimeyle dönüşümün mümkün olduğu (radyoaktivite konusu) belirtilmemiş. | Anahtar cümleye "çekirdek tepkimeleri ise elementi değiştirir" notu. | Öneri |

Sayım: Kritik 0, Orta 12, Küçük 6. Düzeltilen 14, öneri 4.

#### Kapsam eksikleri
- **Modern atom teorisi (AYT, 11. sınıf) ayrı konu olarak yok:** kuantum sayıları, Pauli/Hund kuralları, küresel simetri, istisna dizilimler (Cr, Cu), iyonların orbital dizilimi. Atomun yapısına tek bir giriş kartı eklendi; asıl konu `dersler.json`'a yeni konu olarak önerilir.
- **maddenin-halleri:** bağıl nem ve hissedilen sıcaklık (MEB 9 sıvılar alt konusu) yok; konu 14 kartla sınırda olduğu için eklenmedi.
- **kimya-bilimi:** yaygın adlarda yemek sodası (NaHCO₃), çamaşır sodası (Na₂CO₃), potas kostik (KOH), amonyak (NH₃), kezzap/kireç kaymağı eksik.
- **periyodik-tablo:** ardışık iyonlaşma enerjilerinden grup bulma (AYT'de sık) yok.
- **simya:** simyacıların somut katkıları (Câbir: nitrik/sülfürik asit; Râzî: alkol, maddelerin sınıflandırılması) tek cümlede anılabilir.
- **atom-modelleri:** Millikan yağ damlası deneyi (elektron yükü) yok.

### Kavram denetimi: kimya2

Konular: temel-kanunlar, tepkimeler, mol, asit-baz, kimya-her-yerde, gazlar, cozeltiler, tepkime-enerjisi, tepkime-hizi
Dal: `worktree-agent-a54e805a117284762` · Commit: `06c25ba`
Denetlenenler: kartlar (metin, SVG yazıları, key, etk), 4 soruluk testler, `content/adimli/*.json` ve `components/sahne/kimya5-9.tsx` içindeki ilgili sahneler. Bütün sayısal örnekler yeniden hesaplandı (stokiyometri, ΔH, pH/Ka, tampon, Graham, gaz yasaları, koligatif, KNO₃ çözünürlüğü, hız denklemi). Testlerin hepsinde doğru cevap indeksi ve açıklama doğru.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | kimya › tepkime-enerjisi › kart 2 | "Bitki enerjiyi glikozun bağlarında depolar; solunumda açığa çıkar": "bağ enerji depolar, kırılınca enerji verir" yanılgısını besliyor (kart 10 ve adımlı ders adım 6 ile de çelişiyor). | "Güneş enerjisi glikoz ile oksijenin kimyasal enerjisine dönüşür. Solunumda daha sağlam bağlı CO₂ ve H₂O oluşurken bu enerji açığa çıkar." | Düzeltildi |
| 2 | Orta | kimya › tepkime-enerjisi › kart 3 | Entalpi "maddenin ısı içeriği" diye tanımlanmış: "ısı cismin içindeki enerjidir" yanılgısı. | "Bir sistemin sabit basınçtaki enerji içeriğini gösteren büyüklük; ısı ise içerik değil, aktarılan enerjidir." | Düzeltildi |
| 3 | Orta | kimya › mol › kart 2 | Bağıl atom kütlesi "izotopların ortalaması" deniyor; Cl = 35,5 basit ortalama (36) değil. | "izotopların bolluğa göre ağırlıklı ortalamasıdır" | Düzeltildi |
| 4 | Orta | kimya › tepkime-hizi › kart 7 (key) | "k'yı yalnız sıcaklık ve katalizör değiştirir": heterojen tepkimede temas yüzeyi de k'yı değiştirir (kart 12 ile ve MEB anlatımıyla çelişiyor). | Temas yüzeyi eklendi. | Düzeltildi |
| 5 | Küçük | kimya › tepkime-hizi › kart 6 | "Ekzotermikte Ea,ileri küçük, endotermikte büyüktür" neye göre olduğu belirsiz. | "Ekzotermikte Ea,ileri < Ea,geri, endotermikte tersidir." | Düzeltildi |
| 6 | Orta | kimya › cozeltiler › kart 2 | NaCl'nin "iyonlarına ayrışarak" çözündüğü anlatılıyor ama çözünmenin fiziksel olay olduğu bu konuda hiç söylenmiyor ("çözünme kimyasal değişimdir" yanılgısı). | "Yeni madde oluşmadığı için çözünme fiziksel bir olaydır." cümlesi eklendi. | Düzeltildi |
| 7 | Küçük | kimya › cozeltiler › adımlı ders adım 1 | "Elektrik ileten çözeltilere elektrolit denir": elektrolit çözünen maddedir, çözelti değil. | "Suda iyonlarına ayrışıp çözeltisini iletken yapan maddelere elektrolit denir." | Düzeltildi |
| 8 | Orta | sahne kim6-ph (asit-baz adımlı ders adım 1) | pH 9 örneği "Kabartma tozu": kabartma tozu asit + NaHCO₃ karışımıdır, çözeltisi yaklaşık nötrdür. Bazik örnek olarak yanlış. | "Karbonat (NaHCO₃)" (pH ≈ 8,3; ölçek "yaklaşık" diyor). | Düzeltildi |
| 9 | Küçük | sahne kim7-graham (gazlar adımlı ders adım 6) | "HCl %41'unu aldı": ek yanlış. | "%41'ini" | Düzeltildi |
| 10 | Küçük | sahne kim7-etiket ↔ kimya-her-yerde kart 10 | Aynı etiket (480 kcal, 25 g şeker) sahnede tuz 0,6 g, kartta 0,8 g. | Sahne 0,8 g yapıldı. | Düzeltildi |
| 11 | Küçük | sahne kim6-tuz (asit-baz adımlı ders adım 5) | Hidroliz çizimde 3 asetattan 2'si CH₃COOH + OH⁻ oluyor; gerçekte oran yaklaşık 10⁻⁴'tür. "Hidroliz neredeyse tam olur" izlenimi verebilir. | Tek asetatın dönüşmesi ve "temsilî: gerçekte çok küçük bir kısmı" notu. | Öneri |
| 12 | Küçük | sahne kim6-kuvvet (asit-baz adımlı ders adım 3) | Zayıf asitte 8 molekülden 1'i (%12,5) iyonlaşmış çiziliyor, yazı "~%1". | "Temsilî" notu ya da daha çok HA molekülü. | Öneri |
| 13 | Küçük | kimya › cozeltiler › kart 3 (SVG) | Tabloda etanol "polar" satırında, hekzanda "çok az" çözünür gösteriliyor. Etanol amfifildir; hekzan gibi apolar çözücülerde de belirgin ölçüde çözünür. | Etanolü satırdan çıkar ya da "etanol her ikisinde de çözünür" notu ekle. | Öneri |
| 14 | Küçük | kimya › tepkime-hizi › adımlı ders adım 5 | "Kütle aynı olduğu için sonunda iki balon eşit şişer" ancak HCl fazlaysa doğru. | "(HCl yeterliyse)" eki. | Öneri |
| 15 | Küçük | kimya › mol › kart 4, gazlar › kart 6 | 22,4 L/mol, 0 °C ve 1 atm için doğru. IUPAC'ın güncel STP'si 0 °C ve 1 bar'dır (22,7 L). Üniversite öğrencisi karışıklık yaşayabilir. | "IUPAC STP: 1 bar, 22,7 L" kısa notu (MEB 22,4'ü kullandığı için mevcut değer korunmalı). | Öneri |
| 16 | Küçük | kimya › tepkime-enerjisi › kart 10 | Bağ enerjisinin tanımı yok (gaz hâlinde 1 mol bağı kırmak için gereken enerji). | Tanım kartın ilk cümlesine eklenebilir (kart 41+ kelime, yer dar). | Öneri |

Toplam 16 bulgu: Kritik 0, Orta 7, Küçük 9. Düzeltilen 10, öneri 6.

Not: Dokuz konunun hepsi 14 kartta, yani `tools/check.py` sınırında. Bu yüzden yeni kart eklenemedi. Eksik kavramlar aşağıda öneri olarak listelendi.

### Doğrulanan, sorun olmayan noktalar (özet)
- temel-kanunlar: Mg 2,4 → 4,0 g; katlı oran tabloları (N₂O/NO/NO₂ 1:2:4, SO₂/SO₃ 2:3); tarihler (Proust 1790'lar, Dalton 1803-08, Gay-Lussac 1808, Avogadro 1811); testler 1-4.
- tepkimeler: bütün denkleştirmeler (eksik yanma 2CH₄ + 3O₂ → 2CO + 4H₂O dahil); seyirci iyon testleri; CO-hemoglobin bilgisi.
- mol: yüzde bileşim, basit formül (CH₂O), sınırlayıcı bileşen, karışım problemi (0,3/0,2 mol), oda koşulu 24,5 L.
- asit-baz: Ka değerleri (HCN 6,2×10⁻¹⁰, HF ≈ 7×10⁻⁴), CH₃COO⁻ Kb 5,6×10⁻¹⁰; 0,1 M asetik asit pH 2,9; tampon 4,74 → 4,66; asetat eşdeğerlik pH ≈ 8,7; Zn + 2NaOH → Na₂ZnO₂ + H₂.
- gazlar: birleşik gaz ve PV = nRT örnekleri, O₂ yoğunluğu 1,43 g/L, NH₃–HCl halkası %59/%41, su buharı 24 mmHg.
- cozeltiler: ΔTd/ΔTk (1 m NaCl: −3,72 / +1,04 °C), KNO₃ çökmesi (78 g; 50 g suda 39 g), iyon derişimleri; hidratasyon SVG'sinde O ucu Na⁺'ya, H ucu Cl⁻'ye dönük.
- tepkime-enerjisi: ΔH°f değerleri, metan −890,3 kJ, Hess −110,5 kJ, bağ enerjisi −185 kJ, kalorimetre, ısı değerleri.
- tepkime-hizi: katsayı-hız oranları, deney tablosundan derece (x = 1, y = 2, k = 2), mekanizma, Ea,ileri/Ea,geri ve katalizör sahnesi (120/220 → 60/160 kJ).

#### Kapsam eksikleri
- **asit-baz:** Nötralleşme ve titrasyon hesabında çok protonlu asit ve bazlar yok (H₂SO₄, Ca(OH)₂ için n(H⁺) = n(OH⁻)). TYT/AYT'de sık sorulur. Zayıf asit + zayıf baz tuzlarının pH'ı (Ka ile Kb karşılaştırması) eksik. Asidik, bazik ve amfoter oksitler de yok.
- **cozeltiler:** Çözünme ısısı (ekzotermik ya da endotermik çözünme) bu konuda anlatılmıyor; yalnızca tepkime-enerjisi'nde NH₄NO₃ örneği var. Raoult yasası ve buhar basıncı düşmesinin nicel hâli yok. Osmoz ve ters osmoz yalnızca adı geçerek veriliyor. Ksp kimyasal-denge konusunda olmalı; orada denetlenmeli.
- **tepkime-hizi:** İnhibitör, homojen ve heterojen katalizör ayrımı yok. Hız sabitinin biriminin dereceye göre değişmesi anlatılmıyor.
- **tepkime-enerjisi:** Bağ enerjisi tanımı eksik (bulgu 16). Yanma ve nötralleşme entalpisi gibi özel adlandırılmış entalpi türleri yok.
- **gazlar:** Gerçek gaz için Van der Waals düzeltmesi yalnızca nitel olarak var (AYT için yeterli olabilir).
- **mol:** IUPAC STP notu eksik (bulgu 15).
- **Videolar:** Bu konuların videolarına bakılmadı (kapsam dışı).

### kimya3 denetimi: kimyasal denge, redoks, elektrokimya, organik giriş, hidrokarbonlar, fonksiyonel gruplar, enerji kaynakları

Dal: `worktree-agent-a91f7b352fb72f3f4` · Commit: `ad8e3ee`

Taranan: 7 konunun bütün kartları (metin, SVG yazıları ve okları, etkileşim ayarları), 28 test sorusu, 7 etkileşimli ders ve sahneleri (`kimya9.tsx` denge kısmı, `kimya10.tsx`, `kimya11.tsx`, `kimya12.tsx`). Bütün sayılar hesapla ya da standart değerle karşılaştırıldı: Kc/BDD örnekleri, Nernst ve derişim pili, Faraday örnekleri, E° tablosu, alkan ve izomer kaynama noktaları, alkol çözünürlükleri, cis/trans kaynama noktaları, benzen bağ uzunlukları, g CO₂/MJ (IPCC), atom ekonomisi örnekleri, nano ölçek. Testlerin hepsinde doğru cevap indeksi doğru ve tek. Genel kalite yüksek; içerikte kesin bir bilgi yanlışı bulunmadı.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | kimya › kimyasal-denge › sahne `kim9-hacim` (adımlı ders adım 4) | Hacim yarıya inince denge 6 N₂O₄ · 8 NO₂'den 8 N₂O₄ · 4 NO₂'ye kayıyordu. Bu hâlde Kc 5,3'ten 2'ye düşüyor (sabit T'de olamaz), NO₂ derişimi de başlangıçtakine eşit kalıyor. "Denge kayınca etki tümüyle silinir" yanılgısını besler; gerçekte renk başlangıçtakinden koyu kalır. | Kayma 4→3 ayrışmış N₂O₄ yapıldı: 7 N₂O₄ · 6 NO₂, Kc ≈ 5,1 (≈ korunur), NO₂ derişimi 4'ten 6'ya çıkar. | Düzeltildi |
| 2 | Orta | kimya › kimyasal-denge › adımlı ders adım 4 (doğru seçenek açıklaması) | Le Chatelier'in etkiyi yalnızca azalttığı, tümüyle silmediği söylenmiyordu. | "…ama tümüyle silmez; NO₂ derişimi yine başlangıçtakinden yüksek kalır" eklendi. | Düzeltildi |
| 3 | Küçük | kimya › redoks › sahne `kim10-zncu` (adımlı ders adım 3-4) | Çözeltiden 5 Cu²⁺ kayboluyor ama yalnızca 4 Zn²⁺ beliriyordu. Zn + Cu²⁺ → Zn²⁺ + Cu oranı 1:1 ve yük dengesi bozuluyordu. | Zn²⁺ sayısı 5 yapıldı. | Düzeltildi |
| 4 | Küçük | kimya › redoks › adımlı ders adım 6 ve kapanış | Kartlarda ve testte "nötralleşme" geçiyor, adımlı derste "nötrleşme". | "Nötralleşme" olarak birleştirildi. | Düzeltildi |
| 5 | Küçük | kimya › hidrokarbonlar › kart 9 ve adımlı ders adım 5 | Bromlu su kartta "kırmızı-kahverengi", adımlı derste "turuncu". İkisi de kabul edilebilir (derişime göre değişir). | Tek bir ifade seçilebilir (ör. "turuncu-kahverengi"). | Öneri |
| 6 | Küçük | kimya › enerji-kaynaklari › sahne `kim12-kule` ve kart 2 | Kesir aralıkları farklı: kartta gazyağı ≈C₁₀–C₁₆, motorin ≈C₁₄–C₂₀; sahnede gazyağı C₁₁–C₁₆, motorin C₁₇–C₂₀. Gerçek aralıklar örtüştüğü için ikisi de yanlış değil. | İstenirse sahne etiketleri karttaki "≈" aralıklarla eşitlenebilir. | Öneri |
| 7 | Küçük | kimya › redoks › kart 12 | "Hidrojenden aktif metaller HCl ve seyreltik H₂SO₄ ile H₂ verir." Pb, seyreltik H₂SO₄ ve HCl'de çözünmeyen PbSO₄/PbCl₂ kabuğu yüzünden pratikte tepkime vermez. | İstenirse "(Pb kabuk bağlayıp yavaşlar)" gibi kısa bir not eklenebilir; ders kitaplarının çoğu bu ayrıntıyı vermez. | Öneri |

Not: Elektrokimya kart 9'daki "Na(s)" yazımı doğrudur. Bu projede (s) sıvı, (k) katı demektir ve erimiş NaCl elektrolizinde Na sıvıdır. İngilizce kaynak kullanan öğrenci bunu "solid" sanabilir; bu kural konu dışında, sözleşme düzeyinde.

#### Kapsam eksikleri

- **Organik giriş: yakma analiziyle formül bulma** (AYT'de sık çıkar): CO₂ ve H₂O kütlelerinden C, H ve fark yoluyla O bulunur; M ile kapalı formüle geçilir. `mol` konusu yüzdeden basit formülü anlatıyor, ama yakma analizi hiçbir yerde yok. Kartı hazırladım (2,9 g madde → 8,8 g CO₂ + 4,5 g H₂O → C₂H₅ → C₄H₁₀; "ürünlerdeki O sayılmaz" uyarısıyla), ancak `tools/check.py` konu başına en çok 14 kart kabul ediyor ve organik-giris'te zaten 14 kart var. Bu yüzden eklemedim. Öneri: kart 13 (organik/anorganik karşılaştırma) ile kart 1 birleştirilerek yer açılabilir ya da kart sınırı 15'e çıkarılabilir.
- **Elektrokimya: sulu çözeltilerin elektrolizinde hangi tür ayrışır?** Kart 9'da yalnızca "sulu NaCl'de katotta H₂" var. Anotta derişik NaCl'de Cl₂, sülfat ve nitrat çözeltilerinde O₂ çıktığı; katotta aktif metal katyonları (1A, 2A, Al) yerine suyun indirgendiği kuralı eksik. 12. sınıf müfredatında var.
- **Redoks: bazik ortamda denkleştirme** (OH⁻ ve H₂O ile) ve **disproportionation** (kendi kendine redoks, ör. Cl₂ + 2NaOH → NaCl + NaOCl + H₂O). Kart 8 yalnızca asidik ortamı anlatıyor.
- **Kimyasal denge: sulu çözelti dengeleri** (Ka, Kb, Ksu, tampon, hidroliz) bu konuda yok. Asit-baz konusunun kapsamına giriyorsa sorun değil; o konunun denetçisi kontrol etmeli. Ayrıca "dengeye iki yönden de (yalnız ürünlerden başlayarak) ulaşılabilir" fikri açıkça söylenmiyor.
- **Organik: optik izomerlik / kiral karbon** hiç geçmiyor. Güncel AYT kapsamında sınırda; en azından cis-trans kartında bir cümleyle anılabilir.
- **Hidrokarbonlar: alkin adlandırması ve uç alkin testi** (amonyaklı AgNO₃/CuCl ile çökelek) yok. Alken adlandırması var.

Doğrulama: `python3 tools/check.py` TAMAM, `npm run lint` hatasız, `npm run build` hatasız.

### Kavram denetimi: biyoloji1

Dal: `worktree-agent-a387e2eab6b55f76b` · Commit: `53f13bf`
Konular: canlilarin-ozellikleri, biyomolekuller, enzimler, hucre-organeller, madde-gecisi, siniflandirma, hayvanlar-alemi, bitkiler-alemi, mitoz, mayoz. Kartlar, SVG yazıları, testler, adımlı dersler ve sahneler (`biyoloji1-5.tsx`, `zar.tsx`) tarandı.

Genel değerlendirme: İçerik çok iyi durumda. Testlerde yanlış işaretlenmiş cevap, birden fazla doğru seçenek ya da hesap hatası yok. Bütün sayılar tek tek kontrol edildi: 2²³ ≈ 8,4 milyon, (2²³)² ≈ 70 trilyon, at 64, eşek 62, katır 63, 2⁶ = 64 bakteri, 6·6 + 4·8 = 68 bacak, Na-K pompasında 3/2, %0,9 NaCl, hemoglobin β zincirinin ilk 8 amino asidi ve 6. sıradaki Glu→Val değişimi, yağ 9 kcal/g, karbonhidrat 4 kcal/g. Bilinen yanılgılara karşı zaten iyi önlem alınmış: "birey evrimleşmez", "bitki gece de solunum yapar", "bakterinin bölünmesi mitoz değildir", "dört odacıklı kalp sabit vücut sıcaklığı demek değildir", "uçmak sınıf ölçütü değildir".

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | biyoloji › madde-gecisi › kart 7 | Turgor basıncı "duvarın geri itmesi" olarak tanımlanmış. Turgor, hücre içeriğinin duvara yaptığı basınçtır; duvarın karşı baskısı ayrı bir kavramdır (çeper basıncı). Emme kuvveti sorularında öğrenciyi yanıltır. | "hücre su alıp duvara baskı yapar (turgor basıncı); duvarın direnci net su girişini durdurur" yapıldı. Kelime sınırı için "Saf suya geri konunca" → "Saf suya konunca". | Düzeltildi |
| 2 | Orta | biyoloji › hucre-organeller › kart 7 (key) | "Kloroplast güneşi besine, mitokondri besini ATP'ye çevirir": madde ile enerjiyi karıştırıyor (ışık maddeye, besin ATP'ye "dönüşüyor" gibi). | "Kloroplast ışık enerjisini besine, mitokondri besindeki enerjiyi ATP'ye aktarır." | Düzeltildi |
| 3 | Orta | biyoloji › madde-gecisi (yeni kart 8) | TYT'de sık sorulan osmotik basınç, emme kuvveti ve bunların turgorla ilişkisi konuda hiç yoktu. | "Osmotik basınç ve emme kuvveti" kartı eklendi: EK = OB − TB; plazmolizde en yüksek, tam turgorda sıfır. Grafikli SVG'si var. | Düzeltildi |
| 4 | Orta | biyoloji › hucre-organeller (yeni kart 10) | Hücre iskeleti yalnızca bir yan cümlede geçiyordu. Sil, kamçı ve sentriolün yapısı yoktu, "zarsız organeller" ayrımı da verilmemişti (9. sınıf kazanımı). | "Hücre iskeleti, sentrozom, sil ve kamçı" kartı eklendi. | Düzeltildi |
| 5 | Orta | biyoloji › enzimler (yeni kart 10) | Enzimlerin hücre dışında da çalışabildiği ve su gerektirdiği yazmıyordu. TYT öncül sorularında sık geçer. | "Hücre dışında da çalışır" kartı eklendi (sindirim enzimleri, deterjan, kuru ve ıslak tohum). | Düzeltildi |
| 6 | Orta | biyoloji › biyomolekuller › kart 3 | Monosakkarit olarak yalnızca heksozlar sayılmış; riboz ve deoksiriboz (pentozlar) yoktu. Nükleik asit kartıyla bağ kurulamıyordu. | "(6 karbonlu); riboz ve deoksiriboz (5 karbonlu, nükleik asitlerde)" eklendi. | Düzeltildi |
| 7 | Orta | biyoloji › biyomolekuller › kart 7 | Zorunlu (temel) amino asit kavramı yoktu. | "vücudun yapamadıkları besinle alınmalıdır (zorunlu amino asitler)" eklendi. | Düzeltildi |
| 8 | Küçük | biyoloji › hayvanlar-alemi › kart 10 | Dil bilgisi hatası: "üremek için suya gerekmez". | "üremek için suya ihtiyaç duymaz". | Düzeltildi |
| 9 | Küçük | sahne `protein` (biyomolekuller adımlı ders adım 5) | Normal durumdaki etiket "Hemoglobin düzgün katlanıyor" idi; orak hücre hemoglobininin yanlış katlandığını ima ediyor. Oysa HbS normal katlanır; düşük O₂'de liflere dönüşüp kümelenir. | Etiket "Normal hemoglobin: alyuvar esnek kalır" yapıldı. | Düzeltildi |
| 10 | Küçük | biyoloji › canlilarin-ozellikleri › kart 3 (SVG) | SVG'deki "enerji bağları" etiketi "enerji bağda saklıdır, bağ kırılınca açığa çıkar" yanılgısını besleyebilir. Ders kitaplarında "yüksek enerjili bağ" dendiği için değiştirmedim. | Etiketi "fosfat bağları" yapmak ya da kartın metnine "enerji, ATP'nin hidroliziyle (su eklenerek) açığa çıkar" demek. | Öneri |
| 11 | Küçük | biyoloji › biyomolekuller › adımlı ders adım 5 | Doğru seçenek "Proteinin şekli ve görevi bozuldu". Orak hücrede molekülün katlanması değil, yüzeyi ve kümelenme davranışı değişir. Ders kitabı düzeyinde kabul edilebilir. | "Proteinin davranışı ve görevi bozuldu" denebilir. | Öneri |
| 12 | Küçük | biyoloji › enzimler › kart 7 (SVG) | `viewBox='0 0 320 205'` kurala aykırı (320 200 olmalı). Görsel bozuk değil. | En alttaki iki yazı (y=180 ve 196) birkaç birim yukarı alınıp viewBox 320 200 yapılabilir. | Öneri |
| 13 | Küçük | biyoloji › madde-gecisi › kart 3 | Derişim için "yoğunluk" kullanılmış. Fizikteki yoğunluk (kütle/hacim) kavramıyla karışabilir. Bazı biyoloji kitapları da böyle kullandığı için değiştirmedim. | "derişim (yoğunluk)" biçiminde ilk geçtiği yerde netleştirmek. | Öneri |

Not: Sahnelerde (aktivasyon, sıcaklık/pH eğrileri, doygunluk, inhibitör sayımı, hücre haritası, kalp odacıkları, sınıflandırma basamakları, döl almaşı, mitoz/mayoz sayaçları, ayrılmama 24-24-22-22, bakteri 2ⁿ) başka bilgi hatası bulunmadı. Görev hedefleri sahne koşullarıyla tutarlı: S evresi %35-60 ve hedef %35-55; inhibitörde substrat 8-16 iken 3 enzim çalışıyor; yağ sahnesinde 11 g ≈ 99 kcal.

#### Kapsam eksikleri (eklenmedi)
- **Enzimler:** Aktivatör kavramı (ör. Cl⁻ iyonunun tükürük amilazını etkinleştirmesi). Enzimin tersinir tepkimeyi iki yönde de hızlandırıp dengeyi değiştirmemesi. Ribozimler yalnızca "çoğu protein" ifadesiyle ima ediliyor.
- **Biyomoleküller:** Doymuş ve doymamış yağ yalnızca key cümlesinde geçiyor, karta konabilir. Zorunlu yağ asitleri ve protein denatürasyonu bu konuda yok (enzimlerde var). Hormonların kimyasal yapısına göre ayrımı (steroit ya da protein) yok.
- **Hücre:** Koful çeşitleri (besin kofulu, kontraktil koful) ve hücreler arası bağlantılar yok. Prokaryotlardaki plazmit yok (ilgili başka konuda olabilir).
- **Madde geçişi:** Diyaliz ve suyun aquaporinlerle geçişi isteğe bağlı olarak eklenebilir.
- **Canlıların ortak özellikleri:** "Hareket" özelliği ayrı anılmıyor. 9. sınıfın "biyoloji ve bilimsel yöntem" (hipotez, kontrol grubu, değişkenler) kazanımı bu konuda yok; başka bir konuda da yoksa eklenmeli.
- **Sınıflandırma:** Liken ve mantar alt grupları (şapkalı mantar, maya, küf) yalnızca örnek olarak geçiyor. Protistlerin alt grupları (öglena, amip, terliksi hayvan) ayrıntılı değil.
- **Mayoz:** İnsanda oogenezin evreleri (mayoz II'nin döllenmeyle tamamlanması) ve eşeyli üremenin bitkilerdeki çift döllenmeyle bağı bu konuda yok (bitki biyolojisinde olabilir).

### Kavram denetimi: biyoloji2

Dal: `worktree-agent-a9e73da0cb0416031` · Commit: `13b88b8`
Konular: kalitim, ekosistem, bitki-biyolojisi, dna-genetik-kod, protein-sentezi, fotosentez, hucresel-solunum, sinir-sistemi, endokrin, duyu-organlari (kartlar, SVG yazıları, etkileşimler, testler, adımlı dersler, `biyoloji5-10.tsx` sahneleri).
Doğrulama: `check.py` TAMAM, `npm run lint` hatasız, `npm run build` hatasız.

Hesaplanarak doğrulanan sayılar (hepsi doğru çıktı): Mendel oranları ve testler (1/8, 1:1, ½), %10 kuralı (50 000 → 500 kJ; sahne 10 000 → 100 kJ = 3. basamak), DDT dizisi (0,000003 → 25 ppm ≈ 8 milyon kat), Chargaff/H bağı (270; 2400), Meselson-Stahl, 2³⁰ ≈ 1 milyar, β-globin 4-7. kodonları (ACU CCU GAG GAG), kodon/çerçeve sahneleri (Met-Ala-Trp-Lys; U eklenince Met-Ala-dur), 453 nükleotit / 149 bağ, Calvin (6 CO₂, 18 ATP, 12 NADPH), ATP muhasebesi (4 + 10×2,5 + 2×1,5 = 32), Na⁺-K⁺ pompası (120/80), endosperm 3n = 21.

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Orta | biyoloji › hucresel-solunum › kart 1 (metin, SVG, not) | "Son fosfat ayrılınca enerji açığa çıkar" ve SVG'deki "son bağ kopar" yazısı, "bağ kırılınca enerji verir" yanılgısını besliyor. | Metin: "su ile ayrılınca (hidroliz)"; SVG: "hidrolizle ayrılır"; not: "Enerjiyi bağın kopması değil, hidroliz tepkimesinin tamamı verir: bir bağı kırmak her zaman enerji ister." | Düzeltildi |
| 2 | Orta | biyoloji › kalitim › kart 2 (not) | "Baskın özellik daha yaygındır / daha güçlüdür" yanılgısına karşı hiçbir yerde uyarı yok. Not, SVG'nin zaten gösterdiği "aynı fenotip, farklı genotip" bilgisini tekrarlıyordu. | Not: "Baskın, 'daha yaygın' ya da 'daha güçlü' demek değildir: altı parmaklılık (polidaktili) baskındır ama nadirdir." | Düzeltildi |
| 3 | Orta | biyoloji › kalitim › kart 12 | "Sağlıklı iki ebeveynin hasta çocuğu varsa … ebeveynler taşıyıcıdır (Aa)" X'e bağlı durumda yanlış: babası sağlıklı olan hasta oğulda baba taşıyıcı değildir (X^H Y). | "…çekiniktir; otozomalse iki ebeveyn de taşıyıcıdır (Aa)." | Düzeltildi |
| 4 | Orta | biyoloji › duyu-organlari › kart 4 (not) | "Yaşlılık hipermetropisi" ifadesi, presbiyopiyi (mercek esnekliği kaybı) hipermetropiyle (kısa göz küresi) aynı şey gibi gösteriyor. | "…yakını görmek zorlaşır: presbiyopi. Göz küresinin kısa olduğu hipermetropiden farklıdır." | Düzeltildi |
| 5 | Orta | biyoloji › dna-genetik-kod › kart 11 (not) | "Tek yumurta ikizlerinin parmak izi aynıdır" ifadesi el parmak izi sanılabilir; tek yumurta ikizlerinin el parmak izleri farklıdır. | "…DNA parmak izi aynıdır; el parmak izleri ise farklıdır." | Düzeltildi |
| 6 | Küçük | biyoloji › duyu-organlari › adımlı ders adım 2 | "İris bir kastır" yanlış: iris, içinde düz kaslar bulunan, damar tabakanın renkli kısmıdır (kart 3 de bunu söylüyor). | "İris, içindeki kaslarla göz bebeğinin çapını ayarlar." | Düzeltildi |
| 7 | Küçük | biyoloji › duyu-organlari › adımlı ders adım 5 (seçenek) | Yazım hatası: "kornedeki eğim bozukluğu". | "korneadaki eğrilik bozukluğu" | Düzeltildi |
| 8 | Küçük | biyoloji › sinir-sistemi › kart 8 SVG | Lob adı "2 çevre (parietal)" yanlış terim; ders kitaplarında "çeper lobu". | "2 çeper (parietal)" | Düzeltildi |
| 9 | Küçük | biyoloji › duyu-organlari › kart 3 etkileşim (sert tabaka) | Tekrar: "gözü korur ve şeklini korur". | "gözü korur ve biçimini verir" | Düzeltildi |
| 10 | Küçük | biyoloji › hucresel-solunum › adımlı ders adım 1 | "ATP sentaz yaklaşık 26 ATP yapar" ifadesi kart 8 (28) ve özet kartı (26-28) ile tutarsız. | "yaklaşık 26-28 ATP" | Düzeltildi |
| 11 | Küçük | sahne `biy6-zincir` (ekosistem adımlı ders adım 1) | Alt yazı "enerjinin ≈ %90'ı ısı olarak kaybolur" diyor; kart 5'e göre kaybın bir kısmı sindirilmeyen atıktır (ayrıştırıcılara gider). | "≈ %90'ı üste geçmez (ısı, atık)" | Düzeltildi |
| 12 | Öneri | biyoloji › kalitim › kart 13; dna-genetik-kod › kart 9 notu ve test 3 | "Yalnızca üreme hücrelerindeki mutasyonlar yavruya aktarılır" yalnız eşeyli üreme için geçerlidir. Eşeysiz üremede (çelik, yumru) vücut hücresi mutasyonu da yeni bireye geçer. Müfredat ifadesiyle uyumlu olduğu için değiştirilmedi. | Uygun bir karta "(eşeyli üremede)" kaydı ya da bir not eklenebilir. | Öneri |
| 13 | Öneri | biyoloji › duyu-organlari › kart 13 | "Hasar gören duyu hücreleri çoğu zaman yenilenmez" doğru, ama koku ve tat reseptör hücrelerinin düzenli olarak yenilendiği söylenmediği için genelleme yapılabilir. | Nota "koku ve tat hücreleri ise yenilenir" eklenebilir. | Öneri |
| 14 | Öneri | sahne `biy6-azot` | Kutu "amonyak (NH₄⁺)" diyor; kart 9 NH₃ yazıyor. Toprakta çoğunlukla amonyum (NH₄⁺) bulunur, ama ad ile formül uyuşmuyor. | "amonyum (NH₄⁺)" ya da "amonyak (NH₃)" seçilip kartla eşitlenebilir. | Öneri |
| 15 | Öneri | biyoloji › bitki-biyolojisi adımlı ders adım 1 | "Bitki suyu taşımak için ATP harcamaz" terleme çekimi için doğru. Kök basıncında ise minerallerin ksileme aktif yüklenmesi ATP ister (kart 6). | Seçenek geri bildirimine "terleme çekiminde" kaydı eklenebilir. | Öneri |
| 16 | Öneri | biyoloji › dna-genetik-kod › adımlı ders adım 6 | "Tek bir saç telinden bile DNA parmak izi" için saç kökü gerekir. | "kökü olan tek bir saç telinden" denebilir. | Öneri |

Toplam 16 bulgu: Kritik 0, Orta 5, Küçük 6, Öneri 5. Düzeltilen: 11.

Test cevap anahtarlarının (40 soru) ve adımlı ders görevlerinin hepsi doğru işaretlenmiş. Birden fazla doğru seçenekli soru bulunmadı. Sahne hedefleri ile görev cevapları uyumlu.

#### Kapsam eksikleri
- **Kalıtım:** Poligenik (çok genli) kalıtım (deri rengi, boy) ve pleiotropi yok. Eşeyin etkisi altındaki özellikler (kellik) yok. Genetik varyasyon kaynakları (krossing-over, bağımsız dağılım, döllenme, mutasyon) tek kartta toplanmamış.
- **DNA:** Eşlenmede primaz ve RNA primer anlatılmıyor; kesikli örülen parçaların adı (Okazaki) geçmiyor. Primer yalnız PCR'da var; öğrenci "DNA polimeraz sıfırdan başlar" sanabilir.
- **Protein sentezi:** Poliribozom (polizom) ve sentez sonrası protein işleme (ER-Golgi yolu) çok kısa.
- **Fotosentez:** Fotosentezin tarihsel deneyleri (Van Helmont, Priestley, Ingenhousz) yalnız Engelmann ile temsil ediliyor.
- **Sinir sistemi:** Beyin zarları ve beyin-omurilik sıvısı, korpus kallozum, beyin incelemede EEG/MR gibi teknikler yok.
- **Duyu organları:** Göz yaşı bezi ve kapakların koruyucu rolü, ses şiddeti (dB) ve frekansın kulakta ayırt edilmesi yok.
- **Ekosistem:** Türkiye'nin biyoçeşitliliği ve endemik türler yok. Biyolojik birikimde "biyomagnifikasyon" teriminin karşılığı verilmemiş.
- **Endokrin:** Böbrek üstü özünden noradrenalin salgısı ve hormonların kimyasal sınıfları (amin, peptit, steroid) yarım anlatılmış.

### Kavram denetimi: biyoloji3

Kapsam: destek-hareket, sindirim, dolasim-bagisiklik, solunum, bosaltim, ureme-sistemi, populasyon-komunite, evrim. Bütün kartlar (metin, SVG yazıları, etkileşimler), 4'er soruluk testler, `content/adimli/` dersleri ve `components/sahne/biyoloji10-14.tsx` içindeki ilgili sahneler okundu. Sayılar yeniden hesaplandı: sarkomer bantları, 60/0,8 = 75 atım, kalp döngüsü 0,1 + 0,3 + 0,4 s, PO₂ = 760 × 0,21 ≈ 160 mmHg, 5,5 km'de PO₂ ≈ 80, Hb doygunluk eğrisi, glikoz eşiği 180 mg/dL, %99 geri emilim, HW 2pq = 0,42 / 0,48, 40 × 4 sperm, ΔN hesapları, K/2 = 500, gen havuzu frekansları ve DNA dizisi fark sayıları. Hepsi doğru çıktı. Testlerde yanlış işaretlenmiş cevap ya da iki doğru seçenek yok.

Dal: `worktree-agent-a2f7c81f596505d21` · Commit: `0b25e10`

| # | Önem | Yer | Sorun | Düzeltme / öneri | Durum |
|---|---|---|---|---|---|
| 1 | Kritik | biyoloji › destek-hareket › kart 10 (SVG) | "Kasılmış" sarkomerde aktin iplikleri 98 birimden 82 birime kısalmış çiziliyordu. Altındaki yazı ise "aktin ve miyozin boyu aynı kalır" diyor. Görsel, kayan iplikler modelinin tam tersini, yani "iplik kısalır" yanılgısını gösteriyordu. | Z çizgileri 62/258'e taşındı, aktin boyu 98 birimde tutuldu ve uçları merkezde buluşuyor (H bölgesi kapandı). Oklar da yeni Z konumlarına göre kaydırıldı. | Düzeltildi |
| 2 | Orta | biyoloji › destek-hareket › adımlı ders adım 5 | Gevşemede ATP'nin yalnızca Ca²⁺ pompası için gerektiği söyleniyordu. ATP'nin miyozin başını aktinden ayırdığı anlatılmıyordu. Bu, YKS'nin sevdiği ölüm sertliği sorusunun temelidir. | "tamam" metnine eklendi: miyozin başı ancak ATP bağlayınca aktinden ayrılır; ATP bitince başlar ayrılamaz, buna ölüm sertliği denir. | Düzeltildi |
| 3 | Orta | biyoloji › sindirim › kart 8 | Nükleik asit sindirimi hiç yoktu. Konuda pankreas nükleazı ve son ürünler olan şeker, baz ve fosfat anlatılmıyordu. | "Pankreas lipazı da…" cümlesinin yerine nükleaz cümlesi kondu. Lipazın işi kart 6 ve 9'da zaten anlatılıyor. Metin 45 kelime. | Düzeltildi |
| 4 | Küçük | biyoloji › sindirim › kart 11 (anahtar cümle) | "Kalın bağırsakta sindirim enzimi yoktur." Bakteriler enzim üretir ve selülozun bir kısmını parçalar; ifade metinle de çelişiyordu (metin "salgılamaz" diyor). | "Kalın bağırsak sindirim enzimi salgılamaz; …" | Düzeltildi |
| 5 | Orta | biyoloji › dolasim-bagisiklik › kart 6 | Lenf organları (dalak, timus, bademcik) hiçbir yerde geçmiyordu. Dalağın yaşlı alyuvarları yıkması da anlatılmıyordu. | Kart metnine bir cümle eklendi; "tek yönde" ve "Yoldaki" kelimeleri çıkarılarak metin 45 kelimede tutuldu. Yeni kart eklenemedi, çünkü konu zaten 14 kartta ve doğrulayıcı en çok 14 kart kabul ediyor. | Düzeltildi |
| 6 | Orta | biyoloji › dolasim-bagisiklik › kart 9 | Rh uyuşmazlığı (eritroblastozis fetalis) yoktu. Klasik bir AYT konusu. | Kart 9'a Rh− anne / Rh+ bebek senaryosu eklendi. "Rh+ kişide D antijeni vardır" cümlesi çıkarıldı; bu bilgi SVG'de yazılı. "Uygunluk testi" cümlesi de çıkarıldı; adımlı ders adım 6'da duruyor. Anti-D iğnesiyle korunma eklenmedi, aşağıdaki öneriye bakın. | Düzeltildi |
| 7 | Orta | biyoloji › bosaltim › kart 9 | Glomerulde basıncın neden yüksek olduğu (getiren damarın götürenden geniş olması) anlatılmıyordu. Öğrenci "basınç nereden geliyor?" sorusunda takılıyor. | İlk cümle buna göre yeniden yazıldı. "Bu adımda" çıkarıldı; metin 44 kelime. | Düzeltildi |
| 8 | Küçük | biyoloji › bosaltim › kart 10 (SVG) | SVG "180 L → yaklaşık 1,5 L idrar" diyordu. Kart metni %99, test 1 ve adımlı ders ise 1,8 L kullanıyor. | "1,8 L" yapıldı. | Düzeltildi |
| 9 | Orta | biyoloji › populasyon-komunite › kart 4 | "Biyotik potansiyel" ve "çevre direnci" (ders kitabı ve YKS terimleri) hiçbir yerde geçmiyordu. | Kart 4'e iki terim kalın olarak eklendi. Bunun için "üstel büyüme" / "lojistik büyüme" ikilisi ve "uzun süre" çıkarıldı. Metin 45 kelime. | Düzeltildi |
| 10 | Orta | biyoloji › evrim › kart 13 (anahtar cümle) | Görselde insan ile şempanze yan yana duruyor ama "insan maymundan/şempanzeden geldi" yanılgısına değinilmiyordu. | Anahtar cümle şu oldu: "İnsan şempanzeden türemedi: DNA benzerliği, ikisinin yakın bir ortak atadan ayrıldığını gösterir." | Düzeltildi |
| 11 | Orta | biyoloji › destek-hareket › kart 11 ↔ sahne `biy10-enerji` | Kart, ATP kaynaklarını hazır ATP → kreatin fosfat → laktik asit fermantasyonu → O₂'li solunum diye sıralıyor. Sahnede fermantasyon basamağı yok (kreatin fosfat → oksijenli solunum). | Sahneye "fermantasyon" çubuğu eklenmeli (ör. 8-90 s). Adımlı dersin cevabı (ilk kaynak kreatin fosfat) değişmez. | Öneri |
| 12 | Küçük | sahne `biy10-eklem` | Oynamaz eklem için "kemikler kaynaşık" yazıyor. Kafatası kemikleri çoğu yaşta dikişlerle (sütür) kenetlidir; tam kaynaşma ileri yaştadır. | "kemikler dikişle kenetli" önerilir. | Öneri |
| 13 | Küçük | biyoloji › evrim › kart 9 | Lahana, brokoli ve karnabaharın atası "yabani hardal" deniyor. *Brassica oleracea*'nın yabani formu yabani lahanadır. "Wild mustard" adı Campbell çevirisinden gelir; ders kitabına göre değişebilir. | Metin ve SVG'de "yabani lahana (Brassica oleracea)" önerilir. | Öneri |
| 14 | Küçük | biyoloji › dolasim-bagisiklik › kart 9 / 12 | Rh uyuşmazlığının önlenmesi (doğumdan sonra anneye anti-D iğnesi; pasif bağışıklık örneği) kelime sınırı yüzünden eklenemedi. | Kart 12'nin anahtar cümlesine ya da bir test sorusuna eklenebilir. | Öneri |
| 15 | Küçük | biyoloji › bosaltim › kart 9 | "Glomerulden çıkan kan hâlâ oksijenlidir (glomerulde gaz alışverişi olmaz)" yanılgı sorusu sık çıkıyor ve konuda yok. | Anahtar cümleye ya da SVG'ye eklenebilir. | Öneri |

Toplam 15 bulgu: Kritik 1, Orta 9, Küçük 5. Düzeltilen: 10 (1-10). Öneri: 5 (11-15).

Doğrulama: `python3 tools/check.py` → TAMAM (bu konularda 45 kelime uyarısı yok), `npm run lint` hatasız, `npm run build` hatasız. Sahne `.tsx` dosyalarına dokunulmadı.

#### Kapsam eksikleri (eklenmedi)
- **Destek-hareket:** motor ünite, seğirme / tetanos / kas yorgunluğu eğrisi; izotonik ve izometrik kasılma; Volkmann kanalı; troponin-tropomiyozin adları (Ca²⁺'un bağlanma yerlerini nasıl açtığı).
- **Sindirim:** enterokinazın tripsinojeni etkinleştirmesi; kimotripsin ve karboksipeptidaz; safra tuzlarının emilime yardımı.
- **Dolaşım-bağışıklık:** kalp debisi ve atım hacmi; bağışıklıkta MHC ve antijen sunumu, sitotoksik/yardımcı T ayrımının ayrıntısı; organ nakli ve doku uyuşmazlığı.
- **Solunum:** solunum hacimleri (soluk hacmi, yedek hacimler, artık hava); yüzey gerilimi ve sürfaktan.
- **Boşaltım:** renin-anjiyotensin sistemi; nefronda karşı akım ile idrarın derişikleşmesi; böbrek atardamarı ve toplardamarındaki kan bileşimi karşılaştırması.
- **Üreme:** menopoz; kadında östrojenin ikincil eşey özellikleri; doğum kontrol yöntemlerinin hormon mantığı; plasentadan geçen ve geçemeyen maddeler.
- **Popülasyon-komünite:** tür içi ve türler arası rekabet ayrımı; amensalizm (konunun kartlarında yok).
- **Evrim:** rastgele olmayan çiftleşme ve cinsel seçilim; "en güçlü hayatta kalır" yanılgısına karşı uyum = üreme başarısı vurgusu (kart 4'te dolaylı var); türleşmede simpatrik türleşme ve poliploidi.

Videolar kapsam dışı; bu konularla ilgili video kartı numaralarını değiştirecek bir işlem yapılmadı (kart eklenmedi, sıra korunarak yalnızca metin değişti).
