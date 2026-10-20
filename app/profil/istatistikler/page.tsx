import Istatistikler from "@/components/profil/Istatistikler";
import { allEntries } from "@/lib/content";

export const metadata = { title: "İstatistikler" };

export default function Page() {
  return <Istatistikler all={allEntries()} />;
}
