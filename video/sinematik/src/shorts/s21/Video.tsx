/**
 * S-21 "Your toast falls off the table". Dikey Short, ~24 sn + 1 sn sonraki video.
 * Kaynak: Robert Matthews, "Tumbling toast, Murphy's Law and the fundamental constants", European Journal of Physics 1995
 * (Ig Nobel 1996): ekmek masa kenarından devrilirken dönmeye başlar; ~75 cm'lik masadan yere kadar ancak yarım tur atar.
 * Yaklaşık 3 m'lik masadan tam tur atıp yağlı yüzü üstte düşer. Yağın ağırlığı belirleyici değildir.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, T, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Ok, Onay, rnd, SARI } from '../parca';
import { S22_ILK, S22_WORDS } from '../s22/ilk';
import raw from './words.json';

const WORDS = raw as Word[];
export const S21_WORDS = WORDS;
const YAG = '#FFE25A';

/** Yandan ekmek dilimi: yağ üst yüzde (r=0). */
const Ekmek: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-130} y={-24} width={260} height={48} rx={16} fill="#E8B46A" stroke={INK} strokeWidth={8} />
    <rect x={-130} y={-24} width={260} height={20} rx={10} fill="#B8742E" opacity={0.5} />
    <path d="M-118 -30 q20 -22 50 -8 q40 -20 70 -2 q40 -18 60 4 q40 -10 50 8 v8 h-230 Z" fill={YAG} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </g>
);

/** Önden ekmek: yag=true yağlı yüz. */
const EkmekOn: React.FC<{ x: number; y: number; r?: number; s?: number; yag?: boolean }> = ({ x, y, r = 0, s = 1, yag = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-110 -40 q-40 -90 40 -100 q70 -30 140 0 q80 10 40 100 v140 q0 20 -20 20 h-180 q-20 0 -20 -20 Z" fill="#B8742E" stroke={INK} strokeWidth={9} strokeLinejoin="round" transform="translate(-0 0)" />
    <path d="M-90 -36 q-30 -70 34 -80 q62 -24 122 0 q64 10 34 80 v120 h-190 Z" fill="#F2CC8A" />
    {yag && <path d="M-70 -30 q-10 -50 50 -50 q70 -10 90 30 q20 40 -10 80 q-40 40 -100 20 q-40 -20 -30 -80 Z" fill={YAG} stroke={INK} strokeWidth={6} />}
    {yag && <path d="M-40 -40 q30 -20 70 -6" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />}
  </g>
);

/** Kahvaltı odası, yandan: masa sağ kenarı x=640, tabla y=1050, zemin y=1700. h ile masa yüksekliği ölçeklenir. */
const Oda: React.FC<{ masa?: boolean }> = ({ masa = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#FFD9B0" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-460 + i * 180} y={-600} width={60} height={2300} fill="#FFCFA0" />
      ))}
      <rect x={640} y={380} width={380} height={460} rx={12} fill="#BFE3F0" stroke="#fff" strokeWidth={24} />
      <path d="M830 380 V840 M640 610 H1020" stroke="#fff" strokeWidth={14} />
      <circle cx={740} cy={490} r={50} fill={SARI} />
      <ellipse cx={900 + Math.sin(f / 40) * 12} cy={700} rx={80} ry={26} fill="#fff" />
      <g transform="translate(250 520)">
        <rect x={-120} y={-150} width={240} height={300} fill="#fff" stroke="#8C5A2E" strokeWidth={18} />
        <path d="M-80 90 l60 -110 l50 70 l30 -40 l40 80 Z" fill="#7BC86A" stroke={INK} strokeWidth={5} />
        <circle cx={50} cy={-70} r={26} fill="#FF8A4A" />
      </g>
      <rect x={-500} y={1700} width={2100} height={1000} fill="#B8793E" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-300 + i * 220} 1700 l-80 1000`} stroke="#A0652E" strokeWidth={6} />
      ))}
      <path d="M-500 1700 H1600" stroke={INK} strokeWidth={8} />
      {masa && <Masa />}
    </g>
  );
};

const Masa: React.FC<{ y?: number }> = ({ y = 1050 }) => (
  <g>
    <rect x={480} y={y + 40} width={50} height={1700 - y - 40} fill="#8C5A2E" stroke={INK} strokeWidth={8} />
    <rect x={-120} y={y + 40} width={50} height={1700 - y - 40} fill="#8C5A2E" stroke={INK} strokeWidth={8} />
    <rect x={-500} y={y} width={1140} height={50} rx={10} fill="#D9A25A" stroke={INK} strokeWidth={9} />
    <path d={`M-500 ${y} h1140 v30 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 q-60 60 -120 0 Z`} fill="#FF6A5A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {/* tabak, fincan */}
    <ellipse cx={420} cy={y - 8} rx={130} ry={18} fill="#fff" stroke={INK} strokeWidth={7} />
    <g transform={`translate(160 ${y - 10})`}>
      <path d="M-50 -90 h100 l-10 90 h-80 Z" fill="#5FC8FF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M50 -70 q50 0 40 40 q-10 20 -46 14" stroke={INK} strokeWidth={7} fill="none" />
    </g>
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Your toast slides off the table. Ekmek masa kenarından havada. */
const S1: React.FC = () => {
  const t = useTt();
  const k = ap(t, 0, 1.9, (x) => x);
  return (
    <Kadraj zoom={[1.2, 1.05]} origin={[640, 1100]}>
      <Oda />
      <Cizgi x={220} y={1700} s={1.6} goz="sok" agiz="o" kas="kalkik" bakis={[1, 0.5]} kolSag={[lerp(80, 70, k), 20]} kolSol={[20, 14]} />
      <Masa />
      <Ekmek x={lerp(690, 760, k)} y={lerp(1030, 1180, k * k)} r={lerp(28, 95, k)} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${560 + i * 22} ${1000 - i * 26} h-70`} stroke={INK} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      ))}
      <g transform={`translate(830 950) scale(${pop(t, 0.2)})`}>
        <Etiket x={0} y={0} size={130} renk="#fff">
          <T en="NO!" tr="HAYIR!" />
        </Etiket>
      </g>
    </Kadraj>
  );
};
export const S21_ILK = S1;

