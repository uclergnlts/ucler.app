"use client";
// Biyoloji sahneleri (canlıların ortak özellikleri, biyomoleküller): organizasyon basamakları, ATP, metabolizma,
// homeostazi, bitkinin ışığa yönelmesi, virüsün çoğalması, polimer kurma/yıkma, enerji, protein şekli, DNA ve RNA.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const altiKose = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => `${(x + r * Math.cos((i * Math.PI) / 3 + Math.PI / 6)).toFixed(1)},${(y + r * Math.sin((i * Math.PI) / 3 + Math.PI / 6)).toFixed(1)}`).join(" ");

/** Glikoz: altıgen halka. */
function Glikoz({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <polygon points={altiKose(x, y, r)} fill="var(--biyoloji-soft)" stroke="var(--biyoloji)" strokeWidth={2} />;
}

/* ---------- organizasyon basamakları ---------- */

const BASAMAK = [
  { ad: "hücre", ornek: "kas hücresi" },
  { ad: "doku", ornek: "kas dokusu" },
  { ad: "organ", ornek: "kalp" },
  { ad: "sistem", ornek: "dolaşım sistemi" },
  { ad: "organizma", ornek: "insan" },
];
const ETIKET_X = [26, 90, 156, 224, 298], ETIKET_W = [34, 30, 38, 42, 66];
const KALP = "M170 128 C122 96 126 58 150 58 C161 58 168 66 170 74 C172 66 179 58 190 58 C214 58 218 96 170 128 Z";

function Igcik({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <path d={`M${x - w} ${y} Q${x} ${y - w * 0.32} ${x + w} ${y} Q${x} ${y + w * 0.32} ${x - w} ${y} Z`} fill="var(--c2)" fillOpacity={0.18} stroke="var(--c2)" strokeWidth={1.6} />
      <ellipse cx={x} cy={y} rx={w * 0.16} ry={w * 0.09} fill="var(--c2)" fillOpacity={0.7} />
    </g>
  );
}

function Basamak({ v }: SahneProps) {
  const d = Math.max(1, Math.min(5, v.d ?? 1));
  const b = BASAMAK[d - 1];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${d}. basamak: ${b.ad} (${b.ornek})`}>
      <g key={d} className="ad-belir">
        {d === 1 && <Igcik x={170} y={92} w={92} />}
        {d === 2 && [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <Igcik key={`${r}${c}`} x={100 + c * 72 + (r % 2) * 36} y={44 + r * 32} w={32} />))}
        {d === 3 && <path d={KALP} fill="var(--c2)" />}
        {d === 4 && (
          <g>
            <path d="M178 84 C260 20 300 150 180 112" fill="none" stroke="var(--c2)" strokeWidth={4} strokeLinecap="round" />
            <path d="M162 84 C80 20 40 150 160 112" fill="none" stroke="var(--c1)" strokeWidth={4} strokeLinecap="round" />
            <path d="M246 56 L274 40 M262 128 L290 140 M94 56 L66 40 M78 128 L50 140" stroke="var(--line-2)" strokeWidth={3} strokeLinecap="round" />
            <path d={KALP} fill="var(--c2)" transform="translate(170 93) scale(.5) translate(-170 -93)" />
          </g>
        )}
        {d === 5 && (
          <g>
            <circle cx={170} cy={32} r={16} fill="var(--line-2)" />
            <path d="M146 56 Q170 50 194 56 L190 122 Q170 128 150 122 Z" fill="var(--line-2)" />
            <path d="M146 60 L126 108 M194 60 L214 108 M158 122 L155 148 M182 122 L185 148" stroke="var(--line-2)" strokeWidth={10} strokeLinecap="round" />
            <path d={KALP} fill="var(--c2)" transform="translate(176 78) scale(.18) translate(-170 -93)" />
          </g>
        )}
        <text x={170} y={174} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{b.ornek}</text>
      </g>
      <g fontSize={11.5}>
        {BASAMAK.map((k, i) => {
          const x = ETIKET_X[i], ben = i === d - 1;
          const a = i > 0 ? (ETIKET_X[i - 1] + ETIKET_W[i - 1] / 2 + x - ETIKET_W[i] / 2) / 2 : 0;
          return (
            <g key={k.ad}>
              {i > 0 && <path d={`M${a - 5} 206 L${a + 5} 206 M${a + 1} 202 L${a + 5} 206 L${a + 1} 210`} fill="none" stroke="var(--line-2)" strokeWidth={1.5} />}
              <text x={x} y={210} textAnchor="middle" fontWeight={ben ? 800 : 600} fill={ben ? "var(--biyoloji)" : "var(--muted)"}>{k.ad}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ---------- ATP ---------- */

function Atp({ t, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = t / sure;
  const w = yumusak((u - 0.2) / 0.45);
  const px = 236 + 64 * w, py = 104 + 26 * w;
  const parlama = Math.max(0, Math.sin(Math.min(1, Math.max(0, (u - 0.25) / 0.6)) * Math.PI));
  const bitti = u > 0.62;
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={bitti ? "ATP, ADP ve fosfata ayrıldı; enerji açığa çıktı" : "ATP: adenin, riboz ve üç fosfat"}>
      <text x={170} y={30} fontSize={16} fontWeight={800} fill="var(--ink)" textAnchor="middle">{bitti ? "ADP + P + enerji" : "ATP (adenozin trifosfat)"}</text>
      <rect x={30} y={88} width={52} height={32} rx={8} fill="var(--c1)" />
      <text x={56} y={109} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">adenin</text>
      <line x1={82} y1={104} x2={98} y2={104} stroke="var(--ink)" strokeWidth={2} />
      <polygon points="98,104 112,90 130,94 132,114 112,120" fill="var(--c4)" />
      <text x={115} y={140} fontSize={11.5} fill="var(--muted)" textAnchor="middle">riboz</text>
      <g>
        <line x1={132} y1={104} x2={150} y2={104} stroke="var(--ink)" strokeWidth={2} />
        <line x1={178} y1={104} x2={194} y2={104} stroke="var(--ink)" strokeWidth={2} />
        {w < 0.05 && <line x1={222} y1={104} x2={222 + 14} y2={104} stroke="var(--ink)" strokeWidth={2} />}
        {[164, 208].map((x) => (
          <g key={x}>
            <circle cx={x} cy={104} r={14} fill="var(--c5)" />
            <text x={x} y={109} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">P</text>
          </g>
        ))}
        <circle cx={px + 14} cy={py} r={14} fill="var(--c5)" />
        <text x={px + 14} y={py + 5} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle">P</text>
      </g>
      <g opacity={parlama} transform={`translate(232 96) scale(${0.6 + parlama * 0.6})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={Math.cos(a) * 10} y1={Math.sin(a) * 10} x2={Math.cos(a) * 26} y2={Math.sin(a) * 26} stroke="var(--c4)" strokeWidth={3} strokeLinecap="round" />;
        })}
      </g>
      {bitti && (
        <g className="ad-belir" fontSize={12} fontWeight={700}>
          <text x={120} y={176} fill="var(--c5)" textAnchor="middle">ADP (iki fosfat)</text>
          <text x={300} y={176} fill="var(--c5)" textAnchor="middle">fosfat</text>
          <text x={170} y={200} fill="var(--c4)" textAnchor="middle">açığa çıkan enerji iş yapar: kas kasılması, aktif taşıma</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- metabolizma: yapım ve yıkım ---------- */

const DAGINIK = [[52, 60], [128, 150], [210, 52], [290, 140], [96, 112], [252, 96]];
function Metabolizma({ v }: SahneProps) {
  const yap = (v.yon ?? 0) === 1;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={yap ? "Glikozlar birleşip nişasta oldu" : "Glikozlar ayrı ayrı"}>
      <g>
        {yap && [0, 1, 2, 3, 4].map((i) => <line key={i} x1={45 + i * 50 + 14} y1={100} x2={45 + (i + 1) * 50 - 14} y2={100} stroke="var(--biyoloji)" strokeWidth={2.5} className="ad-belir" />)}
        {DAGINIK.map(([x, y], i) => (
          <g key={i} style={{ transform: `translate(${yap ? 45 + i * 50 : x}px, ${yap ? 100 : y}px)`, transition: "transform .6s ease-in-out" }}>
            <Glikoz x={0} y={0} />
          </g>
        ))}
      </g>
      <text x={170} y={24} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">{yap ? "Nişasta (büyük molekül)" : "Ayrı ayrı glikozlar (küçük moleküller)"}</text>
      <g key={yap ? "a" : "k"} className="ad-belir">
        <text x={170} y={186} fontSize={14} fontWeight={800} fill={yap ? "var(--biyoloji)" : "var(--c2)"} textAnchor="middle">
          {yap ? "Anabolizma (yapım)" : "Katabolizma (yıkım)"}
        </text>
        <text x={170} y={206} fontSize={12} fill="var(--muted)" textAnchor="middle">
          {yap ? "Küçükten büyük molekül kurulur; ATP harcanır." : "Büyük moleküller böyle küçük parçalara ayrılır."}
        </text>
      </g>
    </svg>
  );
}

/* ---------- homeostazi ---------- */

const TER = [[150, 26], [212, 24], [116, 78], [246, 82], [108, 116], [252, 120], [122, 156], [240, 158]];
function Homeostazi({ v }: SahneProps) {
  const dis = v.dis ?? 20;
  const sicak = dis >= 30, soguk = dis <= 10;
  const dolu = (dis + 10) / 55;
  const ter = sicak ? Math.round(2 + (dis - 30) / 3) : 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Dış sıcaklık ${dis} derece, vücut içi 37 derece`}>
      <g>
        <rect x={34} y={30} width={14} height={140} rx={7} fill="none" stroke="var(--line-2)" strokeWidth={2} />
        <rect x={38} y={34 + 132 * (1 - dolu)} width={6} height={132 * dolu} rx={3} fill={sicak ? "var(--c2)" : soguk ? "var(--c1)" : "var(--c4)"} />
        <circle cx={41} cy={178} r={11} fill={sicak ? "var(--c2)" : soguk ? "var(--c1)" : "var(--c4)"} />
        <text x={41} y={206} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">dış: {dis} °C</text>
      </g>
      <g className={soguk ? "ad-kay" : undefined} style={soguk ? { animationDuration: ".18s" } : undefined}>
        <circle cx={180} cy={44} r={20} fill="var(--line-2)" />
        <path d="M150 70 Q180 62 210 70 L206 156 Q180 164 154 156 Z" fill="var(--line-2)" />
        <path d="M150 74 L130 140 M210 74 L230 140 M166 156 L163 192 M194 156 L197 192" stroke="var(--line-2)" strokeWidth={12} strokeLinecap="round" />
        <text x={180} y={112} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">37 °C</text>
        <text x={180} y={128} fontSize={11} fill="var(--muted)" textAnchor="middle">iç sıcaklık</text>
      </g>
      {Array.from({ length: ter }, (_, i) => {
        const [x, y] = TER[i % TER.length];
        return <path key={i} className="ad-belir" d={`M${x} ${y} q-4 7 0 10 q4 -3 0 -10 Z`} fill="var(--c1)" />;
      })}
      {soguk && (
        <g stroke="var(--c1)" strokeWidth={2} fill="none" className="ad-belir">
          <path d="M118 70 l-6 6 l6 6 l-6 6" /><path d="M242 70 l6 6 l-6 6 l6 6" />
          <path d="M112 120 l-6 6 l6 6 l-6 6" /><path d="M248 120 l6 6 l-6 6 l6 6" />
        </g>
      )}
      <text x={170} y={228} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={sicak ? "var(--c2)" : soguk ? "var(--c1)" : "var(--muted)"}>
        {sicak ? "Terliyorsun: ter buharlaşırken ısı alır" : soguk ? "Titriyorsun: kaslar ısı üretir" : "Ek bir tepki gerekmiyor"}
      </text>
    </svg>
  );
}

/* ---------- uyarıya tepki: bitki ışığa yönelir ---------- */

function BitkiIsik({ v, t, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const yan = (v.isik ?? 0) === 1;
  const k = yumusak(t / sure);
  const aci = yan ? (40 * k * Math.PI) / 180 : 0;
  const boy = 96 + 14 * k;
  const bx = 170, by = 176;
  const ux = bx + Math.sin(aci) * boy, uy = by - Math.cos(aci) * boy;
  const cx = bx, cy = by - boy * 0.55;
  const lx = yan ? 306 : 170, ly = yan ? 72 : 22;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={yan ? "Işık sağdan geliyor" : "Işık yukarıdan geliyor"}>
      <g>
        <circle cx={lx} cy={ly} r={13} fill="var(--c4)" />
        {Array.from({ length: 5 }, (_, i) => {
          const a = Math.atan2(by - 60 - ly, bx - lx) + (i - 2) * 0.16;
          return <line key={i} x1={lx + Math.cos(a) * 20} y1={ly + Math.sin(a) * 20} x2={lx + Math.cos(a) * 52} y2={ly + Math.sin(a) * 52} stroke="var(--c4)" strokeWidth={2} strokeLinecap="round" opacity={0.7} />;
        })}
      </g>
      <path d={`M${bx} ${by} Q${cx} ${cy} ${ux} ${uy}`} fill="none" stroke="var(--biyoloji)" strokeWidth={5} strokeLinecap="round" />
      <g transform={`translate(${ux} ${uy}) rotate(${(aci * 180) / Math.PI})`}>
        <ellipse cx={-14} cy={2} rx={14} ry={6} fill="var(--biyoloji)" transform="rotate(-25 -14 2)" />
        <ellipse cx={14} cy={2} rx={14} ry={6} fill="var(--biyoloji)" transform="rotate(25 14 2)" />
      </g>
      <path d="M146 176 L194 176 L188 206 L152 206 Z" fill="var(--c2)" fillOpacity={0.7} />
      {yan && k > 0.95 && <text x={20} y={40} fontSize={12.5} fontWeight={800} fill="var(--biyoloji)" className="ad-belir">Işığa doğru eğildi</text>}
    </svg>
  );
}

/* ---------- virüs: yalnızca hücre içinde çoğalır ---------- */

function Virus({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return <line key={i} x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * (r + 4)} y2={Math.sin(a) * (r + 4)} stroke="var(--c5)" strokeWidth={1.6} />;
      })}
      <polygon points={altiKose(0, 0, r)} fill="var(--c5)" />
    </g>
  );
}

function VirusCogalma({ t, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = t / sure;
  const CX = 252, CY = 118, R = 64;
  const yaklas = yumusak(u / 0.2);
  const vy = 30 + (CY - R - 10 - 30) * yaklas;
  const dna = Math.max(0, Math.min(1, (u - 0.2) / 0.15));
  const kopya = u < 0.38 ? 0 : Math.min(8, Math.floor(((u - 0.38) / 0.4) * 8) + 1);
  const cik = yumusak((u - 0.82) / 0.18);
  const bitti = u > 0.97;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Virüs hücre dışında çoğalamaz, hücre içinde çoğalır">
      <text x={70} y={24} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">hücre dışında</text>
      <text x={CX} y={24} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">canlı hücrede</text>
      <line x1={140} y1={36} x2={140} y2={190} stroke="var(--line)" strokeWidth={1.5} strokeDasharray="4 5" />
      <Virus x={70} y={112} r={9} />
      <circle cx={CX} cy={CY} r={R} fill="var(--biyoloji-soft)" stroke="var(--biyoloji)" strokeWidth={2.5} />
      <ellipse cx={CX + 22} cy={CY + 24} rx={16} ry={12} fill="var(--biyoloji)" fillOpacity={0.25} />
      {dna > 0 && <path d={`M${CX} ${CY - R} q6 ${8 * dna} 0 ${16 * dna} q-6 ${8 * dna} 0 ${16 * dna}`} fill="none" stroke="var(--c5)" strokeWidth={2} />}
      {cik < 1 && <Virus x={CX} y={vy} />}
      {Array.from({ length: kopya }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3, ri = 30;
        const x = CX + Math.cos(a) * (ri + cik * 44), y = CY + Math.sin(a) * (ri + cik * 44);
        return <Virus key={i} x={x} y={y} r={6} />;
      })}
      {bitti && (
        <g className="ad-belir" fontSize={12} fontWeight={800} textAnchor="middle">
          <text x={70} y={150} fill="var(--muted)">çoğalmadı</text>
          <text x={CX} y={212} fill="var(--c5)">hücrenin içinde çoğaldı</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- polimer: dehidrasyon ve hidroliz ---------- */

function Polimer({ v }: SahneProps) {
  const n = Math.max(1, Math.min(8, v.n ?? 1));
  const kir = (v.su ?? 0) === 1;
  const ara = kir ? 40 : 38;
  const xs = Array.from({ length: n }, (_, i) => 170 + (i - (n - 1) / 2) * ara);
  return (
    <svg viewBox="0 0 340 204" role="img" aria-label={kir ? `${n} glikoz, ${n - 1} su eklenerek ayrıldı` : `${n} glikozluk zincir, ${n - 1} su çıktı`}>
      <g>
        {!kir && xs.slice(1).map((x, i) => <line key={i} x1={xs[i] + 13} y1={78} x2={x - 13} y2={78} stroke="var(--biyoloji)" strokeWidth={3} />)}
        {xs.map((x, i) => <g key={i} style={{ transform: `translate(${x}px, ${kir ? 70 + (i % 2) * 20 : 78}px)`, transition: "transform .5s ease-in-out" }}><Glikoz x={0} y={0} /></g>)}
      </g>
      <g key={`${n}${kir}`} className="ad-belir">
        {xs.slice(1).map((x, i) => {
          const m = (xs[i] + x) / 2;
          return kir ? (
            <g key={i}>
              <text x={m} y={36} fontSize={11} fontWeight={700} fill="var(--c1)" textAnchor="middle">H₂O</text>
              <path d={`M${m} 42 L${m} 60 M${m - 4} 55 L${m} 60 L${m + 4} 55`} fill="none" stroke="var(--c1)" strokeWidth={1.6} />
            </g>
          ) : (
            <g key={i}>
              <path d={`M${m} 88 L${m} 112 M${m - 4} 107 L${m} 112 L${m + 4} 107`} fill="none" stroke="var(--c1)" strokeWidth={1.6} />
              <text x={m} y={128} fontSize={11} fontWeight={700} fill="var(--c1)" textAnchor="middle">H₂O</text>
            </g>
          );
        })}
      </g>
      <text x={170} y={168} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {kir ? `Hidroliz: ${n - 1} su eklendi, ${n} glikoz serbest` : `${n} glikoz → ${n - 1} bağ, ${n - 1} su çıktı`}
      </text>
      <text x={170} y={190} fontSize={12} fill="var(--muted)" textAnchor="middle">
        {kir ? "Su girince bağlar kırılır: sindirim böyledir." : "Her bağ kurulurken bir su molekülü ayrılır."}
      </text>
    </svg>
  );
}

/* ---------- enerji: yağ ve karbonhidrat ---------- */

function Enerji({ v }: SahneProps) {
  const g = v.g ?? 0;
  const kcal = g * 9;
  const S = 2.2, X0 = 24; // 1 kcal = 2.2 px
  const ok = kcal >= 95 && kcal <= 104;
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={`${g} gram yağ, ${kcal} kilokalori`}>
      <line x1={X0 + 100 * S} y1={22} x2={X0 + 100 * S} y2={150} stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={X0 + 100 * S} y={16} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">hedef: 100 kcal</text>
      <g>
        <text x={X0} y={46} fontSize={12} fontWeight={700} fill="var(--muted)">yağ: {g} g × 9 kcal</text>
        <rect x={X0} y={54} width={Math.max(2, Math.min(kcal, 130) * S)} height={26} rx={6} fill={ok ? "var(--good)" : "var(--c4)"} style={{ transition: "width .2s" }} />
        {kcal <= 105 ? (
          <text x={X0 + kcal * S + 6} y={72} fontSize={13} fontWeight={800} fill="var(--ink)">{kcal} kcal</text>
        ) : (
          <text x={X0 + Math.min(kcal, 130) * S - 8} y={72} fontSize={13} fontWeight={800} fill="#fff" textAnchor="end">{kcal} kcal</text>
        )}
      </g>
      <g>
        <text x={X0} y={110} fontSize={12} fontWeight={700} fill="var(--muted)">karbonhidrat: 25 g × 4 kcal</text>
        <rect x={X0} y={118} width={100 * S} height={26} rx={6} fill="var(--c1)" fillOpacity={0.35} />
        <text x={X0 + 100 * S + 6} y={136} fontSize={13} fontWeight={800} fill="var(--ink)">100 kcal</text>
      </g>
      <text x={170} y={186} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">1 g yağ ≈ 9 kcal · 1 g karbonhidrat ≈ 4 kcal</text>
    </svg>
  );
}

/* ---------- protein: dizi → şekil → görev ---------- */

const DIZI = ["Val", "His", "Leu", "Thr", "Pro", "Glu", "Glu", "Lys"];
function Protein({ v }: SahneProps) {
  const deg = (v.deg ?? 0) === 1;
  const dizi = DIZI.map((a, i) => (i === 5 && deg ? "Val" : a));
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={deg ? "Altıncı amino asit valin oldu; alyuvar orak biçimli" : "Normal dizi; alyuvar yuvarlak"}>
      <text x={14} y={22} fontSize={11.5} fontWeight={700} fill="var(--muted)">hemoglobin zincirinin ilk 8 amino asidi</text>
      <g>
        {dizi.slice(1).map((_, i) => <line key={i} x1={30 + i * 40} y1={50} x2={30 + (i + 1) * 40} y2={50} stroke="var(--line-2)" strokeWidth={2} />)}
        {dizi.map((a, i) => {
          const ozel = i === 5;
          return (
            <g key={i}>
              <circle cx={30 + i * 40} cy={50} r={16} fill={ozel ? (deg ? "var(--c2)" : "var(--biyoloji)") : "var(--line-2)"} />
              <text x={30 + i * 40} y={54} fontSize={11} fontWeight={700} fill={ozel ? "#fff" : "var(--ink)"} textAnchor="middle">{a}</text>
            </g>
          );
        })}
        <text x={230} y={84} fontSize={11} fontWeight={700} fill={deg ? "var(--c2)" : "var(--biyoloji)"} textAnchor="middle">6. sıra</text>
      </g>
      <g key={deg ? "o" : "n"} className="ad-belir">
        {deg ? (
          <path d="M120 110 Q170 92 220 110 Q248 124 238 150 Q206 126 170 126 Q134 126 102 150 Q92 124 120 110 Z" fill="var(--c2)" />
        ) : (
          <g>
            <ellipse cx={170} cy={132} rx={56} ry={28} fill="var(--c2)" />
            <ellipse cx={170} cy={132} rx={26} ry={11} fill="#fff" fillOpacity={0.3} />
          </g>
        )}
        <text x={170} y={190} fontSize={13.5} fontWeight={800} fill={deg ? "var(--c2)" : "var(--ink)"} textAnchor="middle">
          {deg ? "Orak biçimli alyuvar: O₂ taşıması aksar" : "Yuvarlak alyuvar: O₂'yi rahat taşır"}
        </text>
        <text x={170} y={210} fontSize={12} fill="var(--muted)" textAnchor="middle">
          {deg ? "Tek değişiklik: glutamik asit (Glu) yerine valin (Val)" : "Hemoglobin düzgün katlanıyor"}
        </text>
      </g>
    </svg>
  );
}

/* ---------- nükleik asit: DNA ve RNA ---------- */

const ESI: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
const BAZ_RENK: Record<string, string> = { A: "var(--c1)", T: "var(--c4)", U: "var(--c2)", G: "var(--biyoloji)", C: "var(--c5)" };
const DNA_DIZI = ["A", "T", "G", "C", "A", "G", "T", "C"];

function Baz({ x, y, b, yon }: { x: number; y: number; b: string; yon: 1 | -1 }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + yon * 26} stroke={BAZ_RENK[b]} strokeWidth={10} strokeLinecap="round" />
      <text x={x} y={y + yon * 44 + 4} fontSize={13} fontWeight={800} fill={BAZ_RENK[b]} textAnchor="middle">{b}</text>
    </g>
  );
}

function Nukleik({ v }: SahneProps) {
  const rna = (v.tur ?? 0) === 1;
  const xs = DNA_DIZI.map((_, i) => 46 + i * 35);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={rna ? "RNA: tek zincir, A U G C" : "DNA: çift zincir, A T G C"}>
      <text x={170} y={20} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{rna ? "RNA: tek zincir, şekeri riboz" : "DNA: çift zincir, şekeri deoksiriboz"}</text>
      <g key={rna ? "r" : "d"} className="ad-belir">
        <line x1={30} y1={50} x2={310} y2={50} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
        {xs.map((x, i) => <Baz key={i} x={x} y={52} b={rna && DNA_DIZI[i] === "T" ? "U" : DNA_DIZI[i]} yon={1} />)}
        {!rna && (
          <g>
            <line x1={30} y1={166} x2={310} y2={166} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
            {xs.map((x, i) => (
              <g key={i}>
                <line x1={x} y1={164} x2={x} y2={138} stroke={BAZ_RENK[ESI[DNA_DIZI[i]]]} strokeWidth={10} strokeLinecap="round" />
                <text x={x} y={128} fontSize={13} fontWeight={800} fill={BAZ_RENK[ESI[DNA_DIZI[i]]]} textAnchor="middle">{ESI[DNA_DIZI[i]]}</text>
              </g>
            ))}
          </g>
        )}
      </g>
      <text x={170} y={206} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{rna ? "bazlar: A, U, G, C" : "bazlar: A, T, G, C · A ile T, G ile C eşleşir"}</text>
    </svg>
  );
}

export const BIYOLOJI1: Record<string, SahneKaydi> = {
  basamak: { C: Basamak },
  atp: { C: Atp },
  metabolizma: { C: Metabolizma },
  homeostazi: { C: Homeostazi },
  "bitki-isik": { C: BitkiIsik },
  "virus-cogalma": { C: VirusCogalma },
  polimer: { C: Polimer },
  "enerji-yag": { C: Enerji },
  protein: { C: Protein },
  nukleik: { C: Nukleik },
};
