"use client";
// Biyoloji sahneleri (enzimler, hücre ve organeller): aktivasyon enerjisi, enzim-substrat kompleksi, özgüllük,
// sıcaklık ve pH eğrileri, doygunluk, yarışmalı inhibitör; hücre haritası (hayvan, bitki, bakteri), enerji
// dönüşümü (kloroplast ve mitokondri) ve salgı proteininin yolu.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

/* ---------- ortak: enzim ve substrat ---------- */

/**
 * Enzim gövdesi; (cx, ust) aktif bölgenin ağzının ortasıdır. k: uyarılmış uyumda ağzın kapanması (0..1).
 * sivri: aktif bölge sivri dipli (özgüllük sahnesinde laktoza göre biçimli).
 */
function enzimYolu(cx: number, ust: number, s = 1, k = 0, sivri = false) {
  const a = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(ust + y * s).toFixed(1)}`;
  const agiz = sivri
    ? [a(-18, 0), a(-18, 12), a(-6, 24), a(6, 24), a(18, 12), a(18, 0)]
    : [a(-22 + 5 * k, 0), a(-18, 26), a(18, 26), a(22 - 5 * k, 0)];
  return (
    `M${a(-70, 48)} C${a(-70, 8)} ${a(-50, 0)} ${a(-30, 0)} L${agiz.join(" L")} L${a(30, 0)} ` +
    `C${a(50, 0)} ${a(70, 8)} ${a(70, 48)} C${a(70, 88)} ${a(40, 104)} ${a(0, 104)} C${a(-40, 104)} ${a(-70, 88)} ${a(-70, 48)} Z`
  );
}

function Enzim({ cx, ust, s = 1, k = 0, sivri = false, renk = "var(--c1)", soluk = false }: { cx: number; ust: number; s?: number; k?: number; sivri?: boolean; renk?: string; soluk?: boolean }) {
  return <path d={enzimYolu(cx, ust, s, k, sivri)} fill={renk} fillOpacity={soluk ? 0.12 : 0.2} stroke={renk} strokeWidth={2} strokeLinejoin="round" />;
}

/** Aktif bölgeye oturan dikdörtgen substrat; (x, y) merkezidir. */
function Substrat({ x, y, s = 1, renk = "var(--c4)" }: { x: number; y: number; s?: number; renk?: string }) {
  return <rect x={x - 17 * s} y={y - 12 * s} width={34 * s} height={24 * s} rx={5 * s} fill={renk} />;
}

/* ---------- aktivasyon enerjisi ---------- */

function egri(tepe: number) {
  return `M40 150 L92 150 C128 150 140 ${tepe} 170 ${tepe} C200 ${tepe} 212 184 248 184 L312 184`;
}

function Aktivasyon({ v }: SahneProps) {
  const enzim = (v.enzim ?? 0) === 1;
  const tepe = enzim ? 104 : 46;
  return (
    <svg viewBox="0 0 340 238" role="img" aria-label={enzim ? "Enzimle aktivasyon enerjisi düşük" : "Enzimsiz aktivasyon enerjisi yüksek"}>
      <line x1={30} y1={24} x2={30} y2={206} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={30} y1={206} x2={322} y2={206} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={36} y={22} fontSize={11.5} fontWeight={700} fill="var(--ink)">enerji</text>
      <text x={322} y={226} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="end">tepkimenin ilerleyişi</text>
      {enzim && <path d={egri(46)} fill="none" stroke="var(--line-2)" strokeWidth={2} strokeDasharray="5 5" />}
      <path key={enzim ? "e" : "y"} className="ad-belir" d={egri(tepe)} fill="none" stroke={enzim ? "var(--biyoloji)" : "var(--c2)"} strokeWidth={3} strokeLinecap="round" />
      <g>
        <line x1={170} y1={148} x2={170} y2={tepe + 6} stroke={enzim ? "var(--biyoloji)" : "var(--c2)"} strokeWidth={1.6} />
        <path d={`M170 ${tepe + 2} l-4 8 h8 Z`} fill={enzim ? "var(--biyoloji)" : "var(--c2)"} />
        <line x1={160} y1={150} x2={180} y2={150} stroke="var(--muted)" strokeDasharray="3 3" />
        <text x={170} y={tepe - 10} fontSize={11.5} fontWeight={700} fill={enzim ? "var(--biyoloji)" : "var(--c2)"} textAnchor="middle">aktivasyon enerjisi</text>
      </g>
      <g>
        <line x1={286} y1={150} x2={318} y2={150} stroke="var(--muted)" strokeDasharray="3 3" />
        <line x1={300} y1={152} x2={300} y2={180} stroke="var(--c5)" strokeWidth={1.6} />
        <path d="M300 184 l-4 -8 h8 Z" fill="var(--c5)" />
        <text x={292} y={136} fontSize={11} fontWeight={700} fill="var(--c5)" textAnchor="middle">enerji farkı</text>
      </g>
      <text x={64} y={140} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">substrat</text>
      <text x={268} y={200} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">ürün</text>
      {enzim && <text x={316} y={30} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">kesikli çizgi: enzimsiz</text>}
    </svg>
  );
}

/* ---------- enzim-substrat kompleksi ---------- */

const EX = 170, EU = 104;
function EnzimSubstrat({ t, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = t / sure;
  const gel = yumusak(u / 0.3);
  const k = u < 0.6 ? yumusak((u - 0.3) / 0.12) : 1 - yumusak((u - 0.7) / 0.15);
  const bag = 1 - sinir((u - 0.45) / 0.1);
  const git = yumusak((u - 0.6) / 0.3);
  const yer = (x0: number, y0: number, x1: number, y1: number, w: number) => [x0 + (x1 - x0) * w, y0 + (y1 - y0) * w];
  const [sx, sy] = yer(70, 34, EX, EU + 13, gel);
  const [lx, ly] = yer(sx - 9, sy, 60, 40, git);
  const [rx, ry] = yer(sx + 9, sy, 280, 40, git);
  const evre = u < 0.3 ? "Enzim + substrat" : u < 0.6 ? "Enzim-substrat kompleksi" : u < 0.95 ? "Ürünler ayrılıyor" : "Enzim değişmeden kaldı";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={evre}>
      <Enzim cx={EX} ust={EU} k={k} />
      <text x={EX} y={176} fontSize={13} fontWeight={800} fill="var(--c1)" textAnchor="middle">enzim</text>
      <g>
        <rect x={lx - 9} y={ly - 12} width={18} height={24} rx={4} fill="var(--c4)" />
        <rect x={rx - 9} y={ry - 12} width={18} height={24} rx={4} fill={git > 0 ? "var(--c2)" : "var(--c4)"} />
        <line x1={sx} y1={sy - 10} x2={sx} y2={sy + 10} stroke="#fff" strokeWidth={3} opacity={git > 0 ? 0 : 1 - bag} />
        <line x1={sx} y1={sy - 6} x2={sx} y2={sy + 6} stroke="var(--c4)" strokeWidth={4} opacity={git > 0 ? 0 : bag} />
      </g>
      {u < 0.3 && <text x={70} y={64} fontSize={12} fontWeight={700} fill="#b7800d" textAnchor="middle">substrat</text>}
      {u >= 0.95 && (
        <g fontSize={12} fontWeight={700} className="ad-belir">
          <text x={60} y={70} fill="var(--muted)" textAnchor="middle">ürün</text>
          <text x={280} y={70} fill="var(--muted)" textAnchor="middle">ürün</text>
        </g>
      )}
      <text x={170} y={24} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{evre}</text>
      {u > 0 && <text x={170} y={222} fontSize={13} fontWeight={700} fill="var(--muted)" textAnchor="middle">E + S → ES → E + ürünler</text>}
    </svg>
  );
}

/* ---------- özgüllük ---------- */

type Madde = { ad: string; sekil: "sivri" | "kare" | "zincir" };
const LAKTOZ_YOLU = "M-18 -12 L18 -12 L18 0 L6 12 L-6 12 L-18 0 Z";

function Molekul({ m, x, y, renk }: { m: Madde; x: number; y: number; renk: string }) {
  if (m.sekil === "sivri") return <path d={LAKTOZ_YOLU} transform={`translate(${x} ${y})`} fill={renk} />;
  if (m.sekil === "kare") return <rect x={x - 18} y={y - 12} width={36} height={24} rx={4} fill={renk} />;
  return <path d={`M${x - 34} ${y} l11 -9 l11 9 l11 -9 l11 9 l11 -9 l12 9`} fill="none" stroke={renk} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />;
}

function Ozgulluk({ s, t, secim, oynuyor }: SahneProps) {
  const maddeler = (s.maddeler as Madde[]) ?? [];
  const sure = typeof s.sure === "number" ? s.sure : 3;
  const u = oynuyor || t > 0 ? t / sure : 0;
  const xs = maddeler.map((_, i) => 170 + (i - (maddeler.length - 1) / 2) * 104);
  const sec = secim !== null && secim !== undefined ? maddeler[secim] : null;
  const uyar = sec?.sekil === "sivri";
  // Seçilen molekül aktif bölgeye iner; uymuyorsa çarpıp geri döner.
  const in_ = yumusak(u / 0.45);
  const geri = uyar ? 0 : yumusak((u - 0.55) / 0.35);
  const hedefY = uyar ? 162 : 136;
  const w = Math.max(0, in_ - geri);
  const bitti = u > 0.95;
  return (
    <svg viewBox="0 0 340 260" role="img" aria-label="Laktaz enzimi ve üç madde">
      <Enzim cx={170} ust={150} sivri renk="var(--biyoloji)" />
      <text x={170} y={224} fontSize={13} fontWeight={800} fill="var(--biyoloji)" textAnchor="middle">laktaz</text>
      {maddeler.map((m, i) => {
        const ben = sec === m;
        const x = ben ? xs[i] + (170 - xs[i]) * w : xs[i];
        const y = ben ? 46 + (hedefY - 46) * w : 46;
        const renk = ben && bitti ? (uyar ? "var(--biyoloji)" : "var(--c2)") : "var(--c4)";
        return (
          <g key={i}>
            <Molekul m={m} x={x} y={y} renk={renk} />
            <text x={xs[i]} y={92} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle" opacity={ben && w > 0.2 ? 0.35 : 1}>{m.ad}</text>
          </g>
        );
      })}
      {bitti && sec && (
        <text className="ad-belir" x={170} y={124} fontSize={12.5} fontWeight={800} fill={uyar ? "var(--biyoloji)" : "var(--c2)"} textAnchor="middle">
          {uyar ? "Tam oturdu: laktoz parçalanır" : "Aktif bölgeye uymuyor"}
        </text>
      )}
    </svg>
  );
}

/* ---------- sıcaklık ---------- */

const GX0 = 52, GX1 = 314, GY0 = 50, GY1 = 196;
const sicakHiz = (T: number) => (T <= 37 ? Math.pow(T / 37, 1.6) : Math.max(0, 1 - Math.pow((T - 37) / 16, 2)));

function Grafik({ xMax, xAdim, xAd, yAd, children }: { xMax: number; xAdim: number; xAd: string; yAd: string; children: React.ReactNode }) {
  const ticks: number[] = [];
  for (let x = 0; x <= xMax; x += xAdim) ticks.push(x);
  return (
    <>
      <g>
        <line x1={GX0} y1={GY0 - 14} x2={GX0} y2={GY1} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={GX0} y1={GY1} x2={GX1} y2={GY1} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={GX0 + 6} y={GY0 - 18} fontSize={11.5} fontWeight={700} fill="var(--ink)">{yAd}</text>
        <text x={GX1} y={GY1 + 34} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="end">{xAd}</text>
        {ticks.map((x) => (
          <text key={x} x={GX0 + (x / xMax) * (GX1 - GX0)} y={GY1 + 16} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{x}</text>
        ))}
      </g>
      {children}
    </>
  );
}

const egriYolu = (f: (x: number) => number, xMax: number) =>
  Array.from({ length: 81 }, (_, i) => {
    const x = (i / 80) * xMax;
    return `${i ? "L" : "M"}${(GX0 + (x / xMax) * (GX1 - GX0)).toFixed(1)} ${(GY1 - f(x) * (GY1 - GY0)).toFixed(1)}`;
  }).join(" ");

function Sicaklik({ v }: SahneProps) {
  const T = v.T ?? 20, h = sicakHiz(T);
  const px = GX0 + (T / 80) * (GX1 - GX0), py = GY1 - h * (GY1 - GY0);
  const durum = T > 45 ? "Denatüre oldu: şekli bozuldu" : T < 30 ? "Soğuk: yavaş ama sağlam" : T >= 35 && T <= 39 ? "Optimum: en hızlı" : "Çalışıyor";
  const renk = T > 45 ? "var(--c2)" : T >= 35 && T <= 39 ? "var(--biyoloji)" : "var(--c1)";
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${T} derece, hız yüzde ${Math.round(h * 100)}`}>
      <Grafik xMax={80} xAdim={10} xAd="sıcaklık (°C)" yAd="tepkime hızı">
        <path d={egriYolu(sicakHiz, 80)} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
      </Grafik>
      <line x1={px} y1={GY1} x2={px} y2={py} stroke={renk} strokeDasharray="3 3" />
      <circle cx={px} cy={py} r={7} fill={renk} />
      <text x={GX1} y={24} fontSize={13} fontWeight={800} fill={renk} textAnchor="end">{durum}</text>
      <text x={GX1} y={42} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="end">{T} °C · hız %{Math.round(h * 100)}</text>
    </svg>
  );
}

