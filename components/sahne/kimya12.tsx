"use client";
// Kimya sahneleri (fonksiyonel gruplar, enerji kaynakları): grubun karakteri, alkollerin çözünürlüğü,
// etanol ve dimetil eter, dikromatla yükseltgenme, Tollens ve Fehling, esterleşme, sabunlaşma;
// ham petrolün damıtılması, yakıtların CO₂ salımı, sera etkisi, asit yağmuru, santrallerde enerji dönüşümü,
// atom ekonomisi ve nano boyutta yüzey.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const DIKROMAT = "#e8862a", KROM3 = "#3f9b6a", FEHLING = "#3b7fd9", CU2O = "#b8452c";

/** Sahne içindeki tıklanabilir sekme sırası. */
function Sekmeler({ adlar, secili, sec, y = 8, x0 = 10, gen = 320 }: { adlar: string[]; secili: number; sec: (i: number) => void; y?: number; x0?: number; gen?: number }) {
  const W = gen / adlar.length;
  return (
    <g>
      {adlar.map((ad, i) => (
        <g key={ad} onClick={() => sec(i)} style={{ cursor: "pointer" }}>
          <rect x={x0 + i * W + 2} y={y} width={W - 4} height={26} rx={13} fill={i === secili ? "var(--kimya)" : "var(--panel)"} />
          <text x={x0 + i * W + W / 2} y={y + 17} fontSize={11} fontWeight={800} textAnchor="middle" fill={i === secili ? "#fff" : "var(--ink)"}>{ad}</text>
        </g>
      ))}
    </g>
  );
}

/** Deney tüpü: içindeki sıvı rengi, üstte ad, altta not. */
function Tup({ x, renk, op = 0.7, ust = 70, alt = 160 }: { x: number; renk: string; op?: number; ust?: number; alt?: number }) {
  return (
    <g>
      <path d={`M${x - 16} ${ust} L${x - 16} ${alt} A16 16 0 0 0 ${x + 16} ${alt} L${x + 16} ${ust} Z`} fill={renk} opacity={op} />
      <path d={`M${x - 18} ${ust - 30} L${x - 18} ${alt} A18 18 0 0 0 ${x + 18} ${alt} L${x + 18} ${ust - 30}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
    </g>
  );
}

/* ---------- grubun karakteri: etana bir grup ekle ---------- */

const GRUP = [
  { g: "−H", ad: "etan", f: "C₂H₆", kn: "−89 °C", hal: "gaz", su: "suda çözünmez" },
  { g: "−CH₃", ad: "propan", f: "C₃H₈", kn: "−42 °C", hal: "gaz", su: "suda çözünmez" },
  { g: "−Br", ad: "bromoetan", f: "C₂H₅Br", kn: "38 °C", hal: "sıvı", su: "suyla karışmaz, dibe çöker" },
  { g: "−OH", ad: "etanol", f: "C₂H₅OH", kn: "78 °C", hal: "sıvı", su: "suyla her oranda karışır" },
];

function Grup({ v, set }: SahneProps) {
  const g = sinir(v.g ?? 0, 0, 3), d = GRUP[g], gaz = d.hal === "gaz";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`CH₃–CH₂${d.g}: ${d.ad}, ${d.hal}, kaynama noktası ${d.kn}, ${d.su}`}>
      <Sekmeler adlar={GRUP.map((x) => x.g)} secili={g} sec={(i) => set("g", i)} />
      <text x={24} y={84} fontSize={22} fontWeight={800} fill="var(--ink)">
        CH₃–CH₂<tspan fill="var(--kimya)">{d.g}</tspan>
      </text>
      <text x={24} y={112} fontSize={14} fontWeight={800} fill="var(--kimya)">{d.ad} · {d.f}</text>
      <text x={24} y={134} fontSize={12} fontWeight={700} fill="var(--muted)">25 °C'de {d.hal} · KN {d.kn}</text>
      {/* su dolu beher ve içine konan madde */}
      <g>
        <rect x={238} y={88} width={76} height={86} fill="var(--c1)" opacity={g === 3 ? 0.22 : 0.14} />
        {g === 2 && <rect x={238} y={156} width={76} height={18} fill="var(--c4)" opacity={0.75} />}
        {gaz && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={250 + i * 13} cy={150 - (i % 3) * 22} r={4} fill="none" stroke="var(--muted)" strokeWidth={1.4} />)}
        {gaz && <text x={276} y={70} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--muted)">kaçıp gider</text>}
        {g === 3 && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={248 + (i % 4) * 18} cy={108 + Math.floor(i / 4) * 34 + (i % 2) * 10} r={2.6} fill="var(--kimya)" />)}
        <path d="M236 64 L236 176 L316 176 L316 64" fill="none" stroke="var(--ink)" strokeWidth={2} />
      </g>
      <text x={170} y={206} fontSize={13} fontWeight={800} textAnchor="middle" fill={g === 3 ? "var(--good)" : "var(--ink)"}>{d.su}</text>
      <text x={170} y={226} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {g === 3 ? "−OH suyla hidrojen bağı kurar" : "İskelet hemen hemen aynı; fark gruptan geliyor"}
      </text>
    </svg>
  );
}

/* ---------- alkollerde zincir boyu ve çözünürlük ---------- */

const ALKOL = ["metanol", "etanol", "1-propanol", "1-bütanol", "1-pentanol", "1-hekzanol", "1-heptanol", "1-oktanol"];
/** g / 100 g su, 25 °C civarı; ilk üçü her oranda karışır. */
const COZ = [Infinity, Infinity, Infinity, 7.4, 2.2, 0.6, 0.2, 0.05];

function Cozunur({ v }: SahneProps) {
  const n = sinir(v.n ?? 1, 1, 8), c = COZ[n - 1], sinirsiz = c === Infinity;
  const pt = Array.from({ length: n }, (_, i) => [40 + i * 30, i % 2 ? 62 : 84] as [number, number]);
  const son = pt[n - 1], oh: [number, number] = [son[0] + 30, n % 2 ? 62 : 84];
  // Çubuk: log ölçek, 0,05 → 10 g ve üstü tam.
  const dolu = sinirsiz ? 1 : sinir((Math.log10(c) + 1.4) / 2.4, 0.04, 1);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${ALKOL[n - 1]}: ${sinirsiz ? "suyla her oranda karışır" : `100 g suda yaklaşık ${c} g çözünür`}`}>
      <rect x={30} y={44} width={Math.max(10, son[0] - 30)} height={56} rx={16} fill="var(--panel)" />
      <rect x={oh[0] - 18} y={44} width={48} height={56} rx={16} fill="var(--kimya-soft)" />
      {n > 1 && <polyline points={pt.map((q) => q.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />}
      <line x1={son[0]} y1={son[1]} x2={son[0] + 17} y2={son[1] + (72 - son[1]) * 0.6} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
      {pt.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={4.5} fill="var(--ink)" />)}
      <text x={oh[0] + 6} y={77} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--kimya)">OH</text>
      <text x={30} y={30} fontSize={11} fontWeight={800} fill="var(--muted)">apolar kısım</text>
      <text x={oh[0]} y={30} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--kimya)">polar</text>
      <text x={170} y={134} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ALKOL[n - 1]} · {n} C</text>
      <rect x={40} y={148} width={260} height={14} rx={7} fill="var(--panel)" />
      <rect x={40} y={148} width={260 * dolu} height={14} rx={7} fill={sinirsiz ? "var(--c1)" : "var(--c4)"} />
      <text x={170} y={186} fontSize={13} fontWeight={800} textAnchor="middle" fill={sinirsiz ? "var(--c1)" : "var(--ink)"}>
        {sinirsiz ? "Suyla her oranda karışır" : `100 g suda ≈ ${c.toLocaleString("tr-TR")} g çözünür`}
      </text>
      <text x={170} y={208} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Zincir uzadıkça apolar kısım büyür</text>
    </svg>
  );
}

