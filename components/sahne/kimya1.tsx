"use client";
// Kimya sahneleri (simya, kimyanın dili): element dönüşümü, damıtma, suyun elektrolizi, Lavoisier'in kapalı kabı,
// bilimsel yöntem döngüsü, molekül kurma, element sembolü, tehlike işaretleri ve asidin seyreltilmesi.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const SU = "#d6e8fb", ASIT = "#f4e1a1";
const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));

/** Yuvarlak balonda alttaki sıvı: merkez (cx, cy), yarıçap r, sıvı yüzeyi yc. */
function balonSivi(cx: number, cy: number, r: number, yc: number) {
  const w = Math.sqrt(Math.max(0, r * r - (yc - cy) ** 2));
  return `M${cx - w} ${yc} A${r} ${r} 0 ${yc < cy ? 1 : 0} 0 ${cx + w} ${yc} Z`;
}

/* ---------- kurşun ve altın ---------- */

function Karo({ x, z, s, ad, renk }: { x: number; z: number; s: string; ad: string; renk: string }) {
  return (
    <g>
      <rect x={x} y={36} width={104} height={120} rx={14} fill="#fff" stroke={renk} strokeWidth={2} />
      <text x={x + 12} y={58} fontSize={13} fontWeight={700} fill="var(--muted)">{z}</text>
      <text x={x + 52} y={112} fontSize={44} fontWeight={800} textAnchor="middle" fill="var(--ink)" fontFamily="var(--f-display)">{s}</text>
      <text x={x + 52} y={140} fontSize={13} fontWeight={700} textAnchor="middle" fill={renk}>{ad}</text>
    </g>
  );
}

function ElementDonusum() {
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="Kurşun 82 proton, altın 79 proton">
      <Karo x={22} z={82} s="Pb" ad="Kurşun" renk="#7d8da3" />
      <Karo x={214} z={79} s="Au" ad="Altın" renk="var(--c4)" />
      <g>
        <line x1={134} x2={198} y1={96} y2={96} stroke="var(--line-2)" strokeWidth={3} strokeDasharray="6 6" />
        <path d="M206 96 L196 90 L196 102 Z" fill="var(--line-2)" />
        <text x={170} y={84} fontSize={20} fontWeight={800} textAnchor="middle" fill="var(--muted)">?</text>
      </g>
      <g fontSize={12.5} fontWeight={700} textAnchor="middle">
        <text x={74} y={180} fill="var(--ink)">82 proton</text>
        <text x={266} y={180} fill="var(--ink)">79 proton</text>
        <text x={170} y={206} fill="var(--muted)" fontWeight={600}>Elementi çekirdekteki proton sayısı belirler.</text>
      </g>
    </svg>
  );
}

/* ---------- damıtma ---------- */

const BX = 74, BY = 148, BR = 36; // balon
const TUP = { x1: 92, y1: 82, x2: 262, y2: 150 }; // soğutucu boru

