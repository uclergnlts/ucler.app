/**
 * "Dokuzu beş geçe" (10 Kasım anma) — sinematik hikâye, dikey 9:16.
 * Çekimler kelime zamanlarına oturur: her çekim, çapa kelimesinden 0,15 sn önce başlar.
 */
import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Caption } from '../components/Caption';
import { fontFamily } from '../fonts';
import { ON_STARTS, ON_WORDS } from './captions';
import * as O from './shots';

export const FPS = 30;
const OFF = 0.3;
const VOICE_LEN = 101.09;
export const ON_FRAMES = Math.round((VOICE_LEN + OFF + 3.2) * FPS);

type Plan = { w: number; C: React.FC; kaynak?: string };
const PLAN: Plan[] = [
  { w: 0, C: O.A1 },
  { w: 5, C: O.A2 },
  { w: 11, C: O.B1 },
  { w: 16, C: O.C1 },
  { w: 18, C: O.C2 },
  { w: 21, C: O.D1 },
  { w: 24, C: O.D2 },
  { w: 25, C: O.E1 },
  { w: 27, C: O.E2 },
  { w: 28, C: O.F1 },
  { w: 29, C: O.F2 },
  { w: 31, C: O.F3, kaynak: 'Dolmabahçe Sarayı, İstanbul (çizim)' },
  { w: 33, C: O.G1 },
  { w: 38, C: O.G2 },
  { w: 41, C: O.G3 },
  { w: 44, C: O.H1, kaynak: 'Dolmabahçe Sarayı, 71 numaralı oda' },
  { w: 48, C: O.H2 },
  { w: 53, C: O.I1 },
  { w: 57, C: O.I2 },
  { w: 60, C: O.J1 },
  { w: 68, C: O.K1 },
  { w: 71, C: O.K2 },
  { w: 73, C: O.L1, kaynak: '1927 Genel Nüfus Sayımı: okuryazar oranı %10,6' },
  { w: 76, C: O.L2, kaynak: '1927 Genel Nüfus Sayımı' },
  { w: 84, C: O.M1, kaynak: 'Harf Devrimi, 1 Kasım 1928' },
  { w: 90, C: O.M2, kaynak: 'Millet Mektepleri, 1929' },
  { w: 95, C: O.N1, kaynak: 'Başöğretmen unvanı, 24 Kasım 1928' },
  { w: 99, C: O.O1 },
  { w: 103, C: O.O2, kaynak: 'Kadınlara milletvekili seçme ve seçilme hakkı, 5 Aralık 1934' },
  { w: 109, C: O.P1 },
  { w: 116, C: O.P2, kaynak: 'Samsun, 22 Eylül 1924' },
  { w: 121, C: O.Q1 },
  { w: 124, C: O.Q2 },
  { w: 130, C: O.R1 },
  { w: 132, C: O.R2 },
  { w: 136, C: O.R3 },
  { w: 141, C: O.S1 },
  { w: 143, C: O.S2 },
  { w: 150, C: O.T1 },
  { w: 156, C: O.T2 },
  { w: 159, C: O.U1 },
  { w: 164, C: O.U2 },
  { w: 168, C: O.U3 },
];

/** [ses, kelime, kayma sn, ses düzeyi] */
type Cue = [string, number, number, number];
const CUES: Cue[] = [
  ['tick', 0, 0, 0.5],
  ['tick', 0, 1, 0.5],
  ['impact', 5, -0.05, 0.45],
  ['rewind', 11, -0.6, 0.55],
  ['alarm', 11, 0.1, 0.3],
  ['whoosh', 16, -0.1, 0.4],
  ['whoosh', 18, 0, 0.35],
  ['tick', 24, 0.3, 0.6],
  ['whoosh', 28, -0.2, 0.3],
  ['pop', 29, 0, 0.35],
  ['tick', 44, 0, 0.45],
  ['tick', 44, 0.6, 0.35],
  ['tick', 44, 1.2, 0.25],
  ['pop', 76, 1.6, 0.4],
  ['pop', 84, 0.2, 0.3],
  ['pop', 84, 0.6, 0.3],
  ['pop', 84, 1.0, 0.3],
  ['click', 103, 0.9, 0.6],
  ['riser', 116, -1.2, 0.25],
  ['ding', 116, 1.0, 0.35],
  ['birds', 141, 0.2, 0.5],
  ['ding', 168, 1.2, 0.35],
];

