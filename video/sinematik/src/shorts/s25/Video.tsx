/**
 * S-25 "Microwave cooks from the inside?". Doğru bildiğimiz yanlışlar serisi, yeni sistem.
 * Kaynak: FDA "Microwave Oven Radiation": mikrodalga enerjisi yiyeceğin dış katmanlarında soğurulur, iç kısım
 * iletimle ısınır (dalga yalnızca birkaç cm girer). USDA: eşit ısınma için karıştır ve beklet.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S26_ILK, S26_WORDS } from '../s26/Video';
import raw from './words.json';

const WORDS = raw as Word[];

const Catal: React.FC<{ r?: number; s?: number }> = ({ r = -30, s = 1 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d="M0 0 v-120" stroke="#C9D2E3" strokeWidth={12} strokeLinecap="round" />
    <path d="M-18 -120 v-50 M-6 -120 v-55 M6 -120 v-55 M18 -120 v-50 M-20 -118 h40" stroke="#C9D2E3" strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** Mutfakta Çizgi mikrodalganın önünde. */
const Mutfak: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz' }> = ({ goz = 'acik', agiz = 'o' }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Arka b="07" />
      <rect x={415} y={880} width={190} height={170} fill="#FFC46B" opacity={0.15 + 0.08 * Math.sin(f / 4)} />
      <Cizgi x={800} y={1800} s={1.45} goz={goz} agiz={agiz} bakis={[-1, -0.3]} kolSol={[30, 60]} kolSag={[12, 10]} elSol={<Catal />} />
    </>
  );
};

/** 1 · Microwave cooks from the inside? */
export const S25_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.15, 1.28]} origin={[600, 1100]}>
      <Mutfak />
      <Patla t={t} at={-0.5} y={640} size={120} renk="#FF6B5A">
        INSIDE OUT?
      </Patla>
    </Sahne>
  );
};

/** 2 · Wrong. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.28, 1.36]} origin={[600, 1100]}>
      <Mutfak goz="yari" agiz="duz" />
      <Ustu t={t} at={0.05} y={660} w={740} size={130}>
        INSIDE OUT
      </Ustu>
      <Duz>
        <g transform={`translate(900 540) scale(${pop(t, 0.05)})`}>
          <Carpi x={0} y={0} s={0.55} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** Tabakta lazanya; ortası buz. kesik: dilim açılmış. */
