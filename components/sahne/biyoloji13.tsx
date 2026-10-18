"use client";
// Biyoloji sahneleri (üreme sistemi, popülasyon ve komünite): spermin yolu, testiste FSH ve LH,
// spermatogenez ve oogenez, menstrual döngü, hCG, zigottan implantasyona, germ tabakaları;
// doğum-ölüm-göç, dağılım tipleri, J eğrisi, S eğrisi, sınırlayıcı faktörler, av-avcı döngüsü, Gause deneyi.
import { rastgele, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";
const sayi = (x: number) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Nokta = [number, number];

function uzunluk(p: Nokta[]) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return L;
}

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
const gauss = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2));

/** Bölümlere ayrılmış yolda u (0..1) için etkin bölüm ve bölüm içi ilerleme. */
function bolum(paylar: number[], u: number) {
  if (u <= 0) return { i: -1, yerel: 0 };
  let kalan = u;
  for (let i = 0; i < paylar.length; i++) {
    if (kalan <= paylar[i] || i === paylar.length - 1) return { i, yerel: sinir(kalan / paylar[i]) };
    kalan -= paylar[i];
  }
  return { i: paylar.length - 1, yerel: 1 };
}

/** Yatay ilerleme çubuğu. */
function Cubuk({ x, y, w, oran, renk }: { x: number; y: number; w: number; oran: number; renk: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={11} rx={5.5} fill="var(--line)" />
      {oran > 0 && <rect x={x} y={y} width={Math.max(11, w * sinir(oran))} height={11} rx={5.5} fill={renk} />}
    </g>
  );
}

/* ================= ÜREME SİSTEMİ ================= */

/* ---------- spermin yolu ---------- */

const SPERM: { pay: number; yol: Nokta[]; not: string }[] = [
  { pay: 0.22, yol: [[72, 64], [72, 98]], not: "Testis: sperm seminifer tüpçüklerde üretilir" },
  { pay: 0.22, yol: [[72, 98], [72, 118], [120, 118]], not: "Epididim: sperm olgunlaşır ve depolanır" },
  { pay: 0.32, yol: [[120, 118], [242, 118]], not: "Sperm kanalı: bez salgıları katılır, meni oluşur" },
  { pay: 0.24, yol: [[242, 118], [284, 118], [284, 186]], not: "Üretra: meni dışarı atılır" },
];

function Kutu({ x, y, w, ad, etkin }: { x: number; y: number; w: number; ad: string; etkin: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={12} fill={etkin ? "var(--biyoloji-soft)" : "var(--panel)"} stroke={etkin ? YESIL : "var(--line-2)"} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + 25} fontSize={12} fontWeight={800} fill={etkin ? YESIL : "var(--ink)"} textAnchor="middle">{ad}</text>
    </g>
  );
}

function Sperm({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const { i: etkin, yerel } = bolum(SPERM.map((b) => b.pay), u);
  const p: Nokta = etkin < 0 ? SPERM[0].yol[0] : noktaAl(SPERM[etkin].yol, yerel);
  const gecti = (i: number) => etkin > i || (etkin === i && yerel > 0.5) || u >= 1;
  const meni = etkin > 2 || (etkin === 2 && p[0] >= 186);
  const damla = etkin === 2 && p[0] > 150 && p[0] < 186;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label="Spermin yolu: testis, epididim, sperm kanalı, bez salgıları, üretra">
      {/* yollar */}
      <polyline points={nokt([[72, 60], [72, 98]])} fill="none" stroke="var(--line-2)" strokeWidth={6} strokeLinecap="round" />
      <polyline points={nokt([[120, 118], [242, 118]])} fill="none" stroke={etkin === 2 ? YESIL : "var(--line-2)"} strokeOpacity={etkin === 2 ? 0.6 : 1} strokeWidth={6} strokeLinecap="round" />
      <polyline points={nokt([[284, 138], [284, 186]])} fill="none" stroke={etkin === 3 ? YESIL : "var(--line-2)"} strokeOpacity={etkin === 3 ? 0.6 : 1} strokeWidth={6} strokeLinecap="round" />
      <Kutu x={24} y={20} w={96} ad="testis" etkin={etkin === 0} />
      <Kutu x={24} y={98} w={96} ad="epididim" etkin={etkin === 1} />
      <Kutu x={242} y={98} w={84} ad="üretra" etkin={etkin === 3} />
      {/* bezler */}
      <rect x={134} y={14} width={104} height={58} rx={12} fill={meni || damla ? "#fdf3dc" : "var(--panel)"} stroke={meni || damla ? SARI : "var(--line-2)"} strokeWidth={1.4} />
      <g fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">
        <text x={186} y={32}>seminal kesecik</text>
        <text x={186} y={47}>prostat</text>
        <text x={186} y={62}>bulbouretral bez</text>
      </g>
      <line x1={186} x2={186} y1={74} y2={110} stroke={SARI} strokeWidth={1.6} strokeDasharray="3 3" />
      {damla && [0, 1, 2].map((k) => <circle key={k} cx={186} cy={80 + ((p[0] - 150) / 36) * 30 - k * 9} r={3} fill={SARI} />)}
      <g fontSize={10} fontWeight={700} textAnchor="middle">
        <text x={186} y={136} fill={etkin === 2 ? YESIL : "var(--muted)"}>sperm kanalı</text>
        {gecti(0) && <text x={78} y={82} fill={YESIL} textAnchor="start">üretim · 2-3 °C serin</text>}
        {gecti(1) && <text x={72} y={152} fill={YESIL}>olgunlaşma, depolama</text>}
        {gecti(3) && <text x={276} y={178} fill={YESIL} textAnchor="end">idrar ve meni yolu</text>}
      </g>
      {/* sperm */}
      {meni && <circle cx={p[0]} cy={p[1]} r={9} fill={SARI} fillOpacity={0.35} />}
      <path d={`M${p[0]} ${p[1]} q -5 -4 -9 0 t -9 0`} fill="none" stroke={MAVI} strokeWidth={1.4} transform={etkin === 0 || (etkin === 3 && p[0] >= 284) || etkin < 0 ? `rotate(-90 ${p[0]} ${p[1]})` : undefined} />
      <ellipse cx={p[0]} cy={p[1]} rx={4.5} ry={3.4} fill={MAVI} />
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {etkin < 0 ? "Sperm testiste üretildi; nereye gidiyor?" : u >= 1 ? "Sperm testisten üretraya ulaştı" : SPERM[etkin].not}
      </text>
    </svg>
  );
}

/* ---------- testiste FSH, LH ---------- */

