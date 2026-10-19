"use client";
// Her sayfada çalışır: günün ilk açılışında giriş puanını verir ve kazanılan ödülleri ekranın üstünde kısaca gösterir.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { girisYap, odulDinle, type Odul } from "@/lib/puan";

export default function Gunluk() {
  const [liste, setListe] = useState<Odul[]>([]);

  useEffect(() => {
    const kapat = odulDinle((o) => {
      setListe((l) => [...l.slice(-2), o]);
      setTimeout(() => setListe((l) => l.filter((x) => x.id !== o.id)), 2600);
    });
    girisYap();
    // Uygulama gece açık kalıp ertesi gün yeniden öne gelirse yeni günün girişi sayılsın.
    const gorunce = () => { if (document.visibilityState === "visible") girisYap(); };
    document.addEventListener("visibilitychange", gorunce);
    return () => { kapat(); document.removeEventListener("visibilitychange", gorunce); };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+10px)] z-30 flex flex-col items-center gap-1.5 px-4">
      <AnimatePresence>
        {liste.map((o) => (
          <motion.div
            key={o.id}
            layout
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex max-w-[480px] items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-[14px] font-semibold shadow-sm"
          >
            {o.puan > 0 && <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[13px] font-bold text-background tabular-nums">+{o.puan}</span>}
            <span className="truncate">{o.metin}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
