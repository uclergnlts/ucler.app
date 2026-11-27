import { cev } from "@/lib/dil";
import PeriyodikOyun from "@/components/PeriyodikOyun";

export const metadata = { title: cev("Periyodik tabloda yerini bul"), robots: { index: false } };

export default function Page() {
  return <PeriyodikOyun />;
}
