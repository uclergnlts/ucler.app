// Sahne köprüsü: scene.html'i hem shot.js hem HyperFrames ile çalıştırır.
// scene.html içinde, sahne kodundan ÖNCE yüklenir:
//   <script src="../../sablon/kopru.js"></script>
// - ucler.hazir(promise): kütüphane kurulumu (Three/Pixi yükleme, Manim karelerini önceden açma)
//   bitmeden kare alınmaz. shot.js window.hazirOl()'u, HyperFrames __hf.buildReady'yi bekler.
// - HyperFrames her karede "hf-seek" olayı gönderir; köprü bunu window.render(t)'ye çevirir.
//   render bir Promise döndürürse (resim çözme vb.) kare onun bitmesini bekler.
(function () {
  const bekleyen = [];
  window.__hf = window.__hf || {};
  window.__hf.buildReady = window.__hf.buildReady || {};
  window.ucler = {
    hazir(p) { bekleyen.push(p); window.__hf.buildReady['ucler' + bekleyen.length] = p; return p; },
  };
  window.hazirOl = () => Promise.all(bekleyen);
  window.addEventListener('hf-seek', (e) => {
    if (typeof window.render !== 'function') return;
    const r = window.render(e.detail.time);
    if (r && typeof r.then === 'function') e.detail.waitUntil(r);
  });
})();
