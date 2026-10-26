"use client";
// Fizik sahneleri (basınç, kaldırma kuvveti): süngerdeki tuğlalar, kar ayakkabısı, derinlik, kabın şekli,
// hidrolik kaldıraç, yükseklik ve kaynama; basınç farkı, dinamometre, farklı sıvılar, gemi, denizaltı, balon.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const say = (x: number, d = 2) => x.toLocaleString("tr-TR", { maximumFractionDigits: d });

/** (x1, y1)'den (x2, y2)'ye ok; uç (x2, y2)'dedir. */
function Ok({ x1, y1, x2, y2, renk, kalin = 3 }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, u = Math.min(9, L * 0.6);
  const bx = x2 - ux * u, by = y2 - uy * u;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${bx - uy * 5.5} ${by + ux * 5.5} L${bx + uy * 5.5} ${by - ux * 5.5} Z`} fill={renk} />
    </g>
  );
}

/* ---------- basınç ---------- */

// Aynı iki tuğla (20 N) süngere bırakılır (sure 2): biri dik (50 cm²), biri yatık (200 cm²).
function Tugla({ t, oynuyor }: SahneProps) {
  const u = oynuyor || t > 0 ? yumusak(t / 0.8) : 0, b = oynuyor || t > 0 ? yumusak((t - 0.8) / 0.9) : 0;
  const SUN = 160, bitti = !oynuyor && t > 0;
  const tug = [
    { x: 100, w: 22, h: 88, P: 4000, cukur: 26, ad: "dik" },
    { x: 240, w: 88, h: 22, P: 1000, cukur: 6.5, ad: "yatık" },
  ];
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label="Aynı iki tuğla süngerin üstünde: biri dik, biri yatık">
      <path
        d={`M24 ${SUN} L${100 - 11} ${SUN} Q100 ${SUN + 2 * tug[0].cukur * b} ${100 + 11} ${SUN} L${240 - 44} ${SUN} Q240 ${SUN + 2 * tug[1].cukur * b} ${240 + 44} ${SUN} L316 ${SUN} L316 206 L24 206 Z`}
        fill="var(--c4)"
        opacity={0.35}
      />
      {tug.map((k) => {
        const y = SUN - k.h - 34 * (1 - u) + k.cukur * b;
        return (
          <g key={k.ad}>
            <rect x={k.x - k.w / 2} y={y} width={k.w} height={k.h} rx={2} fill="var(--c2)" />
            <text x={k.x} y={226} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">
              {k.ad}: {k.ad === "dik" ? "50" : "200"} cm²
            </text>
            <text x={k.x} y={244} fontSize={12} fill={bitti ? "var(--fizik)" : "var(--muted)"} fontWeight={bitti ? 800 : 400} textAnchor="middle">
              {bitti ? `P = ${say(k.P)} Pa` : "ağırlık 20 N"}
            </text>
          </g>
        );
      })}
      <text x={36} y={198} fontSize={12} fontWeight={700} fill="#b7800d">sünger</text>
    </svg>
  );
}

// 600 N ağırlığındaki biri karda; v.A: ayak tabanı alanı × 100 (m²). Kar en çok 3000 Pa taşır.
function Kar({ v }: SahneProps) {
  const A = (v.A ?? 4) / 100, P = 600 / A, KAR = 150;
  const tasir = P <= 3000, w = 24 + (v.A ?? 4) * 8, gom = Math.min(56, (P / 30000) * 56);
  const y = KAR + gom;
  return (
    <svg viewBox="0 0 340 254" role="img" aria-label={`Taban alanı ${say(A)} metrekare, basınç ${Math.round(P)} paskal`}>
      <rect x={20} y={KAR} width={300} height={66} fill="#e6ebf2" />
      <line x1={20} x2={320} y1={KAR} y2={KAR} stroke="var(--line-2)" strokeWidth={2} />
      <g>
        <rect x={170 - 30} y={y - 82} width={60} height={70} rx={10} fill="var(--c1)" />
        <text x={170} y={y - 42} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle">600 N</text>
        <rect x={170 - w / 2} y={y - 12} width={w} height={12} rx={4} fill="var(--ink)" />
      </g>
      <Ok x1={170} y1={22} x2={170} y2={y - 88} renk="var(--c2)" />
      <text x={180} y={34} fontSize={12} fontWeight={700} fill="var(--c2)">ağırlık</text>
      <text x={170} y={234} fontSize={15} fontWeight={800} textAnchor="middle" fill={tasir ? "var(--good)" : "var(--ink)"}>
        P = 600 N ÷ {say(A)} m² = {say(Math.round(P))} Pa
      </text>
      <text x={170} y={251} fontSize={12} textAnchor="middle" fill={tasir ? "var(--good)" : "var(--bad)"} fontWeight={700}>
        {tasir ? "Kar taşıyor, gömülmüyorsun" : "Kara gömülüyorsun (kar en çok 3000 Pa taşır)"}
      </text>
    </svg>
  );
}

// Denizde derinlik. v.h: metre. P = h·d·g (d = 1000 kg/m³, g = 10 m/s²).
function Derinlik({ v }: SahneProps) {
  const h = v.h ?? 5, P = h * 1000 * 10, Y0 = 34, K = 4.2;
  const tam = P === 200000;
  return (
    <svg viewBox="0 0 340 252" role="img" aria-label={`${h} metre derinlikte suyun basıncı ${P} paskal`}>
      <rect x={20} y={Y0} width={170} height={40 * K + 8} fill="var(--c1)" opacity={0.18} />
      <line x1={20} x2={190} y1={Y0} y2={Y0} stroke="var(--c1)" strokeWidth={2} />
      <g fontSize={11} fill="var(--muted)">
        {[0, 10, 20, 30, 40].map((d) => (
          <g key={d}>
            <line x1={190} x2={198} y1={Y0 + d * K} y2={Y0 + d * K} stroke="var(--muted)" />
            <text x={202} y={Y0 + d * K + 4}>{d} m</text>
          </g>
        ))}
      </g>
      <line x1={105} x2={105} y1={Y0} y2={Y0 + h * K} stroke="var(--fizik)" strokeWidth={1.5} strokeDasharray="4 4" />
      <g>
        <circle cx={105} cy={Y0 + h * K} r={9} fill={tam ? "var(--good)" : "var(--fizik)"} />
        <circle cx={105} cy={Y0 + h * K} r={3.5} fill="#fff" />
      </g>
      <g fontSize={13} fontWeight={700}>
        <text x={234} y={86} fill="var(--muted)">h = {h} m</text>
        <text x={234} y={112} fill="var(--muted)">d = 1000 kg/m³</text>
        <text x={234} y={138} fill="var(--muted)">g = 10 m/s²</text>
      </g>
      <text x={170} y={240} fontSize={15} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        P = h·d·g = {say(P)} Pa
      </text>
    </svg>
  );
}

// Geniş, dar ve huni biçimli kaplar 20 cm'ye kadar dolar (sure 3).
function Kaplar({ t, oynuyor }: SahneProps) {
  const u = oynuyor || t > 0 ? yumusak(t / 2.4) : 0, bitti = !oynuyor && t > 0;
  const ALT = 186, H = 110, h = H * u; // 110 px = 20 cm
  const huni = (y: number) => 18 + ((ALT - y) / H) * 30; // yarım genişlik yükseldikçe artar
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label="Geniş, dar ve huni biçimli üç kap aynı yüksekliğe kadar su ile dolu">
      <g fill="var(--c1)" opacity={0.3}>
        <rect x={20} y={ALT - h} width={84} height={h} />
        <rect x={156} y={ALT - h} width={28} height={h} />
        <path d={`M${270 - huni(ALT - h)} ${ALT - h} L${270 + huni(ALT - h)} ${ALT - h} L${270 + 18} ${ALT} L${270 - 18} ${ALT} Z`} />
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth={2}>
        <path d={`M20 ${ALT - H - 22} L20 ${ALT} L104 ${ALT} L104 ${ALT - H - 22}`} />
        <path d={`M156 ${ALT - H - 22} L156 ${ALT} L184 ${ALT} L184 ${ALT - H - 22}`} />
        <path d={`M${270 - 18 - 36} ${ALT - H - 22} L${270 - 18} ${ALT} L${270 + 18} ${ALT} L${270 + 18 + 36} ${ALT - H - 22}`} />
      </g>
      <line x1={14} x2={326} y1={ALT - H} y2={ALT - H} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 4" />
      <text x={130} y={ALT - H - 6} fontSize={11} fill="var(--muted)" textAnchor="middle">20 cm</text>
      <g fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">
        <text x={62} y={ALT + 18}>geniş</text>
        <text x={170} y={ALT + 18}>dar</text>
        <text x={270} y={ALT + 18}>huni</text>
      </g>
      <g fontSize={12} fontWeight={800} fill="var(--fizik)" textAnchor="middle">
        {bitti && [62, 170, 270].map((x) => <text key={x} x={x} y={ALT + 36}>2000 Pa</text>)}
      </g>
    </svg>
  );
}

// Hidrolik kaldıraç: küçük piston 10 cm², üstüne 200 N. v.A2: büyük pistonun alanı (cm²). Araba 10 000 N.
function Hidrolik({ v }: SahneProps) {
  const A2 = v.A2 ?? 100, F2 = 200 * (A2 / 10);
  const hal = F2 < 10000 ? "Araba kalkmıyor" : F2 === 10000 ? "Dengede: araba havada duruyor" : "Araba yükseliyor";
  const ok = F2 >= 10000, ALT = 196, kucukX = 50, w = 40 + A2 * 0.14, bx = 128;
  const sv = ok ? 112 : 128; // büyük pistonun üst seviyesi
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`Büyük piston ${A2} santimetrekare, kuvvet ${F2} newton`}>
      <path
        d={`M${kucukX - 7} 96 L${kucukX - 7} ${ALT} L${bx + w} ${ALT} L${bx + w} ${sv + 8} L${bx} ${sv + 8} L${bx} ${ALT - 24} L${kucukX + 7} ${ALT - 24} L${kucukX + 7} 96 Z`}
        fill="var(--c1)"
        opacity={0.25}
      />
      <g fill="none" stroke="var(--ink)" strokeWidth={2}>
        <path d={`M${kucukX - 9} 70 L${kucukX - 9} ${ALT + 2} L${bx + w + 2} ${ALT + 2} L${bx + w + 2} 90`} />
        <path d={`M${kucukX + 9} 70 L${kucukX + 9} ${ALT - 22} L${bx - 2} ${ALT - 22} L${bx - 2} 90`} />
      </g>
      <g fill="var(--ink)">
        <rect x={kucukX - 8} y={88} width={16} height={8} rx={2} />
        <rect x={bx - 1} y={sv} width={w + 2} height={8} rx={2} />
      </g>
      <Ok x1={kucukX} y1={34} x2={kucukX} y2={84} renk="var(--c2)" />
      <text x={kucukX} y={24} fontSize={12.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">200 N</text>
      <g transform={`translate(${bx + w / 2} ${sv}) scale(1.4)`}>
        <path d="M-18 -4 L-18 -11 Q-18 -14 -15 -14 L-8 -14 L-3 -21 L8 -21 Q11 -21 12 -18 L14 -14 L16 -14 Q19 -14 19 -11 L19 -4 Z" fill="var(--fizik)" />
        <circle cx={-10} cy={-4} r={4.6} fill="var(--ink)" />
        <circle cx={11} cy={-4} r={4.6} fill="var(--ink)" />
      </g>
      <g fontSize={11.5} fill="var(--muted)" textAnchor="middle">
        <text x={kucukX} y={ALT + 20}>10 cm²</text>
        <text x={bx + w / 2} y={ALT + 20}>{A2} cm²</text>
        <text x={bx + w / 2} y={sv - 40}>araba 10.000 N</text>
      </g>
      <text x={170} y={238} fontSize={14} fontWeight={800} textAnchor="middle" fill={ok ? "var(--good)" : "var(--ink)"}>
        F₂ = 200 N × {A2} / 10 = {say(F2)} N
      </text>
      <text x={170} y={256} fontSize={12} fontWeight={700} textAnchor="middle" fill={ok ? "var(--good)" : "var(--muted)"}>{hal}</text>
    </svg>
  );
}

// Torricelli tüpü ve yükseklik. v.r: rakım (m). Basınç ≈ 76·e^(−r/8400) cmHg, kaynama ≈ 100 − r/300 °C.
function Rakim({ v }: SahneProps) {
  const r = v.r ?? 0, cm = 76 * Math.exp(-r / 8400), kay = 100 - r / 300;
  const ALT = 200, K = 1.9, tam = r === 6000;
  const dagY = 196 - (r / 9000) * 150;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Rakım ${r} metre: cıva ${Math.round(cm)} santimetre, su ${Math.round(kay)} derecede kaynar`}>
      <path d="M150 200 L245 46 L285 110 L300 92 L330 200 Z" fill="var(--line)" />
      <g>
        <circle cx={150 + ((200 - dagY) / 154) * 95} cy={dagY} r={6} fill="var(--fizik)" />
      </g>
      <g>
        <rect x={34} y={ALT - 6} width={60} height={20} rx={3} fill="#9aa8ba" opacity={0.6} />
        <rect x={56} y={ALT - cm * K} width={16} height={cm * K + 8} fill="#9aa8ba" />
        <path d={`M54 ${ALT + 8} L54 ${ALT - 80 * K - 6} Q64 ${ALT - 80 * K - 14} 74 ${ALT - 80 * K - 6} L74 ${ALT + 8}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
        <path d={`M30 ${ALT - 12} L30 ${ALT + 16} L98 ${ALT + 16} L98 ${ALT - 12}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      </g>
      <g fontSize={11} fill="var(--muted)">
        <line x1={78} x2={90} y1={ALT - cm * K} y2={ALT - cm * K} stroke="var(--fizik)" strokeWidth={1.5} />
        <text x={94} y={ALT - cm * K + 4} fill="var(--fizik)" fontWeight={800} fontSize={12.5}>{Math.round(cm)} cm</text>
        <text x={64} y={ALT + 32} textAnchor="middle">cıva</text>
      </g>
      <g fontSize={12.5} fontWeight={700}>
        <text x={170} y={24} fill="var(--ink)">Rakım: {say(r)} m</text>
        <text x={150 + ((200 - dagY) / 154) * 95 + 10} y={dagY + 4} fill="var(--fizik)" fontSize={11.5}>{r === 0 ? "deniz seviyesi" : "buradasın"}</text>
      </g>
      <text x={330} y={228} fontSize={14} fontWeight={800} textAnchor="end" fill={tam ? "var(--good)" : "var(--ink)"}>
        Su {Math.round(kay)} °C'de kaynar
      </text>
    </svg>
  );
}

