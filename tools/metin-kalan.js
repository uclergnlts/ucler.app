// cev(...) içine alınmamış, ama görünen metin olabilecek dizgileri listeler (küçük harfli, Türkçe harfsiz kısa metinler
// tools/metin-sar.js'in gözünden kaçar: "ince", "orta", `${s} saat`). Elle bakmak içindir.
// Kullanım: node tools/metin-kalan.js <dosya ...>
const ts = require("typescript"), fs = require("fs");
const ATLA_OZ = /^(className|class|href|src|id|key|type|name|d|viewBox|fill|stroke|role|rel|target|style|data-.*|htmlFor|method|as|points|transform|textAnchor|dominantBaseline|fontFamily|strokeLinecap|strokeLinejoin|inputMode|autoComplete|mode|strokeDasharray|variant|size|side|align|asChild|dur|begin|values|keyTimes|attributeName|repeatCount|calcMode|keySplines|from|to|markerEnd|markerStart|orient|clipPath|mask|filter|preserveAspectRatio|xmlns|enterKeyHint|autoCapitalize|loading|decoding|tur|ders|renk|ikon|opacity|x|y)$/;
const ATLA_CAGRI = /^(cev|cn|clsx|cva|olay|iz|require|getItem|setItem|removeItem|querySelector|querySelectorAll|getElementById|addEventListener|removeEventListener|push|replace|prefetch|matchMedia|test|match|split|join|startsWith|endsWith|includes|indexOf|from|select|eq|rpc|log|warn|error|createElement|getAttribute|setAttribute|toLocaleString|toLocaleDateString|toLocaleTimeString|Error|RegExp|URL|Date|fetch|import|read|write|useState|useRef|ses|cal|titre|animate|setProperty|getPropertyValue|get|set|has|delete|append|searchParams|dispatchEvent|CustomEvent|Event|play|vibrate|padStart|padEnd|toFixed|localeCompare|insert|update|upsert|order|on|channel|signInWithOAuth|invoke)$/;
for (const f of process.argv.slice(2)) {
  const kaynak = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, kaynak, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const atla = (n) => {
    for (let p = n.parent; p; p = p.parent) {
      if (ts.isJsxAttribute(p) && ATLA_OZ.test(p.name.getText())) return true;
      if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
        const e = p.expression; const ad = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) ? e.name.text : "";
        if (ATLA_CAGRI.test(ad)) return true;
      }
      if (ts.isTypeNode(p) || ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true;
      if (ts.isPropertyAssignment(p) && /^(className|style|tur|id|sahne|font|transition|animation|transform|renk|fill|stroke|d|key|ders|konu|href|ikon|anahtar|ad2|kod)$/.test(p.name.getText())) return true;
      if (ts.isBinaryExpression(p) && /^(===|!==|==|!=)$/.test(p.operatorToken.getText())) return true;
      if (ts.isCaseClause(p)) return true;
    }
    return false;
  };
  (function gez(n) {
    let t = null;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      if (!((ts.isPropertyAssignment(p) && p.name === n) || ts.isElementAccessExpression(p) || ts.isLiteralTypeNode(p) || (ts.isExpressionStatement(p) && ts.isSourceFile(p.parent)))) t = n.text;
    } else if (ts.isTemplateExpression(n)) t = n.head.text + n.templateSpans.map((s) => "{}" + s.literal.text).join("");
    else if (ts.isJsxText(n)) t = n.text.trim();
    if (t !== null && /[a-zçğıöşü]{2,}/.test(t) && !atla(n)) {
      const yalin = t.replace(/\{\}/g, " ").trim();
      const sinif = /^[\sa-z0-9\-_:./\[\]%()#!,'*+&>~=]+$/.test(yalin) && /[-:\[\]/_.#=]|\d/.test(yalin) && !/\s[a-zçğıöşü]{3,}\s[a-zçğıöşü]{3,}/.test(yalin);
      const svg = /^[\sMLQCAZHVTSmlqcazhvts\d.,\-{}]+$/.test(t) || /\b(translate|rotate|scale|rgba?|var\(|url\(|calc\(|px|deg|ease|linear|none|auto|currentColor|middle|end|start|round|butt|hidden|visible|solid|bold|normal|inherit|absolute|relative|flex|grid|block)\b/.test(yalin) && yalin.split(/\s+/).length <= 3;
      if (!sinif && !svg && !/^(use client|[a-z]+[A-Z]\w*|tf-[\w-]+|[a-z\-]+)$/.test(yalin) || /^[a-zçğıöşü]{2,}( [a-zçğıöşü0-9]+){0,3}$/.test(yalin) && !/-/.test(yalin) && !sinif && !svg && ts.isJsxText(n))
        out.push(`${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}\t${t.slice(0, 90)}`);
      else if (/^[a-zçğıöşü]{3,}$/.test(yalin) && (ts.isPropertyAssignment(n.parent) || ts.isArrayLiteralExpression(n.parent) || ts.isConditionalExpression(n.parent) || ts.isJsxExpression(n.parent) || ts.isJsxAttribute(n.parent)))
        out.push(`${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}\t?\t${t}`);
    }
    if (!(ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "cev")) ts.forEachChild(n, gez);
  })(sf);
  if (out.length) console.log("## " + f + "\n" + out.join("\n"));
}
