"use client";
// Fizik sahneleri (basit harmonik hareket; titreşimler ve dalgalar): yay ve geri getirici kuvvet, salınım, konum-zaman grafiği,
// yay-kütle periyodu, basit sarkaç, Dünya ve Ay'da sarkaç, enerji paylaşımı; enine ve boyuna dalga, v = λ·f, ortam değişimi,
// genlik, atmanın yansıması, girişim, salıncakta rezonans.
import type { SahneKaydi, SahneProps } from "./ortak";
import { Ok } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const DER = Math.PI / 180;
/** (x, y) noktalarından çizgi. */
const yol = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

/* ---------- ortak parçalar ---------- */

/** Sarmal yay: (x1, y1)'den (x2, y2)'ye n kıvrım. */
function Yay({ x1, y1, x2, y2, n = 9, h = 9 }: { x1: number; y1: number; x2: number; y2: number; n?: number; h?: number }) {
  const L = Math.max(1, Math.hypot(x2 - x1, y2 - y1)), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  const uc = Math.min(8, L / 4), ic = Math.max(0, L - 2 * uc), a = ic / n;
  const P = (s: number, d: number): [number, number] => [x1 + ux * s - uy * d, y1 + uy * s + ux * d];
  const pts: [number, number][] = [P(0, 0), P(uc, 0)];
  for (let i = 0; i < n; i++) pts.push(P(uc + a * (i + 0.25), -h), P(uc + a * (i + 0.75), h));
  pts.push(P(uc + ic, 0), P(L, 0));
  return <path d={yol(pts)} fill="none" stroke="var(--muted)" strokeWidth={2} strokeLinejoin="round" />;
}

/** Tavan: y yüksekliğinde x1..x2 arası, üstü taralı. */
function Tavan({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const n = Math.max(1, Math.floor((x2 - x1) / 10));
  return (
    <g stroke="var(--ink)">
      <line x1={x1} x2={x2} y1={y} y2={y} strokeWidth={2.4} />
      {Array.from({ length: n }, (_, i) => <line key={i} x1={x1 + 4 + i * 10} x2={x1 + 10 + i * 10} y1={y - 1} y2={y - 8} stroke="var(--line-2)" strokeWidth={1.4} />)}
    </g>
  );
}

/* Yatay yay-kütle düzeni: duvar x = 22, denge x = 176, 1 cm = 9 px. */
const MX = 176, PXC = 9, ZEMIN = 158, BW = 46, BH = 40;
const cmX = (x: number) => MX + PXC * x;

function Yatay({ x, soluk = [] }: { x: number; soluk?: number[] }) {
  const cx = cmX(sinir(x, -10, 10));
  return (
    <g>
      <line x1={22} x2={22} y1={ZEMIN - 72} y2={ZEMIN} stroke="var(--ink)" strokeWidth={2.4} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={21} x2={14} y1={ZEMIN - 64 + i * 12} y2={ZEMIN - 57 + i * 12} stroke="var(--line-2)" strokeWidth={1.4} />)}
      <line x1={22} x2={330} y1={ZEMIN} y2={ZEMIN} stroke="var(--ink)" strokeWidth={1.6} />
      <line x1={MX} x2={MX} y1={ZEMIN - 64} y2={ZEMIN + 8} stroke="var(--line-2)" strokeWidth={1.4} strokeDasharray="4 4" />
      {[-10, -5, 0, 5, 10].map((c) => (
        <g key={c}>
          <line x1={cmX(c)} x2={cmX(c)} y1={ZEMIN + 3} y2={ZEMIN + 9} stroke="var(--muted)" strokeWidth={1.2} />
          <text x={cmX(c)} y={ZEMIN + 23} fontSize={11} fill="var(--muted)" textAnchor="middle">{say(c)}</text>
        </g>
      ))}
      <text x={326} y={ZEMIN + 23} fontSize={11} fill="var(--muted)" textAnchor="end">cm</text>
      {soluk.map((s) => <rect key={s} x={cmX(s) - BW / 2} y={ZEMIN - BH} width={BW} height={BH} rx={6} fill="none" stroke="var(--line-2)" strokeWidth={1.4} strokeDasharray="4 3" />)}
      <Yay x1={22} y1={ZEMIN - BH / 2} x2={cx - BW / 2} y2={ZEMIN - BH / 2} />
      <rect x={cx - BW / 2} y={ZEMIN - BH} width={BW} height={BH} rx={6} fill="var(--c1)" />
      <text x={cx} y={ZEMIN - BH / 2 + 4.5} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">m</text>
    </g>
  );
}

/* ---------- Basit harmonik hareket ---------- */

