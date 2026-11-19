/**
 * S-14 "Your elevator cable snaps" — Gece Defteri tasarımıyla yeniden çizim (Üçler, 19 Kasım 2026).
 * Ses ve kelime zamanları S-14 ile aynıdır. Fark: kanal paleti (gece laciverti, krem çizgi ve tarama,
 * tek renk sarı Çizgi, pembe yalnızca cevap/çelişki), ve açılış: ilk karede halat zaten kopuyor.
 * Kaynak: modern asansörlerde 4-8 çelik halat bulunur, her biri kabini tek başına taşır.
 * Hız regülatörü aşırı hızda güvenlik frenini tetikler. Elisha Otis, 1854 New York Crystal Palace gösterisi.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { ap, Cizgi, fontBaslik, GD, GeceDefs, Kadraj, lerp, makeShort, pop, useAt, useTt, Zerre } from '../ortak';
import raw from '../s14/words.json';

const WORDS = raw as Word[];
const T = GD.teb;
const CELIK = '#C9CFDC';

/* ---------------- yardımcılar ---------------- */

/** Gece kadrajı: tema zemini, krem kenar ışığı, desenler. */
const GK: React.FC<React.ComponentProps<typeof Kadraj>> = ({ children, ...p }) => (
  <Kadraj bg={GD.gece} rim={T} vignette={0.8} {...p}>
    <GeceDefs />
    {children}
  </Kadraj>
);

const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, renk = T, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontBaslik} fontWeight={700} fontSize={size} fill={renk} stroke={GD.siyah} strokeWidth={size / 12} paintOrder="stroke" letterSpacing={-size * 0.02}>
    {children}
  </text>
);

