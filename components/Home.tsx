"use client";
import { cev, SAYI_YEREL } from "@/lib/dil";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { bugunku, doneKeys, gunAdi, useAd, useAsama, useProg, useTekrar, useYer } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { Icon } from "./icons";
import { Progress } from "./ui/progress";
import Bugun from "./Bugun";
import { GunSorusuKart } from "./GunSorusu";
import { Bolum, Govde, href, Simge, Top } from "./temel";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { YAKINDA_GOSTER } from "@/lib/site";

// Henüz içeriği olmayan dersler: kartı görünür, dokununca "yakında" der.
const YAKINDA = YAKINDA_GOSTER ? ([["matematik", cev("Matematik")], ["tarih", cev("Tarih")], ["cografya", cev("Coğrafya")]] as const) : [];
// Deney defteri (2026-11-16): devam ve tekrar satırları kâğıt kart; solda mürekkep renginde yuvarlak oynat düğmesi.
const satirKart = "flex items-center gap-3.5 rounded-lg border border-border bg-card p-4 transition-transform active:scale-[.99]";
const oynat = "grid size-10 flex-none place-items-center rounded-full border-[1.5px] border-[var(--ink)] text-foreground [&_svg]:size-4";
const tarihBicim = new Intl.DateTimeFormat(SAYI_YEREL, { weekday: "long", day: "numeric", month: "long" });

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
  // Tarih yalnız tarayıcıda yazılır (sayfa önceden derlendiği için sunucudaki tarih eskir).
  const [tarih, setTarih] = useState("");
  useEffect(() => setTarih(tarihBicim.format(new Date())), []);

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
        <section className="grid gap-1">
          <span className="text-[11px] font-bold tracking-[.14em] text-muted-foreground uppercase">{tarih}</span>
          <h1 className="text-[28px]">{cev("Hoş geldin")}{ad ? `, ${ad}` : ""}</h1>
          {yeni ? (
            <p className="text-[15px] text-muted-foreground">{cev("Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve her konunun sonunda 4 soruluk bir test.")}</p>
          ) : doneAll > 0 && <p className="text-[15px] text-muted-foreground">{cev("Şimdiye kadar")} {doneAll} {cev("konu bitirdin.")}</p>}
        </section>

        <GunSorusuKart havuz={gunHavuz} />

        {yeni && ilk && (
          <Link data-ders={ilk.ders} href={href(ilk.ders, ilk.id)} className={satirKart}>
            <span className={oynat}><Play /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold text-muted-foreground">{cev("İlk konuna başla ·")} {DERSLER[ilk.ders].ad}</span>
              <b className="block truncate font-display text-[17px] font-extrabold">{ilk.title}</b>
            </span>
            <Next />
          </Link>
        )}

        {bugun > 0 && (
          <Link href="/tekrar/" className={satirKart}>
            <span className={oynat}><Tekrar /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold text-muted-foreground">{cev("Tekrar zamanı")}</span>
              <b className="block font-display text-[17px] font-extrabold">{cev("Bugün")} {bugun} {cev("soru seni bekliyor")}</b>
            </span>
            <Next />
          </Link>
        )}
        {bugun === 0 && kalan > 0 && sonraki && (
          <p className="-mt-3 flex items-center gap-2 text-[14px] text-muted-foreground [&_svg]:size-4"><Tekrar />{cev("Tekrar sıranda {0} soru var; ilki {1} gelecek.", kalan, gunAdi(sonraki))}</p>
        )}

        {last && (() => {
          const nA = asamaSayisi(last.cardCount ?? 0), k = `${last.ders}.${last.id}`;
          const b = prog[k] ? nA : Math.min(asama[k] ?? 0, nA);
          return (
            <Link data-ders={last.ders} href={href(last.ders, last.id)} className={satirKart}>
              <span className={oynat}><Play /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-semibold text-muted-foreground">{cev("Kaldığın yer ·")} {DERSLER[last.ders].ad}</span>
                <b className="block truncate font-display text-[17px] font-extrabold">{last.title}</b>
                <span className="mt-2 flex gap-[3px]" aria-hidden="true">
                  {Array.from({ length: nA }, (_, a) => <span key={a} className={cn("h-[3px] w-6", a < b ? "bg-foreground" : "bg-border-strong")} />)}
                </span>
              </span>
              <span className="flex-none text-[13px] font-semibold tabular-nums text-muted-foreground">{prog[k] ? cev("Bitti") : `${b}/${nA}`}</span>
              <span className="sr-only">{prog[k] ? cev("Bitti") : cev("{0} aşamadan {1} tanesi bitti", nA, b)}</span>
            </Link>
          );
        })()}

        <Bolum title={cev("Dersler")}>
          <div className="grid">
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
              return (
                <Link key={d} data-ders={d} href={href(d)} className="relative mb-2.5 grid min-h-[116px] content-between overflow-hidden rounded-lg border border-border bg-card p-4 pr-[120px] transition-transform active:scale-[.99]">
                  {/* Gravür: kanal kapaklarındaki taralı nesne. Tek renkli maske olduğu için iki temada da mürekkep rengini alır. */}
                  <span aria-hidden className="absolute -right-1 bottom-0 top-2 w-[118px] bg-[var(--ink)] opacity-90" style={{ maskImage: `url(/gravur/${d}.png)`, WebkitMaskImage: `url(/gravur/${d}.png)`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center bottom", WebkitMaskPosition: "center bottom" }} />
                  <span className="grid gap-0.5">
                    <b className="font-display text-[22px] leading-tight font-extrabold">{s.ad}</b>
                    <span className="font-mono text-[11px] tracking-[.08em] text-muted-foreground uppercase">{basladi ? cev("{0} başladın · {1}/{2}", basladi, done, ready.length) : cev("{0} / {1} konu", done, ready.length)}</span>
                  </span>
                  <Progress className="h-[3px] rounded-none" value={ready.length ? (100 * dolu) / ready.length : 0} label={cev("{0} konudan {1} tanesi bitti{2}", ready.length, done, basladi ? cev(", {0} tanesine başladın", basladi) : "")} />
                </Link>
              );
            })}
            {YAKINDA.map(([k, ad]) => {
              const I = Icon[k];
              return (
                <Sheet key={k}>
                  <SheetTrigger className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border py-3 text-left text-muted-foreground">
                    <span className="[&_svg]:size-5"><I /></span>
                    <span className="font-display text-[16px] font-bold">{ad}</span>
                    <span className="text-[13px] font-semibold">{cev("Yakında")}</span>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="grid justify-items-center gap-3 py-4 text-center">
                      <Simge soluk className="size-16 rounded-2xl [&_svg]:size-8"><I /></Simge>
                      <SheetTitle className="text-[22px]">{ad} {cev("yakında")}</SheetTitle>
                      <SheetDescription className="text-muted-foreground">{cev("Bu dersin konularını hazırlıyoruz. Hazır olunca burada açılacak.")}</SheetDescription>
                      <SheetClose asChild><Button className="mt-2 w-full">{cev("Tamam")}</Button></SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        </Bolum>


      </Govde>
    </div>
  );
}
