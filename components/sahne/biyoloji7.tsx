"use client";
// Biyoloji sahneleri (DNA ve genetik kod, protein sentezi): nükleotit ve bazlar, baz eşleşmesi,
// Chargaff kuralı, yarı korunumlu eşlenme, eşlenme çatalı, PCR; transkripsiyon, kodon okuma,
// ribozomda translasyon, peptit hesabı, nokta mutasyonu (orak hücre) ve çerçeve kayması.
import type { SahneKaydi, SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";

// biyomoleküller dersindeki DNA/RNA sahnesiyle aynı renkler.
const BAZ_RENK: Record<string, string> = { A: "var(--c1)", T: "var(--c4)", U: "var(--c2)", G: "var(--biyoloji)", C: "var(--c5)" };
const ES: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
const RNA_ES: Record<string, string> = { A: "U", T: "A", G: "C", C: "G" };

/** Standart genetik kod (mRNA kodonu → amino asit kısaltması; dur kodonları "dur"). */
const KOD = (() => {
  const b = "UCAG", aa = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  const ad: Record<string, string> = {
    F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", "*": "dur", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg",
    I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly",
  };
  const m: Record<string, string> = {};
  let i = 0;
  for (const x of b) for (const y of b) for (const z of b) m[x + y + z] = ad[aa[i++]];
  return m;
})();
const kodonlar = (s: string) => Array.from({ length: Math.floor(s.length / 3) }, (_, i) => s.slice(i * 3, i * 3 + 3));

/** Tek baz kutucuğu; (x, y) kutunun merkezidir. */
function Baz({ x, y, b, w = 22, soluk = false, cerceve }: { x: number; y: number; b: string; w?: number; soluk?: boolean; cerceve?: string }) {
  const r = BAZ_RENK[b] ?? "var(--muted)";
  return (
    <g opacity={soluk ? 0.35 : 1}>
      <rect x={x - w / 2} y={y - w / 2} width={w} height={w} rx={5} fill={r} fillOpacity={0.16} stroke={cerceve ?? r} strokeWidth={cerceve ? 2 : 1.4} />
      <text x={x} y={y + 4.5} fontSize={13} fontWeight={800} fill={r} textAnchor="middle">{b}</text>
    </g>
  );
}

function BosBaz({ x, y, w = 22 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - w / 2} width={w} height={w} rx={5} fill="none" stroke="var(--line-2)" strokeWidth={1.4} strokeDasharray="3 3" />
      <text x={x} y={y + 4.5} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">?</text>
    </g>
  );
}

/* ---------- nükleotit ve bazlar ---------- */

const altigen = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
/** Altıgenin sağ kenarına yapışık beşgen (pürinlerin ikinci halkası). */
const besgen = (cx: number, cy: number, r: number) => {
  const R = r / (2 * Math.sin(Math.PI / 5)), px = cx + r * Math.cos(Math.PI / 6) + r / (2 * Math.tan(Math.PI / 5));
  return [144, 72, 0, -72, -144]
    .map((d) => `${(px + R * Math.cos((d * Math.PI) / 180)).toFixed(1)},${(cy - R * Math.sin((d * Math.PI) / 180)).toFixed(1)}`)
    .join(" ");
};

function Halka({ x, y, b, purin }: { x: number; y: number; b: string; purin: boolean }) {
  const r = BAZ_RENK[b];
  return (
    <g>
      <polygon points={altigen(x, y, 15)} fill={r} fillOpacity={0.16} stroke={r} strokeWidth={1.8} />
      {purin && <polygon points={besgen(x, y, 15)} fill={r} fillOpacity={0.16} stroke={r} strokeWidth={1.8} />}
      <text x={x} y={y + 5} fontSize={14} fontWeight={800} fill={r} textAnchor="middle">{b}</text>
    </g>
  );
}

