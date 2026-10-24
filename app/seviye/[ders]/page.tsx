import { Suspense } from "react";
import { notFound } from "next/navigation";
import SeviyeTesti from "@/components/SeviyeTesti";
import { DERS_IDS, DERSLER, dersSorulari, entries, isDers } from "@/lib/content";
import "../../adim.css";

type Props = { params: Promise<{ ders: string }> };

// Her ders için tek sayfa; hangi konunun seviye testi olduğu adresteki ?konu= ile gelir.
export const dynamicParams = false;
export const generateStaticParams = () => DERS_IDS.map((ders) => ({ ders }));

export async function generateMetadata({ params }: Props) {
  const { ders } = await params;
  return { title: isDers(ders) ? `${DERSLER[ders].ad} · seviye testi` : undefined };
}

export default async function Page({ params }: Props) {
  const { ders } = await params;
  if (!isDers(ders)) notFound();
  return <Suspense><SeviyeTesti ders={ders} list={entries(ders)} sorular={dersSorulari(ders)} /></Suspense>;
}
