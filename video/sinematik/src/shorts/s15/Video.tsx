/**
 * S-15 "Lightning hits your car". Dikey Short, ~21 sn.
 * Kaynak: ABD Ulusal Hava Servisi (NWS): araçta koruyan lastikler değil metal gövdedir (Faraday kafesi etkisi);
 * akım kaportanın dışından akıp yere atlar. Üstü açık / fiberglas araçlar korumaz, içeride metale dokunulmaz.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, T, useAt, useTt } from '../ortak';
import raw from './words.json';
import rawTr from './words-tr.json';

const WORDS = raw as Word[];
const WORDS_TR = rawTr as Word[];
const SARI = '#FFD54A';
const ELK = '#BFE8FF';

/* ---------------- nesneler ---------------- */

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

const rnd = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

/** Zikzak şimşek yolu. */
const yol = (x1: number, y1: number, x2: number, y2: number, seed: number, n = 10, j = 80, u = 1) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const jj = i === 0 || i === n ? 0 : (rnd(seed + i) - 0.5) * 2 * j;
    pts.push([lerp(x1, x2, k) + jj, lerp(y1, y2, k) + (rnd(seed + i + 50) - 0.5) * j * 0.3]);
  }
  const m = Math.max(1, Math.round(u * n));
  return 'M' + pts.slice(0, m + 1).map((p) => `${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' L');
};

const Simsek: React.FC<{ x1: number; y1: number; x2: number; y2: number; seed?: number; w?: number; n?: number; j?: number; u?: number; o?: number; dal?: boolean; renk?: string }> = ({ x1, y1, x2, y2, seed = 1, w = 26, n = 10, j = 80, u = 1, o = 1, dal = true, renk = ELK }) => {
  const d = yol(x1, y1, x2, y2, seed, n, j, u);
  return (
    <g opacity={o}>
      <path d={d} stroke={renk} strokeWidth={w * 3.2} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.35} filter="url(#s-glow)" />
      <path d={d} stroke={renk} strokeWidth={w} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} stroke="#fff" strokeWidth={w * 0.45} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {dal &&
        u > 0.5 &&
        [0.3, 0.55].map((k, i) => {
          const bx = lerp(x1, x2, k);
          const by = lerp(y1, y2, k);
          return <path key={i} d={yol(bx, by, bx + (i ? 260 : -280), by + 260, seed + 9 + i, 5, 46)} stroke={renk} strokeWidth={w * 0.4} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.8} />;
        })}
    </g>
  );
};

/** Fırtına gecesi: bulutlar, tepeler, ağaçlar, ıslak yol, bariyer, yağmur. flas: 0-1 gökyüzü parlaması. */
const Firtina: React.FC<{ flas?: number; yolY?: number }> = ({ flas = 0, yolY = 1340 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="y-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1226" />
          <stop offset="1" stopColor="#2E3760" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#y-gok)" />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#BFD8FF" opacity={flas * 0.38} />
      {/* bulut katmanları */}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={-200 + i * 190 + Math.sin(f / 60 + i) * 20} cy={120 + (i % 3) * 90} rx={260} ry={130} fill={i % 2 ? '#1A2040' : '#232B52'} />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx={-100 + i * 220 - Math.sin(f / 50 + i) * 16} cy={360 + (i % 2) * 50} rx={220} ry={90} fill="#2A3360" opacity={0.9} />
      ))}
      {/* uzak tepeler ve ağaçlar */}
      <path d={`M-500 ${yolY - 160} q260 -200 520 -80 q260 -190 560 -40 q260 -160 600 60 V${yolY} H-500 Z`} fill="#151B33" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = -120 + i * 160 + (i % 2) * 40;
        const h = 150 + ((i * 53) % 90);
        return (
          <g key={i}>
            <rect x={x - 7} y={yolY - 60} width={14} height={60} fill="#0E1226" />
            <path d={`M${x - 60} ${yolY - 50} L${x + Math.sin(f / 9 + i) * 6} ${yolY - 50 - h} L${x + 60} ${yolY - 50} Z`} fill="#10162C" />
          </g>
        );
      })}
      {/* elektrik direkleri */}
      {[60, 620, 1160].map((x) => (
        <g key={x}>
          <path d={`M${x} ${yolY} V${yolY - 460} M${x - 60} ${yolY - 420} h120`} stroke="#0B0E1C" strokeWidth={14} />
        </g>
      ))}
      <path d={`M-200 ${yolY - 380} Q340 ${yolY - 320} 620 ${yolY - 420} Q900 ${yolY - 320} 1300 ${yolY - 400}`} stroke="#0B0E1C" strokeWidth={5} fill="none" />
      {/* yol */}
      <rect x={-500} y={yolY} width={2100} height={1300} fill="#1C2138" />
      <rect x={-500} y={yolY} width={2100} height={1300} fill="#BFD8FF" opacity={flas * 0.12} />
      <rect x={-500} y={yolY - 14} width={2100} height={22} fill="#59628A" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-300 + i * 220} y={yolY + 150} width={120} height={16} fill="#D9DEEE" opacity={0.6} />
      ))}
      {/* bariyer */}
      <path d={`M-500 ${yolY - 70} H1600`} stroke="#8791B5" strokeWidth={22} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-260 + i * 170} y={yolY - 70} width={14} height={66} fill="#59628A" />
      ))}
      {/* su birikintileri */}
      {[200, 820].map((x) => (
        <ellipse key={x} cx={x} cy={yolY + 70} rx={150} ry={18} fill="#6F86C4" opacity={0.35 + flas * 0.4} />
      ))}
    </g>
  );
};

const Yagmur: React.FC<{ n?: number; o?: number }> = ({ n = 46, o = 0.4 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x = ((i * 197 + f * 9) % 1300) - 100;
        const y = ((i * 331 + f * 58) % 2100) - 100;
        return <path key={i} d={`M${x} ${y} l-18 70`} stroke="#BFD8FF" strokeWidth={4} strokeLinecap="round" />;
      })}
    </g>
  );
};

const GOVDE = 'M-390 -96 V-190 q0 -44 44 -52 L-236 -258 L-150 -392 H150 L262 -258 L350 -240 q44 10 44 54 V-96 Z';

/** Araba (yandan, sağa bakar). (x, y) = tekerlek zemini ortası. mod: normal | rontgen. */
const Araba: React.FC<{ x: number; y: number; s?: number; mod?: 'normal' | 'rontgen'; far?: boolean; yuz?: 'sok' | 'mutlu' | 'acik'; parla?: number }> = ({ x, y, s = 1, mod = 'normal', far = true, yuz = 'acik', parla = 0 }) => {
  const r = mod === 'rontgen';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="y-cam">
          <polygon points="18,-362 138,-362 232,-258 18,-258" />
        </clipPath>
      </defs>
      {!r && <ellipse cx={0} cy={4} rx={430} ry={26} fill="#000" opacity={0.4} />}
      {far && !r && <polygon points="394,-200 1100,-300 1100,-20 394,-150" fill="#FFF3C8" opacity={0.22} />}
      <path d={GOVDE} fill={r ? '#0E1A33' : '#D9423A'} stroke={r ? '#5FC8FF' : INK} strokeWidth={r ? 8 : 10} strokeLinejoin="round" />
      {!r && <path d="M-390 -150 H394 V-96 H-390 Z" fill="#A82E2A" />}
      {!r && <path d="M-380 -176 H388" stroke="#F2776E" strokeWidth={8} opacity={0.8} />}
      {parla > 0 && <path d={GOVDE} fill="none" stroke="#DFF3FF" strokeWidth={22} strokeLinejoin="round" opacity={parla} filter="url(#s-glow)" />}
      {/* camlar */}
      <polygon points="-206,-258 -138,-362 -6,-362 -6,-258" fill={r ? '#13254A' : '#27325A'} stroke={r ? '#5FC8FF' : INK} strokeWidth={r ? 5 : 7} />
      <polygon points="18,-362 138,-362 232,-258 18,-258" fill={r ? '#13254A' : '#3A4A80'} stroke={r ? '#5FC8FF' : INK} strokeWidth={r ? 5 : 7} />
      <g clipPath="url(#y-cam)">
        <rect x={-10} y={-300} width={70} height={60} rx={12} fill={r ? '#1B3566' : '#1B2033'} />
        <Cizgi x={96} y={-66} s={0.52} goz={yuz === 'acik' ? 'acik' : yuz} agiz={yuz === 'sok' ? 'o' : yuz === 'mutlu' ? 'sirit' : 'gulus'} kas={yuz === 'sok' ? 'kalkik' : 'duz'} bakis={[1, 0]} golge={false} nefes={false} />
        <path d="M196 -258 l-30 -50" stroke={r ? '#5FC8FF' : INK} strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* kapı çizgileri, kol, ayna, farlar */}
      <path d="M6 -258 V-110 M-212 -258 V-150" stroke={r ? '#5FC8FF' : INK} strokeWidth={r ? 4 : 6} opacity={0.8} />
      <rect x={-60} y={-232} width={52} height={14} rx={7} fill={r ? '#5FC8FF' : '#F4F7FB'} />
      <rect x={236} y={-280} width={34} height={24} rx={8} fill={r ? '#13254A' : '#D9423A'} stroke={r ? '#5FC8FF' : INK} strokeWidth={6} />
      <rect x={360} y={-214} width={34} height={36} rx={10} fill={far ? '#FFF3C8' : '#8E97B0'} stroke={r ? '#5FC8FF' : INK} strokeWidth={6} />
      <rect x={-392} y={-206} width={24} height={36} rx={8} fill="#FF5A3A" stroke={r ? '#5FC8FF' : INK} strokeWidth={6} />
      <path d="M-150 -392 l-24 -70" stroke={r ? '#5FC8FF' : INK} strokeWidth={7} strokeLinecap="round" />
      {/* tekerlekler */}
      {[-236, 236].map((wx) => (
        <g key={wx} transform={`translate(${wx} -74)`}>
          <path d="M-104 -24 a104 104 0 0 1 208 0" fill={r ? '#0A1226' : '#1B1F33'} />
          <circle r={76} fill={r ? '#0E1A33' : '#1B1F33'} stroke={r ? '#5FC8FF' : INK} strokeWidth={r ? 6 : 9} />
          <circle r={38} fill={r ? '#13254A' : '#C9D2E3'} stroke={r ? '#5FC8FF' : INK} strokeWidth={6} />
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0 0 V-32" stroke={r ? '#5FC8FF' : '#7C86A6'} strokeWidth={8} transform={`rotate(${a})`} />
          ))}
        </g>
      ))}
    </g>
  );
};

const Carpi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke={INK} strokeWidth={70} strokeLinecap="round" />
    <path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke="#FF4A3A" strokeWidth={46} strokeLinecap="round" />
  </g>
);

const Onay: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={108} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
    <path d="M-50 4 l36 36 l68 -78" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Araç içi: koltuk, direksiyon, gösterge paneli, radyo, yağmurlu cam, sağda kapı. */
const Ic: React.FC<{ flas?: number; children?: React.ReactNode }> = ({ flas = 0, children }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#141828" />
      {/* ön cam ve dışarısı */}
      <path d="M-60 420 Q540 300 1140 420 V1040 H-60 Z" fill="#2E3760" />
      <path d="M-60 420 Q540 300 1140 420 V1040 H-60 Z" fill="#BFD8FF" opacity={flas * 0.5} />
      <path d="M-60 900 q300 -90 600 -30 q300 -70 600 30 V1040 H-60 Z" fill="#151B33" />
      {Array.from({ length: 26 }, (_, i) => (
        <path key={i} d={`M${((i * 173 + f * 5) % 1200) - 60} ${440 + ((i * 97 + f * 22) % 560)} l-8 44`} stroke="#BFD8FF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      ))}
      {/* silecek */}
      <path d={`M540 1040 L${540 + Math.sin(f / 8) * 380} ${1040 - 420 + Math.abs(Math.sin(f / 8)) * 120}`} stroke="#0B0E1C" strokeWidth={12} strokeLinecap="round" />
      {/* tavan ve direkler */}
      <path d="M-200 -600 H1300 V420 Q540 300 -200 420 Z" fill="#232A45" stroke={INK} strokeWidth={10} />
      <rect x={470} y={330} width={140} height={54} rx={12} fill="#3B4466" stroke={INK} strokeWidth={7} />
      {/* gösterge paneli */}
      <path d="M-200 1040 H1300 V1400 H-200 Z" fill="#2B3354" stroke={INK} strokeWidth={10} />
      <rect x={560} y={1100} width={300} height={150} rx={16} fill="#11131C" stroke={INK} strokeWidth={7} />
      <rect x={580} y={1120} width={260} height={56} rx={8} fill="#1F6B5A" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={592 + i * 27} y={1166 - (12 + Math.abs(Math.sin(f / 4 + i * 1.3)) * 32)} width={16} height={12 + Math.abs(Math.sin(f / 4 + i * 1.3)) * 32} fill="#7CFFB2" />
      ))}
      {[620, 700, 780].map((x) => (
        <circle key={x} cx={x} cy={1214} r={16} fill="#8E97B0" />
      ))}
      {[900, 1000].map((x) => (
        <g key={x}>
          <rect x={x} y={1110} width={80} height={60} rx={8} fill="#11131C" />
          <path d={`M${x + 8} 1126 h64 M${x + 8} 1142 h64 M${x + 8} 1158 h64`} stroke="#3B4466" strokeWidth={6} />
        </g>
      ))}
      {children}
    </g>
  );
};

const Nota: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 0 V-90 l50 -16 V-16" stroke={SARI} strokeWidth={12} fill="none" strokeLinejoin="round" />
    <ellipse cx={-16} cy={2} rx={22} ry={16} fill={SARI} />
    <ellipse cx={34} cy={-14} rx={22} ry={16} fill={SARI} />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Lightning hits your car. Fırtınalı yol, dev şimşek tavana iniyor. (loop karesi) */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const fl = 0.55 + (rnd(Math.floor(f / 2)) > 0.45 ? 0.45 : 0);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1050]} shakeAt={[0]} shake={22}>
      <Firtina flas={fl} />
      <Simsek x1={470} y1={-300} x2={470} y2={946} seed={3 + Math.floor(f / 3) % 3} w={34} n={11} j={110} o={0.75 + fl * 0.25} />
      <circle cx={470} cy={950} r={150 + fl * 60} fill="#fff" opacity={0.6} filter="url(#s-glow)" />
      <Araba x={560} y={1340} yuz="sok" parla={fl} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = -Math.PI * (0.1 + (i / 7) * 0.8);
        const l = 90 + ((i * 41 + f * 17) % 90);
        return <path key={i} d={`M${470 + Math.cos(a) * 40} ${950 + Math.sin(a) * 40} L${470 + Math.cos(a) * l} ${950 + Math.sin(a) * l}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" />;
      })}
      <Yagmur />
    </Kadraj>
  );
};

