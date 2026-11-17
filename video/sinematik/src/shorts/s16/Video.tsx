/**
 * S-16 "Fold a paper 42 times". Dikey Short, ~24 sn.
 * Hesap: 0,1 mm kâğıt; 2^10 ≈ 10 cm, 2^23 ≈ 839 m (yaklaşık 1 km), 2^30 ≈ 107 km, 2^42 × 0,1 mm ≈ 439.800 km.
 * Ay'ın ortalama uzaklığı 384.400 km. Katlama rekoru 12 kat (Britney Gallivan, 2002).
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { ap, Cizgi, Kadraj, lerp, makeShort, pop, Sayi, T, useAt, useTt, Zerre } from '../ortak';
import raw from './words.json';

const WORDS = raw as Word[];
const SARI = '#FFD54A';
const KAGIT = '#FBF6E6';

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

const rnd = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

const Yildizlar: React.FC<{ n?: number; o?: number }> = ({ n = 70, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={rnd(i) * 1500 - 200} cy={rnd(i + 99) * 2400 - 300} r={2 + rnd(i + 7) * 4} fill="#fff" opacity={0.4 + Math.abs(Math.sin(f / 14 + i)) * 0.6} />
      ))}
    </g>
  );
};

/** Ay. yuz: şaşkın yüz çizilir. */
const Ay: React.FC<{ x: number; y: number; r?: number; yuz?: boolean }> = ({ x, y, r = 150, yuz = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2} fill="#FFF3C8" opacity={0.22} filter="url(#s-glow)" />
    <circle r={r} fill="#F4EBCB" stroke={INK} strokeWidth={r > 100 ? 8 : 5} />
    <circle cx={-r * 0.4} cy={-r * 0.3} r={r * 0.2} fill="#D9CDA6" />
    <circle cx={r * 0.35} cy={r * 0.45} r={r * 0.26} fill="#D9CDA6" />
    <circle cx={r * 0.5} cy={-r * 0.45} r={r * 0.12} fill="#D9CDA6" />
    {yuz && (
      <g>
        <ellipse cx={-r * 0.28} cy={-r * 0.05} rx={r * 0.13} ry={r * 0.18} fill="#fff" stroke={INK} strokeWidth={5} />
        <ellipse cx={r * 0.22} cy={-r * 0.05} rx={r * 0.13} ry={r * 0.18} fill="#fff" stroke={INK} strokeWidth={5} />
        <circle cx={-r * 0.24} cy={-r * 0.1} r={r * 0.05} fill={INK} />
        <circle cx={r * 0.26} cy={-r * 0.1} r={r * 0.05} fill={INK} />
        <ellipse cx={0} cy={r * 0.38} rx={r * 0.1} ry={r * 0.14} fill={INK} />
      </g>
    )}
  </g>
);

/** Kâğıt kulesi: (x, y1) tabandan (x2, y2) tepeye; w1/w2 genişlik. Katman çizgileri var. */
const Kule: React.FC<{ x: number; y1: number; x2?: number; y2: number; w1?: number; w2?: number }> = ({ x, y1, x2, y2, w1 = 120, w2 = 120 }) => {
  const f = useCurrentFrame();
  const tx = x2 ?? x;
  const n = Math.min(60, Math.max(4, Math.round(Math.abs(y1 - y2) / 26)));
  return (
    <g>
      <polygon points={`${x - w1 / 2},${y1} ${x + w1 / 2},${y1} ${tx + w2 / 2},${y2} ${tx - w2 / 2},${y2}`} fill={KAGIT} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {Array.from({ length: n }, (_, i) => {
        const k = (i + 0.5) / n;
        const cx = lerp(x, tx, k);
        const w = lerp(w1, w2, k);
        return <path key={i} d={`M${cx - w / 2} ${lerp(y1, y2, k)} h${w}`} stroke="#C9BE9A" strokeWidth={Math.max(1.5, w / 40)} />;
      })}
      <polygon points={`${x + w1 / 2},${y1} ${tx + w2 / 2},${y2} ${tx + w2 * 0.2},${y2} ${x + w1 * 0.2},${y1}`} fill="#D9CDA6" opacity={0.5} />
      <path d={`M${x - w1 * 0.3} ${y1} L${tx - w2 * 0.3} ${y2}`} stroke="#fff" strokeWidth={Math.max(2, w1 / 20)} opacity={0.5 + Math.sin(f / 9) * 0.2} />
    </g>
  );
};

