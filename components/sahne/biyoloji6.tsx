"use client";
// Biyoloji sahneleri (ekosistem, bitki biyolojisi): enerji piramidi ve %10 kuralı, ekolojik piramitler,
// biyolojik birikim, karbon ve azot döngüsü, ötrofikasyon; terleme çekimi, stoma, kaynak-havuz taşıması,
// yıllık halkalar, tepe baskınlığı, fototropizma ve çimlenme koşulları.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
/** 10000 → "10 000" (kartlardaki yazım). */
const sayi = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 6 }).replace(/\./g, " ");
const YESIL = "var(--biyoloji)", SU = "#cfe4fb", SU_K = "#7fb2ea";

/* ---------- enerji piramidi: %10 kuralı ---------- */

const ZINCIR = [
  { ad: "ot", rol: "üretici", e: 10000 },
  { ad: "çekirge", rol: "birincil tüketici", e: 1000 },
  { ad: "kurbağa", rol: "ikincil tüketici", e: 100 },
  { ad: "yılan", rol: "üçüncül tüketici", e: 10 },
  { ad: "kartal", rol: "dördüncül tüketici", e: 1 },
];
const GEN = [300, 248, 196, 144, 92];

function Zincir({ v }: SahneProps) {
  const n = sinir(v.ust ?? 1, 1, 5), son = ZINCIR[n - 1];
  return (
    <svg viewBox="0 0 340 260" role="img" aria-label={`${son.ad} (${son.rol}): ${sayi(son.e)} kJ`}>
      <text x={20} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{son.ad}: {sayi(son.e)} kJ</text>
      <text x={20} y={38} fontSize={11} fontWeight={600} fill="var(--muted)">{son.rol}</text>
      {ZINCIR.map((z, i) => {
        const w = GEN[i], y = 206 - i * 34, on = i < n;
        return (
          <g key={i}>
            <rect x={170 - w / 2} y={y} width={w} height={30} rx={6} fill={on ? YESIL : "none"} fillOpacity={on ? 0.18 + 0.14 * i : 0} stroke={on ? YESIL : "var(--line-2)"} strokeWidth={1.4} strokeDasharray={on ? undefined : "4 4"} />
            <text x={170} y={y + 20} fontSize={12} fontWeight={700} fill={on ? "var(--ink)" : "var(--muted)"} textAnchor="middle">
              {on ? `${z.ad} · ${sayi(z.e)} kJ` : "?"}
            </text>
          </g>
        );
      })}
      <text x={170} y={256} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">her basamakta enerjinin ≈ %90'ı üste geçmez (ısı, atık)</text>
    </svg>
  );
}

/* ---------- ekolojik piramitler ---------- */

const PIRAMIT = [
  { ad: "Enerji piramidi", alt: "çayır, kJ", b: [{ ad: "ot", d: "10 000 kJ", w: 290 }, { ad: "çekirge", d: "1 000 kJ", w: 210 }, { ad: "kurbağa", d: "100 kJ", w: 136 }] },
  { ad: "Birey sayısı piramidi", alt: "tek bir ağaç", b: [{ ad: "ağaç", d: "1", w: 70 }, { ad: "tırtıl", d: "3 000", w: 280 }, { ad: "kuş", d: "20", w: 110 }] },
  { ad: "Biyokütle piramidi", alt: "okyanus, anlık kütle (g/m²)", b: [{ ad: "fitoplankton", d: "4", w: 120 }, { ad: "zooplankton", d: "21", w: 280 }] },
];

function Piramit({ v }: SahneProps) {
  const p = PIRAMIT[sinir((v.tur ?? 1) - 1, 0, 2)];
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${p.ad}: ${p.b.map((b) => `${b.ad} ${b.d}`).join(", ")}`}>
      <text x={20} y={22} fontSize={13.5} fontWeight={800} fill={YESIL}>{p.ad}</text>
      <text x={20} y={39} fontSize={11} fontWeight={600} fill="var(--muted)">{p.alt}</text>
      <g key={p.ad} className="ad-belir">
        {p.b.map((b, i) => {
          const y = 186 - i * 46;
          return (
            <g key={i}>
              <rect x={170 - b.w / 2} y={y} width={b.w} height={40} rx={6} fill={YESIL} fillOpacity={0.16 + 0.16 * i} stroke={YESIL} strokeWidth={1.4} />
              <text x={170} y={y + 25} fontSize={12.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{b.ad} · {b.d}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ---------- biyolojik birikim (DDT) ---------- */

const BIRIKIM = [
  { ad: "su", ppm: "0,000003", n: 1 },
  { ad: "plankton", ppm: "0,04", n: 3 },
  { ad: "küçük balık", ppm: "0,5", n: 7 },
  { ad: "büyük balık", ppm: "2", n: 13 },
  { ad: "balıkçıl", ppm: "25", n: 26 },
];

function Canli({ i, x, y }: { i: number; x: number; y: number }) {
  if (i === 0) return <path d={`M${x - 26} ${y} q6.5 -6 13 0 t13 0 t13 0 t13 0`} fill="none" stroke={SU_K} strokeWidth={2.4} strokeLinecap="round" />;
  if (i === 1) return <g fill="#9fd4b0">{[[-8, -4], [6, -8], [2, 6]].map(([a, b], k) => <circle key={k} cx={x + a} cy={y + b} r={5} />)}</g>;
  if (i === 2 || i === 3) {
    const r = i === 2 ? 0.7 : 1;
    return (
      <g transform={`translate(${x} ${y}) scale(${r})`} fill="#8fb3d9">
        <ellipse cx={0} cy={0} rx={22} ry={11} />
        <path d="M18 0 L32 -10 L32 10 Z" />
        <circle cx={-12} cy={-3} r={2} fill="var(--ink)" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`} fill="#b9c2cc">
      <ellipse cx={0} cy={0} rx={13} ry={9} />
      <path d="M-10 -4 Q-16 -22 -6 -26 L2 -28 L-2 -24 Q-8 -20 -4 -6 Z" />
      <path d="M-4 -28 L-18 -24 L-4 -25 Z" fill="#e0a43a" />
      <path d="M10 -2 L26 6 L10 6 Z" />
      <line x1={-2} y1={8} x2={-4} y2={24} stroke="#7d8896" strokeWidth={1.6} />
      <line x1={4} y1={8} x2={6} y2={24} stroke="#7d8896" strokeWidth={1.6} />
    </g>
  );
}

