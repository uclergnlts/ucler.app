"use client";
// Videolar sekmesi: Reels/Shorts gibi tam ekran dikey akış. Yukarı kaydırınca sıradaki video gelir.
// Ekrana gelen video sessiz başlar (tarayıcılar sesli otomatik oynatmaya izin vermez); ilk dokunuş sesi açar,
// sonraki dokunuşlar durdurur ve sürdürür. Videonun altyazısı alt kenara yakın olduğu için düğmeler videonun
// üstüne değil altındaki şeride konur: konunun adı, "Konuya git", "Cevabı gör", kaydet, paylaş ve ses.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DERSLER } from "@/lib/dersler";
import { toggleSaved, useSaved } from "@/lib/store";
import { kaydet, PUAN } from "@/lib/puan";
import { VIDEOLAR, yerHref, type Video } from "@/lib/videolar";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { PageHead, Top } from "./temel";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

type Ortak = { muted: boolean; setMuted: (m: boolean) => void; toast: (t: string) => void };

function Reel({ v, konu, active, o }: { v: Video; konu: string; active: boolean; o: Ortak }) {
  const ref = useRef<HTMLVideoElement>(null);
  const izlendi = useRef(false);
  const [paused, setPaused] = useState(false);
  const [flash, setFlash] = useState<"play" | "pause" | null>(null);
  const [cevap, setCevap] = useState(false);
  const [pct, setPct] = useState(0);
  const [hint, setHint] = useState(false);
  const y = v.yerler[0], key = `${y.ders}.${y.konu}`;
  const saved = useSaved().includes(key);
  const I = Icon;

  // Yalnızca ekrandaki video oynar; ekrandan çıkan durur ve başa sarılır.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      setPaused(false);
      setHint(true);
      el.play().catch(() => setPaused(true));
    } else {
      el.pause();
      el.currentTime = 0;
      izlendi.current = false;
      setCevap(false);
    }
  }, [active]);
  // "Sesi açmak için dokun" ipucu birkaç saniye görünür; sonra yalnızca alttaki ses düğmesi kalır.
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(false), 2800);
    return () => clearTimeout(t);
  }, [hint]);
  // Başka sayfaya geçilince React videoyu kaldırır ama tarayıcı onu arkada çalmaya devam ettirebilir.
  useEffect(() => () => ref.current?.pause(), []);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (o.muted) {
      o.setMuted(false);
      if (el.paused) el.play().catch(() => {});
      setPaused(false);
      return;
    }
    if (el.paused) { el.play().catch(() => {}); setPaused(false); setFlash("play"); }
    else { el.pause(); setPaused(true); setFlash("pause"); }
  }, [o]);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [flash]);

  // Cevap penceresi (shadcn/ui Sheet, Radix Dialog): odak içeride kalır, Escape kapatır, kapanınca odak
  // "Cevabı gör" düğmesine döner. Açıkken akışın kısayolları (oklar, boşluk, m) çalışmaz.

  // Klavye: boşluk durdurur/sürdürür, m sesi açar/kapatır (yalnızca ekrandaki videoda).
  useEffect(() => {
    if (!active || cevap) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " && !(e.target as Element)?.closest?.("button,a")) { e.preventDefault(); toggle(); }
      if (e.key === "m") o.setMuted(!o.muted);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, cevap, toggle, o]);

  async function paylas() {
    const url = `${location.origin}/videolar/#${v.id}`;
    try {
      if (navigator.share) await navigator.share({ title: v.baslik, url });
      else { await navigator.clipboard.writeText(url); o.toast("Bağlantı kopyalandı"); }
    } catch {}
  }

  return (
    <section className="reel" id={v.id} data-ders={y.ders} aria-label={v.baslik}>
      <div className="reel-v">
        <video
          ref={ref}
          src={v.src}
          poster={v.poster}
          muted={o.muted}
          loop
          playsInline
          preload={active ? "auto" : "metadata"}
          onClick={toggle}
          onTimeUpdate={(e) => {
            const yuzde = (100 * e.currentTarget.currentTime) / (e.currentTarget.duration || 1);
            setPct(yuzde);
            // Videonun %80'i izlenince bir kez sayılır (video döngüde olduğu için yeniden sayılmaz).
            if (yuzde >= 80 && !izlendi.current) { izlendi.current = true; kaydet("video", 1, PUAN.video); }
          }}
        />
        {o.muted && active && hint && !cevap && (
          <button className="reel-hint" onClick={toggle}><I.sesKapali />Sesi açmak için dokun</button>
        )}
        {(flash || (paused && !o.muted)) && (
          <span className="reel-flash" aria-hidden="true">{flash === "play" ? <I.play /> : <I.pause />}</span>
        )}
      </div>

      <div className="reel-info">
        <span className="reel-prog" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
        <span className="k"><b>{DERSLER[y.ders].ad}</b> · {konu || v.baslik}</span>
        <div className="reel-acts">
          <Link className="reel-go" href={yerHref(y)}>Konuya git<I.ileri /></Link>
          {v.cevap && (
            <Sheet open={cevap} onOpenChange={setCevap}>
              <SheetTrigger className="reel-pill">Cevabı gör</SheetTrigger>
              <SheetContent data-ders={y.ders} aria-describedby={undefined}>
                <span className="text-xs font-bold tracking-wide text-acc uppercase">Videonun sorusu</span>
                <SheetTitle>{v.soru}</SheetTitle>
                <p className="mb-1.5 text-base leading-relaxed">{v.cevap}</p>
                <SheetClose asChild><Button variant="outline">Kapat</Button></SheetClose>
              </SheetContent>
            </Sheet>
          )}
          <span className="sp" />
          <button className="reel-ic" onClick={() => { toggleSaved(key); o.toast(saved ? "Kaydedilenlerden çıkarıldı" : "Konu kaydedildi"); }} aria-pressed={saved} aria-label="Konuyu kaydet">
            <I.kayit />
          </button>
          <button className="reel-ic" onClick={paylas} aria-label="Paylaş"><I.paylas /></button>
          <button className="reel-ic" onClick={() => o.setMuted(!o.muted)} aria-pressed={!o.muted} aria-label={o.muted ? "Sesi aç" : "Sesi kapat"}>
            {o.muted ? <I.sesKapali /> : <I.sesAcik />}
          </button>
        </div>
      </div>

    </section>
  );
}

