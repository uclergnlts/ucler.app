/**
 * S-19 "The 5-second rule". Dikey Short, ~19 sn + 1 sn sonraki video.
 * Kaynak: Miranda & Schaffner, Rutgers, Applied and Environmental Microbiology 2016: 2.560 ölçüm; bakteri geçişi
 * 1 saniyeden kısa sürede başlayabilir; en çok karpuz (ıslak), en az jelibon; halı, fayans ve çelikten daha az geçirir.
 * Kontrol listesi: başlık cevabı vermez, kesimler < 3 sn, tek tartışmalı soru, abone cümlesi yok.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, Sayi, T, useAt, useTt, Zerre } from '../ortak';
import { Etiket, Kronometre, Onay, rnd, SARI } from '../parca';
import { S20_ILK, S20_WORDS } from '../s20/Video';
import raw from './words.json';

const WORDS = raw as Word[];

/** Bakteri: yeşil, tüylü, gözlü. */
export const Bakteri: React.FC<{ x: number; y: number; s?: number; r?: number; renk?: string; el?: boolean }> = ({ x, y, s = 1, r = 0, renk = '#7BD64A', el = false }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M0 -44 v-22" stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 36 + Math.sin(f / 5 + i) * 8})`} />
      ))}
      <ellipse rx={62} ry={46} fill={renk} stroke={INK} strokeWidth={7} />
      <ellipse cx={-18} cy={-18} rx={22} ry={10} fill="#fff" opacity={0.35} />
      <circle cx={-18} cy={-4} r={13} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={20} cy={-4} r={13} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={-15} cy={-2} r={6} fill={INK} />
      <circle cx={23} cy={-2} r={6} fill={INK} />
      <path d="M-14 18 q16 14 32 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      {el && <path d={`M56 -10 l40 ${-40 + Math.sin(f / 3) * 14}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />}
    </g>
  );
};

const Kurabiye: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <circle r={120} fill="#D99A4E" stroke={INK} strokeWidth={10} />
    <path d="M-80 -50 q40 -50 110 -40" stroke="#F0BE7A" strokeWidth={16} fill="none" strokeLinecap="round" />
    {[[-50, -20, 20], [30, -50, 16], [50, 30, 22], [-30, 55, 18], [-75, 30, 12], [5, 5, 14]].map(([cx, cy, rr], i) => (
      <circle key={i} cx={cx} cy={cy} r={rr} fill="#5A3418" stroke={INK} strokeWidth={5} />
    ))}
  </g>
);

