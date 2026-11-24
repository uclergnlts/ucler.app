// Videolar sekmesi 2026-11-24'te uygulamadan kalktı (Üçler). Eski bağlantılar (/videolar/#KIM-03) ana sayfaya gider.
// Videolar ilgili kartın altında gösterilmeye devam eder (components/Lesson.tsx).
import { cev } from "@/lib/dil";
import Yonlendir from "@/components/Yonlendir";
import { ANA } from "@/lib/site";

export const metadata = { title: cev("Ana sayfa"), robots: { index: false } };

export default function Page() {
  return <Yonlendir to={ANA} ad={cev("Ana sayfa")} />;
}
