"use client";
// Etkileşimli kart görselleri. Kartta "etk" alanı varsa durağan SVG'nin yerine bunlardan biri çıkar.
// Biçim: docs/ICERIK-SPEC.md ("Etkileşimli kart"). Renkler içerik SVG'leriyle aynı CSS değişkenleridir.
import { useState } from "react";
import type { Etk as EtkT } from "@/lib/dersler";
import { ELEMENTLER, katmanlar, yer } from "@/lib/elementler";
import { Ayir, Eslestir, Formul, Isaretle, Sirala, Yontem } from "./EtkGenel";

const sayi = (x: number) => x.toLocaleString("tr-TR", { maximumFractionDigits: 2 }).replace("-", "−");
const yaklasik = (x: number) => (Math.abs(x * 100 - Math.round(x * 100)) > 1e-6 ? "≈" : "=");
const yuk = (q: number) => (q === 0 ? "" : `${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "−"}`);

export default function Etk({ e, svg = "" }: { e: EtkT; svg?: string }) {
  return (
    <div className="visual etk" data-tur={e.tur}>
      {e.tur === "atom" && <Atom p0={e.p} n0={e.n} e0={e.e} />}
      {e.tur === "vektor" && <Vektor v0={e.v} a0={e.aci} />}
      {e.tur === "osmoz" && <Osmoz c0={e.c} />}
      {e.tur === "sirala" && <Sirala e={e} />}
      {e.tur === "eslestir" && <Eslestir e={e} />}
      {e.tur === "ayir" && <Ayir e={e} />}
      {e.tur === "isaretle" && <Isaretle e={e} svg={svg} />}
      {e.tur === "formul" && <Formul e={e} />}
      {e.tur === "yontem" && <Yontem e={e} />}
    </div>
  );
}

function Adim({ ad, v, min, max, set }: { ad: string; v: number; min: number; max: number; set: (v: number) => void }) {
  return (
    <div className="adim">
      <span>{ad}</span>
      <button aria-label={`${ad} azalt`} disabled={v <= min} onClick={() => set(v - 1)}>−</button>
      <b aria-live="polite">{v}</b>
      <button aria-label={`${ad} artır`} disabled={v >= max} onClick={() => set(v + 1)}>+</button>
    </div>
  );
}

function Surgu({ ad, v, min, max, step, yaz, set }: {
  ad: string; v: number; min: number; max: number; step: number; yaz: string; set: (v: number) => void;
}) {
  return (
    <label className="surgu">
      <span>{ad}</span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(ev) => set(Number(ev.target.value))} />
      <b>{yaz}</b>
    </label>
  );
}

// İlk 20 elementin doğada en bol izotopunun nötron sayısı (¹H, ⁴He, ⁷Li ... ⁴⁰Ar, ³⁹K, ⁴⁰Ca).
const YAYGIN_N = [0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20];