function Damitma({ t, oynuyor, s }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 6));
  const isinma = kes(u / 0.3), akis = kes((u - 0.3) / 0.7);
  const T = Math.round(20 + 58 * yumusak(isinma));
  const top = 172 - 18 * akis; // toplama kabındaki sıvı yüzeyi
  const sivi = BY + 4 + 8 * akis; // balondaki sıvı yüzeyi iner
  const buhar = akis > 0 && akis < 1
    ? Array.from({ length: 6 }, (_, i) => {
        const k = (u * 5 + i / 6) % 1;
        return <circle key={i} cx={TUP.x1 + (TUP.x2 - TUP.x1) * k} cy={TUP.y1 + (TUP.y2 - TUP.y1) * k} r={2.6} fill="var(--kimya)" opacity={0.7} />;
      })
    : null;
  const damla = akis > 0 && akis < 1 ? 154 + ((u * 40) % 1) * 14 : null;
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={`Damıtma düzeneği, sıcaklık ${T} derece`}>
      <g>
        <line x1={TUP.x1 + 26} y1={TUP.y1 + 10.4} x2={TUP.x2 - 26} y2={TUP.y2 - 10.4} stroke="#e4eef9" strokeWidth={24} strokeLinecap="round" />
        <line x1={TUP.x1} y1={TUP.y1} x2={TUP.x2} y2={TUP.y2} stroke="var(--line-2)" strokeWidth={7} strokeLinecap="round" />
        <text x={142} y={70} fontSize={11.5} fontWeight={700} fill="var(--c1)" transform="rotate(21.8 142 70)">soğutucu (soğuk su)</text>
      </g>
      <g>
        <circle cx={BX} cy={BY} r={BR} fill="#fff" stroke="var(--line-2)" strokeWidth={2.5} />
        <path d={balonSivi(BX, BY, BR - 1.5, sivi)} fill={ASIT} opacity={0.75} />
        <path d={`M${BX - 8} ${BY - BR + 2} L${BX - 8} 70 L${BX + 8} 70 L${BX + 8} ${BY - BR + 2}`} fill="#fff" stroke="var(--line-2)" strokeWidth={2.5} />
        <text x={BX} y={BY + 22} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--ink)">su + alkol</text>
      </g>
      <g>
        <rect x={BX - 34} y={198} width={68} height={10} rx={4} fill="var(--ink)" />
        {u > 0 && [-14, 0, 14].map((d) => (
          <path key={d} d={`M${BX + d} 186 q5 6 0 11 q-5 -5 0 -11`} fill="var(--c4)" />
        ))}
        <text x={BX} y={222} fontSize={11} textAnchor="middle" fill="var(--muted)">ısıtıcı</text>
      </g>
      <g>
        <line x1={BX} y1={44} x2={BX} y2={96} stroke="var(--ink)" strokeWidth={2} />
        <circle cx={BX} cy={96} r={3.5} fill="var(--c2)" />
        <text x={BX + 10} y={50} fontSize={15} fontWeight={800} fill={T >= 78 ? "var(--kimya)" : "var(--ink)"}>{T} °C</text>
      </g>
      {buhar}
      <g>
        <path d="M250 154 L240 196 Q240 202 246 202 L294 202 Q300 202 300 196 L290 154 Z" fill="#fff" stroke="var(--line-2)" strokeWidth={2.5} />
        {akis > 0 && <path d={`M${242 + (202 - top) * 0.24 - 4} ${top} L${298 - (202 - top) * 0.24 + 4} ${top} L300 196 Q300 202 294 202 L246 202 Q240 202 240 196 Z`} fill={ASIT} />}
        {damla !== null && <circle cx={262} cy={damla} r={2.6} fill="var(--kimya)" />}
        <text x={270} y={222} fontSize={11.5} fontWeight={700} textAnchor="middle" fill={akis > 0.5 ? "var(--kimya)" : "var(--muted)"}>
          {akis > 0.5 ? "çoğunlukla alkol" : "toplama kabı"}
        </text>
      </g>
    </svg>
  );
}

/* ---------- suyun elektrolizi ---------- */

