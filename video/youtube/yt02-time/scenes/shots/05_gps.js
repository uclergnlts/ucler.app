// shots/05_gps.js — GPS: satellites 20 000 km up, −7 µs (speed) + 45 µs (weaker gravity) = +38 µs a day → 11 km of light → map off by ~10 km.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { lake } from '../sets/lake.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { qmark } from '../props.js';
import { shoreScene } from './01_hook.js';
import { lbl, mapView, phone, atomic, satellite, earth, space, ambient, GOLD, PINK, CYAN, LIGHT } from '../kit.js';

const TRUE = [0.24, 0.8], LAKE = [0.56, 0.42];

// p01 — back on the shore: so what does this have to do with your phone?
registerShot('p01', { draw(g, t) {
  const cam = { z: lerp(1.3, 1.45, ease.inOut(t / 2.8)), x: -300, y: 100 };
  const h = shoreScene(g, t, cam, { expr: 'thinking', pose: POSES.phone, look: [0.3, 0.8] });
  const q = ease.outBack(prog(t, 0.6, 1.0)); if (q > 0) { g.save(); g.translate(E.W * 0.62, E.H * 0.3); g.scale(q, q); qmark(g, 0, 0, 160); g.restore(); }
} });

// orbit helper: Earth at (ex, ey) radius R, satellites on an ellipse
function orbitScene(g, t, o = {}) {
  const ex = o.ex ?? E.W / 2, ey = o.ey ?? E.H * 1.25, R = o.R ?? 620, oR = R * 1.62;
  space(g, t); earth(g, ex, ey, R, t);
  g.setLineDash([12, 14]); g.strokeStyle = alpha(CYAN, 0.35); g.lineWidth = 3; g.beginPath(); g.ellipse(ex, ey, oR, oR * 0.9, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  const sats = []; for (let i = 0; i < (o.n ?? 5); i++) { const an = -Math.PI / 2 + (i - 2) * 0.42 + t * (o.speed ?? 0.05); const x = ex + Math.cos(an) * oR, y = ey + Math.sin(an) * oR * 0.9; satellite(g, x, y, o.ss ?? 0.45, { rot: an + Math.PI / 2, clock: true }); sats.push([x, y, an]); }
  return { ex, ey, R, oR, sats };
}

// p02 — fly up to space: Earth, GPS satellites, 20 000 km
registerShot('p02', { draw(g, t) {
  const z = lerp(1.6, 1.0, ease.out(prog(t, 0, 1.6))); g.save(); g.translate(E.W / 2, E.H); g.scale(z, z); g.translate(-E.W / 2, -E.H);
  const o = orbitScene(g, t, {});
  g.restore();
  if (t < 0.5) { g.fillStyle = `rgba(255,255,255,${0.8 * (1 - t / 0.5)})`; g.fillRect(0, 0, E.W, E.H); }
  const a = ease.out(prog(t, 1.8, 2.3)), x = E.W * 0.5 + 420;
  if (a > 0) { UI.dimension(g, t, { x1: x, y1: E.H * 1.25 - 620 * 0.98, x2: x, y2: E.H * 1.25 - 620 * 1.62 * 0.9 + 30, str: '', start: 1.8 }); lbl(g, '20 000 km', x + 40, E.H * 0.3, a, V(76, 72), GOLD, 'left'); }
} });

// p03 — a satellite with its atomic clock; signal rings travel down to the phone
registerShot('p03', { draw(g, t) {
  space(g, t); earth(g, E.W * 0.5, E.H * 1.9, 1100, t);
  const sx = E.W * 0.38, sy = E.H * 0.3 + Math.sin(t) * 8;
  glow(g, sx, sy, 300, '#8fb4ff', 0.12); satellite(g, sx, sy, 1.15, { rot: 0.08, clock: true });
  const px = E.W * 0.7, py = E.H * 0.76;
  for (let i = 0; i < 4; i++) { const ph = ((t - 0.4 - i * 0.9) / 1.6); if (ph < 0 || ph > 1) continue; const x = lerp(sx, px, ph), y = lerp(sy + 80, py - 80, ph); ring(g, x, y, 20 + 30 * ph, 4, alpha(CYAN, 0.8 * (1 - ph))); circle(g, x, y, 6, alpha('#ffffff', 1 - ph * 0.5)); }
  phone(g, px, py, 0.55, (x, y, w, h) => mapView(g, x, y, w, h, { pin: TRUE, pulse: t }), { glowA: 0.3 });
  atomic(g, sx + 330, sy - 40, 0.8, (12 + t * 0.371).toFixed(6), { t, w: 300 });
} });

// p04 — the satellites fly fast (3.9 km/s): speed slows their clocks, −7 µs a day
registerShot('p04', { draw(g, t) {
  const o = orbitScene(g, t, { speed: 0.22, n: 3, ss: 0.7, ey: E.H * 1.45, R: 760 });
  const s = o.sats[1]; FX.speedLines(g, t * 2, { cx: s[0], cy: s[1], count: 40, a: 0.16, inner: 140, color: '#cfe0ff' });
  seg(g, [[s[0] + 120, s[1] - 10], [s[0] + 260, s[1] + 20]], 8, PINK); poly(g, [[s[0] + 280, s[1] + 24], [s[0] + 250, s[1] + 2], [s[0] + 246, s[1] + 36]], PINK);
  lbl(g, '3.9 km/s', E.W - V(180, 120), V(150, 230), ease.out(prog(t, 0.6, 1.0)), V(80, 76), PINK, 'right');
  const a = ease.outBack(prog(t, 2.4, 2.8)); if (a > 0) { g.save(); g.translate(V(360, 300), E.H * 0.42); g.scale(a, a); atomic(g, 0, 0, 1.1, '−7 µs', { color: CYAN, t, w: 300 }); g.restore(); lbl(g, '/ 24 h', V(360, 300), E.H * 0.42 + 120, a, V(48, 48), '#cfe0ff', 'center'); }
} });

// p05 — up there gravity is weaker: clocks run faster, +45 µs a day
registerShot('p05', { draw(g, t) {
  const o = orbitScene(g, t, { speed: 0.05, n: 3, ss: 0.7, ey: E.H * 1.45, R: 760 });
  // gravity field rings fading with height
  for (let i = 0; i < 7; i++) { const r = o.R + 40 + i * 70 + ((t * 30) % 70); g.strokeStyle = alpha('#ffb070', 0.35 * (1 - i / 7)); g.lineWidth = 6 - i * 0.7; g.beginPath(); g.ellipse(o.ex, o.ey, r, r * 0.95, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  const s = o.sats[1]; lbl(g, '↓', s[0], s[1] + 130, ease.out(prog(t, 0.8, 1.2)), V(70, 70), '#ffb070', 'center');
  const a = ease.outBack(prog(t, 2.4, 2.8)); if (a > 0) { g.save(); g.translate(E.W - V(360, 300), E.H * 0.42); g.scale(a, a); atomic(g, 0, 0, 1.1, '+45 µs', { color: GOLD, t, w: 300 }); g.restore(); lbl(g, '/ 24 h', E.W - V(360, 300), E.H * 0.42 + 120, a, V(48, 48), '#cfe0ff', 'center'); }
} });

// p06 — the sum: −7 + 45 = +38 µs, every day
registerShot('p06', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#060a1e', '#141238']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 140 });
  earth(g, E.W / 2, E.H * 1.9, E.H * 1.05, t, { spin: 0.03 }); ambient(g, t, { gears: false, color: PINK, color2: GOLD });
  for (let i = 0; i < 3; i++) { const a = -2.4 + i * 0.5 + t * 0.12; satellite(g, E.W / 2 + Math.cos(a) * E.W * 0.55, E.H * 1.9 + Math.sin(a) * E.H * 1.42, 0.16, { rot: a + 1.57 }); }
  if (E.crop) { // 9:16 Shorts: stack the sum vertically inside the crop window
    const cx = (E.crop[0] + E.crop[1]) / 2, a1 = ease.out(prog(t, 0.2, 0.5)), a2 = ease.out(prog(t, 0.7, 1.0)), a3 = ease.outBack(prog(t, 1.4, 1.9));
    lbl(g, '−7 µs', cx, 200, a1, 80, CYAN, 'center'); lbl(g, '+ 45 µs', cx, 340, a2, 80, GOLD, 'center'); seg(g, [[cx - 200, 430], [cx + 200, 430]], 4, alpha('#ffffff', a3));
    if (a3 > 0) { g.save(); g.translate(cx, 560); g.scale(a3, a3); glow(g, 0, 0, 260, PINK, 0.35); lbl(g, '+38 µs', 0, 0, 1, 96, PINK, 'center'); g.restore(); }
    lbl(g, '/ 24 h', cx, 690, ease.out(prog(t, 2.0, 2.4)), 52, '#cfe0ff', 'center'); return;
  }
  const y = E.H * 0.46, a1 = ease.out(prog(t, 0.2, 0.5)), a2 = ease.out(prog(t, 0.7, 1.0)), a3 = ease.outBack(prog(t, 1.4, 1.9));
  lbl(g, '−7 µs', E.W * 0.22, y, a1, V(96, 80), CYAN, 'center'); lbl(g, '+', E.W * 0.36, y, a2, V(96, 80), '#ffffff', 'center');
  lbl(g, '45 µs', E.W * 0.5, y, a2, V(96, 80), GOLD, 'center'); lbl(g, '=', E.W * 0.64, y, a3, V(96, 80), '#ffffff', 'center');
  if (a3 > 0) { g.save(); g.translate(E.W * 0.8, y); g.scale(a3, a3); glow(g, 0, 0, 260, PINK, 0.35); lbl(g, '+38 µs', 0, 0, 1, V(120, 96), PINK, 'center'); g.restore(); }
  lbl(g, '/ 24 h', E.W * 0.8, y + 110, ease.out(prog(t, 2.0, 2.4)), V(56, 52), '#cfe0ff', 'center');
} });

// p07 — in 38 µs light runs more than 11 km across the map
registerShot('p07', { draw(g, t) {
  g.fillStyle = '#0a0e22'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const mx = 160, my = 120, mw = E.W - 320, mh = E.H - 240;
  mapView(g, mx, my, mw, mh, { pin: TRUE, pulse: t, pinA: 1 });
  const p = ease.inOut(prog(t, 0.3, 1.8)), y = my + mh * 0.62, x0 = mx + mw * 0.12, x1 = mx + mw * 0.88, x = lerp(x0, x1, p);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, x0, 0, x, 0, [alpha(LIGHT, 0), alpha(LIGHT, 0.85)]); g.fillRect(x0, y - 10, Math.max(0, x - x0), 20); g.restore();
  glow(g, x, y, 80, LIGHT, 0.9); circle(g, x, y, 12, '#ffffff');
  const a = ease.out(prog(t, 1.9, 2.3)); if (a > 0) { UI.dimension(g, t, { x1: x0, y1: y + 70, x2: x1, y2: y + 70, str: '', start: 1.9 }); lbl(g, '> 11 km', (x0 + x1) / 2, y + 140, a, V(90, 80), GOLD, 'center'); }
  lbl(g, '38 µs', mx + 60, my + 80, ease.out(prog(t, 0.1, 0.4)), V(64, 60), PINK, 'left');
} });

