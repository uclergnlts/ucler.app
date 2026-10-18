import { notFound } from "next/navigation";
import DersMotoru from "@/components/DersMotoru";
import { ADIMLI, adimliDers } from "@/lib/adimli";
import "../ornek.css";

type Props = { params: Promise<{ konu: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ADIMLI.map((d) => ({ konu: d.id }));

export async function generateMetadata({ params }: Props) {
  const d = adimliDers((await params).konu);
  return { title: d ? `${d.baslik} · örnek ders` : undefined, description: d?.ozet };
}

export default async function Page({ params }: Props) {
  const d = adimliDers((await params).konu);
  if (!d) notFound();
  return <DersMotoru key={d.id} ders={d} />;
}
