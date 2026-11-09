/**
 * 10 Kasım anma videosu çekimleri (dikey 9:16). Kit: ../kit.tsx.
 * useAt('kelime'): o kelimenin bu çekimin başına göre saniyesi ("kelime#2" ikinci geçiş).
 */
import React, { createContext, useContext } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { fontFamily } from '../fonts';
import { wt } from './captions';
import { C, City, clamp, DevYuz, Dust, Figur, Flash, H, INK, Kahraman, Oda, Rakam, Sema, Shot, Soru, Takvim, useT, W } from '../kit';

export const ShotStart = createContext(0);
export const useAt = (spec: string) => wt(spec) - useContext(ShotStart);

const outBack = Easing.out(Easing.back(1.6));
const outCubic = Easing.out(Easing.cubic);
const ap = (t: number, at: number, d = 0.35, e = outCubic) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, at: number) => interpolate(t, [at, at + 0.3], [0, 1], { ...clamp, easing: outBack });

const RED = '#E30A17';
const SEPIA = '#C8B497';
const DAWN_TOP = '#1E2740';
const DAWN_BOT = '#6E7894';

const Lbl: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; bg?: string; o?: number; s?: number }> = ({ x, y, text, size = 48, color = '#fff', bg, o = 1, s = 1 }) => {
  const w = text.length * size * 0.6 + size;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      {bg && <rect x={x - w / 2} y={y - size * 1.05} width={w} height={size * 1.45} rx={size * 0.3} fill={bg} stroke={INK} strokeWidth={5} />}
      <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={color} stroke={bg ? 'none' : INK} strokeWidth={bg ? 0 : size / 9} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
};

/* ---------- ortak parçalar ---------- */

/** Gökyüzü: sabah alacası (bugün) ya da gri kasım sabahı (1938). */
const Gok: React.FC<{ top?: string; bot?: string }> = ({ top = DAWN_TOP, bot = DAWN_BOT }) => (
  <g>
    <defs>
      <linearGradient id="o-gok" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bot} />
      </linearGradient>
    </defs>
    <rect x={-500} y={-500} width={W + 1000} height={H + 1000} fill="url(#o-gok)" />
  </g>
);

/** Duvar saati; h:m ibre konumu. stop: sarkaç durur. */
const DuvarSaati: React.FC<{ x: number; y: number; s?: number; h?: number; m?: number; tick?: boolean; antique?: boolean }> = ({ x, y, s = 1, h = 9, m = 5, tick = true, antique = false }) => {
  const f = useCurrentFrame();
  const sec = tick ? (f / 30) * 6 : 0;
  const face = antique ? '#EFE3C8' : '#F4F5F7';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={300} fill={antique ? '#5A3E22' : '#22283A'} stroke={INK} strokeWidth={14} />
      <circle r={262} fill={face} stroke={INK} strokeWidth={8} />
      {Array.from({ length: 60 }, (_, i) => (
        <path key={i} d={`M0 ${-246} V${i % 5 ? -232 : -212}`} stroke={INK} strokeWidth={i % 5 ? 4 : 10} strokeLinecap="round" transform={`rotate(${i * 6})`} />
      ))}
      <path d="M0 22 V-130" stroke={INK} strokeWidth={20} strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
      <path d="M0 30 V-205" stroke={INK} strokeWidth={12} strokeLinecap="round" transform={`rotate(${m * 6})`} />
      {tick && <path d="M0 40 V-220" stroke={RED} strokeWidth={5} strokeLinecap="round" transform={`rotate(${Math.floor(sec / 6) * 6})`} />}
      <circle r={18} fill={INK} />
    </g>
  );
};

/** Siren direği ve ses dalgaları. */
const Siren: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => {
  const t = useT();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={0} width={24} height={900} fill="#3A3F55" stroke={INK} strokeWidth={5} />
      <path d="M-90 -40 L90 -40 L120 40 L-120 40 Z" fill="#8A93A8" stroke={INK} strokeWidth={8} />
      <circle cx={0} cy={0} r={34} fill="#2A2F40" stroke={INK} strokeWidth={6} />
      {on &&
        [0, 1, 2, 3].map((i) => {
          const k = (t * 0.7 + i / 4) % 1;
          const r = 120 + k * 520;
          return <path key={i} d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke="#fff" strokeWidth={10 - k * 6} opacity={(1 - k) * 0.55} transform="rotate(180)" />;
        })}
    </g>
  );
};

/** Sokak: binalar, kaldırım, durak; bugünün gri sabahı. */
const Sokak: React.FC<{ people?: boolean; bus?: number }> = ({ people = false, bus }) => (
  <g>
    <Gok />
    <City x={-300} y={560} w={W + 600} h={720} night={false} />
    <rect x={-400} y={1270} width={W + 800} height={40} fill="#4A4F60" />
    <rect x={-400} y={1310} width={W + 800} height={900} fill="#2A2D38" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-120 + i * 300} y={1600} width={170} height={18} fill="#E9E2C8" opacity={0.55} />
    ))}
    {bus !== undefined && <Otobus x={bus} y={1560} />}
    {people && (
      <g>
        <Figur x={130} y={1300} s={0.62} color="#5E6A86" />
        <Figur x={900} y={1300} s={0.6} color="#7A5C6E" hair="#2B2B2B" />
      </g>
    )}
  </g>
);

