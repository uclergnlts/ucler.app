import { cev } from "@/lib/dil";
import VektorOyun from "@/components/VektorOyun";
import "../oyun.css";

export const metadata = { title: cev("Vektörle hedefi vur"), robots: { index: false } };

export default function Page() {
  return <VektorOyun />;
}
