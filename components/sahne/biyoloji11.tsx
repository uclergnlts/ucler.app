"use client";
// Biyoloji sahneleri (sindirim, dolaşım ve bağışıklık): lokmanın sindirim kanalındaki yolculuğu, çiğneme ve yüzey,
// besinlerin sindirime başladığı yer, enzim ve pH, safra ve yağ damlaları, villusların yüzeyi, kana ve lenfe emilim;
// büyük ve küçük dolaşım, kapakçıklar, kalp hızı, kanın bileşenleri, damarlarda basınç ve hız, kan grupları, aşı yanıtı.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";
const virgul = (x: number, b = 2) => x.toFixed(b).replace(".", ",");

type Nokta = [number, number];

/** Kırık çizginin toplam uzunluğu. */
function uzunluk(p: Nokta[]) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return L;
}

/** Kırık çizgi üzerinde uzunluğa göre u (0..1) noktası. */
function noktaAl(p: Nokta[], u: number): Nokta {
  const hedef = sinir(u) * uzunluk(p);
  let gecen = 0;
  for (let i = 1; i < p.length; i++) {
    const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (gecen + l >= hedef && l > 0) {
      const k = (hedef - gecen) / l;
      return [ara(p[i - 1][0], p[i][0], k), ara(p[i - 1][1], p[i][1], k)];
    }
    gecen += l;
  }
  return p[p.length - 1];
}

const nokt = (p: Nokta[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

/* ---------- lokmanın yolculuğu ---------- */

const KANAL: { ad: string; pay: number; yol: Nokta[]; not: string }[] = [
  { ad: "ağız", pay: 0.1, yol: [[170, 12], [170, 28]], not: "Ağız: dişler öğütür, amilaz nişastaya başlar" },
  { ad: "yemek borusu", pay: 0.1, yol: [[170, 28], [170, 68]], not: "Yemek borusu: peristaltik hareket lokmayı iter" },
  { ad: "mide", pay: 0.17, yol: [[170, 68], [184, 86], [206, 90], [224, 94]], not: "Mide: HCl ve pepsin; lokma kimusa dönüşür" },
  {
    ad: "ince bağırsak", pay: 0.36,
    yol: [[224, 94], [230, 108], [214, 116], [198, 134], [150, 134], [150, 146], [208, 146], [208, 158], [150, 158], [150, 170], [208, 170], [208, 182], [134, 182]],
    not: "İnce bağırsak: sindirim biter, besinler emilir",
  },
  { ad: "kalın bağırsak", pay: 0.21, yol: [[134, 182], [122, 182], [122, 124], [238, 124], [238, 198]], not: "Kalın bağırsak: su ve mineraller emilir" },
  { ad: "anüs", pay: 0.06, yol: [[238, 198], [238, 212]], not: "Anüs: artıklar dışkı olarak atılır" },
];

function Kanal({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  let kalan = u, etkin = -1, yerel = 0;
  if (u > 0) {
    for (let i = 0; i < KANAL.length; i++) {
      if (kalan <= KANAL[i].pay || i === KANAL.length - 1) { etkin = i; yerel = sinir(kalan / KANAL[i].pay); break; }
      kalan -= KANAL[i].pay;
    }
  }
  const lokma: Nokta = etkin < 0 ? KANAL[0].yol[0] : noktaAl(KANAL[etkin].yol, yerel);
  const salgi = etkin === 3 && yerel < 0.3 ? yerel / 0.3 : -1;
  const renk = (i: number) => (i === etkin ? YESIL : "var(--line-2)");
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Sindirim kanalı: ağız, yemek borusu, mide, ince bağırsak, kalın bağırsak, anüs; yanda karaciğer, safra kesesi, pankreas ve tükürük bezi">
      {/* yardımcı organlar */}
      <ellipse cx={150} cy={20} rx={9} ry={5} fill={MOR} fillOpacity={0.35} stroke={MOR} strokeWidth={1.2} />
      <line x1={159} y1={20} x2={166} y2={20} stroke={MOR} strokeWidth={1.2} strokeDasharray="2 2" />
      <path d="M96 70 Q100 56 132 58 Q166 60 168 72 Q166 94 140 100 Q104 104 96 90 Z" fill={KIRMIZI} fillOpacity={0.22} stroke={KIRMIZI} strokeWidth={1.4} />
      <ellipse cx={150} cy={106} rx={8} ry={5} fill={YESIL} fillOpacity={0.4} stroke={YESIL} strokeWidth={1.2} />
      <path d="M158 108 Q186 112 214 114" fill="none" stroke={YESIL} strokeWidth={1.2} strokeDasharray="3 2" />
      <path d="M234 104 Q262 98 292 104 Q294 112 262 112 Q244 114 234 110 Z" fill={SARI} fillOpacity={0.35} stroke={SARI} strokeWidth={1.4} />
      <line x1={234} y1={108} x2={229} y2={108} stroke={SARI} strokeWidth={1.4} strokeDasharray="2 2" />
      {salgi >= 0 && (
        <g>
          <circle cx={ara(160, 212, salgi)} cy={ara(108, 114, salgi)} r={2.6} fill={YESIL} />
          <circle cx={ara(262, 230, salgi)} cy={108} r={2.6} fill={SARI} />
        </g>
      )}
      {/* sindirim kanalı */}
      {KANAL.map((o, i) =>
        o.ad === "mide" ? null : (
          <polyline key={o.ad} points={nokt(o.yol)} fill="none" stroke={renk(i)} strokeOpacity={i === etkin ? 0.6 : 1} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        ),
      )}
      <path d="M166 64 Q168 100 204 100 Q230 100 228 86 Q224 66 200 70 Q186 74 178 62 Z" fill={etkin === 2 ? YESIL : "var(--line-2)"} fillOpacity={etkin === 2 ? 0.45 : 1} />
      <circle cx={lokma[0]} cy={lokma[1]} r={ara(5.5, 3, sinir(u))} fill="#8a5a2b" stroke="#fff" strokeWidth={1.2} />
      <g fontSize={10.5} fontWeight={700} fill="var(--muted)">
        <text x={180} y={17} fill={etkin === 0 ? YESIL : "var(--muted)"}>ağız</text>
        <text x={138} y={24} textAnchor="end">tükürük bezi</text>
        <text x={180} y={50} fill={etkin === 1 ? YESIL : "var(--muted)"}>yemek borusu</text>
        <text x={130} y={84} textAnchor="middle" fill="var(--ink)">karaciğer</text>
        <text x={140} y={115} textAnchor="end">safra kesesi</text>
        <text x={202} y={86} textAnchor="middle" fill={etkin === 2 ? "var(--ink)" : "var(--muted)"}>mide</text>
        <text x={264} y={96} textAnchor="middle">pankreas</text>
        <text x={246} y={150} fill={etkin === 4 ? YESIL : "var(--muted)"}>kalın bağırsak</text>
        <text x={176} y={200} textAnchor="middle" fill={etkin === 3 ? YESIL : "var(--muted)"}>ince bağırsak</text>
        <text x={246} y={212} fill={etkin === 5 ? YESIL : "var(--muted)"}>anüs</text>
      </g>
      <text x={170} y={230} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {etkin < 0 ? "Lokma ağızda, yolculuk başlıyor" : u >= 1 ? "Yolculuk bitti: pankreas ve karaciğerin içinden geçmedi" : salgi >= 0 ? "Onikiparmağa safra ve pankreas sıvısı dökülüyor" : KANAL[etkin].not}
      </text>
    </svg>
  );
}

/* ---------- çiğneme ve yüzey ---------- */

function Yuzey({ v }: SahneProps) {
  const n = Math.round(sinir(v.n ?? 1, 1, 4));
  const S = 72, g = n > 1 ? 4 : 0, c = (S - g * (n - 1)) / n;
  const cx = 100, cy = 104;
  const P = (x: number, y: number, z: number) => `${cx + (x - z) * 0.866},${cy + (x + z) * 0.5 - y}`;
  const kupler: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) kupler.push({ x: i * (c + g), y: j * (c + g), z: k * (c + g) });
  kupler.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z));
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`Lokma ${n * n * n} parçaya bölündü; toplam yüzey ${n} katı, madde yine nişasta`}>
      {kupler.map(({ x, y, z }, i) => (
        <g key={i} strokeWidth={0.8} stroke="#fff" strokeLinejoin="round">
          <polygon points={`${P(x, y + c, z)} ${P(x + c, y + c, z)} ${P(x + c, y + c, z + c)} ${P(x, y + c, z + c)}`} fill="#f6b93f" />
          <polygon points={`${P(x + c, y, z)} ${P(x + c, y + c, z)} ${P(x + c, y + c, z + c)} ${P(x + c, y, z + c)}`} fill="#e3a019" />
          <polygon points={`${P(x, y, z + c)} ${P(x + c, y, z + c)} ${P(x + c, y + c, z + c)} ${P(x, y + c, z + c)}`} fill="#c98a12" />
        </g>
      ))}
      <g fontSize={11.5} fontWeight={700}>
        <text x={204} y={46} fill="var(--muted)">Parça sayısı</text>
        <text x={204} y={66} fontSize={18} fontWeight={800} fill="var(--ink)">{n * n * n}</text>
        <text x={204} y={98} fill="var(--muted)">Toplam yüzey</text>
        <rect x={204} y={106} width={120} height={12} rx={6} fill="var(--line)" />
        <rect x={204} y={106} width={30 * n} height={12} rx={6} fill={YESIL} />
        <text x={204} y={136} fontSize={18} fontWeight={800} fill={YESIL}>×{n}</text>
        <text x={204} y={166} fill="var(--muted)">Molekül</text>
        <text x={204} y={184} fontSize={13} fontWeight={800} fill="var(--ink)">hâlâ nişasta</text>
      </g>
      <text x={170} y={212} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {n === 1 ? "Tek parça lokma: enzim yalnızca dış yüzeye değer" : `Yüzey ${n} katına çıktı; enzimin değdiği yer arttı`}
      </text>
    </svg>
  );
}

