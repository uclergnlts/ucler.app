/**
 * S-12 "A phone fell from a plane". Dikey Short, ~22 sn.
 * Kaynak: NTSB, Alaska Airlines 1282 (5 Ocak 2024): kapı paneli ~16.000 ft'te koptu; yol kenarında çalışır
 * durumda, pili yarı dolu bir telefon bulundu. Hafif ve yassı cisimlerin limit hızı düşüktür.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const SARI = '#FFD54A';

/* ---------------- nesneler ---------------- */

/** Telefon. don: kenardan görünüm (0 = ön yüz), ekran açık/kapalı, yüz ifadesi. */
const Telefon: React.FC<{ x: number; y: number; s?: number; r?: number; don?: number; acik?: boolean; yuz?: 'korku' | 'mutlu' | 'yok'; pil?: boolean }> = ({ x, y, s = 1, r = 0, don = 0, acik = true, yuz = 'korku', pil = false }) => {
  const k = Math.max(0.07, Math.abs(Math.cos(don)));
  const on = k > 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {acik && on && <rect x={-90} y={-160} width={180} height={320} rx={40} fill="#9FE3FF" opacity={0.45} filter="url(#s-glow)" />}
      <g transform={`scale(${k} 1)`}>
        <rect x={-62} y={-118} width={124} height={236} rx={22} fill="#20243A" stroke={INK} strokeWidth={7} />
        <rect x={-52} y={-106} width={104} height={212} rx={14} fill={acik ? '#BFEFFF' : '#2C3350'} />
        {acik && <rect x={-52} y={-106} width={104} height={70} rx={14} fill="#fff" opacity={0.35} />}
        <rect x={-16} y={-100} width={32} height={8} rx={4} fill="#20243A" />
        {on && yuz !== 'yok' && (
          <g>
            <ellipse cx={-20} cy={-18} rx={10} ry={13} fill="#fff" stroke={INK} strokeWidth={3} />
            <ellipse cx={20} cy={-18} rx={10} ry={13} fill="#fff" stroke={INK} strokeWidth={3} />
            <circle cx={-19} cy={-15} r={5} fill={INK} />
            <circle cx={21} cy={-15} r={5} fill={INK} />
            {yuz === 'korku' && <ellipse cx={0} cy={22} rx={11} ry={13} fill={INK} />}
            {yuz === 'mutlu' && <path d="M-18 16 q18 18 36 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
          </g>
        )}
        {on && pil && (
          <g>
            <rect x={-34} y={40} width={60} height={30} rx={6} fill="none" stroke={INK} strokeWidth={5} />
            <rect x={28} y={48} width={7} height={14} rx={2} fill={INK} />
            <rect x={-29} y={45} width={26} height={20} rx={3} fill="#3FCB6B" />
          </g>
        )}
      </g>
    </g>
  );
};

/** Gece göğü: yıldızlar, ay, uzak bulut katmanı. */
const Gece: React.FC<{ ay?: [number, number] }> = ({ ay = [860, 520] }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="t-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1030" />
          <stop offset="0.6" stopColor="#23336E" />
          <stop offset="1" stopColor="#5B5FA8" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-500} width={2100} height={2900} fill="url(#t-gok)" />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={((i * 197) % 1500) - 200} cy={((i * 331) % 1900) - 200} r={1.5 + (i % 3)} fill="#fff" opacity={0.35 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
      ))}
      <circle cx={ay[0]} cy={ay[1]} r={150} fill="#FFF4D6" opacity={0.25} filter="url(#s-glow)" />
      <circle cx={ay[0]} cy={ay[1]} r={70} fill="#FFF4D6" />
      <circle cx={ay[0] - 20} cy={ay[1] - 14} r={14} fill="#E6D8B0" />
      <circle cx={ay[0] + 22} cy={ay[1] + 20} r={9} fill="#E6D8B0" />
    </g>
  );
};

const Bulut: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = '#C9D2F3' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={190} ry={62} fill={c} />
    <ellipse cx={-90} cy={-34} rx={90} ry={60} fill={c} />
    <ellipse cx={30} cy={-60} rx={110} ry={76} fill={c} />
    <ellipse cx={120} cy={-22} rx={80} ry={50} fill={c} />
    <ellipse cx={0} cy={22} rx={190} ry={40} fill="#8E98C8" opacity={0.5} />
  </g>
);

