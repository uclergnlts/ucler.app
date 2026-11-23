/**
 * S-26 "Carrots for night vision?". Doğru bildiğimiz yanlışlar serisi, yeni sistem.
 * Kaynak: Imperial War Museums ve Smithsonian Magazine: 1940-41'de İngiliz gece avcılarının başarısı yeni hava radarına
 * dayanıyordu; Hava Bakanlığı bunu gizlemek için pilotların bol havuç yediği hikâyesini yaydı. NIH: A vitamini eksikliği
 * gece körlüğü yapar, fazlası normal görüşü artırmaz.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Onay } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import raw from './words.json';

const WORDS = raw as Word[];

export const Havuc: React.FC<{ s?: number; r?: number; isirik?: number }> = ({ s = 1, r = 0, isirik = 0 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d={`M-22 0 L22 0 L${4 - isirik * 2} ${130 - isirik * 60} q-4 8 -8 0 Z`} fill="#FF8A2A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-12 30 h10 M2 60 h12 M-8 90 h8" stroke="#C9641A" strokeWidth={5} strokeLinecap="round" />
    <path d="M0 0 q-20 -40 -36 -50 M0 0 q0 -40 6 -60 M0 0 q20 -30 34 -40" stroke="#4FB848" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

/** Yatak odasında Çizgi havuç yiyor. */
const Oda: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu' | 'sikis'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz' | 'eksi'; gozluk?: boolean }> = ({ goz = 'sikis', agiz = 'acik', gozluk = false }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Arka b="09" />
      <Cizgi x={470} y={1450} s={1.0} goz={goz} agiz={agiz} bakis={[0.4, -0.2]} kolSag={[110, -170]} kolSol={[12, 10]} elSag={<Havuc s={0.9} r={200 + Math.sin(f / 3) * 6} isirik={((f / 30) % 1) * 0.6} />} />
      {gozluk && (
        <g transform="translate(470 893)">
          <rect x={-78} y={-30} width={68} height={50} rx={18} fill="#3B2A1A" stroke={INK} strokeWidth={6} />
          <rect x={10} y={-30} width={68} height={50} rx={18} fill="#3B2A1A" stroke={INK} strokeWidth={6} />
          <rect x={-70} y={-22} width={52} height={34} rx={12} fill="#9FD8FF" opacity={0.7} />
          <rect x={18} y={-22} width={52} height={34} rx={12} fill="#9FD8FF" opacity={0.7} />
        </g>
      )}
    </>
  );
};

/** 1 · Carrots for night vision? */
export const S26_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.5, 1.58]} origin={[520, 900]}>
      <Oda />
      <Patla t={t} at={0} y={600} size={120} renk="#FF8A2A">
        NIGHT VISION?
      </Patla>
    </Sahne>
  );
};

/** 2 · A war lie. */
const S2: React.FC = () => {
  const t = useTt();
  const w = useAt('war');
  return (
    <Sahne zoom={[1.58, 1.62]} origin={[520, 860]}>
      <Oda goz="sok" agiz="o" />
      <Ustu t={t} at={0.05} y={560} w={780} size={120}>
        NIGHT VISION
      </Ustu>
      <Duz>
      <g transform={`translate(540 700) rotate(-8) scale(${0.8 * pop(t, w)})`}>
        <rect x={-260} y={-80} width={520} height={130} rx={14} fill="none" stroke="#FF4A3A" strokeWidth={14} />
        <text y={30} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={96} fill="#FF4A3A">
          WAR LIE
        </text>
      </g>
      </Duz>
    </Sahne>
  );
};

/** Uçak silueti (üstten değil yandan): bombardıman ya da avcı. */
const Ucak: React.FC<{ x: number; y: number; s?: number; r?: number; renk?: string; avci?: boolean }> = ({ x, y, s = 1, r = 0, renk = '#141526', avci = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d={avci ? 'M-120 0 q60 -24 200 -8 q20 4 30 8 q-10 6 -30 8 q-140 12 -200 -8 z' : 'M-200 0 q80 -36 330 -12 q30 4 40 12 q-10 10 -40 12 q-250 20 -330 -12 z'} fill={renk} />
    <path d={avci ? 'M-20 -2 l-50 -60 h30 l60 60 z M-20 4 l-30 50 h24 l40 -50 z' : 'M-40 -4 l-80 -110 h50 l100 110 z M-40 6 l-60 90 h44 l80 -90 z'} fill={renk} />
    <path d={avci ? 'M-110 -6 l-26 -34 h18 l26 30 z' : 'M-190 -8 l-34 -50 h26 l36 48 z'} fill={renk} />
  </g>
);

/** 3 · In 1940 (projektörler). */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 900]}>
      <Arka b="10" />
      <Patla t={t} at={0.15} y={760} size={240}>
        1940
      </Patla>
    </Sahne>
  );
};

