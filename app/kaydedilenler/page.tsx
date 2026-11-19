import { cev } from "@/lib/dil";
import Kaydedilenler from "@/components/profil/Kaydedilenler";
import { allEntries } from "@/lib/content";

// Eski adres: Profil > Kaydedilenler ekranını gösterir (asıl adres /profil/kaydedilenler/).
export const metadata = { title: cev("Kaydedilenler"), robots: { index: false } };

export default function Page() {
  return <Kaydedilenler all={allEntries()} />;
}