/* ---------- etanol ve dimetil eter ---------- */

function Etanol({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <text x={x} y={y} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        C₂H₅–<tspan fill="var(--kimya)">O</tspan>–<tspan fill="var(--c1)">H</tspan>
      </text>
    </g>
  );
}

function Hbag({ v }: SahneProps) {
  const eter = (v.e ?? 0) === 1;
  // Üç molekül; etanolde bir molekülün H'si diğerinin O'suna kesik çizgiyle bağlanır.
  const yer: [number, number][] = [[90, 64], [230, 100], [110, 144]];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={eter ? "Dimetil eter: O−H yok, moleküller arasında hidrojen bağı yok, kaynama noktası −24 °C" : "Etanol: −OH grupları arasında hidrojen bağı, kaynama noktası 78 °C"}>
      <text x={170} y={22} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        {eter ? "dimetil eter" : "etanol"} · C₂H₆O
      </text>
      {!eter && (
        <g stroke="var(--c1)" strokeWidth={2} strokeDasharray="3 4">
          <line x1={130} y1={66} x2={234} y2={88} />
          <line x1={256} y1={106} x2={121} y2={131} />
        </g>
      )}
      {yer.map(([x, y], i) =>
        eter ? (
          <text key={i} x={x} y={y} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">
            CH₃–<tspan fill="var(--kimya)">O</tspan>–CH₃
          </text>
        ) : (
          <Etanol key={i} x={x} y={y} />
        ),
      )}
      {!eter && <text x={236} y={144} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--c1)">H bağı</text>}
      <text x={170} y={186} fontSize={14} fontWeight={800} textAnchor="middle" fill={eter ? "var(--c2)" : "var(--c1)"}>
        Kaynama noktası: {eter ? "−24 °C (gaz)" : "78 °C (sıvı)"}
      </text>
      <text x={170} y={208} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {eter ? "O'da H yok: moleküller arasında H bağı kurulamaz" : "Bir molekülün O−H'si komşunun O'suna çekilir"}
      </text>
    </svg>
  );
}

