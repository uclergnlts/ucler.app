"use client";
// Ders ekranı: kartlar -> 4 soruluk mini test -> sonuç.
// Kartlar slayt gibi yer değiştirmez: "Devam" ile bir sonraki kart altta belirir ve sayfa ona kayar
// (Brilliant gibi akış). Yeni kartta görsel parça parça çizilir, yazı cümle cümle gelir.
// Etkileşimli adımları "kart" alanıyla yerleştirilmiş konularda adımlar anlatımın içinde, ilgili karttan hemen
// sonra gelir: kısa açıklama (kart) → örnek (sahne kendisi oynar) → sıra sende (görev). Görev bitmeden "Devam" açılmaz.
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DERSLER, type DersId, type Topic } from "@/lib/dersler";
import { setProg, toggleSaved, useSaved } from "@/lib/store";
import { kartVideolari, sureYaz, type Video } from "@/lib/videolar";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html, href, Logo } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import VideoPlayer from "./VideoPlayer";
import Etk from "./Etk";
import { Belir, CanliSvg, SiraliMetin, useCanliSvg } from "./canli";
import { konuOyunlari } from "@/lib/oyunlar";
import type { Adim, AdimliDers } from "@/lib/adimli";
import { AdimGorunum, type Bildirim } from "./DersMotoru";

/** Akıştaki öğe: konu kartı ya da etkileşimli adım. */
type Oge = { tur: "kart"; k: number } | { tur: "adim"; a: Adim; n: number };

type State = { i: number; q: number; picked: number | null; right: number };
const START: State = { i: 0, q: -1, picked: null, right: 0 };

