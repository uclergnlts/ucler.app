"use client";
// Deney sahneleri (MEB "deney yapabilme" çıktıları): besin testleri laboratuvarı, deney planı kurma, deney verisi tablosu.
// Öğrenci seçenekleri sahnenin içinde dokunarak seçer (kontrol türü "surukle"); her seçenek klavyeyle de seçilebilen düğmedir.
import type { SahneKaydi, SahneProps } from "./ortak";

/** SVG içinde dokunulan ve klavyeyle (Enter / boşluk) seçilen düğme. */
function Sec({ x, y, w, h, yazi, secili, renk = "var(--acc)", onSec, etiket }: {
  x: number; y: number; w: number; h: number; yazi: string; secili: boolean; renk?: string; onSec: () => void; etiket?: string;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={secili}
      aria-label={etiket ?? yazi}
      style={{ cursor: "pointer" }}
      onClick={onSec}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSec(); } }}
    >
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={secili ? renk : "var(--panel)"} fillOpacity={secili ? 0.18 : 1} stroke={secili ? renk : "var(--line)"} strokeWidth={secili ? 2 : 1.2} />
      <text x={x + w / 2} y={y + h / 2 + 4} fontSize={Math.min(11, (w - 12) / (yazi.length * 0.58))} fontWeight={secili ? 800 : 700} fill={secili ? renk : "var(--ink)"} textAnchor="middle">{yazi}</text>
    </g>
  );
}

/* ================= Besinlerde ayraç testleri (BİY.9.2.3) ================= */

// v.b: besin (1-5, 0 seçilmedi), v.r: ayraç (1-4, 0 seçilmedi). Sonuçlar ders kitabı düzeyinde; az miktarı ayraç
// göstermeyebileceği için olumsuz sonuç "yok ya da çok az" diye yazılır.
const BESIN = ["Patates", "Yumurta akı", "Zeytinyağı", "Bal", "Saf su"];
const AYRAC = ["İyot", "Benedict", "Biüre", "Sudan III"];
/** Her ayraç için: hangi besinde olumlu, olumlu ve olumsuz renk, aradığı madde. */
const TEST = [
  { arti: [1], renk: ["#1f2a5a", "#c98a2b"], arti_yazi: "mavi-siyah", eksi_yazi: "sarı-kahve kaldı", madde: "nişasta" },
  { arti: [4], renk: ["#c1440e", "#3a7bd5"], arti_yazi: "ısıtınca kiremit kırmızısı", eksi_yazi: "ısıtınca da mavi kaldı", madde: "şeker" },
  { arti: [2], renk: ["#7b3fa0", "#3a7bd5"], arti_yazi: "mor", eksi_yazi: "mavi kaldı", madde: "protein" },
  { arti: [3], renk: ["#d6452f", "#f1b5a8"], arti_yazi: "üstte kırmızı yağ tabakası", eksi_yazi: "tabaka yok", madde: "yağ" },
];
export function besinSonuc(b: number, r: number) {
  if (!b || !r) return null;
  const t = TEST[r - 1], arti = t.arti.includes(b);
  return { arti, renk: t.renk[arti ? 0 : 1], yazi: `${arti ? t.arti_yazi : t.eksi_yazi}: ${t.madde} ${arti ? "var" : "yok ya da çok az"}`, madde: t.madde, yag: r === 4 };
}

function BesinLab({ v, set }: SahneProps) {
  const b = v.b ?? 0, r = v.r ?? 0, s = besinSonuc(b, r);
  const baslik = !b ? "Bir besin seç" : !r ? `${BESIN[b - 1]}: şimdi bir ayraç seç` : `${BESIN[b - 1]} + ${AYRAC[r - 1]}`;
  return (
    <svg viewBox="0 0 340 250" aria-label={s ? `${baslik}: ${s.yazi}` : baslik}>
      <text x={14} y={20} fontSize={13} fontWeight={800} fill={s ? (s.arti ? "var(--c3)" : "var(--ink)") : "var(--ink)"}>{baslik}</text>
      <text x={14} y={42} fontSize={10.5} fontWeight={700} fill="var(--muted)">BESİN</text>
      {BESIN.map((ad, i) => (
        <Sec key={ad} x={14 + (i % 3) * 106} y={48 + Math.floor(i / 3) * 30} w={100} h={24} yazi={ad} secili={b === i + 1} renk="var(--c1)" onSec={() => set("b", i + 1)} etiket={`Besin: ${ad}`} />
      ))}
      <text x={14} y={124} fontSize={10.5} fontWeight={700} fill="var(--muted)">AYRAÇ</text>
      {AYRAC.map((ad, i) => (
        <Sec key={ad} x={14 + i * 80} y={130} w={74} h={24} yazi={ad} secili={r === i + 1} renk="var(--c4)" onSec={() => set("r", i + 1)} etiket={`Ayraç: ${ad}`} />
      ))}
      {/* deney tüpü */}
      <g transform="translate(40 166)">
        <path d="M0 0 V58 Q0 74 16 74 Q32 74 32 58 V0" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
        {b > 0 && (
          s?.yag
            ? <><path d="M1 40 H31 V58 Q31 73 16 73 Q1 73 1 58 Z" fill={b === 3 ? "#f3e7b3" : "#e8eef6"} />
                <rect x={1} y={s.arti ? 26 : 34} width={30} height={s.arti ? 14 : 6} fill={s.renk} fillOpacity={s.arti ? 0.9 : 0.5} /></>
            : <path d="M1 26 H31 V58 Q31 73 16 73 Q1 73 1 58 Z" fill={s ? s.renk : b === 5 ? "#e8eef6" : "#efe6d2"} fillOpacity={s ? 0.85 : 1} />
        )}
      </g>
      <text x={92} y={196} fontSize={12} fontWeight={800} fill={s ? (s.arti ? "var(--c3)" : "var(--muted)") : "var(--muted)"}>
        {s ? s.yazi.split(": ")[0] : b ? "ayraç bekleniyor" : ""}
      </text>
      <text x={92} y={216} fontSize={12} fontWeight={700} fill="var(--ink)">{s ? s.yazi.split(": ")[1] : ""}</text>
      {b === 5 && <text x={92} y={236} fontSize={10.5} fontWeight={700} fill="var(--muted)">kontrol tüpü: ayraç tek başına</text>}
    </svg>
  );
}

