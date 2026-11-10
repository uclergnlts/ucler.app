/**
 * S-01 "A doctor drank bacteria" (Barry Marshall, 1984 → Nobel 2005). Dikey Short, ~19 sn.
 * Kaynak: Nobel 2005 (Marshall & Warren); Marshall 1984'te H. pylori kültürünü içti, günler içinde gastrit.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontFamily } from '../../fonts';
import { clamp, INK } from '../../kit';
import { ap, Cizgi, HEAD, Kadraj, Koni, lerp, makeShort, outBack, pop, spring, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const GREEN = '#63D86B';
const GREEN_D = '#2E9B47';

/* ---------------- nesneler ---------------- */

/** H. pylori: kıvrık gövde, kamçılar, yüz. ifade: mutlu | el | yuhu | opucuk */
const Bakteri: React.FC<{ x: number; y: number; s?: number; r?: number; ifade?: 'mutlu' | 'el' | 'yuhu' | 'opucuk' | 'uyku'; faz?: number }> = ({ x, y, s = 1, r = 0, ifade = 'mutlu', faz = 0 }) => {
  const f = useCurrentFrame() + faz;
  const w = Math.sin(f / 4) * 8;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r + Math.sin(f / 11) * 4}) scale(${s})`}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M-62 ${-6 + i * 8} q-24 ${w + i * 4} -46 ${-w} q-22 ${-w} -42 ${w * 0.7}`} stroke={GREEN_D} strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}
      <path d="M-66 0 C-50 -46 -10 -40 0 -14 C10 12 50 18 66 -18" stroke={INK} strokeWidth={56} fill="none" strokeLinecap="round" />
      <path d="M-66 0 C-50 -46 -10 -40 0 -14 C10 12 50 18 66 -18" stroke={GREEN} strokeWidth={44} fill="none" strokeLinecap="round" />
      <path d="M-58 -16 C-46 -36 -20 -34 -10 -22" stroke="#B9F5B4" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
      {/* yüz (sağ uçta) */}
      <g transform="translate(46 -8)">
        {ifade === 'uyku' ? (
          <>
            <path d="M-16 -6 h10 M6 -6 h10" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={-10} cy={-8} r={6} fill={INK} />
            <circle cx={9} cy={-8} r={6} fill={INK} />
            <circle cx={-8} cy={-10} r={2} fill="#fff" />
            <circle cx={11} cy={-10} r={2} fill="#fff" />
          </>
        )}
        {ifade === 'opucuk' ? <circle cx={4} cy={8} r={5} fill="none" stroke={INK} strokeWidth={4} /> : ifade === 'yuhu' ? <ellipse cx={0} cy={8} rx={9} ry={8} fill={INK} /> : <path d="M-10 4 q10 10 20 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />}
      </g>
      {ifade === 'el' && <path d={`M58 -40 l${10 + Math.sin(f / 3) * 8} -34`} stroke={INK} strokeWidth={14} strokeLinecap="round" />}
      {ifade === 'el' && <path d={`M58 -40 l${10 + Math.sin(f / 3) * 8} -34`} stroke={GREEN} strokeWidth={8} strokeLinecap="round" />}
    </g>
  );
};

