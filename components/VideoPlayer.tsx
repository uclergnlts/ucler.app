"use client";
// Ders ekranında kartın üstünde açılan video. Kapatınca öğrenci kaldığı karttan devam eder.
// Yerel <dialog> (showModal): odak pencerenin içinde kalır, arkadaki ders etkileşime kapanır,
// Escape kapatır ve kapanınca odak açma düğmesine döner.
import { useEffect, useRef } from "react";
import type { Video } from "@/lib/videolar";
import Cevap from "./Cevap";

export default function VideoPlayer({ v, onClose }: { v: Video; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const opener = document.activeElement as HTMLElement | null;
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!d.open) d.showModal();
    d.querySelector<HTMLButtonElement>(".player-bar .btn")?.focus();
    return () => {
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
        <video src={v.src} poster={v.poster} controls autoPlay playsInline preload="metadata" />
        <div className="player-bar">
          <span><b>{v.baslik}</b><Cevap v={v} /></span>
          <button className="btn" onClick={onClose}>Karta dön</button>
        </div>
      </div>
    </dialog>
  );
}
