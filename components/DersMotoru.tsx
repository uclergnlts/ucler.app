"use client";
// Adımlı ders motoru (Brilliant tarzı): her adımda büyük, hareketli bir sahne + kısa metin + öğrencinin
// yaptığı bir görev. Geri bildirim alttaki çubukta çıkar; görev bitince "Devam" açılır. Adımlar
// content/adimli/*.json dosyalarından gelir, sahneler components/sahne/ kütüphanesindendir.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./icons";
import { SAHNELER } from "./sahne";
import { rastgele } from "./sahne/ortak";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Html } from "./temel";
import { SiraliMetin, useCanliSvg } from "./canli";
import { Button } from "./ui/button";
import type { Adim, AdimliDers, Gorev, Kontrol, Secenek } from "@/lib/adimli";

type Degerler = Record<string, number>;
/** Alttaki çubukta gösterilen geri bildirim (HTML metin). */
export type Bildirim = { ok: boolean; baslik: string; metin: string };
type Bildir = (b: Bildirim | null) => void;

/** Takılan öğrenci için "Çözümü göster": iki yanlıştan sonra (sahnesi oynamayan ayar görevinde bir süre sonra) çıkar. */
const COZUM_YANLIS = 2, COZUM_SURE = 25000;
function CozumDugmesi({ onClick }: { onClick: () => void }) {
  return <button className="ad-cozum" onClick={onClick}>Çözümü göster</button>;
}

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
  `${k.onek ?? ""}${(x * (k.carpan ?? 1)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}${k.birim ? (k.birim === "°" ? "°" : ` ${k.birim}`) : ""}`;

/** Şıkların gösterim sırası: içerikte doğru şık çoğu zaman ilk yazılır, ekranda karışık çıksın.
 * Sıra şıkların metninden üretilir, yani her açılışta aynıdır. */