/** Cam bardak: bulanık yeşil sıvı, içinde bakteriler. dolu: 0..1. */
const Bardak: React.FC<{ s?: number; dolu?: number; egim?: number; bakteri?: boolean; ifade?: 'el' | 'yuhu' }> = ({ s = 1, dolu = 1, egim = 0, bakteri = true, ifade = 'el' }) => {
  const f = useCurrentFrame();
  const top = 120 - 220 * dolu;
  return (
    <g transform={`rotate(${egim}) scale(${s})`}>
      <ellipse cx={0} cy={-120} rx={130} ry={60} fill="#7BFF8A" opacity={0.18} filter="url(#s-glow)" />
      <clipPath id="bardak-ic">
        <path d="M-78 -110 L-62 120 Q0 136 62 120 L78 -110 Z" />
      </clipPath>
      <g clipPath="url(#bardak-ic)">
        <rect x={-100} y={top} width={200} height={300} fill="#7FC97A" opacity={0.75} />
        <path d={`M-100 ${top} q50 ${Math.sin(f / 6) * 8} 100 0 t100 0`} fill="#A8E59F" opacity={0.8} />
        {bakteri && dolu > 0.15 && (
          <>
            <Bakteri x={-30} y={top + 70} s={0.45} r={-10} ifade={ifade} />
            <Bakteri x={34} y={top + 120} s={0.4} r={20} ifade="mutlu" faz={20} />
            <Bakteri x={-10} y={top + 170} s={0.38} r={-30} ifade={ifade === 'yuhu' ? 'yuhu' : 'mutlu'} faz={40} />
          </>
        )}
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={-60 + ((i * 41) % 120)} cy={110 - (((f * 2 + i * 37) % 200) * dolu)} r={4 + (i % 3)} fill="#E6FFE3" opacity={0.6} />
        ))}
      </g>
      <path d="M-78 -110 L-62 120 Q0 136 62 120 L78 -110" fill="none" stroke="#E8F4FF" strokeWidth={8} strokeLinejoin="round" opacity={0.95} />
      <ellipse cx={0} cy={-110} rx={78} ry={16} fill="none" stroke="#E8F4FF" strokeWidth={6} opacity={0.9} />
      <path d="M-58 -86 L-46 96" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.45} />
    </g>
  );
};

