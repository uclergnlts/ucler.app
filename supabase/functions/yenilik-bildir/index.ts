// Yeni içerik e-postası. Her gün 12:00'de (Türkiye) pg_cron çağırır: https://ucler.app/yenilikler.json listesinde
// daha önce duyurulmamış ders, konu ya da video varsa, bildirimi açık ve e-postası onaylı hesaplara tek bir e-posta gider.
// Duyurulanlar public.duyurulan tablosunda tutulur; tablo boşsa (ilk çalışma) bugünkü içerik e-posta göndermeden kaydedilir.
// Gönderilemeyen e-postalar ertesi çalışmada yeniden denenir (duyuru_teslim, alıcı bazında).
// Kapatma: e-postadaki List-Unsubscribe tek tık başlığı ve https://ucler.app/hatirlatma/?tur=yenilik sayfası.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SERVIS = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FONK = `${URL_}/functions/v1/yenilik-bildir`;
const SITE = "https://ucler.app";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

type Oge = { id: string; tur: "ders" | "konu" | "video"; ad: string; ders?: string; yol: string };
const TUR: Record<Oge["tur"], string> = { ders: "Yeni ders", konu: "Yeni konu", video: "Yeni video" };

/** Kapatma bağlantısının imzası: "yenilik:" ("tüm e-postalardan çık" için "hepsi:", seri-hatirlat doğrular) + kullanıcı kimliğinin servis anahtarıyla HMAC'i (ilk 32 karakter). */
async function imza(id: string, on = "yenilik") {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(SERVIS), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`${on}:${id}`)));
  return Array.from(s, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const kacis = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function konuBasligi(yeni: Oge[]) {
  if (yeni.length === 1) return `${TUR[yeni[0].tur]}: ${yeni[0].ad}`;
  return `ucler'de ${yeni.length} yenilik var`;
}

function eposta(ad: string, yeni: Oge[], kapat: string, hepsi: string) {
  const selam = ad ? `Merhaba ${kacis(ad)}, ` : "Merhaba, ";
  const goster = yeni.slice(0, 8), kalan = yeni.length - goster.length;
  const satirlar = goster.map((o) => `<tr><td style="padding:14px 0;border-top:1px solid #e3e8ef;">
<p style="margin:0 0 2px;font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#64748b;">${TUR[o.tur]}${o.ders ? ` · ${kacis(o.ders)}` : ""}</p>
<a href="${SITE}${o.yol}" style="font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;color:#1d3557;text-decoration:none;">${kacis(o.ad)}</a>
</td></tr>`).join("\n");
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>ucler'de yeni</title></head>
<body style="margin:0;padding:0;background:#f6f8fb;">
<div style="display:none;max-height:0;overflow:hidden;">${kacis(goster.map((o) => o.ad).join(", "))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:0 4px 20px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#1d3557;">ucler<span style="color:#d63c63;">.</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e3e8ef;border-radius:16px;padding:32px 28px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;color:#1d3557;">
<h1 style="margin:0 0 12px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;font-weight:800;color:#1d3557;">ucler'de yeni ne var?</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155;">${selam}${yeni.length === 1 ? "yeni bir içerik ekledik." : "yeni içerikler ekledik."} Hemen göz at.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${satirlar}</table>
${kalan > 0 ? `<p style="margin:8px 0 0;font-size:14px;color:#64748b;">ve ${kalan} yenilik daha.</p>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="border-radius:12px;background:#1d3557;">
<a href="${SITE}${goster[0].yol}" style="display:inline-block;padding:14px 26px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">Göz at</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#64748b;">Bu e-postayı ucler.app hesabındaki yeni içerik bildirimi için gönderdik. İstemiyorsan <a href="${kapat}" style="color:#475569;font-weight:700;">bu bildirimleri kapat</a> ya da <a href="${hepsi}" style="color:#475569;font-weight:700;">tüm e-postalardan çık</a>.</td></tr>
</table></td></tr></table>
</body></html>`;
  const text = `${selam}ucler'de yeni içerik var:\n\n${goster.map((o) => `${TUR[o.tur]}: ${o.ad}\n${SITE}${o.yol}`).join("\n\n")}${kalan > 0 ? `\n\nve ${kalan} yenilik daha.` : ""}\n\nBu bildirimleri kapat: ${kapat}\nTüm e-postalardan çık: ${hepsi}`;
  return { html, text };
}

/** deneme: tek bir kullanıcıya, verilen içerik kimlikleriyle (yoksa son 3 içerikle) gönderir; hiçbir şey kaydetmez.
 *  Normal çalışma: yeni içerik "duyurulan" tablosuna tamam=false yazılır. Her alıcıya bekleyen içerikler tek e-postada
 *  gider; Resend kabul ettikçe alıcı-içerik çifti "duyuru_teslim"e yazılır. Gönderilemeyenler bir sonraki çalışmada
 *  yeniden denenir; teslim kaydı olan kişiye aynı içerik bir daha gitmez. Herkese giden içerik tamam=true olur. */
async function gonder(deneme?: { kullanici: string; ogeler?: string[] }) {
  const anahtar = Deno.env.get("RESEND_API_KEY");
  if (!anahtar) return json({ hata: "RESEND_API_KEY yok" }, 500);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const liste: Oge[] = await fetch(`${SITE}/yenilikler.json`).then((r) => r.json());
  let bekleyen: Oge[];
  let teslim = new Set<string>(); // "kullanici|oge"
  if (deneme) {
    bekleyen = deneme.ogeler?.length ? liste.filter((o) => deneme.ogeler!.includes(o.id)) : liste.slice(-3);
  } else {
    const { data: eski, error } = await db.from("duyurulan").select("id, tamam");
    if (error) return json({ hata: error.message }, 500);
    const bilinen = new Set((eski ?? []).map((r) => r.id));
    const yeni = liste.filter((o) => !bilinen.has(o.id));
    if (yeni.length) {
      // İlk çalışmada bugünkü içerik duyurulmadan "tamam" kaydedilir.
      const ilk = !bilinen.size;
      const { error: e2 } = await db.from("duyurulan").insert(yeni.map(({ id, tur, ad }) => ({ id, tur, ad, tamam: ilk })));
      if (e2) return json({ hata: e2.message }, 500);
      if (ilk) return json({ ilk: true, kaydedilen: yeni.length });
    }
    const acik = new Set([...(eski ?? []).filter((r) => r.tamam === false).map((r) => r.id), ...yeni.map((o) => o.id)]);
    bekleyen = liste.filter((o) => acik.has(o.id));
    // Listeden kalkmış (siteden çıkarılmış) bekleyen içerik artık duyurulmaz.
    const kalkan = [...acik].filter((id) => !bekleyen.some((o) => o.id === id));
    if (kalkan.length) await db.from("duyurulan").update({ tamam: true }).in("id", kalkan);
    if (!bekleyen.length) return json({ yeni: 0 });
    const { data: t, error: e3 } = await db.from("duyuru_teslim").select("user_id, oge_id").in("oge_id", bekleyen.map((o) => o.id));
    if (e3) return json({ hata: e3.message }, 500);
    teslim = new Set((t ?? []).map((r) => `${r.user_id}|${r.oge_id}`));
  }
  if (!bekleyen.length) return json({ yeni: 0 });
  // Önce dersler, sonra konular, en son videolar.
  bekleyen.sort((a, b) => ["ders", "konu", "video"].indexOf(a.tur) - ["ders", "konu", "video"].indexOf(b.tur));

  const sorgu = db.from("ilerleme").select("user_id, ad");
  const { data: kisiler, error } = deneme ? await sorgu.eq("user_id", deneme.kullanici) : await sorgu.eq("yenilik_bildir", true);
  if (error) return json({ hata: error.message }, 500);
  const postalar: { posta: Record<string, unknown>; kisi: string; ogeler: string[] }[] = [];
  for (const r of kisiler ?? []) {
    const ona = bekleyen.filter((o) => !teslim.has(`${r.user_id}|${o.id}`));
    if (!ona.length) continue;
    const { data: k } = await db.auth.admin.getUserById(r.user_id);
    const e = k?.user?.email;
    if (!e || !k.user.email_confirmed_at) continue;
    const t = await imza(r.user_id);
    const { html, text } = eposta(r.ad || (k.user.user_metadata?.ad ?? ""), ona, `${SITE}/hatirlatma/?tur=yenilik&u=${r.user_id}&t=${t}`,
      `${SITE}/hatirlatma/?tur=hepsi&u=${r.user_id}&t=${await imza(r.user_id, "hepsi")}`);
    postalar.push({
      kisi: r.user_id,
      ogeler: ona.map((o) => o.id),
      posta: {
        from: "ucler <noreply@ucler.app>", to: [e], subject: konuBasligi(ona), html, text,
        headers: { "List-Unsubscribe": `<${FONK}?u=${r.user_id}&t=${t}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      },
    });
  }
  // Resend toplu gönderim: tek istekte en çok 100 e-posta; istek ya bütünüyle kabul edilir ya da hiç.
  let giden = 0;
  const hatalar: string[] = [];
  for (let i = 0; i < postalar.length; i += 100) {
    const parca = postalar.slice(i, i + 100);
    const y = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json" },
      body: JSON.stringify(parca.map((p) => p.posta)),
    }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
    if (y.ok) {
      giden += parca.length;
      if (!deneme) {
        const satirlar = parca.flatMap((p) => p.ogeler.map((oge_id) => ({ user_id: p.kisi, oge_id })));
        const { error: e4 } = await db.from("duyuru_teslim").upsert(satirlar, { ignoreDuplicates: true });
        if (e4) hatalar.push(`teslim kaydı: ${e4.message}`);
        else satirlar.forEach((r) => teslim.add(`${r.user_id}|${r.oge_id}`));
      }
    } else hatalar.push(`${y.status} ${(await y.text()).slice(0, 200)}`);
    await new Promise((s) => setTimeout(s, 600));
  }
  // Hiç hata yoksa bekleyen içerik herkese ulaştı: kapat ve teslim kayıtlarını temizle.
  if (!deneme && !hatalar.length) {
    const ids = bekleyen.map((o) => o.id);
    await db.from("duyurulan").update({ tamam: true }).in("id", ids);
    await db.from("duyuru_teslim").delete().in("oge_id", ids);
  }
  return json({ yeni: bekleyen.map((o) => o.id), giden, hatalar, bekliyor: !deneme && hatalar.length > 0 });
}

async function kapat(u: string | null, t: string | null) {
  if (!u || !t || t !== (await imza(u))) return json({ hata: "baglanti" }, 400);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const { error } = await db.from("ilerleme").update({ yenilik_bildir: false }).eq("user_id", u);
  return error ? json({ hata: error.message }, 500) : json({ tamam: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ hata: "method" }, 405);
  const q = new URL(req.url).searchParams;
  // E-posta programının "abonelikten çık" düğmesi (tek tık) ya da ucler.app/hatirlatma/ sayfası.
  if (q.get("u")) return kapat(q.get("u"), q.get("t"));
  const govde = await req.json().catch(() => ({}));
  if (govde.u) return kapat(govde.u, govde.t);
  // Zamanlanmış görev: seri hatırlatmasıyla aynı anahtar (ozel.ayar 'seri_cron').
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const { data: dogru } = await db.rpc("seri_cron_dogrula", { anahtar: req.headers.get("x-cron-anahtar") ?? "" });
  if (dogru !== true) return json({ hata: "yetki" }, 401);
  return gonder(govde.deneme);
});
