// shots/05_float.js — the ice cube in a glass: it floats, because the holes make it lighter (0.92 vs 1.00 g/cm³).
import { E, V, registerShot, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, KGY, COUNTER_TOP } from '../sets/kitchen.js';
import { glass, iceCube, drop, bulb, ICE } from '../props.js';
import { hero, P } from '../hero.js';
import { lbl } from './02_night.js';
import { microBg } from './04_micro.js';

const HS = 2.3, GX = 450;
const REL = 2.5, HIT = 3.15;   // release + splash time in f01

// f01 — hero drops an ice cube into a glass on the counter
registerShot('f01', { draw(g, t) {
  const ct = COUNTER_TOP(), cam = { z: 2.0 + 0.1 * ease.inOut(t / 3.6), x: GX - 40 - 960, y: 600 - 540 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0 });
  layer(g, cam, 1, (g) => {
    const gl = glass(g, GX, ct - 14, 140, 0.62, (g, wTop) => { if (t > HIT) iceCube(g, GX, wTop + 4 + Math.sin((t - HIT) * 9) * 8 * Math.exp(-(t - HIT) * 3), 20, { rot: 0.2 }); });
    const pose = posesAt(t, [[0, P('holdFront', { hF: [40, -160] })], [0.6, P('reach', { hF: [74, -214], eF: [44, -190] })]]);
    const h = hero(g, { x: 230, y: KGY(), s: HS, facing: 1, t, pose, expr: t > REL ? 'smile' : 'neutral', look: [0.7, 0.4], rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    if (t < REL) iceCube(g, h.hand[0] + 14, h.hand[1] + 26, 20, { rot: 0.2 });
    else if (t < HIT) { const k = ease.in(prog(t, REL, HIT)); iceCube(g, lerp(h.hand[0] + 14, GX, k), lerp(h.hand[1] + 26, gl.wTop, k), 20, { rot: 0.2 + k * 1.2 }); }
    if (t > HIT) for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.3, tt = t - HIT; circle(g, GX + Math.cos(a) * tt * 160, gl.wTop + Math.sin(a) * tt * 220 + 400 * tt * tt, 4, alpha('#bfe8ff', clamp(1 - tt * 2))); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.4 });
} });

// f02 — FREEZE mid-splash
function splashCrown(g, cx, y, t) {
  const r = rng(9);
  for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.6, d = 90 + r() * 260, x = cx + Math.cos(a) * d * 1.3, yy = y + Math.sin(a) * d + noise1(t, i) * 3, s = 6 + r() * 14;
    circle(g, x, yy, s, alpha('#d8f0ff', 0.85)); circle(g, x - s * 0.3, yy - s * 0.3, s * 0.35, 'rgba(255,255,255,.95)'); }
  g.fillStyle = alpha('#bfe8ff', 0.7); g.beginPath(); g.moveTo(cx - 200, y); for (let i = 0; i <= 12; i++) { const x = cx - 200 + i * 33, h = (i % 2 ? 60 : 110) + Math.sin(i) * 20; g.lineTo(x, y - h); } g.lineTo(cx + 200, y); g.closePath(); g.fill();
}
const noise1 = (t, i) => Math.sin(t * 2 + i);
registerShot('f02', { draw(g, t) {
  const cam = { z: 1.0 + 0.03 * t, r: 0.03 - 0.012 * t };
  blurLayer(g, 12, (g) => kitchen(g, 0, { z: 2.4, x: -500, y: -150 }, { mood: 'golden', lamp: 0 })); veil(g, '#0a0a18', 0.3);
  layer(g, cam, 1, (g) => {
    const gx = E.W / 2, gy = E.H + 120, h = 900, wl = 0.62, wTop = gy - h * wl;
    glass(g, gx, gy, h, wl, (g) => { iceCube(g, gx, wTop + 40, 110, { rot: 0.5 }); for (let i = 0; i < 20; i++) circle(g, gx - 150 + (i * 47) % 300, wTop + 60 + (i * 83) % 300, 4 + (i % 4) * 3, 'rgba(255,255,255,.6)'); });
    splashCrown(g, gx, wTop, t);
  });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,140,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
} });

