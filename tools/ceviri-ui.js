// Arayüz metinlerinin İngilizce sözlüğü (lib/ceviri/en.json) için yardımcı.
//   node tools/ceviri-ui.js say                 dosya başına çevrilmemiş metin sayısı
//   node tools/ceviri-ui.js eksik <çıktı> [desen ...]   çevrilmemiş metinleri numaralı listeler (desen: dosya yolu parçası)
//   node tools/ceviri-ui.js ekle <liste> <çeviri>       "N<TAB>İngilizce" satırlarını aynı listenin numaralarıyla sözlüğe ekler
//   node tools/ceviri-ui.js denetle             yer tutucu ({0}) ve etiket uyuşmazlıklarını, kullanılmayan anahtarları yazar
const ts = require("typescript"), fs = require("fs"), path = require("path");
const SOZLUK = "lib/ceviri/en.json";
const en = JSON.parse(fs.readFileSync(SOZLUK, "utf8"));
function dosyalar(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) dosyalar(p, out); else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}
function metinler() {
  const out = new Map(); // metin -> dosyalar
  for (const f of ["app", "components", "lib"].flatMap((d) => dosyalar(d))) {
    const sf = ts.createSourceFile(f, fs.readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    (function gez(n) {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "cev" && n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0]))) {
        const t = n.arguments[0].text;
        if (!out.has(t)) out.set(t, []);
        if (!out.get(t).includes(f)) out.get(t).push(f);
      }
      ts.forEachChild(n, gez);
    })(sf);
  }
  return out;
}
const [komut, a1, a2, ...kalan] = process.argv.slice(2);
const hepsi = metinler();
if (komut === "say") {
  const say = {};
  for (const [t, fl] of hepsi) if (!(t in en)) say[fl[0]] = (say[fl[0]] || 0) + 1;
  Object.entries(say).sort((x, y) => x[1] - y[1]).forEach(([f, n]) => console.log(n + "\t" + f));
  console.log(`toplam ${hepsi.size} metin, çevrilmemiş ${[...hepsi.keys()].filter((t) => !(t in en)).length}`);
} else if (komut === "eksik") {
  const desen = [a2, ...kalan].filter(Boolean);
  const liste = [...hepsi].filter(([t, fl]) => !(t in en) && (!desen.length || fl.some((f) => desen.some((d) => f.includes(d))))).map(([t]) => t);
  fs.writeFileSync(a1, JSON.stringify(liste));
  liste.forEach((t, i) => console.log(i + "\t" + t.replace(/\n/g, "\\n")));
} else if (komut === "ekle") {
  const liste = JSON.parse(fs.readFileSync(a1, "utf8"));
  let n = 0;
  for (const satir of fs.readFileSync(a2, "utf8").split("\n")) {
    const m = satir.match(/^(\d+)\t(.*)$/);
    if (!m) { if (satir.trim()) console.error("okunamadı:", satir.slice(0, 80)); continue; }
    const tr = liste[+m[1]];
    if (tr === undefined) { console.error("numara yok:", m[1]); continue; }
    en[tr] = m[2].replace(/\\n/g, "\n");
    // baştaki ve sondaki boşluk Türkçesiyle aynı kalır
    en[tr] = tr.match(/^\s*/)[0] + en[tr].trim() + tr.match(/\s*$/)[0];
    n++;
  }
  fs.writeFileSync(SOZLUK, JSON.stringify(Object.fromEntries(Object.entries(en).sort((x, y) => x[0].localeCompare(y[0], "tr"))), null, 1) + "\n");
  console.log(`${n} çeviri eklendi; sözlükte ${Object.keys(en).length} metin`);
} else if (komut === "denetle") {
  let hata = 0;
  const iz = (s) => [(s.match(/\{\d+\}/g) || []).sort().join(), (s.match(/<\/?[a-z]+/g) || []).sort().join()].join("|");
  for (const [tr, e] of Object.entries(en)) {
    if (!hepsi.has(tr)) { console.log("KULLANILMIYOR", JSON.stringify(tr)); hata++; }
    else if (iz(tr) !== iz(e)) { console.log("UYUŞMUYOR", JSON.stringify(tr), "=>", JSON.stringify(e)); hata++; }
  }
  console.log(hata ? `${hata} sorun` : "TAMAM");
  process.exit(hata ? 1 : 0);
}
