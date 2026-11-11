/**
 * S-11 "A doctor told doctors to wash their hands" (Ignaz Semmelweis, Viyana 1847). Dikey Short, ~22 sn.
 * Kaynak: Viyana Genel Hastanesi 1. Klinik anne ölümü 1841-46 ort. ~%10, klorlu el yıkama (Mayıs 1847) sonrası 1848'de ~%1,3;
 * 1849'da görevi uzatılmadı; 1865'te akıl hastanesinde enfekte yaradan öldü (Wikipedia "Ignaz Semmelweis").
 * Gerçek kişi çizilmez: rolü Çizgi oynar, diğer doktorlar isimsiz figürlerdir.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, Koni, lerp, makeShort, pop, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const GAZ = '#FFC56B'; // gaz lambası ışığı
const TAS = '#3A3550';
const TAS_D = '#27233A';
const MIKROP = '#8BE04A';

/* ---------------- nesneler ---------------- */

/** Gaz lambası (duvar apliği), titrek alev. */
const GazLamba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const fl = 1 + Math.sin(f / 2.3) * 0.06 + Math.sin(f / 5.1) * 0.05;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={260 * fl} fill={GAZ} opacity={0.22} filter="url(#s-glow)" />
      <path d="M-70 60 h40 v-30" stroke="#1A1728" strokeWidth={12} fill="none" />
      <path d="M-34 30 h68 l-10 -90 h-48 z" fill="#FFE9B8" opacity={0.35} stroke="#1A1728" strokeWidth={7} />
      <path d={`M0 20 q${-16 * fl} -30 0 ${-62 * fl} q${16 * fl} 32 0 62 z`} fill="#FFF1C2" />
      <path d="M-40 -60 l40 -34 l40 34 z" fill="#1A1728" />
    </g>
  );
};

/** Leğen: buhar, köpük, sabun. */
const Legen: React.FC<{ s?: number; sabun?: boolean }> = ({ s = 1, sabun = true }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`scale(${s})`}>
      {[0, 1, 2].map((i) => {
        const k = ((f / 40 + i / 3) % 1);
        return <path key={i} d={`M${-50 + i * 50} ${-40 - k * 150} q20 -30 0 -60 q-20 -30 0 -60`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" opacity={(1 - k) * 0.4} />;
      })}
      <path d="M-150 -30 Q-140 80 0 84 Q140 80 150 -30 Z" fill="#E9EEF5" stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={-30} rx={150} ry={34} fill="#CFE6F5" stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={-28} rx={128} ry={24} fill="#8FC8EA" />
      {[-70, -20, 40, 84].map((x, i) => (
        <circle key={i} cx={x} cy={-36 + (i % 2) * 8} r={16 + (i % 3) * 5} fill="#fff" opacity={0.9} />
      ))}
      <path d="M-150 20 h300" stroke="#3B6FE0" strokeWidth={8} opacity={0.6} />
      {sabun && (
        <g transform="translate(96 -74) rotate(-12)">
          <rect x={-46} y={-26} width={92} height={52} rx={18} fill="#FFE39A" stroke={INK} strokeWidth={7} />
          <path d="M-26 -8 h40" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
        </g>
      )}
    </g>
  );
};

