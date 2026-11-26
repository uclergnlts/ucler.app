/**
 * S-29 "Shave it and it grows back thicker?". Doğru bildiğimiz yanlışlar, 2. parti.
 * Kaynak: Trotter 1928 (Anatomical Record), Lynfield & Macwilliams 1970 (Br J Dermatol): tıraş kılın kalınlığını,
 * rengini ve uzama hızını değiştirmez. Kaba his: incelen uç düz kesilince küt uç kalır (Mayo Clinic).
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Onay } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S30_ILK, S30_WORDS } from '../s30/Video';
import raw from './words.json';

const WORDS = raw as Word[];

const Jilet: React.FC<{ r?: number; s?: number }> = ({ r = 0, s = 1 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <rect x={-10} y={-10} width={20} height={150} rx={10} fill="#3B6FE0" stroke={INK} strokeWidth={6} />
    <rect x={-50} y={-40} width={100} height={36} rx={8} fill="#C9D2E3" stroke={INK} strokeWidth={6} />
    <path d="M-44 -40 h88" stroke="#fff" strokeWidth={4} />
  </g>
);

/** Köpük (çene). */
const Kopuk: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-50, 0, 28],
      [-20, 14, 32],
      [16, 16, 30],
      [48, 2, 26],
      [0, -6, 22],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" />
    ))}
  </g>
);

/** Banyoda tıraş olan Çizgi. */
const Banyo: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz' }> = ({ goz = 'acik', agiz = 'o' }) => {
  const s = 1.35;
  const x = 360;
  const y = 1780;
  return (
    <>
      <Arka b="16" />
      <Cizgi x={x} y={y} s={s} goz={goz} agiz={agiz} bakis={[1, -0.1]} kolSol={[14, 10]} kolSag={[60, 100]} elSag={<Jilet r={-160} s={1.1} />} />
      <Kopuk x={x + 30} y={y - 552 * s + 75} s={0.85} />
    </>
  );
};

/** 1 · Shave it and it grows back thicker? */
export const S29_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.14, 1.24]} origin={[450, 1100]}>
      <Banyo />
      <Patla t={t} at={-0.5} y={560} size={86} renk="#FFD54A">
        GROWS BACK THICKER?
      </Patla>
    </Sahne>
  );
};

/** 2 · No. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.24, 1.3]} origin={[450, 1100]}>
      <Banyo goz="yari" agiz="duz" />
      <Ustu t={t} at={0.03} y={600} w={640} size={130}>
        THICKER
      </Ustu>
      <Duz>
        <g transform={`translate(880 440) scale(${pop(t, 0.03)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 3 · Scientists tested this in 1928, and again in 1970. */
const S3: React.FC = () => {
  const t = useTt();
  const y1 = useAt('1928,');
  const y2 = useAt('1970.');
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 1100]}>
      <Arka b="17" />
      <Cizgi x={760} y={1760} s={1.3} onluk goz="acik" agiz="o" bakis={[-1, 0.2]} kolSol={[60, 50]} kolSag={[14, 10]} />
      <Duz>
        <g transform={`translate(330 600) rotate(-5) scale(${pop(t, y1)})`}>
          <Etiket x={0} y={0} size={150} renk="#FFD54A">
            1928
          </Etiket>
        </g>
        <g transform={`translate(760 760) rotate(4) scale(${pop(t, y2)})`}>
          <Etiket x={0} y={0} size={150} renk="#BFEAFF">
            1970
          </Etiket>
        </g>
      </Duz>
    </Sahne>
  );
};

/** 4 · Same thickness, same color, same speed. */
const S4: React.FC = () => {
  const t = useTt();
  const a = [useAt('thickness,'), useAt('color,'), useAt('speed.')];
  const rows = ['THICKNESS', 'COLOR', 'SPEED'];
  return (
    <Sahne zoom={[1.0, 1.05]}>
      <Arka b="17" bulanik karart={0.6} />
      <Panel x={110} y={520} w={860} h={940} />
      <text x={370} y={640} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={50} fill="#F1E9D8">
        BEFORE
      </text>
      <text x={710} y={640} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={50} fill="#F1E9D8">
        AFTER
      </text>
      {rows.map((r, i) => (
        <g key={r} opacity={ap(t, a[i] - 0.1)}>
          <text x={540} y={760 + i * 250} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={54} fill="#FFD54A">
            {r}
          </text>
          <rect x={250} y={800 + i * 250} width={240} height={24} rx={12} fill="#3A2A20" stroke="#F1E9D8" strokeWidth={4} />
          <rect x={590} y={800 + i * 250} width={240} height={24} rx={12} fill="#3A2A20" stroke="#F1E9D8" strokeWidth={4} />
          <g transform={`translate(900 ${812 + i * 250}) scale(${pop(t, a[i])})`}>
            <Onay x={0} y={0} s={0.42} />
          </g>
        </g>
      ))}
    </Sahne>
  );
};

/** 5 · So why does it feel rough? */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.4, 1.5]} odak={[400, 1060]}>
      <Arka b="16" />
      <Cizgi x={360} y={1780} s={1.35} goz="sikis" agiz="eksi" bakis={[1, 0]} kolSol={[14, 10]} kolSag={[60, 110]} />
      <Patla t={t} at={useAt('rough?') - 0.1} y={600} size={140}>
        ROUGH?
      </Patla>
    </Sahne>
  );
};

