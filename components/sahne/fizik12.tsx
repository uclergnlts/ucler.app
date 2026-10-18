"use client";
// Fizik sahneleri (optik; ışığın girişimi ve kırınımı): gölge, yansıma yasası, açılı aynalar, çukur ayna, Snell yasası,
// tam yansıma, ışıkta renk, miyop göz; Huygens ve kırınım, Young deneyi, yol farkı, saçak aralığı, sıvıda girişim,
// tek yarıkta kırınım, polarizasyon.
import type { ReactNode } from "react";
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const DER = Math.PI / 180;
/** (x, y) noktalarından çizgi. */
const yol = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

/** Işın: (x1, y1)'den (x2, y2)'ye, ortasında yön oku. */
function Isin({ x1, y1, x2, y2, renk = "var(--c4)", kalin = 2.4, kesik = false, ok = true, op = 1 }: { x1: number; y1: number; x2: number; y2: number; renk?: string; kalin?: number; kesik?: boolean; ok?: boolean; op?: number }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 1) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, mx = (x1 + x2) / 2 + ux * 5, my = (y1 + y2) / 2 + uy * 5;
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={renk} strokeWidth={kalin} strokeLinecap="round" strokeDasharray={kesik ? "5 4" : undefined} />
      {ok && !kesik && L > 30 && <path d={`M${mx} ${my} L${mx - ux * 9 - uy * 5} ${my - uy * 9 + ux * 5} L${mx - ux * 9 + uy * 5} ${my - uy * 9 - ux * 5} Z`} fill={renk} />}
    </g>
  );
}

/** Açı yayı: merkez (x, y), r yarıçap, SVG açıları a1→a2 (derece, saat yönü). */
function Yay({ x, y, r, a1, a2, renk }: { x: number; y: number; r: number; a1: number; a2: number; renk: string }) {
  const p = (a: number) => [x + r * Math.cos(a * DER), y + r * Math.sin(a * DER)];
  const [x1, y1] = p(a1), [x2, y2] = p(a2);
  return <path d={`M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 ${a2 > a1 ? 1 : 0} ${x2.toFixed(1)} ${y2.toFixed(1)}`} fill="none" stroke={renk} strokeWidth={1.6} />;
}

/** Dalga boyuna (nm) göre görünür renk. */
function dalgaRenk(nm: number) {
  const tablo: [number, number[]][] = [[400, [139, 61, 255]], [450, [47, 110, 246]], [500, [0, 178, 140]], [550, [96, 196, 40]], [600, [255, 138, 0]], [650, [242, 70, 40]], [700, [214, 30, 30]]];
  const n = sinir(nm, 400, 700);
  let i = 0;
  while (i < tablo.length - 2 && n > tablo[i + 1][0]) i++;
  const [a, ra] = tablo[i], [b, rb] = tablo[i + 1], u = (n - a) / (b - a);
  const c = ra.map((x, k) => Math.round(x + (rb[k] - x) * u));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** Perdede saçak deseni: yatay (ya da dikey) şerit, renk geçişiyle. I(x) 0..1, x mm; şerit xMin..xMax mm. */
function Desen({ x0, x1, y, h, xMin, xMax, I, renk, id, dikey = false }: { x0: number; x1: number; y: number; h: number; xMin: number; xMax: number; I: (x: number) => number; renk: string; id: string; dikey?: boolean }) {
  const n = 300, gid = `fiz12-desen-${id}`.replace(/[^a-zA-Z0-9-]/g, "_");
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1={0} y1={0} x2={dikey ? 0 : 1} y2={dikey ? 1 : 0}>
          {Array.from({ length: n + 1 }, (_, i) => {
            const xm = dikey ? xMax - (i / n) * (xMax - xMin) : xMin + (i / n) * (xMax - xMin);
            return <stop key={i} offset={i / n} stopColor={renk} stopOpacity={sinir(I(xm), 0, 1)} />;
          })}
        </linearGradient>
      </defs>
      <rect x={x0} y={y} width={x1 - x0} height={h} fill="#14161c" rx={3} />
      <rect x={x0} y={y} width={x1 - x0} height={h} fill={`url(#${gid})`} rx={3} />
    </g>
  );
}

/* ================= Optik ================= */

