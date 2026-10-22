"use client";
// Ders içi geri bildirim sesi ve titreşimi: doğru cevapta kısa, yükselen iki nota; yanlışta alçak, yumuşak bir ton;
// aşama ya da test bitince küçük bir arpej. Sesler dosya değil, Web Audio ile üretilir. Titreşim uygulamada
// Capacitor Haptics ile, tarayıcıda (destekliyorsa) navigator.vibrate ile olur. Ayarlar'dan kapatılabilir.
import { useSyncExternalStore } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { read, subscribe, write } from "./store";

const ANAHTAR = "tf-ses";
type Durum = "acik" | "kapali";
export const useSesAcik = () => useSyncExternalStore(subscribe, () => read<Durum>(ANAHTAR, "acik") === "acik", () => true);
export const sesAyarla = (acik: boolean) => write(ANAHTAR, acik ? "acik" : "kapali");

let ctx: AudioContext | null = null;
function baglam() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}
// iOS sesi ancak bir dokunuşun içinde açar: ilk dokunuşta bağlamı hazırla.
if (typeof window !== "undefined") window.addEventListener("pointerdown", () => baglam(), { once: true, passive: true });

/** f Hz'lik bir nota: bas saniye sonra başlar, sure saniye sürer. */
function nota(c: AudioContext, f: number, bas: number, sure: number, ses: number, dalga: OscillatorType = "sine") {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + bas;
  o.type = dalga;
  o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(ses, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + sure + 0.02);
}

const titret = (f: () => Promise<void>, yedek: number | number[]) =>
  f().catch(() => { try { navigator.vibrate?.(yedek); } catch {} });

export type SesTuru = "dogru" | "yanlis" | "bitti";
export function ses(tur: SesTuru) {
  if (read<Durum>(ANAHTAR, "acik") !== "acik") return;
  const c = baglam();
  if (c) {
    if (tur === "dogru") { nota(c, 784, 0, 0.12, 0.09); nota(c, 1175, 0.08, 0.2, 0.08); }
    else if (tur === "yanlis") { nota(c, 233, 0, 0.18, 0.07, "triangle"); nota(c, 196, 0.1, 0.22, 0.06, "triangle"); }
    else [523, 659, 784, 1047].forEach((f, i) => nota(c, f, i * 0.09, 0.28, 0.07));
  }
  if (tur === "dogru") titret(() => Haptics.impact({ style: ImpactStyle.Light }), 12);
  else if (tur === "yanlis") titret(() => Haptics.impact({ style: ImpactStyle.Medium }), [25, 50, 25]);
  else titret(() => Haptics.notification({ type: NotificationType.Success }), [15, 40, 15]);
}
