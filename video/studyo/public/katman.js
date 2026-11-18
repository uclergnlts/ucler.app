// Yüzün üstündeki katman: sahneler (tam ekran / sol panel / sağ panel) ve altyazı.
// Önizleme oynatıcısı ve son çıktı (render.html) bu sınıfı aynı şekilde kullanır.
import { W, H, PANEL_G, GECIS, hesapla, sahneZarf, yuzKaydirma, cl, yumusak } from './motor.js';

const ez = x => 1 - Math.pow(1 - cl(x), 3);

export class Katman {
  constructor(kok, proje) {
    this.kok = kok; this.proje = proje;
    this.kutular = new Map();      // sahne id -> {kutu, iframe, src, yuklendi}
    kok.classList.add('katman');
    this.altyaziKutu = document.createElement('div');
    this.altyaziKutu.className = 'altyazi';
    kok.appendChild(this.altyaziKutu);
    this.surum = {};
  }

  // kurgu ya da metinler değişince çağrılır. degisen: değişen sahne dosyalarının adları (yeniden yüklensin diye)
  guncelle(kurgu, metinler, degisen = []) {
    this.kurgu = kurgu; this.metinler = metinler;
    this.hz = hesapla(kurgu, metinler);
    for (const d of degisen) this.surum[d] = Date.now();
    const gorulen = new Set();
    for (const s of this.hz.sahneler) {
      const boy = s.yerlesim === 'tam' ? [W, H] : [PANEL_G, H];
      const src = `/p/${encodeURIComponent(this.proje)}/sahneler/${s.dosya}?w=${boy[0]}&h=${boy[1]}&sure=${s.sure || 4}&yer=${s.yerlesim}` +
        (s.ayar ? '&ayar=' + encodeURIComponent(JSON.stringify(s.ayar)) : '') + (this.surum[s.dosya] ? '&v=' + this.surum[s.dosya] : '');
      gorulen.add(s.id);
      let k = this.kutular.get(s.id);
      if (!k || k.src !== src || k.yerlesim !== s.yerlesim) {
        if (k) k.kutu.remove();
        const kutu = document.createElement('div');
        kutu.className = 'sahne ' + s.yerlesim;
        kutu.style.width = boy[0] + 'px'; kutu.style.height = boy[1] + 'px';
        if (s.arkaplan === false) kutu.classList.add('seffaf');
        const iframe = document.createElement('iframe');
        iframe.width = boy[0]; iframe.height = boy[1];
        k = { kutu, iframe, src, yerlesim: s.yerlesim, yuklendi: false };
        k.hazir = new Promise(r => iframe.addEventListener('load', () => { k.yuklendi = true; r(); }, { once: true }));
        iframe.src = src;
        kutu.appendChild(iframe);
        this.kok.insertBefore(kutu, this.altyaziKutu);
        this.kutular.set(s.id, k);
      }
    }
    for (const [id, k] of this.kutular) if (!gorulen.has(id)) { k.kutu.remove(); this.kutular.delete(id); }
  }

  async hazir() {
    await Promise.all([...this.kutular.values()].map(k => k.hazir));
    await document.fonts.ready;
    for (const k of this.kutular.values()) { try { await k.iframe.contentWindow.FONT_HAZIR; await k.iframe.contentDocument.fonts.ready; } catch { } }
  }

  // t anını çizer. Sahne hareketi yoksa (yalnız altyazı) aynı kalan kareler için bir anahtar döndürür.
  ciz(t) {
    if (!this.hz) return null;
    let hareketli = false, altyaziGizli = false;
    for (const s of this.hz.sahneler) {
      const k = this.kutular.get(s.id); if (!k) continue;
      const gorunur = t >= s.bas && t <= s.son;
      k.kutu.style.display = gorunur ? 'block' : 'none';
      if (!gorunur) continue;
      hareketli = true;
      if (s.altyazi === false) altyaziGizli = true;
      const e = sahneZarf(s, t);
      if (s.yerlesim === 'tam') {
        const gir = ez((t - s.bas) / 0.55), cik = ez((t - (s.son - 0.45)) / 0.45);
        const gecis = s.gecis || 'daire';
        if (gecis === 'daire') { k.kutu.style.clipPath = `circle(${Math.max(0, gir - cik) * 1150}px at 50% 50%)`; k.kutu.style.opacity = 1; }
        else { k.kutu.style.clipPath = 'none'; k.kutu.style.opacity = Math.max(0, gir - cik); }
      } else {
        const x = s.yerlesim === 'sol' ? -(1 - e) * (PANEL_G + 40) : W - PANEL_G + (1 - e) * (PANEL_G + 40);
        k.kutu.style.transform = `translateX(${x}px)`;
      }
      if (k.yuklendi) {
        try { k.iframe.contentWindow.render && k.iframe.contentWindow.render(t - s.bas); } catch (err) { console.error(err); }
      }
    }
    // Altyazı
    const kapali = this.kurgu.altyazi && this.kurgu.altyazi.acik === false;
    const si = kapali || altyaziGizli ? -1 : this.hz.satirlar.findIndex(s => t >= s.bas && t <= s.son);
    const kayma = yuzKaydirma(this.kurgu, t);
    let anahtar = `${si}`;
    if (si >= 0) {
      const s = this.hz.satirlar[si];
      const aktif = s.k.findIndex(j => t >= this.hz.kelimeler[j].s && t < this.hz.kelimeler[j].e + 0.08);
      anahtar += ':' + aktif;
      if (this._satir !== si || this._aktif !== aktif) {
        this.altyaziKutu.innerHTML = '<span class="cizgi">' + s.k.map((j, n) =>
          `<span class="${n === aktif ? 'aktif' : ''}">${kacis(this.hz.kelimeler[j].w)}</span>`).join(' ') + '</span>';
        this._satir = si; this._aktif = aktif;
      }
      const p = ez((t - s.bas) / 0.15);
      this.altyaziKutu.style.opacity = p;
      this.altyaziKutu.style.display = 'flex';
    } else { this.altyaziKutu.style.display = 'none'; this._satir = -1; }
    this.altyaziKutu.style.transform = `translateX(${kayma}px)`;
    anahtar += ':' + kayma.toFixed(1);
    return hareketli ? null : anahtar;
  }
}

function kacis(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

export const KATMAN_CSS = `
.katman{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;pointer-events:none}
.katman .sahne{position:absolute;top:0;left:0;display:none;background:#F6F2EA}
.katman .sahne.seffaf{background:transparent}
.katman .sahne.sol{box-shadow:18px 0 50px rgba(19,35,63,.18)}
.katman .sahne.sag{box-shadow:-18px 0 50px rgba(19,35,63,.18)}
.katman .sahne iframe{border:0;display:block;background:transparent}
.katman .altyazi{position:absolute;left:0;right:0;bottom:70px;display:none;justify-content:center;padding:0 120px}
.katman .altyazi .cizgi{font:800 46px/1.25 Manrope,sans-serif;color:#fff;background:rgba(12,18,32,.66);padding:10px 26px 14px;border-radius:16px;text-align:center;max-width:1000px;letter-spacing:-.2px}
.katman .altyazi .aktif{color:#FFC83D}
`;
