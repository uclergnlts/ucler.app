import Link from "next/link";
import { Bos, Top } from "@/components/temel";

export default function NotFound() {
  return (
    <div className="app">
      <Top />
      <main className="view">
        <Bos>
          Bu sayfa bulunamadı. <Link href="/" className="underline">Ana sayfaya dön</Link>
        </Bos>
      </main>
    </div>
  );
}