/** 2 · You are fine. İçeride Çizgi sakin, radyo çalıyor. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const fl = t < 0.3 ? 1 - t / 0.3 : 0;
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[500, 1000]}>
      <Ic flas={fl}>
        {/* koltuk */}
        <rect x={130} y={620} width={330} height={900} rx={70} fill="#55608A" stroke={INK} strokeWidth={10} />
        <rect x={190} y={520} width={210} height={150} rx={40} fill="#55608A" stroke={INK} strokeWidth={10} />
        <Cizgi x={300} y={1640} s={1.5} oturan goz="mutlu" agiz="sirit" bas={Math.sin(f / 5) * 5} kolSag={[84, 40]} kolSol={[40, 30]} golge={false} />
        {/* direksiyon */}
        <g transform="translate(500 1150)">
          <ellipse rx={70} ry={150} fill="none" stroke={INK} strokeWidth={40} />
          <ellipse rx={70} ry={150} fill="none" stroke="#3B4466" strokeWidth={24} />
        </g>
        {[0, 1, 2].map((i) => {
          const k = ((t * 0.9 + i * 0.33) % 1);
          return <Nota key={i} x={700 + i * 60 + Math.sin(k * 6 + i) * 30} y={1080 - k * 360} s={0.9} o={1 - k} />;
        })}
      </Ic>
      <Onay x={820} y={640} s={pop(t, 0.3)} />
    </Kadraj>
  );
};

