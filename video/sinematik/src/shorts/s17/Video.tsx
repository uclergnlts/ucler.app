/**
 * S-17 "Microwave a grape". Dikey Short, ~22 sn.
 * Kaynak: Khattak, Bianucci, Slepkov, PNAS 2019: üzümün boyutu ve su içeriği mikrodalgayı içinde rezonansa sokar;
 * birbirine değen iki üzümün temas noktasında alan yoğunlaşır, hava iyonlaşır ve plazma oluşur.
 * Açıklamaya "evde denemeyin, fırına zarar verir" notu eklenir.
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
const MOR = '#D58CFF';

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

const rnd = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

/** Üzüm tanesi. */
const Uzum: React.FC<{ x: number; y: number; r?: number; yuz?: 'yok' | 'mutlu' | 'sok'; sap?: boolean; parla?: number }> = ({ x, y, r = 100, yuz = 'yok', sap = true, parla = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {parla > 0 && <circle r={r * 1.5} fill="#FFD9A0" opacity={0.35 * parla} filter="url(#s-glow)" />}
    <ellipse rx={r} ry={r * 1.08} fill="#7BC86A" stroke={INK} strokeWidth={Math.max(5, r / 14)} />
    <ellipse cx={-r * 0.1} cy={r * 0.2} rx={r * 0.8} ry={r * 0.78} fill="#5FAE52" opacity={0.5} />
    <ellipse cx={-r * 0.38} cy={-r * 0.45} rx={r * 0.22} ry={r * 0.32} fill="#fff" opacity={0.55} transform={`rotate(-24 ${-r * 0.38} ${-r * 0.45})`} />
    {sap && <path d={`M0 ${-r * 1.06} q${r * 0.1} ${-r * 0.3} ${r * 0.3} ${-r * 0.36}`} stroke="#6B4A2A" strokeWidth={r / 9} fill="none" strokeLinecap="round" />}
    {yuz !== 'yok' && (
      <g>
        <ellipse cx={-r * 0.28} cy={-r * 0.05} rx={r * 0.13} ry={r * (yuz === 'sok' ? 0.2 : 0.16)} fill="#fff" stroke={INK} strokeWidth={4} />
        <ellipse cx={r * 0.28} cy={-r * 0.05} rx={r * 0.13} ry={r * (yuz === 'sok' ? 0.2 : 0.16)} fill="#fff" stroke={INK} strokeWidth={4} />
        <circle cx={-r * 0.26} cy={-r * 0.03} r={r * 0.06} fill={INK} />
        <circle cx={r * 0.3} cy={-r * 0.03} r={r * 0.06} fill={INK} />
        {yuz === 'sok' ? <ellipse cx={0} cy={r * 0.4} rx={r * 0.1} ry={r * 0.14} fill={INK} /> : <path d={`M${-r * 0.2} ${r * 0.32} q${r * 0.2} ${r * 0.2} ${r * 0.4} 0`} stroke={INK} strokeWidth={r / 14} fill="none" strokeLinecap="round" />}
      </g>
    )}
  </g>
);

/** Plazma alevi. */
const Plazma: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 100, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r * 2.4} fill={MOR} opacity={0.3} filter="url(#s-glow)" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + f * 0.25;
        const l = r * (1.1 + rnd(i + Math.floor(f / 2)) * 0.9);
        return <path key={i} d={`M0 0 Q${Math.cos(a + 0.4) * l * 0.6} ${Math.sin(a + 0.4) * l * 0.6} ${Math.cos(a) * l} ${Math.sin(a) * l}`} stroke={i % 2 ? '#FFE9B8' : MOR} strokeWidth={r / 9} fill="none" strokeLinecap="round" />;
      })}
      <ellipse rx={r * (0.9 + Math.sin(f / 2) * 0.08)} ry={r * (1.05 + Math.cos(f / 2) * 0.08)} fill="#FF9AF0" opacity={0.85} />
      <ellipse rx={r * 0.62} ry={r * 0.74} fill="#FFE9B8" />
      <ellipse rx={r * 0.32} ry={r * 0.4} fill="#fff" />
    </g>
  );
};

