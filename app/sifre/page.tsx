import { cev } from "@/lib/dil";
import SifreYenile from "@/components/SifreYenile";

export const metadata = { title: cev("Yeni şifre"), robots: { index: false } };

export default function Page() {
  return <SifreYenile />;
}
