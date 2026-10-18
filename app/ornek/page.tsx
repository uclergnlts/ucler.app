import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Govde, Liste, PageHead, Satir, Top } from "@/components/temel";
import { DERSLER } from "@/lib/dersler";
import { ADIMLI } from "@/lib/adimli";

export const metadata = { title: "Etkileşimli dersler" };

// Adım adım, etkileşimli dersler. Her biri kendi konusunun sayfasından da açılır.
export default function Page() {
  return (
    <div className="app">
      <Top />
      <Govde>
        <PageHead title="Etkileşimli dersler" text="Her adımda bir şey yaparak öğrendiğin dersler. Yeni konular eklendikçe burada görünür." />
        <Liste>
          {ADIMLI.map((d) => {
            const I = Icon[d.ders];
            return (
              <Satir
                key={d.id}
                ders={d.ders}
                href={`/ornek/${d.id}/`}
                icon={<I />}
                title={d.baslik}
                sub={`${DERSLER[d.ders].ad} · ${d.adimlar.length} adım · ${d.ozet}`}
                tag={<Badge variant="default">Başla</Badge>}
              />
            );
          })}
        </Liste>
      </Govde>
    </div>
  );
}
