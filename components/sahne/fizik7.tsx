"use client";
// Fizik sahneleri (tork, denge ve kütle merkezi; çembersel hareket): kapı ve kuvvet kolu, açılı kuvvet ve bileşenleri,
// tahterevalli, iki destekli çubuk, kütle merkezinden asılan çubuk, eğilen tahtada devrilen kutular; dönen top ve hız
// vektörü, tamburun frekansı, dönme dolap, ipi kopan taş, virajdaki arabanın merkezcil kuvveti, sürtünmeli viraj, patenci.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül; 10 000 ve üstü boşlukla gruplanır (kartlardaki gibi). */
const say = (x: number, d = 1) => {
  const [a, b] = x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).split(",");
  const g = Math.abs(x) >= 10000 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : a;
  return (b ? `${g},${b}` : g).replace("-", "−");
};
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const RAD = Math.PI / 180;

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

/** Destek üçgeni: (x, y) tepe noktası. */
const Destek = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x} ${y} L${x - 12 * s} ${y + 20 * s} L${x + 12 * s} ${y + 20 * s} Z`} fill="var(--ink)" />
);

/* ---------- Tork ---------- */

// Kapı (yukarıdan): menteşe solda, 1 m'lik kapı. 12 N·m için gereken kuvvet F = 12 / d; v.d onda bir metre.
function Kapi({ v }: SahneProps) {
  const d = sinir(v.d ?? 2, 1, 10) / 10, tau = 12, F = tau / d, yeter = F <= 20 + 1e-9;
  const HX = 44, Y = 112, PX = 260, px = HX + d * PX, ok = sinir(F * 1.4, 14, 92);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Kapı: menteşeden ${say(d)} m uzakta itince ${say(F)} N gerekiyor`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Gereken tork: τ = {tau} N·m</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={yeter ? "var(--good)" : "var(--c2)"}>F = τ / d = {tau} / {say(d)} = {say(F)} N</text>
      <rect x={HX} y={Y - 5} width={PX} height={10} rx={3} fill="var(--c4)" opacity={0.85} />
      <circle cx={HX} cy={Y} r={7} fill="var(--ink)" />
      <text x={HX} y={Y + 26} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">menteşe</text>
      <Ok x1={px} y1={Y - 12 - ok} x2={px} y2={Y - 7} renk="var(--c2)" />
      <text x={px > 250 ? px - 8 : px + 8} y={Y - 20 - ok / 2} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor={px > 250 ? "end" : "start"}>{say(F)} N</text>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <line x1={HX} x2={px} y1={Y + 42} y2={Y + 42} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={HX} x2={HX} y1={Y + 37} y2={Y + 47} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={px} x2={px} y1={Y + 37} y2={Y + 47} stroke="var(--muted)" strokeWidth={1.2} />
        <text x={(HX + px) / 2} y={Y + 60}>d = {say(d)} m</text>
      </g>
      <text x={170} y={222} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={yeter ? "var(--good)" : "var(--muted)"}>
        {yeter ? "20 N yetiyor" : "Elinin gücü 20 N: bu kadarı yetmez"}
      </text>
    </svg>
  );
}

