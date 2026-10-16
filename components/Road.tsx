"use client";
// Bir dersin konu listesi: hazır konular açık, yazılmamış olanlar "Yakında".
import Link from "next/link";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { Icon } from "./icons";
import { href } from "./ui";

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg();
  const s = DERSLER[ders];
  const ready = list.filter((e) => e.id), done = ready.filter((e) => prog[`${ders}.${e.id}`]).length;
  const Back = Icon.back, Check = Icon.check;
  return (
    <div className="app" data-ders={ders}>
      <header className="top">
        <Link className="back" href="/" aria-label="Ana sayfa"><Back /></Link>
      </header>
      <main className="view">
        <section className="intro">
          <h1>{s.ad}</h1>
          <p>{s.yol}. Konular sırayla birbirinin üzerine kurulu, baştan başlamak en iyisi.</p>
          <div className="meter big" aria-label={`${ready.length} konudan ${done} tanesi bitti`}>
            <i style={{ width: `${ready.length ? (100 * done) / ready.length : 0}%` }} />
          </div>
          <span className="meter-t">{done} / {ready.length} konu bitti</span>
        </section>
        <ol className="road">
          {list.map((e) => {
            if (!e.id)
              return (
                <li key={e.no} className="soon">
                  <span className="node">{e.no}</span>
                  <div className="topic"><b>{e.ad}</b><span className="s">Yakında</span></div>
                </li>
              );
            const res = prog[`${ders}.${e.id}`];
            return (
              <li key={e.no} className={res ? "done" : undefined}>
                <Link className="topic-l" href={href(ders, e.id)}>
                  <span className="node">{res ? <Check /> : e.no}</span>
                  <span className="topic">
                    <b>{e.title}</b>
                    <span className="s">{e.summary}</span>
                    <span className="meta">{e.cardCount} kart · {e.quizCount} soru{res ? ` · ${res}` : ""}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
