"use client";
// Biyoloji sahneleri (solunum, boşaltım): havanın yolu, soluk alma kasları, yükseklik ve kısmi basınç,
// alveolde gaz değişimi, hemoglobinin O₂ bırakması, CO₂'nin taşınması, egzersizde soluk;
// azotlu atıklar, ürenin yolu, glomerulda süzülme, geri emilim, H⁺ salgılama ve pH, ADH, glikoz eşiği.
import { rastgele, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";
const virgul = (x: number, b = 1) => x.toFixed(b).replace(".", ",");

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

/* ================= SOLUNUM ================= */

/* ---------- havanın yolu ---------- */

const HAVA: { ad: string; pay: number; yol: Nokta[]; not: string }[] = [
  { ad: "burun", pay: 0.16, yol: [[34, 44], [72, 38], [108, 38]], not: "Burun: hava ısınır, nemlenir, süzülür" },
  { ad: "yutak", pay: 0.12, yol: [[108, 38], [120, 48], [120, 70]], not: "Yutak: hava ile besinin ortak yolu" },
  { ad: "gırtlak", pay: 0.1, yol: [[120, 70], [120, 94]], not: "Gırtlak: ses telleri burada, epiglot açık" },
  { ad: "soluk borusu", pay: 0.16, yol: [[120, 94], [120, 140]], not: "Soluk borusu: kıkırdak halkalar açık tutar" },
  { ad: "bronş", pay: 0.14, yol: [[120, 140], [156, 160]], not: "Bronş: soluk borusu ikiye ayrılır" },
  { ad: "bronşçuk", pay: 0.16, yol: [[156, 160], [182, 180]], not: "Bronşçuk: kıkırdak yok, düz kas var" },
  { ad: "alveol", pay: 0.16, yol: [[182, 180], [192, 190]], not: "Alveol: gaz değişimi burada olur" },
];

function Alveoller({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[[0, 0], [-7, 5], [7, 5], [0, 10], [-6, -5], [6, -5]].map(([a, b], i) => (
        <circle key={i} cx={x + a} cy={y + b} r={5} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={1.2} />
      ))}
    </g>
  );
}

function Yol({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 7;
  const u = ilerleme(t, oynuyor, sure);
  const { i: etkin, yerel } = bolum(HAVA.map((h) => h.pay), u);
  const hava: Nokta = etkin < 0 ? HAVA[0].yol[0] : noktaAl(HAVA[etkin].yol, yerel);
  const renk = (i: number) => (i === etkin ? YESIL : "var(--line-2)");
  const yazi = (i: number) => (i === etkin ? YESIL : "var(--muted)");
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Havanın yolu: burun, yutak, gırtlak, soluk borusu, bronş, bronşçuk, alveol; yemek borusu yutaktan ayrılır">
      {/* yemek borusu (arkada) */}
      <polyline points="128,64 140,74 140,150" fill="none" stroke="var(--panel)" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="128,64 140,74 140,150" fill="none" stroke="var(--line-2)" strokeWidth={1.2} strokeDasharray="3 3" strokeLinecap="round" />
      {/* sol akciğer dalları */}
      <polyline points="120,140 84,160 58,180" fill="none" stroke="var(--line-2)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <Alveoller x={50} y={188} />
      {HAVA.map((h, i) =>
        h.ad === "alveol" ? null : (
          <polyline key={h.ad} points={nokt(h.yol)} fill="none" stroke={renk(i)} strokeOpacity={i === etkin ? 0.6 : 1} strokeWidth={i >= 5 ? 5 : i === 4 ? 7 : 9} strokeLinecap="round" strokeLinejoin="round" />
        ),
      )}
      {/* kıkırdak halkalar */}
      {[100, 108, 116, 124, 132].map((y) => (
        <line key={y} x1={114} x2={126} y1={y} y2={y} stroke="#fff" strokeWidth={1.6} />
      ))}
      {/* epiglot */}
      <line x1={115} y1={68} x2={104} y2={60} stroke={etkin === 2 ? YESIL : "var(--ink)"} strokeWidth={2.2} strokeLinecap="round" />
      <Alveoller x={192} y={190} />
      {u > 0 && <circle cx={hava[0]} cy={hava[1]} r={4} fill={MAVI} stroke="#fff" strokeWidth={1.2} />}
      <g fontSize={10.5} fontWeight={700}>
        <text x={44} y={28} fill={yazi(0)}>burun</text>
        <text x={112} y={52} textAnchor="end" fill={yazi(1)}>yutak</text>
        <text x={100} y={74} textAnchor="end" fill="var(--muted)">epiglot</text>
        <text x={108} y={92} textAnchor="end" fill={yazi(2)}>gırtlak</text>
        <text x={108} y={124} textAnchor="end" fill={yazi(3)}>soluk borusu</text>
        <text x={150} y={104} fill="var(--muted)">yemek borusu</text>
        <text x={162} y={152} fill={yazi(4)}>bronş</text>
        <text x={196} y={176} fill={yazi(5)}>bronşçuk</text>
        <text x={208} y={200} fill={yazi(6)}>alveol</text>
      </g>
      <text x={170} y={228} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {etkin < 0 ? "Hava burundan giriyor" : u >= 1 ? "Hava alveole ulaştı; yemek borusuna hiç girmedi" : HAVA[etkin].not}
      </text>
    </svg>
  );
}

/* ---------- soluk alma: diyafram ve kaburga kasları ---------- */

