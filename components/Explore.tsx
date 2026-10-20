"use client";
import { useState } from "react";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { Icon } from "./icons";
import { Bos, Govde, Liste, PageHead, Row, Top } from "./temel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
  // Dersler ayrı bölümlerde: "Tümü"nde her dersin konuları kendi başlığının altında.
  const gruplar = DERS_IDS.filter((d) => filter === "all" || filter === d)
    .map((d) => ({ d, rows: all[d].filter((e) => !needle || fold(`${e.id ? `${e.title} ${e.summary} ${e.headings}` : e.ad}`).includes(needle)) }))
    .filter((g) => g.rows.length);

  return (
    <div className="app">
      <Top />
      <Govde>
        <PageHead title="Keşfet" text="Bütün konular tek yerde. Ara ya da derse göre süz." />
        <label className="relative block">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground [&_svg]:size-5"><Search /></span>
          <Input
            type="search"
            className="pl-11"
            placeholder="Konu ara: atom, osmoz, vektör..."
            aria-label="Konu ara"
            value={q}
            onChange={(ev) => setQ((memo.q = ev.target.value))}
          />
        </label>
        <div className="-mx-4 -mt-2 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          {([["all", "Tümü"], ...DERS_IDS.map((d) => [d, DERSLER[d].ad])] as [typeof filter, string][]).map(([k, l]) => (
            <Button
              key={k}
              size="sm"
              variant={filter === k ? "default" : "outline"}
              aria-pressed={filter === k}
              onClick={() => setFilter((memo.filter = k))}
            >
              {l}
            </Button>
          ))}
        </div>
        {gruplar.length ? (
          gruplar.map(({ d, rows }) => (
            <section key={d} className="grid gap-2.5" aria-label={DERSLER[d].ad}>
              <div className="flex items-baseline justify-between">
                <h2 data-ders={d} className="flex items-center gap-2 text-[17px]"><span className="size-2.5 rounded-full bg-acc" aria-hidden="true" />{DERSLER[d].ad}</h2>
                <span className="text-[13px] font-semibold text-muted-foreground">{rows.length} konu</span>
              </div>
              <Liste>
                {rows.map((e) => <Row key={`${e.ders}.${e.no}`} e={e} done={!!(e.id && prog[`${e.ders}.${e.id}`])} />)}
              </Liste>
            </section>
          ))
        ) : (
          <Bos>&quot;{q}&quot; için konu bulunamadı.</Bos>
        )}
      </Govde>
    </div>
  );
}