/** El çizimi pembe ok (cevabı gösterir). from -> to, u: çizilme oranı. */
const Ok: React.FC<{ x1: number; y1: number; x2: number; y2: number; u: number; renk?: string }> = ({ x1, y1, x2, y2, u, renk = GD.pembe }) => {
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.25;
  const my = (y1 + y2) / 2 - (x2 - x1) * 0.25;
  const L = 900;
  const a = Math.atan2(y2 - my, x2 - mx);
  return (
    <g opacity={u > 0 ? 1 : 0}>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={renk} strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - u)} />
      {u > 0.9 && (
        <path
          d={`M${x2 - Math.cos(a - 0.5) * 46} ${y2 - Math.sin(a - 0.5) * 46} L${x2} ${y2} L${x2 - Math.cos(a + 0.5) * 46} ${y2 - Math.sin(a + 0.5) * 46}`}
          stroke={renk}
          strokeWidth={11}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

/** Pembe onay işareti (cevap). */
const Onay: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 104 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={r * 1.5} fill={GD.pembe} opacity={0.25} filter="url(#s-glow)" />
    <circle r={r} fill={GD.pembe} stroke={GD.siyah} strokeWidth={8} />
    <path d={`M${-r * 0.46} ${r * 0.04} l${r * 0.33} ${r * 0.33} l${r * 0.62} ${-r * 0.71}`} stroke={T} strokeWidth={r * 0.22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Örgülü çelik halat (dikey), krem çizgi. */
const Halat: React.FC<{ x: number; y1: number; y2: number; w?: number; renk?: string }> = ({ x, y1, y2, w = 16, renk = CELIK }) => (
  <g>
    <path d={`M${x} ${y1} V${y2}`} stroke={GD.siyah} strokeWidth={w + 8} strokeLinecap="round" />
    <path d={`M${x} ${y1} V${y2}`} stroke={renk} strokeWidth={w} strokeLinecap="round" />
    <path d={`M${x} ${y1} V${y2}`} stroke={GD.gece3} strokeWidth={w} strokeDasharray="4 12" opacity={0.9} />
  </g>
);

/** Asansör boşluğu: lacivert beton, krem taramalı gölgeler, kılavuz raylar, servis lambaları. */
const Bosluk: React.FC<{ kay?: number; ray?: [number, number] }> = ({ kay = 0, ray = [150, 930] }) => {
  const f = useCurrentFrame();
  const k = ((kay % 260) + 260) % 260;
  return (
    <g>
      <defs>
        <linearGradient id="g-bos" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A101E" />
          <stop offset="0.5" stopColor={GD.gece2} />
          <stop offset="1" stopColor="#0A101E" />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#g-bos)" />
      {/* duvarın iki yanı krem taramalı gölge */}
      <rect x={-500} y={-600} width={720} height={3200} fill="url(#g-tarama)" opacity={0.07} />
      <rect x={860} y={-600} width={740} height={3200} fill="url(#g-tarama)" opacity={0.07} />
      <g transform={`translate(0 ${k})`}>
        {Array.from({ length: 13 }, (_, i) => {
          const y = -700 + i * 260;
          return (
            <g key={i}>
              <path d={`M-500 ${y} H1600`} stroke={T} strokeWidth={2} opacity={0.14} />
              <rect x={ray[0] - 70} y={y + 60} width={120} height={26} fill={GD.gece3} stroke={T} strokeWidth={3} strokeOpacity={0.6} />
              <rect x={ray[1] - 50} y={y + 60} width={120} height={26} fill={GD.gece3} stroke={T} strokeWidth={3} strokeOpacity={0.6} />
              {i % 2 === 0 && (
                <g>
                  <rect x={ray[0] - 110} y={y + 150} width={44} height={60} rx={8} fill="#0A101E" stroke={T} strokeWidth={3} strokeOpacity={0.6} />
                  <circle cx={ray[0] - 88} cy={y + 180} r={12} fill={T} opacity={0.75 + Math.sin(f / 5 + i) * 0.2} />
                  <circle cx={ray[0] - 88} cy={y + 180} r={80} fill={T} opacity={0.12} filter="url(#s-glow)" />
                </g>
              )}
            </g>
          );
        })}
      </g>
      {ray.map((x) => (
        <g key={x}>
          <rect x={x - 14} y={-600} width={28} height={3200} fill={GD.gece3} stroke={T} strokeWidth={3} strokeOpacity={0.7} />
          <rect x={x - 3} y={-600} width={6} height={3200} fill={T} opacity={0.45} />
        </g>
      ))}
      <path d="M1010 -600 V2600" stroke="#0A101E" strokeWidth={18} />
      <path d="M1010 -600 V2600" stroke={T} strokeWidth={2} opacity={0.25} />
      <path d="M1040 -600 V2600" stroke={GD.gece3} strokeWidth={10} />
    </g>
  );
};

/** Kabin kesiti: koyu çelik, krem çizgiler, sıcak tavan ışığı (tek ışık kaynağı). (x, y) = taban ortası. */
const Kabin: React.FC<{ x: number; y: number; s?: number; isik?: number; kat?: string; children?: React.ReactNode }> = ({ x, y, s = 1, isik = 1, kat = '12', children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-350} y={-800} width={700} height={44} rx={8} fill={GD.gece3} stroke={T} strokeWidth={5} />
    <rect x={-60} y={-840} width={120} height={50} rx={10} fill={GD.gece2} stroke={T} strokeWidth={5} />
    {[-1, 1].map((d) => (
      <g key={d}>
        <rect x={d * 350 - 30} y={-790} width={60} height={70} rx={8} fill={GD.gece2} stroke={T} strokeWidth={4} />
        <rect x={d * 350 - 30} y={-80} width={60} height={70} rx={8} fill={GD.gece2} stroke={T} strokeWidth={4} />
      </g>
    ))}
    <rect x={-330} y={-760} width={660} height={770} rx={16} fill={GD.gece2} stroke={T} strokeWidth={6} />
    {/* iç duvar: sıcak krem, ışık sönünce kararır */}
    <rect x={-300} y={-730} width={600} height={710} fill="#E8DCC2" />
    <rect x={-300} y={-730} width={600} height={710} fill="url(#g-tarama-sik)" opacity={0.0} />
    <rect x={-300} y={-730} width={600} height={710} fill="#C9B994" opacity={0.35} />
    <rect x={-300} y={-730} width={600} height={710} fill="#070A12" opacity={0.78 * (1 - isik)} />
    {[-150, 0, 150].map((px) => (
      <path key={px} d={`M${px} -730 V-20`} stroke="#A8957020" strokeWidth={0} />
    ))}
    {[-150, 0, 150].map((px) => (
      <path key={'p' + px} d={`M${px} -730 V-20`} stroke="#9C8A68" strokeWidth={3} opacity={0.7} />
    ))}
    {/* ayna: krem tarama */}
    <rect x={-270} y={-560} width={230} height={300} rx={8} fill={GD.gece3} opacity={0.55} stroke="#8E7F63" strokeWidth={5} />
    <rect x={-270} y={-560} width={230} height={300} rx={8} fill="url(#g-tarama)" opacity={0.35} />
    <path d="M-290 -230 H290" stroke="#8E97B0" strokeWidth={12} strokeLinecap="round" />
    <rect x={-200} y={-730} width={400} height={24} rx={10} fill="#FFF6DE" opacity={0.3 + isik * 0.7} />
    <polygon points="-200,-706 200,-706 300,-20 -300,-20" fill="#FFF6DE" opacity={0.2 * isik} />
    <rect x={130} y={-690} width={140} height={74} rx={10} fill={GD.siyah} stroke={T} strokeWidth={4} />
    <text x={200} y={-634} textAnchor="middle" fontFamily={fontBaslik} fontWeight={700} fontSize={54} fill={T}>
      {kat}
    </text>
    <rect x={190} y={-560} width={84} height={280} rx={10} fill={GD.gece3} stroke={T} strokeWidth={4} />
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={i} cx={214 + (i % 2) * 36} cy={-524 + Math.floor(i / 2) * 58} r={12} fill={i === 3 ? T : GD.gece} stroke={T} strokeWidth={2} strokeOpacity={0.5} />
    ))}
    <rect x={-300} y={-40} width={600} height={24} fill="#5A4E3E" />
    {/* kabin dışı gölgesi: krem tarama */}
    <rect x={-330} y={10} width={660} height={60} fill="url(#g-tarama)" opacity={0.25} />
    {children}
  </g>
);