function Gogus({ v }: SahneProps) {
  const d = v.d ?? 0, k = v.k ?? 0;
  const P = 760 - 2 * d - 1 * k;
  const yarim = 64 + 8 * k;
  const cx = 104, ust = 40;
  const tepe = d ? 162 : 138; // diyaframın ortadaki en yüksek yeri
  const taban = 176;
  const ry = (tepe - 2 - (ust + 24)) / 2;
  const hacim = 1 + 0.12 * d + 0.07 * k;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`Göğüs boşluğu: diyafram ${d ? "kasılı ve düz" : "gevşek ve kubbe"}, kaburga kasları ${k ? "kasılı" : "gevşek"}; akciğer içi basınç ${P} mmHg`}>
      {/* kaburga kafesi */}
      <path d={`M${cx - 30} ${ust} L${cx - yarim} ${ust + 40} L${cx - yarim} ${taban} M${cx + 30} ${ust} L${cx + yarim} ${ust + 40} L${cx + yarim} ${taban}`} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      {/* soluk borusu ve akciğerler */}
      <line x1={cx} x2={cx} y1={4} y2={ust + 16} stroke="var(--line-2)" strokeWidth={8} strokeLinecap="round" />
      {[-1, 1].map((y) => (
        <g key={y}>
          <line x1={cx} x2={cx + y * (yarim / 2 - 4)} y1={ust + 16} y2={ust + 30} stroke="var(--line-2)" strokeWidth={4} strokeLinecap="round" />
          <ellipse cx={cx + y * (yarim / 2 + 2)} cy={ust + 24 + ry} rx={yarim / 2 - 12} ry={ry} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={1.6} />
        </g>
      ))}
      {/* diyafram */}
      <path d={`M${cx - yarim} ${taban} Q${cx} ${2 * tepe - taban} ${cx + yarim} ${taban}`} fill="none" stroke={d ? KIRMIZI : "var(--ink)"} strokeWidth={3.2} strokeLinecap="round" />
      <text x={cx} y={taban + 18} fontSize={10.5} fontWeight={700} fill={d ? KIRMIZI : "var(--muted)"} textAnchor="middle">{d ? "diyafram kasıldı, düzleşti" : "diyafram gevşek, kubbe"}</text>
      {/* hava akışı */}
      {P < 760 && (
        <g fill={MAVI} stroke={MAVI}>
          <line x1={cx + 18} x2={cx + 18} y1={2} y2={20 + 2 * (760 - P)} strokeWidth={2.4} />
          <path d={`M${cx + 13} ${18 + 2 * (760 - P)} L${cx + 23} ${18 + 2 * (760 - P)} L${cx + 18} ${26 + 2 * (760 - P)} Z`} stroke="none" />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700}>
        <text x={214} y={34} fill="var(--muted)">Göğüs hacmi</text>
        <rect x={214} y={42} width={110} height={12} rx={6} fill="var(--line)" />
        <rect x={214} y={42} width={80 * hacim} height={12} rx={6} fill={YESIL} />
        <text x={214} y={82} fill="var(--muted)">Atmosfer</text>
        <text x={214} y={100} fontSize={15} fontWeight={800} fill="var(--ink)">760 mmHg</text>
        <text x={214} y={128} fill="var(--muted)">Akciğer içi</text>
        <text x={214} y={146} fontSize={15} fontWeight={800} fill={P < 760 ? MAVI : "var(--ink)"}>≈ {P} mmHg</text>
        <text x={214} y={172} fontSize={12} fontWeight={800} fill={P < 760 ? MAVI : "var(--muted)"}>{P < 760 ? "hava içeri akıyor" : "hava akmıyor"}</text>
      </g>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {P === 760 ? "Kaslar gevşek: basınçlar eşit, hava akmıyor" : d && k ? "İki kas da kasıldı: hacim en büyük, basınç en düşük" : "Hacim arttı, basınç düştü; ama hacim daha da artabilir"}
      </text>
    </svg>
  );
}

/* ---------- yükseklik ve kısmi basınç ---------- */

