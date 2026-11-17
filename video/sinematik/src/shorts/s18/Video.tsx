/**
 * S-18 "You swallowed your gum". Dikey Short, ~21 sn.
 * Kaynak: Mayo Clinic, Duke Health: sakız bazı sindirilmez ama sindirim sistemi onu diğer her şey gibi
 * ilerletir ve birkaç günde atar. "7 yıl kalır" şehir efsanesidir. (Çok miktarda yutmak nadiren tıkanma yapabilir.)
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, T, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';
import rawTr from './words-tr.json';

const WORDS = raw as Word[];
const WORDS_TR = rawTr as Word[];
const SARI = '#FFD54A';
const PEMBE = '#FF8FC0';

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

const rnd = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

/** Sakız: pembe yumru, yüzlü. */
const Sakiz: React.FC<{ x: number; y: number; s?: number; r?: number; yuz?: 'rahat' | 'mutlu' | 'sok' | 'omuz'; gozluk?: boolean }> = ({ x, y, s = 1, r = 0, yuz = 'mutlu', gozluk = false }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 6) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={`M-100 20 q-20 -90 50 -110 q60 -30 110 20 q${50 + b} 50 20 ${110 - b} q-50 50 -120 30 q-60 -10 -60 -50 Z`} fill={PEMBE} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-60 -50 q30 -40 80 -30" stroke="#FFD0E4" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M-30 70 q40 30 90 10" stroke="#E0649A" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6} />
      {yuz === 'rahat' || gozluk ? (
        <g>
          {gozluk ? (
            <g>
              <rect x={-58} y={-22} width={50} height={32} rx={10} fill={INK} />
              <rect x={12} y={-22} width={50} height={32} rx={10} fill={INK} />
              <path d="M-8 -10 h20" stroke={INK} strokeWidth={7} />
            </g>
          ) : (
            <path d="M-50 -8 h34 M16 -8 h34" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          )}
        </g>
      ) : (
        <g>
          <ellipse cx={-32} cy={-8} rx={15} ry={yuz === 'sok' ? 22 : 18} fill="#fff" stroke={INK} strokeWidth={5} />
          <ellipse cx={34} cy={-8} rx={15} ry={yuz === 'sok' ? 22 : 18} fill="#fff" stroke={INK} strokeWidth={5} />
          <circle cx={-30} cy={-6} r={7} fill={INK} />
          <circle cx={36} cy={-6} r={7} fill={INK} />
        </g>
      )}
      {yuz === 'sok' ? <ellipse cx={2} cy={40} rx={12} ry={15} fill={INK} /> : <path d="M-22 34 q24 22 48 0" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />}
      {yuz === 'omuz' && <path d="M-104 10 l-50 -40 M112 10 l50 -40" stroke={INK} strokeWidth={14} strokeLinecap="round" />}
    </g>
  );
};

/** Sınıf: tahta, pencere, sıralar, saat. */
const Sinif: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#F2E3B8" />
      <rect x={-500} y={1100} width={2100} height={60} fill="#C9A86A" />
      {/* yazı tahtası */}
      <rect x={-140} y={330} width={760} height={520} rx={12} fill="#2F5E4A" stroke="#8C5A2E" strokeWidth={26} />
      <path d="M-60 460 h300 M-60 540 h420 M-60 620 h220" stroke="#fff" strokeWidth={10} opacity={0.6} strokeLinecap="round" />
      <path d="M330 700 l60 -110 l60 110 Z M300 560 a50 50 0 1 0 0.1 0" stroke="#fff" strokeWidth={8} fill="none" opacity={0.6} />
      <rect x={-140} y={860} width={760} height={24} fill="#8C5A2E" />
      <rect x={380} y={836} width={70} height={26} rx={6} fill="#fff" stroke={INK} strokeWidth={5} />
      {/* pencere */}
      <rect x={720} y={330} width={420} height={560} rx={12} fill="#BFE3F0" stroke="#fff" strokeWidth={24} />
      <path d="M930 330 V890 M720 610 H1140" stroke="#fff" strokeWidth={14} />
      <circle cx={830} cy={450} r={50} fill={SARI} opacity={0.9} />
      <ellipse cx={1010 + Math.sin(f / 40) * 12} cy={520} rx={90} ry={30} fill="#fff" />
      {/* saat */}
      <g transform="translate(640 250)">
        <circle r={62} fill="#fff" stroke={INK} strokeWidth={8} />
        <path d="M0 0 V-40" stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${f * 2})`} />
        <path d="M0 0 V-26" stroke={INK} strokeWidth={9} strokeLinecap="round" transform="rotate(100)" />
      </g>
      {/* zemin ve sıralar */}
      <rect x={-500} y={1500} width={2100} height={1100} fill="#B88A5A" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-300 + i * 220} 1500 l-80 1000`} stroke="#A07848" strokeWidth={6} />
      ))}
      {[640, 900].map((x, i) => (
        <g key={x} transform={`translate(${x} ${1500 + i * 20})`}>
          <rect x={-110} y={-230} width={220} height={26} rx={6} fill="#D9B26A" stroke={INK} strokeWidth={7} />
          <path d="M-90 -204 V0 M90 -204 V0" stroke={INK} strokeWidth={12} />
          <rect x={-60} y={-270} width={90} height={40} rx={4} fill={i ? '#5FC8FF' : '#FF8A4A'} stroke={INK} strokeWidth={5} />
        </g>
      ))}
    </g>
  );
};