/* ---------- pH ---------- */

const ENZIMLER_PH = [
  { ad: "pepsin (mide)", tepe: 2, renk: "var(--c2)" },
  { ad: "tripsin (ince bağırsak)", tepe: 8, renk: "var(--c1)" },
];
const phHiz = (p: number, tepe: number) => Math.exp(-Math.pow((p - tepe) / 1.5, 2));

function Ph({ v }: SahneProps) {
  const p = v.ph ?? 7;
  const px = GX0 + (p / 14) * (GX1 - GX0);
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`pH ${p}`}>
      <Grafik xMax={14} xAdim={2} xAd="pH" yAd="tepkime hızı">
        {ENZIMLER_PH.map((e) => <path key={e.ad} d={egriYolu((x) => phHiz(x, e.tepe), 14)} fill="none" stroke={e.renk} strokeWidth={2.5} strokeOpacity={0.55} />)}
      </Grafik>
      <line x1={px} y1={GY0 - 6} x2={px} y2={GY1} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="3 3" />
      {ENZIMLER_PH.map((e) => <circle key={e.ad} cx={px} cy={GY1 - phHiz(p, e.tepe) * (GY1 - GY0)} r={6} fill={e.renk} />)}
      <g fontSize={11.5} fontWeight={700}>
        <text x={GX0} y={GY1 + 34} fill="var(--c2)">asidik</text>
        <text x={GX0 + (7 / 14) * (GX1 - GX0)} y={GY1 + 34} fill="var(--muted)" textAnchor="middle">nötr</text>
      </g>
      <g fontSize={12} fontWeight={700}>
        {ENZIMLER_PH.map((e, i) => (
          <text key={e.ad} x={GX1} y={18 + i * 17} fill={e.renk} textAnchor="end">{e.ad}: %{Math.round(phHiz(p, e.tepe) * 100)}</text>
        ))}
      </g>
    </svg>
  );
}