// f03 — the cube bobs and settles: most of it hides below the surface
registerShot('f03', { draw(g, t) {
  blurLayer(g, 12, (g) => kitchen(g, t, { z: 2.4, x: -500, y: -150 }, { mood: 'golden', lamp: 0 })); veil(g, '#0a0a18', 0.25);
  const gx = E.W / 2 - V(120, 0), gy = E.H - 40, h = 760, wl = 0.6, wTop = gy - h * wl, R = 100;
  const bob = 50 * Math.exp(-t * 1.6) * Math.sin(t * 6), cy = wTop + R * (1 - 2 * 0.1) + bob;   // 90 % under the surface
  glass(g, gx, gy, h, wl, (g) => { iceCube(g, gx, cy, R, { rot: 0 }); });
  iceCube(g, gx, cy, R, { rot: 0 }); // the part above the waterline (redrawn, clipped)
  g.save(); g.beginPath(); g.rect(0, wTop, E.W, E.H); g.clip(); g.fillStyle = alpha('#2a78c0', 0.35); g.fillRect(gx - R - 4, wTop, R * 2 + 8, R * 2 + 8); g.restore();
  g.setLineDash([14, 10]); seg(g, [[gx - 320, wTop], [gx + 420, wTop]], 3, alpha('#ffffff', 0.6)); g.setLineDash([]);
  const a = ease.out(prog(t, 1.4, 1.9)), bx = gx + 330;
  if (a > 0) {
    g.globalAlpha = a; seg(g, [[bx, wTop], [bx + 20, wTop], [bx + 20, cy + R], [bx, cy + R]], 5, '#ffd95a'); seg(g, [[bx, cy - R], [bx + 20, cy - R], [bx + 20, wTop]], 5, '#ffffff'); g.globalAlpha = 1;
    lbl(g, '≈ 90%', bx + 50, (wTop + cy + R) / 2, a, V(64, 66), '#ffd95a', 'left'); lbl(g, '10%', bx + 50, wTop - 34, a, V(48, 52), '#ffffff', 'left');
  }
} });

// f04 — density: water 1.00 vs ice 0.92 g/cm³ → ice is lighter, it floats
registerShot('f04', { draw(g, t) {
  microBg(g, t, 0.1);
  const base = E.H - 210, H = 560, bw = 230, x1 = E.W / 2 - 300, x2 = E.W / 2 + 70;
  const k1 = ease.out(prog(t, 0.3, 1.0)), k2 = ease.out(prog(t, 0.6, 1.3));
  rr(g, x1, base - H * k1, bw, H * k1, 16); g.fillStyle = linGrad(g, 0, base - H, 0, base, ['#5fc0ff', '#1f5f9e']); g.fill();
  rr(g, x2, base - H * 0.92 * k2, bw, H * 0.92 * k2, 16); g.fillStyle = linGrad(g, 0, base - H, 0, base, ['#f4fdff', '#8fd0ec']); g.fill();
  lbl(g, (1.0 * k1).toFixed(2), x1 + bw / 2, base - H * k1 - 50, k1, V(70, 74), '#8fd8ff', 'center');
  lbl(g, (0.92 * k2).toFixed(2), x2 + bw / 2, base - H * 0.92 * k2 - 50, k2, V(70, 74), '#ffffff', 'center');
  drop(g, x1 + bw / 2, base + 95, 34, '#5fc0ff'); iceCube(g, x2 + bw / 2, base + 90, 38, { rot: 0.15 });
  lbl(g, 'g/cm³', E.W / 2 - 35, V(130, 220), 0.85, V(54, 58), '#cfe0ff', 'center');
  // the lighter one rises: arrow + floating cube
  const up = ease.outBack(prog(t, 2.0, 2.6)), ax = x2 + bw + 160;
  if (up > 0) { seg(g, [[ax, base - 120], [ax, base - 120 - 260 * up]], 14, '#ffd95a'); poly(g, [[ax, base - 420 * Math.min(1, up) + 10 - 0], [ax - 34, base - 360 * Math.min(1, up)], [ax + 34, base - 360 * Math.min(1, up)]], '#ffd95a');
    iceCube(g, ax + 120, base - 200 - 120 * up + Math.sin(t * 3) * 10, 40, { rot: -0.2 }); }
  if (t > 2.2) FX.rings(g, ax, base - 380, t - 2.2, { count: 2, r0: 30, r1: 160, color: '#ffd95a', a: 0.4 * (1 - prog(t, 2.2, 3.2)) });
} });

// f05 — hero gets it: smirk, light bulb, points up
registerShot('f05', { draw(g, t) {
  const ct = COUNTER_TOP(), cam = { z: 1.8, x: 700 - 960, y: -90 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0 });
  layer(g, cam, 1, (g) => {
    glass(g, GX, ct - 14, 140, 0.62, (g, wTop) => iceCube(g, GX, wTop + 6 + Math.sin(t * 2) * 2, 20, { rot: 0.2 }));
    const pose = posesAt(t, [[0, POSES.relaxed], [0.5, POSES.pointUp]]);
    const h = hero(g, { x: 920, y: KGY(), s: HS, facing: -1, t, pose, expr: t > 0.5 ? 'smirk' : 'thinking', rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    const b = ease.outBack(prog(t, 0.55, 0.95)); if (b > 0) { g.save(); g.translate(h.head[0], h.head[1] - 170); g.scale(b, b); bulb(g, 0, 0, 38); g.restore(); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.4 });
} });
