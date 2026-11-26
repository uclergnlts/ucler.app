/**
 * S-31 "Most of your heat escapes through your head?". Doğru bildiğimiz yanlışlar, 2. parti.
 * Kaynak: Vreeman & Carroll, BMJ 2008 "Medical myths": efsane 1950'lerde ABD ordusunun arktik kıyafetli
 * (başlar açık) deneyinden çıktı; baş vücut yüzeyinin ~%10'u, ısı kaybının da ~%10'u.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { INK } from '../../kit';
import { ap, Cizgi, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Ok } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu } from '../yb/ortak-yb';
import raw from './words.json';

const WORDS = raw as Word[];

/** Yağan kar. */
const Kar: React.FC<{ n?: number }> = ({ n = 50 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = (i * 137) % 1080;
        const y = ((i * 263 + f * (3 + (i % 4))) % 2000) - 40;
        return <circle key={i} cx={x + Math.sin(f / 20 + i) * 20} cy={y} r={3 + (i % 4) * 2} fill="#fff" opacity={0.75} />;
      })}
    </g>
  );
};

/** Başından buhar çıkan (ısı kaçan) dalgalar. */
const Buhar: React.FC<{ x: number; y: number; o?: number; renk?: string }> = ({ x, y, o = 1, renk = '#FF8A3D' }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {[-50, 0, 50].map((dx, i) => {
        const u = ((f / 30 + i * 0.33) % 1);
        return <path key={i} d={`M${x + dx} ${y - u * 160} q24 -30 0 -60 q-24 -30 0 -60`} stroke={renk} strokeWidth={12} fill="none" strokeLinecap="round" opacity={1 - u} />;
      })}
    </g>
  );
};

/** Bere. */
const Bere: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 10 q0 -110 90 -110 q90 0 90 110 z" fill="#E8434F" stroke={INK} strokeWidth={8} />
    <rect x={-96} y={0} width={192} height={36} rx={16} fill="#F1E9D8" stroke={INK} strokeWidth={8} />
    <circle cy={-108} r={26} fill="#F1E9D8" stroke={INK} strokeWidth={8} />
  </g>
);

const SX = 540;
const SY = 1760;
const SS = 1.35;
const BAS_Y = SY - 552 * SS; // baş merkezi

/** Karlı sokakta Çizgi (şapkasız, titriyor). */
const Sokak: React.FC<{ goz?: 'acik' | 'sok' | 'yari' | 'sikis' | 'mutlu'; agiz?: 'o' | 'acik' | 'sirit' | 'eksi' | 'duz' | 'gulus'; bere?: boolean; buhar?: number }> = ({ goz = 'sikis', agiz = 'eksi', bere = false, buhar = 1 }) => {
  const f = useCurrentFrame();
  const tit = bere ? 0 : Math.sin(f * 2.2) * 4;
  return (
    <>
      <Arka b="20" />
      <g transform={`translate(${tit} 0)`}>
        <Cizgi x={SX} y={SY} s={SS} goz={goz} agiz={agiz} kas={bere ? 'duz' : 'uzgun'} kolSol={[-20, 140]} kolSag={[-20, 140]} />
        {bere && <Bere x={SX} y={BAS_Y - 10} s={SS * 0.95} />}
      </g>
      <Buhar x={SX} y={BAS_Y - 120} o={buhar} />
      <Kar />
    </>
  );
};

/** 1 · Most of your heat escapes through your head? */
export const S31_ILK: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.12, 1.22]} origin={[540, 1150]}>
      <Sokak />
      <Patla t={t} at={-0.5} y={560} size={94} renk="#FF8A3D">
        HEAT LEAVES HEAD?
      </Patla>
    </Sahne>
  );
};

/** 2 · Wrong. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.22, 1.3]} origin={[540, 1150]}>
      <Sokak goz="yari" agiz="duz" buhar={0.5} />
      <Ustu t={t} at={0.03} y={600} w={720} size={124}>
        MOST HEAT
      </Ustu>
      <Duz>
        <g transform={`translate(910 450) scale(${pop(t, 0.03)})`}>
          <Carpi x={0} y={0} s={0.5} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 3 · That idea came from an old army test. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.12]} origin={[540, 1100]}>
      <Arka b="21" />
      <Kar n={30} />
      <Duz>
        <g transform={`translate(540 640) rotate(-4) scale(${pop(t, useAt('army') - 0.1)})`}>
          <rect x={-330} y={-100} width={660} height={140} rx={16} fill="#3E5A3A" stroke={INK} strokeWidth={10} />
          <text y={12} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={84} fill="#F1E9D8">
            1950s ARMY TEST
          </text>
        </g>
      </Duz>
    </Sahne>
  );
};

/** 4 · People wore arctic suits, but no hats. */
const S4: React.FC = () => {
  const t = useTt();
  const nh = useAt('hats.');
  return (
    <Sahne zoom={[1.08, 1.2]} origin={[540, 1250]}>
      <Arka b="21" />
      <Cizgi x={540} y={1760} s={1.35} renk="#EEF2F7" goz="sikis" agiz="eksi" kas="uzgun" kolSol={[-20, 140]} kolSag={[-20, 140]} />
      <Buhar x={540} y={1760 - 552 * 1.35 - 120} o={ap(t, nh - 0.3)} />
      <Kar n={30} />
      <Duz>
        <g opacity={ap(t, useAt('suits,') - 0.1)}>
          <Etiket x={540} y={520} size={86} renk="#BFEAFF">
            ARCTIC SUIT
          </Etiket>
        </g>
      </Duz>
      <Patla t={t} at={nh - 0.05} y={680} size={120} renk="#FF6B5A">
        NO HAT
      </Patla>
    </Sahne>
  );
};

