"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { doneKeys, useAd, useProg } from "@/lib/store";
import { sureYaz, VIDEOLAR } from "@/lib/videolar";
import { Icon } from "./icons";
import { href, InstaLink, Top } from "./ui";

export default function Home({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg(), ad = useAd();
  const doneAll = doneKeys(prog).length;
  const [ld, lid] = (prog._last || "").split(".");
  const last = ld in all ? all[ld as DersId].find((e) => e.id && e.id === lid) : undefined;
  const Next = Icon.ileri, Play = Icon.play;
  const router = useRouter();

  // Eski tek sayfalık sürümün adresleri (#kimya.simya, #kesfet, #kayit...) yeni adreslere yönlensin.
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const [d, id] = h.split(".");
    const page = ({ kesfet: "/kesfet/", kayit: "/profil/", profil: "/profil/" } as Record<string, string>)[d];
    if (page) router.replace(page);
    else if (d in all) router.replace(id ? href(d, id) : href(d));
  }, [all, router]);

  return (
    <div className="app">
      <Top />
      <main className="view">
        <section className="intro">
          <h1>Hoş geldin{ad ? `, ${ad}` : ""}</h1>
          {doneAll > 0 && <p>Şimdiye kadar {doneAll} konu bitirdin.</p>}
        </section>

        {last && (
          <Link className="resume" data-ders={last.ders} href={href(last.ders, last.id)}>
            <span className="dot"><Play /></span>
            <span className="txt">
              <span className="k">Kaldığın yerden devam et</span>
              <b>{last.title}</b>
            </span>
            <Next />
          </Link>
        )}

        <section className="sec">
          <h2 className="sec-h">Dersler</h2>
          <div className="list">
            {DERS_IDS.map((d) => {
              const s = DERSLER[d], ready = all[d].filter((e) => e.id);
              const done = ready.filter((e) => prog[`${d}.${e.id}`]).length;
              const I = Icon[d];
              return (
                <Link key={d} className="subj" data-ders={d} href={href(d)}>
                  <span className="ic"><I /></span>
                  <span className="txt">
                    <b>{s.ad}</b>
                    <span className="s">{s.yol}</span>
                    <span className="meter" aria-label={`${ready.length} konudan ${done} tanesi bitti`}>
                      <i style={{ width: `${ready.length ? (100 * done) / ready.length : 0}%` }} />
                    </span>
                  </span>
                  <span className="n">{done}/{ready.length}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {VIDEOLAR.length > 0 && (
          <section className="sec">
            <div className="sec-row">
              <h2 className="sec-h">Kısa videolar</h2>
              <Link className="more" href="/videolar/">Tümü</Link>
            </div>
            <div className="shelf">
              {VIDEOLAR.map((v) => (
                <Link key={v.id} className="thumb" href={`/videolar/#${v.id}`} aria-label={`${v.baslik} (${sureYaz(v.sure)})`}>
                  <span className="pic">
                    {v.poster && <img src={v.poster} alt="" loading="lazy" />}
                    <span className="t">{sureYaz(v.sure)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="sec">
          <InstaLink />
        </section>
      </main>
    </div>
  );
}