function Testis({ v }: SahneProps) {
  const f = v.f ?? 0, l = v.l ?? 0;
  const uretim = f && l ? 1 : f || l ? 0.25 : 0;
  const cx = 92, cy = 136, R = 52;
  const sertoli = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2 + 0.3);
  const r = rastgele(4);
  const spermler = Array.from({ length: 9 }, () => ({ a: r() * Math.PI * 2, d: 6 + r() * 18, y: r() * Math.PI * 2 }));
  const kac = Math.round(uretim * 9);
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={`Testis: FSH ${f ? "var" : "yok"}, LH ${l ? "var" : "yok"}; sperm üretimi ${uretim === 1 ? "tam" : uretim ? "zayıf" : "yok"}`}>
      {/* hipofiz */}
      <ellipse cx={60} cy={22} rx={32} ry={13} fill="var(--panel)" stroke="var(--line-2)" />
      <text x={60} y={26} fontSize={10.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">hipofiz</text>
      {/* FSH oku */}
      <line x1={58} x2={80} y1={36} y2={80} stroke={f ? MAVI : "var(--line-2)"} strokeWidth={2.2} strokeDasharray={f ? undefined : "4 4"} />
      <path d="M80 84 L74 74 L84 74 Z" fill={f ? MAVI : "var(--line-2)"} transform="rotate(-26 80 80)" />
      <text x={56} y={64} fontSize={11} fontWeight={800} fill={f ? MAVI : "var(--muted)"} textAnchor="end">FSH</text>
      {/* LH oku */}
      <line x1={84} x2={168} y1={30} y2={84} stroke={l ? MOR : "var(--line-2)"} strokeWidth={2.2} strokeDasharray={l ? undefined : "4 4"} />
      <path d="M172 87 L160 86 L166 77 Z" fill={l ? MOR : "var(--line-2)"} />
      <text x={128} y={46} fontSize={11} fontWeight={800} fill={l ? MOR : "var(--muted)"}>LH</text>
      {/* seminifer tüpçük */}
      <circle cx={cx} cy={cy} r={R} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.6} />
      {sertoli.map((a, i) => {
        const x1 = cx + Math.cos(a) * (R - 2), y1 = cy + Math.sin(a) * (R - 2);
        const x2 = cx + Math.cos(a) * (R - 22), y2 = cy + Math.sin(a) * (R - 22);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={f ? YESIL : "var(--line-2)"} strokeWidth={9} strokeLinecap="round" opacity={0.85} />;
      })}
      {spermler.slice(0, kac).map((sp, i) => {
        const x = cx + Math.cos(sp.a) * sp.d * 0.6, y = cy + Math.sin(sp.a) * sp.d * 0.6;
        return (
          <g key={i}>
            <path d={`M${x} ${y} q 4 -3 7 0 t 7 0`} fill="none" stroke={MAVI} strokeWidth={1.1} transform={`rotate(${(sp.y * 180) / Math.PI} ${x} ${y})`} />
            <ellipse cx={x} cy={y} rx={3} ry={2.3} fill={MAVI} />
          </g>
        );
      })}
      {/* Leydig */}
      {[[166, 98], [178, 104], [170, 110]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6} fill={l ? MOR : "var(--line-2)"} fillOpacity={l ? 0.45 : 0.6} stroke={l ? MOR : "var(--muted)"} />
      ))}
      <text x={174} y={130} fontSize={10.5} fontWeight={700} fill={l ? MOR : "var(--muted)"} textAnchor="middle">Leydig</text>
      {l ? [0, 1, 2].map((k) => <circle key={k} cx={152 - k * 12} cy={112 + k * 8} r={2.6} fill={SARI} />) : null}
      <text x={cx} y={204} fontSize={10.5} fontWeight={700} fill={f ? YESIL : "var(--muted)"} textAnchor="middle">Sertoli (tüpçük duvarı)</text>
      {/* sağ panel */}
      <g fontSize={11} fontWeight={700}>
        <text x={214} y={36} fill="var(--muted)">Sertoli hücreleri</text>
        <text x={214} y={54} fontSize={13} fontWeight={800} fill={f ? YESIL : "var(--muted)"}>{f ? "spermi besliyor" : "uyarılmadı"}</text>
        <text x={214} y={86} fill="var(--muted)">Testosteron</text>
        <Cubuk x={214} y={93} w={112} oran={l} renk={SARI} />
        <text x={214} y={128} fill="var(--muted)">Sperm üretimi</text>
        <Cubuk x={214} y={135} w={112} oran={uretim} renk={MAVI} />
        <text x={214} y={164} fontSize={13} fontWeight={800} fill={uretim === 1 ? MAVI : "var(--muted)"}>{uretim === 1 ? "tam" : uretim ? "zayıf" : "yok"}</text>
      </g>
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {uretim === 1 ? "FSH ve LH birlikte: sperm üretimi tam" : f ? "FSH var ama testosteron yok: üretim zayıf" : l ? "Testosteron var ama Sertoli uyarılmadı: üretim zayıf" : "Hormon yok: tüpçükte sperm üretilmiyor"}
      </text>
    </svg>
  );
}

/* ---------- spermatogenez ve oogenez ---------- */

function Hucre({ x, y, r, n, kuyruk = false }: { x: number; y: number; r: number; n?: string; kuyruk?: boolean }) {
  return (
    <g>
      {kuyruk && <path d={`M${x + r} ${y} q 5 -4 10 0 t 10 0 t 10 0`} fill="none" stroke={MAVI} strokeWidth={1.4} />}
      <circle cx={x} cy={y} r={r} fill={kuyruk ? MAVI : "var(--biyoloji-soft)"} fillOpacity={kuyruk ? 0.3 : 1} stroke={kuyruk ? MAVI : YESIL} strokeWidth={1.4} />
      <circle cx={x} cy={y} r={Math.max(2, r * 0.32)} fill={MOR} fillOpacity={0.7} />
      {n && r >= 12 && <text x={x} y={y - r - 4} fontSize={9.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{n}</text>}
    </g>
  );
}

function Mayoz({ v, t, oynuyor, s }: SahneProps) {
  const kadin = (v.k ?? 0) === 1;
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const p1 = sinir((u - 0.08) / 0.3), p2 = sinir((u - 0.48) / 0.3), p3 = sinir((u - 0.84) / 0.16);
  const A: Nokta = [48, 110];
  // [başlangıç, mayoz I sonrası, mayoz II sonrası] konumları ve yarıçapları
  const erkek = {
    I: [{ p: [150, 70] as Nokta, r: 13 }, { p: [150, 150] as Nokta, r: 13 }],
    II: [
      { k: 0, p: [262, 42] as Nokta, r: 9 }, { k: 0, p: [262, 86] as Nokta, r: 9 },
      { k: 1, p: [262, 134] as Nokta, r: 9 }, { k: 1, p: [262, 178] as Nokta, r: 9 },
    ],
  };
  const disi = {
    I: [{ p: [150, 92] as Nokta, r: 21 }, { p: [150, 162] as Nokta, r: 6 }],
    II: [
      { k: 0, p: [258, 76] as Nokta, r: 21 }, { k: 0, p: [234, 150] as Nokta, r: 6 },
      { k: 1, p: [260, 150] as Nokta, r: 6 }, { k: 1, p: [286, 150] as Nokta, r: 6 },
    ],
  };
  const D = kadin ? disi : erkek;
  const r0 = kadin ? 24 : 18;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={kadin ? "Oogenez: 1 birincil oosit, 1 yumurta ve 3 kutup hücresi verir" : "Spermatogenez: 1 birincil spermatosit, 4 sperm verir"}>
      <text x={170} y={16} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {kadin ? "Oogenez: 1 birincil oosit (2n)" : "Spermatogenez: 1 birincil spermatosit (2n)"}
      </text>
      {p1 <= 0 && <Hucre x={A[0]} y={A[1]} r={r0} n="2n" />}
      {p1 > 0 && p2 <= 0 &&
        D.I.map((c, i) => <Hucre key={i} x={ara(A[0], c.p[0], p1)} y={ara(A[1], c.p[1], p1)} r={ara(r0 * 0.75, c.r, p1)} n="n" />)}
      {p2 > 0 &&
        D.II.map((c, i) => {
          const ana = D.I[c.k];
          return <Hucre key={i} x={ara(ana.p[0], c.p[0], p2)} y={ara(ana.p[1], c.p[1], p2)} r={ara(ana.r, c.r, p2)} n="n" kuyruk={!kadin && p3 > 0} />;
        })}
      {kadin && p2 >= 1 && (
        <g fontSize={10} fontWeight={700}>
          <text x={258} y={112} fill={YESIL} textAnchor="middle">yumurta</text>
          <text x={260} y={172} fill="var(--muted)" textAnchor="middle">kutup hücreleri</text>
        </g>
      )}
      {kadin && p1 >= 1 && p2 <= 0 && <text x={150} y={184} fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="middle">kutup hücresi</text>}
      <g fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={48} y={200}>birincil</text>
        <text x={150} y={200} fill={p1 > 0 ? "var(--ink)" : "var(--muted)"}>mayoz I</text>
        <text x={262} y={200} fill={p2 > 0 ? "var(--ink)" : "var(--muted)"}>mayoz II</text>
      </g>
      <text x={170} y={220} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0
          ? "Oynat ve bölünmeyi izle"
          : u < 1
            ? kadin ? "Sitoplazma eşit bölünmüyor; besin büyük hücrede kalıyor" : "Sitoplazma eşit bölünüyor"
            : kadin ? "1 oosit → 1 yumurta + 3 kutup hücresi" : "1 spermatosit → 4 sperm"}
      </text>
      {kadin && u >= 1 && <text x={170} y={36} fontSize={10} fill="var(--muted)" textAnchor="middle">Mayoz II yalnızca sperm girince tamamlanır</text>}
    </svg>
  );
}

