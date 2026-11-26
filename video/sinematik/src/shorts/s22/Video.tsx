/**
 * S-22 "Cracking your knuckles". Doğru bildiğimiz yanlışlar serisi, yeni sistem (Nano Banana arka plan + kodla Çizgi).
 * Kaynak: Unger 1998, Arthritis & Rheumatism (60 yıl yalnız sol el, iki elde de artrit yok; 2009 Ig Nobel).
 * Kawchuk ve ark. 2015, PLOS ONE (MRI: çıtlama, eklem sıvısında gaz boşluğu oluşması).
 * Kanca: 0 sn "ARTHRITIS?", 1,5 sn hüküm "No arthritis." Neden ve kanıt sonda.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Onay } from '../parca';
import { Arka, Duz, Panel, Patla, Sahne, Ustu, Yildiz, Yumruk } from '../yb/ortak-yb';
import { S23_ILK, S23_WORDS } from '../s23/Video';
import raw from './words.json';

const WORDS = raw as Word[];
const ELLER: [number, number] = [10, -120]; // eller göğüs önünde birleşik

/** Oturma odasında Çizgi parmaklarını çıtlatıyor. */
const Oda: React.FC<{ goz?: 'acik' | 'mutlu' | 'sikis' | 'sok' | 'yari'; agiz?: 'gulus' | 'acik' | 'o' | 'sirit' | 'duz' | 'eksi'; pops?: number[]; kas?: 'duz' | 'kalkik' | 'catik' }> = ({ goz = 'sikis', agiz = 'sirit', pops = [], kas = 'duz' }) => {
  const t = useTt();
  return (
    <>
      <Arka b="01" />
      <Cizgi x={540} y={1420} s={0.8} goz={goz} agiz={agiz} kas={kas} kolSol={ELLER} kolSag={ELLER} bas={Math.sin(t * 9) * 2} />
      {pops.map((at, i) => {
        const p = pop(t, at, 0.18);
        const o = interpolate(t, [at, at + 0.15, at + 0.5], [0, 1, 0], clamp);
        return (
          <g key={i} opacity={o}>
            <Yildiz x={540 + (i % 2 ? 90 : -90)} y={1110 - i * 20} s={0.5 * p}>
              POP
            </Yildiz>
          </g>
        );
      })}
    </>
  );
};

/** 1 · Cracking your knuckles? (0. sn: büyük ARTHRITIS?) */
export const S22_ILK: React.FC = () => {
  const t = useTt();
  const k = useAt('knuckles?');
  return (
    <Sahne zoom={[1.72, 1.8]} origin={[540, 1050]} shakeAt={[k + 0.1]} shake={10}>
      <Oda pops={[0.05, k + 0.1]} />
      <Patla t={t} at={-0.5} y={640} size={140} renk="#FF6B5A">
        ARTHRITIS?
      </Patla>
    </Sahne>
  );
};

/** 2 · No arthritis. */
const S2: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[1.8, 1.85]} origin={[540, 1050]}>
      <Oda goz="mutlu" agiz="gulus" />
      <Ustu t={t} at={0.15} y={660} w={660} size={130}>
        ARTHRITIS
      </Ustu>
      <Duz>
        <g transform={`translate(910 520) scale(${pop(t, 0.1)})`}>
          <Carpi x={0} y={0} s={0.55} />
        </g>
      </Duz>
    </Sahne>
  );
};

/** 3 · That pop... yumruk yakın çekim. */
const S3: React.FC = () => {
  const t = useTt();
  const p = useAt('pop');
  const s = 1 + Math.max(0, 1 - Math.abs(t - p - 0.1) * 6) * 0.06;
  return (
    <Sahne zoom={[1.0, 1.08]} shakeAt={[p + 0.05]} shake={14}>
      <Arka b="01" bulanik karart={0.35} />
      <Yumruk x={540} y={1150} s={1.5 * s} r={-6} />
      <g transform={`scale(${pop(t, p)})`} style={{ transformOrigin: '540px 820px' }}>
        <Yildiz x={540} y={820} s={1.1}>
          POP
        </Yildiz>
      </g>
    </Sahne>
  );
};