function Birikim({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure), bitti = !oynuyor && t >= sure;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`DDT derişimi: ${BIRIKIM.map((b) => `${b.ad} ${b.ppm} ppm`).join(", ")}`}>
      <text x={20} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">DDT derişimi (ppm, yaklaşık)</text>
      {BIRIKIM.map((b, i) => {
        const x = 38 + i * 66, gor = u >= i / 5 + 0.04 || bitti;
        const r = rastgele(31 + i * 7), yer = Array.from({ length: b.n }, () => [r(), r()]);
        return (
          <g key={i}>
            <Canli i={i} x={x} y={100} />
            {gor && (
              <g className="ad-belir">
                {yer.map(([a, c], k) => (
                  <circle key={k} cx={x - 24 + a * 48} cy={134 + c * 40} r={2.6} fill="var(--c2)" />
                ))}
                <text x={x} y={196} fontSize={12.5} fontWeight={800} fill={i === 4 ? "var(--c2)" : "var(--ink)"} textAnchor="middle">{b.ppm}</text>
              </g>
            )}
            {!gor && <text x={x} y={196} fontSize={12.5} fontWeight={800} fill="var(--muted)" textAnchor="middle">?</text>}
            <text x={x} y={216} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{b.ad}</text>
          </g>
        );
      })}
      <text x={20} y={232} fontSize={11} fontWeight={600} fill="var(--muted)">noktalar temsilîdir</text>
    </svg>
  );
}

/* ---------- karbon döngüsü ---------- */

function Ok({ x1, y1, x2, y2, renk, kesik = false }: { x1: number; y1: number; x2: number; y2: number; renk: string; kesik?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1), u = 7;
  const p = (d: number) => `${x2 - u * Math.cos(a) + d * Math.sin(a) * 0.7},${y2 - u * Math.sin(a) - d * Math.cos(a) * 0.7}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - u * Math.cos(a)} y2={y2 - u * Math.sin(a)} stroke={renk} strokeWidth={2.2} strokeDasharray={kesik ? "5 4" : undefined} />
      <polygon points={`${x2},${y2} ${p(6)} ${p(-6)}`} fill={renk} />
    </g>
  );
}

function Agac({ x, y, olcek = 1 }: { x: number; y: number; olcek?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${olcek})`}>
      <rect x={-5} y={-36} width={10} height={36} rx={2} fill="#a4825f" />
      <circle cx={0} cy={-52} r={24} fill={YESIL} fillOpacity={0.75} />
    </g>
  );
}

