/**
 * 10 Kasım anma videosu: sinematik hikâye şablonu, dikey 9:16.
 * Her çekim, çapa kelimesinden 0,15 sn önce başlar. Ses 0,3 sn gecikmeyle girer.
 */
import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Caption } from '../components/Caption';
import { fontFamily } from '../fonts';
import { WORDS, wt } from './captions';
import * as O from './shots';

const FPS = 30;
const OFF = 0.3;
const VOICE_LEN = 101.09;
const KART = 2.6; // sessiz kapanış kartı
export const ONKASIM_FRAMES = Math.round((VOICE_LEN + OFF + KART) * FPS);

type Plan = { w: string; C: React.FC; kaynak?: string };
const PLAN: Plan[] = [
  { w: 'Saat', C: O.O01 },
  { w: 'Ve', C: O.O02 },
  { w: 'Bu', C: O.O03 },
  { w: 'Otobüs', C: O.O04 },
  { w: 'notların', C: O.O05 },
  { w: 'Koşarken', C: O.O06 },
  { w: 'Sonra', C: O.O07 },
  { w: 'Bin', C: O.O08 },
  { w: 'İstanbul,', C: O.O09 },
  { w: 'Sabah', C: O.O10 },
  { w: 'Mustafa', C: O.O11 },
  { w: 'Odasındaki', C: O.O12 },
  { w: 'gösteriyor.', C: O.O13 },
  { w: 'Haber', C: O.O14 },
  { w: 'İnsanlar', C: O.O15 },
  { w: 'Peki', C: O.O16 },
  { w: 'Elindeki', C: O.O17 },
  { w: 'Bin#2', C: O.O18, kaynak: 'Okuryazarlık, 1927 nüfus sayımı' },
  { w: 'Bir', C: O.O19 },
  { w: 'Genç', C: O.O20 },
  { w: 'Tahtanın', C: O.O21 },
  { w: 'Kız', C: O.O22 },
  { w: 'Kadınlar', C: O.O23 },
  { w: 'Ve#2', C: O.O24 },
  { w: 'Hayatta', C: O.O25 },
  { w: 'Siren', C: O.O26 },
  { w: 'Yaşlı', C: O.O27 },
  { w: 'Okuduğun', C: O.O28 },
  { w: 'Siren#2', C: O.O29 },
  { w: 'Ama', C: O.O30 },
  { w: 'Çünkü', C: O.O31 },
  { w: 'öğrenmeye', C: O.O32 },
  { w: 'Ulu', C: O.O33 },
  { w: 'aramızdan', C: O.O34 },
  { w: '@KART', C: O.O35 },
];

const sec = (w: string) => (w === '@KART' ? VOICE_LEN + 0.15 : wt(w)) + OFF;
const fr = (s: number) => Math.round(s * FPS);
const SHOTS = PLAN.map((p, i) => {
  const from = i === 0 ? 0 : fr(sec(p.w) - 0.15);
  const to = i === PLAN.length - 1 ? ONKASIM_FRAMES : fr(sec(PLAN[i + 1].w) - 0.15);
  return { ...p, from, dur: to - from, start: from / FPS - OFF };
});

/** Efektler: [ad, kelime, kaydırma sn, ses]. */
type Cue = [string, string, number, number];
const CUES: Cue[] = [
  ['tick', 'Saat', 0, 0.5],
  ['impact', 'duruyor.', -0.1, 0.35],
  ['alarm', 'Bu', 0, 0.35],
  ['whoosh', 'Otobüs', -0.1, 0.35],
  ['whoosh', 'notların', 0, 0.3],
  ['tick', 'Dokuz.', -0.2, 0.6],
  ['rewind', 'Bin', -0.1, 0.45],
  ['tick', 'Odasındaki', 0.6, 0.35],
  ['pop', 'Bin#2', 0.3, 0.3],
  ['ding', 'biri', 0, 0.35],
  ['whoosh', 'Bir', 0, 0.3],
  ['knock', 'Tahtanın', 0.3, 0.3],
  ['pop', 'Kadınlar', 0.6, 0.35],
  ['riser', 'Ve#2', 0, 0.3],
  ['ding', 'mürşit', 0, 0.3],
  ['pop', 'girmek', 0, 0.3],
  ['pop', 'Hepsi', 0, 0.3],
  ['birds', 'Ama', 0, 0.3],
];

/** Müzik: [ad, başlangıç kelimesi, bitiş kelimesi (null = son), ses]. */
const BEDS: [string, string, string | null, number][] = [
  ['music-dark', 'Saat', 'Peki', 0.12],
  ['music-dark', 'Peki', 'Siren', 0.1],
  ['music-hope', 'Siren#2', null, 0.2],
];

const Bed: React.FC<{ src: string; dur: number; vol: number }> = ({ src, dur, vol }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [0, 20, dur - 30, dur], [0, vol, vol, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} loop />;
};

const Kaynak: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 48, top: 92, maxWidth: 640, opacity: interpolate(f, [4, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontFamily, fontWeight: 700, fontSize: 24, lineHeight: 1.25, color: 'rgba(255,255,255,0.88)', background: 'rgba(10,8,20,0.55)', padding: '8px 14px', borderRadius: 10 }}>
      Kaynak: {text}
    </div>
  );
};

export const OnKasim: React.FC = () => (
  <AbsoluteFill style={{ background: '#0E1117' }}>
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.dur} name={`çekim ${i + 1}`}>
        <O.ShotStart.Provider value={s.start}>
          <s.C />
        </O.ShotStart.Provider>
        {s.kaynak && <Kaynak text={s.kaynak} />}
      </Sequence>
    ))}
    <div style={{ position: 'absolute', right: 48, top: 96, fontFamily, fontWeight: 800, fontSize: 30, color: 'rgba(255,255,255,0.88)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
      ucler<span style={{ color: '#2F7CF6' }}>.</span>app
    </div>
    <Sequence from={fr(OFF)} durationInFrames={fr(VOICE_LEN + 0.1)}>
      <div style={{ position: 'absolute', left: 70, right: 70, bottom: 250, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <Caption words={WORDS} color="#fff" accent="#FFD54A" size={56} style={{ transformOrigin: 'center', textShadow: '0 3px 0 #0E1117, 0 0 18px rgba(0,0,0,0.85)' }} />
      </div>
    </Sequence>
    <Sequence from={fr(OFF)}>
      <Audio src={staticFile('onkasim/ses.mp3')} />
      <Audio src={staticFile('onkasim/siren.mp3')} volume={0.9} />
    </Sequence>
    {CUES.map(([src, w, d, vol], i) => (
      <Sequence key={`c${i}`} from={Math.max(0, fr(sec(w) + d))} durationInFrames={FPS * 4}>
        <Audio src={staticFile(`sfx/${src}.mp3`)} volume={vol} />
      </Sequence>
    ))}
    {BEDS.map(([src, a, b, vol], i) => {
      const from = fr(a === 'Saat' ? 0 : sec(a) - 0.15);
      const to = b === null ? ONKASIM_FRAMES : fr(sec(b) - 0.15);
      return (
        <Sequence key={`b${i}`} from={from} durationInFrames={to - from}>
          <Bed src={src} dur={to - from} vol={vol} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
