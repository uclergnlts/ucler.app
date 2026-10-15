"use client";
// Ders ekranı: kartlar -> 4 soruluk mini test -> sonuç.
// Kaydırma (swipe) ve sağ/sol ok tuşlarıyla kartlar arasında gezilir.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DERSLER, type DersId, type Topic } from "@/lib/dersler";
import { setProg, toggleSaved, useSaved } from "@/lib/store";
import { Icon } from "./icons";
import { Html, href, Logo } from "./ui";

type State = { i: number; q: number; picked: number | null; right: number };
const START: State = { i: 0, q: -1, picked: null, right: 0 };

export default function Lesson({
  ders, id, t, next,
}: { ders: DersId; id: string; t: Topic; next?: { id: string; title: string } }) {
  const [s, setS] = useState<State>(START);
  const saved = useSaved().includes(`${ders}.${id}`);
  const nCards = t.cards.length, nQuiz = t.quiz.length;
  const Back = Icon.back, Bookmark = Icon.kayit, Bulb = Icon.bulb;

  useEffect(() => { setProg({ _last: `${ders}.${id}` }); }, [ders, id]);
  useEffect(() => { window.scrollTo(0, 0); }, [s.i, s.q]);
  useEffect(() => {
    if (s.q === nQuiz) setProg({ [`${ders}.${id}`]: `${s.right}/${nQuiz} doğru` });
  }, [s.q, s.right, nQuiz, ders, id]);

  function step(dir: 1 | -1) {
    setS((p) => {
      if (p.q < 0) {
        if (dir > 0) return p.i < nCards - 1 ? { ...p, i: p.i + 1 } : { ...p, q: 0 };
        return p.i > 0 ? { ...p, i: p.i - 1 } : p;
      }
      if (p.q < nQuiz && dir > 0 && p.picked !== null) {
        return { ...p, q: p.q + 1, picked: null };
      }
      return p;
    });
  }
  const pick = (k: number) =>
    setS((p) => (p.picked !== null ? p : { ...p, picked: k, right: p.right + (k === t.quiz[p.q].a ? 1 : 0) }));

  // Klavye
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepRef.current(1);
      if (e.key === "ArrowLeft") stepRef.current(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Kaydırma: yalnızca kartlarda
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (s.q < 0) touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touch.current;
    touch.current = null;
    if (!st) return;
    const dx = e.changedTouches[0].clientX - st.x, dy = e.changedTouches[0].clientY - st.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  const pos = s.q < 0 ? s.i : nCards + s.q;
  let body: React.ReactNode, controls: React.ReactNode = null;

  if (s.q < 0) {
    const c = t.cards[s.i], last = s.i === nCards - 1;
    body = (
      <article className="card" key={`c${s.i}`} aria-live="polite">
        <div className="visual" dangerouslySetInnerHTML={{ __html: c.svg }} />
        <div className="step">{s.i + 1} / {nCards}</div>
        <div className="say"><div className="bubble"><Html as="h2" html={c.h} /><Html as="p" html={c.p} /></div></div>
        {c.key && <div className="note"><Bulb /><Html html={c.key} /></div>}
      </article>
    );
    controls = (
      <div className="controls">
        <button className="btn" data-prev disabled={s.i === 0} aria-label="Önceki kart" onClick={() => step(-1)}><Back /></button>
        <button className="btn main" data-next onClick={() => step(1)}>{last ? "Mini teste geç" : "Devam"}</button>
      </div>
    );
  } else if (s.q < nQuiz) {
    const Q = t.quiz[s.q], p = s.picked, ok = p === Q.a;
    body = (
      <article className="card" key={`q${s.q}`}>
        <div className="step">Soru {s.q + 1} / {nQuiz}</div>
        {p === null ? (
          <div className="say"><div className="bubble"><Html as="h2" html={Q.q} /></div></div>
        ) : (
          <Html as="h2" className="qdone" html={Q.q} />
        )}
        <div className="opts">
          {Q.o.map((o, k) => (
            <button
              key={k}
              className={`opt ${p === null ? "" : k === Q.a ? "right" : k === p ? "wrong" : ""}`}
              disabled={p !== null}
              onClick={() => pick(k)}
            >
              <span className="l">{"ABCD"[k]}</span>
              <Html html={o} />
            </button>
          ))}
        </div>
        {p !== null && (
          <div className="say">
            <div className={`bubble ${ok ? "ok" : "no"}`}>
              <h2>{ok ? "Doğru!" : `Doğru cevap ${"ABCD"[Q.a]}`}</h2>
              <Html as="p" html={Q.e} />
            </div>
          </div>
        )}
      </article>
    );
    controls = (
      <div className="controls">
        <span />
        <button className="btn main" data-next disabled={p === null} onClick={() => step(1)}>
          {s.q === nQuiz - 1 ? "Sonucu gör" : "Sonraki soru"}
        </button>
      </div>
    );
  } else {
    const great = s.right === nQuiz, fine = s.right >= nQuiz / 2;
    body = (
      <article className="card end">
        <Logo />
        <div className="score">{s.right}/{nQuiz}</div>
        <h2>{great ? "Harika, hepsi doğru!" : fine ? "Güzel gidiyorsun!" : "Kartlara bir kez daha bakalım."}</h2>
        <p>{t.title} tamamlandı.</p>
        <div className="acts">
          {next && <Link className="btn main" href={href(ders, next.id)}>Sıradaki: {next.title}</Link>}
          <button className="btn" onClick={() => setS(START)}>Konuyu tekrar et</button>
          <Link className="btn" href={href(ders)}>{DERSLER[ders].ad} konularına dön</Link>
        </div>
      </article>
    );
  }

  return (
    <div className="app" data-ders={ders} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header className="top">
        <Link className="back" href={href(ders)} aria-label="Konudan çık"><Back /></Link>
        <div className="ttl">{t.title}</div>
        <button className="back save" aria-pressed={saved} aria-label="Konuyu kaydet" onClick={() => toggleSaved(`${ders}.${id}`)}>
          <Bookmark />
        </button>
      </header>
      <main className="view lesson">
        <div className="segs" aria-hidden="true">
          {Array.from({ length: nCards + nQuiz }, (_, k) => <i key={k} className={k <= pos ? "on" : ""} />)}
        </div>
        {body}
        {controls}
      </main>
    </div>
  );
}
