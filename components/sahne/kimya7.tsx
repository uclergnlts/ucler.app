"use client";
// Kimya sahneleri (kimya her yerde, gazlar): sabun ve misel, sert su, kireç ve sirke, temizleyicileri
// karıştırmak, monomerden polimere, besin etiketi; Boyle, Charles, Gay-Lussac, ideal gaz denklemi,
// kinetik teori, Graham difüzyonu (NH₃–HCl), Dalton kısmi basınçları.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const virgul = (x: number, b = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const SU = "#d6e8fb";
const YAG = "#f2c94c";

/* ---------- sabun molekülü ve misel ---------- */

/** Sabun molekülü: (x, y) baş; kuyruk aci yönünde uzanır (radyan). */
function Sabun({ x, y, aci, boy = 26 }: { x: number; y: number; aci: number; boy?: number }) {
  const dx = Math.cos(aci), dy = Math.sin(aci), nx = -dy, ny = dx;
  const n = 6, nok = Array.from({ length: n + 1 }, (_, i) => {
    const s = 6 + (i / n) * boy, z = i % 2 ? 2.6 : -2.6;
    return `${(x + dx * s + nx * z).toFixed(1)},${(y + dy * s + ny * z).toFixed(1)}`;
  });
  return (
    <g>
      <polyline points={nok.join(" ")} fill="none" stroke="#7d8da3" strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={x} cy={y} r={5.5} fill="var(--kimya)" />
    </g>
  );
}

function Misel({ v }: SahneProps) {
  const var_ = (v.s ?? 0) === 1;
  const CX = 170, CY = 136, R = 32;
  const r = rastgele(7);
  const serbest = Array.from({ length: 7 }, (_, i) => ({ x: 40 + r() * 260, y: 80 + r() * 110, a: r() * 6.28, i }))
    .filter((p) => Math.hypot(p.x - CX, p.y - CY) > R + 34);
  const n = 16;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={var_ ? "Sabun molekülleri yağ damlasını sarıp misel oluşturdu" : "Suda bir yağ damlası ve tek sabun molekülü"}>
      <g>
        <Sabun x={40} y={30} aci={0} boy={70} />
        <text x={40} y={54} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--kimya)">iyonik baş</text>
        <text x={40} y={68} fontSize={11} textAnchor="middle" fill="var(--muted)">suyu sever</text>
        <text x={160} y={28} fontSize={11.5} fontWeight={700} fill="#6b7b91">hidrokarbon kuyruk</text>
        <text x={160} y={42} fontSize={11} fill="var(--muted)">yağı sever</text>
      </g>
      <circle cx={CX} cy={CY} r={R} fill={YAG} />
      {var_
        ? Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2;
            return <Sabun key={i} x={CX + (R + 22) * Math.cos(a)} y={CY + (R + 22) * Math.sin(a)} aci={a + Math.PI} boy={24} />;
          })
        : serbest.map((p) => <Sabun key={p.i} x={p.x} y={p.y} aci={p.a} boy={22} />)}
      <text x={CX} y={CY + 4} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="#7a5a00">yağlı kir</text>
      <text x={322} y={214} fontSize={12} fontWeight={800} textAnchor="end" fill={var_ ? "var(--kimya)" : "var(--muted)"}>
        {var_ ? "Misel: kir suda asılı kaldı" : "Yağ suda çözünmüyor"}
      </text>
    </svg>
  );
}

/* ---------- sert su: sabun mu, deterjan mı? ---------- */