/* ---------- hangi besin nerede başlar ---------- */

const BESIN = [
  { ad: "Karbonhidrat", n: 8, renk: MAVI, urun: "monosakkarit (çoğu glikoz)" },
  { ad: "Protein", n: 8, renk: MOR, urun: "amino asitler" },
  { ad: "Yağ", n: 4, renk: SARI, urun: "yağ asitleri ve gliserol" },
];
const BOLGE = [
  { ad: "ağız", x0: 14, x1: 84 },
  { ad: "yemek b.", x0: 84, x1: 120 },
  { ad: "mide", x0: 120, x1: 206 },
  { ad: "ince bağırsak", x0: 206, x1: 326 },
];
/** Besin x konumundayken kırılan bağların oranı. */
function kirilma(b: number, x: number) {
  const ince = sinir((x - 206) / 84);
  if (b === 0) return x < 206 ? 0.3 * sinir((x - 30) / 54) : ara(0.3, 1, ince);
  if (b === 1) return x < 206 ? 0.5 * sinir((x - 120) / 86) : ara(0.5, 1, ince);
  return ince;
}
const BASLA = [30, 120, 206];
function enzimYazi(b: number, x: number) {
  if (b === 0) return x < 84 ? "tükürük amilazı nişastayı parçalıyor" : x < 206 ? "mide asidinde amilaz durdu" : "pankreas amilazı ve maltaz bitiriyor";
  if (b === 1) return x < 120 ? "değişmeden geçiyor" : x < 206 ? "pepsin proteini parçalıyor" : "tripsin ve peptidazlar bitiriyor";
  return x < 206 ? "değişmeden geçiyor" : "safra damlacıklara ayırıyor, lipaz parçalıyor";
}

