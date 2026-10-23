// Öğrenci bildirimlerinin günlük özeti. Her gün 09:00'da (Türkiye) pg_cron çağırır: özet e-postasına henüz girmemiş
// bildirimler varsa ekibe tek bir e-posta gider (alıcı: ozel.ayar 'bildirim_alici'). Alıcı yoksa ya da gönderim
// başarısızsa bildirimler işaretlenmez, ertesi gün yeniden denenir. Bildirimlerin hepsi Supabase panelinde
// Table Editor > bildirim tablosunda da durur.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SERVIS = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://ucler.app";
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
const kacis = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Satir = { id: string; olusturma: string; tur: "anlamadim" | "hata"; ders: string; konu: string | null; yer: string; ozet: string | null; not: string | null; platform: string | null };
const TUR = { anlamadim: "Anlamadım", hata: "Hata var" };

/** Bildirimin geldiği yere giden bağlantı (kart numarası biliniyorsa o karttan açılır). */
function baglanti(r: Satir) {
  if (r.yer.startsWith("video ")) return `${SITE}/videolar/#${encodeURIComponent(r.yer.slice(6))}`;
  if (!r.konu) return `${SITE}/${r.ders}/`;
  const kart = /^kart (\d+)$/.exec(r.yer);
  return `${SITE}/${r.ders}/${r.konu}/${kart ? `?kart=${kart[1]}` : ""}`;
}

function eposta(liste: Satir[]) {
  const hata = liste.filter((r) => r.tur === "hata").length;
  const satirlar = liste.map((r) => `<tr><td style="padding:12px 0;border-top:1px solid #e3e8ef;">
<p style="margin:0 0 2px;font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:${r.tur === "hata" ? "#e2483b" : "#64748b"};">${TUR[r.tur]} · ${kacis(r.ders)}${r.konu ? ` / ${kacis(r.konu)}` : ""} · ${kacis(r.yer)}</p>
<a href="${baglanti(r)}" style="font-size:15px;font-weight:700;color:#1d3557;text-decoration:none;">${kacis(r.ozet || r.yer)}</a>
${r.not ? `<p style="margin:4px 0 0;font-size:15px;line-height:1.5;color:#334155;">“${kacis(r.not)}”</p>` : ""}
</td></tr>`).join("\n");
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Öğrenci bildirimleri</title></head>
<body style="margin:0;padding:0;background:#f6f8fb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:#ffffff;border:1px solid #e3e8ef;border-radius:16px;padding:28px 24px;font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;color:#1d3557;">
<h1 style="margin:0 0 6px;font-size:20px;font-weight:800;">${liste.length} yeni öğrenci bildirimi</h1>
<p style="margin:0 0 12px;font-size:14px;color:#64748b;">${hata} hata, ${liste.length - hata} anlamadım. Başlığa dokununca o yer açılır.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${satirlar}</table>
</td></tr></table></td></tr></table></body></html>`;
  const text = liste.map((r) => `[${TUR[r.tur]}] ${r.ders}/${r.konu ?? ""} ${r.yer}: ${r.ozet ?? ""}${r.not ? `\n  "${r.not}"` : ""}\n  ${baglanti(r)}`).join("\n\n");
  return { html, text };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ hata: "method" }, 405);
  const db = createClient(URL_, SERVIS, { auth: { persistSession: false } });
  // Zamanlanmış görev: seri hatırlatmasıyla aynı anahtar (ozel.ayar 'seri_cron').
  const { data: dogru } = await db.rpc("seri_cron_dogrula", { anahtar: req.headers.get("x-cron-anahtar") ?? "" });
  if (!dogru) return json({ hata: "yetki" }, 401);
  const anahtar = Deno.env.get("RESEND_API_KEY");
  const { data: alici } = await db.rpc("bildirim_alici");
  if (!anahtar || !alici) return json({ hata: "alici ya da RESEND_API_KEY yok" }, 200);

  const { data, error } = await db.from("bildirim").select("id, olusturma, tur, ders, konu, yer, ozet, not, platform")
    .is("gonderildi", null).order("olusturma").limit(200);
  if (error) return json({ hata: error.message }, 500);
  const liste = (data ?? []) as Satir[];
  if (!liste.length) return json({ yeni: 0 });

  const { html, text } = eposta(liste);
  const y = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "ucler <noreply@ucler.app>", to: [alici], subject: `ucler: ${liste.length} yeni öğrenci bildirimi`, html, text }),
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  if (!y.ok) return json({ hata: `${y.status} ${(await y.text()).slice(0, 200)}` }, 502);
  const { error: e2 } = await db.from("bildirim").update({ gonderildi: new Date().toISOString() }).in("id", liste.map((r) => r.id));
  return json({ giden: liste.length, hata: e2?.message });
});
