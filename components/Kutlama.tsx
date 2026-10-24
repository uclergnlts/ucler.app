"use client";
// Aşama ya da konu bitince: konfeti, ortada büyük bir madalya ve sayarak artan puan.
import { useEffect, useMemo, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { Icon } from "./icons";
import { useOyunAcik } from "@/lib/oyun";

const RENK = ["var(--acc)", "var(--glow)", "var(--c1)", "var(--c3)", "var(--c5)", "var(--c2)"];

/** Rastgele ama her açılışta aynı dağılan konfeti parçaları. */
function parcalar(n: number) {
  let t = 7;
  const r = () => ((t = (t * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, (_, k) => ({
    x: r() * 100, gec: r() * 0.35, sure: 1.6 + r() * 1.2, don: (r() - 0.5) * 720, kay: (r() - 0.5) * 80,
    w: 6 + r() * 6, h: 8 + r() * 8, renk: RENK[k % RENK.length], yuvarlak: r() < 0.3,
  }));
}

export function Konfeti() {
  const az = useReducedMotion(), oyun = useOyunAcik();
  const p = useMemo(() => parcalar(42), []);
  if (az || !oyun) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {p.map((q, k) => (
        <motion.span
          key={k}
          className="absolute top-0"
          style={{ left: `${q.x}%`, width: q.w, height: q.yuvarlak ? q.w : q.h, background: q.renk, borderRadius: q.yuvarlak ? 99 : 2 }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: q.kay, rotate: q.don, opacity: [1, 1, 0] }}
          transition={{ duration: q.sure, delay: q.gec, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/** Ortadaki madalya: büyüyerek gelir, etrafında ışık halkası. */
export function Madalya({ kupa: kupaIste }: { kupa?: boolean }) {
  const oyun = useOyunAcik(), kupa = kupaIste && oyun;
  const Check = Icon.check, Kupa = Icon.kupa;
  return (
    <div className="relative grid size-32 place-items-center">
      <motion.span
        className="absolute inset-0 rounded-full bg-acc-soft"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.15, 1] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full border-4 border-acc"
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
      />
      <motion.span
        className={kupa
          ? "relative grid size-24 place-items-center rounded-full bg-[var(--glow)] text-[#7a5200] shadow-[0_6px_0_var(--glow-deep)] [&_svg]:size-12"
          : "relative grid size-24 place-items-center rounded-full bg-acc text-white shadow-[0_6px_0_color-mix(in_srgb,var(--acc),#000_22%)] [&_svg]:size-12 [&_svg]:stroke-[3]"}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
      >
        {kupa ? <Kupa /> : <Check />}
      </motion.span>
    </div>
  );
}

/** "+10 puan" gibi sayarak artan puan rozeti. */
export function PuanRozet({ puan }: { puan: number }) {
  const [n, setN] = useState(0);
  const oyun = useOyunAcik();
  useEffect(() => {
    const a = animate(0, puan, { duration: 0.8, delay: 0.5, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => a.stop();
  }, [puan]);
  const Yildiz = Icon.yildiz;
  if (!oyun) return null;
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--glow-soft)] px-4 py-2 text-[17px] font-extrabold tabular-nums text-[#7a5200] [&_svg]:size-5 [&_svg]:fill-[var(--glow)] [&_svg]:stroke-[var(--glow-deep)]"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.4 }}
    >
      <Yildiz />+{n} puan
    </motion.span>
  );
}
