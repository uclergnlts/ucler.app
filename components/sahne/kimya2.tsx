"use client";
// Kimya sahneleri (madde, atom modelleri): taneciklerin üç hali, ısınma eğrisi, element-bileşik-karışım,
// homojen-heterojen karışım, fiziksel-kimyasal değişim; katot ışını, üzümlü kek, altın levha deneyi,
// çekirdeğe nişan, Bohr katmanları ve elektron bulutu.
import { useEffect, useMemo, useState } from "react";
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const SU = "#d6e8fb";

/** Sahne açıkken sürekli akan zaman (saniye); taneciklerin titreşmesi için. Az hareket isteyende durur. */
function useSaat() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const bas = performance.now();
    const kare = (now: number) => { setT((now - bas) / 1000); id = requestAnimationFrame(kare); };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, []);
  return t;
}

/* ---------- atom ve molekül çizimleri ---------- */

const O = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={6.5} fill="var(--c2)" />;
const H = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={4.2} fill="#fff" stroke="#8d9bb0" strokeWidth={1.3} />;
const C = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={6.5} fill="#3b4656" />;

function Su({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <H x={-7} y={5} /><H x={7} y={5} /><O x={0} y={0} />
    </g>
  );
}
const O2 = ({ x, y }: { x: number; y: number }) => <g><O x={x - 5.5} y={y} /><O x={x + 5.5} y={y} /></g>;
const H2 = ({ x, y }: { x: number; y: number }) => <g><H x={x - 4} y={y} /><H x={x + 4} y={y} /></g>;

/* ---------- üç hal ---------- */

const KAP = { x0: 84, x1: 256, y0: 52, y1: 186 };
const N_HAL = 16;

function Hal({ v }: SahneProps) {
  const T = v.T ?? 20;
  const saat = useSaat();
  const hal = T <= 0 ? "katı" : T <= 100 ? "sıvı" : "gaz";
  const rnd = useMemo(() => { const r = rastgele(41); return Array.from({ length: N_HAL }, () => [r(), r(), r(), r()]); }, []);
  const ucgen = (x: number) => { const k = ((x % 2) + 2) % 2; return k < 1 ? k : 2 - k; };
  const noktalar = rnd.map(([a, b, c, d], i) => {
    if (hal === "katı") {
      const titre = 1.4;
      return { x: 143 + (i % 4) * 18 + titre * Math.sin(saat * 22 + i * 1.7), y: 177 - Math.floor(i / 4) * 18 + titre * Math.cos(saat * 19 + i * 2.3) };
    }
    if (hal === "sıvı") {
      const sira = Math.floor(i / 7), k = i % 7;
      const x = 104 + k * 22 + (sira % 2) * 11 + 5 * Math.sin(saat * (0.9 + a) + i * 1.9);
      return { x: Math.max(KAP.x0 + 9, Math.min(KAP.x1 - 9, x)), y: 177 - sira * 14 + 1.5 * Math.sin(saat * 2.2 + i) };
    }
    const hiz = 0.3 + 0.35 * c;
    return { x: KAP.x0 + 9 + ucgen(a * 2 + saat * hiz) * (KAP.x1 - KAP.x0 - 18), y: KAP.y0 + 9 + ucgen(b * 2 + saat * hiz * (0.7 + d)) * (KAP.y1 - KAP.y0 - 18) };
  });
  const ozellik = hal === "katı" ? "Şekli ve hacmi sabit" : hal === "sıvı" ? "Hacmi sabit, şekli kabın şekli" : "Kabı tamamen doldurur";
  const not = T === 0 ? "0 °C: erime noktası" : T === 100 ? "100 °C: kaynama noktası" : hal === "katı" ? "buz" : hal === "sıvı" ? "su" : "su buharı";
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`${T} derecede su: ${hal}`}>
      <path d={`M${KAP.x0} ${KAP.y0 - 8} L${KAP.x0} ${KAP.y1} L${KAP.x1} ${KAP.y1} L${KAP.x1} ${KAP.y0 - 8}`} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
      <g>
        {noktalar.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={7} fill="var(--c1)" stroke="#fff" strokeWidth={1.2} />)}
      </g>
      <g>
        <text x={KAP.x0} y={28} fontSize={20} fontWeight={800} fill="var(--ink)" fontFamily="var(--f-display)">{hal[0].toUpperCase() + hal.slice(1)}</text>
        <text x={KAP.x1} y={28} fontSize={13} fontWeight={700} textAnchor="end" fill="var(--kimya)">{not}</text>
      </g>
      <text x={170} y={210} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{ozellik}</text>
    </svg>
  );
}