const Otobus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-330} width={660} height={300} rx={40} fill="#2F7CF6" stroke={INK} strokeWidth={10} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-290 + i * 145} y={-290} width={120} height={110} rx={12} fill="#BFD6F6" stroke={INK} strokeWidth={6} />
    ))}
    <rect x={-330} y={-130} width={660} height={22} fill="#1B4FA8" />
    <circle cx={-200} cy={-28} r={52} fill="#22252E" stroke={INK} strokeWidth={8} />
    <circle cx={200} cy={-28} r={52} fill="#22252E" stroke={INK} strokeWidth={8} />
  </g>
);

/** Defter (açık), üstten görünüm. */
const Defter: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#5B4636" />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={-400} y={-400 + i * 260} width={W + 800} height={6} fill="#4A382A" />
    ))}
    <g transform="rotate(-4 540 960)">
      <rect x={120} y={380} width={840} height={1160} rx={18} fill="#F7F3E8" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M150 ${500 + i * 64} H930`} stroke="#B8CBE6" strokeWidth={4} />
      ))}
      <path d="M240 380 V1540" stroke="#E7A3A3" strokeWidth={5} />
      {children}
    </g>
  </g>
);

/** Kara tahta. */
const Tahta: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#4B3F33" />
    <rect x={60} y={380} width={960} height={620} rx={14} fill="#6B4A2E" stroke={INK} strokeWidth={10} />
    <rect x={90} y={410} width={900} height={560} fill="#2E3B33" />
    <rect x={90} y={410} width={900} height={560} fill="#fff" opacity={0.04} />
    <rect x={80} y={980} width={920} height={26} fill="#6B4A2E" stroke={INK} strokeWidth={6} />
    {children}
  </g>
);

/** Sıra ve öğrenci (sınıf). */
const Sira: React.FC<{ x: number; y: number; s?: number; color?: string; hair?: string }> = ({ x, y, s = 1, color, hair }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Figur x={0} y={0} s={0.8} color={color} hair={hair} />
    <rect x={-150} y={-190} width={300} height={40} rx={6} fill="#8B5E3C" stroke={INK} strokeWidth={6} />
    <rect x={-130} y={-150} width={20} height={150} fill="#6B4A2E" />
    <rect x={110} y={-150} width={20} height={150} fill="#6B4A2E" />
  </g>
);

/** Siyah kurdele. */
const Kurdele: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 150 L22 18 C55 -38 38 -108 0 -108 C-38 -108 -55 -38 -22 18 L60 150" fill="none" stroke="#0A0A0C" strokeWidth={34} strokeLinejoin="round" />
    <path d="M-60 150 L22 18 C55 -38 38 -108 0 -108 C-38 -108 -55 -38 -22 18 L60 150" fill="none" stroke="#3A3A44" strokeWidth={6} strokeLinejoin="round" opacity={0.6} transform="translate(-6 -4)" />
  </g>
);

/** Türk bayrağı, dalgalanır. */
const Bayrak: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const t = useT();
  const sk = Math.sin(t * 2.2) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) skewY(${sk})`}>
      <rect x={0} y={-140} width={420} height={280} fill={RED} />
      <circle cx={148} cy={0} r={70} fill="#fff" />
      <circle cx={166} cy={0} r={56} fill={RED} />
      <path transform="translate(242 0) rotate(-18)" d="M0,-35 L8.2,-11.3 L33.3,-10.8 L13.3,4.3 L20.6,28.3 L0,14 L-20.6,28.3 L-13.3,4.3 L-33.3,-10.8 L-8.2,-11.3 Z" fill="#fff" />
    </g>
  );
};

/** Anıtkabir silueti (çizgi). */
const Anitkabir: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = '#2A2F40' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-560} y={0} width={1120} height={30} fill={fill} />
    <rect x={-520} y={30} width={1040} height={30} fill={fill} opacity={0.85} />
    <rect x={-480} y={60} width={960} height={30} fill={fill} opacity={0.7} />
    <rect x={-420} y={-60} width={840} height={60} fill={fill} />
    {Array.from({ length: 14 }, (_, i) => (
      <rect key={i} x={-400 + i * 60} y={-300} width={30} height={240} fill={fill} />
    ))}
    <rect x={-430} y={-340} width={860} height={44} fill={fill} />
    <rect x={-300} y={-400} width={600} height={60} fill={fill} />
  </g>
);

/** Dolmabahçe silueti: deniz kıyısında uzun cephe, ortada kubbe. */
const Dolmabahce: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-620} y={-180} width={1240} height={180} fill="#D9D2C2" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 18 }, (_, i) => (
      <path key={i} d={`M${-590 + i * 68} -20 V-120 a22 22 0 0 1 44 0 V-20 Z`} fill="#8D8677" stroke={INK} strokeWidth={4} />
    ))}
    <rect x={-160} y={-300} width={320} height={130} fill="#E4DDCD" stroke={INK} strokeWidth={6} />
    <path d="M-120 -300 Q0 -420 120 -300 Z" fill="#CFC7B5" stroke={INK} strokeWidth={6} />
    <rect x={-640} y={-196} width={1280} height={18} fill="#BEB6A4" stroke={INK} strokeWidth={4} />
  </g>
);

