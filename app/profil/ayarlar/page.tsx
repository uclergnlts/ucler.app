import { cev } from "@/lib/dil";
import Ayarlar from "@/components/profil/Ayarlar";

export const metadata = { title: cev("Ayarlar") };

export default function Page() {
  return <Ayarlar />;
}