function SertSu({ v }: SahneProps) {
  const sert = (v.sert ?? 1) === 1, det = (v.d ?? 0) === 1;
  const kotu = sert && !det;
  const kopuk = kotu ? 8 : 42;
  const X = 70, W = 90, ALT = 196, SUY = 110;
  // İyonlar düzenli bir ızgarada, satırlar kaydırılmış.
  const iyon = sert ? Array.from({ length: 6 }, (_, i) => ({ x: X + 22 + (i % 2) * 44 + (Math.floor(i / 2) % 2) * 6, y: SUY + 34 + Math.floor(i / 2) * 22, mg: i % 3 === 1 })) : [];
  const kab = Array.from({ length: kotu ? 0 : 9 }, (_, i) => ({ x: X + 8 + (i % 5) * 18 + (i > 4 ? 9 : 0), y: SUY - 10 - (i > 4 ? 18 : 0) - (i % 2) * 6, r: 8 + (i % 3) * 2 }));
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${sert ? "Sert" : "Yumuşak"} su ve ${det ? "deterjan" : "sabun"}: ${kotu ? "az köpük, kaymak oluştu" : "bol köpük"}`}>
      <rect x={X} y={SUY} width={W} height={ALT - SUY} fill={SU} />
      <g>
        {kab.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#fff" stroke="#c5cfdc" strokeWidth={1.2} />)}
        {kotu && <rect x={X + 4} y={SUY - kopuk} width={W - 8} height={kopuk} rx={3} fill="#fff" stroke="#c5cfdc" />}
      </g>
      {kotu && (
        <g fill="#b9c2ce">
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={X + 6 + i * 9} y={SUY + 3 + (i % 3) * 3} width={7} height={3} rx={1.5} />)}
        </g>
      )}
      <g fontSize={10} fontWeight={700} textAnchor="middle">
        {iyon.map((p, i) => (
          <text key={i} x={p.x} y={p.y} fill={p.mg ? "var(--c5)" : "var(--c1)"} opacity={kotu ? 0.4 : 1}>{p.mg ? "Mg²⁺" : "Ca²⁺"}</text>
        ))}
      </g>
      <path d={`M${X} 40 L${X} ${ALT} L${X + W} ${ALT} L${X + W} 40`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g fontSize={12} fontWeight={700}>
        <text x={186} y={64} fill="var(--muted)">Su: <tspan fill="var(--ink)">{sert ? "sert" : "yumuşak"}</tspan></text>
        <text x={186} y={84} fill="var(--muted)">Temizleyici: <tspan fill="var(--ink)">{det ? "deterjan" : "sabun"}</tspan></text>
        <text x={186} y={122} fontSize={14} fontWeight={800} fill={kotu ? "var(--bad)" : "var(--good)"}>{kotu ? "Az köpük" : "Bol köpük"}</text>
        {kotu && <text x={186} y={142} fontSize={11.5} fill="var(--muted)">Sabun Ca²⁺ ve Mg²⁺ ile</text>}
        {kotu && <text x={186} y={158} fontSize={11.5} fill="var(--muted)">çökelek (kaymak) yaptı.</text>}
      </g>
    </svg>
  );
}

/* ---------- kireç ve sirke ---------- */

function Kirec({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const kalin = ara(16, 2, yumusak(u));
  const sirke = u > 0;
  const r = rastgele(11);
  const kab = Array.from({ length: 14 }, () => ({ x: 104 + r() * 132, f: r() }));
  return (
    <svg viewBox="0 0 340 216" role="img" aria-label={u >= 1 ? "Sirke kireci çözdü, karbon dioksit gazı çıktı" : "Dibi kireç tutmuş çaydanlık"}>
      <path d="M88 168 L98 72 Q100 58 116 58 L224 58 Q240 58 242 72 L252 168 Z" fill={sirke ? "#f6eedd" : "none"} />
      <path d="M86 186 L88 168 L252 168 L254 186 Z" fill={sirke ? "#f6eedd" : "none"} />
      <rect x={87} y={186 - kalin} width={166} height={kalin} fill="#e9ecef" stroke="#c8ced6" />
      {sirke && u < 1 && kab.map((b, i) => {
        const yy = 180 - ((u * 3 + b.f) % 1) * 130;
        return <circle key={i} cx={b.x} cy={yy} r={3 + b.f * 2.5} fill="none" stroke="#9aa8ba" strokeWidth={1.2} />;
      })}
      <path d="M86 186 L98 72 Q100 58 116 58 L224 58 Q240 58 242 72 L254 186 Z" fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <rect x={158} y={46} width={24} height={12} rx={4} fill="var(--ink)" />
      <path d="M246 104 L292 62 L300 70 L249 132" fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <g fontSize={11.5} fontWeight={700}>
        <text x={170} y={30} textAnchor="middle" fill="var(--muted)">{sirke ? "sirke eklendi" : "kireç (CaCO₃) tabakası"}</text>
        {u >= 1 && <text x={170} y={208} textAnchor="middle" fill="var(--kimya)">CaCO₃ + asit → çözünen tuz + H₂O + CO₂↑</text>}
      </g>
    </svg>
  );
}

/* ---------- çamaşır suyu + tuz ruhu ---------- */

function Karistir({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const dok = kes(u / 0.4), gaz = kes((u - 0.35) / 0.65);
  const sise = (x: number, ad: string, alt: string, renk: string, sag: boolean) => {
    const aci = (sag ? -1 : 1) * 70 * yumusak(dok);
    return (
      <g transform={`rotate(${aci} ${x} 70)`}>
        <rect x={x - 18} y={40} width={36} height={60} rx={6} fill="#fff" stroke={renk} strokeWidth={2} />
        <rect x={x - 7} y={30} width={14} height={10} fill={renk} />
        <text x={x} y={66} fontSize={10.5} fontWeight={800} textAnchor="middle" fill={renk}>{ad}</text>
        <text x={x} y={80} fontSize={9.5} textAnchor="middle" fill="var(--muted)">{alt}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 258" role="img" aria-label={u >= 1 ? "Karışımdan zehirli klor gazı çıktı" : "Çamaşır suyu ve tuz ruhu şişeleri"}>
      {sise(70, "NaOCl", "çamaşır suyu", "var(--c1)", false)}
      {sise(270, "HCl", "tuz ruhu", "var(--c2)", true)}
      <path d="M120 140 L132 206 L208 206 L220 140 Z" fill={u > 0.3 ? "#eef2c4" : "none"} stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <g opacity={gaz}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={150 + i * 10 + Math.sin(i * 2) * 6} cy={128 - gaz * (20 + i * 9)} r={12 + i * 3} fill="#c9d64a" opacity={0.55} />
        ))}
      </g>
      {u >= 1 && (
        <g fontWeight={800} textAnchor="middle">
          <text x={170} y={230} fontSize={14} fill="var(--bad)">Cl₂: zehirli gaz!</text>
          <text x={170} y={250} fontSize={11.5} fontWeight={600} fill="var(--muted)">NaOCl + 2HCl → NaCl + H₂O + Cl₂</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- monomerden polimere ---------- */

const MONOMER = [
  { ad: "Eten", f: "CH₂=CH₂", p: "Polietilen (PE)", k: "poşet, ambalaj", s: ["H", "H", "H", "H"] },
  { ad: "Vinil klorür", f: "CH₂=CHCl", p: "PVC", k: "su borusu", s: ["H", "H", "H", "Cl"] },
  { ad: "Tetrafloroeten", f: "CF₂=CF₂", p: "Teflon (PTFE)", k: "yapışmaz tava", s: ["F", "F", "F", "F"] },
];
const YAN: Record<string, { f: string; r: number; y: string }> = {
  H: { f: "#eef2f7", r: 5, y: "var(--ink)" },
  Cl: { f: "var(--c3)", r: 7, y: "#fff" },
  F: { f: "#b9dc6b", r: 6, y: "var(--ink)" },
};

/** İki karbonluk birim; (x, y) birimin sol karbonu, ara karbonlar arası uzaklık. */
function Birim({ x, y, s, ara: d, cift }: { x: number; y: number; s: string[]; ara: number; cift: boolean }) {
  const cs = [x, x + d];
  return (
    <g>
      {cift ? (
        <g stroke="var(--ink)" strokeWidth={1.6}>
          <line x1={cs[0]} x2={cs[1]} y1={y - 2.5} y2={y - 2.5} />
          <line x1={cs[0]} x2={cs[1]} y1={y + 2.5} y2={y + 2.5} />
        </g>
      ) : (
        <line x1={cs[0]} x2={cs[1]} y1={y} y2={y} stroke="var(--ink)" strokeWidth={1.6} />
      )}
      {cs.map((cx, i) => (
        <g key={i}>
          <line x1={cx} x2={cx} y1={y - 15} y2={y + 15} stroke="var(--ink)" strokeWidth={1.4} />
          {[s[i * 2], s[i * 2 + 1]].map((e, j) => {
            const yy = j ? y + 17 : y - 17, a = YAN[e];
            return <circle key={j} cx={cx} cy={yy} r={a.r} fill={a.f} stroke="#9aa8ba" strokeWidth={0.8} />;
          })}
          <circle cx={cx} cy={y} r={6} fill="#3b4656" />
        </g>
      ))}
    </g>
  );
}

function Polimer({ v }: SahneProps) {
  const m = MONOMER[Math.max(0, Math.min(2, (v.m ?? 1) - 1))];
  const d = 22;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`${m.ad} monomerinden ${m.p} polimeri`}>
      <g>
        <text x={20} y={26} fontSize={11.5} fontWeight={700} fill="var(--muted)">monomer</text>
        <text x={20} y={44} fontSize={14} fontWeight={800} fill="var(--ink)">{m.ad}</text>
        <text x={20} y={62} fontSize={12} fill="var(--muted)">{m.f}</text>
        <Birim x={210} y={44} s={m.s} ara={d + 4} cift />
      </g>
      <g>
        <line x1={14} x2={326} y1={132} y2={132} stroke="var(--ink)" strokeWidth={1.6} />
        {Array.from({ length: 6 }, (_, i) => <Birim key={i} x={26 + i * 2 * d * 1.18} y={132} s={m.s} ara={d} cift={false} />)}
        <text x={14} y={100} fontSize={11.5} fontWeight={700} fill="var(--muted)">… binlerce birim zincir olur …</text>
      </g>
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <circle cx={96} cy={172} r={5} fill="#3b4656" /><text x={104} y={176}>C</text>
        <circle cx={134} cy={172} r={5} fill={YAN.H.f} stroke="#9aa8ba" strokeWidth={0.8} /><text x={142} y={176}>H</text>
        <circle cx={172} cy={172} r={5} fill={YAN.Cl.f} /><text x={180} y={176}>Cl</text>
        <circle cx={214} cy={172} r={5} fill={YAN.F.f} /><text x={222} y={176}>F</text>
      </g>
      <g>
        <text x={170} y={204} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{m.p}</text>
        <text x={170} y={223} fontSize={12} fontWeight={600} textAnchor="middle" fill="var(--muted)">{m.k}</text>
      </g>
    </svg>
  );
}

/* ---------- besin etiketi ---------- */

function Etiket({ v }: SahneProps) {
  const g = v.g ?? 40, seker = g * 0.25;
  const X0 = 30, X1 = 310, MAX = 80;
  const x = (a: number) => X0 + (Math.min(a, MAX) / MAX) * (X1 - X0);
  const asti = seker >= 50;
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={`${g} gram bisküvi, ${virgul(seker)} gram şeker`}>
      <g>
        <rect x={30} y={16} width={150} height={92} rx={8} fill="#fff" stroke="var(--ink)" strokeWidth={1.6} />
        <text x={42} y={36} fontSize={11.5} fontWeight={800} fill="var(--ink)">Besin değeri (100 g)</text>
        <line x1={42} x2={168} y1={44} y2={44} stroke="var(--line-2)" />
        <text x={42} y={62} fontSize={11.5} fill="var(--muted)">Enerji</text>
        <text x={168} y={62} fontSize={11.5} textAnchor="end" fill="var(--muted)">480 kcal</text>
        <text x={42} y={80} fontSize={11.5} fontWeight={700} fill="var(--kimya)">Şeker</text>
        <text x={168} y={80} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--kimya)">25 g</text>
        <text x={42} y={98} fontSize={11.5} fill="var(--muted)">Tuz</text>
        <text x={168} y={98} fontSize={11.5} textAnchor="end" fill="var(--muted)">0,6 g</text>
      </g>
      <g fontSize={12.5} fontWeight={700}>
        <text x={200} y={44} fill="var(--muted)">Yediğin</text>
        <text x={200} y={64} fontSize={16} fontWeight={800} fill="var(--ink)">{g} g</text>
        <text x={200} y={88} fill="var(--muted)">Aldığın şeker</text>
        <text x={200} y={108} fontSize={16} fontWeight={800} fill={asti ? "var(--bad)" : "var(--kimya)"}>{virgul(seker)} g</text>
      </g>
      <g>
        <rect x={X0} y={140} width={X1 - X0} height={16} rx={8} fill="#eef2f7" />
        <rect x={X0} y={140} width={Math.max(0, x(seker) - X0)} height={16} rx={8} fill={asti ? "var(--bad)" : "var(--kimya)"} />
        <line x1={x(50)} x2={x(50)} y1={132} y2={164} stroke="var(--ink)" strokeWidth={2} />
        <text x={x(50)} y={182} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--ink)">50 g</text>
        <text x={x(50)} y={198} fontSize={11} textAnchor="middle" fill="var(--muted)">günlük önerilen üst sınır</text>
        <text x={X0} y={182} fontSize={11} fill="var(--muted)">0</text>
      </g>
    </svg>
  );
}

/* ---------- gaz kabı (silindir + piston) ---------- */

const CX0 = 40, CW = 120, CALT = 196;
/** Silindirde n tanecik; gaz bölgesi üst sınırı ust. */
function Tanecikler({ n, ust, tohum, renk = "var(--kimya)", x0 = CX0, w = CW, alt = CALT }: { n: number; ust: number; tohum: number; renk?: string; x0?: number; w?: number; alt?: number }) {
  const r = rastgele(tohum);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x0 + 8 + r() * (w - 16)} cy={ust + 8 + r() * Math.max(2, alt - ust - 16)} r={3.6} fill={renk} />
      ))}
    </g>
  );
}

function Silindir({ ust, renk }: { ust: number; renk?: string }) {
  return (
    <g>
      <path d={`M${CX0} 30 L${CX0} ${CALT} L${CX0 + CW} ${CALT} L${CX0 + CW} 30`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={CX0 + 2} y={ust - 10} width={CW - 4} height={10} rx={2} fill={renk ?? "var(--ink)"} />
      <rect x={CX0 + CW / 2 - 4} y={Math.max(14, ust - 34)} width={8} height={Math.max(0, ust - 10 - Math.max(14, ust - 34))} fill={renk ?? "var(--ink)"} />
    </g>
  );
}

/* Boyle: P·V = 4 atm·L */
function Boyle({ v }: SahneProps) {
  const V = v.V ?? 4, P = 4 / V;
  const ust = CALT - V * 19;
  const gx = (x: number) => 200 + (x / 8) * 124, gy = (p: number) => 186 - (p / 4) * 120;
  const egri = Array.from({ length: 71 }, (_, i) => {
    const x = 1 + (i / 70) * 7;
    return `${i ? "L" : "M"}${gx(x).toFixed(1)} ${gy(4 / x).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Hacim ${virgul(V)} litre, basınç ${virgul(P, 2)} atm`}>
      <Silindir ust={ust} />
      <Tanecikler n={16} ust={ust} tohum={5} />
      <g>
        <line x1={gx(0)} x2={gx(8)} y1={gy(0)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <line x1={gx(0)} x2={gx(0)} y1={gy(4)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <text x={gx(0) - 4} y={gy(4) - 6} fontSize={11} fontWeight={700} fill="var(--ink)">P</text>
        <text x={gx(8)} y={gy(0) + 15} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">V (L)</text>
      </g>
      <path d={egri} fill="none" stroke="var(--kimya)" strokeWidth={2.2} />
      <circle cx={gx(V)} cy={gy(P)} r={5.5} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />
      <g fontSize={12.5} fontWeight={800}>
        <text x={200} y={26} fill="var(--ink)">P = {virgul(P, 2)} atm</text>
        <text x={200} y={44} fill="var(--muted)">V = {virgul(V)} L</text>
        <text x={326} y={26} textAnchor="end" fill="var(--kimya)">P·V = 4</text>
      </g>
    </svg>
  );
}

/* Charles: 27 °C'de 6 L, P sabit */
function Charles({ v }: SahneProps) {
  const c = v.t ?? 27, T = c + 273, V = (6 * T) / 300;
  const ust = CALT - V * 12;
  const gx = (x: number) => 196 + ((x + 300) / 700) * 128, gy = (y: number) => 186 - (y / 12) * 120;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${c} santigrat derece, ${T} kelvin, hacim ${virgul(V, 1)} litre`}>
      <Silindir ust={ust} />
      <Tanecikler n={14} ust={ust} tohum={9} />
      <g>
        <line x1={gx(-300)} x2={gx(400)} y1={gy(0)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <line x1={gx(0)} x2={gx(0)} y1={gy(12)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
        <text x={gx(0) + 4} y={gy(12) + 2} fontSize={11} fontWeight={700} fill="var(--ink)">V</text>
        <text x={gx(400)} y={gy(0) + 15} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">t (°C)</text>
        <text x={gx(-273)} y={gy(0) + 15} fontSize={10.5} textAnchor="middle" fill="var(--muted)">−273</text>
      </g>
      <line x1={gx(-273)} y1={gy(0)} x2={gx(-73)} y2={gy(4)} stroke="var(--kimya)" strokeWidth={2} strokeDasharray="4 4" />
      <line x1={gx(-73)} y1={gy(4)} x2={gx(327)} y2={gy(12)} stroke="var(--kimya)" strokeWidth={2.2} />
      <circle cx={gx(c)} cy={gy(V)} r={5.5} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />
      <g fontSize={12.5} fontWeight={800}>
        <text x={190} y={26} fill="var(--ink)">{c} °C = {T} K</text>
        <text x={190} y={44} fill="var(--kimya)">V = {virgul(V, 1)} L</text>
      </g>
    </svg>
  );
}

/* Gay-Lussac: kapalı kutu 27 °C'den 327 °C'ye */
function GayLussac({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const T = 300 + 300 * u, P = T / 300;
  const aci = -120 + (P - 0) * 60; // 0 atm → −120°, 4 atm → 120°
  const GX = 262, GY = 92, R = 40;
  const ig = (a: number, r: number) => [GX + r * Math.sin((a * Math.PI) / 180), GY - r * Math.cos((a * Math.PI) / 180)];
  const [nx, ny] = ig(aci, R - 8);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Kapalı kutu ${Math.round(T)} kelvin, basınç ${virgul(P, 2)} atm`}>
      <rect x={30} y={44} width={140} height={120} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <Tanecikler n={14} ust={44} tohum={13} x0={30} w={140} alt={164} />
      <g opacity={u > 0 ? 1 : 0}>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${56 + i * 30} 196 q-8 -12 0 -22 q8 10 0 22 Z`} fill="var(--c4)" />
        ))}
      </g>
      <line x1={170} y1={92} x2={GX - R} y2={92} stroke="var(--ink)" strokeWidth={2} />
      <circle cx={GX} cy={GY} r={R} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      {[0, 1, 2, 3, 4].map((p) => {
        const [x1, y1] = ig(-120 + p * 60, R - 2), [x2, y2] = ig(-120 + p * 60, R - 9), [tx, ty] = ig(-120 + p * 60, R + 10);
        return (
          <g key={p}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={1.4} />
            <text x={tx} y={ty + 4} fontSize={10} textAnchor="middle" fill="var(--muted)">{p}</text>
          </g>
        );
      })}
      <line x1={GX} y1={GY} x2={nx} y2={ny} stroke="var(--kimya)" strokeWidth={2.6} strokeLinecap="round" />
      <text x={GX} y={GY + R + 16} fontSize={11} textAnchor="middle" fill="var(--muted)">atm</text>
      <g fontSize={12.5} fontWeight={800}>
        <text x={30} y={26} fill="var(--ink)">{Math.round(T - 273)} °C = {Math.round(T)} K</text>
        <text x={326} y={26} textAnchor="end" fill="var(--kimya)">P = {virgul(P, 2)} atm</text>
      </g>
    </svg>
  );
}

