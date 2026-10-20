"use client";
// Yalnızca telefon uygulamasında (Capacitor) çalışır: üst çubuk yazıları koyu olsun; açılışta logo animasyonu oynasın.
// Animasyon: telefonun sabit açılış ekranındaki "u." ile başlar, nokta sağa kayarken c, l, e, r harfleri noktanın
// arkasından açılır ve "ucler." olur. Sitede `?acilis` ile önizlenir. "Hareketi azalt" açıksa oynamaz.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

const BEKLE = 250, KAYMA = 800, DUR = 450, SONME = 250;

export default function Yerel() {
  const [acilis, setAcilis] = useState(false);
  useEffect(() => {
    const yerel = Capacitor.isNativePlatform();
    const onizleme = new URLSearchParams(location.search).has("acilis");
    if (yerel) void StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    const azalt = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((yerel || onizleme) && !azalt) setAcilis(true);
    else if (yerel) void SplashScreen.hide().catch(() => {});
  }, []);
  return acilis ? <Acilis bitti={() => setAcilis(false)} /> : null;
}

function Acilis({ bitti }: { bitti: () => void }) {
  const kutu = useRef<HTMLDivElement>(null);
  const yazi = useRef<HTMLSpanElement>(null);
  const kelime = useRef<HTMLSpanElement>(null);
  const nokta = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const k = kutu.current!, y = yazi.current!, ke = kelime.current!, n = nokta.current!;
    let iptal = false;
    // Harfler yazı tipi yüklenmeden ölçülürse yerleri kayar; önce yazı tipini bekle.
    document.fonts.ready.then(() => {
      if (iptal) return;
      const W = y.offsetWidth, wN = n.offsetWidth, wKe = ke.offsetWidth;
      const wU = (ke.firstElementChild as HTMLElement).offsetWidth;
      // Başlangıç: yalnızca "u." görünür ve ortadadır. Kelime sola kayarken sağdan açılır; nokta açılan kenarı izler.
      const basKe = (W - wU - wN) / 2, gizli = wKe - wU, basN = basKe + wU - n.offsetLeft;
      ke.style.transform = `translateX(${basKe}px)`;
      ke.style.clipPath = `inset(-20% ${gizli}px -20% 0)`;
      n.style.transform = `translateX(${basN}px)`;
      y.style.visibility = "visible";
      if (Capacitor.isNativePlatform()) void SplashScreen.hide({ fadeOutDuration: 0 }).catch(() => {});
      const ayar = { duration: KAYMA, delay: BEKLE, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" } as const;
      ke.animate([{ transform: `translateX(${basKe}px)`, clipPath: `inset(-20% ${gizli}px -20% 0)` }, { transform: "translateX(0)", clipPath: "inset(-20% 0px -20% 0)" }], ayar);
      n.animate([{ transform: `translateX(${basN}px)` }, { transform: "translateX(0)" }], ayar);
      const son = k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SONME, delay: BEKLE + KAYMA + DUR, easing: "ease-in", fill: "forwards" });
      son.onfinish = bitti;
    });
    return () => { iptal = true; };
  }, [bitti]);
  return (
    <div ref={kutu} aria-hidden className="fixed inset-0 z-[100] grid place-items-center bg-white">
      <span ref={yazi} className="invisible relative flex font-display text-[56px] leading-none font-extrabold tracking-[-0.02em] text-[#1d3557]">
        <span ref={kelime} className="flex"><span>u</span>cler</span>
        <span ref={nokta} className="text-[#d63c63]">.</span>
      </span>
    </div>
  );
}
