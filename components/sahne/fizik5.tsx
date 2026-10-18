"use client";
// Fizik sahneleri (bağıl hareket; iş, enerji ve güç): perondan ve trenden bakış, iki araç, yürüyen merdiven, nehirde kayık,
// arabadan yağmur; açılı iple çekilen kutu, kinetik enerji, düşen top, kaydırak ve sürtünme, merdivende güç, yay ve F–x grafiği.
import { Araba, type SahneKaydi, type SahneProps } from "./ortak";

const G = 9.8;
/** Türkçe sayı: ondalık virgül; 10 000 ve üstü boşlukla gruplanır (kartlardaki gibi). */
const say = (x: number, d = 1) => {
  const [a, b] = x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).split(",");
  const g = Math.abs(x) >= 10000 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : a;
  return b ? `${g},${b}` : g;
};
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const RAD = Math.PI / 180;
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

/** Basit insan çizimi: (x, y) ayakların bastığı nokta. */
function Kisi({ x, y, s = 1, renk = "var(--ink)" }: { x: number; y: number; s?: number; renk?: string }) {
  return (
    <g stroke={renk} strokeWidth={5 * s} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y - 66 * s} r={9 * s} fill={renk} stroke="none" />
      <line x1={x} y1={y - 54 * s} x2={x} y2={y - 28 * s} />
      <line x1={x} y1={y - 28 * s} x2={x - 8 * s} y2={y} />
      <line x1={x} y1={y - 28 * s} x2={x + 8 * s} y2={y} />
      <path d={`M${x - 10 * s} ${y - 30 * s} L${x} ${y - 48 * s} L${x + 10 * s} ${y - 30 * s}`} />
    </g>
  );
}

/** Yatay enerji çubuğu: değer / en çok × genişlik. */
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

/* ---------- Bağıl hareket ---------- */

// Trendeki yolcu: v.g 0 perondan, 1 trenden bakış. Tren yere göre 20 m/s.
function Gozlemci({ v }: SahneProps) {
  const tren = v.g === 1, Y = 176;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={tren ? "Trendeki arkadaşın gözünden: yolcu durgun, peron geriye gidiyor" : "Perondan bakış: tren ve yolcu 20 m/s ile ilerliyor"}>
      <line x1={8} x2={332} y1={Y} y2={Y} stroke="var(--ink)" strokeWidth={2} />
      <g>
        <rect x={70} y={92} width={200} height={70} rx={10} fill="var(--fizik-soft)" stroke="var(--fizik)" strokeWidth={2} />
        {[0, 1, 2].map((i) => <rect key={i} x={84 + i * 62} y={104} width={48} height={26} rx={4} fill="#fff" stroke="var(--fizik)" strokeWidth={1.5} />)}
        <circle cx={100} cy={166} r={8} fill="var(--ink)" />
        <circle cx={240} cy={166} r={8} fill="var(--ink)" />
      </g>
      <Kisi x={150} y={158} s={0.42} renk="var(--c2)" />
      <Kisi x={188} y={158} s={0.42} renk={tren ? "var(--c3)" : "var(--muted)"} />
      <Kisi x={306} y={Y} s={0.55} renk={tren ? "var(--muted)" : "var(--c3)"} />
      <text x={170} y={226} fontSize={12.5} fontWeight={700} fill="var(--c3)" textAnchor="middle">
        Gözlemci: {tren ? "trendeki arkadaş" : "perondaki kişi"}
      </text>
      {tren ? (
        <g>
          <Ok x1={330} y1={70} x2={262} y2={70} renk="var(--ink)" />
          <text x={296} y={58} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">peron: 20 m/s</text>
          <text x={150} y={74} fontSize={12.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">yolcu: 0 m/s</text>
        </g>
      ) : (
        <g>
          <Ok x1={110} y1={70} x2={178} y2={70} renk="var(--c2)" />
          <text x={144} y={58} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">yolcu: 20 m/s</text>
          <text x={306} y={84} fontSize={12} fontWeight={700} fill="var(--c3)" textAnchor="middle">0 m/s</text>
        </g>
      )}
      <text x={14} y={26} fontSize={13} fontWeight={800} fill="var(--ink)">Tren yere göre 20 m/s ile gidiyor</text>
    </svg>
  );
}