function Karbon({ v }: SahneProps) {
  const yak = v.yak === 1, ayr = v.ayr === 1;
  const durum = yak ? "artıyor ↑" : "dengede";
  return (
    <svg viewBox="0 0 340 254" role="img" aria-label={`Karbon döngüsü. Havadaki CO₂ ${durum}${ayr ? "" : "; ayrıştırıcı yok, ölü madde birikiyor"}`}>
      <g>
        <rect x={110} y={12} width={120} height={40} rx={10} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
        <text x={170} y={30} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">havadaki CO₂</text>
        <text x={170} y={45} fontSize={11} fontWeight={700} fill={yak ? "var(--c2)" : "var(--muted)"} textAnchor="middle">{durum}</text>
      </g>
      <line x1={10} y1={196} x2={330} y2={196} stroke="#a4825f" strokeWidth={2} />
      <Agac x={56} y={196} />
      <g transform="translate(140 196)">
        <ellipse cx={0} cy={-14} rx={16} ry={10} fill="#c9b49a" />
        <circle cx={-15} cy={-22} r={7} fill="#c9b49a" />
        <ellipse cx={-17} cy={-33} rx={2.4} ry={7} fill="#c9b49a" />
      </g>
      <g transform="translate(212 196)">
        <path d="M-10 0 Q-10 -12 0 -14 Q10 -12 10 0 Z" fill="#d9a066" />
        <rect x={-2.5} y={-8} width={5} height={8} fill="#efe2cf" />
        {!ayr && <g fill="#a98a5a">{[-26, -14, -2, 10, 22].map((d) => <ellipse key={d} cx={d} cy={-3} rx={7} ry={3} transform={`rotate(${d} ${d} -3)`} />)}</g>}
      </g>
      <g transform="translate(288 196)">
        <rect x={-20} y={-34} width={40} height={34} fill="#9aa5b1" />
        <rect x={6} y={-58} width={8} height={26} fill="#9aa5b1" />
      </g>
      <Ok x1={126} y1={52} x2={70} y2={116} renk={YESIL} />
      <Ok x1={40} y1={120} x2={110} y2={32} renk="var(--c4)" kesik />
      <Ok x1={142} y1={160} x2={156} y2={56} renk="var(--c4)" kesik />
      {ayr && <Ok x1={212} y1={176} x2={190} y2={56} renk="var(--c4)" kesik />}
      {yak && <Ok x1={298} y1={132} x2={232} y2={46} renk="var(--c2)" />}
      <g fontSize={11} fontWeight={700} textAnchor="middle">
        <text x={56} y={214} fill="var(--muted)">bitki</text>
        <text x={140} y={214} fill="var(--muted)">hayvan</text>
        <text x={212} y={214} fill={ayr ? "var(--muted)" : "var(--c2)"}>{ayr ? "ayrıştırıcı" : "ölü madde"}</text>
        {!ayr && <text x={212} y={227} fill="var(--c2)">birikiyor</text>}
        <text x={288} y={214} fill={yak ? "var(--c2)" : "var(--muted)"}>fosil yakıt</text>
        {yak && <text x={288} y={227} fill="var(--c2)">yanıyor</text>}
      </g>
      <g fontSize={11} fontWeight={700}>
        <line x1={14} y1={243} x2={30} y2={243} stroke={YESIL} strokeWidth={2.2} />
        <text x={34} y={247} fill={YESIL}>fotosentez</text>
        <line x1={106} y1={243} x2={122} y2={243} stroke="var(--c4)" strokeWidth={2.2} strokeDasharray="5 4" />
        <text x={126} y={247} fill="#b47f0c">solunum, ayrışma</text>
        <line x1={234} y1={243} x2={250} y2={243} stroke="var(--c2)" strokeWidth={2.2} />
        <text x={254} y={247} fill="var(--c2)">yanma</text>
      </g>
    </svg>
  );
}

/* ---------- azot döngüsü ---------- */

const AZOT = [
  { x: 170, y: 32, ad: "havadaki N₂", w: 108 },
  { x: 66, y: 120, ad: "amonyak (NH₄⁺)", w: 110 },
  { x: 120, y: 206, ad: "nitrit (NO₂⁻)", w: 98 },
  { x: 250, y: 206, ad: "nitrat (NO₃⁻)", w: 102 },
  { x: 280, y: 120, ad: "bitki", w: 64 },
];
// Oklar sırayla çizilir: [x1, y1, x2, y2, renk, yazılar [x, y, metin, hizalama]]
const AZOT_OK: { p: [number, number, number, number]; renk: string; kesik?: boolean; yazi: [number, number, string, "start" | "middle" | "end"][] }[] = [
  { p: [130, 46, 72, 106], renk: "var(--c1)", yazi: [[12, 70, "azot bağlama", "start"], [12, 84, "(Rhizobium)", "start"]] },
  { p: [80, 134, 108, 192], renk: "var(--c1)", yazi: [[12, 170, "nitrifikasyon", "start"]] },
  { p: [170, 206, 198, 206], renk: "var(--c1)", yazi: [[184, 238, "nitrifikasyon", "middle"]] },
  { p: [262, 192, 279, 134], renk: YESIL, yazi: [[282, 168, "bitki alır", "start"]] },
  { p: [236, 192, 196, 46], renk: "var(--c5)", kesik: true, yazi: [[208, 116, "denitrifikasyon", "end"]] },
];

function Azot({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure), bitti = !oynuyor && t >= sure;
  const adim = bitti ? 5 : u * 5.2;
  const gorunur = (i: number) => i === 0 || i === 4 || adim > i - 0.4;
  return (
    <svg viewBox="0 0 340 246" role="img" aria-label={bitti ? "Azot döngüsü: N₂ → amonyak → nitrit → nitrat → bitki; nitrat → N₂" : "Havadaki N₂ ve bitki"}>
      {AZOT_OK.map((o, i) => {
        if (adim <= i) return null;
        const k = sinir(adim - i), [x1, y1, x2, y2] = o.p;
        return (
          <g key={i}>
            <Ok x1={x1} y1={y1} x2={ara(x1, x2, k)} y2={ara(y1, y2, k)} renk={o.renk} kesik={o.kesik} />
            {k >= 1 && (
              <g className="ad-belir" fontSize={11} fontWeight={700} fill={o.renk}>
                {o.yazi.map(([x, y, m, h], j) => <text key={j} x={x} y={y} textAnchor={h}>{m}</text>)}
              </g>
            )}
          </g>
        );
      })}
      {AZOT.map((n, i) =>
        gorunur(i) ? (
          <g key={i} className={i > 0 && i < 4 ? "ad-belir" : undefined}>
            <rect x={n.x - n.w / 2} y={n.y - 13} width={n.w} height={26} rx={8} fill="#fff" stroke={i === 4 ? YESIL : "var(--ink)"} strokeWidth={1.5} />
            <text x={n.x} y={n.y + 4.5} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{n.ad}</text>
          </g>
        ) : null,
      )}
      {!oynuyor && t === 0 && <text x={170} y={128} fontSize={22} fontWeight={800} fill="var(--muted)" textAnchor="middle">?</text>}
    </svg>
  );
}