/** Takvim yaprağı. */
const Yaprak: React.FC<{ x: number; y: number; s?: number; r?: number; yazi: string; renk?: string }> = ({ x, y, s = 1, r = 0, yazi, renk = '#FF5A3A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-110} y={-130} width={220} height={260} rx={14} fill="#fff" stroke={INK} strokeWidth={8} />
    <path d="M-110 -116 q0 -14 14 -14 h192 q14 0 14 14 v50 h-220 Z" fill={renk} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={-60} cy={-130} r={12} fill={INK} />
    <circle cx={60} cy={-130} r={12} fill={INK} />
    <text x={0} y={80} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={130} fill={INK}>
      {yazi}
    </text>
  </g>
);

/** Mide içi: kıvrımlı pembe mağara, asit gölü, kabarcıklar. */
const Mide: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <radialGradient id="m-ic" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#E0647A" />
          <stop offset="1" stopColor="#7A1F3A" />
        </radialGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#m-ic)" />
      {/* duvar kıvrımları */}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M-300 ${200 + i * 200} q210 ${-70 + Math.sin(f / 20 + i) * 16} 420 0 t420 0 t420 0 t420 0`} stroke="#B03A5A" strokeWidth={26} fill="none" opacity={0.55} strokeLinecap="round" />
      ))}
      {[[-40, 700], [1120, 900], [1080, 420], [0, 1150]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={170} ry={230} fill="#C24A68" stroke="#7A1F3A" strokeWidth={10} opacity={0.9} />
      ))}
      {/* üstten yemek borusu ağzı */}
      <ellipse cx={540} cy={250} rx={170} ry={70} fill="#4A0E22" stroke="#7A1F3A" strokeWidth={12} />
      {/* asit gölü */}
      <path d={`M-500 1380 q130 ${-30 + Math.sin(f / 8) * 14} 260 0 t260 0 t260 0 t260 0 t260 0 t260 0 t260 0 V2600 H-500 Z`} fill="#C6E04A" stroke={INK} strokeWidth={9} opacity={0.92} />
      {Array.from({ length: 12 }, (_, i) => {
        const k = (f / 50 + rnd(i)) % 1;
        return <circle key={i} cx={rnd(i + 20) * 1100} cy={1900 - k * 520} r={10 + rnd(i + 5) * 16} fill="none" stroke="#F4FFB0" strokeWidth={5} opacity={1 - k} />;
      })}
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

/* ---------------- çekimler ---------------- */

/** 1 · You swallowed your gum. Sınıf, Çizgi yutkunur; boğazdan inen sakız görünür. (loop karesi) */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const d = ap(t, 0.1, 1.1, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[420, 1050]}>
      <Sinif />
      <Cizgi x={360} y={1900} s={2.0} goz="sok" agiz="duz" kas="kalkik" bakis={[0, 1]} kolSag={[30, 150]} kolSol={[20, 14]} />
      {/* gövdede "röntgen" penceresi: yemek borusu ve inen sakız */}
      <g transform="translate(360 1270)">
        <rect x={-74} y={-250} width={148} height={520} rx={70} fill="#4A0E22" stroke={INK} strokeWidth={10} />
        <rect x={-58} y={-234} width={116} height={488} rx={56} fill="#B03A5A" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M-58 ${-150 + i * 110} q58 30 116 0`} stroke="#7A1F3A" strokeWidth={8} fill="none" opacity={0.6} />
        ))}
        <Sakiz x={0} y={lerp(-160, 150, d)} s={0.42} yuz="sok" r={Math.sin(f / 3) * 8} />
        {[0, 1].map((i) => (
          <path key={i} d={`M${-30 + i * 60} ${lerp(-160, 150, d) - 60} v-44`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
        ))}
      </g>
      <g transform={`translate(760 760) scale(${pop(t, 0.45)}) rotate(${Math.sin(f / 5) * 5})`}>
        <Etiket x={0} y={0} size={150} renk="#fff">
          <T en="GULP!" tr="GULP!" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 2 · They said it stays for seven years. Takvim yaprakları uçuşur. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sv = useAt('seven');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
      <circle cx={540} cy={950} r={600} fill="#C2607C" opacity={0.25} filter="url(#s-glow)" />
      {Array.from({ length: 12 }, (_, i) => {
        const k = (t * 0.55 + rnd(i)) % 1;
        const x = rnd(i + 9) * 1100;
        return <Yaprak key={i} x={x + Math.sin(k * 5 + i) * 70} y={-200 + k * 2300} s={0.55 + rnd(i + 3) * 0.5} r={Math.sin(f / 9 + i) * 40} yazi={String(1 + ((i * 7) % 28))} renk={i % 3 ? '#FF5A3A' : '#5FC8FF'} />;
      })}
      <g transform={`translate(540 960) scale(${pop(t, sv - 0.1)}) rotate(-5)`}>
        <rect x={-430} y={-190} width={860} height={330} rx={40} fill="#141828" opacity={0.85} stroke={INK} strokeWidth={10} />
        <Etiket x={0} y={70} size={210}>
          <T en="7 YEARS" tr="7 YIL" />
        </Etiket>
      </g>
      <Sakiz x={540} y={1310} s={0.9} yuz="rahat" />
    </Kadraj>
  );
};