function Elektroliz({ t, oynuyor, s }: SahneProps) {
  const u = s.son === true ? 1 : oran(t, oynuyor, Number(s.sure ?? 5));
  const tup = (x: number, gaz: number, ad: string, renk: string, adUzun: string) => (
    <g>
      <rect x={x - 16} y={56} width={32} height={118} fill={SU} />
      {gaz > 0 && <rect x={x - 16} y={56} width={32} height={gaz} fill="#fff" />}
      <path d={`M${x - 16} 174 L${x - 16} 70 Q${x - 16} 54 ${x} 54 Q${x + 16} 54 ${x + 16} 70 L${x + 16} 174`} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
      <rect x={x - 3} y={160} width={6} height={30} fill="var(--ink)" />
      {(oynuyor || (u > 0 && u < 1)) && [0, 1, 2].map((i) => {
        const k = (u * 6 + i / 3) % 1;
        return <circle key={i} cx={x + (i - 1) * 6} cy={160 - k * (100 - gaz)} r={2.2} fill="#fff" stroke={renk} strokeWidth={1} />;
      })}
      {u > 0.4 && (
        <g>
          <text x={x} y={40} fontSize={15} fontWeight={800} textAnchor="middle" fill={renk}>{ad}</text>
          <text x={x + 24} y={60 + gaz / 2 + 4} fontSize={11} fontWeight={700} fill={renk}>{adUzun}</text>
        </g>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={u >= 1 ? "Su hidrojen ve oksijen gazlarına ayrıldı" : "Suya elektrik akımı veriliyor"}>
      <g>
        <rect x={60} y={110} width={220} height={90} fill={SU} />
        <path d="M60 96 L60 200 L280 200 L280 96" fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
        <text x={170} y={194} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--c1)">su</text>
      </g>
      {tup(116, 72 * u, "H₂", "var(--c1)", "hidrojen")}
      {tup(212, 36 * u, "O₂", "var(--c2)", "oksijen")}
      <g>
        <path d="M116 190 L116 220 L152 220 M212 190 L212 220 L188 220" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
        <rect x={152} y={212} width={36} height={16} rx={3} fill="var(--ink)" />
        <text x={146} y={216} fontSize={13} fontWeight={800} textAnchor="end" fill="var(--ink)">−</text>
        <text x={194} y={217} fontSize={13} fontWeight={800} fill="var(--ink)">+</text>
        <text x={170} y={224} fontSize={9.5} fontWeight={700} textAnchor="middle" fill="#fff">pil</text>
      </g>
      {u >= 1 && <text x={280} y={226} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--muted)">hacim 2 : 1</text>}
    </svg>
  );
}

/* ---------- Lavoisier: kapalı kapta kalay ---------- */

function KapaliKap({ t, oynuyor, s, v }: SahneProps) {
  const sure = Number(s.sure ?? 5);
  const u = oran(t, oynuyor, sure);
  const acik = v.acik === 1;
  const kutle = 120 + (acik ? 0.4 * yumusak(u) : 0);
  const d = yumusak(u); // kalay → kalay oksit
  const renk = `rgb(${Math.round(140 + 90 * d)},${Math.round(150 + 82 * d)},${Math.round(165 + 70 * d)})`;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Terazi ${kutle.toFixed(2)} gram gösteriyor, balonun ağzı ${acik ? "açık" : "kapalı"}`}>
      <g>
        <circle cx={170} cy={116} r={44} fill="#fff" stroke="var(--line-2)" strokeWidth={2.5} />
        <path d="M160 74 L160 36 M180 74 L180 36" stroke="var(--line-2)" strokeWidth={2.5} />
        <ellipse cx={170} cy={150} rx={22 + 4 * d} ry={6} fill={renk} stroke="#aab4c2" strokeWidth={d} />
        <text x={226} y={150} fontSize={11.5} fontWeight={700} fill="var(--muted)">{d > 0.5 ? "kalay oksit" : "kalay"}</text>
      </g>
      {!acik ? (
        <rect x={156} y={28} width={28} height={12} rx={3} fill="var(--ink)" />
      ) : (
        <g>
          {(oynuyor || u > 0) && u < 1 && [0, 1].map((i) => {
            const k = (u * 4 + i / 2) % 1;
            return <text key={i} x={170 + (i ? 10 : -10)} y={8 + k * 48} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--c1)">O₂</text>;
          })}
          <text x={196} y={34} fontSize={11.5} fontWeight={700} fill="var(--c1)">ağzı açık: hava girer</text>
        </g>
      )}
      {oynuyor && <text x={44} y={116} fontSize={12} fontWeight={700} fill="var(--c4)">ısıtılıyor…</text>}
      <g>
        <rect x={100} y={162} width={140} height={8} rx={3} fill="var(--ink)" />
        <rect x={118} y={170} width={104} height={44} rx={8} fill="#eef2f7" />
        <text x={170} y={200} fontSize={20} fontWeight={800} textAnchor="middle" fill={kutle > 120.001 ? "var(--kimya)" : "var(--ink)"} fontFamily="var(--f-display)">
          {kutle.toFixed(2).replace(".", ",")} g
        </text>
        <text x={170} y={230} fontSize={11} textAnchor="middle" fill="var(--muted)">terazi</text>
      </g>
    </svg>
  );
}

/* ---------- bilimsel yöntem döngüsü ---------- */

function Dongu() {
  const adlar = ["gözlem", "hipotez", "deney ve ölçüm", "sonuç"];
  const R = 74, cx = 170, cy = 112;
  const nokta = (a: number, r = R) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const acilar = [-90, 0, 90, 180];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Bilimsel yöntem: gözlem, hipotez, deney ve ölçüm, sonuç">
      {acilar.map((a, i) => {
        const [x1, y1] = nokta(a + 22), [x2, y2] = nokta(a + 68);
        const [ux, uy] = [Math.cos(((a + 68 + 90) * Math.PI) / 180), Math.sin(((a + 68 + 90) * Math.PI) / 180)];
        return (
          <g key={i}>
            <path d={`M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}`} fill="none" stroke="var(--kimya)" strokeWidth={2.5} />
            <path d={`M${x2 + ux * 7} ${y2 + uy * 7} L${x2 - uy * 5} ${y2 + ux * 5} L${x2 + uy * 5} ${y2 - ux * 5} Z`} fill="var(--kimya)" />
          </g>
        );
      })}
      {acilar.map((a, i) => {
        const [x, y] = nokta(a);
        return (
          <g key={adlar[i]}>
            <circle cx={x} cy={y} r={7} fill="var(--kimya)" />
            <text x={x + (a === 0 ? 14 : a === 180 ? -14 : 0)} y={y + (a === -90 ? -14 : a === 90 ? 24 : 4)} fontSize={13} fontWeight={700} textAnchor={a === 0 ? "start" : a === 180 ? "end" : "middle"} fill="var(--ink)">{adlar[i]}</text>
          </g>
        );
      })}
      <g fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        <text x={cx} y={cy - 2}>herkes tekrarlar,</text>
        <text x={cx} y={cy + 14}>sayıyla ölçer</text>
      </g>
    </svg>
  );
}

/* ---------- molekül kur ---------- */

const ATOM: Record<string, { renk: string; r: number; yazi: string }> = {
  H: { renk: "#ffffff", r: 15, yazi: "var(--ink)" },
  O: { renk: "var(--c2)", r: 22, yazi: "#fff" },
  C: { renk: "#3b4656", r: 22, yazi: "#fff" },
  N: { renk: "var(--c1)", r: 21, yazi: "#fff" },
  Na: { renk: "var(--c5)", r: 24, yazi: "#fff" },
  Cl: { renk: "var(--c3)", r: 24, yazi: "#fff" },
};
const ALT = "₀₁₂₃₄₅₆₇₈₉";
const indis = (n: number) => (n === 1 ? "" : String(n).split("").map((c) => ALT[+c]).join(""));

function Molekul({ s, v }: SahneProps) {
  const turler = (s.atomlar as string[]) ?? [];
  const sayi = turler.map((a) => Math.max(0, v[a] ?? 0));
  const toplam = sayi.reduce((a, b) => a + b, 0);
  const iyonik = s.iyonik === true;
  const formul = turler.map((a, i) => (sayi[i] ? a + indis(sayi[i]) : "")).join("");
  const anahtar = turler.map((a, i) => (sayi[i] ? a + (sayi[i] > 1 ? sayi[i] : "") : "")).join("");
  const ad = ((s.adlar as Record<string, string>) ?? {})[anahtar] ?? "";
  // Merkez atom: en az sayıda olan (eşitse ilk) tür; diğerleri çevresine dizilir.
  const varolan = turler.map((a, i) => ({ a, n: sayi[i] })).filter((x) => x.n > 0);
  const cx = 170, cy = 92;
  const parcalar: { a: string; x: number; y: number }[] = [];
  const baglar: [number, number][] = [];
  if (varolan.length === 1) {
    const { a, n } = varolan[0];
    for (let i = 0; i < n; i++) parcalar.push({ a, x: cx + (i - (n - 1) / 2) * 50, y: cy });
  } else if (varolan.length > 1) {
    const mi = varolan.reduce((m, x) => (x.n < m.n ? x : m), varolan[0]);
    parcalar.push({ a: mi.a, x: cx, y: cy });
    for (let i = 1; i < mi.n; i++) parcalar.push({ a: mi.a, x: cx + (i % 2 ? -1 : 1) * 30 * Math.ceil(i / 2), y: cy - 34 });
    const cevre = varolan.filter((x) => x !== mi).flatMap((x) => Array.from({ length: x.n }, () => x.a));
    const n = cevre.length;
    const acilar =
      n === 1 ? [0] :
      n === 2 ? (mi.a === "O" && cevre.every((a) => a === "H") ? [52 + 90, 90 - 52] : [180, 0]) :
      Array.from({ length: n }, (_, i) => -90 + (i * 360) / n);
    cevre.forEach((a, i) => {
      const r = ATOM[mi.a]?.r ?? 20, R = r + (ATOM[a]?.r ?? 20) + (iyonik ? 4 : 2);
      const d = (acilar[i] * Math.PI) / 180;
      parcalar.push({ a, x: cx + R * Math.cos(d), y: cy + R * Math.sin(d) });
      if (!iyonik) baglar.push([0, parcalar.length - 1]);
    });
  }
  // Molekülü ortala.
  if (parcalar.length) {
    const xs = parcalar.map((p) => p.x), ys = parcalar.map((p) => p.y);
    const dx = cx - (Math.min(...xs) + Math.max(...xs)) / 2, dy = cy - (Math.min(...ys) + Math.max(...ys)) / 2;
    parcalar.forEach((p) => { p.x += dx; p.y += dy; });
  }
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={toplam ? `${formul}${ad ? `, ${ad}` : ""}` : "Henüz atom yok"}>
      <g>
        {baglar.map(([a, b], i) => (
          <line key={i} x1={parcalar[a].x} y1={parcalar[a].y} x2={parcalar[b].x} y2={parcalar[b].y} stroke="var(--line-2)" strokeWidth={6} strokeLinecap="round" />
        ))}
        {parcalar.map((p, i) => {
          const A = ATOM[p.a] ?? { renk: "var(--muted)", r: 20, yazi: "#fff" };
          const yuk = iyonik && varolan.length > 1 ? (p.a === "Na" ? "+" : p.a === "Cl" ? "−" : "") : "";
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={A.r} fill={A.renk} stroke={p.a === "H" ? "var(--line-2)" : "#fff"} strokeWidth={2} />
              <text x={p.x} y={p.y + 5} fontSize={A.r > 18 ? 15 : 13} fontWeight={800} textAnchor="middle" fill={A.yazi}>{p.a}{yuk && <tspan fontSize={11} dy={-7}>{yuk}</tspan>}</text>
            </g>
          );
        })}
        {!toplam && <text x={cx} y={cy + 5} fontSize={13} textAnchor="middle" fill="var(--muted)">Atom ekle</text>}
      </g>
      <g>
        <text x={cx} y={182} fontSize={30} fontWeight={800} textAnchor="middle" fill="var(--ink)" fontFamily="var(--f-display)">{formul || " "}</text>
        <text x={cx} y={208} fontSize={13} fontWeight={700} textAnchor="middle" fill="var(--kimya)">{ad}</text>
      </g>
    </svg>
  );
}

/* ---------- element sembolü ---------- */

function Sembol({ s }: SahneProps) {
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Element sembolü ${String(s.sembol)}, atom numarası ${String(s.z)}`}>
      <rect x={105} y={20} width={130} height={150} rx={16} fill="#fff" stroke="var(--kimya)" strokeWidth={2.5} />
      <text x={121} y={46} fontSize={15} fontWeight={700} fill="var(--muted)">{String(s.z)}</text>
      <text x={170} y={118} fontSize={60} fontWeight={800} textAnchor="middle" fill="var(--ink)" fontFamily="var(--f-display)">{String(s.sembol)}</text>
      <text x={170} y={152} fontSize={22} fontWeight={800} textAnchor="middle" fill="var(--line-2)">?</text>
      {typeof s.ipucu === "string" && <text x={170} y={198} fontSize={12} textAnchor="middle" fill="var(--muted)">{s.ipucu}</text>}
    </svg>
  );
}