function Baslangic({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const b = Math.round(sinir((v.b ?? 1) - 1, 0, 2));
  const B = BESIN[b];
  const x = ara(30, 300, u);
  const p = kirilma(b, x);
  const bag = B.n - 1, kirik = Math.round(p * bag);
  // kırılan bağları zincire eşit yay
  const sirala = bag === 7 ? [3, 1, 5, 0, 2, 4, 6] : [1, 0, 2];
  const kopuk = new Set(sirala.slice(0, kirik));
  const r = 8, ad = 19, bosluk = 12;
  const gen = B.n * ad + kopuk.size * bosluk - (ad - 2 * r);
  let xx = 170 - gen / 2 + r;
  const boncuk: number[] = [];
  for (let i = 0; i < B.n; i++) { boncuk.push(xx); xx += ad + (kopuk.has(i) ? bosluk : 0); }
  const bitti = u >= 1;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${B.ad}: kimyasal sindirimi ${["ağızda", "midede", "ince bağırsakta"][b]} başlar, ince bağırsakta biter`}>
      {BOLGE.map((z, i) => (
        <g key={z.ad}>
          <rect x={z.x0} y={i === 1 ? 52 : 34} width={z.x1 - z.x0} height={i === 1 ? 20 : 56} rx={i === 1 ? 4 : 12} fill={x >= z.x0 && x < z.x1 && u > 0 ? "var(--biyoloji-soft)" : "var(--panel)"} stroke="var(--line-2)" />
          <text x={(z.x0 + z.x1) / 2} y={i === 1 ? 26 : 26} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{z.ad}</text>
        </g>
      ))}
      {u > 0 && x >= BASLA[b] && (
        <g>
          <line x1={BASLA[b]} y1={34} x2={BASLA[b]} y2={90} stroke={B.renk} strokeWidth={2} strokeDasharray="3 3" />
          <text x={BASLA[b] + 3} y={102} fontSize={10.5} fontWeight={800} fill={B.renk}>başladı</text>
        </g>
      )}
      <circle cx={x} cy={62} r={7} fill={B.renk} stroke="#fff" strokeWidth={1.5} />
      <g>
        {boncuk.map((bx, i) => (
          <g key={i}>
            {i < B.n - 1 && !kopuk.has(i) && <line x1={bx} y1={134} x2={bx + ad} y2={134} stroke="var(--ink)" strokeWidth={2} />}
            <circle cx={bx} cy={134} r={b === 2 && i === 0 ? r + 2 : r} fill={B.renk} fillOpacity={b === 2 && i === 0 ? 0.5 : 0.85} stroke="var(--ink)" strokeWidth={1} />
          </g>
        ))}
      </g>
      <text x={170} y={116} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{B.ad} molekülü</text>
      <text x={170} y={166} fontSize={11.5} fontWeight={700} fill={B.renk} textAnchor="middle">
        {u <= 0 ? "Oynat ve izle" : bitti ? `Son ürün: ${B.urun}` : enzimYazi(b, x)}
      </text>
      <text x={170} y={200} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {bitti ? "Sindirim ince bağırsakta tamamlandı" : `${B.ad}: parçalanma %${Math.round(p * 100)}`}
      </text>
    </svg>
  );
}

/* ---------- enzim ve pH ---------- */

const etkinlik = (ph: number, opt: number) => Math.exp(-(((ph - opt) / 1.4) ** 2));

function Ph({ v }: SahneProps) {
  const ph = sinir(v.ph ?? 7, 1, 9);
  const X = (p: number) => 46 + ((p - 1) / 8) * 272;
  const Y = (a: number) => 160 - a * 110;
  const egri = (opt: number) => Array.from({ length: 81 }, (_, i) => { const p = 1 + i / 10; return `${X(p)},${Y(etkinlik(p, opt))}`; }).join(" ");
  const pe = etkinlik(ph, 2), tr = etkinlik(ph, 8);
  return (
    <svg viewBox="0 0 340 218" role="img" aria-label={`pH ${ph}: pepsin yüzde ${Math.round(pe * 100)}, tripsin yüzde ${Math.round(tr * 100)} hızla çalışıyor`}>
      <rect x={X(1.5)} y={44} width={X(2.5) - X(1.5)} height={116} fill={KIRMIZI} fillOpacity={0.08} />
      <rect x={X(7.5)} y={44} width={X(8.5) - X(7.5)} height={116} fill={MAVI} fillOpacity={0.08} />
      <text x={X(2)} y={38} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">mide</text>
      <text x={X(8)} y={38} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">ince bağırsak</text>
      <line x1={46} x2={318} y1={160} y2={160} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={46} x2={46} y1={40} y2={160} stroke="var(--ink)" strokeWidth={1.4} />
      {Array.from({ length: 9 }, (_, i) => (
        <text key={i} x={X(i + 1)} y={175} fontSize={10} fill="var(--muted)" textAnchor="middle">{i + 1}</text>
      ))}
      <text x={318} y={190} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">pH</text>
      <text x={40} y={34} fontSize={11} fontWeight={700} fill="var(--ink)">hız</text>
      <polyline points={egri(2)} fill="none" stroke={KIRMIZI} strokeWidth={2.5} />
      <polyline points={egri(8)} fill="none" stroke={MAVI} strokeWidth={2.5} />
      <text x={X(3.3)} y={Y(0.85)} fontSize={11} fontWeight={800} fill={KIRMIZI}>pepsin</text>
      <text x={X(6.7)} y={Y(0.85)} fontSize={11} fontWeight={800} fill={MAVI} textAnchor="end">tripsin</text>
      <line x1={X(ph)} x2={X(ph)} y1={44} y2={160} stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 3" />
      <circle cx={X(ph)} cy={Y(pe)} r={5} fill={KIRMIZI} stroke="#fff" strokeWidth={1.5} />
      <circle cx={X(ph)} cy={Y(tr)} r={5} fill={MAVI} stroke="#fff" strokeWidth={1.5} />
      <text x={170} y={208} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        pH {ph}: pepsin %{Math.round(pe * 100)}, tripsin %{Math.round(tr * 100)}
      </text>
    </svg>
  );
}

/* ---------- safra ve yağ ---------- */

function Safra({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const safra = (v.safra ?? 0) === 1;
  const e = safra ? yumusak(u / 0.3) : 0;
  const d = safra ? sinir((u - 0.3) / 0.7) : 0.3 * u;
  const kucul = Math.cbrt(1 - d);
  const R = 42, cx = 110, cy = 100;
  const izgara: Nokta[] = Array.from({ length: 27 }, (_, i) => [34 + (i % 7) * 25 + (Math.floor(i / 7) % 2) * 12, 44 + Math.floor(i / 7) * 28]);
  const yuzey = safra ? ara(1, 3, e) : 1;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={safra ? "Safra yağı küçük damlacıklara ayırıyor; lipaz geniş yüzeyde hızla çalışıyor" : "Safra yok: tek büyük yağ damlası, lipaz yalnızca yüzeyinde çalışıyor"}>
      {e < 1 && (
        <g opacity={1 - e}>
          <circle cx={cx} cy={cy} r={R * kucul} fill={SARI} fillOpacity={0.55} stroke="#c98a12" strokeWidth={1.5} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI) / 5;
            return <circle key={i} cx={cx + (R * kucul + 4) * Math.cos(a)} cy={cy + (R * kucul + 4) * Math.sin(a)} r={3} fill={MOR} />;
          })}
        </g>
      )}
      {e > 0 && (
        <g opacity={e}>
          {izgara.map(([x, y], i) => {
            const px = ara(cx, x, e), py = ara(cy, y, e), r = 12 * kucul;
            if (r < 1) return null;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={r} fill={SARI} fillOpacity={0.55} stroke="#c98a12" strokeWidth={1.2} />
                <circle cx={px + r * 0.8} cy={py - r * 0.6} r={2.4} fill={MOR} />
              </g>
            );
          })}
        </g>
      )}
      {safra && u === 0 && (
        <g fill={YESIL}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + 0.4;
            return <rect key={i} x={cx + 56 * Math.cos(a) - 3} y={cy + 56 * Math.sin(a) - 3} width={6} height={6} rx={1} />;
          })}
        </g>
      )}
      <g fontSize={11.5} fontWeight={700}>
        <text x={224} y={42} fill="var(--muted)">Yağın yüzeyi</text>
        <text x={224} y={62} fontSize={17} fontWeight={800} fill="var(--ink)">×{virgul(yuzey, 1)}</text>
        <text x={224} y={96} fill="var(--muted)">Sindirilen yağ</text>
        <rect x={224} y={104} width={100} height={12} rx={6} fill="var(--line)" />
        <rect x={224} y={104} width={100 * d} height={12} rx={6} fill={YESIL} />
        <text x={224} y={134} fontSize={17} fontWeight={800} fill={YESIL}>%{Math.round(d * 100)}</text>
        <circle cx={228} cy={158} r={3} fill={MOR} />
        <text x={236} y={162} fill="var(--muted)">lipaz</text>
        {safra && u === 0 && <rect x={225} y={172} width={6} height={6} rx={1} fill={YESIL} />}
        {safra && u === 0 && <text x={236} y={179} fill="var(--muted)">safra</text>}
      </g>
      <text x={170} y={206} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? (safra ? "Safra onikiparmağa döküldü" : "Safra yok: tek büyük yağ damlası") : safra ? (e < 1 ? "Safra yağı damlacıklara ayırıyor" : u < 1 ? "Lipaz geniş yüzeyde hızla çalışıyor" : "Yağın hepsi yağ asidi ve gliserole ayrıldı") : "Lipaz yalnızca damlanın yüzeyinde çalışıyor"}
      </text>
    </svg>
  );
}

/* ---------- villuslar ve yüzey ---------- */

const KAT = [1, 3, 30, 600];
const KAT_AD = ["Düz boru", "Kıvrımlar", "Villuslar", "Mikrovilluslar"];

function Villus({ v }: SahneProps) {
  const k = Math.round(sinir(v.k ?? 0, 0, 3));
  const duvar = (x: number) => 150 - (k >= 1 ? 26 * (0.5 + 0.5 * Math.sin(((x - 20) / 100) * 2 * Math.PI - Math.PI / 2)) : 0);
  const cizgi = Array.from({ length: 151 }, (_, i) => { const x = 20 + i * 2; return `${x},${duvar(x)}`; }).join(" ");
  const parmaklar = k >= 2 ? Array.from({ length: 30 }, (_, i) => 25 + i * 10) : [];
  const genis = (Math.log10(KAT[k]) / Math.log10(600)) * 220;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${KAT_AD[k]}: ince bağırsağın emilim yüzeyi ${KAT[k]} katı`}>
      <polygon points={`20,176 ${cizgi} 320,176`} fill={KIRMIZI} fillOpacity={0.12} />
      {parmaklar.map((x) => {
        const y = duvar(x);
        return <rect key={x} x={x - 3.5} y={y - 18} width={7} height={20} rx={3.5} fill={KIRMIZI} fillOpacity={0.35} stroke={KIRMIZI} strokeWidth={1} />;
      })}
      <polyline points={cizgi} fill="none" stroke={KIRMIZI} strokeWidth={2} />
      {k >= 3 && (
        <g>
          <line x1={175} y1={duvar(175) - 18} x2={248} y2={66} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={278} cy={56} r={40} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
          <rect x={252} y={58} width={52} height={30} rx={3} fill={KIRMIZI} fillOpacity={0.25} stroke={KIRMIZI} />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={253 + i * 4.3} y={42} width={2.6} height={16} rx={1.3} fill={KIRMIZI} fillOpacity={0.7} />)}
          <text x={278} y={71} fontSize={9} fontWeight={700} fill="var(--ink)" textAnchor="middle">epitel</text>
          <text x={278} y={82} fontSize={9} fontWeight={700} fill="var(--ink)" textAnchor="middle">hücresi</text>
        </g>
      )}
      <text x={20} y={30} fontSize={14} fontWeight={800} fill="var(--ink)">{KAT_AD[k]}</text>
      <text x={20} y={48} fontSize={11.5} fontWeight={700} fill="var(--muted)">{["iç yüzey dümdüz", "duvar kıvrılır: ×3", "her kıvrımda parmaklar: ×10", "her hücrede fırça: ×20"][k]}</text>
      <rect x={20} y={186} width={220} height={12} rx={6} fill="var(--line)" />
      <rect x={20} y={186} width={Math.max(12, genis)} height={12} rx={6} fill={YESIL} />
      <text x={250} y={197} fontSize={15} fontWeight={800} fill={YESIL}>×{KAT[k]}</text>
      <text x={20} y={216} fontSize={11} fontWeight={700} fill="var(--muted)">emilim yüzeyi</text>
    </svg>
  );
}

