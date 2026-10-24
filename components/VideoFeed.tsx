"use client";
// Videolar sekmesi: Reels/Shorts gibi tam ekran dikey akış. Yukarı kaydırınca sıradaki video gelir.
// Ekrana gelen video sesli başlar. Tarayıcı sesli otomatik oynatmayı engellerse (sayfada henüz dokunuş yoksa)
// video sessiz oynar ve "Sesi açmak için dokun" görünür; o durumda ilk dokunuş yalnızca sesi açar.
// Bunun dışında videoya dokunmak durdurur, yeniden dokunmak sürdürür. Videonun altyazısı alt kenara yakın
// olduğu için düğmeler videonun üstüne değil altındaki şeride konur: konunun adı, "Konuya git", "Cevabı gör",
// kaydet, paylaş ve ses.
// Sıra her açılışta karışıktır: önce izlenmemiş videolar, hepsi izlendikten sonra izlenenler yine karışık gelir.
// %80'i izlenen video "izlendi" sayılır; liste tf-izlenen'de tutulur, hesaba eşitlenir.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DERSLER } from "@/lib/dersler";
import { KEYS, read, write } from "@/lib/store";
import { kaydet, PUAN } from "@/lib/puan";
import { VIDEOLAR, yerHref, type Video } from "@/lib/videolar";
import { adres } from "@/lib/site";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { PageHead, UstBar } from "./temel";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Bildir from "./Bildir";
import { useKaydet } from "./KayitDavet";

// Öğrenci bu oturumda sesi açtı mı (ya da bir video sesli oynayabildi mi). Açtıysa akıştaki sonraki videolar
// da sesli başlar; sayfa içinde gezinip Videolar'a dönünce de (bileşen yeniden kurulsa bile) sesli kalır.
const SES_ANAHTAR = "tf-ses";
let sesAcildi: boolean | null = null;
function sesAcildiMi() {
  if (sesAcildi === null) {
    sesAcildi = false;
    try { sesAcildi = sessionStorage.getItem(SES_ANAHTAR) === "1"; } catch {}
  }
  return sesAcildi;
}
function sesiAcildiSay() {
  if (sesAcildiMi()) return;
  sesAcildi = true;
  try { sessionStorage.setItem(SES_ANAHTAR, "1"); } catch {}
}