/* ---------- alkollerin dikromatla yükseltgenmesi ---------- */

const ALK = [
  { ad: "etanol", sinif: "1°", h: 2, urun: "→ asetik asit" },
  { ad: "2-propanol", sinif: "2°", h: 1, urun: "→ aseton" },
  { ad: "2-metil-2-propanol", sinif: "3°", h: 0, urun: "tepkime yok" },
];

function Dikromat({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4)), k = yumusak((u - 0.2) / 0.7), bitti = u >= 1;
  return (
    <svg viewBox="0 0 340 246" role="img" aria-label={bitti ? "1° ve 2° alkol dikromatı yeşile çevirdi; 3° alkolde renk turuncu kaldı" : "Üç tüpte turuncu dikromat çözeltisi"}>
      {ALK.map((d, i) => {
        const x = 58 + i * 112, tepki = d.h > 0;
        const renk = tepki && k > 0.5 ? KROM3 : DIKROMAT, op = tepki && u > 0 ? 0.75 - 0.25 * Math.abs(1 - 2 * k) : 0.75;
        return (
          <g key={d.ad}>
            <Tup x={x} renk={renk} op={op} ust={84} alt={150} />
            {u > 0 && u < 0.25 && <circle cx={x} cy={46 + u * 160} r={3.5} fill="var(--muted)" />}
            <text x={x} y={194} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
            <text x={x} y={211} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{d.sinif} alkol · C'de {d.h} H</text>
            {bitti && <text x={x} y={232} fontSize={11} fontWeight={800} textAnchor="middle" fill={tepki ? "var(--good)" : "var(--c2)"}>{d.urun}</text>}
          </g>
        );
      })}
      <text x={170} y={22} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--muted)">
        {bitti ? "Turuncu Cr₂O₇²⁻ indirgenince yeşil Cr³⁺ olur" : "Her tüpte asitli K₂Cr₂O₇ (turuncu)"}
      </text>
    </svg>
  );
}

/* ---------- Tollens ve Fehling ---------- */

const ALDEHIT = [
  { ad: "propanal", f: "C₂H₅CHO", t: true, fe: true },
  { ad: "propanon", f: "CH₃COCH₃", t: false, fe: false },
  { ad: "benzaldehit", f: "C₆H₅CHO", t: true, fe: false },
];

