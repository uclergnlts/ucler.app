"use client";
// Fizik sahneleri (ısı ve sıcaklık, vektörler): titreşen tanecikler, damla ve kova, üç ölçekli termometre,
// öz ısı, karışım, buzun erimesi, rayın uzaması; vektör çizme, uç uca toplama, sayıyla çarpma, bileşenler, yürüyüş.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const say = (x: number, d = 2) => x.toLocaleString("tr-TR", { maximumFractionDigits: d });

/** (x1, y1)'den (x2, y2)'ye ok; uç (x2, y2)'dedir. */
function Ok({ x1, y1, x2, y2, renk, kalin = 3, kesik = false }: { x1: number; y1: number; x2: number; y2: number; renk: string; kalin?: number; kesik?: boolean }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, u = Math.min(10, L * 0.6);
  const bx = x2 - ux * u, by = y2 - uy * u;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={renk} strokeWidth={kalin} strokeLinecap="round" strokeDasharray={kesik ? "5 5" : undefined} />
      <path d={`M${x2} ${y2} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z`} fill={renk} />
    </g>
  );
}

/** Kare ızgara: (x0, y0) sol üst, n × m kare, her biri k px. */
function Izgara({ x0, y0, n, m, k }: { x0: number; y0: number; n: number; m: number; k: number }) {
  return (
    <g stroke="var(--line)" strokeWidth={1}>
      {Array.from({ length: n + 1 }, (_, i) => <line key={`d${i}`} x1={x0 + i * k} x2={x0 + i * k} y1={y0} y2={y0 + m * k} />)}
      {Array.from({ length: m + 1 }, (_, i) => <line key={`y${i}`} x1={x0} x2={x0 + n * k} y1={y0 + i * k} y2={y0 + i * k} />)}
    </g>
  );
}

/* ---------- ısı ve sıcaklık ---------- */

