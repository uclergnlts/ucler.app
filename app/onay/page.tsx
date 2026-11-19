import { cev } from "@/lib/dil";
import Onay from "@/components/Onay";

export const metadata = { title: cev("Hesap onayı") };

export default function Page() {
  return <Onay />;
}