/** İki aracın bir bakıştan görünüşü: a, b hızlar (km/h, + doğu). */
function AracSatir({ y, baslik, a, b, aYazi, bYazi }: { y: number; baslik: string; a: number; b: number; aYazi: string; bYazi: string }) {
  const K = 0.45;
  return (
    <g>
      <text x={14} y={y - 46} fontSize={12} fontWeight={800} fill="var(--muted)">{baslik}</text>
      <line x1={14} x2={326} y1={y + 6} y2={y + 6} stroke="var(--line-2)" strokeWidth={1.5} />
      <Araba x={90} y={y} renk="var(--c1)" />
      <Araba x={240} y={y} renk="var(--c2)" ters={b < 0} />
      {a !== 0 && <Ok x1={90} y1={y - 30} x2={90 + a * K} y2={y - 30} renk="var(--c1)" />}
      {b !== 0 && <Ok x1={240} y1={y - 30} x2={240 + b * K} y2={y - 30} renk="var(--c2)" />}
      <text x={90} y={y + 24} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="middle">A: {aYazi}</text>
      <text x={240} y={y + 24} fontSize={11.5} fontWeight={700} fill="var(--c2)" textAnchor="middle">B: {bYazi}</text>
    </g>
  );
}

// İki araç: A doğuya 90 km/h; v.b: B'nin hızı (km/h, + doğu, − batı). Üstte yerden, altta A'dan bakış.
function IkiArac({ v }: SahneProps) {
  const vA = 90, vB = v.b ?? 60, r = vB - vA;
  const yon = (x: number) => (x > 0 ? "doğuya" : x < 0 ? "batıya" : "");
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`A doğuya 90, B ${Math.abs(vB)} km/h ${yon(vB)}; A'ya göre B ${Math.abs(r)} km/h ${yon(r)}`}>
      <AracSatir y={72} baslik="Yerden bakış" a={vA} b={vB} aYazi="90 km/h" bYazi={vB === 0 ? "duruyor" : `${Math.abs(vB)} km/h`} />
      <AracSatir y={168} baslik="A'daki sürücünün gözünden" a={0} b={r} aYazi="durgun" bYazi={r === 0 ? "durgun" : `${Math.abs(r)} km/h ${yon(r)}`} />
      <text x={170} y={238} fontSize={13.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        A'ya göre B: {vB} − 90 = {r} km/h
      </text>
    </svg>
  );
}

