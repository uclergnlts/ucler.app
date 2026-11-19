"use client";
import { cev } from "@/lib/dil";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { seri, type Gun } from "@/lib/puan";
import { gun, useSaved } from "@/lib/store";
import { Icon } from "../icons";
import { Bolum, Bos, UstEylem } from "../temel";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import Kabuk from "./Kabuk";
import { useProfil } from "./veri";

export default function Istatistikler({ all }: { all: Record<DersId, Entry[]> }) {
  const { puan, prog, done, right, total, yeni } = useProfil();
  const saved = useSaved();
  // Ders başına: bitirilen konu sayısı ve testlerdeki doğru oranı.
  const dersOran = DERS_IDS.map((d) => {
    let r = 0, t = 0, n = 0;
    for (const k of done) {
      if (!k.startsWith(`${d}.`)) continue;
      const m = String(prog[k]).match(/(\d+)\/(\d+)/);
      n++;
      if (m) { r += +m[1]; t += +m[2]; }
    }
    return { d, n, toplam: all[d].filter((e) => e.id).length, oran: t ? Math.round((100 * r) / t) : null };
  });

  if (yeni)
    return (
      <Kabuk title={cev("İstatistikler")} sag={<UstEylem href="/lig/" label={cev("Haftalık lig")} icon={<Icon.kupa />} />}>
        <Bos>{cev("İlk konunu bitirdiğinde puanın, serin ve doğru oranın burada görünür.")}</Bos>
      </Kabuk>
    );
  return (
    <Kabuk title={cev("İstatistikler")} sag={<UstEylem href="/lig/" label={cev("Haftalık lig")} icon={<Icon.kupa />} />}>
      <Card className="grid grid-cols-3 gap-0 py-0 [&>div]:border-border [&>div:nth-child(-n+3)]:border-b [&>div:not(:nth-child(3n+1))]:border-l">
        {([
          [puan.toplam ?? 0, "puan"], [cev("{0} gün", seri(puan)), "seri"], [cev("{0} gün", puan.enUzun ?? 0), cev("en uzun seri")],
          [done.length, cev("konu bitti")], [total ? `%${Math.round((100 * right) / total)}` : "–", cev("doğru cevap")], [saved.length, cev("kaydedilen konu")],
        ] as const).map(([b, l]) => (
          <div key={l} className="px-2 py-3.5 text-center">
            <b className="block font-display text-2xl leading-tight font-extrabold">{b}</b>
            <span className="text-xs font-semibold text-muted-foreground">{l}</span>
          </div>
        ))}
      </Card>
      <HaftalikPuan gunler={puan.gunler ?? {}} />
      <Bolum title={cev("Derslere göre doğru oranı")}>
        <Card className="grid gap-3.5 px-4 py-3.5">
          {dersOran.map(({ d, n, toplam, oran }) => (
            <div key={d} className="grid gap-1.5" data-ders={d}>
              <div className="flex justify-between text-[15px] font-semibold">
                {DERSLER[d].ad}
                <span className="text-[13px] font-medium text-muted-foreground">
                  {oran === null ? cev("Henüz test yok · {0} konu", toplam) : cev("%{0} doğru · {1} / {2} konu", oran, n, toplam)}
                </span>
              </div>
              <Progress value={oran ?? 0} label={oran === null ? cev("{0}: henüz test yok", DERSLER[d].ad) : cev("{0}: yüzde {1} doğru", DERSLER[d].ad, oran)} />
            </div>
          ))}
        </Card>
      </Bolum>
    </Kabuk>
  );
}

const GUN_ADI = [cev("Pz"), cev("Pt"), cev("Sa"), cev("Ça"), cev("Pe"), cev("Cu"), cev("Ct")];

/** Son 7 günün puanı: tek seri sütun grafik; bugünün sütunu koyu, değeri üstünde yazar. */
function HaftalikPuan({ gunler }: { gunler: Record<string, Gun> }) {
  const g = Array.from({ length: 7 }, (_, k) => {
    const t = gun(k - 6);
    return { t, ad: GUN_ADI[new Date(Date.parse(t + "T12:00:00")).getDay()], p: gunler[t]?.p ?? 0, bugun: k === 6 };
  });
  const max = Math.max(20, ...g.map((x) => x.p)), toplam = g.reduce((n, x) => n + x.p, 0);
  return (
    <Bolum title={cev("Son 7 gün")} more={<span className="text-sm font-bold tabular-nums text-muted-foreground">{toplam} {cev("puan")}</span>}>
      <Card className="px-4 pt-4 pb-3">
        <ol className="flex h-36 items-end gap-2" aria-label={cev("Son 7 günün puanı")}>
          {g.map((x) => (
            <li key={x.t} className="group relative grid h-full flex-1 grid-rows-[1fr_auto] justify-items-center gap-1.5" title={`${x.ad}: ${x.p} puan`}>
              <span className="flex w-full flex-col items-center justify-end">
                {(x.bugun || x.p === max) && x.p > 0 && <span className="mb-1 text-[11px] font-bold tabular-nums text-muted-foreground">{x.p}</span>}
                <span
                  className={x.bugun ? "w-full max-w-7 rounded-t-[4px] bg-[var(--c1)]" : "w-full max-w-7 rounded-t-[4px] bg-[#a9c8fb] group-hover:bg-[#7fadf9]"}
                  style={{ height: `${Math.max(x.p ? 4 : 2, (100 * x.p) / max)}%` }}
                />
              </span>
              <span className={x.bugun ? "text-[11px] font-bold" : "text-[11px] font-semibold text-muted-foreground"}>{x.ad}</span>
            </li>
          ))}
        </ol>
      </Card>
    </Bolum>
  );
}