/* ---------- ötrofikasyon ---------- */

const GOL_EVRE = [
  { u: 0, ad: "Gübre göle karışıyor", not: "azot ve fosfor artıyor" },
  { u: 0.22, ad: "Algler aşırı çoğalıyor", not: "yüzey yeşile dönüyor" },
  { u: 0.46, ad: "Algler ölüp dibe çöküyor", not: "ayrıştırıcı bakteriler çoğalıyor" },
  { u: 0.7, ad: "Bakteriler O₂'yi tüketiyor", not: "balıklar havasız kalıyor" },
];

function Gol({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure), basladi = oynuyor || t > 0;
  const e = [...GOL_EVRE].reverse().find((x) => u >= x.u) ?? GOL_EVRE[0];
  const gubre = yumusak(u / 0.2), alg = yumusak((u - 0.18) / 0.25), ol = yumusak((u - 0.46) / 0.2), bak = yumusak((u - 0.5) / 0.3), o2d = yumusak((u - 0.55) / 0.4);
  const o2 = ara(9, 2, o2d);
  const YU = 76, DIP = 206;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={basladi ? `${e.ad}; çözünmüş O₂ ${o2.toFixed(1)} mg/L` : "Temiz göl, çözünmüş O₂ 9 mg/L"}>
      <text x={14} y={20} fontSize={13} fontWeight={800} fill={YESIL}>{basladi ? e.ad : "Temiz bir göl"}</text>
      <text x={14} y={36} fontSize={11} fontWeight={600} fill="var(--muted)">{basladi ? e.not : "balıklar, az alg"}</text>
      <path d={`M14 ${YU} L270 ${YU} L270 ${DIP} Q142 ${DIP + 18} 14 ${DIP} Z`} fill={SU} />
      <rect x={14} y={YU - 2} width={256} height={4 + 14 * alg * (1 - ol * 0.5)} fill={YESIL} opacity={0.15 + 0.6 * alg} />
      {gubre > 0 && gubre < 1 && (
        <g fill="var(--c4)">{Array.from({ length: 10 }, (_, k) => <circle key={k} cx={30 + k * 22} cy={YU + 8 + gubre * 30 + (k % 3) * 8} r={2.6} opacity={1 - gubre * 0.6} />)}</g>
      )}
      {ol > 0 && <g fill="#6f9a5a" opacity={ol}>{Array.from({ length: 12 }, (_, k) => <ellipse key={k} cx={28 + k * 20} cy={ara(YU + 14, DIP - 4 + (k % 2) * 4, ol)} rx={5} ry={2} />)}</g>}
      {bak > 0 && <g fill="var(--c5)">{Array.from({ length: Math.round(18 * bak) }, (_, k) => <circle key={k} cx={22 + ((k * 37) % 240)} cy={DIP - 12 - ((k * 13) % 26)} r={1.8} />)}</g>}
      {[[70, 130], [150, 112], [210, 156]].map(([x, y], k) => {
        const olu = o2 < 4 && k < 2 + (o2 < 3 ? 1 : 0);
        return (
          <g key={k} transform={`translate(${x} ${olu ? YU + 10 : y}) rotate(${olu ? 180 : 0})`} fill={olu ? "#b9c2cc" : "#5f95cf"}>
            <ellipse cx={0} cy={0} rx={14} ry={7} />
            <path d="M12 0 L22 -7 L22 7 Z" />
            <circle cx={-7} cy={-2} r={1.6} fill="#fff" />
          </g>
        );
      })}
      <g>
        <rect x={292} y={YU} width={22} height={130} rx={6} fill="none" stroke="var(--line-2)" strokeWidth={1.4} />
        <rect x={294} y={YU + 128 - (o2 / 10) * 126} width={18} height={(o2 / 10) * 126} rx={4} fill={o2 < 4 ? "var(--c2)" : "var(--c1)"} />
        <text x={303} y={YU - 18} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">O₂</text>
        <text x={303} y={YU - 5} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{o2.toFixed(1).replace(".", ",")}</text>
        <text x={303} y={YU + 146} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">mg/L</text>
      </g>
      <g fontSize={11} fontWeight={700}>
        {alg > 0.3 && <text x={20} y={YU - 8} fill={YESIL}>algler</text>}
        {bak > 0.3 && <text x={20} y={DIP + 30} fill="var(--c5)">bakteriler (ayrıştırıcı)</text>}
      </g>
    </svg>
  );
}

/* ---------- terleme çekimi ---------- */

