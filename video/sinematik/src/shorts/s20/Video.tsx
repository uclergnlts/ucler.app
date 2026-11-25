/**
 * S-20 "Lost at sea: drink the seawater?". Dikey Short, ~22 sn + 1 sn sonraki video.
 * Kaynak: NOAA Ocean Service "Can humans drink seawater?": deniz suyu ~%3,5 tuz; insan böbreği idrarı en çok ~%2 tuza
 * kadar yoğunlaştırabilir, bu yüzden tuzu atmak için içilenden fazla su harcanır ve susuzluk artar.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, T, useAt, useTt, Zerre } from '../ortak';
import { Carpi, Etiket, Ok, rnd, SARI } from '../parca';
import { S21_ILK, S21_WORDS } from '../s21/Video';
import raw from './words.json';

const WORDS = raw as Word[];
export const S20_WORDS = WORDS;
const SU = '#2F8FC8';

/** Açık deniz: gök, güneş, ufuk, dalgalar. aksam = gün batımı tonu. */
const Deniz: React.FC<{ ufuk?: number; aksam?: boolean; gunes?: [number, number, number] }> = ({ ufuk = 900, aksam = false, gunes = [800, 480, 120] }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="d-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={aksam ? '#5A3A7A' : '#5FC8FF'} />
          <stop offset="1" stopColor={aksam ? '#FF9A5A' : '#D6F2FF'} />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={ufuk + 600} fill="url(#d-gok)" />
      <circle cx={gunes[0]} cy={gunes[1]} r={gunes[2] * 2.2} fill="#FFF2B0" opacity={0.35} filter="url(#s-glow)" />
      <circle cx={gunes[0]} cy={gunes[1]} r={gunes[2]} fill={aksam ? '#FF6A3A' : '#FFE25A'} stroke={INK} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M0 ${-gunes[2] - 30} v-${50 + (i % 2) * 30}`} stroke={aksam ? '#FF6A3A' : '#FFE25A'} strokeWidth={14} strokeLinecap="round" transform={`translate(${gunes[0]} ${gunes[1]}) rotate(${i * 30 + f / 3})`} />
      ))}
      <rect x={-500} y={ufuk} width={2100} height={2600} fill={aksam ? '#1F5E8C' : SU} />
      <path d={`M-500 ${ufuk} H1600`} stroke={INK} strokeWidth={8} />
      {Array.from({ length: 9 }, (_, i) => {
        const y = ufuk + 70 + i * i * 14 + i * 40;
        const dx = Math.sin(f / 22 + i * 1.7) * 50;
        return <path key={i} d={`M${-500 + dx} ${y} q65 ${-22 - i * 2} 130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0 t130 0`} stroke={i % 2 ? '#8FD3FF' : '#fff'} strokeWidth={7 + i} fill="none" opacity={0.5} strokeLinecap="round" />;
      })}
    </g>
  );
};

const Sal: React.FC<{ x: number; y: number; s?: number; cizik?: number }> = ({ x, y, s = 1, cizik = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={-330} y={-20 + i * 26 - 52} width={660} height={30} rx={15} fill={i % 2 ? '#B8793E' : '#C98A4A'} stroke={INK} strokeWidth={7} />
      </g>
    ))}
    <path d="M-250 -80 V70 M250 -80 V70" stroke="#E8D9B0" strokeWidth={12} strokeLinecap="round" />
    <path d="M250 -70 V-620" stroke="#8C5A2E" strokeWidth={18} strokeLinecap="round" />
    <path d="M250 -610 L60 -420 L250 -360 Z" fill="#FF5A3A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {Array.from({ length: cizik }, (_, i) => (
      <path key={i} d={`M${-200 + i * 40} -60 v50`} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
    ))}
  </g>
);

/** Bardak: d = doluluk 0..1; tuz = dipte tuz yığını. */
const Bardak: React.FC<{ x: number; y: number; s?: number; d?: number; r?: number; renk?: string; tuz?: number }> = ({ x, y, s = 1, d = 0.8, r = 0, renk = SU, tuz = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-70 -110 L-52 100 q2 12 14 12 h76 q12 0 14 -12 L70 -110 Z" fill="#EAF7FF" stroke={INK} strokeWidth={9} strokeLinejoin="round" opacity={0.95} />
    <path d={`M${-66 + (1 - d) * 16} ${lerp(104, -100, d)} L-48 100 q2 6 10 6 h76 q8 0 10 -6 L${66 - (1 - d) * 16} ${lerp(104, -100, d)} Z`} fill={renk} />
    {tuz > 0 && <path d={`M-46 104 q46 ${-90 * tuz} 92 0 Z`} fill="#fff" stroke={INK} strokeWidth={5} />}
    <path d="M-44 -80 L-34 60" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
  </g>
);

const Bobrek: React.FC<{ x: number; y: number; s?: number; ayna?: boolean; yuz?: 'calis' | 'yorgun' }> = ({ x, y, s = 1, ayna = false, yuz = 'calis' }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${ayna ? -s : s} ${s}) rotate(${Math.sin(f / 5) * 3})`}>
      <path d="M-40 -230 q170 -30 170 190 q0 250 -170 220 q-110 -20 -70 -130 q20 -70 0 -120 q-40 -130 70 -160 Z" fill="#C2504A" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
      <path d="M-10 -180 q90 0 90 130" stroke="#E88A80" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M-90 -20 q-60 40 -60 220" stroke="#F2C24A" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M-90 -20 q-60 40 -60 220" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.25} />
      <g transform={`scale(${ayna ? -1 : 1} 1) translate(${ayna ? -40 : 40} 0)`}>
        <circle cx={-26} cy={-40} r={17} fill="#fff" stroke={INK} strokeWidth={5} />
        <circle cx={26} cy={-40} r={17} fill="#fff" stroke={INK} strokeWidth={5} />
        <circle cx={-24} cy={-36} r={7} fill={INK} />
        <circle cx={28} cy={-36} r={7} fill={INK} />
        {yuz === 'yorgun' ? <path d="M-22 20 q22 -18 44 0" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" /> : <path d="M-22 10 q22 18 44 0" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />}
        {yuz === 'yorgun' && <path d="M60 -80 q14 20 0 34 q-14 -14 0 -34 Z" fill="#8FD3FF" stroke={INK} strokeWidth={4} />}
      </g>
    </g>
  );
};