/** Kıl: alt kökten yukarı; kesik: kesildiği yükseklik (0..1), yoksa ince uç. */
const Kil: React.FC<{ x: number; y: number; h?: number; kesik?: number; s?: number }> = ({ x, y, h = 700, kesik, s = 1 }) => {
  const W = 80;
  const top = kesik === undefined ? h : h * kesik;
  const w2 = kesik === undefined ? 0 : W * (1 - kesik * 0.55);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M${-W / 2} 0 L${-w2 / 2} ${-top} ${kesik === undefined ? '' : `L${w2 / 2} ${-top}`} L${W / 2} 0 Z`} fill="#3A2A20" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M${-W / 2 + 8} -10 L${-w2 / 2 + 4} ${-top + 20}`} stroke="#fff" strokeWidth={5} opacity={0.25} />
    </g>
  );
};

/** 6 · A hair is thin at the tip. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[540, 700]}>
      <Arka b="16" bulanik karart={0.65} />
      <Panel x={110} y={500} w={860} h={960} />
      <rect x={110} y={1320} width={860} height={140} rx={30} fill="#E9B08A" />
      <Kil x={540} y={1330} h={lerp(200, 720, ap(t, 0, 0.8))} />
      <g opacity={ap(t, useAt('tip.') - 0.2)}>
        <circle cx={540} cy={610} r={70} fill="none" stroke="#FFD54A" strokeWidth={10} />
        <Etiket x={760} y={640} size={80} renk="#FFD54A">
          THIN
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 7 · The razor cuts it straight across and leaves a blunt end. */
const S7: React.FC = () => {
  const t = useTt();
  const cut = useAt('cuts');
  const k = ap(t, cut - 0.1, 0.4);
  const kesildi = t > cut + 0.1;
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1000]} shakeAt={[cut + 0.1]} shake={10}>
      <Arka b="16" bulanik karart={0.65} />
      <Panel x={110} y={500} w={860} h={960} />
      <rect x={110} y={1320} width={860} height={140} rx={30} fill="#E9B08A" />
      <Kil x={540} y={1330} h={720} kesik={kesildi ? 0.55 : undefined} />
      {kesildi && (
        <g transform={`translate(${540 + (f % 60) * 4} ${930 - (f % 60) * 6}) rotate(${(f % 60) * 3})`} opacity={interpolate(t, [cut + 0.1, cut + 1.4], [1, 0], clamp)}>
          <path d="M-12 0 L0 -330 L12 0 Z" fill="#3A2A20" stroke={INK} strokeWidth={5} />
        </g>
      )}
      <g transform={`translate(${lerp(-200, 1300, k)} 935)`}>
        <rect x={-160} y={-26} width={320} height={52} rx={10} fill="#C9D2E3" stroke={INK} strokeWidth={8} />
        <path d="M-150 26 h300" stroke="#fff" strokeWidth={6} />
      </g>
      <g opacity={ap(t, useAt('blunt') - 0.1)}>
        <circle cx={540} cy={935} r={64} fill="none" stroke="#FFD54A" strokeWidth={10} />
        <Etiket x={540} y={640} size={96} renk="#FFD54A">
          BLUNT END
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 8 · Blunt feels coarse. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const parmak = (x: number) => (
    <g transform={`translate(${x} ${640 + Math.sin(f / 5) * 16})`}>
      <rect x={-50} y={-200} width={100} height={220} rx={50} fill="#1B2033" stroke={INK} strokeWidth={8} />
    </g>
  );
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="16" bulanik karart={0.65} />
      <Panel x={110} y={480} w={860} h={1000} />
      <rect x={110} y={1340} width={860} height={140} rx={30} fill="#E9B08A" />
      <Kil x={330} y={1350} h={720} s={0.9} />
      <Kil x={750} y={1350} h={720} kesik={0.62} s={0.9} />
      {parmak(330)}
      {parmak(750)}
      <text x={330} y={1300} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={56} fill="#3FCB6B">
        SOFT
      </text>
      <Patla t={t} at={useAt('coarse.') - 0.1} x={750} y={1300} size={80} renk="#FF8A3D" r={0}>
        COARSE
      </Patla>
    </Sahne>
  );
};

/** 9 · Still believe it? */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.28, 1.38]} origin={[450, 1100]}>
      <Banyo goz="yari" agiz="sirit" />
      <Patla t={t} at={0.05} y={580} size={110}>
        STILL BELIEVE IT?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's29',
  words: WORDS,
  voiceLen: 23.13,
  tail: 0.55,
  reklam: true,
  baslik: ['SHAVE AND IT', 'GROWS BACK'],
  plan: [
    { w: 'Shave', C: S29_ILK },
    { w: 'No.', C: S2 },
    { w: 'Scientists', C: S3 },
    { w: 'Same', C: S4 },
    { w: 'So', C: S5 },
    { w: 'A', C: S6 },
    { w: 'The', C: S7 },
    { w: 'Blunt', C: S8 },
    { w: 'Still', C: S9 },
    { w: '@END', C: S29_ILK },
  ],
  cues: [
    ['whoosh', 'Shave', 0, 0.12],
    ['impact', 'No.', 0, 0.16],
    ['ding', '1928,', 0, 0.12],
    ['ding', '1970.', 0, 0.12],
    ['pop', 'thickness,', 0, 0.15],
    ['pop', 'color,', 0, 0.15],
    ['pop', 'speed.', 0, 0.15],
    ['whoosh', 'A', 0, 0.1],
    ['whoosh', 'cuts', -0.1, 0.18],
    ['pop', 'coarse.', 0, 0.15],
    ['pop', 'Still', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S30_ILK, words: S30_WORDS },
});

export const S29 = short.Comp;
export const S29_FRAMES = short.frames;
export const S29_WORDS = WORDS;