/** 1840'lar doktoru: silindir şapka, koyu redingot, favori. hal: kollar kavuşuk | gül | homurdan */
const Hekim: React.FC<{ x: number; y: number; s?: number; tip?: number; hal?: 'kavusuk' | 'gul' | 'homur' | 'yuru'; kirli?: boolean; faz?: number }> = ({ x, y, s = 1, tip = 0, hal = 'kavusuk', kirli = false, faz = 0 }) => {
  const f = useCurrentFrame() + faz;
  const ten = ['#E8C3A0', '#F2D3B3', '#D9A983'][tip % 3];
  const sac = ['#5A4634', '#B9B2A6', '#2B241E'][tip % 3];
  const palto = ['#2A2438', '#3A2B2B', '#1F2A36'][tip % 3];
  const sars = hal === 'gul' ? Math.sin(f / 1.6) * 7 : 0;
  const adim = hal === 'yuru' ? Math.sin(f / 4) * 22 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#s-rim)">
      <ellipse cx={0} cy={6} rx={120} ry={18} fill="#000" opacity={0.35} />
      <path d={`M-26 -250 L${-30 + adim} 0 M26 -250 L${30 - adim} 0`} stroke="#15131F" strokeWidth={40} strokeLinecap="round" />
      <path d="M-84 -250 Q-100 -470 -40 -500 H40 Q100 -470 84 -250 L70 -120 H-70 Z" fill={palto} stroke={INK} strokeWidth={7} />
      <path d="M-14 -498 L0 -420 L14 -498" fill="#F4F0E6" stroke={INK} strokeWidth={5} />
      <path d="M0 -420 V-130" stroke={INK} strokeWidth={5} />
      {[0, 1, 2].map((i) => <circle key={i} cx={14} cy={-380 + i * 70} r={7} fill="#C9A24A" />)}
      {hal === 'kavusuk' || hal === 'gul' ? (
        <g transform={`translate(0 ${sars * 0.4})`}>
          <path d="M-84 -450 Q-110 -340 -10 -330 M84 -450 Q110 -340 10 -350" stroke={INK} strokeWidth={46} fill="none" strokeLinecap="round" />
          <path d="M-84 -450 Q-110 -340 -10 -330 M84 -450 Q110 -340 10 -350" stroke={palto} strokeWidth={34} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d="M-84 -450 Q-120 -360 -96 -270 M84 -450 Q120 -360 96 -270" stroke={INK} strokeWidth={46} fill="none" strokeLinecap="round" />
          <path d="M-84 -450 Q-120 -360 -96 -270 M84 -450 Q120 -360 96 -270" stroke={palto} strokeWidth={34} fill="none" strokeLinecap="round" />
          <circle cx={-96} cy={-262} r={20} fill={kirli ? '#7A8F4A' : ten} stroke={INK} strokeWidth={5} />
          <circle cx={96} cy={-262} r={20} fill={kirli ? '#7A8F4A' : ten} stroke={INK} strokeWidth={5} />
        </g>
      )}
      <g transform={`translate(0 ${-570 + sars})`}>
        <circle r={66} fill={ten} stroke={INK} strokeWidth={6} />
        <path d="M-64 -4 q-8 50 20 62 M64 -4 q8 50 -20 62" stroke={sac} strokeWidth={18} fill="none" strokeLinecap="round" />
        {hal === 'gul' ? (
          <>
            <path d="M-34 -8 q12 -14 24 0 M10 -8 q12 -14 24 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M-26 20 q26 40 52 0 z" fill="#5A2230" stroke={INK} strokeWidth={5} />
          </>
        ) : (
          <>
            <circle cx={-22} cy={-6} r={6} fill={INK} />
            <circle cx={22} cy={-6} r={6} fill={INK} />
            <path d="M-36 -26 l26 8 M36 -26 l-26 8" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d={hal === 'homur' ? 'M-18 30 q18 -16 36 0' : 'M-16 26 h32'} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          </>
        )}
        {tip % 3 === 1 && <circle cx={22} cy={-6} r={17} fill="#BFE6FF" fillOpacity={0.25} stroke="#C9A24A" strokeWidth={5} />}
        {/* silindir şapka */}
        <rect x={-58} y={-190} width={116} height={130} rx={8} fill="#15131F" stroke={INK} strokeWidth={6} />
        <rect x={-58} y={-92} width={116} height={20} fill="#5A2230" />
        <ellipse cx={0} cy={-60} rx={92} ry={16} fill="#15131F" stroke={INK} strokeWidth={6} />
      </g>
    </g>
  );
};

/** Küçük kötü mikrop: yeşil parıltı, yüzlü. */
const Mikrop: React.FC<{ x: number; y: number; s?: number; faz?: number; o?: number }> = ({ x, y, s = 1, faz = 0, o = 1 }) => {
  const f = useCurrentFrame() + faz;
  return (
    <g transform={`translate(${x + Math.sin(f / 7) * 8} ${y + Math.cos(f / 9) * 8}) scale(${s})`} opacity={o}>
      <circle r={44} fill={MIKROP} opacity={0.35} filter="url(#s-soft)" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 -22 V-36" stroke="#4E9A22" strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 45 + f * 2})`} />
      ))}
      <circle r={24} fill={MIKROP} stroke="#2F6B12" strokeWidth={5} />
      <path d="M-14 -8 l10 5 M14 -8 l-10 5" stroke="#1E3A0C" strokeWidth={5} strokeLinecap="round" />
      <circle cx={-8} cy={2} r={3.5} fill="#1E3A0C" />
      <circle cx={8} cy={2} r={3.5} fill="#1E3A0C" />
      <path d="M-9 13 q9 -8 18 0" stroke="#1E3A0C" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ---------------- mekânlar ---------------- */

