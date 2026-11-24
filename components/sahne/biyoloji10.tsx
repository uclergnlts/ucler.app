"use client";
// Biyoloji sahneleri (duyu organları, destek ve hareket): uyarıdan algıya giden yol, ışıkla göz bebeği,
// yakına ve uzağa uyum, miyop ve hipermetrop gözde düzeltici mercek, sesin kulaktaki yolu, dönme ve denge;
// kemiğin boyca uzaması, eklem türleri, biseps ve triseps, kayan iplikler, Ca²⁺ ve ATP, kasın enerjisi, kas türleri.
import { cev, ONDALIK } from "@/lib/dil";
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;
const YESIL = "var(--biyoloji)";
const MAVI = "var(--c1)", KIRMIZI = "var(--c2)", SARI = "var(--c4)", MOR = "var(--c5)";
const virgul = (x: number, b = 2) => x.toFixed(b).replace(".", ONDALIK);

/* ---------- uyarıdan algıya ---------- */

function Yol({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const evre = u <= 0 ? -1 : u < 0.3 ? 0 : u < 0.8 ? 1 : 2;
  const isik = sinir(u / 0.3), sinyal = sinir((u - 0.3) / 0.5);
  const beyin = u >= 0.8;
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={cev("Işık göze, göz siniri impulsu beyne taşıyor; görme beyinde oluşuyor")}>
      <g>
        <circle cx={30} cy={90} r={13} fill={SARI} />
        <g stroke={SARI} strokeWidth={2} strokeLinecap="round">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={30 + 17 * Math.cos(a)} y1={90 + 17 * Math.sin(a)} x2={30 + 22 * Math.cos(a)} y2={90 + 22 * Math.sin(a)} />;
          })}
        </g>
      </g>
      <line x1={56} y1={90} x2={74} y2={90} stroke={SARI} strokeWidth={2} strokeDasharray="4 4" />
      <g>
        <circle cx={98} cy={90} r={24} fill="none" stroke="var(--ink)" strokeWidth={2} />
        <circle cx={78} cy={90} r={8} fill={MAVI} fillOpacity={0.5} />
        <path d="M110 70 A24 24 0 0 1 110 110" fill="none" stroke={evre >= 1 ? KIRMIZI : MOR} strokeWidth={4} />
      </g>
      <path d="M122 90 L214 90" stroke={MOR} strokeWidth={3} />
      <g>
        <path d="M218 90 C218 52 252 40 276 46 C306 52 322 74 316 100 C310 128 280 138 254 132 C230 128 218 112 218 90 Z" fill={beyin ? KIRMIZI : MOR} fillOpacity={beyin ? 0.22 : 0.1} stroke={beyin ? KIRMIZI : MOR} strokeWidth={2} />
        <path d="M240 70 C252 78 248 92 262 96 M270 60 C276 74 292 76 294 92 M244 112 C258 108 268 120 284 114" fill="none" stroke={beyin ? KIRMIZI : MOR} strokeWidth={1.5} strokeOpacity={0.6} />
      </g>
      {evre === 0 && <circle cx={ara(44, 80, isik)} cy={90} r={5} fill={SARI} stroke="var(--ink)" strokeWidth={1} />}
      {evre === 1 && (
        <g>
          <circle cx={ara(122, 214, sinyal)} cy={90} r={9} fill={KIRMIZI} fillOpacity={0.25} />
          <circle cx={ara(122, 214, sinyal)} cy={90} r={5} fill={KIRMIZI} />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={30} y={134} fill={evre === 0 ? KIRMIZI : "var(--muted)"}>{cev("uyarı")}</text>
        <text x={30} y={148} fill="var(--muted)" fontWeight={600}>{cev("(ışık)")}</text>
        <text x={98} y={134} fill={evre === 0 ? KIRMIZI : "var(--muted)"}>{cev("reseptör")}</text>
        <text x={98} y={148} fill="var(--muted)" fontWeight={600}>{cev("(retina)")}</text>
        <text x={168} y={78} fill={evre === 1 ? KIRMIZI : "var(--muted)"}>{cev("duyu siniri")}</text>
        <text x={268} y={158} fill={beyin ? KIRMIZI : "var(--muted)"}>{cev("beyin")}</text>
        <text x={268} y={172} fill="var(--muted)" fontWeight={600}>{cev("(görme merkezi)")}</text>
      </g>
      <text x={170} y={194} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {evre < 0 ? cev("Işık göze geliyor") : evre === 0 ? cev("Işık retinadaki reseptörlere ulaşıyor") : evre === 1 ? cev("İmpuls duyu siniriyle beyne gidiyor") : cev("Beyin yorumluyor: görme burada oluşur")}
      </text>
    </svg>
  );
}

/* ---------- göz bebeği ---------- */

/** Işık düzeyi 1-5 için göz bebeği çapı (mm). */
const bebekMm = (isik: number) => 8 - (sinir(isik, 1, 5) - 1) * 1.5;

