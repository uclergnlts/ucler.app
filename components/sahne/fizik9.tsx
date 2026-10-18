"use client";
// Fizik sahneleri (elektrik akımı; elektriksel enerji): anahtarlı basit devre, Ohm yasası ve V–I grafiği, telin direnci,
// seri / paralel ampuller, ampermetrenin yanlış bağlanması, karışık devre; telefon şarjı, Joule ısınması, cihaz etiketi,
// kWh faturası, sigorta, akkor ampul ile LED.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
/** Binlik ayraçlı Türkçe sayı (36 000). */
const binlik = (x: number) => Math.round(x).toLocaleString("tr-TR").replace(/\./g, " ");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);

/* ---------- ortak devre parçaları ---------- */

/** Dikey pil: üstte uzun çizgi (+), altta kısa kalın çizgi (−). (x, y) iki levhanın ortası. */
function Pil({ x, y, etiket }: { x: number; y: number; etiket?: string }) {
  return (
    <g>
      <rect x={x - 18} y={y - 8} width={36} height={16} fill="#fff" />
      <line x1={x - 16} x2={x + 16} y1={y - 6} y2={y - 6} stroke="var(--ink)" strokeWidth={2.2} />
      <line x1={x - 8} x2={x + 8} y1={y + 6} y2={y + 6} stroke="var(--ink)" strokeWidth={5} />
      <text x={x + 22} y={y - 2} fontSize={13} fontWeight={800} fill="var(--c2)">+</text>
      <text x={x + 22} y={y + 13} fontSize={13} fontWeight={800} fill="var(--c1)">−</text>
      {etiket && <text x={x - 22} y={y + 5} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="end">{etiket}</text>}
    </g>
  );
}

/** Ampul simgesi (daire içinde çarpı). p: 0..1 parlaklık. */
function Lamba({ x, y, p, sokuk = false }: { x: number; y: number; p: number; sokuk?: boolean }) {
  if (sokuk) return <circle cx={x} cy={y} r={12} fill="#fff" stroke="var(--line-2)" strokeWidth={1.6} strokeDasharray="3 3" />;
  const q = sinir(p, 0, 1);
  return (
    <g>
      {q > 0.01 && <circle cx={x} cy={y} r={14 + 16 * q} fill="var(--c4)" opacity={0.12 + 0.3 * q} />}
      <circle cx={x} cy={y} r={12} fill={q > 0.01 ? "#ffe8a3" : "#fff"} stroke="var(--ink)" strokeWidth={2} />
      <path d={`M${x - 8.5} ${y - 8.5} L${x + 8.5} ${y + 8.5} M${x + 8.5} ${y - 8.5} L${x - 8.5} ${y + 8.5}`} stroke="var(--ink)" strokeWidth={1.6} />
    </g>
  );
}

/** Direnç kutusu (yatay ya da dikey). */
function Direnc({ x, y, yazi, dikey = false, renk = "var(--ink)" }: { x: number; y: number; yazi: string; dikey?: boolean; renk?: string }) {
  const w = dikey ? 14 : 40, h = dikey ? 40 : 14;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={2} fill="#fff" stroke={renk} strokeWidth={2} />
      <text x={dikey ? x + 14 : x} y={dikey ? y + 4 : y - 13} fontSize={11.5} fontWeight={800} fill={renk} textAnchor={dikey ? "start" : "middle"}>{yazi}</text>
    </g>
  );
}

/** Tel boyunca kayan elektronlar (kesikli çizgi). hiz: 0 ise durur. Yol − kutuptan başlamalı. */
function Elektronlar({ d, hiz }: { d: string; hiz: number }) {
  if (hiz <= 0) return null;
  return (
    <path d={d} fill="none" stroke="var(--c1)" strokeWidth={3.2} strokeLinecap="round" strokeDasharray="0.1 14">
      <animate attributeName="stroke-dashoffset" from="0" to="-14.1" dur={`${sinir(1.4 / hiz, 0.15, 3)}s`} repeatCount="indefinite" />
    </path>
  );
}

