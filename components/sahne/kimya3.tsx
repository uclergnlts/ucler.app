"use client";
// Kimya sahneleri (periyodik tablo, kimyasal bağlar): Mendeleyev'in boşluğu, ilk 20 elementin tablosu
// (yer, bölgeler, yarıçap), iyonlaşma enerjisi; iyonik, kovalent, polar ve metalik bağ, hidrojen bağı ve kaynama.
import { useEffect, useMemo, useState } from "react";
import { ELEMENTLER, katmanlar, yer } from "@/lib/elementler";
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const eksi = (x: number) => `${x < 0 ? "−" : ""}${Math.abs(x)}`;
const SU = "#d6e8fb";

/** Sahne açıkken sürekli akan zaman (saniye). Az hareket isteyende durur. */
function useSaat() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const bas = performance.now();
    const kare = (now: number) => { setT((now - bas) / 1000); id = requestAnimationFrame(kare); };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, []);
  return t;
}

/* ---------- Mendeleyev'in boşluğu ---------- */

const SUTUN: [string, string][] = [["C", "12"], ["Si", "28"], ["?", "≈ 72"], ["Sn", "119"], ["Pb", "207"]];

function Mendeleyev({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const bulundu = u >= 0.5;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label="Mendeleyev'in tablosunda karbonun grubu ve boş yer">
      <text x={170} y={30} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">Mendeleyev'in tablosunda karbonun grubu</text>
      <g>
        {SUTUN.map(([sb, m], i) => {
          const x = 27 + i * 58, bos = i === 2;
          const ge = bos && bulundu;
          return (
            <g key={i}>
              <rect x={x} y={52} width={52} height={74} rx={10} fill={ge ? "#e6f6ed" : "#fff"} stroke={bos ? (ge ? "var(--c3)" : "var(--kimya)") : "var(--line-2)"} strokeWidth={1.8} strokeDasharray={bos && !ge ? "5 4" : undefined} />
              <text x={x + 26} y={90} fontSize={22} fontWeight={800} textAnchor="middle" fill={bos ? (ge ? "var(--c3)" : "var(--kimya)") : "var(--ink)"} fontFamily="var(--f-display)">{ge ? "Ge" : sb}</text>
              <text x={x + 26} y={113} fontSize={12} textAnchor="middle" fill="var(--muted)">{ge ? "72,6" : m}</text>
            </g>
          );
        })}
      </g>
      <text x={170} y={146} fontSize={11.5} textAnchor="middle" fill="var(--muted)">kartlardaki sayı: atom kütlesi</text>
      <g opacity={kes((u - 0.5) * 4)} fontSize={12.5}>
        <text x={20} y={178} fill="var(--kimya)" fontWeight={700}>Tahmin (1871):</text>
        <text x={128} y={178} fill="var(--ink)">kütle ≈ 72, özkütle ≈ 5,5 g/cm³</text>
        <text x={20} y={202} fill="var(--c3)" fontWeight={700}>Germanyum (1886):</text>
        <text x={148} y={202} fill="var(--ink)">kütle 72,6, özkütle 5,3 g/cm³</text>
      </g>
    </svg>
  );
}

/* ---------- ilk 20 elementin tablosu ---------- */

const TX0 = 34, TY0 = 36, CW = 36, CH = 34;
// Kovalent yarıçaplar, pm (Cordero ve ark., 2008). Soy gazlar karşılaştırmaya alınmaz.
const YARICAP = [31, 0, 128, 96, 84, 76, 71, 66, 57, 0, 166, 141, 121, 111, 107, 105, 102, 0, 203, 176];
const SOY = [2, 10, 18];
const bolge = (z: number) =>
  SOY.includes(z) ? 3 : [3, 4, 11, 12, 13, 19, 20].includes(z) ? 0 : [5, 14].includes(z) ? 1 : 2;
const BOLGE = [
  { ad: "metal", renk: "var(--c1)" },
  { ad: "yarı metal", renk: "var(--c4)" },
  { ad: "ametal", renk: "var(--c3)" },
  { ad: "soy gaz", renk: "var(--c5)" },
];

