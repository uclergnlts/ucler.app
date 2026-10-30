/** Soru metninin kısa izi (FNV-1a, 8 hane). Günün sorusunda uygulamadaki soru ile sunucunun cevap listesindeki
 *  sorunun aynı olduğunu anlamak için (app/gunsoru-cevap.json, supabase/functions/gunun-sorusu). */
export function soruIzi(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0)!, 16777619);
  return (h >>> 0).toString(16).padStart(8, "0");
}