/** Mutfak: duvar, dolaplar, buzdolabı, damalı zemin. */
const Mutfak: React.FC = () => (
  <g>
    <rect x={-500} y={-600} width={2100} height={3200} fill="#F4D7A6" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M-500 ${360 + i * 90} H1600`} stroke="#EBC88E" strokeWidth={5} />
    ))}
    {/* pencere */}
    <rect x={120} y={400} width={360} height={380} rx={12} fill="#BFE3F0" stroke="#fff" strokeWidth={22} />
    <path d="M300 400 V780 M120 590 H480" stroke="#fff" strokeWidth={12} />
    <circle cx={390} cy={490} r={44} fill={SARI} />
    {/* tezgâh ve dolaplar */}
    <rect x={-500} y={880} width={2100} height={60} fill="#8C5A2E" stroke={INK} strokeWidth={8} />
    <rect x={-500} y={940} width={2100} height={440} fill="#4FA3A0" stroke={INK} strokeWidth={8} />
    {[-60, 250, 560, 870].map((x) => (
      <g key={x}>
        <rect x={x} y={970} width={280} height={380} rx={10} fill="#5FB8B4" stroke={INK} strokeWidth={7} />
        <circle cx={x + 240} cy={1160} r={14} fill="#F4D7A6" stroke={INK} strokeWidth={5} />
      </g>
    ))}
    {/* tezgâh üstü: kurabiye tabağı, kavanoz */}
    <ellipse cx={760} cy={872} rx={150} ry={26} fill="#fff" stroke={INK} strokeWidth={7} />
    {[700, 770, 830].map((x, i) => (
      <ellipse key={x} cx={x} cy={850 - i * 6} rx={50} ry={18} fill="#D99A4E" stroke={INK} strokeWidth={6} />
    ))}
    <rect x={930} y={720} width={110} height={160} rx={16} fill="#BFE3F0" stroke={INK} strokeWidth={7} opacity={0.9} />
    <rect x={922} y={700} width={126} height={30} rx={8} fill="#FF5A3A" stroke={INK} strokeWidth={7} />
    {/* damalı zemin */}
    <rect x={-500} y={1380} width={2100} height={1300} fill="#EFE9DC" />
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => ((r + c) % 2 ? <rect key={`${r}-${c}`} x={-260 + c * 190} y={1380 + r * 190} width={190} height={190} fill="#C9BFA8" /> : null)),
    )}
    <path d="M-500 1380 H1600" stroke={INK} strokeWidth={8} />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Your cookie hit the floor. Kurabiye yerde, Çizgi donmuş, fayans aralarından bakteriler bakıyor. */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.12, 1.0]} origin={[700, 1500]}>
      <Mutfak />
      <Cizgi x={300} y={1900} s={1.9} goz="sok" agiz="o" kas="kalkik" bakis={[1, 1]} kolSag={[50, 30]} kolSol={[20, 14]} />
      {[[560, 1560, -20], [930, 1580, 16], [1000, 1780, 30], [540, 1830, -30]].map(([x, y, r], i) => (
        <Bakteri key={i} x={x} y={y + (1 - pop(t, 0.35 + i * 0.12)) * 60} s={0.9 * pop(t, 0.35 + i * 0.12)} r={r + Math.sin(f / 6 + i) * 6} />
      ))}
      <Kurabiye x={760} y={1700} s={1.15} r={12} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={760 + Math.cos(i * 1.1) * (150 + ap(t, 0, 0.4) * 60)} cy={1700 + Math.sin(i * 1.1) * 80 + 60} r={9} fill="#D99A4E" stroke={INK} strokeWidth={4} />
      ))}
      {[-1, 0, 1].map((i) => (
        <path key={i} d={`M${760 + i * 120} ${1520 - Math.abs(i) * -30} l${i * 40} -70`} stroke={INK} strokeWidth={12} strokeLinecap="round" opacity={1 - ap(t, 0.5, 0.4)} />
      ))}
    </Kadraj>
  );
};

/** 2 · Five seconds. Kronometre sayar. */
const S2: React.FC = () => {
  const t = useTt();
  const n = Math.min(5, 1 + Math.floor(t / 0.2));
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 900]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#24406B" />
      <circle cx={540} cy={900} r={640} fill="#5FC8FF" opacity={0.25} filter="url(#s-glow)" />
      <Kronometre x={540} y={900} s={1.25} v={`${n}`} a={n * 30} />
      <Kurabiye x={540} y={1680} s={0.9} />
      <Bakteri x={250} y={1700} s={1.1} r={-10} />
      <Bakteri x={840} y={1690} s={1.1} r={10} />
    </Kadraj>
  );
};

/** 3 · Is it safe? Çizgi kurabiyeyi ağzına götürürken duraksar. */
const Yakin: React.FC<{ mod: 'soru' | 'el' }> = ({ mod }) => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Mutfak />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B2033" opacity={0.25} />
      <Cizgi
        x={430}
        y={2700}
        s={3.0}
        goz={mod === 'soru' ? 'yari' : 'acik'}
        agiz={mod === 'soru' ? 'duz' : 'sirit'}
        kas={mod === 'soru' ? 'catik' : 'kalkik'}
        bakis={[1, 0]}
        kolSag={[84, 130]}
        kolSol={[20, 14]}
        elSag={
          <g>
            <Kurabiye x={0} y={-50} s={0.5} r={Math.sin(f / 7) * 5} />
            {mod === 'el' && <Bakteri x={-10} y={-110} s={0.4} el />}
            {mod === 'el' && <Bakteri x={40} y={-30} s={0.32} el renk="#B8E04A" />}
          </g>
        }
      />
      {mod === 'soru' ? (
        <g transform={`translate(330 640) scale(${pop(t, 0.15)}) rotate(-6)`}>
          <Etiket x={0} y={0} size={170}>
            <T en="SAFE?" tr="TEMİZ Mİ?" />
          </Etiket>
        </g>
      ) : (
        <g transform={`translate(400 640) scale(${pop(t, 0.1)}) rotate(-6)`}>
          <Etiket x={0} y={0} size={100} renk="#fff">
            <T en="BE HONEST" tr="DÜRÜST OL" />
          </Etiket>
        </g>
      )}
    </Kadraj>
  );
};
const S3: React.FC = () => <Yakin mod="soru" />;
const S11: React.FC = () => <Yakin mod="el" />;

/** 4 · Scientists tested it. Laboratuvar: Çizgi maşayla kurabiyeyi fayans örneğine bırakır. */
const S4: React.FC = () => {
  const t = useTt();
  const d = ap(t, 0.5, 0.35, (x) => x * x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[600, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#2C6E78" />
      <circle cx={540} cy={800} r={700} fill="#8FE8E0" opacity={0.2} filter="url(#s-glow)" />
      {/* raflar ve şişeler */}
      {[420, 660].map((y) => (
        <rect key={y} x={480} y={y} width={700} height={22} fill="#1B4A52" stroke={INK} strokeWidth={6} />
      ))}
      {[[540, 420, '#FF8FC0'], [680, 420, SARI], [840, 420, '#7BD64A'], [600, 660, '#5FC8FF'], [780, 660, '#FF8A4A'], [960, 660, '#C79BFF']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M-18 -150 h36 v50 l34 80 q6 20 -14 20 h-76 q-20 0 -14 -20 l34 -80 Z" fill="#DFF4F6" stroke={INK} strokeWidth={6} />
          <path d="M-42 -40 h84 l8 20 q6 20 -14 20 h-72 q-20 0 -14 -20 Z" fill={c as string} />
        </g>
      ))}
      {/* tezgâh */}
      <rect x={-500} y={1360} width={2100} height={80} fill="#E8EDF5" stroke={INK} strokeWidth={8} />
      <rect x={-500} y={1440} width={2100} height={1200} fill="#1B4A52" />
      {/* fayans örneği + petri */}
      <rect x={560} y={1310} width={360} height={50} rx={6} fill="#EFE9DC" stroke={INK} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => (
        <Bakteri key={i} x={600 + i * 90} y={1290} s={0.36} r={i * 20} />
      ))}
      <Kurabiye x={740} y={lerp(980, 1230, d)} s={0.6} r={d * 30} />
      <Cizgi x={300} y={1900} s={1.9} onluk goz="acik" agiz="duz" kas="catik" bakis={[1, 0.6]} kolSag={[96, 40]} kolSol={[20, 14]} />
      {/* pano */}
      <g transform="translate(190 500) rotate(-6) scale(0.8)">
        <rect x={-120} y={-150} width={240} height={300} rx={12} fill="#fff" stroke={INK} strokeWidth={8} />
        <rect x={-50} y={-172} width={100} height={40} rx={8} fill="#8C96AD" stroke={INK} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M-86 ${-80 + i * 56} h${ap(t, 0.2 + i * 0.2, 0.3) * 170}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        ))}
      </g>
    </Kadraj>
  );
};

/** 5 · More than two thousand drops. Fayans ızgarası, sayaç. */
const S5: React.FC = () => {
  const t = useTt();
  const renk = ['#D99A4E', '#FF6A6A', '#FF8FC0', '#F2E3B8'];
  return (
    <Kadraj zoom={[1.1, 1.0]} origin={[540, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B4A52" />
      {Array.from({ length: 48 }, (_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        const a = rnd(i) * 1.2;
        const d = ap(t, a, 0.25, (x) => x * x);
        return (
          <g key={i} transform={`translate(${115 + c * 170} ${420 + r * 170})`}>
            <rect x={-70} y={-70} width={140} height={140} rx={12} fill={(c + r) % 2 ? '#EFE9DC' : '#C9BFA8'} stroke={INK} strokeWidth={6} />
            <circle cy={lerp(-400, 0, d)} r={40 * (d > 0 ? 1 : 0)} fill={renk[i % 4]} stroke={INK} strokeWidth={6} opacity={d > 0.02 ? 1 : 0} />
          </g>
        );
      })}
      <g transform={`translate(540 1010) scale(${pop(t, 0.3)})`}>
        <rect x={-430} y={-170} width={860} height={300} rx={40} fill="#141828" opacity={0.9} stroke={INK} strokeWidth={10} />
        <Etiket x={0} y={30} size={210}>
          <Sayi n={Math.round(lerp(0, 2560, ap(t, 0.3, 1.1)))} />
        </Etiket>
        <Etiket x={0} y={100} size={64} renk="#fff">
          <T en="DROPS" tr="DENEME" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** Zemin makrosu: kurabiye yerde, bakteriler. */
const Makro: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
    <circle cx={540} cy={1000} r={700} fill="#7BD64A" opacity={0.14} filter="url(#s-glow)" />
    <rect x={-500} y={1280} width={2100} height={1400} fill="#EFE9DC" stroke={INK} strokeWidth={10} />
    <path d="M300 1280 l-80 1300 M860 1280 l120 1300" stroke="#C9BFA8" strokeWidth={16} />
    {children}
  </g>
);

/** 6 · Bacteria jump on... Bakteriler kurabiyeye zıplar. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1100]}>
      <Makro>
        <Kurabiye x={540} y={1150} s={2.0} r={8} />
        {Array.from({ length: 9 }, (_, i) => {
          const sol = i % 2 === 0;
          const k = ap(t, 0.1 + i * 0.1, 0.45, (x) => x);
          const x0 = sol ? -100 - i * 20 : 1180 + i * 20;
          const x1 = 380 + rnd(i) * 330;
          const y1 = 1000 + rnd(i + 4) * 280;
          return <Bakteri key={i} x={lerp(x0, x1, k)} y={lerp(1500, y1, k) - Math.sin(k * Math.PI) * 420} s={0.85} r={(1 - k) * (sol ? -200 : 200)} renk={i % 3 ? '#7BD64A' : '#B8E04A'} />;
        })}
      </Makro>
    </Kadraj>
  );
};

/** 7 · ...in less than one second. Kronometre 1'e varmadan durur. */
const S7: React.FC = () => {
  const t = useTt();
  const sn = useAt('second.');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 850]} shakeAt={[sn]} shake={14}>
      <Makro>
        <Kurabiye x={540} y={1700} s={1.3} />
        {[[430, 1640], [560, 1600], [650, 1720], [500, 1760]].map(([x, y], i) => (
          <Bakteri key={i} x={x} y={y} s={0.6} el r={i * 12 - 18} />
        ))}
      </Makro>
      <Kronometre x={540} y={860} s={1.2} v="0.8" a={24} renk="#FFE1DC" />
      <g transform={`translate(540 1330) scale(${pop(t, sn - 0.1)})`}>
        <Etiket x={0} y={0} size={130} renk="#FF5A3A">
          <T en="UNDER 1 SEC" tr="1 SN'DEN AZ" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 8 · Wet food picks up the most. Karpuz dilimi ile jelibon. */
const S8: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Makro />
      <rect x={520} y={-600} width={40} height={3200} fill={INK} opacity={0.5} />
      {/* karpuz */}
      <g transform="translate(270 1130)">
        <path d="M-220 0 a220 220 0 0 1 440 0 Z" fill="#3FA65A" stroke={INK} strokeWidth={10} />
        <path d="M-190 0 a190 190 0 0 1 380 0 Z" fill="#FF5A6A" />
        {[[-90, -50], [0, -110], [80, -50], [-20, -30]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={9} ry={15} fill={INK} />
        ))}
        <path d="M-240 20 q240 60 480 0" stroke="#8FD3FF" strokeWidth={14} fill="none" opacity={0.8} />
      </g>
      {Array.from({ length: 10 }, (_, i) => (
        <Bakteri key={i} x={110 + rnd(i) * 320} y={980 + rnd(i + 7) * 150} s={0.42 * pop(t, 0.15 + i * 0.07)} r={rnd(i) * 60 - 30} />
      ))}
      {/* jelibon ayı */}
      <g transform="translate(810 1090)">
        <circle cx={-52} cy={-170} r={30} fill="#FFB02E" stroke={INK} strokeWidth={8} />
        <circle cx={52} cy={-170} r={30} fill="#FFB02E" stroke={INK} strokeWidth={8} />
        <path d="M-80 60 q-40 -230 80 -230 q120 0 80 230 q-10 50 -80 50 q-70 0 -80 -50 Z" fill="#FFB02E" stroke={INK} strokeWidth={10} />
        <circle cx={-26} cy={-110} r={8} fill={INK} />
        <circle cx={26} cy={-110} r={8} fill={INK} />
        <path d="M-40 -150 q20 -30 60 -20" stroke="#FFE0A0" strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
      <Bakteri x={830} y={1010} s={0.42 * pop(t, 0.5)} />
      <Etiket x={270} y={640} size={130} renk="#8FD3FF">
        <T en="WET" tr="ISLAK" />
      </Etiket>
      <Etiket x={810} y={640} size={130}>
        <T en="DRY" tr="KURU" />
      </Etiket>
    </Kadraj>
  );
};

/** 9 · And carpet is cleaner than tile. Halı ile fayans yan yana. */
const S9: React.FC = () => {
  const t = useTt();
  const tl = useAt('tile.');
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1100]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
      {/* halı */}
      <rect x={-500} y={1180} width={1040} height={1500} fill="#B04A7A" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 70 }, (_, i) => (
        <path key={i} d={`M${-20 + (i % 14) * 42} ${1210 + Math.floor(i / 14) * 150} q10 -40 0 -70`} stroke="#D46A9A" strokeWidth={12} strokeLinecap="round" fill="none" />
      ))}
      {/* fayans */}
      <rect x={540} y={1180} width={1060} height={1500} fill="#EFE9DC" stroke={INK} strokeWidth={10} />
      <path d="M810 1180 V2600 M540 1640 H1600" stroke="#C9BFA8" strokeWidth={14} />
      <rect x={520} y={-600} width={40} height={3200} fill={INK} />
      <Kurabiye x={270} y={1060} s={1.15} />
      <Kurabiye x={810} y={1060} s={1.15} />
      {[[230, 1010], [320, 1100]].map(([x, y], i) => (
        <Bakteri key={i} x={x} y={y} s={0.44 * pop(t, 0.3 + i * 0.1)} />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <Bakteri key={i} x={700 + rnd(i + 2) * 220} y={950 + rnd(i + 9) * 220} s={0.44 * pop(t, 0.3 + i * 0.06)} r={rnd(i) * 60 - 30} renk={i % 3 ? '#7BD64A' : '#B8E04A'} />
      ))}
      <Etiket x={270} y={640} size={104} renk="#FF9CC8">
        <T en="CARPET" tr="HALI" />
      </Etiket>
      <Etiket x={810} y={640} size={104} renk="#fff">
        <T en="TILE" tr="FAYANS" />
      </Etiket>
      <Onay x={270} y={800} s={pop(t, tl - 0.1) * 0.8} />
    </Kadraj>
  );
};

/** 10 · Really. Çizgi halıya şaşkın bakar. */
const S10: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.15, 1.25]} origin={[540, 900]} shakeAt={[0.05]} shake={12}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#B04A7A" />
      {Array.from({ length: 90 }, (_, i) => (
        <path key={i} d={`M${-60 + (i % 10) * 130} ${300 + Math.floor(i / 10) * 200} q14 -50 0 -90`} stroke="#D46A9A" strokeWidth={16} strokeLinecap="round" fill="none" />
      ))}
      <Cizgi x={540} y={2650} s={3.0} goz="sok" agiz="o" kas="kalkik" kolSag={[150, 20]} kolSol={[150, 20]} />
      <g transform={`translate(540 700) scale(${pop(t, 0.05)}) rotate(-4)`}>
        <Etiket x={0} y={0} size={170} renk="#fff">
          <T en="REALLY." tr="GERÇEKTEN." />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 12 · Would you still eat it? Mutfak, kurabiye yerde (çekim 1'e bağlanır). */
const S12: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[700, 1500]}>
      <Mutfak />
      <Cizgi x={300} y={1900} s={1.9} goz="yari" agiz="sirit" kas="kalkik" bakis={[1, 1]} kolSag={[50, 30]} kolSol={[20, 14]} />
      {[[560, 1560, -20], [930, 1580, 16], [1000, 1780, 30], [540, 1830, -30]].map(([x, y, r], i) => (
        <Bakteri key={i} x={x} y={y} s={0.9} r={r + Math.sin(f / 6 + i) * 6} el />
      ))}
      <Kurabiye x={760} y={1700} s={1.15} r={12} />
      <g transform={`translate(640 620) scale(${pop(t, 0.1)}) rotate(-5)`}>
        <Etiket x={0} y={0} size={160}>
          <T en="EAT IT?" tr="YER MİSİN?" />
        </Etiket>
      </g>
      <Zerre n={12} color="#fff" o={0.25} />
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's19',
  words: WORDS,
  voiceLen: 18.48,
  tail: 0.45,
  baslik: ['THE', '5-SECOND RULE'],
  vurgu: '#B8F06A',
  plan: [
    { w: 'Your', C: S1 },
    { w: 'Five', C: S2 },
    { w: 'Is', C: S3 },
    { w: 'Scientists', C: S4 },
    { w: 'More', C: S5 },
    { w: 'Bacteria', C: S6 },
    { w: 'less', C: S7 },
    { w: 'Wet', C: S8 },
    { w: 'And', C: S9 },
    { w: 'Really.', C: S10 },
    { w: 'So', C: S11 },
    { w: 'Would', C: S12 },
  ],
  cues: [
    ['impact', 'Your', 0, 0.14],
    ['tick', 'Five', 0, 0.22],
    ['tick', 'Five', 0.4, 0.22],
    ['whoosh', 'Scientists', 0, 0.14],
    ['click', 'tested', 0.1, 0.2],
    ['coins', 'More', 0.1, 0.1],
    ['pop', 'Bacteria', 0.2, 0.2],
    ['pop', 'jump', 0.1, 0.2],
    ['buzz', 'second.', 0, 0.1],
    ['whoosh', 'Wet', 0, 0.14],
    ['whoosh', 'And', 0, 0.14],
    ['ding', 'tile.', 0, 0.18],
    ['impact', 'Really.', 0, 0.12],
    ['pop', 'Would', 0, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S20_ILK, words: S20_WORDS },
});

export const S19 = short.Comp;
export const S19_FRAMES = short.frames;