// Gölge: noktasal (ya da v.g = 1 ise 6 cm'lik geniş) kaynak x = 0, 10 cm çaplı top v.d cm'de, perde 120 cm'de.
const GO = { X0: 30, PX: 2.333, Y: 116, PERDE: 120, TOP: 10, KAYNAK: 6 };
function Golge({ v }: SahneProps) {
  const d = sinir(v.d ?? 60, 20, 80), genis = (v.g ?? 0) === 1, { X0, PX, Y, PERDE, TOP, KAYNAK } = GO;
  const xc = (cm: number) => X0 + cm * PX, yc = (cm: number) => Y - cm * PX;
  const s = genis ? KAYNAK / 2 : 0, b = TOP / 2;
  // Perdede tam gölgenin ve yarı gölgenin üst sınırı (cm).
  const tam = s + (b - s) * (PERDE / d), yari = -s + (b + s) * (PERDE / d), kat = (2 * tam) / TOP;
  const xp = xc(PERDE), xt = xc(d);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Top kaynaktan ${d} cm uzakta; gölgenin çapı ${say(2 * tam)} cm`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{genis ? <>Tam gölge <tspan fill="var(--c2)">{say(2 * tam)} cm</tspan>, yarı gölgeyle {say(2 * yari)} cm</> : <>Gölge: 10 · 120 / {d} = <tspan fill="var(--c2)">{say(2 * tam)} cm</tspan></>}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{genis ? "geniş kaynakta tam gölge küçülür, çevresi yarı gölge" : `topun ${say(kat, 2)} katı`}</text>
      {/* gölge bölgeleri */}
      {genis && <path d={`M${xt} ${yc(b)} L${xp} ${yc(yari)} L${xp} ${yc(-yari)} L${xt} ${yc(-b)} Z`} fill="var(--ink)" opacity={0.07} />}
      <path d={`M${xt} ${yc(b)} L${xp} ${yc(tam)} L${xp} ${yc(-tam)} L${xt} ${yc(-b)} Z`} fill="var(--ink)" opacity={0.16} />
      {/* sınır ışınları */}
      {[1, -1].map((k) => (
        <g key={k}>
          <line x1={xc(0)} y1={yc(k * s)} x2={xp} y2={yc(k * tam)} stroke="var(--c4)" strokeWidth={1.4} />
          {genis && <line x1={xc(0)} y1={yc(-k * s)} x2={xp} y2={yc(k * yari)} stroke="var(--c4)" strokeWidth={1.2} strokeDasharray="4 3" />}
        </g>
      ))}
      {/* kaynak */}
      {genis ? <rect x={xc(0) - 5} y={yc(s)} width={10} height={2 * s * PX} rx={4} fill="var(--c4)" /> : <circle cx={xc(0)} cy={Y} r={6} fill="var(--c4)" />}
      <text x={xc(0)} y={Y + 32} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{genis ? "geniş" : "noktasal"}</text>
      {/* top */}
      <circle cx={xt} cy={Y} r={b * PX} fill="var(--c1)" />
      <text x={xt} y={Y + b * PX + 16} fontSize={11} fontWeight={700} fill="var(--c1)" textAnchor="middle">top</text>
      {/* perde ve üzerindeki gölge */}
      <line x1={xp} x2={xp} y1={yc(30)} y2={yc(-30)} stroke="var(--line-2)" strokeWidth={4} />
      {genis && <line x1={xp} x2={xp} y1={yc(yari)} y2={yc(-yari)} stroke="var(--muted)" strokeWidth={4} />}
      <line x1={xp} x2={xp} y1={yc(tam)} y2={yc(-tam)} stroke="var(--ink)" strokeWidth={4} />
      {/* ölçek */}
      <g fontSize={11} fill="var(--muted)">
        <line x1={xc(0)} x2={xt} y1={222} y2={222} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={xc(0)} x2={xc(0)} y1={218} y2={226} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={xt} x2={xt} y1={218} y2={226} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(xc(0) + xt) / 2} y={216} textAnchor="middle" fontWeight={700} fill="var(--ink)">d = {d} cm</text>
        <text x={xp} y={234} textAnchor="end">perde 120 cm'de</text>
      </g>
    </svg>
  );
}

// Yansıma: ayna y = 180, lazer (40, 60), gelme açısı v.a. Hedef, a = 40° ile vurulan noktada.
const YA = { LX: 40, LY: 60, AY: 180 };
const yansimaVurus = (a: number) => YA.LX + (YA.AY - YA.LY) * Math.tan(a * DER);
const YA_HEDEF = YA.LX + 2 * (YA.AY - YA.LY) * Math.tan(40 * DER);
function Yansima({ v }: SahneProps) {
  const a = sinir(v.a ?? 20, 10, 60), { LX, LY, AY } = YA, hx = yansimaVurus(a);
  const tn = Math.tan(a * DER), ux = Math.sin(a * DER), uy = -Math.cos(a * DER);
  // Yansıyan ışın y = LY'ye ya da x = 334'e kadar.
  const boy = Math.min((AY - LY) / -uy, (334 - hx) / ux), ex = hx + ux * boy, ey = AY + uy * boy;
  const vurdu = Math.abs(LX + 2 * (AY - LY) * tn - YA_HEDEF) < 3;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Gelme açısı ${a}°, yansıma açısı ${a}°${vurdu ? "; ışın hedefe çarptı" : ""}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={vurdu ? "var(--c3)" : "var(--ink)"}>{vurdu ? "Hedefe çarptı!" : `Gelme ${a}° → yansıma ${a}°`}</text>
      {/* hedef */}
      <g>
        <circle cx={YA_HEDEF} cy={LY} r={11} fill="none" stroke="var(--c2)" strokeWidth={2} />
        <circle cx={YA_HEDEF} cy={LY} r={4} fill="var(--c2)" />
        <text x={YA_HEDEF} y={LY - 17} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="middle">hedef</text>
      </g>
      {/* ayna */}
      <line x1={14} x2={326} y1={AY} y2={AY} stroke="var(--ink)" strokeWidth={3} />
      {Array.from({ length: 31 }, (_, i) => <line key={i} x1={18 + i * 10} x2={12 + i * 10} y1={AY + 2} y2={AY + 9} stroke="var(--line-2)" strokeWidth={1.4} />)}
      {/* normal */}
      <line x1={hx} x2={hx} y1={AY} y2={AY - 86} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={hx} y={AY - 92} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">normal</text>
      <Yay x={hx} y={AY} r={34} a1={-90 - a} a2={-90} renk="var(--c1)" />
      <Yay x={hx} y={AY} r={40} a1={-90} a2={-90 + a} renk="var(--c3)" />
      <text x={hx - 6 - 46 * Math.sin((a / 2) * DER)} y={AY - 46 * Math.cos((a / 2) * DER)} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="end">α</text>
      <text x={hx + 6 + 52 * Math.sin((a / 2) * DER)} y={AY - 52 * Math.cos((a / 2) * DER)} fontSize={12} fontWeight={800} fill="var(--c3)">β</text>
      {/* ışınlar */}
      <Isin x1={LX} y1={LY} x2={hx} y2={AY} />
      <Isin x1={hx} y1={AY} x2={ex} y2={ey} />
      {/* lazer */}
      <g transform={`translate(${LX} ${LY}) rotate(${90 - a})`}>
        <rect x={-26} y={-6} width={26} height={12} rx={3} fill="var(--ink)" />
      </g>
      <text x={14} y={208} fontSize={11.5} fontWeight={700} fill="var(--muted)">düz ayna · α: gelme, β: yansıma açısı</text>
    </svg>
  );
}

// Açılı iki ayna: tepe O, aynalar arası açı (s.aci ya da v.a). Oynatılınca görüntüler sırayla belirir.
type M2 = [number, number, number, number];
const carp = (a: M2, b: M2): M2 => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
/** SVG düzleminde, x eksenine φ açısı yapan doğruya göre yansıma. */
const yansit = (phi: number): M2 => [Math.cos(2 * phi), Math.sin(2 * phi), Math.sin(2 * phi), -Math.cos(2 * phi)];
function goruntuler(aci: number) {
  // Aynalar SVG açısı −90 ± aci/2 (yukarı doğru açılan V).
  const r1 = yansit((-90 - aci / 2) * DER), r2 = yansit((-90 + aci / 2) * DER);
  const anahtar = (m: M2) => m.map((x) => Math.round(x * 1000)).join(",");
  const gor = new Map<string, { m: M2; k: number }>([[anahtar([1, 0, 0, 1]), { m: [1, 0, 0, 1], k: 0 }]]);
  let sinir_ = [{ m: [1, 0, 0, 1] as M2, k: 0 }];
  while (sinir_.length && gor.size < 24) {
    const yeni: { m: M2; k: number }[] = [];
    for (const g of sinir_) for (const r of [r1, r2]) {
      const m = carp(r, g.m), a = anahtar(m);
      if (!gor.has(a)) { gor.set(a, { m, k: g.k + 1 }); yeni.push({ m, k: g.k + 1 }); }
    }
    sinir_ = yeni;
  }
  return [...gor.values()].filter((g) => g.k > 0).sort((a, b) => a.k - b.k);
}
function Aynalar({ v, s, t, oynuyor }: SahneProps) {
  const aci = Number(v.a ?? s.aci ?? 60), sure = Number(s.sure ?? 0), N = 360 / aci, tam = Math.abs(N - Math.round(N)) < 1e-6;
  const OX = 170, OY = 142, R = 58, ML = 118;
  const hepsi = tam ? goruntuler(aci) : [];
  const n = hepsi.length, u = sure ? ilerleme(t, oynuyor, sure) : 1, gorunen = sure ? Math.floor(u * (n + 0.999)) : n;
  const cisimA = (-90 - aci / 2 + aci * 0.32) * DER, P: [number, number] = [R * Math.cos(cisimA), R * Math.sin(cisimA)];
  const bayrak = "M0 9 V-11 M0 -11 H11 V-4 H0";
  const ciz = (m: M2, renk: string, op: number, k: number) => {
    const x = OX + m[0] * P[0] + m[1] * P[1], y = OY + m[2] * P[0] + m[3] * P[1];
    return (
      <g key={k} opacity={op}>
        <path d={bayrak} transform={`matrix(${m[0]} ${m[2]} ${m[1]} ${m[3]} ${x} ${y})`} fill="none" stroke={renk} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  };
  const ayna = (a: number) => {
    const ex = OX + ML * Math.cos(a * DER), ey = OY + ML * Math.sin(a * DER);
    return <line x1={OX} y1={OY} x2={ex} y2={ey} stroke="var(--ink)" strokeWidth={3.2} strokeLinecap="round" />;
  };
  const baslik = !tam
    ? `360 / ${aci} = ${say(N, 1)}: tam sayı değil`
    : sure && gorunen < n ? `${gorunen} görüntü…` : `n = 360/${aci} − 1 = ${n} görüntü`;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Aralarında ${aci}° olan iki ayna; ${tam ? `${gorunen} görüntü` : "kural geçerli değil"}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={!sure || gorunen === n ? "var(--c2)" : "var(--ink)"}>{baslik}</text>
      <circle cx={OX} cy={OY} r={R} fill="none" stroke="var(--line)" strokeDasharray="3 4" />
      {hepsi.slice(0, gorunen).map((g, i) => ciz(g.m, "var(--c5)", 0.5, i + 1))}
      {ayna(-90 - aci / 2)}
      {ayna(-90 + aci / 2)}
      <Yay x={OX} y={OY} r={22} a1={-90 - aci / 2} a2={-90 + aci / 2} renk="var(--muted)" />
      <text x={OX} y={OY - 28} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{aci}°</text>
      {ciz([1, 0, 0, 1], "var(--c1)", 1, 0)}
      <g fontSize={11.5} fontWeight={700}>
        <text x={14} y={232} fill="var(--c1)">mavi: cisim</text>
        <text x={326} y={232} fill="var(--c5)" textAnchor="end">soluk mor: sanal görüntüler</text>
      </g>
      {!tam && <text x={170} y={OY + R + 2} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">n = 360/α − 1 kuralı burada geçerli değil</text>}
    </svg>
  );
}

// Çukur ayna: f = 10 cm, cisim v.d cm'de. Tepe x = 250, asal eksen y = 118, 1 cm = 5 px. Cisim boyu 6 cm.
const CA = { VX: 250, Y: 118, PX: 5, F: 10, H: 6 };
function cukurDurum(d: number) {
  const { F } = CA;
  if (Math.abs(d - F) < 1e-6) return { dg: Infinity, m: Infinity, yazi: "Cisim odakta: görüntü oluşmaz" };
  const dg = 1 / (1 / F - 1 / d), m = -dg / d, am = Math.abs(m);
  const boy = Math.abs(am - 1) < 1e-6 ? "eşit boy" : am > 1 ? `${say(am, 2)} kat büyük` : `${say(am, 2)} kat (küçük)`;
  return { dg, m, yazi: dg > 0 ? `gerçek, ters, ${boy}` : `sanal, düz, ${boy}` };
}
function Cukur({ v }: SahneProps) {
  const d = sinir(v.d ?? 30, 5, 40), { VX, Y, PX, F, H } = CA, { dg, m, yazi } = cukurDurum(d);
  const xo = VX - d * PX, yt = Y - H * PX, sonlu = Number.isFinite(dg);
  const xi = sonlu ? VX - dg * PX : 0, yi = sonlu ? Y - m * H * PX : 0, gercek = sonlu && dg > 0;
  // Yansıyan ışınları sol kenara (x = 8) kadar uzat.
  const uzat = (x0: number, y0: number, dx: number, dy: number) => { const k = (x0 - 8) / -dx; return [x0 + dx * k, y0 + dy * k] as [number, number]; };
  const [a1x, a1y] = uzat(VX, yt, VX - F * PX - VX, Y - yt);
  const [a2x, a2y] = uzat(VX, Y, -(VX - xo), Y - yt);
  const egri = yol(Array.from({ length: 21 }, (_, i) => { const yy = Y - 82 + i * 8.2; return [VX - ((yy - Y) ** 2) / 900, yy] as [number, number]; }));
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`Cisim ${d} cm'de; ${yazi}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Cisim {d} cm → görüntü {sonlu ? `${say(Math.abs(dg), 1)} cm, aynanın ${dg > 0 ? "önünde" : "arkasında"}` : "yok"}</text>
      <text x={14} y={40} fontSize={12} fontWeight={800} fill="var(--c2)">{yazi}</text>
      {/* asal eksen, F, M */}
      <line x1={8} x2={332} y1={Y} y2={Y} stroke="var(--line-2)" strokeWidth={1.2} />
      {[["F", F], ["M", 2 * F]].map(([ad, c]) => (
        <g key={ad as string}>
          <circle cx={VX - (c as number) * PX} cy={Y} r={3} fill="var(--ink)" />
          <text x={VX - (c as number) * PX + 4} y={Y + 15} fontSize={11.5} fontWeight={800} fill="var(--ink)" stroke="#fff" strokeWidth={3} paintOrder="stroke">{ad}</text>
        </g>
      ))}
      {/* ayna */}
      <path d={egri} fill="none" stroke="var(--ink)" strokeWidth={3.2} />
      {Array.from({ length: 9 }, (_, i) => { const yy = Y - 76 + i * 19; const xx = VX - ((yy - Y) ** 2) / 900; return <line key={i} x1={xx + 2} x2={xx + 9} y1={yy} y2={yy - 6} stroke="var(--line-2)" strokeWidth={1.4} />; })}
      {/* ışınlar */}
      <Isin x1={xo} y1={yt} x2={VX} y2={yt} kalin={1.8} />
      <Isin x1={VX} y1={yt} x2={a1x} y2={a1y} kalin={1.8} />
      <Isin x1={xo} y1={yt} x2={VX} y2={Y} kalin={1.8} renk="var(--c3)" />
      <Isin x1={VX} y1={Y} x2={a2x} y2={a2y} kalin={1.8} renk="var(--c3)" />
      {sonlu && !gercek && (
        <g>
          <Isin x1={VX} y1={yt} x2={xi} y2={yi} kalin={1.4} kesik />
          <Isin x1={VX} y1={Y} x2={xi} y2={yi} kalin={1.4} kesik renk="var(--c3)" />
        </g>
      )}
      {/* cisim */}
      <line x1={xo} x2={xo} y1={Y} y2={yt + 6} stroke="var(--c1)" strokeWidth={3} />
      <path d={`M${xo} ${yt} l-6 9 h12 Z`} fill="var(--c1)" />
      <text x={xo} y={yt - 6} fontSize={11} fontWeight={700} fill="var(--c1)" textAnchor="middle" stroke="#fff" strokeWidth={3} paintOrder="stroke">cisim</text>
      {/* görüntü */}
      {sonlu && Math.abs(yi - Y) > 2 && (
        <g opacity={gercek ? 1 : 0.75}>
          <line x1={xi} x2={xi} y1={Y} y2={yi + (yi < Y ? 6 : -6)} stroke="var(--c2)" strokeWidth={3} strokeDasharray={gercek ? undefined : "5 3"} />
          <path d={yi < Y ? `M${xi} ${yi} l-6 9 h12 Z` : `M${xi} ${yi} l-6 -9 h12 Z`} fill="var(--c2)" />
          <text x={xi} y={yi < Y ? yi - 6 : yi + 16} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="middle" stroke="#fff" strokeWidth={3} paintOrder="stroke">görüntü</text>
        </g>
      )}
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">f = 10 cm · 1/f = 1/d<tspan fontSize={8.5} dy={3}>c</tspan><tspan dy={-3}> + 1/d</tspan><tspan fontSize={8.5} dy={3}>g</tspan></text>
    </svg>
  );
}

