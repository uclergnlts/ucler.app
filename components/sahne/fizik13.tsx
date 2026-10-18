"use client";
// Fizik sahneleri (özel görelilik; kuantum fiziğine giriş): hız toplama, ışık hızının sabitliği, eşzamanlılık, ışık saati,
// γ çarpanı, müonlar, boy kısalması, c sınırı; siyah cisim, fotoelektrik eşik, durdurma gerilimi, şiddet ve akım,
// Compton olayı, elektronlarla çift yarık, Bohr spektrumu.
import type { SahneKaydi, SahneProps } from "./ortak";
import { rastgele } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const gama = (b: number) => 1 / Math.sqrt(1 - b * b);
/** Beyaz kenarlı yazı (çizgilerin üstünde okunur kalsın). */
const kenar = { stroke: "#fff", strokeWidth: 3, paintOrder: "stroke" as const };

/** Dalga boyuna (nm) göre görünür renk; görünür bölge dışı gri-mor ya da koyu kırmızı. */
function dalgaRenk(nm: number) {
  if (nm < 380) return "rgb(124, 58, 237)";
  if (nm > 750) return "rgb(150, 30, 30)";
  const tablo: [number, number[]][] = [[380, [124, 58, 237]], [450, [47, 110, 246]], [500, [0, 178, 140]], [550, [96, 196, 40]], [600, [255, 138, 0]], [650, [242, 70, 40]], [750, [190, 20, 20]]];
  let i = 0;
  while (i < tablo.length - 2 && nm > tablo[i + 1][0]) i++;
  const [a, ra] = tablo[i], [b, rb] = tablo[i + 1], u = (nm - a) / (b - a);
  const c = ra.map((x, k) => Math.round(x + (rb[k] - x) * u));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
const bolge = (nm: number) => (nm < 380 ? "morötesi" : nm > 750 ? "kızılötesi" : "görünür");

/** Dalga paketi: (x, y) merkezli, yön açısı aci (derece), dalga boyu lam px. */
function Paket({ x, y, aci = 0, lam, renk, boy = 46 }: { x: number; y: number; aci?: number; lam: number; renk: string; boy?: number }) {
  const n = 40, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = -boy / 2 + (i / n) * boy, zarf = Math.cos((Math.PI * s) / boy) ** 2;
    pts.push(`${s.toFixed(1)} ${(-7 * zarf * Math.sin((2 * Math.PI * s) / lam)).toFixed(1)}`);
  }
  return <path d={"M" + pts.join(" L")} transform={`translate(${x} ${y}) rotate(${aci})`} fill="none" stroke={renk} strokeWidth={2.4} strokeLinecap="round" />;
}

/* ================= Özel görelilik ================= */

// Hız toplama: tren v.v m/s ile sağa gider, öne 20 m/s'lik top atılır. 1 m = 1,2 px, oynatma 3 s.
function HizToplama({ v, t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), zt = u * sure;
  const vt = sinir(v.v ?? 10, 0, 40), vb = vt + 20, PX = 1.2, Y = 120;
  const tx = 24 + vt * zt * PX, bx = 24 + 64 + vb * zt * PX;
  const bitti = u >= 1 && !oynuyor;
  return (
    <svg viewBox="0 0 340 176" role="img" aria-label={`Tren ${vt} m/s, top trene göre 20 m/s; yere göre ${vb} m/s`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Yere göre top: {vt} + 20 = <tspan fill="var(--c2)">{vb} m/s</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{bitti ? `3 s'de top ${vb * 3} m, tren ${vt * 3} m gitti` : "klasik fizik: hızlar toplanır"}</text>
      {/* ray */}
      <line x1={10} x2={330} y1={Y + 16} y2={Y + 16} stroke="var(--line-2)" strokeWidth={3} />
      {Array.from({ length: 17 }, (_, i) => <line key={i} x1={14 + i * 20} x2={14 + i * 20} y1={Y + 16} y2={Y + 22} stroke="var(--line-2)" strokeWidth={2} />)}
      {/* tren */}
      <g transform={`translate(${tx} ${Y})`}>
        <rect x={0} y={-26} width={64} height={36} rx={6} fill="var(--c1)" />
        <rect x={8} y={-19} width={14} height={11} rx={2} fill="#fff" opacity={0.85} />
        <rect x={28} y={-19} width={14} height={11} rx={2} fill="#fff" opacity={0.85} />
        <circle cx={14} cy={12} r={5} fill="var(--ink)" />
        <circle cx={50} cy={12} r={5} fill="var(--ink)" />
      </g>
      {/* top */}
      <circle cx={bx} cy={Y - 10} r={7} fill="var(--c2)" />
      {/* hız okları */}
      {vt > 0 && <g><line x1={tx + 10} x2={tx + 10 + vt * 1.0} y1={Y - 40} y2={Y - 40} stroke="var(--c1)" strokeWidth={2.4} /><path d={`M${tx + 10 + vt * 1.0 + 6} ${Y - 40} l-7 -4 v8 Z`} fill="var(--c1)" /><text x={tx + 10} y={Y - 46} fontSize={11} fontWeight={800} fill="var(--c1)" {...kenar}>tren {vt}</text></g>}
      <g><line x1={bx} x2={bx + vb * 1.0} y1={Y - 22} y2={Y - 22} stroke="var(--c2)" strokeWidth={2.4} /><path d={`M${bx + vb * 1.0 + 6} ${Y - 22} l-7 -4 v8 Z`} fill="var(--c2)" /></g>
      <text x={14} y={166} fontSize={11.5} fontWeight={700} fill="var(--muted)">yerdeki gözlemci ölçer · ok boyları hızla orantılı</text>
    </svg>
  );
}
const hizGeri = (v: Record<string, number>) => {
  const vt = v.v ?? 10;
  return { baslik: `Top yere göre ${vt + 20} m/s`, metin: `Top trene göre hep 20 m/s; yere göre hızı ${vt} + 20 oldu. 50 m/s için tren kaç m/s gitmeli?` };
};

// Işık hızı: 0,5c ile Dünya'ya yaklaşan gemi farını yakar. Işık 90 px/s, gemi 45 px/s.
function IsikHizi({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3.5), zt = ilerleme(t, oynuyor, sure) * sure;
  const gx = 30 + 35 * Math.min(zt, 3.4), ix = 86.5 + 70 * Math.max(0, zt - 0.3), vardi = ix >= 286, Y = 104;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label="0,5c ile yaklaşan geminin farından çıkan ışık Dünya'ya c hızıyla ulaşıyor">
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Dünya ölçtü: c. Gemi de c ölçer." : zt > 0.3 ? "Işık yolda…" : "Gemi 0,5c ile yaklaşıyor"}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{bitti ? "klasik beklenti 1,5c tutmadı" : "fardan ışık çıkacak"}</text>
      {/* Dünya */}
      <circle cx={314} cy={Y} r={22} fill="var(--c1)" opacity={0.85} />
      <path d={`M300 ${Y - 8} q8 -6 14 2 q6 8 14 2`} fill="none" stroke="var(--c3)" strokeWidth={4} strokeLinecap="round" />
      <text x={314} y={Y + 40} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">Dünya</text>
      {/* ışık */}
      {zt > 0.3 && <g>
        <line x1={gx + 46} x2={Math.min(ix, 290)} y1={Y} y2={Y} stroke="var(--c4)" strokeWidth={2} strokeDasharray="2 5" />
        {!vardi && <circle cx={ix} cy={Y} r={6} fill="var(--c4)" />}
      </g>}
      {/* gemi */}
      <g transform={`translate(${gx} ${Y})`}>
        <path d="M0 -10 L34 -10 L46 0 L34 10 L0 10 L-8 16 L-8 -16 Z" fill="var(--ink)" />
        <circle cx={46} cy={0} r={3} fill="var(--c4)" />
      </g>
      <text x={gx + 18} y={Y - 22} fontSize={11} fontWeight={800} fill="var(--ink)" textAnchor="middle">0,5c →</text>
      {/* ölçümler */}
      <g fontSize={12} fontWeight={800}>
        <text x={14} y={168} fill="var(--ink)">Gemideki ölçer: <tspan fill="var(--c2)">{zt > 0.3 ? "c" : "?"}</tspan></text>
        <text x={14} y={188} fill="var(--ink)">Dünya'daki ölçer: <tspan fill="var(--c2)">{vardi ? "c (1,5c değil)" : "?"}</tspan></text>
      </g>
    </svg>
  );
}