const Damla: React.FC<{ x: number; y: number; s?: number; renk?: string }> = ({ x, y, s = 1, renk = '#8FD3FF' }) => (
  <path d="M0 -40 q36 46 0 72 q-36 -26 0 -72 Z" fill={renk} stroke={INK} strokeWidth={6} transform={`translate(${x} ${y}) scale(${s})`} />
);

/** Vücut içi koyu fon. */
const Ic: React.FC<{ renk?: string }> = ({ renk = '#C2504A' }) => (
  <g>
    <rect x={-500} y={-600} width={2100} height={3200} fill="#2A1830" />
    <circle cx={540} cy={950} r={720} fill={renk} opacity={0.25} filter="url(#s-glow)" />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · You are lost at sea. Sal üstünde Çizgi, elinde bir bardak deniz suyu. */
const SalSahne: React.FC<{ mod: 'ilk' | 'son' }> = ({ mod }) => {
  const t = useTt();
  const f = useCurrentFrame();
  const sal = Math.sin(f / 14) * 14;
  return (
    <Kadraj zoom={mod === 'ilk' ? [1.45, 1.1] : [1.0, 1.12]} origin={mod === 'ilk' ? [560, 1330] : [540, 1100]}>
      <Deniz ufuk={860} gunes={[820, 520, 110]} />
      <path d={`M930 ${1260 + Math.sin(f / 9) * 6} l40 -90 l40 90 Z`} fill="#3A4A6B" stroke={INK} strokeWidth={7} />
      <g transform={`translate(0 ${sal}) rotate(${Math.sin(f / 18) * 2} 540 1500)`}>
        <Cizgi x={470} y={1470} s={1.45} goz={mod === 'ilk' ? 'yari' : 'acik'} agiz={mod === 'ilk' ? 'eksi' : 'duz'} kas="kalkik" bakis={[1, 0.4]} kolSag={[84, 130]} kolSol={[20, 14]} elSag={<Bardak x={0} y={-60} s={0.62} d={0.8} />} golge={false} />
        <Sal x={540} y={1520} s={1.1} cizik={mod === 'son' ? 3 : 0} />
      </g>
      <path d={`M-500 1600 q130 ${-40 + Math.sin(f / 10) * 16} 260 0 t260 0 t260 0 t260 0 t260 0 t260 0 t260 0 V2700 H-500 Z`} fill="#1F6FA8" stroke={INK} strokeWidth={8} opacity={0.96} />
      {mod === 'son' && (
        <g transform={`translate(540 1780) scale(${pop(t, 0.1)}) rotate(-3)`}>
          <Etiket x={0} y={0} size={150}>
            <T en="DRINK IT?" tr="İÇER MİSİN?" />
          </Etiket>
        </g>
      )}
      <Zerre n={10} color="#fff" o={0.25} />
    </Kadraj>
  );
};
const S1: React.FC = () => <SalSahne mod="ilk" />;
export const S20_ILK = S1;
const S13: React.FC = () => <SalSahne mod="son" />;

/** 2 · Water everywhere. Çok uzaktan: minik sal, sonsuz su. */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.5, 1.0]} origin={[540, 1150]}>
      <Deniz ufuk={520} gunes={[540, 380, 80]} />
      <g transform={`translate(540 ${1150 + Math.sin(f / 12) * 8})`}>
        <Cizgi x={-14} y={-10} s={0.3} golge={false} kolSag={[150, 10]} kolSol={[150, 10]} agiz="o" />
        <Sal x={0} y={0} s={0.26} />
      </g>
      {[[200, 1500], [860, 900], [300, 800]].map(([x, y], i) => (
        <path key={i} d={`M${x + Math.sin(f / 30 + i) * 60} ${y} l26 -56 l26 56 Z`} fill="#3A4A6B" stroke={INK} strokeWidth={5} />
      ))}
    </Kadraj>
  );
};

