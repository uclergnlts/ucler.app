/**
 * S-05 "The coin from the skyscraper". Dikey Short, ~19 sn.
 * Kaynak: Scientific American / LiveScience, Louis Bloomfield (Univ. of Virginia): madeni para ~15 m'de limit hıza
 * ulaşır, ~40 km/sa ile yaprak gibi salınarak düşer; çarptığında alna fiske gibi. Empire State çatısı 381 m.
 */
import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const COPPER = '#D98A4E';

/* ---------------- nesneler ---------------- */

/** Bozuk para: dönme açısı (kenardan görünüm için scaleY), yüz ifadesi. */
const Para: React.FC<{ x: number; y: number; s?: number; don?: number; r?: number; yuz?: 'korku' | 'mutlu' | 'sinsi' | 'yok' }> = ({ x, y, s = 1, don = 0, r = 0, yuz = 'korku' }) => {
  const k = Math.cos(don);
  const kk = Math.max(0.08, Math.abs(k));
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g transform={`scale(1 ${kk})`}>
        <ellipse cx={0} cy={10} rx={60} ry={60} fill="#8C4E24" />
        <circle r={60} fill={COPPER} stroke={INK} strokeWidth={6 / kk > 30 ? 30 : 6} />
        <circle r={46} fill="none" stroke="#B86A34" strokeWidth={5} />
        <path d="M-30 -30 q20 -16 46 -6" stroke="#FFD2A8" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
        {yuz !== 'yok' && k > 0.35 && (
          <g>
            <ellipse cx={-18} cy={-6} rx={9} ry={12} fill="#fff" stroke={INK} strokeWidth={3} />
            <ellipse cx={18} cy={-6} rx={9} ry={12} fill="#fff" stroke={INK} strokeWidth={3} />
            <circle cx={-17} cy={-4} r={4} fill={INK} />
            <circle cx={19} cy={-4} r={4} fill={INK} />
            {yuz === 'korku' && <ellipse cx={0} cy={22} rx={9} ry={10} fill={INK} />}
            {yuz === 'mutlu' && <path d="M-14 18 q14 12 28 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />}
            {yuz === 'sinsi' && <path d="M-14 22 q14 -6 28 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />}
          </g>
        )}
      </g>
    </g>
  );
};

/** Yaprak. */
const Yaprak: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 -70 Q60 -20 0 70 Q-60 -20 0 -70 Z" fill="#E08A2E" stroke={INK} strokeWidth={5} />
    <path d="M0 -60 V70" stroke="#A85A1A" strokeWidth={4} />
    <path d="M0 -20 l22 -16 M0 10 l-24 -16 M0 34 l20 -14" stroke="#A85A1A" strokeWidth={3} />
  </g>
);

/** Gün batımı şehir gökyüzü. */
const Gok: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="c-gok" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#24305E" />
        <stop offset="0.6" stopColor="#B4607A" />
        <stop offset="1" stopColor="#FFB070" />
      </linearGradient>
    </defs>
    <rect x={-500} y={-500} width={2100} height={2900} fill="url(#c-gok)" />
  </g>
);