function karistir<T>(l: T[]) {
  const a = [...l];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function izlendiSay(id: string) {
  const l = read<string[]>(KEYS.izlenen, []);
  if (!l.includes(id)) write(KEYS.izlenen, [...l, id]);
}
/** İzlenmemişler karışık sırayla önde, izlenenler karışık sırayla arkada. Adresteki video (#KIM-03) en başa alınır. */
function siraKur(ilk: string) {
  const izlenen = new Set(read<string[]>(KEYS.izlenen, []));
  const sira = [...karistir(VIDEOLAR.filter((v) => !izlenen.has(v.id))), ...karistir(VIDEOLAR.filter((v) => izlenen.has(v.id)))];
  const i = sira.findIndex((v) => v.id === ilk);
  if (i > 0) sira.unshift(...sira.splice(i, 1));
  return sira;
}

/** muted: öğrencinin ses düğmesiyle kendi seçtiği sessizlik (akış boyunca kalır). */
type Ortak = { muted: boolean; setMuted: (m: boolean) => void; toast: (t: string) => void };

function Reel({ v, konu, active, o }: { v: Video; konu: string; active: boolean; o: Ortak }) {
  const ref = useRef<HTMLVideoElement>(null);
  const izlendi = useRef(false);
  const [paused, setPaused] = useState(true);
  // zorla: tarayıcı sesli oynatmaya izin vermediği için video sessiz oynuyor; ilk dokunuş sesi açar.
  const [zorla, setZorla] = useState(false);
  const [cevap, setCevap] = useState(false);
  const [pct, setPct] = useState(0);
  const [hint, setHint] = useState(false);
  const y = v.yerler[0], key = `${y.ders}.${y.konu}`;
  const { saved, kaydet: konuKaydet, davet } = useKaydet(key, typeof window === "undefined" ? "/videolar/" : location.pathname + location.search + location.hash);
  const sessiz = o.muted || zorla;
  const I = Icon;

  // Yalnızca ekrandaki video oynar; ekrandan çıkan durur ve başa sarılır.
  // Önce sesli oynatılır; tarayıcı engellerse (NotAllowedError) sessiz oynatılır ve ipucu gösterilir.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      setZorla(false);
      el.muted = o.muted;
      el.play().then(
        () => { if (!el.muted) sesiAcildiSay(); },
        (e: unknown) => {
          if ((e as Error)?.name !== "NotAllowedError" || el.muted) return;
          el.muted = true;
          setZorla(true);
          setHint(true);
          el.play().catch(() => {});
        },
      );
    } else {
      el.pause();
      el.currentTime = 0;
      izlendi.current = false;
      setCevap(false);
      setZorla(false);
      setHint(false);
    }
    // o.muted bilerek bağımlılık değil: ses düğmesi oynatmayı baştan başlatmamalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  // Ses durumu videoya yansır (React muted özelliğini her zaman güncellemez).
  useEffect(() => {
    const el = ref.current;
    if (el) el.muted = sessiz;
  }, [sessiz]);
  // "Sesi açmak için dokun" ipucu birkaç saniye görünür; sonra yalnızca alttaki ses düğmesi kalır.
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(false), 2800);
    return () => clearTimeout(t);
  }, [hint]);
  // Başka sayfaya geçilince React videoyu kaldırır ama tarayıcı onu arkada çalmaya devam ettirebilir.
  useEffect(() => () => ref.current?.pause(), []);

  /** Sesi açar (dokunuş sayıldığı için tarayıcı artık izin verir); video oynamayı sürdürür. */
  const sesiAc = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    setZorla(false);
    setHint(false);
    o.setMuted(false);
    sesiAcildiSay();
    if (el.paused) el.play().catch(() => {});
  }, [o]);
  const sesDugmesi = useCallback(() => {
    if (sessiz) sesiAc();
    else o.setMuted(true);
  }, [sessiz, sesiAc, o]);

  /** Videoya dokunuş: sessiz yedek durumdaysa yalnızca sesi açar; değilse durdurur ya da sürdürür. */
  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (zorla) { sesiAc(); return; }
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, [zorla, sesiAc]);

  // Cevap penceresi (shadcn/ui Sheet, Radix Dialog): odak içeride kalır, Escape kapatır, kapanınca odak
  // "Cevabı gör" düğmesine döner. Açıkken akışın kısayolları (oklar, boşluk, m) çalışmaz.

  // Klavye: boşluk durdurur/sürdürür, m sesi açar/kapatır (yalnızca ekrandaki videoda).
  useEffect(() => {
    if (!active || cevap) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element)?.closest?.("textarea,input")) return; // bildirim penceresinde yazarken
      if (e.key === " " && !(e.target as Element)?.closest?.("button,a")) { e.preventDefault(); toggle(); }
      if (e.key === "m") sesDugmesi();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, cevap, toggle, sesDugmesi]);

  async function paylas() {
    const url = adres(`/videolar/#${v.id}`);
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
          muted={sessiz}
          loop
          playsInline
          preload={active ? "auto" : "metadata"}
          onClick={toggle}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onTimeUpdate={(e) => {
            const yuzde = (100 * e.currentTarget.currentTime) / (e.currentTarget.duration || 1);
            setPct(yuzde);
            // Videonun %80'i izlenince bir kez sayılır (video döngüde olduğu için yeniden sayılmaz).
            if (yuzde >= 80 && !izlendi.current) { izlendi.current = true; kaydet("video", 1, PUAN.video); izlendiSay(v.id); }
          }}
        />
        {zorla && active && hint && !cevap && (
          <button className="reel-hint" onClick={sesiAc}><I.sesKapali />Sesi açmak için dokun</button>
        )}
        {active && paused && !zorla && (
          <span className="reel-flash" aria-hidden="true"><I.play /></span>
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
          <button className="reel-ic" onClick={() => { if (konuKaydet()) o.toast(saved ? "Kaydedilenlerden çıkarıldı" : "Konu kaydedildi"); }} aria-pressed={saved} aria-label="Konuyu kaydet">
            <I.kayit />
          </button>
          {davet}
          <Bildir yer={{ ders: y.ders, konu: y.konu, yer: `video ${v.id}`, ozet: v.baslik }}>
            <button className="reel-ic" aria-label="Anlamadım ya da hata var" title="Anlamadım / Hata var"><I.soru /></button>
          </Bildir>
          <button className="reel-ic" onClick={paylas} aria-label="Paylaş"><I.paylas /></button>
          <button className="reel-ic" onClick={sesDugmesi} aria-pressed={!sessiz} aria-label={sessiz ? "Sesi aç" : "Sesi kapat"}>
            {sessiz ? <I.sesKapali /> : <I.sesAcik />}
          </button>
        </div>
      </div>

    </section>
  );
}

export default function VideoFeed({ konular }: { konular: Record<string, string> }) {
  // Videolar sesli başlar; yalnızca öğrenci ses düğmesiyle kapatırsa akış sessiz sürer.
  const [muted, setMuted] = useState(false);
  const [active, setActive] = useState("");
  // Sıra tarayıcıda kurulur (izlenenler listesi ve rastgelelik sunucuda yok); kurulana kadar akış boş kalır.
  const [sira, setSira] = useState<Video[] | null>(null);
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
    const s = siraKur(decodeURIComponent(location.hash.slice(1)));
    setSira(s);
    setActive(s[0]?.id ?? "");
  }, []);

  useEffect(() => {
    const f = feed.current;
    if (!f || !sira) return;
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
  }, [sira]);

  // Klavye: aşağı/yukarı ok sıradaki/önceki video (cevap penceresi açık değilken).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const f = feed.current;
      if (!f || !["ArrowDown", "ArrowUp"].includes(e.key) || (e.target as Element)?.closest?.("textarea")) return;
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
        <UstBar baslik="Videolar" />
        <main className="view">
          <PageHead text="Kısa, dikey konu videoları çok yakında burada. Her videodan ilgili konuya geçebileceksin." />
        </main>
      </div>
    );
  return (
    <div className="feed" ref={feed}>
      <h1 className="sr-only">Videolar</h1>
      {sira?.map((v) => <Reel key={v.id} v={v} konu={konular[v.id]} active={active === v.id} o={o} />)}
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
