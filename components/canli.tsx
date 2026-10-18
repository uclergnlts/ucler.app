"use client";
// Derslerde "canlı" giriş: görseller parça parça çizilerek belirir, yazılar cümle cümle gelir.
// Brilliant'taki gibi içerik ekrana bir anda değil, sırayla akar.
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Html } from "./temel";

const azHareket = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** SVG'nin parçalarını sırayla getirir: çizgiler çizilir, diğerleri belirir. Yalnızca geçici animasyon; DOM değişmez. */
export function svgCanlandir(svg: SVGSVGElement | null, gecikme = 0) {
  if (!svg || azHareket()) return;
  // Tek bir kapsayıcı <g> varsa onun çocuklarını sırala.
  let kok: Element = svg;
  while (kok.children.length === 1 && kok.firstElementChild?.tagName.toLowerCase() === "g") kok = kok.firstElementChild;
  const parcalar = [...kok.children].filter((e) => !["defs", "style", "title", "desc"].includes(e.tagName.toLowerCase()));
  const n = parcalar.length, toplam = Math.min(1100, n * 70);
  parcalar.forEach((el, i) => {
    const delay = gecikme + (n > 1 ? (i / (n - 1)) * toplam : 0);
    const tag = el.tagName.toLowerCase();
    const st = getComputedStyle(el);
    const cizgi = ["path", "line", "polyline"].includes(tag) && (st.fill === "none" || tag === "line") && st.strokeDasharray === "none";
    if (cizgi && "getTotalLength" in el) {
      const L = Math.max(1, (el as SVGGeometryElement).getTotalLength());
      el.animate(
        [{ strokeDasharray: `${L}`, strokeDashoffset: `${L}` }, { strokeDasharray: `${L}`, strokeDashoffset: "0" }],
        { duration: 550, delay, easing: "ease-out", fill: "backwards" },
      );
    } else {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay, easing: "ease-out", fill: "backwards" });
    }
  });
}

/** Kutunun içindeki ilk SVG'yi, kutu ekrana ilk geldiğinde canlandırır. */
export function useCanliSvg<T extends HTMLElement>(gecikme = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    svgCanlandir(ref.current?.querySelector("svg") ?? null, gecikme);
  }, [gecikme]);
  return ref;
}

/** HTML içerikli SVG (ders kartlarındaki görseller). */
export function CanliSvg({ html, className }: { html: string; className?: string }) {
  const ref = useCanliSvg<HTMLDivElement>();
  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Metni cümlelere böler; etiketler bölünürse bölmeden tek parça döner. */
export function cumleler(html: string): string[] {
  const parcalar = html.split(/(?<=[.!?…:])\s+(?=[A-ZÇĞİÖŞÜ0-9<"“(])/u);
  const dengeli = (s: string) => {
    const yigin: string[] = [];
    for (const m of s.matchAll(/<(\/?)([a-z0-9]+)[^>]*?(\/?)>/gi)) {
      const ad = m[2].toLowerCase();
      if (m[3] || ad === "br" || ad === "wbr") continue;
      if (!m[1]) yigin.push(ad);
      else if (yigin.pop() !== ad) return false;
    }
    return yigin.length === 0;
  };
  return parcalar.every(dengeli) ? parcalar : [html];
}

/** Cümleleri sırayla getirir. */
export function SiraliMetin({ html, className, gecikme = 0, aralik = 0.35 }: { html: string; className?: string; gecikme?: number; aralik?: number }) {
  const c = cumleler(html);
  return (
    <p className={className}>
      {c.map((s, k) => (
        <motion.span
          key={k}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: gecikme + k * aralik, ease: "easeOut" }}
        >
          <Html html={s} />{k < c.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

/** Bir parçayı aşağıdan yumuşakça getirir. */
export function Belir({ gecikme = 0, children, className }: { gecikme?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: gecikme, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