/** Yukarıdan aşağı bakış: gökdelen cephesi aşağıda bir noktaya kaçar, en altta sokak. */
const AsagiBakis: React.FC = () => {
  const f = useCurrentFrame();
  const vx = 540;
  const vy = 2050;
  return (
    <g>
      <rect x={-500} y={-500} width={2100} height={2900} fill="#2B2440" />
      {/* sokak (en dipte) */}
      <ellipse cx={vx} cy={vy} rx={260} ry={120} fill="#3D3550" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={vx - 200 + i * 70} y={vy - 20} width={30} height={8} fill="#FFC65A" opacity={0.8} />
      ))}
      <circle cx={vx + ((f * 2) % 300) - 150} cy={vy + 10} r={6} fill="#FF5A5A" />
      {/* cephe: iki yan duvar perspektif */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <polygon points={`${side < 0 ? -100 : 1180},-200 ${vx + side * 160},${vy - 60} ${vx + side * 90},${vy - 60} ${side < 0 ? 320 : 760},-200`} fill={side < 0 ? '#4A5378' : '#3A4266'} />
          {Array.from({ length: 16 }, (_, i) => {
            const u = i / 16;
            const u2 = (i + 0.6) / 16;
            const e = (q: number) => Math.pow(q, 0.55);
            const yA = lerp(-200, vy - 60, e(u));
            const yB = lerp(-200, vy - 60, e(u2));
            const xo = (q: number) => lerp(side < 0 ? -100 : 1180, vx + side * 160, e(q));
            const xi = (q: number) => lerp(side < 0 ? 320 : 760, vx + side * 90, e(q));
            const lit = (i * 7 + (side + 1)) % 3 !== 0;
            return <polygon key={i} points={`${xo(u)},${yA} ${xi(u)},${yA} ${xi(u2)},${yB} ${xo(u2)},${yB}`} fill={lit ? '#FFC65A' : '#262B45'} opacity={lit ? 0.55 : 0.8} />;
          })}
        </g>
      ))}
      {/* çatı kenarı (ön plan) */}
      <rect x={-200} y={1700} width={1500} height={600} fill="#1B1F33" />
      <rect x={-200} y={1690} width={1500} height={24} fill="#5B6487" />
    </g>
  );
};

/** Sokak seviyesi: yukarı bakış, gökdelen yükselir. */
const Sokak: React.FC<{ bas?: number }> = ({ bas = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Gok />
      {/* arka binalar */}
      {Array.from({ length: 8 }, (_, i) => {
        const h = 500 + ((i * 131) % 500);
        return <rect key={i} x={-100 + i * 170} y={1500 - h} width={150} height={h} fill="#3A3458" opacity={0.85} />;
      })}
      {/* dev gökdelen (perspektifle yukarı daralır) */}
      <polygon points="300,1500 780,1500 640,-300 440,-300" fill="#4A5378" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 30 }, (_, i) => {
        const y = 1460 - i * 60;
        const w = lerp(440, 190, (1500 - y) / 1800);
        return Array.from({ length: 5 }, (_, j) => (
          <rect key={`${i}-${j}`} x={540 - w / 2 + 14 + j * (w / 5)} y={y} width={w / 5 - 20} height={34} fill={(i + j) % 3 ? '#FFC65A' : '#262B45'} opacity={0.75} />
        ));
      })}
      <path d="M540 -300 V-420" stroke="#C9D2E3" strokeWidth={10} />
      <circle cx={540} cy={-420} r={10} fill="#FF4040" opacity={f % 30 < 15 ? 1 : 0.3} />
      {/* kaldırım */}
      <rect x={-300} y={1500} width={1700} height={900} fill="#3D3550" />
      <rect x={-300} y={1500} width={1700} height={20} fill="#7A7094" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={-100 + i * 240} y={1700} width={140} height={14} fill="#E8E3F0" opacity={0.6} />
      ))}
      {/* sokak lambası */}
      <path d="M120 1500 V900 q0 -40 60 -40 h60" stroke="#20243A" strokeWidth={14} fill="none" />
      <circle cx={250} cy={880} r={20} fill="#FFE9B8" />
      <circle cx={250} cy={880} r={120} fill="#FFE9B8" opacity={0.3} filter="url(#s-glow)" />
    </g>
  );
};

/** Hız göstergesi (km/sa). */
const Gosterge: React.FC<{ x: number; y: number; v: number; esne?: boolean }> = ({ x, y, v, esne }) => {
  const a = -120 + (v / 80) * 240;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={230} fill="#1B1F33" stroke="#C9D2E3" strokeWidth={14} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`rotate(${-120 + i * 30})`}>
          <path d="M0 -200 v30" stroke="#C9D2E3" strokeWidth={8} />
          <text x={0} y={-140} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={32} fill="#C9D2E3" transform={`rotate(${120 - i * 30} 0 -150)`}>
            {i * 10}
          </text>
        </g>
      ))}
      <path d="M0 0 V-170" stroke="#FF5A3A" strokeWidth={12} strokeLinecap="round" transform={`rotate(${a})`} />
      <circle r={22} fill="#FF5A3A" />
      <text x={0} y={120} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={56} fill="#fff">
        {Math.round(v)} km/h
      </text>
      {esne && <ellipse cx={0} cy={60} rx={30} ry={22} fill="#5A2230" />}
    </g>
  );
};

