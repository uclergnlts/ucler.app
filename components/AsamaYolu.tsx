"use client";
// Konu girişindeki aşama yolu: aşamalar kıvrılan bir yolun üstünde büyük düğmeler, en sonda mini test (kupa).
// Bitmiş aşama dolu ve işaretli, sıradaki aşama nabız gibi atar ve üstünde "Başla" balonu durur, kilitliler gri.
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html } from "./temel";
import { Icon } from "./icons";

/** serbest: kilitli görünse de dokunulunca açılır (mini test: konuyu bilen öğrenci aşamaları beklemeden çözebilir). */
export type YolDugum = { baslik: string; alt: string; durum: "bitti" | "sirada" | "kilitli"; test?: boolean; serbest?: boolean; ac: () => void };

const SATIR = 112; // bir düğümün satır yüksekliği (px)
const KAYMA = [0, 26, 0, -26]; // düğümün ortadan sapması (% genişlik), yol bu sırayla kıvrılır

export default function AsamaYolu({ dugumler, balon }: { dugumler: YolDugum[]; balon: string }) {
  const x = (i: number) => 50 + KAYMA[i % KAYMA.length];
  const h = dugumler.length * SATIR;
  // Düğüm merkezlerinden geçen yumuşak yol (viewBox: genişlik 100, yükseklik piksel).
  const yol = (son: number) => {
    let d = `M ${x(0)} ${SATIR / 2}`;
    for (let i = 1; i <= son; i++) {
      const y0 = (i - 0.5) * SATIR, y1 = (i + 0.5) * SATIR, orta = (y0 + y1) / 2;
      d += ` C ${x(i - 1)} ${orta}, ${x(i)} ${orta}, ${x(i)} ${y1}`;
    }
    return d;
  };
  // Renkli yol: baştan sıradaki düğüme kadar (bitmiş aşamalar ve onlardan sıradakine giden parça).
  const sirada = dugumler.findIndex((g) => g.durum === "sirada");
  const renkliSon = Math.max(sirada, dugumler.reduce((n, g, i) => (g.durum === "bitti" ? i : n), -1));
  const Check = Icon.check, Kilit = Icon.kilit, Kupa = Icon.kupa;

  return (
    <div className="relative" style={{ height: h }}>
      <svg className="absolute inset-0 size-full" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={yol(dugumler.length - 1)} fill="none" stroke="var(--line-2)" strokeWidth={8} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {renkliSon > 0 && (
          <motion.path
            d={yol(renkliSon)}
            fill="none"
            stroke="var(--acc)"
            strokeWidth={8}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
           
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          />
        )}
      </svg>
      <ol aria-label="Aşamalar">
        {dugumler.map((g, i) => {
          const solda = x(i) > 50; // düğüm sağdaysa yazı solda
          return (
            <li key={i} className="absolute inset-x-0" style={{ top: i * SATIR, height: SATIR }}>
              <motion.button
                disabled={g.durum === "kilitli" && !g.serbest}
                onClick={g.ac}
                aria-label={`${g.baslik}, ${g.durum === "bitti" ? "bitti" : g.durum === "sirada" ? "sıradaki" : g.serbest ? "aşamalar bitmeden de çözebilirsin" : "kilitli"}`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x(i)}%` }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.05 + i * 0.07 }}
                whileTap={g.durum === "kilitli" && !g.serbest ? undefined : { y: 4 }}
              >
                {g.durum === "sirada" && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full bg-acc"
                      animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      aria-hidden="true"
                    />
                    <motion.span
                      className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-xl border-2 border-border bg-card px-3 py-1 text-[14px] font-extrabold whitespace-nowrap text-acc shadow-sm after:absolute after:top-full after:left-1/2 after:-mt-[5px] after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:border-r-2 after:border-b-2 after:border-border after:bg-card"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {balon}
                    </motion.span>
                  </>
                )}
                <span
                  className={cn(
                    "relative grid size-[72px] place-items-center rounded-full font-display text-[26px] font-extrabold [&_svg]:size-8 [&_svg]:stroke-[2.6]",
                    g.durum === "kilitli"
                      ? "bg-secondary text-muted-foreground shadow-[0_6px_0_var(--line-2)]"
                      : g.test
                        ? "bg-[var(--glow)] text-[#7a5200] shadow-[0_6px_0_var(--glow-deep)]"
                        : "bg-acc text-white shadow-[0_6px_0_color-mix(in_srgb,var(--acc),#000_22%)]",
                  )}
                >
                  {g.durum === "kilitli" && !g.serbest ? <Kilit /> : g.test ? <Kupa /> : g.durum === "bitti" ? <Check /> : i + 1}
                </span>
              </motion.button>
              <div
                className={cn("absolute top-1/2 grid w-[34%] -translate-y-1/2 gap-0.5", solda ? "text-right" : "text-left")}
                style={solda ? { right: `${100 - x(i) + 13}%` } : { left: `${x(i) + 13}%` }}
              >
                <b className={cn("text-[15px] leading-tight font-extrabold", g.durum === "kilitli" && "text-muted-foreground")}>{g.baslik}</b>
                <Html as="span" className="line-clamp-2 text-[13px] leading-snug text-muted-foreground" html={g.alt} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
