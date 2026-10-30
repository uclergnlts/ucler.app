// Günün sorusu havuzunun doğru cevapları. Cevabı sunucu kontrol eder (supabase/functions/gunun-sorusu); fonksiyon bu
// listeyi sitenin canlı sürümünden okur, böylece içerik değişince ayrıca SQL çalıştırmak gerekmez.
// iz: soru metninin izi; uygulamadaki içerik eskiyse (soru sırası değişmişse) sunucu bunu fark eder.
import { gunSorusuHavuzu } from "@/lib/content";
import { soruIzi } from "@/lib/iz";

export const dynamic = "force-static";

export function GET() {
  const out: Record<string, { iz: string; tur: string; n?: number; g?: number[]; c?: number; tol?: number }> = {};
  for (const [key, q] of Object.entries(gunSorusuHavuzu())) {
    const iz = soruIzi(q.q);
    if (q.tur === "sirala") out[key] = { iz, tur: q.tur, n: q.ogeler.length };
    else if (q.tur === "eslestir") out[key] = { iz, tur: q.tur, n: q.ciftler.length };
    else if (q.tur === "ayir") out[key] = { iz, tur: q.tur, g: q.ogeler.map((o) => o[1]) };
    else if (q.tur === "sayi") out[key] = { iz, tur: q.tur, c: q.cevap, tol: q.tolerans ?? 0 };
  }
  return Response.json(out);
}
