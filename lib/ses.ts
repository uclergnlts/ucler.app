"use client";
// Ses ve titreşim. Cevap sesleri: doğruda kısa, yükselen iki nota; yanlışta alçak, yumuşak bir ton. Bitiş sesleri: aşama
// bitince küçük bir arpej, konu, ünite ya da seviye testi bitince ondan ayrı, daha dolgun bir kapanış. Animasyon sesleri
// (görsel çizilirken hafif bir hışırtı, madalya, konfeti, sayarak artan puan, görev rozeti) ayrıca kapatılabilir.
// Sesler dosya değil, Web Audio ile burada üretilir; lisans gerekmez. Titreşim uygulamada Capacitor Haptics ile,
// tarayıcıda (destekliyorsa) navigator.vibrate ile olur. İkisi de Ayarlar'dan kapatılır.
import { useSyncExternalStore } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { read, subscribe, write } from "./store";

const ANAHTAR = "tf-ses", ANIM = "tf-ses-anim";
type Durum = "acik" | "kapali";
const sesAcik = () => read<Durum>(ANAHTAR, "acik") === "acik";
const animAcik = () => sesAcik() && read<Durum>(ANIM, "acik") === "acik";
export const useSesAcik = () => useSyncExternalStore(subscribe, sesAcik, () => true);
export const sesAyarla = (acik: boolean) => write(ANAHTAR, acik ? "acik" : "kapali");
export const useAnimSesAcik = () => useSyncExternalStore(subscribe, () => read<Durum>(ANIM, "acik") === "acik", () => true);
export const animSesAyarla = (acik: boolean) => write(ANIM, acik ? "acik" : "kapali");

let ctx: AudioContext | null = null, cikis: AudioNode | null = null;
function baglam() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
    // Üst üste gelen sesler (konfeti + kapanış + puan) birbirini bozmasın diye hepsi bir sıkıştırıcıdan geçer.
    const k = ctx.createDynamicsCompressor();
    k.threshold.value = -18; k.ratio.value = 4;
    k.connect(ctx.destination);
    cikis = k;
  }
  // iOS bağlamı arka plana geçince "interrupted", diğerleri "suspended" yapar.
  if (ctx.state !== "running") ctx.resume().catch(() => {});
  return ctx;
}
// iOS sesi ancak bir dokunuşun içinde açar: ilk dokunuşta bağlamı hazırla.
if (typeof window !== "undefined") window.addEventListener("pointerdown", () => baglam(), { once: true, passive: true });

/** f Hz'lik bir nota: bas saniye sonra başlar, sure saniye sürer. kay verilirse frekans sona doğru oraya kayar. */
function nota(c: AudioContext, f: number, bas: number, sure: number, ses: number, dalga: OscillatorType = "sine", kay?: number) {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + bas;
  o.type = dalga;
  o.frequency.setValueAtTime(f, t);
  if (kay) o.frequency.exponentialRampToValueAtTime(kay, t + sure);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(ses, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
  o.connect(g).connect(cikis!);
  o.start(t);
  o.stop(t + sure + 0.02);
}

/** Kalem hışırtısı: süzülmüş, yavaşça sönen gürültü. */
let gurultu: AudioBuffer | null = null;
function hisirti(c: AudioContext, sure: number, ses: number) {
  if (!gurultu) {
    gurultu = c.createBuffer(1, Math.floor(c.sampleRate * 1.5), c.sampleRate);
    const d = gurultu.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource(), b = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
  s.buffer = gurultu;
  b.type = "bandpass"; b.Q.value = 0.8;
  b.frequency.setValueAtTime(2400, t);
  b.frequency.linearRampToValueAtTime(3600, t + sure);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(ses, t + 0.08);
  g.gain.exponentialRampToValueAtTime(ses * 0.5, t + sure * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
  s.connect(b).connect(g).connect(cikis!);
  s.start(t, Math.random() * 0.3);
  s.stop(t + sure + 0.02);
}

const titret = (f: () => Promise<void>, yedek: number | number[]) =>
  f().catch(() => { try { navigator.vibrate?.(yedek); } catch {} });

/** Cevap ve bitiş sesleri: "Ses ve titreşim" açıksa çalar. */
export type SesTuru = "dogru" | "yanlis" | "asama" | "seviye";
export function ses(tur: SesTuru) {
  if (!sesAcik()) return;
  const c = baglam();
  if (c) {
    if (tur === "dogru") { nota(c, 784, 0, 0.12, 0.09); nota(c, 1175, 0.08, 0.2, 0.08); }
    else if (tur === "yanlis") { nota(c, 233, 0, 0.18, 0.07, "triangle"); nota(c, 196, 0.1, 0.22, 0.06, "triangle"); }
    else if (tur === "asama") [523, 659, 784, 1047].forEach((f, i) => nota(c, f, i * 0.09, 0.28, 0.07));
    else {
      // Seviye: kısa bir yükseliş, ardından tutulan bir akor (Do majör) ve üstte hafif bir parıltı.
      [392, 494, 587].forEach((f, i) => nota(c, f, i * 0.07, 0.22, 0.06, "triangle"));
      [523, 659, 784].forEach((f) => { nota(c, f, 0.26, 1.1, 0.05, "triangle"); nota(c, f * 1.003, 0.26, 1.1, 0.035); });
      nota(c, 1047, 0.3, 1.3, 0.05);
      [2093, 2637, 3136].forEach((f, i) => nota(c, f, 0.4 + i * 0.08, 0.35, 0.015));
    }
  }
  if (tur === "dogru") titret(() => Haptics.impact({ style: ImpactStyle.Light }), 12);
  else if (tur === "yanlis") titret(() => Haptics.impact({ style: ImpactStyle.Medium }), [25, 50, 25]);
  else titret(() => Haptics.notification({ type: NotificationType.Success }), tur === "seviye" ? [20, 60, 20, 60, 40] : [15, 40, 15]);
}

/** Animasyon sesleri: çok kısık; "Animasyon sesleri" ayrıca kapatılabilir. Titreşim yok. */
export type AnimSes = "cizim" | "madalya" | "konfeti" | "puan" | "odul";
let sonCizim = 0, sonPuan = 0;
export function animSes(tur: AnimSes, deger = 0) {
  if (!animAcik()) return;
  const c = baglam();
  if (!c || c.state !== "running") return; // dokunuştan önce (sayfa açılışı) çalmaya çalışma
  const simdi = c.currentTime;
  if (tur === "cizim") {
    // Aynı anda çizilen birkaç görsel tek hışırtı versin. deger: çizimin süresi (ms).
    if (simdi - sonCizim < 0.5) return;
    sonCizim = simdi;
    hisirti(c, Math.min(1.4, Math.max(0.35, deger / 1000)), 0.03);
  } else if (tur === "madalya") {
    nota(c, 660, 0.12, 0.18, 0.06, "sine", 990);
    nota(c, 1320, 0.2, 0.25, 0.025);
  } else if (tur === "konfeti") {
    let t = 9;
    const r = () => ((t = (t * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 10; i++) nota(c, 1600 + r() * 1800, 0.05 + r() * 0.7, 0.12, 0.012 + r() * 0.01);
  } else if (tur === "puan") {
    // Sayarak artan puanda tık; sıklığı sınırlı, deger 0..1 arası ilerleme (perde yükselir).
    if (simdi - sonPuan < 0.07) return;
    sonPuan = simdi;
    nota(c, 1100 + deger * 700, 0, 0.04, 0.03, "triangle");
  } else {
    nota(c, 988, 0, 0.12, 0.04); nota(c, 1319, 0.07, 0.2, 0.035);
  }
}
