"use client";
// Fizik sahneleri (basit makineler; momentum): tahterevalli kaldıraç, kaldıraç türleri, makara ve palanga, eğik düzlem,
// bisiklet dişlileri; araba ve kamyonun momentumu, duvara çarpan top, hava yastığı (F–t alanı), çarpışan arabalar, tüfeğin geri tepmesi.
import { Araba, type SahneKaydi, type SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül; 10 000 ve üstü boşlukla gruplanır (kartlardaki gibi). */
const say = (x: number, d = 1) => {
  const [a, b] = x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).split(",");
  const g = Math.abs(x) >= 10000 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : a;
  return (b ? `${g},${b}` : g).replace("-", "−");
};
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);

/** (x1, y1)'den (x2, y2)'ye ok; uç (x2, y2)'dedir. */
function Ok({ x1, y1, x2, y2, renk, kalin = 3 }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, u = Math.min(10, L * 0.6);
  const bx = x2 - ux * u, by = y2 - uy * u;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z`} fill={renk} />
    </g>
  );
}

/** Yatay çubuk: değer / en çok × genişlik. */
function Cubuk({ x, y, w, deger, enCok, renk, ad }: { x: number; y: number; w: number; deger: number; enCok: number; renk: string; ad: string }) {
  const g = sinir((deger / enCok) * w, 0, w);
  return (
    <g>
      <text x={x} y={y - 5} fontSize={11.5} fontWeight={700} fill={renk}>{ad}</text>
      <rect x={x} y={y} width={w} height={10} rx={5} fill="var(--line)" />
      {g > 0.5 && <rect x={x} y={y} width={g} height={10} rx={5} fill={renk} />}
    </g>
  );
}

/** Destek üçgeni: (x, y) tepe noktası. */
const Destek = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x} ${y} L${x - 12 * s} ${y + 20 * s} L${x + 12 * s} ${y + 20 * s} Z`} fill="var(--ink)" />
);

/* ---------- Basit makineler ---------- */