/** Mutfak: fayans, dolaplar, tezgâh, pencere, raf. */
const Mutfak: React.FC<{ tezgah?: number; isik?: number }> = ({ tezgah = 1280, isik = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#F3D9B8" />
      {/* fayanslar */}
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => <rect key={`${r}-${c}`} x={-300 + c * 140 + (r % 2) * 70} y={tezgah - 640 + r * 70} width={132} height={62} rx={6} fill={(r + c) % 5 === 0 ? '#F9C9A0' : '#FFF1DC'} opacity={0.9} />),
      )}
      {/* üst dolaplar */}
      {[-140, 250, 640].map((x, i) => (
        <g key={x}>
          <rect x={x} y={-100} width={370} height={620} rx={14} fill="#5FA8A0" stroke={INK} strokeWidth={9} />
          <rect x={x + 30} y={-70} width={310} height={560} rx={8} fill="#6FBAB2" />
          <circle cx={x + (i % 2 ? 60 : 310)} cy={420} r={14} fill="#FFF1DC" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      {/* askıdaki kepçe ve tava */}
      <path d="M-200 600 H1300" stroke="#8E6B4A" strokeWidth={12} />
      {[60, 180, 900].map((x, i) => (
        <g key={x} transform={`translate(${x} 606) rotate(${Math.sin(f / 20 + i) * 3})`}>
          <path d="M0 0 V110" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          {i === 2 ? <circle cx={0} cy={170} r={62} fill="#3B4466" stroke={INK} strokeWidth={8} /> : <ellipse cx={0} cy={136} rx={30} ry={24} fill="#C9D2E3" stroke={INK} strokeWidth={7} />}
        </g>
      ))}
      {/* tezgâh ve alt dolaplar */}
      <rect x={-500} y={tezgah} width={2100} height={50} fill="#FFF1DC" stroke={INK} strokeWidth={9} />
      <rect x={-500} y={tezgah + 50} width={2100} height={1400} fill="#4E918A" />
      {[-140, 250, 640].map((x) => (
        <g key={x}>
          <rect x={x} y={tezgah + 90} width={360} height={520} rx={12} fill="#5FA8A0" stroke={INK} strokeWidth={8} />
          <rect x={x + 130} y={tezgah + 130} width={100} height={18} rx={9} fill="#FFF1DC" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      {/* tezgâh üstü: meyve kâsesi, çaydanlık */}
      <g transform={`translate(110 ${tezgah})`}>
        <path d="M-110 -70 q110 110 220 0 Z" fill="#F29A6A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {[-50, -10, 30, -30, 10].map((x, i) => (
          <ellipse key={i} cx={x} cy={-86 - (i > 2 ? 30 : 0)} rx={24} ry={26} fill="#7BC86A" stroke={INK} strokeWidth={5} />
        ))}
      </g>
      <rect x={-500} y={-600} width={2100} height={3200} fill={MOR} opacity={isik * 0.22} />
    </g>
  );
};

/** Mikrodalga fırın. (x, y) = taban ortası. children: cam içi (cam merkezine göre). */
const Mikrodalga: React.FC<{ x: number; y: number; s?: number; yanik?: boolean; isik?: number; children?: React.ReactNode }> = ({ x, y, s = 1, yanik = false, isik = 0.5, children }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-340} y={-420} width={680} height={420} rx={26} fill={yanik ? '#5A5350' : '#E9EEF5'} stroke={INK} strokeWidth={11} />
      <rect x={-300} y={-10} width={60} height={26} fill="#1B1F33" />
      <rect x={240} y={-10} width={60} height={26} fill="#1B1F33" />
      {/* cam */}
      <rect x={-310} y={-390} width={460} height={360} rx={18} fill="#1B2033" stroke={INK} strokeWidth={8} />
      <rect x={-290} y={-370} width={420} height={320} rx={10} fill={yanik ? '#0B0B0B' : '#3A2F5C'} />
      <rect x={-290} y={-370} width={420} height={320} rx={10} fill="#FFD9A0" opacity={yanik ? 0 : isik * 0.5} />
      <g transform="translate(-80 -210)">{children}</g>
      {!yanik && (
        <g opacity={0.25}>
          {Array.from({ length: 9 }, (_, i) =>
            Array.from({ length: 7 }, (_, j) => <circle key={`${i}-${j}`} cx={-270 + i * 48} cy={-350 + j * 46} r={5} fill="#0B0E1C" />),
          )}
        </g>
      )}
      {!yanik && <path d="M-270 -150 l90 -200 M-220 -110 l60 -130" stroke="#fff" strokeWidth={10} opacity={0.2} strokeLinecap="round" />}
      {/* panel */}
      <rect x={180} y={-380} width={130} height={70} rx={8} fill="#11131C" stroke={INK} strokeWidth={6} />
      <text x={245} y={-330} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={44} fill={yanik ? '#5A2A22' : '#7CFFB2'}>
        {yanik ? '--:--' : `0:0${3 + (Math.floor(f / 30) % 5)}`}
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={186 + (i % 3) * 42} y={-290 + Math.floor(i / 3) * 44} width={34} height={34} rx={8} fill={yanik ? '#3A3533' : '#C9D2E3'} stroke={INK} strokeWidth={4} />
      ))}
      <circle cx={245} cy={-110} r={44} fill={yanik ? '#3A3533' : '#FF7A5A'} stroke={INK} strokeWidth={8} />
      <path d="M150 -390 V-30" stroke={INK} strokeWidth={8} />
      {yanik && (
        <g>
          <path d="M-340 -330 q120 -160 300 -90 q160 -120 380 0" stroke="#1B1B1B" strokeWidth={60} fill="none" opacity={0.6} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-160 + i * 150} -430 q${30 + Math.sin(f / 8 + i) * 20} -70 0 -140 q-30 -70 0 -${140 + ((f * 3 + i * 40) % 80)}`} stroke="#8E8A8A" strokeWidth={22} fill="none" opacity={0.55} strokeLinecap="round" />
          ))}
        </g>
      )}
    </g>
  );
};

/** Karanlık fırın içi (yakın çekim zemini): döner tabak, delikli duvar. */
const FirinIci: React.FC<{ isik?: number }> = ({ isik = 0.3 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#241B3A" />
      {Array.from({ length: 16 }, (_, i) =>
        Array.from({ length: 12 }, (_, j) => <circle key={`${i}-${j}`} cx={-200 + i * 100 + (j % 2) * 50} cy={-100 + j * 96} r={9} fill="#171029" />),
      )}
      <rect x={-500} y={-600} width={2100} height={3200} fill={MOR} opacity={isik * 0.25} />
      <rect x={-500} y={1330} width={2100} height={1300} fill="#3A2F5C" />
      <ellipse cx={540} cy={1340} rx={640} ry={90} fill="#BFE3F0" opacity={0.55} stroke={INK} strokeWidth={9} />
      <ellipse cx={540} cy={1340} rx={520} ry={66} fill="none" stroke="#fff" strokeWidth={6} opacity={0.4} strokeDasharray="40 30" strokeDashoffset={f * 3} />
    </g>
  );
};

/** Mikrodalga dalgası (yatay sinüs). */
const Dalga: React.FC<{ x1: number; x2: number; y: number; amp?: number; renk?: string; w?: number; faz?: number }> = ({ x1, x2, y, amp = 30, renk = '#FF8A4A', w = 10, faz = 0 }) => {
  const f = useCurrentFrame();
  const n = 40;
  const d = Array.from({ length: n + 1 }, (_, i) => {
    const x = lerp(x1, x2, i / n);
    return `${i ? 'L' : 'M'}${x.toFixed(0)} ${(y + Math.sin(i * 0.8 - f * 0.5 + faz) * amp).toFixed(0)}`;
  }).join(' ');
  return <path d={d} stroke={renk} strokeWidth={w} fill="none" strokeLinecap="round" />;
};

/* ---------------- çekimler ---------------- */

/** 1 · Put two grapes in a microwave. Mutfak, camda kıvılcım. (loop karesi) */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const fl = 0.6 + rnd(Math.floor(f / 2)) * 0.4;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[600, 1050]}>
      <Mutfak isik={fl} />
      <Mikrodalga x={620} y={1280} s={1.15} isik={fl}>
        <ellipse cx={0} cy={110} rx={170} ry={22} fill="#BFE3F0" opacity={0.6} />
        <Uzum x={-52} y={56} r={52} />
        <Uzum x={52} y={56} r={52} />
        <Plazma x={0} y={-6} r={30 + fl * 12} />
      </Mikrodalga>
      <Cizgi x={90} y={1620} s={1.25} goz="sok" agiz="o" kas="kalkik" bakis={[1, -0.4]} egim={8} kolSag={[70, 30]} kolSol={[30, 20]} isik={1} />
      <Zerre n={14} color="#FFD9FF" o={0.3} />
    </Kadraj>
  );
};

/** 2 · and you get plasma. Fırının içi, plazma topu yükselir. */
const S2: React.FC = () => {
  const t = useTt();
  const pl = useAt('plasma.');
  const u = ap(t, 0, 1.2, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]} shakeAt={[0]} shake={12}>
      <FirinIci isik={0.6 + u * 0.4} />
      <Uzum x={410} y={1210} r={140} yuz="sok" />
      <Uzum x={670} y={1210} r={140} yuz="sok" />
      <Plazma x={540} y={lerp(1100, 760, u)} r={lerp(90, 190, u)} />
      <g transform={`translate(540 560) scale(${pop(t, pl - 0.05)})`}>
        <Etiket x={0} y={0} size={140} renk="#FFB8F4">
          <T en="PLASMA" tr="PLAZMA" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 3 · The stuff lightning is made of. Şimşek = üzüm kıvılcımı. */
const S3: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const li = useAt('lightning');
  const zig = (seed: number) =>
    'M260 300 ' +
    Array.from({ length: 8 }, (_, i) => `L${260 + (rnd(seed + i) - 0.5) * 200} ${400 + i * 110}`).join(' ');
  const d = zig(3 + (Math.floor(f / 3) % 3));
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      {/* sol: fırtına */}
      <rect x={-500} y={-600} width={1040} height={3200} fill="#141A3A" />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={-60 + i * 150} cy={300 + (i % 2) * 60} rx={190} ry={90} fill="#2A3360" />
      ))}
      <path d="M-500 1300 q260 -160 520 -60 q260 -120 520 40 V2600 H-500 Z" fill="#0E1226" />
      <g opacity={ap(t, li - 0.2, 0.15)}>
        <path d={d} stroke="#BFE8FF" strokeWidth={70} fill="none" opacity={0.35} filter="url(#s-glow)" strokeLinejoin="round" />
        <path d={d} stroke="#BFE8FF" strokeWidth={24} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={d} stroke="#fff" strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </g>
      {/* sağ: üzümler */}
      <rect x={540} y={-600} width={1100} height={3200} fill="#241B3A" />
      <ellipse cx={810} cy={1240} rx={300} ry={50} fill="#BFE3F0" opacity={0.5} />
      <Uzum x={730} y={1120} r={86} />
      <Uzum x={890} y={1120} r={86} />
      <Plazma x={810} y={940} r={110} />
      <path d="M540 -600 V2600" stroke={INK} strokeWidth={16} />
      <g transform={`translate(540 760) scale(${pop(t, li + 0.5)})`}>
        <circle r={96} fill={SARI} stroke={INK} strokeWidth={10} />
        <path d="M-44 -18 h88 M-44 22 h88" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

/** 4 · A grape is the perfect size. Tek üzüm, dalgalar geliyor, boy ölçüsü. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const pf = useAt('perfect');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <FirinIci isik={0.2} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <Dalga x1={d < 0 ? -100 : 800} x2={d < 0 ? 290 : 1180} y={780} amp={46} faz={d} />
          <Dalga x1={d < 0 ? -100 : 800} x2={d < 0 ? 290 : 1180} y={1050} amp={46} faz={d + 2} />
        </g>
      ))}
      <Uzum x={540} y={940 + Math.sin(f / 9) * 8} r={250} yuz="mutlu" parla={0.5} />
      <g opacity={ap(t, pf - 0.2, 0.3)}>
        <path d="M290 1300 H790 M290 1270 v60 M790 1270 v60" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      </g>
      <g transform={`translate(540 560) scale(${pop(t, pf)})`}>
        <Etiket x={0} y={0} size={140}><T en="≈ 1.5 cm" tr="≈ 1,5 cm" /></Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · to trap microwaves inside it. Üzüm kesiti, dalgalar içeride döner. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.1, 1.22]} origin={[540, 950]}>
      <FirinIci isik={0.3} />
      <g transform="translate(540 950)">
        <circle r={430} fill="#FF8A4A" opacity={0.2 + Math.sin(f / 5) * 0.06} filter="url(#s-glow)" />
        <circle r={340} fill="#7BC86A" stroke={INK} strokeWidth={14} />
        <circle r={300} fill="#C6EDB0" />
        {/* çekirdekler */}
        {[[-70, 40], [60, -30]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={26} ry={44} fill="#8C6A3A" stroke={INK} strokeWidth={6} transform={`rotate(${i ? 30 : -20} ${x} ${y})`} />
        ))}
        {/* içeride hapsolmuş dalga halkaları */}
        {[250, 190, 130].map((r, i) => {
          const n = 48;
          const d = Array.from({ length: n + 1 }, (_, k) => {
            const a = (k / n) * Math.PI * 2;
            const rr = r + Math.sin(a * (6 + i) + f * (0.35 + i * 0.1) * (i % 2 ? -1 : 1)) * 22;
            return `${k ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
          }).join(' ');
          return <path key={r} d={d + ' Z'} stroke={i === 1 ? '#FFD54A' : '#FF7A3A'} strokeWidth={12} fill="none" opacity={ap(t, i * 0.25, 0.3)} />;
        })}
        <circle r={60 + Math.sin(f / 3) * 14} fill="#FFE9B8" opacity={0.8} filter="url(#s-glow)" />
      </g>
      <g transform={`translate(540 560) scale(${pop(t, 0.6)})`}>
        <Etiket x={0} y={0} size={110} renk="#fff">
          <T en="TRAPPED" tr="HAPSOLDU" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 6 · Two grapes touching. İki üzüm birbirine yaklaşıp değer. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const to = useAt('touching');
  const u = ap(t, 0.05, to + 0.1, (x) => 1 - (1 - x) * (1 - x));
  const dx = lerp(330, 196, u);
  const deg = t > to + 0.15;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]} shakeAt={[to + 0.15]} shake={8}>
      <FirinIci isik={0.3} />
      <Uzum x={540 - dx} y={1130} r={200} yuz={deg ? 'sok' : 'mutlu'} parla={0.5} />
      <Uzum x={540 + dx} y={1130} r={200} yuz={deg ? 'sok' : 'mutlu'} parla={0.5} />
      {deg && <circle cx={540} cy={1130} r={36 + Math.sin(f / 2) * 10} fill="#fff" filter="url(#s-glow)" />}
      <g transform={`translate(540 640) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={230}>×2</Etiket>
      </g>
    </Kadraj>
  );
};

/** 7 · squeeze all that energy into one tiny spot. Enerji temas noktasına akar. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sp = useAt('spot.');
  const g = ap(t, 0, sp, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.25]} origin={[540, 1130]}>
      <FirinIci isik={0.3 + g * 0.5} />
      <Uzum x={344} y={1130} r={200} parla={1} />
      <Uzum x={736} y={1130} r={200} parla={1} />
      {/* enerji okları merkeze */}
      {[-1, 1].map((d) =>
        [0, 1, 2, 3].map((i) => {
          const k = (t * 1.4 + i * 0.25) % 1;
          const x = 540 + d * lerp(330, 40, k);
          const y = 1130 + (i - 1.5) * 70 * (1 - k);
          return <path key={`${d}-${i}`} d={`M${x + d * 50} ${y} H${x} m${d * 22} -20 l${-d * 22} 20 l${d * 22} 20`} stroke={SARI} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={1 - k * 0.3} />;
        }),
      )}
      <circle cx={540} cy={1130} r={30 + g * 70 + Math.sin(f / 2) * 8} fill="#FFE9B8" opacity={0.9} filter="url(#s-glow)" />
      <circle cx={540} cy={1130} r={16 + g * 20} fill="#fff" />
      <g transform={`translate(540 760) scale(${pop(t, sp - 0.3)})`}>
        <path d="M0 40 V200 m-36 -44 l36 44 l36 -44" stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 40 V200 m-36 -44 l36 44 l36 -44" stroke="#FF5A3A" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Kadraj>
  );
};

/** 8 · The air there rips apart. Temas noktası yakın çekim, hava molekülleri parçalanır. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const ri = useAt('rips');
  const u = ap(t, ri, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]} shakeAt={[ri]} shake={16}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B1230" />
      {/* iki üzümün kenarları */}
      <circle cx={-560} cy={950} r={1000} fill="#7BC86A" stroke={INK} strokeWidth={16} />
      <circle cx={1640} cy={950} r={1000} fill="#7BC86A" stroke={INK} strokeWidth={16} />
      <circle cx={540} cy={950} r={420} fill="#FFD9A0" opacity={0.25 + u * 0.3} filter="url(#s-glow)" />
      {/* hava molekülleri: çift toplar, kopunca ayrılır */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const r0 = 90 + (i % 3) * 60;
        const cx = 540 + Math.cos(a) * r0 * (1 + u * 0.7) + Math.sin(f / 6 + i) * 8;
        const cy = 950 + Math.sin(a) * r0 * 1.6 * (1 + u * 0.7) + Math.cos(f / 7 + i) * 8;
        const ay = 20 + u * 46;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${i * 40 + f * (1 + u * 4)})`}>
            <circle cx={-ay} cy={0} r={24} fill="#8FD3FF" stroke={INK} strokeWidth={6} />
            <circle cx={ay} cy={0} r={24} fill="#8FD3FF" stroke={INK} strokeWidth={6} />
            {u < 0.2 && <path d={`M${-ay} 0 H${ay}`} stroke={INK} strokeWidth={8} />}
            {u > 0.2 && <circle cx={0} cy={-40 * u} r={9} fill={SARI} stroke={INK} strokeWidth={3} />}
          </g>
        );
      })}
      <g transform={`translate(540 620) scale(${pop(t, 0.2)})`}>
        <Etiket x={0} y={0} size={120} renk="#8FD3FF">
          <T en="AIR" tr="HAVA" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 9 · and glows. Plazma patlar. */