// Açılı kuvvet: dönme noktası solda, r uzunluğunda kol; ucuna s.F (N), kolla v.theta açısı yaparak.
function Aci({ v, s }: SahneProps) {
  const F = Number(s.F ?? 20), r = Number(s.r ?? 0.5), th = sinir(v.theta ?? 30, 0, 180), nokta = String(s.nokta ?? "dönme noktası");
  const sn = Math.sin(th * RAD), cs = Math.cos(th * RAD);
  const tau = F * r * (Math.abs(sn) < 1e-9 ? 0 : sn);
  const OX = 64, OY = 158, EX = 254, EY = 158, L = 84;
  const fx = EX + cs * L, fy = EY - sn * L;
  // kuvvet doğrultusunun dönme noktasına en yakın noktası (kuvvet kolu)
  const ux = cs, uy = -sn, k = (OX - EX) * ux + (OY - EY) * uy, ax = EX + ux * k, ay = EY + uy * k;
  const kol = Math.hypot(ax - OX, ay - OY);
  const ozel = th === 0 || th === 180;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${F} N kuvvet kolla ${th} derece açı yapıyor; tork ${say(tau, 2)} N·m`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">τ = F·r·sinθ = {F} · {say(r)} · sin{th}°</text>
      <text x={14} y={42} fontSize={13} fontWeight={800} fill={tau > 0 ? "var(--c2)" : "var(--muted)"}>τ = {say(tau, 2)} N·m</text>
      {kol > 3 && <line x1={OX} y1={OY} x2={ax} y2={ay} stroke="var(--muted)" strokeWidth={1.3} strokeDasharray="4 4" />}
      {kol > 3 && <line x1={EX} y1={EY} x2={ax} y2={ay} stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 4" opacity={0.6} />}
      <rect x={OX} y={OY - 5} width={EX - OX} height={10} rx={4} fill="var(--line-2)" />
      <circle cx={OX} cy={OY} r={8} fill="var(--ink)" />
      <text x={OX} y={OY + 28} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{nokta}</text>
      <text x={(OX + EX) / 2} y={OY + 28} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">r = {say(r)} m</text>
      {!ozel && th !== 90 && (
        <g>
          <Ok x1={EX} y1={EY} x2={EX + cs * L} y2={EY} renk="var(--muted)" kalin={2} />
          <Ok x1={EX} y1={EY} x2={EX} y2={EY - sn * L} renk="var(--c1)" kalin={2.5} />
          <text x={EX - 8} y={EY - sn * L + 4} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="end">F·sinθ</text>
        </g>
      )}
      <Ok x1={EX} y1={th === 180 ? EY - 10 : EY} x2={fx} y2={th === 180 ? fy - 10 : fy} renk="var(--c2)" kalin={3.5} />
      <text x={sinir(fx + (cs >= 0 ? 6 : -6), 20, 330)} y={th === 180 ? fy - 18 : cs < 0 && sn > 0.4 ? fy + 18 : fy - 8} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor={cs >= 0 ? "start" : "end"}>F = {F} N</text>
      <text x={14} y={226} fontSize={12.5} fontWeight={800} fill={ozel ? "var(--c2)" : "var(--muted)"}>
        {ozel ? "Doğrultu dönme noktasından geçiyor: d = 0" : `Kuvvet kolu d = r·sinθ = ${say(r * sn, 2)} m`}
      </text>
    </svg>
  );
}

/* ---------- Denge ---------- */

// Tahterevalli: solda 300 N, 2 m; sağda 400 N, v.d × 0,25 m.
function Tahterevalli({ v }: SahneProps) {
  const d = sinir(v.d ?? 12, 1, 12) * 0.25, tL = 300 * 2, tR = 400 * d;
  const cx = 170, cy = 140, PX = 50;
  const aci = sinir(((tR - tL) / tL) * 12, -10, 10), denge = Math.abs(tR - tL) < 1e-6;
  const xL = cx - 2 * PX, xR = cx + d * PX;
  const Cocuk = ({ x, w, ad, renk }: { x: number; w: number; ad: string; renk: string }) => (
    <g>
      <circle cx={x} cy={cy - 4 - w - 12} r={10} fill={renk} />
      <rect x={x - w / 2} y={cy - 4 - w} width={w} height={w} rx={6} fill={renk} />
      <text x={x} y={cy - 4 - w / 2 + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">{ad}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Tahterevalli: 300 N 2 m, 400 N ${say(d, 2)} m; ${denge ? "dengede" : tR > tL ? "sağ taraf iniyor" : "sol taraf iniyor"}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--c1)">sol: 300 · 2 = {tL} N·m</text>
      <text x={326} y={22} fontSize={13} fontWeight={800} fill="var(--c2)" textAnchor="end">sağ: 400 · {say(d, 2)} = {say(tR)} N·m</text>
      <line x1={14} x2={326} y1={cy + 24} y2={cy + 24} stroke="var(--line-2)" strokeWidth={2} />
      <Destek x={cx} y={cy + 4} />
      <g transform={`rotate(${aci} ${cx} ${cy})`}>
        <rect x={cx - 156} y={cy - 4} width={312} height={8} rx={4} fill="var(--c4)" />
        <Cocuk x={xL} w={30} ad="300" renk="var(--c1)" />
        <Cocuk x={xR} w={36} ad="400" renk="var(--c2)" />
      </g>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={(xL + cx) / 2} y={cy + 46}>2 m</text>
        <text x={(xR + cx) / 2} y={cy + 46}>{say(d, 2)} m</text>
      </g>
      <text x={170} y={224} fontSize={13} fontWeight={800} textAnchor="middle" fill={denge ? "var(--good)" : "var(--muted)"}>
        {denge ? "Dengede: Στ = 0" : tR > tL ? "Sağ taraf ağır basıyor" : "Sol taraf ağır basıyor"}
      </text>
    </svg>
  );
}

// İki destekli çubuk: 4 m, 40 N; 60 N'luk yük A'dan v.x × 0,5 m uzakta. N_B = (40·2 + 60·x)/4.
function Cubuk({ v }: SahneProps) {
  const x = sinir(v.x ?? 6, 0, 8) * 0.5, NB = (40 * 2 + 60 * x) / 4, NA = 100 - NB;
  const AX = 50, BX = 290, PX = 60, Y = 124, yx = AX + x * PX, olc = 1.1;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Yük A'dan ${say(x)} m uzakta; A ${say(NA)} N, B ${say(NB)} N taşıyor`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">A'ya göre: N<tspan fontSize={9} dy={3}>B</tspan><tspan dy={-3}> · 4 = 40 · 2 + 60 · {say(x)}</tspan></text>
      <rect x={AX} y={Y - 5} width={BX - AX} height={10} rx={3} fill="var(--line-2)" />
      <Destek x={AX} y={Y + 5} />
      <Destek x={BX} y={Y + 5} />
      <text x={AX} y={Y + 42} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">A</text>
      <text x={BX} y={Y + 42} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">B</text>
      <Ok x1={170} y1={Y + 5} x2={170} y2={Y + 5 + 40 * olc} renk="var(--muted)" kalin={2.5} />
      <text x={176} y={Y + 5 + 40 * olc} fontSize={11.5} fontWeight={700} fill="var(--muted)">40 N</text>
      <rect x={yx - 15} y={Y - 35} width={30} height={30} rx={4} fill="var(--c4)" />
      <text x={yx} y={Y - 16} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">60 N</text>
      <Ok x1={AX + 14} y1={Y - 6} x2={AX + 14} y2={Y - 6 - NA * olc * 0.9} renk="var(--c1)" />
      <Ok x1={BX - 14} y1={Y - 6} x2={BX - 14} y2={Y - 6 - NB * olc * 0.9} renk="var(--c2)" />
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={204} fill="var(--c1)">N<tspan fontSize={9} dy={3}>A</tspan><tspan dy={-3}> = {say(NA)} N</tspan></text>
        <text x={326} y={204} fill="var(--c2)" textAnchor="end">N<tspan fontSize={9} dy={3}>B</tspan><tspan dy={-3}> = {say(NB)} N</tspan></text>
        <text x={170} y={226} fill="var(--muted)" textAnchor="middle" fontSize={11.5}>yük A'dan {say(x)} m uzakta</text>
      </g>
    </svg>
  );
}

