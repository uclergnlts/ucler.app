// Öğrenci kendi hesabını siler (Ayarlar > Hesabımı sil). İsteği yapanın oturumu doğrulanır, yalnızca o kullanıcı silinir.
// Kullanıcıya bağlı satırlar auth.users silinince veritabanında birlikte gider: ilerleme, hos_geldin, duyuru_teslim
// "on delete cascade"; bildirim (Anlamadım / Hata var) satırları "on delete set null" ile kimliksiz kalır.
// Google ile girenler için de aynıdır (auth.identities de silinir). 2026-10-24'te iki deneme hesabıyla doğrulandı.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
  const sil = await yonetici.auth.admin.deleteUser(data.user.id);
  if (sil.error) return new Response(JSON.stringify({ hata: sil.error.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ tamam: true }), { headers: { ...cors, "Content-Type": "application/json" } });
});