/** Gece laboratuvarı: pencere + şehir + ay, raflarda parlayan şişeler, sarkıt lamba, tezgâh. */
const Lab: React.FC<{ dx?: number }> = ({ dx = 0 }) => {
  const f = useCurrentFrame();
  const sise = ['#58E0C6', '#FF6B8B', '#FFD54A', '#7BA7FF', '#B98CFF', '#63D86B'];
  return (
    <g>
      <defs>
        <linearGradient id="lab-duvar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2440" />
          <stop offset="1" stopColor="#121829" />
        </linearGradient>
        <linearGradient id="lab-gece" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1230" />
          <stop offset="1" stopColor="#3A2D62" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={1900} height={2800} fill="url(#lab-duvar)" />
      {/* pencere */}
      <g transform={`translate(${dx * 0.3} 0)`}>
        <rect x={80} y={420} width={520} height={640} fill="url(#lab-gece)" />
        <circle cx={470} cy={540} r={46} fill="#F7F1DC" />
        <circle cx={470} cy={540} r={110} fill="#F7F1DC" opacity={0.12} filter="url(#s-glow)" />
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={100 + ((i * 97) % 480)} cy={440 + ((i * 53) % 260)} r={i % 4 ? 2 : 3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const h = 180 + ((i * 67) % 200);
          return (
            <g key={i}>
              <rect x={80 + i * 66} y={1060 - h} width={60} height={h} fill="#0B1222" />
              {Array.from({ length: 10 }, (_, j) => (
                <rect key={j} x={88 + i * 66 + (j % 2) * 26} y={1070 - h + 16 + Math.floor(j / 2) * 34} width={16} height={14} fill={(i * 3 + j) % 4 ? '#FFC65A' : '#22304E'} opacity={0.9} />
              ))}
            </g>
          );
        })}
        <rect x={80} y={420} width={520} height={640} fill="none" stroke="#2B3456" strokeWidth={22} />
        <path d="M340 420 V1060 M80 740 H600" stroke="#2B3456" strokeWidth={14} />
        <rect x={60} y={1060} width={560} height={26} fill="#2B3456" />
      </g>
      {/* raflar */}
      {[0, 1, 2].map((r) => (
        <g key={r} transform={`translate(${700 + dx * 0.5} ${420 + r * 230})`}>
          <rect x={-20} y={150} width={420} height={18} fill="#3B4466" />
          {Array.from({ length: 5 }, (_, i) => {
            const c = sise[(i + r * 2) % sise.length];
            const hh = 70 + ((i * 29 + r * 13) % 60);
            return (
              <g key={i} transform={`translate(${20 + i * 78} 150)`}>
                <ellipse cx={22} cy={-hh / 2} rx={34} ry={hh * 0.6} fill={c} opacity={0.2} filter="url(#s-soft)" />
                {i % 2 ? (
                  <path d={`M8 0 V${-hh + 30} h-6 v-14 h40 v14 h-6 V0 Z`} fill={c} opacity={0.85} stroke="#0F1426" strokeWidth={4} />
                ) : (
                  <path d={`M0 0 Q-10 ${-hh * 0.5} 14 ${-hh + 22} V${-hh} h16 v${22} Q54 ${-hh * 0.5} 44 0 Z`} fill={c} opacity={0.85} stroke="#0F1426" strokeWidth={4} />
                )}
              </g>
            );
          })}
        </g>
      ))}
      {/* lamba */}
      <path d="M560 -200 V250" stroke="#0E1324" strokeWidth={6} />
      <path d="M490 300 q70 -80 140 0 z" fill="#2E3657" />
      <circle cx={560} cy={300} r={18} fill="#FFF3C9" />
      <Koni x={560} y={300} w1={140} w2={1200} h={1500} o={0.5} />
      {/* tezgâh */}
      <rect x={-200} y={1420} width={1500} height={40} fill="#4A5478" />
      <rect x={-200} y={1460} width={1500} height={700} fill="#252C47" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={-120 + i * 300} y={1500} width={260} height={360} rx={8} fill="#2C3454" stroke="#1A2038" strokeWidth={6} />
      ))}
      {/* mikroskop ve petri */}
      <g transform={`translate(${880 + dx} 1420)`}>
        <rect x={-60} y={-20} width={140} height={20} rx={6} fill="#C9D2E3" />
        <path d="M40 -20 V-170 l-40 -60" stroke="#C9D2E3" strokeWidth={26} fill="none" strokeLinecap="round" />
        <rect x={-30} y={-280} width={34} height={90} rx={8} fill="#E8EEF7" transform="rotate(-33 -13 -235)" />
        <rect x={-30} y={-80} width={110} height={12} fill="#9AA6BE" />
      </g>
      <g transform={`translate(${160 + dx} 1408)`}>
        <ellipse cx={0} cy={0} rx={80} ry={18} fill="#BFE6FF" opacity={0.5} stroke="#E8F4FF" strokeWidth={4} />
        <ellipse cx={0} cy={-2} rx={56} ry={10} fill={GREEN} opacity={0.6} />
      </g>
      <Zerre n={36} color="#FFE2A8" y={200} h={1300} o={0.35} />
    </g>
  );
};

