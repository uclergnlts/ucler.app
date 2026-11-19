// Öğrenci kendi hesabını siler (Ayarlar > Hesabımı sil). İsteği yapanın oturumu doğrulanır, yalnızca o kullanıcı silinir.
// Kullanıcıya bağlı satırlar auth.users silinince veritabanında birlikte gider: ilerleme, hos_geldin, duyuru_teslim
// "on delete cascade"; bildirim (Anlamadım / Hata var) satırları "on delete set null" ile kimliksiz kalır.
// Google ile girenler için de aynıdır (auth.identities de silinir). 2026-10-24'te iki deneme hesabıyla doğrulandı.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { importPKCS8, SignJWT } from "npm:jose@5";

// Apple ile girenlerin Apple jetonları da iptal edilir (App Store kuralı 5.1.1(v)). Uygulama silmeden hemen önce
// Apple'dan taze bir yetki kodu alıp gövdede "apple_kod" olarak yollar; kod jetona çevrilir ve jeton iptal edilir.
// Gereken sırlar (Supabase > Edge Functions > Secrets): APPLE_P8 (.p8 dosyasının içi), APPLE_KEY_ID, APPLE_TEAM_ID.
// Sır yoksa ya da Apple hata verirse hesap yine silinir; iptal yalnızca denenir.
async function appleIptal(kod: string) {
  const p8 = Deno.env.get("APPLE_P8"), kid = Deno.env.get("APPLE_KEY_ID"), takim = Deno.env.get("APPLE_TEAM_ID");
  if (!p8 || !kid || !takim) return "sir-yok";
  const istemci = "app.ucler";
  const anahtar = await importPKCS8(p8.replace(/\\n/g, "\n"), "ES256");
  const sir = await new SignJWT({}).setProtectedHeader({ alg: "ES256", kid }).setIssuer(takim).setIssuedAt()
    .setExpirationTime("5m").setAudience("https://appleid.apple.com").setSubject(istemci).sign(anahtar);
  const form = (o: Record<string, string>) => new URLSearchParams(o);
  const j = await fetch("https://appleid.apple.com/auth/token", { method: "POST", body: form({ client_id: istemci, client_secret: sir, code: kod, grant_type: "authorization_code" }) });
  if (!j.ok) return "kod-" + j.status;
  const t = await j.json();
  const [token, tur] = t.refresh_token ? [t.refresh_token, "refresh_token"] : [t.access_token, "access_token"];
  const r = await fetch("https://appleid.apple.com/auth/revoke", { method: "POST", body: form({ client_id: istemci, client_secret: sir, token, token_type_hint: tur }) });
  return r.ok ? "tamam" : "iptal-" + r.status;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("method", { status: 405, headers: cors });
  const url = Deno.env.get("SUPABASE_URL")!;
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const yonetici = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data, error } = await yonetici.auth.getUser(jwt);
  if (error || !data.user) return new Response(JSON.stringify({ hata: "oturum" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  const govde = await req.json().catch(() => ({}));
  if (typeof govde?.apple_kod === "string" && govde.apple_kod) {
    try { console.log("apple iptal:", await appleIptal(govde.apple_kod)); } catch (e) { console.log("apple iptal hata:", String(e)); }
  }
  const sil = await yonetici.auth.admin.deleteUser(data.user.id);
  if (sil.error) return new Response(JSON.stringify({ hata: sil.error.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ tamam: true }), { headers: { ...cors, "Content-Type": "application/json" } });
});
