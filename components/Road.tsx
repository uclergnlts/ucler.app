"use client";
// Bir dersin konu yolu: hazır konular açık, yazılmamış olanlar "Yakında".
import Link from "next/link";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { href, Top } from "./ui";

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const prog = useProg();
  const s = DERSLER[ders];
  return (
    <div className="app" data-ders={ders}>
      <Top />
      <main className="view">
        <section className="band">
          <h1>{s.ad}</h1>
          <div className="say">
            <div className="bubble">
              <p>{s.yol}. Konular sırayla birbirinin üzerine kurulu, baştan başlamak en iyisi.</p>
            </div>
          </div>
        </section>
        <ol className="road">
          {list.map((e) => {
            if (!e.id)
              return (
                <li key={e.no} className="soon">
                  <span className="node">{e.no}</span>
                  <div className="topic"><b>{e.ad}</b><span>Yakında</span></div>
                </li>
              );
            const done = prog[`${ders}.${e.id}`];
            return (
              <li key={e.no} className={`open${done ? " done" : ""}`}>
                <span className="node">{done ? "★" : e.no}</span>
                <Link className="topic" href={href(ders, e.id)}>
                  <b>{e.title}</b>
                  <span>{e.summary}</span>
                  <span className="meta">
                    {e.cardCount} kart · {e.quizCount} soru{done ? ` · ${done}` : ""}
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
