import { cev } from "@/lib/dil";
import Giris from "@/components/Giris";

export const metadata = { title: cev("Hesap"), robots: { index: false } };

export default function Page() {
  return <Giris />;
}
