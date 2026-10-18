"use client";
// Kimya sahneleri (tepkime hızı, kimyasal denge): derişim-zaman eğrisi, katsayılarla hızlar, etkin çarpışma,
// Maxwell–Boltzmann dağılımı, temas yüzeyi, katalizör, hız denklemi derecesi; dinamik denge (N₂O₄ ⇌ 2NO₂),
// BDD tablosu, tepkime oranı Q, Le Chatelier (hacim, sıcaklık), katalizör ve Haber yöntemi.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const virgul = (x: number, b = 2) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const KAHVE = "#b5652b";

/** Basit eksen: sol alt köşe (x0, y1), sağ üst (x1, y0). */
function Eksen({ x0, x1, y0, y1, yAd, xAd }: { x0: number; x1: number; y0: number; y1: number; yAd: string; xAd: string }) {
  return (
    <g>
      <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={x0} x2={x0} y1={y0} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={x0 + 6} y={y0 + 2} fontSize={11} fontWeight={700} fill="var(--muted)">{yAd}</text>
      <text x={x1} y={y1 + 16} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">{xAd}</text>
    </g>
  );
}

/* ---------- derişim-zaman eğrisi ---------- */

function Egri({ s, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = oran(t, oynuyor, sure), k = 0.5;
  const x0 = 46, x1 = 314, y0 = 40, y1 = 186;
  const X = (tt: number) => x0 + (tt / 5) * (x1 - x0), Y = (c: number) => y1 - c * (y1 - y0 - 10);
  const tn = u * 5, A = Math.exp(-k * tn), hiz = k * A;
  const nok = (f: (tt: number) => number) => Array.from({ length: 41 }, (_, i) => (i / 40) * tn).map((tt) => `${X(tt).toFixed(1)},${Y(f(tt)).toFixed(1)}`).join(" ");
  // Şimdiki noktada [A] eğrisinin teğeti
  const eg = -k * A, dx = 0.9;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`A → B: ${virgul(tn, 1)} saniyede [A] ${virgul(A)} M`}>
      <Eksen x0={x0} x1={x1} y0={y0} y1={y1} yAd="derişim (M)" xAd="" />
      <g fontSize={10} fill="var(--muted)">
        {[0, 1, 2, 3, 4, 5].map((i) => <text key={i} x={X(i)} y={y1 + 14} textAnchor="middle">{i === 5 ? "5 s" : i}</text>)}
        <text x={x0 - 6} y={Y(1) + 4} textAnchor="end">1</text>
        <text x={x0 - 6} y={Y(0.5) + 4} textAnchor="end">0,5</text>
      </g>
      {u > 0 && <polyline points={nok((tt) => Math.exp(-k * tt))} fill="none" stroke="var(--kimya)" strokeWidth={3} strokeLinecap="round" />}
      {u > 0 && <polyline points={nok((tt) => 1 - Math.exp(-k * tt))} fill="none" stroke="var(--c1)" strokeWidth={3} strokeLinecap="round" />}
      {u > 0 && u < 1 && (
        <line x1={X(Math.max(0, tn - dx))} y1={Y(A - eg * dx)} x2={X(Math.min(5, tn + dx))} y2={Y(A + eg * dx)} stroke="var(--c4)" strokeWidth={2} strokeDasharray="5 4" />
      )}
      <g fontSize={12} fontWeight={800}>
        <text x={x1 - 74} y={20} textAnchor="end" fill="var(--kimya)">[A] giren</text>
        <text x={x1} y={20} textAnchor="end" fill="var(--c1)">[B] ürün</text>
        <text x={x1} y={104} textAnchor="end" fill="var(--ink)">{u > 0 ? `hız: ${virgul(hiz, 3)} M/s` : "A → B"}</text>
        {u > 0 && <text x={x1} y={120} fontSize={11} textAnchor="end" fill="var(--muted)">başta 0,5 M/s</text>}
      </g>
    </svg>
  );
}

/* ---------- katsayılar ve hız ---------- */