/** Çalışma odası: duvar, pencere (gece, ay), raf, masa, lamba. */
const Oda: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M${-300 + i * 150} -600 V1500`} stroke="#33284F" strokeWidth={8} />
    ))}
    {/* pencere */}
    <rect x={430} y={300} width={600} height={900} rx={20} fill="#0E1226" stroke="#C99A5A" strokeWidth={26} />
    <g>
      <rect x={443} y={313} width={574} height={874} fill="#141A3A" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={460 + rnd(i) * 540} cy={330 + rnd(i + 30) * 620} r={2 + rnd(i + 3) * 3} fill="#fff" opacity={0.7} />
      ))}
      <Ay x={760} y={520} r={96} />
      {/* uzak şehir */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={446 + i * 72} y={1187 - 90 - ((i * 67) % 150)} width={64} height={260} fill="#0B0E1C" />
      ))}
    </g>
    <path d="M730 300 V1200 M430 760 H1030" stroke="#C99A5A" strokeWidth={14} />
    <rect x={400} y={1190} width={660} height={36} rx={10} fill="#D9B26A" stroke={INK} strokeWidth={7} />
    {/* perde */}
    <path d="M400 270 q40 480 -30 960 h110 q30 -480 20 -960 Z" fill="#8A3B4A" stroke={INK} strokeWidth={7} />
    <path d="M380 270 H1080" stroke="#6B4A2A" strokeWidth={18} strokeLinecap="round" />
    {/* raf ve kitaplar */}
    <rect x={-100} y={560} width={430} height={24} fill="#6B4A2A" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 7 }, (_, i) => (
      <rect key={i} x={-60 + i * 50} y={560 - 130 - ((i * 37) % 50)} width={42} height={130 + ((i * 37) % 50)} fill={['#C2607C', '#5FC8FF', '#FFD54A', '#3FCB6B', '#FF8A4A', '#8A82A6', '#D9423A'][i]} stroke={INK} strokeWidth={5} />
    ))}
    {/* zemin */}
    <rect x={-500} y={1500} width={2100} height={1100} fill="#2A2140" />
    <rect x={-500} y={1500} width={2100} height={22} fill="#59487A" />
    {children}
  </g>
);

const Masa: React.FC<{ y?: number }> = ({ y = 1280 }) => (
  <g>
    <rect x={-200} y={y} width={1100} height={50} rx={10} fill="#A8743E" stroke={INK} strokeWidth={9} />
    <rect x={-120} y={y + 50} width={40} height={400} fill="#6B4A2A" stroke={INK} strokeWidth={7} />
    <rect x={780} y={y + 50} width={40} height={400} fill="#6B4A2A" stroke={INK} strokeWidth={7} />
    {/* masa lambası */}
    <path d={`M60 ${y} v-40 l80 -180 l-90 -70`} stroke={INK} strokeWidth={16} fill="none" strokeLinejoin="round" />
    <path d={`M10 ${y - 330} l110 30 l-50 90 l-110 -50 Z`} fill="#3FCB6B" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <polygon points={`10,${y - 250} 70,${y - 215} 360,${y} -160,${y}`} fill="#FFF3C8" opacity={0.2} />
    <rect x={20} y={y - 20} width={90} height={22} rx={8} fill="#1B1F33" />
    {/* kâğıt destesi ve kalem */}
    <rect x={600} y={y - 34} width={190} height={34} fill={KAGIT} stroke={INK} strokeWidth={6} />
    <path d={`M610 ${y - 22} h170 M610 ${y - 11} h170`} stroke="#C9BE9A" strokeWidth={3} />
  </g>
);

/* ---------------- çekimler ---------------- */

/** 1 · Fold a piece of paper 42 times and it reaches the Moon. (loop karesi) */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[620, 900]}>
      <Oda>
        <Masa />
        {/* kâğıt kulesi masadan pencere içindeki Ay'a uzanır */}
        <Kule x={420} y1={1280} x2={752} y2={560} w1={150} w2={8} />
        <circle cx={752} cy={556} r={30 + Math.sin(f / 5) * 8} fill="#fff" opacity={0.8} filter="url(#s-glow)" />
        <Cizgi x={150} y={1560} s={1.25} goz="sok" agiz="o" kas="kalkik" bakis={[1, -1]} kolSag={[70, 50]} kolSol={[40, 60]} />
      </Oda>
      <Zerre n={18} color="#FFF3C8" o={0.3} />
    </Kadraj>
  );
};

/** 2 · Each fold doubles the thickness. Katman sayısı 1, 2, 4, 8. */
const S2: React.FC = () => {
  const t = useTt();
  const adim = Math.min(3, Math.floor(t / 0.62));
  const kat = [1, 2, 4, 8][adim];
  const w = [760, 520, 360, 250][adim];
  const u = pop(t, adim * 0.62, 0.3);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 950]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#2A2140" />
      <circle cx={540} cy={950} r={600} fill="#8A6AD9" opacity={0.2} filter="url(#s-glow)" />
      <rect x={-500} y={1180} width={2100} height={60} fill="#A8743E" stroke={INK} strokeWidth={9} />
      <rect x={-500} y={1240} width={2100} height={1400} fill="#6B4A2A" />
      {/* katlanmış kâğıt kesiti */}
      <g transform={`translate(540 1180) scale(${0.85 + u * 0.15} ${0.7 + u * 0.3})`}>
        {Array.from({ length: kat }, (_, i) => (
          <rect key={i} x={-w / 2} y={-(i + 1) * 30} width={w} height={26} rx={6} fill={KAGIT} stroke={INK} strokeWidth={6} />
        ))}
        {kat > 1 && <path d={`M${-w / 2} -4 q-36 ${-kat * 15} 0 ${-kat * 30 + 8}`} stroke={INK} strokeWidth={6} fill="none" />}
      </g>
      {/* ölçü parantezi */}
      <path d={`M${540 + w / 2 + 50} 1176 v${-kat * 30}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      <g transform={`translate(540 860) scale(${u})`}>
        <Etiket x={0} y={0} size={260}>×{kat}</Etiket>
      </g>
      <g opacity={0.9}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${240 + i * 200} 520)`} opacity={i <= adim ? 1 : 0.25}>
            <circle r={62} fill={i <= adim ? '#8A6AD9' : '#3A2F5C'} stroke={INK} strokeWidth={8} />
            <Etiket x={0} y={26} size={72} renk="#fff">{i}</Etiket>
          </g>
        ))}
      </g>
    </Kadraj>
  );
};

/** 3 · Ten folds, as thick as your hand. El genişliğinde blok. */
const S3: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <Oda>
        <Masa y={1300} />
      </Oda>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B1430" opacity={0.45} />
      <Kule x={400} y1={1300} y2={lerp(1300, 900, pop(t, 0.1, 0.5))} w1={230} w2={230} />
      {/* açık el (yandan), blokla aynı boyda */}
      <g transform={`translate(720 1300) rotate(${Math.sin(f / 10) * 2})`}>
        <path d="M-70 0 V-250 q0 -40 40 -40 h60 q40 0 40 40 V0 Z" fill="#1B2033" stroke={INK} strokeWidth={9} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-66 + i * 35} y={-400 + (i === 0 || i === 3 ? 30 : 0)} width={30} height={150} rx={15} fill="#1B2033" stroke={INK} strokeWidth={7} />
        ))}
        <rect x={64} y={-250} width={30} height={120} rx={15} fill="#1B2033" stroke={INK} strokeWidth={7} transform="rotate(30 64 -150)" />
        <rect x={-80} y={0} width={160} height={300} fill="#F2C21A" stroke={INK} strokeWidth={9} />
      </g>
      <path d="M250 900 V1300 M226 900 h48 M226 1300 h48" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={ap(t, 0.5, 0.3)} />
      <g transform={`translate(540 690) scale(${pop(t, 0.5)})`}>
        <Etiket x={0} y={0} size={170}>10 cm</Etiket>
      </g>
      <g transform={`translate(190 520) scale(${pop(t, 0.05)})`}>
        <circle r={96} fill="#8A6AD9" stroke={INK} strokeWidth={9} />
        <Etiket x={0} y={36} size={100} renk="#fff">10</Etiket>
      </g>
    </Kadraj>
  );
};

/** 4 · Twenty-three folds, one kilometer. Kule şehrin üstüne çıkar. */
const S4: React.FC = () => {
  const t = useTt();
  const km = useAt('one');
  const u = ap(t, 0, 1.2);
  return (
    <Kadraj zoom={[1.0, 1.0]} pan={[[0, -200], [0, 120]]} origin={[540, 960]}>
      <defs>
        <linearGradient id="k-aks" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2456" />
          <stop offset="0.6" stopColor="#8A5A9A" />
          <stop offset="1" stopColor="#FFB86B" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-900} width={2100} height={3600} fill="url(#k-aks)" />
      <Yildizlar n={30} o={0.6} />
      {/* bulutlar */}
      {[[200, 620], [820, 480], [640, 820]].map(([x, y], i) => (
        <g key={i} opacity={0.8}>
          <ellipse cx={x} cy={y} rx={190} ry={50} fill="#F4D9E0" />
          <ellipse cx={x + 60} cy={y - 34} rx={110} ry={46} fill="#F4D9E0" />
        </g>
      ))}
      {/* şehir */}
      {Array.from({ length: 13 }, (_, i) => {
        const h = 180 + ((i * 137) % 330);
        return (
          <g key={i}>
            <rect x={-80 + i * 96} y={1600 - h} width={86} height={h + 900} fill={i % 2 ? '#2A2550' : '#35306A'} stroke={INK} strokeWidth={5} />
            {Array.from({ length: 6 }, (_, j) => (
              <rect key={j} x={-66 + i * 96 + (j % 2) * 36} y={1600 - h + 24 + Math.floor(j / 2) * 60} width={20} height={30} fill="#FFC65A" opacity={(i + j) % 3 ? 0.8 : 0.15} />
            ))}
          </g>
        );
      })}
      <rect x={-500} y={1600} width={2100} height={900} fill="#1B1840" />
      <Kule x={540} y1={1600} y2={lerp(1500, 240, u)} w1={70} w2={60} />
      <g opacity={ap(t, km - 0.3, 0.3)}>
        <path d="M660 250 V1590" stroke="#fff" strokeWidth={8} strokeDasharray="24 16" />
        <g transform={`translate(700 900) scale(${pop(t, km - 0.1)})`}>
          <Etiket x={0} y={0} size={130} anchor="start">1 km</Etiket>
        </g>
      </g>
      <g transform={`translate(220 760) scale(${pop(t, 0.05)})`}>
        <circle r={96} fill="#8A6AD9" stroke={INK} strokeWidth={9} />
        <Etiket x={0} y={36} size={100} renk="#fff">23</Etiket>
      </g>
    </Kadraj>
  );
};

/** 5 · Thirty folds, you are in space. Kule atmosferi deler, uydu geçer. */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sp = useAt('space.');
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 1000]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#060818" />
      <Yildizlar />
      {/* Dünya yayı ve atmosfer */}
      <circle cx={540} cy={3300} r={2060} fill="#5FC8FF" opacity={0.25} filter="url(#s-glow)" />
      <circle cx={540} cy={3300} r={2000} fill="#8FD3FF" opacity={0.5} />
      <circle cx={540} cy={3300} r={1960} fill="#2F6FB0" stroke={INK} strokeWidth={8} />
      <path d="M100 1420 q200 -90 380 -20 q120 60 60 160 q-200 60 -440 -40 Z" fill="#3FA86B" opacity={0.9} />
      <path d="M700 1400 q160 -60 300 20 q-40 110 -220 100 Z" fill="#3FA86B" opacity={0.9} />
      {[[260, 1380], [820, 1500], [560, 1450]].map(([x, y], i) => (
        <ellipse key={i} cx={x + Math.sin(f / 40 + i) * 14} cy={y} rx={150} ry={26} fill="#fff" opacity={0.7} />
      ))}
      <Kule x={540} y1={1360} y2={lerp(1300, 380, ap(t, 0, 1.0))} w1={36} w2={30} />
      {/* uydu */}
      <g transform={`translate(${lerp(-150, 1250, ap(t, 0.1, 2.6, (x) => x))} ${700 + Math.sin(f / 12) * 14}) rotate(-14)`}>
        <rect x={-34} y={-26} width={68} height={52} rx={8} fill="#C9D2E3" stroke={INK} strokeWidth={7} />
        <rect x={-150} y={-20} width={104} height={40} fill="#2F6FB0" stroke={INK} strokeWidth={6} />
        <rect x={46} y={-20} width={104} height={40} fill="#2F6FB0" stroke={INK} strokeWidth={6} />
        <path d="M-98 -20 v40 M98 -20 v40 M0 -26 v-34" stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={-64} r={10} fill="#FF5A3A" opacity={f % 20 < 10 ? 1 : 0.3} />
      </g>
      <g transform={`translate(800 1000) scale(${pop(t, 0.7)})`}>
        <Etiket x={0} y={0} size={120}>107 km</Etiket>
      </g>
      <g transform={`translate(300 620) scale(${pop(t, sp - 0.1)}) rotate(-6)`}>
        <Etiket x={0} y={0} size={130} renk="#fff">
          <T en="SPACE" tr="UZAY" />
        </Etiket>
      </g>
      <g transform={`translate(220 960) scale(${pop(t, 0.05)})`}>
        <circle r={96} fill="#8A6AD9" stroke={INK} strokeWidth={9} />
        <Etiket x={0} y={36} size={100} renk="#fff">30</Etiket>
      </g>
    </Kadraj>
  );
};

/** 6 · Forty-two, past the Moon. Kule Ay'ı geçer, Ay şaşkın. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const pa = useAt('past');
  const u = ap(t, 0.1, pa + 0.5, (x) => x);
  return (
    <Kadraj zoom={[1.0, 1.08]} origin={[540, 900]}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#060818" />
      <Yildizlar />
      {/* küçük Dünya */}
      <g transform="translate(300 1380)">
        <circle r={150} fill="#5FC8FF" opacity={0.3} filter="url(#s-glow)" />
        <circle r={110} fill="#2F6FB0" stroke={INK} strokeWidth={8} />
        <path d="M-70 -30 q40 -50 90 -20 q20 40 -20 60 q-50 10 -70 -40 Z M10 40 q40 -10 60 20 q-30 30 -60 -20 Z" fill="#3FA86B" />
      </g>
      <Kule x={330} y1={1280} x2={lerp(330, 760, u)} y2={lerp(1280, 330, u)} w1={26} w2={20} />
      <g transform={`translate(${760 + lerp(0, 0, u)} 330)`} opacity={u > 0.98 ? 1 : 0}>
        <circle r={26 + Math.sin(f / 4) * 6} fill="#fff" filter="url(#s-glow)" />
      </g>
      <Ay x={800 + Math.sin(f / 15) * 6} y={640} r={170} yuz={u > 0.6} />
      {/* mesafe */}
      <g transform={`translate(540 1010) scale(${pop(t, pa)})`}>
        <Etiket x={0} y={0} size={120}>
          <Sayi n={440000} /> km
        </Etiket>
      </g>
      <g transform={`translate(190 560) scale(${pop(t, 0.05)})`}>
        <circle r={104} fill="#8A6AD9" stroke={INK} strokeWidth={9} />
        <Etiket x={0} y={38} size={108} renk="#fff">42</Etiket>
      </g>
    </Kadraj>
  );
};

/** 7 · One problem. Çizgi yakın çekim, parmak havada. */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.0, 1.1]} origin={[540, 1000]}>
      <Oda />
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B1430" opacity={0.5} />
      <Cizgi x={460} y={2200} s={2.3} goz="yari" agiz="duz" kas="kalkik" bakis={[1, 0]} kolSag={[150, 150]} kolSol={[14, 10]} />
      <g transform={`translate(830 640) scale(${pop(t, 0.1)}) rotate(${Math.sin(f / 7) * 6})`}>
        <Etiket x={0} y={0} size={420} renk="#FF5A3A">!</Etiket>
      </g>
    </Kadraj>
  );
};

/** 8 · Nobody has ever folded paper more than twelve times. Çizgi bükemiyor. */
const S8: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const tw = useAt('twelve');
  const zor = Math.sin(f / 1.5) * 4;
  return (
    <Kadraj zoom={[1.05, 1.15]} origin={[520, 1050]} shakeAt={[tw]} shake={10}>
      <Oda>
        <Masa />
        <Cizgi x={330 + zor * 0.5} y={1560} s={1.3} goz="sikis" agiz="eksi" kas="catik" egim={6} kolSag={[60, 100]} kolSol={[50, 70]} />
        {/* bükülmeyen kalın tomar */}
        <g transform={`translate(${560 + zor} 1130) rotate(${-6 + zor * 0.6})`}>
          <rect x={-60} y={-110} width={120} height={220} rx={18} fill={KAGIT} stroke={INK} strokeWidth={9} />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M-52 ${-96 + i * 17} h104`} stroke="#C9BE9A" strokeWidth={4} />
          ))}
        </g>
        {/* ter damlaları */}
        {[0, 1, 2].map((i) => {
          const k = (t * 1.6 + i * 0.33) % 1;
          return <path key={i} d="M0 -16 q14 20 0 30 q-14 -10 0 -30 Z" fill="#8FD3FF" stroke={INK} strokeWidth={4} transform={`translate(${250 + i * 70 - k * 40} ${880 + k * 120})`} opacity={1 - k} />;
        })}
        {/* yerdeki buruşuk denemeler */}
        {[[700, 1540], [820, 1580], [60, 1590]].map(([x, y], i) => (
          <path key={i} d={`M${x - 40} ${y} l14 -40 l30 12 l26 -22 l16 44 l-30 22 l-40 4 Z`} fill={KAGIT} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        ))}
      </Oda>
      <g transform={`translate(810 760) scale(${pop(t, tw - 0.05)})`}>
        <circle r={150} fill="#FF4A3A" stroke={INK} strokeWidth={12} />
        <Etiket x={0} y={30} size={170} renk="#fff">12</Etiket>
        <Etiket x={0} y={104} size={50} renk="#fff">MAX</Etiket>
      </g>
    </Kadraj>
  );
};

