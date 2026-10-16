// Kimyasal formülü çözümleyip atom sayar. "Formülde atom say" oyunu cevapları elle yazmaz, buradan hesaplar.
// Desteklenen yazım: katsayı ("2 H2SO4"), parantez ("Al2(SO4)3", iç içe de olur), hidrat ("CuSO4·5H2O").

// Bir atomun formüldeki katkısı: sembol, kendi indisi ve dıştan gelen çarpanlar (parantez indisi, katsayı).
export type Katki = { s: string; n: number; carpan: number[] };
export type Parca = { katsayi: number; govde: string; katkilar: Katki[] };

function govdeCoz(g: string): Katki[] {
  let i = 0;
  const sayi = () => {
    let t = "";
    while (i < g.length && g[i] >= "0" && g[i] <= "9") t += g[i++];
    return t ? Number(t) : 1;
  };
  const grup = (): Katki[] => {
    const out: Katki[] = [];
    while (i < g.length && g[i] !== ")") {
      if (g[i] === "(") {
        i++;
        const ic = grup();
        if (g[i] !== ")") throw new Error(`Kapanmayan parantez: ${g}`);
        i++;
        const k = sayi();
        for (const a of ic) out.push(k === 1 ? a : { ...a, carpan: [k, ...a.carpan] });
      } else if (g[i] >= "A" && g[i] <= "Z") {
        let s = g[i++];
        while (i < g.length && g[i] >= "a" && g[i] <= "z") s += g[i++];
        out.push({ s, n: sayi(), carpan: [] });
      } else throw new Error(`Beklenmeyen karakter "${g[i]}": ${g}`);
    }
    return out;
  };
  const r = grup();
  if (i !== g.length) throw new Error(`Fazla kapanan parantez: ${g}`);
  return r;
}

export function coz(formul: string): Parca[] {
  return formul.split("·").map((p) => {
    const m = /^\s*(\d*)\s*(.+?)\s*$/.exec(p);
    if (!m) throw new Error(`Boş parça: ${formul}`);
    return { katsayi: m[1] ? Number(m[1]) : 1, govde: m[2], katkilar: govdeCoz(m[2]) };
  });
}

// Her atom katkısının toplam değeri: indis × parantez çarpanları × parça katsayısı.
export const katkiDegeri = (k: Katki, katsayi: number) => k.n * k.carpan.reduce((a, b) => a * b, 1) * katsayi;

export function say(formul: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of coz(formul)) for (const k of p.katkilar) m.set(k.s, (m.get(k.s) || 0) + katkiDegeri(k, p.katsayi));
  return m;
}

export const toplam = (formul: string) => [...say(formul).values()].reduce((a, b) => a + b, 0);

// Sık yapılan yanlışlar (yanlış seçenek üretmek için): parantez indisini ya da katsayıyı unutmak.
export function yanlisSay(formul: string, hata: "parantez" | "katsayi", s?: string) {
  let t = 0;
  for (const p of coz(formul))
    for (const k of p.katkilar) {
      if (s && k.s !== s) continue;
      const c = hata === "parantez" ? k.n * p.katsayi : k.n * k.carpan.reduce((a, b) => a * b, 1);
      t += c;
    }
  return t;
}

// Oyundaki formüller. Ad yalnızca bilgi için gösterilir.
export const FORMULLER: { f: string; ad: string }[] = [
  { f: "H2O", ad: "su" },
  { f: "CO2", ad: "karbon dioksit" },
  { f: "NH3", ad: "amonyak" },
  { f: "CH4", ad: "metan" },
  { f: "C6H12O6", ad: "glikoz" },
  { f: "C12H22O11", ad: "sakaroz" },
  { f: "C2H5OH", ad: "etil alkol" },
  { f: "CH3COOH", ad: "asetik asit" },
  { f: "H2SO4", ad: "sülfürik asit" },
  { f: "HNO3", ad: "nitrik asit" },
  { f: "H3PO4", ad: "fosforik asit" },
  { f: "CaCO3", ad: "kalsiyum karbonat" },
  { f: "NaHCO3", ad: "sodyum bikarbonat" },
  { f: "Ca(OH)2", ad: "kalsiyum hidroksit" },
  { f: "Mg(OH)2", ad: "magnezyum hidroksit" },
  { f: "Ba(NO3)2", ad: "baryum nitrat" },
  { f: "Al2(SO4)3", ad: "alüminyum sülfat" },
  { f: "(NH4)2SO4", ad: "amonyum sülfat" },
  { f: "Ca3(PO4)2", ad: "kalsiyum fosfat" },
  { f: "Fe2(SO4)3", ad: "demir(III) sülfat" },
  { f: "2 H2O", ad: "2 tane su molekülü" },
  { f: "3 CO2", ad: "3 tane karbon dioksit molekülü" },
  { f: "2 H2SO4", ad: "2 tane sülfürik asit molekülü" },
  { f: "4 NH3", ad: "4 tane amonyak molekülü" },
  { f: "2 Al(OH)3", ad: "2 birim alüminyum hidroksit" },
  { f: "3 Ca(OH)2", ad: "3 birim kalsiyum hidroksit" },
  { f: "CuSO4·5H2O", ad: "göztaşı (bakır(II) sülfat pentahidrat)" },
  { f: "Na2CO3·10H2O", ad: "çamaşır sodası (sodyum karbonat dekahidrat)" },
];
