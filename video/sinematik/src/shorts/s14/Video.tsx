/**
 * S-14 "Your elevator cable snaps". Dikey Short, ~21 sn.
 * Kaynak: modern asansörlerde 4-8 çelik halat bulunur, her biri kabini tek başına taşıyacak dayanımdadır.
 * Hız regülatörü aşırı hızda güvenlik frenini (paraşüt tertibatı) tetikler, çeneler kılavuz rayı sıkar.
 * Güvenlik freni: Elisha Otis, 1854 New York Crystal Palace gösterisi (mucidi burada Çizgi oynar).
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, Koni, lerp, makeShort, pop, useAt, useTt, Zerre, T } from '../ortak';
import raw from './words.json';
import rawTr from './words-tr.json';

const WORDS = raw as Word[];
const WORDS_TR = rawTr as Word[];
const SARI = '#FFD54A';
const CELIK = '#AEB8CC';

/* ---------------- nesneler ---------------- */

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

/** Örgülü çelik halat (dikey). */
const Halat: React.FC<{ x: number; y1: number; y2: number; w?: number; renk?: string }> = ({ x, y1, y2, w = 16, renk = CELIK }) => (
  <g>
    <path d={`M${x} ${y1} V${y2}`} stroke={INK} strokeWidth={w + 8} strokeLinecap="round" />
    <path d={`M${x} ${y1} V${y2}`} stroke={renk} strokeWidth={w} strokeLinecap="round" />
    <path d={`M${x} ${y1} V${y2}`} stroke="#5E6880" strokeWidth={w} strokeDasharray="5 13" opacity={0.8} />
  </g>
);

/** Asansör boşluğu: beton duvar, kılavuz raylar, konsollar, servis lambaları. kay: dikey kayma. */
const Bosluk: React.FC<{ kay?: number; ray?: [number, number] }> = ({ kay = 0, ray = [150, 930] }) => {
  const f = useCurrentFrame();
  const k = ((kay % 260) + 260) % 260;
  return (
    <g>
      <defs>
        <linearGradient id="a-bos" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#151A2C" />
          <stop offset="0.5" stopColor="#2A3150" />
          <stop offset="1" stopColor="#151A2C" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#a-bos)" />
      <g transform={`translate(0 ${k})`}>
        {Array.from({ length: 13 }, (_, i) => {
          const y = -700 + i * 260;
          return (
            <g key={i}>
              <path d={`M-500 ${y} H1600`} stroke="#10131F" strokeWidth={6} opacity={0.7} />
              <rect x={ray[0] - 70} y={y + 60} width={120} height={26} fill="#3B4466" stroke={INK} strokeWidth={5} />
              <rect x={ray[1] - 50} y={y + 60} width={120} height={26} fill="#3B4466" stroke={INK} strokeWidth={5} />
              {i % 2 === 0 && (
                <g>
                  <rect x={ray[0] - 110} y={y + 150} width={44} height={60} rx={8} fill="#1B1F33" stroke={INK} strokeWidth={5} />
                  <circle cx={ray[0] - 88} cy={y + 180} r={13} fill="#FFB25C" opacity={0.7 + Math.sin(f / 5 + i) * 0.2} />
                  <circle cx={ray[0] - 88} cy={y + 180} r={80} fill="#FFB25C" opacity={0.18} filter="url(#s-glow)" />
                </g>
              )}
            </g>
          );
        })}
      </g>
      {/* kılavuz raylar */}
      {ray.map((x) => (
        <g key={x}>
          <rect x={x - 14} y={-600} width={28} height={3200} fill="#7C86A6" stroke={INK} strokeWidth={6} />
          <rect x={x - 4} y={-600} width={8} height={3200} fill="#C9D2E3" opacity={0.6} />
        </g>
      ))}
      {/* boru ve kablo demeti */}
      <path d="M1010 -600 V2600" stroke="#3E2F2A" strokeWidth={18} />
      <path d="M1040 -600 V2600" stroke="#22284A" strokeWidth={10} />
    </g>
  );
};