/** Gaz lambalı taş hastane koridoru: kemerler, uzakta gece penceresi, damalı zemin. */
const Koridor: React.FC<{ dx?: number }> = ({ dx = 0 }) => (
  <g>
    <defs>
      <linearGradient id="k11-duvar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2540" />
        <stop offset="1" stopColor="#4A3F52" />
      </linearGradient>
      <linearGradient id="k11-gece" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B1430" />
        <stop offset="1" stopColor="#34406E" />
      </linearGradient>
    </defs>
    <rect x={-300} y={-300} width={1700} height={2500} fill="url(#k11-duvar)" />
    {/* taş derzleri */}
    {Array.from({ length: 14 }, (_, r) => (
      <g key={r} opacity={0.35}>
        <path d={`M-300 ${120 + r * 100} H1400`} stroke={TAS_D} strokeWidth={4} />
        {Array.from({ length: 9 }, (_, c) => (
          <path key={c} d={`M${-260 + c * 190 + (r % 2) * 95} ${120 + r * 100} v100`} stroke={TAS_D} strokeWidth={4} />
        ))}
      </g>
    ))}
    {/* uzak kemer ve pencere */}
    <g transform={`translate(${dx * 0.4} 0)`}>
      <path d="M330 1420 V760 Q540 500 750 760 V1420 Z" fill="#1B1830" stroke={TAS_D} strokeWidth={18} />
      <path d="M420 1180 V800 Q540 650 660 800 V1180 Z" fill="url(#k11-gece)" stroke="#15131F" strokeWidth={14} />
      <path d="M540 690 V1180 M420 940 H660" stroke="#15131F" strokeWidth={10} />
      <circle cx={600} cy={800} r={26} fill="#F7F1DC" opacity={0.9} />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={440 + ((i * 53) % 200)} cy={760 + ((i * 97) % 380)} r={3} fill="#fff" opacity={0.7} />)}
      <polygon points="420,1180 660,1180 900,1900 180,1900" fill="#8FA8FF" opacity={0.07} />
    </g>
    {/* yan sütunlar */}
    {[-40, 960].map((x, i) => (
      <g key={i} transform={`translate(${x + dx} 0)`}>
        <rect x={0} y={-300} width={160} height={1740} fill={TAS} stroke={TAS_D} strokeWidth={8} />
        <rect x={-20} y={1360} width={200} height={80} fill={TAS_D} />
        <rect x={-20} y={300} width={200} height={50} fill={TAS_D} />
      </g>
    ))}
    <GazLamba x={250 + dx} y={620} s={1.1} />
    <GazLamba x={860 + dx} y={620} s={1.1} />
    {/* damalı zemin */}
    <rect x={-300} y={1430} width={1700} height={800} fill="#2B2638" />
    {Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 12 }, (_, c) =>
        (r + c) % 2 ? <polygon key={`${r}-${c}`} points={`${-300 + c * 150 - r * 30},${1430 + r * 100} ${-150 + c * 150 - r * 30},${1430 + r * 100} ${-180 + c * 150 - r * 30},${1530 + r * 100} ${-330 + c * 150 - r * 30},${1530 + r * 100}`} fill="#3B3550" opacity={0.8} /> : null,
      ),
    )}
    <rect x={-300} y={1422} width={1700} height={16} fill="#15131F" />
    <Zerre n={30} color={GAZ} y={300} h={1200} o={0.35} />
  </g>
);

/** Karlı gece Viyana'sı: katedral kulesi, çatılar, yanan pencereler, kar. */
const Viyana: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="v11-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070B1E" />
          <stop offset="0.7" stopColor="#2A2F5E" />
          <stop offset="1" stopColor="#6A5878" />
        </linearGradient>
      </defs>
      <rect x={-300} y={-600} width={1700} height={3200} fill="url(#v11-gok)" />
      <circle cx={820} cy={300} r={90} fill="#F7F1DC" />
      <circle cx={820} cy={300} r={220} fill="#F7F1DC" opacity={0.18} filter="url(#s-glow)" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 263) % 1080} cy={((i * 131) % 900) - 200} r={2 + (i % 2)} fill="#fff" opacity={0.4 + 0.4 * Math.sin(f / 9 + i)} />)}
      {/* uzak siluet */}
      <path d="M-300 1300 V1050 h120 v-90 h90 v140 h140 v-200 l50 -70 l50 70 v200 h130 v-120 h110 v80 h160 v-160 h90 v160 h130 v-100 h140 v180 h200 V1300 Z" fill="#1A1E3E" />
      {/* katedral */}
      <g transform="translate(300 0)">
        <path d="M-70 1400 V620 L0 260 L70 620 V1400 Z" fill="#12152C" stroke="#0A0C1C" strokeWidth={8} />
        <path d="M0 260 V200 M-18 220 h36" stroke="#C9A24A" strokeWidth={8} strokeLinecap="round" />
        {[700, 860, 1020].map((y) => <path key={y} d={`M-22 ${y + 90} V${y} q22 -40 44 0 V${y + 90} z`} fill="#FFC56B" opacity={0.85} />)}
        <path d="M70 1400 V900 L330 760 V1400 Z" fill="#161A34" stroke="#0A0C1C" strokeWidth={8} />
        <path d="M70 900 L330 760 L330 800 L70 950 Z" fill="#E8EEF7" opacity={0.9} />
      </g>
      {/* ön çatılar, karlı */}
      {[[-200, 1260, 420], [200, 1330, 360], [540, 1240, 420], [900, 1320, 380]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={900} fill={['#221C34', '#2A2238', '#1E1A30', '#261F36'][i]} />
          <path d={`M${x - 20} ${y} L${x + w / 2} ${y - 150} L${x + w + 20} ${y} Z`} fill="#3A2E44" />
          <path d={`M${x - 20} ${y} L${x + w / 2} ${y - 150} L${x + w + 20} ${y} l-30 0 L${x + w / 2} ${y - 110} L${x + 10} ${y} Z`} fill="#EEF3FA" />
          <rect x={x + w * 0.62} y={y - 170} width={44} height={110} fill="#2A2238" />
          <rect x={x + w * 0.62 - 6} y={y - 182} width={56} height={16} fill="#EEF3FA" />
          {Array.from({ length: 6 }, (_, j) => (
            <rect key={j} x={x + 40 + (j % 3) * (w / 3.4)} y={y + 60 + Math.floor(j / 3) * 150} width={54} height={84} fill={(i + j) % 3 ? '#FFC56B' : '#151226'} opacity={0.9} />
          ))}
        </g>
      ))}
      {/* kar */}
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={((i * 173 + Math.sin(f / 20 + i) * 40) % 1300) - 100} cy={(((i * 97 + f * (3 + (i % 4))) % 2100)) - 100} r={3 + (i % 3)} fill="#fff" opacity={0.75} />
      ))}
    </g>
  );
};

