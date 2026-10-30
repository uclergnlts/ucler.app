"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { bugunku, doneKeys, gunAdi, useAd, useAsama, useProg, useTekrar, useYer } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { sureYaz, VIDEOLAR } from "@/lib/videolar";
import { Icon } from "./icons";
import { motion } from "motion/react";
import { Progress } from "./ui/progress";
import Bugun from "./Bugun";
import { GunSorusuKart } from "./GunSorusu";
import { Bolum, Govde, href, Simge, Top } from "./temel";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

// Henüz içeriği olmayan dersler: kartı görünür, dokununca "yakında" der.
const YAKINDA = [["matematik", "Matematik"], ["tarih", "Tarih"], ["cografya", "Coğrafya"], ["hukuk", "Hukuk"]] as const;
const dersKart = "flex min-h-[160px] flex-col justify-between gap-3 rounded-3xl border border-border bg-card p-4 transition-transform active:scale-[.98]";

export default function Home({ all, gunHavuz }: { all: Record<DersId, Entry[]>; gunHavuz: string[] }) {
  const prog = useProg(), ad = useAd(), tekrar = useTekrar(), asama = useAsama(), yer = useYer();
  const bugun = bugunku(tekrar).length, kalan = Object.keys(tekrar).length;
  const sonraki = Object.values(tekrar).map((x) => x.g).sort()[0];
  const doneAll = doneKeys(prog).length;
  const [ld, lid] = (prog._last || "").split(".");
  const last = ld in all ? all[ld as DersId].find((e) => e.id && e.id === lid) : undefined;
  // Yeni kullanıcı: hiçbir konuya girmemiş. Ona önce sitenin ne olduğu ve tek bir başlangıç noktası gösterilir.
  const ilk = all.fizik.find((e) => e.id);
  const yeni = !last && doneAll === 0 && !Object.keys(asama).length;
  // Görevlerin götürdüğü konu: kalınan konu, yoksa ilk konu.
  const hedef = last ?? ilk;
  const gorevHref = hedef ? href(hedef.ders, hedef.id) : "/kesfet/";
  const Next = Icon.ileri, Play = Icon.play, Tekrar = Icon.tekrar;
  const router = useRouter();

  // Eski tek sayfalık sürümün adresleri (#kimya.simya, #kesfet, #kayit...) yeni adreslere yönlensin.
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const [d, id] = h.split(".");
    const page = ({ kesfet: "/kesfet/", kayit: "/profil/kaydedilenler/", profil: "/profil/" } as Record<string, string>)[d];
    if (page) router.replace(page);
    else if (d in all) router.replace(id ? href(d, id) : href(d));
  }, [all, router]);

  return (
    <div className="app">
      <Top><Bugun konuHref={gorevHref} /></Top>
      <Govde>
        <section className="grid gap-1.5">
          <h1 className="text-[28px]">Hoş geldin{ad ? `, ${ad}` : ""}</h1>
          {yeni ? (
            <p className="text-[15px] text-muted-foreground">Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve her konunun sonunda 4 soruluk bir test.</p>
          ) : doneAll > 0 && <p className="text-[15px] text-muted-foreground">Şimdiye kadar {doneAll} konu bitirdin.</p>}
        </section>

        <GunSorusuKart havuz={gunHavuz} />

        {yeni && ilk && (
          <Link
            data-ders={ilk.ders}
            href={href(ilk.ders, ilk.id)}
            className="flex items-center gap-3.5 rounded-2xl bg-acc p-4 text-primary-foreground transition-transform active:scale-[.99]"
          >
            <span className="grid size-11 flex-none place-items-center rounded-xl bg-white/20 [&_svg]:size-5"><Play /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold opacity-85">İlk konuna başla</span>
              <b className="block truncate font-bold">{ilk.title}</b>
            </span>
            <Next />
          </Link>
        )}

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
              {(() => {
                const nA = asamaSayisi(last.cardCount ?? 0), k = `${last.ders}.${last.id}`;
                const b = prog[k] ? nA : Math.min(asama[k] ?? 0, nA);
                return (
                  <span className="mt-2 flex items-center gap-2.5">
                    <span className="flex flex-1 gap-1" aria-hidden="true">
                      {Array.from({ length: nA }, (_, a) => <span key={a} className={`h-1.5 flex-1 rounded-full ${a < b ? "bg-white" : "bg-white/30"}`} />)}
                    </span>
                    <span className="flex-none text-[12px] font-semibold opacity-90">{prog[k] ? "Bitti" : `${nA} aşamadan ${b} tanesi bitti`}</span>
                  </span>
                );
              })()}
            </span>
            <Next />
          </Link>
        )}

        <Bolum title="Dersler">
          <div className="grid grid-cols-2 gap-3">
            {DERS_IDS.map((d) => {
              const s = DERSLER[d], ready = all[d].filter((e) => e.id);
              const done = ready.filter((e) => prog[`${d}.${e.id}`]).length;
              // Başlanan: en az bir aşaması bitmiş ya da ortasında kalınmış ama testi bitmemiş konular.
              const basladi = ready.filter((e) => { const k = `${d}.${e.id}`; return !prog[k] && ((asama[k] ?? 0) > 0 || yer[k]); }).length;
              // Çubuk aşama aşama dolar: bitmiş konu tam, başlanmış konu bitirdiği aşama kadar.
              const dolu = ready.reduce((n, e) => {
                const k = `${d}.${e.id}`, nA = asamaSayisi(e.cardCount ?? 0);
                return n + (prog[k] ? 1 : Math.min(asama[k] ?? 0, nA) / nA);
              }, 0);
              const I = Icon[d];
              return (
                <Link key={d} data-ders={d} href={href(d)} className={dersKart}>
                  <Simge className="size-14 rounded-2xl [&_svg]:size-7"><I /></Simge>
                  <span className="grid gap-1">
                    <b className="font-display text-[18px] font-extrabold">{s.ad}</b>
                    <span className="text-[13px] font-bold tabular-nums text-muted-foreground">{basladi ? `${basladi} başladın · ${done} bitti` : `${done}/${ready.length} konu`}</span>
                    <Progress className="mt-1 h-1.5" value={ready.length ? (100 * dolu) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti${basladi ? `, ${basladi} tanesine başladın` : ""}`} />
                  </span>
                </Link>
              );
            })}
            {YAKINDA.map(([k, ad]) => {
              const I = Icon[k];
              return (
                <Sheet key={k}>
                  <SheetTrigger className={cn(dersKart, "text-left")}>
                    <Simge soluk className="size-14 rounded-2xl [&_svg]:size-7"><I /></Simge>
                    <span className="grid gap-1">
                      <b className="font-display text-[18px] font-extrabold text-muted-foreground">{ad}</b>
                      <span className="text-[13px] font-bold text-muted-foreground">Yakında</span>
                    </span>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="grid justify-items-center gap-3 py-4 text-center">
                      <Simge soluk className="size-16 rounded-2xl [&_svg]:size-8"><I /></Simge>
                      <SheetTitle className="text-[22px]">{ad} yakında</SheetTitle>
                      <SheetDescription className="text-muted-foreground">Bu dersin konularını hazırlıyoruz. Hazır olunca burada açılacak.</SheetDescription>
                      <SheetClose asChild><Button className="mt-2 w-full">Tamam</Button></SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        </Bolum>

        {/* Deneme sınavı henüz yok: kart görünür, dokununca "yakında" der. */}
        <Sheet>
          <SheetTrigger className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-transform active:scale-[.99]">
            <Simge soluk className="size-11 [&_svg]:size-5"><Icon.kupa /></Simge>
            <span className="min-w-0 flex-1">
              <b className="block font-bold">Deneme sınavı</b>
              <span className="block text-[13px] font-semibold text-muted-foreground">Yakında</span>
            </span>
          </SheetTrigger>
          <SheetContent>
            <div className="grid justify-items-center gap-3 py-4 text-center">
              <Simge soluk className="size-16 rounded-2xl [&_svg]:size-8"><Icon.kupa /></Simge>
              <SheetTitle className="text-[22px]">Deneme sınavı yakında</SheetTitle>
              <SheetDescription className="text-muted-foreground">Bütün derslerden karışık, süreli bir deneme sınavı hazırlıyoruz. Hazır olunca burada açılacak.</SheetDescription>
              <SheetClose asChild><Button className="mt-2 w-full">Tamam</Button></SheetClose>
            </div>
          </SheetContent>
        </Sheet>

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

      </Govde>
    </div>
  );
}
