# İçerik formatı

Her konu, o konunun **tüm temel kavramlarını** kapsar. Her kart ise kısa olur ve **tek bir fikir** anlatır.

## Dosya
Her ders için bir JSON dosyası vardır: `content/<ders>.json`.
```json
{
  "<konu-id>": { ...konu... }
}
```
Konu id'si, `content/dersler.json` içindeki ders listesinde `{"id": "<konu-id>", "ad": "Görünen ad"}` biçiminde yer almalıdır. Henüz yazılmamış konular orada yalnızca `{"ad": "Ad"}` olarak durur. Bir konu yazılınca o satıra `id` eklenir.

**Ön koşullar (konu haritası):** Bir konunun üzerine kurulduğu konular `"on": ["konu-id", ...]` ile yazılır. Ön koşullar aynı dersten olur ve listede daha önce gelir (doğrulayıcı denetler). Ön koşulu olmayan konu baştan açıktır; ön koşullarının hepsi bitince (testi çözülünce) konunun kilidi açılır. Kilit yumuşaktır: öğrenci isterse kilitli konuyu da açabilir, ders ekranının başında önce bitirmesi önerilen konular yazar. Doğrudan bağı yaz; dolaylı olanı (A → B → C ise C için A'yı) yazma.

Dosyalar düz JSON'dur: anahtarlar ve metinler çift tırnak içindedir, sondaki virgüle izin yoktur. SVG içinde öznitelikler tek tırnakla yazılır, böylece JSON içinde kaçış gerekmez.

Videolar ayrı bir dosyada durur: `content/videolar.json` (biçim `docs/VIDEOLAR.md` içinde).

## Konu nesnesi
```js
{
  title: "Atomun yapısı",
  summary: "Tek cümlelik özet (≤ 70 karakter)",
  cards: [                       // 8-12 kart önerilir; geniş konular 16 karta kadar çıkabilir (doğrulayıcı 6-16)
    { h: "Başlık (≤ 40 karakter)",
      p: "Metin: en fazla 45 kelime (doğrulayıcı 45'i aşanı uyarır, 55'i aşanı hata sayar). <b>, <em>, <sub>, <sup>, <br> kullanılabilir.",
      svg: "<svg viewBox='0 0 320 200'>...</svg>",   // her kartta ZORUNLU
      key: "İsteğe bağlı 'akılda kalsın' cümlesi (≤ 90 karakter)" }
  ],
  quiz: [ { q: "Soru?", o: ["A","B","C","D"], a: 2, e: "Neden doğru (1-2 cümle)" } ]   // tam 4 soru; etkileşimli türler için "Konu sonu testi"
}
```
- Son kart **"Özet"** kartıdır. Konunun 3-5 ana fikri `<br>• ` ile ayrılarak yazılır.
- **Dil:** Sade, samimi Türkçe kullanılır ve öğrenciye "sen" diye hitap edilir. Terimin İngilizcesi ilk geçtiği yerde parantez içinde verilebilir.
- **Doğruluk en önemli kuraldır.** Formüller, sayılar ve tarihler doğru olmalı. Uydurma bilgi olmaz.
- Örnekler gündelik hayattan seçilir. Sınavda sık sorulan noktalar atlanmaz.

## SVG kuralları
- Her görselde `viewBox='0 0 320 200'` kullanılır, `width` ve `height` öznitelikleri yazılmaz.
- SVG tek bir JS dizgisidir. İçinde **yalnızca tek tırnak** kullanılır.
- **Renkler yalnızca CSS değişkenleriyle verilir:**
  - `var(--ink)`: metin ve koyu çizgi
  - `var(--muted)`: ikincil metin
  - `var(--line)`: ızgara ve ince çizgi
  - `var(--panel)`: kutu zemini
  - `var(--acc)`: dersin vurgu rengi
  - `var(--c1)` mavi, `var(--c2)` kırmızı, `var(--c3)` yeşil, `var(--c4)` amber, `var(--c5)` mor
  - Hex, rgb ya da renk adı kullanılmaz. Yumuşak dolgu için `fill-opacity` kullanılır.
- Metinler 10-15 px arasındadır. **Hiçbir yazı viewBox dışına taşmaz ve yazılar birbirinin üstüne binmez.**
- Ok başları için `<marker id='<konu>-<n>'>` kullanılır. Sayfada birden fazla SVG bulunduğu için id'ler benzersiz olmalıdır.
- `<style>`, `<script>`, `foreignObject` ve dış görsel kullanılmaz.
- Görsel süs değildir; konuyu anlatır (şema, karşılaştırma, grafik, model).

## Etkileşimli kart
Bir karta `etk` alanı eklenirse o kartta durağan SVG yerine öğrencinin dokunup değiştirebildiği bir görsel çıkar (`components/Etk.tsx`, `components/EtkGenel.tsx`). `svg` yine zorunludur: yedek görseldir, `isaretle` türünde de zemin olarak kullanılır. Kart metni, başlığı ve testi değişmez. Her konuda en az bir etkileşimli kart olur; Özet kartı tercih edilmez.

Metinlerde kartlardaki gibi `<b>`, `<em>`, `<sub>`, `<sup>` kullanılabilir. Öğrenciye "sen" diye hitap edilir.

**Konuya özel türler** (kodda hazır, başlangıç değerleri içerikten):
- `{"tur": "atom", "p": 11, "n": 12, "e": 11}`: proton, nötron, elektron düğmeleri; element, gösterim, katmanlar ve iyon yükü değişir.
- `{"tur": "vektor", "v": 10, "aci": 30}`: büyüklük ve açı sürgüsü; V<sub>x</sub> ve V<sub>y</sub> hesaplanır.
- `{"tur": "osmoz", "c": 0.9}`: dış ortamın tuz oranı (%0-2); alyuvar şişer, dengede kalır ya da büzüşür.

**Genel türler** (yalnızca içerikle tanımlanır):
- `sirala`: Öğrenci öğelere doğru sırayla dokunur. `{"tur": "sirala", "soru": "…", "ogeler": ["ilk", "ikinci", "…"]}`. Öğeler **doğru sırayla** yazılır, ekranda karışık çıkar. 3-7 öğe, hepsi farklı, kısa (1-4 kelime).
- `eslestir`: Soldakini seçip sağdaki eşine dokunur. `{"tur": "eslestir", "soru": "…", "ciftler": [["sol", "sağ"], …]}`. 3-6 çift, her taraf kendi içinde farklı, sağ taraf en fazla ~5 kelime.
- `ayir`: Gelen öğeyi doğru gruba koyar. `{"tur": "ayir", "soru": "…", "gruplar": ["A", "B"], "ogeler": [["öğe", 0], ["öğe", 1, "yanlışta çıkan kısa açıklama"], …]}`. 2-3 grup, 4-10 öğe; her grupta en az bir öğe; grup adları en fazla 2 kelime.
- `isaretle`: Kartın kendi SVG'si üstünde numaralı noktalar çıkar; dokununca adı ve açıklaması görünür. `{"tur": "isaretle", "soru": "…", "noktalar": [{"x": 120, "y": 80, "ad": "Çekirdek", "acik": "Tek cümle açıklama."}, …]}`. 3-7 nokta; koordinatlar viewBox 320×200 içindedir, noktalar arası en az 22 birim; nokta (yarıçap 9) çizimdeki parçanın üstüne konur, yazıyı örtmez.
- `formul`: Sürgülerle girdiler değişir, sonuç anında hesaplanır.
  ```json
  {"tur": "formul", "soru": "…",
   "girdiler": [{"ad": "m", "etiket": "Kütle", "birim": "kg", "min": 1, "max": 20, "adim": 1, "deger": 5}],
   "ciktilar": [{"ad": "F", "ifade": "m*a", "birim": "N", "basamak": 2, "max": 200}],
   "yorum": [[7, "Asidik"], [7.0001, "Nötr"], [null, "Bazik"]]}
  ```
  1-3 girdi, 1-3 çıktı. `ifade` içinde yalnızca sayılar, girdi adları, `+ - * / ^ ( )`, `pi`, `e` ve `sqrt abs sin cos tan ln log exp` kullanılır; açılar **derecedir**, `log` 10 tabanlıdır. `max` verilirse çıktının altında dolan bir çubuk çıkar. `yorum` isteğe bağlıdır: ilk çıktının değeri listedeki ilk sınırdan küçükse o metin gösterilir; son satır `[null, "metin"]` olur. Birimler SI ya da derste kullanılan birimdir; sonuçlar gerçek değerlerle tutarlı olmalıdır.

Yeni konuya özel tür eklemek kod işidir. Doğrulayıcı (`tools/check.py`) her türün biçimini, sayı aralıklarını ve formüllerin girdilerin en küçük, başlangıç ve en büyük değerinde hesaplanabildiğini denetler.

## Konu sonu testi
Her konunun sonunda 4 soruluk test vardır (aşamalar bitince açılır). Üçler'in isteğiyle (2026-10-19) testler yalnızca şıklı olmaz: soru `tur` alanıyla etkileşimli olabilir. `tur` yazılmayan soru çoktan seçmelidir. Görünüm ve değerlendirme `components/TestSoru.tsx` içindedir; ders ekranı ve Tekrar aynı parçayı kullanır.
- Etkileşimli soruda öğrenci cevabını kurar ve alttaki **Kontrol et** ile bir kez değerlendirilir; anında düzeltme yoktur (öğrenme adımlarından farkı budur). Kontrolden sonra doğrusu gövdede işaretlenir, `e` alttaki çubukta çıkar.
- Yanlış yapılan her tür soru akıllı tekrara girer (`ders.konu.sıra` anahtarıyla, 1-3-7 gün).
- Türler (hepsinde `q` ve `e` zorunlu):
  - `sirala`: `ogeler` doğru sırayla yazılır (3-6 öğe); ekranda karışık çıkar.
  - `eslestir`: `ciftler: [[sol, sağ], ...]` (3-5 çift); sağdakiler karışık havuzdan seçilir.
  - `ayir`: `gruplar` (2-3) ve `ogeler: [[yazı, grup sırası], ...]` (4-8 öğe).
  - `sayi`: `cevap` (sayı), isteğe bağlı `tolerans` ve `birim`. Öğrenci sonucu kendisi yazar; virgül de nokta da kabul edilir.
  - `sahne`: adımlı derslerin sahnesi. `sahne` (`tur` + sahnenin değerleri), `deger`, `kontroller` (adımlı dersteki biçim), `hedef` (sayı ya da [en az, en çok]). Sahne bu soruda `test: true` alır ve cevabı ele veren yazıları (hedef bayrağı, sembol, yük) gizler; kontrol edilince gösterir. Bir sahneyi teste koymadan önce test modunu o sahneye ekle (şimdilik `konum` ve `atom`).
- Her konuda 4 sorudan en az ikisi etkileşimli olur (doğrulayıcı denetler). Çoktan seçmeli soru kalabilir; hesap gerektiren soru `sayi`, sınıflandırma `ayir`, süreç `sirala`, kavram-tanım `eslestir` olarak yazılır.

## Doğrulama
`python3 tools/check.py` komutu "TAMAM" yazmalıdır. Ardından `tools/ekran.js` ile alınan görüntülere bakılır, çünkü taşma ve üst üste binme gibi sorunları ancak göz yakalar.

## Adımlı ders (deneme, `/ornek/`)
Brilliant tarzı örnek dersler `content/adimli/<konu>.json` dosyalarındadır; tipler `lib/adimli.ts`, motor `components/DersMotoru.tsx`, sahneler `components/sahne/` içindedir.
- Ders: `id`, `ders`, `konu` (konunun normal sayfası), `baslik`, `ozet`, `adimlar`, `kapanis` (bitişte gösterilen özet maddeleri).
- Adım: `baslik`, `metin` (kısa, HTML olabilir), `sahne` (`tur` = sahne kütüphanesindeki ad; `sure` verilirse sahne "Oynat" ile oynar), isteğe bağlı `deger` ve `kontroller` (sürgü, − / + sayaç ya da aç/kapa anahtar), `gorev`.
- Görev türleri: `devam`, `oynat`, `secim` (her yanlış şıkta "neden" ipucu çıkar; `kosu` ile soru, sahne o kadar farklı değerle oynatılınca açılır), `tahmin` (önce tahmin, sonra sahne oynar ve doğrusu açıklanır), `ayarla` (değerleri `hedef`e getir; sahne oynayabiliyorsa hedef değerle oynatılmalıdır).
- `tools/check.py` bu dosyaları da denetler: sahne adı, tek doğru şık, görsel şıkta `etiket`, kontrol sınırları ve hedefin ulaşılabilirliği.
- Her adımda öğrenci bir şey yapar; geri bildirim alttaki çubukta çıkar, "Devam" görev bitince açılır.
- Görünüm sade tutulur (Üçler, 2026-10-18): beyaz sayfa, adım başlığı yok, kısa metin, ortada tek görsel, sahnelerde süs arka planı yok.
- **Konu anlatımının içinde (Üçler, 2026-10-18):** Adımlara `kart` (1'den başlar) yazılırsa adım, konu sayfasında o karttan hemen sonra akışa girer; ayrı "Önce yaparak öğren" bağlantısı çıkmaz. `kart` ya her adımda olur ya hiçbirinde. Görev bitmeden "Devam" açılmaz.
- **Göster → sen dene:** İsteğe bağlı `goster` alanı (`deger`: kontrollerin örnekte gideceği değerler, görevin cevabı olmamalı; `not`: kısa açıklama; `oynat: false` sahneyi oynatmaz). Adım önce örneği kendisi oynatır, öğrenci "Şimdi sen dene"ye basınca değerler başa döner. Tahmin adımlarında `goster` kullanılmaz (tahmini bozar).
- **Çözümü göster:** Seçimde iki yanlıştan, oynayan ayar görevinde iki yanlış koşudan, oynamayan ayar görevinde 25 saniyeden sonra çıkar.
- **Canlı simülasyon (Üçler, 2026-10-19):** Sahne kaydında `canli: true` olan sahneler (`components/sahne/simulasyon.tsx`, adları `sim-` ile başlar) Oynat beklemeden sürekli çalışır; öğrenci bir değeri sürükleyince sonuç anında değişir. Bu adımların görevi `kesfet`tir: `bulgular` listesindeki 2-4 şeyi öğrenci kendisi deneyerek bulur, bulduğu her biri işaretlenir, alttaki çubukta `tamam` açıklaması çıkar; hepsi bulununca "Devam" açılır.
  - Bulgu: `yazi`, `hedef`, `coz`, `tamam`, isteğe bağlı `sirali`. `hedef` tek bir hedef ya da hedef listesidir (listedeki her duruma bir kez uğramak gerekir; `sirali: true` ise verilen sırayla). Hedef adları kontroller ya da sahnenin `olc` ile hesapladığı ölçümler (ör. `pH`) olabilir.
  - `coz`: "Çözümü göster"de kontrollerin sırayla gideceği değer kümeleri. Düğme 25 saniye yeni bulgu çıkmazsa belirir ve bulunmamış ilk bulguyu gösterir.
  - Kontrol türü `dugme`: basınca değeri 1 olur; sahnenin `bagla` işlevi eylemi uygular ve değeri 0'a döndürür (ör. "Taze enzim koy").
  - Sahnenin kendi hesapladığı bir durum (ör. kutu kayıyor mu, zarın sağındaki iyon sayısı) `set` ile bildirilir ve hedeflerde kullanılır; başlangıç değeri `deger` içinde verilir.
  - Şimdiye kadar: fizik `iki-boyutta-hareket` (atış), `newton-yasalari` (sürtünme); kimya `asit-baz` (pH), `gazlar` (gaz pistonu); biyoloji `enzimler` (sıcaklık), `madde-gecisi` (zar ve difüzyon). 3. grup: `is-enerji-guc` (rampa), `tepkime-hizi` (çarpışma), `fotosentez` (sınırlayıcı faktör). 4. grup: `basit-harmonik-hareket` (yay), `kimyasal-denge` (N₂O₄ dengesi), `populasyon-komunite` (av-avcı). 5. grup: `dalgalar` (ipte dalga), `maddenin-halleri` (kaynama ve dış basınç), `kalitim` (çaprazlama).