// Eşzamanlılık: şimşek A (arka) ve B (ön) uçlara aynı anda (yer sistemine göre) düşer. c = 40 px/s, tren 12 px/s = 0,3c.
const ES = { A: 30, B: 250, O: 140, C: 40, U: 12 };
function Eszaman({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), zt = ilerleme(t, oynuyor, sure) * sure, { A, B, O, C, U } = ES, Y = 92, GY = 150;
  const op = O + U * zt, yarim = (B - A) / 2;
  const tB = yarim / (C + U), tA = yarim / (C - U), tO = yarim / C;
  const sagA = A + C * zt, solB = B - C * zt;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const baslik = zt === 0 ? "Şimşekler A ve B'ye düşecek" : zt < tB ? "Işıklar yolda…" : zt < tO ? "O′, B'nin ışığını gördü" : zt < tA ? "O ikisini aynı anda gördü" : "O′, A'nın ışığını sonra gördü";
  const simsek = (x: number) => <path d={`M${x + 4} ${Y - 58} L${x - 4} ${Y - 40} L${x + 3} ${Y - 40} L${x - 5} ${Y - 22}`} fill="none" stroke="var(--c4)" strokeWidth={3} strokeLinejoin="round" opacity={zt < 0.5 ? 1 : 0.25} />;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="Trenin iki ucuna aynı anda şimşek düşüyor; trendeki gözlemci öndeki ışığı önce görüyor">
      <text x={14} y={20} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{baslik}</text>
      {simsek(A)}
      {simsek(B)}
      {/* tren */}
      <rect x={A + U * zt} y={Y - 14} width={B - A} height={28} rx={6} fill="var(--c1)" opacity={0.16} />
      <rect x={A + U * zt} y={Y - 14} width={B - A} height={28} rx={6} fill="none" stroke="var(--c1)" strokeWidth={1.6} />
      {/* ışık cepheleri (tren hizasında) */}
      {zt > 0 && <g fill="var(--c4)">
        {sagA < op + 2 || zt < tA ? <circle cx={Math.min(sagA, 330)} cy={Y} r={5} /> : null}
        {zt < tB + 0.02 ? <circle cx={Math.max(solB, 10)} cy={Y} r={5} /> : null}
        <circle cx={Math.min(sagA, 330)} cy={GY} r={4} opacity={zt < tO ? 1 : 0} />
        <circle cx={Math.max(solB, 10)} cy={GY} r={4} opacity={zt < tO ? 1 : 0} />
      </g>}
      {/* O′ trende */}
      <circle cx={op} cy={Y} r={7} fill="var(--c1)" />
      <text x={op} y={Y - 20} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="middle" {...kenar}>O′</text>
      <text x={A + U * zt + 6} y={Y + 32} fontSize={11.5} fontWeight={800} fill="var(--ink)">A</text>
      <text x={B + U * zt - 6} y={Y + 32} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="end">B</text>
      <text x={op} y={Y + 32} fontSize={11} fontWeight={800} fill="var(--c1)" textAnchor="middle">tren 0,3c →</text>
      {/* yer */}
      <line x1={10} x2={330} y1={GY + 10} y2={GY + 10} stroke="var(--line-2)" strokeWidth={3} />
      <circle cx={O} cy={GY} r={7} fill="var(--c2)" />
      <text x={O} y={GY + 28} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">O (yerde)</text>
      {[A, B].map((x) => <line key={x} x1={x} x2={x} y1={GY + 4} y2={GY + 16} stroke="var(--ink)" strokeWidth={2} />)}
      {/* sıra */}
      {zt >= tB && <text x={14} y={204} fontSize={11.5} fontWeight={700} fill="var(--muted)">O′ için: 1. B {zt >= tA ? "· 2. A" : ""} · O için: {zt >= tO ? "aynı anda" : "…"}</text>}
    </svg>
  );
}