/** 3 · And no, it is not the rubber tires. Lastik yakın çekim, çarpı. */
const S3: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const no = useAt('not');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]} shakeAt={[no]} shake={12}>
      <Firtina yolY={1420} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#0B0E1C" opacity={0.35} />
      {/* kaporta alt kenarı ve çamurluk */}
      <path d="M-300 420 H1400 V900 H960 a420 420 0 0 0 -840 0 H-300 Z" fill="#D9423A" stroke={INK} strokeWidth={14} />
      <path d="M-300 760 H150 M930 760 H1400" stroke="#A82E2A" strokeWidth={60} />
      {/* dev lastik */}
      <g transform="translate(540 1040)">
        <circle r={380} fill="#1B1F33" stroke={INK} strokeWidth={16} />
        {Array.from({ length: 28 }, (_, i) => (
          <path key={i} d="M0 -380 v46" stroke="#0B0E1C" strokeWidth={22} transform={`rotate(${i * (360 / 28)})`} />
        ))}
        <circle r={300} fill="none" stroke="#2B3050" strokeWidth={10} />
        <circle r={200} fill="#C9D2E3" stroke={INK} strokeWidth={12} />
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 0 V-180" stroke="#7C86A6" strokeWidth={40} />
            <circle cx={0} cy={-70} r={16} fill="#1B1F33" />
          </g>
        ))}
        <circle r={54} fill="#7C86A6" stroke={INK} strokeWidth={10} />
      </g>
      <ellipse cx={540} cy={1436} rx={420} ry={30} fill="#6F86C4" opacity={0.4} />
      <g transform={`translate(540 640) scale(${pop(t, 0.9)}) rotate(${Math.sin(f / 9) * 3})`}>
        <Etiket x={0} y={0} size={150} renk="#fff">
          <T en="RUBBER?" tr="LASTİK Mİ?" />
        </Etiket>
      </g>
      <Carpi x={540} y={1040} s={pop(t, no) * 2.3} />
      <Yagmur n={30} o={0.3} />
    </Kadraj>
  );
};

