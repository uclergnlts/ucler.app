import { cev } from "@/lib/dil";
import PlusSayfa from "@/components/PlusSayfa";

export const metadata = { title: cev("ucler Plus"), description: cev("Bütün konular için ucler Plus aboneliği.") };

export default function Page() {
  return <PlusSayfa />;
}
