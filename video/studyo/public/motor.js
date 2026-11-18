// Stüdyonun ortak kurgu motoru. Hem tarayıcıdaki önizleme hem de son çıktı (render) aynı hesabı kullanır.
// Zamanlar saniyedir. "Çıktı zamanı" = bitmiş videodaki zaman.

export const W = 1920, H = 1080;
export const PANEL_G = 846;            // yan panelin genişliği (sol/sağ yerleşim)
export const KAYDIR = 423;             // yan panel açıkken yüzün kaydığı mesafe (panelin yarısı)
export const GECIS = 0.6;              // panel/yüz kayma süresi

export const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const yumusak = x => { x = cl(x); return x * x * (3 - 2 * x); };

// kurgu.klipler -> çıktı zaman çizelgesindeki parçalar
export function parcalar(kurgu) {
  let t = 0; const out = [];
  for (const [i, k] of (kurgu.klipler || []).entries()) {
    if (k.bosluk) { out.push({ i, bosluk: true, bas: t, son: t + k.bosluk, gir: 0, cik: k.bosluk }); t += k.bosluk; continue; }
    const d = Math.max(0, k.cik - k.gir);
    out.push({ i, dosya: k.dosya, gir: k.gir, cik: k.cik, bas: t, son: t + d });
    t += d;
  }
  return out;
}

export function toplamSure(kurgu) {
  const p = parcalar(kurgu);
  let s = p.length ? p[p.length - 1].son : 0;
  for (const sh of sahneler(kurgu)) s = Math.max(s, sh.son);
  return s;
}

// Bir klibin kendi zamanını çıktı zamanına çevirir (klip o anı içeren ilk parçada bulunur).
export function klipAniCikti(kurgu, dosya, an) {
  let en = null, enUzak = Infinity;
  for (const p of parcalar(kurgu)) {
    if (p.bosluk || p.dosya !== dosya) continue;
    if (an >= p.gir - 1e-6 && an <= p.cik + 1e-6) return p.bas + (an - p.gir);
    // An kesilmiş bir duraksamaya düştüyse en yakın parçanın kenarına bağla
    const u = an < p.gir ? p.gir - an : an - p.cik;
    if (u < enUzak && u < 2) { enUzak = u; en = an < p.gir ? p.bas : p.son; }
  }
  return en;
}

// Atlamalı kesim: konuşmadaki uzun duraksamaları atar. kurgu.duraksama = { kes: true, esik: 0.6, pay: 0.15 }
// Bir klipte kapatmak için o klibe "duraksama": false yazılır. Sonuç, klipleri bölünmüş yeni bir kurgudur.
export function kurguHazirla(kurgu, metinler) {
  const d = kurgu.duraksama;
  if (!d || !d.kes) return kurgu;
  const esik = d.esik ?? 0.6, pay = d.pay ?? 0.15;
  const klipler = [];
  for (const k of kurgu.klipler || []) {
    const m = k.dosya && metinler[k.dosya];
    if (k.bosluk || !m || k.duraksama === false) { klipler.push(k); continue; }
    // Duraksamalar: ses analizinden (m.sessizlik); yoksa kelime aralarından
    let araliklar = m.sessizlik;
    if (!araliklar) { araliklar = []; for (let i = 0; i < m.kelimeler.length - 1; i++) araliklar.push([m.kelimeler[i].e, m.kelimeler[i + 1].s]); }
    let bas = k.gir;
    for (const [a, b] of araliklar) {
      if (b - a <= esik || a <= k.gir + 0.05 || b >= k.cik - 0.05) continue;
      const son = a + pay;
      if (son - bas > 0.2) klipler.push({ ...k, gir: +bas.toFixed(3), cik: +son.toFixed(3), otomatik: true });
      bas = Math.max(bas, b - pay);
    }
    if (k.cik - bas > 0.2) klipler.push({ ...k, gir: +bas.toFixed(3), cik: k.cik, otomatik: true });
  }
  return { ...kurgu, klipler, hamKlipler: kurgu.klipler };
}

// Sahnelerin çıktı zamanları. Sahne ya "bas" (çıktı zamanı) ya da "klip"+"an" (klibin kendi zamanı) ile bağlanır;
// ikincisi, başka yerde kesme yapılınca sahnenin konuşmayla birlikte kaymasını sağlar.
export function sahneler(kurgu) {
  const out = [];
  for (const [i, s] of (kurgu.sahneler || []).entries()) {
    let bas = s.bas;
    if (s.klip != null && s.an != null) bas = klipAniCikti(kurgu, s.klip, s.an);
    if (bas == null) continue;
    out.push({ ...s, i, id: s.id || 's' + i, bas, son: bas + (s.sure || 4), yerlesim: s.yerlesim || 'tam' });
  }
  return out;
}

// Sahnenin t anındaki giriş/çıkış durumu: 0 = görünmüyor, 1 = tam görünüyor
export function sahneZarf(s, t, g = GECIS) {
  if (t < s.bas || t > s.son) return 0;
  return Math.min(yumusak((t - s.bas) / g), yumusak((s.son - t) / g));
}

