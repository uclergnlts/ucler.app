"use client";
// Biyoloji sahneleri (fotosentez, hücresel solunum): oksijenin kaynağı (izotop), ışığın rengi ve soğurma,
// Engelmann deneyi, ışığa bağımlı evre ve Calvin döngüsü, sınırlayıcı faktör, sıcaklık; solunumun evreleri,
// glikoliz, pirüvat oksidasyonu ve Krebs, ETS ve oksijen, fermantasyon, verim, gece ve gündüz gaz alışverişi.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const ISIK = "var(--c4)";
const O_RENK = "var(--c1)", O18 = "var(--c2)", C_RENK = "#5b6878";

/* ---------- oksijen nereden gelir? ---------- */

type Atom = { el: "C" | "O" | "H"; isaret?: boolean; a: [number, number]; b: [number, number] };

// 2CO₂ + 4H₂O → 2(CH₂O) + 2O₂ + 2H₂O: denklemin küçültülmüş hâli. Sudaki O işaretli (¹⁸O).
const DENKLEM: Atom[] = (() => {
  const L: Atom[] = [];
  const co2 = [[58, 66], [58, 104]], su = [[40, 148], [86, 148], [40, 190], [86, 190]];
  // glikoz parçası (CH₂O ×2) sağ üstte, O₂ ×2 sağ ortada, yeni su ×2 sağ altta
  const gC = [[252, 62], [284, 62]], gO = [[252, 86], [284, 86]], gH = [[236, 50], [268, 50], [300, 50], [268, 74]];
  const o2 = [[244, 134], [258, 134], [292, 134], [306, 134]];
  const ysu = [[252, 186], [298, 186]], ysuH = [[242, 196], [262, 196], [288, 196], [308, 196]];
  co2.forEach(([x, y], i) => {
    L.push({ el: "C", a: [x, y], b: gC[i] as [number, number] });
    L.push({ el: "O", a: [x - 16, y], b: gO[i] as [number, number] });
    L.push({ el: "O", a: [x + 16, y], b: ysu[i] as [number, number] });
  });
  su.forEach(([x, y], i) => {
    L.push({ el: "O", isaret: true, a: [x, y], b: o2[i] as [number, number] });
    L.push({ el: "H", a: [x - 11, y + 9], b: (i < 2 ? gH[i * 2] : ysuH[(i - 2) * 2]) as [number, number] });
    L.push({ el: "H", a: [x + 11, y + 9], b: (i < 2 ? gH[i * 2 + 1] : ysuH[(i - 2) * 2 + 1]) as [number, number] });
  });
  return L;
})();

function AtomDaire({ x, y, el, isaret }: { x: number; y: number; el: string; isaret?: boolean }) {
  const r = el === "H" ? 5.5 : 8.5;
  const renk = el === "H" ? "#fff" : el === "C" ? C_RENK : isaret ? O18 : O_RENK;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={renk} stroke={el === "H" ? "var(--line-2)" : "none"} strokeWidth={1.2} />
      {el !== "H" && <text x={x} y={y + 3.6} fontSize={9.5} fontWeight={800} fill="#fff" textAnchor="middle">{isaret ? "O*" : el}</text>}
    </g>
  );
}

function Denklem({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const bitti = u >= 1;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={bitti ? "İşaretli oksijen atomlarının hepsi O₂ molekülünde" : "Karbondioksit ve işaretli oksijenli su"}>
      <g stroke={ISIK} strokeWidth={2.4} strokeLinecap="round">
        <line x1={150} y1={22} x2={160} y2={70} />
        <line x1={172} y1={18} x2={172} y2={68} />
        <line x1={194} y1={22} x2={184} y2={70} />
      </g>
      <ellipse cx={172} cy={110} rx={34} ry={22} fill={YESIL} fillOpacity={0.14} stroke={YESIL} strokeWidth={1.6} />
      <text x={172} y={114} fontSize={11} fontWeight={700} fill={YESIL} textAnchor="middle">kloroplast</text>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={20} y={30}>girenler</text>
        <text x={320} y={30} textAnchor="end">çıkanlar</text>
        {bitti && (
          <g className="ad-belir" fill="var(--ink)">
            <text x={322} y={114} textAnchor="end" fontSize={11}>glikoz</text>
            <text x={322} y={160} textAnchor="end" fontSize={11} fill={O18}>O₂</text>
            <text x={322} y={220} textAnchor="end" fontSize={11}>su</text>
          </g>
        )}
      </g>
      <g>
        {DENKLEM.map((a, i) => {
          // önce kloroplasta girer, sonra yerine gider
          const g = sinir(u * 1.25 - (i % 6) * 0.04);
          const k = yumusak(g < 0.5 ? g * 2 : (g - 0.5) * 2);
          const x = g < 0.5 ? ara(a.a[0], 172, k) : ara(172, a.b[0], k);
          const y = g < 0.5 ? ara(a.a[1], 110, k) : ara(110, a.b[1], k);
          return <AtomDaire key={i} x={x} y={y} el={a.el} isaret={a.isaret} />;
        })}
      </g>
      <g fontSize={11} fontWeight={600} fill="var(--muted)">
        <circle cx={26} cy={222} r={6} fill={O18} />
        <text x={36} y={226}>O* = suyun işaretli oksijeni (¹⁸O)</text>
      </g>
    </svg>
  );
}

