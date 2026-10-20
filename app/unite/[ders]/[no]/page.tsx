import { notFound } from "next/navigation";
import UniteTesti from "@/components/UniteTesti";
import { DERS_IDS, DERSLER, entries, isDers, uniteSorulari } from "@/lib/content";
import { uniteler } from "@/lib/kilit";
import "../../../adim.css";

type Props = { params: Promise<{ ders: string; no: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  DERS_IDS.flatMap((ders) => uniteler(entries(ders)).map((u) => ({ ders, no: String(u.no) })));

export async function generateMetadata({ params }: Props) {
  const { ders, no } = await params;
  return { title: isDers(ders) ? `${DERSLER[ders].ad} · ${no}. ünite testi` : undefined };
}

export default async function Page({ params }: Props) {
  const { ders, no } = await params;
  if (!isDers(ders)) notFound();
  const n = Number(no), list = entries(ders);
  if (!uniteler(list).some((u) => u.no === n)) notFound();
  return <UniteTesti ders={ders} no={n} list={list} sorular={uniteSorulari(ders, n)} />;
}