// Yerleşimler: tam (yüzü kapatır), sol / sag (yan panel, yüz öbür yana kayar), ust (yüzün üstünde saydam katman)
// Yüzün yatay kayması (1920 genişliğe göre piksel). sol panel -> yüz sağa (+), sağ panel -> yüz sola (-).
export function yuzKaydirma(kurgu, t) {
  let x = 0;
  for (const s of sahneler(kurgu)) {
    if (s.yerlesim === 'sol') x += KAYDIR * sahneZarf(s, t);
    else if (s.yerlesim === 'sag') x -= KAYDIR * sahneZarf(s, t);
  }
  return x;
}

// Aynı kaymanın ffmpeg overlay x ifadesi (yuzKaydirma ile birebir aynı formül)
export function ffmpegKaydirma(kurgu, olcek = 1) {
  const g = GECIS;
  const sm = e => `(${e})*(${e})*(3-2*(${e}))`;
  const terimler = [];
  for (const s of sahneler(kurgu)) {
    if (s.yerlesim !== 'sol' && s.yerlesim !== 'sag') continue;
    const yon = s.yerlesim === 'sol' ? 1 : -1;
    const a = `clip((t-${s.bas.toFixed(3)})/${g},0,1)`;
    const b = `clip((${s.son.toFixed(3)}-t)/${g},0,1)`;
    terimler.push(`${yon * KAYDIR * olcek}*between(t,${s.bas.toFixed(3)},${s.son.toFixed(3)})*min(${sm(a)},${sm(b)})`);
  }
  return terimler.length ? terimler.join('+') : '0';
}

// Klip metinlerinden (Whisper kelimeleri) çıktı zamanlı kelimeler ve altyazı satırları
export function altyazi(kurgu, metinler) {
  const kelimeler = [];
  for (const p of parcalar(kurgu)) {
    if (p.bosluk) continue;
    const m = metinler[p.dosya]; if (!m) continue;
    let ilk = true;
    for (const [wi, w] of m.kelimeler.entries()) {
      const orta = (w.s + w.e) / 2;
      if (orta < p.gir || orta > p.cik) continue;
      kelimeler.push({ w: w.w, s: p.bas + Math.max(0, w.s - p.gir), e: p.bas + Math.min(p.cik, w.e) - p.gir, parcaBasi: ilk, dosya: p.dosya, wi });
      ilk = false;
    }
  }
  const satirlar = []; let cur = null;
  const MAX = (kurgu.altyazi && kurgu.altyazi.harf) || 36;
  kelimeler.forEach((k, i) => {
    const onceki = kelimeler[i - 1];
    const uzunluk = cur ? cur.k.reduce((a, j) => a + kelimeler[j].w.length + 1, 0) : 0;
    const kir = !cur || k.parcaBasi || (k.s - onceki.e) > 0.55 || uzunluk + k.w.length > MAX ||
      (/[.?!…]$/.test(onceki.w) && cur.k.length >= 2);
    if (kir) { cur = { k: [] }; satirlar.push(cur); }
    cur.k.push(i);
  });
  satirlar.forEach((s, i) => {
    s.bas = kelimeler[s.k[0]].s - 0.05;
    s.son = kelimeler[s.k[s.k.length - 1]].e + 0.35;
    const sonraki = satirlar[i + 1];
    if (sonraki) s.son = Math.min(s.son, kelimeler[sonraki.k[0]].s - 0.05);
  });
  return { kelimeler, satirlar };
}

export function hesapla(kurgu, metinler) {
  return { parcalar: parcalar(kurgu), sahneler: sahneler(kurgu), sure: toplamSure(kurgu), ...altyazi(kurgu, metinler) };
}

