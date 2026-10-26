"use client";
// Kimya sahneleri (maddenin halleri, karışımlar): kristal ve amorf katının erimesi, viskozite, buhar basıncı,
// dış basınç ve kaynama noktası, hâl değişimlerinin enerjisi, CO₂ faz diyagramı; Tyndall etkisi,
// benzer benzeri çözer, çözünürlük eğrisi ve kristallenme, karışıma uygun ayırma yöntemi.
import { useMemo } from "react";
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const eksi = (x: number) => `${x < 0 ? "−" : ""}${Math.abs(x)}`;
const virgul = (x: number, b = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const SU = "#d6e8fb";
const BAL = "#e8a91c";
const YAG = "#f3d36b";

/** (x, y) noktalarından doğrusal ara değer. */
function egri(noktalar: [number, number][], x: number) {
  if (x <= noktalar[0][0]) return noktalar[0][1];
  for (let i = 1; i < noktalar.length; i++) {
    const [x0, y0] = noktalar[i - 1], [x1, y1] = noktalar[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return noktalar[noktalar.length - 1][1];
}

/* ---------- kristal ve amorf katı ısıtılıyor ---------- */

// Zaman (0..1) → grafik yüksekliği (0..1). Tuz erirken sıcaklık sabit; cam düzgünce ısınır.
const tuzT = (u: number) => (u < 0.35 ? (u / 0.35) * 0.6 : u < 0.7 ? 0.6 : 0.6 + ((u - 0.7) / 0.3) * 0.3);
const camT = (u: number) => u * 0.9;

function MiniGrafik({ x, f, u, renk, cizgi }: { x: number; f: (u: number) => number; u: number; renk: string; cizgi?: string }) {
  const W = 130, Y0 = 50, Y1 = 128;
  const N = 40, son = Math.round(u * N);
  const d = Array.from({ length: son + 1 }, (_, i) => `${i ? "L" : "M"}${(x + (i / N) * W).toFixed(1)} ${(Y1 - f(i / N) * (Y1 - Y0)).toFixed(1)}`).join(" ");
  return (
    <g>
      <line x1={x} x2={x + W} y1={Y1} y2={Y1} stroke="var(--ink)" strokeWidth={1.3} />
      <line x1={x} x2={x} y1={Y0 - 6} y2={Y1} stroke="var(--ink)" strokeWidth={1.3} />
      <text x={x + 4} y={Y0 - 8} fontSize={11} fontWeight={700} fill="var(--ink)">T</text>
      <text x={x + W} y={Y1 + 14} fontSize={11} textAnchor="end" fill="var(--muted)">zaman</text>
      {cizgi && (
        <g>
          <line x1={x} x2={x + W} y1={Y1 - 0.6 * (Y1 - Y0)} y2={Y1 - 0.6 * (Y1 - Y0)} stroke="var(--line-2)" strokeDasharray="4 4" />
          <text x={x + W} y={Y1 - 0.6 * (Y1 - Y0) + 14} fontSize={11} textAnchor="end" fill="var(--muted)">{cizgi}</text>
        </g>
      )}
      {son > 0 && <path d={d} fill="none" stroke={renk} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
}

function Erime({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  // Tuz: plato boyunca küp küçülür, sıvı birikir. Cam: çubuk giderek sarkar.
  const eri = kes((u - 0.35) / 0.35);
  const kup = 34 * (1 - eri);
  const sarkma = yumusak(kes((u - 0.15) / 0.85)) * 18;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Tuz kristali ve cam ısıtılıyor">
      <g fontSize={13} fontWeight={800} fill="var(--ink)">
        <text x={20} y={22}>Tuz <tspan fontWeight={600} fill="var(--muted)">(kristal)</tspan></text>
        <text x={186} y={22}>Cam <tspan fontWeight={600} fill="var(--muted)">(amorf)</tspan></text>
      </g>
      <MiniGrafik x={24} f={tuzT} u={u} renk="var(--kimya)" cizgi={u > 0 ? "801 °C" : undefined} />
      <MiniGrafik x={190} f={camT} u={u} renk="var(--c1)" />
      <g>
        <line x1={20} x2={150} y1={208} y2={208} stroke="var(--line-2)" strokeWidth={2} />
        {kup > 1 && <rect x={85 - kup / 2} y={208 - kup} width={kup} height={kup} rx={2} fill="#fff" stroke="var(--kimya)" strokeWidth={1.8} />}
        {eri > 0 && <ellipse cx={85} cy={207} rx={14 + 40 * eri} ry={2 + 3 * eri} fill="var(--kimya)" opacity={0.35} />}
      </g>
      <g>
        <line x1={186} x2={320} y1={208} y2={208} stroke="var(--line-2)" strokeWidth={2} />
        <rect x={196} y={176} width={8} height={32} fill="var(--line-2)" />
        <rect x={302} y={176} width={8} height={32} fill="var(--line-2)" />
        <path d={`M196 172 Q253 ${172 + sarkma * 2} 310 172`} fill="none" stroke="var(--c1)" strokeWidth={8} strokeLinecap="round" opacity={0.75} />
      </g>
      <g fontSize={11.5} fontWeight={600} textAnchor="middle" opacity={kes((u - 0.75) * 5)}>
        <text x={85} y={228} fill="var(--kimya)">birden erir</text>
        <text x={253} y={228} fill="var(--c1)">yavaş yavaş yumuşar</text>
      </g>
    </svg>
  );
}

/* ---------- viskozite: bal ---------- */

// Sıcaklığa göre 10 saniyede dolan oran (1 = bardak dolar). 50 °C ve üstünde dolar.
const balAkis = (T: number) => Math.min(1.3, 0.121 * Math.exp((T - 10) * 0.053));

function Bal({ s, v, t, oynuyor }: SahneProps) {
  const T = v.T ?? 20;
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const akis = balAkis(T);
  const dolu = Math.max(0, Math.min(1, akis * u));
  const akiyor = oynuyor && u < 1 && dolu < 1;
  const GX = 170, G0 = 120, G1 = 206, GW = 76;
  const sv = G1 - dolu * (G1 - G0 - 6);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${T} derecede bal akıyor`}>
      <text x={20} y={26} fontSize={13} fontWeight={800} fill="var(--ink)">Bal: {T} °C</text>
      <text x={320} y={26} fontSize={13} fontWeight={700} textAnchor="end" fill="var(--muted)">süre: {Math.round(u * 10)} / 10 s</text>
      <g>
        <path d={`M${GX - 60} 40 L${GX + 60} 40 L${GX + 8} 92 L${GX + 8} 104 L${GX - 8} 104 L${GX - 8} 92 Z`} fill={BAL} opacity={0.25 + 0.6 * (1 - dolu)} />
        <path d={`M${GX - 60} 40 L${GX - 8} 92 L${GX - 8} 104 M${GX + 60} 40 L${GX + 8} 92 L${GX + 8} 104`} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      </g>
      {akiyor && <rect x={GX - 1.5 - akis * 3} y={104} width={3 + akis * 6} height={sv - 104} fill={BAL} />}
      <g>
        <rect x={GX - GW / 2} y={sv} width={GW} height={G1 - sv} fill={BAL} />
        <path d={`M${GX - GW / 2} ${G0} L${GX - GW / 2} ${G1} L${GX + GW / 2} ${G1} L${GX + GW / 2} ${G0}`} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      </g>
      <g fontSize={12} fill="var(--muted)" fontWeight={600}>
        <text x={20} y={150}>akmazlık</text>
        <rect x={20} y={158} width={90} height={10} rx={5} fill="var(--line)" />
        <rect x={20} y={158} width={Math.max(6, 90 * (1 - (T - 10) / 55))} height={10} rx={5} fill="var(--c2)" />
        <text x={20} y={190}>{T < 30 ? "çok ağır akar" : T < 50 ? "daha kolay akar" : "rahat akar"}</text>
      </g>
      {u >= 1 && (
        <text x={170} y={228} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={dolu >= 1 ? "var(--good)" : "var(--kimya)"}>
          {dolu >= 1 ? "Bardak 10 saniyede doldu." : `Bardağın ancak %${Math.round(dolu * 100)}'i doldu.`}
        </text>
      )}
    </svg>
  );
}

/* ---------- buhar basıncı ---------- */

// Suyun buhar basıncı (mmHg).
const SU_BB: [number, number][] = [[20, 17.5], [30, 31.8], [40, 55.3], [50, 92.5], [60, 149.4], [70, 233.7], [80, 355.1], [90, 525.8], [100, 760]];

function BuharBasinci({ v }: SahneProps) {
  const T = v.T ?? 40, m = v.m ?? 1;
  const P = egri(SU_BB, T);
  const sv = 196 - m * 28;
  const n = Math.round(4 + 16 * (Math.log(P / 17.5) / Math.log(760 / 17.5)));
  const nokta = useMemo(() => { const r = rastgele(17); return Array.from({ length: 20 }, () => [r(), r()]); }, []);
  const bar = 196 - (P / 760) * 150;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kapalı kapta su, ${T} derece, buhar basıncı ${Math.round(P)} mmHg`}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Kapalı kap · {T} °C</text>
      <g>
        <rect x={40} y={sv} width={140} height={196 - sv} fill={SU} />
        <path d="M40 44 L40 196 L180 196 L180 44 Z" fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round" />
        <line x1={34} x2={186} y1={44} y2={44} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      </g>
      <g>
        {nokta.slice(0, n).map(([a, b], i) => <circle key={i} cx={50 + a * 120} cy={54 + b * (sv - 66)} r={4} fill="var(--c1)" />)}
      </g>
      <g>
        <rect x={246} y={46} width={26} height={150} rx={6} fill="var(--line)" />
        <rect x={246} y={bar} width={26} height={196 - bar} rx={6} fill="var(--kimya)" />
        <text x={259} y={216} fontSize={11.5} textAnchor="middle" fill="var(--muted)">buhar basıncı</text>
        <text x={280} y={Math.max(60, bar + 5)} fontSize={14} fontWeight={800} fill="var(--ink)">{Math.round(P)}</text>
        <text x={280} y={Math.max(60, bar + 5) + 15} fontSize={11} fill="var(--muted)">mmHg</text>
      </g>
      <text x={110} y={216} fontSize={11.5} textAnchor="middle" fill="var(--muted)">sıvı: {["az", "orta", "çok"][m - 1]}</text>
    </svg>
  );
}

/* ---------- dış basınç ve kaynama noktası ---------- */

/** Suyun kaynama noktası (°C), dış basınç atm cinsinden (Antoine denklemi). */
function kaynama(atm: number) {
  const mm = Math.log10(atm * 760);
  const T1 = 1730.63 / (8.07131 - mm) - 233.426;
  return T1 <= 100 ? T1 : 1810.94 / (8.14019 - mm) - 244.485;
}
const yerAdi = (p: number) =>
  p <= 3 ? "Everest zirvesi" : p <= 5 ? "yüksek dağ (≈ 5500 m)" : p <= 7 ? "dağ (≈ 3000 m)" : p < 10 ? "yayla" : p === 10 ? "deniz seviyesi" : p < 20 ? "kapalı kap" : "düdüklü tencere";

function KaynamaNoktasi({ v }: SahneProps) {
  const p = v.p ?? 10;
  const Tb = kaynama(p / 10);
  const kab = useMemo(() => { const r = rastgele(5); return Array.from({ length: 9 }, () => [r(), r(), r()]); }, []);
  const th = 196 - ((Tb - 50) / 80) * 140;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Dış basınç ${virgul(p / 10)} atm, su ${Math.round(Tb)} derecede kaynar`}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Dış basınç: {virgul(p / 10)} atm</text>
      <text x={20} y={42} fontSize={12} fontWeight={600} fill="var(--muted)">{yerAdi(p)}</text>
      <g>
        <rect x={40} y={98} width={140} height={84} fill={SU} />
        <path d="M34 70 L40 70 L40 182 Q40 192 50 192 L170 192 Q180 192 180 182 L180 70 L186 70" fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round" />
        {kab.map(([a, b, c], i) => <circle key={i} cx={52 + a * 116} cy={110 + b * 64} r={3 + c * 3} fill="#fff" stroke="var(--c1)" strokeWidth={1.2} />)}
      </g>
      <g>
        {[0, 1, 2].map((i) => <path key={i} d={`M${82 + i * 28} 214 q-7 -9 0 -16 q7 9 0 16`} fill="var(--c2)" />)}
      </g>
      <g>
        <rect x={246} y={56} width={14} height={146} rx={7} fill="#fff" stroke="var(--line-2)" strokeWidth={1.6} />
        <circle cx={253} cy={206} r={11} fill="var(--kimya)" />
        <rect x={250} y={th} width={6} height={206 - th} fill="var(--kimya)" />
        {[60, 80, 100, 120].map((d) => (
          <g key={d}>
            <line x1={262} x2={268} y1={196 - ((d - 50) / 80) * 140} y2={196 - ((d - 50) / 80) * 140} stroke="var(--muted)" />
            <text x={272} y={200 - ((d - 50) / 80) * 140} fontSize={11} fill="var(--muted)">{d}</text>
          </g>
        ))}
      </g>
      <text x={110} y={60} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--kimya)">kaynar: {Math.round(Tb)} °C</text>
    </svg>
  );
}