// Kütle merkezi: hafif 4 m'lik çubuk; solda 2 kg (x = 0), sağda v.m kg (x = 4 m). 3 m'deki noktadan asılı.
function KutleMerkezi({ v }: SahneProps) {
  const m = sinir(v.m ?? 2, 1, 10), xkm = (m * 4) / (2 + m), denge = Math.abs(xkm - 3) < 1e-9;
  const X0 = 64, PX = 52, Y = 118, hx = X0 + 3 * PX;
  const aci = sinir((m - 6) * 2.5, -14, 14);
  const r = (k: number) => 8 + 3.2 * Math.sqrt(k);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Sağdaki kütle ${m} kg; kütle merkezi ${say(xkm, 2)} m'de; ${denge ? "çubuk yatay" : "çubuk eğik"}`}>
      <text x={14} y={22} fontSize={12.5} fontWeight={800} fill="var(--ink)">x<tspan fontSize={9} dy={3}>KM</tspan><tspan dy={-3}> = (2·0 + {m}·4) / (2 + {m}) = {say(xkm, 2)} m</tspan></text>
      <line x1={hx - 30} x2={hx + 30} y1={44} y2={44} stroke="var(--ink)" strokeWidth={3} />
      <line x1={hx} x2={hx} y1={44} y2={Y} stroke="var(--ink)" strokeWidth={1.6} />
      <g transform={`rotate(${aci} ${hx} ${Y})`}>
        <rect x={X0} y={Y - 3} width={4 * PX} height={6} rx={3} fill="var(--line-2)" />
        <circle cx={X0} cy={Y} r={r(2)} fill="var(--c1)" />
        <text x={X0} y={Y + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">2</text>
        <circle cx={X0 + 4 * PX} cy={Y} r={r(m)} fill="var(--c2)" />
        <text x={X0 + 4 * PX} y={Y + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">{m}</text>
        <path d={`M${X0 + xkm * PX} ${Y + 6} l-7 12 h14 Z`} fill="var(--c3)" />
        <text x={X0 + xkm * PX} y={Y + 32} fontSize={11.5} fontWeight={800} fill="var(--c3)" textAnchor="middle">KM</text>
      </g>
      <g fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {[0, 1, 2, 3, 4].map((k) => <text key={k} x={X0 + k * PX} y={186}>{k} m</text>)}
      </g>
      <text x={hx} y={204} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">↑ askı noktası</text>
      <text x={170} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill={denge ? "var(--good)" : "var(--muted)"}>
        {denge ? "Yatay: askı noktası kütle merkezinde" : xkm > 3 ? "Sağ taraf iniyor" : "Sol taraf iniyor"}
      </text>
    </svg>
  );
}

// Eğilen tahta: aynı tabanlı (40) basık (yükseklik 40) ve uzun (100) kutu. Oynatınca eğim 0'dan 35°'ye çıkar.
const KUTULAR = [
  { p: 200, w: 40, h: 40, renk: "var(--c1)", ad: "basık" },
  { p: 110, w: 40, h: 100, renk: "var(--c2)", ad: "uzun" },
];
function Devrilme({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = ilerleme(t, oynuyor, sure), a = 35 * u * RAD;
  const O = { x: 34, y: 206 }, e = { x: Math.cos(a), y: -Math.sin(a) }, n = { x: -Math.sin(a), y: -Math.cos(a) };
  const dunya = (p: number, q: number) => ({ x: O.x + p * e.x + q * n.x, y: O.y + p * e.y + q * n.y });
  const kutular = KUTULAR.map((k) => {
    const sinirAci = Math.atan(k.w / 2 / (k.h / 2));
    const devrildi = a > sinirAci;
    const f = devrildi ? Math.min(Math.PI / 2, (a - sinirAci) * 10) : 0;
    // devrilme alt (aşağı yönlü) köşe etrafında
    const don = (dp: number, q: number) => dunya(k.p + dp * Math.cos(f) - q * Math.sin(f), dp * Math.sin(f) + q * Math.cos(f));
    const koseler = [don(0, 0), don(k.w, 0), don(k.w, k.h), don(0, k.h)];
    const km = don(k.w / 2, k.h / 2);
    const t0 = dunya(k.p, 0), t1 = dunya(k.p + k.w, 0);
    const icinde = !devrildi;
    return { ...k, devrildi, koseler, km, t0, t1, icinde, sinir: sinirAci / RAD };
  });
  const uc = dunya(290, 0);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Eğim ${Math.round(35 * u)} derece; ${kutular.filter((k) => k.devrildi).map((k) => k.ad).join(" ve ") || "hiçbir kutu"} devrildi`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Eğim: {Math.round(35 * u)}°</text>
      <line x1={O.x} y1={O.y} x2={uc.x} y2={uc.y} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      <line x1={14} x2={326} y1={O.y + 3} y2={O.y + 3} stroke="var(--line-2)" strokeWidth={2} />
      {kutular.map((k) => (
        <g key={k.ad}>
          <line x1={k.t0.x} y1={k.t0.y} x2={k.t1.x} y2={k.t1.y} stroke={k.icinde ? "var(--good)" : "var(--c2)"} strokeWidth={5} strokeLinecap="round" />
          <polygon points={k.koseler.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")} fill={k.renk} opacity={0.88} />
          <circle cx={k.km.x} cy={k.km.y} r={4} fill="var(--ink)" />
          <line x1={k.km.x} y1={k.km.y} x2={k.km.x} y2={Math.min(O.y, k.km.y + 120)} stroke="var(--ink)" strokeWidth={1.3} strokeDasharray="4 3" />
        </g>
      ))}
      <g fontSize={12} fontWeight={800}>
        <text x={14} y={44} fill="var(--c1)">basık: {kutular[0].devrildi ? "devrildi" : "duruyor"}</text>
        <text x={14} y={62} fill="var(--c2)">uzun: {kutular[1].devrildi ? "devrildi" : "duruyor"}</text>
      </g>
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">kesikli çizgi: ağırlık merkezinin düşeyi</text>
    </svg>
  );
}

/* ---------- Çembersel hareket ---------- */

// Düzgün çembersel hareket: bir tur (sure). Hız oku teğet, ivme oku merkeze doğru; geçmiş hız okları soluk.
function Cember({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), CX = 170, CY = 130, R = 70;
  const nokta = (b: number) => ({ x: CX + R * Math.sin(b), y: CY - R * Math.cos(b), vx: Math.cos(b), vy: Math.sin(b) });
  const b = u * 2 * Math.PI, p = nokta(b);
  const izler = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (k * Math.PI) / 4).filter((x) => x < b - 0.05);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Sabit süratle dönen top; hız oku teğet, yönü sürekli değişiyor">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line-2)" strokeWidth={2} strokeDasharray="5 5" />
      <circle cx={CX} cy={CY} r={3.5} fill="var(--ink)" />
      {izler.map((x) => {
        const q = nokta(x);
        return <g key={x} opacity={0.3}><Ok x1={q.x} y1={q.y} x2={q.x + q.vx * 44} y2={q.y + q.vy * 44} renk="var(--c1)" kalin={2} /></g>;
      })}
      <Ok x1={p.x} y1={p.y} x2={p.x + p.vx * 50} y2={p.y + p.vy * 50} renk="var(--c1)" />
      <Ok x1={p.x} y1={p.y} x2={p.x + (CX - p.x) * 0.45} y2={p.y + (CY - p.y) * 0.45} renk="var(--c2)" kalin={2.5} />
      <circle cx={p.x} cy={p.y} r={9} fill="var(--c4)" />
      <g fontSize={12} fontWeight={800}>
        <text x={14} y={22} fill="var(--c1)">hız: 5 m/s, yönü değişiyor</text>
        <text x={14} y={42} fill="var(--c2)">ivme: merkeze doğru</text>
      </g>
      <text x={170} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">soluk oklar: aynı topun önceki hızları</text>
    </svg>
  );
}

// Tambur: v.rpm dakikada tur. Bir saniyedeki turlar nokta olarak.
function Tambur({ v }: SahneProps) {
  const rpm = sinir(v.rpm ?? 600, 60, 3000), f = rpm / 60, T = 1 / f, n = Math.round(f);
  const sutun = 10;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Dakikada ${rpm} tur: f = ${say(f)} Hz, T = ${say(T, 3)} s`}>
      <g>
        <circle cx={70} cy={92} r={46} fill="none" stroke="var(--ink)" strokeWidth={3} />
        <circle cx={70} cy={92} r={34} fill="var(--fizik-soft)" />
        <g className="ad-don" style={{ animationDuration: `${sinir(12 / f, 0.4, 3)}s`, transformOrigin: "70px 92px" }}>
          <line x1={70} y1={92} x2={70} y2={60} stroke="var(--c2)" strokeWidth={4} strokeLinecap="round" />
          <circle cx={70} cy={60} r={5} fill="var(--c2)" />
        </g>
      </g>
      <g fontSize={13} fontWeight={800}>
        <text x={136} y={64} fill="var(--ink)">{rpm} tur / dakika</text>
        <text x={136} y={88} fill="var(--c2)">f = {rpm} / 60 = {say(f)} Hz</text>
        <text x={136} y={112} fill="var(--c1)">T = 1 / f = {say(T, 3)} s</text>
      </g>
      <text x={14} y={168} fontSize={11.5} fontWeight={700} fill="var(--muted)">1 saniyedeki turlar:</text>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={20 + (i % sutun) * 15} cy={184 + Math.floor(i / sutun) * 15} r={5} fill="var(--c2)" />
      ))}
      <text x={326} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">(dönüş hızı çizimde yavaşlatıldı)</text>
    </svg>
  );
}

