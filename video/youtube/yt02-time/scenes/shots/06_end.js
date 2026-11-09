// shots/06_end.js — time is not the same for everyone; wink; end card.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { lake } from '../sets/lake.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { logo, qmark } from '../props.js';
import { satellite, GOLD, CYAN } from '../kit.js';

// e01 — night: the hero looks up, satellites drift across the stars; two clocks, two speeds
registerShot('e01', { draw(g, t) {
  const cam = { z: 1.05 + 0.03 * t, x: 0, y: lerp(0, -60, ease.inOut(t / 5)) };
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#03061a', '#0c1236', '#2a2050']); FX.stars(g, t, { count: 320, area: [-200, -300, E.W + 400, E.H * 0.8] });
    for (let i = 0; i < 3; i++) { const x = ((i * 700 + t * 90) % (E.W + 400)) - 200, y = 140 + i * 90; satellite(g, x, y, 0.16, { rot: 0.3 }); glow(g, x, y, 30, CYAN, 0.5); } });
  layer(g, cam, 0.35, (g) => FX.hills(g, { y: E.H * 0.78, amp: 120, color: '#14112a', seed: 6, freq: 0.0025 }));
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#1c1830'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H);
    hero(g, { x: E.W * 0.32, y: E.H * 0.88, s: 1.9, facing: 1, t, pose: P('relaxed', {}), expr: 'smile', look: [0.5, -1], rim: { color: '#9fb4ff', dir: [0.6, -0.8], w: 4 } });
  });
  const a = ease.out(prog(t, 1.0, 1.6));
  if (a > 0) { g.save(); g.globalAlpha = a * 0.9; FX.clock(g, E.W * 0.62, E.H * 0.34, 70, t * 6, {}); FX.clock(g, E.W * 0.8, E.H * 0.24, 70, t * 2, {}); g.restore(); }
} });

// e02 — giant face, wink to camera
registerShot('e02', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e26', '#1a1640']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 160 });
  const r = V(300, 330) * (1 + 0.03 * t), cx = E.W / 2, cy = E.H * 0.6, wink = t > 0.9 && t < 1.8;
  bigFace(g, cx, cy, r, { outfit: HERO, expr: 'smirk', rimColor: '#9fd0ff', rimSide: 1 });
  if (wink) { circle(g, cx + r * 0.34, cy - r * 0.16, r * 0.17, '#0c0b18'); seg(g, [[cx + r * 0.2, cy - r * 0.14], [cx + r * 0.48, cy - r * 0.14]], r * 0.08, '#fff7ea'); FX.sparkle(g, cx + r * 0.7, cy - r * 0.5, 40, '#ffffff', 0.9); }
} });

// e03 — end card: logo, hero waving, end-screen slots
registerShot('e03', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0c1230', '#1c1a44', '#2a1e48']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W * 0.22, E.H * 0.9, 600, '#ffb070', 0.18); glow(g, E.W * 0.7, E.H * 0.2, 700, '#5fc0ff', 0.12); FX.stars(g, t, { count: 160 });
  const a = ease.out(prog(t, 0.2, 0.9)); logo(g, E.W / 2, V(170, 260), V(110, 120), a);
  const pose = posesAt(t, [[0, POSES.relaxed], [0.6, POSES.wave]]); if (t > 0.6) pose.hF = [pose.hF[0] + Math.sin(t * 9) * 10, pose.hF[1]];
  const k = ease.out(prog(t, 0.3, 1.0));
  hero(g, { x: V(380, 540), y: E.H - V(130, 300) + (1 - k) * 60, s: 1.9, facing: 1, t, pose, expr: 'happy', alpha: k, rim: { color: '#ffc68a', dir: [-0.6, -0.8], w: 5 } });
  for (const [x, y] of [[V(760, 140), 400], [V(1290, 140), 400]]) { const kk = ease.out(prog(t, 0.6, 1.2)); rr(g, x, y, 480, 270, 18); g.strokeStyle = alpha('#cfe0ff', 0.35 * kk); g.lineWidth = 4; g.stroke(); g.fillStyle = alpha('#ffffff', 0.04 * kk); g.fill(); }
  const q = ease.outBack(prog(t, 1.2, 1.6)); if (q > 0) { g.save(); g.translate(V(1530, 540), V(830, 1500)); g.scale(q, q); qmark(g, 0, 0, 120); g.restore(); }
} });
