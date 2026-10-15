import Home from "@/components/Home";
import { allEntries } from "@/lib/content";

export default function Page() {
  return <Home all={allEntries()} />;
}