/* ---------- ışığın rengi ---------- */

const g = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2);
/** Klorofil a + b'nin göreli soğurması (0-1), şematik. */
const sogurma = (l: number) => sinir(0.05 + Math.max(g(l, 432, 18), 0.85 * g(l, 455, 14), 0.88 * g(l, 663, 13), 0.55 * g(l, 642, 10)));
/** Dalga boyunun yaklaşık rengi. */
function renk(l: number) {
  const d: [number, string][] = [[400, "#7b3fd0"], [440, "#3b4ee8"], [480, "#1f9be0"], [510, "#18b06a"], [550, "#5cc23a"], [580, "#e8d02a"], [610, "#f39a1e"], [650, "#e6402e"], [700, "#b51e2a"]];
  let r = d[0][1];
  for (const [x, c] of d) if (l >= x) r = c;
  return r;
}
const SX = (l: number) => 30 + ((l - 400) / 300) * 280;

function Spektrum({ y, h = 12 }: { y: number; h?: number }) {
  return (
    <g>
      <defs>
        <linearGradient id="biy8-spektrum" x1="0" x2="1">
          {[400, 440, 480, 510, 550, 580, 610, 650, 700].map((l) => <stop key={l} offset={(l - 400) / 300} stopColor={renk(l)} />)}
        </linearGradient>
      </defs>
      <rect x={30} y={y} width={280} height={h} rx={3} fill="url(#biy8-spektrum)" />
    </g>
  );
}