/** 3 · It does not. Büyük çarpı. */
const S3: React.FC = () => {
  const t = useTt();
  const no = useAt('not.');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]} shakeAt={[no]} shake={18}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
      <circle cx={540} cy={950} r={600} fill="#FF4A3A" opacity={0.2} filter="url(#s-glow)" />
      {[[-20, -30, -14], [60, 40, 10], [-70, 90, 4]].map(([dx, dy, r], i) => (
        <Yaprak key={i} x={540 + dx * 3} y={900 + dy * 3} s={1.5} r={r} yazi={['7', '', ''][i] || '7'} />
      ))}
      <Carpi x={540} y={950} s={pop(t, no - 0.05) * 3} />
    </Kadraj>
  );
};

/** 4 · Your stomach cannot break down the rubbery base. Asit damlaları sakızdan seker. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1050]}>
      <Mide />
      {/* yarı erimiş lokmalar */}
      {[[200, 1400, '#F29A6A'], [860, 1420, '#7BC86A'], [330, 1470, '#FFD54A']].map(([x, y, c], i) => (
        <ellipse key={i} cx={x as number} cy={(y as number) + Math.sin(f / 10 + i) * 8} rx={70 - ap(t, 0, 2.5) * 40} ry={40 - ap(t, 0, 2.5) * 24} fill={c as string} stroke={INK} strokeWidth={7} opacity={1 - ap(t, 0.5, 2.5) * 0.7} />
      ))}
      <Sakiz x={560} y={1290 + Math.sin(f / 9) * 10} s={1.5} yuz="rahat" gozluk />
      {/* asit damlaları: çarpıp seker */}
      {Array.from({ length: 6 }, (_, i) => {
        const k = (t * 1.3 + i / 6) % 1;
        const x0 = 300 + i * 95;
        const hit = 0.55;
        const y = k < hit ? lerp(300, 1130, k / hit) : 1130 - Math.sin(((k - hit) / (1 - hit)) * Math.PI) * 170;
        const x = k < hit ? x0 : x0 + (i - 2.5) * 110 * ((k - hit) / (1 - hit));
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={k > 0.92 ? 0 : 1}>
            <path d="M0 -34 q30 40 0 64 q-30 -24 0 -64 Z" fill="#C6E04A" stroke={INK} strokeWidth={6} />
          </g>
        );
      })}
      <g transform={`translate(540 640) scale(${pop(t, 0.9)})`}>
        <Etiket x={0} y={0} size={110} renk="#fff">
          <T en="ACID: NO EFFECT" tr="ASİT: ETKİSİZ" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · That part is true. Onay. */
