"use client";
// Fizik sahneleri (manyetizma; indüksiyon ve alternatif akım): mıknatıs kutupları, kırılan mıknatıs, alan çizgileri ve pusula,
// Oersted deneyi, elektromıknatıs, tele etkiyen kuvvet, komütatörsüz motor; mıknatıs ve bobin, Lenz kuralı, raylarda kayan çubuk,
// jeneratör, şebeke gerilimi, transformatör, yüksek gerilimle iletim.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const DER = Math.PI / 180;

/* ---------- ortak parçalar ---------- */

/** Çubuk mıknatıs: (x, y) sol üst köşe. sol: soldaki kutup. N kırmızı, S mavi. */
function Miknatis({ x, y, w, h = 30, sol }: { x: number; y: number; w: number; h?: number; sol: "N" | "S" }) {
  const sag = sol === "N" ? "S" : "N", renk = (k: string) => (k === "N" ? "var(--c2)" : "var(--c1)");
  return (
    <g>
      <rect x={x} y={y} width={w / 2} height={h} fill={renk(sol)} />
      <rect x={x + w / 2} y={y} width={w / 2} height={h} fill={renk(sag)} />
      <g fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle">
        <text x={x + w / 4} y={y + h / 2 + 5.5}>{sol}</text>
        <text x={x + (3 * w) / 4} y={y + h / 2 + 5.5}>{sag}</text>
      </g>
    </g>
  );
}

/** Pusula: aci = iğnenin N ucunun ekrandaki yönü (radyan, 0 = sağ, saat yönünde artar). */
function Pusula({ x, y, aci, r = 15, soluk = false }: { x: number; y: number; aci: number; r?: number; soluk?: boolean }) {
  const c = Math.cos(aci), s = Math.sin(aci), u = r - 3, g = 3.6;
  const nx = x + c * u, ny = y + s * u, sx = x - c * u, sy = y - s * u, px = -s * g, py = c * g;
  return (
    <g opacity={soluk ? 0.35 : 1}>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="var(--line-2)" strokeWidth={1.6} />
      <path d={`M${nx} ${ny} L${x + px} ${y + py} L${x - px} ${y - py} Z`} fill="var(--c2)" />
      <path d={`M${sx} ${sy} L${x + px} ${y + py} L${x - px} ${y - py} Z`} fill="var(--muted)" />
      <circle cx={x} cy={y} r={1.8} fill="var(--ink)" />
    </g>
  );
}

/** Uçtaki yön oku (küçük üçgen); aci radyan, 0 = sağ. */
function Uc({ x, y, aci, renk, b = 6 }: { x: number; y: number; aci: number; renk: string; b?: number }) {
  const c = Math.cos(aci), s = Math.sin(aci), w = b * 0.65;
  return <path d={`M${x + c * b} ${y + s * b} L${x - c * b * 0.8 - s * w} ${y - s * b * 0.8 + c * w} L${x - c * b * 0.8 + s * w} ${y - s * b * 0.8 - c * w} Z`} fill={renk} />;
}

/** Düz ok. */
function Ok({ x1, y1, x2, y2, renk, kalin = 2.6 }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const a = Math.atan2(y2 - y1, x2 - x1), ux = x2 - Math.cos(a) * 6, uy = y2 - Math.sin(a) * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ux} y2={uy} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <Uc x={ux} y={uy} aci={a} renk={renk} />
    </g>
  );
}

/** Ekrandan çıkan (⊙) ya da ekrana giren (⊗) yön simgesi. */
function Yon({ x, y, cikan, r = 9, renk = "var(--ink)" }: { x: number; y: number; cikan: boolean; r?: number; renk?: string }) {
  const k = r * 0.6;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={renk} strokeWidth={2} />
      {cikan ? <circle cx={x} cy={y} r={r * 0.28} fill={renk} /> : <path d={`M${x - k} ${y - k} L${x + k} ${y + k} M${x + k} ${y - k} L${x - k} ${y + k}`} stroke={renk} strokeWidth={2} />}
    </g>
  );
}

/** Yandan görülen bobin: x1..x2 arasında n sarım, merkez yüksekliği y, çap h. */
function Bobin({ x1, x2, y, h, n, renk = "var(--c4)" }: { x1: number; x2: number; y: number; h: number; n: number; renk?: string }) {
  const k = Math.max(1, Math.round(n)), ad = (x2 - x1) / k;
  return (
    <g fill="none" stroke={renk} strokeWidth={2.4}>
      {Array.from({ length: k }, (_, i) => (
        <ellipse key={i} cx={x1 + ad * (i + 0.5)} cy={y} rx={Math.max(2, Math.min(7, ad * 0.45))} ry={h / 2} />
      ))}
    </g>
  );
}

