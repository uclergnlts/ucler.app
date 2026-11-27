#!/usr/bin/env node
// Haftalık SEO önerisi: Search Console (ve varsa Bing) verisini okur, sabit
// kurallarla adayları puanlar ve kanıtıyla TEK bir öneri yazar.
// Siteye hiçbir şey yazmaz. Öneri, Üçler onaylarsa elle uygulanır ve
// seo/haftalik/deneyler.json dosyasına kaydedilir.
//
// Kullanım:
//   node tools/seo-haftalik.mjs                 # API'den çek, rapor yaz
//   node tools/seo-haftalik.mjs --veri x.json   # önceden çekilmiş veriyle (test)
//   node tools/seo-haftalik.mjs --cek-yalniz    # yalnız veriyi çek, kaydet
// Ortam değişkenleri:
//   GSC_SERVIS_HESABI  servis hesabı JSON'u (içerik ya da dosya yolu)
//   GSC_MULK           varsayılan "sc-domain:ucler.app"
//   BING_API_ANAHTARI  isteğe bağlı (Bing Webmaster > Ayarlar > API erişimi)
//   SEO_CIKTI          rapor klasörü, varsayılan seo/haftalik

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SITE = "https://ucler.app";
const MULK = process.env.GSC_MULK || "sc-domain:ucler.app";
const CIKTI = process.env.SEO_CIKTI || "seo/haftalik";
const argv = process.argv.slice(2);
const arg = (ad) => {
  const i = argv.indexOf(ad);
  return i >= 0 ? argv[i + 1] : undefined;
};

// ---------------------------------------------------------------------------
// Kurallar (anayasa). Sayılar küçük bir site için seçildi; site büyüdükçe
// eşikler yükseltilir. Her değişiklik bu dosyada, gerekçesiyle yapılır.
// ---------------------------------------------------------------------------
export const KURAL = {
  donemGun: 28, // son 28 gün, önceki 28 günle karşılaştırılır
  gecikmeGun: 3, // Search Console verisi ~2-3 gün geriden gelir
  azVeriGosterim: 300, // 28 günde toplam gösterim bunun altındaysa ince ayar yok, büyüme önerisi
  deneyBekleGun: 21, // bir değişiklikten sonra ölçmeden yeni değişiklik yok
  olcumGun: 28, // deney sonucu bu kadar gün sonra okunur
  ctr: { minGosterim: 100, maxSira: 10, oran: 0.5 }, // beklenen CTR'nin yarısından azı
  yakin: { minGosterim: 50, minSira: 5, maxSira: 20 }, // 5-20 arası "yakın mesafe"
  yamyam: { minGosterim: 50, minPay: 0.2 }, // aynı sorguda iki sayfa, her biri ≥%20 pay
  dusen: { minOncekiTik: 10, dususOrani: 0.4 }, // tıklama ≥%40 düştü
  bosluk: { minGosterim: 30, minSira: 20 }, // gösterim var ama ilk 2 sayfada değiliz
};

// Sıraya göre kabaca beklenen tıklama oranı (genel sektör eğrisi, kesin değil).
export function beklenenCtr(sira) {
  const t = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018];
  const s = Math.max(1, Math.round(sira));
  if (s <= 10) return t[s];
  if (s <= 20) return 0.01;
  return 0.003;
}

// ---------------------------------------------------------------------------
// Google kimlik doğrulama (servis hesabı JWT, bağımlılık yok)
// ---------------------------------------------------------------------------
function servisHesabi() {
  const v = process.env.GSC_SERVIS_HESABI;
  if (!v) return null;
  const metin = v.trim().startsWith("{") ? v : fs.readFileSync(v, "utf8");
  return JSON.parse(metin);
}

async function googleJeton(sa) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const simdi = Math.floor(Date.now() / 1000);
  const govde =
    b64({ alg: "RS256", typ: "JWT" }) +
    "." +
    b64({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: simdi,
      exp: simdi + 3600,
    });
  const imza = crypto.createSign("RSA-SHA256").update(govde).sign(sa.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: govde + "." + imza,
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google jetonu alınamadı: " + JSON.stringify(j));
  return j.access_token;
}

