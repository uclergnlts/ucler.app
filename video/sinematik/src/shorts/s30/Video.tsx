/**
 * S-30 "Jellyfish sting? Don't pee on it.". Doğru bildiğimiz yanlışlar, 2. parti.
 * Kaynak: Cleveland Clinic, Scientific American: idrar işe yaramaz; tatlı su/idrar deride kalan nematosistleri
 * tekrar ateşletebilir. Sirke veya deniz suyuyla durula, dokunaçları çıplak elle değil bir nesneyle al.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Onay, rnd } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S31_ILK, S31_WORDS } from '../s31/Video';
import raw from './words.json';

const WORDS = raw as Word[];

/** Kıyıda sokulmuş Çizgi, bacağını tutuyor. */
const Kiyi: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'sikis'; agiz?: 'o' | 'acik' | 'sirit' | 'eksi' | 'kocaman' | 'duz'; zipla?: boolean }> = ({ goz = 'sok', agiz = 'kocaman', zipla = true }) => {
  const f = useCurrentFrame();
  const h = zipla ? Math.abs(Math.sin(f / 5)) * 40 : 0;
  return (
    <>
      <Arka b="18" />
      <Cizgi x={300} y={1640 - h} s={1.3} goz={goz} agiz={agiz} bakis={[1, 0.3]} kolSol={[30, 80]} kolSag={[40, 70]} bacak={-18} egim={8} />
      {/* bacakta kızarık iz */}
      <path d={`M${330} ${1560 - h} q30 -20 60 0 q30 20 60 -6`} stroke="#FF4A3A" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.9} />
    </>
  );
};

/** 1 · Jellyfish sting? */
export const S30_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.12, 1.22]} origin={[450, 1300]} shakeAt={[0.05]} shake={10}>
      <Kiyi />
      <Patla t={t} at={0} y={600} size={116} renk="#FF6B5A">
        JELLYFISH STING!
      </Patla>
    </Sahne>
  );
};

/** 2 · Don't pee on it. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.22, 1.3]} origin={[450, 1300]}>
      <Kiyi goz="yari" agiz="eksi" zipla={false} />
      <Ustu t={t} at={0.15} y={620} w={700} size={120}>
        PEE ON IT
      </Ustu>
      <Duz>
        <g transform={`translate(900 470) scale(${pop(t, 0.15)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 3 · It can make it worse. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.35, 1.45]} odak={[340, 1150]} shakeAt={[useAt('worse.')]} shake={16}>
      <Kiyi />
      <Patla t={t} at={useAt('worse.') - 0.1} y={620} size={150} renk="#FF4A3A">
        WORSE
      </Patla>
    </Sahne>
  );
};

/** Deri kesiti + iğne kapsülleri (nematosist). ates: tetiklenme 0..1, parla: yükleme parıltısı. */
const Deri: React.FC<{ t: number; n?: number; ates?: number; parla?: number }> = ({ t, n = 22, ates = 0, parla = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={110} y={1080} width={860} height={380} rx={40} fill="#E9B08A" />
      <rect x={110} y={1080} width={860} height={60} fill="#D9927A" />
      {/* dokunaç */}
      <path d="M100 1060 C300 1010 500 1110 700 1050 S950 1020 990 1060" stroke="#F4C6E8" strokeWidth={40} fill="none" opacity={0.85} strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => {
        const x = 150 + (i / n) * 790 + rnd(i) * 20;
        const y = 1100 + rnd(i + 5) * 40;
        const a = Math.max(0, Math.min(1, ates * 1.5 - rnd(i + 9) * 0.5));
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx={14} ry={22} fill="#FFF4D6" stroke={INK} strokeWidth={4} />
            {parla > 0 && <ellipse rx={22} ry={30} fill="#FFD54A" opacity={parla * (0.3 + 0.3 * Math.sin(f / 3 + i))} />}
            {a > 0 && <path d={`M0 20 q${8 * Math.sin(i)} ${60 * a} 0 ${150 * a}`} stroke="#FF4A3A" strokeWidth={5} fill="none" />}
          </g>
        );
      })}
    </g>
  );
};

/** 4 · The tentacles leave thousands of tiny stingers in your skin, */
const S4: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 1150]}>
      <Arka b="19" bulanik karart={0.55} />
      <Panel x={80} y={500} w={920} h={1000} />
      <Deri t={t} n={Math.round(lerp(6, 26, ap(t, useAt('thousands') - 0.1, 0.8)))} />
      <g opacity={ap(t, useAt('stingers'))}>
        <Etiket x={540} y={700} size={88} renk="#FFD54A">
          1000s OF STINGERS
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 5 · still loaded. */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.5, 1.6]} odak={[540, 1110]}>
      <Arka b="19" bulanik karart={0.55} />
      <Panel x={80} y={500} w={920} h={1000} />
      <Deri t={t} n={26} parla={ap(t, 0.1)} />
      <Patla t={t} at={useAt('loaded.') - 0.1} y={760} size={130}>
        LOADED
      </Patla>
    </Sahne>
  );
};