/** Galvanometre: (x, y) iğnenin mili; sapma −1..1. iz: önceki koşuların en büyük sapmaları. */
function Galvanometre({ x, y, sapma, iz = [] }: { x: number; y: number; sapma: number; iz?: number[] }) {
  const R = 32, a = (-90 + 60 * sinir(sapma, -1, 1)) * DER;
  return (
    <g>
      <path d={`M${x - R - 6} ${y} A${R + 6} ${R + 6} 0 0 1 ${x + R + 6} ${y} Z`} fill="#fff" stroke="var(--line-2)" strokeWidth={1.6} />
      {[-60, -30, 0, 30, 60].map((d) => {
        const b = (-90 + d) * DER;
        return <line key={d} x1={x + Math.cos(b) * (R - 4)} y1={y + Math.sin(b) * (R - 4)} x2={x + Math.cos(b) * R} y2={y + Math.sin(b) * R} stroke="var(--muted)" strokeWidth={1.4} />;
      })}
      {iz.map((s, i) => {
        const b = (-90 + 60 * sinir(s, -1, 1)) * DER;
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(b) * (R - 2)} y2={y + Math.sin(b) * (R - 2)} stroke="var(--c5)" strokeWidth={2} opacity={0.3} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(a) * (R - 2)} y2={y + Math.sin(a) * (R - 2)} stroke="var(--c2)" strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={3} fill="var(--ink)" />
      <text x={x} y={y + 16} fontSize={11.5} fontWeight={800} fill="var(--muted)" textAnchor="middle">G</text>
    </g>
  );
}

/** Ampul (daire içinde flaman; ⊗ simgesiyle karışmasın). p: 0..1 parlaklık. */
function Lamba({ x, y, p }: { x: number; y: number; p: number }) {
  const q = sinir(p, 0, 1);
  return (
    <g>
      {q > 0.01 && <circle cx={x} cy={y} r={13 + 14 * q} fill="var(--c4)" opacity={0.12 + 0.3 * q} />}
      <circle cx={x} cy={y} r={11} fill={q > 0.01 ? "#ffe8a3" : "#fff"} stroke="var(--ink)" strokeWidth={2} />
      <path d={`M${x - 6} ${y + 7} V${y + 1} Q${x - 6} ${y - 6} ${x} ${y - 6} Q${x + 6} ${y - 6} ${x + 6} ${y + 1} V${y + 7}`} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
    </g>
  );
}

/* ---------- Manyetizma ---------- */

// İki mıknatıs. v.c = 1 ise sağdaki çevrilir: karşılıklı kutuplar zıt olur ve çekerler.
function Kutuplar({ v }: SahneProps) {
  const c = (v.c ?? 0) === 1, x2 = c ? 186 : 214;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={c ? "Karşılıklı N ve S: mıknatıslar birbirini çekiyor" : "Karşılıklı iki N kutbu: mıknatıslar birbirini itiyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={c ? "var(--c3)" : "var(--c2)"}>{c ? "N ile S karşı karşıya: çekiyor" : "N ile N karşı karşıya: itiyor"}</text>
      <g>
        <Miknatis x={c ? 44 : 16} y={98} w={110} sol="S" />
        <Miknatis x={x2} y={98} w={110} sol={c ? "S" : "N"} />
      </g>
      {c ? (
        <g>
          <Ok x1={128} y1={156} x2={160} y2={156} renk="var(--c3)" />
          <Ok x1={212} y1={156} x2={180} y2={156} renk="var(--c3)" />
        </g>
      ) : (
        <g>
          <Ok x1={110} y1={156} x2={72} y2={156} renk="var(--c2)" />
          <Ok x1={230} y1={156} x2={268} y2={156} renk="var(--c2)" />
          <path d="M126 104 Q170 88 214 104 M126 128 Q170 144 214 128" fill="none" stroke="var(--line-2)" strokeWidth={1.6} strokeDasharray="4 4" />
        </g>
      )}
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">aynı kutuplar iter, zıt kutuplar çeker</text>
    </svg>
  );
}

// Mıknatıs ortadan kırılıyor; oynatınca iki parça ayrılır ve her parçada yeni kutuplar belirir.
function Kirik({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), a = sinir((u - 0.15) / 0.35, 0, 1) * 26, yeni = u > 0.55;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={yeni ? "Kırılan mıknatısın iki parçası da N ve S kutuplu birer mıknatıs oldu" : "S ve N kutuplu bir çubuk mıknatıs ortadan kırılacak"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={yeni ? "var(--c3)" : "var(--ink)"}>{yeni ? "İki tam mıknatıs" : u > 0 ? "Kırılıyor…" : "Mıknatısı ortadan kır"}</text>
      <g>
        {yeni ? <Miknatis x={70 - a} y={92} w={100} h={34} sol="S" /> : <rect x={70 - a} y={92} width={100} height={34} fill="var(--c1)" />}
        {yeni ? <Miknatis x={170 + a} y={92} w={100} h={34} sol="S" /> : <rect x={170 + a} y={92} width={100} height={34} fill="var(--c2)" />}
        {!yeni && (
          <g fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle">
            <text x={120 - a} y={114.5}>S</text>
            <text x={220 + a} y={114.5}>N</text>
          </g>
        )}
      </g>
      {u === 0 && <path d="M170 82 L164 96 L176 108 L166 122 L172 136" fill="none" stroke="var(--ink)" strokeWidth={1.8} strokeDasharray="4 3" />}
      {yeni && (
        <g fontSize={11.5} fontWeight={800} textAnchor="middle">
          <text x={145 - a} y={146} fill="var(--c2)">yeni N</text>
          <text x={195 + a} y={146} fill="var(--c1)">yeni S</text>
        </g>
      )}
      <text x={326} y={206} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{yeni ? "tek kutuplu mıknatıs yoktur" : "sol yarısı S, sağ yarısı N"}</text>
    </svg>
  );
}

/* Alan çizgileri: N kutbundaki +1 ve S kutbundaki −1 "yükten" hesaplanır (yalnızca çizim için yaklaşık model). */
const NP = { x: 222, y: 120 }, SP = { x: 118, y: 120 };
function alan(x: number, y: number) {
  let bx = 0, by = 0;
  for (const [p, q] of [[NP, 1], [SP, -1]] as const) {
    const dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 30, r3 = r2 * Math.sqrt(r2);
    bx += (q * dx) / r3;
    by += (q * dy) / r3;
  }
  return [bx, by] as const;
}
const CIZGILER = (() => {
  const yollar: { d: string; ox: number; oy: number; oa: number }[] = [];
  for (const derece of [-140, -105, -70, -35, 0, 35, 70, 105, 140]) {
    let x = NP.x + Math.cos(derece * DER) * 9, y = NP.y + Math.sin(derece * DER) * 9;
    const pts: [number, number][] = [[x, y]];
    for (let i = 0; i < 700; i++) {
      const [bx, by] = alan(x, y), n = Math.hypot(bx, by) || 1;
      x += (3 * bx) / n;
      y += (3 * by) / n;
      pts.push([x, y]);
      if (Math.hypot(x - SP.x, y - SP.y) < 9 || x < 4 || x > 336 || y < 38 || y > 214) break;
    }
    const m = pts[Math.floor(pts.length * (Math.abs(derece) < 20 ? 0.25 : 0.5))], m2 = pts[Math.min(pts.length - 1, pts.indexOf(m) + 1)];
    yollar.push({ d: "M" + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L"), ox: m[0], oy: m[1], oa: Math.atan2(m2[1] - m[1], m2[0] - m[0]) });
  }
  return yollar;
})();
const YERLER = [[44, 62], [170, 58], [266, 120], [170, 186], [74, 120], [306, 204]] as const;

// Çubuk mıknatısın alan çizgileri; pusula v.p numaralı yerde (1..6).
function Alan({ v }: SahneProps) {
  const p = sinir(Math.round(v.p ?? 1), 1, 6), [px, py] = YERLER[p - 1], [bx, by] = alan(px, py);
  const B = Math.hypot(bx, by), ref = Math.hypot(...alan(266, 120)), oran = B / ref;
  const derece = oran > 0.6 ? "güçlü" : oran > 0.25 ? "orta" : "zayıf";
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Pusula ${p}. yerde; alan ${derece}`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">{p}. yerde alan: <tspan fill={derece === "güçlü" ? "var(--c2)" : derece === "orta" ? "var(--c4)" : "var(--muted)"}>{derece}</tspan></text>
      <g>
        {CIZGILER.map((c, i) => (
          <g key={i}>
            <path d={c.d} fill="none" stroke="var(--c5)" strokeWidth={1.5} opacity={0.55} />
            <Uc x={c.ox} y={c.oy} aci={c.oa} renk="var(--c5)" b={5} />
          </g>
        ))}
      </g>
      <Miknatis x={110} y={106} w={120} h={28} sol="S" />
      <g>
        {YERLER.map(([x, y], i) =>
          i + 1 === p ? null : (
            <g key={i}>
              <circle cx={x} cy={y} r={9} fill="#fff" stroke="var(--line-2)" strokeWidth={1.4} />
              <text x={x} y={y + 4} fontSize={11} fontWeight={800} fill="var(--muted)" textAnchor="middle">{i + 1}</text>
            </g>
          ),
        )}
        <Pusula x={px} y={py} aci={Math.atan2(by, bx)} r={16} />
      </g>
      <text x={326} y={230} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">iğnenin kırmızı (N) ucu alan yönünü gösterir</text>
    </svg>
  );
}

// Oersted: tel ekrana dik, (170, 128). v.i = 1 akım var, v.y = 1 akım ekrana giriyor (⊗).
function Oersted({ v }: SahneProps) {
  const i = (v.i ?? 0) === 1, giren = (v.y ?? 0) === 1, cx = 170, cy = 128;
  const yon = giren ? 1 : -1; // −1: saat yönünün tersi (ekranda)
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={!i ? "Akım yok: pusulalar kuzeyi gösteriyor" : `Akım ${giren ? "ekrana giriyor; alan saat yönünde" : "ekrandan çıkıyor; alan saat yönünün tersine"} dönüyor`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={i ? "var(--c5)" : "var(--muted)"}>{!i ? "Akım yok: pusulalar kuzeyi gösteriyor" : giren ? "⊗ akım ekrana giriyor: alan saat yönünde" : "⊙ akım sana doğru: alan saat yönünün tersine"}</text>
      {i && (
        <g>
          {[30, 60, 90].map((r, k) => (
            <g key={r}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c5)" strokeWidth={1.6} opacity={0.55 - k * 0.12} />
              {[60, 240].map((d) => {
                const a = d * DER;
                return <Uc key={d} x={cx + Math.cos(a) * r} y={cy - Math.sin(a) * r} aci={Math.atan2(Math.cos(a) * yon, Math.sin(a) * yon)} renk="var(--c5)" b={5} />;
              })}
            </g>
          ))}
          <g fontSize={11} fontWeight={800} fill="var(--c5)">
            <text x={cx - 33} y={cy - 4} textAnchor="end">B</text>
            <text x={cx - 63} y={cy - 4} textAnchor="end">B/2</text>
            <text x={cx - 93} y={cy - 4} textAnchor="end">B/3</text>
          </g>
        </g>
      )}
      <g>
        {[30, 90, 150, 210, 270, 330].map((d) => {
          const a = d * DER, x = cx + Math.cos(a) * 75, y = cy - Math.sin(a) * 75;
          const aci = i ? Math.atan2(-Math.cos(a) * -yon, -Math.sin(a) * -yon) : -Math.PI / 2;
          return <Pusula key={d} x={x} y={y} aci={aci} r={12} />;
        })}
      </g>
      {i ? <Yon x={cx} y={cy} cikan={!giren} r={10} renk="var(--c2)" /> : <circle cx={cx} cy={cy} r={10} fill="#fff" stroke="var(--muted)" strokeWidth={2} />}
      <text x={326} y={228} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{i ? "B = 2k · I / d: uzaklaştıkça zayıflar" : "tel ekrana dik duruyor"}</text>
    </svg>
  );
}

// Elektromıknatıs: v.N sarım, v.c = 1 demir çekirdek. Akım 2 A. Çekilen ataç = N · I · (çekirdek ? 1 : 1/4) / 10.
function Elektromiknatis({ v }: SahneProps) {
  const N = sinir(v.N ?? 10, 10, 50), c = (v.c ?? 0) === 1, n = sinir(Math.floor((N * 2 * (c ? 1 : 0.25)) / 10), 0, 10);
  const ucY = 92, askiX = c ? 262 : 216;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${N} sarım, ${c ? "demir çekirdekli" : "çekirdeksiz"}: ${n} ataç çekiliyor`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Çekilen ataç: <tspan fill="var(--c2)">{n}</tspan></text>
      <path d="M88 92 V56 H40 V112 M40 136 V170 H210 V92" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={24} y={112} width={32} height={24} rx={3} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      <text x={40} y={128.5} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">2 A</text>
      {c ? <rect x={78} y={80} width={184} height={24} rx={2} fill="#9aa5b4" /> : <rect x={78} y={80} width={184} height={24} rx={2} fill="none" stroke="var(--line-2)" strokeWidth={1.4} strokeDasharray="4 4" />}
      <Bobin x1={88} x2={210} y={92} h={40} n={N / 2.5} />
      <text x={149} y={58} fontSize={11.5} fontWeight={800} fill="var(--c4)" textAnchor="middle">{N} sarım</text>
      {!c && <text x={236} y={70} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">çekirdek yok</text>}
      <g>
        {Array.from({ length: n }, (_, k) => {
          const x = askiX - 12 + (k % 2) * 14, y = ucY + 16 + Math.floor(k / 2) * 21;
          return <rect key={k} x={x - 4} y={y} width={9} height={18} rx={4} fill="none" stroke="var(--c1)" strokeWidth={2} />;
        })}
      </g>
      <g>
        {Array.from({ length: 10 - n }, (_, k) => (
          <rect key={k} x={16 + k * 13} y={204} width={9} height={18} rx={4} fill="none" stroke="var(--line-2)" strokeWidth={2} transform={`rotate(70 ${20 + k * 13} 213)`} />
        ))}
      </g>
      <line x1={10} x2={330} y1={226} y2={226} stroke="var(--line)" strokeWidth={1.4} />
    </svg>
  );
}

// Manyetik alandaki tele etkiyen kuvvet: B = 0,2 T sağa, I = 5 A, L = 0,5 m; tel B ile v.a derece açı yapar.
function Kuvvet({ v }: SahneProps) {
  const a = sinir(v.a ?? 90, 0, 90), F = 0.2 * 5 * 0.5 * Math.sin(a * DER), cx = 170, cy = 128, L = 80;
  const ux = Math.cos(a * DER), uy = -Math.sin(a * DER);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Tel ile alan arasındaki açı ${a}°, kuvvet ${say(F, 3)} N`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">F = B·I·L·sinθ = <tspan fill="var(--c2)">{say(F, 3)} N</tspan></text>
      <g>
        {[56, 92, 128, 164, 200].map((y) => <Ok key={y} x1={22} y1={y} x2={318} y2={y} renk="var(--c5)" kalin={1.4} />)}
        <text x={318} y={46} fontSize={12} fontWeight={800} fill="var(--c5)" textAnchor="end">B = 0,2 T</text>
      </g>
      <line x1={cx - ux * L} y1={cy - uy * L} x2={cx + ux * L} y2={cy + uy * L} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <Uc x={cx + ux * (L - 22)} y={cy + uy * (L - 22)} aci={Math.atan2(uy, ux)} renk="var(--c4)" b={8} />
      <text x={cx + ux * (L - 22) + 12} y={cy + uy * (L - 22) - 6} fontSize={11.5} fontWeight={800} fill="var(--c4)">I = 5 A</text>
      {a > 0 && <path d={`M${cx + 34} ${cy} A34 34 0 0 0 ${cx + Math.cos(a * DER) * 34} ${cy - Math.sin(a * DER) * 34}`} fill="none" stroke="var(--ink)" strokeWidth={1.4} />}
      <text x={cx + 40} y={cy + 18} fontSize={12} fontWeight={800} fill="var(--ink)">θ = {a}°</text>
      {F > 0.001 ? <Yon x={cx} y={cy} cikan={false} r={5 + 18 * (F / 0.25) * 0.5} renk="var(--c2)" /> : <circle cx={cx} cy={cy} r={3} fill="var(--ink)" />}
      <text x={14} y={228} fontSize={11.5} fontWeight={700} fill="var(--muted)">{F > 0.001 ? "⊗ kuvvet ekrana giriyor (L = 0,5 m)" : "tel alana paralel: kuvvet yok"}</text>
    </svg>
  );
}

// Komütatörsüz motor (yandan): bobin düzlemi yatayken başlar; tork onu dik konuma iter, salınıp orada durur.
function Motor({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), zt = u * sure;
  const aci = (90 - 90 * Math.exp(-0.85 * zt) * Math.cos(2.4 * zt)) * DER, cx = 170, cy = 124, R = 56;
  const x1 = cx - Math.cos(aci) * R, y1 = cy + Math.sin(aci) * R, x2 = cx + Math.cos(aci) * R, y2 = cy - Math.sin(aci) * R;
  const bitti = !oynuyor && u >= 1;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Bobin dik konumda salınıp durdu" : "Komütatörsüz bobin mıknatıslar arasında, akım hep aynı yönde"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Bobin dik durdu: tork sıfır" : "Komütatör yok: akım hep aynı yönde"}</text>
      <rect x={14} y={70} width={46} height={110} fill="var(--c2)" />
      <text x={37} y={131} fontSize={17} fontWeight={800} fill="#fff" textAnchor="middle">N</text>
      <rect x={280} y={70} width={46} height={110} fill="var(--c1)" />
      <text x={303} y={131} fontSize={17} fontWeight={800} fill="#fff" textAnchor="middle">S</text>
      <g>
        {[94, 124, 154].map((y) => <Ok key={y} x1={66} y1={y} x2={274} y2={y} renk="var(--c5)" kalin={1.2} />)}
      </g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--c4)" strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3.5} fill="var(--ink)" />
      <Yon x={x1} y={y1} cikan={false} r={9} renk="var(--ink)" />
      <Yon x={x2} y={y2} cikan r={9} renk="var(--ink)" />
      <Ok x1={x1} y1={y1 + 12} x2={x1} y2={y1 + 32} renk="var(--c2)" />
      <Ok x1={x2} y1={y2 - 12} x2={x2} y2={y2 - 32} renk="var(--c2)" />
      <text x={326} y={228} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">kırmızı oklar: tellere etkiyen kuvvetler</text>
    </svg>
  );
}

/* ---------- İndüksiyon ve alternatif akım ---------- */

// Mıknatıs bobine doğru v.h hızıyla iter. Galvanometre sapması hız × yakınlıkla orantılı (akı değişim hızı).
const F_YOL = 160, F_X0 = 22;
function farUc(t: number, h: number) {
  const g = sinir((t * h) / 2.4, 0, 1);
  return { uc: F_X0 + 86 + F_YOL * g, hareket: g < 1 };
}
function Faraday({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 3), h = sinir(v.h ?? 1, 1, 3), zt = ilerleme(t, oynuyor, sure) * sure;
  const { uc, hareket } = farUc(zt, h);
  const yakin = Math.exp(-(((uc - 196) / 48) ** 2));
  const sapma = oynuyor && hareket && zt > 0 ? (h / 3) * yakin : 0;
  const iz = kosular.slice(-3).map((k) => sinir(k.h ?? 1, 1, 3) / 3);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Mıknatıs ${h} birim hızla bobine itiliyor; galvanometre ${sapma > 0.05 ? "sapıyor" : "sıfırda"}`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={sapma > 0.05 ? "var(--c2)" : "var(--muted)"}>{sapma > 0.05 ? "Akı değişiyor: indüksiyon akımı" : zt > 0 && !oynuyor ? "Mıknatıs durdu: akım yok" : "Mıknatısı bobine it"}</text>
      <path d="M200 120 V158 H232 M296 120 V158 H264" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g>
        <Miknatis x={uc - 86} y={73} w={86} h={26} sol="S" />
      </g>
      <Bobin x1={196} x2={300} y={86} h={64} n={9} />
      <Galvanometre x={248} y={196} sapma={sapma} iz={iz} />
      {iz.length > 0 && <text x={194} y={222} fontSize={11} fontWeight={700} fill="var(--c5)" textAnchor="end">soluk çizgiler: önceki denemeler</text>}
      {zt === 0 && <Ok x1={50} y1={124} x2={110} y2={124} renk="var(--ink)" kalin={2} />}
    </svg>
  );
}

// Lenz: N kutbu bobine yaklaşır; bobinin mıknatısa bakan yüzü N olur ve mıknatısı iter.
function Lenz({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure);
  const g = u < 0.6 ? Math.sin((u / 0.6) * (Math.PI / 2)) : 1 - 0.18 * Math.sin(((u - 0.6) / 0.4) * (Math.PI / 2));
  const x = 18 + 92 * g, acik = u > 0.35;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={acik ? "Bobinin mıknatısa bakan yüzü N oldu ve yaklaşan N kutbunu itiyor" : "Mıknatısın N kutbu bobine yaklaşıyor"}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill={acik ? "var(--c2)" : "var(--ink)"}>{acik ? "Bobin yaklaşmaya karşı koyuyor" : "N kutbu bobine yaklaşıyor"}</text>
      <Miknatis x={x} y={100} w={90} h={28} sol="S" />
      <Bobin x1={200} x2={296} y={114} h={70} n={8} />
      {acik && (
        <g>
          <text x={200} y={172} fontSize={17} fontWeight={800} fill="var(--c2)" textAnchor="middle">N</text>
          <text x={296} y={172} fontSize={17} fontWeight={800} fill="var(--c1)" textAnchor="middle">S</text>
          <Ok x1={x + 70} y1={146} x2={x + 28} y2={146} renk="var(--c2)" />
          <text x={x + 49} y={168} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">itme</text>
          <path d="M248 66 A40 12 0 0 1 288 76" fill="none" stroke="var(--c5)" strokeWidth={2} />
          <Uc x={288} y={76} aci={0.9} renk="var(--c5)" />
          <text x={248} y={60} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="middle">indüksiyon akımı</text>
        </g>
      )}
      <text x={326} y={222} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{acik ? "Lenz: enerjinin korunumu" : "mıknatıs hızla itiliyor"}</text>
    </svg>
  );
}

// Raylarda kayan çubuk: B = 0,5 T ekrana giriyor, L = 0,4 m, hız v.v m/s. ε = B·L·v.
function Cubuk({ v }: SahneProps) {
  const h = sinir(v.v ?? 0, 0, 10), e = 0.5 * 0.4 * h;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Çubuk ${h} m/s ile kayıyor; ε = ${say(e, 2)} V`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">ε = B·L·v = 0,5·0,4·{h} = <tspan fill="var(--c2)">{say(e, 2)} V</tspan></text>
      <g>
        {[100, 150, 200, 250, 300].flatMap((x) => [94, 140, 186].map((y) => (
          <path key={`${x}-${y}`} d={`M${x - 4} ${y - 4} L${x + 4} ${y + 4} M${x + 4} ${y - 4} L${x - 4} ${y + 4}`} stroke="var(--c5)" strokeWidth={1.5} opacity={0.6} />
        )))}
        <text x={326} y={50} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="end">⊗ B = 0,5 T</text>
      </g>
      <path d="M330 62 H40 V125 M40 155 V218 H330" fill="none" stroke="var(--ink)" strokeWidth={2.4} />
      <Lamba x={40} y={140} p={e / 1.2} />
      <g>
        <line x1={120} y1={56} x2={120} y2={224} stroke="var(--c4)" strokeWidth={6} strokeLinecap="round" />
        <Ok x1={128} y1={140} x2={164} y2={140} renk="var(--c2)" />
        <text x={146} y={132} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">v</text>
        {h > 0 && <animateTransform attributeName="transform" type="translate" from="0 0" to="190 0" dur={`${(10 / h).toFixed(2)}s`} repeatCount="indefinite" />}
      </g>
      <text x={56} y={82} fontSize={11.5} fontWeight={800} fill="var(--ink)">L = 0,4 m</text>
    </svg>
  );
}

// Jeneratör: bobin v.r tur/s ile döner (yavaşlatılmış). Sağda ε–t grafiği; tepe değeri dönme hızıyla orantılı.
function Jenerator({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 2), r = sinir(v.r ?? 1, 1, 3), zt = ilerleme(t, oynuyor, sure) * sure;
  const GX0 = 128, GX1 = 318, GY = 132, A = 24;
  const gx = (z: number) => GX0 + (z / sure) * (GX1 - GX0);
  const egri = (rr: number, son: number) => {
    const n = Math.max(2, Math.round((son / sure) * 160));
    return "M" + Array.from({ length: n + 1 }, (_, k) => { const z = (k / n) * son; return `${gx(z).toFixed(1)} ${(GY - A * rr * Math.sin(2 * Math.PI * rr * z)).toFixed(1)}`; }).join(" L");
  };
  const aci = 2 * Math.PI * r * zt, cx = 62, cy = 132;
  const eskiler = kosular.slice(-3).filter((k) => !(oynuyor && k.r === r));
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Bobin saniyede ${r} tur dönüyor; tepe gerilimi ${r} birim`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">εmax = N·B·A·ω: <tspan fill="var(--c2)">{r} birim</tspan>, {r} tur/s</text>
      <rect x={10} y={84} width={20} height={96} fill="var(--c2)" />
      <text x={20} y={137} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">N</text>
      <rect x={94} y={84} width={20} height={96} fill="var(--c1)" />
      <text x={104} y={137} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">S</text>
      <ellipse cx={cx} cy={cy} rx={Math.max(1.5, Math.abs(Math.cos(aci)) * 26)} ry={40} fill="none" stroke="var(--c4)" strokeWidth={4} />
      <g>
        <line x1={GX0} x2={GX1} y1={GY} y2={GY} stroke="var(--ink)" strokeWidth={1.3} />
        <line x1={GX0} x2={GX0} y1={GY - 80} y2={GY + 80} stroke="var(--ink)" strokeWidth={1.3} />
        <text x={GX0 - 4} y={GY - 70} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="end">ε</text>
        <text x={334} y={GY + 4} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="end">t</text>
      </g>
      {eskiler.map((k, i) => <path key={i} d={egri(sinir(k.r ?? 1, 1, 3), sure)} fill="none" stroke="var(--c5)" strokeWidth={1.4} opacity={0.3} />)}
      {zt > 0 && <path d={egri(r, zt)} fill="none" stroke="var(--c2)" strokeWidth={2.4} />}
      <text x={326} y={228} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{eskiler.length ? "soluk: önceki denemeler" : "akım yön değiştirir: alternatif akım"}</text>
    </svg>
  );
}

