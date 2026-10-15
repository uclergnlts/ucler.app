import Explore from "@/components/Explore";
import { allEntries } from "@/lib/content";

export const metadata = { title: "Keşfet" };

export default function Page() {
  return <Explore all={allEntries()} />;
}