/** Kabin (kesit). (x, y) = taban ortası. isik: tavan lambası 0-1. */
const Kabin: React.FC<{ x: number; y: number; s?: number; isik?: number; kat?: string; children?: React.ReactNode }> = ({ x, y, s = 1, isik = 1, kat = '12', children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* çatı kirişi ve askı */}
    <rect x={-350} y={-800} width={700} height={44} rx={8} fill="#55608A" stroke={INK} strokeWidth={8} />
    <rect x={-60} y={-840} width={120} height={50} rx={10} fill="#7C86A6" stroke={INK} strokeWidth={8} />
    {/* ray pabuçları */}
    {[-1, 1].map((d) => (
      <g key={d}>
        <rect x={d * 350 - 30} y={-790} width={60} height={70} rx={8} fill="#3B4466" stroke={INK} strokeWidth={7} />
        <rect x={d * 350 - 30} y={-80} width={60} height={70} rx={8} fill="#3B4466" stroke={INK} strokeWidth={7} />
      </g>
    ))}
    {/* gövde */}
    <rect x={-330} y={-760} width={660} height={770} rx={16} fill="#2B3354" stroke={INK} strokeWidth={10} />
    <rect x={-300} y={-730} width={600} height={710} fill="#D9C9A8" />
    <rect x={-300} y={-730} width={600} height={710} fill="#141828" opacity={0.7 * (1 - isik)} />
    {/* arka panel çizgileri ve ayna */}
    {[-150, 0, 150].map((px) => (
      <path key={px} d={`M${px} -730 V-20`} stroke="#B8A888" strokeWidth={5} />
    ))}
    <rect x={-270} y={-560} width={230} height={300} rx={8} fill="#BFE3F0" opacity={0.55} stroke="#8E7F63" strokeWidth={6} />
    <path d="M-240 -330 l110 -180 M-200 -300 l60 -100" stroke="#fff" strokeWidth={8} opacity={0.5} strokeLinecap="round" />
    {/* tutamak */}
    <path d="M-290 -230 H290" stroke="#8E97B0" strokeWidth={14} strokeLinecap="round" />
    {/* tavan lambası */}
    <rect x={-200} y={-730} width={400} height={26} rx={10} fill="#FFF3C8" opacity={0.3 + isik * 0.7} />
    <polygon points="-200,-704 200,-704 300,-20 -300,-20" fill="#FFF3C8" opacity={0.16 * isik} />
    {/* kat göstergesi */}
    <rect x={130} y={-690} width={140} height={74} rx={10} fill="#11131C" stroke={INK} strokeWidth={6} />
    <text x={200} y={-634} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={54} fill="#FF5A3A">
      {kat}
    </text>
    {/* düğme paneli */}
    <rect x={190} y={-560} width={84} height={280} rx={10} fill="#8E97B0" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={i} cx={214 + (i % 2) * 36} cy={-524 + Math.floor(i / 2) * 58} r={12} fill={i === 3 ? '#FFD54A' : '#2B3354'} />
    ))}
    {/* zemin */}
    <rect x={-300} y={-40} width={600} height={24} fill="#6A5B48" />
    {children}
  </g>
);

