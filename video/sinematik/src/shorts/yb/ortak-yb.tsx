/**
 * "Doğru bildiğimiz yanlışlar" Shorts serisi (S-22..S-26) ortak parçaları.
 * Yeni sistem: arka plan = Nano Banana ile çizilmiş DURAĞAN detaylı görsel (public/shorts/bg/bNN.jpg, 1080x1920),
 * Çizgi ve hareketli her şey kodla üstüne çizilir. Kanca: 0. sn büyük yazı, ilk 2 sn hüküm, "neden" sonda.
 */
import React, { createContext, useContext } from 'react';
import { interpolate as ip, staticFile, useCurrentFrame as ucf, useVideoConfig } from 'remotion';
import { clamp } from '../../kit';
import { fontDuz as fontFamily } from '../../fonts';
import { INK } from '../../kit';
import { FPS, inOut, lerp as lp, pop, SDefs } from '../ortak';

/** Nano Banana arka planı. b = '01'..'11'. karart: üstüne siyah perde (0..1). bulanik: odak dışı. */
export const Arka: React.FC<{ b: string; karart?: number; bulanik?: boolean }> = ({ b, karart = 0, bulanik = false }) => (
  <g>
    <image href={staticFile(`shorts/bg/b${b}.jpg`)} x={-60} y={-60} width={1200} height={2040} preserveAspectRatio="xMidYMid slice" filter={bulanik ? 'url(#s-blur)' : undefined} />
    {karart > 0 && <rect x={-200} y={-200} width={1480} height={2320} fill="#05060C" opacity={karart} />}
  </g>
);

/** Kesit/şema sahneleri için koyu panel (arka plan karartılıp üstüne çizilir). */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 0.82 }) => (
  <rect x={x} y={y} width={w} height={h} rx={48} fill="#0E1022" opacity={o} stroke="#F1E9D8" strokeOpacity={0.18} strokeWidth={4} />
);