/** 2 · Butter side down. Yerde, yağlı yüz altta, yağ sıçramış. */
const S2: React.FC = () => {
  const t = useTt();
  const dn = useAt('down.');
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[540, 1150]} shakeAt={[0.08]} shake={20}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#FFD9B0" />
      <rect x={-500} y={1200} width={2100} height={1500} fill="#B8793E" stroke={INK} strokeWidth={9} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-300 + i * 220} 1200 l-80 1400`} stroke="#A0652E" strokeWidth={8} />
      ))}
      <path d="M-120 1200 V300 M-60 1200 V300" stroke="#8C5A2E" strokeWidth={50} />
      {/* yağ sıçraması */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI - Math.PI;
        const d = ap(t, 0.08, 0.3) * (240 + rnd(i) * 160);
        return <ellipse key={i} cx={540 + Math.cos(a) * d} cy={1190 + Math.sin(a) * d * 0.25} rx={30 + rnd(i) * 26} ry={16} fill={YAG} stroke={INK} strokeWidth={6} />;
      })}
      <ellipse cx={540} cy={1196} rx={330} ry={30} fill={YAG} stroke={INK} strokeWidth={7} />
      <Ekmek x={540} y={1160} r={180} s={2.2} />
      <g transform={`translate(540 700) scale(${pop(t, dn - 0.15)}) rotate(-4)`}>
        <Etiket x={0} y={0} size={130}>
          <T en="BUTTER DOWN" tr="YAĞLI YÜZ" />
        </Etiket>
      </g>
      <Ok x={540} y={780} L={200} r={90} s={pop(t, dn - 0.05)} />
    </Kadraj>
  );
};

/** 3 · Again. Yerde üç ekmek, Çizgi bıkmış. */
const S3: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1200]}>
      <Oda masa={false} />
      <Cizgi x={300} y={1700} s={1.7} goz="kapali" agiz="eksi" kas="uzgun" kolSag={[150, 150]} kolSol={[20, 14]} />
      {[[620, 1680, 180], [800, 1690, 176], [960, 1676, 184]].map(([x, y, r], i) => (
        <g key={i} opacity={pop(t, i * 0.15) > 0 ? 1 : 0}>
          <ellipse cx={x} cy={y + 24} rx={150} ry={14} fill={YAG} stroke={INK} strokeWidth={5} />
          <Ekmek x={x} y={y - (1 - ap(t, i * 0.15, 0.2)) * 500} r={r} s={0.9} />
        </g>
      ))}
      <g transform={`translate(760 760) scale(${pop(t, 0.1)}) rotate(-6)`}>
        <Etiket x={0} y={0} size={170} renk="#fff">
          <T en="AGAIN." tr="YİNE." />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 4 · It is not bad luck. Kara kedi, kırık ayna, çarpı. */
const S4: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const nt = useAt('not');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#2A2440" />
      <circle cx={540} cy={950} r={700} fill="#8A6AD4" opacity={0.25} filter="url(#s-glow)" />
      {/* kırık ayna */}
      <g transform="translate(760 820)">
        <ellipse rx={210} ry={290} fill="#C9E6F2" stroke="#D9A25A" strokeWidth={28} />
        <path d="M-30 -260 L20 -60 L-120 60 M20 -60 L150 40 L80 250 M20 -60 L-10 240" stroke={INK} strokeWidth={8} fill="none" strokeLinejoin="round" />
      </g>
      {/* kara kedi */}
      <g transform="translate(300 1250)">
        <path d={`M150 0 q130 -40 100 -220 q-10 -40 ${-30 + Math.sin(f / 6) * 20} -60`} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d="M-150 0 q-20 -330 150 -330 q170 0 150 330 Z" fill="#1B2033" stroke={INK} strokeWidth={8} />
        <path d="M-130 -330 l20 -130 l90 80 h40 l90 -80 l20 130 q10 130 -130 130 q-140 0 -130 -130 Z" fill="#1B2033" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={-50} cy={-300} rx={26} ry={32} fill="#B8F06A" />
        <ellipse cx={50} cy={-300} rx={26} ry={32} fill="#B8F06A" />
        <ellipse cx={-50} cy={-300} rx={8} ry={26} fill={INK} />
        <ellipse cx={50} cy={-300} rx={8} ry={26} fill={INK} />
      </g>
      <Etiket x={540} y={590} size={104} renk="#fff">
        <T en="BAD LUCK?" tr="ŞANSSIZLIK MI?" />
      </Etiket>
      <Carpi x={540} y={950} s={pop(t, nt) * 2.6} />
    </Kadraj>
  );
};

/** 5 · And it is not the butter's weight. Terazi: yağ tüy gibi. */
const S5: React.FC = () => {
  const t = useTt();
  const nt = useAt('not#2');
  const e = lerp(0, 16, ap(t, 0.2, 0.6));
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#5C4A1A" />
      <circle cx={540} cy={950} r={700} fill={YAG} opacity={0.22} filter="url(#s-glow)" />
      <rect x={515} y={700} width={50} height={600} fill="#C9D2E3" stroke={INK} strokeWidth={9} />
      <path d="M380 1320 h320 l-40 -50 h-240 Z" fill="#8C96AD" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <g transform={`rotate(${e} 540 720)`}>
        <rect x={160} y={700} width={760} height={34} rx={17} fill="#C9D2E3" stroke={INK} strokeWidth={9} />
        {[[200, YAG], [880, '#E8B46A']].map(([x, c], i) => (
          <g key={i} transform={`translate(${x} 720) rotate(${-e})`}>
            <path d="M0 0 L-110 240 M0 0 L110 240" stroke={INK} strokeWidth={7} />
            <path d="M-130 240 h260 q-20 70 -130 70 q-110 0 -130 -70 Z" fill="#8C96AD" stroke={INK} strokeWidth={8} />
            {i === 0 ? <rect x={-36} y={196} width={72} height={44} rx={8} fill={c as string} stroke={INK} strokeWidth={6} /> : <EkmekOn x={0} y={150} s={0.7} yag={false} />}
          </g>
        ))}
      </g>
      <Etiket x={200} y={1240} size={72} renk="#fff">
        <T en="BUTTER" tr="YAĞ" />
      </Etiket>
      <Etiket x={880} y={1250} size={72} renk="#fff">
        <T en="BREAD" tr="EKMEK" />
      </Etiket>
      <Carpi x={540} y={580} s={pop(t, nt) * 1.1} />
    </Kadraj>
  );
};

/** Yandan sade diyagram fonu: masa (tabla y), zemin 1700. */
const Diyagram: React.FC<{ y?: number; children?: React.ReactNode; fon?: string }> = ({ y = 760, children, fon = '#1F3A5C' }) => (
  <g>
    <rect x={-500} y={-600} width={2100} height={3200} fill={fon} />
    {Array.from({ length: 30 }, (_, i) => (
      <path key={i} d={i < 15 ? `M-500 ${i * 150 - 200} H1600` : `M${(i - 15) * 150 - 300} -600 V2600`} stroke="#fff" strokeWidth={3} opacity={0.07} />
    ))}
    <rect x={-500} y={1700} width={2100} height={1000} fill="#12233A" stroke={INK} strokeWidth={9} />
    <rect x={300} y={y + 40} width={50} height={1700 - y - 40} fill="#8C5A2E" stroke={INK} strokeWidth={8} />
    <rect x={-500} y={y} width={940} height={50} rx={10} fill="#D9A25A" stroke={INK} strokeWidth={9} />
    {children}
  </g>
);

/** 6 · As it tips over the edge... Kenarda devrilme. */
const S6: React.FC = () => {
  const t = useTt();
  const k = ap(t, 0.1, 1.5, (x) => x * x);
  return (
    <Kadraj zoom={[1.5, 1.7]} origin={[440, 760]}>
      <Diyagram>
        <g transform={`rotate(${k * 55} 440 760)`}>
          <Ekmek x={lerp(380, 500, ap(t, 0, 0.6))} y={732} />
        </g>
        <circle cx={440} cy={760} r={16} fill="#FF5A3A" stroke={INK} strokeWidth={6} />
        <path d="M600 640 q70 60 40 170" stroke={SARI} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={`${ap(t, 0.5, 0.6) * 220} 400`} />
        <Etiket x={470} y={980} size={64} renk="#fff" o={pop(t, 0.5)}>
          <T en="EDGE" tr="KENAR" />
        </Etiket>
      </Diyagram>
    </Kadraj>
  );
};

/** 7 · ...it starts to spin. Havada dönen ekmek, dönme oku. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1F3A5C" />
      <circle cx={540} cy={950} r={640} fill="#5FC8FF" opacity={0.2} filter="url(#s-glow)" />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M${100 + i * 100} ${((f * 40 + i * 333) % 2400) - 300} v-200`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.25} />
      ))}
      <Ekmek x={540} y={950} r={60 + t * 130} s={2.2} />
      <g transform={`translate(540 950) rotate(${t * 130}) scale(0.8)`}>
        <path d="M0 -460 a460 460 0 0 1 400 230" stroke={INK} strokeWidth={44} fill="none" strokeLinecap="round" />
        <path d="M0 -460 a460 460 0 0 1 400 230 m-90 -40 l90 40 l30 -96" stroke={SARI} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Etiket x={540} y={570} size={110} o={pop(t, 0.2)}>
        <T en="SPIN" tr="DÖNÜYOR" />
      </Etiket>
    </Kadraj>
  );
};