function Katsayi({ v }: SahneProps) {
  const nh3 = (v.nh3 ?? 2) / 10;
  const satir = [
    { ad: "N₂ harcanma", h: 0.2, renk: "#9aa8ba", k: 1 },
    { ad: "H₂ harcanma", h: 0.6, renk: "var(--c4)", k: 3 },
    { ad: "NH₃ oluşma", h: nh3, renk: "var(--kimya)", k: 2 },
  ];
  const W = 170, uyar = Math.abs(nh3 - 0.4) < 1e-9;
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={`N₂ 0,2, H₂ 0,6, NH₃ ${virgul(nh3, 1)} M/s`}>
      <text x={170} y={26} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--ink)">N₂ + 3H₂ → 2NH₃</text>
      {satir.map((r, i) => (
        <g key={i}>
          <text x={20} y={66 + i * 38} fontSize={12} fontWeight={700} fill="var(--muted)">{r.ad}</text>
          <rect x={112} y={54 + i * 38} width={Math.max(2, (r.h / 1) * W)} height={16} rx={4} fill={r.renk} />
          <text x={118 + Math.max(2, r.h * W)} y={67 + i * 38} fontSize={12} fontWeight={800} fill="var(--ink)">{virgul(r.h, 1)} M/s</text>
        </g>
      ))}
      <text x={170} y={182} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={uyar ? "var(--good)" : "var(--muted)"}>
        {uyar ? "0,2 : 0,6 : 0,4 = 1 : 3 : 2" : `0,2 : 0,6 : ${virgul(nh3, 1)} ≠ 1 : 3 : 2`}
      </text>
    </svg>
  );
}

/* ---------- etkin çarpışma ---------- */

const EA = 60;
function Carpisma({ v, s, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = oran(t, oynuyor, sure);
  const yon = (v.yon ?? 0) === 1, e = v.e ?? 30, etkin = yon && e >= EA;
  const yaklas = yumusak(Math.min(1, u / 0.5)), sonra = yumusak(Math.max(0, (u - 0.5) / 0.5));
  const CY = 98;
  // Soldaki AB molekülü: uygun yönelimde B sağda (C'ye bakar), değilse A sağda.
  const solX = 40 + yaklas * 98, sagX = 300 - yaklas * 98;
  const bitti = u >= 1;
  let A = { x: solX + (yon ? 0 : 24), y: CY }, B = { x: solX + (yon ? 24 : 0), y: CY }, C = { x: sagX, y: CY };
  if (u > 0.5) {
    if (etkin) { A = { x: A.x - sonra * 110, y: CY }; B = { x: B.x + sonra * 70, y: CY }; C = { x: C.x + sonra * 70, y: CY }; }
    else { A = { x: A.x - sonra * 90, y: CY }; B = { x: B.x - sonra * 90, y: CY }; C = { x: C.x + sonra * 90, y: CY }; }
  }
  const bagAB = !(etkin && u > 0.5), bagBC = etkin && u > 0.5;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={bitti ? (etkin ? "Etkin çarpışma: AB + C → A + BC" : "Çarpışma etkin değil, tanecikler geri sekti") : "AB ve C çarpışmaya gidiyor"}>
      <text x={170} y={26} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">AB + C → A + BC</text>
      <g>
        {bagAB && <line x1={A.x} x2={B.x} y1={CY} y2={CY} stroke="var(--ink)" strokeWidth={4} />}
        {bagBC && <line x1={B.x} x2={C.x} y1={CY} y2={CY} stroke="var(--ink)" strokeWidth={4} />}
        <circle cx={A.x} cy={A.y} r={14} fill="var(--c1)" />
        <circle cx={B.x} cy={B.y} r={12} fill="#9aa8ba" />
        <circle cx={C.x} cy={C.y} r={13} fill="var(--kimya)" />
        <g fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">
          <text x={A.x} y={A.y + 4}>A</text><text x={B.x} y={B.y + 4}>B</text><text x={C.x} y={C.y + 4}>C</text>
        </g>
      </g>
      {u > 0.45 && u < 0.62 && <circle cx={170} cy={CY} r={26} fill="none" stroke="var(--c4)" strokeWidth={2} strokeDasharray="3 4" />}
      <g fontSize={12} fontWeight={700}>
        <text x={20} y={152} fill="var(--muted)">çarpışma enerjisi: <tspan fill={e >= EA ? "var(--good)" : "var(--bad)"}>{e} kJ</tspan> (Ea = {EA} kJ)</text>
        <text x={20} y={172} fill="var(--muted)">yönelim: <tspan fill={yon ? "var(--good)" : "var(--bad)"}>{yon ? "B ucu C'ye bakıyor" : "A ucu C'ye bakıyor"}</tspan></text>
        {bitti && <text x={20} y={198} fontSize={13} fontWeight={800} fill={etkin ? "var(--good)" : "var(--bad)"}>{etkin ? "Etkin çarpışma: ürün oluştu" : "Geri sekti: ürün yok"}</text>}
      </g>
    </svg>
  );
}

/* ---------- Maxwell–Boltzmann dağılımı ---------- */

const EA_MB = 8;
const mb = (E: number, kT: number) => 2 * Math.sqrt(E / Math.PI) * Math.pow(1 / kT, 1.5) * Math.exp(-E / kT);
const ustu = (kT: number) => { let s = 0; const d = 0.02; for (let E = EA_MB; E < 60; E += d) s += mb(E + d / 2, kT) * d; return s; };

