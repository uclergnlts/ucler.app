"use client";
// Kimya sahneleri (modern atom teorisi): yörünge ve orbital, kuantum sayıları (n, ℓ, mℓ), Aufbau dolma sırası,
// Hund kuralıyla orbital şeması, dizilimden elementi bulma, Cr ve Cu istisnası, demir iyonlarının dizilimi.
import { rastgele, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const UST = "⁰¹²³⁴⁵⁶⁷⁸⁹";
/** Sayıyı üst simge yapar: 10 → ¹⁰. */
const ust = (n: number) => String(n).split("").map((c) => UST[Number(c)]).join("");

const EL: [string, string][] = [
  ["H", "Hidrojen"], ["He", "Helyum"], ["Li", "Lityum"], ["Be", "Berilyum"], ["B", "Bor"], ["C", "Karbon"], ["N", "Azot"], ["O", "Oksijen"], ["F", "Flor"], ["Ne", "Neon"],
  ["Na", "Sodyum"], ["Mg", "Magnezyum"], ["Al", "Alüminyum"], ["Si", "Silisyum"], ["P", "Fosfor"], ["S", "Kükürt"], ["Cl", "Klor"], ["Ar", "Argon"], ["K", "Potasyum"], ["Ca", "Kalsiyum"],
  ["Sc", "Skandiyum"], ["Ti", "Titanyum"], ["V", "Vanadyum"], ["Cr", "Krom"], ["Mn", "Mangan"], ["Fe", "Demir"], ["Co", "Kobalt"], ["Ni", "Nikel"], ["Cu", "Bakır"], ["Zn", "Çinko"],
];

/** Dolma sırası (enerji artışı) ve her alt katmanın orbital sayısı. */
const SIRA: { ad: string; m: number; nl: number }[] = [
  { ad: "1s", m: 1, nl: 1 }, { ad: "2s", m: 1, nl: 2 }, { ad: "2p", m: 3, nl: 3 }, { ad: "3s", m: 1, nl: 3 },
  { ad: "3p", m: 3, nl: 4 }, { ad: "4s", m: 1, nl: 4 }, { ad: "3d", m: 5, nl: 5 }, { ad: "4p", m: 3, nl: 5 },
];

/** Z elektronlu nötr atomun alt katmanlardaki elektron sayıları (Cr ve Cu istisnalarıyla). */
function dizilim(z: number): number[] {
  const e = SIRA.map(() => 0);
  let kalan = z;
  SIRA.forEach((s, i) => { const k = Math.min(kalan, 2 * s.m); e[i] = k; kalan -= k; });
  if (z === 24 || z === 29) { e[5] = 1; e[6] += 1; }
  return e;
}

/** k elektronun m orbitale Hund kuralıyla dağılımı: her kutuda 0, 1 ya da 2. */
const hund = (k: number, m: number) => Array.from({ length: m }, (_, i) => (i < k ? 1 : 0) + (i < k - m ? 1 : 0));

/** Dizilim yazısı; ar: 18'den sonrası [Ar] ile kısaltılır. */
function yazi(e: number[], ar: boolean) {
  const p = SIRA.map((s, i) => (e[i] ? `${s.ad}${ust(e[i])}` : "")).filter(Boolean);
  return ar ? ["[Ar]", ...p.slice(5)].join(" ") : p.join(" ");
}

/** Orbital kutusu: içinde 0, 1 (↑) ya da 2 (↑↓) elektron. vurgu: "son" son giren elektronu boyar. */
function Kutu({ x, y, n, w = 24, renk = "var(--ink)", son = 0, kesik = false }: { x: number; y: number; n: number; w?: number; renk?: string; son?: 0 | 1 | 2; kesik?: boolean }) {
  const h = w, cy = y + h / 2, uz = h * 0.32;
  const ok = (cx: number, yukari: boolean, r: string) => (
    <g>
      <line x1={cx} x2={cx} y1={cy - uz} y2={cy + uz} stroke={r} strokeWidth={2} strokeLinecap="round" />
      <path d={yukari ? `M${cx - 3.5} ${cy - uz + 4.5} L${cx} ${cy - uz - 0.5} L${cx + 3.5} ${cy - uz + 4.5}` : `M${cx - 3.5} ${cy + uz - 4.5} L${cx} ${cy + uz + 0.5} L${cx + 3.5} ${cy + uz - 4.5}`} fill="none" stroke={r} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--surface)" stroke={kesik ? "var(--line-2)" : "var(--ink)"} strokeWidth={1.4} strokeDasharray={kesik ? "3 3" : undefined} />
      {n === 1 && ok(x + w / 2, true, son === 1 ? "var(--kimya)" : renk)}
      {n === 2 && ok(x + w / 2 - 5, true, renk)}
      {n === 2 && ok(x + w / 2 + 5, false, son === 2 ? "var(--kimya)" : renk)}
    </g>
  );
}