// Yürüyen merdiven, 24 m (sure 6; 1 sahne saniyesi = 8 gerçek saniye). Üç kişi aynı anda başlar.
const MERDIVEN = [
  { ad: "Çalışan merdivende duruyor", v: 1, renk: "var(--c1)" },
  { ad: "Duran merdivende yürüyor", v: 0.5, renk: "var(--c4)" },
  { ad: "Çalışan merdivende yürüyor", v: 1.5, renk: "var(--c2)" },
];
function Merdiven({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), u = ilerleme(t, oynuyor, sure), T = u * 48;
  const x0 = 40, x1 = 300;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="24 metrelik yürüyen merdivende üç kişi: 24, 48 ve 16 saniye">
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Merdiven 24 m · geçen süre: {Math.round(T)} s</text>
      {MERDIVEN.map((m, i) => {
        const y = 78 + i * 62, d = Math.min(24, m.v * T), x = x0 + (d / 24) * (x1 - x0), son = 24 / m.v, bitti = T >= son - 1e-6 && u > 0;
        return (
          <g key={i}>
            <text x={x0} y={y - 22} fontSize={11.5} fontWeight={700} fill="var(--muted)">{m.ad} ({say(m.v)} m/s)</text>
            <line x1={x0} x2={x1} y1={y} y2={y} stroke="var(--line-2)" strokeWidth={6} strokeLinecap="round" />
            <line x1={x0} x2={x} y1={y} y2={y} stroke={m.renk} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
            <circle cx={x} cy={y} r={8} fill={m.renk} />
            {bitti && <text x={x1 + 4} y={y - 12} fontSize={12.5} fontWeight={800} fill={m.renk} textAnchor="end">{say(son)} s</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Nehirde kayık. s.gen: genişlik (m), s.vk: suya göre hız, akıntı v.va ya da s.va, burun açısı v.aci ya da s.aci (akıntıya karşı, 0 = dik).
function nehirHesap(s: SahneProps["s"], v: Record<string, number>) {
  const gen = Number(s.gen ?? 80), vk = Number(s.vk ?? 4), va = v.va ?? Number(s.va ?? 3), aci = v.aci ?? Number(s.aci ?? 0);
  const vx = va - vk * Math.sin(aci * RAD), vy = vk * Math.cos(aci * RAD), tc = gen / vy;
  return { gen, vk, va, aci, vx, vy, tc, kay: vx * tc };
}
function Nehir({ s, v, t, oynuyor, kosular }: SahneProps) {
  const h = nehirHesap(s, v), sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure);
  const KIYI1 = 190, KIYI2 = 70, PXM = (KIYI1 - KIYI2) / h.gen, BX = 110;
  const nokta = (k: number) => ({ x: BX + h.vx * h.tc * k * PXM, y: KIYI1 - h.vy * h.tc * k * PXM });
  const b = nokta(u), bitti = !oynuyor && t > 0;
  const okK = 9;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Nehir ${h.gen} m, kayık ${h.vk} m/s, akıntı ${h.va} m/s, burun ${h.aci} derece`}>
      <rect x={0} y={KIYI2} width={340} height={KIYI1 - KIYI2} fill="var(--fizik-soft)" />
      <line x1={0} x2={340} y1={KIYI2} y2={KIYI2} stroke="var(--ink)" strokeWidth={2} />
      <line x1={0} x2={340} y1={KIYI1} y2={KIYI1} stroke="var(--ink)" strokeWidth={2} />
      <g fill="var(--fizik)" opacity={0.5}>
        {[[22, 96], [210, 96], [262, 150]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l22 0 l-6 -5 M${x + 22} ${y} l-6 5`} stroke="var(--fizik)" strokeWidth={2} fill="none" />)}
      </g>
      <g>
        <line x1={BX} x2={BX} y1={KIYI2 - 10} y2={KIYI2} stroke="var(--good)" strokeWidth={2} />
        <text x={BX} y={KIYI2 - 14} fontSize={11.5} fontWeight={700} fill="var(--good)" textAnchor="middle">tam karşı</text>
      </g>
      {kosular.slice(-3).map((k, i) => {
        const kh = nehirHesap(s, k);
        return <line key={i} x1={BX} y1={KIYI1} x2={BX + kh.kay * PXM} y2={KIYI2} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />;
      })}
      {u > 0 && <line x1={BX} y1={KIYI1} x2={b.x} y2={b.y} stroke="var(--c2)" strokeWidth={2} strokeDasharray="5 4" />}
      <g transform={`translate(${b.x} ${b.y}) rotate(${-h.aci})`}>
        <path d="M0 -14 Q7 -6 6 10 L-6 10 Q-7 -6 0 -14 Z" fill="var(--c2)" />
      </g>
      {u === 0 && (
        <g>
          <Ok x1={BX} y1={KIYI1} x2={BX - h.vk * Math.sin(h.aci * RAD) * okK} y2={KIYI1 - h.vk * Math.cos(h.aci * RAD) * okK} renk="var(--c2)" kalin={2.5} />
          <Ok x1={BX} y1={KIYI1 + 18} x2={BX + h.va * okK} y2={KIYI1 + 18} renk="var(--fizik)" kalin={2.5} />
          <text x={BX + h.va * okK + 6} y={KIYI1 + 22} fontSize={11.5} fontWeight={700} fill="var(--fizik)">akıntı {say(h.va)} m/s</text>
          <text x={BX + 14} y={KIYI1 - 20} fontSize={11.5} fontWeight={700} fill="var(--c2)">kayık {say(h.vk)} m/s</text>
        </g>
      )}
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Nehir {h.gen} m · burun {h.aci === 0 ? "kıyıya dik" : `${h.aci}° akıntıya karşı`}</text>
      <text x={170} y={238} fontSize={13} fontWeight={800} textAnchor="middle" fill={bitti ? "var(--ink)" : "var(--muted)"}>
        {bitti
          ? `Geçiş ${say(h.tc)} s · sürüklenme ${Math.abs(h.kay) < 0.5 ? "yok" : `${say(Math.abs(h.kay))} m ${h.kay > 0 ? "aşağı" : "yukarı"}`}`
          : oynuyor ? `${say(u * h.tc)} s` : "Oynat ve kayığın nereye vardığına bak"}
      </text>
    </svg>
  );
}

// Arabadan yağmur: damla yere göre 8 m/s düşey; v.v arabanın hızı. Arabadakine göre damla (−v, 8).
function Yagmur({ v }: SahneProps) {
  const va = v.v ?? 0, vb = Math.hypot(va, 8), th = Math.atan2(va, 8) / RAD;
  const dx = -va / 8, cizgi = (x: number, y: number, i: number) => {
    const L = 22;
    const ux = dx / Math.hypot(dx, 1), uy = 1 / Math.hypot(dx, 1);
    return <line key={i} x1={x} y1={y} x2={x + ux * L} y2={y + uy * L} stroke="var(--fizik)" strokeWidth={2} strokeLinecap="round" opacity={0.7} />;
  };
  const damlalar = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) damlalar.push(cizgi(30 + c * 38 + (r % 2) * 19, 44 + r * 42, r * 6 + c));
  const K = 9, OX = 290, OY = 70;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Araba ${va} m/s; arabadakine göre yağmur ${say(vb)} m/s, düşeyle ${Math.round(th)} derece`}>
      <g>{damlalar}</g>
      <line x1={10} x2={230} y1={196} y2={196} stroke="var(--ink)" strokeWidth={2} />
      <Araba x={120} y={190} renk="var(--c1)" olcek={1.8} />
      {va > 0 && <Ok x1={92} y1={214} x2={92 + va * 6} y2={214} renk="var(--c1)" kalin={2.5} />}
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Arabadakinin gördüğü yağmur</text>
      <g>
        <Ok x1={OX} y1={OY} x2={OX} y2={OY + 8 * K} renk="var(--muted)" kalin={2} />
        {va > 0 && <Ok x1={OX} y1={OY + 8 * K} x2={OX - va * K} y2={OY + 8 * K} renk="var(--c1)" kalin={2} />}
        <Ok x1={OX} y1={OY} x2={OX - va * K} y2={OY + 8 * K} renk="var(--c2)" kalin={2.5} />
        <text x={OX + 6} y={OY + 40} fontSize={11.5} fontWeight={700} fill="var(--muted)">8</text>
        {va > 0 && <text x={OX - (va * K) / 2} y={OY + 8 * K + 16} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="middle">{va}</text>}
      </g>
      <text x={330} y={196} fontSize={12.5} fontWeight={800} fill="var(--c2)" textAnchor="end">{say(vb)} m/s</text>
      <text x={330} y={214} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">düşeyle {Math.round(th)}°</text>
    </svg>
  );
}

/* ---------- İş, enerji ve güç ---------- */

// Kutu iple çekilir: s.F (N), s.d (m), açı v.a ya da s.aci. W = F·d·cosθ.
function IsAci({ s, v }: SahneProps) {
  const F = Number(s.F ?? 50), d = Number(s.d ?? 4), a = v.a ?? Number(s.aci ?? 0);
  const c = Math.cos(a * RAD), W = F * d * (Math.abs(c) < 1e-9 ? 0 : c);
  const Y = 160, X1 = 46, PXM = 40, X2 = X1 + d * PXM, L = 90;
  const kx = X2 + 32, ky = Y - 20, ux = Math.cos(a * RAD), uy = -Math.sin(a * RAD);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${F} newton, ${a} derece, ${d} metre: iş ${say(W)} joule`}>
      <line x1={10} x2={330} y1={Y} y2={Y} stroke="var(--ink)" strokeWidth={2} />
      <rect x={X1 - 24} y={Y - 40} width={56} height={40} rx={4} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 4" />
      <rect x={X2 - 24} y={Y - 40} width={56} height={40} rx={4} fill="var(--c4)" />
      <Ok x1={X1 + 4} y1={Y + 22} x2={X2 + 4} y2={Y + 22} renk="var(--muted)" kalin={2} />
      <text x={(X1 + X2) / 2 + 4} y={Y + 42} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">yer değiştirme d = {d} m</text>
      <Ok x1={kx} y1={ky} x2={kx + ux * L} y2={ky + uy * L} renk="var(--c2)" />
      {a > 0 && a < 90 && <line x1={kx + ux * L} y1={ky + uy * L} x2={kx + ux * L} y2={ky} stroke="var(--muted)" strokeDasharray="3 3" />}
      {a < 90 && <Ok x1={kx} y1={ky} x2={kx + ux * L} y2={ky} renk="var(--c3)" kalin={2.5} />}
      {a > 0 && <path d={`M${kx + 26} ${ky} A26 26 0 0 0 ${kx + 26 * ux} ${ky + 26 * uy}`} fill="none" stroke="var(--ink)" strokeWidth={1.2} />}
      <text x={kx + ux * L + (a > 60 ? 8 : 0)} y={ky + uy * L - 8} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor={a > 60 ? "start" : "middle"}>F = {F} N</text>
      {a < 90 && <text x={kx} y={Y + 18} fontSize={11.5} fontWeight={700} fill="var(--c3)">F·cosθ = {say(F * c)} N</text>}
      <text x={14} y={26} fontSize={14} fontWeight={800} fill="var(--ink)">W = {F} · {d} · cos{a}° = {say(W)} J</text>
      {a === 90 && <text x={14} y={46} fontSize={12} fontWeight={700} fill="var(--muted)">Kuvvetin hareket yönünde bileşeni yok</text>}
    </svg>
  );
}

