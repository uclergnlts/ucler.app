"use client";
// Eski adresleri yenisine taşır. Site statik çıktı olduğu için (next.config.ts) sunucu yönlendirmesi yok;
// sayfa açılınca tarayıcı yeni adrese geçer. Betik çalışmazsa bağlantı görünür.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Yonlendir({ to, ad }: { to: string; ad: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to.includes("#") ? to : to + location.hash);
  }, [router, to]);
  return (
    <div className="app">
      <main className="view items-center justify-center text-center text-[15px] text-muted-foreground">
        <p>
          Bu sayfa taşındı: <Link href={to} className="font-semibold text-foreground underline">{ad}</Link>
        </p>
      </main>
    </div>
  );
}