function Kismi({ v }: SahneProps) {
  const h = sinir(v.h ?? 0, 0, 8);
  const P = 760 * Math.exp(-h / 8);
  const po2 = P * 0.21;
  const yY = (km: number) => 190 - km * 19;
  const tirmanX = ara(34, 146, h / 8.4);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Yükseklik ${virgul(h)} km: hava basıncı ${Math.round(P)} mmHg, O₂ oranı yüzde 21, O₂ kısmi basıncı ${Math.round(po2)} mmHg`}>
      {/* dağ */}
      <path d="M34 190 L146 30 L196 190 Z" fill="var(--panel)" stroke="var(--line-2)" strokeWidth={1.4} strokeLinejoin="round" />
      {[0, 2, 4, 6, 8].map((km) => (
        <g key={km}>
          <line x1={22} x2={28} y1={yY(km)} y2={yY(km)} stroke="var(--muted)" />
          <text x={18} y={yY(km) + 3.5} fontSize={9.5} fill="var(--muted)" textAnchor="end">{km}</text>
        </g>
      ))}
      <text x={10} y={22} fontSize={10} fontWeight={700} fill="var(--muted)">km</text>
      <line x1={tirmanX} x2={196} y1={yY(h)} y2={yY(h)} stroke={MAVI} strokeDasharray="3 3" />
      <circle cx={tirmanX} cy={yY(h) - 6} r={6} fill={MAVI} stroke="#fff" strokeWidth={1.4} />
      {/* çubuklar */}
      <g fontSize={11} fontWeight={700}>
        <text x={204} y={30} fill="var(--muted)">Hava basıncı</text>
        <rect x={204} y={36} width={120} height={12} rx={6} fill="var(--line)" />
        <rect x={204} y={36} width={(120 * P) / 760} height={12} rx={6} fill="var(--ink)" />
        <text x={204} y={64} fontSize={14} fontWeight={800} fill="var(--ink)">{Math.round(P)} mmHg</text>
        <text x={204} y={90} fill="var(--muted)">O₂ oranı</text>
        <rect x={204} y={96} width={120} height={12} rx={6} fill="var(--line)" />
        <rect x={204} y={96} width={120 * 0.21} height={12} rx={6} fill={SARI} />
        <text x={204} y={124} fontSize={14} fontWeight={800} fill="var(--ink)">%21</text>
        <text x={204} y={150} fill="var(--muted)">O₂ kısmi basıncı</text>
        <rect x={204} y={156} width={120} height={12} rx={6} fill="var(--line)" />
        <rect x={204} y={156} width={(120 * po2) / 160} height={12} rx={6} fill={MAVI} />
        <text x={204} y={186} fontSize={14} fontWeight={800} fill={MAVI}>{Math.round(po2)} mmHg</text>
      </g>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        PO₂ = {Math.round(P)} × 0,21 ≈ {Math.round(po2)} mmHg
      </text>
    </svg>
  );
}

/* ---------- alveolde gaz değişimi ---------- */

function Alveol({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const r = rastgele(12);
  const o2 = Array.from({ length: 9 }, () => ({ x: 130 + r() * 80, y: 50 + r() * 60, gec: 0.05 + r() * 0.5, akis: r() }));
  const co2 = Array.from({ length: 6 }, () => ({ x: 132 + r() * 76, y: 148 + r() * 12, gec: 0.1 + r() * 0.45 }));
  const giris = { o: 40, c: 45 }, cikis = { o: Math.round(ara(40, 100, u)), c: Math.round(ara(45, 40, u)) };
  const kanRenk = (x: number) => (u > 0 && x > 150 ? KIRMIZI : MOR);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Alveol ve kılcal damar: O₂ alveolden kana, CO₂ kandan alveole difüzyonla geçer">
      <circle cx={170} cy={78} r={58} fill="var(--biyoloji-soft)" stroke={YESIL} strokeWidth={1.6} />
      <text x={170} y={40} fontSize={11} fontWeight={800} fill={YESIL} textAnchor="middle">alveol</text>
      <text x={104} y={70} fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="end">PO₂ 100</text>
      <text x={104} y={84} fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="end">PCO₂ 40</text>
      {/* kılcal */}
      <rect x={16} y={142} width={308} height={24} rx={12} fill="var(--panel)" stroke="var(--line-2)" />
      <rect x={16} y={142} width={154} height={24} rx={12} fill={MOR} fillOpacity={0.14} />
      {u > 0 && <rect x={170} y={142} width={154} height={24} rx={12} fill={KIRMIZI} fillOpacity={0.14 + 0.1 * u} />}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 30 + ((i * 52 + u * 160) % 290);
        return <ellipse key={i} cx={x} cy={154} rx={8} ry={5} fill={kanRenk(x)} fillOpacity={0.7} />;
      })}
      {o2.map((o, i) => {
        const k = sinir((u - o.gec) / 0.35);
        const y = ara(o.y, 154, k);
        const x = k >= 1 ? o.x + (u - o.gec - 0.35) * 120 * o.akis : o.x;
        if (x > 318) return null;
        return <circle key={i} cx={x} cy={y} r={3.4} fill={MAVI} />;
      })}
      {co2.map((c, i) => {
        const k = sinir((u - c.gec) / 0.35);
        return <rect key={i} x={c.x - 3} y={ara(c.y, 54 + i * 9, k) - 3} width={6} height={6} rx={1.5} fill="var(--muted)" />;
      })}
      <g fontSize={10} fontWeight={700}>
        <text x={18} y={184} fill={MOR}>kan giriyor</text>
        <text x={18} y={198} fill="var(--ink)">PO₂ {giris.o} · PCO₂ {giris.c}</text>
        <text x={322} y={184} fill={u > 0 ? KIRMIZI : "var(--muted)"} textAnchor="end">kan çıkıyor</text>
        <text x={322} y={198} fill="var(--ink)" textAnchor="end">{u > 0 ? `PO₂ ${cikis.o} · PCO₂ ${cikis.c}` : "?"}</text>
        <circle cx={250} cy={30} r={3.4} fill={MAVI} />
        <text x={258} y={34} fill="var(--muted)">O₂</text>
        <rect x={247} y={43} width={6} height={6} rx={1.5} fill="var(--muted)" />
        <text x={258} y={50} fill="var(--muted)">CO₂</text>
      </g>
      <text x={170} y={216} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Kan, alveolün kılcalına geliyor" : u < 1 ? "Gazlar yüksek kısmi basınçtan düşüğe geçiyor" : "Kan O₂ aldı, CO₂ verdi; ATP harcanmadı"}
      </text>
    </svg>
  );
}

/* ---------- hemoglobin O₂ bırakıyor ---------- */

const doy = (p: number) => p ** 2.7 / (p ** 2.7 + 27 ** 2.7);

function Hb({ v }: SahneProps) {
  const p = sinir(v.p ?? 100, 10, 100);
  const sat = doy(p);
  const bagli = Math.round(4 * sat);
  const gx = (x: number) => 176 + (x / 100) * 140, gy = (y: number) => 160 - y * 120;
  const egri: string[] = [];
  for (let x = 0; x <= 100; x += 2) egri.push(`${gx(x)},${gy(doy(x))}`);
  const yer = p >= 90 ? "Akciğer: Hb neredeyse tamamen dolu" : p >= 40 ? (p === 40 ? "Dinlenen doku: Hb 4 O₂'nin 1'ini bırakır" : "O₂ azalıyor; Hb bırakmaya başladı") : p > 20 ? "Hb O₂'nin yarısını bıraktı" : "Çalışan kas: Hb O₂'nin çoğunu bıraktı";
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`PO₂ ${p} mmHg: hemoglobine bağlı O₂ ${bagli} / 4, doygunluk yüzde ${Math.round(sat * 100)}`}>
      {/* hemoglobin */}
      {[0, 1, 2, 3].map((i) => {
        const x = 54 + (i % 2) * 52, y = 56 + Math.floor(i / 2) * 52;
        const dolu = i < bagli;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={24} fill={dolu ? KIRMIZI : MOR} fillOpacity={dolu ? 0.28 : 0.16} stroke={dolu ? KIRMIZI : MOR} strokeWidth={1.4} />
            <rect x={x - 6} y={y - 6} width={12} height={12} rx={2} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1} />
            {dolu ? (
              <g>
                <circle cx={x - 3} cy={y - 14} r={4} fill={MAVI} />
                <circle cx={x + 4} cy={y - 14} r={4} fill={MAVI} />
              </g>
            ) : null}
          </g>
        );
      })}
      <text x={80} y={148} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">hemoglobin, 4 hem</text>
      <text x={80} y={170} fontSize={16} fontWeight={800} fill="var(--ink)" textAnchor="middle">bağlı O₂: {bagli} / 4</text>
      {/* doygunluk eğrisi */}
      <line x1={gx(0)} x2={gx(100)} y1={gy(0)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={gx(0)} x2={gx(0)} y1={gy(1)} y2={gy(0)} stroke="var(--ink)" strokeWidth={1.2} />
      <polyline points={egri.join(" ")} fill="none" stroke={KIRMIZI} strokeWidth={2.4} />
      <line x1={gx(p)} x2={gx(p)} y1={gy(0)} y2={gy(sat)} stroke={MAVI} strokeDasharray="3 3" />
      <circle cx={gx(p)} cy={gy(sat)} r={5} fill={MAVI} stroke="#fff" strokeWidth={1.4} />
      <g fontSize={9.5} fill="var(--muted)">
        <text x={gx(0) - 4} y={gy(1) + 3} textAnchor="end">%100</text>
        <text x={gx(0) - 4} y={gy(0) + 3} textAnchor="end">0</text>
        <text x={gx(40)} y={gy(0) + 13} textAnchor="middle">40</text>
        <text x={gx(100)} y={gy(0) + 13} textAnchor="middle">100</text>
        <text x={gx(100)} y={gy(0) + 26} textAnchor="end" fontWeight={700}>PO₂ (mmHg)</text>
        <text x={gx(0) + 4} y={gy(1) - 8} fontWeight={700}>Hb doygunluğu</text>
      </g>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{yer}</text>
    </svg>
  );
}

/* ---------- CO₂'nin taşınması ---------- */

function Co2({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const adim = u <= 0 ? 0 : u < 0.2 ? 1 : u < 0.4 ? 2 : u < 0.6 ? 3 : 4;
  const satir = [
    { y: 52, yazi: "CO₂ + H₂O", renk: "var(--ink)" },
    { y: 80, yazi: "→ H₂CO₃  (karbonik anhidraz)", renk: MOR },
    { y: 108, yazi: "→ H⁺ + HCO₃⁻", renk: "var(--ink)" },
  ];
  const cubuk = sinir((u - 0.6) / 0.3);
  const paylar = [
    { ad: "bikarbonat", pay: 70, renk: YESIL },
    { ad: "Hb'ye bağlı", pay: 23, renk: KIRMIZI },
    { ad: "çözünmüş", pay: 7, renk: MAVI },
  ];
  let x = 20;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Alyuvarda CO₂ suyla karbonik aside, o da H⁺ ve bikarbonata dönüşür; CO₂'nin yüzde 70'i bikarbonat, 23'ü Hb'ye bağlı, 7'si çözünmüş taşınır">
      <ellipse cx={140} cy={78} rx={112} ry={60} fill={KIRMIZI} fillOpacity={0.1} stroke={KIRMIZI} strokeWidth={1.4} />
      <text x={30} y={22} fontSize={10.5} fontWeight={700} fill={KIRMIZI}>alyuvar</text>
      <text x={296} y={22} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">plazma</text>
      {satir.map((r, i) => (
        <text key={i} x={140} y={r.y} fontSize={13} fontWeight={800} fill={r.renk} textAnchor="middle" opacity={adim > i ? 1 : 0.12}>{r.yazi}</text>
      ))}
      {adim >= 3 && (
        <g>
          <line x1={200} x2={272} y1={104} y2={104} stroke={YESIL} strokeWidth={2} />
          <path d="M276 104 L268 99 L268 109 Z" fill={YESIL} />
          <text x={296} y={108} fontSize={11.5} fontWeight={800} fill={YESIL} textAnchor="middle">HCO₃⁻</text>
          <text x={140} y={126} fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="middle">H⁺ hemoglobine tutunur</text>
        </g>
      )}
      {cubuk > 0 && (
        <g>
          {paylar.map((p) => {
            const w = (300 * p.pay) / 100;
            const g = (
              <rect key={p.ad} x={x} y={150} width={w * cubuk} height={16} fill={p.renk} fillOpacity={0.85} />
            );
            x += w;
            return g;
          })}
          <g fontSize={10.5} fontWeight={700} opacity={cubuk}>
            <text x={22} y={182} fill={YESIL}>bikarbonat %70</text>
            <text x={232} y={182} fill={KIRMIZI} textAnchor="middle">Hb %23</text>
            <text x={318} y={182} fill={MAVI} textAnchor="end">%7</text>
            <text x={318} y={144} fill="var(--muted)" textAnchor="end">çözünmüş</text>
          </g>
        </g>
      )}
      <text x={170} y={210} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Dokudan gelen CO₂ alyuvara giriyor" : u < 0.6 ? "Enzim tepkimeyi çok hızlandırır" : "CO₂'nin çoğu plazmada bikarbonat olarak taşınır"}
      </text>
    </svg>
  );
}

/* ---------- egzersizde soluk ---------- */

function Egzersiz({ v }: SahneProps) {
  const sv = sinir(v.s ?? 1, 1, 4);
  const pco2 = 40 + 10 * (3 - sv);
  const ph = 7.4 - 0.008 * (pco2 - 40);
  const nefes: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = 20 + i * 2.5;
    const y = 70 - Math.sin((i / 120) * Math.PI * 2 * (1.5 * sv)) * (12 + 4 * sv);
    nefes.push(`${x},${y}`);
  }
  const durum = pco2 > 40 ? "CO₂ birikiyor, kan asitleşiyor" : pco2 < 40 ? "Fazla soluk: CO₂ çok azaldı, pH yükseldi" : "Üretilen CO₂ kadarı atılıyor";
  const gx = (p: number) => 40 + ((p - 20) / 50) * 260;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Egzersiz: soluk dinlenmenin ${sv} katı, kandaki PCO₂ ${pco2} mmHg, pH ${virgul(ph, 2)}`}>
      <text x={20} y={22} fontSize={10.5} fontWeight={700} fill="var(--muted)">soluk (10 saniye)</text>
      <text x={320} y={22} fontSize={10.5} fontWeight={700} fill={KIRMIZI} textAnchor="end">kas: CO₂ üretimi ×3</text>
      <polyline points={nefes.join(" ")} fill="none" stroke={YESIL} strokeWidth={2.4} strokeLinejoin="round" />
      <line x1={20} x2={320} y1={70} y2={70} stroke="var(--line)" />
      <text x={20} y={118} fontSize={10.5} fontWeight={700} fill="var(--muted)">kanda PCO₂ (mmHg)</text>
      <rect x={gx(35)} y={126} width={gx(45) - gx(35)} height={14} fill={YESIL} fillOpacity={0.18} />
      <line x1={40} x2={300} y1={133} y2={133} stroke="var(--line-2)" strokeWidth={2} />
      {[20, 30, 40, 50, 60, 70].map((p) => (
        <text key={p} x={gx(p)} y={154} fontSize={9.5} fill="var(--muted)" textAnchor="middle">{p}</text>
      ))}
      <circle cx={gx(pco2)} cy={133} r={7} fill={pco2 === 40 ? YESIL : KIRMIZI} stroke="#fff" strokeWidth={1.4} />
      <g fontSize={12} fontWeight={800}>
        <text x={40} y={182} fill="var(--ink)">PCO₂ {pco2}</text>
        <text x={170} y={182} fill="var(--ink)" textAnchor="middle">pH {virgul(ph, 2)}</text>
        <text x={300} y={182} fill="var(--ink)" textAnchor="end">soluk ×{sv}</text>
      </g>
      <text x={170} y={210} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ================= BOŞALTIM ================= */

