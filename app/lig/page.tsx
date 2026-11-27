import { cev } from "@/lib/dil";
import Lig from "@/components/Lig";

export const metadata = { title: cev("Haftalık lig"), robots: { index: false } };

export default function Page() {
  return <Lig />;
}