/** 4 · British pilots kept finding... */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.1, 1.18]} origin={[540, 900]}>
      <Arka b="10" />
      <Ucak x={lerp(-200, 1300, (f / 30) / 1.7)} y={lerp(1000, 760, (f / 30) / 1.7)} s={1.1} r={-8} avci renk="#1B2438" />
      <g opacity={ap(t, 0.2)}>
        <Etiket x={540} y={1200} size={80} renk="#F1E9D8">
          BRITISH PILOT
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 5 · German bombers in the dark: nişangâhlar. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const B: [number, number][] = [
    [300, 640],
    [640, 560],
    [820, 760],
  ];
  return (
    <Sahne zoom={[1.1, 1.2]} origin={[540, 800]}>
      <Arka b="10" karart={0.2} />
      {B.map(([x, y], i) => (
        <g key={i}>
          <Ucak x={x + (f / 30) * 40} y={y} s={0.7} r={4} />
          <g opacity={ap(t, 0.3 + i * 0.35)} transform={`translate(${x + (f / 30) * 40} ${y}) scale(${1.6 - 0.6 * ap(t, 0.3 + i * 0.35)})`}>
            <circle r={110} fill="none" stroke="#FF4A3A" strokeWidth={8} />
            <path d="M-140 0 h60 M80 0 h60 M0 -140 v60 M0 80 v60" stroke="#FF4A3A" strokeWidth={8} />
          </g>
        </g>
      ))}
      <g opacity={ap(t, useAt('dark.'))}>
        <Etiket x={540} y={1180} size={90}>
          FOUND. AGAIN.
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Radar ekranı: b11'deki yeşil ekranın üstüne tarama + noktalar. */
const RX = 540;
const RY = 911;
const Radar: React.FC<{ t: number; blip?: number }> = ({ t, blip = 1 }) => {
  const a = t * 2.6;
  return (
    <g>
      <path d={`M${RX} ${RY} L${RX + Math.cos(a) * 165} ${RY + Math.sin(a) * 165}`} stroke="#B8FFB0" strokeWidth={8} opacity={0.9} />
      {[
        [60, -70],
        [-50, 40],
        [90, 50],
      ].map(([dx, dy], i) => (
        <circle key={i} cx={RX + dx} cy={RY + dy} r={12} fill="#E8FFE0" opacity={blip * (0.5 + 0.5 * Math.sin(t * 6 + i))} filter="url(#s-soft)" />
      ))}
    </g>
  );
};

/** 6 · The secret was... */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.15, 1.3]} origin={[540, 950]}>
      <Arka b="11" />
      <Radar t={t} blip={ap(t, 0.4)} />
      <Patla t={t} at={0.2} y={560} size={120} renk="#B8FFB0">
        SECRET
      </Patla>
    </Sahne>
  );
};

/** 7 · a brand new radar. */
const S7: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.0, 2.2]} origin={[RX, RY]}>
      <Arka b="11" />
      <Radar t={t} />
      <g opacity={ap(t, useAt('radar.'))}>
        <Etiket x={RX} y={RY + 250} size={70} renk="#B8FFB0">
          RADAR
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 8 · To hide it: radarın üstüne örtü + GİZLİ damgası. */
const S8: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 0.5);
  return (
    <Sahne zoom={[1.15, 1.2]} origin={[540, 950]}>
      <Arka b="11" />
      <Radar t={t} />
      <path d={`M300 ${lerp(300, 700, u)} h480 v${lerp(0, 480, u)} h-480 z`} fill="#3A2C4A" stroke={INK} strokeWidth={10} />
      <g transform={`translate(540 940) rotate(-10) scale(${pop(t, 0.5)})`}>
        <rect x={-250} y={-75} width={500} height={130} rx={12} fill="none" stroke="#FF4A3A" strokeWidth={14} />
        <text y={30} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={90} fill="#FF4A3A">
          TOP SECRET
        </text>
      </g>
    </Sahne>
  );
};

/** Propaganda afişi: havuç + pilot gözlüğü. */
const Afis: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-420} width={600} height={840} rx={10} fill="#F1E2C0" stroke={INK} strokeWidth={14} />
    <rect x={-270} y={-390} width={540} height={780} fill="#1F3550" />
    <circle cx={0} cy={-120} r={190} fill="#F5C518" opacity={0.85} />
    <g transform="translate(0 -170)">
      <Havuc s={2.6} r={30} />
    </g>
    <g transform="translate(30 -240) rotate(30)">
      <rect x={-80} y={-26} width={66} height={48} rx={16} fill="#3B2A1A" stroke={INK} strokeWidth={6} />
      <rect x={14} y={-26} width={66} height={48} rx={16} fill="#3B2A1A" stroke={INK} strokeWidth={6} />
    </g>
    <text y={190} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={86} fill="#F1E2C0">
      EAT
    </text>
    <text y={290} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={86} fill="#FF8A2A">
      CARROTS
    </text>
  </g>
);

