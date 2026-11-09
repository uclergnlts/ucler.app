// shots/02_light.js — a race against light: c is the same for everyone, the light clock, the moving clock runs slow.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { station, trainCar, PGY, RAIL } from '../sets/station.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, lightClock, GOLD, PINK, CYAN, LIGHT } from '../kit.js';

const HS = 2.0;
const torchPose = P('point', { hF: [70, -150], eF: [40, -150] });
function beam(g, x, y, len, a = 1, w = 26) {   // a light beam to the right
  g.save(); g.globalCompositeOperation = 'lighter';
  g.fillStyle = linGrad(g, x, 0, x + len, 0, [alpha(LIGHT, 0.75 * a), alpha(LIGHT, 0.5 * a), alpha(LIGHT, 0)]);
  g.beginPath(); g.moveTo(x, y - w * 0.3); g.lineTo(x + len, y - w * 1.6); g.lineTo(x + len, y + w * 1.6); g.lineTo(x, y + w * 0.3); g.fill(); g.restore();
  glow(g, x + len * 0.92, y, 70, LIGHT, 0.6 * a); circle(g, x + len * 0.92, y, 9, alpha('#ffffff', a));
}

// s01 — night platform, hero with a flashlight
registerShot('s01', { draw(g, t) {
  const k = ease.inOut(t / 3.2), cam = { z: lerp(1.0, 1.12, k), x: lerp(-60, 20, k), y: 0 };
  station(g, t, cam, { train: null });
  layer(g, cam, 1, (g) => {
    const on = t > 1.6, h = hero(g, { x: 520, y: PGY(), s: HS, facing: 1, t, pose: posesAt(t, [[0, POSES.relaxed], [1.2, torchPose]]), expr: on ? 'smirk' : 'neutral', look: [1, 0], rim: { color: '#ffd59a', dir: [-0.7, -0.6], w: 5 } });
    rr(g, h.hand[0] - 6, h.hand[1] - 12, 46, 22, 6); g.fillStyle = '#2a2a38'; g.fill();
    if (on) beam(g, h.hand[0] + 40, h.hand[1], 900 * ease.out(prog(t, 1.6, 2.4)), 1);
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// s02 — the beam rips across the dark, 300 000 km/s
registerShot('s02', { draw(g, t) {
  g.fillStyle = '#04061a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 160 });
  const p = ease.in(prog(t, 0.1, 0.8)), y = E.H * 0.52;
  FX.speedLines(g, t * 3, { cx: E.W * 0.1, cy: y, count: 50, a: 0.18 * p, inner: 200, color: '#fff3c4' });
  beam(g, -80, y, (E.W + 300) * p, 1, 34);
  const r = rng(3); for (let i = 0; i < 18; i++) { const x = ((r() * E.W + t * 2400) % (E.W + 200)) - 100; seg(g, [[x, y + (r() - 0.5) * 120], [x - 160, y + (r() - 0.5) * 120]], 2, alpha('#fff3c4', 0.35)); }
  const a = ease.out(prog(t, 0.8, 1.2)); lbl(g, '300 000 km/s', E.W / 2, E.H * 0.3, a, V(110, 96), GOLD, 'center');
  lbl(g, '1 s', E.W / 2, E.H * 0.74, ease.out(prog(t, 1.4, 1.8)), V(64, 64), '#ffffff', 'center');
} });

// s03 — blueprint: standing hero vs running hero; light passes both at the same c
registerShot('s03', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.07 });
  const rows = [[E.H * 0.36, 0, 0.3], [E.H * 0.78, 1, 1.9]];
  for (const [y, run, t0] of rows) {
    const x = run ? 380 + 260 * ease.inOut(prog(t, 1.9, 4.6)) : 380;
    UI.lineFigure(g, { x, y, s: 1.1, pose: run ? walkPose(t * 3.2, { run: true }) : POSES.stand, color: '#e8f0ff' });
    if (run) { seg(g, [[x - 160, y - 110], [x - 60, y - 110]], 5, alpha(PINK, 0.8)); poly(g, [[x - 50, y - 110], [x - 74, y - 124], [x - 74, y - 96]], alpha(PINK, 0.8)); }
    const ph = prog(t, t0, t0 + 1.6), lx = lerp(-60, E.W + 100, ph);
    if (ph > 0 && ph < 1) { glow(g, lx, y - 120, 60, LIGHT, 0.7); seg(g, [[lx - 220, y - 120], [lx, y - 120]], 6, alpha(LIGHT, 0.8)); circle(g, lx, y - 120, 10, '#ffffff'); }
    const a = ease.out(prog(t, t0 + 0.5, t0 + 0.9)); lbl(g, 'c', E.W - V(280, 160), y - 120, a, V(84, 80), GOLD, 'center');
  }
  const a = ease.out(prog(t, 3.6, 4.0)); lbl(g, '=', E.W - V(280, 160), E.H * 0.57, a, V(90, 90), '#ffffff', 'center');
} });

// s04 — the light clock: a flash bounces between two mirrors; every bounce = tick
registerShot('s04', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.07 });
  const z = 1 + 0.05 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const by = E.H * 0.82, hh = 560, ph = Math.max(0, t - 0.4) / 0.8;
  lightClock(g, E.W / 2, by, hh, ph, { w: 220 });
  const ticks = Math.floor(ph / 2 + 0.5); for (let i = 0; i < Math.min(ticks, 6); i++) circle(g, E.W / 2 + 260 + i * 46, by - hh / 2, 14, GOLD);
  const a = ease.out(prog(t, 0.8, 1.2)); UI.dimension(g, t, { x1: E.W / 2 - 200, y1: by, x2: E.W / 2 - 200, y2: by - hh, str: '', start: 0.6 });
  g.restore();
} });