// Snell: havadan (n = 1) n'lik ortama, gelme açısı 53° (sin ≈ 0,8). Sınır y = 118, giriş noktası x = 170.
function Snell({ v }: SahneProps) {
  const n = sinir(v.n ?? 1.2, 1, 2), t1 = 53, t2 = Math.asin(Math.sin(t1 * DER) / n) / DER, HX = 170, HY = 118, L = 104;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kırılma indisi ${say(n)}; kırılma açısı ${say(t2, 0)}°`}>
      <rect x={0} y={HY} width={340} height={118} fill="var(--c1)" opacity={0.08} />
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">1 · sin 53° = {say(n)} · sin θ<tspan fontSize={9} dy={3}>2</tspan><tspan dy={-3}> → θ</tspan><tspan fontSize={9} dy={3}>2</tspan><tspan dy={-3} fill="var(--c2)"> = {say(t2, 0)}°</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">ışığın ortamdaki hızı v = c/n = {say(3 / n, 2)}·10⁸ m/s</text>
      <line x1={0} x2={340} y1={HY} y2={HY} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={HX} x2={HX} y1={HY - 70} y2={HY + 92} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={326} y={HY - 8} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">hava, n = 1</text>
      <text x={326} y={HY + 20} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="end">yeni ortam, n = {say(n)}</text>
      <Isin x1={HX - L * Math.sin(t1 * DER)} y1={HY - L * Math.cos(t1 * DER)} x2={HX} y2={HY} />
      <Isin x1={HX} y1={HY} x2={HX + L * Math.sin(t2 * DER)} y2={HY + L * Math.cos(t2 * DER)} />
      {n > 1.001 && <line x1={HX} y1={HY} x2={HX + L * Math.sin(t1 * DER)} y2={HY + L * Math.cos(t1 * DER)} stroke="var(--c4)" strokeWidth={1.2} strokeDasharray="3 4" opacity={0.6} />}
      <Yay x={HX} y={HY} r={30} a1={-90 - t1} a2={-90} renk="var(--c4)" />
      <text x={HX - 30} y={HY - 40} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="end">53°</text>
      <Yay x={HX} y={HY} r={34} a1={90 - t2} a2={90} renk="var(--c2)" />
      <text x={HX - 6} y={HY + 52} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="end">{say(t2, 0)}°</text>
      <text x={14} y={228} fontSize={11.5} fontWeight={700} fill="var(--muted)">{n > 1.001 ? "kesik çizgi: kırılmasaydı gideceği yol" : "n = 1: ışık hiç kırılmıyor"}</text>
    </svg>
  );
}

// Tam yansıma: camdan (n = 1,5) havaya, gelme açısı v.a. Sınır açı ≈ 41,8°.
function TamYansima({ v }: SahneProps) {
  const a = sinir(v.a ?? 20, 0, 80), n = 1.5, sn = n * Math.sin(a * DER), cikar = sn < 1, t2 = cikar ? Math.asin(sn) / DER : 90;
  const HX = 170, HY = 112, L = 104, sinirA = Math.asin(1 / n) / DER;
  const yansiyanOp = cikar ? 0.25 + 0.5 * (a / sinirA) ** 4 : 1;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Gelme açısı ${a}°; ${cikar ? `ışık havaya ${say(t2, 0)}° ile çıkıyor` : "tam yansıma"}`}>
      <rect x={0} y={HY} width={340} height={128} fill="var(--c1)" opacity={0.08} />
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={cikar ? "var(--ink)" : "var(--c2)"}>{cikar ? `Havaya çıkıyor: kırılma açısı ${say(t2, 0)}°` : `${a}° > sınır açı: tam yansıma`}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">sin θ<tspan fontSize={8.5} dy={3}>s</tspan><tspan dy={-3}> = 1/1,5 → sınır açı ≈ 42°</tspan></text>
      <line x1={0} x2={340} y1={HY} y2={HY} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={HX} x2={HX} y1={HY - 66} y2={HY + 110} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={326} y={HY - 8} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">hava</text>
      <text x={326} y={HY + 20} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="end">cam, n = 1,5</text>
      {/* sınır açı çizgisi */}
      <line x1={HX} y1={HY} x2={HX - 112 * Math.sin(sinirA * DER)} y2={HY + 112 * Math.cos(sinirA * DER)} stroke="var(--line-2)" strokeWidth={1.2} strokeDasharray="2 4" />
      <text x={HX - 112 * Math.sin(sinirA * DER) - 4} y={HY + 112 * Math.cos(sinirA * DER) + 12} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">42°</text>
      <Isin x1={HX - L * Math.sin(a * DER)} y1={HY + L * Math.cos(a * DER)} x2={HX} y2={HY} />
      <Isin x1={HX} y1={HY} x2={HX + L * Math.sin(a * DER)} y2={HY + L * Math.cos(a * DER)} op={yansiyanOp} />
      {cikar && <Isin x1={HX} y1={HY} x2={HX + L * Math.sin(t2 * DER)} y2={HY - L * Math.cos(t2 * DER)} op={1 - 0.6 * (a / sinirA) ** 4} />}
      {a > 0 && <Yay x={HX} y={HY} r={28} a1={90} a2={90 + a} renk="var(--c4)" />}
      <text x={HX - 50 * Math.sin((a / 2) * DER)} y={HY + 4 + 50 * Math.cos((a / 2) * DER)} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{a}°</text>
      <text x={14} y={234} fontSize={11.5} fontWeight={700} fill="var(--muted)">{cikar ? "ışığın bir kısmı yansıyor, kalanı dışarı çıkıyor" : "ışığın hepsi camın içine geri dönüyor"}</text>
    </svg>
  );
}