/** Doğum koğuşu: iki sıra yatak, başlarında mum. sonuk: kaç mum söndü (0..n). sicak: aydınlık sürüm. */
const Kogus: React.FC<{ sonukAt?: number; sicak?: boolean }> = ({ sonukAt, sicak = false }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const yatak = (i: number) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sc = 0.55 + row * 0.13;
    const x = col ? 540 + 150 + row * 44 : 540 - 150 - row * 44;
    const y = 900 + row * 185;
    const olu = sonukAt !== undefined && i === 7 && t > sonukAt;
    const fl = 1 + Math.sin(f / 2.1 + i) * 0.1;
    return (
      <g key={i} transform={`translate(${x} ${y}) scale(${col ? sc : -sc} ${sc})`}>
        {!olu && <circle cx={150} cy={-150} r={150} fill={GAZ} opacity={sicak ? 0.3 : 0.2} filter="url(#s-glow)" />}
        <rect x={-150} y={-40} width={300} height={70} rx={10} fill={olu ? '#3A3848' : '#E9E4D6'} stroke={INK} strokeWidth={6} />
        <path d="M-150 -40 V-150 M150 -40 V-110" stroke="#5B3A22" strokeWidth={16} strokeLinecap="round" />
        <path d="M-150 30 v60 M150 30 v60" stroke="#5B3A22" strokeWidth={14} />
        <path d="M-70 -40 Q0 -100 150 -40 Z" fill={olu ? '#4A4860' : sicak ? '#C96A6A' : '#8C5A6A'} stroke={INK} strokeWidth={6} />
        {!olu && <circle cx={-104} cy={-66} r={30} fill="#F2D3B3" stroke={INK} strokeWidth={5} />}
        {!olu && sicak && <ellipse cx={-40} cy={-80} rx={26} ry={18} fill="#FFF4E0" stroke={INK} strokeWidth={4} />}
        {/* mum */}
        <rect x={140} y={-130} width={20} height={60} fill="#F4F0E6" stroke={INK} strokeWidth={4} />
        {!olu ? <path d={`M150 -132 q${-10 * fl} -20 0 ${-44 * fl} q${10 * fl} 22 0 44 z`} fill="#FFE39A" /> : <path d={`M150 -134 q10 -30 -4 -60 q-14 -30 2 -60`} stroke="#B9B9C9" strokeWidth={6} fill="none" opacity={Math.max(0, 1 - (t - (sonukAt ?? 0)) / 1.6)} />}
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id="kg11" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sicak ? '#4A3A48' : '#1E1B30'} />
          <stop offset="1" stopColor={sicak ? '#7A5A4A' : '#35304A'} />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={1700} height={2500} fill="url(#kg11)" />
      {/* tonoz tavan ve arka pencere */}
      <path d="M-300 700 Q540 -100 1380 700" fill="none" stroke={sicak ? '#5A4654' : TAS_D} strokeWidth={60} />
      <path d="M-300 900 Q540 220 1380 900" fill="none" stroke={sicak ? '#5A4654' : TAS_D} strokeWidth={30} opacity={0.6} />
      <path d="M440 880 V560 Q540 440 640 560 V880 Z" fill={sicak ? '#F2C48E' : '#2A2F5E'} stroke="#15131F" strokeWidth={12} />
      <path d="M540 470 V880 M440 700 H640" stroke="#15131F" strokeWidth={8} />
      <polygon points="440,880 640,880 900,1900 180,1900" fill={sicak ? '#FFE7B0' : '#8FA8FF'} opacity={sicak ? 0.2 : 0.07} />
      {/* zemin */}
      <polygon points="-300,1900 1380,1900 760,860 320,860" fill={sicak ? '#6A4E44' : '#27233A'} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${320 + i * 55} 860 L${-300 + i * 210} 1900`} stroke="#000" strokeWidth={3} opacity={0.25} />)}
      {Array.from({ length: 10 }, (_, i) => yatak(i))}
      <Zerre n={30} color={GAZ} y={300} h={1300} o={sicak ? 0.5 : 0.25} />
    </g>
  );
};

const Yazi: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; o?: number; s?: number }> = ({ x, y, text, size = 150, color = '#FFD54A', o = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <text x={0} y={0} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={INK} stroke={INK} strokeWidth={size / 7} strokeLinejoin="round">
      {text}
    </text>
    <text x={0} y={0} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={color}>
      {text}
    </text>
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · A doctor told doctors to wash their hands. (son karede tekrar: loop) */
const S1: React.FC = () => {
  const t = useTt();
  const wash = useAt('wash');
  const isaret = ap(t, wash - 0.2, 0.3);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[480, 1000]} rim={GAZ}>
      <Koridor />
      <Hekim x={760} y={1500} s={0.92} tip={0} />
      <Hekim x={930} y={1540} s={1.0} tip={1} faz={9} />
      <Hekim x={620} y={1470} s={0.84} tip={2} faz={17} />
      <Cizgi x={300} y={1560} s={1.2} onluk goz="acik" agiz="gulus" kas="kalkik" bakis={[1, -0.3]} kolSol={[20, 60]} kolSag={[lerp(50, 80, isaret), lerp(60, 30, isaret)]} elSol={<g transform="translate(90 30)"><Legen s={0.9} /></g>} />
      <circle cx={318 + Math.sin(t * 3) * 6} cy={1060 - t * 14} r={14} fill="#fff" opacity={0.9} />
    </Kadraj>
  );
};

/** 2 · They laughed at him. Dev yüz: kahkaha, monokl fırlar. */
const S2: React.FC = () => {
  const t = useTt();
  const u = Math.min(1, t / 0.9);
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[540, 900]} shakeAt={[0.05]} shake={10} rim={GAZ}>
      <g transform="translate(-540 -700) scale(2)">
        <Koridor dx={-80} />
      </g>
      <Hekim x={540} y={2560} s={2.9} tip={1} hal="gul" />
      <Hekim x={60} y={2300} s={1.9} tip={0} hal="gul" faz={5} />
      <Hekim x={1040} y={2330} s={1.9} tip={2} hal="gul" faz={11} />
      <g transform={`translate(${604 + u * 260} ${890 - Math.sin(u * Math.PI) * 300 + u * 500}) rotate(${u * 540})`}>
        <circle r={50} fill="#BFE6FF" fillOpacity={0.35} stroke="#C9A24A" strokeWidth={12} />
      </g>
    </Kadraj>
  );
};

/** 3 · Vienna, 1847. Karlı gece şehri; kamera aşağı iner. */
const S3: React.FC = () => {
  const t = useTt();
  const yil = useAt('1847.');
  return (
    <Kadraj zoom={[1.0, 1.14]} pan={[[0, 160], [0, -80]]} origin={[540, 1000]} rim="#9FB4FF">
      <Viyana />
      <Yazi x={540} y={1120} text="1847" size={230} o={pop(t, yil - 0.1)} s={0.7 + 0.3 * spring(t, yil - 0.1)} />
    </Kadraj>
  );
};

/** 4 · In his ward, one in ten mothers died. Bir mum söner. */
const S4: React.FC = () => {
  const t = useTt();
  const one = useAt('one');
  const died = useAt('died.');
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[700, 1400]} rim={GAZ}>
      <Kogus sonukAt={died - 0.15} />
      <Cizgi x={170} y={1820} s={0.95} onluk goz="acik" agiz="eksi" kas="uzgun" bakis={[1, 0]} kolSol={[10, 10]} kolSag={[12, 10]} />
      <Yazi x={540} y={640} text="1 / 10" size={190} color={t > died - 0.15 ? '#FF6B6B' : '#FFD54A'} o={pop(t, one - 0.1)} s={0.7 + 0.3 * spring(t, one - 0.1)} />
    </Kadraj>
  );
};

/** 5 · Doctors came straight from autopsies. İki kapı: otopsi (yeşil) → koğuş. */
const S5: React.FC = () => {
  const t = useTt();
  const x = lerp(250, 760, Math.min(1, t / 2.3));
  return (
    <Kadraj zoom={[1.06, 1.0]} pan={[[-40, 0], [40, 0]]} rim={MIKROP}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#2A2540" />
      {Array.from({ length: 12 }, (_, r) => <path key={r} d={`M-300 ${200 + r * 110} H1400`} stroke={TAS_D} strokeWidth={4} opacity={0.4} />)}
      {/* otopsi kapısı */}
      <g transform="translate(250 0)">
        <path d="M-190 1440 V760 Q0 560 190 760 V1440 Z" fill="#0E2A1A" stroke="#15131F" strokeWidth={18} />
        <circle cx={0} cy={1100} r={260} fill={MIKROP} opacity={0.3} filter="url(#s-glow)" />
        <rect x={-120} y={1180} width={240} height={30} fill="#3B5A44" />
        <path d="M-100 1210 v230 M100 1210 v230" stroke="#3B5A44" strokeWidth={16} />
        <path d="M-110 1180 q110 -70 220 0" fill="#C9D2C4" opacity={0.6} />
        <Mikrop x={-60} y={980} s={0.9} />
        <Mikrop x={70} y={900} s={0.7} faz={12} />
      </g>
      {/* koğuş kapısı */}
      <g transform="translate(830 0)">
        <path d="M-190 1440 V760 Q0 560 190 760 V1440 Z" fill="#4A3320" stroke="#15131F" strokeWidth={18} />
        <circle cx={0} cy={1100} r={260} fill={GAZ} opacity={0.35} filter="url(#s-glow)" />
        <rect x={-110} y={1240} width={220} height={50} rx={8} fill="#E9E4D6" stroke={INK} strokeWidth={5} />
        <path d="M-40 1240 Q20 1190 110 1240 Z" fill="#8C5A6A" stroke={INK} strokeWidth={5} />
        <circle cx={-70} cy={1220} r={24} fill="#F2D3B3" stroke={INK} strokeWidth={4} />
      </g>
      <GazLamba x={540} y={560} />
      <rect x={-300} y={1440} width={1700} height={800} fill="#2B2638" />
      <rect x={-300} y={1432} width={1700} height={16} fill="#15131F" />
      {/* yürüyen doktor ve ellerinden süzülen mikroplar */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Mikrop key={i} x={x - 120 - i * 90} y={1250 + Math.sin(i * 2 + t * 3) * 50} s={0.75 - i * 0.1} faz={i * 9} o={Math.max(0, Math.min(1, t * 2 - i * 0.3)) * (1 - i * 0.15)} />
      ))}
      <Hekim x={x} y={1560} s={1.0} tip={2} hal="yuru" kirli />
      <path d={`M${x - 220} 1700 h120 M${x - 190} 1740 l40 -20 l-40 -20`} stroke="#fff" strokeWidth={0} />
    </Kadraj>
  );
};

/** 6 · He made them wash. Leğen kapıda; mikroplar "puf". */
const S6: React.FC = () => {
  const t = useTt();
  const wash = useAt('wash.');
  const dip = ap(t, wash - 0.35, 0.3);
  const puf = ap(t, wash - 0.05, 0.5);
  return (
    <Kadraj zoom={[1.1, 1.22]} origin={[560, 1250]} shakeAt={[Math.max(0, wash - 0.05)]} shake={10} rim={GAZ}>
      <Koridor dx={40} />
      <Cizgi x={250} y={1600} s={1.15} onluk goz="acik" agiz="duz" kas="catik" bakis={[1, 0.4]} kolSol={[10, 10]} kolSag={[95, -10]} />
      <g transform="translate(590 1470)">
        <rect x={-90} y={0} width={180} height={130} fill="#5B3A22" stroke={INK} strokeWidth={7} />
        <g transform="translate(0 -30)"><Legen s={1.0} sabun={false} /></g>
      </g>
      <g transform={`translate(0 ${dip * 60})`}>
        <Hekim x={860} y={1600} s={1.0} tip={0} hal="homur" kirli={puf < 0.2} />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <g key={i} opacity={1 - puf}>
            <Mikrop x={600 + Math.cos(a) * (40 + puf * 260)} y={1380 + Math.sin(a) * (30 + puf * 220) - puf * 80} s={0.7 * (1 - puf * 0.6)} faz={i * 7} />
          </g>
        );
      })}
      <circle cx={600} cy={1390} r={40 + puf * 320} fill="#fff" opacity={(1 - puf) * 0.5 * (puf > 0 ? 1 : 0)} filter="url(#s-soft)" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={520 + i * 40} cy={1400 - ((t * 120 + i * 50) % 260)} r={10 + (i % 3) * 5} fill="#fff" opacity={0.7} />)}
    </Kadraj>
  );
};

/** 7 · Deaths fell to one in a hundred. Bütün mumlar yanar, sıcak ışık. */
const S7: React.FC = () => {
  const t = useTt();
  const one = useAt('one#2');
  const say = Math.round(lerp(10, 100, ap(t, one - 0.2, 0.8)));
  return (
    <Kadraj zoom={[1.14, 1.0]} origin={[540, 1300]} rim="#FFD9A0">
      <Kogus sicak />
      <Cizgi x={170} y={1820} s={0.95} onluk goz="mutlu" agiz="sirit" kolSol={[10, 10]} kolSag={[150, -20]} />
      <Yazi x={540} y={640} text={`1 / ${say}`} size={190} color="#7CF29A" s={0.9 + 0.1 * spring(t, one + 0.55)} />
    </Kadraj>
  );
};

/** 8 · They still pushed him out. Karlı hastane kapısı; itilir, leğen arkasından uçar. */
const S8: React.FC = () => {
  const t = useTt();
  const push = useAt('pushed');
  const u = ap(t, push - 0.1, 0.5);
  const kapi = ap(t, push + 0.45, 0.15);
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1200]} shakeAt={[push + 0.5]} shake={22} rim="#9FB4FF">
      <rect x={-300} y={-300} width={1700} height={2500} fill="#141A38" />
      <rect x={-300} y={-300} width={1700} height={1760} fill="#2E2A44" />
      {Array.from({ length: 12 }, (_, r) => <path key={r} d={`M-300 ${160 + r * 110} H1400`} stroke="#1E1A30" strokeWidth={5} opacity={0.6} />)}
      {/* kapı */}
      <path d="M560 1460 V700 Q780 480 1000 700 V1460 Z" fill="#15131F" />
      <path d="M580 1460 V720 Q780 520 980 720 V1460 Z" fill={GAZ} opacity={(1 - kapi) * 0.85} />
      <path d={`M580 1460 V720 Q780 520 980 720 V1460 Z`} fill="#4A3320" stroke="#2A1B12" strokeWidth={10} opacity={kapi} />
      <circle cx={930} cy={1120} r={16} fill="#C9A24A" opacity={kapi} />
      {/* iten eller */}
      <g opacity={(1 - kapi) * (u > 0 ? 1 : 0)} transform={`translate(${-u * 60} 0)`}>
        <path d="M800 1040 h-170 M800 1140 h-170" stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d="M800 1040 h-170 M800 1140 h-170" stroke="#2A2438" strokeWidth={38} strokeLinecap="round" />
        <circle cx={620} cy={1040} r={26} fill="#E8C3A0" stroke={INK} strokeWidth={5} />
        <circle cx={620} cy={1140} r={26} fill="#E8C3A0" stroke={INK} strokeWidth={5} />
      </g>
      <g transform="translate(780 560)">
        <rect x={-150} y={-50} width={300} height={90} rx={8} fill="#5B3A22" stroke={INK} strokeWidth={7} transform={`rotate(${Math.sin(f / 5) * 6 * kapi})`} />
        <path d="M-50 -6 h100 M0 -30 v48" stroke="#E9E4D6" strokeWidth={14} transform={`rotate(${Math.sin(f / 5) * 6 * kapi})`} />
      </g>
      <GazLamba x={470} y={760} s={0.9} />
      {/* kar zemini */}
      <path d="M-300 1460 Q200 1400 540 1450 T1400 1440 V2200 H-300 Z" fill="#E6ECF7" />
      <path d="M-300 1560 Q300 1500 700 1560 T1400 1540 V2200 H-300 Z" fill="#C9D4EA" />
      {/* uçan leğen */}
      <g transform={`translate(${lerp(700, 250, ap(t, push + 0.2, 0.7))} ${1300 - Math.sin(ap(t, push + 0.2, 0.7) * Math.PI) * 420 + ap(t, push + 0.2, 0.7) * 260}) rotate(${ap(t, push + 0.2, 0.7) * -300})`} opacity={u > 0.6 ? 1 : 0}>
        <Legen s={0.6} sabun={false} />
      </g>
      <Cizgi x={lerp(620, 300, u)} y={1600} s={1.1} onluk goz={u > 0.1 ? 'sok' : 'acik'} agiz={u > 0.1 ? 'o' : 'duz'} kas="kalkik" egim={-u * 22} kolSol={[lerp(10, 110, u), 10]} kolSag={[lerp(10, 70, u), 20]} bacak={u * 26} bakis={[1, 0]} />
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={((i * 173 + Math.sin(f / 18 + i) * 40) % 1300) - 100} cy={((i * 97 + f * (4 + (i % 4))) % 2100) - 100} r={3 + (i % 3)} fill="#fff" opacity={0.8} />
      ))}
    </Kadraj>
  );
};

/** 9 · He died in an asylum. Parmaklıklı pencere, ay ışığı, boş yatak, katlı önlük. */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 800]} rim="#9FB4FF" vignette={0.95}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#12131F" />
      {Array.from({ length: 14 }, (_, r) => <path key={r} d={`M-300 ${100 + r * 110} H1400`} stroke="#0A0B14" strokeWidth={5} opacity={0.7} />)}
      {/* pencere */}
      <rect x={340} y={380} width={400} height={520} rx={10} fill="#1E2A5E" stroke="#0A0B14" strokeWidth={20} />
      <circle cx={600} cy={540} r={70} fill="#F7F1DC" />
      <circle cx={600} cy={540} r={170} fill="#F7F1DC" opacity={0.2} filter="url(#s-glow)" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={390 + i * 100} y={380} width={18} height={520} fill="#0A0B14" />)}
      <polygon points="340,900 740,900 1100,1900 60,1900" fill="#9FB4FF" opacity={0.13} />
      {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${390 + i * 100},900 ${408 + i * 100},900 ${350 + i * 250},1900 ${300 + i * 250},1900`} fill="#000" opacity={0.35} />)}
      {/* yatak */}
      <rect x={-300} y={1500} width={1700} height={700} fill="#1A1B2A" />
      <g transform="translate(540 1440)">
        <rect x={-330} y={-60} width={660} height={110} rx={12} fill="#C9CCDA" stroke={INK} strokeWidth={8} />
        <path d="M-330 -60 V-260 M330 -60 V-200" stroke="#3A3C52" strokeWidth={22} strokeLinecap="round" />
        <path d="M-330 -200 H-250 M-330 -130 H-250" stroke="#3A3C52" strokeWidth={10} />
        <path d="M-330 50 v90 M330 50 v90" stroke="#3A3C52" strokeWidth={18} />
        <rect x={-300} y={-110} width={150} height={60} rx={20} fill="#E9EBF4" stroke={INK} strokeWidth={6} />
        {/* katlanmış önlük */}
        <rect x={40} y={-108} width={200} height={56} rx={8} fill="#EEF2F7" stroke={INK} strokeWidth={6} />
        <path d="M40 -84 h200 M140 -108 v56" stroke="#B9C3D2" strokeWidth={4} />
      </g>
      <Yazi x={540} y={1130} text="1865" size={150} color="#C9D4EA" o={ap(t, 0.25, 0.4)} />
      <Zerre n={24} color="#C9D4EA" y={400} h={1200} o={0.3} />
    </Kadraj>
  );
};