function Tablo({ s, v, t, oynuyor }: SahneProps) {
  const mod = s.mod as string | undefined;
  const z = v.z ?? 0;
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  // Bölgeler sırayla boyanır: metal, yarı metal, ametal, soy gaz.
  const gorunur = (b: number) => (mod === "bolge" ? kes((u - 0.1 - b * 0.2) * 6) : 0);
  const el = z ? ELEMENTLER[z - 1] : null;
  const y = z ? yer(z) : null;
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={el ? `Periyodik tablo: ${el.ad} seçili` : "İlk 20 elementin periyodik tablosu"}>
      <g fontSize={11} fill="var(--muted)" textAnchor="middle" fontWeight={600}>
        {Array.from({ length: 8 }, (_, g) => <text key={g} x={TX0 + g * CW + CW / 2} y={TY0 - 8}>{g + 1}A</text>)}
        {[1, 2, 3, 4].map((p) => <text key={p} x={TX0 - 13} y={TY0 + (p - 1) * CH + CH / 2 + 4}>{p}</text>)}
      </g>
      <g>
        {ELEMENTLER.map((e) => {
          const { periyot, grup } = yer(e.z);
          const x = TX0 + (grup - 1) * CW, yy = TY0 + (periyot - 1) * CH;
          const sec = e.z === z;
          const b = bolge(e.z), boya = gorunur(b);
          const r = YARICAP[e.z - 1];
          return (
            <g key={e.z}>
              <rect x={x + 1.5} y={yy + 1.5} width={CW - 3} height={CH - 3} rx={6}
                fill={sec && mod !== "yaricap" ? "var(--kimya)" : boya ? BOLGE[b].renk : "#fff"}
                fillOpacity={sec && mod !== "yaricap" ? 1 : boya ? 0.22 * boya : 1}
                stroke={sec ? "var(--kimya)" : "var(--line-2)"} strokeWidth={sec ? 2 : 1.2} />
              {mod === "yaricap" && r > 0 && (
                <circle cx={x + CW / 2} cy={yy + CH / 2} r={2 + (r / 203) * 13.5} fill={sec ? "var(--kimya)" : "#fbd3de"} fillOpacity={sec ? 0.4 : 1} />
              )}
              <text x={x + CW / 2} y={yy + CH / 2 + 4.5} fontSize={12.5} fontWeight={700} textAnchor="middle"
                fill={sec && mod !== "yaricap" ? "#fff" : "var(--ink)"}>{e.s}</text>
            </g>
          );
        })}
      </g>
      {mod === "bolge" ? (
        <g fontSize={12} fontWeight={600}>
          {BOLGE.map((b, i) => (
            <g key={b.ad} opacity={gorunur(i)}>
              <rect x={[21, 89, 183, 257][i]} y={188} width={13} height={13} rx={3} fill={b.renk} fillOpacity={0.35} stroke={b.renk} />
              <text x={[21, 89, 183, 257][i] + 18} y={199} fill="var(--ink)">{b.ad}</text>
            </g>
          ))}
        </g>
      ) : el && y ? (
        <g>
          <text x={170} y={194} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">{el.s} · {el.ad} · Z = {z}</text>
          <text x={170} y={216} fontSize={12.5} textAnchor="middle" fill="var(--muted)">
            {mod === "yaricap"
              ? SOY.includes(z) ? "Soy gazların yarıçapı bu kıyasa alınmaz" : `Atom yarıçapı ≈ ${YARICAP[z - 1]} pm`
              : `Katmanlar ${katmanlar(z).join("-")} → ${y.periyot}. periyot, ${y.grup}A grubu`}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/* ---------- iyonlaşma enerjisi ---------- */

// Birinci iyonlaşma enerjisi, kJ/mol.
const IE = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590];
const IX0 = 46, SLOT = 14, IY0 = 34, IY1 = 176, IMAX = 2500;
const iy = (e: number) => IY1 - (e / IMAX) * (IY1 - IY0);

function Iyonlasma({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const bitti = u >= 1;
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label="İlk 20 elementin birinci iyonlaşma enerjisi">
      <text x={IX0} y={18} fontSize={12} fontWeight={700} fill="var(--muted)">1. iyonlaşma enerjisi (kJ/mol)</text>
      <g>
        {[0, 1000, 2000].map((e) => (
          <g key={e}>
            <line x1={IX0} x2={IX0 + 20 * SLOT} y1={iy(e)} y2={iy(e)} stroke="var(--line)" />
            <text x={IX0 - 5} y={iy(e) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{e}</text>
          </g>
        ))}
      </g>
      <g>
        {IE.map((e, k) => {
          const b = kes(u * 24 - k * 1.05);
          const z = k + 1;
          const renk = !bitti ? "#b9c4d3" : [3, 11, 19].includes(z) ? "var(--kimya)" : SOY.includes(z) ? "var(--c5)" : "#c9d2de";
          const h = (IY1 - iy(e)) * yumusak(b);
          return <rect key={k} x={IX0 + k * SLOT + 2} y={IY1 - h} width={SLOT - 4} height={h} rx={2} fill={renk} />;
        })}
      </g>
      <g fontSize={11} textAnchor="middle" fill="var(--muted)" fontWeight={600}>
        {ELEMENTLER.map((e, k) => <text key={k} x={IX0 + k * SLOT + SLOT / 2} y={k % 2 ? 205 : 191}>{e.s}</text>)}
      </g>
      <g opacity={bitti ? 1 : 0} fontSize={12} fontWeight={700}>
        <text x={IX0} y={224} fill="var(--kimya)">■ alkali: en düşük</text>
        <text x={IX0 + 20 * SLOT} y={224} fill="var(--c5)" textAnchor="end">■ soy gaz: en yüksek</text>
      </g>
    </svg>
  );
}

/* ---------- iyonik bağ: Na elektronunu Cl'ye verir ---------- */

function Kabuk({ x, y, r, n, renk, op = 1, don = 0 }: { x: number; y: number; r: number; n: number; renk: string; op?: number; don?: number }) {
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="var(--line-2)" strokeWidth={1.3} />
      {Array.from({ length: n }, (_, j) => {
        const a = ((-90 + don + (j * 360) / n) * Math.PI) / 180;
        return <circle key={j} cx={x + r * Math.cos(a)} cy={y + r * Math.sin(a)} r={3.6} fill={renk} />;
      })}
    </g>
  );
}

function Iyonik({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const e = yumusak(kes((u - 0.08) / 0.42));
  const iyon = u >= 0.5;
  const m = yumusak(kes((u - 0.6) / 0.4));
  const NX = ara(92, 134, m), KX = ara(246, 206, m), CY = 104;
  const bas = { x: 92 + 37, y: CY }, son = { x: 246 - 33, y: CY };
  const ex = ara(bas.x, son.x, e), ey = CY - Math.sin(Math.PI * e) * 34;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label="Sodyum bir elektronunu klora veriyor">
      <g>
        <Kabuk x={NX} y={CY} r={17} n={2} renk="var(--c1)" />
        <Kabuk x={NX} y={CY} r={27} n={8} renk="var(--c1)" don={22} />
        {!iyon && <circle cx={NX} cy={CY} r={37} fill="none" stroke="var(--line-2)" strokeWidth={1.3} />}
        <circle cx={NX} cy={CY} r={10} fill="var(--c4)" />
        <text x={NX} y={CY + 4} fontSize={11} fontWeight={800} textAnchor="middle" fill="#fff">Na</text>
      </g>
      <g>
        <Kabuk x={KX} y={CY} r={16} n={2} renk="var(--c1)" />
        <Kabuk x={KX} y={CY} r={25} n={8} renk="var(--c1)" don={22} />
        <Kabuk x={KX} y={CY} r={33} n={iyon ? 8 : 7} renk="var(--c1)" don={iyon ? 22 : 0} />
        <circle cx={KX} cy={CY} r={10} fill="var(--c3)" />
        <text x={KX} y={CY + 4} fontSize={11} fontWeight={800} textAnchor="middle" fill="#fff">Cl</text>
      </g>
      {!iyon && <circle cx={ex} cy={ey} r={4.2} fill="var(--kimya)" />}
      <g fontSize={13} fontWeight={700} textAnchor="middle">
        <text x={NX} y={168} fill={iyon ? "var(--kimya)" : "var(--ink)"}>{iyon ? "Na⁺" : "Na"}</text>
        <text x={NX} y={186} fontSize={12} fontWeight={600} fill="var(--muted)">{iyon ? "2-8" : "2-8-1"}</text>
        <text x={KX} y={168} fill={iyon ? "var(--kimya)" : "var(--ink)"}>{iyon ? "Cl⁻" : "Cl"}</text>
        <text x={KX} y={186} fontSize={12} fontWeight={600} fill="var(--muted)">{iyon ? "2-8-8" : "2-8-7"}</text>
      </g>
      <text x={170} y={214} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--kimya)" opacity={kes((m - 0.5) * 3)}>
        Zıt yüklü iyonlar birbirini çeker: iyonik bağ
      </text>
    </svg>
  );
}

/* ---------- kovalent bağ: N₂ ---------- */

function Kovalent({ v }: SahneProps) {
  const b = v.b ?? 1;
  const L = 132, R = 208, Y = 104;
  const noktalar = (x: number, d: number) => [
    [x + d * 21, Y - 5], [x + d * 21, Y + 5], [x - 5, Y - 20], [x + 5, Y - 20], [x - 5, Y + 20], [x + 5, Y + 20],
  ];
  const tek = 5 - b, top = 5 + b;
  const ad = ["tekli bağ", "ikili bağ", "üçlü bağ"][b - 1];
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`N₂ Lewis yapısı: ${b} ortak elektron çifti`}>
      <text x={170} y={30} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">Her N atomunun 5 değerlik elektronu var</text>
      <g>
        {[-1, 1].map((d) => (
          <g key={d}>
            {noktalar(d < 0 ? L : R, d).slice(0, tek).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2} fill="var(--kimya)" />)}
          </g>
        ))}
      </g>
      <g fontSize={28} fontWeight={800} textAnchor="middle" fill="var(--ink)" fontFamily="var(--f-display)">
        <text x={L} y={Y + 10}>N</text>
        <text x={R} y={Y + 10}>N</text>
      </g>
      <g>
        {(b === 1 ? [0] : b === 2 ? [-5, 5] : [-8, 0, 8]).map((o) => (
          <line key={o} x1={L + 16} x2={R - 16} y1={Y + o} y2={Y + o} stroke="var(--ink)" strokeWidth={2.6} strokeLinecap="round" />
        ))}
      </g>
      <text x={170} y={160} fontSize={14} fontWeight={800} textAnchor="middle" fill={top === 8 ? "var(--good)" : "var(--ink)"}>
        Her N çevresinde {top} elektron{top === 8 ? ": oktet tamam" : `: ${8 - top} eksik`}
      </text>
      <text x={170} y={184} fontSize={12.5} textAnchor="middle" fill="var(--muted)">{ad} · her çizgi 1 ortak elektron çifti</text>
      <text x={170} y={204} fontSize={12} textAnchor="middle" fill="var(--muted)">ortak çift iki atomun da sayımına girer</text>
    </svg>
  );
}