/* ---------- ısınma eğrisi ---------- */

const ISI = { x0: 58, x1: 316, y0: 40, y1: 186, tMin: -20, tMax: 120 };
const iY = (T: number) => ISI.y1 - ((T - ISI.tMin) / (ISI.tMax - ISI.tMin)) * (ISI.y1 - ISI.y0);
const iX = (z: number) => ISI.x0 + (z / 10) * (ISI.x1 - ISI.x0);
const DUGUM: [number, number][] = [[0, -20], [1, 0], [4, 0], [5.5, 100], [9, 100], [10, 120]];
const sicaklik = (z: number) => {
  for (let i = 1; i < DUGUM.length; i++) {
    const [z0, T0] = DUGUM[i - 1], [z1, T1] = DUGUM[i];
    if (z <= z1) return ara(T0, T1, (z - z0) / (z1 - z0));
  }
  return 120;
};

function Isinma({ t, oynuyor, s }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 6));
  const z = u * 10;
  const yol = [...DUGUM.filter(([zz]) => zz < z).map(([zz, T]) => [iX(zz), iY(T)]), [iX(z), iY(sicaklik(z))]];
  const T = Math.round(sicaklik(z));
  const durum = z < 1 ? "buz ısınıyor" : z < 4 ? "buz eriyor" : z < 5.5 ? "su ısınıyor" : z < 9 ? "su kaynıyor" : "buhar ısınıyor";
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Isınma grafiği: ${T} derece, ${durum}`}>
      <g>
        {[0, 100].map((d) => (
          <g key={d}>
            <line x1={ISI.x0} x2={ISI.x1} y1={iY(d)} y2={iY(d)} stroke="var(--line)" strokeDasharray="4 4" />
            <text x={ISI.x0 - 6} y={iY(d) + 4} fontSize={11} textAnchor="end" fill="var(--muted)">{d}</text>
          </g>
        ))}
        <line x1={ISI.x0} x2={ISI.x0} y1={ISI.y0 - 10} y2={ISI.y1} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={ISI.x0} x2={ISI.x1} y1={ISI.y1} y2={ISI.y1} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={ISI.x0 - 6} y={ISI.y1 + 4} fontSize={11} textAnchor="end" fill="var(--muted)">−20</text>
        <text x={ISI.x0 + 6} y={ISI.y0 - 14} fontSize={11} fontWeight={700} fill="var(--ink)">sıcaklık (°C)</text>
        <text x={ISI.x1} y={ISI.y1 + 18} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--ink)">zaman (ısı veriliyor) →</text>
      </g>
      <polyline points={yol.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--kimya)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={yol[yol.length - 1][0]} cy={yol[yol.length - 1][1]} r={5} fill="var(--kimya)" />
      <g fontSize={11} fontWeight={700}>
        {z >= 2.5 && <text x={iX(2.5)} y={iY(0) - 8} textAnchor="middle" fill="var(--kimya)">eriyor: 0 °C</text>}
        {z >= 7.3 && <text x={iX(7.4)} y={iY(100) + 17} textAnchor="middle" fill="var(--kimya)">kaynıyor: 100 °C</text>}
      </g>
      <text x={ISI.x1} y={24} fontSize={13} fontWeight={800} textAnchor="end" fill="var(--ink)">{u > 0 ? `${T} °C · ${durum}` : "−20 °C · buz"}</text>
      <text x={170} y={222} fontSize={11} textAnchor="middle" fill="var(--muted)">1 atm basınçta saf su</text>
    </svg>
  );
}

/* ---------- element, bileşik, karışım ---------- */

function Ornekler() {
  const kutu = (x: number, harf: string, ciz: (cx: number, cy: number, i: number) => React.ReactNode) => {
    const rnd = rastgele(harf.charCodeAt(0) * 7);
    return (
      <g key={harf}>
        <rect x={x} y={34} width={96} height={136} rx={12} fill="none" stroke="var(--line-2)" strokeWidth={2} />
        {Array.from({ length: 9 }, (_, i) => ciz(x + 18 + (i % 3) * 30 + (rnd() - 0.5) * 3, 56 + Math.floor(i / 3) * 42 + (rnd() - 0.5) * 14, i))}
        <text x={x + 48} y={192} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--ink)" fontFamily="var(--f-display)">{harf}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="A: oksijen molekülleri, B: su molekülleri, C: hidrojen ve oksijen molekülleri karışık">
      {kutu(16, "A", (x, y, i) => <O2 key={i} x={x} y={y} />)}
      {kutu(122, "B", (x, y, i) => <Su key={i} x={x} y={y} a={(i * 47) % 60 - 30} />)}
      {kutu(228, "C", (x, y, i) => (i % 2 ? <O2 key={i} x={x} y={y} /> : <H2 key={i} x={x} y={y} />))}
      <g fontSize={11.5} fill="var(--muted)" fontWeight={600}>
        <circle cx={118} cy={210} r={6} fill="var(--c2)" /><text x={128} y={214}>oksijen</text>
        <circle cx={192} cy={210} r={4.2} fill="#fff" stroke="#8d9bb0" strokeWidth={1.3} /><text x={202} y={214}>hidrojen</text>
      </g>
    </svg>
  );
}

/* ---------- homojen ve heterojen karışım ---------- */

function Karistir({ t, oynuyor, s }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const karis = kes(u / 0.55), cokel = kes((u - 0.55) / 0.45);
  const rnd = useMemo(() => { const r = rastgele(7); return Array.from({ length: 30 }, () => [r(), r()]); }, []);
  const bardak = (cx: number) => `M${cx - 52} 70 L${cx - 46} 188 Q${cx - 45} 194 ${cx - 38} 194 L${cx + 38} 194 Q${cx + 45} 194 ${cx + 46} 188 L${cx + 52} 70`;
  const L = 88, R = 252;
  const don = oynuyor && u < 0.55 ? u * 40 : 0;
  // yağ damlaları: başta üstte katman, karıştırınca dağılır, beklerken üste çıkıp katmanlaşır
  const damlalar = karis > 0 && u < 1 ? rnd.slice(0, 14).map(([a, b], i) => {
    const yx = R - 36 + a * 72 + 6 * Math.sin(don + i);
    const asagi = 104 + b * 80;
    const y = cokel > 0 ? ara(asagi, 98, yumusak(cokel)) : ara(98, asagi, yumusak(karis));
    return <circle key={i} cx={yx} cy={y} r={4.5} fill="var(--c4)" opacity={0.9} />;
  }) : null;
  const katman = karis === 0 || u >= 1 ? 1 : cokel;
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={u >= 1 ? "Şekerli su her yerde aynı, zeytinyağı üstte ayrı katman" : "Şeker ve su, zeytinyağı ve su"}>
      <g>
        <path d={`M${L - 49} 92 L${L - 46} 188 Q${L - 45} 193 ${L - 38} 193 L${L + 38} 193 Q${L + 45} 193 ${L + 46} 188 L${L + 49} 92 Z`} fill={SU} />
        <path d={bardak(L)} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
        {[0, 1, 2, 3].map((i) => {
          const k = 1 - karis, w = 13 * k;
          return k > 0.02 && <rect key={i} x={L - 30 + i * 16 + (13 - w) / 2} y={190 - w} width={w} height={w} rx={2} fill="#fff" stroke="#b9c3d1" strokeWidth={1.2} />;
        })}
        {karis > 0 && rnd.map(([a, b], i) => <circle key={i} cx={L - 40 + a * 80} cy={98 + b * 90} r={1.8} fill="#9aa8ba" opacity={karis} />)}
      </g>
      <g>
        <path d={`M${R - 49} 92 L${R - 46} 188 Q${R - 45} 193 ${R - 38} 193 L${R + 38} 193 Q${R + 45} 193 ${R + 46} 188 L${R + 49} 92 Z`} fill={SU} />
        {katman > 0 && <path d={`M${R - 50} 88 L${R + 50} 88 L${R + 49.6} ${88 + 16 * katman} L${R - 49.6} ${88 + 16 * katman} Z`} fill="var(--c4)" opacity={0.85} />}
        {damlalar}
        <path d={bardak(R)} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
      </g>
      {oynuyor && u < 0.55 && (
        <g fontSize={12} fontWeight={700} fill="var(--c1)" textAnchor="middle">
          <text x={L} y={58}>↻ karıştırılıyor</text><text x={R} y={58}>↻ karıştırılıyor</text>
        </g>
      )}
      {oynuyor && u >= 0.55 && <text x={170} y={58} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">bekleniyor…</text>}
      <g fontSize={12.5} fontWeight={700} textAnchor="middle">
        <text x={L} y={214} fill="var(--ink)">şeker + su</text>
        <text x={R} y={214} fill="var(--ink)">zeytinyağı + su</text>
        {u >= 1 && <text x={L} y={30} fill="var(--good)">homojen</text>}
        {u >= 1 && <text x={R} y={30} fill="var(--kimya)">heterojen</text>}
      </g>
    </svg>
  );
}

/* ---------- fiziksel ve kimyasal değişim ---------- */

function Degisim({ t, oynuyor, s }: SahneProps) {
  const u = yumusak(oran(t, oynuyor, Number(s.sure ?? 4)));
  const yanma = s.olay === "yanma";
  const rnd = useMemo(() => { const r = rastgele(yanma ? 5 : 3); return Array.from({ length: 9 }, () => [r(), r(), r()]); }, [yanma]);
  if (!yanma) {
    return (
      <svg viewBox="0 0 340 220" role="img" aria-label={u >= 1 ? "Su molekülleri aynı, düzen bozuldu" : "Buzda düzenli su molekülleri"}>
        <g>
          {rnd.map(([a, b, c], i) => {
            const x0 = 128 + (i % 3) * 42, y0 = 62 + Math.floor(i / 3) * 42;
            const x1 = 98 + (i % 3) * 58 + ((Math.floor(i / 3) % 2) * 22) + (a - 0.5) * 18, y1 = 58 + Math.floor(i / 3) * 46 + (b - 0.5) * 18;
            return <Su key={i} x={ara(x0, x1, u)} y={ara(y0, y1, u)} a={ara(0, c * 240 - 120, u)} />;
          })}
        </g>
        <text x={170} y={24} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">9 H₂O {u > 0 ? "→ 9 H₂O" : ""}</text>
        <text x={170} y={204} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={u >= 1 ? "var(--good)" : "var(--muted)"}>
          {u >= 1 ? "su: aynı molekül, yalnızca dizilişi değişti" : oynuyor ? "eriyor…" : "buz: düzenli dizilmiş su molekülleri"}
        </text>
      </svg>
    );
  }
  const satir = [70, 112, 154];
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={u >= 1 ? "Karbon ve oksijen birleşip karbondioksit oluştu" : "Karbon atomları ve oksijen molekülleri"}>
      <g>
        {satir.map((y, i) => (
          <g key={i}>
            <O x={ara(225, 156, u)} y={y} />
            <O x={ara(236, 184, u)} y={y} />
            <C x={ara(110, 170, u)} y={y} />
          </g>
        ))}
      </g>
      <g>
        {[-22, 0, 22].map((d) => (
          <path key={d} d={`M${170 + d} 208 C${161 + d} 205 ${163 + d} 194 ${170 + d} 182 C${177 + d} 194 ${179 + d} 205 ${170 + d} 208 Z`} fill="var(--c4)" opacity={0.85} />
        ))}
      </g>
      <text x={170} y={30} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">{u >= 1 ? "C + O₂ → CO₂" : "C + O₂ → ?"}</text>
      <g fontSize={12} fontWeight={700} textAnchor="middle">
        {u < 0.5 && <text x={110} y={190} fill="var(--muted)">karbon</text>}
        {u < 0.5 && <text x={230} y={190} fill="var(--muted)">oksijen (O₂)</text>}
        {u >= 1 && <text x={270} y={116} fill="var(--kimya)">karbondioksit</text>}
      </g>
    </svg>
  );
}

/* ---------- katot ışını ---------- */

function Katot({ t, oynuyor, s }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const xs = 82, xe = 304;
  const sapma = (x: number) => (x < 150 ? 0 : x < 250 ? -15 * ((x - 150) / 100) ** 2 : -15 - 0.3 * (x - 250));
  const xNow = xs + (xe - xs) * u;
  const nokta: string[] = [];
  for (let x = xs; x <= xNow; x += 4) nokta.push(`${x},${120 + sapma(x)}`);
  if (u > 0) nokta.push(`${xNow},${120 + sapma(xNow)}`);
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={u >= 1 ? "Işın artı yüklü levhaya doğru saptı" : "Katot ışını tüpü ve yüklü levhalar"}>
      <rect x={16} y={60} width={306} height={120} rx={40} fill="none" stroke="var(--line-2)" strokeWidth={2.5} />
      <g>
        <rect x={34} y={100} width={6} height={40} fill="var(--ink)" />
        <text x={37} y={94} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">−</text>
        <path d="M78 96 L78 116 M78 124 L78 144" stroke="var(--ink)" strokeWidth={5} />
      </g>
      <g>
        <rect x={150} y={84} width={100} height={6} rx={2} fill="var(--c2)" />
        <text x={200} y={78} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--c2)">+</text>
        <rect x={150} y={150} width={100} height={6} rx={2} fill="var(--c1)" />
        <text x={200} y={172} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--c1)">−</text>
      </g>
      <line x1={312} y1={74} x2={312} y2={166} stroke="#9aa8ba" strokeWidth={3} />
      {u > 0 && <polyline points={nokta.join(" ")} fill="none" stroke="var(--c3)" strokeWidth={3} strokeLinecap="round" />}
      {u >= 1 && <circle cx={xe + 6} cy={120 + sapma(xe)} r={5} fill="var(--c3)" />}
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={50} y={200}>katot</text>
        <text x={200} y={200}>yüklü levhalar</text>
        <text x={308} y={200}>ekran</text>
      </g>
      {u >= 1 && <text x={170} y={30} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--c3)">Işın artı levhaya saptı</text>}
    </svg>
  );
}

/* ---------- Thomson: üzümlü kek ---------- */

const ARTI = [[-34, -36], [26, -44], [48, 4], [-50, 12], [-8, 42], [36, 46]];
const YUVA = [[0, -14], [-30, -2], [30, -16], [10, 22], [-26, 34], [50, -30], [-46, -34], [62, 26], [-60, -8], [20, 62]];

function Thomson({ v }: SahneProps) {
  const e = v.e ?? 0, q = 6 - e;
  const cx = 116, cy = 112;
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`Artı yüklü küre, ${e} elektron, toplam yük ${q}`}>
      <circle cx={cx} cy={cy} r={86} fill="var(--c2)" fillOpacity={0.12} stroke="var(--c2)" strokeWidth={2} />
      <g fontSize={18} fontWeight={800} fill="var(--c2)" textAnchor="middle">
        {ARTI.map(([x, y], i) => <text key={i} x={cx + x} y={cy + y + 6}>+</text>)}
      </g>
      <g>
        {YUVA.slice(0, e).map(([x, y], i) => (
          <g key={i}>
            <circle cx={cx + x} cy={cy + y} r={9} fill="var(--c1)" />
            <text x={cx + x} y={cy + y + 4.5} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">−</text>
          </g>
        ))}
      </g>
      <g fontSize={13} fontWeight={700}>
        <text x={226} y={86} fill="var(--c2)">artı yük: +6</text>
        <text x={226} y={110} fill="var(--c1)">eksi yük: {e ? `−${e}` : "0"}</text>
        <line x1={226} x2={330} y1={120} y2={120} stroke="var(--line-2)" />
        <text x={226} y={142} fill={q === 0 ? "var(--good)" : "var(--ink)"} fontSize={15} fontWeight={800}>
          {q === 0 ? "nötr atom" : `toplam: ${q > 0 ? "+" : "−"}${Math.abs(q)}`}
        </text>
      </g>
    </svg>
  );
}

/* ---------- altın levha deneyi ---------- */

const SERIT = Array.from({ length: 15 }, (_, i) => 56 + i * 9.5);
const FOLYO = 200;
// 7: geri döner; 4 ve 10: büyük açıyla sapar; diğerleri düz geçer.
const davranis = (i: number) => (i === 7 ? "geri" : i === 4 ? "yukari" : i === 10 ? "asagi" : "duz");

function Altin({ t, oynuyor, s }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 6));
  const hiz = 330; // px / yolculuk birimi
  const izler = SERIT.map((y0, i) => {
    const gec = ((i * 0.37) % 1) * 0.4;
    const p = kes((u - gec) / 0.6);
    if (p <= 0) return null;
    const yol = p * hiz, varis = FOLYO - 20;
    const tur = davranis(i);
    let nokta: [number, number][];
    if (yol <= varis || tur === "duz") nokta = [[20, y0], [Math.min(20 + yol, 334), y0]];
    else {
      const k = yol - varis;
      const [dx, dy] = tur === "geri" ? [-Math.cos(0.38), -Math.sin(0.38)] : tur === "yukari" ? [Math.cos(0.75), -Math.sin(0.75)] : [Math.cos(0.75), Math.sin(0.75)];
      let x = FOLYO + dx * k, y = y0 + dy * k;
      if (y < 22) { const f = (y0 - 22) / -dy; x = FOLYO + dx * Math.min(k, f); y = 22; }
      if (y > 196) { const f = (196 - y0) / dy; x = FOLYO + dx * Math.min(k, f); y = 196; }
      nokta = [[20, y0], [FOLYO, y0], [x, y]];
    }
    const son = nokta[nokta.length - 1];
    return (
      <g key={i}>
        <polyline points={nokta.map((n) => n.join(",")).join(" ")} fill="none" stroke="var(--c2)" strokeOpacity={tur === "duz" ? 0.16 : 0.75} strokeWidth={tur === "duz" ? 1.4 : 2} />
        {p < 1 && <circle cx={son[0]} cy={son[1]} r={3.2} fill="var(--c2)" />}
      </g>
    );
  });
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={u >= 1 ? "Alfa taneciklerinin 12'si düz geçti, 2'si saptı, 1'i geri döndü" : "Alfa kaynağı ve ince altın levha"}>
      <g>
        <rect x={2} y={50} width={18} height={146} rx={4} fill="var(--ink)" />
        <text x={2} y={218} fontSize={11.5} fontWeight={700} textAnchor="start" fill="var(--muted)">alfa kaynağı</text>
      </g>
      <g>
        <rect x={FOLYO - 2} y={36} width={4} height={164} fill="var(--c4)" />
        <text x={FOLYO} y={28} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="#b7800d">altın levha</text>
      </g>
      <g>{izler}</g>
      {u >= 1 && (
        <text x={334} y={218} fontSize={12} fontWeight={800} textAnchor="end" fill="var(--ink)">12 geçti · 2 saptı · 1 geri döndü</text>
      )}
    </svg>
  );
}

/* ---------- çekirdeğe nişan ---------- */

const NX = 214, NY = 118, D0 = 12; // çekirdek ve kafa kafaya en yakın yaklaşma
const sapmaAci = (b: number) => (b <= 0 ? 180 : (2 * Math.atan(D0 / (2 * b)) * 180) / Math.PI);

function yorunge(b: number) {
  // Coulomb itmesiyle alfa taneciğinin yolu (çekirdeğe göre), sabit adımlı sayısal çözüm.
  const K = D0 / 2;
  let x = -(NX - 14), y = -b, vx = 1, vy = 0;
  const pts: [number, number][] = [[NX + x, NY + y]];
  for (let i = 0; i < 6000; i++) {
    const r2 = x * x + y * y, r = Math.sqrt(r2), a = K / (r2 * r);
    vx += a * x * 0.25; vy += a * y * 0.25; x += vx * 0.25; y += vy * 0.25;
    if (i % 8 === 0) pts.push([NX + x, NY + y]);
    if (NX + x < 4 || NX + x > 336 || NY + y < 4 || NY + y > 216) break;
  }
  return pts;
}

function Nisan({ v, t, oynuyor, s }: SahneProps) {
  const b = v.b ?? 40;
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const pts = useMemo(() => yorunge(b), [b]);
  const n = Math.max(1, Math.round(u * (pts.length - 1)));
  const gorunen = u > 0 ? pts.slice(0, n + 1) : [pts[0]];
  const son = gorunen[gorunen.length - 1];
  const aci = Math.round(sapmaAci(b));
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={`Çekirdeğe uzaklık ${b}, sapma ${aci} derece`}>
      <circle cx={NX} cy={NY} r={92} fill="none" stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="5 6" />
      <g>
        <circle cx={NX} cy={NY} r={6} fill="var(--c2)" />
        <text x={NX + 10} y={NY + 20} fontSize={11.5} fontWeight={700} fill="var(--c2)">çekirdek (+)</text>
        <text x={NX - 76} y={NY + 92} fontSize={11.5} fontWeight={600} textAnchor="end" fill="var(--muted)">atom: çoğu boşluk</text>
      </g>
      <g>
        <line x1={14} x2={NX} y1={NY} y2={NY} stroke="var(--line)" strokeDasharray="3 5" />
        {b > 0 && <line x1={10} x2={10} y1={NY} y2={NY - b} stroke="var(--muted)" strokeWidth={1.5} />}
      </g>
      {u > 0 && <polyline points={gorunen.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--c2)" strokeOpacity={0.5} strokeWidth={2} />}
      <circle cx={son[0]} cy={son[1]} r={4.5} fill="var(--c2)" />
      {u >= 1 && (
        <text x={334} y={222} fontSize={13} fontWeight={800} textAnchor="end" fill={aci > 90 ? "var(--good)" : "var(--ink)"}>
          Sapma: {aci}°{aci > 90 ? " · geri döndü" : ""}
        </text>
      )}
    </svg>
  );
}

/* ---------- Bohr katmanları ---------- */

const BCX = 96, BCY = 112, BR = [24, 44, 66, 90];
const GECIS: Record<string, { nm: string; renk: string; ad: string }> = {
  "3-2": { nm: "656 nm", renk: "#e2483b", ad: "kırmızı ışık" },
  "4-2": { nm: "486 nm", renk: "#1aa3b8", ad: "mavi-yeşil ışık" },
  "4-3": { nm: "1875 nm", renk: "#9aa8ba", ad: "kızılötesi (görünmez)" },
  "2-1": { nm: "122 nm", renk: "var(--c5)", ad: "morötesi (görünmez)" },
  "3-1": { nm: "103 nm", renk: "var(--c5)", ad: "morötesi (görünmez)" },
  "4-1": { nm: "97 nm", renk: "var(--c5)", ad: "morötesi (görünmez)" },
};

function Bohr({ v }: SahneProps) {
  const n = v.n ?? 1;
  const [onceki, setOnceki] = useState(n);
  const [son, setSon] = useState<[number, number] | null>(null);
  if (onceki !== n) { setOnceki(n); setSon([onceki, n]); }
  const a = (30 * Math.PI) / 180, ex = BCX + BR[n - 1] * Math.cos(a), ey = BCY + BR[n - 1] * Math.sin(a);
  const inis = son && son[1] < son[0] ? GECIS[`${son[0]}-${son[1]}`] : null;
  const dalga = (() => {
    let d = `M${ex + 8} ${ey}`;
    for (let i = 0; i < 5; i++) d += ` q5 ${i % 2 ? 7 : -7} 10 0`;
    return d;
  })();
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={`Elektron ${n}. katmanda${inis ? `, ${inis.ad} yayıldı` : ""}`}>
      <g>
        {BR.map((r, i) => (
          <g key={i}>
            <circle cx={BCX} cy={BCY} r={r} fill="none" stroke={i + 1 === n ? "var(--kimya)" : "var(--line-2)"} strokeWidth={1.5} />
            <text x={BCX} y={BCY - r - 3} fontSize={10.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{i + 1}</text>
          </g>
        ))}
      </g>
      <circle cx={BCX} cy={BCY} r={7} fill="var(--c2)" />
      <circle cx={ex} cy={ey} r={6.5} fill="var(--c1)" stroke="#fff" strokeWidth={1.2} />
      {inis && <path key={`${son![0]}${son![1]}`} className="ad-belir" d={dalga} fill="none" stroke={inis.renk} strokeWidth={2.5} strokeLinecap="round" />}
      <g fontSize={12.5} fontWeight={700}>
        <text x={212} y={44} fill="var(--ink)" fontSize={15} fontWeight={800}>{n}. katman</text>
        {son && <text x={212} y={70} fill="var(--muted)">{son[0]} → {son[1]}: {son[1] < son[0] ? "ışık yaydı" : "enerji aldı"}</text>}
        {inis && <text x={212} y={94} fill={inis.renk}>{inis.nm}</text>}
        {inis && <text x={212} y={114} fill={inis.renk}>{inis.ad}</text>}
        {!son && <text x={212} y={70} fill="var(--muted)">hidrojen atomu</text>}
      </g>
    </svg>
  );
}

/* ---------- elektron bulutu ---------- */

function Bulut({ v }: SahneProps) {
  const bulut = v.bulut === 1;
  const noktalar = useMemo(() => {
    const r = rastgele(13);
    return Array.from({ length: 520 }, () => {
      const d = -14 * Math.log(r() * r() * r() + 1e-9), z = 2 * r() - 1, a = r() * Math.PI * 2, k = Math.sqrt(1 - z * z);
      const x = d * k * Math.cos(a), y = d * k * Math.sin(a);
      return Math.hypot(x, y) < 92 ? [170 + x, 108 + y] : null;
    }).filter(Boolean) as number[][];
  }, []);
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label={bulut ? "Elektron bulutu: koyu yerlerde bulunma olasılığı yüksek" : "Bohr modeli: elektron belirli bir yörüngede"}>
      {bulut ? (
        <g>{noktalar.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.5} fill="var(--c1)" opacity={0.55} />)}</g>
      ) : (
        <g>
          <circle cx={170} cy={108} r={66} fill="none" stroke="var(--line-2)" strokeWidth={1.5} />
          <g className="ad-don" style={{ animationDuration: "6s", transformOrigin: "170px 108px" }}>
            <circle cx={236} cy={108} r={6.5} fill="var(--c1)" />
          </g>
        </g>
      )}
      <circle cx={170} cy={108} r={6} fill="var(--c2)" />
      <text x={170} y={218} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {bulut ? "Modern model: koyu yerde bulunma olasılığı yüksek" : "Bohr: elektron belirli bir yörüngede"}
      </text>
    </svg>
  );
}

export const KIMYA2: Record<string, SahneKaydi> = {
  "kim2-hal": { C: Hal },
  "kim2-isinma": { C: Isinma },
  "kim2-ornek": { C: Ornekler },
  "kim2-karistir": { C: Karistir },
  "kim2-degisim": { C: Degisim },
  "kim2-katot": { C: Katot },
  "kim2-thomson": { C: Thomson },
  "kim2-altin": { C: Altin },
  "kim2-nisan": {
    C: Nisan,
    geri: (v) => {
      const a = Math.round(sapmaAci(v.b ?? 40));
      return { baslik: `Sapma ${a}°: geri dönmedi`, metin: "Tanecik çekirdekten uzak geçtiği için itme zayıf kaldı. Onu çekirdeğe daha yakın gönder." };
    },
  },
  "kim2-bohr": { C: Bohr },
  "kim2-bulut": { C: Bulut },
};