function Terleme({ v }: SahneProps) {
  const acik = v.st === 1;
  const buhar = [[84, 70], [130, 40], [176, 34], [236, 62]];
  return (
    <svg viewBox="0 0 340 260" role="img" aria-label={acik ? "Stomalar açık: terlemeyle su yukarı çekiliyor" : "Stomalar kapalı: su akışı çok yavaş"}>
      <g>
        <ellipse cx={170} cy={86} rx={104} ry={56} fill={YESIL} fillOpacity={0.22} stroke={YESIL} strokeWidth={1.4} />
        <rect x={158} y={128} width={24} height={86} fill="#d8c3a5" />
        <path d="M170 214 L130 248 M170 214 L170 252 M170 214 L210 248 M150 230 L134 236 M190 230 L206 238" stroke="#a4825f" strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <line x1={20} y1={214} x2={320} y2={214} stroke="#a4825f" strokeWidth={1.6} />
      </g>
      <g stroke={SU_K} strokeWidth={3} strokeLinecap="round">
        {[164, 170, 176].map((x) => <line key={x} x1={x} y1={210} x2={x} y2={92} strokeDasharray={acik ? "6 6" : undefined} opacity={acik ? 1 : 0.45} className={acik ? "ad-akis" : undefined} />)}
      </g>
      {acik && (
        <g className="ad-belir" fill="none" stroke="#9db7d6" strokeWidth={1.8} strokeLinecap="round">
          {buhar.map(([x, y], k) => <path key={k} d={`M${x} ${y} q-5 -7 0 -14 t0 -14`} />)}
        </g>
      )}
      {acik && <path d="M198 196 L198 112 l-5 7 m5 -7 l5 7" stroke={SU_K} strokeWidth={2} fill="none" className="ad-belir" />}
      <g fontSize={11} fontWeight={700}>
        <text x={330} y={20} fill={acik ? "#5d86b5" : "var(--muted)"} textAnchor="end">{acik ? "terleme: su buharı çıkıyor" : "stomalar kapalı"}</text>
        <text x={206} y={164} fill="var(--ink)">ksilem</text>
        <text x={206} y={178} fill="var(--muted)">{acik ? "su sütunu yukarı" : "akış çok yavaş"}</text>
        <text x={206} y={192} fill="var(--muted)">{acik ? "çekiliyor" : ""}</text>
        <text x={20} y={234} fill="var(--muted)">kök: su ve mineral</text>
      </g>
    </svg>
  );
}

/* ---------- stoma ---------- */

function BekciHucre({ x, acik, sol }: { x: number; acik: number; sol: boolean }) {
  const d = sol ? -1 : 1, ic = 6 + 16 * acik, dis = 30 + 4 * acik;
  // Böbrek biçimi: iç kenar ortada açılır.
  const p = `M${x} 50 C${x + d * dis} 54 ${x + d * dis} 186 ${x} 190 C${x + d * (ic - 2)} 170 ${x + d * ic} 130 ${x + d * ic} 120 C${x + d * ic} 110 ${x + d * (ic - 2)} 70 ${x} 50 Z`;
  return <path d={p} fill="#cfe9d6" stroke={YESIL} strokeWidth={1.6} />;
}

function Stoma({ v }: SahneProps) {
  const isik = v.isik === 1, su = v.su === 1, acik = isik && su ? 1 : 0;
  const neden = !isik && !su ? "karanlık ve susuzluk" : !isik ? "karanlık" : !su ? "susuzluk: absisik asit" : "";
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={acik ? "Stoma açık: K⁺ ve su bekçi hücrelerine girdi" : `Stoma kapalı (${neden})`}>
      <g key={acik} className="ad-belir">
        <BekciHucre x={170} acik={acik} sol />
        <BekciHucre x={170} acik={acik} sol={false} />
        {acik ? (
          <g>
            <path d="M170 56 C188 80 188 160 170 184 C152 160 152 80 170 56 Z" fill="#2f3b4a" opacity={0.75} />
            <g fontSize={11} fontWeight={800} fill="var(--c5)" textAnchor="middle">
              {[[128, 96], [124, 146], [212, 96], [216, 146]].map(([x, y], k) => <text key={k} x={x} y={y}>K⁺</text>)}
            </g>
          </g>
        ) : (
          <line x1={170} y1={56} x2={170} y2={184} stroke="#2f3b4a" strokeWidth={2} />
        )}
      </g>
      <g fontSize={11} fontWeight={700}>
        <text x={20} y={30} fill={acik ? YESIL : "var(--c2)"}>{acik ? "stoma açık: CO₂ girer, su buharı çıkar" : `stoma kapalı (${neden})`}</text>
        <line x1={110} y1={160} x2={60} y2={200} stroke="var(--muted)" />
        <text x={20} y={214} fill="var(--muted)">bekçi hücresi</text>
        {acik ? (
          <>
            <line x1={178} y1={150} x2={250} y2={206} stroke="var(--muted)" />
            <text x={236} y={220} fill="var(--muted)">açıklık</text>
            <text x={20} y={242} fill="var(--c5)">K⁺ girdi, su osmozla izledi: hücreler şişti</text>
          </>
        ) : (
          <text x={20} y={242} fill="var(--muted)">K⁺ ve su çıktı: hücreler gevşedi</text>
        )}
      </g>
    </svg>
  );
}

/* ---------- floem: kaynak ve havuz ---------- */

