import { cev } from "@/lib/dil";
import Yonlendir from "@/components/Yonlendir";

// Etkileşimli adımların hepsi artık konu akışının içinde. Eski liste adresi Keşfet'e gider.
export const metadata = { title: cev("Keşfet"), robots: { index: false } };

export default function Page() {
  return <Yonlendir to="/kesfet/" ad={cev("Keşfet")} />;
}
