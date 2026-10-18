"use client";
// Kimya sahneleri: atom (çekirdek, dönen elektron katmanları, gösterim) ve atomun ölçeği.
import { ELEMENTLER, katmanlar } from "@/lib/elementler";
import type { SahneKaydi, SahneProps } from "./ortak";

// İlk 20 elementin doğada en bol izotopunun nötron sayısı (¹H, ⁴He, ⁷Li ... ⁴⁰Ar, ³⁹K, ⁴⁰Ca).
const YAYGIN_N = [0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20];
const yuk = (q: number) => (q === 0 ? "" : `${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "−"}`);
const CX = 110, CY = 112, R = [46, 66, 86, 104];

/** Çekirdek: proton ve nötronlar ayçiçeği düzeninde iç içe. */
function Cekirdek({ p, n, x = CX, y = CY, r = 4.4 }: { p: number; n: number; x?: number; y?: number; r?: number }) {
  const N = p + n;
  // Proton ve nötronları karıştır: nötronlar eşit aralıkla serpiştirilir.
  const tur = Array.from({ length: N }, (_, i) => (n && Math.floor(((i + 1) * n) / N) > Math.floor((i * n) / N) ? "n" : "p"));
  return (
    <g>
      {tur.map((k, i) => {
        const a = i * 2.39996, d = r * 1.05 * Math.sqrt(i);
        return <circle key={i} cx={x + d * Math.cos(a)} cy={y + d * Math.sin(a)} r={r} fill={k === "p" ? "var(--c2)" : "#9aa8ba"} stroke="#fff" strokeWidth={0.8} />;
      }).reverse()}
    </g>
  );
}

function Atom({ s, v }: SahneProps) {
  const p = v.p ?? 1, n = v.n ?? 0, e = v.e ?? p;
  const el = ELEMENTLER[p - 1], q = p - e, A = p + n, k = katmanlar(e);
  const etiket = s.etiket === true;
  const durum = q === 0 ? "Nötr atom" : q > 0 ? `Katyon: ${q} elektron verdi` : `Anyon: ${-q} elektron aldı`;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`${el.ad}: ${p} proton, ${n} nötron, ${e} elektron`}>
      <circle cx={CX} cy={CY} r={R[Math.max(0, k.length - 1)] + 10} fill="var(--kimya-soft)" opacity={0.6} />
      {k.map((c, i) => (
        <g key={i}>
          <circle cx={CX} cy={CY} r={R[i]} fill="none" stroke="var(--line-2)" strokeWidth={1.5} />
          <g className="ad-don" style={{ animationDuration: `${10 + i * 5}s`, transformOrigin: `${CX}px ${CY}px` }}>
            {Array.from({ length: c }, (_, j) => {
              const a = (-90 + (j * 360) / c + i * 17) * (Math.PI / 180);
              return <circle key={j} cx={CX + R[i] * Math.cos(a)} cy={CY + R[i] * Math.sin(a)} r={5} fill="var(--c1)" stroke="#fff" strokeWidth={1.2} />;
            })}
          </g>
        </g>
      ))}
      <Cekirdek p={p} n={n} />
      {etiket && (
        <g fontSize={11.5} fontWeight={700}>
          <line x1={CX + 4} y1={CY - 4} x2={236} y2={46} stroke="var(--c2)" strokeWidth={1.2} />
          <text x={240} y={50} fill="var(--c2)">proton (+1)</text>
          <line x1={CX + 6} y1={CY + 4} x2={236} y2={78} stroke="#7d8da3" strokeWidth={1.2} />
          <text x={240} y={82} fill="#6b7b91">nötron (0)</text>
          <line x1={CX + R[0]} y1={CY} x2={236} y2={112} stroke="var(--c1)" strokeWidth={1.2} />
          <text x={240} y={116} fill="var(--c1)">elektron (−1)</text>
          <text x={240} y={150} fill="var(--muted)" fontWeight={600}>çekirdek</text>
          <text x={240} y={166} fill="var(--muted)" fontWeight={600}>= proton + nötron</text>
        </g>
      )}
      {!etiket && (
        <g>
          <text x={262} y={58} fontSize={15} textAnchor="end" fill="var(--ink)" fontWeight={600}>{A}</text>
          <text x={262} y={94} fontSize={15} textAnchor="end" fill="var(--c2)" fontWeight={600}>{p}</text>
          <text x={266} y={92} fontSize={42} fill="var(--ink)" fontWeight={800} fontFamily="var(--f-display)">
            {el.s}<tspan fontSize={20} dy={-22} fill={q ? "var(--kimya)" : "var(--ink)"}>{yuk(q)}</tspan>
          </text>
          <text x={284} y={124} fontSize={15} textAnchor="middle" fill="var(--ink)" fontWeight={700}>{el.ad}</text>
          <text x={284} y={146} fontSize={12} textAnchor="middle" fill="var(--muted)">A = {p} + {n} = {A}</text>
          <text x={284} y={164} fontSize={12} textAnchor="middle" fill="var(--muted)">katmanlar: {k.join("-") || "yok"}</text>
          <text x={332} y={216} fontSize={11.5} textAnchor="end" fontWeight={700} fill={q ? "var(--kimya)" : "var(--muted)"}>{durum}</text>
        </g>
      )}
      <g fontSize={11} fill="var(--muted)">
        <circle cx={14} cy={212} r={4.5} fill="var(--c2)" /><text x={22} y={216}>{p} p</text>
        <circle cx={62} cy={212} r={4.5} fill="#9aa8ba" /><text x={70} y={216}>{n} n</text>
        <circle cx={110} cy={212} r={4.5} fill="var(--c1)" /><text x={118} y={216}>{e} e</text>
      </g>
    </svg>
  );
}

