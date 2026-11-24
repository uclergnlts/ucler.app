import { cev } from "@/lib/dil";
import Explore from "@/components/Explore";
import { allEntries } from "@/lib/content";

export const metadata = { title: cev("Keşfet"), description: cev("Bütün konular tek yerde: kısa, etkileşimli dersleri ara ve keşfet.") };

export default function Page() {
  return <Explore all={allEntries()} />;
}
