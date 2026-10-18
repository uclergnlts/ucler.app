"use client";
// Kimya sahneleri (temel kanunlar, tepkimeler): açık kapta yanan magnezyum, sabit oran ve artan madde,
// kütle-kütle grafiği, katlı oranlar, birleşen gaz hacimleri; atomların yeniden düzenlenmesi,
// denklem denkleştirme, tam ve eksik yanma, çökelme, analiz tepkimesi.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const virgul = (x: number, b = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const SU = "#d6e8fb";

/* ---------- atom ve molekül çizimi ---------- */

const ATOM: Record<string, { f: string; s: string; r: number; y: string }> = {
  H: { f: "#eef2f7", s: "#9aa8ba", r: 9, y: "var(--ink)" },
  O: { f: "var(--c2)", s: "#fff", r: 11, y: "#fff" },
  C: { f: "#3b4656", s: "#fff", r: 11, y: "#fff" },
};

// Her molekülün atomları: [element, dx, dy]. Ortadaki atom en son çizilir, üstte kalır.
const MOL: Record<string, [string, number, number][]> = {
  H2: [["H", -7, 0], ["H", 7, 0]],
  O2: [["O", -9, 0], ["O", 9, 0]],
  H2O: [["H", -12, 7], ["H", 12, 7], ["O", 0, -1]],
  CH4: [["H", -12, -11], ["H", 12, -11], ["H", -12, 11], ["H", 12, 11], ["C", 0, 0]],
  CO2: [["O", -18, 0], ["O", 18, 0], ["C", 0, 0]],
  CO: [["C", -9, 0], ["O", 9, 0]],
};