/** Uçtaki yön oku (küçük üçgen). */
function Uc({ x, y, yon, renk }: { x: number; y: number; yon: "sag" | "sol" | "yukari" | "asagi"; renk: string }) {
  const p = { sag: `M${x + 6} ${y} L${x - 4} ${y - 6} L${x - 4} ${y + 6} Z`, sol: `M${x - 6} ${y} L${x + 4} ${y - 6} L${x + 4} ${y + 6} Z`,
    yukari: `M${x} ${y - 6} L${x - 6} ${y + 4} L${x + 6} ${y + 4} Z`, asagi: `M${x} ${y + 6} L${x - 6} ${y - 4} L${x + 6} ${y - 4} Z` }[yon];
  return <path d={p} fill={renk} />;
}

/* ---------- Elektrik akımı ---------- */

// Pil, anahtar, lamba. v.k = 1 anahtar kapalı. Elektronlar − kutuptan çıkar; geleneksel akım ters yöndedir.
function Devre({ v }: SahneProps) {
  const k = (v.k ?? 0) === 1;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={k ? "Anahtar kapalı: devreden akım geçiyor, lamba yanıyor" : "Anahtar açık: akım yok"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={k ? "var(--good)" : "var(--muted)"}>{k ? "Devre kapalı: lamba yanıyor" : "Devre açık: akım yok"}</text>
      <path d="M70 112 V62 H150 M190 62 H270 V106 M270 130 V182 H70 V128" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <circle cx={150} cy={62} r={3.5} fill="var(--ink)" />
      <circle cx={190} cy={62} r={3.5} fill="var(--ink)" />
      <line x1={150} y1={62} x2={k ? 190 : 184} y2={k ? 62 : 38} stroke="var(--ink)" strokeWidth={2.6} strokeLinecap="round" />
      <text x={170} y={k ? 50 : 32} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{k ? "" : "anahtar"}</text>
      <Pil x={70} y={120} etiket="pil" />
      <Lamba x={270} y={118} p={k ? 1 : 0} />
      <Elektronlar d="M70 130 V182 H270 V132 M270 104 V62 H70 V110" hiz={k ? 1 : 0} />
      {k && (
        <g fontSize={11.5} fontWeight={800}>
          <Uc x={214} y={62} yon="sag" renk="var(--c2)" />
          <text x={214} y={52} fill="var(--c2)" textAnchor="middle">akım (I)</text>
          <Uc x={170} y={182} yon="sag" renk="var(--c1)" />
          <text x={170} y={202} fill="var(--c1)" textAnchor="middle">elektronlar</text>
          <text x={326} y={226} fill="var(--muted)" textAnchor="end">her saniye 2 C geçiyor: I = q / t = 2 A</text>
        </g>
      )}
    </svg>
  );
}

