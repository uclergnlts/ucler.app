// Canlı simülasyonlar: sahne Oynat beklemeden sürekli çalışır (saat), öğrenci bir değeri sürükleyince sonuç
// anında değişir. Görev türü "kesfet": aşağıdaki bulguları öğrenci kendisi deneyerek bulur.
import { useEffect, useRef, useState } from "react";
import { Balon, rastgele, svgNokta, type SahneKaydi, type SahneProps } from "./ortak";
import { PH_RENK } from "./kimya6";

const say = (x: number, d = 1) => x.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/**
 * Sahnede bir süre (0,6 s) değişmeden kalan durumları hatırlar; şimdiki durum dışındaki son n tanesini döndürür.
 * Öğrenci kaydırırken aradan geçilen değerler değil, durup baktığı değerler iz olarak kalır.
 */
function useIzler(anahtar: string, saat: number, n = 2) {
  const r = useRef({ aday: anahtar, since: saat, liste: [] as string[] });
  const m = r.current;
  if (m.aday !== anahtar) { m.aday = anahtar; m.since = saat; }
  else if (saat - m.since > 0.6 && m.liste[m.liste.length - 1] !== anahtar) m.liste = [...m.liste.filter((x) => x !== anahtar), anahtar].slice(-(n + 1));
  return m.liste.filter((x) => x !== anahtar).slice(-n);
}

/** Kare başına geçen süre (saat iki çizim arasında ne kadar ilerledi). */
function useAdim(saat: number) {
  const r = useRef(saat);
  const dt = sinir(saat - r.current, 0, 0.1);
  r.current = saat;
  return dt;
}

/* ---------- fizik: eğik atış laboratuvarı ---------- */

const G = 9.8;
const atis = (a: number, v0: number) => {
  const r = (a * Math.PI) / 180, vx = v0 * Math.cos(r), vy = v0 * Math.sin(r), T = (2 * vy) / G;
  return { vx, vy, T, R: vx * T, H: (vy * vy) / (2 * G) };
};
/* Zemin 300 birim genişliğinde; ölçek ekrandaki yolların hepsi sığacak şekilde 25, 50 ya da 100 m seçilir. */
const AT = { X0: 26, Y0: 212, GEN: 300, YUK: 140, AMIN: 10, AMAX: 80 };
const OLCEKLER = [25, 50, 100];

function AtisLab({ v, set, saat = 0 }: SahneProps) {
  const a = v.a ?? 30, v0 = v.v ?? 20, u = atis(a, v0);
  const izler = useIzler(`${a}|${v0}`, saat).map((k) => k.split("|").map(Number));
  // Ölçek: şimdiki yol ve izlerin hepsi sığsın (karşılaştırma aynı ölçekte kalır).
  const hepsi = [[a, v0], ...izler].map(([x, y]) => atis(x, y));
  const span = OLCEKLER.find((m) => hepsi.every((h) => h.R <= m * 0.96 && h.H * (AT.GEN / m) <= AT.YUK)) ?? 100;
  const PX = AT.GEN / span;
  const atX = (m: number) => AT.X0 + m * PX, atY = (m: number) => AT.Y0 - m * PX;
  const yolNoktalari = (a: number, v0: number, son?: number) => {
    const u = atis(a, v0), bit = son ?? u.T;
    return Array.from({ length: 41 }, (_, i) => { const t = (i / 40) * bit; return `${atX(u.vx * t).toFixed(1)},${atY(Math.max(0, u.vy * t - 0.5 * G * t * t)).toFixed(1)}`; }).join(" ");
  };

  // Top sürekli atılır: uçuş (1,6 kat hızlı) + yere değince kısa bekleme.
  const HIZ = 1.6, dongu = u.T / HIZ + 0.7, tau = Math.min(u.T, (saat % dongu) * HIZ);
  const bx = atX(u.vx * tau), by = atY(Math.max(0, u.vy * tau - 0.5 * G * tau * tau));
  const r = (a * Math.PI) / 180, nx = AT.X0 + 34 * Math.cos(r), ny = AT.Y0 - 34 * Math.sin(r);

  // Namluyu sürükleyerek açı seçmek.
  const svgRef = useRef<SVGSVGElement>(null);
  const [tutuyor, setTutuyor] = useState(false);
  const surukle = (e: React.PointerEvent) => {
    if (!tutuyor || !svgRef.current) return;
    const p = svgNokta(svgRef.current, e);
    const derece = (Math.atan2(AT.Y0 - p.y, p.x - AT.X0) * 180) / Math.PI;
    const yeni = sinir(Math.round(derece / 5) * 5, AT.AMIN, AT.AMAX);
    if (yeni !== a) set("a", yeni);
  };

  return (
    <svg ref={svgRef} viewBox="0 0 340 246" role="img" aria-label={`Açı ${a} derece, hız ${v0} metre bölü saniye: menzil ${say(u.R)} metre, tepe ${say(u.H)} metre`}
      onPointerMove={surukle} onPointerUp={() => setTutuyor(false)} onPointerCancel={() => setTutuyor(false)}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">θ = {a}° · v₀ = {v0} m/s</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">menzil {say(u.R)} m · tepe {say(u.H)} m · uçuş {say(u.T)} s</text>

      {/* zemin ve uzaklık işaretleri */}
      <line x1={8} x2={334} y1={AT.Y0} y2={AT.Y0} stroke="var(--ink)" strokeWidth={2} />
      <g fontSize={10} fill="var(--muted)" textAnchor="middle">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <g key={k}>
            <line x1={atX((k * span) / 5)} x2={atX((k * span) / 5)} y1={AT.Y0} y2={AT.Y0 + 5} stroke="var(--muted)" />
            <text x={atX((k * span) / 5)} y={AT.Y0 + 16} textAnchor={k === 5 ? "end" : "middle"}>{(k * span) / 5}{k === 5 ? " m" : ""}</text>
          </g>
        ))}
      </g>

      {/* önceki denemeler */}
      {izler.map(([ia, iv]) => (
        <g key={`${ia}|${iv}`}>
          <polyline points={yolNoktalari(ia, iv)} fill="none" stroke="var(--c5)" strokeWidth={1.6} opacity={0.4} />
          <line x1={atX(atis(ia, iv).R)} x2={atX(atis(ia, iv).R)} y1={AT.Y0 - 4} y2={AT.Y0 + 4} stroke="var(--c5)" strokeWidth={2} />
        </g>
      ))}
      {izler.length > 0 && (
        <text x={10} y={AT.Y0 + 32} fontSize={10.5} fontWeight={700} fill="var(--c5)">
          önceki: {izler.map(([ia, iv]) => `${ia}°, ${iv} m/s → ${say(atis(ia, iv).R)} m`).join(" · ")}
        </text>
      )}

      {/* şimdiki yol: kesik çizgi önizleme + topun geçtiği kısım */}
      <polyline points={yolNoktalari(a, v0)} fill="none" stroke="var(--c1)" strokeWidth={1.6} strokeDasharray="4 5" opacity={0.6} />
      {tau > 0 && <polyline points={yolNoktalari(a, v0, tau)} fill="none" stroke="var(--c1)" strokeWidth={2.6} />}
      <line x1={atX(u.R / 2)} x2={atX(u.R / 2)} y1={AT.Y0} y2={atY(u.H)} stroke="var(--c4)" strokeWidth={1.3} strokeDasharray="3 3" />
      <text x={atX(u.R / 2) + 5} y={atY(u.H / 2)} fontSize={10.5} fontWeight={700} fill="var(--c4)">{say(u.H)} m</text>
      <Balon x={atX(u.R)} y={AT.Y0 - 4} yazi={`${say(u.R)} m`} renk="var(--c1)" />

      {/* atıcı: sürüklenebilir namlu */}
      <line x1={AT.X0} y1={AT.Y0} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" />
      <circle cx={AT.X0} cy={AT.Y0} r={9} fill="var(--ink)" />
      <circle cx={bx} cy={Math.min(by, AT.Y0 - 6)} r={6} fill="var(--c1)" />
      <g className="ad-surukle" onPointerDown={(e) => { (e.currentTarget.ownerSVGElement ?? svgRef.current)?.setPointerCapture(e.pointerId); setTutuyor(true); }}>
        <circle cx={nx} cy={ny} r={18} fill="transparent" />
        <circle cx={nx} cy={ny} r={7} fill="#fff" stroke="var(--ink)" strokeWidth={2.5} />
      </g>
    </svg>
  );
}

