"use client";
// Biyoloji sahneleri (sinir sistemi, endokrin sistem): nöronda impulsun yolu, aksiyon potansiyeli ve eşik,
// miyelinli ve miyelinsiz iletim, sinaps, refleks yayı, sempatik ve parasempatik etki; hormonun hedef
// hücresi, sinirsel ve hormonal hız, insülin ve kan şekeri, açlıkta glukagon, tiroit geri bildirimi ve iyot.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";

/** Kırık çizgi boyunca u (0-1) oranındaki nokta. */
function yolNokta(P: [number, number][], u: number): [number, number] {
  const L = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1]));
  let d = sinir(u) * L.reduce((a, b) => a + b, 0);
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i] || i === L.length - 1) {
      const k = L[i] ? sinir(d / L[i]) : 0;
      return [ara(P[i][0], P[i + 1][0], k), ara(P[i][1], P[i + 1][1], k)];
    }
    d -= L[i];
  }
  return P[P.length - 1];
}
const nokta = (P: [number, number][]) => P.map((p) => p.join(",")).join(" ");

/* ---------- nöron ---------- */

const NORON_YOL: [number, number][] = [[24, 58], [70, 100], [96, 100], [282, 100], [308, 80]];

function Noron({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const [px, py] = yolNokta(NORON_YOL, u);
  const bolum = u < 0.12 ? 0 : u < 0.22 ? 1 : u < 0.9 ? 2 : 3;
  const ad = ["dendrit", "hücre gövdesi", "akson", "akson ucu"];
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={u > 0 ? `İmpuls şu an: ${ad[bolum]}` : "Bir nöron: dendrit, hücre gövdesi, miyelinli akson, akson ucu"}>
      <g stroke={MOR} strokeWidth={2.4} strokeLinecap="round" fill="none">
        <path d="M54 88 L24 58 M40 74 L22 80 M52 112 L24 140 M38 126 L20 120 M66 78 L60 44 M62 58 L48 42" />
      </g>
      <g>
        <circle cx={70} cy={100} r={24} fill={MOR} fillOpacity={0.16} stroke={MOR} strokeWidth={2} />
        <circle cx={68} cy={98} r={8} fill={MOR} fillOpacity={0.55} />
      </g>
      <g>
        <line x1={94} y1={100} x2={284} y2={100} stroke={MOR} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={104 + i * 36} y={92} width={30} height={16} rx={8} fill={SARI} fillOpacity={0.55} stroke={SARI} strokeWidth={1.2} />)}
      </g>
      <g stroke={MOR} strokeWidth={2.4} strokeLinecap="round" fill="none">
        <path d="M284 100 L308 80 M284 100 L312 102 M284 100 L306 122" />
      </g>
      <g fill={MOR}>
        <circle cx={309} cy={79} r={4.5} /><circle cx={314} cy={102} r={4.5} /><circle cx={307} cy={123} r={4.5} />
      </g>
      {u > 0 && (
        <g>
          <circle cx={px} cy={py} r={9} fill={KIRMIZI} fillOpacity={0.25} />
          <circle cx={px} cy={py} r={5} fill={KIRMIZI} />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700}>
        <text x={14} y={34} fill={u > 0 && bolum === 0 ? KIRMIZI : "var(--muted)"}>dendrit</text>
        <text x={44} y={150} fill={u > 0 && bolum === 1 ? KIRMIZI : "var(--muted)"}>hücre gövdesi</text>
        <text x={190} y={82} textAnchor="middle" fill={u > 0 && bolum === 2 ? KIRMIZI : "var(--muted)"}>akson</text>
        <text x={190} y={128} textAnchor="middle" fill="var(--muted)" fontWeight={600}>miyelin kılıf</text>
        <text x={318} y={150} textAnchor="end" fill={u > 0 && bolum === 3 ? KIRMIZI : "var(--muted)"}>akson ucu</text>
      </g>
      <text x={170} y={196} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "Uyarı dendritlere geliyor" : u >= 1 ? "İmpuls akson ucuna ulaştı" : `İmpuls: ${ad[bolum]}`}
      </text>
    </svg>
  );
}

/* ---------- aksiyon potansiyeli ---------- */