function Ayirac({ v, set, s, t, oynuyor, kosular }: SahneProps) {
  const r = (v.r ?? 0) === 1 ? 1 : 0, u = oran(t, oynuyor, Number(s.sure ?? 3)), k = yumusak((u - 0.15) / 0.8);
  const goruldu = [0, 1].map((x) => kosular.some((q) => (q.r ?? 0) === x));
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={`${r ? "Fehling" : "Tollens"} ayıracı; propanal, propanon ve benzaldehit`}>
      <Sekmeler adlar={["Tollens", "Fehling"]} secili={r} sec={(i) => set("r", i)} x0={104} gen={200} />
      {ALDEHIT.map((d, i) => {
        const x = 116 + i * 88, olumlu = r ? d.fe : d.t;
        const sivi = r ? FEHLING : "#d9dee6", op = r && olumlu ? 0.65 * (1 - 0.7 * k) : r ? 0.65 : 0.5;
        return (
          <g key={d.ad}>
            <Tup x={x} renk={sivi} op={op} ust={84} alt={146} />
            {!r && olumlu && k > 0 && (
              <path d={`M${x - 16} 84 L${x - 16} 146 A16 16 0 0 0 ${x + 16} 146 L${x + 16} 84`} fill="none" stroke="#8c96a3" strokeWidth={5} opacity={k} />
            )}
            {r === 1 && olumlu && k > 0 && <ellipse cx={x} cy={157} rx={13} ry={5 * k + 1} fill={CU2O} opacity={k} />}
            <text x={x} y={190} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
            <text x={x} y={206} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{d.f}</text>
            {u >= 1 && <text x={x} y={47} fontSize={10.5} fontWeight={800} textAnchor="middle" fill={olumlu ? "var(--good)" : "var(--c2)"}>{olumlu ? (r ? "kırmızı çökelek" : "gümüş aynası") : "değişim yok"}</text>}
          </g>
        );
      })}
      <g fontSize={11} fontWeight={800}>
        {["Tollens", "Fehling"].map((ad, j) => (
          <g key={ad}>
            <text x={8} y={229 + j * 18} fill="var(--muted)">{ad}</text>
            {ALDEHIT.map((d, i) => {
              const olumlu = j ? d.fe : d.t;
              return (
                <text key={i} x={116 + i * 88} y={229 + j * 18} textAnchor="middle" fill={!goruldu[j] ? "var(--line-2)" : olumlu ? "var(--good)" : "var(--c2)"}>
                  {!goruldu[j] ? "?" : olumlu ? "✓ verir" : "✗ vermez"}
                </text>
              );
            })}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- esterleşme ---------- */

const ASIT = [
  { ad: "formik asit", f: "HCO", ek: "formiyat" },
  { ad: "asetik asit", f: "CH₃CO", ek: "asetat" },
  { ad: "bütanoik asit", f: "C₃H₇CO", ek: "bütanoat" },
];
const ALKOL2 = [
  { ad: "metanol", r: "CH₃", ek: "metil" },
  { ad: "etanol", r: "C₂H₅", ek: "etil" },
  { ad: "izoamil alkol", r: "C₅H₁₁", ek: "izoamil" },
];
const KOKU: Record<string, string> = { "1-2": "muz kokusu", "2-1": "ananas kokusu" };

function Ester({ v }: SahneProps) {
  const a = sinir(v.a ?? 0, 0, 2), b = sinir(v.b ?? 0, 0, 2), A = ASIT[a], B = ALKOL2[b];
  const koku = KOKU[`${a}-${b}`];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${A.ad} + ${B.ad} → ${B.ek} ${A.ek} + su`}>
      <g fontSize={14} fontWeight={800}>
        <text x={80} y={46} textAnchor="middle" fill="var(--ink)">{A.f}<tspan fill="var(--c2)">OH</tspan></text>
        <text x={162} y={46} textAnchor="middle" fill="var(--muted)">+</text>
        <text x={248} y={46} textAnchor="middle" fill="var(--ink)"><tspan fill="var(--c2)">H</tspan>O{B.r}</text>
        <text x={80} y={66} fontSize={11} textAnchor="middle" fill="var(--muted)">{A.ad}</text>
        <text x={248} y={66} fontSize={11} textAnchor="middle" fill="var(--muted)">{B.ad}</text>
      </g>
      <text x={170} y={98} fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--muted)">⇌</text>
      <text x={118} y={92} fontSize={10.5} fontWeight={700} textAnchor="end" fill="var(--muted)">derişik H₂SO₄, ısı</text>
      <g fontSize={15} fontWeight={800}>
        <text x={120} y={134} textAnchor="middle" fill="var(--kimya)">{A.f}O{B.r}</text>
        <text x={210} y={134} textAnchor="middle" fill="var(--muted)">+</text>
        <text x={258} y={134} textAnchor="middle" fill="var(--c2)">H₂O</text>
      </g>
      <text x={170} y={172} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{B.ek} {A.ek}</text>
      <text x={170} y={194} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Ad: önce alkol kısmı, sonra asit kısmı</text>
      {koku && <text x={170} y={216} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--good)">{koku}</text>}
    </svg>
  );
}

/* ---------- sabunlaşma ---------- */

function Sabun({ v }: SahneProps) {
  const n = sinir(v.n ?? 0, 0, 5), kopan = Math.min(3, n), fazla = n - kopan;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`1 mol yağa ${n} mol NaOH: ${kopan} ester bağı koptu${fazla ? `, ${fazla} mol NaOH arttı` : ""}`}>
      {[0, 1, 2].map((i) => {
        const y = 40 + i * 48, kop = i < kopan, dx = kop ? 30 : 0;
        return (
          <g key={i}>
            <rect x={22} y={y - 14} width={46} height={28} rx={8} fill="var(--panel)" />
            <text x={45} y={y + 5} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{i === 1 ? "CH" : "CH₂"}</text>
            {kop ? (
              <text x={74} y={y + 5} fontSize={12.5} fontWeight={800} fill="var(--c1)">–OH</text>
            ) : (
              <text x={74} y={y + 5} fontSize={12.5} fontWeight={800} fill="var(--kimya)">–O–CO</text>
            )}
            <g transform={`translate(${dx} 0)`}>
              {kop && <text x={128} y={y + 5} fontSize={12.5} fontWeight={800} fill="var(--c1)">Na⁺ ⁻OOC</text>}
              <path d={`M${kop ? 200 : 128} ${y} ${Array.from({ length: 7 }, (_, j) => `L${(kop ? 200 : 128) + (j + 1) * 11} ${y + (j % 2 ? 0 : -7)}`).join(" ")}`} fill="none" stroke="var(--ink)" strokeWidth={2.4} strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
      <line x1={45} y1={54} x2={45} y2={74} stroke="var(--ink)" strokeWidth={2} />
      <line x1={45} y1={102} x2={45} y2={122} stroke="var(--ink)" strokeWidth={2} />
      <text x={170} y={176} fontSize={14} fontWeight={800} textAnchor="middle" fill={n === 3 ? "var(--good)" : "var(--ink)"}>
        {kopan === 0 ? "1 mol trigliserit: 3 ester bağı" : kopan < 3 ? `${kopan} ester bağı koptu, ${3 - kopan} bağ duruyor` : "1 gliserol + 3 sabun molekülü"}
      </text>
      <text x={170} y={198} fontSize={12} fontWeight={700} textAnchor="middle" fill={fazla ? "var(--bad)" : "var(--muted)"}>
        {fazla ? `${fazla} mol NaOH arttı: harcanmadı` : `Eklenen NaOH: ${n} mol`}
      </text>
      <text x={170} y={220} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">Sabun: yağ asidinin sodyum tuzu (R–COO⁻ Na⁺)</text>
    </svg>
  );
}

/* ---------- ham petrolün ayrımsal damıtılması ---------- */

const KESIR = [
  { ad: "gaz (LPG)", c: [1, 4], kn: "40 °C'nin altı" },
  { ad: "benzin", c: [5, 10], kn: "40–175 °C" },
  { ad: "gazyağı", c: [11, 16], kn: "175–275 °C" },
  { ad: "motorin", c: [17, 20], kn: "275–350 °C" },
  { ad: "kalıntı (asfalt)", c: [21, 40], kn: "350 °C'nin üstü" },
];

function Kule({ v }: SahneProps) {
  const c = sinir(v.c ?? 1, 1, 30), i = KESIR.findIndex((k) => c >= k.c[0] && c <= k.c[1]), d = KESIR[i];
  const rafY = (j: number) => 30 + j * 36;
  const ny = rafY(i) + 2, nz = Math.min(c, 9);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`C${c} molekülü: ${d.ad} kesrine gider, kaynama aralığı ${d.kn}`}>
      <path d="M40 18 L100 18 L100 196 L40 196 Z" fill="none" stroke="var(--ink)" strokeWidth={2} />
      {KESIR.map((k, j) => (
        <g key={k.ad}>
          <line x1={40} y1={rafY(j) + 14} x2={100} y2={rafY(j) + 14} stroke="var(--line-2)" strokeWidth={1.6} />
          <line x1={100} y1={rafY(j) + 4} x2={120} y2={rafY(j) + 4} stroke={j === i ? "var(--kimya)" : "var(--line-2)"} strokeWidth={2} />
          <text x={126} y={rafY(j) + 8} fontSize={11.5} fontWeight={800} fill={j === i ? "var(--kimya)" : "var(--muted)"}>{k.ad} · C{k.c[0]}{j === 4 ? "+" : `–${k.c[1]}`}</text>
        </g>
      ))}
      <text x={70} y={214} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--c2)">ısıtılan ham petrol</text>
      <text x={34} y={30} fontSize={10.5} fontWeight={800} textAnchor="end" fill="var(--c1)">soğuk</text>
      <text x={34} y={190} fontSize={10.5} fontWeight={800} textAnchor="end" fill="var(--c2)">sıcak</text>
      {/* molekül: rafına kadar yükselir */}
      <polyline
        points={Array.from({ length: nz }, (_, j) => `${70 - (nz - 1) * 3 + j * 6},${ny + (j % 2 ? 4 : -4)}`).join(" ")}
        fill="none" stroke="var(--kimya)" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round"
      />
      <text x={220} y={214} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">C{c} · KN {d.kn}</text>
      <text x={220} y={232} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">Küçük molekül yukarıda yoğunlaşır</text>
    </svg>
  );
}

/* ---------- yakıtlara göre CO₂ salımı ---------- */

const YAKIT = [
  { ad: "kömür", g: 95 },
  { ad: "petrol", g: 73 },
  { ad: "doğal gaz", g: 56 },
];

function Co2({ v, set }: SahneProps) {
  const y = sinir(v.y ?? 0, 0, 2), d = YAKIT[y];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${d.ad}: 1 MJ ısı için yaklaşık ${d.g} g CO₂`}>
      <Sekmeler adlar={YAKIT.map((x) => x.ad)} secili={y} sec={(i) => set("y", i)} x0={30} gen={280} />
      {YAKIT.map((x, i) => {
        const h = x.g * 1.2, cx = 84 + i * 86;
        return (
          <g key={x.ad} opacity={i === y ? 1 : 0.35}>
            <rect x={cx - 26} y={166 - h} width={52} height={h} rx={6} fill={i === y ? "var(--c2)" : "var(--muted)"} />
            <text x={cx} y={160 - h} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{x.g} g</text>
            <text x={cx} y={184} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{x.ad}</text>
          </g>
        );
      })}
      <line x1={40} y1={166} x2={300} y2={166} stroke="var(--line-2)" strokeWidth={1.6} />
      <text x={170} y={212} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Aynı ısı (1 MJ) için çıkan CO₂</text>
    </svg>
  );
}

/* ---------- sera etkisi ---------- */

function Sera({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5)), k = yumusak((u - 0.1) / 0.8), T = Math.round(15 - 33 * k), Ty = T < 0 ? `−${-T}` : String(T);
  const atm = 1 - k;
  const dalga = (x: number, y0: number, n: number) => `M${x} ${y0} ` + Array.from({ length: n }, (_, j) => `q${j % 2 ? -6 : 6} -9 0 -18`).join(" ");
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={u >= 1 ? "Sera gazları olmadan ortalama sıcaklık yaklaşık −18 °C" : `Ortalama sıcaklık ${Ty} °C`}>
      <rect x={0} y={50} width={340} height={28} fill="var(--c4)" opacity={0.25 * atm} />
      <text x={334} y={44} fontSize={10.5} fontWeight={800} textAnchor="end" fill="var(--muted)" opacity={atm}>sera gazları</text>
      {/* gelen güneş ışığı */}
      {[30, 80, 130].map((x) => (
        <g key={x}>
          <line x1={x - 20} y1={6} x2={x + 20} y2={146} stroke="var(--c4)" strokeWidth={3} strokeLinecap="round" />
          <path d={`M${x + 21} 148 l-8 -6 l9 -4 z`} fill="var(--c4)" />
        </g>
      ))}
      {/* yerden yayılan kızılötesi: sera gazları varken bir kısmı geri döner */}
      {[172, 212, 252].map((x, i) => {
        const geri = atm > 0.3 && i < 2;
        return (
          <g key={x} stroke="var(--c2)" strokeWidth={2.2} fill="none">
            <path d={dalga(x, 150, geri ? 4 : 8)} />
            {geri && (
              <g opacity={atm}>
                <path d={`M${x + 4} 80 L${x + 18} 140`} strokeDasharray="4 3" />
                <path d={`M${x + 19} 146 l-6 -8 l8 -2 z`} fill="var(--c2)" stroke="none" />
              </g>
            )}
          </g>
        );
      })}
      <text x={314} y={120} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--c2)">kızıl-</text>
      <text x={314} y={133} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--c2)">ötesi</text>
      <path d="M0 160 Q170 132 340 160 L340 176 L0 176 Z" fill="var(--c3)" opacity={0.35} />
      <text x={170} y={200} fontSize={15} fontWeight={800} textAnchor="middle" fill={T < 0 ? "var(--c1)" : "var(--ink)"}>Ortalama sıcaklık: {Ty} °C</text>
      <text x={170} y={220} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {u === 0 ? "Bugün: sera gazları kızılötesinin bir kısmını tutuyor" : u >= 1 ? "Sera gazı yok: ısı uzaya kaçıyor" : "Sera gazları kaldırılıyor…"}
      </text>
    </svg>
  );
}

