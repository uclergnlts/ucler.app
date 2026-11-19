import { cev } from "@/lib/dil";
import OrganelOyun from "@/components/OrganelOyun";
import "../oyun.css";

export const metadata = { title: cev("Organeli bul") };

export default function Page() {
  return <OrganelOyun />;
}
