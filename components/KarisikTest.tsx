"use client";
// Karışık test akışı: ünite testi ve seviye testi aynı soru akışını kullanır (giriş, sorular, sonuç).
// Yanlış yapılan soru konu testinde olduğu gibi tekrar sırasına girer.
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TekrarSoru } from "@/lib/content";
import { secmeli, type DersId } from "@/lib/dersler";
import { kaydet, PUAN } from "@/lib/puan";
import { yanlisKaydet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import { Html, href } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Bildir, { BildirDugme } from "./Bildir";
import { ses } from "@/lib/ses";

export function karistir<T>(l: T[]) {
  for (let a = l.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [l[a], l[b]] = [l[b], l[a]]; }
  return l;
}

/** Soru anahtarlarını konularına göre gruplar; gruplar soruların sırasıyla (dersteki konu sırası) gelir, içleri karışık. */
export function konuGruplari(sorular: Record<string, TekrarSoru>) {
  const gruplar: Record<string, string[]> = {};
  for (const k of Object.keys(sorular)) (gruplar[sorular[k].konu] ??= []).push(k);
  return Object.values(gruplar).map((g) => karistir([...g]));
}

/** Gruplardan sırayla birer soru alarak (her grup eşit temsil edilsin) en çok n soru seçer. */
export function sirayla(kuyruk: string[][], n: number) {
  const out: string[] = [];
  while (out.length < n && kuyruk.some((g) => g.length)) {
    for (const g of kuyruk) if (g.length && out.length < n) out.push(g.shift()!);
  }
  return out;
}

export type Sonuc = { puan: number; right: number; n: number; dogru: Record<string, boolean>; basla: () => void };

export default function KarisikTest({ ders, baslik, cikis, sorular, sec, giris, bitti, sonuc: sonucEkrani }: {
  ders: DersId;
  /** Üst çubukta yazan ad. */
  baslik: string;
  /** Çıkış düğmesinin okunan adı. */
  cikis: string;
  sorular: Record<string, TekrarSoru>;
  /** Her denemede sorulacak soruların anahtarları. */
  sec: () => string[];
  giris: (basla: () => void) => { body: React.ReactNode; controls: React.ReactNode };
  /** Son soru cevaplanınca bir kez çağrılır (puan 0-100, soru anahtarı -> doğru mu). */
  bitti: (puan: number, dogru: Record<string, boolean>) => void;
  sonuc: (s: Sonuc) => React.ReactNode;
}) {
  const [liste, setListe] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [cevap, setCevapS] = useState<Cevap>(null);
  const [sonuc, setSonuc] = useState<boolean | null>(null);
  const [dogru, setDogru] = useState<Record<string, boolean>>({});
  const Close = Icon.kapat;

  const basla = useCallback(() => {
    const l = sec();
    setListe(l); setI(0); setDogru({}); setSonuc(null); setCevapS(ilkCevap(sorular[l[0]]));
  }, [sec, sorular]);
  useEffect(() => { window.scrollTo(0, 0); }, [i, liste]);

  const n = liste?.length ?? 0;
  const key = liste && i < n ? liste[i] : undefined;
  const Q = key ? sorular[key] : undefined;
  const right = Object.values(dogru).filter(Boolean).length;
  const puan = n ? Math.round((100 * right) / n) : 0;

  const degerlendir = (c: Cevap) => {
    if (!key || !Q || sonuc !== null) return;
    const ok = dogruMu(Q, c);
    ses(ok ? "dogru" : "yanlis");
    setCevapS(c); setSonuc(ok);
    setDogru((d) => ({ ...d, [key]: ok }));
    if (!ok) yanlisKaydet(key);
    kaydet("soru");
    if (ok) kaydet("dogru", 1, PUAN.dogru);
  };
  const ileri = () => {
    const j = i + 1;
    setSonuc(null); setI(j);
    if (liste && j < n) setCevapS(ilkCevap(sorular[liste[j]]));
    else bitti(puan, dogru);
  };

  let body: React.ReactNode = null, controls: React.ReactNode = null;
  if (!liste) {
    ({ body, controls } = giris(basla));
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
    body = sonucEkrani({ puan, right, n, dogru, basla });
  }

  return (
    <div className="app" data-ders={ders}>
      <header className="top gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href={href(ders)} aria-label={cikis}><Close /></Link></Button>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold">{baslik}</span>
          <Progress value={n ? (100 * Math.min(i + (sonuc !== null ? 1 : 0), n)) / n : 0} />
        </div>
        {key && Q && (
          <Bildir yer={{ ders: Q.ders, konu: Q.konu, yer: `test sorusu ${Number(key.split(".").pop()) + 1} (${baslik})`, ozet: Q.q }}>
            <BildirDugme className="-mr-1" />
          </Bildir>
        )}
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
