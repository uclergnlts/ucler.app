/**
 * S-13 "An ant falls from a skyscraper". Dikey Short, ~19 sn.
 * Kaynak: J.B.S. Haldane, "On Being the Right Size" (1926): küçük hayvanlarda yüzey/kütle oranı çok büyük,
 * hava direnci ağırlığı hemen dengeler. Karıncanın limit hızı yaklaşık 6,4 km/sa (1,8 m/sn).
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre, T } from '../ortak';
import raw from './words.json';
import rawTr from './words-tr.json';

const WORDS = raw as Word[];
const WORDS_TR = rawTr as Word[];
const SARI = '#FFD54A';

/* ---------------- nesneler ---------------- */

/** Karınca (yandan). yuru: bacak salınımı, yuz: ifade. */
const Karinca: React.FC<{ x: number; y: number; s?: number; r?: number; yuz?: 'korku' | 'mutlu' | 'rahat'; yuru?: boolean; ayna?: boolean }> = ({ x, y, s = 1, r = 0, yuz = 'mutlu', yuru = false, ayna = false }) => {
  const f = useCurrentFrame();
  const w = yuru ? Math.sin(f / 2) * 16 : Math.sin(f / 9) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${ayna ? -s : s} ${s})`}>
      {/* bacaklar */}
      {[-34, 0, 34].map((bx, i) => (
        <g key={i}>
          <path d={`M${bx} 10 l${-26 + (i % 2 ? w : -w)} 34 l${-10} 34`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${bx + 8} 10 l${26 + (i % 2 ? -w : w)} 34 l${10} 34`} stroke="#3A2118" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {/* gövde: karın, göğüs, baş */}
      <ellipse cx={-92} cy={-6} rx={66} ry={46} fill="#7A3B22" stroke={INK} strokeWidth={7} />
      <path d="M-130 -24 q36 -22 76 -6" stroke="#B5694A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.7} />
      <ellipse cx={0} cy={0} rx={40} ry={30} fill="#8C4628" stroke={INK} strokeWidth={7} />
      <circle cx={70} cy={-14} r={46} fill="#8C4628" stroke={INK} strokeWidth={7} />
      {/* antenler */}
      <path d={`M84 -52 q20 -50 ${56 + w / 2} -56`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M62 -56 q4 -52 ${36 + w / 2} -70`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* yüz */}
      <ellipse cx={62} cy={-22} rx={11} ry={14} fill="#fff" stroke={INK} strokeWidth={3} />
      <ellipse cx={92} cy={-22} rx={11} ry={14} fill="#fff" stroke={INK} strokeWidth={3} />
      {yuz === 'rahat' ? (
        <g>
          <path d="M52 -20 h20 M82 -20 h20" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx={65} cy={-19} r={5} fill={INK} />
          <circle cx={95} cy={-19} r={5} fill={INK} />
        </g>
      )}
      {yuz === 'korku' && <ellipse cx={80} cy={8} rx={9} ry={11} fill={INK} />}
      {yuz !== 'korku' && <path d="M66 4 q14 12 28 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
    </g>
  );
};

/** Gün batımı göğü. */
const Gok: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="k-gok" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2F6B" />
        <stop offset="0.55" stopColor="#C2607C" />
        <stop offset="1" stopColor="#FFB86B" />
      </linearGradient>
    </defs>
    <rect x={-500} y={-500} width={2100} height={2900} fill="url(#k-gok)" />
    <circle cx={800} cy={1180} r={260} fill="#FFE2A8" opacity={0.35} filter="url(#s-glow)" />
    <circle cx={800} cy={1180} r={120} fill="#FFE9B8" />
  </g>
);

/** Uzak şehir silueti. */
const Siluet: React.FC<{ y: number; c?: string; o?: number }> = ({ y, c = '#3A2F5C', o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: 12 }, (_, i) => {
      const h = 220 + ((i * 137) % 420);
      return (
        <g key={i}>
          <rect x={-120 + i * 112} y={y - h} width={100} height={h + 900} fill={c} />
          {Array.from({ length: 5 }, (_, j) => (
            <rect key={j} x={-104 + i * 112 + (j % 2) * 44} y={y - h + 30 + j * 52} width={22} height={26} fill="#FFC65A" opacity={(i + j) % 3 ? 0.55 : 0} />
          ))}
        </g>
      );
    })}
  </g>
);

/** Cam cepheli gökdelen (yandan, sol kenarda). */
const Kule: React.FC<{ x: number; w?: number; top?: number }> = ({ x, w = 380, top = -400 }) => (
  <g>
    <rect x={x} y={top} width={w} height={3000} fill="#3F4A7A" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 34 }, (_, i) =>
      Array.from({ length: 4 }, (_, j) => <rect key={`${i}-${j}`} x={x + 22 + j * ((w - 30) / 4)} y={top + 40 + i * 84} width={(w - 30) / 4 - 16} height={52} fill={(i * 3 + j) % 4 ? '#FFC65A' : '#22284A'} opacity={0.75} />),
    )}
    <rect x={x + w - 26} y={top} width={26} height={3000} fill="#6B78AE" opacity={0.6} />
  </g>
);

/** Kaldırım ve cadde (yer seviyesi). */
const Kaldirim: React.FC = () => (
  <g>
    <Gok />
    <Siluet y={1250} c="#4A3A6A" o={0.8} />
    <Kule x={-140} w={360} top={-500} />
    <rect x={-300} y={1300} width={1700} height={1100} fill="#4A4460" />
    <rect x={-300} y={1300} width={1700} height={26} fill="#8A82A6" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${-200 + i * 190} 1326 l-60 900`} stroke="#3A3550" strokeWidth={5} />
    ))}
    {[1480, 1700].map((yy, i) => (
      <path key={i} d={`M-300 ${yy} H1400`} stroke="#3A3550" strokeWidth={5} />
    ))}
    {/* sokak lambası ve yangın musluğu */}
    <path d="M940 1300 V620 q0 -50 -70 -50 h-70" stroke="#1B1F33" strokeWidth={16} fill="none" />
    <circle cx={800} cy={586} r={22} fill="#FFE9B8" />
    <circle cx={800} cy={586} r={130} fill="#FFE9B8" opacity={0.3} filter="url(#s-glow)" />
    <g transform="translate(330 1300)">
      <rect x={-34} y={-130} width={68} height={130} rx={12} fill="#D93036" stroke={INK} strokeWidth={7} />
      <rect x={-46} y={-150} width={92} height={30} rx={12} fill="#D93036" stroke={INK} strokeWidth={7} />
      <rect x={-60} y={-90} width={30} height={34} rx={8} fill="#D93036" stroke={INK} strokeWidth={7} />
    </g>
  </g>
);

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

