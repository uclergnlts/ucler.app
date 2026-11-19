import { cev } from "@/lib/dil";
import Explore from "@/components/Explore";
import { allEntries } from "@/lib/content";

export const metadata = { title: cev("Keşfet") };

export default function Page() {
  return <Explore all={allEntries()} />;
}