const S9: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 950]} shakeAt={[0]} shake={22}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B1230" />
      <circle cx={-560} cy={950} r={1000} fill="#7BC86A" stroke={INK} strokeWidth={16} />
      <circle cx={1640} cy={950} r={1000} fill="#7BC86A" stroke={INK} strokeWidth={16} />
      <rect x={-500} y={-600} width={2100} height={3200} fill={MOR} opacity={0.25 + u * 0.2} />
      <Plazma x={540} y={950} r={lerp(80, 300, u)} />
      <Zerre n={30} color="#FFE9B8" o={0.7} />
    </Kadraj>
  );
};

/** 10 · Please use... Çizgi yanmış mikrodalgayla, mahcup. */
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1050]}>
      <Mutfak />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3A3533" opacity={0.25} />
      <Mikrodalga x={640} y={1280} s={1.05} yanik />
      <Cizgi x={170} y={1640} s={1.35} goz="yari" agiz="duz" kas="uzgun" bakis={[1, 0]} kolSag={[40, 20]} kolSol={[150, 150]} bas={Math.sin(f / 12) * 3} />
      {/* yüzünde is lekeleri */}
      {[[110, 1080], [220, 1120], [150, 1010]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={22} ry={12} fill="#3A3533" opacity={0.7} />
      ))}
    </Kadraj>
  );
};