/** 4 · The bolt just crossed a mile of air. Buluttan yere bir millik şimşek. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const u = ap(t, 0.15, 0.7, (x) => x);
  const mile = useAt('mile');
  return (
    <Kadraj zoom={[1.0, 1.0]} pan={[[0, 260], [0, -60]]} origin={[540, 960]}>
      <Firtina flas={u > 0.95 ? 0.5 + Math.sin(f) * 0.2 : 0.1} yolY={1560} />
      <Simsek x1={420} y1={420} x2={560} y2={lerp(420, 1250, u)} seed={7} w={22} n={14} j={90} />
      <Araba x={580} y={1560} s={0.36} yuz="sok" parla={u > 0.95 ? 0.9 : 0} />
      {/* ölçü çizgisi */}
      <g opacity={ap(t, mile - 0.3, 0.3)}>
        <path d="M880 440 V1540" stroke="#fff" strokeWidth={8} strokeDasharray="24 16" />
        <path d="M852 470 l28 -34 l28 34 M852 1510 l28 34 l28 -34" stroke="#fff" strokeWidth={8} fill="none" />
        <g transform={`translate(850 1000) scale(${pop(t, mile - 0.1)})`}>
          <Etiket x={0} y={0} size={130} anchor="end">
            <T en="1 mile" tr="1,6 km" />
          </Etiket>
        </g>
      </g>
      <Yagmur n={30} o={0.3} />
    </Kadraj>
  );
};

