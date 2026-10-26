"use client";
// Fizik sahneleri (kütle çekimi; elektrostatik): iki cisim arasındaki çekim, düşen elma ve Dünya, yükseklikle azalan g,
// Kepler'in eşit alanları, Newton'un dağdaki topu (yörünge ve kurtulma), halatı kesilen asansör; sürtünmeyle, dokunmayla
// ve etkiyle elektriklenme, elektroskop, Coulomb kuvveti, iki yükün alan çizgileri.
import { useMemo } from "react";
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const yumusak = (u: number) => { const k = sinir(u, 0, 1); return k * k * (3 - 2 * k); };

/** (x1, y1)'den (x2, y2)'ye ok; uç (x2, y2)'dedir. */
function Ok({ x1, y1, x2, y2, renk, kalin = 3 }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, u = Math.min(10, L * 0.6);
  const bx = x2 - ux * u, by = y2 - uy * u;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z`} fill={renk} />
    </g>
  );
}

/* ---------- Kütle çekimi ---------- */

// İki cisim: A'nın kütlesi m, B'nin kütlesi v.m × m; merkezler arası v.r × r. F = (m / r²) · F₀.
function Cekim({ v }: SahneProps) {
  const k = sinir(v.m ?? 1, 1, 4), n = sinir(v.r ?? 1, 1, 3), F = k / (n * n);
  const Y = 116, AX = 62, PX = 86, BX = AX + n * PX;
  const rB = 14 * Math.cbrt(k), ok = sinir(F * 46, 8, 92);
  const tam = Math.abs(F - 1) < 1e-9;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`B'nin kütlesi ${k}m, uzaklık ${n}r: çekim kuvveti ${say(F, 2)} F₀`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">F = G·m₁·m₂ / r² ∝ {k} / {n}²</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={tam ? "var(--good)" : "var(--c2)"}>F = {say(F, 2)} F₀</text>
      <line x1={AX} x2={BX} y1={Y} y2={Y} stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="4 5" />
      <circle cx={AX} cy={Y} r={14} fill="var(--c1)" />
      <circle cx={BX} cy={Y} r={rB} fill="var(--c5)" />
      <text x={AX} y={Y + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">A</text>
      <text x={BX} y={Y + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">B</text>
      <Ok x1={AX} y1={Y - 30} x2={AX + ok} y2={Y - 30} renk="var(--c2)" />
      <Ok x1={BX} y1={Y - 34 - rB + 14} x2={BX - ok} y2={Y - 34 - rB + 14} renk="var(--c2)" />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={AX} y={Y + 40}>m</text>
        <text x={BX} y={Y + 26 + rB}>{k} m</text>
        <line x1={AX} x2={BX} y1={Y + 62} y2={Y + 62} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={AX} x2={AX} y1={Y + 57} y2={Y + 67} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={BX} x2={BX} y1={Y + 57} y2={Y + 67} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(AX + BX) / 2} y={Y + 80}>{n === 1 ? "r" : `${n} r`}</text>
      </g>
      <text x={170} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">oklar: iki cisme etki eden eşit ve zıt kuvvetler</text>
    </svg>
  );
}

// Elma (0,1 kg) ağaçtan düşer. Dünya elmayı 1 N ile çeker, elma da Dünya'yı 1 N ile çeker. Bittiğinde ivmeler yazılır.
function Elma({ t, oynuyor, s, secim }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), dus = u * u;
  const y0 = 70, y1 = 178, y = y0 + (y1 - y0) * dus, acik = secim !== null && u >= 1;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Düşen elma ve Dünya birbirini eşit büyüklükte kuvvetle çeker">
      <path d="M0 196 Q170 176 340 196 L340 236 L0 236 Z" fill="var(--c3)" opacity={0.25} />
      <path d="M0 196 Q170 176 340 196" fill="none" stroke="var(--c3)" strokeWidth={2} />
      <g>
        <rect x={86} y={60} width={12} height={128} rx={4} fill="#a0784f" />
        <circle cx={92} cy={50} r={40} fill="var(--c3)" opacity={0.8} />
        <line x1={92} y1={60} x2={160} y2={64} stroke="#a0784f" strokeWidth={5} strokeLinecap="round" />
      </g>
      <circle cx={160} cy={y} r={9} fill="var(--c2)" />
      <Ok x1={186} y1={y - 16} x2={186} y2={y + 14} renk="var(--c2)" kalin={2.5} />
      <text x={194} y={y + 2} fontSize={12} fontWeight={800} fill="var(--c2)">1 N</text>
      {u > 0 && <Ok x1={140} y1={214} x2={140} y2={188} renk="var(--c1)" kalin={2.5} />}
      {u > 0 && <text x={132} y={212} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="end">1 N</text>}
      <text x={326} y={226} fontSize={11.5} fontWeight={800} fill="var(--c3)" textAnchor="end">Dünya</text>
      <g fontSize={12.5} fontWeight={800}>
        <text x={326} y={22} fill="var(--c2)" textAnchor="end">elma: 0,1 kg</text>
        {acik && <text x={326} y={42} fill="var(--c2)" textAnchor="end">a = 1 / 0,1 ≈ 10 m/s²</text>}
        {acik && <text x={326} y={62} fill="var(--c1)" textAnchor="end">Dünya: a = 1 / 6·10²⁴ ≈ 0</text>}
      </g>
    </svg>
  );
}

