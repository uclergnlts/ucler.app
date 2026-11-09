/**
 * "Dokuzu beş geçe" (10 Kasım anma) çekimleri. Dikey 1080×1920.
 * Kit: ../hikaye/kit.tsx. useAt(i): i. kelimenin bu çekime göre saniyesi.
 * Atatürk çizilmez; varlığı nesnelerle (saat, boş masa, tahta, bayrak) anlatılır.
 */
import React, { createContext, useContext, useMemo } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { fontFamily } from '../fonts';
import { ON_STARTS } from './captions';
import { Beam, C, City, clamp, DevYuz, Dust, Figur, Flash, H, INK, Kahraman, Oda, Rakam, Sema, Shot, Soru, Takvim, useT, W } from '../hikaye/kit';

export const ShotStart = createContext(0);
export const useAt = (i: number) => ON_STARTS[i] - useContext(ShotStart);

const outCubic = Easing.out(Easing.cubic);
const outBack = Easing.out(Easing.back(1.6));
const ap = (t: number, at: number, d = 0.4, e = outCubic) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, at: number) => interpolate(t, [at, at + 0.3], [0, 1], { ...clamp, easing: outBack });

const SEPIA = '#E7C9A1';
const RED = '#E30A17';
const MORNING = '#BFD3F2';

/* ===================== ortak parçalar ===================== */

/** Analog duvar saati. h, m: akrep ve yelkovan; süslü: eski saray saati. */
const Analog: React.FC<{ x: number; y: number; s?: number; h: number; m: number; sec?: number; ornate?: boolean; glow?: boolean }> = ({ x, y, s = 1, h, m, sec, ornate, glow }) => {
  const ha = ((h % 12) + m / 60) * 30;
  const ma = m * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <circle r={300} fill={C.warm} opacity={0.25} filter="url(#k-glow)" />}
      {ornate && <circle r={250} fill="#8A6A2E" stroke={INK} strokeWidth={10} />}
      {ornate && Array.from({ length: 24 }, (_, i) => <circle key={i} cx={Math.sin((i * Math.PI) / 12) * 228} cy={-Math.cos((i * Math.PI) / 12) * 228} r={10} fill="#D9B45A" stroke={INK} strokeWidth={3} />)}
      <circle r={200} fill={ornate ? '#F4EAD2' : '#F7F7F2'} stroke={INK} strokeWidth={12} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-5} y={-188} width={10} height={i % 3 === 0 ? 34 : 18} fill={INK} transform={`rotate(${i * 30})`} />
      ))}
      <path d="M-9 20 L0 -110 L9 20 Z" fill={INK} transform={`rotate(${ha})`} />
      <path d="M-6 24 L0 -168 L6 24 Z" fill={INK} transform={`rotate(${ma})`} />
      {sec !== undefined && <path d="M-2 30 L0 -176 L2 30 Z" fill={RED} transform={`rotate(${sec * 6})`} />}
      <circle r={14} fill={ornate ? '#8A6A2E' : INK} stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** Türk bayrağı (oranlar resmî çizime göre). dalga: rüzgâr. */
const Bayrak: React.FC<{ x: number; y: number; w: number; dalga?: number }> = ({ x, y, w, dalga = 1 }) => {
  const f = useCurrentFrame();
  const k = w / 1200;
  const strips = 24;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id="b-clip">
          <rect width={1200} height={800} />
        </clipPath>
      </defs>
      {Array.from({ length: strips }, (_, i) => {
        const sx = (i / strips) * 1200;
        const amp = (i / strips) * 26 * dalga;
        const dy = Math.sin(f / 7 - i * 0.45) * amp;
        const shade = 0.12 * Math.cos(f / 7 - i * 0.45) * (i / strips) * dalga;
        return (
          <g key={i} transform={`scale(${k}) translate(0 ${dy})`}>
            <svg x={sx} y={0} width={1200 / strips + 1} height={800} viewBox={`${sx} 0 ${1200 / strips + 1} 800`} overflow="hidden">
              <rect width={1200} height={800} fill={RED} />
              <circle cx={425} cy={400} r={200} fill="#fff" />
              <circle cx={475} cy={400} r={160} fill={RED} />
              <polygon fill="#fff" points="583.334,400 764.235,458.779 652.431,304.894 652.431,495.106 764.235,341.221" />
              <rect width={1200} height={800} fill={shade > 0 ? '#fff' : '#000'} opacity={Math.abs(shade)} />
            </svg>
          </g>
        );
      })}
    </g>
  );
};

/** Bayrak direği + bayrak. yarı: yarıya indirilmiş. */
const Direk: React.FC<{ x: number; y: number; h: number; w?: number; yari?: boolean }> = ({ x, y, h, w = 420, yari }) => (
  <g>
    <rect x={x - 9} y={y - h} width={18} height={h} fill="#C9CED8" stroke={INK} strokeWidth={4} />
    <circle cx={x} cy={y - h - 10} r={16} fill="#D9B45A" stroke={INK} strokeWidth={4} />
    <Bayrak x={x + 9} y={y - h + (yari ? h * 0.42 : 10)} w={w} />
  </g>
);

/** Araba. */
const Araba: React.FC<{ x: number; y: number; color: string; flip?: boolean }> = ({ x, y, color, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path d="M-150 -40 L-130 -90 Q-110 -120 -60 -125 L50 -125 Q90 -120 115 -85 L150 -45 L150 0 L-150 0 Z" fill={color} stroke={INK} strokeWidth={6} />
    <path d="M-100 -88 Q-90 -112 -55 -112 L-10 -112 L-10 -85 Z M5 -112 L45 -112 Q75 -108 95 -85 L5 -85 Z" fill="#BFE0FF" stroke={INK} strokeWidth={4} />
    <circle cx={-90} cy={0} r={30} fill="#1B1B22" stroke={INK} strokeWidth={6} />
    <circle cx={90} cy={0} r={30} fill="#1B1B22" stroke={INK} strokeWidth={6} />
    <rect x={128} y={-48} width={20} height={14} rx={4} fill="#FFE7A0" />
  </g>
);

/** Otobüs. */
const Otobus: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-340} y={-330} width={680} height={300} rx={36} fill="#2F7CF6" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-300 + i * 150} y={-300} width={120} height={110} rx={12} fill="#CFE6FF" stroke={INK} strokeWidth={5} />
    ))}
    <rect x={-340} y={-150} width={680} height={22} fill="#1d3557" />
    <circle cx={-220} cy={-30} r={46} fill="#1B1B22" stroke={INK} strokeWidth={7} />
    <circle cx={220} cy={-30} r={46} fill="#1B1B22" stroke={INK} strokeWidth={7} />
  </g>
);

