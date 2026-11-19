import { cev } from "@/lib/dil";
import SifreYenile from "@/components/SifreYenile";

export const metadata = { title: cev("Yeni şifre") };

export default function Page() {
  return <SifreYenile />;
}
