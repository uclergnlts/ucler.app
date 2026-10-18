"use client";
// Fizik sahneleri (atom çekirdeği ve radyoaktivite): çekirdek ve izotop, güçlü çekirdek kuvveti, kütle açığı,
// nükleon başına bağlanma enerjisi, bozunma zinciri, ışımaların sapması ve giriciliği, yarı ömür, zincirleme fisyon.
import type { ReactNode } from "react";
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const yumusak = (u: number) => u * u * (3 - 2 * u);
/** (x, y) noktalarından çizgi. */
const yol = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

const PROTON = "var(--c2)", NOTRON = "#9aa7b8";

/** Çekirdek: p proton ve n nötron, (x, y) çevresinde ayçiçeği dizilişiyle. */
function Cekirdek({ x, y, p, n, r = 8 }: { x: number; y: number; p: number; n: number; r?: number }) {
  const A = p + n;
  const toplar = Array.from({ length: A }, (_, i) => {
    const proton = Math.floor(((i + 1) * p) / A) > Math.floor((i * p) / A);
    const yr = r * 1.08 * Math.sqrt(i), a = i * 2.39996;
    return { cx: x + yr * Math.cos(a), cy: y + yr * Math.sin(a), proton };
  });
  return (
    <g>
      {toplar.reverse().map((b, i) => (
        <g key={i}>
          <circle cx={b.cx} cy={b.cy} r={r} fill={b.proton ? PROTON : NOTRON} stroke="#fff" strokeWidth={1.4} />
          {b.proton && <text x={b.cx} y={b.cy + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">+</text>}
        </g>
      ))}
    </g>
  );
}

/** Çekirdek gösterimi: üstte A, altta Z, sağda simge. (x, y) simgenin sol alt köşesi. */
function Gosterim({ x, y, A, Z, sembol, renk = "var(--ink)", boy = 34 }: { x: number; y: number; A: number; Z: number; sembol: string; renk?: string; boy?: number }) {
  const k = boy / 34;
  return (
    <g fill={renk} fontWeight={800}>
      <text x={x - 3 * k} y={y - 22 * k} fontSize={15 * k} textAnchor="end">{A}</text>
      <text x={x - 3 * k} y={y + 2 * k} fontSize={15 * k} textAnchor="end">{Z}</text>
      <text x={x} y={y} fontSize={boy}>{sembol}</text>
    </g>
  );
}

/* ================= 1. Çekirdek ve izotop ================= */

const HAFIF = ["", "H", "He", "Li", "Be", "B", "C", "N", "O"];
const HAFIF_AD = ["", "hidrojen", "helyum", "lityum", "berilyum", "bor", "karbon", "azot", "oksijen"];
function CekirdekSahne({ v }: SahneProps) {
  const p = sinir(v.p ?? 6, 1, 8), n = sinir(v.n ?? 6, 0, 10), A = p + n;
  const hedef = p === 6 && n === 8;
  const baslik = p !== 6 ? `Z = ${p}: artık karbon değil, ${HAFIF_AD[p]}` : hedef ? "Karbon-14: karbon-12'nin izotopu" : `Karbon-${A}`;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`${p} proton, ${n} nötron: ${HAFIF_AD[p]}-${A}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={hedef ? "var(--c3)" : p !== 6 ? "var(--c2)" : "var(--ink)"}>{baslik}</text>
      <Cekirdek x={100} y={122} p={p} n={n} r={9} />
      <Gosterim x={232} y={134} A={A} Z={p} sembol={HAFIF[p]} boy={44} />
      <g fontSize={12} fontWeight={700} fill="var(--muted)">
        <text x={200} y={172}>Z = proton = <tspan fill={PROTON}>{p}</tspan></text>
        <text x={200} y={190}>N = nötron = <tspan fill="var(--ink)">{n}</tspan></text>
        <text x={200} y={208}>A = Z + N = <tspan fill="var(--ink)">{A}</tspan></text>
      </g>
      <g fontSize={11} fontWeight={700}>
        <circle cx={40} cy={214} r={6} fill={PROTON} />
        <text x={50} y={218} fill="var(--muted)">proton</text>
        <circle cx={104} cy={214} r={6} fill={NOTRON} />
        <text x={114} y={218} fill="var(--muted)">nötron</text>
      </g>
    </svg>
  );
}

/* ================= 2. Güçlü çekirdek kuvveti ================= */

// Temsilî büyüklükler: elektriksel itme ∝ 1/r², güçlü çekim r ≈ 1 fm'den sonra üstel söner.
const itme = (r: number) => 25 / (r * r);
const cekim = (r: number) => 90 * Math.exp(-2.5 * (r - 1));
/** Okların ve grafiğin ölçeği: kuvvetin karekökü (küçük değerler de görünsün). */
const olcek = (f: number) => Math.sqrt(f / 90);
function Kuvvet({ v }: SahneProps) {
  const r = sinir(v.r ?? 1, 1, 4), fi = itme(r), fc = cekim(r), baskin = fc > fi;
  const Y = 78, PX = 34, cx = 170, x1 = cx - (r * PX) / 2, x2 = cx + (r * PX) / 2;
  const okBoy = (f: number) => 62 * olcek(f);
  const ok = (x: number, yon: number, boy: number, renk: string, dy: number) => {
    if (boy < 2) return null;
    const ux = x + yon * boy;
    return (
      <g>
        <line x1={x} x2={ux - yon * 6} y1={Y + dy} y2={Y + dy} stroke={renk} strokeWidth={3} strokeLinecap="round" />
        <path d={`M${ux} ${Y + dy} L${ux - yon * 8} ${Y + dy - 5} L${ux - yon * 8} ${Y + dy + 5} Z`} fill={renk} />
      </g>
    );
  };
  // Grafik: r = 0,8..4 fm.
  const GX = 44, GW = 270, GY = 236, GH = 78, gx = (q: number) => GX + ((q - 1) / 3) * GW, gy = (f: number) => GY - sinir(olcek(f), 0, 1) * GH;
  const egri = (f: (q: number) => number) => yol(Array.from({ length: 65 }, (_, i) => { const q = 1 + (i / 64) * 3; return [gx(q), gy(f(q))]; }));
  return (
    <svg viewBox="0 0 340 270" role="img" aria-label={`Protonlar arası ${say(r)} fm; ${baskin ? "güçlü çekim baskın" : "elektriksel itme baskın"}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={baskin ? "var(--c3)" : "var(--c2)"}>{baskin ? "Güçlü çekim baskın: bir arada kalırlar" : "Elektriksel itme baskın: ayrılırlar"}</text>
      {/* oklar: kırmızı itme dışa, yeşil çekim içe */}
      {ok(x1 - 12, -1, okBoy(fi), "var(--c2)", -20)}
      {ok(x2 + 12, 1, okBoy(fi), "var(--c2)", -20)}
      {ok(x1 - 12 - okBoy(fc), 1, okBoy(fc), "var(--c3)", 20)}
      {ok(x2 + 12 + okBoy(fc), -1, okBoy(fc), "var(--c3)", 20)}
      {[x1, x2].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={Y} r={12} fill={PROTON} />
          <text x={x} y={Y + 5} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle">+</text>
        </g>
      ))}
      <text x={cx} y={Y + 46} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">aralarında {say(r)} fm (1 fm = 10⁻¹⁵ m)</text>
      {/* grafik */}
      <line x1={GX} x2={GX + GW} y1={GY} y2={GY} stroke="var(--line-2)" strokeWidth={1.4} />
      <path d={egri(itme)} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
      <path d={egri(cekim)} fill="none" stroke="var(--c3)" strokeWidth={2.2} />
      <line x1={gx(r)} x2={gx(r)} y1={GY - GH - 4} y2={GY} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="3 3" />
      {[1, 2, 3, 4].map((q) => <text key={q} x={gx(q)} y={GY + 14} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{q} fm</text>)}
      <text x={GX + GW} y={GY - GH + 6} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="end">elektriksel itme</text>
      <text x={GX + GW} y={GY - GH + 22} fontSize={11} fontWeight={700} fill="var(--c3)" textAnchor="end">güçlü çekim</text>
      <text x={GX - 6} y={GY - GH + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">F</text>
      <text x={GX} y={GY + 30} fontSize={10.5} fill="var(--muted)">temsilî ölçek</text>
    </svg>
  );
}

