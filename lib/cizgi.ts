// Çizgi (kanalın sarı kapüşonlu kâşifi) için çizim ve hareket motoru. Ölçüler public/tanitim/cizgi.svg ile aynıdır.
// Parçalar (gözler, kollar, bacaklar, gövde) ayrı SVG gruplarıdır; her karede durum nesnesine göre güncellenir.
// Kullanıldığı yerler: components/Cizgi.tsx (kapak, buton, sayfa sonu, 404) ve galerideki minik Çizgi.

const NS = "http://www.w3.org/2000/svg";
/** Çizgi'nin SVG viewBox'ı: ayakları y=0'da, başının üstü y≈-216. */
export const CIZGI_VIEWBOX = "-80 -230 200 245";

export type CizgiDurum = {
  /** Bakış yönü: x sağa, y aşağı, her biri -1..1. hedef'e yumuşakça yaklaşır. */
  hedef: [number, number];
  /** Sağ ve sol kolun omuzdan dönüşü (derece). Sağ kol -150 yukarıda, 0 aşağıda. */
  kolG: number;
  kolS: number;
  /** Bacak salınımının evresi (radyan); yürürken artar. */
  adim: number;
  /** 1 sağa, -1 sola bakar. */
  yon: 1 | -1;
  /** Gövdenin yerden yüksekliği (zıplama). */
  zipla: number;
};

export type Cizgi = CizgiDurum & { ciz: (t: number) => void; isik?: SVGElement };

const el = (tag: string, a: Record<string, string | number>, p?: Element) => {
  const e = document.createElementNS(NS, tag);
  for (const k in a) e.setAttribute(k, String(a[k]));
  p?.appendChild(e);
  return e;
};

