/**
 * S-23 "Phone at the gas pump". Doğru bildiğimiz yanlışlar serisi, yeni sistem.
 * Kaynak: PEI (Petroleum Equipment Institute) pompa yangını kayıtları: telefona bağlanan doğrulanmış vaka yok;
 * vakaların çoğu araca geri binip statik elektrik biriktirip tabancaya dokunurken oluşan kıvılcım. Öneri: önce metale dokun.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Onay } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu, Yildiz } from '../yb/ortak-yb';
import { S24_ILK, S24_WORDS } from '../s24/Video';
import raw from './words.json';

const WORDS = raw as Word[];
const KULAK: [number, number] = [120, -248]; // telefon kulakta

export const Telefon: React.FC<{ s?: number; r?: number; zil?: boolean }> = ({ s = 1, r = -20, zil = false }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`rotate(${r}) scale(${s})`}>
      <rect x={-26} y={-50} width={52} height={100} rx={10} fill="#11131C" stroke="#3A4060" strokeWidth={5} />
      <rect x={-20} y={-40} width={40} height={74} rx={5} fill="#7FD3FF" opacity={0.9} />
      {zil &&
        [0, 1, 2].map((i) => {
          const u = ((f / 30) * 1.8 + i / 3) % 1;
          return <path key={i} d={`M${40 + u * 50} -40 q${20 + u * 20} 40 0 80`} stroke="#FFD54A" strokeWidth={7} fill="none" opacity={1 - u} strokeLinecap="round" />;
        })}
    </g>
  );
};

/** İstasyonda Çizgi telefonla. */
const Istasyon: React.FC<{ goz?: 'acik' | 'mutlu' | 'sok' | 'yari'; agiz?: 'gulus' | 'acik' | 'o' | 'sirit' | 'duz'; kulak?: boolean; zil?: boolean; arkada?: boolean }> = ({
  goz = 'sok', agiz = 'o', kulak = true, zil = true, arkada = false,
}) => (
  <>
    <Arka b="03" />
    <Cizgi
      x={500}
      y={1300}
      s={0.62}
      goz={goz}
      agiz={agiz}
      kolSag={arkada ? [-30, -40] : kulak ? KULAK : [12, 10]}
      kolSol={[14, 12]}
      elSag={arkada ? undefined : <Telefon s={1.1} zil={zil} />}
      bakis={[-0.6, 0]}
    />
  </>
);

/** 1 · Phone at the gas pump? (0 sn: büyük BOOM?) */
export const S23_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.2, 2.3]} origin={[500, 984]}>
      <Istasyon />
      <Patla t={t} at={0} y={640} size={150} renk="#FF6B5A">
        BOOM?
      </Patla>
    </Sahne>
  );
};

/** 2 · It's fine. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.3, 2.35]} origin={[500, 984]}>
      <Istasyon goz="mutlu" agiz="gulus" zil={false} />
      <Ustu t={t} at={0.1} x={540} y={640} w={460} size={140}>
        BOOM
      </Ustu>
      <Duz>
        <g transform={`translate(880 560) scale(${pop(t, 0.3)})`}>
          <Onay x={0} y={0} s={0.6} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** Yangın raporu kartı. */
const Rapor: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-170} y={-220} width={340} height={440} rx={16} fill="#F1E9D8" stroke={INK} strokeWidth={10} />
    <path d="M-120 -150 h240 M-120 -100 h200 M-120 -50 h230 M-120 0 h160" stroke="#B9AE97" strokeWidth={14} strokeLinecap="round" />
    <path d="M0 150 q-40 -40 -10 -90 q10 30 30 30 q10 -30 -10 -60 q70 40 40 120 z" fill="#FF6B3A" stroke={INK} strokeWidth={8} />
  </g>
);

/** 3 · Experts have never traced... raporlar akıyor. */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.0, 1.08]}>
      <Arka b="03" bulanik karart={0.6} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = Math.min(1, Math.max(0, (f - i * 8) / 18));
        return <Rapor key={i} x={lerp(1400, 300 + i * 95, u)} y={980 + (i % 2) * 60} r={-14 + i * 6} s={0.9} />;
      })}
      <Etiket x={540} y={660} size={90}>
        FIRE REPORTS
      </Etiket>
    </Sahne>
  );
};