/** 9 · Britain told everyone. */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Arka b="10" bulanik karart={0.35} />
      <g transform={`translate(0 ${lerp(300, 0, ap(t, 0, 0.5))})`}>
        <Afis x={540} y={1020} s={1.0} />
      </g>
    </Sahne>
  );
};

/** 10 · our pilots eat lots of carrots: Çizgi pilot gözlüğüyle havuç yiyor. */
const S10: React.FC = () => {
  const t = useTt();
  const l = useAt('lots');
  return (
    <Sahne zoom={[1.5, 1.6]} origin={[520, 900]}>
      <Oda goz="mutlu" agiz="acik" gozluk />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${640 + i * 60} ${lerp(500, 820 - i * 4, ap(t, l + i * 0.12, 0.3))}) rotate(${80 + i * 10})`} opacity={t > l + i * 0.12 ? 1 : 0}>
          <Havuc s={0.8} />
        </g>
      ))}
    </Sahne>
  );
};

/** 11 · Carrots keep your eyes healthy: göz kesiti + onay. */
const S11: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="09" bulanik karart={0.55} />
      <Panel x={140} y={560} w={800} h={900} />
      <g transform="translate(540 980)">
        <circle r={260} fill="#F1E9D8" stroke={INK} strokeWidth={12} />
        <circle cx={150} r={110} fill="#5FA8E8" stroke={INK} strokeWidth={10} />
        <circle cx={190} r={50} fill={INK} />
        <path d="M-250 -60 q-30 60 0 120" stroke="#FF8FB1" strokeWidth={30} fill="none" strokeLinecap="round" />
        <circle cx={230} cy={-30} r={14} fill="#fff" />
      </g>
      <g transform={`translate(780 700) scale(${pop(t, useAt('healthy.'))})`}>
        <Onay x={0} y={0} s={0.8} />
      </g>
      <g opacity={ap(t, 0.3)}>
        <Etiket x={540} y={660} size={80}>
          VITAMIN A
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 12 · They do not give you night vision. */
const S12: React.FC = () => {
  const t = useTt();
  const n = useAt('night#2');
  return (
    <Sahne zoom={[1.5, 1.58]} origin={[520, 900]}>
      <Arka b="09" karart={0.55} />
      <Cizgi x={470} y={1450} s={1.0} goz="sikis" agiz="eksi" kolSol={[40, 40]} kolSag={[40, 40]} bakis={[0, 0]} />
      <Ustu t={t} at={n} y={640} w={780} size={120}>
        NIGHT VISION
      </Ustu>
      <Duz>
        <g transform={`translate(900 480) scale(${pop(t, n)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 13 · Fooled? */
const S13: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.55, 1.6]} origin={[520, 900]}>
      <Oda goz="yari" agiz="sirit" />
      <Patla t={t} at={0.02} y={600} size={150}>
        FOOLED?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's26',
  words: WORDS,
  voiceLen: 20.67,
  tail: 0.55,
  baslik: ['CARROTS AND', 'NIGHT VISION'],
  plan: [
    { w: 'Carrots', C: S26_ILK },
    { w: 'A', C: S2 },
    { w: 'In', C: S3 },
    { w: 'British', C: S4 },
    { w: 'German', C: S5 },
    { w: 'The', C: S6 },
    { w: 'brand', C: S7 },
    { w: 'To', C: S8 },
    { w: 'told', C: S9 },
    { w: 'our', C: S10 },
    { w: 'Carrots#2', C: S11 },
    { w: 'They', C: S12 },
    { w: 'Fooled?', C: S13 },
    { w: '@END', C: S26_ILK },
  ],
  cues: [
    ['chomp', 'Carrots', 0, 0.3],
    ['impact', 'war', 0, 0.16],
    ['drone', 'In', 0, 0.12],
    ['whoosh', 'British', 0, 0.16],
    ['alarm', 'German', 0.2, 0.05],
    ['buzz', 'secret', 0, 0.08],
    ['ding', 'radar.', 0, 0.16],
    ['gavel', 'To', 0.5, 0.18],
    ['whoosh', 'told', 0, 0.14],
    ['chomp', 'lots', 0, 0.3],
    ['ding', 'healthy.', 0, 0.18],
    ['impact', 'night#2', 0, 0.14],
    ['pop', 'Fooled?', 0, 0.22],
  ],
  muzik: ['music-happy', 0.06],
});

export const S26 = short.Comp;
export const S26_FRAMES = short.frames;
export const S26_WORDS = WORDS;