// Bardaktaki çayın tanecikleri. v.T: sıcaklık (°C). Sıcaklık arttıkça tanecikler daha hızlı ve geniş titreşir.
function Tanecik({ v }: SahneProps) {
  const T = v.T ?? 20, rnd = rastgele(41);
  const genlik = 1.5 + T * 0.07, sure = 1.4 - T * 0.011;
  const renk = T >= 80 ? "var(--c2)" : T >= 50 ? "var(--c4)" : "var(--c1)";
  const noktalar = Array.from({ length: 16 }, (_, i) => ({ x: 106 + (i % 4) * 30 + rnd() * 10, y: 92 + Math.floor(i / 4) * 30 + rnd() * 10, a: rnd() * 6.28 }));
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Çay ${T} derece: tanecikler ${T >= 60 ? "hızlı" : "yavaş"} titreşiyor`}>
      <path d="M92 64 L100 210 L240 210 L248 64" fill="var(--c4)" opacity={0.12} />
      <path d="M92 52 L100 210 L240 210 L248 52" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g>
        {noktalar.map((n, i) => {
          const dx = genlik * Math.cos(n.a), dy = genlik * Math.sin(n.a);
          return (
            <circle key={i} cx={n.x} cy={n.y} r={7} fill={renk}>
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0; ${dx} ${dy}; ${-dy} ${dx}; ${-dx} ${-dy}; 0 0`}
                dur={`${sure.toFixed(2)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </g>
      <g>
        <rect x={286} y={50} width={14} height={150} rx={7} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
        <rect x={289} y={197 - T * 1.4} width={8} height={T * 1.4 + 3} rx={4} fill="var(--c2)" />
        <circle cx={293} cy={206} r={10} fill="var(--c2)" />
      </g>
      <text x={276} y={40} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">{T} °C</text>
      <text x={170} y={232} fontSize={12} fill="var(--muted)" textAnchor="middle">
        {T >= 80 ? "Tanecikler çok hızlı titreşiyor" : T >= 50 ? "Tanecikler hızlandı" : "Tanecikler yavaş titreşiyor"}
      </text>
    </svg>
  );
}

// Bir damla ve bir kova su, ikisi de 1 atm'de kaynıyor (100 °C).
function DamlaKova() {
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Kaynayan bir damla su ve kaynayan bir kova su, ikisi de 100 derece">
      <path d="M86 70 C86 70 62 104 62 122 C62 136 73 146 86 146 C99 146 110 136 110 122 C110 104 86 70 86 70 Z" fill="var(--c1)" opacity={0.85} />
      <g>
        <path d="M196 76 L208 170 L292 170 L304 76 Z" fill="var(--c1)" opacity={0.3} />
        <path d="M190 64 L204 172 L296 172 L310 64" fill="none" stroke="var(--ink)" strokeWidth={2} />
        <path d="M196 64 Q250 36 304 64" fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      </g>
      <g fill="var(--c1)" opacity={0.5}>
        <circle cx={232} cy={128} r={4} /><circle cx={258} cy={110} r={5} /><circle cx={276} cy={140} r={3.5} /><circle cx={246} cy={152} r={3} />
      </g>
      <g fontSize={13} fontWeight={700} textAnchor="middle" fill="var(--ink)">
        <text x={86} y={176}>bir damla</text>
        <text x={250} y={198}>bir kova</text>
      </g>
      <g fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--c2)">
        <text x={86} y={30}>100 °C</text>
        <text x={250} y={30}>100 °C</text>
      </g>
    </svg>
  );
}

// Üç ölçekli termometre. v.t: Celsius sıcaklığı. T = t + 273, F = 1,8·t + 32.
function Termometre({ v }: SahneProps) {
  const t = v.t ?? 0, ALT = 186, UST = 46, y = (c: number) => ALT - ((c + 10) / 120) * (ALT - UST);
  const kolon = [
    { x: 104, ad: "Celsius", d: (c: number) => `${say(c, 1)} °C` },
    { x: 194, ad: "Kelvin", d: (c: number) => `${say(c + 273, 1)} K` },
    { x: 284, ad: "Fahrenheit", d: (c: number) => `${say(1.8 * c + 32, 1)} °F` },
  ];
  const tam = t === 27;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${t} santigrat derece, ${t + 273} kelvin, ${1.8 * t + 32} fahrenhayt`}>
      {[0, 100].map((c) => (
        <g key={c}>
          <line x1={80} x2={330} y1={y(c)} y2={y(c)} stroke="var(--line-2)" strokeDasharray="4 4" />
          <text x={10} y={y(c) + 4} fontSize={11} fill="var(--muted)">{c === 0 ? "su donar" : "su kaynar"}</text>
        </g>
      ))}
      {kolon.map((k) => (
        <g key={k.ad}>
          <rect x={k.x - 8} y={UST - 6} width={16} height={ALT - UST + 12} rx={8} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
          <rect x={k.x - 4} y={y(t)} width={8} height={ALT + 4 - y(t)} rx={4} fill="var(--c2)" />
          <circle cx={k.x} cy={ALT + 10} r={10} fill="var(--c2)" />
          <g fontSize={11} fill="var(--muted)">
            <text x={k.x + 13} y={y(0) + 13}>{k.d(0)}</text>
            <text x={k.x + 13} y={y(100) + 13}>{k.d(100)}</text>
          </g>
        </g>
      ))}
      {kolon.map((k) => (
        <g key={`a${k.ad}`} textAnchor="middle">
          <text x={k.x} y={216} fontSize={11.5} fill="var(--muted)" fontWeight={700}>{k.ad}</text>
          <text x={k.x} y={234} fontSize={14} fill={tam ? "var(--good)" : "var(--ink)"} fontWeight={800}>{k.d(t)}</text>
        </g>
      ))}
    </svg>
  );
}

