"use client";
// "Soru önce" pilot sahneleri (adları so- ile başlar). Öğrenci değeri altta bir sürgüyle değil, görselin kendisini
// sürükleyerek ya da ona dokunarak değiştirir (kontrol türü "surukle"). Tutamaç ilk dokunuşa kadar hafifçe nabız atar.
import { useEffect, useRef, useState } from "react";
import { Araba, Balon, Eksen, G, X, Yol, gX, gY, svgNokta, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sayi = (s: unknown, yedek: number) => (typeof s === "number" ? s : yedek);
const sinirla = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Sürükleme: işaretçi basılıyken her harekette viewBox koordinatını verir. */
function useSurukle(tasi: (q: DOMPoint) => void) {
  const svg = useRef<SVGSVGElement>(null);
  const tut = useRef(false);
  const [dokundu, setDokundu] = useState(false);
  const git = (e: React.PointerEvent) => { if (svg.current) tasi(svgNokta(svg.current, e)); };
  const olaylar = {
    onPointerDown: (e: React.PointerEvent) => { tut.current = true; setDokundu(true); (e.target as Element).setPointerCapture?.(e.pointerId); git(e); },
    onPointerMove: (e: React.PointerEvent) => { if (tut.current) git(e); },
    onPointerUp: () => { tut.current = false; },
    onPointerCancel: () => { tut.current = false; },
  };
  return { svg, olaylar, dokundu };
}

/** Sürüklenen tutamaç: dolu daire, içinde iki yönlü ok; ilk dokunuşa kadar çevresinde nabız halkası. */
function Tutamac({ x, y, yon = "yatay", nabiz }: { x: number; y: number; yon?: "yatay" | "dikey"; nabiz: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      {nabiz && <circle r={15} fill="none" stroke="var(--acc)" strokeWidth={2.5} className="ad-nabiz" />}
      <circle r={13} fill="var(--acc)" stroke="#fff" strokeWidth={2.5} />
      <path
        d={yon === "yatay" ? "M-7 0 L-3 -4 L-3 4 Z M7 0 L3 -4 L3 4 Z" : "M0 -7 L-4 -3 L4 -3 Z M0 7 L-4 3 L4 3 Z"}
        fill="#fff"
      />
    </g>
  );
}

/* ---------- fizik: v-t grafiğinin altındaki alan ---------- */

// Öğrenci grafikteki zaman tutamacını sürükler (v.t); üstteki araba o ana kadar gittiği yerde durur.
// s.v0 başlangıç hızı, s.a ivme (0: sabit hız), s.tMax, s.yMax, s.hedef: yoldaki bayrak (m).
function VtAlan({ s, v, set }: SahneProps) {
  const v0 = sayi(s.v0, 5), a = sayi(s.a, 0), tMax = sayi(s.tMax, 6), yMax = sayi(s.yMax, 10), hedef = sayi(s.hedef, 20);
  const t = v.t ?? 0;
  const hiz = (k: number) => v0 + a * k;
  const dx = v0 * t + 0.5 * a * t * t;
  const { svg, olaylar, dokundu } = useSurukle((q) => set("t", sinirla(Math.round((((q.x - G.x0) / (G.x1 - G.x0)) * tMax) * 2) / 2, 0, tMax)));
  const oldu = Math.abs(dx - hedef) < 1e-9;
  const dikdortgen = `M${gX(0, tMax)} ${gY(0, yMax)} L${gX(0, tMax)} ${gY(v0, yMax)} L${gX(t, tMax)} ${gY(v0, yMax)} L${gX(t, tMax)} ${gY(0, yMax)} Z`;
  const ucgen = `M${gX(0, tMax)} ${gY(v0, yMax)} L${gX(t, tMax)} ${gY(hiz(t), yMax)} L${gX(t, tMax)} ${gY(v0, yMax)} Z`;
  return (
    <svg ref={svg} viewBox="0 -16 340 316" className="ad-surukle" role="img" aria-label={`t = ${t} s, araba ${dx} m gitti`} {...olaylar}>
      <g opacity={oldu ? 0.35 : 1}>
        <line x1={X(hedef)} x2={X(hedef)} y1={4} y2={48} stroke="var(--c4)" strokeWidth={2} />
        <path d={`M${X(hedef)} 4 L${X(hedef) + 16} 9.5 L${X(hedef)} 15 Z`} fill="var(--c4)" />
      </g>
      <Yol y={22} etiket={false} />
      <Araba x={X(dx)} y={35} />
      <Balon x={X(dx)} y={14} yazi={`${dx.toLocaleString("tr-TR")} m`} renk={oldu ? "var(--good)" : "var(--ink)"} />
      <Eksen tMax={tMax} yMax={yMax} yAd="v (m/s)" yAdim={yMax / 5} />
      {v0 > 0 && <path d={dikdortgen} fill="var(--c1)" fillOpacity={0.28} />}
      {a > 0 && t > 0 && <path d={ucgen} fill="var(--c2)" fillOpacity={0.3} />}
      <line x1={gX(0, tMax)} y1={gY(v0, yMax)} x2={gX(tMax, tMax)} y2={gY(hiz(tMax), yMax)} stroke="var(--c1)" strokeWidth={3} strokeLinecap="round" />
      {t > 0 && (
        <g fontSize={11.5} fontWeight={700} textAnchor="middle" pointerEvents="none">
          {v0 > 0 && <text x={(gX(0, tMax) + gX(t, tMax)) / 2} y={gY(v0 / 2, yMax) + 4} fill="var(--c1)">{v0}·{t.toLocaleString("tr-TR")}</text>}
          {a > 0 && t >= 1.5 && <text x={gX(t * 0.68, tMax)} y={gY(v0 + a * t * 0.3, yMax) + 4} fill="var(--c2)">½·{hiz(t).toLocaleString("tr-TR")}·{t.toLocaleString("tr-TR")}</text>}
        </g>
      )}
      <line x1={gX(t, tMax)} x2={gX(t, tMax)} y1={G.y0 - 6} y2={G.y1} stroke="var(--acc)" strokeWidth={2} strokeDasharray="4 4" pointerEvents="none" />
      <Tutamac x={gX(t, tMax)} y={G.y1} nabiz={!dokundu} />
    </svg>
  );
}

/* ---------- fizik: serbest düşme ---------- */

// Hava olmayan bir tüpte gülle ile tüy aynı anda bırakılır (sure 2). Her 0,4 s'lik konum soluk iz olarak kalır.
const DUS_UST = 44, DUS_PX = 10.5; // 0 m ve metre başına piksel (20 m)
function Dusme({ t, oynuyor, kosular }: SahneProps) {
  const tt = oynuyor || t > 0 ? t : 0;
  const y = (k: number) => DUS_UST + 5 * k * k * DUS_PX;
  const izler = [0.4, 0.8, 1.2, 1.6].filter((k) => k < tt - 0.02);
  const bitti = !oynuyor && kosular.length > 0;
  const Gulle = ({ yy, soluk }: { yy: number; soluk?: boolean }) => (
    <g opacity={soluk ? 0.2 : 1}>
      <circle cx={110} cy={yy} r={15} fill="var(--ink)" />
      <circle cx={105} cy={yy - 5} r={4} fill="#fff" opacity={0.25} />
    </g>
  );
  const Tuy = ({ yy, soluk }: { yy: number; soluk?: boolean }) => (
    <g transform={`translate(230 ${yy}) rotate(-20)`} opacity={soluk ? 0.2 : 1}>
      <path d="M0 -17 C10 -10 10 8 0 17 C-10 8 -10 -10 0 -17 Z" fill="var(--c4)" />
      <line x1={0} y1={-14} x2={0} y2={22} stroke="#b7800d" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 312" role="img" aria-label="Havası alınmış tüpte gülle ve tüy aynı yükseklikten bırakılıyor">
      <rect x={70} y={4} width={200} height={282} rx={18} fill="var(--c1)" fillOpacity={0.05} stroke="var(--line-2)" strokeWidth={1.5} />
      {[0, 5, 10, 15, 20].map((m) => (
        <g key={m}>
          <line x1={58} x2={70} y1={DUS_UST + m * DUS_PX} y2={DUS_UST + m * DUS_PX} stroke="var(--muted)" strokeWidth={1.2} />
          <text x={52} y={DUS_UST + m * DUS_PX + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">{m} m</text>
        </g>
      ))}
      <line x1={70} x2={270} y1={DUS_UST + 20 * DUS_PX + 16} y2={DUS_UST + 20 * DUS_PX + 16} stroke="var(--ink)" strokeWidth={2} />
      {izler.map((k) => <Gulle key={`g${k}`} yy={y(k)} soluk />)}
      {izler.map((k) => <Tuy key={`t${k}`} yy={y(k)} soluk />)}
      <Gulle yy={y(tt)} />
      <Tuy yy={y(tt)} />
      <text x={110} y={DUS_UST - 22} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">gülle 5 kg</text>
      <text x={230} y={DUS_UST - 22} fontSize={11.5} fontWeight={700} fill="#b7800d" textAnchor="middle">tüy 1 g</text>
      {bitti ? (
        <text x={170} y={305} fontSize={12.5} fontWeight={800} fill="var(--good)" textAnchor="middle" className="ad-belir">İkisi birlikte: 2 s'de 20 m</text>
      ) : (
        <text x={170} y={305} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">havası alınmış tüp</text>
      )}
    </svg>
  );
}

/* ---------- fizik: yukarı atış ---------- */

// Topun hız okunu yukarı sürükleyerek atış hızını seç (v.v0, 5'in katları), sonra oynat (sure 6).
// s.hedef: ulaşılması istenen yükseklik (m). Önceki atışların tepe noktası çizgi olarak kalır.
const YA_YER = 270, YA_PX = 4.4, YA_X = 150, YA_OK = 3.2; // yer, metre başına piksel, top, ok uzunluğu (px / (m/s))
function YukariAtis({ s, v, set, t, oynuyor, kosular }: SahneProps) {
  const v0 = v.v0 ?? 10, hedef = sayi(s.hedef, 20);
  const { svg, olaylar, dokundu } = useSurukle((q) => {
    if (oynuyor) return;
    set("v0", sinirla(Math.round((YA_YER - 14 - (q.y + 12)) / YA_OK / 5) * 5, 5, 30)); // tutamaç okun ucundan 12 px yukarıda
  });
  const tt = oynuyor || t > 0 ? t : 0;
  const ucus = (2 * v0) / 10;
  const k = Math.min(tt, ucus);
  const h = v0 * k - 5 * k * k, hiz = v0 - 10 * k;
  const yTop = YA_YER - 14 - h * YA_PX;
  const tepeler = [...new Set(kosular.map((x) => x.v0))];
  const ucY = YA_YER - 14 - v0 * YA_OK;
  const havada = tt > 0 && tt < ucus;
  return (
    <svg ref={svg} viewBox="0 0 340 290" className="ad-surukle" role="img" aria-label={`Top ${v0} m/s ile yukarı atılıyor`} {...olaylar}>
      {[0, 10, 20, 30, 40, 50].map((m) => (
        <g key={m}>
          <line x1={34} x2={44} y1={YA_YER - m * YA_PX} y2={YA_YER - m * YA_PX} stroke="var(--muted)" strokeWidth={1.2} />
          <text x={30} y={YA_YER - m * YA_PX + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">{m}</text>
        </g>
      ))}
      <text x={30} y={YA_YER - 50 * YA_PX - 12} fontSize={10.5} fill="var(--muted)" textAnchor="end">h (m)</text>
      <line x1={50} x2={320} y1={YA_YER - hedef * YA_PX} y2={YA_YER - hedef * YA_PX} stroke="var(--c4)" strokeWidth={2} strokeDasharray="6 5" />
      <text x={54} y={YA_YER - hedef * YA_PX - 6} fontSize={11.5} fontWeight={700} fill="#b7800d">hedef {hedef} m</text>
      {tepeler.map((x, i) => {
        const hm = (x * x) / 20;
        return hm <= 52 && (
          <g key={x} opacity={oynuyor ? 0.3 : 1}>
            <line x1={YA_X - 30} x2={YA_X + 30} y1={YA_YER - 14 - hm * YA_PX} y2={YA_YER - 14 - hm * YA_PX} stroke={["var(--c1)", "var(--c2)", "var(--c3)", "var(--c5)"][i % 4]} strokeWidth={2.5} strokeLinecap="round" />
            <text x={YA_X + 36} y={YA_YER - 14 - hm * YA_PX + 4} fontSize={11} fontWeight={700} fill="var(--muted)">{x} m/s → {hm.toLocaleString("tr-TR")} m</text>
          </g>
        );
      })}
      <rect x={50} y={YA_YER} width={270} height={12} rx={4} fill="#e6ebf2" />
      {!havada && tt === 0 && (
        <g>
          <line x1={YA_X} x2={YA_X} y1={YA_YER - 28} y2={ucY + 8} stroke="var(--c2)" strokeWidth={4} strokeLinecap="round" />
          <path d={`M${YA_X} ${ucY} L${YA_X - 7} ${ucY + 11} L${YA_X + 7} ${ucY + 11} Z`} fill="var(--c2)" />
          <text x={YA_X + 22} y={ucY + 30} fontSize={13} fontWeight={800} fill="var(--c2)">v₀ = {v0} m/s</text>
          <Tutamac x={YA_X} y={ucY - 12} yon="dikey" nabiz={!dokundu} />
        </g>
      )}
      {havada && Math.abs(hiz) > 0.6 && (
        <g>
          <line x1={YA_X + 26} x2={YA_X + 26} y1={yTop} y2={yTop - hiz * YA_OK * 0.8} stroke="var(--c2)" strokeWidth={3} strokeLinecap="round" />
          <path d={hiz > 0 ? `M${YA_X + 26} ${yTop - hiz * YA_OK * 0.8 - 7} l-5 8 l10 0 Z` : `M${YA_X + 26} ${yTop - hiz * YA_OK * 0.8 + 7} l-5 -8 l10 0 Z`} fill="var(--c2)" />
        </g>
      )}
      <circle cx={YA_X} cy={yTop} r={13} fill="var(--fizik)" />
      <circle cx={YA_X - 4} cy={yTop - 4} r={3.5} fill="#fff" opacity={0.35} />
      {tt > 0 && <Balon x={YA_X - 52} y={yTop + 4} yazi={`v = ${Math.round(hiz)} m/s`} renk={Math.abs(hiz) < 0.6 ? "var(--good)" : "var(--ink)"} />}
    </svg>
  );
}

/* ---------- kimya: dokunarak atom kur ---------- */
// components/sahne/atom.tsx içindeki "atom" sahnesinin dokunmalı hâli orada (atom-kur).

/* ---------- biyoloji: tanecikleri zara gönder ---------- */

// Soldaki üç tanecikten birine dokununca zara doğru gider: O₂ fosfolipitlerin arasından geçer, glikoz zara çarpıp
// taşıyıcı proteinden geçer, protein geçemeyip geri döner. Bitince v[ad] = 1 olur (kesfet hedefleri bunlara bakar).
type Tanecik = { ad: "o2" | "glikoz" | "protein"; yazi: string; renk: string; r: number; y: number };
const TANECIK: Tanecik[] = [
  { ad: "o2", yazi: "O₂", renk: "var(--c1)", r: 7, y: 60 },
  { ad: "glikoz", yazi: "glikoz", renk: "var(--c4)", r: 11, y: 124 },
  { ad: "protein", yazi: "protein", renk: "var(--c2)", r: 22, y: 192 },
];
const ZD_X = 196, ZD_TASIYICI = 140, ZD_SURE = 1.8;
function ZarDene({ v, set }: SahneProps) {
  const [ucan, setUcan] = useState<{ ad: Tanecik["ad"]; u: number } | null>(null);
  const [dokundu, setDokundu] = useState(false);
  useEffect(() => {
    if (!ucan || ucan.u >= 1) return;
    let id = 0;
    const bas = performance.now() - ucan.u * ZD_SURE * 1000;
    const kare = (now: number) => {
      const u = Math.min(1, (now - bas) / (ZD_SURE * 1000));
      setUcan((x) => (x ? { ...x, u } : x));
      if (u < 1) id = requestAnimationFrame(kare);
      else set(ucan.ad, 1);
    };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, [ucan?.ad]); // eslint-disable-line react-hooks/exhaustive-deps
  const yer = (k: Tanecik): { x: number; y: number } => {
    const gecti = v[k.ad] === 1 && k.ad !== "protein";
    if (!ucan || ucan.ad !== k.ad) return { x: gecti ? 280 : 56, y: k.ad === "glikoz" && gecti ? ZD_TASIYICI : k.y };
    const u = ucan.u, w = yumusak;
    if (k.ad === "o2") return { x: 56 + (280 - 56) * w(u), y: k.y };
    if (k.ad === "protein") {
      const git = u < 0.5 ? w(u * 2) : 1 - w((u - 0.5) * 2);
      return { x: 56 + (ZD_X - 26 - 56) * git, y: k.y };
    }
    // glikoz: zara çarp, geri sek, taşıyıcıya kay, içinden geç
    if (u < 0.3) return { x: 56 + (ZD_X - 22 - 56) * w(u / 0.3), y: k.y };
    if (u < 0.45) return { x: ZD_X - 22 - 24 * w((u - 0.3) / 0.15), y: k.y };
    if (u < 0.7) { const q = w((u - 0.45) / 0.25); return { x: ZD_X - 46 + 20 * q, y: k.y + (ZD_TASIYICI - k.y) * q }; }
    return { x: ZD_X - 26 + (280 - ZD_X + 26) * w((u - 0.7) / 0.3), y: ZD_TASIYICI };
  };
  const bas = Array.from({ length: 17 }, (_, i) => 26 + i * 12).filter((y) => Math.abs(y - ZD_TASIYICI) > 20);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Zarın solunda O₂, glikoz ve protein; birine dokununca zara gider">
      <text x={60} y={16} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">hücre dışı</text>
      <text x={280} y={16} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">hücre içi</text>
      {bas.map((y) => (
        <g key={y}>
          <line x1={ZD_X - 8} x2={ZD_X - 1} y1={y} y2={y} stroke="#e0b25c" strokeWidth={1.5} />
          <line x1={ZD_X + 1} x2={ZD_X + 8} y1={y} y2={y} stroke="#e0b25c" strokeWidth={1.5} />
          <circle cx={ZD_X - 10} cy={y} r={4} fill="var(--c1)" opacity={0.85} />
          <circle cx={ZD_X + 10} cy={y} r={4} fill="var(--c1)" opacity={0.85} />
        </g>
      ))}
      <rect x={ZD_X - 15} y={ZD_TASIYICI - 20} width={30} height={40} rx={11} fill="var(--c5)" />
      <rect x={ZD_X - 5} y={ZD_TASIYICI - 20} width={10} height={40} fill="#f6f8fb" opacity={0.9} />
      <text x={ZD_X + 18} y={ZD_TASIYICI - 24} fontSize={10.5} fontWeight={700} fill="var(--c5)">taşıyıcı protein</text>
      {TANECIK.map((k) => {
        const p = yer(k), bekliyor = !ucan || ucan.u >= 1;
        const hazir = bekliyor && v[k.ad] !== 1;
        return (
          <g
            key={k.ad}
            role="button"
            aria-label={`${k.yazi}: zara gönder`}
            tabIndex={hazir ? 0 : -1}
            style={{ cursor: hazir ? "pointer" : "default" }}
            onClick={() => { if (hazir) { setDokundu(true); setUcan({ ad: k.ad, u: 0 }); } }}
            onKeyDown={(e) => { if (hazir && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setUcan({ ad: k.ad, u: 0 }); } }}
          >
            {hazir && !dokundu && <circle cx={p.x} cy={p.y} r={k.r + 5} fill="none" stroke="var(--acc)" strokeWidth={2} className="ad-nabiz" />}
            {k.ad === "protein" ? (
              <path d={`M${p.x - 20} ${p.y} C${p.x - 22} ${p.y - 18} ${p.x - 2} ${p.y - 24} ${p.x + 8} ${p.y - 16} C${p.x + 24} ${p.y - 10} ${p.x + 24} ${p.y + 12} ${p.x + 6} ${p.y + 18} C${p.x - 8} ${p.y + 24} ${p.x - 20} ${p.y + 14} ${p.x - 20} ${p.y} Z`} fill={k.renk} />
            ) : k.ad === "glikoz" ? (
              <polygon points={Array.from({ length: 6 }, (_, i) => `${(p.x + k.r * Math.cos((i * Math.PI) / 3)).toFixed(1)},${(p.y + k.r * Math.sin((i * Math.PI) / 3)).toFixed(1)}`).join(" ")} fill={k.renk} />
            ) : (
              <g><circle cx={p.x - 5} cy={p.y} r={k.r} fill={k.renk} /><circle cx={p.x + 5} cy={p.y} r={k.r} fill={k.renk} /></g>
            )}
            <text x={p.x} y={p.y + k.r + 15} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{k.yazi}</text>
          </g>
        );
      })}
    </svg>
  );
}

export const SORU_ONCE: Record<string, SahneKaydi> = {
  "so-vt-alan": {
    C: VtAlan,
    geri: (v, s) => {
      const v0 = sayi(s.v0, 5), a = sayi(s.a, 0), t = v.t ?? 0, dx = v0 * t + 0.5 * a * t * t, hedef = sayi(s.hedef, 20);
      return dx === hedef ? null : { baslik: dx < hedef ? "Bayrağa varmadı" : "Bayrağı geçti", metin: `Araba ${dx.toLocaleString("tr-TR")} m gitti. Tutamacı ${dx < hedef ? "sağa" : "sola"} sürükle.` };
    },
  },
  "so-dusme": { C: Dusme },
  "so-yukari": {
    C: YukariAtis,
    geri: (v, s) => {
      const v0 = v.v0 ?? 10, hm = (v0 * v0) / 20, hedef = sayi(s.hedef, 20);
      if (hm === hedef) return null;
      return {
        baslik: hm > hedef ? "Fazla yükseğe çıktı" : "Hedefe ulaşmadı",
        metin: `${v0} m/s ile atılan top her saniye 10 m/s yavaşladı, ${v0 / 10} s sonra durdu ve ${hm.toLocaleString("tr-TR")} m'ye çıktı. Oku ${hm > hedef ? "kısalt" : "uzat"}.`,
      };
    },
  },
  "so-zar-dene": { C: ZarDene },
};
