"use client";
// Ünite testi: ünitedeki konuların testlerinden karışık en çok UNITE_SORU soru. En az GECME puan alan öğrenci
// üniteyi geçer: ünitenin bütün konuları ve sıradaki ünitenin ilk konusu açılır (lib/kilit.ts).
import { cev } from "@/lib/dil";
import Link from "next/link";
import { useCallback } from "react";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { GECME, UNITE_SORU, uniteAcik, uniteAnahtar, uniteler } from "@/lib/kilit";
import { uniteKaydet, useDurumlar, useTarayici } from "@/lib/store";
import { Alt } from "./Soru";
import { href } from "./temel";
import { Button } from "./ui/button";
import { Konfeti, Madalya, SesCal } from "./Kutlama";
import Puanla from "./Puanla";
import KarisikTest, { karistir, konuGruplari, sirayla } from "./KarisikTest";

export default function UniteTesti({ ders, no, list, sorular }: { ders: DersId; no: number; list: Entry[]; sorular: Record<string, TekrarSoru> }) {
  const d = useDurumlar(), tarayici = useTarayici();
  const uler = uniteler(list), u = uler.find((x) => x.no === no)!, sonraki = uler.find((x) => x.no === no + 1);
  // Her konudan sırayla birer soru (konular eşit temsil edilsin).
  const sec = useCallback(() => karistir(sirayla(konuGruplari(sorular), UNITE_SORU)), [sorular]);

  return (
    <KarisikTest
      ders={ders}
      baslik={cev("{0}. ünite testi", no)}
      cikis={cev("Ünite testinden çık")}
      sorular={sorular}
      sec={sec}
      bitti={(puan) => uniteKaydet(uniteAnahtar(ders, u.kod), puan)}
      giris={(basla) => {
        const ac = !tarayici || uniteAcik(list, u, d), eski = d.unite[uniteAnahtar(ders, u.kod)];
        return {
          body: (
            <article className="flex flex-col gap-3 pt-4">
              <span className="text-[13px] font-bold text-acc">{DERSLER[ders].ad} · {cev("{0}. ünite", no)}</span>
              <h1 className="text-[26px]">{u.ad}{cev(": ünite testi")}</h1>
              <p className="text-[15px] text-muted-foreground">
                {cev("Bu ünitedeki")} {u.konular.length} {cev("konudan karışık")} {Math.min(UNITE_SORU, Object.keys(sorular).length)} {cev("soru. En az")} {GECME} {cev("puan alırsan ünitenin bütün konuları açılır")}{sonraki ? cev(" ve sıradaki üniteye geçersin") : ""}.
              </p>
              <ul className="grid gap-1 text-[14px] text-muted-foreground">
                {u.konular.map((e) => <li key={e.id}>· {e.title}</li>)}
              </ul>
              {eski !== undefined && <p className="text-[14px] font-semibold">{cev("En iyi puanın:")} {eski}</p>}
              {!ac && <p className="rounded-xl bg-secondary p-3 text-[15px]">{cev("Bu testi çözmek için önce önceki üniteleri bitir ya da onların testlerini geç.")}</p>}
            </article>
          ),
          controls: (
            <Alt>
              {ac ? <Button className="w-full" data-next onClick={basla}>{cev("Teste başla")}</Button>
                : <Button asChild className="w-full"><Link href={href(ders)}>{cev("{0} konularına dön", DERSLER[ders].ad)}</Link></Button>}
            </Alt>
          ),
        };
      }}
      sonuc={({ puan, right, n, basla }) => {
        const gecti = puan >= GECME;
        return (
          <article className="flex flex-col items-center gap-2 pt-4 text-center">
            {gecti && <Konfeti />}
            {gecti && <SesCal tur="seviye" />}
            {gecti && <Madalya kupa />}
            {gecti && <Puanla />}
            <div className="font-display text-[56px] leading-none font-extrabold text-acc">{puan}</div>
            <span className="text-[14px] font-semibold text-muted-foreground">{cev("{0} sorudan {1} doğru", n, right)}</span>
            <h2 className="mt-1 text-[22px]">{gecti ? cev("Üniteyi geçtin!") : cev("Geçmek için en az {0} gerekiyor.", GECME)}</h2>
            <p className="text-[15px] text-muted-foreground">
              {gecti
                ? cev("{0} ünitesinin bütün konuları açıldı{1}.", u.ad, sonraki ? cev("; sıradaki ünite: {0}", sonraki.ad) : "")
                : cev("Konuları sırayla çalışarak devam edebilir ya da testi yeniden çözebilirsin. Yanlışların tekrar sırana eklendi.")}
            </p>
            <div className="relative z-30 mt-4 grid w-full gap-2">
              {gecti && sonraki ? (
                <Button asChild><Link href={href(ders, sonraki.konular[0].id)}>{cev("Sıradaki ünite:")} {sonraki.konular[0].title}</Link></Button>
              ) : !gecti ? (
                <Button onClick={basla}>{cev("Testi yeniden çöz")}</Button>
              ) : null}
              <Button asChild variant={gecti && !sonraki ? "default" : "ghost"}><Link href={href(ders)}>{cev("{0} konularına dön", DERSLER[ders].ad)}</Link></Button>
            </div>
          </article>
        );
      }}
    />
  );
}
