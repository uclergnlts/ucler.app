"use client";
import Link from "next/link";
import { useState } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { sureYaz, VIDEOLAR } from "@/lib/videolar";
import { Icon } from "./icons";
import { PageHead, Row, Top } from "./ui";

// Türkçe büyük/küçük harf ve aksanları katlar: "Işık" ile "isik" eşleşir.
const fold = (s: string) =>
  s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

// Sayfalar arasında gezinince arama ve süzgeç kaybolmasın.
const memo = { q: "", filter: "all" as "all" | DersId };

export default function Explore({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg();
  const [q, setQ] = useState(memo.q);
  const [filter, setFilter] = useState(memo.filter);
  const Search = Icon.kesfet;

  const needle = fold(q.trim());
  const rows = DERS_IDS.filter((d) => filter === "all" || filter === d).flatMap((d) =>
    all[d].filter((e) => !needle || fold(e.id ? `${e.title} ${e.summary} ${e.headings}` : e.ad).includes(needle)),
  );

  return (
    <div className="app">
      <Top />
      <main className="view">
        <PageHead title="Keşfet" text="Bütün konular tek yerde. Ara ya da derse göre süz." />
        <label className="search">
          <Search />
          <input
            type="search"
            placeholder="Konu ara: atom, osmoz, vektör..."
            aria-label="Konu ara"
            value={q}
            onChange={(ev) => setQ((memo.q = ev.target.value))}
          />
        </label>
        {!needle && VIDEOLAR.length > 0 && (
          <section className="vstrip-wrap">
            <div className="label">Videolar</div>
            <div className="vstrip">
              {VIDEOLAR.map((v) => (
                <Link key={v.id} className="vthumb" data-ders={v.yerler[0].ders} href={`/videolar/#${v.id}`}>
                  {v.poster ? <img src={v.poster} alt="" /> : <video src={`${v.src}#t=1`} muted playsInline preload="metadata" />}
                  <span><b>{v.baslik}</b>{sureYaz(v.sure)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
        <div className="chips">
          {([["all", "Tümü"], ...DERS_IDS.map((d) => [d, DERSLER[d].ad])] as [typeof filter, string][]).map(([k, l]) => (
            <button key={k} className="chip" aria-pressed={filter === k} onClick={() => setFilter((memo.filter = k))}>
              {l}
            </button>
          ))}
        </div>
        <div className="rows">
          {rows.length ? (
            rows.map((e) => <Row key={`${e.ders}.${e.no}`} e={e} done={!!(e.id && prog[`${e.ders}.${e.id}`])} />)
          ) : (
            <div className="empty">&quot;{q}&quot; için konu bulunamadı.</div>
          )}
        </div>
      </main>
    </div>
  );
}
