"use client";
// Çizim galerisinin ızgarası ve büyük görünümü (components/Cizimler.tsx). Büyük görünümde ok tuşları, Esc ve
// kaydırma çalışır; bir videonun son çiziminden sonraki videonun ilk çizimine geçilir.
import { useCallback, useEffect, useRef, useState } from "react";

export type Cizim = { id: string; video: string; ad: string; sekil: string };
export type Grup = { id: string; ust: string; baslik: string; youtube: string; izle: string; cizimler: Cizim[] };

const mono = "font-mono text-[11px] tracking-[.14em] uppercase text-[var(--muted)]";
const kaynak = (c: Cizim, buyuk: boolean) => `/cizim/${c.video}/${c.id}${buyuk ? "" : "-k"}.webp`;

export default function CizimGaleri({ gruplar, etiket }: { gruplar: Grup[]; etiket: { kapat: string; onceki: string; sonraki: string } }) {
  const hepsi = gruplar.flatMap((g) => g.cizimler);
  const [acik, setAcik] = useState<number | null>(null);
  const dokunus = useRef<number | null>(null);
  const kapatDugme = useRef<HTMLButtonElement>(null);
  const sonOdak = useRef<HTMLElement | null>(null);

  const git = useCallback((y: number) => setAcik((i) => (i === null ? i : (i + y + hepsi.length) % hepsi.length)), [hepsi.length]);
  const kapat = useCallback(() => { setAcik(null); sonOdak.current?.focus(); }, []);

  useEffect(() => {
    if (acik === null) return;
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") kapat();
      else if (e.key === "ArrowRight") git(1);
      else if (e.key === "ArrowLeft") git(-1);
    };
    window.addEventListener("keydown", tus);
    const tasma = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", tus); document.body.style.overflow = tasma; };
  }, [acik, git, kapat]);

  useEffect(() => { if (acik !== null) kapatDugme.current?.focus(); }, [acik]);

  // Bir sonraki büyük görseli önceden indir: oklarla geçişte boş kare görünmesin.
  useEffect(() => {
    if (acik === null) return;
    const img = new Image();
    img.src = kaynak(hepsi[(acik + 1) % hepsi.length], true);
  }, [acik, hepsi]);

  let sira = 0;
  const c = acik === null ? null : hepsi[acik];
  return (
    <>
      {gruplar.map((g) => (
        <section key={g.id} className="grid gap-6 border-t border-[var(--line)] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="grid gap-1.5">
              <p className={mono}>{g.ust}</p>
              <h2 className="font-display text-[26px] leading-tight font-extrabold sm:text-[32px]">{g.baslik}</h2>
            </div>
            <a href={`https://www.youtube.com/watch?v=${g.youtube}`} className="font-bold text-[var(--btn)]">{g.izle} →</a>
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 md:grid-cols-3">
            {g.cizimler.map((z) => {
              const i = sira++;
              return (
                <li key={z.id}>
                  <button
                    type="button"
                    onClick={(e) => { sonOdak.current = e.currentTarget; setAcik(i); }}
                    className="cizim-kart group grid w-full gap-2 text-left"
                  >
                    <span className="relative block overflow-hidden rounded-md border border-[var(--line)] bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={kaynak(z, false)} alt={z.ad} width={640} height={360} loading="lazy" decoding="async"
                        className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      {/* Üstüne gelince köşeden çıkan minik Çizgi ve çizimi gösteren pembe ok (kanal kapağı kalıbı). */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/tanitim/cizgi.svg" alt="" aria-hidden className="cizim-mini" />
                      <svg viewBox="0 0 120 90" aria-hidden className="cizim-mini-ok" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 80C30 50 60 28 104 18" /><path d="M80 8l24 10-16 22" />
                      </svg>
                    </span>
                    <span className="grid gap-0.5">
                      <span className={mono}>{z.sekil}</span>
                      <span className="text-[15px] leading-snug font-semibold">{z.ad}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {c && acik !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={c.ad}
          className="fixed inset-0 z-50 grid grid-rows-[auto_1fr_auto] bg-[#070a12]"
          onClick={(e) => { if (e.target === e.currentTarget) kapat(); }}
          onTouchStart={(e) => { dokunus.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (dokunus.current === null) return;
            const fark = e.changedTouches[0].clientX - dokunus.current;
            dokunus.current = null;
            if (Math.abs(fark) > 50) git(fark < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className={mono}>{acik + 1} / {hepsi.length}</span>
            <button ref={kapatDugme} type="button" onClick={kapat} aria-label={etiket.kapat}
              className="grid size-11 place-items-center rounded-md border border-[var(--line-2)] text-[var(--ink)] hover:border-[var(--ink)]">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="relative grid min-h-0 place-items-center px-2 sm:px-16" onClick={(e) => { if (e.target === e.currentTarget) kapat(); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={c.id} src={kaynak(c, true)} alt={c.ad} width={1440} height={810} className="max-h-full w-auto max-w-full object-contain" />
            <button type="button" onClick={() => git(-1)} aria-label={etiket.onceki}
              className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 place-items-center rounded-md border border-[var(--line-2)] bg-[#070a12]/70 hover:border-[var(--ink)] sm:grid">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" onClick={() => git(1)} aria-label={etiket.sonraki}
              className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 place-items-center rounded-md border border-[var(--line-2)] bg-[#070a12]/70 hover:border-[var(--ink)] sm:grid">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="grid gap-0.5">
              <span className={mono}>{c.sekil}</span>
              <span className="font-display text-[18px] font-extrabold">{c.ad}</span>
            </div>
            <div className="flex gap-2 sm:hidden">
              <button type="button" onClick={() => git(-1)} aria-label={etiket.onceki} className="grid size-11 place-items-center rounded-md border border-[var(--line-2)]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => git(1)} aria-label={etiket.sonraki} className="grid size-11 place-items-center rounded-md border border-[var(--line-2)]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