/* İdeal gaz: V = 4,1 L, T = 300 K */
function Ideal({ v }: SahneProps) {
  const n = v.n ?? 0.5, P = (n * 0.082 * 300) / 4.1;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${virgul(n)} mol gaz, basınç ${virgul(P)} atm`}>
      <rect x={30} y={30} width={140} height={150} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <Tanecikler n={Math.round(n * 8)} ust={30} tohum={17} x0={30} w={140} alt={180} />
      <text x={100} y={200} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">V = 4,1 L · T = 300 K</text>
      <g fontSize={12.5} fontWeight={700}>
        <text x={188} y={52} fill="var(--muted)">P = n·R·T / V</text>
        <text x={188} y={76} fill="var(--muted)">= {virgul(n)} · 0,082 · 300 / 4,1</text>
        <text x={188} y={110} fontSize={18} fontWeight={800} fill="var(--kimya)">P = {virgul(P)} atm</text>
      </g>
      <g>
        <rect x={188} y={130} width={136} height={12} rx={6} fill="#eef2f7" />
        <rect x={188} y={130} width={Math.max(0, Math.min(136, (P / 18) * 136))} height={12} rx={6} fill="var(--kimya)" />
      </g>
    </svg>
  );
}

/* Kinetik teori: ortalama Ek ∝ T, hız ∝ √T */
function Kinetik({ v }: SahneProps) {
  const T = v.T ?? 300, k = Math.sqrt(T / 300);
  const r = rastgele(21);
  const tan = Array.from({ length: 12 }, () => ({ x: 46 + r() * 128, y: 46 + r() * 118, a: r() * 6.28, f: 0.6 + r() * 0.8 }));
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${T} kelvinde gaz tanecikleri`}>
      <rect x={30} y={30} width={160} height={150} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      {tan.map((p, i) => {
        const L = 14 * k * p.f, x2 = p.x + L * Math.cos(p.a), y2 = p.y + L * Math.sin(p.a);
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={x2} y2={y2} stroke="var(--c1)" strokeWidth={1.6} />
            <circle cx={p.x} cy={p.y} r={4} fill="var(--kimya)" />
          </g>
        );
      })}
      <g fontSize={12.5} fontWeight={700}>
        <text x={206} y={46} fontSize={15} fontWeight={800} fill="var(--ink)">T = {T} K</text>
        <text x={206} y={78} fill="var(--muted)">Ortalama Ek</text>
        <rect x={206} y={86} width={118} height={12} rx={6} fill="#eef2f7" />
        <rect x={206} y={86} width={(T / 600) * 118} height={12} rx={6} fill="var(--kimya)" />
        <text x={206} y={126} fill="var(--muted)">Ortalama hız</text>
        <rect x={206} y={134} width={118} height={12} rx={6} fill="#eef2f7" />
        <rect x={206} y={134} width={(Math.sqrt(T / 600)) * 118} height={12} rx={6} fill="var(--c1)" />
      </g>
      <text x={110} y={200} fontSize={11} textAnchor="middle" fill="var(--muted)">ok boyu = tanecik hızı</text>
    </svg>
  );
}

