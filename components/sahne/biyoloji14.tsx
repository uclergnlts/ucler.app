"use client";
// Biyoloji sahneleri (evrim): gen havuzu ve alel frekansı, kazanılmış özellik, antibiyotik direnci,
// seçilim tipleri, Hardy–Weinberg dengesi, genetik sürüklenme, türleşme, homolog ve analog yapılar.
import { rastgele, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";
const virgul = (x: number, b = 1) => x.toFixed(b).replace(".", ",");

/* ---------- gen havuzu ---------- */

const KUSAKLAR = [
  { ad: "1. kuşak", g: ["Aa", "Aa", "Aa", "aa", "aa"] },
  { ad: "5. kuşak", g: ["AA", "Aa", "Aa", "Aa", "aa"] },
  { ad: "10. kuşak", g: ["AA", "AA", "AA", "Aa", "Aa"] },
];

const alelRenk = (a: string) => (a === "A" ? MAVI : SARI);

function Havuz({ v }: SahneProps) {
  const k = sinir(Math.round(v.k ?? 1), 1, 3) - 1;
  const { ad, g } = KUSAKLAR[k];
  const alel = g.join("").split("");
  const fA = alel.filter((a) => a === "A").length / alel.length;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${ad}: beş birey, gen havuzunda A frekansı ${virgul(fA)}, a frekansı ${virgul(1 - fA)}`}>
      <text x={170} y={18} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ad}: yeni bireyler</text>
      {g.map((gen, i) => {
        const x = 38 + i * 66;
        return (
          <g key={i}>
            <circle cx={x} cy={40} r={9} fill="var(--panel)" stroke="var(--line-2)" strokeWidth={1.3} />
            <rect x={x - 17} y={52} width={34} height={30} rx={10} fill="var(--panel)" stroke="var(--line-2)" strokeWidth={1.3} />
            {gen.split("").map((a, j) => (
              <circle key={j} cx={x - 7 + j * 14} cy={67} r={5.5} fill={alelRenk(a)} />
            ))}
            <text x={x} y={98} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{gen}</text>
          </g>
        );
      })}
      {/* gen havuzu */}
      <text x={20} y={124} fontSize={11} fontWeight={700} fill="var(--muted)">gen havuzu: 10 alel</text>
      {[...alel].sort().map((a, i) => (
        <circle key={i} cx={28 + i * 17} cy={140} r={6} fill={alelRenk(a)} />
      ))}
      {/* frekans çubuğu */}
      <rect x={20} y={160} width={300} height={14} rx={7} fill={SARI} />
      <rect x={20} y={160} width={300 * fA} height={14} rx={7} fill={MAVI} />
      <text x={20} y={190} fontSize={12} fontWeight={800} fill={MAVI}>A: {virgul(fA)}</text>
      <text x={320} y={190} fontSize={12} fontWeight={800} fill="#a77a06" textAnchor="end">a: {virgul(1 - fA)}</text>
      <text x={170} y={216} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {k === 0 ? "Bir bireyin genotipi ömrü boyunca değişmez" : k === 1 ? "Yeni kuşakta A alelinin payı arttı" : "A frekansı 0,3'ten 0,8'e çıktı: popülasyon evrimleşti"}
      </text>
    </svg>
  );
}

/* ---------- kazanılmış özellik: halterci ve çocuğu ---------- */

function Kisi({ x, y, kol, olcek = 1, renk = "var(--ink)" }: { x: number; y: number; kol: number; olcek?: number; renk?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${olcek})`}>
      <circle cx={0} cy={-58} r={11} fill="var(--panel)" stroke={renk} strokeWidth={1.6} />
      <rect x={-13} y={-45} width={26} height={42} rx={9} fill="var(--panel)" stroke={renk} strokeWidth={1.6} />
      {[-1, 1].map((y) => (
        <ellipse key={y} cx={y * (17 + kol * 0.4)} cy={-30} rx={4 + kol} ry={13} fill="var(--panel)" stroke={renk} strokeWidth={1.6} />
      ))}
      <line x1={-6} x2={-7} y1={-3} y2={22} stroke={renk} strokeWidth={4} strokeLinecap="round" />
      <line x1={6} x2={7} y1={-3} y2={22} stroke={renk} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function Sarmal({ x, y, renk }: { x: number; y: number; renk: string }) {
  const a = Array.from({ length: 25 }, (_, i) => [x - 24 + i * 2, y + 6 * Math.sin(i / 2.4)]);
  const b = a.map(([px], i) => [px, y - 6 * Math.sin(i / 2.4)]);
  const yol = (p: number[][]) => p.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join(" ");
  return (
    <g>
      <path d={yol(a)} fill="none" stroke={renk} strokeWidth={1.8} />
      <path d={yol(b)} fill="none" stroke={renk} strokeWidth={1.8} opacity={0.6} />
    </g>
  );
}

function Lamarck({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const kas = 7 * sinir(u / 0.35);
  const gamet = sinir((u - 0.35) / 0.3);
  const bebek = sinir((u - 0.68) / 0.25);
  const sx = ara(92, 196, gamet);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Halterci babanın kasları büyür, ama spermindeki DNA değişmez; çocuk normal kaslarla doğar">
      <Kisi x={60} y={150} kol={kas} renk={u > 0 && u < 0.35 ? KIRMIZI : "var(--ink)"} />
      {/* halter */}
      <g opacity={u < 0.35 ? 1 : 0.35}>
        <line x1={14} x2={106} y1={88 - 8 * Math.abs(Math.sin(u * 30))} y2={88 - 8 * Math.abs(Math.sin(u * 30))} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
      </g>
      <text x={60} y={192} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">baba</text>
      <text x={60} y={208} fontSize={10.5} fontWeight={700} fill={kas > 0 ? KIRMIZI : "var(--muted)"} textAnchor="middle">{kas > 6 ? "kasları büyüdü" : "çalışıyor"}</text>
      {/* gamet */}
      {gamet > 0 && (
        <g>
          <circle cx={sx} cy={100} r={7} fill={MAVI} fillOpacity={0.25} stroke={MAVI} strokeWidth={1.4} />
          <path d={`M${sx - 7} 100 q-8 -6 -14 0 q-6 6 -12 0`} fill="none" stroke={MAVI} strokeWidth={1.4} />
          <text x={sx} y={82} fontSize={10.5} fontWeight={700} fill={MAVI} textAnchor="middle">sperm</text>
        </g>
      )}
      <g opacity={gamet > 0.2 ? 1 : 0}>
        <Sarmal x={146} y={140} renk={MAVI} />
        <text x={146} y={164} fontSize={10.5} fontWeight={700} fill={MAVI} textAnchor="middle">gametin DNA'sı</text>
        <text x={146} y={178} fontSize={10.5} fontWeight={700} fill={MAVI} textAnchor="middle">değişmedi</text>
      </g>
      {/* çocuk */}
      <g opacity={bebek}>
        <Kisi x={262} y={170} kol={0} olcek={0.62} />
        <text x={262} y={192} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">çocuk</text>
        <text x={262} y={208} fontSize={10.5} fontWeight={700} fill={YESIL} textAnchor="middle">normal kaslarla doğdu</text>
      </g>
      <text x={170} y={22} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u === 0 ? "Baba yıllarca ağırlık çalışıyor" : u < 0.35 ? "Kas hücreleri büyüyor" : u < 0.68 ? "Yavruya yalnızca gametteki DNA geçer" : "Kazanılmış özellik kalıtılmaz"}
      </text>
    </svg>
  );
}