/** Deniz (Boğaz), hafif dalgalı. */
const Deniz: React.FC<{ y: number; color?: string }> = ({ y, color = '#4A5873' }) => {
  const t = useT();
  return (
    <g>
      <rect x={-500} y={y} width={W + 1000} height={1400} fill={color} />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M${-300 + ((i * 197 + t * 30) % 1500)} ${y + 60 + i * 70} h${80 + (i % 3) * 40}`} stroke="#fff" strokeWidth={5} opacity={0.25} strokeLinecap="round" />
      ))}
    </g>
  );
};

/** Yaşlı adam: gri saç, şapka göğsünde. */
const Yasli: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Figur x={0} y={0} s={1} color="#4E4A42" hair="#D6D6D6" ifade="uzgun" />
    <g transform="translate(-10 -250)">
      <ellipse cx={0} cy={20} rx={95} ry={22} fill="#2A2622" stroke={INK} strokeWidth={6} />
      <path d="M-55 18 Q-55 -50 0 -52 Q55 -50 55 18 Z" fill="#3A332C" stroke={INK} strokeWidth={6} />
      <rect x={-55} y={-6} width={110} height={16} fill="#1E1A16" />
    </g>
    <circle cx={-70} cy={-235} r={18} fill={C.skin} stroke={INK} strokeWidth={5} />
    <circle cx={60} cy={-235} r={18} fill={C.skin} stroke={INK} strokeWidth={5} />
  </g>
);

/** Sepya (1938) filtresi altında çekim. */
const Eski: React.FC<{ children: React.ReactNode; zoom?: [number, number]; pan?: [[number, number], [number, number]]; origin?: [number, number] }> = ({ children, zoom = [1.04, 1.14], pan, origin }) => (
  <Shot zoom={zoom} pan={pan} origin={origin} tint={SEPIA} vignette={0.85}>
    {children}
  </Shot>
);

/* ===================== AÇILIŞ: BUGÜN, 09.05 ===================== */

export const O01: React.FC = () => (
  <Shot zoom={[1.0, 1.18]} origin={[540, 900]} bg="#0E1117">
    <Gok top="#1A2032" bot="#4A5370" />
    <DuvarSaati x={540} y={900} s={1.25} h={9} m={5} />
    <Flash at={0} dur={0.6} color="#000" />
  </Shot>
);

/** Herkes duruyor: sokakta donma karesi. */
export const O02: React.FC = () => {
  const t = useT();
  const fr = useAt('duruyor.') - 0.1;
  const k = ap(t, fr, 0.2);
  const mv = Math.min(t, fr) * 60;
  return (
    <Shot zoom={[1.15, 1.02]} pan={[[0, 40], [0, 0]]} tint={k > 0.5 ? '#9FB4D9' : undefined}>
      <Sokak />
      <g transform={`translate(${mv - 120} 0)`}>
        <Otobus x={520} y={1780} s={0.9} />
      </g>
      <Figur x={200 + Math.min(t, fr) * 20} y={1330} s={0.7} color="#5E6A86" />
      <Figur x={820 - Math.min(t, fr) * 25} y={1330} s={0.66} color="#7A5C6E" hair="#2B2B2B" />
      <Figur x={660} y={1340} s={0.5} color="#6E7A52" />
      {k > 0 && <Lbl x={540} y={420} text="09.05" size={120} color="#fff" o={k} s={0.9 + 0.1 * k} />}
      <Flash at={fr} dur={0.3} />
    </Shot>
  );
};

/* ===================== OLAYLAR: SINAVA GEÇ KALAN ÖĞRENCİ ===================== */

export const O03: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.05, 1.2]} origin={[540, 1100]}>
      <Oda night={false} />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#1A2040" opacity={0.25} />
      <Kahraman x={560 + t * 40} y={1500} s={1.05} ifade="sok" kol="tutuyor" canta bob={-Math.abs(Math.sin(t * 9)) * 10} />
      <Lbl x={540} y={330} text="SINAV 09.30" size={56} bg={RED} o={ap(t, 0.4)} />
    </Shot>
  );
};

export const O04: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.08, 1.0]} pan={[[0, 0], [-40, 0]]} shake={4}>
      <Sokak bus={560 + t * 260} />
      <Kahraman x={260 + t * 50} y={1560} s={0.8} ifade="sok" kol="yukari" canta bob={-Math.abs(Math.sin(t * 10)) * 18} />
    </Shot>
  );
};

export const O05: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.2, 1.3]} origin={[540, 1100]} rot={[-2, 2]}>
      <Sokak />
      <Kahraman x={540} y={1600} s={1.1} ifade="sok" kol="yukari" canta bob={-Math.abs(Math.sin(t * 10)) * 14} />
      {Array.from({ length: 7 }, (_, i) => {
        const k = t * 1.1 + i * 0.13;
        return (
          <g key={i} transform={`translate(${560 + Math.sin(i * 2) * 120 + k * (i % 2 ? 340 : -320)} ${900 - k * 260 + Math.sin(k * 3 + i) * 50}) rotate(${k * 160 * (i % 2 ? 1 : -1)})`}>
            <rect x={-60} y={-80} width={120} height={160} rx={6} fill={C.paper} stroke={INK} strokeWidth={5} />
            <path d="M-38 -40 h76 M-38 -10 h76 M-38 20 h50" stroke="#9AA6B6" strokeWidth={6} strokeLinecap="round" />
          </g>
        );
      })}
      <Dust n={20} color="#fff" />
    </Shot>
  );
};

/** Kol saati: 08.59 → 09.00. */
export const O06: React.FC = () => {
  const t = useT();
  const d = useAt('Dokuz.');
  const m = t > d - 0.2 ? '09.00' : '08.59';
  return (
    <Shot zoom={[1.0, 1.25]} origin={[540, 900]}>
      <Gok top="#20283F" bot="#5B6480" />
      <path d="M-100 1500 Q300 1150 1180 1160 L1180 1700 Q400 1700 -100 1900 Z" fill={C.coat} stroke={INK} strokeWidth={10} />
      <rect x={300} y={600} width={480} height={680} rx={60} fill="#2B2F3F" stroke={INK} strokeWidth={10} />
      <rect x={340} y={700} width={400} height={480} rx={50} fill="#101420" stroke={INK} strokeWidth={8} />
      <text x={540} y={1000} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={150} fill={t > d - 0.2 ? RED : '#E9EDF5'}>
        {m}
      </text>
      <Flash at={d - 0.2} dur={0.2} color={RED} />
    </Shot>
  );
};

/** Siren başlıyor: kahraman donup kalır. */
export const O07: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.12]} origin={[540, 700]}>
      <Gok top="#1C2236" bot="#5B6480" />
      <City x={-300} y={760} w={W + 600} h={560} night={false} />
      <rect x={-400} y={1310} width={W + 800} height={900} fill="#2A2D38" />
      <Siren x={300} y={520} s={1} />
      <Kahraman x={720} y={1640} s={0.95} ifade="sok" kol="asagi" canta look={[-6, -4]} />
      <Flash at={0.05} dur={0.35} />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#9FB4D9" opacity={ap(t, 0.6, 0.5) * 0.25} style={{ mixBlendMode: 'multiply' }} />
    </Shot>
  );
};

/* ===================== 1938 ===================== */

/** Takvim geri sarılır: 2026 → 1938. */
export const O08: React.FC = () => {
  const t = useT();
  const yil = Math.round(interpolate(t, [0, 1.2], [2026, 1938], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
  return (
    <Shot zoom={[1.1, 1.0]} rot={[2, -2]} tint={t > 1.2 ? SEPIA : undefined}>
      <Sema>
        <Takvim x={540} y={900} s={1.6} gun={10} ay="KASIM" />
        <Rakam x={540} y={1460} text={String(yil)} size={180} color={t > 1.2 ? C.hi : '#fff'} />
      </Sema>
    </Shot>
  );
};

export const O09: React.FC = () => (
  <Eski zoom={[1.15, 1.0]} pan={[[-60, 0], [60, 0]]}>
    <Gok top="#5E5A55" bot="#B9B2A4" />
    <path d="M-400 760 Q100 690 600 740 T1500 720 V900 H-400 Z" fill="#6F6A60" />
    <Dolmabahce x={540} y={1040} s={0.9} />
    <Deniz y={1040} color="#5E6670" />
    <Lbl x={540} y={420} text="DOLMABAHÇE · 1938" size={52} color="#F3EBDD" />
  </Eski>
);

/** Sabah, sarayda bir oda: perde, pencereden soluk ışık. */
export const O10: React.FC = () => (
  <Eski zoom={[1.0, 1.12]} origin={[540, 760]}>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#5A4C3C" />
    <rect x={250} y={260} width={580} height={860} rx={8} fill="#BFB6A4" stroke={INK} strokeWidth={14} />
    <path d="M540 260 V1120 M250 690 H830" stroke={INK} strokeWidth={12} />
    <path d="M190 220 Q250 700 170 1180 L90 1180 Q140 700 100 220 Z" fill="#7A2E2E" stroke={INK} strokeWidth={6} />
    <path d="M890 220 Q830 700 910 1180 L990 1180 Q940 700 980 220 Z" fill="#7A2E2E" stroke={INK} strokeWidth={6} />
    <polygon points="250,1120 830,1120 1150,1900 -80,1900" fill="#FFF3D6" opacity={0.18} />
    <Dust x={250} y={500} w={600} h={1200} n={24} color="#FFF3D6" />
    <rect x={-400} y={1300} width={W + 800} height={800} fill="#3E3228" />
    <Lbl x={540} y={1450} text="10 KASIM 1938 · 09.05" size={52} color="#F3EBDD" />
  </Eski>
);

export const O11: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.08]} bg="#0B0B0E" vignette={0.9}>
      <rect width={W} height={H} fill="#121216" />
      <g opacity={ap(t, 0.2, 0.8)}>
        <Kurdele x={540} y={760} s={1.6} />
      </g>
      <g opacity={ap(t, 0.9, 0.8)}>
        <Lbl x={540} y={1200} text="Mustafa Kemal Atatürk" size={68} color="#F4F5F7" />
        <Lbl x={540} y={1290} text="1881 – 1938" size={44} color="#9AA0AE" />
      </g>
    </Shot>
  );
};

/** Odadaki saat: 09.05'te durur. */
export const O12: React.FC = () => (
  <Eski zoom={[1.0, 1.35]} origin={[540, 920]}>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#5A4C3C" />
    <DuvarSaati x={540} y={920} s={1.15} h={9} m={5} tick={false} antique />
  </Eski>
);

/** Bugün: aynı saat hâlâ 09.05. */
export const O13: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.3, 1.1]} origin={[540, 920]} vignette={0.7}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#3E3428" />
      <DuvarSaati x={540} y={920} s={1.15} h={9} m={5} tick={false} antique />
      <Lbl x={540} y={1480} text="BUGÜN DE 09.05" size={64} color="#fff" bg={RED} o={pop(t, 0.5)} s={0.8 + 0.2 * pop(t, 0.5)} />
    </Shot>
  );
};

/** Haber yayılıyor: eski radyo. */
export const O14: React.FC = () => {
  const t = useT();
  return (
    <Eski zoom={[1.05, 1.2]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#4E4234" />
      <rect x={-400} y={1250} width={W + 800} height={900} fill="#3A2E24" />
      <g transform="translate(540 1000)">
        <path d="M-330 240 V-80 Q-330 -300 0 -300 Q330 -300 330 -80 V240 Z" fill="#7A5232" stroke={INK} strokeWidth={10} />
        <path d="M-260 200 V-60 Q-260 -230 0 -230 Q260 -230 260 -60 V200 Z" fill="#C9B38A" stroke={INK} strokeWidth={8} />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${-220 + i * 55} -150 V180`} stroke="#8C7756" strokeWidth={8} />
        ))}
        <circle cx={-140} cy={200} r={26} fill="#3A2A1C" />
        <circle cx={140} cy={200} r={26} fill="#3A2A1C" />
      </g>
      {[0, 1, 2].map((i) => {
        const k = (t * 0.8 + i / 3) % 1;
        const r = 380 + k * 400;
        return <circle key={i} cx={540} cy={900} r={r} fill="none" stroke="#F3EBDD" strokeWidth={6} opacity={(1 - k) * 0.4} />;
      })}
    </Eski>
  );
};