// Işık saati: gemideki saatte ışık iki ayna arasında dik gider (H). Yerden bakınca eğik gider: c·Δt = γ·H.
function IsikSaati({ v }: SahneProps) {
  const b = sinir(v.b ?? 0.3, 0, 0.9), g = gama(b), H = 74, Y0 = 186, X0 = 150;
  const yatay = b * g * H, dt = 6 * g;
  return (
    <svg viewBox="0 0 340 238" role="img" aria-label={`v = ${say(b)}c, γ = ${say(g, 2)}; gemide 6 yıl, Dünya'da ${say(dt, 1)} yıl`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">γ = {say(g, 2)} · gemide 6 yıl → Dünya'da <tspan fill="var(--c2)">{say(dt, 1)} yıl</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">ışık saati: ışık iki ayna arasında gidip gelir</text>
      {/* gemide */}
      <text x={52} y={78} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="middle">gemide</text>
      <line x1={32} x2={72} y1={Y0 - H} y2={Y0 - H} stroke="var(--ink)" strokeWidth={3} />
      <line x1={32} x2={72} y1={Y0} y2={Y0} stroke="var(--ink)" strokeWidth={3} />
      <line x1={52} x2={52} y1={Y0} y2={Y0 - H} stroke="var(--c4)" strokeWidth={2.4} />
      <text x={58} y={Y0 - H / 2 + 4} fontSize={11.5} fontWeight={800} fill="var(--c4)" {...kenar}>c·Δt₀</text>
      {/* Dünya'dan */}
      <text x={X0 + yatay / 2} y={78} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">Dünya'dan</text>
      {[0, yatay].map((dx, i) => (
        <g key={i} opacity={i === 0 && yatay > 4 ? 0.35 : 1}>
          <line x1={X0 + dx - 20} x2={X0 + dx + 20} y1={Y0 - H} y2={Y0 - H} stroke="var(--ink)" strokeWidth={3} />
          <line x1={X0 + dx - 20} x2={X0 + dx + 20} y1={Y0} y2={Y0} stroke="var(--ink)" strokeWidth={3} />
        </g>
      ))}
      <line x1={X0} x2={X0 + yatay} y1={Y0} y2={Y0 - H} stroke="var(--c4)" strokeWidth={2.4} />
      <line x1={X0} x2={X0} y1={Y0} y2={Y0 - H} stroke="var(--c4)" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.7} />
      {yatay > 4 && <line x1={X0} x2={X0 + yatay} y1={Y0 + 12} y2={Y0 + 12} stroke="var(--muted)" strokeWidth={1.4} />}
      {yatay > 4 && <text x={X0 + yatay / 2} y={Y0 + 25} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">v·Δt</text>}
      <text x={X0 + yatay / 2 + 8} y={Y0 - H / 2 - 4} fontSize={11.5} fontWeight={800} fill="var(--c4)" {...kenar}>c·Δt</text>
      <text x={14} y={232} fontSize={11.5} fontWeight={700} fill="var(--muted)">yol uzadı ama ışık yine c ile gidiyor: süre uzar</text>
    </svg>
  );
}

// γ grafiği: v/c 0..0.99, γ 1..7.
function GamaGrafik({ v }: SahneProps) {
  const b = sinir(v.b ?? 0.5, 0, 0.99), g = gama(b);
  const x0 = 44, x1 = 320, y0 = 50, y1 = 190, gx = (q: number) => x0 + q * (x1 - x0), gy = (q: number) => y1 - ((q - 1) / 6) * (y1 - y0);
  const egri = Array.from({ length: 100 }, (_, i) => { const q = (i / 99) * 0.99; return `${gx(q).toFixed(1)} ${gy(Math.min(gama(q), 7.3)).toFixed(1)}`; });
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`v = ${say(b, 2)}c iken γ = ${say(g, 2)}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">v = {say(b, 2)}c → γ = <tspan fill="var(--c2)">{say(g, 2)}</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{g >= 1.995 ? `saat ${say(g, 2)} kat yavaş işler` : b < 0.15 ? "günlük hızlarda γ ≈ 1: Newton yeterli" : "c'ye yaklaştıkça γ hızla büyür"}</text>
      {/* eksenler */}
      <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--line-2)" strokeWidth={1.4} />
      <line x1={x0} x2={x0} y1={y0 - 6} y2={y1} stroke="var(--line-2)" strokeWidth={1.4} />
      {[1, 2, 3, 4, 5, 6, 7].map((q) => <g key={q}><line x1={x0} x2={x1} y1={gy(q)} y2={gy(q)} stroke="var(--line)" strokeWidth={q === 2 ? 0 : 1} /><text x={x0 - 8} y={gy(q) + 4} fontSize={11} fill="var(--muted)" textAnchor="end">{q}</text></g>)}
      <line x1={x0} x2={x1} y1={gy(2)} y2={gy(2)} stroke="var(--c5)" strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={x0 + 4} y={gy(2) - 5} fontSize={11} fontWeight={700} fill="var(--c5)">γ = 2</text>
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((q) => <text key={q} x={gx(q)} y={y1 + 16} fontSize={11} fill="var(--muted)" textAnchor="middle">{say(q)}</text>)}
      <text x={x1} y={y1 + 30} fontSize={11} fill="var(--muted)" textAnchor="end">v / c</text>
      <line x1={gx(1)} x2={gx(1)} y1={y0 - 6} y2={y1} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 4" />
      <text x={gx(1) - 4} y={y0 - 8} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="end">c</text>
      <path d={"M" + egri.join(" L")} fill="none" stroke="var(--c1)" strokeWidth={2.6} />
      <line x1={gx(b)} x2={gx(b)} y1={y1} y2={gy(g)} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
      <circle cx={gx(b)} cy={gy(g)} r={6} fill="var(--c2)" />
      <text x={gx(0.02)} y={y1 - 8} fontSize={11} fontWeight={700} fill="var(--muted)" {...kenar}>jet, araba: γ ≈ 1</text>
    </svg>
  );
}

// Müon: 6,6 km'de doğar, 0,995c ile iner. Solda zaman genişlemesi yok (660 m'de bozunur), sağda gerçek (yere ulaşır).
function Muon({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3.5), zt = ilerleme(t, oynuyor, sure) * sure, ini = sinir(zt / 3, 0, 1);
  const Y0 = 52, Y1 = 196, km = (h: number) => Y1 - (h / 6.6) * (Y1 - Y0);
  const sol = 6.6 - Math.min(ini * 6.6, 0.66), sag = 6.6 - ini * 6.6, solBitti = ini * 6.6 >= 0.66;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const kol = (x: number, h: number, bozundu: boolean, renk: string) => (
    <g>
      <line x1={x} x2={x} y1={Y0} y2={km(h)} stroke={renk} strokeWidth={1.6} strokeDasharray="3 4" />
      {bozundu ? (
        <g stroke={renk} strokeWidth={2.2} strokeLinecap="round">
          {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={x + 5 * Math.cos((a * Math.PI) / 180)} y1={km(h) + 5 * Math.sin((a * Math.PI) / 180)} x2={x + 11 * Math.cos((a * Math.PI) / 180)} y2={km(h) + 11 * Math.sin((a * Math.PI) / 180)} />)}
        </g>
      ) : <circle cx={x} cy={km(h)} r={6} fill={renk} />}
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Zaman genişlemesi olmasaydı müon 660 m'de bozunurdu; gerçekte yere ulaşıyor">
      <text x={14} y={20} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Müon yere ulaştı: ömrü ≈ 10 kat uzadı" : zt > 0 ? "Müonlar iniyor…" : "6,6 km'de bir müon doğdu"}</text>
      <text x={14} y={38} fontSize={11.5} fontWeight={700} fill="var(--muted)">0,995c · durgun ömür 2,2 μs</text>
      {/* yükseklik ekseni */}
      {[0, 2, 4, 6.6].map((h) => <g key={h}><line x1={40} x2={326} y1={km(h)} y2={km(h)} stroke="var(--line)" strokeWidth={1} /><text x={34} y={km(h) + 4} fontSize={11} fill="var(--muted)" textAnchor="end">{say(h)}</text></g>)}
      <text x={34} y={Y1 + 18} fontSize={11} fill="var(--muted)" textAnchor="end">km</text>
      <line x1={40} x2={326} y1={Y1} y2={Y1} stroke="var(--ink)" strokeWidth={2.4} />
      {kol(100, sol, solBitti, "var(--muted)")}
      {kol(270, sag, false, "var(--c2)")}
      <text x={100} y={Y1 + 18} fontSize={11.5} fontWeight={800} fill="var(--muted)" textAnchor="middle">süre uzamasaydı</text>
      <text x={270} y={Y1 + 18} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">gerçekte</text>
      {solBitti && <text x={116} y={km(5.94) + 4} fontSize={11} fontWeight={700} fill="var(--muted)" {...kenar}>660 m'de bozunurdu</text>}
      {bitti && <text x={170} y={232} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">müona göre ise atmosfer 6,6 km değil, ≈ 660 m</text>}
    </svg>
  );
}

// Boy kısalması: öz boyu 100 m, yüksekliği 20 m olan gemi. 1 m = 2,6 px.
function Boy({ v }: SahneProps) {
  const b = sinir(v.b ?? 0, 0, 0.9), g = gama(b), L = 100 / g, PX = 2.6, x0 = 40, Y = 120, H = 20 * PX;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`v = ${say(b)}c iken gemi ${say(L, 1)} m ölçülür; yüksekliği 20 m`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">L = 100 / {say(g, 2)} = <tspan fill="var(--c2)">{say(L, 1)} m</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">Dünya'dan ölçülen boy · gemide hep 100 m</text>
      {/* öz boy hayaleti */}
      <rect x={x0} y={Y - H / 2} width={100 * PX} height={H} rx={10} fill="none" stroke="var(--line-2)" strokeWidth={1.4} strokeDasharray="4 4" />
      {/* gemi */}
      <rect x={x0} y={Y - H / 2} width={L * PX} height={H} rx={10} fill="var(--c1)" opacity={0.85} />
      {[0.2, 0.45, 0.7].map((q) => <circle key={q} cx={x0 + L * PX * q} cy={Y} r={Math.min(7, L * PX * 0.06)} fill="#fff" opacity={0.85} />)}
      {/* ölçüler */}
      <line x1={x0} x2={x0 + L * PX} y1={Y + H / 2 + 14} y2={Y + H / 2 + 14} stroke="var(--c2)" strokeWidth={1.6} />
      {[x0, x0 + L * PX].map((x) => <line key={x} x1={x} x2={x} y1={Y + H / 2 + 8} y2={Y + H / 2 + 20} stroke="var(--c2)" strokeWidth={1.6} />)}
      <text x={x0 + (L * PX) / 2} y={Y + H / 2 + 34} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{say(L, 1)} m</text>
      <line x1={x0 - 14} x2={x0 - 14} y1={Y - H / 2} y2={Y + H / 2} stroke="var(--ink)" strokeWidth={1.6} />
      <text x={x0 - 18} y={Y + 4} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="end">20</text>
      {b > 0 && <text x={x0 + L * PX + 8} y={Y + 4} fontSize={11.5} fontWeight={800} fill="var(--c1)">→ {say(b)}c</text>}
      <text x={14} y={208} fontSize={11.5} fontWeight={700} fill="var(--muted)">kısalma yalnız hareket yönünde: yükseklik hep 20 m</text>
    </svg>
  );
}

// c sınırı: verilen kinetik enerji K (mc² cinsinden). Newton: v = c√(2K); Einstein: γ = 1 + K.
function CSiniri({ v }: SahneProps) {
  const K = sinir(v.K ?? 0, 0, 9), g = 1 + K, vE = Math.sqrt(1 - 1 / (g * g)), vN = Math.sqrt(2 * K);
  const x0 = 30, x1 = 318, ox = (q: number) => x0 + (Math.min(q, 2) / 2) * (x1 - x0);
  const satir = (y: number, q: number, ad: string, renk: string, yazi: string) => (
    <g>
      <text x={x0} y={y - 10} fontSize={11.5} fontWeight={800} fill={renk}>{ad}</text>
      <rect x={x0} y={y} width={x1 - x0} height={14} rx={7} fill="var(--panel)" />
      <rect x={x0} y={y} width={Math.max(0, ox(q) - x0)} height={14} rx={7} fill={renk} opacity={0.85} />
      <text x={Math.min(ox(q), x1) - 4} y={y + 11} fontSize={11} fontWeight={800} fill="#fff" textAnchor="end">{q > 0.18 ? yazi : ""}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Verilen enerji ${K} mc²; görelilikle hız ${say(vE, 3)}c`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">γ = {say(g)} → v = <tspan fill="var(--c2)">{say(vE, 3)}c</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{K === 0 ? "gemi duruyor; enerji ver" : `${K} birim enerji verildi`}</text>
      {satir(78, vN, "Newton'a göre", "var(--muted)", vN > 2 ? "> 2c" : `${say(vN, 2)}c`)}
      {satir(138, vE, "Görelilikle (gerçek)", "var(--c2)", `${say(vE, 3)}c`)}
      <line x1={ox(1)} x2={ox(1)} y1={56} y2={168} stroke="var(--ink)" strokeWidth={1.6} strokeDasharray="4 3" />
      <text x={ox(1)} y={184} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">c</text>
      <text x={14} y={208} fontSize={11.5} fontWeight={700} fill="var(--muted)">p = γ·m·v: c'ye yaklaştıkça γ sınırsız büyür</text>
    </svg>
  );
}