/** Eklem kesiti: iki kemik, kapsül, sıvı; kabarcık (b 0..1). */
const Eklem: React.FC<{ b?: number; yakin?: boolean; t: number }> = ({ b = 0, t }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {/* kapsül + sıvı */}
      <rect x={260} y={820} width={560} height={300} rx={150} fill="#5FB8E8" opacity={0.28} stroke="#FF8FB1" strokeWidth={14} />
      {/* üst kemik */}
      <path d="M380 400 h320 v340 q0 80 -80 90 q-80 10 -80 -10 q0 20 -80 10 q-80 -10 -80 -90 z" fill="#F1E9D8" stroke={INK} strokeWidth={12} />
      <path d="M430 420 v280 M650 420 v280" stroke="#D9CDB4" strokeWidth={10} strokeLinecap="round" />
      {/* alt kemik */}
      <path d="M380 1540 h320 v-340 q0 -80 -80 -90 q-80 -10 -80 10 q0 -20 -80 -10 q-80 10 -80 90 z" fill="#F1E9D8" stroke={INK} strokeWidth={12} />
      <path d="M430 1520 v-280 M650 1520 v-280" stroke="#D9CDB4" strokeWidth={10} strokeLinecap="round" />
      {/* küçük çözünmüş gaz zerreleri */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={300 + ((i * 97) % 480) + Math.sin(f / 9 + i) * 8} cy={900 + ((i * 53) % 150) + Math.cos(f / 11 + i) * 6} r={5} fill="#fff" opacity={0.5 * (1 - b)} />
      ))}
      {/* kabarcık */}
      {b > 0 && (
        <g>
          <circle cx={540} cy={970} r={20 + b * 92} fill="#fff" opacity={0.22} stroke="#fff" strokeWidth={8} />
          <ellipse cx={510} cy={930} rx={10 + b * 22} ry={6 + b * 10} fill="#fff" opacity={0.6} />
        </g>
      )}
      <g opacity={b > 0.95 ? interpolate(Math.sin(t * 20), [-1, 1], [0.6, 1]) : 0} />
    </g>
  );
};

/** 4 · is not your bones grinding. */
const S4: React.FC = () => {
  const t = useTt();
  const b = useAt('bones');
  return (
    <Sahne zoom={[1.0, 1.06]}>
      <Arka b="01" bulanik karart={0.55} />
      <Panel x={120} y={380} w={840} h={1200} />
      <Eklem t={t} />
      <g transform={`translate(${-Math.sin(t * 40) * 4 * ap(t, b, 0.1)} 0)`}>
        <Ustu t={t} at={b + 0.5} x={820} y={1020} w={300} size={80}>
          BONES
        </Ustu>
      </g>
      <g opacity={ap(t, b)}>
        <path d="M720 1000 L640 980" stroke="#FFD54A" strokeWidth={10} strokeLinecap="round" />
      </g>
    </Sahne>
  );
};

