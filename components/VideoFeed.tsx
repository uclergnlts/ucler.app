"use client";
// Videolar sekmesi: Shorts/Reels gibi dikey video akışı: ekrana gelen video sessiz başlar; ses düğmesi sesi açar ve kapatır.
// Her videonun altında asıl konusuna ve kartına giden "Konuya git" bağlantısı vardır.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DERSLER } from "@/lib/dersler";
import { sureYaz, VIDEOLAR, yerHref, type Video } from "@/lib/videolar";
import Cevap from "./Cevap";
import { Icon } from "./icons";
import { PageHead, Top } from "./ui";

function Reel({ v, muted, onSound }: { v: Video; muted: boolean; onSound: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const y = v.yerler[0];
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    // Başka sayfaya geçilince React videoyu kaldırır ama tarayıcı onu arkada çalmaya devam ettirir.
    return () => {
      io.disconnect();
      el.pause();
    };
  }, []);
  const SesAcik = Icon.sesAcik, SesKapali = Icon.sesKapali;
  return (
    <section className="reel" id={v.id} data-ders={y.ders}>
      <div className="reel-v">
        <video ref={ref} src={v.src} poster={v.poster} muted={muted} loop playsInline preload="metadata" onClick={onSound} />
        <button className="reel-sound" onClick={onSound} aria-pressed={!muted} aria-label={muted ? "Sesi aç" : "Sesi kapat"}>
          {muted ? <SesKapali /> : <SesAcik />}
          {muted ? "Sesi aç" : "Sesi kapat"}
        </button>
      </div>
      <div className="reel-cap">
        <span>
          <b>{v.baslik}</b>
          <span className="s">{DERSLER[y.ders].ad} · {sureYaz(v.sure)}</span>
          <Cevap v={v} />
        </span>
        <button className="reel-sound2" onClick={onSound} aria-pressed={!muted} aria-label={muted ? "Sesi aç" : "Sesi kapat"}>
          {muted ? <SesKapali /> : <SesAcik />}
        </button>
        <Link className="btn main" href={yerHref(y)}>Konuya git</Link>
      </div>
    </section>
  );
}

export default function VideoFeed() {
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
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
    <div className="feed">
      {VIDEOLAR.map((v) => <Reel key={v.id} v={v} muted={muted} onSound={() => setMuted((m) => !m)} />)}
    </div>
  );
}