/* ================= Kuantum ================= */

// Siyah cisim: Planck eğrisi (tepesine göre ölçekli) ve Wien tepesi. T v.T K.
const HCK = 1.4388e7; // nm·K
function sicakRenk(T: number) {
  const tablo: [number, number[]][] = [[1000, [120, 20, 10]], [2000, [220, 60, 20]], [3000, [255, 130, 40]], [4000, [255, 180, 100]], [5000, [255, 220, 170]], [5800, [255, 244, 230]], [7000, [215, 228, 255]]];
  let i = 0;
  while (i < tablo.length - 2 && T > tablo[i + 1][0]) i++;
  const [a, ra] = tablo[i], [b, rb] = tablo[i + 1], u = sinir((T - a) / (b - a), 0, 1);
  const c = ra.map((x, k) => Math.round(x + (rb[k] - x) * u));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function SiyahCisim({ v }: SahneProps) {
  const T = sinir(v.T ?? 3000, 1000, 7000), tepe = 2.9e6 / T;
  const x0 = 30, x1 = 250, y0 = 74, y1 = 190, LMAX = 3000;
  const gx = (nm: number) => x0 + (nm / LMAX) * (x1 - x0);
  const B = (nm: number) => 1 / (nm ** 5 * (Math.exp(HCK / (nm * T)) - 1));
  const enb = B(tepe);
  const pts = Array.from({ length: 120 }, (_, i) => { const nm = 50 + (i / 119) * (LMAX - 50); return `${gx(nm).toFixed(1)} ${(y1 - (B(nm) / enb) * (y1 - y0)).toFixed(1)}`; });
  const kat = (T / 1000) ** 4;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`T = ${T} K; tepe dalga boyu ${Math.round(tepe)} nm`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">T = {T} K → λ<tspan fontSize={9} dy={3}>max</tspan><tspan dy={-3}> = </tspan><tspan fill="var(--c2)">{Math.round(tepe)} nm</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{tepe < 380 ? "tepe morötesinde" : tepe <= 750 ? "tepe görünürde" : "tepe kızılötesinde"} · ışıma 1000 K'dekinin {say(kat, 0)} katı</text>
      {/* görünür bant */}
      <defs>
        <linearGradient id="fiz13-gorunur" x1={0} x2={1} y1={0} y2={0}>
          {[380, 450, 500, 550, 600, 650, 750].map((nm, i) => <stop key={nm} offset={i / 6} stopColor={dalgaRenk(nm)} />)}
        </linearGradient>
      </defs>
      <rect x={gx(380)} y={y0 - 4} width={gx(750) - gx(380)} height={y1 - y0 + 4} fill="url(#fiz13-gorunur)" opacity={0.22} />
      <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--line-2)" strokeWidth={1.4} />
      {[0, 1000, 2000, 3000].map((nm) => <text key={nm} x={gx(nm)} y={y1 + 15} fontSize={11} fill="var(--muted)" textAnchor="middle">{nm}</text>)}
      <text x={x1} y={y1 + 30} fontSize={11} fill="var(--muted)" textAnchor="end">λ (nm)</text>
      <text x={(gx(380) + gx(750)) / 2} y={y0 - 8} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">görünür</text>
      <path d={"M" + pts.join(" L")} fill="none" stroke="var(--c2)" strokeWidth={2.6} />
      <line x1={gx(tepe)} x2={gx(tepe)} y1={y0} y2={y1} stroke="var(--c2)" strokeWidth={1.2} strokeDasharray="3 3" />
      {/* parlayan cisim */}
      <circle cx={294} cy={118} r={30} fill={sicakRenk(T)} stroke="var(--line-2)" strokeWidth={1} />
      <text x={294} y={168} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">cismin rengi</text>
      <text x={14} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">Wien: λ<tspan fontSize={9} dy={3}>max</tspan><tspan dy={-3}>·T ≈ 2,9·10⁶ nm·K</tspan></text>
    </svg>
  );
}

