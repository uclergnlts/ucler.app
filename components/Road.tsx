"use client";
// Bir dersin konuları: konu içindeki aşama yolu gibi kıvrılan tek bir yol. Sıradaki konu öne çıkar ("Başla"),
// sonrakiler sade görünür ama hepsi açılır. Yazılmamış konular "Yakında".
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DERSLER, SINAV_AD, type DersId, type Entry } from "@/lib/dersler";
import { durumlar, siradaki } from "@/lib/harita";
import { useAsama, useProg } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { Icon } from "./icons";
import { Govde, href } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import AsamaYolu from "./AsamaYolu";

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg(), asama = useAsama(), router = useRouter();
  const s = DERSLER[ders];
  const sira = siradaki(list, durumlar(ders, list, prog));
  const ready = list.filter((e) => e.id), done = ready.filter((e) => prog[`${ders}.${e.id}`]).length;
  const Back = Icon.back;
  return (
    <div className="app" data-ders={ders}>
      <header className="top">
        <Button asChild variant="outline" size="icon"><Link href="/" aria-label="Ana sayfa"><Back /></Link></Button>
      </header>
      <Govde>
        <section className="grid gap-1.5">
          <h1 className="text-[28px]">{s.ad}</h1>
          <p className="text-[15px] text-muted-foreground">{s.yol}. Konular birbirinin üzerine kurulu ve sırayla önerilir; istediğine atlayabilirsin.</p>
          <Progress className="mt-2.5" value={ready.length ? (100 * done) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti`} />
          <span className="text-[13px] font-semibold text-muted-foreground">{done} / {ready.length} konu bitti</span>
        </section>
        <AsamaYolu
          ad="Konular"
          kaydir
          balon={done ? "Devam" : "Başla"}
          dugumler={list.map((e) => {
            const res = e.id ? prog[`${ders}.${e.id}`] : undefined;
            const durum = res ? "bitti" : e.id && e.id === sira ? "sirada" : ("kilitli" as const);
            const ilerleme = e.id && !res && asama[`${ders}.${e.id}`] ? `${asama[`${ders}.${e.id}`]}/${asamaSayisi(e.cardCount ?? 0)} aşama` : "";
            const alt = !e.id ? "Yakında" : [e.sinav && SINAV_AD[e.sinav], res, ilerleme].filter(Boolean).join(" · ");
            return {
              baslik: e.title ?? e.ad,
              alt,
              durum,
              // Sıra yalnızca öneri: henüz sırası gelmeyen konu da açılır (yalnız yazılmamış konu kapalı).
              serbest: !!e.id,
              etiket: `${e.no}. ${e.title ?? e.ad}, ${!e.id ? "yakında" : res ? "bitti" : durum === "sirada" ? "sıradaki konu" : "istersen şimdi açabilirsin"}`,
              ac: () => { if (e.id) router.push(href(ders, e.id)); },
            };
          })}
        />
      </Govde>
    </div>
  );
}