/** Uçak gövdesi (yandan), kapı boşluğu açık. delik: boşluk görünür. */
const Ucak: React.FC<{ x: number; y: number; s?: number; delik?: boolean }> = ({ x, y, s = 1, delik = true }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* kanat (arka) */}
      <polygon points="-40,40 -420,330 -300,340 180,70" fill="#8FA0C8" stroke={INK} strokeWidth={7} />
      <rect x={-300} y={250} width={150} height={70} rx={34} fill="#5B6487" stroke={INK} strokeWidth={7} />
      {/* gövde */}
      <path d="M-760 -40 Q-760 -120 -640 -124 H520 Q760 -110 800 0 Q760 90 520 100 H-640 Q-760 96 -760 -40 Z" fill="#E9EEF8" stroke={INK} strokeWidth={8} />
      <path d="M-760 -10 H790" stroke="#2F6BE0" strokeWidth={22} />
      <path d="M-640 100 H520 Q700 92 780 30" stroke="#B9C3DA" strokeWidth={16} fill="none" />
      {/* kuyruk */}
      <polygon points="-700,-110 -860,-330 -740,-330 -560,-120" fill="#2F6BE0" stroke={INK} strokeWidth={8} />
      {/* kokpit camı */}
      <path d="M600 -92 q90 6 130 50 h-130 z" fill="#20243A" />
      {/* pencereler */}
      {Array.from({ length: 13 }, (_, i) => {
        const wx = -560 + i * 84;
        if (delik && (i === 7 || i === 8)) return null;
        return <rect key={i} x={wx} y={-84} width={44} height={56} rx={18} fill={(i * 3) % 4 ? '#FFE9A8' : '#3A4266'} stroke={INK} strokeWidth={5} />;
      })}
      {/* kopan panelin boşluğu */}
      {delik && (
        <g>
          <rect x={10} y={-110} width={170} height={196} rx={26} fill="#151A30" stroke={INK} strokeWidth={8} />
          <rect x={10} y={-110} width={170} height={196} rx={26} fill="#FFB25C" opacity={0.18} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${190 + ((f * 9 + i * 60) % 220)} ${-70 + i * 44} h70`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
          ))}
        </g>
      )}
      {/* seyir ışığı */}
      <circle cx={-420} cy={330} r={12} fill="#FF4040" opacity={f % 30 < 15 ? 1 : 0.25} />
    </g>
  );
};

/** Hız göstergesi. */
const Ibre: React.FC<{ x: number; y: number; v: number; s?: number }> = ({ x, y, v, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={200} fill="#12172B" stroke="#C9D2E3" strokeWidth={14} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d="M0 -176 v30" stroke={i > 5 ? '#FF5A3A' : '#C9D2E3'} strokeWidth={9} transform={`rotate(${-120 + i * 30})`} />
    ))}
    <path d="M0 0 V-150" stroke="#FF5A3A" strokeWidth={13} strokeLinecap="round" transform={`rotate(${-120 + v * 240})`} />
    <circle r={22} fill="#FF5A3A" />
  </g>
);

/** Yol kenarı: gece, sokak lambası, çalılar, asfalt. */
const YolKenari: React.FC = () => (
  <g>
    <Gece ay={[240, 560]} />
    {/* uzak ağaç silueti */}
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i} transform={`translate(${-80 + i * 150} 1180)`}>
        <rect x={-10} y={-40} width={20} height={80} fill="#141B33" />
        <polygon points={`0,${-260 - ((i * 53) % 90)} 80,-30 -80,-30`} fill="#18223F" />
      </g>
    ))}
    {/* zemin */}
    <rect x={-300} y={1200} width={1700} height={1100} fill="#1E2A2A" />
    <polygon points="-300,1900 1400,1560 1400,2300 -300,2300" fill="#2A2D3D" />
    <path d="M-300 1900 L1400 1560" stroke="#7A7F99" strokeWidth={10} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${-100 + i * 380} ${2010 - i * 76} l180 -36`} stroke="#E8E3F0" strokeWidth={14} opacity={0.6} />
    ))}
    {/* sokak lambası */}
    <path d="M930 1640 V760 q0 -50 -70 -50 h-90" stroke="#10142A" strokeWidth={16} fill="none" />
    <circle cx={770} cy={726} r={22} fill="#FFE9B8" />
    <polygon points="740,740 800,740 1010,1620 420,1620" fill="url(#s-cone)" opacity={0.5} />
    {/* arka çalılar */}
    {[120, 930].map((bx, i) => (
      <g key={i} transform={`translate(${bx} 1560)`}>
        <ellipse cx={0} cy={0} rx={190} ry={110} fill="#1F4A36" />
        <ellipse cx={-70} cy={-60} rx={100} ry={80} fill="#245A40" />
        <ellipse cx={70} cy={-50} rx={110} ry={86} fill="#245A40" />
      </g>
    ))}
  </g>
);