// Yükseklik: astronot (80 kg) yerden v.h × R yukarıda; r = (1 + h)·R, g = 9,8 / (1 + h)².
function Yukseklik({ v }: SahneProps) {
  const h = sinir(v.h ?? 0, 0, 3), n = 1 + h, g = 9.8 / (n * n), G = 80 * g;
  const CX = 50, CY = 136, R = 38, ax = CX + n * R;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Merkezden ${n}R uzakta g = ${say(g, 2)} m/s², 80 kg'lık astronotun ağırlığı ${say(G)} N`}>
      {[2, 3, 4].map((k) => (
        <path key={k} d={`M${CX} ${CY - k * R} A${k * R} ${k * R} 0 0 1 ${CX + k * R} ${CY}`} fill="none" stroke="var(--line)" strokeWidth={1.2} strokeDasharray="3 5" />
      ))}
      <circle cx={CX} cy={CY} r={R} fill="var(--c1)" opacity={0.85} />
      <text x={CX} y={CY + 20} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">Dünya</text>
      <line x1={CX} y1={CY} x2={ax} y2={CY} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />
      <g>
        <circle cx={ax} cy={CY - 22} r={7} fill="var(--c4)" />
        <rect x={ax - 7} y={CY - 15} width={14} height={15} rx={4} fill="var(--c4)" />
      </g>
      <Ok x1={ax - 9} y1={CY - 8} x2={ax - 9 - sinir(G / 12, 6, 66)} y2={CY - 8} renk="var(--c2)" kalin={2.5} />
      <text x={ax} y={CY + 22} fontSize={12} fontWeight={800} fill="var(--muted)" textAnchor="middle">r = {n === 1 ? "R" : `${n}R`}</text>
      <g fontSize={13} fontWeight={800}>
        <text x={326} y={22} fill="var(--ink)" textAnchor="end">g = 9,8 / {n}² = {say(g, 2)} m/s²</text>
        <text x={326} y={42} fill="var(--c2)" textAnchor="end">ağırlık = 80 · g = {say(G)} N</text>
        <text x={326} y={226} fill="var(--muted)" textAnchor="end">kütle: 80 kg (değişmez)</text>
      </g>
    </svg>
  );
}

// Kepler: e = 0,6'lık elips. Gezegen bir tur atar; eşit sürelerde taranan iki alan (günberi ve günöte yakınında) boyanır.
const KA = 116, KE = 0.6, KB = KA * Math.sqrt(1 - KE * KE), KCX = 170, KCY = 124, GX = KCX - KA * KE;
const elipsNokta = (M: number) => {
  let E = M;
  for (let i = 0; i < 12; i++) E -= (E - KE * Math.sin(E) - M) / (1 - KE * Math.cos(E));
  return { x: KCX - KA * Math.cos(E), y: KCY + KB * Math.sin(E) };
};
function Kepler({ t, oynuyor, s, secim }: SahneProps) {
  const sure = Number(s.sure ?? 6), u = ilerleme(t, oynuyor, sure), p = elipsNokta(u * 2 * Math.PI);
  const dilim = (m0: number) => {
    const pts = Array.from({ length: 9 }, (_, i) => elipsNokta(m0 + (i / 8) * (Math.PI / 6)));
    return `M${GX} ${KCY} ${pts.map((q) => `L${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ")} Z`;
  };
  const acik = secim !== null && u >= 1;
  const yakin = Math.hypot(p.x - GX, p.y - KCY) < KA * 0.8;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Elips yörüngede gezegen; eşit sürelerde eşit alanlar taranır">
      <ellipse cx={KCX} cy={KCY} rx={KA} ry={KB} fill="none" stroke="var(--line-2)" strokeWidth={2} />
      {u > 1 / 12 && <path d={dilim(-Math.PI / 12)} fill="var(--c4)" opacity={0.35} />}
      {u > 7 / 12 && <path d={dilim(Math.PI - Math.PI / 12)} fill="var(--c4)" opacity={0.35} />}
      <circle cx={GX} cy={KCY} r={11} fill="var(--c4)" />
      <circle cx={p.x} cy={p.y} r={7} fill="var(--c1)" />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={GX} y={KCY + 26}>Güneş</text>
        <text x={KCX - KA - 4} y={KCY - 14} textAnchor="start">günberi</text>
        <text x={KCX + KA} y={KCY - 14} textAnchor="end">günöte</text>
      </g>
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">{u > 0 && u < 1 ? (yakin ? "Güneş'e yakın: hızlı" : "Güneş'ten uzak: yavaş") : "Elips yörünge"}</text>
        {acik && <text x={170} y={226} fill="var(--c4)" textAnchor="middle">iki dilim aynı sürede tarandı: alanları eşit</text>}
      </g>
    </svg>
  );
}