/* ---------- menstrual döngü ---------- */

const FSH = (d: number) => 0.18 + 0.16 * gauss(d, 3, 3) + 0.3 * gauss(d, 13.5, 1);
const LH = (d: number) => 0.1 + 0.82 * gauss(d, 13.5, 0.9);
const OST = (d: number) => 0.1 + 0.62 * gauss(d, 12.3, 2.4) + 0.32 * gauss(d, 21, 3.5);
const PRO = (d: number) => 0.05 + 0.78 * gauss(d, 21, 3.4);
const ICZAR = (d: number) => (d <= 5 ? 0.65 - (0.5 * (d - 1)) / 4 : d <= 14 ? 0.15 + (0.45 * (d - 5)) / 9 : d <= 24 ? 0.6 + (0.4 * (d - 14)) / 10 : 1 - (0.1 * (d - 24)) / 4);

const HORMON = [
  { ad: "FSH", f: FSH, renk: MAVI, x: 40 },
  { ad: "LH", f: LH, renk: MOR, x: 92 },
  { ad: "östrojen", f: OST, renk: SARI, x: 134 },
  { ad: "progesteron", f: PRO, renk: KIRMIZI, x: 208 },
];

function Dongu({ v }: SahneProps) {
  const g = Math.round(sinir(v.g ?? 1, 1, 28));
  const X = (d: number) => 40 + ((d - 1) * 282) / 27;
  const Y = (h: number) => 118 - h * 90;
  const egri = (f: (d: number) => number) => {
    const p: string[] = [];
    for (let d = 1; d <= 28.001; d += 0.25) p.push(`${X(d).toFixed(1)},${Y(f(d)).toFixed(1)}`);
    return p.join(" ");
  };
  const zar: string[] = [`${X(1)},176`];
  for (let d = 1; d <= 28.001; d += 0.5) zar.push(`${X(d).toFixed(1)},${(176 - ICZAR(d) * 34).toFixed(1)}`);
  zar.push(`${X(28)},176`);
  const evre = g <= 5 ? "Menstruasyon" : g <= 12 ? "Folikül evresi" : g <= 14 ? "Ovulasyon" : "Korpus luteum evresi";
  const olay =
    g <= 5 ? "İç zar kanamayla dökülüyor" :
    g <= 12 ? "Folikül büyüyor, östrojen iç zarı kalınlaştırıyor" :
    g === 13 ? "LH tepede: oosit atılmak üzere" :
    g === 14 ? "LH tepesinin ardından oosit atılıyor" :
    g <= 25 ? "Sarı cisim progesteron salgılıyor" : "Döllenme yok: sarı cisim köreliyor";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Döngünün ${g}. günü: ${evre}. ${olay}`}>
      <g fontSize={10} fontWeight={700}>
        {HORMON.map((h) => (
          <g key={h.ad}>
            <line x1={h.x} x2={h.x + 12} y1={11} y2={11} stroke={h.renk} strokeWidth={3} strokeLinecap="round" />
            <text x={h.x + 16} y={14.5} fill="var(--ink)">{h.ad}</text>
          </g>
        ))}
      </g>
      <line x1={40} x2={322} y1={118} y2={118} stroke="var(--ink)" strokeWidth={1.2} />
      {HORMON.map((h) => <polyline key={h.ad} points={egri(h.f)} fill="none" stroke={h.renk} strokeWidth={2.2} strokeLinejoin="round" />)}
      <text x={40} y={138} fontSize={10} fontWeight={700} fill="var(--muted)">rahim iç zarı</text>
      <polygon points={zar.join(" ")} fill={KIRMIZI} fillOpacity={0.22} stroke={KIRMIZI} strokeOpacity={0.5} />
      <line x1={X(g)} x2={X(g)} y1={22} y2={178} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="3 3" />
      {HORMON.map((h) => <circle key={h.ad} cx={X(g)} cy={Y(h.f(g))} r={3.6} fill={h.renk} stroke="#fff" strokeWidth={1.2} />)}
      <g fontSize={9.5} fill="var(--muted)" textAnchor="middle">
        {[1, 7, 14, 21, 28].map((d) => <text key={d} x={X(d)} y={190}>{d}</text>)}
        <text x={X(28)} y={202} textAnchor="end" fontWeight={700}>gün</text>
      </g>
      <text x={170} y={210} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{g}. gün: {evre}</text>
      <text x={170} y={228} fontSize={11.5} fontWeight={700} fill={g === 13 || g === 14 ? MOR : "var(--muted)"} textAnchor="middle">{olay}</text>
    </svg>
  );
}

/* ---------- hCG ---------- */

const yumusak = (x: number) => 1 / (1 + Math.exp(-x));

function Hcg({ v, t, oynuyor, s }: SahneProps) {
  const e = (v.e ?? 0) === 1;
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const son = 14 + 28 * u;
  const X = (d: number) => 40 + ((d - 14) * 282) / 28;
  const Y = (h: number) => 116 - h * 86;
  const pro = (d: number) => {
    const yuk = 0.08 + 0.78 * sinir((d - 14) / 7);
    if (e) return d <= 21 ? yuk : 0.86 + 0.1 * sinir((d - 21) / 21);
    return d <= 21 ? yuk : 0.86 - 0.8 * sinir((d - 22) / 6);
  };
  const hcg = (d: number) => (e ? sinir(yumusak((d - 29) / 2.6) - yumusak((21 - 29) / 2.6)) : 0);
  const zar = (d: number) => (e ? 0.6 + 0.4 * sinir((d - 14) / 10) : d <= 27 ? 0.6 + 0.4 * sinir((d - 14) / 10) : d <= 32 ? 1 - (0.85 * (d - 27)) / 5 : 0.15 + 0.3 * sinir((d - 32) / 10));
  const egri = (f: (d: number) => number, y: (h: number) => number) => {
    const p: string[] = [];
    for (let d = 14; d <= son + 0.001; d += 0.25) p.push(`${X(d).toFixed(1)},${y(f(d)).toFixed(1)}`);
    return p.join(" ");
  };
  const zp: string[] = [`${X(14)},178`];
  for (let d = 14; d <= son + 0.001; d += 0.5) zp.push(`${X(d).toFixed(1)},${(178 - zar(d) * 34).toFixed(1)}`);
  zp.push(`${X(son)},178`);
  const sari = e ? 1 : 1 - sinir((son - 25) / 4);
  const durum =
    u <= 0 ? "Ovulasyon oldu; oynat ve izle" :
    e ? (son < 21 ? "Sarı cisim progesteron salgılıyor" : son < 26 ? "Embriyo yerleşti ve hCG salgılıyor" : "hCG sarı cismi yaşatıyor; kanama yok")
      : (son < 25 ? "Sarı cisim progesteron salgılıyor" : son < 29 ? "Döllenme yok: sarı cisim köreliyor" : "Progesteron düştü, iç zar döküldü");
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={e ? "Embriyo yerleşince hCG artar, progesteron yüksek kalır, iç zar dökülmez" : "Döllenme olmazsa progesteron düşer ve iç zar dökülür"}>
      <g fontSize={10} fontWeight={700}>
        <line x1={40} x2={52} y1={11} y2={11} stroke={KIRMIZI} strokeWidth={3} strokeLinecap="round" />
        <text x={56} y={14.5} fill="var(--ink)">progesteron</text>
        <line x1={132} x2={144} y1={11} y2={11} stroke={MOR} strokeWidth={3} strokeLinecap="round" />
        <text x={148} y={14.5} fill="var(--ink)">hCG</text>
        <circle cx={226} cy={11} r={6 * Math.max(0.25, sari)} fill={SARI} fillOpacity={0.8} />
        <text x={238} y={14.5} fill={sari > 0.3 ? "var(--ink)" : "var(--muted)"}>sarı cisim {sari > 0.3 ? "yaşıyor" : "köreldi"}</text>
      </g>
      <line x1={40} x2={322} y1={116} y2={116} stroke="var(--ink)" strokeWidth={1.2} />
      {e && son >= 21 && (
        <g>
          <line x1={X(21)} x2={X(21)} y1={26} y2={178} stroke={MOR} strokeDasharray="2 3" />
          <text x={X(21) + 4} y={34} fontSize={9.5} fontWeight={700} fill={MOR}>implantasyon</text>
        </g>
      )}
      {u > 0 && <polyline points={egri(pro, Y)} fill="none" stroke={KIRMIZI} strokeWidth={2.4} strokeLinejoin="round" />}
      {u > 0 && e && <polyline points={egri(hcg, Y)} fill="none" stroke={MOR} strokeWidth={2.4} strokeLinejoin="round" />}
      <text x={40} y={136} fontSize={10} fontWeight={700} fill="var(--muted)">rahim iç zarı</text>
      {u > 0 && <polygon points={zp.join(" ")} fill={KIRMIZI} fillOpacity={0.22} stroke={KIRMIZI} strokeOpacity={0.5} />}
      <line x1={40} x2={322} y1={178} y2={178} stroke="var(--line-2)" />
      <g fontSize={9.5} fill="var(--muted)" textAnchor="middle">
        {[14, 21, 28, 35, 42].map((d) => <text key={d} x={X(d)} y={190}>{d}</text>)}
        <text x={X(42)} y={202} textAnchor="end" fontWeight={700}>gün</text>
      </g>
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- zigottan implantasyona ---------- */

const YOL_A: Nokta[] = [[40, 128], [60, 116], [78, 84], [92, 70]];
const YOL_B: Nokta[] = [[92, 70], [110, 58], [150, 50], [190, 62], [220, 88], [236, 106], [256, 122], [282, 138], [296, 146]];

/** Evre: 0 oosit, 1 zigot, 2-4: 2/4/8 hücre, 5 morula, 6 blastosist. */
function Embriyo({ x, y, r, evre }: { x: number; y: number; r: number; evre: number }) {
  const halka = (n: number, rr: number, kr: number, a0 = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = a0 + (i / n) * Math.PI * 2;
      return <circle key={`${n}-${rr}-${i}`} cx={x + Math.cos(a) * rr} cy={y + Math.sin(a) * rr} r={kr} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={r > 20 ? 1.2 : 0.7} />;
    });
  let ic: React.ReactNode = null;
  if (evre <= 1) ic = <circle cx={x} cy={y} r={r * 0.28} fill={MOR} fillOpacity={0.6} />;
  else if (evre === 2) ic = halka(2, r * 0.48, r * 0.48);
  else if (evre === 3) ic = halka(4, r * 0.47, r * 0.44, Math.PI / 4);
  else if (evre === 4) ic = [...halka(7, r * 0.6, r * 0.34), <circle key="m" cx={x} cy={y} r={r * 0.3} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={r > 20 ? 1.2 : 0.7} />];
  else if (evre === 5) ic = [...halka(11, r * 0.7, r * 0.25), ...halka(5, r * 0.32, r * 0.22, 0.4), <circle key="m" cx={x} cy={y} r={r * 0.14} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={0.7} />];
  else
    ic = [
      ...halka(16, r * 0.84, r * 0.15),
      ...[[-0.42, -0.2], [-0.5, 0.12], [-0.3, 0.02], [-0.3, -0.32], [-0.28, 0.32]].map(([a, b], i) => (
        <circle key={`ic${i}`} cx={x + a * r} cy={y + b * r} r={r * 0.17} fill={YESIL} fillOpacity={0.35} stroke={YESIL} strokeWidth={r > 20 ? 1.2 : 0.7} />
      )),
    ];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={evre === 6 ? "#fff" : evre === 0 ? "var(--biyoloji-soft)" : "#fff"} stroke={YESIL} strokeWidth={r > 20 ? 1.6 : 1.1} />
      {ic}
    </g>
  );
}

const EVRE = [
  { ad: "oosit", gun: "", hucre: "" },
  { ad: "zigot", gun: "gün 0", hucre: "1 hücre" },
  { ad: "2 hücre", gun: "gün 1", hucre: "2 hücre" },
  { ad: "4 hücre", gun: "gün 2", hucre: "4 hücre" },
  { ad: "8 hücre", gun: "gün 3", hucre: "8 hücre" },
  { ad: "morula", gun: "gün 4", hucre: "16+ hücre" },
  { ad: "blastosist", gun: "gün 5", hucre: "100'e yakın hücre" },
];

function Zigot({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 7;
  const u = ilerleme(t, oynuyor, sure);
  const evre = u < 0.13 ? 0 : u < 0.22 ? 1 : u < 0.34 ? 2 : u < 0.46 ? 3 : u < 0.58 ? 4 : u < 0.72 ? 5 : 6;
  const gom = sinir((u - 0.9) / 0.1);
  let p: Nokta;
  if (u < 0.1) p = noktaAl(YOL_A, u / 0.1);
  else if (u < 0.16) p = YOL_B[0];
  else p = noktaAl(YOL_B, sinir((u - 0.16) / 0.74));
  if (gom > 0) p = [p[0] + 8 * gom, p[1] + 2 * gom];
  const spermler = u > 0.03 && u < 0.14 ? [0, 1, 2].map((k) => noktaAl([...YOL_B].reverse(), sinir((u - 0.03 - k * 0.012) / 0.09))) : [];
  const durum =
    u <= 0 ? "Oosit yumurtalıktan atılmak üzere" :
    u < 0.13 ? "Ovulasyon: oosit yumurta kanalına alındı" :
    u < 0.22 ? "Sperm kanalın üst kısmında oosite girdi: zigot" :
    u < 0.58 ? "Segmentasyon: hücre sayısı artıyor, boyut aynı" :
    u < 0.72 ? "Morula: hücreden bir top" :
    gom <= 0 ? "Blastosist: içi sıvılı top, rahme ulaştı" : "İmplantasyon: blastosist iç zara gömüldü (gün 6-7)";
  return (
    <svg viewBox="0 0 340 234" role="img" aria-label="Zigot yumurta kanalında bölünerek morula ve blastosist olur, rahim iç zarına gömülür">
      {/* rahim */}
      <rect x={226} y={78} width={98} height={124} rx={42} fill={KIRMIZI} fillOpacity={0.14} stroke={KIRMIZI} strokeOpacity={0.45} />
      <rect x={244} y={98} width={60} height={86} rx={26} fill="#fff" />
      <text x={275} y={216} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">rahim</text>
      {/* yumurta kanalı */}
      <polyline points={nokt(YOL_B.slice(0, 7))} fill="none" stroke="var(--panel)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={nokt([[58, 118], ...YOL_B.slice(0, 1), [110, 58]])} fill="none" stroke="var(--panel)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      <text x={150} y={30} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">yumurta kanalı</text>
      {/* yumurtalık */}
      <ellipse cx={34} cy={132} rx={22} ry={15} fill="var(--panel)" stroke="var(--line-2)" />
      <text x={6} y={162} fontSize={10.5} fontWeight={700} fill="var(--muted)">yumurtalık</text>
      {spermler.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={2.2} fill={MAVI} />)}
      <Embriyo x={p[0]} y={p[1]} r={7} evre={evre} />
      {/* büyütülmüş görünüm */}
      {u > 0 && (
        <g>
          <circle cx={172} cy={164} r={42} fill="none" stroke="var(--line-2)" strokeDasharray="3 3" />
          <Embriyo x={172} y={164} r={34} evre={evre} />
          <text x={96} y={154} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{EVRE[evre].ad}</text>
          <text x={96} y={170} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{EVRE[evre].gun}</text>
          {evre >= 2 && evre <= 4 && <text x={96} y={186} fontSize={10.5} fontWeight={700} fill={YESIL} textAnchor="middle">boyut aynı</text>}
        </g>
      )}
      <text x={170} y={230} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- germ tabakaları ---------- */

const ORGAN = [
  { ad: "Beyin ve omurilik", t: 0 },
  { ad: "Deri üst tabakası", t: 0 },
  { ad: "Kalp ve kan damarları", t: 1 },
  { ad: "Kemik ve kaslar", t: 1 },
  { ad: "Karaciğer ve pankreas", t: 2 },
];
const TABAKA = [
  { ad: "ektoderm", yer: "dış", renk: MAVI, r1: 70, r0: 58, kural: "Ektoderm: dış yüz ve sinir sistemi" },
  { ad: "mezoderm", yer: "orta", renk: KIRMIZI, r1: 58, r0: 45, kural: "Mezoderm: kas, kemik, kalp ve kan" },
  { ad: "endoderm", yer: "iç", renk: SARI, r1: 45, r0: 32, kural: "Endoderm: iç yüzeyler ve sindirim bezleri" },
];

function Germ({ v }: SahneProps) {
  const o = ORGAN[Math.round(sinir(v.o ?? 1, 1, ORGAN.length)) - 1];
  const tb = TABAKA[o.t];
  const cx = 88, cy = 106;
  const rOrta = (tb.r0 + tb.r1) / 2;
  const ax = cx + Math.cos(-0.35) * rOrta, ay = cy + Math.sin(-0.35) * rOrta;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${o.ad}: ${tb.ad}ten gelişir`}>
      {TABAKA.map((k, i) => (
        <circle key={k.ad} cx={cx} cy={cy} r={(k.r0 + k.r1) / 2} fill="none" stroke={k.renk} strokeWidth={k.r1 - k.r0 - 1} strokeOpacity={i === o.t ? 0.75 : 0.2} />
      ))}
      <circle cx={cx} cy={cy} r={31} fill="#fff" />
      <text x={cx} y={cy - 2} fontSize={9.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">ilkel</text>
      <text x={cx} y={cy + 10} fontSize={9.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">bağırsak</text>
      <line x1={ax} y1={ay} x2={196} y2={148} stroke={tb.renk} strokeWidth={1.6} />
      <circle cx={ax} cy={ay} r={3.4} fill={tb.renk} />
      <g fontSize={11} fontWeight={700}>
        {TABAKA.map((k, i) => (
          <g key={k.ad}>
            <rect x={200} y={26 + i * 24} width={11} height={11} rx={3} fill={k.renk} fillOpacity={i === o.t ? 0.9 : 0.3} />
            <text x={218} y={36 + i * 24} fill={i === o.t ? "var(--ink)" : "var(--muted)"} fontWeight={i === o.t ? 800 : 600}>{k.ad} ({k.yer})</text>
          </g>
        ))}
        <text x={200} y={130} fill="var(--muted)">Organ</text>
        <text x={200} y={150} fontSize={12} fontWeight={800} fill="var(--ink)">{o.ad}</text>
        <text x={200} y={170} fontSize={12} fontWeight={800} fill={tb.renk}>{tb.ad}ten gelişir</text>
      </g>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{tb.kural}</text>
    </svg>
  );
}

