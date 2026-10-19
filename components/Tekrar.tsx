"use client";
// Akıllı tekrar ekranı: testlerde yanlış yapılan sorulardan bugün sırası gelenler karışık sırayla sorulur.
// Kurallar lib/store.ts içinde (1, 3 ve 7 gün; yanlışta başa döner). Sorular ekran açılınca bir kez seçilir,
// cevaplandıkça listeden düşmez; böylece aynı oturumda soru sırası kaymaz.
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, secmeli } from "@/lib/dersler";
import { kaydet, PUAN } from "@/lib/puan";
import { gun, gunAdi, tekrarCevap, tekrarOku, useTekrar } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import { Html, href, Logo } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

type Oge = { key: string; s: number };

/** Basamağa göre doğru cevaptan sonra sorunun ne zaman yeniden geleceği. */
const SONRA = ["2 gün sonra yeniden sorulacak.", "4 gün sonra son kez sorulacak.", "Bu soruyu öğrendin, artık tekrar sorulmayacak."];

export default function Tekrar({ sorular }: { sorular: Record<string, TekrarSoru> }) {
  const [liste, setListe] = useState<Oge[] | null>(null);
  const [i, setI] = useState(0);
  const [kurulan, setKurulan] = useState<{ key: string; c: Cevap } | null>(null);
  const [sonuc, setSonuc] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  // Sonuç ekranı için: kaç soru öğrenilip sıradan çıktı, kaçı bir basamak ilerledi (doğru ama sırada kaldı).
  const [ogrenilen, setOgrenilen] = useState(0);
  const tekrar = useTekrar();
  const Close = Icon.kapat;

  useEffect(() => {
    const t = tekrarOku(), bugun = gun();
    const l = Object.keys(t).filter((k) => t[k].g <= bugun && sorular[k]).map((key) => ({ key, s: t[key].s }));
    for (let a = l.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [l[a], l[b]] = [l[b], l[a]]; }
    setListe(l);
  }, [sorular]);
  useEffect(() => { window.scrollTo(0, 0); }, [i]);

  const n = liste?.length ?? 0;
  const cur = liste && i < n ? liste[i] : undefined;
  const Q = cur ? sorular[cur.key] : undefined;

  // Cevap soruya bağlıdır: yeni soruda sorunun türüne göre baştan kurulur.
  const cevap: Cevap = cur && Q ? (kurulan?.key === cur.key ? kurulan.c : ilkCevap(Q)) : null;
  const setCevap = (c: Cevap) => { if (cur) setKurulan({ key: cur.key, c }); };
  const degerlendir = (c: Cevap) => {
    if (!cur || !Q || sonuc !== null) return;
    const ok = dogruMu(Q, c);
    setCevap(c);
    setSonuc(ok);
    if (ok) setRight((r) => r + 1);
    if (ok && cur.s === SONRA.length - 1) setOgrenilen((x) => x + 1); // üçüncü doğru: soru sıradan çıkar
    tekrarCevap(cur.key, ok);
    kaydet("tekrar", 1, ok ? PUAN.tekrar : 0);
  };
  const ileri = () => { setSonuc(null); setI((x) => x + 1); };

  let body: React.ReactNode = null, controls: React.ReactNode = null;
  if (liste && !n) {
    // Bugün sorulacak yok: sıradakini söyle.
    const gelecek = Object.values(tekrar).map((x) => x.g).filter((g) => g > gun()).sort();
    const ilk = gelecek[0], ayni = gelecek.filter((g) => g === ilk).length;
    body = (
      <article className="flex flex-col items-center gap-2 pt-10 text-center">
        <Logo className="mb-1 text-[40px]" />
        <h1 className="text-[24px]">Bugün tekrar edecek sorun yok</h1>
        <p className="text-[15px] text-muted-foreground">
          {ilk ? `Sıradaki tekrar ${gunAdi(ilk)}: ${ayni} soru.` : "Testlerde yanlış yaptığın sorular burada toplanır."}
        </p>
        <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-left text-[14px]">
          Bir soruyu yanlış yapınca o soru 1, 3 ve 7 gün sonra yeniden karşına çıkar. Üçünü de doğru yaparsan soru sıradan
          çıkar; arada yanlış yaparsan baştan başlar. Bilgi böyle kalıcı olur.
        </p>
        <Button asChild className="mt-4 w-full"><Link href="/">Ana sayfaya dön</Link></Button>
      </article>
    );
  } else if (cur && Q) {
    const ok = sonuc === true, not = yonerge(Q);
    body = (
      <article className="flex flex-col gap-4" data-ders={Q.ders}>
        <span className="flex items-center gap-2 text-[13px] font-bold">
          <span className="tabular-nums text-acc">Soru {i + 1} / {n}</span>
          <span className="truncate text-muted-foreground">· {DERSLER[Q.ders].ad} · {Q.baslik}</span>
        </span>
        <Html as="h2" className={sonuc === null ? "text-[22px]" : "text-lg"} html={Q.q} />
        {not && sonuc === null && <p className="-mt-2 text-[14px] font-medium text-muted-foreground">{not}</p>}
        <TestGovde key={cur.key} q={Q} cevap={cevap} setCevap={(c) => { if (sonuc === null) setCevap(c); }} sonuc={sonuc} sec={degerlendir} tohum={cur.key} />
      </article>
    );
    controls = (
      <Alt durum={sonuc === null ? undefined : ok ? "ok" : "no"}>
        <AnimatePresence initial={false}>
          {sonuc !== null && (
            <motion.div
              key="geri"
              aria-live="polite"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-3"
            >
              <h2 className={cn("mb-0.5 text-lg", ok ? "text-good" : "text-bad")}>{geriBaslik(Q, ok)}</h2>
              <Html as="p" className="text-[15px] leading-normal" html={Q.e} />
              <p className="mt-1.5 text-[14px] font-semibold">
                {ok ? SONRA[cur.s] : <>Yarın yeniden sorulacak. <Link className="text-acc underline-offset-2 hover:underline" data-ders={Q.ders} href={href(Q.ders, Q.konu)}>Konuya bak</Link></>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {!secmeli(Q) && sonuc === null ? (
          <Button className="w-full" data-next disabled={!hazir(Q, cevap)} onClick={() => degerlendir(cevap)}>Kontrol et</Button>
        ) : (
          <Button className="w-full" data-next disabled={sonuc === null} onClick={ileri}>{i === n - 1 ? "Sonucu gör" : "Sonraki soru"}</Button>
        )}
      </Alt>
    );
  } else if (liste) {
    body = (
      <article className="flex flex-col items-center gap-2 pt-6 text-center">
        <Logo className="mb-1 text-[40px]" />
        <div className="font-display text-[56px] leading-none font-extrabold">{right}/{n}</div>
        <h2 className="text-[22px]">Bugünkü tekrar bitti</h2>
        <p className="font-medium text-muted-foreground">
          {sonucMetni(n - right, right - ogrenilen, ogrenilen)}
        </p>
        <Button asChild className="mt-4 w-full"><Link href="/">Ana sayfaya dön</Link></Button>
      </article>
    );
  }

  return (
    <div className="app">
      <header className="top gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href="/" aria-label="Tekrardan çık"><Close /></Link></Button>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold">Tekrar</span>
          <Progress value={n ? (100 * Math.min(i + (sonuc !== null ? 1 : 0), n)) / n : 0} />
        </div>
      </header>
      <main className="view gap-0 pt-1 pb-0">
        <motion.div key={i} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.16, ease: "easeOut" }} className="pb-6">
          {body}
        </motion.div>
        {controls}
      </main>
    </div>
  );
}

/** Tekrar sonucundaki açıklama: yalnızca gerçekten sırada kalan sorular için yeniden gelme sözü verir. */
function sonucMetni(yanlis: number, ilerleyen: number, ogrenilen: number) {
  const c: string[] = [];
  if (ogrenilen) c.push(`${ogrenilen} soruyu öğrendin, artık sorulmayacak.`);
  if (ilerleyen) c.push(`Doğru yaptığın ${ilerleyen} soru birkaç gün sonra yeniden gelecek.`);
  if (yanlis) c.push(`Yanlış yaptığın ${yanlis} soru yarın yeniden gelecek.`);
  return c.join(" ");
}
