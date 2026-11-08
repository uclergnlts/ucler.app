// ucler YouTube karakteri: konuşmasız yatay videolarda her sahnede yer alan kişi.
// karakter(poz) bir SVG parçası (string) ve el, baş konumlarını döndürür.
// Her şey poz'a bağlıdır; zaman yoktur. Sahne zamanı poz'a çevirir (bkz. pozAra, yuru).
//
// Açılar derece. 0 = dik aşağı, artı = karakterin baktığı yöne doğru.
//   kolO / kolA: [omuz, dirsek]  (O = öndeki, A = arkadaki)
//   bacakO / bacakA: [kalça, diz]
// yon: 1 sağa bakar, -1 sola bakar, 0 kameraya bakar.
// tip: 'A' Çizgi (sarı kapüşonlu), 'B' Gölge (dolu siluet), 'C' Laborant (önlüklü, gözlüklü).
(function (kok) {
  const NAVY = '#1d3557', SARI = '#ffd95a', BEYAZ = '#ffffff', GRI = '#9aa6b6', ARKA = '#3d5a80';
  const r = d => d * Math.PI / 180;
  let sayac = 0;

  const VARSAYILAN = {
    x: 0, y: 0, olcek: 1, yon: 1, egim: 0, bas: 0, zipla: 0,
    kolO: [10, 15], kolA: [-8, 15], bacakO: [4, 4], bacakA: [-4, 4],
    goz: 'acik', kas: 'duz', agiz: 'yok', bakis: 0, tip: 'A', renk: SARI,
  };

  function karakter(p) {
    p = Object.assign({}, VARSAYILAN, p);
    const id = 'k' + (sayac++);
    const s = p.olcek, f = p.yon;
    const B = p.tip === 'B', C = p.tip === 'C';
    const kalin = B ? 17 : (C ? 12 : 14);
    const uzuv = B ? NAVY : NAVY, uzuvArka = B ? '#2a4566' : ARKA;
    // yerel koordinat: ayaklar (0,0), yukarı eksi y
    const kalca = [0, -190 - p.zipla];
    const govdeBoy = 140;
    const eg = r(p.egim * (f || 1));
    const omuz = [kalca[0] + Math.sin(eg) * govdeBoy, kalca[1] - Math.cos(eg) * govdeBoy];
    const boyun = [omuz[0] + Math.sin(eg) * 14, omuz[1] - Math.cos(eg) * 14];
    const baAci = eg + r(p.bas * (f || 1));
    const basM = [boyun[0] + Math.sin(baAci) * 46, boyun[1] - Math.cos(baAci) * 46];

    // uzuv yön vektörü: açı a, yan işareti (önden bakışta sol -1, sağ +1)
    const vek = (a, yan) => { const dx = f !== 0 ? f : yan; return [Math.sin(r(a)) * dx, Math.cos(r(a))]; };
    function kol(k, yan, omuzN) {
      const [a, d] = k; const v1 = vek(a + p.egim, yan), v2 = vek(a + p.egim + d, yan);
      const dirsek = [omuzN[0] + v1[0] * 74, omuzN[1] + v1[1] * 74];
      const el = [dirsek[0] + v2[0] * 70, dirsek[1] + v2[1] * 70];
      return { dirsek, el };
    }
    function bacak(k, yan, kalcaN) {
      const [a, d] = k; const v1 = vek(a, yan), v2 = vek(a - d, yan);
      const diz = [kalcaN[0] + v1[0] * 96, kalcaN[1] + v1[1] * 96];
      const ayak = [diz[0] + v2[0] * 94, diz[1] + v2[1] * 94];
      return { diz, ayak };
    }
    const omuzA = f === 0 ? [omuz[0] - 34, omuz[1] + 8] : [omuz[0] - f * 6, omuz[1] + 6];
    const omuzO = f === 0 ? [omuz[0] + 34, omuz[1] + 8] : [omuz[0] + f * 4, omuz[1] + 8];
    const kalcaA = f === 0 ? [kalca[0] - 15, kalca[1]] : [kalca[0] - f * 4, kalca[1]];
    const kalcaO = f === 0 ? [kalca[0] + 15, kalca[1]] : [kalca[0] + f * 4, kalca[1]];
    const kA = kol(p.kolA, -1, omuzA), kO = kol(p.kolO, 1, omuzO);
    const bA = bacak(p.bacakA, -1, kalcaA), bO = bacak(p.bacakO, 1, kalcaO);

    const P = a => a[0].toFixed(1) + ' ' + a[1].toFixed(1);
    const cizgi = (pts, renk, w) => `<path d="M${pts.map(P).join(' L')}" stroke="${renk}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    function ayakkabi(b, renk) {
      if (f === 0) return `<ellipse cx="${b.ayak[0]}" cy="${b.ayak[1] + 2}" rx="16" ry="8" fill="${renk}"/>`;
      return cizgi([[b.ayak[0] - f * 4, b.ayak[1]], [b.ayak[0] + f * 22, b.ayak[1]]], renk, kalin + 2);
    }
    const elC = (k, renk) => `<circle cx="${k.el[0].toFixed(1)}" cy="${k.el[1].toFixed(1)}" r="${kalin * 0.62}" fill="${renk}"/>`;

    // gövde: omuzdan kalçaya yuvarlak dörtgen (eksene göre)
    function govde() {
      const ux = Math.sin(eg), uy = -Math.cos(eg); // yukarı eksen
      const nx = -uy, ny = ux;                     // yana eksen
      const ust = f === 0 ? 40 : 27, alt = f === 0 ? 31 : 24;
      const altUz = C ? -70 : 2; // önlük kalçanın altına iner
      const pt = (t, w) => [kalca[0] + ux * t + nx * w, kalca[1] + uy * t + ny * w];
      const ea = C ? 10 : 0;
      // yuvarlak omuzlar, hafif daralan bel
      let yol = `M${P(pt(altUz, -alt - ea))} L${P(pt(govdeBoy - 22, -ust))} Q${P(pt(govdeBoy, -ust))} ${P(pt(govdeBoy + 2, -ust + 20))}`
        + ` L${P(pt(govdeBoy + 2, ust - 20))} Q${P(pt(govdeBoy, ust))} ${P(pt(govdeBoy - 22, ust))} L${P(pt(altUz, alt + ea))}`
        + ` Q${P(pt(altUz - 4, 0))} ${P(pt(altUz, -alt - ea))} Z`;
      const dolgu = B ? NAVY : (C ? BEYAZ : p.renk);
      let s2 = `<path d="${yol}" fill="${dolgu}" stroke="${NAVY}" stroke-width="${B ? 0 : 5}" stroke-linejoin="round"/>`;
      if (!B && !C) { // kapüşon yakası, bel bandı
        if (f === 0) s2 += `<path d="M${P(pt(govdeBoy, -24))} Q${P(pt(govdeBoy - 30, 0))} ${P(pt(govdeBoy, 24))}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
        else s2 += `<path d="M${P(pt(govdeBoy - 6, -f * 4))} Q${P(pt(govdeBoy + 30, -f * 30))} ${P(pt(govdeBoy - 30, -f * 26))}" fill="${p.renk}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
        s2 += `<path d="M${P(pt(altUz + 14, -alt + 4))} L${P(pt(altUz + 14, alt - 4))}" stroke="${NAVY}" stroke-width="4" stroke-linecap="round" opacity=".35"/>`;
      }
      if (C) { // önlük yakası ve düğmeler
        s2 += `<path d="M${P(pt(govdeBoy, f ? f * 4 : -10))} L${P(pt(govdeBoy - 50, f ? f * 14 : 0))} L${P(pt(govdeBoy, f ? f * 24 : 10))}" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`;
        s2 += `<path d="M${P(pt(govdeBoy - 50, f ? f * 14 : 0))} L${P(pt(altUz + 4, f ? f * 14 : 0))}" stroke="${NAVY}" stroke-width="3" opacity=".6"/>`;
        s2 += `<path d="M${P(pt(30, f ? -f * 12 : -24))} h${f ? f * 18 : 16}" stroke="${GRI}" stroke-width="4" stroke-linecap="round"/>`;
      }
      return s2;
    }

    function kafa() {
      const [hx, hy] = basM, R = 44;
      const ex = f === 0 ? [-15, 15] : [f * 8, f * 27];
      const bx = p.bakis * 5; // gözlerin yukarı/aşağı kayması değil, sağa-sola
      let k = '';
      const dolgu = B ? NAVY : BEYAZ;
      k += `<clipPath id="${id}c"><circle cx="${hx}" cy="${hy}" r="${R}"/></clipPath>`;
      k += `<circle cx="${hx}" cy="${hy}" r="${R}" fill="${dolgu}" stroke="${NAVY}" stroke-width="${B ? 0 : 5}"/>`;
      if (!B && !C) { // kısa saç, öne doğru kâkül
        const sac = f === 0
          ? 'M-46 6 C-50 -52 50 -52 46 6 C40 -16 20 -26 4 -24 C-12 -26 -36 -18 -46 6 Z'
          : 'M-46 14 C-58 -40 -10 -62 22 -50 C40 -44 50 -28 46 -14 C30 -26 10 -28 -4 -20 C-14 -14 -24 -6 -30 12 Z';
        k += `<g clip-path="url(#${id}c)"><path transform="translate(${hx} ${hy}) scale(${f || 1} 1)" d="${sac}" fill="${NAVY}"/></g>`;
        if (f !== 0) k += `<path d="M${hx - f * 24} ${hy + 2} q${-f * 9} 8 0 17" stroke="${NAVY}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      }
      if (C) { // dağınık saç + alında koruyucu gözlük
        let z = `M${hx - 46} ${hy - 12}`;
        for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; const rr = i % 2 ? 66 : 48; z += ` L${(hx + Math.cos(a) * rr).toFixed(1)} ${(hy + Math.sin(a) * rr - 6).toFixed(1)}`; }
        k += `<g clip-path="url(#${id}c)"><path d="${z} Z" fill="${NAVY}"/></g>`;
        k += `<path d="${z}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round" opacity="0"/>`;
        k += `<rect x="${hx - 46}" y="${hy - 28}" width="92" height="10" fill="${NAVY}"/>`;
        const gx = f === 0 ? [-16, 16] : [f * 6, f * 28];
        gx.forEach(g => k += `<circle cx="${hx + g}" cy="${hy - 24}" r="12" fill="${SARI}" stroke="${NAVY}" stroke-width="4"/>`);
      }
      // gözler
      const gr = B ? NAVY : NAVY;
      ex.forEach((e, i) => {
        const gx = hx + e + bx, gy = hy + 2;
        if (B) {
          if (p.goz === 'kapali') k += `<path d="M${gx - 8} ${gy} q8 6 16 0" stroke="${BEYAZ}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
          else {
            const ry = p.goz === 'iri' ? 13 : (p.goz === 'kisik' ? 5 : 10);
            k += `<ellipse cx="${gx}" cy="${gy}" rx="${p.goz === 'iri' ? 10 : 8}" ry="${ry}" fill="${BEYAZ}"/>`;
            k += `<circle cx="${gx + (f || 0) * 3}" cy="${gy + 1}" r="${p.goz === 'iri' ? 3.5 : 4}" fill="${NAVY}"/>`;
          }
        } else {
          if (p.goz === 'kapali') k += `<path d="M${gx - 7} ${gy} q7 5 14 0" stroke="${gr}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
          else if (p.goz === 'kisik') k += `<path d="M${gx - 6} ${gy} h12" stroke="${gr}" stroke-width="4.5" stroke-linecap="round"/>`;
          else if (p.goz === 'iri') k += `<circle cx="${gx}" cy="${gy}" r="8" fill="${BEYAZ}" stroke="${gr}" stroke-width="3.5"/><circle cx="${gx}" cy="${gy}" r="3" fill="${gr}"/>`;
          else k += `<ellipse cx="${gx}" cy="${gy}" rx="4.6" ry="5.6" fill="${gr}"/>`;
        }
        // kaşlar
        const kasR = B ? BEYAZ : NAVY;
        const yanI = f === 0 ? (i ? 1 : -1) : (i ? 1 : -1) * (f || 1);
        const kaslar = { duz: [0, 0], kalkik: [-6, 0], catik: [3, 14], uzgun: [3, -14], soru: [i ? -9 : 0, 0] };
        const [dy, ac] = kaslar[p.kas] || [0, 0];
        if (!(C && p.kas === 'duz')) {
          const kx = gx, ky = gy - 16 + dy;
          const ang = r(ac) * yanI;
          const L = 9;
          k += `<path d="M${(kx - Math.cos(ang) * L).toFixed(1)} ${(ky - Math.sin(ang) * L).toFixed(1)} L${(kx + Math.cos(ang) * L).toFixed(1)} ${(ky + Math.sin(ang) * L).toFixed(1)}" stroke="${kasR}" stroke-width="4" stroke-linecap="round"/>`;
        }
      });
      // ağız
      const mx = hx + (f === 0 ? 0 : f * 18), my = hy + 22;
      const ac = B ? BEYAZ : NAVY;
      if (p.agiz === 'gulus') k += `<path d="M${mx - 9} ${my - 2} q9 9 18 0" stroke="${ac}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      else if (p.agiz === 'o') k += `<ellipse cx="${mx}" cy="${my}" rx="5" ry="7" fill="${ac}"/>`;
      else if (p.agiz === 'duz') k += `<path d="M${mx - 7} ${my} h14" stroke="${ac}" stroke-width="4" stroke-linecap="round"/>`;
      else if (p.agiz === 'esneme') k += `<ellipse cx="${mx}" cy="${my + 2}" rx="8" ry="11" fill="${ac}"/>`;
      return k;
    }

    let g = `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${s})">`;
    g += cizgi([omuzA, kA.dirsek, kA.el], uzuvArka, kalin) + elC(kA, uzuvArka);
    g += cizgi([kalcaA, bA.diz, bA.ayak], uzuvArka, kalin) + ayakkabi(bA, uzuvArka);
    g += cizgi([kalcaO, bO.diz, bO.ayak], uzuv, kalin) + ayakkabi(bO, uzuv);
    g += govde();
    g += cizgi([omuz, boyun], NAVY, kalin);
    g += kafa();
    g += cizgi([omuzO, kO.dirsek, kO.el], uzuv, kalin) + elC(kO, uzuv);
    g += '</g>';
    const dunya = q => [p.x + q[0] * s, p.y + q[1] * s];
    return { svg: g, elO: dunya(kO.el), elA: dunya(kA.el), bas: dunya(basM) };
  }

  // Anahtar pozlar arasında yumuşak geçiş. kare: [[t, poz], ...] artan t.
  const SAYISAL = ['x', 'y', 'olcek', 'egim', 'bas', 'zipla', 'bakis'];
  const DIZI = ['kolO', 'kolA', 'bacakO', 'bacakA'];
  const yumusak = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
  function pozAra(kare, t, gecis = 0.35) {
    let i = 0; while (i < kare.length - 1 && kare[i + 1][0] <= t) i++;
    const [t0, a] = kare[i];
    const sonraki = kare[i + 1];
    if (!sonraki) return Object.assign({}, a);
    const [t1, b] = sonraki;
    const bas = Math.max(t0, t1 - gecis);
    const u = yumusak((t - bas) / (t1 - bas));
    const o = Object.assign({}, a);
    SAYISAL.forEach(k => { const va = a[k] ?? VARSAYILAN[k], vb = b[k] ?? VARSAYILAN[k]; o[k] = va + (vb - va) * u; });
    DIZI.forEach(k => { const va = a[k] ?? VARSAYILAN[k], vb = b[k] ?? VARSAYILAN[k]; o[k] = [va[0] + (vb[0] - va[0]) * u, va[1] + (vb[1] - va[1]) * u]; });
    if (u > 0.5) ['goz', 'kas', 'agiz', 'yon'].forEach(k => { if (b[k] !== undefined) o[k] = b[k]; });
    return o;
  }

  // Yürüme döngüsü: faz (adım sayısı, ondalıklı) -> uzuv açıları
  function yuru(faz) {
    const w = Math.sin(faz * Math.PI);
    const dizO = Math.max(0, Math.sin(faz * Math.PI + 1.2)) * 38 + 6;
    const dizA = Math.max(0, Math.sin(faz * Math.PI + 1.2 + Math.PI)) * 38 + 6;
    return {
      bacakO: [w * 26, dizO], bacakA: [-w * 26, dizA],
      kolO: [-w * 24, 18], kolA: [w * 24, 18],
      zipla: Math.abs(Math.cos(faz * Math.PI)) * 6, egim: 4,
    };
  }

  kok.karakter = karakter; kok.pozAra = pozAra; kok.yuru = yuru; kok.yumusak = yumusak;
})(typeof window !== 'undefined' ? window : globalThis);
