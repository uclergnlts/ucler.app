// Bileşenlerdeki görünen Türkçe metinleri listeler (çeviri envanteri). c(...) içine alınmış olanları atlar.
// Kullanım: node tools/metin-envanteri.js [dosya ...]   (dosya verilmezse app, components, lib taranır)
const ts = require("typescript"), fs = require("fs"), path = require("path");
const ATLA = new Set(["className", "href", "src", "id", "key", "type", "name", "d", "viewBox", "fill", "stroke", "role", "rel", "target", "style", "tur", "ders", "data-tema", "htmlFor", "value", "method", "as", "points", "transform", "textAnchor", "dominantBaseline", "fontFamily", "strokeLinecap", "strokeLinejoin", "inputMode", "autoComplete", "mode"]);
const HARF = /[A-Za-zÇĞİÖŞÜçğıöşü]{2,}/;
const TURKCE = /[ÇĞİÖŞÜçğıöşü]|\s/;
function dosyalar(d, out = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) dosyalar(p, out); else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}
const liste = process.argv.slice(2).length ? process.argv.slice(2) : ["app", "components", "lib"].flatMap((d) => dosyalar(d));
let toplam = 0;
for (const f of liste) {
  if (/lib\/ceviri\//.test(f)) continue;
  const sf = ts.createSourceFile(f, fs.readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const bulgu = [];
  const cIcinde = (n) => { for (let p = n.parent; p; p = p.parent) if (ts.isCallExpression(p) && ts.isIdentifier(p.expression) && /^(c|cx|olay|iz|ses)$/.test(p.expression.text)) return true; return false; };
  (function gez(n) {
    let t = null, tur = "";
    if (ts.isJsxText(n)) { t = n.text.replace(/\s+/g, " ").trim(); tur = "jsx"; }
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isLiteralTypeNode(p) || ts.isTypeNode(p)) t = null;
      else if (ts.isJsxAttribute(p) && ATLA.has(p.name.getText())) t = null;
      else if (ts.isPropertyAssignment(p) && p.name === n) t = null;
      else if (ts.isBinaryExpression(p) && /===|!==|==|!=/.test(p.operatorToken.getText())) t = null;
      else if (ts.isCaseClause(p) || ts.isElementAccessExpression(p)) t = null;
      else { t = n.text; tur = "str"; }
      if (t !== null && !TURKCE.test(t)) t = null;
      if (t !== null && /^[a-z0-9\-_:./\[\]%()#\s]+$/.test(t) && /[-:/\[\]]/.test(t)) t = null; // tailwind sınıfları, yollar
    } else if (ts.isTemplateExpression(n)) { t = n.getText().slice(1, -1); tur = "tpl"; if (!TURKCE.test(t) || /^[a-z0-9\-_:./\[\]%()#\s${}?'"=!<>&|+*,]+$/.test(t.replace(/\$\{[^}]*\}/g, ""))) t = null; }
    if (t && HARF.test(t) && !cIcinde(n)) bulgu.push(`${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}\t${tur}\t${t}`);
    ts.forEachChild(n, gez);
  })(sf);
  if (bulgu.length) { toplam += bulgu.length; if (process.env.OZET) console.log(bulgu.length + "\t" + f); else console.log("## " + f + "\n" + bulgu.join("\n")); }
}
console.error("toplam", toplam);