/** Öndeki büyük çalı. */
const Cali: React.FC<{ x: number; y: number; s?: number; sars?: number }> = ({ x, y, s = 1, sars = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + sars * 0.06)} ${s * (1 - sars * 0.08)})`}>
    <ellipse cx={0} cy={10} rx={330} ry={170} fill="#1F5A3C" stroke={INK} strokeWidth={8} />
    <ellipse cx={-150} cy={-90} rx={150} ry={120} fill="#2C7A4E" stroke={INK} strokeWidth={8} />
    <ellipse cx={130} cy={-100} rx={170} ry={130} fill="#2C7A4E" stroke={INK} strokeWidth={8} />
    <ellipse cx={-10} cy={-150} rx={150} ry={110} fill="#38935E" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 12 }, (_, i) => (
      <ellipse key={i} cx={-240 + i * 44} cy={-60 + ((i * 37) % 120)} rx={22} ry={12} fill="#4FB877" opacity={0.7} transform={`rotate(${(i * 40) % 90} ${-240 + i * 44} ${-60 + ((i * 37) % 120)})`} />
    ))}
  </g>
);

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

/* ---------------- çekimler ---------------- */

/** 1 · A phone fell out of a plane. (loop karesi) */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const d = ap(t, 0, 2.4, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 900]}>
      <Gece ay={[900, 520]} />
      <Bulut x={200 - f * 1.2} y={1500} s={1.6} o={0.9} />
      <Bulut x={980 - f * 0.8} y={1330} s={1.2} o={0.6} />
      <Bulut x={520 - f * 1.6} y={1760} s={2.1} />
      <Ucak x={470} y={640} s={0.86} />
      {/* delikten bakan Çizgi */}
      <g transform="translate(560 640)">
        <clipPath id="t-kapi">
          <rect x={-74} y={-92} width={140} height={166} rx={22} />
        </clipPath>
        <g clipPath="url(#t-kapi)">
          <Cizgi x={-4} y={292} s={0.56} goz="sok" agiz="o" kas="kalkik" kolSag={[150, 20]} golge={false} nefes={false} />
        </g>
      </g>
      <Telefon x={lerp(690, 760, d) + Math.sin(f / 6) * 14} y={lerp(790, 1180, d)} s={lerp(1.0, 1.5, d)} r={f * 7} don={f / 9} yuz="korku" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${700 + i * 30} ${lerp(700, 1000, d) - i * 50} v-90`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
      ))}
    </Kadraj>
  );
};