/** Güvercin (kanat açık). */
const Kus: React.FC<{ x: number; y: number; s?: number; flap?: number }> = ({ x, y, s = 1, flap = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={46} ry={22} fill="#9AA3B5" stroke={INK} strokeWidth={5} />
    <circle cx={44} cy={-12} r={16} fill="#8B93A6" stroke={INK} strokeWidth={5} />
    <path d="M58 -12 l16 4 l-16 4 Z" fill="#E0A23A" />
    <path d={`M-10 -10 Q-40 ${-70 + flap * 50} -90 ${-60 + flap * 70}`} fill="none" stroke={INK} strokeWidth={14} />
    <path d={`M-10 -10 Q-40 ${-70 + flap * 50} -90 ${-60 + flap * 70}`} fill="none" stroke="#B9C0CE" strokeWidth={8} />
  </g>
);

/** Sabah caddesi: gökyüzü, şehir, yol, kaldırım. */
const Cadde: React.FC<{ sky?: string }> = ({ sky = MORNING }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={1700} fill={sky} />
    <circle cx={820} cy={300} r={90} fill="#FFF3C4" opacity={0.9} />
    <City x={-300} y={560} w={W + 600} h={700} night={false} />
    <rect x={-400} y={1240} width={W + 800} height={80} fill="#9AA0AE" />
    <rect x={-400} y={1320} width={W + 800} height={900} fill="#3A3D4A" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-300 + i * 280} y={1560} width={160} height={16} fill="#E9E2C8" opacity={0.7} />
    ))}
  </g>
);

/** Sepya 1938 caddesi: alçak binalar, yarıya inmiş bayrak, yaslı insanlar. */
const EskiCadde: React.FC = () => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={1700} fill="#D8C3A0" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={-260 + i * 330} y={520 + (i % 2) * 80} width={300} height={780} fill={i % 2 ? '#B89C74' : '#A88B63'} stroke={INK} strokeWidth={6} />
        {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-220 + i * 330 + c * 130} y={600 + (i % 2) * 80 + r * 200} width={90} height={130} rx={40} fill="#5C4A36" stroke={INK} strokeWidth={4} />))}
        <path d={`M${-270 + i * 330} ${520 + (i % 2) * 80} h320 l-20 -40 h-280 Z`} fill="#7A5E40" stroke={INK} strokeWidth={5} />
      </g>
    ))}
    <rect x={-400} y={1300} width={W + 800} height={900} fill="#8C7658" />
    <Direk x={760} y={1300} h={980} w={300} yari />
  </g>
);

/** Kâğıt yaprağı. */
const Kagit: React.FC<{ x: number; y: number; r: number; s?: number }> = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-90} y={-120} width={180} height={240} rx={6} fill="#FBFAF4" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-66} y={-90 + i * 34} width={i % 2 ? 100 : 132} height={8} rx={4} fill="#9DB4D8" />
    ))}
  </g>
);

/** Dolmabahçe silueti (sade çizim): uzun beyaz cephe, orta kubbeli kütle, deniz. */
const Saray: React.FC<{ dawn?: number }> = ({ dawn = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="o-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E6FA8" />
          <stop offset="0.6" stopColor="#E9B98C" />
          <stop offset="1" stopColor="#F6D7AE" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={W + 800} height={1500} fill="url(#o-dawn)" opacity={dawn} />
      <circle cx={260} cy={760} r={110} fill="#FFE9B8" opacity={0.85} filter="url(#k-glow)" />
      {/* cephe */}
      <g transform="translate(-260 600)">
        <rect x={0} y={200} width={1600} height={300} fill="#EFE7DA" stroke={INK} strokeWidth={6} />
        <rect x={560} y={60} width={480} height={440} fill="#F4EDE2" stroke={INK} strokeWidth={6} />
        <path d="M560 60 Q800 -60 1040 60 Z" fill="#E4D9C6" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={30 + i * 72} y={250} width={40} height={180} rx={20} fill="#9FB2C8" stroke={INK} strokeWidth={3} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={`m${i}`} x={590 + i * 75} y={120} width={44} height={150} rx={22} fill="#AFC0D4" stroke={INK} strokeWidth={3} />
        ))}
        <rect x={0} y={480} width={1600} height={26} fill="#D8CDBA" stroke={INK} strokeWidth={4} />
      </g>
      {/* deniz */}
      <rect x={-400} y={1106} width={W + 800} height={1100} fill="#3F5D86" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={((i * 157 + f * 2) % (W + 300)) - 150} y={1150 + i * 48} width={140 + (i % 3) * 60} height={6} rx={3} fill="#F6D7AE" opacity={0.45} />
      ))}
      <rect x={-400} y={1106} width={W + 800} height={300} fill="#EFE7DA" opacity={0.12} />
    </g>
  );
};