/* ---------- hâl değişimleri ve enerji ---------- */

type Degisim = { ad: string; a: 0 | 1 | 2; b: 0 | 1 | 2; alir: boolean; ornek: string };
const HALLER = ["katı", "sıvı", "gaz"];
const DEGISIMLER: Degisim[] = [
  { ad: "Erime", a: 0, b: 1, alir: true, ornek: "buz eriyor" },
  { ad: "Donma", a: 1, b: 0, alir: false, ornek: "su donuyor" },
  { ad: "Buharlaşma", a: 1, b: 2, alir: true, ornek: "ter buharlaşıyor" },
  { ad: "Yoğuşma", a: 2, b: 1, alir: false, ornek: "aynada buğu" },
  { ad: "Süblimleşme", a: 0, b: 2, alir: true, ornek: "naftalin, kuru buz" },
  { ad: "Kırağılaşma", a: 2, b: 0, alir: false, ornek: "camda kırağı" },
];
const HAL_YER: [number, number][] = [[52, 186], [288, 186], [170, 44]];

function HalKutu({ x, y, hal }: { x: number; y: number; hal: number }) {
  const r = rastgele(3 + hal);
  const nokta = Array.from({ length: 6 }, (_, i) =>
    hal === 0 ? [x - 12 + (i % 3) * 12, y - 4 + Math.floor(i / 3) * 10] : hal === 1 ? [x - 14 + (i % 3) * 13 + r() * 4, y - 2 + Math.floor(i / 3) * 9 + r() * 3] : [x - 18 + r() * 36, y - 12 + r() * 26],
  );
  return (
    <g>
      <rect x={x - 26} y={y - 18} width={52} height={36} rx={8} fill="#fff" stroke="var(--line-2)" strokeWidth={1.5} />
      {nokta.map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3.6} fill="var(--c1)" />)}
      <text x={x} y={hal === 2 ? y - 24 : y + 34} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--ink)">{HALLER[hal]}</text>
    </g>
  );
}

