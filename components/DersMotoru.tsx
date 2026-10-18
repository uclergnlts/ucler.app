"use client";
// Adımlı ders motoru (Brilliant tarzı): her adımda büyük, hareketli bir sahne + kısa metin + öğrencinin
// yaptığı bir görev. Görev bitince "Devam" açılır. Adımlar content/adimli/*.json dosyalarından gelir,
// sahneler components/sahne/ kütüphanesindendir.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { SAHNELER } from "./sahne";
import { Html } from "./ui";
import type { Adim, AdimliDers, Gorev, Kontrol, Secenek } from "@/lib/adimli";

type Degerler = Record<string, number>;

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

/** Geri bildirim kutusu; açılınca alttaki "Devam" çubuğunun arkasında kalmasın diye görünür alana kayar. */
function Geri({ ok, baslik, children }: { ok: boolean; baslik: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, []);
  return (
    <div className={`feedback ${ok ? "ok" : "no"}`} ref={ref}>
      <h2>{baslik}</h2>
      {children}
    </div>
  );
}

function Soru({ soru, secenekler, tamam }: { soru: string; secenekler: Secenek[]; tamam: () => void }) {
  const [yanlis, setYanlis] = useState<number[]>([]);
  const [dogru, setDogru] = useState<number | null>(null);
  const son = yanlis.length ? yanlis[yanlis.length - 1] : null;
  return (
    <div className="ad-soru">
      <Html as="p" className="ad-soru-h" html={soru} />
      <div className="opts">
        {secenekler.map((s, k) => (
          <button
            key={k}
            className={`opt ${dogru === k ? "right" : yanlis.includes(k) ? "wrong" : ""}`}
            disabled={dogru !== null || yanlis.includes(k)}
            onClick={() => { if (s.dogru) { setDogru(k); tamam(); } else setYanlis((y) => [...y, k]); }}
          >
            <span className="l">{"ABCDE"[k]}</span>
            <Html html={s.yazi} />
          </button>
        ))}
      </div>
      {dogru !== null ? (
        <Geri ok baslik="Doğru!" key="d"><Html as="p" html={secenekler[dogru].neden} /></Geri>
      ) : son !== null ? (
        <Geri ok={false} baslik="Tekrar dene" key={son}><Html as="p" html={secenekler[son].neden} /></Geri>
      ) : null}
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
              <span>{k.etiket}</span><i aria-hidden="true" /><b>{x ? "açık" : "kapalı"}</b>
            </button>
          );
        if (k.tur === "sayac")
          return (
            <div key={k.ad} className="ad-sayac">
              <span>{k.etiket}</span>
              <button className="btn" aria-label={`${k.etiket} azalt`} disabled={kapali || x <= k.min} onClick={() => set(k.ad, x - adim)}>−</button>
              <b aria-live="polite">{gosterim(k, x)}</b>
              <button className="btn" aria-label={`${k.etiket} artır`} disabled={kapali || x >= k.max} onClick={() => set(k.ad, x + adim)}>+</button>
            </div>
          );
        return (
          <label key={k.ad} className="surgu genis">
            <span>{k.etiket}</span>
            <input type="range" min={k.min} max={k.max} step={adim} value={x} disabled={kapali} onChange={(e) => set(k.ad, Number(e.target.value))} />
            <b>{gosterim(k, x)}</b>
          </label>
        );
      })}
    </div>
  );
}

/* ---------- tek adım ---------- */