function sira(secenekler: Secenek[]) {
  let h = 2166136261;
  for (const ch of secenekler.map((s) => s.yazi).join("|")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = rastgele(h);
  const d = secenekler.map((_, k) => k);
  for (let k = d.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [d[k], d[j]] = [d[j], d[k]]; }
  return d;
}

function Secenekler({ secenekler, sinif, kapali, onSec }: { secenekler: Secenek[]; sinif: (k: number) => string; kapali: (k: number) => boolean; onSec: (k: number) => void }) {
  const d = useMemo(() => sira(secenekler), [secenekler]);
  return (
    <div className="opts ad-opts">
      {d.map((k) => (
        <button key={k} className={`opt ${sinif(k)}`} aria-label={secenekler[k].etiket} disabled={kapali(k)} onClick={() => onSec(k)}>
          <Html html={secenekler[k].yazi} />
        </button>
      ))}
    </div>
  );
}

function Soru({ soru, secenekler, tamam, bildir }: { soru: string; secenekler: Secenek[]; tamam: () => void; bildir: Bildir }) {
  const [yanlis, setYanlis] = useState<number[]>([]);
  const [dogru, setDogru] = useState<number | null>(null);
  const cozum = () => {
    const k = secenekler.findIndex((x) => x.dogru);
    setDogru(k); tamam(); bildir({ ok: true, baslik: "Çözüm", metin: secenekler[k].neden });
  };
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
      {dogru === null && yanlis.length >= COZUM_YANLIS && <CozumDugmesi onClick={cozum} />}
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

/** Kontrolleri başlangıçtan hedefe birkaç karede götüren değer dizisi (örnek ve çözüm gösterimi için). */
function kareler(bas: Degerler, hedef: Degerler, kontroller: Kontrol[] = [], bagla?: (ad: string, x: number, v: Degerler) => Degerler) {
  const out: Degerler[] = [];
  let v = { ...bas };
  for (const [ad, son] of Object.entries(hedef)) {
    const k = kontroller.find((x) => x.ad === ad), adim = k?.adim ?? 1, ilk = v[ad] ?? son;
    const n = Math.max(1, Math.min(8, Math.round(Math.abs(son - ilk) / adim)));
    for (let j = 1; j <= n; j++) {
      const x = j === n ? son : Math.round((ilk + ((son - ilk) * j) / n) / adim) * adim;
      v = bagla ? bagla(ad, x, v) : { ...v, [ad]: x };
      out.push(v);
    }
  }
  return out;
}

export function AdimGorunum({ a, tamam, bildir }: { a: Adim; tamam: () => void; bildir: Bildir }) {
  const sahneRef = useCanliSvg<HTMLDivElement>(250);
  const kayit = SAHNELER[a.sahne.tur];
  const sure = a.sahne.sure ?? 0;
  const g: Gorev = a.gorev;
  const [v, setV] = useState<Degerler>(() => ({ ...(a.deger ?? {}) }));
  const [kosular, setKosular] = useState<Degerler[]>([]);
  const [secim, setSecim] = useState<number | null>(null);
  const vRef = useRef(v);
  vRef.current = v;
  const o = useOynat(sure, () => setKosular((k) => [...k, vRef.current]));

  // Göster: önce sahne örneği kendisi oynar (kontroller örnek değerlere kayar, sahne oynar), sonra sıra öğrenciye geçer.
  const [faz, setFaz] = useState<"goster" | "sen">(a.goster ? "goster" : "sen");
  const [ornekBitti, setOrnekBitti] = useState(false);
  const [ornekNo, setOrnekNo] = useState(0);
  useEffect(() => {
    if (faz !== "goster" || !a.goster) return;
    setOrnekBitti(false);
    const bas = { ...(a.deger ?? {}) };
    setV(bas);
    const dizi = kareler(bas, a.goster.deger ?? {}, a.kontroller, kayit?.bagla);
    const zaman: ReturnType<typeof setTimeout>[] = [];
    dizi.forEach((x, j) => zaman.push(setTimeout(() => setV(x), 600 + j * 260)));
    const sonra = 600 + dizi.length * 260 + 250;
    if (sure && a.goster.oynat !== false) zaman.push(setTimeout(o.basla, sonra));
    else zaman.push(setTimeout(() => setOrnekBitti(true), sonra + 600));
    return () => zaman.forEach(clearTimeout);
  }, [faz, ornekNo]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (faz === "goster" && kosular.length) setOrnekBitti(true); }, [faz, kosular.length]);
  const senBasla = () => { setV({ ...(a.deger ?? {}) }); setKosular([]); o.sifirla(); setFaz("sen"); };
  const ornekte = faz === "goster";

  // Takılınca çözüm: sahnesi oynayan ayar görevinde iki yanlış koşudan, oynamayanda bir süre sonra.
  const [sureDoldu, setSureDoldu] = useState(false);
  useEffect(() => {
    if (ornekte || g.tur !== "ayarla" || sure) return;
    const z = setTimeout(() => setSureDoldu(true), COZUM_SURE);
    return () => clearTimeout(z);
  }, [ornekte, g.tur, sure]);

  const set = useCallback(
    (ad: string, x: number) => {
      if (o.oynuyor || faz === "goster") return;
      setV((eski) => (kayit?.bagla ? kayit.bagla(ad, x, eski) : { ...eski, [ad]: x }));
      o.sifirla();
    },
    [kayit, o.oynuyor, o.sifirla, faz],
  );

  const sonKosu = kosular.length ? kosular[kosular.length - 1] : null;
  const oynandi = !o.oynuyor && sonKosu !== null && ayni(sonKosu, v);
  const farkli = new Set(kosular.map((k) => JSON.stringify(k))).size;
  const acik = g.tur !== "tahmin" || (secim !== null && (!sure || kosular.length > 0) && !o.oynuyor);
  const hedefte = g.tur === "ayarla" && uyar(v, g.hedef);
  const basari = ornekte ? false :
    g.tur === "devam" ? true :
    g.tur === "oynat" ? kosular.length > 0 :
    g.tur === "tahmin" ? acik :
    g.tur === "ayarla" ? hedefte && (!sure || oynandi) :
    false;

  useEffect(() => { if (basari) tamam(); }, [basari, tamam]);

  // Ayarla ve tahmin görevlerinin geri bildirimi (seçim sorusu kendi bildirir).
  const ayarlaGeri: Bildirim | null =
    ornekte || g.tur !== "ayarla" || (sure && !oynandi) ? null :
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

  const yanlisKosu = g.tur === "ayarla" ? kosular.filter((k) => !uyar(k, g.hedef)).length : 0;
  const cozumAcik = !ornekte && g.tur === "ayarla" && !basari && !o.oynuyor && (sure ? yanlisKosu >= COZUM_YANLIS : sureDoldu);
  const cozumGoster = () => {
    if (g.tur !== "ayarla") return;
    const hedef = Object.fromEntries(Object.entries(g.hedef).map(([ad, h]) => {
      if (!Array.isArray(h)) return [ad, h];
      const k = a.kontroller?.find((x) => x.ad === ad), adim = k?.adim ?? 1;
      return [ad, Math.min(h[1], Math.max(h[0], Math.round((h[0] + h[1]) / 2 / adim) * adim))];
    }));
    const dizi = kareler(v, hedef, a.kontroller, kayit?.bagla);
    dizi.forEach((x, j) => setTimeout(() => setV(x), j * 200));
    if (sure) setTimeout(o.basla, dizi.length * 200 + 200);
  };

  if (!kayit) return <p className="ad-ipucu">Bu sahne bulunamadı: {a.sahne.tur}</p>;
  const C = kayit.C;
  const tahminOncesi = g.tur === "tahmin" && secim === null;

  return (
    <>
      <div className="ad-sahne" ref={sahneRef}>
        <C s={a.sahne} v={v} set={set} t={o.t} oynuyor={o.oynuyor} kosular={kosular} secim={secim} />
      </div>

      {ornekte && (
        <div className="ad-ornek" aria-live="polite">
          <span className="ad-ornek-k">Örnek</span>
          {a.goster?.not && <Html as="p" html={a.goster.not} />}
        </div>
      )}

      {a.kontroller && <Kontroller liste={a.kontroller} v={v} set={set} kapali={o.oynuyor || ornekte} />}

      {ornekte ? (
        <div className="ad-ornek-acts">
          <Button disabled={!ornekBitti} onClick={senBasla}>Şimdi sen dene</Button>
          <button className="ad-cozum" disabled={!ornekBitti} onClick={() => setOrnekNo((x) => x + 1)}>Örneği tekrar izle</button>
        </div>
      ) : null}

      {!ornekte && sure > 0 && !tahminOncesi && !(g.tur === "tahmin" && !acik) && (
        <button className="ad-oynat" disabled={o.oynuyor} onClick={o.basla}>
          <span aria-hidden="true">{o.oynuyor ? "●" : "▶"}</span> {o.oynuyor ? "Oynuyor" : kosular.length ? "Tekrar oynat" : "Oynat"}
        </button>
      )}

      {cozumAcik && <CozumDugmesi onClick={cozumGoster} />}

      {!ornekte && g.tur === "secim" && farkli >= (g.kosu ?? 0) && <Soru soru={g.soru} secenekler={g.secenekler} tamam={tamam} bildir={bildir} />}

      {!ornekte && g.tur === "tahmin" && (
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
  // Her adımın kendi "tamam"ı: önceki adımlar yukarıda durur ve şimdiki adımı bitirmiş saymaz.
  const tamamlar = useMemo(() => ders.adimlar.map((_, k) => () => setBiten((b) => (b[k] ? b : b.map((x, j) => (j === k ? true : x))))), [ders]);
  const git = (k: number) => { setBildirim(null); setI(k); };
  // Yeni adım altta belirince sayfa ona kayar (slayt gibi yer değiştirmez).
  const sonAdim = useRef<HTMLElement>(null);
  useEffect(() => {
    if (i === 0) return;
    if (i === n) window.scrollTo({ top: 0, behavior: "smooth" });
    else sonAdim.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [i, n]);
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
        <AnimatePresence mode="wait">
          {!son ? (
            <div key="akis" className="ad-liste">
              {ders.adimlar.slice(0, i + 1).map((A, k) => (
                <motion.article
                  className={cn("ad-kart", k < i && "ad-gecmis")}
                  key={k}
                  ref={k === i ? sonAdim : undefined}
                  inert={k < i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: k < i ? 0.45 : 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <SiraliMetin className="ad-metin" html={A.metin} gecikme={0.1} />
                  <AdimGorunum a={A} tamam={tamamlar[k]} bildir={setBildirim} />
                </motion.article>
              ))}
            </div>
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
