// Adımlı derslerin sahnelerinde ortak çizim parçaları ve sahne sözleşmesi.
import type { Sahne } from "@/lib/adimli";

/** Motorun her sahneye verdiği bilgiler. */
export type SahneProps = {
  s: Sahne;
  /** Kontrollerin şu anki değerleri. */
  v: Record<string, number>;
  /** Sahne içinden değer değiştirmek için (ör. arabayı sürüklemek). */
  set: (ad: string, deger: number) => void;
  /** Oynatma zamanı (saniye, 0..sure). Hiç oynatılmadıysa 0. */
  t: number;
  oynuyor: boolean;
  /** Tamamlanan oynatmaların değerleri, eskiden yeniye. */
  kosular: Record<string, number>[];
  /** Tahmin görevinde seçilen şık. */
  secim: number | null;
};

/** Sahne kaydı: çizim, isteğe bağlı değer bağlama ve oynatma sonrası geri bildirim. */
export type SahneKaydi = {
  C: (p: SahneProps) => React.ReactNode;
  /** Bir değer değişince diğerlerini uyarlar (ör. proton değişince nötron ve elektron). */
  bagla?: (ad: string, deger: number, v: Record<string, number>) => Record<string, number>;
  /** Hedefe ulaşılamadığında gösterilecek kısa açıklama. */
  geri?: (v: Record<string, number>, s: Sahne) => { baslik: string; metin: string } | null;
};

/* Yol: 0-50 m, viewBox genişliği 340. */
export const X0 = 30, PX = 5.6, ROAD_H = 26;
export const X = (m: number) => X0 + m * PX;

export function Yol({ y, etiket = true }: { y: number; etiket?: boolean }) {
  return (
    <g>
      <rect x={X0 - 14} y={y} width={50 * PX + 28} height={ROAD_H} rx={8} fill="#e6ebf2" />
      <line x1={X0 - 6} x2={X(50) + 6} y1={y + ROAD_H / 2} y2={y + ROAD_H / 2} stroke="#fff" strokeWidth={2} strokeDasharray="8 7" />
      {etiket &&
        [0, 10, 20, 30, 40, 50].map((m) => (
          <g key={m}>
            <line x1={X(m)} x2={X(m)} y1={y + ROAD_H + 2} y2={y + ROAD_H + 8} stroke="var(--muted)" strokeWidth={1.2} />
            <text x={X(m)} y={y + ROAD_H + 21} fontSize={11} fill="var(--muted)" textAnchor="middle">{m}</text>
          </g>
        ))}
      {etiket && <text x={X(50) + 12} y={y + ROAD_H + 21} fontSize={11} fill="var(--muted)">m</text>}
    </g>
  );
}

