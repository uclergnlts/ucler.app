// Yatay YouTube videoları için dolu, atmosferik sahne parçaları (SVG string üretir).
// Hepsi zamana ve tohuma bağlıdır; aynı girdi her karede aynı çizimi verir.
// Renk paletleri: alacakaranlık (mor-turuncu), gece (lacivert), sabah (şeftali-mavi), kış.
(function (kok) {
  const NAVY = '#1d3557';
  let idSay = 0;
  const yeniId = ad => ad + (idSay++);
  function rnd(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  const PALET = {
    alaca: { gok: ['#2a2457', '#6a3f86', '#d9708a', '#ffb07a'], bina: ['#4a3a78', '#3a2e66', '#2b2350'], pencere: '#ffd58a', duvar: ['#8a6fae', '#6d5893'], zemin: ['#8a6470', '#6a4b58'] },
    gece: { gok: ['#0f1433', '#1f2a5c', '#3b3f7a', '#5d4a86'], bina: ['#2a3266', '#222852', '#1a1f40'], pencere: '#ffcf6e', duvar: ['#6a62a3', '#554d8c'], zemin: ['#7a5a6a', '#5e4452'] },
    sabah: { gok: ['#8fc3ff', '#bfe0ff', '#ffe1c2', '#ffc49a'], bina: ['#9fb3d9', '#8aa0c9', '#7489b5'], pencere: '#fff3c9', duvar: ['#f4e6d6', '#ead6c2'], zemin: ['#c99a72', '#a97c58'] },
  };

  // dikey gradyan tanımı
  function gradyan(id, renkler, x2 = 0, y2 = 1) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">` + renkler.map((r, i) => `<stop offset="${i / (renkler.length - 1)}" stop-color="${r}"/>`).join('') + '</linearGradient>';
  }
  function isikDef(id, renk, op = .55) {
    return `<radialGradient id="${id}"><stop offset="0" stop-color="${renk}" stop-opacity="${op}"/><stop offset="1" stop-color="${renk}" stop-opacity="0"/></radialGradient>`;
  }
  // yumuşak ışık lekesi
  function isik(x, y, r, renk = '#ffd27a', op = .5, sy = 1) {
    const id = yeniId('i');
    return `<defs>${isikDef(id, renk, op)}</defs><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * sy}" fill="url(#${id})"/>`;
  }

  // gökyüzü: dikdörtgen içinde gradyan, yıldızlar, ay/güneş
  function gok(x, y, w, h, palet, o = {}) {
    const P = PALET[palet] || palet, id = yeniId('g');
    let s = `<defs>${gradyan(id, P.gok)}</defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
    if (o.yildiz) { const R = rnd(o.tohum || 5); for (let i = 0; i < o.yildiz; i++) { const sx = x + R() * w, sy = y + R() * h * .55, tw = .5 + .5 * Math.sin((o.t || 0) * 2 + i); s += `<circle cx="${sx}" cy="${sy}" r="${1 + R() * 1.8}" fill="#fff" opacity="${.35 + .5 * tw}"/>`; } }
    if (o.ay) { const [ax, ay, ar] = o.ay; s += isik(ax, ay, ar * 4, '#fff1c4', .35) + `<circle cx="${ax}" cy="${ay}" r="${ar}" fill="#fff4d6"/><circle cx="${ax + ar * .45}" cy="${ay - ar * .2}" r="${ar * .9}" fill="${P.gok[1]}" opacity=".9"/>`; }
    if (o.gunes) { const [gx, gy, gr] = o.gunes; s += isik(gx, gy, gr * 5, '#ffcf8a', .6) + `<circle cx="${gx}" cy="${gy}" r="${gr}" fill="#ffe2a8"/>`; }
    if (o.bulut) { const R = rnd((o.tohum || 5) + 9); for (let i = 0; i < o.bulut; i++) { const bx = x + ((R() * w + (o.t || 0) * 6 * (1 + i % 3)) % (w + 300)) - 150, by = y + h * (.12 + R() * .35), bs = .6 + R() * .8; s += `<g transform="translate(${bx} ${by}) scale(${bs})" opacity=".55"><ellipse cx="0" cy="0" rx="90" ry="18" fill="#fff"/><ellipse cx="-30" cy="-10" rx="40" ry="18" fill="#fff"/><ellipse cx="20" cy="-14" rx="46" ry="22" fill="#fff"/></g>`; } }
    return s;
  }

  // şehir silueti: üç katman, yanan pencereler
  function sehir(x, y, w, taban, palet, tohum = 3, t = 0) {
    const P = PALET[palet] || palet; let s = '';
    [0, 1, 2].forEach(k => {
      const R = rnd(tohum * 7 + k * 31); let bx = x - 20;
      const yukMax = [240, 190, 130][k], yukMin = [90, 70, 50][k];
      while (bx < x + w) {
        const bw = 50 + R() * 90, bh = yukMin + R() * (yukMax - yukMin);
        s += `<rect x="${bx}" y="${taban - bh}" width="${bw}" height="${bh + 4}" fill="${P.bina[k]}"/>`;
        if (R() > .7) s += `<rect x="${bx + bw * .4}" y="${taban - bh - 24}" width="4" height="24" fill="${P.bina[k]}"/>`;
        if (k > 0) for (let py = taban - bh + 14; py < taban - 12; py += 22) for (let px = bx + 8; px < bx + bw - 10; px += 18) {
          const r = R(); if (r > (k === 2 ? .55 : .7)) s += `<rect x="${px}" y="${py}" width="8" height="11" fill="${P.pencere}" opacity="${k === 2 ? .9 : .6}"/>`;
        }
        bx += bw + 4 + R() * 10;
      }
    });
    return s;
  }

  // pencere: çerçeve içinde gök + şehir
  function pencere(x, y, w, h, palet, o = {}) {
    const id = yeniId('p');
    let s = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id})">` + gok(x, y, w, h, palet, o) + sehir(x, y, w, y + h + 6, palet, o.tohum || 3, o.t) + '</g>';
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${o.cerceve || '#f3e7d9'}" stroke-width="16"/>`;
    s += `<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h * .45} H${x + w}" stroke="${o.cerceve || '#f3e7d9'}" stroke-width="10"/>`;
    s += `<rect x="${x - 26}" y="${y + h + 4}" width="${w + 52}" height="16" rx="4" fill="${o.cerceve || '#f3e7d9'}"/>`;
    if (o.perde !== false) { // perdeler
      const pr = o.perdeRenk || '#c96f6f';
      s += `<path d="M${x - 40} ${y - 30} q30 ${h * .5} 10 ${h + 40} h46 q-12 ${-h * .6} 20 ${-h - 40} Z" fill="${pr}" opacity=".95"/>`;
      s += `<path d="M${x + w + 40} ${y - 30} q-30 ${h * .5} -10 ${h + 40} h-46 q12 ${-h * .6} -20 ${-h - 40} Z" fill="${pr}" opacity=".95"/>`;
      s += `<rect x="${x - 60}" y="${y - 38}" width="${w + 120}" height="10" rx="5" fill="#8a6a55"/>`;
    }
    return s;
  }

  // oda duvarı ve zemin
  function oda(palet, o = {}) {
    const P = PALET[palet] || palet, Y = o.zemin || 900;
    const g1 = yeniId('d'), g2 = yeniId('z');
    let s = `<defs>${gradyan(g1, P.duvar)}${gradyan(g2, P.zemin)}</defs>`;
    // kamera yakınlaştığında kenar boş kalmasın diye oda ekranın dışına taşar
    s += `<rect x="-960" width="3840" height="${Y}" fill="url(#${g1})"/>`;
    // duvar kâğıdı deseni
    s += `<g opacity=".08" stroke="#fff" stroke-width="2">`; for (let x = -920; x < 2880; x += 80) s += `<path d="M${x} 0 V${Y}"/>`; s += '</g>';
    s += `<rect x="-960" y="${Y}" width="3840" height="${1080 - Y + 200}" fill="url(#${g2})"/>`;
    s += `<g stroke="#000" stroke-opacity=".12" stroke-width="3">`; for (let x = -200; x < 2100; x += 150) s += `<path d="M${x} ${Y} L${960 + (x - 960) * 1.6} 1080"/>`; s += '</g>';
    s += `<rect x="-960" y="${Y - 26}" width="3840" height="26" fill="#000" opacity=".15"/>`;
    return s;
  }

  function saksi(x, y, olcek = 1, renk = '#4f9a6a', t = 0) {
    let s = `<g transform="translate(${x} ${y}) scale(${olcek})">`;
    const sal = Math.sin(t * 1.3) * 2;
    [[-50, -150, -40], [-10, -175, -5], [30, -150, 30], [-35, -110, -60], [25, -115, 55], [0, -135, 10]].forEach(([dx, dy, a], i) => {
      s += `<path d="M0 -40 Q${dx * .4} ${dy * .5} ${dx + sal} ${dy}" stroke="#3d7a52" stroke-width="5" fill="none"/>`;
      s += `<ellipse cx="${dx + sal}" cy="${dy}" rx="14" ry="30" transform="rotate(${a} ${dx + sal} ${dy})" fill="${i % 2 ? renk : '#6fbf86'}"/>`;
    });
    s += `<path d="M-38 -44 H38 L30 0 H-30 Z" fill="#d9825b"/><rect x="-42" y="-50" width="84" height="12" rx="4" fill="#c56e4a"/>`;
    return s + '</g>';
  }

  // raf: kitaplar, kavanozlar
  function raf(x, y, w, tohum = 1, o = {}) {
    const R = rnd(tohum * 13 + 1); let s = '';
    const renk = ['#e56b6f', '#4d8fd6', '#f2c14e', '#6dbf8b', '#9b7fd1', '#f08a5d', '#e9e4dc'];
    let bx = x + 10;
    while (bx < x + w - 30) {
      const tur = R();
      if (tur < .65) { const bw = 14 + R() * 12, bh = 50 + R() * 34, r = renk[(R() * renk.length) | 0]; s += `<rect x="${bx}" y="${y - bh}" width="${bw}" height="${bh}" rx="2" fill="${r}"/><rect x="${bx + 3}" y="${y - bh + 10}" width="${bw - 6}" height="4" fill="#fff" opacity=".35"/>`; bx += bw + 2; }
      else if (tur < .85) { s += `<path d="M${bx + 4} ${y} V${y - 40} h36 V${y} Z" fill="#cfe3f2" opacity=".85"/><rect x="${bx}" y="${y - 50}" width="44" height="12" rx="3" fill="#8a6a55"/>`; bx += 52; }
      else { s += saksi(bx + 26, y, .35, '#5aa877', o.t || 0); bx += 56; }
    }
    s += `<rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="#8a6a55"/><rect x="${x}" y="${y + 14}" width="${w}" height="6" fill="#000" opacity=".2"/>`;
    return s;
  }

  // tavandan sarkan lamba + ışık konisi
  function lamba(x, y, o = {}) {
    const acik = o.acik === undefined ? 1 : o.acik;
    let s = `<path d="M${x} 0 V${y - 40}" stroke="#2a2a3a" stroke-width="4"/>`;
    if (acik > 0) {
      const id = yeniId('l');
      s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity="${.45 * acik}"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient></defs>`;
      s += `<path d="M${x - 50} ${y} L${x - (o.yayilim || 380)} ${o.taban || 900} H${x + (o.yayilim || 380)} L${x + 50} ${y} Z" fill="url(#${id})"/>`;
      s += isik(x, y + 10, 160, '#ffcf7a', .5 * acik);
    }
    s += `<path d="M${x - 70} ${y} Q${x} ${y - 90} ${x + 70} ${y} Z" fill="${o.renk || '#e9a23b'}"/><ellipse cx="${x}" cy="${y}" rx="30" ry="10" fill="${acik > 0 ? '#fff2c2' : '#bbb'}"/>`;
    return s;
  }

  function cerceve(x, y, w, h, ic) { // duvardaki çerçeveli resim
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f6efe4" stroke="#8a6a55" stroke-width="8"/>` + (ic || '');
  }

  // kış manzarası: dağlar, çamlar, kar, kulübe
  function kisManzara(taban, t = 0, palet = 'alaca') {
    const P = PALET[palet] || palet; let s = '';
    s += gok(0, 0, 1920, taban + 40, palet, { yildiz: 70, t, ay: [1500, 160, 46], tohum: 4 });
    const dag = (renk, pts) => `<path d="M0 ${taban} ${pts} L1920 ${taban} Z" fill="${renk}"/>`;
    s += dag('#6b5a9c', 'L120 260 L330 330 L560 200 L780 320 L980 230 L1240 340 L1470 220 L1700 300 L1920 250');
    s += `<path d="M560 200 L610 236 L585 232 L560 250 L530 230 Z M1470 220 L1515 254 L1490 250 L1470 262 L1445 248 Z" fill="#efe9ff" opacity=".8"/>`;
    s += dag('#4e4280', 'L0 360 L200 300 L420 370 L700 290 L900 360 L1150 300 L1420 380 L1650 320 L1920 370');
    const R = rnd(17);
    for (let i = 0; i < 46; i++) { const x = R() * 1920, h = 40 + R() * 70, y = taban - 4 - R() * 30; s += `<path d="M${x} ${y - h} L${x - h * .32} ${y} H${x + h * .32} Z" fill="${R() > .5 ? '#2f2a5a' : '#3a3468'}"/>`; }
    // kulübe
    s += `<g transform="translate(240 ${taban - 8})"><rect x="0" y="-70" width="120" height="70" fill="#5b3b3b"/><path d="M-14 -66 L60 -120 L134 -66 Z" fill="#f2efff"/><rect x="46" y="-46" width="28" height="26" fill="#ffd27a"/>` + isik(60, -33, 70, '#ffcf7a', .45) + `<rect x="92" y="-112" width="14" height="30" fill="#5b3b3b"/>`;
    for (let i = 0; i < 4; i++) { const u = ((t * .4 + i * .25) % 1); s += `<circle cx="${99 + u * 30 + Math.sin(u * 6 + i) * 8}" cy="${-118 - u * 90}" r="${8 + u * 14}" fill="#dcd6f5" opacity="${.5 * (1 - u)}"/>`; }
    s += '</g>';
    return s;
  }

  // kar yağışı
  function kar(t, n = 60, tohum = 3, alanY = 1080) {
    const R = rnd(tohum); let s = '';
    for (let i = 0; i < n; i++) { const x0 = R() * 1920, hz = 30 + R() * 50, r = 1.5 + R() * 3.5; const y = ((R() * alanY + t * hz) % (alanY + 40)) - 20; s += `<circle cx="${x0 + Math.sin(t * .8 + i) * 18}" cy="${y}" r="${r}" fill="#fff" opacity="${.5 + R() * .4}"/>`; }
    return s;
  }

  // havada süzülen toz/ışık parçacıkları (bokeh)
  function bokeh(t, n = 24, tohum = 9, renk = '#ffe2a6', op = .25) {
    const R = rnd(tohum); let s = '';
    for (let i = 0; i < n; i++) { const x = R() * 1920, y0 = R() * 1080, r = 4 + R() * 18, hz = 6 + R() * 14; const y = ((y0 - t * hz) % 1100 + 1100) % 1100 - 10; s += `<circle cx="${x + Math.sin(t * .5 + i) * 20}" cy="${y}" r="${r}" fill="${renk}" opacity="${op * (.4 + .6 * Math.abs(Math.sin(t * .7 + i)))}"/>`; }
    return s;
  }

  // kenar karartması
  function vinyet(op = .45) {
    const id = yeniId('v');
    return `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#${id})"/>`;
  }

  // karakterin altına yumuşak gölge
  function golge(x, y, w = 70, op = .25) { return `<ellipse cx="${x}" cy="${y + 2}" rx="${w}" ry="${w * .16}" fill="#000" opacity="${op}"/>`; }

  // okunaklı etiket: beyaz yuvarlak kutu, lacivert yazı
  function etiket(x, y, yazi, o = {}) {
    const fs = o.boyut || 40, w = (o.gen || yazi.length * fs * .58) + 36, h = fs + 24, ax = o.hiza === 'sag' ? x - w : o.hiza === 'orta' ? x - w / 2 : x;
    return `<g opacity="${o.op === undefined ? 1 : o.op}"><rect x="${ax}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" opacity=".94"/><text x="${ax + w / 2}" y="${y + fs * .36}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="${fs}" fill="${o.renk || NAVY}">${yazi}</text></g>`;
  }

  kok.sahne = { etiket, PALET, gradyan, isik, gok, sehir, pencere, oda, saksi, raf, lamba, cerceve, kisManzara, kar, bokeh, vinyet, golge, rnd, yeniId, sifirla: () => { idSay = 0; } };
})(typeof window !== 'undefined' ? window : globalThis);
