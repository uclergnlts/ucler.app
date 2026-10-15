import Link from "next/link";
import { Top } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="app">
      <Top />
      <main className="view">
        <div className="empty">
          Bu sayfa bulunamadı. <Link href="/" style={{ textDecoration: "underline" }}>Ana sayfaya dön</Link>
        </div>
      </main>
    </div>
  );
}