/* ---------- doygunluk ve yarışmalı inhibitör ---------- */

const KX = [58, 134, 210, 286], KU = 108, KS = 0.42;
const BEKLE = [[30, 30], [92, 22], [154, 34], [216, 22], [278, 32], [62, 62], [124, 58], [186, 64], [248, 58], [310, 60], [20, 70], [320, 24], [100, 82], [230, 84], [168, 86], [300, 86]];

function Doygunluk({ v }: SahneProps) {
  const n = v.s ?? 0, dolu = Math.min(n, 4), bos = n - dolu;
  const hiz = dolu / 4;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${n} substrat, ${dolu} enzim dolu`}>
      {KX.map((x) => <Enzim key={x} cx={x} ust={KU} s={KS} />)}
      <g>
        {KX.slice(0, dolu).map((x) => <Substrat key={x} x={x} y={KU + 5.5} s={KS} />)}
        {Array.from({ length: bos }, (_, i) => <Substrat key={i} x={BEKLE[i][0]} y={BEKLE[i][1]} s={KS} />)}
      </g>
      <text x={170} y={176} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {dolu === 4 && bos > 0 ? `4 aktif bölge dolu, ${bos} substrat sırada bekliyor` : `${dolu} / 4 aktif bölge dolu`}
      </text>
      <g>
        <text x={20} y={214} fontSize={12} fontWeight={700} fill="var(--ink)">hız</text>
        <rect x={52} y={202} width={260} height={16} rx={8} fill="var(--line)" />
        <rect x={52} y={202} width={Math.max(0.001, 260 * hiz)} height={16} rx={8} fill="var(--biyoloji)" style={{ transition: "width .3s" }} />
        <text x={312} y={240} fontSize={11.5} fill="var(--muted)" textAnchor="end">en yüksek hız</text>
      </g>
    </svg>
  );
}

const INH = 4;
function Inhibitor({ v }: SahneProps) {
  const n = v.s ?? 4;
  const sub = Math.round((4 * n) / (n + INH)), inh = 4 - sub;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${n} substrat, ${INH} inhibitör: ${sub} enzim çalışıyor`}>
      {KX.map((x, i) => <Enzim key={x} cx={x} ust={KU} s={KS} renk={i < sub ? "var(--c1)" : "var(--muted)"} soluk={i >= sub} />)}
      <g>
        {KX.map((x, i) =>
          i < sub ? <Substrat key={x} x={x} y={KU + 5.5} s={KS} /> : <Substrat key={x} x={x} y={KU + 5.5} s={KS} renk="#7d8da3" />,
        )}
        {Array.from({ length: Math.min(n - sub, BEKLE.length - (INH - inh)) }, (_, i) => <Substrat key={`s${i}`} x={BEKLE[i][0]} y={BEKLE[i][1]} s={KS} />)}
        {Array.from({ length: INH - inh }, (_, i) => {
          const [x, y] = BEKLE[BEKLE.length - 1 - i];
          return <Substrat key={`i${i}`} x={x} y={y} s={KS} renk="#7d8da3" />;
        })}
      </g>
      <g fontSize={12} fontWeight={700}>
        <rect x={20} y={164} width={14} height={10} rx={2} fill="var(--c4)" />
        <text x={40} y={173} fill="var(--ink)">substrat: {n}</text>
        <rect x={180} y={164} width={14} height={10} rx={2} fill="#7d8da3" />
        <text x={200} y={173} fill="var(--ink)">inhibitör: {INH}</text>
      </g>
      <g>
        <text x={20} y={214} fontSize={12} fontWeight={700} fill="var(--ink)">hız</text>
        <rect x={52} y={202} width={260} height={16} rx={8} fill="var(--line)" />
        <rect x={52} y={202} width={Math.max(0.001, (260 * sub) / 4)} height={16} rx={8} fill="var(--biyoloji)" style={{ transition: "width .3s" }} />
        <text x={312} y={240} fontSize={11.5} fill="var(--muted)" textAnchor="end">{sub} / 4 enzim substratla çalışıyor</text>
      </g>
    </svg>
  );
}