/** 5 · Tires cannot stop it. Minik lastik dev şimşeğe karşı. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const st = useAt('stop');
  const vur = t > st;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1150]} shakeAt={[st]} shake={24}>
      <Firtina flas={vur ? 0.5 + Math.sin(f * 1.3) * 0.3 : 0.08} yolY={1420} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#0B0E1C" opacity={0.3} />
      {vur && <Simsek x1={520} y1={-300} x2={540} y2={1420} seed={11 + (Math.floor(f / 3) % 3)} w={60} n={12} j={120} dal={false} />}
      {!vur && <Simsek x1={520} y1={-300} x2={540} y2={lerp(-200, 940, ap(t, 0, st, (x) => x * x))} seed={11} w={46} n={12} j={120} dal={false} />}
      {/* yüzlü lastik */}
      <g transform={`translate(540 1210) rotate(${vur ? Math.sin(f) * 5 : 0}) scale(1.7)`}>
        <circle r={124} fill={vur ? '#3A2A22' : '#1B1F33'} stroke={INK} strokeWidth={12} />
        <circle r={58} fill={vur ? '#6A5A52' : '#C9D2E3'} stroke={INK} strokeWidth={8} />
        <ellipse cx={-26} cy={-10} rx={13} ry={vur ? 20 : 16} fill="#fff" stroke={INK} strokeWidth={4} />
        <ellipse cx={26} cy={-10} rx={13} ry={vur ? 20 : 16} fill="#fff" stroke={INK} strokeWidth={4} />
        <circle cx={-26} cy={-14} r={5} fill={INK} />
        <circle cx={26} cy={-14} r={5} fill={INK} />
        <ellipse cx={0} cy={26} rx={vur ? 14 : 9} ry={vur ? 16 : 6} fill={INK} />
        {/* minik kollar: dur işareti */}
        <path d={`M-120 -20 l-70 ${vur ? 40 : -70} M120 -20 l70 ${vur ? 40 : -70}`} stroke={INK} strokeWidth={16} strokeLinecap="round" />
      </g>
      {vur &&
        [0, 1, 2].map((i) => <path key={i} d={`M${470 + i * 70} ${1150 - ((f * 6 + i * 40) % 160)} q20 -30 0 -60`} stroke="#8E97B0" strokeWidth={10} fill="none" opacity={0.6} strokeLinecap="round" />)}
      <g transform={`translate(800 860) scale(${pop(t, 0.2)})`} opacity={vur ? 0 : 1}>
        <Etiket x={0} y={0} size={120} renk="#fff"><T en="STOP!" tr="DUR!" /></Etiket>
      </g>
      <Yagmur n={30} o={0.3} />
    </Kadraj>
  );
};

