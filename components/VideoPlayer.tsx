"use client";
// Ders ekranında kartın üstünde açılan video. Kapatınca öğrenci kaldığı karttan devam eder.
import { useEffect } from "react";
import type { Video } from "@/lib/videolar";

export default function VideoPlayer({ v, onClose }: { v: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      e.stopPropagation();
    };
    document.addEventListener("keydown", onKey, true);
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = o;
    };
  }, [onClose]);

  return (
    <div
      className="player"
      role="dialog"
      aria-modal="true"
      aria-label={v.baslik}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="player-in">
        <video src={v.src} poster={v.poster} controls autoPlay playsInline preload="metadata" />
        <div className="player-bar">
          <b>{v.baslik}</b>
          <button className="btn" onClick={onClose}>Karta dön</button>
        </div>
      </div>
    </div>
  );
}