function AdimGorunum({ a, tamam, bitti }: { a: Adim; tamam: () => void; bitti: boolean }) {
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
  const basari =
    g.tur === "devam" ? true :
    g.tur === "oynat" ? kosular.length > 0 :
    g.tur === "tahmin" ? acik :
    g.tur === "ayarla" ? uyar(v, g.hedef) && (!sure || oynandi) :
    false;

  useEffect(() => { if (basari) tamam(); }, [basari, tamam]);

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
        <button className="btn main ad-oynat" disabled={o.oynuyor} onClick={o.basla}>
          {o.oynuyor ? "Oynuyor…" : kosular.length ? "Tekrar oynat" : "Oynat"}
        </button>
      )}

      {g.tur === "ayarla" && (sure ? oynandi : true) && (
        uyar(v, g.hedef) ? (
          <Geri ok baslik="Oldu!" key="ok"><Html as="p" html={g.tamam} /></Geri>
        ) : sure ? (() => {
          const m = kayit.geri?.(v, a.sahne) ?? { baslik: "Henüz değil", metin: g.ipucu ?? "Değerleri değiştirip yeniden oynat." };
          return <Geri ok={false} baslik={m.baslik} key={JSON.stringify(v)}><Html as="p" html={m.metin} /></Geri>;
        })() : null
      )}

      {g.tur === "secim" && farkli >= (g.kosu ?? 0) && <Soru soru={g.soru} secenekler={g.secenekler} tamam={tamam} />}

      {g.tur === "tahmin" && (
        tahminOncesi ? (
          <div className="ad-soru">
            <Html as="p" className="ad-soru-h" html={g.soru} />
            <div className="opts">
              {g.secenekler.map((s, k) => (
                <button key={k} className="opt" onClick={() => { setSecim(k); if (sure) o.basla(); }}>
                  <span className="l">{"ABCDE"[k]}</span><Html html={s.yazi} />
                </button>
              ))}
            </div>
          </div>
        ) : !acik ? (
          <p className="ad-ipucu">Tahminin: <Html html={`<b>${g.secenekler[secim!].yazi}</b>`} />. İzle…</p>
        ) : (() => {
          const dk = g.secenekler.findIndex((s) => s.dogru), d = g.secenekler[dk], sec = g.secenekler[secim!];
          return (
            <Geri ok={secim === dk} baslik={secim === dk ? "Tahminin doğru!" : <>Doğrusu: <Html html={d.yazi} /></>}>
              {secim !== dk && <Html as="p" html={sec.neden} />}
              <Html as="p" html={d.neden} />
            </Geri>
          );
        })()
      )}

      {bitti && a.not && (
        <div className="note ad-belir"><Icon.bulb /><Html html={a.not} /></div>
      )}
    </>
  );
}

/* ---------- ders ---------- */

export default function DersMotoru({ ders }: { ders: AdimliDers }) {
  const n = ders.adimlar.length;
  const [i, setI] = useState(0);
  const [biten, setBiten] = useState<boolean[]>(() => ders.adimlar.map(() => false));
  const son = i === n;
  const tamam = useCallback(() => setBiten((b) => (b[i] ? b : b.map((x, k) => (k === i ? true : x)))), [i]);
  useEffect(() => { window.scrollTo(0, 0); }, [i]);
  const konu = `/${ders.ders}/${ders.konu}/`;
  const Close = Icon.kapat, Back = Icon.back;
  const A = ders.adimlar[i];
  return (
    <div className="app" data-ders={ders.ders}>
      <header className="top lesson-top">
        <Link className="back" href={konu} aria-label="Dersten çık"><Close /></Link>
        <div className="ttl">
          <span>{ders.baslik}</span>
          <span className="ad-adimlar" aria-hidden="true">
            {ders.adimlar.map((_, k) => <i key={k} className={k < i || (k === i && biten[k]) || son ? "on" : k === i ? "simdi" : ""} />)}
          </span>
        </div>
      </header>
      <main className="view lesson">
        {!son ? (
          <article className="card ad-kart" key={i}>
            <div className="step">Örnek ders · {i + 1} / {n}</div>
            <div className="ctext"><h2>{A.baslik}</h2><Html as="p" html={A.metin} /></div>
            <AdimGorunum a={A} tamam={tamam} bitti={biten[i]} />
          </article>
        ) : (
          <article className="card ad-kart">
            <div className="step">Örnek ders bitti</div>
            <div className="ctext"><h2>Bu dersi bitirdin</h2><p>Aklında kalması gerekenler:</p></div>
            <ul className="ad-ozet">
              {ders.kapanis.map((m, k) => <li key={k} dangerouslySetInnerHTML={{ __html: m }} />)}
            </ul>
            <div className="acts ad-acts">
              <Link className="btn main" href={konu}>Konunun kartlarına ve testine geç</Link>
              <button className="btn" onClick={() => { setI(0); setBiten(ders.adimlar.map(() => false)); }}>Baştan başla</button>
            </div>
          </article>
        )}
        {!son && (
          <div className="controls">
            <button className="btn" disabled={i === 0} aria-label="Önceki adım" onClick={() => setI(i - 1)}><Back /></button>
            <button className="btn main" disabled={!biten[i]} onClick={() => setI(i + 1)}>
              {biten[i] ? (i === n - 1 ? "Bitir" : "Devam") : "Önce görevi yap"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