/* ================= POPÜLASYON VE KOMÜNİTE ================= */

/* ---------- doğum, ölüm, göç ---------- */

function Akis({ v }: SahneProps) {
  const g = sinir(v.g ?? 0, 0, 80);
  const S = 1.8, x0 = 70;
  const N = 500 + (60 + g) - (80 + 20);
  const renk = N === 500 ? YESIL : N > 500 ? MAVI : KIRMIZI;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Artış ${60 + g}, azalış 100; bir yıl sonra ${N} kuş`}>
      <text x={170} y={18} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">Başlangıç: 500 kuş</text>
      <g fontSize={11} fontWeight={700}>
        <text x={14} y={53} fill="var(--muted)">Artış</text>
        <rect x={x0} y={42} width={60 * S} height={16} rx={4} fill={YESIL} />
        {g > 0 && <rect x={x0 + 60 * S} y={42} width={g * S} height={16} rx={4} fill={MAVI} />}
        <text x={x0} y={74} fill={YESIL}>doğum 60</text>
        <text x={x0 + 60 * S + 4} y={74} fill={MAVI}>göçle gelen {g}</text>
        <text x={14} y={113} fill="var(--muted)">Azalış</text>
        <rect x={x0} y={102} width={80 * S} height={16} rx={4} fill={KIRMIZI} />
        <rect x={x0 + 80 * S} y={102} width={20 * S} height={16} rx={4} fill={SARI} />
        <text x={x0} y={134} fill={KIRMIZI}>ölüm 80</text>
        <text x={x0 + 80 * S + 4} y={134} fill="#a77a06">göçle giden 20</text>
      </g>
      <line x1={x0 + 100 * S} x2={x0 + 100 * S} y1={36} y2={62} stroke="var(--ink)" strokeDasharray="3 3" />
      <line x1={x0 + 100 * S} x2={x0 + 100 * S} y1={96} y2={122} stroke="var(--ink)" strokeDasharray="3 3" />
      <text x={170} y={170} fontSize={15} fontWeight={800} fill={renk} textAnchor="middle">Bir yıl sonra: {sayi(N)} kuş</text>
      <text x={170} y={194} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        ΔN = (60 + {g}) − (80 + 20) = {N - 500 > 0 ? "+" : ""}{N - 500}
      </text>
    </svg>
  );
}

/* ---------- dağılım tipleri ---------- */

const DAGILIM = [
  { ad: "Kümeli dağılım", neden: "Kaynak öbek öbek; sürü ya da aile hâlinde yaşam" },
  { ad: "Düzenli dağılım", neden: "Bölge savunması ya da kaynak rekabeti" },
  { ad: "Rastgele dağılım", neden: "Kaynak her yerde eşit, etkileşim zayıf" },
];

function dagilimNoktalari(tip: number): Nokta[] {
  const r = rastgele(31 + tip);
  if (tip === 0) {
    const m: Nokta[] = [[38, 40], [120, 52], [56, 122], [128, 128]];
    return Array.from({ length: 24 }, (_, i) => {
      const [x, y] = m[i % 4];
      const a = r() * Math.PI * 2, d = 4 + r() * 13;
      return [x + Math.cos(a) * d, y + Math.sin(a) * d] as Nokta;
    });
  }
  if (tip === 1) return Array.from({ length: 24 }, (_, i) => [14 + (i % 6) * 26.4 + (r() - 0.5) * 3, 20 + Math.floor(i / 6) * 40 + (r() - 0.5) * 3] as Nokta);
  return Array.from({ length: 24 }, () => [8 + r() * 144, 8 + r() * 144] as Nokta);
}

function Dagilim({ v }: SahneProps) {
  const tip = Math.round(sinir(v.d ?? 1, 1, 3)) - 1;
  const n = dagilimNoktalari(tip);
  const x0 = 90, y0 = 28;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`${DAGILIM[tip].ad}: 24 birey, ${DAGILIM[tip].neden}`}>
      <text x={170} y={18} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{DAGILIM[tip].ad}</text>
      <rect x={x0} y={y0} width={160} height={160} rx={10} fill="var(--panel)" stroke="var(--line-2)" />
      {n.map(([x, y], i) => <circle key={i} cx={x0 + x} cy={y0 + y} r={4.2} fill={YESIL} stroke="#fff" strokeWidth={1} />)}
      <text x={170} y={204} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">Yoğunluk aynı: 24 birey / alan</text>
      <text x={170} y={222} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{DAGILIM[tip].neden}</text>
    </svg>
  );
}

/* ---------- J eğrisi ---------- */

const UST = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸"];

function JEgrisi({ v }: SahneProps) {
  const n = Math.round(sinir(v.n ?? 0, 0, 8));
  const X = (k: number) => 50 + k * 33;
  const Y = (N: number) => 176 - (N / 2560) * 148;
  const nokta = Array.from({ length: n + 1 }, (_, k) => [X(k), Y(10 * 2 ** k)] as Nokta);
  const N = 10 * 2 ** n;
  const [px, py] = nokta[n];
  const asti = N > 1000;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${n}. nesil: ${N} bakteri`}>
      <line x1={46} x2={322} y1={176} y2={176} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={46} x2={46} y1={24} y2={176} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={46} x2={322} y1={Y(1000)} y2={Y(1000)} stroke={KIRMIZI} strokeDasharray="4 4" />
      <text x={318} y={Y(1000) - 5} fontSize={10} fontWeight={700} fill={KIRMIZI} textAnchor="end">1 000</text>
      <g fontSize={9.5} fill="var(--muted)" textAnchor="end">
        <text x={42} y={Y(0) + 3}>0</text>
        <text x={42} y={Y(2000) + 3}>2 000</text>
      </g>
      <g fontSize={9.5} fill="var(--muted)" textAnchor="middle">
        {Array.from({ length: 9 }, (_, k) => <text key={k} x={X(k)} y={190}>{k}</text>)}
        <text x={322} y={204} textAnchor="end" fontWeight={700}>nesil</text>
      </g>
      <text x={52} y={20} fontSize={10} fontWeight={700} fill="var(--muted)">bakteri sayısı</text>
      {n > 0 && <polyline points={nokt(nokta)} fill="none" stroke={YESIL} strokeWidth={2.4} strokeLinejoin="round" />}
      {nokta.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k === n ? 5.5 : 3.4} fill={k === n ? (asti ? KIRMIZI : YESIL) : YESIL} stroke="#fff" strokeWidth={1.2} />)}
      <text x={px > 240 ? px - 10 : px + 10} y={py - 8} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor={px > 240 ? "end" : "start"}>{sayi(N)}</text>
      <text x={170} y={218} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {n}. nesil: 10 × 2{UST[n]} = {sayi(N)} bakteri
      </text>
    </svg>
  );
}

