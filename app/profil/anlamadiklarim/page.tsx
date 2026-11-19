import { cev } from "@/lib/dil";
import Anlamadiklarim from "@/components/profil/Anlamadiklarim";
import { allEntries, kartBasliklari } from "@/lib/content";

export const metadata = { title: cev("Anlamadıklarım") };

export default function Page() {
  return <Anlamadiklarim all={allEntries()} basliklar={kartBasliklari()} />;
}