// Tahterevalli kaldıraç: solda yük s.Y (N) destekten s.dY (m); sağda v.F (N) s.dF (m) uzakta aşağı.
function Kaldirac({ v, s }: SahneProps) {
  const Y = Number(s.Y ?? 400), dY = Number(s.dY ?? 0.5), dF = Number(s.dF ?? 2), F = v.F ?? 50;
  const tY = Y * dY, tF = F * dF, PX = 60, cx = 170, cy = 130;
  const aci = sinir(((tF - tY) / tY) * 14, -12, 12);
  const denge = Math.abs(tF - tY) < 1e-6;
  const xY = cx - dY * PX, xF = cx + dF * PX;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kaldıraç: yük ${Y} N ${say(dY)} m, kuvvet ${F} N ${say(dF)} m; ${denge ? "dengede" : tF > tY ? "kuvvet tarafı iniyor" : "yük tarafı iniyor"}`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Y·dY = {Y} · {say(dY)} = {say(tY)} N·m</text>
      <text x={14} y={44} fontSize={13} fontWeight={800} fill="var(--c2)">F·dF = {F} · {say(dF)} = {say(tF)} N·m</text>
      <line x1={14} x2={326} y1={cy + 22} y2={cy + 22} stroke="var(--line-2)" strokeWidth={2} />
      <Destek x={cx} y={cy + 2} />
      <g transform={`rotate(${aci} ${cx} ${cy})`}>
        <rect x={cx - 140} y={cy - 4} width={280} height={8} rx={4} fill="var(--c1)" />
        <rect x={xY - 18} y={cy - 40} width={36} height={36} rx={4} fill="var(--c4)" />
        <text x={xY} y={cy - 17} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">{Y} N</text>
        <Ok x1={xF} y1={cy - 58} x2={xF} y2={cy - 6} renk="var(--c2)" />
        <text x={xF} y={cy - 64} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">F = {F} N</text>
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {[xY, cx, xF].map((x) => <line key={x} x1={x} x2={x} y1={cy + 35} y2={cy + 45} stroke="var(--muted)" strokeWidth={1.2} />)}
        <line x1={xY} x2={cx} y1={cy + 40} y2={cy + 40} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(xY + cx) / 2} y={cy + 56}>dY = {say(dY)} m</text>
        <line x1={cx} x2={xF} y1={cy + 40} y2={cy + 40} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(xF + cx) / 2} y={cy + 56}>dF = {say(dF)} m</text>
      </g>
      <text x={170} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill={denge ? "var(--good)" : "var(--muted)"}>
        {denge ? "Dengede: torklar eşit" : tF > tY ? "Kuvvet tarafı ağır basıyor" : "Yük tarafı ağır basıyor"}
      </text>
    </svg>
  );
}

// Kaldıracın üç türü: D (destek), Y (yük), F (kuvvet) sırası.
const TURLER = [
  { ad: "Tahterevalli", not: "destek ortada", sira: ["Y", "D", "F"], asagi: true },
  { ad: "El arabası", not: "yük ortada", sira: ["D", "Y", "F"] },
  { ad: "Cımbız", not: "kuvvet ortada", sira: ["D", "F", "Y"] },
];
function Turler() {
  const xs = [150, 230, 310];
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Kaldıraç türleri: tahterevallide destek, el arabasında yük, cımbızda kuvvet ortada">
      {TURLER.map((k, i) => {
        const y = 44 + i * 72;
        return (
          <g key={k.ad}>
            <text x={14} y={y + 2} fontSize={13} fontWeight={800} fill="var(--ink)">{k.ad}</text>
            <text x={14} y={y + 20} fontSize={11.5} fontWeight={600} fill="var(--muted)">{k.not}</text>
            <rect x={132} y={y - 4} width={196} height={7} rx={3.5} fill="var(--c1)" />
            {k.sira.map((h, j) =>
              h === "D" ? (
                <g key={h}><Destek x={xs[j]} y={y + 3} s={0.8} /><text x={xs[j]} y={y + 36} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">D</text></g>
              ) : h === "Y" ? (
                <g key={h}><rect x={xs[j] - 12} y={y - 28} width={24} height={24} rx={3} fill="var(--c4)" /><text x={xs[j]} y={y - 11} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">Y</text></g>
              ) : (
                "asagi" in k ? (
                  <g key={h}><Ok x1={xs[j]} y1={y - 30} x2={xs[j]} y2={y - 6} renk="var(--c2)" kalin={2.5} /><text x={xs[j] + 10} y={y - 18} fontSize={11.5} fontWeight={800} fill="var(--c2)">F</text></g>
                ) : (
                  <g key={h}><Ok x1={xs[j]} y1={y + 30} x2={xs[j]} y2={y + 6} renk="var(--c2)" kalin={2.5} /><text x={xs[j] + 10} y={y + 28} fontSize={11.5} fontWeight={800} fill="var(--c2)">F</text></g>
                )
              ),
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Makara ve palanga: yük 400 N; v.n (ya da s.n) hareketli bloğu taşıyan ip kolu sayısı. n = 1 yalnızca sabit makara.
const MAKARA_AD = ["", "Sabit makara", "Hareketli makara", "Palanga (3 kol)", "Palanga (4 kol)"];
function Makara({ v, s }: SahneProps) {
  const n = sinir(Math.round(v.n ?? Number(s.n ?? 1)), 1, 4), Y = 400, F = Y / n;
  const tavan = 30, sabitY = 58, hareketliY = 150;
  const kolX = (i: number) => 96 + i * 22; // taşıyan kolların x'i
  const cekX = n === 1 ? 152 : kolX(n - 1) + 34;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${MAKARA_AD[n]}: ${Y} N yük ${say(F)} N kuvvetle kalkar; yük 1 m kalkınca ip ${n} m çekilir`}>
      <line x1={60} x2={240} y1={tavan} y2={tavan} stroke="var(--ink)" strokeWidth={4} />
      {n === 1 ? (
        <g>
          <line x1={130} x2={130} y1={tavan} y2={sabitY} stroke="var(--ink)" strokeWidth={2} />
          <circle cx={130} cy={sabitY} r={22} fill="var(--fizik-soft)" stroke="var(--fizik)" strokeWidth={2.5} />
          <line x1={108} x2={108} y1={sabitY} y2={hareketliY + 8} stroke="var(--c1)" strokeWidth={3} />
          <line x1={152} x2={152} y1={sabitY} y2={176} stroke="var(--ink)" strokeWidth={2} />
          <rect x={88} y={hareketliY + 8} width={40} height={36} rx={4} fill="var(--c4)" />
          <text x={108} y={hareketliY + 31} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">400 N</text>
        </g>
      ) : (
        <g>
          <rect x={kolX(0) - 10} y={sabitY - 16} width={(n - 1) * 22 + 20 + 34} height={32} rx={14} fill="var(--fizik-soft)" stroke="var(--fizik)" strokeWidth={2.5} />
          <line x1={(kolX(0) + cekX) / 2} x2={(kolX(0) + cekX) / 2} y1={tavan} y2={sabitY - 16} stroke="var(--ink)" strokeWidth={2} />
          {Array.from({ length: n }, (_, i) => (
            <line key={i} x1={kolX(i)} x2={kolX(i)} y1={sabitY} y2={hareketliY} stroke="var(--c1)" strokeWidth={3} />
          ))}
          <line x1={cekX} x2={cekX} y1={sabitY} y2={176} stroke="var(--ink)" strokeWidth={2} />
          <rect x={kolX(0) - 10} y={hareketliY - 14} width={(n - 1) * 22 + 20} height={28} rx={12} fill="#fff" stroke="var(--fizik)" strokeWidth={2.5} />
          <line x1={kolX(0) + ((n - 1) * 22) / 2} x2={kolX(0) + ((n - 1) * 22) / 2} y1={hareketliY + 14} y2={hareketliY + 24} stroke="var(--ink)" strokeWidth={2} />
          <rect x={kolX(0) + ((n - 1) * 22) / 2 - 20} y={hareketliY + 24} width={40} height={36} rx={4} fill="var(--c4)" />
          <text x={kolX(0) + ((n - 1) * 22) / 2} y={hareketliY + 47} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">400 N</text>
        </g>
      )}
      <Ok x1={cekX} y1={176} x2={cekX} y2={176 + 12 + F / 10} renk="var(--c2)" />
      <text x={cekX + 10} y={196} fontSize={12.5} fontWeight={800} fill="var(--c2)">F = {say(F)} N</text>
      <g fontSize={12.5} fontWeight={700}>
        <text x={326} y={60} textAnchor="end" fill="var(--ink)" fontWeight={800}>{MAKARA_AD[n]}</text>
        <text x={326} y={82} textAnchor="end" fill="var(--c1)">taşıyan kol: {n}</text>
        <text x={326} y={104} textAnchor="end" fill="var(--muted)">kazanç: {n}</text>
      </g>
      <text x={14} y={226} fontSize={12.5} fontWeight={700} fill="var(--muted)">Yük 1 m kalkınca ipi {n} m çekersin</text>
    </svg>
  );
}