/** İnsanlar sokaklarda ağlıyor: kepenkler kapalı, başlar eğik. */
export const O15: React.FC = () => (
  <Eski zoom={[1.12, 1.0]} pan={[[40, 0], [-40, 0]]}>
    <Gok top="#5E5A55" bot="#A9A294" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${-60 + i * 300} 520)`}>
        <rect x={0} y={0} width={280} height={760} fill="#8A8073" stroke={INK} strokeWidth={6} />
        <rect x={30} y={420} width={220} height={340} fill="#5E574D" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 8 }, (_, j) => (
          <path key={j} d={`M30 ${450 + j * 40} H250`} stroke="#3E3830" strokeWidth={4} />
        ))}
        <rect x={40} y={80} width={80} height={110} fill="#4A443B" />
        <rect x={160} y={80} width={80} height={110} fill="#4A443B" />
      </g>
    ))}
    <rect x={-400} y={1280} width={W + 800} height={900} fill="#4A443B" />
    {[150, 330, 520, 720, 900].map((x, i) => (
      <Figur key={i} x={x} y={1500 + (i % 2) * 40} s={0.7} color={['#4E4A42', '#5A4E5E', '#3E4A52', '#5E4A3E', '#4A4E3E'][i]} hair={i % 2 ? '#2B2B2B' : '#6B5B4A'} ifade="uzgun" />
    ))}
  </Eski>
);

/* ===================== KEŞİF ===================== */

export const O16: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.1]}>
      <DevYuz ifade="merakli" bg="#2A3048" look={[6, -4]} />
      <g opacity={pop(t, 1.0)}>
        <Soru x={880} y={520} s={1.3} />
      </g>
    </Shot>
  );
};

/** Defterin, yazdığın harfler. */
export const O17: React.FC = () => {
  const t = useT();
  const yaz = useAt('Yazdığın');
  const harf = 'A B C Ç D E F G Ğ H';
  const n = Math.floor(interpolate(t, [yaz, yaz + 1.6], [0, harf.length], clamp));
  return (
    <Shot zoom={[1.0, 1.15]} origin={[540, 760]}>
      <Defter>
        <text x={290} y={620} fontFamily={fontFamily} fontWeight={800} fontSize={88} fill="#1E2A4A">
          {harf.slice(0, Math.min(n, 9))}
        </text>
        <text x={290} y={760} fontFamily={fontFamily} fontWeight={800} fontSize={88} fill="#1E2A4A">
          {n > 10 ? harf.slice(10, n) : ''}
        </text>
        <g transform={`translate(${300 + (n % 10) * 60} ${n > 10 ? 740 : 600}) rotate(30)`}>
          <rect x={-14} y={0} width={28} height={300} rx={8} fill="#F2C94C" stroke={INK} strokeWidth={6} />
          <path d="M-14 0 L0 -40 L14 0 Z" fill="#E9D3A8" stroke={INK} strokeWidth={5} />
        </g>
      </Defter>
    </Shot>
  );
};

/** 1927: on kişiden biri. */
export const O18: React.FC = () => {
  const t = useT();
  const biri = useAt('biri');
  return (
    <Shot zoom={[1.0, 1.1]}>
      <Sema>
        <Rakam x={540} y={520} text="1927" size={150} color={C.hi} />
        {Array.from({ length: 10 }, (_, i) => {
          const x = 140 + (i % 5) * 200;
          const y = 980 + Math.floor(i / 5) * 340;
          const lit = i === 0 && t > biri - 0.1;
          return (
            <g key={i} opacity={pop(t, 0.2 + i * 0.08)}>
              <circle cx={x} cy={y - 150} r={44} fill={lit ? C.hi : '#2C3E6E'} stroke={C.line} strokeWidth={6} />
              <path d={`M${x - 70} ${y} Q${x - 70} ${y - 100} ${x} ${y - 100} Q${x + 70} ${y - 100} ${x + 70} ${y} Z`} fill={lit ? C.hi : '#2C3E6E'} stroke={C.line} strokeWidth={6} />
            </g>
          );
        })}
        <g opacity={ap(t, biri)}>
          <Lbl x={540} y={1530} text="okuma yazma bilen: %10" size={56} color="#fff" />
        </g>
      </Sema>
    </Shot>
  );
};

/** 1928: yeni harfler tahtaya. */
export const O19: React.FC = () => {
  const t = useT();
  const harfler = 'ABCÇDEFGĞH';
  return (
    <Eski zoom={[1.0, 1.1]} origin={[540, 690]}>
      <Tahta>
        {harfler.split('').map((h, i) => {
          const k = pop(t, 0.3 + i * 0.12);
          return (
            <text key={i} x={170 + (i % 5) * 185} y={600 + Math.floor(i / 5) * 230} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={150 * k} fill="#F3F3EC" opacity={0.9}>
              {h}
            </text>
          );
        })}
      </Tahta>
      <Lbl x={540} y={1300} text="1928 · YENİ HARFLER" size={56} color="#F3EBDD" />
    </Eski>
  );
};

/** Millet Mektebi: genç yaşlı herkes sırada. */
export const O20: React.FC = () => (
  <Eski zoom={[1.15, 1.02]} pan={[[0, -60], [0, 20]]}>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#6A5A48" />
    <rect x={-400} y={1100} width={W + 800} height={1000} fill="#4E4034" />
    <rect x={160} y={300} width={760} height={360} fill="#2E3B33" stroke="#6B4A2E" strokeWidth={22} />
    <text x={540} y={510} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={90} fill="#F3F3EC" opacity={0.85}>
      A B C
    </text>
    <Sira x={250} y={1250} s={0.85} color="#5E4A3E" hair="#D6D6D6" />
    <Sira x={540} y={1250} s={0.85} color="#3E4A52" hair="#2B2B2B" />
    <Sira x={830} y={1250} s={0.85} color="#5A4E5E" hair="#6B5B4A" />
    <Sira x={250} y={1650} s={0.95} color="#4A4E3E" hair="#4A2E22" />
    <Sira x={540} y={1650} s={0.95} color="#6B4A4A" hair="#C9C9C9" />
    <Sira x={830} y={1650} s={0.95} color="#4E4A42" hair="#2B2B2B" />
  </Eski>
);

/** Tahtanın başında Başöğretmen (gerçek kişi çizilmez: tebeşirli el ve yazı). */
export const O21: React.FC = () => {
  const t = useT();
  const k = interpolate(t, [0.2, 1.6], [0, 1], clamp);
  return (
    <Eski zoom={[1.0, 1.18]} origin={[540, 690]}>
      <Tahta>
        <text x={540} y={720} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={120} fill="#F3F3EC" opacity={0.92} style={{ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
          Başöğretmen
        </text>
        <g transform={`translate(${200 + k * 700} ${760})`}>
          <path d="M0 0 L120 260 L230 260 L60 -30 Z" fill="#2A2622" stroke={INK} strokeWidth={6} />
          <circle cx={0} cy={0} r={34} fill={C.skin} stroke={INK} strokeWidth={6} />
          <rect x={-10} y={-50} width={20} height={40} rx={4} fill="#fff" stroke={INK} strokeWidth={4} />
        </g>
      </Tahta>
      <Lbl x={540} y={1300} text="MİLLET MEKTEPLERİ" size={52} color="#F3EBDD" />
    </Eski>
  );
};

/** Kız çocukları okula gidiyor: sıcak ışık. */
export const O22: React.FC = () => {
  const t = useT();
  return (
    <Eski zoom={[1.0, 1.08]} pan={[[0, 0], [-30, 0]]}>
      <Gok top="#8A8476" bot="#E2D6BC" />
      <rect x={560} y={540} width={480} height={740} fill="#B5A58A" stroke={INK} strokeWidth={8} />
      <path d="M530 560 L800 380 L1070 560 Z" fill="#8C7A60" stroke={INK} strokeWidth={8} />
      <rect x={720} y={980} width={160} height={300} fill="#5A4632" stroke={INK} strokeWidth={6} />
      <text x={800} y={660} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={48} fill={INK}>
        OKUL
      </text>
      <rect x={-400} y={1280} width={W + 800} height={900} fill="#7A6A52" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${120 + i * 170 + t * 70} ${1520 + (i % 2) * 30 - Math.abs(Math.sin(t * 6 + i)) * 10})`}>
          <Figur x={0} y={0} s={0.55 + (i % 2) * 0.06} color={['#7A2E3E', '#2E4A7A', '#5A3E6E'][i]} hair={['#3A2418', '#1E1A16', '#6B4A2E'][i]} />
          <rect x={-70} y={-200} width={36} height={70} rx={8} fill="#8B5E3C" stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </Eski>
  );
};

