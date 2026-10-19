"use client";
// Ana sayfadaki "Bugün" kartı: seri, puan ve günün üç görevi.
import { aktif, gorevAdi, PUAN, seri, useGorev, usePuan } from "@/lib/puan";
import { gun } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Card } from "./ui/card";

export default function Bugun() {
  const p = usePuan(), gk = useGorev();
  const bugun = p.gunler?.[gun()] ?? {};
  const n = seri(p), tehlikede = n > 0 && !aktif(bugun);
  const gorevler = gk.g === gun() ? gk.l ?? [] : [];
  const Seri = Icon.seri, Check = Icon.check;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="flex items-center gap-2.5 px-4 py-3.5">
          <span className={cn("grid size-9 flex-none place-items-center rounded-full [&_svg]:size-5", n > 0 && !tehlikede ? "bg-[var(--glow-soft)] text-[#e07a00]" : "bg-secondary text-muted-foreground")}>
            <Seri />
          </span>
          <span className="grid leading-tight">
            <b className="font-display text-[20px] font-extrabold tabular-nums">{n} gün</b>
            <span className="text-[12px] font-semibold text-muted-foreground">seri</span>
          </span>
        </div>
        <div className="grid px-4 py-3.5 leading-tight">
          <b className="font-display text-[20px] font-extrabold tabular-nums">{p.toplam ?? 0}</b>
          <span className="text-[12px] font-semibold text-muted-foreground">puan{bugun.p ? ` · bugün +${bugun.p}` : ""}</span>
        </div>
      </div>
      <div className="grid gap-3 px-4 py-3.5">
        <b className="text-[15px]">Bugünün görevleri</b>
        <ul className="grid gap-2.5">
          {gorevler.map((g) => {
            const sayi = Math.min(bugun[g.id] ?? 0, g.hedef), tamam = gk.tamam?.includes(g.id);
            return (
              <li key={g.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-6 flex-none place-items-center rounded-full border-[1.5px] [&_svg]:size-3.5",
                    tamam ? "border-good bg-good text-white" : "border-border-strong",
                  )}
                >
                  {tamam && <Check />}
                </span>
                <span className={cn("flex-1 text-[15px]", tamam && "text-muted-foreground line-through decoration-1")}>{gorevAdi(g)}</span>
                <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">{tamam ? `+${PUAN.gorev}` : `${sayi}/${g.hedef}`}</span>
              </li>
            );
          })}
        </ul>
        {tehlikede && <p className="text-[13px] font-medium text-muted-foreground">Serin {n} gün oldu. Bugün bir kart okursan devam eder.</p>}
      </div>
    </Card>
  );
}
