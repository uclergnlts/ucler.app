"use client";
// Ders ekranında kartın üstünde açılan video. Kapatınca öğrenci kaldığı karttan devam eder.
// Yerel <dialog> (showModal): odak pencerenin içinde kalır, arkadaki ders etkileşime kapanır,
// Escape kapatır ve kapanınca odak açma düğmesine döner.
import { useEffect, useRef } from "react";
import type { Video } from "@/lib/videolar";
import { kaydet, PUAN } from "@/lib/puan";
import Cevap from "./Cevap";
import { Button } from "./ui/button";

export default function VideoPlayer({ v, onClose }: { v: Video; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const kapat = useRef<HTMLButtonElement>(null);
  const izlendi = useRef(false);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const opener = document.activeElement as HTMLElement | null;
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!d.open) d.showModal();
    kapat.current?.focus();
    return () => {
      d.querySelector("video")?.pause();
      if (d.open) d.close();
      document.body.style.overflow = o;
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="player"
      aria-label={v.baslik}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="player-in">
        <video
          src={v.src}
          poster={v.poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onTimeUpdate={(e) => {
            // Videonun %80'i izlenince bir kez sayılır.
            const el = e.currentTarget;
            if (!izlendi.current && el.currentTime >= 0.8 * (el.duration || Infinity)) { izlendi.current = true; kaydet("video", 1, PUAN.video); }
          }}
        />
        <div className="player-bar">
          <span><b>{v.baslik}</b><Cevap v={v} /></span>
          <Button ref={kapat} variant="outline" className="h-11 flex-none" onClick={onClose}>Karta dön</Button>
        </div>
      </div>
    </dialog>
  );
}