// Fotoelektrik düzenek çizimi: lamba solda üstte, metal levha altta. Fotonlar levhaya iner, E > W ise elektron kopar.
const W_NA = 2.3;
function Levha({ x0, x1, y, lam, n, u, w = W_NA, tohum = 7 }: { x0: number; x1: number; y: number; lam: number; n: number; u: number; w?: number; tohum?: number }) {
  const E = 1240 / lam, ek = E - w, renk = dalgaRenk(lam), r = rastgele(tohum + n);
  const lx = x0 + 10, ly = y - 92;
  const sira = Array.from({ length: n }, (_, i) => i).sort(() => r() - 0.5);
  const parca = sira.map((k, i) => ({ hx: x0 + 30 + ((k + 0.5) / n) * (x1 - x0 - 50), t0: (i / n) * 0.5 }));
  return (
    <g>
      {/* ışık demeti */}
      {u > 0 && <path d={`M${lx} ${ly} L${x0 + 20} ${y} L${x1 - 10} ${y} Z`} fill={renk} opacity={0.09} />}
      {/* lamba */}
      <circle cx={lx} cy={ly} r={11} fill={renk} />
      <rect x={lx - 6} y={ly - 22} width={12} height={10} rx={2} fill="var(--ink)" />
      {/* levha */}
      <rect x={x0} y={y} width={x1 - x0} height={10} rx={2} fill="#aab4c3" />
      {parca.map((p, i) => {
        const k = sinir((u - p.t0) / 0.35, 0, 1), px = lx + (p.hx - lx) * k, py = ly + (y - ly) * k;
        const ka = sinir((u - p.t0 - 0.35) / 0.4, 0, 1), hiz = ek > 0 ? 10 + 40 * Math.sqrt(ek) : 0;
        return (
          <g key={i}>
            {k > 0 && k < 1 && <circle cx={px} cy={py} r={3.6} fill={renk} />}
            {ek > 0 && ka > 0 && <g>
              <circle cx={p.hx + 0.35 * hiz * ka} cy={y - 4 - hiz * ka} r={4} fill="var(--c1)" />
              <text x={p.hx + 0.35 * hiz * ka} y={y - 1 - hiz * ka} fontSize={7} fontWeight={800} fill="#fff" textAnchor="middle">−</text>
            </g>}
          </g>
        );
      })}
    </g>
  );
}