/** Termal görüntü: soğuk (mavi) gövde, sıcak baş. */
const Termal: React.FC<{ bas: number; vucut?: number }> = ({ bas, vucut = 0 }) => {
  const f = useCurrentFrame();
  const sicak = `rgb(255,${Math.round(140 - 40 * bas)},${Math.round(60 - 30 * bas)})`;
  return (
    <g>
      <rect x={110} y={480} width={860} height={1020} rx={48} fill="#0A0E3A" />
      <g>
        <path d="M400 900 q0 -60 60 -60 h160 q60 0 60 60 v330 q0 30 -30 30 h-220 q-30 0 -30 -30 z" fill={vucut ? '#FF8A3D' : '#2C3FD0'} />
        <path d="M390 920 L300 1180 M690 920 L780 1180 M470 1250 L450 1450 M610 1250 L630 1450" stroke={vucut ? '#FF8A3D' : '#2C3FD0'} strokeWidth={80} strokeLinecap="round" />
        <circle cx={540} cy={740} r={95} fill={sicak} />
        <circle cx={540} cy={740} r={140 + Math.sin(f / 5) * 8} fill={sicak} opacity={0.25 * bas} filter="url(#s-glow)" />
      </g>
      <text x={150} y={540} fontFamily="IBM Plex Mono" fontSize={36} fill="#9FD8FF">
        THERMAL
      </text>
    </g>
  );
};

/** 5 · Of course heat left through the head. */
const S5: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="21" bulanik karart={0.7} />
      <Termal bas={ap(t, 0.2, 0.8)} />
      <g opacity={ap(t, useAt('head.') - 0.2)}>
        <Ok x={830} y={620} L={160} r={160} renk="#FF8A3D" />
      </g>
    </Sahne>
  );
};

/** 6 · It was the only part uncovered. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.0, 1.08]} origin={[540, 900]}>
      <Arka b="21" bulanik karart={0.7} />
      <Termal bas={1} />
      <Patla t={t} at={useAt('uncovered.') - 0.1} y={1350} size={92} renk="#FFD54A" r={0}>
        ONLY PART UNCOVERED
      </Patla>
    </Sahne>
  );
};

/** Pasta grafiği: oran 0..1, k: çizilme. */
const Pasta: React.FC<{ x: number; y: number; r?: number; oran: number; k: number; renk: string; yazi: string }> = ({ x, y, r = 210, oran, k, renk, yazi }) => {
  const a = oran * k * Math.PI * 2;
  const ex = x + Math.sin(a) * r;
  const ey = y - Math.cos(a) * r;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#2A2F4A" stroke={INK} strokeWidth={10} />
      {k > 0 && <path d={`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${ex} ${ey} Z`} fill={renk} stroke={INK} strokeWidth={8} />}
      <text x={x} y={y + r + 110} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={64} fill="#F1E9D8">
        {yazi}
      </text>
    </g>
  );
};

/** 7 · Your head is about ten percent of your body, */
const S7: React.FC = () => {
  const t = useTt();
  const ten = useAt('ten');
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="20" bulanik karart={0.65} />
      <Panel x={110} y={480} w={860} h={1020} />
      <Pasta x={540} y={940} oran={0.1} k={ap(t, ten - 0.2, 0.6)} renk="#FFD54A" yazi="OF YOUR BODY" />
      <Patla t={t} at={ten} y={690} x={720} size={110} r={0}>
        10%
      </Patla>
    </Sahne>
  );
};

/** 8 · and it loses about ten percent of your heat. */
const S8: React.FC = () => {
  const t = useTt();
  const ten = useAt('ten#2');
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="20" bulanik karart={0.65} />
      <Panel x={110} y={480} w={860} h={1020} />
      <Pasta x={540} y={940} oran={0.1} k={ap(t, ten - 0.2, 0.6)} renk="#FF8A3D" yazi="OF YOUR HEAT" />
      <Patla t={t} at={ten} y={690} x={720} size={110} r={0} renk="#FF8A3D">
        10%
      </Patla>
    </Sahne>
  );
};

/** 9 · Hat or no hat? */
const S9: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.24, 1.34]} origin={[540, 1150]}>
      <Sokak goz="mutlu" agiz="sirit" bere buhar={0} />
      <Patla t={t} at={0.05} y={560} size={116}>
        HAT OR NO HAT?
      </Patla>
      <Zerre n={8} color="#FFE2A8" o={0.15} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's31',
  words: WORDS,
  voiceLen: 22.94,
  tail: 0.6,
  reklam: true,
  baslik: ['NO HAT IN', 'WINTER'],
  plan: [
    { w: 'Most', C: S31_ILK },
    { w: 'Wrong.', C: S2 },
    { w: 'That', C: S3 },
    { w: 'People', C: S4 },
    { w: 'Of', C: S5 },
    { w: 'It', C: S6 },
    { w: 'Your', C: S7 },
    { w: 'and', C: S8 },
    { w: 'Hat', C: S9 },
    { w: '@END', C: S31_ILK },
  ],
  cues: [
    ['whoosh', 'Most', 0, 0.12],
    ['impact', 'Wrong.', 0, 0.16],
    ['gavel', 'army', 0, 0.12],
    ['pop', 'hats.', 0, 0.15],
    ['buzz', 'Of', 0, 0.08],
    ['ding', 'uncovered.', 0, 0.12],
    ['tick', 'ten', 0, 0.2],
    ['tick', 'ten#2', 0, 0.2],
    ['pop', 'Hat', 0.05, 0.2],
  ],
  muzik: ['music-happy', 0.06],
});

export const S31 = short.Comp;
export const S31_FRAMES = short.frames;
export const S31_WORDS = WORDS;
