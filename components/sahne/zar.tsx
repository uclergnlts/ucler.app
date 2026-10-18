"use client";
// Biyoloji sahneleri: hücre zarı modeli, zardan geçen tanecikler (difüzyon, kanal, pompa) ve osmoz.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

/* ---------- akıcı mozaik zar ---------- */

function Fosfolipit({ x, y, yukari }: { x: number; y: number; yukari: boolean }) {
  const d = yukari ? -1 : 1;
  return (
    <g>
      <line x1={x - 2} y1={y + d * 5} x2={x - 2} y2={y + d * 24} stroke="#e0b25c" strokeWidth={1.6} strokeLinecap="round" />
      <line x1={x + 2} y1={y + d * 5} x2={x + 2.5} y2={y + d * 22} stroke="#e0b25c" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={5.2} fill="var(--c1)" />
    </g>
  );
}

function ZarModel() {
  const xs = Array.from({ length: 28 }, (_, i) => 8 + i * 12);
  const bos = (x: number) => (x > 70 && x < 118) || (x > 206 && x < 262);
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Akıcı mozaik zar modeli">
      <text x={10} y={20} fontSize={11} fill="var(--muted)" fontWeight={700}>hücre dışı</text>
      <text x={10} y={210} fontSize={11} fill="var(--muted)" fontWeight={700}>hücre içi (sitoplazma)</text>
      <g className="ad-kay">
        {xs.filter((x) => !bos(x)).map((x) => <Fosfolipit key={`u${x}`} x={x} y={82} yukari={false} />)}
        {xs.filter((x) => !bos(x)).map((x) => <Fosfolipit key={`a${x}`} x={x} y={148} yukari />)}
        <rect x={156} y={104} width={9} height={22} rx={4} fill="var(--c4)" />
      </g>
      <g>
        <path d="M74 72 Q72 64 82 62 L106 62 Q116 64 114 72 L114 158 Q116 168 106 168 L82 168 Q72 166 74 158 Z" fill="var(--c3)" opacity={0.9} />
        <rect x={89} y={66} width={10} height={98} rx={5} fill="#f6f8fb" />
        <ellipse cx={234} cy={115} rx={26} ry={44} fill="var(--c5)" opacity={0.85} />
        {[0, 1, 2, 3].map((i) => (
          <polygon key={i} points={hex(234 + (i % 2 ? 7 : -7), 60 - i * 12, 6)} fill="var(--kimya)" opacity={0.85} />
        ))}
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <line x1={20} y1={86} x2={20} y2={44} stroke="var(--c1)" />
        <text x={24} y={44} fill="var(--c1)">fosfolipit</text>
        <text x={94} y={190} fill="var(--c3)" textAnchor="middle">kanal proteini</text>
        <line x1={160} y1={126} x2={160} y2={186} stroke="var(--c4)" />
        <text x={164} y={186} fill="#b7800d">kolesterol</text>
        <text x={244} y={204} fill="var(--c5)" textAnchor="middle">taşıyıcı protein</text>
        <text x={262} y={30} fill="var(--kimya)">karbonhidrat</text>
      </g>
    </svg>
  );
}
const hex = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => `${(x + r * Math.cos((i * Math.PI) / 3)).toFixed(1)},${(y + r * Math.sin((i * Math.PI) / 3)).toFixed(1)}`).join(" ");

/* ---------- zardan geçiş ---------- */

type Grup = { ad: string; renk: string; r?: number; sol: number; sag: number; gecer: "evet" | "hayir" | "kanal" | "pompa"; sonSol?: number };
const ZX = 170, UST = 46, ALT = 196, KANAL_Y = 92, POMPA_Y = 150;

