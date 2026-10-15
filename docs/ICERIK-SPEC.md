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

Dosyalar düz JSON'dur: anahtarlar ve metinler çift tırnak içindedir, sondaki virgüle izin yoktur. SVG içinde öznitelikler tek tırnakla yazılır, böylece JSON içinde kaçış gerekmez.

## Konu nesnesi
```js
{
  title: "Atomun yapısı",
  summary: "Tek cümlelik özet (≤ 70 karakter)",
  cards: [                       // 7-10 kart önerilir; doğrulayıcı 6-11 arasını kabul eder
    { h: "Başlık (≤ 40 karakter)",
      p: "Metin: en fazla 45 kelime (doğrulayıcı 55'e kadar izin verir). <b>, <em>, <sub>, <sup>, <br> kullanılabilir.",
      svg: "<svg viewBox='0 0 320 200'>...</svg>",   // her kartta ZORUNLU
      key: "İsteğe bağlı 'akılda kalsın' cümlesi (≤ 90 karakter)" }
  ],
  quiz: [ { q: "Soru?", o: ["A","B","C","D"], a: 2, e: "Neden doğru (1-2 cümle)" } ]   // tam 4 soru
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

## Doğrulama
`python3 tools/check.py` komutu "TAMAM" yazmalıdır. Ardından `tools/ekran.js` ile alınan görüntülere bakılır, çünkü taşma ve üst üste binme gibi sorunları ancak göz yakalar.
