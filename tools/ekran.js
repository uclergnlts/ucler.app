// Sitenin her hazır konusunu telefon boyutunda kart kart ekran görüntüsüne alır.
// Kullanım: NODE_PATH=$(npm root -g) node tools/ekran.js [cikti-klasoru]
// Gerekenler: node, playwright (chromium).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(root, 'ekran'));
fs.mkdirSync(out, { recursive: true });
global.window = {};
for (const f of ['fizik', 'kimya', 'biyoloji']) require(path.join(root, 'site', f + '.js'));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const url = 'file://' + path.join(root, 'site', 'index.html');
  for (const h of ['', 'kesfet', 'kayit', 'profil', 'fizik', 'kimya', 'biyoloji']) {
    await p.goto(url + '#' + h); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, `sayfa-${h || 'ana'}.png`), fullPage: true });
  }
  for (const [ders, konular] of Object.entries(window.DERS)) {
    for (const [id, t] of Object.entries(konular)) {
      await p.goto(url + '#' + ders + '.' + id); await p.waitForTimeout(400);
      for (let i = 0; i < t.cards.length; i++) {
        await p.screenshot({ path: path.join(out, `${ders}.${id}.${String(i + 1).padStart(2, '0')}.png`) });
        const next = await p.$('[data-next]');
        if (next) { await next.click(); await p.waitForTimeout(250); }
      }
    }
  }
  console.log(errs.length ? 'Sayfa hataları:\n' + errs.join('\n') : 'Sayfa hatası yok', '->', out);
  await b.close();
})();
