import { cev } from "@/lib/dil";
import Oyunlar from "@/components/Oyunlar";

export const metadata = { title: cev("Oyunlar") };

export default function Page() {
  return <Oyunlar />;
}
