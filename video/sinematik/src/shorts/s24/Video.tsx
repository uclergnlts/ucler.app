/**
 * S-24 "Flush in Australia". Doğru bildiğimiz yanlışlar serisi, yeni sistem.
 * Kaynak: NOAA Ocean Service (Coriolis etkisi yalnızca yüzlerce km'lik sistemlerde belirgin); Shapiro 1962, Nature
 * (çok dikkatli kurulmuş havuzda bile etki zor görülür). Klozette yönü kenar deliklerinin açısı ve hazne şekli belirler.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Ok } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import { S25_ILK, S25_WORDS } from '../s25/Video';
import raw from './words.json';

const WORDS = raw as Word[];

/** Dönen su: (x,y) merkezli elips içinde spiral oklar. yon: +1 saat yönü, -1 ters. */
export const Girdap: React.FC<{ x: number; y: number; rx: number; ry: number; yon?: number; hiz?: number; renk?: string; o?: number }> = ({ x, y, rx, ry, yon = -1, hiz = 1, renk = '#BFEAFF', o = 1 }) => {
  const f = useCurrentFrame();
  const a0 = (f / 30) * 2.2 * hiz * yon;
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${ry / rx})`} opacity={o}>
      <circle r={rx} fill="#4FA8D8" opacity={0.45} />
      {[0, 1, 2].map((i) => {
        const a = a0 + (i * 2 * Math.PI) / 3;
        const r1 = rx * 0.92;
        const r2 = rx * 0.25;
        const pts = Array.from({ length: 16 }, (_, k) => {
          const u = k / 15;
          const rr = lerp(r1, r2, u);
          const aa = a + yon * u * 2.6;
          return `${Math.cos(aa) * rr},${Math.sin(aa) * rr}`;
        }).join(' ');
        return <polyline key={i} points={pts} fill="none" stroke={renk} strokeWidth={rx * 0.09} strokeLinecap="round" opacity={0.9} />;
      })}
      <circle r={rx * 0.18} fill="#0F2A44" opacity={0.8} />
    </g>
  );
};

/** Dairesel ok (dönüş yönü). */
const DonusOk: React.FC<{ x: number; y: number; r: number; yon: number; renk?: string; t: number }> = ({ x, y, r, yon, renk = '#FFD54A', t }) => {
  const a = t * 1.5 * yon;
  const a1 = a;
  const a2 = a + yon * 4.4;
  const p = (aa: number) => `${x + Math.cos(aa) * r},${y + Math.sin(aa) * r}`;
  const sweep = yon > 0 ? 1 : 0;
  const ux = Math.cos(a2);
  const uy = Math.sin(a2);
  const tx = -Math.sin(a2) * yon;
  const ty = Math.cos(a2) * yon;
  const hx = x + ux * r;
  const hy = y + uy * r;
  const head = `M${hx - tx * 40 + ux * 34} ${hy - ty * 40 + uy * 34} L${hx + tx * 10} ${hy + ty * 10} L${hx - tx * 40 - ux * 34} ${hy - ty * 40 - uy * 34}`;
  const d = `M${p(a1)} A${r} ${r} 0 1 ${sweep} ${p(a2)}`;
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={head} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={renk} strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d={head} stroke={renk} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

const Banyo: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'gulus' | 'duz' }> = ({ goz = 'sok', agiz = 'o' }) => (
  <>
    <Arka b="05" />
    <Girdap x={540} y={1330} rx={92} ry={50} yon={1} />
    <Cizgi x={930} y={1760} s={1.35} goz={goz} agiz={agiz} bakis={[-1, 0.6]} kolSol={[14, 10]} kolSag={[10, 8]} />
  </>
);

/** 1 · Flush in Australia? (0 sn: büyük yazı) */
export const S24_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.18, 1.3]} origin={[600, 1300]}>
      <Banyo />
      <Patla t={t} at={0} y={640} size={90} renk="#FF6B5A">
        SPINS BACKWARD?
      </Patla>
    </Sahne>
  );
};

/** 2 · Same swirl. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.2, 2.35]} origin={[540, 1300]}>
      <Banyo goz="yari" agiz="duz" />
      <Ustu t={t} at={0.1} y={640} w={640} size={120}>
        BACKWARD
      </Ustu>
    </Sahne>
  );
};

/** Dünya sahneleri: kuzey ve güney kasırgaları. */
const KUZEY: [number, number] = [425, 746];
const GUNEY: [number, number] = [650, 1169];

/** 3 · Earth's spin really does push moving water. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[525, 945]}>
      <Arka b="06" />
      <g opacity={ap(t, 0.2)}>
        <DonusOk x={KUZEY[0]} y={KUZEY[1]} r={120} yon={-1} t={t} />
        <DonusOk x={GUNEY[0]} y={GUNEY[1]} r={120} yon={1} t={t} />
      </g>
      <g opacity={ap(t, useAt('push'))}>
        <Etiket x={540} y={1560} size={90}>
          EARTH'S SPIN
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 4 · But that push only matters for things hundreds of km wide: cetvel. */
const S4: React.FC = () => {
  const t = useTt();
  const h = useAt('hundreds');
  const w = interpolate(t, [0.1, 0.8], [0, 1], clamp);
  return (
    <Sahne zoom={[1.6, 1.75]} odak={KUZEY}>
      <Arka b="06" />
      <g opacity={ap(t, 0)}>
        <path d={`M${KUZEY[0] - 150} ${KUZEY[1] + 170} h${300 * w}`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M${KUZEY[0] - 150} ${KUZEY[1] + 170} h${300 * w}`} stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
        <path d={`M${KUZEY[0] - 150} ${KUZEY[1] + 150} v40 M${KUZEY[0] - 150 + 300 * w} ${KUZEY[1] + 150} v40`} stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
      </g>
      <g opacity={ap(t, h)}>
        <Etiket x={KUZEY[0]} y={KUZEY[1] + 245} size={44}>
          HUNDREDS OF KM
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 5 · like hurricanes. */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.0, 2.3]} odak={KUZEY}>
      <Arka b="06" />
      <DonusOk x={KUZEY[0]} y={KUZEY[1]} r={95} yon={-1} t={t} />
      <g opacity={ap(t, 0.1)}>
        <Etiket x={KUZEY[0]} y={KUZEY[1] + 175} size={44}>
          HURRICANE
        </Etiket>
      </g>
    </Sahne>
  );
};