/* ---------- asit yağmuru ---------- */

const PH = [5.6, 5.0, 4.5, 4.0];

function Asit({ v }: SahneProps) {
  const n = sinir(v.s ?? 0, 0, 3), ph = PH[n], asin = n / 3;
  const phX = (p: number) => 40 + ((p - 3.5) / 4) * 260;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Havadaki SO₂ düzeyi ${n}: yağmurun pH'ı yaklaşık ${ph}`}>
      <path d="M70 46 a20 20 0 0 1 36 -14 a24 24 0 0 1 44 6 a18 18 0 0 1 10 30 L76 68 a16 16 0 0 1 -6 -22 Z" fill="var(--panel)" stroke="var(--line-2)" />
      {[84, 104, 124, 144].map((x, i) => <line key={x} x1={x} y1={78 + (i % 2) * 8} x2={x - 4} y2={92 + (i % 2) * 8} stroke={n ? "var(--c4)" : "var(--c1)"} strokeWidth={2.2} strokeLinecap="round" />)}
      {/* mermer sütun: asitle aşınır */}
      <g>
        <rect x={232} y={40} width={56} height={10} rx={2} fill="var(--line-2)" />
        <path d={`M${240 + 6 * asin} 50 L${280 - 6 * asin} 50 L${280 - 2 * asin} 112 L${240 + 2 * asin} 112 Z`} fill="var(--panel)" stroke="var(--line-2)" />
        <rect x={232} y={112} width={56} height={10} rx={2} fill="var(--line-2)" />
        <text x={260} y={140} fontSize={11} fontWeight={800} textAnchor="middle" fill={n ? "var(--bad)" : "var(--muted)"}>{n ? "mermer aşınıyor" : "mermer (CaCO₃)"}</text>
      </g>
      <text x={20} y={124} fontSize={11.5} fontWeight={800} fill={n ? "var(--c2)" : "var(--muted)"}>
        {n ? "SO₂ → SO₃ → H₂SO₄" : "CO₂ + H₂O ⇌ H₂CO₃"}
      </text>
      {/* pH ölçeği */}
      <rect x={40} y={158} width={260} height={10} rx={5} fill="var(--panel)" />
      <line x1={phX(5.6)} y1={152} x2={phX(5.6)} y2={174} stroke="var(--muted)" strokeWidth={1.6} strokeDasharray="3 3" />
      <text x={phX(5.6)} y={188} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--muted)">5,6</text>
      <text x={phX(7)} y={188} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--muted)">7</text>
      <text x={phX(4)} y={188} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="var(--muted)">4</text>
      <text x={30} y={167} fontSize={11} fontWeight={800} textAnchor="end" fill="var(--muted)">pH</text>
      <circle cx={phX(ph)} cy={163} r={8} fill={n ? "var(--c2)" : "var(--c1)"} />
      <text x={170} y={212} fontSize={14} fontWeight={800} textAnchor="middle" fill={n ? "var(--bad)" : "var(--ink)"}>
        Yağmurun pH'ı ≈ {ph.toLocaleString("tr-TR")} · {n ? "asit yağmuru" : "temiz yağmur"}
      </text>
      <text x={170} y={230} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">Havadaki SO₂: {["yok", "az", "orta", "çok"][n]}</text>
    </svg>
  );
}