/* ---------- tehlike işaretleri (GHS) ---------- */

const ALEV = "M0 -34 C9 -20 22 -12 20 6 C19 22 9 30 0 30 C-12 30 -22 21 -20 5 C-18 -7 -9 -11 -7 -23 C-2 -17 0 -13 2 -8 C5 -17 3 -26 0 -34 Z";

function Piktogram({ s }: SahneProps) {
  const tur = String(s.isaret ?? "alev");
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Kırmızı çerçeveli tehlike işareti">
      <rect x={106} y={46} width={128} height={128} transform="rotate(45 170 110)" fill="#fff" stroke="#e2231a" strokeWidth={9} strokeLinejoin="round" />
      {tur === "alev" && (
        <g>
          <path d={ALEV} transform="translate(170 104) scale(1.1)" fill="var(--ink)" />
          <rect x={140} y={142} width={60} height={6} fill="var(--ink)" />
        </g>
      )}
      {tur === "alev-daire" && (
        <g>
          <path d={ALEV} transform="translate(170 92) scale(0.75)" fill="var(--ink)" />
          <circle cx={170} cy={128} r={15} fill="none" stroke="var(--ink)" strokeWidth={7} />
          <rect x={142} y={150} width={56} height={6} fill="var(--ink)" />
        </g>
      )}
      {tur === "unlem" && <text x={170} y={140} fontSize={84} fontWeight={900} textAnchor="middle" fill="var(--ink)">!</text>}
    </svg>
  );
}