const Kahve: React.FC<{ buhar?: boolean }> = ({ buhar = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M-26 -58 h52 l-8 70 h-36 Z" fill={T} stroke={GD.siyah} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-30} y={-66} width={60} height={14} rx={6} fill="#6B4A2E" stroke={GD.siyah} strokeWidth={5} />
      <rect x={-22} y={-36} width={44} height={22} fill="#B48A62" />
      {buhar && [0, 1].map((i) => <path key={i} d={`M${-10 + i * 20} -76 q${10 + Math.sin(f / 6 + i) * 8} -20 0 -40 q-10 -20 0 -40`} stroke={T} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />)}
    </g>
  );
};

/** Kıvılcım: krem/sıcak beyaz ışık patlaması. */
const Kivilcim: React.FC<{ x: number; y: number; n?: number; r?: number; o?: number }> = ({ x, y, n = 9, r = 90, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r * 1.1} fill="#FFF1C9" opacity={0.4} filter="url(#s-glow)" />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + f * 0.7;
        const l = r * (0.5 + ((i * 37 + f * 13) % 50) / 60);
        return <path key={i} d={`M${x + Math.cos(a) * 14} ${y + Math.sin(a) * 14} L${x + Math.cos(a) * l} ${y + Math.sin(a) * l}`} stroke={i % 2 ? '#FFFFFF' : '#FFE7A8'} strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ---------------- çekimler ---------------- */

/**
 * 1 · Your elevator cable snaps. İLK KARE = KOPMA ANI: halat kopmuş, uç savruluyor, kıvılcım, ışık titriyor,
 * Çizgi şokta. Yakın plan; kabin ve halat kadrajın büyük kısmı. (Döngü karesi.)
 */
const S1: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const u = ap(t, 0, 1.6);
  const flick = Math.sin(f * 2.3) > 0.1 ? 0.3 : 1;
  const sav = Math.sin(f / 2.2) * 34 * (1 - u * 0.5);
  return (
    <GK zoom={[1.12, 1.2]} origin={[540, 900]} pan={[[0, 190], [0, 170]]} shakeAt={[0, 0.85]} shake={22}>
      <Bosluk kay={-t * 40} />
      {/* üst halat parçası: zaten kopmuş, yukarı savrulur */}
      <g transform={`translate(${sav} ${-120 - u * 380})`}>
        <Halat x={540} y1={-700} y2={520} w={22} />
        {[-1, 0, 1].map((i) => (
          <path key={i} d={`M540 520 q${i * 30} 34 ${i * 48} ${66 + Math.abs(i) * 12}`} stroke={CELIK} strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* alt parça kabin çatısına devrilir */}
      <g transform={`translate(540 640) rotate(${30 + u * 50})`}>
        <Halat x={0} y1={-70} y2={0} w={22} />
        {[-1, 0, 1].map((i) => (
          <path key={i} d={`M0 -70 q${i * 26} -26 ${i * 40} -56`} stroke={CELIK} strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <Kivilcim x={540} y={520} r={190 - u * 40} n={14} o={1 - ap(t, 1.2, 0.6) * 0.7} />
      <Kabin x={540} y={1440} isik={flick}>
        <Cizgi
          x={-40}
          y={-36}
          s={1.12}
          goz="sok"
          agiz="o"
          kas="kalkik"
          bakis={[0, -1]}
          kolSag={[70, 60]}
          kolSol={[60, 30]}
          elSag={<Kahve />}
          renk={GD.sari}
          golge={false}
        />
      </Kabin>
      <Zerre n={22} color="#FFF1C9" o={0.4} />
    </GK>
  );
};

/** 2 · You do not fall. Kabin yerinde, kahve dökülmedi. Cevap = pembe onay + pembe ok. */
const S2: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <GK zoom={[1.25, 1.34]} origin={[540, 1150]}>
      <Bosluk />
      <Kabin x={540} y={1440} isik={1}>
        <Cizgi x={-40} y={-36} s={1.12} goz={t < 0.5 ? 'sikis' : 'acik'} agiz={t < 0.5 ? 'eksi' : 'sirit'} kas="kalkik" bakis={[1, 1]} kolSag={[70, 60]} kolSol={[30, 20]} elSag={<Kahve />} renk={GD.sari} golge={false} />
      </Kabin>
      <g transform={`rotate(${Math.sin(f / 9) * 3} 810 760)`}>
        <Onay x={810} y={760} s={pop(t, 0.45)} />
      </g>
      <Ok x1={780} y1={900} x2={640} y2={1060} u={ap(t, 0.6, 0.35)} />
    </GK>
  );
};

/** 3 · First, there is not one cable. Tek halat, pembe çizgiyle üstü çizilir (çelişki). */
const S3: React.FC = () => {
  const t = useTt();
  const no = useAt('not#2');
  return (
    <GK zoom={[1.0, 1.08]} origin={[540, 800]}>
      <Bosluk kay={t * 30} />
      <Kabin x={540} y={1900} s={0.9} />
      <Halat x={540} y1={-700} y2={1160} w={30} />
      <circle cx={540} cy={760} r={300} fill={T} opacity={0.08} filter="url(#s-glow)" />
      <g transform={`translate(300 640) scale(${pop(t, 0.1)})`}>
        <Etiket x={0} y={0} size={260}>1</Etiket>
      </g>
      <g opacity={ap(t, no, 0.15)}>
        <path d={`M150 420 L${lerp(150, 470, ap(t, no, 0.2))} ${lerp(420, 720, ap(t, no, 0.2))}`} stroke={GD.siyah} strokeWidth={46} strokeLinecap="round" />
        <path d={`M150 420 L${lerp(150, 470, ap(t, no, 0.2))} ${lerp(420, 720, ap(t, no, 0.2))}`} stroke={GD.pembe} strokeWidth={28} strokeLinecap="round" />
      </g>
    </GK>
  );
};

/** 4 · There are up to eight. Makine dairesi kasnağından sekiz halat sırayla iner. */
const S4: React.FC = () => {
  const t = useTt();
  const e8 = useAt('eight,');
  return (
    <GK zoom={[1.0, 1.1]} origin={[540, 850]}>
      <Bosluk kay={t * 30} />
      <g transform="translate(540 450)">
        <rect x={-380} y={-70} width={760} height={110} rx={16} fill={GD.gece3} stroke={T} strokeWidth={5} />
        <rect x={-380} y={-70} width={760} height={110} rx={16} fill="url(#g-tarama)" opacity={0.18} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-316 + i * 84} y={-40} width={44} height={86} rx={8} fill={GD.gece} stroke={T} strokeWidth={3} />
        ))}
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = ap(t, 0.1 + i * 0.09, 0.25);
        return (
          <g key={i} opacity={a}>
            <Halat x={246 + i * 84} y1={490} y2={lerp(490, 1250, a)} w={22} renk={i % 2 ? T : CELIK} />
          </g>
        );
      })}
      <Kabin x={540} y={2080} s={1.0} />
      <g transform={`translate(540 960) scale(${pop(t, e8 - 0.05)})`}>
        <circle r={190} fill={GD.siyah} opacity={0.8} />
        <circle r={190} fill="none" stroke={T} strokeWidth={4} strokeDasharray="10 12" opacity={0.6} />
        <Etiket x={0} y={100} size={300}>8</Etiket>
      </g>
    </GK>
  );
};

