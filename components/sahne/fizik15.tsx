"use client";
// Fizik sahneleri (deprem ve rezonans): fayda biriken gerilmenin boşalması, P ve S dalgalarının istasyona varışı,
// büyüklük ile enerji, sarsma masasında binaların doğal periyodu ve rezonans, sismik izolatör.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const yumusak = (u: number) => { const k = sinir(u, 0, 1); return k * k * (3 - 2 * k); };
/** (x, y) noktalarından çizgi. */
const yol = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

/* ================= 1. Fayda gerilme birikir, sonra boşalır ================= */

// Fayın iki yanı zıt yönde yavaşça kayar ama fay kilitlidir; yol bükülür. Gerilme dayanımı aşınca blok bir anda kayar.
function Fay({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const KIRIL = 4; // s
  const birik = yumusak(zt / KIRIL), kirildi = zt >= KIRIL, sonra = sinir((zt - KIRIL) / 0.4, 0, 1);
  const FX = 170, Y0 = 34, Y1 = 196, KAY = 22; // fay x'te; her blok en çok KAY kadar kayar
  // Yol: soldan sağa, fay hattını dik keser. Kırılmadan önce fayın yakını bükülü, sonra iki parça düz ve kaymış.
  const yolY = (x: number) => {
    const uz = (x - FX) / 60;
    const bukum = KAY * birik * Math.tanh(uz) * (1 - sonra);
    const kayma = KAY * birik * Math.sign(x - FX) * sonra;
    return 115 + bukum + kayma;
  };
  const sol = yol(Array.from({ length: 41 }, (_, i) => { const x = 20 + (i * (FX - 20)) / 40; return [x, yolY(x - 0.01)] as [number, number]; }));
  const sag = yol(Array.from({ length: 41 }, (_, i) => { const x = FX + (i * (320 - FX)) / 40; return [x, yolY(x + 0.01)] as [number, number]; }));
  const halka = kirildi ? (zt - KIRIL) * 70 : 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={kirildi ? "Fay kırıldı: yol iki parçaya ayrılıp kaydı, dalgalar yayıldı" : "Fay kilitli: yol bükülüyor, gerilme birikiyor"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={kirildi ? "var(--c2)" : "var(--ink)"}>
        {kirildi ? "Kırıldı! Biriken enerji dalga olarak yayılıyor" : zt > 0 ? "Gerilme birikiyor, yol bükülüyor…" : "Fayın iki yanı zıt yönde itiliyor"}
      </text>
      <rect x={20} y={Y0} width={FX - 20} height={Y1 - Y0} fill="var(--c4)" fillOpacity={0.12} />
      <rect x={FX} y={Y0} width={320 - FX} height={Y1 - Y0} fill="var(--c4)" fillOpacity={0.2} />
      {kirildi && halka < 260 && [0, 1, 2].map((k) => {
        const r = halka - k * 26;
        return r > 0 ? <circle key={k} cx={FX} cy={115} r={r} fill="none" stroke="var(--c2)" strokeWidth={2} opacity={sinir(1 - r / 260, 0, 1)} /> : null;
      })}
      <line x1={FX} x2={FX} y1={Y0} y2={Y1} stroke="var(--ink)" strokeWidth={2.4} strokeDasharray="7 5" />
      <path d={sol} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      <path d={sag} fill="none" stroke="var(--ink)" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      {/* itme okları */}
      <g fill="var(--c1)">
        <path d="M60 64 V44 l-6 9 h12 Z" />
        <path d="M280 168 V188 l-6 -9 h12 Z" />
      </g>
      <text x={72} y={58} fontSize={11.5} fontWeight={700} fill="var(--c1)">kayma yönü</text>
      <text x={268} y={182} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="end">kayma yönü</text>
      <text x={FX + 6} y={Y1 - 6} fontSize={11.5} fontWeight={700} fill="var(--muted)">fay</text>
      <text x={14} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">üstten görünüş: yol fayı dik kesiyor</text>
    </svg>
  );
}

/* ================= 2. P ve S dalgası istasyona yarışıyor ================= */

// Kabukta temsilî hızlar: P 6 km/s, S 3,5 km/s. Oynatma süresi gerçek süreyi ölçekler.
const VP = 6, VS = 3.5;
const farkSure = (d: number) => d / VS - d / VP;
function Istasyon({ v, t, oynuyor, s }: SahneProps) {
  const d = sinir(v.d ?? 120, 20, 200), sure = Number(s.sure ?? 6);
  const tS = d / VS, olcek = (tS * 1.15) / sure; // oynatmanın her saniyesi kaç gerçek saniye
  const zt = ilerleme(t, oynuyor, sure) * sure * olcek; // gerçek zaman (s)
  const OX = 40, OY = 92, PXKM = 270 / 200, sx = OX + d * PXKM;
  const rP = VP * zt * PXKM, rS = VS * zt * PXKM;
  // Tahmin adımında hızlar oynatılana dek yazılmaz (cevabı önceden söylemesin).
  const hizGizli = Boolean(s.hizGizle) && zt === 0;
  const geldiP = zt >= d / VP, geldiS = zt >= tS, dt = farkSure(d);
  // Sismogram: istasyondaki yer hareketi.
  const GX0 = 40, GX1 = 320, GY = 196, tMax = tS * 1.15, gx = (q: number) => GX0 + (q / tMax) * (GX1 - GX0);
  const yer = (q: number) => {
    let y = 0;
    const p = q - d / VP, ss = q - tS;
    if (p > 0) y += 5 * Math.exp(-p / 3) * Math.sin(p * 9);
    if (ss > 0) y += 14 * Math.exp(-ss / 4) * Math.sin(ss * 5.5);
    return y;
  };
  const iz = yol(Array.from({ length: 121 }, (_, i) => { const q = (i / 120) * Math.min(zt, tMax); return [gx(q), GY - yer(q)] as [number, number]; }));
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`İstasyon ${d} km uzakta; P ile S arası ${say(dt)} saniye`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={geldiS ? "var(--c3)" : "var(--ink)"}>
        {geldiS ? `P ile S arası: ${say(dt)} s` : geldiP ? "P geldi, S yolda…" : `İstasyon ${d} km uzakta`}
      </text>
      <line x1={20} x2={326} y1={58} y2={58} stroke="var(--ink)" strokeWidth={1.6} />
      <text x={326} y={52} fontSize={11} fill="var(--muted)" textAnchor="end">yüzey</text>
      <defs><clipPath id="fiz15-yer"><rect x={0} y={58} width={340} height={80} /></clipPath></defs>
      <g clipPath="url(#fiz15-yer)">
        {zt > 0 && <circle cx={OX} cy={OY} r={rP} fill="none" stroke="var(--c1)" strokeWidth={2.4} />}
        {zt > 0 && <circle cx={OX} cy={OY} r={rS} fill="none" stroke="var(--c2)" strokeWidth={2.4} />}
      </g>
      <circle cx={OX} cy={OY} r={6} fill="var(--c4)" />
      <text x={OX + 10} y={OY + 22} fontSize={11.5} fontWeight={700} fill="var(--c4)">odak</text>
      <path d={`M${sx - 8} 58 L${sx} 44 L${sx + 8} 58 Z`} fill="var(--ink)" />
      <text x={sx} y={38} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">istasyon</text>
      <g fontSize={11.5} fontWeight={800}>
        <text x={20} y={156} fill="var(--c1)">{hizGizli ? "P" : "P (6 km/s)"}</text>
        <text x={112} y={156} fill="var(--c2)">{hizGizli ? "S" : "S (3,5 km/s)"}</text>
      </g>
      <line x1={GX0} x2={GX1} y1={GY} y2={GY} stroke="var(--line-2)" />
      <path d={iz} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
      {geldiP && <line x1={gx(d / VP)} x2={gx(d / VP)} y1={GY - 26} y2={GY + 18} stroke="var(--c1)" strokeDasharray="3 3" />}
      {geldiS && <line x1={gx(tS)} x2={gx(tS)} y1={GY - 26} y2={GY + 18} stroke="var(--c2)" strokeDasharray="3 3" />}
      {geldiS && <text x={(gx(d / VP) + gx(tS)) / 2} y={GY + 30} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">Δt = {say(dt)} s</text>}
      <text x={GX0 - 4} y={GY - 20} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="end">kayıt</text>
    </svg>
  );
}
const istasyonGeri = (v: Record<string, number>) => {
  const dt = farkSure(sinir(v.d ?? 120, 20, 200));
  return { baslik: `Δt = ${say(dt)} s oldu`, metin: dt < 10 ? "Fark az: istasyon çok yakın. Uzaklık arttıkça S, P'nin gerisinde daha çok kalır." : "Fark çok: istasyon fazla uzak. Her 8 km'de fark yaklaşık 1 s artar." };
};

/* ================= 3. Büyüklük ve enerji ================= */

// Her 1 birim büyüklük ≈ 32 kat enerji (10^1,5). Kare alanı enerjiyle orantılı (karekök ölçek, sığsın diye).
function Buyukluk({ v }: SahneProps) {
  const M = sinir(v.M ?? 5, 4, 8), oran = Math.pow(10, 1.5 * (M - 5));
  const kenar = (o: number) => sinir(18 * Math.sqrt(o) ** 0.5, 2, 150);
  const k5 = kenar(1), kM = kenar(oran);
  const yaz = oran >= 10 ? say(oran, 0) : say(oran, oran < 1 ? 2 : 1);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`Büyüklük ${say(M)}: büyüklüğü 5 olan depremin ${yaz} katı enerji`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">M = {say(M)}: enerji, M = 5'in <tspan fill="var(--c2)">{yaz} katı</tspan></text>
      <rect x={40} y={196 - k5} width={k5} height={k5} fill="var(--c1)" fillOpacity={0.35} stroke="var(--c1)" strokeWidth={1.5} />
      <text x={40 + k5 / 2} y={214} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="middle">M = 5</text>
      <rect x={150} y={196 - kM} width={kM} height={kM} fill="var(--c2)" fillOpacity={0.3} stroke="var(--c2)" strokeWidth={1.5} />
      <text x={150 + Math.max(kM, 30) / 2} y={214} fontSize={11.5} fontWeight={700} fill="var(--c2)" textAnchor="middle">M = {say(M)}</text>
      <text x={326} y={230} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="end">kare boyu temsilî (dördüncü kök ölçek)</text>
      <text x={14} y={44} fontSize={11.5} fontWeight={700} fill="var(--muted)">+1 büyüklük ≈ 32 kat enerji</text>
    </svg>
  );
}

