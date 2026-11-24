"use client";
import { cev } from "@/lib/dil";
import Link from "next/link";
import type { DersId, Entry } from "@/lib/dersler";
import { toggleAnlamadim } from "@/lib/store";
import { Icon } from "../icons";
import { Bos, href, Html, Liste, Simge, UstEylem } from "../temel";
import Kabuk from "./Kabuk";
import { useAnlamadiklarim } from "./veri";

export default function Anlamadiklarim({ all, basliklar }: { all: Record<DersId, Entry[]>; basliklar: Record<string, string[]> }) {
  const list = useAnlamadiklarim(all, basliklar);
  const Soru = Icon.soru, Kapat = Icon.kapat;
  return (
    <Kabuk title={cev("Anlamadıklarım")} sag={<UstEylem href="/tekrar/" label={cev("Tekrar et")} icon={<Icon.tekrar />} />} text={list.length ? cev("İşaretlediğin kartlar. Karta dokunup yeniden bakabilirsin.") : undefined}>
      {list.length ? (
        <Liste>
          {list.map(({ k, e, no, h }) => (
            <div key={k} className="flex items-center" data-ders={e.ders}>
              <Link href={`${href(e.ders, e.id)}?kart=${no}`} className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 transition-colors active:bg-secondary">
                <Simge><Soru /></Simge>
                <span className="min-w-0 flex-1">
                  <Html as="span" className="block leading-snug font-semibold" html={h} />
                  <span className="block truncate text-[13px] text-muted-foreground">{e.title} · {cev("{0}. kart", no)}</span>
                </span>
              </Link>
              <button className="grid size-11 flex-none place-items-center text-muted-foreground [&_svg]:size-4" aria-label={cev("İşareti kaldır")} onClick={() => toggleAnlamadim(k)}>
                <Kapat />
              </button>
            </div>
          ))}
        </Liste>
      ) : (
        <Bos>{cev("Bir kartı anlamadıysan ders ekranında üstteki \"Hata bildir\" düğmesine dokunup \"Anlamadım\"ı seç. Kart buraya gelir, sonra dönüp yeniden bakabilirsin.")}</Bos>
      )}
    </Kabuk>
  );
}