/* ---------- kaldırma kuvveti ---------- */

// Suya batmış 10 cm'lik küp. v.h: üst yüzün derinliği (cm). Üst yüze h N, alt yüze h + 10 N.
function BasincFark({ v }: SahneProps) {
  const h = v.h ?? 20, Y0 = 34, K = 2.4, S = 40, CX = 130;
  const ust = Y0 + h * K, alt = ust + S;
  const L = (F: number) => 8 + F * 0.6;
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`Üst yüzü ${h} cm derinlikte küp: üstten ${h} N, alttan ${h + 10} N, kaldırma kuvveti 10 N`}>
      <rect x={20} y={Y0} width={220} height={196} fill="var(--c1)" opacity={0.16} />
      <line x1={20} x2={240} y1={Y0} y2={Y0} stroke="var(--c1)" strokeWidth={2} />
      <line x1={CX + S / 2 + 6} x2={CX + S / 2 + 6} y1={Y0} y2={ust} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
      <text x={CX + S / 2 + 10} y={(Y0 + ust) / 2 + 4} fontSize={11} fill="var(--muted)">{h} cm</text>
      <rect x={CX - S / 2} y={ust} width={S} height={S} rx={3} fill="#9aa8ba" />
      <Ok x1={CX} y1={ust - L(h) - 2} x2={CX} y2={ust - 2} renk="var(--c2)" />
      <Ok x1={CX} y1={alt + L(h + 10) + 2} x2={CX} y2={alt + 2} renk="var(--c3)" />
      <g>
        <Ok x1={CX - S / 2 - 26} y1={ust + S / 2} x2={CX - S / 2 - 3} y2={ust + S / 2} renk="var(--muted)" kalin={2} />
        <Ok x1={CX + S / 2 + 26} y1={ust + S / 2} x2={CX + S / 2 + 3} y2={ust + S / 2} renk="var(--muted)" kalin={2} />
      </g>
      <g fontSize={12.5} fontWeight={700}>
        <text x={252} y={70} fill="var(--c2)">üstten: {h} N ↓</text>
        <text x={252} y={96} fill="var(--c3)">alttan: {h + 10} N ↑</text>
        <text x={252} y={122} fill="var(--muted)" fontSize={11.5}>yanlar dengede</text>
        <line x1={252} x2={334} y1={136} y2={136} stroke="var(--line)" />
        <text x={252} y={158} fill="var(--fizik)" fontWeight={800}>fark: 10 N ↑</text>
      </g>
    </svg>
  );
}