/** 6 · The metal body saves you. Parlayan metal gövde. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sv = useAt('saves');
  return (
    <Kadraj zoom={[1.15, 1.25]} origin={[540, 1150]}>
      <Firtina flas={0.15} />
      <circle cx={560} cy={1130} r={520} fill="#8FD3FF" opacity={0.18 + Math.sin(f / 6) * 0.04} filter="url(#s-glow)" />
      <Araba x={560} y={1340} yuz="mutlu" parla={0.6 + Math.sin(f / 4) * 0.3} />
      {/* parıltılar */}
      {[[-260, -330], [300, -300], [80, -430], [-360, -180]].map(([dx, dy], i) => {
        const k = 0.6 + Math.sin(f / 5 + i * 2) * 0.4;
        return <path key={i} d={`M${560 + dx} ${1340 + dy - 30 * k} v${60 * k} M${560 + dx - 30 * k} ${1340 + dy} h${60 * k}`} stroke="#fff" strokeWidth={9} strokeLinecap="round" />;
      })}
      <g transform={`translate(540 760) scale(${pop(t, 0.25)})`}>
        <Etiket x={0} y={0} size={170}>METAL</Etiket>
      </g>
      <Onay x={860} y={900} s={pop(t, sv) * 0.8} />
      <Yagmur n={30} o={0.3} />
    </Kadraj>
  );
};

/** Dış yüzeyden akan akım: gövde çevresinde ilerleyen parlak çizgi. */
const Akim: React.FC<{ u: number }> = ({ u }) => {
  const f = useCurrentFrame();
  // çatıdaki vuruş noktasından öne ve arkaya iki kol
  const on = 'M-40 -392 H150 L262 -258 L350 -240 q44 10 44 54 V-96 H312';
  const arka = 'M-40 -392 H-150 L-236 -258 L-346 -242 q-44 8 -44 52 V-96 H-312';
  return (
    <g>
      {[on, arka].map((d, i) => (
        <g key={i}>
          <path d={d} pathLength={1} stroke={SARI} strokeWidth={46} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${u} 1`} opacity={0.4} filter="url(#s-glow)" />
          <path d={d} pathLength={1} stroke={SARI} strokeWidth={18} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${u} 1`} />
          <path d={d} pathLength={1} stroke="#fff" strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.04 0.1" strokeDashoffset={-f * 0.03} opacity={u > 0.2 ? 0.9 : 0} style={{ clipPath: 'none' }} strokeOpacity={Math.min(1, u * 1.2)} />
        </g>
      ))}
    </g>
  );
};