/* ---------- kimya: pH laboratuvarı ---------- */

const KSU = 1e-14;
/** 1 L saf suya A mL 1 M HCl ve B mL 1 M NaOH: kuvvetli asit ve baz, suyun iyonlaşması da hesaba katılır. */
const phHesap = (A: number, B: number) => {
  const V = 1 + (A + B) / 1000, d = (A - B) / 1000 / V;
  const h = (d + Math.sqrt(d * d + 4 * KSU)) / 2;
  return { pH: -Math.log10(h), h, oh: KSU / h };
};
const ust = (n: number) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] ?? (c === "-" ? "⁻" : c)).join("");
const bilimsel = (x: number) => {
  let us = Math.floor(Math.log10(x)), k = x / 10 ** us;
  if (Number(k.toFixed(1)) >= 10) { us += 1; k /= 10; }
  return `${say(k)}×10${ust(us)}`;
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** pH ölçeğinin renkleri arasında yumuşak geçiş (evrensel indikatör). */
const phRengi = (p: number) => {
  const x = sinir(p, 0, 14), i = Math.min(13, Math.floor(x)), k = x - i;
  const [a, b] = [hex(PH_RENK[i]), hex(PH_RENK[i + 1])];
  return `rgb(${a.map((c, j) => Math.round(c + (b[j] - c) * k)).join(",")})`;
};
const iyonSayisi = (c: number) => sinir(Math.round(3 * (Math.log10(c) + 8)), 0, 24);
const KAP = { x0: 46, x1: 176, ust: 96, alt: 212 };
const IYON = (() => {
  const r = rastgele(41);
  return Array.from({ length: 48 }, () => ({ x: KAP.x0 + 12 + r() * (KAP.x1 - KAP.x0 - 24), y: KAP.ust + 14 + r() * (KAP.alt - KAP.ust - 26), f: r() * 6.28, h: 0.6 + r() * 0.8 }));
})();

function PhLab({ v, saat = 0 }: SahneProps) {
  const A = v.A ?? 0, B = v.B ?? 0, { pH, h, oh } = phHesap(A, B);
  const p = Math.round(pH * 10) / 10, durum = p < 7 ? "asidik" : p > 7 ? "bazik" : "nötr";
  const renk = phRengi(pH);
  // Damla: bir değer artınca damlalıktan yarım saniyelik bir damla düşer.
  const son = useRef({ A, B, tA: -9, tB: -9 });
  if (A > son.current.A) son.current.tA = saat;
  if (B > son.current.B) son.current.tB = saat;
  son.current.A = A; son.current.B = B;
  const damla = (t0: number, x: number, r: string) => {
    const u = (saat - t0) / 0.5;
    return u >= 0 && u < 1 ? <path d={`M${x} ${62 + u * 34} q-4 6 0 9 q4 -3 0 -9 Z`} fill={r} /> : null;
  };
  const nH = iyonSayisi(h), nO = iyonSayisi(oh);
  const iyon = (k: number, rr: string) => {
    const q = IYON[k];
    return <circle key={k} cx={q.x + Math.sin(saat * q.h + q.f) * 6} cy={q.y + Math.cos(saat * q.h * 0.8 + q.f) * 5} r={4.2} fill={rr} />;
  };
  const sx = (x: number) => 20 + (x / 14) * 300;
  return (
    <svg viewBox="0 0 340 276" role="img" aria-label={`pH ${say(p)}, ${durum}. Eklenen HCl ${say(A)} mililitre, NaOH ${say(B)} mililitre`}>
      {/* damlalıklar */}
      {[[92, "HCl", "var(--c2)"], [132, "NaOH", "var(--c1)"]].map(([x, ad, r]) => (
        <g key={ad as string}>
          <text x={x as number} y={20} fontSize={11.5} fontWeight={800} fill={r as string} textAnchor="middle">{ad}</text>
          <rect x={(x as number) - 7} y={26} width={14} height={18} rx={4} fill={r as string} opacity={0.85} />
          <path d={`M${(x as number) - 5} 44 L${(x as number) + 5} 44 L${(x as number) + 1.5} 62 L${(x as number) - 1.5} 62 Z`} fill="#fff" stroke="var(--line-2)" strokeWidth={1.4} />
        </g>
      ))}
      {damla(son.current.tA, 92, "var(--c2)")}
      {damla(son.current.tB, 132, "var(--c1)")}

      {/* beher */}
      <path d={`M${KAP.x0} ${KAP.ust} L${KAP.x0} ${KAP.alt - 10} Q${KAP.x0} ${KAP.alt} ${KAP.x0 + 10} ${KAP.alt} L${KAP.x1 - 10} ${KAP.alt} Q${KAP.x1} ${KAP.alt} ${KAP.x1} ${KAP.alt - 10} L${KAP.x1} ${KAP.ust} Z`} fill={renk} opacity={0.32} />
      <path d={`M${KAP.x0 - 4} 80 L${KAP.x0} 84 L${KAP.x0} ${KAP.alt - 10} Q${KAP.x0} ${KAP.alt} ${KAP.x0 + 10} ${KAP.alt} L${KAP.x1 - 10} ${KAP.alt} Q${KAP.x1} ${KAP.alt} ${KAP.x1} ${KAP.alt - 10} L${KAP.x1} 80`} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <line x1={KAP.x0} x2={KAP.x1} y1={KAP.ust} y2={KAP.ust} stroke={renk} strokeWidth={2} />
      <g>
        {Array.from({ length: nH }, (_, k) => iyon(k, "var(--c2)"))}
        {Array.from({ length: nO }, (_, k) => iyon(24 + k, "var(--c1)"))}
      </g>
      <g fontSize={11} fontWeight={700}>
        <circle cx={52} cy={230} r={4.2} fill="var(--c2)" /><text x={60} y={234} fill="var(--c2)">H₃O⁺</text>
        <circle cx={110} cy={230} r={4.2} fill="var(--c1)" /><text x={118} y={234} fill="var(--c1)">OH⁻</text>
      </g>

      {/* pH ölçer */}
      <text x={196} y={92} fontSize={12} fontWeight={700} fill="var(--muted)">pH</text>
      <text x={196} y={134} fontSize={40} fontWeight={800} fill="var(--ink)">{say(p)}</text>
      <text x={196} y={156} fontSize={13} fontWeight={800} fill={p < 7 ? "var(--c2)" : p > 7 ? "var(--c1)" : "var(--ink)"}>{durum}</text>
      <text x={196} y={184} fontSize={11.5} fontWeight={700} fill="var(--c2)">[H₃O⁺] = {bilimsel(h)} M</text>
      <text x={196} y={202} fontSize={11.5} fontWeight={700} fill="var(--c1)">[OH⁻] = {bilimsel(oh)} M</text>

      {/* pH ölçeği */}
      {PH_RENK.map((r, i) => <rect key={i} x={sx(i)} y={246} width={300 / 14 + 0.5} height={10} fill={r} />)}
      <path d={`M${sx(sinir(pH, 0, 14))} 244 l-5 -8 l10 0 Z`} fill="var(--ink)" />
      <g fontSize={10} fill="var(--muted)" textAnchor="middle">
        {[0, 7, 14].map((x) => <text key={x} x={sx(x)} y={270}>{x}</text>)}
      </g>
    </svg>
  );
}

/* ---------- biyoloji: enzim ve sıcaklık ---------- */

/** Enzimin bağıl hızı (0-1): 37 °C'de en yüksek, 53 °C'de sıfır (biyoloji2.tsx'teki eğriyle aynı). */
const enzimHiz = (T: number) => (T <= 37 ? Math.pow(T / 37, 1.6) : Math.max(0, 1 - Math.pow((T - 37) / 16, 2)));
/** Bu sıcaklıkta ya da üstünde enzim kalıcı olarak bozulur. */
const BOZULMA = 55;
const ENZ = [{ x: 46, y: 96, f: 0 }, { x: 92, y: 158, f: 0.38 }, { x: 40, y: 218, f: 0.71 }];
const GR = { x0: 226, x1: 330, y0: 84, y1: 170 };
const grX = (T: number) => GR.x0 + (T / 80) * (GR.x1 - GR.x0), grY = (h: number) => GR.y1 - h * (GR.y1 - GR.y0);

function Substrat({ x, y, ayril = 0, op = 1 }: { x: number; y: number; ayril?: number; op?: number }) {
  return (
    <g opacity={op}>
      <circle cx={x - 5 - ayril * 26} cy={y - ayril * 18} r={6} fill="var(--c4)" />
      <circle cx={x + 5 + ayril * 18} cy={y + ayril * 18} r={6} fill="var(--c4)" />
      {ayril === 0 && <rect x={x - 5} y={y - 2.5} width={10} height={5} fill="var(--c4)" />}
    </g>
  );
}

function EnzimLab({ v, saat = 0 }: SahneProps) {
  const T = v.T ?? 20, bozuk = v.bozuk === 1;
  const hiz = bozuk ? 0 : enzimHiz(T);
  // Şekil bozulması: 45 °C'den sonra artar; eşiği geçince kalıcıdır.
  const bicim = bozuk ? 1 : sinir((T - 45) / 10, 0, 1) * 0.6;
  // Her enzim kendi döngüsünde ilerler (bağlan → parçala → bırak); ürün sayısı hızın toplamıdır.
  const dt = useAdim(saat);
  const r = useRef({ faz: ENZ.map((e) => e.f), urun: 0 });
  r.current.faz = r.current.faz.map((f) => f + dt * hiz * 0.8);
  r.current.urun += dt * hiz * 0.8 * ENZ.length;
  const durum = bozuk ? "Denatüre: şekli kalıcı bozuldu" : T > 45 ? "Isı şeklini bozmaya başladı" : T >= 35 && T <= 39 ? "Optimum: en hızlı" : T <= 10 ? "Soğuk: çok yavaş ama sağlam" : "Çalışıyor";
  const renk = bozuk || T > 45 ? "var(--c2)" : T >= 35 && T <= 39 ? "var(--biyoloji)" : "var(--c1)";
  const egri = Array.from({ length: 81 }, (_, t) => `${grX(t).toFixed(1)},${grY(enzimHiz(t)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`${T} derece: ${durum}, hız yüzde ${Math.round(hiz * 100)}`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill={renk}>{durum}</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">{T} °C · hız %{Math.round(hiz * 100)}</text>
      <text x={330} y={22} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="end">ürün: {Math.floor(r.current.urun)}</text>

      {ENZ.map((e, k) => {
        const p = r.current.faz[k] % 1, titre = T > 45 && !bozuk ? Math.sin(saat * 30 + k) * 1.5 : 0;
        const bx = e.x + 15, by = e.y, sx = e.x + 70, sy = e.y - 16 + k * 8;
        let sub: React.ReactNode;
        if (bicim > 0.5) sub = <Substrat x={sx + Math.sin(saat + k) * 4} y={sy + Math.cos(saat * 0.8 + k) * 4} />;
        else if (p < 0.45) { const u = p / 0.45, w = u * u * (3 - 2 * u); sub = <Substrat x={sx + (bx - sx) * w} y={sy + (by - sy) * w} />; }
        else if (p < 0.6) sub = <Substrat x={bx} y={by} />;
        else { const u = (p - 0.6) / 0.4; sub = <Substrat x={bx + u * 20} y={by} ayril={u} op={1 - u} />; }
        return (
          <g key={k}>
            <g transform={`translate(${e.x + titre} ${e.y})`}>
              <path d="M17.5 -9 A20 20 0 1 0 17.5 9 L6 0 Z" fill="var(--biyoloji)" opacity={1 - bicim} />
              <path d="M-22 6 C-15 -20 -6 20 1 -6 S13 18 22 -10" fill="none" stroke="var(--c2)" strokeWidth={5} strokeLinecap="round" opacity={bicim} />
            </g>
            {sub}
          </g>
        );
      })}
      <text x={ENZ[0].x} y={ENZ[0].y + 36} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">enzim</text>

      {/* hız-sıcaklık grafiği */}
      <polyline points={egri} fill="none" stroke="var(--line-2)" strokeWidth={2.2} />
      <line x1={GR.x0} x2={GR.x1} y1={GR.y1} y2={GR.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={GR.x0} x2={GR.x0} y1={GR.y0 - 8} y2={GR.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={GR.x0 + 4} y={GR.y0 - 12} fontSize={10.5} fontWeight={700} fill="var(--ink)">hız</text>
      <g fontSize={10} fill="var(--muted)" textAnchor="middle">
        {[0, 40, 80].map((x) => <text key={x} x={grX(x)} y={GR.y1 + 14}>{x}</text>)}
        <text x={(GR.x0 + GR.x1) / 2} y={GR.y1 + 28}>sıcaklık (°C)</text>
      </g>
      <circle cx={grX(T)} cy={grY(hiz)} r={6} fill={renk} />
    </svg>
  );
}

/* ---------- fizik: sürtünme ve Newton yasaları ---------- */

/* g = 10 m/s², μs = 0,5, μk = 0,3. Kutu ortada durur, zemin kayar (kamera kutuyu izler). */
const SUR = { g: 10, MUS: 0.5, MUK: 0.3, ZEMIN: 168, KX: 168, PXM: 30, HMAX: 20 };

/** Sahnenin hesapladığı bir durumu (ör. kutu kayıyor mu) görev denetimine bildirir. */
function useBildir(v: Record<string, number>, set: SahneProps["set"], degerler: Record<string, number>) {
  useEffect(() => {
    for (const [ad, x] of Object.entries(degerler)) if ((v[ad] ?? 0) !== x) set(ad, x);
  });
}

function SurtunmeLab({ v, set, saat = 0 }: SahneProps) {
  const F = v.F ?? 0, m = v.m ?? 20, N = m * SUR.g, fsMax = SUR.MUS * N, fk = SUR.MUK * N;
  const dt = useAdim(saat);
  const r = useRef({ x: 0, hiz: 0 });
  const d = r.current;
  // Durgunken statik sürtünme itmeyi dengeler (en çok μs·N); kayarken kinetik sürtünme μk·N.
  let f: number, a = 0;
  if (d.hiz === 0 && F <= fsMax) { f = F; }
  else {
    f = fk; a = (F - fk) / m;
    d.hiz = Math.min(SUR.HMAX, d.hiz + a * dt);
    if (d.hiz <= 0) { d.hiz = 0; a = 0; f = Math.min(F, fsMax); }
  }
  d.x += d.hiz * dt;
  const kayiyor = d.hiz > 0 ? 1 : 0;
  useBildir(v, set, { kayiyor });
  const kay = (d.x * SUR.PXM) % 60;
  const okF = Math.min(130, F * 0.55), okf = Math.min(130, f * 0.55);
  const kenar = SUR.KX - 30;
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`${m} kilogram kutu, itme ${F} newton, sürtünme ${Math.round(f)} newton, ${kayiyor ? "kayıyor" : "duruyor"}`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill={kayiyor ? "var(--c1)" : "var(--ink)"}>
        {kayiyor ? (Math.abs(a) < 0.01 ? "Kayıyor: hız sabit" : a > 0 ? "Kayıyor: hızlanıyor" : "Kayıyor: yavaşlıyor") : "Duruyor: statik sürtünme itmeyi dengeliyor"}
      </text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">m = {m} kg · N = {N} N · hız {say(d.hiz)} m/s · a = {say(a)} m/s²</text>

      {/* zemin: kutu kayınca çizgiler geri akar */}
      <line x1={8} x2={334} y1={SUR.ZEMIN} y2={SUR.ZEMIN} stroke="var(--ink)" strokeWidth={2} />
      <g stroke="var(--line-2)" strokeWidth={2}>
        {Array.from({ length: 7 }, (_, k) => { const x = 10 + k * 60 - kay; return <line key={k} x1={x} x2={x - 10} y1={SUR.ZEMIN + 4} y2={SUR.ZEMIN + 14} />; })}
      </g>

      <rect x={kenar} y={SUR.ZEMIN - 50} width={60} height={50} rx={6} fill="var(--fizik-soft)" stroke="var(--fizik)" strokeWidth={2} />
      <text x={SUR.KX} y={SUR.ZEMIN - 20} fontSize={13} fontWeight={800} fill="var(--fizik)" textAnchor="middle">{m} kg</text>

      {/* itme (arkadan) ve sürtünme (tabanda, zıt yönde) */}
      {F > 0 && (
        <g>
          <line x1={kenar - okF} x2={kenar - 9} y1={SUR.ZEMIN - 25} y2={SUR.ZEMIN - 25} stroke="var(--c1)" strokeWidth={3.5} strokeLinecap="round" />
          <path d={`M${kenar} ${SUR.ZEMIN - 25} l-10 -6 l0 12 Z`} fill="var(--c1)" />
          <text x={kenar - 4} y={SUR.ZEMIN - 34} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="end">F = {F} N</text>
        </g>
      )}
      {f > 0 && (
        <g>
          <line x1={SUR.KX} x2={SUR.KX - okf + 9} y1={SUR.ZEMIN - 3} y2={SUR.ZEMIN - 3} stroke="var(--c2)" strokeWidth={3.5} strokeLinecap="round" />
          <path d={`M${SUR.KX - okf} ${SUR.ZEMIN - 3} l10 -6 l0 12 Z`} fill="var(--c2)" />
          <text x={SUR.KX} y={SUR.ZEMIN + 32} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">
            sürtünme {Math.round(f)} N ({kayiyor ? "kinetik" : "statik"})
          </text>
        </g>
      )}
      <g fontSize={11} fill="var(--muted)" fontWeight={700}>
        <text x={10} y={222}>statik sınır μs·N = {fsMax} N</text>
        <text x={330} y={222} textAnchor="end">kinetik μk·N = {fk} N</text>
      </g>
    </svg>
  );
}

/* ---------- kimya: ideal gaz pistonu ---------- */

const R_GAZ = 0.082;
const gazP = (n: number, Tc: number, V: number) => (n * R_GAZ * (Tc + 273)) / V;
const GZ = { x0: 16, ust: 74, alt: 178, VMAX: 25, GEN: 216 };
const TANE = (() => {
  const r = rastgele(7);
  return Array.from({ length: 28 }, () => ({ u: r(), w: r(), yx: r() < 0.5 ? -1 : 1, yy: r() < 0.5 ? -1 : 1, h: 0.7 + r() * 0.6, a: r() }));
})();
/** 0..W arasında gidip gelen konum (duvarlardan sekme). */
const sek = (s: number, W: number) => { const k = ((s % (2 * W)) + 2 * W) % (2 * W); return k > W ? 2 * W - k : k; };

function GazLab({ v, saat = 0 }: SahneProps) {
  const V = v.V ?? 24.6, Tc = v.T ?? 27, n = v.n ?? 1, TK = Tc + 273, P = gazP(n, Tc, V);
  const px = GZ.x0 + (V / GZ.VMAX) * GZ.GEN, ic = px - GZ.x0 - 12, yuk = GZ.alt - GZ.ust - 12;
  const hiz = 70 * Math.sqrt(TK / 300), adet = Math.round(n * 14);
  // Sıcaklık: soğukta mavimsi, sıcakta kırmızımsı.
  const k = sinir((TK - 200) / 400, 0, 1), renk = `rgb(${Math.round(120 + 135 * k)},${Math.round(170 - 60 * k)},${Math.round(240 - 150 * k)})`;
  const ibre = (sinir(P, 0, 6) / 6) * Math.PI * 1.4 - Math.PI * 1.2;
  const GX = 292, GY = 118;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`${n} mol gaz, ${Tc} santigrat derece, ${say(V)} litre: basınç ${say(P, 2)} atm`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">n = {say(n)} mol · T = {TK} K · V = {say(V)} L</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">P = n·R·T / V = {say(n)}·0,082·{TK} / {say(V)}</text>

      {/* silindir ve piston */}
      <rect x={GZ.x0} y={GZ.ust} width={px - GZ.x0} height={GZ.alt - GZ.ust} fill={renk} opacity={0.14} />
      <path d={`M${GZ.x0 + GZ.GEN + 8} ${GZ.ust} L${GZ.x0} ${GZ.ust} L${GZ.x0} ${GZ.alt} L${GZ.x0 + GZ.GEN + 8} ${GZ.alt}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={px} y={GZ.ust + 2} width={8} height={GZ.alt - GZ.ust - 4} rx={2} fill="var(--ink)" />
      <rect x={px + 8} y={(GZ.ust + GZ.alt) / 2 - 3} width={GZ.x0 + GZ.GEN + 30 - px} height={6} fill="var(--ink)" />
      <g>
        {TANE.slice(0, adet).map((q, i) => (
          <circle key={i} cx={GZ.x0 + 6 + sek(q.u * ic + q.yx * hiz * q.h * saat, ic)} cy={GZ.ust + 6 + sek(q.w * yuk + q.yy * hiz * q.h * 0.8 * saat, yuk)} r={4} fill="var(--kimya)" />
        ))}
      </g>

      {/* manometre */}
      <circle cx={GX} cy={GY} r={34} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
      {[0, 1, 2, 3, 4, 5, 6].map((x) => {
        const aci = (x / 6) * Math.PI * 1.4 - Math.PI * 1.2;
        return <text key={x} x={GX + Math.cos(aci) * 24} y={GY + Math.sin(aci) * 24 + 3.5} fontSize={9} fill="var(--muted)" textAnchor="middle">{x}</text>;
      })}
      <line x1={GX} y1={GY} x2={GX + Math.cos(ibre) * 28} y2={GY + Math.sin(ibre) * 28} stroke="var(--kimya)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={GX} cy={GY} r={3.5} fill="var(--ink)" />
      <text x={GX} y={GY + 54} fontSize={17} fontWeight={800} fill="var(--ink)" textAnchor="middle">{say(P, 2)} atm</text>
      <text x={GX} y={GY - 42} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">basınç</text>
      <text x={GZ.x0} y={GZ.alt + 18} fontSize={11} fontWeight={700} fill="var(--muted)">{Tc} °C</text>
    </svg>
  );
}

/* ---------- biyoloji: zardan difüzyon ---------- */

const ZR = { x0: 16, x1: 324, zar: 170, ust: 62, alt: 196, kanalUst: 102, kanalAlt: 156, HIZ: 80 };
type Tanecik = { x: number; y: number; a: number; tur: "o2" | "na" };
const yeniTanecikler = (): Tanecik[] => {
  const r = rastgele(Math.floor(Math.random() * 1e9));
  const yap = (tur: Tanecik["tur"]) => ({ x: ZR.x0 + 10 + r() * (ZR.zar - ZR.x0 - 24), y: ZR.ust + 8 + r() * (ZR.alt - ZR.ust - 16), a: r() * 6.28, tur });
  return [...Array.from({ length: 20 }, () => yap("o2")), ...Array.from({ length: 12 }, () => yap("na"))];
};

function ZarLab({ v, set, saat = 0 }: SahneProps) {
  const kanal = v.kanal === 1;
  const dt = useAdim(saat);
  const r = useRef<{ t: Tanecik[]; tur: number; gecis: { s: number; yon: number }[] } | null>(null);
  if (!r.current || r.current.tur !== (v.tur ?? 0)) r.current = { t: yeniTanecikler(), tur: v.tur ?? 0, gecis: [] };
  const d = r.current;
  // Rastgele yürüyüş: yön her karede biraz döner; dış duvarlardan seker. O₂ zardan geçer, Na⁺ yalnızca açık kanaldan.
  for (const q of d.t) {
    q.a += (Math.random() - 0.5) * 1.6;
    let x = q.x + Math.cos(q.a) * ZR.HIZ * dt, y = q.y + Math.sin(q.a) * ZR.HIZ * dt;
    if (y < ZR.ust + 5 || y > ZR.alt - 5) { q.a = -q.a; y = sinir(y, ZR.ust + 5, ZR.alt - 5); }
    if (x < ZR.x0 + 5 || x > ZR.x1 - 5) { q.a = Math.PI - q.a; x = sinir(x, ZR.x0 + 5, ZR.x1 - 5); }
    const once = q.x < ZR.zar, sonra = x < ZR.zar;
    if (once !== sonra) {
      const gecer = q.tur === "o2" || (kanal && y > ZR.kanalUst + 4 && y < ZR.kanalAlt - 4);
      if (!gecer) { q.a = Math.PI - q.a; x = q.x; }
      else if (q.tur === "o2") d.gecis.push({ s: saat, yon: sonra ? -1 : 1 });
    }
    q.x = x; q.y = y;
  }
  d.gecis = d.gecis.filter((g) => saat - g.s < 5);
  const say2 = (tur: Tanecik["tur"]) => [d.t.filter((q) => q.tur === tur && q.x < ZR.zar).length, d.t.filter((q) => q.tur === tur && q.x >= ZR.zar).length];
  const [o2s, o2g] = say2("o2"), [nas, nag] = say2("na");
  useBildir(v, set, { o2fark: Math.abs(o2s - o2g), nasag: nag });
  const saga = d.gecis.filter((g) => g.yon > 0).length, sola = d.gecis.length - saga;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`O2 solda ${o2s}, sağda ${o2g}; sodyum iyonu solda ${nas}, sağda ${nag}; kanal ${kanal ? "açık" : "kapalı"}`}>
      <g fontSize={12} fontWeight={700}>
        <text x={10} y={22} fill="var(--c1)">O₂: sol {o2s} · sağ {o2g}</text>
        <text x={330} y={22} fill="var(--c4)" textAnchor="end">Na⁺: sol {nas} · sağ {nag}</text>
        <text x={10} y={42} fill="var(--muted)">son 5 s O₂ geçişi: sağa {saga}, sola {sola}</text>
      </g>
      <rect x={ZR.x0} y={ZR.ust} width={ZR.x1 - ZR.x0} height={ZR.alt - ZR.ust} rx={10} fill="none" stroke="var(--line-2)" strokeWidth={1.5} />
      {/* zar: fosfolipit başları; kanal açıkken ortada protein kapısı */}
      <g fill="var(--biyoloji)">
        {Array.from({ length: 14 }, (_, k) => ZR.ust + 5 + k * 9.6).filter((y) => !kanal || y < ZR.kanalUst - 2 || y > ZR.kanalAlt + 2).map((y) => (
          <g key={y}><circle cx={ZR.zar - 4} cy={y} r={3.6} /><circle cx={ZR.zar + 4} cy={y} r={3.6} /></g>
        ))}
      </g>
      {kanal && (
        <g fill="var(--c5)" opacity={0.85}>
          <rect x={ZR.zar - 9} y={ZR.kanalUst - 8} width={18} height={9} rx={4} />
          <rect x={ZR.zar - 9} y={ZR.kanalAlt - 1} width={18} height={9} rx={4} />
        </g>
      )}
      {d.t.map((q, i) => (q.tur === "o2"
        ? <circle key={i} cx={q.x} cy={q.y} r={3.6} fill="var(--c1)" />
        : <circle key={i} cx={q.x} cy={q.y} r={5} fill="var(--c4)" />))}
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <text x={ZR.zar} y={ZR.alt + 16} textAnchor="middle">hücre zarı</text>
        {kanal && <text x={ZR.zar + 14} y={ZR.kanalUst - 12} fill="var(--c5)">kanal proteini</text>}
      </g>
    </svg>
  );
}