// Işıkta renk: sarı top beyaz ışıkta, sonra yalnızca kırmızı ışıkta. Sarı = kırmızı + yeşil yansıtır.
function Renk({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3.5), zt = ilerleme(t, oynuyor, sure) * sure;
  const k = sinir((zt - 1) / 1.2, 0, 1); // 0: beyaz ışık, 1: yalnız kırmızı
  const LX = 40, LY = 70, TX = 176, TY = 132, GX = 300, GY = 70;
  const isinlar = [
    { r: "#e5322d", g: 1, yansir: true, d: -8 },
    { r: "#2fae4e", g: 1 - k, yansir: true, d: 0 },
    { r: "#2f6ef6", g: 1 - k, yansir: false, d: 8 },
  ];
  const top = k < 0.5 ? "#f2c318" : `rgb(${Math.round(242 - 20 * (k - 0.5) * 2)}, ${Math.round(195 - 150 * (k - 0.5) * 2)}, ${Math.round(24 + 10 * (k - 0.5) * 2)})`;
  const baslik = zt === 0 ? "Beyaz ışıkta top sarı görünüyor" : k < 1 ? "Işık değişiyor…" : "Yalnızca kırmızı ışık: top kırmızı";
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={baslik}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={k >= 1 ? "#e5322d" : "var(--ink)"}>{baslik}</text>
      {isinlar.map((i) => (
        <g key={i.r}>
          <line x1={LX + 12} y1={LY + i.d} x2={TX - 22} y2={TY - 10 + i.d} stroke={i.r} strokeWidth={2.4} opacity={i.g} strokeLinecap="round" />
          {i.yansir && <line x1={TX + 20} y1={TY - 14 + i.d} x2={GX - 20} y2={GY + 6 + i.d} stroke={i.r} strokeWidth={2.4} opacity={i.g} strokeLinecap="round" />}
        </g>
      ))}
      {/* lamba */}
      <circle cx={LX} cy={LY} r={14} fill={k >= 1 ? "#e5322d" : "var(--c4)"} />
      <text x={LX} y={LY + 32} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{k >= 1 ? "kırmızı ışık" : "beyaz ışık"}</text>
      {/* top */}
      <circle cx={TX} cy={TY} r={24} fill={top} />
      <text x={TX} y={TY + 44} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">sarı top</text>
      {/* göz */}
      <g transform={`translate(${GX} ${GY})`}>
        <path d="M-16 0 Q0 -13 16 0 Q0 13 -16 0 Z" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <circle r={5} fill="var(--ink)" />
      </g>
      <text x={GX} y={GY + 30} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">göz</text>
      <text x={14} y={212} fontSize={11.5} fontWeight={700} fill="var(--muted)">{k >= 1 ? "yansıtacağı yeşil ışık yok; kırmızıyı yansıtıyor" : "sarı top kırmızı ve yeşili yansıtır, maviyi soğurur"}</text>
    </svg>
  );
}