function Nukleotit() {
  const bazlar = [
    { b: "A", ad: "adenin", p: true }, { b: "G", ad: "guanin", p: true },
    { b: "T", ad: "timin", p: false }, { b: "C", ad: "sitozin", p: false },
  ];
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label="Nükleotit: fosfat, deoksiriboz ve baz. Dört baz: adenin, guanin, timin, sitozin">
      <g>
        <circle cx={70} cy={56} r={17} fill="var(--c4)" fillOpacity={0.2} stroke="var(--c4)" strokeWidth={1.8} />
        <text x={70} y={61} fontSize={14} fontWeight={800} fill="#b47f0c" textAnchor="middle">P</text>
        <line x1={87} y1={56} x2={124} y2={56} stroke="var(--ink)" strokeWidth={1.6} />
        <polygon points="150,34 174,50 165,78 135,78 126,50" fill="var(--c2)" fillOpacity={0.14} stroke="var(--c2)" strokeWidth={1.8} />
        <line x1={174} y1={56} x2={212} y2={56} stroke="var(--ink)" strokeWidth={1.6} />
        <rect x={212} y={40} width={58} height={32} rx={7} fill="var(--line)" stroke="var(--muted)" strokeWidth={1.4} />
        <text x={241} y={61} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">baz</text>
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={70} y={98}>fosfat</text>
        <text x={150} y={98}>deoksiriboz</text>
        <text x={241} y={98}>A, G, T ya da C</text>
      </g>
      <line x1={20} y1={116} x2={320} y2={116} stroke="var(--line)" />
      {bazlar.map((z, i) => {
        const x = 46 + i * 78;
        return (
          <g key={z.b}>
            <Halka x={x} y={158} b={z.b} purin={z.p} />
            <text x={x + (z.p ? 10 : 0)} y={198} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">{z.ad}</text>
          </g>
        );
      })}
      <text x={170} y={228} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">Halkaları say: ikisi çift halkalı, ikisi tek halkalı.</text>
    </svg>
  );
}

/* ---------- baz eşleşmesi ---------- */

const KALIP = "ATGCAG";

function Eslesme({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const x = (i: number) => 60 + i * 44, Y1 = 70, Y2 = 150;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`Üst iplik 5'-${KALIP}-3'. Karşı iplik ${u >= 1 ? "3'-TACGTC-5'" : "henüz tamamlanmadı"}`}>
      <g>
        <line x1={x(0) - 22} y1={Y1 - 22} x2={x(5) + 22} y2={Y1 - 22} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
        <text x={x(0) - 30} y={Y1 - 18} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="end">5'</text>
        <text x={x(5) + 30} y={Y1 - 18} fontSize={12} fontWeight={800} fill="var(--ink)">3'</text>
      </g>
      <g>
        {[...KALIP].map((b, i) => <g key={i}><line x1={x(i)} y1={Y1 - 22} x2={x(i)} y2={Y1 - 13} stroke="var(--ink)" strokeWidth={2} /><Baz x={x(i)} y={Y1} b={b} /></g>)}
      </g>
      <g>
        {[...KALIP].map((b, i) => {
          const gel = u > (i + 0.5) / 6;
          const e = ES[b], n = b === "G" || b === "C" ? 3 : 2;
          return gel ? (
            <g key={i} className="ad-belir">
              {Array.from({ length: n }, (_, k) => {
                const dx = (k - (n - 1) / 2) * 6;
                return <line key={k} x1={x(i) + dx} y1={Y1 + 14} x2={x(i) + dx} y2={Y2 - 14} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="3 3" />;
              })}
              <Baz x={x(i)} y={Y2} b={e} />
              <line x1={x(i)} y1={Y2 + 13} x2={x(i)} y2={Y2 + 22} stroke={YESIL} strokeWidth={2} />
            </g>
          ) : (
            <BosBaz key={i} x={x(i)} y={Y2} />
          );
        })}
      </g>
      <g opacity={u >= 1 ? 1 : 0.25}>
        <line x1={x(0) - 22} y1={Y2 + 22} x2={x(5) + 22} y2={Y2 + 22} stroke={YESIL} strokeWidth={3} strokeLinecap="round" />
        <text x={x(0) - 30} y={Y2 + 26} fontSize={12} fontWeight={800} fill={YESIL} textAnchor="end">3'</text>
        <text x={x(5) + 30} y={Y2 + 26} fontSize={12} fontWeight={800} fill={YESIL}>5'</text>
      </g>
      <text x={170} y={210} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">kesikli çizgi: hidrojen bağı (A=T iki, G≡C üç)</text>
    </svg>
  );
}

/* ---------- Chargaff ---------- */