/** Pencereden bakan komşu. */
const Komsu: React.FC<{ x: number; y: number; tip: number; faz?: number }> = ({ x, y, tip, faz = 0 }) => {
  const f = useCurrentFrame() + faz;
  const ten = ['#E8C3A0', '#C68E62', '#F2D3B3', '#9C6B48'][tip % 4];
  const sac = ['#3A2A20', '#8C8C8C', '#C9A24A', '#1E1E1E'][tip % 4];
  const nod = Math.sin(f / 4) * 8;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-110} y={-130} width={220} height={190} fill="#FFC65A" stroke={INK} strokeWidth={8} />
      <rect x={-110} y={-130} width={220} height={190} fill="#7A4A2A" opacity={0.25} />
      <g transform={`translate(0 ${-30 + nod})`}>
        <circle r={56} fill={ten} />
        <path d="M-56 -8 q0 -56 56 -56 q56 0 56 56 q-24 -30 -56 -30 q-32 0 -56 30 z" fill={sac} />
        <circle cx={-18} cy={6} r={6} fill={INK} />
        <circle cx={18} cy={6} r={6} fill={INK} />
        <ellipse cx={0} cy={30} rx={12} ry={9} fill="#5A2230" />
      </g>
      <rect x={-130} y={50} width={260} height={24} fill="#5B6487" stroke={INK} strokeWidth={6} />
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/** 1 · This coin is falling 380 meters. (loop) */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 1100]}>
      <AsagiBakis />
      <Para x={540 + Math.sin(f / 7) * 40} y={lerp(820, 1000, ap(t, 0, 2.6))} s={1.5} don={f / 6} r={Math.sin(f / 9) * 20} yuz="korku" />
      {/* dipteki minik Çizgi */}
      <Cizgi x={560} y={2010} s={0.08} golge={false} nefes={false} />
      <g opacity={ap(t, 0.8, 0.4)}>
        <path d="M900 700 V1900" stroke="#fff" strokeWidth={6} strokeDasharray="20 16" />
        <path d="M880 720 l20 -26 l20 26 M880 1880 l20 26 l20 -26" stroke="#fff" strokeWidth={6} fill="none" />
        <text x={870} y={1290} textAnchor="end" fontFamily={fontFamily} fontWeight={800} fontSize={86} fill="#FFD54A" stroke={INK} strokeWidth={8} paintOrder="stroke">
          380 m
        </text>
      </g>
      {/* ön planda çatı korkuluğu */}
      <rect x={-200} y={1820} width={1500} height={40} fill="#20243A" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-60 + i * 130} y={1700} width={18} height={140} fill="#20243A" />
      ))}
    </Kadraj>
  );
};

/** 2 · Will it kill him? Çizgi yukarı bakar, ter damlası. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.15, 1.25]} origin={[540, 1300]}>
      <Sokak />
      <Para x={560} y={200 + t * 30} s={0.25} don={t * 9} yuz="yok" />
      <Cizgi x={540} y={1640} s={1.3} goz="yukari" agiz="o" kas="uzgun" bakis={[0, -1]} bas={-8} kolSol={[10, 10]} kolSag={[10, 10]} />
      <g transform={`translate(640 ${770 + ((t * 140) % 100)})`}>
        <path d="M0 -40 q-24 34 -24 52 a24 24 0 0 0 48 0 q0 -18 -24 -52 z" fill="#8FD3FF" stroke={INK} strokeWidth={5} />
      </g>
    </Kadraj>
  );
};

/** 3 · Everyone says yes. Pencerelerden komşular başını sallar. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.05, 1.0]} origin={[540, 1000]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#4A5378" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => {
          const k = r * 3 + c;
          const p = pop(t, 0.05 + k * 0.06);
          return (
            <g key={k} transform={`translate(${200 + c * 340} ${560 + r * 300}) scale(${p})`}>
              <Komsu x={0} y={0} tip={k} faz={k * 9} />
            </g>
          );
        }),
      )}
    </Kadraj>
  );
};

/** 4 · but a coin is flat. Para döner, kenardan incecik görünür. */
const S4: React.FC = () => {
  const t = useTt();
  const flat = useAt('flat.');
  const don = interpolate(t, [0, flat], [0, Math.PI / 2], clamp);
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1000]}>
      <Gok />
      <rect x={-300} y={-300} width={1700} height={2500} fill="#1B1F33" opacity={0.55} />
      <circle cx={540} cy={1000} r={460} fill="#FFB070" opacity={0.25} filter="url(#s-glow)" />
      <Para x={540} y={1000} s={4.2} don={don} yuz="sinsi" />
      <g opacity={ap(t, flat - 0.1, 0.3)}>
        <path d="M260 1120 h560" stroke="#FFD54A" strokeWidth={6} />
        <text x={540} y={1210} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={60} fill="#FFD54A" stroke={INK} strokeWidth={6} paintOrder="stroke">
          1.5 mm
        </text>
      </g>
    </Kadraj>
  );
};

