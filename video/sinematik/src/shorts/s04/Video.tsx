/**
 * S-04 "Scientists turned lead into gold" (CERN ALICE, Mayıs 2025). Dikey Short, ~22 sn.
 * Kaynak: CERN "ALICE detects the conversion of lead into gold at the LHC": Run 2'de (2015-2018) ~86 milyar
 * altın çekirdeği = 29 pikogram; kurşun çekirdekleri teğet geçerken elektromanyetik alanla 3 proton kopar (82 → 79).
 */
import React, { useContext, useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontFamily } from '../../fonts';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, Koni, lerp, makeShort, pop, ShotStart, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const GOLD = '#F6C744';
const LEAD = '#8C93A3';

/* ---------------- nesneler ---------------- */

/** Külçe: altın oranı 0 (kurşun) .. 1 (altın). */
const Kulce: React.FC<{ x: number; y: number; s?: number; altin?: number; yuz?: boolean }> = ({ x, y, s = 1, altin = 0, yuz = true }) => {
  const f = useCurrentFrame();
  const mix = (a: string, b: string) => {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], altin))).join(',')})`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-60} rx={300} ry={160} fill={GOLD} opacity={altin * 0.45} filter="url(#s-glow)" />
      <path d="M-200 0 L-150 -120 H150 L200 0 Z" fill={mix('#6E7584', '#D9A520')} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M-150 -120 H150 L120 -150 H-120 Z" fill={mix('#A9B0BE', '#FFE07A')} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M-120 -100 L-90 -30" stroke="#fff" strokeWidth={12} opacity={0.35 + altin * 0.3} strokeLinecap="round" />
      {yuz && (
        <g transform="translate(0 -55)">
          <ellipse cx={-40} cy={0} rx={altin > 0.5 ? 16 : 12} ry={altin > 0.5 ? 20 : 15} fill="#fff" stroke={INK} strokeWidth={4} />
          <ellipse cx={40} cy={0} rx={altin > 0.5 ? 16 : 12} ry={altin > 0.5 ? 20 : 15} fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={-38} cy={2} r={6} fill={INK} />
          <circle cx={42} cy={2} r={6} fill={INK} />
          {altin > 0.5 ? <ellipse cx={0} cy={36} rx={14} ry={12} fill={INK} /> : <path d="M-14 34 h28" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
        </g>
      )}
      {altin > 0.3 &&
        [0, 1, 2, 3].map((i) => {
          const p = ((f / 25 + i / 4) % 1);
          const a = i * 1.7;
          return (
            <path key={i} d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z" fill="#FFF6C8" transform={`translate(${Math.cos(a) * 200} ${-80 + Math.sin(a) * 100}) scale(${Math.sin(p * Math.PI) * altin})`} />
          );
        })}
    </g>
  );
};

/** Çekirdek: proton (kırmızı) + nötron (gri) kümesi; altin rengi ile boyanabilir. */
const Cekirdek: React.FC<{ x: number; y: number; s?: number; altin?: number; yuz?: 'goz-kirp' | 'acik' | 'mutlu'; eksik?: number }> = ({ x, y, s = 1, altin = 0, yuz = 'acik' }) => {
  const f = useCurrentFrame();
  const top = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => {
        const a = i * 2.39996;
        const r = Math.sqrt(i) * 18;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, p: i % 2 === 0 };
      }).reverse(),
    [],
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={160} fill={altin > 0.5 ? GOLD : '#FF7A7A'} opacity={0.25} filter="url(#s-glow)" />
      {top.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={22} fill={altin > 0.5 ? (b.p ? '#F6C744' : '#E0A92A') : b.p ? '#E5484D' : LEAD} stroke={INK} strokeWidth={3} />
          <circle cx={b.x - 7} cy={b.y - 7} r={6} fill="#fff" opacity={0.35} />
        </g>
      ))}
      <g transform="translate(0 -6)">
        {yuz === 'goz-kirp' ? <path d="M-44 0 q12 -10 24 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" /> : <circle cx={-32} cy={0} r={13} fill="#fff" stroke={INK} strokeWidth={4} />}
        <circle cx={32} cy={0} r={13} fill="#fff" stroke={INK} strokeWidth={4} />
        {yuz !== 'goz-kirp' && <circle cx={-30} cy={2} r={6} fill={INK} />}
        <circle cx={34} cy={2} r={6} fill={INK} />
        {yuz === 'mutlu' ? <path d="M-22 26 q22 20 44 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /> : <path d="M-14 28 q14 8 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
      </g>
      <text x={0} y={-120 + Math.sin(f / 8) * 4} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={52} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke" />
    </g>
  );
};

/** Proton: kırmızı top, yüzlü, el sallar. */
const Proton: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={34} fill="#E5484D" stroke={INK} strokeWidth={5} />
      <circle cx={-10} cy={-12} r={8} fill="#fff" opacity={0.4} />
      <circle cx={-10} cy={-2} r={4} fill={INK} />
      <circle cx={10} cy={-2} r={4} fill={INK} />
      <path d="M-8 12 q8 6 16 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={`M28 -10 l${16 + Math.sin(f / 2) * 8} -26`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

/** Hız çizgileri. */
const HizCizgi: React.FC<{ y: number; yon?: 1 | -1; o?: number }> = ({ y, yon = 1, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({ length: 14 }, (_, i) => {
        const yy = y + ((i * 47) % 260) - 130;
        const xx = (((f * 60 * yon + i * 211) % 1600) + 1600) % 1600 - 260;
        return <path key={i} d={`M${xx} ${yy} h${-yon * (120 + (i % 4) * 60)}`} stroke="#9FD3FF" strokeWidth={4 + (i % 3) * 2} strokeLinecap="round" opacity={0.6} />;
      })}
    </g>
  );
};

/** Modern laboratuvar kasası (açılış). */
const Kasa: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <radialGradient id="g-kasa" cx="0.5" cy="0.55" r="0.7">
          <stop offset="0" stopColor="#2A2E4A" />
          <stop offset="1" stopColor="#0A0B16" />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={1900} height={2800} fill="url(#g-kasa)" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={-100 + i * 200} y={300} width={12} height={1300} fill="#1A1D33" />
      ))}
      <Koni x={540} y={120} w1={80} w2={900} h={1500} o={0.6} />
      <circle cx={540} cy={120} r={18} fill="#FFF3C9" />
      {/* kaide */}
      <path d="M340 1500 h400 l-40 -60 h-320 z" fill="#3B4466" stroke={INK} strokeWidth={6} />
      <rect x={300} y={1500} width={480} height={500} fill="#252C47" stroke={INK} strokeWidth={6} />
      {/* cam fanus */}
      <path d="M330 1440 V1020 q0 -110 210 -110 q210 0 210 110 V1440" fill="#BFE6FF" opacity={0.12} stroke="#E8F4FF" strokeWidth={6} />
      <path d="M380 1060 q20 -80 90 -100" stroke="#fff" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      <Zerre n={30} color="#FFE2A8" o={0.3} y={300} h={1300} />
      {/* lazer ızgara */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M-100 ${1700 + i * 60} H1200`} stroke="#FF3B5C" strokeWidth={3} opacity={0.4 + 0.3 * Math.sin(f / 5 + i)} />
      ))}
    </g>
  );
};

