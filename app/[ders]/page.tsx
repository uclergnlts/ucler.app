import { notFound } from "next/navigation";
import Road from "@/components/Road";
import { cev } from "@/lib/dil";
import { DERSLER, DERS_IDS, entries, isDers } from "@/lib/content";
import { dilAdresleri, paylasim } from "@/lib/seo";

type Props = { params: Promise<{ ders: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => DERS_IDS.map((ders) => ({ ders }));

export async function generateMetadata({ params }: Props) {
  const { ders } = await params;
  if (!isDers(ders)) return {};
  const { ad, yol } = DERSLER[ders];
  const baslik = cev("{0} dersleri", ad), aciklama = cev("{0}: {1}. Kısa, etkileşimli kartlar ve her konunun sonunda mini test.", ad, yol);
  return {
    title: baslik, description: aciklama, ...paylasim(baslik, aciklama),
    alternates: dilAdresleri(`/${ders}/`, true),
  };
}

export default async function Page({ params }: Props) {
  const { ders } = await params;
  if (!isDers(ders)) notFound();
  return <Road ders={ders} list={entries(ders)} />;
}