export function sureYaz(t) {
  t = Math.max(0, t || 0);
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

// Görüntü ayarları (kurgu.goruntu). Bölge koordinatları 1920x1080 kadraja göredir, kamerayla birlikte durur.
//   renk: { parlaklik: -0.2..0.2, kontrast: 0.8..1.3, doygunluk: 0..2, sicaklik: 4000..8000 (K, 6500 = nötr) }
//   cilt: 0..1  (hafif cilt yumuşatma; yalnız son videoda)
//   gizle: [{ x, y, w, h, tur: 'bulanik' | 'renk', renk: '#hex', guc: 10..60 }]
export function goruntuFfmpeg(g, olcek = 1) {
  if (!g) return '';
  const r = g.renk || {};
  const parca = [];
  const gz = (g.gizle || []).filter(b => b.w > 0 && b.h > 0);
  let zincir = '';
  if (r.parlaklik != null || r.kontrast != null || r.doygunluk != null)
    zincir += `,eq=brightness=${r.parlaklik ?? 0}:contrast=${r.kontrast ?? 1}:saturation=${r.doygunluk ?? 1}`;
  if (r.sicaklik && r.sicaklik !== 6500) zincir += `,colortemperature=temperature=${r.sicaklik}:mix=0.6`;
  // Karmaşık kısımlar ayrı etiketlerle; çağıran [g0] girişini verir, [gs] çıkışını alır
  let son = 'g0';
  const adimlar = [];
  if (zincir) { adimlar.push(`[${son}]${zincir.slice(1)}[g1]`); son = 'g1'; }
  if (g.cilt > 0) {
    const sg = (3 + 4 * g.cilt) * olcek;
    adimlar.push(`[${son}]split[ca][cb];[cb]bilateral=sigmaS=${sg.toFixed(1)}:sigmaR=0.06[cc];[ca][cc]blend=all_mode=normal:all_opacity=${Math.min(0.85, 0.3 + 0.55 * g.cilt).toFixed(2)}[g2]`);
    son = 'g2';
  }
  gz.forEach((b, i) => {
    const [x, y, w, h] = [b.x, b.y, b.w, b.h].map(v => Math.round(v * olcek / 2) * 2);
    if (b.tur === 'renk') adimlar.push(`[${son}]drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=${(b.renk || '#F6F2EA').replace('#', '0x')}:t=fill[gz${i}]`);
    else adimlar.push(`[${son}]split[ga${i}][gb${i}];[gb${i}]crop=${w}:${h}:${x}:${y},boxblur=${Math.round((b.guc || 30) * olcek)}:3[gc${i}];[ga${i}][gc${i}]overlay=${x}:${y}[gz${i}]`);
    son = 'gz' + i;
  });
  if (!adimlar.length) return '';
  return { adimlar: adimlar.join(';'), son };
}

export function goruntuCss(g) {
  const r = (g && g.renk) || {};
  const f = [];
  if (r.parlaklik) f.push(`brightness(${1 + r.parlaklik * 1.6})`);
  if (r.kontrast != null && r.kontrast !== 1) f.push(`contrast(${r.kontrast})`);
  if (r.doygunluk != null && r.doygunluk !== 1) f.push(`saturate(${r.doygunluk})`);
  if (r.sicaklik && r.sicaklik !== 6500) f.push(`sepia(${Math.min(0.35, Math.max(0, (6500 - r.sicaklik) / 7000)).toFixed(2)})`);
  return f.join(' ') || 'none';
}

// Arka planı değiştirme (kurgu.goruntu.arka). Kişi maskesi Apple Vision ile çıkarılır (arac/kisi-maske).
//   { tur: 'bulanik', guc: 10..60 }  arka plan bulanık, kişi net (portre modu gibi)
//   { tur: 'renk', renk: '#hex' }    düz renk
//   { tur: 'resim', dosya: 'x.jpg' } medya/<proje>/arka/ klasöründeki bir görsel
// Girişler: [yuz] kişi görüntüsü (OWxOH), [mk] maske (herhangi boyut, gri), [ark] resim (yalnız 'resim' türünde)
export function arkaFfmpeg(arka, OW, OH, yuz, mk, ark) {
  const m = `[${mk}]scale=${OW}:${OH},format=gray,boxblur=${Math.max(1, Math.round(OW / 960))}:1[am]`;
  let on, zemin;
  if (arka.tur === 'renk') { on = `[${yuz}]null[ak]`; zemin = `color=c=${(arka.renk || '#F6F2EA').replace('#', '0x')}:s=${OW}x${OH},format=yuv420p[az]`; }
  else if (arka.tur === 'resim') { on = `[${yuz}]null[ak]`; zemin = `[${ark}]scale=${OW}:${OH}:force_original_aspect_ratio=increase,crop=${OW}:${OH},format=yuv420p[az]`; }
  else { on = `[${yuz}]split[ak][ab]`; zemin = `[ab]boxblur=${Math.round((arka.guc || 30) * OW / 1920)}:2[az]`; }
  return `${on};${m};${zemin};[ak][am]alphamerge[akisi];[az][akisi]overlay=0:0:shortest=1,format=yuv420p`;
}

// YouTube için altyazı dosyası (SRT)
export function srt(kurgu, metinler) {
  const { kelimeler, satirlar } = altyazi(kurgu, metinler);
  const z = t => { t = Math.max(0, t); const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sn = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sn).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  return satirlar.map((s, i) => `${i + 1}\n${z(s.bas)} --> ${z(s.son)}\n${s.k.map(j => kelimeler[j].w).join(' ')}\n`).join('\n');
}

// YouTube açıklaması için bölüm listesi: "sablon:bolum" sahneleri ya da "bolum" alanı olan sahneler
export function bolumler(kurgu) {
  const l = sahneler(kurgu).filter(s => s.bolum || s.dosya === 'sablon:bolum')
    .map(s => ({ t: s.bas, ad: s.bolum || (s.ayar && s.ayar.baslik) || 'Bölüm' }));
  if (!l.length || l[0].t > 1) l.unshift({ t: 0, ad: 'Giriş' }); else l[0].t = 0;
  const z = t => { t = Math.floor(t); const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
  return l.map(b => `${z(b.t)} ${b.ad}`).join('\n') + '\n';
}
