import { notFound } from "next/navigation";
import Road from "@/components/Road";
import { DERSLER, DERS_IDS, entries, isDers } from "@/lib/content";

type Props = { params: Promise<{ ders: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => DERS_IDS.map((ders) => ({ ders }));

export async function generateMetadata({ params }: Props) {
  const { ders } = await params;
  return { title: isDers(ders) ? DERSLER[ders].ad : undefined };
}

export default async function Page({ params }: Props) {
  const { ders } = await params;
  if (!isDers(ders)) notFound();
  return <Road ders={ders} list={entries(ders)} />;
}