/** Simya odası (sepya): mumlar, raflar, kazan. */
const Simya: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#2A1A10" />
      {Array.from({ length: 9 }, (_, r) => (
        <g key={r}>
          {Array.from({ length: 12 }, (_, c) => (
            <rect key={c} x={-200 + c * 120 + (r % 2) * 60} y={200 + r * 80} width={116} height={76} fill="#3A2616" stroke="#21150C" strokeWidth={4} />
          ))}
        </g>
      ))}
      {/* raf */}
      {[520, 800].map((yy, r) => (
        <g key={r}>
          <rect x={620} y={yy} width={480} height={20} fill="#5B3A22" />
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              {i % 2 ? (
                <rect x={640 + i * 90} y={yy - 110} width={40} height={110} fill={['#8E4B2A', '#5E6B3A', '#7A3A5A'][i % 3]} stroke="#1A0F08" strokeWidth={4} />
              ) : (
                <path d={`M${650 + i * 90} ${yy} q-20 -50 10 -70 v-30 h20 v30 q30 20 10 70 z`} fill={['#7BBF6A', '#E0A92A', '#6AA7D9'][i % 3]} opacity={0.85} stroke="#1A0F08" strokeWidth={4} />
              )}
            </g>
          ))}
        </g>
      ))}
      {/* mumlar */}
      {[[120, 900], [880, 1260], [220, 1300]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 18} y={y - 120} width={36} height={120} fill="#EFE3C8" />
          <ellipse cx={x} cy={y - 140 + Math.sin(f / 3 + i) * 3} rx={12} ry={24} fill="#FFC65A" />
          <circle cx={x} cy={y - 140} r={110} fill="#FFB25C" opacity={0.25 + 0.05 * Math.sin(f / 2 + i)} filter="url(#s-glow)" />
        </g>
      ))}
      <rect x={-400} y={1400} width={1900} height={900} fill="#1A0F08" />
    </g>
  );
};