const Ok: React.FC<{ x: number; y: number; len: number; yukari?: boolean; renk: string; w?: number }> = ({ x, y, len, yukari = false, renk, w = 44 }) => {
  const d = yukari ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 0 V${d * len}`} stroke={INK} strokeWidth={w + 14} strokeLinecap="round" />
      <path d={`M${-w} ${d * (len - w)} L0 ${d * (len + w * 0.6)} L${w} ${d * (len - w)}`} stroke={INK} strokeWidth={w + 14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M0 0 V${d * len}`} stroke={renk} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${-w} ${d * (len - w)} L0 ${d * (len + w * 0.6)} L${w} ${d * (len - w)}`} stroke={renk} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/** 1 · An ant falls off a skyscraper. Çatı, korkuluk, büyüteçli Çizgi. (loop karesi) */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const d = ap(t, 0.5, 1.4, (x) => x * x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[620, 1000]}>
      <Gok />
      <Siluet y={1500} c="#4A3A6A" o={0.7} />
      <Siluet y={1750} c="#33284F" />
      {/* çatı zemini ve korkuluk */}
      <rect x={-300} y={1500} width={1000} height={900} fill="#2A2F4F" />
      <rect x={-300} y={1500} width={1000} height={26} fill="#7C86B8" />
      <rect x={-300} y={1150} width={1000} height={26} rx={10} fill="#1B1F33" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-260 + i * 132} y={1160} width={18} height={350} fill="#1B1F33" />
      ))}
      {/* çatıdaki su deposu ve anten */}
      <rect x={-60} y={1250} width={170} height={250} rx={20} fill="#56608F" stroke={INK} strokeWidth={7} />
      <path d="M180 1500 V900 M150 960 h60 M160 1020 h40" stroke="#1B1F33" strokeWidth={10} />
      <circle cx={180} cy={900} r={12} fill="#FF4040" opacity={f % 30 < 15 ? 1 : 0.3} />
      <Cizgi
        x={380}
        y={1580}
        s={1.15}
        goz="sok"
        agiz="o"
        kas="kalkik"
        egim={10}
        bakis={[1, 0.4]}
        kolSag={[84, 24]}
        elSag={
          <g>
            <path d="M0 0 l60 -60" stroke="#6B4A2A" strokeWidth={16} strokeLinecap="round" />
            <circle cx={96} cy={-96} r={56} fill="#BFEFFF" opacity={0.45} stroke={INK} strokeWidth={10} />
          </g>
        }
      />
      {/* karınca korkuluğun ucundan kayıp düşer */}
      <Karinca x={lerp(730, 800, d)} y={lerp(1116, 1420, d)} s={0.62} r={d * 150} yuz="korku" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${760 + i * 26} ${lerp(1080, 1330, d) - i * 40} v-70`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.5 * d} />
      ))}
    </Kadraj>
  );
};

