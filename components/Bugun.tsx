"use client";
// Ana sayfanın sağ üstündeki küçük simgeler: haftalık lig (kupa, /lig/), seri (alev + gün sayısı) ve günün görevleri (halka + x/3).
// Simgeye dokununca alttan bir pencere açılır: seri için puan ve son 7 gün, görevler için liste.
// Her görev, yapılacağı yere götürür (oyun → Oyunlar, video → Videolar, tekrar → Tekrar, gerisi → kalınan konu).
import { cev } from "@/lib/dil";
import Link from "next/link";
import { motion } from "motion/react";
import { aktif, gorevAdi, PUAN, seri, useGorev, usePuan, type GorevId } from "@/lib/puan";
import { gun } from "@/lib/store";
import { useOyunAcik } from "@/lib/oyun";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Icon } from "./icons";

const GUN_ADI = [cev("Pz"), cev("Pt"), cev("Sa"), cev("Ça"), cev("Pe"), cev("Cu"), cev("Ct")];

/** Görev türünün simgesi ve rengi. */
const GOREV_GORUNUM: Record<GorevId, { ikon: keyof typeof Icon; renk: string }> = {
  asama: { ikon: "harita", renk: "var(--c1)" },
  kart: { ikon: "kitap", renk: "var(--c1)" },
  adim: { ikon: "bulb", renk: "var(--c4)" },
  dogru: { ikon: "check", renk: "var(--c3)" },
  konu: { ikon: "kupa", renk: "var(--c4)" },
  tekrar: { ikon: "tekrar", renk: "var(--c5)" },
  oyun: { ikon: "oyun", renk: "var(--c2)" },
  video: { ikon: "video", renk: "var(--c2)" },
};

/** Görevin yapılacağı sayfa; konu görevleri konuHref'e gider. */
const gorevYeri = (id: GorevId, konuHref: string) =>
  id === "oyun" ? "/oyunlar/" : id === "video" ? "/videolar/" : id === "tekrar" ? "/tekrar/" : konuHref;