// Newton'un topu: dağın tepesinden yatay atış, hız v.v / 10 km/s. Yörünge hızı 7,9, kurtulma hızı ≈ 11,2 km/s.
// Birimler: atış noktası r = 1, GM = 7,9². Dünya yarıçapı 0,92 (dağ abartılı çizildi).
const GM = 7.9 * 7.9, RD = 0.92;
type Yol = { pts: { x: number; y: number }[]; sonuc: "carpti" | "yorunge" | "kurtuldu" | "uzak" };
function yolHesapla(v: number): Yol {
  let x = 0, y = 1, vx = v, vy = 0, aci = 0, onceki = Math.PI / 2;
  const dt = 0.0008, pts = [{ x, y }];
  const ivme = (px: number, py: number) => { const r3 = Math.pow(px * px + py * py, 1.5); return [(-GM * px) / r3, (-GM * py) / r3]; };
  let [ax, ay] = ivme(x, y);
  for (let i = 0; i < 20000; i++) {
    x += vx * dt + 0.5 * ax * dt * dt; y += vy * dt + 0.5 * ay * dt * dt;
    const [bx, by] = ivme(x, y);
    vx += 0.5 * (ax + bx) * dt; vy += 0.5 * (ay + by) * dt; ax = bx; ay = by;
    const a = Math.atan2(y, x);
    let d = onceki - a;
    if (d < -Math.PI) d += 2 * Math.PI;
    aci += d; onceki = a;
    if (i % 6 === 0) pts.push({ x, y });
    const r = Math.hypot(x, y);
    if (r < RD) return { pts, sonuc: "carpti" };
    if (aci >= 2 * Math.PI) return { pts, sonuc: "yorunge" };
    if (r > 9) return { pts, sonuc: v * v / 2 - GM >= 0 ? "kurtuldu" : "uzak" };
  }
  return { pts, sonuc: v * v / 2 - GM >= 0 ? "kurtuldu" : "uzak" };
}
const SONUC = { carpti: "Yere düştü", yorunge: "Yörüngede: hep düşüyor ama Dünya'yı ıskalıyor", kurtuldu: "Dünya'nın çekiminden kurtuldu", uzak: "Çok uzaklaştı ama geri dönecek" };
function Newton({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = ilerleme(t, oynuyor, sure), hiz = sinir(v.v ?? 50, 20, 130) / 10;
  const yol = useMemo(() => yolHesapla(hiz), [hiz]);
  const CX = 170, CY = 102, PX = 48;
  const n = u > 0 ? Math.max(1, Math.round(u * (yol.pts.length - 1))) : 0;
  const goster = yol.pts.slice(0, n + 1);
  const d = goster.map((q, i) => `${i ? "L" : "M"}${(CX + q.x * PX).toFixed(1)} ${(CY - q.y * PX).toFixed(1)}`).join(" ");
  const son = goster[goster.length - 1] ?? { x: 0, y: 1 };
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Top ${say(hiz)} km/s hızla atılıyor${u >= 1 ? `: ${SONUC[yol.sonuc]}` : ""}`}>
      <circle cx={CX} cy={CY} r={RD * PX} fill="var(--c1)" opacity={0.85} />
      <path d={`M${CX - 6} ${CY - RD * PX + 1} L${CX} ${CY - PX} L${CX + 6} ${CY - RD * PX + 1} Z`} fill="#a0784f" />
      {n > 0 && <path d={d} fill="none" stroke="var(--c2)" strokeWidth={2} strokeDasharray="4 4" />}
      <circle cx={CX + son.x * PX} cy={CY - son.y * PX} r={4.5} fill="var(--c2)" />
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">atış hızı: {say(hiz)} km/s</text>
        <text x={326} y={22} fill="var(--muted)" textAnchor="end">yörünge 7,9 · kurtulma 11,2</text>
        {u >= 1 && <text x={170} y={226} fill={yol.sonuc === "carpti" ? "var(--c2)" : "var(--good)"} textAnchor="middle">{SONUC[yol.sonuc]}</text>}
      </g>
    </svg>
  );
}

// Asansör: 60 kg'lık kişi tartının üstünde. v.kes 1 ise oynatınca halat kopar, asansör serbest düşer, tartı 0 gösterir.
function Asansor({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), kes = v.kes === 1;
  const dus = kes ? u * u * 118 : 0, Y = 30 + dus, tarti = kes && u > 0 ? 0 : 588;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Asansördeki tartı ${tarti} N gösteriyor${kes && u > 0 ? ": asansör serbest düşüyor" : ""}`}>
      <line x1={120} x2={120} y1={0} y2={236} stroke="var(--line-2)" strokeWidth={2} />
      <line x1={220} x2={220} y1={0} y2={236} stroke="var(--line-2)" strokeWidth={2} />
      {!kes || u === 0 ? (
        <line x1={170} x2={170} y1={0} y2={Y} stroke="var(--ink)" strokeWidth={2} />
      ) : (
        <line x1={170} x2={170} y1={0} y2={18} stroke="var(--ink)" strokeWidth={2} />
      )}
      <g>
        <rect x={130} y={Y} width={80} height={86} rx={4} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
        <circle cx={170} cy={Y + 22} r={8} fill="var(--c4)" />
        <rect x={162} y={Y + 31} width={16} height={34} rx={5} fill="var(--c4)" />
        <rect x={152} y={Y + 67} width={36} height={8} rx={2} fill="var(--c5)" />
      </g>
      {kes && u > 0 && <Ok x1={238} y1={Y + 24} x2={238} y2={Y + 64} renk="var(--c2)" kalin={2.5} />}
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">kişi: 60 kg</text>
        <text x={14} y={42} fill={tarti ? "var(--c5)" : "var(--c2)"}>tartı: {tarti} N</text>
        {kes && u > 0 && <text x={14} y={62} fill="var(--c2)">serbest düşüş: a = g</text>}
      </g>
    </svg>
  );
}