function Floem({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure), bitti = !oynuyor && t >= sure, basladi = oynuyor || t > 0;
  const bahar = s.mevsim === "ilkbahar";
  const GX = 150, UST = 52, ALT = 196;
  // Şeker noktaları: yazın yapraktan aşağı (kök ve meyve), ilkbaharda kökten yukarı (tomurcuk).
  const noktalar = Array.from({ length: 6 }, (_, k) => {
    const f = (u * 2.2 + k / 6) % 1;
    return bahar ? ara(ALT, UST + 6, f) : ara(UST + 30, ALT, f);
  });
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={bahar ? "İlkbahar: şeker kökteki depodan tomurcuklara taşınıyor" : "Yaz: şeker yapraklardan meyveye ve köke taşınıyor"}>
      <line x1={20} y1={ALT} x2={320} y2={ALT} stroke="#a4825f" strokeWidth={1.6} />
      <line x1={GX} y1={ALT + 20} x2={GX} y2={UST} stroke="#7a9a5f" strokeWidth={8} strokeLinecap="round" />
      <line x1={GX} y1={ALT + 20} x2={GX} y2={UST} stroke="var(--c4)" strokeWidth={2} strokeDasharray="3 4" />
      {bahar ? (
        <g fill="#9ccf86">
          {[[GX - 12, UST + 4], [GX + 12, UST + 14], [GX - 12, UST + 40]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx={7} ry={4} />)}
        </g>
      ) : (
        <g fill={YESIL} fillOpacity={0.7}>
          <ellipse cx={GX - 40} cy={UST + 24} rx={36} ry={13} transform={`rotate(-20 ${GX - 40} ${UST + 24})`} />
          <ellipse cx={GX + 40} cy={UST + 46} rx={36} ry={13} transform={`rotate(20 ${GX + 40} ${UST + 46})`} />
          <line x1={GX} y1={UST + 96} x2={GX + 46} y2={UST + 110} stroke="#7a9a5f" strokeWidth={4} />
          <circle cx={GX + 56} cy={UST + 118} r={14} fill="var(--c2)" fillOpacity={0.85} />
        </g>
      )}
      <path d={`M${GX - 16} ${ALT + 4} Q${GX} ${ALT + 60} ${GX + 16} ${ALT + 4} Z`} fill="#e59a4b" />
      {basladi && !bitti && <g fill="var(--c4)">{noktalar.map((y, k) => <circle key={k} cx={GX + (k % 2 ? 3 : -3)} cy={y} r={3.4} stroke="#fff" strokeWidth={1} />)}</g>}
      {bitti && (
        <g className="ad-belir">
          {bahar ? <Ok x1={GX + 30} y1={ALT} x2={GX + 30} y2={UST + 30} renk="var(--c4)" /> : <Ok x1={GX - 26} y1={UST + 70} x2={GX - 26} y2={ALT - 12} renk="var(--c4)" />}
          {!bahar && <Ok x1={GX + 8} y1={UST + 88} x2={GX + 36} y2={UST + 98} renk="var(--c4)" />}
        </g>
      )}
      <g fontSize={11} fontWeight={700}>
        <text x={20} y={22} fill="var(--ink)" fontSize={12.5} fontWeight={800}>{bahar ? "İlkbahar: henüz yaprak yok" : "Yaz: yapraklar fotosentez yapıyor"}</text>
        {bitti && (bahar ? (
          <g className="ad-belir">
            <text x={GX + 40} y={UST + 10} fill="var(--c4)">havuz: tomurcuklar</text>
            <text x={GX + 40} y={ALT + 24} fill="var(--c4)">kaynak: kökteki depo</text>
          </g>
        ) : (
          <g className="ad-belir">
            <text x={196} y={UST + 14} fill="var(--c4)">kaynak: olgun yaprak</text>
            <text x={GX + 76} y={UST + 122} fill="var(--c4)">havuz: meyve</text>
            <text x={GX + 26} y={ALT + 24} fill="var(--c4)">havuz: kök</text>
          </g>
        ))}
        <text x={20} y={244} fill="var(--muted)">turuncu kesikli çizgi: floem · noktalar: şeker</text>
      </g>
    </svg>
  );
}

/* ---------- yıllık halkalar ---------- */

function Halka({ v }: SahneProps) {
  const n = sinir(v.yil ?? 1, 1, 8), CX = 116, CY = 126, R = 9;
  const ksilem = 8 + n * R;
  return (
    <svg viewBox="0 0 340 252" role="img" aria-label={`${n} yıllık gövde kesiti: ${n} yıllık halka`}>
      <g key={n}>
        <circle cx={CX} cy={CY} r={ksilem + 18} fill="#b98a5e" />
        <circle cx={CX} cy={CY} r={ksilem + 10} fill="#f0c48a" />
        <circle cx={CX} cy={CY} r={ksilem + 4} fill="none" stroke={YESIL} strokeWidth={2.4} strokeDasharray="4 3" />
        {Array.from({ length: n }, (_, k) => n - 1 - k).map((i) => (
          <g key={i}>
            <circle cx={CX} cy={CY} r={8 + (i + 1) * R} fill="#f3dfbf" />
            <circle cx={CX} cy={CY} r={8 + (i + 1) * R} fill="none" stroke="#b58d5c" strokeWidth={2.4} />
          </g>
        ))}
        <circle cx={CX} cy={CY} r={8} fill="#e5cfa9" stroke="#b58d5c" strokeWidth={1.4} />
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <line x1={CX + (ksilem + 15) * 0.7} y1={CY - (ksilem + 15) * 0.7} x2={232} y2={40} stroke="var(--muted)" />
        <text x={236} y={44} fill="#8b6340">kabuk</text>
        <line x1={CX + (ksilem + 7) * 0.87} y1={CY - (ksilem + 7) * 0.5} x2={232} y2={72} stroke="var(--muted)" />
        <text x={236} y={76} fill="#c27a1d">floem</text>
        <line x1={CX + ksilem + 4} y1={CY} x2={232} y2={104} stroke="var(--muted)" />
        <text x={236} y={108} fill={YESIL}>kambiyum</text>
        <line x1={CX + (ksilem - 4) * 0.8} y1={CY + (ksilem - 4) * 0.6} x2={232} y2={146} stroke="var(--muted)" />
        <text x={236} y={150} fill="#8b6340">ksilem (odun)</text>
        <text x={236} y={166} fill="var(--muted)" fontWeight={600}>her bant 1 yıl</text>
      </g>
      <text x={20} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">yıllık halka: {n}</text>
      <text x={170} y={246} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">kambiyum içe ksilem, dışa floem yapar</text>
    </svg>
  );
}