// Eşik: λ v.lam nm, şiddet v.s (foton sayısı 3·s). W = 2,3 eV.
function Esik({ v, t, oynuyor, s, kosular }: SahneProps) {
  const sure = Number(s.sure ?? 2.5), u = ilerleme(t, oynuyor, sure);
  const lam = sinir(v.lam ?? 650, 300, 700), sid = sinir(v.s ?? 1, 1, 4), E = 1240 / lam, kopar = E > W_NA;
  const gecmis = kosular.slice(-3);
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`${lam} nm ışık, foton enerjisi ${say(E, 2)} eV; ${kopar ? "elektron kopuyor" : "elektron kopmuyor"}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Foton: 1240 / {lam} = <tspan fill={kopar ? "var(--c3)" : "var(--c2)"}>{say(E, 2)} eV</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{kopar ? `W = 2,3 eV'den büyük: elektron kopar` : `W = 2,3 eV'den küçük: elektron kopmaz`} · {bolge(lam)}</text>
      <Levha x0={40} x1={300} y={170} lam={lam} n={3 * sid} u={u} />
      <text x={170} y={198} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">sodyum levha · W = 2,3 eV</text>
      {gecmis.length > 0 && <g fontSize={11} fontWeight={700} fill="var(--c5)">
        {gecmis.map((k, i) => {
          const l = k.lam ?? 650, ss = k.s ?? 1, e = 1240 / l;
          return <text key={i} x={14} y={218 + i * 15}>{l} nm · şiddet {ss} → {e > W_NA ? "elektron koptu" : "elektron yok"}</text>;
        })}
      </g>}
    </svg>
  );
}

// Durdurma gerilimi: foton enerjisi çubuğu = W + E_k. e·V₀ = E_k,max.
function Durdurma({ v }: SahneProps) {
  const lam = sinir(v.lam ?? 500, 300, 600), E = 1240 / lam, ek = Math.max(0, E - W_NA);
  const PX = 34, x = 60, Y = 196, wh = W_NA * PX, eh = ek * PX;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${lam} nm: foton ${say(E, 2)} eV, durdurma gerilimi ${say(ek, 2)} V`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">E<tspan fontSize={9} dy={3}>k,max</tspan><tspan dy={-3}> = {say(E, 2)} − 2,3 = </tspan><tspan fill="var(--c2)">{say(ek, 2)} eV</tspan></text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{ek > 0 ? `durdurma gerilimi V₀ = ${say(ek, 2)} V` : "elektron kopmaz: V₀ yok"}</text>
      {/* foton enerjisi çubuğu */}
      <rect x={x} y={Y - E * PX} width={46} height={E * PX} rx={4} fill={dalgaRenk(lam)} opacity={0.85} />
      <text x={x + 23} y={Y + 16} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">h·f</text>
      {/* W + Ek çubuğu */}
      <rect x={x + 70} y={Y - wh} width={46} height={wh} rx={4} fill="#aab4c3" />
      <text x={x + 93} y={Y - wh / 2 + 4} fontSize={11.5} fontWeight={800} fill="#fff" textAnchor="middle">W</text>
      {eh > 0 && <rect x={x + 70} y={Y - wh - eh} width={46} height={eh} rx={4} fill="var(--c3)" />}
      {eh > 14 && <text x={x + 93} y={Y - wh - eh / 2 + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">E<tspan fontSize={8} dy={2}>k</tspan></text>}
      <text x={x + 93} y={Y + 16} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">W + E<tspan fontSize={9} dy={3}>k</tspan></text>
      <line x1={x - 6} x2={x + 122} y1={Y - wh} y2={Y - wh} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
      {/* tüp ve gerilim */}
      <g transform="translate(220 70)">
        <rect x={0} y={0} width={100} height={70} rx={14} fill="none" stroke="var(--line-2)" strokeWidth={1.6} />
        <rect x={8} y={14} width={6} height={42} fill="#aab4c3" />
        <rect x={86} y={14} width={6} height={42} fill="var(--ink)" />
        {ek > 0 && <g>
          <circle cx={36} cy={35} r={4} fill="var(--c1)" />
          <path d="M44 35 h18" stroke="var(--c1)" strokeWidth={1.6} />
          <path d="M66 35 l-6 -4 v8 Z" fill="var(--c1)" />
        </g>}
        <text x={50} y={92} fontSize={12} fontWeight={800} fill="var(--c2)" textAnchor="middle">{ek > 0 ? `V₀ = ${say(ek, 2)} V` : "V₀ —"}</text>
        <text x={50} y={108} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">e·V₀ = E<tspan fontSize={8} dy={2}>k,max</tspan></text>
      </g>
    </svg>
  );
}

// Şiddet ve akım: solda şiddet 1, sağda şiddet 2. Aynı λ = 400 nm, W = 2,3 eV.
function Siddet({ t, oynuyor, s, secim }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), bitti = u >= 1 && !oynuyor;
  const goster = secim !== null;
  const panel = (x: number, n: number, ad: string, akim: string) => (
    <g>
      <text x={x + 70} y={60} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ad}</text>
      <Levha x0={x} x1={x + 140} y={186} lam={400} n={n} u={goster ? u : 0} tohum={x} />
      <text x={x + 70} y={212} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="middle">{akim}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="Şiddet iki katına çıkınca kopan elektron sayısı iki katına çıkıyor, en büyük kinetik enerji aynı kalıyor">
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Akım 2 kat, E" : "400 nm ışık, sodyum levha"}{bitti && <><tspan fontSize={9} dy={3}>k,max</tspan><tspan dy={-3}> aynı: 0,8 eV</tspan></>}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">{bitti ? "elektronlar aynı hızla çıkıyor, sayısı arttı" : "solda şiddet 1, sağda şiddet 2"}</text>
      {panel(14, 4, "şiddet 1", bitti ? "akım: 4 elektron" : "")}
      {panel(186, 8, "şiddet 2", bitti ? "akım: 8 elektron" : "")}
    </svg>
  );
}