// Şebeke gerilimi: v = 325·sin(2π·50·t), t = v.t ms (0..20).
function Sebeke({ v }: SahneProps) {
  const tm = sinir(v.t ?? 0, 0, 20), u = 325 * Math.sin(2 * Math.PI * 50 * tm / 1000);
  const GX0 = 46, GX1 = 322, GY = 130, A = 78, gx = (z: number) => GX0 + (z / 20) * (GX1 - GX0), gy = (x: number) => GY - (x / 325) * A;
  const d = "M" + Array.from({ length: 121 }, (_, k) => { const z = k / 6; return `${gx(z).toFixed(1)} ${gy(325 * Math.sin((2 * Math.PI * z) / 20)).toFixed(1)}`; }).join(" L");
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`t = ${tm} ms, gerilim ${Math.round(u)} V`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">t = {tm} ms: v = <tspan fill="var(--c2)">{say(Math.round(u), 0)} V</tspan></text>
      <g>
        <line x1={GX0} x2={GX1 + 6} y1={GY} y2={GY} stroke="var(--ink)" strokeWidth={1.3} />
        <line x1={GX0} x2={GX0} y1={GY - A - 12} y2={GY + A + 8} stroke="var(--ink)" strokeWidth={1.3} />
        {[0, 5, 10, 15, 20].map((z) => <text key={z} x={z === 20 ? GX1 + 8 : gx(z)} y={GY + A + 22} fontSize={10.5} fill="var(--muted)" textAnchor={z === 20 ? "end" : "middle"}>{z === 20 ? "20 ms" : z}</text>)}
        {[325, -325].map((x) => <text key={x} x={GX0 - 4} y={gy(x) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{say(x, 0)}</text>)}
      </g>
      <line x1={GX0} x2={GX1} y1={gy(325)} y2={gy(325)} stroke="var(--c2)" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={GX0} x2={GX1} y1={gy(230)} y2={gy(230)} stroke="var(--c3)" strokeWidth={1.4} strokeDasharray="6 4" />
      <text x={GX1} y={gy(230) - 5} fontSize={11} fontWeight={800} fill="var(--c3)" textAnchor="end">etkin 230 V</text>
      <path d={d} fill="none" stroke="var(--c1)" strokeWidth={2.4} />
      <line x1={gx(tm)} x2={gx(tm)} y1={GY} y2={gy(u)} stroke="var(--c2)" strokeWidth={1.4} strokeDasharray="3 3" />
      <circle cx={gx(tm)} cy={gy(u)} r={6} fill="var(--c2)" />
    </svg>
  );
}