const S5: React.FC = () => {
  const t = useTt();
  const tr = useAt('true.');
  return (
    <Kadraj zoom={[1.1, 1.2]} origin={[540, 1100]}>
      <Mide />
      <Sakiz x={480} y={1280} s={1.7} yuz="mutlu" gozluk />
      <Onay x={820} y={900} s={pop(t, tr - 0.05) * 1.5} />
      <g transform={`translate(540 620) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={130}>
          <T en="TRUE" tr="DOĞRU" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 6 · But it does not need to. Sakız omuz silker, çıkış kapısı açılır. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const nd = useAt('need');
  const ac = ap(t, nd - 0.2, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[620, 1100]}>
      <Mide />
      {/* mide çıkışı (pilor) sağda açılır */}
      <g transform="translate(900 1180)">
        <ellipse rx={150} ry={200} fill="#4A0E22" stroke="#7A1F3A" strokeWidth={14} />
        <ellipse rx={150 * (1 - ac * 0.75)} ry={200} fill="#C24A68" stroke="#7A1F3A" strokeWidth={10} />
        <circle r={40 + ac * 70} fill="#FFE9B8" opacity={ac * 0.5} filter="url(#s-glow)" />
      </g>
      <g transform={`translate(950 820) scale(${pop(t, nd)})`}>
        <path d="M-130 0 H90 m-50 -44 l50 44 l-50 44" stroke={INK} strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(60)" />
        <path d="M-130 0 H90 m-50 -44 l50 44 l-50 44" stroke={SARI} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(60)" />
      </g>
      <Sakiz x={lerp(380, 520, ac)} y={1280 - Math.abs(Math.sin(f / 5)) * 16} s={1.5} yuz="omuz" gozluk />
    </Kadraj>
  );
};

/** 7 · Your gut just keeps pushing, like everything else. Bağırsak kaydırağı. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  // kıvrımlı tüp yolu
  const P = (k: number): [number, number] => {
    const y = lerp(250, 1700, k);
    const x = 540 + Math.sin(k * Math.PI * 3.2) * 330;
    return [x, y];
  };
  const yolD = Array.from({ length: 61 }, (_, i) => {
    const [x, y] = P(i / 60);
    return `${i ? 'L' : 'M'}${x.toFixed(0)} ${y.toFixed(0)}`;
  }).join(' ');
  const gk = ap(t, 0, 3.3, (x) => x) * 0.86 + 0.04;
  const [gx, gy] = P(gk);
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#7A1F3A" />
      <circle cx={540} cy={950} r={700} fill="#E0647A" opacity={0.3} filter="url(#s-glow)" />
      <path d={yolD} stroke={INK} strokeWidth={300} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={yolD} stroke="#F29AA8" strokeWidth={278} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={yolD} stroke="#FFC2CC" strokeWidth={200} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* peristaltik halkalar */}
      {Array.from({ length: 8 }, (_, i) => {
        const k = ((f / 70 + i / 8) % 1);
        const [x, y] = P(k);
        return <ellipse key={i} cx={x} cy={y} rx={120} ry={22} fill="none" stroke="#E0647A" strokeWidth={12} opacity={0.7} />;
      })}
      {/* diğer lokmalar */}
      {[[0.16, '#F29A6A'], [-0.14, '#7BC86A'], [0.3, '#FFD54A']].map(([dk, c], i) => {
        const kk = Math.min(0.97, Math.max(0.02, gk + (dk as number)));
        const [x, y] = P(kk);
        return <ellipse key={i} cx={x} cy={y} rx={44} ry={34} fill={c as string} stroke={INK} strokeWidth={7} />;
      })}
      <Sakiz x={gx} y={gy} s={0.7} yuz="mutlu" gozluk r={Math.sin(f / 4) * 14} />
      <g transform={`translate(770 540) scale(${pop(t, 0.8)})`}>
        <Etiket x={0} y={0} size={96} renk="#fff">
          <T en="PUSH" tr="İTİYOR" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 8 · A few days later, it is gone. Takvimde üç gün işaretli. */
const S8: React.FC = () => {
  const t = useTt();
  const gn = useAt('gone.');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#2F5E8C" />
      <circle cx={540} cy={950} r={640} fill="#8FD3FF" opacity={0.25} filter="url(#s-glow)" />
      {/* büyük takvim */}
      <g transform="translate(540 950)">
        <rect x={-400} y={-420} width={800} height={800} rx={30} fill="#fff" stroke={INK} strokeWidth={12} />
        <path d="M-400 -390 q0 -30 30 -30 h740 q30 0 30 30 v120 h-800 Z" fill="#FF5A3A" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
        {[-260, -90, 90, 260].map((x) => (
          <circle key={x} cx={x} cy={-420} r={22} fill={INK} />
        ))}
        {Array.from({ length: 21 }, (_, i) => {
          const c = i % 7;
          const r = Math.floor(i / 7);
          const isaret = i < 3;
          return (
            <g key={i} transform={`translate(${-330 + c * 110} ${-180 + r * 170})`}>
              <rect x={-44} y={-60} width={88} height={120} rx={12} fill={isaret ? '#FFE9B8' : '#F1F3F8'} stroke="#C9D2E3" strokeWidth={5} />
              <text x={0} y={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={52} fill={isaret ? INK : '#A8B0C6'}>
                {i + 1}
              </text>
              {isaret && (
                <path d="M-34 -40 L34 40 M34 -40 L-34 40" stroke="#FF4A3A" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${ap(t, 0.15 + i * 0.25, 0.2)} 1`} />
              )}
            </g>
          );
        })}
      </g>
      <g transform={`translate(540 1290) scale(${pop(t, gn - 0.1)})`}>
        <Etiket x={0} y={0} size={150}>
          <T en="GONE" tr="GİTTİ" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 9 · Seven years? Never. Çizgi rahatlamış, yeni sakız açıyor. */