const Lazanya: React.FC<{ x: number; y: number; s?: number; buz?: number }> = ({ x, y, s = 1, buz = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={-200} y={-120 + i * 50} width={400} height={36} rx={8} fill="#E9B95C" stroke={INK} strokeWidth={6} />
          <rect x={-200} y={-86 + i * 50} width={400} height={14} fill="#C9432E" />
        </g>
      ))}
      <rect x={-90} y={-110} width={180} height={190} rx={20} fill="#BFEAFF" opacity={0.85 * buz} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${-60 + i * 24} ${-80 + ((i * 37) % 120)} l10 -10 l10 10 l-10 10 z`} fill="#fff" opacity={buz * (0.6 + 0.4 * Math.sin(f / 6 + i))} />
      ))}
      <path d="M-210 -140 q100 -40 200 -10 q100 -30 220 10" stroke="#FFD9A0" strokeWidth={6} fill="none" opacity={0.6} />
    </g>
  );
};

/** 3 · That is why the middle is still frozen. */
const S3: React.FC = () => {
  const t = useTt();
  const fr = useAt('frozen.');
  return (
    <Sahne zoom={[1.1, 1.22]} origin={[540, 1400]}>
      <Arka b="08" />
      <Lazanya x={540} y={1400} s={1.05} />
      <g transform={`translate(${lerp(900, 620, ap(t, 0, 0.6))} ${lerp(1200, 1360, ap(t, 0, 0.6))})`}>
        <Catal r={-30} s={1.6} />
      </g>
      <g opacity={ap(t, fr)}>
        <Etiket x={540} y={1130} size={110} renk="#BFEAFF">
          FROZEN
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Kesit: blok, dıştan giren dalgalar, ısı halkası (isi 0..1: dıştan içe). */
const Kesit: React.FC<{ t: number; dalga?: number; isi?: number; molekul?: number; cm?: number }> = ({ t, dalga = 0, isi = 0, molekul = 0, cm = 0 }) => {
  const f = useCurrentFrame();
  const X = 230;
  const Y = 790;
  const W = 620;
  const H = 620;
  const d = 110; // dalga derinliği (birkaç cm)
  const ic = lerp(d, W / 2, isi);
  return (
    <g>
      <rect x={X} y={Y} width={W} height={H} rx={30} fill="#BFEAFF" stroke={INK} strokeWidth={12} />
      <rect x={X} y={Y} width={W} height={H} rx={30} fill="#FF8A3D" opacity={Math.max(dalga, isi > 0 ? 1 : 0, molekul > 0 ? 1 : 0) * 0.9} />
      <rect x={X + ic} y={Y + ic} width={Math.max(0, W - 2 * ic)} height={Math.max(0, H - 2 * ic)} rx={20} fill="#BFEAFF" />
      {/* dalgalar dört yönden */}
      {dalga > 0 &&
        [0, 1, 2, 3].map((k) => {
          const u = ((f / 30) * 1.3) % 1;
          const r = k * 90;
          return (
            <g key={k} transform={`rotate(${r} 540 1100)`} opacity={dalga}>
              {[0, 1, 2].map((j) => {
                const yy = Y - 140 + ((u + j / 3) % 1) * (140 + d);
                return <path key={j} d={`M380 ${yy} q40 -26 80 0 q40 26 80 0 q40 -26 80 0 q40 26 80 0`} stroke="#FFE14A" strokeWidth={10} fill="none" opacity={yy > Y + d ? 0 : 1} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
      {/* su molekülleri yüzeyde titreşiyor */}
      {molekul > 0 &&
        Array.from({ length: 16 }, (_, i) => {
          const side = i % 4;
          const k = Math.floor(i / 4);
          const p = 140 + k * 140;
          const cx = side === 0 ? X + 50 : side === 1 ? X + W - 50 : X + p;
          const cy = side === 2 ? Y + 50 : side === 3 ? Y + H - 50 : Y + p;
          const j = Math.sin(f * 1.7 + i * 3) * 10;
          return (
            <g key={i} transform={`translate(${cx + j} ${cy - j})`} opacity={molekul}>
              <circle r={20} fill="#E8434F" stroke={INK} strokeWidth={4} />
              <circle cx={-20} cy={16} r={11} fill="#fff" stroke={INK} strokeWidth={4} />
              <circle cx={20} cy={16} r={11} fill="#fff" stroke={INK} strokeWidth={4} />
            </g>
          );
        })}
      {cm > 0 && (
        <g opacity={cm}>
          <path d={`M${X} ${Y - 60} h${d}`} stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
          <path d={`M${X} ${Y - 80} v40 M${X + d} ${Y - 80} v40`} stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/** 4 · Microwaves only reach... */
const S4: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="07" bulanik karart={0.6} />
      <Panel x={110} y={560} w={860} h={1060} />
      <Kesit t={t} dalga={ap(t, 0.2)} />
    </Sahne>
  );
};

/** 5 · a few centimeters into food. */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.55, 1.65]} odak={[330, 860]}>
      <Arka b="07" bulanik karart={0.6} />
      <Panel x={110} y={560} w={860} h={1060} />
      <Kesit t={t} dalga={1} cm={ap(t, 0.1)} />
      <g opacity={ap(t, 0.1)}>
        <Etiket x={350} y={700} size={56}>
          A FEW CM
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 6 · They shake the water near the surface. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.05, 1.12]}>
      <Arka b="07" bulanik karart={0.6} />
      <Panel x={110} y={560} w={860} h={1060} />
      <Kesit t={t} dalga={0.6} molekul={ap(t, 0.15)} />
      <g opacity={ap(t, useAt('water'))}>
        <Etiket x={540} y={700} size={84}>
          WATER SHAKES
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 7 · The center warms only when that heat... */
const S7: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="07" bulanik karart={0.6} />
      <Panel x={110} y={560} w={860} h={1060} />
      <Kesit t={t} dalga={0.3} isi={interpolate(t, [0, 2], [0, 0.35], clamp)} />
      <g opacity={ap(t, 0.2)}>
        <Etiket x={540} y={700} size={84} renk="#BFEAFF">
          CENTER: COLD
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 8 · slowly creeps inward. */
const S8: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.06, 1.14]}>
      <Arka b="07" bulanik karart={0.6} />
      <Panel x={110} y={560} w={860} h={1060} />
      <Kesit t={t} isi={interpolate(t, [0, 2.1], [0.35, 1], clamp)} />
      <g opacity={ap(t, 0.2)}>
        <Etiket x={540} y={700} size={100}>
          SLOWLY
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Lazanya kutusu, üstünde karıştırma kaşığı simgesi. */
const Kutu: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-180} width={520} height={360} rx={20} fill="#C9432E" stroke={INK} strokeWidth={12} />
    <rect x={-210} y={-130} width={420} height={150} rx={14} fill="#F1E9D8" />
    <Lazanya x={0} y={-60} s={0.42} buz={0} />
    <rect x={-210} y={50} width={420} height={90} rx={12} fill="#FFD54A" stroke={INK} strokeWidth={8} />
    <text y={112} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={52} fill={INK}>
      STIR HALFWAY
    </text>
  </g>
);

/** 9 · That is why the box says stir. */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 1100]}>
      <Arka b="08" />
      <Kutu x={540} y={1050} s={1.2 * pop(t, 0.05)} />
      <Patla t={t} at={useAt('stir.')} y={760} size={140}>
        STIR
      </Patla>
    </Sahne>
  );
};

/** 10 · Do you stir? */
const S10: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.3, 1.42]} origin={[600, 1100]}>
      <Mutfak goz="yari" agiz="sirit" />
      <Patla t={t} at={0.05} y={660} size={120}>
        DO YOU STIR?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's25',
  words: WORDS,
  voiceLen: 19.41,
  tail: 0.55,
  reklam: true,
  baslik: ['MICROWAVE', 'LASAGNA'],
  plan: [
    { w: 'Microwave', C: S25_ILK },
    { w: 'Wrong.', C: S2 },
    { w: 'That', C: S3 },
    { w: 'Microwaves', C: S4 },
    { w: 'centimeters', C: S5 },
    { w: 'They', C: S6 },
    { w: 'The', C: S7 },
    { w: 'slowly', C: S8 },
    { w: 'That#2', C: S9 },
    { w: 'Do', C: S10 },
    { w: '@END', C: S25_ILK },
  ],
  cues: [
    ['ding', 'Microwave', 0, 0.12],
    ['impact', 'Wrong.', 0, 0.16],
    ['glass', 'frozen.', 0, 0.12],
    ['whoosh', 'Microwaves', 0, 0.12],
    ['tick', 'centimeters', 0, 0.2],
    ['buzz', 'shake', 0, 0.1],
    ['whoosh', 'The', 0, 0.1],
    ['pop', 'stir.', 0, 0.25],
    ['pop', 'Do', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S26_ILK, words: S26_WORDS },
});

export const S25 = short.Comp;
export const S25_FRAMES = short.frames;
export const S25_WORDS = WORDS;
