"use client";
// Kimya sahneleri (mol, asitler ve bazlar): mol paketleri, suyu tartmak, molekül ve atom sayısı,
// gazların molar hacmi, stokiyometri zinciri, sınırlayıcı bileşen; pH ölçeği ve turnusol,
// [H₃O⁺] ve [OH⁻], kuvvetli ve zayıf asit, titrasyon, tuz hidrolizi, tampon, metal + asit.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const virgul = (x: number, b = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const UST: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const us = (n: number) => String(n).split("").map((c) => UST[c] ?? c).join("");
/** a × 10ⁿ biçiminde yazar (a virgüllü). */
const bilimsel = (x: number, b = 2) => {
  if (x === 0) return "0";
  const n = Math.floor(Math.log10(x)), a = x / 10 ** n;
  return `${a.toLocaleString("tr-TR", { minimumFractionDigits: b, maximumFractionDigits: b })}×10${us(n)}`;
};
const SU = "#d6e8fb";
const NA = 6.02e23;

/* ---------- atom ve molekül çizimi ---------- */

const ATOM: Record<string, { f: string; s: string; r: number; y: string }> = {
  H: { f: "#eef2f7", s: "#9aa8ba", r: 9, y: "var(--ink)" },
  O: { f: "var(--c2)", s: "#fff", r: 11, y: "#fff" },
};
const MOL: Record<string, [string, number, number][]> = {
  H2: [["H", -7, 0], ["H", 7, 0]],
  O2: [["O", -9, 0], ["O", 9, 0]],
  H2O: [["H", -12, 7], ["H", 12, 7], ["O", 0, -1]],
};

function Atom({ e, x, y, k = 1, op = 1 }: { e: string; x: number; y: number; k?: number; op?: number }) {
  const a = ATOM[e];
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={a.r * k} fill={a.f} stroke={a.s} strokeWidth={1.2} />
      {k >= 0.8 && <text x={x} y={y + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill={a.y}>{e}</text>}
    </g>
  );
}

function Molekul({ m, x, y, k = 1, op = 1 }: { m: string; x: number; y: number; k?: number; op?: number }) {
  return (
    <g opacity={op}>
      {MOL[m].map(([e, dx, dy], i) => <Atom key={i} e={e} x={x + dx * k} y={y + dy * k} k={k} />)}
    </g>
  );
}

/* ---------- mol paketleri: 1 mol C, 1 mol H₂O, 1 mol Fe ---------- */

const PAKET = [
  { ad: "Karbon (C)", M: 12, renk: "#3b4656", tan: "atom" },
  { ad: "Su (H₂O)", M: 18, renk: "var(--c1)", tan: "molekül" },
  { ad: "Demir (Fe)", M: 56, renk: "#9aa8ba", tan: "atom" },
];

