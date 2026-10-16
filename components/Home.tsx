"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { doneKeys, useProg } from "@/lib/store";
import { Icon } from "./icons";
import { href, Top } from "./ui";

export default function Home({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg();
  const doneAll = doneKeys(prog).length;
  const [ld, lid] = (prog._last || "").split(".");
  const last = ld in all ? all[ld as DersId].find((e) => e.id && e.id === lid) : undefined;
  const Play = Icon.play, Game = Icon.oyun;
  const router = useRouter();

  // Eski tek sayfalık sürümün adresleri (#kimya.simya, #kesfet, #kayit...) yeni adreslere yönlensin.
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const [d, id] = h.split(".");
    const page = ({ kesfet: "/kesfet/", kayit: "/kaydedilenler/", profil: "/profil/" } as Record<string, string>)[d];
    if (page) router.replace(page);
    else if (d in all) router.replace(id ? href(d, id) : href(d));
  }, [all, router]);

  return (
    <div className="app">
      <Top />
      <main className="view">
        <section className="hero">
          <h1>Fen, en temelden.</h1>
          <div className="say">
            <div className="bubble">
              <p>
                {doneAll ? (
                  <>Tekrar hoş geldin! Şimdiye kadar <b>{doneAll} konu</b> bitirdin.</>
                ) : (
                  "Her konu kısa, görselli kartlarla anlatılır. Sonunda 4 soruluk bir mini test seni bekler."
                )}
              </p>
            </div>
          </div>
        </section>

        {last && (
          <section style={{ display: "grid", gap: 8 }}>
            <div className="label">Kaldığın yer</div>
            <Link className="resume" data-ders={last.ders} href={href(last.ders, last.id)}>
              <span className="dot"><Play /></span>
              <span style={{ minWidth: 0 }}>
                <b>{last.title}</b>
                <span>{DERSLER[last.ders].ad}</span>
              </span>
            </Link>
          </section>
        )}

        <section style={{ display: "grid", gap: 8 }}>
          <div className="label">Oyun alanı</div>
          <Link className="resume" data-ders="kimya" href="/oyunlar/">
            <span className="dot"><Game /></span>
            <span style={{ minWidth: 0 }}>
              <b>Periyodik tabloda yerini bul</b>
              <span>Konulara bağlı kısa oyunlar</span>
            </span>
          </Link>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          <div className="label">Dersler</div>
          <div className="subjects">
            {DERS_IDS.map((d) => {
              const s = DERSLER[d], list = all[d], ready = list.filter((e) => e.id);
              const done = ready.filter((e) => prog[`${d}.${e.id}`]).length;
              const I = Icon[d];
              return (
                <Link key={d} className="subj" data-ders={d} href={href(d)}>
                  <h2>{s.ad}</h2>
                  <span className="badge"><I /></span>
                  <span className="path">{s.yol}</span>
                  <span className="meter">
                    {list.map((e) => (
                      <i key={e.no} className={e.id && prog[`${d}.${e.id}`] ? "d" : e.id ? "r" : ""} />
                    ))}
                  </span>
                  <span className="count">
                    {list.length} konu · {ready.length} tanesi hazır · {done} tamamlandı
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
