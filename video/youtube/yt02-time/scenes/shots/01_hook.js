// shots/01_hook.js — the phone says you're in the middle of a lake. Who's wrong: the phone, or time?
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { lake, drifts, LGY } from '../sets/lake.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { qmark } from '../props.js';
import { lbl, mapView, phone, ambient, GOLD, PINK, CYAN } from '../kit.js';

export const SHORE = { x: 560, s: 2.2 };
// hero on the snowy shore with the phone, lake behind
export function shoreScene(g, t, cam, o = {}) {
  lake(g, t, cam, { mood: 'dusk' });
  let h;
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#eef0fa'; g.beginPath(); g.moveTo(-E.W, E.H * 0.8); g.quadraticCurveTo(E.W * 0.25, E.H * 0.7, E.W * 0.55, E.H * 0.86); g.lineTo(E.W * 0.55, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill();
    g.fillStyle = 'rgba(160,170,220,.35)'; g.beginPath(); g.ellipse(E.W * 0.2, E.H * 0.98, 520, 60, 0, 0, Math.PI * 2); g.fill();
    for (const [x, s] of [[90, 1.4], [200, 1.1], [1840, 1.6]]) FX.pine(g, x, E.H * 0.82, s, '#1c1838');
    h = hero(g, { x: o.x ?? SHORE.x, y: E.H * 0.9, s: o.s ?? SHORE.s, facing: o.facing ?? 1, t, pose: o.pose || POSES.phone, expr: o.expr || 'neutral', look: o.look || [0.5, 0.6], rim: { color: '#ffc68a', dir: [0.8, -0.5], w: 5 } });
    if (o.phoneGlow !== false) { glow(g, h.hand[0] + 6, h.hand[1] - 8, 90, '#9fd0ff', 0.45); rr(g, h.hand[0] - 4, h.hand[1] - 30, 22, 38, 5); g.fillStyle = '#14141c'; g.fill(); rr(g, h.hand[0] - 1, h.hand[1] - 27, 16, 32, 3); g.fillStyle = '#9fd0ff'; g.fill(); }
  });
  drifts(g, cam); FX.snow(g, t, { count: 90, speed: 40 });
  return h;
}

// h01 — winter dusk, hero on the shore looking at the phone
registerShot('h01', { draw(g, t) {
  const k = ease.inOut(t / 3.0), cam = { z: lerp(1.15, 1.35, k), x: lerp(-260, -320, k), y: lerp(60, 110, k) };
  shoreScene(g, t, cam, { expr: t > 1.6 ? 'confused' : 'neutral', look: [0.4, 0.7] });
} });

// h02 — phone close: the blue dot slides from the shore into the middle of the lake
registerShot('h02', { draw(g, t) {
  blurLayer(g, 12, (g) => lake(g, t, { z: 1.3, x: -200, y: 40 }, { mood: 'dusk' })); veil(g, '#0a0a1e', 0.35);
  const k = ease.inOut(prog(t, 0.5, 1.6)), [sx, sy] = t > 1.6 && t < 2.0 ? shake(t, 6, 30) : [0, 0];
  const pin = [lerp(0.24, 0.56, k), lerp(0.8, 0.42, k)];
  phone(g, E.W / 2 + sx, E.H / 2 + 20 + sy, 1.9, (x, y, w, h) => mapView(g, x, y, w, h, { pin, pulse: t, zoom: 1 + 0.06 * t }), { rot: -0.05 });
  if (t > 1.7) { const q = ease.outBack(prog(t, 1.7, 2.1)); g.save(); g.translate(E.W / 2 + V(330, 260), E.H * 0.3); g.scale(q, q); qmark(g, 0, 0, 150); g.restore(); }
} });

