import Link from "next/link";
import { PageHead, UstBar } from "@/components/temel";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sayfa bulunamadı" };

export default function NotFound() {
  return (
    <div className="app">
      <UstBar geri={{ to: "/", label: "Ana sayfa" }} baslik="Sayfa bulunamadı" />
      <main className="view">
        <PageHead text="Aradığın sayfa taşınmış ya da hiç olmamış olabilir. Konuları Keşfet'te bulabilirsin." />
        <div className="grid gap-2">
          <Button asChild><Link href="/kesfet/">Keşfet&apos;e git</Link></Button>
          <Button asChild variant="ghost"><Link href="/">Ana sayfaya dön</Link></Button>
        </div>
      </main>
    </div>
  );
}