// Proton, nötron ve elektron sayısını değiştir: element, kütle numarası ve yük değişir.
function Atom({ p0, n0, e0 }: { p0: number; n0: number; e0: number }) {
  const [p, setP0] = useState(p0), [n, setN] = useState(n0), [e, setE] = useState(e0);
  // Nötron ve elektron gerçekçi aralıkta kalsın: proton değişince ikisi de yeni elemente uyar.
  // Yük aralığı A grubundan: 1A-3A elektron verir, 5A-7A alır, 4A ve soygazlar iyon oluşturmaz (H: −1, +1).
  const nMin = p === 1 ? 0 : p - 1, nMax = p === 1 ? 2 : p + 4;
  const g = yer(p).grup;
  const [qMin, qMax] = p === 1 ? [-1, 1] : g <= 3 ? [0, g] : g >= 5 && g <= 7 ? [g - 8, 0] : [0, 0];
  const eMin = p - qMax, eMax = p - qMin;
  const setP = (v: number) => {
    setP0(v);
    setN(YAYGIN_N[v - 1]);
    setE(v);
  };
  const el = ELEMENTLER[p - 1], q = p - e, A = p + n, k = katmanlar(e);
  const tip = q === 0 ? (qMin === qMax ? (g === 8 ? "Nötr atom · soygaz, iyon oluşturmaz" : "Nötr atom · genelde iyon değil, bağ kurar") : "Nötr atom") : q > 0 ? `Katyon: ${q} elektron verdi` : `Anyon: ${-q} elektron aldı`;
  const R = [36, 54, 72, 90];
  return (
    <>
      <svg viewBox="0 0 320 200" role="img" aria-label={`${el.ad}: ${p} proton, ${n} nötron, ${e} elektron`}>
        {k.map((c, i) => (
          <g key={i}>
            <circle cx="96" cy="100" r={R[i]} fill="none" stroke="var(--line)" strokeWidth="2" />
            {Array.from({ length: c }, (_, j) => {
              const a = (-90 + (j * 360) / c) * (Math.PI / 180);
              return <circle key={j} cx={96 + R[i] * Math.cos(a)} cy={100 + R[i] * Math.sin(a)} r="5" fill="var(--c1)" />;
            })}
          </g>
        ))}
        <circle cx="96" cy="100" r="22" fill="var(--c2)" fillOpacity="0.15" stroke="var(--c2)" strokeWidth="2" />
        <text x="96" y="97" fontSize="11" textAnchor="middle" fill="var(--c2)" fontWeight="700">{p}p</text>
        <text x="96" y="110" fontSize="11" textAnchor="middle" fill="var(--muted)" fontWeight="700">{n}n</text>
        <text x="236" y="66" fontSize="15" textAnchor="end" fill="var(--ink)">{A}</text>
        <text x="236" y="98" fontSize="15" textAnchor="end" fill="var(--ink)">{p}</text>
        <text x="240" y="96" fontSize="40" fill="var(--ink)" fontWeight="800" fontFamily="var(--f-display)">
          {el.s}<tspan fontSize="18" dy="-20" fill={q ? "var(--acc)" : "var(--ink)"}>{yuk(q)}</tspan>
        </text>
        <text x="258" y="128" fontSize="15" textAnchor="middle" fill="var(--ink)" fontWeight="700">{el.ad}</text>
        <text x="258" y="150" fontSize="12" textAnchor="middle" fill="var(--muted)">A = {p} + {n} = {A}</text>
        <text x="258" y="170" fontSize="12" textAnchor="middle" fill="var(--muted)">katmanlar: {k.join(", ") || "yok"}</text>
      </svg>
      <div className={`etk-durum ${q ? "on" : ""}`}>{tip}</div>
      <div className="adimlar">
        <Adim ad="Proton" v={p} min={1} max={20} set={setP} />
        <Adim ad="Nötron" v={n} min={nMin} max={nMax} set={setN} />
        <Adim ad="Elektron" v={e} min={eMin} max={eMax} set={setE} />
      </div>
    </>
  );
}

