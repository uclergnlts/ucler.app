"use client";
// Adımlı ders motoru (Brilliant tarzı): her adımda büyük, hareketli bir sahne + kısa metin + öğrencinin
// yaptığı bir görev. Geri bildirim alttaki çubukta çıkar; görev bitince "Devam" açılır. Adımlar
// content/adimli/*.json dosyalarından gelir, sahneler components/sahne/ kütüphanesindendir.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { SAHNELER } from "./sahne";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html } from "./temel";
import { Button } from "./ui/button";
import type { Adim, AdimliDers, Gorev, Kontrol, Secenek } from "@/lib/adimli";

type Degerler = Record<string, number>;
/** Alttaki çubukta gösterilen geri bildirim (HTML metin). */
type Bildirim = { ok: boolean; baslik: string; metin: string };
type Bildir = (b: Bildirim | null) => void;

/* ---------- oynatma ---------- */

// T saniyelik sahneyi gerçek zamanda HIZ katı hızlı oynatır.
const HIZ = 1.6;
function useOynat(T: number, bitince: () => void) {
  const [t, setT] = useState(0);
  const [oynuyor, setOynuyor] = useState(false);
  const son = useRef(bitince);
  son.current = bitince;
  useEffect(() => {
    if (!oynuyor) return;
    let id = 0;
    const bas = performance.now();
    const kare = (now: number) => {
      const s = Math.min(((now - bas) / 1000) * HIZ, T);
      setT(s);
      if (s >= T) { setOynuyor(false); son.current(); return; }
      id = requestAnimationFrame(kare);
    };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, [oynuyor, T]);
  const basla = useCallback(() => { setT(0); setOynuyor(true); }, []);
  const sifirla = useCallback(() => setT(0), []);
  return { t, oynuyor, basla, sifirla };
}

/* ---------- yardımcılar ---------- */

const uyar = (v: Degerler, hedef: Record<string, number | [number, number]>) =>
  Object.entries(hedef).every(([k, h]) => (Array.isArray(h) ? v[k] >= h[0] && v[k] <= h[1] : v[k] === h));
const ayni = (a: Degerler, b: Degerler) => Object.keys({ ...a, ...b }).every((k) => a[k] === b[k]);
const gosterim = (k: Kontrol, x: number) =>
  `${k.onek ?? ""}${(x * (k.carpan ?? 1)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}${k.birim ? ` ${k.birim}` : ""}`;

function Secenekler({ secenekler, sinif, kapali, onSec }: { secenekler: Secenek[]; sinif: (k: number) => string; kapali: (k: number) => boolean; onSec: (k: number) => void }) {
  return (
    <div className="opts ad-opts">
      {secenekler.map((s, k) => (
        <button key={k} className={`opt ${sinif(k)}`} aria-label={s.etiket} disabled={kapali(k)} onClick={() => onSec(k)}>
          <Html html={s.yazi} />
        </button>
      ))}
    </div>
  );
}

function Soru({ soru, secenekler, tamam, bildir }: { soru: string; secenekler: Secenek[]; tamam: () => void; bildir: Bildir }) {
  const [yanlis, setYanlis] = useState<number[]>([]);
  const [dogru, setDogru] = useState<number | null>(null);
  return (
    <div className="ad-soru">
      <Html as="p" className="ad-soru-h" html={soru} />
      <Secenekler
        secenekler={secenekler}
        sinif={(k) => (dogru === k ? "right" : yanlis.includes(k) ? "wrong" : "")}
        kapali={(k) => dogru !== null || yanlis.includes(k)}
        onSec={(k) => {
          if (secenekler[k].dogru) { setDogru(k); tamam(); bildir({ ok: true, baslik: "Doğru!", metin: secenekler[k].neden }); }
          else { setYanlis((y) => [...y, k]); bildir({ ok: false, baslik: "Tekrar dene", metin: secenekler[k].neden }); }
        }}
      />
    </div>
  );
}

function Kontroller({ liste, v, set, kapali }: { liste: Kontrol[]; v: Degerler; set: (ad: string, x: number) => void; kapali: boolean }) {
  return (
    <div className="ad-kontroller">
      {liste.map((k) => {
        const x = v[k.ad] ?? k.min, adim = k.adim ?? 1;
        if (k.tur === "anahtar")
          return (
            <button key={k.ad} className={`ad-anahtar ${x ? "acik" : ""}`} aria-pressed={x === 1} disabled={kapali} onClick={() => set(k.ad, x ? 0 : 1)}>
              <span>{k.etiket}</span><i aria-hidden="true" />
            </button>
          );
        if (k.tur === "sayac")
          return (
            <div key={k.ad} className="ad-sayac">
              <span>{k.etiket}</span>
              <button aria-label={`${k.etiket} azalt`} disabled={kapali || x <= k.min} onClick={() => set(k.ad, x - adim)}>−</button>
              <b aria-live="polite">{gosterim(k, x)}</b>
              <button aria-label={`${k.etiket} artır`} disabled={kapali || x >= k.max} onClick={() => set(k.ad, x + adim)}>+</button>
            </div>
          );
        return (
          <label key={k.ad} className="ad-surgu">
            <span>{k.etiket}</span>
            <b>{gosterim(k, x)}</b>
            <input type="range" min={k.min} max={k.max} step={adim} value={x} disabled={kapali} onChange={(e) => set(k.ad, Number(e.target.value))} />
          </label>
        );
      })}
    </div>
  );
}

/* ---------- tek adım ---------- */

function AdimGorunum({ a, tamam, bildir }: { a: Adim; tamam: () => void; bildir: Bildir }) {
  const kayit = SAHNELER[a.sahne.tur];
  const sure = a.sahne.sure ?? 0;
  const g: Gorev = a.gorev;
  const [v, setV] = useState<Degerler>(() => ({ ...(a.deger ?? {}) }));
  const [kosular, setKosular] = useState<Degerler[]>([]);
  const [secim, setSecim] = useState<number | null>(null);
  const vRef = useRef(v);
  vRef.current = v;
  const o = useOynat(sure, () => setKosular((k) => [...k, vRef.current]));

  const set = useCallback(
    (ad: string, x: number) => {
      if (o.oynuyor) return;
      setV((eski) => (kayit?.bagla ? kayit.bagla(ad, x, eski) : { ...eski, [ad]: x }));
      o.sifirla();
    },
    [kayit, o.oynuyor, o.sifirla],
  );

  const sonKosu = kosular.length ? kosular[kosular.length - 1] : null;
  const oynandi = !o.oynuyor && sonKosu !== null && ayni(sonKosu, v);
  const farkli = new Set(kosular.map((k) => JSON.stringify(k))).size;
  const acik = g.tur !== "tahmin" || (secim !== null && (!sure || kosular.length > 0) && !o.oynuyor);
  const hedefte = g.tur === "ayarla" && uyar(v, g.hedef);
  const basari =
    g.tur === "devam" ? true :
    g.tur === "oynat" ? kosular.length > 0 :
    g.tur === "tahmin" ? acik :
    g.tur === "ayarla" ? hedefte && (!sure || oynandi) :
    false;

  useEffect(() => { if (basari) tamam(); }, [basari, tamam]);

  // Ayarla ve tahmin görevlerinin geri bildirimi (seçim sorusu kendi bildirir).
  const ayarlaGeri: Bildirim | null =
    g.tur !== "ayarla" || (sure && !oynandi) ? null :
    hedefte ? { ok: true, baslik: "Oldu!", metin: g.tamam } :
    sure ? (() => {
      const m = kayit?.geri?.(v, a.sahne) ?? { baslik: "Henüz değil", metin: g.ipucu ?? "Değerleri değiştirip yeniden oynat." };
      return { ok: false, ...m };
    })() : null;
  const tahminGeri: Bildirim | null = (() => {
    if (g.tur !== "tahmin" || secim === null || !acik) return null;
    const dk = g.secenekler.findIndex((s) => s.dogru), d = g.secenekler[dk];
    return secim === dk
      ? { ok: true, baslik: "Tahminin doğru!", metin: d.neden }
      : { ok: false, baslik: `Doğrusu: ${d.etiket ?? d.yazi}`, metin: `${g.secenekler[secim].neden} ${d.neden}` };
  })();
  const geri = ayarlaGeri ?? tahminGeri;
  const geriAnahtar = geri ? JSON.stringify(geri) : g.tur === "secim" ? "secim" : "";
  useEffect(() => {
    if (geriAnahtar === "secim") return;
    bildir(geri);
  }, [geriAnahtar]);

  if (!kayit) return <p className="ad-ipucu">Bu sahne bulunamadı: {a.sahne.tur}</p>;
  const C = kayit.C;
  const tahminOncesi = g.tur === "tahmin" && secim === null;

  return (
    <>
      <div className="ad-sahne">
        <C s={a.sahne} v={v} set={set} t={o.t} oynuyor={o.oynuyor} kosular={kosular} secim={secim} />
      </div>

      {a.kontroller && <Kontroller liste={a.kontroller} v={v} set={set} kapali={o.oynuyor} />}

      {sure > 0 && !tahminOncesi && !(g.tur === "tahmin" && !acik) && (
        <button className="ad-oynat" disabled={o.oynuyor} onClick={o.basla}>
          <span aria-hidden="true">{o.oynuyor ? "●" : "▶"}</span> {o.oynuyor ? "Oynuyor" : kosular.length ? "Tekrar oynat" : "Oynat"}
        </button>
      )}

      {g.tur === "secim" && farkli >= (g.kosu ?? 0) && <Soru soru={g.soru} secenekler={g.secenekler} tamam={tamam} bildir={bildir} />}

      {g.tur === "tahmin" && (
        <div className="ad-soru">
          <Html as="p" className="ad-soru-h" html={g.soru} />
          <Secenekler
            secenekler={g.secenekler}
            sinif={(k) => (secim === k ? (acik ? (g.secenekler[k].dogru ? "right" : "wrong") : "sec") : acik && g.secenekler[k].dogru ? "right" : "")}
            kapali={() => secim !== null}
            onSec={(k) => { setSecim(k); if (sure) o.basla(); }}
          />
        </div>
      )}
    </>
  );
}

/* ---------- ders ---------- */

export default function DersMotoru({ ders }: { ders: AdimliDers }) {
  const n = ders.adimlar.length;
  const [i, setI] = useState(0);
  const [biten, setBiten] = useState<boolean[]>(() => ders.adimlar.map(() => false));
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);
  const son = i === n;
  const tamam = useCallback(() => setBiten((b) => (b[i] ? b : b.map((x, k) => (k === i ? true : x)))), [i]);
  const git = (k: number) => { setBildirim(null); setI(k); };
  useEffect(() => { window.scrollTo(0, 0); }, [i]);
  const konu = `/${ders.ders}/${ders.konu}/`;
  const Close = Icon.kapat;
  const A = ders.adimlar[i];
  return (
    <div className="app ad-sayfa" data-ders={ders.ders}>
      <header className="top ad-ust">
        <Link className="ad-kapat" href={konu} aria-label="Dersten çık"><Close /></Link>
        <span className="ad-adimlar" aria-label={`${Math.min(i + 1, n)} / ${n}`}>
          {ders.adimlar.map((_, k) => (
            <i key={k}>
              <motion.b initial={false} animate={{ scaleX: k < i || (k === i && biten[k]) || son ? 1 : 0 }} transition={{ duration: 0.35, ease: "easeOut" }} />
            </i>
          ))}
        </span>
      </header>
      <main className="view ad-govde">
        <AnimatePresence mode="wait" initial={false}>
          {!son ? (
            <motion.article
              className="ad-kart"
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Html as="p" className="ad-metin" html={A.metin} />
              <AdimGorunum a={A} tamam={tamam} bildir={setBildirim} />
            </motion.article>
          ) : (
            <motion.article className="ad-kart" key="son" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <h2 className="ad-bitti">{ders.baslik}: bitti</h2>
              <ul className="ad-ozet">
                {ders.kapanis.map((m, k) => <li key={k} dangerouslySetInnerHTML={{ __html: m }} />)}
              </ul>
              <div className="ad-acts">
                <Button asChild><Link href={konu}>Konunun kartlarına ve testine geç</Link></Button>
                <Button variant="outline" onClick={() => { git(0); setBiten(ders.adimlar.map(() => false)); }}>Baştan başla</Button>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
        {!son && (
          <div className={cn("ad-cubuk", bildirim && (bildirim.ok ? "ok" : "no"))}>
            <AnimatePresence initial={false} mode="popLayout">
              {bildirim && (
                <motion.div
                  className="ad-mesaj"
                  aria-live="polite"
                  key={bildirim.baslik + bildirim.metin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Html as="h2" html={bildirim.baslik} />
                  <Html as="p" html={bildirim.metin} />
                </motion.div>
              )}
            </AnimatePresence>
            <Button className="w-full" disabled={!biten[i]} onClick={() => git(i + 1)}>
              {i === n - 1 ? "Bitir" : "Devam"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
