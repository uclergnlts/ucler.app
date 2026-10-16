"use client";
// İçerikten tanımlanan genel etkileşimler: sırala, eşleştir, ayır, işaretle, formül.
// Her konu bunları yeni kod yazmadan kullanır. Biçim: docs/ICERIK-SPEC.md ("Etkileşimli kart").
import { useEffect, useMemo, useRef, useState } from "react";
import type { Etk } from "@/lib/dersler";
import { hesapla } from "@/lib/ifade";
import { Html } from "./ui";

type Of<T extends Etk["tur"]> = Extract<Etk, { tur: T }>;

// Sabit karıştırma: sunucuda ve tarayıcıda aynı sırayı verir; doğru sırayla aynı çıkarsa bir kaydırılır.
function karistir<T>(a: T[], tohum: string): number[] {
  let h = 2166136261;
  for (const ch of tohum) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const ix = a.map((_, i) => i);
  for (let i = ix.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [ix[i], ix[j]] = [ix[j], ix[i]];
  }
  if (ix.every((v, i) => v === i) && ix.length > 1) ix.push(ix.shift()!);
  return ix;
}

/** Yanlış seçimi kısa süre kırmızı gösterir. */
function useYanlis(): [string | null, (k: string) => void] {
  const [y, setY] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [y, (k) => { setY(k); clearTimeout(t.current); t.current = setTimeout(() => setY(null), 700); }];
}

const Soru = ({ html }: { html: string }) => <Html as="p" className="etk-soru" html={html} />;
const Bitti = ({ hata, sifirla, yazi }: { hata: number; sifirla: () => void; yazi?: string }) => (
  <div className="etk-bitti">
    <b>{yazi ?? "Tamam!"} {hata === 0 ? "Hiç hata yok." : `${hata} hata.`}</b>
    <button className="etk-mini" onClick={sifirla}>Baştan</button>
  </div>
);

export function Sirala({ e }: { e: Of<"sirala"> }) {
  const sira = useMemo(() => karistir(e.ogeler, e.soru), [e]);
  const [n, setN] = useState(0), [hata, setHata] = useState(0);
  const [yanlis, isaret] = useYanlis();
  const sec = (k: number) => {
    if (k === n) setN(n + 1);
    else { setHata(hata + 1); isaret(String(k)); }
  };
  return (
    <>
      <Soru html={e.soru} />
      {n > 0 && (
        <ol className="etk-sira">
          {e.ogeler.slice(0, n).map((o, i) => <li key={i}><Html html={o} /></li>)}
        </ol>
      )}
      {n < e.ogeler.length ? (
        <div className="etk-secenek">
          {sira.filter((k) => k >= n).map((k) => (
            <button key={k} className={`etk-oge ${yanlis === String(k) ? "no" : ""}`} onClick={() => sec(k)}>
              <Html html={e.ogeler[k]} />
            </button>
          ))}
        </div>
      ) : (
        <Bitti hata={hata} yazi="Doğru sıra!" sifirla={() => { setN(0); setHata(0); }} />
      )}
    </>
  );
}

export function Eslestir({ e }: { e: Of<"eslestir"> }) {
  const sag = useMemo(() => karistir(e.ciftler, e.soru), [e]);
  const [secili, setSecili] = useState<number | null>(null);
  const [tamam, setTamam] = useState<number[]>([]), [hata, setHata] = useState(0);
  const [yanlis, isaret] = useYanlis();
  const eslestir = (k: number) => {
    if (secili === null) return;
    if (k === secili) { setTamam([...tamam, k]); setSecili(null); }
    else { setHata(hata + 1); isaret(String(k)); }
  };
  const bitti = tamam.length === e.ciftler.length;
  return (
    <>
      <Soru html={e.soru} />
      <div className="etk-esle">
        <div>
          {e.ciftler.map(([sol], k) => (
            <button key={k} className={`etk-oge ${tamam.includes(k) ? "ok" : secili === k ? "sec" : ""}`}
              disabled={tamam.includes(k)} aria-pressed={secili === k} onClick={() => setSecili(k)}>
              {tamam.includes(k) && <i>{tamam.indexOf(k) + 1}</i>}<Html html={sol} />
            </button>
          ))}
        </div>
        <div>
          {sag.map((k) => (
            <button key={k} className={`etk-oge ${tamam.includes(k) ? "ok" : yanlis === String(k) ? "no" : ""}`}
              disabled={tamam.includes(k) || secili === null} onClick={() => eslestir(k)}>
              {tamam.includes(k) && <i>{tamam.indexOf(k) + 1}</i>}<Html html={e.ciftler[k][1]} />
            </button>
          ))}
        </div>
      </div>
      {bitti ? <Bitti hata={hata} sifirla={() => { setTamam([]); setHata(0); }} />
        : <p className="etk-ipucu">{secili === null ? "Soldan birini seç." : "Şimdi sağdaki eşini seç."}</p>}
    </>
  );
}

