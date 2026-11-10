/**
 * S-03 "Let's dig through the Earth" (Kola Superdeep Borehole). Dikey Short, ~21 sn.
 * Kaynak: SG-3, sondaj 24 Mayıs 1970'te başladı; 1989'da 12.262 m; 1992'de 180 °C yüzünden durdu; 1995'te kapandı.
 * 12,262 km / 6.371 km ≈ %0,19. Everest 8.849 m.
 */
import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];

/* ---------------- nesneler ---------------- */

const Uzay: React.FC = () => {
  const f = useCurrentFrame();
  const st = useMemo(() => Array.from({ length: 90 }, (_, i) => ({ x: (i * 137) % 1300 - 100, y: (i * 89) % 2200 - 100, r: i % 5 ? 2 : 3.5 })), []);
  return (
    <g>
      <defs>
        <radialGradient id="k-uzay" cx="0.5" cy="0.7" r="0.9">
          <stop offset="0" stopColor="#24204A" />
          <stop offset="1" stopColor="#07060F" />
        </radialGradient>
      </defs>
      <rect x={-500} y={-500} width={2100} height={2900} fill="url(#k-uzay)" />
      <ellipse cx={200} cy={500} rx={500} ry={200} fill="#6B3FA0" opacity={0.18} filter="url(#s-glow)" />
      {st.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 14 + i))} />
      ))}
    </g>
  );
};

/** Yerküre: okyanus, kıtalar, yüz (kaş kaldırır). */
const Dunya: React.FC<{ x: number; y: number; r: number; kas?: number; rot?: number }> = ({ x, y, r, kas = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 1.08} fill="#5FA8FF" opacity={0.25} filter="url(#s-glow)" />
    <clipPath id="dunya-k">
      <circle r={r} />
    </clipPath>
    <circle r={r} fill="#2E6FD6" />
    <g clipPath="url(#dunya-k)" transform={`rotate(${rot})`}>
      <path d={`M${-r * 0.7} ${-r * 0.5} q${r * 0.3} ${-r * 0.3} ${r * 0.6} ${-r * 0.1} q${r * 0.2} ${r * 0.3} ${-r * 0.1} ${r * 0.5} q${-r * 0.4} ${r * 0.2} ${-r * 0.5} ${-r * 0.4} z`} fill="#4CB46A" />
      <path d={`M${r * 0.2} ${r * 0.1} q${r * 0.4} ${-r * 0.2} ${r * 0.6} ${r * 0.2} q${-r * 0.1} ${r * 0.5} ${-r * 0.4} ${r * 0.5} q${-r * 0.3} ${-r * 0.2} ${-r * 0.2} ${-r * 0.7} z`} fill="#4CB46A" />
      <ellipse cx={0} cy={-r * 0.92} rx={r * 0.6} ry={r * 0.16} fill="#F4F7FB" />
      <circle cx={r * 0.35} cy={r * 0.35} r={r} fill="#000" opacity={0.25} />
    </g>
    <circle r={r} fill="none" stroke="#0E2A5E" strokeWidth={8} />
    {/* yüz */}
    <g transform={`translate(0 ${-r * 0.62}) scale(0.7)`}>
    <ellipse cx={-r * 0.25} cy={r * 0.05} rx={r * 0.08} ry={r * 0.11} fill="#fff" />
    <ellipse cx={r * 0.25} cy={r * 0.05} rx={r * 0.08} ry={r * 0.11} fill="#fff" />
    <circle cx={-r * 0.25} cy={-r * 0.0} r={r * 0.04} fill={INK} />
    <circle cx={r * 0.25} cy={-r * 0.0} r={r * 0.04} fill={INK} />
    <path d={`M${-r * 0.35} ${-r * (0.18 + kas * 0.08)} q${r * 0.1} ${-r * 0.06} ${r * 0.2} 0 M${r * 0.15} ${-r * (0.18 + kas * 0.08)} q${r * 0.1} ${-r * 0.06} ${r * 0.2} 0`} stroke="#fff" strokeWidth={r * 0.035} fill="none" strokeLinecap="round" />
    <path d={`M${-r * 0.1} ${r * 0.3} h${r * 0.2}`} stroke="#fff" strokeWidth={r * 0.035} strokeLinecap="round" />
    </g>
  </g>
);