// Aynı ısıtıcılar 100 g suya ve 100 g demire 1000 cal verir (sure 3). Su 10 °C, demir ≈ 91 °C ısınır.
function OzIsi({ t, oynuyor }: SahneProps) {
  const u = oynuyor || t > 0 ? yumusak(t / 2.6) : 0, bitti = !oynuyor && t > 0;
  const su = 20 + 10 * u, demir = 20 + 91 * u, K = 0.95, ALT = 150;
  const kolon = (x: number, T: number) => (
    <g>
      <rect x={x - 6} y={34} width={12} height={ALT - 30} rx={6} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
      <rect x={x - 3} y={ALT - T * K} width={6} height={T * K + 2} rx={3} fill="var(--c2)" />
      <circle cx={x} cy={ALT + 8} r={8} fill="var(--c2)" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Su ${Math.round(su)} derece, demir ${Math.round(demir)} derece`}>
      <g>
        <path d="M40 104 L46 176 L114 176 L120 104 Z" fill="var(--c1)" opacity={0.3} />
        <path d="M38 92 L46 178 L114 178 L122 92" fill="none" stroke="var(--ink)" strokeWidth={2} />
      </g>
      <rect x={216} y={128} width={56} height={48} rx={4} fill="#9aa8ba" />
      <g fill="var(--ink)">
        <rect x={34} y={182} width={92} height={12} rx={3} />
        <rect x={198} y={182} width={92} height={12} rx={3} />
      </g>
      <g fill="var(--c4)" opacity={u > 0 && !bitti ? 1 : 0.35}>
        <path d="M70 196 q6 10 0 16 q-6 -6 0 -16 Z M90 196 q6 10 0 16 q-6 -6 0 -16 Z" />
        <path d="M234 196 q6 10 0 16 q-6 -6 0 -16 Z M254 196 q6 10 0 16 q-6 -6 0 -16 Z" />
      </g>
      {kolon(140, su)}
      {kolon(306, demir)}
      <g fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--ink)">
        <text x={80} y={232}>100 g su</text>
        <text x={244} y={232}>100 g demir</text>
      </g>
      <g fontSize={14} fontWeight={800} textAnchor="end">
        <text x={132} y={30} fill="var(--ink)">{Math.round(su)} °C</text>
        <text x={298} y={30} fill="var(--ink)">{Math.round(demir)} °C</text>
      </g>
      <text x={170} y={249} fontSize={11.5} fill="var(--muted)" textAnchor="middle">{bitti ? "İkisi de 1000 cal aldı" : "İkisi de aynı ısıtıcıda"}</text>
    </svg>
  );
}

// 80 °C'de 200 g sıcak su + 20 °C'de m g soğuk su. v.m: soğuk suyun kütlesi (g).
function Karisim({ v }: SahneProps) {
  const m = v.m ?? 100, T = (200 * 80 + m * 20) / (200 + m), tam = m === 300;
  const kap = (x: number, h: number, renk: string, ust: string, alt: string) => (
    <g>
      <rect x={x - 32} y={150 - h} width={64} height={h} fill={renk} opacity={0.35} />
      <path d={`M${x - 34} 70 L${x - 34} 152 L${x + 34} 152 L${x + 34} 70`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={x} y={172} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">{ust}</text>
      <text x={x} y={188} fontSize={12} fill="var(--muted)" textAnchor="middle">{alt}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`200 gram 80 derece su ile ${m} gram 20 derece su karışınca ${say(T, 1)} derece olur`}>
      {kap(56, 26, "var(--c2)", "200 g", "80 °C")}
      {kap(152, m * 0.13, "var(--c1)", `${m} g`, "20 °C")}
      <g>
        <path d="M206 108 L226 108" stroke="var(--muted)" strokeWidth={2} />
        <path d="M232 108 L222 102 L222 114 Z" fill="var(--muted)" />
      </g>
      {kap(282, (200 + m) * 0.13 > 80 ? 80 : (200 + m) * 0.13, "var(--c5)", `${200 + m} g`, "karışım")}
      <text x={282} y={56} fontSize={16} fontWeight={800} fill={tam ? "var(--good)" : "var(--ink)"} textAnchor="middle">{say(T, 1)} °C</text>
      <text x={170} y={226} fontSize={12.5} fill="var(--muted)" textAnchor="middle">
        alınan = verilen: 200·(80 − T) = {m}·(T − 20)
      </text>
    </svg>
  );
}

// 0 °C'de 10 g buz. v.Q: verilen ısı (cal). Erime ısısı 80 cal/g; buz bitince su ısınır (1 cal/g·°C).
function Erime({ v }: SahneProps) {
  const Q = v.Q ?? 0, eriyen = Math.min(10, Q / 80), buz = 10 - eriyen;
  const T = Q <= 800 ? 0 : (Q - 800) / 10, tam = Q === 800;
  const kup = Array.from({ length: 10 }, (_, i) => ({ x: 104 + (i % 5) * 27, y: 128 - Math.floor(i / 5) * 27 }));
  const su = 8 + eriyen * 5.4;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${Q} kalori verildi: ${say(buz, 1)} gram buz, ${say(eriyen, 1)} gram su, ${say(T, 1)} derece`}>
      <rect x={96} y={168 - su} width={148} height={su} fill="var(--c1)" opacity={0.3} />
      <g>
        {kup.map((k, i) => {
          const kalan = Math.max(0, Math.min(1, buz - i));
          if (kalan <= 0) return null;
          const s = 22 * Math.sqrt(kalan);
          return <rect key={i} x={k.x + (22 - s) / 2} y={k.y + (22 - s) / 2} width={s} height={s} rx={4} fill="#cfe3f7" stroke="var(--c1)" strokeWidth={1.4} />;
        })}
      </g>
      <path d="M90 60 L90 170 L250 170 L250 60" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g>
        <rect x={282} y={50} width={14} height={124} rx={7} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
        <rect x={285} y={146 - T * 1.6} width={8} height={T * 1.6 + 26} rx={4} fill="var(--c2)" />
        <circle cx={289} cy={180} r={10} fill="var(--c2)" />
      </g>
      <text x={289} y={36} fontSize={14} fontWeight={800} fill={tam ? "var(--good)" : "var(--ink)"} textAnchor="middle">{say(T, 1)} °C</text>
      <g fontSize={12.5} fontWeight={700} textAnchor="middle">
        <text x={110} y={200} fill="var(--c1)">buz: {say(buz, 2)} g</text>
        <text x={230} y={200} fill="var(--ink)">su: {say(eriyen, 2)} g</text>
      </g>
      <text x={170} y={226} fontSize={12} fill="var(--muted)" textAnchor="middle">Verilen ısı: {Q} cal</text>
    </svg>
  );
}