/** 1934: seçme ve seçilme hakkı. */
export const O23: React.FC = () => {
  const t = useT();
  const dus = interpolate(t, [0.3, 1.0], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <Eski zoom={[1.0, 1.15]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#5E5040" />
      <g transform="translate(540 1120)">
        <rect x={-260} y={-160} width={520} height={420} rx={20} fill="#D8CBB0" stroke={INK} strokeWidth={10} />
        <rect x={-120} y={-170} width={240} height={26} rx={8} fill={INK} />
        <text x={0} y={120} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={64} fill={INK}>
          SANDIK
        </text>
      </g>
      <g transform={`translate(540 ${560 + dus * 400})`} opacity={dus < 1 ? 1 : 0}>
        <rect x={-110} y={-70} width={220} height={140} rx={8} fill={C.paper} stroke={INK} strokeWidth={6} />
        <path d="M-110 -70 L0 10 L110 -70" fill="none" stroke={INK} strokeWidth={5} />
      </g>
      <g opacity={pop(t, 1.1)}>
        <Rakam x={540} y={560} text="1934" size={170} color="#F3EBDD" />
        <Lbl x={540} y={680} text="seçme ve seçilme hakkı" size={44} color="#F3EBDD" />
      </g>
    </Eski>
  );
};

/** Ve o, yolu gösterdi: karanlıkta bir ışık yolu. */
export const O24: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.2]} origin={[540, 700]} bg="#06070C">
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0A0C14" />
      <polygon points="500,700 580,700 1100,1950 -20,1950" fill={C.warm} opacity={0.12 + ap(t, 0.2, 1.2) * 0.2} />
      <circle cx={540} cy={700} r={40 + ap(t, 0.2, 1.2) * 60} fill={C.warm} opacity={0.9} filter="url(#k-glow)" />
      <circle cx={540} cy={700} r={26} fill="#FFF6DA" />
      <Dust n={30} color={C.warm} />
    </Shot>
  );
};