// Geri getirici kuvvet: k = 50 N/m, uzanım v.x cm. Kırmızı ok F = −k·x (1 N = 12 px).
function GeriGetir({ v }: SahneProps) {
  const x = sinir(v.x ?? 0, -10, 10), F = (-50 * x) / 100, cx = cmX(x);
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={`Uzanım ${say(x)} cm; yay kuvveti ${say(Math.abs(F))} N ${F < 0 ? "sola" : F > 0 ? "sağa" : ""}`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">F = −k·x = −50 · {say(x / 100, 2)} = <tspan fill="var(--c2)">{say(F, 1)} N</tspan></text>
      <text x={14} y={44} fontSize={11.5} fontWeight={700} fill="var(--muted)">{x === 0 ? "dengede: yay kuvveti yok" : `kuvvet ${F < 0 ? "sola" : "sağa"}, yani dengeye doğru`}</text>
      <Yatay x={x} />
      {F !== 0 && (
        <g>
          <Ok x1={cx} x2={cx + F * 12} y={100} renk="var(--c2)" />
          <text x={cx + F * 6} y={90} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">F</text>
        </g>
      )}
      <text x={326} y={44} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">k = 50 N/m</text>
    </svg>
  );
}

// Salınım: +10 cm'den bırakılan cisim, T = 2 s (sahne zamanı). Yeşil: hız, kırmızı: ivme.
function Salinim({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure, w = Math.PI;
  const x = 10 * Math.cos(w * zt), hz = -10 * w * Math.sin(w * zt), iv = -w * w * x, cx = cmX(x);
  const bitti = zt >= sure - 1e-6 && !oynuyor, basladi = zt > 0;
  const durum =
    !basladi ? { y: "Cismi 10 cm çekip tutuyorsun", r: "var(--ink)" } :
    bitti ? { y: "İki tam salınım: hep −10 ile +10 cm arası", r: "var(--c1)" } :
    Math.abs(x) < 2 ? { y: "Dengede: hız en büyük, ivme sıfır", r: "var(--c3)" } :
    Math.abs(x) > 8.5 ? { y: "Uçta: hız sıfır, ivme en büyük", r: "var(--c2)" } :
    { y: "Salınıyor…", r: "var(--muted)" };
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Cisim ${say(x)} cm'de; ${durum.y}`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={durum.r}>{durum.y}</text>
      <Yatay x={x} soluk={zt >= 1 ? [-10, 10] : []} />
      <g>
        <Ok x1={cx} x2={cx + iv * 0.57} y={62} renk="var(--c2)" />
        {Math.abs(iv * 0.57) > 6 && <text x={cx + iv * 0.28} y={54} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">a</text>}
      </g>
      <g>
        <Ok x1={cx} x2={cx + hz * 1.8} y={92} renk="var(--c3)" />
        {Math.abs(hz * 1.8) > 6 && <text x={cx + hz * 0.9} y={84} fontSize={12} fontWeight={800} fill="var(--c3)" textAnchor="middle">v</text>}
      </g>
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">yeşil: hız · kırmızı: ivme · sürtünme yok</text>
    </svg>
  );
}

// Konum-zaman grafiği: düşey yay, x = 10·cos(πt) cm, T = 2 s. v.t: zaman (s).
function Grafik({ v }: SahneProps) {
  const tt = sinir(v.t ?? 0, 0, 2), x = 10 * Math.cos(Math.PI * tt);
  const GX0 = 82, GX1 = 318, GY = 150, A = 6;
  const gx = (z: number) => GX0 + (z / 2) * (GX1 - GX0), gy = (c: number) => GY - A * c;
  const egri = (son: number) => {
    const n = Math.max(2, Math.round(son * 60));
    return yol(Array.from({ length: n + 1 }, (_, k) => { const z = (k / n) * son; return [gx(z), gy(10 * Math.cos(Math.PI * z))] as [number, number]; }));
  };
  const by = gy(x), ad = Math.abs(x) > 9.95 ? (x > 0 ? " (+A)" : " (−A)") : Math.abs(x) < 0.05 ? " (denge)" : "";
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`t = ${say(tt, 2)} s anında x = ${say(x, 1)} cm`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">t = {say(tt, 2)} s → x = <tspan fill="var(--c2)">{say(x, 1)} cm{ad}</tspan></text>
      <Tavan x1={14} x2={58} y={52} />
      <g>
        <Yay x1={36} y1={52} x2={36} y2={by - 12} n={7} h={8} />
        <rect x={22} y={by - 12} width={28} height={24} rx={5} fill="var(--c1)" />
      </g>
      <g>
        {[10, -10].map((c) => <line key={c} x1={GX0} x2={GX1} y1={gy(c)} y2={gy(c)} stroke="var(--line)" strokeDasharray="3 4" />)}
        <line x1={GX0} x2={GX1 + 6} y1={GY} y2={GY} stroke="var(--ink)" strokeWidth={1.3} />
        <line x1={GX0} x2={GX0} y1={gy(12)} y2={gy(-12)} stroke="var(--ink)" strokeWidth={1.3} />
        <g fontSize={11} fill="var(--muted)" textAnchor="end">
          <text x={GX0 - 5} y={gy(10) + 4}>+A</text>
          <text x={GX0 - 5} y={GY + 4}>0</text>
          <text x={GX0 - 5} y={gy(-10) + 4}>−A</text>
        </g>
        {[0, 0.5, 1, 1.5, 2].map((z) => <text key={z} x={gx(z)} y={gy(-10) + 24} fontSize={11} fill="var(--muted)" textAnchor="middle">{say(z)}</text>)}
        <text x={GX1} y={gy(-10) + 40} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">t (s)</text>
      </g>
      <path d={egri(2)} fill="none" stroke="var(--line-2)" strokeWidth={1.4} />
      {tt > 0 && <path d={egri(tt)} fill="none" stroke="var(--c1)" strokeWidth={2.6} />}
      <line x1={50} x2={gx(tt)} y1={by} y2={by} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="4 4" />
      <circle cx={gx(tt)} cy={by} r={5} fill="var(--c2)" />
    </svg>
  );
}