// 10 m'lik iki çelik ray, arada 6 mm boşluk. v.dT: sıcaklık artışı. ΔL = 10 000 mm × 1,2·10⁻⁵ × ΔT.
function Ray({ v }: SahneProps) {
  const dT = v.dT ?? 0, dL = 0.12 * dT, bosluk = 6 - dL, egri = bosluk < 0;
  const K = 6, ORTA = 170, Y = 110; // 1 mm = 6 px (boşluk büyütülmüş)
  const yari = (Math.max(0, bosluk) * K) / 2, sol = ORTA - yari, sag = ORTA + yari; // raylar boşluğa doğru uzar
  const g = Math.max(0, -bosluk) * 6;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Sıcaklık ${dT} derece arttı, ray ${say(dL)} milimetre uzadı`}>
      <path d={`M10 ${Y} Q${(10 + sol) / 2} ${Y - g} ${sol} ${Y}`} fill="none" stroke="#9aa8ba" strokeWidth={16} />
      <path d={`M${sag} ${Y} Q${(sag + 330) / 2} ${Y - g} 330 ${Y}`} fill="none" stroke="#9aa8ba" strokeWidth={16} />
      {bosluk <= 0 && <line x1={ORTA} x2={ORTA} y1={Y - 8} y2={Y + 8} stroke="#fff" strokeWidth={1.5} />}
      <g fill="var(--ink)" opacity={0.65}>
        {[40, 90, 250, 300].map((x) => <rect key={x} x={x - 4} y={Y + 10} width={8} height={18} rx={2} />)}
      </g>
      {!egri && (
        <g>
          <line x1={sol} x2={sag} y1={Y - 26} y2={Y - 26} stroke="var(--fizik)" strokeWidth={1.4} />
          <line x1={sol} x2={sol} y1={Y - 32} y2={Y - 20} stroke="var(--fizik)" strokeWidth={1.4} />
          <line x1={sag} x2={sag} y1={Y - 32} y2={Y - 20} stroke="var(--fizik)" strokeWidth={1.4} />
          <text x={ORTA} y={Y - 38} fontSize={12} fontWeight={800} fill="var(--fizik)" textAnchor="middle">boşluk {say(Math.max(0, bosluk), 1)} mm</text>
        </g>
      )}
      <text x={170} y={182} fontSize={14} fontWeight={800} textAnchor="middle" fill={dT === 50 ? "var(--good)" : "var(--ink)"}>
        ΔL = 10 m × 1,2·10⁻⁵ × {dT} = {say(dL, 1)} mm
      </text>
      <text x={170} y={206} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={egri ? "var(--bad)" : dT === 50 ? "var(--good)" : "var(--muted)"}>
        {egri ? "Boşluk yetmedi: raylar birbirini itip eğrildi" : bosluk === 0 ? "Raylar tam birbirine değdi" : "Raylar arasında hâlâ boşluk var"}
      </text>
      <text x={170} y={228} fontSize={11} fill="var(--muted)" textAnchor="middle">Boşluk ve uzama çizimde büyütüldü.</text>
    </svg>
  );
}

/* ---------- vektörler ---------- */

// Bir kutu ve 10 N'luk kuvvet: hangi yöne? Yanında yalnızca sayı + birimle anlatılan büyüklükler.
function Buyukluk() {
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Kutuya 10 newtonluk bir kuvvet uygulanıyor ama yönü belli değil">
      <line x1={20} x2={210} y1={160} y2={160} stroke="var(--ink)" strokeWidth={2} />
      <rect x={90} y={112} width={48} height={48} rx={4} fill="var(--c4)" />
      <g opacity={0.8}>
        <Ok x1={144} y1={136} x2={196} y2={136} renk="var(--c2)" kalin={2.5} kesik />
        <Ok x1={84} y1={136} x2={32} y2={136} renk="var(--c2)" kalin={2.5} kesik />
        <Ok x1={114} y1={106} x2={114} y2={56} renk="var(--c2)" kalin={2.5} kesik />
      </g>
      <text x={114} y={42} fontSize={16} fontWeight={800} fill="var(--c2)" textAnchor="middle">10 N ?</text>
      <g fontSize={13} fontWeight={700} fill="var(--ink)">
        <text x={234} y={84}>kütle: 5 kg</text>
        <text x={234} y={112}>sıcaklık: 20 °C</text>
        <text x={234} y={140}>zaman: 3 s</text>
      </g>
      <text x={170} y={206} fontSize={12} fill="var(--muted)" textAnchor="middle">Kuvvet aynı: 10 N. Kutu nereye kayar?</text>
    </svg>
  );
}

const OX = 170, OY = 120, BIR = 26; // ızgara merkezi ve 1 birim

// Izgarada vektör. v.L: büyüklük (birim), v.a: +x ekseniyle açı (°).
function VektorCiz({ v }: SahneProps) {
  const L = v.L ?? 2, a = v.a ?? 0, r = (a * Math.PI) / 180;
  const x2 = OX + L * BIR * Math.cos(r), y2 = OY - L * BIR * Math.sin(r);
  const tam = L === 3 && a === 135;
  const yay = 22, ax = OX + yay * Math.cos(r), ay = OY - yay * Math.sin(r);
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Boyu ${L} birim, açısı ${a} derece olan vektör`}>
      <Izgara x0={OX - 6 * BIR} y0={OY - 4 * BIR} n={12} m={8} k={BIR} />
      <g stroke="var(--ink)" strokeWidth={1.4}>
        <line x1={OX - 6 * BIR} x2={OX + 6 * BIR} y1={OY} y2={OY} />
        <line x1={OX} x2={OX} y1={OY - 4 * BIR} y2={OY + 4 * BIR} />
      </g>
      <text x={OX + 6 * BIR - 4} y={OY - 6} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="end">+x</text>
      {a > 0 && (
        <path d={`M${OX + yay} ${OY} A${yay} ${yay} 0 ${a > 180 ? 1 : 0} 0 ${ax} ${ay}`} fill="none" stroke="var(--c4)" strokeWidth={2} />
      )}
      <Ok x1={OX} y1={OY} x2={x2} y2={y2} renk={tam ? "var(--good)" : "var(--fizik)"} kalin={3.5} />
      <circle cx={OX} cy={OY} r={4} fill="var(--ink)" />
      <text x={170} y={246} fontSize={14} fontWeight={800} fill={tam ? "var(--good)" : "var(--ink)"} textAnchor="middle">
        |A| = {L} birim, θ = {a}°
      </text>
    </svg>
  );
}

