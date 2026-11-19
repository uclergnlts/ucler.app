import { cev } from "@/lib/dil";
import { ANA } from "@/lib/site";
import Link from "next/link";
import { PageHead, UstBar } from "@/components/temel";
import { Button } from "@/components/ui/button";
import { CizgiRadyo } from "@/components/Cizgi";

export const metadata = { title: cev("Sayfa bulunamadı") };

export default function NotFound() {
  return (
    <div className="app">
      <UstBar geri={{ to: ANA, label: cev("Ana sayfa") }} baslik={cev("Sayfa bulunamadı")} />
      <main className="view">
        {/* Çizgi radyosuyla sinyal arar (Fermi videosundaki espri); kolu yoruldukça düşer. */}
        <CizgiRadyo className="mx-auto mt-2 w-[130px]" etiket={cev("Çizgi radyosuyla sinyal arıyor")} />
        <PageHead text={cev("Aradığın sayfa taşınmış ya da hiç olmamış olabilir. Konuları Keşfet'te bulabilirsin.")} />
        <div className="grid gap-2">
          <Button asChild><Link href="/kesfet/">{cev("Keşfet'e git")}</Link></Button>
          <Button asChild variant="ghost"><Link href={ANA}>{cev("Ana sayfaya dön")}</Link></Button>
        </div>
      </main>
    </div>
  );
}