// Kinetik enerji: 1000 kg araba, v.v m/s. Referans: 20 m/s = 200 000 J.
function Ke({ v }: SahneProps) {
  const m = 1000, h = v.v ?? 20, KE = 0.5 * m * h * h, EN = 800000, BX = 30, BW = 280;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`${h} metre bölü saniyede kinetik enerji ${say(KE, 0)} joule`}>
      <line x1={10} x2={330} y1={84} y2={84} stroke="var(--ink)" strokeWidth={2} />
      <Araba x={80} y={78} renk="var(--c1)" olcek={1.6} />
      {h > 0 && <Ok x1={118} y1={56} x2={118 + h * 4} y2={56} renk="var(--c1)" />}
      <text x={124 + h * 4} y={60} fontSize={13} fontWeight={800} fill="var(--c1)">{h} m/s</text>
      <text x={14} y={22} fontSize={14} fontWeight={800} fill="var(--ink)">KE = ½ · 1000 · {h}² = {say(KE, 0)} J</text>
      <Cubuk x={BX} y={132} w={BW} deger={KE} enCok={EN} renk="var(--c2)" ad="Kinetik enerji" />
      <g fontSize={10.5} fill="var(--muted)" textAnchor="middle">
        {[0, 200000, 400000, 600000, 800000].map((e) => (
          <g key={e}>
            <line x1={BX + (e / EN) * BW} x2={BX + (e / EN) * BW} y1={146} y2={152} stroke="var(--muted)" />
            <text x={BX + (e / EN) * BW} y={166}>{e / 1000}</text>
          </g>
        ))}
        <text x={BX + BW} y={182} textAnchor="end">bin J</text>
      </g>
      <text x={170} y={206} fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">20 m/s'de 200 000 J</text>
    </svg>
  );
}

