"use client";
// Bir dersin konuları: konu haritası (ön koşul bağlantılarıyla) ya da liste. Liste görünümünde hazır konular açık,
// ön koşulu bitmemiş olanlar kilitli, yazılmamış olanlar "Yakında".
import Link from "next/link";
import { motion } from "motion/react";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { durumlar } from "@/lib/harita";
import { setGorunum, useAsama, useGorunum, useProg, type Gorunum } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Govde, href, Liste } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Harita from "./Harita";

const Dugum = ({ children, durum }: { children: React.ReactNode; durum: "bitti" | "acik" | "kilitli" | "yakinda" }) => (
  <span
    className={cn(
      "grid size-8 flex-none place-items-center rounded-full border-[1.5px] font-display text-sm font-extrabold tabular-nums [&_svg]:size-4",
      durum === "bitti" && "border-acc bg-acc text-primary-foreground",
      durum === "acik" && "border-acc text-acc",
      durum === "kilitli" && "border-border bg-secondary text-muted-foreground",
      durum === "yakinda" && "border-border-strong text-muted-foreground",
    )}
  >
    {children}
  </span>
);

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg(), gorunum = useGorunum(), asama = useAsama();
  const s = DERSLER[ders];
  const d = durumlar(ders, list, prog);
  const ready = list.filter((e) => e.id), done = ready.filter((e) => prog[`${ders}.${e.id}`]).length;
  const Back = Icon.back, Check = Icon.check, Kilit = Icon.kilit;
  return (
    <div className="app" data-ders={ders}>
      <header className="top">
        <Button asChild variant="outline" size="icon"><Link href="/" aria-label="Ana sayfa"><Back /></Link></Button>
      </header>
      <Govde>
        <section className="grid gap-1.5">
          <h1 className="text-[28px]">{s.ad}</h1>
          <p className="text-[15px] text-muted-foreground">{s.yol}. Konular birbirinin üzerine kurulu; bir konuyu bitirince ona bağlı konuların kilidi açılır.</p>
          <Progress className="mt-2.5" value={ready.length ? (100 * done) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti`} />
          <span className="text-[13px] font-semibold text-muted-foreground">{done} / {ready.length} konu bitti</span>
        </section>
        <Secici deger={gorunum} />
        {gorunum === "harita" ? <Harita ders={ders} list={list} /> : (
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
              const res = prog[`${ders}.${e.id}`], kilitli = d[e.id] === "kilitli";
              const eksik = (e.on ?? []).filter((o) => d[o] !== "bitti").map((o) => list.find((x) => x.id === o)?.title);
              return (
                <motion.li key={e.no} {...anim}>
                  <Link href={href(ders, e.id)} className="flex items-start gap-3.5 p-4 transition-colors active:bg-secondary">
                    <Dugum durum={res ? "bitti" : kilitli ? "kilitli" : "acik"}>{res ? <Check /> : kilitli ? <Kilit /> : e.no}</Dugum>
                    <span className="grid min-w-0 gap-0.5">
                      <b className="font-bold leading-snug">{e.title}</b>
                      <span className="line-clamp-2 text-sm text-muted-foreground">{e.summary}</span>
                      <span className={cn("mt-0.5 text-xs font-semibold", res ? "text-acc" : "text-muted-foreground")}>
                        {e.cardCount} kart · {e.quizCount} soru{res ? ` · ${res}` : asama[`${ders}.${e.id}`] ? ` · ${asama[`${ders}.${e.id}`]}/${asamaSayisi(e.cardCount ?? 0)} aşama` : ""}
                      </span>
                      {kilitli && <span className="text-xs font-medium text-muted-foreground">Önce: {eksik.join(", ")}</span>}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ol>
        </Liste>
        )}
      </Govde>
    </div>
  );
}

/** Harita / Liste seçimi. */
function Secici({ deger }: { deger: Gorunum }) {
  const H = Icon.harita, L = Icon.liste;
  return (
    <div role="radiogroup" aria-label="Görünüm" className="-mb-2 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
      {([["harita", "Harita", H], ["liste", "Liste", L]] as const).map(([k, ad, I]) => (
        <button
          key={k}
          role="radio"
          aria-checked={deger === k}
          onClick={() => setGorunum(k)}
          className={cn(
            "flex h-9 items-center justify-center gap-1.5 rounded-lg text-[14px] font-bold transition-colors [&_svg]:size-4",
            deger === k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          <I />{ad}
        </button>
      ))}
    </div>
  );
}
