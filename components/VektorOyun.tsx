"use client";
// Oyun: vektörleri uç uca ekleyip başlangıç noktasından hedefe ulaş. 10 tur.
// Her turda dört vektör kartı var; çözüm bunların 1-3 tanesinden kurulur, yani her tur çözülebilir.
// Kural kartlardakiyle aynı: bileşke R = A + B + ..., bileşenler ayrı ayrı toplanır (Rx, Ry).
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { href } from "./temel";

type Mod = "cizim" | "kafadan";
type V = { x: number; y: number };
type Tur = { vek: V[]; cozum: number[]; bas: V; hedef: V };
type Durum = { mod: Mod; turlar: Tur[]; i: number; secili: number[]; sonuc: boolean | null; dogru: number };
const TUR = 10, KAYIT = "ucler-oyun-vektor", G = 5;
const AD = ["A", "B", "C", "D"], RENK = ["var(--c1)", "var(--c3)", "var(--c4)", "var(--c5)"];

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const icinde = (p: V) => Math.abs(p.x) <= G && Math.abs(p.y) <= G;
const topla = (vs: V[], bas: V = { x: 0, y: 0 }) => vs.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y }), bas);

function turYap(i: number): Tur {
  for (;;) {
    const vek: V[] = [];
    while (vek.length < 4) {
      const v = { x: rnd(-4, 4), y: rnd(-4, 4) };
      if (Math.abs(v.x) + Math.abs(v.y) < 2 || vek.some((w) => w.x === v.x && w.y === v.y)) continue;
      vek.push(v);
    }
    const k = i < 3 ? rnd(1, 2) : rnd(2, 3);
    const cozum = [0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, k).sort();
    const D = topla(cozum.map((j) => vek[j]));
    if (D.x === 0 && D.y === 0) continue;
    // Başlangıcı, çözüm yolu ızgaranın içinde kalacak biçimde seç.
    for (let t = 0; t < 60; t++) {
      const bas = { x: rnd(-G, G), y: rnd(-G, G) };
      let p = bas, ok = true;
      for (const j of cozum) { p = topla([vek[j]], p); if (!icinde(p)) { ok = false; break; } }
      if (ok) return { vek, cozum, bas, hedef: p };
    }
  }
}

const yeniOyun = (mod: Mod): Durum => ({ mod, turlar: Array.from({ length: TUR }, (_, i) => turYap(i)), i: 0, secili: [], sonuc: null, dogru: 0 });

const isaret = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
const nokta = (v: V) => `(${isaret(v.x)}, ${isaret(v.y)})`;
const toplamYaz = (ns: number[]) => {
  const t = ns.reduce((a, b) => a + b, 0);
  return ns.length === 1 ? isaret(t) : `${ns.map((n, k) => (k && n < 0 ? `(${isaret(n)})` : isaret(n))).join(" + ")} = ${isaret(t)}`;
};