/* ---------- kana mı, lenfe mi ---------- */

const EMILEN: { tur: 0 | 1 | 2; x: number; y: number; hy: number }[] = [
  { tur: 0, x: 40, y: 92, hy: 96 }, { tur: 1, x: 66, y: 130, hy: 130 }, { tur: 2, x: 48, y: 168, hy: 92 },
  { tur: 2, x: 296, y: 86, hy: 120 }, { tur: 0, x: 276, y: 128, hy: 150 }, { tur: 1, x: 306, y: 170, hy: 172 },
  { tur: 0, x: 78, y: 186, hy: 182 }, { tur: 2, x: 266, y: 186, hy: 150 },
];

function Emilim({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const a = yumusak(u / 0.5), b = yumusak((u - 0.5) / 0.5);
  const renk = [MAVI, MOR, SARI];
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label="Villus: glikoz ve amino asit kılcal kana, yağ asidi ve gliserol lenf kılcalına geçer">
      <path d="M115 206 L115 78 A55 55 0 0 1 225 78 L225 206 Z" fill={KIRMIZI} fillOpacity={0.1} stroke={KIRMIZI} strokeWidth={1.5} />
      <path d="M134 206 L134 82 A36 36 0 0 1 206 82 L206 206" fill="none" stroke={KIRMIZI} strokeWidth={4} strokeOpacity={0.75} />
      <rect x={161} y={60} width={18} height={146} rx={9} fill={SARI} fillOpacity={0.45} stroke="#c98a12" strokeWidth={1.4} />
      {EMILEN.map((p, i) => {
        const kan = p.tur !== 2;
        const hx = kan ? (p.x < 170 ? 134 : 206) : 170;
        // önce epitelden damara girer, sonra damarla villusun tabanına doğru akar
        const x = ara(p.x, hx, a), y = ara(p.y, p.hy, a) + 24 * b;
        return p.tur === 2 ? (
          <circle key={i} cx={x} cy={y} r={5} fill={renk[2]} stroke="#c98a12" strokeWidth={1.2} />
        ) : p.tur === 0 ? (
          <rect key={i} x={x - 4.5} y={y - 4.5} width={9} height={9} rx={1.5} fill={renk[0]} transform={`rotate(45 ${x} ${y})`} />
        ) : (
          <circle key={i} cx={x} cy={y} r={4.5} fill={renk[1]} />
        );
      })}
      <g fontSize={10.5} fontWeight={700}>
        <text x={8} y={22} fill="#c98a12">lenf kılcalı</text>
        <line x1={72} y1={18} x2={162} y2={66} stroke="#c98a12" strokeWidth={1} />
        <text x={8} y={40} fill={KIRMIZI}>kılcal kan damarı</text>
        <line x1={100} y1={37} x2={134} y2={100} stroke={KIRMIZI} strokeWidth={1} />
        <rect x={228} y={12} width={8} height={8} rx={1.5} fill={MAVI} transform="rotate(45 232 16)" />
        <text x={242} y={20} fill="var(--muted)">glikoz</text>
        <circle cx={232} cy={33} r={4} fill={MOR} />
        <text x={242} y={37} fill="var(--muted)">amino asit</text>
        <circle cx={232} cy={50} r={4.5} fill={SARI} stroke="#c98a12" />
        <text x={242} y={54} fill="var(--muted)">yağ asidi, gliserol</text>
        {u >= 1 && (
          <g>
            <text x={201} y={220} fill={KIRMIZI}>↓ karaciğere</text>
            <text x={177} y={220} textAnchor="end" fill="#c98a12">lenfe ↓</text>
          </g>
        )}
      </g>
      <text x={170} y={238} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Sindirilmiş besinler villusun çevresinde" : u < 0.5 ? "Besinler epitelden geçiyor" : u < 1 ? "Kan ve lenf besinleri villustan taşıyor" : "Glikoz ve amino asit kana, yağlar lenfe geçti"}
      </text>
    </svg>
  );
}

/* ---------- büyük ve küçük dolaşım ---------- */

const DOLASIM: Nokta[] = [
  [148, 135], [104, 135], [104, 38], [132, 38], [208, 38], [236, 38], [236, 99], [192, 99], [192, 135],
  [256, 135], [256, 200], [208, 200], [132, 200], [84, 200], [84, 99], [148, 99], [148, 135],
];
/** Yolun her noktasında kanın oksijen durumu (0 oksijensiz, 1 oksijenli). */
function oksijen(d: number, L: number[]) {
  // akciğer: 3→4 arası, doku: 11→12 arası
  if (d <= L[3]) return 0;
  if (d <= L[4]) return (d - L[3]) / (L[4] - L[3]);
  if (d <= L[11]) return 1;
  if (d <= L[12]) return 1 - (d - L[11]) / (L[12] - L[11]);
  return 0;
}

