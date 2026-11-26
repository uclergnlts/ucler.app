/**
 * S-27 "Salt makes pasta water boil faster?". Doğru bildiğimiz yanlışlar, 2. parti.
 * Kaynak: ebülyoskopi (Kb su = 0,512 °C·kg/mol): ~17 g tuz / 4 L su -> ΔTb ≈ 0,08 °C.
 * Tuz atınca ani köpürme: taneler buhar kabarcıkları için çekirdeklenme noktası olur.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, rnd } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S28_ILK, S28_WORDS } from '../s28/Video';
import raw from './words.json';

const WORDS = raw as Word[];

/** Tuzluk (el merkezinde). */
export const Tuzluk: React.FC<{ r?: number; s?: number }> = ({ r = 0, s = 1 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <rect x={-34} y={-90} width={68} height={110} rx={18} fill="#F1E9D8" stroke={INK} strokeWidth={7} />
    <path d="M-34 -70 q34 -40 68 0" fill="#C9D2E3" stroke={INK} strokeWidth={7} />
    {[-14, 0, 14].map((x) => (
      <circle key={x} cx={x} cy={-82} r={4} fill={INK} />
    ))}
    <text y={-12} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={40} fill={INK}>
      S
    </text>
  </g>
);

/** Düşen tuz taneleri (x0,y0'dan aşağı). */
const Taneler: React.FC<{ x: number; y: number; h: number; o?: number; n?: number }> = ({ x, y, h, o = 1, n = 18 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const u = ((f / 18 + rnd(i) ) % 1);
        return <rect key={i} x={x + (rnd(i + 3) - 0.5) * 50 + u * 20} y={y + u * h} width={9} height={9} fill="#fff" transform={`rotate(${i * 20} ${x} ${y + u * h})`} />;
      })}
    </g>
  );
};

