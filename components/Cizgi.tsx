"use client";
// Sitedeki hareketli Çizgi'ler (Üçler, 2026-11-20: 1, 2, 3, 4 ve 6 numaralı örnekler). Motor lib/cizgi.ts içindedir.
// - CizgiIzleyen: gözleriyle fareyi izler, göz kırpar, tıklanınca el sallar (tanıtım kapağı, çizimler sayfası başı).
// - CizgiDugme: içine konan butonun arkasında saklanır, fare gelince başını uzatır ve pembe ok çizilir.
// - CizgiYuruyen: sayfa sonunda kendi kendine yürür, durup el sallar; fare yaklaşınca durup bakar.
// - CizgiRadyo: 404 sayfasında radyosuyla sinyal arar.
// Galerideki minik Çizgi hareketsizdir (public/tanitim/cizgi.svg, components/CizimGaleri.tsx).
import { useEffect, useRef, useState } from "react";
import { CIZGI_VIEWBOX, cizgiDongu, cizgiKur, hareketAzalt } from "@/lib/cizgi";

export function CizgiIzleyen({ className = "", etiket }: { className?: string; etiket?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current!;
    const az = hareketAzalt();
    const c = cizgiKur(svg, { hareketsiz: az });
    let el = -1e9;
    const bak = (x: number, y: number) => {
      const r = svg.getBoundingClientRect();
      const dx = x - (r.left + r.width * 0.45), dy = y - (r.top + r.height * 0.28);
      const m = Math.hypot(dx, dy) || 1, g = Math.min(1, m / 220);
      c.hedef = [(dx / m) * g, (dy / m) * g];
    };
    const hareket = (e: PointerEvent) => bak(e.clientX, e.clientY);
    const tik = () => { el = performance.now(); };
    addEventListener("pointermove", hareket, { passive: true });
    addEventListener("pointerdown", hareket, { passive: true });
    svg.addEventListener("click", tik);
    const birak = cizgiDongu(svg, (t) => {
      const e = (t - el) / 1200;
      c.kolG = e < 1 && !az ? -150 + Math.sin(e * Math.PI * 6) * 22 : 0;
      c.ciz(t);
    });
    return () => { birak(); removeEventListener("pointermove", hareket); removeEventListener("pointerdown", hareket); svg.removeEventListener("click", tik); };
  }, []);
  return <svg ref={ref} viewBox={CIZGI_VIEWBOX} className={`cursor-pointer overflow-visible ${className}`} role="img" aria-label={etiket ?? "Çizgi"} />;
}

export function CizgiDugme({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [acik, setAcik] = useState(false);
  useEffect(() => {
    const svg = ref.current!;
    const c = cizgiKur(svg, { hareketsiz: hareketAzalt() });
    c.hedef = [-0.6, 0.7];
    c.kolG = -150;
    return cizgiDongu(svg, (t) => c.ciz(t));
  }, []);
  return (
    <span
      className={`cizgi-dugme ${acik ? "acik" : ""} ${className}`}
      onPointerEnter={() => setAcik(true)}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setAcik(false); }}
      onFocus={() => setAcik(true)}
      onBlur={() => setAcik(false)}
    >
      <span className="cizgi-dugme-saklanak" aria-hidden><svg ref={ref} viewBox={CIZGI_VIEWBOX} /></span>
      {children}
      <svg className="cizgi-dugme-ok" viewBox="0 0 120 90" aria-hidden fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M110 70C86 70 50 54 26 18" /><path d="M14 40l10-24 24 8" />
      </svg>
    </span>
  );
}

export function CizgiYuruyen({ className = "" }: { className?: string }) {
  const kutu = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const k = kutu.current!, svg = ref.current!;
    const az = hareketAzalt();
    const c = cizgiKur(svg, { hareketsiz: az });
    const d = { x: 24, durum: "yuru" as "yuru" | "dur" | "don", bitis: 0, durduMu: false, fare: null as number | null };
    const fare = (e: PointerEvent) => {
      const r = k.getBoundingClientRect();
      d.fare = e.clientY > r.top - 90 && e.clientY < r.bottom + 40 ? e.clientX - r.left : null;
    };
    addEventListener("pointermove", fare, { passive: true });
    const birak = cizgiDongu(k, (t, dt) => {
      const w = k.clientWidth, cw = svg.clientWidth;
      if (d.fare !== null) {
        c.yon = d.fare > d.x + cw / 2 ? 1 : -1; c.hedef = [0.8, -0.7]; c.adim *= 0.8; c.kolG = 0; c.zipla = 0;
      } else if (!az) {
        if (d.durum === "yuru") {
          d.x += 0.05 * dt * c.yon; c.adim += dt * 0.012; c.hedef = [0.6, 0.1]; c.kolG = 0;
          if (c.yon === 1 && !d.durduMu && d.x > w * 0.4) { d.durum = "dur"; d.bitis = t + 2400; d.durduMu = true; }
          if (d.x > w - cw - 8) { d.x = w - cw - 8; d.durum = "don"; d.bitis = t + 900; }
          if (d.x < 8) { d.x = 8; d.durum = "don"; d.bitis = t + 900; d.durduMu = false; }
        } else if (d.durum === "dur") {
          // Durur, izleyiciye döner, el sallar ve küçük bir zıplama yapar.
          c.adim *= 0.85; c.hedef = [0.2, 0.3];
          const p = 1 - (d.bitis - t) / 2400;
          c.kolG = p > 0.3 && p < 0.85 ? -150 + Math.sin(t / 110) * 20 : 0;
          c.zipla = p > 0.86 && p < 0.96 ? Math.sin(((p - 0.86) / 0.1) * Math.PI) * 14 : 0;
          if (t > d.bitis) { d.durum = "yuru"; c.zipla = 0; }
        } else {
          c.adim *= 0.8; c.hedef = [0.2, 0.2];
          if (t > d.bitis) { c.yon = c.yon === 1 ? -1 : 1; d.durum = "yuru"; }
        }
      }
      svg.style.transform = `translateX(${d.x}px)`;
      c.ciz(t);
    });
    return () => { birak(); removeEventListener("pointermove", fare); };
  }, []);
  return (
    <div ref={kutu} aria-hidden className={`pointer-events-none relative h-[64px] ${className}`}>
      <svg ref={ref} viewBox={CIZGI_VIEWBOX} className="absolute bottom-[-4px] left-0 w-[52px] overflow-visible" />
    </div>
  );
}

export function CizgiRadyo({ className = "", etiket }: { className?: string; etiket?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current!;
    const az = hareketAzalt();
    const c = cizgiKur(svg, { radyo: true, hareketsiz: az });
    c.kolG = -135;
    c.hedef = [0.5, -0.8];
    return cizgiDongu(svg, (t) => {
      if (!az) {
        // Kolu 7 saniyelik döngüde yorulup düşer, sonra yeniden kalkar.
        const p = (t % 7000) / 7000;
        const y = p < 0.55 ? 0 : p < 0.7 ? (p - 0.55) / 0.15 : p < 0.85 ? 1 : 1 - (p - 0.85) / 0.15;
        c.kolG = -135 + y * 95;
        c.hedef = [0.5 - y * 0.4, -0.8 + y * 1.4];
        c.isik?.setAttribute("opacity", Math.floor(t / 600) % 2 ? "0.25" : "1");
      }
      c.ciz(t);
    });
  }, []);
  return <svg ref={ref} viewBox="-80 -300 260 315" className={`overflow-visible ${className}`} role="img" aria-label={etiket ?? "Çizgi"} />;
}
