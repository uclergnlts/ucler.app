const { chromium } = require('playwright');
(async () => {
  const [,, mode, a, b] = process.argv;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + process.cwd() + '/scene.html');
  await page.evaluate(() => document.fonts.ready);
  page.on('console', m => console.log('console:', m.text()));
  if (mode === 'stills') {
    for (const t of a.split(',').map(Number)) { await page.evaluate(t => render(t), t); await page.screenshot({ path: `still_${t}.png` }); }
  } else {
    const fps = 30, n = Math.ceil(Number(a) * fps);
    for (let i = 0; i < n; i++) { await page.evaluate(t => render(t), i / fps); await page.screenshot({ path: `frames/f${String(i).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 92 }); }
  }
  await browser.close();
})();