/** 5 · It flips and flutters like a leaf. Para ve yaprak yan yana salınır. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const leaf = useAt('leaf.');
  const ly = ap(t, leaf - 0.6, 0.4);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Gok />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${((i * 173 + f * 3) % 1400) - 200} ${400 + i * 160} q60 -20 120 0 t120 0`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.35} strokeLinecap="round" />
      ))}
      <Para x={400 + Math.sin(f / 9) * 140} y={700 + Math.sin(f / 4.5) * 50 + t * 40} s={1.6} don={Math.sin(f / 6) * 2.4} r={Math.sin(f / 9) * 35} yuz="mutlu" />
      <g opacity={ly}>
        <Yaprak x={720 + Math.sin(f / 9 + 1) * 140} y={720 + Math.sin(f / 4.5 + 1) * 50 + t * 40} s={1.6} r={Math.sin(f / 9 + 1) * 35} />
      </g>
      <Zerre n={24} color="#FFE2A8" o={0.35} />
    </Kadraj>
  );
};

/** 6 · After about 15 meters... yan kesit, işaret çizgisi + hız artışı. */
const S6: React.FC = () => {
  const t = useTt();
  const m15 = useAt('15');
  const u = ap(t, 0, 1.4);
  const y = lerp(490, 820, u);
  return (
    <Kadraj zoom={[1.0, 1.05]} origin={[540, 900]}>
      <Gok />
      <rect x={60} y={440} width={330} height={2000} fill="#4A5378" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 20 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => <rect key={`${i}-${j}`} x={90 + j * 100} y={480 + i * 90} width={70} height={50} fill={(i + j) % 3 ? '#FFC65A' : '#262B45'} opacity={0.7} />),
      )}
      <path d="M390 440 H1100" stroke="#fff" strokeWidth={5} strokeDasharray="16 12" />
      <path d="M390 820 H1100" stroke="#FFD54A" strokeWidth={6} strokeDasharray="16 12" opacity={ap(t, m15 - 0.1, 0.3)} />
      <text x={1040} y={800} textAnchor="end" fontFamily={fontFamily} fontWeight={800} fontSize={70} fill="#FFD54A" stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={ap(t, m15 - 0.1, 0.3)}>
        15 m
      </text>
      <Para x={620} y={y} s={0.9} don={t * 8} yuz="korku" />
      <g transform="translate(740 1080) scale(0.75)">
        <Gosterge x={0} y={0} v={lerp(0, 40, u)} />
      </g>
    </Kadraj>
  );
};