/** Minik klozet simgesi. */
const Klozet: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-120} width={80} height={60} rx={10} fill="#F1E9D8" stroke={INK} strokeWidth={8} />
    <path d="M-60 -60 h120 q0 70 -40 90 l10 40 h-60 l10 -40 q-40 -20 -40 -90 z" fill="#F1E9D8" stroke={INK} strokeWidth={8} />
  </g>
);

/** 6 · A toilet is far too small. */
const S6: React.FC = () => {
  const t = useTt();
  const k = interpolate(t, [0, 1.4], [1, 0.3], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Sahne zoom={[1.6, 1.6]} odak={KUZEY}>
      <Arka b="06" />
      <DonusOk x={KUZEY[0]} y={KUZEY[1]} r={120} yon={-1} t={t} />
      <Klozet x={KUZEY[0] + 30} y={KUZEY[1] + 30} s={0.6 * k} />
      <g opacity={ap(t, 0.9)}>
        <path d={`M${KUZEY[0] + 110} ${KUZEY[1] - 40} L${KUZEY[0] + 45} ${KUZEY[1] + 5}`} stroke="#FFD54A" strokeWidth={8} strokeLinecap="round" />
      </g>
    </Sahne>
  );
};

/** 7 · ...far too small. */
const S7: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.05]}>
      <Arka b="05" bulanik karart={0.5} />
      <Klozet x={540} y={1150} s={2.2 * pop(t, 0)} />
      <Patla t={t} at={0.05} y={760} size={140}>
        TOO SMALL
      </Patla>
    </Sahne>
  );
};

/** 8 · The shape of the bowl decides: kesit, kenar delikleri açılı. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const b = useAt('bowl');
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 1050]}>
      <Arka b="05" bulanik karart={0.6} />
      <Panel x={100} y={560} w={880} h={1000} />
      {/* yukarıdan klozet: kenar halkası + iç hazne */}
      <ellipse cx={540} cy={1060} rx={360} ry={330} fill="#F1E9D8" stroke={INK} strokeWidth={14} />
      <ellipse cx={540} cy={1080} rx={270} ry={240} fill="#7FC4E8" stroke={INK} strokeWidth={10} />
      <Girdap x={540} y={1080} rx={240} ry={215} yon={1} hiz={1.2} renk="#fff" o={ap(t, 0.4)} />
      {/* kenar delikleri: açılı jetler */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const x = 540 + Math.cos(a) * 300;
        const y = 1070 + Math.sin(a) * 272;
        const tx = -Math.sin(a);
        const ty = Math.cos(a);
        const L = 50 + 20 * Math.sin(f / 4 + i);
        return (
          <g key={i} opacity={ap(t, b - 0.2)}>
            <circle cx={x} cy={y} r={14} fill={INK} />
            <path d={`M${x} ${y} l${(tx * 0.9 - Math.cos(a) * 0.4) * L} ${(ty * 0.9 - Math.sin(a) * 0.4) * L}`} stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
          </g>
        );
      })}
      <g opacity={ap(t, b)}>
        <Etiket x={540} y={650} size={90}>
          ANGLED JETS
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 9 · So which way does yours spin? */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.3, 1.45]} origin={[600, 1300]}>
      <Banyo goz="yari" agiz="sirit" />
      <Patla t={t} at={useAt('way')} y={680} size={110}>
        WHICH WAY?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.2} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's24',
  words: WORDS,
  voiceLen: 17.65,
  tail: 0.55,
  baslik: ['FLUSH IN', 'AUSTRALIA'],
  plan: [
    { w: 'Flush', C: S24_ILK },
    { w: 'Same', C: S2 },
    { w: "Earth's", C: S3 },
    { w: 'But', C: S4 },
    { w: 'like', C: S5 },
    { w: 'A', C: S6 },
    { w: 'small.', C: S7 },
    { w: 'The', C: S8 },
    { w: 'So', C: S9 },
    { w: '@END', C: S24_ILK },
  ],
  cues: [
    ['whoosh', 'Flush', 0, 0.2],
    ['impact', 'Same', 0.05, 0.14],
    ['whoosh', "Earth's", 0, 0.14],
    ['tick', 'hundreds', 0, 0.2],
    ['whoosh', 'like', 0, 0.12],
    ['pop', 'small.', 0, 0.25],
    ['ding', 'bowl', 0, 0.18],
    ['pop', 'way', 0, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S25_ILK, words: S25_WORDS },
});

export const S24 = short.Comp;
export const S24_FRAMES = short.frames;
export const S24_WORDS = WORDS;