const Kazan: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={60} rx={240} ry={60} fill="#FF7A2A" opacity={0.5} filter="url(#s-glow)" />
      {[0, 1, 2, 3].map((i) => {
        const p = ((f / 45 + i / 4) % 1);
        return <circle key={i} cx={Math.sin(i * 2 + f / 20) * 50} cy={-160 - p * 500} r={50 + p * 70} fill="#7BBF6A" opacity={(1 - p) * 0.5} filter="url(#s-soft)" />;
      })}
      <path d="M-200 -140 q-20 220 200 240 q220 -20 200 -240 z" fill="#20232E" stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={-140} rx={200} ry={44} fill="#2A2E3E" stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={-136} rx={170} ry={32} fill="#7BBF6A" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={-80 + i * 80} cy={-136 + Math.sin(f / 4 + i) * 6} r={14} fill="#B4F0A2" />
      ))}
      {/* öksüren yüz */}
      <circle cx={-50} cy={-30} r={14} fill="#fff" />
      <circle cx={50} cy={-30} r={14} fill="#fff" />
      <path d="M-56 -36 l12 12 M44 -36 l12 12" stroke={INK} strokeWidth={0} />
      <ellipse cx={0} cy={30} rx={20 + Math.abs(Math.sin(f / 4)) * 8} ry={14} fill="#fff" />
    </g>
  );
};

/** LHC tüneli: perspektif boru, ışıklar. */
const Tunel: React.FC<{ hiz?: number }> = ({ hiz = 1 }) => {
  const f = useCurrentFrame();
  const vx = 540;
  const vy = 900;
  return (
    <g>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#0A1024" />
      {Array.from({ length: 14 }, (_, i) => {
        const z = (((i / 14 + (f * 0.01 * hiz)) % 1) + 1) % 1;
        const sc = 0.05 + z * z * 2.2;
        return (
          <g key={i} transform={`translate(${vx} ${vy}) scale(${sc})`} opacity={Math.min(1, z * 2)}>
            <ellipse rx={520} ry={420} fill="none" stroke="#2A3A66" strokeWidth={30} />
            <rect x={-480} y={-380} width={60} height={20} fill="#FFE9B8" />
            <rect x={420} y={-380} width={60} height={20} fill="#FFE9B8" />
          </g>
        );
      })}
      {/* mavi mıknatıs borusu */}
      <path d={`M${vx - 6} ${vy} L-200 2100 L500 2100 Z`} fill="#2F6BE0" />
      <path d={`M${vx - 4} ${vy} L-60 2100 L120 2100 Z`} fill="#5B93FF" opacity={0.6} />
      <path d={`M${vx} ${vy} L700 2100 L1300 2100 Z`} fill="#1E2A4A" />
      <circle cx={vx} cy={vy} r={60} fill="#9FD3FF" opacity={0.4} filter="url(#s-glow)" />
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/** 1 · Scientists turned lead into gold. (loop) */
const S1: React.FC = () => {
  const t = useTt();
  const gold = useAt('gold.');
  const loop = useContext(ShotStart) > 1;
  const a = loop ? 0 : ap(t, gold - 0.4, 0.5);
  return (
    <Kadraj zoom={[1.3, 1.4]} origin={[540, 1420]}>
      <Kasa />
      <Kulce x={540} y={1430} s={0.95} altin={a} />
      <Cizgi x={860} y={1720} s={0.85} onluk goz={a > 0.5 ? 'sok' : 'acik'} agiz={a > 0.5 ? 'o' : 'gulus'} kolSol={[100, 20]} kolSag={[10, 10]} bakis={[-1, 0]} />
    </Kadraj>
  );
};

/** 2 · Really? */
const S2: React.FC = () => (
  <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]}>
    <g transform="translate(-540 -900) scale(2)">
      <Kasa />
    </g>
    <Cizgi x={540} y={2050} s={2.4} onluk goz="yari" agiz="duz" kas="kalkik" kolSol={[8, 10]} kolSag={[8, 10]} />
  </Kadraj>
);

