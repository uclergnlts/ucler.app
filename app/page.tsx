import Home from "@/components/Home";
import { allEntries, gunSorusuHavuzu } from "@/lib/content";

export default function Page() {
  return <Home all={allEntries()} gunHavuz={Object.keys(gunSorusuHavuzu())} />;
}
