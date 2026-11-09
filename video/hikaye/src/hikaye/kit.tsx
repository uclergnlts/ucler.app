/**
 * Sinematik hikâye şablonu için 2D çizim kiti (1080×1920 dikey).
 * tepkinne video kitinden uyarlandı; kahraman ucler.app'in hardal kapüşonlu öğrencisi.
 * Kahraman, mekânlar, nesneler, kamera ve atmosfer katmanları.
 */
import React, { useMemo } from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from '../fonts';

export const W = 1080;
export const H = 1920;
export const INK = '#0E1117';
export const C = {
  shadow: '#15131F',
  wall: '#2C2540',
  wallDark: '#1B1A2B',
  floor: '#3A3448',
  warm: '#FFD58A',
  rim: '#8FB8FF',
  brand: '#1d3557',
  skin: '#F4F5F7',
  scarf: '#F2C21A',
  coat: '#F2C21A',
  pants: '#1d3557',
  paper: '#F6F1E3',
  red: '#D93036',
  teal: '#0F9488',
  gold: '#F2C94C',
  navy: '#0B1530',
  grid: '#1C2C55',
  line: '#8FD3FF',
  hi: '#FFD54A',
};

export const ease = Easing.inOut(Easing.cubic);

/** Çekimin 0..1 ilerlemesi. */
export const useP = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(f, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
};

/** Saniye cinsinden çekim içi zaman. */
export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

export const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

/** Sahne çerçevesi: SVG + kamera (yakınlaşma, kaydırma, dönme, sarsıntı) + atmosfer. */
export const Shot: React.FC<{
  children: React.ReactNode;
  zoom?: [number, number];
  pan?: [[number, number], [number, number]];
  rot?: [number, number];
  shake?: number; // piksel
  shakeAt?: number; // sn; o andan sonra 0,4 sn sarsıntı
  origin?: [number, number];
  bg?: string;
  vignette?: number;
  grain?: boolean;
  tint?: string;
}> = ({ children, zoom = [1, 1.08], pan = [[0, 0], [0, 0]], rot = [0, 0], shake = 0, shakeAt, origin = [W / 2, H / 2], bg = C.shadow, vignette = 0.6, grain = true, tint }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useP();
  const z = interpolate(p, [0, 1], zoom);
  const x = interpolate(p, [0, 1], [pan[0][0], pan[1][0]]);
  const y = interpolate(p, [0, 1], [pan[0][1], pan[1][1]]);
  const r = interpolate(p, [0, 1], rot);
  const t = f / fps;
  let sk = 0;
  if (shake) {
    if (shakeAt === undefined) sk = shake;
    else if (t >= shakeAt && t < shakeAt + 0.4) sk = shake * (1 - (t - shakeAt) / 0.4);
  }
  const sx = sk ? Math.sin(f * 2.7) * sk : 0;
  const sy = sk ? Math.cos(f * 3.1) * sk : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block', background: bg }}>
      <Defs />
      <g transform={`translate(${origin[0] + x + sx} ${origin[1] + y + sy}) rotate(${r}) scale(${z}) translate(${-origin[0]} ${-origin[1]})`}>{children}</g>
      {tint && <rect width={W} height={H} fill={tint} style={{ mixBlendMode: 'multiply' }} />}
      {vignette > 0 && <rect width={W} height={H} fill="url(#k-vig)" opacity={vignette} />}
      {grain && <rect width={W} height={H} filter="url(#k-grain)" opacity={0.07} style={{ mixBlendMode: 'overlay' }} />}
    </svg>
  );
};