/** 2 · Sixteen thousand feet. Bulutların arasında düşüş + yükseklik ölçeği. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.05, 1.0]} origin={[540, 960]}>
      <Gece ay={[180, 600]} />
      {Array.from({ length: 7 }, (_, i) => (
        <Bulut key={i} x={((i * 311) % 1100) + 20} y={2200 - ((f * (9 + (i % 3) * 3) + i * 330) % 2600)} s={0.9 + (i % 3) * 0.4} o={0.55 + (i % 2) * 0.35} />
      ))}
      <Telefon x={430 + Math.sin(f / 7) * 50} y={900 + Math.sin(f / 5) * 26} s={1.9} r={Math.sin(f / 8) * 50 + f * 3} don={f / 7} yuz="korku" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${330 + i * 70} ${660 - ((f * 14 + i * 50) % 200)} v-110`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
      ))}
      <g opacity={ap(t, 0.05, 0.3)}>
        <path d="M900 470 V1330" stroke="#fff" strokeWidth={7} strokeDasharray="22 16" />
        <path d="M878 494 l22 -28 l22 28 M878 1306 l22 28 l22 -28" stroke="#fff" strokeWidth={7} fill="none" />
        <g transform={`translate(860 1010) scale(${pop(t, 0.1)})`}>
          <Etiket x={0} y={0} size={104} anchor="end">16,000 ft</Etiket>
          <Etiket x={0} y={84} size={58} anchor="end" renk="#fff">4,900 m</Etiket>
        </g>
      </g>
    </Kadraj>
  );
};

/** 3 · It still worked. Dev telefon, ekran yanar, tik. */
const S3: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const w = useAt('worked.');
  const on = t > w - 0.15;
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 900]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#10142A" />
      <circle cx={540} cy={900} r={520} fill={on ? '#5FD0FF' : '#2F6BE0'} opacity={on ? 0.3 : 0.12} filter="url(#s-glow)" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M0 -470 v-120" stroke="#9FE3FF" strokeWidth={12} strokeLinecap="round" opacity={on ? 0.5 : 0} transform={`translate(540 900) rotate(${i * 30 + f / 3})`} />
      ))}
      <Telefon x={540} y={900 + Math.sin(f / 9) * 10} s={3.3} r={-6} acik={on} yuz={on ? 'mutlu' : 'yok'} />
      <g transform={`translate(820 560) scale(${pop(t, w)})`}>
        <circle r={100} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
        <path d="M-46 4 l32 34 l62 -70" stroke="#fff" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Zerre n={26} color="#BFEFFF" o={0.4} />
    </Kadraj>
  );
};

/** 4 · January twenty twenty-four. Uçak gece dağların üstünde, tarih. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Gece ay={[840, 560]} />
      <Bulut x={300 - f * 2} y={1090} s={1.3} o={0.6} />
      <Bulut x={900 - f * 3} y={1210} s={1.7} o={0.85} />
      <Ucak x={lerp(200, 620, ap(t, 0, 2.4, (x) => x))} y={lerp(900, 800, ap(t, 0, 2.4, (x) => x))} s={0.5} delik={false} />
      {/* dağlar ve şehir ışıkları */}
      <polygon points="-300,1700 120,1250 380,1560 640,1180 960,1600 1400,1300 1400,2300 -300,2300" fill="#141B3C" />
      <polygon points="120,1250 190,1326 150,1340 100,1310 M640,1180 720,1290 660,1284 600,1250" fill="#E9EEF8" opacity={0.8} />
      <rect x={-300} y={1640} width={1700} height={700} fill="#0E1330" />
      {Array.from({ length: 60 }, (_, i) => (
        <rect key={i} x={((i * 173) % 1200) - 60} y={1670 + ((i * 59) % 220)} width={10} height={8} fill="#FFC65A" opacity={0.35 + 0.5 * Math.abs(Math.sin(f / 15 + i))} />
      ))}
      <g transform={`translate(540 540) scale(${pop(t, 0.05)})`}>
        <Etiket x={0} y={0} size={96} renk="#fff">JANUARY</Etiket>
        <Etiket x={0} y={150} size={170}>2024</Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · A door panel blew off mid-flight. Panel kopup uçar. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const b = useAt('blew');
  const u = ap(t, b, 1.2);
  return (
    <Kadraj zoom={[1.25, 1.35]} origin={[620, 900]} shakeAt={[b]} shake={26}>
      <Gece ay={[160, 600]} />
      <Bulut x={300 - f * 5} y={1460} s={1.8} o={0.85} />
      <Bulut x={1000 - f * 4} y={1250} s={1.2} o={0.6} />
      <Ucak x={520} y={860} s={1.0} delik={t > b} />
      {/* kopan panel */}
      {t > b && (
        <g transform={`translate(${lerp(615, 1230, u)} ${lerp(848, 1120, u)}) rotate(${u * 300})`}>
          <rect x={-85} y={-98} width={170} height={196} rx={26} fill="#E9EEF8" stroke={INK} strokeWidth={8} />
          <rect x={-22} y={-60} width={44} height={56} rx={18} fill="#FFE9A8" stroke={INK} strokeWidth={5} />
          <path d="M-85 14 H85" stroke="#2F6BE0" strokeWidth={22} />
        </g>
      )}
      {t > b &&
        Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={640 + ((f * (8 + i) + i * 40) % 520)} y={800 + i * 26 + Math.sin(f / 4 + i) * 20} width={30} height={22} fill="#fff" opacity={0.8} transform={`rotate(${f * 9 + i * 40} ${640 + ((f * (8 + i) + i * 40) % 520)} ${800 + i * 26})`} />
        ))}
      <g transform={`translate(620 860) scale(${pop(t, b)})`} opacity={1 - ap(t, b + 0.25, 0.4)}>
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d="M0 -130 v-90" stroke={SARI} strokeWidth={14} strokeLinecap="round" transform={`rotate(${i * 36})`} />
        ))}
      </g>
    </Kadraj>
  );
};