/* ---------- 1. yörünge ve orbital ---------- */

function Model({ v }: SahneProps) {
  const o = (v.o ?? 0) === 1, cx = 170, cy = 100;
  const r = rastgele(13), nokta: string[] = [];
  for (let i = 0; nokta.length < 260 && i < 2000; i++) {
    const u = r() || 0.0001, a = r() * Math.PI * 2, d = Math.sqrt(-2 * Math.log(u)) * 26;
    if (d < 74) nokta.push(`M${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}h0`);
  }
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={o ? "Kuantum modeli: elektron bulutu ve yüzde 90 sınırı" : "Bohr modeli: elektron belirli dairesel yörüngede"}>
      {o ? (
        <g>
          <path d={nokta.join("")} stroke="var(--c1)" strokeWidth={3.2} strokeLinecap="round" fill="none" opacity={0.75} />
          <circle cx={cx} cy={cy} r={56} fill="none" stroke="var(--kimya)" strokeWidth={1.6} strokeDasharray="5 4" />
          <text x={cx + 46} y={cy - 50} fontSize={12} fontWeight={800} fill="var(--kimya)">%90</text>
        </g>
      ) : (
        <g>
          <circle cx={cx} cy={cy} r={62} fill="none" stroke="var(--c1)" strokeWidth={2} />
          <circle cx={cx + 62} cy={cy} r={7} fill="var(--c1)" />
          <path d={`M${cx + 44} ${cy - 44} A62 62 0 0 1 ${cx + 60} ${cy - 16}`} fill="none" stroke="var(--c1)" strokeWidth={2.4} />
          <path d={`M${cx + 54.5} ${cy - 21} L${cx + 60} ${cy - 15} L${cx + 63} ${cy - 23}`} fill="none" stroke="var(--c1)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={6} fill="var(--c2)" />
      <text x={170} y={196} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{o ? "Kuantum modeli: orbital" : "Bohr modeli: yörünge"}</text>
      <text x={170} y={216} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {o ? "Elektronun yeri değil, bulunma olasılığı bilinir" : "Elektron belli bir dairesel yolda döner"}
      </text>
    </svg>
  );
}

/* ---------- 2. kuantum sayıları: n ve ℓ ---------- */

const HARF = "spdf";
const SEKIL = ["küresel", "halter", "çoğu dört yapraklı", "karmaşık"];

function Sekil({ l, cx, cy }: { l: number; cx: number; cy: number }) {
  const st = { fill: "var(--kimya)", fillOpacity: 0.28, stroke: "var(--kimya)", strokeWidth: 1.6 };
  if (l === 0) return <circle cx={cx} cy={cy} r={30} {...st} />;
  if (l === 1) return <g><ellipse cx={cx - 21} cy={cy} rx={21} ry={13} {...st} /><ellipse cx={cx + 21} cy={cy} rx={21} ry={13} {...st} /></g>;
  const n = l === 2 ? 4 : 6, uz = l === 2 ? 19 : 21;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (Math.PI * 2 * i) / n + Math.PI / 4, x = cx + uz * Math.cos(a), y = cy + uz * Math.sin(a);
        return <ellipse key={i} cx={x} cy={y} rx={l === 2 ? 17 : 15} ry={l === 2 ? 9 : 7} transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} {...st} />;
      })}
    </g>
  );
}

