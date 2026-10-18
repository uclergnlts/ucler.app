"use client";
// Oyun: formüldeki atomları say. 10 tur, dört seçenek.
// Cevaplar elle yazılmaz: lib/formul.ts formülü çözümleyip sayar. Yanlış seçenekler sık yapılan hatalardan gelir
// (parantez indisini ya da katsayıyı unutmak).
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { coz, FORMULLER, katkiDegeri, say, toplam, yanlisSay } from "@/lib/formul";
import { Icon } from "./icons";
import { href } from "./temel";

type Soru = { f: string; ad: string; el: string | null; dogru: number; secenek: number[] };
type Durum = { sorular: Soru[]; i: number; secim: number | null; dogru: number };
const TUR = 10, KAYIT = "ucler-oyun-atom-say";

function karistir<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function soruYap(f: string, ad: string): Soru {
  const sayim = say(f);
  // Yarı yarıya: toplam atom ya da tek bir elementin atomları (birden çok olanlar öncelikli).
  const coklu = [...sayim].filter(([, n]) => n > 1).map(([s]) => s);
  const el = Math.random() < 0.5 && coklu.length ? coklu[Math.floor(Math.random() * coklu.length)] : null;
  const dogru = el ? sayim.get(el)! : toplam(f);
  const aday = [yanlisSay(f, "parantez", el ?? undefined), yanlisSay(f, "katsayi", el ?? undefined), ...karistir([dogru + 1, dogru - 1, dogru + 2, dogru - 2, dogru + 3, dogru * 2])];
  const yanlis: number[] = [];
  for (const n of aday) if (n > 0 && n !== dogru && !yanlis.includes(n) && yanlis.length < 3) yanlis.push(n);
  return { f, ad, el, dogru, secenek: karistir([dogru, ...yanlis]) };
}

const yeniOyun = (): Durum => ({ sorular: karistir(FORMULLER).slice(0, TUR).map((x) => soruYap(x.f, x.ad)), i: 0, secim: null, dogru: 0 });

// Formülü alt indisleriyle yazar: harften ya da ")" işaretinden sonra gelen sayılar indistir, baştakiler katsayıdır.
export function Formul({ f }: { f: string }) {
  const out: React.ReactNode[] = [];
  let i = 0, k = 0;
  while (i < f.length) {
    const c = f[i];
    if (c >= "0" && c <= "9") {
      let t = "";
      while (i < f.length && f[i] >= "0" && f[i] <= "9") t += f[i++];
      const indis = /[A-Za-z)]/.test(f[i - t.length - 1] ?? "");
      out.push(indis ? <sub key={k++}>{t}</sub> : <Fragment key={k++}>{t}</Fragment>);
    } else {
      out.push(<Fragment key={k++}>{c === " " ? " " : c}</Fragment>);
      i++;
    }
  }
  return <span className="formul">{out}</span>;
}

// Sayımın dökümü: her element için katkılar (indis × parantez × katsayı) ve toplam.
function Dokum({ s }: { s: Soru }) {
  const satir = new Map<string, { terim: string[]; deger: number }>();
  for (const p of coz(s.f))
    for (const k of p.katkilar) {
      const carpan = [k.n, ...k.carpan, ...(p.katsayi > 1 ? [p.katsayi] : [])];
      const r = satir.get(k.s) ?? { terim: [], deger: 0 };
      r.terim.push(carpan.join("×"));
      r.deger += katkiDegeri(k, p.katsayi);
      satir.set(k.s, r);
    }
  const yaz = (el: string, r: { terim: string[]; deger: number }) => {
    const tek = r.terim.length === 1 && !r.terim[0].includes("×");
    return <>{el}: {tek ? r.deger : <>{r.terim.join(" + ")} = {r.deger}</>}</>;
  };
  const parcalar = coz(s.f);
  const katsayili = parcalar[0].katsayi > 1;
  return (
    <>
      <ul className="dokum">
        {[...satir].filter(([el]) => !s.el || el === s.el).map(([el, r]) => <li key={el}>{yaz(el, r)}</li>)}
        {!s.el && <li><b>Toplam: {[...satir.values()].map((r) => r.deger).join(" + ")} = {s.dogru}</b></li>}
      </ul>
      <p className="ipucu">
        {katsayili ? "Baştaki katsayı formüldeki her atomu çarpar. " : parcalar.length > 1 ? "Noktadan sonraki katsayı yalnızca su moleküllerini çarpar. " : parcalar[0].katkilar.some((k) => k.carpan.length) ? "Parantez dışındaki indis, parantez içindeki her atomu çarpar. " : ""}
        Mol için de aynı: {parcalar[0].katsayi} mol <Formul f={s.f.replace(/^\d+\s*/, "")} /> içinde {s.dogru} mol {s.el ? `${s.el} atomu` : "atom"} var.
      </p>
    </>
  );
}