/** svg'nin içine Çizgi'yi çizer ve durumunu döndürür. hareketsiz: göz kırpma ve nefes yok (hareket azaltma ayarı). */
export function cizgiKur(svg: SVGSVGElement, ops: { radyo?: boolean; hareketsiz?: boolean } = {}): Cizgi {
  svg.replaceChildren();
  const kok = el("g", {}, svg);
  const golge = el("ellipse", { cx: 0, cy: 2, rx: 46, ry: 8, fill: "#000", opacity: 0.35 }, kok);
  const govde = el("g", {}, kok);
  const bacak = (x: number) => {
    const g = el("g", {}, govde), a = x * 1.14;
    el("path", { d: `M${x} -70 L${a} -4`, stroke: "#26324f", "stroke-width": 17, "stroke-linecap": "round" }, g);
    el("path", { d: `M${a - 10} -2 Q${a} -10 ${a + 10} -2 Z`, fill: "#ff4f7b", stroke: "#ff4f7b", "stroke-width": 6, "stroke-linejoin": "round" }, g);
    return g;
  };
  const bs = bacak(-14), bg = bacak(14);
  const ust = el("g", {}, govde);
  const kolS = el("g", {}, ust);
  el("path", { d: "M-38 -122 Q-52 -96 -46 -72", fill: "none", stroke: "#f5c518", "stroke-width": 18, "stroke-linecap": "round" }, kolS);
  el("circle", { cx: -46, cy: -68, r: 8, fill: "#0b0f1a" }, kolS);
  el("path", { d: "M-40 -66 Q-42 -132 0 -136 Q42 -132 40 -66 Q0 -56 -40 -66 Z", fill: "#f5c518" }, ust);
  el("path", { d: "M14 -134 Q42 -128 40 -66 Q28 -62 16 -62 Q26 -100 14 -134 Z", fill: "#c99a06", opacity: 0.8 }, ust);
  el("path", { d: "M-12 -100 L-12 -84 M12 -100 L12 -84", stroke: "#f1e9d8", "stroke-width": 3, "stroke-linecap": "round", opacity: 0.8 }, ust);
  el("rect", { x: -22, y: -92, width: 44, height: 18, rx: 7, fill: "#c99a06", opacity: 0.7 }, ust);
  const kolG = el("g", {}, ust);
  el("path", { d: "M36 -124 Q52 -98 46 -72", fill: "none", stroke: "#f5c518", "stroke-width": 18, "stroke-linecap": "round" }, kolG);
  el("circle", { cx: 46, cy: -68, r: 8, fill: "#0b0f1a" }, kolG);
  let isik: SVGElement | undefined;
  if (ops.radyo) {
    const r = el("g", { transform: "translate(46 -68) rotate(150) scale(1.7)" }, kolG);
    el("rect", { x: -16, y: -40, width: 34, height: 26, rx: 4, fill: "#26324f", stroke: "#f1e9d8", "stroke-width": 2 }, r);
    el("line", { x1: 10, y1: -40, x2: 22, y2: -70, stroke: "#f1e9d8", "stroke-width": 3, "stroke-linecap": "round" }, r);
    el("circle", { cx: 22, cy: -72, r: 3.5, fill: "#ff4f7b" }, r);
    isik = el("rect", { x: -10, y: -34, width: 16, height: 8, rx: 2, fill: "#ff4f7b" }, r);
    el("rect", { x: -18, y: -18, width: 8, height: 8, rx: 2, fill: "#0b0f1a" }, r);
  }
  const bas = el("g", {}, ust);
  el("circle", { cx: 0, cy: -170, r: 46, fill: "#f5c518" }, bas);
  el("path", { d: "M20 -210 Q50 -186 40 -146 Q30 -132 14 -128 Q40 -170 20 -210 Z", fill: "#c99a06", opacity: 0.7 }, bas);
  const yuz = el("g", {}, bas);
  el("circle", { cx: 7, cy: -167, r: 34, fill: "#0b0f1a" }, yuz);
  const gozler = el("g", {}, yuz);
  el("ellipse", { cx: 0, cy: -170, rx: 7, ry: 8.5, fill: "#f1e9d8" }, gozler);
  el("ellipse", { cx: 24, cy: -170, rx: 7, ry: 8.5, fill: "#f1e9d8" }, gozler);
  const bebek = el("g", {}, gozler);
  el("circle", { cx: 4, cy: -169, r: 3.4, fill: "#0b0f1a" }, bebek);
  el("circle", { cx: 28, cy: -169, r: 3.4, fill: "#0b0f1a" }, bebek);

  const bak: [number, number] = [0.3, 0];
  let kirpBas = 0, sonrakiKirp = 0;
  const c: Cizgi = {
    hedef: [0.3, 0], kolG: 0, kolS: 0, adim: 0, yon: 1, zipla: 0, isik,
    ciz(t) {
      bak[0] += (c.hedef[0] - bak[0]) * 0.18;
      bak[1] += (c.hedef[1] - bak[1]) * 0.18;
      if (!sonrakiKirp) sonrakiKirp = t + 1500 + Math.random() * 2500;
      if (!ops.hareketsiz && t > sonrakiKirp) { kirpBas = t; sonrakiKirp = t + 2200 + Math.random() * 3200; }
      const k = kirpBas ? (t - kirpBas) / 160 : 2;
      const kir = k < 1 ? 1 - Math.abs(1 - 2 * k) : 0;
      yuz.setAttribute("transform", `translate(${bak[0] * 5} ${bak[1] * 4})`);
      bebek.setAttribute("transform", `translate(${bak[0] * 3} ${bak[1] * 3})`);
      // Göz kırpma: gözler y=-170 çizgisi etrafında dikeyde basılır.
      gozler.setAttribute("transform", `translate(0 ${-170 * kir * 0.85}) scale(1 ${1 - kir * 0.85})`);
      const nefes = ops.hareketsiz ? 0 : Math.sin(t / 900) * 0.012;
      ust.setAttribute("transform", `translate(0 ${-c.zipla}) translate(0 -66) scale(1 ${1 + nefes}) translate(0 66)`);
      kolG.setAttribute("transform", `rotate(${c.kolG} 36 -124)`);
      kolS.setAttribute("transform", `rotate(${c.kolS} -38 -122)`);
      const a = Math.sin(c.adim) * 22;
      bs.setAttribute("transform", `rotate(${a} -14 -70)`);
      bg.setAttribute("transform", `rotate(${-a} 14 -70)`);
      kok.setAttribute("transform", `scale(${c.yon} 1)`);
      golge.setAttribute("rx", String(46 - c.zipla * 0.3));
    },
  };
  c.ciz(0);
  return c;
}

/** Hareket azaltma ayarı açık mı? */
export const hareketAzalt = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Ekranda görünen Çizgi'ler için tek bir requestAnimationFrame döngüsü. Görünmeyen ya da sekmesi arkada olan Çizgi
 * çizilmez. adim(t, dt) her karede çağrılır; döndürülen fonksiyon kaydı siler.
 */
const kayitlar = new Set<{ adim: (t: number, dt: number) => void; gorunur: boolean }>();
let calisiyor = false, son = 0;
function dongu(t: number) {
  const dt = Math.min(50, t - son || 16);
  son = t;
  let biri = false;
  for (const k of kayitlar) if (k.gorunur) { k.adim(t, dt); biri = true; }
  if (kayitlar.size && biri) requestAnimationFrame(dongu);
  else calisiyor = false;
}
function baslat() {
  if (calisiyor) return;
  calisiyor = true;
  son = performance.now();
  requestAnimationFrame(dongu);
}
export function cizgiDongu(eleman: Element, adim: (t: number, dt: number) => void): () => void {
  const k = { adim, gorunur: false };
  kayitlar.add(k);
  const g = new IntersectionObserver(([e]) => { k.gorunur = e.isIntersecting; if (k.gorunur) baslat(); });
  g.observe(eleman);
  return () => { g.disconnect(); kayitlar.delete(k); };
}