function Dolasim({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 8;
  const u = ilerleme(t, oynuyor, sure);
  const L: number[] = [0];
  for (let i = 1; i < DOLASIM.length; i++) L.push(L[i - 1] + Math.hypot(DOLASIM[i][0] - DOLASIM[i - 1][0], DOLASIM[i][1] - DOLASIM[i - 1][1]));
  const toplam = L[L.length - 1], simdi = u * toplam;
  const parca: { a: Nokta; b: Nokta; o: number }[] = [];
  for (let d = 0; d < simdi; d += 4) {
    const a = noktaAl(DOLASIM, d / toplam), b = noktaAl(DOLASIM, Math.min(simdi, d + 4.5) / toplam);
    parca.push({ a, b, o: oksijen(d, L) });
  }
  const kan = noktaAl(DOLASIM, u);
  const o = oksijen(simdi, L);
  const kanRenk = (x: number) => (x > 0.5 ? KIRMIZI : MAVI);
  const yazi = u <= 0 ? "Kan sağ karıncıktan yola çıkıyor" : simdi < L[3] ? "Akciğer atardamarı: oksijensiz kan akciğere" : simdi < L[4] ? "Akciğerde kan O₂ alıyor" : simdi < L[8] ? "Akciğer toplardamarı: oksijenli kan kalbe" : simdi < L[11] ? "Aort: oksijenli kan dokulara" : simdi < L[12] ? "Dokularda kan O₂ bırakıyor" : u < 1 ? "Ana toplardamar: oksijensiz kan kalbe" : "Kan bir tam tur attı";
  const oda = [
    { x: 126, y: 84, a: "sağ", b: "kulakçık" }, { x: 126, y: 117, a: "sağ", b: "karıncık" },
    { x: 172, y: 84, a: "sol", b: "kulakçık" }, { x: 172, y: 117, a: "sol", b: "karıncık" },
  ];
  return (
    <svg viewBox="0 0 340 234" role="img" aria-label="Küçük dolaşımda kan akciğerde oksijen alır; büyük dolaşımda dokulara oksijen bırakır">
      <polyline points={nokt(DOLASIM)} fill="none" stroke="var(--line-2)" strokeWidth={5} strokeLinejoin="round" />
      {parca.map((p, i) => <line key={i} x1={p.a[0]} y1={p.a[1]} x2={p.b[0]} y2={p.b[1]} stroke={kanRenk(p.o)} strokeWidth={5} strokeLinecap="round" />)}
      <ellipse cx={136} cy={32} rx={36} ry={17} fill={MAVI} fillOpacity={0.08} stroke="var(--muted)" strokeWidth={1.2} />
      <ellipse cx={204} cy={32} rx={36} ry={17} fill={MAVI} fillOpacity={0.08} stroke="var(--muted)" strokeWidth={1.2} />
      <rect x={110} y={180} width={120} height={26} rx={10} fill={KIRMIZI} fillOpacity={0.06} stroke="var(--muted)" strokeWidth={1.2} />
      {oda.map((d) => (
        <g key={d.a + d.b}>
          <rect x={d.x} y={d.y} width={44} height={d.b === "kulakçık" ? 30 : 36} rx={6} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
          <text x={d.x + 22} y={d.y + 13} fontSize={9} fontWeight={700} fill="var(--ink)" textAnchor="middle">{d.a}</text>
          <text x={d.x + 22} y={d.y + 24} fontSize={9} fontWeight={700} fill="var(--ink)" textAnchor="middle">{d.b}</text>
        </g>
      ))}
      {u > 0 && u < 1 && <circle cx={kan[0]} cy={kan[1]} r={7} fill={kanRenk(o)} stroke="#fff" strokeWidth={2} />}
      <g fontSize={10} fontWeight={700} fill="var(--muted)">
        <text x={170} y={28} textAnchor="middle" fill="var(--ink)">akciğerler</text>
        <text x={170} y={192} textAnchor="middle" fill="var(--ink)">vücut dokuları</text>
        <text x={98} y={58} textAnchor="end">akciğer</text>
        <text x={98} y={70} textAnchor="end">atardamarı</text>
        <text x={78} y={150} textAnchor="end">ana</text>
        <text x={78} y={162} textAnchor="end">toplardamar</text>
        <text x={242} y={58}>akciğer</text>
        <text x={242} y={70}>toplardamarı</text>
        <text x={262} y={164}>aort</text>
      </g>
      <text x={170} y={226} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{yazi}</text>
    </svg>
  );
}

/* ---------- kapakçıklar ---------- */

function Kapak({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 3;
  const u = ilerleme(t, oynuyor, sure);
  const saglam = (v.k ?? 0) === 1;
  const sis = u > 0 ? Math.sin(Math.PI * sinir((u - 0.05) / 0.65)) : 0;
  const akis = yumusak((u - 0.08) / 0.6);
  const avKapali = saglam && u > 0.05 && u < 0.75;
  const damla = Array.from({ length: 12 }, (_, i) => ({ x: 128 + (i % 6) * 18, y: 116 + Math.floor(i / 6) * 22, geri: !saglam && i % 2 === 1 }));
  const aorta = damla.filter((d) => !d.geri).length;
  // varış yerleri üst üste binmesin: aortta iki sıra, kulakçıkta küçük bir ızgara
  const sirasi = damla.map((d, i) => damla.slice(0, i).filter((e) => e.geri === d.geri).length);
  const yol = (d: { x: number; y: number; geri: boolean }, j: number): Nokta[] =>
    d.geri
      ? [[d.x, d.y], [150, 90], [125 + (j % 3) * 25, 58 + Math.floor(j / 3) * 11]]
      : [[d.x, d.y], [233, 98], [233, 34], [262 + (j % 6) * 11, 14 + Math.floor(j / 6) * 12]];
  return (
    <svg viewBox="0 0 340 212" role="img" aria-label={saglam ? "Kapakçıklar sağlam: karıncık kasılınca kanın tamamı aorta gidiyor" : "Kapakçıklar bozuk: kanın bir kısmı kulakçığa geri kaçıyor"}>
      <rect x={100} y={24} width={100} height={52} rx={12} fill={MAVI} fillOpacity={0.06} stroke="var(--ink)" strokeWidth={1.6} />
      <g transform={`translate(175 136) scale(${1 - 0.12 * sis}) translate(-175 -136)`}>
        <rect x={100} y={94} width={150} height={84} rx={18} fill={KIRMIZI} fillOpacity={0.06 + 0.1 * sis} stroke="var(--ink)" strokeWidth={2} />
      </g>
      <path d="M233 94 L233 40 Q233 20 253 20 L330 20" fill="none" stroke={KIRMIZI} strokeOpacity={0.18} strokeWidth={26} />
      {/* ikili kapakçık */}
      <g stroke={saglam ? YESIL : KIRMIZI} strokeWidth={4} strokeLinecap="round">
        {avKapali ? (
          <>
            <line x1={124} y1={85} x2={150} y2={85} />
            <line x1={176} y1={85} x2={150} y2={85} />
          </>
        ) : (
          <>
            <line x1={124} y1={83} x2={130} y2={106} />
            <line x1={176} y1={83} x2={170} y2={106} />
          </>
        )}
      </g>
      {/* yarım ay kapakçığı */}
      <g stroke={saglam ? YESIL : KIRMIZI} strokeWidth={3.5} strokeLinecap="round">
        {sis > 0.1 || !saglam ? (
          <>
            <line x1={221} y1={94} x2={224} y2={76} />
            <line x1={245} y1={94} x2={242} y2={76} />
          </>
        ) : (
          <>
            <line x1={221} y1={92} x2={233} y2={96} />
            <line x1={245} y1={92} x2={233} y2={96} />
          </>
        )}
      </g>
      {damla.map((d, i) => {
        const [x, y] = noktaAl(yol(d, sirasi[i]), akis);
        return <circle key={i} cx={x} cy={y} r={5} fill={KIRMIZI} stroke="#fff" strokeWidth={1} />;
      })}
      <g fontSize={10.5} fontWeight={700} fill="var(--muted)">
        <text x={150} y={46} textAnchor="middle">kulakçık</text>
        <text x={175} y={172} textAnchor="middle">karıncık</text>
        <text x={296} y={48}>aort</text>
        <text x={114} y={89} textAnchor="end">ikili kapakçık</text>
        <text x={256} y={110}>yarım ay</text>
        <text x={256} y={122}>kapakçığı</text>
      </g>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u < 1 ? (saglam ? "Kapakçıklar sağlam" : "Kapakçıklar tam kapanmıyor") : `Aorta giden kan: ${aorta}/12${aorta < 12 ? `, geri kaçan: ${12 - aorta}` : ""}`}
      </text>
    </svg>
  );
}

/* ---------- kalp hızı ---------- */

function ekg(t: number, T: number) {
  let y = 0;
  for (let k = 0; ; k++) {
    const c = 0.3 + k * T;
    if (c > 6.5) break;
    const d = t - c;
    y += 6 * Math.exp(-(((d + 0.16) / 0.035) ** 2));
    y += 44 * Math.exp(-((d / 0.012) ** 2)) - 9 * Math.exp(-(((d - 0.03) / 0.012) ** 2));
    y += 10 * Math.exp(-(((d - 0.28) / 0.06) ** 2));
  }
  return y;
}

function Nabiz({ v }: SahneProps) {
  const n = sinir(v.n ?? 60, 50, 150);
  const T = 60 / n;
  const X = (t: number) => 20 + t * 50;
  const cizgi = Array.from({ length: 601 }, (_, i) => { const t = i / 100; return `${X(t)},${140 - ekg(t, T)}`; }).join(" ");
  let atim = 0;
  for (let c = 0.3; c <= 6; c += T) atim++;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Kalp hızı dakikada ${n}; bir döngü ${virgul(T)} saniye`}>
      <path d="M44 66 C20 50 22 26 40 26 C48 26 52 32 54 36 C56 32 60 26 68 26 C86 26 88 50 64 66 L54 74 Z" fill={KIRMIZI} fillOpacity={0.8} transform="translate(0 -8)" />
      <text x={96} y={44} fontSize={20} fontWeight={800} fill="var(--ink)">{n} atım/dk</text>
      <text x={96} y={66} fontSize={12.5} fontWeight={700} fill="var(--muted)">Bir döngü: 60 ÷ {n} = {virgul(T)} s</text>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <line x1={X(i)} x2={X(i)} y1={84} y2={154} stroke="var(--line)" />
          <text x={X(i)} y={168} fontSize={10} fill="var(--muted)" textAnchor="middle">{i}</text>
        </g>
      ))}
      <polyline points={cizgi} fill="none" stroke={KIRMIZI} strokeWidth={1.8} strokeLinejoin="round" />
      {0.3 + T <= 6 && (
        <g>
          <line x1={X(0.3)} x2={X(0.3 + T)} y1={88} y2={88} stroke="var(--ink)" strokeWidth={1.2} />
          <line x1={X(0.3)} x2={X(0.3)} y1={84} y2={92} stroke="var(--ink)" strokeWidth={1.2} />
          <line x1={X(0.3 + T)} x2={X(0.3 + T)} y1={84} y2={92} stroke="var(--ink)" strokeWidth={1.2} />
          <text x={X(0.3 + T / 2)} y={82} fontSize={10} fontWeight={700} fill="var(--ink)" textAnchor="middle">{virgul(T)} s</text>
        </g>
      )}
      <text x={320} y={182} fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="end">zaman (s)</text>
      <text x={170} y={206} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">6 saniyede {atim} atım</text>
    </svg>
  );
}

/* ---------- kanın bileşenleri ---------- */

const KAN = [
  { ad: "Plazma", s: ["kanın %55'i, çoğu su", "albümin, fibrinojen, antikor", "besin, iyon, hormon taşır"] },
  { ad: "Alyuvar", s: ["hemoglobinle O₂ taşır", "memelide çekirdeksiz", "en kalabalık kan hücresi"] },
  { ad: "Akyuvar", s: ["çekirdekli, savunma yapar", "mikrop yutar (fagositoz)", "lenfositler özgül yanıt verir"] },
  { ad: "Kan pulcuğu", s: ["hücre parçasıdır", "çekirdeksizdir", "pıhtılaşmayı başlatır"] },
];

function Kan({ v }: SahneProps) {
  const h = Math.round(sinir((v.h ?? 1) - 1, 0, 3));
  const k = KAN[h];
  const vurgu = (i: number) => (h === i ? "var(--ink)" : "transparent");
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={`${k.ad}: ${k.s.join(", ")}`}>
      <rect x={40} y={20} width={40} height={88} fill={SARI} fillOpacity={0.35} />
      <rect x={40} y={108} width={40} height={3} fill="#fff" />
      <path d="M40 111 L80 111 L80 168 Q80 182 60 182 Q40 182 40 168 Z" fill={KIRMIZI} fillOpacity={0.85} />
      <path d="M40 14 L40 168 Q40 182 60 182 Q80 182 80 168 L80 14" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
      <rect x={37} y={18} width={46} height={92} fill="none" stroke={vurgu(0)} strokeWidth={2} strokeDasharray="4 3" />
      <rect x={37} y={106} width={46} height={7} fill="none" stroke={h === 2 || h === 3 ? "var(--ink)" : "transparent"} strokeWidth={2} strokeDasharray="4 3" />
      <rect x={37} y={113} width={46} height={66} fill="none" stroke={vurgu(1)} strokeWidth={2} strokeDasharray="4 3" />
      <g fontSize={10.5} fontWeight={700} fill="var(--muted)">
        <text x={88} y={64}>%55</text>
        <text x={88} y={112}>%1'den az</text>
        <text x={88} y={148}>%45</text>
      </g>
      <rect x={168} y={14} width={164} height={170} rx={14} fill="var(--panel)" />
      <g transform="translate(250 62)">
        {h === 0 && (
          <g>
            <rect x={-40} y={-30} width={80} height={56} rx={10} fill={SARI} fillOpacity={0.3} />
            {[[-22, -14], [8, -18], [24, 4], [-10, 10], [-28, 12], [14, 16]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y + 6} L${x} ${y} L${x - 4} ${y - 5} M${x} ${y} L${x + 4} ${y - 5}`} stroke={i % 2 ? MOR : MAVI} strokeWidth={2} fill="none" strokeLinecap="round" />
            ))}
          </g>
        )}
        {h === 1 && (
          <g>
            <ellipse cx={0} cy={0} rx={34} ry={22} fill={KIRMIZI} />
            <ellipse cx={0} cy={0} rx={15} ry={9} fill="#fff" fillOpacity={0.35} />
          </g>
        )}
        {h === 2 && (
          <g>
            <circle cx={0} cy={0} r={30} fill={MOR} fillOpacity={0.15} stroke={MOR} strokeWidth={1.5} />
            <path d="M-14 -6 Q-18 -16 -8 -14 Q-2 -20 4 -12 Q14 -16 14 -4 Q20 6 8 8 Q2 16 -6 8 Q-18 8 -14 -6 Z" fill={MOR} fillOpacity={0.7} />
          </g>
        )}
        {h === 3 && (
          <g fill={SARI} stroke="#c98a12" strokeWidth={1.2}>
            <path d="M-26 -8 L-14 -14 L-8 -4 L-18 4 Z" />
            <path d="M4 -16 L16 -12 L14 0 L2 -4 Z" />
            <path d="M-6 10 L8 6 L12 18 L-4 20 Z" />
            <path d="M20 6 L30 10 L26 20 L18 16 Z" />
          </g>
        )}
      </g>
      <text x={250} y={118} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{k.ad}</text>
      <g fontSize={10.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        {k.s.map((x, i) => <text key={i} x={250} y={138 + i * 15}>{x}</text>)}
      </g>
    </svg>
  );
}

