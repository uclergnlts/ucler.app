// shots/04_gravity.js — gravity bends time too: clocks near a planet run slow; beach vs mountain; feet vs head.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { hero, P } from '../hero.js';
import { lbl, atomic, earth, space, GOLD, PINK, CYAN } from '../kit.js';

// perspective grid with a gravity well of depth k at the centre
function well(g, t, k, o = {}) {
  const cx = E.W / 2, cy = o.cy ?? E.H * 0.42, sc = o.sc ?? 100, depth = 420 * k;
  const P2 = (X, Z) => { const r2 = X * X + Z * Z, d = depth / (1 + r2 / 2.2); return [cx + X * sc, cy + Z * sc * 0.42 + d]; };
  g.lineWidth = 2;
  for (let Z = -6; Z <= 6; Z += 1) { g.strokeStyle = alpha(CYAN, 0.18 + 0.12 * (Z + 6) / 12); g.beginPath(); for (let X = -11; X <= 11.01; X += 0.25) { const [x, y] = P2(X, Z); X > -11 ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  for (let X = -11; X <= 11; X += 1) { g.strokeStyle = alpha(CYAN, 0.22); g.beginPath(); for (let Z = -6; Z <= 6.01; Z += 0.25) { const [x, y] = P2(X, Z); Z > -6 ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  return P2;
}
const planetAt = (g, t, x, y, r) => earth(g, x, y, r, t, { spin: 0.05 });

// g01 — the grid sinks under a planet: gravity bends space and time
registerShot('g01', { draw(g, t) {
  space(g, t, { count: 180 });
  const k = ease.inOut(prog(t, 0.4, 2.6)); const P2 = well(g, t, k);
  const [px, py] = P2(0, 0); planetAt(g, t, px, py - 120 + 0, lerp(40, 120, ease.outBack(prog(t, 0, 0.8))));
} });

// g02 — a clock deep in the well ticks slow, a clock far away ticks fast
registerShot('g02', { draw(g, t) {
  space(g, t, { count: 180 }); const P2 = well(g, t, 1);
  const [px, py] = P2(0, 0); planetAt(g, t, px, py - 120, 120);
  const [ax, ay] = P2(-2.2, 0.6), [bx, by] = P2(8, -2);
  FX.clock(g, ax, ay - 70, 56, t * 1.2, {}); FX.clock(g, bx, by - 70, 56, t * 5, {});
  const a = ease.out(prog(t, 0.8, 1.2)); lbl(g, '↓', ax - 90, ay - 70, a, V(80, 80), CYAN, 'center'); lbl(g, '↑', bx + 90, by - 70, a, V(80, 80), GOLD, 'center');
} });

// g03 — beach clock vs mountain-top clock: the mountain clock runs a tiny bit faster
registerShot('g03', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#3a5ab0', '#8ab4e8', '#f8d8b0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  FX.sun(g, E.W * 0.15, 200, 50, '#fff6e0', '#ffd59a', 4); FX.clouds(g, { y: 120, h: 140, a: 0.25 });
  const mx = E.W * 0.7, base = E.H * 0.86, top = 330;
  // sea + beach (left), sea runs behind the mountain
  g.fillStyle = '#3a8ad0'; g.fillRect(-E.W, E.H * 0.74, E.W * 3, 300);
  for (let i = 0; i < 6; i++) seg(g, [[-200 + i * 160 + (t * 30) % 160, E.H * 0.76 + i % 2 * 30], [-120 + i * 160 + (t * 30) % 160, E.H * 0.76 + i % 2 * 30]], 4, 'rgba(255,255,255,.6)');
  // mountain (right)
  poly(g, [[mx - 620, base + 40], [mx - 140, top + 60], [mx - 40, top], [mx + 60, top + 50], [mx + 700, base + 40]], '#5a5288');
  poly(g, [[mx - 200, top + 140], [mx - 140, top + 60], [mx - 40, top], [mx + 60, top + 50], [mx + 130, top + 120], [mx + 60, top + 100], [mx - 30, top + 150], [mx - 120, top + 110]], '#f4f2fa');
  poly(g, [[mx - 40, top], [mx + 60, top + 50], [mx + 700, base + 40], [mx + 200, base + 40]], 'rgba(0,0,0,.12)');
  g.fillStyle = '#f2d8a0'; g.beginPath(); g.moveTo(-E.W, E.H * 0.84); g.quadraticCurveTo(E.W * 0.25, E.H * 0.8, E.W * 0.6, E.H * 0.88); g.lineTo(E.W * 2, E.H * 0.9); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill();
  const cb = [E.W * 0.22, E.H * 0.66], cm = [mx - 40, top - 110];
  seg(g, [[cb[0], cb[1] + 60], [cb[0], E.H * 0.86]], 8, '#3a2a3a'); seg(g, [[cm[0], cm[1] + 60], [cm[0], top]], 8, '#3a2a3a');
  FX.clock(g, cb[0], cb[1], 66, t * 2.0, {}); FX.clock(g, cm[0], cm[1], 66, t * 2.6, {});
  const a = ease.out(prog(t, 2.0, 2.5)); lbl(g, '−', cb[0] + 110, cb[1], a, V(90, 90), CYAN, 'left'); lbl(g, '+', cm[0] + 110, cm[1], a, V(90, 90), GOLD, 'left');
} });

// g04 — head clock vs feet clock: billionths of a second, measured by atomic clocks
registerShot('g04', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0c1230', '#1c1a44']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W * 0.42, E.H * 0.5, 600, '#ffb070', 0.12);
  const s = 2.9, fy = E.H * 0.94, x = E.W * 0.4;
  const h = hero(g, { x, y: fy, s, facing: 1, t, pose: POSES.relaxed, expr: t > 3.2 ? 'surprised' : 'neutral', look: [1, 0], rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 6 } });
  const a1 = ease.outBack(prog(t, 0.4, 0.8)), a2 = ease.outBack(prog(t, 0.9, 1.3));
  const head = (1 + t * 0.37).toFixed(9), feet = (1 + t * 0.37 - 0.000000001 * Math.min(1, prog(t, 2.6, 3.2))).toFixed(9);
  if (a1 > 0) { g.save(); g.translate(x + 380, h.head[1]); g.scale(a1, a1); atomic(g, 0, 0, 1.3, head, { color: GOLD, t, w: 330 }); g.restore(); seg(g, [[h.head[0] + 50, h.head[1]], [x + 220, h.head[1]]], 3, alpha(GOLD, 0.6 * a1)); }
  if (a2 > 0) { g.save(); g.translate(x + 380, fy - 90); g.scale(a2, a2); atomic(g, 0, 0, 1.3, feet, { color: CYAN, t, w: 330 }); g.restore(); seg(g, [[x + 60, fy - 40], [x + 220, fy - 90]], 3, alpha(CYAN, 0.6 * a2)); }
  const a3 = ease.out(prog(t, 3.0, 3.5)); lbl(g, '0.000000001 s', x + 380, (h.head[1] + fy - 90) / 2, a3, V(64, 60), PINK, 'center');
} });