// s05 — the light clock rides a train: the flash draws a long zig-zag
registerShot('s05', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.07 });
  const by = E.H * 0.78, hh = 420, v = 260, x0 = 260, ph = t / 1.2;   // clock moves right at v px/s
  const cx = x0 + v * t;
  // the train car outline
  rr(g, cx - 200, by - hh - 70, 400, hh + 120, 30); g.strokeStyle = alpha('#cfe8ff', 0.5); g.lineWidth = 4; g.stroke();
  for (const wx of [cx - 120, cx + 120]) ring(g, wx, by + 60, 26, 4, alpha('#cfe8ff', 0.6));
  seg(g, [[-E.W, by + 88], [E.W * 2, by + 88]], 3, alpha('#cfe8ff', 0.4));
  lightClock(g, cx, by, hh, ph, { w: 200 });
  // traced path seen from the platform
  g.strokeStyle = alpha(GOLD, 0.9); g.lineWidth = 5; g.beginPath();
  for (let s = 0; s <= t; s += 0.02) { const k = (s / 1.2) % 2, py = k < 1 ? by - 10 - (hh - 20) * k : by - hh + 10 + (hh - 20) * (k - 1), px = x0 + v * s; s ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  seg(g, [[cx + 230, by - hh / 2], [cx + 320, by - hh / 2]], 6, PINK); poly(g, [[cx + 336, by - hh / 2], [cx + 312, by - hh / 2 - 16], [cx + 312, by - hh / 2 + 16]], PINK);
} });

// s06 — short straight path vs long slanted path: same speed, longer tick
registerShot('s06', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.07 });
  const by = E.H * 0.78, hh = 460, L = E.W * 0.3, R = E.W * 0.62, a1 = ease.out(prog(t, 0.3, 0.9)), a2 = ease.out(prog(t, 1.2, 1.9));
  seg(g, [[L, by], [L, by - hh * a1]], 10, CYAN); circle(g, L, by, 10, CYAN);
  seg(g, [[R, by], [lerp(R, R + 380, a2), lerp(by, by - hh, a2)]], 10, GOLD); circle(g, R, by, 10, GOLD);
  lbl(g, 'c', L - 40, by - hh / 2, a1, V(72, 72), CYAN, 'right'); lbl(g, 'c', R + 150, by - hh / 2 + 30, a2, V(72, 72), GOLD, 'right');
  const a3 = ease.out(prog(t, 2.4, 2.9)); lbl(g, '<', (L + R) / 2 + 40, by - hh / 2, a3, V(120, 110), '#ffffff', 'center');
  if (a3 > 0) { FX.clock(g, L, by - hh - 110, 60, t * 4, {}); FX.clock(g, R + 380, by - hh - 110, 60, t * 2, {}); }
} });

// s07 — the train passes: the clock inside ticks slowly, the platform clock fast
registerShot('s07', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: 30 };
  const tx = lerp(-1600, 900, t / 4.4);
  station(g, t, cam, { train: tx, blur: true, clockX: 1700, clockT: t * 6 });
  layer(g, cam, 0.85, (g) => { const cx = tx + 380, cy = RAIL() - 200; glow(g, cx, cy, 120, '#ffffff', 0.4); FX.clock(g, cx, cy, 70, t * 1.5, {}); });
  layer(g, cam, 1, (g) => { const h = hero(g, { x: 300, y: PGY(), s: HS, facing: 1, t, pose: POSES.relaxed, expr: 'surprised', look: [1, -0.2], rim: { color: '#ffd59a', dir: [-0.7, -0.6], w: 5 } }); });
} });

// s08 — faster -> slower time: speed meter climbs, the clock crawls; awe
registerShot('s08', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e26', '#1a1640']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const sp = ease.inOut(prog(t, 0.2, 2.2));
  // speedometer arc
  const cx = E.W * 0.3, cy = E.H * 0.62, r = 220; g.lineCap = 'round';
  g.strokeStyle = alpha('#cfe0ff', 0.25); g.lineWidth = 28; g.beginPath(); g.arc(cx, cy, r, Math.PI, Math.PI * 2); g.stroke();
  g.strokeStyle = PINK; g.beginPath(); g.arc(cx, cy, r, Math.PI, Math.PI * (1 + sp)); g.stroke();
  const an = Math.PI * (1 + sp); seg(g, [[cx, cy], [cx + Math.cos(an) * (r - 40), cy + Math.sin(an) * (r - 40)]], 10, '#ffffff'); circle(g, cx, cy, 16, '#ffffff');
  lbl(g, `${(sp * 0.99).toFixed(2)} c`, cx, cy + 90, 1, V(64, 64), PINK, 'center');
  // clock slowing
  const ct = 2 * t - 1.2 * t * sp; FX.clock(g, E.W * 0.7, E.H * 0.52, 200, ct * 6, {});
  const a = ease.out(prog(t, 1.2, 1.6)); lbl(g, '↓', E.W * 0.7 + 260, E.H * 0.52, a, V(110, 100), CYAN, 'center'); lbl(g, '↑', cx + r + 70, cy - 60, a, V(110, 100), PINK, 'center');
  if (t > 2.3) { const q = ease.out(prog(t, 2.3, 2.7)); veil(g, '#0a0e26', 0.85 * q); g.save(); g.globalAlpha = q; bigFace(g, E.W / 2, E.H * 0.62, 260, { outfit: HERO, expr: 'awe', rimColor: '#9fd0ff', rimSide: 1 }); g.restore(); }
} });