const ESIK = 15; // −70'ten −55'e
/** Zar potansiyeli (mV); t ms, u uyarının getirdiği ek gerilim (mV). */
function zar(t: number, u: number) {
  if (t < 0.5) return -70;
  if (u < ESIK) {
    if (t < 0.7) return -70 + u * ((t - 0.5) / 0.2);
    if (t < 1.7) return -70 + u * (1 - (t - 0.7));
    return -70;
  }
  if (t < 0.6) return -70 + ESIK * ((t - 0.5) / 0.1);
  if (t < 1.1) return -55 + 85 * yumusak((t - 0.6) / 0.5);
  if (t < 1.9) return 30 - 110 * yumusak((t - 1.1) / 0.8);
  if (t < 3) return -80 + 10 * yumusak((t - 1.9) / 1.1);
  return -70;
}
const AX0 = 52, AX1 = 318, AY = (mv: number) => 170 - ((mv + 90) / 130) * 140, AT = (t: number) => AX0 + (t / 4) * (AX1 - AX0);
const egri = (u: number, son: number) =>
  Array.from({ length: Math.max(2, Math.round(son * 50) + 1) }, (_, i) => {
    const t = Math.min(son, i / 50);
    return `${AT(t).toFixed(1)},${AY(zar(t, u)).toFixed(1)}`;
  }).join(" ");

function Aksiyon({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = v.u ?? 0;
  const oyn = oynuyor || t > 0;
  const tt = oyn ? Math.min(t, sure) : 0;
  const mv = zar(tt, u);
  const evre = !oyn ? "" : tt < 0.5 ? "dinlenme: −70 mV" : u < ESIK ? (tt < 1.7 ? "eşiğe ulaşmadı" : "impuls oluşmadı") :
    tt < 0.6 ? "uyarı: eşiğe ulaştı" : tt < 1.1 ? "depolarizasyon: Na⁺ giriyor" : tt < 1.9 ? "repolarizasyon: K⁺ çıkıyor" : tt < 3 ? "dinlenmeye dönüyor" : "impuls tamamlandı";
  const eski = kosular.slice(-3).filter((k) => k.u !== u || !oyn);
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`Uyarı +${u} mV; zar potansiyeli ${Math.round(mv)} mV`}>
      <g>
        <line x1={AX0} y1={30} x2={AX0} y2={172} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={AX0} y1={172} x2={AX1} y2={172} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={AX0 + 6} y={26} fontSize={11} fontWeight={700} fill="var(--ink)">zar potansiyeli (mV)</text>
        <text x={AX1} y={188} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">zaman (ms)</text>
      </g>
      <g fontSize={10.5} fill="var(--muted)" textAnchor="end">
        {[30, 0, -55, -70].map((m) => <text key={m} x={AX0 - 6} y={AY(m) + 4}>{m < 0 ? `−${-m}` : m === 0 ? "0" : `+${m}`}</text>)}
      </g>
      <g>
        <line x1={AX0} y1={AY(-55)} x2={AX1} y2={AY(-55)} stroke={KIRMIZI} strokeWidth={1.3} strokeDasharray="5 4" />
        <text x={AX1} y={AY(-55) - 5} fontSize={11} fontWeight={700} fill={KIRMIZI} textAnchor="end">eşik</text>
        <line x1={AX0} y1={AY(0)} x2={AX1} y2={AY(0)} stroke="var(--line)" strokeWidth={1} />
      </g>
      <g>
        {eski.map((k, i) => <polyline key={i} points={egri(k.u ?? 0, 4)} fill="none" stroke={MOR} strokeOpacity={0.25} strokeWidth={2} />)}
        {oyn && <polyline points={egri(u, tt)} fill="none" stroke={MOR} strokeWidth={3} strokeLinejoin="round" />}
        {oyn && <circle cx={AT(tt)} cy={AY(mv)} r={5.5} fill={KIRMIZI} stroke="#fff" strokeWidth={1.6} />}
        {!oyn && <line x1={AX0} y1={AY(-70)} x2={AX1} y2={AY(-70)} stroke={MOR} strokeWidth={2} strokeOpacity={0.5} />}
      </g>
      <text x={170} y={210} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {oyn ? evre : `Uyarı: +${u} mV → zar −${70 - u} mV olur. Oynat.`}
      </text>
    </svg>
  );
}

/* ---------- miyelin ---------- */

const MX0 = 40, MX1 = 304, ZIP = 8; // 8 sıçrama