/* ---------- fizik: kaykay rampası ve enerjinin korunumu ---------- */

/* Rampa y = k·x² (m), g = 10 m/s². Kaykaycı x0 = −√(h/k)'den durgun bırakılır. Sürtünme açıkken μ = 0,25. */
const RP = { k: 0.2, g: 10, MU: 0.25, X0: 170, Y0: 196, PXM: 28 };
const rpX = (x: number) => RP.X0 + x * RP.PXM, rpY = (y: number) => RP.Y0 - y * RP.PXM;

function RampaLab({ v, set, saat = 0 }: SahneProps) {
  const h = v.h ?? 2, m = v.m ?? 40, sur = v.sur === 1;
  const dt = useAdim(saat);
  const anahtar = `${h}|${m}|${v.sur ?? 0}`;
  const r = useRef({ anahtar: "", x: 0, hiz: 0, dur: false });
  const d = r.current;
  if (d.anahtar !== anahtar) Object.assign(d, { anahtar, x: -Math.sqrt(h / RP.k), hiz: 0, dur: false });
  // Eğim boyunca hareket: a = −g·sinθ − μ·g·cosθ·yön. Kararlılık için kareyi küçük adımlara böl.
  for (let i = 0; i < 8 && !d.dur; i++) {
    const e = dt / 8, egim = 2 * RP.k * d.x, th = Math.atan(egim), cos = Math.cos(th);
    let a = -RP.g * Math.sin(th);
    if (sur) {
      if (Math.abs(d.hiz) < 0.05 && Math.abs(egim) < RP.MU) { d.hiz = 0; d.dur = true; break; }
      a -= Math.sign(d.hiz || -egim) * RP.MU * RP.g * cos;
    }
    const once = d.hiz;
    d.hiz += a * e;
    if (sur && once !== 0 && Math.sign(once) !== Math.sign(d.hiz) && Math.abs(egim) < RP.MU) { d.hiz = 0; d.dur = true; }
    const ds = d.hiz * e;
    d.x += ds * cos;
  }
  const y = RP.k * d.x * d.x, PE = m * RP.g * y, KE = 0.5 * m * d.hiz * d.hiz, top = m * RP.g * h;
  // Isı, kaybolan mekanik enerjidir (sayısal adımların küçük hatası çubuğu taşırmasın).
  const isi = sur ? Math.max(0, top - PE - KE) : 0;
  const durdu = sur && (d.dur || PE + KE < top * 0.03) ? 1 : 0;
  useBildir(v, set, { durdu });
  const xm = Math.sqrt(5.4 / RP.k);
  const yol = Array.from({ length: 61 }, (_, i) => { const x = -xm + (i / 60) * 2 * xm; return `${rpX(x).toFixed(1)},${rpY(RP.k * x * x).toFixed(1)}`; }).join(" ");
  const egim = Math.atan(2 * RP.k * d.x), kx = rpX(d.x) - Math.sin(egim) * 3, ky = rpY(y) - Math.cos(egim) * 3;
  const genis = 300, bar = (e: number) => (e / Math.max(top, 1)) * genis;
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`${m} kilogram, ${h} metreden bırakıldı; kinetik ${Math.round(KE)}, potansiyel ${Math.round(PE)}, ısı ${Math.round(isi)} joule`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">h = {h} m · m = {m} kg · hız {say(Math.abs(d.hiz))} m/s</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">{sur ? "sürtünme açık (μ = 0,25)" : `sürtünmesiz: en altta v = √(2gh) = ${say(Math.sqrt(2 * RP.g * h))} m/s`}</text>
      <polyline points={yol} fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
      <line x1={rpX(-xm)} x2={rpX(xm)} y1={rpY(h)} y2={rpY(h)} stroke="var(--c3)" strokeDasharray="4 4" opacity={0.6} />
      <text x={rpX(xm) + 4} y={rpY(h) + 4} fontSize={10.5} fontWeight={700} fill="var(--c3)" textAnchor="end">{h} m</text>
      <g transform={`translate(${kx} ${ky}) rotate(${(-egim * 180) / Math.PI})`}>
        <rect x={-11} y={-3} width={22} height={4} rx={2} fill="var(--ink)" />
        <circle cx={0} cy={-11} r={7} fill="var(--fizik)" />
      </g>
      {/* enerji çubuğu: üç parçanın toplamı hep aynı uzunlukta */}
      <g>
        <rect x={20} y={222} width={bar(KE)} height={14} fill="var(--c1)" />
        <rect x={20 + bar(KE)} y={222} width={bar(PE)} height={14} fill="var(--c3)" />
        <rect x={20 + bar(KE) + bar(PE)} y={222} width={bar(isi)} height={14} fill="var(--c2)" />
        <rect x={20} y={222} width={genis} height={14} fill="none" stroke="var(--line-2)" />
      </g>
      <g fontSize={10.5} fontWeight={700}>
        <text x={20} y={252} fill="var(--c1)">kinetik {Math.round(KE)} J</text>
        <text x={130} y={252} fill="var(--c3)">potansiyel {Math.round(PE)} J</text>
        <text x={320} y={252} fill="var(--c2)" textAnchor="end">ısı {Math.round(isi)} J</text>
      </g>
    </svg>
  );
}