/* ---------- azotlu atıklar ---------- */

const ATIK = [
  { ad: "Amonyak", formul: "NH₃", puan: [3, 3, 1], kim: "kemikli balıklar, sucul omurgasızlar, iribaş" },
  { ad: "Üre", formul: "CO(NH₂)₂", puan: [2, 2, 2], kim: "memeliler, ergin kurbağa" },
  { ad: "Ürik asit", formul: "C₅H₄N₄O₃", puan: [1, 1, 3], kim: "kuşlar, sürüngenlerin çoğu, böcekler" },
];

function Atik({ v }: SahneProps) {
  const a = Math.round(sinir((v.a ?? 1) - 1, 0, 2));
  const A = ATIK[a];
  const olcut = ["Zehirlilik", "Su ihtiyacı", "Enerji maliyeti"];
  const renk = [KIRMIZI, MAVI, SARI];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${A.ad}: zehirlilik ${A.puan[0]}, su ihtiyacı ${A.puan[1]}, enerji maliyeti ${A.puan[2]} (3 üzerinden); atanlar: ${A.kim}`}>
      <text x={170} y={30} fontSize={20} fontWeight={800} fill="var(--ink)" textAnchor="middle">{A.ad}</text>
      <text x={170} y={50} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">{A.formul}</text>
      {olcut.map((o, i) => (
        <g key={o}>
          <text x={30} y={86 + i * 34} fontSize={11.5} fontWeight={700} fill="var(--muted)">{o}</text>
          {[0, 1, 2].map((j) => (
            <rect key={j} x={150 + j * 54} y={75 + i * 34} width={48} height={14} rx={7} fill={j < A.puan[i] ? renk[i] : "var(--line)"} />
          ))}
        </g>
      ))}
      <text x={170} y={186} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">Kim atar?</text>
      <text x={170} y={206} fontSize={12.5} fontWeight={800} fill={YESIL} textAnchor="middle">{A.kim}</text>
    </svg>
  );
}

/* ---------- ürenin yolu ---------- */

const URE: { pay: number; yol: Nokta[]; not: string }[] = [
  { pay: 0.14, yol: [[40, 56], [92, 56]], not: "Hücrede amino asit yıkıldı: NH₃ oluştu" },
  { pay: 0.18, yol: [[92, 56], [128, 56]], not: "Karaciğer: NH₃ + CO₂ → üre (ATP harcanır)" },
  { pay: 0.2, yol: [[128, 56], [170, 56], [210, 56], [234, 84]], not: "Üre kanla böbreğe taşınıyor" },
  { pay: 0.14, yol: [[234, 84], [240, 100]], not: "Böbrek üreyi kandan süzüp idrara katıyor" },
  { pay: 0.2, yol: [[240, 100], [236, 136], [228, 160]], not: "Üreter: idrar keseye iniyor" },
  { pay: 0.14, yol: [[228, 160], [228, 182], [228, 204]], not: "İdrar kesesi dolunca üretra ile dışarı" },
];

function Ure({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const { i: etkin, yerel } = bolum(URE.map((x) => x.pay), u);
  const nok: Nokta = etkin < 0 ? URE[0].yol[0] : noktaAl(URE[etkin].yol, yerel);
  const ure = etkin >= 1 && !(etkin === 1 && yerel < 0.5);
  const yaz = (i: number) => (i === etkin ? YESIL : "var(--muted)");
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label="Üre karaciğerde amonyak ve CO₂'den yapılır, kanla böbreğe gelir, idrarla üreter, idrar kesesi ve üretradan atılır">
      {/* hücre */}
      <rect x={18} y={36} width={48} height={40} rx={10} fill="var(--panel)" stroke="var(--line-2)" />
      <text x={42} y={92} fontSize={10.5} fontWeight={700} textAnchor="middle" fill={yaz(0)}>hücre</text>
      {/* karaciğer */}
      <path d="M86 44 Q96 30 122 32 Q148 36 142 56 Q132 76 104 74 Q84 70 86 44 Z" fill={KIRMIZI} fillOpacity={etkin === 1 ? 0.35 : 0.18} stroke={KIRMIZI} strokeWidth={1.4} />
      <text x={114} y={92} fontSize={10.5} fontWeight={700} textAnchor="middle" fill={yaz(1)}>karaciğer</text>
      {/* kan damarı */}
      <polyline points="142,56 210,56 234,84" fill="none" stroke={KIRMIZI} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <text x={176} y={46} fontSize={10.5} fontWeight={700} textAnchor="middle" fill={yaz(2)}>kan</text>
      {/* böbrek, üreter, kese, üretra */}
      <path d="M232 78 Q252 66 262 84 Q270 104 256 118 Q240 126 236 108 Q246 98 232 78 Z" fill="#b5523a" fillOpacity={etkin === 3 ? 0.55 : 0.35} stroke="#b5523a" strokeWidth={1.4} />
      <text x={272} y={98} fontSize={10.5} fontWeight={700} fill={yaz(3)}>böbrek</text>
      <polyline points="240,108 236,136 228,160" fill="none" stroke={SARI} strokeWidth={3} strokeLinecap="round" />
      <text x={246} y={140} fontSize={10.5} fontWeight={700} fill={yaz(4)}>üreter</text>
      <ellipse cx={228} cy={176} rx={20} ry={16} fill={SARI} fillOpacity={0.25} stroke={SARI} strokeWidth={1.4} />
      <line x1={228} x2={228} y1={192} y2={206} stroke={SARI} strokeWidth={3} strokeLinecap="round" />
      <text x={254} y={180} fontSize={10.5} fontWeight={700} fill={yaz(5)}>idrar kesesi</text>
      <text x={238} y={206} fontSize={10.5} fontWeight={700} fill={yaz(5)}>üretra</text>
      {u > 0 && u < 1 && (
        <g>
          <circle cx={nok[0]} cy={nok[1]} r={6} fill={ure ? YESIL : MOR} stroke="#fff" strokeWidth={1.4} />
          <text x={nok[0]} y={nok[1] - 10} fontSize={9.5} fontWeight={800} fill={ure ? YESIL : MOR} textAnchor="middle">{ure ? "üre" : "NH₃"}</text>
        </g>
      )}
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {etkin < 0 ? "Fazla amino asit yıkılınca amonyak oluşur" : u >= 1 ? "Üre karaciğerde yapıldı, böbrekte atıldı" : URE[etkin].not}
      </text>
    </svg>
  );
}

/* ---------- glomerulda süzülme ---------- */

const PARCA = [
  { ad: "su", r: 2.2, renk: MAVI, gecer: true, n: 6 },
  { ad: "glikoz", r: 3.4, renk: SARI, gecer: true, n: 3 },
  { ad: "amino asit", r: 3.4, renk: MOR, gecer: true, n: 3 },
  { ad: "üre", r: 3, renk: YESIL, gecer: true, n: 3 },
  { ad: "tuzlar", r: 2.6, renk: "var(--ink)", gecer: true, n: 3 },
  { ad: "büyük protein", r: 8, renk: "#6b7f99", gecer: false, n: 2 },
  { ad: "alyuvar", r: 10, renk: KIRMIZI, gecer: false, n: 2 },
];

function Suzme({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const r = rastgele(31);
  const tane: { x: number; y: number; hedefY: number; gec: number; p: (typeof PARCA)[number] }[] = [];
  PARCA.forEach((p) => {
    for (let i = 0; i < p.n; i++) {
      const x = 24 + r() * 196, y = 34 + r() * 44;
      tane.push({ x, y, hedefY: 112 + r() * 46, gec: r() * 0.45, p });
    }
  });
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Glomerulda süzülme: su, glikoz, amino asit, üre ve tuzlar Bowman kapsülüne geçer; alyuvar ve büyük proteinler kanda kalır">
      <rect x={14} y={24} width={216} height={64} rx={10} fill={KIRMIZI} fillOpacity={0.08} />
      <rect x={14} y={104} width={216} height={64} rx={10} fill={SARI} fillOpacity={0.12} />
      <line x1={14} x2={230} y1={96} y2={96} stroke="var(--ink)" strokeWidth={2} strokeDasharray="10 5" />
      <g fontSize={10.5} fontWeight={700}>
        <text x={18} y={18} fill={KIRMIZI}>glomerul (kan, yüksek basınç)</text>
        <text x={18} y={184} fill="#a77a06">Bowman kapsülü (süzüntü)</text>
      </g>
      {tane.map((k, i) => {
        const ilerle = k.p.gecer ? sinir((u - k.gec) / 0.4) : 0;
        const titre = !k.p.gecer && u > 0 && u < 1 ? Math.sin(u * 40 + i) * 2 : 0;
        const y = k.p.gecer ? ara(k.y, k.hedefY, ilerle) : Math.min(k.y + 6 * sinir(u * 3), 80 - k.p.r) + titre;
        return <circle key={i} cx={k.x} cy={y} r={k.p.r} fill={k.p.renk} fillOpacity={0.85} />;
      })}
      <g fontSize={10.5} fontWeight={700}>
        {PARCA.map((p, i) => (
          <g key={p.ad}>
            <circle cx={252} cy={30 + i * 21} r={Math.min(p.r, 7)} fill={p.renk} fillOpacity={0.85} />
            <text x={266} y={34 + i * 21} fill={u >= 1 ? (p.gecer ? "var(--ink)" : KIRMIZI) : "var(--muted)"}>{p.ad}</text>
          </g>
        ))}
      </g>
      <text x={170} y={212} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Kan glomerule geliyor" : u < 1 ? "Basınç küçük molekülleri kapsüle itiyor" : "Alyuvar ve büyük proteinler kanda kaldı"}
      </text>
    </svg>
  );
}

/* ---------- geri emilim ---------- */

function Geri({ v }: SahneProps) {
  const g = sinir(v.g ?? 80, 0, 100);
  const idrar = 180 * (1 - g / 100);
  const W = 300;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Günde 180 L süzüntünün yüzde ${g}'si geri emiliyor; idrar ${virgul(idrar)} L`}>
      <text x={20} y={26} fontSize={11.5} fontWeight={700} fill="var(--muted)">Günlük süzüntü: 180 L</text>
      <rect x={20} y={34} width={W} height={24} rx={6} fill={SARI} fillOpacity={0.5} />
      <rect x={20} y={34} width={(W * g) / 100} height={24} rx={6} fill={MAVI} fillOpacity={0.75} />
      <g fontSize={11} fontWeight={700}>
        <text x={24} y={76} fill={MAVI}>kana döner: {virgul((180 * g) / 100)} L</text>
        <text x={316} y={76} fill="#a77a06" textAnchor="end">idrar: {virgul(idrar)} L</text>
      </g>
      {/* idrar şişeleri: her biri 1,5 L */}
      <text x={20} y={108} fontSize={11.5} fontWeight={700} fill="var(--muted)">Bir günde atılacak idrar (her şişe 1,5 L)</text>
      {Array.from({ length: Math.min(24, Math.ceil(idrar / 1.5 - 0.001)) }, (_, i) => {
        const dolu = Math.min(1, idrar / 1.5 - i);
        const x = 22 + (i % 12) * 25, y = 118 + Math.floor(i / 12) * 38;
        return (
          <g key={i}>
            <rect x={x} y={y} width={16} height={30} rx={4} fill="var(--panel)" stroke="var(--line-2)" />
            <rect x={x} y={y + 30 * (1 - dolu)} width={16} height={30 * dolu} rx={4} fill={SARI} fillOpacity={0.7} />
          </g>
        );
      })}
      {idrar / 1.5 > 24 && <text x={320} y={190} fontSize={11} fontWeight={800} fill={KIRMIZI} textAnchor="end">+{Math.ceil(idrar / 1.5) - 24} şişe daha</text>}
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {g >= 99 ? "%99 geri emildi: günde 1,8 L idrar" : g >= 95 ? "Hâlâ çok fazla su kaybı var" : "Bu kadar idrarla vücut saatler içinde susuz kalır"}
      </text>
    </svg>
  );
}

