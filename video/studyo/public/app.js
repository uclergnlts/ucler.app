import { Katman, KATMAN_CSS } from '/studyo/katman.js';
import { hesapla, yuzKaydirma, sureYaz, goruntuCss, W, H } from '/studyo/motor.js';

const $ = s => document.querySelector(s);
const st = document.createElement('style'); st.textContent = KATMAN_CSS; document.head.appendChild(st);

let ad = null, veri = null, hz = null, katman = null, olay = null;
let t = 0, oynuyor = false, aktifEl = null, aktifParca = null, sonKare = 0;
const va = $('#va'), vb = $('#vb');
const vekilUrl = dosya => veri && veri.arkaVekil && veri.arkaVekil[dosya] ? `/p/${ad}/vekil/${encodeURIComponent(veri.arkaVekil[dosya])}`
  : `/p/${ad}/vekil/${encodeURIComponent(dosya.replace(/\.[^.]+$/, ''))}.mp4`;

// ---------- Proje ----------
async function projeleriYukle(sec) {
  const l = await (await fetch('/api/projeler')).json();
  $('#proje').innerHTML = l.map(p => `<option value="${p.ad}">${p.baslik || p.ad}</option>`).join('') || '<option value="">(proje yok)</option>';
  const istenen = sec || localStorageAl('proje') || (l[0] && l[0].ad);
  if (istenen && l.some(p => p.ad === istenen)) { $('#proje').value = istenen; await projeAc(istenen); }
}
function localStorageAl(k) { try { return localStorage.getItem('studyo.' + k); } catch { return null; } }
function localStorageYaz(k, v) { try { localStorage.setItem('studyo.' + k, v); } catch { } }

$('#proje').onchange = e => projeAc(e.target.value);
$('#yeniProje').onclick = async () => {
  const b = prompt('Videonun adı (ör. Uzay-zaman ilişkisi):'); if (!b) return;
  const r = await (await fetch('/api/projeler', { method: 'POST', body: JSON.stringify({ ad: b }) })).json();
  if (r.ad) projeleriYukle(r.ad);
};

async function projeAc(yeni) {
  ad = yeni; localStorageYaz('proje', ad);
  dur(); t = 0;
  $('#katman').innerHTML = '';
  katman = new Katman($('#katman'), ad);
  await yenile();
  if (olay) olay.close();
  olay = new EventSource(`/api/p/${ad}/olaylar`);
  olay.onopen = () => { $('#baglanti').textContent = 'canlı'; $('#baglanti').classList.add('canli'); };
  olay.onerror = () => { $('#baglanti').textContent = 'bağlantı yok'; $('#baglanti').classList.remove('canli'); };
  olay.addEventListener('kurgu', e => yenile(JSON.parse(e.data).degisen || []));
  olay.addEventListener('klipler', () => yenile());
  olay.addEventListener('notlar', () => yenile());
  olay.addEventListener('render', e => renderGoster(JSON.parse(e.data)));
}

async function yenile(degisen = []) {
  if (!ad) return;
  veri = await (await fetch(`/api/p/${ad}`)).json();
  hz = hesapla(veri.kurgu, veri.metinler);
  katman.guncelle(veri.kurgu, veri.metinler, degisen);
  $('#altyaziAc').checked = !(veri.kurgu.altyazi && veri.kurgu.altyazi.acik === false);
  $('#bosMesaj').style.display = hz.parcalar.length ? 'none' : 'flex';
  t = Math.min(t, hz.sure);
  goruntuUygula();
  cizelgeCiz(); klipleriCiz(); notlariCiz(); metniCiz(); ciktilariCiz();
  if (veri.render) renderGoster(veri.render);
  if (!oynuyor) konumla(t);
}

// ---------- Oynatıcı ----------
function olcekle() {
  const c = $('#sahneCerceve'); const s = c.clientWidth / W;
  $('#sahne').style.transform = `scale(${s})`;
}
new ResizeObserver(olcekle).observe($('#sahneCerceve'));

const parcaBul = tt => hz.parcalar.find(p => tt >= p.bas && tt < p.son) || null;