// Yay-kütle periyodu: k = 40 N/m, v.m kg, v.A cm. Sağda x-t izi (0..4 s); soluk: önceki denemeler.
const K_P = 40;
function Periyot({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure;
  const m = sinir(v.m ?? 1, 1, 4), A = sinir(v.A ?? 10, 5, 15), w = (mm: number) => Math.sqrt(K_P / mm), T = (2 * Math.PI) / w(m);
  const GX0 = 82, GX1 = 318, GY = 146, PY = 4;
  const gx = (z: number) => GX0 + (z / sure) * (GX1 - GX0);
  const iz = (mm: number, aa: number, son: number) => {
    const n = Math.max(2, Math.round(son * 50));
    return yol(Array.from({ length: n + 1 }, (_, k) => { const z = (k / n) * son; return [gx(z), GY - PY * aa * Math.cos(w(mm) * z)] as [number, number]; }));
  };
  // Soldaki cisim grafikten bağımsız ölçekte (1 cm = 2,6 px) asılı; yay hiç çok kısalmaz.
  const x = A * Math.cos(w(m) * zt), by = 156 - 2.6 * x, bw = 22 + 4 * m, bh = 18 + 3 * m;
  const eskiler = kosular.slice(-3).filter((k) => !(oynuyor && k.m === m && k.A === A));
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Kütle ${m} kg, genlik ${A} cm; periyot ${say(T, 2)} s`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">T = 2π√(m/k) = <tspan fill="var(--c2)">{say(T, 2)} s</tspan></text>
      <Tavan x1={14} x2={58} y={52} />
      <g>
        <Yay x1={36} y1={52} x2={36} y2={by - bh / 2} n={7} h={8} />
        <rect x={36 - bw / 2} y={by - bh / 2} width={bw} height={bh} rx={5} fill="var(--c1)" />
        <text x={36} y={by + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">{m}</text>
      </g>
      <g>
        <line x1={GX0} x2={GX1 + 6} y1={GY} y2={GY} stroke="var(--ink)" strokeWidth={1.3} />
        <line x1={GX0} x2={GX0} y1={GY - 66} y2={GY + 66} stroke="var(--ink)" strokeWidth={1.3} />
        <text x={GX0 - 5} y={GY - 58} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">x</text>
        {[0, 1, 2, 3, 4].map((z) => <text key={z} x={gx(z)} y={GY + 84} fontSize={11} fill="var(--muted)" textAnchor="middle">{z}</text>)}
        <text x={GX1} y={GY + 100} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">t (s)</text>
      </g>
      {eskiler.map((k, i) => <path key={i} d={iz(sinir(k.m ?? 1, 1, 4), sinir(k.A ?? 10, 5, 15), sure)} fill="none" stroke="var(--c5)" strokeWidth={1.4} opacity={0.3} />)}
      {zt > 0 && <path d={iz(m, A, zt)} fill="none" stroke="var(--c1)" strokeWidth={2.4} />}
      {zt >= T && T <= sure && (
        <g>
          <path d={`M${gx(0)} ${GY - 70} V${GY - 64} H${gx(T)} V${GY - 70}`} fill="none" stroke="var(--c2)" strokeWidth={1.6} />
          <text x={(gx(0) + gx(T)) / 2} y={GY - 74} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">T</text>
        </g>
      )}
      <text x={326} y={44} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">k = 40 N/m{eskiler.length ? " · soluk: önceki denemeler" : ""}</text>
    </svg>
  );
}
const periyotGeri = (v: Record<string, number>) => {
  const m = v.m ?? 1;
  return {
    baslik: m === 1 ? "Periyot değişmedi" : `Periyot ${say(Math.sqrt(m), 2)} katına çıktı`,
    metin: m === 1
      ? "Genlik periyodu değiştirmez. Kütleyi değiştir."
      : `Kütle ${m} katına çıkınca periyot √${m} katına çıkar. Periyodun 2 katına çıkması için √m = 2 olmalı.`,
  };
};

/** Sarkaç: asma noktası (px, py), ip boyu L px, açı (radyan). */
function Sarkac({ px, py, L, aci, r, renk }: { px: number; py: number; L: number; aci: number; r: number; renk: string }) {
  const bx = px + L * Math.sin(aci), by = py + L * Math.cos(aci);
  return (
    <g>
      <line x1={px} y1={py} x2={bx} y2={by} stroke="var(--ink)" strokeWidth={1.6} />
      <circle cx={bx} cy={by} r={r} fill={renk} />
      <circle cx={px} cy={py} r={2.6} fill="var(--ink)" />
    </g>
  );
}

// Basit sarkaç: ip boyu v.L m, v.a = 1 ise ağır top. T = 2π√(L/g), açı 10°.
const SG = 9.8;
function BasitSarkac({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure;
  const Lm = sinir(v.L ?? 1, 0.25, 1), agir = (v.a ?? 0) === 1, T = 2 * Math.PI * Math.sqrt(Lm / SG);
  const aci = 10 * DER * Math.cos((2 * Math.PI * zt) / T);
  const gecmis = kosular.slice(-4);
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`İp ${say(Lm, 2)} m, ${agir ? "ağır" : "hafif"} top; periyot ${say(T, 2)} s`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Süre {say(zt, 1)} s · <tspan fill="var(--c2)">{Math.floor(zt / T + 1e-6)} salınım</tspan></text>
      <Tavan x1={60} x2={160} y={46} />
      <line x1={110} x2={110} y1={46} y2={226} stroke="var(--line)" strokeDasharray="4 4" />
      <Sarkac px={110} py={46} L={170 * Lm} aci={aci} r={agir ? 12 : 8} renk={agir ? "var(--ink)" : "var(--c4)"} />
      <g fontSize={12} fontWeight={700} fill="var(--ink)">
        <text x={190} y={72}>T = 2π√(L/g)</text>
        <text x={190} y={94} fill="var(--muted)">L = {say(Lm, 2)} m · {agir ? "ağır top" : "hafif top"}</text>
        <text x={190} y={120} fontSize={15} fontWeight={800} fill="var(--c2)">T ≈ {say(T, 2)} s</text>
      </g>
      {gecmis.length > 0 && (
        <g fontSize={11} fill="var(--c5)" fontWeight={700}>
          <text x={190} y={150}>Denemelerin:</text>
          {gecmis.map((k, i) => {
            const l = sinir(k.L ?? 1, 0.25, 1);
            return <text key={i} x={190} y={168 + i * 16}>{say(l, 2)} m · {(k.a ?? 0) === 1 ? "ağır" : "hafif"} → {say(2 * Math.PI * Math.sqrt(l / SG), 2)} s</text>;
          })}
        </g>
      )}
    </svg>
  );
}

// Dünya ve Ay'da 1 m'lik sarkaç. Dünya g = 9,8; Ay g = 1,62 m/s².
function AySarkac({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6.5), zt = ilerleme(t, oynuyor, sure) * sure;
  const yerler = [
    { ad: "Dünya", g: 9.8, gy: "9,8", x: 90, renk: "var(--c1)" },
    { ad: "Ay", g: 1.62, gy: "1,6", x: 250, renk: "var(--muted)" },
  ];
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label="Aynı 1 m'lik sarkaç Dünya'da ve Ay'da salınıyor">
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Süre: {say(zt, 1)} s</text>
      <line x1={170} x2={170} y1={40} y2={240} stroke="var(--line)" />
      {yerler.map((y) => {
        const T = 2 * Math.PI * Math.sqrt(1 / y.g), aci = 10 * DER * Math.cos((2 * Math.PI * zt) / T), n = Math.floor(zt / T + 1e-6);
        return (
          <g key={y.ad}>
            <text x={y.x} y={50} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{y.ad}</text>
            <text x={y.x} y={66} fontSize={11} fill="var(--muted)" textAnchor="middle">g = {y.gy} m/s²</text>
            <Tavan x1={y.x - 34} x2={y.x + 34} y={82} />
            <Sarkac px={y.x} py={82} L={110} aci={aci} r={10} renk={y.renk} />
            <text x={y.x} y={222} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{n} salınım</text>
            {zt >= T && <text x={y.x} y={240} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">T ≈ {say(T, 1)} s</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Enerji paylaşımı: k = 50 N/m, A = 10 cm, cisim dengeden v.x cm uzakta. E = 0,25 J.
function Enerji({ v }: SahneProps) {
  const x = sinir(v.x ?? 10, 0, 10), E = 0.25, Ep = 0.5 * 50 * (x / 100) ** 2, Ek = Math.max(0, E - Ep);
  const B0 = 126, W = 128, satir = (y: number, ad: string, deger: number, renk: string) => (
    <g>
      <text x={14} y={y} fontSize={12} fontWeight={800} fill={renk}>{ad} %{say((deger / E) * 100, 0)}</text>
      <rect x={B0} y={y - 10} width={W} height={11} rx={5.5} fill="var(--line)" />
      <rect x={B0} y={y - 10} width={Math.max(0, (W * deger) / E)} height={11} rx={5.5} fill={renk} />
      <text x={326} y={y} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{say(deger, 4)} J</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 206" role="img" aria-label={`Cisim dengeden ${say(x)} cm uzakta; kinetik %${say((Ek / E) * 100, 0)}, potansiyel %${say((Ep / E) * 100, 0)}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Toplam E = ½kA² = <tspan fill="var(--c1)">0,25 J</tspan></text>
      {satir(48, "Kinetik", Ek, "var(--c3)")}
      {satir(70, "Potansiyel", Ep, "var(--c4)")}
      <Yatay x={x} soluk={[-10, 10]} />
      <text x={14} y={200} fontSize={11.5} fontWeight={700} fill="var(--muted)">k = 50 N/m · A = 10 cm</text>
    </svg>
  );
}