/** 1984 konferans salonu: ahşap panel, kara tahta (mide + ter damlası), sıra sıra doktor. */
const Doktor: React.FC<{ x: number; y: number; s?: number; tip?: number; hal?: 'basSalla' | 'kulak' | 'esne' | 'uyku' | 'duz'; faz?: number }> = ({ x, y, s = 1, tip = 0, hal = 'duz', faz = 0 }) => {
  const f = useCurrentFrame() + faz;
  const sac = ['#3A2A20', '#8C8C8C', '#C9C2B4', '#4B3A2A', '#1E1E1E'][tip % 5];
  const ten = ['#E8C3A0', '#C68E62', '#F2D3B3', '#9C6B48', '#E0B48C'][tip % 5];
  const nod = hal === 'basSalla' ? Math.sin(f / 4) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-80 0 q0 -110 80 -110 q80 0 80 110 z" fill="#EEF1F6" />
      <path d="M-10 -108 l10 40 l10 -40" fill="#34405E" />
      <path d="M-20 -110 l20 30 l20 -30" fill="none" stroke="#C7CFDC" strokeWidth={5} />
      <g transform={`translate(0 ${-150 + nod})`}>
        <circle r={48} fill={ten} />
        <path d="M-48 -6 q0 -50 48 -50 q48 0 48 50 q-20 -26 -48 -26 q-28 0 -48 26 z" fill={sac} />
        {hal === 'uyku' || hal === 'esne' ? (
          <path d="M-22 4 h12 M10 4 h12" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        ) : (
          <>
            <circle cx={-16} cy={4} r={5} fill={INK} />
            <circle cx={16} cy={4} r={5} fill={INK} />
          </>
        )}
        {hal === 'esne' ? <ellipse cx={0} cy={26} rx={12} ry={16} fill="#5A2230" /> : <path d="M-12 24 q12 6 24 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />}
        {tip % 2 === 1 && <path d="M-34 0 h24 M10 0 h24 M-10 0 h20" stroke="#1E2436" strokeWidth={4} />}
        {tip % 2 === 1 && <><circle cx={-22} cy={4} r={14} fill="none" stroke="#1E2436" strokeWidth={4} /><circle cx={22} cy={4} r={14} fill="none" stroke="#1E2436" strokeWidth={4} /></>}
      </g>
      {hal === 'kulak' && (
        <>
          <path d="M-60 -40 L-52 -150" stroke="#EEF1F6" strokeWidth={30} strokeLinecap="round" />
          <path d="M60 -40 L52 -150" stroke="#EEF1F6" strokeWidth={30} strokeLinecap="round" />
          <circle cx={-50} cy={-152} r={16} fill={ten} />
          <circle cx={50} cy={-152} r={16} fill={ten} />
        </>
      )}
      {hal === 'uyku' && (
        <text x={50} y={-220 - (f % 30)} fontFamily={fontFamily} fontWeight={800} fontSize={44} fill="#fff" opacity={1 - (f % 30) / 30}>
          z
        </text>
      )}
    </g>
  );
};

const Salon: React.FC<{ hal?: 'basSalla' | 'tepki'; tahta?: 'mide' | 'mikrop' }> = ({ hal = 'basSalla', tahta = 'mide' }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="sl-duvar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A3121" />
          <stop offset="1" stopColor="#2A1B12" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={1900} height={2800} fill="url(#sl-duvar)" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-300 + i * 150} y={200} width={8} height={1400} fill="#20140C" opacity={0.6} />
      ))}
      {/* kara tahta */}
      <rect x={110} y={430} width={860} height={560} rx={10} fill="#5B3A22" />
      <rect x={136} y={456} width={808} height={508} fill="#20352B" />
      <rect x={136} y={456} width={808} height={508} fill="#fff" opacity={0.04} />
      {tahta === 'mide' ? (
        <g stroke="#EDEBDD" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.92}>
          {/* mide */}
          <path d="M330 560 q-10 80 40 120 q80 70 170 30 q70 -40 40 -110 q-30 -60 -90 -30 q-40 20 -80 -20 q-30 -40 -80 10 z" />
          <path d="M330 560 q-10 -40 10 -70" />
          <path d="M582 600 q40 30 60 90" />
          {/* eşittir + ter damlası (stres) */}
          <path d="M680 640 h70 M680 670 h70" />
          <path d="M840 590 q-36 50 -36 76 a36 36 0 0 0 72 0 q0 -26 -36 -76 z" />
          <path d="M826 676 q10 14 26 6" />
        </g>
      ) : null}
      <text x={180} y={940} fontFamily={fontFamily} fontWeight={800} fontSize={54} fill="#EDEBDD" opacity={0.85}>
        1984
      </text>
      {/* tavan lambaları */}
      {[260, 820].map((x) => (
        <g key={x}>
          <Koni x={x} y={120} w1={60} w2={700} h={1300} o={0.35} />
          <circle cx={x} cy={120} r={16} fill="#FFE9B8" />
        </g>
      ))}
      {/* sıralar: arkadan öne */}
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {Array.from({ length: 5 - (row === 2 ? 1 : 0) }, (_, i) => {
            const sx = (row === 1 ? 70 : 0) + i * 240 + (row === 2 ? 120 : 20);
            const yy = 1260 + row * 210;
            const sc = 0.95 + row * 0.25;
            const k = row * 5 + i;
            const durum = hal === 'basSalla' ? 'basSalla' : k % 4 === 0 ? 'esne' : k % 4 === 2 ? 'uyku' : 'kulak';
            return <Doktor key={i} x={sx} y={yy} s={sc} tip={k} hal={durum as 'basSalla'} faz={k * 7} />;
          })}
          <rect x={-300} y={1260 + row * 210 - 10} width={1700} height={60} fill="#3B2617" />
        </g>
      ))}
      <rect x={-300} y={1830} width={1700} height={400} fill="#24170E" />
      <rect x={-400} y={-400} width={1900} height={2800} fill="#E8B26A" opacity={0.08 + Math.sin(f / 20) * 0.01} style={{ mixBlendMode: 'overlay' }} />
    </g>
  );
};

