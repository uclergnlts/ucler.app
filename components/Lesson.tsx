"use client";
// Ders ekranı: konu girişi (aşamalar) -> aşama aşama kartlar -> 4 soruluk mini test -> sonuç.
// Kartlar 2-4 aşamaya bölünür (lib/asama.ts). Aşamalar sırayla açılır; öğrenci konuya her zaman 1. aşamadan başlar.
// Kartlar slayt gibi yer değiştirmez: "Devam" ile bir sonraki kart altta belirir ve sayfa ona kayar
// (Brilliant gibi akış). Yeni kartta görsel parça parça çizilir, yazı cümle cümle gelir.
// Etkileşimli adımları "kart" alanıyla yerleştirilmiş konularda adımlar anlatımın içinde, ilgili karttan hemen
// sonra gelir: kısa açıklama (kart) → örnek (sahne kendisi oynar) → sıra sende (görev). Görev bitmeden "Devam" açılmaz.
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DERSLER, secmeli, type DersId, type Topic } from "@/lib/dersler";
import { asamaBitir, setProg, toggleAnlamadim, toggleSaved, useAnlamadim, useAsama, useProg, useSaved, yanlisKaydet } from "@/lib/store";
import { asamalar, kartinAsamasi } from "@/lib/asama";
import { kaydet, PUAN } from "@/lib/puan";
import { olay } from "@/lib/olay";
import { kartVideolari, sureYaz, type Video } from "@/lib/videolar";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html, href } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import VideoPlayer from "./VideoPlayer";
import Etk from "./Etk";
import { Belir, CanliSvg, SiraliMetin, useCanliSvg } from "./canli";
import type { Adim, AdimliDers } from "@/lib/adimli";
import { AdimGorunum, type Bildirim } from "./DersMotoru";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import AsamaYolu, { type YolDugum } from "./AsamaYolu";
import { Konfeti, Madalya, PuanRozet } from "./Kutlama";

/** Akıştaki öğe: konu kartı ya da etkileşimli adım. */
type Oge = { tur: "kart"; k: number } | { tur: "adim"; a: Adim; n: number };

/** a: aşama (-1: konu girişi), ara: aşama bitti ekranı, i: akıştaki öğe, q: test sorusu (-1: test başlamadı),
 * cevap: test sorusunda öğrencinin kurduğu cevap, sonuc: değerlendirildiyse doğru mu (null: henüz değil),
 * odul: aşama ya da konu bitince kazanılan puan (ilk kez bitiyorsa). */
type State = { a: number; ara: boolean; i: number; q: number; cevap: Cevap; sonuc: boolean | null; right: number; odul: number };
const START: State = { a: -1, ara: false, i: 0, q: -1, cevap: null, sonuc: null, right: 0, odul: 0 };

