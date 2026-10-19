import Yonlendir from "@/components/Yonlendir";

// Etkileşimli adımların hepsi artık konu akışının içinde. Eski liste adresi Keşfet'e gider.
export const metadata = { title: "Keşfet", robots: { index: false } };

export default function Page() {
  return <Yonlendir to="/kesfet/" ad="Keşfet" />;
}
