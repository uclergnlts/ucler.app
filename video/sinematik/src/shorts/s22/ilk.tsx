/** S-22 (parmak çıtlatma) ilk çekimi: S-21'in son 1 saniyesinde "sonraki video" olarak görünür. */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { Word } from '../../captions';
import { INK } from '../../kit';
import { Cizgi, Kadraj, pop, useTt } from '../ortak';
import { Etiket } from '../parca';

export const S22_WORDS: Word[] = [];

export const S22_ILK: React.FC = () => {
  const t = useTt();
  const f = useCurrentFrame();
  return (
    <Kadraj zoom={[1.12, 1.0]} origin={[540, 1000]} shakeAt={[0.1]} shake={14}>
      <rect x={-500} y={-600} width={2100} height={3200} fill="#3A2F5C" />
      <circle cx={540} cy={950} r={700} fill="#C79BFF" opacity={0.25} filter="url(#s-glow)" />
      {/* kitaplık */}
      {[380, 640, 900].map((y) => (
        <g key={y}>
          <rect x={-500} y={y} width={2100} height={24} fill="#5A3A1E" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-40 + i * 84} y={y - 180 - (i % 3) * 20} width={64} height={180 + (i % 3) * 20} fill={['#FF8A4A', '#5FC8FF', '#7BD64A', '#FFD54A', '#FF8FC0'][(i + y) % 5]} stroke={INK} strokeWidth={6} opacity={0.75} />
          ))}
        </g>
      ))}
      <rect x={-500} y={-600} width={2100} height={3200} fill="#1B2033" opacity={0.35} />
      <Cizgi x={540} y={2650} s={3.0} goz="sikis" agiz="sirit" kas="kalkik" kolSag={[-30, 150]} kolSol={[-30, 150]} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 -150 V-250" stroke="#FFD54A" strokeWidth={18} strokeLinecap="round" transform={`translate(540 1560) rotate(${i * 45 + 22}) scale(${pop(t, 0.08)})`} />
      ))}
      <g transform={`translate(540 700) scale(${pop(t, 0.1)}) rotate(${-6 + Math.sin(f / 4) * 2})`}>
        <Etiket x={0} y={0} size={220} renk="#fff">
          CRACK!
        </Etiket>
      </g>
    </Kadraj>
  );
};