function HalDegisim({ v }: SahneProps) {
  const d = DEGISIMLER[(v.d ?? 1) - 1];
  const ok = (D: Degisim, sec: boolean) => {
    const [x1, y1] = HAL_YER[D.a], [x2, y2] = HAL_YER[D.b];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = -dy / L, ny = dx / L, k = 7; // gidiş ve dönüş okları yan yana
    const ax = x1 + (dx / L) * 36 + nx * k, ay = y1 + (dy / L) * 30 + ny * k;
    const bx = x2 - (dx / L) * 36 + nx * k, by = y2 - (dy / L) * 30 + ny * k;
    const renk = sec ? (D.alir ? "var(--c2)" : "var(--c1)") : "var(--line-2)";
    const ux = (bx - ax) / Math.hypot(bx - ax, by - ay), uy = (by - ay) / Math.hypot(bx - ax, by - ay);
    return (
      <g key={D.ad}>
        <line x1={ax} y1={ay} x2={bx - ux * 8} y2={by - uy * 8} stroke={renk} strokeWidth={sec ? 3 : 1.8} strokeLinecap="round" />
        <path d={`M${bx} ${by} L${bx - ux * 10 - uy * 5} ${by - uy * 10 + ux * 5} L${bx - ux * 10 + uy * 5} ${by - uy * 10 - ux * 5} Z`} fill={renk} />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${d.ad}: ısı ${d.alir ? "alır" : "verir"}`}>
      <g>{DEGISIMLER.map((D) => ok(D, D === d))}</g>
      {HAL_YER.map(([x, y], i) => <HalKutu key={i} x={x} y={y} hal={i} />)}
      <g textAnchor="middle">
        <text x={170} y={132} fontSize={17} fontWeight={800} fill="var(--ink)" fontFamily="var(--f-display)">{d.ad}</text>
        <text x={170} y={152} fontSize={12.5} fontWeight={700} fill={d.alir ? "var(--c2)" : "var(--c1)"}>{d.alir ? "ısı alır (endotermik)" : "ısı verir (ekzotermik)"}</text>
        <text x={170} y={169} fontSize={12} fill="var(--muted)">{d.ornek}</text>
      </g>
    </svg>
  );
}

/* ---------- CO₂ faz diyagramı ---------- */

const SUB: [number, number][] = [[-100, 0.14], [-90, 0.37], [-78.5, 1], [-70, 2.0], [-60, 4.1], [-56.6, 5.11]];
const BUH: [number, number][] = [[-56.6, 5.11], [-50, 6.8], [-40, 10], [-30, 14.3], [-20, 19.7], [-10, 26.5], [0, 34.9], [10, 45], [20, 57.3], [31, 72.9]];
const ERI: [number, number][] = [[-56.6, 5.11], [-55.4, 80]];
const fx = (T: number) => 46 + ((T + 100) / 140) * 272;
const fy = (P: number) => 196 - 166 * Math.sqrt(P / 80);
const yol = (n: [number, number][]) => n.map(([T, P], i) => `${i ? "L" : "M"}${fx(T).toFixed(1)} ${fy(P).toFixed(1)}`).join(" ");
function co2Hal(T: number, P: number) {
  if (T > 31 && P > 72.9) return "süperkritik akışkan";
  const sinir = T < -56.6 ? egri(SUB, T) : egri(BUH, T);
  if (P < sinir) return "gaz";
  return T < egri(ERI.map(([a, b]) => [b, a]) as [number, number][], P) ? "katı" : "sıvı";
}

function Faz({ s, v }: SahneProps) {
  const T = Number(s.T ?? -20), P = v.P ?? 1;
  const hal = co2Hal(T, P);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`CO₂ faz diyagramı: ${T} derece, ${P} atm, ${hal}`}>
      <g>
        {[1, 5, 20, 40, 80].map((p) => (
          <g key={p}>
            <line x1={46} x2={318} y1={fy(p)} y2={fy(p)} stroke="var(--line)" />
            <text x={40} y={fy(p) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{p}</text>
          </g>
        ))}
        {[-100, -60, -20, 20].map((d) => <text key={d} x={fx(d)} y={212} fontSize={11} textAnchor="middle" fill="var(--muted)">{eksi(d)}</text>)}
        <line x1={46} x2={318} y1={196} y2={196} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={46} x2={46} y1={22} y2={196} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={52} y={20} fontSize={11} fontWeight={700} fill="var(--ink)">P (atm)</text>
        <text x={318} y={228} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">T (°C)</text>
      </g>
      <path d={yol(SUB)} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <path d={yol(BUH)} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <path d={yol(ERI)} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <g fontSize={13} fontWeight={800} fill="var(--muted)">
        <text x={84} y={70}>KATI</text>
        <text x={150} y={56}>SIVI</text>
        <text x={262} y={164}>GAZ</text>
      </g>
      <g fontSize={11} fill="var(--muted)">
        <circle cx={fx(-56.6)} cy={fy(5.11)} r={3.5} fill="var(--ink)" />
        <text x={fx(-56.6) + 6} y={fy(5.11) + 16}>üçlü nokta</text>
        <circle cx={fx(31)} cy={fy(72.9)} r={3.5} fill="var(--ink)" />
        <text x={fx(31) - 8} y={fy(72.9) - 6} textAnchor="end">kritik nokta</text>
      </g>
      <g>
        <line x1={fx(T)} x2={fx(T)} y1={fy(80)} y2={196} stroke="var(--kimya)" strokeDasharray="3 4" opacity={0.6} />
        <circle cx={fx(T)} cy={fy(P)} r={7} fill="var(--kimya)" stroke="#fff" strokeWidth={2} />
        <text x={318} y={14} fontSize={12.5} fontWeight={800} textAnchor="end" fill="var(--kimya)">{eksi(T)} °C, {P} atm: {hal}</text>
      </g>
    </svg>
  );
}

/* ---------- Tyndall etkisi ---------- */

function Tyndall({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 3));
  const isik = kes(u * 2.5);
  const Y = 120, X1 = 92, X2 = 210, W = 84;
  const ucX = ara(48, 320, isik);
  const isikla = (x: number) => Math.max(0, Math.min(W, ucX - x));
  const nokta = useMemo(() => { const r = rastgele(23); return Array.from({ length: 40 }, () => [r(), r()]); }, []);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Işık demeti tuzlu sudan ve sütlü sudan geçiyor">
      <g>
        <rect x={4} y={Y - 7} width={30} height={14} rx={4} fill="var(--ink)" />
        <path d={`M34 ${Y - 7} L46 ${Y - 13} L46 ${Y + 13} L34 ${Y + 7} Z`} fill="var(--ink)" />
        <rect x={45} y={Y - 12} width={3} height={24} rx={1.5} fill={isik > 0 ? YAG : "var(--line-2)"} />
      </g>
      <g>
        <rect x={X1} y={64} width={W} height={124} fill={SU} />
        <rect x={X2} y={64} width={W} height={124} fill="#eef2f7" />
        {nokta.map(([a, b], i) => <circle key={i} cx={X2 + 4 + a * (W - 8)} cy={68 + b * 116} r={1.6} fill="#fff" />)}
      </g>
      <g>
        {isikla(X2) > 0 && <rect x={X2} y={Y - 7} width={isikla(X2)} height={14} fill={YAG} opacity={0.95} />}
        {isikla(X2) > 0 && <rect x={X2} y={Y - 14} width={isikla(X2)} height={28} fill={YAG} opacity={0.3} />}
      </g>
      <g>
        <path d={`M${X1} 52 L${X1} 188 L${X1 + W} 188 L${X1 + W} 52`} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
        <path d={`M${X2} 52 L${X2} 188 L${X2 + W} 188 L${X2 + W} 52`} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      </g>
      <g fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--ink)">
        <text x={X1 + W / 2} y={208}>tuzlu su</text>
        <text x={X2 + W / 2} y={208}>sulandırılmış süt</text>
      </g>
      <g fontSize={11.5} fontWeight={700} textAnchor="middle" opacity={kes((u - 0.75) * 5)}>
        <text x={X1 + W / 2} y={226} fill="var(--muted)">ışık görünmez</text>
        <text x={X2 + W / 2} y={226} fill="var(--kimya)">ışık yolu görünür</text>
      </g>
    </svg>
  );
}

/* ---------- benzer benzeri çözer ---------- */

function Tup({ x, cozer, u, ad }: { x: number; cozer: boolean; u: number; ad: string }) {
  const calk = kes(u / 0.45), dur = kes((u - 0.45) / 0.55);
  const aci = calk < 1 ? Math.sin(calk * Math.PI * 6) * 14 : 0;
  const W = 46, Y0 = 46, Y1 = 186;
  const sivi = 70; // tüpteki sıvı üst seviyesi
  const dolgu = `M${x - W / 2} ${sivi + 8} L${x - W / 2} ${Y1} Q${x} ${Y1 + 22} ${x + W / 2} ${Y1} L${x + W / 2} ${sivi + 8} Z`;
  // Çözmeyende: çalkalanınca damlacıklar, durunca yağ üstte katman olur. Çözende: rengi her yere yayılır.
  const katman = cozer ? 0 : dur;
  const yayil = cozer ? calk : 0;
  const r = rastgele(x);
  const damla = Array.from({ length: 10 }, () => [r(), r()]);
  return (
    <g transform={`rotate(${aci} ${x} ${Y1})`}>
      <path d={dolgu} fill={cozer ? "#fbfaf2" : SU} />
      {yayil > 0 && <path d={dolgu} fill={YAG} opacity={0.55 * yayil} />}
      {!cozer && calk > 0 && katman < 1 && damla.map(([a, b], i) => <circle key={i} cx={x - W / 2 + 7 + a * (W - 14)} cy={sivi + 20 + b * 90} r={4} fill={YAG} opacity={(1 - katman) * kes(calk * 3)} />)}
      {!cozer && <rect x={x - W / 2} y={sivi - 4} width={W} height={18} fill={YAG} opacity={calk > 0 ? katman : 1} />}
      {cozer && yayil < 1 && <rect x={x - W / 2} y={sivi - 4} width={W} height={18} fill={YAG} opacity={1 - yayil} />}
      <path d={`M${x - W / 2} ${Y0} L${x - W / 2} ${Y1} Q${x} ${Y1 + 22} ${x + W / 2} ${Y1} L${x + W / 2} ${Y0}`} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <text x={x} y={Y1 + 40} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--ink)">{ad}</text>
    </g>
  );
}

function Cozunme({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label="Zeytinyağı suya ve benzine ekleniyor">
      <text x={170} y={24} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">İki tüpe de biraz zeytinyağı (sarı) eklendi</text>
      <Tup x={110} cozer={false} u={u} ad="su + yağ" />
      <Tup x={230} cozer u={u} ad="benzin + yağ" />
    </svg>
  );
}

/* ---------- çözünürlük ve kristallenme ---------- */

// 100 g suda çözünen en çok kütle (g).
const KNO3: [number, number][] = [[0, 13.3], [10, 20.9], [20, 31.6], [30, 45.8], [40, 63.9], [50, 85.5], [60, 110], [70, 138], [80, 169], [90, 202], [100, 246]];
const NACL: [number, number][] = [[0, 35.7], [20, 36], [40, 36.6], [60, 37.3], [80, 38.4], [100, 39.8]];
const cx = (T: number) => 46 + T * 2.72;
const cy = (S: number) => 120 - (S / 250) * 96;

function Kristal({ x, y, n, renk }: { x: number; y: number; n: number; renk: string }) {
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + (i % 10) * 9} y={y - Math.floor(i / 10) * 8} width={7} height={6} rx={1} fill="#fff" stroke={renk} strokeWidth={1.4} />)}</g>;
}

function Cozunurluk({ s, v }: SahneProps) {
  const T = v.T ?? 20;
  const ikili = s.ikili === true;
  const mK = ikili ? 100 : 60, mN = ikili ? 30 : 0;
  const sK = egri(KNO3, T), sN = egri(NACL, T);
  const kK = Math.max(0, mK - sK), kN = Math.max(0, mN - sN);
  const nK = Math.ceil(kK / 4), nN = Math.ceil(kN / 4);
  const yol = (n: [number, number][]) => n.map(([a, b], i) => `${i ? "L" : "M"}${cx(a)} ${cy(b).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${T} derecede çözünürlük: KNO₃ ${Math.round(sK)} g, NaCl ${Math.round(sN)} g`}>
      <g>
        {[0, 50, 100, 150, 200, 250].map((g) => (
          <g key={g}>
            <line x1={46} x2={318} y1={cy(g)} y2={cy(g)} stroke="var(--line)" />
            <text x={40} y={cy(g) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{g}</text>
          </g>
        ))}
        {[0, 20, 40, 60, 80, 100].map((d) => <text key={d} x={cx(d)} y={135} fontSize={11} textAnchor="middle" fill="var(--muted)">{d}</text>)}
        <text x={318} y={150} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">T (°C)</text>
        <text x={52} y={18} fontSize={11} fontWeight={700} fill="var(--ink)">g / 100 g su</text>
      </g>
      <path d={yol(KNO3)} fill="none" stroke="var(--c5)" strokeWidth={2.6} />
      <path d={yol(NACL)} fill="none" stroke="var(--c4)" strokeWidth={2.6} />
      <g fontSize={11.5} fontWeight={800}>
        <text x={cx(66)} y={cy(150)} textAnchor="end" fill="var(--c5)">KNO₃</text>
        <text x={cx(70)} y={cy(38) - 6} fill="#b7800d">NaCl</text>
      </g>
      <g>
        <line x1={cx(T)} x2={cx(T)} y1={cy(250)} y2={120} stroke="var(--kimya)" strokeWidth={1.5} />
        <circle cx={cx(T)} cy={cy(sK)} r={4.5} fill="var(--c5)" />
        {ikili && <circle cx={cx(T)} cy={cy(sN)} r={4.5} fill="var(--c4)" />}
        <text x={cx(T) + (T > 60 ? -6 : 6)} y={cy(sK) - 6} fontSize={11.5} fontWeight={700} textAnchor={T > 60 ? "end" : "start"} fill="var(--c5)">{Math.round(sK)} g</text>
      </g>
      <g>
        <rect x={20} y={176} width={100} height={44} fill={SU} />
        <path d="M20 162 L20 220 L120 220 L120 162" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
        <Kristal x={25} y={212} n={nK} renk="var(--c5)" />
        <Kristal x={25} y={212 - Math.ceil(nK / 10) * 8} n={nN} renk="#b7800d" />
      </g>
      <g fontSize={12} fill="var(--ink)">
        <text x={136} y={178} fontWeight={800}>{T} °C, 100 g su</text>
        <text x={136} y={198} fill="var(--c5)" fontWeight={700}>{mK} g KNO₃: {kK > 0 ? `${Math.round(kK)} g dipte` : "hepsi çözeltide"}</text>
        {ikili && <text x={136} y={216} fill="#b7800d" fontWeight={700}>{mN} g NaCl: {kN > 0 ? `${Math.round(kN)} g dipte` : "hepsi çözeltide"}</text>}
      </g>
    </svg>
  );
}

/* ---------- uygun ayırma yöntemi ---------- */

const YONTEM = ["Mıknatıs", "Süzme", "Ayırma hunisi", "Damıtma"];
const CIP_W = [74, 62, 106, 72];
const CIP_X = CIP_W.map((_, i) => 6 + CIP_W.slice(0, i).reduce((a, b) => a + b + 6, 0));
type Karisim = { ad: string; dogru: number; ciktilar: [string, string]; neden: string[] };
const KARISIM: Record<string, Karisim> = {
  "demir-kukurt": {
    ad: "demir tozu + kükürt tozu", dogru: 1, ciktilar: ["demir tozu", "kükürt"],
    neden: ["", "", "İki bileşen de katı toz; ikisi de süzgeç kâğıdında kalır.", "Ayırma hunisi birbirinde çözünmeyen sıvılar içindir; burada sıvı yok.", "Damıtma sıvıları kaynama noktası farkıyla ayırır; burada sıvı yok."],
  },
  "yag-su": {
    ad: "zeytinyağı + su", dogru: 3, ciktilar: ["su", "zeytinyağı"],
    neden: ["", "Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok.", "İki sıvı da süzgeç kâğıdından geçer.", "", "Isıtmaya gerek yok: bu iki sıvı zaten iki katmana ayrılıyor. Katmanları ayıran daha basit yöntemi bul."],
  },
  "tuzlu-su": {
    ad: "tuzlu su", dogru: 4, ciktilar: ["saf su", "tuz"],
    neden: ["", "Mıknatıs yalnızca demir, nikel ve kobaltı çeker; bu karışımda yok.", "Çözünmüş tuz suyla birlikte süzgeç kâğıdından geçer.", "Tuzlu su tek fazlı bir çözeltidir; katmanlara ayrılmaz.", ""],
  },
};

function Karisim({ k, x, y, sol }: { k: string; x: number; y: number; sol: number }) {
  const W = 84, H = 70;
  const r = rastgele(31);
  return (
    <g opacity={sol}>
      {k === "demir-kukurt" && Array.from({ length: 34 }, (_, i) => (
        <circle key={i} cx={x + 6 + r() * (W - 12)} cy={y + H - 4 - r() * 26} r={2.6} fill={i % 2 ? "#4a5361" : "var(--c4)"} />
      ))}
      {k === "yag-su" && <g><rect x={x} y={y + 20} width={W} height={18} fill={YAG} /><rect x={x} y={y + 38} width={W} height={H - 38} fill={SU} /></g>}
      {k === "tuzlu-su" && <rect x={x} y={y + 20} width={W} height={H - 20} fill={SU} />}
    </g>
  );
}

function Aparat({ y, x }: { y: number; x: number }) {
  if (y === 1)
    return <path d={`M${x - 26} 92 L${x - 26} 66 Q${x - 26} 54 ${x - 14} 54 L${x + 14} 54 Q${x + 26} 54 ${x + 26} 66 L${x + 26} 92 L${x + 12} 92 L${x + 12} 68 L${x - 12} 68 L${x - 12} 92 Z`} fill="var(--c2)" />;
  if (y === 2)
    return <g fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round"><path d={`M${x - 34} 54 L${x + 34} 54 L${x + 5} 94 L${x + 5} 118 M${x - 34} 54 L${x - 5} 94 L${x - 5} 118`} /><path d={`M${x - 26} 58 L${x} 90 L${x + 26} 58`} stroke="var(--muted)" strokeDasharray="3 3" /></g>;
  if (y === 3)
    return <g fill="none" stroke="var(--ink)" strokeWidth={2.2}><path d={`M${x - 8} 46 L${x - 8} 56 Q${x - 34} 76 ${x - 22} 100 L${x - 3} 124 L${x - 3} 144 M${x + 8} 46 L${x + 8} 56 Q${x + 34} 76 ${x + 22} 100 L${x + 3} 124 L${x + 3} 144`} /><line x1={x - 10} x2={x + 10} y1={132} y2={132} strokeWidth={3} /></g>;
  return (
    <g fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round">
      <circle cx={x - 34} cy={110} r={20} />
      <path d={`M${x - 34} 90 L${x - 34} 70 L${x + 30} 98`} />
      <path d={`M${x - 20} 78 L${x + 36} 104`} strokeWidth={9} stroke="#cfe0f5" />
      <path d={`M${x + 34} 108 L${x + 34} 140 L${x + 50} 140 L${x + 50} 112`} />
    </g>
  );
}

function Ayirma({ s, v, t, oynuyor }: SahneProps) {
  const k = String(s.karisim ?? "tuzlu-su");
  const K = KARISIM[k];
  const y = v.y ?? 1;
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const basari = y === K.dogru;
  const tasi = basari ? yumusak(kes((u - 0.2) / 0.7)) : 0;
  const titre = !basari && oynuyor ? Math.sin(t * 40) * 3 : 0;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${K.ad}, yöntem: ${YONTEM[y - 1]}`}>
      <g>
        {YONTEM.map((ad, i) => {
          const x = CIP_X[i], w = CIP_W[i], sec = i + 1 === y;
          return (
            <g key={ad}>
              <rect x={x} y={6} width={w} height={26} rx={13} fill={sec ? "var(--kimya-soft)" : "#fff"} stroke={sec ? "var(--kimya)" : "var(--line-2)"} strokeWidth={1.5} />
              <text x={x + w / 2} y={23.5} fontSize={11} fontWeight={700} textAnchor="middle" fill={sec ? "var(--kimya)" : "var(--muted)"}>{i + 1}. {ad}</text>
            </g>
          );
        })}
      </g>
      <g>
        <Karisim k={k} x={30} y={88} sol={1 - tasi} />
        <path d="M30 76 L30 158 L114 158 L114 76" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
        <text x={72} y={176} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--ink)">{K.ad}</text>
      </g>
      <g transform={`translate(${titre} 0)`} opacity={!basari && u >= 1 ? 0.35 : 1}>
        <Aparat y={y} x={240} />
      </g>
      {basari && tasi > 0 && (
        <g>
          {K.ciktilar.map((c, i) => {
            const x = 190 + i * 76;
            return (
              <g key={c}>
                <rect x={x} y={222 - 26 * tasi} width={44} height={26 * tasi} fill={i === 0 ? (k === "demir-kukurt" ? "#4a5361" : SU) : k === "yag-su" ? YAG : k === "tuzlu-su" ? "#e3e8ef" : "var(--c4)"} stroke={k === "tuzlu-su" && i === 1 ? "var(--line-2)" : "none"} />
                <path d={`M${x} 192 L${x} 222 L${x + 44} 222 L${x + 44} 192`} fill="none" stroke="var(--ink)" strokeWidth={1.8} />
                <text x={x + 22} y={240} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--ink)">{c}</text>
              </g>
            );
          })}
        </g>
      )}
      {!basari && u >= 1 && <text x={240} y={196} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--kimya)">Ayrılmadı</text>}
    </svg>
  );
}

export const KIMYA4: Record<string, SahneKaydi> = {
  "kim4-erime": { C: Erime },
  "kim4-bal": {
    C: Bal,
    geri: (v) => ({ baslik: "Bardak dolmadı", metin: `${v.T} °C'de bal hâlâ ağır akıyor. Isıtınca tanecikler arası çekimi daha kolay yener; sıcaklığı artırıp yeniden dene.` }),
  },
  "kim4-buhar": { C: BuharBasinci },
  "kim4-kaynama": { C: KaynamaNoktasi },
  "kim4-hal": { C: HalDegisim },
  "kim4-faz": { C: Faz },
  "kim4-tyndall": { C: Tyndall },
  "kim4-cozunme": { C: Cozunme },
  "kim4-cozunurluk": { C: Cozunurluk },
  "kim4-ayirma": {
    C: Ayirma,
    geri: (v, s) => {
      const K = KARISIM[String(s.karisim ?? "tuzlu-su")];
      const y = v.y ?? 1;
      return { baslik: `${YONTEM[y - 1]} uygun değil`, metin: K.neden[y] || "Başka bir yöntem dene." };
    },
  },
};