/* ---------- S eğrisi ---------- */

const K = 1000, R = 0.4, N0 = 10;
const lojistik = (t: number) => K / (1 + (K / N0 - 1) * Math.exp(-R * t));
const artis = (N: number) => R * N * (1 - N / K);

function SEgrisi({ v }: SahneProps) {
  const N = sinir(v.n ?? 100, 50, 950);
  const tN = Math.log((K / N0 - 1) / (K / N - 1)) / R;
  const X = (t: number) => 46 + (t * 274) / 25;
  const Y = (n: number) => 112 - (n / K) * 86;
  const XN = (n: number) => 46 + (n / K) * 274;
  const YA = (a: number) => 194 - (a / 100) * 46;
  const s: string[] = [], p: string[] = [];
  for (let t = 0; t <= 25; t += 0.25) s.push(`${X(t).toFixed(1)},${Y(lojistik(t)).toFixed(1)}`);
  for (let n = 0; n <= K; n += 20) p.push(`${XN(n).toFixed(1)},${YA(artis(n)).toFixed(1)}`);
  const A = artis(N);
  const egim = (A * 86) / K / (274 / 25); // piksel cinsinden eğim
  const en = A >= 99;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`N = ${N}: birim zamandaki artış yaklaşık ${Math.round(A)} birey`}>
      {/* üst: S eğrisi */}
      <line x1={46} x2={322} y1={112} y2={112} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={46} x2={46} y1={20} y2={112} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={46} x2={322} y1={Y(K)} y2={Y(K)} stroke={KIRMIZI} strokeDasharray="4 4" />
      <text x={320} y={Y(K) - 5} fontSize={10} fontWeight={700} fill={KIRMIZI} textAnchor="end">K = 1 000</text>
      <polyline points={s.join(" ")} fill="none" stroke={YESIL} strokeWidth={2.4} />
      <line x1={X(tN) - 20} x2={X(tN) + 20} y1={Y(N) + 20 * egim} y2={Y(N) - 20 * egim} stroke={MAVI} strokeWidth={2} strokeLinecap="round" />
      <circle cx={X(tN)} cy={Y(N)} r={5} fill={MAVI} stroke="#fff" strokeWidth={1.2} />
      <g fontSize={9.5} fill="var(--muted)">
        <text x={42} y={Y(0) + 3} textAnchor="end">0</text>
        <text x={42} y={Y(500) + 3} textAnchor="end">500</text>
        <text x={50} y={16} fontWeight={700}>N</text>
        <text x={322} y={124} fontWeight={700} textAnchor="end">zaman</text>
      </g>
      {/* alt: artış */}
      <line x1={46} x2={322} y1={194} y2={194} stroke="var(--ink)" strokeWidth={1.2} />
      <polyline points={p.join(" ")} fill="none" stroke={MAVI} strokeWidth={2} strokeOpacity={0.7} />
      <line x1={XN(N)} x2={XN(N)} y1={194} y2={YA(A)} stroke={MAVI} strokeDasharray="3 3" />
      <circle cx={XN(N)} cy={YA(A)} r={5} fill={en ? KIRMIZI : MAVI} stroke="#fff" strokeWidth={1.2} />
      <g fontSize={9.5} fill="var(--muted)">
        <text x={50} y={142} fontWeight={700}>yıllık artış</text>
        <text x={XN(0)} y={206} textAnchor="middle">0</text>
        <text x={XN(500)} y={206} textAnchor="middle">500</text>
        <text x={XN(1000)} y={206} textAnchor="middle">1 000</text>
        <text x={XN(1000)} y={142} textAnchor="end" fontWeight={700}>N</text>
      </g>
      <text x={170} y={228} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        N = {sayi(N)}: artış ≈ {Math.round(A)} birey/yıl{en ? " (en hızlı)" : N > 600 ? ", K'ya yaklaştıkça azalıyor" : ""}
      </text>
    </svg>
  );
}