function Miyelin({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const um = sinir(u / 0.3); // miyelinli akson işini erken bitirir
  const adim = Math.floor(um * ZIP + 1e-6);
  const xm = MX0 + (adim / ZIP) * (MX1 - MX0);
  const xs = MX0 + u * (MX1 - MX0);
  const seg = (MX1 - MX0) / ZIP;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={u >= 1 ? "Miyelinli aksonda impuls çok önce ulaştı" : "Miyelinli ve miyelinsiz iki akson"}>
      <g>
        <text x={MX0} y={40} fontSize={12} fontWeight={800} fill="var(--ink)">miyelinli akson</text>
        <line x1={MX0} y1={70} x2={MX1} y2={70} stroke={MOR} strokeWidth={3} />
        {Array.from({ length: ZIP }, (_, i) => <rect key={i} x={MX0 + i * seg + 4} y={61} width={seg - 8} height={18} rx={9} fill={SARI} fillOpacity={0.55} stroke={SARI} strokeWidth={1.2} />)}
        <text x={MX1} y={40} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="end">boğumdan boğuma sıçrar</text>
      </g>
      <g>
        <text x={MX0} y={128} fontSize={12} fontWeight={800} fill="var(--ink)">miyelinsiz akson</text>
        <line x1={MX0} y1={152} x2={MX1} y2={152} stroke={MOR} strokeWidth={3} />
        <text x={MX1} y={128} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="end">zar boyunca ilerler</text>
      </g>
      {u > 0 && (
        <g>
          <circle cx={xm} cy={70} r={10} fill={KIRMIZI} fillOpacity={0.25} />
          <circle cx={xm} cy={70} r={5.5} fill={KIRMIZI} />
          <circle cx={xs} cy={152} r={10} fill={KIRMIZI} fillOpacity={0.25} />
          <circle cx={xs} cy={152} r={5.5} fill={KIRMIZI} />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700} fill={YESIL}>
        {um >= 1 && <text className="ad-belir" x={MX1} y={98} textAnchor="end">ulaştı</text>}
        {u >= 1 && <text className="ad-belir" x={MX1} y={180} textAnchor="end">ulaştı</text>}
      </g>
      <text x={170} y={210} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">Uzunluklar ve hızlar ölçekli değildir.</text>
    </svg>
  );
}

/* ---------- sinaps ---------- */

const KESE: [number, number][] = [[148, 58], [170, 50], [192, 58], [158, 78], [182, 78]];
const RESEPTOR = [128, 156, 184, 212];

function Sinaps({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const gel = sinir(u / 0.25), kes = yumusak(sinir((u - 0.25) / 0.25)), yay = yumusak(sinir((u - 0.5) / 0.3)), son = sinir((u - 0.8) / 0.2);
  const molekul = KESE.flatMap(([x, y], i) => [0, 1, 2].map((j) => {
    const x0 = ara(x, 140 + i * 15, kes), y0 = ara(y, 100, kes);
    const hedef = RESEPTOR[(i + j) % 4] + (j - 1) * 3;
    return [ara(x0 + (j - 1) * 4, hedef, yay), ara(y0, 132, yay)] as [number, number];
  }));
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={u >= 1 ? "Nörotransmitter reseptörlere bağlandı, sonraki nöron uyarıldı" : "Akson ucu, sinaps boşluğu ve sonraki nöronun reseptörleri"}>
      <g>
        <path d="M150 0 L150 22 Q110 30 110 64 Q110 100 170 102 Q230 100 230 64 Q230 30 190 22 L190 0" fill={MOR} fillOpacity={0.1} stroke={MOR} strokeWidth={2} />
      </g>
      <g>
        {KESE.map(([x, y], i) => (
          <circle key={i} cx={ara(x, 140 + i * 15, kes)} cy={ara(y, 92, kes)} r={9} fill="#fff" stroke={MOR} strokeWidth={1.4} opacity={1 - yay} />
        ))}
      </g>
      <g>
        <path d="M60 140 Q170 124 280 140 L280 200 L60 200 Z" fill={YESIL} fillOpacity={0.08 + 0.14 * son} stroke={YESIL} strokeWidth={2} />
        {RESEPTOR.map((x) => (
          <path key={x} d={`M${x - 8} 128 L${x - 8} 136 L${x + 8} 136 L${x + 8} 128`} fill="none" stroke={yay >= 1 ? KIRMIZI : YESIL} strokeWidth={3} strokeLinejoin="round" />
        ))}
      </g>
      {u > 0 && u < 1 && (
        <g>
          {gel < 1 && <circle cx={170} cy={ara(4, 40, gel)} r={6} fill={KIRMIZI} />}
          {kes > 0 && molekul.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.8} fill={KIRMIZI} />)}
        </g>
      )}
      {u >= 1 && <g>{molekul.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.8} fill={KIRMIZI} />)}</g>}
      {son > 0 && (
        <g className="ad-belir">
          <line x1={170} y1={150} x2={170} y2={176} stroke={KIRMIZI} strokeWidth={3} strokeLinecap="round" />
          <path d="M170 186 L163 174 L177 174 Z" fill={KIRMIZI} />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={240} y={40}>akson ucu</text>
        <text x={240} y={58} fontWeight={600}>kesecikler</text>
        <text x={296} y={118} textAnchor="end">sinaps boşluğu</text>
        <text x={74} y={186}>sonraki nöron</text>
        <text x={226} y={160} fill={YESIL}>reseptör</text>
      </g>
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? "" : u < 0.25 ? "impuls geliyor" : u < 0.5 ? "kesecikler açılıyor" : u < 0.8 ? "nörotransmitter yayılıyor" : "sonraki nöron uyarıldı"}
      </text>
    </svg>
  );
}

/* ---------- refleks yayı ---------- */