function Kuantum({ v }: SahneProps) {
  const n = sinir(v.n ?? 1, 1, 4), l = sinir(v.l ?? 0, 0, n - 1), m = 2 * l + 1;
  const w = 26, x0 = 170 - (m * w) / 2;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`n = ${n}, ℓ = ${l}: ${n}${HARF[l]} alt katmanı, ${m} orbital`}>
      <text x={24} y={30} fontSize={14} fontWeight={800} fill="var(--ink)">n = {n}</text>
      <text x={24} y={50} fontSize={12} fontWeight={700} fill="var(--muted)">{n}. katman</text>
      <text x={316} y={30} fontSize={14} fontWeight={800} textAnchor="end" fill="var(--ink)">ℓ = {l}</text>
      <text x={316} y={50} fontSize={12} fontWeight={700} textAnchor="end" fill="var(--muted)">ℓ en fazla n − 1 = {n - 1}</text>
      <text x={170} y={38} fontSize={30} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{n}{HARF[l]}</text>
      <Sekil l={l} cx={170} cy={96} />
      <circle cx={170} cy={96} r={3} fill="var(--c2)" />
      <text x={170} y={146} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{HARF[l]} orbitali: {SEKIL[l]}</text>
      {Array.from({ length: m }, (_, i) => (
        <g key={i}>
          <Kutu x={x0 + i * w} y={156} n={0} w={w} />
          <text x={x0 + i * w + w / 2} y={198} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{i - l > 0 ? `+${i - l}` : i - l < 0 ? `−${l - i}` : "0"}</text>
        </g>
      ))}
      <text x={x0 - 8} y={198} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">mℓ:</text>
      <text x={170} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{m} orbital · en çok {2 * m} elektron</text>
    </svg>
  );
}

/* ---------- 3. dolma sırası ---------- */

function Diyagram({ e, z, x0, y0, satir = 24, w = 22 }: { e: number[]; z: number; x0: number; y0: number; satir?: number; w?: number }) {
  // son giren elektron (istisnasız atomlarda): son dolu alt katmanın son eklenen oku
  let sonI = -1;
  e.forEach((k, i) => { if (k) sonI = i; });
  const istisna = z === 24 || z === 29;
  return (
    <g>
      {SIRA.map((s, i) => {
        const y = y0 - i * satir, kut = hund(e[i], s.m), k = e[i];
        const sonKutu = !istisna && i === sonI ? (k <= s.m ? k - 1 : k - s.m - 1) : -1;
        return (
          <g key={s.ad}>
            <text x={x0 - 8} y={y + w / 2 + 4} fontSize={12} fontWeight={800} textAnchor="end" fill={i === sonI ? "var(--kimya)" : "var(--ink)"}>{s.ad}</text>
            {kut.map((n, j) => <Kutu key={j} x={x0 + j * w} y={y} n={n} w={w} son={j === sonKutu ? (n as 1 | 2) : 0} kesik={k === 0} />)}
          </g>
        );
      })}
    </g>
  );
}

