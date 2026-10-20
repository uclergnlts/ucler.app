"use client";
// Ünite testi: ünitedeki konuların testlerinden karışık en çok UNITE_SORU soru. En az GECME puan alan öğrenci
// üniteyi geçer: ünitenin bütün konuları ve sıradaki ünitenin ilk konusu açılır (lib/kilit.ts).
// Yanlış yapılan soru konu testinde olduğu gibi tekrar sırasına girer.
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, secmeli, type DersId, type Entry } from "@/lib/dersler";
import { GECME, UNITE_SORU, uniteAcik, uniteler } from "@/lib/kilit";
import { kaydet, PUAN } from "@/lib/puan";
import { uniteKaydet, useDurumlar, useTarayici, yanlisKaydet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import { Html, href } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Konfeti, Madalya } from "./Kutlama";

function karistir<T>(l: T[]) {
  for (let a = l.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [l[a], l[b]] = [l[b], l[a]]; }
  return l;
}

/** Her konudan sırayla birer soru alarak (konular eşit temsil edilsin) en çok UNITE_SORU soru seçer. */
function sec(sorular: Record<string, TekrarSoru>) {
  const gruplar: Record<string, string[]> = {};
  for (const k of Object.keys(sorular)) (gruplar[sorular[k].konu] ??= []).push(k);
  const kuyruk = Object.values(gruplar).map((g) => karistir([...g]));
  const out: string[] = [];
  while (out.length < UNITE_SORU && kuyruk.some((g) => g.length)) {
    for (const g of kuyruk) if (g.length && out.length < UNITE_SORU) out.push(g.shift()!);
  }
  return karistir(out);
}

export default function UniteTesti({ ders, no, list, sorular }: { ders: DersId; no: number; list: Entry[]; sorular: Record<string, TekrarSoru> }) {
  const d = useDurumlar(), tarayici = useTarayici();
  const uler = uniteler(list), u = uler.find((x) => x.no === no)!, sonraki = uler.find((x) => x.no === no + 1);
  const [liste, setListe] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [cevap, setCevapS] = useState<Cevap>(null);
  const [sonuc, setSonuc] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  const Close = Icon.kapat;

  const basla = useCallback(() => {
    const l = sec(sorular);
    setListe(l); setI(0); setRight(0); setSonuc(null); setCevapS(ilkCevap(sorular[l[0]]));
  }, [sorular]);
  useEffect(() => { window.scrollTo(0, 0); }, [i, liste]);

  const n = liste?.length ?? 0;
  const key = liste && i < n ? liste[i] : undefined;
  const Q = key ? sorular[key] : undefined;
  const puan = n ? Math.round((100 * right) / n) : 0;

  const degerlendir = (c: Cevap) => {
    if (!key || !Q || sonuc !== null) return;
    const ok = dogruMu(Q, c);
    setCevapS(c); setSonuc(ok);
    if (ok) setRight((r) => r + 1);
    if (!ok) yanlisKaydet(key);
    kaydet("soru");
    if (ok) kaydet("dogru", 1, PUAN.dogru);
  };
  const ileri = () => {
    const j = i + 1;
    setSonuc(null); setI(j);
    if (liste && j < n) setCevapS(ilkCevap(sorular[liste[j]]));
    else uniteKaydet(`${ders}.${no}`, Math.round((100 * right) / n));
  };

  let body: React.ReactNode = null, controls: React.ReactNode = null;
  if (!liste) {
    const ac = !tarayici || uniteAcik(list, u, d), eski = d.unite[`${ders}.${no}`];
    body = (
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
    );
    controls = (
      <Alt>
        {ac ? <Button className="w-full" data-next onClick={basla}>Teste başla</Button>
          : <Button asChild className="w-full"><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>}
      </Alt>
    );
  } else if (key && Q) {
    const ok = sonuc === true, not = yonerge(Q);
    body = (
      <article className="flex flex-col gap-4">
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-bold">
          <span className="flex-none whitespace-nowrap tabular-nums text-acc">Soru {i + 1} / {n}</span>
          <span className="truncate text-muted-foreground">· {Q.baslik}</span>
        </span>
        <Html as="h2" className={sonuc === null ? "text-[22px]" : "text-lg"} html={Q.q} />
        {not && sonuc === null && <p className="-mt-2 text-[14px] font-medium text-muted-foreground">{not}</p>}
        <TestGovde key={key} q={Q} cevap={cevap} setCevap={(c) => { if (sonuc === null) setCevapS(c); }} sonuc={sonuc} sec={degerlendir} tohum={key} />
      </article>
    );
    controls = (
      <Alt durum={sonuc === null ? undefined : ok ? "ok" : "no"}>
        <AnimatePresence initial={false}>
          {sonuc !== null && (
            <motion.div key="geri" aria-live="polite" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden pb-3">
              <h2 className={cn("mb-0.5 text-lg", ok ? "text-good" : "text-bad")}>{geriBaslik(Q, ok)}</h2>
              <Html as="p" className="text-[15px] leading-normal" html={geriMetin(Q, cevap, ok)} />
            </motion.div>
          )}
        </AnimatePresence>
        {!secmeli(Q) && sonuc === null ? (
          <Button className="w-full" data-next disabled={!hazir(Q, cevap)} onClick={() => degerlendir(cevap)}>{hazir(Q, cevap) ? "Kontrol et" : "Cevabını kur"}</Button>
        ) : (
          <Button className="w-full" data-next disabled={sonuc === null} onClick={ileri}>{sonuc === null ? "Bir cevap seç" : i === n - 1 ? "Sonucu gör" : "Sonraki soru"}</Button>
        )}
      </Alt>
    );
  } else {
    const gecti = puan >= GECME;
    body = (
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
  }

  return (
    <div className="app" data-ders={ders}>
      <header className="top gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href={href(ders)} aria-label="Ünite testinden çık"><Close /></Link></Button>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold">{no}. ünite testi</span>
          <Progress value={n ? (100 * Math.min(i + (sonuc !== null ? 1 : 0), n)) / n : 0} />
        </div>
      </header>
      <main className="view gap-0 pt-1 pb-0">
        <motion.div key={`${liste ? 1 : 0}.${i}`} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.16, ease: "easeOut" }} className="pb-6">
          {body}
        </motion.div>
        {controls}
      </main>
    </div>
  );
}