/** Sinir yolları elle birlikte hareket eder; e elin yüksekliği. */
const refleksYol = (e: number) => ({
  duyu: [[58, e], [104, e - 4], [244, 130]] as [number, number][],
  ara: [[244, 130], [260, 150]] as [number, number][],
  motor: [[260, 150], [196, e + 12], [140, e + 3]] as [number, number][],
});
const BEYIN: [number, number][] = [[262, 118], [271, 85], [282, 50]];
const REFLEKS_ANAHTAR: [string, string][] = [["duyu nöronu", MAVI], ["ara nöron", SARI], ["motor nöron → kas", KIRMIZI]];

function Refleks({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const d = sinir(u / 0.25), a = sinir((u - 0.25) / 0.08), m = sinir((u - 0.33) / 0.22), b = sinir((u - 0.3) / 0.6);
  const kalk = yumusak(sinir((u - 0.55) / 0.12));
  const e = 174 - kalk * 56;
  const Y = refleksYol(e);
  const sinyal = u <= 0 || u >= 1 ? null : u < 0.25 ? yolNokta(Y.duyu, d) : u < 0.33 ? yolNokta(Y.ara, a) : u < 0.55 ? yolNokta(Y.motor, m) : null;
  const beyinS = u > 0.3 && u < 0.9 ? yolNokta(BEYIN, b) : null;
  const kasIs = u >= 0.55, once = u <= 0;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={u >= 1 ? "El sobadan çekildi; acı sonra hissedildi" : "Sıcak sobaya dokunan el, omurilik ve beyin"}>
      <g>
        <rect x={20} y={194} width={112} height={14} rx={4} fill="var(--ink)" fillOpacity={0.8} />
        <path d="M40 190 Q36 185 40 180 M64 190 Q60 185 64 180 M88 190 Q84 185 88 180 M112 190 Q108 185 112 180" fill="none" stroke={KIRMIZI} strokeWidth={2} strokeLinecap="round" />
        <text x={20} y={228} fontSize={11.5} fontWeight={700} fill={KIRMIZI}>sıcak soba</text>
      </g>
      <g>
        <path d={`M46 ${e + 4} L178 ${e - 10}`} stroke="#d9a77c" strokeWidth={14} strokeLinecap="round" />
        <ellipse cx={64} cy={e} rx={20} ry={9} fill="#e8b98f" />
        <ellipse cx={140} cy={e - 4} rx={18} ry={8} fill={KIRMIZI} fillOpacity={kasIs ? 0.55 : 0.25} />
      </g>
      <g>
        <circle cx={262} cy={140} r={22} fill="#fff" stroke="var(--ink)" strokeWidth={1.6} />
        <path d="M250 130 Q262 138 274 130 L270 150 Q262 144 254 150 Z" fill="var(--line-2)" />
        <text x={262} y={178} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">omurilik</text>
        <ellipse cx={290} cy={32} rx={34} ry={18} fill={MOR} fillOpacity={0.12} stroke={MOR} strokeWidth={1.6} />
        <text x={290} y={36} fontSize={11.5} fontWeight={700} fill={MOR} textAnchor="middle">beyin</text>
      </g>
      <g fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points={nokta(Y.duyu)} stroke={once ? "var(--line-2)" : MAVI} />
        <polyline points={nokta(Y.ara)} stroke={once ? "var(--line-2)" : SARI} />
        <polyline points={nokta(Y.motor)} stroke={once ? "var(--line-2)" : KIRMIZI} />
        <polyline points={nokta(BEYIN)} stroke="var(--muted)" strokeDasharray="4 4" />
      </g>
      {!once && <g fontSize={11} fontWeight={700} fill="var(--ink)">
        {REFLEKS_ANAHTAR.map(([yazi, renk], i) => (
          <g key={yazi}>
            <line x1={196} x2={212} y1={200 + i * 14} y2={200 + i * 14} stroke={renk} strokeWidth={3} strokeLinecap="round" />
            <text x={218} y={204 + i * 14}>{yazi}</text>
          </g>
        ))}
      </g>}
      {sinyal && <circle cx={sinyal[0]} cy={sinyal[1]} r={5.5} fill={u < 0.25 ? MAVI : u < 0.33 ? SARI : KIRMIZI} stroke="#fff" strokeWidth={1.5} />}
      {beyinS && <circle cx={beyinS[0]} cy={beyinS[1]} r={4.5} fill="var(--muted)" />}
      <g fontSize={12} fontWeight={800}>
        {kalk >= 1 && <text className="ad-belir" x={20} y={30} fill={YESIL}>1. El çekildi</text>}
        {u >= 0.9 && <text className="ad-belir" x={20} y={50} fill={MOR}>2. Beyin: "Acı!"</text>}
      </g>
    </svg>
  );
}

/* ---------- sempatik ve parasempatik ---------- */