/* ---------- tepe baskınlığı ---------- */

function Tepe({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure), basladi = oynuyor || t > 0;
  const kes = yumusak(u / 0.2), dal = yumusak((u - 0.3) / 0.6);
  const GX = 150, UST = 46, ALT = 214;
  const yanlar: [number, number][] = [[108, -1], [148, 1], [184, -1]];
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={u >= 1 ? "Tepe budandı: yan tomurcuklar dallara dönüştü" : "Tepe tomurcuğu oksin üretiyor, yan tomurcuklar baskılanıyor"}>
      <line x1={20} y1={ALT} x2={320} y2={ALT} stroke="#a4825f" strokeWidth={1.6} />
      <line x1={GX} y1={ALT} x2={GX} y2={UST + 14 + 10 * kes} stroke="#7a9a5f" strokeWidth={6} strokeLinecap="round" />
      {kes < 1 && (
        <g opacity={1 - kes}>
          <path d={`M${GX} ${UST} Q${GX - 9} ${UST + 12} ${GX} ${UST + 20} Q${GX + 9} ${UST + 12} ${GX} ${UST} Z`} fill={YESIL} />
          {!basladi && <g fill="var(--c5)">{[0, 1, 2, 3].map((k) => <circle key={k} cx={GX + 8} cy={UST + 34 + k * 30} r={3} />)}</g>}
        </g>
      )}
      {kes > 0 && kes < 1 && <line x1={GX - 24} y1={UST + 22} x2={GX + 24} y2={UST + 22} stroke="var(--c2)" strokeWidth={2} strokeDasharray="4 3" />}
      {yanlar.map(([y, d], k) => {
        const L = 8 + 56 * dal;
        return (
          <g key={k}>
            <line x1={GX} y1={y} x2={GX + d * L} y2={y - L * 0.55} stroke="#7a9a5f" strokeWidth={3.4} strokeLinecap="round" />
            <ellipse cx={GX + d * (L + 2)} cy={y - L * 0.55 - 2} rx={5 + 5 * dal} ry={3 + 3 * dal} fill={YESIL} fillOpacity={0.8} />
          </g>
        );
      })}
      {dal > 0 && <g fill="var(--c4)">{[0, 1, 2].map((k) => <circle key={k} cx={GX - 8} cy={ALT - 14 - ((u * 120 + k * 30) % 90)} r={2.8} />)}</g>}
      <g fontSize={11} fontWeight={700}>
        <text x={20} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">{u >= 0.2 ? (dal > 0.5 ? "Yan tomurcuklar dal oldu" : "Tepe budandı") : "Tepe tomurcuğu var"}</text>
        {!basladi && <text x={GX + 16} y={UST + 70} fill="var(--c5)">oksin aşağı iniyor:</text>}
        {!basladi && <text x={GX + 16} y={UST + 84} fill="var(--c5)">yan tomurcuklar baskılı</text>}
        {dal > 0.3 && <text x={GX + 16} y={ALT - 20} fill="#b47f0c">sitokinin (kökten)</text>}
      </g>
    </svg>
  );
}

/* ---------- fototropizma ---------- */