/* ---------- hücre haritası ---------- */

const Ribozomlar = ({ noktalar }: { noktalar: number[][] }) => (
  <g>{noktalar.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill="var(--c5)" />)}</g>
);

function Mitokondri({ x, y, aci = 0, s = 1 }: { x: number; y: number; aci?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci}) scale(${s})`}>
      <ellipse rx={24} ry={12} fill="#fde3d6" stroke="var(--c2)" strokeWidth={2} />
      <path d="M-16 6 L-12 -6 L-6 6 L0 -6 L6 6 L12 -6 L16 4" fill="none" stroke="var(--c2)" strokeWidth={1.4} />
    </g>
  );
}

function Kloroplast({ x, y, aci = 0 }: { x: number; y: number; aci?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci})`}>
      <ellipse rx={20} ry={11} fill="#d4f0dd" stroke="var(--biyoloji)" strokeWidth={2} />
      {[-9, 0, 9].map((d) => <rect key={d} x={d - 3} y={-5} width={6} height={10} rx={1.5} fill="var(--biyoloji)" />)}
    </g>
  );
}

function Golgi({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke="var(--c4)" strokeWidth={3.2} strokeLinecap="round">
      {[0, 7, 14, 21].map((d) => <path key={d} d={`M${x - 20 + d / 3} ${y + d} Q${x} ${y + d - 10} ${x + 20 - d / 3} ${y + d}`} />)}
    </g>
  );
}