// Transformatör: N1 = 1000 sarım, kaynak 230 V AC (v.d = 1 ise 12 V pil). İkincil v.N2 sarım.
function Trafo({ v }: SahneProps) {
  const N2 = sinir(v.N2 ?? 500, 50, 2000), dc = (v.d ?? 0) === 1, V2 = dc ? 0 : (230 * N2) / 1000;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={dc ? "Pil bağlı: akı değişmiyor, çıkış 0 V" : `İkincil ${N2} sarım: çıkış ${say(V2, 1)} V`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">{dc ? <>V₂ = <tspan fill="var(--c2)">0 V</tspan>: akı değişmiyor</> : <>V₂ = 230 · {N2} / 1000 = <tspan fill="var(--c2)">{say(V2, 1)} V</tspan></>}</text>
      <path d="M110 58 H230 V194 H110 Z M128 76 V176 H212 V76 Z" fill="#c4ccd6" fillRule="evenodd" />
      {!dc && (
        <path d="M119 126 V67 H221 V185 H119 Z" fill="none" stroke="var(--c5)" strokeWidth={1.6} strokeDasharray="5 6" opacity={0.7}>
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.7s" repeatCount="indefinite" />
        </path>
      )}
      <g transform="rotate(90 119 126)"><Bobin x1={89} x2={149} y={126} h={34} n={10} /></g>
      <g transform="rotate(90 221 126)"><Bobin x1={181} x2={261} y={126} h={34} n={sinir(N2 / 100, 1, 20)} /></g>
      <path d="M102 104 H56 V114 M56 140 V150 H102" fill="none" stroke="var(--ink)" strokeWidth={2} />
      {dc ? (
        <g>
          <rect x={40} y={114} width={32} height={26} rx={3} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
          <text x={56} y={131} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">12 V</text>
          <text x={56} y={166} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">pil (DC)</text>
        </g>
      ) : (
        <g>
          <circle cx={56} cy={127} r={13} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
          <path d="M48 127 Q52 119 56 127 T64 127" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
          <text x={56} y={166} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">230 V AC</text>
        </g>
      )}
      <path d="M238 104 H292 V112 M292 136 V150 H238" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <Lamba x={292} y={124} p={V2 / 60} />
      <g fontSize={11.5} fontWeight={800} textAnchor="middle">
        <text x={119} y={214} fill="var(--c4)">N₁ = 1000</text>
        <text x={221} y={214} fill="var(--c4)">N₂ = {N2}</text>
      </g>
    </svg>
  );
}