function Renk({ v }: SahneProps) {
  const l = v.l ?? 550, a = sogurma(l);
  const nokta = Array.from({ length: 61 }, (_, i) => 400 + i * 5).map((x) => `${SX(x).toFixed(1)},${(150 - sogurma(x) * 100).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={`${l} nm ışık; klorofil yüzde ${Math.round(a * 100)} soğuruyor`}>
      <text x={30} y={24} fontSize={12} fontWeight={700} fill="var(--muted)">klorofilin soğurduğu ışık</text>
      <line x1={30} y1={150} x2={310} y2={150} stroke="var(--line-2)" strokeWidth={1.2} />
      <polyline points={nokta} fill="none" stroke={YESIL} strokeWidth={2.6} strokeLinejoin="round" />
      <g>
        <line x1={SX(l)} y1={40} x2={SX(l)} y2={150} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="4 3" />
        <circle cx={SX(l)} cy={150 - a * 100} r={7} fill={renk(l)} stroke="#fff" strokeWidth={2} />
      </g>
      <Spektrum y={158} />
      <g fontSize={11} fill="var(--muted)">
        <text x={30} y={186}>400 nm</text>
        <text x={310} y={186} textAnchor="end">700 nm</text>
      </g>
      <text x={170} y={204} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {l} nm: %{Math.round(a * 100)} soğurulur, %{100 - Math.round(a * 100)} yansır ya da geçer
      </text>
    </svg>
  );
}

/* ---------- Engelmann ---------- */

const N_BAK = 46;
const BAKTERI = (() => {
  const r = rastgele(808);
  // hedef x'ler: soğurma (etki) eğrisinin ters dağılımından
  const xs = Array.from({ length: 121 }, (_, i) => 400 + i * 2.5);
  const w = xs.map((l) => sogurma(l) ** 2.2);
  const top = w.reduce((s, x) => s + x, 0);
  const birikim: number[] = [];
  w.reduce((s, x, i) => ((birikim[i] = s + x / top), s + x / top), 0);
  return Array.from({ length: N_BAK }, (_, i) => {
    const q = (i + 0.5) / N_BAK, j = birikim.findIndex((c) => c >= q);
    const yukari = r() < 0.5;
    return {
      x0: 34 + r() * 272, y0: 52 + r() * 34 + (r() < 0.5 ? 0 : 74),
      x1: SX(xs[Math.max(0, j)]) + (r() - 0.5) * 8, y1: yukari ? 100 - r() * 14 : 120 + r() * 14,
    };
  });
})();

function Engelmann({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = yumusak(ilerleme(t, oynuyor, sure));
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={u >= 1 ? "Bakteriler mavi-mor ve kırmızı ışık alan bölgelerde toplandı" : "Prizmadan geçen ışıkla aydınlatılmış alg ipliği ve bakteriler"}>
      <text x={30} y={26} fontSize={12} fontWeight={700} fill="var(--muted)">prizmadan geçen ışık algin üstünde</text>
      <Spektrum y={36} h={8} />
      <g>
        <rect x={30} y={105} width={280} height={10} rx={5} fill={YESIL} fillOpacity={0.35} stroke={YESIL} strokeWidth={1.4} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={30 + (i + 1) * 20} y1={105} x2={30 + (i + 1) * 20} y2={115} stroke={YESIL} strokeWidth={1} />)}
      </g>
      <g>
        {BAKTERI.map((b, i) => (
          <ellipse key={i} cx={ara(b.x0, b.x1, u)} cy={ara(b.y0, b.y1, u)} rx={3.6} ry={2.2} fill="var(--ink)" opacity={0.75} />
        ))}
      </g>
      <g fontSize={11.5} fontWeight={600} fill="var(--muted)">
        <text x={30} y={178}>yeşil iplik: alg · siyah noktalar: oksijen arayan bakteriler</text>
        {u >= 1 && <text className="ad-belir" x={30} y={198} fill="var(--ink)" fontWeight={700}>Bakteriler O₂'nin en çok üretildiği yerde.</text>}
      </g>
    </svg>
  );
}

/* ---------- ışığa bağımlı evre ve Calvin ---------- */

function Evreler({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const isik = (v.isik ?? 1) === 1;
  const oyn = oynuyor || t > 0;
  const tt = oyn ? t : 0;
  // Işık yoksa ATP ve NADPH 3 s içinde biter; Calvin onlar bitene kadar döner.
  const dolu = isik || !oyn ? 1 : sinir(1 - tt / 3);
  const calvin = dolu > 0;
  const seker = oyn ? Math.floor((isik ? tt : Math.min(tt, 3)) * 2) : 0;
  const aci = (isik ? tt : Math.min(tt, 3) + 0) * 120;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={isik ? "Işık açık: tilakoitte ATP ve NADPH yapılıyor, Calvin döngüsü dönüyor" : "Işık kapalı: Calvin döngüsü ATP ve NADPH bitince duruyor"}>
      <g stroke={ISIK} strokeWidth={2.4} strokeLinecap="round" opacity={isik ? 1 : 0.15}>
        <line x1={52} y1={14} x2={62} y2={46} />
        <line x1={78} y1={10} x2={78} y2={44} />
        <line x1={104} y1={14} x2={94} y2={46} />
      </g>
      <g>
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={78} cy={70 + i * 16} rx={40} ry={8} fill={YESIL} fillOpacity={0.3} stroke={YESIL} strokeWidth={1.4} />)}
        <text x={78} y={150} fontSize={11.5} fontWeight={700} fill={YESIL} textAnchor="middle">tilakoit (granum)</text>
        <text x={78} y={166} fontSize={11} fill="var(--muted)" textAnchor="middle">H₂O → O₂</text>
        {isik && oyn && [0, 1, 2].map((i) => {
          const k = ((tt * 0.8 + i / 3) % 1);
          return <circle key={i} cx={32 - k * 6} cy={110 - k * 70} r={4} fill="none" stroke={O_RENK} strokeWidth={1.4} />;
        })}
      </g>
      <g>
        {[{ x: 152, ad: "ATP" }, { x: 186, ad: "NADPH" }].map((b) => (
          <g key={b.ad}>
            <rect x={b.x - 9} y={60} width={18} height={80} rx={4} fill="none" stroke="var(--line-2)" strokeWidth={1.4} />
            <rect x={b.x - 9} y={60 + 80 * (1 - dolu)} width={18} height={80 * dolu} rx={4} fill={ISIK} fillOpacity={0.75} />
            <text x={b.x} y={156} fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{b.ad}</text>
          </g>
        ))}
      </g>
      <g>
        <circle cx={270} cy={100} r={40} fill="none" stroke={calvin ? YESIL : "var(--line-2)"} strokeWidth={3} strokeDasharray="200 52" transform={`rotate(${aci} 270 100)`} />
        <text x={270} y={97} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">Calvin</text>
        <text x={270} y={112} fontSize={11} fill="var(--muted)" textAnchor="middle">stroma</text>
        <text x={270} y={44} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">CO₂ girer</text>
        <text x={270} y={164} fontSize={11.5} fontWeight={700} fill={YESIL} textAnchor="middle">şeker: {seker}</text>
      </g>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {isik ? "Işık var: tilakoit ATP ve NADPH yapıyor" : !oyn ? "Işık kapalı: oynat ve izle" : calvin ? "Calvin, kalan ATP ve NADPH ile dönüyor" : "ATP ve NADPH bitti: Calvin durdu"}
      </text>
    </svg>
  );
}

/* ---------- sınırlayıcı faktör ---------- */

const PMAX = [0, 30, 55, 80];
const hiz = (isik: number, co2: number) => Math.min(isik, PMAX[co2] ?? 30);
const GX0 = 46, GX1 = 310, GY0 = 40, GY1 = 170;
const gx = (L: number) => GX0 + (L / 100) * (GX1 - GX0), gy = (r: number) => GY1 - (r / 100) * (GY1 - GY0);

function Sinirlayici({ v }: SahneProps) {
  const L = v.isik ?? 0, c = v.co2 ?? 1, r = hiz(L, c);
  const neden = L < PMAX[c] ? "ışık" : c < 3 ? "CO₂" : "başka bir faktör";
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`Işık %${L}, CO₂ düzeyi ${c}: hız ${r}; sınırlayan ${neden}`}>
      <g>
        <line x1={GX0} y1={GY1} x2={GX1} y2={GY1} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={GX0} y1={GY0 - 8} x2={GX0} y2={GY1} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={GX0 + 6} y={GY0 - 12} fontSize={11} fontWeight={700} fill="var(--ink)">fotosentez hızı</text>
        <text x={GX1} y={GY1 + 18} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">ışık şiddeti</text>
      </g>
      <g>
        {[1, 2, 3].map((k) => {
          const p = PMAX[k];
          return (
            <g key={k} opacity={k === c ? 1 : 0.28}>
              <polyline points={`${gx(0)},${gy(0)} ${gx(p)},${gy(p)} ${gx(100)},${gy(p)}`} fill="none" stroke={YESIL} strokeWidth={k === c ? 3 : 1.8} strokeLinejoin="round" />
              <text x={GX1 + 4} y={gy(p) + 4} fontSize={10.5} fontWeight={700} fill={YESIL}>{["", "az", "orta", "çok"][k]}</text>
            </g>
          );
        })}
        <text x={GX1 + 4} y={gy(PMAX[3]) - 12} fontSize={10.5} fill="var(--muted)">CO₂</text>
      </g>
      <circle cx={gx(L)} cy={gy(r)} r={7} fill="var(--c2)" stroke="#fff" strokeWidth={2} />
      <text x={170} y={206} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        hız: {r} · şu an sınırlayan: {neden}
      </text>
    </svg>
  );
}

/* ---------- sıcaklık ---------- */

const sicakHiz = (s: number) => (s <= 30 ? 40 * (s / 30) ** 1.6 : 40 * sinir(1 - ((s - 30) / 15) ** 2));

function Sicaklik({ v }: SahneProps) {
  const s = v.s ?? 10, r = sicakHiz(s), n = Math.round(r / 4);
  const r2 = rastgele(31);
  const kab = Array.from({ length: 10 }, () => ({ x: 52 + r2() * 26, y: 52 + r2() * 92, rr: 2.5 + r2() * 2 }));
  const nokta = Array.from({ length: 51 }, (_, i) => `${(170 + i * 2.8).toFixed(1)},${(170 - sicakHiz(i) * 2.6).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`${s} °C: dakikada ${Math.round(r)} kabarcık`}>
      <g>
        <path d="M40 40 L40 190 Q40 204 65 204 Q90 204 90 190 L90 40" fill="var(--c1)" fillOpacity={0.08} stroke="var(--ink)" strokeWidth={1.6} />
        <path d="M65 196 Q60 170 66 150 Q72 130 62 110 Q56 92 64 70" fill="none" stroke={YESIL} strokeWidth={3} strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={i % 2 ? 72 : 58} cy={176 - i * 20} rx={7} ry={3} fill={YESIL} transform={`rotate(${i % 2 ? -30 : 30} ${i % 2 ? 72 : 58} ${176 - i * 20})`} />
        ))}
        {kab.slice(0, n).map((k, i) => <circle key={i} cx={k.x} cy={k.y} r={k.rr} fill="none" stroke={O_RENK} strokeWidth={1.3} />)}
      </g>
      <g>
        <line x1={170} y1={170} x2={312} y2={170} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={170} y1={50} x2={170} y2={170} stroke="var(--ink)" strokeWidth={1.4} />
        <polyline points={nokta} fill="none" stroke={YESIL} strokeWidth={2.4} />
        <circle cx={170 + s * 2.8} cy={170 - r * 2.6} r={6} fill="var(--c2)" stroke="#fff" strokeWidth={2} />
        <text x={176} y={46} fontSize={11} fontWeight={700} fill="var(--ink)">kabarcık / dk</text>
        <g fontSize={10.5} fill="var(--muted)" textAnchor="middle">
          <text x={170} y={186}>0</text>
          <text x={254} y={186}>30</text>
          <text x={310} y={186}>50 °C</text>
        </g>
      </g>
      <text x={170} y={216} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {s} °C: dakikada {Math.round(r)} kabarcık O₂{s > 40 ? " (enzimler bozuluyor)" : ""}
      </text>
    </svg>
  );
}