function Chargaff({ v }: SahneProps) {
  const A = sinir(v.A ?? 50, 0, 100), G = 100 - A, H = 2 * A + 3 * G;
  const cubuk = [{ b: "A", n: A }, { b: "T", n: A }, { b: "G", n: G }, { b: "C", n: G }];
  const Y0 = 180, OL = 1.2;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`100 baz çiftlik DNA: A ${A}, T ${A}, G ${G}, C ${G}; ${H} hidrojen bağı`}>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">100 baz çiftlik DNA</text>
      <text x={20} y={42} fontSize={11.5} fontWeight={600} fill="var(--muted)">toplam 200 baz</text>
      <g>
        <line x1={30} y1={Y0} x2={230} y2={Y0} stroke="var(--ink)" strokeWidth={1.4} />
        {cubuk.map((c, i) => {
          const x = 44 + i * 48, h = c.n * OL;
          return (
            <g key={c.b}>
              <rect x={x} y={Y0 - h} width={32} height={Math.max(0, h)} rx={4} fill={BAZ_RENK[c.b]} fillOpacity={0.75} />
              <text x={x + 16} y={Y0 - h - 6} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{c.n}</text>
              <text x={x + 16} y={Y0 + 17} fontSize={13} fontWeight={800} fill={BAZ_RENK[c.b]} textAnchor="middle">{c.b}</text>
            </g>
          );
        })}
      </g>
      <g fontSize={12} fontWeight={700}>
        <text x={250} y={80} fill="var(--ink)">A = T = {A}</text>
        <text x={250} y={102} fill="var(--ink)">G = C = {G}</text>
        <text x={250} y={136} fill="var(--muted)" fontWeight={600}>H bağı:</text>
        <text x={250} y={156} fill="var(--muted)" fontWeight={600}>2·{A} + 3·{G}</text>
        <text x={250} y={180} fontSize={15} fontWeight={800} fill={H === 270 ? YESIL : "var(--ink)"}>= {H}</text>
      </g>
      <text x={170} y={228} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">A + G = T + C = 100 (pürin = pirimidin)</text>
    </svg>
  );
}

/* ---------- yarı korunumlu eşlenme ---------- */

const AGIR = "var(--c5)", HAFIF = "#8fbcf2";

