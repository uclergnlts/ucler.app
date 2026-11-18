/** Shorts'larda tekrar kullanılan küçük parçalar: etiket, onay, çarpı, ok, sahte rastgele. */
import React from 'react';
import { fontDuz as fontFamily } from '../fonts';
import { INK } from '../kit';

export const SARI = '#FFD54A';

export const rnd = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

export const Etiket: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; o?: number; renk?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, size = 110, children, o = 1, renk = SARI, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={800} fontSize={size} fill={renk} stroke={INK} strokeWidth={size / 11} paintOrder="stroke" opacity={o}>
    {children}
  </text>
);

export const Carpi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke={INK} strokeWidth={70} strokeLinecap="round" />
    <path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke="#FF4A3A" strokeWidth={46} strokeLinecap="round" />
  </g>
);

export const Onay: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={108} fill="#3FCB6B" stroke={INK} strokeWidth={10} />
    <path d="M-50 4 l36 36 l68 -78" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Kalın ok: (0,0)'dan sağa doğru L uzunluğunda; r ile döndür. */
export const Ok: React.FC<{ x: number; y: number; L?: number; r?: number; renk?: string; s?: number }> = ({ x, y, L = 220, r = 0, renk = SARI, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d={`M0 0 H${L} m-50 -44 l50 44 l-50 44`} stroke={INK} strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M0 0 H${L} m-50 -44 l50 44 l-50 44`} stroke={renk} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Kronometre: v = gösterilecek yazı, a = ibre açısı (derece). */
export const Kronometre: React.FC<{ x: number; y: number; s?: number; v: string; a: number; renk?: string }> = ({ x, y, s = 1, v, a, renk = '#fff' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-34} y={-330} width={68} height={70} rx={12} fill="#C9D2E3" stroke={INK} strokeWidth={10} />
    <rect x={-70} y={-372} width={140} height={54} rx={16} fill="#FF5A3A" stroke={INK} strokeWidth={10} />
    <circle r={270} fill="#C9D2E3" stroke={INK} strokeWidth={14} />
    <circle r={226} fill={renk} stroke={INK} strokeWidth={10} />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d="M0 -206 V-176" stroke={INK} strokeWidth={i % 3 ? 7 : 14} strokeLinecap="round" transform={`rotate(${i * 30})`} />
    ))}
    <text x={0} y={120} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={120} fill={INK}>
      {v}
    </text>
    <path d="M0 20 V-170" stroke="#FF4A3A" strokeWidth={14} strokeLinecap="round" transform={`rotate(${a})`} />
    <circle r={20} fill={INK} />
  </g>
);