// Eğik düzlem: G = 600 N, h = 1 m; v.L (ya da s.L) rampanın boyu (m). s.Fg verilirse gerçek kuvvetle verim gösterilir.
function Rampa({ v, s }: SahneProps) {
  const G = 600, h = 1, L = sinir(v.L ?? Number(s.L ?? 2), 1, 6), Fg = s.Fg === undefined ? null : Number(s.Fg);
  const F = (G * h) / L, PX = 48, x0 = 26, yer = Fg === null ? 176 : 132;
  const taban = Math.sqrt(Math.max(0, L * L - h * h)) * PX, H = h * PX;
  const ux = taban / (L * PX), uy = H / (L * PX); // rampa yönü (yukarı)
  const bx = x0 + taban * 0.5, by = yer - H * 0.5; // kutunun rampa üstündeki yeri
  const aci = (Math.atan2(H, Math.max(taban, 1e-6)) * 180) / Math.PI;
  const cx = bx - uy * 14, cy = by - ux * 14, okL = 14 + (Fg ?? F) / 6;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Eğik düzlem: boy ${L} m, yükseklik 1 m, 600 N yük için kuvvet ${say(F)} N`}>
      {Fg === null ? (
        <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--c2)">F = G·h / L = 600 · 1 / {L} = {say(F)} N</text>
      ) : (
        <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--c2)">Sürtünmesiz {say(F)} N yeterdi · gerçekte {Fg} N</text>
      )}
      {Fg === null && <text x={14} y={44} fontSize={12.5} fontWeight={700} fill="var(--muted)">İş: F·L = {say(F)} · {L} = {say(F * L)} J (hep G·h)</text>}
      <line x1={14} x2={326} y1={yer} y2={yer} stroke="var(--ink)" strokeWidth={1.5} />
      <path d={`M${x0} ${yer} L${x0 + taban} ${yer - H} L${x0 + taban} ${yer} Z`} fill="var(--fizik-soft)" stroke="var(--fizik)" strokeWidth={2} />
      <g transform={`translate(${bx} ${by}) rotate(${-aci})`}><rect x={-14} y={-28} width={28} height={28} rx={3} fill="var(--c4)" /></g>
      <Ok x1={cx} y1={cy} x2={cx + ux * okL} y2={cy - uy * okL} renk="var(--c2)" />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={x0 + taban + 6} y={yer - H / 2 + 4}>h = 1 m</text>
        <text x={x0 + taban * 0.82} y={yer - H * 0.82 - 12} textAnchor="end">L = {L} m</text>
      </g>
      {Fg !== null && (
        <g>
          <Cubuk x={14} y={174} w={300} deger={G * h} enCok={Fg * L} renk="var(--c3)" ad={`Yararlı iş: G·h = ${G * h} J`} />
          <Cubuk x={14} y={212} w={300} deger={Fg * L} enCok={Fg * L} renk="var(--c2)" ad={`Harcanan iş: ${Fg} · ${L} = ${Fg * L} J`} />
        </g>
      )}
    </svg>
  );
}

/** z dişli dişli: (x, y) merkez, r yarıçap, aci dönme açısı (derece). */
function Disli({ x, y, r, z, aci, renk }: { x: number; y: number; r: number; z: number; aci: number; renk: string }) {
  const d = Array.from({ length: z * 2 }, (_, i) => {
    const a = (i * Math.PI) / z, R = i % 2 ? r - 4 : r + 3;
    return `${(R * Math.cos(a)).toFixed(1)},${(R * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci})`}>
      <polygon points={d} fill={renk} />
      <circle r={r * 0.55} fill="#fff" />
      <line x1={0} y1={0} x2={r * 0.55} y2={0} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
      <circle r={4} fill="var(--ink)" />
    </g>
  );
}

// Bisiklet: ön dişli 48 diş (pedalla aynı mil), v.z arka dişlinin diş sayısı (tekerlekle aynı mil). Oynatınca pedal 1 tur döner.
function Bisiklet({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), z = v.z ?? 24, on = 48;
  const r1 = 50, r2 = z * (r1 / on), x1 = 96, x2 = 250, y = 120;
  const tur = (on / z) * u;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Ön dişli 48, arka dişli ${z} diş: pedalın bir turunda tekerlek ${say(on / z, 2)} tur`}>
      <line x1={x1} y1={y - r1} x2={x2} y2={y - r2} stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 3" />
      <line x1={x1} y1={y + r1} x2={x2} y2={y + r2} stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 3" />
      <Disli x={x1} y={y} r={r1} z={on} aci={-90 + 360 * u} renk="var(--c1)" />
      <Disli x={x2} y={y} r={r2} z={z} aci={-90 + 360 * tur} renk="var(--c2)" />
      <g fontSize={12} fontWeight={800} textAnchor="middle">
        <text x={x1} y={y + r1 + 26} fill="var(--c1)">ön: 48 diş (pedal)</text>
        <text x={x2} y={y + 50 + 26} fill="var(--c2)">arka: {z} diş (tekerlek)</text>
      </g>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Pedal: {say(u, 2)} tur · Tekerlek: {say(tur, 2)} tur</text>
      <text x={170} y={226} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">n₁·r₁ = n₂·r₂ → tekerlek turu = 48 / {z} = {say(on / z, 2)}</text>
    </svg>
  );
}

