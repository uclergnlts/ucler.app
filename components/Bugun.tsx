"use client";
// Ana sayfadaki "Bugün" bölümü: seri (alev ve son 7 gün), puan, görev halkası ve günün üç görevi.
import { motion } from "motion/react";
import { aktif, gorevAdi, PUAN, seri, useGorev, usePuan, type GorevId } from "@/lib/puan";
import { gun } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

const GUN_ADI = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

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

export default function Bugun() {
  const p = usePuan(), gk = useGorev();
  const gunler = p.gunler ?? {};
  const bugun = gunler[gun()] ?? {};
  const n = seri(p), bugunAktif = aktif(bugun), tehlikede = n > 0 && !bugunAktif;
  const gorevler = gk.g === gun() ? gk.l ?? [] : [];
  const biten = gorevler.filter((g) => gk.tamam?.includes(g.id)).length;
  const Seri = Icon.seri, Check = Icon.check, Yildiz = Icon.yildiz;
  const hafta = Array.from({ length: 7 }, (_, k) => {
    const g = gun(k - 6), d = new Date(Date.parse(g + "T12:00:00"));
    return { g, ad: GUN_ADI[d.getDay()], on: aktif(gunler[g]), bugun: k === 6 };
  });

  return (
    <section className="grid gap-3" aria-label="Bugün">
      {/* Seri */}
      <div className="grid gap-3.5 rounded-3xl bg-[linear-gradient(135deg,#fff3d1,#ffe6d6)] p-4">
        <div className="flex items-center gap-3.5">
          <motion.span
            className={cn("grid size-14 flex-none place-items-center rounded-2xl [&_svg]:size-9", n > 0 ? "bg-white text-[#f07800] [&_svg]:fill-[#ffb020]" : "bg-white/70 text-[#c9a27a]")}
            animate={bugunAktif ? { scale: [1, 1.08, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Seri />
          </motion.span>
          <span className="grid min-w-0 leading-tight">
            <b className="font-display text-[30px] font-extrabold tabular-nums text-[#8a4300]">{n} gün</b>
            <span className="text-[14px] font-semibold text-[#a0602a]">
              {n === 0 ? "Bugün bir kart oku, serin başlasın" : tehlikede ? "Bugün bir kart oku, serin bitmesin" : "Serin devam ediyor"}
            </span>
          </span>
        </div>
        <ol className="grid grid-cols-7 gap-1.5" aria-label="Son 7 gün">
          {hafta.map((h) => (
            <li key={h.g} className="grid justify-items-center gap-1">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full [&_svg]:size-4 [&_svg]:stroke-[3]",
                  h.on ? "bg-[#f07800] text-white" : "bg-white/70",
                  h.bugun && !h.on && "border-2 border-dashed border-[#f0a060]",
                )}
                aria-label={`${h.ad}: ${h.on ? "çalıştın" : "çalışmadın"}`}
              >
                {h.on && <Check />}
              </span>
              <span className={cn("text-[11px] font-bold", h.bugun ? "text-[#8a4300]" : "text-[#b07a50]")}>{h.ad}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Puan ve görev halkası */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-3xl bg-[var(--glow-soft)] p-4">
          <span className="grid size-11 flex-none place-items-center rounded-2xl bg-white [&_svg]:size-6 [&_svg]:fill-[var(--glow)] [&_svg]:stroke-[var(--glow-deep)]"><Yildiz /></span>
          <span className="grid min-w-0 leading-tight">
            <b className="font-display text-[22px] font-extrabold tabular-nums">{p.toplam ?? 0}</b>
            <span className="text-[12px] font-semibold text-muted-foreground">{bugun.p ? `puan · bugün +${bugun.p}` : "puan"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-3xl bg-[var(--fizik-soft)] p-4">
          <Halka oran={gorevler.length ? biten / gorevler.length : 0} />
          <span className="grid min-w-0 leading-tight">
            <b className="font-display text-[22px] font-extrabold tabular-nums">{biten}/{gorevler.length || 3}</b>
            <span className="text-[12px] font-semibold text-muted-foreground">görev</span>
          </span>
        </div>
      </div>

      {/* Görevler */}
      <div className="grid gap-3 rounded-3xl border border-border bg-card p-4">
        <b className="font-display text-[16px] font-extrabold">Bugünün görevleri</b>
        <ul className="grid gap-3">
          {gorevler.map((g) => {
            const sayi = Math.min(bugun[g.id] ?? 0, g.hedef), tamam = gk.tamam?.includes(g.id);
            const { ikon, renk } = GOREV_GORUNUM[g.id], I = Icon[ikon];
            return (
              <li key={g.id} className="flex items-center gap-3">
                <span
                  className="grid size-10 flex-none place-items-center rounded-xl [&_svg]:size-5"
                  style={{ background: tamam ? "var(--good)" : `color-mix(in srgb, ${renk} 14%, white)`, color: tamam ? "white" : renk }}
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
              </li>
            );
          })}
        </ul>
        {gorevler.length > 0 && biten === gorevler.length && (
          <p className="text-[13px] font-semibold text-good">Bugünün görevleri tamam, +{PUAN.hepsi} bonus kazandın.</p>
        )}
      </div>
    </section>
  );
}

/** Görev ilerleme halkası. */
function Halka({ oran }: { oran: number }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" className="size-11 flex-none -rotate-90" aria-hidden="true">
      <circle cx="22" cy="22" r={r} fill="white" stroke="#cfe0fb" strokeWidth="6" />
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