const S9: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const nv = useAt('Never.');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[480, 1050]}>
      <Sinif />
      <Cizgi
        x={380}
        y={1900}
        s={2.0}
        goz={t > nv ? 'goz-kirp' : 'mutlu'}
        agiz="sirit"
        bakis={[1, 0]}
        kolSag={[84, 130]}
        kolSol={[20, 14]}
        elSag={
          <g transform="rotate(-20)">
            <rect x={-26} y={-110} width={52} height={120} rx={8} fill="#5FC8FF" stroke={INK} strokeWidth={6} />
            <rect x={-18} y={-136} width={36} height={40} rx={6} fill={PEMBE} stroke={INK} strokeWidth={6} />
          </g>
        }
      />
      <g transform={`translate(700 600) scale(${pop(t, 0.1)}) rotate(${Math.sin(f / 8) * 3})`}>
        <Etiket x={0} y={0} size={100} renk="#fff">
          <T en="7 YEARS?" tr="7 YIL MI?" />
        </Etiket>
      </g>
      <g transform={`translate(720 780) scale(${pop(t, nv - 0.05)}) rotate(-6)`}>
        <Etiket x={0} y={0} size={150} renk="#FF5A3A">
          <T en="NEVER" tr="ASLA" />
        </Etiket>
      </g>
      <Zerre n={14} color="#fff" o={0.3} />
    </Kadraj>
  );
};

const AYAR: Parameters<typeof makeShort>[0] = {
  kod: 's18',
  words: WORDS,
  voiceLen: 19.97,
  tail: 0.7,
  baslik: ['YOU SWALLOWED', 'YOUR GUM'],
  vurgu: '#FF9CC8',
  plan: [
    { w: 'You', C: S1 },
    { w: 'They', C: S2 },
    { w: 'It', C: S3 },
    { w: 'Your', C: S4 },
    { w: 'That', C: S5 },
    { w: 'But', C: S6 },
    { w: 'Your#2', C: S7 },
    { w: 'A', C: S8 },
    { w: 'Seven', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['chomp', 'swallowed', 0, 0.22],
    ['whoosh', 'They', 0, 0.16],
    ['pop', 'seven', 0, 0.22],
    ['buzz', 'not.', 0, 0.12],
    ['tick', 'cannot', 0, 0.2],
    ['ding', 'true.', 0, 0.18],
    ['click', 'need', 0, 0.2],
    ['whoosh', 'Your#2', 0.2, 0.16],
    ['tick', 'A', 0.2, 0.2],
    ['pop', 'gone.', 0, 0.22],
    ['ding', 'Never.', 0, 0.18],
  ],
  muzik: ['music-happy', 0.06],
};
const short = makeShort(AYAR);

export const S18 = short.Comp;
export const S18_FRAMES = short.frames;

/** Türkçe sürüm (Instagram): aynı sahneler, Türkçe ses, çapalar EN kelime -> TR kelime. */
const shortTr = makeShort({
  ...AYAR,
  kod: 's18tr',
  words: WORDS_TR,
  voiceLen: 14.89,
  baslik: ["SAKIZI", "YUTARSAN?"],
  dil: 'tr',
  esle: {"You": "Sakızını", "They": "Midende", "It": "Kalmaz", "Your": "Miden", "That": "Bu", "But": "Ama", "Your#2": "Bağırsakların", "A": "Birkaç", "Seven": "Yedi", "Never.": "Asla", "gone.": "gitmiş", "need": "gerekmez", "not.": "Kalmaz", "seven": "yedi", "true.": "doğru", "swallowed": "yuttun", "cannot": "sindiremez"},
});
export const S18TR = shortTr.Comp;
export const S18TR_FRAMES = shortTr.frames;