/* ---------- H⁺ salgılama ve kan pH'sı ---------- */

function Ph({ v }: SahneProps) {
  const n = Math.round(sinir(v.n ?? 0, 0, 4));
  const ph = 7.22 + 0.06 * n;
  const px = (p: number) => 30 + ((p - 7.0) / 0.8) * 280;
  const normal = ph >= 7.35 && ph <= 7.45;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Böbrek ${n} birim H⁺ salgılıyor; kan pH'sı ${virgul(ph, 2)}`}>
      {/* tüp hücresi şeması */}
      <rect x={20} y={20} width={300} height={28} rx={8} fill={SARI} fillOpacity={0.18} />
      <text x={26} y={38} fontSize={10.5} fontWeight={700} fill="#a77a06">tüp (idrar olacak sıvı)</text>
      <rect x={20} y={88} width={300} height={28} rx={8} fill={KIRMIZI} fillOpacity={0.1} />
      <text x={26} y={106} fontSize={10.5} fontWeight={700} fill={KIRMIZI}>kan</text>
      {Array.from({ length: n }, (_, i) => {
        const x = 178 + i * 36;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={88} y2={56} stroke={KIRMIZI} strokeWidth={2} />
            <path d={`M${x} 50 L${x - 5} 58 L${x + 5} 58 Z`} fill={KIRMIZI} />
            <text x={x} y={44} fontSize={10} fontWeight={800} fill={KIRMIZI} textAnchor="middle">H⁺</text>
            <line x1={x + 16} x2={x + 16} y1={52} y2={82} stroke={YESIL} strokeWidth={2} />
            <path d={`M${x + 16} 88 L${x + 11} 80 L${x + 21} 80 Z`} fill={YESIL} />
          </g>
        );
      })}
      {n > 0 && <text x={316} y={106} fontSize={10} fontWeight={700} fill={YESIL} textAnchor="end">HCO₃⁻ kana döner</text>}
      {/* pH ölçeği */}
      <rect x={px(7.35)} y={142} width={px(7.45) - px(7.35)} height={16} fill={YESIL} fillOpacity={0.2} />
      <line x1={px(7.0)} x2={px(7.8)} y1={150} y2={150} stroke="var(--line-2)" strokeWidth={2} />
      {[7.0, 7.2, 7.4, 7.6, 7.8].map((p) => (
        <text key={p} x={px(p)} y={172} fontSize={9.5} fill="var(--muted)" textAnchor="middle">{virgul(p)}</text>
      ))}
      <text x={px(7.4)} y={138} fontSize={9.5} fontWeight={700} fill={YESIL} textAnchor="middle">normal</text>
      <circle cx={px(ph)} cy={150} r={7} fill={normal ? YESIL : KIRMIZI} stroke="#fff" strokeWidth={1.4} />
      <text x={170} y={210} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        Kan pH'sı {virgul(ph, 2)}: {ph < 7.35 ? "kan asidik" : ph > 7.45 ? "fazla salgılandı, kan bazik" : "normal aralıkta"}
      </text>
    </svg>
  );
}