export default function Lesson({
  ders, id, t, next, adimli,
}: { ders: DersId; id: string; t: Topic; next?: { id: string; title: string }; adimli?: AdimliDers }) {
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
  const tamamlar = useMemo(() => ogeler.map((_, j) => () => setBiten((b) => (b.has(j) ? b : new Set(b).add(j)))), [ogeler]);
  const [play, setPlay] = useState<Video | null>(null);
  const yon = useRef<1 | -1>(1); // kart geçişinin yönü (kayma animasyonu için)
  const saved = useSaved().includes(`${ders}.${id}`);
  const nCards = ogeler.length, nQuiz = t.quiz.length, nKart = t.cards.length;
  const Close = Icon.kapat, Bookmark = Icon.kayit;

  // Videodan gelen bağlantı (?kart=3) dersi o karttan açar; geçersiz değerde ilk kart.
  useEffect(() => {
    const k = Number(new URLSearchParams(location.search).get("kart"));
    const j = ogeler.findIndex((o) => o.tur === "kart" && o.k === k - 1);
    if (Number.isInteger(k) && j >= 0) setS({ ...START, i: j });
  }, [ogeler]);

  useEffect(() => { setProg({ _last: `${ders}.${id}` }); }, [ders, id]);
  useEffect(() => { window.scrollTo(0, 0); }, [s.q]);
  // Yeni kart altta belirince sayfa ona kayar.
  const sonKart = useRef<HTMLElement>(null);
  useEffect(() => {
    if (s.q < 0 && s.i > 0) sonKart.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [s.i, s.q]);
  useEffect(() => {
    if (s.q === nQuiz) setProg({ [`${ders}.${id}`]: `${s.right}/${nQuiz} doğru` });
  }, [s.q, s.right, nQuiz, ders, id]);

  const kilitli = s.q < 0 && ogeler[s.i]?.tur === "adim" && !biten.has(s.i);
  function step(dir: 1 | -1) {
    if (dir > 0 && kilitli) return;
    yon.current = dir;
    setBildirim(null);
    setS((p) => {
      if (p.q < 0) {
        if (dir > 0) return p.i < nCards - 1 ? { ...p, i: p.i + 1 } : { ...p, q: 0 };
        return p; // akışta geri gitmek yok: önceki kartlar yukarıda duruyor
      }
      if (p.q < nQuiz && dir > 0 && p.picked !== null) {
        return { ...p, q: p.q + 1, picked: null };
      }
      return p;
    });
  }
  const pick = (k: number) =>
    setS((p) => (p.picked !== null ? p : { ...p, picked: k, right: p.right + (k === t.quiz[p.q].a ? 1 : 0) }));

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

  const pos = s.q < 0 ? s.i : nCards + s.q;
  let body: React.ReactNode, controls: React.ReactNode = null, key: string;

  if (s.q < 0) {
    const last = s.i === nCards - 1;
    key = "kartlar";
    body = (
      <div className="flex flex-col gap-14" aria-live="polite">
        {adimli && !birlesik && (
          <Link
            href={`/ornek/${adimli.id}/`}
            className="-mb-6 flex items-center gap-3 rounded-2xl bg-acc-soft px-4 py-3.5 transition-transform active:scale-[.99]"
          >
            <span className="grid flex-1 gap-0.5">
              <b className="text-[16px] font-bold">Önce yaparak öğren</b>
              <span className="text-[14px] text-muted-foreground">Etkileşimli ders · {adimli.adimlar.length} adım</span>
            </span>
            <span className="rounded-full bg-acc px-4 py-2 text-[14px] font-bold text-white">Başla</span>
          </Link>
        )}
        {ogeler.slice(0, s.i + 1).map((o, j) =>
          o.tur === "kart" ? (
            <AkisKart
              key={j}
              ref={j === s.i ? sonKart : undefined}
              c={t.cards[o.k]}
              no={o.k + 1}
              toplam={nKart}
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
          ),
        )}
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
        <Button className="w-full" data-next disabled={kilitli} onClick={() => step(1)}>{last ? "Mini teste geç" : "Devam"}</Button>
      </Alt>
    );
  } else if (s.q < nQuiz) {
    const Q = t.quiz[s.q], p = s.picked, ok = p === Q.a;
    key = `q${s.q}`;
    body = (
      <article className="flex flex-col gap-4">
        <span className="text-[13px] font-bold tabular-nums text-acc">Soru {s.q + 1} / {nQuiz}</span>
        <Html as="h2" className={p === null ? "text-[22px]" : "text-lg"} html={Q.q} />
        <div className="grid gap-2">
          {Q.o.map((o, k) => {
            const durum = p === null ? "" : k === Q.a ? "right" : k === p ? "wrong" : "pasif";
            return (
              <motion.button
                key={k}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-[1.5px] bg-card px-3.5 py-3 text-left text-base font-medium transition-colors",
                  durum === "" && "border-border hover:border-border-strong",
                  durum === "right" && "border-good bg-good-soft",
                  durum === "wrong" && "border-bad bg-bad-soft",
                  durum === "pasif" && "border-border opacity-55",
                )}
                disabled={p !== null}
                onClick={() => pick(k)}
                whileTap={p === null ? { scale: 0.98 } : undefined}
                animate={durum === "wrong" ? { x: [0, -5, 5, -3, 0] } : durum === "right" ? { scale: [1, 1.02, 1] } : undefined}
                transition={{ duration: 0.3 }}
              >
                <span
                  className={cn(
                    "grid size-7 flex-none place-items-center rounded-lg text-[13px] font-bold",
                    durum === "right" ? "bg-good text-white" : durum === "wrong" ? "bg-bad text-white" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {"ABCD"[k]}
                </span>
                <Html html={o} />
              </motion.button>
            );
          })}
        </div>
      </article>
    );
    controls = (
      <Alt durum={p === null ? undefined : ok ? "ok" : "no"}>
        <AnimatePresence initial={false}>
          {p !== null && (
            <motion.div
              key="geri"
              aria-live="polite"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <h2 className={cn("mb-0.5 text-lg", ok ? "text-good" : "text-bad")}>{ok ? "Doğru!" : `Doğru cevap ${"ABCD"[Q.a]}`}</h2>
              <Html as="p" className="pb-3 text-[15px] leading-normal" html={Q.e} />
            </motion.div>
          )}
        </AnimatePresence>
        <Button className="w-full" data-next disabled={p === null} onClick={() => step(1)}>
          {s.q === nQuiz - 1 ? "Sonucu gör" : "Sonraki soru"}
        </Button>
      </Alt>
    );
  } else {
    const great = s.right === nQuiz, fine = s.right >= nQuiz / 2;
    key = "son";
    body = (
      <article className="flex flex-col items-center gap-2 pt-6 text-center">
        <Logo className="mb-1 text-[40px]" />
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
        <div className="mt-4 grid w-full gap-2">
          {next && <Button asChild><Link href={href(ders, next.id)}>Sıradaki: {next.title}</Link></Button>}
          {konuOyunlari(ders, id).map((o) => (
            <Button key={o.id} asChild variant="outline"><Link href={`/oyunlar/${o.id}/`}>Oyna: {o.ad}</Link></Button>
          ))}
          <Button variant="outline" onClick={() => { setS(START); setBiten(new Set()); }}>Konuyu tekrar et</Button>
          <Button asChild variant="outline"><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
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

/** Alttaki sabit çubuk: düğmeler ve (testte) renkli geri bildirim. */
function Alt({ durum, children }: { durum?: "ok" | "no"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 -mx-4 mt-auto border-t px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] transition-colors duration-200",
        durum === "ok" ? "border-transparent bg-good-soft" : durum === "no" ? "border-transparent bg-bad-soft" : "border-border bg-card/95 backdrop-blur",
      )}
    >
      {children}
    </div>
  );
}

type Kart = Topic["cards"][number];

/** Akıştaki bir kart. canli: kart yeni açıldı, görsel çizilsin ve yazı sırayla gelsin. */
function AkisKart({ c, no, toplam, vids, canli, oynat, ref }: {
  c: Kart; no: number; toplam: number; vids: Video[]; canli: boolean; oynat: (v: Video) => void; ref?: React.Ref<HTMLElement>;
}) {
  const ilk = useRef(canli).current; // yalnızca ilk açılışta canlandır
  const Bulb = Icon.bulb, Play = Icon.play;
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
          <span className="block text-[13px] font-bold tabular-nums text-acc">{no} / {toplam}</span>
          <Html as="h2" className="text-[22px]" html={c.h} />
        </Kap>
        {ilk ? <SiraliMetin className="text-[17px] leading-relaxed" html={c.p} gecikme={0.45} /> : <Html as="p" className="text-[17px] leading-relaxed" html={c.p} />}
      </div>
      {c.key && (
        <Kap on={ilk} d={metinBitti}>
          <div className="flex items-start gap-2.5 rounded-xl bg-[var(--glow-soft)] px-3.5 py-3 text-[15px] font-semibold [&_svg]:mt-px [&_svg]:size-5 [&_svg]:flex-none">
            <Bulb /><Html html={c.key} />
          </div>
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
