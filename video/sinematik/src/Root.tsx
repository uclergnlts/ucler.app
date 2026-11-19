import React from 'react';
import { Composition } from 'remotion';
import { ONKASIM_FRAMES, OnKasim } from './onkasim/Video';
import { S01, S01_FRAMES, S01TR, S01TR_FRAMES } from './shorts/s01/Video';
import { S02, S02_FRAMES, S02TR, S02TR_FRAMES } from './shorts/s02/Video';
import { S03, S03_FRAMES, S03TR, S03TR_FRAMES } from './shorts/s03/Video';
import { S04, S04_FRAMES, S04TR, S04TR_FRAMES } from './shorts/s04/Video';
import { S05, S05_FRAMES, S05TR, S05TR_FRAMES } from './shorts/s05/Video';
import { S11, S11_FRAMES } from './shorts/s11/Video';
import { S12, S12_FRAMES, S12TR, S12TR_FRAMES } from './shorts/s12/Video';
import { S13, S13_FRAMES, S13TR, S13TR_FRAMES } from './shorts/s13/Video';
import { S14, S14_FRAMES, S14TR, S14TR_FRAMES } from './shorts/s14/Video';
import { S14G, S14G_FRAMES } from './shorts/s14g/Video';
import { S15, S15_FRAMES, S15TR, S15TR_FRAMES } from './shorts/s15/Video';
import { S16, S16_FRAMES, S16TR, S16TR_FRAMES } from './shorts/s16/Video';
import { S17, S17_FRAMES, S17TR, S17TR_FRAMES } from './shorts/s17/Video';
import { S18, S18_FRAMES, S18TR, S18TR_FRAMES } from './shorts/s18/Video';
import { S19, S19_FRAMES } from './shorts/s19/Video';
import { S20, S20_FRAMES } from './shorts/s20/Video';
import { S21, S21_FRAMES } from './shorts/s21/Video';

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
    <Composition id="S11" component={S11} durationInFrames={S11_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S12" component={S12} durationInFrames={S12_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S12TR" component={S12TR} durationInFrames={S12TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S13" component={S13} durationInFrames={S13_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S13TR" component={S13TR} durationInFrames={S13TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S14" component={S14} durationInFrames={S14_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S14G" component={S14G} durationInFrames={S14G_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S14TR" component={S14TR} durationInFrames={S14TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S15" component={S15} durationInFrames={S15_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S15TR" component={S15TR} durationInFrames={S15TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S16" component={S16} durationInFrames={S16_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S16TR" component={S16TR} durationInFrames={S16TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S17" component={S17} durationInFrames={S17_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S17TR" component={S17TR} durationInFrames={S17TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S18" component={S18} durationInFrames={S18_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S18TR" component={S18TR} durationInFrames={S18TR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S19" component={S19} durationInFrames={S19_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S20" component={S20} durationInFrames={S20_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="S21" component={S21} durationInFrames={S21_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