/* ---------- Elektrostatik ---------- */

/** Yük işareti: küçük dairede + ya da −. */
function Yuk({ x, y, art, r = 7 }: { x: number; y: number; art: boolean; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={art ? "var(--c2)" : "var(--c1)"} />
      <text x={x} y={y + 4} fontSize={r * 1.6} fontWeight={800} fill="#fff" textAnchor="middle">{art ? "+" : "−"}</text>
    </g>
  );
}

// Sürtünme: cam çubuk ipeğe sürtülür; 2 elektron camdan ipeğe geçer.
function Surtunme({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), gecen = u >= 0.55 ? 2 : 0;
  const ovma = u > 0 && u < 0.55 ? Math.sin(u * 40) * 30 : 0;
  const camE = 5 - gecen, ipekE = 5 + gecen;
  const RY = 86, IY = 150;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Cam ${gecen ? "2 elektron verdi, (+) yüklü" : "nötr"}; ipek ${gecen ? "2 elektron aldı, (−) yüklü" : "nötr"}`}>
      <rect x={40} y={RY - 12} width={260} height={24} rx={12} fill="var(--fizik-soft)" stroke="var(--c1)" strokeWidth={1.5} />
      {Array.from({ length: 5 }, (_, i) => <Yuk key={`cp${i}`} x={70 + i * 50} y={RY} art />)}
      {Array.from({ length: camE }, (_, i) => <Yuk key={`ce${i}`} x={88 + i * 50} y={RY} art={false} />)}
      <g transform={`translate(${ovma} 0)`}>
        <rect x={60} y={IY - 18} width={220} height={36} rx={10} fill="var(--c5)" opacity={0.18} stroke="var(--c5)" strokeWidth={1.5} />
        {Array.from({ length: 5 }, (_, i) => <Yuk key={`ip${i}`} x={80 + i * 45} y={IY - 8} art />)}
        {Array.from({ length: ipekE }, (_, i) => <Yuk key={`ie${i}`} x={ipekE > 5 ? 80 + i * 30 : 80 + i * 45} y={IY + 8} art={false} />)}
      </g>
      {u > 0.4 && u < 0.7 && [0, 1].map((i) => <Ok key={i} x1={238 + i * 50} y1={RY + 10} x2={230 + i * 30} y2={IY - 20} renk="var(--c1)" kalin={2} />)}
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={56} fill="var(--c1)">cam çubuk: {gecen ? "+2 (2 elektron verdi)" : "nötr"}</text>
        <text x={14} y={204} fill="var(--c5)">ipek: {gecen ? "−2 (2 elektron aldı)" : "nötr"}</text>
        <text x={14} y={22} fill="var(--ink)">toplam yük: 0 {gecen ? "(korundu)" : ""}</text>
      </g>
    </svg>
  );
}

// Dokunma: A küresi (yarıçap 1) 12 μC, B nötr (yarıçap v.r). Oynatınca dokunur ve ayrılır: yük yarıçapla orantılı paylaşılır.
function Dokunma({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), k = sinir(v.r ?? 1, 1, 3);
  const rA = 22, rB = 22 * k, Q = 12, qA = Q / (1 + k), qB = (Q * k) / (1 + k);
  const pay = u >= 0.45;
  const yak = u < 0.4 ? yumusak(u / 0.4) : u < 0.6 ? 1 : 1 - yumusak((u - 0.6) / 0.4);
  const AX = 80, Y = 118, uzak = AX + rA + rB + 70, temas = AX + rA + rB, BX = uzak - (uzak - temas) * yak;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`A ${say(pay ? qA : Q)} μC, B ${say(pay ? qB : 0)} μC`}>
      <circle cx={AX} cy={Y} r={rA} fill="var(--c2)" opacity={pay ? 0.35 + 0.4 * (qA / Q) : 0.75} />
      <circle cx={BX} cy={Y} r={rB} fill={pay ? "var(--c2)" : "var(--line)"} opacity={pay ? 0.35 + 0.4 * (qB / Q) : 1} />
      <text x={AX} y={Y + 4} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">A</text>
      <text x={BX} y={Y + 4} fontSize={12} fontWeight={800} fill={pay ? "#fff" : "var(--muted)"} textAnchor="middle">B</text>
      <g fontSize={12.5} fontWeight={800} textAnchor="middle">
        <text x={AX} y={Y - rA - 12} fill="var(--c2)">{say(pay ? qA : Q)} μC</text>
        <text x={BX} y={Y - rB - 12} fill={pay ? "var(--c2)" : "var(--muted)"}>{say(pay ? qB : 0)} μC</text>
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={AX} y={Y + rA + 20}>r</text>
        <text x={BX} y={Y + rB + 20}>{k === 1 ? "r" : `${k}r`}</text>
      </g>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">toplam: 12 μC · q<tspan fontSize={9} dy={3}>A</tspan><tspan dy={-3}> / q</tspan><tspan fontSize={9} dy={3}>B</tspan><tspan dy={-3}> = r</tspan><tspan fontSize={9} dy={3}>A</tspan><tspan dy={-3}> / r</tspan><tspan fontSize={9} dy={3}>B</tspan></text>
    </svg>
  );
}

// Etki: (−) çubuk soldan nötr iletken küreye yaklaşır. s.toprak ise küre toprağa bağlanır, bağ kesilir, çubuk uzaklaşır.
function Etki({ t, oynuyor, s, secim }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = ilerleme(t, oynuyor, sure), toprak = s.toprak === true;
  const CX = 196, CY = 112, R = 46;
  // aşamalar (topraklı): yaklaş 0–0,25, toprağa bağla 0,25–0,45, bağı kes 0,45–0,55, çubuğu uzaklaştır 0,55–0,8, dağıl 0,8–1
  const yak = toprak ? (u < 0.25 ? yumusak(u / 0.25) : u < 0.55 ? 1 : 1 - yumusak((u - 0.55) / 0.25)) : yumusak(u / 0.6);
  const bagli = toprak && u >= 0.25 && u < 0.45, kacan = toprak ? yumusak((u - 0.27) / 0.16) : 0;
  const dagil = toprak ? yumusak((u - 0.8) / 0.2) : 0;
  const rodX = 20 + 92 * yak;
  const art = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * 2 * Math.PI + 0.3; return { x: CX + 17 * Math.cos(a), y: CY + 17 * Math.sin(a) }; });
  // 8 elektron: 3'ü topraklamada kaçar. Yaklaşınca sağa (uzak yüze) kayar.
  const eksi = Array.from({ length: 8 }, (_, i) => {
    const a0 = (i / 8) * 2 * Math.PI, ev = { x: CX + 36 * Math.cos(a0), y: CY + 36 * Math.sin(a0) };
    const ay = (-66 + (i / 7) * 132) * (Math.PI / 180), sag = { x: CX + 38 * Math.cos(ay), y: CY + 38 * Math.sin(ay) };
    const it = toprak ? (u < 0.55 ? yak : 1 - dagil) : yak;
    const p = { x: ev.x + (sag.x - ev.x) * it, y: ev.y + (sag.y - ev.y) * it };
    if (i < 3 && toprak) {
      const k = kacan;
      return { x: p.x + (CX + R + 40 - p.x) * Math.min(1, k * 2), y: p.y + (CY - p.y) * Math.min(1, k * 2) + (196 - CY) * Math.max(0, k * 2 - 1), gitti: k >= 1 };
    }
    return { ...p, gitti: false };
  });
  const son = toprak && u >= 1 && secim !== null;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={toprak ? (u >= 1 ? "Küre (+) yüklü kaldı" : "Topraklama ile elektriklenme") : "Etkiyle kutuplanma: yakın yüz (+), uzak yüz (−)"}>
      <circle cx={CX} cy={CY} r={R} fill="var(--line)" stroke="var(--muted)" strokeWidth={1.5} />
      {art.map((p, i) => <Yuk key={`p${i}`} x={p.x} y={p.y} art r={6} />)}
      {eksi.filter((e) => !e.gitti).map((e, i) => <Yuk key={`e${i}`} x={e.x} y={e.y} art={false} r={6} />)}
      {toprak && u >= 0.25 && (
        <g stroke="var(--ink)" strokeWidth={2}>
          <line x1={CX + R} y1={CY} x2={CX + R + 40} y2={CY} />
          <line x1={CX + R + 40} y1={CY} x2={CX + R + 40} y2={bagli ? 196 : 158} />
          {!bagli && <line x1={CX + R + 40} y1={180} x2={CX + R + 40} y2={196} />}
          <line x1={CX + R + 26} y1={196} x2={CX + R + 54} y2={196} />
          <line x1={CX + R + 31} y1={202} x2={CX + R + 49} y2={202} />
          <line x1={CX + R + 36} y1={208} x2={CX + R + 44} y2={208} />
        </g>
      )}
      <g opacity={toprak && u > 0.55 ? yak : 1}>
        <rect x={rodX - 70} y={CY - 9} width={70} height={18} rx={9} fill="var(--c1)" opacity={0.85} />
        {[0, 1, 2].map((i) => <text key={i} x={rodX - 56 + i * 20} y={CY + 5} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle">−</text>)}
      </g>
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">
          {!toprak ? "(−) çubuk nötr küreye yaklaşıyor" : u < 0.25 ? "1. Çubuğu yaklaştır" : u < 0.45 ? "2. Toprağa bağla" : u < 0.55 ? "3. Bağı kes" : u < 0.8 ? "4. Çubuğu uzaklaştır" : "Sonuç"}
        </text>
        {son && <text x={14} y={226} fill="var(--c2)">küre: 8 proton, 5 elektron → +3</text>}
      </g>
    </svg>
  );
}

// Elektroskop: (+) çubuk topuzdan v.d × 2 cm uzakta (dokunmadan). Yapraklar etkiyle açılır; uzaklaşınca kapanır.
function Elektroskop({ v }: SahneProps) {
  const d = sinir(v.d ?? 10, 1, 10), aci = sinir(36 / d, 0, 34);
  const TX = 170, TY = 72, AY = 150;
  const yaprak = (yon: number) => {
    const a = (aci * Math.PI) / 180, L = 54;
    return { x: TX + yon * Math.sin(a) * L, y: AY + Math.cos(a) * L };
  };
  const sol = yaprak(-1), sag = yaprak(1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Çubuk ${d * 2} cm uzakta; yapraklar ${aci > 4 ? "açık" : "neredeyse kapalı"}`}>
      <path d={`M100 120 Q100 92 128 92 L212 92 Q240 92 240 120 L240 218 L100 218 Z`} fill="none" stroke="var(--line-2)" strokeWidth={2} />
      <circle cx={TX} cy={TY} r={12} fill="var(--c4)" />
      <line x1={TX} y1={TY + 12} x2={TX} y2={AY} stroke="var(--c4)" strokeWidth={4} />
      <line x1={TX} y1={AY} x2={sol.x} y2={sol.y} stroke="var(--c4)" strokeWidth={5} strokeLinecap="round" />
      <line x1={TX} y1={AY} x2={sag.x} y2={sag.y} stroke="var(--c4)" strokeWidth={5} strokeLinecap="round" />
      <g>
        <rect x={TX - 9} y={TY - 22 - d * 4.6 - 80} width={18} height={80} rx={9} fill="var(--c2)" opacity={0.85} />
        {[0, 1, 2].map((i) => <text key={i} x={TX} y={TY - 22 - d * 4.6 - 58 + i * 22} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle">+</text>)}
      </g>
      {aci > 4 && (
        <g fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">
          <text x={sol.x - 12} y={sol.y + 4}>+</text>
          <text x={sag.x + 12} y={sag.y + 4}>+</text>
          <text x={TX - 22} y={TY + 4} fill="var(--c1)">−</text>
        </g>
      )}
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">çubuk–topuz: {d * 2} cm</text>
        <text x={326} y={22} fill={aci > 4 ? "var(--c4)" : "var(--muted)"} textAnchor="end">{aci > 4 ? "yapraklar açık" : "yapraklar kapalı"}</text>
      </g>
    </svg>
  );
}