/** 5 · each one can hold the whole car. Yedisi kopuk, kalan tek halat kabini taşır (cevap: pembe). */
const S5: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const sal = Math.sin(f / 10) * 5;
  return (
    <GK zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Bosluk />
      <g transform={`rotate(${sal * 0.25} 540 -400)`}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = 372 + i * 48;
          if (i === 3) return <Halat key={i} x={x} y1={-700} y2={636} w={18} renk={GD.pembe} />;
          const boy = 60 + ((i * 53) % 150);
          return (
            <g key={i}>
              <Halat x={x} y1={-700} y2={boy + Math.sin(f / 5 + i) * 6} w={14} />
              <path d={`M${x} 640 q${(i - 4) * 16} ${-80} ${(i - 4) * 34 + Math.sin(f / 6 + i) * 8} ${-150 + (i % 3) * 30}`} stroke={CELIK} strokeWidth={10} fill="none" strokeLinecap="round" opacity={ap(t, 0, 0.2) * 0.7} />
            </g>
          );
        })}
        <circle cx={516} cy={420} r={150} fill={GD.pembe} opacity={0.18} filter="url(#s-glow)" />
        <Kabin x={540} y={1440} s={0.98}>
          <Cizgi x={-40} y={-36} s={1.12} goz="mutlu" agiz="gulus" bakis={[0, -1]} kolSag={[70, 60]} kolSol={[150, 30]} elSag={<Kahve />} renk={GD.sari} golge={false} />
        </Kabin>
      </g>
      <g transform={`translate(810 520) scale(${pop(t, 0.5)})`}>
        <Etiket x={0} y={0} size={140} renk={GD.pembe}>1 = OK</Etiket>
      </g>
      <Ok x1={760} y1={560} x2={580} y2={460} u={ap(t, 0.8, 0.35)} />
    </GK>
  );
};