/* ---------- kimya: çarpışma ve tepkime hızı ---------- */

const EA = 50, EA_KAT = 40, R_J = 8.314;
/** 300 K, katalizörsüz ve 1 birim derişime göre bağıl hız: hız ∝ [A][B]·e^(−Ea/RT). */
const bagilHiz = (T: number, n: number, kat: boolean) => n * n * Math.exp((-(kat ? EA_KAT : EA) * 1000) / R_J * (1 / T - 1 / 300)) * Math.exp(((kat ? EA - EA_KAT : 0) * 1000) / (R_J * 300));
const CK = { x0: 12, x1: 196, ust: 58, alt: 210 };
type Parca = { x: number; y: number; vx: number; vy: number; tur: 0 | 1; parla: number };

function CarpismaLab({ v, saat = 0 }: SahneProps) {
  const T = v.T ?? 300, n = v.n ?? 1, kat = v.kat === 1, hiz = bagilHiz(T, n, kat);
  const dt = useAdim(saat);
  const r = useRef<{ p: Parca[]; urun: number[]; } | null>(null);
  if (!r.current) {
    const q = rastgele(5);
    r.current = { urun: [], p: Array.from({ length: 48 }, (_, i) => { const a = q() * 6.28; return { x: CK.x0 + 6 + q() * (CK.x1 - CK.x0 - 12), y: CK.ust + 6 + q() * (CK.alt - CK.ust - 12), vx: Math.cos(a), vy: Math.sin(a), tur: (i % 2) as 0 | 1, parla: -9 }; }) };
  }
  const d = r.current, adet = n * 16, sur = 55 * Math.sqrt(T / 300);
  // Görsel olasılık: etkin çarpışma oranı bağıl hızla orantılı (en çok 1).
  const olas = Math.min(1, 0.03 * hiz / (n * n));
  const ps = d.p.slice(0, adet);
  for (const q of ps) {
    q.x += q.vx * sur * dt; q.y += q.vy * sur * dt;
    if (q.x < CK.x0 + 5 || q.x > CK.x1 - 5) { q.vx = -q.vx; q.x = sinir(q.x, CK.x0 + 5, CK.x1 - 5); }
    if (q.y < CK.ust + 5 || q.y > CK.alt - 5) { q.vy = -q.vy; q.y = sinir(q.y, CK.ust + 5, CK.alt - 5); }
  }
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const a = ps[i], b = ps[j];
    if (a.tur === b.tur || saat - a.parla < 0.5 || saat - b.parla < 0.5) continue;
    if (Math.hypot(a.x - b.x, a.y - b.y) < 9 && Math.random() < olas) { a.parla = b.parla = saat; d.urun.push(saat); }
  }
  d.urun = d.urun.filter((t) => saat - t < 5);
  // Maxwell–Boltzmann (şematik ölçek): f(E) ∝ √E·e^(−E/kT) / (kT)^1,5; eşiğin sağı boyalı.
  const Ea = kat ? EA_KAT : EA, kT = (14 * T) / 300;
  const MB = { x0: 214, x1: 330, y0: 92, y1: 178, EMAX: 70 };
  const f = (E: number, k = kT) => (Math.sqrt(E) * Math.exp(-E / k)) / Math.pow(k, 1.5);
  const tepe = f(7, 14) * 1.25;
  const mbX = (E: number) => MB.x0 + (E / MB.EMAX) * (MB.x1 - MB.x0), mbY = (y: number) => MB.y1 - (y / tepe) * (MB.y1 - MB.y0);
  const nok = Array.from({ length: 71 }, (_, i) => [i, f(i)] as const);
  const egri = nok.map(([E, y]) => `${mbX(E).toFixed(1)},${mbY(y).toFixed(1)}`).join(" ");
  const alan = `M${mbX(Ea)} ${MB.y1} ` + nok.filter(([E]) => E >= Ea).map(([E, y]) => `L${mbX(E).toFixed(1)} ${mbY(y).toFixed(1)}`).join(" ") + ` L${mbX(MB.EMAX)} ${MB.y1} Z`;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${T} kelvin, derişim ${n}, katalizör ${kat ? "var" : "yok"}: bağıl hız ${say(hiz)}`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">bağıl hız ×{hiz < 10 ? say(hiz) : Math.round(hiz)}</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">T = {T} K · Ea = {Ea} kJ · son 5 s: {d.urun.length} etkin çarpışma</text>
      <rect x={CK.x0} y={CK.ust} width={CK.x1 - CK.x0} height={CK.alt - CK.ust} rx={10} fill="none" stroke="var(--line-2)" strokeWidth={1.5} />
      {ps.map((q, i) => {
        const yeni = saat - q.parla < 0.5;
        return <circle key={i} cx={q.x} cy={q.y} r={yeni ? 7 : 4.2} fill={yeni ? "var(--c4)" : q.tur ? "var(--c1)" : "var(--c2)"} opacity={yeni ? 0.9 : 1} />;
      })}
      <g fontSize={11} fontWeight={700}>
        <circle cx={18} cy={224} r={4} fill="var(--c2)" /><text x={26} y={228} fill="var(--c2)">A</text>
        <circle cx={46} cy={224} r={4} fill="var(--c1)" /><text x={54} y={228} fill="var(--c1)">B</text>
        <circle cx={74} cy={224} r={5} fill="var(--c4)" /><text x={83} y={228} fill="var(--muted)">etkin çarpışma</text>
      </g>
      <path d={alan} fill="var(--kimya)" opacity={0.3} />
      <polyline points={egri} fill="none" stroke="var(--kimya)" strokeWidth={2} />
      <line x1={mbX(Ea)} x2={mbX(Ea)} y1={MB.y0 - 6} y2={MB.y1} stroke="var(--ink)" strokeDasharray="3 3" />
      <text x={mbX(Ea) + 3} y={MB.y0 - 8} fontSize={10.5} fontWeight={700} fill="var(--ink)">Ea</text>
      <line x1={MB.x0} x2={MB.x1} y1={MB.y1} y2={MB.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={MB.x0} x2={MB.x0} y1={MB.y0 - 14} y2={MB.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={(MB.x0 + MB.x1) / 2} y={MB.y1 + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">tanecik enerjisi</text>
      <text x={MB.x0} y={MB.y0 - 20} fontSize={10.5} fontWeight={700} fill="var(--muted)">tanecik sayısı</text>
    </svg>
  );
}

/* ---------- biyoloji: fotosentez hızı (su bitkisi) ---------- */

/** Bağıl fotosentez hızı (0-1): en kıt faktör (ışık ya da CO₂) sınırlar; sıcaklıkta tepe 30 °C. */
const fotoHiz = (isik: number, co2: number, T: number) => {
  const fT = Math.exp(-Math.pow((T - 30) / (T > 30 ? 8 : 14), 2));
  return Math.min(1, isik / 40, co2 / 40) * fT;
};
type Kabarcik = { t: number; x: number };

function FotoLab({ v, saat = 0 }: SahneProps) {
  const isik = v.isik ?? 20, co2 = v.co2 ?? 30, T = v.T ?? 25, hz = fotoHiz(isik, co2, T);
  const dt = useAdim(saat);
  const r = useRef<{ biri: number; k: Kabarcik[] }>({ biri: 0, k: [] });
  const d = r.current;
  d.biri += hz * 6 * dt;
  while (d.biri >= 1) { d.biri -= 1; d.k.push({ t: saat, x: 118 + (Math.random() - 0.5) * 18 }); }
  d.k = d.k.filter((b) => saat - b.t < 2.4);
  const sinirlayan = T > 34 ? "sıcaklık" : isik / 40 < co2 / 40 && isik < 40 ? "ışık" : co2 < 40 ? "CO₂" : T < 26 ? "sıcaklık" : "hiçbiri: en hızlı";
  const GR2 = { x0: 226, x1: 330, y0: 86, y1: 176 };
  const egri = Array.from({ length: 51 }, (_, i) => { const L = i * 2; return `${(GR2.x0 + (L / 100) * (GR2.x1 - GR2.x0)).toFixed(1)},${(GR2.y1 - fotoHiz(L, co2, T) * (GR2.y1 - GR2.y0)).toFixed(1)}`; }).join(" ");
  const parlak = isik / 100;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Işık yüzde ${isik}, CO2 ${co2}, ${T} derece: hız yüzde ${Math.round(hz * 100)}`}>
      <text x={10} y={22} fontSize={13} fontWeight={800} fill="var(--biyoloji)">hız %{Math.round(hz * 100)} · {Math.round(hz * 360)} kabarcık/dk</text>
      <text x={10} y={41} fontSize={12} fontWeight={700} fill="var(--muted)">sınırlayan: {sinirlayan}</text>
      {/* lamba */}
      <g>
        <circle cx={34} cy={96} r={14} fill={`rgba(242,193,46,${0.15 + 0.85 * parlak})`} stroke="var(--ink)" strokeWidth={1.5} />
        {parlak > 0 && [0, 1, 2, 3, 4].map((k) => { const a = -0.8 + k * 0.4; return <line key={k} x1={34 + Math.cos(a) * 19} y1={96 + Math.sin(a) * 19} x2={34 + Math.cos(a) * (19 + 12 * parlak)} y2={96 + Math.sin(a) * (19 + 12 * parlak)} stroke="var(--c4)" strokeWidth={2} strokeLinecap="round" />; })}
      </g>
      {/* beher, su ve bitki */}
      <path d="M70 70 L70 206 Q70 214 78 214 L170 214 Q178 214 178 206 L178 70" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={71} y={84} width={106} height={129} fill="var(--c1)" opacity={0.08} />
      <path d="M120 212 C116 180 124 150 118 112" fill="none" stroke="var(--biyoloji)" strokeWidth={3} />
      {[200, 184, 168, 152, 136, 122].map((y, k) => (
        <g key={y} fill="var(--biyoloji)">
          <ellipse cx={k % 2 ? 108 : 132} cy={y - 4} rx={11} ry={4} transform={`rotate(${k % 2 ? 20 : -20} ${k % 2 ? 108 : 132} ${y - 4})`} />
        </g>
      ))}
      {d.k.map((b, i) => { const u = (saat - b.t) / 2.4; return <circle key={i} cx={b.x + Math.sin(u * 9 + i) * 3} cy={112 - u * 26} r={2.6} fill="#fff" stroke="var(--c1)" strokeWidth={1.2} opacity={1 - u} />; })}
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <text x={124} y={230} textAnchor="middle">su bitkisi · {T} °C</text>
      </g>
      {/* hız–ışık grafiği (şimdiki CO₂ ve sıcaklıkta) */}
      <polyline points={egri} fill="none" stroke="var(--line-2)" strokeWidth={2.2} />
      <line x1={GR2.x0} x2={GR2.x1} y1={GR2.y1} y2={GR2.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={GR2.x0} x2={GR2.x0} y1={GR2.y0 - 8} y2={GR2.y1} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={GR2.x0 + 4} y={GR2.y0 - 12} fontSize={10.5} fontWeight={700} fill="var(--ink)">hız</text>
      <text x={(GR2.x0 + GR2.x1) / 2} y={GR2.y1 + 15} fontSize={10} fill="var(--muted)" textAnchor="middle">ışık şiddeti</text>
      <circle cx={GR2.x0 + (isik / 100) * (GR2.x1 - GR2.x0)} cy={GR2.y1 - hz * (GR2.y1 - GR2.y0)} r={6} fill="var(--biyoloji)" />
    </svg>
  );
}