/* ---------- polar ve apolar bağ ---------- */

function Polar({ v }: SahneProps) {
  const cl = v.cl === 1;
  const HX = 110, KX = 230, Y = 96;
  const kay = cl ? 20 : 0;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={cl ? "H–Cl bağı: ortak çift klora kaymış" : "H–H bağı: ortak çift ortada"}>
      <g>
        <circle cx={HX} cy={Y} r={17} fill="#fff" stroke="#8d9bb0" strokeWidth={1.6} />
        <text x={HX} y={Y + 5} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">H</text>
      </g>
      <g>
        <circle cx={KX} cy={Y} r={cl ? 27 : 17} fill={cl ? "#e6f6ed" : "#fff"} stroke={cl ? "var(--c3)" : "#8d9bb0"} strokeWidth={1.6} style={{ transition: "r .5s" }} />
        <text x={KX} y={Y + 5} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{cl ? "Cl" : "H"}</text>
      </g>
      <g style={{ transform: `translateX(${kay}px)`, transition: "transform .6s ease" }}>
        <ellipse cx={170} cy={Y} rx={24} ry={15} fill="var(--c1)" opacity={0.14} />
        <circle cx={170} cy={Y - 5} r={3.6} fill="var(--c1)" />
        <circle cx={170} cy={Y + 5} r={3.6} fill="var(--c1)" />
      </g>
      <g fontSize={14} fontWeight={800} textAnchor="middle" opacity={cl ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <text x={HX} y={Y - 28} fill="var(--c1)">δ+</text>
        <text x={KX} y={Y - 38} fill="var(--kimya)">δ−</text>
      </g>
      <g fontSize={12} textAnchor="middle" fill="var(--muted)" fontWeight={600}>
        <text x={170} y={164}>elektronegatiflik</text>
        <text x={HX} y={146} fontSize={14} fontWeight={800} fill="var(--ink)">2,2</text>
        <text x={KX} y={146} fontSize={14} fontWeight={800} fill="var(--ink)">{cl ? "3,2" : "2,2"}</text>
      </g>
      <text x={170} y={192} fontSize={13.5} fontWeight={800} textAnchor="middle" fill={cl ? "var(--kimya)" : "var(--ink)"}>
        {cl ? "HCl: polar kovalent bağ" : "H₂: apolar kovalent bağ"}
      </text>
      <text x={170} y={212} fontSize={12} textAnchor="middle" fill="var(--muted)">
        {cl ? "fark 1,0: ortak çift kloru tercih eder" : "fark 0: iki çekirdek çifti eşit çeker"}
      </text>
    </svg>
  );
}

