// Toplu kullanım verisi (ör. hangi kartlar "Bunu anlamadım" diye işaretleniyor). Kişisel bilgi gönderilmez.
// Vercel Analytics'in özel olayları ücretli planda; ücretsiz yol olarak Umami Cloud düşünülüyor.
// UMAMI_ID boşken hiçbir şey gönderilmez; doluysa app/layout.tsx Umami betiğini yükler.
export const UMAMI_ID = "";

type Umami = { track: (ad: string, veri?: Record<string, string | number>) => void };

export function olay(ad: string, veri?: Record<string, string | number>) {
  if (!UMAMI_ID) return;
  try { (window as unknown as { umami?: Umami }).umami?.track(ad, veri); } catch {}
}