/** 7 · The current runs around the outside. Röntgen görünümü. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const u = ap(t, 0.25, 1.6, (x) => x);
  return (
    <Kadraj zoom={[1.1, 1.2]} origin={[540, 1050]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#07122B" />
      {Array.from({ length: 30 }, (_, i) => (
        <path key={i} d={`M-500 ${-200 + i * 90} H1600`} stroke="#12305E" strokeWidth={3} />
      ))}
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${-300 + i * 90} -600 V2600`} stroke="#12305E" strokeWidth={3} />
      ))}
      <path d="M-500 1330 H1600" stroke="#5FC8FF" strokeWidth={6} />
      <Simsek x1={520} y1={-300} x2={520} y2={946} seed={5 + (Math.floor(f / 3) % 3)} w={26} n={10} j={90} dal={false} o={0.9} />
      <Araba x={560} y={1330} mod="rontgen" yuz="mutlu" far={false} />
      <g transform="translate(560 1330)">
        <Akim u={u} />
      </g>
      {/* içerisi güvenli */}
      <ellipse cx={600} cy={1090} rx={230} ry={110} fill="#3FCB6B" opacity={0.16 + Math.sin(f / 6) * 0.05} />
      <g transform={`translate(770 830) scale(${pop(t, 1.2)})`}>
        <Etiket x={0} y={0} size={84} renk="#fff">
          <T en="OUTSIDE" tr="DIŞTAN" />
        </Etiket>
      </g>
      <g transform={`translate(600 1100) scale(${pop(t, 1.7)})`}>
        <Etiket x={0} y={0} size={64} renk="#7CFFB2">0 A</Etiket>
      </g>
    </Kadraj>
  );
};

/** 8 · and jumps to the ground. Akım jant kenarından yere atlar. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const j = useAt('jumps');
  const k = t > j;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1150]} shakeAt={[j]} shake={20}>
      <Firtina yolY={1420} flas={k ? 0.3 + Math.sin(f) * 0.15 : 0.05} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#0B0E1C" opacity={0.3} />
      <path d="M-300 420 H1400 V940 H920 a380 380 0 0 0 -760 0 H-300 Z" fill="#D9423A" stroke={INK} strokeWidth={14} />
      <path d="M-300 420 H1400 V940 H920 a380 380 0 0 0 -760 0 H-300" fill="none" stroke={SARI} strokeWidth={26} opacity={0.75 + Math.sin(f / 2) * 0.25} filter="url(#s-glow)" />
      <g transform="translate(540 1070)">
        <circle r={340} fill="#1B1F33" stroke={INK} strokeWidth={16} />
        <circle r={180} fill="#C9D2E3" stroke={INK} strokeWidth={12} />
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="M0 0 V-160" stroke="#7C86A6" strokeWidth={36} transform={`rotate(${a})`} />
        ))}
        <circle r={50} fill="#7C86A6" stroke={INK} strokeWidth={10} />
      </g>
      {k &&
        [0, 1, 2].map((i) => <Simsek key={i} x1={160 + i * 30} y1={940} x2={90 + i * 70} y2={1420} seed={20 + i + (Math.floor(f / 2) % 4)} w={18} n={6} j={50} dal={false} renk={SARI} />)}
      {k &&
        [0, 1].map((i) => <Simsek key={i} x1={920 - i * 30} y1={940} x2={1000 - i * 60} y2={1420} seed={30 + i + (Math.floor(f / 2) % 4)} w={18} n={6} j={50} dal={false} renk={SARI} />)}
      {k && <ellipse cx={140} cy={1424} rx={190 + Math.sin(f) * 20} ry={34} fill="#FFF3C8" opacity={0.7} filter="url(#s-glow)" />}
      {k && <ellipse cx={960} cy={1424} rx={170 + Math.cos(f) * 20} ry={30} fill="#FFF3C8" opacity={0.7} filter="url(#s-glow)" />}
      <Yagmur n={30} o={0.3} />
    </Kadraj>
  );
};

/** 9 · Just do not touch the door. El kapı koluna uzanır, durur, geri çekilir. */
const S9: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const no = useAt('not#2');
  const uz = ap(t, 0, no - 0.05, (x) => x) - ap(t, no + 0.25, 0.3);
  const dur = t > no;
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[620, 1000]} shakeAt={[no]} shake={10}>
      <Ic flas={0.1 + (dur ? 0.2 : 0)}>
        <rect x={60} y={620} width={330} height={900} rx={70} fill="#55608A" stroke={INK} strokeWidth={10} />
        <rect x={120} y={520} width={210} height={150} rx={40} fill="#55608A" stroke={INK} strokeWidth={10} />
        {/* sağda kapı ve metal kol */}
        <path d="M700 420 H1300 V1700 H700 Z" fill="#2B3354" stroke={INK} strokeWidth={10} />
        <rect x={740} y={470} width={560} height={420} rx={20} fill="#2E3760" stroke={INK} strokeWidth={8} />
        <rect x={740} y={1000} width={170} height={56} rx={26} fill="#C9D2E3" stroke={INK} strokeWidth={9} />
        <rect x={740} y={1000} width={170} height={56} rx={26} fill="none" stroke={SARI} strokeWidth={14} opacity={0.5 + Math.sin(f / 2) * 0.4} filter="url(#s-glow)" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={yol(740 + i * 60, 990, 720 + i * 70, 930 - i * 10, 40 + i + (Math.floor(f / 2) % 3), 4, 18)} stroke={SARI} strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
        <Cizgi
          x={300}
          y={1640}
          s={1.5}
          oturan
          goz={dur ? 'sok' : 'acik'}
          agiz={dur ? 'o' : 'duz'}
          kas={dur ? 'kalkik' : 'duz'}
          bakis={[1, 0]}
          kolSag={[lerp(50, 96, uz), lerp(60, 12, uz)]}
          kolSol={[40, 30]}
          golge={false}
        />
      </Ic>
      <g transform={`translate(560 720) scale(${pop(t, no)})`}>
        <path d="M-110 90 L0 -110 L110 90 Z" fill="#FF4A3A" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
        <path d="M0 -40 V30 M0 58 v4" stroke="#fff" strokeWidth={22} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