/* ---------- antibiyotik direnci ---------- */

const BAK = (() => {
  const r = rastgele(1407);
  const yer: { x: number; y: number; a: number; direncli: boolean }[] = [];
  for (let sira = 0; sira < 8; sira++)
    for (let k = 0; k < 8; k++) {
      const x = 170 - 91 + k * 26 + (sira % 2) * 13, y = 101 - 84 + sira * 24;
      if (Math.hypot(x - 170, y - 101) < 76) yer.push({ x: x + (r() - 0.5) * 6, y: y + (r() - 0.5) * 6, a: r() * 180, direncli: false });
    }
  const secilen = yer.map((b) => ({ b, k: r() })).sort((a, b) => a.k - b.k).slice(0, 28).map(({ b }) => b);
  [5, 14, 22].forEach((i) => (secilen[i].direncli = true));

  return secilen;
})();

function Bakteri({ x, y, a, renk, op = 1 }: { x: number; y: number; a: number; renk: string; op?: number }) {
  return <rect x={x - 10} y={y - 4.5} width={20} height={9} rx={4.5} fill={renk} fillOpacity={0.35 * op} stroke={renk} strokeOpacity={op} strokeWidth={1.5} transform={`rotate(${a} ${x} ${y})`} />;
}

function Antibiyotik({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 7;
  const u = ilerleme(t, oynuyor, sure);
  const ilac = sinir((u - 0.15) / 0.1);
  const olum = sinir((u - 0.25) / 0.25);
  const bolun = sinir((u - 0.55) / 0.4);
  const yeniSayi = Math.round(bolun * 25);
  const bos = BAK.filter((b) => !b.direncli);
  const canli = 28 - Math.round(olum * 25) + yeniSayi;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Petri kabında 28 bakteri, 3'ü önceden dirençli; antibiyotik duyarlıları öldürür, dirençliler çoğalır">
      <circle cx={170} cy={101} r={92} fill={MAVI} fillOpacity={0.1 * ilac} stroke="var(--line-2)" strokeWidth={1.6} />
      {BAK.map((b, i) => (b.direncli ? <Bakteri key={i} {...b} renk={MOR} /> : <Bakteri key={i} {...b} renk={YESIL} op={1 - olum * 0.85} />))}
      {bos.slice(0, yeniSayi).map((b, i) => (
        <Bakteri key={"y" + i} x={b.x} y={b.y} a={b.a + 40} renk={MOR} />
      ))}
      {ilac > 0 && ilac < 1 && <text x={170} y={14} fontSize={11} fontWeight={700} fill={MAVI} textAnchor="middle">antibiyotik ekleniyor</text>}
      <g fontSize={10.5} fontWeight={700}>
        <rect x={276} y={30} width={14} height={7} rx={3.5} fill={YESIL} fillOpacity={0.35} stroke={YESIL} />
        <text x={294} y={37} fill="var(--muted)">duyarlı</text>
        <rect x={276} y={48} width={14} height={7} rx={3.5} fill={MOR} fillOpacity={0.35} stroke={MOR} />
        <text x={294} y={55} fill="var(--muted)">dirençli</text>
        <text x={14} y={37} fill="var(--muted)">canlı</text>
        <text x={14} y={56} fontSize={15} fontWeight={800} fill="var(--ink)">{canli}</text>
      </g>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u === 0 ? "28 bakteri; 3'ü rastgele bir mutasyonla zaten dirençli" : u < 0.25 ? "Antibiyotik verildi" : u < 0.55 ? "Duyarlı bakteriler ölüyor" : u < 1 ? "Dirençliler bölünerek çoğalıyor" : "Kap artık dirençli bakterilerle dolu"}
      </text>
    </svg>
  );
}

