// Sitede hazır olan dersler, konular ve videolar. Yeni içerik e-postası (supabase/functions/yenilik-bildir) bu listeyi
// her gün okur; daha önce duyurulmamış bir kimlik görürse hesaplara bildirir.
import { allEntries, DERS_IDS, DERSLER } from "@/lib/content";
import { VIDEOLAR } from "@/lib/videolar";

export const dynamic = "force-static";

export function GET() {
  const tum = allEntries();
  const ogeler = [
    ...DERS_IDS.map((d) => ({ id: `ders:${d}`, tur: "ders", ad: DERSLER[d].ad, yol: `/${d}/` })),
    ...DERS_IDS.flatMap((d) => tum[d].filter((e) => e.id && e.title).map((e) => ({ id: `konu:${d}/${e.id}`, tur: "konu", ad: e.title!, ders: DERSLER[d].ad, yol: `/${d}/${e.id}/` }))),
    ...VIDEOLAR.map((v) => ({ id: `video:${v.id}`, tur: "video", ad: v.baslik, yol: `/videolar/#${v.id}` })),
  ];
  return Response.json(ogeler);
}