/** Sahne: kırmızı perde, spot ışıkları, kaide üstünde madalya. */
const Madalya: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={240} fill="#FFD54A" opacity={0.25} filter="url(#s-glow)" />
      <path d="M-60 -260 L-20 -120 M60 -260 L20 -120" stroke="#2F5BD9" strokeWidth={40} />
      <circle r={130} fill="#E9B83A" stroke="#8C6414" strokeWidth={10} />
      <circle r={102} fill="#F6D163" stroke="#C99A2A" strokeWidth={6} />
      {/* defne */}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <ellipse cx={-62} cy={54 - i * 20} rx={14} ry={7} fill="#C99A2A" transform={`rotate(${-50 + i * 12} -62 ${54 - i * 20})`} />
          <ellipse cx={62} cy={54 - i * 20} rx={14} ry={7} fill="#C99A2A" transform={`rotate(${50 - i * 12} 62 ${54 - i * 20})`} />
        </g>
      ))}
      <path d="M0 -40 l12 26 l28 4 l-20 20 l5 28 l-25 -13 l-25 13 l5 -28 l-20 -20 l28 -4 z" fill="#C99A2A" />
      <path d={`M-90 -60 q30 -40 70 -30`} stroke="#fff" strokeWidth={12} fill="none" opacity={0.5 + 0.3 * Math.sin(f / 6)} strokeLinecap="round" />
    </g>
  );
};

