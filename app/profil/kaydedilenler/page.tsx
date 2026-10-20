import Kaydedilenler from "@/components/profil/Kaydedilenler";
import { allEntries } from "@/lib/content";

export const metadata = { title: "Kaydedilenler" };

export default function Page() {
  return <Kaydedilenler all={allEntries()} />;
}
