/**
 * YouTube Shorts (İngilizce kanal) ortak parçaları: Çizgi karakteri, zaman yardımcıları,
 * ve videoyu kuran ShortVideo (çekim planı, iki satır başlık, kelime altyazısı, ses, efekt, müzik).
 * Kurallar: 12-25 sn, ilk kare tuhaf durum, cevap sonda, son kare ilk kareye döner (loop).
 */
import React, { createContext, useContext, useMemo } from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Caption } from '../components/Caption';
import type { Word } from '../captions';
import { fontFamily } from '../fonts';
import { clamp, INK } from '../kit';

export const FPS = 30;
export const OFF = 0.12; // ses gecikmesi (sn)

/* ---------------- zaman ---------------- */

export const outBack = Easing.out(Easing.back(1.7));
export const outCubic = Easing.out(Easing.cubic);
export const inOut = Easing.inOut(Easing.cubic);
export const ap = (t: number, at: number, d = 0.35, e = outCubic) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: e });
export const pop = (t: number, at: number, d = 0.32) => interpolate(t, [at, at + d], [0, 1], { ...clamp, easing: outBack });
/** Sönümlü yay: at anında 1'e oturan, aşıp geri gelen hareket. */
export const spring = (t: number, at: number, k = 9, damp = 5) => {
  const x = t - at;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(k * x);
};
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Çekim başı (ses saniyesi). useAt('kelime'): kelimenin bu çekimin başına göre saniyesi. */
export const ShotStart = createContext(0);
export const WordsCtx = createContext<Word[]>([]);
export const findWord = (words: Word[], spec: string) => {
  const m = spec.match(/^(.+?)(?:#(\d+))?$/);
  if (!m) throw new Error('kelime: ' + spec);
  let n = Number(m[2] || 1);
  const o = words.find((w) => w.w.replace(/[.,?!]$/, '') === m[1].replace(/[.,?!]$/, '') && --n === 0);
  if (!o) throw new Error('kelime yok: ' + spec);
  return o.s;
};
export const useAt = (spec: string) => findWord(useContext(WordsCtx), spec) - useContext(ShotStart);
/** Çekim içi saniye. */
export const useTt = () => useCurrentFrame() / FPS;

/* ---------------- Çizgi ---------------- */

export const HOOD = '#F2C21A';
export const HOOD_D = '#C99A0C';
export const JEANS = '#26324F';
export const HEAD = '#1B2033';
export const RIM = '#FFB25C';

export type Goz = 'acik' | 'mutlu' | 'sok' | 'kapali' | 'goz-kirp' | 'sikis' | 'yari' | 'yukari';
export type Agiz = 'gulus' | 'acik' | 'o' | 'duz' | 'eksi' | 'sirit' | 'yok' | 'kocaman';
/** Kol: [omuz, dirsek] açı (derece). 0 = aşağı, + = dışa/yukarı doğru. */
export type Kol = [number, number];

export type CizgiProps = {
  x: number;
  y: number; // ayak hizası
  s?: number;
  goz?: Goz;
  agiz?: Agiz;
  kas?: 'duz' | 'kalkik' | 'catik' | 'uzgun';
  kolSol?: Kol; // ekranın solundaki kol
  kolSag?: Kol;
  bacak?: number; // adım açısı (+ sağ bacak öne)
  egim?: number; // gövde eğimi (derece)
  bas?: number; // baş eğimi
  bakis?: [number, number];
  onluk?: boolean; // laboratuvar önlüğü
  kapusonBasta?: boolean;
  isik?: number; // arka kenar ışığı (0..1)
  elSag?: React.ReactNode; // sağ elde tutulan nesne (el merkezine göre çizilir)
  elSol?: React.ReactNode;
  oturan?: boolean;
  nefes?: boolean;
  renk?: string;
  golge?: boolean;
};

const rad = (d: number) => (d * Math.PI) / 180;

export const Cizgi: React.FC<CizgiProps> = ({
  x, y, s = 1, goz = 'acik', agiz = 'gulus', kas = 'duz', kolSol = [12, 10], kolSag = [12, 10], bacak = 0, egim = 0, bas = 0,
  bakis = [0, 0], onluk = false, kapusonBasta = false, isik = 1, elSag, elSol, oturan = false, nefes = true, renk = HOOD, golge = true,
}) => {
  const f = useCurrentFrame();
  const br = nefes ? 1 + Math.sin(f / 9) * 0.008 : 1;
  const blink = goz === 'acik' && f % 96 > 92;
  const hipY = oturan ? -150 : -250;
  const shY = hipY - 210;
  const headY = shY - 92;
  const legW = 38;
  const armW = 40;
  // kollar: omuzdan dirseğe 115, dirsekten ele 105
  const arm = (side: -1 | 1, k: Kol) => {
    const sx = side * 58;
    const a1 = rad(k[0]);
    const a2 = rad(k[0] + k[1]);
    const ex = sx + side * Math.sin(a1) * 112;
    const ey = shY + 14 + Math.cos(a1) * 112;
    const hx = ex + side * Math.sin(a2) * 104;
    const hy = ey + Math.cos(a2) * 104;
    return { sx, sy: shY + 14, ex, ey, hx, hy };
  };
  const L = arm(-1, kolSol);
  const R = arm(1, kolSag);
  const leg = (side: -1 | 1) => {
    const a = rad(side * bacak);
    const kx = side * 24 + Math.sin(a) * 120;
    const ky = hipY + Math.cos(a) * 120;
    if (oturan) return { kx: side * 30 + 120, ky: hipY + 10, fx: side * 30 + 120, fy: 0 };
    return { kx, ky, fx: kx + Math.sin(a) * 0.3 * 120, fy: 0 };
  };
  const LL = leg(-1);
  const RL = leg(1);
  const eyeY = headY + 4;
  const eyes = (cx: number) => {
    const ex = cx + bakis[0] * 8;
    const ey = eyeY + bakis[1] * 8;
    if (blink || goz === 'kapali') return <path key={cx} d={`M${cx - 15} ${eyeY} q15 10 30 0`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />;
    if (goz === 'mutlu') return <path key={cx} d={`M${cx - 16} ${eyeY + 6} q16 -22 32 0`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />;
    if (goz === 'sikis')
      return <path key={cx} d={cx < 0 ? `M${cx - 14} ${eyeY - 14} l24 14 l-24 14` : `M${cx + 14} ${eyeY - 14} l-24 14 l24 14`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    if (goz === 'goz-kirp' && cx > 0) return <path key={cx} d={`M${cx - 16} ${eyeY + 2} q16 -14 32 0`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />;
    if (goz === 'sok')
      return (
        <g key={cx}>
          <ellipse cx={cx} cy={eyeY - 4} rx={20} ry={25} fill="#fff" />
          <circle cx={ex} cy={ey - 4} r={7} fill={HEAD} />
        </g>
      );
    if (goz === 'yari')
      return (
        <g key={cx}>
          <ellipse cx={ex} cy={ey + 4} rx={13} ry={9} fill="#fff" />
          <rect x={cx - 18} y={eyeY - 14} width={36} height={14} fill={HEAD} />
        </g>
      );
    if (goz === 'yukari') return <ellipse key={cx} cx={cx + bakis[0] * 6} cy={eyeY - 10} rx={12} ry={17} fill="#fff" />;
    return <ellipse key={cx} cx={ex} cy={ey} rx={12} ry={17} fill="#fff" />;
  };
  const brow = (cx: number) => {
    const sgn = cx < 0 ? -1 : 1;
    if (kas === 'duz') return null;
    const d =
      kas === 'kalkik' ? `M${cx - 16} ${eyeY - 40} q16 -10 32 0` : kas === 'catik' ? `M${cx - 16 * sgn} ${eyeY - 40} l${32 * sgn} 12` : `M${cx - 16 * sgn} ${eyeY - 30} l${32 * sgn} -12`;
    return <path key={'b' + cx} d={d} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />;
  };
  const mouthY = headY + 42;
  const mouth = (() => {
    switch (agiz) {
      case 'gulus':
        return <path d={`M-20 ${mouthY - 4} q20 18 40 0`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />;
      case 'sirit':
        return <path d={`M-24 ${mouthY - 6} q24 26 48 0 z`} fill="#fff" />;
      case 'kocaman':
        return <path d={`M-30 ${mouthY - 10} q30 44 60 0 z`} fill="#fff" />;
      case 'acik':
        return <ellipse cx={0} cy={mouthY + 2} rx={20} ry={16} fill="#fff" />;
      case 'o':
        return <ellipse cx={0} cy={mouthY + 2} rx={10} ry={13} fill="#fff" />;
      case 'duz':
        return <path d={`M-16 ${mouthY + 2} h32`} stroke="#fff" strokeWidth={7} strokeLinecap="round" />;
      case 'eksi':
        return <path d={`M-20 ${mouthY + 8} q20 -16 40 0`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />;
      default:
        return null;
    }
  })();
  const rimF = isik > 0 ? 'url(#s-rim)' : undefined;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {golge && <ellipse cx={0} cy={6} rx={oturan ? 190 : 120} ry={20} fill="#000" opacity={0.35} />}
      <g transform={`scale(1 ${br})`} filter={rimF}>
        {/* bacaklar */}
        {[LL, RL].map((l, i) => (
          <g key={i}>
            <path d={`M${i ? 22 : -22} ${hipY} L${l.kx} ${l.ky} L${l.fx} ${l.fy - 12}`} stroke={JEANS} strokeWidth={legW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${l.fx - 18} ${l.fy - 8} h${oturan ? 60 : 52}`} stroke="#11131C" strokeWidth={26} strokeLinecap="round" />
          </g>
        ))}
        <g transform={`rotate(${egim} 0 ${hipY})`}>
          {/* arka kol */}
          <path d={`M${L.sx} ${L.sy} L${L.ex} ${L.ey} L${L.hx} ${L.hy}`} stroke={onluk ? '#E9EEF5' : renk} strokeWidth={armW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={L.hx} cy={L.hy} r={17} fill={HEAD} />
          {elSol && <g transform={`translate(${L.hx} ${L.hy})`}>{elSol}</g>}
          {/* gövde */}
          <path d={`M-62 ${shY + 30} q0 -42 40 -42 h44 q40 0 40 42 L70 ${hipY + 26} q0 22 -22 22 h-96 q-22 0 -22 -22 Z`} fill={renk} />
          <path d={`M-62 ${hipY + 4} h132`} stroke={HOOD_D} strokeWidth={14} opacity={0.6} />
          <path d={`M-30 ${hipY - 66} h60 l8 50 h-76 z`} fill={HOOD_D} opacity={0.5} />
          <path d={`M-12 ${shY - 6} l-4 70 M12 ${shY - 6} l4 70`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          {onluk && (
            <g>
              <path d={`M-70 ${shY + 20} q0 -34 34 -34 l30 70 l-6 ${hipY - shY + 70} h-58 z`} fill="#EEF2F7" />
              <path d={`M70 ${shY + 20} q0 -34 -34 -34 l-30 70 l6 ${hipY - shY + 70} h58 z`} fill="#EEF2F7" />
              <path d={`M-36 ${shY - 14} l30 70 M36 ${shY - 14} l-30 70`} stroke="#B9C3D2" strokeWidth={4} />
              <rect x={30} y={shY + 70} width={26} height={34} rx={4} fill="#B9C3D2" />
              <path d={`M38 ${shY + 64} v14`} stroke="#3B6FE0" strokeWidth={5} strokeLinecap="round" />
            </g>
          )}
          {/* kapüşon (başın arkasında) */}
          <g transform={`rotate(${bas} 0 ${shY})`}>
            <ellipse cx={0} cy={headY + (kapusonBasta ? -4 : 22)} rx={kapusonBasta ? 98 : 84} ry={kapusonBasta ? 98 : 70} fill={renk} />
            {kapusonBasta && <ellipse cx={0} cy={headY + 4} rx={84} ry={84} fill={HOOD_D} opacity={0.6} />}
            <circle cx={0} cy={headY} r={74} fill={HEAD} />
            <ellipse cx={-26} cy={headY - 34} rx={22} ry={12} fill="#fff" opacity={0.08} transform={`rotate(-30 -26 ${headY - 34})`} />
            {eyes(-28)}
            {eyes(28)}
            {brow(-28)}
            {brow(28)}
            {mouth}
          </g>
          {/* ön kol */}
          <path d={`M${R.sx} ${R.sy} L${R.ex} ${R.ey} L${R.hx} ${R.hy}`} stroke={onluk ? '#F4F7FB' : renk} strokeWidth={armW} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={R.hx} cy={R.hy} r={17} fill={HEAD} />
          {elSag && <g transform={`translate(${R.hx} ${R.hy})`}>{elSag}</g>}
        </g>
      </g>
    </g>
  );
};

/** Ortak SVG tanımları: kenar ışığı, ışık konisi, parlama, vinyet, film greni. */
export const SDefs: React.FC<{ rim?: string }> = ({ rim = RIM }) => {
  const f = useCurrentFrame();
  return (
    <defs>
      <filter id="s-rim" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx={-5} dy={-2} stdDeviation={2.5} floodColor={rim} floodOpacity={0.9} />
        <feDropShadow dx={6} dy={6} stdDeviation={8} floodColor="#000" floodOpacity={0.35} />
      </filter>
      <filter id="s-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation={22} />
      </filter>
      <filter id="s-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={6} />
      </filter>
      <filter id="s-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={14} />
      </filter>
      <filter id="s-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={f % 6} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id="s-vig" cx="0.5" cy="0.46" r="0.78">
        <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.85" />
      </radialGradient>
      <radialGradient id="s-cone" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFE2A8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="s-spot" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
};

/** Kamera + atmosfer çerçevesi. zoom/pan çekim boyunca (ease), sarsıntı t anında. */
export const Kadraj: React.FC<{
  children: React.ReactNode;
  zoom?: [number, number];
  pan?: [[number, number], [number, number]];
  rot?: [number, number];
  origin?: [number, number];
  shakeAt?: number[];
  shake?: number;
  bg?: string;
  vignette?: number;
  rim?: string;
  sure?: number; // çekim süresi (sn) zoom için; yoksa 3
}> = ({ children, zoom = [1, 1.06], pan = [[0, 0], [0, 0]], rot = [0, 0], origin = [540, 960], shakeAt = [], shake = 18, bg = '#0B0D16', vignette = 0.75, rim }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const u = interpolate(f, [0, Math.max(1, durationInFrames - 1)], [0, 1], { ...clamp, easing: inOut });
  const t = f / FPS;
  const z = lerp(zoom[0], zoom[1], u);
  const px = lerp(pan[0][0], pan[1][0], u);
  const py = lerp(pan[0][1], pan[1][1], u);
  const r = lerp(rot[0], rot[1], u);
  let amp = 0;
  shakeAt.forEach((a) => {
    if (t >= a && t < a + 0.6) amp = Math.max(amp, shake * Math.exp(-(t - a) * 6));
  });
  const sx = amp * (Math.sin(t * 83) * 0.6 + Math.sin(t * 47) * 0.4);
  const sy = amp * (Math.cos(t * 71) * 0.6 + Math.sin(t * 39) * 0.4);
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: 'block', background: bg }}>
      <SDefs rim={rim} />
      <g transform={`translate(${origin[0] + px + sx} ${origin[1] + py + sy}) rotate(${r}) scale(${z}) translate(${-origin[0]} ${-origin[1]})`}>{children}</g>
      <rect width={1080} height={1920} fill="url(#s-vig)" opacity={vignette} />
      <rect width={1080} height={1920} filter="url(#s-grain)" opacity={0.06} style={{ mixBlendMode: 'overlay' }} />
    </svg>
  );
};

/** Havada süzülen toz/ışık zerreleri. */
export const Zerre: React.FC<{ n?: number; color?: string; x?: number; y?: number; w?: number; h?: number; r?: number; o?: number }> = ({ n = 40, color = '#FFE2A8', x = 0, y = 0, w = 1080, h = 1920, r = 3, o = 0.4 }) => {
  const f = useCurrentFrame();
  const pts = useMemo(() => Array.from({ length: n }, (_, i) => ({ px: ((i * 137) % 1000) / 1000, py: ((i * 251) % 1000) / 1000, rr: r * (0.5 + ((i * 7) % 10) / 10), sp: 0.3 + (i % 5) * 0.15 })), [n, r]);
  return (
    <g>
      {pts.map((d, i) => (
        <circle key={i} cx={x + d.px * w + Math.sin((f + i * 20) / 28) * 12} cy={y + (((d.py * h - f * d.sp) % h) + h) % h} r={d.rr} fill={color} opacity={o * (0.5 + 0.5 * Math.sin(f / 12 + i))} />
      ))}
    </g>
  );
};

/** Işık konisi (tavandan aşağı). */
export const Koni: React.FC<{ x: number; y: number; w1?: number; w2?: number; h?: number; o?: number; color?: string }> = ({ x, y, w1 = 70, w2 = 700, h = 1300, o = 0.55 }) => (
  <polygon points={`${x - w1 / 2},${y} ${x + w1 / 2},${y} ${x + w2 / 2},${y + h} ${x - w2 / 2},${y + h}`} fill="url(#s-cone)" opacity={o} />
);

/* ---------------- video kurucu ---------------- */

export type Plan = { w: string; C: React.FC };
export type Cue = [string, string, number, number]; // [sfx dosyası, kelime, kaydırma sn, ses]

export const makeShort = (o: {
  kod: string; // s01
  words: Word[];
  voiceLen: number; // sn (kesilmiş ses)
  tail?: number; // sesten sonra (loop'a dönüş) sn
  plan: Plan[];
  baslik: [string, string]; // iki satır; ikinci satır vurgulu
  vurgu?: string;
  cues?: Cue[];
  muzik?: [string, number];
}) => {
  const tail = o.tail ?? 0.7;
  const frames = Math.round((o.voiceLen + OFF + tail) * FPS);
  const sec = (w: string) => (w === '@END' ? o.voiceLen + Math.max(0.05, tail - 0.6) : findWord(o.words, w)) + OFF;
  const fr = (s: number) => Math.round(s * FPS);
  const shots = o.plan.map((p, i) => {
    const from = i === 0 ? 0 : fr(sec(p.w) - 0.12);
    const to = i === o.plan.length - 1 ? frames : fr(sec(o.plan[i + 1].w) - 0.12);
    return { ...p, from, dur: to - from, start: from / FPS - OFF };
  });
  const Comp: React.FC = () => {
    const f = useCurrentFrame();
    const titleO = interpolate(f, [frames - 8, frames], [1, 1], clamp);
    return (
      <AbsoluteFill style={{ background: '#0B0D16' }}>
        <WordsCtx.Provider value={o.words}>
          {shots.map((s, i) => (
            <Sequence key={i} from={s.from} durationInFrames={s.dur} name={`çekim ${i + 1}`}>
              <ShotStart.Provider value={s.start}>
                <s.C />
              </ShotStart.Provider>
            </Sequence>
          ))}
        </WordsCtx.Provider>
        {/* iki satır başlık (Shorts kapağı gibi okunur) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily, fontWeight: 800, fontSize: 74, lineHeight: 1.02, letterSpacing: '-0.02em', color: '#fff', opacity: titleO, textShadow: `0 4px 0 ${INK}, 0 0 22px rgba(0,0,0,0.75)`, WebkitTextStroke: `3px ${INK}` }}>
          <div>{o.baslik[0]}</div>
          <div style={{ color: o.vurgu ?? '#FFD54A' }}>{o.baslik[1]}</div>
        </div>
        <div style={{ position: 'absolute', right: 44, top: 96, fontFamily, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          ucler<span style={{ color: '#F2C21A' }}>.</span>
        </div>
        <Sequence from={fr(OFF)} durationInFrames={fr(o.voiceLen + 0.1)}>
          <div style={{ position: 'absolute', left: 60, right: 60, bottom: 560, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <Caption words={o.words} color="#fff" accent="#FFD54A" size={70} style={{ transformOrigin: 'center', textShadow: `0 4px 0 ${INK}, 0 0 20px rgba(0,0,0,0.9)`, WebkitTextStroke: `2px ${INK}` }} />
          </div>
        </Sequence>
        <Sequence from={fr(OFF)}>
          <Audio src={staticFile(`shorts/${o.kod}/ses.mp3`)} />
        </Sequence>
        {o.muzik && <Audio src={staticFile(`sfx/${o.muzik[0]}.mp3`)} volume={(fr2) => interpolate(fr2, [0, 10, frames - 15, frames], [0, o.muzik![1], o.muzik![1], 0], clamp)} loop />}
        {(o.cues ?? []).map(([src, w, d, vol], i) => (
          <Sequence key={`c${i}`} from={Math.max(0, fr(sec(w) + d))} durationInFrames={FPS * 3}>
            <Audio src={staticFile(`sfx/${src}.mp3`)} volume={vol} />
          </Sequence>
        ))}
      </AbsoluteFill>
    );
  };
  return { Comp, frames };
};
