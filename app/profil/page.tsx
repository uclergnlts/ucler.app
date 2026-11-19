import { cev } from "@/lib/dil";
import Profile from "@/components/Profile";
import { allEntries, kartBasliklari } from "@/lib/content";

export const metadata = { title: cev("Profil") };

export default function Page() {
  return <Profile all={allEntries()} basliklar={kartBasliklari()} />;
}