/* ---------- asidin seyreltilmesi ---------- */

function Seyreltme({ t, oynuyor, s, secim }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const dogru = secim === 0;
  const secildi = secim !== null;
  const icerik = !secildi ? null : dogru ? { renk: SU, ad: "su" } : { renk: ASIT, ad: "derişik asit" };
  const dokulen = !secildi ? null : dogru ? { renk: ASIT, ad: "asit" } : { renk: SU, ad: "su" };
  const akiyor = secildi && u > 0.05 && u < 0.85;
  const seviye = 196 - 50 - 22 * kes(u / 0.85);
  const sicrama = secildi && !dogru && u > 0.35;
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={!secildi ? "Derişik asit ve su" : dogru ? "Asit suya yavaşça ekleniyor" : "Su asidin üstüne dökülüyor"}>
      {!secildi ? (
        <g>
          <path d="M70 80 L70 190 Q70 198 78 198 L122 198 Q130 198 130 190 L130 80" fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
          <rect x={72} y={110} width={56} height={86} fill={ASIT} />
          <text x={100} y={70} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--ink)">derişik asit</text>
          <path d="M210 80 L210 190 Q210 198 218 198 L262 198 Q270 198 270 190 L270 80" fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
          <rect x={212} y={110} width={56} height={86} fill={SU} />
          <text x={240} y={70} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--ink)">su</text>
        </g>
      ) : (
        <g>
          <g transform="rotate(-62 108 62)">
            <rect x={84} y={34} width={46} height={64} rx={6} fill="#fff" stroke="var(--line-2)" strokeWidth={2.5} />
            <rect x={86} y={66} width={42} height={30} fill={dokulen!.renk} />
          </g>
          <text x={60} y={30} fontSize={12} fontWeight={700} fill="var(--ink)">{dokulen!.ad}</text>
          {akiyor && <path d={`M150 70 Q160 80 160 ${seviye}`} fill="none" stroke={dokulen!.renk === SU ? "#9cc4ee" : "#e2c35c"} strokeWidth={dogru ? 3 : 7} strokeLinecap="round" />}
          <path d="M120 100 L120 190 Q120 198 128 198 L232 198 Q240 198 240 190 L240 100" fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
          <rect x={122} y={seviye} width={116} height={196 - seviye} fill={icerik!.renk} />
          <text x={180} y={190} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--ink)">{icerik!.ad}</text>
          {sicrama && [0, 1, 2, 3, 4].map((i) => {
            const k = ((u - 0.35) * 5 + i * 0.21) % 1, x = 150 + i * 16, y = seviye - 6 - Math.sin(k * Math.PI) * (30 + i * 6);
            return <circle key={i} cx={x + (i - 2) * k * 14} cy={y} r={3.2} fill="var(--bad)" />;
          })}
          {u > 0.35 && (
            <text x={180} y={220} fontSize={13} fontWeight={800} textAnchor="middle" fill={dogru ? "var(--good)" : "var(--bad)"}>
              {dogru ? "Sakin: ısı suya yayılır" : "Sıçrama: su birden kaynar"}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

export const KIMYA1: Record<string, SahneKaydi> = {
  "element-donusum": { C: ElementDonusum },
  damitma: { C: Damitma },
  elektroliz: { C: Elektroliz },
  "kapali-kap": {
    C: KapaliKap,
    geri: (v) => (v.acik === 1 ? null : { baslik: "Kütle değişmedi", metin: "Ağzı kapalıyken içeri hava giremez. Anahtarla ağzını aç ve yeniden oynat." }),
  },
  "bilim-dongu": { C: Dongu },
  "formul-kur": { C: Molekul },
  "element-sembol": { C: Sembol },
  piktogram: { C: Piktogram },
  seyreltme: { C: Seyreltme },
};