function hazirla(el, p, klipT) {
  const u = vekilUrl(p.dosya);
  if (el.dataset.src !== u) { el.src = u; el.dataset.src = u; }
  if (Math.abs(el.currentTime - klipT) > 0.05) el.currentTime = klipT;
}
function goster(el) {
  for (const v of [va, vb]) { v.style.display = v === el ? 'block' : 'none'; if (v !== el) v.pause(); }
  aktifEl = el;
}

// Oynatmıyorken: t anını göster
function konumla(yeniT) {
  t = Math.max(0, Math.min(yeniT, hz ? hz.sure : 0));
  if (!hz) return;
  const p = parcaBul(t); aktifParca = p;
  if (p && !p.bosluk) { const el = aktifEl || va; hazirla(el, p, p.gir + (t - p.bas)); goster(el); }
  else goster(null);
  kareCiz();
}

function oynat() {
  if (!hz || !hz.sure) return;
  if (t >= hz.sure - 0.05) t = 0;
  oynuyor = true; $('#oynat').textContent = '❚❚';
  aktifParca = parcaBul(t);
  if (aktifParca && !aktifParca.bosluk) {
    const el = aktifEl || va; hazirla(el, aktifParca, aktifParca.gir + (t - aktifParca.bas)); goster(el); el.play().catch(() => { });
  }
  sonKare = performance.now();
  requestAnimationFrame(dongu);
}
function dur() {
  oynuyor = false; $('#oynat').textContent = '▶';
  va.pause(); vb.pause();
}
$('#oynat').onclick = () => oynuyor ? dur() : oynat();
document.addEventListener('keydown', e => {
  if (e.target.closest('textarea,input,select')) return;
  if (e.code === 'Space') { e.preventDefault(); oynuyor ? dur() : oynat(); }
  if (e.code === 'ArrowLeft') konumla(t - (e.shiftKey ? 5 : 1));
  if (e.code === 'ArrowRight') konumla(t + (e.shiftKey ? 5 : 1));
});

function dongu(simdi) {
  if (!oynuyor) return;
  const dt = (simdi - sonKare) / 1000; sonKare = simdi;
  const p = aktifParca;
  if (p && !p.bosluk && aktifEl) {
    t = p.bas + (aktifEl.currentTime - p.gir);
    // Sıradaki parçayı diğer video öğesinde hazırla
    const sonraki = hz.parcalar[hz.parcalar.indexOf(p) + 1];
    const diger = aktifEl === va ? vb : va;
    if (sonraki && !sonraki.bosluk && p.son - t < 1.5 && diger.dataset.hazirlanan !== sonraki.bas + '') {
      hazirla(diger, sonraki, sonraki.gir); diger.dataset.hazirlanan = sonraki.bas + '';
    }
    if (aktifEl.currentTime >= p.cik - 0.03 || aktifEl.ended) gec(p.son);
  } else {
    t += dt;
    const yeni = parcaBul(t);
    if (yeni !== p) gec(t);
  }
  if (t >= hz.sure) { t = hz.sure; dur(); }
  kareCiz();
  requestAnimationFrame(dongu);
}
function gec(yeniT) {
  t = yeniT;
  const p = parcaBul(t); aktifParca = p;
  if (p && !p.bosluk) {
    const el = (aktifEl === va ? vb : va);
    const hedef = el.dataset.hazirlanan === p.bas + '' ? el : (aktifEl || va);
    hazirla(hedef, p, p.gir + (t - p.bas)); goster(hedef); hedef.play().catch(() => { });
    delete hedef.dataset.hazirlanan;
  } else { if (aktifEl) aktifEl.pause(); goster(null); }
}

