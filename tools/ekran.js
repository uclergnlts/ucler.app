// Sitenin her sayfasını ve her hazır konuyu telefon boyutunda kart kart ekran görüntüsüne alır.
// Önce derle:  npm run build          (out/ klasörünü üretir)
// Kullanım:    NODE_PATH=$(npm root -g) node tools/ekran.js [cikti-klasoru]
// Gerekenler: node, playwright (chromium).
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'out');
const out = path.resolve(process.argv[2] || path.join(root, 'ekran'));
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

const dersler = JSON.parse(fs.readFileSync(path.join(root, 'content', 'dersler.json'), 'utf8'));

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const pages = [['ana', '/'], ['kesfet', '/kesfet/'], ['oyunlar', '/oyunlar/'], ['profil', '/profil/'], ['videolar', '/videolar/'], ...Object.keys(dersler).map(d => [d, `/${d}/`])];
  for (const [ad, url] of pages) {
    await p.goto(base + url); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, `sayfa-${ad}.png`), fullPage: true });
  }
  for (const ders of Object.keys(dersler)) {
    const konular = JSON.parse(fs.readFileSync(path.join(root, 'content', ders + '.json'), 'utf8'));
    for (const [id, t] of Object.entries(konular)) {
      await p.goto(`${base}/${ders}/${id}/`); await p.waitForTimeout(400);
      for (let i = 0; i < t.cards.length; i++) {
        await p.screenshot({ path: path.join(out, `${ders}.${id}.${String(i + 1).padStart(2, '0')}.png`) });
        const next = await p.$('[data-next]');
        if (next) { await next.click(); await p.waitForTimeout(250); }
      }
    }
  }
  console.log(errs.length ? 'Sayfa hataları:\n' + errs.join('\n') : 'Sayfa hatası yok', '->', out);
  await b.close();
  server.close();
});
