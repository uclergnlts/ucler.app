// Video sonundaki DÜŞÜN sorusunun cevabı. Kapalı başlar: öğrenci önce kendisi düşünür, sonra "Cevabı gör"e dokunur.
import type { Video } from "@/lib/videolar";

export default function Cevap({ v }: { v: Video }) {
  if (!v.cevap) return null;
  return (
    <details className="cevap">
      <summary>Cevabı gör</summary>
      <div className="cevap-in">
        <b>{v.soru}</b>
        <p>{v.cevap}</p>
      </div>
    </details>
  );
}