// 2 kg top 5 m'den bırakılır (sure 2). Gerçek düşme süresi √(2h/g) ≈ 1,01 s.
function Dusme({ t, oynuyor, s }: SahneProps) {
  const m = 2, H = 5, top = m * G * H, sure = Number(s.sure ?? 2), u = ilerleme(t, oynuyor, sure);
  const T = u * Math.sqrt((2 * H) / G), y = Math.min(H, 0.5 * G * T * T), h = H - y, hiz = G * T;
  const PE = m * G * h, KE = top - PE;
  const Y0 = 50, Y1 = 206, py = Y0 + (y / H) * (Y1 - Y0 - 10);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Top ${say(h)} metrede: potansiyel ${say(PE)} J, kinetik ${say(KE)} J`}>
      <line x1={10} x2={150} y1={Y1} y2={Y1} stroke="var(--ink)" strokeWidth={2} />
      <line x1={40} x2={40} y1={Y0} y2={Y1} stroke="var(--line-2)" strokeWidth={1.5} />
      <g fontSize={10.5} fill="var(--muted)" textAnchor="end">
        {[0, 1, 2, 3, 4, 5].map((k) => <text key={k} x={34} y={Y1 - 10 - (k / H) * (Y1 - Y0 - 10) + 4}>{k} m</text>)}
      </g>
      <circle cx={90} cy={py} r={10} fill="var(--c2)" />
      <text x={14} y={26} fontSize={13} fontWeight={800} fill="var(--ink)">2 kg top · {say(h)} m · {say(hiz)} m/s</text>
      <Cubuk x={170} y={88} w={150} deger={PE} enCok={top} renk="var(--c1)" ad={`Potansiyel: ${say(PE)} J`} />
      <Cubuk x={170} y={136} w={150} deger={KE} enCok={top} renk="var(--c2)" ad={`Kinetik: ${say(KE)} J`} />
      <Cubuk x={170} y={184} w={150} deger={top} enCok={top} renk="var(--ink)" ad={`Toplam: ${say(top)} J`} />
    </svg>
  );
}

// Kaydırak, 20 kg çocuk, 3 m yükseklik (sure 3). v.s: sürtünme (0/1). Sürtünmede enerjinin %60'ı ısıya döner.
function Kaydirak({ v, t, oynuyor, s }: SahneProps) {
  const m = 20, H = 3, top = m * G * H, srt = v.s === 1, sure = Number(s.sure ?? 3);
  const u = ilerleme(t, oynuyor, sure), ub = srt ? 1 : 0.62, p = Math.min(1, (u / ub) ** 2);
  const yuk = (k: number) => 1 - (1 - Math.cos(Math.PI * k)) / 2; // yükseklik oranı
  const X = (k: number) => 40 + 200 * k, Yk = (k: number) => 190 - 130 * yuk(k);
  const pts = Array.from({ length: 21 }, (_, i) => `${X(i / 20)},${Yk(i / 20)}`).join(" ");
  const f = yuk(p), PE = top * f, isi = srt ? 0.6 * top * (1 - f) : 0, KE = top - PE - isi, hiz = Math.sqrt((2 * KE) / m);
  const bx = X(p), by = Yk(p);
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Kaydırak, sürtünme ${srt ? "var" : "yok"}: kinetik ${Math.round(KE)} J, ısı ${Math.round(isi)} J`}>
      <line x1={14} x2={330} y1={190} y2={190} stroke="var(--ink)" strokeWidth={1.5} />
      <polyline points={pts} fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
      <line x1={40} x2={40} y1={60} y2={190} stroke="var(--ink)" strokeWidth={2} />
      {srt && <polyline points={pts} fill="none" stroke="var(--c4)" strokeWidth={6} opacity={0.25 + 0.5 * p} />}
      <circle cx={bx} cy={by - 11} r={10} fill="var(--c2)" />
      <text x={14} y={24} fontSize={13} fontWeight={800} fill="var(--ink)">Sürtünme {srt ? "var" : "yok"} · hız {say(hiz)} m/s</text>
      <Cubuk x={200} y={70} w={120} deger={PE} enCok={top} renk="var(--c1)" ad={`Potansiyel ${Math.round(PE)} J`} />
      <Cubuk x={200} y={108} w={120} deger={KE} enCok={top} renk="var(--c2)" ad={`Kinetik ${Math.round(KE)} J`} />
      <Cubuk x={200} y={146} w={120} deger={isi} enCok={top} renk="var(--c4)" ad={`Isı ${Math.round(isi)} J`} />
      <text x={170} y={232} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">Toplam enerji hep {Math.round(top)} J</text>
    </svg>
  );
}