function Cekirdek({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#e8e3f7" stroke="var(--c5)" strokeWidth={2} strokeDasharray="14 3" />
      <circle cx={x} cy={y} r={r - 4} fill="none" stroke="var(--c5)" strokeWidth={1} strokeDasharray="14 3" />
      <circle cx={x + 6} cy={y - 4} r={8} fill="var(--c5)" opacity={0.75} />
    </g>
  );
}

const ER = (x: number, y: number) => (
  <g>
    <path d={`M${x} ${y} q12 -8 0 -16 q-12 -8 0 -16 M${x + 10} ${y + 6} q14 -11 0 -22 q-14 -11 0 -22 q14 -11 0 -22`} fill="none" stroke="var(--c1)" strokeWidth={2.4} strokeLinecap="round" />
  </g>
);

type Organel = { id: string; ad: string; x: number; y: number };
// Etiketin konumu; hayvan hücresinde organellerin merkezleri.
const HAYVAN: Organel[] = [
  { id: "cekirdek", ad: "çekirdek", x: 150, y: 114 },
  { id: "mitokondri", ad: "mitokondri", x: 82, y: 82 },
  { id: "golgi", ad: "Golgi aygıtı", x: 246, y: 92 },
  { id: "lizozom", ad: "lizozom", x: 252, y: 160 },
  { id: "er", ad: "granüllü ER", x: 205, y: 104 },
  { id: "sentrozom", ad: "sentrozom", x: 96, y: 160 },
];

