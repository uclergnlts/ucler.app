import { notFound } from "next/navigation";
import Lesson from "@/components/Lesson";
import { entries, isDers, nextTopic, readyTopics, topic } from "@/lib/content";
import { adimliDers } from "@/lib/adimli";
import "../../adim.css";

type Props = { params: Promise<{ ders: string; konu: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => readyTopics().map(({ ders, id }) => ({ ders, konu: id }));

export async function generateMetadata({ params }: Props) {
  const { ders, konu } = await params;
  const t = isDers(ders) ? topic(ders, konu) : undefined;
  return { title: t?.title, description: t?.summary };
}

export default async function Page({ params }: Props) {
  const { ders, konu } = await params;
  const t = isDers(ders) ? topic(ders, konu) : undefined;
  if (!isDers(ders) || !t) notFound();
  const n = nextTopic(ders, konu);
  const a = adimliDers(konu);
  const list = entries(ders);
  const bu = list.find((e) => e.id === konu);
  const on = (bu?.on ?? []).map((o) => ({ id: o, title: list.find((e) => e.id === o)?.title ?? o }));
  // key: başka bir konuya geçince ders ekranı baştan başlasın.
  return <Lesson key={`${ders}.${konu}`} ders={ders} id={konu} t={t} next={n?.id ? { id: n.id, title: n.title! } : undefined}
    adimli={a && a.ders === ders ? a : undefined} on={on} />;
}