// Uç uca toplama: A = 3 birim doğu, B = 4 birim, v.b: B'nin +x ile açısı (0–180°).
function Toplama({ v }: SahneProps) {
  const b = v.b ?? 0, r = (b * Math.PI) / 180, K = 24, X0 = 92, Y0 = 186;
  const kay = b === 180 ? -10 : 0; // zıt yönde B, A'nın üstüne binmesin
  const ax = X0 + 3 * K, bx = ax + 4 * K * Math.cos(r), by = Y0 - 4 * K * Math.sin(r) + kay;
  const R = Math.hypot(3 + 4 * Math.cos(r), 4 * Math.sin(r)), tam = b === 90;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`B'nin açısı ${b} derece, bileşke ${say(R, 2)} birim`}>
      <Izgara x0={20} y0={Y0 - 7 * K} n={12} m={7} k={K} />
      <Ok x1={X0} y1={Y0} x2={bx} y2={by - kay} renk={tam ? "var(--good)" : "var(--c3)"} kalin={2.5} kesik />
      <Ok x1={X0} y1={Y0} x2={ax} y2={Y0} renk="var(--fizik)" kalin={3.5} />
      <Ok x1={ax} y1={Y0 + kay} x2={bx} y2={by} renk="var(--c2)" kalin={3.5} />
      <g fontSize={13} fontWeight={800}>
        <text x={(X0 + ax) / 2} y={Y0 + 20} fill="var(--fizik)" textAnchor="middle">A = 3</text>
        <text x={b >= 150 ? (ax + bx) / 2 : (ax + bx) / 2 + 10} y={b >= 150 ? by - 12 : (Y0 + by) / 2} fill="var(--c2)" textAnchor={b >= 150 ? "middle" : "start"}>B = 4</text>
      </g>
      <circle cx={X0} cy={Y0} r={4} fill="var(--ink)" />
      <text x={170} y={242} fontSize={14} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--c3)"}>
        bileşke R = {say(R, 2)} birim
      </text>
    </svg>
  );
}

