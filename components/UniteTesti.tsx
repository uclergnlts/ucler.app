"use client";
// Ünite testi: ünitedeki konuların testlerinden karışık en çok UNITE_SORU soru. En az GECME puan alan öğrenci
// üniteyi geçer: ünitenin bütün konuları ve sıradaki ünitenin ilk konusu açılır (lib/kilit.ts).
import Link from "next/link";
import { useCallback } from "react";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { GECME, UNITE_SORU, uniteAcik, uniteler } from "@/lib/kilit";
import { uniteKaydet, useDurumlar, useTarayici } from "@/lib/store";
import { Alt } from "./Soru";
import { href } from "./temel";
import { Button } from "./ui/button";
import { Konfeti, Madalya } from "./Kutlama";
import KarisikTest, { karistir, konuGruplari, sirayla } from "./KarisikTest";

export default function UniteTesti({ ders, no, list, sorular }: { ders: DersId; no: number; list: Entry[]; sorular: Record<string, TekrarSoru> }) {
  const d = useDurumlar(), tarayici = useTarayici();
  const uler = uniteler(list), u = uler.find((x) => x.no === no)!, sonraki = uler.find((x) => x.no === no + 1);
  // Her konudan sırayla birer soru (konular eşit temsil edilsin).
  const sec = useCallback(() => karistir(sirayla(konuGruplari(sorular), UNITE_SORU)), [sorular]);

  return (
    <KarisikTest
      ders={ders}
      baslik={`${no}. ünite testi`}
      cikis="Ünite testinden çık"
      sorular={sorular}
      sec={sec}
      bitti={(puan) => uniteKaydet(`${ders}.${no}`, puan)}
      giris={(basla) => {
        const ac = !tarayici || uniteAcik(list, u, d), eski = d.unite[`${ders}.${no}`];
        return {
          body: (
            <article className="flex flex-col gap-3 pt-4">
              <span className="text-[13px] font-bold text-acc">{DERSLER[ders].ad} · {no}. ünite</span>
              <h1 className="text-[26px]">{u.ad}: ünite testi</h1>
              <p className="text-[15px] text-muted-foreground">
                Bu ünitedeki {u.konular.length} konudan karışık {Math.min(UNITE_SORU, Object.keys(sorular).length)} soru. En az {GECME} puan alırsan
                ünitenin bütün konuları açılır{sonraki ? " ve sıradaki üniteye geçersin" : ""}.
              </p>
              <ul className="grid gap-1 text-[14px] text-muted-foreground">
                {u.konular.map((e) => <li key={e.id}>· {e.title}</li>)}
              </ul>
              {eski !== undefined && <p className="text-[14px] font-semibold">En iyi puanın: {eski}</p>}
              {!ac && <p className="rounded-xl bg-secondary p-3 text-[15px]">Bu testi çözmek için önce önceki üniteleri bitir ya da onların testlerini geç.</p>}
            </article>
          ),
          controls: (
            <Alt>
              {ac ? <Button className="w-full" data-next onClick={basla}>Teste başla</Button>
                : <Button asChild className="w-full"><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>}
            </Alt>
          ),
        };
      }}
      sonuc={({ puan, right, n, basla }) => {
        const gecti = puan >= GECME;
        return (
          <article className="flex flex-col items-center gap-2 pt-4 text-center">
            {gecti && <Konfeti />}
            {gecti && <Madalya kupa />}
            <div className="font-display text-[56px] leading-none font-extrabold text-acc">{puan}</div>
            <span className="text-[14px] font-semibold text-muted-foreground">{n} sorudan {right} doğru</span>
            <h2 className="mt-1 text-[22px]">{gecti ? "Üniteyi geçtin!" : `Geçmek için en az ${GECME} gerekiyor.`}</h2>
            <p className="text-[15px] text-muted-foreground">
              {gecti
                ? `${u.ad} ünitesinin bütün konuları açıldı${sonraki ? `; sıradaki ünite: ${sonraki.ad}` : ""}.`
                : "Konuları sırayla çalışarak devam edebilir ya da testi yeniden çözebilirsin. Yanlışların tekrar sırana eklendi."}
            </p>
            <div className="relative z-30 mt-4 grid w-full gap-2">
              {gecti && sonraki ? (
                <Button asChild><Link href={href(ders, sonraki.konular[0].id)}>Sıradaki ünite: {sonraki.konular[0].title}</Link></Button>
              ) : !gecti ? (
                <Button onClick={basla}>Testi yeniden çöz</Button>
              ) : null}
              <Button asChild variant={gecti && !sonraki ? "default" : "ghost"}><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
            </div>
          </article>
        );
      }}
    />
  );
}
