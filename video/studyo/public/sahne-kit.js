// Her sahne dosyası bunu yükler: <script src="/studyo/sahne-kit.js"></script>
// Sahne window.render(t) tanımlar; t = sahnenin kendi başlangıcından beri geçen saniye.
// SAHNE.w / SAHNE.h: çizim alanı (tam ekran 1920x1080, yan panel 846x1080). SAHNE.ayar: kurgu.json'daki "ayar".
(function () {
  const q = new URLSearchParams(location.search);
  const S = window.SAHNE = {
    w: +q.get('w') || 1920, h: +q.get('h') || 1080, sure: +q.get('sure') || 4,
    yer: q.get('yer') || 'tam', ayar: q.get('ayar') ? JSON.parse(q.get('ayar')) : {},
  };
  const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/fonts/fonts-local.css';
  document.head.appendChild(link);
  // Canvas yazıları için yazı tiplerini baştan yükle (yoksa ilk karelerde başka yazı tipi görünür)
  window.FONT_HAZIR = new Promise(r => link.onload = r).then(() => Promise.all(['500', '700', '800'].map(w => document.fonts.load(`${w} 40px Manrope`, 'ğüşıöçĞÜŞİÖÇ')))).catch(() => { });
  const st = document.createElement('style');
  st.textContent = `html,body{margin:0;width:${S.w}px;height:${S.h}px;overflow:hidden;background:transparent;font-family:Manrope,sans-serif}`;
  document.head.appendChild(st);
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  window.K = {
    cl,
    ez: x => 1 - Math.pow(1 - cl(x), 3),
    ezio: x => { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    back: x => { x = cl(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    win: (t, a, b, fi = .3, fo = .25) => Math.min(1 - Math.pow(1 - cl((t - a) / fi), 3), 1 - Math.pow(1 - cl((b - t) / fo), 3)),
    renk: { mavi: '#2F7CF6', lacivert: '#13233F', turuncu: '#FF7A1A', sari: '#FFC83D', kirmizi: '#FF4F4F', yesil: '#22B573', kagit: '#F6F2EA', mor: '#7B5CFF', gece: '#0B1020' },
    // Yüksek çözünürlüklü canvas (4K çıktıda keskin kalsın)
    canvas(el) {
      const dpr = window.devicePixelRatio || 1;
      el.width = S.w * dpr; el.height = S.h * dpr; el.style.width = S.w + 'px'; el.style.height = S.h + 'px';
      const c = el.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); return c;
    },
  };
})();
