/**
 * S-02 "Why don't we nuke hurricanes?" Dikey Short, ~17 sn.
 * Kaynak: NOAA AOML Hurricane FAQ (olgun bir kasırga her 20 dk'da 10 megatonluk bombaya eşit ısı salar;
 * radyoaktif serpinti rüzgârla taşınır). 24 sa / 20 dk = 72.
 */
import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontFamily } from '../../fonts';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const RAD = '#9BFF5A';

/* ---------------- nesneler ---------------- */

/** Gün batımı gökyüzü + okyanus. */
const Gok: React.FC<{ ufuk?: number; koyu?: number }> = ({ ufuk = 1250, koyu = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="h-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1846" />
          <stop offset="0.55" stopColor="#7A3E7A" />
          <stop offset="1" stopColor="#F28B54" />
        </linearGradient>
        <linearGradient id="h-deniz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B4A8C" />
          <stop offset="1" stopColor="#0E1838" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-500} width={2100} height={ufuk + 500} fill="url(#h-gok)" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 113) % 1080} cy={(i * 71) % 600} r={i % 3 ? 2 : 3} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 10 + i)} />
      ))}
      <circle cx={860} cy={ufuk - 40} r={90} fill="#FFC27A" opacity={0.9} />
      <circle cx={860} cy={ufuk - 40} r={260} fill="#FF9E5A" opacity={0.35} filter="url(#s-glow)" />
      <rect x={-500} y={ufuk} width={2100} height={1500} fill="url(#h-deniz)" />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${((i * 173 + f * 2) % 1400) - 200} ${ufuk + 40 + i * 48} q40 -10 80 0`} stroke="#9FB2FF" strokeWidth={4} fill="none" opacity={0.35} />
      ))}
      <rect x={860 - 50} y={ufuk + 6} width={100} height={500} fill="#FFC27A" opacity={0.18} filter="url(#s-soft)" />
      {koyu > 0 && <rect x={-500} y={-500} width={2100} height={3000} fill="#05040C" opacity={koyu} />}
    </g>
  );
};

/** Dev kasırga: dönen spiral kollar, gözünde gerçek bir göz. */
const Kasirga: React.FC<{ x: number; y: number; s?: number; goz?: 'acik' | 'esne' | 'kirp' | 'umursamaz' | 'kapali'; bakis?: [number, number]; ret?: number; yesil?: number }> = ({ x, y, s = 1, goz = 'acik', bakis = [0, 0], ret = 0, yesil = 0 }) => {
  const f = useCurrentFrame();
  const kollar = useMemo(
    () =>
      Array.from({ length: 6 }, (_, k) => {
        let d = '';
        for (let i = 0; i <= 50; i++) {
          const a = (k / 6) * Math.PI * 2 + i * 0.1;
          const r = 130 + i * 11;
          d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `;
        }
        return d;
      }),
    [],
  );
  const rot = -f * 0.9 + ret;
  const blink = goz === 'kirp' ? Math.abs(Math.sin(f / 5)) : goz === 'kapali' ? 0 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={40} rx={720} ry={420} fill="#000" opacity={0.35} filter="url(#s-glow)" />
      <g transform="scale(1 0.6)">
        <circle r={700} fill="#5D6A92" opacity={0.5} filter="url(#s-soft)" />
        <g transform={`rotate(${rot})`}>
          <g filter="url(#s-soft)">
            {kollar.map((d, i) => (
              <path key={i} d={d} stroke={i % 2 ? '#E9EEF8' : '#C3CDE6'} strokeWidth={130} fill="none" strokeLinecap="round" opacity={0.9} />
            ))}
          </g>
          {kollar.map((d, i) => (
            <path key={'h' + i} d={d} stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.55} />
          ))}
        </g>
        <circle r={230} fill="#4B5680" opacity={0.6} filter="url(#s-soft)" />
      </g>
      {yesil > 0 && <ellipse rx={760} ry={470} fill={RAD} opacity={yesil * 0.35} style={{ mixBlendMode: 'screen' }} />}
      {/* göz */}
      <ellipse rx={150} ry={100} fill="#2A2F4E" />
      <ellipse rx={118} ry={78 * blink} fill="#fff" />
      {goz !== 'kapali' && <circle cx={bakis[0] * 40} cy={bakis[1] * 22 * blink} r={44 * Math.min(1, blink + 0.2)} fill="#1B2033" />}
      {goz !== 'kapali' && <circle cx={bakis[0] * 40 - 14} cy={bakis[1] * 22 - 14} r={12 * blink} fill="#fff" />}
      {goz === 'umursamaz' && <path d="M-124 -12 Q0 -90 124 -12 L124 -80 L-124 -80 Z" fill="#2A2F4E" />}
      {goz === 'esne' && <ellipse cx={0} cy={0} rx={120} ry={80} fill="#2A2F4E" />}
      {goz === 'esne' && <path d="M-110 0 q110 20 220 0" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />}
      <path d="M-150 0 Q0 -140 150 0" fill="none" stroke="#2A2F4E" strokeWidth={22} opacity={0.6} />
    </g>
  );
};