const short = makeShort({
  kod: 's16',
  words: WORDS,
  voiceLen: 23.5,
  tail: 0.7,
  baslik: ['FOLD PAPER', '42 TIMES'],
  vurgu: '#B79CFF',
  plan: [
    { w: 'Fold', C: S1 },
    { w: 'Each', C: S2 },
    { w: 'Ten', C: S3 },
    { w: 'Twenty-three', C: S4 },
    { w: 'Thirty', C: S5 },
    { w: 'Forty-two', C: S6 },
    { w: 'One', C: S7 },
    { w: 'Nobody', C: S8 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['riser', 'reaches', -0.3, 0.14],
    ['tick', 'Each', 0, 0.2],
    ['tick', 'fold', 0.3, 0.2],
    ['tick', 'doubles', 0.4, 0.2],
    ['pop', 'Ten', 0.5, 0.22],
    ['whoosh', 'Twenty-three', 0, 0.18],
    ['whoosh', 'Thirty', 0, 0.18],
    ['ding', 'space.', 0, 0.16],
    ['riser', 'Forty-two', 0, 0.14],
    ['pop', 'past', 0.4, 0.22],
    ['buzz', 'One', 0, 0.1],
    ['impact', 'twelve', 0, 0.2],
  ],
  muzik: ['music-happy', 0.06],
});

export const S16 = short.Comp;
export const S16_FRAMES = short.frames;