function Molekul({ x, y, ust, alt }: { x: number; y: number; ust: string; alt: string }) {
  return (
    <g>
      <line x1={x - 26} y1={y - 4} x2={x + 26} y2={y - 4} stroke={ust} strokeWidth={5} strokeLinecap="round" />
      <line x1={x - 26} y1={y + 4} x2={x + 26} y2={y + 4} stroke={alt} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

function Eslenme({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const k1 = u > 0.3, k2 = u > 0.7;
  const sutun = [
    { x: 54, m: [[AGIR, AGIR]], not: "1 ağır", on: true },
    { x: 164, m: [[AGIR, HAFIF], [HAFIF, AGIR]], not: "2 hibrit", on: k1 },
    { x: 280, m: [[AGIR, HAFIF], [HAFIF, HAFIF], [HAFIF, HAFIF], [HAFIF, AGIR]], not: "2 hibrit + 2 hafif", on: k2 },
  ];
  const yy = (n: number, j: number) => 108 + (j - (n - 1) / 2) * 30;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Eşlenme: ${k2 ? "2. kuşakta 2 hibrit, 2 hafif DNA" : k1 ? "1. kuşakta 2 hibrit DNA" : "başlangıçta 1 ağır DNA"}`}>
      <g fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        <text x={54} y={30}>başlangıç</text>
        <text x={164} y={30}>1. eşlenme</text>
        <text x={280} y={30}>2. eşlenme</text>
      </g>
      {sutun.map((c, i) => (
        <g key={i} opacity={c.on ? 1 : 0.12}>
          {c.m.map(([a, b], j) => <Molekul key={j} x={c.x} y={yy(c.m.length, j)} ust={a} alt={b} />)}
          <text x={c.x} y={186} fontSize={12} fontWeight={700} fill={c.on ? "var(--ink)" : "var(--muted)"} textAnchor="middle">{c.on ? c.not : "?"}</text>
        </g>
      ))}
      <g stroke="var(--muted)" strokeWidth={1.6} fill="none" strokeLinecap="round">
        <path d="M90 108 L120 108 M114 103 L120 108 L114 113" opacity={k1 ? 1 : 0.25} />
        <path d="M200 108 L232 108 M226 103 L232 108 L226 113" opacity={k2 ? 1 : 0.25} />
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <line x1={40} y1={214} x2={64} y2={214} stroke={AGIR} strokeWidth={5} strokeLinecap="round" />
        <text x={70} y={218} fill="var(--ink)">eski iplik (¹⁵N, ağır)</text>
        <line x1={200} y1={214} x2={224} y2={214} stroke={HAFIF} strokeWidth={5} strokeLinecap="round" />
        <text x={230} y={218} fill="var(--ink)">yeni (¹⁴N)</text>
      </g>
    </svg>
  );
}

/* ---------- eşlenme çatalı ---------- */

function Catal({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const fx = ara(120, 236, u), Y1 = 112, Y2 = 128;
  // Açılmış kollar: çataldan sola doğru ayrılır.
  const ust = (k: number) => ({ x: ara(fx, 24, k), y: ara(Y1, 52, k) });
  const alt = (k: number) => ({ x: ara(fx, 24, k), y: ara(Y2, 188, k) });
  const basamak = Array.from({ length: 12 }, (_, i) => 236 + 7 + i * 7).filter((x) => x > fx + 4 && x < 322);
  const sabit = Array.from({ length: 30 }, (_, i) => 120 + i * 7).filter((x) => x > fx + 4 && x < 236);
  // Yeni iplikler kollara paralel, içe doğru 9 px kayık.
  const kayik = (p: { x: number; y: number }, d: number) => ({ x: p.x, y: p.y + d });
  const yeniUst = [0.12, 0.95].map((k) => kayik(ust(k), 9));
  const parca = [[0.1, 0.36], [0.42, 0.68], [0.74, 0.92]].filter(([, b]) => b < 0.95);
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label="Eşlenme çatalı: helikaz iplikleri açar, DNA polimeraz yeni iplikleri örer, ligaz parçaları birleştirir">
      <g>
        <line x1={fx} y1={Y1} x2={322} y2={Y1} stroke={AGIR} strokeWidth={4} strokeLinecap="round" />
        <line x1={fx} y1={Y2} x2={322} y2={Y2} stroke={AGIR} strokeWidth={4} strokeLinecap="round" />
        {[...sabit, ...basamak].map((x) => <line key={x} x1={x} y1={Y1 + 3} x2={x} y2={Y2 - 3} stroke="var(--line-2)" strokeWidth={2} />)}
      </g>
      <g>
        <line x1={ust(0).x} y1={ust(0).y} x2={ust(1).x} y2={ust(1).y} stroke={AGIR} strokeWidth={4} strokeLinecap="round" />
        <line x1={alt(0).x} y1={alt(0).y} x2={alt(1).x} y2={alt(1).y} stroke={AGIR} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g>
        <line x1={yeniUst[1].x} y1={yeniUst[1].y} x2={yeniUst[0].x} y2={yeniUst[0].y} stroke={YESIL} strokeWidth={4} strokeLinecap="round" />
        {parca.map(([a, b], i) => {
          const p = kayik(alt(a), -9), q = kayik(alt(b), -9);
          return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={YESIL} strokeWidth={4} strokeLinecap="round" />;
        })}
      </g>
      <g>
        <circle cx={fx + 2} cy={(Y1 + Y2) / 2} r={11} fill="var(--c4)" fillOpacity={0.9} />
        <ellipse cx={yeniUst[0].x - 6} cy={yeniUst[0].y + 2} rx={13} ry={9} fill="var(--c1)" fillOpacity={0.85} />
        <ellipse cx={kayik(alt(0.36), -9).x - 4} cy={kayik(alt(0.36), -9).y - 2} rx={13} ry={9} fill="var(--c1)" fillOpacity={0.85} />
        <circle cx={kayik(alt(0.71), -9).x} cy={kayik(alt(0.71), -9).y} r={5} fill="var(--c2)" />
      </g>
      <g fontSize={12} fontWeight={700}>
        {u > 0 && <text x={fx + 2} y={88} fill="#b47f0c" textAnchor="middle">helikaz</text>}
        {u > 0 && <line x1={fx + 2} y1={92} x2={fx + 2} y2={106} stroke="#b47f0c" strokeWidth={1.2} />}
        <text x={fx - 95} y={124} fill="var(--c1)" textAnchor="middle" opacity={sinir((u - 0.5) * 4, 0, 1)}>DNA polimeraz</text>
        {u > 0 && <text x={kayik(alt(0.71), -9).x + 10} y={alt(0.71).y + 16} fill="var(--c2)">ligaz</text>}
        <text x={322} y={152} fill="var(--muted)" textAnchor="end" fontWeight={600}>açılmamış DNA</text>
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <line x1={40} y1={222} x2={64} y2={222} stroke={AGIR} strokeWidth={4} strokeLinecap="round" />
        <text x={70} y={226} fill="var(--ink)">eski (kalıp) iplik</text>
        <line x1={190} y1={222} x2={214} y2={222} stroke={YESIL} strokeWidth={4} strokeLinecap="round" />
        <text x={220} y={226} fill="var(--ink)">yeni iplik</text>
      </g>
    </svg>
  );
}

/* ---------- PCR ---------- */

function Pcr({ v }: SahneProps) {
  const n = sinir(v.n ?? 1, 0, 12), kopya = 2 ** n;
  const Y0 = 196, x = (i: number) => 32 + i * 23;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`PCR: ${n} döngüde ${kopya} kopya`}>
      <g fontSize={11.5} fontWeight={700}>
        {[{ t: "95 °C ayrıl", r: "var(--c2)" }, { t: "55 °C primer", r: "var(--c1)" }, { t: "72 °C ör", r: YESIL }].map((a, i) => (
          <g key={i}>
            <rect x={20 + i * 104} y={12} width={94} height={24} rx={12} fill={a.r} fillOpacity={0.14} />
            <text x={67 + i * 104} y={28} fill={a.r} textAnchor="middle">{a.t}</text>
          </g>
        ))}
      </g>
      <text x={20} y={62} fontSize={14} fontWeight={800} fill={kopya >= 1000 ? YESIL : "var(--ink)"}>
        {n} döngü: 2<tspan fontSize={10} dy={-6}>{n}</tspan><tspan dy={6}> = {kopya.toLocaleString("tr-TR").replace(/\./g, " ")} kopya</tspan>
      </text>
      <g>
        <line x1={24} y1={Y0} x2={320} y2={Y0} stroke="var(--ink)" strokeWidth={1.4} />
        {Array.from({ length: 13 }, (_, i) => {
          const h = 8 + i * 8.5, on = i <= n;
          return (
            <g key={i}>
              <rect x={x(i)} y={Y0 - h} width={16} height={h} rx={3} fill={on ? YESIL : "var(--line)"} fillOpacity={on ? 0.25 + (0.6 * i) / 12 : 1} />
              <text x={x(i) + 8} y={Y0 + 15} fontSize={11} fill="var(--muted)" textAnchor="middle">{i}</text>
            </g>
          );
        })}
      </g>
      <text x={170} y={228} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">her döngüde kopya sayısı 2 katına çıkar (sütunlar log ölçekte)</text>
    </svg>
  );
}

/* ---------- transkripsiyon ---------- */

const KODLAYAN = "ATGCCTTTA";

function Transkripsiyon({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = s.son === true ? 1 : ilerleme(t, oynuyor, sure);
  const x = (i: number) => 44 + i * 29 + Math.floor(i / 3) * 8;
  const kalip = [...KODLAYAN].map((b) => ES[b]);
  const mrna = kalip.map((b) => RNA_ES[b]);
  const n = Math.floor(u * 9 + 1e-6), px = ara(x(0), x(8), sinir(u));
  const Y1 = 44, Y2 = 108, Y3 = 172;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kalıp iplik 3'-${kalip.join("")}-5'; mRNA 5'-${mrna.slice(0, n).join("")}`}>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={20} y={Y1 - 18}>kodlayan iplik 5'→3'</text>
        <text x={20} y={Y2 - 18} fill="var(--ink)">kalıp iplik 3'→5' (okunan)</text>
        <text x={20} y={Y3 - 18} fill={YESIL}>mRNA 5'→3'</text>
      </g>
      <g>{[...KODLAYAN].map((b, i) => <Baz key={i} x={x(i)} y={Y1} b={b} soluk />)}</g>
      <g>{kalip.map((b, i) => <Baz key={i} x={x(i)} y={Y2} b={b} />)}</g>
      {u > 0 && u < 1 && (
        <g>
          <ellipse cx={px} cy={(Y2 + Y3) / 2} rx={22} ry={40} fill="var(--c5)" fillOpacity={0.14} stroke="var(--c5)" strokeWidth={1.4} />
          <text x={Math.min(px, 268)} y={Y3 + 40} fontSize={11.5} fontWeight={700} fill="var(--c5)" textAnchor="middle">RNA polimeraz</text>
        </g>
      )}
      <g>{mrna.map((b, i) => (i < n ? <g key={i} className="ad-belir"><Baz x={x(i)} y={Y3} b={b} /></g> : <BosBaz key={i} x={x(i)} y={Y3} />))}</g>
      {u >= 1 && <text x={170} y={226} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">mRNA = kodlayan iplik, T yerine U</text>}
    </svg>
  );
}

/* ---------- kodon okuma ---------- */

const MRNA_K = "AUGGCUUGGAAAUAA";

function Kodon({ v }: SahneProps) {
  const k = sinir(v.k ?? 0, 0, 5), kd = kodonlar(MRNA_K);
  const x = (i: number) => 36 + i * 16 + Math.floor(i / 3) * 12;
  const okunan = kd.slice(0, k), aa = okunan.map((c) => KOD[c]).filter((a) => a !== "dur");
  const durdu = okunan.includes("UAA");
  const bag = Math.max(0, aa.length - 1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${k} kodon okundu: ${aa.join("-") || "henüz amino asit yok"}${durdu ? ", dur" : ""}`}>
      <g>
        {aa.map((a, i) => {
          const cx = 50 + i * 62;
          return (
            <g key={i} className="ad-belir">
              {i > 0 && <line x1={cx - 62 + 22} y1={56} x2={cx - 22} y2={56} stroke="var(--ink)" strokeWidth={2.2} />}
              <circle cx={cx} cy={56} r={22} fill={YESIL} fillOpacity={0.16 + i * 0.1} stroke={YESIL} strokeWidth={1.6} />
              <text x={cx} y={61} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{a}</text>
            </g>
          );
        })}
        {durdu && <text x={50 + aa.length * 62 - 16} y={61} fontSize={13} fontWeight={800} fill="var(--c2)" className="ad-belir">DUR</text>}
      </g>
      <g>
        {[...MRNA_K].map((b, i) => <Baz key={i} x={x(i)} y={140} b={b} w={14} soluk={Math.floor(i / 3) >= k} />)}
      </g>
      <g>
        {kd.map((c, j) => {
          const on = j < k, x0 = x(j * 3) - 8, x1 = x(j * 3 + 2) + 8;
          return (
            <g key={j} opacity={on ? 1 : 0.35}>
              <path d={`M${x0} 118 L${x0} 112 L${x1} 112 L${x1} 118`} fill="none" stroke={on ? "var(--ink)" : "var(--line-2)"} strokeWidth={1.4} />
              <text x={(x0 + x1) / 2} y={176} fontSize={12} fontWeight={700} fill={KOD[c] === "dur" ? "var(--c2)" : "var(--ink)"} textAnchor="middle">{on ? KOD[c] : "?"}</text>
            </g>
          );
        })}
      </g>
      <text x={20} y={212} fontSize={12.5} fontWeight={700} fill="var(--ink)">{aa.length} amino asit · {bag} peptit bağı</text>
      <text x={20} y={229} fontSize={11.5} fontWeight={600} fill="var(--muted)">mRNA 5'→3' yönünde üçer üçer okunur</text>
    </svg>
  );
}

/* ---------- ribozomda translasyon ---------- */

const RIB = ["AUG", "GCU", "UGG", "AAA", "UAA"];
const ANTI = (c: string) => [...c].map((b) => ({ A: "U", U: "A", G: "C", C: "G" })[b]).join("");

function TRNA({ x, y, kodon, aa, op = 1 }: { x: number; y: number; kodon: string; aa?: string; op?: number }) {
  return (
    <g opacity={op}>
      <path d={`M${x - 18} ${y + 52} L${x - 18} ${y + 30} Q${x - 18} ${y + 22} ${x - 10} ${y + 22} L${x + 10} ${y + 22} Q${x + 18} ${y + 22} ${x + 18} ${y + 30} L${x + 18} ${y + 52} Z`} fill="var(--c4)" fillOpacity={0.3} stroke="#b47f0c" strokeWidth={1.4} />
      <line x1={x} y1={y + 22} x2={x} y2={y + 10} stroke="#b47f0c" strokeWidth={2} />
      <text x={x} y={y + 47} fontSize={11.5} fontWeight={800} fill="#8a5f05" textAnchor="middle">{ANTI(kodon)}</text>
      {aa && <circle cx={x} cy={y} r={11} fill={YESIL} fillOpacity={0.35} stroke={YESIL} strokeWidth={1.4} />}
      {aa && <text x={x} y={y + 4} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">{aa}</text>}
    </g>
  );
}

function Ribozom({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const gel = sinir(u / 0.3), aktar = u > 0.42, kay = sinir((u - 0.5) / 0.3), cik = sinir((u - 0.82) / 0.18);
  const P = 170, W = 50, MY = 176, TY = 112;
  const cx = (j: number) => P + (j - 1) * W - kay * W;
  const zincir = aktar ? ["Met", "Ala", "Trp"] : ["Met", "Ala"];
  const tasiyan = aktar ? 2 : 1;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label="Ribozom: yeni tRNA A bölgesine girer, zincir ona aktarılır, ribozom bir kodon kayar, boş tRNA E bölgesinden çıkar">
      <g>
        <ellipse cx={P} cy={118} rx={98} ry={52} fill="var(--c1)" fillOpacity={0.08} stroke="var(--c1)" strokeOpacity={0.5} strokeWidth={1.4} />
        <ellipse cx={P} cy={196} rx={92} ry={20} fill="var(--c1)" fillOpacity={0.1} stroke="var(--c1)" strokeOpacity={0.5} strokeWidth={1.4} />
        {["E", "P", "A"].map((a, i) => (
          <text key={a} x={P + (i - 1) * W} y={207} fontSize={13} fontWeight={800} fill="var(--c1)" textAnchor="middle">{a}</text>
        ))}
      </g>
      <g>
        <line x1={14} y1={MY} x2={326} y2={MY} stroke="var(--ink)" strokeWidth={1.6} />
        {RIB.map((c, j) => {
          const x0 = cx(j);
          if (x0 < 26 || x0 > 312) return null;
          return [...c].map((b, k) => <Baz key={`${j}${k}`} x={x0 + (k - 1) * 15} y={MY} b={b} w={14} />);
        })}
      </g>
      <TRNA x={cx(1)} y={TY - cik * 70} kodon={RIB[1]} aa={tasiyan === 1 ? "Ala" : undefined} op={1 - cik} />
      {gel > 0 && <TRNA x={cx(2)} y={TY - (1 - gel) * 80} kodon={RIB[2]} aa="Trp" op={gel} />}
      <g>
        {zincir.slice(0, -1).reverse().map((a, i) => {
          const hx = cx(tasiyan) - 20 - i * 22, hy = TY - 16 - i * 12;
          return (
            <g key={a}>
              <circle cx={hx} cy={hy} r={11} fill={YESIL} fillOpacity={0.35} stroke={YESIL} strokeWidth={1.4} />
              <text x={hx} y={hy + 4} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">{a}</text>
            </g>
          );
        })}
      </g>
      {aktar && u < 0.5 && <text x={cx(2) + 22} y={TY - 20} fontSize={11.5} fontWeight={800} fill="var(--c2)" className="ad-belir">peptit bağı</text>}
      <text x={170} y={232} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        {u === 0 ? "P'de zincir, A boş" : u < 0.42 ? "UGG'ye uyan tRNA A'ya geliyor" : u < 0.5 ? "zincir A'daki tRNA'ya aktarıldı" : u < 0.82 ? "ribozom bir kodon kayıyor" : "boş tRNA E'den çıkıyor"}
      </text>
    </svg>
  );
}

/* ---------- peptit hesabı ---------- */

function Hesap({ v }: SahneProps) {
  const n = Math.round(sinir(v.n ?? 10, 1, 300));
  const satir = [
    { a: "amino asit", d: `${n}` },
    { a: "kodon (dur dahil)", d: `${n} + 1 = ${n + 1}` },
    { a: "mRNA nükleotidi", d: `3 · ${n + 1} = ${3 * (n + 1)}`, vurgu: 3 * (n + 1) === 453 },
    { a: "DNA nükleotidi (en az)", d: `6 · ${n + 1} = ${6 * (n + 1)}` },
    { a: "peptit bağı = açığa çıkan su", d: `${n} − 1 = ${n - 1}` },
  ];
  const boncuk = Math.min(n, 14);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${n} amino asit: ${3 * (n + 1)} mRNA nükleotidi, ${n - 1} peptit bağı`}>
      <g>
        {Array.from({ length: boncuk }, (_, i) => (
          <circle key={i} cx={26 + i * 21} cy={30} r={8} fill={YESIL} fillOpacity={0.2 + (0.5 * i) / 14} stroke={YESIL} strokeWidth={1.2} />
        ))}
        {n > 14 && <text x={26 + 14 * 21 - 4} y={35} fontSize={14} fontWeight={800} fill="var(--muted)">…</text>}
      </g>
      {satir.map((r, i) => (
        <g key={i}>
          <text x={20} y={78 + i * 34} fontSize={12} fontWeight={600} fill="var(--muted)">{r.a}</text>
          <text x={320} y={78 + i * 34} fontSize={14} fontWeight={800} fill={r.vurgu ? YESIL : "var(--ink)"} textAnchor="end">{r.d}</text>
          <line x1={20} y1={88 + i * 34} x2={320} y2={88 + i * 34} stroke="var(--line)" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- nokta mutasyonu: orak hücre ---------- */

const BETA = ["ACU", "CCU", "GAG", "GAG"]; // β-globin 4.–7. kodonlar (mRNA)

function Mutasyon({ v }: SahneProps) {
  const b2 = v.b2 === 1, b3 = v.b3 === 1;
  const k6 = `G${b2 ? "U" : "A"}${b3 ? "A" : "G"}`;
  const kd = [BETA[0], BETA[1], k6, BETA[3]];
  const aa = kd.map((c) => KOD[c]), orak = aa[2] === "Val";
  const x = (j: number, k: number) => 40 + j * 78 + k * 18;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`6. kodon ${k6}: ${aa[2]}. ${orak ? "Hemoglobin değişti, alyuvar orak biçimli" : "Alyuvar normal"}`}>
      <text x={20} y={22} fontSize={12} fontWeight={700} fill="var(--muted)">β-globin mRNA, 4.–7. kodonlar</text>
      <g>
        {kd.map((c, j) =>
          [...c].map((b, k) => {
            const degisti = j === 2 && ((k === 1 && b2) || (k === 2 && b3));
            return <Baz key={`${j}${k}`} x={x(j, k)} y={50} b={b} w={17} cerceve={degisti ? "var(--bad)" : undefined} />;
          }),
        )}
      </g>
      <g>
        {aa.map((a, j) => {
          const cx = x(j, 1), farkli = j === 2 && a !== "Glu";
          return (
            <g key={j}>
              <text x={cx} y={84} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">{j + 4}.</text>
              <circle cx={cx} cy={108} r={18} fill={farkli ? "var(--c2)" : YESIL} fillOpacity={0.22} stroke={farkli ? "var(--c2)" : YESIL} strokeWidth={1.6} />
              <text x={cx} y={113} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{a}</text>
              {j < 3 && <line x1={cx + 18} y1={108} x2={x(j + 1, 1) - 18} y2={108} stroke="var(--ink)" strokeWidth={2} />}
            </g>
          );
        })}
      </g>
      <g key={String(orak)} className="ad-belir">
        {orak ? (
          <path d="M126 168 Q170 140 214 168 Q206 188 196 190 Q170 172 144 190 Q134 188 126 168 Z" fill="var(--c2)" fillOpacity={0.75} />
        ) : (
          <g>
            <ellipse cx={170} cy={176} rx={40} ry={20} fill="var(--c2)" fillOpacity={0.75} />
            <ellipse cx={170} cy={176} rx={17} ry={7} fill="#fff" fillOpacity={0.35} />
          </g>
        )}
      </g>
      <text x={170} y={226} fontSize={12} fontWeight={700} fill={orak ? "var(--c2)" : "var(--ink)"} textAnchor="middle">
        {orak ? "6. amino asit Val: alyuvar orak biçimli" : aa[2] === "Glu" && b3 ? "kodon değişti ama amino asit yine Glu" : "normal alyuvar: yuvarlak, ortası basık"}
      </text>
    </svg>
  );
}

/* ---------- çerçeve kayması ---------- */

const NORMAL = "AUGGCUAAGUGGGGCUAA";

function Cerceve({ v }: SahneProps) {
  const ek = v.ek === 1;
  const dizi = ek ? NORMAL.slice(0, 6) + "U" + NORMAL.slice(6) : NORMAL;
  const kd = kodonlar(dizi), aa: string[] = [];
  for (const c of kd) { const a = KOD[c]; aa.push(a); if (a === "dur") break; }
  const x = (i: number) => 22 + i * 15 + Math.floor(i / 3) * 4;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${ek ? "Bir U eklendi: " : "Normal: "}${aa.join("-")}`}>
      <text x={20} y={24} fontSize={12} fontWeight={700} fill="var(--muted)">{ek ? "3. kodondan önce bir U eklendi" : "normal mRNA"}</text>
      <g>
        {[...dizi].map((b, i) => (
          <Baz key={`${ek}${i}`} x={x(i)} y={60} b={b} w={14} soluk={Math.floor(i / 3) >= aa.length} cerceve={ek && i === 6 ? "var(--bad)" : undefined} />
        ))}
      </g>
      <g>
        {kd.slice(0, aa.length).map((c, j) => {
          const x0 = x(j * 3) - 7, x1 = x(j * 3 + 2) + 7;
          return <path key={`${ek}${j}`} d={`M${x0} 76 L${x0} 82 L${x1} 82 L${x1} 76`} fill="none" stroke="var(--ink)" strokeWidth={1.4} />;
        })}
      </g>
      <g key={String(ek)} className="ad-belir">
        {aa.map((a, j) => {
          const cx = 40 + j * 52, dur = a === "dur";
          return (
            <g key={j}>
              {j > 0 && <line x1={cx - 52 + 19} y1={130} x2={cx - 19} y2={130} stroke="var(--ink)" strokeWidth={2} opacity={dur ? 0 : 1} />}
              <circle cx={cx} cy={130} r={19} fill={dur ? "none" : YESIL} fillOpacity={0.22} stroke={dur ? "var(--c2)" : YESIL} strokeWidth={1.6} strokeDasharray={dur ? "4 3" : undefined} />
              <text x={cx} y={135} fontSize={12} fontWeight={800} fill={dur ? "var(--c2)" : "var(--ink)"} textAnchor="middle">{a}</text>
            </g>
          );
        })}
      </g>
      <text x={20} y={190} fontSize={12.5} fontWeight={700} fill="var(--ink)">protein: {aa.filter((a) => a !== "dur").length} amino asit</text>
      <text x={20} y={210} fontSize={11.5} fontWeight={600} fill="var(--muted)">{ek ? "eklemeden sonraki bütün kodonlar değişti" : "okuma AUG'den başlar, üçer üçer gider"}</text>
    </svg>
  );
}

export const BIYOLOJI7: Record<string, SahneKaydi> = {
  "biy7-nukleotit": { C: Nukleotit },
  "biy7-eslesme": { C: Eslesme },
  "biy7-chargaff": { C: Chargaff },
  "biy7-eslenme": { C: Eslenme },
  "biy7-catal": { C: Catal },
  "biy7-pcr": { C: Pcr },
  "biy7-transkripsiyon": { C: Transkripsiyon },
  "biy7-kodon": { C: Kodon },
  "biy7-ribozom": { C: Ribozom },
  "biy7-hesap": { C: Hesap },
  "biy7-mutasyon": { C: Mutasyon },
  "biy7-cerceve": { C: Cerceve },
};
