import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Word } from '../captions';
import { fontFamily } from '../fonts';

/**
 * Seslendirmeyle kelime kelime eş zamanlı altyazı. Zamanlar src/captions.ts'teki gerçek kelime
 * zamanlarından gelir; 1–3 kelimelik parçalar, konuşulduğu anda ekrana düşer.
 */
type Chunk = { words: Word[]; s: number; e: number };

function chunk(words: Word[]): Chunk[] {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  words.forEach((w, i) => {
    const next = words[i + 1];
    cur.push(w);
    const len = cur.map((x) => x.w).join(' ').length;
    const pause = next ? next.s - w.e > 0.25 : true;
    if (/[.,:?!]$/.test(w.w) || pause || cur.length === 3 || len > 16) flush();
  });
  flush();
  return out;
}

const DEFAULT_CHUNKS: Chunk[] = [];

export const Caption: React.FC<{ until?: number; color?: string; accent?: string; words?: Word[]; size?: number; style?: React.CSSProperties }> = ({ until = Infinity, color = '#0E1117', accent = '#5B3DF5', words, size = 68, style }) => {
  const CHUNKS = useMemo(() => (words ? chunk(words) : DEFAULT_CHUNKS), [words]);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame >= until) return null;
  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < CHUNKS.length; i++) {
    const nextS = CHUNKS[i + 1]?.s ?? Infinity;
    // Parça, ilk kelimesi söylenirken gelir; sonraki parçaya ya da en fazla 0,6 sn sessizliğe kadar kalır.
    if (t >= CHUNKS[i].s - 0.05 && t < Math.min(nextS - 0.05, CHUNKS[i].e + 0.6)) idx = i;
  }
  if (idx < 0) return null;
  const c = CHUNKS[idx];
  const pop = interpolate(t - c.s, [-0.05, 0.1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div lang="tr" style={{ fontFamily, fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color, transform: `scale(${pop})`, transformOrigin: 'left center', ...style }}>
      {c.words.map((w, i) => {
        const spoken = t >= w.s - 0.05;
        return (
          <span key={i} style={{ color: /[?!]$/.test(w.w) && i === c.words.length - 1 ? accent : undefined, opacity: spoken ? 1 : 0.35 }}>
            {w.w}
            {i < c.words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};
