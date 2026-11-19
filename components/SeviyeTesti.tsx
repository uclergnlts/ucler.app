"use client";
// Seviye testi: kilitli bir konuya doğrudan geçmek isteyen öğrenci, dersin o konudan önceki bütün konularından karışık
// en çok SEVIYE_SORU soru çözer. En az GECME alırsa o konu ve öncesindeki bütün konular açılır (lib/kilit.ts);
// alamazsa yanlış yaptığı ilk konu "buradan başla" diye gösterilir.
import { cev } from "@/lib/dil";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { acik, GECME, SEVIYE_SORU, seviyeHref, seviyeKonulari, siradaki, uniteler } from "@/lib/kilit";
import { seviyeKaydet, useDurumlar, useTarayici } from "@/lib/store";
import { Alt } from "./Soru";
import { href } from "./temel";
import { Button } from "./ui/button";
import { Konfeti, Madalya, SesCal } from "./Kutlama";
import KarisikTest, { karistir, konuGruplari, sirayla } from "./KarisikTest";

/** Konular dersin başından bu konuya kadar eşit temsil edilsin: konu sırası SEVIYE_SORU dilime bölünür,
 *  her dilimden rastgele bir konunun bir sorusu alınır. Konu sayısı azsa her konudan sırayla soru alınır. */
function sec(sorular: Record<string, TekrarSoru>) {
  const g = konuGruplari(sorular), n = g.length;
  if (n <= SEVIYE_SORU) return karistir(sirayla(g, SEVIYE_SORU));
  const out: string[] = [];
  for (let j = 0; j < SEVIYE_SORU; j++) {
    const bas = Math.floor((j * n) / SEVIYE_SORU), son = Math.floor(((j + 1) * n) / SEVIYE_SORU);
    out.push(g[bas + Math.floor(Math.random() * (son - bas))][0]);
  }
  return karistir(out);
}

/** Konu adresten gelir (/seviye/ders/?konu=...): her ders için tek sayfa, soruları bütün konular paylaşır. */
export default function SeviyeTesti({ ders, list, sorular: hepsi }: { ders: DersId; list: Entry[]; sorular: Record<string, TekrarSoru> }) {
  const id = useSearchParams().get("konu") ?? "";
  const onceki = useMemo(() => seviyeKonulari(list, id), [list, id]);
  if (!onceki.length) return <Yok ders={ders} />;
  return <Test key={id} ders={ders} id={id} list={list} onceki={onceki} hepsi={hepsi} />;
}

function Yok({ ders }: { ders: DersId }) {
  return (
    <div className="app" data-ders={ders}>
      <main className="view items-center pt-10 text-center">
        <h1 className="text-[22px]">{cev("Bu konu için seviye testi yok")}</h1>
        <p className="text-[15px] text-muted-foreground">{cev("Dersin ilk konusu her zaman açıktır.")}</p>
        <Button asChild className="mt-3"><Link href={href(ders)}>{cev("{0} konularına dön", DERSLER[ders].ad)}</Link></Button>
      </main>
    </div>
  );
}