/** Söz. */
export const O25: React.FC = () => {
  const t = useT();
  const m = useAt('mürşit');
  return (
    <Shot zoom={[1.0, 1.08]} bg="#0A0C14">
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0E1018" />
      <circle cx={540} cy={860} r={520} fill={C.warm} opacity={0.12} filter="url(#k-glow)" />
      <text x={130} y={640} fontFamily={fontFamily} fontWeight={800} fontSize={220} fill={RED} opacity={ap(t, 0.1)}>
        “
      </text>
      <g opacity={ap(t, 0.15, 0.5)}>
        <Lbl x={540} y={860} text="Hayatta en hakiki" size={84} color="#F4F5F7" />
      </g>
      <g opacity={ap(t, m - 0.1, 0.4)}>
        <Lbl x={540} y={1000} text="mürşit ilimdir." size={104} color={C.hi} />
      </g>
      <g opacity={ap(t, m + 1.0, 0.5)}>
        <Lbl x={540} y={1150} text="— Mustafa Kemal Atatürk" size={40} color="#9AA0AE" />
      </g>
    </Shot>
  );
};

/* ===================== BUGÜN: SAYGI DURUŞU ===================== */

export const O26: React.FC = () => (
  <Shot zoom={[1.12, 1.0]} pan={[[0, -40], [0, 0]]} tint="#C4CEE0">
    <Gok top="#1E2740" bot="#7A84A0" />
    <City x={-300} y={640} w={W + 600} h={660} night={false} />
    <rect x={-400} y={1290} width={W + 800} height={900} fill="#2A2D38" />
    <Siren x={160} y={420} s={0.8} />
    <Figur x={420} y={1560} s={0.62} color="#3E4A6E" hair="#2B2B2B" />
    <rect x={455} y={1300} width={48} height={90} rx={8} fill={RED} stroke={INK} strokeWidth={4} />
    <Figur x={640} y={1600} s={0.78} color="#5E6A86" />
    <Figur x={860} y={1580} s={0.74} color="#7A5C6E" hair="#2B2B2B" />
    <Kahraman x={250} y={1640} s={0.72} ifade="normal" kol="asagi" canta />
  </Shot>
);