/* ================= 3. Kütle açığı ================= */

// Kütleler (u): proton 1,00728, nötron 1,00866; helyum-4 çekirdeği 4,00151.
const AYRI = 2 * 1.00728 + 2 * 1.00866, HE = 4.00151;
function Kutle({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure;
  const egim = yumusak(sinir((zt - 1) / 1.6, 0, 1)), bitti = zt >= 2.8, aci = 7 * egim; // sol kefe aşağı
  const CX = 170, CY = 92, KOL = 100;
  const rad = (aci * Math.PI) / 180, lx = CX - KOL * Math.cos(rad), ly = CY + KOL * Math.sin(rad), rx = CX + KOL * Math.cos(rad), ry = CY - KOL * Math.sin(rad);
  const kefe = (x: number, y: number, ic: ReactNode, yazi: string) => (
    <g>
      <line x1={x - 34} x2={x} y1={y + 52} y2={y} stroke="var(--line-2)" strokeWidth={1.4} />
      <line x1={x + 34} x2={x} y1={y + 52} y2={y} stroke="var(--line-2)" strokeWidth={1.4} />
      <path d={`M${x - 42} ${y + 52} Q${x} ${y + 70} ${x + 42} ${y + 52} Z`} fill="var(--ink)" />
      {ic}
      <text x={x} y={y + 88} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{yazi}</text>
    </g>
  );
  const baslik = zt === 0 ? "Hangisi daha ağır?" : bitti ? `Kütle açığı Δm = ${say(AYRI - HE, 4)} u` : "Terazi serbest…";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Ayrı nükleonlar daha ağır; aradaki fark kütle açığı" : "Solda ayrı 2 proton ve 2 nötron, sağda helyum-4 çekirdeği"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      {/* ayak */}
      <path d={`M${CX} ${CY} L${CX} 214 M${CX - 30} 214 L${CX + 30} 214`} stroke="var(--line-2)" strokeWidth={4} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
      {kefe(lx, ly, (
        <g>
          {[[-22, PROTON], [-8, NOTRON], [8, PROTON], [22, NOTRON]].map(([dx, c], i) => (
            <circle key={i} cx={lx + Number(dx)} cy={ly + 50} r={6.5} fill={String(c)} stroke="#fff" strokeWidth={1.2} />
          ))}
        </g>
      ), bitti ? `${say(AYRI, 5)} u` : "ayrı 2p + 2n")}
      {kefe(rx, ry, <Cekirdek x={rx} y={ry + 46} p={2} n={2} r={6.5} />, bitti ? `${say(HE, 5)} u` : "helyum-4 çekirdeği")}
      {bitti && <text x={14} y={42} fontSize={11.5} fontWeight={700} fill="var(--muted)">E = Δm·c² ≈ 0,0304 · 931,5 ≈ 28,3 MeV</text>}
    </svg>
  );
}