function Maxwell({ v }: SahneProps) {
  const T = v.T ?? 300, kT = T / 200;
  const x0 = 40, x1 = 318, y0 = 34, y1 = 176, Emax = 14, fmax = 0.5;
  const X = (E: number) => x0 + (E / Emax) * (x1 - x0), Y = (f: number) => y1 - Math.min(1, f / fmax) * (y1 - y0);
  const yol = (k: number) => Array.from({ length: 141 }, (_, i) => (i / 140) * Emax).map((E) => `${X(E).toFixed(1)},${Y(mb(E, k)).toFixed(1)}`).join(" ");
  const alan = `M${X(EA_MB)} ${y1} ` + Array.from({ length: 61 }, (_, i) => EA_MB + (i / 60) * (Emax - EA_MB)).map((E) => `L${X(E).toFixed(1)} ${Y(mb(E, kT)).toFixed(1)}`).join(" ") + ` L${X(Emax)} ${y1} Z`;
  const yuzde = ustu(kT) * 100, ref = ustu(300 / 200) * 100;
  return (
    <svg viewBox="0 0 340 212" role="img" aria-label={`${T} K: taneciklerin yüzde ${virgul(yuzde, 1)}'i Ea'yı aşıyor`}>
      <Eksen x0={x0} x1={x1} y0={y0} y1={y1} yAd="tanecik sayısı" xAd="kinetik enerji →" />
      <path d={alan} fill="var(--kimya)" opacity={0.28} />
      {T !== 300 && <polyline points={yol(1.5)} fill="none" stroke="#9aa8ba" strokeWidth={2} strokeDasharray="5 4" />}
      <polyline points={yol(kT)} fill="none" stroke="var(--kimya)" strokeWidth={3} strokeLinejoin="round" />
      <g>
        <line x1={X(EA_MB)} x2={X(EA_MB)} y1={y0 + 14} y2={y1} stroke="var(--c4)" strokeWidth={2} />
        <text x={X(EA_MB) + 5} y={y0 + 24} fontSize={12} fontWeight={800} fill="#b7800d">Ea</text>
      </g>
      <g fontSize={12} fontWeight={800}>
        <text x={x1} y={64} textAnchor="end" fill="var(--ink)">{T} K</text>
        <text x={x1} y={82} textAnchor="end" fill="var(--kimya)">Ea'yı aşan: %{virgul(yuzde, 1)}</text>
        {T !== 300 && <text x={x1} y={100} fontSize={11} textAnchor="end" fill="var(--muted)">300 K: %{virgul(ref, 1)}</text>}
      </g>
      <text x={20} y={204} fontSize={11} fontWeight={600} fill="var(--muted)">{T !== 300 ? "Kesikli eğri 300 K. Ea yerinde kalır." : "Eşik (Ea) yerinde kalır."}</text>
    </svg>
  );
}

/* ---------- temas yüzeyi: parça ve toz mermer ---------- */

function Yuzey({ s, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = oran(t, oynuyor, sure);
  const Vp = 40 * (1 - Math.exp(-1.2 * u)), Vt = 40 * (1 - Math.exp(-7 * u));
  const kaplar = [
    { x: 92, ad: "parça mermer", V: Vp, toz: false },
    { x: 248, ad: "toz mermer", V: Vt, toz: true },
  ];
  const r = rastgele(9);
  const tozlar = Array.from({ length: 26 }, () => ({ dx: (r() - 0.5) * 60, dy: r() * 10 }));
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`CO₂: parça ${Math.round(Vp)} mL, toz ${Math.round(Vt)} mL`}>
      {kaplar.map((k, i) => {
        const kalan = 1 - k.V / 40, R = 6 + (k.V / 40) * 26, kab = u > 0 && k.V < 39.5;
        return (
          <g key={i}>
            <rect x={k.x - 38} y={112} width={76} height={68} fill="#eaf1fb" />
            {k.toz
              ? tozlar.map((p, j) => (j / tozlar.length < kalan ? <circle key={j} cx={k.x + p.dx} cy={170 + p.dy * 0.6} r={2.4} fill="#cfd5dc" stroke="#9aa8ba" strokeWidth={0.6} /> : null))
              : kalan > 0.02 && <rect x={k.x - 16 * Math.sqrt(kalan)} y={176 - 24 * Math.sqrt(kalan)} width={32 * Math.sqrt(kalan)} height={24 * Math.sqrt(kalan)} rx={4} fill="#cfd5dc" stroke="#9aa8ba" />}
            {kab && [0, 1, 2, 3].map((j) => {
              const hiz = k.toz ? 3 : 1, f = (u * hiz * 4 + j * 0.25) % 1;
              return <circle key={j} cx={k.x - 18 + j * 12} cy={168 - f * 50} r={2.6} fill="none" stroke="var(--c1)" strokeWidth={1.2} />;
            })}
            <path d={`M${k.x - 38} 96 L${k.x - 38} 180 L${k.x + 38} 180 L${k.x + 38} 96`} fill="none" stroke="var(--ink)" strokeWidth={2} />
            <path d={`M${k.x - 10} 96 L${k.x - 10} 84 L${k.x + 10} 84 L${k.x + 10} 96`} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
            <ellipse cx={k.x} cy={84 - R} rx={R * 0.85} ry={R} fill="var(--c1)" opacity={0.25} stroke="var(--c1)" strokeWidth={1.5} />
            <text x={k.x} y={200} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{k.ad}</text>
            <text x={k.x} y={216} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--c1)">CO₂: {Math.round(k.V)} mL</text>
          </g>
        );
      })}
      <text x={170} y={16} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">eşit kütle mermer + aynı HCl çözeltisi</text>
    </svg>
  );
}

