import React from 'react';
import { Composition } from 'remotion';
import { ONKASIM_FRAMES, OnKasim } from './onkasim/Video';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 10 Kasım anma videosu (OZEL-10KASIM) */}
    <Composition id="OnKasim" component={OnKasim} durationInFrames={ONKASIM_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