function enIyi(): number {
  try { return Number(localStorage.getItem(KAYIT)) || 0; } catch { return 0; }
}

export default function AtomSayOyun() {
  const [d, setD] = useState<Durum | null>(null);
  const [rekor, setRekor] = useState(0);
  const Back = Icon.back;
  useEffect(() => setRekor(enIyi()), []);

  const bitti = d !== null && d.i >= TUR;
  useEffect(() => {
    if (!bitti || !d) return;
    if (d.dogru > enIyi()) {
      try { localStorage.setItem(KAYIT, String(d.dogru)); } catch {}
      setRekor(d.dogru);
    }
  }, [bitti, d]);

  const basla = () => setD(yeniOyun());

  let govde: React.ReactNode;
  if (!d) {
    govde = (
      <section className="oyun-giris">
        <div className="bubble">
          <h2>Atomları say</h2>
          <p>Her turda bir formül göreceksin. Toplam atom sayısını ya da istenen elementin atom sayısını bul. İndislere, parantezlere ve katsayılara dikkat et. {TUR} tur.</p>
        </div>
        <button className="btn main" onClick={basla}>Başla</button>
        {rekor > 0 && <p className="oyun-rekor">En iyi sonucun: {rekor}/{TUR}</p>}
      </section>
    );
  } else if (bitti) {
    govde = (
      <section className="card end">
        <div className="score">{d.dogru}/{TUR}</div>
        <h2>{d.dogru === TUR ? "Hepsi doğru, indisler artık senden sorulur!" : d.dogru >= 7 ? "Çok iyi, birkaç parantez kaçtı." : "Parantez ve katsayı kuralına bir daha bak."}</h2>
        <p>En iyi sonucun: {Math.max(rekor, d.dogru)}/{TUR}</p>
        <div className="acts">
          <button className="btn main" onClick={basla}>Tekrar oyna</button>
          <Link className="btn" href={href("kimya", "mol")}>Konu: Mol kavramı</Link>
          <Link className="btn" href="/oyunlar/">Oyunlara dön</Link>
        </div>
      </section>
    );
  } else {
    const s = d.sorular[d.i], sec = d.secim;
    const bildi = sec === s.dogru;
    const cevapla = (n: number) =>
      setD((o) => (!o || o.secim !== null ? o : { ...o, secim: n, dogru: o.dogru + (n === s.dogru ? 1 : 0) }));
    govde = (
      <>
        <div className="oyun-ust">
          <span>Tur {d.i + 1} / {TUR}</span>
          <span>{d.dogru} doğru</span>
        </div>
        <div className="oyun-soru as-soru">
          <b><Formul f={s.f} /></b>
          <span>{s.ad}</span>
        </div>
        <p className="as-ne">{s.el ? <>Bu ifadede kaç tane <b>{s.el}</b> atomu var?</> : <>Bu ifadede <b>toplam</b> kaç atom var?</>}</p>
        <div className="opts as-opts">
          {s.secenek.map((n, k) => {
            const cls = sec === null ? "" : n === s.dogru ? "right" : n === sec ? "wrong" : "";
            return (
              <button key={n} className={`opt ${cls}`} disabled={sec !== null} onClick={() => cevapla(n)}>
                <span className="l">{"ABCD"[k]}</span>{n}
              </button>
            );
          })}
        </div>
        {sec !== null && (
          <div className={`bubble ${bildi ? "ok" : "no"}`} aria-live="polite">
            <h2>{bildi ? "Doğru!" : `Doğru cevap: ${s.dogru}`}</h2>
            <Dokum s={s} />
          </div>
        )}
        <div className="controls one">
          <button className="btn main" disabled={sec === null} onClick={() => setD((o) => o && { ...o, i: o.i + 1, secim: null })}>
            {d.i === TUR - 1 ? "Sonucu gör" : "Sonraki formül"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="app" data-ders="kimya">
      <header className="top">
        <Link className="back" href="/oyunlar/" aria-label="Oyunlara dön"><Back /></Link>
        <div className="ttl">Formülde atom say</div>
      </header>
      <main className="view lesson">{govde}</main>
    </div>
  );
}
