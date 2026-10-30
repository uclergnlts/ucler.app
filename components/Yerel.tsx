"use client";
// Yalnızca telefon uygulamasında (Capacitor) çalışır: üst çubuk yazıları koyu olsun; açılışta logo animasyonu oynasın;
// Google/Apple girişinden app.ucler://giris bağlantısıyla dönülünce oturum açılsın (lib/bulut.ts uygulamaDonusu).
// Animasyon: telefonun sabit açılış ekranındaki "u." ile başlar, nokta sağa kayarken c, l, e, r harfleri noktanın
// geçtiği yerde tek tek, yumuşakça belirir ve "ucler." olur. Sitede `?acilis` ile önizlenir. "Hareketi azalt" açıksa oynamaz.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { donusAl, UYGULAMA_DONUS, uygulamaDonusu } from "@/lib/bulut";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

const BEKLE = 350, KAYMA = 1100, DUR = 500, SONME = 380;

export default function Yerel() {
  const [acilis, setAcilis] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const dinle = App.addListener("appUrlOpen", async ({ url }) => {
      if (!url.startsWith(UYGULAMA_DONUS)) return;
      void Browser.close().catch(() => {});
      const hata = await uygulamaDonusu(url);
      router.replace(hata ? "/giris/?error=1" : donusAl() ?? "/profil/");
    });
    return () => { void dinle.then((d) => d.remove()); };
  }, [router]);
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
    const harf = [...ke.children] as HTMLElement[];
    let iptal = false;
    // Harfler yazı tipi yüklenmeden ölçülürse yerleri kayar; önce yazı tipini bekle.
    document.fonts.ready.then(() => {
      if (iptal) return;
      const W = y.offsetWidth, wN = n.offsetWidth, wKe = ke.offsetWidth, wU = harf[0].offsetWidth;
      // Başlangıç: yalnızca "u." görünür ve ortadadır. Kelime sola, nokta sağa kayar; her harf nokta üstünden geçince belirir.
      const basKe = (W - wU - wN) / 2, gizli = wKe - wU, basN = basKe + wU - n.offsetLeft;
      ke.style.transform = `translateX(${basKe}px)`;
      n.style.transform = `translateX(${basN}px)`;
      harf.slice(1).forEach((h) => { h.style.opacity = "0"; });
      y.style.visibility = "visible";
      if (Capacitor.isNativePlatform()) void SplashScreen.hide({ fadeOutDuration: 0 }).catch(() => {});

      const yumusak = "cubic-bezier(.22,1,.36,1)"; // easeOutQuint: hızlı başlar, çok yavaş durur
      const kayma = { duration: KAYMA, delay: BEKLE, easing: yumusak, fill: "forwards" } as const;
      // Nokta önce hafifçe "nefes alır", sonra kayar ve yerine yumuşakça oturur.
      n.animate([{ scale: "1" }, { scale: "1.3" }, { scale: "1" }], { duration: BEKLE, easing: "ease-in-out" });
      n.animate([{ transform: `translateX(${basN}px)` }, { transform: "translateX(0)" }], kayma);
      n.animate([{ scale: "1" }, { scale: "1.25 0.8", offset: 0.35 }, { scale: "0.95 1.05", offset: 0.7 }, { scale: "1" }], { duration: 420, delay: BEKLE + KAYMA * 0.55, easing: "ease-out" });
      ke.animate([{ transform: `translateX(${basKe}px)` }, { transform: "translateX(0)" }], kayma);
      // Nokta bir harfin başına vardığı an (easeOutQuint'in tersi ile) o harf yukarı doğru, bulanıktan netleşerek gelir.
      harf.slice(1).forEach((h) => {
        const ilerleme = Math.min(1, Math.max(0, (h.offsetLeft - wU) / gizli));
        const an = BEKLE + KAYMA * (1 - Math.pow(1 - ilerleme, 1 / 5)) * 0.9;
        h.animate(
          [{ opacity: 0, transform: "translateY(14px) scale(.85)", filter: "blur(6px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }],
          { duration: 520, delay: an, easing: yumusak, fill: "forwards" },
        );
      });
      const son = BEKLE + KAYMA + DUR;
      y.animate([{ scale: "1" }, { scale: "1.06" }], { duration: SONME, delay: son, easing: "ease-in", fill: "forwards" });
      k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SONME, delay: son, easing: "ease-in", fill: "forwards" }).onfinish = bitti;
    });
    return () => { iptal = true; };
  }, [bitti]);
  return (
    <div ref={kutu} aria-hidden className="fixed inset-0 z-[100] grid place-items-center bg-white">
      <span ref={yazi} className="invisible relative flex font-display text-[56px] leading-none font-extrabold tracking-[-0.02em] text-[#1d3557]">
        <span ref={kelime} className="flex">{["u", "c", "l", "e", "r"].map((h) => <span key={h} className="inline-block">{h}</span>)}</span>
        <span ref={nokta} className="relative z-10 inline-block origin-bottom text-[#d63c63]">.</span>
      </span>
    </div>
  );
}
