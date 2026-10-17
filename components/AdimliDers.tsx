"use client";
// Örnek ders (Brilliant tarzı): her adımda büyük, hareketli bir görsel + kısa metin + öğrencinin
// yaptığı bir iş. İş bitince "Devam" açılır. Konu: Bir boyutta hareket.
// Bu dosya bir denemedir; Üçler beğenirse diğer konulara nasıl taşınacağı ayrıca planlanır.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const KONU = "/fizik/bir-boyutta-hareket/";

/* ---------- ortak çizim parçaları ---------- */

// Yol: 0-50 m, viewBox genişliği 340.
const X0 = 30, PX = 5.6;
const X = (m: number) => X0 + m * PX;
const ROAD_H = 26;

function Yol({ y, etiket = true }: { y: number; etiket?: boolean }) {
  return (
    <g>
      <rect x={X0 - 14} y={y} width={50 * PX + 28} height={ROAD_H} rx={8} fill="#e6ebf2" />
      <line x1={X0 - 6} x2={X(50) + 6} y1={y + ROAD_H / 2} y2={y + ROAD_H / 2} stroke="#fff" strokeWidth={2} strokeDasharray="8 7" />
      {etiket &&
        [0, 10, 20, 30, 40, 50].map((m) => (
          <g key={m}>
            <line x1={X(m)} x2={X(m)} y1={y + ROAD_H + 2} y2={y + ROAD_H + 8} stroke="var(--muted)" strokeWidth={1.2} />
            <text x={X(m)} y={y + ROAD_H + 21} fontSize={11} fill="var(--muted)" textAnchor="middle">{m}</text>
          </g>
        ))}
      {etiket && <text x={X(50) + 12} y={y + ROAD_H + 21} fontSize={11} fill="var(--muted)">m</text>}
    </g>
  );
}