/* ---------- metalik bağ: elektron denizi ---------- */

const MX0 = 48, MX1 = 292, MY0 = 56, MY1 = 170;

function Metal({ v }: SahneProps) {
  const pil = v.pil === 1;
  const saat = useSaat();
  const e = useMemo(() => { const r = rastgele(77); return Array.from({ length: 16 }, () => [r(), r(), r(), r()]); }, []);
  const ucgen = (x: number) => { const k = ((x % 2) + 2) % 2; return k < 1 ? k : 2 - k; };
  const W = MX1 - MX0, H = MY1 - MY0;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={pil ? "Pil bağlı: elektronlar artı kutba akıyor" : "Metal: katyonlar ve serbest elektronlar"}>
      <g opacity={pil ? 1 : 0} style={{ transition: "opacity .3s" }}>
        <path d={`M30 ${MY0 + 8} L30 26 L154 26 M186 26 L310 26 L310 ${MY0 + 8}`} fill="none" stroke="var(--muted)" strokeWidth={1.6} />
        <line x1={154} x2={154} y1={20} y2={32} stroke="var(--ink)" strokeWidth={4} />
        <line x1={186} x2={186} y1={16} y2={36} stroke="var(--ink)" strokeWidth={2.2} />
        <text x={170} y={48} fontSize={11} textAnchor="middle" fill="var(--muted)">pil</text>
        <rect x={26} y={MY0} width={8} height={H} rx={2} fill="var(--muted)" />
        <rect x={306} y={MY0} width={8} height={H} rx={2} fill="var(--muted)" />
        <text x={14} y={MY0 + H / 2 + 6} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--ink)">−</text>
        <text x={326} y={MY0 + H / 2 + 6} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--ink)">+</text>
      </g>
      <g>
        {Array.from({ length: 18 }, (_, i) => {
          const x = MX0 + 20 + (i % 6) * 41, y = MY0 + 18 + Math.floor(i / 6) * 39;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={13} fill="var(--c4)" opacity={0.9} />
              <text x={x} y={y + 5} fontSize={15} fontWeight={800} textAnchor="middle" fill="#fff">+</text>
            </g>
          );
        })}
      </g>
      <g>
        {e.map(([a, b, c, d], i) => {
          const hiz = 0.08 + 0.1 * c;
          const x = pil ? MX0 + ((((a * W + saat * 34 * (0.8 + 0.4 * c)) % W) + W) % W) : MX0 + ucgen(a * 2 + saat * hiz) * W;
          const y = MY0 + ucgen(b * 2 + saat * hiz * (0.7 + d)) * H;
          return <circle key={i} cx={x} cy={y} r={3.8} fill="var(--c1)" />;
        })}
      </g>
      <text x={170} y={198} fontSize={13} fontWeight={700} textAnchor="middle" fill={pil ? "var(--c1)" : "var(--ink)"}>
        {pil ? "Serbest elektronlar + kutba doğru akıyor: akım" : "Elektronlar hiçbir atoma ait değil, serbest dolaşıyor"}
      </text>
      <text x={170} y={216} fontSize={12} textAnchor="middle" fill="var(--muted)">turuncu: metal katyonları · mavi: elektron denizi</text>
    </svg>
  );
}