// p08 — without the fix the dot drifts: ~10 km after one day
registerShot('p08', { draw(g, t) {
  g.fillStyle = '#0a0e22'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const mx = 160, my = 120, mw = E.W - 320, mh = E.H - 240, k = ease.inOut(prog(t, 0.4, 3.6));
  const ghost = [lerp(TRUE[0], LAKE[0], k), lerp(TRUE[1], LAKE[1], k), 1];
  mapView(g, mx, my, mw, mh, { pin: TRUE, ghost, pulse: t, ring10: ease.out(prog(t, 3.4, 4.0)) * 0.55 });
  lbl(g, `${Math.round(24 * k)} h`, mx + 60, my + 80, 1, V(64, 60), '#ffffff', 'left');
  const a = ease.out(prog(t, 3.6, 4.0)); lbl(g, '≈ 10 km', mx + mw * 0.42, my + mh * 0.7, a, V(96, 84), PINK, 'center');
} });

// p09 — engineers tune each satellite clock slower before launch
registerShot('p09', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a2442', '#24305a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  for (let x = 60; x < E.W; x += 240) { rr(g, x, 30, 160, 22, 8); g.fillStyle = alpha('#e8f4ff', 0.8); g.fill(); FX.lightCone(g, x + 80, 52, { len: 520, spread: 0.35, color: '#dff0ff', a: 0.06 }); }
  for (let x = 0; x < E.W; x += 120) seg(g, [[x, 120], [x, E.H * 0.8]], 2, alpha('#9fb4e8', 0.08));
  g.fillStyle = '#141a32'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H); FX.floorLines(g, E.H * 0.8, E.H, 'rgba(160,190,255,.08)');
  // satellite on a stand, the stand stays when it lifts off
  { const sx0 = E.W * 0.36; poly(g, [[sx0 - 60, E.H * 0.8], [sx0 + 60, E.H * 0.8], [sx0 + 20, E.H * 0.62], [sx0 - 20, E.H * 0.62]], '#2e3a62'); }
  // control desk with the dial (right) and an engineer in a lab coat
  rr(g, E.W * 0.58, E.H * 0.66, 520, 40, 10); g.fillStyle = '#3a4676'; g.fill(); seg(g, [[E.W * 0.6, E.H * 0.7], [E.W * 0.6, E.H * 0.8]], 10, '#2a3460'); seg(g, [[E.W * 0.58 + 500, E.H * 0.7], [E.W * 0.58 + 500, E.H * 0.8]], 10, '#2a3460');
  FX.screen(g, { x: E.W * 0.82, y: E.H * 0.16, w: 220, h: 130 }, (g, x, y, w, h) => { for (let i = 0; i < 5; i++) seg(g, [[x + 16, y + 20 + i * 22], [x + 16 + (60 + ((i * 37 + Math.floor(t * 4) * 13) % 110)), y + 20 + i * 22]], 6, alpha('#7fe0c0', 0.7)); });
  hero(g, { x: E.W * 0.89, y: E.H * 0.8, s: 2.1, facing: -1, t, outfit: { top: 'labcoat', color: '#ebe7f0', head: 'none', legs: '#26324f' }, pose: posesAt(t, [[0, POSES.relaxed], [0.3, POSES.reach]]), expr: 'determined', look: [-1, 0], rim: { color: '#dff0ff', dir: [0.7, -0.6], w: 4 } });
  const lift = t > 2.4 ? 400 * (t - 2.4) ** 2 : 0, sx = E.W * 0.36, sy = E.H * 0.52 - lift;
  satellite(g, sx, sy, 1.1, { clock: true });
  // tuning dial
  const dx = E.W * 0.72, dy = E.H * 0.5, an = -2.2 + 0.5 * ease.inOut(prog(t, 0.4, 1.8));
  circle(g, dx, dy, 150, '#1a2238'); ring(g, dx, dy, 150, 6, alpha(CYAN, 0.8));
  for (let i = 0; i < 24; i++) { const a = -Math.PI * 1.25 + i * (Math.PI * 1.5 / 23); seg(g, [[dx + Math.cos(a) * 120, dy + Math.sin(a) * 120], [dx + Math.cos(a) * 140, dy + Math.sin(a) * 140]], 3, alpha(CYAN, 0.6)); }
  seg(g, [[dx, dy], [dx + Math.cos(an) * 110, dy + Math.sin(an) * 110]], 10, GOLD); circle(g, dx, dy, 18, GOLD);
  lbl(g, '−38 µs', dx, dy - 215, ease.out(prog(t, 1.0, 1.4)), V(80, 76), CYAN, 'center');
  if (t > 2.4) { glow(g, sx, sy + 140, 120, '#ffb04a', 0.6); poly(g, [[sx - 30, sy + 80], [sx + 30, sy + 80], [sx, sy + 240]], alpha('#ffb04a', 0.8)); }
} });