function kareCiz() {
  if (!hz) return;
  const x = yuzKaydirma(veri.kurgu, t);
  $('#yuzKap').style.transform = `translateX(${x}px)`;
  katman.ciz(t);
  $('#zaman').textContent = `${sureYaz(t)} / ${sureYaz(hz.sure)}`;
  $('#notZaman').textContent = sureYaz(t);
  if (!surukleniyor) $('#ilerle').value = hz.sure ? Math.round(t / hz.sure * 1000) : 0;
  $('#imlec').style.left = (OLUK + t * pxSn()) + 'px';
  metinVurgula();
}
let surukleniyor = false;
$('#ilerle').oninput = e => { surukleniyor = true; konumla(e.target.value / 1000 * hz.sure); };
$('#ilerle').onchange = () => { surukleniyor = false; if (oynuyor) { dur(); oynat(); } };

$('#altyaziAc').onchange = e => { veri.kurgu.altyazi = { ...(veri.kurgu.altyazi || {}), acik: e.target.checked }; katman.guncelle(veri.kurgu, veri.metinler); kareCiz(); };

// Görüntü ayarlarının önizlemesi (yaklaşık; cilt yumuşatma yalnız son videoda)
function goruntuUygula() {
  const g = veri.kurgu.goruntu || {};
  const css = goruntuCss(g);
  for (const v of [va, vb]) v.style.filter = css;
  $('#gizleKatman').innerHTML = (g.gizle || []).map(b => `<div style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;${b.tur === 'renk' ? 'background:' + (b.renk || '#F6F2EA') + ';backdrop-filter:none' : ''}"></div>`).join('');
}

// ---------- Zaman çizelgesi ----------
const pxSn = () => +$('#zoom').value;
const OLUK = 78; // zaman çizelgesinde iz adlarının durduğu sol boşluk
$('#zoom').oninput = () => { localStorageYaz('zoom', $('#zoom').value); cizelgeCiz(); kareCiz(); };
if (localStorageAl('zoom')) $('#zoom').value = localStorageAl('zoom');

function cizelgeCiz() {
  if (!hz) return;
  const ps = pxSn(), gen = Math.max(OLUK + hz.sure * ps + 200, $('#cizelge').clientWidth);
  $('#cetvel').style.width = gen + 'px'; $('#izler').style.width = gen + 'px';
  const adim = ps > 60 ? 1 : ps > 25 ? 5 : ps > 10 ? 10 : 30;
  let c = '';
  for (let s = 0; s <= hz.sure + adim; s += adim) c += `<span style="left:${OLUK + s * ps}px">${sureYaz(s).replace(/\.\d$/, '')}</span>`;
  $('#cetvel').innerHTML = c;
  const blok = (bas, son, sinif, yazi, baslik) => `<div class="blok ${sinif}" style="left:${OLUK + bas * ps}px;width:${Math.max(3, (son - bas) * ps - 2)}px" title="${baslik || yazi}">${yazi}</div>`;
  const konusma = hz.parcalar.map(p => blok(p.bas, p.son, p.bosluk ? 'bosluk' : 'konusma', p.bosluk ? 'boşluk' : p.dosya.replace(/\.[^.]+$/, ''), p.bosluk ? '' : `${p.dosya}  ${p.gir.toFixed(1)}–${p.cik.toFixed(1)} sn`)).join('');
  const yerAd = { tam: 'tam ekran', sol: 'solda', sag: 'sağda', ust: 'üstte' };
  const sahne = hz.sahneler.map(s => blok(s.bas, s.son, s.yerlesim, `${s.ad || (s.ayar && (s.ayar.baslik || s.ayar.metin)) || s.dosya.replace('.html', '').replace('sablon:', '')} · ${yerAd[s.yerlesim] || s.yerlesim}`)).join('');
  const altyazi = hz.satirlar.map(s => blok(s.bas, s.son, 'satir', s.k.map(j => hz.kelimeler[j].w).join(' '))).join('');
  const notlar = veri.notlar.map((n, i) => `<div class="isaret ${n.durum === 'yapıldı' ? 'yapildi' : ''}" style="left:${OLUK + n.t * ps}px" title="${kacis(n.metin)}">${i + 1}</div>`).join('');
  $('#izler').innerHTML = `<div class="iz"><span class="ad">Konuşma</span>${konusma}</div><div class="iz"><span class="ad">Sahneler</span>${sahne}</div>` +
    `<div class="iz"><span class="ad">Altyazı</span>${altyazi}</div><div class="iz"><span class="ad">Notlar</span>${notlar}</div>`;
}
$('#cizelge').addEventListener('click', e => {
  const r = $('#cizelge').getBoundingClientRect();
  konumla((e.clientX - r.left + $('#cizelge').scrollLeft - OLUK) / pxSn());
});

