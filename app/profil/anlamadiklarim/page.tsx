import Anlamadiklarim from "@/components/profil/Anlamadiklarim";
import { allEntries, kartBasliklari } from "@/lib/content";

export const metadata = { title: "Anlamadıklarım" };

export default function Page() {
  return <Anlamadiklarim all={allEntries()} basliklar={kartBasliklari()} />;
}