// Miyop göz: göz merceği x = 160, retina x = 268. Odak retinanın önünde (x = 240). v.k: kalın kenarlı, v.i: ince kenarlı gözlük camı.
function Goz({ v }: SahneProps) {
  const k = (v.k ?? 0) === 1, i = (v.i ?? 0) === 1, GX = 70, EX = 160, RX = 268, Y = 120;
  const etki = (k ? 1 : 0) - (i ? 1 : 0); // +1 ıraksar, −1 toplar
  const Fx = etki > 0 ? RX : etki < 0 ? 214 : 240;
  const yay = 1 + 0.16 * etki; // gözlükten sonra ışınların göze vardıkları yükseklik çarpanı
  const hs = [-26, -13, 0, 13, 26];
  const net = Fx === RX;
  const leke = Math.abs(RX - Fx) * 26 * yay / (Fx - EX);
  const mercek = (x: number, ince: boolean) => ince
    ? <path d={`M${x} ${Y - 40} Q${x + 12} ${Y} ${x} ${Y + 40} Q${x - 12} ${Y} ${x} ${Y - 40} Z`} fill="var(--c1)" opacity={0.25} stroke="var(--c1)" strokeWidth={1.6} />
    : <path d={`M${x - 8} ${Y - 40} H${x + 8} Q${x + 1} ${Y} ${x + 8} ${Y + 40} H${x - 8} Q${x - 1} ${Y} ${x - 8} ${Y - 40} Z`} fill="var(--c5)" opacity={0.25} stroke="var(--c5)" strokeWidth={1.6} />;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={net ? "Görüntü retinaya düşüyor; net" : `Görüntü retinanın ${Fx < RX ? "önüne" : "arkasına"} düşüyor; bulanık`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={net ? "var(--c3)" : "var(--c2)"}>{net ? "Görüntü retinada: net" : "Görüntü retinanın önünde: bulanık"}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{k && i ? "iki cam birbirini götürüyor" : k ? "kalın kenarlı cam: ışınları biraz dağıtır" : i ? "ince kenarlı cam: ışınları daha da toplar" : "gözlük yok · uzaktaki cisimden paralel ışınlar"}</text>
      {/* göz küresi */}
      <circle cx={214} cy={Y} r={58} fill="none" stroke="var(--line-2)" strokeWidth={2} />
      <path d={`M${RX - 4} ${Y - 30} Q${RX + 2} ${Y} ${RX - 4} ${Y + 30}`} fill="none" stroke="var(--c2)" strokeWidth={3.2} />
      <text x={RX + 8} y={Y - 34} fontSize={11} fontWeight={700} fill="var(--c2)">retina</text>
      {/* ışınlar */}
      {hs.map((h) => {
        const y0 = Y + h, y1 = Y + h * yay;
        const ex = RX - 2, ey = y1 + ((Y - y1) * (ex - EX)) / (Fx - EX);
        return (
          <g key={h}>
            <line x1={10} y1={y0} x2={k || i ? GX : EX} y2={y0} stroke="var(--c4)" strokeWidth={1.6} />
            {(k || i) && <line x1={GX} y1={y0} x2={EX} y2={y1} stroke="var(--c4)" strokeWidth={1.6} />}
            <line x1={EX} y1={y1} x2={ex} y2={ey} stroke="var(--c4)" strokeWidth={1.6} />
          </g>
        );
      })}
      {/* göz merceği */}
      <path d={`M${EX} ${Y - 30} Q${EX + 14} ${Y} ${EX} ${Y + 30} Q${EX - 14} ${Y} ${EX} ${Y - 30} Z`} fill="var(--c3)" opacity={0.3} stroke="var(--c3)" strokeWidth={1.6} />
      {!net && <circle cx={Fx} cy={Y} r={3} fill="var(--c2)" />}
      {!net && <line x1={RX + 1} x2={RX + 1} y1={Y - leke} y2={Y + leke} stroke="var(--c4)" strokeWidth={5} opacity={0.6} />}
      {k && mercek(GX - (i ? 12 : 0), false)}
      {i && mercek(GX + (k ? 12 : 0), true)}
      <text x={EX} y={Y + 50} fontSize={11} fontWeight={700} fill="var(--c3)" textAnchor="middle">göz merceği</text>
      <text x={14} y={214} fontSize={11.5} fontWeight={700} fill="var(--muted)">{net ? "ışınlar retinada tek noktada buluşuyor" : "ışınlar retinaya varmadan buluşup dağılıyor"}</text>
    </svg>
  );
}