// ---------- Notlar ----------
$('#notEkle').onclick = async () => {
  const metin = $('#notMetin').value.trim(); if (!metin) return;
  await fetch(`/api/p/${ad}/not`, { method: 'POST', body: JSON.stringify({ t: +t.toFixed(2), metin }) });
  $('#notMetin').value = '';
};
$('#notMetin').addEventListener('focus', () => dur());
function notlariCiz() {
  const l = [...veri.notlar].map((n, i) => ({ ...n, no: i + 1 })).sort((a, b) => (a.durum === 'yapıldı') - (b.durum === 'yapıldı') || a.t - b.t);
  $('#notListe').innerHTML = l.length ? l.map(n => `<div class="not ${n.durum === 'yapıldı' ? 'yapildi' : ''}">
    <div class="ust"><b>${n.no}</b><span class="zamanCip" data-t="${n.t}">${sureYaz(n.t)}</span><span class="kucuk">${n.yazan || ''}${n.durum === 'yapıldı' ? ' · yapıldı' : ''}</span>
    <span class="islem">${n.durum === 'yapıldı' ? `<button data-ac="${n.id}">aç</button>` : ''}<button data-sil="${n.id}">sil</button></span></div>
    <div>${kacis(n.metin)}</div>${n.yanit ? `<div class="yanit"><b>Claude:</b> ${kacis(n.yanit)}</div>` : ''}</div>`).join('')
    : '<p class="kucuk">Henüz not yok. Videoyu izlerken istediğin anda durdur, ne istediğini yaz ve "Not bırak"a bas. Ben notları okuyup kurguyu düzeltirim.</p>';
}
$('#notListe').addEventListener('click', async e => {
  const c = e.target.closest('[data-t]'); if (c) return konumla(+c.dataset.t);
  const s = e.target.closest('[data-sil]'); if (s && confirm('Not silinsin mi?')) await fetch(`/api/p/${ad}/not/${s.dataset.sil}`, { method: 'POST', body: JSON.stringify({ sil: true }) });
  const a = e.target.closest('[data-ac]'); if (a) await fetch(`/api/p/${ad}/not/${a.dataset.ac}`, { method: 'POST', body: JSON.stringify({ durum: 'açık' }) });
});

// ---------- Klipler ve yükleme ----------
function klipleriCiz() {
  const kurguda = new Set((veri.kurgu.klipler || []).map(k => k.dosya));
  $('#klipListe').innerHTML = veri.klipler.map(k => `<div class="klip"><div style="flex:1"><div class="ad">${kacis(k.dosya)}</div>
    <div class="kucuk">${k.sure ? sureYaz(k.sure) : ''}${k.bilgi ? (k.bilgi.yalnizSes ? ' · yalnız ses' : ` · ${k.bilgi.w}×${k.bilgi.h} · ${k.bilgi.fps} fps`) : ''}${kurguda.has(k.dosya) ? ' · kurguda' : ''}</div>
    ${k.bilgi && k.bilgi.hdr ? '<div class="kucuk" style="color:#B42318">HDR açık çekilmiş: renkler soluk görünebilir. Sonraki çekimlerde HDR\'ı kapat.</div>' : ''}
    ${k.arka ? `<div class="kucuk">${kacis(k.arka)}</div>` : ''}
    ${k.hata ? `<div class="kucuk" style="color:#B42318">${kacis(k.hata.slice(0, 200))}</div>` : ''}</div>
    <span class="durum ${k.asama === 'hazır' ? 'hazir' : k.asama === 'hata' ? 'hata' : ''}">${k.asama}</span></div>`).join('');
}
$('#hamAc').onclick = e => { e.preventDefault(); fetch(`/api/p/${ad}/klasor`, { method: 'POST', body: '{}' }); };

