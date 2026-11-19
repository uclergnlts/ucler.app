import { cev } from "@/lib/dil";
import Tekrar from "@/components/Tekrar";
import { tumSorular } from "@/lib/content";

export const metadata = { title: cev("Tekrar") };

export default function Page() {
  return <Tekrar sorular={tumSorular()} />;
}
