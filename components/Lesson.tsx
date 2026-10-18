"use client";
// Ders ekranı: kartlar -> 4 soruluk mini test -> sonuç.
// Kaydırma (swipe) ve sağ/sol ok tuşlarıyla kartlar arasında gezilir.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { konuOyunlari } from "@/lib/oyunlar";

type State = { i: number; q: number; picked: number | null; right: number };
const START: State = { i: 0, q: -1, picked: null, right: 0 };

export default function Lesson({
  ders, id, t, next,
}: { ders: DersId; id: string; t: Topic; next?: { id: string; title: string } }) {
  const [s, setS] = useState<State>(START);
  const [play, setPlay] = useState<Video | null>(null);
  const yon = useRef<1 | -1>(1); // kart geçişinin yönü (kayma animasyonu için)
  const saved = useSaved().includes(`${ders}.${id}`);
  const nCards = t.cards.length, nQuiz = t.quiz.length;
  const Back = Icon.back, Close = Icon.kapat, Bookmark = Icon.kayit, Bulb = Icon.bulb, Play = Icon.play;

  // Videodan gelen bağlantı (?kart=3) dersi o karttan açar; geçersiz değerde ilk kart.
  useEffect(() => {
    const k = Number(new URLSearchParams(location.search).get("kart"));
    if (Number.isInteger(k) && k >= 1 && k <= nCards) setS({ ...START, i: k - 1 });
  }, [nCards]);

  useEffect(() => { setProg({ _last: `${ders}.${id}` }); }, [ders, id]);
  useEffect(() => { window.scrollTo(0, 0); }, [s.i, s.q]);
  useEffect(() => {
    if (s.q === nQuiz) setProg({ [`${ders}.${id}`]: `${s.right}/${nQuiz} doğru` });
  }, [s.q, s.right, nQuiz, ders, id]);

  function step(dir: 1 | -1) {
    yon.current = dir;
    setS((p) => {
      if (p.q < 0) {
        if (dir > 0) return p.i < nCards - 1 ? { ...p, i: p.i + 1 } : { ...p, q: 0 };
        return p.i > 0 ? { ...p, i: p.i - 1 } : p;
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

  // Kaydırma: yalnızca kartlarda
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    // Etkileşimli görseldeki sürgüyü kaydırmak kart değiştirmesin.
    if ((e.target as Element).closest(".etk")) return;
    if (s.q < 0) touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touch.current;
    touch.current = null;
    if (!st) return;
    const dx = e.changedTouches[0].clientX - st.x, dy = e.changedTouches[0].clientY - st.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  const pos = s.q < 0 ? s.i : nCards + s.q;
  let body: React.ReactNode, controls: React.ReactNode = null, key: string;

  if (s.q < 0) {
    const c = t.cards[s.i], last = s.i === nCards - 1, vids = kartVideolari(ders, id, s.i + 1);
    key = `c${s.i}`;
    body = (
      <article className="flex flex-col gap-4" aria-live="polite">
        {c.etk ? <Etk key={s.i} e={c.etk} svg={c.svg} /> : <div className="visual" dangerouslySetInnerHTML={{ __html: c.svg }} />}
        <div className="grid gap-1.5">
          <span className="text-[13px] font-bold tabular-nums text-acc">{s.i + 1} / {nCards}</span>
          <Html as="h2" className="text-[22px]" html={c.h} />
          <Html as="p" className="text-[17px] leading-relaxed" html={c.p} />
        </div>
        {c.key && (
          <div className="flex items-start gap-2.5 rounded-xl bg-[var(--glow-soft)] px-3.5 py-3 text-[15px] font-semibold [&_svg]:mt-px [&_svg]:size-5 [&_svg]:flex-none">
            <Bulb /><Html html={c.key} />
          </div>
        )}
        {vids.map((v) => (
          <button
            key={v.id}
            onClick={() => setPlay(v)}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2 pr-3 text-left transition-transform active:scale-[.99]"
          >
            <span className="relative grid h-14 w-10 flex-none place-items-center overflow-hidden rounded-lg bg-acc">
              {v.poster && <img src={v.poster} alt="" className="absolute inset-0 size-full object-cover" />}
              <span className="relative grid size-6 place-items-center rounded-full bg-white/90 text-foreground [&_svg]:size-3.5"><Play /></span>
            </span>
            <span><b className="block text-[15px] leading-snug font-semibold">{v.baslik}</b><span className="block text-[13px] text-muted-foreground">Kısa video · {sureYaz(v.sure)}</span></span>
          </button>
        ))}
      </article>
    );
    controls = (
      <Alt>
        <div className="grid grid-cols-[auto_1fr] gap-2.5">
          <Button variant="outline" className="w-12 px-0" data-prev disabled={s.i === 0} aria-label="Önceki kart" onClick={() => step(-1)}><Back /></Button>
          <Button data-next onClick={() => step(1)}>{last ? "Mini teste geç" : "Devam"}</Button>
        </div>
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
          <Button variant="outline" onClick={() => setS(START)}>Konuyu tekrar et</Button>
          <Button asChild variant="outline"><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
        </div>
      </article>
    );
  }

  return (
    <div className="app" data-ders={ders} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
        <AnimatePresence mode="wait" initial={false} custom={yon.current}>
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