/* ================= 4. Nükleon başına bağlanma enerjisi ================= */

const EGRI: [number, number, string][] = [
  [2, 1.11, "H-2"], [4, 7.07, "He-4"], [6, 5.33, "Li-6"], [12, 7.68, "C-12"], [16, 7.98, "O-16"], [20, 8.03, "Ne-20"], [28, 8.45, "Si-28"],
  [40, 8.55, "Ca-40"], [56, 8.79, "Fe-56"], [62, 8.79, "Ni-62"], [84, 8.72, "Kr-84"], [120, 8.5, "Sn-120"], [138, 8.39, "Ba-138"], [208, 7.87, "Pb-208"], [238, 7.57, "U-238"],
];
const egriDeger = (A: number) => {
  let i = 0;
  while (i < EGRI.length - 2 && A > EGRI[i + 1][0]) i++;
  const [a, ea] = EGRI[i], [b, eb] = EGRI[i + 1];
  return ea + ((sinir(A, a, b) - a) / (b - a)) * (eb - ea);
};
function Egri({ v }: SahneProps) {
  const A = sinir(v.A ?? 12, 2, 238), E = egriDeger(A), tepe = A >= 54 && A <= 64;
  const yakin = EGRI.find(([a]) => Math.abs(a - A) <= 2);
  const GX = 44, GW = 280, GY = 200, GH = 150;
  const gx = (a: number) => GX + Math.sqrt(a / 240) * GW, gy = (e: number) => GY - (e / 9.5) * GH;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`A = ${A}: nükleon başına yaklaşık ${say(E, 2)} MeV`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={tepe ? "var(--c3)" : "var(--ink)"}>
        {yakin ? yakin[2] : `A = ${A}`}: <tspan fill="var(--c1)">{say(E, 2)} MeV</tspan> / nükleon{tepe ? " · tepe" : ""}
      </text>
      {/* eksenler */}
      <line x1={GX} x2={GX + GW} y1={GY} y2={GY} stroke="var(--line-2)" strokeWidth={1.4} />
      <line x1={GX} x2={GX} y1={GY} y2={GY - GH} stroke="var(--line-2)" strokeWidth={1.4} />
      {[0, 2, 4, 6, 8].map((e) => <text key={e} x={GX - 6} y={gy(e) + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">{e}</text>)}
      {[4, 16, 56, 120, 238].map((a) => <text key={a} x={gx(a)} y={GY + 14} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{a}</text>)}
      <text x={GX + GW} y={GY + 28} fontSize={10.5} fill="var(--muted)" textAnchor="end">kütle numarası A</text>
      <text x={GX - 30} y={GY - GH - 8} fontSize={10.5} fill="var(--muted)">MeV</text>
      {/* yönler */}
      <text x={gx(14)} y={GY - 18} fontSize={11} fontWeight={700} fill="var(--c4)" textAnchor="middle">füzyon →</text>
      <text x={gx(180)} y={GY - 18} fontSize={11} fontWeight={700} fill="var(--c4)" textAnchor="middle">← fisyon</text>
      <path d={yol(EGRI.map(([a, e]) => [gx(a), gy(e)]))} fill="none" stroke="var(--c1)" strokeWidth={2.4} strokeLinejoin="round" />
      {EGRI.map(([a, e]) => <circle key={a} cx={gx(a)} cy={gy(e)} r={2.6} fill="var(--c1)" />)}
      <line x1={gx(A)} x2={gx(A)} y1={gy(E)} y2={GY} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="3 3" />
      <circle cx={gx(A)} cy={gy(E)} r={7} fill={tepe ? "var(--c3)" : "var(--ink)"} stroke="#fff" strokeWidth={2} />
    </svg>
  );
}

/* ================= 5. Bozunma zinciri ================= */

const AGIR: Record<number, string> = {
  72: "Hf", 73: "Ta", 74: "W", 75: "Re", 76: "Os", 77: "Ir", 78: "Pt", 79: "Au", 80: "Hg", 81: "Tl", 82: "Pb", 83: "Bi", 84: "Po", 85: "At", 86: "Rn",
  87: "Fr", 88: "Ra", 89: "Ac", 90: "Th", 91: "Pa", 92: "U", 93: "Np", 94: "Pu", 95: "Am", 96: "Cm", 97: "Bk", 98: "Cf", 99: "Es", 100: "Fm",
};
function Zincir({ v }: SahneProps) {
  const a = sinir(v.a ?? 0, 0, 10), b = sinir(v.b ?? 0, 0, 8), A = 238 - 4 * a, Z = 92 - 2 * a + b;
  const hedef = A === 206 && Z === 82;
  // Z–A düzlemi: Z 72..100, A 198..240.
  const GX = 40, GW = 280, GY = 216, GH = 100;
  const gx = (z: number) => GX + ((z - 72) / 28) * GW, gy = (m: number) => GY - ((m - 198) / 42) * GH;
  const noktalar: [number, number][] = [[92, 238]];
  for (let i = 1; i <= a; i++) noktalar.push([92 - 2 * i, 238 - 4 * i]);
  for (let i = 1; i <= b; i++) noktalar.push([92 - 2 * a + i, A]);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${a} alfa ve ${b} beta eksi sonrası A = ${A}, Z = ${Z}: ${AGIR[Z]}-${A}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={hedef ? "var(--c3)" : "var(--ink)"}>{hedef ? "Kurşun-206'ya ulaştın!" : `Şu an: ${AGIR[Z]}-${A}`}</text>
      <Gosterim x={40} y={84} A={238} Z={92} sembol="U" boy={30} />
      <text x={84} y={76} fontSize={18} fontWeight={800} fill="var(--muted)">→</text>
      <Gosterim x={130} y={84} A={A} Z={Z} sembol={AGIR[Z]} renk={hedef ? "var(--c3)" : "var(--c1)"} boy={30} />
      <g fontSize={11} fontWeight={700}>
        <text x={192} y={58} fill={A === 206 ? "var(--c3)" : "var(--muted)"}>A = 238 − 4·{a} = {A}</text>
        <text x={192} y={76} fill={Z === 82 ? "var(--c3)" : "var(--muted)"}>Z = 92 − 2·{a} + {b} = {Z}</text>
        <text x={192} y={94} fill="var(--muted)">hedef: ²⁰⁶₈₂Pb</text>
      </g>
      {/* düzlem */}
      <line x1={GX} x2={GX + GW} y1={GY} y2={GY} stroke="var(--line-2)" strokeWidth={1.4} />
      <line x1={GX} x2={GX} y1={GY} y2={GY - GH} stroke="var(--line-2)" strokeWidth={1.4} />
      {[74, 82, 92, 100].map((z) => <text key={z} x={gx(z)} y={GY + 13} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{z}</text>)}
      {[206, 238].map((m) => <text key={m} x={GX - 5} y={gy(m) + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">{m}</text>)}
      <text x={GX + GW} y={GY - 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">Z →</text>
      <text x={GX + 4} y={GY - GH + 2} fontSize={10.5} fill="var(--muted)">A</text>
      <circle cx={gx(82)} cy={gy(206)} r={8} fill="none" stroke="var(--c3)" strokeWidth={2} strokeDasharray="3 2" />
      <path d={yol(noktalar.map(([z, m]) => [gx(z), gy(m)]))} fill="none" stroke="var(--c1)" strokeWidth={2} strokeLinejoin="round" />
      {noktalar.map(([z, m], i) => <circle key={i} cx={gx(z)} cy={gy(m)} r={i === noktalar.length - 1 ? 5 : 3} fill={i === noktalar.length - 1 ? "var(--c1)" : "var(--c1)"} opacity={i === noktalar.length - 1 ? 1 : 0.55} />)}
      <text x={gx(92) + 8} y={gy(238) + 4} fontSize={10.5} fontWeight={700} fill="var(--muted)">U-238</text>
      <text x={gx(82) + 12} y={gy(206) + 4} fontSize={10.5} fontWeight={700} fill="var(--c3)">Pb-206</text>
      <g fontSize={10.5} fontWeight={700} fill="var(--muted)">
        <text x={GX + GW} y={GY - 44} textAnchor="end">α: sola-aşağı · β⁻: sağa</text>
      </g>
    </svg>
  );
}

/* ================= 6. Işımalar: sapma ve giricilik ================= */

// Kaynak (24, 110); plakalar x = 60..170 arası (üst +, alt −); engeller: kâğıt 210, alüminyum 255, kurşun 300.
const IS = { SX: 24, SY: 110, P0: 60, P1: 170 };
type Isima = { ad: string; renk: string; sapma: number; dur: number };
const ISIMALAR: Isima[] = [
  { ad: "α", renk: "var(--c2)", sapma: 6, dur: 207 },
  { ad: "β⁻", renk: "var(--c1)", sapma: -24, dur: 254 },
  { ad: "γ", renk: "var(--c5)", sapma: 0, dur: 336 },
];
/** Işımanın x'teki yüksekliği: alan içinde parabol, sonra doğru. */
function isimaY(x: number, sapma: number) {
  const { SY, P0, P1 } = IS, L = P1 - P0;
  if (x <= P0) return SY;
  if (x <= P1) return SY + sapma * ((x - P0) / L) ** 2;
  return SY + sapma + ((2 * sapma) / L) * (x - P1);
}
function Isinim({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4.5), zt = ilerleme(t, oynuyor, sure) * sure;
  const on = IS.SX + sinir(zt / 3.4, 0, 1) * (336 - IS.SX), bitti = zt >= 3.4;
  const engel = (x: number, w: number, renk: string, ad: string, ay: number) => (
    <g>
      <rect x={x} y={34} width={w} height={156} rx={1.5} fill={renk} />
      <text x={x + w / 2} y={ay} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{ad}</text>
    </g>
  );
  const baslik = zt === 0 ? "Kaynak α, β⁻ ve γ saçıyor" : bitti ? "β⁻ en çok saptı; γ hiç sapmadı" : "Işımalar elektrik alandan geçiyor…";
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={bitti ? "Alfa negatif plakaya az, beta eksi pozitif plakaya çok saptı, gama sapmadı; alfa kâğıtta, beta alüminyumda durdu, gama kurşunda zayıfladı" : "Radyoaktif kaynak, elektrik alan ve üç engel"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      {/* plakalar */}
      <rect x={IS.P0} y={52} width={IS.P1 - IS.P0} height={5} rx={2} fill="var(--c2)" />
      <rect x={IS.P0} y={163} width={IS.P1 - IS.P0} height={5} rx={2} fill="var(--c1)" />
      <text x={IS.P0 - 8} y={60} fontSize={14} fontWeight={800} fill="var(--c2)" textAnchor="end">+</text>
      <text x={IS.P0 - 8} y={171} fontSize={14} fontWeight={800} fill="var(--c1)" textAnchor="end">−</text>
      {/* engeller */}
      {engel(208, 3, "#d9cbb0", "kâğıt", 204)}
      {engel(253, 5, "#b8c2cf", "alüminyum", 218)}
      {engel(298, 14, "#6b7280", "kurşun", 204)}
      {/* ışımalar */}
      {ISIMALAR.map((i) => {
        const son = Math.min(on, i.dur), pts: [number, number][] = [];
        for (let x = IS.SX; x <= son; x += 3) pts.push([x, isimaY(x, i.sapma)]);
        pts.push([son, isimaY(son, i.sapma)]);
        const kursunSonrasi = i.ad === "γ" && on > 312;
        return (
          <g key={i.ad}>
            {on > IS.SX + 1 && <path d={yol(pts.filter(([x]) => x <= Math.min(son, 312)))} fill="none" stroke={i.renk} strokeWidth={2.4} strokeLinecap="round" />}
            {kursunSonrasi && <path d={yol([[312, isimaY(312, 0)], [son, isimaY(son, 0)]])} fill="none" stroke={i.renk} strokeWidth={2.4} opacity={0.35} />}
            {on >= i.dur - 1 && i.ad !== "γ" && <circle cx={i.dur} cy={isimaY(i.dur, i.sapma)} r={4} fill={i.renk} />}
            {on > 140 && <text x={i.ad === "γ" ? 182 : 186} y={isimaY(i.ad === "γ" ? 182 : 186, i.sapma) + (i.sapma > 0 ? 16 : i.sapma < 0 ? -8 : -7)} fontSize={12} fontWeight={800} fill={i.renk} textAnchor="middle">{i.ad}</text>}
          </g>
        );
      })}
      {/* kaynak */}
      <rect x={IS.SX - 14} y={IS.SY - 12} width={18} height={24} rx={3} fill="var(--ink)" />
      <text x={IS.SX - 5} y={IS.SY + 30} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">kaynak</text>
    </svg>
  );
}

/* ================= 7. Yarı ömür ================= */

const YO = { N0: 120, T: 4 };
function YariOmur({ v }: SahneProps) {
  const t = sinir(v.t ?? 0, 0, 24), n = t / YO.T, N = YO.N0 / 2 ** n, hedef = t === 12;
  const GX = 44, GW = 276, GY = 206, GH = 128;
  const gx = (q: number) => GX + (q / 24) * GW, gy = (m: number) => GY - (m / YO.N0) * GH;
  const egri = yol(Array.from({ length: 97 }, (_, i) => { const q = (i / 96) * 24; return [gx(q), gy(YO.N0 / 2 ** (q / YO.T))]; }));
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`${t} gün sonra ${say(N, 2)} g kaldı`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={hedef ? "var(--c3)" : "var(--ink)"}>Kalan: <tspan fill="var(--c1)">{say(N, 2)} g</tspan></text>
      <text x={14} y={42} fontSize={11.5} fontWeight={700} fill="var(--muted)">n = {t} / 4 = {say(n, 2)} yarı ömür → 120 / 2{n === Math.round(n) ? <tspan dy={-5} fontSize={9}>{n}</tspan> : <tspan dy={-5} fontSize={9}>{say(n, 2)}</tspan>}</text>
      <line x1={GX} x2={GX + GW} y1={GY} y2={GY} stroke="var(--line-2)" strokeWidth={1.4} />
      <line x1={GX} x2={GX} y1={GY} y2={GY - GH} stroke="var(--line-2)" strokeWidth={1.4} />
      {[120, 60, 30, 15].map((m) => (
        <g key={m}>
          <line x1={GX} x2={gx(YO.T * Math.log2(YO.N0 / m))} y1={gy(m)} y2={gy(m)} stroke="var(--line-2)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={GX - 5} y={gy(m) + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">{m}</text>
        </g>
      ))}
      {[0, 4, 8, 12, 16, 20, 24].map((q) => <text key={q} x={gx(q)} y={GY + 14} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{q}</text>)}
      <text x={GX + GW} y={GY + 28} fontSize={10.5} fill="var(--muted)" textAnchor="end">gün</text>
      <text x={GX - 30} y={GY - GH - 8} fontSize={10.5} fill="var(--muted)">g</text>
      <path d={egri} fill="none" stroke="var(--c1)" strokeWidth={2.4} />
      <line x1={gx(t)} x2={gx(t)} y1={gy(N)} y2={GY} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="3 3" />
      <circle cx={gx(t)} cy={gy(N)} r={7} fill={hedef ? "var(--c3)" : "var(--ink)"} stroke="#fff" strokeWidth={2} />
    </svg>
  );
}

/* ================= 8. Zincirleme fisyon ================= */

function Fisyon({ v }: SahneProps) {
  const k = sinir(v.k ?? 2, 0, 3), KUSAK = 5, SINIR = 16;
  const sayilar = Array.from({ length: KUSAK }, (_, g) => (g === 0 ? 1 : k ** g));
  const satirY = (g: number) => 58 + g * 36;
  const konum = (g: number, j: number) => {
    const n = Math.min(sayilar[g], SINIR);
    return 30 + ((j + 0.5) / n) * 250;
  };
  const baslik = k === 0 ? "Tepkime söndü" : k === 1 ? "Sabit hız: denetimli tepkime" : "Hızla büyüyor: denetimsiz";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Her bölünmeden ${k} nötron yeni bölünme yapıyor; kuşaklar: ${sayilar.join(", ")}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={k === 1 ? "var(--c3)" : k === 0 ? "var(--muted)" : "var(--c2)"}>{baslik}</text>
      {sayilar.map((sayi, g) => {
        const n = Math.min(sayi, SINIR), y = satirY(g);
        return (
          <g key={g}>
            {g > 0 && sayi > 0 && sayilar[g - 1] <= SINIR && Array.from({ length: n }, (_, j) => (
              <line key={j} x1={konum(g - 1, Math.floor(j / k))} y1={satirY(g - 1) + 6} x2={konum(g, j)} y2={y - 6} stroke="var(--line-2)" strokeWidth={1.2} />
            ))}
            {Array.from({ length: n }, (_, j) => <circle key={j} cx={konum(g, j)} cy={y} r={n > 9 ? 4.5 : 7} fill="var(--c4)" />)}
            {sayi > SINIR && <text x={286} y={y + 4} fontSize={12} fontWeight={800} fill="var(--muted)">…</text>}
            <text x={326} y={y + 4} fontSize={12} fontWeight={800} fill={sayi === 0 ? "var(--muted)" : "var(--ink)"} textAnchor="end">{sayi}</text>
          </g>
        );
      })}
      <text x={14} y={232} fontSize={11.5} fontWeight={700} fill="var(--muted)">her satır bir kuşak; sağda bölünme sayısı</text>
    </svg>
  );
}

export const FIZIK14: Record<string, SahneKaydi> = {
  "fiz14-cekirdek": { C: CekirdekSahne },
  "fiz14-kuvvet": { C: Kuvvet },
  "fiz14-kutle": { C: Kutle },
  "fiz14-egri": { C: Egri },
  "fiz14-zincir": { C: Zincir },
  "fiz14-isinim": { C: Isinim },
  "fiz14-yari": { C: YariOmur },
  "fiz14-fisyon": { C: Fisyon },
};
