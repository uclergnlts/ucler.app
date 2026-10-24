// Seri hatırlatma e-postası. Her akşam 19:00'da (Türkiye) pg_cron çağırır: dün çalışıp bugün henüz bir şey yapmamış,
// serisi en az 2 gün olan ve hatırlatmayı kapatmamış öğrencilere Resend ile kısa bir e-posta gider.
// Aynı fonksiyon hatırlatmayı kapatma isteğini de karşılar (https://ucler.app/hatirlatma/ sayfası ve e-postadaki
// List-Unsubscribe tek tık başlığı). Gizli değerler: RESEND_API_KEY (Supabase > Edge Functions > Secrets).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SERVIS = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FONK = `${URL_}/functions/v1/seri-hatirlat`;
const SITE = "https://ucler.app";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

/** Kapatma bağlantısının imzası: kullanıcı kimliğinin servis anahtarıyla HMAC'i (ilk 32 karakter).
 *  "Tüm e-postaları kapat" bağlantısı "hepsi:" + kimlik imzalanır (hos-geldin ve yenilik-bildir de aynısını üretir). */
async function imza(id: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(SERVIS), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(id)));
  return Array.from(s, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Türkiye saatine göre YYYY-AA-GG; n gün kaydırılmış. */
function gun(n = 0) {
  const d = new Date(Date.now() + n * 864e5);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(d);
}

const kacis = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function eposta(ad: string, seri: number, kapat: string, hepsi: string) {
  const selam = ad ? `Merhaba ${kacis(ad)}, ` : "Merhaba, ";
  const yazi = `${selam}${seri} günlük serin bu gece yarısı bitiyor. Bugün tek bir kart okuman ya da bir soru çözmen yeterli, serin devam etsin.`;
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Serin bitmek üzere</title></head>
<body style="margin:0;padding:0;background:#f6f8fb;">
<div style="display:none;max-height:0;overflow:hidden;">Bugün tek bir kart yeter.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:0 4px 20px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#1d3557;">ucler<span style="color:#d63c63;">.</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e3e8ef;border-radius:16px;padding:32px 28px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;color:#1d3557;">
<p style="margin:0 0 8px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:44px;line-height:1;font-weight:800;color:#e0a400;">${seri}</p>
<p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#64748b;">günlük seri</p>
<h1 style="margin:0 0 12px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;font-weight:800;color:#1d3557;">Serin bitmek üzere</h1>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#334155;">${yazi}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:12px;background:#1d3557;">
<a href="${SITE}/" style="display:inline-block;padding:14px 26px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">Seriyi sürdür</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#64748b;">Bu e-postayı ucler.app hesabındaki seri hatırlatması için gönderdik. İstemiyorsan <a href="${kapat}" style="color:#475569;font-weight:700;">hatırlatmaları kapat</a> ya da <a href="${hepsi}" style="color:#475569;font-weight:700;">tüm e-postalardan çık</a>.</td></tr>
</table></td></tr></table>
</body></html>`;
  const text = `${selam}${seri} günlük serin bu gece yarısı bitiyor. Bugün tek bir kart okuman ya da bir soru çözmen yeterli.\n\nSeriyi sürdür: ${SITE}/\n\nHatırlatmaları kapat: ${kapat}\nTüm e-postalardan çık: ${hepsi}`;
  return { html, text };
}

/** deneme: tek bir kullanıcıya koşullara bakmadan gönderir (yalnızca zamanlanmış görevin anahtarıyla). */
async function gonder(deneme?: string) {
  const anahtar = Deno.env.get("RESEND_API_KEY");
  if (!anahtar) return json({ hata: "RESEND_API_KEY yok" }, 500);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const bugun = gun(), dun = gun(-1);
  const sorgu = db.from("ilerleme").select("user_id, ad, veri->puan->seri");
  const { data, error } = deneme
    ? await sorgu.eq("user_id", deneme)
    : await sorgu.eq("seri_hatirlat", true).eq("veri->puan->>seriSon", dun).or(`son_hatirlatma.is.null,son_hatirlatma.lt.${bugun}`);
  if (error) return json({ hata: error.message }, 500);
  let giden = 0;
  const hatalar: string[] = [];
  for (const r of data ?? []) {
    const seri = deneme ? Math.max(Number(r.seri ?? 0), 2) : Number(r.seri ?? 0);
    if (seri < 2) continue;
    const { data: k } = await db.auth.admin.getUserById(r.user_id);
    const e = k?.user?.email;
    if (!e || !k.user.email_confirmed_at) continue;
    const kapat = `${SITE}/hatirlatma/?u=${r.user_id}&t=${await imza(r.user_id)}`;
    const tek = `${FONK}?u=${r.user_id}&t=${await imza(r.user_id)}`;
    const hepsi = `${SITE}/hatirlatma/?tur=hepsi&u=${r.user_id}&t=${await imza(`hepsi:${r.user_id}`)}`;
    const { html, text } = eposta(r.ad || (k.user.user_metadata?.ad ?? ""), seri, kapat, hepsi);
    const yanit = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "ucler <noreply@ucler.app>",
        to: [e],
        subject: `${seri} günlük serin bu gece bitiyor`,
        html, text,
        headers: { "List-Unsubscribe": `<${tek}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      }),
    });
    if (yanit.ok) {
      giden++;
      if (!deneme) await db.from("ilerleme").update({ son_hatirlatma: bugun }).eq("user_id", r.user_id);
    } else hatalar.push(`${yanit.status}`);
    await new Promise((s) => setTimeout(s, 600)); // Resend ücretsiz plan: saniyede en çok 2 istek.
  }
  return json({ aday: data?.length ?? 0, giden, hatalar });
}

/** hepsi: "tüm e-postalardan çık" (seri hatırlatması + yeni içerik); tüm e-postalardaki bu bağlantı buraya gelir. */
async function kapat(u: string | null, t: string | null, hepsi = false) {
  if (!u || !t || t !== (await imza(hepsi ? `hepsi:${u}` : u))) return json({ hata: "baglanti" }, 400);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const { error } = await db.from("ilerleme").update(hepsi ? { seri_hatirlat: false, yenilik_bildir: false } : { seri_hatirlat: false }).eq("user_id", u);
  return error ? json({ hata: error.message }, 500) : json({ tamam: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ hata: "method" }, 405);
  const q = new URL(req.url).searchParams;
  // E-posta programının "abonelikten çık" düğmesi (tek tık) ya da ucler.app/hatirlatma/ sayfası.
  if (q.get("u")) return kapat(q.get("u"), q.get("t"), q.get("hepsi") === "1");
  const govde = await req.json().catch(() => ({}));
  if (govde.u) return kapat(govde.u, govde.t, govde.hepsi === true);
  // Zamanlanmış görev: anahtar veritabanındaki ozel.ayar tablosundakiyle aynı olmalı.
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const { data: dogru } = await db.rpc("seri_cron_dogrula", { anahtar: req.headers.get("x-cron-anahtar") ?? "" });
  if (dogru !== true) return json({ hata: "yetki" }, 401);
  return gonder(govde.deneme);
});
