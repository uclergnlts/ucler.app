/**
 * S-28 "Swim right after lunch?". Doğru bildiğimiz yanlışlar, 2. parti.
 * Kaynak: American Red Cross Scientific Advisory Council (2011): yemekten sonra yüzmeyle boğulma arasında kanıt yok.
 * CDC: yetişkin boğulmalarında alkol başlıca etkenlerden.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Kronometre, Ok } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S29_ILK, S29_WORDS } from '../s29/Video';
import raw from './words.json';

const WORDS = raw as Word[];

const Sandvic: React.FC<{ s?: number; r?: number }> = ({ s = 1, r = 0 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d="M-70 10 q70 -60 140 0 z" fill="#E9B95C" stroke={INK} strokeWidth={7} />
    <rect x={-74} y={4} width={148} height={14} fill="#3FCB6B" />
    <rect x={-70} y={16} width={140} height={14} fill="#C9432E" />
    <rect x={-72} y={28} width={144} height={26} rx={10} fill="#E9B95C" stroke={INK} strokeWidth={7} />
  </g>
);

/** Plajda Çizgi, elinde sandviç. */
const Plaj: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz' }> = ({ goz = 'acik', agiz = 'gulus' }) => (
  <>
    <Arka b="14" />
    <Cizgi x={380} y={1660} s={1.3} goz={goz} agiz={agiz} bakis={[-0.5, -0.4]} kolSol={[70, 40]} kolSag={[-40, 120]} elSag={<Sandvic s={1.2} />} bacak={8} />
  </>
);

/** 1 · Swim right after lunch? */
export const S28_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.12, 1.22]} origin={[420, 1200]}>
      <Plaj />
      <Patla t={t} at={0} y={600} size={96} renk="#FFD54A">
        SWIM AFTER LUNCH?
      </Patla>
    </Sahne>
  );
};

/** 2 · You will not drown. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.22, 1.3]} origin={[420, 1200]}>
      <Plaj goz="mutlu" agiz="sirit" />
      <Ustu t={t} at={0.1} y={620} w={760} size={120}>
        YOU'LL DROWN
      </Ustu>
      <Duz>
        <g transform={`translate(900 470) scale(${pop(t, 0.1)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 3 · Our parents made us wait thirty minutes, */
const S3: React.FC = () => {
  const t = useTt();
  const k = interpolate(t, [0, 2], [0, 1], clamp);
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1200]}>
      <Arka b="14" />
      <Cizgi x={420} y={1650} s={1.2} oturan goz="yari" agiz="eksi" kas="uzgun" bakis={[1, -0.2]} kolSol={[20, 30]} kolSag={[20, 30]} />
      <Duz>
        <Kronometre x={720} y={860} s={0.62} v={`${30 - Math.floor(k * 3)}:00`} a={k * 360} />
      </Duz>
    </Sahne>
  );
};

/** Dosya klasörü. */
const Klasor: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-150 -100 h100 l20 24 h180 v200 h-300 z" fill="#E9B95C" stroke={INK} strokeWidth={10} />
    <rect x={-130} y={-60} width={260} height={30} fill="#F1E9D8" />
  </g>
);

/** 4 · but no study has found a drowning caused by a full stomach. */
const S4: React.FC = () => {
  const t = useTt();
  const zero = useAt('drowning');
  return (
    <Sahne zoom={[1.0, 1.08]}>
      <Arka b="14" bulanik karart={0.6} />
      <Panel x={110} y={520} w={860} h={980} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={ap(t, 0.1 + i * 0.15)}>
          <Klasor x={300 + (i % 3) * 240} y={720 + Math.floor(i / 3) * 230} s={0.62} r={(i - 2) * 4} />
        </g>
      ))}
      <g transform={`translate(540 1290) scale(${pop(t, zero)})`}>
        <text textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={220} fill="#FFD54A" stroke={INK} strokeWidth={16} paintOrder="stroke">
          0
        </text>
        <text y={90} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={60} fill="#F1E9D8">
          CASES FOUND
        </text>
      </g>
    </Sahne>
  );
};

/** Gövde şeması: mide + kan okları. kol: kol/bacaklara giden kan (0..1). */
const Govde: React.FC<{ t: number; mide: number; kol: number }> = ({ t, mide, kol }) => {
  const f = useCurrentFrame();
  const akis = (d: string, k: number, i: number) => (
    <path d={d} stroke="#E8434F" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="30 30" strokeDashoffset={-f * 4 - i * 10} opacity={k} />
  );
  return (
    <g>
      <circle cx={540} cy={720} r={90} fill="#1B2033" stroke="#F1E9D8" strokeWidth={8} />
      <rect x={430} y={830} width={220} height={360} rx={70} fill="#1B2033" stroke="#F1E9D8" strokeWidth={8} />
      <path d="M440 870 L300 1150 M640 870 L780 1150 M480 1180 L440 1460 M600 1180 L640 1460" stroke="#1B2033" strokeWidth={70} strokeLinecap="round" />
      <path d="M440 870 L300 1150 M640 870 L780 1150 M480 1180 L440 1460 M600 1180 L640 1460" stroke="#F1E9D8" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.4} />
      <ellipse cx={560} cy={1010} rx={70} ry={52} fill="#FF8A3D" opacity={0.4 + 0.6 * mide} stroke={INK} strokeWidth={6} />
      {akis('M540 900 Q540 960 545 990', mide, 0)}
      {akis('M520 900 L340 1120', kol, 1)}
      {akis('M560 900 L740 1120', kol, 2)}
      {akis('M520 1150 L460 1420', kol, 3)}
      {akis('M560 1150 L620 1420', kol, 4)}
      <circle cx={540} cy={890} r={30} fill="#E8434F" stroke={INK} strokeWidth={6} transform={`scale(1)`} opacity={0.9 + 0.1 * Math.sin(t * 8)} />
    </g>
  );
};