function Otonom({ v }: SahneProps) {
  const sem = (v.sem ?? 0) === 1;
  const renk = sem ? KIRMIZI : YESIL;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={sem ? "Sempatik etki: kalp hızlı, göz bebeği büyük, sindirim yavaş" : "Parasempatik etki: kalp yavaş, göz bebeği küçük, sindirim hızlı"}>
      <text x={170} y={26} fontSize={13} fontWeight={800} fill={renk} textAnchor="middle">
        {sem ? "Sempatik: harekete hazırlan" : "Parasempatik: dinlen ve sindir"}
      </text>
      <g>
        <path d="M60 78 C60 62 80 58 86 72 C92 58 112 62 112 78 C112 96 86 110 86 116 C86 110 60 96 60 78 Z" fill={KIRMIZI} fillOpacity={0.85}
          className="ad-akis" style={{ animationDuration: sem ? "0.55s" : "0.95s" }} />
        <text x={86} y={146} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">kalp</text>
        <text x={86} y={164} fontSize={11.5} fill="var(--muted)" textAnchor="middle">{sem ? "≈ 110 atım/dk" : "≈ 65 atım/dk"}</text>
      </g>
      <g>
        <ellipse cx={170} cy={88} rx={34} ry={20} fill="#fff" stroke="var(--ink)" strokeWidth={1.6} />
        <circle cx={170} cy={88} r={15} fill={MAVI} fillOpacity={0.6} />
        <circle cx={170} cy={88} r={sem ? 10 : 4.5} fill="var(--ink)" />
        <text x={170} y={146} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">göz bebeği</text>
        <text x={170} y={164} fontSize={11.5} fill="var(--muted)" textAnchor="middle">{sem ? "büyür" : "küçülür"}</text>
      </g>
      <g>
        <path d="M232 70 Q232 60 244 60 L270 60 Q282 60 282 74 Q282 112 254 112 Q236 112 236 98 Q236 88 250 88 Q262 88 262 80" fill={SARI} fillOpacity={0.3} stroke={SARI} strokeWidth={2} />
        <text x={256} y={146} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">sindirim</text>
        <text x={256} y={164} fontSize={11.5} fill="var(--muted)" textAnchor="middle">{sem ? "yavaşlar" : "hızlanır"}</text>
      </g>
      <text x={170} y={204} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        {sem ? "uçlardan genellikle noradrenalin salınır" : "uçlardan asetilkolin salınır"}
      </text>
    </svg>
  );
}

/* ---------- hormonun hedef hücresi ---------- */

const HUCRE = [{ x: 52, uy: true }, { x: 130, uy: false }, { x: 208, uy: true }, { x: 286, uy: false }];

function Hedef({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const ak = sinir(u / 0.4), in_ = yumusak(sinir((u - 0.4) / 0.3)), don = yumusak(sinir((u - 0.7) / 0.25));
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={u >= 1 ? "Hormon yalnızca reseptörü uyan iki hücreye bağlandı" : "Kan damarında hormon ve altında dört hücre"}>
      <g>
        <rect x={10} y={34} width={320} height={34} rx={17} fill={KIRMIZI} fillOpacity={0.1} stroke={KIRMIZI} strokeWidth={1.4} />
        <text x={18} y={24} fontSize={11.5} fontWeight={700} fill={KIRMIZI}>kan damarı</text>
      </g>
      <g>
        {HUCRE.map((h, i) => {
          const yanit = h.uy && in_ >= 1;
          return (
            <g key={i}>
              <circle cx={h.x} cy={160} r={30} fill={yanit ? YESIL : "#fff"} fillOpacity={yanit ? 0.22 : 1} stroke={yanit ? YESIL : "var(--ink)"} strokeWidth={1.6} />
              {h.uy ? (
                <path d={`M${h.x - 8} 124 L${h.x} 134 L${h.x + 8} 124`} fill="none" stroke={YESIL} strokeWidth={3} strokeLinejoin="round" />
              ) : (
                <rect x={h.x - 6} y={124} width={12} height={8} fill="none" stroke="var(--muted)" strokeWidth={2.4} />
              )}
              {yanit && <text className="ad-belir" x={h.x} y={165} fontSize={11} fontWeight={800} fill={YESIL} textAnchor="middle">yanıt</text>}
            </g>
          );
        })}
      </g>
      {u > 0 && (
        <g>
          {HUCRE.map((h, i) => {
            const x = u < 0.4 ? ara(-10 + i * 18, 40 + i * 70, ak) : h.x;
            const xx = u < 0.4 ? x : ara(40 + i * 70, h.x, in_);
            const geri = h.uy ? 0 : don;
            const y = u < 0.4 ? 51 : ara(51, 122, in_) - geri * 60;
            return <path key={i} d={`M${xx - 7} ${y - 10} L${xx} ${y} L${xx + 7} ${y - 10} Z`} fill={MOR} opacity={h.uy ? 1 : 1 - geri * 0.6} />;
          })}
        </g>
      )}
      {u > 0 && <g fontSize={11.5} fontWeight={700}>
        <text x={10} y={218} fill={YESIL}>uyan reseptör</text>
        <text x={330} y={218} fill="var(--muted)" textAnchor="end">uymayan reseptör</text>
      </g>}
    </svg>
  );
}

