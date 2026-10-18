"use client";
// Fizik sahneleri (Newton yasaları, iki boyutta hareket): masa örtüsü, net kuvvet, F = m·a arabası, Dünya ve Ay'da tartı,
// kaykayda etki–tepki, dolap ve sürtünme; aynı anda düşen iki top, yardan yatay atış, eğik atış.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const G = 9.8;
const say = (x: number, d = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: d });
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

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

/** Basit insan çizimi: (x, y) ayakların bastığı nokta. yon: kolun uzandığı taraf (1 sağ, −1 sol, 0 kollar aşağıda). */
function Kisi({ x, y, s = 1, yon = 0, renk = "var(--ink)" }: { x: number; y: number; s?: number; yon?: number; renk?: string }) {
  return (
    <g stroke={renk} strokeWidth={5 * s} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y - 66 * s} r={9 * s} fill={renk} stroke="none" />
      <line x1={x} y1={y - 54 * s} x2={x} y2={y - 28 * s} />
      <line x1={x} y1={y - 28 * s} x2={x - 8 * s} y2={y} />
      <line x1={x} y1={y - 28 * s} x2={x + 8 * s} y2={y} />
      {yon ? (
        <line x1={x} y1={y - 48 * s} x2={x + yon * 18 * s} y2={y - 44 * s} />
      ) : (
        <path d={`M${x - 10 * s} ${y - 30 * s} L${x} ${y - 48 * s} L${x + 10 * s} ${y - 30 * s}`} />
      )}
    </g>
  );
}

/* ---------- Newton yasaları ---------- */

// Masa örtüsü hızla çekilir (sure 2,5): örtü 0,4–0,9 s arasında kayar, tabaklar yerinde kalır.
function Ortu({ t, oynuyor }: SahneProps) {
  const oyn = oynuyor || t > 0, bitti = !oynuyor && t > 0;
  const u = oyn ? yumusak((t - 0.4) / 0.5) : 0, dx = u * 320, UST = 150;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Örtü çekildi, tabaklar masada kaldı" : "Masa, üstünde örtü, iki tabak ve bir bardak"}>
      <g fill="var(--ink)">
        <rect x={50} y={UST} width={240} height={8} rx={2} />
        <rect x={66} y={UST + 8} width={8} height={58} />
        <rect x={266} y={UST + 8} width={8} height={58} />
      </g>
      <path
        d={`M${44 + dx} ${UST - 3} L${298 + dx} ${UST - 3} L${298 + dx} ${UST + 40} L${292 + dx} ${UST + 40} L${292 + dx} ${UST + 3} L${44 + dx} ${UST + 3} Z`}
        fill="var(--c2)"
        opacity={0.85}
      />
      <g fill="#e6ebf2" stroke="var(--muted)" strokeWidth={1.5}>
        <ellipse cx={110} cy={UST - 7} rx={26} ry={4.5} />
        <ellipse cx={230} cy={UST - 7} rx={26} ry={4.5} />
      </g>
      <path d={`M158 ${UST - 40} L182 ${UST - 40} L178 ${UST - 4} L162 ${UST - 4} Z`} fill="var(--c1)" opacity={0.35} stroke="var(--c1)" strokeWidth={1.5} />
      {!oyn && (
        <g>
          <Ok x1={300} y1={UST + 58} x2={332} y2={UST + 58} renk="var(--ink)" kalin={2.5} />
          <text x={334} y={UST + 80} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="end">hızla çek</text>
        </g>
      )}
      <text x={170} y={96} fontSize={13} fontWeight={700} fill={bitti ? "var(--good)" : "var(--muted)"} textAnchor="middle">
        {bitti ? "Örtü gitti, tabaklar yerinde kaldı" : oyn ? "Çekiliyor…" : "Örtü bir anda çekilecek"}
      </text>
    </svg>
  );
}

