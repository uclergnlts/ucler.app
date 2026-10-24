"use client";
// Oyun alanı: konulara bağlı kısa oyunlar. Liste lib/oyunlar.ts'te.
import { DERSLER } from "@/lib/dersler";
import { OYUNLAR } from "@/lib/oyunlar";
import { Icon } from "./icons";
import { Badge } from "./ui/badge";
import { Govde, Liste, PageHead, Satir, UstBar, UstEylem } from "./temel";

export default function Oyunlar() {
  return (
    <div className="app">
      <UstBar baslik="Oyunlar" sag={<UstEylem href="/lig/" label="Haftalık lig" icon={<Icon.kupa />} />} />
      <Govde>
        <PageHead text="Konularda öğrendiğini kısa oyunlarla dene." />
        <Liste>
          {OYUNLAR.map((o) => {
            const I = Icon[o.ders];
            return (
              <Satir
                key={o.id}
                ders={o.ders}
                href={o.hazir ? `/oyunlar/${o.id}/` : undefined}
                soluk={!o.hazir}
                icon={<I />}
                title={o.ad}
                sub={`${DERSLER[o.ders].ad} · ${o.ozet}`}
                tag={o.hazir ? <Badge variant="default">Oyna</Badge> : <Badge>Yakında</Badge>}
              />
            );
          })}
        </Liste>
      </Govde>
    </div>
  );
}