/** 3 · Alchemists tried for centuries. Simya odası, kazan öksürür. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.12, 1.0]} origin={[540, 1200]} rim="#FFB25C">
      <Simya />
      <Kazan x={460} y={1440} s={1.05} />
      <Cizgi x={790} y={1640} s={0.95} renk="#6B3FA0" kapusonBasta goz="sikis" agiz="eksi" kolSol={[60 + Math.sin(t * 8) * 15, 40]} kolSag={[20, 10]} />
      <rect x={-400} y={-400} width={1900} height={2800} fill="#C89A5A" opacity={0.12} style={{ mixBlendMode: 'overlay' }} />
    </Kadraj>
  );
};

/** 4 · In 2025 — yıl damgası, yeraltı tüneli. */
const S4: React.FC = () => {
  const t = useTt();
  const st = pop(t, 0.05, 0.4);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 900]}>
      <Tunel hiz={0.6} />
      <g transform={`translate(540 1160) scale(${st}) rotate(-5)`}>
        <rect x={-240} y={-110} width={480} height={160} rx={18} fill="none" stroke="#FFD54A" strokeWidth={12} />
        <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={130} fill="#FFD54A">
          2025
        </text>
      </g>
    </Kadraj>
  );
};

/** 5 · a team at CERN showed how it happened. Tünelde dalış + ekip. */
const S5: React.FC = () => (
  <Kadraj zoom={[1.0, 1.25]} origin={[540, 900]}>
    <Tunel hiz={1.6} />
    <Cizgi x={260} y={1820} s={0.8} onluk goz="acik" agiz="gulus" kolSag={[60, 60]} bakis={[1, -0.5]} />
    <Cizgi x={860} y={1860} s={0.85} onluk renk="#4FB3A8" goz="mutlu" agiz="sirit" kolSol={[60, 60]} bakis={[-1, -0.5]} />
  </Kadraj>
);

/** 6 · Lead nuclei flew past each other at nearly the speed of light. */
const S6: React.FC = () => {
  const t = useTt();
  const past = useAt('past');
  const u = (t - past) / 1.6;
  const x1 = lerp(-200, 1280, ap(t, 0, past + 1.6, (x) => x));
  const x2 = lerp(1280, -200, ap(t, 0, past + 1.6, (x) => x));
  const yak = Math.abs(u) < 0.3;
  return (
    <Kadraj zoom={[1.0, 1.0]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#070B1E" />
      <Zerre n={60} color="#9FD3FF" o={0.35} r={2} />
      <HizCizgi y={830} yon={1} />
      <HizCizgi y={1210} yon={-1} />
      <Cekirdek x={x1} y={860} s={1.3} yuz={yak ? 'goz-kirp' : 'acik'} />
      <Cekirdek x={x2} y={1200} s={1.3} yuz={yak ? 'goz-kirp' : 'acik'} />
      <text x={540} y={1560} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={74} fill="#9FD3FF" opacity={ap(t, 0.3, 0.4)}>
        ≈ c
      </text>
    </Kadraj>
  );
};

/** 7 · Their fields knocked out three protons. Çakma, 3 proton fırlar, 82 → 79. */
const S7: React.FC = () => {
  const t = useTt();
  const three = useAt('three');
  const k = ap(t, three - 0.2, 0.9);
  const z = Math.round(lerp(82, 79, ap(t, three, 0.6)));
  const fl = interpolate(t, [0, 0.05, 0.4], [0, 1, 0], clamp);
  return (
    <Kadraj zoom={[1.15, 1.05]} origin={[540, 1000]} shakeAt={[0.05]} shake={14}>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#070B1E" />
      {/* elektromanyetik alan halkaları */}
      {[0, 1, 2, 3].map((i) => {
        const p = ((t * 0.8 + i / 4) % 1);
        return <circle key={i} cx={540} cy={1000} r={150 + p * 600} fill="none" stroke="#7BA7FF" strokeWidth={8} opacity={(1 - p) * 0.6} />;
      })}
      <Cekirdek x={540} y={1000} s={1.25} yuz="acik" />
      {[0, 1, 2].map((i) => {
        const a = -Math.PI / 2 + (i - 1) * 0.9;
        return <Proton key={i} x={540 + Math.cos(a) * k * 520} y={1000 + Math.sin(a) * k * 520} s={1.2} />;
      })}
      <text x={540} y={1480} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={160} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">
        {z}
      </text>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#fff" opacity={fl} />
    </Kadraj>
  );
};

/** 8 · and lead became gold. Çekirdek altına döner. */
const S8: React.FC = () => {
  const t = useTt();
  const g = useAt('gold#2');
  const a = ap(t, g - 0.2, 0.3);
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#0E0B05" />
      <circle cx={540} cy={1000} r={700} fill={GOLD} opacity={a * 0.25} filter="url(#s-glow)" />
      <Cekirdek x={540} y={1000} s={1.3 + spring(t, g) * 0.05} altin={a} yuz={a > 0.5 ? 'mutlu' : 'acik'} />
      <text x={540} y={1460} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={150} fill={a > 0.5 ? GOLD : '#fff'} stroke={INK} strokeWidth={10} paintOrder="stroke">
        {a > 0.5 ? 'Au' : 'Pb'}
      </text>
    </Kadraj>
  );
};