/* ================= Işığın girişimi ve kırınımı ================= */

// Huygens: düz dalga cepheleri x = 130'daki engele çarpar; aralık v.w dalga boyu. λ = 16 px.
function Huygens({ v }: SahneProps) {
  const w = sinir(v.w ?? 5, 1, 6), LP = 16, BX = 130, Y = 128, yar = (w * LP) / 2;
  const yayilma = Math.asin(Math.min(1, 1 / w)); // kabaca kırınım açısı
  const cephe = (r: number) => {
    const parca: ReactNode[] = [];
    const seg = 18;
    for (const yon of [-1, 1]) {
      for (let j = 0; j < seg; j++) {
        const a1 = (j / seg) * (Math.PI / 2), a2 = ((j + 1) / seg) * (Math.PI / 2), am = (a1 + a2) / 2;
        const op = am <= yayilma ? 1 : 0.12;
        const p = (a: number) => `${(BX + r * Math.cos(a)).toFixed(1)} ${(Y + yon * (yar + r * Math.sin(a))).toFixed(1)}`;
        parca.push(<path key={`${r}-${yon}-${j}`} d={`M${p(a1)} L${p(a2)}`} stroke="var(--c1)" strokeWidth={2} opacity={op} fill="none" />);
      }
    }
    parca.push(<line key={`${r}-d`} x1={BX + r} x2={BX + r} y1={Y - yar} y2={Y + yar} stroke="var(--c1)" strokeWidth={2} />);
    return parca;
  };
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Aralık ${w} dalga boyu; dalga ${w <= 2 ? "geniş yayılıyor" : "az yayılıyor"}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Aralık = {w}λ → <tspan fill={w <= 1 ? "var(--c3)" : "var(--c2)"}>{w <= 1 ? "her yöne yayılıyor" : w <= 2 ? "geniş yayılıyor" : "az yayılıyor"}</tspan></text>
      {/* gelen düz dalga */}
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={36 + i * LP} x2={36 + i * LP} y1={46} y2={210} stroke="var(--c1)" strokeWidth={2} />)}
      <defs><clipPath id="fiz12-huy-kirp"><rect x={BX} y={40} width={210} height={180} /></clipPath></defs>
      <g clipPath="url(#fiz12-huy-kirp)">
        {Array.from({ length: 12 }, (_, i) => cephe((i + 1) * LP))}
      </g>
      {/* engel */}
      <rect x={BX - 4} y={40} width={8} height={Y - yar - 40} fill="var(--ink)" />
      <rect x={BX - 4} y={Y + yar} width={8} height={220 - Y - yar} fill="var(--ink)" />
      {/* Huygens kaynakları */}
      {(w === 1 ? [Y] : Array.from({ length: w + 1 }, (_, i) => Y - yar + i * LP)).map((y) => <circle key={y} cx={BX} cy={y} r={2.6} fill="var(--c2)" />)}
      <text x={14} y={240} fontSize={11.5} fontWeight={700} fill="var(--muted)">kırmızı noktalar: dalgacık kaynakları · λ: dalga boyu</text>
    </svg>
  );
}