// İletim hattı: santral 10 MW, hat direnci 10 Ω, gerilim v.k × 38 kV. Kayıp = I²·R.
function Iletim({ v }: SahneProps) {
  const k = sinir(v.k ?? 1, 1, 10), V = 38 * k, I = 10000 / V, kayip = (I * I * 10) / 1000, yuzde = kayip / 100;
  const p = sinir(kayip / 692.5, 0, 1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${V} kV ile iletim: akım ${Math.round(I)} A, kayıp ${say(kayip, 1)} kW`}>
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">I = P / V = <tspan fill="var(--c4)">{say(I, 1)} A</tspan></text>
      <rect x={10} y={96} width={48} height={50} rx={3} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      <text x={34} y={125} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">10 MW</text>
      <text x={34} y={162} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">santral</text>
      <path d="M58 110 H66 M270 110 H290" stroke="var(--ink)" strokeWidth={2} />
      <g>
        {[66, 258].map((x) => (
          <g key={x}>
            <circle cx={x + 6} cy={110} r={8} fill="#fff" stroke="var(--ink)" strokeWidth={1.8} />
            <circle cx={x + 14} cy={110} r={8} fill="#fff" stroke="var(--ink)" strokeWidth={1.8} />
          </g>
        ))}
      </g>
      {[120, 170, 220].map((x) => <path key={x} d={`M${x - 10} 150 L${x} 92 L${x + 10} 150 M${x - 12} 98 H${x + 12}`} fill="none" stroke="var(--muted)" strokeWidth={1.6} />)}
      <path d="M88 110 Q114 104 120 98 Q145 108 170 98 Q195 108 220 98 Q240 104 258 110" fill="none" stroke="var(--ink)" strokeWidth={2} />
      {p > 0.002 && <path d="M88 110 Q114 104 120 98 Q145 108 170 98 Q195 108 220 98 Q240 104 258 110" fill="none" stroke="var(--c2)" strokeWidth={2 + 8 * p} opacity={0.15 + 0.5 * p} />}
      <text x={173} y={80} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{V} kV hat, R = 10 Ω</text>
      <g>
        <rect x={292} y={100} width={14} height={46} fill="#fff" stroke="var(--ink)" strokeWidth={1.8} />
        <rect x={308} y={88} width={18} height={58} fill="#fff" stroke="var(--ink)" strokeWidth={1.8} />
        <text x={309} y={162} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">şehir</text>
      </g>
      <g>
        <text x={14} y={196} fontSize={12} fontWeight={800} fill="var(--ink)">Kayıp = I²·R = <tspan fill="var(--c2)">{say(kayip, 1)} kW</tspan> (%{say(yuzde, 2)})</text>
        <rect x={14} y={208} width={312} height={12} rx={6} fill="var(--line)" />
        <rect x={14} y={208} width={Math.max(4, 312 * p)} height={12} rx={6} fill="var(--c2)" />
      </g>
    </svg>
  );
}

export const FIZIK10: Record<string, SahneKaydi> = {
  "fiz10-kutuplar": { C: Kutuplar },
  "fiz10-kirik": { C: Kirik },
  "fiz10-alan": { C: Alan },
  "fiz10-oersted": { C: Oersted },
  "fiz10-elektromiknatis": { C: Elektromiknatis },
  "fiz10-kuvvet": { C: Kuvvet },
  "fiz10-motor": { C: Motor },
  "fiz10-faraday": { C: Faraday },
  "fiz10-lenz": { C: Lenz },
  "fiz10-cubuk": { C: Cubuk },
  "fiz10-jenerator": { C: Jenerator },
  "fiz10-sebeke": { C: Sebeke },
  "fiz10-trafo": { C: Trafo },
  "fiz10-iletim": { C: Iletim },
};