/** Mutfakta Çizgi, tencereye tuz atmaya hazır. */
const Mutfak: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz'; dokuyor?: boolean }> = ({ goz = 'acik', agiz = 'o', dokuyor = false }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Arka b="12" />
      {/* tencereden buhar */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${620 + i * 30} ${990 - ((f * 2 + i * 40) % 120)} q20 -30 0 -60`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.25} strokeLinecap="round" />
      ))}
      <Cizgi x={300} y={1760} s={1.2} goz={goz} agiz={agiz} bakis={[1, -0.2]} kolSol={[14, 12]} kolSag={[135, 10]} elSag={<Tuzluk r={dokuyor ? 200 : 120} s={1.2} />} />
      {dokuyor && <Taneler x={640} y={1010} h={40} />}
    </>
  );
};

/** 1 · Salt makes pasta water boil faster? */
export const S27_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.12, 1.24]} origin={[480, 1150]}>
      <Mutfak dokuyor />
      <Patla t={t} at={-0.5} y={620} size={120} renk="#FFD54A">
        BOILS FASTER?
      </Patla>
    </Sahne>
  );
};

/** 2 · Nope. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.24, 1.32]} origin={[480, 1150]}>
      <Mutfak goz="yari" agiz="duz" />
      <Ustu t={t} at={0.05} y={640} w={820} size={120}>
        BOILS FASTER
      </Ustu>
      <Duz>
        <g transform={`translate(900 480) scale(${pop(t, 0.05)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** Termometre: v = gösterge, dolu 0..1. */
const Termometre: React.FC<{ x: number; y: number; v: string; dolu: number; s?: number }> = ({ x, y, v, dolu, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-420} width={100} height={460} rx={50} fill="#F1E9D8" stroke={INK} strokeWidth={12} />
    <circle cy={80} r={90} fill="#E8434F" stroke={INK} strokeWidth={12} />
    <rect x={-24} y={-380 + 400 * (1 - dolu)} width={48} height={400 * dolu + 40} rx={24} fill="#E8434F" />
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d={`M50 ${-360 + i * 50} h${i % 2 ? 24 : 44}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    ))}
    <g transform="translate(0 -520)">
      <rect x={-250} y={-90} width={500} height={130} rx={28} fill="#0E1022" stroke="#FFD54A" strokeWidth={8} />
      <text y={10} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={92} fill="#FFD54A">
        {v}
      </text>
    </g>
  </g>
);

/** 3 · It actually boils a tiny bit hotter, and later. */
const S3: React.FC = () => {
  const t = useTt();
  const hot = useAt('hotter,');
  const later = useAt('later.');
  const d = interpolate(t, [hot - 0.2, hot + 0.6], [0, 8], clamp);
  return (
    <Sahne zoom={[1.0, 1.08]}>
      <Arka b="13" karart={0.35} />
      <Duz>
        <Termometre x={540} y={1180} v={`100.${String(Math.round(d)).padStart(2, '0')}°C`} dolu={0.8 + d * 0.01} s={1.05} />
        <g opacity={ap(t, hot)}>
          <Etiket x={540} y={520} size={104} renk="#FF8A3D">
            HOTTER
          </Etiket>
        </g>
        <g opacity={ap(t, later)} transform={`translate(0 ${lerp(30, 0, ap(t, later))})`}>
          <Etiket x={540} y={1430} size={96} renk="#BFEAFF">
            ...AND LATER
          </Etiket>
        </g>
      </Duz>
    </Sahne>
  );
};

/** Kaşıkla tuz dökülüyor. */
const Kasik: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M-320 0 h250" stroke="#C99A0C" strokeWidth={26} strokeLinecap="round" />
    <ellipse cx={0} cy={0} rx={90} ry={56} fill="#C9D2E3" stroke={INK} strokeWidth={10} />
    <ellipse cx={0} cy={-8} rx={64} ry={30} fill="#fff" />
  </g>
);

/** 4 · A spoonful in a big pot raises the boiling point by less than a tenth of a degree. */
const S4: React.FC = () => {
  const t = useTt();
  const deg = useAt('degree.');
  const ten = useAt('tenth');
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 900]}>
      <Arka b="13" />
      <Kasik x={lerp(260, 380, ap(t, 0, 0.8))} y={640} r={lerp(10, 55, ap(t, 0.3, 0.6))} />
      <Taneler x={430} y={700} h={260} o={ap(t, 0.5)} n={26} />
      <Duz>
        <g opacity={ap(t, ten - 0.3)}>
          <Panel x={150} y={1150} w={780} h={260} o={0.88} />
          <text x={540} y={1300} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={130} fill="#FFD54A" stroke={INK} strokeWidth={10} paintOrder="stroke">
            +0.08°C
          </text>
          <text x={540} y={1380} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={52} fill="#F1E9D8">
            1 SPOON · 4 LITERS
          </text>
        </g>
        <g opacity={ap(t, deg)}>
          <Etiket x={540} y={560} size={96} renk="#F1E9D8">
            YOU'D NEVER NOTICE
          </Etiket>
        </g>
      </Duz>
    </Sahne>
  );
};

/** Kabarcık patlaması (tuz değdiği an). */
const Fokur: React.FC<{ x: number; y: number; k: number; n?: number; r?: number }> = ({ x, y, k, n = 40, r = 260 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i) * Math.PI * 2;
        const d = Math.sqrt(rnd(i + 7)) * r * k;
        const rr = (8 + rnd(i + 11) * 26) * (0.6 + 0.4 * Math.sin(f / 3 + i));
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.9} r={rr * Math.min(1, k * 2)} fill="none" stroke="#fff" strokeWidth={6} opacity={0.85} />;
      })}
    </g>
  );
};

/** 5 · Those sudden bubbles when you pour it in? */
const S5: React.FC = () => {
  const t = useTt();
  const k = ap(t, 0.15, 0.5);
  return (
    <Sahne zoom={[1.15, 1.3]} odak={[520, 880]} shakeAt={[0.2]} shake={14}>
      <Arka b="13" />
      <Taneler x={500} y={500} h={360} n={30} />
      <Fokur x={520} y={900} k={k} />
      <Patla t={t} at={0.25} y={560} size={130}>
        WHOOSH?
      </Patla>
    </Sahne>
  );
};

/** Tuz kristali (küp) ve köşelerinde doğan buhar kabarcıkları. */
const Kristal: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 -40 l60 -50 h120 l-60 50 z" fill="#FFFFFF" stroke={INK} strokeWidth={8} />
    <path d="M30 -40 l60 -50 v120 l-60 50 z" fill="#C9D2E3" stroke={INK} strokeWidth={8} />
    <rect x={-90} y={-40} width={120} height={120} fill="#E9EEF5" stroke={INK} strokeWidth={8} />
    {[
      [-90, -40],
      [30, 80],
      [90, -90],
      [-30, -90],
    ].map(([bx, by], i) => {
      const u = ((t * 0.9 + i * 0.27) % 1);
      return <circle key={i} cx={bx + Math.sin(u * 6 + i) * 10} cy={by - u * 320} r={14 + u * 30} fill="none" stroke="#BFEAFF" strokeWidth={7} opacity={1 - u * 0.6} />;
    })}
  </g>
);

/** 6 · The grains just give steam a place to form. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.08]}>
      <Arka b="13" bulanik karart={0.6} />
      <Panel x={110} y={500} w={860} h={1000} />
      <rect x={110} y={1000} width={860} height={500} rx={48} fill="#3F7FB8" opacity={0.45} />
      <Kristal x={380} y={1180} s={1.25} t={t} />
      <Kristal x={720} y={1290} s={0.9} t={t + 0.4} />
      <g opacity={ap(t, useAt('steam'))}>
        <Etiket x={540} y={660} size={88} renk="#BFEAFF">
          STEAM STARTS HERE
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 7 · Salt is only for taste. */
const S7: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.2, 1.3]} origin={[400, 1100]}>
      <Arka b="12" />
      <Cizgi x={300} y={1760} s={1.2} goz="mutlu" agiz="gulus" bakis={[0.4, -0.3]} kolSol={[14, 12]} kolSag={[-40, 120]} elSag={<Tuzluk r={-20} s={1.3} />} />
      <Patla t={t} at={useAt('taste.') - 0.1} y={620} size={120} renk="#3FCB6B">
        ONLY TASTE
      </Patla>
      <Zerre n={12} color="#FFE2A8" o={0.25} />
    </Sahne>
  );
};

/** 8 · Do you salt first or last? */
const S8: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.28, 1.4]} origin={[420, 1150]}>
      <Mutfak goz="yari" agiz="sirit" />
      <Patla t={t} at={0.05} y={620} size={116}>
        FIRST OR LAST?
      </Patla>
    </Sahne>
  );
};

const short = makeShort({
  kod: 's27',
  words: WORDS,
  voiceLen: 23.55,
  tail: 0.55,
  reklam: true,
  baslik: ['SALT IN THE', 'PASTA WATER'],
  plan: [
    { w: 'Salt', C: S27_ILK },
    { w: 'Nope.', C: S2 },
    { w: 'It', C: S3 },
    { w: 'A', C: S4 },
    { w: 'Those', C: S5 },
    { w: 'The', C: S6 },
    { w: 'Salt#2', C: S7 },
    { w: 'Do', C: S8 },
    { w: '@END', C: S27_ILK },
  ],
  cues: [
    ['pop', 'Salt', 0, 0.12],
    ['impact', 'Nope.', 0, 0.16],
    ['tick', 'hotter,', 0, 0.2],
    ['tick', 'later.', 0, 0.2],
    ['whoosh', 'A', 0, 0.12],
    ['ding', 'tenth', 0, 0.12],
    ['whoosh', 'sudden', 0, 0.2],
    ['pop', 'grains', 0, 0.15],
    ['ding', 'taste.', 0, 0.15],
    ['pop', 'Do', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S28_ILK, words: S28_WORDS },
});

export const S27 = short.Comp;
export const S27_FRAMES = short.frames;
export const S27_WORDS = WORDS;