let surukSayac = 0;
addEventListener('dragenter', e => { if (e.dataTransfer.types.includes('Files')) { surukSayac++; $('#surukle').style.display = 'flex'; } });
addEventListener('dragleave', () => { if (--surukSayac <= 0) { surukSayac = 0; $('#surukle').style.display = 'none'; } });
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', e => {
  e.preventDefault(); surukSayac = 0; $('#surukle').style.display = 'none';
  for (const f of e.dataTransfer.files) yukle(f);
});
function yukle(f) {
  if (!ad) return alert('Önce bir video projesi aç.');
  if (!/\.(mov|mp4|m4v|m4a|mp3|wav|aac|caf|aiff?)$/i.test(f.name)) return alert(f.name + ': yalnız video (.mov, .mp4) ya da ses (.m4a, .mp3, .wav) dosyaları');
  document.querySelector('[data-sekme=klipler]').click();
  const kutu = document.createElement('div'); kutu.className = 'klip';
  kutu.innerHTML = `<div style="flex:1"><div class="ad">${kacis(f.name)}</div><div class="cubuk"><i style="width:0"></i></div></div><span class="durum">yükleniyor</span>`;
  $('#yuklemeler').appendChild(kutu);
  const x = new XMLHttpRequest();
  x.open('PUT', `/api/p/${ad}/yukle?dosya=${encodeURIComponent(f.name)}`);
  x.upload.onprogress = e => { kutu.querySelector('i').style.width = (e.loaded / e.total * 100) + '%'; };
  x.onload = () => { kutu.remove(); yenile(); };
  x.onerror = () => { kutu.querySelector('.durum').textContent = 'hata'; };
  x.send(f);
}

// ---------- Metin ----------
function metniCiz() {
  $('#metinListe').innerHTML = hz.satirlar.length ? hz.satirlar.map((s, i) =>
    `<div class="satirM" data-i="${i}" data-t="${s.bas + 0.06}"><span class="zamanCip">${sureYaz(s.bas)}</span><span class="satirYazi">${kacis(s.k.map(j => hz.kelimeler[j].w).join(' '))}</span><button class="duzelt" title="Bu satırı düzelt">✎</button></div>`).join('')
    : '<p class="kucuk">Klipler işlenince konuşman burada yazı olarak görünecek.</p>';
}
let aktifSatir = -1;
function metinVurgula() {
  const i = hz.satirlar.findIndex(s => t >= s.bas && t <= s.son);
  if (i === aktifSatir) return; aktifSatir = i;
  document.querySelectorAll('.satirM.aktif').forEach(e => e.classList.remove('aktif'));
  const el = document.querySelector(`.satirM[data-i="${i}"]`);
  if (el) { el.classList.add('aktif'); if ($('#metin').classList.contains('secili')) el.scrollIntoView({ block: 'nearest' }); }
}
$('#metinListe').addEventListener('click', e => {
  const d = e.target.closest('.duzelt');
  if (d) return satirDuzelt(d.closest('.satirM'));
  if (e.target.closest('[contenteditable]')) return;
  const c = e.target.closest('[data-t]'); if (c) konumla(+c.dataset.t);
});
function satirDuzelt(el) {
  dur();
  const s = hz.satirlar[+el.dataset.i];
  const yazi = el.querySelector('.satirYazi');
  yazi.contentEditable = 'true'; yazi.focus();
  document.getSelection().selectAllChildren(yazi);
  const bitir = async kaydet => {
    yazi.contentEditable = 'false';
    yazi.removeEventListener('keydown', tus); yazi.removeEventListener('blur', bulanik);
    const yeni = yazi.textContent.trim();
    const eski = s.k.map(j => hz.kelimeler[j].w).join(' ');
    if (!kaydet || !yeni || yeni === eski) { yazi.textContent = eski; return; }
    const ks = s.k.map(j => hz.kelimeler[j]);
    await fetch(`/api/p/${ad}/altyazi`, { method: 'POST', body: JSON.stringify({ dosya: ks[0].dosya, indeksler: ks.map(k => k.wi), metin: yeni }) });
  };
  const tus = e => { if (e.key === 'Enter') { e.preventDefault(); bitir(true); } if (e.key === 'Escape') bitir(false); };
  const bulanik = () => bitir(true);
  yazi.addEventListener('keydown', tus); yazi.addEventListener('blur', bulanik);
}