// Ohm yasası: R = s.R Ω, gerilim v.V volt. Solda devre ve ampermetre, sağda V–I grafiği (V düşey, I yatay).
function Ohm({ v, s }: SahneProps) {
  const R = Number(s.R ?? 4), V = sinir(v.V ?? 0, 0, 12), I = V / R;
  const GX0 = 176, GX1 = 322, GY0 = 196, GY1 = 56, IM = 12 / R;
  const gx = (i: number) => GX0 + (i / IM) * (GX1 - GX0), gy = (u: number) => GY0 - (u / 12) * (GY0 - GY1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`R = ${R} Ω, V = ${V} V, I = ${say(I, 2)} A`}>
      <g fontSize={13} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">I = V / R = {V} / {R} = <tspan fill="var(--c2)">{say(I, 2)} A</tspan></text>
      </g>
      <path d="M30 112 V64 H130 V182 H30 V128" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <Pil x={30} y={120} />
      <text x={40} y={154} fontSize={12} fontWeight={800} fill="var(--ink)">{V} V</text>
      <Direnc x={80} y={64} yazi={`${R} Ω`} />
      <circle cx={130} cy={124} r={15} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      <text x={130} y={129} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">A</text>
      <text x={130} y={204} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{say(I, 2)} A</text>
      <Elektronlar d="M30 130 V182 H130 V139 M130 109 V64 H30 V110" hiz={I} />
      <g>
        <line x1={GX0} x2={GX1 + 4} y1={GY0} y2={GY0} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={GX0} x2={GX0} y1={GY0} y2={GY1 - 10} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={GX0 + 6} y={GY1 - 2} fontSize={11} fontWeight={800} fill="var(--ink)">V (V)</text>
        <text x={GX1} y={GY0 + 30} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="end">I (A)</text>
        {[0, 4, 8, 12].map((u) => <text key={u} x={GX0 - 5} y={gy(u) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{u}</text>)}
        {[0, 1, 2, 3].map((i) => <text key={i} x={gx(i)} y={GY0 + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">{i}</text>)}
      </g>
      <line x1={gx(0)} y1={gy(0)} x2={gx(IM)} y2={gy(12)} stroke="var(--c5)" strokeWidth={2.4} />
      <text x={gx(IM) - 38} y={gy(12) + 6} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="end">eğim = R</text>
      <g>
        <line x1={gx(I)} x2={gx(I)} y1={gy(V)} y2={GY0} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
        <line x1={GX0} x2={gx(I)} y1={gy(V)} y2={gy(V)} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
        <circle cx={gx(I)} cy={gy(V)} r={5.5} fill="var(--c2)" />
      </g>
    </svg>
  );
}

// İki direncin V–I doğruları: X = 6 Ω (dik), Y = 2 Ω (yatık).
function VI() {
  const GX0 = 60, GX1 = 310, GY0 = 200, GY1 = 40;
  const gx = (i: number) => GX0 + (i / 3) * (GX1 - GX0), gy = (u: number) => GY0 - (u / 12) * (GY0 - GY1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="İki direncin V–I grafiği: X'in doğrusu daha dik">
      <g>
        <line x1={GX0} x2={GX1 + 6} y1={GY0} y2={GY0} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={GX0} x2={GX0} y1={GY0} y2={GY1 - 12} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={GX0 + 6} y={GY1 - 4} fontSize={11} fontWeight={800} fill="var(--ink)">V (V)</text>
        <text x={GX1} y={GY0 - 6} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="end">I (A)</text>
        {[0, 3, 6, 9, 12].map((u) => (
          <g key={u}>
            <line x1={GX0} x2={GX1} y1={gy(u)} y2={gy(u)} stroke="var(--line)" />
            <text x={GX0 - 6} y={gy(u) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{u}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => <text key={i} x={gx(i)} y={GY0 + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">{i}</text>)}
      </g>
      <line x1={gx(0)} y1={gy(0)} x2={gx(2)} y2={gy(12)} stroke="var(--c2)" strokeWidth={2.6} />
      <line x1={gx(0)} y1={gy(0)} x2={gx(3)} y2={gy(6)} stroke="var(--c1)" strokeWidth={2.6} />
      <g fontSize={13} fontWeight={800}>
        <text x={gx(2) + 8} y={gy(12) + 6} fill="var(--c2)">X</text>
        <text x={gx(3) - 4} y={gy(6) - 10} fill="var(--c1)" textAnchor="end">Y</text>
      </g>
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">aynı I için X'in uçlarında daha büyük V var</text>
    </svg>
  );
}

// Telin direnci: boy v.L × L₀, kesit v.A × A₀. R = ρ·L/A = (L/A)·R₀.
function Tel({ v }: SahneProps) {
  const L = sinir(v.L ?? 1, 1, 4), A = sinir(v.A ?? 1, 1, 4), R = L / A;
  const boy = L * 56, kal = 4 + A * 5, X0 = 30, Y = 104;
  const bar = sinir(R * 60, 6, 240);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Boy ${L} L₀, kesit ${A} A₀: direnç ${say(R, 2)} R₀`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">R = ρ · L / A = ({L} / {A}) · R₀</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={R === 1 ? "var(--good)" : "var(--c2)"}>R = {R === 1 ? "R₀" : `${say(R, 2)} R₀`}</text>
      <rect x={X0} y={Y - kal / 2} width={boy} height={kal} rx={kal / 2} fill="#d58a4a" />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <line x1={X0} x2={X0 + boy} y1={Y + 34} y2={Y + 34} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={X0} x2={X0} y1={Y + 29} y2={Y + 39} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={X0 + boy} x2={X0 + boy} y1={Y + 29} y2={Y + 39} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={X0 + boy / 2} y={Y + 54} textAnchor="middle">boy: {L === 1 ? "L₀" : `${L} L₀`}</text>
        <text x={X0 + boy + 10} y={Y + 4}>kesit: {A === 1 ? "A₀" : `${A} A₀`}</text>
      </g>
      <g>
        <text x={14} y={196} fontSize={11.5} fontWeight={800} fill="var(--muted)">direnç</text>
        <rect x={70} y={186} width={240} height={14} rx={7} fill="var(--line)" />
        <rect x={70} y={186} width={bar} height={14} rx={7} fill={R === 1 ? "var(--good)" : "var(--c2)"} />
        <line x1={130} x2={130} y1={180} y2={206} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={130} y={222} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="middle">R₀</text>
      </g>
    </svg>
  );
}

// İki özdeş (ya da s.r1, s.r2 dirençli) ampul, 12 V. v.p = 1 paralel; v.s = 1 ikinci ampul sökük.
function IkiAmpul({ v, s }: SahneProps) {
  const r1 = Number(s.r1 ?? 6), r2 = Number(s.r2 ?? 6), V = 12, par = (v.p ?? 0) === 1, sok = (v.s ?? 0) === 1;
  let P1: number, P2: number, I: number;
  if (par) { P1 = (V * V) / r1; P2 = sok ? 0 : (V * V) / r2; I = V / r1 + (sok ? 0 : V / r2); }
  else if (sok) { P1 = 0; P2 = 0; I = 0; }
  else { I = V / (r1 + r2); P1 = I * I * r1; P2 = I * I * r2; }
  const PM = (V * V) / Math.min(r1, r2), parl = (P: number) => (P > 0 ? Math.sqrt(P / PM) : 0);
  const etiket = (r: number) => (r1 === r2 ? "" : `${r} Ω`);
  const durum = !par && sok ? "Devre açıldı: ikisi de söndü" : `${par ? "Paralel" : "Seri"}: pilden ${say(I, 2)} A çekiliyor`;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${par ? "Paralel" : "Seri"} bağlı ampuller${sok ? ", biri sökük" : ""}: ${say(P1)} W ve ${say(P2)} W`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={!par && sok ? "var(--c2)" : "var(--ink)"}>{durum}</text>
      {par ? (
        <g>
          <path d="M50 112 V60 H270 V108 M270 132 V182 H50 V128 M180 60 V108 M180 132 V182" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
          <Lamba x={180} y={120} p={parl(P1)} />
          <Lamba x={270} y={120} p={parl(P2)} sokuk={sok} />
          <g fontSize={12} fontWeight={800} textAnchor="middle">
            <text x={198} y={125} fill="var(--ink)" textAnchor="start">{say(P1)} W</text>
            <text x={288} y={125} fill={sok ? "var(--muted)" : "var(--ink)"} textAnchor="start">{sok ? "sökük" : `${say(P2)} W`}</text>
            {etiket(r1) && <text x={156} y={104} fill="var(--muted)" textAnchor="end">{etiket(r1)}</text>}
            {etiket(r2) && <text x={246} y={104} fill="var(--muted)" textAnchor="end">{etiket(r2)}</text>}
          </g>
          <Elektronlar d={sok ? "M50 130 V182 H180 V134 M180 106 V60 H50 V110" : "M50 130 V182 H270 V134 M270 106 V60 H50 V110"} hiz={I / 2} />
          {!sok && <Elektronlar d="M180 182 V134 M180 106 V60" hiz={I / 4} />}
        </g>
      ) : (
        <g>
          <path d="M50 112 V60 H128 M152 60 H208 M232 60 H290 V182 H50 V128" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
          <Lamba x={140} y={60} p={parl(P1)} />
          <Lamba x={220} y={60} p={parl(P2)} sokuk={sok} />
          <g fontSize={12} fontWeight={800} textAnchor="middle">
            <text x={140} y={100} fill="var(--ink)">{say(P1)} W</text>
            <text x={220} y={100} fill={sok ? "var(--muted)" : "var(--ink)"}>{sok ? "sökük" : `${say(P2)} W`}</text>
            {etiket(r1) && <text x={140} y={36} fill="var(--muted)">{etiket(r1)}</text>}
            {etiket(r2) && <text x={220} y={36} fill="var(--muted)">{etiket(r2)}</text>}
          </g>
          <Elektronlar d="M50 130 V182 H290 V60 H232 M208 60 H152 M128 60 H50 V110" hiz={I} />
        </g>
      )}
      <Pil x={50} y={120} etiket="12 V" />
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">parlaklık = ampulün harcadığı güç</text>
    </svg>
  );
}

// Ampermetre lambaya paralel bağlanır: lamba söner, pilden çok büyük akım geçer (sure 3).
function YanlisAmper({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), bagli = u > 0.3;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bagli ? "Ampermetre lambaya paralel bağlandı: kısa devre, lamba söndü" : "Lamba yanıyor; ampermetre lambaya paralel bağlanacak"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bagli ? "var(--c2)" : "var(--ink)"}>{bagli ? "Kısa devre: lamba söndü" : "Ampermetre lambaya paralel bağlanıyor"}</text>
      <path d="M60 112 V62 H190 V104 M190 128 V182 H60 V128" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <Pil x={60} y={120} />
      {bagli && <circle cx={60} cy={120} r={24} fill="var(--c2)" opacity={0.15 + 0.15 * Math.sin(u * 30)} />}
      <Lamba x={190} y={116} p={bagli ? 0 : 1} />
      <path d="M190 62 H280 V100 M280 132 V182 H190" fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeDasharray={bagli ? undefined : "5 5"} opacity={bagli ? 1 : 0.5} />
      <circle cx={280} cy={116} r={16} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      <text x={280} y={121} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">A</text>
      {bagli && <Elektronlar d="M60 130 V182 H280 V134 M280 98 V62 H60 V110" hiz={4} />}
      {bagli && (
        <g fontSize={11.5} fontWeight={800} fill="var(--c2)">
          <text x={300} y={112}>çok</text>
          <text x={300} y={126}>büyük</text>
          <text x={300} y={140}>akım</text>
          <text x={72} y={160}>pil ısınıyor</text>
        </g>
      )}
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">ampermetrenin iç direnci neredeyse sıfır</text>
    </svg>
  );
}

// Karışık devre: 4 Ω, paralel bağlı 6 Ω ve 3 Ω'a seri. Üreteç v.V volt. Reş = 6 Ω.
function Karisik({ v }: SahneProps) {
  const V = sinir(v.V ?? 6, 0, 24), I = V / 6, Vp = I * 2, I6 = Vp / 6, I3 = Vp / 3;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Üreteç ${V} V: ana akım ${say(I, 2)} A, 6 Ω'dan ${say(I6, 2)} A, 3 Ω'dan ${say(I3, 2)} A`}>
      <path d="M40 112 V50 H190 M190 50 H290 M190 50 V104 H290 V50 M290 50 H316 V176 H40 V128" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
      <Pil x={40} y={120} etiket="" />
      <text x={28} y={152} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="end">{V} V</text>
      <Direnc x={112} y={50} yazi="4 Ω" />
      <Direnc x={240} y={50} yazi="6 Ω" />
      <Direnc x={240} y={104} yazi="3 Ω" />
      <circle cx={190} cy={50} r={3.5} fill="var(--ink)" />
      <circle cx={290} cy={50} r={3.5} fill="var(--ink)" />
      <Elektronlar d="M40 130 V176 H316 V50 H290 M290 50 H190 M190 50 H40 V110" hiz={I / 2} />
      <Elektronlar d="M290 50 V104 H190 V50" hiz={I3 / 2} />
      <g fontSize={11.5} fontWeight={800}>
        <text x={150} y={78} fill="var(--c2)" textAnchor="middle">I = {say(I, 2)} A</text>
        <text x={240} y={74} fill="var(--c5)" textAnchor="middle">{say(I6, 2)} A</text>
        <text x={240} y={130} fill="var(--c5)" textAnchor="middle">{say(I3, 2)} A</text>
      </g>
      <g fontSize={12} fontWeight={800} fill="var(--ink)">
        <text x={14} y={198}>Reş = 4 + (6·3)/(6+3) = 6 Ω,  I = {V} / 6 = <tspan fill="var(--c2)">{say(I, 2)} A</tspan></text>
        <text x={14} y={220} fill="var(--muted)">4 Ω'da {say(I * 4, 2)} V, paralel kısımda {say(Vp, 2)} V düşer</text>
      </g>
    </svg>
  );
}

/* ---------- Elektriksel enerji ---------- */

// Telefon şarjı: 5 V, 2 A; süre v.t dakika. W = V·I·t.
function Sarj({ v }: SahneProps) {
  const dk = sinir(v.t ?? 0, 0, 120), W = 5 * 2 * dk * 60, oran = sinir(W / 72000, 0, 1), hedef = W === 36000;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${dk} dakika şarj: ${binlik(W)} J`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">W = V · I · t = 5 · 2 · {dk * 60} s</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={hedef ? "var(--good)" : "var(--c2)"}>W = {binlik(W)} J</text>
      <g>
        <rect x={34} y={70} width={58} height={112} rx={10} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />
        <rect x={42} y={82} width={42} height={88} rx={4} fill="var(--line)" />
        <rect x={42} y={82 + 88 * (1 - sinir(W / 36000, 0, 1))} width={42} height={88 * sinir(W / 36000, 0, 1)} rx={4} fill="var(--good)" opacity={0.75} />
        <path d="M63 182 V200 H150" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <rect x={150} y={190} width={44} height={22} rx={5} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
        <text x={172} y={205} fontSize={10.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">5 V 2 A</text>
      </g>
      <g>
        <text x={120} y={92} fontSize={11.5} fontWeight={800} fill="var(--muted)">aktarılan enerji</text>
        <rect x={120} y={100} width={200} height={16} rx={8} fill="var(--line)" />
        <rect x={120} y={100} width={Math.max(0.1, 200 * oran)} height={16} rx={8} fill={hedef ? "var(--good)" : "var(--c1)"} />
        <line x1={220} x2={220} y1={94} y2={122} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={220} y={138} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="middle">36 000 J</text>
        <text x={120} y={162} fontSize={12} fontWeight={800} fill="var(--ink)">süre: {dk} dk</text>
      </g>
    </svg>
  );
}

// Joule ısınması: R = 10 Ω, t = 60 s, akım v.I amper. Q = I²·R·t.
function Joule({ v }: SahneProps) {
  const I = sinir(v.I ?? 1, 1, 4), Q = I * I * 10 * 60, oran = sinir(Q / 9600, 0, 1), k = I * I;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Akım ${I} A: 1 dakikada ${binlik(Q)} J ısı`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">Q = I² · R · t = {I}² · 10 Ω · 60 s</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={I === 2 ? "var(--good)" : "var(--c2)"}>Q = {binlik(Q)} J  ({k} katı)</text>
      <g>
        <path d="M40 80 V200 Q40 208 48 208 H152 Q160 208 160 200 V80" fill="none" stroke="var(--ink)" strokeWidth={2.2} />
        <rect x={42} y={110} width={116} height={96} fill="var(--c1)" opacity={0.12} />
        <path d="M70 70 V176 Q70 186 80 186 L80 186 Q86 172 92 186 Q98 172 104 186 Q110 172 116 186 Q122 172 128 186 Q130 186 130 176 V70"
          fill="none" stroke={`rgba(226, 72, 59, ${0.35 + 0.15 * k})`} strokeWidth={3} />
        {Array.from({ length: Math.min(16, k * 3) }, (_, i) => (
          <circle key={i} cx={56 + ((i * 37) % 92)} cy={196 - ((i * 23) % 80)} r={2.5 + (i % 3)} fill="none" stroke="var(--c1)" strokeWidth={1.4} />
        ))}
      </g>
      <g>
        <text x={186} y={92} fontSize={11.5} fontWeight={800} fill="var(--muted)">1 dakikada açığa çıkan ısı</text>
        <rect x={186} y={104} width={140} height={16} rx={8} fill="var(--line)" />
        <rect x={186} y={104} width={140 * oran} height={16} rx={8} fill="var(--c2)" />
        <text x={186} y={146} fontSize={12} fontWeight={800} fill="var(--ink)">akım: {I} A</text>
        <text x={186} y={166} fontSize={11.5} fontWeight={700} fill="var(--muted)">akım 2 katı → ısı 4 katı</text>
      </g>
    </svg>
  );
}

// Etiketi 220 V, 2000 W olan ısıtıcı 110 V'a bağlanır (sure 3). R = 24,2 Ω sabit.
function Etiket({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), V = u > 0.4 ? 110 : 220, P = (V * V) / 24.2;
  const parl = Math.sqrt(P / 2000);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Isıtıcı ${V} V'ta ${Math.round(P)} W harcıyor`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">R = V² / P = 220² / 2000 = 24,2 Ω</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={V === 110 ? "var(--c2)" : "var(--ink)"}>{V} V'ta P = {V}² / 24,2 = {Math.round(P)} W</text>
      <g>
        <rect x={40} y={70} width={150} height={110} rx={12} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={58} x2={172} y1={92 + i * 22} y2={92 + i * 22} stroke={`rgba(226, 72, 59, ${0.15 + 0.75 * parl})`} strokeWidth={6} strokeLinecap="round" />
        ))}
        <rect x={60} y={186} width={110} height={30} rx={6} fill="var(--line)" />
        <text x={115} y={206} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">220 V · 2000 W</text>
      </g>
      <g>
        <text x={214} y={90} fontSize={11.5} fontWeight={800} fill="var(--muted)">priz</text>
        <rect x={214} y={98} width={100} height={40} rx={10} fill={V === 110 ? "var(--c2)" : "var(--c1)"} opacity={0.15} />
        <text x={264} y={125} fontSize={18} fontWeight={800} fill={V === 110 ? "var(--c2)" : "var(--c1)"} textAnchor="middle">{V} V</text>
        <text x={214} y={164} fontSize={11.5} fontWeight={800} fill="var(--muted)">güç</text>
        <rect x={214} y={172} width={100} height={14} rx={7} fill="var(--line)" />
        <rect x={214} y={172} width={100 * (P / 2000)} height={14} rx={7} fill="var(--c2)" />
      </g>
    </svg>
  );
}

// Fatura: 1,5 kW klima günde v.h saat, 30 gün, 1 kWh = 3 TL. Hedef: 270 TL'yi geçmemek.
function Fatura({ v }: SahneProps) {
  const h = sinir(v.h ?? 4, 1, 6), E = 1.5 * h * 30, TL = E * 3, iyi = TL <= 270;
  const bx = (x: number) => 30 + (x / 810) * 280;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Günde ${h} saat: ${say(E)} kWh, ${say(TL)} TL`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">E = 1,5 kW · {h} saat · 30 gün = {say(E)} kWh</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={iyi ? "var(--good)" : "var(--c2)"}>Tutar = {say(E)} kWh · 3 TL = {say(TL)} TL</text>
      <g>
        <rect x={60} y={66} width={150} height={44} rx={10} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />
        {[0, 1, 2].map((i) => <line key={i} x1={74} x2={196} y1={96 + i * 5} y2={96 + i * 5} stroke="var(--line-2)" strokeWidth={2} />)}
        <text x={135} y={86} fontSize={11} fontWeight={800} fill="var(--muted)" textAnchor="middle">klima · 1,5 kW</text>
        <text x={226} y={86} fontSize={12} fontWeight={800} fill="var(--ink)">günde {h} saat</text>
        <text x={226} y={104} fontSize={11.5} fontWeight={700} fill="var(--muted)">30 gün</text>
      </g>
      <g>
        <text x={30} y={150} fontSize={11.5} fontWeight={800} fill="var(--muted)">aylık tutar</text>
        <rect x={30} y={158} width={280} height={18} rx={9} fill="var(--line)" />
        <rect x={30} y={158} width={bx(TL) - 30} height={18} rx={9} fill={iyi ? "var(--good)" : "var(--c2)"} />
        <line x1={bx(270)} x2={bx(270)} y1={150} y2={184} stroke="var(--ink)" strokeWidth={1.6} />
        <text x={bx(270)} y={200} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">bütçe: 270 TL</text>
      </g>
    </svg>
  );
}

// Sigorta: 220 V hat, 16 A. Cihazlar: v.a ısıtıcı 2000 W, v.b su ısıtıcısı 2200 W, v.c ütü 1100 W.
const CIHAZ = [
  { ad: "ısıtıcı", P: 2000, k: "a" },
  { ad: "su ısıtıcısı", P: 2200, k: "b" },
  { ad: "ütü", P: 1100, k: "c" },
];
function Sigorta({ v }: SahneProps) {
  const acik = CIHAZ.map((c) => (v[c.k] ?? 0) === 1);
  const I = CIHAZ.reduce((t, c, i) => t + (acik[i] ? c.P / 220 : 0), 0), atti = I > 16;
  const gx = (a: number) => 30 + (sinir(a, 0, 30) / 30) * 280;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Toplam akım ${say(I)} A${atti ? ": sigorta attı" : ""}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={atti ? "var(--c2)" : "var(--ink)"}>{atti ? "Sigorta attı: hat kesildi" : `Toplam akım: ${say(I)} A`}</text>
      <g>
        <path d="M30 60 H310" stroke="var(--ink)" strokeWidth={2.2} />
        <rect x={40} y={50} width={44} height={20} rx={4} fill="#fff" stroke={atti ? "var(--c2)" : "var(--ink)"} strokeWidth={2} />
        <text x={62} y={64} fontSize={10.5} fontWeight={800} fill={atti ? "var(--c2)" : "var(--ink)"} textAnchor="middle">16 A</text>
        {CIHAZ.map((c, i) => {
          const x = 130 + i * 80, on = acik[i] && !atti;
          return (
            <g key={c.k}>
              <line x1={x} x2={x} y1={60} y2={92} stroke="var(--ink)" strokeWidth={2} />
              <rect x={x - 32} y={92} width={64} height={40} rx={8} fill={on ? "var(--c4)" : "#fff"} opacity={on ? 0.9 : 1} stroke="var(--ink)" strokeWidth={2} />
              <text x={x} y={110} fontSize={10.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{c.ad}</text>
              <text x={x} y={124} fontSize={10.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{c.P} W</text>
              <text x={x} y={148} fontSize={10.5} fontWeight={800} fill={acik[i] ? "var(--ink)" : "var(--muted)"} textAnchor="middle">{acik[i] ? `${say(c.P / 220)} A` : "kapalı"}</text>
            </g>
          );
        })}
      </g>
      <g>
        <rect x={30} y={170} width={280} height={18} rx={9} fill="var(--line)" />
        <rect x={30} y={170} width={Math.max(0.1, gx(I) - 30)} height={18} rx={9} fill={atti ? "var(--c2)" : "var(--good)"} />
        <line x1={gx(16)} x2={gx(16)} y1={162} y2={196} stroke="var(--ink)" strokeWidth={1.6} />
        <text x={gx(16)} y={212} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">sınır 16 A</text>
      </g>
    </svg>
  );
}

// Akkor ampul (60 W) ile LED (9 W) aynı ışığı verir. v.led = 1 LED.
function Verim({ v }: SahneProps) {
  const led = (v.led ?? 0) === 1, P = led ? 9 : 60, isik = 3, isi = P - isik;
  const w = (x: number) => (x / 60) * 220;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${led ? "LED" : "Akkor ampul"}: ${P} W, ışık ${isik} W, ısı ${isi} W`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{led ? "LED: 9 W" : "Akkor ampul: 60 W"}</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={led ? "var(--good)" : "var(--c2)"}>verim = ışık / harcanan = {isik} / {P} ≈ %{Math.round((100 * isik) / P)}</text>
      <g>
        <circle cx={58} cy={112} r={34} fill="var(--c4)" opacity={0.2} />
        <circle cx={58} cy={112} r={20} fill="#ffe8a3" stroke="var(--ink)" strokeWidth={2} />
        <rect x={48} y={132} width={20} height={16} rx={3} fill="var(--line-2)" />
        {!led && [0, 1, 2].map((i) => (
          <path key={i} d={`M${40 + i * 18} 70 q-6 -8 0 -16 q6 -8 0 -16`} fill="none" stroke="var(--c2)" strokeWidth={2} opacity={0.7} />
        ))}
      </g>
      <g>
        <text x={110} y={90} fontSize={11.5} fontWeight={800} fill="var(--muted)">ışık: {isik} W</text>
        <rect x={110} y={98} width={220} height={14} rx={7} fill="var(--line)" />
        <rect x={110} y={98} width={w(isik)} height={14} rx={7} fill="var(--c4)" />
        <text x={110} y={136} fontSize={11.5} fontWeight={800} fill="var(--muted)">ısı: {isi} W</text>
        <rect x={110} y={144} width={220} height={14} rx={7} fill="var(--line)" />
        <rect x={110} y={144} width={w(isi)} height={14} rx={7} fill="var(--c2)" />
      </g>
      <text x={326} y={210} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">ikisi de aynı miktarda ışık veriyor</text>
    </svg>
  );
}

export const FIZIK9: Record<string, SahneKaydi> = {
  "fiz9-devre": { C: Devre },
  "fiz9-ohm": { C: Ohm },
  "fiz9-vi": { C: VI },
  "fiz9-tel": { C: Tel },
  "fiz9-iki-ampul": { C: IkiAmpul },
  "fiz9-yanlis-amper": { C: YanlisAmper },
  "fiz9-karisik": { C: Karisik },
  "fiz9-sarj": { C: Sarj },
  "fiz9-joule": { C: Joule },
  "fiz9-etiket": { C: Etiket },
  "fiz9-fatura": { C: Fatura },
  "fiz9-sigorta": { C: Sigorta },
  "fiz9-verim": { C: Verim },
};