/** 7 · it stops speeding up. İbre 40'ta kalır, gösterge esner. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.1, 1.2]} origin={[540, 1000]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#141828" />
      <circle cx={540} cy={1000} r={420} fill="#2F6BE0" opacity={0.15} filter="url(#s-glow)" />
      <Gosterge x={540} y={1000} v={40 + Math.sin(f / 3) * 0.6} esne={t > 0.6} />
      <text x={760} y={760} fontFamily={fontFamily} fontWeight={800} fontSize={60} fill="#fff" opacity={t > 0.8 ? 1 - ((t * 2) % 1) : 0}>
        z
      </text>
    </Kadraj>
  );
};

/** 8 · Top speed? 40 kilometers an hour. Bisikletli parayı geçer. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const bx = lerp(-300, 1300, ap(t, 0.6, 1.8, (x) => x));
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1100]}>
      <Sokak />
      <Para x={560} y={lerp(900, 1150, ap(t, 0, 2.6, (x) => x))} s={1.0} don={f / 5} r={Math.sin(f / 9) * 30} yuz="mutlu" />
      {/* bisikletli */}
      <g transform={`translate(${bx} 1490)`}>
        {[-90, 90].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={-60} r={60} fill="none" stroke={INK} strokeWidth={10} />
            <path d={`M${cx} -60 l${Math.cos(f / 2) * 50} ${Math.sin(f / 2) * 50}`} stroke={INK} strokeWidth={4} />
          </g>
        ))}
        <path d="M-90 -60 L0 -60 L60 -150 L-40 -150 Z M60 -150 L90 -60" stroke="#D93036" strokeWidth={12} fill="none" strokeLinejoin="round" />
        <g transform="translate(-10 -150)">
          <Cizgi x={0} y={0} s={0.42} oturan renk="#4FB3A8" goz="mutlu" agiz="sirit" kolSag={[110, -30]} golge={false} />
        </g>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-180 - i * 30} ${-120 + i * 30} h-120`} stroke="#fff" strokeWidth={6} opacity={0.6} strokeLinecap="round" />
        ))}
      </g>
      <text x={540} y={760} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={120} fill="#FFD54A" stroke={INK} strokeWidth={9} paintOrder="stroke" opacity={ap(t, 0.7, 0.3)}>
        40 km/h
      </text>
    </Kadraj>
  );
};

/** 9 · It feels like a flick on the forehead. Para alına "tık"; Çizgi kaşır, cebine atar. */
const S9: React.FC = () => {
  const t = useTt();
  const flick = useAt('flick');
  const fall = ap(t, 0, flick + 0.05, (x) => x);
  const hit = t > flick + 0.05;
  const bounce = hit ? ap(t, flick + 0.05, 0.5) : 0;
  const cep = t > flick + 0.8;
  return (
    <Kadraj zoom={[1.0, 1.04]} origin={[540, 1100]} shakeAt={[flick + 0.05]} shake={10}>
      <Sokak />
      <Cizgi x={540} y={2120} s={2.3} goz={hit && !cep ? 'sikis' : cep ? 'mutlu' : 'yukari'} agiz={cep ? 'sirit' : hit ? 'o' : 'duz'} bakis={[0, -1]} kolSol={[10, 10]} kolSag={hit ? [150, 50] : [10, 10]} />
      {!cep && <Para x={lerp(560, 640, bounce)} y={hit ? lerp(820, 700, Math.sin(bounce * Math.PI)) + bounce * 260 : lerp(-100, 820, fall)} s={0.7} don={t * 10} yuz={hit ? 'mutlu' : 'korku'} />}
      {hit && !cep && (
        <g transform="translate(540 790)" opacity={1 - ap(t, flick + 0.1, 0.4)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d="M0 -60 v-40" stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" transform={`rotate(${-60 + i * 30})`} />
          ))}
        </g>
      )}
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's05',
  words: WORDS,
  voiceLen: 18.24,
  tail: 1.1,
  baslik: ['CAN THIS COIN', 'KILL HIM?'],
  vurgu: '#FF8A5A',
  plan: [
    { w: 'This', C: S1 },
    { w: 'Will', C: S2 },
    { w: 'Everyone', C: S3 },
    { w: 'but', C: S4 },
    { w: 'It', C: S5 },
    { w: 'After', C: S6 },
    { w: 'it#2', C: S7 },
    { w: 'Top', C: S8 },
    { w: 'It#2', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['whoosh', 'This', 0.1, 0.3],
    ['riser', 'Will', 0, 0.2],
    ['pop', 'Everyone', 0.1, 0.25],
    ['coins', 'but', 0.1, 0.25],
    ['whoosh', 'flutters', 0, 0.25],
    ['tick', '15', 0, 0.3],
    ['buzz', 'stops', 0, 0.15],
    ['ding', '40', 0, 0.25],
    ['click', 'flick', 0.05, 0.6],
    ['coins', 'forehead.', 0.3, 0.25],
  ],
  muzik: ['music-happy', 0.08],
});

export const S05 = short.Comp;
export const S05_FRAMES = short.frames;