function Atom({ e, x, y, k = 1 }: { e: string; x: number; y: number; k?: number }) {
  const a = ATOM[e];
  return (
    <g>
      <circle cx={x} cy={y} r={a.r * k} fill={a.f} stroke={a.s} strokeWidth={1.2} />
      {k >= 0.95 && <text x={x} y={y + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill={a.y}>{e}</text>}
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

/* ---------- açık kapta magnezyum yanıyor ---------- */

function Magnezyum({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const yan = kes((u - 0.15) / 0.65);
  const m = 2.4 + 1.6 * yan;
  const alev = u > 0.12 && u < 0.82;
  const uc = 124 + 96 * yan;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Açık kapta magnezyum yanıyor; terazi ${virgul(m, 2)} g gösteriyor`}>
      <text x={170} y={22} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={u >= 1 ? "var(--kimya)" : "var(--muted)"}>
        {u >= 1 ? "2Mg + O₂ → 2MgO: havadaki oksijen katıldı" : alev ? "Magnezyum parlak bir alevle yanıyor" : "Magnezyum şerit, ağzı açık kapta"}
      </text>
      <g>
        <rect x={70} y={160} width={200} height={10} rx={4} fill="#cfd8e3" />
        <rect x={84} y={170} width={172} height={36} rx={8} fill="#e6ebf2" />
        <rect x={124} y={177} width={92} height={22} rx={5} fill="#fff" stroke="var(--line-2)" />
        <text x={170} y={193} fontSize={15} fontWeight={800} textAnchor="middle" fill={yan > 0.99 ? "var(--kimya)" : "var(--ink)"}>
          {m.toFixed(2).replace(".", ",")} g
        </text>
      </g>
      <path d="M96 160 L110 126 L230 126 L244 160 Z" fill="#fff" stroke="var(--ink)" strokeWidth={1.6} strokeLinejoin="round" />
      {yan > 0.02 && <path d={`M${150 - 40 * yan} 126 Q150 ${126 - 40 * yan} ${150 + 40 * yan} 126 Z`} fill="#f6f8fb" stroke="#9aa8ba" strokeWidth={1.5} />}
      {yan < 0.99 && <rect x={uc} y={112} width={Math.max(0, 220 - uc)} height={8} rx={3} fill="#9aa8ba" />}
      {alev && (
        <g>
          <ellipse cx={uc} cy={96} rx={22} ry={28} fill="#fff6d6" />
          <ellipse cx={uc} cy={102} rx={11} ry={15} fill="#fff" stroke="var(--c4)" strokeWidth={1.8} />
        </g>
      )}
      {alev && [0, 1, 2].map((i) => {
        const p = (u * 3 + i / 3) % 1;
        return <Molekul key={i} m="O2" x={ara(60 + i * 110, uc, p * 0.8)} y={ara(40, 90, p)} k={0.9} op={1 - p * 0.6} />;
      })}
      {u >= 1 && <text x={170} y={48} fontSize={12} textAnchor="middle" fill="var(--muted)">2,4 g Mg + 1,6 g O₂ → 4,0 g MgO</text>}
    </svg>
  );
}

/* ---------- sabit oran: hidrojen + oksijen → su ---------- */

function Oran({ s, v, t, oynuyor }: SahneProps) {
  const sure = Number(s.sure ?? 0);
  const u = sure ? oran(t, oynuyor, sure) : 1;
  const h = v.h ?? Number(s.h ?? 10), o = v.o ?? Number(s.o ?? 40);
  const hk = Math.min(h, o / 8), ok = 8 * hk, su = hk + ok;
  const artH = h - hk, artO = o - ok;
  const PX = 6, X0 = 20;
  const bitti = u >= 1;
  const satir = (y: number, ad: string, deger: number, kalan: number, renk: string) => (
    <g>
      <text x={X0} y={y - 6} fontSize={12.5} fontWeight={700} fill="var(--ink)">
        {ad}: {virgul(deger)} g{bitti && kalan > 1e-9 ? ` (artan ${virgul(kalan)} g)` : ""}
      </text>
      <rect x={X0} y={y} width={Math.max(0, deger * PX)} height={16} rx={4} fill="none" stroke="var(--line-2)" strokeDasharray="4 3" />
      <rect x={X0} y={y} width={Math.max(0, (kalan + (deger - kalan) * (1 - u)) * PX)} height={16} rx={4} fill={renk} />
    </g>
  );
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${virgul(h)} g hidrojen, ${virgul(o)} g oksijen`}>
      {satir(46, "Hidrojen", h, artH, "#9aa8ba")}
      {satir(94, "Oksijen", o, artO, "var(--c2)")}
      <line x1={X0} x2={320} y1={128} y2={128} stroke="var(--line-2)" />
      <g>
        <text x={X0} y={150} fontSize={12.5} fontWeight={700} fill="var(--c1)">
          Su: {u > 0 ? `${virgul(su * u)} g` : "?"}
        </text>
        <rect x={X0} y={156} width={Math.max(0, su * u * PX)} height={16} rx={4} fill="var(--c1)" />
      </g>
      <text x={X0} y={200} fontSize={12.5} fontWeight={800} fill={bitti ? (artH > 1e-9 || artO > 1e-9 ? "var(--kimya)" : "var(--good)") : "var(--muted)"}>
        {!bitti ? "Suda kütlece H : O = 1 : 8" : artH > 1e-9 ? `${virgul(artH)} g hidrojen arttı` : artO > 1e-9 ? `${virgul(artO)} g oksijen arttı` : "Hiçbiri artmadı: ikisi de tamamen harcandı"}
      </text>
    </svg>
  );
}

/* ---------- kütle-kütle grafiği ---------- */

function Grafik({ v }: SahneProps) {
  const h = v.h ?? 1;
  const x0 = 52, x1 = 312, y0 = 46, y1 = 196;
  const gx = (x: number) => x0 + (x / 5) * (x1 - x0), gy = (y: number) => y1 - (y / 40) * (y1 - y0);
  const px = gx(h), py = gy(8 * h);
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`${virgul(h)} g hidrojen, ${virgul(8 * h)} g oksijen, ${virgul(9 * h)} g su`}>
      <text x={170} y={18} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        {virgul(h)} g H + {virgul(8 * h)} g O → {virgul(9 * h)} g su
      </text>
      <g>
        {[0, 10, 20, 30, 40].map((y) => (
          <g key={y}>
            <line x1={x0} x2={x1} y1={gy(y)} y2={gy(y)} stroke="var(--line)" />
            <text x={x0 - 6} y={gy(y) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{y}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5].map((x) => (
          <text key={x} x={gx(x)} y={y1 + 15} fontSize={11} textAnchor="middle" fill="var(--muted)">{x}</text>
        ))}
        <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={x0} x2={x0} y1={y0 - 8} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={x0 + 6} y={y0 - 8} fontSize={11} fontWeight={700} fill="var(--ink)">oksijen (g)</text>
        <text x={x1} y={y1 + 30} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">hidrojen (g)</text>
      </g>
      <line x1={gx(0)} y1={gy(0)} x2={gx(5)} y2={gy(40)} stroke="var(--kimya)" strokeWidth={3} strokeLinecap="round" />
      <text x={gx(3.6)} y={gy(28.8) + 22} fontSize={11.5} fontWeight={700} fill="var(--kimya)">eğim = 8</text>
      <g>
        <line x1={px} x2={px} y1={py} y2={y1} stroke="var(--muted)" strokeDasharray="4 3" />
        <line x1={x0} x2={px} y1={py} y2={py} stroke="var(--muted)" strokeDasharray="4 3" />
        <circle cx={px} cy={py} r={7} fill="#fff" stroke="var(--kimya)" strokeWidth={3} />
      </g>
    </svg>
  );
}

/* ---------- katlı oranlar: CO ve CO₂ ---------- */

function Katli({ v }: SahneProps) {
  const goster = (v.b ?? 0) === 1;
  const PX = 5, X = 112;
  const satir = (y: number, m: string, ad: string, o: number, acik: boolean) => (
    <g opacity={acik ? 1 : 0.35}>
      {acik ? <Molekul m={m} x={50} y={y + 9} /> : <text x={50} y={y + 14} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--muted)">?</text>}
      <text x={X} y={y - 8} fontSize={12.5} fontWeight={800} fill="var(--ink)">{ad}</text>
      <rect x={X} y={y} width={12 * PX} height={18} rx={4} fill="#3b4656" />
      <text x={X + 6 * PX} y={y + 13} fontSize={11} fontWeight={700} textAnchor="middle" fill="#fff">C 12 g</text>
      {acik ? (
        <g>
          <rect x={X + 12 * PX + 2} y={y} width={o * PX} height={18} rx={4} fill="var(--c2)" />
          <text x={X + 12 * PX + 2 + (o * PX) / 2} y={y + 13} fontSize={11} fontWeight={700} textAnchor="middle" fill="#fff">O {o} g</text>
        </g>
      ) : (
        <rect x={X + 12 * PX + 2} y={y} width={o * PX} height={18} rx={4} fill="none" stroke="var(--line-2)" strokeDasharray="4 3" />
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={goster ? "12 g karbon CO'da 16 g, CO₂'de 32 g oksijenle birleşir" : "12 g karbon CO'da 16 g oksijenle birleşir"}>
      {satir(48, "CO", "Karbon monoksit (CO)", 16, true)}
      {satir(124, "CO2", "Karbon dioksit (CO₂)", 32, goster)}
      <text x={170} y={200} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={goster ? "var(--kimya)" : "var(--muted)"}>
        {goster ? "Karbon sabit (12 g): oksijen 16 g ve 32 g" : "Karbon her ikisinde de 12 g"}
      </text>
    </svg>
  );
}

/* ---------- birleşen hacimler ---------- */

type Yer = { m: string; x: number; y: number };
// Her litre 30 px genişliğinde bir sütun; sütunda iki molekül (litre başına eşit sayıda tanecik).
const LW = 30;
const yerlestir = (x0: number, liste: string[]): Yer[] => liste.map((m, j) => ({ m, x: x0 + LW / 2 + LW * Math.floor(j / 2), y: j % 2 ? 114 : 80 }));

function Hacim({ s, v, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const h = v.h ?? 1;
  const w = Math.min(h, 2), artH = Math.max(0, h - 2), artO = Math.max(0, (2 - h) / 2);
  const Lp = w + artH + artO;
  const once = kes(1 - u * 2), sonra = kes(u * 2 - 1);
  // Kutular yan yana: H₂ kutusu hacmine göre genişler, diğerleri onu izler.
  const oX = 8 + LW * h + 26, okX = oX + LW + 16, pX = okX + 14;
  const hMol = yerlestir(8, Array(2 * h).fill("H2"));
  const oMol = yerlestir(oX, ["O2", "O2"]);
  const urun = yerlestir(pX, [...Array(Math.round(2 * w)).fill("H2O"), ...Array(Math.round(2 * artH)).fill("H2"), ...Array(Math.round(2 * artO)).fill("O2")]);
  const kutu = (x: number, L: number, renk: string, kesik = false) => (
    <rect x={x} y={60} width={Math.max(8, LW * L)} height={74} rx={6} fill={kesik ? "none" : "#f6f8fb"} stroke={renk} strokeWidth={1.6} strokeDasharray={kesik ? "5 4" : undefined} />
  );
  const L = (x: number) => virgul(x);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${h} L hidrojen ve 1 L oksijen`}>
      <text x={170} y={24} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={u >= 1 ? "var(--kimya)" : "var(--ink)"}>
        {u >= 1 ? `Önce ${h + 1} L gaz, sonra ${L(Lp)} L gaz` : `Önce ${h + 1} L gaz (aynı sıcaklık ve basınç)`}
      </text>
      <g>
        {kutu(8, h, "#9aa8ba")}
        {hMol.map((p, i) => <Molekul key={i} m={p.m} x={p.x} y={p.y} k={0.62} op={once} />)}
        <text x={8} y={152} fontSize={11.5} fontWeight={700} fill="var(--muted)">{h} L H₂</text>
      </g>
      <text x={oX - 13} y={102} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--muted)">+</text>
      <g>
        {kutu(oX, 1, "var(--c2)")}
        {oMol.map((p, i) => <Molekul key={i} m={p.m} x={p.x} y={p.y} k={0.62} op={once} />)}
        <text x={oX} y={152} fontSize={11.5} fontWeight={700} fill="var(--muted)">1 L O₂</text>
      </g>
      <text x={okX - 6} y={103} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--muted)">→</text>
      <g>
        {u > 0 ? kutu(pX, Lp, "var(--c1)") : kutu(pX, 2, "var(--line-2)", true)}
        {u === 0 && <text x={pX + LW} y={102} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--muted)">?</text>}
        {urun.map((p, i) => <Molekul key={i} m={p.m} x={p.x} y={p.y} k={0.62} op={sonra} />)}
      </g>
      {u >= 1 && (
        <g fontSize={11.5} fontWeight={700}>
          <text x={pX} y={152} fill="var(--c1)">{L(w)} L H₂O (buhar)</text>
          {artH > 0 && <text x={pX} y={168} fill="var(--kimya)">+ {L(artH)} L H₂ arttı</text>}
          {artO > 0 && <text x={pX} y={168} fill="var(--kimya)">+ {L(artO)} L O₂ arttı</text>}
        </g>
      )}
      <text x={170} y={202} fontSize={11.5} textAnchor="middle" fill="var(--muted)">Her litrede eşit sayıda molekül var (Avogadro).</text>
    </svg>
  );
}

/* ---------- atomlar yeniden düzenlenir: 2H₂ + O₂ → 2H₂O ---------- */

const BAG: { e: string; a: [number, number]; b: [number, number] }[] = [
  { e: "H", a: [50, 78], b: [246, 90] },
  { e: "H", a: [70, 78], b: [278, 90] },
  { e: "H", a: [50, 150], b: [246, 162] },
  { e: "H", a: [70, 150], b: [278, 162] },
  { e: "O", a: [138, 114], b: [262, 79] },
  { e: "O", a: [162, 114], b: [262, 151] },
];

function Bag({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const k = yumusak(kes((u - 0.12) / 0.76));
  // Bağlar koparken atomlar biraz açılır, sonra yeni yerlerine gider.
  const acil = Math.sin(Math.PI * k) * 14;
  const sira = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="İki hidrojen molekülü ve bir oksijen molekülü iki su molekülüne dönüşüyor">
      <g fontSize={15} fontWeight={800} fill="var(--ink)">
        <text x={106} y={30} textAnchor="middle">2H₂ + O₂</text>
        <text x={190} y={30} textAnchor="middle" fill="var(--muted)">→</text>
        <text x={262} y={30} textAnchor="middle">2H₂O</text>
      </g>
      <g>
        {sira.map((i) => {
          const p = BAG[i];
          const dx = i < 4 ? (i % 2 ? acil : -acil) : 0;
          return <Atom key={i} e={p.e} k={1.35} x={ara(p.a[0], p.b[0], k) + dx} y={ara(p.a[1], p.b[1], k) + (i === 4 ? -acil : i === 5 ? acil : 0)} />;
        })}
      </g>
      <text x={170} y={206} fontSize={12} fontWeight={700} textAnchor="middle" fill={k > 0 && k < 1 ? "var(--kimya)" : "var(--muted)"}>
        {k > 0 && k < 1 ? "Bağlar kopuyor, yeni bağlar kuruluyor" : u >= 1 ? "Önce: 4 H, 2 O · Sonra: 4 H, 2 O" : "4 H atomu, 2 O atomu"}
      </text>
    </svg>
  );
}

/* ---------- denklem denkleştirme ---------- */

type Terim = { f: string; m: string; at: Record<string, number> };
const DENKLEM: Record<string, { sol: Terim[]; sag: Terim[]; el: string[] }> = {
  su: {
    sol: [{ f: "H₂", m: "H2", at: { H: 2 } }, { f: "O₂", m: "O2", at: { O: 2 } }],
    sag: [{ f: "H₂O", m: "H2O", at: { H: 2, O: 1 } }],
    el: ["H", "O"],
  },
  metan: {
    sol: [{ f: "CH₄", m: "CH4", at: { C: 1, H: 4 } }, { f: "O₂", m: "O2", at: { O: 2 } }],
    sag: [{ f: "CO₂", m: "CO2", at: { C: 1, O: 2 } }, { f: "H₂O", m: "H2O", at: { H: 2, O: 1 } }],
    el: ["C", "H", "O"],
  },
};
const ebob = (a: number, b: number): number => (b ? ebob(b, a % b) : a);

function Denklestir({ s, v }: SahneProps) {
  const D = DENKLEM[String(s.denklem ?? "su")];
  const terimler = [...D.sol, ...D.sag];
  const kat = terimler.map((_, i) => v[`k${i}`] ?? 1);
  const say = (liste: Terim[], bas: number, e: string) => liste.reduce((t, x, i) => t + (x.at[e] ?? 0) * kat[bas + i], 0);
  const sayim = D.el.map((e) => ({ e, sol: say(D.sol, 0, e), sag: say(D.sag, D.sol.length, e) }));
  const denk = sayim.every((x) => x.sol === x.sag);
  const sade = kat.reduce(ebob) === 1;
  // Sütunlar: terimler ve aradaki ok.
  const sutun = [...D.sol.map((_, i) => i), -1, ...D.sag.map((_, i) => D.sol.length + i)];
  const xs = sutun.map((_, i) => 40 + (i * 260) / (sutun.length - 1));
  const kutuW = 96, kutuX = (i: number) => 170 + (i - (sayim.length - 1) / 2) * (kutuW + 8) - kutuW / 2;
  return (
    <svg viewBox="0 0 340 252" role="img" aria-label={`${terimler.map((x, i) => `${kat[i]} ${x.f}`).join(", ")}: ${denk ? "denk" : "denk değil"}`}>
      <text x={170} y={30} fontSize={19} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        {terimler.map((x, i) => (
          <tspan key={i}>
            {i === D.sol.length ? " → " : i > 0 ? " + " : ""}
            {kat[i] > 1 && <tspan fill="var(--kimya)">{kat[i]}</tspan>}
            {x.f}
          </tspan>
        ))}
      </text>
      <g>
        {sutun.map((ti, i) =>
          ti < 0 ? (
            <text key={i} x={xs[i]} y={116} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--muted)">→</text>
          ) : (
            <g key={i}>
              {Array.from({ length: kat[ti] }, (_, j) => <Molekul key={j} m={terimler[ti].m} x={xs[i]} y={66 + j * 28} k={0.75} />)}
            </g>
          ),
        )}
      </g>
      <g>
        {sayim.map((x, i) => {
          const ok = x.sol === x.sag;
          return (
            <g key={x.e}>
              <rect x={kutuX(i)} y={180} width={kutuW} height={30} rx={8} fill={ok ? "#eaf7ef" : "#fdeeed"} />
              <circle cx={kutuX(i) + 16} cy={195} r={6.5} fill={ATOM[x.e].f} stroke={ATOM[x.e].s} strokeWidth={1.2} />
              <text x={kutuX(i) + 58} y={200} fontSize={13} fontWeight={800} textAnchor="middle" fill={ok ? "var(--good)" : "var(--bad)"}>
                {x.e}: {x.sol} {ok ? "=" : "≠"} {x.sag}
              </text>
            </g>
          );
        })}
      </g>
      <text x={170} y={238} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={denk && sade ? "var(--good)" : denk ? "var(--c4)" : "var(--muted)"}>
        {denk ? (sade ? "Denk: her atomdan iki yanda eşit sayıda" : "Denk ama sadeleşir: en küçük tam sayıları kullan") : "Denk değil: sol ve sağ eşit olmalı"}
      </text>
    </svg>
  );
}

/* ---------- tam ve eksik yanma ---------- */

function Yanma({ s, v, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const bol = (v.hava ?? Number(s.hava ?? 1)) === 1;
  const yaniyor = u > 0;
  const urunler = bol ? ["CO2", "H2O", "H2O", "CO2", "H2O", "H2O"] : ["CO", "H2O", "C", "H2O", "CO", "C", "H2O", "CO2"];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Metan ${bol ? "bol" : "az"} havada yanıyor`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">{bol ? "Hava bol" : "Hava az (kapalı oda)"}</text>
      <g>
        <rect x={140} y={186} width={60} height={14} rx={4} fill="#9aa8ba" />
        <rect x={164} y={176} width={12} height={12} rx={2} fill="#7d8da3" />
      </g>
      {yaniyor && (
        <g>
          <path d={`M170 ${bol ? 116 : 104} C186 140 184 170 170 176 C156 170 154 140 170 ${bol ? 116 : 104} Z`} fill={bol ? "#cfe0ff" : "#ffd79a"} />
          <path d="M170 140 C178 152 177 168 170 172 C163 168 162 152 170 140 Z" fill={bol ? "var(--c1)" : "var(--c4)"} />
        </g>
      )}
      {yaniyor && urunler.map((m, i) => {
        const p = (u * 2.2 + i / urunler.length) % 1;
        const x = 170 + Math.sin(i * 2.1 + p * 4) * (18 + p * 40), y = 104 - p * 70;
        if (m === "C")
          return (
            <g key={i} opacity={1 - p * 0.4}>
              {[0, 1, 2].map((j) => <circle key={j} cx={x + (j - 1) * 6} cy={y + (j % 2) * 5} r={4} fill="#2b3340" />)}
            </g>
          );
        return <Molekul key={i} m={m} x={x} y={y} k={0.7} op={1 - p * 0.4} />;
      })}
      {u >= 1 && (
        <g fontSize={12} fontWeight={700}>
          <text x={326} y={60} textAnchor="end" fill="var(--ink)">Ürünler:</text>
          {(bol ? ["CO₂", "H₂O"] : ["CO (zehirli)", "is (C)", "H₂O", "biraz CO₂"]).map((x, i) => (
            <text key={x} x={326} y={78 + i * 17} textAnchor="end" fill={!bol && i < 2 ? "var(--kimya)" : "var(--muted)"}>{x}</text>
          ))}
        </g>
      )}
      {!yaniyor && <text x={170} y={150} fontSize={12} textAnchor="middle" fill="var(--muted)">metan (CH₄) ocağı</text>}
    </svg>
  );
}

/* ---------- çökelme: AgNO₃(suda) + NaCl(suda) ---------- */

type Iyon = { ad: string; renk: string; a: [number, number]; b: [number, number]; esi?: number };
const IYON: Iyon[] = [
  { ad: "Ag⁺", renk: "#7d8da3", a: [58, 82], b: [62, 172], esi: 6 },
  { ad: "Ag⁺", renk: "#7d8da3", a: [58, 122], b: [132, 172], esi: 7 },
  { ad: "Ag⁺", renk: "#7d8da3", a: [58, 162], b: [202, 172], esi: 8 },
  { ad: "NO₃⁻", renk: "var(--c5)", a: [108, 82], b: [50, 76] },
  { ad: "NO₃⁻", renk: "var(--c5)", a: [108, 122], b: [170, 76] },
  { ad: "NO₃⁻", renk: "var(--c5)", a: [108, 162], b: [140, 116] },
  { ad: "Cl⁻", renk: "var(--c3)", a: [234, 82], b: [62, 172] },
  { ad: "Cl⁻", renk: "var(--c3)", a: [234, 122], b: [132, 172] },
  { ad: "Cl⁻", renk: "var(--c3)", a: [234, 162], b: [202, 172] },
  { ad: "Na⁺", renk: "var(--c4)", a: [184, 82], b: [110, 76] },
  { ad: "Na⁺", renk: "var(--c4)", a: [184, 122], b: [230, 76] },
  { ad: "Na⁺", renk: "var(--c4)", a: [184, 162], b: [230, 116] },
];

function Hap({ x, y, ad, renk, w = 38 }: { x: number; y: number; ad: string; renk: string; w?: number }) {
  return (
    <g>
      <rect x={x} y={y - 10} width={w} height={20} rx={10} fill={renk} />
      <text x={x + w / 2} y={y + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill="#fff">{ad}</text>
    </g>
  );
}

function Cokelme({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const bolme = kes(u / 0.15);
  const kar = yumusak(kes((u - 0.15) / 0.55));
  const cok = kes((u - 0.75) / 0.15);
  return (
    <svg viewBox="0 0 340 246" role="img" aria-label="Gümüş nitrat ve sodyum klorür çözeltileri karışıyor">
      <g fontSize={12} fontWeight={800} textAnchor="middle">
        <text x={104} y={34} fill={u > 0 ? "var(--muted)" : "var(--ink)"}>AgNO₃(suda)</text>
        <text x={236} y={34} fill={u > 0 ? "var(--muted)" : "var(--ink)"}>NaCl(suda)</text>
      </g>
      <rect x={42} y={54} width={256} height={142} fill={SU} />
      {cok > 0 && <rect x={42} y={54} width={256} height={142} fill="#fff" opacity={0.35 * cok} />}
      <path d="M40 44 L40 198 L300 198 L300 44" fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round" />
      {bolme < 1 && <rect x={168} y={50 - 120 * bolme} width={4} height={148} fill="var(--ink)" opacity={1 - bolme} />}
      <g>
        {IYON.map((i, k) => {
          const ag = i.esi !== undefined || i.ad === "Cl⁻";
          if (ag && cok >= 1) return null;
          const x = ara(i.a[0], i.b[0], kar) + (ag ? (i.ad === "Cl⁻" ? 8 : -8) * kar : 0), y = ara(i.a[1], i.b[1], kar);
          return <Hap key={k} x={x} y={y} ad={i.ad} renk={i.renk} />;
        })}
        {cok > 0 && [62, 132, 202].map((x) => (
          <g key={x} opacity={cok}>
            <rect x={x - 6} y={162} width={58} height={20} rx={10} fill="#fff" stroke="#9aa8ba" strokeWidth={1.4} />
            <text x={x + 23} y={176} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--ink)">AgCl(k)</text>
          </g>
        ))}
      </g>
      {u >= 1 && (
        <g fontSize={12} fontWeight={700} textAnchor="middle">
          <text x={170} y={222} fill="var(--kimya)">Ag⁺ + Cl⁻ → AgCl(k): beyaz çökelek</text>
          <text x={170} y={240} fill="var(--muted)">Na⁺ ve NO₃⁻ değişmedi (seyirci iyon)</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- analiz: kireç taşı ısıtılıyor ---------- */

function Analiz() {
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="Kireç taşı ısıtılınca sönmemiş kireç ve karbon dioksit oluşur">
      <text x={170} y={28} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--ink)">CaCO₃(k) → CaO(k) + CO₂(g)</text>
      <g>
        <path d="M42 112 Q44 88 70 84 Q100 80 108 100 Q114 116 92 122 Q58 128 42 112 Z" fill="#f1f3f6" stroke="#9aa8ba" strokeWidth={1.6} />
        <text x={76} y={176} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">kireç taşı</text>
      </g>
      <g>
        <path d="M62 156 C70 144 68 138 76 130 C84 138 82 144 90 156 Z" fill="#ffd79a" />
        <path d="M70 156 C74 150 74 146 76 142 C78 146 78 150 82 156 Z" fill="var(--c4)" />
      </g>
      <text x={150} y={110} fontSize={20} fontWeight={800} textAnchor="middle" fill="var(--muted)">→</text>
      <text x={150} y={132} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--c4)">ısı</text>
      <g>
        <path d="M194 116 Q196 96 216 94 Q238 92 244 108 Q248 122 230 126 Q204 130 194 116 Z" fill="#fff" stroke="#b8c2cf" strokeWidth={1.6} />
        <text x={220} y={150} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">sönmemiş kireç</text>
      </g>
      <g>
        <Molekul m="CO2" x={294} y={86} k={0.85} />
        <text x={294} y={116} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">CO₂ gazı</text>
      </g>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--kimya)">1 madde → 2 madde</text>
    </svg>
  );
}

export const KIMYA5: Record<string, SahneKaydi> = {
  "kim5-mg": { C: Magnezyum },
  "kim5-oran": { C: Oran },
  "kim5-grafik": { C: Grafik },
  "kim5-katli": { C: Katli },
  "kim5-hacim": {
    C: Hacim,
    geri: (v) =>
      (v.h ?? 1) < 2
        ? { baslik: "Oksijen arttı", metin: `${v.h} L hidrojen 1 L oksijenin yalnızca bir kısmını harcadı. Hidrojeni artırıp yeniden oynat.` }
        : { baslik: "Hidrojen arttı", metin: "1 L oksijen bu kadar hidrojenin hepsiyle birleşemez. Hidrojeni azaltıp yeniden oynat." },
  },
  "kim5-bag": { C: Bag },
  "kim5-denklestir": { C: Denklestir },
  "kim5-yanma": { C: Yanma },
  "kim5-cokelme": { C: Cokelme },
  "kim5-analiz": { C: Analiz },
};