/** Araba: (x, y) yolun ortasındaki noktadır. ters: sola bakar. */
export function Araba({ x, y, renk = "var(--fizik)", soluk = false, ters = false, olcek = 1 }: { x: number; y: number; renk?: string; soluk?: boolean; ters?: boolean; olcek?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(ters ? -1 : 1) * olcek} ${olcek})`} opacity={soluk ? 0.22 : 1}>
      <path d="M-18 -4 L-18 -11 Q-18 -14 -15 -14 L-8 -14 L-3 -21 L8 -21 Q11 -21 12 -18 L14 -14 L16 -14 Q19 -14 19 -11 L19 -4 Z" fill={renk} />
      <path d="M-5 -14 L-1 -19 L4 -19 L4 -14 Z M6 -19 L9 -19 L11 -14 L6 -14 Z" fill="#fff" opacity={0.85} />
      <circle cx={-10} cy={-4} r={4.6} fill="var(--ink)" />
      <circle cx={11} cy={-4} r={4.6} fill="var(--ink)" />
      <circle cx={-10} cy={-4} r={1.7} fill="#cfd8e3" />
      <circle cx={11} cy={-4} r={1.7} fill="#cfd8e3" />
    </g>
  );
}

/** Arka plan: açık gökyüzü ve iki yumuşak tepe. */
export function Manzara({ y }: { y: number }) {
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id="ad-gok" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#eaf2ff" stopOpacity={0} />
          <stop offset="1" stopColor="#eaf2ff" />
        </linearGradient>
      </defs>
      <rect x={0} y={y - 90} width={340} height={90} fill="url(#ad-gok)" />
      <path d={`M0 ${y} Q60 ${y - 34} 130 ${y - 8} T250 ${y - 14} T340 ${y - 6} V${y} Z`} fill="#dff1e7" />
      <path d={`M150 ${y} Q215 ${y - 24} 280 ${y - 4} T340 ${y - 2} V${y} Z`} fill="#cfe9da" />
    </g>
  );
}

export function Ok({ x1, x2, y, renk, kalin = 3 }: { x1: number; x2: number; y: number; renk: string; kalin?: number }) {
  if (Math.abs(x2 - x1) < 2) return null;
  const d = x2 > x1 ? 1 : -1, uc = x2 - d * 9;
  return (
    <g>
      <line x1={x1} x2={uc} y1={y} y2={y} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2} ${y} L${uc} ${y - 5.5} L${uc} ${y + 5.5} Z`} fill={renk} />
    </g>
  );
}

/** Üstünde değer yazan küçük balon; (x, y) ucun değdiği noktadır. */
export function Balon({ x, y, yazi, renk = "var(--ink)" }: { x: number; y: number; yazi: string; renk?: string }) {
  const w = yazi.length * 7 + 16;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-22} width={w} height={22} rx={7} fill={renk} />
      <path d="M-5 0 L0 6 L5 0 Z" fill={renk} />
      <text y={-7} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">{yazi}</text>
    </g>
  );
}

/* Grafik çerçevesi */
export const G = { x0: 46, x1: 318, y0: 96, y1: 266 };
export const gX = (t: number, tMax: number) => G.x0 + (t / tMax) * (G.x1 - G.x0);
export const gY = (v: number, yMax: number) => G.y1 - (v / yMax) * (G.y1 - G.y0);

export function Eksen({ tMax, yMax, yAd, yAdim }: { tMax: number; yMax: number; yAd: string; yAdim: number }) {
  const ys: number[] = [];
  for (let v = 0; v <= yMax; v += yAdim) ys.push(v);
  return (
    <g>
      {ys.map((v) => (
        <g key={v}>
          <line x1={G.x0} x2={G.x1} y1={gY(v, yMax)} y2={gY(v, yMax)} stroke="var(--line)" />
          <text x={G.x0 - 6} y={gY(v, yMax) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{v}</text>
        </g>
      ))}
      {Array.from({ length: tMax + 1 }, (_, t) => (
        <text key={t} x={gX(t, tMax)} y={G.y1 + 15} fontSize={10} fill="var(--muted)" textAnchor="middle">{t}</text>
      ))}
      <line x1={G.x0} x2={G.x1} y1={G.y1} y2={G.y1} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={G.x0} x2={G.x0} y1={G.y0 - 8} y2={G.y1} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={G.x0 + 6} y={G.y0 - 4} fontSize={11} fontWeight={700} fill="var(--ink)">{yAd}</text>
      <text x={G.x1} y={G.y1 + 30} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">t (s)</text>
    </g>
  );
}

export const RENK = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c5)", "var(--c4)"];
export const yumusak = (u: number) => { const k = Math.max(0, Math.min(1, u)); return k * k * (3 - 2 * k); };

/** Tekrarlanabilir rastgele sayı (sahneler her çizimde aynı görünsün). */
export function rastgele(tohum: number) {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** SVG içinde işaretçinin viewBox koordinatı. */
export function svgNokta(svg: SVGSVGElement, e: { clientX: number; clientY: number }) {
  const p = svg.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM()!.inverse());
}