// Dönme dolap: T = 20 s; iç koltuk 4 m, dış koltuk 8 m. Oynatınca bir tur; geçen yol yaylarla.
function Dolap({ t, oynuyor, s, secim }: SahneProps) {
  const sure = Number(s.sure ?? 6), u = ilerleme(t, oynuyor, sure), CX = 170, CY = 120, Ri = 44, Rd = 88;
  const b = -Math.PI / 2 + u * 2 * Math.PI;
  const yay = (R: number) => {
    if (u <= 0.002) return "";
    if (u >= 0.999) return `M${CX} ${CY - R} A${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R}`;
    const x = CX + R * Math.cos(b), y = CY + R * Math.sin(b);
    return `M${CX} ${CY - R} A${R} ${R} 0 ${u > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  };
  const w = (2 * Math.PI) / 20, acik = secim !== null;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Dönme dolap: iç koltuk 4 m, dış koltuk 8 m; ikisi de 20 saniyede bir tur atar">
      <circle cx={CX} cy={CY} r={Rd} fill="none" stroke="var(--line-2)" strokeWidth={2} />
      <circle cx={CX} cy={CY} r={Ri} fill="none" stroke="var(--line-2)" strokeWidth={2} />
      <path d={yay(Rd)} fill="none" stroke="var(--c2)" strokeWidth={4} strokeLinecap="round" />
      <path d={yay(Ri)} fill="none" stroke="var(--c1)" strokeWidth={4} strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={CX + Rd * Math.cos(b)} y2={CY + Rd * Math.sin(b)} stroke="var(--ink)" strokeWidth={2} />
      <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
      <circle cx={CX + Ri * Math.cos(b)} cy={CY + Ri * Math.sin(b)} r={8} fill="var(--c1)" />
      <circle cx={CX + Rd * Math.cos(b)} cy={CY + Rd * Math.sin(b)} r={9} fill="var(--c2)" />
      <g fontSize={12} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">T = 20 s · ω = 2π / 20 ≈ {say(w, 2)} rad/s</text>
        <text x={14} y={226} fill="var(--c1)">iç (4 m){acik ? `: v ≈ ${say(w * 4, 2)} m/s` : ""}</text>
        <text x={326} y={226} fill="var(--c2)" textAnchor="end">dış (8 m){acik ? `: v ≈ ${say(w * 8, 2)} m/s` : ""}</text>
      </g>
    </svg>
  );
}

// İpi kopan taş (yukarıdan): saat yönünde döner; en kuzeyde (doğuya giderken) ip kopar, taş teğet boyunca düz gider.
function Ip({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 5), u = ilerleme(t, oynuyor, sure), CX = 140, CY = 132, R = 66;
  const kop = 0.5, kopti = u > kop;
  const b = -Math.PI + (Math.min(u, kop) / kop) * Math.PI; // alttan (−π) en kuzeye (0)
  const p = kopti ? { x: CX + (u - kop) * 2 * 168, y: CY - R } : { x: CX + R * Math.sin(b), y: CY - R * Math.cos(b) };
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={kopti ? "İp koptu: taş doğuya, teğet boyunca düz gidiyor" : "Taş ipe bağlı, çember üzerinde dönüyor"}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line-2)" strokeWidth={2} strokeDasharray="5 5" />
      <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
      {kopti && <line x1={CX} y1={CY - R} x2={326} y2={CY - R} stroke="var(--c2)" strokeWidth={1.5} strokeDasharray="3 5" />}
      {!kopti && <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--ink)" strokeWidth={1.8} />}
      {kopti && <line x1={CX} y1={CY} x2={CX + 22} y2={CY - 30} stroke="var(--ink)" strokeWidth={1.8} />}
      <circle cx={sinir(p.x, 0, 318)} cy={p.y} r={9} fill="var(--c4)" />
      <g fontSize={12} fontWeight={800} fill="var(--muted)" textAnchor="middle">
        <text x={300} y={152}>K</text>
        <text x={300} y={200}>G</text>
        <text x={274} y={180}>B</text>
        <text x={326} y={180}>D</text>
        <line x1={300} y1={158} x2={300} y2={188} stroke="var(--muted)" strokeWidth={1.2} />
        <line x1={282} y1={176} x2={318} y2={176} stroke="var(--muted)" strokeWidth={1.2} />
      </g>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{kopti ? "İp koptu!" : "Yukarıdan bakış"}</text>
      <text x={14} y={226} fontSize={12} fontWeight={800} fill={kopti ? "var(--c2)" : "var(--muted)"}>
        {kopti ? "Taş teğet boyunca düz gidiyor" : u > 0 ? "İp gerilmesi taşı merkeze çekiyor" : "Taş dönmeye hazır"}
      </text>
    </svg>
  );
}

// Viraj (yukarıdan): 1000 kg, r = 50 m; hız v.v (m/s). F = m·v²/r merkeze doğru.
function Merkezcil({ v }: SahneProps) {
  const hiz = sinir(v.v ?? 10, 1, 30), F = (1000 * hiz * hiz) / 50;
  const CX = 170, CY = 222, R = 150, ok = sinir((F / 12500) * 120, 6, 124);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Viraj: ${hiz} m/s hızla gereken merkezcil kuvvet ${say(F)} N`}>
      <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="var(--line)" strokeWidth={26} />
      <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#fff" strokeWidth={1.6} strokeDasharray="8 7" />
      <circle cx={CX} cy={CY} r={4} fill="var(--ink)" />
      <text x={CX + 8} y={CY - 4} fontSize={11.5} fontWeight={700} fill="var(--muted)">merkez</text>
      <rect x={CX - 9} y={CY - R - 15} width={18} height={30} rx={5} fill="var(--c1)" transform={`rotate(90 ${CX} ${CY - R})`} />
      <Ok x1={CX + 20} y1={CY - R} x2={CX + 20 + hiz * 3.4} y2={CY - R} renk="var(--c1)" kalin={2.5} />
      <Ok x1={CX} y1={CY - R + 14} x2={CX} y2={CY - R + 14 + ok} renk="var(--c2)" kalin={3.5} />
      <text x={CX + 10} y={CY - R + 14 + ok / 2 + 4} fontSize={12} fontWeight={800} fill="var(--c2)">F</text>
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--c1)">v = {hiz} m/s</text>
        <text x={326} y={22} fill="var(--c2)" textAnchor="end">F = 1000 · {hiz}² / 50 = {say(F)} N</text>
      </g>
    </svg>
  );
}

