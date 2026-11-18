// Üçler Stüdyo: yerel kurgu sunucusu.  Başlat: cd video/studyo && npm start  ->  http://localhost:4100
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { STUDYO, DEPO, MEDYA, MODEL, PROJELER, proje, projeKur, projeListesi, okuJson, yazJson, VIDEO_UZANTI, metinleriOku } from './lib/yollar.mjs';
import { kurguHazirla, srt, bolumler } from './public/motor.js';
import { sirayaKoy, durumlar, hazirMi, hamDosyalar } from './lib/isle.mjs';
import { render, kareler } from './lib/render.mjs';
import { arkaHazirla, arkaDurum, arkaVekilAdi } from './lib/maske.mjs';

const PORT = Number(process.env.PORT || 4100);
const PUBLIC = path.join(STUDYO, 'public');
const FONTLAR = path.join(DEPO, 'video', 'sablon');
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary' };

// ---- Canlı bildirim (SSE) ----
const dinleyiciler = new Map(); // proje -> Set(res)
function yayinla(ad, olay, veri = {}) {
  for (const res of dinleyiciler.get(ad) || []) res.write(`event: ${olay}\ndata: ${JSON.stringify(veri)}\n\n`);
}

// ---- Dosya izleme: Claude kurguyu/sahneleri değiştirince ekran kendiliğinden yenilenir ----
const izlenen = new Set();
function izle(ad) {
  if (izlenen.has(ad)) return; izlenen.add(ad);
  const p = projeKur(ad);
  let bekleyen = new Set(), zam = null;
  fs.watch(p.kok, { recursive: true }, (_, f) => {
    if (!f || f.endsWith('.tmp')) return;
    bekleyen.add(f);
    clearTimeout(zam);
    zam = setTimeout(() => {
      const liste = [...bekleyen]; bekleyen = new Set();
      if (liste.some(x => x.startsWith('notlar'))) yayinla(ad, 'notlar');
      if (liste.some(x => x.startsWith('kurgu'))) arkaHazirla(ad, () => yayinla(ad, 'klipler'));
      if (liste.some(x => !x.startsWith('notlar'))) yayinla(ad, 'kurgu', { degisen: liste.filter(x => x.startsWith('sahneler')).map(x => x.slice(9)) });
    }, 150);
  });
  const tara = () => { for (const f of hamDosyalar(ad)) if (!hazirMi(ad, f) || !okuJson(path.join(p.metin, f + '.json'), {}).sessizlik) sirayaKoy(ad, f, () => yayinla(ad, 'klipler')); };
  fs.watch(p.ham, () => setTimeout(tara, 500));
  tara();
  arkaHazirla(ad, () => yayinla(ad, 'klipler'));
}