const AYAR: Parameters<typeof makeShort>[0] = {
  kod: 's15',
  words: WORDS,
  voiceLen: 19.92,
  tail: 0.7,
  baslik: ['LIGHTNING HITS', 'YOUR CAR'],
  vurgu: '#8FD3FF',
  plan: [
    { w: 'Lightning', C: S1 },
    { w: 'You', C: S2 },
    { w: 'And', C: S3 },
    { w: 'The', C: S4 },
    { w: 'Tires', C: S5 },
    { w: 'The#2', C: S6 },
    { w: 'The#3', C: S7 },
    { w: 'jumps', C: S8 },
    { w: 'Just', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['impact', 'Lightning', 0, 0.28],
    ['ding', 'fine.', 0, 0.16],
    ['buzz', 'not', 0, 0.12],
    ['riser', 'The', 0, 0.14],
    ['impact', 'stop', 0, 0.22],
    ['ding', 'saves', 0, 0.18],
    ['whoosh', 'runs', 0, 0.16],
    ['impact', 'jumps', 0, 0.22],
    ['alarm', 'not#2', 0, 0.1],
  ],
  muzik: ['music-dark', 0.06],
};
const short = makeShort(AYAR);

export const S15 = short.Comp;
export const S15_FRAMES = short.frames;

/** Türkçe sürüm (Instagram): aynı sahneler, Türkçe ses, çapalar EN kelime -> TR kelime. */
const shortTr = makeShort({
  ...AYAR,
  kod: 's15tr',
  words: WORDS_TR,
  voiceLen: 17.27,
  baslik: ["ARABANA", "YILDIRIM DÜŞERSE?"],
  dil: 'tr',
  esle: {"Lightning": "Arabana", "You": "Sana", "And": "Hayır", "The": "Yıldırım", "Tires": "Lastikler", "The#2": "Seni", "The#3": "Akım", "jumps": "toprağa", "Just": "Yeter", "mile": "kilometrelerce", "not": "değildir", "not#2": "dokunma", "saves": "gövdedir", "stop": "durduramaz", "fine.": "olmaz", "runs": "dolaşır"},
});
export const S15TR = shortTr.Comp;
export const S15TR_FRAMES = shortTr.frames;
