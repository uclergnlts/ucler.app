# Doğal Türkçe kuralları

Bu belge, ucler'deki her Türkçe metnin (kart, test, geri bildirim, adımlı ders, video seslendirmesi, arayüz, e-posta, sosyal medya) yapay zekâ ürünü gibi okunmaması için uyulacak kuralları toplar. Metin kim yazarsa yazsın (Claude, Codex ya da bir insan) bu kurallar geçerlidir.

Kaynak: [yucezerey/turkish-anti-ai-skill](https://github.com/yucezerey/turkish-anti-ai-skill) (MIT lisansı, Yüce Zerey). Oradaki kurallar blog, kurumsal ve akademik metin için yazılmış. Burada yalnızca ders anlatımına uyanlar alındı, uymayanlar gerekçesiyle aşağıda listelendi.

Denetim aracı: `npm run dogal-turkce` (ya da `python3 tools/dogal-turkce.py`). Tüm içeriği, video seslendirmelerini, arayüz ve e-posta yazılarını tarar, sonucu `denetim/DOGAL-TURKCE.md` dosyasına yazar. Tek bir metni (örneğin bir Instagram açıklamasını) taramak için: `python3 tools/dogal-turkce.py --dosya metin.txt`. Araç hiçbir dosyayı değiştirmez.

Bu kurallar `docs/ICERIK-SPEC.md` ve proje kararlarıyla birlikte okunur. Çelişki olursa proje kararları geçerlidir. Örneğin kart sınırı 40 kelime, şıklar kısa ve tarafsız, cümleler tam ve devrik değil.

## 1. Bizim metin türümüz

ucler metinleri "öğretici anlatım" türündedir. Bu tür şöyle yazılır:

| Konu | Kural |
|---|---|
| Giriş | Sahneleme yok. Konuya ilk cümlede gir. "Bu derste X'i öğreneceğiz" deme. |
| Cümle düzeni | Normal sıra: özne başta, yüklem sonda. Devrik cümle yok (video seslendirmesinde kanca cümlesi hariç). |
| Zaman | Geniş zaman ve şimdiki zaman: "Enzim hızlanır", "Su ısınıyor". `-mAktAdIr` kullanma. |
| `-dır` eki | Tanımda doğaldır ve kalır: "Buna denatürasyon denir.", "Enzimlerin çoğu proteindir." Her cümleyi `-dır` ile bitirme. |
| Hitap | "Sen". Sahte samimiyet yok ("Kahveni al, arkana yaslan" gibi). |
| Ton | Çocuksu değil, abartısız. Ünlem ve övgü azı karar. |

## 2. Kesinlikle kullanma (yapay zekâ ifşası)

Bunlar Türkçe yapay zekâ metinlerinde doğal metinden kat kat sık görülür. Tek kez geçse bile düzelt.

| Kullanma | Yerine |
|---|---|
| yadsınamaz, inkâr edilemez | Olguyu doğrudan yaz. |
| adeta | Sil ya da "gibi". |
| derinlemesine incelemek, mercek altına almak | "yakından bakalım", "ayrıntısına bakalım" |
| kritik/kilit/hayati bir rol oynar | Fiili kendisi söylesin: "Kas kasılmasını kalsiyum başlatır." |
| hayati öneme sahiptir | "çok önemlidir", "şarttır" ya da nedenini söyle. |
| geniş bir yelpaze, mozaik, zengin doku | Somut say: "üç farklı alanda". |
| sadece X değil, aynı zamanda Y | "Hem X hem Y" ya da yalnızca Y. |
| X olmakla kalmayıp Y | "Hem X hem Y". |
| "Bu bir X değil, bir Y'dir" | Kimsenin söylemediği X'i reddetme. Ne olduğunu söyle. |
| günümüzün hızla değişen dünyasında | Sil. |
| potansiyelini ortaya çıkar, bir üst seviyeye taşı, kilidini aç | Ne kazanıldığını söyle. |
| kusursuz bir şekilde, pürüzsüzce, zahmetsizce, titizlikle | "kolayca", "takılmadan" ya da somut kanıt. |
| oyunun kurallarını değiştiren | Ne değiştiğini söyle. |
| Başlamaya hazır mısın? Hadi başlayalım! Gelin birlikte inceleyelim. | Sil ya da "Hemen başla". |
| Belirtmek gerekir ki, Unutulmamalıdır ki, Şunu vurgulayalım | Duyurmayı sil, bilgiyi yaz. |
| Özetlemek gerekirse, Son tahlilde | Etiketi sil, son sözü söyle. |
| bütüncül yaklaşım, sinerji, paradigma, proaktif | Somut karşılık. |
| "Uzmanlar belirtiyor ki", "Araştırmalar gösteriyor ki" | Kaynağın adını yaz ya da cümleyi sil. |
| Elbette!, Harika bir soru!, Umarım işine yarar | Sohbet artığı, sil. |

Bir klişeyi silerken yerine başka bir dolgu koyma. "Kritik bir rol oynar" yerine her cümleye "aslında", "doğrudan", "ciddi ölçüde" eklemek de yapay durur. Çoğu zaman en iyisi zarfı atıp fiili yalnız bırakmaktır.

## 3. Bağlama bak

| İfade | Ne zaman sorun |
|---|---|
| sonuç olarak | Paragraf kapanış etiketiyse sil. Bir hesabın ya da olayın sonucuysa kalabilir. |
| dönüm noktası, çığır açan | Pazarlama dilinde sil. Bilim tarihinde gerçekten dönüm noktasıysa kalabilir. |
| bununla birlikte, öte yandan, buna ek olarak | Her paragraf başında tekrar ediyorsa sil ya da "ama", "ayrıca", "ise" kullan. |
| söz konusu, bu bağlamda, bu doğrultuda, bahsi geçen | "bu", "o" ya da ismin kendisi. |
| ... tarafından gerçekleştirilir/sağlanır | Etken çatı: "Bu tepkimeyi enzim hızlandırır." |
| katkıda bulunur, artış sağlar | "katkı sunar", "artırır". |
| büyük bir etki, ciddi bir artış | Gereksiz "bir"i at: "büyük etki", "ciddi artış". |
| ...nın kanıtıdır | "...-dığını gösterir". |
| Art arda üç cümle aynı ekle biter | Birini geniş zamana çevir ya da cümleleri birleştir. |

## 4. Cümle kurmak

- **Önce niteleyici, sonra isim.** Türkçe sola dallanır. "Bir enzim var, bu enzim nişastayı parçalar" yerine "Nişastayı parçalayan bir enzim var".
- **Refleks "ve" yerine zarf-fiil.** "Su ısındı ve buharlaştı" yerine "Su ısınıp buharlaştı". Ama kartta açıklık önce gelir. İki kısa cümle, zarf-fiil zincirinden iyidir.
- **Vurgu kalın yazıyla değil, sırayla verilir.** Vurgulanacak öğe yüklemin hemen önüne gelir: "Bu tepkimeyi **enzim** hızlandırır." Kalın yazıyı terim tanıtmak için kullan.
- **Gereksiz zamir ve "bir"i at.** Yüklem kişiyi gösteriyorsa "sen", "biz" yazma. "İyi bir performans" yerine "iyi performans".
- **Noktalı virgülle iki cümle yapıştırma.** "Fotosentez CO₂'yi bağlar; solunum geri verir." yerine "Fotosentez CO₂'yi bağlar. Solunum ise geri verir." Sıralı öğeler arasındaki noktalı virgül (gruplu liste) serbesttir.
- **Üçlü liste otomatizmi.** Gerçekte kaç öğe varsa o kadar say. Her şeyi üçlüye tamamlama.
- **Kalın etiket ve iki nokta şablonu.** Kart metnini "**Başlık:** açıklama" maddelerine çevirme. Tam cümle kur.

## 5. Noktalama ve TDK yazımı

| Kural | Yanlış | Doğru |
|---|---|---|
| Uzun çizgi (—) yalnızca diyalogda | Enzim bozulur — geri dönmez. | Enzim bozulur ve geri dönmez. |
| Sayı aralığında kısa çizgi | 38–39 °C, 1–1000 nm | 38-39 °C, 1-1000 nm |
| Ondalık virgülle, binlik noktayla | 9.8 m/s², %99.9 | 9,8 m/s², %99,9, 100.000 Pa |
| Saat noktayla | 21:00 | 21.00 |
| Yüzde işareti bitişik ve önde | 25%, % 25 | %25 |
| Başlık tümce düzeninde | Atomun Yapısı Ve Modeller | Atomun yapısı ve modeller |
| Bitişik/ayrı yazım | bir çok, bir kaç, herşey, yada, ard arda, yanısıra, işbirliği, farketmek, hiç bir | birçok, birkaç, her şey, ya da, art arda, yanı sıra, iş birliği, fark etmek, hiçbir |
| "ki" | halbu ki, oysa ki | halbuki, oysaki (diğer "ki"ler ayrı: demek ki) |
| Zarf-fiilden sonra virgül yok | Suyu ısıtıp, buharlaştırdık. | Suyu ısıtıp buharlaştırdık. |

Kimyasal bağ (H–H, C–H, A–T) ve grafik ekseni (V–I) gösteriminde orta çizgi doğrudur. Araç bunları işaretlemez.

Üslup tercihi: "ama", "fakat" bağlacından önce virgül koymamak daha doğal okunur ("Hızlı ama pahalı."). Yeni metinde buna uy. Eski metinleri yalnızca bu yüzden toplu düzeltme.

## 6. Yazdıktan sonra

1. Silme testi: Eklediğin her "işte", "zaten", "aslında", her ünlem ve her devrik cümleyi sil, sonra oku. Anlam ve ton eksilmiyorsa silinmiş hâli kalsın.
2. Olgu kilidi: Metni doğallaştırırken yeni sayı, tarih, isim ya da anekdot ekleme. "İnsan gibi görünmek" için bilgi uydurma.
3. `npm run dogal-turkce` çalıştır. KESİN bulgu kalmasın. GÖZ AT bulgulara tek tek bak.
4. İçerik metni değiştiyse `python3 tools/check.py` ve `npm run okunabilirlik` de çalıştır.

## Kaynaktan alınmayanlar ve nedeni

| Kaynaktaki kural | Neden almadık |
|---|---|
| `-DIr` ekini tamamen silmek | Tanım cümlelerinde doğal ve gerekli ("Buna osmoz denir."). Yalnızca `-mAktAdIr` ve art arda aynı ek işaretlenir. |
| Cümle uzunluğu çeşitliliği (CoV ≥ 0,40) | Kartlar 40 kelimeyi geçmez, iki üç cümledir. Bu kadar kısa metinde ölçüm anlamsız. Uzun cümleleri zaten `npm run okunabilirlik` yakalar. |
| Blog için 400 kelimede 2-3 devrik cümle serbestliği | Projede devrik cümle istenmiyor. Tek istisna video kancası. |
| Kanıtsallık kipi (`-mIş`) önerisi | Fen anlatımında olgular kesin anlatılır. Tarih anlatısında (Dalton, Mendel) `-DI` yeterli. |
| Teknik terimleri İngilizce bırakma (endpoint, deploy) | Bizim terimlerimiz Türkçe ders terimleri. Yalnızca yerleşik Türkçe karşılığı olmayan kısaltmalar (DNA, ATP) olduğu gibi kalır. |
| Yabancı terime okunuşa göre ek (cache'i, SQL'i) | İçerikte bu tür terim yok. DNA'nın, ATP'nin gibi kısaltmalar zaten doğru çekiliyor. |