/* ---------- sinirsel ve hormonal hız ---------- */

function Hiz({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const sv = sinir(u / 0.08), hv = sinir(u / 0.45);
  const sEtki = u > 0.08 && u < 0.24, hEtki = u > 0.45;
  const X0 = 70, X1 = 300;
  const zaman = (a: number, b: number, y: number, renk: string) => (
    <rect x={ara(X0, X1, a)} y={y} width={Math.max(0, ara(X0, X1, Math.min(b, u)) - ara(X0, X1, a))} height={10} rx={5} fill={renk} />
  );
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label="Sinirsel ileti hızlı ve kısa süreli, hormonal ileti yavaş ve uzun süreli">
      <g>
        <text x={14} y={38} fontSize={12} fontWeight={800} fill="var(--ink)">Sinirsel</text>
        <line x1={X0} y1={60} x2={X1} y2={60} stroke={MOR} strokeWidth={2.4} />
        <circle cx={X0} cy={60} r={7} fill={MOR} />
        <rect x={X1 - 4} y={48} width={22} height={24} rx={6} fill={KIRMIZI} fillOpacity={sEtki ? 0.8 : 0.2} />
        <text x={X0} y={86} fontSize={11} fill="var(--muted)">nöron</text>
        <text x={X1 + 18} y={86} fontSize={11} fill="var(--muted)" textAnchor="end">kas</text>
        {u > 0 && sv < 1 && <circle cx={ara(X0, X1, sv)} cy={60} r={5} fill={KIRMIZI} />}
      </g>
      <g>
        <text x={14} y={118} fontSize={12} fontWeight={800} fill="var(--ink)">Hormonal</text>
        <rect x={X0} y={133} width={X1 - X0} height={14} rx={7} fill={KIRMIZI} fillOpacity={0.1} />
        <circle cx={X0} cy={140} r={8} fill={SARI} />
        <rect x={X1 - 4} y={128} width={22} height={24} rx={6} fill={YESIL} fillOpacity={hEtki ? 0.8 : 0.2} />
        <text x={X0} y={166} fontSize={11} fill="var(--muted)">bez → kan</text>
        <text x={X1 + 18} y={166} fontSize={11} fill="var(--muted)" textAnchor="end">hedef organ</text>
        {u > 0 && hv < 1 && <path d={`M${ara(X0, X1, hv) - 6} 134 L${ara(X0, X1, hv)} 144 L${ara(X0, X1, hv) + 6} 134 Z`} fill={MOR} />}
      </g>
      <g>
        <text x={14} y={192} fontSize={11.5} fontWeight={700} fill="var(--muted)">etki süresi</text>
        <line x1={X0} y1={198} x2={X1} y2={198} stroke="var(--line)" strokeWidth={1} />
        {u > 0.08 && zaman(0.08, 0.24, 186, KIRMIZI)}
        {u > 0.45 && zaman(0.45, 1, 202, YESIL)}
      </g>
      {u > 0 && <text x={170} y={226} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">Sinirsel: milisaniyeler · Hormonal: dakikalar, günler</text>}
    </svg>
  );
}

/* ---------- insülin ve kan şekeri ---------- */

const SX0 = 52, SX1 = 318, SY = (mg: number) => 180 - ((mg - 40) / 200) * 150, ST = (h: number) => SX0 + (h / 3) * (SX1 - SX0);
/** Yemekten h saat sonra kan şekeri (mg/dL). */
function seker(h: number, ins: boolean) {
  if (h < 0.5) return 90 + 70 * yumusak(h / 0.5);
  if (ins) return 160 - 65 * yumusak(sinir((h - 0.5) / 2));
  return 160 + 60 * yumusak(sinir((h - 0.5) / 1.5));
}

function Insulin({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const ins = (v.ins ?? 0) === 1;
  const u = ilerleme(t, oynuyor, sure);
  const h = u * 3;
  const pts = Array.from({ length: Math.max(2, Math.round(u * 60) + 1) }, (_, i) => {
    const hh = Math.min(h, i / 20);
    return `${ST(hh).toFixed(1)},${SY(seker(hh, ins)).toFixed(1)}`;
  }).join(" ");
  const deger = Math.round(seker(h, ins));
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`Yemekten ${h.toFixed(1)} saat sonra kan şekeri ${deger} mg/dL; insülin ${ins ? "var" : "yok"}`}>
      <rect x={SX0} y={SY(110)} width={SX1 - SX0} height={SY(70) - SY(110)} fill={YESIL} fillOpacity={0.12} />
      <g>
        <line x1={SX0} y1={26} x2={SX0} y2={182} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={SX0} y1={182} x2={SX1} y2={182} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={SX0 + 6} y={22} fontSize={11} fontWeight={700} fill="var(--ink)">kan şekeri (mg/dL)</text>
        <text x={ST(1.5)} y={SY(74)} fontSize={11} fontWeight={700} fill={YESIL} textAnchor="middle">normal</text>
      </g>
      <g fontSize={10.5} fill="var(--muted)">
        {[200, 150, 100, 50].map((m) => <text key={m} x={SX0 - 6} y={SY(m) + 4} textAnchor="end">{m}</text>)}
        {[1, 2, 3].map((x) => <text key={x} x={ST(x)} y={196} textAnchor={x === 3 ? "end" : "middle"}>{x} saat</text>)}
      </g>
      {u > 0 && <polyline points={pts} fill="none" stroke={ins ? MOR : KIRMIZI} strokeWidth={3} strokeLinejoin="round" />}
      {u > 0 && <circle cx={ST(h)} cy={SY(seker(h, ins))} r={5.5} fill={ins ? MOR : KIRMIZI} stroke="#fff" strokeWidth={1.6} />}
      <text x={170} y={220} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? (ins ? "β hücreleri insülin salgılayacak. Oynat." : "İnsülin salgılanmıyor. Oynat.") : `${deger} mg/dL · ${ins ? "insülin: hücreler glikoz alıyor" : "insülin yok: glikoz kanda kalıyor"}`}
      </text>
    </svg>
  );
}