// p10 — fixed: the dot snaps back to the hero on the shore, he smiles
registerShot('p10', { draw(g, t) {
  const cam = { z: 1.25, x: -300, y: 80 };
  const h = shoreScene(g, t, cam, { expr: t > 1.2 ? 'joy' : 'surprised', pose: posesAt(t, [[0, POSES.phone], [1.4, POSES.cheer]]), look: [0.5, 0.2] });
  const k = ease.outBack(prog(t, 0.2, 0.9)), pin = [lerp(LAKE[0], TRUE[0], ease.inOut(prog(t, 0.3, 1.0))), lerp(LAKE[1], TRUE[1], ease.inOut(prog(t, 0.3, 1.0)))];
  const pa = 1 - ease.in(prog(t, 2.6, 3.2)); if (pa > 0) { g.save(); g.globalAlpha = pa; phone(g, E.W * 0.72, E.H * 0.5, 1.15 * k + 0.001, (x, y, w, hh) => mapView(g, x, y, w, hh, { pin, pulse: t }), { rot: 0.05, glowA: 0.3 }); g.restore(); }
  if (t > 1.0 && t < 2.6) { const c = ease.outBack(prog(t, 1.0, 1.3)); g.save(); g.translate(E.W * 0.72 + 150, E.H * 0.2); g.scale(c, c); circle(g, 0, 0, 56, '#5fe0a8'); seg(g, [[-26, 2], [-6, 22], [28, -20]], 13, '#ffffff'); g.restore(); }
} });