function Ok({ a, b, renk, kesik }: { a: V; b: V; renk: string; kesik?: boolean }) {
  // SVG'de y aşağı doğru artar; matematikteki y'yi ters çeviriyoruz.
  const x1 = a.x, y1 = -a.y, x2 = b.x, y2 = -b.y;
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (!L) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 0.42, w = 0.22;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth={kesik ? 0.09 : 0.13} strokeDasharray={kesik ? "0.25 0.18" : undefined} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`} fill={renk} />
    </g>
  );
}

function Izgara({ tur, secili, ciz, cozumGoster }: { tur: Tur; secili: number[]; ciz: boolean; cozumGoster: boolean }) {
  const yol = (sira: number[]) => {
    let p = tur.bas;
    return sira.map((j) => { const q = topla([tur.vek[j]], p); const r = { a: p, b: q, j }; p = q; return r; });
  };
  const son = topla(secili.map((j) => tur.vek[j]), tur.bas);
  const n = Array.from({ length: 2 * G + 1 }, (_, k) => k - G);
  const m = G + 0.6;
  return (
    <svg className="vk-izgara" viewBox={`${-m} ${-m} ${2 * m} ${2 * m}`} role="img" aria-label={`Başlangıç ${nokta(tur.bas)}, hedef ${nokta(tur.hedef)}`}>
      <defs>
        <clipPath id="vk-kirp"><rect x={-G - 0.3} y={-G - 0.3} width={2 * G + 0.6} height={2 * G + 0.6} /></clipPath>
      </defs>
      {n.map((k) => (
        <g key={k} stroke={k === 0 ? "var(--muted)" : "var(--line)"} strokeWidth={k === 0 ? 0.05 : 0.03}>
          <line x1={k} y1={-G} x2={k} y2={G} />
          <line x1={-G} y1={k} x2={G} y2={k} />
        </g>
      ))}
      <circle cx={tur.hedef.x} cy={-tur.hedef.y} r={0.42} fill="none" stroke="var(--c2)" strokeWidth={0.1} />
      <circle cx={tur.hedef.x} cy={-tur.hedef.y} r={0.16} fill="var(--c2)" />
      <g clipPath="url(#vk-kirp)">
        {cozumGoster && yol(tur.cozum).map((s, k) => <Ok key={"c" + k} a={s.a} b={s.b} renk="var(--good)" kesik />)}
        {ciz && yol(secili).map((s, k) => <Ok key={k} a={s.a} b={s.b} renk={RENK[s.j]} />)}
        {ciz && secili.length > 1 && <Ok a={tur.bas} b={son} renk="var(--ink)" kesik />}
      </g>
      <circle cx={tur.bas.x} cy={-tur.bas.y} r={0.24} fill="var(--ink)" />
    </svg>
  );
}

function enIyi(): number {
  try { return Number(localStorage.getItem(KAYIT)) || 0; } catch { return 0; }
}

export default function VektorOyun() {
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

  const basla = (mod: Mod) => setD(yeniOyun(mod));

  let govde: React.ReactNode;
  if (!d) {
    govde = (
      <section className="oyun-giris">
        <div className="bubble">
          <h2>Hedefe uç uca git</h2>
          <p>Siyah noktadan başla. Vektör kartlarından seç; her biri bir öncekinin ucuna eklenir. Bileşke tam hedefe varmalı. Her kartı bir kez kullanabilirsin. {TUR} tur.</p>
        </div>
        <button className="btn main" onClick={() => basla("cizim")}>Çizimi görerek oyna</button>
        <button className="btn" onClick={() => basla("kafadan")}>Kafadan hesapla (zor)</button>
        {rekor > 0 && <p className="oyun-rekor">En iyi sonucun: {rekor}/{TUR}</p>}
      </section>
    );
  } else if (bitti) {
    govde = (
      <section className="card end">
        <div className="score">{d.dogru}/{TUR}</div>
        <h2>{d.dogru === TUR ? "Hepsi doğru, bileşke senin işin!" : d.dogru >= 7 ? "Çok iyi, birkaç hedef kaçtı." : "Bileşenleri ayrı ayrı toplamayı bir daha dene."}</h2>
        <p>En iyi sonucun: {Math.max(rekor, d.dogru)}/{TUR}</p>
        <div className="acts">
          <button className="btn main" onClick={() => basla(d.mod)}>Tekrar oyna</button>
          <Link className="btn" href={href("fizik", "vektorler")}>Konu: Vektörler</Link>
          <Link className="btn" href="/oyunlar/">Oyunlara dön</Link>
        </div>
      </section>
    );
  } else {
    const t = d.turlar[d.i], sec = d.secili, kontrol = d.sonuc !== null;
    const gerek = { x: t.hedef.x - t.bas.x, y: t.hedef.y - t.bas.y };
    const R = topla(sec.map((j) => t.vek[j]));
    const ekle = (j: number) => setD((o) => (!o || o.sonuc !== null || o.secili.includes(j) ? o : { ...o, secili: [...o.secili, j] }));
    const kontrolEt = () =>
      setD((o) => {
        if (!o || o.sonuc !== null || !o.secili.length) return o;
        const r = topla(o.secili.map((j) => t.vek[j]));
        const ok = r.x === gerek.x && r.y === gerek.y;
        return { ...o, sonuc: ok, dogru: o.dogru + (ok ? 1 : 0) };
      });
    const adlar = (s: number[]) => s.map((j) => AD[j]).join(" + ");
    const bilesen = (s: number[]) => (
      <>R<sub>x</sub> = {toplamYaz(s.map((j) => t.vek[j].x))}, R<sub>y</sub> = {toplamYaz(s.map((j) => t.vek[j].y))}</>
    );
    const ciz = d.mod === "cizim" || kontrol;
    govde = (
      <>
        <div className="oyun-ust">
          <span>Tur {d.i + 1} / {TUR}</span>
          <span>{d.dogru} doğru</span>
        </div>
        <div className="vk-alan">
          <Izgara tur={t} secili={sec} ciz={ciz} cozumGoster={kontrol && !d.sonuc} />
          <div className="vk-lejant">
            <span><i className="vk-bas" />başlangıç {nokta(t.bas)}</span>
            <span><i className="vk-hedef" />hedef {nokta(t.hedef)}</span>
          </div>
        </div>
        <div className="vk-kartlar" role="group" aria-label="Vektör kartları">
          {t.vek.map((v, j) => {
            const k = sec.indexOf(j);
            return (
              <button key={j} className="vk-kart" aria-pressed={k >= 0} disabled={kontrol || k >= 0} onClick={() => ekle(j)} style={{ "--vk": RENK[j] } as React.CSSProperties}>
                <b>{AD[j]}</b>
                <span>{nokta(v)}</span>
              </button>
            );
          })}
        </div>
        <p className="vk-yol">
          {!sec.length ? "Bir vektör kartına dokun." : d.mod === "cizim" || kontrol ? <>R = {adlar(sec)} = {nokta(R)}{!icinde(topla([R], t.bas)) && " · ızgaranın dışına çıktın"}</> : <>Seçtiğin: {adlar(sec)}</>}
        </p>
        {!kontrol && (
          <div className="vk-arac">
            <button className="btn" disabled={!sec.length} onClick={() => setD((o) => o && { ...o, secili: o.secili.slice(0, -1) })}>Geri al</button>
            <button className="btn" disabled={!sec.length} onClick={() => setD((o) => o && { ...o, secili: [] })}>Sıfırla</button>
          </div>
        )}
        {kontrol && (
          <div className={`bubble ${d.sonuc ? "ok" : "no"}`} aria-live="polite">
            <h2>{d.sonuc ? "Tam isabet!" : "Hedefe varmadın"}</h2>
            <p>
              Gereken yer değiştirme: hedef − başlangıç = {nokta(gerek)}.<br />
              {adlar(sec)}: {bilesen(sec)}.
              {!d.sonuc && <><br />Bir çözüm (yeşil kesikli): {adlar(t.cozum)}: {bilesen(t.cozum)}.</>}
            </p>
          </div>
        )}
        <div className="controls one">
          {kontrol ? (
            <button className="btn main" onClick={() => setD((o) => o && { ...o, i: o.i + 1, secili: [], sonuc: null })}>
              {d.i === TUR - 1 ? "Sonucu gör" : "Sonraki tur"}
            </button>
          ) : (
            <button className="btn main" disabled={!sec.length} onClick={kontrolEt}>Kontrol et</button>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="app" data-ders="fizik">
      <header className="top">
        <Link className="back" href="/oyunlar/" aria-label="Oyunlara dön"><Back /></Link>
        <div className="ttl">Vektörle hedefi vur</div>
      </header>
      <main className="view lesson">{govde}</main>
    </div>
  );
}
