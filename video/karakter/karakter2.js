// ucler dikey video karakteri (2026-11-16): deneyi yapan ve anlatan kişi. karakter.js'teki Çizgi'nin
// ayrıntılı hâli: düz renkli, kontursuz; kapüşonlu üst, kot, spor ayakkabı, alnında deney gözlüğü.
// Poz arayüzü karakter.js ile aynıdır (kolO, kolA, bacakO, bacakA, yon, egim, bas, zipla, goz, kas, agiz, bakis),
// bu yüzden pozAra ve yuru ile birlikte kullanılabilir. Renkler CSS değişkeniyle değiştirilebilir (--k-*).
//
// Açılar derece. 0 = dik aşağı, artı = karakterin baktığı yöne doğru. yon: 1 sağa, -1 sola, 0 kameraya.
// agiz: 'gulus' | 'konus' | 'o' | 'duz' | 'yok'. gozluk: true ise alnında koruyucu gözlük durur, 'takili' ise gözündedir.
(function (kok) {
  const R = {
    ten: 'var(--k-ten,#ffd3ad)', tenG: 'var(--k-ten-g,#f2b088)', sac: 'var(--k-sac,#2b1b4a)',
    ust: 'var(--k-ust,#ffd166)', ustG: 'var(--k-ust-g,#f0aa34)', alt: 'var(--k-alt,#4b5bc4)', altG: 'var(--k-alt-g,#36429a)',
    ayk: 'var(--k-ayk,#ff5d8f)', aykG: 'var(--k-ayk-g,#d94474)', taban: 'var(--k-taban,#ffffff)',
    cam: 'var(--k-cam,#8fe3ff)', koyu: 'var(--k-koyu,#1c1440)', dil: 'var(--k-dil,#ff7a8a)', yanak: 'var(--k-yanak,#ff9a8a)',
  };
  const r = d => d * Math.PI / 180;
  let sayac = 0;
  const VARSAYILAN = {
    x: 0, y: 0, olcek: 1, yon: 1, egim: 0, bas: 0, zipla: 0,
    kolO: [10, 15], kolA: [-8, 15], bacakO: [4, 4], bacakA: [-4, 4],
    goz: 'acik', kas: 'duz', agiz: 'gulus', bakis: 0, gozluk: true,
  };

  function karakter2(p) {
    p = Object.assign({}, VARSAYILAN, p);
    const id = 'q' + (sayac++);
    const s = p.olcek, f = p.yon, F = f || 1;
    // yerel koordinat: ayaklar (0,0), yukarı eksi y
    const kalca = [0, -190 - p.zipla];
    const govdeBoy = 140;
    const eg = r(p.egim * F);
    const omuz = [kalca[0] + Math.sin(eg) * govdeBoy, kalca[1] - Math.cos(eg) * govdeBoy];
    const boyun = [omuz[0] + Math.sin(eg) * 16, omuz[1] - Math.cos(eg) * 16];
    const baAci = eg + r(p.bas * F);
    const basM = [boyun[0] + Math.sin(baAci) * 48, boyun[1] - Math.cos(baAci) * 48];

    const vek = (a, yan) => { const dx = f !== 0 ? f : yan; return [Math.sin(r(a)) * dx, Math.cos(r(a))]; };
    function kol(k, yan, o) {
      const [a, d] = k; const v1 = vek(a + p.egim, yan), v2 = vek(a + p.egim + d, yan);
      const dirsek = [o[0] + v1[0] * 74, o[1] + v1[1] * 74];
      const el = [dirsek[0] + v2[0] * 70, dirsek[1] + v2[1] * 70];
      return { dirsek, el, v2 };
    }
    function bacak(k, yan, o) {
      const [a, d] = k; const v1 = vek(a, yan), v2 = vek(a - d, yan);
      const diz = [o[0] + v1[0] * 96, o[1] + v1[1] * 96];
      const ayak = [diz[0] + v2[0] * 94, diz[1] + v2[1] * 94];
      return { diz, ayak };
    }
    const omuzA = f === 0 ? [omuz[0] - 40, omuz[1] + 12] : [omuz[0] - f * 8, omuz[1] + 10];
    const omuzO = f === 0 ? [omuz[0] + 40, omuz[1] + 12] : [omuz[0] + f * 4, omuz[1] + 12];
    const kalcaA = f === 0 ? [kalca[0] - 18, kalca[1]] : [kalca[0] - f * 6, kalca[1]];
    const kalcaO = f === 0 ? [kalca[0] + 18, kalca[1]] : [kalca[0] + f * 6, kalca[1]];
    const kA = kol(p.kolA, -1, omuzA), kO = kol(p.kolO, 1, omuzO);
    const bA = bacak(p.bacakA, -1, kalcaA), bO = bacak(p.bacakO, 1, kalcaO);

    const n = v => v.toFixed(1);
    const P = a => n(a[0]) + ' ' + n(a[1]);
    const cizgi = (pts, renk, w) => `<path d="M${pts.map(P).join(' L')}" stroke="${renk}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const ara = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

    function bacakCiz(b, kalcaN, renk) {
      let g = cizgi([kalcaN, b.diz, ara(b.diz, b.ayak, 0.86)], renk, 32); // paça ayakkabının üstünde biter
      // paça kıvrımı
      g += cizgi([ara(b.diz, b.ayak, 0.8), ara(b.diz, b.ayak, 0.86)], R.altG, 34);
      const [ax, ay] = b.ayak;
      if (f === 0) {
        g += `<ellipse cx="${n(ax)}" cy="${n(ay - 4)}" rx="24" ry="15" fill="${R.ayk}"/><rect x="${n(ax - 24)}" y="${n(ay - 2)}" width="48" height="8" rx="4" fill="${R.taban}"/>`;
      } else {
        g += `<path d="M${n(ax - f * 20)} ${n(ay - 22)} h${f * 26} q${f * 34} 2 ${f * 36} 20 h${-f * 62} z" fill="${R.ayk}"/>`;
        g += `<path d="M${n(ax + f * 4)} ${n(ay - 16)} l${f * 12} 6" stroke="${R.taban}" stroke-width="4" stroke-linecap="round"/>`;
        g += `<rect x="${n(Math.min(ax - f * 22, ax + f * 44))}" y="${n(ay - 4)}" width="66" height="9" rx="4.5" fill="${R.taban}"/>`;
      }
      return g;
    }

    function kolCiz(k, omuzN, renk, golge) {
      const bilek = ara(k.dirsek, k.el, 0.82);
      let g = cizgi([omuzN, k.dirsek, bilek], renk, 30);
      g += cizgi([ara(k.dirsek, k.el, 0.72), bilek], golge, 32); // manşet
      // el: avuç ve başparmak
      const [ex, ey] = k.el, [vx, vy] = k.v2;
      g += `<circle cx="${n(ex)}" cy="${n(ey)}" r="15" fill="${R.ten}"/>`;
      g += `<circle cx="${n(ex + vy * 11 * F + vx * 4)}" cy="${n(ey - vx * 11 * F + vy * 4)}" r="6.5" fill="${R.ten}"/>`;
      return g;
    }

    function govde() {
      const ux = Math.sin(eg), uy = -Math.cos(eg), nx = -uy, ny = ux;
      const ust = f === 0 ? 50 : 34, alt = f === 0 ? 42 : 31;
      const pt = (t, w) => [kalca[0] + ux * t + nx * w, kalca[1] + uy * t + ny * w];
      const yol = `M${P(pt(-8, -alt))} L${P(pt(govdeBoy - 26, -ust))} Q${P(pt(govdeBoy + 4, -ust))} ${P(pt(govdeBoy + 6, -ust + 26))}`
        + ` L${P(pt(govdeBoy + 6, ust - 26))} Q${P(pt(govdeBoy + 4, ust))} ${P(pt(govdeBoy - 26, ust))} L${P(pt(-8, alt))} Q${P(pt(-14, 0))} ${P(pt(-8, -alt))} Z`;
      let g = `<clipPath id="${id}g"><path d="${yol}"/></clipPath><path d="${yol}" fill="${R.ust}"/>`;
      g += `<g clip-path="url(#${id}g)">`;
      // sırt tarafında gölge, etek bandı, kanguru cep
      if (f !== 0) g += `<path d="M${P(pt(-20, -f * alt - f * 4))} L${P(pt(govdeBoy + 10, -f * ust - f * 4))} L${P(pt(govdeBoy + 10, -f * (ust - 22)))} L${P(pt(-20, -f * (alt - 18)))} Z" fill="${R.ustG}" opacity=".7"/>`;
      g += cizgi([pt(2, -alt - 6), pt(2, alt + 6)], R.ustG, 16);
      if (f === 0) g += `<path d="M${P(pt(28, -24))} L${P(pt(62, -18))} L${P(pt(62, 18))} L${P(pt(28, 24))} Z" fill="${R.ustG}"/>`;
      else g += `<path d="M${P(pt(26, f * 4))} L${P(pt(64, f * 10))} L${P(pt(60, f * 40))} L${P(pt(26, f * 40))} Z" fill="${R.ustG}"/>`;
      g += '</g>';
      // kapüşon ipleri
      const ip = f === 0 ? [-10, 10] : [f * 14, f * 24];
      ip.forEach((w, i) => { g += cizgi([pt(govdeBoy - 4, w), pt(govdeBoy - 40 - i * 8, w + (f === 0 ? (i ? 3 : -3) : f * 2))], R.taban, 4.5); });
      return g;
    }

    // boynun arkasındaki kapüşon
    function kapuson() {
      const [ox, oy] = omuz;
      if (f === 0) return `<ellipse cx="${n(ox)}" cy="${n(oy - 2)}" rx="54" ry="26" fill="${R.ustG}"/>`;
      return `<ellipse cx="${n(ox - f * 22)}" cy="${n(oy - 4)}" rx="36" ry="24" fill="${R.ustG}" transform="rotate(${-f * 18} ${n(ox - f * 22)} ${n(oy - 4)})"/>`;
    }

    function kafa() {
      const [hx, hy] = basM, Rk = 50;
      const ex = f === 0 ? [-17, 17] : [f * 9, f * 31];
      const bx = p.bakis * 4;
      let k = '';
      // kulak (yüzün arkasında)
      if (f === 0) k += `<circle cx="${n(hx - 50)}" cy="${n(hy + 6)}" r="10" fill="${R.ten}"/><circle cx="${n(hx + 50)}" cy="${n(hy + 6)}" r="10" fill="${R.ten}"/>`;
      k += `<clipPath id="${id}c"><circle cx="${n(hx)}" cy="${n(hy)}" r="${Rk}"/></clipPath>`;
      k += `<circle cx="${n(hx)}" cy="${n(hy)}" r="${Rk}" fill="${R.ten}"/>`;
      // çene altı gölgesi
      k += `<g clip-path="url(#${id}c)"><ellipse cx="${n(hx - F * 6)}" cy="${n(hy + 58)}" rx="46" ry="20" fill="${R.tenG}" opacity=".55"/></g>`;
      // saç: kafanın üstünde dolgun, öne kâkül
      const sac = f === 0
        ? 'M-52 8 C-60 -62 60 -62 52 8 C44 -14 26 -26 6 -22 C-12 -30 -40 -20 -52 8 Z'
        : 'M-52 18 C-66 -44 -12 -70 26 -56 C46 -50 58 -30 52 -12 C34 -28 12 -30 -4 -20 C-16 -12 -26 -4 -32 16 Z';
      k += `<path transform="translate(${n(hx)} ${n(hy)}) scale(${F} 1)" d="${sac}" fill="${R.sac}"/>`;
      k += `<path transform="translate(${n(hx)} ${n(hy)}) scale(${F} 1)" d="M-6 -58 q14 -22 30 -6 q-16 -4 -30 6 z" fill="${R.sac}"/>`;
      if (f !== 0) { // yandan kulak ve burun
        k += `<circle cx="${n(hx - f * 26)}" cy="${n(hy + 8)}" r="10" fill="${R.ten}"/><path d="M${n(hx - f * 28)} ${n(hy + 4)} q${-f * 5} 5 0 9" stroke="${R.tenG}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        k += `<circle cx="${n(hx + f * 48)}" cy="${n(hy + 10)}" r="7" fill="${R.ten}"/>`;
      } else k += `<path d="M${n(hx - 4)} ${n(hy + 12)} q4 5 8 0" stroke="${R.tenG}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      // yanaklar
      ex.forEach(e => { k += `<circle cx="${n(hx + e + (f === 0 ? Math.sign(e) * 9 : -f * 8))}" cy="${n(hy + 22)}" r="8" fill="${R.yanak}" opacity=".32"/>`; });
      // gözler ve kaşlar
      const takili = p.gozluk === 'takili';
      ex.forEach((e, i) => {
        const gx = hx + e, gy = hy + 2;
        if (p.goz === 'kapali') k += `<path d="M${n(gx - 8)} ${n(gy)} q8 6 16 0" stroke="${R.koyu}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        else if (p.goz === 'kisik') k += `<path d="M${n(gx - 7)} ${n(gy)} h14" stroke="${R.koyu}" stroke-width="4.5" stroke-linecap="round"/>`;
        else {
          const iri = p.goz === 'iri';
          k += `<ellipse cx="${n(gx)}" cy="${n(gy)}" rx="${iri ? 9.5 : 7.5}" ry="${iri ? 12 : 9.5}" fill="#fff"/>`;
          k += `<circle cx="${n(gx + bx + (f || 0) * 2)}" cy="${n(gy + 1)}" r="${iri ? 4.2 : 4.8}" fill="${R.koyu}"/>`;
          k += `<circle cx="${n(gx + bx + (f || 0) * 2 + 1.6)}" cy="${n(gy - 1.2)}" r="1.5" fill="#fff"/>`;
        }
        const yanI = f === 0 ? (i ? 1 : -1) : (i ? 1 : -1) * F;
        const kaslar = { duz: [0, 0], kalkik: [-6, 0], catik: [3, 14], uzgun: [3, -14], soru: [i ? -9 : 0, 0] };
        const [dy, ac] = kaslar[p.kas] || [0, 0];
        const kx = gx, ky = gy - 19 + dy, ang = r(ac) * yanI, L = 10;
        if (!takili) k += `<path d="M${n(kx - Math.cos(ang) * L)} ${n(ky - Math.sin(ang) * L)} L${n(kx + Math.cos(ang) * L)} ${n(ky + Math.sin(ang) * L)}" stroke="${R.sac}" stroke-width="5" stroke-linecap="round"/>`;
      });
      // deney gözlüğü: alında ya da gözde
      if (p.gozluk) {
        const gy = takili ? hy + 2 : hy - 30;
        const gxs = f === 0 ? [-18, 18] : [f * 8, f * 32];
        k += `<g clip-path="url(#${id}c)"><rect x="${n(hx - 54)}" y="${n(gy - 5)}" width="108" height="10" fill="${R.koyu}"/></g>`;
        gxs.forEach(g => { k += `<circle cx="${n(hx + g)}" cy="${n(gy)}" r="14" fill="${R.cam}" fill-opacity="${takili ? .45 : 1}" stroke="${R.koyu}" stroke-width="5"/>`; });
        if (!takili) gxs.forEach(g => { k += `<path d="M${n(hx + g - 6)} ${n(gy - 3)} l6 -5" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`; });
      }
      // ağız
      const mx = hx + (f === 0 ? 0 : f * 22), my = hy + 26;
      if (p.agiz === 'gulus') k += `<path d="M${n(mx - 10)} ${n(my - 2)} q10 10 20 0" stroke="${R.koyu}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
      else if (p.agiz === 'konus') k += `<path d="M${n(mx - 11)} ${n(my - 4)} h22 q-2 15 -11 15 q-9 0 -11 -15 z" fill="${R.koyu}"/><ellipse cx="${n(mx)}" cy="${n(my + 7)}" rx="6" ry="3.5" fill="${R.dil}"/>`;
      else if (p.agiz === 'o') k += `<ellipse cx="${n(mx)}" cy="${n(my + 1)}" rx="6.5" ry="8.5" fill="${R.koyu}"/><ellipse cx="${n(mx)}" cy="${n(my + 6)}" rx="4" ry="2.5" fill="${R.dil}"/>`;
      else if (p.agiz === 'duz') k += `<path d="M${n(mx - 8)} ${n(my)} h16" stroke="${R.koyu}" stroke-width="4.5" stroke-linecap="round"/>`;
      return k;
    }

    let g = `<g transform="translate(${n(p.x)} ${n(p.y)}) scale(${s})">`;
    g += kolCiz(kA, omuzA, R.ustG, R.ust);
    g += bacakCiz(bA, kalcaA, R.altG);
    g += bacakCiz(bO, kalcaO, R.alt);
    g += kapuson();
    g += govde();
    g += cizgi([omuz, boyun], R.tenG, 20);
    g += kafa();
    g += kolCiz(kO, omuzO, R.ust, R.ustG);
    g += '</g>';
    const dunya = q => [p.x + q[0] * s, p.y + q[1] * s];
    return { svg: g, elO: dunya(kO.el), elA: dunya(kA.el), bas: dunya(basM) };
  }

  kok.karakter2 = karakter2;
})(typeof window !== 'undefined' ? window : globalThis);