function Gecis({ s, v, t, oynuyor }: SahneProps) {
  const gruplar = (s.gruplar as Grup[]) ?? [];
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = oynuyor || t > 0 ? t / sure : 0;
  const kanal = s.kanal === true || v.kanal === 1;
  const pompa = s.pompa === true;
  let sayac = { sol: 0, sag: 0 };
  const sayimlar: { ad: string; renk: string; sol: number; sag: number }[] = [];
  const noktalar = gruplar.flatMap((g, gi) => {
    const rnd = rastgele(97 + gi * 1013);
    const N = g.sol + g.sag;
    const gecebilir = g.gecer === "evet" || g.gecer === "pompa" || (g.gecer === "kanal" && kanal);
    const sonSol = !gecebilir ? g.sol : g.sonSol ?? Math.round(N / 2);
    const fark = sonSol - g.sol; // + ise sağdan sola geçen sayısı
    const kapi = g.gecer === "kanal" ? KANAL_Y : g.gecer === "pompa" ? POMPA_Y : null;
    sayac = { sol: 0, sag: 0 };
    const out = Array.from({ length: N }, (_, i) => {
      const solda = i < g.sol;
      const yer = (sol: boolean) => ({ x: sol ? 18 + rnd() * 136 : 186 + rnd() * 136, y: UST + 8 + rnd() * (ALT - UST - 16) });
      const a = yer(solda);
      const gec = (fark < 0 && solda && i < -fark) || (fark > 0 && !solda && i - g.sol < fark);
      const b = gec ? yer(!solda) : yer(solda);
      const gecikme = rnd() * 0.45, kY = kapi ?? UST + 14 + rnd() * (ALT - UST - 28);
      const titre = (k: number) => 3 * Math.sin(u * 23 + i * 1.7 + k);
      let x: number, y: number;
      if (!gec) {
        const w = yumusak(u * 1.4);
        x = a.x + (b.x - a.x) * w * 0.35; y = a.y + (b.y - a.y) * w * 0.35;
      } else {
        const w = Math.max(0, Math.min(1, (u - gecikme) / 0.5));
        if (w < 0.5) { const k = yumusak(w * 2); x = a.x + (ZX - a.x) * k; y = a.y + (kY - a.y) * k; }
        else { const k = yumusak((w - 0.5) * 2); x = ZX + (b.x - ZX) * k; y = kY + (b.y - kY) * k; }
      }
      x += titre(0); y += titre(2);
      if (x < ZX) sayac.sol++; else sayac.sag++;
      return <circle key={`${gi}-${i}`} cx={x} cy={y} r={g.r ?? 4} fill={g.renk} stroke="#fff" strokeWidth={0.8} />;
    });
    sayimlar.push({ ad: g.ad, renk: g.renk, sol: sayac.sol, sag: sayac.sag });
    return out;
  });
  const bas = Array.from({ length: 13 }, (_, i) => UST + 4 + i * 12).filter((y) => !(kanal && Math.abs(y - KANAL_Y) < 16) && !(pompa && Math.abs(y - POMPA_Y) < 20));
  return (
    <svg viewBox="0 0 340 238" role="img" aria-label="Zarın iki yanındaki tanecikler">
      <text x={85} y={UST - 14} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{String(s.solAd ?? "sol")}</text>
      <text x={255} y={UST - 14} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{String(s.sagAd ?? "sağ")}</text>
      <g>
        {bas.map((y) => (
          <g key={y}>
            <line x1={ZX - 7} x2={ZX - 1} y1={y} y2={y} stroke="#e0b25c" strokeWidth={1.4} />
            <line x1={ZX + 1} x2={ZX + 7} y1={y} y2={y} stroke="#e0b25c" strokeWidth={1.4} />
            <circle cx={ZX - 9} cy={y} r={3.6} fill="var(--c1)" />
            <circle cx={ZX + 9} cy={y} r={3.6} fill="var(--c1)" />
          </g>
        ))}
        {kanal && (
          <g>
            <rect x={ZX - 12} y={KANAL_Y - 16} width={24} height={32} rx={8} fill="var(--c3)" />
            <rect x={ZX - 4} y={KANAL_Y - 16} width={8} height={32} fill="#f6f8fb" />
          </g>
        )}
        {pompa && (
          <g>
            <rect x={ZX - 18} y={POMPA_Y - 19} width={36} height={38} rx={10} fill="var(--c5)" />
            <text x={ZX} y={POMPA_Y + 3} fontSize={8.5} fontWeight={800} fill="#fff" textAnchor="middle">pompa</text>
            {oynuyor && <text x={ZX + 18} y={POMPA_Y + 30} fontSize={11} fontWeight={800} fill="var(--c5)">ATP → ADP</text>}
          </g>
        )}
      </g>
      {noktalar}
      <g fontSize={11.5} fontWeight={700}>
        {sayimlar.map((k, i) => (
          <g key={k.ad}>
            <circle cx={16 + i * 168} cy={222} r={4.5} fill={k.renk} />
            <text x={25 + i * 168} y={226} fill="var(--ink)">{k.ad}: {k.sol} | {k.sag}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- osmoz: alyuvar ---------- */

function Osmoz({ v }: SahneProps) {
  const t = v.tuz ?? 9;
  const c = t / 10, ic = 9;
  const hal = t < ic ? "hipo" : t > ic ? "hiper" : "izo";
  const fark = Math.abs(t - ic) / 9;
  const rx = hal === "hipo" ? 56 + 12 * fark : hal === "hiper" ? 56 - 12 * Math.min(1, fark) : 56;
  const ry = hal === "hipo" ? 34 + 24 * fark : hal === "hiper" ? 34 - 8 * Math.min(1, fark) : 34;
  const tirtik = hal === "hiper" ? 0.03 + 0.05 * Math.min(1, fark) : 0;
  const kenar = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2, k = 1 + tirtik * Math.sin(a * 16);
    return `${(170 + rx * k * Math.cos(a)).toFixed(1)},${(105 + ry * k * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  const noktalar = Array.from({ length: Math.round(t * 1.7) }, (_, i) => {
    const x = 22 + ((i * 73) % 296), y = 22 + ((i * 47 + (i % 3) * 19) % 166);
    return Math.hypot((x - 170) / (rx + 12), (y - 105) / (ry + 12)) < 1 ? null : <circle key={i} cx={x} cy={y} r={3} fill="var(--c4)" />;
  });
  const ok = (a: number, ice: boolean) => {
    const d = (a * Math.PI) / 180, R1 = Math.max(rx, ry) + 34, R2 = Math.max(rx, ry) + 12;
    const [r1, r2] = ice ? [R1, R2] : [R2, R1];
    const x1 = 170 + r1 * Math.cos(d), y1 = 105 + r1 * Math.sin(d), x2 = 170 + r2 * Math.cos(d), y2 = 105 + r2 * Math.sin(d);
    const ux = (x2 - x1) / 22, uy = (y2 - y1) / 22;
    return (
      <g key={a} className="ad-akis">
        <line x1={x1} y1={y1} x2={x2 - ux * 8} y2={y2 - uy * 8} stroke="var(--c1)" strokeWidth={3} />
        <polygon points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`} fill="var(--c1)" />
      </g>
    );
  };
  const ad = { hipo: "Hipotonik: su hücreye giriyor", izo: "İzotonik: net su geçişi yok", hiper: "Hipertonik: su hücreden çıkıyor" }[hal];
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`${ad}. Dış ortam yüzde ${c} tuz`}>
      <rect x={10} y={10} width={320} height={190} rx={14} fill="var(--c1)" fillOpacity={0.04 + c * 0.04} />
      {noktalar}
      {hal === "izo" ? [0, 90, 180, 270].map((a) => ok(a, a % 180 === 0)) : [0, 90, 180, 270].map((a) => ok(a, hal === "hipo"))}
      <polygon points={kenar} fill="var(--c2)" fillOpacity={0.28} stroke="var(--c2)" strokeWidth={2.5} strokeDasharray={t < 5 ? "7 5" : undefined} />
      {hal !== "hipo" && <ellipse cx={170} cy={105} rx={rx * 0.45} ry={ry * 0.4} fill="var(--c2)" fillOpacity={0.15} />}
      <text x={170} y={109} fontSize={12} textAnchor="middle" fill="var(--ink)" fontWeight={700}>içi %0,9</text>
      <text x={170} y={218} fontSize={12.5} textAnchor="middle" fontWeight={800} fill={hal === "izo" ? "var(--muted)" : "var(--biyoloji)"}>{ad}</text>
    </svg>
  );
}

export const ZAR: Record<string, SahneKaydi> = {
  "zar-model": { C: ZarModel },
  gecis: { C: Gecis },
  osmoz: { C: Osmoz },
};