function Bebek({ v }: SahneProps) {
  const isik = sinir(v.isik ?? 3, 1, 5);
  const mm = bebekMm(isik);
  const r = mm * 4.2;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={cev("Işık düzeyi {0}, göz bebeği {1} mm", isik, virgul(mm, 1))}>
      <g>
        <circle cx={34} cy={34} r={6 + isik * 2} fill={SARI} fillOpacity={0.25 + isik * 0.14} />
        {Array.from({ length: isik }, (_, i) => (
          <line key={i} x1={48 + i * 2} y1={42 + i * 7} x2={96 + i * 6} y2={64 + i * 6} stroke={SARI} strokeWidth={2} strokeLinecap="round" />
        ))}
      </g>
      <path d="M50 110 C100 42 240 42 290 110 C240 178 100 178 50 110 Z" fill="var(--line)" fillOpacity={0.35} stroke="var(--ink)" strokeWidth={2} />
      <circle cx={170} cy={110} r={46} fill={MAVI} fillOpacity={0.45} stroke={MAVI} strokeWidth={2} />
      <g stroke={MAVI} strokeOpacity={0.6} strokeWidth={1.2}>
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          return <line key={i} x1={170 + (r + 2) * Math.cos(a)} y1={110 + (r + 2) * Math.sin(a)} x2={170 + 44 * Math.cos(a)} y2={110 + 44 * Math.sin(a)} />;
        })}
      </g>
      <circle cx={170} cy={110} r={r} fill="var(--ink)" />
      <circle cx={160} cy={100} r={4} fill="var(--surface)" fillOpacity={0.8} />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={232} y={66}>{cev("iris")}</text>
        <line x1={230} y1={70} x2={206} y2={86} stroke="var(--muted)" strokeWidth={1} />
        <text x={250} y={168}>{cev("göz bebeği")}</text>
        <line x1={248} y1={162} x2={178} y2={116} stroke="var(--muted)" strokeWidth={1} />
      </g>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {cev("Göz bebeği:")} {virgul(mm, 1)} {cev("mm")} {isik <= 1 ? cev("(en geniş)") : isik >= 5 ? cev("(en dar)") : ""}
      </text>
    </svg>
  );
}

/* ---------- yakına ve uzağa uyum ---------- */

function Uyum({ v }: SahneProps) {
  const yakin = (v.yakin ?? 0) === 1;
  const rx = yakin ? 12 : 6;
  const L = 188, F = 292, Y = 105;
  const isinlar: [number, number, number][] = yakin
    ? [[62, Y, Y - 18], [62, Y, Y + 18]]
    : [[14, Y - 18, Y - 18], [14, Y + 18, Y + 18]];
  return (
    <svg viewBox="0 0 340 225" role="img" aria-label={yakin ? cev("Yakına bakış: mercek kalın, kirpiksi kas kasılı, askı bağları gevşek") : cev("Uzağa bakış: mercek ince, kirpiksi kas gevşek, askı bağları gergin")}>
      <circle cx={230} cy={Y} r={62} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d="M172 78 C160 92 160 118 172 132" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d="M262 52 A62 62 0 0 1 262 158" fill="none" stroke={MOR} strokeWidth={4} />
      {yakin ? (
        <g>
          <rect x={56} y={88} width={8} height={34} rx={2} fill={SARI} stroke="var(--ink)" strokeWidth={1.2} />
          <path d="M56 88 L60 80 L64 88" fill={SARI} stroke="var(--ink)" strokeWidth={1.2} />
        </g>
      ) : (
        <g>
          <path d="M10 112 L22 82 L34 112 Z" fill={YESIL} fillOpacity={0.6} />
          <rect x={20} y={112} width={4} height={10} fill="var(--muted)" />
        </g>
      )}
      <g stroke={SARI} strokeWidth={2} fill="none">
        {isinlar.map(([x0, y0, y1], i) => <polyline key={i} points={`${x0},${y0} ${L},${y1} ${F},${Y}`} />)}
      </g>
      <ellipse cx={L} cy={Y} rx={rx} ry={26} fill={MAVI} fillOpacity={0.35} stroke={MAVI} strokeWidth={2} />
      <g stroke="var(--muted)" strokeWidth={1.4} fill="none">
        {yakin ? (
          <path d={`M${L} ${Y - 26} q4 -4 0 -8 q-4 -4 0 -8 M${L} ${Y + 26} q4 4 0 8 q-4 4 0 8`} />
        ) : (
          <path d={`M${L} ${Y - 26} L${L} ${Y - 40} M${L} ${Y + 26} L${L} ${Y + 40}`} />
        )}
      </g>
      <g fill={KIRMIZI} fillOpacity={yakin ? 0.75 : 0.35}>
        <ellipse cx={L} cy={Y - (yakin ? 46 : 46)} rx={yakin ? 9 : 6} ry={yakin ? 6 : 4} />
        <ellipse cx={L} cy={Y + 46} rx={yakin ? 9 : 6} ry={yakin ? 6 : 4} />
      </g>
      <circle cx={F} cy={Y} r={4} fill={YESIL} />
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={20} y={yakin ? 64 : 64}>{yakin ? cev("yakın nesne") : cev("uzak nesne")}</text>
        <text x={296} y={170}>{cev("retina")}</text>
      </g>
      <g fontSize={11.5} fontWeight={700}>
        <text x={14} y={168} fill={KIRMIZI}>{cev("kirpiksi kas:")} {yakin ? cev("kasılı") : cev("gevşek")}</text>
        <text x={14} y={184} fill="var(--muted)">{cev("askı bağları:")} {yakin ? cev("gevşek") : cev("gergin")}</text>
        <text x={14} y={200} fill={MAVI}>{cev("mercek:")} {yakin ? cev("kalın (çok kırar)") : cev("ince (az kırar)")}</text>
      </g>
      <text x={170} y={219} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {yakin ? cev("Yakına bakıyorsun: görüntü retinada net") : cev("Uzağa bakıyorsun: görüntü retinada net")}
      </text>
    </svg>
  );
}