/* ---------- Dalgalar ---------- */

// Enine (ip) ve boyuna (yay) dalga. v.b = 1 ise yay. Kırmızı tanecik yerinde titreşir.
function Tur({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure, boy = (v.b ?? 0) === 1;
  const X0 = 20, X1 = 320, Y = 124, LAM = 80, HZ = 80, IS = 180;
  const faz = (x: number) => { const g = zt - (x - X0) / HZ; return g > 0 ? Math.sin((2 * Math.PI * HZ * g) / LAM) : 0; };
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={boy ? "Yayda boyuna dalga: halkalar ileri geri titreşiyor" : "İpte enine dalga: tanecikler aşağı yukarı titreşiyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={boy ? "var(--c5)" : "var(--c1)"}>{boy ? "Yay: boyuna dalga" : "İp: enine dalga"}</text>
      <g>
        <Ok x1={130} x2={220} y={56} renk="var(--ink)" kalin={2} />
        <text x={175} y={46} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">yayılma yönü</text>
      </g>
      {boy ? (
        <g>
          <line x1={IS} x2={IS} y1={Y - 38} y2={Y + 38} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
          {Array.from({ length: 31 }, (_, i) => {
            const x0 = X0 + i * 10, x = x0 + 7 * faz(x0), k = x0 === IS;
            return <line key={i} x1={x} x2={x} y1={Y - 26} y2={Y + 26} stroke={k ? "var(--c2)" : "var(--c5)"} strokeWidth={k ? 3.4 : 1.8} strokeLinecap="round" />;
          })}
        </g>
      ) : (
        <g>
          <line x1={IS - 40} x2={IS + 40} y1={Y} y2={Y} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
          <line x1={IS} x2={IS} y1={Y - 32} y2={Y + 32} stroke="var(--line-2)" strokeWidth={1} strokeDasharray="2 3" />
          <path d={yol(Array.from({ length: 101 }, (_, i) => { const x = X0 + i * 3; return [x, Y - 24 * faz(x)] as [number, number]; }))} fill="none" stroke="var(--ink)" strokeWidth={2.4} />
          {Array.from({ length: 16 }, (_, i) => {
            const x = X0 + i * 20, k = x === IS;
            return <circle key={i} cx={x} cy={Y - 24 * faz(x)} r={k ? 6 : 3} fill={k ? "var(--c2)" : "var(--muted)"} />;
          })}
        </g>
      )}
      <text x={14} y={Y + 60} fontSize={11.5} fontWeight={700} fill="var(--muted)">kaynak</text>
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--c2)" textAnchor="end">kesik çizgi: kırmızı taneciğin başladığı yer</text>
    </svg>
  );
}

