import { notFound } from "next/navigation";
import Yonlendir from "@/components/Yonlendir";
import { ADIMLI, adimliDers } from "@/lib/adimli";
import { topic } from "@/lib/content";

// Eski "örnek ders" adresleri: adımlar artık konu akışının içinde, bu yüzden konunun kendi sayfasına gider.
type Props = { params: Promise<{ konu: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ADIMLI.map((d) => ({ konu: d.id }));

export async function generateMetadata({ params }: Props) {
  const d = adimliDers((await params).konu);
  return { title: d ? topic(d.ders, d.konu)?.title : undefined, robots: { index: false } };
}

export default async function Page({ params }: Props) {
  const d = adimliDers((await params).konu);
  if (!d) notFound();
  return <Yonlendir to={`/${d.ders}/${d.konu}/`} ad={topic(d.ders, d.konu)?.title ?? d.baslik} />;
}