/** 2 · Three hundred meters. Cam cephe boyunca düşüş, ölçek. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 960]}>
      <Gok />
      <Siluet y={1900} c="#33284F" o={0.9} />
      <g transform={`translate(0 ${-((f * 16) % 84)})`}>
        <Kule x={-60} w={420} top={-500} />
      </g>
      <Karinca x={600 + Math.sin(f / 6) * 26} y={860 + Math.sin(f / 4) * 20} s={1.15} r={f * 6} yuz="korku" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${520 + i * 60} ${640 - ((f * 14 + i * 60) % 220)} v-110`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
      ))}
      <g opacity={ap(t, 0.05, 0.3)}>
        <path d="M950 480 V1330" stroke="#fff" strokeWidth={7} strokeDasharray="22 16" />
        <path d="M928 504 l22 -28 l22 28 M928 1306 l22 28 l22 -28" stroke="#fff" strokeWidth={7} fill="none" />
        <g transform={`translate(910 1180) scale(${pop(t, 0.1)})`}>
          <Etiket x={0} y={0} size={120} anchor="end">300 m</Etiket>
        </g>
      </g>
    </Kadraj>
  );
};

/** 3 · It walks away. Kaldırıma konar, silkelenir, yürür. */
const S3: React.FC = () => {
  const t = useTt();
  const land = 0.45;
  const u = ap(t, 0, land, (x) => x);
  const yuru = t > land + 0.5;
  const wx = yuru ? (t - land - 0.5) * 150 : 0;
  const sq = t > land ? Math.exp(-(t - land) * 7) * Math.sin((t - land) * 26) : 0;
  return (
    <Kadraj zoom={[1.5, 1.6]} origin={[560, 1250]}>
      <Kaldirim />
      <ellipse cx={540 + wx} cy={1420} rx={120} ry={22} fill="#000" opacity={0.25} />
      <g transform={`translate(${540 + wx} ${lerp(500, 1340, u)}) scale(${1 + sq * 0.12} ${1 - sq * 0.14})`}>
        <Karinca x={0} y={0} s={0.9} r={t < land ? 40 - u * 40 : 0} yuz={t < land ? 'korku' : 'mutlu'} yuru={yuru} />
      </g>
      {t > land && t < land + 0.5 &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={540 + (i - 2) * 70 * ap(t, land, 0.4)} cy={1410 - Math.sin(ap(t, land, 0.4) * Math.PI) * 40} r={16} fill="#D8D2E8" opacity={1 - ap(t, land, 0.5)} />
        ))}
    </Kadraj>
  );
};

/** 4 · Why? Çizgi yakın çekim, kafasını kaşır, dev soru işareti. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <Kaldirim />
      <rect x={-300} y={-300} width={1700} height={2500} fill="#141828" opacity={0.45} />
      <Cizgi x={470} y={2150} s={2.2} goz="yukari" agiz="duz" kas="kalkik" bakis={[1, -1]} kolSag={[160, 60 + Math.sin(f / 3) * 12]} kolSol={[14, 10]} />
      <g transform={`translate(820 760) rotate(${Math.sin(f / 8) * 8}) scale(${pop(t, 0.05)})`}>
        <Etiket x={0} y={0} size={420}>?</Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · The ant is so light... Dev karınca, yer çekimi oku (küçük). */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Gok />
      <rect x={-300} y={-300} width={1700} height={2500} fill="#1B1F33" opacity={0.5} />
      <circle cx={540} cy={850} r={480} fill="#FFB86B" opacity={0.22} filter="url(#s-glow)" />
      <Karinca x={560} y={800 + Math.sin(f / 9) * 10} s={2.4} yuz="mutlu" />
      <g opacity={ap(t, 0.5, 0.3)}>
        <Ok x={540} y={1010} len={lerp(0, 150, ap(t, 0.5, 0.4))} renk="#FF5A3A" />
        <Etiket x={720} y={1150} size={74} renk="#FF8A6A" anchor="start"><T en="0.003 g" tr="0,003 g" /></Etiket>
      </g>
      <Zerre n={22} color="#FFE2A8" o={0.35} />
    </Kadraj>
  );
};