/* ---------- katalizör: Ea düşer, ΔH aynı ---------- */

function Katalizor({ v }: SahneProps) {
  const kat = (v.k ?? 0) === 1;
  const Y = (H: number) => 190 - ((H - 80) / 260) * 150;
  const G = 200, U = 100, tepe = 320, tepeK = 260;
  const yG = Y(G), yU = Y(U), yT = Y(tepe), yK = Y(tepeK);
  const egri = (yt: number) => `M40 ${yG} L96 ${yG} C132 ${yG} 132 ${yt} 160 ${yt} C188 ${yt} 188 ${yU} 224 ${yU} L284 ${yU}`;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={kat ? "Katalizörle: Ea ileri 60 kJ, ΔH −100 kJ" : "Katalizörsüz: Ea ileri 120 kJ, ΔH −100 kJ"}>
      <line x1={28} x2={28} y1={24} y2={196} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={28} x2={300} y1={196} y2={196} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={34} y={22} fontSize={11} fontWeight={700} fill="var(--muted)">potansiyel enerji</text>
      <text x={300} y={212} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">tepkimenin ilerleyişi →</text>
      <path d={egri(yT)} fill="none" stroke={kat ? "#9aa8ba" : "var(--kimya)"} strokeWidth={kat ? 2 : 3} strokeDasharray={kat ? "5 4" : undefined} />
      {kat && <path d={egri(yK)} fill="none" stroke="var(--c3)" strokeWidth={3} />}
      <g>
        <line x1={96} x2={160} y1={yG} y2={yG} stroke="var(--muted)" strokeDasharray="4 4" />
        <line x1={160} x2={160} y1={yG} y2={(kat ? yK : yT) + 3} stroke="var(--c4)" strokeWidth={2} />
        <text x={154} y={yG - 6} fontSize={11.5} fontWeight={800} textAnchor="end" fill="#b7800d">Ea</text>
      </g>
      <g>
        <line x1={224} x2={306} y1={yG} y2={yG} stroke="var(--muted)" strokeDasharray="4 4" opacity={0.6} />
        <line x1={300} x2={300} y1={yG} y2={yU - 8} stroke="var(--c1)" strokeWidth={2.2} />
        <path d={`M300 ${yU} L295 ${yU - 9} L305 ${yU - 9} Z`} fill="var(--c1)" />
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <text x={62} y={yG - 8} textAnchor="middle" fill="var(--ink)">girenler</text>
        <text x={252} y={yU - 8} textAnchor="middle" fill="var(--ink)">ürünler</text>
      </g>
      <g fontSize={12} fontWeight={800}>
        <text x={196} y={36} fill="var(--ink)">Ea,ileri = {kat ? 60 : 120} kJ</text>
        <text x={196} y={54} fill="var(--ink)">Ea,geri = {kat ? 160 : 220} kJ</text>
        <text x={196} y={72} fill="var(--c1)">ΔH = −100 kJ</text>
        {kat && <text x={196} y={90} fontSize={11} fill="var(--c3)">katalizörlü yol</text>}
      </g>
    </svg>
  );
}

/* ---------- deneyden derece ---------- */

