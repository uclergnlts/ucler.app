import Link from "next/link";
import { Icon } from "@/components/icons";
import { PageHead, Top } from "@/components/ui";
import { DERSLER } from "@/lib/dersler";
import { ADIMLI } from "@/lib/adimli";

export const metadata = { title: "Örnek dersler" };

// Adım adım, etkileşimli örnek dersler (deneme). Ana menüde bağlantısı yok.
export default function Page() {
  return (
    <div className="app">
      <Top />
      <main className="view">
        <PageHead title="Örnek dersler" text="Her adımda bir şey yaparak öğrendiğin yeni ders biçimi. Bunlar deneme." />
        <div className="rows">
          {ADIMLI.map((d) => {
            const I = Icon[d.ders];
            return (
              <Link key={d.id} className="row" data-ders={d.ders} href={`/ornek/${d.id}/`}>
                <span className="ic"><I /></span>
                <span style={{ minWidth: 0 }}><b>{d.baslik}</b><span className="s">{DERSLER[d.ders].ad} · {d.adimlar.length} adım · {d.ozet}</span></span>
                <span className="tag">Başla</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