// Compton: foton (λ) elektrona çarpar, saçılan foton daha uzun dalga boyuyla yukarı sağa, elektron aşağı sağa gider.
function Compton({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 3), u = ilerleme(t, oynuyor, sure), EX = 150, EY = 134;
  const once = sinir(u / 0.45, 0, 1), sonra = sinir((u - 0.45) / 0.55, 0, 1);
  const bitti = u >= 1 && !oynuyor;
  const gx = 40 + (EX - 30 - 40) * once;
  const sa = -32 * (Math.PI / 180), sx = EX + 120 * sonra * Math.cos(sa), sy = EY + 120 * sonra * Math.sin(sa);
  const ea = 32 * (Math.PI / 180), ex = EX + 90 * sonra * Math.cos(ea), ey = EY + 90 * sonra * Math.sin(ea);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label="X ışını fotonu elektrona çarpıyor; saçılan fotonun dalga boyu uzuyor, elektron geri tepiyor">
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "λ′ > λ: foton enerji ve momentum verdi" : "X ışını fotonu elektrona gidiyor"}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">fotonun momentumu p = h/λ</text>
      <line x1={20} x2={EX} y1={EY} y2={EY} stroke="var(--line)" strokeWidth={1} strokeDasharray="3 4" />
      {once < 1 ? <Paket x={gx} y={EY} lam={11} renk="var(--c5)" boy={56} /> : <g opacity={0.4}><Paket x={70} y={EY} lam={11} renk="var(--c5)" boy={56} /></g>}
      <text x={once < 1 ? gx : 70} y={EY - 16} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="middle">λ</text>
      {sonra > 0 && <g>
        <Paket x={sx} y={sy} aci={-32} lam={18} renk="var(--c5)" boy={56} />
        <text x={sx - 14} y={sy - 18} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="middle" {...kenar}>λ′</text>
      </g>}
      <circle cx={sonra > 0 ? ex : EX} cy={sonra > 0 ? ey : EY} r={8} fill="var(--c1)" />
      <text x={sonra > 0 ? ex : EX} y={(sonra > 0 ? ey : EY) + 4} fontSize={10} fontWeight={800} fill="#fff" textAnchor="middle">−</text>
      {sonra > 0.5 && <text x={ex + 12} y={ey + 4} fontSize={11.5} fontWeight={800} fill="var(--c1)">elektron</text>}
      {bitti && <text x={14} y={214} fontSize={11.5} fontWeight={700} fill="var(--muted)">saçılan fotonun hızı yine c; frekansı küçüldü</text>}
    </svg>
  );
}

