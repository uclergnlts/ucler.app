import { cev } from "@/lib/dil";
import Lig from "@/components/Lig";

export const metadata = { title: cev("Haftalık lig") };

export default function Page() {
  return <Lig />;
}