export default function Lesson({
  ders, id, t, next, adimli, on = [],
}: { ders: DersId; id: string; t: Topic; next?: { id: string; title: string }; adimli?: AdimliDers; on?: { id: string; title: string }[] }) {
  const [s, setS] = useState<State>(START);
  // Adımların hepsi bir karta yerleştirilmişse anlatımın içine girer; değilse ayrı ders olarak bağlantısı çıkar.
  const birlesik = !!adimli?.adimlar.length && adimli.adimlar.every((a) => a.kart);
  const ogeler = useMemo(() => {
    const out: Oge[] = [];
    t.cards.forEach((_, k) => {
      out.push({ tur: "kart", k });
      if (birlesik) adimli!.adimlar.forEach((a, n) => { if (a.kart === k + 1) out.push({ tur: "adim", a, n }); });
    });
    return out;
  }, [t, adimli, birlesik]);
  const [biten, setBiten] = useState<Set<number>>(() => new Set());
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);
  // Görev bir kez puan getirir; sahne "tamam"ı birden çok kez çağırabilir.
  const sayilan = useRef(new Set<number>());
  const tamamlar = useMemo(() => ogeler.map((_, j) => () => {
    if (!sayilan.current.has(j)) { sayilan.current.add(j); kaydet("adim", 1, PUAN.adim); }
    setBiten((b) => (b.has(j) ? b : new Set(b).add(j)));
  }), [ogeler]);
  const [play, setPlay] = useState<Video | null>(null);
  const yon = useRef<1 | -1>(1); // kart geçişinin yönü (kayma animasyonu için)
  const saved = useSaved().includes(`${ders}.${id}`);
  const prog = useProg(), anlamadim = useAnlamadim();
  const eksik = on.filter((o) => !prog[`${ders}.${o.id}`]);
  const nCards = ogeler.length, nQuiz = t.quiz.length, nKart = t.cards.length;
  // Her aşamanın akıştaki öğe aralığı [ilk, son): aşamanın ilk kartından sonraki aşamanın ilk kartına kadar.
  const asamaOge = useMemo(() => {
    const yer = (k: number) => (k >= nKart ? ogeler.length : ogeler.findIndex((o) => o.tur === "kart" && o.k === k));
    return asamalar(nKart).map(([b, e]) => [yer(b), yer(e)] as const);
  }, [ogeler, nKart]);
  const nAsama = asamaOge.length, konuKey = `${ders}.${id}`;
  // Testi bitmiş konuda bütün aşamalar bitmiş sayılır (aşamalardan önce bitirilen konular dahil).
  const asamaDurum = useAsama();
  const bitenA = prog[konuKey] ? nAsama : Math.min(asamaDurum[konuKey] ?? 0, nAsama);
  const [ilkOge, sonOge] = s.a >= 0 && s.a < nAsama ? asamaOge[s.a] : [0, 0];
  const Close = Icon.kapat, Bookmark = Icon.kayit;

  // Videodan gelen bağlantı (?kart=3) dersi o karttan açar; geçersiz değerde ilk kart.
  useEffect(() => {
    const k = Number(new URLSearchParams(location.search).get("kart"));
    const j = ogeler.findIndex((o) => o.tur === "kart" && o.k === k - 1);
    if (Number.isInteger(k) && k > 0 && j >= 0) setS({ ...START, a: kartinAsamasi(nKart, k - 1), i: j });
  }, [ogeler, nKart]);

  useEffect(() => { setProg({ _last: `${ders}.${id}` }); }, [ders, id]);
  useEffect(() => { window.scrollTo(0, 0); }, [s.q, s.a, s.ara]);
  // Yeni kart altta belirince sayfa ona kayar.
  const sonKart = useRef<HTMLElement>(null);
  useEffect(() => {
    if (s.q < 0 && s.a >= 0 && !s.ara && s.i > ilkOge) sonKart.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [s.i, s.q, s.a, s.ara, ilkOge]);
  useEffect(() => {
    if (s.q === nQuiz) setProg({ [`${ders}.${id}`]: `${s.right}/${nQuiz} doğru` });
  }, [s.q, s.right, nQuiz, ders, id]);

  const akista = s.q < 0 && s.a >= 0 && !s.ara;
  const kilitli = akista && ogeler[s.i]?.tur === "adim" && !biten.has(s.i);
  /** Aşamayı (ya da testi) baştan açar. */
  const asamaAc = (a: number) => {
    yon.current = 1;
    setBildirim(null);
    setS(a < nAsama ? { ...START, a, i: asamaOge[a][0] } : { ...START, a: nAsama, q: 0, cevap: ilkCevap(t.quiz[0]) });
  };
  // Akışta geri gitmek yok: önceki kartlar yukarıda duruyor. Puan yan etkileri setS'in dışında, olay anında yazılır.
  function step(dir: 1 | -1) {
    if (dir < 0 || kilitli) return;
    yon.current = dir;
    setBildirim(null);
    if (s.q < 0 && s.a < 0) return asamaAc(prog[konuKey] ? 0 : bitenA);
    if (s.ara) return asamaAc(s.a + 1);
    if (akista) {
      if (ogeler[s.i].tur === "kart") kaydet("kart", 1, PUAN.kart);
      if (s.i < sonOge - 1) return setS({ ...s, i: s.i + 1 });
      // Puan yalnızca aşama ilk kez bittiğinde; görev sayacı tekrarda da ilerler.
      const ilk = s.a === bitenA && asamaBitir(konuKey, s.a);
      kaydet("asama", 1, ilk ? PUAN.asama : 0);
      return setS({ ...s, ara: true, odul: ilk ? PUAN.asama : 0 });
    }
    if (s.q >= 0 && s.q < nQuiz && s.sonuc !== null) {
      if (s.q === nQuiz - 1) {
        const ilk = !prog[konuKey];
        kaydet("konu", 1, ilk ? PUAN.konu : 0);
        return setS({ ...s, q: s.q + 1, cevap: null, sonuc: null, odul: ilk ? PUAN.konu : 0 });
      }
      setS({ ...s, q: s.q + 1, cevap: ilkCevap(t.quiz[s.q + 1]), sonuc: null });
    }
  }
  /** Test sorusunu değerlendirir (çoktan seçmelide şık seçilince, etkileşimlide "Kontrol et" ile). */
  const degerlendir = (cevap: Cevap) => {
    if (s.sonuc !== null) return;
    const ok = dogruMu(t.quiz[s.q], cevap);
    // Yanlış yapılan soru akıllı tekrara girer: 1, 3 ve 7 gün sonra yeniden sorulur.
    if (!ok) yanlisKaydet(`${ders}.${id}.${s.q}`);
    kaydet("soru");
    if (ok) kaydet("dogru", 1, PUAN.dogru);
    setS((p) => (p.sonuc !== null ? p : { ...p, cevap, sonuc: ok, right: p.right + (ok ? 1 : 0) }));
  };

  // Klavye
  const stepRef = useRef(step);
  stepRef.current = play ? () => {} : step;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.("input")) return; // sürgüdeki ok tuşları kart değiştirmesin
      if (e.key === "ArrowRight") stepRef.current(1);
      if (e.key === "ArrowLeft") stepRef.current(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Akışta en son açılan kart (anlamadım düğmesi bunu işaretler).
  const sonKartOge = akista ? ogeler.slice(ilkOge, s.i + 1).filter((o) => o.tur === "kart").pop() : undefined;
  const sonKartNo = sonKartOge?.tur === "kart" ? sonKartOge.k + 1 : 0;
  const anlamadimMi = !!sonKartNo && anlamadim.includes(`${ders}.${id}.${sonKartNo}`);
  const pos = s.q >= 0 ? nCards + s.q : s.a < 0 ? -1 : s.ara ? sonOge - 1 : s.i;
  let body: React.ReactNode, controls: React.ReactNode = null, key: string;
  const SoruI = Icon.soru;

  if (s.q < 0 && s.a < 0) {
    // Konu girişi: aşamalar sırayla açılır.
    key = "giris";
    const testAcik = bitenA >= nAsama;
    body = (
      <div className="flex flex-col gap-5">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-acc-soft p-4 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-h-[120px] [&_svg]:w-full"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-2xl bg-card p-2.5" aria-hidden="true" dangerouslySetInnerHTML={{ __html: t.cards[0].svg }} />
        </motion.div>
        <section className="grid gap-2">
          <h1 className="text-[26px]">{t.title}</h1>
          <Html as="p" className="text-[15px] text-muted-foreground" html={t.summary} />
        </section>
        {eksik.length > 0 && (
          <p className="-mt-2 text-[14px] text-muted-foreground">
            Önce şuna bakman iyi olur:{" "}
            {eksik.map((o, k) => (
              <span key={o.id}>{k > 0 && ", "}<Link href={href(ders, o.id)} className="font-semibold text-acc">{o.title}</Link></span>
            ))}
          </p>
        )}
        {adimli && !birlesik && (
          <Link
            href={`/ornek/${adimli.id}/`}
            className="flex items-center gap-3 rounded-2xl bg-acc-soft px-4 py-3.5 transition-transform active:scale-[.99]"
          >
            <span className="grid flex-1 gap-0.5">
              <b className="text-[16px] font-bold">Önce yaparak öğren</b>
              <span className="text-[14px] text-muted-foreground">Etkileşimli ders · {adimli.adimlar.length} adım</span>
            </span>
            <span className="rounded-full bg-acc px-4 py-2 text-[14px] font-bold text-white">Başla</span>
          </Link>
        )}
        <div className="pt-8 pb-2">
          <AsamaYolu
            balon={prog[konuKey] ? "Yeniden" : bitenA === 0 ? "Başla" : "Devam"}
            dugumler={[
              ...asamalar(nKart).map(([b], a) => ({
                baslik: `${a + 1}. aşama`,
                alt: t.cards[b].h,
                durum: (prog[konuKey] ? (a === 0 ? "sirada" : "bitti") : a < bitenA ? "bitti" : a === bitenA ? "sirada" : "kilitli") as YolDugum["durum"],
                ac: () => asamaAc(a),
              })),
              {
                baslik: "Mini test",
                alt: prog[konuKey] ? `Son sonuç: ${prog[konuKey]}` : `${nQuiz} soru`,
                durum: (prog[konuKey] ? "bitti" : testAcik ? "sirada" : "kilitli") as YolDugum["durum"],
                test: true,
                ac: () => asamaAc(nAsama),
              },
            ]}
          />
        </div>
      </div>
    );
    controls = (
      <Alt>
        <Button className="w-full" data-next onClick={() => step(1)}>
          {prog[konuKey] ? "Baştan başla" : bitenA === 0 ? "Başla" : testAcik ? "Mini teste geç" : `${bitenA + 1}. aşamadan devam et`}
        </Button>
      </Alt>
    );
  } else if (s.ara) {
    // Aşama bitti.
    const sonAsama = s.a === nAsama - 1;
    key = `ara${s.a}`;
    body = (
      <article className="flex flex-col items-center gap-3 pt-4 text-center">
        <Madalya />
        <div className="flex gap-1.5" aria-hidden="true">
          {asamaOge.map((_, a) => (
            <motion.span
              key={a}
              className={cn("h-2.5 w-10 origin-left rounded-full", a <= Math.max(s.a, bitenA - 1) ? "bg-acc" : "bg-secondary")}
              initial={a === s.a ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
        <motion.h1
          className="text-[28px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {s.a + 1}. aşama bitti
        </motion.h1>
        <p className="text-[15px] text-muted-foreground">
          {sonAsama ? "Bütün kartları gördün. Şimdi öğrendiklerini mini testte dene." : s.a + 2 === nAsama ? "Sırada son aşama var." : `Sırada ${s.a + 2}. aşama var.`}
        </p>
        {s.odul > 0 && <PuanRozet puan={s.odul} />}
      </article>
    );
    controls = (
      <Alt>
        <Button className="w-full" data-next onClick={() => step(1)}>{sonAsama ? "Mini teste geç" : `${s.a + 2}. aşamaya geç`}</Button>
      </Alt>
    );
  } else if (s.q < 0) {
    const last = s.i === sonOge - 1;
    key = `a${s.a}`;
    body = (
      <div className="flex flex-col gap-14" aria-live="polite">
        {ogeler.slice(ilkOge, s.i + 1).map((o, jj) => {
          const j = ilkOge + jj;
          return o.tur === "kart" ? (
            <AkisKart
              key={j}
              ref={j === s.i ? sonKart : undefined}
              c={t.cards[o.k]}
              vids={kartVideolari(ders, id, o.k + 1)}
              canli={j === s.i}
              oynat={setPlay}
            />
          ) : (
            <motion.article
              key={j}
              ref={j === s.i ? sonKart : undefined}
              className="ad-kart ad-akista scroll-mt-20"
              inert={j < s.i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <SiraliMetin className="ad-metin" html={o.a.metin} gecikme={0.1} />
              <AdimGorunum a={o.a} tamam={tamamlar[j]} bildir={j === s.i ? setBildirim : yoksay} />
            </motion.article>
          );
        })}
      </div>
    );
    controls = (
      <Alt durum={bildirim ? (bildirim.ok ? "ok" : "no") : undefined}>
        <AnimatePresence initial={false} mode="popLayout">
          {bildirim && (
            <motion.div
              key={bildirim.baslik + bildirim.metin}
              aria-live="polite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-3"
            >
              <Html as="h2" className={cn("mb-0.5 text-lg", bildirim.ok ? "text-good" : "text-bad")} html={bildirim.baslik} />
              <Html as="p" className="text-[15px] leading-normal" html={bildirim.metin} />
            </motion.div>
          )}
        </AnimatePresence>
        <Button className="w-full" data-next disabled={kilitli} onClick={() => step(1)}>{last ? "Aşamayı bitir" : "Devam"}</Button>
      </Alt>
    );
  } else if (s.q < nQuiz) {
    const Q = t.quiz[s.q], sonuc = s.sonuc, ok = sonuc === true, etkilesimli = !secmeli(Q), not = yonerge(Q);
    key = `q${s.q}`;
    body = (
      <article className="flex flex-col gap-4">
        <span className="text-[13px] font-bold tabular-nums text-acc">Soru {s.q + 1} / {nQuiz}</span>
        <Html as="h2" className={sonuc === null ? "text-[22px]" : "text-lg"} html={Q.q} />
        {not && sonuc === null && <p className="-mt-2 text-[14px] font-medium text-muted-foreground">{not}</p>}
        <TestGovde q={Q} cevap={s.cevap} setCevap={(c) => setS((p) => (p.sonuc !== null ? p : { ...p, cevap: c }))} sonuc={sonuc} sec={degerlendir} tohum={`${konuKey}.${s.q}`} />
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
              className="overflow-hidden"
            >
              <h2 className={cn("mb-0.5 text-lg", ok ? "text-good" : "text-bad")}>{geriBaslik(Q, ok)}</h2>
              <Html as="p" className="pb-3 text-[15px] leading-normal" html={geriMetin(Q, s.cevap, ok)} />
            </motion.div>
          )}
        </AnimatePresence>
        {etkilesimli && sonuc === null ? (
          <Button className="w-full" data-next disabled={!hazir(Q, s.cevap)} onClick={() => degerlendir(s.cevap)}>Kontrol et</Button>
        ) : (
          <Button className="w-full" data-next disabled={sonuc === null} onClick={() => step(1)}>
            {s.q === nQuiz - 1 ? "Sonucu gör" : "Sonraki soru"}
          </Button>
        )}
      </Alt>
    );
  } else {
    const great = s.right === nQuiz, fine = s.right >= nQuiz / 2;
    key = "son";
    body = (
      <article className="flex flex-col items-center gap-2 pt-4 text-center">
        {fine && <Konfeti />}
        <Madalya kupa />
        <motion.div
          className="font-display text-[56px] leading-none font-extrabold text-acc"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        >
          {s.right}/{nQuiz}
        </motion.div>
        <h2 className="text-[22px]">{great ? "Harika, hepsi doğru!" : fine ? "Güzel gidiyorsun!" : "Kartlara bir kez daha bakalım."}</h2>
        <p className="font-medium text-muted-foreground">{t.title} tamamlandı.</p>
        {s.odul > 0 && <PuanRozet puan={s.odul} />}
        {s.right < nQuiz && (
          <p className="mt-1 text-[14px] text-muted-foreground">Yanlışların yarın tekrar karşına çıkacak.</p>
        )}
        <div className="mt-4 grid w-full gap-2">
          {next && <Button asChild><Link href={href(ders, next.id)}>Sıradaki: {next.title}</Link></Button>}
          <Button asChild variant={next ? "ghost" : "outline"}><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
        </div>
      </article>
    );
  }

  return (
    <div className="app" data-ders={ders}>
      <header className="top gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href={href(ders)} aria-label="Konudan çık"><Close /></Link></Button>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold">{t.title}</span>
          <Progress value={(100 * (pos + 1)) / (nCards + nQuiz + 1)} />
        </div>
        {akista && sonKartNo ? (
          // Akışta tek düğme: son okunan kartı "anlamadım" diye işaretler (Profil'de listelenir).
          <Button
            variant="ghost"
            size="icon"
            className={cn("-mr-2", anlamadimMi ? "text-acc" : "text-muted-foreground")}
            aria-pressed={anlamadimMi}
            aria-label={anlamadimMi ? "Bu kartı anlamadım (işaretli)" : "Bu kartı anlamadım"}
            title="Bunu anlamadım"
            onClick={() => {
              const k = `${ders}.${id}.${sonKartNo}`;
              if (toggleAnlamadim(k)) olay("anlamadim", { kart: k });
            }}
          >
            <SoruI />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn("-mr-2", saved ? "text-acc [&_svg]:fill-current" : "text-muted-foreground")}
            aria-pressed={saved}
            aria-label="Konuyu kaydet"
            onClick={() => toggleSaved(`${ders}.${id}`)}
          >
            <Bookmark />
          </Button>
        )}
      </header>
      <main className="view gap-0 pt-1 pb-0">
        <AnimatePresence mode="wait" custom={yon.current}>
          <motion.div
            key={key}
            custom={yon.current}
            variants={{
              gir: (d: number) => ({ opacity: 0, x: 28 * d }),
              dur: { opacity: 1, x: 0 },
              cik: (d: number) => ({ opacity: 0, x: -28 * d }),
            }}
            initial="gir"
            animate="dur"
            exit="cik"
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="pb-6"
          >
            {body}
          </motion.div>
        </AnimatePresence>
        {controls}
      </main>
      {play && <VideoPlayer v={play} onClose={() => setPlay(null)} />}
    </div>
  );
}

const yoksay = () => {};

type Kart = Topic["cards"][number];

/** Akıştaki bir kart. canli: kart yeni açıldı, görsel çizilsin ve yazı sırayla gelsin. */
function AkisKart({ c, vids, canli, oynat, ref }: {
  c: Kart; vids: Video[]; canli: boolean; oynat: (v: Video) => void; ref?: React.Ref<HTMLElement>;
}) {
  const ilk = useRef(canli).current; // yalnızca ilk açılışta canlandır
  const Play = Icon.play;
  const etkRef = useCanliSvg<HTMLDivElement>();
  const n = c.p.split(/[.!?…]\s/).length;
  const metinBitti = ilk ? 0.55 + n * 0.35 : 0;
  return (
    <article ref={ref} className="flex scroll-mt-20 flex-col gap-4">
      {c.etk ? (
        <div ref={ilk ? etkRef : undefined}><Etk e={c.etk} svg={c.svg} /></div>
      ) : ilk ? (
        <CanliSvg className="visual" html={c.svg} />
      ) : (
        <div className="visual" dangerouslySetInnerHTML={{ __html: c.svg }} />
      )}
      <div className="grid gap-1.5">
        <Kap on={ilk} d={0.15}>
          <Html as="h2" className="text-[22px]" html={c.h} />
        </Kap>
        {ilk ? <SiraliMetin className="text-[17px] leading-relaxed" html={c.p} gecikme={0.45} /> : <Html as="p" className="text-[17px] leading-relaxed" html={c.p} />}
      </div>
      {c.key && (
        <Kap on={ilk} d={metinBitti}>
          <Html as="p" className="border-l-[3px] border-acc pl-3 text-[16px] leading-relaxed font-semibold" html={c.key} />
        </Kap>
      )}
      {vids.map((v) => (
        <Kap key={v.id} on={ilk} d={metinBitti + 0.15}>
          <button
            onClick={() => oynat(v)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-2 pr-3 text-left transition-transform active:scale-[.99]"
          >
            <span className="relative grid h-14 w-10 flex-none place-items-center overflow-hidden rounded-lg bg-acc">
              {v.poster && <img src={v.poster} alt="" className="absolute inset-0 size-full object-cover" />}
              <span className="relative grid size-6 place-items-center rounded-full bg-white/90 text-foreground [&_svg]:size-3.5"><Play /></span>
            </span>
            <span><b className="block text-[15px] leading-snug font-semibold">{v.baslik}</b><span className="block text-[13px] text-muted-foreground">Kısa video · {sureYaz(v.sure)}</span></span>
          </button>
        </Kap>
      ))}
    </article>
  );
}

/** Yeni açılan kartta parçayı gecikmeyle getirir; eski kartlarda olduğu gibi gösterir. */
function Kap({ on, d, children }: { on: boolean; d: number; children: React.ReactNode }) {
  return on ? <Belir gecikme={d}>{children}</Belir> : <>{children}</>;
}