/** Ekranda ortada patlayan büyük yazı (kanca ve hüküm). t: çekim saniyesi, at: çıkış anı. */
export const Patla: React.FC<{ t: number; at?: number; x?: number; y: number; size?: number; renk?: string; r?: number; children: React.ReactNode }> = ({
  t, at = 0, x = 540, y, size = 130, renk = '#FFD54A', r = -4, children,
}) => {
  const p = pop(t, at, 0.3);
  return (
    <Duz>
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${p})`} opacity={p > 0 ? 1 : 0}>
      <text textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 9} paintOrder="stroke" letterSpacing="-0.02em">
        {children}
      </text>
    </g>
    </Duz>
  );
};

/** Üstü çizilen yanlış: yazı + üstünden kırmızı çizgi (at anında çizilir). */
export const Ustu: React.FC<{ t: number; at: number; x?: number; y: number; w: number; size?: number; children: React.ReactNode }> = ({ t, at, x = 540, y, w, size = 110, children }) => {
  const u = Math.max(0, Math.min(1, (t - at) / 0.22));
  return (
    <Duz>
    <g>
      <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={size} fill="#F1E9D8" stroke={INK} strokeWidth={size / 9} paintOrder="stroke">
        {children}
      </text>
      <path d={`M${x - w / 2} ${y - size * 0.32} L${x - w / 2 + w * u} ${y - size * 0.38}`} stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={`M${x - w / 2} ${y - size * 0.32} L${x - w / 2 + w * u} ${y - size * 0.38}`} stroke="#FF4A3A" strokeWidth={20} strokeLinecap="round" />
    </g>
    </Duz>
  );
};

/** Çizgi'nin yumruğu yakın çekim (koyu, eklem tümsekli). */
export const Yumruk: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-170} y={-120} width={340} height={260} rx={110} fill="#1B2033" stroke="#0A0C14" strokeWidth={10} />
    {[-110, -37, 37, 110].map((cx) => (
      <circle key={cx} cx={cx} cy={-112} r={44} fill="#232A42" stroke="#0A0C14" strokeWidth={8} />
    ))}
    {[-73, 0, 73].map((cx) => (
      <path key={cx} d={`M${cx} -70 v90`} stroke="#0A0C14" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    ))}
    <path d="M-170 40 q-70 -10 -60 -90 q60 -10 70 40" fill="#1B2033" stroke="#0A0C14" strokeWidth={10} />
    <rect x={-150} y={120} width={300} height={140} fill="#F2C21A" />
    <ellipse cx={-90} cy={-150} rx={36} ry={14} fill="#fff" opacity={0.12} />
  </g>
);

/** Patlama yıldızı ("POP", kıvılcım). */
export const Yildiz: React.FC<{ x: number; y: number; s?: number; renk?: string; children?: React.ReactNode }> = ({ x, y, s = 1, renk = '#FFD54A', children }) => {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12;
    const rr = i % 2 ? 90 : 150;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(' ');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points={pts} fill={renk} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {children && (
        <text y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={70} fill={INK}>
          {children}
        </text>
      )}
    </g>
  );
};

/* ---------------- Sahne: Kadraj + yakınlaştırmadan etkilenmeyen yazı katmanı ---------------- */


type Tf = { o: [number, number]; p: [number, number]; z: number };
const TfCtx = createContext<Tf | null>(null);

/** İçindekiler kamera yakınlaştırmasından bağımsız, ekran koordinatında (1080x1920) çizilir. */
export const Duz: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tf = useContext(TfCtx);
  if (!tf) return <>{children}</>;
  return <g transform={`translate(${tf.o[0]} ${tf.o[1]}) scale(${1 / tf.z}) translate(${-tf.o[0] - tf.p[0]} ${-tf.o[1] - tf.p[1]})`}>{children}</g>;
};

/**
 * Kamera. odak: sahnedeki bu nokta ekranda `ekran` noktasına (varsayılan merkez) gelir; zoom çekim boyunca değişir.
 * odak verilmezse Kadraj gibi origin sabit kalır.
 */
export const Sahne: React.FC<{
  children: React.ReactNode;
  zoom?: [number, number];
  odak?: [number, number];
  ekran?: [number, number];
  origin?: [number, number];
  shakeAt?: number[];
  shake?: number;
  vignette?: number;
}> = ({ children, zoom = [1, 1.06], odak, ekran = [540, 960], origin = [540, 960], shakeAt = [], shake = 18, vignette = 0.7 }) => {
  const f = ucf();
  const { durationInFrames } = useVideoConfig();
  const u = ip(f, [0, Math.max(1, durationInFrames - 1)], [0, 1], { ...clamp, easing: inOut });
  const t = f / FPS;
  const z = lp(zoom[0], zoom[1], u);
  const o: [number, number] = odak ?? origin;
  const p: [number, number] = odak ? [ekran[0] - odak[0], ekran[1] - odak[1]] : [0, 0];
  let amp = 0;
  shakeAt.forEach((a) => {
    if (t >= a && t < a + 0.6) amp = Math.max(amp, shake * Math.exp(-(t - a) * 6));
  });
  const sx = amp * (Math.sin(t * 83) * 0.6 + Math.sin(t * 47) * 0.4);
  const sy = amp * (Math.cos(t * 71) * 0.6 + Math.sin(t * 39) * 0.4);
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ display: 'block', background: '#0B0D16' }}>
      <SDefs />
      <TfCtx.Provider value={{ o, p: [p[0] + sx, p[1] + sy], z }}>
        <g transform={`translate(${o[0] + p[0] + sx} ${o[1] + p[1] + sy}) scale(${z}) translate(${-o[0]} ${-o[1]})`}>{children}</g>
      </TfCtx.Provider>
      <rect width={1080} height={1920} fill="url(#s-vig)" opacity={vignette} style={{ pointerEvents: 'none' }} />
    </svg>
  );
};
