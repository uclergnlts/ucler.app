"use client";
// Oyun alanı: konulara bağlı kısa oyunlar. Liste lib/oyunlar.ts'te.
import Link from "next/link";
import { DERSLER } from "@/lib/dersler";
import { OYUNLAR } from "@/lib/oyunlar";
import { Icon } from "./icons";
import { PageHead, Top } from "./ui";

export default function Oyunlar() {
  return (
    <div className="app">
      <Top />
      <main className="view">
        <PageHead title="Oyun alanı" text="Konularda öğrendiğini kısa oyunlarla dene." />
        <div className="rows">
          {OYUNLAR.map((o) => {
            const I = Icon[o.ders];
            const ic = <span className="ic"><I /></span>;
            const yazi = <span style={{ minWidth: 0 }}><b>{o.ad}</b><span className="s">{DERSLER[o.ders].ad} · {o.ozet}</span></span>;
            return o.hazir ? (
              <Link key={o.id} className="row" data-ders={o.ders} href={`/oyunlar/${o.id}/`}>{ic}{yazi}<span className="tag">Oyna</span></Link>
            ) : (
              <div key={o.id} className="row soon" data-ders={o.ders}>{ic}{yazi}<span className="tag">Yakında</span></div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