// Young deneyi: λ = 600 nm, d = 0,3 mm, L = 1,5 m → Δx = 3 mm. P noktası merkezden v.x mm.
function youngAd(x: number) {
  const k = x / 3;
  if (Math.abs(k - Math.round(k)) < 1e-6) return Math.round(k) === 0 ? "merkezi aydınlık saçak" : `${Math.round(k)}. aydınlık saçak`;
  if (Math.abs(k - Math.floor(k) - 0.5) < 1e-6) return `${Math.floor(k) + 1}. karanlık saçak`;
  return "aydınlık ile karanlık arası";
}
function Young({ v }: SahneProps) {
  const x = sinir(v.x ?? 1.5, 0, 8), D = 200 * x, k = x / 3, ad = youngAd(x), renk = dalgaRenk(600);
  const SX = 70, S1 = 92, S2 = 128, MY = 110, PX = 286, MM = 7, py = MY - MM * x;
  const aydinlik = ad.includes("aydınlık saçak"), karanlik = ad.includes("karanlık saçak");
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label={`P merkezden ${say(x)} mm uzakta; yol farkı ${say(D, 0)} nm; ${ad}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Δ = {say(D, 0)} nm = <tspan fill="var(--c2)">{say(k, 2)}λ</tspan></text>
      <text x={14} y={40} fontSize={12} fontWeight={800} fill={aydinlik ? "var(--c3)" : karanlik ? "var(--c2)" : "var(--muted)"}>{ad}</text>
      {/* kaynak ve yarıklar */}
      <circle cx={24} cy={MY} r={7} fill={renk} />
      <line x1={31} x2={SX - 2} y1={MY} y2={S1 + 2} stroke={renk} strokeWidth={1.2} opacity={0.5} />
      <line x1={31} x2={SX - 2} y1={MY} y2={S2 - 2} stroke={renk} strokeWidth={1.2} opacity={0.5} />
      <g fill="var(--ink)">
        <rect x={SX - 3} y={52} width={6} height={S1 - 4 - 52} />
        <rect x={SX - 3} y={S1 + 4} width={6} height={S2 - S1 - 8} />
        <rect x={SX - 3} y={S2 + 4} width={6} height={176 - S2 - 4} />
      </g>
      <text x={SX - 8} y={S1 + 4} fontSize={11} fontWeight={800} fill="var(--c1)" textAnchor="end">S₁</text>
      <text x={SX - 8} y={S2 + 4} fontSize={11} fontWeight={800} fill="var(--c3)" textAnchor="end">S₂</text>
      {/* yollar */}
      <line x1={SX} y1={S1} x2={PX} y2={py} stroke="var(--c1)" strokeWidth={1.8} />
      <line x1={SX} y1={S2} x2={PX} y2={py} stroke="var(--c3)" strokeWidth={1.8} />
      <line x1={SX} x2={PX} y1={MY} y2={MY} stroke="var(--line-2)" strokeDasharray="4 4" />
      {/* perde: dikey saçak deseni */}
      <Desen x0={PX} x1={PX + 14} y={MY - MM * 10} h={MM * 20} xMin={-10} xMax={10} I={(xm) => Math.cos((Math.PI * xm) / 3) ** 2} renk={renk} id="young" dikey />
      <path d={`M${PX + 16} ${py} l9 -6 v12 Z`} fill="var(--ink)" />
      <text x={PX + 28} y={py + 4} fontSize={12} fontWeight={800} fill="var(--ink)">P</text>
      <text x={PX + 7} y={MY + MM * 10 + 14} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">perde</text>
      <text x={14} y={208} fontSize={11.5} fontWeight={700} fill="var(--muted)">λ = 600 nm · d = 0,3 mm · L = 1,5 m</text>
      <text x={14} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">Δ = d·x/L · çizim ölçeksiz, yarıklar abartılı</text>
    </svg>
  );
}

// Yol farkı 3,5λ: S₁ ve S₂ dalgaları P'de üst üste biner. Oynatınca dalgalar akar, toplam çizilir.
function Faz({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure, X0 = 70, X1 = 326, LP = 48, A = 13;
  const g1 = sinir(zt / 0.8, 0, 1), g2 = sinir((zt - 0.8) / 0.8, 0, 1), g3 = sinir((zt - 1.8) / 0.8, 0, 1), faz = zt * 2.4;
  const dalga = (Y: number, kayma: number, gor: number, genlik = A) => yol(Array.from({ length: 129 }, (_, i) => {
    const x = X0 + i * 2;
    const ic = x <= X0 + gor * (X1 - X0);
    return [x, ic ? Y - genlik * Math.sin((2 * Math.PI * (x - X0)) / LP - faz + kayma) : Y] as [number, number];
  }));
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={bitti ? "Tepe çukurla buluşuyor: toplam sıfır, karanlık saçak" : "S₁ ve S₂'den gelen dalgalar P noktasında buluşuyor"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Tepe çukurla buluştu: toplam sıfır" : "Δ = 1750 nm, λ = 500 nm"}</text>
      <g fontSize={11.5} fontWeight={800}>
        <text x={14} y={64} fill="var(--c1)">S₁'den</text>
        <text x={14} y={118} fill="var(--c3)">S₂'den</text>
        <text x={14} y={180} fill="var(--ink)">toplam</text>
      </g>
      {[60, 114, 176].map((y) => <line key={y} x1={X0} x2={X1} y1={y} y2={y} stroke="var(--line)" />)}
      <path d={dalga(60, 0, g1)} fill="none" stroke="var(--c1)" strokeWidth={2.2} />
      <path d={dalga(114, Math.PI * 7, g2)} fill="none" stroke="var(--c3)" strokeWidth={2.2} />
      {g2 > 0 && <text x={X1} y={140} fontSize={11} fontWeight={700} fill="var(--c3)" textAnchor="end">3,5 dalga boyu geride = yarım dalga kayık</text>}
      {g3 > 0 && <line x1={X0} x2={X0 + g3 * (X1 - X0)} y1={176} y2={176} stroke="var(--ink)" strokeWidth={2.6} />}
      {g3 > 0 && <text x={X1} y={202} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="end">genlik 0 → ışık yok</text>}
      <text x={14} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">Δ / λ = 1750 / 500 = 3,5</text>
    </svg>
  );
}

// Saçak aralığı: λ (nm), L (m), d (mm). Perde −15..15 mm. Oynatınca ışık yanar.
function Sacak({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 1.5), u = ilerleme(t, oynuyor, sure);
  const lam = sinir(v.lam ?? 600, 400, 700), L = sinir(v.L ?? 1.5, 1, 2), d = sinir(v.d ?? 0.3, 0.2, 0.4), dx = (lam * 1e-6 * L * 1000) / d;
  const isik = kosular.length || oynuyor ? (oynuyor ? u : 1) : 0.35;
  const X0 = 20, X1 = 320, MX = (X0 + X1) / 2, PXmm = (X1 - X0) / 30;
  const gecmis = kosular.slice(-3);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`λ ${lam} nm, L ${say(L)} m, d ${say(d)} mm; saçak aralığı ${say(dx, 2)} mm`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Δx = λL/d = <tspan fill="var(--c2)">{say(dx, 2)} mm</tspan></text>
      <Desen x0={X0} x1={X1} y={46} h={44} xMin={-15} xMax={15} I={(x) => isik * Math.cos((Math.PI * x) / dx) ** 2} renk={dalgaRenk(lam)} id="sacak" />
      <path d={`M${MX} 96 V102 H${MX + dx * PXmm} V96`} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      <text x={MX + (dx * PXmm) / 2} y={116} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Δx</text>
      <g fontSize={11} fill="var(--muted)" textAnchor="middle">
        {[-15, -10, -5, 0, 5, 10, 15].map((m) => <text key={m} x={MX + m * PXmm} y={134}>{say(m)}</text>)}
      </g>
      <text x={326} y={148} fontSize={11} fill="var(--muted)" textAnchor="end">mm</text>
      {gecmis.length > 0 && (
        <g fontSize={11} fontWeight={700} fill="var(--c5)">
          <text x={14} y={160}>Denemelerin:</text>
          {gecmis.map((k, i) => {
            const l = k.lam ?? 600, LL = k.L ?? 1.5, dd = k.d ?? 0.3;
            return <text key={i} x={14} y={176 + i * 15}>λ {l} nm · L {say(LL)} m · d {say(dd)} mm → Δx {say((l * 1e-6 * LL * 1000) / dd, 2)} mm</text>;
          })}
        </g>
      )}
    </svg>
  );
}

// Suya daldırma: havada Δx = 4 mm; su dolunca (n = 1,33) Δx = 3 mm.
function Sivi({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure;
  const su = sinir(zt / 1.6, 0, 1), sik = sinir((zt - 1.8) / 1.4, 0, 1), n = 1 + 0.33 * sik, dx = 4 / n;
  const X0 = 20, X1 = 320, MX = 170, PXmm = (X1 - X0) / 30, TY = 50, TH = 76;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Saçak aralığı ${say(dx, 2)} mm`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Suda Δx = 4 / 1,33 = 3 mm" : su > 0 ? "Kap suyla doluyor…" : "Havada Δx = 4 mm"}</text>
      {/* kap: solda yarıklar, sağda perde */}
      <rect x={40} y={TY + TH * (1 - su)} width={260} height={TH * su} fill="var(--c1)" opacity={0.14} />
      <path d={`M40 ${TY} V${TY + TH} H300 V${TY}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g fill="var(--ink)">
        <rect x={76} y={TY + 8} width={5} height={24} />
        <rect x={76} y={TY + 36} width={5} height={6} />
        <rect x={76} y={TY + 46} width={5} height={24} />
      </g>
      <rect x={280} y={TY + 6} width={6} height={TH - 12} fill="var(--line-2)" />
      <text x={78} y={TY - 6} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">yarıklar</text>
      <text x={283} y={TY - 6} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">perde</text>
      {/* perdedeki desen */}
      <Desen x0={X0} x1={X1} y={146} h={36} xMin={-15} xMax={15} I={(x) => Math.cos((Math.PI * x) / dx) ** 2} renk={dalgaRenk(600)} id="sivi" />
      <path d={`M${MX} 186 V192 H${MX + dx * PXmm} V186`} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      <text x={MX + (dx * PXmm) / 2} y={206} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Δx = {say(dx, 1)} mm</text>
      <line x1={MX} x2={MX} y1={140} y2={146} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={MX} y={136} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">merkez</text>
      <text x={14} y={222} fontSize={11.5} fontWeight={700} fill="var(--muted)">perdedeki desen · λ = 600 nm</text>
    </svg>
  );
}

// Tek yarık: λ = 500 nm, L = 1 m, yarık genişliği v.w μm. Merkezi saçak 2λL/w.
function TekYarik({ v }: SahneProps) {
  const w = sinir(v.w ?? 200, 50, 250), mer = (2 * 500e-9 * 1) / (w * 1e-6) * 1000; // mm
  const X0 = 20, X1 = 320, MX = 170, PXmm = (X1 - X0) / 60;
  const I = (x: number) => { const b = (Math.PI * (w / 1000) * x) / 0.5; return Math.abs(b) < 1e-9 ? 1 : (Math.sin(b) / b) ** 2; };
  const yg = 12 + w * 0.14;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Yarık ${w} mikrometre; merkezi saçak ${say(mer, 1)} mm`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Merkezi saçak = 2λL/w = <tspan fill="var(--c2)">{say(mer, 1)} mm</tspan></text>
      {/* yarık */}
      <g fill="var(--ink)">
        <rect x={60} y={44} width={110 - yg / 2} height={8} />
        <rect x={170 + yg / 2} y={44} width={110 - yg / 2} height={8} />
      </g>
      <text x={170} y={70} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="middle">w = {w} μm</text>
      <path d={`M${170 - yg / 2} 40 V36 H${170 + yg / 2} V40`} fill="none" stroke="var(--c1)" strokeWidth={1.4} />
      {/* desen */}
      <Desen x0={X0} x1={X1} y={84} h={44} xMin={-30} xMax={30} I={(x) => Math.sqrt(I(x))} renk={dalgaRenk(500)} id="tekyarik" />
      <path d={`M${MX - (mer / 2) * PXmm} 134 V140 H${MX + (mer / 2) * PXmm} V134`} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      <text x={MX} y={154} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">merkezi saçak</text>
      <g fontSize={11} fill="var(--muted)" textAnchor="middle">
        {[-30, -20, -10, 0, 10, 20, 30].map((m) => <text key={m} x={MX + m * PXmm} y={174}>{say(m)}</text>)}
      </g>
      <text x={326} y={188} fontSize={11} fill="var(--muted)" textAnchor="end">mm</text>
      <text x={14} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)">λ = 500 nm · L = 1 m · yarık ölçeksiz</text>
    </svg>
  );
}

