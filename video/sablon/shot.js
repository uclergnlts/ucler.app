// Kare kare görüntü alma. Sahne klasöründe çalıştırılır (kaynak/<KOD>/).
//   tek kareler: node ../../sablon/shot.js stills 1,10,30
//   tüm kareler: mkdir frames && node ../../sablon/shot.js frames <saniye>
// Sayfa file:// yerine küçük bir yerel sunucudan açılır; Three.js gibi modül (import) kullanan
// kütüphaneler file:// altında çalışmaz. Sunucunun kökü video/ klasörüdür, böylece
// ../../sablon ve ../../node_modules yolları çalışır.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const KOK = path.resolve(__dirname, '..');
const TUR = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.mp3': 'audio/mpeg' };
(async () => {
  const [,, mode, a, dosya] = process.argv;
  const sunucu = http.createServer((req, res) => {
    const p = path.join(KOK, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(KOK) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TUR[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  await new Promise(r => sunucu.listen(0, '127.0.0.1', r));
  const yol = path.relative(KOK, process.cwd()).split(path.sep).join('/');
  // WebGL (Three.js, PixiJS) için yazılım GPU'su açılır. Yalnız SVG kullanan büyük yatay sahnelerde bu bayraklar
  // eski karenin parçalarını görüntüye karıştırabiliyor: o sahneler SADE=1 ile çekilir.
  const browser = await chromium.launch({ args: process.env.SADE ? [] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  // Yatay video için: GEN=1920 YUK=1080 node ../../sablon/shot.js ...  Ölçek: OLCEK=2 (yalnız stills)
  const W = Number(process.env.GEN || 1080), H = Number(process.env.YUK || 1920);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: Number(process.env.OLCEK || 1) });
  page.on('console', m => console.log('console:', m.text()));
  page.on('pageerror', e => console.log('hata:', e.message));
  await page.goto(`http://127.0.0.1:${sunucu.address().port}/${yol}/${dosya || 'scene.html'}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.hazirOl ? window.hazirOl() : null);
  // render(t) sonrası iki kare beklenir; yoksa büyük SVG değişiminde eski karenin parçaları görüntüye karışabiliyor.
  const ciz = t => page.evaluate(t => Promise.resolve(render(t)).then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))), t);
  if (mode === 'stills') {
    for (const t of a.split(',').map(Number)) { await ciz(t); await page.screenshot({ path: `still_${t}.png` }); }
  } else {
    const fps = 30, n = Math.ceil(Number(a) * fps);
    for (let i = 0; i < n; i++) { await ciz(i / fps); await page.screenshot({ path: `frames/f${String(i).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 92 }); }
  }
  await browser.close(); sunucu.close();
})();
