"use client";
// Fizik sahneleri: düz yolda giden araba, her saniye çekilen kareler, konum-zaman ve hız-zaman grafikleri.
import { useRef } from "react";
import {
  Araba, Balon, Eksen, G, Ok, PX, RENK, ROAD_H, X, X0, Yol, gX, gY, svgNokta, yumusak,
  type SahneKaydi, type SahneProps,
} from "./ortak";

const sayi = (s: unknown, yedek: number) => (typeof s === "number" ? s : yedek);

// Arabayı sürükle: v.x (m). s.hedef: bayrağın yeri.
function Konum({ s, v, set }: SahneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const tut = useRef(false);
  const m = v.x ?? 0, hedef = sayi(s.hedef, 30), oldu = m === hedef;
  const tasi = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const q = svgNokta(svg.current, e);
    set("x", Math.max(0, Math.min(50, Math.round((q.x - X0) / PX))));
  };
  return (
    <svg
      ref={svg} viewBox="0 40 340 130" className="ad-surukle" role="img" aria-label={`Araba x = ${m} m konumunda`}
      onPointerDown={(e) => { tut.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); tasi(e); }}
      onPointerMove={(e) => tut.current && tasi(e)}
      onPointerUp={() => (tut.current = false)}
    >
      <g opacity={oldu ? 0.35 : 1}>
        <line x1={X(hedef)} x2={X(hedef)} y1={52} y2={104} stroke="var(--c4)" strokeWidth={2} />
        <path d={`M${X(hedef)} 52 L${X(hedef) + 18} 58 L${X(hedef)} 64 Z`} fill="var(--c4)" />
      </g>
      <line x1={X(0)} x2={X(0)} y1={70} y2={104} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 3" />
      <text x={X(0)} y={64} fontSize={11} fill="var(--muted)" textAnchor="middle">başlangıç</text>
      <Yol y={104} />
      <Ok x1={X(0)} x2={X(m)} y={92} renk="var(--c1)" kalin={2} />
      <Araba x={X(m)} y={117} />
      <Balon x={X(m)} y={84 - (m > 2 ? 10 : 0)} yazi={`x = ${m} m`} renk={oldu ? "var(--good)" : "var(--ink)"} />
    </svg>
  );
}

// 40 m ileri, 30 m geri (sure 4).
function YerDegistirme({ t, oynuyor, kosular }: SahneProps) {
  const m = t < 2 ? 40 * yumusak(t / 2) : t < 3.5 ? 40 - 30 * yumusak((t - 2) / 1.5) : 10;
  const enUzak = t < 2 ? m : 40;
  const bitti = !oynuyor && kosular.length > 0;
  return (
    <svg viewBox="0 0 340 190" role="img" aria-label="Araba 40 m ileri, sonra 30 m geri gidiyor">
      <Ok x1={X(0)} x2={X(enUzak)} y={30} renk="var(--c1)" />
      {enUzak > 4 && <text x={X(20)} y={22} fontSize={12} fontWeight={700} fill="var(--c1)" textAnchor="middle">40 m ileri</text>}
      {t > 2 && <Ok x1={X(40)} x2={X(m)} y={56} renk="var(--c2)" />}
      {t > 2.6 && <text x={X(25)} y={48} fontSize={12} fontWeight={700} fill="var(--c2)" textAnchor="middle">30 m geri</text>}
      {bitti && (
        <g className="ad-belir">
          <Ok x1={X(0)} x2={X(10)} y={84} renk="var(--good)" kalin={4} />
          <text x={X(10) + 8} y={88} fontSize={13} fontWeight={800} fill="var(--good)">Δx = +10 m</text>
          <text x={X(50)} y={88} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="end">yol = 70 m</text>
        </g>
      )}
      <Yol y={124} />
      <Araba x={X(m)} y={137} ters={t > 2 && t < 3.5} />
    </svg>
  );
}

// İki şerit, her saniye bir kare (sure 5). s.vA sabit, v.vB öğrencinin.
function HizSerit({ s, v, t, oynuyor }: SahneProps) {
  const vA = sayi(s.vA, 5), vB = v.vB ?? 8;
  const goster = oynuyor || t > 0;
  const tt = goster ? t : 0;
  const saniyeler = [0, 1, 2, 3, 4, 5].filter((k) => k <= tt + 1e-6);
  const serit = (hiz: number, y: number, renk: string, ad: string) => (
    <g>
      <text x={4} y={y + ROAD_H + 20} fontSize={13} fontWeight={800} fill={renk}>{ad}</text>
      <Yol y={y} etiket={false} />
      {saniyeler.map((k) => k < tt - 0.05 && <Araba key={k} x={X(hiz * k)} y={y + 13} renk={renk} soluk olcek={0.75} />)}
      {saniyeler.map((k) => (
        <g key={`n${k}`}>
          <circle cx={X(hiz * k)} cy={y + ROAD_H + 7} r={3} fill={renk} />
          {(k === 0 || k === 5 || hiz >= 4) && <text x={X(hiz * k)} y={y + ROAD_H + 20} fontSize={10} fill="var(--muted)" textAnchor="middle">{k} s</text>}
        </g>
      ))}
      <Araba x={X(hiz * tt)} y={y + 13} renk={renk} olcek={0.75} />
    </g>
  );
  return (
    <svg viewBox="0 0 340 170" role="img" aria-label="İki araba, her saniye çekilmiş karelerle">
      {serit(vA, 18, "var(--c1)", "A")}
      {serit(vB, 96, "var(--c2)", "B")}
    </svg>
  );
}