/* Graham: NH₃ ve HCl borunun iki ucundan */
function Graham({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const X0 = 40, X1 = 300, L = X1 - X0, Y = 100;
  const pay = Math.sqrt(36.5 / 17) / (1 + Math.sqrt(36.5 / 17)); // NH₃'ün aldığı yol oranı ≈ 0,594
  const a = X0 + L * pay * u, b = X1 - L * (1 - pay) * u;
  const r = rastgele(4);
  const nok = (x0: number, x1: number, renk: string, n: number) =>
    Array.from({ length: n }, (_, i) => <circle key={i} cx={x0 + r() * Math.max(0, x1 - x0)} cy={Y - 10 + r() * 20} r={2.6} fill={renk} />);
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={u >= 1 ? "Beyaz NH₄Cl halkası HCl ucuna daha yakın oluştu" : "Uçlarında NH₃ ve HCl olan cam boru"}>
      <rect x={X0} y={Y - 16} width={L} height={32} rx={6} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={X0 - 14} y={Y - 14} width={16} height={28} rx={4} fill="#eef2f7" stroke="var(--c1)" strokeWidth={1.6} />
      <rect x={X1 - 2} y={Y - 14} width={16} height={28} rx={4} fill="#eef2f7" stroke="var(--c2)" strokeWidth={1.6} />
      <g>{nok(X0 + 2, a, "var(--c1)", Math.round(26 * u))}</g>
      <g>{nok(b, X1 - 2, "var(--c2)", Math.round(18 * u))}</g>
      {u >= 1 && <rect x={a - 5} y={Y - 15} width={10} height={30} fill="#fff" stroke="#9aa8ba" strokeWidth={1.2} />}
      <g fontSize={12} fontWeight={800}>
        <text x={X0 - 6} y={Y - 30} fill="var(--c1)">NH₃</text>
        <text x={X0 - 6} y={Y - 46} fontSize={11} fontWeight={600} fill="var(--muted)">17 g/mol</text>
        <text x={X1 + 12} y={Y - 30} textAnchor="end" fill="var(--c2)">HCl</text>
        <text x={X1 + 12} y={Y - 46} fontSize={11} fontWeight={600} textAnchor="end" fill="var(--muted)">36,5 g/mol</text>
      </g>
      {u >= 1 && (
        <g fontSize={11.5} fontWeight={700} textAnchor="middle">
          <line x1={a} x2={a} y1={Y + 18} y2={Y + 34} stroke="var(--ink)" strokeWidth={1.4} />
          <text x={a} y={Y + 50} fill="var(--ink)">beyaz halka: NH₄Cl</text>
          <text x={170} y={Y + 78} fill="var(--muted)">NH₃ yolun %{Math.round(pay * 100)}'unu, HCl %{100 - Math.round(pay * 100)}'unu aldı</text>
        </g>
      )}
    </svg>
  );
}

