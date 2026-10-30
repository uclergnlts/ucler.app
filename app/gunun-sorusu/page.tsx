import GunSorusu from "@/components/GunSorusu";
import { gunSorusuHavuzu } from "@/lib/content";

export const metadata = { title: "Günün sorusu" };

export default function Page() {
  return <GunSorusu havuz={gunSorusuHavuzu()} />;
}