/* ---------- Momentum ---------- */

// Kamyon 4000 kg × 5 m/s ile v.v hızındaki 1000 kg'lık araba.
function PKarsilastir({ v }: SahneProps) {
  const pK = 4000 * 5, va = v.v ?? 5, pA = 1000 * va, esit = pA === pK;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kamyonun momentumu ${pK}, arabanın ${pA} kg·m/s`}>
      <line x1={14} x2={326} y1={70} y2={70} stroke="var(--line-2)" strokeWidth={2} />
      <Araba x={70} y={64} renk="var(--c4)" olcek={2} />
      <Ok x1={118} y1={34} x2={118 + 5 * 3} y2={34} renk="var(--c4)" />
      <text x={150} y={38} fontSize={12} fontWeight={800} fill="var(--c4)">kamyon 4000 kg · 5 m/s</text>
      <line x1={14} x2={326} y1={158} y2={158} stroke="var(--line-2)" strokeWidth={2} />
      <Araba x={60} y={152} renk="var(--c1)" />
      {va > 0 && <Ok x1={90} y1={128} x2={90 + va * 3} y2={128} renk="var(--c1)" />}
      <text x={150} y={132} fontSize={12} fontWeight={800} fill="var(--c1)">araba 1000 kg · {va} m/s</text>
      <Cubuk x={14} y={92} w={240} deger={pK} enCok={40000} renk="var(--c4)" ad={`p = 4000 · 5 = ${say(pK)} kg·m/s`} />
      <Cubuk x={14} y={186} w={240} deger={pA} enCok={40000} renk="var(--c1)" ad={`p = 1000 · ${va} = ${say(pA)} kg·m/s`} />
      <text x={326} y={226} fontSize={12.5} fontWeight={800} textAnchor="end" fill={esit ? "var(--good)" : "var(--muted)"}>{esit ? "Momentumlar eşit" : pA < pK ? "Araba daha az" : "Araba daha çok"}</text>
    </svg>
  );
}

// Duvara çarpan top: 0,2 kg, 10 m/s. v.k 1 ise aynı hızla geri seker, 0 ise duvara yapışır. Oynatınca Δp yazar.
function Duvar({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), seker = v.k === 1, m = 0.2, vi = 10;
  const duvar = 296, x0 = 40, r = 12, carp = 0.5;
  const x = u <= carp ? x0 + (duvar - r - x0) * (u / carp) : seker ? duvar - r - (duvar - r - x0) * ((u - carp) / carp) : duvar - r;
  const vs = seker ? -vi : 0, dp = m * vs - m * vi, sonra = u > carp;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Top duvara 10 m/s çarpıyor ve ${seker ? "geri sekiyor" : "yapışıyor"}: momentum değişimi ${say(dp)} kg·m/s`}>
      <rect x={duvar} y={50} width={16} height={120} fill="var(--line-2)" />
      <line x1={14} x2={duvar} y1={150} y2={150} stroke="var(--line-2)" strokeWidth={1.5} />
      <circle cx={x} cy={138} r={r} fill="var(--c2)" />
      {!sonra && <Ok x1={x - 20} y1={108} x2={x + 20} y2={108} renk="var(--c2)" />}
      {sonra && seker && <Ok x1={x + 20} y1={108} x2={x - 20} y2={108} renk="var(--c2)" />}
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Top 0,2 kg · önce +10 m/s · sonra {seker ? "−10" : "0"} m/s</text>
      <text x={14} y={44} fontSize={12} fontWeight={700} fill="var(--muted)">+ yön: duvara doğru (sağ)</text>
      <text x={170} y={194} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={sonra ? "var(--c2)" : "var(--muted)"}>
        {sonra ? `Δp = 0,2·(${seker ? "−10" : "0"}) − 0,2·10 = ${say(dp)} kg·m/s` : "Çarpışmadan sonra Δp burada yazacak"}
      </text>
      <text x={170} y={220} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{seker ? "Top geri sekiyor" : "Top duvara yapışıyor"}</text>
    </svg>
  );
}