// Merdivende güç: 50 kg, 3 m; v.t çıkış süresi (s). W = m·g·h = 1470 J, P = W / t.
function Guc({ v }: SahneProps) {
  const W = 50 * G * 3, sn = v.t ?? 10, P = W / sn;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`3 metrelik merdiven ${sn} saniyede: güç ${Math.round(P)} watt`}>
      <polyline points={`10,210 ${Array.from({ length: 7 }, (_, i) => `${40 + i * 22},${210 - i * 20} ${62 + i * 22},${210 - i * 20} ${62 + i * 22},${190 - i * 20}`).join(" ")} 220,70`} fill="none" stroke="var(--ink)" strokeWidth={2.5} strokeLinejoin="round" />
      <Kisi x={206} y={70} s={0.6} renk="var(--c2)" />
      <Ok x1={238} y1={208} x2={238} y2={74} renk="var(--muted)" kalin={1.8} />
      <text x={246} y={146} fontSize={12} fontWeight={700} fill="var(--muted)">3 m</text>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">W = 50 · 9,8 · 3 = {say(W)} J</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill="var(--c2)">P = {say(W)} / {sn} = {say(P, 0)} W</text>
      <Cubuk x={262} y={200} w={68} deger={P} enCok={W / 2} renk="var(--c2)" ad="güç" />
    </svg>
  );
}

