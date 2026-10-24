// Bulut eşitlemesinin birleştirme kuralları (lib/bulut.ts kullanır). Tarayıcıya bağlı değildir, ayrı denenebilir.
//
// Üç yönlü birleştirme: "temel", bu cihazın buluta en son başarıyla eşitlediği veridir. Bir değer temelden
// beri yalnız bir tarafta değiştiyse o tarafın hali alınır; silme de bir değişikliktir. Böylece bir cihazda
// silinen kayıt, bitirilen tekrar ya da sıfırlanan ilerleme, eski veriyle kalan ikinci cihazdan geri gelmez.
// İki taraf da değiştiyse eski kural geçerlidir: ilerleme geri gitmez.
//
// Sıfırlama ayrıca "sifir" damgasıyla işaretlenir (store.resetAll). Temelden beri bir tarafta yeni sıfırlama
// olduysa o tarafın verisi bütünüyle kazanır; diğer cihazın sıfırlamadan önceki verisi üzerine birleştirilmez.
import type { Gun, Puan } from "./puan";
import type { Asama, Prog, Seviye, Tekrar, Unite, Yer } from "./store";

export const ESIT = ["prog", "saved", "ad", "tekrar", "anlamadim", "asama", "puan", "gorev", "yer", "ipucu", "unite", "seviye", "izlenen", "sifir"] as const;
export type Veri = Partial<Record<(typeof ESIT)[number], unknown>>;