/* ---------- H₂O ve H₂S kaynıyor ---------- */

function Kap({ x, ad, kutle, kn, T }: { x: number; ad: string; kutle: string; kn: number; T: number }) {
  const sev = 1 - kes((T - kn) / 18);
  const kayn = T >= kn;
  const y0 = 64, y1 = 150, w = 74;
  const sY = y1 - 4 - sev * 58;
  return (
    <g>
      <text x={x} y={46} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ad}</text>
      {sev > 0 && <rect x={x - w / 2 + 2} y={sY} width={w - 4} height={y1 - sY - 2} fill={SU} />}
      {kayn && sev > 0 && [0, 1, 2].map((i) => <circle key={i} cx={x - 18 + i * 18} cy={y1 - 12 - ((T * 3 + i * 9) % 30)} r={3} fill="#fff" stroke="var(--c1)" />)}
      {kayn && [0, 1, 2, 3].map((i) => <circle key={i} cx={x - 24 + i * 16} cy={sY - 8 - ((T * 2 + i * 13) % Math.max(8, sY - y0 - 14))} r={2.6} fill="var(--c1)" opacity={0.5} />)}
      <path d={`M${x - w / 2} ${y0} L${x - w / 2} ${y1} L${x + w / 2} ${y1} L${x + w / 2} ${y0}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={x} y={172} fontSize={12} textAnchor="middle" fill="var(--muted)">{kutle}</text>
      <text x={x} y={194} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={kayn ? "var(--kimya)" : "var(--muted)"}>
        {kayn ? `kaynadı: ${eksi(kn)} °C` : "sıvı"}
      </text>
    </g>
  );
}

function Kaynama({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const T = Math.round(ara(-80, 110, u));
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="H₂S ve H₂O ısıtılıyor">
      <text x={170} y={18} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">Sıcaklık: {eksi(T)} °C</text>
      <Kap x={96} ad="H₂S" kutle="34 g/mol" kn={-60} T={T} />
      <Kap x={244} ad="H₂O" kutle="18 g/mol" kn={100} T={T} />
    </svg>
  );
}

/* ---------- su kaynarken ne kopar? ---------- */

const SIKI: [number, number, number][] = [[128, 82, 10], [172, 70, -30], [214, 86, 40], [138, 126, -20], [182, 118, 160], [224, 130, 70]];
const GENIS: [number, number, number][] = [[40, 46, 60], [170, 32, -80], [298, 52, 120], [56, 156, 30], [180, 164, 200], [292, 150, -40]];
const KOMSU: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [1, 4], [2, 5]];
const dondur = (x: number, y: number, a: number, dx: number, dy: number) => {
  const r = (a * Math.PI) / 180;
  return [x + dx * Math.cos(r) - dy * Math.sin(r), y + dx * Math.sin(r) + dy * Math.cos(r)];
};

function Kaynatma({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const m = yumusak(kes((u - 0.15) / 0.7));
  const yerler = SIKI.map(([x, y, a], i) => [ara(x, GENIS[i][0], m), ara(y, GENIS[i][1], m), ara(a, GENIS[i][2], m)]);
  const hler = yerler.map(([x, y, a]) => [dondur(x, y, a, -14, 11), dondur(x, y, a, 14, 11)]);
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label="Kaynayan suda hidrojen bağları kopuyor, moleküller bozulmuyor">
      <g opacity={1 - kes(u * 2.5)}>
        {KOMSU.map(([i, j], k) => {
          const O = yerler[j];
          const [h1, h2] = hler[i];
          const d = (p: number[]) => (p[0] - O[0]) ** 2 + (p[1] - O[1]) ** 2;
          const h = d(h1) < d(h2) ? h1 : h2;
          return <line key={k} x1={h[0]} y1={h[1]} x2={O[0]} y2={O[1]} stroke="var(--kimya)" strokeWidth={1.6} strokeDasharray="3 3" />;
        })}
      </g>
      <g>
        {yerler.map(([x, y], i) => (
          <g key={i}>
            {hler[i].map(([hx, hy], j) => <line key={j} x1={x} y1={y} x2={hx} y2={hy} stroke="var(--ink)" strokeWidth={2} />)}
            {hler[i].map(([hx, hy], j) => <circle key={`h${j}`} cx={hx} cy={hy} r={4.6} fill="#fff" stroke="#8d9bb0" strokeWidth={1.3} />)}
            <circle cx={x} cy={y} r={8} fill="var(--c2)" />
          </g>
        ))}
      </g>
      <g fontSize={12} textAnchor="middle" fontWeight={600}>
        <text x={170} y={196} fill="var(--kimya)" opacity={1 - kes(u * 2.5)}>kesikli çizgi: moleküller arası hidrojen bağı</text>
        <text x={170} y={196} fill="var(--ink)" opacity={kes((u - 0.6) * 4)}>Hidrojen bağları koptu, H₂O molekülleri bozulmadı.</text>
        <text x={170} y={216} fill="var(--muted)" opacity={kes((u - 0.6) * 4)}>O–H bağları (düz çizgi) yerinde: fiziksel değişim</text>
      </g>
    </svg>
  );
}

export const KIMYA3: Record<string, SahneKaydi> = {
  "kim3-mendeleyev": { C: Mendeleyev },
  "kim3-tablo": { C: Tablo },
  "kim3-iyonlasma": { C: Iyonlasma },
  "kim3-iyonik": { C: Iyonik },
  "kim3-kovalent": { C: Kovalent },
  "kim3-polar": { C: Polar },
  "kim3-metal": { C: Metal },
  "kim3-kaynama": { C: Kaynama },
  "kim3-kaynatma": { C: Kaynatma },
};