/* ---------- solunumun evreleri ---------- */

const EVRE = [
  { ad: "Glikoliz", yer: "sitoplazma", x: 52, atp: 2, t: 2 },
  { ad: "Krebs", yer: "matriks", x: 170, atp: 2, t: 4.5 },
  { ad: "ETS", yer: "iç zar", x: 260, lx: 300, atp: 26, t: 7 },
];

function SolunumYol({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 8;
  const tt = oynuyor || t > 0 ? t : 0;
  const bitti = tt >= sure;
  const kazanc = EVRE.map((e) => sinir((tt - (e.t - 1.2)) / 1.2) * e.atp);
  const top = Math.round(kazanc.reduce((a, b) => a + b, 0));
  const gx = tt < 2 ? ara(20, 52, sinir(tt / 1.5)) : tt < 4.5 ? ara(52, 170, sinir((tt - 2) / 2)) : ara(170, 240, sinir((tt - 4.5) / 2));
  return (
    <svg viewBox="0 0 340 266" role="img" aria-label={bitti ? "Toplam yaklaşık 30 ATP; çoğu ETS'den" : "Glikozun solunum yolculuğu"}>
      <g>
        <rect x={112} y={44} width={220} height={116} rx={58} fill={YESIL} fillOpacity={0.07} stroke={YESIL} strokeWidth={1.6} />
        <path d="M214 50 Q220 80 212 100 Q204 120 214 152 M240 46 Q246 80 238 100 Q230 122 240 156 M266 48 Q272 82 264 102 Q256 122 266 154" fill="none" stroke={YESIL} strokeWidth={1.4} />
        <text x={124} y={38} fontSize={11} fontWeight={700} fill={YESIL}>mitokondri</text>
      </g>
      <g>
        {EVRE.map((e) => (
          <g key={e.ad}>
            <text x={e.lx ?? e.x} y={72} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{e.ad}</text>
            <text x={e.lx ?? e.x} y={86} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{e.yer}</text>
          </g>
        ))}
      </g>
      {!bitti && (
        <g transform={`translate(${gx} 118)`}>
          <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill={ISIK} fillOpacity={0.85} />
        </g>
      )}
      <g>
        {EVRE.map((e, i) => {
          const h = Math.max(0, kazanc[i]) * 2.6;
          return (
            <g key={e.ad}>
              <rect x={e.x - 14} y={258 - h} width={28} height={h} rx={3} fill={ISIK} />
              {kazanc[i] > 0.05 && <text x={e.x + 18} y={254} fontSize={11.5} fontWeight={800} fill="var(--ink)">{Math.round(kazanc[i])} ATP</text>}
            </g>
          );
        })}
        <line x1={20} y1={258} x2={320} y2={258} stroke="var(--line-2)" strokeWidth={1.2} />
      </g>
      <text x={20} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">toplam: {bitti ? "≈30-32" : top} ATP</text>
    </svg>
  );
}

/* ---------- glikoliz ---------- */

function Glikoliz({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const harca = u > 0.15, bol = u > 0.45, uret = u > 0.7;
  const net = (uret ? 4 : 0) - (harca ? 2 : 0);
  const C = (x: number, y: number, k: number) => <circle key={k} cx={x} cy={y} r={9} fill={C_RENK} />;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={uret ? "Glikoliz: 2 ATP harcandı, 4 ATP üretildi, net 2 ATP" : "Glikoz, glikolize giriyor"}>
      <text x={20} y={26} fontSize={12} fontWeight={700} fill="var(--muted)">sitoplazmada, O₂ gerekmeden</text>
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          const sol = i < 3, ayir = bol ? (sol ? -18 : 18) : 0;
          return C(110 + i * 24 + ayir, 82, i);
        })}
        <text x={170} y={114} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{bol ? "2 pirüvat (3C + 3C)" : "glikoz (6C)"}</text>
      </g>
      <g fontSize={13} fontWeight={800}>
        <g opacity={harca ? 1 : 0}>
          <text x={40} y={150} fill="var(--c2)">−2 ATP</text>
          <text x={40} y={166} fontSize={11} fontWeight={600} fill="var(--muted)">başta harcanır</text>
        </g>
        <g opacity={uret ? 1 : 0}>
          <text x={150} y={150} fill={YESIL}>+4 ATP</text>
          <text x={150} y={166} fontSize={11} fontWeight={600} fill="var(--muted)">sonra üretilir</text>
        </g>
        <g opacity={uret ? 1 : 0}>
          <text x={250} y={150} fill="var(--c1)">+2 NADH</text>
        </g>
      </g>
      <text x={170} y={204} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">net kazanç: {net > 0 ? "+" : net < 0 ? "−" : ""}{Math.abs(net)} ATP</text>
    </svg>
  );
}

