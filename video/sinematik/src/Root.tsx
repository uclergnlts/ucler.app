import React from 'react';
import { Composition } from 'remotion';
import { ONKASIM_FRAMES, OnKasim } from './onkasim/Video';
import { S01, S01_FRAMES, S01TR, S01TR_FRAMES } from './shorts/s01/Video';
import { S02, S02_FRAMES, S02TR, S02TR_FRAMES } from './shorts/s02/Video';
import { S03, S03_FRAMES, S03TR, S03TR_FRAMES } from './shorts/s03/Video';
import { S04, S04_FRAMES, S04TR, S04TR_FRAMES } from './shorts/s04/Video';
import { S05, S05_FRAMES, S05TR, S05TR_FRAMES } from './shorts/s05/Video';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 10 Kasım anma videosu (OZEL-10KASIM) */}
    <Composition id="OnKasim" component={OnKasim} durationInFrames={ONKASIM_FRAMES} fps={30} width={1080} height={1920} />
    {/* İngilizce YouTube Shorts (12-25 sn) */}
    <Composition id="S01" component={S01} durationInFrames={S01_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S01TR" component={S01TR} durationInFrames={S01TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S02" component={S02} durationInFrames={S02_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S02TR" component={S02TR} durationInFrames={S02TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S03" component={S03} durationInFrames={S03_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S03TR" component={S03TR} durationInFrames={S03TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S04" component={S04} durationInFrames={S04_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S04TR" component={S04TR} durationInFrames={S04TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S05" component={S05} durationInFrames={S05_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S05TR" component={S05TR} durationInFrames={S05TR_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
