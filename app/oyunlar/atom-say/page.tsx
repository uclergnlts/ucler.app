import { cev } from "@/lib/dil";
import AtomSayOyun from "@/components/AtomSayOyun";
import "../oyun.css";

export const metadata = { title: cev("Formülde atom say") };

export default function Page() {
  return <AtomSayOyun />;
}