const Sahne: React.FC<{ perde?: number }> = ({ perde = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#140A12" />
      {/* spotlar */}
      {[-120, 540, 1200].map((x, i) => (
        <polygon key={i} points={`${x - 30},-100 ${x + 30},-100 ${540 + (i - 1) * 140 + 260},1500 ${540 + (i - 1) * 140 - 260},1500`} fill="url(#s-cone)" opacity={0.55} />
      ))}
      {/* perdeler */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${540 + side * lerp(80, 620, perde)} 0)`}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={side < 0 ? -700 + i * 110 : -60 + i * 110} y={-200} width={110} height={1900} fill={i % 2 ? '#8E1626' : '#B3213A'} />
          ))}
        </g>
      ))}
      <path d="M-300 -100 Q540 260 1380 -100 V-300 H-300 Z" fill="#7A1020" />
      {/* zemin */}
      <ellipse cx={540} cy={1560} rx={700} ry={110} fill="#3A2230" />
      <rect x={-300} y={1560} width={1700} height={700} fill="#22121C" />
      <ellipse cx={540} cy={1500} rx={360} ry={70} fill="url(#s-spot)" opacity={0.6} />
      {/* izleyici siluetleri */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`translate(${-20 + i * 140} ${1830 + (i % 2) * 30 + Math.sin(f / 5 + i) * 4})`}>
          <circle r={56} fill="#07040A" />
          <rect x={-80} y={40} width={160} height={200} rx={60} fill="#07040A" />
        </g>
      ))}
      {/* konfeti */}
      {Array.from({ length: 50 }, (_, i) => {
        const cx = (i * 97) % 1080;
        const cy = ((f * (4 + (i % 4)) + i * 131) % 1900) - 100;
        const c = ['#FFD54A', '#FF6B8B', '#7BA7FF', '#63D86B', '#fff'][i % 5];
        return <rect key={i} x={cx + Math.sin(f / 7 + i) * 20} y={cy} width={14} height={22} fill={c} transform={`rotate(${(f * 6 + i * 40) % 360} ${cx} ${cy})`} opacity={0.9} />;
      })}
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/** 1 · A doctor drank a cup of bacteria. (aynı kompozisyon son karede tekrar: loop) */
const S1: React.FC = () => {
  const t = useTt();
  const lift = ap(t, 0.0, 0.7);
  return (
    <Kadraj zoom={[1.0, 1.12]} origin={[560, 900]}>
      <Lab />
      <Cizgi x={560} y={1430} s={1.25} onluk goz="yari" agiz="sirit" kas="kalkik" bakis={[1, -0.5]} kolSol={[10, 20]} kolSag={[lerp(40, 100, lift), lerp(30, 70, lift)]} elSag={<g transform="translate(0 -90)"><Bardak s={0.85} /></g>} />
      <g transform="translate(-60 1660)" filter="url(#s-blur)" opacity={0.85}>
        <path d="M0 0 Q-30 -160 40 -230 V-300 h50 v70 Q160 -160 130 0 Z" fill="#58E0C6" opacity={0.7} />
      </g>
    </Kadraj>
  );
};

/** 2 · On purpose. Yakın çekim, göz kırpma; bardak ön planda bulanık. */
const S2: React.FC = () => {
  const t = useTt();
  const wink = t > 0.35 && t < 0.9;
  return (
    <Kadraj zoom={[1.0, 1.05]} origin={[540, 760]}>
      <g transform="translate(-540 -760) scale(2)">
        <Lab dx={-60} />
      </g>
      <Cizgi x={560} y={2050} s={2.4} onluk goz={wink ? 'goz-kirp' : 'acik'} agiz="sirit" kas="kalkik" kolSol={[8, 10]} kolSag={[10, 10]} />
      <g transform="translate(910 1220) rotate(10)" filter="url(#s-blur)">
        <Bardak s={1.6} />
      </g>
    </Kadraj>
  );
};

/** 3 · In 1984, every doctor knew ulcers came from stress. */
const S3: React.FC = () => {
  const t = useTt();
  const st = pop(t, 0.05, 0.35);
  return (
    <Kadraj zoom={[1.18, 1.0]} origin={[540, 900]} pan={[[0, 40], [0, 0]]}>
      <Salon hal="basSalla" />
      <g transform={`translate(540 1130) scale(${st}) rotate(-6)`} opacity={st}>
        <rect x={-210} y={-90} width={420} height={150} rx={18} fill="none" stroke="#FFD54A" strokeWidth={12} />
        <text x={0} y={36} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={120} fill="#FFD54A">
          1984
        </text>
      </g>
    </Kadraj>
  );
};

/** 4 · Barry Marshall said, no, it's a germ. Projeksiyon: mikroskop görüntüsü. */
const S4: React.FC = () => {
  const t = useTt();
  const no = useAt('no,');
  const germ = useAt('germ.');
  const lens = pop(t, germ - 0.25, 0.4);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <Salon hal="basSalla" />
      {/* projeksiyon dairesi tahtanın üstünde */}
      <g transform={`translate(560 700) scale(${0.2 + 0.8 * lens})`} opacity={lens}>
        <circle r={330} fill="#0A1A12" stroke="#E8EEF7" strokeWidth={14} />
        <circle r={330} fill="#3B8F4A" opacity={0.25} />
        <Bakteri x={-90} y={-60} s={1.3} r={-20} ifade="el" />
        <Bakteri x={110} y={90} s={1.0} r={30} ifade="mutlu" faz={15} />
        <Bakteri x={-60} y={160} s={0.8} r={10} ifade="mutlu" faz={30} />
      </g>
      <polygon points="540,1900 420,1050 700,1050" fill="#E8F4FF" opacity={0.08} />
      {/* kürsü ve Çizgi */}
      <Cizgi x={800} y={1500} s={1.05} onluk goz={t > no ? 'acik' : 'acik'} agiz={t > no - 0.1 && t < no + 0.4 ? 'acik' : 'gulus'} kas="catik" kolSag={[t > no ? 120 : 30, t > no ? -20 : 20]} kolSol={[10, 20]} bakis={[-1, -0.4]} />
      <path d="M650 1520 h300 l-30 -230 h-240 z" fill="#5B3A22" stroke="#2A1B12" strokeWidth={8} />
      <ellipse cx={800} cy={1295} rx={60} ry={10} fill="#2A1B12" />
    </Kadraj>
  );
};

/** 5 · Nobody listened. Doktorlar kulak tıkıyor, esniyor, uyuyor. */
const S5: React.FC = () => (
  <Kadraj zoom={[1.12, 1.2]} origin={[540, 1450]}>
    <Salon hal="tepki" />
  </Kadraj>
);

/** 6 · So he drank it. Bardak dikilir; bakteriler kaydıraktan iner gibi kayar. */
const S6: React.FC = () => {
  const t = useTt();
  const tilt = ap(t, 0.0, 0.8);
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[540, 860]} shakeAt={[0.7]} shake={10}>
      <g transform="translate(-540 -500) scale(2)">
        <Lab dx={40} />
      </g>
      <Cizgi x={420} y={2150} s={2.6} onluk goz="kapali" agiz="o" bas={-14} kolSol={[10, 10]} kolSag={[lerp(40, 60, tilt), lerp(120, 165, tilt)]} egim={-4} elSag={<g transform={`translate(0 -60) rotate(${lerp(-20, -105, tilt)})`}><Bardak s={0.7} dolu={1 - tilt * 0.85} ifade="yuhu" /></g>} />
    </Kadraj>
  );
};

/** 7 · Days later, his stomach was inflamed, just like he said. */
const S7: React.FC = () => {
  const t = useTt();
  const inflamed = useAt('inflamed,');
  const said = useAt('said#2');
  const glow = ap(t, inflamed - 0.2, 0.4) * (0.75 + 0.25 * Math.sin(t * 14));
  const proud = t > said - 0.15;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1050]}>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#1A1630" />
      <g transform="translate(0 -60)">
        <Lab dx={-30} />
      </g>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#000" opacity={0.25} />
      {/* uçan takvim yaprakları */}
      {Array.from({ length: 7 }, (_, i) => {
        const tt = t * 1.6 - i * 0.22;
        if (tt < 0 || tt > 1.4) return null;
        const xx = lerp(260 + i * 70, 1200, tt / 1.4);
        const yy = 760 - Math.sin(tt * 2) * 160 + i * 20;
        return (
          <g key={i} transform={`translate(${xx} ${yy}) rotate(${tt * 260})`}>
            <rect x={-80} y={-95} width={160} height={190} rx={10} fill="#F6F1E3" stroke={INK} strokeWidth={5} />
            <rect x={-80} y={-95} width={160} height={46} rx={10} fill="#D93036" />
            <text x={0} y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={86} fill={INK}>
              {12 + i}
            </text>
          </g>
        );
      })}
      <Cizgi x={540} y={1980} s={2.0} onluk goz={proud ? 'yari' : 'sikis'} agiz={proud ? 'sirit' : 'eksi'} kas={proud ? 'kalkik' : 'uzgun'} egim={proud ? 0 : 6} kolSol={[25, -95]} kolSag={proud ? [150, 20] : [25, -95]} elSag={proud ? <g transform="rotate(-10)"><rect x={-14} y={-56} width={26} height={50} rx={12} fill={HEAD} /></g> : undefined} />
      <g transform="translate(540 1420)" style={{ mixBlendMode: 'screen' }}>
        <ellipse rx={120} ry={100} fill="#FF2A2A" opacity={glow * 0.85} filter="url(#s-glow)" />
        <ellipse rx={60} ry={50} fill="#FF6A4A" opacity={glow * 0.6} filter="url(#s-soft)" />
      </g>
      <g transform={`translate(${450} ${560 + ((t * 120) % 120)})`} opacity={proud ? 0 : 1}>
        <path d="M0 -40 q-24 34 -24 52 a24 24 0 0 0 48 0 q0 -18 -24 -52 z" fill="#8FD3FF" stroke={INK} strokeWidth={5} />
      </g>
    </Kadraj>
  );
};

/** 8 · 21 years later — sayaç 1984 → 2005, perde açılıyor. */
const S8: React.FC = () => {
  const t = useTt();
  const u = ap(t, 0.0, 1.0);
  const yil = Math.round(lerp(1984, 2005, u));
  return (
    <Kadraj zoom={[1.15, 1.0]} origin={[540, 900]}>
      <Sahne perde={ap(t, 0.5, 0.9)} />
      <g transform={`translate(540 860) scale(${1 + spring(t, 1.0) * 0.06})`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={230} fill="#FFD54A" stroke={INK} strokeWidth={10} paintOrder="stroke">
          {yil}
        </text>
      </g>
    </Kadraj>
  );
};

/** 9 · that germ won him a Nobel Prize. Spot, madalya, bakteri madalyayı öpüyor. */
const S9: React.FC = () => {
  const t = useTt();
  const nobel = useAt('Nobel');
  const m = pop(t, 0.1, 0.5);
  const kiss = t > nobel;
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <Sahne perde={1} />
      <rect x={410} y={1300} width={260} height={260} fill="#2C1A26" stroke="#0E070C" strokeWidth={8} />
      <g transform={`translate(0 ${-40 * m})`} opacity={m}>
        <Madalya x={540} y={1040} s={1.15} />
      </g>
      <g transform={`translate(${lerp(760, 640, ap(t, nobel - 0.3, 0.3))} ${lerp(1000, 960, ap(t, nobel - 0.3, 0.3))})`}>
        <Bakteri x={0} y={0} s={0.9} r={-20} ifade={kiss ? 'opucuk' : 'el'} />
        {kiss && <text x={-70} y={-70} fontFamily={fontFamily} fontWeight={800} fontSize={60} fill="#FF6B8B" opacity={interpolate(t - nobel, [0, 0.4], [0, 1], clamp)}>♥</text>}
      </g>
      <Cizgi x={240} y={1560} s={0.9} onluk goz="mutlu" agiz="kocaman" kolSol={[150, 10]} kolSag={[150, 10]} />
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's01',
  words: WORDS,
  voiceLen: 18.46,
  tail: 0.55,
  baslik: ['A DOCTOR DRANK', 'BACTERIA'],
  vurgu: '#63D86B',
  plan: [
    { w: 'A', C: S1 },
    { w: 'On', C: S2 },
    { w: 'In', C: S3 },
    { w: 'Barry', C: S4 },
    { w: 'Nobody', C: S5 },
    { w: 'So', C: S6 },
    { w: 'Days', C: S7 },
    { w: '21', C: S8 },
    { w: 'that', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['pop', 'bacteria.', 0, 0.25],
    ['click', 'On', 0.3, 0.3],
    ['impact', 'In', 0.05, 0.25],
    ['whoosh', 'Barry', -0.1, 0.25],
    ['pop', 'germ.', -0.1, 0.35],
    ['buzz', 'Nobody', 0, 0.15],
    ['chomp', 'drank#2', 0.2, 0.35],
    ['rewind', 'Days', -0.1, 0.3],
    ['tick', '21', 0, 0.3],
    ['riser', '21', 0.2, 0.25],
    ['ding', 'Nobel', 0, 0.35],
    ['coins', 'Prize.', 0.1, 0.25],
  ],
  muzik: ['music-happy', 0.08],
});

export const S01 = short.Comp;
export const S01_FRAMES = short.frames;