// Kutuyu zıt yönde iten iki kuvvet. Sol itme 30 N (sağa), v.F: sağdaki itme (sola).
function Net({ v }: SahneProps) {
  const F1 = 30, F2 = v.F ?? 0, net = F1 - F2, K = 2.2, Y = 120;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Sağa 30 newton, sola ${F2} newton; net kuvvet ${Math.abs(net)} newton`}>
      <line x1={14} x2={326} y1={150} y2={150} stroke="var(--ink)" strokeWidth={2} />
      <rect x={135} y={90} width={70} height={60} rx={4} fill="var(--c4)" />
      <Ok x1={205} y1={Y} x2={205 + F1 * K} y2={Y} renk="var(--c1)" />
      <Ok x1={135} y1={Y} x2={135 - F2 * K} y2={Y} renk="var(--c2)" />
      <g fontSize={13} fontWeight={800} textAnchor="middle">
        <text x={205 + (F1 * K) / 2} y={Y - 12} fill="var(--c1)">30 N</text>
        {F2 > 0 && <text x={135 - (F2 * K) / 2} y={Y - 12} fill="var(--c2)">{F2} N</text>}
      </g>
      {net !== 0 && <Ok x1={170} y1={172} x2={170 + net * K} y2={172} renk="var(--ink)" kalin={2.5} />}
      <text x={170} y={net !== 0 ? 198 : 184} fontSize={14} fontWeight={800} textAnchor="middle" fill={net === 0 ? "var(--good)" : "var(--ink)"}>
        Net kuvvet: {Math.abs(net)} N{net > 0 ? " sağa" : net < 0 ? " sola" : ""}
      </text>
      <text x={170} y={net !== 0 ? 218 : 204} fontSize={12} textAnchor="middle" fill="var(--muted)">
        {net === 0 ? "Kuvvetler dengede: hız değişmez" : "Kutu net kuvvet yönünde hızlanır"}
      </text>
    </svg>
  );
}

// F = m·a arabası (sure 2). v.F veya s.F: kuvvet (N), v.m veya s.m: kütle (kg). x = ½·a·t².
const FMA = { X0: 36, PX: 27, YOL: 170 };
function Fma({ s, v, t, oynuyor, kosular }: SahneProps) {
  const F = v.F ?? Number(s.F ?? 0), m = v.m ?? Number(s.m ?? 10), a = F / m;
  const T = Number(s.sure ?? 2), tt = oynuyor || t > 0 ? Math.min(t, T) : 0;
  const x = 0.5 * a * tt * tt, px = FMA.X0 + x * FMA.PX;
  const izler: number[] = [];
  for (let k = 0.5; k <= tt + 1e-6; k += 0.5) izler.push(FMA.X0 + 0.5 * a * k * k * FMA.PX);
  const son = kosular.slice(-3);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${F} newton, ${m} kilogram: ivme ${say(a, 2)} metre bölü saniye kare`}>
      <text x={170} y={28} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        a = F / m = {F} / {m} = {say(a, 2)} m/s²
      </text>
      <g fontSize={11.5} fill="var(--muted)">
        {son.map((k, i) => {
          const kF = k.F ?? Number(s.F ?? 0), km = k.m ?? Number(s.m ?? 10), ka = kF / km;
          return <text key={i} x={170} y={52 + i * 17} textAnchor="middle">{km} kg, {kF} N: a = {say(ka, 2)} m/s², {T} s'de {say(0.5 * ka * T * T)} m</text>;
        })}
      </g>
      <line x1={FMA.X0 - 14} x2={330} y1={FMA.YOL} y2={FMA.YOL} stroke="var(--ink)" strokeWidth={2} />
      <g fontSize={10.5} fill="var(--muted)" textAnchor="middle">
        {[0, 2, 4, 6, 8, 10].map((d) => (
          <g key={d}>
            <line x1={FMA.X0 + d * FMA.PX} x2={FMA.X0 + d * FMA.PX} y1={FMA.YOL + 2} y2={FMA.YOL + 8} stroke="var(--muted)" />
            <text x={FMA.X0 + d * FMA.PX} y={FMA.YOL + 21}>{d} m</text>
          </g>
        ))}
      </g>
      <g fill="var(--c1)" opacity={0.45}>
        {izler.map((x, i) => <circle key={i} cx={x} cy={FMA.YOL + 32} r={3.5} />)}
      </g>
      <g>
        <rect x={px - 22} y={FMA.YOL - 36} width={44} height={26} rx={4} fill="var(--c1)" />
        <circle cx={px - 12} cy={FMA.YOL - 6} r={5.5} fill="var(--ink)" />
        <circle cx={px + 12} cy={FMA.YOL - 6} r={5.5} fill="var(--ink)" />
        <text x={px} y={FMA.YOL - 18} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">{m} kg</text>
        {F > 0 && <Ok x1={px + 24} y1={FMA.YOL - 23} x2={px + 24 + F * 1.6} y2={FMA.YOL - 23} renk="var(--c2)" />}
        {F > 0 && <text x={px + 24 + F * 0.8} y={FMA.YOL - 34} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{F} N</text>}
      </g>
      {tt > 0 && <text x={170} y={232} fontSize={11.5} fill="var(--muted)" textAnchor="middle">noktalar yarım saniye arayla: aralık açılıyor, araba hızlanıyor</text>}
    </svg>
  );
}