// v = λ·f: ipte hız 4 m/s, frekans v.f Hz. 1 m = 60 px. Dalga sabit hızla akar (her f için aynı).
function Dalga({ v }: SahneProps) {
  const f = sinir(v.f ?? 1, 1, 4), lam = 4 / f, lp = 60 * lam, Y = 112, X0 = 20, X1 = 320;
  const pts = Array.from({ length: Math.ceil((X1 - X0 + lp) / 3) + 1 }, (_, i) => { const x = X0 - lp + i * 3; return [x, Y - 22 * Math.sin((2 * Math.PI * (x - X0)) / lp)] as [number, number]; });
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={`Frekans ${f} Hz, dalga boyu ${say(lam, 2)} m, hız 4 m/s`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">v = λ·f = {say(lam, 2)} · {f} = <tspan fill="var(--c2)">4 m/s</tspan></text>
      <g>
        <path d={`M${X0 + 10} 50 V60 H${X0 + 10 + lp} V50`} fill="none" stroke="var(--c1)" strokeWidth={1.8} />
        <text x={X0 + 10 + lp / 2} y={46} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="middle">λ = {say(lam, 2)} m</text>
      </g>
      <defs><clipPath id="fiz11-dalga-kirp"><rect x={X0} y={70} width={X1 - X0} height={90} /></clipPath></defs>
      <g clipPath="url(#fiz11-dalga-kirp)">
        <g key={f}>
          <path d={yol(pts)} fill="none" stroke="var(--ink)" strokeWidth={2.4} />
          <animateTransform attributeName="transform" type="translate" from="0 0" to={`${lp} 0`} dur={`${(lp / 60).toFixed(3)}s`} repeatCount="indefinite" />
        </g>
      </g>
      <g>
        <line x1={X0} x2={X1} y1={168} y2={168} stroke="var(--muted)" strokeWidth={1.2} />
        {[0, 1, 2, 3, 4, 5].map((m) => (
          <g key={m}>
            <line x1={X0 + m * 60} x2={X0 + m * 60} y1={164} y2={172} stroke="var(--muted)" strokeWidth={1.2} />
            <text x={X0 + m * 60} y={188} fontSize={11} fill="var(--muted)" textAnchor="middle">{m}</text>
          </g>
        ))}
        <text x={334} y={188} fontSize={11} fill="var(--muted)" textAnchor="end">m</text>
      </g>
    </svg>
  );
}