// Sabit hızlı araba ve konum-zaman grafiği (sure 5). Önceki koşuların çizgileri kalır.
function KonumZaman({ v, t, oynuyor, kosular }: SahneProps) {
  const hiz = v.v ?? 4;
  const eski = [...new Set(kosular.map((k) => k.v))];
  const renkOf = (h: number) => RENK[Math.max(0, eski.indexOf(h)) % RENK.length];
  const simdiki = eski.includes(hiz) ? renkOf(hiz) : RENK[eski.length % RENK.length];
  return (
    <svg viewBox="0 0 340 300" role="img" aria-label="Araba ve konum-zaman grafiği">
      <Yol y={22} etiket={false} />
      <Araba x={X(hiz * (oynuyor ? t : 0))} y={35} renk={simdiki} />
      <Eksen tMax={5} yMax={50} yAd="x (m)" yAdim={10} />
      {eski.map((h) => (
        <g key={h} opacity={oynuyor ? 0.35 : 1}>
          <line x1={gX(0, 5)} y1={gY(0, 50)} x2={gX(5, 5)} y2={gY(5 * h, 50)} stroke={renkOf(h)} strokeWidth={2.5} strokeLinecap="round" />
          <text x={gX(5, 5) + 2} y={gY(5 * h, 50) + (h === 10 ? 12 : -5)} fontSize={11} fontWeight={700} fill={renkOf(h)} textAnchor="end">{h} m/s</text>
        </g>
      ))}
      {oynuyor && (
        <g>
          <line x1={gX(0, 5)} y1={gY(0, 50)} x2={gX(t, 5)} y2={gY(hiz * t, 50)} stroke={simdiki} strokeWidth={3} strokeLinecap="round" />
          <circle cx={gX(t, 5)} cy={gY(hiz * t, 50)} r={5} fill={simdiki} />
        </g>
      )}
    </svg>
  );
}

// Durgun başlayıp hızlanan araba ve hız-zaman grafiği (sure 5).
function Ivme({ v, t, oynuyor }: SahneProps) {
  const a = v.a ?? 2;
  const goster = oynuyor || t > 0;
  const tt = goster ? t : 0;
  const x = (k: number) => 0.5 * a * k * k;
  const kareler = [0, 1, 2, 3, 4, 5].filter((k) => k < tt - 0.05);
  return (
    <svg viewBox="0 -18 340 318" role="img" aria-label="Hızlanan araba ve hız-zaman grafiği">
      <Yol y={22} etiket={false} />
      {kareler.map((k) => <Araba key={k} x={X(x(k))} y={35} soluk olcek={0.75} />)}
      {kareler.map((k) => <circle key={`d${k}`} cx={X(x(k))} cy={22 + ROAD_H + 7} r={3} fill="var(--c1)" />)}
      <Araba x={X(x(tt))} y={35} olcek={0.75} />
      <Balon x={X(x(tt))} y={14} yazi={`v = ${(a * tt).toFixed(0)} m/s`} />
      <Eksen tMax={5} yMax={20} yAd="v (m/s)" yAdim={5} />
      {goster && (
        <g>
          <line x1={gX(0, 5)} y1={gY(0, 20)} x2={gX(tt, 5)} y2={gY(a * tt, 20)} stroke="var(--c1)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={gX(tt, 5)} cy={gY(a * tt, 20)} r={5} fill="var(--c1)" />
        </g>
      )}
    </svg>
  );
}

// Üç parçalı konum-zaman grafiğini oynat: ileri, dur, geri (sure 6).
function GrafikOku({ t, oynuyor }: SahneProps) {
  const xt = (k: number) => (k <= 2 ? 15 * k : k <= 4 ? 30 : 30 - 10 * (k - 4));
  const nokta = [[0, 0], [2, 30], [4, 30], [6, 10]] as const;
  const d = nokta.map(([k, m], i) => `${i ? "L" : "M"}${gX(k, 6)} ${gY(m, 40)}`).join(" ");
  return (
    <svg viewBox="0 0 340 300" role="img" aria-label="Üç parçalı konum-zaman grafiği">
      <Yol y={22} etiket={false} />
      <Araba x={X(xt(t))} y={35} ters={t > 4 && t < 6} />
      <rect x={gX(2, 6)} y={G.y0} width={gX(4, 6) - gX(2, 6)} height={G.y1 - G.y0} fill="var(--glow-soft)" />
      <Eksen tMax={6} yMax={40} yAd="x (m)" yAdim={10} />
      <path d={d} fill="none" stroke="var(--c1)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {(oynuyor || t > 0) && (
        <g>
          <line x1={gX(t, 6)} x2={gX(t, 6)} y1={G.y0} y2={G.y1} stroke="var(--ink)" strokeDasharray="3 3" />
          <circle cx={gX(t, 6)} cy={gY(xt(t), 40)} r={5.5} fill="var(--ink)" />
        </g>
      )}
    </svg>
  );
}

export const HAREKET: Record<string, SahneKaydi> = {
  konum: { C: Konum },
  "yer-degistirme": { C: YerDegistirme },
  "hiz-serit": {
    C: HizSerit,
    geri: (v, s) => {
      const vA = sayi(s.vA, 5), vB = v.vB ?? 0;
      if (vB === vA) return null;
      return {
        baslik: vB > vA ? "B öne geçti" : "B geride kaldı",
        metin: `B her saniye ${vB} m gidiyor, A ise ${vA} m. Kareler arasındaki boşluklar eşit olana kadar hızı değiştir.`,
      };
    },
  },
  "konum-zaman": { C: KonumZaman },
  ivme: { C: Ivme },
  "grafik-oku": { C: GrafikOku },
};