/** 4 · a single pump fire to a phone: 0. */
const S4: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="03" bulanik karart={0.65} />
      <Etiket x={540} y={660} size={90} renk="#F1E9D8">
        PHONE FIRES
      </Etiket>
      <g transform="translate(330 960)">
        <Telefon s={2.2 * pop(t, 0.05)} r={-8} />
      </g>
      <g transform={`translate(700 1180) scale(${pop(t, 0.35)})`}>
        <text textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={420} fill="#FFD54A" stroke={INK} strokeWidth={36} paintOrder="stroke">
          0
        </text>
      </g>
    </Sahne>
  );
};

/** 5 · The real danger is you. */
const S5: React.FC = () => {
  const t = useTt();
  const y = useAt('you.');
  return (
    <Sahne zoom={[1.7, 2.0]} origin={[500, 1000]} shakeAt={[y]} shake={8}>
      <Istasyon goz="sok" agiz="o" kulak={false} zil={false} />
      <Patla t={t} at={y} x={540} y={620} size={150} renk="#FF6B5A">
        YOU.
      </Patla>
    </Sahne>
  );
};

/** Araba koltuğu (yan görünüş) + kayan Çizgi + biriken statik yükler. */
const Koltuk: React.FC<{ kay: number; yuk: number; t: number }> = ({ kay, yuk }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M300 1260 h200 q40 0 40 40 v40 h-280 v-40 q0 -40 40 -40 z" fill="#2B2F48" stroke={INK} strokeWidth={10} />
      <path d="M300 1260 q-40 -10 -50 -60 l-60 -420 q-6 -50 44 -50 h30 q40 0 46 40 l50 490 z" fill="#323756" stroke={INK} strokeWidth={10} />
      <rect x={260} y={1340} width={280} height={200} fill="#1A1C2C" />
      <g transform={`translate(${lerp(-200, 0, kay)} 0)`}>
        <Cizgi x={380} y={1425} s={1.1} oturan goz="mutlu" agiz="gulus" kolSag={[30, 40]} kolSol={[20, 30]} golge={false} />
        {Array.from({ length: 12 }, (_, i) => {
          const o = interpolate(yuk, [i / 12, i / 12 + 0.1], [0, 1], clamp);
          const a = i * 2.1 + f / 20;
          return (
            <text key={i} x={400 + Math.cos(a) * 170 + 40} y={1050 + Math.sin(a * 1.3) * 200} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={64} fill="#7FD3FF" stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={o}>
              +
            </text>
          );
        })}
      </g>
    </g>
  );
};

/** 6 · Slide back into your seat, build up static. */
const S6: React.FC = () => {
  const t = useTt();
  const b = useAt('build');
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[480, 1200]}>
      <Arka b="03" bulanik karart={0.6} />
      <Panel x={110} y={600} w={860} h={1000} />
      <Koltuk t={t} kay={ap(t, 0, 0.6)} yuk={interpolate(t, [b, b + 1.2], [0, 1], clamp)} />
      <g opacity={ap(t, b + 0.3)}>
        <Etiket x={540} y={760} size={100} renk="#7FD3FF">
          STATIC
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Pompa yakın çekim (b04): Çizgi'nin eli tabancaya ya da kaportaya uzanıyor. */
const El: React.FC<{ hx: number; hy: number }> = ({ hx, hy }) => (
  <g>
    <path d={`M${hx + 520} ${hy + 520} L${hx + 120} ${hy + 120} L${hx} ${hy}`} stroke="#F2C21A" strokeWidth={90} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={hx} cy={hy} r={44} fill="#1B2033" />
  </g>
);

const Kivilcim: React.FC<{ x1: number; y1: number; x2: number; y2: number; o: number; kalin?: number }> = ({ x1, y1, x2, y2, o, kalin = 1 }) => {
  const f = useCurrentFrame();
  const n = 7;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const j = i === 0 || i === n ? 0 : Math.sin(f * 2.3 + i * 5) * 22;
    return `${lerp(x1, x2, u) + j},${lerp(y1, y2, u) - j * 0.5}`;
  }).join(' ');
  return (
    <g opacity={o}>
      <polyline points={pts} fill="none" stroke="#7FD3FF" strokeWidth={26 * kalin} filter="url(#s-glow)" />
      <polyline points={pts} fill="none" stroke="#fff" strokeWidth={10 * kalin} strokeLinejoin="round" />
    </g>
  );
};

