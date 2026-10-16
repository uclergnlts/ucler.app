// "formul" etkileşimi için küçük, güvenli ifade hesaplayıcı. eval kullanılmaz.
// İzin verilenler: sayılar, girdi adları, + - * / ^ ( ), pi, e ve sqrt, abs, sin, cos, tan (derece), ln, log (10 tabanı), exp.
// tools/check.py aynı kuralları denetler.
const FN: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt, abs: Math.abs, ln: Math.log, log: Math.log10, exp: Math.exp,
  sin: (x) => Math.sin((x * Math.PI) / 180), cos: (x) => Math.cos((x * Math.PI) / 180), tan: (x) => Math.tan((x * Math.PI) / 180),
};
const SABIT: Record<string, number> = { pi: Math.PI, e: Math.E };

export function hesapla(ifade: string, v: Record<string, number>): number {
  const t = ifade.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[-+*/^()]/g) ?? [];
  let i = 0;
  const bak = () => t[i], al = () => t[i++];
  // toplam := carpim (('+'|'-') carpim)*
  function toplam(): number {
    let x = carpim();
    while (bak() === "+" || bak() === "-") x = al() === "+" ? x + carpim() : x - carpim();
    return x;
  }
  function carpim(): number {
    let x = tekli();
    while (bak() === "*" || bak() === "/") x = al() === "*" ? x * tekli() : x / tekli();
    return x;
  }
  function tekli(): number {
    if (bak() === "-") { al(); return -tekli(); }
    if (bak() === "+") { al(); return tekli(); }
    return us();
  }
  function us(): number {
    const x = taban();
    if (bak() === "^") { al(); return Math.pow(x, tekli()); }
    return x;
  }
  function taban(): number {
    const k = al();
    if (k === undefined) throw new Error("ifade eksik");
    if (k === "(") { const x = toplam(); if (al() !== ")") throw new Error(") eksik"); return x; }
    if (/^\d/.test(k)) return Number(k);
    if (k in FN) { if (al() !== "(") throw new Error("( eksik"); const x = toplam(); if (al() !== ")") throw new Error(") eksik"); return FN[k](x); }
    if (k in v) return v[k];
    if (k in SABIT) return SABIT[k];
    throw new Error(`bilinmeyen: ${k}`);
  }
  const x = toplam();
  if (i !== t.length) throw new Error("fazla parça");
  return x;
}