/** 6 · air pushes back almost as hard as gravity pulls. İki ok eşitlenir. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const g = useAt('gravity');
  const hava = lerp(20, 150, ap(t, 0, g - 0.2));
  const esit = t > g - 0.1;
  return (
    <Kadraj zoom={[1.06, 1.12]} origin={[540, 900]}>
      <Gok />
      <rect x={-300} y={-300} width={1700} height={2500} fill="#1B1F33" opacity={0.5} />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${120 + i * 140} ${1500 - ((f * 12 + i * 170) % 1100)} v-120`} stroke="#8FD3FF" strokeWidth={8} strokeLinecap="round" opacity={0.35} />
      ))}
      <Karinca x={560} y={830 + Math.sin(f / 7) * 8} s={2.0} yuz={esit ? 'rahat' : 'mutlu'} />
      <Ok x={540} y={1010} len={150} renk="#FF5A3A" />
      <Ok x={540} y={600} len={hava} yukari renk="#5FC8FF" />
      <g transform={`translate(860 800) scale(${pop(t, g - 0.1)})`}>
        <circle r={96} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
        <path d="M-44 -18 h88 M-44 22 h88" stroke="#fff" strokeWidth={22} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

/** 7 · It never gets faster than about six kilometers an hour. İbre 6'da takılır. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const six = useAt('6');
  const v = Math.min(6, ap(t, 0, 0.8) * 6) + (t > 0.8 ? Math.sin(f / 2) * 0.15 : 0);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#141828" />
      <circle cx={540} cy={960} r={470} fill="#C2607C" opacity={0.2} filter="url(#s-glow)" />
      <g transform="translate(540 980)">
        <circle r={330} fill="#1B1F33" stroke="#C9D2E3" strokeWidth={16} />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} transform={`rotate(${-120 + i * 30})`}>
            <path d="M0 -296 v40" stroke={i > 1 ? '#5B6487' : '#C9D2E3'} strokeWidth={10} />
            <text x={0} y={-210} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={42} fill={i > 1 ? '#5B6487' : '#C9D2E3'} transform={`rotate(${120 - i * 30} 0 -222)`}>
              {i * 5}
            </text>
          </g>
        ))}
        <path d="M0 0 V-250" stroke="#FF5A3A" strokeWidth={16} strokeLinecap="round" transform={`rotate(${-120 + (v / 40) * 240})`} />
        <circle r={30} fill="#FF5A3A" />
      </g>
      <g transform={`translate(540 1180) scale(${pop(t, six - 0.1)})`}>
        <Etiket x={0} y={0} size={130}><T en="6 km/h" tr="6 km/sa" /></Etiket>
      </g>
      <Karinca x={760} y={610 + Math.sin(f / 6) * 14} s={0.8} r={-14} yuz="rahat" />
    </Kadraj>
  );
};

/** 8 · That is walking speed. Çizgi ve karınca yan yana yürür. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const x = lerp(-100, 240, ap(t, 0, 2.0, (q) => q));
  return (
    <Kadraj zoom={[1.0, 1.06]} origin={[540, 1100]}>
      <g transform={`translate(${-x * 0.6} 0)`}>
        <Kaldirim />
      </g>
      <Cizgi x={360 + x} y={1420} s={1.25} goz="mutlu" agiz="sirit" bakis={[1, 1]} bacak={Math.sin(f / 4) * 26} kolSol={[20 + Math.sin(f / 4) * 24, 14]} kolSag={[20 - Math.sin(f / 4) * 24, 14]} />
      <Karinca x={640 + x} y={1370} s={0.55} yuz="mutlu" yuru />
      <g transform={`translate(600 700) scale(${pop(t, 0.3)})`}>
        <Etiket x={0} y={0} size={110}><T en="6 km/h" tr="6 km/sa" /></Etiket>
        <path d="M-200 40 H200" stroke={SARI} strokeWidth={10} strokeLinecap="round" />
      </g>
    </Kadraj>
  );
};

/** 9 · For an ant, no building is too tall. Karınca daha yüksek kuleye bakar, omuz silker. */
const S9: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const tall = useAt('tall.');
  return (
    <Kadraj zoom={[1.0, 1.0]} pan={[[0, -260], [0, 0]]} origin={[540, 960]}>
      <Gok />
      <Siluet y={1500} c="#4A3A6A" o={0.8} />
      {/* göğe uzanan dev kule */}
      <polygon points="330,1500 750,1500 640,-900 440,-900" fill="#3F4A7A" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 34 }, (_, i) => {
        const y = 1440 - i * 68;
        const w = lerp(400, 200, (1500 - y) / 2400);
        return Array.from({ length: 4 }, (_, j) => <rect key={`${i}-${j}`} x={540 - w / 2 + 12 + j * (w / 4)} y={y} width={w / 4 - 18} height={40} fill={(i + j * 2) % 3 ? '#FFC65A' : '#22284A'} opacity={0.75} />);
      })}
      <path d="M540 -900 V-1060" stroke="#C9D2E3" strokeWidth={10} />
      <circle cx={540} cy={-1060} r={12} fill="#FF4040" opacity={f % 30 < 15 ? 1 : 0.3} />
      <rect x={-300} y={1500} width={1700} height={900} fill="#4A4460" />
      <rect x={-300} y={1500} width={1700} height={24} fill="#8A82A6" />
      <ellipse cx={560} cy={1700} rx={200} ry={30} fill="#000" opacity={0.25} />
      <g transform={`translate(560 1600) rotate(${-18 - ap(t, tall - 0.2, 0.3) * 6})`}>
        <Karinca x={0} y={0} s={1.5} yuz={t > tall - 0.2 ? 'rahat' : 'mutlu'} />
      </g>
      <g transform={`translate(840 1330) scale(${pop(t, tall - 0.1)})`}>
        <Etiket x={0} y={0} size={96} renk="#fff"><T en="easy." tr="kolay." /></Etiket>
      </g>
    </Kadraj>
  );
};