/* ---------- seçilim tipleri ---------- */

const SECILIM = [
  { ad: "Yönlendirici seçilim", not: "Bir uç kayırıldı: ortalama kaydı", f: (x: number) => Math.exp(-((x - 1) ** 2) / 2) },
  { ad: "Dengeleyici seçilim", not: "Ortalama kayırıldı: iki uç elendi", f: (x: number) => Math.exp(-(x ** 2) / (2 * 0.5 ** 2)) },
  { ad: "Ayırıcı seçilim", not: "İki uç kayırıldı: iki grup oluşuyor", f: (x: number) => 0.85 * (Math.exp(-((x + 1.5) ** 2) / (2 * 0.55 ** 2)) + Math.exp(-((x - 1.5) ** 2) / (2 * 0.55 ** 2))) },
];

function Secilim({ v }: SahneProps) {
  const k = sinir(Math.round(v.t ?? 1), 1, 3) - 1;
  const S = SECILIM[k];
  const x0 = 30, x1 = 310, yT = 170, h = 110;
  const X = (z: number) => ara(x0, x1, (z + 3.2) / 6.4);
  const once = (z: number) => Math.exp(-(z ** 2) / 2);
  const egri = (f: (z: number) => number) =>
    Array.from({ length: 81 }, (_, i) => {
      const z = -3.2 + (6.4 * i) / 80;
      return `${i ? "L" : "M"}${X(z).toFixed(1)} ${(yT - h * f(z)).toFixed(1)}`;
    }).join(" ");
  const elenen = k === 0 ? [[-3.2, -0.6]] : k === 1 ? [[-3.2, -1.2], [1.2, 3.2]] : [[-0.6, 0.6]];
  return (
    <svg viewBox="0 0 340 234" role="img" aria-label={`${S.ad}: ${S.not}`}>
      <text x={170} y={20} fontSize={13} fontWeight={800} fill={YESIL} textAnchor="middle">{S.ad}</text>
      {elenen.map(([a, b], i) => (
        <g key={i}>
          <rect x={X(a)} y={34} width={X(b) - X(a)} height={yT - 34} fill={KIRMIZI} fillOpacity={0.07} />
          <text x={(X(a) + X(b)) / 2} y={48} fontSize={10.5} fontWeight={700} fill={KIRMIZI} textAnchor="middle">elenir</text>
        </g>
      ))}
      <path d={egri(once)} fill="none" stroke="var(--muted)" strokeWidth={1.6} strokeDasharray="4 4" />
      <path d={egri(S.f) + ` L${x1} ${yT} L${x0} ${yT} Z`} fill={YESIL} fillOpacity={0.16} stroke={YESIL} strokeWidth={2.2} strokeLinejoin="round" />
      <line x1={x0} x2={x1} y1={yT} y2={yT} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={x0} y={yT + 16} fontSize={10.5} fill="var(--muted)">küçük</text>
      <text x={x1} y={yT + 16} fontSize={10.5} fill="var(--muted)" textAnchor="end">büyük</text>
      <text x={170} y={yT + 16} fontSize={10.5} fill="var(--muted)" textAnchor="middle">özellik (ör. gaga boyu)</text>
      <g fontSize={10.5} fontWeight={700}>
        <line x1={110} x2={128} y1={200} y2={200} stroke="var(--muted)" strokeWidth={1.6} strokeDasharray="4 4" />
        <text x={132} y={204} fill="var(--muted)">önce</text>
        <line x1={180} x2={198} y1={200} y2={200} stroke={YESIL} strokeWidth={2.2} />
        <text x={202} y={204} fill={YESIL}>sonra</text>
      </g>
      <text x={170} y={226} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{S.not}</text>
    </svg>
  );
}