function Dolma({ v }: SahneProps) {
  const z = sinir(v.e ?? 18, 1, 30), e = dizilim(z), [sem, ad] = EL[z - 1];
  const istisna = z === 24 || z === 29;
  let sonI = -1;
  e.forEach((k, i) => { if (k) sonI = i; });
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${ad} (${z}): ${yazi(e, z > 18)}`}>
      <text x={14} y={14} fontSize={10} fontWeight={700} fill="var(--muted)">enerji ↑</text>
      <Diyagram e={e} z={z} x0={42} y0={208} />
      <text x={160} y={80} fontSize={10} fontWeight={700} fill="var(--muted)">n+ℓ=5</text>
      <text x={72} y={103} fontSize={10} fontWeight={700} fill="var(--muted)">n+ℓ=4</text>
      <text x={262} y={64} fontSize={34} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{sem}</text>
      <text x={262} y={88} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ad} · Z = {z}</text>
      <text x={262} y={124} fontSize={z > 18 ? 15 : 12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{yazi(e, z > 18)}</text>
      <text x={262} y={160} fontSize={12} fontWeight={700} textAnchor="middle" fill={istisna ? "var(--bad)" : "var(--muted)"}>
        {istisna ? "İstisna:" : `Son elektron: ${SIRA[sonI].ad}`}
      </text>
      {istisna && <text x={262} y={178} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--bad)">bir 4s e⁻ 3d'ye geçti</text>}
    </svg>
  );
}

/* ---------- 4. Hund kuralı: azotun 2p elektronları ---------- */

function Hund({ v, set }: SahneProps) {
  const k = [sinir(v.a ?? 0, 0, 2), sinir(v.b ?? 0, 0, 2), sinir(v.c ?? 0, 0, 2)];
  const ad = ["a", "b", "c"], top = k[0] + k[1] + k[2];
  const dogru = top === 3 && k.every((x) => x === 1), es = top === 3 && !dogru;
  const w = 40, x0 = 170 - 1.5 * w;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`Azot 2p: ${k.join(", ")} elektron; toplam ${top}`}>
      <text x={170} y={26} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">N (7 e⁻): 1s² 2s² 2p³</text>
      <text x={60} y={74} fontSize={12} fontWeight={800} textAnchor="end" fill="var(--muted)">1s</text>
      <Kutu x={66} y={56} n={2} w={28} />
      <text x={140} y={74} fontSize={12} fontWeight={800} textAnchor="end" fill="var(--muted)">2s</text>
      <Kutu x={146} y={56} n={2} w={28} />
      <text x={x0 - 8} y={134} fontSize={13} fontWeight={800} textAnchor="end" fill="var(--kimya)">2p</text>
      {k.map((n, i) => (
        <g key={i} onClick={() => set(ad[i], (n + 1) % 3)} style={{ cursor: "pointer" }}>
          <Kutu x={x0 + i * w} y={108} n={n} w={w} renk={dogru ? "var(--good)" : es ? "var(--bad)" : "var(--ink)"} />
        </g>
      ))}
      <text x={170} y={174} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">2p'de {top} / 3 elektron · kutuya dokunabilirsin</text>
      <text x={170} y={204} fontSize={13} fontWeight={800} textAnchor="middle" fill={dogru ? "var(--good)" : es || top > 3 ? "var(--bad)" : "var(--ink)"}>
        {dogru ? "↑ ↑ ↑: üç eşleşmemiş elektron, Hund'a uygun" : es ? "Boş orbital varken eşleşme olmaz" : top > 3 ? "Azotun 2p'sinde yalnızca 3 elektron var" : `${3 - top} elektron daha yerleştir`}
      </text>
    </svg>
  );
}

/* ---------- 5. dizilimden elementi bul: 16 elektron ---------- */

function Bul({ v }: SahneProps) {
  const say = (v.k ?? 0) === 1, e = dizilim(16);
  // alt katmanlar: ad, ilk kutunun x'i, kutu sayısı, elektron sayısı; kutular 22 birim
  const w = 22;
  const parca = [{ ad: "1s", x: 43, m: 1, k: 2 }, { ad: "2s", x: 79, m: 1, k: 2 }, { ad: "2p", x: 115, m: 3, k: 6 }, { ad: "3s", x: 195, m: 1, k: 2 }, { ad: "3p", x: 231, m: 3, k: e[4] }];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Dizilim: 1s² 2s² 2p⁶ 3s² 3p⁴">
      <text x={170} y={32} fontSize={20} fontWeight={800} textAnchor="middle" fill="var(--ink)">1s² 2s² 2p⁶ 3s² 3p⁴</text>
      {parca.map((p) => {
        const dis = say && p.ad.startsWith("3");
        return (
          <g key={p.ad}>
            {hund(p.k, p.m).map((n, j) => <Kutu key={j} x={p.x + j * w} y={58} n={n} w={w} renk={dis ? "var(--kimya)" : "var(--ink)"} />)}
            <text x={p.x + (p.m * w) / 2} y={96} fontSize={11} fontWeight={700} textAnchor="middle" fill={dis ? "var(--kimya)" : "var(--muted)"}>{p.ad}</text>
          </g>
        );
      })}
      {say ? (
        <g>
          <text x={170} y={138} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">2 + 2 + 6 + 2 + 4 = 16 elektron</text>
          <path d="M195 104 L195 110 L297 110 L297 104" fill="none" stroke="var(--kimya)" strokeWidth={1.6} />
          <text x={170} y={164} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--kimya)">En büyük n = 3 · dış katmanda 2 + 4 = 6 e⁻</text>
          <text x={170} y={190} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Dizilim p ile bitiyor: A grubu</text>
        </g>
      ) : (
        <text x={170} y={150} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Elektronları saymak için anahtarı aç</text>
      )}
    </svg>
  );
}

/* ---------- 6. Cr ve Cu istisnası ---------- */

function Istisna({ v }: SahneProps) {
  const cu = (v.el ?? 0) === 1;
  const sat = cu
    ? [{ et: "A", s: 2, d: 9 }, { et: "B", s: 1, d: 10 }]
    : [{ et: "kurala göre", s: 2, d: 4 }, { et: "gerçek", s: 1, d: 5 }];
  const x4 = 100, x3 = 136, w = 24;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={cu ? "Bakır için iki aday dizilim: A 4s² 3d⁹, B 4s¹ 3d¹⁰" : "Krom: kurala göre 4s² 3d⁴, gerçekte 4s¹ 3d⁵"}>
      <text x={170} y={28} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--ink)">{cu ? "Bakır (29): hangisi?" : "Krom (24)"}</text>
      <text x={x4 + w / 2} y={56} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--muted)">4s</text>
      <text x={x3 + 2.5 * w} y={56} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--muted)">3d</text>
      {sat.map((r, i) => {
        const y = 66 + i * 58, iyi = !cu && i === 1, kotu = !cu && i === 0;
        const renk = iyi ? "var(--good)" : kotu ? "var(--bad)" : "var(--ink)";
        return (
          <g key={r.et}>
            <text x={92} y={y + 18} fontSize={cu ? 16 : 12} fontWeight={800} textAnchor="end" fill={renk}>{r.et}</text>
            <Kutu x={x4} y={y} n={r.s} w={w} renk={renk} />
            {hund(r.d, 5).map((n, j) => <Kutu key={j} x={x3 + j * w} y={y} n={n} w={w} renk={renk} />)}
            <text x={x3 + 5 * w + 8} y={y + 17} fontSize={13} fontWeight={800} fill={renk}>4s{ust(r.s)} 3d{ust(r.d)}</text>
          </g>
        );
      })}
      <text x={170} y={200} fontSize={12} fontWeight={700} textAnchor="middle" fill={cu ? "var(--muted)" : "var(--good)"}>
        {cu ? "İpucu: kromda hangi d dizilimi kararlılık getirdi?" : "Yarı dolu 3d⁵ daha kararlı: bir 4s e⁻ 3d'ye geçer"}
      </text>
    </svg>
  );
}

/* ---------- 7. demir iyonları ---------- */

const FE = [
  { ad: "Fe", s: 2, d: 6 }, { ad: "Fe⁺", s: 1, d: 6 }, { ad: "Fe²⁺", s: 0, d: 6 }, { ad: "Fe³⁺", s: 0, d: 5 },
];

function Iyon({ v }: SahneProps) {
  const k = sinir(v.k ?? 0, 0, 3), f = FE[k], kut = hund(f.d, 5);
  const tek = (f.s === 1 ? 1 : 0) + kut.filter((x) => x === 1).length;
  const w = 28, x4 = 60, x3 = 104;
  const diz = `[Ar]${f.s ? ` 4s${ust(f.s)}` : ""} 3d${ust(f.d)}`;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${f.ad}: ${diz}, ${tek} eşleşmemiş elektron`}>
      <text x={170} y={36} fontSize={26} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{f.ad}</text>
      <text x={170} y={60} fontSize={13} fontWeight={700} textAnchor="middle" fill="var(--muted)">26 proton · {26 - k} elektron</text>
      <text x={x4 + w / 2} y={88} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--muted)">4s</text>
      <text x={x3 + 2.5 * w} y={88} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--muted)">3d</text>
      <Kutu x={x4} y={96} n={f.s} w={w} kesik={f.s === 0} />
      {kut.map((n, j) => <Kutu key={j} x={x3 + j * w} y={96} n={n} w={w} />)}
      <text x={170} y={158} fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--ink)">{diz}</text>
      <text x={170} y={184} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {k === 0 ? "Nötr demir: son elektronlar 3d'ye girdi" : k <= 2 ? "Elektronlar 4s'ten koptu (en büyük n)" : "4s boşaldıktan sonra 3d'den koptu"}
      </text>
      <text x={170} y={208} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{tek} eşleşmemiş e⁻ · paramanyetik</text>
    </svg>
  );
}

export const KIMYA13: Record<string, SahneKaydi> = {
  "kim13-model": { C: Model },
  "kim13-kuantum": {
    C: Kuantum,
    bagla: (ad, deger, v) => (ad === "n" ? { ...v, n: deger, l: Math.min(v.l ?? 0, deger - 1) } : ad === "l" ? { ...v, l: Math.min(deger, (v.n ?? 1) - 1) } : { ...v, [ad]: deger }),
  },
  "kim13-dolma": { C: Dolma },
  "kim13-hund": { C: Hund },
  "kim13-bul": { C: Bul },
  "kim13-istisna": { C: Istisna },
  "kim13-iyon": { C: Iyon },
};
