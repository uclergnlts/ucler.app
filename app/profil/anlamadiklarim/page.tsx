import { cev } from "@/lib/dil";
import Anlamadiklarim from "@/components/profil/Anlamadiklarim";
import { allEntries, kartBasliklari } from "@/lib/content";

export const metadata = { title: cev("Anlamadıklarım"), robots: { index: false } };

export default function Page() {
  return <Anlamadiklarim all={allEntries()} basliklar={kartBasliklari()} />;
}
