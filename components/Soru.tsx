"use client";
// Test sorusunun şıkları ve alttaki sabit çubuk. Ders ekranındaki mini test ve tekrar ekranı ortak kullanır.
import { motion } from "motion/react";
import type { Question } from "@/lib/dersler";
import { cn } from "@/lib/utils";
import { Html } from "./temel";

/** Şıklar: seçilince doğru yeşil, seçilen yanlış kırmızı, kalanlar soluk. */
export function Secenekler({ q, picked, pick }: { q: Question; picked: number | null; pick: (k: number) => void }) {
  return (
    <div className="grid gap-2">
      {q.o.map((o, k) => {
        const durum = picked === null ? "" : k === q.a ? "right" : k === picked ? "wrong" : "pasif";
        return (
          <motion.button
            key={k}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-[1.5px] bg-card px-3.5 py-3 text-left text-base font-medium transition-colors",
              durum === "" && "border-border hover:border-border-strong",
              durum === "right" && "border-good bg-good-soft",
              durum === "wrong" && "border-bad bg-bad-soft",
              durum === "pasif" && "border-border opacity-55",
            )}
            disabled={picked !== null}
            onClick={() => pick(k)}
            whileTap={picked === null ? { scale: 0.98 } : undefined}
            animate={durum === "wrong" ? { x: [0, -5, 5, -3, 0] } : durum === "right" ? { scale: [1, 1.02, 1] } : undefined}
            transition={{ duration: 0.3 }}
          >
            <span
              className={cn(
                "grid size-7 flex-none place-items-center rounded-lg text-[13px] font-bold",
                durum === "right" ? "bg-good text-white" : durum === "wrong" ? "bg-bad text-white" : "bg-secondary text-muted-foreground",
              )}
            >
              {"ABCD"[k]}
            </span>
            <Html html={o} />
          </motion.button>
        );
      })}
    </div>
  );
}

/** Alttaki sabit çubuk: düğmeler ve (testte) renkli geri bildirim. */
export function Alt({ durum, children }: { durum?: "ok" | "no"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 -mx-4 mt-auto border-t px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] transition-colors duration-200",
        durum === "ok" ? "border-transparent bg-good-soft" : durum === "no" ? "border-transparent bg-bad-soft" : "border-border bg-card/95 backdrop-blur",
      )}
    >
      {children}
    </div>
  );
}