// Atomdan çekirdeğe yakınlaş (sure 5): elektron bulutu ekrandan taşar, çekirdek ancak sonda görünür.
function AtomOlcek({ t, oynuyor }: SahneProps) {
  const u = oynuyor || t > 0 ? t / 5 : 0;
  const k = Math.exp(u * 4.3); // 1 → ~74 kat
  const bulut = 70 * k, rc = 0.8 * k;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Atomun içine yakınlaşma">
      <defs>
        <radialGradient id="ad-bulut">
          <stop offset="0" stopColor="var(--c1)" stopOpacity={0.05} />
          <stop offset="0.85" stopColor="var(--c1)" stopOpacity={0.12} />
          <stop offset="1" stopColor="var(--c1)" stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <circle cx={170} cy={110} r={bulut} fill="url(#ad-bulut)" stroke="var(--c1)" strokeOpacity={0.4} strokeDasharray="4 5" />
      {bulut < 400 && [0, 1, 2].map((i) => {
        const a = (i * 120 + u * 200) * (Math.PI / 180);
        return <circle key={i} cx={170 + bulut * 0.92 * Math.cos(a)} cy={110 + bulut * 0.92 * Math.sin(a)} r={4.5} fill="var(--c1)" />;
      })}
      {rc < 3 ? <circle cx={170} cy={110} r={Math.max(rc, 1.2)} fill="var(--c2)" /> : <Cekirdek p={3} n={4} x={170} y={110} r={rc / 3.1} />}
      <rect x={10} y={10} width={320} height={26} rx={8} fill="#fff" opacity={0.9} />
      <text x={170} y={28} fontSize={12.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">
        {u < 0.25 ? "Lityum atomu: çapı yaklaşık 0,0000000003 m" : u < 0.97 ? `Yakınlaşma: ${Math.round(k)} kat` : "Çekirdek: atomdan yaklaşık 100.000 kat küçük"}
      </text>
      {u >= 0.97 && (
        <text x={170} y={204} fontSize={12} fill="var(--muted)" textAnchor="middle">Elektronlar çok uzakta; aradaki her yer boşluk.</text>
      )}
    </svg>
  );
}

export const ATOM: Record<string, SahneKaydi> = {
  atom: {
    C: Atom,
    // Proton değişince element değişir: nötron en yaygın izotopa, elektron nötr atoma uyar.
    bagla: (ad, x, v) => (ad === "p" ? { ...v, p: x, n: YAYGIN_N[x - 1], e: x } : { ...v, [ad]: x }),
  },
  "atom-olcek": { C: AtomOlcek },
};