/* ---------- santrallerde enerji dönüşümü ---------- */

const SANTRAL = [
  { ad: "Hidroelektrik", zincir: ["suyun potansiyel enerjisi", "türbin", "jeneratör", "elektrik"], co2: false },
  { ad: "Rüzgâr", zincir: ["havanın kinetik enerjisi", "türbin", "jeneratör", "elektrik"], co2: false },
  { ad: "Güneş pili", zincir: ["ışık", "yarı iletken (silisyum)", "elektrik"], co2: false },
  { ad: "Kömür", zincir: ["kimyasal enerji", "yanma: ısı, buhar", "türbin", "jeneratör", "elektrik"], co2: true },
  { ad: "Nükleer", zincir: ["²³⁵U fisyonu", "ısı, buhar", "türbin", "jeneratör", "elektrik"], co2: false },
  { ad: "Yakıt pili", zincir: ["H₂ + O₂ (kimyasal)", "elektrotlar", "elektrik"], co2: false },
];

function Santral({ v, set }: SahneProps) {
  const k = sinir(v.k ?? 0, 0, 5), d = SANTRAL[k], n = d.zincir.length;
  const y0 = 86, adimY = n > 4 ? 27 : 36, renk = (z: string, son: boolean) => (son ? "var(--good)" : z === "türbin" || z === "jeneratör" ? "var(--c5)" : "var(--ink)");
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${d.ad}: ${d.zincir.join(", ")}`}>
      <Sekmeler adlar={SANTRAL.slice(0, 3).map((x) => x.ad)} secili={k} sec={(i) => set("k", i)} y={6} />
      <Sekmeler adlar={SANTRAL.slice(3).map((x) => x.ad)} secili={k - 3} sec={(i) => set("k", i + 3)} y={36} />
      <line x1={100} y1={y0} x2={100} y2={y0 + (n - 1) * adimY} stroke="var(--line-2)" strokeWidth={2} />
      {d.zincir.map((z, i) => {
        const y = y0 + i * adimY, son = i === n - 1;
        return (
          <g key={z}>
            <circle cx={100} cy={y} r={5.5} fill={renk(z, son)} />
            <text x={114} y={y + 4.5} fontSize={13} fontWeight={800} fill={renk(z, son)}>{z}</text>
          </g>
        );
      })}
      <text x={170} y={224} fontSize={12} fontWeight={700} textAnchor="middle" fill={d.co2 ? "var(--bad)" : "var(--muted)"}>
        {d.co2 ? "Çalışırken CO₂ salar" : "Çalışırken CO₂ salmaz"}
      </text>
    </svg>
  );
}

/* ---------- atom ekonomisi ---------- */

const YOL = [
  { ad: "Fermantasyon", den: "C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂", urun: 92, top: 180, atik: "2 CO₂" },
  { ad: "Yer değiştirme", den: "C₂H₅Br + NaOH → C₂H₅OH + NaBr", urun: 46, top: 149, atik: "NaBr" },
  { ad: "Katılma", den: "C₂H₄ + H₂O → C₂H₅OH", urun: 46, top: 46, atik: "yok" },
];

function AtomEko({ v, set }: SahneProps) {
  const y = sinir(v.y ?? 0, 0, 2), d = YOL[y], e = Math.round((100 * d.urun) / d.top), W = 260;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${d.ad}: atom ekonomisi yüzde ${e}`}>
      <Sekmeler adlar={YOL.map((x) => x.ad)} secili={y} sec={(i) => set("y", i)} />
      <text x={170} y={70} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.den}</text>
      <text x={170} y={92} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">İstenen ürün: etanol (46 g/mol) · Atık: {d.atik}</text>
      <rect x={40} y={112} width={W} height={26} rx={8} fill="var(--panel)" />
      <rect x={40} y={112} width={(W * e) / 100} height={26} rx={8} fill="var(--c3)" />
      {e < 100 && <text x={40 + (W * e) / 100 + 8} y={130} fontSize={11.5} fontWeight={800} fill="var(--muted)">atık</text>}
      <text x={48} y={130} fontSize={11.5} fontWeight={800} fill="#fff">ürün</text>
      <text x={170} y={170} fontSize={16} fontWeight={800} textAnchor="middle" fill={e === 100 ? "var(--good)" : "var(--ink)"}>Atom ekonomisi: %{e}</text>
      <text x={170} y={192} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {d.urun} / {d.top} × 100 · ürünün kütlesi / girenlerin kütlesi
      </text>
    </svg>
  );
}