export default function Bugun({ konuHref }: { konuHref: string }) {
  const p = usePuan(), gk = useGorev(), oyun = useOyunAcik();
  const gunler = p.gunler ?? {};
  const bugun = gunler[gun()] ?? {};
  const n = seri(p), bugunAktif = aktif(bugun), tehlikede = n > 0 && !bugunAktif;
  const gorevler = gk.g === gun() ? gk.l ?? [] : [];
  const biten = gorevler.filter((g) => gk.tamam?.includes(g.id)).length;
  const Seri = Icon.seri, Check = Icon.check, Yildiz = Icon.yildiz, Kupa = Icon.kupa;
  const hafta = Array.from({ length: 7 }, (_, k) => {
    const g = gun(k - 6), d = new Date(Date.parse(g + "T12:00:00"));
    return { g, ad: GUN_ADI[d.getDay()], on: aktif(gunler[g]), bugun: k === 6 };
  });

  const tamamOran = gorevler.length ? biten / gorevler.length : 0;
  const rozet = "flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 font-display text-[15px] font-extrabold tabular-nums transition-colors active:bg-secondary";

  return (
    <div className="ml-auto flex items-center gap-2" aria-label={cev("Bugün")}>
      {oyun && <>
      <Link href="/lig/" className={cn(rozet, "px-2 text-[var(--c5)] [&_svg]:size-5 [&_svg]:fill-[color-mix(in_srgb,var(--c5)_25%,var(--surface))]")} aria-label={cev("Haftalık lig")}>
        <Kupa />
      </Link>
      <Sheet>
        <SheetTrigger className={cn(rozet, n > 0 ? "text-foreground" : "text-muted-foreground")} aria-label={cev("Seri: {0} gün", n)}>
          <motion.span
            className={cn("grid [&_svg]:size-5", n > 0 ? "text-[#f07800] [&_svg]:fill-[#ffb020]" : "text-muted-foreground")}
            animate={tehlikede ? { scale: [1, 1.15, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Seri />
          </motion.span>
          {n}
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="sr-only">{cev("Serin")}</SheetTitle>
          <SheetDescription className="sr-only">{cev("Seri, puan ve son 7 gün")}</SheetDescription>
      <div className="grid gap-3.5 rounded-lg border border-border bg-secondary p-4">
        <div className="flex items-center gap-3.5">
          <motion.span
            className={cn("grid size-14 flex-none place-items-center rounded-2xl [&_svg]:size-9", n > 0 ? "bg-card text-[#f07800] [&_svg]:fill-[#ffb020]" : "bg-card text-muted-foreground")}
            animate={bugunAktif ? { scale: [1, 1.08, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Seri />
          </motion.span>
          <span className="grid min-w-0 leading-tight">
            <b className="font-display text-[30px] font-extrabold tabular-nums">{n} {cev("gün")}</b>
            <span className="text-[14px] font-semibold text-muted-foreground">
              {n === 0 ? cev("Bugün bir şey öğren, serin başlasın") : tehlikede ? cev("Bugün bir şey öğren, serin bitmesin") : cev("Serin devam ediyor")}
            </span>
          </span>
          <span className="ml-auto flex flex-none items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-[15px] font-extrabold tabular-nums [&_svg]:size-4 [&_svg]:fill-[var(--glow)] [&_svg]:stroke-[var(--glow-deep)]" aria-label={cev("{0} puan", p.toplam ?? 0)}>
            <Yildiz />{p.toplam ?? 0}
          </span>
        </div>
        <ol className="grid grid-cols-7 gap-1.5" aria-label={cev("Son 7 gün")}>
          {hafta.map((h) => (
            <li key={h.g} className="grid justify-items-center gap-1">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full [&_svg]:size-4 [&_svg]:stroke-[3]",
                  h.on ? "bg-[#f07800] text-white" : "bg-card",
                  h.bugun && !h.on && "border-2 border-dashed border-[#f0a060]",
                )}
                aria-label={`${h.ad}: ${h.on ? cev("çalıştın") : cev("çalışmadın")}`}
              >
                {h.on && <Check />}
              </span>
              <span className={cn("text-[11px] font-bold", h.bugun ? "text-foreground" : "text-muted-foreground")}>{h.ad}</span>
            </li>
          ))}
        </ol>
      </div>
        </SheetContent>
      </Sheet>
      </>}

      <Sheet>
        <SheetTrigger className={rozet} aria-label={cev("Günün görevleri: {0}/{1}", biten, gorevler.length || 3)}>
          <Halka oran={tamamOran} className="size-5" />
          {biten}/{gorevler.length || 3}
          <span className="font-sans text-[13px] font-semibold text-muted-foreground">{cev("görev")}</span>
        </SheetTrigger>
        <SheetContent>
          <SheetDescription className="sr-only">{cev("Bugün yapılacak üç görev")}</SheetDescription>
      <div className="grid gap-3 py-1">
        <span className="flex items-center gap-3">
          <Halka oran={tamamOran} />
          <SheetTitle className="flex-1 text-[16px]">{cev("Bugünün görevleri")}</SheetTitle>
          <b className="font-display text-[16px] font-extrabold tabular-nums text-muted-foreground">{biten}/{gorevler.length || 3}</b>
        </span>
        <ul className="grid gap-3">
          {gorevler.map((g) => {
            const sayi = Math.min(bugun[g.id] ?? 0, g.hedef), tamam = gk.tamam?.includes(g.id);
            const { ikon, renk } = GOREV_GORUNUM[g.id], I = Icon[ikon];
            return (
              <li key={g.id}>
                <Link href={gorevYeri(g.id, konuHref)} className="-mx-1.5 flex items-center gap-3 rounded-xl px-1.5 py-0.5 transition-colors active:bg-secondary">
                <span
                  className="grid size-10 flex-none place-items-center rounded-xl [&_svg]:size-5"
                  style={{ background: tamam ? "var(--good)" : `color-mix(in srgb, ${renk} 14%, var(--surface))`, color: tamam ? "white" : renk }}
                >
                  {tamam ? <Check /> : <I />}
                </span>
                <span className="grid min-w-0 flex-1 gap-1.5">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={cn("truncate text-[15px] font-semibold", tamam && "text-muted-foreground")}>{gorevAdi(g)}</span>
                    <span className={cn("flex-none text-[12px] font-bold tabular-nums", tamam ? "text-good" : "text-muted-foreground")}>
                      {tamam ? `+${PUAN.gorev}` : `${sayi}/${g.hedef}`}
                    </span>
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: tamam ? "var(--good)" : renk }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(100 * sayi) / g.hedef}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </span>
                </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {gorevler.length > 0 && biten === gorevler.length && (
          <p className="text-[13px] font-semibold text-good">{cev("Bugünün görevleri tamam, +")}{PUAN.hepsi} {cev("bonus kazandın.")}</p>
        )}
      </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Görev ilerleme halkası. */
function Halka({ oran, className }: { oran: number; className?: string }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" className={cn("size-8 flex-none -rotate-90", className)} aria-hidden="true">
      <circle cx="22" cy="22" r={r} fill="var(--surface)" stroke="var(--line-2)" strokeWidth="6" />
      <motion.circle
        cx="22" cy="22" r={r} fill="none" stroke="var(--fizik)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - oran) }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