export const Defs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <defs>
      <radialGradient id="k-vig" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.9" />
      </radialGradient>
      <filter id="k-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={f % 8} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <filter id="k-rim" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx={-6} dy={0} stdDeviation={3} floodColor={C.rim} floodOpacity={0.95} />
        <feDropShadow dx={5} dy={2} stdDeviation={6} floodColor="#000" floodOpacity={0.35} />
      </filter>
      <filter id="k-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={18} />
      </filter>
      <linearGradient id="k-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.wall} />
        <stop offset="1" stopColor={C.wallDark} />
      </linearGradient>
      <linearGradient id="k-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.floor} />
        <stop offset="1" stopColor="#1A1824" />
      </linearGradient>
      <radialGradient id="k-cone" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor={C.warm} stopOpacity="0.5" />
        <stop offset="1" stopColor={C.warm} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="k-sun" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFE7B0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFE7B0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="k-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B1430" />
        <stop offset="1" stopColor="#2A2350" />
      </linearGradient>
      <linearGradient id="k-dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7FA6E8" />
        <stop offset="1" stopColor="#F7C79A" />
      </linearGradient>
      <pattern id="k-grid" width={60} height={60} patternUnits="userSpaceOnUse">
        <path d="M60 0H0V60" fill="none" stroke={C.grid} strokeWidth={2} />
      </pattern>
    </defs>
  );
};

/* ---------------- Atmosfer ---------------- */

export const Dust: React.FC<{ x?: number; y?: number; w?: number; h?: number; n?: number; color?: string }> = ({ x = 0, y = 0, w = W, h = H, n = 30, color = C.warm }) => {
  const f = useCurrentFrame();
  const pts = useMemo(() => Array.from({ length: n }, (_, i) => ({ px: (i * 137) % 1000 / 1000, py: (i * 251) % 1000 / 1000, r: 2 + (i % 3), sp: 0.2 + (i % 5) * 0.1 })), [n]);
  return (
    <g>
      {pts.map((d, i) => (
        <circle key={i} cx={x + d.px * w + Math.sin((f + i * 20) / 30) * 10} cy={y + ((d.py * h - f * d.sp * 2) % h + h) % h} r={d.r} fill={color} opacity={0.35} />
      ))}
    </g>
  );
};

export const Beam: React.FC<{ x1: number; y1: number; x2: number; y2: number; w1?: number; w2?: number; opacity?: number }> = ({ x1, y1, x2, y2, w1 = 80, w2 = 500, opacity = 0.5 }) => (
  <polygon points={`${x1 - w1 / 2},${y1} ${x1 + w1 / 2},${y1} ${x2 + w2 / 2},${y2} ${x2 - w2 / 2},${y2}`} fill="url(#k-cone)" opacity={opacity} />
);

/** Şehir silueti, yanan pencereler (pencere içi ya da arka plan). */
export const City: React.FC<{ x: number; y: number; w: number; h: number; night?: boolean }> = ({ x, y, w, h, night = true }) => {
  const b = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ bx: (i / 9) * w, bw: w / 9 - 6, bh: h * (0.35 + ((i * 37) % 50) / 100) })), [w, h]);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={night ? 'url(#k-night)' : 'url(#k-dawn)'} />
      {night && <circle cx={x + w * 0.78} cy={y + h * 0.18} r={28} fill="#F7F1DC" opacity={0.9} />}
      {b.map((d, i) => (
        <g key={i}>
          <rect x={x + d.bx} y={y + h - d.bh} width={d.bw} height={d.bh} fill={night ? '#0B1222' : '#5D6C92'} />
          {Array.from({ length: 8 }, (_, j) => (
            <rect key={j} x={x + d.bx + 8 + (j % 2) * (d.bw / 2 - 4)} y={y + h - d.bh + 14 + Math.floor(j / 2) * 34} width={d.bw / 2 - 16} height={16} fill={(i + j) % 3 && night ? C.gold : night ? '#1E2A44' : '#AFC2E6'} opacity={0.85} />
          ))}
        </g>
      ))}
    </g>
  );
};

/* ---------------- Kahraman ---------------- */

export type Ifade = 'normal' | 'sok' | 'mutlu' | 'zoraki' | 'merakli' | 'uzgun' | 'umut' | 'kizgin';
export type Kol = 'asagi' | 'yukari' | 'telefon' | 'tutuyor' | 'bel' | 'atki';