/* ---------- pirüvat oksidasyonu ve Krebs ---------- */

const KREBS = [
  { ad: "Glikoliz bitti: 2 pirüvat", co2: 0, nadh: 2, fadh: 0, atp: 2 },
  { ad: "Pirüvat oksidasyonu", co2: 2, nadh: 4, fadh: 0, atp: 2 },
  { ad: "Krebs, 1. tur", co2: 4, nadh: 7, fadh: 1, atp: 3 },
  { ad: "Krebs, 2. tur", co2: 6, nadh: 10, fadh: 2, atp: 4 },
];

function Krebs({ v }: SahneProps) {
  const a = sinir(Math.round(v.a ?? 0), 0, 3), k = KREBS[a];
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`${k.ad}: ${k.co2} CO₂, ${k.nadh} NADH, ${k.fadh} FADH₂`}>
      <text x={20} y={26} fontSize={13} fontWeight={800} fill="var(--ink)">{k.ad}</text>
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          // her pirüvattan sırayla birer karbon ayrılır
          const o = [0, 2, 4, 1, 3, 5][i];
          const cikti = o < k.co2;
          const x = cikti ? 222 + (o % 2) * 62 : 40 + (i % 3) * 24 + (i < 3 ? 0 : 84);
          const y = cikti ? 62 + Math.floor(o / 2) * 32 : 76;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={9} fill={C_RENK} />
              {cikti && (
                <g>
                  <circle cx={x - 16} cy={y} r={7} fill={O_RENK} />
                  <circle cx={x + 16} cy={y} r={7} fill={O_RENK} />
                </g>
              )}
            </g>
          );
        })}
        <text x={40} y={110} fontSize={11} fill="var(--muted)">{6 - k.co2 > 0 ? `içeride kalan karbon: ${6 - k.co2}` : "glikozun karbonu kalmadı"}</text>
        <text x={253} y={44} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">CO₂: {k.co2}</text>
      </g>
      <g fontSize={13} fontWeight={800}>
        {[
          { ad: "NADH", n: k.nadh, renk: "var(--c1)" },
          { ad: "FADH₂", n: k.fadh, renk: "var(--c5)" },
          { ad: "ATP", n: k.atp, renk: "#b7800d" },
        ].map((b, i) => (
          <g key={b.ad}>
            <text x={40 + i * 100} y={170} fill={b.renk}>{b.n}</text>
            <text x={40 + i * 100} y={188} fontSize={11} fontWeight={600} fill="var(--muted)">{b.ad}</text>
          </g>
        ))}
      </g>
      <text x={20} y={216} fontSize={11} fill="var(--muted)">sayılar glikoz başına, glikolizden itibaren toplam</text>
    </svg>
  );
}