/** Boş çalışma odası: masa, sandalye, pencere (sepya ışık). */
const BosOda: React.FC<{ light?: number }> = ({ light = 1 }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={1700} fill="#6E5A44" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={-300 + i * 170} y={-400} width={6} height={1700} fill="#5B4936" />
    ))}
    {/* pencere */}
    <rect x={560} y={240} width={420} height={700} rx={200} fill="#F3DDB4" stroke={INK} strokeWidth={12} opacity={0.4 + 0.6 * light} />
    <path d="M770 260 V940 M560 600 H980" stroke={INK} strokeWidth={10} />
    <polygon points="560,500 980,500 1180,1700 200,1700" fill="#FFE3B0" opacity={0.25 * light} />
    {/* perde */}
    <path d="M520 220 Q560 600 500 980 L440 980 Q480 600 450 220 Z" fill="#7A2E2E" stroke={INK} strokeWidth={6} />
    {/* zemin, halı */}
    <rect x={-400} y={1300} width={W + 800} height={900} fill="#4A3A2A" />
    <ellipse cx={540} cy={1520} rx={520} ry={120} fill="#7A3B33" stroke={INK} strokeWidth={6} />
    {/* masa */}
    <rect x={120} y={1060} width={620} height={40} fill="#5A3B22" stroke={INK} strokeWidth={6} />
    <rect x={150} y={1100} width={30} height={300} fill="#4A3020" stroke={INK} strokeWidth={5} />
    <rect x={680} y={1100} width={30} height={300} fill="#4A3020" stroke={INK} strokeWidth={5} />
    <rect x={240} y={1020} width={200} height={40} rx={4} fill="#F1E6CF" stroke={INK} strokeWidth={4} />
    <rect x={500} y={990} width={22} height={70} fill="#2B2B33" stroke={INK} strokeWidth={4} />
    {/* boş sandalye */}
    <rect x={320} y={1150} width={240} height={30} fill="#6B4528" stroke={INK} strokeWidth={6} />
    <rect x={330} y={900} width={30} height={500} fill="#5A3B22" stroke={INK} strokeWidth={5} />
    <rect x={520} y={900} width={30} height={500} fill="#5A3B22" stroke={INK} strokeWidth={5} />
    <rect x={330} y={900} width={220} height={150} rx={20} fill="#7A2E2E" stroke={INK} strokeWidth={6} />
  </g>
);

/** Eski radyo + yayılan dalgalar. */
const Radyo: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const k = ((t * 0.7 + i * 0.25) % 1);
      return <circle key={i} cx={540} cy={900} r={260 + k * 700} fill="none" stroke="#F3DDB4" strokeWidth={10} opacity={0.5 * (1 - k)} />;
    })}
    <rect x={260} y={700} width={560} height={420} rx={70} fill="#7A4A26" stroke={INK} strokeWidth={10} />
    <rect x={300} y={740} width={300} height={340} rx={40} fill="#C9A87A" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 7 }, (_, i) => (
      <rect key={i} x={320} y={770 + i * 44} width={260} height={10} rx={5} fill="#8A6A44" />
    ))}
    <circle cx={700} cy={820} r={46} fill="#D9B45A" stroke={INK} strokeWidth={6} />
    <circle cx={700} cy={980} r={46} fill="#D9B45A" stroke={INK} strokeWidth={6} />
  </g>
);

