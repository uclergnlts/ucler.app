// RevenueCat webhook'u: abonelik olaylarını public.abonelik tablosuna yazar (supabase/migrations/20261024_abonelik.sql).
// RevenueCat > Integrations > Webhooks: adres .../functions/v1/revenuecat, Authorization başlığı "Bearer <anahtar>"
// (anahtar ozel.ayar 'revenuecat_anahtar'). JWT doğrulaması kapalı yayımlanır (RevenueCat Supabase oturumu taşımaz);
// yerine bu başlık doğrulanır.
// Uygulama, giriş yapmış öğrenciyi RevenueCat'e Supabase kullanıcı kimliğiyle tanıtır (lib/abonelik.ts); kimliği uuid
// olmayan (hesapsız) satın almalar tabloya yazılmaz, uygulama onları doğrudan RevenueCat'ten okur.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const PLUS = "plus";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const yanit = (govde: unknown, status = 200) => new Response(JSON.stringify(govde), { status, headers: { "Content-Type": "application/json" } });

type Olay = {
  id?: string; type?: string; app_user_id?: string; original_app_user_id?: string; aliases?: string[];
  transferred_from?: string[]; transferred_to?: string[]; entitlement_ids?: string[] | null;
  expiration_at_ms?: number | null; event_timestamp_ms?: number; product_id?: string; store?: string;
  environment?: string; period_type?: string;
};
const kimlikler = (l: (string | undefined)[]) => [...new Set(l.filter((x): x is string => !!x && UUID.test(x)))];

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return yanit({ hata: "method" }, 405);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: anahtar } = await db.rpc("revenuecat_anahtar");
  if (!anahtar || req.headers.get("Authorization") !== `Bearer ${anahtar}`) return yanit({ hata: "yetki" }, 401);

  const e = ((await req.json().catch(() => null)) as { event?: Olay } | null)?.event;
  if (!e?.id || !e.type) return yanit({ hata: "olay" }, 400);
  // RevenueCat aynı olayı yeniden gönderebilir. Olay önce kimliğiyle ozel.abonelik_olay'a alınır (tek SQL ifadesi,
  // aynı anda gelen iki teslimden yalnız biri alır); daha önce işlenmiş olay yeniden işlenmez. İşleme yarıda kalırsa
  // kayıt bırakılır ve 500 döner, RevenueCat bir süre sonra yeniden dener.
  const { data: al, error: alHata } = await db.rpc("abonelik_olay_al", { p_id: e.id, p_tur: e.type, p_kullanici: e.app_user_id ?? null, p_govde: e });
  if (alHata) return yanit({ hata: alHata.message }, 500);
  if (al !== true) return yanit({ tamam: true, atlandi: "tekrar" });
  try {
    const sonuc = await isle(db, e);
    const { error } = await db.rpc("abonelik_olay_bitti", { p_id: e.id });
    if (error) throw error;
    return yanit({ tamam: true, ...sonuc });
  } catch (h) {
    await db.rpc("abonelik_olay_birak", { p_id: e.id });
    return yanit({ hata: String((h as Error)?.message ?? h) }, 500);
  }
});