/** 3 · You take a sip. Yakın plan: bardağı içer. */
const S3: React.FC = () => {
  const t = useTt();
  const k = ap(t, 0.1, 0.5);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <Deniz ufuk={1250} gunes={[860, 520, 130]} />
      <Cizgi x={480} y={2700} s={3.0} goz="kapali" agiz="o" kas="kalkik" kolSag={[lerp(84, 96, k), lerp(130, 150, k)]} kolSol={[20, 14]} elSag={<Bardak x={-10} y={-40} s={0.62} d={lerp(0.8, 0.4, ap(t, 0.4, 0.7))} r={lerp(0, -70, k)} />} golge={false} />
      {[0, 1, 2].map((i) => (
        <Damla key={i} x={640 + i * 30} y={1260 + ((t * 500 + i * 90) % 300)} s={0.5} />
      ))}
    </Kadraj>
  );
};

/** 4 · Bad idea. Yüz buruşur, çarpı. */
const S4: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.1, 1.2]} origin={[540, 1000]} shakeAt={[0.05]} shake={18}>
      <Deniz ufuk={1250} gunes={[860, 520, 130]} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3FA65A" opacity={0.18} />
      <Cizgi x={480} y={2700} s={3.0} goz="sikis" agiz="eksi" kas="catik" renk="#B8C84A" kolSag={[30, 20]} kolSol={[30, 20]} golge={false} />
      {[0, 1, 2, 3].map((i) => (
        <Damla key={i} x={620 + i * 50} y={1260 + ap(t, 0.05 + i * 0.05, 0.5) * (200 + i * 60)} s={0.6} />
      ))}
      <Carpi x={800} y={640} s={pop(t, 0.1) * 1.3} />
    </Kadraj>
  );
};