/* ---------- miyop ve hipermetrop: düzeltici mercek ---------- */

function Mercek({ v, s }: SahneProps) {
  const hiper = s.kusur === "hiper";
  const d = sinir(Math.round(v.d ?? 0), -3, 3);
  const Y = 100, L = 150;
  const R = hiper ? 262 : 300; // retina
  const f = sinir((hiper ? R + 40 : R - 40) - 20 * d, 175, 340);
  const h = sinir(18 - 3 * d, 6, 30); // ışının göz merceğine geldiği yükseklik
  const retinaY = (yon: number) => Y + yon * h * ((f - R) / (f - L));
  const leke = Math.abs(h * ((f - R) / (f - L)));
  const net = leke < 1;
  const cx = (138 + R) / 2, rx = (R - 138) / 2;
  const durum = net ? cev("Odak retinada: görüntü net") : f < R ? cev("Odak retinanın önünde: bulanık") : cev("Odak retinanın arkasında: bulanık");
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={cev("{0} göz, {1}. {2}", hiper ? "Hipermetrop" : "Miyop", d === 0 ? "gözlük yok" : d < 0 ? "kalın kenarlı mercek" : "ince kenarlı mercek", durum)}>
      <ellipse cx={cx} cy={Y} rx={rx} ry={56} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d={`M${R - 8} ${Y - 40} Q${R + 4} ${Y} ${R - 8} ${Y + 40}`} fill="none" stroke={MOR} strokeWidth={4} />
      <ellipse cx={L} cy={Y} rx={7} ry={24} fill={MAVI} fillOpacity={0.35} stroke={MAVI} strokeWidth={2} />
      {d !== 0 && (
        <path
          d={d < 0
            ? `M62 ${Y - 30} L78 ${Y - 30} Q${72 + d} ${Y} 78 ${Y + 30} L62 ${Y + 30} Q${68 - d} ${Y} 62 ${Y - 30} Z`
            : `M70 ${Y - 30} Q${70 + 4 + 2 * d} ${Y} 70 ${Y + 30} Q${70 - 4 - 2 * d} ${Y} 70 ${Y - 30} Z`}
          fill={d < 0 ? KIRMIZI : YESIL} fillOpacity={0.3} stroke={d < 0 ? KIRMIZI : YESIL} strokeWidth={2}
        />
      )}
      <g stroke={SARI} strokeWidth={2} fill="none">
        {[-1, 1].map((yon) => {
          const son = f <= R ? `${f},${Y} ${R - 4},${retinaY(yon) - yon * 0}` : `${R - 4},${retinaY(yon)}`;
          return <polyline key={yon} points={`10,${Y + yon * 18} 70,${Y + yon * 18} ${L},${Y + yon * h} ${son}`} />;
        })}
      </g>
      {f <= 330 && <circle cx={f} cy={Y} r={4} fill={net ? YESIL : KIRMIZI} />}
      {!net && <line x1={R - 2} y1={Y - leke} x2={R - 2} y2={Y + leke} stroke={KIRMIZI} strokeWidth={5} strokeLinecap="round" strokeOpacity={0.7} />}
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={10} y={64}>{cev("gelen ışık")}</text>
        <text x={L} y={170} textAnchor="middle">{cev("göz merceği")}</text>
        <text x={R} y={170} textAnchor="middle">{cev("retina")}</text>
        <text x={70} y={152} textAnchor="middle" fill={d === 0 ? "var(--muted)" : d < 0 ? KIRMIZI : YESIL}>
          {d === 0 ? cev("gözlük yok") : d < 0 ? cev("kalın kenarlı") : cev("ince kenarlı")}
        </text>
        {d !== 0 && <text x={70} y={166} textAnchor="middle" fontWeight={600}>{d < 0 ? cev("(ıraksak)") : cev("(yakınsak)")}</text>}
      </g>
      <text x={170} y={196} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {hiper ? cev("Hipermetrop: göz küresi kısa") : cev("Miyop: göz küresi uzun")}
      </text>
      <text x={170} y={213} fontSize={12.5} fontWeight={800} fill={net ? YESIL : "var(--ink)"} textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- işitme: sesin yolu ---------- */

function Kulak({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const evre = u <= 0 ? -1 : u < 0.28 ? 0 : u < 0.42 ? 1 : u < 0.64 ? 2 : u < 0.84 ? 3 : 4;
  const tit = (e: number) => (evre === e ? Math.sin(t * 40) * 2.5 : 0);
  const kemik = sinir((u - 0.42) / 0.22);
  const ad = [cev("kulak yolu"), cev("kulak zarı"), cev("çekiç, örs, üzengi"), cev("salyangoz"), cev("işitme siniri")];
  const renk = (e: number) => (evre === e ? KIRMIZI : "var(--muted)");
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={evre >= 0 ? cev("Ses şu an: {0}", ad[evre]) : cev("Kulak: kulak yolu, kulak zarı, kemikçikler, salyangoz, işitme siniri")}>
      <path d="M40 40 C14 50 12 100 26 120 C34 132 30 150 44 158" fill="none" stroke="var(--ink)" strokeWidth={2.4} />
      <path d="M38 86 L116 86 M38 112 L116 112" stroke="var(--ink)" strokeWidth={2} />
      {evre === 0 && [0, 1, 2].map((i) => {
        const x = ara(30, 104, sinir(u / 0.28 - i * 0.18));
        return <path key={i} d={`M${x} 90 Q${x + 6} 99 ${x} 108`} fill="none" stroke={KIRMIZI} strokeWidth={2.2} />;
      })}
      <path d={`M118 78 Q${124 + tit(1)} 99 118 120`} fill="none" stroke={renk(1)} strokeWidth={4} />
      <g transform={`translate(${tit(2)},0)`}>
        <ellipse cx={134} cy={88} rx={8} ry={5} fill={evre === 2 && kemik < 0.4 ? KIRMIZI : SARI} stroke="var(--ink)" strokeWidth={1} />
        <ellipse cx={150} cy={82} rx={7} ry={6} fill={evre === 2 && kemik >= 0.3 && kemik < 0.7 ? KIRMIZI : SARI} stroke="var(--ink)" strokeWidth={1} />
        <path d="M158 84 L170 92 L166 100 M170 92 L176 96" fill="none" stroke={evre === 2 && kemik >= 0.6 ? KIRMIZI : SARI} strokeWidth={4} strokeLinecap="round" />
      </g>
      <path d="M140 122 C146 150 150 170 160 184" fill="none" stroke={MAVI} strokeWidth={6} strokeOpacity={0.4} strokeLinecap="round" />
      <g>
        <path d="M216 98 m-34 0 a34 30 0 1 1 68 0 a26 22 0 1 1 -52 0 a18 15 0 1 1 36 0 a10 8 0 1 1 -20 0" fill="none" stroke={evre === 3 ? KIRMIZI : MOR} strokeWidth={evre === 3 ? 6 : 5} strokeOpacity={evre === 3 ? 0.4 + 0.4 * Math.abs(Math.sin(t * 12)) : 0.5} strokeLinecap="round" />
      </g>
      <path d="M248 92 L318 64" stroke={evre === 4 ? KIRMIZI : MOR} strokeWidth={3} />
      {evre === 4 && <circle cx={ara(248, 318, sinir((u - 0.84) / 0.16))} cy={ara(92, 64, sinir((u - 0.84) / 0.16))} r={5} fill={KIRMIZI} />}
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={76} y={74} fill={renk(0)}>{cev("kulak yolu")}</text>
        <text x={92} y={140} fill={renk(1)}>{cev("kulak zarı")}</text>
        <text x={156} y={60} fill={renk(2)}>{cev("kemikçikler")}</text>
        <text x={216} y={150} fill={renk(3)}>{cev("salyangoz")}</text>
        <text x={296} y={50} fill={renk(4)}>{cev("işitme siniri")}</text>
        <text x={204} y={180} fill="var(--muted)" fontWeight={600}>{cev("östaki borusu")}</text>
      </g>
      <text x={170} y={210} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {evre < 0 ? cev("Ses dalgası kulağa geliyor") : evre === 4 ? cev("İmpuls beyne gidiyor: işitme") : cev("Titreşim: {0}", ad[evre])}
      </text>
    </svg>
  );
}

/* ---------- denge: dönmeyi algılamak ---------- */

function Denge({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const donuyor = u > 0 && u < 0.6;
  const kanal = u <= 0 ? 0 : u < 0.6 ? 150 * yumusak(u / 0.6) : 150;
  // Sıvı kanalın gerisinde kalır, baş durunca bir süre daha döner.
  const sivi = u <= 0 ? 0 : u < 0.6 ? 150 * yumusak(u / 0.6) - 40 * Math.sin((Math.PI * u) / 0.6) * 0.9 : 150 + 30 * Math.sin((Math.PI * (u - 0.6)) / 0.8);
  const egim = sinir((kanal - sivi) / 2, -22, 22);
  const C = 110, Y = 100, R = 58;
  const rad = (a: number) => ((a + 90) * Math.PI) / 180;
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={cev("Yarım daire kanalı dönüyor; içindeki sıvı geride kalıp tüylü hücreleri eğiyor")}>
      <g transform={`rotate(${kanal} ${C} ${Y})`}>
        <circle cx={C} cy={Y} r={R} fill="none" stroke={MOR} strokeWidth={14} strokeOpacity={0.2} />
        <circle cx={C} cy={Y} r={R} fill="none" stroke={MOR} strokeWidth={1.5} />
        <g transform={`translate(${C} ${Y + R}) rotate(${egim})`}>
          <path d="M-9 6 L0 -16 L9 6 Z" fill={KIRMIZI} fillOpacity={0.6} stroke={KIRMIZI} strokeWidth={1.5} />
        </g>
      </g>
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const aa = rad(a + sivi + 30);
        return <circle key={a} cx={C + R * Math.cos(aa)} cy={Y + R * Math.sin(aa)} r={3.5} fill={MAVI} />;
      })}
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={C} y={Y + 4} textAnchor="middle">{cev("yarım daire")}</text>
        <text x={C} y={Y + 18} textAnchor="middle">{cev("kanalı")}</text>
        <text x={204} y={42}><tspan fill={MAVI}>●</tspan> {cev("sıvı")}</text>
        <text x={204} y={60} fill={KIRMIZI}>{cev("▲ tüylü hücreler")}</text>
        <text x={204} y={96} fill="var(--ink)">{cev("Dönme")}</text>
        <text x={204} y={110}>{cev("yarım daire kanalları")}</text>
        <text x={204} y={136} fill="var(--ink)">{cev("Eğilme, hızlanma")}</text>
        <text x={204} y={150}>{cev("tulumcuk, kesecik")}</text>
      </g>
      <text x={170} y={186} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {u <= 0 ? cev("Baş duruyor") : donuyor ? cev("Baş dönüyor: {0}°", Math.round(kanal)) : cev("Baş durdu")}
      </text>
      <text x={170} y={206} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? cev("Sıvı ve tüyler dik") : donuyor ? cev("Sıvı geride kalıyor, tüyler eğiliyor") : cev("Sıvı dönmeye devam ediyor: baş dönmesi")}
      </text>
    </svg>
  );
}