const AYAR: Parameters<typeof makeShort>[0] = {
  kod: 's13',
  words: WORDS,
  voiceLen: 17.18,
  tail: 0.7,
  baslik: ['ANT FALLS', 'FROM A SKYSCRAPER'],
  vurgu: '#FF9A6A',
  plan: [
    { w: 'An', C: S1 },
    { w: '300', C: S2 },
    { w: 'It', C: S3 },
    { w: 'Why?', C: S4 },
    { w: 'The', C: S5 },
    { w: 'air', C: S6 },
    { w: 'It#2', C: S7 },
    { w: 'That', C: S8 },
    { w: 'For', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['whoosh', 'falls', 0, 0.22],
    ['riser', '300', 0, 0.14],
    ['pop', 'It', 0.4, 0.3],
    ['ding', 'Why?', 0, 0.16],
    ['tick', 'light', 0, 0.2],
    ['whoosh', 'air', 0, 0.16],
    ['ding', 'gravity', 0, 0.18],
    ['buzz', 'never', 0, 0.1],
    ['click', 'walking', 0, 0.2],
    ['pop', 'tall.', -0.1, 0.25],
  ],
  muzik: ['music-happy', 0.06],
};
const short = makeShort(AYAR);

export const S13 = short.Comp;
export const S13_FRAMES = short.frames;

/** Türkçe sürüm (Instagram): aynı sahneler, Türkçe ses, çapalar EN kelime -> TR kelime. */
const shortTr = makeShort({
  ...AYAR,
  kod: 's13tr',
  words: WORDS_TR,
  voiceLen: 17.92,
  baslik: ["KARINCA", "GÖKDELENDEN DÜŞTÜ"],
  dil: 'tr',
  esle: {"An": "Bir", "300": "Üç", "It": "Sonra", "Why?": "Neden", "The": "Karınca", "air": "hava", "It#2": "Hızı", "That": "Bu", "For": "Bir#2", "6": "altı", "gravity": "güçlü", "tall.": "değildir", "falls": "düşüyor", "light": "hafiftir", "never": "hiç", "walking": "yürüme"},
});
export const S13TR = shortTr.Comp;
export const S13TR_FRAMES = shortTr.frames;