// Elektronlarla çift yarık: elektronlar tek tek gelir, perdede noktalar girişim deseni oluşturur.
const CY_N = 520;
const cyNoktalar = (() => {
  const r = rastgele(1913), out: { y: number; x: number }[] = [];
  const I = (y: number) => Math.cos((Math.PI * y) / 22) ** 2 * Math.exp(-((y / 62) ** 2));
  while (out.length < CY_N) {
    const y = (r() * 2 - 1) * 74;
    if (r() < I(y)) out.push({ y, x: r() });
  }
  return out;
})();
function CiftYarik({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 4), u = ilerleme(t, oynuyor, sure), n = Math.floor(u * CY_N), Y = 140;
  const bitti = u >= 1 && !oynuyor;
  const PX0 = 220, PX1 = 320;
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label={`Çift yarıktan geçen ${n} elektron perdede ${bitti ? "girişim saçakları" : "noktalar"} oluşturdu`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>{bitti ? "Girişim saçakları: elektron dalga gibi" : n > 0 ? `${n} elektron geldi` : "Elektronlar tek tek gönderilecek"}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">her elektron perdeye tek nokta olarak düşer</text>
      {/* tabanca */}
      <rect x={20} y={Y - 12} width={34} height={24} rx={5} fill="var(--ink)" />
      <text x={37} y={Y + 32} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">kaynak</text>
      {/* uçuşan elektron */}
      {oynuyor && <circle cx={60 + ((u * 40) % 1) * 140} cy={Y} r={3.5} fill="var(--c1)" />}
      {/* yarıklar */}
      <g fill="var(--ink)">
        <rect x={120} y={Y - 70} width={6} height={58} />
        <rect x={120} y={Y - 4} width={6} height={8} />
        <rect x={120} y={Y + 12} width={6} height={58} />
      </g>
      <text x={123} y={Y + 88} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">iki yarık</text>
      {/* perde */}
      <rect x={PX0} y={Y - 80} width={PX1 - PX0} height={160} rx={4} fill="var(--panel)" />
      {cyNoktalar.slice(0, n).map((p, i) => <circle key={i} cx={PX0 + 4 + p.x * (PX1 - PX0 - 8)} cy={Y + p.y} r={1.6} fill="var(--c1)" />)}
      <text x={(PX0 + PX1) / 2} y={Y + 98} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">perde (önden)</text>
    </svg>
  );
}

// Bohr: hidrojen düzeyleri E_n = −13,6/n². Üst ve alt düzey sayaçla seçilir.
function Bohr({ v }: SahneProps) {
  const ust = sinir(v.ust ?? 3, 2, 6), alt = sinir(v.alt ?? 1, 1, 5), En = (n: number) => -13.6 / (n * n);
  const gecerli = alt < ust, E = gecerli ? En(ust) - En(alt) : 0, lam = gecerli ? 1240 / E : 0;
  const x0 = 40, x1 = 200, YN = [0, 204, 144, 112, 90, 74, 60], gy = (e: number) => YN[Math.round(Math.sqrt(-13.6 / e))];
  const renk = gecerli ? dalgaRenk(lam) : "var(--muted)";
  return (
    <svg viewBox="0 0 340 238" role="img" aria-label={gecerli ? `n = ${ust} → ${alt}: ${say(E, 2)} eV, ${Math.round(lam)} nm` : "Alt düzey üst düzeyden küçük olmalı"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{gecerli ? <>n = {ust} → {alt}: h·f = <tspan fill="var(--c2)">{say(E, 2)} eV</tspan></> : "Elektron aşağı inmeli: alt < üst"}</text>
      <text x={14} y={40} fontSize={11.5} fontWeight={700} fill="var(--muted)">E<tspan fontSize={9} dy={3}>n</tspan><tspan dy={-3}> = −13,6 / n² eV</tspan></text>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <g key={n}>
          <line x1={x0} x2={x1} y1={gy(En(n))} y2={gy(En(n))} stroke={n === ust || n === alt ? "var(--ink)" : "var(--line-2)"} strokeWidth={n === ust || n === alt ? 2.4 : 1.4} />
          <text x={x0 - 6} y={gy(En(n)) + 4} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="end">{n}</text>
          <text x={x1 + 4} y={gy(En(n)) + 4} fontSize={10.5} fill="var(--muted)">{say(En(n), 2)}</text>
        </g>
      ))}
      <text x={14} y={232} fontSize={11} fontWeight={700} fill="var(--muted)">soldaki sayılar: n · sağda: enerji (eV) · ölçeksiz</text>
      {gecerli && <g>
        <line x1={120} x2={120} y1={gy(En(ust))} y2={gy(En(alt)) - 8} stroke="var(--c2)" strokeWidth={2.4} />
        <path d={`M120 ${gy(En(alt))} l-5 -9 h10 Z`} fill="var(--c2)" />
        <Paket x={156} y={(gy(En(ust)) + gy(En(alt))) / 2} lam={Math.max(6, Math.min(20, lam / 30))} renk={renk} boy={40} />
      </g>}
      {/* foton bilgisi */}
      <g transform="translate(246 90)">
        <rect x={0} y={0} width={80} height={44} rx={8} fill={gecerli && lam >= 380 && lam <= 750 ? renk : "var(--panel)"} />
        <text x={40} y={66} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{gecerli ? `${Math.round(lam)} nm` : "—"}</text>
        <text x={40} y={82} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{gecerli ? bolge(lam) : ""}</text>
      </g>
    </svg>
  );
}

export const FIZIK13: Record<string, SahneKaydi> = {
  "fiz13-hiz": { C: HizToplama, geri: hizGeri },
  "fiz13-isik": { C: IsikHizi },
  "fiz13-esz": { C: Eszaman },
  "fiz13-saat": { C: IsikSaati },
  "fiz13-gama": { C: GamaGrafik },
  "fiz13-muon": { C: Muon },
  "fiz13-boy": { C: Boy },
  "fiz13-sinir": { C: CSiniri },
  "fiz13-siyah": { C: SiyahCisim },
  "fiz13-esik": { C: Esik },
  "fiz13-durdur": { C: Durdurma },
  "fiz13-siddet": { C: Siddet },
  "fiz13-compton": { C: Compton },
  "fiz13-elektron": { C: CiftYarik },
  "fiz13-bohr": { C: Bohr },
};
