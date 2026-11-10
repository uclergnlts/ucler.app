import React from 'react';
import { Composition } from 'remotion';
import { ONKASIM_FRAMES, OnKasim } from './onkasim/Video';
import { S01, S01_FRAMES } from './shorts/s01/Video';
import { S02, S02_FRAMES } from './shorts/s02/Video';
import { S03, S03_FRAMES } from './shorts/s03/Video';
import { S04, S04_FRAMES } from './shorts/s04/Video';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 10 Kasım anma videosu (OZEL-10KASIM) */}
    <Composition id="OnKasim" component={OnKasim} durationInFrames={ONKASIM_FRAMES} fps={30} width={1080} height={1920} />
    {/* İngilizce YouTube Shorts (12-25 sn) */}
    <Composition id="S01" component={S01} durationInFrames={S01_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S02" component={S02} durationInFrames={S02_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S03" component={S03} durationInFrames={S03_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S04" component={S04} durationInFrames={S04_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
