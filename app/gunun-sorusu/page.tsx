import { cev } from "@/lib/dil";
import GunSorusu from "@/components/GunSorusu";
import { gunSorusuHavuzu } from "@/lib/content";

export const metadata = { title: cev("Günün sorusu"), robots: { index: false } };

export default function Page() {
  return <GunSorusu havuz={gunSorusuHavuzu()} />;
}
