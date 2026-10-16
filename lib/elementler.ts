// İlk 20 element. Etkileşimli atom kartı ve periyodik tablo oyunu bunu kullanır.
export type El = { z: number; s: string; ad: string };

export const ELEMENTLER: El[] = [
  ["H", "Hidrojen"], ["He", "Helyum"], ["Li", "Lityum"], ["Be", "Berilyum"], ["B", "Bor"],
  ["C", "Karbon"], ["N", "Azot"], ["O", "Oksijen"], ["F", "Flor"], ["Ne", "Neon"],
  ["Na", "Sodyum"], ["Mg", "Magnezyum"], ["Al", "Alüminyum"], ["Si", "Silisyum"], ["P", "Fosfor"],
  ["S", "Kükürt"], ["Cl", "Klor"], ["Ar", "Argon"], ["K", "Potasyum"], ["Ca", "Kalsiyum"],
].map(([s, ad], i) => ({ z: i + 1, s, ad }));

/** Katmanlardaki elektron sayıları. İlk 20 element için basit kural: 2, 8, 8, 2. */
export function katmanlar(e: number): number[] {
  const out: number[] = [];
  for (const cap of [2, 8, 8, 2]) {
    if (e <= 0) break;
    out.push(Math.min(cap, e));
    e -= cap;
  }
  return out;
}

/** Nötr atomun tablodaki yeri: periyot = katman sayısı; A grubu = değerlik elektronu (helyum 8A). */
export function yer(z: number): { periyot: number; grup: number } {
  const k = katmanlar(z);
  const son = k[k.length - 1];
  return { periyot: k.length, grup: z === 2 ? 8 : son };
}

/** A grubunun 1-18 numaralamasındaki karşılığı. */
export const grup18 = (a: number) => (a <= 2 ? a : a + 10);