/* ---------- açlık ve tokluk: pankreas ---------- */

function Pankreas({ v }: SahneProps) {
  const mg = v.mg ?? 90;
  const yuksek = mg > 110, dusuk = mg < 70;
  const y = 186 - ((mg - 40) / 160) * 150;
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`Kan şekeri ${mg} mg/dL: ${yuksek ? "insülin salgılanıyor" : dusuk ? "glukagon salgılanıyor" : "denge"}`}>
      <g>
        <rect x={30} y={30} width={22} height={160} rx={11} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
        <rect x={31} y={186 - ((110 - 40) / 160) * 150} width={20} height={((110 - 70) / 160) * 150} fill={YESIL} fillOpacity={0.25} />
        <rect x={31} y={sinir(y, 32, 188)} width={20} height={Math.max(0, 189 - sinir(y, 32, 188))} rx={9} fill={KIRMIZI} fillOpacity={0.55} />
        <text x={41} y={210} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{mg}</text>
        <text x={41} y={224} fontSize={10.5} fill="var(--muted)" textAnchor="middle">mg/dL</text>
        <text x={58} y={186 - ((90 - 40) / 160) * 150 + 4} fontSize={10.5} fontWeight={700} fill={YESIL}>normal</text>
      </g>
      <g>
        <ellipse cx={150} cy={70} rx={50} ry={28} fill={SARI} fillOpacity={0.15} stroke={SARI} strokeWidth={1.6} />
        <circle cx={132} cy={70} r={12} fill={MAVI} fillOpacity={yuksek ? 0.75 : 0.2} />
        <circle cx={168} cy={70} r={12} fill={MOR} fillOpacity={dusuk ? 0.75 : 0.2} />
        <text x={132} y={74} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">β</text>
        <text x={168} y={74} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">α</text>
        <text x={150} y={30} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">Langerhans adacığı</text>
      </g>
      <g>
        <path d="M250 150 Q240 112 276 112 Q318 112 314 140 Q310 170 272 168 Q254 168 250 150 Z" fill={KIRMIZI} fillOpacity={0.18} stroke={KIRMIZI} strokeWidth={1.6} />
        <text x={282} y={145} fontSize={11.5} fontWeight={700} fill={KIRMIZI} textAnchor="middle">karaciğer</text>
      </g>
      {(yuksek || dusuk) && (
        <g className="ad-belir">
          <line x1={yuksek ? 140 : 176} y1={92} x2={244} y2={136} stroke={yuksek ? MAVI : MOR} strokeWidth={2.4} strokeDasharray="5 4" />
          <text x={yuksek ? 206 : 219} y={yuksek ? 109 : 107} fontSize={12} fontWeight={800} fill={yuksek ? MAVI : MOR} textAnchor="middle" transform={yuksek ? "rotate(23 206 109)" : "rotate(33 219 107)"}>{yuksek ? "insülin" : "glukagon"}</text>
        </g>
      )}
      <text x={190} y={204} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {yuksek ? "Karaciğer ve kaslar glikojen depolar" : dusuk ? "Karaciğer glikojeni yıkar, kana glikoz verir" : "Şeker normalde: iki hormon da az salgılanır"}
      </text>
    </svg>
  );
}

/* ---------- tiroit ve geri bildirim ---------- */

