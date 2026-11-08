// shots/01_open.js — cold open: the cracked bottle, then rewind to the night before.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, KGY, FRIDGE, freezerInside } from '../sets/kitchen.js';
import { bottle, ICE } from '../props.js';
import { hero, P } from '../hero.js';
import { lbl } from './02_night.js';
import { HERO } from '../cast.js';

const FZX = FRIDGE.x + FRIDGE.w / 2;
const CRACKED = { crack: 1, ice: 1, frost: 1, mush: 1, bulge: 0.6 };

// o01 — dark kitchen, slow push toward the freezer; something cracks inside
registerShot('o01', { draw(g, t) {
  const k = ease.inOut(t / 3.4), [sx, sy] = t > 2.6 ? shake(t, 7 * (1 - prog(t, 2.6, 3.2)), 40) : [0, 0];
  const cam = { z: lerp(1.15, 1.55, k), x: lerp(250, 500, k) + sx, y: lerp(-120, -200, k) + sy };
  kitchen(g, t, cam, { mood: 'night', lamp: 0 });
  layer(g, cam, 1, (g) => {
    const top = KGY() - FRIDGE.h; // thin cold glow leaking from the freezer seal
    const a = 0.25 + 0.15 * Math.sin(t * 3) + (t > 2.6 ? 0.6 * (1 - prog(t, 2.6, 3.3)) : 0);
    seg(g, [[FRIDGE.x + 10, top + FRIDGE.fz + 2], [FRIDGE.x + FRIDGE.w - 10, top + FRIDGE.fz + 2]], 3, alpha('#bff4ff', a));
    glow(g, FZX, top + FRIDGE.fz, 200, '#9fe8ff', a * 0.4);
  });
  FX.dust(g, t, { count: 30, color: '#9fb4ff', a: 0.25 });
} });

// o02 — morning: the freezer door swings open, cold light and mist, hero in the foreground
registerShot('o02', { draw(g, t) {
  const fz = ease.out(prog(t, 0.05, 0.6)), cam = { z: 1.75 + 0.08 * t, x: 420, y: -200 };
  kitchen(g, t, cam, { mood: 'golden', lamp: 0, freezer: fz, inside: freezerInside(CRACKED) });
  layer(g, cam, 1, (g) => {
    hero(g, { x: FRIDGE.x - 150, y: KGY(), s: 2.3, facing: 1, t, pose: P('reach', { hF: [70, -250], eF: [40, -205] }), expr: 'surprised', rim: { color: '#bff4ff', dir: [1, -0.3], w: 5 } });
  });
  FX.dust(g, t, { count: 40, color: '#e8fbff', a: 0.35 });
} });

// o03 — giant shocked face, cold rim from the freezer
registerShot('o03', { draw(g, t) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.9, x: 520, y: -260 }, { mood: 'golden', lamp: 0, freezer: 1, inside: freezerInside(CRACKED) })); veil(g, '#0a1020', 0.35);
  const punch = ease.outBack(prog(t, 0, 0.25)), r = V(300, 330) * (0.9 + 0.1 * punch) * (1 + 0.03 * t);
  const [sx, sy] = shake(t, 4, 18);
  bigFace(g, E.W / 2 + sx, E.H * 0.6 + sy, r, { outfit: HERO, expr: 'shocked', rimColor: '#bff4ff', rimSide: 1, look: [0.2, -0.1] });
  FX.rings(g, E.W / 2, E.H * 0.6, t, { count: 3, r0: r * 1.1, r1: r * 1.7, color: '#dff8ff', a: 0.3 * (1 - prog(t, 0, 1.5)) });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.6, count: 40, a: 0.18, inner: r * 1.3, color: '#dff8ff' });
} });

