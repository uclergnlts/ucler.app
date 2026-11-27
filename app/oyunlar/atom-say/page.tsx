import { cev } from "@/lib/dil";
import AtomSayOyun from "@/components/AtomSayOyun";
import "../oyun.css";

export const metadata = { title: cev("Formülde atom say"), robots: { index: false } };

export default function Page() {
  return <AtomSayOyun />;
}