function HayvanHucresi({ etiket, vurgu }: { etiket: boolean; vurgu: Record<string, string> }) {
  const halka = (id: string, rx: number, ry = rx) => {
    const o = HAYVAN.find((h) => h.id === id)!;
    return vurgu[id] ? <ellipse className="ad-belir" cx={o.x} cy={o.y} rx={rx} ry={ry} fill="none" stroke={vurgu[id]} strokeWidth={3} /> : null;
  };
  return (
    <g>
      <ellipse cx={170} cy={120} rx={156} ry={96} fill="#fbf7ee" stroke="var(--c4)" strokeWidth={2.5} />
      <Cekirdek x={150} y={114} />
      {ER(190, 136)}
      <Ribozomlar noktalar={[[186, 112], [196, 96], [186, 80], [212, 126], [214, 90], [118, 60], [236, 196], [70, 128], [276, 120], [120, 198]]} />
      <Golgi x={246} y={84} />
      <Mitokondri x={82} y={82} aci={-20} />
      <Mitokondri x={186} y={188} aci={10} />
      <g>
        {[[252, 160], [276, 148]].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={10} fill="#fdebf0" stroke="var(--kimya)" strokeWidth={1.8} />
            <circle cx={x - 3} cy={y - 2} r={1.6} fill="var(--kimya)" /><circle cx={x + 3} cy={y + 2} r={1.6} fill="var(--kimya)" />
          </g>
        ))}
      </g>
      <g fill="var(--ink)">
        <rect x={86} y={156} width={14} height={6} rx={2} /><rect x={102} y={150} width={6} height={14} rx={2} />
      </g>
      {halka("mitokondri", 32, 22)}
      {halka("golgi", 30, 24)}
      {halka("lizozom", 22, 22)}
      {halka("cekirdek", 38, 38)}
      {halka("sentrozom", 16, 16)}
      {etiket && (
        <g fontSize={11.5} fontWeight={700} fill="var(--ink)">
          <text x={150} y={158} textAnchor="middle">çekirdek</text>
          <text x={82} y={110} textAnchor="middle">mitokondri</text>
          <text x={246} y={74} textAnchor="middle">Golgi</text>
          <text x={246} y={186} textAnchor="middle">lizozom</text>
          <text x={96} y={186} textAnchor="middle">sentrozom</text>
          <text x={226} y={130} textAnchor="start">ER</text>
        </g>
      )}
    </g>
  );
}

function BitkiHucresi({ etiket }: { etiket: boolean }) {
  return (
    <g>
      <rect x={18} y={20} width={304} height={200} rx={12} fill="none" stroke="var(--biyoloji)" strokeWidth={7} />
      <rect x={26} y={28} width={288} height={184} rx={8} fill="#fbf7ee" stroke="var(--c4)" strokeWidth={2} />
      <rect x={110} y={52} width={150} height={136} rx={30} fill="#e3f0fb" stroke="var(--c1)" strokeWidth={1.8} />
      <Cekirdek x={66} y={70} r={24} />
      <Kloroplast x={64} y={178} aci={-15} />
      <Kloroplast x={286} y={64} aci={25} />
      <Kloroplast x={290} y={178} aci={-30} />
      <Kloroplast x={160} y={200} aci={5} />
      <Mitokondri x={70} y={140} aci={70} s={0.8} />
      <Golgi x={286} y={112} />
      <Ribozomlar noktalar={[[100, 40], [44, 108], [230, 40], [240, 202], [96, 200], [302, 140]]} />
      {etiket && (
        <g fontSize={11.5} fontWeight={700}>
          <text x={185} y={116} fill="var(--c1)" textAnchor="middle">büyük merkezi koful</text>
          <text x={185} y={14} fill="var(--biyoloji)" textAnchor="middle">hücre duvarı (selüloz)</text>
          <text x={276} y={44} fill="var(--biyoloji)" textAnchor="middle">kloroplast</text>
          <text x={66} y={108} fill="var(--ink)" textAnchor="middle">çekirdek</text>
        </g>
      )}
    </g>
  );
}