/* ---------- ETS ve oksijen ---------- */

function Ets({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const o2 = s.oksijen !== false;
  const tt = oynuyor || t > 0 ? t : 0;
  // O₂ yoksa zincir 1,5 s'de tıkanır.
  const akan = o2 ? tt : Math.min(tt, 1.5);
  const durdu = !o2 && tt > 1.5;
  const nadh = o2 ? 4 : Math.min(10, 4 + Math.max(0, tt - 1.5) * 2.2);
  const nad = o2 ? 6 : Math.max(0, 6 - Math.max(0, tt - 1.5) * 2.2);
  const KX = [70, 130, 190];
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={durdu ? "O₂ yok: elektron zinciri durdu, NAD⁺ tükeniyor" : "Elektron taşıma sistemi çalışıyor"}>
      <text x={20} y={22} fontSize={11} fontWeight={700} fill="var(--muted)">zarlar arası boşluk</text>
      <text x={20} y={212} fontSize={11} fontWeight={700} fill="var(--muted)">matriks</text>
      <rect x={20} y={92} width={300} height={34} fill={ISIK} fillOpacity={0.18} />
      <g>
        {KX.map((x) => <rect key={x} x={x - 14} y={84} width={28} height={50} rx={9} fill="var(--c5)" fillOpacity={0.75} />)}
        <g>
          <rect x={258} y={84} width={24} height={50} rx={6} fill={YESIL} fillOpacity={0.8} />
          <circle cx={270} cy={150} r={12} fill={YESIL} fillOpacity={0.8} transform={`rotate(${(o2 ? tt : Math.min(tt, 1.5)) * 200} 270 150)`} />
          <text x={292} y={112} fontSize={10.5} fontWeight={700} fill={YESIL}>ATP</text>
          <text x={292} y={124} fontSize={10.5} fontWeight={700} fill={YESIL}>sentaz</text>
        </g>
        {[0, 1, 2].map((i) => {
          const k = (akan * 0.9 + i / 3) % 1;
          const x = ara(56, 200, k);
          return <circle key={i} cx={x} cy={109} r={4} fill="var(--c1)" opacity={oynuyor || t > 0 ? 1 : 0.4} />;
        })}
        {KX.map((x, i) => {
          const k = (akan * 0.7 + i * 0.3) % 1;
          return <text key={x} x={x} y={74 - k * 30} fontSize={11} fontWeight={800} fill="var(--c2)" textAnchor="middle" opacity={tt > 0 && !durdu ? 1 - k : 0.3}>H⁺</text>;
        })}
      </g>
      <g>
        <text x={214} y={176} fontSize={12} fontWeight={800} fill={o2 ? "var(--c1)" : "var(--bad)"}>{o2 ? "O₂ → H₂O" : "O₂ yok"}</text>
      </g>
      <g fontSize={12} fontWeight={800}>
        <text x={40} y={168} fill="var(--c1)">NADH: {Math.round(nadh)}</text>
        <text x={40} y={186} fill={nad < 1 ? "var(--bad)" : "var(--ink)"}>NAD⁺: {Math.round(nad)}</text>
      </g>
      {durdu && (
        <text className="ad-belir" x={170} y={226} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
          {nad < 1 ? "NAD⁺ bitti: glikoliz de duracak" : "Zincir tıkandı: elektronlar ilerleyemiyor"}
        </text>
      )}
    </svg>
  );
}