// 60 kg'lık astronot tartıda. v.ay: 0 Dünya, 1 Ay. G = m·g.
function Agirlik({ v }: SahneProps) {
  const ay = v.ay === 1, g = ay ? 1.62 : G, W = 60 * g;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${ay ? "Ay" : "Dünya"}: kütle 60 kilogram, ağırlık ${Math.round(W)} newton`}>
      <line x1={14} x2={326} y1={190} y2={190} stroke={ay ? "var(--muted)" : "var(--ink)"} strokeWidth={2} />
      {ay && (
        <g fill="none" stroke="var(--line-2)" strokeWidth={1.5}>
          <ellipse cx={40} cy={200} rx={14} ry={4} />
          <ellipse cx={250} cy={202} rx={20} ry={5} />
          <ellipse cx={310} cy={198} rx={9} ry={3} />
        </g>
      )}
      <rect x={66} y={178} width={68} height={12} rx={3} fill="var(--ink)" />
      <Kisi x={100} y={176} s={1.25} renk={ay ? "#6b7b91" : "var(--ink)"} />
      <g>
        <text x={100} y={30} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ay ? "Ay" : "Dünya"}</text>
        <text x={100} y={48} fontSize={12} fill="var(--muted)" textAnchor="middle">g = {say(g, 2)} m/s²</text>
      </g>
      <g textAnchor="middle">
        <text x={252} y={74} fontSize={12} fontWeight={700} fill="var(--muted)">kütle</text>
        <text x={252} y={100} fontSize={22} fontWeight={800} fill="var(--ink)">60 kg</text>
        <text x={252} y={132} fontSize={12} fontWeight={700} fill="var(--muted)">ağırlık (G = m·g)</text>
        <text x={252} y={158} fontSize={22} fontWeight={800} fill={ay ? "var(--good)" : "var(--c2)"}>{Math.round(W)} N</text>
      </g>
    </svg>
  );
}

// Kaykayda etki–tepki (sure 3). Sen (60 kg) kardeşini (30 kg) 0,8 s boyunca 60 N ile itiyorsun.
function EtkiTepki({ t, oynuyor }: SahneProps) {
  const oyn = oynuyor || t > 0, bitti = !oynuyor && t > 0, Fk = 60, ti = 0.8, PX = 18, Y = 180;
  const yol = (a: number) => (t <= ti ? 0.5 * a * t * t : 0.5 * a * ti * ti + a * ti * (t - ti));
  const xA = 150 - (oyn ? yol(Fk / 60) : 0) * PX, xB = 186 + (oyn ? yol(Fk / 30) : 0) * PX;
  const itiyor = oyn && t <= ti;
  const tahta = (x: number, s: number) => (
    <g>
      <rect x={x - 17 * s} y={Y - 8} width={34 * s} height={4} rx={2} fill="var(--c4)" />
      <circle cx={x - 11 * s} cy={Y - 1} r={3.2} fill="var(--ink)" />
      <circle cx={x + 11 * s} cy={Y - 1} r={3.2} fill="var(--ink)" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "İkisi de zıt yönlere kaydı; kardeşin daha hızlı" : "Kaykayda iki kişi yan yana"}>
      <line x1={10} x2={330} y1={Y + 3} y2={Y + 3} stroke="var(--ink)" strokeWidth={2} />
      {tahta(xA, 1.05)}
      {tahta(xB, 0.85)}
      <Kisi x={xA} y={Y - 8} s={1.05} yon={1} renk="var(--c1)" />
      <Kisi x={xB} y={Y - 8} s={0.85} yon={-1} renk="var(--c2)" />
      {itiyor && (
        <g>
          <Ok x1={xA - 4} y1={74} x2={xA - 54} y2={74} renk="var(--c1)" />
          <Ok x1={xB + 4} y1={74} x2={xB + 54} y2={74} renk="var(--c2)" />
          <text x={xA - 29} y={62} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="middle">60 N</text>
          <text x={xB + 29} y={62} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">60 N</text>
        </g>
      )}
      <g fontSize={11.5} fontWeight={700}>
        <text x={xA + 8} y={Y + 22} fill="var(--c1)" textAnchor="end">sen</text>
        <text x={xA + 8} y={Y + 38} fill="var(--c1)" textAnchor="end">60 kg</text>
        <text x={xB - 8} y={Y + 22} fill="var(--c2)">kardeşin</text>
        <text x={xB - 8} y={Y + 38} fill="var(--c2)">30 kg</text>
      </g>
      <text x={170} y={30} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={bitti ? "var(--good)" : "var(--muted)"}>
        {bitti ? "Kuvvetler eşitti; hafif olan iki kat hızlı" : itiyor ? "İtiyorsun: ikinize de 60 N" : oyn ? "İtme bitti, kayıyorsunuz" : "İkisi de duruyor"}
      </text>
    </svg>
  );
}

// 20 kg'lık dolap (N = 196 N). μs = 0,4 → sınır ≈ 78 N; μk = 0,3 → fk ≈ 59 N. v.F: itme (N).
function Surtunme({ v }: SahneProps) {
  const F = v.F ?? 0, SINIR = 0.4 * 196, FK = 0.3 * 196, kayar = F > SINIR, f = kayar ? FK : F, K = 1.1, Y = 170;
  const bar = (x: number) => 40 + (x / 100) * 260;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`İtme ${F} newton, sürtünme ${Math.round(f)} newton, dolap ${kayar ? "kayıyor" : "duruyor"}`}>
      <rect x={40} y={26} width={260} height={10} rx={5} fill="var(--line)" />
      <rect x={40} y={26} width={bar(F) - 40} height={10} rx={5} fill={kayar ? "var(--c2)" : "var(--c1)"} />
      <line x1={bar(SINIR)} x2={bar(SINIR)} y1={20} y2={42} stroke="var(--ink)" strokeWidth={2} />
      <text x={bar(SINIR)} y={56} fontSize={11} fill="var(--ink)" fontWeight={700} textAnchor="middle">sınır μs·N ≈ 78 N</text>
      <line x1={14} x2={326} y1={Y} y2={Y} stroke="var(--ink)" strokeWidth={2} />
      <g>
        <rect x={150} y={72} width={64} height={98} rx={3} fill="#dfe5ee" stroke="var(--ink)" strokeWidth={1.6} />
        <line x1={182} x2={182} y1={76} y2={166} stroke="var(--ink)" strokeWidth={1.2} />
        <circle cx={176} cy={122} r={2} fill="var(--ink)" />
        <circle cx={188} cy={122} r={2} fill="var(--ink)" />
      </g>
      {kayar && (
        <g stroke="var(--muted)" strokeWidth={2} strokeLinecap="round">
          <line x1={224} x2={244} y1={96} y2={96} />
          <line x1={224} x2={252} y1={116} y2={116} />
          <line x1={224} x2={244} y1={136} y2={136} />
        </g>
      )}
      {F > 0 && <Ok x1={146 - F * K} y1={122} x2={146} y2={122} renk="var(--c1)" />}
      {F > 0 && <text x={146 - (F * K) / 2} y={110} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="middle">itme {F} N</text>}
      {f > 0 && <Ok x1={214} y1={Y + 12} x2={214 - f * K} y2={Y + 12} renk="var(--c2)" />}
      <text x={170} y={Y + 36} fontSize={12.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">
        {f === 0 ? "Sürtünme yok: itmiyorsun" : kayar ? `Kinetik sürtünme: ${Math.round(FK)} N` : `Statik sürtünme: ${F} N`}
      </text>
      <text x={170} y={Y + 56} fontSize={12} fontWeight={700} textAnchor="middle" fill={kayar ? "var(--good)" : "var(--muted)"}>
        {kayar ? "Dolap kayıyor" : "Dolap kımıldamıyor"}
      </text>
    </svg>
  );
}

/* ---------- iki boyutta hareket ---------- */

// Aynı yükseklikten (19,6 m) biri bırakılan, biri 10 m/s ile yatay atılan iki top (sure 2).
function IkiTop({ t, oynuyor }: SahneProps) {
  const oyn = oynuyor || t > 0, bitti = !oynuyor && t > 0, tt = oyn ? Math.min(t, 2) : 0;
  const PY = 7.6, PX = 9, Y0 = 46, XA = 72, XB = 90;
  const y = (s: number) => Y0 + 0.5 * G * s * s * PY;
  const xb = (s: number) => XB + 10 * s * PX;
  const izler: number[] = [];
  for (let k = 0.4; k < tt - 0.05; k += 0.4) izler.push(k);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "İki top aynı anda yere değdi" : "Biri bırakılacak, biri yatay atılacak iki top"}>
      <rect x={6} y={52} width={54} height={150} fill="var(--line)" />
      <line x1={6} x2={334} y1={202} y2={202} stroke="var(--ink)" strokeWidth={2} />
      <g>
        {izler.map((k) => (
          <g key={k}>
            <line x1={XA} x2={xb(k)} y1={y(k)} y2={y(k)} stroke="var(--line-2)" strokeDasharray="3 4" />
            <circle cx={XA} cy={y(k)} r={5} fill="var(--c2)" opacity={0.3} />
            <circle cx={xb(k)} cy={y(k)} r={5} fill="var(--c1)" opacity={0.3} />
          </g>
        ))}
      </g>
      <circle cx={XA} cy={Math.min(y(tt), 196)} r={6} fill="var(--c2)" />
      <circle cx={xb(tt)} cy={Math.min(y(tt), 196)} r={6} fill="var(--c1)" />
      {!oyn && (
        <g fontSize={11.5} fontWeight={700}>
          <text x={XA - 4} y={30} fill="var(--c2)" textAnchor="middle">bırakılan</text>
          <text x={XB + 30} y={50} fill="var(--c1)">fırlatılan</text>
          <Ok x1={XB + 8} y1={46} x2={XB + 26} y2={46} renk="var(--c1)" kalin={2} />
        </g>
      )}
      <text x={33} y={130} fontSize={11} fill="var(--muted)" textAnchor="middle">19,6 m</text>
      <text x={200} y={30} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={bitti ? "var(--good)" : "var(--muted)"}>
        {bitti ? "İkisi de 2 s'de yere değdi" : oyn ? `t = ${say(tt)} s` : "Hava direnci yok"}
      </text>
    </svg>
  );
}

// 19,6 m'lik yardan yatay atış (sure 2, uçuş hep 2 s). v.v: atış hızı (m/s). Bayrak 40 m'de.
const YT = { X0: 56, PX: 4.6, Y0: 54, PY: 7.14, ZEMIN: 194 };
function Yatay({ v, t, oynuyor, kosular }: SahneProps) {
  const v0 = v.v ?? 10, oyn = oynuyor || t > 0, bitti = !oynuyor && t > 0, tt = oyn ? Math.min(t, 2) : 0;
  const nokta = (hiz: number, s: number) => `${(YT.X0 + hiz * s * YT.PX).toFixed(1)},${(YT.Y0 + 0.5 * G * s * s * YT.PY).toFixed(1)}`;
  const yolu = (hiz: number, son: number) => Array.from({ length: 21 }, (_, i) => nokta(hiz, (i / 20) * son)).join(" ");
  const eskiler = [...new Set(kosular.map((k) => k.v))].filter((h) => !(bitti && h === v0));
  const bx = YT.X0 + v0 * tt * YT.PX, by = YT.Y0 + 0.5 * G * tt * tt * YT.PY, bayrak = YT.X0 + 40 * YT.PX;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Atış hızı ${v0} metre bölü saniye${bitti ? `, taş ${v0 * 2} metre öteye düştü` : ""}`}>
      <rect x={6} y={60} width={50} height={140} fill="var(--line)" />
      <line x1={6} x2={334} y1={200} y2={200} stroke="var(--ink)" strokeWidth={2} />
      <text x={31} y={134} fontSize={11} fill="var(--muted)" textAnchor="middle">19,6 m</text>
      <g>
        <line x1={bayrak} x2={bayrak} y1={168} y2={200} stroke="var(--ink)" strokeWidth={1.6} />
        <path d={`M${bayrak} 168 L${bayrak + 16} 174 L${bayrak} 180 Z`} fill="var(--c2)" />
        <text x={bayrak} y={218} fontSize={11} fill="var(--muted)" textAnchor="middle">40 m</text>
      </g>
      <g fill="none" stroke="var(--c1)" strokeWidth={1.5} opacity={0.3}>
        {eskiler.map((h) => <polyline key={h} points={yolu(h, 2)} />)}
      </g>
      <g fontSize={10.5} fill="var(--muted)" textAnchor="middle">
        {eskiler.map((h) => <text key={h} x={YT.X0 + h * 2 * YT.PX} y={232}>{h * 2} m</text>)}
      </g>
      {tt > 0 && <polyline points={yolu(v0, tt)} fill="none" stroke="var(--c1)" strokeWidth={2.5} />}
      <circle cx={bx} cy={Math.min(by, YT.ZEMIN)} r={6} fill="var(--c1)" />
      <text x={330} y={26} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="end">v0 = {v0} m/s</text>
      <text x={330} y={46} fontSize={12} fontWeight={700} textAnchor="end" fill={bitti ? (v0 * 2 === 40 ? "var(--good)" : "var(--ink)") : "var(--muted)"}>
        {bitti ? `uçuş 2 s · ${v0 * 2} m öteye` : oyn ? `t = ${say(tt)} s` : "yatay atılacak"}
      </text>
    </svg>
  );
}