export function Ayir({ e }: { e: Of<"ayir"> }) {
  const sira = useMemo(() => karistir(e.ogeler, e.soru), [e]);
  const [n, setN] = useState(0), [hata, setHata] = useState(0);
  const [son, setSon] = useState<{ k: number; ok: boolean } | null>(null);
  const k = sira[n], bitti = n >= sira.length;
  const sec = (g: number) => {
    if (son && !son.ok) return;
    const ok = e.ogeler[k][1] === g;
    setSon({ k, ok });
    if (ok) setN(n + 1); else setHata(hata + 1);
  };
  const yerlesen = sira.slice(0, n);
  return (
    <>
      <Soru html={e.soru} />
      {!bitti && (
        <div className={`etk-kart ${son && !son.ok ? "no" : ""}`}><Html html={e.ogeler[k][0]} /></div>
      )}
      {son && !son.ok && (
        <p className="etk-ipucu no">
          Bu, <b>{e.gruplar[e.ogeler[son.k][1]]}</b> grubunda.{e.ogeler[son.k][2] && <> <Html html={e.ogeler[son.k][2]!} /></>}{" "}
          <button className="etk-mini" onClick={() => { setSon(null); setN(n + 1); }}>Devam</button>
        </p>
      )}
      <div className="etk-gruplar" style={{ gridTemplateColumns: `repeat(${e.gruplar.length}, 1fr)` }}>
        {e.gruplar.map((g, gi) => (
          <button key={gi} className="etk-grup" disabled={bitti || !!(son && !son.ok)} onClick={() => sec(gi)}>
            <b>{g}</b>
            {yerlesen.filter((j) => e.ogeler[j][1] === gi).map((j) => <Html key={j} className="etk-cip" html={e.ogeler[j][0]} />)}
          </button>
        ))}
      </div>
      {bitti && <Bitti hata={hata} sifirla={() => { setN(0); setHata(0); setSon(null); }} />}
    </>
  );
}

export function Isaretle({ e, svg }: { e: Of<"isaretle">; svg: string }) {
  const [acik, setAcik] = useState<number | null>(null);
  const [gorulen, setGorulen] = useState<number[]>([]);
  const ac = (k: number) => { setAcik(k); if (!gorulen.includes(k)) setGorulen([...gorulen, k]); };
  const p = acik !== null ? e.noktalar[acik] : null;
  return (
    <>
      <Soru html={e.soru} />
      <div className="etk-resim">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        <svg viewBox="0 0 320 200" className="etk-ust">
          {e.noktalar.map((n, k) => (
            <g key={k} className={`etk-nokta ${acik === k ? "on" : gorulen.includes(k) ? "gor" : ""}`} onClick={() => ac(k)}
              role="button" tabIndex={0} aria-label={n.ad} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") ac(k); }}>
              <circle cx={n.x} cy={n.y} r="16" fill="transparent" />
              <circle cx={n.x} cy={n.y} r="9" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="800">{k + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="etk-bilgi" aria-live="polite">
        {p ? <><b><Html html={p.ad} /></b> <Html html={p.acik} /></> : <span>Numaralara dokun. {gorulen.length}/{e.noktalar.length} keşfedildi.</span>}
      </div>
    </>
  );
}

export function Formul({ e }: { e: Of<"formul"> }) {
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(e.girdiler.map((g) => [g.ad, g.deger])));
  const sayi = (x: number, b = 2) =>
    Number.isFinite(x) ? x.toLocaleString("tr-TR", { maximumFractionDigits: b }).replace("-", "−") : "—";
  const sonuc = e.ciktilar.map((c) => { try { return hesapla(c.ifade, v); } catch { return NaN; } });
  let yorum: string | undefined;
  if (e.yorum) {
    const x = sonuc[0];
    yorum = e.yorum.find(([ust]) => ust === null || x < ust)?.[1];
  }
  return (
    <>
      {e.soru && <Soru html={e.soru} />}
      <div className="etk-ciktilar">
        {e.ciktilar.map((c, k) => (
          <div key={k} className="etk-cikti">
            <span><Html html={c.ad} /> =</span>
            <b>{sayi(sonuc[k], c.basamak)}{c.birim && <small> <Html html={c.birim} /></small>}</b>
            {c.max !== undefined && <i><em style={{ width: `${Math.max(0, Math.min(100, (sonuc[k] / c.max) * 100))}%` }} /></i>}
          </div>
        ))}
      </div>
      {yorum && <div className="etk-durum on"><Html html={yorum} /></div>}
      <div className="adimlar">
        {e.girdiler.map((g) => (
          <label key={g.ad} className="surgu genis">
            <Html html={g.etiket} />
            <input type="range" min={g.min} max={g.max} step={g.adim} value={v[g.ad]}
              onChange={(ev) => setV({ ...v, [g.ad]: Number(ev.target.value) })} />
            <b>{sayi(v[g.ad], 3)}{g.birim && <> <Html html={g.birim} /></>}</b>
          </label>
        ))}
      </div>
    </>
  );
}