/** Damla. */
const Damla: React.FC<{ x: number; y: number; renk?: string; s?: number }> = ({ x, y, renk = '#9FD8FF', s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -40 q30 40 30 60 a30 30 0 0 1 -60 0 q0 -20 30 -60 z" fill={renk} stroke={INK} strokeWidth={5} />
);

/** 6 · Fresh water, and often urine, can make them fire again. */
const S6: React.FC = () => {
  const t = useTt();
  const fire = useAt('fire');
  const ur = useAt('urine,');
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1150]} shakeAt={[fire]} shake={14}>
      <Arka b="19" bulanik karart={0.55} />
      <Panel x={80} y={500} w={920} h={1000} />
      <Deri t={t} n={26} ates={ap(t, fire - 0.1, 0.6)} />
      {Array.from({ length: 8 }, (_, i) => {
        const u = ((t * 0.9 + i / 8) % 1);
        return <Damla key={i} x={200 + i * 95} y={lerp(620, 1060, u)} renk={t > ur ? '#F2D44A' : '#9FD8FF'} s={0.8} />;
      })}
      <g opacity={ap(t, 0.1)}>
        <Etiket x={540} y={640} size={76} renk={t > ur ? '#F2D44A' : '#9FD8FF'}>
          {t > ur ? 'FRESH WATER · URINE' : 'FRESH WATER'}
        </Etiket>
      </g>
      <Patla t={t} at={fire} y={880} size={120} renk="#FF4A3A">
        FIRE AGAIN!
      </Patla>
    </Sahne>
  );
};

/** Sirke şişesi. */
const Sirke: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-60} y={-160} width={120} height={300} rx={30} fill="#F1E9D8" stroke={INK} strokeWidth={10} opacity={0.95} />
    <rect x={-60} y={-40} width={120} height={180} rx={20} fill="#E9D58A" opacity={0.7} />
    <rect x={-24} y={-230} width={48} height={80} rx={10} fill="#C9432E" stroke={INK} strokeWidth={8} />
    <rect x={-50} y={-20} width={100} height={70} rx={8} fill="#fff" stroke={INK} strokeWidth={5} />
  </g>
);

/** 7 · Rinse with vinegar or sea water, */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.0, 1.06]} origin={[540, 1150]}>
      <Arka b="18" bulanik karart={0.5} />
      <Panel x={80} y={500} w={920} h={1000} />
      <Deri t={t} n={26} />
      <Sirke x={360} y={820} r={lerp(0, 110, ap(t, 0.1, 0.5))} s={0.9} />
      {t > 0.5 &&
        Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={480 + Math.sin(i * 2) * 20} cy={860 + ((f * 9 + i * 22) % 220)} r={9} fill="#E9D58A" stroke={INK} strokeWidth={3} />
        ))}
      <g opacity={ap(t, useAt('vinegar') - 0.1)}>
        <Onay x={760} y={700} s={0.5} />
        <Etiket x={760} y={830} size={64} renk="#3FCB6B">
          VINEGAR
        </Etiket>
      </g>
      <g opacity={ap(t, useAt('sea'))}>
        <Etiket x={760} y={920} size={64} renk="#3FCB6B">
          SEA WATER
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 8 · and lift the tentacles off with something, never your fingers. */
const S8: React.FC = () => {
  const t = useTt();
  const nev = useAt('never');
  const k = ap(t, 0.3, 1.0);
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1150]}>
      <Arka b="18" bulanik karart={0.5} />
      <Panel x={80} y={500} w={920} h={1000} />
      <rect x={80} y={1080} width={920} height={380} rx={40} fill="#E9B08A" />
      {/* kart dokunacı kaldırıyor */}
      <g transform={`translate(0 ${-k * 160})`}>
        <path d="M120 1060 C300 1010 500 1110 700 1050 S950 1020 980 1060" stroke="#F4C6E8" strokeWidth={40} fill="none" opacity={0.85} strokeLinecap="round" />
      </g>
      <g transform={`translate(${lerp(980, 560, ap(t, 0, 0.5))} ${1010 - k * 160}) rotate(-12)`}>
        <rect x={-140} y={-80} width={280} height={170} rx={20} fill="#3B6FE0" stroke={INK} strokeWidth={10} />
        <rect x={-110} y={-40} width={80} height={56} rx={8} fill="#FFD54A" />
      </g>
      <g opacity={ap(t, nev - 0.1)}>
        <g transform="translate(300 760)">
          <rect x={-50} y={-120} width={100} height={200} rx={50} fill="#1B2033" stroke="#F1E9D8" strokeWidth={6} />
        </g>
        <g transform={`translate(300 740) scale(${pop(t, nev)})`}>
          <Carpi x={0} y={0} s={0.55} />
        </g>
        <Etiket x={690} y={790} size={76} renk="#FF6B5A">
          NO FINGERS
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 9 · Who told you to pee on it? */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.26, 1.36]} origin={[450, 1300]}>
      <Kiyi goz="yari" agiz="sirit" zipla={false} />
      <Patla t={t} at={0.05} y={600} size={116}>
        WHO TOLD YOU?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's30',
  words: WORDS,
  voiceLen: 21.13,
  tail: 0.55,
  baslik: ['JELLYFISH', 'STING'],
  plan: [
    { w: 'Jellyfish', C: S30_ILK },
    { w: "Don't", C: S2 },
    { w: 'It', C: S3 },
    { w: 'The', C: S4 },
    { w: 'still', C: S5 },
    { w: 'Fresh', C: S6 },
    { w: 'Rinse', C: S7 },
    { w: 'lift', C: S8 },
    { w: 'Who', C: S9 },
    { w: '@END', C: S30_ILK },
  ],
  cues: [
    ['impact', 'Jellyfish', 0, 0.12],
    ['impact', "Don't", 0.1, 0.14],
    ['alarm', 'worse.', 0, 0.06],
    ['whoosh', 'The', 0, 0.12],
    ['tick', 'thousands', 0, 0.2],
    ['buzz', 'loaded.', 0, 0.1],
    ['glass', 'Fresh', 0, 0.1],
    ['impact', 'fire', 0, 0.16],
    ['ding', 'vinegar', 0, 0.12],
    ['whoosh', 'lift', 0, 0.12],
    ['pop', 'Who', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S31_ILK, words: S31_WORDS },
});

export const S30 = short.Comp;
export const S30_FRAMES = short.frames;
export const S30_WORDS = WORDS;