/** Kahve bardağı (el merkezine göre). */
const Kahve: React.FC<{ buhar?: boolean }> = ({ buhar = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M-26 -58 h52 l-8 70 h-36 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-30} y={-66} width={60} height={14} rx={6} fill="#8C4628" stroke={INK} strokeWidth={5} />
      <rect x={-22} y={-36} width={44} height={22} fill="#C98A5A" />
      {buhar && [0, 1].map((i) => <path key={i} d={`M${-10 + i * 20} -76 q${10 + Math.sin(f / 6 + i) * 8} -20 0 -40 q-10 -20 0 -40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />)}
    </g>
  );
};

const Kivilcim: React.FC<{ x: number; y: number; n?: number; r?: number; o?: number }> = ({ x, y, n = 9, r = 90, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r * 0.9} fill="#FFB25C" opacity={0.35} filter="url(#s-glow)" />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + f * 0.7;
        const l = r * (0.5 + ((i * 37 + f * 13) % 50) / 60);
        return <path key={i} d={`M${x + Math.cos(a) * 14} ${y + Math.sin(a) * 14} L${x + Math.cos(a) * l} ${y + Math.sin(a) * l}`} stroke={i % 2 ? '#FFF3C8' : '#FFB25C'} strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/** 1 · Your elevator cable snaps. Kabin, kahveli Çizgi, yıpranmış halat kopar. (loop karesi) */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sn = useAt('snaps.');
  const k = t > sn;
  const u = ap(t, sn, 0.5);
  const flick = k ? (Math.sin(f * 2.3) > 0.2 ? 0.25 : 0.9) : 1;
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 900]} shakeAt={[sn]} shake={26}>
      <Bosluk />
      {/* üst halat parçası: kopunca yukarı savrulur */}
      <g transform={`translate(${k ? Math.sin(f / 2) * 30 * (1 - u * 0.5) : 0} ${-u * 420})`}>
        <Halat x={540} y1={-700} y2={520} w={20} />
        {[-1, 0, 1].map((i) => (
          <path key={i} d={`M540 520 q${i * 26} 30 ${i * 40} ${60 + Math.abs(i) * 10}`} stroke={CELIK} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* alt parça kabin çatısına düşer */}
      <g transform={`translate(540 640) rotate(${u * 78})`}>
        <Halat x={0} y1={-64} y2={0} w={20} />
        {[-1, 0, 1].map((i) => (
          <path key={i} d={`M0 -64 q${i * 24} -24 ${i * 36} -52`} stroke={CELIK} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <Kivilcim x={540} y={548} r={k ? 150 : 46} n={k ? 12 : 6} o={k ? 1 - ap(t, sn + 0.15, 0.5) : 0.9} />
      <Kabin x={540} y={1440} isik={flick}>
        <Cizgi
          x={-40}
          y={-36}
          s={1.12}
          goz={k ? 'sok' : 'yari'}
          agiz={k ? 'o' : 'gulus'}
          kas={k ? 'kalkik' : 'duz'}
          bakis={k ? [0, -1] : [0, 0]}
          kolSag={k ? [70, 60] : [60, 70]}
          kolSol={k ? [60, 30] : [12, 10]}
          elSag={<Kahve />}
          golge={false}
        />
      </Kabin>
    </Kadraj>
  );
};

/** 2 · You do not fall. Kabin yerinde, kahve dökülmedi. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.25, 1.34]} origin={[540, 1150]}>
      <Bosluk />
      <Kabin x={540} y={1440} isik={1}>
        <Cizgi x={-40} y={-36} s={1.12} goz={t < 0.5 ? 'sikis' : 'acik'} agiz={t < 0.5 ? 'eksi' : 'sirit'} kas="kalkik" bakis={[1, 1]} kolSag={[70, 60]} kolSol={[30, 20]} elSag={<Kahve />} golge={false} />
      </Kabin>
      <g transform={`translate(810 760) scale(${pop(t, 0.45)}) rotate(${Math.sin(f / 9) * 4})`}>
        <circle r={104} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
        <path d="M-48 4 l34 34 l64 -74" stroke="#fff" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Kadraj>
  );
};

/** 3 · First, there is not one cable. Tek halat, üstü çizilir. */
const S3: React.FC = () => {
  const t = useTt();
  const no = useAt('not#2');
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 800]}>
      <Bosluk kay={t * 30} />
      <Kabin x={540} y={1900} s={0.9} />
      <Halat x={540} y1={-700} y2={1160} w={30} />
      <circle cx={540} cy={760} r={300} fill="#8FD3FF" opacity={0.14} filter="url(#s-glow)" />
      <g transform={`translate(300 620) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={240}>1</Etiket>
      </g>
      <g opacity={ap(t, no, 0.15)}>
        <path d={`M160 440 L${lerp(160, 460, ap(t, no, 0.2))} ${lerp(440, 700, ap(t, no, 0.2))}`} stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d={`M160 440 L${lerp(160, 460, ap(t, no, 0.2))} ${lerp(440, 700, ap(t, no, 0.2))}`} stroke="#FF4A3A" strokeWidth={32} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

/** 4 · There are up to eight. Sekiz halat sırayla belirir. */
const S4: React.FC = () => {
  const t = useTt();
  const e8 = useAt('eight,');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 850]}>
      <Bosluk kay={t * 30} />
      {/* makine dairesi kasnağı */}
      <g transform="translate(540 450)">
        <rect x={-380} y={-70} width={760} height={110} rx={16} fill="#55608A" stroke={INK} strokeWidth={9} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-316 + i * 84} y={-40} width={44} height={86} rx={8} fill="#2B3354" stroke={INK} strokeWidth={6} />
        ))}
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = ap(t, 0.1 + i * 0.09, 0.25);
        return (
          <g key={i} opacity={a}>
            <Halat x={246 + i * 84} y1={490} y2={lerp(490, 1250, a)} w={22} renk={i % 2 ? '#C9D2E3' : CELIK} />
          </g>
        );
      })}
      <Kabin x={540} y={2080} s={1.0} />
      <g transform={`translate(540 960) scale(${pop(t, e8 - 0.05)})`}>
        <circle r={190} fill="#141828" opacity={0.75} />
        <Etiket x={0} y={90} size={300}>8</Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · each one can hold the whole car. Yedisi kopuk, tek halat kabini taşır. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sal = Math.sin(f / 10) * 5;
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Bosluk />
      <g transform={`rotate(${sal * 0.25} 540 -400)`}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = 372 + i * 48;
          if (i === 3) return <Halat key={i} x={x} y1={-700} y2={636} w={18} renk="#FFD54A" />;
          const boy = 60 + ((i * 53) % 150);
          return (
            <g key={i}>
              <Halat x={x} y1={-700} y2={boy + Math.sin(f / 5 + i) * 6} w={14} />
              <path d={`M${x} 640 q${(i - 4) * 16} ${-80} ${(i - 4) * 34 + Math.sin(f / 6 + i) * 8} ${-150 + (i % 3) * 30}`} stroke={CELIK} strokeWidth={12} fill="none" strokeLinecap="round" opacity={ap(t, 0, 0.2)} />
            </g>
          );
        })}
        <circle cx={516} cy={420} r={150} fill="#FFD54A" opacity={0.22} filter="url(#s-glow)" />
        <Kabin x={540} y={1440} s={0.98}>
          <Cizgi x={-40} y={-36} s={1.12} goz="mutlu" agiz="gulus" bakis={[0, -1]} kolSag={[70, 60]} kolSol={[150, 30]} elSag={<Kahve />} golge={false} />
        </Kabin>
      </g>
      <g transform={`translate(800 520) scale(${pop(t, 0.5)})`}>
        <Etiket x={0} y={0} size={130}><T en="1 = OK" tr="1 YETER" /></Etiket>
      </g>
    </Kadraj>
  );
};

