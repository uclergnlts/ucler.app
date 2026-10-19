"use client";
// Konu haritası: konular ders sırasıyla alt alta, solda ön koşul bağlantılarını gösteren şeritler (metro haritası gibi).
// Biten konu dolu nokta, açık konu çerçeveli nokta, ön koşulu bitmemiş konu gri nokta olarak görünür (ayrıntısı dokununca açılır).
// Sıra yalnızca öneridir: gri konu da açılır ("kilit" sözcüğü kullanılmaz).
// Konuya dokununca alttan ayrıntı açılır: ön koşullar, bitince açılan konular, başla düğmesi.
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { SINAV_AD, type DersId, type Entry } from "@/lib/dersler";
import { actiklari, durumlar, siradaki, yerlesim, type Durum } from "@/lib/harita";
import { useProg } from "@/lib/store";
import { cn } from "@/lib/utils";
import { href } from "./temel";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";

const RH = 80; // satır yüksekliği (px): uzun konu adı iki satıra sığar
const SW = 14; // şerit aralığı (px)
const NY = 24; // noktanın satır içindeki yüksekliği (başlığın ilk satırı hizası)

export default function Harita({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg();
  const { dugumler, kenarlar, serit } = useMemo(() => yerlesim(list), [list]);
  const d = durumlar(ders, list, prog);
  const sira = siradaki(list, d);
  const [secili, setSecili] = useState<Entry | null>(null);
  const acan = useRef<HTMLButtonElement | null>(null);
  const yer = Object.fromEntries(dugumler.map((n) => [n.e.id!, n]));
  const G = serit * SW + 10; // şerit alanının genişliği
  const px = (s: number) => 10 + s * SW, py = (r: number) => r * RH + NY;
  const H = dugumler.length * RH;

  return (
    <div className="relative" style={{ height: H }}>
      <svg className="absolute top-0 left-0" width={G} height={H} aria-hidden="true">
        {kenarlar.map(({ from, to }) => {
          const a = yer[from], b = yer[to];
          const x1 = px(a.serit), y1 = py(a.satir), x2 = px(b.serit), y2 = py(b.satir);
          // Kaynağın şeridinden aşağı iner, hedefin bir önceki satır arasında yana kıvrılır.
          const k = y2 - RH * 0.7;
          const yol = x1 === x2 ? `M${x1} ${y1}V${y2}` : `M${x1} ${y1}V${k}C${x1} ${k + RH * 0.4} ${x2} ${y2 - RH * 0.3} ${x2} ${y2}`;
          const acik = d[to] !== "kilitli";
          return <path key={`${from}-${to}`} d={yol} fill="none" strokeWidth={2.5} strokeLinecap="round" className={acik ? "stroke-acc/50" : "stroke-border-strong"} />;
        })}
        {dugumler.map(({ e, serit: s, satir: r }) => {
          const durum = d[e.id!], x = px(s), y = py(r);
          if (e.id === sira)
            return (
              <g key={e.id}>
                <circle cx={x} cy={y} r={10} className="animate-pulse fill-acc/20" />
                <circle cx={x} cy={y} r={6.5} strokeWidth={3} className="fill-card stroke-acc" />
              </g>
            );
          return durum === "bitti" ? <circle key={e.id} cx={x} cy={y} r={7} className="fill-acc" />
            : durum === "acik" ? <circle key={e.id} cx={x} cy={y} r={6} strokeWidth={2.5} className="fill-card stroke-acc" />
            : <circle key={e.id} cx={x} cy={y} r={5} className="fill-border-strong" />;
        })}
      </svg>
      {dugumler.map(({ e, satir: r }, k) => {
        const durum = d[e.id!], burada = e.id === sira, sonuc = prog[`${ders}.${e.id}`];
        return (
          <motion.button
            key={e.id}
            onClick={(ev) => { acan.current = ev.currentTarget; setSecili(e); }}
            className={cn(
              "absolute right-0 flex flex-col justify-start rounded-xl py-1.5 pr-2 pl-2 text-left transition-colors active:bg-secondary",
              burada && "bg-acc-soft",
            )}
            style={{ top: r * RH + 4, left: G + 4, height: RH - 8 }}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(k, 14) * 0.015 }}
            aria-label={`${e.no}. ${e.title}, ${DURUM_AD[durum]}${burada ? ", sıradaki konu" : ""}`}
          >
            <span className={cn("line-clamp-2 text-[15px] leading-snug font-semibold", durum === "kilitli" && "text-muted-foreground")}>
              <span className="mr-1 tabular-nums text-muted-foreground">{e.no}.</span>{e.ad}
            </span>
            <span className="line-clamp-1 text-[12.5px] font-medium text-muted-foreground">
              {e.sinav && SINAV_AD[e.sinav]}
              {(burada || durum === "bitti") && (
                <span className="text-acc">{e.sinav && " · "}{burada ? "Sıradaki konu" : `Bitti · ${sonuc}`}</span>
              )}
            </span>
          </motion.button>
        );
      })}
      <Sheet open={!!secili} onOpenChange={(o) => { if (!o) setSecili(null); }}>
        <SheetContent
          data-ders={ders}
          // Kapanınca odak, ayrıntıyı açan konu düğmesine döner (klavyeyle gezen yerini kaybetmesin).
          onCloseAutoFocus={(ev) => { ev.preventDefault(); acan.current?.focus(); }}
        >{secili && <Ayrinti ders={ders} e={secili} list={list} d={d} prog={prog} />}</SheetContent>
      </Sheet>
    </div>
  );
}

const DURUM_AD: Record<Durum, string> = { bitti: "bitti", acik: "açık", kilitli: "önerilen sırada ileride" };

function Ayrinti({ ders, e, list, d, prog }: { ders: DersId; e: Entry; list: Entry[]; d: Record<string, Durum>; prog: Record<string, string> }) {
  const ad = (id: string) => list.find((x) => x.id === id);
  const eksik = (e.on ?? []).filter((o) => d[o] !== "bitti");
  const acar = actiklari(list, e.id!);
  const durum = d[e.id!], sonuc = prog[`${ders}.${e.id}`];
  return (
    <div className="grid gap-3">
      <span className="text-[13px] font-bold text-acc">
        {e.no}. konu{e.sinav && ` · ${SINAV_AD[e.sinav]}`}{durum === "bitti" && ` · Bitti · ${sonuc}`}
      </span>
      <SheetTitle className="text-[22px]">{e.title}</SheetTitle>
      <SheetDescription className="text-[15px] text-muted-foreground">{e.summary}</SheetDescription>
      {eksik.length > 0 && (
        <div className="grid gap-1.5 rounded-2xl bg-secondary px-4 py-3">
          <b className="text-[14px]">Önerilen: önce bunlar</b>
          {eksik.map((o) => (
            <Link key={o} href={href(ders, o)} className="text-[15px] font-semibold text-acc underline-offset-2 hover:underline">{ad(o)?.title}</Link>
          ))}
          <span className="text-[13px] text-muted-foreground">Bu konu onların üzerine kurulu. Biliyorsan doğrudan başlayabilirsin.</span>
        </div>
      )}
      {acar.length > 0 && (
        <p className="text-[14px] text-muted-foreground">
          <b className="font-semibold text-foreground">Sonra gelenler: </b>
          {acar.map((x) => x.title).join(", ")}
        </p>
      )}
      <Button asChild className="mt-1 w-full" variant={durum === "kilitli" ? "outline" : "default"}>
        <Link href={href(ders, e.id)}>{durum === "bitti" ? "Konuyu tekrar et" : "Başla"}</Link>
      </Button>
    </div>
  );
}