/* ---------- Hardy–Weinberg ---------- */

function Hw({ v }: SahneProps) {
  const q = sinir((v.q ?? 50) / 100);
  const p = 1 - q;
  const aa = Math.round(q * q * 100), Aa = Math.round(2 * p * q * 100);
  const AA = 100 - aa - Aa;
  const renk = (i: number) => (i < AA ? MAVI : i < AA + Aa ? YESIL : SARI);
  const satir = [
    { ad: "AA", oran: p * p, sayi: AA, renk: MAVI, yazi: "p²" },
    { ad: "Aa", oran: 2 * p * q, sayi: Aa, renk: YESIL, yazi: "2pq" },
    { ad: "aa", oran: q * q, sayi: aa, renk: SARI, yazi: "q²" },
  ];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`q ${virgul(q, 2)}, p ${virgul(p, 2)}: AA yüzde ${AA}, Aa yüzde ${Aa}, aa yüzde ${aa}`}>
      {Array.from({ length: 100 }, (_, i) => (
        <circle key={i} cx={22 + (i % 10) * 17} cy={22 + Math.floor(i / 10) * 17} r={6.4} fill={renk(i)} fillOpacity={i >= AA + Aa ? 0.9 : 0.7} />
      ))}
      <text x={98} y={196} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">100 birey</text>
      <g fontSize={11.5} fontWeight={700}>
        <text x={204} y={24} fill="var(--muted)">p = {virgul(p, 2)} · q = {virgul(q, 2)}</text>
        {satir.map((r, i) => (
          <g key={r.ad} transform={`translate(204 ${48 + i * 44})`}>
            <circle cx={6} cy={-4} r={6} fill={r.renk} fillOpacity={0.8} />
            <text x={18} y={0} fill="var(--ink)">{r.ad}</text>
            <text x={50} y={0} fill="var(--muted)">{r.yazi}</text>
            <text x={126} y={0} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="end">%{r.sayi}</text>
            <rect x={0} y={8} width={126} height={8} rx={4} fill="var(--line)" />
            <rect x={0} y={8} width={126 * r.oran} height={8} rx={4} fill={r.renk} />
          </g>
        ))}
        <text x={204} y={186} fontSize={10.5} fill="var(--muted)">p + q = 1</text>
        <text x={204} y={202} fontSize={10.5} fill="var(--muted)">p² + 2pq + q² = 1</text>
      </g>
      <text x={170} y={218} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {aa === 16 ? "Çekinik fenotip %16: q = √0,16 = 0,4" : `Çekinik fenotipliler (aa): %${aa}`}
      </text>
    </svg>
  );
}

