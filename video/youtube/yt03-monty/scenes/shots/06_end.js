// shots/06_end.js — lines 33-35: the real lesson (the brain clings to its first pick), changing your mind is just math, which door do you pick?
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, ambient } from '../kit.js';
import { qmark, logo } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC } = SH;
const dusk = (g, t) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a1a4a', '#5a3a6a', '#f2a07a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 60 }); FX.moon(g, E.W * 0.82, E.H * 0.16, 40); FX.hills(g, { y: E.H * 0.66, color: '#3a2a4a', amp: 60 }); };
// three roads fanning out from the bottom centre, each with a coloured arrow sign
function fork(g, t, pick = -1) { const bx = E.W / 2, by = E.H * 1.02;
  [[-1, DOORC[0]], [0, DOORC[1]], [1, DOORC[2]]].forEach(([d, c], i) => { const tx = E.W / 2 + d * E.W * 0.36, ty = E.H * 0.66; poly(g, [[bx - 220 + d * 150, by], [bx + 220 + d * 150, by], [tx + 40, ty], [tx - 40, ty]], i === pick ? '#7a6a8a' : '#4a3a5a');
    const sx = E.W / 2 + d * E.W * 0.22, sy = E.H * 0.76; seg(g, [[sx, sy], [sx, sy - 180]], 10, '#3a2a30'); const a = d === 0 ? -Math.PI / 2 : d < 0 ? -2.4 : -0.74; g.save(); g.translate(sx, sy - 180); rr(g, -60, -40, 120, 70, 10); g.fillStyle = c; g.fill(); text(g, String(i + 1), 0, 20, { size: 54, font: 'Nunito', weight: 900, align: 'center', color: '#ffffff' }); g.restore(); if (i === pick) glow(g, sx, sy - 180, 120, c, 0.4); }); }

// z01 — the hero walks out of the studio onto a road that forks three ways; his first pick (road 1) clings like a magnet
registerShot('z01', { draw(g, t) {
  const cam = { z: 1.0 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => dusk(g, t));
  layer(g, cam, 1, (g) => { fork(g, t, 0);
    const k = ease.inOut(prog(t, 0, 2.2)); const h = hero(g, { x: lerp(E.W * 0.5, E.W * 0.42, k), y: E.H * 0.98, s: 2.1, facing: -1, t, pose: k < 1 ? walkPose(t * 2) : POSES.think, expr: 'thinking', look: [-1, -0.2] });
    // a rubber band from his hand to sign 1: the brain holding on
    const sx = E.W / 2 - E.W * 0.22, sy = E.H * 0.76 - 180; g.strokeStyle = alpha(DOORC[0], 0.8); g.lineWidth = 6; g.beginPath(); g.moveTo(h.hand[0], h.hand[1]); g.quadraticCurveTo((h.hand[0] + sx) / 2, (h.hand[1] + sy) / 2 + 60 + 20 * Math.sin(t * 4), sx, sy + 30); g.stroke();
  });
} });

// z02 — he lets go, turns and takes road 2; a goat trots after him
registerShot('z02', { draw(g, t) {
  const cam = { z: 1.04, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => dusk(g, t));
  layer(g, cam, 1, (g) => { fork(g, t, t > 0.7 ? 1 : 0);
    const k = ease.inOut(prog(t, 0.8, 3.0)), x = lerp(E.W * 0.42, E.W * 0.5, k), y = lerp(E.H * 0.98, E.H * 0.8, k), s = lerp(2.1, 1.3, k);
    if (t < 0.7) { const sx = E.W / 2 - E.W * 0.22, sy = E.H * 0.76 - 150, sn = prog(t, 0.3, 0.7); seg(g, [[x + 40, y - 300], [lerp(x + 40, sx, 1 - sn), lerp(y - 300, sy, 1 - sn)]], 6, alpha(DOORC[0], 0.8 * (1 - sn))); }
    SH.goat(g, x - 260 * s / 2.1 + 20 * Math.sin(t * 6), y + 10, 0.9 * s / 2.1 * 1.6, { t: t * 2, f: 1 });
    hero(g, { x, y, s, facing: 1, t, pose: t < 0.8 ? POSES.relaxed : walkPose(t * 2.4), expr: 'smile', look: [0.3, -0.3] });
  });
  const a = ease.outBack(prog(t, 1.2, 1.6)); if (a > 0) lbl(g, '2/3', E.W * 0.5, E.H * 0.3, 1, 120 * a, GOLD, 'center');
} });

// z03 — back to the first frame: three doors and a "?"; the hero turns to the viewer
registerShot('z03', { draw(g, t) {
  const cam = { z: 1.12 - 0.05 * t, x: 0, y: 0 };
  SH.studio(g, t, cam, { audience: true });
  layer(g, cam, 1, (g) => { [0.32, 0.5, 0.68].forEach((fx, i) => SH.door(g, E.W * fx, SH.SGY() - 40, 230, 380, { n: i + 1, t, glowC: '#fff3c4' }));
    hero(g, { x: E.W * 0.14, y: SH.SGY(), s: 1.9, facing: 1, t, pose: posesAt(t, [[0, POSES.relaxed], [0.8, POSES.explain]]), expr: 'smirk', look: [-0.2, 0] });
    const q = ease.outBack(prog(t, 0.6, 1.0)); if (q > 0) qmark(g, E.W * 0.5, E.H * 0.22, 200 * q, 1, GOLD); });
} });

// z04 — end card: logo, hero waving next to a goat, two end-screen slots
registerShot('z04', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#2a1446', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W * 0.22, E.H * 0.9, 600, '#ffb070', 0.18); glow(g, E.W * 0.7, E.H * 0.2, 700, '#e5466f', 0.12); FX.stars(g, t, { count: 120 });
  const a = ease.out(prog(t, 0.2, 0.9)); logo(g, E.W / 2, V(170, 260), V(110, 120), a);
  const pose = posesAt(t, [[0, POSES.relaxed], [0.6, POSES.wave]]); if (t > 0.6) pose.hF = [pose.hF[0] + Math.sin(t * 9) * 10, pose.hF[1]];
  const k = ease.out(prog(t, 0.3, 1.0));
  hero(g, { x: V(380, 540), y: E.H - V(130, 300) + (1 - k) * 60, s: 1.9, facing: 1, t, pose, expr: 'happy', alpha: k, rim: { color: '#ffc68a', dir: [-0.6, -0.8], w: 5 } });
  if (k > 0.5) SH.goat(g, V(160, 300), E.H - V(130, 300), 1.0, { t, f: 1, bleat: t > 2 && t < 2.6 ? 0.8 : 0 });
  for (const [x, y] of [[V(760, 140), 400], [V(1290, 140), 400]]) { const kk = ease.out(prog(t, 0.6, 1.2)); rr(g, x, y, 480, 270, 18); g.strokeStyle = alpha('#ffd7f0', 0.35 * kk); g.lineWidth = 4; g.stroke(); g.fillStyle = alpha('#ffffff', 0.04 * kk); g.fill(); }
} });