function Paket({ v }: SahneProps) {
  const n = v.n ?? 1;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`${n} mol karbon, su ve demir`}>
      <text x={170} y={20} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">Her kefede {n} mol madde</text>
      {PAKET.map((p, i) => {
        const cx = 60 + i * 110, m = p.M * n;
        // Yığının yüksekliği kütleyle orantılı (en çok 3 × 56 g = 168 g).
        const h = Math.max(4, (m / 168) * 92);
        return (
          <g key={i}>
            <rect x={cx - 26} y={150 - h} width={52} height={h} rx={6} fill={p.renk} opacity={0.9} />
            <rect x={cx - 42} y={150} width={84} height={8} rx={3} fill="#cfd8e3" />
            <rect x={cx - 30} y={158} width={60} height={22} rx={6} fill="#e6ebf2" />
            <text x={cx} y={174} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{virgul(m)} g</text>
            <text x={cx} y={198} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{p.ad}</text>
            <text x={cx} y={214} fontSize={11} textAnchor="middle" fill="var(--kimya)">{bilimsel(n * NA)} {p.tan}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- suyu tartmak: n = m / M ---------- */

function SuTart({ v }: SahneProps) {
  const n = v.n ?? 1, m = 18 * n;
  const dolu = kes(m / 72);
  const top = 156 - dolu * 96;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${virgul(n)} mol su, ${virgul(m)} gram`}>
      <g>
        <path d="M96 52 L96 156 Q96 164 104 164 L156 164 Q164 164 164 156 L164 52" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={97.5} y={top} width={65} height={Math.max(0, 162.5 - top)} rx={6} fill={SU} />
        {[1, 2, 3].map((k) => (
          <line key={k} x1={150} x2={162} y1={156 - k * 24} y2={156 - k * 24} stroke="var(--muted)" strokeWidth={1.2} />
        ))}
      </g>
      <g>
        <rect x={70} y={168} width={120} height={8} rx={3} fill="#cfd8e3" />
        <rect x={84} y={176} width={92} height={28} rx={7} fill="#e6ebf2" />
        <text x={130} y={195} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">{virgul(m)} g</text>
      </g>
      <g fontSize={12.5} fontWeight={700}>
        <text x={204} y={70} fill="var(--muted)">M(H₂O) = 2·1 + 16</text>
        <text x={204} y={88} fill="var(--muted)">= 18 g/mol</text>
        <text x={204} y={122} fill="var(--ink)">n = {virgul(n)} mol</text>
        <text x={204} y={140} fill="var(--ink)">m = {virgul(n)} × 18 = {virgul(m)} g</text>
        <text x={204} y={174} fill="var(--kimya)">{bilimsel(n * NA)}</text>
        <text x={204} y={190} fill="var(--kimya)">molekül</text>
      </g>
    </svg>
  );
}

/* ---------- molekül ve atom sayısı ---------- */

function AtomSay({ v }: SahneProps) {
  const ayir = (v.a ?? 0) === 1;
  const yer = [70, 140, 210, 280];
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={ayir ? "4 su molekülü 8 hidrojen ve 4 oksijen atomuna ayrıldı" : "4 su molekülü"}>
      <text x={170} y={24} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ayir ? "Atomlarına ayrılmış hâli" : "4 su molekülü"}</text>
      {yer.map((x, i) =>
        ayir ? (
          <g key={i}>
            <Atom e="H" x={x - 16} y={112} />
            <Atom e="H" x={x + 16} y={112} />
            <Atom e="O" x={x} y={78} />
          </g>
        ) : (
          <Molekul key={i} m="H2O" x={x} y={96} k={1.3} />
        ),
      )}
      <g fontSize={13} fontWeight={800} textAnchor="middle">
        <text x={110} y={164} fill="var(--c1)">molekül: 4</text>
        <text x={230} y={164} fill={ayir ? "var(--kimya)" : "var(--muted)"}>atom: {ayir ? "8 H + 4 O = 12" : "?"}</text>
      </g>
      <text x={170} y={186} fontSize={11.5} textAnchor="middle" fill="var(--muted)">Alt indis, bir moleküldeki atom sayısıdır: H₂O = 2 H + 1 O</text>
    </svg>
  );
}

/* ---------- gazların molar hacmi ---------- */

function Gaz({ v }: SahneProps) {
  const n = v.n ?? 1, oda = (v.k ?? 0) === 1;
  const Vm = oda ? 24.5 : 22.4, V = n * Vm;
  // Şırınganın pistonu hacimle yükselir; 80 L tam boy.
  const Y0 = 186, boy = 140, y = Y0 - (V / 80) * boy;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${virgul(n)} mol gaz, ${oda ? "oda koşulunda" : "normal koşullarda"}, ${virgul(V)} litre`}>
      <g>
        <rect x={70} y={Y0 - boy - 6} width={80} height={boy + 6} rx={4} fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={72} y={y} width={76} height={Math.max(0, Y0 - y - 1)} fill="#eef2f7" />
        {[20, 40, 60].map((L) => (
          <g key={L}>
            <line x1={136} x2={148} y1={Y0 - (L / 80) * boy} y2={Y0 - (L / 80) * boy} stroke="var(--muted)" strokeWidth={1.2} />
            <text x={62} y={Y0 - (L / 80) * boy + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{L} L</text>
          </g>
        ))}
      </g>
      <g>
        <rect x={72} y={y - 8} width={76} height={8} rx={2} fill="var(--ink)" />
        <rect x={106} y={Math.max(14, y - 40)} width={8} height={Math.max(0, y - 8 - Math.max(14, y - 40))} fill="var(--ink)" />
      </g>
      {Array.from({ length: Math.round(n * 4) }, (_, i) => {
        const r = rastgele(31 + i);
        return <circle key={i} cx={80 + r() * 60} cy={y + 8 + r() * Math.max(4, Y0 - y - 16)} r={3.4} fill="var(--kimya)" />;
      })}
      <g fontSize={12.5} fontWeight={700}>
        <text x={176} y={52} fill="var(--muted)">{oda ? "Oda koşulu" : "Normal koşul (NK)"}</text>
        <text x={176} y={70} fill="var(--muted)">{oda ? "25 °C, 1 atm" : "0 °C, 1 atm"}</text>
        <text x={176} y={92} fill="var(--muted)">1 mol gaz = {virgul(Vm)} L</text>
        <text x={176} y={124} fill="var(--ink)">n = {virgul(n)} mol</text>
        <text x={176} y={146} fontSize={16} fontWeight={800} fill="var(--kimya)">V = {virgul(V, 2)} L</text>
      </g>
    </svg>
  );
}

/* ---------- stokiyometri: CH₄ + 2O₂ → CO₂ + 2H₂O ---------- */

function Stok({ v }: SahneProps) {
  const m = v.m ?? 16, n = m / 16, mco2 = n * 44;
  const kutu = (x: number, y: number, ust: string, alt: string, renk: string) => (
    <g>
      <rect x={x} y={y} width={132} height={52} rx={10} fill="#fff" stroke={renk} strokeWidth={1.8} />
      <text x={x + 66} y={y + 22} fontSize={14} fontWeight={800} textAnchor="middle" fill={renk}>{ust}</text>
      <text x={x + 66} y={y + 41} fontSize={11.5} fontWeight={600} textAnchor="middle" fill="var(--muted)">{alt}</text>
    </g>
  );
  const ok = (x1: number, y1: number, x2: number, y2: number, yazi: string, tx: number, ty: number) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1.6} />
      <path d={`M${x2} ${y2} l-5 -8 l10 0 Z`} fill="var(--muted)" transform={y2 === y1 ? `rotate(-90 ${x2} ${y2})` : undefined} />
      <text x={tx} y={ty} fontSize={11.5} fontWeight={700} fill="var(--ink)">{yazi}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${virgul(m)} g metan yanınca ${virgul(mco2)} g karbon dioksit oluşur`}>
      <text x={170} y={20} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">CH₄ + 2O₂ → CO₂ + 2H₂O</text>
      {kutu(14, 38, `${virgul(m)} g CH₄`, "verilen", "var(--ink)")}
      {kutu(194, 38, `${virgul(n, 2)} mol CH₄`, "1. mole çevir", "var(--c1)")}
      {kutu(194, 158, `${virgul(n, 2)} mol CO₂`, "2. katsayı oranı", "var(--c1)")}
      {kutu(14, 158, `${virgul(mco2)} g CO₂`, "3. istenen birim", "var(--kimya)")}
      {ok(146, 64, 186, 64, "÷ 16", 152, 56)}
      {ok(260, 90, 260, 150, "1 : 1", 268, 126)}
      {ok(194, 184, 154, 184, "× 44", 158, 176)}
      <text x={80} y={126} fontSize={11.5} textAnchor="middle" fill="var(--muted)">NK'de {virgul(n * 22.4, 2)} L CO₂</text>
    </svg>
  );
}

/* ---------- sınırlayıcı bileşen: 3 mol H₂ + 1 mol O₂ ---------- */

function Sinir({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const once = kes(1 - u * 2.2), sonra = kes(u * 2.2 - 1.2);
  const kay = yumusak(kes(u * 1.6));
  const H = [{ x: 46, y: 70 }, { x: 46, y: 112 }, { x: 46, y: 154 }];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="3 mol hidrojen ve 1 mol oksijen tepkimeye giriyor">
      <text x={170} y={22} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">2H₂ + O₂ → 2H₂O</text>
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={46} y={46} fill="var(--muted)">6 g H₂ = 3 mol</text>
        <text x={140} y={46} fill="var(--muted)">32 g O₂ = 1 mol</text>
      </g>
      {H.map((p, i) => (
        <Molekul key={i} m="H2" x={i < 2 ? ara(p.x, 200, kay) : p.x} y={i < 2 ? ara(p.y, 100 + i * 24, kay) : p.y} op={i < 2 ? once : 1} />
      ))}
      <Molekul m="O2" x={ara(140, 222, kay)} y={ara(112, 112, kay)} op={once} />
      <g opacity={sonra}>
        <Molekul m="H2O" x={232} y={84} />
        <Molekul m="H2O" x={232} y={142} />
      </g>
      <text x={290} y={46} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--c1)" opacity={sonra}>2 mol su</text>
      {u >= 1 && (
        <g fontSize={12} fontWeight={800}>
          <text x={14} y={186} fill="var(--kimya)">1 mol H₂ arttı (2 g)</text>
          <text x={232} y={186} textAnchor="middle" fill="var(--c1)">36 g su</text>
          <text x={170} y={210} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">O₂ tükendi: ürünü o belirledi.</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- pH ölçeği ve turnusol ---------- */

export const PH_RENK = ["#d6342c", "#e5512f", "#ef7a2f", "#f4a12c", "#f2c12e", "#d9cf34", "#a8c83a", "#58b04a", "#2e9d6a", "#2a8f8a", "#2f7cb3", "#3a5fb8", "#4b4aa8", "#5a3b98", "#5b2d84"];
const PH_ORNEK = ["Akü asidi", "Mide özsuyu", "Limon suyu", "Sirke", "Domates", "Kahve", "Süt", "Saf su", "Deniz suyu", "Karbonat (NaHCO₃)", "Sabunlu su", "Amonyaklı temizleyici", "Kireç suyu", "Çamaşır suyu", "Lavabo açıcı"];

function PhOlcek({ v }: SahneProps) {
  const p = v.p ?? 7;
  const cw = 20, x0 = 20;
  const tur = p < 7 ? "asidik" : p > 7 ? "bazik" : "nötr";
  const turnusol = p < 7 ? "#e2483b" : p > 7 ? "#3a63c4" : "#8d55e0";
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`pH ${p}: ${PH_ORNEK[p]}, ${tur}; turnusol ${p < 7 ? "kırmızı" : p > 7 ? "mavi" : "mor"}`}>
      <g>
        {PH_RENK.map((r, i) => <rect key={i} x={x0 + i * cw} y={40} width={cw - 2} height={24} rx={4} fill={r} />)}
        {PH_RENK.map((_, i) => (
          <text key={i} x={x0 + i * cw + (cw - 2) / 2} y={80} fontSize={11} textAnchor="middle" fill={i === p ? "var(--ink)" : "var(--muted)"} fontWeight={i === p ? 800 : 400}>{i}</text>
        ))}
      </g>
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <text x={x0} y={28}>asidik</text>
        <text x={x0 + 7 * cw + 9} y={28} textAnchor="middle">nötr</text>
        <text x={x0 + 15 * cw - 2} y={28} textAnchor="end">bazik</text>
      </g>
      <path d={`M${x0 + p * cw + 9} 66 l-6 -9 l12 0 Z`} transform={`rotate(180 ${x0 + p * cw + 9} 61.5)`} fill="var(--ink)" />
      <g>
        <rect x={40} y={104} width={20} height={70} rx={3} fill={turnusol} />
        <text x={50} y={194} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">turnusol</text>
      </g>
      <g>
        <text x={84} y={122} fontSize={16} fontWeight={800} fill="var(--ink)">pH {p}: {PH_ORNEK[p]}</text>
        <text x={84} y={146} fontSize={13} fontWeight={700} fill={p < 7 ? "var(--bad)" : p > 7 ? "var(--c1)" : "var(--c5)"}>
          {tur === "nötr" ? "Nötr" : tur === "asidik" ? "Asidik" : "Bazik"}: turnusol {p < 7 ? "kırmızı" : p > 7 ? "mavi" : "mor"}
        </text>
        <text x={84} y={170} fontSize={11.5} fill="var(--muted)">Değerler yaklaşıktır (25 °C).</text>
      </g>
    </svg>
  );
}

/* ---------- [H₃O⁺] ve [OH⁻] ---------- */

function Log({ v }: SahneProps) {
  const p = v.p ?? 7;
  const x0 = 106, w = 210;
  // Çubuk boyu logaritmik: 10⁻¹⁴ M sıfır, 1 M tam boy.
  const boy = (e: number) => Math.max(2, ((14 - e) / 14) * w);
  const kat = 7 - p;
  return (
    <svg viewBox="0 0 340 204" role="img" aria-label={`pH ${p}: H3O+ derişimi 10 üzeri eksi ${p}, OH- derişimi 10 üzeri eksi ${14 - p} molar`}>
      <text x={170} y={22} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">pH = {p}   ·   pOH = {14 - p}</text>
      <g>
        <text x={14} y={66} fontSize={12.5} fontWeight={800} fill="var(--bad)">[H₃O⁺]</text>
        <rect x={x0} y={52} width={boy(p)} height={20} rx={5} fill="var(--bad)" opacity={0.85} />
        <text x={14} y={84} fontSize={11.5} fill="var(--muted)">1×10{us(-p)} M</text>
      </g>
      <g>
        <text x={14} y={122} fontSize={12.5} fontWeight={800} fill="var(--c1)">[OH⁻]</text>
        <rect x={x0} y={108} width={boy(14 - p)} height={20} rx={5} fill="var(--c1)" opacity={0.85} />
        <text x={14} y={140} fontSize={11.5} fill="var(--muted)">1×10{us(p - 14)} M</text>
      </g>
      <text x={x0} y={166} fontSize={11} fill="var(--muted)">Çubuklar logaritmik: her çentik 10 kat.</text>
      {Array.from({ length: 15 }, (_, i) => <line key={i} x1={x0 + (i / 14) * w} x2={x0 + (i / 14) * w} y1={146} y2={150} stroke="var(--line-2)" />)}
      <text x={170} y={190} fontSize={12} fontWeight={700} textAnchor="middle" fill={kat === 0 ? "var(--muted)" : "var(--kimya)"}>
        {kat === 0 ? "Saf su: [H₃O⁺] = [OH⁻]" : kat > 0 ? `Saf suya göre ${virgul(10 ** kat, 0)} kat çok H₃O⁺` : `Saf suya göre ${virgul(10 ** -kat, 0)} kat az H₃O⁺`}
      </text>
    </svg>
  );
}

/* ---------- kuvvetli ve zayıf asit ---------- */

function Kuvvet({ v }: SahneProps) {
  const zayif = (v.z ?? 0) === 1;
  const N = 8, iyon = zayif ? 1 : N;
  const ad = zayif ? "CH₃COOH (sirke asidi)" : "HCl (hidroklorik asit)";
  const isik = zayif ? 0.25 : 1;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`0,1 M ${ad}: ${zayif ? "moleküllerin çoğu iyonlaşmamış" : "hepsi iyonlaşmış"}`}>
      <text x={170} y={20} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">0,1 M {ad}</text>
      <g>
        <path d="M44 48 L44 182 Q44 192 54 192 L196 192 Q206 192 206 182 L206 48" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={45.5} y={70} width={159} height={120.5} rx={8} fill={SU} />
      </g>
      {Array.from({ length: N }, (_, i) => {
        const x = 54 + (i % 4) * 38, y = 106 + Math.floor(i / 4) * 50 + (i % 2) * 8;
        return i < iyon ? (
          <g key={i} fontSize={11} fontWeight={800}>
            <text x={x} y={y} fill="var(--bad)">H₃O⁺</text>
            <text x={x + 4} y={y + 22} fill="var(--c1)">{zayif ? "A⁻" : "Cl⁻"}</text>
          </g>
        ) : (
          <g key={i}>
            <rect x={x - 4} y={y - 12} width={34} height={18} rx={9} fill="#fff" stroke="#9aa8ba" />
            <text x={x + 13} y={y + 1} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--ink)">HA</text>
          </g>
        );
      })}
      <g>
        <rect x={92} y={50} width={6} height={36} fill="#9aa8ba" />
        <rect x={152} y={50} width={6} height={36} fill="#9aa8ba" />
        <path d="M95 50 L95 34 L268 34 L268 76" fill="none" stroke="var(--ink)" strokeWidth={1.4} />
        <path d="M155 50 L155 42 L230 42 L230 116 L260 116" fill="none" stroke="var(--ink)" strokeWidth={1.4} />
        <rect x={188} y={26} width={18} height={16} fill="#fff" />
        <line x1={192} x2={192} y1={26} y2={42} stroke="var(--ink)" strokeWidth={2} />
        <line x1={200} x2={200} y1={30} y2={38} stroke="var(--ink)" strokeWidth={3} />
        <circle cx={268} cy={92} r={30} fill="#fff6d6" opacity={isik} />
        <circle cx={268} cy={92} r={16} fill="#fff" stroke={zayif ? "#9aa8ba" : "var(--c4)"} strokeWidth={2.4} />
        <rect x={260} y={108} width={16} height={12} rx={2} fill="#9aa8ba" />
        <text x={268} y={146} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{zayif ? "lamba sönük" : "lamba parlak"}</text>
      </g>
      <g fontSize={12.5} fontWeight={800}>
        <text x={268} y={176} textAnchor="middle" fill="var(--ink)">pH ≈ {zayif ? "2,9" : "1"}</text>
        <text x={268} y={196} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{zayif ? "~%1 iyonlaşır" : "tamamı iyonlaşır"}</text>
      </g>
    </svg>
  );
}

/* ---------- titrasyon: 25 mL 0,1 M HCl + 0,1 M NaOH ---------- */

const phTitr = (V: number) => {
  const a = 2.5, b = 0.1 * V, top = 25 + V;
  if (Math.abs(a - b) < 1e-9) return 7;
  return a > b ? -Math.log10((a - b) / top) : 14 + Math.log10((b - a) / top);
};

function Titrasyon({ v }: SahneProps) {
  const V = v.V ?? 0, p = phTitr(V);
  const gx = (x: number) => 196 + (x / 50) * 128, gy = (y: number) => 186 - (y / 14) * 150;
  const egri = Array.from({ length: 201 }, (_, i) => {
    const x = (i / 200) * 50;
    return `${i ? "L" : "M"}${gx(x).toFixed(1)} ${gy(phTitr(x)).toFixed(1)}`;
  }).join(" ");
  const pembe = kes((p - 8.2) / 1.8);
  const buret = 40 + (V / 50) * 70;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${virgul(V)} mL NaOH eklendi, pH ${virgul(p, 1)}`}>
      <g>
        <rect x={76} y={16} width={16} height={110} rx={3} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
        <rect x={77.5} y={buret} width={13} height={Math.max(0, 124.5 - buret)} fill="#eef2f7" />
        <path d="M80 126 L88 126 L85 140 L83 140 Z" fill="var(--ink)" />
        <text x={100} y={30} fontSize={11} fontWeight={700} fill="var(--muted)">0,1 M NaOH</text>
      </g>
      <g>
        <path d="M70 150 L56 196 Q54 202 60 202 L108 202 Q114 202 112 196 L98 150 Z" fill="none" stroke="var(--ink)" strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M66 166 L57.5 196 Q56 200.5 61 200.5 L107 200.5 Q112 200.5 110.5 196 L102 166 Z" fill={pembe > 0 ? `rgba(236, 86, 160, ${0.1 + 0.55 * pembe})` : "rgba(47, 124, 246, 0.08)"} />
        <text x={84} y={220} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">25 mL 0,1 M HCl</text>
      </g>
      <g>
        <line x1={gx(0)} x2={gx(50)} y1={gy(0)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <line x1={gx(0)} x2={gx(0)} y1={gy(14)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <line x1={gx(0)} x2={gx(50)} y1={gy(7)} y2={gy(7)} stroke="var(--line-2)" strokeDasharray="4 3" />
        <text x={gx(0) - 5} y={gy(7) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">7</text>
        <text x={gx(0) - 5} y={gy(14) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">14</text>
        <text x={gx(0) - 5} y={gy(0) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">0</text>
        <text x={gx(25)} y={gy(0) + 15} fontSize={11} textAnchor="middle" fill="var(--muted)">25</text>
        <text x={gx(50)} y={gy(0) + 15} fontSize={11} textAnchor="middle" fill="var(--muted)">50 mL</text>
        <text x={gx(0)} y={gy(14) - 8} fontSize={11} fontWeight={700} fill="var(--ink)">pH</text>
      </g>
      <path d={egri} fill="none" stroke="var(--kimya)" strokeWidth={2.4} />
      <circle cx={gx(V)} cy={gy(p)} r={6} fill="#fff" stroke="var(--ink)" strokeWidth={2.4} />
      <text x={gx(50)} y={gy(14) - 8} fontSize={13} fontWeight={800} textAnchor="end" fill={Math.abs(p - 7) < 0.01 ? "var(--good)" : "var(--ink)"}>pH {virgul(p, 1)}</text>
    </svg>
  );
}

/* ---------- tuz hidrolizi: CH₃COONa çözeltisi ---------- */

function Tuz({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const p = 7 + 1.7 * yumusak(kes((u - 0.2) / 0.7));
  // 3 asetat, 3 sodyum iyonu; asetatlardan ikisi sudan proton alır.
  const parca = [
    { x: 58, y: 100, na: false, doner: true },
    { x: 140, y: 100, na: true, doner: false },
    { x: 58, y: 140, na: true, doner: false },
    { x: 134, y: 140, na: false, doner: true },
    { x: 58, y: 180, na: false, doner: false },
    { x: 140, y: 180, na: true, doner: false },
  ];
  const tepki = kes((u - 0.15) / 0.6);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Sodyum asetat çözeltisi, pH ${virgul(p, 1)}`}>
      <text x={170} y={20} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">CH₃COOH + NaOH → CH₃COONa + H₂O</text>
      <g>
        <path d="M44 56 L44 190 Q44 200 54 200 L196 200 Q206 200 206 190 L206 56" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={45.5} y={74} width={159} height={124.5} rx={8} fill={SU} />
      </g>
      {parca.map((q, i) => {
        const doner = q.doner && tepki > 0;
        return (
          <g key={i} fontSize={11.5} fontWeight={800}>
            <text x={q.x} y={q.y} fill={q.na ? "#7d8da3" : "var(--kimya)"} opacity={doner ? 1 - tepki : 1}>{q.na ? "Na⁺" : "CH₃COO⁻"}</text>
            {doner && (
              <g opacity={tepki}>
                <text x={q.x} y={q.y} fill="var(--ink)">CH₃COOH</text>
                <text x={q.x} y={q.y + 16} fill="var(--c1)">+ OH⁻</text>
              </g>
            )}
          </g>
        );
      })}
      <g>
        <rect x={238} y={62} width={76} height={104} rx={12} fill="#fff" stroke="var(--ink)" strokeWidth={1.6} />
        <text x={276} y={88} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">pH metre</text>
        <text x={276} y={124} fontSize={22} fontWeight={800} textAnchor="middle" fill={p > 7.05 ? "var(--c1)" : "var(--ink)"}>{u > 0 ? virgul(p, 1) : "?"}</text>
        <line x1={276} x2={276} y1={166} y2={186} stroke="var(--ink)" strokeWidth={1.6} />
        <line x1={276} x2={206} y1={186} y2={186} stroke="var(--ink)" strokeWidth={1.6} />
      </g>
      {u >= 1 && <text x={276} y={212} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--c1)">OH⁻ oluştu: bazik</text>}
    </svg>
  );
}

/* ---------- tampon ---------- */

function Tampon({ v }: SahneProps) {
  const x = v.x ?? 0;
  const pSu = x === 0 ? 7 : -Math.log10(x / 1000 / 0.1);
  const pT = 4.74 + Math.log10((10 - x) / (10 + x));
  const kap = (cx: number, ad: string, p: number, p0: number, renk: string) => {
    const fark = p - p0;
    return (
      <g>
        <path d={`M${cx - 54} 50 L${cx - 54} 150 Q${cx - 54} 158 ${cx - 46} 158 L${cx + 46} 158 Q${cx + 54} 158 ${cx + 54} 150 L${cx + 54} 50`} fill="none" stroke="var(--ink)" strokeWidth={1.8} />
        <rect x={cx - 52.5} y={72} width={105} height={84.5} rx={6} fill={renk} />
        <text x={cx} y={36} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ad}</text>
        <text x={cx} y={120} fontSize={20} fontWeight={800} textAnchor="middle" fill="var(--ink)">pH {virgul(p, 2)}</text>
        <text x={cx} y={182} fontSize={12} fontWeight={700} textAnchor="middle" fill={Math.abs(fark) > 1 ? "var(--bad)" : "var(--muted)"}>
          değişim: {fark === 0 ? "0" : `${fark < 0 ? "−" : "+"}${virgul(Math.abs(fark), 2)}`}
        </text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${x} mmol HCl eklendi: saf su pH ${virgul(pSu, 2)}, tampon pH ${virgul(pT, 2)}`}>
      {kap(88, "100 mL saf su", pSu, 7, SU)}
      {kap(252, "100 mL tampon", pT, 4.74, "#efe6fb")}
      <text x={252} y={204} fontSize={11} textAnchor="middle" fill="var(--muted)">CH₃COOH / CH₃COO⁻ (0,1 M)</text>
      <text x={88} y={204} fontSize={11} textAnchor="middle" fill="var(--muted)">eklenen HCl: {x} mmol</text>
    </svg>
  );
}

/* ---------- metal + asit ---------- */

const METAL = [
  { ad: "Mg", hiz: 1 },
  { ad: "Zn", hiz: 0.45 },
  { ad: "Cu", hiz: 0 },
];

function MetalAsit({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Magnezyum, çinko ve bakır seyreltik HCl içinde">
      <text x={170} y={20} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">Her tüpte seyreltik HCl</text>
      {METAL.map((m, i) => {
        const cx = 70 + i * 100;
        const rnd = rastgele(5 + i);
        const sayi = Math.round(m.hiz * 9);
        return (
          <g key={i}>
            <path d={`M${cx - 22} 40 L${cx - 22} 168 Q${cx - 22} 186 ${cx} 186 Q${cx + 22} 186 ${cx + 22} 168 L${cx + 22} 40`} fill="none" stroke="var(--ink)" strokeWidth={1.8} />
            <path d={`M${cx - 20.5} 74 L${cx - 20.5} 168 Q${cx - 20.5} 184.5 ${cx} 184.5 Q${cx + 20.5} 184.5 ${cx + 20.5} 168 L${cx + 20.5} 74 Z`} fill={SU} />
            <rect x={cx - 10} y={160} width={20} height={14} rx={3} fill={i === 2 ? "#c9773c" : "#9aa8ba"} />
            {u > 0 && Array.from({ length: sayi }, (_, j) => {
              const f = (u * (1.5 + m.hiz * 2) + rnd()) % 1;
              return <circle key={j} cx={cx - 12 + rnd() * 24} cy={158 - f * 84} r={2.5 + rnd() * 2} fill="#fff" stroke="#9aa8ba" strokeWidth={1} />;
            })}
            <text x={cx} y={206} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{m.ad}</text>
          </g>
        );
      })}
      {u >= 1 && <text x={170} y={230} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--kimya)">Mg ve Zn: H₂ kabarcıkları · Cu: tepkime yok</text>}
    </svg>
  );
}

export const KIMYA6: Record<string, SahneKaydi> = {
  "kim6-paket": { C: Paket },
  "kim6-su": { C: SuTart },
  "kim6-atom": { C: AtomSay },
  "kim6-gaz": { C: Gaz },
  "kim6-stok": { C: Stok },
  "kim6-sinir": { C: Sinir },
  "kim6-ph": { C: PhOlcek },
  "kim6-log": { C: Log },
  "kim6-kuvvet": { C: Kuvvet },
  "kim6-titrasyon": { C: Titrasyon },
  "kim6-tuz": { C: Tuz },
  "kim6-tampon": { C: Tampon },
  "kim6-metal": { C: MetalAsit },
};
