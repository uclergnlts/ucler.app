"use client";
// Ders ekranı: konu girişi (aşamalar) -> aşama aşama kartlar -> 4 soruluk mini test -> sonuç.
// Kartlar 2-4 aşamaya bölünür (lib/asama.ts). Aşamalar sırayla açılır; konunun ortasında çıkan öğrenci kaldığı
// karttan devam eder (lib/store.ts "yer"). Mini test aşamalar bitmeden de istenirse çözülebilir.
// Her "Devam" yeni bir sayfa açar (Üçler 2026-10-23): kartlar alt alta birikmez, telefonda uzun kaydırma olmaz.
// Üstteki geri okuyla bir önceki sayfaya dönülür. Yeni kartta görsel parça parça çizilir, yazı cümle cümle gelir.
// Etkileşimli adımları "kart" alanıyla yerleştirilmiş konularda adımlar anlatımın içinde, ilgili karttan hemen
// sonra gelir: kısa açıklama (kart) → örnek (sahne kendisi oynar) → sıra sende (görev). Görev bitmeden "Devam" açılmaz.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DERSLER, secmeli, type DersId, type Entry, type Topic } from "@/lib/dersler";
import {
  asamaBitir, ipucuGoruldu, setProg, toggleAnlamadim, toggleSaved, useAnlamadim, useAsama, useDurumlar, useIpucu, useProg, useSaved, useTarayici, useYer,
  yanlisKaydet, yerYaz,
} from "@/lib/store";
import { asamalar, kartinAsamasi, sureDk } from "@/lib/asama";
import { acik, atlamaUnitesi, bekledigi, GECME, siradaki, uniteHref } from "@/lib/kilit";
import { kaydet, PUAN } from "@/lib/puan";
import { olay } from "@/lib/olay";
import { kartVideolari, sureYaz, type Video } from "@/lib/videolar";
import { Icon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html, href } from "./temel";
import { Button } from "./ui/button";
import VideoPlayer from "./VideoPlayer";
import Etk from "./Etk";
import { Belir, CanliSvg, SiraliMetin, useCanliSvg } from "./canli";
import type { Adim, AdimliDers } from "@/lib/adimli";
import { AdimGorunum, Soru as KartSoru, type Bildirim } from "./DersMotoru";
import { ses } from "@/lib/ses";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import AsamaYolu, { type YolDugum } from "./AsamaYolu";
import { Konfeti, Madalya, PuanRozet } from "./Kutlama";

/** Akıştaki öğe: konu kartı ya da etkileşimli adım. */
type Oge = { tur: "kart"; k: number } | { tur: "adim"; a: Adim; n: number };

/** a: aşama (-1: konu girişi), ara: aşama bitti ekranı, i: akıştaki öğe (o an açık sayfa), en: aşamada açılmış en ileri öğe, q: test sorusu (-1: test başlamadı),
 * cevap: test sorusunda öğrencinin kurduğu cevap, sonuc: değerlendirildiyse doğru mu (null: henüz değil),
 * odul: aşama ya da konu bitince kazanılan puan (ilk kez bitiyorsa), cevaplar: testte her sorunun doğru olup olmadığı. */
type State = { a: number; ara: boolean; i: number; en: number; q: number; cevap: Cevap; sonuc: boolean | null; right: number; odul: number; cevaplar: boolean[] };
const START: State = { a: -1, ara: false, i: 0, en: 0, q: -1, cevap: null, sonuc: null, right: 0, odul: 0, cevaplar: [] };