/** 6 · and a phone got sucked out. Kabin içi: her şey boşluğa doğru uçar. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sk = useAt('sucked');
  const u = ap(t, sk - 0.25, 0.9);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[300, 900]} shakeAt={[0]} shake={10}>
      {/* kabin */}
      <rect x={-300} y={-300} width={1700} height={2500} fill="#39415F" />
      <path d="M-300 420 Q540 300 1400 420 V-300 H-300 Z" fill="#535C80" />
      <rect x={-300} y={1500} width={1700} height={900} fill="#232842" />
      {/* tavan bagaj rafları + ışıklar */}
      <path d="M-300 520 Q540 420 1400 520 v70 Q540 500 -300 590 Z" fill="#6C7699" stroke={INK} strokeWidth={6} />
      {[240, 520, 800].map((lx, i) => (
        <circle key={i} cx={lx} cy={560} r={14} fill="#FFE9A8" opacity={f % 9 < 5 ? 0.9 : 0.3} />
      ))}
      {/* sol duvar: pencereler ve kopan panelin boşluğu */}
      <rect x={-300} y={590} width={420} height={910} fill="#4A5378" />
      <rect x={-40} y={640} width={90} height={120} rx={36} fill="#151A30" stroke={INK} strokeWidth={6} />
      <rect x={-140} y={800} width={250} height={520} rx={30} fill="#0B1030" stroke={INK} strokeWidth={10} />
      <circle cx={-20} cy={930} r={30} fill="#FFF4D6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={-110 + i * 46} cy={1020 + ((i * 71) % 220)} r={3} fill="#fff" />
      ))}
      {/* oksijen maskeleri */}
      {[330, 560, 800, 980].map((mx, i) => (
        <g key={i} transform={`translate(${mx} 590) rotate(${28 + Math.sin(f / 5 + i) * 10})`}>
          <path d="M0 0 V190" stroke="#E9EEF8" strokeWidth={5} />
          <path d="M-24 190 h48 l-8 44 h-32 z" fill="#FFD54A" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      {/* koltuk sıraları */}
      {[0, 1].map((r) => (
        <g key={r} transform={`translate(${420 + r * 400} ${1560 + r * 40})`}>
          <rect x={-150} y={-420} width={300} height={440} rx={50} fill="#2F6BE0" stroke={INK} strokeWidth={8} />
          <rect x={-110} y={-470} width={220} height={110} rx={36} fill="#3F7BF0" stroke={INK} strokeWidth={8} />
          <rect x={-180} y={-120} width={50} height={160} rx={18} fill="#20243A" />
          <rect x={130} y={-120} width={50} height={160} rx={18} fill="#20243A" />
        </g>
      ))}
      {/* Çizgi koltukta, kolçağa tutunmuş */}
      <Cizgi x={430} y={1640} s={1.05} oturan goz="sok" agiz="kocaman" kas="kalkik" egim={-12} kolSol={[120, 30]} kolSag={[40, 60]} golge={false} />
      {/* uçuşan kâğıtlar, bardak */}
      {Array.from({ length: 10 }, (_, i) => {
        const px = 1100 - ((f * (10 + i * 2) + i * 130) % 1200);
        const py = 760 + ((i * 97) % 500) + Math.sin(f / 4 + i) * 24 - (1100 - px) * 0.05;
        return <rect key={i} x={px} y={py} width={44} height={56} fill="#fff" stroke={INK} strokeWidth={3} opacity={0.9} transform={`rotate(${f * 8 + i * 50} ${px + 22} ${py + 28})`} />;
      })}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${900 - ((f * 22 + i * 190) % 900)} ${840 + i * 100} h-150`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
      ))}
      {/* telefon elden kayıp boşluğa gider */}
      <Telefon x={lerp(590, -10, u)} y={lerp(1150, 1050, u) - Math.sin(u * Math.PI) * 120} s={lerp(1.1, 0.5, u)} r={u * 540} yuz="korku" />
    </Kadraj>
  );
};

/** 7 · But a phone is light and flat. Terazi: telefon tüy kadar; yandan incecik. */
const S7: React.FC = () => {
  const t = useTt();
  const fl = useAt('flat.');
  const don = ap(t, fl - 0.5, 0.5) * (Math.PI / 2);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 900]}>
      <Gece ay={[900, 1700]} />
      <rect x={-300} y={-300} width={1700} height={2500} fill="#10142A" opacity={0.55} />
      <circle cx={540} cy={860} r={470} fill="#FFB25C" opacity={0.22} filter="url(#s-glow)" />
      <Telefon x={540} y={840} s={3.0} don={don} yuz="mutlu" />
      <g opacity={ap(t, 0.5, 0.3) * (1 - ap(t, fl - 0.5, 0.2))}>
        <Etiket x={860} y={620} size={96}>170 g</Etiket>
        <path d="M770 650 L650 720" stroke={SARI} strokeWidth={8} strokeLinecap="round" />
      </g>
      <g opacity={ap(t, fl - 0.05, 0.25)}>
        <path d="M430 1230 H650" stroke={SARI} strokeWidth={8} />
        <path d="M430 1210 v40 M650 1210 v40" stroke={SARI} strokeWidth={8} />
        <Etiket x={540} y={1340} size={96}>8 mm</Etiket>
      </g>
      {/* tüy */}
      <g transform={`translate(${200 + Math.sin(t * 2) * 30} ${1120 + t * 30}) rotate(${20 + Math.sin(t * 3) * 14})`} opacity={ap(t, 0.5, 0.3)}>
        <path d="M0 -120 Q70 -40 0 120 Q-70 -40 0 -120 Z" fill="#E9EEF8" stroke={INK} strokeWidth={6} />
        <path d="M0 -110 V150" stroke="#8E98C8" strokeWidth={6} />
      </g>
    </Kadraj>
  );
};

/** 8 · Air stops it speeding up. Hava okları alttan iter, ibre takılır. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const v = Math.min(0.42, ap(t, 0, 0.9) * 0.42) + (t > 0.9 ? Math.sin(f / 2) * 0.008 : 0);
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Gece ay={[900, 560]} />
      {Array.from({ length: 5 }, (_, i) => (
        <Bulut key={i} x={((i * 277) % 1000) + 60} y={2100 - ((f * (7 + i * 2) + i * 420) % 2500)} s={0.8 + (i % 3) * 0.3} o={0.45} />
      ))}
      <Telefon x={380 + Math.sin(f / 8) * 46} y={800 + Math.sin(f / 5) * 18} s={2.0} r={84 + Math.sin(f / 8) * 16} yuz="mutlu" />
      {/* yukarı iten hava okları */}
      {[0, 1, 2, 3].map((i) => {
        const ay = 1180 - ((f * 7 + i * 40) % 130);
        return (
          <g key={i} transform={`translate(${190 + i * 126} ${ay})`} opacity={0.9}>
            <path d="M0 110 V0" stroke="#8FD3FF" strokeWidth={18} strokeLinecap="round" />
            <path d="M-30 34 L0 0 L30 34" stroke="#8FD3FF" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      <Ibre x={800} y={1090} v={v} s={0.9} />
      <g opacity={ap(t, 0.9, 0.2)}>
        <Etiket x={800} y={860} size={84} renk="#FF8A5A">MAX</Etiket>
      </g>
    </Kadraj>
  );
};

/** 9 · It landed in a bush. Telefon çalıya düşer, yapraklar saçılır. */
const S9: React.FC = () => {
  const t = useTt();
  const b = useAt('bush.');
  const hit = b - 0.1;
  const u = ap(t, 0, hit, (x) => x);
  const inB = t > hit;
  const sars = inB ? Math.exp(-(t - hit) * 5) * Math.sin((t - hit) * 30) : 0;
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1100]} shakeAt={[hit]} shake={8}>
      <YolKenari />
      {!inB && <Telefon x={lerp(430, 520, u)} y={lerp(240, 1110, u)} s={1.1} r={84 + u * 200} yuz="korku" />}
      <Cali x={520} y={1330} s={1.0} sars={sars} />
      {inB &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const q = ap(t, hit, 0.7);
          return <ellipse key={i} cx={520 + Math.cos(a) * 330 * q} cy={1180 - Math.abs(Math.sin(a)) * 330 * q + q * q * 200} rx={24} ry={12} fill="#4FB877" stroke={INK} strokeWidth={3} opacity={1 - q} transform={`rotate(${i * 50 + q * 200} ${520 + Math.cos(a) * 330 * q} ${1180 - Math.abs(Math.sin(a)) * 330 * q + q * q * 200})`} />;
        })}
      {inB && <rect x={470} y={1090} width={100} height={150} rx={30} fill="#9FE3FF" opacity={0.5 * ap(t, hit + 0.3, 0.3)} filter="url(#s-glow)" />}
    </Kadraj>
  );
};

/** 10 · Screen on. Çizgi telefonu çalıdan alır, ekran yüzünü aydınlatır. */
const S10: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.1, 1.2]} origin={[540, 1000]}>
      <YolKenari />
      <Cali x={170} y={1420} s={0.8} />
      <circle cx={600} cy={980} r={330} fill="#9FE3FF" opacity={0.28 + Math.sin(f / 6) * 0.03} filter="url(#s-glow)" />
      <Cizgi x={470} y={1900} s={1.75} goz="sok" agiz="kocaman" kas="kalkik" bakis={[1, 0]} kolSag={[96, 78]} kolSol={[14, 10]} isik={0.4} />
      <Telefon x={770} y={lerp(1080, 1010, pop(t, 0))} s={1.5} r={8} yuz="mutlu" />
    </Kadraj>
  );
};

/** 11 · Battery half full. Ekran yakın çekim: pil %50. */
const S11b: React.FC = () => {
  const t = useTt();
  const h = useAt('half');
  const dol = ap(t, h - 0.1, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 900]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#0E1330" />
      <rect x={130} y={380} width={820} height={1500} rx={90} fill="#20243A" stroke={INK} strokeWidth={14} />
      <rect x={170} y={430} width={740} height={1500} rx={60} fill="#BFEFFF" />
      <rect x={170} y={430} width={740} height={300} rx={60} fill="#fff" opacity={0.3} />
      <circle cx={540} cy={900} r={420} fill="#fff" opacity={0.25} filter="url(#s-glow)" />
      {/* pil */}
      <g transform="translate(540 920)">
        <rect x={-250} y={-130} width={470} height={260} rx={44} fill="#fff" stroke={INK} strokeWidth={16} />
        <rect x={228} y={-56} width={50} height={112} rx={16} fill={INK} />
        <rect x={-222} y={-102} width={lerp(0, 207, dol)} height={204} rx={24} fill="#3FCB6B" />
        <g transform={`scale(${pop(t, h)})`}>
          <Etiket x={-10} y={50} size={150} renk="#fff">50%</Etiket>
        </g>
      </g>
      <Zerre n={18} color="#fff" o={0.35} />
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's12',
  words: WORDS,
  voiceLen: 21.16,
  tail: 0.7,
  baslik: ['PHONE FELL', 'FROM A PLANE'],
  vurgu: '#6FD3FF',
  plan: [
    { w: 'A', C: S1 },
    { w: '16,000', C: S2 },
    { w: 'It', C: S3 },
    { w: 'January', C: S4 },
    { w: 'A#2', C: S5 },
    { w: 'and', C: S6 },
    { w: 'But', C: S7 },
    { w: 'Air', C: S8 },
    { w: 'It#2', C: S9 },
    { w: 'Screen', C: S10 },
    { w: 'Battery', C: S11b },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['whoosh', 'A', 0.05, 0.22],
    ['riser', '16,000', 0, 0.14],
    ['ding', 'worked.', 0, 0.2],
    ['impact', 'blew', 0, 0.22],
    ['whoosh', 'sucked', -0.2, 0.22],
    ['tick', 'flat.', 0, 0.2],
    ['buzz', 'stops', 0, 0.1],
    ['pop', 'bush.', -0.1, 0.25],
    ['click', 'Screen', 0.1, 0.25],
    ['ding', 'half', 0.1, 0.18],
  ],
  muzik: ['music-happy', 0.06],
});

export const S12 = short.Comp;
export const S12_FRAMES = short.frames;
