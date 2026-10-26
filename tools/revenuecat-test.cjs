// RevenueCat webhook fonksiyonunu taklit veritabanıyla çalıştırır (Codex D6-02: yinelenen TRANSFER). Çalıştır: node tools/revenuecat-test.cjs
const fs = require("fs"), ts = require("typescript");
let src = fs.readFileSync(require("path").join(__dirname, "../supabase/functions/revenuecat/index.ts"), "utf8")
  .replace(/^import .*$/mg, "");
const js = ts.transpileModule(src, { compilerOptions: { target: "es2022", module: "commonjs" } }).outputText;

function yeniDb() {
  const t = { abonelik: [], olay: new Map() };
  const parseOr = (s) => s.split(",").map((p) => { const [c, op, ...v] = p.split("."); return { c, op, v: v.join(".").replace(/^"|"$/g, "") }; });
  const tut = (r, f) => f.op === "is" ? r[f.c] == null : f.op === "neq" ? r[f.c] !== f.v : f.op === "lt" ? Date.parse(r[f.c]) < Date.parse(f.v) : true;
  function q(tablo) {
    const st = { filt: [], ord: null, lim: null, upd: null };
    const satirlar = () => t[tablo].filter((r) => st.filt.every((f) => f(r)));
    const b = {
      select() { return b; },
      in(c, a) { st.filt.push((r) => a.includes(r[c])); return b; },
      eq(c, v) { st.filt.push((r) => r[c] === v); return b; },
      or(s) { const fs_ = parseOr(s); st.filt.push((r) => fs_.some((f) => tut(r, f))); return b; },
      order(c, o) { st.ord = [c, o]; return b; },
      limit(n) { st.lim = n; return b; },
      async maybeSingle() {
        let l = satirlar();
        if (st.ord) { const [c, o] = st.ord; l = [...l].sort((x, y) => { const a = x[c] == null ? Infinity : Date.parse(x[c]), bb = y[c] == null ? Infinity : Date.parse(y[c]); return o.ascending ? a - bb : bb - a; }); }
        return { data: l[0] ? { ...l[0] } : null, error: null };
      },
      async upsert(o) { const i = t[tablo].findIndex((r) => r.user_id === o.user_id); if (i >= 0) t[tablo][i] = { ...t[tablo][i], ...o }; else t[tablo].push({ ...o }); return { error: null }; },
      update(o) { st.upd = o; return b; },
      then(ok) { if (st.upd) satirlar().forEach((r) => Object.assign(r, st.upd)); ok({ error: null }); },
    };
    return b;
  }
  return {
    t,
    from: (x) => q(x),
    async rpc(ad, a) {
      if (ad === "revenuecat_anahtar") return { data: "gizli" };
      if (ad === "revenuecat_api_anahtari") return { data: null, error: null };
      if (ad === "abonelik_olay_al") { const o = t.olay.get(a.p_id); if (o && (o.islendi || Date.now() - o.alindi < 120000)) return { data: false }; t.olay.set(a.p_id, { islendi: false, alindi: Date.now() }); return { data: true }; }
      if (ad === "abonelik_olay_bitti") { t.olay.get(a.p_id).islendi = true; return { error: null }; }
      if (ad === "abonelik_olay_birak") { const o = t.olay.get(a.p_id); if (o && !o.islendi) t.olay.delete(a.p_id); return { error: null }; }
      throw new Error("bilinmeyen rpc " + ad);
    },
  };
}

const db = yeniDb();
let handler;
const Deno = { serve: (h) => { handler = h; }, env: { get: () => "x" } };
new Function("Deno", "createClient", "require", "exports", js)(Deno, () => db, require, {});
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
db.t.abonelik.push({ user_id: A, bitis: "2026-12-01T00:00:00.000Z", iptal: false, urun: "app.ucler.plus.aylik", son_olay: "RENEWAL", olay_zamani: "2026-10-01T00:00:00.000Z" });
const istek = (ev) => handler({ method: "POST", headers: { get: () => "Bearer gizli" }, json: async () => ({ event: ev }) });
const tr = { id: "tr-1", type: "TRANSFER", transferred_from: [A], transferred_to: [B], event_timestamp_ms: Date.parse("2026-10-26T09:00:00Z") };
(async () => {
  const sat = (id) => db.t.abonelik.find((r) => r.user_id === id);
  let r = await istek(tr); console.log("1. teslim", r.status, await r.text(), "B bitis", sat(B)?.bitis, "A bitis", sat(A).bitis);
  r = await istek(tr); console.log("2. teslim", r.status, await r.text(), "B bitis", sat(B)?.bitis);
  // Kayıt silinmiş olsa bile (idempotency yok sayılsa) kaynak koruması: yeni kimlikle aynı aktarma
  r = await istek({ ...tr, id: "tr-1-kopya" }); console.log("3. farklı kimlik, aynı aktarma", r.status, await r.text(), "B bitis", sat(B)?.bitis);
  const ok = sat(B)?.bitis === "2026-12-01T00:00:00.000Z";
  // Olay sırası: eski tarihli RENEWAL yeni olayı ezmemeli; eşit zaman da ezmemeli
  r = await istek({ id: "eski", type: "EXPIRATION", app_user_id: B, event_timestamp_ms: Date.parse("2026-10-26T09:00:00Z"), expiration_at_ms: Date.parse("2026-10-26T09:00:00Z") });
  console.log("4. eşit zamanlı EXPIRATION", await r.text(), "B bitis", sat(B)?.bitis);
  const ok2 = sat(B)?.bitis === "2026-12-01T00:00:00.000Z";
  console.log(ok && ok2 ? "SONUÇ: GEÇTİ" : "SONUÇ: KALDI");
  process.exit(ok && ok2 ? 0 : 1);
})();