/* ================= 4. Sarsma masası: doğal periyot ve rezonans ================= */

// Binanın doğal periyodu ≈ 0,1 × kat sayısı (s). Tepe yer değiştirmesi zorlanmış sönümlü salınıcının büyütmesiyle.
const KATLAR = [3, 10, 20], ZETA = 0.08;
const buyutme = (f: number, kat: number) => {
  const r = f / (1 / (0.1 * kat));
  return 1 / Math.sqrt((1 - r * r) ** 2 + (2 * ZETA * r) ** 2);
};
function Bina({ x, taban, kat, sapma, renk }: { x: number; taban: number; kat: number; sapma: number; renk: string }) {
  const kh = kat === 3 ? 14 : kat === 10 ? 8.5 : 6.6, H = kat * kh, W = 30;
  // Kat kat yanal kayma: tepe sapma kadar, yükseklikle doğrusal.
  const katlar = Array.from({ length: kat }, (_, i) => {
    const a = (i / kat) * sapma, b = ((i + 1) / kat) * sapma, y = taban - i * kh;
    return <path key={i} d={`M${x + a} ${y} L${x + a + W} ${y} L${x + b + W} ${y - kh} L${x + b} ${y - kh} Z`} fill={renk} fillOpacity={0.25 + (i % 2) * 0.12} stroke={renk} strokeWidth={0.8} />;
  });
  return <g>{katlar}<text x={x + W / 2} y={taban + 30} fontSize={11.5} fontWeight={700} fill="var(--ink)" textAnchor="middle">{kat} kat</text></g>;
}
function Sarsma({ v, t, oynuyor, s }: SahneProps) {
  const f = sinir(v.f ?? 2, 0.3, 3.6), sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const rampa = yumusak(zt / 2), yerX = 5 * Math.sin(2 * Math.PI * f * zt) * (zt > 0 ? 1 : 0);
  const renkler = ["var(--c1)", "var(--c3)", "var(--c5)"], TABAN = 200;
  const b = KATLAR.map((k) => buyutme(f, k)), enb = b.indexOf(Math.max(...b));
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={`Masa ${say(f)} Hz ile sarsılıyor; en çok ${KATLAR[enb]} katlı bina sallanıyor`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>
        {bitti ? `En çok sallanan: ${KATLAR[enb]} katlı bina` : `Sarsıntı: ${say(f)} Hz (periyot ${say(1 / f, 2)} s)`}
      </text>
      <g transform={`translate(${yerX} 0)`}>
        <rect x={30} y={TABAN} width={280} height={10} rx={3} fill="var(--c4)" fillOpacity={0.5} />
        {KATLAR.map((k, i) => (
          <Bina key={k} x={56 + i * 92} taban={TABAN} kat={k} renk={renkler[i]}
            sapma={sinir(4 * b[i] * rampa, 0, 60) * Math.sin(2 * Math.PI * f * zt - Math.atan2(2 * ZETA * (f * 0.1 * k), 1 - (f * 0.1 * k) ** 2)) * (zt > 0 ? 1 : 0)} />
        ))}
      </g>
      <g fontSize={11} fill="var(--muted)" textAnchor="middle" fontWeight={700}>
        {KATLAR.map((k, i) => <text key={k} x={71 + i * 92} y={246}>T ≈ {say(0.1 * k)} s</text>)}
      </g>
    </svg>
  );
}
const sarsmaGeri = (v: Record<string, number>) => {
  const f = sinir(v.f ?? 2, 0.3, 3.6);
  return { baslik: `Sarsıntının periyodu ${say(1 / f, 2)} s`, metin: "Bir bina, sarsıntının periyodu kendi doğal periyoduna (≈ 0,1 × kat sayısı saniye) yaklaştıkça en çok sallanır. 3 katlının periyodu ≈ 0,3 s, yani f ≈ 3,3 Hz." };
};

