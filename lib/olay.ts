// Toplu kullanım verisi (ör. hangi kartlar "Bunu anlamadım" diye işaretleniyor). Kişisel bilgi gönderilmez.
// Umami Cloud (ücretsiz): panel https://cloud.umami.is, olaylar "Events" sekmesinde.
// UMAMI_ID boşken hiçbir şey gönderilmez; doluysa app/layout.tsx Umami betiğini yükler.
export const UMAMI_ID = "62a66252-cdbb-4b30-a6a8-400146fa2e6a";

type Umami = { track: (ad: string, veri?: Record<string, string | number>) => void };

export function olay(ad: string, veri?: Record<string, string | number>) {
  if (!UMAMI_ID) return;
  try { (window as unknown as { umami?: Umami }).umami?.track(ad, veri); } catch {}
}