/* ---------- genetik sürüklenme ---------- */

const SURUKLENME = new Map<number, number[][]>();
function suruklenme(N: number) {
  const hazir = SURUKLENME.get(N);
  if (hazir) return hazir;
  const r = rastgele(N === 10 ? 33 : 71);
  const cizgiler = Array.from({ length: 6 }, () => {
    let p = 0.5;
    const iz = [p];
    for (let k = 0; k < 30; k++) {
      let A = 0;
      for (let i = 0; i < 2 * N; i++) if (r() < p) A++;
      p = A / (2 * N);
      iz.push(p);
    }
    return iz;
  });
  SURUKLENME.set(N, cizgiler);
  return cizgiler;
}

function Suruklenme({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const buyuk = (v.b ?? 0) >= 1;
  const N = buyuk ? 500 : 10;
  const cizgiler = suruklenme(N);
  const son = Math.round(u * 30);
  const x0 = 40, x1 = 320, y0 = 36, y1 = 176;
  const X = (k: number) => ara(x0, x1, k / 30);
  const Y = (p: number) => ara(y1, y0, p);
  const kayip = cizgiler.filter((c) => c.slice(0, son + 1).some((p) => p === 0 || p === 1)).length;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${N} bireylik popülasyonda 6 tekrar: A alelinin frekansı 30 kuşak boyunca şansla değişiyor`}>
      <text x={170} y={18} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{buyuk ? "Büyük popülasyon: 500 birey" : "Küçük popülasyon: 10 birey"}</text>
      <line x1={x0} x2={x0} y1={y0} y2={y1} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={x0} x2={x1} y1={Y(0.5)} y2={Y(0.5)} stroke="var(--line-2)" strokeDasharray="3 4" />
      <line x1={x0} x2={x1} y1={Y(1)} y2={Y(1)} stroke="var(--line-2)" strokeDasharray="3 4" />
      {[0, 0.5, 1].map((p) => (
        <text key={p} x={x0 - 6} y={Y(p) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{virgul(p, 1)}</text>
      ))}
      <text x={x0 - 30} y={y0 - 10} fontSize={10} fontWeight={700} fill="var(--muted)">A frekansı</text>
      {[0, 10, 20, 30].map((k) => (
        <text key={k} x={X(k)} y={y1 + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">{k}</text>
      ))}
      <text x={x1} y={y1 + 28} fontSize={10} fill="var(--muted)" textAnchor="end">kuşak</text>
      {cizgiler.map((c, i) => (
        <polyline key={i} points={c.slice(0, son + 1).map((p, k) => `${X(k).toFixed(1)},${Y(p).toFixed(1)}`).join(" ")} fill="none" stroke={["var(--c1)", "var(--c2)", "var(--c3)", "var(--c5)", "var(--c4)", "var(--ink)"][i]} strokeWidth={1.8} strokeLinejoin="round" opacity={0.85} />
      ))}
      <text x={170} y={218} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u === 0 ? "Her çizgi aynı başlangıçtan bir tekrar: A = 0,5" : kayip ? `${son}. kuşak: 6 tekrarın ${kayip} tanesinde bir alel kayboldu` : `${son}. kuşak: hiçbir tekrarda alel kaybolmadı`}
      </text>
    </svg>
  );
}

/* ---------- türleşme ---------- */

const BOCEK = (() => {
  const r = rastgele(2207);
  return Array.from({ length: 14 }, (_, i) => {
    const sol = i < 7;
    return { x: (sol ? 42 : 196) + r() * 102, y: 48 + r() * 104, a: r() * 360, sol };
  });
})();

function Turlesme({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 8;
  const u = ilerleme(t, oynuyor, sure);
  const nehir = sinir((u - 0.15) / 0.1) * (1 - sinir((u - 0.72) / 0.08));
  const ayrisma = sinir((u - 0.3) / 0.4);
  const bulusma = sinir((u - 0.8) / 0.15);
  const kusak = Math.round(ayrisma * 10000);
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Bir böcek popülasyonu nehirle ikiye bölünür, iki grup farklılaşır; nehir kuruyunca karşılaşırlar ama verimli yavru oluşmaz">
      <rect x={20} y={30} width={300} height={140} rx={10} fill="none" stroke="var(--line-2)" strokeWidth={1.4} />
      {nehir > 0 && <path d="M170 30 C150 70 190 110 166 170" fill="none" stroke={MAVI} strokeOpacity={0.45 * nehir} strokeWidth={16} strokeLinecap="round" />}
      {BOCEK.map((b, i) => {
        const cift = i === 3 || i === 10;
        const x = cift ? ara(b.x, b.sol ? 150 : 190, bulusma) : b.x;
        const y = cift ? ara(b.y, 92, bulusma) : b.y;
        const renk = ayrisma > 0 ? (b.sol ? MAVI : KIRMIZI) : "var(--muted)";
        const boy = 1 + (b.sol ? -0.15 : 0.25) * ayrisma;
        return (
          <g key={i} opacity={cift ? 1 : 1 - 0.6 * bulusma} transform={`translate(${x} ${y}) rotate(${cift && bulusma > 0 ? ara(b.a, b.sol ? 0 : 180, bulusma) : b.a}) scale(${boy})`}>
            <ellipse rx={8} ry={5} fill={renk} fillOpacity={0.2 + 0.5 * ayrisma} stroke={renk} strokeWidth={1.3} />
            <circle cx={9} r={2.6} fill={renk} />
          </g>
        );
      })}
      {bulusma > 0.6 && (
        <g opacity={(bulusma - 0.6) / 0.4}>
          <ellipse cx={170} cy={128} rx={6} ry={4} fill="var(--panel)" stroke="var(--muted)" strokeWidth={1.2} />
          <line x1={162} x2={178} y1={120} y2={136} stroke={KIRMIZI} strokeWidth={2} />
          <line x1={178} x2={162} y1={120} y2={136} stroke={KIRMIZI} strokeWidth={2} />
          <text x={170} y={152} fontSize={10.5} fontWeight={700} fill={KIRMIZI} textAnchor="middle">kısır melez</text>
        </g>
      )}
      {u >= 0.3 && (
        <g fontSize={10.5} fontWeight={700}>
          <text x={30} y={186} fill={MAVI}>A grubu</text>
          <text x={310} y={186} fill={KIRMIZI} textAnchor="end">B grubu</text>
          {u < 0.8 && <text x={170} y={186} fill="var(--muted)" textAnchor="middle">{kusak.toLocaleString("tr-TR")} kuşak</text>}
        </g>
      )}
      <text x={170} y={18} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u === 0 ? "Tek popülasyon, tek gen havuzu" : u < 0.3 ? "Nehir popülasyonu ikiye böldü: gen akışı kesildi" : u < 0.75 ? "Mutasyon, seçilim, sürüklenme: iki havuz ayrı yöne gidiyor" : u < 1 ? "Nehir kurudu, gruplar yeniden karşılaştı" : "Çiftleşseler de verimli yavru olmuyor"}
      </text>
      <text x={170} y={212} fontSize={12} fontWeight={800} fill={u >= 1 ? YESIL : "var(--ink)"} textAnchor="middle">
        {u >= 1 ? "Üreme izolasyonu: artık iki ayrı tür" : ""}
      </text>
    </svg>
  );
}

/* ---------- homolog ve analog yapılar ---------- */

type Uzuv = { ad: string; ust: number; on: number; parmak: number[]; aci: number[]; kalin: number; zar?: boolean; kurek?: boolean; tuy?: boolean };

const UZUV: Uzuv[] = [
  { ad: "insan kolu", ust: 46, on: 40, parmak: [16, 22, 24, 22, 18], aci: [-34, -14, 0, 14, 28], kalin: 4 },
  { ad: "yarasa kanadı", ust: 30, on: 44, parmak: [12, 58, 62, 58, 52], aci: [-60, -38, -14, 10, 34], kalin: 3, zar: true },
  { ad: "balina yüzgeci", ust: 18, on: 20, parmak: [26, 42, 46, 40, 30], aci: [-24, -11, 0, 11, 22], kalin: 4.5, kurek: true },
];
const KUS: Uzuv = { ad: "kuş kanadı", ust: 30, on: 36, parmak: [14, 28, 18], aci: [-30, 0, 18], kalin: 3.5, tuy: true };

function Kemik({ u, x, y }: { u: Uzuv; x: number; y: number }) {
  const y1 = y + u.ust, y2 = y1 + u.on;
  const uc = u.parmak.map((l, i) => {
    const r = (u.aci[i] * Math.PI) / 180;
    return [x + Math.sin(r) * l, y2 + 6 + Math.cos(r) * l];
  });
  return (
    <g strokeLinecap="round">
      {u.zar && <polygon points={[[x - 4, y + 6], ...uc, [x + 4, y1]].map((p) => p.join(",")).join(" ")} fill={MOR} fillOpacity={0.08} stroke={MOR} strokeOpacity={0.4} strokeWidth={1} />}
      {u.kurek && <ellipse cx={x} cy={y + (u.ust + u.on + 46) / 2} rx={26} ry={(u.ust + u.on + 56) / 2} fill="var(--panel)" stroke="var(--line-2)" strokeWidth={1.2} />}
      {u.tuy && <path d={`M${x - 2} ${y} C${x - 34} ${y + 30} ${x - 40} ${y2 + 30} ${x - 14} ${y2 + 40} L${x + 20} ${y2 + 30} C${x + 10} ${y + 50} ${x + 6} ${y + 20} ${x + 2} ${y}`} fill="var(--panel)" stroke="var(--line-2)" strokeWidth={1.2} />}
      <line x1={x} x2={x} y1={y} y2={y1} stroke={MAVI} strokeWidth={u.kalin + 2} />
      <line x1={x - 3} x2={x - 3} y1={y1 + 3} y2={y2} stroke={SARI} strokeWidth={u.kalin} />
      <line x1={x + 3} x2={x + 3} y1={y1 + 3} y2={y2} stroke={SARI} strokeWidth={u.kalin} />
      {uc.map(([px, py], i) => (
        <line key={i} x1={x} x2={px} y1={y2 + 6} y2={py} stroke={MOR} strokeWidth={Math.max(2, u.kalin - 1)} />
      ))}
    </g>
  );
}

function Kanit({ v }: SahneProps) {
  const analog = (v.k ?? 0) >= 1;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={analog ? "Kuş kanadında kemikler var, kelebek kanadında kemik yok: ikisi de uçar ama kökenleri farklı" : "İnsan kolu, yarasa kanadı ve balina yüzgecinde aynı kemik planı"}>
      <g fontSize={10} fontWeight={700}>
        <line x1={24} x2={36} y1={14} y2={14} stroke={MAVI} strokeWidth={5} strokeLinecap="round" />
        <text x={42} y={18} fill="var(--muted)">üst kol</text>
        <line x1={100} x2={112} y1={14} y2={14} stroke={SARI} strokeWidth={4} strokeLinecap="round" />
        <text x={118} y={18} fill="var(--muted)">ön kol (2 kemik)</text>
        <line x1={222} x2={234} y1={14} y2={14} stroke={MOR} strokeWidth={3} strokeLinecap="round" />
        <text x={240} y={18} fill="var(--muted)">el, parmaklar</text>
      </g>
      {!analog &&
        UZUV.map((u, i) => (
          <g key={u.ad}>
            <Kemik u={u} x={60 + i * 110} y={36} />
            <text x={60 + i * 110} y={186} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="middle">{u.ad}</text>
          </g>
        ))}
      {analog && (
        <g>
          <Kemik u={KUS} x={100} y={40} />
          <text x={100} y={186} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="middle">kuş kanadı</text>
          {/* kelebek kanadı: kemik yok, kitin zar ve damarlar */}
          <g transform="translate(240 100)">
            <path d="M0 -4 C30 -70 74 -54 62 -14 C56 6 26 6 0 0 Z" fill={SARI} fillOpacity={0.14} stroke="var(--line-2)" strokeWidth={1.3} />
            <path d="M0 2 C22 12 44 34 30 52 C18 64 4 40 0 8 Z" fill={SARI} fillOpacity={0.14} stroke="var(--line-2)" strokeWidth={1.3} />
            {[[44, -46], [58, -26], [56, -8], [32, 40]].map(([a, b], i) => (
              <line key={i} x1={0} y1={0} x2={a} y2={b} stroke="var(--line-2)" strokeWidth={1} />
            ))}
            <ellipse cx={-4} cy={2} rx={4} ry={14} fill="var(--muted)" />
          </g>
          <text x={250} y={186} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="middle">kelebek kanadı</text>
          <text x={250} y={168} fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="middle">kemik yok</text>
        </g>
      )}
      <text x={170} y={212} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {analog ? "İkisi de uçar, ama yapıları bambaşka" : "İşlevler farklı, kemik planı aynı"}
      </text>
    </svg>
  );
}

export const BIYOLOJI14: Record<string, SahneKaydi> = {
  "biy14-havuz": { C: Havuz },
  "biy14-lamarck": { C: Lamarck },
  "biy14-antibiyotik": { C: Antibiyotik },
  "biy14-secilim": { C: Secilim },
  "biy14-hw": { C: Hw },
  "biy14-suruklenme": { C: Suruklenme },
  "biy14-turlesme": { C: Turlesme },
  "biy14-kanit": { C: Kanit },
};
