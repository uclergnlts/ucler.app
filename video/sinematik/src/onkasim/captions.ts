// 10 Kasım seslendirmesinin kelime zamanları: faster-whisper zamanları senaryo metnine oturtuldu (scripts/kelime_zamanlari.py).
import type { Word } from '../captions';
import raw from './words.json';

export const WORDS: (Word & { k?: string })[] = raw as (Word & { k?: string })[];

/** "kelime", "kelime#2" -> saniye (ses başına göre). Rakamla gösterilen kelimeler asıl yazımıyla da (k) bulunur. */
export function wt(spec: string): number {
  const m = spec.match(/^(.+?)(?:#(\d+))?$/);
  if (!m) throw new Error('kelime: ' + spec);
  let n = Number(m[2] || 1);
  const o = WORDS.find((w) => (w.w === m[1] || (w.k && w.k.split(' ')[0] === m[1])) && --n === 0);
  if (!o) throw new Error('kelime yok: ' + spec);
  return o.s;
}