/** 6 · Second, if the car moves too fast. Hız regülatörü çarkı hızlanır, ağırlıklar açılır. */
const S6: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const fast = useAt('fast,');
  const hiz = lerp(3, 26, ap(t, 0.6, fast - 0.4, (x) => x * x));
  const aci = f * hiz;
  const ac = ap(t, fast - 0.5, 0.5);
  return (
    <GK zoom={[1.0, 1.1]} origin={[540, 880]} shakeAt={[fast]} shake={12}>
      <Bosluk kay={-t * t * 520} />
      <Halat x={330} y1={-700} y2={2600} w={12} />
      <Halat x={750} y1={-700} y2={2600} w={12} />
      <circle cx={540} cy={880} r={420} fill={T} opacity={0.05 + ac * 0.1} filter="url(#s-glow)" />
      <g transform="translate(540 880)">
        <circle r={236} fill={GD.gece3} stroke={T} strokeWidth={8} />
        <circle r={206} fill={GD.gece} />
        <circle r={206} fill="url(#g-tarama)" opacity={0.15} />
        <g transform={`rotate(${aci})`}>
          {[0, 60, 120].map((a) => (
            <path key={a} d="M-200 0 H200" stroke={CELIK} strokeWidth={18} transform={`rotate(${a})`} />
          ))}
          {[0, 180].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d={`M0 0 L${90 + ac * 70} ${-40}`} stroke={GD.siyah} strokeWidth={18} strokeLinecap="round" />
              <circle cx={90 + ac * 70} cy={-40} r={44} fill={GD.buz} stroke={GD.siyah} strokeWidth={8} />
            </g>
          ))}
        </g>
        <circle r={40} fill={T} stroke={GD.siyah} strokeWidth={8} />
      </g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${90 + i * 128} ${1700 - ((f * (14 + hiz) + i * 210) % 1500)} v-${60 + hiz * 6}`} stroke={T} strokeWidth={6} strokeLinecap="round" opacity={0.1 + ac * 0.3} />
      ))}
      <g transform={`translate(540 1290) scale(${pop(t, fast - 0.1)})`}>
        <path d="M-70 60 L0 -70 L70 60 Z" fill={GD.gece} stroke={T} strokeWidth={9} strokeLinejoin="round" />
        <path d="M0 -26 V18 M0 38 v4" stroke={T} strokeWidth={15} strokeLinecap="round" />
      </g>
    </GK>
  );
};

/** 7 · steel brakes bite the rails. Fren çeneleri rayı sıkar, kıvılcım, kabin durur (cevap: pembe STOP). */
const S7: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const bite = useAt('bite');
  const u = ap(t, bite - 0.12, 0.14);
  const dur = ap(t, bite, 0.5);
  const kay = (1 - dur) * f * 30 + dur * 400;
  return (
    <GK zoom={[1.0, 1.1]} origin={[540, 900]} shakeAt={[bite]} shake={30}>
      <Bosluk kay={-kay} ray={[540, 1300]} />
      <rect x={-300} y={420} width={640} height={1500} rx={20} fill={GD.gece2} stroke={T} strokeWidth={6} />
      <rect x={-300} y={470} width={590} height={1400} fill="url(#g-tarama)" opacity={0.12} />
      <rect x={300} y={700} width={480} height={420} rx={26} fill={GD.gece3} stroke={T} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={340 + (i % 2) * 400} cy={740 + Math.floor(i / 2) * 340} r={14} fill={GD.gece} stroke={T} strokeWidth={3} />
      ))}
      {[-1, 1].map((d) => {
        const x = 540 + d * lerp(150, 40, u);
        return (
          <g key={d}>
            <path d={`M${x} 760 L${x + d * 120} 800 V1020 L${x} 1060 Z`} fill={u > 0.9 ? '#FFE7A8' : CELIK} stroke={GD.siyah} strokeWidth={8} strokeLinejoin="round" />
            {Array.from({ length: 6 }, (_, i) => (
              <path key={i} d={`M${x} ${790 + i * 46} l${-d * 16} 23 l${d * 16} 23`} fill={GD.siyah} />
            ))}
          </g>
        );
      })}
      {u > 0.9 && (
        <g>
          <Kivilcim x={500} y={800} r={170 * (1 - dur * 0.6)} n={12} o={1 - dur * 0.7} />
          <Kivilcim x={580} y={1020} r={190 * (1 - dur * 0.6)} n={12} o={1 - dur * 0.7} />
        </g>
      )}
      <g transform={`translate(790 540) scale(${pop(t, bite + 0.35)})`}>
        <Etiket x={0} y={0} size={140} renk={GD.pembe}>STOP</Etiket>
      </g>
    </GK>
  );
};

/** Fuar salonu, gece: cam kubbe krem çizgilerle, kalabalık siluetleri, tavandan tek ışık konisi. */
const Salon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="g-sal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GD.gece3} />
          <stop offset="1" stopColor={GD.gece} />
        </linearGradient>
      </defs>
      <rect x={-500} y={-600} width={2100} height={3200} fill="url(#g-sal)" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M540 -500 Q${-300 + i * 210} 200 ${-400 + i * 235} 900`} stroke={T} strokeWidth={4} fill="none" opacity={0.35} />
      ))}
      {[100, 380, 660].map((y) => (
        <path key={y} d={`M-400 ${y + 240} Q540 ${y - 260} 1480 ${y + 240}`} stroke={T} strokeWidth={4} fill="none" opacity={0.3} />
      ))}
      <polygon points="440,-300 640,-300 1090,1600 -10,1600" fill="#FFF1C9" opacity={0.1} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <path d={`M${-200 + i * 260} 1300 V980 q110 -130 220 0 V1300 Z`} fill={GD.gece} stroke={T} strokeWidth={3} strokeOpacity={0.4} />
          <path d={`M${-200 + i * 260} 1300 V980 q110 -130 220 0 V1300 Z`} fill="url(#g-tarama)" opacity={0.12} />
          <rect x={-218 + i * 260} y={960} width={36} height={360} fill={GD.gece2} stroke={T} strokeWidth={2} strokeOpacity={0.4} />
        </g>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${-60 + i * 190} 880 l60 ${70 + Math.sin(f / 7 + i) * 8} l60 -70 Z`} fill={i % 2 ? GD.buz : T} opacity={0.75} stroke={GD.siyah} strokeWidth={4} />
      ))}
      <path d="M-200 880 H1300" stroke={T} strokeWidth={3} opacity={0.5} />
      <rect x={-500} y={1300} width={2100} height={1300} fill="#0A101E" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = -60 + i * 78 + ((i * 29) % 20);
        const y = 1500 + ((i * 47) % 90) + Math.sin(f / 8 + i) * 5;
        const c = i % 3 === 0 ? '#060912' : '#0B1120';
        return (
          <g key={i}>
            <rect x={x - 52} y={y} width={104} height={700} rx={40} fill={c} />
            <circle cx={x} cy={y - 30} r={42} fill={c} />
            {i % 2 === 0 ? <path d={`M${x - 34} ${y - 60} v-70 h68 v70 M${x - 56} ${y - 60} h112`} stroke={c} strokeWidth={14} fill={c} /> : <path d={`M${x - 50} ${y - 52} q50 -60 100 0`} fill={c} />}
            <path d={`M${x - 52} ${y + 40} q52 -30 104 0`} stroke={T} strokeWidth={2} fill="none" opacity={0.25} />
          </g>
        );
      })}
    </g>
  );
};

const Platform: React.FC<{ y: number; children?: React.ReactNode }> = ({ y, children }) => (
  <g>
    {[250, 830].map((x) => (
      <g key={x}>
        <rect x={x - 16} y={-600} width={32} height={2100} fill={GD.gece2} stroke={T} strokeWidth={4} />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${x - 16} ${-560 + i * 84} l${x < 500 ? 18 : -18} 22 l${x < 500 ? -18 : 18} 22`} fill={T} opacity={0.5} />
        ))}
      </g>
    ))}
    <g transform={`translate(0 ${y})`}>
      <rect x={236} y={0} width={608} height={44} rx={8} fill={GD.gece3} stroke={T} strokeWidth={5} />
      {[330, 440, 550, 660, 770].map((x) => (
        <path key={x} d={`M${x} 4 V40`} stroke={T} strokeWidth={3} opacity={0.5} />
      ))}
      <rect x={640} y={-150} width={150} height={150} fill={GD.gece2} stroke={T} strokeWidth={5} />
      <path d="M640 -150 L790 0 M790 -150 L640 0" stroke={T} strokeWidth={4} opacity={0.6} />
      <rect x={670} y={-250} width={100} height={100} fill={GD.gece2} stroke={T} strokeWidth={5} />
      <rect x={670} y={-250} width={100} height={100} fill="url(#g-tarama)" opacity={0.3} />
      <g transform="translate(330 0)">
        <path d="M-50 -130 q-16 65 0 130 h100 q16 -65 0 -130 Z" fill={GD.gece2} stroke={T} strokeWidth={5} />
        <path d="M-56 -92 h112 M-56 -40 h112" stroke={T} strokeWidth={4} opacity={0.6} />
      </g>
      {children}
    </g>
  </g>
);

