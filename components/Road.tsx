"use client";
// Bir dersin konu listesi: hazır konular açık, yazılmamış olanlar "Yakında".
import Link from "next/link";
import { motion } from "motion/react";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Govde, href, Liste } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

const Dugum = ({ children, durum }: { children: React.ReactNode; durum: "bitti" | "acik" | "yakinda" }) => (
  <span
    className={cn(
      "grid size-8 flex-none place-items-center rounded-full border-[1.5px] font-display text-sm font-extrabold tabular-nums [&_svg]:size-4",
      durum === "bitti" && "border-acc bg-acc text-primary-foreground",
      durum === "acik" && "border-acc text-acc",
      durum === "yakinda" && "border-border-strong text-muted-foreground",
    )}
  >
    {children}
  </span>
);

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg();
  const s = DERSLER[ders];
  const ready = list.filter((e) => e.id), done = ready.filter((e) => prog[`${ders}.${e.id}`]).length;
  const Back = Icon.back, Check = Icon.check;
  return (
    <div className="app" data-ders={ders}>
      <header className="top">
        <Button asChild variant="outline" size="icon"><Link href="/" aria-label="Ana sayfa"><Back /></Link></Button>
      </header>
      <Govde>
        <section className="grid gap-1.5">
          <h1 className="text-[28px]">{s.ad}</h1>
          <p className="text-[15px] text-muted-foreground">{s.yol}. Konular sırayla birbirinin üzerine kurulu, baştan başlamak en iyisi.</p>
          <Progress className="mt-2.5" value={ready.length ? (100 * done) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti`} />
          <span className="text-[13px] font-semibold text-muted-foreground">{done} / {ready.length} konu bitti</span>
        </section>
        <Liste>
          <ol className="contents">
            {list.map((e, k) => {
              const anim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: Math.min(k, 10) * 0.025 } };
              if (!e.id)
                return (
                  <motion.li key={e.no} {...anim} className="flex items-start gap-3.5 p-4">
                    <Dugum durum="yakinda">{e.no}</Dugum>
                    <div className="grid min-w-0 gap-0.5">
                      <b className="font-semibold leading-snug text-muted-foreground">{e.ad}</b>
                      <span className="text-sm text-muted-foreground">Yakında</span>
                    </div>
                  </motion.li>
                );
              const res = prog[`${ders}.${e.id}`];
              return (
                <motion.li key={e.no} {...anim}>
                  <Link href={href(ders, e.id)} className="flex items-start gap-3.5 p-4 transition-colors active:bg-secondary">
                    <Dugum durum={res ? "bitti" : "acik"}>{res ? <Check /> : e.no}</Dugum>
                    <span className="grid min-w-0 gap-0.5">
                      <b className="font-bold leading-snug">{e.title}</b>
                      <span className="line-clamp-2 text-sm text-muted-foreground">{e.summary}</span>
                      <span className={cn("mt-0.5 text-xs font-semibold", res ? "text-acc" : "text-muted-foreground")}>
                        {e.cardCount} kart · {e.quizCount} soru{res ? ` · ${res}` : ""}
                      </span>
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ol>
        </Liste>
      </Govde>
    </div>
  );
}