/* ---------- ADH ---------- */

const ADH = [
  { ad: "Normal gün", adh: 2, idrar: 0.45, renk: "#f2c94c", not: "ADH orta: idrar normal miktarda" },
  { ad: "Bol su içtin", adh: 0, idrar: 1, renk: "#f7e7a6", not: "Kan seyreldi: ADH azaldı, idrar bol ve açık" },
  { ad: "Alkol aldın", adh: 0, idrar: 0.95, renk: "#f7e7a6", not: "Alkol ADH'yi baskıladı: idrar bol" },
];

function Adh({ v }: SahneProps) {
  const d = Math.round(sinir((v.d ?? 1) - 1, 0, 2));
  const D = ADH[d];
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${D.ad}: ADH düzeyi ${D.adh}, idrar miktarı ${D.idrar > 0.6 ? "bol" : "normal"}`}>
      <text x={170} y={22} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">{D.ad}</text>
      {/* hipofiz */}
      <circle cx={52} cy={64} r={18} fill={MOR} fillOpacity={0.16} stroke={MOR} strokeWidth={1.4} />
      <text x={52} y={96} fontSize={10} fontWeight={700} fill={MOR} textAnchor="middle">hipofiz</text>
      {Array.from({ length: D.adh * 2 }, (_, i) => (
        <circle key={i} cx={84 + i * 12} cy={64} r={3.2} fill={MOR} />
      ))}
      <text x={84} y={50} fontSize={10} fontWeight={700} fill={MOR}>{D.adh === 0 ? "ADH çok az" : "ADH salgılanıyor"}</text>
      {/* toplama kanalı */}
      <rect x={188} y={44} width={22} height={124} rx={8} fill={SARI} fillOpacity={0.2} stroke="var(--line-2)" />
      <text x={180} y={120} fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="end">toplama</text>
      <text x={180} y={133} fontSize={10} fontWeight={700} fill="var(--muted)" textAnchor="end">kanalı</text>
      {Array.from({ length: D.adh * 2 }, (_, i) => {
        const y = 60 + i * 26;
        return (
          <g key={i}>
            <line x1={212} x2={234} y1={y} y2={y} stroke={MAVI} strokeWidth={2} />
            <path d={`M240 ${y} L232 ${y - 5} L232 ${y + 5} Z`} fill={MAVI} />
          </g>
        );
      })}
      {D.adh > 0 && <text x={246} y={74} fontSize={10} fontWeight={700} fill={MAVI}>su kana döner</text>}
      {/* idrar kabı */}
      <rect x={262} y={110} width={48} height={62} rx={6} fill="var(--panel)" stroke="var(--line-2)" />
      <rect x={262} y={110 + 62 * (1 - D.idrar)} width={48} height={62 * D.idrar} rx={6} fill={D.renk} />
      <text x={286} y={188} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">idrar</text>
      <text x={170} y={212} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{D.not}</text>
    </svg>
  );
}

/* ---------- glikoz eşiği ---------- */

function Esik({ v }: SahneProps) {
  const k = sinir(v.k ?? 100, 80, 300);
  const toplam = Math.round(k / 20);
  const tasinan = Math.min(toplam, 9);
  const kacan = toplam - tasinan;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Kan şekeri ${k} mg/dL: ${kacan > 0 ? "taşıyıcılar doydu, glikoz idrara kaçıyor" : "glikozun hepsi geri emiliyor"}`}>
      <text x={20} y={22} fontSize={10.5} fontWeight={700} fill="#a77a06">proksimal tüp (süzüntü akıyor →)</text>
      <rect x={20} y={30} width={240} height={40} rx={10} fill={SARI} fillOpacity={0.16} />
      {/* taşıyıcılar */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={30 + i * 25} y={68} width={14} height={14} rx={3} fill={i < tasinan ? YESIL : "var(--line-2)"} />
      ))}
      <text x={20} y={98} fontSize={9.5} fontWeight={700} fill={YESIL}>taşıyıcılar ({tasinan}/9 dolu)</text>
      <rect x={20} y={108} width={240} height={36} rx={10} fill={KIRMIZI} fillOpacity={0.08} />
      <text x={24} y={160} fontSize={10.5} fontWeight={700} fill={KIRMIZI}>kana geri dönen glikoz</text>
      {Array.from({ length: tasinan }, (_, i) => (
        <circle key={i} cx={37 + i * 25} cy={126} r={5} fill={SARI} />
      ))}
      {Array.from({ length: kacan }, (_, i) => (
        <circle key={i} cx={150 + (i % 6) * 18} cy={44 + Math.floor(i / 6) * 14} r={5} fill={SARI} />
      ))}
      {/* idrar */}
      <rect x={278} y={36} width={42} height={58} rx={6} fill="var(--panel)" stroke="var(--line-2)" />
      <rect x={278} y={60} width={42} height={34} rx={6} fill="#f2c94c" fillOpacity={0.6} />
      {Array.from({ length: kacan }, (_, i) => (
        <circle key={i} cx={288 + (i % 3) * 11} cy={84 - Math.floor(i / 3) * 10} r={4} fill={SARI} stroke="#a77a06" strokeWidth={1} />
      ))}
      <text x={299} y={112} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">idrar</text>
      <text x={299} y={128} fontSize={10.5} fontWeight={800} fill={kacan > 0 ? KIRMIZI : YESIL} textAnchor="middle">{kacan > 0 ? "glikoz var" : "glikoz yok"}</text>
      <text x={170} y={196} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">Kan şekeri {k} mg/dL</text>
      <text x={170} y={214} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {kacan > 0 ? "Taşıyıcılar doydu, fazlası idrara kaçıyor" : "Glikozun hepsi kana geri dönüyor"}
      </text>
    </svg>
  );
}

export const BIYOLOJI12: Record<string, SahneKaydi> = {
  "biy12-yol": { C: Yol },
  "biy12-gogus": { C: Gogus },
  "biy12-kismi": { C: Kismi },
  "biy12-alveol": { C: Alveol },
  "biy12-hb": { C: Hb },
  "biy12-co2": { C: Co2 },
  "biy12-egzersiz": { C: Egzersiz },
  "biy12-atik": { C: Atik },
  "biy12-ure": { C: Ure },
  "biy12-suzme": { C: Suzme },
  "biy12-geri": { C: Geri },
  "biy12-ph": { C: Ph },
  "biy12-adh": { C: Adh },
  "biy12-esik": { C: Esik },
};