/** 6 · Second, if the car moves too fast. Hız regülatörü çarkı, ağırlıklar açılır. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const fast = useAt('fast,');
  const hiz = lerp(3, 26, ap(t, 0.6, fast - 0.4, (x) => x * x));
  const aci = f * hiz;
  const ac = ap(t, fast - 0.5, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 880]} shakeAt={[fast]} shake={12}>
      <Bosluk kay={-t * t * 520} />
      {/* regülatör halatı */}
      <Halat x={330} y1={-700} y2={2600} w={12} />
      <Halat x={750} y1={-700} y2={2600} w={12} />
      <circle cx={540} cy={880} r={420} fill="#FF5A3A" opacity={0.1 + ac * 0.16} filter="url(#s-glow)" />
      <g transform="translate(540 880)">
        <circle r={236} fill="#3B4466" stroke={INK} strokeWidth={14} />
        <circle r={206} fill="#232A45" />
        <g transform={`rotate(${aci})`}>
          {[0, 60, 120].map((a) => (
            <path key={a} d="M-200 0 H200" stroke="#7C86A6" strokeWidth={22} transform={`rotate(${a})`} />
          ))}
          {/* merkezkaç ağırlıkları */}
          {[0, 180].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d={`M0 0 L${90 + ac * 70} ${-40}`} stroke={INK} strokeWidth={18} strokeLinecap="round" />
              <circle cx={90 + ac * 70} cy={-40} r={44} fill={ac > 0.8 ? '#FF5A3A' : '#FFD54A'} stroke={INK} strokeWidth={9} />
            </g>
          ))}
        </g>
        <circle r={40} fill={CELIK} stroke={INK} strokeWidth={9} />
      </g>
      {/* hız çizgileri */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${90 + i * 128} ${1700 - ((f * (14 + hiz) + i * 210) % 1500)} v-${60 + hiz * 6}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.12 + ac * 0.3} />
      ))}
      <g transform={`translate(540 1290) scale(${pop(t, fast - 0.1)})`}>
        <path d="M-70 60 L0 -70 L70 60 Z" fill="#FF4A3A" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M0 -26 V18 M0 38 v4" stroke="#fff" strokeWidth={16} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