/* ---------- sınırlayıcı faktörler ---------- */

const YOGUNLUK = [
  { ad: "seyrek", n: 10 },
  { ad: "orta", n: 24 },
  { ad: "kalabalık", n: 48 },
];
const OLAY = [
  { ad: "Salgın hastalık", oran: [0.1, 0.3, 0.6] },
  { ad: "Don", oran: [0.4, 0.4, 0.4] },
];

function Faktor({ v }: SahneProps) {
  const y = Math.round(sinir(v.y ?? 1, 1, 3)) - 1;
  const o = Math.round(sinir(v.o ?? 1, 1, 2)) - 1;
  const ol = OLAY[o], yo = YOGUNLUK[y];
  const r = rastgele(7 + y);
  const nokta = Array.from({ length: yo.n }, () => [22 + r() * 148, 38 + r() * 140] as Nokta);
  const olen = Math.round(ol.oran[y] * yo.n);
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${ol.ad}, ${yo.ad} popülasyon: bireylerin yüzde ${Math.round(ol.oran[y] * 100)}'i öldü`}>
      <text x={96} y={20} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ol.ad} · {yo.ad}</text>
      <rect x={14} y={30} width={164} height={156} rx={10} fill="var(--panel)" stroke="var(--line-2)" />
      {nokta.map(([x, yy], i) =>
        i < olen ? (
          <g key={i} stroke={KIRMIZI} strokeWidth={1.6}>
            <line x1={x - 3.5} x2={x + 3.5} y1={yy - 3.5} y2={yy + 3.5} />
            <line x1={x - 3.5} x2={x + 3.5} y1={yy + 3.5} y2={yy - 3.5} />
          </g>
        ) : (
          <circle key={i} cx={x} cy={yy} r={4} fill={YESIL} stroke="#fff" strokeWidth={1} />
        ),
      )}
      <text x={262} y={20} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">Ölen oranı</text>
      {YOGUNLUK.map((k, i) => {
        const x = 210 + i * 44, h = ol.oran[i] * 120;
        return (
          <g key={k.ad}>
            <rect x={x} y={170 - h} width={30} height={h} rx={4} fill={KIRMIZI} fillOpacity={i === y ? 0.85 : 0.25} />
            <text x={x + 15} y={164 - h} fontSize={10.5} fontWeight={800} fill={i === y ? "var(--ink)" : "var(--muted)"} textAnchor="middle">%{Math.round(ol.oran[i] * 100)}</text>
            <text x={x + 15} y={184} fontSize={9.5} fontWeight={700} fill={i === y ? "var(--ink)" : "var(--muted)"} textAnchor="middle">{k.ad}</text>
          </g>
        );
      })}
      <line x1={204} x2={336} y1={170} y2={170} stroke="var(--ink)" />
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {o === 0 ? "Salgın kalabalıkta daha çok öldürüyor: yoğunluğa bağlı" : "Don her yoğunlukta aynı oranda: yoğunluktan bağımsız"}
      </text>
    </svg>
  );
}