/** Nükleer bomba: koyu gövde, kanatçıklar, sarı radyasyon işareti. */
const Bomba: React.FC<{ s?: number; r?: number }> = ({ s = 1, r = 0 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d="M-40 -110 h80 l14 -40 h-108 z" fill="#3B4466" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={10} rx={62} ry={130} fill="#4A5478" stroke={INK} strokeWidth={8} />
    <ellipse cx={-20} cy={-30} rx={14} ry={60} fill="#fff" opacity={0.2} />
    <circle cx={0} cy={20} r={34} fill="#FFD54A" stroke={INK} strokeWidth={5} />
    {[0, 120, 240].map((a) => (
      <path key={a} d="M0 0 L-12 -28 A30 30 0 0 1 12 -28 Z" fill={INK} transform={`translate(0 20) rotate(${a})`} />
    ))}
    <circle cx={0} cy={20} r={7} fill={INK} />
  </g>
);

/** Küçük pervaneli uçak; kokpitte Çizgi'nin başı. */
const Ucak: React.FC<{ x: number; y: number; s?: number; r?: number; yesil?: number; bomba?: boolean; yuz?: 'sirit' | 'sok' | 'oksur' }> = ({ x, y, s = 1, r = 0, yesil = 0, bomba = true, yuz = 'sirit' }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 8) * 6}) rotate(${r + Math.sin(f / 13) * 2}) scale(${s})`}>
      <path d="M-200 -10 L-260 -90 h40 l60 60" fill="#C83A3A" stroke={INK} strokeWidth={6} />
      <path d="M-220 0 Q-200 -50 -40 -60 Q150 -64 210 -20 Q230 0 210 20 Q120 50 -60 40 Q-200 36 -220 0 Z" fill="#E04848" stroke={INK} strokeWidth={8} />
      <path d="M-160 10 h300" stroke="#fff" strokeWidth={10} opacity={0.6} />
      <path d="M-60 10 L-120 110 h80 L40 10 z" fill="#C83A3A" stroke={INK} strokeWidth={6} />
      {/* kokpit + Çizgi */}
      <path d="M20 -58 Q60 -140 130 -60 Z" fill="#9FD3FF" opacity={0.55} stroke={INK} strokeWidth={6} />
      <g transform="translate(78 -86)">
        <circle r={36} fill="#F2C21A" />
        <circle r={30} fill="#1B2033" />
        {yuz === 'sok' ? (
          <>
            <ellipse cx={-10} cy={-2} rx={8} ry={11} fill="#fff" />
            <ellipse cx={12} cy={-2} rx={8} ry={11} fill="#fff" />
          </>
        ) : (
          <>
            <path d="M-17 -2 q7 -7 14 0 M5 -2 q7 -7 14 0" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}
        {yuz === 'oksur' ? <ellipse cx={2} cy={16} rx={7} ry={6} fill="#fff" /> : <path d="M-8 14 q9 8 18 0" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />}
        {yesil > 0 && <circle r={36} fill={RAD} opacity={yesil * 0.55} />}
        {yesil > 0 && <path d="M0 -36 v-30" stroke="#1B2033" strokeWidth={5} strokeLinecap="round" />}
      </g>
      <ellipse cx={226} cy={0} rx={10} ry={70 * Math.abs(Math.sin(f * 1.3))} fill="#DDE3F0" opacity={0.7} />
      <circle cx={222} cy={0} r={12} fill="#3B4466" />
      {bomba && (
        <g transform="translate(-20 66)">
          <Bomba s={0.45} r={90} />
        </g>
      )}
    </g>
  );
};

/** Bulut kümesi (dolgu + koyu taban). */
const Bulut: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = '#F4D6E6', o = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {[
      [-120, 10, 70],
      [-50, -20, 90],
      [40, -30, 100],
      [120, 0, 70],
      [0, 20, 90],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={c} />
    ))}
    <rect x={-190} y={20} width={380} height={70} rx={35} fill={c} />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Why don't we just nuke a hurricane? (son karede tekrar: loop) */
const S1: React.FC = () => (
  <Kadraj zoom={[1.0, 1.1]} origin={[540, 1100]}>
    <Gok ufuk={1500} />
    <Bulut x={150} y={620} s={0.9} />
    <Bulut x={980} y={760} s={0.7} c="#E9B9D6" />
    <Kasirga x={560} y={1330} s={0.95} bakis={[-0.8, -0.8]} />
    <Ucak x={300} y={720} s={0.9} r={-4} />
    <Zerre n={20} color="#FFD8B0" o={0.3} />
  </Kadraj>
);

/** 2 · So he tried it. Bomba düşer; kasırganın gözü bombayı izler. */
const S2: React.FC = () => {
  const t = useTt();
  const it = useAt('it.');
  const drop = ap(t, it - 0.35, 0.9);
  return (
    <Kadraj zoom={[1.1, 1.0]} origin={[540, 1000]}>
      <Gok ufuk={1500} />
      <Kasirga x={560} y={1420} s={0.95} bakis={[0, -0.6 + drop]} />
      <Ucak x={380} y={560} s={1.1} bomba={false} yuz="sirit" />
      <g transform={`translate(${lerp(360, 520, drop)} ${lerp(650, 1300, drop * drop)})`}>
        <Bomba s={0.55} r={lerp(90, 10, drop)} />
      </g>
    </Kadraj>
  );
};

/** 3 · A big hurricane releases... (patlama kasırganın içinde küçük kalır, kasırga esner) */
const S3: React.FC = () => {
  const t = useTt();
  const bl = interpolate(t, [0.0, 0.12, 0.9], [0, 1, 0], clamp);
  const boom = ap(t, 0, 0.5);
  const esne = t > 1.1;
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1200]} shakeAt={[0.02]} shake={26}>
      <Gok ufuk={1500} />
      <Kasirga x={560} y={1300} s={1.05} goz={esne ? 'esne' : 'acik'} bakis={[0, 0.6]} />
      {/* minicik mantar bulutu */}
      <g transform={`translate(560 1240) scale(${0.3 + boom * 0.7})`} opacity={1 - ap(t, 1.2, 0.6)}>
        <circle r={110} fill="#FFE38A" opacity={0.9} filter="url(#s-soft)" />
        <circle r={60} fill="#fff" />
        <rect x={-22} y={0} width={44} height={140} fill="#FFB25C" />
        <ellipse cx={0} cy={-40} rx={130} ry={60} fill="#FF8A3D" opacity={0.85} />
      </g>
      <rect x={-200} y={-200} width={1500} height={2400} fill="#FFF6D8" opacity={bl} />
    </Kadraj>
  );
};

/** 4 · ...as much heat as a 10 megaton bomb every 20 minutes. Saat + bomba sayacı. */
const S4: React.FC = () => {
  const t = useTt();
  const ten = useAt('10');
  const every = useAt('every');
  const n = Math.max(0, Math.min(4, Math.floor((t - every) / 0.25) + 1));
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.05]} origin={[540, 1000]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#0D1330" />
      <rect x={-300} y={-300} width={1700} height={2500} fill="url(#h-izg)" />
      <defs>
        <pattern id="h-izg" width={60} height={60} patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#1C2C55" strokeWidth={2} />
        </pattern>
      </defs>
      {/* saat */}
      <g transform="translate(540 760)">
        <circle r={200} fill="#F4F5F7" stroke={INK} strokeWidth={14} />
        <path d={`M0 0 A170 170 0 0 1 ${170 * Math.sin((Math.PI * 2) / 3)} ${-170 * Math.cos((Math.PI * 2) / 3)} Z`} transform="rotate(-0)" fill="#FFD54A" opacity={0.0 + 0.6 * ap(t, every, 0.4)} />
        <path d="M0 0 A170 170 0 0 1 147 85 Z" fill="none" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -180 v26" stroke={INK} strokeWidth={8} transform={`rotate(${i * 30})`} />
        ))}
        <path d="M0 0 V-150" stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${lerp(0, 120, ap(t, every, 0.7))})`} />
        <circle r={14} fill={INK} />
        <text x={0} y={-230} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={70} fill="#FFD54A" opacity={ap(t, every + 0.3, 0.3)}>
          20 min
        </text>
      </g>
      {/* bomba = 10 Mt */}
      <g transform={`translate(400 1110) scale(${pop(t, ten - 0.1)})`}>
        <Bomba s={0.75} />
        <text x={120} y={30} fontFamily={fontFamily} fontWeight={800} fontSize={96} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">
          10 Mt
        </text>
      </g>
      {/* sayaç: kasırga bombaları yutuyor */}
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${300 + i * 160} ${1620 + Math.sin(f / 5 + i) * 6}) scale(${pop(t, every + i * 0.25)})`}>
          <Bomba s={0.35} r={-20} />
        </g>
      ))}
    </Kadraj>
  );
};

/** 5 · all day long. Saat hızla döner, ×72. */
const S5: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 1.2);
  const n = Math.round(lerp(4, 72, u));
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[540, 1000]} shakeAt={[1.25]} shake={10}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#0D1330" />
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${100 + (i % 12) * 80} ${800 + Math.floor(i / 12) * 95})`}>
          <Bomba s={0.16} r={(i * 37) % 40 - 20} />
        </g>
      ))}
      <g transform="translate(540 590)">
        <circle r={120} fill="#F4F5F7" stroke={INK} strokeWidth={10} />
        <path d="M0 0 V-90" stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${u * 1440})`} />
        <path d="M0 0 V-60" stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${u * 120})`} />
      </g>
      <text x={540} y={1700} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={160} fill="#FFD54A" stroke={INK} strokeWidth={10} paintOrder="stroke">
        × {n}
      </text>
    </Kadraj>
  );
};