export default function VideoFeed({ konular }: { konular: Record<string, string> }) {
  const [muted, setMuted] = useState(true);
  const [active, setActive] = useState(VIDEOLAR[0]?.id ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const feed = useRef<HTMLDivElement>(null);
  const toast = useCallback((t: string) => setMsg(t), []);
  const o = { muted, setMuted, toast };

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1600);
    return () => clearTimeout(t);
  }, [msg]);

  // Adresteki #KIM-03 o videodan başlatır; ekrandaki video değişince adres de güncellenir (paylaşmak için).
  useEffect(() => {
    const f = feed.current;
    if (!f) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (el) { f.scrollTop = el.offsetTop; setActive(id); }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          setActive(e.target.id);
          history.replaceState(null, "", `#${e.target.id}`);
        }
      }),
      { root: f, threshold: [0.6] },
    );
    f.querySelectorAll(".reel").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  // Klavye: aşağı/yukarı ok sıradaki/önceki video (cevap penceresi açık değilken).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const f = feed.current;
      if (!f || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault();
      // Cevap penceresi açıkken oklar videoyu değiştirmez; uzun cevapta pencerenin kendisini kaydırır.
      const sheet = document.querySelector<HTMLElement>('[data-slot="sheet-content"]');
      if (sheet) { sheet.scrollBy({ top: (e.key === "ArrowDown" ? 1 : -1) * 40 }); return; }
      f.scrollBy({ top: (e.key === "ArrowDown" ? 1 : -1) * f.clientHeight, behavior: "smooth" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!VIDEOLAR.length)
    return (
      <div className="app">
        <Top />
        <main className="view">
          <PageHead title="Videolar" text="Kısa, dikey konu videoları çok yakında burada. Her videodan ilgili konuya geçebileceksin." />
        </main>
      </div>
    );
  return (
    <div className="feed" ref={feed}>
      {VIDEOLAR.map((v) => <Reel key={v.id} v={v} konu={konular[v.id]} active={active === v.id} o={o} />)}
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.18 }}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