/** 7 · grab the nozzle again. */
const S7: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0, 1.0);
  return (
    <Sahne zoom={[1.15, 1.25]} origin={[300, 760]}>
      <Arka b="04" />
      <El hx={lerp(560, 330, u)} hy={lerp(1150, 840, u)} />
      {Array.from({ length: 8 }, (_, i) => (
        <text key={i} x={lerp(560, 330, u) + 80 + (i % 4) * 60} y={lerp(1150, 840, u) + 60 + Math.floor(i / 4) * 70} fontFamily="Manrope Duz" fontWeight={800} fontSize={48} fill="#7FD3FF" stroke={INK} strokeWidth={6} paintOrder="stroke">
          +
        </text>
      ))}
    </Sahne>
  );
};

/** 8 · and spark. */
const S8: React.FC = () => {
  const t = useTt();
  const sp = useAt('spark.');
  const fl = interpolate(t, [sp, sp + 0.05, sp + 0.4], [0, 0.8, 0], clamp);
  return (
    <Sahne zoom={[1.4, 1.5]} origin={[300, 780]} shakeAt={[sp]} shake={20}>
      <Arka b="04" />
      <El hx={340} hy={850} />
      <Kivilcim x1={330} y1={810} x2={285} y2={700} o={t > sp ? 1 : 0} kalin={1.4} />
      <rect x={-200} y={-200} width={1480} height={2320} fill="#fff" opacity={fl} />
      <Patla t={t} at={sp} x={540} y={1080} size={140} renk="#FF6B5A">
        SPARK!
      </Patla>
    </Sahne>
  );
};

/** 9 · Touch the metal car first. */
const S9: React.FC = () => {
  const t = useTt();
  const m = useAt('metal');
  const u = ap(t, 0, 0.8);
  const dok = t > 0.8 ? 1 : 0;
  return (
    <Sahne zoom={[1.15, 1.22]} origin={[700, 800]}>
      <Arka b="04" />
      <El hx={lerp(1000, 820, u)} hy={lerp(1250, 900, u)} />
      <Kivilcim x1={815} y1={895} x2={800} y2={860} o={dok * interpolate(t, [0.8, 1.0], [1, 0], clamp)} kalin={0.5} />
      <g opacity={ap(t, m)}>
        <Etiket x={540} y={640} size={110}>
          METAL FIRST
        </Etiket>
      </g>
      <g transform={`translate(860 1080) scale(${pop(t, useAt('first.'))})`}>
        <Onay x={0} y={0} s={0.75} />
      </g>
    </Sahne>
  );
};

/** 10 · Still hiding your phone? */
const S10: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.2, 2.3]} origin={[500, 984]}>
      <Istasyon goz="yari" agiz="sirit" arkada zil={false} />
      <Patla t={t} at={0.1} y={640} size={96}>
        STILL HIDING IT?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's23',
  words: WORDS,
  voiceLen: 18.86,
  tail: 0.55,
  baslik: ['PHONE AT THE', 'GAS PUMP'],
  plan: [
    { w: 'Phone', C: S23_ILK },
    { w: "It's", C: S2 },
    { w: 'Experts', C: S3 },
    { w: 'single', C: S4 },
    { w: 'The', C: S5 },
    { w: 'Slide', C: S6 },
    { w: 'grab', C: S7 },
    { w: 'and', C: S8 },
    { w: 'Touch', C: S9 },
    { w: 'Still', C: S10 },
    { w: '@END', C: S23_ILK },
  ],
  cues: [
    ['alarm', 'Phone', 0, 0.06],
    ['impact', "It's", 0.1, 0.14],
    ['ding', "It's", 0.3, 0.18],
    ['printer', 'Experts', 0, 0.12],
    ['pop', 'phone.', 0, 0.25],
    ['impact', 'you.', 0, 0.14],
    ['whoosh', 'Slide', 0, 0.14],
    ['buzz', 'static,', 0, 0.12],
    ['whoosh', 'grab', 0, 0.1],
    ['impact', 'spark.', 0, 0.2],
    ['click', 'Touch', 0.75, 0.25],
    ['ding', 'first.', 0, 0.18],
    ['pop', 'Still', 0.1, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S24_ILK, words: S24_WORDS },
});

export const S23 = short.Comp;
export const S23_FRAMES = short.frames;
export const S23_WORDS = WORDS;