/** 9 · 86 billion atoms. Ekran altın noktalarla dolar, sayaç. */
const S9: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 1.4);
  const pts = useMemo(() => Array.from({ length: 900 }, (_, i) => ({ x: ((i * 7919) % 1080), y: 400 + ((i * 104729) % 1300), r: 3 + (i % 4) })), []);
  const n = Math.round(lerp(0, 86, u));
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#0E0B05" />
      {pts.slice(0, Math.round(u * pts.length)).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={GOLD} opacity={0.85} />
      ))}
      <text x={540} y={1620} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={100} fill="#fff" stroke={INK} strokeWidth={9} paintOrder="stroke">
        {n},000,000,000
      </text>
    </Kadraj>
  );
};

/** 10 · Total weight? 29 trillionths of a gram. Hepsi tek noktaya toplanır; terazi kılını kıpırdatmaz. */
const S10: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const top = ap(t, 0, 0.9);
  const n29 = useAt('29');
  const pts = useMemo(() => Array.from({ length: 200 }, (_, i) => ({ x: ((i * 7919) % 1080), y: 400 + ((i * 104729) % 1300) })), []);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1100]}>
      <Kasa />
      {/* terazi */}
      <g transform="translate(540 1120)">
        <rect x={-260} y={0} width={520} height={120} rx={14} fill="#D9DEE8" stroke={INK} strokeWidth={6} />
        <rect x={-200} y={30} width={400} height={60} rx={6} fill="#1B2A20" />
        <text x={0} y={78} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={48} fill="#7CFF8A">
          0.000 g
        </text>
        <rect x={-220} y={-24} width={440} height={24} rx={8} fill="#B9C3D2" stroke={INK} strokeWidth={5} />
      </g>
      {pts.map((p, i) => (
        <circle key={i} cx={lerp(p.x, 540, top)} cy={lerp(p.y, 1092, top)} r={lerp(5, 1, top)} fill={GOLD} opacity={1 - top * 0.6} />
      ))}
      <circle cx={540} cy={1090} r={3} fill={GOLD} />
      <circle cx={540} cy={1090} r={30} fill={GOLD} opacity={0.35 + 0.15 * Math.sin(f / 4)} filter="url(#s-soft)" />
      <Cizgi x={860} y={1800} s={0.95} onluk goz={t > n29 ? 'sok' : 'acik'} agiz={t > n29 ? 'eksi' : 'duz'} kolSol={[70, 30]} bakis={[-1, 0.4]} elSol={<g transform="translate(-30 -10) rotate(-30) scale(0.45)"><circle r={100} fill="#BFE6FF" opacity={0.3} stroke={INK} strokeWidth={12} /><rect x={-14} y={95} width={28} height={140} rx={12} fill="#6B4A2E" stroke={INK} strokeWidth={6} /></g>} />
      <text x={540} y={700} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={66} fill={GOLD} stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={ap(t, n29 - 0.1, 0.3)}>
        0.000 000 000 029 g
      </text>
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's04',
  words: WORDS,
  voiceLen: 21.68,
  tail: 1.0,
  baslik: ['LEAD INTO', 'GOLD'],
  vurgu: GOLD,
  plan: [
    { w: 'Scientists', C: S1 },
    { w: 'Really?', C: S2 },
    { w: 'Alchemists', C: S3 },
    { w: 'In', C: S4 },
    { w: 'a', C: S5 },
    { w: 'Lead', C: S6 },
    { w: 'Their', C: S7 },
    { w: 'and', C: S8 },
    { w: '86', C: S9 },
    { w: 'Total', C: S10 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['ding', 'gold.', -0.2, 0.3],
    ['click', 'Really?', 0, 0.3],
    ['whoosh', 'Alchemists', -0.1, 0.25],
    ['impact', 'In', 0.05, 0.3],
    ['drone', 'a', 0, 0.3],
    ['whoosh', 'past', -0.1, 0.4],
    ['impact', 'Their', 0, 0.3],
    ['pop', 'three', 0.1, 0.35],
    ['coins', 'gold#2', 0, 0.3],
    ['riser', '86', 0, 0.25],
    ['tick', '29', 0, 0.3],
  ],
  muzik: ['music-hope', 0.08],
});

export const S04 = short.Comp;
export const S04_FRAMES = short.frames;