/** Açık defter; harfler sırayla belirir. */
const Defter: React.FC<{ t: number; harf?: string; glow?: number }> = ({ t, harf = 'A B C Ç D E F G Ğ H I İ', glow = 0 }) => {
  const hs = harf.split(' ');
  return (
    <g>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#2B3446" />
      <path d="M80 520 L530 560 L530 1500 L80 1460 Z" fill="#FBFAF4" stroke={INK} strokeWidth={8} />
      <path d="M1000 520 L550 560 L550 1500 L1000 1460 Z" fill="#F6F3E8" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M110 ${640 + i * 70} L510 ${676 + i * 70} M570 ${676 + i * 70} L970 ${640 + i * 70}`} stroke="#B8C9E6" strokeWidth={3} />
      ))}
      {hs.map((h, i) => {
        const o = ap(t, 0.15 + i * 0.12, 0.25);
        const left = i < 6;
        const x = left ? 150 + (i % 3) * 120 : 610 + (i % 3) * 120;
        const y = (left ? 760 : 760) + Math.floor((i % 6) / 3) * 230;
        return (
          <text key={i} x={x} y={y} fontFamily={fontFamily} fontWeight={800} fontSize={150} fill="#1d3557" opacity={o} style={{ filter: glow ? 'drop-shadow(0 0 18px #FFD54A)' : undefined }}>
            {h}
          </text>
        );
      })}
      <g transform={`translate(${760 + Math.sin(t * 6) * 30} ${1180}) rotate(30)`}>
        <rect x={-14} y={-260} width={28} height={300} rx={8} fill="#F2C21A" stroke={INK} strokeWidth={5} />
        <path d="M-14 40 L0 80 L14 40 Z" fill="#E9D7B0" stroke={INK} strokeWidth={4} />
      </g>
    </g>
  );
};

/** Sınıf: kara tahta, sıralar. */
const Sinif: React.FC<{ old?: boolean; children?: React.ReactNode; yazi?: string; tYazi?: number }> = ({ old = true, children, yazi = 'A B C', tYazi = 1 }) => (
  <g>
    <rect x={-400} y={-400} width={W + 800} height={1800} fill={old ? '#B8A07A' : '#DDE5EF'} />
    <rect x={60} y={300} width={960} height={560} rx={16} fill="#2F4A3A" stroke="#6B4A2E" strokeWidth={22} />
    <text x={540} y={660} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={200} fill="#F4F1E6" opacity={0.92} letterSpacing="0.08em">
      {yazi.slice(0, Math.max(0, Math.round(yazi.length * tYazi)))}
    </text>
    <rect x={-400} y={1300} width={W + 800} height={900} fill={old ? '#6E5636' : '#B7C2D2'} />
    {children}
  </g>
);

/** Sıra (masa) önden. */
const Sira: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-20} width={340} height={40} fill="#7A4A26" stroke={INK} strokeWidth={6} />
    <rect x={-160} y={20} width={320} height={150} fill="#6A3E1E" stroke={INK} strokeWidth={6} />
  </g>
);

/** Kahramanın yarım boyu (masa arkası). */
const OturanKahraman: React.FC<{ x: number; y: number; s?: number; ifade?: React.ComponentProps<typeof Kahraman>['ifade'] }> = ({ x, y, s = 1, ifade = 'umut' }) => (
  <g>
    <defs>
      <clipPath id="o-ust">
        <rect x={-2000} y={-3000} width={4000} height={3000 + y - 10} />
      </clipPath>
    </defs>
    <g clipPath="url(#o-ust)">
      <Kahraman x={x} y={y + 220 * s} s={s} ifade={ifade} kol="tutuyor" />
    </g>
  </g>
);

/** Logo: "ucler." */
const Logo: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({ x, y, size = 120, color = '#fff' }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={color} letterSpacing="-0.03em">
    ucler<tspan fill="#d63c63">.</tspan>
  </text>
);

/* ===================== 1. SOĞUK AÇILIŞ (2026) ===================== */

export const A1: React.FC = () => {
  const t = useT();
  const sec = Math.floor(t * 1) % 60;
  return (
    <Shot zoom={[1.5, 1.15]} origin={[540, 900]} bg="#20304A">
      <Cadde />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0B1530" opacity={0.25} />
      <rect x={430} y={420} width={220} height={640} fill="#4A5266" stroke={INK} strokeWidth={6} />
      <Analog x={540} y={520} s={0.9} h={9} m={5} sec={50 + sec} glow />
      <Dust n={20} color="#fff" />
    </Shot>
  );
};

/** Donma karesi: her şey 09.05'te durmuş. */
export const A2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.12]} pan={[[-40, 0], [40, -30]]} tint="#B9D2FF">
      <Cadde />
      <Araba x={180} y={1460} color="#D93036" />
      <Araba x={760} y={1700} color="#F2C94C" flip />
      <Figur x={300} y={1300} s={0.62} color="#3E6E9E" />
      <Figur x={860} y={1290} s={0.58} color="#8E5A9E" hair="#2E2420" />
      <Kahraman x={560} y={1330} s={0.7} ifade="sok" kol="yukari" />
      <Kus x={700} y={500} s={1.6} flap={0.3} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 211) % W} cy={(i * 347) % 1500} r={4} fill="#fff" opacity={0.7} />
      ))}
      <Flash at={0} dur={0.35} />
      <rect width={W} height={H} fill="#7FB0FF" opacity={0.12 + 0.05 * Math.sin(t * 3)} />
    </Shot>
  );
};

/* ===================== 2. OLAYLAR ===================== */

/** Geri sar + odada uyanış: telefon 08.52. */
export const B1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.15, 1.25]} origin={[540, 1100]} shake={8} shakeAt={0.35}>
      <Oda night={false} sun />
      <Kahraman x={540} y={1500} s={1.05} ifade="sok" kol="telefon" />
      <g transform={`translate(800 1180) rotate(-8) scale(${0.5 + pop(t, 0.2) * 0.1})`}>
        <rect x={-170} y={-330} width={340} height={660} rx={48} fill="#14121C" stroke={INK} strokeWidth={10} />
        <rect x={-150} y={-300} width={300} height={600} rx={32} fill="#1E2240" />
        <text x={0} y={30} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={120} fill="#FF5A5A">
          08:52
        </text>
      </g>
      <Flash at={0} dur={0.4} color="#9CC2FF" />
    </Shot>
  );
};

/** Otobüs kaçıyor. */
export const C1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.05, 1.15]} pan={[[0, 0], [-80, 0]]}>
      <Cadde />
      <Otobus x={600 + t * 260} y={1500} />
      <Kahraman x={260 + t * 60} y={1560} s={0.85} ifade="sok" kol="yukari" bob={Math.abs(Math.sin(t * 12)) * -20} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={300 - i * 60 + t * 60} cy={1560 - i * 10} r={22 - i * 5} fill="#C9CED8" opacity={0.5} />
      ))}
    </Shot>
  );
};

/** Notlar rüzgârda. */
export const C2: React.FC = () => {
  const t = useT();
  const ps = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ x: 120 + (i * 137) % 860, y: 1500 - (i * 97) % 500, r: (i * 47) % 60 - 30, v: 1 + (i % 3) * 0.6 })), []);
  return (
    <Shot zoom={[1.1, 1.0]} pan={[[0, 60], [0, -60]]} tint="#EAF2FF">
      <Cadde />
      {ps.map((p, i) => (
        <Kagit key={i} x={p.x + t * 220 * p.v} y={p.y - t * 420 * p.v + Math.sin(t * 5 + i) * 40} r={p.r + t * 120 * (i % 2 ? 1 : -1)} s={0.9} />
      ))}
    </Shot>
  );
};

/** Koşu, geniş plan. */
export const D1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.06]} pan={[[60, 0], [-60, 0]]}>
      <Cadde />
      <Kahraman x={300 + t * 160} y={1600} s={0.95} ifade="zoraki" kol="bel" bob={Math.abs(Math.sin(t * 12)) * -24} />
      <Figur x={880} y={1300} s={0.55} color="#5E7D5A" />
    </Shot>
  );
};

/** Saat kolda: 09.05 olur. */
export const D2: React.FC = () => {
  const t = useT();
  const m = t < 0.6 ? 4 : 5;
  return (
    <Shot zoom={[1.2, 1.45]} origin={[540, 900]} bg="#20304A">
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#2A3A58" />
      <path d="M-200 1400 Q300 1000 1300 1100 L1300 1500 Q300 1400 -200 1700 Z" fill={C.coat} stroke={INK} strokeWidth={10} />
      <rect x={300} y={720} width={480} height={360} rx={70} fill="#1B1B22" stroke={INK} strokeWidth={10} />
      <Analog x={540} y={900} s={0.8} h={9} m={m} sec={(t * 60) % 60} />
    </Shot>
  );
};

/** Siren başlar: herkes durur. */
export const E1: React.FC = () => {
  const t = useT();
  const stop = ap(t, 0.2, 0.8);
  return (
    <Shot zoom={[1.0, 1.08]} pan={[[0, 0], [0, -40]]}>
      <Cadde />
      <Araba x={100 + t * 400 * (1 - stop)} y={1460} color="#D93036" />
      <Araba x={900 - t * 300 * (1 - stop)} y={1700} color="#0F9488" flip />
      <Figur x={260} y={1300} s={0.62} color="#3E6E9E" />
      <Figur x={900} y={1290} s={0.58} color="#8E5A9E" hair="#2E2420" />
      <Kahraman x={560} y={1330} s={0.72} ifade="merakli" />
      {[0, 1, 2].map((i) => {
        const k = (t * 0.8 + i / 3) % 1;
        return <circle key={i} cx={540} cy={300} r={100 + k * 900} fill="none" stroke="#fff" strokeWidth={8} opacity={0.35 * (1 - k)} />;
      })}
    </Shot>
  );
};

export const E2: React.FC = () => (
  <Shot zoom={[1.0, 1.12]} origin={[540, 860]} bg={C.wall}>
    <DevYuz ifade="uzgun" bg="#3B4F72" look={[0, -6]} />
  </Shot>
);

/* ===================== 3. 1938 ===================== */

export const F1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.15, 1.0]} bg="#1A140E" tint={SEPIA}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#2A2018" />
      <Dust n={50} color="#F3DDB4" />
      <g opacity={ap(t, 0.1, 0.6)}>
        <Rakam x={540} y={1060} text="1938" size={320} color="#F3DDB4" />
      </g>
      <Flash at={0} dur={0.5} color="#000" />
    </Shot>
  );
};

export const F2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.1]} rot={[-2, 1]} tint={SEPIA}>
      <BosOda light={0.6} />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#000" opacity={0.35} />
      <g transform={`translate(0 ${(1 - pop(t, 0.05)) * -200})`}>
        <Takvim x={540} y={880} s={1.5} gun={10} ay="KASIM" />
      </g>
    </Shot>
  );
};

export const F3: React.FC = () => (
  <Shot zoom={[1.0, 1.1]} pan={[[80, 0], [-80, 0]]} tint={SEPIA} vignette={0.7}>
    <Saray />
    <Kus x={300} y={420} s={0.5} flap={0.5} />
    <Kus x={420} y={360} s={0.4} flap={0.1} />
  </Shot>
);

/** Saraya yaklaşma, pencere ışığı. */
export const G1: React.FC = () => (
  <Shot zoom={[1.4, 2.0]} origin={[540, 800]} tint={SEPIA}>
    <Saray />
    <rect x={480} y={720} width={60} height={160} rx={30} fill="#FFE3B0" opacity={0.8} filter="url(#k-glow)" />
  </Shot>
);

/** Boş masa ve sandalye. */
export const G2: React.FC = () => (
  <Shot zoom={[1.05, 1.18]} origin={[440, 1150]} tint={SEPIA}>
    <BosOda />
    <Dust x={500} y={300} w={500} h={1200} n={30} color="#FFE3B0" />
  </Shot>
);

/** Perde kıpırdar, ışık söner. */
export const G3: React.FC = () => {
  const t = useT();
  const l = interpolate(t, [0.3, 2.2], [1, 0.25], clamp);
  return (
    <Shot zoom={[1.3, 1.45]} origin={[700, 700]} tint={SEPIA}>
      <BosOda light={l} />
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#000" opacity={0.55 * (1 - l)} />
    </Shot>
  );
};

/** Duran saat: 09.05. Sarkaç yavaşlar ve durur. */
export const H1: React.FC = () => {
  const t = useT();
  const amp = interpolate(t, [0, 1.6], [16, 0], clamp);
  const a = Math.sin(t * 5) * amp;
  return (
    <Shot zoom={[1.0, 1.2]} origin={[540, 760]} tint={SEPIA}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#5B4936" />
      <rect x={300} y={420} width={480} height={1260} rx={40} fill="#6B4528" stroke={INK} strokeWidth={10} />
      <g transform={`translate(540 980) rotate(${a})`}>
        <rect x={-8} y={0} width={16} height={480} fill="#D9B45A" stroke={INK} strokeWidth={3} />
        <circle cy={500} r={60} fill="#D9B45A" stroke={INK} strokeWidth={6} />
      </g>
      <Analog x={540} y={720} s={1.05} h={9} m={5} ornate />
    </Shot>
  );
};

/** Saat aynı kalır, yıllar akar. */
export const H2: React.FC = () => {
  const t = useT();
  const yil = Math.round(interpolate(t, [0.2, 2.6], [1938, 2026], { ...clamp, easing: Easing.in(Easing.quad) }));
  const sep = interpolate(t, [0.2, 2.6], [1, 0], clamp);
  return (
    <Shot zoom={[1.1, 1.0]} origin={[540, 800]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#3A3042" />
      <Analog x={540} y={720} s={1.05} h={9} m={5} ornate />
      <Rakam x={540} y={1380} text={String(yil)} size={220} color="#F3DDB4" />
      <rect width={W} height={H} fill={SEPIA} opacity={0.35 * sep} style={{ mixBlendMode: 'multiply' }} />
    </Shot>
  );
};

export const I1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.05, 1.2]} origin={[540, 900]} tint={SEPIA}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#4A3A2A" />
      <Radyo t={t} />
    </Shot>
  );
};

/** Yaslı sokak, yarıya inmiş bayrak. */
export const I2: React.FC = () => (
  <Shot zoom={[1.0, 1.1]} pan={[[0, 40], [0, -40]]} tint={SEPIA}>
    <EskiCadde />
    <Figur x={180} y={1500} s={0.75} color="#4A4038" ifade="uzgun" />
    <Figur x={420} y={1560} s={0.8} color="#5C4A3A" hair="#1E1A16" ifade="uzgun" />
    <Figur x={640} y={1520} s={0.72} color="#3F3A44" ifade="uzgun" />
    <Figur x={900} y={1580} s={0.78} color="#4E3E30" hair="#2A2018" ifade="uzgun" />
  </Shot>
);

/* ===================== 4. MİRAS ===================== */

/** Bugüne dönüş: siren sürerken kahraman düşünür. */
export const J1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.15, 1.3]} origin={[540, 900]}>
      <Cadde />
      <Kahraman x={540} y={1500} s={1.1} ifade="merakli" look={[6, -4]} />
      <g opacity={pop(t, 0.8)} transform={`translate(0 ${-10 * Math.sin(t * 3)})`}>
        <Soru x={820} y={760} s={1.1} />
      </g>
    </Shot>
  );
};

export const K1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.12]} rot={[2, -1]}>
      <Defter t={t} />
    </Shot>
  );
};

/** Harflerin içine dalış. */
export const K2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.1, 2.6]} origin={[250, 760]}>
      <Defter t={t + 3} glow={1} />
    </Shot>
  );
};

export const L1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.1, 1.0]} tint={SEPIA}>
      <Sema>
        <Rakam x={540} y={1000} text="1927" size={300} color="#F3DDB4" />
      </Sema>
      <Flash at={0} dur={0.3} color="#000" />
      <rect width={W} height={H} fill="#000" opacity={0.3 * (1 - ap(t, 0, 0.6))} />
    </Shot>
  );
};

/** 10 kişiden 1'i. */
export const L2: React.FC = () => {
  const t = useT();
  const lit = ap(t, 1.6, 0.5);
  return (
    <Shot zoom={[1.0, 1.06]}>
      <Sema>
        {Array.from({ length: 10 }, (_, i) => {
          const x = 160 + (i % 5) * 190;
          const y = 900 + Math.floor(i / 5) * 470;
          const o = ap(t, 0.1 + i * 0.1, 0.25);
          const on = i === 7;
          return (
            <g key={i} opacity={o}>
              <circle cx={x} cy={y - 260} r={56} fill={on ? C.hi : '#3A5280'} stroke={INK} strokeWidth={5} opacity={on ? 0.4 + 0.6 * lit : 1} />
              <path d={`M${x - 70} ${y} Q${x - 70} ${y - 190} ${x} ${y - 190} Q${x + 70} ${y - 190} ${x + 70} ${y} Z`} fill={on ? C.hi : '#3A5280'} stroke={INK} strokeWidth={5} opacity={on ? 0.4 + 0.6 * lit : 1} />
              {on && <rect x={x - 40} y={y - 120} width={80} height={56} rx={6} fill="#fff" stroke={INK} strokeWidth={4} opacity={lit} />}
            </g>
          );
        })}
        <g opacity={lit}>
          <Rakam x={540} y={560} text="1/10" size={200} color={C.hi} />
        </g>
      </Sema>
    </Shot>
  );
};

/** 1928: yeni harfler yağar. */
export const M1: React.FC = () => {
  const t = useT();
  const hs = ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];
  return (
    <Shot zoom={[1.0, 1.1]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#2F4A3A" />
      <Rakam x={540} y={520} text="1928" size={220} color="#F4F1E6" />
      {hs.map((h, i) => {
        const at = 0.1 + i * 0.07;
        const y = interpolate(t, [at, at + 0.5], [-200, 760 + Math.floor(i / 6) * 190], { ...clamp, easing: Easing.bounce });
        return (
          <g key={i} transform={`translate(${130 + (i % 6) * 165} ${y})`}>
            <rect x={-70} y={-70} width={140} height={140} rx={16} fill="#F4F1E6" stroke={INK} strokeWidth={6} />
            <text y={44} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={110} fill="#1d3557">
              {h}
            </text>
          </g>
        );
      })}
    </Shot>
  );
};

/** Genç yaşlı herkes sırada. */
export const M2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.1]} pan={[[40, 0], [-40, 0]]} tint={SEPIA}>
      <Sinif tYazi={ap(t, 0, 1)} yazi="A B C">
        <Figur x={230} y={1520} s={0.7} color="#5C4A3A" hair="#D8D8D8" />
        <Figur x={540} y={1500} s={0.6} color="#7A4A3A" hair="#2A1E16" />
        <Figur x={850} y={1520} s={0.72} color="#4E5A3A" hair="#8A8A8A" />
        <Sira x={230} y={1420} s={0.85} />
        <Sira x={540} y={1400} s={0.85} />
        <Sira x={850} y={1420} s={0.85} />
      </Sinif>
    </Shot>
  );
};

/** Kara tahta + tahtaya düşen genel bir gölge (kimse çizilmez). */
export const N1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.05, 1.2]} origin={[540, 600]} tint={SEPIA}>
      <Sinif tYazi={ap(t, 0.1, 1.4)} yazi="A B C Ç">
        <path d="M700 860 Q690 700 740 640 Q720 600 740 560 Q790 520 830 570 Q850 610 820 650 Q880 700 880 860 Z M760 660 L600 520 L615 505 L775 640 Z" fill="#000" opacity={0.28} />
        <Beam x1={1080} y1={0} x2={600} y2={900} w1={100} w2={900} opacity={0.4} />
      </Sinif>
    </Shot>
  );
};

/** Kız çocukları okula. */
export const O1: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.08]} pan={[[0, 0], [-60, 0]]} tint={SEPIA}>
      <rect x={-400} y={-400} width={W + 800} height={1700} fill="#E9D4B0" />
      <g>
        <rect x={420} y={600} width={760} height={700} fill="#C9A87A" stroke={INK} strokeWidth={8} />
        <path d="M400 600 L800 380 L1200 600 Z" fill="#8A5A3A" stroke={INK} strokeWidth={8} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={480 + i * 220} y={700} width={140} height={200} rx={60} fill="#6A5236" stroke={INK} strokeWidth={5} />
        ))}
        <rect x={700} y={1020} width={200} height={280} rx={90} fill="#4A3020" stroke={INK} strokeWidth={6} />
        <Direk x={460} y={600} h={300} w={160} />
      </g>
      <rect x={-400} y={1300} width={W + 800} height={900} fill="#A8916C" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Figur x={120 + i * 170 + t * 120} y={1580 + (i % 2) * 40} s={0.55} color={['#7A2E2E', '#2E4A7A', '#5A2E6E'][i]} hair="#2A1E16" ifade="mutlu" />
          <rect x={60 + i * 170 + t * 120} y={1400 + (i % 2) * 40} width={70} height={90} rx={12} fill="#8A5A3A" stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </Shot>
  );
};

/** Sandık, 1934. */
export const O2: React.FC = () => {
  const t = useT();
  const y = interpolate(t, [0.2, 1.0], [560, 900], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <Shot zoom={[1.0, 1.15]} origin={[540, 1000]} tint={SEPIA}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#6E5A44" />
      <g transform={`translate(540 ${y})`} opacity={interpolate(t, [0.9, 1.05], [1, 0], clamp)}>
        <rect x={-110} y={-70} width={220} height={140} rx={8} fill="#F1E6CF" stroke={INK} strokeWidth={6} />
      </g>
      <path d={`M${330 + 0} 700 Q400 640 470 ${y - 40}`} fill="none" stroke={C.skin} strokeWidth={0} />
      <rect x={260} y={940} width={560} height={480} rx={20} fill="#D8C9A8" stroke={INK} strokeWidth={10} opacity={0.95} />
      <rect x={400} y={920} width={280} height={30} rx={8} fill="#2B2B33" />
      <Rakam x={540} y={1250} text="1934" size={150} color="#7A2E2E" />
    </Shot>
  );
};

/** Gün doğumuna giden yol. */
export const P1: React.FC = () => (
  <Shot zoom={[1.0, 1.25]} origin={[540, 760]}>
    <rect x={-400} y={-400} width={W + 800} height={1300} fill="#F6C98F" />
    <circle cx={540} cy={820} r={170} fill="#FFF1C9" filter="url(#k-glow)" />
    <circle cx={540} cy={820} r={130} fill="#FFF6DD" />
    <rect x={-400} y={880} width={W + 800} height={1400} fill="#7A8C5A" />
    <path d="M500 880 L580 880 L1000 1920 L80 1920 Z" fill="#D9C7A0" stroke={INK} strokeWidth={6} />
    <Beam x1={540} y1={820} x2={540} y2={1920} w1={60} w2={1200} opacity={0.5} />
    <Kahraman x={540} y={1760} s={0.75} ifade="umut" />
  </Shot>
);

/** Açık kitaptan yükselen ışık: söz. */
export const P2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.15]} origin={[540, 900]}>
      <Sema>
        <Beam x1={540} y1={1180} x2={540} y2={-200} w1={500} w2={1400} opacity={0.6 * ap(t, 0.1, 0.8)} />
        <g transform="translate(540 1220)">
          <path d="M-360 -40 L0 0 L0 300 L-360 260 Z" fill="#FBFAF4" stroke={INK} strokeWidth={8} />
          <path d="M360 -40 L0 0 L0 300 L360 260 Z" fill="#F1EDE0" stroke={INK} strokeWidth={8} />
        </g>
        {Array.from({ length: 18 }, (_, i) => {
          const k = (t * 0.4 + i / 18) % 1;
          return <circle key={i} cx={540 + Math.sin(i * 2.3) * 300 * k} cy={1180 - k * 1100} r={6 + (i % 3) * 3} fill={C.hi} opacity={1 - k} />;
        })}
        <g opacity={pop(t, 1.0)}>
          <path d="M540 380 l40 90 l98 10 l-74 66 l22 96 l-86 -50 l-86 50 l22 -96 l-74 -66 l98 -10 Z" fill={C.hi} stroke={INK} strokeWidth={6} />
        </g>
      </Sema>
    </Shot>
  );
};

/* ===================== 5. BUGÜN ===================== */

export const Q1: React.FC = () => (
  <Shot zoom={[1.1, 1.0]} tint="#DCE8FF">
    <Cadde />
    <Araba x={180} y={1460} color="#D93036" />
    <Araba x={820} y={1700} color="#0F9488" flip />
    <Figur x={260} y={1300} s={0.62} color="#3E6E9E" />
    <Figur x={900} y={1290} s={0.58} color="#8E5A9E" hair="#2E2420" />
    <Kahraman x={560} y={1330} s={0.72} ifade="uzgun" />
  </Shot>
);

/** Şapkasını göğsüne bastırmış yaşlı adam. */
export const Q2: React.FC = () => (
  <Shot zoom={[1.15, 1.3]} origin={[540, 900]}>
    <Cadde />
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0B1530" opacity={0.15} />
    <Figur x={540} y={1700} s={1.35} color="#5A4E44" hair="#E6E6E6" ifade="uzgun" />
    <g transform="translate(540 1400)">
      <ellipse cx={0} cy={60} rx={150} ry={34} fill="#2E2A26" stroke={INK} strokeWidth={6} />
      <path d="M-90 60 Q-90 -40 0 -46 Q90 -40 90 60 Z" fill="#3A3530" stroke={INK} strokeWidth={6} />
      <circle cx={-100} cy={40} r={30} fill={C.skin} stroke={INK} strokeWidth={5} />
      <circle cx={100} cy={40} r={30} fill={C.skin} stroke={INK} strokeWidth={5} />
    </g>
  </Shot>
);

export const R1: React.FC = () => (
  <Shot zoom={[1.0, 1.15]} rot={[-2, 2]}>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#2B3446" />
    <g transform="translate(540 960) rotate(-8)">
      <rect x={-300} y={-400} width={600} height={800} rx={20} fill="#2F7CF6" stroke={INK} strokeWidth={10} />
      <rect x={-260} y={-360} width={40} height={720} fill="#1d3557" />
      <circle cx={40} cy={-80} r={110} fill="none" stroke="#fff" strokeWidth={14} />
      <ellipse cx={40} cy={-80} rx={160} ry={50} fill="none" stroke="#fff" strokeWidth={8} transform="rotate(30 40 -80)" />
      <ellipse cx={40} cy={-80} rx={160} ry={50} fill="none" stroke="#fff" strokeWidth={8} transform="rotate(-30 40 -80)" />
      <circle cx={40} cy={-80} r={20} fill={C.hi} />
    </g>
  </Shot>
);

export const R2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.1, 1.25]} origin={[540, 1000]}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#8A6A4A" />
      <g transform="translate(540 1000) rotate(4)">
        <rect x={-340} y={-460} width={680} height={920} rx={10} fill="#FBFAF4" stroke={INK} strokeWidth={8} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <text x={-290} y={-330 + i * 170} fontFamily={fontFamily} fontWeight={800} fontSize={60} fill="#1d3557">
              {i + 1}
            </text>
            {[0, 1, 2, 3].map((j) => (
              <circle key={j} cx={-160 + j * 130} cy={-350 + i * 170} r={30} fill={j === (i * 3) % 4 && t > 0.3 + i * 0.25 ? '#1d3557' : 'none'} stroke="#1d3557" strokeWidth={5} />
            ))}
          </g>
        ))}
      </g>
    </Shot>
  );
};

/** 1928 tahtası → kitap → sınav → sen: tek ışıklı yol. */
export const R3: React.FC = () => {
  const t = useT();
  const pts: [number, number][] = [[260, 520], [800, 820], [300, 1160], [760, 1480]];
  const lens = ap(t, 0.1, 1.8);
  return (
    <Shot zoom={[1.0, 1.08]}>
      <Sema>
        <path d={`M${pts.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke={C.hi} strokeWidth={14} strokeDasharray="2400" strokeDashoffset={2400 * (1 - lens)} strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <g key={i} opacity={ap(t, 0.1 + i * 0.45, 0.3)} transform={`translate(${x} ${y})`}>
            <circle r={120} fill="#1E3A7A" stroke={C.hi} strokeWidth={8} />
            <text y={40} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={i === 0 ? 70 : 100} fill="#fff">
              {['1928', '', '✓', ''][i]}
            </text>
            {i === 1 && <rect x={-50} y={-66} width={100} height={132} rx={10} fill="#2F7CF6" stroke="#fff" strokeWidth={6} />}
            {i === 3 && <circle cy={-10} r={52} fill={C.skin} stroke={INK} strokeWidth={5} />}
            {i === 3 && <path d="M-60 40 Q-70 -30 -40 -60 L40 -60 Q70 -30 60 40 Z" fill="#D9A90F" stroke={INK} strokeWidth={5} opacity={0.9} />}
            {i === 3 && <circle cy={-14} r={46} fill={C.skin} stroke={INK} strokeWidth={5} />}
          </g>
        ))}
      </Sema>
    </Shot>
  );
};

