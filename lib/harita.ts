// Ders sayfası: ön koşullara (content/dersler.json "on") göre konuların durumu ve sıradaki konu.
// Kilit yumuşaktır: ön koşulu bitmemiş konu kilitli görünür ama öğrenci isterse yine de açabilir.
import type { Entry } from "./dersler";
import type { Prog } from "./store";

export type Durum = "bitti" | "acik" | "kilitli";

/** Ön koşullarının hepsi bitmişse konu açıktır. */
export function durumlar(ders: string, list: Entry[], prog: Prog): Record<string, Durum> {
  const out: Record<string, Durum> = {};
  for (const e of list) {
    if (!e.id) continue;
    out[e.id] = prog[`${ders}.${e.id}`] ? "bitti" : (e.on ?? []).every((o) => prog[`${ders}.${o}`]) ? "acik" : "kilitli";
  }
  return out;
}

/** Sıradaki konu: listede bitmemiş ilk açık konu. */
export const siradaki = (list: Entry[], d: Record<string, Durum>) => list.find((e) => e.id && d[e.id] === "acik")?.id;