// deno-lint-ignore no-explicit-any
async function isle(db: any, e: Olay): Promise<Record<string, unknown>> {
  if (e.type === "TEST") return {};

  const zaman = new Date(e.event_timestamp_ms ?? Date.now()).toISOString();
  const bitis = e.expiration_at_ms ? new Date(e.expiration_at_ms).toISOString() : null;

  // Aktarma: satın alma başka bir kullanıcıya geçti (ör. aynı mağaza hesabıyla başka ucler hesabında geri yüklendi).
  // Yeni hesabın Plus'ı mümkünse RevenueCat'in güncel kaydından okunur (gizli API anahtarı ozel.ayar 'revenuecat_api');
  // anahtar yoksa eski hesabın satırı kopyalanır. Daha önce aktarılarak kapanmış satır (son_olay TRANSFER) kaynak sayılmaz:
  // onun bitişi aktarma anıdır, abonelik değildir.
  if (e.type === "TRANSFER") {
    const eski = kimlikler(e.transferred_from ?? []), yeniK = kimlikler(e.transferred_to ?? []);
    let satir: Record<string, unknown> | null = null;
    if (eski.length) {
      const { data, error } = await db.from("abonelik").select("*").in("user_id", eski).or("son_olay.is.null,son_olay.neq.TRANSFER")
        .order("bitis", { ascending: false, nullsFirst: true }).limit(1).maybeSingle();
      if (error) throw error;
      satir = data;
    }
    const api = await apiAnahtari(db);
    for (const id of yeniK) {
      const guncel = api ? await rcPlus(api, id) : undefined;
      if (guncel) await yaz(db, id, guncel, e.type, zaman);
      else if (satir) await yaz(db, id, { bitis: satir.bitis, iptal: satir.iptal, urun: satir.urun, magaza: satir.magaza, ortam: satir.ortam, donem: satir.donem }, e.type, zaman);
    }
    if (eski.length) {
      const { error } = await db.from("abonelik").update({ bitis: zaman, son_olay: e.type, olay_zamani: zaman, guncellendi: new Date().toISOString() })
        .in("user_id", eski).or(`olay_zamani.is.null,olay_zamani.lt."${zaman}"`);
      if (error) throw error;
    }
    return {};
  }

  // Yalnızca Plus yetkisini ilgilendiren olaylar (yetki listesi olmayan olaylar da kabul edilir).
  if (e.entitlement_ids && !e.entitlement_ids.includes(PLUS)) return { atlandi: "yetki" };
  const hedef = kimlikler([e.app_user_id, e.original_app_user_id, ...(e.aliases ?? [])]);
  if (!hedef.length) return { atlandi: "hesapsiz" };

  const alan: Record<string, unknown> = { urun: e.product_id ?? null, magaza: e.store ?? null, ortam: e.environment ?? null, donem: e.period_type ?? null };
  switch (e.type) {
    case "INITIAL_PURCHASE": case "RENEWAL": case "UNCANCELLATION": case "PRODUCT_CHANGE":
    case "NON_RENEWING_PURCHASE": case "SUBSCRIPTION_EXTENDED": case "TEMPORARY_ENTITLEMENT_GRANT":
      Object.assign(alan, { bitis, iptal: false }); break;
    case "CANCELLATION": // yenileme kapatıldı (ya da iade): Plus bitis'e kadar sürer
      Object.assign(alan, { iptal: true }, bitis ? { bitis } : {}); break;
    case "EXPIRATION":
      Object.assign(alan, { bitis: bitis ?? zaman, iptal: true }); break;
    case "BILLING_ISSUE": // ödeme alınamadı; mağazanın ek süresi bitis'e yansır
      if (bitis) alan.bitis = bitis; break;
    default:
      return { atlandi: e.type };
  }
  for (const id of hedef) await yaz(db, id, alan, e.type!, zaman);
  return {};
}

// deno-lint-ignore no-explicit-any
async function yaz(db: any, id: string, alan: Record<string, unknown>, tur: string, zaman: string) {
  const { data: var_, error: okuma } = await db.from("abonelik").select("olay_zamani").eq("user_id", id).maybeSingle();
  if (okuma) throw okuma;
  // Aynı ya da daha yeni bir olay işlenmişse eskisi onu ezmez (sırası karışan teslimler).
  if (var_?.olay_zamani && Date.parse(var_.olay_zamani) >= Date.parse(zaman)) return;
  const { error } = await db.from("abonelik").upsert({ user_id: id, ...alan, son_olay: tur, olay_zamani: zaman, guncellendi: new Date().toISOString() });
  // 23503: bu kimlikte bir hesap yok (silinmiş). Satır yazılmaz, olay yine işlenmiş sayılır.
  if (error && error.code !== "23503") throw error;
}

// deno-lint-ignore no-explicit-any
async function apiAnahtari(db: any): Promise<string | null> {
  const { data, error } = await db.rpc("revenuecat_api_anahtari");
  if (error) return null; // fonksiyon henüz kurulmadıysa kopyalamaya düşülür
  return typeof data === "string" && data ? data : null;
}

/** RevenueCat'te bu kullanıcının güncel Plus yetkisi; okunamazsa undefined. Yetki yoksa bitişi şimdi olan kapalı satır. */
async function rcPlus(api: string, id: string): Promise<Record<string, unknown> | undefined> {
  const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${api}` } });
  if (!r.ok) throw new Error(`RevenueCat ${r.status}`);
  const abone = (await r.json())?.subscriber;
  const y = abone?.entitlements?.[PLUS];
  if (!y) return { bitis: new Date().toISOString(), iptal: true };
  const urun = y.product_identifier ?? null, ab = urun ? abone?.subscriptions?.[urun] : null;
  return {
    bitis: y.expires_date ?? null,
    iptal: !!ab?.unsubscribe_detected_at,
    urun, magaza: ab?.store ?? null, ortam: ab?.is_sandbox ? "SANDBOX" : ab ? "PRODUCTION" : null, donem: ab?.period_type?.toUpperCase?.() ?? null,
  };
}