/** 5 · Seawater is over three percent salt. Dev bardak, dibinde tuz. */
const S5: React.FC = () => {
  const t = useTt();
  const th = useAt('three');
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#123A5C" />
      <circle cx={540} cy={950} r={700} fill="#5FC8FF" opacity={0.25} filter="url(#s-glow)" />
      <Bardak x={420} y={1000} s={3.4} d={0.86} tuz={ap(t, 0.3, 1.0) * 1.0} />
      {/* tuzluk */}
      <g transform="translate(760 500) rotate(140)">
        <rect x={-60} y={-110} width={120} height={200} rx={30} fill="#fff" stroke={INK} strokeWidth={9} />
        <rect x={-66} y={-150} width={132} height={56} rx={18} fill="#C9D2E3" stroke={INK} strokeWidth={9} />
      </g>
      {Array.from({ length: 18 }, (_, i) => {
        const k = (t * 1.4 + rnd(i)) % 1;
        return <rect key={i} x={640 - rnd(i + 3) * 160 - k * 80} y={640 + k * 560} width={14} height={14} fill="#fff" stroke={INK} strokeWidth={3} transform={`rotate(${k * 300} ${640} ${640 + k * 560})`} opacity={1 - k * 0.5} />;
      })}
      <g transform={`translate(760 1040) scale(${pop(t, th - 0.1)}) rotate(-6)`}>
        <Etiket x={0} y={0} size={180}>
          3.5%
        </Etiket>
        <Etiket x={0} y={110} size={84} renk="#fff">
          <T en="SALT" tr="TUZ" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 6 · Your kidneys can... Böbrekler iş başında. */
const S6: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      <Ic />
      <Bobrek x={300} y={900} s={1.35} />
      <Bobrek x={780} y={900} s={1.35} ayna />
      {Array.from({ length: 10 }, (_, i) => {
        const k = (t * 0.9 + i / 10) % 1;
        return <rect key={i} x={500 + Math.sin(i * 3) * 60} y={380 + k * 380} width={22} height={22} fill="#fff" stroke={INK} strokeWidth={4} transform={`rotate(${k * 200} 540 ${380 + k * 380})`} />;
      })}
      <g transform={`translate(540 1330) scale(${pop(t, 0.15)})`}>
        <Etiket x={0} y={0} size={104} renk="#fff">
          <T en="KIDNEYS" tr="BÖBREKLER" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 7 · ...only flush out two. Gösterge %2'de tıkanır, hedef %3,5. */
const S7: React.FC = () => {
  const t = useTt();
  const tw = useAt('two.');
  const v = ap(t, 0.05, 0.6);
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]} shakeAt={[tw]} shake={14}>
      <Ic renk="#FF5A3A" />
      {/* dikey gösterge */}
      <rect x={250} y={420} width={200} height={900} rx={40} fill="#141828" stroke={INK} strokeWidth={12} />
      <rect x={274} y={lerp(1296, 800, v)} width={152} height={lerp(0, 496, v)} rx={24} fill="#F2C24A" />
      <path d="M220 800 H480" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
      <path d="M220 470 H480" stroke="#FF5A3A" strokeWidth={12} strokeLinecap="round" strokeDasharray="26 22" />
      <Etiket x={520} y={840} size={170} anchor="start">
        2%
      </Etiket>
      <Etiket x={520} y={880 + 60} size={64} renk="#fff" anchor="start">
        <T en="MAX OUT" tr="EN FAZLA" />
      </Etiket>
      <Etiket x={520} y={510} size={110} renk="#FF8A7A" anchor="start" o={pop(t, tw + 0.15)}>
        3.5%
      </Etiket>
      <Bobrek x={800} y={1180} s={0.75} ayna yuz="yorgun" />
    </Kadraj>
  );
};