function BakteriHucresi({ etiket }: { etiket: boolean }) {
  return (
    <g>
      <rect x={40} y={60} width={250} height={110} rx={55} fill="none" stroke="var(--c4)" strokeWidth={6} strokeOpacity={0.5} />
      <rect x={45} y={65} width={240} height={100} rx={50} fill="#fbf7ee" stroke="var(--c4)" strokeWidth={2} />
      <path d="M290 115 q14 -14 24 0 t20 0" fill="none" stroke="var(--c4)" strokeWidth={2} />
      <path d="M130 112 q10 -22 26 -6 t22 -2 t24 10 q-6 24 -30 14 t-26 4 t-16 -20" fill="none" stroke="var(--c5)" strokeWidth={2.4} />
      <Ribozomlar noktalar={[[86, 104], [96, 136], [240, 92], [252, 132], [126, 90], [236, 150], [76, 122], [264, 112]]} />
      {etiket && (
        <g fontSize={11.5} fontWeight={700}>
          <text x={170} y={150} fill="var(--c5)" textAnchor="middle">DNA (sitoplazmada)</text>
          <text x={170} y={48} fill="#b7800d" textAnchor="middle">hücre duvarı ve hücre zarı</text>
          <text x={96} y={92} fill="var(--c5)" textAnchor="middle">ribozom</text>
        </g>
      )}
    </g>
  );
}

function Hucre({ s, v, t, secim, oynuyor }: SahneProps) {
  const tip = v.bakteri === 1 ? "bakteri" : v.bitki === 1 ? "bitki" : ((s.tip as string) ?? "hayvan");
  const etiket = s.etiket === true;
  const ids = (s.organeller as string[]) ?? [];
  const sure = typeof s.sure === "number" ? s.sure : 2;
  const u = oynuyor || t > 0 ? t / sure : 0;
  const vurgu: Record<string, string> = {};
  let not = "";
  if (secim !== null && secim !== undefined && ids[secim]) {
    const dogru = s.dogru as string, sec = ids[secim];
    vurgu[sec] = u > 0.5 && sec !== dogru ? "var(--c2)" : "var(--ink)";
    if (u > 0.5) vurgu[dogru] = "var(--biyoloji)";
    if (u > 0.5) not = HAYVAN.find((h) => h.id === dogru)?.ad ?? "";
  }
  const baslik = tip === "bakteri" ? "Bakteri (prokaryot)" : tip === "bitki" ? "Bitki hücresi" : "Hayvan hücresi";
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={baslik}>
      <g key={tip} className="ad-belir">
        {tip === "hayvan" && <HayvanHucresi etiket={etiket} vurgu={vurgu} />}
        {tip === "bitki" && <BitkiHucresi etiket={etiket} />}
        {tip === "bakteri" && <BakteriHucresi etiket={etiket} />}
      </g>
      <text x={170} y={244} fontSize={13} fontWeight={800} fill={not ? "var(--biyoloji)" : "var(--ink)"} textAnchor="middle">{not ? `Doğrusu: ${not}` : baslik}</text>
    </svg>
  );
}

/* ---------- enerji: kloroplast ve mitokondri ---------- */

function Enerji({ v }: SahneProps) {
  const isik = (v.karanlik ?? 0) === 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={isik ? "Işıkta kloroplast ve mitokondri çalışıyor" : "Karanlıkta yalnızca mitokondri çalışıyor"}>
      <g opacity={isik ? 1 : 0.18}>
        <circle cx={60} cy={34} r={14} fill="var(--c4)" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={60 + Math.cos(a) * 19} y1={34 + Math.sin(a) * 19} x2={60 + Math.cos(a) * 26} y2={34 + Math.sin(a) * 26} stroke="var(--c4)" strokeWidth={2.5} strokeLinecap="round" />;
        })}
      </g>
      <g opacity={isik ? 1 : 0.3}>
        <g transform="translate(86 110) scale(2.2)"><Kloroplast x={0} y={0} /></g>
        <text x={86} y={156} fontSize={13} fontWeight={800} fill="var(--biyoloji)" textAnchor="middle">kloroplast</text>
        <text x={86} y={176} fontSize={11.5} fill="var(--muted)" textAnchor="middle">ışık + CO₂ + su</text>
        <text x={86} y={192} fontSize={11.5} fill="var(--muted)" textAnchor="middle">→ glikoz + O₂</text>
      </g>
      <g>
        <Mitokondri x={256} y={110} s={2.1} />
        <text x={256} y={156} fontSize={13} fontWeight={800} fill="var(--c2)" textAnchor="middle">mitokondri</text>
        <text x={256} y={176} fontSize={11.5} fill="var(--muted)" textAnchor="middle">glikoz + O₂</text>
        <text x={256} y={192} fontSize={11.5} fill="var(--muted)" textAnchor="middle">→ ATP + CO₂ + su</text>
      </g>
      <g opacity={isik ? 1 : 0.3}>
        <path d="M140 96 Q170 76 198 96" fill="none" stroke="var(--ink)" strokeWidth={1.6} />
        <path d="M200 98 l-9 -1 l5 -7 Z" fill="var(--ink)" />
        <text x={170} y={72} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">glikoz + O₂</text>
      </g>
      <text x={170} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill={isik ? "var(--biyoloji)" : "var(--c1)"}>
        {isik ? "Gündüz: ikisi de çalışıyor" : "Gece: fotosentez durur, ATP üretimi sürer"}
      </text>
    </svg>
  );
}