// Eğik atış, v0 = 20 m/s. v.a veya s.aci: açı (°). s.tepe: oynatma tepe noktasında durur. s.oklar: hız bileşenleri.
const EG = { X0: 24, PX: 6.8, ZEMIN: 206, V0: 20 };
const ucus = (aci: number) => {
  const r = (aci * Math.PI) / 180, vx = EG.V0 * Math.cos(r), vy = EG.V0 * Math.sin(r);
  return { vx, vy, T: (2 * vy) / G, R: (EG.V0 * EG.V0 * Math.sin(2 * r)) / G };
};
function Egik({ s, v, t, oynuyor, kosular }: SahneProps) {
  const aci = v.a ?? Number(s.aci ?? 45), { vx, vy, T, R } = ucus(aci);
  const sure = Number(s.sure ?? 3), tepe = s.tepe === true, oyn = oynuyor || t > 0, bitti = !oynuyor && t > 0;
  const tau = oyn ? (Math.min(t, sure) / sure) * (tepe ? T / 2 : T) : 0;
  const P = (x: number, y: number) => `${(EG.X0 + x * EG.PX).toFixed(1)},${(EG.ZEMIN - y * EG.PX).toFixed(1)}`;
  const yolu = (a: number, son: number) => {
    const u = ucus(a);
    return Array.from({ length: 31 }, (_, i) => { const k = (i / 30) * son; return P(u.vx * k, u.vy * k - 0.5 * G * k * k); }).join(" ");
  };
  const eskiler = [...new Set(kosular.map((k) => k.a))].filter((a) => a !== undefined && !(bitti && a === aci));
  const bx = EG.X0 + vx * tau * EG.PX, by = EG.ZEMIN - Math.max(0, vy * tau - 0.5 * G * tau * tau) * EG.PX;
  const vyNow = vy - G * tau, r = (aci * Math.PI) / 180;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Açı ${aci} derece, 20 metre bölü saniye${bitti && !tepe ? `, menzil ${say(R)} metre` : ""}`}>
      <line x1={8} x2={334} y1={EG.ZEMIN} y2={EG.ZEMIN} stroke="var(--ink)" strokeWidth={2} />
      <g fill="none" stroke="var(--c1)" strokeWidth={1.5} opacity={0.3}>
        {eskiler.map((a) => <polyline key={a} points={yolu(a, ucus(a).T)} />)}
      </g>
      <g fontSize={10.5} fill="var(--muted)" textAnchor="middle">
        {eskiler.map((a) => <text key={a} x={EG.X0 + ucus(a).R * EG.PX} y={EG.ZEMIN + 16}>{a}°: {say(ucus(a).R)} m</text>)}
      </g>
      {!oyn && (
        <g>
          <line x1={EG.X0} y1={EG.ZEMIN} x2={EG.X0 + 46 * Math.cos(r)} y2={EG.ZEMIN - 46 * Math.sin(r)} stroke="var(--c1)" strokeWidth={2} strokeDasharray="4 4" />
          <path d={`M${EG.X0 + 24} ${EG.ZEMIN} A24 24 0 0 0 ${EG.X0 + 24 * Math.cos(r)} ${EG.ZEMIN - 24 * Math.sin(r)}`} fill="none" stroke="var(--muted)" strokeWidth={1.4} />
          <text x={EG.X0 + 30} y={EG.ZEMIN - 8} fontSize={11} fill="var(--muted)">{aci}°</text>
        </g>
      )}
      {tau > 0 && <polyline points={yolu(aci, tau)} fill="none" stroke="var(--c1)" strokeWidth={2.5} />}
      <circle cx={bx} cy={Math.min(by, EG.ZEMIN - 6)} r={6} fill="var(--c1)" />
      {s.oklar === true && oyn && (
        <g>
          <Ok x1={bx} y1={by} x2={bx + vx * 3} y2={by} renk="var(--c3)" kalin={2.5} />
          <Ok x1={bx} y1={by} x2={bx} y2={by - vyNow * 3} renk="var(--c2)" kalin={2.5} />
          <text x={bx + vx * 3 + 6} y={by + 4} fontSize={11.5} fontWeight={800} fill="var(--c3)">vx = {say(vx)}</text>
          {Math.abs(vyNow) > 1.5 && <text x={bx - 8} y={by - vyNow * 3 + (vyNow > 0 ? -4 : 14)} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="end">vy = {say(vyNow)}</text>}
        </g>
      )}
      <text x={10} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">θ = {aci}° · v0 = 20 m/s</text>
      <text x={10} y={44} fontSize={12} fontWeight={700} fill={bitti ? "var(--good)" : "var(--muted)"}>
        {bitti ? (tepe ? `Tepede: vy = 0, v = vx = ${say(vx)} m/s` : `Menzil: ${say(R)} m`) : oyn ? `t = ${say(tau)} s` : "hava direnci yok"}
      </text>
    </svg>
  );
}

export const FIZIK4: Record<string, SahneKaydi> = {
  "fiz4-ortu": { C: Ortu },
  "fiz4-net": { C: Net },
  "fiz4-fma": {
    C: Fma,
    geri: (v, s) => {
      const F = v.F ?? Number(s.F ?? 0), m = v.m ?? Number(s.m ?? 10);
      return { baslik: "Henüz değil", metin: `İvme ${say(F / m, 2)} m/s² oldu. 2 m/s² için kuvveti F = m·a ile hesapla.` };
    },
  },
  "fiz4-agirlik": { C: Agirlik },
  "fiz4-etki-tepki": { C: EtkiTepki },
  "fiz4-surtunme": { C: Surtunme },
  "fiz4-iki-top": { C: IkiTop },
  "fiz4-yatay": {
    C: Yatay,
    geri: (v) => ({ baslik: "Henüz değil", metin: `Taş ${(v.v ?? 10) * 2} m öteye düştü. Uçuş hep 2 s sürüyor: 40 m için hızın kaç olmalı?` }),
  },
  "fiz4-egik": {
    C: Egik,
    geri: (v, s) => ({ baslik: "Daha uzağa gidebilir", metin: `Menzil ${say(ucus(v.a ?? Number(s.aci ?? 45)).R)} m. Başka bir açı dene; en uzağa gideni bul.` }),
  },
};