/** 8 · But your table is too short. Masa ve yükseklik ölçüsü. */
const S8: React.FC = () => {
  const t = useTt();
  const sh = useAt('short.');
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1200]}>
      <Diyagram y={1050}>
        <Cizgi x={120} y={1700} s={1.5} goz="acik" agiz="duz" kas="catik" bakis={[1, 0.5]} kolSag={[40, 30]} kolSol={[20, 14]} golge={false} />
        <rect x={-500} y={1050} width={940} height={50} rx={10} fill="#D9A25A" stroke={INK} strokeWidth={9} />
        <Ekmek x={330} y={1022} />
        <path d="M640 1060 V1690 M600 1060 h80 M600 1690 h80" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeDasharray={`${ap(t, 0.1, 0.5) * 900} 2000`} />
        <Etiket x={720} y={1410} size={110} anchor="start" renk="#fff" o={pop(t, 0.4)}>
          75 cm
        </Etiket>
        <g transform={`translate(640 720) scale(${pop(t, sh - 0.2)}) rotate(-5)`}>
          <Etiket x={0} y={0} size={130} renk="#FF8A7A">
            <T en="TOO SHORT" tr="ÇOK KISA" />
          </Etiket>
        </g>
      </Diyagram>
    </Kadraj>
  );
};