/* ---------- damarlarda basınç ve hız ---------- */

const DAMAR = [
  { ad: ["aort"], b: 1, h: 1, a: 0.03, s: ["Basınç en yüksek: ≈120/80 mmHg", "Esnek duvar her atımda gerilir: nabız"] },
  { ad: ["atar", "damar"], b: 0.85, h: 0.45, a: 0.07, s: ["Basınç ve hız düşmeye başlar", "Kanı kalpten dokulara götürür"] },
  { ad: ["kılcal"], b: 0.3, h: 0.04, a: 1, s: ["Hız en düşük: alışverişe zaman kalır", "Duvar tek kat hücre, toplam kesit en geniş"] },
  { ad: ["toplar", "damar"], b: 0.1, h: 0.25, a: 0.2, s: ["Basınç çok düşük, hız yeniden artar", "Kapakçıklar ve kaslar kanı kalbe iter"] },
  { ad: ["ana", "toplardamar"], b: 0.03, h: 0.5, a: 0.05, s: ["Basınç sıfıra yakın", "Kan sağ kulakçığa döner"] },
];

function Damar({ v }: SahneProps) {
  const d = Math.round(sinir((v.d ?? 1) - 1, 0, 4));
  const X = (i: number) => 58 + i * 60;
  const Y = (x: number) => 150 - x * 110;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${DAMAR[d].ad.join("")}: ${DAMAR[d].s.join(". ")}`}>
      <rect x={X(d) - 28} y={30} width={56} height={150} rx={8} fill="var(--biyoloji-soft)" />
      {DAMAR.map((x, i) => (
        <rect key={i} x={X(i) - 14} y={Y(x.a)} width={28} height={150 - Y(x.a)} rx={3} fill="var(--line-2)" />
      ))}
      <line x1={22} x2={330} y1={150} y2={150} stroke="var(--ink)" strokeWidth={1.4} />
      <polyline points={DAMAR.map((x, i) => `${X(i)},${Y(x.b)}`).join(" ")} fill="none" stroke={KIRMIZI} strokeWidth={2.5} />
      <polyline points={DAMAR.map((x, i) => `${X(i)},${Y(x.h)}`).join(" ")} fill="none" stroke={MAVI} strokeWidth={2.5} />
      {DAMAR.map((x, i) => (
        <g key={i}>
          <circle cx={X(i)} cy={Y(x.b)} r={i === d ? 5 : 3.5} fill={KIRMIZI} stroke="#fff" strokeWidth={1.2} />
          <circle cx={X(i)} cy={Y(x.h)} r={i === d ? 5 : 3.5} fill={MAVI} stroke="#fff" strokeWidth={1.2} />
          {x.ad.map((a, j) => (
            <text key={j} x={X(i)} y={164 + j * 12} fontSize={10} fontWeight={i === d ? 800 : 600} fill={i === d ? "var(--ink)" : "var(--muted)"} textAnchor="middle">{a}</text>
          ))}
        </g>
      ))}
      <g fontSize={10.5} fontWeight={700}>
        <line x1={22} x2={36} y1={16} y2={16} stroke={KIRMIZI} strokeWidth={2.5} />
        <text x={40} y={20} fill={KIRMIZI}>basınç</text>
        <line x1={100} x2={114} y1={16} y2={16} stroke={MAVI} strokeWidth={2.5} />
        <text x={118} y={20} fill={MAVI}>hız</text>
        <rect x={160} y={10} width={12} height={12} rx={2} fill="var(--line-2)" />
        <text x={176} y={20} fill="var(--muted)">toplam kesit alanı</text>
      </g>
      <g fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        <text x={170} y={202}>{DAMAR[d].s[0]}</text>
        <text x={170} y={218} fontWeight={600} fill="var(--muted)">{DAMAR[d].s[1]}</text>
      </g>
    </svg>
  );
}

/* ---------- kan grupları ---------- */

const GRUP = ["A", "B", "AB", "O"];
const antijen = (g: string) => ({ A: g.includes("A"), B: g.includes("B") });
const antikor = (g: string) => ({ A: !g.includes("A") && g !== "AB", B: !g.includes("B") && g !== "AB" });

function Antijenli({ x, y, g, r = 20 }: { x: number; y: number; g: string; r?: number }) {
  const an = antijen(g);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={KIRMIZI} fillOpacity={0.75} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const px = x + (r + 3) * Math.cos(a), py = y + (r + 3) * Math.sin(a);
        const tur = i % 2 === 0 ? (an.A ? "A" : an.B ? "B" : "") : an.B ? "B" : an.A ? "A" : "";
        return tur === "A" ? (
          <path key={i} d={`M${px} ${py - 4} L${px + 4} ${py + 3} L${px - 4} ${py + 3} Z`} fill={SARI} stroke="var(--ink)" strokeWidth={0.8} />
        ) : tur === "B" ? (
          <rect key={i} x={px - 3.5} y={py - 3.5} width={7} height={7} fill={YESIL} stroke="var(--ink)" strokeWidth={0.8} />
        ) : null;
      })}
    </g>
  );
}

function Y({ x, y, renk, don = 0 }: { x: number; y: number; renk: string; don?: number }) {
  return (
    <path d={`M${x} ${y + 9} L${x} ${y} L${x - 6} ${y - 7} M${x} ${y} L${x + 6} ${y - 7}`} stroke={renk} strokeWidth={2.4} fill="none" strokeLinecap="round" transform={`rotate(${don} ${x} ${y})`} />
  );
}

function Grup({ v, s }: SahneProps) {
  const vg = GRUP[Math.round(sinir((v.g ?? 1) - 1, 0, 3))];
  const ag = typeof s.alici === "string" ? s.alici : "O";
  const an = antijen(vg), ak = antikor(ag);
  const cokelme = (an.A && ak.A) || (an.B && ak.B);
  const hucre: Nokta[] = cokelme
    ? [[148, 94], [178, 88], [204, 102], [158, 124], [192, 126]]
    : [[140, 84], [200, 80], [170, 106], [138, 128], [204, 126]];
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Verici ${vg}, alıcı ${ag}: ${cokelme ? "çökelme var, kan verilemez" : "çökelme yok, kan uygun"}`}>
      <text x={52} y={24} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Verici: {vg}</text>
      <Antijenli x={52} y={80} g={vg} r={26} />
      <text x={52} y={130} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {an.A && an.B ? "A ve B antijeni" : an.A ? "A antijeni" : an.B ? "B antijeni" : "antijen yok"}
      </text>
      <text x={290} y={24} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Alıcı: {ag}</text>
      <rect x={252} y={36} width={76} height={80} rx={12} fill={SARI} fillOpacity={0.25} />
      {ak.A && [[268, 60], [300, 92], [278, 98]].map(([x, y], i) => <Y key={`a${i}`} x={x} y={y} renk={SARI} don={i * 40} />)}
      {ak.B && [[310, 56], [266, 84], [312, 104]].map(([x, y], i) => <Y key={`b${i}`} x={x} y={y} renk={YESIL} don={-i * 50} />)}
      <text x={290} y={130} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {ak.A && ak.B ? "anti-A ve anti-B" : ak.A ? "anti-A" : ak.B ? "anti-B" : "antikor yok"}
      </text>
      <text x={170} y={24} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Karışınca</text>
      {hucre.map(([x, y], i) => <Antijenli key={i} x={x} y={y} g={vg} r={12} />)}
      {cokelme && [[163, 91], [191, 95], [175, 125]].map(([x, y], i) => <Y key={i} x={x} y={y} renk={an.A && ak.A ? SARI : YESIL} don={i * 60} />)}
      <g fontSize={10} fontWeight={700} fill="var(--muted)">
        <path d="M24 160 L28 153 L32 160 Z" fill={SARI} stroke="var(--ink)" strokeWidth={0.8} />
        <text x={38} y={160}>A antijeni</text>
        <rect x={110} y={153} width={7} height={7} fill={YESIL} stroke="var(--ink)" strokeWidth={0.8} />
        <text x={122} y={160}>B antijeni</text>
        <Y x={200} y={157} renk={SARI} />
        <text x={210} y={160}>anti-A</text>
        <Y x={262} y={157} renk={YESIL} />
        <text x={272} y={160}>anti-B</text>
      </g>
      <text x={170} y={198} fontSize={12.5} fontWeight={800} fill={cokelme ? KIRMIZI : YESIL} textAnchor="middle">
        {cokelme ? "Çökelme var: bu kan verilemez" : "Çökelme yok: kan uygun"}
      </text>
    </svg>
  );
}

