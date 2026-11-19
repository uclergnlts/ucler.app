import { cev } from "@/lib/dil";
import Kaydedilenler from "@/components/profil/Kaydedilenler";
import { allEntries } from "@/lib/content";

export const metadata = { title: cev("Kaydedilenler") };

export default function Page() {
  return <Kaydedilenler all={allEntries()} />;
}