function Foto({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure), basladi = oynuyor || t > 0;
  const top = yumusak(u / 0.4), egil = yumusak((u - 0.35) / 0.6);
  const GX = 140, ALT = 208, H = 120;
  // Gövde: gölge yüzü (sol) uzadıkça uç ışığa (sağa) eğilir.
  const ux = GX + 58 * egil, uy = ALT - H + 18 * egil;
  const gov = `M${GX} ${ALT} Q${GX} ${ALT - H * 0.6} ${ux} ${uy}`;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={u >= 1 ? "Oksin gölge yüzde birikti; gölge yüzü uzadı, fide ışığa eğildi" : "Işık sağdan geliyor; oksin fidenin ucunda"}>
      <g>
        <circle cx={306} cy={60} r={16} fill="var(--c4)" />
        {[0, 1, 2].map((k) => <line key={k} x1={284} y1={56 + k * 14} x2={244} y2={50 + k * 22} stroke="var(--c4)" strokeWidth={2} strokeDasharray="5 5" />)}
      </g>
      <line x1={20} y1={ALT} x2={320} y2={ALT} stroke="#a4825f" strokeWidth={1.6} />
      <path d={gov} fill="none" stroke="#7a9a5f" strokeWidth={14} strokeLinecap="round" />
      <path d={gov} fill="none" stroke="#9cbf82" strokeWidth={6} strokeLinecap="round" />
      <g fill="var(--c5)">
        {[0, 1, 2, 3, 4].map((k) => {
          // Noktalar gövde eğrisi üzerinde durur; oksin gölge (sol) yüze geçtikçe sola kayar.
          const p = 1 - ara(0.06 + k * 0.03, 0.14 + k * 0.14, top), q = 1 - p;
          const P1x = GX, P1y = ALT - H * 0.6;
          const bx = q * q * GX + 2 * q * p * P1x + p * p * ux, by = q * q * ALT + 2 * q * p * P1y + p * p * uy;
          const tx = 2 * q * (P1x - GX) + 2 * p * (ux - P1x), ty = 2 * q * (P1y - ALT) + 2 * p * (uy - P1y);
          const L = Math.hypot(tx, ty) || 1, kay = ara(k % 2 ? -3 : 3, 5, top);
          const x = bx + (ty / L) * kay, y = by - (tx / L) * kay;
          return <circle key={k} cx={x} cy={y} r={2.8} stroke="#fff" strokeWidth={0.8} />;
        })}
      </g>
      <g fontSize={11} fontWeight={700}>
        <text x={20} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">{u >= 1 ? "Fide ışığa eğildi" : basladi ? "Oksin gölge yüze geçiyor" : "Işık sağdan geliyor"}</text>
        <text x={20} y={40} fill="var(--c5)">mor noktalar: oksin</text>
        {u >= 1 && <g className="ad-belir" fill="var(--c5)"><text x={20} y={140}>gölge yüzü</text><text x={20} y={154}>daha çok uzadı</text></g>}
        <text x={270} y={98} fill="#b47f0c">ışık</text>
      </g>
    </svg>
  );
}

/* ---------- çimlenme koşulları ---------- */

function Cimlenme({ v }: SahneProps) {
  const su = v.su === 1, o2 = v.o2 === 1, sicak = v.sicak === 1, isik = v.isik === 1;
  const ok = su && o2 && sicak;
  const eksik = [!su && "su", !o2 && "oksijen", !sicak && "uygun sıcaklık"].filter(Boolean).join(", ");
  const CX = 170, ZY = 168;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={ok ? "Tohum çimlendi" : `Tohum çimlenmedi; eksik: ${eksik}`}>
      <rect x={60} y={ZY} width={220} height={44} rx={8} fill={su ? "#b08a63" : "#d9c4a8"} />
      {isik && <g><circle cx={300} cy={36} r={14} fill="var(--c4)" /><text x={300} y={66} fontSize={11} fontWeight={700} fill="#b47f0c" textAnchor="middle">ışık</text></g>}
      <g key={String(ok)} className="ad-belir">
        {ok ? (
          <g>
            <path d={`M${CX} ${ZY + 12} Q${CX - 4} ${ZY + 26} ${CX + 2} ${ZY + 40}`} stroke="#e8dcc6" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M${CX} ${ZY + 6} Q${CX + 4} ${ZY - 30} ${CX} ${ZY - 62}`} stroke="#7a9a5f" strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={CX - 14} cy={ZY - 66} rx={14} ry={6} fill={YESIL} transform={`rotate(-20 ${CX - 14} ${ZY - 66})`} />
            <ellipse cx={CX + 14} cy={ZY - 66} rx={14} ry={6} fill={YESIL} transform={`rotate(20 ${CX + 14} ${ZY - 66})`} />
            <ellipse cx={CX} cy={ZY + 10} rx={12} ry={8} fill="#c9a26b" />
          </g>
        ) : (
          <ellipse cx={CX} cy={ZY + 12} rx={12} ry={8} fill="#c9a26b" />
        )}
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <text x={20} y={24} fontSize={13} fontWeight={800} fill={ok ? YESIL : "var(--ink)"}>{ok ? "Tohum çimlendi" : "Tohum bekliyor"}</text>
        {!ok && <text x={20} y={42} fill="var(--c2)">eksik: {eksik}</text>}
        <text x={170} y={232} fill="var(--muted)" textAnchor="middle" fontWeight={600}>{su ? "toprak nemli" : "toprak kuru"} · {sicak ? "20 °C" : "2 °C"} · {o2 ? "havalı" : "havasız"}</text>
      </g>
    </svg>
  );
}

export const BIYOLOJI6: Record<string, SahneKaydi> = {
  "biy6-zincir": { C: Zincir },
  "biy6-piramit": { C: Piramit },
  "biy6-birikim": { C: Birikim },
  "biy6-karbon": { C: Karbon },
  "biy6-azot": { C: Azot },
  "biy6-gol": { C: Gol },
  "biy6-terleme": { C: Terleme },
  "biy6-stoma": { C: Stoma },
  "biy6-floem": { C: Floem },
  "biy6-halka": { C: Halka },
  "biy6-tepe": { C: Tepe },
  "biy6-foto": { C: Foto },
  "biy6-cimlenme": { C: Cimlenme },
};