// o04 — FREEZE: the cracked bottle, shards hanging in the air
function freezerBg(g, z = 1) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#eafaff', '#9fd4ec', '#4f8fb0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = rng(4); for (let i = 0; i < 90; i++) circle(g, r() * E.W, r() * E.H, (3 + r() * 10) * z, 'rgba(255,255,255,.45)');
}
export function shards(g, cx, cy, t, n = 14, spread = 1, seed = 3, col = ICE) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = (90 + r() * 260) * spread, sz = 8 + r() * 22, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.8, rot = r() * 6 + t * (r() - 0.5);
    g.save(); g.translate(x, y); g.rotate(rot); poly(g, [[0, -sz], [sz * 0.6, sz * 0.4], [-sz * 0.5, sz * 0.7]], col); seg(g, [[0, -sz], [sz * 0.6, sz * 0.4]], 2, 'rgba(255,255,255,.9)'); g.restore(); }
}
registerShot('o04', { draw(g, t) {
  const cam = { z: 1 + 0.04 * t, r: -0.04 + 0.015 * t };
  blurLayer(g, 10, (g) => freezerBg(g, 2));
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 + 80, y = E.H * 0.9;
    glow(g, x, y - 380, 500, '#ffffff', 0.25);
    bottle(g, x, y, { s: 2.15, ...CRACKED });
    shards(g, x + 40, y - 330, t * 0.3, 18, 1.3);
    FX.drops(g, t * 0.2, { count: 30, color: '#e8fbff', rMax: 7, drift: 2 });
  });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,140,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  lbl(g, '−18 °C', V(110, 80), V(160, 230), ease.out(prog(t, 0.3, 0.7)), V(72, 80), '#ffffff', 'left');
} });

// o05 — rewind: the clock spins backwards
registerShot('o05', { draw(g, t) {
  const sp = ease.in(prog(t, 0, 0.8)) * 1 + 0;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e22', '#161c3a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  FX.speedLines(g, -t, { cx: E.W / 2, cy: E.H / 2, count: 70, a: 0.25 * sp, inner: 380, color: '#9fb4ff' });
  const r = V(300, 330) * (1 + 0.05 * t), clockT = 7 * 3600 + 40 * 60 - ease.inOut(prog(t, 0.2, 2.4)) * 8 * 3600;
  glow(g, E.W / 2, E.H / 2, r * 2, '#9fb4ff', 0.25);
  // chromatic ghost copies = rewind feel
  for (const [dx, c, a] of [[-10, 'rgba(255,60,90,.35)', 1], [10, 'rgba(60,200,255,.35)', 1]]) { g.save(); g.globalAlpha = 0.5 * sp; g.globalCompositeOperation = 'lighter'; FX.clock(g, E.W / 2 + dx, E.H / 2, r, clockT, { face: c, ink: c }); g.restore(); }
  FX.clock(g, E.W / 2, E.H / 2, r, clockT, { face: '#eef0ff', ink: '#141830' });
  // backward arrow arcs
  g.strokeStyle = alpha('#ffd95a', 0.8); g.lineWidth = 10; g.lineCap = 'round'; const a0 = -t * 4;
  g.beginPath(); g.arc(E.W / 2, E.H / 2, r * 1.25, a0, a0 - 1.6, true); g.stroke();
  const ax = E.W / 2 + Math.cos(a0 - 1.6) * r * 1.25, ay = E.H / 2 + Math.sin(a0 - 1.6) * r * 1.25, ta = a0 - 1.6 - Math.PI / 2;
  poly(g, [[ax + Math.cos(ta) * 30, ay + Math.sin(ta) * 30], [ax + Math.cos(ta + 2.4) * 24, ay + Math.sin(ta + 2.4) * 24], [ax + Math.cos(ta - 2.4) * 24, ay + Math.sin(ta - 2.4) * 24]], alpha('#ffd95a', 0.8));
  UI.badge(g, { str: '−8 h', a: ease.out(prog(t, 0.4, 0.8)), size: V(64, 72), y: V(140, 200) });
  for (let i = 0; i < 6; i++) { const y = ((i * 197 + t * 900) % E.H); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, y, E.W, 6); }
} });
