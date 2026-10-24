// Hoş geldin e-postası. pg_cron 10 dakikada bir çağırır: e-postası onaylanmış (Google ile girenler dahil) ve henüz
// karşılanmamış yeni hesaplara bir kez teşekkür + ucler'in ne olduğu + sıradaki özellikler e-postası gider.
// Gönderilenler public.hos_geldin tablosuna yazılır; aynı kişiye ikinci kez gitmez. Altındaki "tüm e-postalardan çık" bağlantısı
// ve List-Unsubscribe başlığı seri-hatirlat fonksiyonuna gider (seri hatırlatması + yeni içerik e-postalarını kapatır).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SERVIS = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://ucler.app";
const INSTAGRAM = "https://www.instagram.com/ucler.app/";
const CIK = `${URL_}/functions/v1/seri-hatirlat`;
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

/** "Tüm e-postalardan çık" imzası: "hepsi:" + kimliğin servis anahtarıyla HMAC'i (seri-hatirlat doğrular). */
async function imza(id: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(SERVIS), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`hepsi:${id}`)));
  return Array.from(s, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const kacis = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const NE: [string, string][] = [
  ["Kısa kartlar", "Her kartta tek fikir, sade bir dille. Konu en temelden başlar, yarım bırakılmaz."],
  ["Dokunarak öğrenme", "Adım adım kendin dener, sonucu anında görürsün."],
  ["Kısa videolar", "Zor yerleri bir iki dakikada, görerek anlarsın."],
  ["Konu sonu testi", "Neyi anladığını, neye tekrar bakman gerektiğini hemen görürsün."],
];
const SIRADA = [
  "Matematik, Tarih ve Coğrafya dersleri",
  "iPhone ve Android uygulaması",
  "Her hafta yeni konular ve videolar",
];

function eposta(ad: string, konu: number, ders: string[], cik: string) {
  const selam = ad ? `Merhaba ${kacis(ad)},` : "Merhaba,";
  const bugun = konu && ders.length ? `Şu an ${ders.join(", ").replace(/, ([^,]*)$/, " ve $1")} derslerinde ${konu} konu seni bekliyor.` : "";
  const madde = (b: string, a: string) => `<tr><td style="padding:12px 0;border-top:1px solid #e3e8ef;">
<p style="margin:0 0 2px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#1d3557;">${b}</p>
<p style="margin:0;font-size:15px;line-height:1.5;color:#475569;">${a}</p></td></tr>`;
  const h2 = (s: string) => `<h2 style="margin:28px 0 4px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#64748b;">${s}</h2>`;
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>ucler'e hoş geldin</title></head>
<body style="margin:0;padding:0;background:#f6f8fb;">
<div style="display:none;max-height:0;overflow:hidden;">Katıldığın için teşekkürler. ucler'i nasıl kullanacağın ve sırada neler olduğu.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:0 4px 20px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#1d3557;">ucler<span style="color:#d63c63;">.</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e3e8ef;border-radius:16px;padding:32px 28px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;color:#1d3557;">
<h1 style="margin:0 0 12px;font-family:Manrope,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;font-weight:800;color:#1d3557;">Aramıza hoş geldin</h1>
<p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#334155;">${selam} ucler'e katıldığın için teşekkür ederiz.</p>
<p style="margin:0;font-size:16px;line-height:1.6;color:#334155;">Hesabın hazır. İlerlemen, serin ve kaydettiğin kartlar artık hangi cihazdan girersen gir seninle.</p>
${h2("ucler nedir?")}
<p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#334155;">Konuları ezberletmek yerine anlatan bir öğrenme uygulaması. ${bugun}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${NE.map(([b, a]) => madde(b, a)).join("\n")}</table>
${h2("Sırada ne var?")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${SIRADA.map((s) => `<tr><td style="padding:6px 0;font-size:15px;line-height:1.5;color:#334155;">— ${s}</td></tr>`).join("\n")}</table>
<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#475569;">Yeni bir ders ya da video eklendiğinde sana kısa bir e-postayla haber vereceğiz.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="border-radius:12px;background:#1d3557;">
<a href="${SITE}/" style="display:inline-block;padding:14px 26px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">Öğrenmeye başla</a>
</td></tr></table>
<p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#475569;">Bir önerin ya da takıldığın bir yer olursa Instagram'da <a href="${INSTAGRAM}" style="color:#1d3557;font-weight:700;">@ucler.app</a> hesabına yazabilirsin. Her mesajı okuyoruz.</p>
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#64748b;">Bu e-postayı ucler.app'te hesap açtığın için bir kez gönderdik. Bizden hiç e-posta almak istemiyorsan <a href="${cik}" style="color:#475569;font-weight:700;">tüm e-postalardan çık</a>.</td></tr>
</table></td></tr></table>
</body></html>`;
  const text = `${ad ? `Merhaba ${ad},` : "Merhaba,"} ucler'e katıldığın için teşekkür ederiz.

Hesabın hazır. İlerlemen, serin ve kaydettiğin kartlar artık hangi cihazdan girersen gir seninle.

UCLER NEDİR?
Konuları ezberletmek yerine anlatan bir öğrenme uygulaması. ${bugun}
${NE.map(([b, a]) => `- ${b}: ${a}`).join("\n")}

SIRADA NE VAR?
${SIRADA.map((s) => `- ${s}`).join("\n")}
Yeni bir ders ya da video eklendiğinde sana kısa bir e-postayla haber vereceğiz.

Öğrenmeye başla: ${SITE}/

Bir önerin ya da takıldığın bir yer olursa Instagram'da @ucler.app hesabına yazabilirsin: ${INSTAGRAM}

Bu e-postayı ucler.app'te hesap açtığın için bir kez gönderdik.
Tüm e-postalardan çık: ${cik}`;
  return { html, text };
}

/** Ad: profildeki ad, yoksa kayıttaki ad, yoksa Google'daki adın ilk kelimesi. */
function adBul(m: Record<string, unknown> | undefined, profil?: string | null) {
  const a = (profil || m?.ad || m?.given_name || m?.full_name || m?.name || "") as string;
  return a.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
}

/** deneme: verilen kullanıcıya gönderir, hiçbir şey kaydetmez. Normal çalışma: bekleyen herkese bir kez. */
async function gonder(deneme?: string) {
  const anahtar = Deno.env.get("RESEND_API_KEY");
  if (!anahtar) return json({ hata: "RESEND_API_KEY yok" }, 500);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  let kimler: string[];
  if (deneme) kimler = [deneme];
  else {
    const { data, error } = await db.rpc("hos_geldin_bekleyen");
    if (error) return json({ hata: error.message }, 500);
    kimler = (data ?? []).map((r: { user_id: string }) => r.user_id);
  }
  if (!kimler.length) return json({ bekleyen: 0 });

  // Bugünkü konu sayısı ve dersler sitenin yenilik listesinden (yenilik-bildir ile aynı kaynak).
  let konu = 0, ders: string[] = [];
  try {
    const liste: { tur: string; ad: string }[] = await fetch(`${SITE}/yenilikler.json`).then((r) => r.json());
    konu = liste.filter((o) => o.tur === "konu").length;
    ders = liste.filter((o) => o.tur === "ders").map((o) => o.ad);
  } catch { /* sayı olmadan da gönderilir */ }

  const { data: profiller } = await db.from("ilerleme").select("user_id, ad").in("user_id", kimler);
  const postalar: { kisi: string; posta: Record<string, unknown> }[] = [];
  for (const id of kimler) {
    const { data: k } = await db.auth.admin.getUserById(id);
    const e = k?.user?.email;
    if (!e || !k.user.email_confirmed_at) continue;
    const t = await imza(id);
    const { html, text } = eposta(adBul(k.user.user_metadata, profiller?.find((p) => p.user_id === id)?.ad), konu, ders, `${SITE}/hatirlatma/?tur=hepsi&u=${id}&t=${t}`);
    postalar.push({ kisi: id, posta: {
      from: "ucler <noreply@ucler.app>", to: [e], subject: "ucler'e hoş geldin", html, text,
      headers: { "List-Unsubscribe": `<${CIK}?hepsi=1&u=${id}&t=${t}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    } });
  }
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
        const { error } = await db.from("hos_geldin").upsert(parca.map((p) => ({ user_id: p.kisi })), { ignoreDuplicates: true });
        if (error) hatalar.push(`kayıt: ${error.message}`);
      }
    } else hatalar.push(`${y.status} ${(await y.text()).slice(0, 200)}`);
    await new Promise((s) => setTimeout(s, 600));
  }
  return json({ bekleyen: kimler.length, giden, hatalar });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ hata: "method" }, 405);
  // Zamanlanmış görev: seri hatırlatmasıyla aynı anahtar (ozel.ayar 'seri_cron').
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  const { data: dogru } = await db.rpc("seri_cron_dogrula", { anahtar: req.headers.get("x-cron-anahtar") ?? "" });
  if (dogru !== true) return json({ hata: "yetki" }, 401);
  const govde = await req.json().catch(() => ({}));
  return gonder(govde.deneme);
});
