// Aşamalı öğrenme: her konunun kartları 2-4 aşamaya bölünür, kabaca 5 kartta bir aşama.
// Aşamalar sırayla açılır ve öğrenci her konuya 1. aşamadan başlar; mini test son aşamadan sonra gelir.

/** Konudaki aşama sayısı. */
export const asamaSayisi = (nKart: number) => Math.min(4, Math.max(2, Math.round(nKart / 5)));

/** Her aşamanın kart aralığı [ilk, son) (0'dan başlar). Kartlar aşamalara olabildiğince eşit dağılır. */
export function asamalar(nKart: number): [number, number][] {
  const n = Math.min(asamaSayisi(nKart), nKart);
  const out: [number, number][] = [];
  for (let a = 0, bas = 0; a < n; a++) {
    const son = Math.round(((a + 1) * nKart) / n);
    out.push([bas, son]);
    bas = son;
  }
  return out;
}

/** Kartın (0'dan başlar) bulunduğu aşama. */
export const kartinAsamasi = (nKart: number, k: number) => asamalar(nKart).findIndex(([b, s]) => k >= b && k < s);

/** Konunun yaklaşık süresi (dakika): kart başına ~20 sn okuma, etkileşimli adım başına ~35 sn, test sorusu başına ~40 sn. */
export const sureDk = (kart: number, adim: number, soru: number) => Math.max(3, Math.round((kart * 20 + adim * 35 + soru * 40) / 60));