/* ---------- nano: küpü böl ---------- */

function Nano({ v }: SahneProps) {
  const n = sinir(v.n ?? 1, 1, 4), L = 80, a = L / n, bos = n > 1 ? 4 : 0;
  // İzometrik eksenler.
  const ox = 120, oy = 108, cx = 0.866, cy = 0.5;
  const P = (x: number, y: number, z: number): [number, number] => [ox + (x - y) * cx * 0.85, oy + (x + y) * cy * 0.85 - z];
  const kup: React.ReactNode[] = [];
  // Arkadan öne: göze uzaklık x + y + z ile azalır.
  const sira: [number, number, number][] = [];
  for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) sira.push([x, y, z]);
  sira.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));
  for (const [x, y, z] of sira) {
    const X0 = x * (a + bos), Y0 = y * (a + bos), Z0 = z * (a + bos), s = a;
    const ust = [P(X0, Y0, Z0 + s), P(X0 + s, Y0, Z0 + s), P(X0 + s, Y0 + s, Z0 + s), P(X0, Y0 + s, Z0 + s)];
    const sag = [P(X0 + s, Y0, Z0), P(X0 + s, Y0 + s, Z0), P(X0 + s, Y0 + s, Z0 + s), P(X0 + s, Y0, Z0 + s)];
    const sol = [P(X0, Y0 + s, Z0), P(X0 + s, Y0 + s, Z0), P(X0 + s, Y0 + s, Z0 + s), P(X0, Y0 + s, Z0 + s)];
    const pts = (q: [number, number][]) => q.map((r) => r.join(",")).join(" ");
    kup.push(
      <g key={`${x}${y}${z}`} stroke="var(--ink)" strokeWidth={0.8} strokeLinejoin="round">
        <polygon points={pts(sag)} fill="#cdd6e3" />
        <polygon points={pts(sol)} fill="#e3e9f1" />
        <polygon points={pts(ust)} fill="#f6f8fb" />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`Küp ${n * n * n} parçaya bölündü; toplam yüzey ${n} kat, hacim aynı`}>
      <g>{kup}</g>
      <g fontWeight={800}>
        <text x={300} y={60} fontSize={12} textAnchor="end" fill="var(--muted)">küp sayısı</text>
        <text x={300} y={82} fontSize={18} textAnchor="end" fill="var(--ink)">{n * n * n}</text>
        <text x={300} y={112} fontSize={12} textAnchor="end" fill="var(--muted)">toplam yüzey</text>
        <text x={300} y={134} fontSize={18} textAnchor="end" fill={n > 1 ? "var(--c3)" : "var(--ink)"}>{n} kat</text>
        <text x={300} y={164} fontSize={12} textAnchor="end" fill="var(--muted)">toplam hacim</text>
        <text x={300} y={186} fontSize={18} textAnchor="end" fill="var(--ink)">aynı</text>
      </g>
      <text x={170} y={222} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Her kenar {n} parçaya bölündü</text>
    </svg>
  );
}

export const KIMYA12: Record<string, SahneKaydi> = {
  "kim12-grup": { C: Grup },
  "kim12-cozunur": { C: Cozunur },
  "kim12-hbag": { C: Hbag },
  "kim12-dikromat": { C: Dikromat },
  "kim12-ayirac": { C: Ayirac },
  "kim12-ester": { C: Ester },
  "kim12-sabun": { C: Sabun },
  "kim12-kule": { C: Kule },
  "kim12-co2": { C: Co2 },
  "kim12-sera": { C: Sera },
  "kim12-asit": { C: Asit },
  "kim12-santral": { C: Santral },
  "kim12-atomeko": { C: AtomEko },
  "kim12-nano": { C: Nano },
};