// Sürtünmeli viraj: araba 15 m/s, r = 50 m. v.mu onda bir. Güvenli hız √(μ·g·r) küçükse araba teğet boyunca savrulur.
const yuzey = (mu: number) => (mu <= 0.15 ? "buzlu yol" : mu <= 0.45 ? "ıslak yol" : "kuru asfalt");
const vMax = (mu: number) => Math.sqrt(mu * 9.8 * 50);
function Viraj({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), mu = sinir(v.mu ?? 3, 1, 10) / 10, vm = vMax(mu), guvenli = vm >= 15;
  const CX = 170, CY = 236, R = 170, a0 = -155 * RAD, a1 = -25 * RAD, ak = a0 + 0.5 * (a1 - a0);
  const yer = (a: number) => ({ x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), dx: -Math.sin(a), dy: Math.cos(a) });
  let p;
  if (guvenli || a0 + u * (a1 - a0) < ak) p = yer(a0 + u * (a1 - a0));
  else {
    const q = yer(ak), yol = (u - 0.5) * R * (a1 - a0);
    p = { x: Math.min(312, q.x + q.dx * yol), y: q.y + q.dy * yol, dx: q.dx, dy: q.dy };
  }
  const aci = (Math.atan2(p.dy, p.dx) * 180) / Math.PI;
  const savruldu = !guvenli && u > 0.5;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`μ = ${say(mu)}: en büyük güvenli hız ${say(vm)} m/s; araba ${guvenli ? "virajı güvenle alır" : "savrulur"}`}>
      <path d={`M${yer(a0).x} ${yer(a0).y} A${R} ${R} 0 0 1 ${yer(a1).x} ${yer(a1).y}`} fill="none" stroke={mu <= 0.15 ? "#dcebf7" : mu <= 0.45 ? "#d5dde8" : "var(--line)"} strokeWidth={30} />
      <path d={`M${yer(a0).x} ${yer(a0).y} A${R} ${R} 0 0 1 ${yer(a1).x} ${yer(a1).y}`} fill="none" stroke="#fff" strokeWidth={1.6} strokeDasharray="8 7" />
      {savruldu && <line x1={yer(ak).x} y1={yer(ak).y} x2={p.x} y2={p.y} stroke="var(--c2)" strokeWidth={1.5} strokeDasharray="3 5" />}
      <rect x={sinir(p.x, 10, 330) - 15} y={p.y - 9} width={30} height={18} rx={5} fill="var(--c1)" transform={`rotate(${aci} ${sinir(p.x, 10, 330)} ${p.y})`} />
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">{yuzey(mu)}: μ = {say(mu)}</text>
        <text x={14} y={42} fill={guvenli ? "var(--good)" : "var(--c2)"}>güvenli hız ≤ √(μ·g·r) ≈ {say(vm)} m/s</text>
        <text x={326} y={22} fill="var(--c1)" textAnchor="end">araba: 15 m/s</text>
      </g>
      {u >= 1 && (
        <text x={170} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill={guvenli ? "var(--good)" : "var(--c2)"}>
          {guvenli ? "Virajı güvenle aldı" : "Savruldu: sürtünme yetmedi"}
        </text>
      )}
    </svg>
  );
}