function Tiroit({ v }: SahneProps) {
  const eksik = (v.eksik ?? 0) === 1;
  const tx = eksik ? 1 : v.tx ?? 3;
  const ust = 6 - tx; // TRH ve TSH, tiroksinin tersine
  const buyuk = eksik ? 1.45 : 1;
  const bar = (ad: string, d: number, y: number, renk: string) => (
    <g>
      <text x={232} y={y - 4} fontSize={11} fontWeight={700} fill="var(--ink)">{ad}</text>
      <rect x={232} y={y} width={96} height={10} rx={5} fill="var(--line)" />
      <rect x={232} y={y} width={(96 * d) / 5} height={10} rx={5} fill={renk} />
    </g>
  );
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Tiroksin ${tx}/5, TRH ve TSH ${ust}/5${eksik ? "; iyot eksik, tiroit büyümüş" : ""}`}>
      <g>
        <rect x={40} y={14} width={110} height={30} rx={10} fill={MOR} fillOpacity={0.12} stroke={MOR} strokeWidth={1.4} />
        <text x={95} y={34} fontSize={12} fontWeight={800} fill={MOR} textAnchor="middle">hipotalamus</text>
        <rect x={40} y={84} width={110} height={30} rx={10} fill={MAVI} fillOpacity={0.12} stroke={MAVI} strokeWidth={1.4} />
        <text x={95} y={104} fontSize={12} fontWeight={800} fill={MAVI} textAnchor="middle">hipofiz</text>
      </g>
      <g>
        <path transform={`translate(95 176) scale(${buyuk})`} d="M-4 -14 Q-36 -30 -40 -2 Q-42 22 -14 16 Q-4 12 0 4 Q4 12 14 16 Q42 22 40 -2 Q36 -30 4 -14 Z" fill={KIRMIZI} fillOpacity={0.3} stroke={KIRMIZI} strokeWidth={1.6} />
        <text x={95} y={232} fontSize={12} fontWeight={800} fill={KIRMIZI} textAnchor="middle">{eksik ? "tiroit (guatr)" : "tiroit"}</text>
      </g>
      <g stroke="var(--ink)" strokeWidth={1 + ust * 0.5} strokeLinecap="round">
        <line x1={95} y1={46} x2={95} y2={80} />
        <line x1={95} y1={116} x2={95} y2={eksik ? 148 : 154} />
      </g>
      <g fontSize={11} fontWeight={700} fill="var(--ink)">
        <text x={102} y={67}>TRH</text>
        <text x={102} y={138}>TSH</text>
      </g>
      <g fill="none" stroke={KIRMIZI} strokeWidth={1 + tx * 0.5} strokeDasharray="5 4" opacity={0.9}>
        <path d={`M${eksik ? 156 : 140} 176 L180 176 L180 29 L152 29`} />
        <path d="M180 99 L152 99" />
      </g>
      <g fontSize={11} fontWeight={800} fill={KIRMIZI}>
        <text x={186} y={64}>fren</text>
      </g>
      {bar("TRH", ust, 40, MOR)}
      {bar("TSH", ust, 96, MAVI)}
      {bar("tiroksin", tx, 152, KIRMIZI)}
      <text x={232} y={200} fontSize={11} fontWeight={600} fill="var(--muted)">{eksik ? "iyot yok: tiroksin" : "tiroksin arttıkça"}</text>
      <text x={232} y={214} fontSize={11} fontWeight={600} fill="var(--muted)">{eksik ? "yapılamıyor" : "fren güçlenir"}</text>
    </svg>
  );
}

export const BIYOLOJI9: Record<string, SahneKaydi> = {
  "biy9-noron": { C: Noron },
  "biy9-aksiyon": {
    C: Aksiyon,
    geri: (v) =>
      (v.u ?? 0) < ESIK
        ? { baslik: "İmpuls oluşmadı", metin: `Zar yalnızca −${70 - (v.u ?? 0)} mV'a çıktı ve −55 mV eşiğine ulaşmadı. Uyarıyı artırıp yeniden oynat.` }
        : null,
  },
  "biy9-miyelin": { C: Miyelin },
  "biy9-sinaps": { C: Sinaps },
  "biy9-refleks": { C: Refleks },
  "biy9-otonom": { C: Otonom },
  "biy9-hedef": { C: Hedef },
  "biy9-hiz": { C: Hiz },
  "biy9-insulin": {
    C: Insulin,
    geri: (v) =>
      (v.ins ?? 0) === 1 ? null : { baslik: "Şeker düşmedi", metin: "İnsülin olmadan hücreler glikozu alamıyor; şeker kanda birikiyor. Tip 1 diyabette olan budur. İnsülini aç ve yeniden oynat." },
  },
  "biy9-pankreas": { C: Pankreas },
  "biy9-tiroit": { C: Tiroit },
};
