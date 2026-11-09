import React from 'react';
import { Composition } from 'remotion';
import { ON_FRAMES, OnKasim } from './onkasim/Video';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 10 Kasım anma: "Dokuzu beş geçe" (dikey 9:16, Instagram Reels / Shorts) */}
    <Composition id="OnKasim" component={OnKasim} durationInFrames={ON_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