/** 8 · Invented in 1854. Fuar salonu, yükselen platform. */
const S8: React.FC = () => {
  const t = useTt();
  const yil = useAt('1854.');
  const y = lerp(1500, 1080, ap(t, 0, 1.6, (x) => x));
  return (
    <GK zoom={[1.0, 1.06]} origin={[540, 900]}>
      <Salon />
      <Halat x={540} y1={-700} y2={y - 520} w={18} renk={T} />
      <path d={`M540 ${y - 520} L300 ${y} M540 ${y - 520} L780 ${y}`} stroke={T} strokeWidth={7} />
      <Platform y={y}>
        <Cizgi x={520} y={0} s={0.9} goz="mutlu" agiz="sirit" kolSag={[150, 20]} kolSol={[30, 20]} renk={GD.sari} golge={false} />
      </Platform>
      <g transform={`translate(540 1400) scale(${pop(t, yil - 0.1)})`}>
        <Etiket x={0} y={0} size={200}>1854</Etiket>
      </g>
      <Zerre n={26} color="#FFF1C9" o={0.3} />
    </GK>
  );
};

/** 9 · The inventor cut his own rope. On stage. Çizgi baltayla halatı keser, platform kıpırdamaz (cevap: pembe). */
const S9: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  const cut = useAt('cut');
  const st = useAt('stage.');
  const k = t > cut + 0.12;
  const sal = ap(t, cut - 0.25, 0.3);
  const dus = k ? Math.min(14, (t - cut - 0.12) * 120) * Math.exp(-(t - cut - 0.12) * 5) * 3 : 0;
  const y = 1120 + dus;
  return (
    <GK zoom={[1.05, 1.15]} origin={[540, 950]} shakeAt={[cut + 0.12]} shake={22}>
      <Salon />
      <g transform={`translate(${k ? Math.sin(f / 3) * 40 : 0} ${k ? -ap(t, cut + 0.12, 0.5) * 300 : 0})`}>
        <Halat x={540} y1={-700} y2={560} w={18} renk={T} />
      </g>
      {!k && <Halat x={540} y1={560} y2={y - 520} w={18} renk={T} />}
      <path d={`M540 ${y - 520 + (k ? 150 : 0)} L300 ${y} M540 ${y - 520 + (k ? 150 : 0)} L780 ${y}`} stroke={T} strokeWidth={7} fill="none" />
      {k &&
        [250, 830].map((x) => (
          <g key={x}>
            <path d={`M${x < 500 ? 300 : 780} ${y + 10} L${x + (x < 500 ? 14 : -14)} ${y - 16}`} stroke={CELIK} strokeWidth={18} strokeLinecap="round" />
            <Kivilcim x={x + (x < 500 ? 20 : -20)} y={y - 10} r={90} n={8} o={1 - ap(t, cut + 0.2, 0.6)} />
          </g>
        ))}
      <Platform y={y}>
        <Cizgi
          x={500}
          y={0}
          s={0.9}
          goz={k ? 'mutlu' : 'acik'}
          agiz={k ? 'sirit' : 'duz'}
          kas={k ? 'duz' : 'catik'}
          bakis={[0, -1]}
          kolSag={[lerp(170, 120, sal), 30]}
          kolSol={k && t > st - 0.2 ? [140, 20] : [20, 14]}
          renk={GD.sari}
          elSag={
            <g transform={`rotate(${lerp(-30, 40, sal)})`}>
              <path d="M0 20 V-150" stroke="#6B4A2E" strokeWidth={14} strokeLinecap="round" />
              <path d="M-8 -150 q50 -40 70 10 q-30 30 -70 30 Z" fill={CELIK} stroke={GD.siyah} strokeWidth={6} strokeLinejoin="round" />
            </g>
          }
          golge={false}
        />
      </Platform>
      <g transform={`rotate(-8 820 640)`}>
        <Onay x={820} y={640} s={pop(t, st - 0.05)} r={110} />
      </g>
      <Zerre n={26} color="#FFF1C9" o={0.3} />
    </GK>
  );
};