// Hava yastığı: 70 kg, 15 m/s → durur; Δp = 1050 N·s. v.dt çarpışma süresi (ms). F–t grafiğinde alan sabit.
function Yastik({ v }: SahneProps) {
  const dp = 70 * 15, dt = v.dt ?? 10, F = dp / (dt / 1000), sinirF = 10000;
  const X0 = 52, Y0 = 196, W = 260, H = 140, fMax = 20000, tMax = 200;
  const w = (dt / tMax) * W, h = Math.min(H, (F / fMax) * H), tasti = F > fMax;
  const ys = Y0 - (sinirF / fMax) * H, guvenli = F <= sinirF;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Durma süresi ${dt} ms: ortalama kuvvet ${Math.round(F)} N; itme hep 1050 N·s`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">F = Δp / Δt = 1050 / {say(dt / 1000, 3)} = {say(F, 0)} N</text>
      <rect x={X0} y={Y0 - h} width={w} height={h} fill={guvenli ? "var(--c3)" : "var(--c2)"} opacity={0.35} stroke={guvenli ? "var(--c3)" : "var(--c2)"} strokeWidth={2} />
      {tasti && <Ok x1={X0 + w / 2 + 6} y1={Y0 - H + 22} x2={X0 + w / 2 + 6} y2={Y0 - H - 6} renk="var(--c2)" kalin={2} />}
      <line x1={X0} x2={X0 + W} y1={ys} y2={ys} stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="5 4" />
      <text x={X0 + W} y={ys - 6} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="end">yaralanma sınırı ~10 000 N</text>
      <line x1={X0} x2={X0 + W} y1={Y0} y2={Y0} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={X0} x2={X0} y1={Y0 - H - 10} y2={Y0} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={X0 - 6} y={Y0 - H} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="end">F</text>
      <text x={X0 + W} y={Y0 + 16} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="end">t (ms)</text>
      <text x={X0 + w} y={Y0 + 16} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{dt}</text>
      <text x={14} y={226} fontSize={12.5} fontWeight={800} fill={guvenli ? "var(--good)" : "var(--c2)"}>
        Alan = itme = 1050 N·s (hep aynı) · {guvenli ? "kuvvet sınırın altında" : "kuvvet çok büyük"}
      </text>
    </svg>
  );
}

/** Çarpışma hesabı: A (m1, v1) duran B'ye (m2) çarpar. */
function carpis(s: SahneProps["s"], v: SahneProps["v"]) {
  const m1 = Number(s.m1 ?? 1), v1 = Number(s.v1 ?? 4), m2 = v.m2 ?? Number(s.m2 ?? 1), esnek = s.esnek === true;
  const a = esnek ? ((m1 - m2) / (m1 + m2)) * v1 : (m1 * v1) / (m1 + m2);
  const b = esnek ? ((2 * m1) / (m1 + m2)) * v1 : a;
  return { m1, v1, m2, esnek, a, b, ke0: 0.5 * m1 * v1 * v1, ke1: 0.5 * m1 * a * a + 0.5 * m2 * b * b };
}

// Çarpışan arabalar: A (s.m1 kg, s.v1 m/s) duran B'ye (v.m2 ya da s.m2 kg) çarpar. s.esnek true: esnek, değilse yapışır.
function Carpisma({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), c = carpis(s, v);
  const wA = 24 + 8 * c.m1, wB = 24 + 8 * c.m2, xB0 = 150, yol = 120;
  const tc = 0.5, k = (xB0 - wA - 20) / (tc * c.v1); // px / (m/s · birim süre)
  const sonra = u > tc;
  const xA = sonra ? xB0 - wA + c.a * k * (u - tc) : 20 + c.v1 * k * u;
  const xB = sonra ? xB0 + c.b * k * (u - tc) : xB0;
  const xAk = sinir(xA, 4, 300 - wA - wB), xBk = sinir(xB, 4 + wA, 300 - wB);
  const pTop = c.m1 * c.v1;
  const vA = sonra ? c.a : c.v1, vB = sonra ? c.b : 0;
  const okA = (x: number, w: number, hiz: number, renk: string) => (Math.abs(hiz) > 0.01 ? <Ok x1={x + w / 2} y1={yol - 52} x2={x + w / 2 + hiz * 10} y2={yol - 52} renk={renk} kalin={2.5} /> : null);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${c.esnek ? "Esnek" : "Yapışan"} çarpışma: A ${c.m1} kg ${c.v1} m/s, B ${c.m2} kg; sonra A ${say(c.a)} m/s, B ${say(c.b)} m/s`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{c.esnek ? "Esnek çarpışma" : "Çarpışınca yapışırlar"}</text>
      <line x1={4} x2={336} y1={yol + 1} y2={yol + 1} stroke="var(--ink)" strokeWidth={1.5} />
      <rect x={xAk} y={yol - 30} width={wA} height={30} rx={5} fill="var(--c1)" />
      <text x={xAk + wA / 2} y={yol - 11} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">A</text>
      <rect x={xBk} y={yol - 30} width={wB} height={30} rx={5} fill="var(--c2)" />
      <text x={xBk + wB / 2} y={yol - 11} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">B</text>
      {okA(xAk, wA, vA, "var(--c1)")}
      {okA(xBk, wB, vB, "var(--c2)")}
      <g fontSize={12} fontWeight={700}>
        <text x={14} y={yol + 24} fill="var(--c1)">A: {c.m1} kg · {say(vA)} m/s</text>
        <text x={326} y={yol + 24} fill="var(--c2)" textAnchor="end">B: {c.m2} kg · {say(vB)} m/s</text>
      </g>
      <text x={14} y={192} fontSize={12.5} fontWeight={800} fill="var(--ink)">Toplam p: {say(pTop)} kg·m/s {sonra ? "(korundu)" : ""}</text>
      <text x={14} y={214} fontSize={12.5} fontWeight={800} fill={sonra && c.ke1 < c.ke0 - 1e-6 ? "var(--c2)" : "var(--muted)"}>
        Toplam KE: {sonra ? `${say(c.ke0)} J → ${say(c.ke1)} J` : `${say(c.ke0)} J`}
      </text>
    </svg>
  );
}