export const Yuz: React.FC<{ ifade: Ifade; blink?: boolean; look?: [number, number] }> = ({ ifade, blink = false, look = [0, 0] }) => {
  const [lx, ly] = look;
  const eye = (cx: number) => {
    if (blink) return <path key={cx} d={`M${cx - 12 + lx} ${-4 + ly} h24`} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
    if (ifade === 'sok')
      return (
        <g key={cx}>
          <circle cx={cx} cy={-8} r={20} fill="#fff" stroke={INK} strokeWidth={5} />
          <circle cx={cx + lx} cy={-8 + ly} r={6} fill={INK} />
        </g>
      );
    if (ifade === 'mutlu') return <path key={cx} d={`M${cx - 13} 0 q13 -18 26 0`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
    if (ifade === 'uzgun') return <circle key={cx} cx={cx + lx} cy={2 + ly} r={8} fill={INK} />;
    return <circle key={cx} cx={cx + lx} cy={-4 + ly} r={9} fill={INK} />;
  };
  const brows: Record<Ifade, string> = {
    normal: 'M-46 -34 l26 -4 M20 -38 l26 4',
    sok: 'M-50 -48 q18 -14 34 -2 M16 -50 q18 -12 34 2',
    mutlu: 'M-46 -36 q14 -8 28 0 M18 -36 q14 -8 28 0',
    zoraki: 'M-46 -30 l26 -8 M20 -38 l26 8',
    merakli: 'M-46 -30 l26 0 M20 -46 q14 -10 28 2',
    uzgun: 'M-46 -26 l26 -10 M20 -36 l26 10',
    umut: 'M-46 -38 q14 -6 28 0 M18 -38 q14 -6 28 0',
    kizgin: 'M-46 -42 l28 12 M18 -30 l28 -12',
  };
  const mouth: Record<Ifade, React.ReactNode> = {
    normal: <path d="M-16 36 q16 8 32 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />,
    sok: <ellipse cx={0} cy={44} rx={18} ry={24} fill="#3A1F2B" stroke={INK} strokeWidth={5} />,
    mutlu: <path d="M-30 28 q30 36 60 0 Z" fill="#3A1F2B" stroke={INK} strokeWidth={5} strokeLinejoin="round" />,
    zoraki: (
      <g>
        <path d="M-30 36 q8 -6 15 0 t15 0 t15 0 t15 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M58 -40 q10 18 0 26 q-10 -8 0 -26 Z" fill="#9AD0FF" stroke={INK} strokeWidth={3} />
      </g>
    ),
    merakli: <path d="M-6 40 q14 -6 24 4" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />,
    uzgun: <path d="M-18 46 q18 -14 36 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />,
    umut: <path d="M-20 34 q20 14 40 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />,
    kizgin: <path d="M-20 44 h40" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />,
  };
  return (
    <g>
      <path d={brows[ifade]} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {eye(-30)}
      {eye(30)}
      {mouth[ifade]}
    </g>
  );
};

/** Ayakta kahraman. (x,y) ayakların ortası. Boy ~620 px (s=1). */
export const Kahraman: React.FC<{ x: number; y: number; s?: number; ifade?: Ifade; kol?: Kol; look?: [number, number]; flip?: boolean; bob?: number; children?: React.ReactNode }> = ({
  x,
  y,
  s = 1,
  ifade = 'normal',
  kol = 'asagi',
  look,
  flip = false,
  bob = 0,
  children,
}) => {
  const f = useCurrentFrame();
  const blink = f % 96 > 91;
  const breathe = Math.sin(f / 14) * 0.012;
  const arms: Record<Kol, [string, string]> = {
    asagi: ['M-62 -350 Q-96 -270 -78 -200', 'M62 -350 Q96 -270 78 -200'],
    yukari: ['M-62 -350 Q-120 -420 -110 -500', 'M62 -350 Q120 -420 110 -500'],
    telefon: ['M-62 -350 Q-96 -270 -78 -200', 'M62 -350 Q110 -300 40 -300'],
    tutuyor: ['M-62 -350 Q-70 -290 -20 -280', 'M62 -350 Q70 -290 20 -280'],
    bel: ['M-62 -350 Q-130 -300 -60 -250', 'M62 -350 Q130 -300 60 -250'],
    atki: ['M-62 -350 Q-80 -330 -30 -380', 'M62 -350 Q80 -330 30 -380'],
  };
  const hands: Record<Kol, [[number, number], [number, number]]> = {
    asagi: [[-78, -200], [78, -200]],
    yukari: [[-110, -500], [110, -500]],
    telefon: [[-78, -200], [40, -300]],
    tutuyor: [[-20, -280], [20, -280]],
    bel: [[-60, -250], [60, -250]],
    atki: [[-30, -380], [30, -380]],
  };
  const [a1, a2] = arms[kol];
  const [h1, h2] = hands[kol];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`} strokeLinejoin="round" strokeLinecap="round" filter="url(#k-rim)">
      <ellipse cx={0} cy={4} rx={130} ry={22} fill="rgba(0,0,0,0.35)" />
      {/* bacaklar */}
      <path d="M-40 0 L-36 -190 L-4 -190 L-8 0 Z" fill={C.pants} stroke={INK} strokeWidth={6} />
      <path d="M8 0 L4 -190 L36 -190 L40 0 Z" fill={C.pants} stroke={INK} strokeWidth={6} />
      <path d="M-56 4 Q-54 -16 -10 -14 L-4 6 Z" fill="#111" stroke={INK} strokeWidth={5} />
      <path d="M4 6 L10 -14 Q54 -16 56 4 Z" fill="#111" stroke={INK} strokeWidth={5} />
      <g transform={`translate(0 -190) scale(1 ${1 + breathe}) translate(0 190)`}>
        {/* gövde: mont */}
        <path d="M-80 -180 Q-90 -320 -54 -370 Q0 -392 54 -370 Q90 -320 80 -180 Z" fill={C.coat} stroke={INK} strokeWidth={6} />
        <path d="M0 -370 V-190" stroke={INK} strokeWidth={4} />
        {/* kollar */}
        <path d={a1} fill="none" stroke={INK} strokeWidth={36} />
        <path d={a1} fill="none" stroke={C.coat} strokeWidth={24} />
        <path d={a2} fill="none" stroke={INK} strokeWidth={36} />
        <path d={a2} fill="none" stroke={C.coat} strokeWidth={24} />
        {children}
        <circle cx={h1[0]} cy={h1[1]} r={17} fill={C.skin} stroke={INK} strokeWidth={5} />
        <circle cx={h2[0]} cy={h2[1]} r={17} fill={C.skin} stroke={INK} strokeWidth={5} />
        {/* kapüşon (imza öğesi): başın arkasında yaka + ipler */}
        <path d="M-70 -372 Q-96 -430 -60 -470 L60 -470 Q96 -430 70 -372 Q0 -346 -70 -372 Z" fill="#D9A90F" stroke={INK} strokeWidth={6} />
        <path d="M-18 -362 L-22 -300 M18 -362 L22 -300" stroke="#F7F1DC" strokeWidth={6} />
        <circle cx={-22} cy={-296} r={6} fill="#F7F1DC" stroke={INK} strokeWidth={3} />
        <circle cx={22} cy={-296} r={6} fill="#F7F1DC" stroke={INK} strokeWidth={3} />
        <path d="M-44 -250 h88 v40 h-88 Z" fill="#D9A90F" stroke={INK} strokeWidth={5} />
        {/* kafa */}
        <g transform="translate(0 -480)">
          <circle r={92} fill={C.skin} stroke={INK} strokeWidth={6} />
          <path d="M-88 -24 Q-92 -98 0 -100 Q86 -98 88 -30 Q60 -70 10 -62 Q-40 -54 -88 -24 Z" fill="#232838" stroke={INK} strokeWidth={6} />
          <g transform="translate(0 10)">
            <Yuz ifade={ifade} blink={blink && ifade !== 'mutlu'} look={look} />
          </g>
        </g>
      </g>
    </g>
  );
};

/** Ekranı dolduran dev yüz. */
export const DevYuz: React.FC<{ ifade: Ifade; bg?: string; look?: [number, number] }> = ({ ifade, bg = C.wall, look }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={W} height={H} fill={bg} />
      <rect width={W} height={H} fill="url(#k-cone)" opacity={0.6} />
      <g transform={`translate(${W / 2} ${H * 0.47}) scale(5.2)`} filter="url(#k-rim)">
        <path d="M-118 40 Q-130 -60 -96 -110 L96 -110 Q130 -60 118 40 L140 220 L-140 220 Z" fill="#D9A90F" stroke={INK} strokeWidth={4} />
        <path d="M-70 100 Q0 130 70 100 L90 220 L-90 220 Z" fill={C.coat} stroke={INK} strokeWidth={4} />
        <circle r={92} fill={C.skin} stroke={INK} strokeWidth={4} />
        <path d="M-88 -24 Q-92 -98 0 -100 Q86 -98 88 -30 Q60 -70 10 -62 Q-40 -54 -88 -24 Z" fill="#232838" stroke={INK} strokeWidth={4} />
        <g transform="translate(0 10)">
          <Yuz ifade={ifade} blink={f % 70 > 66 && ifade !== 'mutlu' && ifade !== 'sok'} look={look} />
        </g>
      </g>
    </g>
  );
};

/** İsimsiz figür: kahramana benzemez, kapüşonsuz. */
export const Figur: React.FC<{ x: number; y: number; s?: number; color?: string; hair?: string; ifade?: Ifade }> = ({ x, y, s = 1, color = '#6B5B95', hair = '#4A2E22', ifade = 'normal' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={0} cy={4} rx={110} ry={18} fill="rgba(0,0,0,0.3)" />
    <path d="M-36 0 L-32 -170 L-2 -170 L-6 0 Z" fill="#2B2F3F" stroke={INK} strokeWidth={6} />
    <path d="M6 0 L2 -170 L32 -170 L36 0 Z" fill="#2B2F3F" stroke={INK} strokeWidth={6} />
    <path d="M-72 -165 Q-80 -300 -48 -340 Q0 -360 48 -340 Q80 -300 72 -165 Z" fill={color} stroke={INK} strokeWidth={6} />
    <g transform="translate(0 -430)">
      <circle r={82} fill={C.skin} stroke={INK} strokeWidth={6} />
      <path d="M-80 0 Q-84 -88 0 -90 Q80 -88 80 0 Q60 -50 0 -52 Q-60 -50 -80 0 Z" fill={hair} stroke={INK} strokeWidth={6} />
      <g transform="translate(0 14) scale(0.85)">
        <Yuz ifade={ifade} />
      </g>
    </g>
  </g>
);

/* ---------------- Mekânlar ---------------- */

/** Kiralık daire: duvar, pencere, lamba, zemin. */
export const Oda: React.FC<{ night?: boolean; sun?: boolean; windowX?: number }> = ({ night = true, sun = false, windowX = 90 }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={1700} fill="url(#k-wall)" />
    {/* duvar kağıdı çizgileri */}
    {Array.from({ length: 16 }, (_, i) => (
      <rect key={i} x={-300 + i * 110} y={-300} width={4} height={1700} fill="#3A3150" opacity={0.5} />
    ))}
    <rect x={-300} y={1260} width={W + 600} height={18} fill="#3B3352" />
    {/* pencere */}
    <g>
      <rect x={windowX - 14} y={286} width={468} height={588} rx={10} fill="#1A1626" />
      <City x={windowX} y={300} w={440} h={560} night={night} />
      <path d={`M${windowX + 220} 300 V860 M${windowX} 560 H${windowX + 440}`} stroke={INK} strokeWidth={14} />
      <rect x={windowX} y={300} width={440} height={560} fill="none" stroke={INK} strokeWidth={14} />
      <rect x={windowX - 40} y={860} width={520} height={30} rx={6} fill="#4B4366" stroke={INK} strokeWidth={6} />
      {/* perde */}
      <path d={`M${windowX - 50} 270 Q${windowX - 10} 560 ${windowX - 60} 900 L${windowX - 110} 900 Q${windowX - 80} 560 ${windowX - 110} 270 Z`} fill="#6E3B5C" stroke={INK} strokeWidth={6} />
    </g>
    {sun && <polygon points={`${windowX},300 ${windowX + 440},300 ${windowX + 980},1600 ${windowX + 200},1600`} fill="url(#k-sun)" />}
    {/* çerçeveli resim ve raf */}
    <rect x={700} y={360} width={200} height={150} rx={6} fill="#3F3657" stroke={INK} strokeWidth={8} />
    <path d="M720 490 L780 420 L820 460 L860 410 L880 490 Z" fill="#5A4E7A" />
    <rect x={660} y={640} width={300} height={20} fill="#4B4366" stroke={INK} strokeWidth={5} />
    <rect x={690} y={580} width={40} height={60} fill="#7A6CA8" stroke={INK} strokeWidth={4} />
    <rect x={740} y={560} width={30} height={80} fill="#B4436C" stroke={INK} strokeWidth={4} />
    <circle cx={880} cy={610} r={28} fill="#2E7D5B" stroke={INK} strokeWidth={4} />
    {/* zemin */}
    <rect x={-300} y={1278} width={W + 600} height={900} fill="url(#k-floor)" />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={-300 + i * 150} y1={1278} x2={-600 + i * 230} y2={2200} stroke="#2A2536" strokeWidth={4} />
    ))}
    {/* tavan lambası */}
    <path d="M760 -300 V120" stroke={INK} strokeWidth={6} />
    <path d="M680 130 Q760 60 840 130 Z" fill="#2F2A3F" stroke={INK} strokeWidth={6} />
    <ellipse cx={760} cy={132} rx={28} ry={10} fill="#FFE3A3" />
    {night && <Beam x1={760} y1={130} x2={760} y2={1500} w1={150} w2={900} opacity={0.55} />}
  </g>
);

/** Market reyonu: raflar, ürünler, fiyat etiketleri. grow: etiketlerin büyüme oranı. */
export const Market: React.FC<{ grow?: number }> = ({ grow = 1 }) => {
  const colors = ['#D93036', '#F2C94C', '#0F9488', '#5B3DF5', '#E07A2E', '#2E7D5B'];
  return (
    <g>
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#E9EEF5" />
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#1C1838" opacity={0.25} />
      {/* tavan ışıkları */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={120 + i * 320} y={60} width={200} height={24} rx={8} fill="#FFFDF0" />
      ))}
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r} transform={`translate(0 ${260 + r * 270})`}>
          <rect x={-100} y={170} width={W + 200} height={26} fill="#B8C0CF" stroke={INK} strokeWidth={5} />
          {Array.from({ length: 9 }, (_, i) => {
            const c = colors[(i + r * 2) % colors.length];
            const hgt = 110 + ((i * 31 + r * 17) % 50);
            return (
              <g key={i}>
                <rect x={-60 + i * 130} y={170 - hgt} width={100} height={hgt} rx={10} fill={c} stroke={INK} strokeWidth={5} />
                <rect x={-50 + i * 130} y={190 - hgt} width={80} height={24} rx={4} fill="#fff" opacity={0.85} />
              </g>
            );
          })}
          {Array.from({ length: 4 }, (_, i) => {
            const sc = 1 + (grow - 1) * (0.6 + (i % 3) * 0.3);
            return (
              <g key={i} transform={`translate(${60 + i * 260} 210) scale(${sc})`}>
                <rect x={-58} y={-18} width={116} height={52} rx={6} fill={C.gold} stroke={INK} strokeWidth={4} />
                <text x={0} y={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={28} fill={INK}>
                  ₺{Math.round((49 + i * 37 + r * 23) * (1 + (grow - 1) * 1.5))}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <rect x={-300} y={1640} width={W + 600} height={700} fill="#C9CED8" />
    </g>
  );
};

/** Şema dünyası: koyu lacivert ızgara. */
export const Sema: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={C.navy} />
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="url(#k-grid)" />
    <circle cx={W / 2} cy={H / 2} r={700} fill="#1E3A7A" opacity={0.25} filter="url(#k-glow)" />
    {children}
  </g>
);

/* ---------------- Nesneler ---------------- */

export const Takvim: React.FC<{ x: number; y: number; s?: number; gun: number | string; ay?: string; dark?: boolean }> = ({ x, y, s = 1, gun, ay = 'AY', dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-180} width={300} height={360} rx={18} fill={C.paper} stroke={INK} strokeWidth={8} />
    <rect x={-150} y={-180} width={300} height={90} rx={18} fill={C.red} stroke={INK} strokeWidth={8} />
    <circle cx={-80} cy={-185} r={12} fill={INK} />
    <circle cx={80} cy={-185} r={12} fill={INK} />
    <text x={0} y={-118} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={44} fill="#fff">
      {ay}
    </text>
    <text x={0} y={110} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={200} fill={dark ? C.red : INK}>
      {gun}
    </text>
  </g>
);

export const Banknot: React.FC<{ x: number; y: number; s?: number; r?: number; deger?: string }> = ({ x, y, s = 1, r = 0, deger = '20' }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-110} y={-55} width={220} height={110} rx={10} fill="#9CC9A4" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={0} r={32} fill="none" stroke="#5E8F68" strokeWidth={6} />
    <text x={0} y={14} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={40} fill="#2F5A3A">
      {deger}
    </text>
    <text x={-80} y={-26} fontFamily={fontFamily} fontWeight={800} fontSize={24} fill="#2F5A3A">
      ₺
    </text>
  </g>
);

export const Telefon: React.FC<{ x: number; y: number; s?: number; r?: number; children?: React.ReactNode; glow?: boolean }> = ({ x, y, s = 1, r = 0, children, glow }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {glow && <rect x={-200} y={-360} width={400} height={720} rx={60} fill={C.rim} opacity={0.35} filter="url(#k-glow)" />}
    <rect x={-170} y={-330} width={340} height={660} rx={48} fill="#14121C" stroke={INK} strokeWidth={10} />
    <rect x={-150} y={-300} width={300} height={600} rx={32} fill="#1E2240" />
    <rect x={-40} y={-318} width={80} height={14} rx={7} fill="#000" />
    {children}
  </g>
);

export const Zarf: React.FC<{ x: number; y: number; s?: number; r?: number; etiket?: string; color?: string }> = ({ x, y, s = 1, r = 0, etiket, color = C.paper }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-150} y={-90} width={300} height={180} rx={8} fill={color} stroke={INK} strokeWidth={6} />
    <path d="M-150 -90 L0 20 L150 -90" fill="none" stroke={INK} strokeWidth={5} />
    {etiket && (
      <g>
        <rect x={-120} y={30} width={240} height={46} rx={6} fill={C.red} />
        <text x={0} y={64} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={30} fill="#fff">
          {etiket}
        </text>
      </g>
    )}
  </g>
);

/** Büyük rakam (şema dünyası ve montaj için). */
export const Rakam: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; sub?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, text, size = 180, color = '#fff', sub, anchor = 'middle' }) => (
  <g>
    <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={color} letterSpacing="-0.03em" stroke={INK} strokeWidth={size / 30} paintOrder="stroke">
      {text}
    </text>
    {sub && (
      <text x={x} y={y + size * 0.42} textAnchor={anchor} fontFamily={fontFamily} fontWeight={700} fontSize={size * 0.22} fill={C.line}>
        {sub}
      </text>
    )}
  </g>
);

export const Buyutec: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = -30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-18} y={110} width={36} height={180} rx={14} fill="#6B4A2E" stroke={INK} strokeWidth={6} />
    <circle r={120} fill="#BFE6FF" opacity={0.35} stroke={INK} strokeWidth={14} />
    <circle r={120} fill="none" stroke="#C5CBD8" strokeWidth={6} />
    <path d="M-60 -60 q30 -30 70 -20" fill="none" stroke="#fff" strokeWidth={8} opacity={0.7} />
  </g>
);

export const Soru: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.hi }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={180 * s} fill={color} stroke={INK} strokeWidth={8 * s} paintOrder="stroke">
    ?
  </text>
);

/** Beyaz flaş / karartma katmanı (çekim başında ya da sonunda). */
export const Flash: React.FC<{ at?: number; dur?: number; color?: string }> = ({ at = 0, dur = 0.25, color = '#fff' }) => {
  const t = useT();
  const o = interpolate(t, [at, at + 0.03, at + dur], [0, 1, 0], clamp);
  return <rect width={W} height={H} fill={color} opacity={o} />;
};