/* ===================== 6. KAPANIŞ ===================== */

/** Siren susar: şehir yeniden hareket eder, güvercin kalkar. */
export const S1: React.FC = () => {
  const t = useT();
  const go = ap(t, 0.2, 0.8);
  return (
    <Shot zoom={[1.0, 1.08]} pan={[[0, 0], [0, -30]]}>
      <Cadde />
      <Araba x={180 + t * 400 * go} y={1460} color="#D93036" />
      <Araba x={820 - t * 320 * go} y={1700} color="#0F9488" flip />
      <Figur x={260 - t * 40 * go} y={1300} s={0.62} color="#3E6E9E" />
      <Figur x={900 + t * 50 * go} y={1290} s={0.58} color="#8E5A9E" hair="#2E2420" />
      <Kahraman x={560} y={1330} s={0.72} ifade="umut" />
      <Kus x={640 + t * 300} y={1180 - t * 500} s={1.0} flap={Math.sin(t * 20) * 0.5 + 0.5} />
    </Shot>
  );
};

/** Kahraman sakin yürür. */
export const S2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.1, 1.18]} pan={[[0, 0], [-60, 0]]} origin={[540, 1100]}>
      <Cadde />
      <Kahraman x={420 + t * 70} y={1650} s={1.05} ifade="umut" bob={Math.abs(Math.sin(t * 5)) * -10} />
    </Shot>
  );
};

