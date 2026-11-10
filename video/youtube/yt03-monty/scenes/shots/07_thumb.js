// shots/07_thumb.js — thumbnail plates (not in the edit): TH1 big shocked face + doors (goat in 3, car glow in 2)
import { E, registerShot, layer, glow, alpha } from '/engine/core.js';
import { bigFace, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { HERO } from '../cast.js';
import * as SH from '../sets/show.js';
registerShot('TH1', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: 0 }; SH.studio(g, 1, cam, { audience: false });
  layer(g, cam, 1, (g) => { const X = [E.W * 0.5, E.W * 0.68, E.W * 0.86];
    X.forEach((x, i) => SH.door(g, x, E.H * 0.9, 260, 440, { n: i + 1, t: 1, open: i === 2 ? 1 : i === 1 ? 0.25 : 0, glowC: i === 1 ? '#fff3c4' : '#fff3c4', inside: i === 2 ? (g, cx, cy) => SH.goat(g, cx - 10, cy, 1.2, { t: 1, f: -1, bleat: 0.8 }) : (g, cx, cy) => SH.car(g, cx + 40, cy - 6, 0.7, { t: 1 }) }));
    glow(g, X[1] - 100, E.H * 0.65, 260, '#fff3c4', 0.5); FX.sparkle(g, X[1] - 110, E.H * 0.5, 40, '#ffffff', 0.9); });
  bigFace(g, E.W * 0.2, E.H * 0.78, 330, { outfit: HERO, expr: 'shocked', look: [1, 0], rimColor: '#ffd7f0', rimSide: 1 });
} });