/** 7 · steel brakes bite the rails. Çeneler rayı sıkar, kıvılcım, kabin durur. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const bite = useAt('bite');
  const u = ap(t, bite - 0.12, 0.14);
  const dur = ap(t, bite, 0.5);
  const kay = (1 - dur) * f * 30 + dur * 400;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 900]} shakeAt={[bite]} shake={30}>
      <Bosluk kay={-kay} ray={[540, 1300]} />
      {/* kabin köşesi */}
      <rect x={-300} y={420} width={640} height={1500} rx={20} fill="#2B3354" stroke={INK} strokeWidth={12} />
      <rect x={-300} y={470} width={590} height={1400} fill="#D9C9A8" opacity={0.25} />
      {/* fren gövdesi */}
      <rect x={300} y={700} width={480} height={420} rx={26} fill="#55608A" stroke={INK} strokeWidth={12} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={340 + (i % 2) * 400} cy={740 + Math.floor(i / 2) * 340} r={14} fill="#1B1F33" />
      ))}
      {/* çeneler */}
      {[-1, 1].map((d) => {
        const x = 540 + d * lerp(150, 40, u);
        return (
          <g key={d}>
            <path d={`M${x} 760 L${x + d * 120} 800 V1020 L${x} 1060 Z`} fill={u > 0.9 ? '#FF8A4A' : CELIK} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
            {Array.from({ length: 6 }, (_, i) => (
              <path key={i} d={`M${x} ${790 + i * 46} l${-d * 16} 23 l${d * 16} 23`} fill={INK} />
            ))}
          </g>
        );
      })}
      {u > 0.9 && (
        <g>
          <Kivilcim x={500} y={800} r={170 * (1 - dur * 0.6)} n={12} o={1 - dur * 0.7} />
          <Kivilcim x={580} y={1020} r={190 * (1 - dur * 0.6)} n={12} o={1 - dur * 0.7} />
        </g>
      )}
      <g transform={`translate(800 520) scale(${pop(t, bite + 0.35)})`}>
        <Etiket x={0} y={0} size={130} renk="#3FCB6B"><T en="STOP" tr="DURDU" /></Etiket>
      </g>
    </Kadraj>
  );
};

/** Fuar salonu: cam kubbe, kemerler, kalabalık silueti. */
const Salon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="a-sal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4D9A0" />
          <stop offset="1" stopColor="#8A5A3A" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#a-sal)" />
      {/* cam kubbe kirişleri */}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M540 -500 Q${-300 + i * 210} 200 ${-400 + i * 235} 900`} stroke="#6B4A2A" strokeWidth={10} fill="none" opacity={0.55} />
      ))}
      {[100, 380, 660].map((y) => (
        <path key={y} d={`M-400 ${y + 240} Q540 ${y - 260} 1480 ${y + 240}`} stroke="#6B4A2A" strokeWidth={9} fill="none" opacity={0.5} />
      ))}
      <Koni x={540} y={-300} w1={200} w2={1100} h={1900} o={0.35} />
      {/* kemerli galeriler */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <path d={`M${-200 + i * 260} 1300 V980 q110 -130 220 0 V1300 Z`} fill="#5A3A28" opacity={0.75} />
          <rect x={-218 + i * 260} y={960} width={36} height={360} fill="#3E2618" />
        </g>
      ))}
      {/* bayraklar */}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${-60 + i * 190} 880 l60 ${70 + Math.sin(f / 7 + i) * 8} l60 -70 Z`} fill={i % 2 ? '#C2402E' : '#2F5E8C'} stroke={INK} strokeWidth={5} />
      ))}
      <path d="M-200 880 H1300" stroke="#3E2618" strokeWidth={6} />
      <rect x={-500} y={1300} width={2100} height={1300} fill="#4A2E20" />
      {/* kalabalık: silindir şapkalı siluetler */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = -60 + i * 78 + ((i * 29) % 20);
        const y = 1500 + ((i * 47) % 90) + Math.sin(f / 8 + i) * 5;
        const c = i % 3 === 0 ? '#2A1A14' : '#1E1410';
        return (
          <g key={i}>
            <rect x={x - 52} y={y} width={104} height={700} rx={40} fill={c} />
            <circle cx={x} cy={y - 30} r={42} fill={c} />
            {i % 2 === 0 ? <path d={`M${x - 34} ${y - 60} v-70 h68 v70 M${x - 56} ${y - 60} h112`} stroke={c} strokeWidth={14} fill={c} /> : <path d={`M${x - 50} ${y - 52} q50 -60 100 0`} fill="#7A3B4A" />}
          </g>
        );
      })}
    </g>
  );
};

