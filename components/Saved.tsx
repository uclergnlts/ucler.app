"use client";
import { type DersId, type Entry, isDers } from "@/lib/dersler";
import { useProg, useSaved } from "@/lib/store";
import { PageHead, Row, Top } from "./ui";

export default function Saved({ all }: { all: Record<DersId, Entry[]> }) {
  const saved = useSaved(), prog = useProg();
  const list = saved.flatMap((k) => {
    const [d, id] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    return e ? [e] : [];
  });
  return (
    <div className="app">
      <Top />
      <main className="view">
        <PageHead title="Kaydedilenler" text="Bir konuyu tekrar etmek için ders ekranındaki işaret simgesine dokun." />
        {list.length ? (
          <div className="rows">
            {list.map((e) => <Row key={`${e.ders}.${e.id}`} e={e} done={!!prog[`${e.ders}.${e.id}`]} />)}
          </div>
        ) : (
          <div className="empty">Henüz kaydettiğin bir konu yok.</div>
        )}
      </main>
    </div>
  );
}