// Araba: (x, y) yolun ortasındaki noktadır. ters: sola bakar.
function Araba({ x, y, renk = "var(--fizik)", soluk = false, ters = false, olcek = 1 }: { x: number; y: number; renk?: string; soluk?: boolean; ters?: boolean; olcek?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(ters ? -1 : 1) * olcek} ${olcek})`} opacity={soluk ? 0.22 : 1}>
      <path d="M-18 -4 L-18 -11 Q-18 -14 -15 -14 L-8 -14 L-3 -21 L8 -21 Q11 -21 12 -18 L14 -14 L16 -14 Q19 -14 19 -11 L19 -4 Z" fill={renk} />
      <path d="M-5 -14 L-1 -19 L4 -19 L4 -14 Z M6 -19 L9 -19 L11 -14 L6 -14 Z" fill="#fff" opacity={0.85} />
      <circle cx={-10} cy={-4} r={4.6} fill="var(--ink)" />
      <circle cx={11} cy={-4} r={4.6} fill="var(--ink)" />
      <circle cx={-10} cy={-4} r={1.7} fill="#cfd8e3" />
      <circle cx={11} cy={-4} r={1.7} fill="#cfd8e3" />
    </g>
  );
}

// Arka plan: açık gökyüzü ve iki yumuşak tepe (yalnızca tek yollu sahnelerde).
function Manzara({ y }: { y: number }) {
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id="ad-gok" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#eaf2ff" stopOpacity={0} />
          <stop offset="1" stopColor="#eaf2ff" />
        </linearGradient>
      </defs>
      <rect x={0} y={y - 90} width={340} height={90} fill="url(#ad-gok)" />
      <path d={`M0 ${y} Q60 ${y - 34} 130 ${y - 8} T250 ${y - 14} T340 ${y - 6} V${y} Z`} fill="#dff1e7" />
      <path d={`M150 ${y} Q215 ${y - 24} 280 ${y - 4} T340 ${y - 2} V${y} Z`} fill="#cfe9da" />
    </g>
  );
}

function Ok({ x1, x2, y, renk, kalin = 3 }: { x1: number; x2: number; y: number; renk: string; kalin?: number }) {
  if (Math.abs(x2 - x1) < 2) return null;
  const d = x2 > x1 ? 1 : -1, uc = x2 - d * 9;
  return (
    <g>
      <line x1={x1} x2={uc} y1={y} y2={y} stroke={renk} strokeWidth={kalin} strokeLinecap="round" />
      <path d={`M${x2} ${y} L${uc} ${y - 5.5} L${uc} ${y + 5.5} Z`} fill={renk} />
    </g>
  );
}

// İşaret: üstünde değer yazan küçük balon.
function Balon({ x, y, yazi, renk = "var(--ink)" }: { x: number; y: number; yazi: string; renk?: string }) {
  const w = yazi.length * 7 + 16;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-22} width={w} height={22} rx={7} fill={renk} />
      <path d="M-5 0 L0 6 L5 0 Z" fill={renk} />
      <text y={-7} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">{yazi}</text>
    </g>
  );
}

/* ---------- animasyon ---------- */

// T saniyelik bir hareketi gerçek zamanda HIZ katı hızlı oynatır.
const HIZ = 1.6;
function useOynat(T: number, bitince?: () => void) {
  const [t, setT] = useState(0);
  const [run, setRun] = useState(false);
  const son = useRef(bitince);
  son.current = bitince;
  useEffect(() => {
    if (!run) return;
    let id = 0;
    const bas = performance.now();
    const kare = (now: number) => {
      const s = Math.min(((now - bas) / 1000) * HIZ, T);
      setT(s);
      if (s >= T) { setRun(false); son.current?.(); return; }
      id = requestAnimationFrame(kare);
    };
    id = requestAnimationFrame(kare);
    return () => cancelAnimationFrame(id);
  }, [run, T]);
  const basla = useCallback(() => { setT(0); setRun(true); }, []);
  return { t, run, basla };
}

/* ---------- soru ---------- */

type Secenek = { yazi: React.ReactNode; dogru?: boolean; neden: string };

function Soru({ soru, secenekler, tamam }: { soru: string; secenekler: Secenek[]; tamam: () => void }) {
  const [yanlis, setYanlis] = useState<number[]>([]);
  const [dogru, setDogru] = useState<number | null>(null);
  const son = yanlis.length ? yanlis[yanlis.length - 1] : null;
  const fb = useRef<HTMLDivElement>(null);
  // Geri bildirim alttaki "Devam" çubuğunun arkasında kalmasın.
  useEffect(() => { fb.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [dogru, yanlis.length]);
  return (
    <div className="ad-soru">
      <p className="ad-soru-h">{soru}</p>
      <div className="opts">
        {secenekler.map((s, k) => (
          <button
            key={k}
            className={`opt ${dogru === k ? "right" : yanlis.includes(k) ? "wrong" : ""}`}
            disabled={dogru !== null || yanlis.includes(k)}
            onClick={() => {
              if (s.dogru) { setDogru(k); tamam(); } else setYanlis((y) => [...y, k]);
            }}
          >
            <span className="l">{"ABCD"[k]}</span>
            <span>{s.yazi}</span>
          </button>
        ))}
      </div>
      {dogru !== null ? (
        <div className="feedback ok" ref={fb}><h2>Doğru!</h2><p>{secenekler[dogru].neden}</p></div>
      ) : son !== null ? (
        <div className="feedback no" ref={fb}><h2>Tekrar dene</h2><p>{secenekler[son].neden}</p></div>
      ) : null}
    </div>
  );
}

function Surgu({ ad, deger, min, max, birim, set, kapali }: { ad: string; deger: number; min: number; max: number; birim: string; set: (v: number) => void; kapali?: boolean }) {
  return (
    <label className="surgu genis">
      <span>{ad}</span>
      <input type="range" min={min} max={max} step={1} value={deger} disabled={kapali} onChange={(e) => set(Number(e.target.value))} />
      <b>{deger} {birim}</b>
    </label>
  );
}

const Oynat = ({ run, onClick, yazi = "Oynat" }: { run: boolean; onClick: () => void; yazi?: string }) => (
  <button className="btn main ad-oynat" disabled={run} onClick={onClick}>{run ? "Oynuyor…" : yazi}</button>
);

/* ---------- adımlar ---------- */

type AdimProps = { tamam: () => void };

// 1. Konum: arabayı sürükle.
function Konum({ tamam }: AdimProps) {
  const [m, setM] = useState(4);
  const svg = useRef<SVGSVGElement>(null);
  const tut = useRef(false);
  const oldu = m === 30;
  useEffect(() => { if (oldu) tamam(); }, [oldu, tamam]);
  const tasi = (e: React.PointerEvent) => {
    const s = svg.current;
    if (!s) return;
    const p = s.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(s.getScreenCTM()!.inverse());
    setM(Math.max(0, Math.min(50, Math.round((q.x - X0) / PX))));
  };
  return (
    <>
      <div className="ad-sahne">
        <svg
          ref={svg} viewBox="0 40 340 130" className="ad-surukle" role="img" aria-label={`Araba x = ${m} m konumunda`}
          onPointerDown={(e) => { tut.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); tasi(e); }}
          onPointerMove={(e) => tut.current && tasi(e)}
          onPointerUp={() => (tut.current = false)}
        >
          <Manzara y={104} />
          <g opacity={oldu ? 0.35 : 1}>
            <line x1={X(30)} x2={X(30)} y1={52} y2={104} stroke="var(--c4)" strokeWidth={2} />
            <path d={`M${X(30)} 52 L${X(30) + 18} 58 L${X(30)} 64 Z`} fill="var(--c4)" />
          </g>
          <line x1={X(0)} x2={X(0)} y1={70} y2={104} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 3" />
          <text x={X(0)} y={64} fontSize={11} fill="var(--muted)" textAnchor="middle">başlangıç</text>
          <Yol y={104} />
          <Ok x1={X(0)} x2={X(m)} y={92} renk="var(--c1)" kalin={2} />
          <Araba x={X(m)} y={117} />
          <Balon x={X(m)} y={84 - (m > 2 ? 10 : 0)} yazi={`x = ${m} m`} renk={oldu ? "var(--good)" : "var(--ink)"} />
        </svg>
      </div>
      <Surgu ad="Konum" deger={m} min={0} max={50} birim="m" set={setM} />
      {oldu && <div className="feedback ok"><h2>Tam yerinde!</h2><p>Araba başlangıçtan 30 m uzakta, yani konumu x = 30 m. Konum her zaman bir başlangıç noktasına göre söylenir.</p></div>}
    </>
  );
}

// 2. Yer değiştirme ve yol: önce tahmin, sonra izle.
function YerDegistirme({ tamam }: AdimProps) {
  const [tahmin, setTahmin] = useState<number | null>(null);
  const [bitti, setBitti] = useState(false);
  const o = useOynat(4, () => { setBitti(true); tamam(); });
  // 0-2 s: 0 → 40 m, 2-3.5 s: 40 → 10 m
  const e = (u: number) => u * u * (3 - 2 * u);
  const t = o.t;
  const m = t < 2 ? 40 * e(t / 2) : t < 3.5 ? 40 - 30 * e((t - 2) / 1.5) : 10;
  const enUzak = t < 2 ? m : 40;
  const SEC = ["+10 m", "+70 m", "−30 m"];
  return (
    <>
      <div className="ad-sahne">
        <svg viewBox="0 0 340 190" role="img" aria-label="Araba 40 m ileri, sonra 30 m geri gidiyor">
          <Ok x1={X(0)} x2={X(enUzak)} y={30} renk="var(--c1)" />
          {enUzak > 4 && <text x={X(20)} y={22} fontSize={12} fontWeight={700} fill="var(--c1)" textAnchor="middle">40 m ileri</text>}
          {t > 2 && <Ok x1={X(40)} x2={X(m)} y={56} renk="var(--c2)" />}
          {t > 2.6 && <text x={X(25)} y={48} fontSize={12} fontWeight={700} fill="var(--c2)" textAnchor="middle">30 m geri</text>}
          {bitti && (
            <g className="ad-belir">
              <Ok x1={X(0)} x2={X(10)} y={84} renk="var(--good)" kalin={4} />
              <text x={X(10) + 8} y={88} fontSize={13} fontWeight={800} fill="var(--good)">Δx = +10 m</text>
              <text x={X(50)} y={88} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="end">yol = 70 m</text>
            </g>
          )}
          <Manzara y={124} />
          <Yol y={124} />
          <Araba x={X(m)} y={137} ters={t > 2 && t < 3.5} />
        </svg>
      </div>
      {tahmin === null ? (
        <div className="ad-soru">
          <p className="ad-soru-h">Araba 40 m ileri, sonra 30 m geri gidecek. Sence yer değiştirmesi (Δx) kaç metre?</p>
          <div className="opts">
            {SEC.map((s, k) => (
              <button key={k} className="opt" onClick={() => { setTahmin(k); o.basla(); }}>
                <span className="l">{"ABC"[k]}</span><span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      ) : !bitti ? (
        <p className="ad-ipucu">Tahminin: <b>{SEC[tahmin]}</b>. İzle…</p>
      ) : (
        <>
          <div className={`feedback ${tahmin === 0 ? "ok" : "no"}`}>
            <h2>{tahmin === 0 ? "Tahminin doğru!" : "Cevap +10 m"}</h2>
            <p>Yer değiştirme yalnızca ilk ve son konuma bakar: Δx = 10 − 0 = +10 m. Gidilen toplam mesafe ise <b>yol</b>dur: 40 + 30 = 70 m.</p>
          </div>
          <button className="btn" onClick={o.basla} disabled={o.run}>Tekrar izle</button>
        </>
      )}
    </>
  );
}

// 3. Hız: her saniye bir kare. B'nin hızını A'ya eşitle.
function Hiz({ tamam }: AdimProps) {
  const VA = 5;
  const [vB, setVB] = useState(8);
  const [oynanan, setOynanan] = useState<number | null>(null);
  const o = useOynat(5, () => { setOynanan(vB); if (vB === VA) tamam(); });
  const t = o.run || oynanan !== null ? o.t : 0;
  const saniyeler = [0, 1, 2, 3, 4, 5].filter((s) => s <= t + 1e-6);
  const serit = (v: number, y: number, renk: string, ad: string) => (
    <g>
      <text x={4} y={y + ROAD_H + 20} fontSize={13} fontWeight={800} fill={renk}>{ad}</text>
      <Yol y={y} etiket={false} />
      {saniyeler.map((s) => s < t - 0.05 && <Araba key={s} x={X(v * s)} y={y + 13} renk={renk} soluk olcek={0.75} />)}
      {saniyeler.map((s) => (
        <g key={`n${s}`}>
          <circle cx={X(v * s)} cy={y + ROAD_H + 7} r={3} fill={renk} />
          {(s === 0 || s === 5 || v >= 4) && <text x={X(v * s)} y={y + ROAD_H + 20} fontSize={10} fill="var(--muted)" textAnchor="middle">{s} s</text>}
        </g>
      ))}
      <Araba x={X(v * t)} y={y + 13} renk={renk} olcek={0.75} />
    </g>
  );
  const bitti = oynanan !== null && !o.run;
  return (
    <>
      <div className="ad-sahne">
        <svg viewBox="0 0 340 170" role="img" aria-label="İki araba, her saniye çekilmiş karelerle">
          {serit(VA, 18, "var(--c1)", "A")}
          {serit(vB, 96, "var(--c2)", "B")}
        </svg>
      </div>
      <p className="ad-ipucu">A her saniye <b>{VA} m</b> gidiyor. Kareler arası uzaklık arttıkça araba hızlanmış değil, <b>daha hızlı</b> demektir.</p>
      <Surgu ad="B'nin hızı" deger={vB} min={1} max={10} birim="m/s" set={(v) => { setVB(v); setOynanan(null); }} kapali={o.run} />
      <Oynat run={o.run} onClick={o.basla} />
      {bitti && (oynanan === VA ? (
        <div className="feedback ok"><h2>Yan yana gittiler!</h2><p>İkisi de her saniye 5 m gidiyor: v = Δx / Δt = 25 m / 5 s = 5 m/s. Aynı hız, aynı aralıklı kareler demek.</p></div>
      ) : (
        <div className="feedback no"><h2>{oynanan! > VA ? "B öne geçti" : "B geride kaldı"}</h2><p>B her saniye {oynanan} m gidiyor, A ise 5 m. Kareler arasındaki boşluklar eşit olana kadar hızı değiştir.</p></div>
      ))}
    </>
  );
}

// Grafik çerçevesi
const G = { x0: 46, x1: 318, y0: 96, y1: 266 };
function Eksen({ tMax, yMax, yAd, yAdim }: { tMax: number; yMax: number; yAd: string; yAdim: number }) {
  const gx = (t: number) => G.x0 + (t / tMax) * (G.x1 - G.x0);
  const gy = (v: number) => G.y1 - (v / yMax) * (G.y1 - G.y0);
  const ys: number[] = [];
  for (let v = 0; v <= yMax; v += yAdim) ys.push(v);
  return (
    <g>
      {ys.map((v) => (
        <g key={v}>
          <line x1={G.x0} x2={G.x1} y1={gy(v)} y2={gy(v)} stroke="var(--line)" />
          <text x={G.x0 - 6} y={gy(v) + 4} fontSize={10} fill="var(--muted)" textAnchor="end">{v}</text>
        </g>
      ))}
      {Array.from({ length: tMax + 1 }, (_, t) => (
        <text key={t} x={gx(t)} y={G.y1 + 15} fontSize={10} fill="var(--muted)" textAnchor="middle">{t}</text>
      ))}
      <line x1={G.x0} x2={G.x1} y1={G.y1} y2={G.y1} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={G.x0} x2={G.x0} y1={G.y0 - 8} y2={G.y1} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={G.x0 + 6} y={G.y0 - 4} fontSize={11} fontWeight={700} fill="var(--ink)">{yAd}</text>
      <text x={G.x1} y={G.y1 + 30} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">t (s)</text>
    </g>
  );
}
const gX = (t: number, tMax: number) => G.x0 + (t / tMax) * (G.x1 - G.x0);
const gY = (v: number, yMax: number) => G.y1 - (v / yMax) * (G.y1 - G.y0);
const RENK = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c5)", "var(--c4)"];

// 4. Konum-zaman grafiği: hız = eğim.
function KonumZaman({ tamam }: AdimProps) {
  const [v, setV] = useState(4);
  const [kosular, setKosular] = useState<number[]>([]);
  const o = useOynat(5, () => setKosular((k) => (k.includes(v) ? k : [...k, v])));
  const t = o.t;
  const farkli = kosular.length >= 2;
  const renkOf = (h: number) => RENK[Math.max(0, kosular.indexOf(h)) % RENK.length];
  const simdiki = o.run ? (kosular.includes(v) ? renkOf(v) : RENK[kosular.length % RENK.length]) : "var(--c1)";
  return (
    <>
      <div className="ad-sahne">
        <svg viewBox="0 0 340 300" role="img" aria-label="Araba ve konum-zaman grafiği">
          <Yol y={22} etiket={false} />
          <Araba x={X(v * t)} y={35} renk={simdiki} />
          <Eksen tMax={5} yMax={50} yAd="x (m)" yAdim={10} />
          {kosular.map((h) => (
            <g key={h} opacity={o.run ? 0.35 : 1}>
              <line x1={gX(0, 5)} y1={gY(0, 50)} x2={gX(5, 5)} y2={gY(5 * h, 50)} stroke={renkOf(h)} strokeWidth={2.5} strokeLinecap="round" />
              <text x={gX(5, 5) + 2} y={gY(5 * h, 50) + (h === 10 ? 12 : -5)} fontSize={11} fontWeight={700} fill={renkOf(h)} textAnchor="end">{h} m/s</text>
            </g>
          ))}
          {o.run && (
            <g>
              <line x1={gX(0, 5)} y1={gY(0, 50)} x2={gX(t, 5)} y2={gY(v * t, 50)} stroke={simdiki} strokeWidth={3} strokeLinecap="round" />
              <circle cx={gX(t, 5)} cy={gY(v * t, 50)} r={5} fill={simdiki} />
            </g>
          )}
        </svg>
      </div>
      <p className="ad-ipucu">Araba sabit hızla giderken grafiğe her an konumunu çiziyor. <b>İki farklı hız</b> dene.</p>
      <Surgu ad="Hız" deger={v} min={2} max={10} birim="m/s" set={setV} kapali={o.run} />
      <Oynat run={o.run} onClick={o.basla} />
      {farkli && (
        <Soru
          soru="Daha hızlı arabanın çizgisi nasıl?"
          secenekler={[
            { yazi: "Daha dik", dogru: true, neden: "Hızlı araba her saniye daha çok yol alır, çizgi daha hızlı yükselir. Konum-zaman grafiğinin eğimi hızdır." },
            { yazi: "Daha yatık", neden: "Grafiklerine bak: hangi çizgi 5. saniyede daha yukarıda?" },
            { yazi: "İkisi aynı eğimde", neden: "İki çizgi aynı yerde bitmiyor. Hangisi daha yukarıda bitiyor?" },
          ]}
          tamam={tamam}
        />
      )}
    </>
  );
}

// 5. İvme: kareler açılıyor, hız düzgün artıyor.
function Ivme({ tamam }: AdimProps) {
  const [a, setA] = useState(2);
  const [oynandi, setOynandi] = useState(false);
  const o = useOynat(5, () => setOynandi(true));
  const t = o.run || oynandi ? o.t : 0;
  const x = (s: number) => 0.5 * a * s * s;
  const kareler = [0, 1, 2, 3, 4, 5].filter((s) => s < t - 0.05);
  const serit = (aralik: number[]) => (
    <svg viewBox="0 0 200 20" className="ad-serit" aria-hidden="true">
      <line x1={6} x2={194} y1={10} y2={10} stroke="var(--line-2)" strokeWidth={2} />
      {aralik.map((p, k) => <circle key={k} cx={6 + p} cy={10} r={4.5} fill="var(--ink)" />)}
    </svg>
  );
  return (
    <>
      <div className="ad-sahne">
        <svg viewBox="0 -18 340 318" role="img" aria-label="Hızlanan araba ve hız-zaman grafiği">
          <Yol y={22} etiket={false} />
          {kareler.map((s) => <Araba key={s} x={X(x(s))} y={35} soluk olcek={0.75} />)}
          {kareler.map((s) => <circle key={`d${s}`} cx={X(x(s))} cy={22 + ROAD_H + 7} r={3} fill="var(--c1)" />)}
          <Araba x={X(x(t))} y={35} olcek={0.75} />
          <Balon x={X(x(t))} y={14} yazi={`v = ${(a * t).toFixed(0)} m/s`} />
          <Eksen tMax={5} yMax={20} yAd="v (m/s)" yAdim={5} />
          {(o.run || oynandi) && (
            <g>
              <line x1={gX(0, 5)} y1={gY(0, 20)} x2={gX(t, 5)} y2={gY(a * t, 20)} stroke="var(--c1)" strokeWidth={3} strokeLinecap="round" />
              <circle cx={gX(t, 5)} cy={gY(a * t, 20)} r={5} fill="var(--c1)" />
            </g>
          )}
        </svg>
      </div>
      <p className="ad-ipucu">Araba durgun başlıyor ve hızı her saniye <b>{a} m/s</b> artıyor. Buna <b>ivme</b> denir: a = {a} m/s².</p>
      <Surgu ad="İvme" deger={a} min={1} max={4} birim="m/s²" set={(v) => { setA(v); setOynandi(false); }} kapali={o.run} />
      <Oynat run={o.run} onClick={o.basla} />
      {oynandi && (
        <Soru
          soru="Her saniye çekilen kareler bu şeritlerden hangisi gibi görünür?"
          secenekler={[
            { yazi: serit([0, 47, 94, 141, 188]), neden: "Eşit aralıklar sabit hız demek. Hızlanan arabanın her saniye aldığı yol artar." },
            { yazi: serit([0, 12, 47, 106, 188]), dogru: true, neden: "Hız arttıkça her saniyede alınan yol da artar, kareler giderek açılır. Hız-zaman grafiği de düz bir çizgiyle yükselir." },
            { yazi: serit([0, 82, 141, 176, 188]), neden: "Aralıklar küçülüyorsa araba yavaşlıyordur. Yukarıdaki kareler nasıl açıldı?" },
          ]}
          tamam={tamam}
        />
      )}
    </>
  );
}

// 6. Grafikten hareketi oku.
function GrafikOku({ tamam }: AdimProps) {
  const o = useOynat(6);
  const t = o.t;
  const xt = (s: number) => (s <= 2 ? 15 * s : s <= 4 ? 30 : 30 - 10 * (s - 4));
  const nokta = [[0, 0], [2, 30], [4, 30], [6, 10]] as const;
  const d = nokta.map(([s, m], k) => `${k ? "L" : "M"}${gX(s, 6)} ${gY(m, 40)}`).join(" ");
  const geri = t > 4 && t < 6;
  return (
    <>
      <div className="ad-sahne">
        <svg viewBox="0 0 340 300" role="img" aria-label="Üç parçalı konum-zaman grafiği">
          <Yol y={22} etiket={false} />
          <Araba x={X(xt(t))} y={35} ters={geri} />
          <rect x={gX(2, 6)} y={G.y0} width={gX(4, 6) - gX(2, 6)} height={G.y1 - G.y0} fill="var(--glow-soft)" />
          <Eksen tMax={6} yMax={40} yAd="x (m)" yAdim={10} />
          <path d={d} fill="none" stroke="var(--c1)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          {(o.run || t > 0) && (
            <g>
              <line x1={gX(t, 6)} x2={gX(t, 6)} y1={G.y0} y2={G.y1} stroke="var(--ink)" strokeDasharray="3 3" />
              <circle cx={gX(t, 6)} cy={gY(xt(t), 40)} r={5.5} fill="var(--ink)" />
            </g>
          )}
        </svg>
      </div>
      <p className="ad-ipucu">Grafiği oynat ve arabayı izle. Sarı bölgede neler oluyor?</p>
      <Oynat run={o.run} onClick={o.basla} yazi={t > 0 ? "Tekrar oynat" : "Oynat"} />
      <Soru
        soru="Grafiğin yatay olduğu 2-4. saniyelerde araba ne yapıyor?"
        secenekler={[
          { yazi: "Duruyor", dogru: true, neden: "Konum değişmiyor, x hep 30 m. Yatay çizginin eğimi sıfırdır, yani hız sıfır. Son kısımda çizgi iniyor: araba geri dönüyor." },
          { yazi: "Sabit hızla gidiyor", neden: "Sabit hızla giden arabanın konumu her saniye değişir, çizgi eğik olur. Burada x değişiyor mu?" },
          { yazi: "Hızlanıyor", neden: "Hızlanan arabanın konum grafiği giderek dikleşen bir eğridir. Oynatıp arabaya bak." },
        ]}
        tamam={tamam}
      />
    </>
  );
}

/* ---------- ders ---------- */

const ADIMLAR: { baslik: string; metin: string; C: (p: AdimProps) => React.ReactNode }[] = [
  { baslik: "Konum", metin: "Konum, seçtiğin başlangıç noktasına göre nerede olduğundur. Arabayı sürükle ve sarı bayrağa götür.", C: Konum },
  { baslik: "Yer değiştirme ve yol", metin: "Bir yolculuğu iki şekilde ölçebilirsin: nereden nereye vardığın ve toplam ne kadar gittiğin.", C: YerDegistirme },
  { baslik: "Hız", metin: "Kamera her saniye bir kare çekiyor. B'nin hızını ayarla, A ile yan yana gitsinler.", C: Hiz },
  { baslik: "Konum-zaman grafiği", metin: "Hareketi bir grafiğe dökersen hız gözle görünür hâle gelir.", C: KonumZaman },
  { baslik: "İvme", metin: "Gaza basan arabanın hızı her saniye artar. Bu artışın ne kadar hızlı olduğu ivmedir.", C: Ivme },
  { baslik: "Grafikten hareketi oku", metin: "Artık tersini yap: grafiğe bakıp arabanın ne yaptığını söyle.", C: GrafikOku },
];

export default function AdimliDers() {
  const [i, setI] = useState(0);
  const [biten, setBiten] = useState<boolean[]>(() => ADIMLAR.map(() => false));
  const n = ADIMLAR.length, son = i === n;
  const tamam = useCallback(() => setBiten((b) => (b[i] ? b : b.map((x, k) => (k === i ? true : x)))), [i]);
  useEffect(() => { window.scrollTo(0, 0); }, [i]);
  const Close = Icon.kapat, Back = Icon.back;
  const A = ADIMLAR[i];
  return (
    <div className="app" data-ders="fizik">
      <header className="top lesson-top">
        <Link className="back" href={KONU} aria-label="Dersten çık"><Close /></Link>
        <div className="ttl">
          <span>Bir boyutta hareket</span>
          <span className="ad-adimlar" aria-hidden="true">
            {ADIMLAR.map((_, k) => <i key={k} className={k < i || (k === i && biten[k]) || son ? "on" : k === i ? "simdi" : ""} />)}
          </span>
        </div>
      </header>
      <main className="view lesson">
        {!son ? (
          <article className="card ad-kart" key={i}>
            <div className="step">Örnek ders · {i + 1} / {n}</div>
            <div className="ctext"><h2>{A.baslik}</h2><p>{A.metin}</p></div>
            <A.C tamam={tamam} />
          </article>
        ) : (
          <article className="card ad-kart">
            <div className="step">Örnek ders bitti</div>
            <div className="ctext"><h2>Hareketi artık görüyorsun</h2></div>
            <ul className="ad-ozet">
              <li><b>Konum</b> başlangıca göre yerin, <b>yer değiştirme</b> Δx = x<sub>son</sub> − x<sub>ilk</sub>.</li>
              <li><b>Yol</b> gidilen toplam mesafe; geri dönersen Δx'ten büyük olur.</li>
              <li><b>Hız</b> her saniye alınan yol; konum-zaman grafiğinin eğimi.</li>
              <li><b>İvme</b> hızın her saniyedeki değişimi; kareler giderek açılır.</li>
              <li>Grafik yatay ise araba duruyor, aşağı iniyorsa geri gidiyor.</li>
            </ul>
            <div className="acts ad-acts">
              <Link className="btn main" href={KONU}>Konunun kartlarına ve testine geç</Link>
              <button className="btn" onClick={() => { setI(0); setBiten(ADIMLAR.map(() => false)); }}>Baştan başla</button>
            </div>
          </article>
        )}
        {!son && (
          <div className="controls">
            <button className="btn" disabled={i === 0} aria-label="Önceki adım" onClick={() => setI(i - 1)}><Back /></button>
            <button className="btn main" disabled={!biten[i]} onClick={() => setI(i + 1)}>
              {biten[i] ? (i === n - 1 ? "Bitir" : "Devam") : "Önce görevi yap"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