// Coulomb: q₁ = +4 μC sabit; q₂ = v.q μC; uzaklık v.r × 30 cm. F = 9·10⁹·q₁·q₂ / r² = 0,4·q₂ / r² N.
function Coulomb({ v }: SahneProps) {
  const q = sinir(v.q ?? 2, -4, 4), n = sinir(v.r ?? 1, 1, 3), F = (0.4 * q) / (n * n), Fb = Math.abs(F);
  const Y = 112, AX = 70, BX = AX + n * 80, ok = sinir(Math.sqrt(Fb) * 60, 0, 80), iter = F > 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`q₂ = ${q} μC, uzaklık ${n * 30} cm: kuvvet ${say(Fb, 3)} N, ${q === 0 ? "kuvvet yok" : iter ? "itme" : "çekme"}`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">F = k·q₁·q₂ / r² = 9·10⁹ · 4·10⁻⁶ · {say(Math.abs(q))}·10⁻⁶ / {say(n * 0.3)}²</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={q === 0 ? "var(--muted)" : iter ? "var(--c2)" : "var(--c1)"}>
        F = {say(Fb, 3)} N {q === 0 ? "" : iter ? "(itme)" : "(çekme)"}
      </text>
      <line x1={AX} x2={BX} y1={Y} y2={Y} stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="4 5" />
      {q !== 0 && ok > 4 && (
        <>
          <Ok x1={AX} y1={Y - 30} x2={AX + (iter ? -ok : ok)} y2={Y - 30} renk="var(--c5)" />
          <Ok x1={BX} y1={Y - 30} x2={BX + (iter ? ok : -ok)} y2={Y - 30} renk="var(--c5)" />
        </>
      )}
      <Yuk x={AX} y={Y} art r={15} />
      {q === 0 ? <circle cx={BX} cy={Y} r={15} fill="var(--line)" /> : <Yuk x={BX} y={Y} art={q > 0} r={15} />}
      <g fontSize={12} fontWeight={800} textAnchor="middle">
        <text x={AX} y={Y + 36} fill="var(--c2)">+4 μC</text>
        <text x={BX} y={Y + 36} fill={q > 0 ? "var(--c2)" : q < 0 ? "var(--c1)" : "var(--muted)"}>{say(q)} μC</text>
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <line x1={AX} x2={BX} y1={Y + 56} y2={Y + 56} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={AX} x2={AX} y1={Y + 51} y2={Y + 61} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={BX} x2={BX} y1={Y + 51} y2={Y + 61} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(AX + BX) / 2} y={Y + 74}>{n * 30} cm</text>
      </g>
    </svg>
  );
}

