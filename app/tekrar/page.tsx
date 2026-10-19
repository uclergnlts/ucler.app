import Tekrar from "@/components/Tekrar";
import { tumSorular } from "@/lib/content";

export const metadata = { title: "Tekrar" };

export default function Page() {
  return <Tekrar sorular={tumSorular()} />;
}