/* ---------- salgı proteininin yolu ---------- */

const DURAK = [
  { ad: "çekirdek", x: 58 },
  { ad: "ribozom + ER", x: 132 },
  { ad: "Golgi", x: 216 },
  { ad: "hücre dışı", x: 306 },
];
// Proteinin yolu: (u, x, y) noktaları.
const YOL: [number, number, number][] = [
  [0, 58, 104], [0.14, 104, 104], [0.22, 128, 92], [0.36, 140, 116], [0.46, 178, 98], [0.56, 210, 100],
  [0.68, 222, 118], [0.82, 246, 108], [0.9, 262, 104], [1, 306, 96],
];
function yolNoktasi(u: number) {
  for (let i = 1; i < YOL.length; i++) {
    const [u0, x0, y0] = YOL[i - 1], [u1, x1, y1] = YOL[i];
    if (u <= u1) { const w = yumusak((u - u0) / (u1 - u0)); return [x0 + (x1 - x0) * w, y0 + (y1 - y0) * w]; }
  }
  return [YOL[YOL.length - 1][1], YOL[YOL.length - 1][2]];
}

function SalgiYolu({ t, s, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = oynuyor || t > 0 ? t / sure : 0;
  const [x, y] = yolNoktasi(u);
  const asama = u === 0 ? -1 : u < 0.16 ? 0 : u < 0.46 ? 1 : u < 0.82 ? 2 : 3;
  const kesecik = (u > 0.4 && u < 0.58) || (u > 0.74 && u < 0.92);
  const mrna = u > 0 && u < 0.2;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Salgı proteininin hücredeki yolu">
      <path d="M272 24 Q260 110 272 200" fill="none" stroke="var(--c4)" strokeWidth={3} />
      <Cekirdek x={58} y={104} r={34} />
      <g transform="translate(0 4)">{ER(124, 130)}</g>
      <Ribozomlar noktalar={[[128, 92], [142, 80], [128, 66], [144, 120], [146, 98]]} />
      <Golgi x={216} y={92} />
      <Mitokondri x={150} y={176} aci={-8} />
      <text x={150} y={204} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="middle">ATP sağlar</text>
      {kesecik && <circle cx={x} cy={y} r={11} fill="none" stroke="var(--c4)" strokeWidth={2} />}
      {u > 0 && (mrna
        ? <path d={`M${x - 10} ${y} q5 -6 10 0 t10 0`} fill="none" stroke="var(--c5)" strokeWidth={2.5} strokeLinecap="round" />
        : <circle cx={x} cy={y} r={6} fill="var(--c5)" />)}
      <g fontSize={11.5} fontWeight={700}>
        {DURAK.map((d, i) => (
          <text key={d.ad} x={d.x} y={i === 3 ? 140 : 160} textAnchor="middle" fill={asama === i ? "var(--biyoloji)" : "var(--muted)"}>{d.ad}</text>
        ))}
      </g>
      <text x={170} y={230} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {asama < 0 ? "Pankreas hücresi insülin salgılayacak" : asama === 0 ? "DNA'nın bilgisi mRNA ile çıkıyor" : asama === 1 ? "Ribozomda protein yapılıyor, ER'de taşınıyor" : asama === 2 ? "Golgi paketliyor, kesecikle yolluyor" : "Kesecik zarla kaynaştı: ekzositoz"}
      </text>
    </svg>
  );
}

export const BIYOLOJI2: Record<string, SahneKaydi> = {
  "biy2-aktivasyon": { C: Aktivasyon },
  "biy2-enzim-substrat": { C: EnzimSubstrat },
  "biy2-ozgulluk": { C: Ozgulluk },
  "biy2-sicaklik": { C: Sicaklik },
  "biy2-ph": { C: Ph },
  "biy2-doygunluk": { C: Doygunluk },
  "biy2-inhibitor": { C: Inhibitor },
  "biy2-hucre": { C: Hucre },
  "biy2-enerji": { C: Enerji },
  "biy2-salgi-yolu": { C: SalgiYolu },
};