// Alan çizgileri: solda +q, sağda +q ya da (v.isaret 1 ise) −q. Çizgiler (+) yükten çıkarak izlenir.
const YA = { x: 112, y: 118 }, YB = { x: 228, y: 118 };
type Cizgi = { d: string; ok: { x: number; y: number; a: number } };
function yol(pts: number[][]): string {
  return pts.map(([px, py], j) => `${j ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
}
function cizgiler(eksi: boolean): Cizgi[] {
  const yukler = [{ ...YA, q: 1 }, { ...YB, q: eksi ? -1 : 1 }];
  const kaynaklar = eksi ? [yukler[0]] : yukler;
  const N = eksi ? 12 : 10;
  const sonuc: Cizgi[] = [];
  for (const k of kaynaklar) {
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 2 * Math.PI + 0.12;
      let x = k.x + 12 * Math.cos(a), y = k.y + 12 * Math.sin(a), vardi = false;
      const pts = [[x, y]];
      for (let s = 0; s < 260; s++) {
        let ex = 0, ey = 0;
        for (const c of yukler) {
          const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
          ex += (c.q * dx) / (r2 * r); ey += (c.q * dy) / (r2 * r);
        }
        const L = Math.hypot(ex, ey);
        if (!L) break;
        x += (3 * ex) / L; y += (3 * ey) / L;
        pts.push([x, y]);
        if (x < -10 || x > 350 || y < -10 || y > 246) break;
        if (eksi && Math.hypot(x - YB.x, y - YB.y) < 10) { vardi = true; break; }
      }
      // Ok başı: yükten ~14 adım (42 birim) ötede, çizginin yönünde.
      const m = Math.min(14, pts.length - 2), [x0, y0] = pts[m], [x1, y1] = pts[m + 1];
      sonuc.push({ d: yol(pts), ok: { x: x0, y: y0, a: Math.atan2(y1 - y0, x1 - x0) } });
      // Zıt yüklerde dışarı kaçan çizgilerin aynası, (−) yüke dışarıdan giren çizgilerdir (yön de aynalanır ve ters döner).
      if (eksi && !vardi) {
        const ayna = pts.map(([px, py]) => [YA.x + YB.x - px, py]);
        sonuc.push({ d: yol(ayna), ok: { x: YA.x + YB.x - x0, y: y0, a: Math.atan2(-(y1 - y0), x1 - x0) } });
      }
    }
  }
  return sonuc;
}
function Alan({ v }: SahneProps) {
  const eksi = v.isaret === 1;
  const yollar = useMemo(() => cizgiler(eksi), [eksi]);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={eksi ? "Zıt yükler: çizgiler (+) yükten çıkıp (−) yüke giriyor" : "Aynı işaretli iki yük: çizgiler birbirinden uzaklaşıyor"}>
      <g fill="none" stroke="var(--c5)" strokeWidth={1.4} opacity={0.75}>
        {yollar.map((c, i) => <path key={i} d={c.d} />)}
      </g>
      <g fill="var(--c5)">
        {yollar.map((c, i) => (
          <path key={i} d="M5 0 L-4 -4 L-4 4 Z" transform={`translate(${c.ok.x.toFixed(1)} ${c.ok.y.toFixed(1)}) rotate(${((c.ok.a * 180) / Math.PI).toFixed(1)})`} />
        ))}
      </g>
      <Yuk x={YA.x} y={YA.y} art r={12} />
      <Yuk x={YB.x} y={YB.y} art={!eksi} r={12} />
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)" stroke="#fff" strokeWidth={4} strokeLinejoin="round" paintOrder="stroke">
        {eksi ? "zıt yükler: çizgiler birbirine bağlanır" : "aynı işaretli yükler: çizgiler ayrılır"}
      </text>
    </svg>
  );
}

export const FIZIK8: Record<string, SahneKaydi> = {
  "fiz8-cekim": { C: Cekim },
  "fiz8-elma": { C: Elma },
  "fiz8-yukseklik": { C: Yukseklik },
  "fiz8-kepler": { C: Kepler },
  "fiz8-newton": {
    C: Newton,
    geri: (v) => {
      const hiz = (v.v ?? 50) / 10, sonuc = yolHesapla(hiz).sonuc;
      return { baslik: SONUC[sonuc], metin: `${say(hiz)} km/s ile ${sonuc === "carpti" ? "top yere düştü. Hızı artır: yüzey eğildikçe top daha uzağa düşer." : sonuc === "kurtuldu" ? "top hiç geri dönmüyor." : "top yörüngede kalıyor."}` };
    },
  },
  "fiz8-asansor": {
    C: Asansor,
    geri: () => ({ baslik: "Tartı hâlâ 588 N", metin: "Halat sağlamken asansör duruyor; tartı ağırlığını gösteriyor. Halatı kes ve yeniden oynat." }),
  },
  "fiz8-surtunme": { C: Surtunme },
  "fiz8-dokunma": {
    C: Dokunma,
    geri: (v) => {
      const k = v.r ?? 1;
      return { baslik: "Henüz değil", metin: `B'nin yarıçapı ${k === 1 ? "r" : `${k}r`} iken B, 12 μC'nin ${k}/${k + 1}'ini alır: ${say((12 * k) / (k + 1))} μC. 8 μC için B, toplamın 2/3'ünü almalı.` };
    },
  },
  "fiz8-etki": { C: Etki },
  "fiz8-elektroskop": { C: Elektroskop },
  "fiz8-coulomb": { C: Coulomb },
  "fiz8-alan": { C: Alan },
};