function Derece({ v }: SahneProps) {
  const y = (v.y ?? 1) / 10, x = 0.1, k = 2;
  const hiz = k * x * y * y, h0 = k * x * 0.01, kat = hiz / h0;
  const H = (h: number) => Math.min(120, (h / (h0 * 16)) * 120);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`[Y] ${virgul(y, 1)} M: hız ${virgul(kat, 0)} kat`}>
      <text x={170} y={24} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">hız = k[X]ˣ[Y]ʸ</text>
      <g fontSize={12} fontWeight={700}>
        <text x={20} y={56} fill="var(--muted)">deney 1</text>
        <text x={20} y={74} fill="var(--ink)">[X] = 0,1 M, [Y] = 0,1 M</text>
        <text x={20} y={92} fill="var(--ink)">hız = 0,002 M/s</text>
        <text x={20} y={126} fill="var(--muted)">deney 2</text>
        <text x={20} y={144} fill="var(--ink)">[X] = 0,1 M, [Y] = <tspan fill="var(--kimya)">{virgul(y, 1)} M</tspan></text>
        <text x={20} y={162} fill="var(--ink)">hız = {virgul(hiz, 3)} M/s</text>
        <text x={20} y={194} fontSize={13} fontWeight={800} fill="var(--kimya)">[Y] {virgul(y / 0.1, 0)} kat → hız {virgul(kat, 0)} kat</text>
      </g>
      <g>
        <rect x={232} y={186 - H(h0)} width={30} height={H(h0)} rx={3} fill="#9aa8ba" />
        <rect x={278} y={186 - H(hiz)} width={30} height={H(hiz)} rx={3} fill="var(--kimya)" />
        <line x1={222} x2={318} y1={186} y2={186} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={247} y={202} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">1</text>
        <text x={293} y={202} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">2</text>
      </g>
    </svg>
  );
}

/* ---------- dinamik denge: N₂O₄ ⇌ 2NO₂ ---------- */

/** Kaptaki tanecikler: n24 tane N₂O₄ (iki daire), n2 tane NO₂ (kahverengi tek daire). */
function Tanecikler({ n24, n2, cx, cy, w, h, tohum }: { n24: number; n2: number; cx: number; cy: number; w: number; h: number; tohum: number }) {
  const r = rastgele(tohum);
  // Üst üste binmesin diye birbirinden uzak yerler aranır (yer kalmazsa son deneme kullanılır).
  const dolu: { x: number; y: number }[] = [];
  const yer = () => {
    let p = { x: 0, y: 0 };
    for (let k = 0; k < 40; k++) {
      p = { x: cx - w / 2 + 10 + r() * (w - 20), y: cy - h / 2 + 10 + r() * (h - 20) };
      if (dolu.every((q) => Math.abs(q.x - p.x) > 15 || Math.abs(q.y - p.y) > 10)) break;
    }
    dolu.push(p);
    return p;
  };
  return (
    <g>
      {Array.from({ length: n24 }, (_, i) => { const p = yer(); return <g key={`a${i}`}><circle cx={p.x - 3.5} cy={p.y} r={4} fill="#d9dee5" stroke="#9aa8ba" /><circle cx={p.x + 3.5} cy={p.y} r={4} fill="#d9dee5" stroke="#9aa8ba" /></g>; })}
      {Array.from({ length: n2 }, (_, i) => { const p = yer(); return <circle key={`b${i}`} cx={p.x} cy={p.y} r={4.5} fill={KAHVE} />; })}
    </g>
  );
}

function Denge({ s, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 6), u = oran(t, oynuyor, sure);
  const d = (uu: number) => 4 * (1 - Math.exp(-6 * uu));
  const ileri = (uu: number) => 0.1 * (10 - d(uu)), geri = (uu: number) => (0.1 * 6 / 64) * (2 * d(uu)) ** 2;
  const dd = Math.round(d(u));
  const x0 = 170, x1 = 322, y0 = 44, y1 = 170;
  const X = (uu: number) => x0 + uu * (x1 - x0), Y = (h: number) => y1 - h * (y1 - y0 - 10);
  const yol = (f: (uu: number) => number) => Array.from({ length: 41 }, (_, i) => (i / 40) * u).map((uu) => `${X(uu).toFixed(1)},${Y(f(uu)).toFixed(1)}`).join(" ");
  const dengede = u > 0.62;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={dengede ? "Denge: ileri hız geri hıza eşit" : "N₂O₄ ayrışıyor"}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">N₂O₄ ⇌ 2NO₂</text>
      <rect x={20} y={44} width={130} height={126} rx={10} fill={KAHVE} opacity={0.06 + (dd / 4) * 0.22} />
      <Tanecikler n24={10 - dd} n2={2 * dd} cx={85} cy={107} w={130} h={126} tohum={4} />
      <rect x={20} y={44} width={130} height={126} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={85} y={188} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{10 - dd} N₂O₄ · {2 * dd} NO₂</text>
      <Eksen x0={x0} x1={x1} y0={y0} y1={y1} yAd="hız" xAd="zaman" />
      {u > 0 && <polyline points={yol(ileri)} fill="none" stroke="var(--c1)" strokeWidth={2.6} />}
      {u > 0 && <polyline points={yol(geri)} fill="none" stroke="var(--kimya)" strokeWidth={2.6} />}
      <g fontSize={11.5} fontWeight={800}>
        <text x={x1} y={64} textAnchor="end" fill="var(--c1)">ileri hız</text>
        <text x={x1} y={80} textAnchor="end" fill="var(--kimya)">geri hız</text>
      </g>
      {dengede && <text x={246} y={206} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--good)">Denge: ileri = geri</text>}
    </svg>
  );
}