/* ---------- birincil ve ikincil yanıt ---------- */

function tepe(gun: number, bas: number, gecik: number, zirve: number, boy: number, sonum: number) {
  const d = gun - bas;
  if (d <= gecik) return 0;
  if (d <= zirve) return boy * yumusak((d - gecik) / (zirve - gecik));
  return boy * Math.exp(-sonum * (d - zirve));
}
const antikorDuzey = (g: number) => tepe(g, 0, 6, 14, 1, 0.06) + tepe(g, 50, 2, 7, 5, 0.04);

function Yanit({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const gunSon = u * 80;
  const X = (g: number) => 46 + (g / 80) * 272;
  const Yy = (a: number) => 170 - (a / 5.4) * 126;
  const nok = Array.from({ length: Math.floor(gunSon) + 1 }, (_, i) => `${X(i)},${Yy(antikorDuzey(i))}`);
  if (gunSon > 0) nok.push(`${X(gunSon)},${Yy(antikorDuzey(gunSon))}`);
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Aşıdan sonra antikor yanıtı geç ve zayıf; ikinci karşılaşmada hızlı ve çok güçlü">
      <line x1={46} x2={318} y1={170} y2={170} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={46} x2={46} y1={36} y2={170} stroke="var(--ink)" strokeWidth={1.4} />
      {[0, 20, 40, 60, 80].map((g) => <text key={g} x={X(g)} y={184} fontSize={10} fill="var(--muted)" textAnchor="middle">{g}</text>)}
      <text x={318} y={198} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">gün</text>
      <text x={52} y={30} fontSize={11} fontWeight={700} fill="var(--ink)">antikor miktarı</text>
      <g fontSize={10} fontWeight={700} fill={MOR}>
        <line x1={X(0)} x2={X(0)} y1={60} y2={170} stroke={MOR} strokeDasharray="3 3" />
        <text x={X(0) + 4} y={64}>1. karşılaşma (aşı)</text>
        {gunSon >= 50 && (
          <g>
            <line x1={X(50)} x2={X(50)} y1={40} y2={170} stroke={MOR} strokeDasharray="3 3" />
            <text x={X(50) - 4} y={44} textAnchor="end">2. karşılaşma</text>
          </g>
        )}
      </g>
      {nok.length > 1 && <polyline points={nok.join(" ")} fill="none" stroke={KIRMIZI} strokeWidth={2.6} strokeLinejoin="round" />}
      {gunSon > 20 && (
        <g>
          <circle cx={X(18)} cy={128} r={7} fill={YESIL} fillOpacity={0.3} stroke={YESIL} strokeWidth={1.5} />
          <text x={X(18) + 11} y={132} fontSize={10} fontWeight={700} fill={YESIL}>hafıza hücreleri</text>
        </g>
      )}
      <text x={170} y={216} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Aşı yapıldı: vücut antijenle ilk kez karşılaşıyor" : gunSon < 50 ? "Birincil yanıt: geç başlar, zayıf kalır" : u < 1 ? "İkincil yanıt: hafıza hücreleri hemen devrede" : "İkincil yanıt hızlı ve çok daha güçlü"}
      </text>
    </svg>
  );
}

