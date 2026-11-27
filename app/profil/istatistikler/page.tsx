import { cev } from "@/lib/dil";
import Istatistikler from "@/components/profil/Istatistikler";
import { allEntries } from "@/lib/content";

export const metadata = { title: cev("İstatistikler"), robots: { index: false } };

export default function Page() {
  return <Istatistikler all={allEntries()} />;
}