// İnce ipten kalın ipe geçiş: f aynı, hız yarıya, dalga boyu yarıya iner.
function Ortam({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 5), zt = ilerleme(t, oynuyor, sure) * sure, bitti = zt >= sure - 1e-6 && !oynuyor;
  const X0 = 14, J = 170, X1 = 326, Y = 118, V1 = 80, V2 = 40, F = 1.25;
  const y = (x: number) => {
    const g = x <= J ? zt - (x - X0) / V1 : zt - (J - X0) / V1 - (x - J) / V2, A = x <= J ? 22 : 15;
    return g > 0 ? Y - A * Math.sin(2 * Math.PI * F * g) : Y;
  };
  const parca = (a: number, b: number) => yol(Array.from({ length: Math.round((b - a) / 2) + 1 }, (_, i) => { const x = a + i * 2; return [x, y(x)] as [number, number]; }));
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={bitti ? "Kalın ipte frekans aynı; hız ve dalga boyu küçüldü" : "Dalga ince ipten kalın ipe geçiyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "f aynı; kalın ipte v ve λ küçük" : "Dalga ince ipten kalın ipe geçiyor"}</text>
      <line x1={J} x2={J} y1={Y - 44} y2={Y + 44} stroke="var(--line-2)" strokeDasharray="4 4" />
      <path d={parca(X0, J)} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d={parca(J, X1)} fill="none" stroke="var(--ink)" strokeWidth={5.5} strokeLinejoin="round" />
      {bitti && (
        <g fontSize={11.5} fontWeight={800} textAnchor="middle">
          <path d="M62 66 V72 H126 V66" fill="none" stroke="var(--c1)" strokeWidth={1.6} />
          <text x={94} y={60} fill="var(--c1)">uzun λ</text>
          <path d="M226 78 V84 H258 V78" fill="none" stroke="var(--c2)" strokeWidth={1.6} />
          <text x={242} y={72} fill="var(--c2)">kısa λ</text>
        </g>
      )}
      {zt > 0 && <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={(X0 + J) / 2} y={Y + 64}>ince ip: hızlı</text>
        <text x={(J + X1) / 2} y={Y + 64}>kalın ip: yavaş</text>
      </g>}
      {zt > 0 && <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{bitti ? "frekansı kaynak, hızı ortam belirler" : "aynı kaynak, aynı frekans"}</text>}
    </svg>
  );
}

// Genlik: aynı ipte genliği A ve 3A olan iki dalga yarışıyor; cepheler hep yan yana.
function Genlik({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure, bitti = zt >= sure - 1e-6 && !oynuyor;
  const X0 = 20, X1 = 320, V = 70, LAM = 70, on = Math.min(X1, X0 + V * zt);
  const ip = (Y: number, A: number) => yol(Array.from({ length: 101 }, (_, i) => {
    const x = X0 + i * 3, g = zt - (x - X0) / V;
    return [x, g > 0 ? Y - A * Math.sin((2 * Math.PI * V * g) / LAM) : Y] as [number, number];
  }));
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label="Genliği A ve 3A olan iki dalga aynı ipte aynı hızla ilerliyor">
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>{bitti ? "Cepheler hep yan yana: hız aynı" : zt > 0 ? "Yarış sürüyor…" : "İki dalga yola çıkacak"}</text>
      <text x={14} y={52} fontSize={11.5} fontWeight={800} fill="var(--c1)">genlik A</text>
      <path d={ip(74, 8)} fill="none" stroke="var(--c1)" strokeWidth={2.4} />
      <text x={14} y={112} fontSize={11.5} fontWeight={800} fill="var(--c2)">genlik 3A</text>
      <path d={ip(158, 24)} fill="none" stroke="var(--c2)" strokeWidth={2.4} />
      {zt > 0 && <line x1={on} x2={on} y1={56} y2={190} stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="4 4" />}
      <text x={326} y={214} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{bitti ? "enerji genliğin karesiyle artar: alttaki 9 kat" : "kesik çizgi: dalga cephesi"}</text>
    </svg>
  );
}