/* ---------- BDD tablosu: H₂ + I₂ ⇌ 2HI ---------- */

function BDD({ v }: SahneProps) {
  const hi = (v.hi ?? 10) / 10, x = hi / 2, kalan = 1 - x;
  const Kc = (hi * hi) / (kalan * kalan);
  const sut = [74, 152, 230];
  const tamam = Math.abs(Kc - 64) < 0.01;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Dengede ${virgul(hi, 1)} mol HI: Kc ${virgul(Kc, 1)}`}>
      <g fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        <text x={sut[0] + 40} y={26}>H₂</text><text x={sut[1] + 40} y={26}>I₂</text><text x={sut[2] + 40} y={26}>2HI</text>
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={14} y={54}>Başl.</text><text x={14} y={84}>Değ.</text><text x={14} y={114}>Denge</text>
      </g>
      <g>
        {[0, 1, 2].map((c) => (
          <g key={c} fontSize={12.5} fontWeight={700} textAnchor="middle">
            <text x={sut[c] + 40} y={54} fill="var(--ink)">{c < 2 ? "1" : "0"}</text>
            <text x={sut[c] + 40} y={84} fill={c < 2 ? "var(--c2)" : "var(--c3)"}>{c < 2 ? `−${virgul(x)}` : `+${virgul(hi, 1)}`}</text>
            <text x={sut[c] + 40} y={114} fill="var(--ink)" fontWeight={800}>{c < 2 ? virgul(kalan) : virgul(hi, 1)}</text>
          </g>
        ))}
        <line x1={14} x2={326} y1={64} y2={64} stroke="var(--line)" />
        <line x1={14} x2={326} y1={94} y2={94} stroke="var(--line)" />
      </g>
      <g>
        {[{ h: kalan, r: "#9aa8ba" }, { h: kalan, r: "var(--c5)" }, { h: hi / 2, r: "var(--kimya)" }].map((b, i) => (
          <rect key={i} x={sut[i] + 22} y={172 - b.h * 40} width={36} height={Math.max(1, b.h * 40)} rx={3} fill={b.r} />
        ))}
        <line x1={60} x2={326} y1={172} y2={172} stroke="var(--ink)" strokeWidth={1.2} />
      </g>
      <text x={20} y={152} fontSize={10.5} fontWeight={600} fill="var(--muted)">1 L kap</text>
      <text x={170} y={200} fontSize={13.5} fontWeight={800} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--ink)"}>
        Kc = [HI]² / ([H₂][I₂]) = {Kc >= 100 ? Math.round(Kc) : virgul(Kc, 1)}
      </text>
    </svg>
  );
}

/* ---------- tepkime oranı Q ---------- */

function Qk({ v }: SahneProps) {
  const hi = (v.hi ?? 2) / 10, Q = (hi * hi) / 0.01, K = 64;
  const L = (q: number) => 40 + ((Math.log10(Math.max(q, 0.1)) + 1) / 4) * 260; // 0,1 … 1000
  const yon = Math.abs(Q - K) < 0.01 ? "denge" : Q < K ? "ileri" : "geri";
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={`Q = ${virgul(Q, 1)}, K = 64: ${yon}`}>
      <text x={170} y={24} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">H₂ + I₂ ⇌ 2HI   (Kc = 64)</text>
      <g fontSize={12} fontWeight={700} fill="var(--muted)">
        <text x={20} y={54}>[H₂] = [I₂] = 0,1 M</text>
        <text x={20} y={72}>[HI] = <tspan fill="var(--kimya)">{virgul(hi, 1)} M</tspan></text>
        <text x={20} y={94} fill="var(--ink)" fontWeight={800}>Q = {virgul(hi, 1)}² / (0,1 · 0,1) = {virgul(Q, 1)}</text>
      </g>
      <g>
        <line x1={40} x2={300} y1={140} y2={140} stroke="var(--line-2)" strokeWidth={4} strokeLinecap="round" />
        {[0.1, 1, 10, 100, 1000].map((q) => <text key={q} x={L(q)} y={160} fontSize={10} textAnchor="middle" fill="var(--muted)">{virgul(q, 1)}</text>)}
        <line x1={L(K)} x2={L(K)} y1={126} y2={154} stroke="var(--ink)" strokeWidth={2} />
        <text x={L(K)} y={120} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">K</text>
        <circle cx={L(Q)} cy={140} r={7} fill="var(--kimya)" />
      </g>
      <text x={170} y={190} fontSize={13} fontWeight={800} textAnchor="middle" fill={yon === "denge" ? "var(--good)" : "var(--c1)"}>
        {yon === "denge" ? "Q = K: sistem dengede" : yon === "ileri" ? "Q < K: tepkime ileri yürür →" : "← Q > K: tepkime geri yürür"}
      </text>
    </svg>
  );
}

/* ---------- Le Chatelier: hacmi küçültmek ---------- */

function Hacim({ s, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = oran(t, oynuyor, sure);
  const sik = yumusak(Math.min(1, u / 0.4)), kay = yumusak(Math.max(0, (u - 0.45) / 0.55));
  const w = 200 - sik * 100;
  const d = Math.round(4 - kay * 2); // ayrışmış N₂O₄ sayısı: 4 → 2
  const yogun = (2 * d) / (w / 100);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={u >= 1 ? "Hacim yarıya indi, denge N₂O₄ tarafına kaydı" : "Şırıngadaki N₂O₄ ve NO₂ dengede"}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">N₂O₄ ⇌ 2NO₂</text>
      <text x={320} y={24} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--muted)">1 mol gaz ⇌ 2 mol gaz</text>
      <rect x={40} y={60} width={w} height={96} fill={KAHVE} opacity={Math.min(0.4, 0.04 + yogun * 0.035)} />
      <Tanecikler n24={10 - d} n2={2 * d} cx={40 + w / 2} cy={108} w={w} h={96} tohum={11} />
      <path d={`M40 60 L40 156 M40 60 L250 60 M40 156 L250 156`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g>
        <rect x={40 + w} y={56} width={8} height={104} rx={2} fill="var(--ink)" />
        <rect x={48 + w} y={102} width={250 - w} height={12} fill="#9aa8ba" />
        <rect x={296} y={84} width={10} height={48} rx={3} fill="var(--ink)" />
      </g>
      <text x={20} y={186} fontSize={12} fontWeight={700} fill="var(--muted)">{10 - d} N₂O₄ · {2 * d} NO₂ · toplam {10 + d} tanecik</text>
      {u >= 1 && <text x={20} y={206} fontSize={12.5} fontWeight={800} fill="var(--c1)">Denge sola kaydı: tanecik sayısı azaldı</text>}
    </svg>
  );
}

/* ---------- Le Chatelier: sıcaklık ---------- */

const ayrisma = (T: number) => 1 / (1 + Math.exp(-(T - 45) / 15));
function Isi({ v }: SahneProps) {
  const T = v.T ?? 20, f = ayrisma(T), d = Math.round(10 * f);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${T} °C: N₂O₄'ün yüzde ${Math.round(f * 100)}'ü ayrışmış`}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">N₂O₄ + ısı ⇌ 2NO₂</text>
      <text x={320} y={24} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--c2)">ileri yön endotermik</text>
      <g>
        <path d="M70 56 L70 76 Q30 96 30 140 Q30 188 92 188 Q154 188 154 140 Q154 96 114 76 L114 56 Z" fill={KAHVE} opacity={0.05 + f * 0.4} />
        <Tanecikler n24={10 - d} n2={2 * d} cx={92} cy={144} w={112} h={80} tohum={21} />
        <path d="M70 56 L70 76 Q30 96 30 140 Q30 188 92 188 Q154 188 154 140 Q154 96 114 76 L114 56" fill="none" stroke="var(--ink)" strokeWidth={2} />
      </g>
      <g fontSize={12.5} fontWeight={800}>
        <text x={186} y={80} fill="var(--ink)">{T} °C</text>
        <text x={186} y={104} fill={KAHVE}>N₂O₄'ün %{Math.round(f * 100)}'ü ayrıştı</text>
        <text x={186} y={124} fontSize={11.5} fill="var(--muted)">{10 - d} N₂O₄ · {2 * d} NO₂</text>
        <rect x={186} y={140} width={130} height={12} rx={6} fill="var(--line)" />
        <rect x={186} y={140} width={Math.max(6, 130 * f)} height={12} rx={6} fill={KAHVE} />
      </g>
      <text x={20} y={206} fontSize={11} fontWeight={600} fill="var(--muted)">Renk ve yüzdeler temsilîdir.</text>
    </svg>
  );
}