/* Dalton: 2 mol N₂ + n mol O₂; her mol 0,5 atm */
function Dalton({ v }: SahneProps) {
  const o = v.o ?? 0, pN = 1, pO = 0.5 * o, P = pN + pO;
  const bx = 200, bw = 120, by = (p: number) => 180 - (p / 3) * 130;
  const sutun = (x: number, p: number, renk: string, ad: string) => (
    <g>
      <rect x={x} y={by(p)} width={30} height={Math.max(0, 180 - by(p))} rx={3} fill={renk} />
      <text x={x + 15} y={by(p) - 6} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--ink)">{virgul(p)}</text>
      <text x={x + 15} y={196} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{ad}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={`2 mol N₂ ve ${o} mol O₂; toplam basınç ${virgul(P)} atm`}>
      <rect x={20} y={30} width={150} height={150} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <Tanecikler n={8} ust={30} tohum={23} renk="var(--c1)" x0={20} w={150} alt={180} />
      <Tanecikler n={o * 4} ust={30} tohum={29} renk="var(--c2)" x0={20} w={150} alt={180} />
      <g fontSize={11} fontWeight={700}>
        <circle cx={28} cy={198} r={4} fill="var(--c1)" /><text x={36} y={202} fill="var(--muted)">N₂: 2 mol</text>
        <circle cx={104} cy={198} r={4} fill="var(--c2)" /><text x={112} y={202} fill="var(--muted)">O₂: {o} mol</text>
      </g>
      <line x1={bx - 6} x2={bx + bw} y1={180} y2={180} stroke="var(--ink)" strokeWidth={1.2} />
      {sutun(bx, pN, "var(--c1)", "P(N₂)")}
      {sutun(bx + 44, pO, "var(--c2)", "P(O₂)")}
      {sutun(bx + 88, P, "var(--kimya)", "toplam")}
      <text x={bx + bw} y={22} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--muted)">basınç (atm)</text>
    </svg>
  );
}

export const KIMYA7: Record<string, SahneKaydi> = {
  "kim7-misel": { C: Misel },
  "kim7-sert-su": { C: SertSu },
  "kim7-kirec": { C: Kirec },
  "kim7-karistir": { C: Karistir },
  "kim7-polimer": { C: Polimer },
  "kim7-etiket": { C: Etiket },
  "kim7-boyle": { C: Boyle },
  "kim7-charles": { C: Charles },
  "kim7-gay-lussac": { C: GayLussac },
  "kim7-ideal": { C: Ideal },
  "kim7-kinetik": { C: Kinetik },
  "kim7-graham": { C: Graham },
  "kim7-dalton": { C: Dalton },
};
