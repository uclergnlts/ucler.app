import { cev } from "@/lib/dil";
import HatirlatmaKapat from "@/components/HatirlatmaKapat";

export const metadata = { title: cev("E-posta bildirimleri"), robots: { index: false } };

export default function Page() {
  return <HatirlatmaKapat />;
}