/** 8 · So for every cup you drink... Bir bardak girer. */
const S8: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#123A5C" />
      <circle cx={540} cy={950} r={700} fill="#5FC8FF" opacity={0.2} filter="url(#s-glow)" />
      <g transform={`translate(${lerp(-300, 0, ap(t, 0, 0.4))} 0)`}>
        <Bardak x={300} y={900} s={2.2} d={0.85} tuz={0.5} />
      </g>
      <Ok x={520} y={900} L={200} s={pop(t, 0.45)} />
      <Cizgi x={850} y={1380} s={1.25} goz="acik" agiz="o" kolSag={[20, 14]} kolSol={[60, 40]} golge={false} />
      <g transform={`translate(300 1300) scale(${pop(t, 0.3)})`}>
        <Etiket x={0} y={0} size={120}>
          <T en="1 CUP IN" tr="1 BARDAK" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 9 · ...your body spends more than a cup... Bir buçuk bardak çıkar. */
const S9: React.FC = () => {
  const t = useTt();
  const mo = useAt('more');
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#5C2A1A" />
      <circle cx={540} cy={950} r={700} fill="#FF9A5A" opacity={0.22} filter="url(#s-glow)" />
      <Cizgi x={230} y={1380} s={1.25} goz="yari" agiz="eksi" kas="kalkik" kolSag={[60, 40]} kolSol={[20, 14]} golge={false} />
      <Ok x={400} y={900} L={170} s={pop(t, 0.1)} renk="#FF8A4A" />
      <g transform={`scale(${pop(t, 0.25)})`} style={{ transformOrigin: '700px 900px' }}>
        <Bardak x={680} y={900} s={1.9} d={0.9} renk="#F2C24A" />
      </g>
      <g transform={`scale(${pop(t, mo)})`} style={{ transformOrigin: '930px 960px' }}>
        <Bardak x={930} y={960} s={1.4} d={0.55} renk="#F2C24A" />
      </g>
      <g transform={`translate(640 1300) scale(${pop(t, mo + 0.1)})`}>
        <Etiket x={0} y={0} size={92} renk="#FF8A4A">
          <T en="1.5 CUPS OUT" tr="1,5 BARDAK" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 10 · ...wash the salt away. Vücut deposu boşalır. */
const S10: React.FC = () => {
  const t = useTt();
  const d = lerp(0.8, 0.28, ap(t, 0.1, 1.5));
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 950]}>
      <Ic renk="#5FC8FF" />
      <rect x={290} y={420} width={500} height={860} rx={60} fill="#141828" stroke={INK} strokeWidth={14} />
      <rect x={314} y={lerp(1256, 444, d)} width={452} height={lerp(0, 812, d)} rx={40} fill={SU} />
      <path d={`M314 ${lerp(1256, 444, d)} q56 -24 113 0 t113 0 t113 0 t113 0`} stroke="#8FD3FF" strokeWidth={12} fill="none" />
      <rect x={500} y={1280} width={80} height={90} fill="#8C96AD" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 7 }, (_, i) => {
        const k = (t * 1.6 + i / 7) % 1;
        return i % 2 ? <Damla key={i} x={540 + Math.sin(i * 2) * 26} y={1400 + k * 420} s={0.8} renk="#F2C24A" /> : <rect key={i} x={530 + Math.sin(i * 2) * 30} y={1400 + k * 420} width={20} height={20} fill="#fff" stroke={INK} strokeWidth={4} />;
      })}
      <Etiket x={540} y={640} size={96} renk="#fff">
        <T en="YOUR WATER" tr="SUYUN" />
      </Etiket>
      <Ok x={880} y={600} L={300} r={90} renk="#FF5A3A" s={pop(t, 0.3)} />
    </Kadraj>
  );
};

/** 11 · You get thirstier. Çizgi kavrulur. */
const S11: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.05, 1.2]} origin={[540, 950]}>
      <Deniz ufuk={1250} gunes={[540, 520, 210]} />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#FF7A2A" opacity={0.22} />
      <Cizgi x={540} y={2700} s={3.0} goz="yari" agiz="kocaman" kas="kalkik" kolSag={[20, 14]} kolSol={[20, 14]} golge={false} />
      <path d="M520 1185 q20 110 60 110 q40 0 20 -110 Z" fill="#FF8FA8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${300 + i * 240} ${760 - ((f * 3 + i * 50) % 160)} q30 -40 0 -80 q-30 -40 0 -80`} stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />
      ))}
      <g transform={`translate(540 720) scale(${pop(t, 0.3)}) rotate(-4)`}>
        <Etiket x={0} y={0} size={130} renk="#fff">
          <T en="THIRSTIER" tr="DAHA SUSUZ" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 12 · Day three. Gün batımı, salda üç çentik. */
