// Sitenin genel sayfalarını ve her konunun ders akışını telefon boyutunda ekran görüntüsüne alır.
// Akış kartlar ile etkileşimli adımlardan oluşur; gezgin her adımın örneğini izler, görevi tamamlar
// (gerekirse "Çözümü göster" ile) ve sonra "Devam" der. Oynamayan ayar görevinde "Çözümü göster" 25 sn sonra
// çıkar; gezgin yalnızca bu bekleme süresini kısaltır, geri kalan her şey gerçek zamanda işler.
// Önce derle:  npm run build          (out/ klasörünü üretir)
// Kullanım:    NODE_PATH=$(npm root -g) node tools/ekran.js [cikti-klasoru] [ders/konu ...]
//              Konu verilirse yalnızca o konular çekilir (ör. kimya/modern-atom-teorisi fizik).
// Dosya adları: <ders>.<konu>.00-giris.png (aşama listesi), <ders>.<konu>.<sıra>-k<kart no>.png (kart),
// <ders>.<konu>.<sıra>-a<adım no>[-bitti].png (adım), ...-ara.png (aşama bitti ekranı).
// Gerekenler: node, playwright (chromium).
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'out');
const out = path.resolve(process.argv[2] || path.join(root, 'ekran'));
const secili = process.argv.slice(3);
if (!fs.existsSync(site)) { console.error('out/ yok. Önce "npm run build" çalıştır.'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

// out/ klasörünü yerelde sunan küçük bir sunucu
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let f = path.join(site, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(site)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

const oku = (f) => JSON.parse(fs.readFileSync(path.join(root, 'content', f), 'utf8'));
const dersler = oku('dersler.json');
const secildi = (ders, id) => !secili.length || secili.includes(ders) || secili.includes(`${ders}/${id}`);

/** Lesson.tsx ile aynı sıra: her kartın ardından o karta bağlı adımlar (adımların hepsi bir karta bağlıysa). */
function akis(ders, id, t) {
  const f = path.join(root, 'content', 'adimli', `${id}.json`);
  const a = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  const birlesik = a && a.ders === ders && a.adimlar.length && a.adimlar.every((x) => x.kart);
  const soruOnce = birlesik && a.soruOnce === true; // adımlar kartlarından önce gelir
  const liste = [];
  t.cards.forEach((_, k) => {
    if (!soruOnce) liste.push({ tur: 'kart', no: k + 1 });
    if (birlesik) a.adimlar.forEach((x, n) => { if (x.kart === k + 1) liste.push({ tur: 'adim', no: n + 1 }); });
    if (soruOnce) liste.push({ tur: 'kart', no: k + 1 });
  });
  return liste;
}

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  p.setDefaultTimeout(8000);
  // DersMotoru'daki COZUM_SURE (25000 ms) beklemesini kısalt.
  // Konular sırayla açılır (lib/kilit.ts): her konunun ekranı alınabilsin diye bütün ünite testleri geçilmiş sayılır.
  const uniteler = Object.fromEntries(Object.entries(require(path.join(root, 'content/dersler.json'))).flatMap(([d, v]) => v.konular.filter((k) => k.unite).map((_, i) => [`${d}.${i + 1}`, 100])));
  await p.addInitScript((u) => { try { if (!localStorage.getItem('tf-unite')) localStorage.setItem('tf-unite', JSON.stringify(u)); } catch {} }, uniteler);
  await p.addInitScript(() => { const st = window.setTimeout; window.setTimeout = (f, d, ...a) => st(f, d === 25000 ? 400 : d, ...a); });
  const ileri = (ms) => p.waitForTimeout(ms);
  const cek = async (ad) => { await ileri(1800); await p.screenshot({ path: path.join(out, `${ad}.png`) }); };
  const errs = [], takilan = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

  if (!secili.length) {
    const pages = [['ana', '/'], ['kesfet', '/kesfet/'], ['oyunlar', '/oyunlar/'], ['profil', '/profil/'], ['videolar', '/videolar/'], ['tekrar', '/tekrar/'], ...Object.keys(dersler).map(d => [d, `/${d}/`])];
    for (const [ad, url] of pages) {
      await p.goto(base + url); await ileri(1500);
      await p.screenshot({ path: path.join(out, `sayfa-${ad}.png`), fullPage: true });
    }
  }

  const devam = p.locator('[data-next]');
  const gorunur = async (l) => (await l.count()) > 0 && (await l.first().isVisible()) && (await l.first().isEnabled());

  /** Son adımın görevini bitirir: örnek → sen dene → (tahmin / seçim / ayar) → gerekirse çözüm. */
  async function gorevBitir(adim) {
    const d = p.locator('.ad-akista').last();
    const opt = d.locator('.ad-soru .opt:not([disabled])');
    const oynat = d.locator('.ad-oynat');
    let degisim = 0; // seçim görevinde her koşu farklı değerle
    const oynuyor = async () => (await oynat.count()) > 0 && (await oynat.isDisabled());
    for (let tur = 0; tur < 150; tur++) {
      if (await devam.isEnabled()) return true;
      if (await oynuyor()) { await ileri(400); continue; }
      const sen = d.getByRole('button', { name: 'Şimdi sen dene' });
      if (await sen.count()) {
        if (await sen.isEnabled()) { await sen.click(); await ileri(500); } else await ileri(400);
        continue;
      }
      const cozum = d.locator('.ad-cozum', { hasText: 'Çözümü göster' });
      if (await gorunur(cozum)) { await cozum.first().click().catch(() => {}); await ileri(1500); continue; }
      if (await gorunur(opt)) { await opt.first().click().catch(() => {}); await ileri(800); continue; }
      if (await gorunur(oynat)) {
        // Seçim görevi farklı koşular isteyebilir: oynatmadan önce bir kontrolü değiştir.
        if (adim.gorev.tur === 'secim' && degisim++ > 0) await kontrolDegistir(d, degisim);
        await oynat.click(); await ileri(500); continue;
      }
      if (adim.gorev.tur === 'secim') await kontrolDegistir(d, degisim++);
      await ileri(500);
    }
    return devam.isEnabled();
  }
  async function kontrolDegistir(d, tur) {
    const iki = d.locator('.ad-iki button:not(.acik):not([disabled])');
    if (await iki.count()) { await iki.first().click(); return; }
    const anahtar = d.locator('.ad-anahtar:not([disabled])');
    if (await anahtar.count()) { await anahtar.nth(tur % (await anahtar.count())).click(); return; }
    const artir = d.locator('.ad-sayac button[aria-label$="artır"]:not([disabled])');
    const azalt = d.locator('.ad-sayac button[aria-label$="azalt"]:not([disabled])');
    if (await artir.count()) { await artir.first().click(); return; }
    if (await azalt.count()) { await azalt.first().click(); return; }
    const surgu = d.locator('.ad-surgu input:not([disabled])');
    if (await surgu.count()) {
      const s = surgu.first();
      const [min, max] = [Number(await s.getAttribute('min')), Number(await s.getAttribute('max'))];
      await s.fill(String(tur % 2 ? min : max));
    }
  }

  /** Test sorusuna bir cevap kurar ve (etkileşimliyse) "Kontrol et"e basar. */
  async function testCevapla(q) {
    const tur = q.tur || 'secim';
    if (tur === 'secim') { await p.locator('main article button').first().click(); await ileri(400); return; }
    if (tur === 'sayi') await p.locator('main input[inputmode=decimal]').fill(String(q.cevap));
    else if (tur === 'ayir') for (let k = 0; k < q.ogeler.length; k++) { await p.locator('[data-grup]').nth(k % q.gruplar.length).click(); await ileri(120); }
    else if (tur === 'sahne') await kontrolDegistir(p.locator('main'), 0);
    else while (await p.locator('[data-cip]').count()) { await p.locator('[data-cip]').first().click(); await ileri(120); }
    await p.getByRole('button', { name: 'Kontrol et' }).click(); await ileri(400);
  }

  for (const ders of Object.keys(dersler)) {
    const konular = oku(ders + '.json');
    for (const [id, t] of Object.entries(konular)) {
      if (!secildi(ders, id)) continue;
      const adimli = fs.existsSync(path.join(root, 'content', 'adimli', `${id}.json`)) ? oku(`adimli/${id}.json`) : null;
      await p.goto(`${base}/${ders}/${id}/`); await ileri(800);
      const liste = akis(ders, id, t);
      // Konu girişi (aşama listesi) → "Başla" ile 1. aşama.
      try { await cek(`${ders}.${id}.00-giris`); await devam.click(); await ileri(600); } catch (e) { takilan.push(`${ders}/${id}: ${e.message.split('\n')[0]}`); continue; }
      let takildi = false;
      try { for (let j = 0; j < liste.length; j++) {
        const o = liste[j], ad = `${ders}.${id}.${String(j + 1).padStart(2, '0')}-${o.tur === 'kart' ? 'k' : 'a'}${o.no}`;
        await cek(ad);
        if (o.tur === 'kart' && t.cards[o.no - 1].once) {
          // Soru önce kartı: şıklara sırayla dokun (ilki çoğu zaman yanlış; ipucu ekranı da görülsün).
          const sik = p.locator('[data-akis]').last().locator('.ad-soru .opt:not([disabled])');
          for (let k = 0; k < 4 && !(await devam.isEnabled()); k++) { await sik.first().click().catch(() => {}); await ileri(700); }
          await cek(`${ad}-bitti`);
          if (!(await devam.isEnabled())) { takilan.push(`${ders}/${id} kart ${o.no} sorusu`); takildi = true; break; }
        }
        if (o.tur === 'adim') {
          const ok = await gorevBitir(adimli.adimlar[o.no - 1]);
          await cek(`${ad}-bitti`);
          if (!ok) { takilan.push(`${ders}/${id} adım ${o.no}`); takildi = true; break; }
        }
        if (await devam.isEnabled()) {
          await devam.click(); await ileri(600);
          // Aşama sonu ekranı: görüntüsünü al, sonraki aşamaya (ya da teste) geç.
          if (await p.getByRole('heading', { name: /aşama bitti$/ }).count()) { await cek(`${ad}-ara`); const sonra = p.getByRole('button', { name: 'Şimdi değil' }); if (await sonra.count()) { await sonra.click(); await ileri(400); } await devam.click(); await ileri(600); }
        }
      }
      // Konu sonu testi: her soruyu cevapla (çoğu zaman yanlış; amaç geri bildirim ekranlarını görmek).
      if (!takildi) for (let j = 0; j < t.quiz.length; j++) {
        const ad = `${ders}.${id}.t${j + 1}`;
        await cek(ad);
        await testCevapla(t.quiz[j]);
        await cek(`${ad}-sonuc`);
        await devam.click(); await ileri(500);
      }
      if (!takildi) await cek(`${ders}.${id}.sonuc`);
      } catch (e) { takilan.push(`${ders}/${id}: ${e.message.split('\n')[0]}`); }
    }
  }
  if (takilan.length) console.log('Tamamlanamayan adımlar:\n' + takilan.join('\n'));
  console.log(errs.length ? 'Sayfa hataları:\n' + errs.join('\n') : 'Sayfa hatası yok', '->', out);
  await b.close();
  server.close();
  process.exit(errs.length || takilan.length ? 1 : 0);
});