/** 10 · From an infection. Yakın çekim: komodinde kuru bir sabun; kamera içine dalar. */
const S10: React.FC = () => {
  const t = useTt();
  const inf = useAt('infection.');
  return (
    <Kadraj zoom={[1.0, 1.5]} origin={[540, 1060]} rim="#9FB4FF" vignette={0.95}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#12131F" />
      <polygon points="200,-300 700,-300 1200,1900 -100,1900" fill="#9FB4FF" opacity={0.1} />
      <rect x={-300} y={1200} width={1700} height={60} fill="#4A3320" stroke="#2A1B12" strokeWidth={8} />
      <rect x={-300} y={1260} width={1700} height={900} fill="#2E2014" />
      <ellipse cx={540} cy={1190} rx={300} ry={36} fill="#000" opacity={0.4} />
      <g transform="translate(540 1090) rotate(-6)">
        <rect x={-230} y={-100} width={460} height={200} rx={70} fill="#FFE39A" stroke={INK} strokeWidth={12} />
        <rect x={-190} y={-66} width={380} height={132} rx={46} fill="none" stroke="#E9C46A" strokeWidth={8} />
        <path d="M-150 -60 h160" stroke="#fff" strokeWidth={16} strokeLinecap="round" opacity={0.7} />
        <path d="M60 -20 l40 50 l-30 40 M-60 10 l-30 46" stroke="#C99A3A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>
      <circle cx={540} cy={1090} r={340} fill="#FFE39A" opacity={0.1 + ap(t, inf, 0.4) * 0.15} filter="url(#s-glow)" />
      <Mikrop x={880} y={860} s={1.1} o={ap(t, inf - 0.1, 0.25)} />
      <Zerre n={20} color="#C9D4EA" y={400} h={1000} o={0.3} />
    </Kadraj>
  );
};