// Tüfek (4 kg) ve mermi (0,01 kg) dururken; oynatınca mermi 400 m/s ile sağa, tüfek geri teper.
function Patlama({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), atis = u > 0.15, g = Math.max(0, u - 0.15);
  const vT = (0.01 * 400) / 4;
  const dx = 40 - g * 60; // tüfek yavaşça geri
  const mx = 276 + g * 2000; // mermi hızla çıkar
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Tüfek ateşlenince mermi 400 m/s ile ileri, tüfek ${say(vT)} m/s ile geri gider; toplam momentum sıfır`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Başta ikisi de duruyor: toplam p = 0</text>
      <g transform={`translate(${dx} 0)`}>
        <path d="M60 104 L150 104 L150 116 L96 116 L80 134 L56 134 L64 116 Z" fill="var(--ink)" />
        <rect x={150} y={104} width={84} height={8} rx={2} fill="var(--ink)" />
      </g>
      {mx < 340 && <rect x={mx} y={105} width={10} height={6} rx={3} fill="var(--c4)" />}
      {atis && (
        <g>
          <Ok x1={150 + dx} y1={80} x2={110 + dx} y2={80} renk="var(--c1)" />
          <text x={14} y={170} fontSize={12.5} fontWeight={800} fill="var(--c1)">Tüfek: 4 kg · {say(vT)} m/s ← (p = 4)</text>
          <text x={14} y={192} fontSize={12.5} fontWeight={800} fill="var(--c4)">Mermi: 0,01 kg · 400 m/s → (p = 4)</text>
          <text x={14} y={220} fontSize={12.5} fontWeight={800} fill="var(--good)">Toplam: −4 + 4 = 0 kg·m/s</text>
        </g>
      )}
    </svg>
  );
}

export const FIZIK6: Record<string, SahneKaydi> = {
  "fiz6-kaldirac": { C: Kaldirac },
  "fiz6-turler": { C: Turler },
  "fiz6-makara": { C: Makara },
  "fiz6-rampa": { C: Rampa },
  "fiz6-bisiklet": {
    C: Bisiklet,
    geri: (v, s) => {
      const z = v.z ?? 24, hedef = Number(s.hedefTur ?? 3);
      return { baslik: "Henüz değil", metin: `Pedalın bir turunda tekerlek 48 / ${z} = ${say(48 / z, 2)} tur attı. ${hedef} tur için arka dişli 48 / ${hedef} = ${48 / hedef} diş olmalı.` };
    },
  },
  "fiz6-p": { C: PKarsilastir },
  "fiz6-duvar": { C: Duvar },
  "fiz6-yastik": { C: Yastik },
  "fiz6-carpisma": {
    C: Carpisma,
    geri: (v, s) => {
      const c = carpis(s, v);
      return { baslik: "Henüz değil", metin: `Ortak hız ${c.m1} · ${c.v1} / (${c.m1} + ${c.m2}) = ${say(c.a, 2)} m/s oldu. Toplam kütle büyüdükçe ortak hız küçülür.` };
    },
  },
  "fiz6-patlama": { C: Patlama },
};