/** 5 · It is a tiny gas bubble... */
const S5: React.FC = () => {
  const t = useTt();
  const g = useAt('gas');
  const b = interpolate(t, [g - 0.1, g + 0.9], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Sahne zoom={[1.0, 1.12]} origin={[540, 970]}>
      <Arka b="01" bulanik karart={0.55} />
      <Panel x={120} y={380} w={840} h={1200} />
      <Eklem t={t} b={b} />
      <g opacity={ap(t, g + 0.3)}>
        <Etiket x={540} y={600} size={96}>
          GAS BUBBLE
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 6 · forming in the fluid inside the joint: sıvıya yakın çekim. */
const S6: React.FC = () => {
  const t = useTt();
  const fl = useAt('fluid');
  return (
    <Sahne zoom={[1.5, 1.7]} origin={[540, 970]}>
      <Arka b="01" bulanik karart={0.55} />
      <Panel x={120} y={380} w={840} h={1200} />
      <Eklem t={t} b={1 + Math.sin(t * 3) * 0.04} />
      <g opacity={ap(t, fl)}>
        <Etiket x={540} y={1250} size={60} renk="#9FDcff">
          JOINT FLUID
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 7 · One doctor cracked only his left hand. */
const S7: React.FC = () => {
  const t = useTt();
  const l = useAt('left');
  return (
    <Sahne zoom={[1.45, 1.55]} odak={[420, 1240]}>
      <Arka b="02" />
      <Cizgi x={360} y={1500} s={0.82} onluk goz="sikis" agiz="sirit" kolSol={[12, 10]} kolSag={[150, 30]} bas={4} />
      {[0.1, l, l + 0.5].map((at, i) => (
        <g key={i} opacity={interpolate(t, [at, at + 0.12, at + 0.45], [0, 1, 0], clamp)}>
          <Yildiz x={455} y={955} s={0.4 * pop(t, at, 0.2)}>
            POP
          </Yildiz>
        </g>
      ))}
      <g opacity={ap(t, l)}>
        <Etiket x={540} y={930} size={70}>
          LEFT
        </Etiket>
      </g>
    </Sahne>
  );
};

/** 8 · for sixty years: takvim sayacı. */
const S8: React.FC = () => {
  const t = useTt();
  const s = useAt('sixty');
  const n = Math.round(interpolate(t, [0, s + 0.4], [1, 60], { ...clamp, easing: (x) => x * x }));
  const f = useCurrentFrame();
  return (
    <Sahne zoom={[1.0, 1.1]} origin={[580, 900]}>
      <Arka b="02" karart={0.25} />
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((f / 30) * 1.6 + i / 7) % 1;
        return <rect key={i} x={lerp(520, 120 + i * 130, u)} y={lerp(560, 200 + (i % 3) * 120, u)} width={110} height={130} rx={8} fill="#F1E9D8" stroke={INK} strokeWidth={6} opacity={1 - u} transform={`rotate(${u * 200 * (i % 2 ? 1 : -1)} ${lerp(575, 175 + i * 130, u)} ${lerp(625, 265, u)})`} />;
      })}
      <g transform={`translate(540 1050) scale(${pop(t, 0.05)})`}>
        <rect x={-260} y={-230} width={520} height={400} rx={30} fill="#F1E9D8" stroke={INK} strokeWidth={14} />
        <rect x={-260} y={-230} width={520} height={90} rx={30} fill="#FF6B5A" stroke={INK} strokeWidth={14} />
        <text y={110} textAnchor="middle" fontFamily="Manrope Duz" fontWeight={800} fontSize={230} fill={INK}>
          {n}
        </text>
      </g>
      <Etiket x={540} y={1360} size={100}>
        YEARS
      </Etiket>
    </Sahne>
  );
};

/** Röntgen el: kemikler (sol/sağ). kir: kireçlenme yok, temiz eklemler. */
const RontgenEl: React.FC<{ x: number; y: number; s?: number; ayna?: boolean; o?: number }> = ({ x, y, s = 1, ayna = false, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${ayna ? -s : s} ${s})`} opacity={o}>
    <path d="M-60 120 l-10 140 M0 120 v150 M60 120 l10 140" stroke="#DDF3FF" strokeWidth={22} strokeLinecap="round" />
    {[-75, -25, 25, 75].map((fx, i) => (
      <g key={i}>
        <path d={`M${fx * 0.8} 110 L${fx} -20`} stroke="#DDF3FF" strokeWidth={20} strokeLinecap="round" />
        <path d={`M${fx} -34 L${fx * 1.05} -${100 + (i === 1 || i === 2 ? 20 : 0)}`} stroke="#DDF3FF" strokeWidth={17} strokeLinecap="round" />
        <path d={`M${fx * 1.05} -${116 + (i === 1 || i === 2 ? 20 : 0)} L${fx * 1.08} -${160 + (i === 1 || i === 2 ? 25 : 0)}`} stroke="#DDF3FF" strokeWidth={14} strokeLinecap="round" />
      </g>
    ))}
    <path d="M-95 100 L-140 30 L-150 -30" stroke="#DDF3FF" strokeWidth={18} strokeLinecap="round" />
  </g>
);

/** 9 · Then he checked both hands: ışıklı panoda iki röntgen. */
const S9: React.FC = () => {
  const t = useTt();
  const b = useAt('both');
  return (
    <Sahne zoom={[2.3, 2.45]} odak={[810, 600]}>
      <Arka b="02" />
      <rect x={705} y={455} width={212} height={282} fill="#0B1A2C" opacity={interpolate(t, [0, 0.3], [0, 0.92], clamp)} />
      <RontgenEl x={760} y={620} s={0.26} o={ap(t, 0.2)} />
      <RontgenEl x={862} y={620} s={0.26} ayna o={ap(t, b)} />
    </Sahne>
  );
};

/** 10 · No arthritis in either. */
const S10: React.FC = () => {
  const t = useTt();
  return (
    <Sahne zoom={[2.45, 2.5]} odak={[810, 600]}>
      <Arka b="02" />
      <rect x={705} y={455} width={212} height={282} fill="#0B1A2C" opacity={0.92} />
      <RontgenEl x={760} y={620} s={0.26} />
      <RontgenEl x={862} y={620} s={0.26} ayna />
      <Onay x={760} y={700} s={0.22 * pop(t, 0.15)} />
      <Onay x={862} y={700} s={0.22 * pop(t, 0.45)} />
    </Sahne>
  );
};

/** 11 · So, crack or stop? */
const S11: React.FC = () => {
  const t = useTt();
  const c = useAt('crack');
  return (
    <Sahne zoom={[1.72, 1.82]} origin={[540, 1050]}>
      <Oda goz="yari" agiz="duz" kas="kalkik" pops={[c + 0.05]} />
      <Patla t={t} at={c} y={560} size={120}>
        CRACK
      </Patla>
      <Patla t={t} at={useAt('stop?')} y={700} size={120} renk="#FF6B5A">
        OR STOP?
      </Patla>
      <Zerre n={10} color="#FFE2A8" o={0.25} />
    </Sahne>
  );
};

const short = makeShort({
  kod: 's22',
  words: WORDS,
  voiceLen: 19.92,
  tail: 0.55,
  reklam: true,
  baslik: ['CRACK YOUR', 'KNUCKLES'],
  plan: [
    { w: 'Cracking', C: S22_ILK },
    { w: 'No', C: S2 },
    { w: 'That', C: S3 },
    { w: 'not', C: S4 },
    { w: 'It', C: S5 },
    { w: 'forming', C: S6 },
    { w: 'One', C: S7 },
    { w: 'for', C: S8 },
    { w: 'Then', C: S9 },
    { w: 'No#2', C: S10 },
    { w: 'So,', C: S11 },
    { w: '@END', C: S22_ILK },
  ],
  cues: [
    ['pop', 'Cracking', 0, 0.3],
    ['pop', 'knuckles?', 0.1, 0.3],
    ['impact', 'No', 0.1, 0.16],
    ['pop', 'pop', 0, 0.35],
    ['buzz', 'bones', 0.4, 0.1],
    ['pop', 'gas', 0.2, 0.2],
    ['whoosh', 'One', 0, 0.14],
    ['pop', 'left', 0, 0.25],
    ['tick', 'for', 0, 0.2],
    ['tick', 'sixty', 0, 0.2],
    ['whoosh', 'Then', 0, 0.14],
    ['ding', 'No#2', 0.15, 0.2],
    ['ding', 'No#2', 0.45, 0.2],
    ['pop', 'crack', 0.05, 0.3],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S23_ILK, words: S23_WORDS },
});

export const S22 = short.Comp;
export const S22_FRAMES = short.frames;
export const S22_WORDS = WORDS;