/** Düşüş: masa tabla y'den zemine, tur sayısı kadar döner; ardışık izler. */
const Dusus: React.FC<{ y: number; tur: number; k: number; x?: number }> = ({ y, tur, k, x = 560 }) => (
  <g>
    {[0.2, 0.4, 0.6, 0.8].map((u) =>
      u < k ? (
        <g key={u} opacity={0.3}>
          <Ekmek x={x} y={lerp(y, 1650, u * u)} r={40 + u * (tur * 360 - 40)} />
        </g>
      ) : null,
    )}
    <Ekmek x={x} y={lerp(y, 1650, k * k)} r={40 + k * (tur * 360 - 40)} />
  </g>
);

/** 9 · It only gets half a turn. 75 cm'den yarım tur. */
const S9: React.FC = () => {
  const t = useTt();
  const hf = useAt('half');
  const k = ap(t, 0.15, 1.2, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1300]}>
      <Diyagram y={1050}>
        <Dusus y={1030} tur={0.5} k={k} />
        {k >= 1 && <ellipse cx={560} cy={1688} rx={170} ry={14} fill={YAG} stroke={INK} strokeWidth={5} />}
        <g transform={`translate(760 800) scale(${pop(t, hf - 0.1)})`}>
          <Etiket x={0} y={0} size={210}>
            ½
          </Etiket>
          <Etiket x={0} y={100} size={84} renk="#fff">
            <T en="TURN" tr="TUR" />
          </Etiket>
        </g>
      </Diyagram>
    </Kadraj>
  );
};