// Yay ve F–x grafiği: k = 200 N/m, v.x uzama (cm). Alan = ½·k·x².
function Yay({ v }: SahneProps) {
  const k = 200, xc = v.x ?? 0, x = xc / 100, F = k * x, E = 0.5 * k * x * x;
  const D = 30, Y = 64, L0 = 120, L = L0 + xc * 4, n = 10;
  const zig = Array.from({ length: n + 1 }, (_, i) => `${D + 10 + (i * (L - 20)) / n},${Y + (i === 0 || i === n ? 0 : i % 2 ? -10 : 10)}`).join(" ");
  const GX0 = 70, GY0 = 216, GW = 200, GH = 84, gx = (m: number) => GX0 + (m / 0.2) * GW, gy = (f: number) => GY0 - (f / 40) * GH;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Yay ${xc} santimetre uzadı: kuvvet ${say(F)} newton, enerji ${say(E, 2)} joule`}>
      <line x1={D} x2={D} y1={Y - 26} y2={Y + 26} stroke="var(--ink)" strokeWidth={4} />
      <polyline points={`${D},${Y} ${zig} ${D + L},${Y}`} fill="none" stroke="var(--c1)" strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={D + L} y={Y - 12} width={14} height={24} rx={3} fill="var(--c1)" />
      {F > 0 && <Ok x1={D + L + 16} y1={Y} x2={D + L + 16 + F * 1.6} y2={Y} renk="var(--c2)" />}
      {F > 0 && <text x={D + L + 16 + F * 0.8} y={Y - 14} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{say(F)} N</text>}
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">k = 200 N/m · uzama {xc} cm</text>
      <line x1={GX0} x2={GX0 + GW + 10} y1={GY0} y2={GY0} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={GX0} x2={GX0} y1={GY0} y2={GY0 - GH - 10} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={gx(0)} y1={gy(0)} x2={gx(0.2)} y2={gy(40)} stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="4 4" />
      {x > 0 && <polygon points={`${gx(0)},${gy(0)} ${gx(x)},${gy(0)} ${gx(x)},${gy(F)}`} fill="var(--c4)" opacity={0.55} stroke="var(--c4)" />}
      <text x={GX0 - 6} y={GY0 - GH + 4} fontSize={10.5} fill="var(--muted)" textAnchor="end">40 N</text>
      <text x={gx(0.2)} y={GY0 + 14} fontSize={10.5} fill="var(--muted)" textAnchor="middle">20 cm</text>
      <text x={GX0 - 6} y={GY0 - GH - 12} fontSize={11} fontWeight={700} fill="var(--ink)">F</text>
      <text x={GX0 + GW + 14} y={GY0 + 4} fontSize={11} fontWeight={700} fill="var(--ink)">x</text>
      <text x={330} y={180} fontSize={12.5} fontWeight={800} fill="#b7800d" textAnchor="end">alan = ½·k·x²</text>
      <text x={330} y={198} fontSize={12.5} fontWeight={800} fill="#b7800d" textAnchor="end">= {say(E, 2)} J</text>
    </svg>
  );
}

export const FIZIK5: Record<string, SahneKaydi> = {
  "fiz5-gozlemci": { C: Gozlemci },
  "fiz5-iki-arac": { C: IkiArac },
  "fiz5-merdiven": { C: Merdiven },
  "fiz5-nehir": {
    C: Nehir,
    geri: (v, s) => {
      const h = nehirHesap(s, v);
      if (Math.abs(h.kay) < 0.5) return null;
      return {
        baslik: "Henüz tam karşı değil",
        metin: `Kayık ${say(Math.abs(h.kay))} m ${h.kay > 0 ? "aşağı sürüklendi: burnu akıntıya karşı biraz daha çevir" : "yukarı kaçtı: burnu biraz daha az çevir"}. Akıntıyı dengelemek için kayığın akıntıya karşı bileşeni 3 m/s olmalı.`,
      };
    },
  },
  "fiz5-yagmur": { C: Yagmur },
  "fiz5-is": { C: IsAci },
  "fiz5-ke": { C: Ke },
  "fiz5-dusme": { C: Dusme },
  "fiz5-kaydirak": { C: Kaydirak },
  "fiz5-guc": { C: Guc },
  "fiz5-yay": { C: Yay },
};