/* ---------- fermantasyon ---------- */

function Fermantasyon({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const kas = (v.kas ?? 0) === 1;
  const u = ilerleme(t, oynuyor, sure);
  const balon = kas ? 0 : u;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={kas ? "Kas hücresi: pirüvat laktik asite dönüşür, CO₂ çıkmaz" : `Maya: etil alkol ve CO₂; balon ${Math.round(balon * 100)}% şişti`}>
      {!kas ? (
        <g>
          <ellipse cx={90} cy={58 - balon * 18} rx={10 + balon * 26} ry={10 + balon * 24} fill="var(--c2)" fillOpacity={0.25 + balon * 0.4} stroke="var(--c2)" strokeWidth={1.4} />
          <path d="M80 96 L80 84 L100 84 L100 96 Q126 110 126 140 L126 196 Q126 206 116 206 L64 206 Q54 206 54 196 L54 140 Q54 110 80 96 Z" fill="var(--c4)" fillOpacity={0.12} stroke="var(--ink)" strokeWidth={1.6} />
          {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={66 + (i % 4) * 16} cy={176 + Math.floor(i / 4) * 14} r={4} fill="#c9a36a" />)}
          {u > 0 && u < 1 && [0, 1, 2, 3].map((i) => {
            const k = (u * 3 + i / 4) % 1;
            return <circle key={i} cx={70 + i * 13} cy={170 - k * 60} r={3} fill="none" stroke="var(--ink)" strokeWidth={1} />;
          })}
          <text x={90} y={224} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">şekerli su + maya</text>
        </g>
      ) : (
        <g>
          <rect x={40} y={90} width={110} height={70} rx={30} fill="var(--c2)" fillOpacity={0.14} stroke="var(--c2)" strokeWidth={1.6} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={54} y1={106 + i * 13} x2={136} y2={106 + i * 13} stroke="var(--c2)" strokeOpacity={0.4} strokeWidth={1.2} />)}
          <text x={95} y={184} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">kas hücresi (O₂ yetmiyor)</text>
        </g>
      )}
      <g fontSize={12} fontWeight={700}>
        <text x={190} y={70} fill="var(--ink)">glikoz</text>
        <text x={190} y={92} fill="var(--muted)">↓ glikoliz (+2 ATP)</text>
        <text x={190} y={114} fill="var(--ink)">2 pirüvat</text>
        <text x={190} y={136} fill="var(--muted)">↓ NADH → NAD⁺</text>
        <text x={190} y={158} fill={u >= 1 ? "var(--ink)" : "var(--line-2)"}>{kas ? "2 laktik asit" : "2 etil alkol + 2 CO₂"}</text>
      </g>
      <text x={190} y={196} fontSize={11.5} fontWeight={700} fill={u >= 1 ? (kas ? "var(--muted)" : "var(--c2)") : "transparent"}>
        {kas ? "gaz çıkmadı" : "CO₂ balonu şişirdi"}
      </text>
    </svg>
  );
}

/* ---------- verim ---------- */