// Vektörün boyunu ve açısını değiştir: yatay ve düşey bileşenler değişir.
function Vektor({ v0, a0 }: { v0: number; a0: number }) {
  const [v, setV] = useState(v0), [a, setA] = useState(a0);
  const r = (a * Math.PI) / 180, vx = v * Math.cos(r), vy = v * Math.sin(r);
  const S = 14, ox = 160, oy = 172;
  const x = ox + vx * S, y = oy - vy * S;
  const ok = (x1: number, y1: number, x2: number, y2: number, renk: string, kesik?: boolean) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 4) return null;
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const bx = x2 - ux * 10, by = y2 - uy * 10;
    return (
      <g>
        <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth="3" strokeDasharray={kesik ? "6 5" : undefined} />
        <polygon points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`} fill={renk} />
      </g>
    );
  };
  const yay = 28, ax = ox + yay * Math.cos(r), ay = oy - yay * Math.sin(r);
  return (
    <>
      <svg viewBox="0 0 320 200" role="img" aria-label={`V = ${v}, açı ${a} derece`}>
        <line x1="12" y1={oy} x2="308" y2={oy} stroke="var(--line)" strokeWidth="2" />
        <line x1={ox} y1="14" x2={ox} y2="192" stroke="var(--line)" strokeWidth="2" />
        <text x="304" y={oy - 6} fontSize="12" textAnchor="end" fill="var(--muted)">+x</text>
        <text x={ox + 6} y="24" fontSize="12" fill="var(--muted)">+y</text>
        {ok(ox, oy, x, oy, "var(--c1)", true)}
        {ok(x, oy, x, y, "var(--c2)", true)}
        {ok(ox, oy, x, y, "var(--c3)")}
        {a > 0 && a < 180 && (
          <path d={`M${ox + yay} ${oy} A${yay} ${yay} 0 0 0 ${ax} ${ay}`} fill="none" stroke="var(--acc)" strokeWidth="2" />
        )}
      </svg>
      <div className="etk-sonuc">
        <span style={{ color: "var(--c1)" }}>V<sub>x</sub> = {v}·cos{a}° {yaklasik(vx)} {sayi(vx)}</span>
        <span style={{ color: "var(--c2)" }}>V<sub>y</sub> = {v}·sin{a}° {yaklasik(vy)} {sayi(vy)}</span>
      </div>
      <div className="adimlar">
        <Surgu ad="V" v={v} min={1} max={10} step={1} yaz={String(v)} set={setV} />
        <Surgu ad="θ" v={a} min={0} max={180} step={5} yaz={`${a}°`} set={setA} />
      </div>
    </>
  );
}

// Dış ortamın tuz oranını değiştir: alyuvar su alır, verir ya da dengede kalır. Hücre içi yaklaşık %0,9.
function Osmoz({ c0 }: { c0: number }) {
  const [t, setT] = useState(Math.round(c0 * 10)); // onda bir yüzde
  const c = t / 10, ic = 9;
  const hal = t < ic ? "hipo" : t > ic ? "hiper" : "izo";
  const fark = Math.abs(t - ic) / 9; // 0..1
  const rx = hal === "hipo" ? 52 + 10 * fark : hal === "hiper" ? 52 - 12 * Math.min(1, fark) : 52;
  const ry = hal === "hipo" ? 32 + 22 * fark : hal === "hiper" ? 32 - 8 * Math.min(1, fark) : 32;
  const patlar = t < 5;
  const tirtik = hal === "hiper" ? 0.03 + 0.05 * Math.min(1, fark) : 0;
  const kenar = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2, k = 1 + tirtik * Math.sin(a * 16);
    return `${(160 + rx * k * Math.cos(a)).toFixed(1)},${(100 + ry * k * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  // Tuz tanecikleri: oranla artar, yerleri sabit.
  const noktalar = Array.from({ length: Math.round(t * 1.6) }, (_, i) => {
    const x = 22 + ((i * 73) % 276), y = 22 + ((i * 47 + (i % 3) * 19) % 156);
    return Math.hypot((x - 160) / (rx + 12), (y - 100) / (ry + 12)) < 1 || (y > 162 && x < 150) ? null : <circle key={i} cx={x} cy={y} r="3" fill="var(--c4)" />;
  });
  const ok = (a: number, ice: boolean) => {
    const d = (a * Math.PI) / 180, R1 = Math.max(rx, ry) + 34, R2 = Math.max(rx, ry) + 12;
    const [r1, r2] = ice ? [R1, R2] : [R2, R1];
    const x1 = 160 + r1 * Math.cos(d), y1 = 100 + r1 * Math.sin(d), x2 = 160 + r2 * Math.cos(d), y2 = 100 + r2 * Math.sin(d);
    const ux = (x2 - x1) / 22, uy = (y2 - y1) / 22;
    return (
      <g key={a}>
        <line x1={x1} y1={y1} x2={x2 - ux * 8} y2={y2 - uy * 8} stroke="var(--c1)" strokeWidth="3" />
        <polygon points={`${x2},${y2} ${x2 - ux * 8 - uy * 5},${y2 - uy * 8 + ux * 5} ${x2 - ux * 8 + uy * 5},${y2 - uy * 8 - ux * 5}`} fill="var(--c1)" />
      </g>
    );
  };
  const metin = {
    hipo: ["Hipotonik ortam", patlar ? "Su hızla hücreye girer. Alyuvar şişer ve patlayabilir (hemoliz)." : "Dışarısı daha seyreltik. Su hücreye girer, alyuvar şişer."],
    izo: ["İzotonik ortam", "Derişimler eşit. Su iki yöne eşit geçer, hücrenin şekli değişmez."],
    hiper: ["Hipertonik ortam", "Dışarısı daha derişik. Su hücreden çıkar, alyuvar büzüşür."],
  }[hal];
  return (
    <>
      <svg viewBox="0 0 320 200" role="img" aria-label={`${metin[0]}: dış ortam yüzde ${sayi(c)} tuz`}>
        <rect x="10" y="10" width="300" height="180" rx="14" fill="var(--c1)" fillOpacity={0.05 + c * 0.04} stroke="var(--line)" strokeWidth="2" />
        {noktalar}
        {hal === "izo" ? [0, 90, 180, 270].map((a) => ok(a, a % 180 === 0)) : [0, 90, 180, 270].map((a) => ok(a, hal === "hipo"))}
        <polygon points={kenar} fill="var(--c2)" fillOpacity="0.25" stroke="var(--c2)" strokeWidth="2.5" strokeDasharray={patlar ? "7 5" : undefined} />
        {hal !== "hipo" && <ellipse cx="160" cy="100" rx={rx * 0.45} ry={ry * 0.4} fill="var(--c2)" fillOpacity="0.15" />}
        <text x="160" y="104" fontSize="12" textAnchor="middle" fill="var(--ink)" fontWeight="700">%0,9</text>
        <text x="22" y="180" fontSize="12" fill="var(--muted)">dış ortam: %{sayi(c)} tuz</text>
      </svg>
      <div className={`etk-durum ${hal === "izo" ? "" : "on"}`}>{metin[0]}</div>
      <p className="etk-not">{metin[1]}</p>
      <div className="adimlar">
        <Surgu ad="Tuz" v={t} min={0} max={20} step={1} yaz={`%${sayi(c)}`} set={setT} />
      </div>
    </>
  );
}