/** [ses, başlangıç kelimesi (0 = video başı), bitiş kelimesi (null = son), düzey] */
const BEDS: [string, number, number | null, number][] = [
  ['music-dark', 0, 25, 0.12],
  ['wind', 25, 141, 0.35],
  ['pad-yas', 25, 141, 0.55],
  ['music-hope', 141, null, 0.22],
];

const sec = (w: number) => ON_STARTS[w] + OFF;
const fr = (s: number) => Math.round(s * FPS);
const SHOTS = PLAN.map((p, i) => {
  const from = i === 0 ? 0 : fr(sec(p.w) - 0.15);
  const to = i === PLAN.length - 1 ? ON_FRAMES : fr(sec(PLAN[i + 1].w) - 0.15);
  return { ...p, from, dur: to - from, start: from / FPS - OFF };
});

const Bed: React.FC<{ src: string; dur: number; vol: number; fade?: number }> = ({ src, dur, vol, fade = 12 }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [0, fade, dur - fade, dur], [0, vol, vol, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} loop />;
};

/** Siren: 15. sn'de başlar, anlatım sürerken kısılır, 84. sn'de susar. */
const SIREN_FROM = fr(sec(25) - 0.1);
const SIREN_TO = fr(sec(142) + 0.2);
const Siren: React.FC = () => {
  const f = useCurrentFrame();
  const abs = f + SIREN_FROM;
  // anlatım varken kıs, satır aralarında aç
  const talking = ON_WORDS.some((w) => abs / FPS - OFF >= w.s - 0.1 && abs / FPS - OFF <= w.e + 0.15);
  const base = interpolate(f, [0, 45, SIREN_TO - SIREN_FROM - 50, SIREN_TO - SIREN_FROM], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile('sfx/siren.mp3')} volume={base * (talking ? 0.16 : 0.42)} />;
};

const Kaynak: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 48, top: 92, maxWidth: 680, opacity: interpolate(f, [4, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontFamily, fontWeight: 700, fontSize: 24, lineHeight: 1.25, color: 'rgba(255,255,255,0.9)', background: 'rgba(10,14,24,0.55)', padding: '8px 14px', borderRadius: 10 }}>
      {text}
    </div>
  );
};

export const OnKasim: React.FC = () => (
  <AbsoluteFill style={{ background: '#0F1A2E' }}>
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.dur} name={`çekim ${i + 1}`}>
        <O.ShotStart.Provider value={s.start}>
          <s.C />
        </O.ShotStart.Provider>
        {s.kaynak && <Kaynak text={s.kaynak} />}
      </Sequence>
    ))}
    {/* sağ üstte küçük marka */}
    <div style={{ position: 'absolute', right: 48, top: 96, fontFamily, fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
      ucler<span style={{ color: '#d63c63' }}>.</span>app
    </div>
    {/* altyazı */}
    <Sequence from={fr(OFF)}>
      <div style={{ position: 'absolute', left: 70, right: 70, bottom: 250, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <Caption words={ON_WORDS} color="#fff" accent="#FFD54A" size={56} style={{ transformOrigin: 'center', textShadow: '0 3px 0 #0E1117, 0 0 18px rgba(0,0,0,0.85)' }} />
      </div>
    </Sequence>
    <Sequence from={fr(OFF)}>
      <Audio src={staticFile('onkasim/ses.mp3')} />
    </Sequence>
    <Sequence from={SIREN_FROM} durationInFrames={SIREN_TO - SIREN_FROM}>
      <Siren />
    </Sequence>
    {CUES.map(([src, w, d, vol], i) => (
      <Sequence key={`c${i}`} from={Math.max(0, fr(sec(w) + d))} durationInFrames={FPS * 4}>
        <Audio src={staticFile(`sfx/${src}.mp3`)} volume={vol} />
      </Sequence>
    ))}
    {BEDS.map(([src, a, b, vol], i) => {
      const from = a === 0 ? 0 : fr(sec(a) - 0.15);
      const to = b === null ? ON_FRAMES : fr(sec(b) - 0.15);
      return (
        <Sequence key={`b${i}`} from={from} durationInFrames={to - from}>
          <Bed src={src} dur={to - from} vol={vol} fade={30} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