/** 11 · someone else's microwave. Komşunun kapısında. */
const S11: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const ac = ap(t, 0.5, 0.4);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[560, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#C9D9E8" />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M-500 ${-200 + i * 140} H1600`} stroke="#B5C6D8" strokeWidth={6} />
      ))}
      {/* kapı */}
      <rect x={470} y={330} width={520} height={1200} rx={12} fill="#6B4A2A" stroke={INK} strokeWidth={12} />
      <rect x={500} y={360} width={460} height={1170} fill="#2A2140" />
      <g transform={`translate(500 360) scale(${1 - ac * 0.55} 1)`}>
        <rect x={0} y={0} width={460} height={1170} fill="#C2607C" stroke={INK} strokeWidth={9} />
        <rect x={50} y={60} width={360} height={440} rx={10} fill="#D9788F" stroke={INK} strokeWidth={6} />
        <rect x={50} y={580} width={360} height={500} rx={10} fill="#D9788F" stroke={INK} strokeWidth={6} />
        <circle cx={400} cy={620} r={24} fill={SARI} stroke={INK} strokeWidth={7} />
        <text x={230} y={220} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={110} fill="#FFF1DC">7</text>
      </g>
      {/* komşu: aralıktan bakan gözler */}
      <g opacity={ac}>
        <ellipse cx={830} cy={820} rx={22} ry={28} fill="#fff" />
        <ellipse cx={900} cy={820} rx={22} ry={28} fill="#fff" />
        <circle cx={824} cy={826} r={10} fill={INK} />
        <circle cx={894} cy={826} r={10} fill={INK} />
      </g>
      {/* zil, lamba, paspas, saksı */}
      <rect x={380} y={860} width={50} height={80} rx={12} fill="#FFF1DC" stroke={INK} strokeWidth={7} />
      <circle cx={405} cy={900} r={12} fill="#FF5A3A" />
      <path d="M730 250 v-60 M670 250 h120 l-30 -50 h-60 Z" stroke={INK} strokeWidth={8} fill={SARI} strokeLinejoin="round" />
      <rect x={-500} y={1530} width={2100} height={1100} fill="#8E97B0" />
      <rect x={-500} y={1530} width={2100} height={22} fill="#59628A" />
      <rect x={520} y={1540} width={420} height={50} rx={10} fill="#3FA86B" stroke={INK} strokeWidth={8} />
      <g transform="translate(1010 1530)">
        <path d="M-50 -110 h100 l-16 110 h-68 Z" fill="#F29A6A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M0 -110 q-60 -90 ${-70 + Math.sin(f / 10) * 6} -180 M0 -110 q10 -110 ${50 + Math.sin(f / 9) * 6} -200 M0 -110 q-10 -80 -10 -230`} stroke="#3FA86B" strokeWidth={18} fill="none" strokeLinecap="round" />
      </g>
      {/* Çizgi yanmış fırını taşıyor, zile basıyor */}
      <Cizgi
        x={230}
        y={1600}
        s={1.25}
        goz="mutlu"
        agiz="sirit"
        bakis={[1, 0]}
        kolSag={[84, 30]}
        kolSol={[60, 80]}
        elSol={<g />}
      />
      <Mikrodalga x={250} y={1330} s={0.5} yanik />
      <g transform={`translate(405 800) scale(${pop(t, 0.15)})`}>
        <Etiket x={0} y={0} size={90} renk="#fff">ding!</Etiket>
      </g>
    </Kadraj>
  );
};