const Kurek: React.FC<{ s?: number; r?: number }> = ({ s = 1, r = 0 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d="M0 -140 V60" stroke="#8B5A2B" strokeWidth={12} strokeLinecap="round" />
    <path d="M-16 -150 h32" stroke="#8B5A2B" strokeWidth={12} strokeLinecap="round" />
    <path d="M-30 50 h60 v40 q-30 40 -60 0 z" fill="#B9C3D2" stroke={INK} strokeWidth={5} />
  </g>
);

/** Arktik gece: kuzey ışıkları, karlı tepeler, kar. */
const Arktik: React.FC<{ ufuk?: number }> = ({ ufuk = 1300 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="k-gece" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050A1E" />
          <stop offset="1" stopColor="#1C2E55" />
        </linearGradient>
        <linearGradient id="k-aurora" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5BFFB0" stopOpacity="0" />
          <stop offset="0.6" stopColor="#5BFFB0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3B9BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-500} width={2100} height={2900} fill="url(#k-gece)" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 131) % 1100} cy={(i * 61) % 800} r={i % 4 ? 2 : 3} fill="#fff" opacity={0.5} />
      ))}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M-200 ${420 + i * 90} C200 ${300 + Math.sin(f / 30 + i) * 80 + i * 60} 600 ${560 + Math.cos(f / 25 + i) * 80} 1300 ${380 + i * 70} L1300 ${640 + i * 70} C600 ${820 + Math.cos(f / 25 + i) * 60} 200 ${560 + Math.sin(f / 30 + i) * 60} -200 ${700 + i * 90} Z`}
          fill="url(#k-aurora)"
          opacity={0.7 - i * 0.15}
          filter="url(#s-soft)"
        />
      ))}
      <path d={`M-300 ${ufuk} L100 ${ufuk - 200} L380 ${ufuk - 60} L700 ${ufuk - 260} L1100 ${ufuk - 40} L1400 ${ufuk - 120} V2400 H-300 Z`} fill="#3A4C78" />
      <path d={`M100 ${ufuk - 200} l60 70 l-40 -10 l-50 40 z M700 ${ufuk - 260} l70 80 l-50 -14 l-50 44 z`} fill="#E8F1FF" />
      <path d={`M-300 ${ufuk + 60} Q540 ${ufuk - 20} 1400 ${ufuk + 60} V2400 H-300 Z`} fill="#DCE8F7" />
      <path d={`M-300 ${ufuk + 60} Q540 ${ufuk - 20} 1400 ${ufuk + 60}`} fill="none" stroke="#fff" strokeWidth={10} />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={((i * 97 + Math.sin(f / 20 + i) * 30) % 1200) - 60} cy={((i * 173 + f * (2 + (i % 3))) % 2000) - 40} r={2 + (i % 3)} fill="#fff" opacity={0.75} />
      ))}
    </g>
  );
};

/** Sondaj kulesi: çelik kafes, ışıklar, kabin. */
const Kule: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="-40,-760 40,-760 220,0 -220,0" fill="#000" opacity={0.25} transform="translate(30 10)" />
      {Array.from({ length: 10 }, (_, i) => {
        const y1 = -i * 76;
        const y2 = -(i + 1) * 76;
        const w1 = 220 - i * 18;
        const w2 = 220 - (i + 1) * 18;
        return (
          <g key={i} stroke="#C8D2E6" strokeWidth={8} fill="none">
            <path d={`M${-w1} ${y1} L${w2} ${y2} M${w1} ${y1} L${-w2} ${y2} M${-w2} ${y2} H${w2}`} />
          </g>
        );
      })}
      <path d="M-220 0 L-40 -760 M220 0 L40 -760" stroke="#E4EAF6" strokeWidth={14} />
      <rect x={-60} y={-800} width={120} height={50} fill="#C8352E" stroke={INK} strokeWidth={5} />
      {[-560, -380, -200].map((yy, i) => (
        <g key={i}>
          <circle cx={-110 + i * 30} cy={yy} r={10} fill="#FFD27A" />
          <circle cx={-110 + i * 30} cy={yy} r={40} fill="#FFD27A" opacity={0.25 + 0.15 * Math.sin(f / 6 + i)} filter="url(#s-soft)" />
        </g>
      ))}
      <circle cx={0} cy={-790} r={12} fill="#FF4040" opacity={f % 30 < 15 ? 1 : 0.3} />
      <rect x={140} y={-180} width={260} height={180} fill="#5B6E99" stroke={INK} strokeWidth={6} />
      <rect x={170} y={-150} width={80} height={60} fill="#FFD27A" />
      <rect x={280} y={-150} width={80} height={60} fill="#FFD27A" />
      <path d="M130 -180 l140 -60 l140 60" fill="#E8F1FF" stroke={INK} strokeWidth={6} />
      {/* dumanlar */}
      {[0, 1, 2].map((i) => {
        const p = ((f / 60 + i / 3) % 1);
        return <circle key={i} cx={360 + p * 80} cy={-260 - p * 260} r={30 + p * 50} fill="#E8EEF7" opacity={(1 - p) * 0.6} />;
      })}
    </g>
  );
};

/** Yer kesiti: katmanlar + sondaj borusu (derinlik 0..1 → ekran yüksekliği). */
const Kesit: React.FC<{ derin: number; sicak?: number; kirik?: number; ust?: number }> = ({ derin, sicak = 0, kirik = 0, ust = 420 }) => {
  const f = useCurrentFrame();
  const kat = ['#8C6A4A', '#7A5A3E', '#6B4C34', '#5A3F2D', '#6E3B2A', '#83402A', '#9A4426'];
  const H = 2200 - ust;
  const uc = ust + derin * (H - 150);
  return (
    <g>
      <rect x={-300} y={ust - 600} width={1700} height={600} fill="#0B1430" />
      <rect x={-300} y={ust - 30} width={1700} height={40} fill="#DCE8F7" />
      {kat.map((c, i) => (
        <path key={i} d={`M-300 ${ust + 10 + i * (H / kat.length)} Q540 ${ust + 30 + i * (H / kat.length)} 1400 ${ust + i * (H / kat.length)} V2400 H-300 Z`} fill={c} />
      ))}
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={(i * 131) % 1100} cy={ust + 80 + ((i * 197) % (H - 100))} rx={10 + (i % 4) * 6} ry={6 + (i % 3) * 3} fill="#000" opacity={0.15} />
      ))}
      <rect x={-300} y={ust} width={1700} height={H} fill="#FF4A1A" opacity={0.0 + sicak * 0.35} style={{ mixBlendMode: 'screen' }} />
      {/* kuyu */}
      <rect x={526} y={ust} width={28} height={uc - ust} fill="#140C08" />
      <rect x={533} y={ust - 40} width={14} height={uc - ust + 40} fill="#B9C3D2" transform={kirik > 0 ? `rotate(${kirik * 6} 540 ${uc})` : undefined} />
      <g transform={`translate(540 ${uc}) rotate(${kirik * 20})`}>
        <circle r={60 + sicak * 40} fill="#FF7A2A" opacity={sicak * 0.7} filter="url(#s-glow)" />
        <path d="M-22 -30 h44 l-22 50 z" fill={sicak > 0.3 ? '#FF6A3A' : '#E4EAF6'} stroke={INK} strokeWidth={4} transform={`rotate(${f * 20})`} />
      </g>
    </g>
  );
};

const Termometre: React.FC<{ x: number; y: number; v: number }> = ({ x, y, v }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-26} y={-300} width={52} height={320} rx={26} fill="#F4F5F7" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={40} r={46} fill="#FF3B2A" stroke={INK} strokeWidth={6} />
    <rect x={-12} y={20 - 300 * v} width={24} height={300 * v} fill="#FF3B2A" />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Let's dig through the Earth. (son karede tekrar: loop) */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Uzay />
      <Dunya x={540} y={1900} r={900} kas={0.6 + 0.4 * Math.sin(f / 8)} rot={f * 0.05} />
      <Cizgi x={540} y={1010} s={0.95} goz="mutlu" agiz="sirit" kapusonBasta kolSag={[60, 50]} kolSol={[20, 10]} elSag={<g transform="translate(10 -20)"><Kurek s={1.1} r={-25} /></g>} />
    </Kadraj>
  );
};

/** 2 · The Soviets tried. Arktik, sondaj kulesi. */
const S2: React.FC = () => (
  <Kadraj zoom={[1.1, 1.0]} origin={[540, 1300]}>
    <Arktik ufuk={1450} />
    <Kule x={480} y={1500} s={1.1} />
  </Kadraj>
);

/** 3 · In 1970, they started drilling in the Arctic. Yıl damgası, kule titrer. */
const S3: React.FC = () => {
  const t = useTt();
  const yil = pop(t, 0.05, 0.4);
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 1100]} shakeAt={[1.0]} shake={6}>
      <Arktik ufuk={1450} />
      <Kule x={540} y={1520} s={1.2} />
      <g transform={`translate(540 560) scale(${yil}) rotate(-5)`}>
        <rect x={-230} y={-110} width={460} height={160} rx={18} fill="none" stroke="#FFD54A" strokeWidth={12} />
        <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={130} fill="#FFD54A">
          1970
        </text>
      </g>
    </Kadraj>
  );
};

/** 4 · Kesit: matkap iner. */
const S4: React.FC = () => {
  const t = useTt();
  const d = ap(t, 0, 2.0) * 0.3;
  return (
    <Kadraj zoom={[1.0, 1.05]} origin={[540, 900]}>
      <Kesit derin={d} ust={640} />
      <g transform="translate(540 630) scale(0.55)">
        <Kule x={0} y={0} s={0.6} />
      </g>
      <text x={720} y={760 + d * 1300} fontFamily={fontFamily} fontWeight={800} fontSize={64} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
        {Math.round(d * 12262 / 1).toLocaleString('en-US')} m
      </text>
    </Kadraj>
  );
};

/** 5 · 19 years later — takvim 1970 → 1989. */
const S5: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 1.1);
  const yil = Math.round(lerp(1970, 1989, u));
  return (
    <Kadraj zoom={[1.05, 1.0]} origin={[540, 900]}>
      <Kesit derin={lerp(0.3, 0.75, u)} ust={640} />
      <g transform={`translate(540 960) scale(${1 + spring(t, 1.1) * 0.05})`}>
        <rect x={-260} y={-150} width={520} height={250} rx={24} fill="#F6F1E3" stroke={INK} strokeWidth={8} />
        <rect x={-260} y={-150} width={520} height={70} rx={24} fill="#D93036" />
        <text x={0} y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={150} fill={INK}>
          {yil}
        </text>
      </g>
    </Kadraj>
  );
};

/** 6 · they reached 12 kilometers. Everest'ten derin. */
const S6: React.FC = () => {
  const t = useTt();
  const km = useAt('12');
  const u = ap(t, km - 0.3, 0.7);
  return (
    <Kadraj zoom={[1.0, 1.04]} origin={[540, 1100]}>
      <Kesit derin={lerp(0.75, 0.92, u)} ust={520} />
      {/* ters Everest silüeti (ölçek) */}
      <g opacity={ap(t, 0.2, 0.5)}>
        <path d={`M180 520 L300 ${520 + 1230 * (8849 / 12262)} L420 520 Z`} fill="#E8F1FF" opacity={0.18} stroke="#E8F1FF" strokeWidth={4} strokeDasharray="14 10" />
        <text x={300} y={600} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={40} fill="#E8F1FF">
          8,849 m
        </text>
      </g>
      <g transform={`translate(780 ${520 + 1230 * u}) scale(${0.8 + 0.2 * u})`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={110} fill="#FFD54A" stroke={INK} strokeWidth={9} paintOrder="stroke">
          12,262 m
        </text>
      </g>
    </Kadraj>
  );
};

/** 7 · Down there, the rock hit 180 degrees. Matkap ucu kızarır, termometre. */
const Matkap: React.FC<{ v: number; deg: number; bukul?: number }> = ({ v, deg, bukul = 0 }) => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#5A2414" />
      {Array.from({ length: 30 }, (_, i) => (
        <ellipse key={i} cx={(i * 131) % 1100} cy={(i * 197) % 1900} rx={40 + (i % 4) * 20} ry={20 + (i % 3) * 10} fill="#2A0F08" opacity={0.4} />
      ))}
      <rect x={-300} y={-300} width={1700} height={2500} fill="#FF5A1A" opacity={v * 0.35 + 0.05 * Math.sin(f / 4)} style={{ mixBlendMode: 'screen' }} />
      {/* dev matkap ucu (yüzlü) */}
      <path d={`M540 -300 Q540 ${700 - bukul * 200} ${540 + bukul * 260} ${800 + bukul * 60}`} stroke={INK} strokeWidth={112} fill="none" />
      <path d={`M540 -300 Q540 ${700 - bukul * 200} ${540 + bukul * 260} ${800 + bukul * 60}`} stroke="#9AA6BE" strokeWidth={100} fill="none" />
      <g transform={`translate(${540 + bukul * 300} ${1050 + bukul * 40}) rotate(${-bukul * 55})`}>
        <circle r={260} fill="#FF7A2A" opacity={v * 0.6} filter="url(#s-glow)" />
        <path d="M-160 -260 h320 l-160 420 z" fill={v > 0.4 ? '#FF6A3A' : '#C9D2E3'} stroke={INK} strokeWidth={8} />
        <path d="M-100 -210 l200 60 M-60 -110 l140 40" stroke={INK} strokeWidth={6} opacity={0.4} />
        <path d={v > 0.4 ? 'M-80 -160 l40 22 l-40 22 M80 -160 l-40 22 l40 22' : 'M-70 -150 h30 M40 -150 h30'} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={v > 0.4 ? 'M-30 -60 q30 -20 60 0' : 'M-30 -70 h60'} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
        {v > 0.4 && <path d={`M100 -230 q-18 26 -18 38 a18 18 0 0 0 36 0 q0 -12 -18 -38 z`} fill="#8FD3FF" stroke={INK} strokeWidth={4} transform={`translate(0 ${(f * 3) % 60})`} />}
      </g>
      <Termometre x={860} y={1100} v={0.2 + v * 0.75} />
      <text x={860} y={1250} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={86} fill="#FFD54A" stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={ap(t, deg - 0.1, 0.3)}>
        180°C
      </text>
    </>
  );
};

const S7: React.FC = () => {
  const t = useTt();
  const deg = useAt('180');
  const v = ap(t, deg - 0.6, 1.0);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1100]} shakeAt={[deg]} shake={8}>
      <Matkap v={v} deg={deg} />
    </Kadraj>
  );
};

/** 8 · and the drill could not go on. Matkap bükülür, kıvılcım, buhar. */
const S8: React.FC = () => {
  const t = useTt();
  const go = useAt('go');
  const b = ap(t, go - 0.6, 0.6);
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.1, 1.0]} origin={[540, 1100]} shakeAt={[go - 0.5]} shake={18}>
      <Matkap v={1} deg={-5} bukul={-b} />
      {Array.from({ length: 18 }, (_, i) => {
        const p = ((t * 2.2 + i / 18) % 1);
        const a = (i / 18) * Math.PI * 2;
        return <circle key={i} cx={320 + Math.cos(a) * p * 300} cy={1150 + Math.sin(a) * p * 200 - p * 100} r={8} fill="#FFD27A" opacity={b * (1 - p)} />;
      })}
      {[0, 1, 2, 3].map((i) => {
        const p = ((f / 40 + i / 4) % 1);
        return <circle key={i} cx={360 + Math.sin(i * 2) * 60} cy={1100 - p * 800} r={60 + p * 90} fill="#F4F5F7" opacity={(1 - p) * 0.5 * b} filter="url(#s-soft)" />;
      })}
    </Kadraj>
  );
};

/** 9 · It's still the deepest hole ever dug. Kaynakla kapatılmış kapak, Çizgi üstünde oturur. */
const S9: React.FC = () => (
  <Kadraj zoom={[1.05, 1.12]} origin={[540, 1250]}>
    <Arktik ufuk={1250} />
    {/* paslı kapak */}
    <g transform="translate(540 1520)">
      <ellipse rx={260} ry={70} fill="#6B4A36" stroke={INK} strokeWidth={8} />
      <ellipse rx={220} ry={56} fill="#8C5E3E" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={Math.cos((i / 8) * Math.PI * 2) * 180} cy={Math.sin((i / 8) * Math.PI * 2) * 44} r={10} fill="#4A3020" />
      ))}
      <path d="M-120 -10 q60 -20 120 0 q60 20 120 0" stroke="#B07850" strokeWidth={8} fill="none" />
    </g>
    <Cizgi x={560} y={1500} s={0.85} oturan goz="yari" agiz="duz" kapusonBasta kolSol={[30, 30]} kolSag={[30, 30]} />
  </Kadraj>
);

/** 10 · That's two tenths of a percent. Kamera geri çekilir: tüm yerküre kesiti, kuyu minicik. */
const S10: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const u = ap(t, 0, 1.4);
  const R = 760;
  const atis = ap(t, 1.5, 0.8);
  return (
    <Kadraj zoom={[lerp(3.2, 1.0, 1), 1.0]} origin={[540, 1100]}>
      <Uzay />
      <g transform={`translate(540 1250) scale(${lerp(2.6, 1, u)}) translate(0 ${lerp(R * 0.9, 0, u)})`}>
        <circle r={R * 1.05} fill="#5FA8FF" opacity={0.2} filter="url(#s-glow)" />
        <circle r={R} fill="#7A4A2E" />
        <circle r={R * 0.84} fill="#B5532B" />
        <circle r={R * 0.55} fill="#E8862F" />
        <circle r={R * 0.19} fill="#FFE07A" />
        <circle r={R * 0.3} fill="#FFE07A" opacity={0.4} filter="url(#s-glow)" />
        <path d={`M${-R} 0 A${R} ${R} 0 0 1 0 ${-R}`} fill="none" stroke="#2E6FD6" strokeWidth={10} />
        {/* kuyu: 12 km / 6371 km */}
        <path d={`M0 ${-R} v${R * 0.0019 * 10}`} stroke="#FFD54A" strokeWidth={4} />
        <path d={`M0 ${-R} V${-R * 0.0} `} stroke="#fff" strokeWidth={3} strokeDasharray="10 14" opacity={0.35 * u} />
      </g>
      {/* ok ve etiketler */}
      <g opacity={ap(t, 0.9, 0.4)}>
        <path d="M720 430 Q620 470 560 480" stroke="#FFD54A" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M560 480 l26 -26 M560 480 l34 8" stroke="#FFD54A" strokeWidth={8} strokeLinecap="round" />
        <text x={730} y={440} fontFamily={fontFamily} fontWeight={800} fontSize={54} fill="#FFD54A" stroke={INK} strokeWidth={6} paintOrder="stroke">
          12 km
        </text>
        <text x={540} y={1300} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={58} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
          6,371 km
        </text>
        <text x={540} y={1720} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={150} fill="#FFD54A" stroke={INK} strokeWidth={10} paintOrder="stroke" opacity={ap(t, 1.6, 0.3)}>
          0.2%
        </text>
      </g>
      {/* Çizgi tepede, tek kum tanesi atar */}
      <g opacity={u}>
        <Cizgi x={470} y={490} s={0.22} goz="mutlu" agiz="sirit" kapusonBasta kolSag={[lerp(40, 150, atis), 20]} golge={false} />
        <circle cx={lerp(500, 540, atis)} cy={lerp(400, 700, atis * atis) + Math.sin(f / 3) * 0} r={5} fill="#E7C88E" opacity={atis > 0 && atis < 1 ? 1 : 0} />
      </g>
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's03',
  words: WORDS,
  voiceLen: 19.98,
  tail: 1.0,
  baslik: ['DIG THROUGH', 'THE EARTH'],
  vurgu: '#FFB25C',
  plan: [
    { w: "Let's", C: S1 },
    { w: 'The', C: S2 },
    { w: 'In', C: S3 },
    { w: 'they', C: S4 },
    { w: '19', C: S5 },
    { w: 'they#2', C: S6 },
    { w: 'Down', C: S7 },
    { w: 'and', C: S8 },
    { w: "It's", C: S9 },
    { w: "That's", C: S10 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['pop', "Let's", 0.3, 0.25],
    ['whoosh', 'The', -0.1, 0.25],
    ['impact', 'In', 0.05, 0.3],
    ['drone', 'they', 0, 0.3],
    ['rewind', '19', -0.1, 0.3],
    ['ding', '12', 0.2, 0.3],
    ['alarm', '180', 0, 0.12],
    ['glass', 'go', -0.4, 0.3],
    ['knock', "It's", 0.2, 0.3],
    ['whoosh', "That's", -0.1, 0.35],
    ['pop', 'percent.', 0, 0.3],
  ],
  muzik: ['music-dark', 0.08],
});

export const S03 = short.Comp;
export const S03_FRAMES = short.frames;