async function gsc(jeton, yol, govde) {
  const r = await fetch("https://searchconsole.googleapis.com" + yol, {
    method: govde ? "POST" : "GET",
    headers: { authorization: "Bearer " + jeton, "content-type": "application/json" },
    body: govde ? JSON.stringify(govde) : undefined,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Search Console ${yol}: ${r.status} ${JSON.stringify(j)}`);
  return j;
}

const gun = (d) => d.toISOString().slice(0, 10);
function donemler(bugun = new Date()) {
  const son = new Date(bugun);
  son.setUTCDate(son.getUTCDate() - KURAL.gecikmeGun);
  const bas = new Date(son);
  bas.setUTCDate(bas.getUTCDate() - KURAL.donemGun + 1);
  const oSon = new Date(bas);
  oSon.setUTCDate(oSon.getUTCDate() - 1);
  const oBas = new Date(oSon);
  oBas.setUTCDate(oBas.getUTCDate() - KURAL.donemGun + 1);
  return { simdi: [gun(bas), gun(son)], onceki: [gun(oBas), gun(oSon)] };
}

async function satirlar(jeton, [bas, son], boyutlar) {
  const hepsi = [];
  for (let startRow = 0; ; startRow += 25000) {
    const j = await gsc(jeton, `/webmasters/v3/sites/${encodeURIComponent(MULK)}/searchAnalytics/query`, {
      startDate: bas,
      endDate: son,
      dimensions: boyutlar,
      rowLimit: 25000,
      startRow,
      dataState: "final",
    });
    const r = j.rows || [];
    for (const x of r)
      hepsi.push({
        sayfa: boyutlar.includes("page") ? x.keys[boyutlar.indexOf("page")] : undefined,
        sorgu: boyutlar.includes("query") ? x.keys[boyutlar.indexOf("query")] : undefined,
        tik: x.clicks,
        gosterim: x.impressions,
        sira: x.position,
      });
    if (r.length < 25000) break;
  }
  return hepsi;
}

async function siteHaritasiAdresleri() {
  try {
    const xml = await (await fetch(SITE + "/sitemap.xml")).text();
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

async function bingSayfalar() {
  const k = process.env.BING_API_ANAHTARI;
  if (!k) return null;
  const u = `https://ssl.bing.com/webmaster/api.svc/json/GetPageStats?siteUrl=${encodeURIComponent(SITE + "/")}&apikey=${k}`;
  const r = await fetch(u);
  if (!r.ok) return { hata: `Bing ${r.status}` };
  const j = await r.json();
  return (j.d || []).map((x) => ({ sayfa: x.Query, tik: x.Clicks, gosterim: x.Impressions, sira: x.AvgImpressionPosition }));
}

export async function veriCek() {
  const sa = servisHesabi();
  if (!sa) throw new Error("GSC_SERVIS_HESABI tanımlı değil. Kurulum: docs/SEO-HAFTALIK.md");
  const jeton = await googleJeton(sa);
  const d = donemler();
  const [ciftSimdi, ciftOnceki, sayfaSimdi, sayfaOnceki, haritalar] = await Promise.all([
    satirlar(jeton, d.simdi, ["page", "query"]),
    satirlar(jeton, d.onceki, ["page", "query"]),
    satirlar(jeton, d.simdi, ["page"]),
    satirlar(jeton, d.onceki, ["page"]),
    gsc(jeton, `/webmasters/v3/sites/${encodeURIComponent(MULK)}/sitemaps`),
  ]);
  // Önemli sayfaların dizin durumu (URL Denetimi API, günde 2000 hak; 25 tane yeter).
  const adresler = (await siteHaritasiAdresleri()).slice(0, 25);
  // Her denetim ~6 sn sürüyor; 5'erli gruplar halinde paralel.
  const denetle = async (u) => {
    try {
      const j = await gsc(jeton, "/v1/urlInspection/index:inspect", { inspectionUrl: u, siteUrl: MULK });
      const s = j.inspectionResult?.indexStatusResult || {};
      return { sayfa: u, karar: s.verdict, durum: s.coverageState, sonTarama: s.lastCrawlTime };
    } catch (e) {
      return { sayfa: u, hata: String(e.message).slice(0, 200) };
    }
  };
  const dizin = [];
  for (let i = 0; i < adresler.length; i += 5) dizin.push(...(await Promise.all(adresler.slice(i, i + 5).map(denetle))));
  return {
    cekildi: new Date().toISOString(),
    donem: d,
    ciftSimdi,
    ciftOnceki,
    sayfaSimdi,
    sayfaOnceki,
    siteHaritalari: haritalar.sitemap || [],
    haritadakiSayfaSayisi: adresler.length,
    dizin,
    bing: await bingSayfalar(),
  };
}

// ---------------------------------------------------------------------------
// Analiz: adaylar ve tek öneri
// ---------------------------------------------------------------------------
const yuzde = (x) => (100 * x).toFixed(1) + "%";
const kisa = (u) => (u || "").replace(SITE, "") || "/";

function topla(satir) {
  const m = new Map();
  for (const r of satir) {
    const a = m.get(r.sayfa) || { sayfa: r.sayfa, tik: 0, gosterim: 0, siraAgirlik: 0 };
    a.tik += r.tik;
    a.gosterim += r.gosterim;
    a.siraAgirlik += r.sira * r.gosterim;
    m.set(r.sayfa, a);
  }
  for (const a of m.values()) a.sira = a.gosterim ? a.siraAgirlik / a.gosterim : 0;
  return m;
}

export function analiz(veri, deneyler = [], bugun = new Date()) {
  const sonuc = { saglik: [], adaylar: [], bekleyenDeney: null, olculecek: [] };
  const sayfa = topla(veri.sayfaSimdi);
  const onceki = topla(veri.sayfaOnceki);
  const toplamGosterim = [...sayfa.values()].reduce((s, a) => s + a.gosterim, 0);
  const toplamTik = [...sayfa.values()].reduce((s, a) => s + a.tik, 0);
  sonuc.ozet = { toplamGosterim, toplamTik, sayfaSayisi: sayfa.size };

  // 0) Teknik sağlık: önce bunlar.
  if (!veri.siteHaritalari?.length)
    sonuc.saglik.push({
      tur: "site-haritasi",
      kazanc: 1e6,
      baslik: "Site haritasını Search Console'a gönder",
      kanit: "Search Console'da kayıtlı site haritası yok.",
      degisiklik: `Search Console > Site haritaları > ${SITE}/sitemap.xml ekle. Bing'de de aynısını yap.`,
    });
  for (const h of veri.siteHaritalari || [])
    if (Number(h.errors) > 0)
      sonuc.saglik.push({
        tur: "site-haritasi-hata",
        kazanc: 9e5,
        baslik: "Site haritasındaki hataları düzelt",
        kanit: `${h.path}: ${h.errors} hata, ${h.warnings || 0} uyarı.`,
        degisiklik: "Hatalı adresleri bul ve haritadan çıkar ya da düzelt.",
      });
  const dizinde = (veri.dizin || []).filter((d) => d.karar);
  const disarida = dizinde.filter((d) => d.karar !== "PASS");
  if (dizinde.length && disarida.length / dizinde.length >= 0.3)
    sonuc.saglik.push({
      tur: "dizin",
      kazanc: 8e5,
      baslik: "Önemli sayfaların çoğu Google dizininde değil",
      kanit: `${dizinde.length} sayfadan ${disarida.length} tanesi dizinde değil. Örnekler: ${disarida
        .slice(0, 5)
        .map((d) => `${kisa(d.sayfa)} (${d.durum})`)
        .join(", ")}`,
      degisiklik:
        "Durum 'Keşfedildi, dizine eklenmedi' ise iç bağlantı ekle; 'Tarandı, dizine eklenmedi' ise sayfanın içeriğini güçlendir. Search Console'da en önemli 3 sayfa için 'Dizine eklenmesini iste' de.",
    });

  // Deneyler: süresi dolanlar ölçülür, yenisi bekliyorsa yeni öneri yok.
  for (const d of deneyler) {
    const gecen = (bugun - new Date(d.tarih)) / 864e5;
    if (!d.sonuc && gecen < KURAL.deneyBekleGun && !sonuc.bekleyenDeney) sonuc.bekleyenDeney = { ...d, gecen: Math.floor(gecen) };
    if (!d.sonuc && gecen >= KURAL.olcumGun) {
      const a = sayfa.get(d.sayfa);
      sonuc.olculecek.push({ ...d, simdi: a ? { tik: a.tik, gosterim: a.gosterim, ctr: a.tik / a.gosterim, sira: a.sira } : null });
    }
  }
  const deneydeki = new Set(deneyler.filter((d) => !d.sonuc).map((d) => d.sayfa));

  // A) Düşük tıklama oranı: iyi sıradayız ama tıklanmıyoruz -> başlık/açıklama.
  for (const a of sayfa.values()) {
    if (deneydeki.has(a.sayfa)) continue;
    const ctr = a.tik / a.gosterim;
    const b = beklenenCtr(a.sira);
    if (a.gosterim >= KURAL.ctr.minGosterim && a.sira <= KURAL.ctr.maxSira && ctr < b * KURAL.ctr.oran) {
      const sorgular = veri.ciftSimdi.filter((r) => r.sayfa === a.sayfa).sort((x, y) => y.gosterim - x.gosterim).slice(0, 5);
      sonuc.adaylar.push({
        tur: "baslik",
        sayfa: a.sayfa,
        kazanc: a.gosterim * (b - ctr),
        baslik: `${kisa(a.sayfa)} başlığını ve açıklamasını yeniden yaz`,
        kanit: `28 günde ${a.gosterim} gösterim, ortalama sıra ${a.sira.toFixed(1)}, tıklama oranı ${yuzde(ctr)}. Bu sırada beklenen yaklaşık ${yuzde(b)}. Arayanların kullandığı sözcükler: ${sorgular.map((s) => `"${s.sorgu}" (${s.gosterim})`).join(", ")}`,
        degisiklik: "Başlığa en çok aranan ifadeyi koy, açıklamada sayfanın tam olarak neyi cevapladığını söyle. Üç başlık seçeneği hazırlanır, Üçler seçer.",
        olcut: "28 gün sonra tıklama oranı",
      });
    }
  }

  // B) Yakın mesafe: sorgu için 5-20 arası sıradayız -> içeriği o soruya göre güçlendir.
  for (const r of veri.ciftSimdi) {
    if (deneydeki.has(r.sayfa)) continue;
    const k = KURAL.yakin;
    if (r.gosterim >= k.minGosterim && r.sira >= k.minSira && r.sira <= k.maxSira) {
      const ctr = r.tik / r.gosterim;
      sonuc.adaylar.push({
        tur: "yakin",
        sayfa: r.sayfa,
        sorgu: r.sorgu,
        kazanc: 0.5 * r.gosterim * Math.max(0, beklenenCtr(3) - ctr),
        baslik: `"${r.sorgu}" aramasında ${kisa(r.sayfa)} sayfasını ilk sıralara taşı`,
        kanit: `"${r.sorgu}": ${r.gosterim} gösterim, ${r.tik} tıklama, ortalama sıra ${r.sira.toFixed(1)}.`,
        degisiklik: "Bu soruya sayfanın başında doğrudan cevap veren bir paragraf ve ilgili bir ara başlık ekle; ilgili iki konudan bu sayfaya bağlantı ver.",
        olcut: "28 gün sonra bu sorgudaki ortalama sıra ve tıklama",
      });
    }
  }

  // C) Yamyamlık: aynı sorguda iki sayfa yarışıyor.
  const sorguya = new Map();
  for (const r of veri.ciftSimdi) (sorguya.get(r.sorgu) || sorguya.set(r.sorgu, []).get(r.sorgu)).push(r);
  for (const [sorgu, rs] of sorguya) {
    const top = rs.reduce((s, r) => s + r.gosterim, 0);
    const buyuk = rs.filter((r) => r.gosterim / top >= KURAL.yamyam.minPay);
    if (top >= KURAL.yamyam.minGosterim && buyuk.length >= 2 && !buyuk.some((r) => deneydeki.has(r.sayfa)))
      sonuc.adaylar.push({
        tur: "yamyam",
        sayfa: buyuk[0].sayfa,
        sorgu,
        kazanc: top * 0.02,
        baslik: `"${sorgu}" için iki sayfa birbiriyle yarışıyor`,
        kanit: buyuk.map((r) => `${kisa(r.sayfa)}: ${r.gosterim} gösterim, sıra ${r.sira.toFixed(1)}`).join("; "),
        degisiklik: "Hangisinin bu sorunun asıl cevabı olduğuna karar ver; diğerinden ona bağlantı ver ve başlığını farklı bir soruya çevir.",
        olcut: "28 gün sonra sorgunun tek sayfada toplanması",
      });
  }

  // D) Düşen sayfa.
  for (const [u, o] of onceki) {
    if (deneydeki.has(u)) continue;
    const s = sayfa.get(u) || { tik: 0, gosterim: 0, sira: 0 };
    if (o.tik >= KURAL.dusen.minOncekiTik && s.tik <= o.tik * (1 - KURAL.dusen.dususOrani))
      sonuc.adaylar.push({
        tur: "dusen",
        sayfa: u,
        kazanc: o.tik - s.tik,
        baslik: `${kisa(u)} tıklama kaybediyor`,
        kanit: `Önceki 28 gün ${o.tik} tıklama, sıra ${o.sira.toFixed(1)}; son 28 gün ${s.tik} tıklama, sıra ${s.sira ? s.sira.toFixed(1) : "-"}.`,
        degisiklik: "Önce nedeni bul (sayfa değişti mi, dizinden mi düştü, rakip mi çıktı). Neden bulunmadan değişiklik önerilmez.",
        olcut: "Neden raporu",
      });
  }

  // E) İçerik boşluğu: gösterim var ama 20. sıradan geride -> yeni konu adayı.
  for (const [sorgu, rs] of sorguya) {
    const top = rs.reduce((s, r) => s + r.gosterim, 0);
    const enIyi = Math.min(...rs.map((r) => r.sira));
    if (top >= KURAL.bosluk.minGosterim && enIyi > KURAL.bosluk.minSira)
      sonuc.adaylar.push({
        tur: "bosluk",
        sorgu,
        kazanc: top * 0.03,
        baslik: `"${sorgu}" için ayrı bir konu ya da bölüm aç`,
        kanit: `${top} gösterim, en iyi sıra ${enIyi.toFixed(1)} (${kisa(rs[0].sayfa)}). Google bizi bu soruyla eşleştiriyor ama cevap sayfamız yok.`,
        degisiklik: "Bu soruyu doğrudan cevaplayan bir konu ya da mevcut konuya bölüm ekle (haftalık konu planına aday olarak gir).",
        olcut: "28 gün sonra bu sorgudaki sıra",
      });
  }

  sonuc.adaylar.sort((x, y) => y.kazanc - x.kazanc);
  sonuc.azVeri = toplamGosterim < KURAL.azVeriGosterim;

  // Tek karar.
  if (sonuc.saglik.length) sonuc.oneri = sonuc.saglik.sort((x, y) => y.kazanc - x.kazanc)[0];
  else if (sonuc.bekleyenDeney)
    sonuc.oneri = {
      tur: "bekle",
      baslik: "Bu hafta değişiklik yok",
      kanit: `${sonuc.bekleyenDeney.tarih} tarihinde ${kisa(sonuc.bekleyenDeney.sayfa)} sayfasında yapılan değişiklik ${sonuc.bekleyenDeney.gecen} gündür ölçülüyor. Google görmeden ikinci değişiklik sonucu bulandırır.`,
      degisiklik: "Hiçbir şey yapma.",
    };
  else if (sonuc.azVeri)
    sonuc.oneri = {
      tur: "az-veri",
      baslik: "Veri henüz ince ayar için az: büyümeye odaklan",
      kanit: `Son 28 günde toplam ${toplamGosterim} gösterim, ${toplamTik} tıklama. ${KURAL.azVeriGosterim} gösterimin altında başlık testleri gürültüden ayrılamaz.`,
      degisiklik: sonuc.adaylar[0]
        ? `Yine de en güçlü sinyal: ${sonuc.adaylar[0].baslik}. ${sonuc.adaylar[0].kanit}`
        : "Haftalık konu planına devam et; her yeni konu Google'a yeni bir kapı açar.",
    };
  else sonuc.oneri = sonuc.adaylar[0] || { tur: "yok", baslik: "Bu hafta kurala uyan aday yok", kanit: "Hiçbir eşik aşılmadı.", degisiklik: "Hiçbir şey yapma." };
  return sonuc;
}

// ---------------------------------------------------------------------------
// Soru/sorgu fırsatları: Search Console regex filtrelerinin Türkçe + İngilizce
// karşılıkları. Satın alma ve yerel filtreler bize uymadığı için yok.
// ---------------------------------------------------------------------------
// JS'te \b yalnız ASCII harfleri tanır; Türkçe harfler için (?<!\p{L}) / (?!\p{L}) sınırı kullanılır.
const k = (govde) => new RegExp(govde, "iu");
export const SORGU_KALIPLARI = {
  soru: k("^(who|what|when|where|why|how|which|can|could|should|would|will|do|does|did|is|are|was|were|has|have)(?![\\p{L}])|(?<![\\p{L}])(nedir|neden|niçin|nasıl|ne zaman|nerede|hangi|kaç(?:a|ı|ta)?|kimdir|mı|mi|mu|mü)(?![\\p{L}])|\\?$"),
  tanim: k("(?<![\\p{L}])(what is|what are|define|definition|meaning|means|explained|nedir|ne demek|anlamı|tanımı|ne işe yarar)(?![\\p{L}])"),
  nasil: k("(?<![\\p{L}])(how to|how do|guide|tutorial|step by step|nasıl yapılır|nasıl hesaplanır|nasıl bulunur|adım adım)(?![\\p{L}])"),
  ogrenme: k("(?<![\\p{L}])(learn|explain|understand|basics|beginner|konu anlatımı|özet|anlatım|ders|öğren|formül(?:ü|leri)?|denklem(?:i)?|tablo(?:su)?|şema(?:sı)?|soru(?:ları)?|test)(?![\\p{L}])"),
  uzun: /^(?:\S+\s+){3,}\S+$/u,
};
const MARKA = /^(ü?u?cler|eucler|ucler\.app)$/iu;

export function soruFirsatlari(satir) {
  const out = [];
  for (const r of satir || []) {
    if (!r.sorgu || MARKA.test(r.sorgu.trim())) continue;
    const gruplar = Object.entries(SORGU_KALIPLARI).filter(([, re]) => re.test(r.sorgu)).map(([k]) => k);
    if (gruplar.length) out.push({ ...r, gruplar });
  }
  return out.sort((a, b) => b.gosterim - a.gosterim || a.sira - b.sira);
}

// ---------------------------------------------------------------------------
// Rapor
// ---------------------------------------------------------------------------
export function rapor(veri, s) {
  const o = s.oneri;
  const satir = [];
  satir.push(`# Haftalık SEO önerisi · ${veri.cekildi.slice(0, 10)}`, "");
  satir.push(`Dönem: ${veri.donem.simdi.join(" – ")} (önceki: ${veri.donem.onceki.join(" – ")})`);
  satir.push(`Google: ${s.ozet.toplamGosterim} gösterim, ${s.ozet.toplamTik} tıklama, ${s.ozet.sayfaSayisi} sayfa görünmüş.`);
  if (Array.isArray(veri.bing)) {
    const bg = veri.bing.reduce((t, r) => t + r.gosterim, 0);
    const bt = veri.bing.reduce((t, r) => t + r.tik, 0);
    satir.push(`Bing: ${bg} gösterim, ${bt} tıklama.`);
  } else satir.push(`Bing: bağlı değil.`);
  const dz = (veri.dizin || []).filter((d) => d.karar);
  if (dz.length) satir.push(`Dizin: haritadaki ilk ${dz.length} sayfadan ${dz.filter((d) => d.karar === "PASS").length} tanesi Google dizininde.`);
  satir.push("", "## Bu haftanın tek önerisi", "", `**${o.baslik}**`, "", `Kanıt: ${o.kanit}`, "", `Önerilen değişiklik: ${o.degisiklik}`);
  if (o.olcut) satir.push("", `Nasıl ölçülecek: ${o.olcut}.`);
  if (!["bekle", "yok"].includes(o.tur))
    satir.push("", "Onaylıyorsan \"uygula\" yaz. Onay gelmeden sitede hiçbir şey değişmez.");
  if (s.olculecek.length) {
    satir.push("", "## Sonucu okunacak deneyler", "");
    for (const d of s.olculecek)
      satir.push(
        `- ${d.tarih} ${kisa(d.sayfa)} (${d.tur}): önce ${JSON.stringify(d.once)}, şimdi ${d.simdi ? `${d.simdi.tik} tık, ${d.simdi.gosterim} gösterim, CTR ${yuzde(d.simdi.ctr)}, sıra ${d.simdi.sira.toFixed(1)}` : "veri yok"}`,
      );
  }
  const digerleri = [...s.saglik, ...s.adaylar].filter((a) => a !== o).slice(0, 5);
  if (digerleri.length) {
    satir.push("", "## Sıradaki adaylar (bu hafta yapılmayacak)", "");
    for (const a of digerleri) satir.push(`- ${a.baslik}. ${a.kanit}`);
  }
  const firsat = soruFirsatlari(veri.ciftSimdi);
  if (firsat.length) {
    satir.push("", "## Soru ve sorgu fırsatları (bilgi; öneri değil)", "", "Google'ın bizi gösterdiği soru, tanım, nasıl ve uzun aramalar. Sayfa bu soruya doğrudan cevap veren bir ara başlık ya da kısa paragraf ekleyebilir.", "");
    for (const f of firsat.slice(0, 15))
      satir.push(`- ${kisa(f.sayfa)}: "${f.sorgu}" [${f.gruplar.join(", ")}] ${f.gosterim} gösterim, ${f.tik} tık, sıra ${f.sira.toFixed(0)}`);
  }
  satir.push("", "_Kurallar ve eşikler: tools/seo-haftalik.mjs içindeki KURAL. Tahmini kazançlar kaba bir tıklama oranı eğrisine dayanır, söz değildir._");
  return satir.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
async function ana() {
  fs.mkdirSync(CIKTI, { recursive: true });
  const veri = arg("--veri") ? JSON.parse(fs.readFileSync(arg("--veri"), "utf8")) : await veriCek();
  const tarih = veri.cekildi.slice(0, 10);
  if (!arg("--veri")) fs.writeFileSync(path.join(CIKTI, `veri-${tarih}.json`), JSON.stringify(veri));
  if (argv.includes("--cek-yalniz")) return;
  const deneyDosyasi = path.join(CIKTI, "deneyler.json");
  const deneyler = fs.existsSync(deneyDosyasi) ? JSON.parse(fs.readFileSync(deneyDosyasi, "utf8")) : [];
  const s = analiz(veri, deneyler, new Date(veri.cekildi));
  const md = rapor(veri, s);
  fs.writeFileSync(path.join(CIKTI, `oneri-${tarih}.md`), md);
  process.stdout.write(md);
}

if (import.meta.url === `file://${process.argv[1]}`) ana().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