// h03 — giant face: confused, then shocked
registerShot('h03', { draw(g, t) {
  blurLayer(g, 14, (g) => lake(g, t, { z: 1.6, x: -100, y: 80 }, { mood: 'dusk' })); veil(g, '#14081e', 0.3);
  const r = V(300, 330) * (1 + 0.03 * t), [sx, sy] = shake(t, 3, 14);
  bigFace(g, E.W / 2 + sx, E.H * 0.6 + sy, r, { outfit: HERO, expr: t < 0.9 ? 'confused' : 'shocked', rimColor: '#9fd0ff', rimSide: 1, look: t < 0.9 ? [0.3, 0.5] : [0, 0] });
  if (t > 0.9) FX.rings(g, E.W / 2, E.H * 0.6, t - 0.9, { count: 3, r0: r * 1.1, r1: r * 1.7, color: '#dff8ff', a: 0.3 });
} });

// h04 — wide: he stands on dry snow, the lake is out there; "?" between the dot and him
registerShot('h04', { draw(g, t) {
  const k = ease.inOut(t / 4), cam = { z: lerp(1.0, 0.95, k), x: lerp(-80, 40, k), y: 0 };
  const h = shoreScene(g, t, cam, { x: 520, s: 1.7, pose: posesAt(t, [[0, POSES.phone], [1.0, POSES.shrug]]), expr: t > 1 ? 'confused' : 'neutral', look: [0.9, 0.2] });
  layer(g, cam, 1, (g) => {
    const lx = 1260, ly = LGY() + 120, a = ease.out(prog(t, 0.6, 1.1));
    if (a > 0) { g.save(); g.globalAlpha = a; circle(g, lx, ly, 18 + 14 * ((t * 1.2) % 1), alpha('#2f7cf6', 0.3)); circle(g, lx, ly, 16, '#ffffff'); circle(g, lx, ly, 11, '#2f7cf6'); g.restore();
      g.setLineDash([16, 12]); seg(g, [[h.head[0] + 60, h.head[1] - 40], [lx - 30, ly - 10]], 4, alpha('#ffffff', 0.55 * a)); g.setLineDash([]); }
    const q = ease.outBack(prog(t, 1.4, 1.8)); if (q > 0) { g.save(); g.translate((h.head[0] + lx) / 2, (h.head[1] + ly) / 2 - 120); g.scale(q, q); qmark(g, 0, 0, 120); g.restore(); }
  });
} });

// h05 — the promise: two clocks ticking at different speeds, the phone dot jumping between them
registerShot('h05', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e26', '#1a1640', '#2a1e48']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  FX.stars(g, t, { count: 120 }); ambient(g, t, { color: CYAN, color2: GOLD }); const z = 1 + 0.04 * t;
  { const r = rng(11); for (let i = 0; i < 9; i++) { const x = (r() * E.W + t * (20 + r() * 40)) % (E.W + 200) - 100, y = r() * E.H, s = 22 + r() * 34; g.save(); g.globalAlpha = 0.28; FX.clock(g, x, y, s, t * (1 + r() * 8), {}); g.restore(); } }
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const a1 = ease.outBack(prog(t, 0.2, 0.6)), a2 = ease.outBack(prog(t, 0.6, 1.0));
  for (const [x, a, sp, col] of [[E.W / 2 - V(320, 200), a1, 1, GOLD], [E.W / 2 + V(320, 200), a2, 0.35, CYAN]]) {
    if (a <= 0) continue; g.save(); g.translate(x, E.H * 0.5); g.scale(a, a); glow(g, 0, 0, 340, col, 0.25); FX.clock(g, 0, 0, V(190, 150), t * 6 * sp, {}); g.restore(); }
  const a3 = ease.out(prog(t, 1.2, 1.6)); lbl(g, '≠', E.W / 2, E.H * 0.5, a3, V(150, 130), '#ffffff', 'center');
  g.restore();
  // the phone dot appears at the end (the promise: your phone needs this)
  const a4 = ease.outBack(prog(t, 2.6, 3.0)); if (a4 > 0) { g.save(); g.translate(E.W / 2, E.H * 0.84); g.scale(a4, a4); circle(g, 0, 0, 30 + 20 * ((t * 1.2) % 1), alpha('#2f7cf6', 0.3)); circle(g, 0, 0, 26, '#ffffff'); circle(g, 0, 0, 19, '#2f7cf6'); g.restore(); }
} });