/** Açık platform, kılavuz direkler, halat. */
const Platform: React.FC<{ y: number; children?: React.ReactNode }> = ({ y, children }) => (
  <g>
    {[250, 830].map((x) => (
      <g key={x}>
        <rect x={x - 16} y={-600} width={32} height={2100} fill="#6B4A2A" stroke={INK} strokeWidth={7} />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${x - 16} ${-560 + i * 84} l${x < 500 ? 18 : -18} 22 l${x < 500 ? -18 : 18} 22`} fill={INK} opacity={0.7} />
        ))}
      </g>
    ))}
    <g transform={`translate(0 ${y})`}>
      <rect x={236} y={0} width={608} height={44} rx={8} fill="#A8743E" stroke={INK} strokeWidth={9} />
      {[330, 440, 550, 660, 770].map((x) => (
        <path key={x} d={`M${x} 4 V40`} stroke="#6B4A2A" strokeWidth={5} />
      ))}
      {/* fıçı ve sandıklar */}
      <rect x={640} y={-150} width={150} height={150} fill="#B8854A" stroke={INK} strokeWidth={8} />
      <path d="M640 -150 L790 0 M790 -150 L640 0" stroke="#6B4A2A" strokeWidth={8} />
      <rect x={670} y={-250} width={100} height={100} fill="#C99A5A" stroke={INK} strokeWidth={8} />
      <g transform="translate(330 0)">
        <path d="M-50 -130 q-16 65 0 130 h100 q16 -65 0 -130 Z" fill="#8C5A2E" stroke={INK} strokeWidth={8} />
        <path d="M-56 -92 h112 M-56 -40 h112" stroke="#3E2618" strokeWidth={8} />
      </g>
      {children}
    </g>
  </g>
);

/** 8 · Invented in 1854. Fuar salonu, yükselen platform. */
const S8: React.FC = () => {
  const t = useTt();
  const yil = useAt('1854.');
  const y = lerp(1500, 1080, ap(t, 0, 1.6, (x) => x));
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]} bg="#3E2618">
      <Salon />
      <Halat x={540} y1={-700} y2={y - 520} w={18} renk="#D9B26A" />
      <path d={`M540 ${y - 520} L300 ${y} M540 ${y - 520} L780 ${y}`} stroke="#D9B26A" strokeWidth={10} />
      <Platform y={y}>
        <Cizgi x={520} y={0} s={0.9} goz="mutlu" agiz="sirit" kolSag={[150, 20]} kolSol={[30, 20]} golge={false} />
      </Platform>
      <g transform={`translate(540 1380) scale(${pop(t, yil - 0.1)})`}>
        <Etiket x={0} y={0} size={190}>1854</Etiket>
      </g>
      <Zerre n={26} color="#FFF3C8" o={0.35} />
    </Kadraj>
  );
};

/** 9 · The inventor cut his own rope. On stage. Çizgi baltayla halatı keser, platform kıpırdamaz. */
const S9: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const cut = useAt('cut');
  const st = useAt('stage.');
  const k = t > cut + 0.12;
  const sal = ap(t, cut - 0.25, 0.3);
  const dus = k ? Math.min(14, (t - cut - 0.12) * 120) * Math.exp(-(t - cut - 0.12) * 5) * 3 : 0;
  const y = 1120 + dus;
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[540, 950]} shakeAt={[cut + 0.12]} shake={22} bg="#3E2618">
      <Salon />
      {/* üst halat savrulur */}
      <g transform={`translate(${k ? Math.sin(f / 3) * 40 : 0} ${k ? -ap(t, cut + 0.12, 0.5) * 300 : 0})`}>
        <Halat x={540} y1={-700} y2={560} w={18} renk="#D9B26A" />
      </g>
      {!k && <Halat x={540} y1={560} y2={y - 520} w={18} renk="#D9B26A" />}
      <path d={`M540 ${y - 520 + (k ? 150 : 0)} L300 ${y} M540 ${y - 520 + (k ? 150 : 0)} L780 ${y}`} stroke="#D9B26A" strokeWidth={10} fill="none" />
      {/* tırnaklar dişlere geçer */}
      {k &&
        [250, 830].map((x) => (
          <g key={x}>
            <path d={`M${x < 500 ? 300 : 780} ${y + 10} L${x + (x < 500 ? 14 : -14)} ${y - 16}`} stroke={CELIK} strokeWidth={20} strokeLinecap="round" />
            <Kivilcim x={x + (x < 500 ? 20 : -20)} y={y - 10} r={90} n={8} o={1 - ap(t, cut + 0.2, 0.6)} />
          </g>
        ))}
      <Platform y={y}>
        <Cizgi
          x={500}
          y={0}
          s={0.9}
          goz={k ? 'mutlu' : 'acik'}
          agiz={k ? 'sirit' : 'duz'}
          kas={k ? 'duz' : 'catik'}
          bakis={[0, -1]}
          kolSag={[lerp(170, 120, sal), 30]}
          kolSol={k && t > st - 0.2 ? [140, 20] : [20, 14]}
          elSag={
            <g transform={`rotate(${lerp(-30, 40, sal)})`}>
              <path d="M0 20 V-150" stroke="#6B4A2A" strokeWidth={14} strokeLinecap="round" />
              <path d="M-8 -150 q50 -40 70 10 q-30 30 -70 30 Z" fill={CELIK} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            </g>
          }
          golge={false}
        />
      </Platform>
      <g transform={`translate(820 640) scale(${pop(t, st - 0.05)}) rotate(-8)`}>
        <circle r={110} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
        <path d="M-50 4 l36 36 l68 -78" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Zerre n={26} color="#FFF3C8" o={0.35} />
    </Kadraj>
  );
};

const AYAR: Parameters<typeof makeShort>[0] = {
  kod: 's14',
  words: WORDS,
  voiceLen: 20.34,
  tail: 0.7,
  baslik: ['ELEVATOR CABLE', 'SNAPS'],
  vurgu: '#FF7A5A',
  plan: [
    { w: 'Your', C: S1 },
    { w: 'You', C: S2 },
    { w: 'First,', C: S3 },
    { w: 'There', C: S4 },
    { w: 'each', C: S5 },
    { w: 'Second,', C: S6 },
    { w: 'steel', C: S7 },
    { w: 'Invented', C: S8 },
    { w: 'The', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['impact', 'snaps.', 0, 0.25],
    ['ding', 'You', 0.45, 0.18],
    ['buzz', 'not#2', 0, 0.12],
    ['tick', 'There', 0.1, 0.2],
    ['pop', 'eight,', 0, 0.25],
    ['click', 'each', 0.5, 0.2],
    ['riser', 'Second,', 0.6, 0.14],
    ['impact', 'bite', 0, 0.25],
    ['ding', 'Invented', 0.7, 0.16],
    ['whoosh', 'cut', -0.1, 0.2],
    ['lock', 'cut', 0.15, 0.25],
    ['pop', 'stage.', 0, 0.22],
  ],
  muzik: ['music-happy', 0.06],
};
const short = makeShort(AYAR);

export const S14 = short.Comp;
export const S14_FRAMES = short.frames;

/** Türkçe sürüm (Instagram): aynı sahneler, Türkçe ses, çapalar EN kelime -> TR kelime. */
const shortTr = makeShort({
  ...AYAR,
  kod: 's14tr',
  words: WORDS_TR,
  voiceLen: 18.76,
  baslik: ["ASANSÖR HALATI", "KOPARSA?"],
  dil: 'tr',
  esle: {"Your": "Asansörün", "You": "Ama", "First,": "Çünkü", "There": "Sekize", "each": "her", "Second,": "Kabin", "steel": "çelik", "Invented": "Bu", "The": "Mucidi", "1854.": "dörtte", "bite": "kenetlenir", "cut": "kesti", "eight,": "Sekize", "fast,": "hızlanırsa", "not#2": "yoktur", "snaps.": "koptu", "stage.": "kesti"},
});
export const S14TR = shortTr.Comp;
export const S14TR_FRAMES = shortTr.frames;