export const SIMULASYON: Record<string, SahneKaydi> = {
  "sim-rampa": { C: RampaLab, canli: true },
  "sim-carpisma": { C: CarpismaLab, canli: true, olc: (v) => ({ hiz: Math.round(bagilHiz(v.T ?? 300, v.n ?? 1, v.kat === 1) * 100) / 100 }) },
  "sim-foto": { C: FotoLab, canli: true, olc: (v) => ({ hiz: Math.round(fotoHiz(v.isik ?? 20, v.co2 ?? 30, v.T ?? 25) * 100) / 100 }) },
  "sim-surtunme": { C: SurtunmeLab, canli: true },
  "sim-gaz": { C: GazLab, canli: true, olc: (v) => ({ P: Math.round(gazP(v.n ?? 1, v.T ?? 27, v.V ?? 24.6) * 100) / 100 }) },
  "sim-zar": {
    C: ZarLab,
    canli: true,
    // "Yeniden doldur": bütün tanecikler sola döner (tur sayacı sahnenin yeniden başlamasını sağlar).
    bagla: (ad, x, v) => (ad === "yenile" ? { ...v, yenile: 0, tur: (v.tur ?? 0) + 1 } : { ...v, [ad]: x }),
  },
  "sim-atis": { C: AtisLab, canli: true },
  "sim-ph": { C: PhLab, canli: true, olc: (v) => ({ pH: Math.round(phHesap(v.A ?? 0, v.B ?? 0).pH * 100) / 100 }) },
  "sim-enzim": {
    C: EnzimLab,
    canli: true,
    // "Taze enzim koy" (yeni) bozulmuş enzimi yeniler; sıcaklık eşiği geçince enzim kalıcı bozulur.
    bagla: (ad, x, v) => {
      const n = { ...v, [ad]: x };
      if (ad === "yeni") return { ...n, yeni: 0, bozuk: (n.T ?? 20) >= BOZULMA ? 1 : 0 };
      return (n.T ?? 20) >= BOZULMA ? { ...n, bozuk: 1 } : n;
    },
  },
};
