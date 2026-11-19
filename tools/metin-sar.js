// Bileşenlerdeki görünen Türkçe metinleri cev("…") içine alır (lib/dil.ts). Türkçe derlemede sonuç değişmez.
// Kullanım: node tools/metin-sar.js [--yaz] [dosya ...]   (--yaz yoksa yalnızca sayar)
const ts = require("typescript"), fs = require("fs"), path = require("path");
const YAZ = process.argv.includes("--yaz");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const ATLA_OZ = new Set(["className", "class", "href", "src", "id", "key", "type", "name", "d", "viewBox", "fill", "stroke", "role", "rel", "target", "style", "data-tema", "htmlFor", "method", "as", "points", "transform", "textAnchor", "dominantBaseline", "fontFamily", "strokeLinecap", "strokeLinejoin", "inputMode", "autoComplete", "mode", "strokeDasharray", "gradientTransform", "clipPath", "mask", "filter", "xmlns", "dangerouslySetInnerHTML", "animation", "values", "keyTimes", "dur", "begin"]);
const ATLA_CAGRI = /^(cev|cn|clsx|cva|olay|iz|require|getItem|setItem|removeItem|querySelector|querySelectorAll|getElementById|addEventListener|removeEventListener|push|replace|prefetch|matchMedia|test|match|split|join|startsWith|endsWith|indexOf|from|select|eq|rpc|log|warn|error|createElement|getAttribute|setAttribute|toLocaleString|toLocaleDateString|toLocaleTimeString|Error|RegExp|URL|Date|fetch|import|okunur|yaz|oku)$/;
const HARF = /[A-Za-zÇĞİÖŞÜçğıöşü]{2,}/;
const TR_HARF = /[ÇĞİÖŞÜçğıöşü]/;
const SINIF = /^[\sa-z0-9\-_:./\[\]%()#!,'*+&>~=]+$/; // tailwind sınıfları, yollar, css
const ENT = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", middot: "·", times: "×", minus: "−", rarr: "→", larr: "←", deg: "°", ndash: "–", mdash: "—", hellip: "…" };
function dosyalar(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) dosyalar(p, out); else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}
const HARIC = /lib\/ceviri\/|lib\/dil\.ts|lib\/eski-unite\.ts|components\/Tanitim\.tsx|route\.ts$|\.d\.ts$|components\/ui\//;
const liste = (args.length ? args : ["app", "components", "lib"].flatMap((d) => dosyalar(d))).filter((f) => !HARIC.test(f));
const q = (s) => JSON.stringify(s);
function metinMi(t) {
  if (!HARF.test(t)) return false;
  if (/^(Enter|Escape|Tab|Backspace|Delete|Space|Home|End|Arrow\w+|Shift|Control|Alt|Meta|Bearer|Content-Type|Authorization|POST|GET)$/.test(t.trim())) return false;
  if (TR_HARF.test(t)) return true;
  if (/^https?:|^\/|^#|^@|^\.{1,2}\/|^tf-|^[a-z]+:[a-z]/.test(t)) return false;
  if (/\s/.test(t.trim())) {
    // sınıf listesi, yol ya da css değeri gibi duruyorsa metin değildir
    if (SINIF.test(t) && /[-:\[\]\/_#=]|[a-z]\d|\d[a-z]{3,}|\.[a-z]/.test(t) && !/[.!?]$/.test(t.trim())) return false;
    if (/^(use client|input,textarea)$/.test(t.trim())) return false;
    return true;
  }
  return /^[A-ZÇĞİÖŞÜ][a-zçğıöşü]+[.!?:…]*$/.test(t.trim()); // tek kelime: yalnızca büyük harfle başlayan
}
let toplam = 0;
for (const f of liste) {
  const kaynak = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, kaynak, ts.ScriptTarget.Latest, true, f.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const degis = [];
  const atlaUst = (n) => {
    for (let p = n.parent; p; p = p.parent) {
      if (ts.isJsxAttribute(p) && ATLA_OZ.has(p.name.getText())) return true;
      if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
        const e = p.expression; const ad = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) ? e.name.text : "";
        if (ATLA_CAGRI.test(ad)) return true;
      }
      if (ts.isTypeNode(p) || ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isEnumDeclaration(p)) return true;
      if (ts.isPropertyAssignment(p) && /^(className|style|tur|id|sahne|font|transition|animation|transform)$/.test(p.name.getText()) ) return true;
      if (ts.isJsxElement(p) && /^(style|script|code|pre)$/.test(p.openingElement.tagName.getText())) return true;
    }
    return false;
  };
  (function gez(n) {
    if (ts.isJsxText(n)) {
      const ham = n.getFullText ? kaynak.slice(n.pos, n.end) : n.text;
      const m = ham.match(/^(\s*)([\s\S]*?)(\s*)$/);
      let cek = m[2];
      if (HARF.test(cek) && !atlaUst(n)) {
        cek = cek.split(/\r?\n/).map((l, i, a) => (i ? l.replace(/^\s+/, "") : l)).map((l, i, a) => (i < a.length - 1 ? l.replace(/\s+$/, "") : l)).filter((l, i, a) => l !== "" || a.length === 1).join(" ");
        let tamam = true;
        cek = cek.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (hep, e) => {
          if (e[0] === "#") return String.fromCodePoint(e[1] === "x" ? parseInt(e.slice(2), 16) : +e.slice(1));
          if (e in ENT) return ENT[e];
          tamam = false; return hep;
        });
        if (tamam && !/[{}<>]/.test(cek)) degis.push([n.pos + m[1].length, n.end - m[3].length, `{cev(${q(cek)})}`]);
        else console.error("ATLANDI", f, cek.slice(0, 60));
      }
    } else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      const anahtar = (ts.isPropertyAssignment(p) && p.name === n) || ts.isElementAccessExpression(p) || ts.isLiteralTypeNode(p) || (ts.isExpressionStatement(p) && ts.isSourceFile(p.parent)) || ts.isPropertySignature(p) || ts.isMethodDeclaration(p);
      if (!anahtar && metinMi(n.text) && !atlaUst(n)) {
        if (ts.isJsxAttribute(p)) degis.push([n.getStart(), n.end, `{cev(${q(n.text)})}`]);
        else degis.push([n.getStart(), n.end, `cev(${q(n.text)})`]);
      }
    } else if (ts.isTemplateExpression(n) && !ts.isTaggedTemplateExpression(n.parent)) {
      const duz = n.head.text + n.templateSpans.map((s) => s.literal.text).join("\u0001");
      const yalin = duz.replace(/\u0001/g, " ").replace(/\b(translate|rotate|scale|rgba?|hsla?|calc|var|url|matrix|color-mix|in srgb|transparent|px|rem|deg|ms|solid|none|auto|inset|ease|linear|cubic-bezier|opacity|transform)\b/g, " ");
      const tekKelime = /^[a-zçğıöşü]{3,}$/.test(yalin.trim()) && !/[-_:/#.=]/.test(duz) && !/^(solid|none|auto|bold|normal|start|end|middle|left|right|center|top|bottom|true|false|smooth|spring|linear|infinite|forwards|both|hidden|visible)$/.test(yalin.trim());
      if ((metinMi(yalin.trim()) || tekKelime) && !/^[\sMLQCAZHVTSmlqcazhvts\d.,\-]+$/.test(yalin) && !atlaUst(n)) {
        let k = n.head.text; const parc = [];
        n.templateSpans.forEach((s, i) => { k += `{${i}}` + s.literal.text; parc.push(s.expression.getText()); });
        const yeni = `cev(${q(k)}, ${parc.join(", ")})`;
        degis.push([n.getStart(), n.end, ts.isJsxAttribute(n.parent) ? `{${yeni}}` : yeni]);
        return; // içindeki ifadelere girme (iç içe değişiklik çakışır)
      }
    }
    ts.forEachChild(n, gez);
  })(sf);
  if (!degis.length) continue;
  toplam += degis.length;
  if (!YAZ) { console.log(degis.length + "\t" + f); continue; }
  let s = kaynak;
  for (const [a, b, y] of degis.sort((x, y2) => y2[0] - x[0])) s = s.slice(0, a) + y + s.slice(b);
  if (!/from "@\/lib\/dil"/.test(s)) {
    const im = 'import { cev } from "@/lib/dil";\n';
    const ilk = s.search(/^import /m);
    s = ilk >= 0 ? s.slice(0, ilk) + im + s.slice(ilk) : s.replace(/^((?:"use client";\n|\/\/.*\n)*)/, `$1${im}`);
  }
  fs.writeFileSync(f, s);
}
console.error("toplam", toplam);
