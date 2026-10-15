import { notFound } from "next/navigation";
import Lesson from "@/components/Lesson";
import { isDers, nextTopic, readyTopics, topic } from "@/lib/content";

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
  // key: başka bir konuya geçince ders ekranı baştan başlasın.
  return <Lesson key={`${ders}.${konu}`} ders={ders} id={konu} t={t} next={n?.id ? { id: n.id, title: n.title! } : undefined} />;
}