export const O27: React.FC = () => (
  <Shot zoom={[1.0, 1.2]} origin={[540, 1000]} tint="#C4CEE0">
    <Gok top="#2A3048" bot="#7A84A0" />
    <rect x={-400} y={1500} width={W + 800} height={700} fill="#2A2D38" />
    <Yasli x={540} y={1620} s={1.6} />
  </Shot>
);

/** Kitap, sınav, ders: hepsi o yolun parçası. */
const Ikon: React.FC<{ x: number; y: number; tur: 'kitap' | 'sinav' | 'ders'; o: number }> = ({ x, y, tur, o }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * o})`} opacity={o}>
    <circle r={150} fill="#1E2A4A" stroke={C.line} strokeWidth={8} />
    {tur === 'kitap' && <path d="M-80 -50 Q-40 -70 0 -40 Q40 -70 80 -50 V70 Q40 50 0 80 Q-40 50 -80 70 Z M0 -40 V80" fill="none" stroke="#fff" strokeWidth={9} strokeLinejoin="round" />}
    {tur === 'sinav' && (
      <g>
        <rect x={-60} y={-80} width={120} height={160} rx={10} fill="none" stroke="#fff" strokeWidth={9} />
        <path d="M-34 -36 h68 M-34 0 h68 M-34 36 h40" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      </g>
    )}
    {tur === 'ders' && (
      <g>
        <rect x={-55} y={-95} width={110} height={190} rx={20} fill="none" stroke="#fff" strokeWidth={9} />
        <path d="M-20 -20 L30 0 L-20 20 Z" fill={C.hi} />
      </g>
    )}
  </g>
);

export const O28: React.FC = () => {
  const t = useT();
  const a = useAt('girmek');
  const b = useAt('Hepsi');
  const c = useAt('yolun');
  return (
    <Shot zoom={[1.0, 1.08]}>
      <Sema>
        <path d="M540 1800 C540 1500 300 1350 300 1150 S700 850 700 650 S540 420 540 300" fill="none" stroke={C.hi} strokeWidth={12} strokeDasharray="4 30" strokeLinecap="round" opacity={ap(t, c - 0.3, 1)} />
        <Ikon x={300} y={1150} tur="kitap" o={pop(t, 0.05)} />
        <Ikon x={700} y={760} tur="sinav" o={pop(t, a)} />
        <Ikon x={540} y={400} tur="ders" o={pop(t, b)} />
        <g opacity={ap(t, c)}>
          <Lbl x={540} y={1560} text="hepsi o yolun parçası" size={56} color="#fff" />
        </g>
      </Sema>
    </Shot>
  );
};

/** Siren susuyor, şehir kıpırdıyor; kahraman yürüyor. */
export const O29: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.05, 1.0]} pan={[[0, 0], [-60, 0]]}>
      <Gok top="#3A4A6E" bot="#C9B79A" />
      <City x={-300} y={640} w={W + 600} h={660} night={false} />
      <rect x={-400} y={1290} width={W + 800} height={900} fill="#34384A" />
      <g transform={`translate(${t * 220} 0)`}>
        <Otobus x={-200} y={1640} s={0.7} />
      </g>
      <Siren x={940} y={420} s={0.7} on={false} />
      <Kahraman x={360 + t * 70} y={1720} s={0.85} ifade="normal" kol="asagi" canta bob={-Math.abs(Math.sin(t * 4)) * 8} />
    </Shot>
  );
};

/** Bu sefer koşmuyorsun: güneş doğuyor, kahraman sakin. */
export const O30: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.1, 1.2]} origin={[540, 1100]}>
      <Gok top="#4A6DA8" bot="#F2C48E" />
      <circle cx={760} cy={1180} r={140} fill="#FFE2A6" opacity={0.95} />
      <circle cx={760} cy={1180} r={260} fill="#FFE2A6" opacity={0.3} filter="url(#k-glow)" />
      <City x={-300} y={760} w={W + 600} h={560} night={false} />
      <rect x={-400} y={1310} width={W + 800} height={900} fill="#5A5468" />
      <polygon points="760,1180 1300,1900 200,1900" fill="#FFE7B0" opacity={0.18} />
      <Kahraman x={460 + t * 30} y={1720} s={1.0} ifade="umut" kol="asagi" canta bob={-Math.abs(Math.sin(t * 3.5)) * 6} />
    </Shot>
  );
};

/** Sınıf: defterini açıp yazıyor. */
export const O31: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.15]} origin={[540, 1100]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#3E4660" />
      <rect x={120} y={260} width={840} height={420} rx={14} fill="#2E3B33" stroke="#6B4A2E" strokeWidth={20} />
      <polygon points="-100,200 300,200 700,1900 -100,1900" fill="#FFE7B0" opacity={0.14} />
      <rect x={-400} y={1300} width={W + 800} height={900} fill="#2E3244" />
      <Kahraman x={540} y={1900} s={1.0} ifade="mutlu" kol="tutuyor" canta />
      <rect x={260} y={1650} width={560} height={50} rx={8} fill="#8B5E3C" stroke={INK} strokeWidth={6} />
      <g transform="translate(540 1590)" opacity={ap(t, 0.3)}>
        <path d="M-150 30 L0 0 L150 30 L150 60 L0 30 L-150 60 Z" fill="#F7F3E8" stroke={INK} strokeWidth={6} />
      </g>
    </Shot>
  );
};

/** Öğrenmeye devam: defterde ışıyan satır. */
export const O32: React.FC = () => {
  const t = useT();
  const k = interpolate(t, [0.1, 1.2], [0, 1], clamp);
  return (
    <Shot zoom={[1.0, 1.12]} origin={[540, 800]}>
      <Defter>
        <text x={290} y={700} fontFamily={fontFamily} fontWeight={800} fontSize={76} fill="#1E2A4A" style={{ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
          Öğrenmeye
        </text>
        <text x={290} y={830} fontFamily={fontFamily} fontWeight={800} fontSize={76} fill={RED} style={{ clipPath: `inset(0 ${(1 - Math.max(0, k * 2 - 1)) * 100}% 0 0)` }}>
          devam.
        </text>
      </Defter>
      <rect width={W} height={H} fill="#FFE7B0" opacity={0.08 + ap(t, 1.0, 1.0) * 0.12} />
    </Shot>
  );
};

/* ===================== KAPANIŞ ===================== */

export const O33: React.FC = () => (
  <Shot zoom={[1.15, 1.0]} pan={[[0, 60], [0, 0]]} origin={[540, 1000]}>
    <Gok top="#2A3350" bot="#C9A88A" />
    <circle cx={540} cy={1060} r={420} fill="#FFE2A6" opacity={0.25} filter="url(#k-glow)" />
    <rect x={-400} y={1150} width={W + 800} height={900} fill="#3A3A48" />
    <Anitkabir x={540} y={1150} s={0.9} />
    <rect x={-400} y={1240} width={W + 800} height={900} fill="#2E2E3A" />
  </Shot>
);

export const O34: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.12]} origin={[540, 1000]}>
      <Gok top="#2A3350" bot="#C9A88A" />
      <circle cx={540} cy={1060} r={420} fill="#FFE2A6" opacity={0.25} filter="url(#k-glow)" />
      <rect x={-400} y={1150} width={W + 800} height={900} fill="#3A3A48" />
      <Anitkabir x={540} y={1150} s={0.9} />
      <rect x={-400} y={1240} width={W + 800} height={900} fill="#2E2E3A" />
      {/* yarıya inmiş bayrak */}
      <rect x={146} y={420} width={14} height={830} fill="#2A2F40" />
      <circle cx={153} cy={414} r={12} fill="#2A2F40" />
      <Bayrak x={160} y={760} s={0.55} />
      <g opacity={ap(t, 1.0, 0.8)}>
        <Lbl x={540} y={430} text="88. yıl" size={110} color="#F4F5F7" />
        <Lbl x={540} y={520} text="saygı, sevgi ve özlemle" size={48} color="#E8DCC4" />
      </g>
    </Shot>
  );
};

/** Sessiz kapanış kartı. */
export const O35: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.04]} bg="#0B0B0E" vignette={0.8} grain>
      <rect width={W} height={H} fill="#111115" />
      <g opacity={ap(t, 0.1, 0.6)}>
        <Kurdele x={540} y={720} s={1.3} />
        <Lbl x={540} y={1080} text="Saygıyla anıyoruz" size={76} color="#F4F5F7" />
        <Lbl x={540} y={1170} text="1881 – 1938" size={44} color="#9AA0AE" />
        <text x={540} y={1420} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={54} fill="#F4F5F7">
          ucler<tspan fill={C.brand}>.</tspan>
        </text>
      </g>
    </Shot>
  );
};

