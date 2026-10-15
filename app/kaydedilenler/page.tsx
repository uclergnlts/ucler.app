import Saved from "@/components/Saved";
import { allEntries } from "@/lib/content";

export const metadata = { title: "Kaydedilenler" };

export default function Page() {
  return <Saved all={allEntries()} />;
}