const short = makeShort({
  kod: 's14g',
  words: WORDS,
  voiceLen: 20.34,
  tail: 0.7,
  baslik: ['ELEVATOR CABLE', 'SNAPS'],
  tema: 'gece',
  sekil: [
    'ŞEKİL 1 · ASANSÖR BOŞLUĞU',
    'ŞEKİL 2 · KABİN',
    'ŞEKİL 3 · HALAT',
    'ŞEKİL 4 · MAKİNE DAİRESİ',
    'ŞEKİL 5 · HALATLAR',
    'ŞEKİL 6 · HIZ REGÜLATÖRÜ',
    'ŞEKİL 7 · GÜVENLİK FRENİ',
    'ŞEKİL 8 · NEW YORK · 1854',
    'ŞEKİL 9 · OTIS GÖSTERİSİ',
    'ŞEKİL 1 · ASANSÖR BOŞLUĞU',
  ],
  plan: [
    { w: 'Your', C: S1 },
    { w: 'You', C: S2 },
    { w: 'First,', C: S3 },
    { w: 'There', C: S4 },
    { w: 'each', C: S5 },
    { w: 'Second,', C: S6 },
    { w: 'steel', C: S7 },
    { w: 'Invented', C: S8 },
    { w: 'The', C: S9 },
    { w: '@END', C: S1 },
  ],
  cues: [
    ['impact', 'Your', -0.12, 0.25],
    ['impact', 'snaps.', 0, 0.2],
    ['ding', 'You', 0.45, 0.18],
    ['buzz', 'not#2', 0, 0.12],
    ['tick', 'There', 0.1, 0.2],
    ['pop', 'eight,', 0, 0.25],
    ['click', 'each', 0.5, 0.2],
    ['riser', 'Second,', 0.6, 0.14],
    ['impact', 'bite', 0, 0.25],
    ['ding', 'Invented', 0.7, 0.16],
    ['whoosh', 'cut', -0.1, 0.2],
    ['lock', 'cut', 0.15, 0.25],
    ['pop', 'stage.', 0, 0.22],
  ],
  muzik: ['music-dark', 0.06],
});

export const S14G = short.Comp;
export const S14G_FRAMES = short.frames;