// ---------- Render ----------
$('#renderBtn').onclick = async () => {
  const r = await (await fetch(`/api/p/${ad}/render`, { method: 'POST', body: JSON.stringify({ cozunurluk: $('#cozunurluk').value }) })).json();
  if (r.hata) alert(r.hata);
  document.querySelector('[data-sekme=ciktilar]').click();
};
function renderGoster(r) {
  const calisiyor = r.durum === 'çalışıyor';
  $('#renderBtn').disabled = calisiyor;
  $('#renderBtn').textContent = calisiyor ? `Çıkarılıyor %${Math.round((r.oran || 0) * 100)}` : 'Videoyu çıkar';
  $('#renderDurum').innerHTML = calisiyor
    ? `<div class="not"><b>${r.cozunurluk} video çıkarılıyor</b><div class="cubuk"><i style="width:${(r.oran || 0) * 100}%"></i></div>
       <div class="kucuk">${r.kalan != null ? 'yaklaşık ' + Math.ceil(r.kalan / 60) + ' dk kaldı' : 'başlıyor'}</div><button class="ikincil" id="iptal" style="margin-top:6px">İptal</button></div>`
    : r.durum === 'hata' ? `<div class="not"><b>Çıkarma hatası</b><div class="kucuk">${kacis(r.hata || '')}</div></div>`
      : r.durum === 'bitti' ? `<div class="not"><b>Hazır:</b> ${kacis(r.cikti || '')}</div>` : '';
  const ip = $('#iptal'); if (ip) ip.onclick = () => fetch(`/api/p/${ad}/render/iptal`, { method: 'POST' });
  if (r.durum === 'bitti') yenileCiktilar();
}
async function yenileCiktilar() { veri = await (await fetch(`/api/p/${ad}`)).json(); ciktilariCiz(); }
function ciktilariCiz() {
  $('#ciktiListe').innerHTML = (veri.ciktilar || []).map(f => `<div class="klip"><div style="flex:1"><a class="ad" href="/p/${ad}/cikti/${encodeURIComponent(f)}" target="_blank">${kacis(f)}</a></div></div>`).join('')
    + `<p class="kucuk">Çıkan videolar Mac'te <a href="#" id="ciktiAc">çıktı klasöründe</a>. Her videonun yanında altyazı dosyası (.srt) da var.</p>`
    + `<div class="not"><b>YouTube'a yüklerken</b><div class="kucuk" style="margin:4px 0 8px">Altyazı dosyasını YouTube Studio'da "Altyazılar" bölümüne yükle. Bölüm listesini açıklamaya yapıştır.</div>`
    + `<a href="/api/p/${ad}/disa?tur=srt">Altyazı (.srt) indir</a><pre id="bolumListe" class="kucuk" style="white-space:pre-wrap;background:var(--kagit);padding:8px;border-radius:8px;margin-top:8px"></pre></div>`;
  fetch(`/api/p/${ad}/disa?tur=bolumler`).then(r => r.text()).then(x => { const e = $('#bolumListe'); if (e) e.textContent = x; });
  const a = $('#ciktiAc'); if (a) a.onclick = e => { e.preventDefault(); fetch(`/api/p/${ad}/klasor`, { method: 'POST', body: JSON.stringify({ hangi: 'cikti' }) }); };
}

// ---------- Sekmeler ----------
document.querySelectorAll('aside nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('aside nav button, .sekme').forEach(e => e.classList.remove('secili'));
  b.classList.add('secili'); $('#' + b.dataset.sekme).classList.add('secili');
});

function kacis(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

projeleriYukle();