// Vektörü bir sayıyla çarpma: A = 2 birim doğu, v.k: çarpan.
function Carpma({ v }: SahneProps) {
  const k = v.k ?? 1, K = 30, X0 = 170;
  const tam = k === -2;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${say(k)} çarpı A: boyu ${say(Math.abs(k) * 2)} birim, ${k < 0 ? "ters" : "aynı"} yönde`}>
      <Izgara x0={20} y0={34} n={10} m={5} k={K} />
      <Ok x1={X0} y1={64} x2={X0 + 2 * K} y2={64} renk="var(--fizik)" kalin={3.5} />
      <text x={X0 - 10} y={69} fontSize={13} fontWeight={800} fill="var(--fizik)" textAnchor="end">A</text>
      {k !== 0 && <Ok x1={X0} y1={154} x2={X0 + 2 * k * K} y2={154} renk={tam ? "var(--good)" : "var(--c2)"} kalin={3.5} />}
      <circle cx={X0} cy={154} r={4} fill="var(--ink)" />
      <circle cx={X0} cy={64} r={4} fill="var(--ink)" />
      <text x={k < 0 ? X0 + 12 : X0 - 12} y={140} fontSize={13} fontWeight={800} fill="var(--c2)" textAnchor={k < 0 ? "start" : "end"}>{say(k).replace("-", "−")}·A</text>
      <text x={170} y={208} fontSize={14} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        boy: {say(Math.abs(k))} × 2 = {say(Math.abs(k) * 2)} birim · {k === 0 ? "vektör yok" : k < 0 ? "yön ters" : "yön aynı"}
      </text>
    </svg>
  );
}

// V = 10 birimlik vektörün bileşenleri. v.a: açı (°).
function Bilesen({ v }: SahneProps) {
  const a = v.a ?? 60, r = (a * Math.PI) / 180, K = 15, X0 = 60, Y0 = 196;
  const vx = 10 * Math.cos(r), vy = 10 * Math.sin(r);
  const ux = X0 + vx * K, uy = Y0 - vy * K, tam = a === 30;
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label={`Açı ${a} derece: yatay bileşen ${say(vx, 2)}, düşey bileşen ${say(vy, 2)}`}>
      <g stroke="var(--ink)" strokeWidth={1.4}>
        <line x1={X0} x2={X0 + 168} y1={Y0} y2={Y0} />
        <line x1={X0} x2={X0} y1={Y0} y2={Y0 - 168} />
      </g>
      <Ok x1={X0} y1={Y0} x2={ux} y2={Y0} renk="var(--c1)" kalin={3} />
      <Ok x1={ux} y1={Y0} x2={ux} y2={uy} renk={tam ? "var(--good)" : "var(--c2)"} kalin={3} />
      <Ok x1={X0} y1={Y0} x2={ux} y2={uy} renk="var(--ink)" kalin={3.5} />
      {a > 0 && a < 90 && <path d={`M${X0 + 28} ${Y0} A28 28 0 0 0 ${X0 + 28 * Math.cos(r)} ${Y0 - 28 * Math.sin(r)}`} fill="none" stroke="var(--c4)" strokeWidth={2} />}
      <g fontSize={13} fontWeight={800}>
        <text x={244} y={70} fill="var(--ink)">V = 10</text>
        <text x={244} y={96} fill="var(--c4)">θ = {a}°</text>
        <text x={244} y={130} fill="var(--c1)">Vx = {say(vx, 2)}</text>
        <text x={244} y={156} fill={tam ? "var(--good)" : "var(--c2)"}>Vy = {say(vy, 2)}</text>
      </g>
      <text x={170} y={234} fontSize={12} fill="var(--muted)" textAnchor="middle">Vx = V·cosθ, Vy = V·sinθ</text>
    </svg>
  );
}

// 3 adım doğu, sonra v.k adım kuzey. Başlangıca uzaklık √(3² + k²).
function Yuruyus({ v }: SahneProps) {
  const d = 3, k = v.k ?? 0, K = 22, X0 = 110, Y0 = 204;
  const ex = X0 + d * K, ey = Y0 - k * K, R = Math.hypot(d, k), tam = k === 4;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`3 adım doğu, ${k} adım kuzey: başlangıca ${say(R, 2)} adım`}>
      <Izgara x0={X0 - 2 * K} y0={Y0 - 8 * K} n={7} m={8} k={K} />
      <Ok x1={X0} y1={Y0} x2={ex} y2={Y0} renk="var(--c1)" kalin={3} />
      {k > 0 && <Ok x1={ex} y1={Y0} x2={ex} y2={ey} renk="var(--c3)" kalin={3} />}
      {k > 0 && <Ok x1={X0} y1={Y0} x2={ex} y2={ey} renk={tam ? "var(--good)" : "var(--c2)"} kalin={3} kesik />}
      <circle cx={X0} cy={Y0} r={5} fill="var(--ink)" />
      <g fontSize={12.5} fontWeight={800}>
        <text x={X0 + 1.5 * K} y={Y0 + 18} fill="var(--c1)" textAnchor="middle">3 doğu</text>
        {k > 0 && <text x={ex + 8} y={(Y0 + ey) / 2 + 4} fill="var(--c3)">{k} kuzey</text>}
        <text x={X0 - 8} y={Y0 + 18} fill="var(--ink)" textAnchor="end">başla</text>
      </g>
      <text x={X0 + 5 * K + 8} y={Y0 - 8 * K + 12} fontSize={12} fontWeight={700} fill="var(--muted)">K ↑</text>
      <text x={170} y={244} fontSize={14} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        uzaklık = √(3² + {k}²) = {say(R, 2)} adım
      </text>
    </svg>
  );
}

export const FIZIK3: Record<string, SahneKaydi> = {
  "fiz3-tanecik": { C: Tanecik },
  "fiz3-damla-kova": { C: DamlaKova },
  "fiz3-termometre": { C: Termometre },
  "fiz3-ozisi": { C: OzIsi },
  "fiz3-karisim": { C: Karisim },
  "fiz3-erime": { C: Erime },
  "fiz3-ray": { C: Ray },
  "fiz3-buyukluk": { C: Buyukluk },
  "fiz3-vektor": { C: VektorCiz },
  "fiz3-toplama": { C: Toplama },
  "fiz3-carpma": { C: Carpma },
  "fiz3-bilesen": { C: Bilesen },
  "fiz3-yuruyus": { C: Yuruyus },
};
