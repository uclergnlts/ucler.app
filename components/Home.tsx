"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { bugunku, doneKeys, gunAdi, useAd, useProg, useTekrar } from "@/lib/store";
import { sureYaz, VIDEOLAR } from "@/lib/videolar";
import { Icon } from "./icons";
import { motion } from "motion/react";
import { Progress } from "./ui/progress";
import { Bolum, Govde, href, InstaLink, Liste, Simge, Top } from "./temel";

export default function Home({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg(), ad = useAd(), tekrar = useTekrar();
  const bugun = bugunku(tekrar).length, kalan = Object.keys(tekrar).length;
  const sonraki = Object.values(tekrar).map((x) => x.g).sort()[0];
  const doneAll = doneKeys(prog).length;
  const [ld, lid] = (prog._last || "").split(".");
  const last = ld in all ? all[ld as DersId].find((e) => e.id && e.id === lid) : undefined;
  const Next = Icon.ileri, Play = Icon.play, Tekrar = Icon.tekrar;
  const router = useRouter();

  // Eski tek sayfalık sürümün adresleri (#kimya.simya, #kesfet, #kayit...) yeni adreslere yönlensin.
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const [d, id] = h.split(".");
    const page = ({ kesfet: "/kesfet/", kayit: "/profil/", profil: "/profil/" } as Record<string, string>)[d];
    if (page) router.replace(page);
    else if (d in all) router.replace(id ? href(d, id) : href(d));
  }, [all, router]);

  return (
    <div className="app">
      <Top />
      <Govde>
        <section className="grid gap-1.5">
          <h1 className="text-[28px]">Hoş geldin{ad ? `, ${ad}` : ""}</h1>
          {doneAll > 0 && <p className="text-[15px] text-muted-foreground">Şimdiye kadar {doneAll} konu bitirdin.</p>}
        </section>

        {bugun > 0 && (
          <Link href="/tekrar/" className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-foreground bg-card p-4 transition-transform active:scale-[.99]">
            <span className="grid size-11 flex-none place-items-center rounded-xl bg-secondary [&_svg]:size-5"><Tekrar /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-muted-foreground">Tekrar zamanı</span>
              <b className="block font-bold">Bugün {bugun} soru seni bekliyor</b>
            </span>
            <Next />
          </Link>
        )}
        {bugun === 0 && kalan > 0 && sonraki && (
          <p className="-mt-3 flex items-center gap-2 text-[14px] text-muted-foreground [&_svg]:size-4"><Tekrar />Tekrar sıranda {kalan} soru var; ilki {gunAdi(sonraki)} gelecek.</p>
        )}

        {last && (
          <Link
            data-ders={last.ders}
            href={href(last.ders, last.id)}
            className="flex items-center gap-3.5 rounded-2xl bg-acc p-4 text-primary-foreground transition-transform active:scale-[.99]"
          >
            <span className="grid size-11 flex-none place-items-center rounded-xl bg-white/20 [&_svg]:size-5"><Play /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold opacity-85">Kaldığın yerden devam et</span>
              <b className="block truncate font-bold">{last.title}</b>
            </span>
            <Next />
          </Link>
        )}

        <Bolum title="Dersler">
          <Liste>
            {DERS_IDS.map((d) => {
              const s = DERSLER[d], ready = all[d].filter((e) => e.id);
              const done = ready.filter((e) => prog[`${d}.${e.id}`]).length;
              const I = Icon[d];
              return (
                <Link key={d} data-ders={d} href={href(d)} className="flex items-center gap-3.5 p-4 transition-colors active:bg-secondary">
                  <Simge className="size-11 [&_svg]:size-[22px]"><I /></Simge>
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <b className="font-display text-[17px] font-extrabold">{s.ad}</b>
                    <span className="text-sm text-muted-foreground">{s.yol}</span>
                    <Progress className="mt-1.5 h-1" value={ready.length ? (100 * done) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti`} />
                  </span>
                  <span className="flex-none text-[13px] font-bold tabular-nums text-muted-foreground">{done}/{ready.length}</span>
                </Link>
              );
            })}
          </Liste>
        </Bolum>

        {VIDEOLAR.length > 0 && (
          <Bolum title="Kısa videolar" more={<Link className="text-sm font-bold text-muted-foreground" href="/videolar/">Tümü</Link>}>
            <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 [scrollbar-width:none]">
              {VIDEOLAR.map((v, k) => (
                <motion.div
                  key={v.id}
                  className="w-[118px] flex-none snap-start"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(k, 6) * 0.04 }}
                >
                  <Link href={`/videolar/#${v.id}`} aria-label={`${v.baslik} (${sureYaz(v.sure)})`} className="relative block aspect-[9/16] overflow-hidden rounded-xl border border-border bg-secondary">
                    {v.poster && <img src={v.poster} alt="" loading="lazy" className="size-full object-cover" />}
                    <span className="absolute right-1.5 bottom-1.5 rounded-md bg-white/90 px-1.5 text-[11px] font-bold">{sureYaz(v.sure)}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Bolum>
        )}

        <InstaLink />
      </Govde>
    </div>
  );
}