/** 6 · And the winds would carry the radioactive fallout everywhere. Kıyı şehri yeşil buluta gömülür. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const fall = useAt('fallout');
  const yay = ap(t, fall - 0.6, 2.0);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1100]} pan={[[0, 0], [-40, 0]]}>
      <Gok ufuk={1050} koyu={0.15} />
      <g transform="translate(-200 120) scale(0.6)">
        <Kasirga x={500} y={900} s={0.9} goz="umursamaz" bakis={[1, 0.3]} yesil={yay} />
      </g>
      {/* kıyı: kum, tarlalar, şehir */}
      <path d="M-300 1300 Q300 1180 1400 1240 V2400 H-300 Z" fill="#E7C88E" />
      <path d="M-300 1360 Q400 1260 1400 1320 V2400 H-300 Z" fill="#5E8F4E" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${-200 + i * 260} 1500 l200 -40 l60 300 l-220 40 z`} fill={i % 2 ? '#7FAE5C' : '#C9B45C'} opacity={0.8} />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const h = 160 + ((i * 53) % 180);
        const xx = 420 + i * 80;
        return (
          <g key={i}>
            <rect x={xx} y={1420 - h} width={70} height={h} fill="#2A3150" stroke={INK} strokeWidth={4} />
            {Array.from({ length: 6 }, (_, j) => {
              const kapali = yay > 0.3 + ((i + j) % 5) * 0.1;
              return <rect key={j} x={xx + 10 + (j % 2) * 30} y={1420 - h + 16 + Math.floor(j / 2) * 40} width={20} height={22} fill={kapali ? '#1A1F33' : '#FFC65A'} />;
            })}
          </g>
        );
      })}
      {/* yeşil serpinti kolları */}
      {Array.from({ length: 6 }, (_, i) => {
        const p = Math.max(0, Math.min(1, yay * 1.3 - i * 0.08));
        return (
          <g key={i} opacity={p * 0.85}>
            {Array.from({ length: 6 }, (_, j) => {
              const u = j / 5;
              const cx = lerp(200, 300 + i * 160, u * p) + Math.sin(f / 10 + i + j) * 14;
              const cy = lerp(700, 1250 + (i % 3) * 120, u * p);
              return <circle key={j} cx={cx} cy={cy} r={70 + j * 16} fill={RAD} opacity={0.35} filter="url(#s-soft)" />;
            })}
          </g>
        );
      })}
      <Zerre n={60} color={RAD} y={600} h={1200} o={0.5 * yay} r={5} />
    </Kadraj>
  );
};

/** 7 · The hurricane didn't even notice. Göz kırpar, umursamaz. */
const S7: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.25, 1.35]} origin={[540, 1150]}>
      <Gok ufuk={1500} />
      <Kasirga x={540} y={1150} s={1.3} goz={t < 0.5 ? 'kirp' : 'umursamaz'} bakis={[0.9, 0.2]} />
      {/* ıslık notaları */}
      {[0, 1, 2].map((i) => {
        const p = ((t * 0.9 + i * 0.33) % 1);
        return (
          <text key={i} x={760 + p * 160} y={980 - p * 200} fontFamily={fontFamily} fontWeight={800} fontSize={70} fill="#fff" opacity={1 - p}>
            ♪
          </text>
        );
      })}
    </Kadraj>
  );
};

/** 8 · He did. Çizgi uçakta, yeşil tozla kaplı, öksürüyor. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]} shakeAt={[0.25, 0.6]} shake={8}>
      <Gok ufuk={1600} koyu={0.1} />
      <Zerre n={50} color={RAD} o={0.55} r={6} />
      <Ucak x={560} y={1000} s={2.0} r={-6} bomba={false} yesil={1} yuz="oksur" />
      {[0, 1, 2].map((i) => {
        const p = ((t * 1.4 + i * 0.3) % 1);
        return <circle key={i} cx={760 + p * 120} cy={760 - p * 80 + Math.sin(f / 3 + i) * 6} r={20 + p * 30} fill="#C9D3EA" opacity={(1 - p) * 0.8} />;
      })}
      <g transform={`translate(560 1000) scale(${1 + spring(t, 0.3) * 0.0})`} />
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's02',
  words: WORDS,
  voiceLen: 16.7,
  tail: 1.4,
  baslik: ['NUKE A', 'HURRICANE?'],
  vurgu: '#9BFF5A',
  plan: [
    { w: 'Why', C: S1 },
    { w: 'So', C: S2 },
    { w: 'A', C: S3 },
    { w: 'as', C: S4 },
    { w: 'all', C: S5 },
    { w: 'And', C: S6 },
    { w: 'The', C: S7 },
    { w: 'He', C: S8 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['whoosh', 'Why', 0.1, 0.2],
    ['whoosh', 'it.', -0.3, 0.35],
    ['impact', 'A', -0.05, 0.6],
    ['pop', '10', 0, 0.3],
    ['tick', 'every', 0, 0.4],
    ['pop', '20', 0, 0.25],
    ['rewind', 'all', 0, 0.3],
    ['drone', 'And', 0, 0.3],
    ['ding', 'notice.', 0, 0.2],
    ['buzz', 'did.', 0, 0.2],
  ],
  muzik: ['music-dark', 0.09],
});

export const S02 = short.Comp;
export const S02_FRAMES = short.frames;