// ---- Yardımcılar ----
function json(res, v, kod = 200) { res.writeHead(kod, { 'content-type': TUR['.json'], 'cache-control': 'no-store' }); res.end(JSON.stringify(v)); }
function govde(req) { return new Promise((ok, hata) => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { hata(e); } }); }); }
function guvenliYol(kok, parca) {
  const f = path.resolve(kok, '.' + path.sep + decodeURIComponent(parca));
  if (!f.startsWith(path.resolve(kok) + path.sep) && f !== path.resolve(kok)) throw new Error('yol dışı');
  return f;
}
function dosyaGonder(req, res, f) {
  if (!fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('yok'); }
  const boyut = fs.statSync(f).size;
  const tur = TUR[path.extname(f).toLowerCase()] || 'application/octet-stream';
  const aralik = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (aralik) {
    const bas = aralik[1] ? +aralik[1] : boyut - +aralik[2];
    const son = aralik[1] && aralik[2] ? Math.min(+aralik[2], boyut - 1) : boyut - 1;
    res.writeHead(206, { 'content-type': tur, 'accept-ranges': 'bytes', 'content-range': `bytes ${bas}-${son}/${boyut}`, 'content-length': son - bas + 1, 'cache-control': 'no-cache' });
    return fs.createReadStream(f, { start: bas, end: son }).pipe(res);
  }
  res.writeHead(200, { 'content-type': tur, 'content-length': boyut, 'accept-ranges': 'bytes', 'cache-control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}

function klipDurumlari(ad) {
  const p = proje(ad);
  return hamDosyalar(ad).map(dosya => {
    const d = durumlar.get(ad + '/' + dosya);
    const m = okuJson(path.join(p.metin, dosya + '.json'), null);
    return { dosya, asama: hazirMi(ad, dosya) && (!d || d.asama === 'hazır') ? 'hazır' : (d ? d.asama : 'sırada'), hata: d?.hata,
      sure: m?.sure, bilgi: m?.bilgi, vekil: path.parse(dosya).name + '.mp4', arka: arkaDurum(ad, dosya) };
  });
}

const renderler = new Map(); // proje -> {durum, oran, kalan, cikti, hata, iptal}

// ---- Sunucu ----
const sunucu = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    const yol = u.pathname;
    let m;

    if (yol === '/' || yol === '/index.html') return dosyaGonder(req, res, path.join(PUBLIC, 'index.html'));
    if ((m = yol.match(/^\/studyo\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(PUBLIC, m[1]));
    if ((m = yol.match(/^\/fonts\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(FONTLAR, m[1]));

    if (yol === '/api/projeler' && req.method === 'GET') return json(res, projeListesi().map(ad => ({ ad, baslik: okuJson(proje(ad).kurgu, {}).baslik })));
    if (yol === '/api/projeler' && req.method === 'POST') {
      const b = await govde(req);
      const ad = String(b.ad || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!ad) return json(res, { hata: 'ad gerekli' }, 400);
      projeKur(ad, b.ad); izle(ad);
      return json(res, { ad });
    }

    if (!(m = yol.match(/^\/(api\/p|p)\/([a-z0-9-]+)(\/.*)?$/))) { res.writeHead(404); return res.end('yok'); }
    const api = m[1] === 'api/p', ad = m[2], alt = m[3] || '';
    if (!projeListesi().includes(ad)) return json(res, { hata: 'proje yok' }, 404);
    const p = proje(ad); izle(ad);

    if (!api) {
      if ((m = alt.match(/^\/sahneler\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(p.sahneler, m[1]));
      if ((m = alt.match(/^\/vekil\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(p.vekil, m[1]));
      if ((m = alt.match(/^\/cikti\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(p.cikti, m[1]));
      if ((m = alt.match(/^\/muzik\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(p.muzik, m[1]));
      if ((m = alt.match(/^\/kare\/(.+)$/))) return dosyaGonder(req, res, guvenliYol(path.join(p.gecici, 'kare'), m[1]));
      res.writeHead(404); return res.end('yok');
    }

    if (alt === '' && req.method === 'GET') {
      const metinler = metinleriOku(p);
      const kurgu = kurguHazirla(okuJson(p.kurgu, {}), metinler);
      const r = renderler.get(ad);
      const ciktilar = fs.existsSync(p.cikti) ? fs.readdirSync(p.cikti).filter(f => f.endsWith('.mp4') && !f.includes('.yarim')).sort().reverse() : [];
      const arka = kurgu.goruntu && kurgu.goruntu.arka;
      const arkaVekil = {};
      if (arka) for (const k of kurgu.klipler || []) if (k.dosya && fs.existsSync(path.join(p.vekil, arkaVekilAdi(k.dosya, arka)))) arkaVekil[k.dosya] = arkaVekilAdi(k.dosya, arka);
      return json(res, { ad, kurgu, metinler, arkaVekil, notlar: okuJson(p.notlar, []), klipler: klipDurumlari(ad), render: r && { ...r, iptal: undefined }, ciktilar,
        hamKlasor: p.ham, muzikKlasor: p.muzik });
    }
    if (alt === '/olaylar') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
      res.write('retry: 2000\n\n');
      if (!dinleyiciler.has(ad)) dinleyiciler.set(ad, new Set());
      dinleyiciler.get(ad).add(res);
      const nabiz = setInterval(() => res.write(': nabiz\n\n'), 20000);
      req.on('close', () => { clearInterval(nabiz); dinleyiciler.get(ad).delete(res); });
      return;
    }
    if (alt === '/yukle' && req.method === 'PUT') {
      const ad0 = path.basename(u.searchParams.get('dosya') || '');
      if (!VIDEO_UZANTI.test(ad0)) return json(res, { hata: 'yalnız video dosyaları (.mov .mp4)' }, 400);
      const hedef = path.join(p.ham, ad0);
      const gec = path.join(p.gecici, ad0 + '.yukleniyor');
      const yaz = fs.createWriteStream(gec);
      req.pipe(yaz);
      yaz.on('finish', () => { fs.renameSync(gec, hedef); json(res, { tamam: true, dosya: ad0 }); });
      yaz.on('error', e => json(res, { hata: String(e) }, 500));
      return;
    }
    if (alt === '/not' && req.method === 'POST') {
      const b = await govde(req);
      const notlar = okuJson(p.notlar, []);
      notlar.push({ id: 'n' + Date.now().toString(36), t: +b.t || 0, metin: String(b.metin || '').slice(0, 4000), yazan: b.yazan || 'Üçler', durum: 'açık', zaman: new Date().toISOString() });
      yazJson(p.notlar, notlar);
      return json(res, { tamam: true });
    }
    if ((m = alt.match(/^\/not\/([\w]+)$/)) && req.method === 'POST') {
      const b = await govde(req);
      const notlar = okuJson(p.notlar, []);
      const n = notlar.find(n => n.id === m[1]);
      if (n) { if (b.durum) n.durum = b.durum; if (b.sil) notlar.splice(notlar.indexOf(n), 1); yazJson(p.notlar, notlar); }
      return json(res, { tamam: true });
    }
    if (alt === '/altyazi' && req.method === 'POST') {
      // Bir altyazı satırını düzelt: aynı klibin ardışık kelimeleri yeni metinle değişir, zamanlar korunur
      const b = await govde(req);
      const f = path.join(p.metin, path.basename(String(b.dosya)) + '.json');
      const m = okuJson(f, null);
      const idx = (b.indeksler || []).map(Number).sort((x, y) => x - y);
      if (!m || !idx.length || idx.some(i => !m.kelimeler[i])) return json(res, { hata: 'satır bulunamadı' }, 400);
      const yeni = String(b.metin || '').trim().split(/\s+/).filter(Boolean);
      const s0 = m.kelimeler[idx[0]].s, e0 = m.kelimeler[idx[idx.length - 1]].e;
      let kelimeler;
      if (yeni.length === idx.length) kelimeler = idx.map((i, n) => ({ ...m.kelimeler[i], w: yeni[n] }));
      else {
        const toplam = yeni.reduce((a, w) => a + w.length + 1, 0);
        let t = s0;
        kelimeler = yeni.map(w => { const d = (e0 - s0) * (w.length + 1) / toplam; const k = { w, s: +t.toFixed(3), e: +(t + d).toFixed(3) }; t += d; return k; });
      }
      m.kelimeler.splice(idx[0], idx[idx.length - 1] - idx[0] + 1, ...kelimeler);
      m.duzeltildi = true;
      yazJson(f, m);
      return json(res, { tamam: true });
    }
    if (alt === '/render' && req.method === 'POST') {
      const b = await govde(req);
      const var0 = renderler.get(ad);
      if (var0 && var0.durum === 'çalışıyor') return json(res, { hata: 'zaten çalışıyor' }, 409);
      const r = { durum: 'çalışıyor', oran: 0, cozunurluk: b.cozunurluk === '4k' ? '4k' : '1080', basladi: Date.now(), iptal: { var: false } };
      renderler.set(ad, r); yayinla(ad, 'render', { ...r, iptal: undefined });
      render(ad, { cozunurluk: r.cozunurluk, port: PORT, iptal: r.iptal, ilerleme: i => { Object.assign(r, i); yayinla(ad, 'render', { ...r, iptal: undefined }); } })
        .then(f => { r.durum = 'bitti'; r.cikti = path.basename(f); })
        .catch(e => { console.error(e); r.durum = 'hata'; r.hata = String(e.message || e).slice(0, 1500); })
        .finally(() => yayinla(ad, 'render', { ...r, iptal: undefined }));
      return json(res, { tamam: true });
    }
    if (alt === '/disa' && req.method === 'GET') {
      const metinler = metinleriOku(p);
      const kurgu = kurguHazirla(okuJson(p.kurgu, {}), metinler);
      const tur = u.searchParams.get('tur');
      const metin = tur === 'srt' ? srt(kurgu, metinler) : bolumler(kurgu);
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store',
        ...(tur === 'srt' ? { 'content-disposition': `attachment; filename="${ad}.srt"` } : {}) });
      return res.end(metin);
    }
    if (alt === '/render/iptal' && req.method === 'POST') { const r = renderler.get(ad); if (r) r.iptal.var = true; return json(res, { tamam: true }); }
    if (alt === '/kare' && req.method === 'GET') {
      const zamanlar = (u.searchParams.get('t') || '0').split(',').map(Number).filter(x => !isNaN(x));
      const f = await kareler(ad, zamanlar, { port: PORT });
      return json(res, { dosyalar: f });
    }
    if (alt === '/klasor' && req.method === 'POST') {
      // Finder'da ham klasörünü aç (yalnız bu makineden)
      const { spawn } = await import('node:child_process');
      const b = await govde(req);
      spawn('open', [b.hangi === 'cikti' ? p.cikti : b.hangi === 'muzik' ? p.muzik : p.ham]);
      return json(res, { tamam: true });
    }
    json(res, { hata: 'bilinmeyen istek' }, 404);
  } catch (e) {
    console.error(e);
    try { json(res, { hata: String(e.message || e) }, 500); } catch { }
  }
});

fs.mkdirSync(PROJELER, { recursive: true });
fs.mkdirSync(MEDYA, { recursive: true });
for (const ad of projeListesi()) izle(ad);
// Varsayılan: yalnız bu Mac. Telefondan izlemek için: STUDYO_AG=1 npm start
const ADRES = process.env.STUDYO_AG === '1' ? '0.0.0.0' : '127.0.0.1';
sunucu.listen(PORT, ADRES, () => {
  const ag = Object.values(os.networkInterfaces()).flat().find(i => i && i.family === 'IPv4' && !i.internal);
  console.log(`Üçler Stüdyo hazır:  http://localhost:${PORT}` + (ADRES === '0.0.0.0' && ag ? `   (aynı Wi-Fi'deki telefondan: http://${ag.address}:${PORT})` : ''));
  console.log(`Ham çekimler: ${MEDYA}/<proje>/ham`);
  if (!fs.existsSync(MODEL)) console.log('UYARI: Whisper modeli yok: ' + MODEL);
});