// Patenci (yukarıdan): kollar açık I = 4, ω = 2; yarı yolda kollarını çeker, I = 2, ω = 4. Dönüş yavaşlatılarak çizilir.
function Patenci({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), u = ilerleme(t, oynuyor, sure), yari = 0.45;
  const cek = sinir((u - yari) / 0.08, 0, 1); // kolları çekme geçişi
  const w1 = 2.2; // çizim için tur/birim
  const aci = u < yari ? w1 * u : w1 * yari + w1 * (1 + cek) * (u - yari);
  const don = aci * 360;
  const kol = 74 - 50 * cek;
  const I = 4 - 2 * cek, w = 8 / I, CX = 170, CY = 124;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cek >= 1 ? "Kollar kapalı: I = 2, ω = 4 rad/s" : "Kollar açık: I = 4, ω = 2 rad/s"}>
      <circle cx={CX} cy={CY} r={86} fill="none" stroke="var(--line)" strokeWidth={1.5} strokeDasharray="4 6" />
      <g transform={`rotate(${don} ${CX} ${CY})`}>
        <line x1={CX - kol} y1={CY} x2={CX + kol} y2={CY} stroke="var(--c5)" strokeWidth={8} strokeLinecap="round" />
        <circle cx={CX - kol} cy={CY} r={7} fill="var(--c5)" />
        <circle cx={CX + kol} cy={CY} r={7} fill="var(--c5)" />
        <ellipse cx={CX} cy={CY} rx={22} ry={15} fill="var(--c1)" />
        <circle cx={CX} cy={CY - 4} r={10} fill="var(--c4)" />
      </g>
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={22} fill="var(--ink)">L = I · ω = {say(I, 1)} · {say(w, 1)} = 8</text>
        <text x={14} y={226} fill="var(--muted)">{cek >= 1 ? "Kollar gövdede: I = 2 kg·m²" : "Kollar açık: I = 4 kg·m²"}</text>
        <text x={326} y={226} fill="var(--c5)" textAnchor="end">ω = {say(w, 1)} rad/s</text>
      </g>
    </svg>
  );
}

export const FIZIK7: Record<string, SahneKaydi> = {
  "fiz7-kapi": { C: Kapi },
  "fiz7-aci": { C: Aci },
  "fiz7-tahterevalli": { C: Tahterevalli },
  "fiz7-cubuk": { C: Cubuk },
  "fiz7-km": { C: KutleMerkezi },
  "fiz7-devrilme": { C: Devrilme },
  "fiz7-cember": { C: Cember },
  "fiz7-tambur": { C: Tambur },
  "fiz7-dolap": { C: Dolap },
  "fiz7-ip": { C: Ip },
  "fiz7-merkezcil": { C: Merkezcil },
  "fiz7-viraj": {
    C: Viraj,
    geri: (v) => {
      const mu = (v.mu ?? 3) / 10, vm = vMax(mu);
      return { baslik: "Savruldun", metin: `μ = ${say(mu)} iken en büyük güvenli hız √(${say(mu)} · 9,8 · 50) ≈ ${say(vm)} m/s. Araban 15 m/s ile gidiyor; sürtünme merkezcil kuvvete yetmedi, araba teğet boyunca kaydı.` };
    },
  },
  "fiz7-patenci": { C: Patenci },
};