// Atmanın yansıması: sabit uçta ters, serbest uçta (v.u = 1) düz döner. Uç x = 300.
function Yansima({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure, serbest = (v.u ?? 0) === 1, bitti = zt >= sure - 1e-6 && !oynuyor;
  const X0 = 20, UC = 300, Y = 122, H = 32, c = 70 + 110 * zt, isaret = serbest ? 1 : -1;
  const atma = (u: number) => H * Math.exp(-((u / 14) ** 2));
  const y = (x: number) => Y - (atma(x - c) + isaret * atma(x - (2 * UC - c)));
  const pts = Array.from({ length: (UC - X0) / 2 + 1 }, (_, i) => { const x = X0 + i * 2; return [x, y(x)] as [number, number]; });
  const ucY = y(UC), donus = c > UC;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={serbest ? "Serbest uç: atma düz yansıyor" : "Sabit uç: atma ters yansıyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={bitti ? (serbest ? "var(--c3)" : "var(--c2)") : "var(--ink)"}>
        {bitti ? (serbest ? "Atma düz döndü: tepe yine tepe" : "Atma ters döndü: tepe çukur oldu") : serbest ? "Serbest uç: halka çubukta kayar" : "Sabit uç: ip duvara bağlı"}
      </text>
      {serbest ? (
        <line x1={UC} x2={UC} y1={Y - 66} y2={Y + 66} stroke="var(--muted)" strokeWidth={3} strokeLinecap="round" />
      ) : (
        <g>
          <rect x={UC} y={Y - 66} width={10} height={132} fill="var(--line)" />
          <line x1={UC} x2={UC} y1={Y - 66} y2={Y + 66} stroke="var(--ink)" strokeWidth={2.4} />
        </g>
      )}
      <path d={yol(pts)} fill="none" stroke="var(--ink)" strokeWidth={2.4} />
      {serbest && <circle cx={UC} cy={ucY} r={6} fill="#fff" stroke="var(--ink)" strokeWidth={2} />}
      {zt > 0 && !bitti && (donus
        ? <Ok x1={2 * UC - c + 20} x2={2 * UC - c - 20} y={Y + (serbest ? -54 : 54)} renk="var(--c1)" kalin={2.2} />
        : <Ok x1={c - 20} x2={c + 20} y={Y - 54} renk="var(--c1)" kalin={2.2} />)}
      {zt === 0 && <Ok x1={c - 20} x2={c + 20} y={Y - 54} renk="var(--c1)" kalin={2.2} />}
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{serbest ? "uçtaki halka serbestçe yukarı aşağı kayar" : "uç duvara bağlı, hiç kıpırdamaz"}</text>
    </svg>
  );
}

// Girişim: soldan tepe, sağdan tepe ya da (v.c = 1) çukur. Buluşunca yer değiştirmeler toplanır.
function Girisim({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3.4), zt = ilerleme(t, oynuyor, sure) * sure, cukur = (v.c ?? 0) === 1, bitti = zt >= sure - 1e-6 && !oynuyor;
  const X0 = 20, X1 = 320, Y = 116, H = 30, VV = 70, ORTA = 170;
  const atma = (u: number) => H * Math.exp(-((u / 15) ** 2));
  const y = (x: number, z: number) => Y - (atma(x - (40 + VV * z)) + (cukur ? -1 : 1) * atma(x - (300 - VV * z)));
  const cizgi = (z: number) => yol(Array.from({ length: (X1 - X0) / 2 + 1 }, (_, i) => { const x = X0 + i * 2; return [x, y(x, z)] as [number, number]; }));
  const bulusma = (ORTA - 40) / VV, simdi = Math.abs(zt - bulusma) < 0.12;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={cukur ? "Bir tepe ve bir çukur karşılaşıyor" : "İki tepe karşılaşıyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={bitti || simdi ? (cukur ? "var(--c2)" : "var(--c3)") : "var(--ink)"}>
        {bitti || simdi ? (cukur ? "Yıkıcı girişim: ip bir an düz" : "Yapıcı girişim: genlik 2 katı") : "İki atma karşı karşıya"}
      </text>
      {bitti && (
        <g>
          <path d={cizgi(bulusma)} fill="none" stroke="var(--c5)" strokeWidth={1.6} strokeDasharray="4 4" opacity={0.7} />
          <text x={ORTA} y={cukur ? Y - 16 : Y - 2 * H - 10} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="middle">buluşma anı</text>
        </g>
      )}
      <path d={cizgi(zt)} fill="none" stroke="var(--ink)" strokeWidth={2.4} />
      {zt === 0 && (
        <g>
          <Ok x1={30} x2={70} y={Y + 28} renk="var(--c1)" kalin={2.2} />
          <Ok x1={310} x2={270} y={Y + 28} renk="var(--c1)" kalin={2.2} />
        </g>
      )}
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{bitti ? "buluştuktan sonra ikisi de değişmeden yoluna devam etti" : "yer değiştirmeler toplanır"}</text>
    </svg>
  );
}

// Rezonans: salıncağın kendi periyodu 2 s. Her v.p saniyede bir hep aynı yöne itilir (hafif sönümlü).
const W0 = Math.PI, SONUM = 0.06, ITME = 6;
const salincak = (p: number, z: number) => {
  let a = 0;
  for (let tn = 0; tn <= z + 1e-9; tn += p) a += ITME * Math.exp(-SONUM * (z - tn)) * Math.sin(W0 * (z - tn));
  return a;
};
function Rezonans({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 10), zt = ilerleme(t, oynuyor, sure) * sure, p = sinir(v.p ?? 1, 1, 3);
  const aci = salincak(p, zt), PX = 170, PY = 30, L = 104;
  const GX0 = 40, GX1 = 320, GY = 198, OL = 1.2;
  const gx = (z: number) => GX0 + (z / sure) * (GX1 - GX0);
  const iz = (pp: number, son: number) => {
    const n = Math.max(2, Math.round(son * 30));
    return yol(Array.from({ length: n + 1 }, (_, k) => { const z = (k / n) * son; return [gx(z), GY - OL * salincak(pp, z)] as [number, number]; }));
  };
  let enb = 0;
  for (let z = 0; z <= zt; z += 0.05) enb = Math.max(enb, Math.abs(salincak(p, z)));
  const itmeler: number[] = [];
  for (let tn = 0; tn < sure; tn += p) itmeler.push(tn);
  const itiyor = zt > 0 && itmeler.some((tn) => zt - tn >= 0 && zt - tn < 0.35);
  const bx = PX + L * Math.sin(aci * DER), by = PY + L * Math.cos(aci * DER);
  const eskiler = kosular.slice(-3).filter((k) => !(oynuyor && k.p === p));
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={`Her ${say(p, 1)} saniyede bir itilen salıncak; en büyük açı ${say(enb, 0)}°`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">En büyük açı: <tspan fill={enb > 15 ? "var(--c3)" : "var(--c2)"}>{say(enb, 0)}°</tspan></text>
      <Tavan x1={PX - 30} x2={PX + 30} y={PY} />
      <g>
        <line x1={PX} y1={PY} x2={bx} y2={by} stroke="var(--ink)" strokeWidth={1.8} />
        <rect x={bx - 14} y={by - 3} width={28} height={7} rx={3} fill="var(--c4)" transform={`rotate(${-aci} ${bx} ${by})`} />
      </g>
      {itiyor && (
        <g>
          <Ok x1={bx - 46} x2={bx - 18} y={by} renk="var(--c2)" />
          <text x={bx - 32} y={by - 10} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">it</text>
        </g>
      )}
      <g>
        <line x1={GX0} x2={GX1 + 6} y1={GY} y2={GY} stroke="var(--ink)" strokeWidth={1.3} />
        <line x1={GX0} x2={GX0} y1={GY - 40} y2={GY + 40} stroke="var(--ink)" strokeWidth={1.3} />
        <text x={GX0 - 5} y={GY - 30} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">açı</text>
        <text x={GX1} y={GY + 54} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">t (s) →</text>
        {[0, 2, 4, 6, 8, 10].map((z) => <text key={z} x={gx(z)} y={GY + 54} fontSize={11} fill="var(--muted)" textAnchor="middle">{z === 10 ? "" : z}</text>)}
      </g>
      {itmeler.map((tn) => <path key={tn} d={`M${gx(tn)} ${GY + 34} l-4 7 h8 Z`} fill="var(--c2)" opacity={zt >= tn ? 1 : 0.35} />)}
      {eskiler.map((k, i) => <path key={i} d={iz(sinir(k.p ?? 1, 1, 3), sure)} fill="none" stroke="var(--c5)" strokeWidth={1.3} opacity={0.3} />)}
      {zt > 0 && <path d={iz(p, zt)} fill="none" stroke="var(--c1)" strokeWidth={2} />}
      <text x={326} y={60} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">kırmızı üçgen: itme</text>
    </svg>
  );
}
const rezonansGeri = () => ({
  baslik: "Salınım büyümedi",
  metin: "İtmeler salınıma uymadı: kimi itme salıncağı hızlandırdı, kimi frenledi. İlk itmeden sonraki tümsek yarım salınımdır; itmeler salıncağın bir tam gidiş-gelişine denk gelmeli.",
});

export const FIZIK11: Record<string, SahneKaydi> = {
  "fiz11-geri": { C: GeriGetir },
  "fiz11-salinim": { C: Salinim },
  "fiz11-grafik": { C: Grafik },
  "fiz11-periyot": { C: Periyot, geri: periyotGeri },
  "fiz11-sarkac": { C: BasitSarkac },
  "fiz11-ay": { C: AySarkac },
  "fiz11-enerji": { C: Enerji },
  "fiz11-tur": { C: Tur },
  "fiz11-dalga": { C: Dalga },
  "fiz11-ortam": { C: Ortam },
  "fiz11-genlik": { C: Genlik },
  "fiz11-yansima": { C: Yansima },
  "fiz11-girisim": { C: Girisim },
  "fiz11-rezonans": { C: Rezonans, geri: rezonansGeri },
};