export const BIYOLOJI11: Record<string, SahneKaydi> = {
  "biy11-kanal": { C: Kanal },
  "biy11-yuzey": { C: Yuzey },
  "biy11-baslangic": { C: Baslangic },
  "biy11-ph": { C: Ph },
  "biy11-safra": {
    C: Safra,
    geri: (v) =>
      (v.safra ?? 0) !== 1
        ? { baslik: "Yağın çoğu kaldı", metin: "Lipaz yalnızca damlanın yüzeyinde çalışabilir. Safrayı aç: yağı damlacıklara ayırsın, yüzey artsın. Sonra yeniden oynat." }
        : null,
  },
  "biy11-villus": { C: Villus },
  "biy11-emilim": { C: Emilim },
  "biy11-dolasim": { C: Dolasim },
  "biy11-kapak": {
    C: Kapak,
    geri: (v) =>
      (v.k ?? 0) !== 1
        ? { baslik: "Kan geri kaçtı", metin: "Karıncık kasılınca ikili kapakçık kapanmadı; kanın yarısı kulakçığa döndü. Kapakçıkları onar ve yeniden oynat." }
        : null,
  },
  "biy11-nabiz": { C: Nabiz },
  "biy11-kan": { C: Kan },
  "biy11-damar": { C: Damar },
  "biy11-grup": { C: Grup },
  "biy11-yanit": { C: Yanit },
};