const S12: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1100]}>
      <Deniz ufuk={860} aksam gunes={[540, 800, 170]} />
      <g transform={`translate(0 ${Math.sin(f / 14) * 12})`}>
        <Cizgi x={470} y={1470} s={1.45} oturan goz="yari" agiz="eksi" kas="kalkik" kolSag={[20, 14]} kolSol={[20, 14]} golge={false} />
        <Sal x={540} y={1520} s={1.1} cizik={Math.min(3, Math.floor(t / 0.3) + 1)} />
      </g>
      <path d={`M-500 1600 q130 ${-40 + Math.sin(f / 10) * 16} 260 0 t260 0 t260 0 t260 0 t260 0 t260 0 t260 0 V2700 H-500 Z`} fill="#184A78" stroke={INK} strokeWidth={8} opacity={0.96} />
      <g transform={`translate(540 690) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={170}>
          <T en="DAY 3" tr="3. GÜN" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

/** 13 · No rain. Bomboş gök, boş bardak yukarıda. */
const S12b: React.FC = () => {
  const t = useTt();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 800]}>
      <Deniz ufuk={1500} gunes={[760, 620, 190]} />
      <Cizgi x={420} y={2500} s={2.6} goz="yukari" agiz="eksi" kas="kalkik" bas={-10} kolSag={[160, 10]} kolSol={[20, 14]} elSag={<Bardak x={0} y={-70} s={0.62} d={0.02} />} golge={false} />
      <g transform={`translate(300 800) scale(${pop(t, 0.2)}) rotate(-5)`}>
        <Etiket x={0} y={0} size={104} renk="#fff">
          <T en="NO RAIN" tr="YAĞMUR YOK" />
        </Etiket>
      </g>
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's20',
  words: WORDS,
  voiceLen: 21.73,
  tail: 0.45,
  baslik: ['LOST AT SEA:', 'DRINK THE OCEAN?'],
  kanca: { en: 'SAFE TO DRINK?', tr: 'İÇİLİR Mİ?', y: 700 },
  vurgu: '#7FD6FF',
  plan: [
    { w: 'You', C: S1 },
    { w: 'Water', C: S2 },
    { w: 'You#2', C: S3 },
    { w: 'Bad', C: S4 },
    { w: 'Seawater', C: S5 },
    { w: 'Your', C: S6 },
    { w: 'only', C: S7 },
    { w: 'So', C: S8 },
    { w: 'your', C: S9 },
    { w: 'wash', C: S10 },
    { w: 'You#3', C: S11 },
    { w: 'Day', C: S12 },
    { w: 'No', C: S12b },
    { w: 'Do', C: S13 },
  ],
  cues: [
    ['whoosh', 'Water', 0, 0.14],
    ['pop', 'sip.', 0, 0.2],
    ['buzz', 'Bad', 0, 0.12],
    ['tick', 'Seawater', 0.2, 0.2],
    ['ding', 'three', 0, 0.16],
    ['whoosh', 'Your', 0, 0.14],
    ['impact', 'two.', 0, 0.14],
    ['pop', 'cup', 0, 0.2],
    ['pop', 'more', 0, 0.2],
    ['whoosh', 'wash', 0, 0.14],
    ['riser', 'You#3', 0, 0.1],
    ['tick', 'Day', 0, 0.2],
    ['tick', 'three#2', 0, 0.2],
    ['pop', 'Do', 0, 0.2],
  ],
  muzik: ['music-dark', 0.07],
  sonraki: { C: S21_ILK, words: S21_WORDS },
});

export const S20 = short.Comp;
export const S20_FRAMES = short.frames;