function Test({ ders, id, list, onceki, hepsi }: { ders: DersId; id: string; list: Entry[]; onceki: Entry[]; hepsi: Record<string, TekrarSoru> }) {
  const d = useDurumlar(), tarayici = useTarayici();
  const bu = list.find((e) => e.id === id)!;
  const sorular = useMemo(() => {
    const ids = new Set(onceki.map((e) => e.id));
    return Object.fromEntries(Object.entries(hepsi).filter(([, q]) => ids.has(q.konu)));
  }, [hepsi, onceki]);
  const ilkU = onceki[0]?.unite ?? bu.unite, sonU = onceki[onceki.length - 1]?.unite ?? bu.unite;
  const ulerAd = uniteler(list).filter((u) => u.no >= ilkU && u.no <= sonU);
  const secim = useCallback(() => sec(sorular), [sorular]);

  return (
    <KarisikTest
      ders={ders}
      baslik={cev("Seviye testi")}
      cikis={cev("Seviye testinden çık")}
      sorular={sorular}
      sec={secim}
      bitti={(puan) => seviyeKaydet(`${ders}.${id}`, puan)}
      giris={(basla) => {
        const zaten = tarayici && acik(list, id, d), eski = d.seviye[`${ders}.${id}`];
        return {
          body: (
            <article className="flex flex-col gap-3 pt-4">
              <span className="text-[13px] font-bold text-acc">{DERSLER[ders].ad} · {cev("{0}. ünite · {1}. konu", bu.unite, bu.no)}</span>
              <h1 className="text-[26px]">{bu.title}{cev(": seviye testi")}</h1>
              <p className="text-[15px] text-muted-foreground">
                {cev("Bu konudan önceki")} {onceki.length} {cev("konudan karışık")} {Math.min(SEVIYE_SORU, Object.keys(sorular).length)} {cev("soru. En az")} {GECME} {cev("puan alırsan bu konu ve öncesindeki bütün konular açılır; doğrudan buradan devam edersin.")}
              </p>
              <ul className="grid gap-1 text-[14px] text-muted-foreground">
                {ulerAd.map((u) => <li key={u.no}>· {cev("{0}. ünite:", u.no)} {u.ad}</li>)}
              </ul>
              {eski !== undefined && <p className="text-[14px] font-semibold">{cev("En iyi puanın:")} {eski}</p>}
              {zaten && <p className="rounded-xl bg-secondary p-3 text-[15px]">{cev("Bu konu zaten açık. İstersen testi yine de çözebilirsin.")}</p>}
            </article>
          ),
          controls: (
            <Alt>
              <Button className="w-full" data-next onClick={basla}>{cev("Teste başla")}</Button>
            </Alt>
          ),
        };
      }}
      sonuc={({ puan, right, n, dogru, basla }) => {
        const gecti = puan >= GECME;
        // Yanlış yapılan ilk konu (ders sırasıyla): öğrenci oradan başlamalı.
        const yanlis = new Set(Object.keys(dogru).filter((k) => !dogru[k]).map((k) => sorular[k].konu));
        const bas = onceki.find((e) => yanlis.has(e.id!));
        const basAcik = bas && acik(list, bas.id!, d), sira = siradaki(list, d);
        return (
          <article className="flex flex-col items-center gap-2 pt-4 text-center">
            {gecti && <Konfeti />}
            {gecti && <SesCal tur="seviye" />}
            {gecti && <Madalya kupa />}
            <div className="font-display text-[56px] leading-none font-extrabold text-acc">{puan}</div>
            <span className="text-[14px] font-semibold text-muted-foreground">{cev("{0} sorudan {1} doğru", n, right)}</span>
            <h2 className="mt-1 text-[22px]">{gecti ? cev("Seviye testini geçtin!") : cev("Geçmek için en az {0} gerekiyor.", GECME)}</h2>
            <p className="text-[15px] text-muted-foreground">
              {gecti
                ? cev("“{0}” ve öncesindeki bütün konular açıldı.", bu.title)
                : bas
                  ? <>{cev("Önce")} <b className="text-foreground">“{bas.title}”</b> {cev("konusundan başlaman iyi olur; ilk yanlışın oradaydı. Yanlışların tekrar sırana eklendi.")}</>
                  : cev("Yanlışların tekrar sırana eklendi.")}
            </p>
            <div className="relative z-30 mt-4 grid w-full gap-2">
              {gecti ? (
                <Button asChild><Link href={href(ders, id)}>{cev("Konuya başla:")} {bu.title}</Link></Button>
              ) : bas ? (
                basAcik
                  ? <Button asChild><Link href={href(ders, bas.id)}>{cev("Buradan başla:")} {bas.title}</Link></Button>
                  : <Button asChild><Link href={seviyeHref(ders, bas.id!)}>“{bas.title}{cev("” seviye testini çöz")}</Link></Button>
              ) : sira ? (
                <Button asChild><Link href={href(ders, sira.id)}>{cev("Sıradaki konuya git:")} {sira.title}</Link></Button>
              ) : null}
              {!gecti && <Button variant="outline" onClick={basla}>{cev("Testi yeniden çöz")}</Button>}
              <Button asChild variant="ghost"><Link href={href(ders)}>{cev("{0} konularına dön", DERSLER[ders].ad)}</Link></Button>
            </div>
          </article>
        );
      }}
    />
  );
}
