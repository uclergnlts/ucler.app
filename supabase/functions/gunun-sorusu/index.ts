// Günün sorusu cevabı. Uygulama cevabı buraya gönderir; doğru olup olmadığına sunucu karar verir, süre ve puanı
// veritabanı yazar (public.gunun_sorusu_sunucu, supabase/migrations/20261030_gunun_sorusu_sunucu.sql). Böylece
// istemcinin "doğru" demesiyle puan alınamaz. Doğru cevaplar sitenin canlı listesinden okunur (/gunsoru-cevap.json).
// Uygulamadaki soru canlı listedekiyle aynı değilse (eski uygulama sürümü) sonuç kaydedilir ama puan verilmez.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const yanit = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { ...cors, "Content-Type": "application/json" } });

type Kayit = { iz: string; tur: string; n?: number; g?: number[]; c?: number; tol?: number };
let liste: Record<string, Kayit> | null = null, alindi = 0;
async function cevaplar() {
  if (!liste || Date.now() - alindi > 10 * 60_000) {
    const r = await fetch("https://ucler.app/gunsoru-cevap.json", { headers: { "Cache-Control": "no-cache" } });
    if (!r.ok) throw new Error(`liste ${r.status}`);
    liste = await r.json();
    alindi = Date.now();
  }
  return liste!;
}

/** components/TestSoru.tsx sayiOku ile aynı: "2,5", "2.700", "103 000", "−4". */
function sayiOku(yazi: string): number {
  let s = yazi.replace(/\s/g, "").replace(/−/g, "-");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  return s === "" || s === "-" ? NaN : Number(s);
}

/** components/TestSoru.tsx dogruMu ile aynı kural. */
function dogruMu(k: Kayit, c: unknown): boolean {
  if (k.tur === "sirala" || k.tur === "eslestir") return Array.isArray(c) && c.length === k.n && c.every((x, i) => x === i);
  if (k.tur === "ayir") return Array.isArray(c) && !!k.g && c.length === k.g.length && c.every((x, i) => x === k.g![i]);
  if (k.tur === "sayi") return typeof c === "string" && Math.abs(sayiOku(c) - (k.c ?? NaN)) <= (k.tol ?? 0) + 1e-9;
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return yanit({ hata: "method" }, 405);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u, error: ue } = await db.auth.getUser(jwt);
  if (ue || !u.user) return yanit({ hata: "oturum" }, 401);
  const ben = u.user.id;
  const govde = await req.json().catch(() => ({})) as { cevap?: unknown; iz?: string; dogru?: boolean };

  const once = await db.rpc("gunun_sorusu_sunucu", { ben });
  if (once.error) return yanit({ hata: once.error.message }, 500);
  const kayit = once.data?.kayit as { soru: string; bitti: boolean } | null;
  if (!kayit || kayit.bitti) return yanit(once.data);

  let k: Kayit | undefined;
  try { k = (await cevaplar())[kayit.soru]; } catch (e) { return yanit({ hata: String(e) }, 503); }
  const ayni = !!k && k.iz === govde.iz;
  const dogru = ayni ? dogruMu(k!, govde.cevap) : !!govde.dogru;
  const son = await db.rpc("gunun_sorusu_sunucu", { ben, p_dogru: dogru, p_puanli: ayni });
  if (son.error) return yanit({ hata: son.error.message }, 500);
  return yanit(son.data);
});
