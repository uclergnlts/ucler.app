// İlk 20 element. Etkileşimli atom kartı ve periyodik tablo oyunu bunu kullanır.
import { cev } from "@/lib/dil";
export type El = { z: number; s: string; ad: string };

export const ELEMENTLER: El[] = [
  ["H", cev("Hidrojen")], [cev("He"), cev("Helyum")], [cev("Li"), cev("Lityum")], [cev("Be"), cev("Berilyum")], ["B", cev("Bor")],
  ["C", cev("Karbon")], ["N", cev("Azot")], ["O", cev("Oksijen")], ["F", cev("Flor")], [cev("Ne"), cev("Neon")],
  [cev("Na"), cev("Sodyum")], [cev("Mg"), cev("Magnezyum")], [cev("Al"), cev("Alüminyum")], [cev("Si"), cev("Silisyum")], ["P", cev("Fosfor")],
  ["S", cev("Kükürt")], [cev("Cl"), cev("Klor")], [cev("Ar"), cev("Argon")], ["K", cev("Potasyum")], [cev("Ca"), cev("Kalsiyum")],
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
