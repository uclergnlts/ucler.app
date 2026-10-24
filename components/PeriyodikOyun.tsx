"use client";
// Oyun: elementi periyodik tablodaki kutusuna yerleştir. İlk 20 element, 10 tur.
// Kural kartlardakiyle aynı: katman sayısı periyodu, değerlik elektronu A grubunu verir.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { kaydet, PUAN } from "@/lib/puan";
import { ELEMENTLER, grup18, katmanlar, yer } from "@/lib/elementler";
import { Icon } from "./icons";
import { href, UstBar, UstEylem } from "./temel";

type Mod = "z" | "ezber";
type Durum = { mod: Mod; sira: number[]; i: number; secim: [number, number] | null; sonuc: Record<number, boolean>; dogru: number };
const TUR = 10, KAYIT = "ucler-oyun-periyodik";

const karistir = () => {
  const a = ELEMENTLER.map((e) => e.z);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, TUR);
};

// Tablodaki kutular: yalnızca ilk 20 elementin bulunduğu yerler.
const KUTU = new Map(ELEMENTLER.map((e) => { const y = yer(e.z); return [`${y.periyot}.${y.grup}`, e.z]; }));

function aciklama(z: number) {
  const e = ELEMENTLER[z - 1], k = katmanlar(z), y = yer(z);
  if (z === 1) return `H (Z = 1): tek katmanda 1 elektron. 1. periyot, 1A grubu. Metal değildir ama 1A'da durur.`;
  if (z === 2) return `He (Z = 2): tek katmanı 2 elektronla dolu. 1. periyot; soygaz olduğu için 8A grubunda.`;
  return `${e.s} (Z = ${z}): elektronlar ${k.join(", ")} diye dizilir. ${k.length} katman var: ${y.periyot}. periyot. Son katmanda ${y.grup} elektron var: ${y.grup}A grubu.`;
}

function enIyi(): number {
  try { return Number(localStorage.getItem(KAYIT)) || 0; } catch { return 0; }
}

export default function PeriyodikOyun() {
  const [d, setD] = useState<Durum | null>(null);
  const [rekor, setRekor] = useState(0);
  useEffect(() => setRekor(enIyi()), []);

  const bitti = d !== null && d.i >= TUR;
  // Oyun bitince bir kez puan yazılır (aynı oyun nesnesi için yeniden yazılmaz).
  const sayilan = useRef<Durum | null>(null);
  useEffect(() => {
    if (!bitti || !d) return;
    if (sayilan.current !== d) { sayilan.current = d; kaydet("oyun", 1, PUAN.oyun); }
    if (d.dogru > enIyi()) {
      try { localStorage.setItem(KAYIT, String(d.dogru)); } catch {}
      setRekor(d.dogru);
    }
  }, [bitti, d]);

  const basla = (mod: Mod) => setD({ mod, sira: karistir(), i: 0, secim: null, sonuc: {}, dogru: 0 });

  let govde: React.ReactNode;
  if (!d) {
    govde = (
      <section className="oyun-giris">
        <div className="bubble">
          <h2>Elementi yerine koy</h2>
          <p>Sana bir element gösterilecek. Periyodik tabloda onun kutusuna dokun. {TUR} tur, ilk 20 element.</p>
        </div>
        <button className="btn main" onClick={() => basla("z")}>Atom numarasıyla oyna</button>
        <button className="btn" onClick={() => basla("ezber")}>Yalnızca adla oyna (zor)</button>
        {rekor > 0 && <p className="oyun-rekor">En iyi sonucun: {rekor}/{TUR}</p>}
      </section>
    );
  } else if (bitti) {
    govde = (
      <section className="card end">
        <div className="score">{d.dogru}/{TUR}</div>
        <h2>{d.dogru === TUR ? "Hepsi doğru, tablo artık senin!" : d.dogru >= 7 ? "Çok iyi, birkaç kutu kaldı." : "Katman kuralını bir daha dene."}</h2>
        <p>En iyi sonucun: {Math.max(rekor, d.dogru)}/{TUR}</p>
        <div className="acts">
          <button className="btn main" onClick={() => basla(d.mod)}>Tekrar oyna</button>
          <Link className="btn" href={href("kimya", "atomun-yapisi")}>Konu: Atomun yapısı</Link>
          <Link className="btn" href="/oyunlar/">Oyunlara dön</Link>
        </div>
      </section>
    );
  } else {
    const z = d.sira[d.i], e = ELEMENTLER[z - 1], dogruYer = yer(z), s = d.secim;
    const bildi = s !== null && s[0] === dogruYer.periyot && s[1] === dogruYer.grup;
    const sec = (p: number, g: number) =>
      setD((o) => {
        if (!o || o.secim) return o;
        const ok = p === dogruYer.periyot && g === dogruYer.grup;
        return { ...o, secim: [p, g], sonuc: { ...o.sonuc, [z]: ok }, dogru: o.dogru + (ok ? 1 : 0) };
      });
    govde = (
      <>
        <div className="oyun-ust">
          <span>Tur {d.i + 1} / {TUR}</span>
          <span>{d.dogru} doğru</span>
        </div>
        <div className="oyun-soru">
          <b>{e.s}</b>
          <span>{e.ad}{d.mod === "z" && <> · Z = {z}</>}</span>
        </div>
        <div className="pt" role="grid" aria-label="Periyodik tablo, ilk dört periyot">
          <span />
          {Array.from({ length: 8 }, (_, g) => (
            <span key={g} className="pt-h">{g + 1}A<i>{grup18(g + 1)}</i></span>
          ))}
          {[1, 2, 3, 4].map((p) => (
            <div key={p} className="pt-r" role="row">
              <span className="pt-h">{p}</span>
              {Array.from({ length: 8 }, (_, gi) => {
                const g = gi + 1, kz = KUTU.get(`${p}.${g}`);
                if (!kz) return <span key={g} className="pt-bos" />;
                const r = d.sonuc[kz], bu = s && s[0] === p && s[1] === g;
                const hedef = s && kz === z;
                const cls = hedef ? (bildi ? "ok" : "hedef") : bu ? "no" : r === true ? "ok" : r === false ? "gecti" : "";
                return (
                  <button
                    key={g}
                    role="gridcell"
                    className={`pt-k ${cls}`}
                    aria-label={`${p}. periyot, ${g}A grubu`}
                    disabled={s !== null}
                    onClick={() => sec(p, g)}
                  >
                    {r !== undefined || hedef ? ELEMENTLER[kz - 1].s : ""}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {s && (
          <div className={`bubble ${bildi ? "ok" : "no"}`} aria-live="polite">
            <h2>{bildi ? "Doğru!" : "Bu kutu değil"}</h2>
            <p>{aciklama(z)}</p>
          </div>
        )}
        <div className="controls one">
          <button className="btn main" disabled={!s} onClick={() => setD((o) => o && { ...o, i: o.i + 1, secim: null })}>
            {d.i === TUR - 1 ? "Sonucu gör" : "Sonraki element"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="app" data-ders="kimya">
      <UstBar
        geri={{ to: "/oyunlar/", label: "Oyunlara dön" }}
        baslik="Periyodik tabloda yerini bul"
        sag={d && <UstEylem label="Baştan başla" icon={<Icon.tekrar />} onClick={() => setD(null)} />}
      />
      <main className="view lesson">{govde}</main>
    </div>
  );
}