/* ---------- katalizör ve denge ---------- */

function DengeKat({ v }: SahneProps) {
  const kat = (v.k ?? 0) === 1;
  const x0 = 46, x1 = 314, y0 = 40, y1 = 176;
  const X = (tt: number) => x0 + (tt / 10) * (x1 - x0), Y = (c: number) => y1 - c * (y1 - y0 - 20);
  const yol = (k: number) => Array.from({ length: 61 }, (_, i) => (i / 60) * 10).map((tt) => `${X(tt).toFixed(1)},${Y(0.8 * (1 - Math.exp(-k * tt))).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={kat ? "Katalizörle dengeye daha çabuk ulaşılıyor, NO₂ miktarı aynı" : "Katalizörsüz: dengeye yavaş ulaşılıyor"}>
      <Eksen x0={x0} x1={x1} y0={y0} y1={y1} yAd="[NO₂]" xAd="zaman →" />
      <line x1={x0} x2={x1} y1={Y(0.8)} y2={Y(0.8)} stroke="var(--muted)" strokeDasharray="4 4" />
      <text x={x1} y={Y(0.8) - 6} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">denge derişimi</text>
      <polyline points={yol(0.45)} fill="none" stroke={kat ? "#9aa8ba" : KAHVE} strokeWidth={kat ? 2 : 3} strokeDasharray={kat ? "5 4" : undefined} />
      {kat && <polyline points={yol(1.8)} fill="none" stroke="var(--c3)" strokeWidth={3} />}
      <g fontSize={12} fontWeight={800}>
        <text x={x0 + 120} y={y1 - 20} fill={kat ? "#9aa8ba" : KAHVE}>katalizörsüz</text>
        {kat && <text x={x0 + 10} y={Y(0.8) - 8} fill="var(--c3)">katalizörlü</text>}
      </g>
    </svg>
  );
}

/* ---------- Haber yöntemi: verim ve hız ---------- */

function Haber({ v }: SahneProps) {
  const P = v.P ?? 100, T = v.T ?? 450;
  const verim = kes(0.12 + 0.55 * ((P - 50) / 250) - 0.5 * ((T - 300) / 300) + 0.25);
  const hiz = kes(0.1 + 0.85 * ((T - 300) / 300));
  const cubuk = (y: number, ad: string, deger: number, renk: string) => (
    <g>
      <text x={20} y={y + 12} fontSize={12.5} fontWeight={800} fill="var(--ink)">{ad}</text>
      <rect x={110} y={y} width={200} height={16} rx={8} fill="var(--line)" />
      <rect x={110} y={y} width={Math.max(8, 200 * deger)} height={16} rx={8} fill={renk} />
      <text x={314} y={y + 32} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">{deger > 0.66 ? "yüksek" : deger > 0.33 ? "orta" : "düşük"}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={`${P} atm, ${T} °C`}>
      <text x={170} y={24} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">N₂ + 3H₂ ⇌ 2NH₃ + ısı</text>
      <text x={170} y={42} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">4 mol gaz → 2 mol gaz · ileri yön ekzotermik</text>
      {cubuk(64, "NH₃ verimi", verim, "var(--kimya)")}
      {cubuk(114, "tepkime hızı", hiz, "var(--c1)")}
      <text x={20} y={186} fontSize={11} fontWeight={600} fill="var(--muted)">Çubuklar yalnızca eğilimi gösterir.</text>
    </svg>
  );
}

export const KIMYA9: Record<string, SahneKaydi> = {
  "kim9-egri": { C: Egri },
  "kim9-katsayi": { C: Katsayi },
  "kim9-carpisma": {
    C: Carpisma,
    geri: (v) => {
      const e = v.e ?? 0, yon = v.yon === 1;
      if (e < EA && !yon) return { baslik: "Geri sekti", metin: `İki şart da eksik: enerji ${EA} kJ'ün altında ve A ucu C'ye bakıyor.` };
      if (e < EA) return { baslik: "Enerji yetmedi", metin: `Yönelim uygun, ama çarpışma enerjisi Ea'nın (${EA} kJ) altında. Enerjiyi artır.` };
      if (!yon) return { baslik: "Yönelim uygun değil", metin: "Enerji yeterli, ama C molekülün yanlış ucuna çarptı. Yönelimi düzelt." };
      return null;
    },
  },
  "kim9-maxwell": { C: Maxwell },
  "kim9-yuzey": { C: Yuzey },
  "kim9-katalizor": { C: Katalizor },
  "kim9-derece": { C: Derece },
  "kim9-denge": { C: Denge },
  "kim9-bdd": { C: BDD },
  "kim9-q": { C: Qk },
  "kim9-hacim": { C: Hacim },
  "kim9-isi": { C: Isi },
  "kim9-dengekat": { C: DengeKat },
  "kim9-haber": { C: Haber },
};