function Verim({ v }: SahneProps) {
  const n = v.g ?? 1, f = n * 2;
  const W = (x: number) => (x / 30) * 200;
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={`Fermantasyon: ${n} glikozdan ${f} ATP; oksijenli solunum: 1 glikozdan yaklaşık 30 ATP`}>
      <g>
        <text x={20} y={40} fontSize={12} fontWeight={800} fill="var(--ink)">Oksijenli solunum · 1 glikoz</text>
        <rect x={20} y={50} width={W(30)} height={22} rx={5} fill={ISIK} />
        <text x={28 + W(30)} y={66} fontSize={12} fontWeight={800} fill="var(--ink)">≈30 ATP</text>
      </g>
      <g>
        <text x={20} y={112} fontSize={12} fontWeight={800} fill="var(--ink)">Fermantasyon · {n} glikoz</text>
        <rect x={20} y={122} width={Math.min(W(f), 220)} height={22} rx={5} fill="var(--c2)" fillOpacity={0.75} />
        <text x={28 + Math.min(W(f), 220)} y={138} fontSize={12} fontWeight={800} fill="var(--ink)">{f} ATP</text>
      </g>
      <g>
        {Array.from({ length: n }, (_, i) => (
          <polygon key={i} transform={`translate(${26 + (i % 20) * 15} 176)`} points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill={ISIK} fillOpacity={0.85} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- gece ve gündüz ---------- */

function Ok({ x1, y1, x2, y2, renk, kalin }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), u = 9;
  const p = (d: number) => `${x2 - u * Math.cos(a + d)},${y2 - u * Math.sin(a + d)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6 * Math.cos(a)} y2={y2 - 6 * Math.sin(a)} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} fill={renk} />
    </g>
  );
}

function GeceGunduz({ v }: SahneProps) {
  const gece = (v.gece ?? 0) === 1;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={gece ? "Gece: yalnız solunum; O₂ alır, CO₂ verir" : "Gündüz: fotosentez solunumdan hızlı; net CO₂ alır, O₂ verir"}>
      {gece ? (
        <path d="M44 28 A16 16 0 1 0 62 52 A12 12 0 1 1 44 28 Z" fill="#8a96a8" />
      ) : (
        <g>
          <circle cx={46} cy={40} r={13} fill={ISIK} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={46 + 18 * Math.cos(a)} y1={40 + 18 * Math.sin(a)} x2={46 + 24 * Math.cos(a)} y2={40 + 24 * Math.sin(a)} stroke={ISIK} strokeWidth={2} strokeLinecap="round" />;
          })}
        </g>
      )}
      <g>
        <path d="M170 210 L170 120" stroke={YESIL} strokeWidth={4} strokeLinecap="round" />
        <path d="M170 150 Q130 120 116 140 Q130 168 170 150 Z M170 128 Q210 96 226 116 Q212 146 170 128 Z" fill={YESIL} fillOpacity={0.85} />
        <line x1={110} y1={210} x2={230} y2={210} stroke="var(--line-2)" strokeWidth={2} />
      </g>
      <g fontSize={12} fontWeight={800}>
        {gece ? (
          <g>
            <Ok x1={70} y1={124} x2={112} y2={140} renk={O_RENK} kalin={3} />
            <text x={30} y={118} fill={O_RENK}>O₂ girer</text>
            <Ok x1={232} y1={118} x2={278} y2={100} renk="var(--muted)" kalin={3} />
            <text x={256} y={88} fill="var(--muted)">CO₂ çıkar</text>
          </g>
        ) : (
          <g>
            <Ok x1={66} y1={120} x2={112} y2={138} renk="var(--muted)" kalin={5} />
            <text x={26} y={112} fill="var(--muted)">CO₂ girer</text>
            <Ok x1={232} y1={118} x2={282} y2={98} renk={O_RENK} kalin={5} />
            <text x={258} y={86} fill={O_RENK}>O₂ çıkar</text>
          </g>
        )}
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <text x={330} y={30} textAnchor="end" fill={gece ? "var(--line-2)" : YESIL}>fotosentez {gece ? "yok" : "hızlı"}</text>
        <text x={330} y={48} textAnchor="end" fill="var(--c2)">solunum sürüyor</text>
      </g>
      <text x={170} y={226} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">oklar dışarıyla olan net gaz alışverişini gösterir</text>
    </svg>
  );
}

export const BIYOLOJI8: Record<string, SahneKaydi> = {
  "biy8-denklem": { C: Denklem },
  "biy8-renk": { C: Renk },
  "biy8-engelmann": { C: Engelmann },
  "biy8-evreler": { C: Evreler },
  "biy8-sinirlayici": { C: Sinirlayici },
  "biy8-sicaklik": { C: Sicaklik },
  "biy8-solunum": { C: SolunumYol },
  "biy8-glikoliz": { C: Glikoliz },
  "biy8-krebs": { C: Krebs },
  "biy8-ets": { C: Ets },
  "biy8-fermantasyon": { C: Fermantasyon },
  "biy8-verim": { C: Verim },
  "biy8-gece": { C: GeceGunduz },
};