/* ---------------- video ---------------- */

const short = makeShort({
  kod: 's11',
  words: WORDS,
  voiceLen: 21.86,
  tail: 0.6,
  baslik: ['DOCTORS REFUSED', 'TO WASH HANDS'],
  vurgu: '#7CF29A',
  plan: [
    { w: 'A', C: S1 },
    { w: 'They', C: S2 },
    { w: 'Vienna', C: S3 },
    { w: 'In', C: S4 },
    { w: 'Doctors', C: S5 },
    { w: 'He', C: S6 },
    { w: 'Deaths', C: S7 },
    { w: 'They#2', C: S8 },
    { w: 'He#2', C: S9 },
    { w: 'From', C: S10 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['pop', 'wash', 0.1, 0.12],
    ['glass', 'laughed', 0.5, 0.1],
    ['whoosh', 'Vienna', -0.1, 0.14],
    ['impact', '1847.', 0, 0.12],
    ['tick', 'one', 0, 0.12],
    ['whoosh', 'Doctors', -0.1, 0.1],
    ['pop', 'wash.', 0, 0.18],
    ['ding', 'hundred.', 0, 0.12],
    ['knock', 'out.', 0.05, 0.22],
    ['impact', 'infection.', 0, 0.14],
  ],
  muzik: ['music-dark', 0.06],
});

export const S11 = short.Comp;
export const S11_FRAMES = short.frames;