// Polarizasyon: doğal ışık → 1. polarizör (dikey) → 2. polarizör v.a derece çevrik.
function Polar({ v }: SahneProps) {
  const a = sinir(v.a ?? 0, 0, 90), oran = Math.cos(a * DER) ** 2, Y = 112;
  const ok = (x: number, aci: number, boy: number, renk: string) => {
    if (boy < 1) return null;
    const dx = boy * Math.sin(aci * DER), dy = -boy * Math.cos(aci * DER);
    return <line x1={x - dx} y1={Y - dy} x2={x + dx} y2={Y + dy} stroke={renk} strokeWidth={2.4} strokeLinecap="round" />;
  };
  const filtre = (x: number, aci: number, ad: string) => (
    <g>
      <ellipse cx={x} cy={Y} rx={16} ry={46} fill="var(--line)" stroke="var(--muted)" strokeWidth={1.4} />
      <g transform={`translate(${x} ${Y}) scale(0.35 1) rotate(${aci})`}>
        {[-24, -12, 0, 12, 24].map((o) => <line key={o} x1={o} x2={o} y1={-Math.sqrt(Math.max(0, 40 ** 2 - o * o))} y2={Math.sqrt(Math.max(0, 40 ** 2 - o * o))} stroke="var(--ink)" strokeWidth={2.2} />)}
      </g>
      <text x={x} y={Y + 64} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{ad}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`İkinci polarizör ${a}° çevrik; geçen ışık yüzde ${say(oran * 100, 0)}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={oran < 0.01 ? "var(--c2)" : "var(--ink)"}>{oran < 0.01 ? "Işık tamamen kesildi" : `2. polarizörden geçen: %${say(oran * 100, 0)}`}</text>
      <line x1={20} x2={320} y1={Y} y2={Y} stroke="var(--line-2)" strokeDasharray="4 4" />
      {/* doğal ışık: her doğrultuda titreşim */}
      {[0, 45, 90, 135].map((q) => <g key={q}>{ok(42, q, 20, "var(--c4)")}</g>)}
      <text x={36} y={Y + 64} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">doğal ışık</text>
      {filtre(110, 0, "1. polarizör")}
      {ok(165, 0, 22, "var(--c4)")}
      {filtre(220, a, `2. (${a}°)`)}
      {ok(268, a, 22 * Math.cos(a * DER), "var(--c4)")}
      {/* perde */}
      <rect x={300} y={Y - 40} width={14} height={80} rx={3} fill="#14161c" />
      <rect x={300} y={Y - 40} width={14} height={80} rx={3} fill="#ffd34d" opacity={oran} />
      <text x={307} y={Y + 64} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">perde</text>
      <text x={14} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)">turuncu çizgiler: titreşim doğrultusu</text>
    </svg>
  );
}

export const FIZIK12: Record<string, SahneKaydi> = {
  "fiz12-golge": { C: Golge },
  "fiz12-yansima": { C: Yansima },
  "fiz12-aynalar": { C: Aynalar },
  "fiz12-cukur": { C: Cukur },
  "fiz12-snell": { C: Snell },
  "fiz12-tam": { C: TamYansima },
  "fiz12-renk": { C: Renk },
  "fiz12-goz": { C: Goz },
  "fiz12-huygens": { C: Huygens },
  "fiz12-young": { C: Young },
  "fiz12-faz": { C: Faz },
  "fiz12-sacak": { C: Sacak },
  "fiz12-sivi": { C: Sivi },
  "fiz12-tekyarik": { C: TekYarik },
  "fiz12-polar": { C: Polar },
};