/* ---------- kemik boyca uzar ---------- */

function Boy({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const g = yumusak(sinir(u / 0.8));
  const L = ara(78, 118, g);
  const plak = u < 0.8 ? 1 : sinir(1 - (u - 0.8) / 0.15);
  const yas = Math.round(ara(6, 20, sinir(u)));
  const Y = 104;
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={cev("Uzun kemik, yaş {0}; kemik epifiz plaklarından boyca uzuyor", yas)}>
      <rect x={170 - L + 18} y={Y - 17} width={2 * (L - 18)} height={34} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
      <rect x={170 - L + 30} y={Y - 7} width={2 * (L - 30)} height={14} rx={4} fill={SARI} fillOpacity={0.55} />
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={170 + k * (L - 6)} cy={Y} rx={22} ry={30} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
          <line x1={170 + k * (L - 20)} y1={Y - 26} x2={170 + k * (L - 20)} y2={Y + 26} stroke={KIRMIZI} strokeWidth={4} strokeOpacity={plak} />
          {plak < 1 && <line x1={170 + k * (L - 20)} y1={Y - 26} x2={170 + k * (L - 20)} y2={Y + 26} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="3 3" strokeOpacity={1 - plak} />}
        </g>
      ))}
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={170 + L - 20} y={58} fill={plak > 0.1 ? KIRMIZI : "var(--muted)"}>{plak > 0.1 ? cev("epifiz plağı") : cev("epifiz çizgisi")}</text>
        <line x1={170 + L - 20} y1={62} x2={170 + L - 20} y2={72} stroke={plak > 0.1 ? KIRMIZI : "var(--muted)"} strokeWidth={1} />
        <text x={170 + L - 6} y={152} fill="var(--muted)">{cev("epifiz")}</text>
        <text x={170} y={80} fill="var(--muted)">{cev("diafiz")}</text>
        <text x={170} y={140} fill="var(--muted)" fontWeight={600}>{cev("ilik boşluğu")}</text>
      </g>
      <text x={14} y={30} fontSize={12.5} fontWeight={800} fill="var(--ink)">{cev("Yaş:")} {yas}</text>
      <text x={170} y={178} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{cev("Kemik boyu:")} {Math.round(2 * L)} {cev("birim")}</text>
      <text x={170} y={198} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? cev("Çocukluk: plaklar açık") : u < 0.8 ? cev("Plaklarda yeni kıkırdak, sonra kemik") : cev("Ergenlik bitti: plaklar kemikleşti")}
      </text>
    </svg>
  );
}