// Dinamometreye asılı taş (5 N, 200 cm³) suya indirilir. v.V: batan hacim (cm³).
function Dinamometre({ v }: SahneProps) {
  const V = v.V ?? 0, Fk = V / 100, oku = 5 - Fk, SU = 150, TH = 54;
  const tasUst = SU - TH + (V / 200) * TH, uz = oku * 7;
  const tam = V === 200;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Batan hacim ${V} santimetreküp, dinamometre ${say(oku)} newton gösteriyor`}>
      <path d="M108 120 L108 210 L232 210 L232 120" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g>
        <line x1={170} x2={170} y1={4} y2={14} stroke="var(--ink)" strokeWidth={2} />
        <rect x={156} y={14} width={28} height={58} rx={6} fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={164} y={22} width={12} height={8 + uz} rx={2} fill="var(--c4)" />
        <line x1={170} x2={170} y1={30 + uz} y2={tasUst} stroke="var(--ink)" strokeWidth={1.5} />
      </g>
      <rect x={146} y={tasUst} width={48} height={TH} rx={10} fill="#7d8da3" />
      <rect x={110} y={SU} width={120} height={58} fill="var(--c1)" opacity={0.25} />
      <line x1={110} x2={230} y1={SU} y2={SU} stroke="var(--c1)" strokeWidth={2} />
      <g fontSize={13} fontWeight={700}>
        <text x={14} y={40} fill="var(--ink)">havada: 5 N</text>
        <text x={14} y={66} fill={tam ? "var(--good)" : "var(--fizik)"} fontWeight={800}>okunan: {say(oku)} N</text>
        <text x={248} y={180} fill="var(--c1)" fontSize={12}>batan:</text>
        <text x={248} y={198} fill="var(--c1)" fontSize={12}>{V} cm³</text>
      </g>
      <text x={170} y={238} fontSize={14} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        F<tspan fontSize={10} dy={3}>k</tspan><tspan dy={-3}> = 5 − {say(oku)} = {say(Fk)} N</tspan>
      </text>
    </svg>
  );
}

// 0,6 g/cm³'lük, 1000 cm³'lük tahta küp (6 N). v.dl: sıvının özkütlesi × 10.
function Sivilar({ v }: SahneProps) {
  const dl = (v.dl ?? 10) / 10, dc = 0.6, SU = 90, TABAN = 196, K = 60;
  const batar = dl < dc, askida = dl === dc, oran = batar || askida ? 1 : dc / dl;
  const ust = batar ? TABAN - K : askida ? (SU + TABAN) / 2 - K / 2 : SU - K * (1 - oran);
  const Fk = batar ? 10 * dl : 6, tam = v.dl === 12;
  const hal = batar ? "Batar" : askida ? "Askıda" : `Yüzer: batık kısım %${Math.round(oran * 100)}`;
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={`Sıvının özkütlesi ${say(dl)}: ${hal}`}>
      <rect x={140 - K / 2} y={ust} width={K} height={K} rx={3} fill="var(--c4)" />
      <rect x={52} y={SU} width={176} height={TABAN - SU} fill="var(--c5)" opacity={0.08 + 0.16 * dl} />
      <path d={`M50 40 L50 ${TABAN + 2} L230 ${TABAN + 2} L230 40`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <line x1={52} x2={228} y1={SU} y2={SU} stroke="var(--c5)" strokeWidth={2} />
      <g fontSize={12.5} fontWeight={700}>
        <text x={240} y={70} fill="var(--muted)" fontSize={11.5}>tahta: 0,6 g/cm³</text>
        <text x={240} y={96} fill="var(--c2)">G = 6 N</text>
        <text x={240} y={120} fill="var(--c3)">F<tspan fontSize={9} dy={3}>k</tspan><tspan dy={-3}> = {say(Fk)} N</tspan></text>
      </g>
      <text x={140} y={226} fontSize={13.5} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>{hal}</text>
      <text x={140} y={246} fontSize={11.5} textAnchor="middle" fill="var(--muted)">sıvı: {say(dl)} g/cm³</text>
    </svg>
  );
}

// Gemi ve konteynerler. v.n: konteyner sayısı. Gemi 2000 kN, konteyner 300 kN; 4 konteynerde yükleme çizgisi.
function Gemi({ v }: SahneProps) {
  const n = v.n ?? 0, G = 2000 + 300 * n, SU = 136, H = 64;
  const batik = (G / 3200) * 45; // suyun altında kalan gövde yüksekliği (px)
  const govdeUst = SU + batik - H, cizgi = govdeUst + H - 45;
  const tam = n === 4, fazla = n > 4;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${n} konteyner yüklü gemi`}>
      <rect x={10} y={SU} width={320} height={70} fill="var(--c1)" opacity={0.18} />
      <path d={`M60 ${govdeUst} L280 ${govdeUst} L262 ${govdeUst + H} L78 ${govdeUst + H} Z`} fill="var(--ink)" />
      <g>
        <line x1={238} x2={258} y1={cizgi} y2={cizgi} stroke="var(--c4)" strokeWidth={3} />
        <circle cx={248} cy={cizgi} r={6} fill="none" stroke="var(--c4)" strokeWidth={2} />
      </g>
      <line x1={10} x2={330} y1={SU} y2={SU} stroke="var(--c1)" strokeWidth={2} />
      <g>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={84 + i * 34} y={govdeUst - 24} width={30} height={22} rx={2} fill={["var(--c2)", "var(--c3)", "var(--c5)", "var(--c4)", "var(--c1)"][i]} />
        ))}
      </g>
      <text x={170} y={226} fontSize={14} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : fazla ? "var(--bad)" : "var(--ink)"}>
        F<tspan fontSize={10} dy={3}>k</tspan><tspan dy={-3}> = 2000 + {300 * n} = {say(G)} kN</tspan>
      </text>
      <text x={170} y={244} fontSize={12} fontWeight={700} textAnchor="middle" fill={tam ? "var(--good)" : fazla ? "var(--bad)" : "var(--muted)"}>
        {tam ? "Su, yükleme çizgisine ulaştı" : fazla ? "Yükleme çizgisi suyun altında kaldı" : "sarı daire: yükleme çizgisi"}
      </text>
    </svg>
  );
}