/** Anahtar sırasından bağımsız karşılaştırma (Postgres jsonb anahtarları yeniden sıralar). */
export function kararli(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(kararli).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v).sort().filter((k) => (v as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${kararli((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}
export const ayni = (a: unknown, b: unknown) => kararli(a ?? null) === kararli(b ?? null);

const birlesimDizi = (a: unknown, b: unknown) => [...new Set([...((a as string[]) ?? []), ...((b as string[]) ?? [])])];
const enBuyuk = (a: unknown, b: unknown) => {
  const x = { ...((a as Record<string, number>) ?? {}) };
  for (const [k, v] of Object.entries((b as Record<string, number>) ?? {})) x[k] = Math.max(x[k] ?? 0, v);
  return x;
};

/** Puan: gün sayaçları sayaç sayaç büyük olanı alır; toplam ve en uzun seri büyük olan; seri son aktif günü yeni olandan. */
function puanBirlestir(a?: Puan, b?: Puan): Puan {
  if (!a) return b ?? {};
  if (!b) return a;
  const gunler: Record<string, Gun> = { ...(a.gunler ?? {}) };
  for (const [g, s] of Object.entries(b.gunler ?? {})) {
    const o = { ...(gunler[g] ?? {}) } as Record<string, number>;
    for (const [k, v] of Object.entries(s as Record<string, number>)) o[k] = Math.max(o[k] ?? 0, v);
    gunler[g] = o as Gun;
  }
  const seriA = a.seriSon ?? "", seriB = b.seriSon ?? "";
  const s = seriA > seriB || (seriA === seriB && (a.seri ?? 0) >= (b.seri ?? 0)) ? a : b;
  return {
    toplam: Math.max(a.toplam ?? 0, b.toplam ?? 0),
    enUzun: Math.max(a.enUzun ?? 0, b.enUzun ?? 0),
    gunler,
    ...(s.seriSon ? { seri: s.seri, seriSon: s.seriSon } : {}),
  };
}

/** Temel yokken (bu cihaz bu hesapla ilk kez eşitleniyor): bulut (b) ile cihaz (c) birleşimi. İlerleme geri gitmez.
 *  Cihazdaki sıfırlama damgası taşınmaz: hesaba girmeden önce yapılan sıfırlama hesabı silmemeli. */
export function birlestir(b: Veri, c: Veri): Veri {
  const prog: Prog = { ...((b.prog as Prog) ?? {}), ...((c.prog as Prog) ?? {}) };
  return {
    prog,
    saved: birlesimDizi(c.saved, b.saved),
    anlamadim: birlesimDizi(c.anlamadim, b.anlamadim),
    ipucu: birlesimDizi(c.ipucu, b.ipucu),
    izlenen: birlesimDizi(c.izlenen, b.izlenen),
    ad: (c.ad as string) || (b.ad as string) || "",
    tekrar: { ...((b.tekrar as Tekrar) ?? {}), ...((c.tekrar as Tekrar) ?? {}) },
    asama: enBuyuk(b.asama as Asama, c.asama as Asama),
    unite: enBuyuk(b.unite as Unite, c.unite as Unite),
    seviye: enBuyuk(b.seviye as Seviye, c.seviye as Seviye),
    yer: { ...((b.yer as Yer) ?? {}), ...((c.yer as Yer) ?? {}) },
    puan: puanBirlestir(b.puan as Puan, c.puan as Puan),
    gorev: c.gorev ?? b.gorev ?? {},
    ...(b.sifir !== undefined ? { sifir: b.sifir } : {}),
  };
}

/** Kümeler: iki tarafta da olan ya da temelden beri bir tarafta eklenen kalır; bir tarafta silinen gider. */
function dizi3(b: unknown, c: unknown, t: unknown): string[] {
  const B = (b as string[]) ?? [], C = (c as string[]) ?? [], T = new Set((t as string[]) ?? []);
  const sB = new Set(B), sC = new Set(C);
  const kalir = (x: string) => (sB.has(x) && sC.has(x)) || (!T.has(x) && (sB.has(x) || sC.has(x)));
  return [...new Set([...C, ...B])].filter(kalir);
}

type Cakisma = (b: unknown, c: unknown) => unknown;
/** Tek değer: yalnız değişen taraf alınır; ikisi de değiştiyse çakışma kuralı. */
function deger3(b: unknown, c: unknown, t: unknown, cakisma: Cakisma) {
  if (ayni(c, t)) return b;
  if (ayni(b, t) || ayni(b, c)) return c;
  return cakisma(b, c);
}
/** Sözlük: her anahtar ayrı ayrı birleştirilir; sonucu undefined olan anahtar silinmiş sayılır. */
function sozluk3(b: unknown, c: unknown, t: unknown, cakisma: Cakisma) {
  const B = (b ?? {}) as Record<string, unknown>, C = (c ?? {}) as Record<string, unknown>, T = (t ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of new Set([...Object.keys(B), ...Object.keys(C), ...Object.keys(T)])) {
    const v = deger3(B[k], C[k], T[k], cakisma);
    if (v !== undefined) out[k] = v;
  }
  return out;
}
const cihazOnce: Cakisma = (b, c) => (c !== undefined ? c : b);
const cihazinki: Cakisma = (_b, c) => c;
const buyuk: Cakisma = (b, c) => Math.max((b as number) ?? 0, (c as number) ?? 0);

/** Bulut (b), cihaz (c) ve son eşitlenen temel (t) ile üç yönlü birleştirme. Temel yoksa birlestir. */
export function birlestir3(b: Veri, c: Veri, t: Veri | null): Veri {
  if (!t) return birlestir(b, c);
  const sB = b.sifir ?? 0, sC = c.sifir ?? 0, sT = t.sifir ?? 0;
  // Temelden beri yeni bir sıfırlama olduysa: sıfırlamanın olduğu taraf bütünüyle kazanır (ikisinde de olduysa yenisi).
  if (sB !== sT || sC !== sT) {
    if (sC === sT || (sB !== sT && (sB as number) > (sC as number))) return { ...b };
    return { ...c };
  }
  return {
    prog: sozluk3(b.prog, c.prog, t.prog, cihazOnce),
    saved: dizi3(b.saved, c.saved, t.saved),
    anlamadim: dizi3(b.anlamadim, c.anlamadim, t.anlamadim),
    ipucu: dizi3(b.ipucu, c.ipucu, t.ipucu),
    izlenen: dizi3(b.izlenen, c.izlenen, t.izlenen),
    ad: deger3(b.ad, c.ad, t.ad, (x, y) => (y as string) || (x as string) || "") ?? "",
    tekrar: sozluk3(b.tekrar, c.tekrar, t.tekrar, cihazinki),
    asama: sozluk3(b.asama, c.asama, t.asama, buyuk),
    unite: sozluk3(b.unite, c.unite, t.unite, buyuk),
    seviye: sozluk3(b.seviye, c.seviye, t.seviye, buyuk),
    yer: sozluk3(b.yer, c.yer, t.yer, cihazinki),
    puan: deger3(b.puan, c.puan, t.puan, (x, y) => puanBirlestir(x as Puan, y as Puan)) ?? {},
    gorev: deger3(b.gorev, c.gorev, t.gorev, cihazOnce) ?? {},
    ...(sB ? { sifir: sB } : {}),
  };
}