const AYAR: Parameters<typeof makeShort>[0] = {
  kod: 's17',
  words: WORDS,
  voiceLen: 20.99,
  tail: 0.7,
  baslik: ['MICROWAVE', 'A GRAPE'],
  vurgu: '#E7A6FF',
  plan: [
    { w: 'Put', C: S1 },
    { w: 'you', C: S2 },
    { w: 'The', C: S3 },
    { w: 'A', C: S4 },
    { w: 'trap', C: S5 },
    { w: 'Two', C: S6 },
    { w: 'squeeze', C: S7 },
    { w: 'The#2', C: S8 },
    { w: 'and#2', C: S9 },
    { w: 'Please', C: S10 },
    { w: 'someone', C: S11 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['buzz', 'Put', 0, 0.1],
    ['impact', 'you', 0, 0.2],
    ['riser', 'The', 0, 0.12],
    ['pop', 'perfect', 0, 0.22],
    ['whoosh', 'trap', 0, 0.16],
    ['click', 'touching', 0.15, 0.22],
    ['riser', 'squeeze', 0, 0.14],
    ['glass', 'rips', 0, 0.16],
    ['impact', 'glows.', -0.2, 0.22],
    ['buzz', 'Please', 0, 0.08],
    ['ding', 'someone', 0.15, 0.2],
  ],
  muzik: ['music-happy', 0.06],
};
const short = makeShort(AYAR);

export const S17 = short.Comp;
export const S17_FRAMES = short.frames;

/** Türkçe sürüm (Instagram): aynı sahneler, Türkçe ses, çapalar EN kelime -> TR kelime. */
const shortTr = makeShort({
  ...AYAR,
  kod: 's17tr',
  words: WORDS_TR,
  voiceLen: 19.25,
  baslik: ["MİKRODALGAYA", "ÜZÜM KOYARSAN?"],
  dil: 'tr',
  plan: AYAR.plan.map((p) => (p.w === 'A' ? { w: 'A', C: S5 } : p.w === 'trap' ? { w: 'trap', C: S4 } : p)),
  esle: {"Put": "Mikrodalgaya", "you": "plazma", "plasma.": "oluşur", "The": "Yıldırımın", "lightning": "Yıldırımın", "A": "Üzüm", "trap": "tam", "perfect": "doğru", "Two": "Birbirine", "touching": "değen", "squeeze": "bütün", "spot.": "noktaya", "The#2": "O", "rips": "parçalanır", "and#2": "ve", "glows.": "parlar", "Please": "Denemek", "someone": "başkasının"},
});
export const S17TR = shortTr.Comp;
export const S17TR_FRAMES = shortTr.frames;