/* ================= Deney planı kurma ================= */

// s.satirlar: [{ad, etiket, secenekler: [{yazi, neden?}], dogru (1'den)}]. v[ad]: seçilen seçenek (1'den, 0 seçilmedi).
// Bütün satırlar seçilince yanlış satırlar kırmızı olur ve nedeni altta çıkar.
type PlanSatir = { ad: string; etiket: string; secenekler: { yazi: string; neden?: string }[]; dogru: number };
function Plan({ s, v, set }: SahneProps) {
  const satirlar = (s.satirlar ?? []) as PlanSatir[];
  const hepsi = satirlar.every((x) => (v[x.ad] ?? 0) > 0);
  const yanlis = hepsi ? satirlar.find((x) => v[x.ad] !== x.dogru) : undefined;
  const H = 40 + satirlar.length * 48 + 44;
  return (
    <svg viewBox={`0 0 340 ${H}`} aria-label={String(s.baslik ?? "Deney planı")}>
      <text x={14} y={20} fontSize={13} fontWeight={800} fill={hepsi && !yanlis ? "var(--c3)" : "var(--ink)"}>
        {hepsi && !yanlis ? "Plan hazır" : String(s.baslik ?? "Deney planı")}
      </text>
      {satirlar.map((x, i) => {
        const y = 40 + i * 48, sec = v[x.ad] ?? 0, kotu = hepsi && sec !== x.dogru;
        return (
          <g key={x.ad}>
            <text x={14} y={y} fontSize={10.5} fontWeight={700} fill={kotu ? "var(--c2)" : "var(--muted)"}>{`${i + 1}. ${x.etiket.toLocaleUpperCase("tr")}`}</text>
            {x.secenekler.map((o, j) => (
              <Sec key={j} x={14 + j * 106} y={y + 6} w={100} h={26} yazi={o.yazi} secili={sec === j + 1} renk={kotu && sec === j + 1 ? "var(--c2)" : "var(--c3)"} onSec={() => set(x.ad, j + 1)} etiket={`${x.etiket}: ${o.yazi}`} />
            ))}
          </g>
        );
      })}
      <text x={14} y={H - 18} fontSize={11.5} fontWeight={700} fill={yanlis ? "var(--c2)" : "var(--muted)"}>
        {yanlis ? (yanlis.secenekler[(v[yanlis.ad] ?? 1) - 1]?.neden ?? "Bu adımı yeniden düşün.") : hepsi ? "" : "Her satırdan bir seçenek seç."}
      </text>
    </svg>
  );
}

/* ================= Deney verisi tablosu ================= */

// s.baslik, s.sutunlar: ["Atık", ...], s.satirlar: [["Çay posası", ...], ...], s.not: altta kısa not.
function Tablo({ s }: SahneProps) {
  const sut = (s.sutunlar ?? []) as string[], sat = (s.satirlar ?? []) as string[][];
  const gen = 312 / Math.max(1, sut.length), H = 50 + (sat.length + 1) * 30 + (s.not ? 24 : 0);
  return (
    <svg viewBox={`0 0 340 ${H}`} role="img" aria-label={`${String(s.baslik ?? "")}. ${sat.map((r) => r.join(", ")).join("; ")}`}>
      <text x={14} y={20} fontSize={13} fontWeight={800} fill="var(--ink)">{String(s.baslik ?? "")}</text>
      <rect x={14} y={34} width={312} height={30} rx={6} fill="var(--panel)" />
      {sut.map((c, j) => <text key={j} x={14 + j * gen + 10} y={54} fontSize={11.5} fontWeight={800} fill="var(--muted)">{c}</text>)}
      {sat.map((r, i) => (
        <g key={i}>
          <line x1={14} x2={326} y1={64 + (i + 1) * 30} y2={64 + (i + 1) * 30} stroke="var(--line)" />
          {r.map((c, j) => <text key={j} x={14 + j * gen + 10} y={84 + i * 30} fontSize={12.5} fontWeight={j ? 700 : 800} fill="var(--ink)">{c}</text>)}
        </g>
      ))}
      {!!s.not && <text x={14} y={H - 8} fontSize={10.5} fontWeight={700} fill="var(--muted)">{String(s.not)}</text>}
    </svg>
  );
}

export const DENEY: Record<string, SahneKaydi> = {
  "deney-besin": { C: BesinLab },
  "deney-plan": { C: Plan },
  "deney-tablo": { C: Tablo },
};