/** 5 · Your body sends some blood to digest, */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="15" karart={0.55} bulanik />
      <Panel x={160} y={560} w={760} h={960} />
      <Govde t={t} mide={ap(t, 0.3)} kol={0} />
      <g opacity={ap(t, useAt('digest,') - 0.2)}>
        <Etiket x={540} y={500} size={92} renk="#FF8A3D">
          SOME TO DIGEST
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 6 · yet your arms and legs still get plenty. — su altında rahat yüzen Çizgi */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.05, 1.14]}>
      <Arka b="15" />
      <g transform={`translate(${lerp(360, 700, t / 3)} ${980 + Math.sin(f / 8) * 14}) rotate(-78)`}>
        <Cizgi x={0} y={330} s={1.05} goz="mutlu" agiz="gulus" kolSol={[170, 10 + 30 * Math.sin(f / 5)]} kolSag={[160, 20 - 30 * Math.sin(f / 5)]} bacak={14 * Math.sin(f / 4)} golge={false} nefes={false} />
      </g>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={300 + i * 70} cy={760 - ((f * 3 + i * 60) % 300)} r={8 + (i % 3) * 4} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
      ))}
      <g opacity={ap(t, useAt('plenty.') - 0.2)}>
        <Etiket x={540} y={1280} size={96} renk="#3FCB6B">
          STILL PLENTY
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Şişe ikonu. */
const Sise: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-28} y={-300} width={56} height={120} rx={12} fill="#2E6B3A" stroke={INK} strokeWidth={10} />
    <path d="M-28 -190 q-60 40 -60 120 v220 q0 30 30 30 h116 q30 0 30 -30 v-220 q0 -80 -60 -120 z" fill="#3E8A4C" stroke={INK} strokeWidth={10} />
    <rect x={-70} y={-20} width={140} height={110} rx={10} fill="#F1E9D8" />
    <rect x={-36} y={-318} width={72} height={30} rx={8} fill="#E9B95C" stroke={INK} strokeWidth={8} />
  </g>
);

/** 7 · The real danger near water is alcohol. */
const S7: React.FC = () => {
  const t = useTt();
  const al = useAt('alcohol.');
  return (
    <Sahne zoom={[1.0, 1.12]} origin={[540, 1100]} shakeAt={[al]} shake={12}>
      <Arka b="14" karart={0.55} />
      <g transform={`translate(0 ${lerp(60, 0, ap(t, 0.1))})`} opacity={ap(t, 0.1)}>
        <Sise x={540} y={1250} s={1.5} />
      </g>
      <g opacity={ap(t, 0.2)}>
        <Ok x={250} y={760} L={180} r={30} renk="#FF4A3A" />
        <Ok x={830} y={760} L={180} r={150} renk="#FF4A3A" />
      </g>
      <Patla t={t} at={al} y={600} size={130} renk="#FF4A3A">
        ALCOHOL
      </Patla>
    </Sahne>
  );
};

/** 8 · So, did your parents make you wait? */
const S8: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.25, 1.36]} origin={[420, 1200]}>
      <Plaj goz="yari" agiz="sirit" />
      <Patla t={t} at={0.05} y={600} size={116}>
        DID YOU WAIT?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's28',
  words: WORDS,
  voiceLen: 21.55,
  tail: 0.55,
  baslik: ['SWIM RIGHT', 'AFTER LUNCH'],
  plan: [
    { w: 'Swim', C: S28_ILK },
    { w: 'You', C: S2 },
    { w: 'Our', C: S3 },
    { w: 'but', C: S4 },
    { w: 'Your', C: S5 },
    { w: 'yet', C: S6 },
    { w: 'The', C: S7 },
    { w: 'So,', C: S8 },
    { w: '@END', C: S28_ILK },
  ],
  cues: [
    ['whoosh', 'Swim', 0, 0.12],
    ['impact', 'not', 0, 0.16],
    ['tick', 'thirty', 0, 0.2],
    ['printer', 'study', 0, 0.1],
    ['ding', 'drowning', 0, 0.15],
    ['whoosh', 'Your', 0, 0.12],
    ['pop', 'plenty.', 0, 0.15],
    ['alarm', 'alcohol.', 0, 0.08],
    ['pop', 'did', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S29_ILK, words: S29_WORDS },
});

export const S28 = short.Comp;
export const S28_FRAMES = short.frames;
export const S28_WORDS = WORDS;