export default function Lesson({
  ders, id, t, next, adimli, on = [], list,
}: { ders: DersId; id: string; t: Topic; next?: { id: string; title: string }; adimli?: AdimliDers; on?: { id: string; title: string }[]; list: Entry[] }) {
  const [s, setS] = useState<State>(START);
  // Adımların hepsi bir karta yerleştirilmişse anlatımın içine girer (şu an 85 konunun hepsinde böyle).
  const birlesik = !!adimli?.adimlar.length && adimli.adimlar.every((a) => a.kart);
  // "Soru önce" derslerde adım kartından önce gelir: öğrenci önce dener, kart sonra adını koyar.
  const soruOnce = birlesik && adimli!.soruOnce === true;
  const ogeler = useMemo(() => {
    const out: Oge[] = [];
    t.cards.forEach((_, k) => {
      if (!soruOnce) out.push({ tur: "kart", k });
      if (birlesik) adimli!.adimlar.forEach((a, n) => { if (a.kart === k + 1) out.push({ tur: "adim", a, n }); });
      if (soruOnce) out.push({ tur: "kart", k });
    });
    return out;
  }, [t, adimli, birlesik, soruOnce]);
  const [biten, setBiten] = useState<Set<number>>(() => new Set());
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);
  // Akıştaki görevlerin geri bildirimi: alttaki çubuk + doğru/yanlış sesi ve titreşim.
  const bildir = useCallback((b: Bildirim | null) => { setBildirim(b); if (b) ses(b.ok ? "dogru" : "yanlis"); }, []);
  // Görev bir kez puan getirir; sahne "tamam"ı birden çok kez çağırabilir.
  const sayilan = useRef(new Set<number>());
  const tamamlar = useMemo(() => ogeler.map((_, j) => () => {
    if (!sayilan.current.has(j)) { sayilan.current.add(j); kaydet("adim", 1, PUAN.adim); }
    setBiten((b) => (b.has(j) ? b : new Set(b).add(j)));
  }), [ogeler]);
  const [play, setPlay] = useState<Video | null>(null);
  const yon = useRef<1 | -1>(1); // kart geçişinin yönü (kayma animasyonu için)
  const saved = useSaved().includes(`${ders}.${id}`);
  const prog = useProg(), anlamadim = useAnlamadim(), yerler = useYer(), ipucu = useIpucu();
  const eksik = on.filter((o) => !prog[`${ders}.${o.id}`]);
  const nCards = ogeler.length, nQuiz = t.quiz.length, nKart = t.cards.length;
  // Her aşamanın akıştaki öğe aralığı [ilk, son): aşamanın ilk kartından sonraki aşamanın ilk kartına kadar.
  // "Soru önce" derste kartın adımları karttan önce gelir; aşama bu adımlarla başlar.
  const asamaOge = useMemo(() => {
    const yer = (k: number) => (k >= nKart ? ogeler.length : ogeler.findIndex((o) => (o.tur === "kart" && o.k === k) || (o.tur === "adim" && o.a.kart === k + 1)));
    return asamalar(nKart).map(([b, e]) => [yer(b), yer(e)] as const);
  }, [ogeler, nKart]);
  const nAsama = asamaOge.length, konuKey = `${ders}.${id}`;
  // Testi bitmiş konuda bütün aşamalar bitmiş sayılır (aşamalardan önce bitirilen konular dahil).
  const asamaDurum = useAsama();
  const bitenA = prog[konuKey] ? nAsama : Math.min(asamaDurum[konuKey] ?? 0, nAsama);
  // Kaldığın yer: yalnızca hâlâ geçerliyse (var olan bir aşama, aşamanın içinde bir öğe).
  const kayitliYer = yerler[konuKey];
  const yer = kayitliYer && kayitliYer.a >= 0 && kayitliYer.a < nAsama && kayitliYer.i > asamaOge[kayitliYer.a][0] && kayitliYer.i < asamaOge[kayitliYer.a][1] ? kayitliYer : undefined;
  const [ilkOge, sonOge] = s.a >= 0 && s.a < nAsama ? asamaOge[s.a] : [0, 0];
  const Close = Icon.kapat, Bookmark = Icon.kayit, Geri = Icon.back;

  // Konular sırayla açılır (lib/kilit.ts). Sunucuda ve ilk çizimde cihazdaki ilerleme bilinmediği için konu açık sayılır;
  // bu yüzden ilerleme yazan her şey ayrıca "acikKesin"i bekler (kilitli konu kendi yan etkisiyle açılmasın).
  const durumlar = useDurumlar(), tarayici = useTarayici();
  const kapali = tarayici && !acik(list, id, durumlar);
  const acikKesin = tarayici && !kapali;

  // Videodan gelen bağlantı (?kart=3) dersi o karttan açar; geçersiz değerde ilk kart. Kilitli konuda uygulanmaz.
  const kartUygulandi = useRef(false);
  useEffect(() => {
    if (!tarayici || kartUygulandi.current) return;
    kartUygulandi.current = true;
    if (kapali) return;
    const k = Number(new URLSearchParams(location.search).get("kart"));
    const j = ogeler.findIndex((o) => o.tur === "kart" && o.k === k - 1);
    if (Number.isInteger(k) && k > 0 && j >= 0) setS({ ...START, a: kartinAsamasi(nKart, k - 1), i: j, en: j });
  }, [ogeler, nKart, tarayici, kapali]);
  useEffect(() => { if (tarayici && !kapali) setProg({ _last: `${ders}.${id}` }); }, [ders, id, tarayici, kapali]);
  // Her sayfa en üstten açılır.
  useEffect(() => { window.scrollTo(0, 0); }, [s.q, s.a, s.ara, s.i]);
  useEffect(() => {
    if (acikKesin && s.q === nQuiz) setProg({ [`${ders}.${id}`]: `${s.right}/${nQuiz} doğru` });
  }, [acikKesin, s.q, s.right, nQuiz, ders, id]);
  // Akışta ilerledikçe kaldığın yer yazılır; aşama bitince silinir.
  useEffect(() => {
    if (!acikKesin) return;
    if (s.q < 0 && s.a >= 0 && !s.ara) yerYaz(konuKey, s.i > ilkOge ? { a: s.a, i: s.i } : null);
    else if (s.ara) yerYaz(konuKey, null);
  }, [acikKesin, s.q, s.a, s.ara, s.i, ilkOge, konuKey]);

  const akista = s.q < 0 && s.a >= 0 && !s.ara;
  const soruBekler = (j: number) => { const o = ogeler[j]; return o?.tur === "kart" && !!t.cards[o.k].once && !biten.has(j); };
  const kilitli = akista && (ogeler[s.i]?.tur === "adim" || soruBekler(s.i)) && !biten.has(s.i);
  /** Aşamayı (ya da testi) baştan açar; kaldığın yer o aşamadaysa oradan. */
  const asamaAc = (a: number) => {
    yon.current = 1;
    setBildirim(null);
    if (a < nAsama && yer?.a === a) return setS({ ...START, a, i: yer.i, en: yer.i });
    setS(a < nAsama ? { ...START, a, i: asamaOge[a][0], en: asamaOge[a][0] } : { ...START, a: nAsama, q: 0, cevap: ilkCevap(t.quiz[0]) });
  };
  /** Geri: aşamanın içinde bir önceki sayfa; aşamanın ilk sayfasında konu girişi (aşama yolu). */
  function geri() {
    yon.current = -1;
    setBildirim(null);
    if (s.i > ilkOge) setS({ ...s, i: s.i - 1 });
    else setS(START);
  }
  // Puan yan etkileri setS'in dışında, olay anında yazılır.
  function step(dir: 1 | -1) {
    if (dir < 0) return akista ? geri() : undefined;
    if (kilitli || !acikKesin) return;
    yon.current = dir;
    setBildirim(null);
    if (akista && s.i === ilkOge + 1) ipucuGoruldu("akis");
    if (s.q < 0 && s.a < 0) return asamaAc(prog[konuKey] ? 0 : yer ? yer.a : bitenA);
    if (s.ara) return asamaAc(s.a + 1);
    if (akista) {
      if (ogeler[s.i].tur === "kart") kaydet("kart", 1, PUAN.kart);
      if (s.i < sonOge - 1) return setS({ ...s, i: s.i + 1, en: Math.max(s.en, s.i + 1) });
      // Puan yalnızca aşama ilk kez bittiğinde; görev sayacı tekrarda da ilerler.
      const ilk = s.a === bitenA && asamaBitir(konuKey, s.a);
      kaydet("asama", 1, ilk ? PUAN.asama : 0);
      ses("bitti");
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
    ses(ok ? "dogru" : "yanlis");
    setS((p) => (p.sonuc !== null ? p : { ...p, cevap, sonuc: ok, right: p.right + (ok ? 1 : 0), cevaplar: [...p.cevaplar, ok] }));
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
  let body: React.ReactNode, controls: React.ReactNode = null, key: string;
  const SoruI = Icon.soru;

  if (s.q < 0 && s.a < 0) {
    // Konu girişi: aşamalar sırayla açılır.
    key = "giris";
    const testAcik = bitenA >= nAsama;
    body = (
      <div className="flex flex-col gap-5">
        <section className="grid gap-2">
          <h1 className="text-[26px]">{t.title}</h1>
          <Html as="p" className="text-[15px] text-muted-foreground" html={t.summary} />
          <span className="text-[14px] font-semibold text-muted-foreground">{nAsama} aşama + mini test · yaklaşık {sureDk(nKart, adimli?.adimlar.length ?? 0, nQuiz)} dk</span>
        </section>
        {eksik.length > 0 && (
          <p className="-mt-2 text-[14px] text-muted-foreground">
            Önce şuna bakman iyi olur:{" "}
            {eksik.map((o, k) => (
              <span key={o.id}>{k > 0 && ", "}<Link href={href(ders, o.id)} className="font-semibold text-acc">{o.title}</Link></span>
            ))}
          </p>
        )}
        <div className="pt-8 pb-2">
          <AsamaYolu
            balon={prog[konuKey] ? "Yeniden" : bitenA === 0 && !yer ? "Başla" : "Devam"}
            dugumler={[
              ...asamalar(nKart).map(([b], a) => ({
                baslik: `${a + 1}. aşama`,
                alt: t.cards[b].h,
                durum: (prog[konuKey] ? (a === 0 ? "sirada" : "bitti") : a < bitenA ? "bitti" : a === bitenA ? "sirada" : "kilitli") as YolDugum["durum"],
                ac: () => asamaAc(a),
              })),
              {
                baslik: "Mini test",
                alt: prog[konuKey] ? `Son sonuç: ${prog[konuKey]}` : testAcik ? `${nQuiz} soru` : `${nQuiz} soru · istersen hemen çöz`,
                durum: (prog[konuKey] ? "bitti" : testAcik ? "sirada" : "kilitli") as YolDugum["durum"],
                test: true,
                // Konuyu bilen öğrenci aşamaları beklemeden kendini sınayabilsin.
                serbest: true,
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
          {prog[konuKey] ? "Baştan başla" : yer ? "Kaldığın yerden devam et" : bitenA === 0 ? "Başla" : testAcik ? "Mini teste geç" : `${bitenA + 1}. aşamadan devam et`}
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
    // Tek sayfa: yalnızca açık öğe. Geri dönülen sayfada cevaplanmış soru cevaplı, görsel canlandırmasız görünür.
    const o = ogeler[s.i], j = s.i, yeni = j >= s.en;
    key = `a${s.a}.${j}`;
    body = (
      <div aria-live="polite">
        {o.tur === "kart" ? (
          <AkisKart
            c={t.cards[o.k]}
            vids={kartVideolari(ders, id, o.k + 1)}
            canli={yeni}
            oynat={setPlay}
            cevaplandi={biten.has(j) || j < s.en}
            soruGoster
            tamam={tamamlar[j]}
            bildir={bildir}
          />
        ) : (
          <article data-akis className="ad-kart ad-akista">
            <SiraliMetin className="ad-metin" html={o.a.metin} gecikme={yeni ? 0.1 : 0} aralik={yeni ? 0.35 : 0} />
            <AdimGorunum a={o.a} tamam={tamamlar[j]} bildir={bildir} />
          </article>
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
        {!bildirim && s.i === ilkOge + 1 && !ipucu.includes("akis") && (
          // Bir kez gösterilir: önceki sayfaya üstteki geri okuyla dönülür, anlamadım simgesi sağ üstte.
          <p className="pb-2.5 text-[13px] text-muted-foreground">Önceki sayfaya üstteki okla dönebilirsin. Anlamadığın kartta sağ üstteki ? simgesine dokun.</p>
        )}
        <Button className="w-full" data-next disabled={kilitli} onClick={() => step(1)}>{kilitli ? (soruBekler(s.i) ? "Bir cevap seç" : gorevYazisi(ogeler[s.i])) : last ? "Aşamayı bitir" : "Devam"}</Button>
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
            {sonuc === null ? "Bir cevap seç" : s.q === nQuiz - 1 ? "Sonucu gör" : "Sonraki soru"}
          </Button>
        )}
      </Alt>
    );
  } else {
    // Sonuç: konfeti yalnızca hepsi doğruysa, kupa en çok bir yanlışta; düşük puanda sade metin. Altta soruların özeti.
    const great = s.right === nQuiz, iyi = s.right >= nQuiz - 1, yanlis = nQuiz - s.right;
    key = "son";
    const Check = Icon.check, Kapat = Icon.kapat;
    body = (
      <article className="flex flex-col items-center gap-2 pt-4 text-center">
        {great && <Konfeti />}
        {iyi && <Madalya kupa />}
        <motion.div
          className="font-display text-[56px] leading-none font-extrabold text-acc"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        >
          {s.right}/{nQuiz}
        </motion.div>
        <h2 className="text-[22px]">{great ? "Harika, hepsi doğru!" : iyi ? "Çok iyi, bir yanlışın var." : "Testi bitirdin."}</h2>
        {s.odul > 0 && <PuanRozet puan={s.odul} />}
        {yanlis > 0 && (
          <p className="mt-1 text-[14px] text-muted-foreground">
            Yanlışların tekrar sırana eklendi; yarın Ana sayfadaki Tekrar bölümünde karşına çıkacak.
          </p>
        )}
        <ol className="mt-3 grid w-full divide-y divide-border rounded-2xl border border-border text-left" aria-label="Soruların sonucu">
          {t.quiz.map((q, j) => {
            const ok = s.cevaplar[j];
            return (
              <li key={j} className="flex items-start gap-3 px-3.5 py-3">
                <span
                  className={cn("mt-0.5 grid size-6 flex-none place-items-center rounded-full text-white [&_svg]:size-3.5 [&_svg]:stroke-[3]", ok ? "bg-good" : "bg-bad")}
                  role="img"
                  aria-label={ok ? "Doğru" : "Yanlış"}
                >
                  {ok ? <Check /> : <Kapat />}
                </span>
                <span className="grid min-w-0 gap-0.5">
                  <Html as="span" className="line-clamp-2 text-[14px] leading-snug font-medium" html={q.q} />
                  {!ok && secmeli(q) && (
                    <span className="text-[13px] text-muted-foreground">Doğru cevap: <Html as="span" className="font-semibold text-foreground" html={q.o[q.a]} /></span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        {/* Konfeti düğmelerin arkasında kalsın. */}
        <div className="relative z-30 mt-4 grid w-full gap-2">
          {yanlis ? (
            <Button onClick={() => asamaAc(nAsama)}>Testi yeniden çöz</Button>
          ) : next ? (
            <Button asChild><Link href={href(ders, next.id)}>Sıradaki: {next.title}</Link></Button>
          ) : (
            <Button asChild><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => { yon.current = -1; setS(START); }}>Aşamalara dön</Button>
            {yanlis && next
              ? <Button asChild variant="ghost"><Link href={href(ders, next.id)}>Sıradaki konu</Link></Button>
              : <Button asChild variant="ghost"><Link href={href(ders)}>{DERSLER[ders].ad} konuları</Link></Button>}
          </div>
        </div>
      </article>
    );
  }

  if (kapali) {
    const bu = list.find((e) => e.id === id)!, once = bekledigi(list, id), sira = siradaki(list, durumlar), testU = atlamaUnitesi(list, bu, durumlar);
    const Kilit = Icon.kilit;
    return (
      <div className="app" data-ders={ders}>
        <header className="top gap-3">
          <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href={href(ders)} aria-label="Konulara dön"><Close /></Link></Button>
          <span className="truncate font-display text-[15px] font-extrabold">{t.title}</span>
        </header>
        <main className="view pt-6">
          <article className="flex flex-col items-center gap-3 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-muted-foreground [&_svg]:size-8"><Kilit /></span>
            <h1 className="text-[24px]">Bu konu henüz kilitli</h1>
            <p className="text-[15px] text-muted-foreground">
              Konular birbirinin üzerine kurulu. {once ? <><b className="text-foreground">“{once.title}”</b> konusunu bitirince bu konu açılır.</> : null}
              {testU && <> Bu bölümü zaten biliyorsan {testU.no}. ünite testinden en az {GECME} alarak ilerleyebilirsin.</>}
            </p>
            <div className="mt-3 grid w-full gap-2">
              {sira && <Button asChild><Link href={href(ders, sira.id)}>Sıradaki konuya git: {sira.title}</Link></Button>}
              {testU && <Button asChild variant="outline"><Link href={uniteHref(ders, testU.no)}>{testU.no}. ünite testini çöz</Link></Button>}
              <Button asChild variant="ghost"><Link href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link></Button>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="app" data-ders={ders}>
      <header className="top gap-3">
        {akista ? (
          // Ders sayfalarında solda geri (önceki sayfa), sağda çıkış.
          <Button variant="ghost" size="icon" className="-ml-2 text-muted-foreground" aria-label="Önceki sayfa" onClick={geri}><Geri /></Button>
        ) : (
          <Button asChild variant="ghost" size="icon" className="-ml-2 text-muted-foreground"><Link href={href(ders)} aria-label="Konudan çık"><Close /></Link></Button>
        )}
        <div className="grid min-w-0 flex-1 gap-1.5">
          <span className="truncate font-display text-[15px] font-extrabold">{t.title}</span>
          <AsamaCubugu dolu={[
            ...asamaOge.map(([b, e], a) =>
              s.q < 0 && s.a === a && !s.ara ? (s.i - b + 1) / (e - b) : a < bitenA || (s.a > a && s.q < 0) || (s.ara && s.a === a) ? 1 : 0),
            prog[konuKey] && s.q < 0 ? 1 : s.q >= 0 ? (s.q + (s.sonuc !== null ? 1 : 0)) / nQuiz : 0,
          ]} />
        </div>
        {akista && sonKartNo > 0 && (
          // Son okunan kartı "anlamadım" diye işaretler (Profil'de listelenir).
          <Button
            variant="ghost"
            size="icon"
            className={cn("-mr-1", anlamadimMi ? "text-acc" : "text-muted-foreground")}
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
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(akista ? "" : "-mr-2", saved ? "text-acc [&_svg]:fill-current" : "text-muted-foreground")}
          aria-pressed={saved}
          aria-label="Konuyu kaydet"
          title="Konuyu kaydet"
          onClick={() => toggleSaved(`${ders}.${id}`)}
        >
          <Bookmark />
        </Button>
        {akista && <Button asChild variant="ghost" size="icon" className="-mr-2 text-muted-foreground"><Link href={href(ders)} aria-label="Konudan çık"><Close /></Link></Button>}
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

/** Görevi bitmemiş adımda pasif "Devam" düğmesinin yazısı: öğrenciye ne yapması gerektiğini söyler. */
function gorevYazisi(o: Oge | undefined) {
  const tur = o?.tur === "adim" ? o.a.gorev.tur : "";
  return tur === "secim" || tur === "tahmin" ? "Bir cevap seç" : tur === "ayarla" ? "Değerleri hedefe getir" : tur === "kesfet" ? "Önce bulguları keşfet" : tur === "oynat" ? "Önce sahneyi oynat" : "Devam";
}

/** Konu ilerleme çubuğu: her aşama ve mini test ayrı bir parça; parçalar kendi içinde dolar. */
function AsamaCubugu({ dolu }: { dolu: number[] }) {
  const toplam = dolu.reduce((a, b) => a + Math.min(1, b), 0);
  return (
    <div className="flex gap-1" role="progressbar" aria-label="Konu ilerlemesi" aria-valuenow={Math.round((100 * toplam) / dolu.length)} aria-valuemin={0} aria-valuemax={100}>
      {dolu.map((v, k) => (
        <div key={k} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <motion.div className="h-full rounded-full bg-acc" initial={false} animate={{ width: `${Math.max(0, Math.min(1, v)) * 100}%` }} transition={{ type: "spring", stiffness: 260, damping: 32 }} />
        </div>
      ))}
    </div>
  );
}

type Kart = Topic["cards"][number];

/** Akıştaki bir kart. canli: kart yeni açıldı, görsel çizilsin ve yazı sırayla gelsin. */
function AkisKart({ c, vids, canli, oynat, ref, cevaplandi, soruGoster, tamam, bildir }: {
  c: Kart; vids: Video[]; canli: boolean; oynat: (v: Video) => void; ref?: React.Ref<HTMLElement>;
  /** Soru önce kartında: soru cevaplandı mı (anlatım açılır) ve soru görünsün mü (kaldığın yerden dönülen eski kartta görünmez). */
  cevaplandi: boolean; soruGoster: boolean; tamam: () => void; bildir: (b: Bildirim | null) => void;
}) {
  // Yalnızca ilk açılışta canlandır; soru önce kartında anlatım cevaptan sonra açılırken canlanır.
  const ilk = useRef(c.once ? !cevaplandi : canli).current;
  const Play = Icon.play;
  const etkRef = useCanliSvg<HTMLDivElement>();
  const n = c.p.split(/[.!?…]\s/).length;
  const metinBitti = ilk ? 0.55 + n * 0.35 : 0;
  const baslik = <Html as="h2" className="text-[22px]" html={c.h} />;
  // Yöntem akışı anlatımın devamıdır: önce yazı, altında akış.
  const sonraGorsel = !c.once && c.etk?.tur === "yontem";
  // Soru cevaplanınca açılan görsel ve anlatım ekrana gelsin.
  const acilan = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!c.once || !cevaplandi || !ilk) return;
    const z = setTimeout(() => acilan.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    return () => clearTimeout(z);
  }, [c.once, cevaplandi, ilk]);
  const gorsel = c.etk ? (
    <div ref={ilk ? etkRef : undefined}><Etk e={c.etk} svg={c.svg} /></div>
  ) : !c.svg ? null : ilk ? (
    <CanliSvg className="visual" html={c.svg} />
  ) : (
    <div className="visual" dangerouslySetInnerHTML={{ __html: c.svg }} />
  );
  return (
    <article ref={ref} data-akis className="flex scroll-mt-20 flex-col gap-4">
      {c.once ? (
        // Soru önce: başlık ve soru; cevaplanınca görsel ve anlatım altta belirir.
        <>
          {canli && !cevaplandi ? <Belir gecikme={0.05}>{baslik}</Belir> : baslik}
          {soruGoster && (
            <Kap on={canli && !cevaplandi} d={0.2}>
              <KartSoru soru={c.once.soru} secenekler={c.once.secenekler} tamam={tamam} bildir={bildir} />
            </Kap>
          )}
          {cevaplandi && gorsel && <div ref={acilan} className="scroll-mt-20">{gorsel}</div>}
        </>
      ) : (
        !sonraGorsel && gorsel
      )}
      {(!c.once || cevaplandi) && (
        <>
          <div className="grid gap-1.5">
            {!c.once && <Kap on={ilk} d={0.15}>{baslik}</Kap>}
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
        </>
      )}
      {sonraGorsel && <Kap on={ilk} d={metinBitti}>{gorsel}</Kap>}
    </article>
  );
}

/** Yeni açılan kartta parçayı gecikmeyle getirir; eski kartlarda olduğu gibi gösterir. */
function Kap({ on, d, children }: { on: boolean; d: number; children: React.ReactNode }) {
  return on ? <Belir gecikme={d}>{children}</Belir> : <>{children}</>;
}
