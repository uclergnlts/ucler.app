import { cev } from "@/lib/dil";
import Deneme from "@/components/Deneme";

export const metadata = { title: cev("Deneme sınavları"), robots: { index: false } };

export default function Page() {
  return <Deneme />;
}