/** 10 · From a table three meters tall... Dev masa, Çizgi merdivende. */
const S10: React.FC = () => {
  const t = useTt();
  const th = useAt('three');
  return (
    <Kadraj zoom={[1.15, 1.0]} origin={[400, 600]}>
      <Diyagram y={520} fon="#3A2F5C">
        {/* merdiven */}
        <path d="M60 1700 L150 560 M250 1700 L220 560" stroke="#C9D2E3" strokeWidth={16} strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${72 + i * 9} ${1580 - i * 120} H${247 - i * 3}`} stroke="#C9D2E3" strokeWidth={12} />
        ))}
        <Cizgi x={170} y={520} s={0.62} goz="acik" agiz="sirit" kolSag={[70, 20]} kolSol={[20, 14]} golge={false} />
        <Ekmek x={370} y={492} s={0.6} />
        <Cizgi x={760} y={1700} s={0.62} renk="#8C96AD" isik={0} golge={false} />
        <path d="M900 530 V1690 M860 530 h80 M860 1690 h80" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        <g transform={`translate(700 1040) scale(${pop(t, th - 0.1)}) rotate(-5)`}>
          <Etiket x={0} y={0} size={190}>
            3 m
          </Etiket>
        </g>
      </Diyagram>
    </Kadraj>
  );
};

/** 11 · ...it lands butter up. Tam tur, yağ üstte. */
const S11: React.FC = () => {
  const t = useTt();
  const up = useAt('up.');
  const k = ap(t, 0.05, 0.75, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[560, 1300]}>
      <Diyagram y={520} fon="#3A2F5C">
        <Dusus y={500} tur={1} k={k} />
        <Onay x={820} y={1100} s={pop(t, up - 0.05) * 1.5} />
        <g transform={`translate(640 800) scale(${pop(t, up - 0.2)}) rotate(-4)`}>
          <Etiket x={0} y={0} size={130}>
            <T en="BUTTER UP" tr="YAĞ ÜSTTE" />
          </Etiket>
        </g>
      </Diyagram>
    </Kadraj>
  );
};

/** 12 · So what is your fix? Çizgi düşünür. */
const S12: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.05, 1.18]} origin={[540, 950]}>
      <Oda masa={false} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B2033" opacity={0.3} />
      <Cizgi x={480} y={2700} s={3.0} goz="yukari" agiz="duz" kas="kalkik" kolSag={[150, 140]} kolSol={[20, 14]} />
      <g transform={`translate(540 700) scale(${pop(t, 0.2)}) rotate(-5)`}>
        <Etiket x={0} y={0} size={150}>
          <T en="YOUR FIX?" tr="ÇÖZÜMÜN?" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 13 · A giant table... */
const S13: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[400, 700]}>
      <Diyagram y={520} fon="#3A2F5C">
        <Cizgi x={170} y={1700} s={0.62} goz="acik" agiz="o" bakis={[0, -1]} bas={-14} golge={false} />
        <Ekmek x={370} y={492} s={0.6} />
        <g transform={`translate(700 1000) scale(${pop(t, 0.05)})`}>
          <Etiket x={0} y={0} size={220}>
            A
          </Etiket>
          <Etiket x={0} y={110} size={76} renk="#fff">
            <T en="GIANT TABLE" tr="DEV MASA" />
          </Etiket>
        </g>
      </Diyagram>
    </Kadraj>
  );
};

/** 14 · ...or butter on the bottom? Masada, ekmeğin altını yağlıyor (çekim 1'in mekânı). */
const S14: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.05, 1.2]} origin={[640, 1100]}>
      <Oda />
      <Cizgi x={220} y={1700} s={1.6} goz="mutlu" agiz="sirit" kas="kalkik" bakis={[1, 0.3]} kolSag={[80, 30]} kolSol={[20, 14]} />
      <Masa />
      <Ekmek x={640} y={900} r={180} s={1.2} />
      <g transform={`translate(${640 + Math.sin(f / 4) * 60} 960) rotate(-20)`}>
        <rect x={-120} y={-10} width={170} height={22} rx={10} fill="#E8EDF5" stroke={INK} strokeWidth={6} />
        <rect x={50} y={-16} width={90} height={34} rx={12} fill="#5A3A1E" stroke={INK} strokeWidth={6} />
      </g>
      <g transform={`translate(770 1260) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={220}>
          B
        </Etiket>
        <Etiket x={0} y={100} size={54} renk="#fff">
          <T en="BUTTER BELOW" tr="ALTINI YAĞLA" />
        </Etiket>
      </g>
      <Zerre n={12} color="#fff" o={0.25} />
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's21',
  words: WORDS,
  voiceLen: 24.06,
  tail: 0.4,
  reklam: true,
  kanca: { en: 'BUTTER DOWN?', tr: 'YAĞLI YÜZ MÜ?', y: 640 },
  baslik: ['TOAST FALLS', 'OFF THE TABLE'],
  vurgu: '#FFE25A',
  plan: [
    { w: 'Your', C: S1 },
    { w: 'Butter', C: S2 },
    { w: 'Again.', C: S3 },
    { w: 'It', C: S4 },
    { w: 'And', C: S5 },
    { w: 'As', C: S6 },
    { w: 'it#3', C: S7 },
    { w: 'But', C: S8 },
    { w: 'It#2', C: S9 },
    { w: 'From', C: S10 },
    { w: 'it#4', C: S11 },
    { w: 'So', C: S12 },
    { w: 'A', C: S13 },
    { w: 'or', C: S14 },
  ],
  cues: [
    ['whoosh', 'Your', 0.1, 0.14],
    ['impact', 'Butter', 0, 0.16],
    ['pop', 'Again.', 0, 0.2],
    ['buzz', 'not', 0, 0.1],
    ['buzz', 'not#2', 0, 0.1],
    ['tick', 'As', 0.2, 0.2],
    ['whoosh', 'it#3', 0, 0.14],
    ['click', 'short.', 0, 0.2],
    ['pop', 'half', 0, 0.2],
    ['riser', 'From', 0, 0.08],
    ['ding', 'up.', 0, 0.18],
    ['pop', 'A', 0, 0.2],
    ['pop', 'or', 0, 0.2],
  ],
  muzik: ['music-happy', 0.06],
  sonraki: { C: S22_ILK, words: S22_WORDS },
});

export const S21 = short.Comp;
export const S21_FRAMES = short.frames;