/* ================= 5. Sismik izolatör ================= */

// Aynı sarsıntı (1,5 Hz). İzolatörsüz binanın doğal periyodu 0,6 s (f ≈ 1,7 Hz, rezonansa yakın);
// izolatörlü binada esnek yastıklar periyodu ≈ 2,5 s'ye çıkarır, bina sarsıntıyı neredeyse hissetmez.
function Izolator({ v, t, oynuyor, s }: SahneProps) {
  const iz = (v.iz ?? 0) > 0.5, f = 1.5, sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const T0 = iz ? 2.5 : 0.6, r = f * T0, B = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * 0.1 * r) ** 2);
  const rampa = yumusak(zt / 2), yerX = 6 * Math.sin(2 * Math.PI * f * zt) * (zt > 0 ? 1 : 0);
  const sapma = sinir(8 * B * rampa, 0, 34) * Math.sin(2 * Math.PI * f * zt - Math.PI / 2 * (r > 1 ? 2 : r)) * (zt > 0 ? 1 : 0);
  // İzolatörlü binada gövde yerle birlikte gitmez: taban neredeyse yerinde kalır.
  const govdeX = iz ? yerX * 0.12 : yerX, TABAN = 196, W = 120, kh = 22, kat = 6, x0 = 110;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={iz ? "İzolatörlü bina: sarsıntı tabanda emiliyor, bina az sallanıyor" : "İzolatörsüz bina: sarsıntıyla birlikte çok sallanıyor"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? (iz ? "var(--c3)" : "var(--c2)") : "var(--ink)"}>
        {bitti ? (iz ? "İzolatörlü: bina sakin kaldı" : "İzolatörsüz: bina çok sallandı") : iz ? "Bina izolatörlerin üstünde" : "Bina doğrudan zemine oturuyor"}
      </text>
      <g transform={`translate(${yerX} 0)`}>
        <rect x={40} y={TABAN + 12} width={260} height={12} rx={3} fill="var(--c4)" fillOpacity={0.5} />
      </g>
      {iz && [0, 1, 2, 3].map((i) => {
        const x = x0 + 10 + i * 30;
        return <path key={i} d={`M${x + yerX} ${TABAN + 12} L${x + 14 + yerX} ${TABAN + 12} L${x + 14 + govdeX} ${TABAN} L${x + govdeX} ${TABAN} Z`} fill="var(--ink)" fillOpacity={0.55} />;
      })}
      {!iz && <rect x={x0 + yerX} y={TABAN} width={W} height={12} fill="var(--ink)" fillOpacity={0.55} />}
      <g transform={`translate(${govdeX} 0)`}>
        {Array.from({ length: kat }, (_, i) => {
          const a = (i / kat) * sapma, b = ((i + 1) / kat) * sapma, y = TABAN - i * kh;
          return <path key={i} d={`M${x0 + a} ${y} L${x0 + a + W} ${y} L${x0 + b + W} ${y - kh} L${x0 + b} ${y - kh} Z`} fill="var(--c1)" fillOpacity={0.22 + (i % 2) * 0.12} stroke="var(--c1)" strokeWidth={0.8} />;
        })}
      </g>
      <text x={326} y={236} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="end">{iz ? "kauçuk-çelik yastıklar periyodu uzatır" : "zemin ne yaparsa bina onu yapar"}</text>
    </svg>
  );
}

export const FIZIK15: Record<string, SahneKaydi> = {
  "fiz15-fay": { C: Fay },
  "fiz15-istasyon": { C: Istasyon, geri: istasyonGeri },
  "fiz15-buyukluk": { C: Buyukluk },
  "fiz15-sarsma": { C: Sarsma, geri: sarsmaGeri },
  "fiz15-izolator": { C: Izolator },
};