/* ---------- av-avcı döngüsü ---------- */

const AV = (yil: number) => 50 + 38 * Math.sin((2 * Math.PI * yil) / 10);
const AVCI = (yil: number) => 20 + 12 * Math.sin((2 * Math.PI * (yil - 2.5)) / 10);

function AvAvci({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 7;
  const u = ilerleme(t, oynuyor, sure);
  const son = 20 * u;
  const X = (yil: number) => 40 + yil * 14;
  const Y = (n: number) => 172 - n * 1.4;
  const egri = (f: (y: number) => number) => {
    const p: string[] = [];
    for (let yil = 0; yil <= son + 0.001; yil += 0.1) p.push(`${X(yil).toFixed(1)},${Y(f(yil)).toFixed(1)}`);
    return p.join(" ");
  };
  const evre = son % 10;
  const durum =
    u <= 0 ? "Oynat ve iki popülasyonu izle" :
    u >= 1 ? "Avcının tepesi her döngüde avınkinden sonra geliyor" :
    evre < 2.5 ? "Av çoğalıyor; avcının besini artıyor" :
    evre < 5 ? "Avcı çoğaldıkça av azalmaya başladı" :
    evre < 7.5 ? "Av azaldı; besini azalan avcı da azalıyor" : "Avcı azalınca av yeniden çoğalıyor";
  const tepeler = [2.5, 12.5].filter((y) => y <= son);
  const avciTepe = [5, 15].filter((y) => y <= son);
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Kar tavşanı ve vaşak sayıları döngüsel iner çıkar; vaşağın tepesi tavşanınkinden sonra gelir">
      <g fontSize={10.5} fontWeight={700}>
        <line x1={40} x2={52} y1={13} y2={13} stroke={MAVI} strokeWidth={3} strokeLinecap="round" />
        <text x={56} y={16.5} fill="var(--ink)">kar tavşanı (av)</text>
        <line x1={170} x2={182} y1={13} y2={13} stroke={KIRMIZI} strokeWidth={3} strokeLinecap="round" />
        <text x={186} y={16.5} fill="var(--ink)">vaşak (avcı)</text>
      </g>
      <line x1={40} x2={322} y1={172} y2={172} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={40} x2={40} y1={26} y2={172} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={44} y={32} fontSize={9.5} fontWeight={700} fill="var(--muted)">birey sayısı</text>
      {u > 0 && <polyline points={egri(AV)} fill="none" stroke={MAVI} strokeWidth={2.4} />}
      {u > 0 && <polyline points={egri(AVCI)} fill="none" stroke={KIRMIZI} strokeWidth={2.4} />}
      {tepeler.map((y) => <line key={`a${y}`} x1={X(y)} x2={X(y)} y1={Y(AV(y))} y2={172} stroke={MAVI} strokeDasharray="2 3" />)}
      {avciTepe.map((y) => <line key={`b${y}`} x1={X(y)} x2={X(y)} y1={Y(AVCI(y))} y2={172} stroke={KIRMIZI} strokeDasharray="2 3" />)}
      {avciTepe.length > 0 && (
        <g>
          <line x1={X(2.5)} x2={X(5)} y1={180} y2={180} stroke="var(--ink)" strokeWidth={1.2} />
          <text x={X(3.75)} y={194} fontSize={9.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">gecikme</text>
        </g>
      )}
      <g fontSize={9.5} fill="var(--muted)" textAnchor="middle">
        <text x={X(10)} y={184}>10</text>
        <text x={X(20)} y={184}>20</text>
        <text x={X(20)} y={196} textAnchor="end" fontWeight={700}>yıl</text>
      </g>
      <text x={170} y={218} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- Gause deneyi ---------- */

const log = (d: number, k: number, r: number) => k / (1 + (k / 2 - 1) * Math.exp(-r * d));
const AUR = (d: number) => log(d, 100, 0.8);
const CAU = (d: number, ayni: boolean) => (ayni ? log(d, 70, 0.6) * Math.exp(-Math.max(0, d - 5) * 0.35) : log(d, 70, 0.6));

function Gause({ v, t, oynuyor, s }: SahneProps) {
  const ayni = (v.k ?? 0) === 1;
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const son = 16 * u;
  const X = (d: number) => 40 + d * 17.5;
  const Y = (n: number) => 172 - n * 1.28;
  const egri = (f: (d: number) => number) => {
    const p: string[] = [];
    for (let d = 0; d <= son + 0.001; d += 0.1) p.push(`${X(d).toFixed(1)},${Y(f(d)).toFixed(1)}`);
    return p.join(" ");
  };
  const durum =
    u <= 0 ? (ayni ? "İki tür aynı kapta, aynı besinle" : "İki tür ayrı kaplarda, aynı besinle") :
    !ayni ? (u < 1 ? "İkisi de çoğalıyor" : "Ayrı kaplarda ikisi de çoğaldı ve dengelendi") :
    son < 6 ? "İkisi de çoğalıyor; besin azalıyor" : u < 1 ? "Besini paylaşamayan P. caudatum azalıyor" : "P. caudatum yok oldu, P. aurelia kaldı";
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={ayni ? "Aynı kapta P. aurelia çoğalır, P. caudatum yok olur" : "Ayrı kaplarda iki Paramecium türü de çoğalır"}>
      <g fontSize={10.5} fontWeight={700}>
        <line x1={40} x2={52} y1={13} y2={13} stroke={MAVI} strokeWidth={3} strokeLinecap="round" />
        <text x={56} y={16.5} fill="var(--ink)" fontStyle="italic">P. aurelia</text>
        <line x1={140} x2={152} y1={13} y2={13} stroke={KIRMIZI} strokeWidth={3} strokeLinecap="round" />
        <text x={156} y={16.5} fill="var(--ink)" fontStyle="italic">P. caudatum</text>
        <text x={322} y={16.5} fill={ayni ? MOR : "var(--muted)"} textAnchor="end">{ayni ? "aynı kap" : "ayrı kaplar"}</text>
      </g>
      <line x1={40} x2={322} y1={172} y2={172} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={40} x2={40} y1={30} y2={172} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={44} y={40} fontSize={9.5} fontWeight={700} fill="var(--muted)">birey sayısı</text>
      {u > 0 && <polyline points={egri(AUR)} fill="none" stroke={MAVI} strokeWidth={2.4} />}
      {u > 0 && <polyline points={egri((d) => CAU(d, ayni))} fill="none" stroke={KIRMIZI} strokeWidth={2.4} />}
      <g fontSize={9.5} fill="var(--muted)" textAnchor="middle">
        {[0, 4, 8, 12, 16].map((d) => <text key={d} x={X(d)} y={186}>{d}</text>)}
        <text x={X(16)} y={198} textAnchor="end" fontWeight={700}>gün</text>
      </g>
      <text x={170} y={218} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

export const BIYOLOJI13: Record<string, SahneKaydi> = {
  "biy13-sperm": { C: Sperm },
  "biy13-testis": { C: Testis },
  "biy13-mayoz": { C: Mayoz },
  "biy13-dongu": { C: Dongu },
  "biy13-hcg": { C: Hcg },
  "biy13-zigot": { C: Zigot },
  "biy13-germ": { C: Germ },
  "biy13-akis": { C: Akis },
  "biy13-dagilim": { C: Dagilim },
  "biy13-j": { C: JEgrisi },
  "biy13-s": { C: SEgrisi },
  "biy13-faktor": { C: Faktor },
  "biy13-avavci": { C: AvAvci },
  "biy13-gause": { C: Gause },
};