/* ---------- eklem türleri ---------- */

const EKLEM = [
  { ad: cev("Oynamaz eklem"), ornek: cev("kafatası kemikleri"), aci: 0 },
  { ad: cev("Yarı oynar eklem"), ornek: cev("omurlar arası"), aci: 14 },
  { ad: cev("Oynar eklem"), ornek: cev("diz, dirsek, omuz"), aci: 110 },
];

function Eklem({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 2.5;
  const u = ilerleme(t, oynuyor, sure);
  const e = sinir(Math.round(v.e ?? 1), 1, 3) - 1;
  const k = EKLEM[e];
  const aci = k.aci * Math.sin(Math.PI * u);
  const P = { x: 120, y: 104 };
  return (
    <svg viewBox="0 0 340 215" role="img" aria-label={cev("{0} ({1}); en fazla {2} derece hareket", k.ad, k.ornek, k.aci)}>
      <rect x={P.x - 9} y={22} width={18} height={P.y - 30} rx={8} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
      <g transform={`rotate(${aci} ${P.x} ${P.y + 4})`}>
        <rect x={P.x - 9} y={P.y + 8} width={18} height={76} rx={8} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
      </g>
      {e === 0 && <path d={`M${P.x - 12} ${P.y + 2} l4 -5 l4 5 l4 -5 l4 5 l4 -5 l4 5`} fill="none" stroke={KIRMIZI} strokeWidth={2} />}
      {e === 1 && <rect x={P.x - 13} y={P.y - 6} width={26} height={12} rx={6} fill={MAVI} fillOpacity={0.5} stroke={MAVI} strokeWidth={1.5} />}
      {e === 2 && (
        <g>
          <ellipse cx={P.x} cy={P.y + 2} rx={22} ry={20} fill={MAVI} fillOpacity={0.18} stroke={MOR} strokeWidth={1.8} strokeDasharray="4 3" />
          <ellipse cx={P.x} cy={P.y + 2} rx={11} ry={5} fill={MAVI} fillOpacity={0.5} />
        </g>
      )}
      <g fontSize={11.5} fontWeight={700}>
        <text x={190} y={56} fill="var(--ink)" fontSize={13} fontWeight={800}>{k.ad}</text>
        <text x={190} y={74} fill="var(--muted)" fontWeight={600}>{k.ornek}</text>
        {e === 0 && <text x={190} y={104} fill={KIRMIZI}>{cev("kemikler kaynaşık")}</text>}
        {e === 1 && <text x={190} y={104} fill={MAVI}>{cev("arada kıkırdak disk")}</text>}
        {e === 2 && (
          <g>
            <text x={190} y={104} fill={MOR}>{cev("kapsül (kesikli)")}</text>
            <text x={190} y={120} fill={MAVI}>{cev("eklem sıvısı")}</text>
            <text x={190} y={136} fill="var(--muted)">{cev("uçlarda kıkırdak, bağlar")}</text>
          </g>
        )}
      </g>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u > 0 ? cev("Hareket: {0}° (en çok {1}°)", Math.round(aci), k.aci) : cev("En çok {0}° hareket: oynat ve gör", k.aci)}
      </text>
    </svg>
  );
}