/** Amfi: kahraman oturur, defterini açar. */
export const T1: React.FC = () => (
  <Shot zoom={[1.0, 1.15]} origin={[540, 1100]}>
    <Sinif old={false} yazi="E = mc²" tYazi={1}>
      <OturanKahraman x={540} y={1440} s={0.95} ifade="umut" />
      <Sira x={540} y={1440} s={1.3} />
      <Figur x={180} y={1660} s={0.55} color="#4A6E9E" />
      <Figur x={900} y={1660} s={0.55} color="#9E4A6E" hair="#2A1E16" />
    </Sinif>
    <Beam x1={1000} y1={0} x2={540} y2={1500} w1={120} w2={800} opacity={0.35} />
  </Shot>
);

/** Yazmaya devam: yakın plan. */
export const T2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.2, 1.4]} origin={[400, 900]}>
      <Defter t={t + 0.6} harf="a b c ç d e f g ğ h ı i" />
      <rect width={W} height={H} fill="#FFD58A" opacity={0.08} />
    </Shot>
  );
};

/** Bayrak, sabah gökyüzü. */
export const U1: React.FC = () => (
  <Shot zoom={[1.0, 1.12]} origin={[540, 760]} vignette={0.5}>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#9FC0EA" />
    <circle cx={260} cy={1300} r={260} fill="#FFF1C9" opacity={0.6} filter="url(#k-glow)" />
    <Direk x={220} y={1700} h={1450} w={720} yari />
    <Dust n={20} color="#fff" />
  </Shot>
);

/** 10.11.1938 → 88. yıl */
export const U2: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.06]} bg="#0F1A2E" grain>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0F1A2E" />
      <g opacity={ap(t, 0.1, 0.6)}>
        <Rakam x={540} y={760} text="10.11.1938" size={130} color="#F3DDB4" />
      </g>
      <g opacity={ap(t, 0.8, 0.8)}>
        <Rakam x={540} y={1180} text="88" size={360} color="#fff" />
      </g>
      <Dust n={30} color="#F3DDB4" />
    </Shot>
  );
};

/** Bitiş kartı. */
export const U3: React.FC = () => {
  const t = useT();
  return (
    <Shot zoom={[1.0, 1.04]} bg="#0F1A2E" vignette={0.4}>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#0F1A2E" />
      <g opacity={ap(t, 0.1, 0.8)}>
        <Bayrak x={240} y={560} w={600} dalga={0.6} />
      </g>
      <g opacity={ap(t, 1.2, 0.8)}>
        <Logo x={540} y={1260} size={150} />
      </g>
    </Shot>
  );
};