// Denizaltı (sure 3). v.tank: 1 ise balast tankları su dolu.
function Denizalti({ v, t, oynuyor }: SahneProps) {
  const dolu = v.tank === 1, u = oynuyor || t > 0 ? yumusak(t / 2.8) : 0;
  const Y0 = 96, y = dolu ? Y0 + 56 * u : Y0 - 30 * u;
  const bitti = !oynuyor && t > 0;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Balast tankları ${dolu ? "dolu" : "boş"} denizaltı`}>
      <rect x={10} y={50} width={320} height={170} fill="var(--c1)" opacity={0.16} />
      <line x1={10} x2={330} y1={50} y2={50} stroke="var(--c1)" strokeWidth={2} />
      <g>
        <rect x={100} y={y - 18} width={140} height={36} rx={18} fill="#7d8da3" />
        <rect x={156} y={y - 32} width={30} height={16} rx={4} fill="#7d8da3" />
        <rect x={116} y={y - 6} width={36} height={14} rx={5} fill={dolu ? "var(--c1)" : "#fff"} opacity={dolu ? 0.85 : 0.7} />
        <rect x={188} y={y - 6} width={36} height={14} rx={5} fill={dolu ? "var(--c1)" : "#fff"} opacity={dolu ? 0.85 : 0.7} />
      </g>
      {u > 0 && <>
      <Ok x1={56} y1={y - 4} x2={56} y2={y - 34} renk="var(--c3)" />
      <Ok x1={56} y1={y + 4} x2={56} y2={y + (dolu ? 46 : 24)} renk="var(--c2)" />
      <g fontSize={12} fontWeight={700}>
        <text x={64} y={y - 30} fill="var(--c3)">F<tspan fontSize={9} dy={3}>k</tspan></text>
        <text x={64} y={y + 40} fill="var(--c2)">G</text>
      </g>
      </>}
      <text x={170} y={242} fontSize={13} fontWeight={800} textAnchor="middle" fill={bitti ? "var(--good)" : "var(--muted)"}>
        {bitti ? (
          <>{dolu ? "G > F" : "G < F"}<tspan fontSize={9} dy={3}>k</tspan><tspan dy={-3}>{dolu ? ": denizaltı dalıyor" : ": denizaltı yükseliyor"}</tspan></>
        ) : dolu ? "Tanklar deniz suyuyla dolu" : "Tanklar boş"}
      </text>
    </svg>
  );
}

// Helyum balonu. v.V: hacim (m³). Fk = 12 N/m³, helyumun ağırlığı 1,7 N/m³, sepet ve zar 40 N.
function Balon({ v }: SahneProps) {
  const V = v.V ?? 2, Fk = 12 * V, G = 1.7 * V + 40, net = Fk - G, kalkar = net > 0;
  const R = 20 * Math.cbrt(V), kalk = kalkar ? 44 : 0, cy = 206 - 58 - R - kalk; // sepet yerdeyken altı 206'da
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`${V} metreküp helyum balonu: ${kalkar ? "yükseliyor" : "yerde"}`}>
      <line x1={20} x2={320} y1={206} y2={206} stroke="var(--ink)" strokeWidth={2} />
      <g>
        <line x1={150} y1={cy + R * 0.9} x2={162} y2={cy + R + 40} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={150} y1={cy + R * 0.9} x2={138} y2={cy + R + 40} stroke="var(--muted)" strokeWidth={1.2} />
        <circle cx={150} cy={cy} r={R} fill="var(--c5)" opacity={0.85} />
        <rect x={136} y={cy + R + 40} width={28} height={18} rx={3} fill="var(--c4)" />
      </g>
      <g fontSize={12.5} fontWeight={700}>
        <text x={236} y={70} fill="var(--c3)">F<tspan fontSize={9} dy={3}>k</tspan><tspan dy={-3}> = {say(Fk, 1)} N ↑</tspan></text>
        <text x={236} y={96} fill="var(--c2)">G = {say(G, 1)} N ↓</text>
        <text x={236} y={114} fill="var(--muted)" fontSize={11}>helyum + sepet</text>
        <line x1={236} x2={334} y1={126} y2={126} stroke="var(--line)" />
        <text x={236} y={148} fill={kalkar ? "var(--good)" : "var(--ink)"} fontWeight={800}>net: {net < 0 ? "−" : ""}{say(Math.abs(net), 1)} N</text>
      </g>
      <text x={170} y={234} fontSize={14} fontWeight={800} textAnchor="middle" fill={kalkar ? "var(--good)" : "var(--ink)"}>
        {kalkar ? "Balon yükseliyor" : "Balon yerden kalkamıyor"}
      </text>
      <text x={170} y={252} fontSize={12} textAnchor="middle" fill="var(--muted)">hacim {V} m³</text>
    </svg>
  );
}

export const FIZIK2: Record<string, SahneKaydi> = {
  "fiz2-tugla": { C: Tugla },
  "fiz2-kar": { C: Kar },
  "fiz2-derinlik": { C: Derinlik },
  "fiz2-kaplar": { C: Kaplar },
  "fiz2-hidrolik": { C: Hidrolik },
  "fiz2-rakim": { C: Rakim },
  "fiz2-basinc-fark": { C: BasincFark },
  "fiz2-dinamometre": { C: Dinamometre },
  "fiz2-sivilar": { C: Sivilar },
  "fiz2-gemi": { C: Gemi },
  "fiz2-denizalti": { C: Denizalti },
  "fiz2-balon": { C: Balon },
};