/* ---------- biseps ve triseps ---------- */

function Kol({ v }: SahneProps) {
  const b = (v.b ?? 0) === 1, tr = (v.tr ?? 0) === 1;
  const aci = b && !tr ? 115 : tr && !b ? 0 : 50; // önkolun yataydan yukarı açısı
  const E = { x: 196, y: 128 };
  const r = (aci * Math.PI) / 180;
  const uc = { x: E.x + 104 * Math.cos(r), y: E.y - 104 * Math.sin(r) };
  const tutun = { x: E.x + 22 * Math.cos(r) - 6 * Math.sin(r), y: E.y - 22 * Math.sin(r) - 6 * Math.cos(r) };
  const kas = (kasik: boolean, cy: number, renk: string) => (
    <ellipse cx={kasik ? 120 : 126} cy={cy} rx={kasik ? 44 : 54} ry={kasik ? 15 : 8} fill={renk} fillOpacity={kasik ? 0.75 : 0.3} stroke={renk} strokeWidth={1.5} />
  );
  const durum = b && tr ? cev("İkisi birden kasıldı: kol kilitlendi") : b ? cev("Biseps çekti: dirsek büküldü") : tr ? cev("Triseps çekti: kol açıldı") : cev("İki kas da gevşek");
  return (
    <svg viewBox="0 0 340 225" role="img" aria-label={cev("Biseps {0}, triseps {1}. {2}", b ? "kasılı" : "gevşek", tr ? "kasılı" : "gevşek", durum)}>
      <rect x={52} y={E.y - 8} width={E.x - 52} height={16} rx={8} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
      <circle cx={48} cy={E.y} r={14} fill="var(--panel)" stroke="var(--ink)" strokeWidth={2} />
      <line x1={E.x} y1={E.y} x2={uc.x} y2={uc.y} stroke="var(--ink)" strokeWidth={16} strokeLinecap="round" />
      <line x1={E.x} y1={E.y} x2={uc.x} y2={uc.y} stroke="var(--panel)" strokeWidth={12} strokeLinecap="round" />
      <circle cx={uc.x} cy={uc.y} r={10} fill={SARI} fillOpacity={0.6} stroke="var(--ink)" strokeWidth={1.5} />
      {kas(b, E.y - 20, KIRMIZI)}
      <line x1={b ? 164 : 180} y1={E.y - 20} x2={tutun.x} y2={tutun.y} stroke="var(--ink)" strokeWidth={2.2} />
      {kas(tr, E.y + 20, MAVI)}
      <line x1={tr ? 164 : 180} y1={E.y + 20} x2={E.x + 4} y2={E.y + 8} stroke="var(--ink)" strokeWidth={2.2} />
      <circle cx={E.x} cy={E.y} r={6} fill="var(--ink)" />
      <g fontSize={11.5} fontWeight={700}>
        <text x={20} y={78} fill={KIRMIZI}>{cev("biseps:")} {b ? cev("kasıldı") : cev("gevşek")}</text>
        <text x={20} y={182} fill={MAVI}>{cev("triseps:")} {tr ? cev("kasıldı") : cev("gevşek")}</text>
        <text x={E.x + 10} y={E.y + 26} fill="var(--muted)">{cev("dirsek")}</text>
      </g>
      <text x={170} y={214} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- sarkomer: kayan iplikler ---------- */

/** Sarkomer çizimi. S sarkomer boyu (µm); 1 µm = 100 birim; A bandı 1,6 µm, aktin her yanda 1,0 µm. */
function SarkomerCiz({ S, ca }: { S: number; ca?: boolean }) {
  const PX = 100, Y = 92;
  const zl = 170 - (S * PX) / 2, zr = 170 + (S * PX) / 2;
  const al = 170 - 80, ar = 170 + 80;
  const ak = 100; // aktin boyu
  const I = S - 1.6, H = Math.max(0, S - 2);
  return (
    <g>
      <g stroke={MOR} strokeWidth={5} strokeLinecap="round">
        {[Y - 14, Y + 14].map((y) => <line key={y} x1={al} y1={y} x2={ar} y2={y} />)}
      </g>
      <g stroke={MOR} strokeWidth={1.5}>
        {[Y - 14, Y + 14].flatMap((y) =>
          [-1, 1].flatMap((k) => [0, 1, 2, 3, 4].map((i) => {
            const x = 170 + k * (24 + i * 13);
            return <line key={`${y}${k}${i}`} x1={x} y1={y} x2={x - k * 4} y2={y + (i % 2 ? 6 : -6)} />;
          })))}
      </g>
      <g stroke={MAVI} strokeWidth={2.4}>
        {[Y - 26, Y, Y + 26].map((y) => (
          <g key={y}>
            <line x1={zl} y1={y} x2={zl + ak} y2={y} />
            <line x1={zr - ak} y1={y} x2={zr} y2={y} />
          </g>
        ))}
      </g>
      {ca && (
        <g fill={SARI} stroke="var(--ink)" strokeWidth={0.6}>
          {[Y - 26, Y, Y + 26].flatMap((y) => [0.3, 0.6, 0.9].flatMap((p) => [
            <circle key={`l${y}${p}`} cx={zl + ak * p} cy={y - 4} r={2.4} />,
            <circle key={`r${y}${p}`} cx={zr - ak * p} cy={y - 4} r={2.4} />,
          ]))}
        </g>
      )}
      <g stroke="var(--ink)" strokeWidth={2.4} fill="none">
        {[zl, zr].map((x) => <path key={x} d={`M${x} ${Y - 38} l-4 9 l8 9 l-8 9 l8 9 l-8 9 l8 9 l-4 8`} />)}
      </g>
      <g strokeWidth={1.5} fill="none">
        <path d={`M${zl} 42 L${zl} 38 L${zr} 38 L${zr} 42`} stroke="var(--ink)" />
        <path d={`M${al} 136 L${al} 140 L${ar} 140 L${ar} 136`} stroke={MOR} />
        <path d={`M${zl} 136 L${zl} 140 L${al} 140 L${al} 136 M${ar} 136 L${ar} 140 L${zr} 140 L${zr} 136`} stroke={MAVI} />
      </g>
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={170} y={32} fill="var(--ink)">{cev("sarkomer")} {virgul(S)} µm</text>
        <text x={zl} y={32} fill="var(--muted)">Z</text>
        <text x={zr} y={32} fill="var(--muted)">Z</text>
        <text x={170} y={156} fill={MOR}>{cev("A bandı 1,60 µm (miyozin)")}</text>
        <text x={170} y={172} fill={MAVI}>{cev("I bandı")} {virgul(I)} {cev("µm · H bölgesi")} {virgul(H)} µm</text>
      </g>
    </g>
  );
}

function Sarkomer({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const S = ara(2.4, 2.0, yumusak(u));
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={cev("Sarkomer {0} µm; A bandı 1,6 µm", virgul(S))}>
      <SarkomerCiz S={S} ca={u > 0 && u < 1} />
      <text x={170} y={198} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {u <= 0 ? cev("Gevşek kas: aktin (mavi), miyozin (mor)") : u < 1 ? cev("Miyozin başları aktini merkeze çekiyor") : cev("Kasıldı: iplikler kısalmadı, kaydı")}
      </text>
    </svg>
  );
}

function Kalsiyum({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 3;
  const u = ilerleme(t, oynuyor, sure);
  const ca = (v.ca ?? 0) === 1, atp = (v.atp ?? 0) === 1;
  const olur = ca && atp;
  const S = olur ? ara(2.4, 2.0, yumusak(u)) : 2.4;
  const durum = !ca ? cev("Ca²⁺ yok: aktindeki bağlanma yerleri kapalı") : !atp ? cev("ATP yok: miyozin başları çekemiyor") : u <= 0 ? cev("Ca²⁺ ve ATP hazır: oynat") : u < 1 ? cev("Ca²⁺ bağlanma yerlerini açtı, ATP ile çekiliyor") : cev("Kas kasıldı");
  return (
    <svg viewBox="0 0 340 210" role="img" aria-label={cev("Ca²⁺ {0}, ATP {1}. {2}", ca ? "var" : "yok", atp ? "var" : "yok", durum)}>
      <SarkomerCiz S={S} ca={ca} />
      <text x={170} y={198} fontSize={12.5} fontWeight={800} fill={!ca || !atp ? KIRMIZI : "var(--ink)"} textAnchor="middle">{durum}</text>
    </svg>
  );
}

/* ---------- kasın enerji kaynakları ---------- */

const KAYNAK = [
  { ad: cev("hazır ATP"), bas: 0, son: 3, renk: KIRMIZI },
  { ad: cev("kreatin fosfat"), bas: 2, son: 12, renk: SARI },
  { ad: cev("oksijenli solunum"), bas: 6, son: 60, renk: YESIL },
];

function Enerji({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const sn = 30 * u * u; // ilk saniyeler yavaş akar
  const etkin = sn <= 0 ? -1 : sn < 2 ? 0 : sn < 9 ? 1 : 2;
  return (
    <svg viewBox="0 0 340 215" role="img" aria-label={cev("Koşunun {0}. saniyesi; ATP'yi şu an {1} sağlıyor", Math.round(sn), etkin >= 0 ? KAYNAK[etkin].ad : "kimse")}>
      {KAYNAK.map((k, i) => {
        const y = 40 + i * 50;
        const stok = i < 2 ? 1 - sinir((sn - k.bas) / (k.son - k.bas)) : sinir((sn - k.bas) / 8);
        return (
          <g key={k.ad}>
            <text x={14} y={y + 15} fontSize={12} fontWeight={700} fill={etkin === i ? k.renk : "var(--muted)"}>{k.ad}</text>
            <rect x={140} y={y} width={180} height={22} rx={6} fill="var(--line)" fillOpacity={0.5} />
            <rect x={140} y={y} width={Math.max(0, 180 * stok)} height={22} rx={6} fill={k.renk} fillOpacity={etkin === i ? 0.85 : 0.4} />
            <text x={312} y={y + 15} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">{i < 2 ? (stok > 0 ? cev("stok") : cev("bitti")) : stok > 0 ? cev("devrede") : cev("bekliyor")}</text>
          </g>
        );
      })}
      <text x={170} y={182} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{cev("Koşu süresi:")} {Math.round(sn)} s</text>
      <text x={170} y={204} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        {etkin < 0 ? cev("Koşu başlıyor: ATP'yi ne sağlayacak?") : cev("ATP'yi şimdi {0} sağlıyor", KAYNAK[etkin].ad)}
      </text>
    </svg>
  );
}

/* ---------- kas türleri ---------- */

function KasTur() {
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label={cev("Üç kas dokusu: iskelet kası çizgili ve çok çekirdekli, düz kas iğ biçimli ve çizgisiz, kalp kası dallanmış, çizgili ve ara diskli")}>
      <g>
        <rect x={14} y={40} width={92} height={70} rx={10} fill={KIRMIZI} fillOpacity={0.15} stroke={KIRMIZI} strokeWidth={1.5} />
        {Array.from({ length: 13 }, (_, i) => <line key={i} x1={22 + i * 6.4} y1={44} x2={22 + i * 6.4} y2={106} stroke={KIRMIZI} strokeOpacity={0.6} strokeWidth={1.4} />)}
        {[30, 58, 86].map((x) => <ellipse key={x} cx={x} cy={46} rx={6} ry={3} fill={MOR} />)}
        {[44, 72, 98].map((x) => <ellipse key={x} cx={x} cy={104} rx={6} ry={3} fill={MOR} />)}
      </g>
      <g>
        {[52, 75, 98].map((y, i) => (
          <g key={y}>
            <path d={`M${126 + i * 8} ${y} Q${170 + i * 8} ${y - 14} ${214 - (2 - i) * 6} ${y} Q${170 + i * 8} ${y + 14} ${126 + i * 8} ${y} Z`} fill={KIRMIZI} fillOpacity={0.15} stroke={KIRMIZI} strokeWidth={1.5} />
            <ellipse cx={170 + i * 4} cy={y} rx={6} ry={3} fill={MOR} />
          </g>
        ))}
      </g>
      <g>
        <path d="M236 50 L326 50 L326 66 L300 66 L312 100 L296 100 L284 66 L236 66 Z" fill={KIRMIZI} fillOpacity={0.15} stroke={KIRMIZI} strokeWidth={1.5} />
        <path d="M236 82 L280 82 L286 100 L236 100 Z" fill={KIRMIZI} fillOpacity={0.15} stroke={KIRMIZI} strokeWidth={1.5} />
        {[244, 252, 260, 268, 276, 288, 296, 304, 312, 320].map((x) => <line key={x} x1={x} y1={52} x2={x} y2={64} stroke={KIRMIZI} strokeOpacity={0.6} strokeWidth={1.3} />)}
        {[244, 252, 260, 268].map((x) => <line key={x} x1={x} y1={84} x2={x} y2={98} stroke={KIRMIZI} strokeOpacity={0.6} strokeWidth={1.3} />)}
        <line x1={282} y1={48} x2={282} y2={68} stroke="var(--ink)" strokeWidth={3} />
        <line x1={256} y1={80} x2={256} y2={102} stroke="var(--ink)" strokeWidth={3} />
        <ellipse cx={262} cy={58} rx={5} ry={3} fill={MOR} />
        <ellipse cx={304} cy={84} rx={3} ry={5} fill={MOR} />
      </g>
      <g fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        <text x={60} y={134}>{cev("İskelet kası")}</text>
        <text x={172} y={134}>{cev("Düz kas")}</text>
        <text x={281} y={134}>{cev("Kalp kası")}</text>
      </g>
      <g fontSize={11} fontWeight={600} textAnchor="middle" fill="var(--muted)">
        <text x={60} y={150}>{cev("çizgili")}</text>
        <text x={60} y={164}>{cev("çok çekirdekli")}</text>
        <text x={172} y={150}>{cev("çizgisiz")}</text>
        <text x={172} y={164}>{cev("tek çekirdek")}</text>
        <text x={281} y={150}>{cev("çizgili, dallı")}</text>
        <text x={281} y={164}>{cev("ara diskler (siyah)")}</text>
      </g>
      <text x={170} y={192} fontSize={12.5} fontWeight={800} fill="var(--ink)" textAnchor="middle">{cev("Çizgiler aktin ve miyozinin dizilişidir")}</text>
    </svg>
  );
}

export const BIYOLOJI10: Record<string, SahneKaydi> = {
  "biy10-yol": { C: Yol },
  "biy10-bebek": { C: Bebek },
  "biy10-uyum": { C: Uyum },
  "biy10-mercek": { C: Mercek },
  "biy10-kulak": { C: Kulak },
  "biy10-denge": { C: Denge },
  "biy10-boy": { C: Boy },
  "biy10-eklem": { C: Eklem },
  "biy10-kol": { C: Kol },
  "biy10-sarkomer": { C: Sarkomer },
  "biy10-kalsiyum": {
    C: Kalsiyum,
    geri: (v) =>
      (v.ca ?? 0) !== 1
        ? { baslik: cev("Kas kasılmadı"), metin: cev("Ca²⁺ salınmadan aktindeki bağlanma yerleri kapalı kalır. Miyozin tutunamaz. Ca²⁺'u aç ve yeniden oynat.") }
        : (v.atp ?? 0) !== 1
          ? { baslik: cev("Kas kasılmadı"), metin: cev("Miyozin başları aktini ATP'nin enerjisiyle çeker. ATP'yi aç ve yeniden oynat.") }
          : null,
  },
  "biy10-enerji": { C: Enerji },
  "biy10-kas": { C: KasTur },
};
