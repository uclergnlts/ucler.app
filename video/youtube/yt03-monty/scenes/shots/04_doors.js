// shots/04_doors.js — lines 18-25: a hundred doors, 98 goats, the 99% flows to the last door; back to three; play it 1 000 times.
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, ambient } from '../kit.js';
import { qmark } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC } = SH;
const FAR = 73;   // the door the host skips (0-based index in the 10x10 grid)
const bg = (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); };
// 10 x 10 wall of small doors; openAt(i) -> 0..1
function wall(g, t, openAt, o = {}) { const w = 120, h = 70, gx = 150, gy = 86, x0 = E.W / 2 - gx * 4.5, y0 = E.H * 0.07 + (o.dy || 0);
  for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), x = x0 + c * gx, y = y0 + r * gy + h, k = o.appear ? o.appear(i) : 1; if (k <= 0) continue;
    g.save(); g.translate(x, y); g.scale(k, k); SH.door(g, 0, 0, 60, 62, { n: i + 1, t, label: false, open: openAt(i), color: DOORC[i % 3], inside: (g, cx, cy) => SH.goat(g, cx, cy, 0.22, { t: t + i, f: -1, bleat: openAt(i) > 0.9 ? Math.abs(Math.sin(t * 6 + i)) : 0 }) }); g.restore(); }
  return (i) => [x0 + (i % 10) * gx, y0 + Math.floor(i / 10) * gy + h]; }

// d01 — three doors multiply into a hundred
registerShot('d01', { draw(g, t) {
  bg(g); ambient(g, t, { color: GOLD, gears: false, motes: 30 });
  const k = ease.inOut(prog(t, 0.6, 1.4));
  if (k < 1) { g.save(); g.globalAlpha = 1 - k; [0.36, 0.5, 0.64].forEach((fx, i) => SH.door(g, E.W * fx, E.H * 0.82, 230 * (1 - 0.6 * k), 380 * (1 - 0.6 * k), { n: i + 1, t })); g.restore(); }
  if (k > 0) wall(g, t, () => 0, { appear: (i) => ease.outBack(prog(t, 0.8 + (i % 10 + Math.floor(i / 10)) * 0.05, 1.2 + (i % 10 + Math.floor(i / 10)) * 0.05)) });
  lbl(g, '100', E.W * 0.5, E.H * 0.98, ease.out(prog(t, 1.8, 2.2)), 90, GOLD, 'center');
} });

// d02 — the hero picks one door: 1%
registerShot('d02', { draw(g, t) {
  const cam = { z: 1.0 + 0.05 * t, x: 0, y: 0 }; bg(g);
  layer(g, cam, 1, (g) => { const at = wall(g, t, () => 0, {}); const [x, y] = at(0); const s = ease.out(prog(t, 0.4, 0.8));
    if (s > 0) { ring(g, x, y - 37, 70, 6, alpha(GOLD, s)); glow(g, x, y - 37, 120, GOLD, 0.4 * s); lbl(g, '1%', x - 80, y - 10, s, 64, GOLD, 'right'); }
    hero(g, { x: E.W * 0.07, y: E.H * 1.02, s: 2.0, facing: 1, t, pose: posesAt(t, [[0, POSES.think], [0.3, POSES.pointUp]]), expr: 'determined', look: [0.6, -1] }); });
} });

// d03 — the host opens 98 doors in a wave
registerShot('d03', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: 0 }; bg(g);
  layer(g, cam, 1, (g) => { const order = (i) => (i % 10 + Math.floor(i / 10)) * 0.09; const at = wall(g, t, (i) => (i === 0 || i === FAR ? 0 : ease.inOut(prog(t, 0.3 + order(i), 0.7 + order(i)))), {});
    const [x, y] = at(0); ring(g, x, y - 37, 70, 6, GOLD);
    const n = Array.from({ length: 100 }, (_, i) => i).filter((i) => i && i !== FAR && t > 0.7 + order(i)).length; lbl(g, `${n}`, E.W * 0.985, E.H * 0.16, 1, 90, PINK, 'right');
    SH.host(g, { x: E.W * 0.93, y: E.H * 0.84, s: 1.6, facing: -1, t, pose: P('point', { hF: [44, -150 + 20 * Math.sin(t * 8)] }), expr: 'smirk', look: [-1, -0.3] }); });
} });

// d04 — goat chorus: rows of goats bleat in time, music notes
registerShot('d04', { draw(g, t) {
  const cam = { z: 1.05 + 0.04 * t, x: 0, y: 0 }; bg(g);
  layer(g, cam, 1, (g) => { for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const x = 160 + i * 270 + (r % 2) * 130, y = E.H * (0.42 + r * 0.24), b = Math.max(0, Math.sin(t * 6.3 - r * 0.5)); SH.goat(g, x, y, 1.0 - r * 0.0, { t: t + i + r, f: i % 2 ? 1 : -1, bleat: b }); if (b > 0.9) SH.note(g, x + 60 * (i % 2 ? 1 : -1), y - 200, 1, alpha('#ffffff', 0.8)); } });
  FX.lightCone(g, E.W / 2, -80, { angle: Math.PI / 2, spread: 0.4, len: 1300, color: '#ffd7f0', a: 0.12 });
} });

// d05 — two doors left: the hero's and one far away; the hero looks from one to the other
registerShot('d05', { draw(g, t) {
  bg(g); const vx = E.W / 2, vy = E.H * 0.42; poly(g, [[0, E.H], [E.W, E.H], [vx + 40, vy + 40], [vx - 40, vy + 40]], '#2a1e3a');
  for (let i = 30; i >= 1; i--) { const z = 1 / (1 + i * 0.25), w = 180 * z, h = 300 * z; for (const sd of [-1, 1]) { const x = vx + sd * (E.W * 0.42 * z + 30), y = vy + 40 + (E.H * 0.58) * z; const keep = sd > 0 && i === 22;
    SH.door(g, x, y, w, h, { n: i * 2, t, label: false, open: keep ? 0 : 0.9, glowC: keep ? GOLD : null, color: keep ? DOORC[1] : DOORC[i % 3], inside: (g, cx, cy) => SH.goat(g, cx, cy, z * 1.0, { t: t + i, f: -sd }) }); if (keep) glow(g, x, y - h / 2, 120, GOLD, 0.4 + 0.2 * Math.sin(t * 4)); } }
  SH.door(g, E.W * 0.2, E.H * 1.0, 300, 500, { n: 1, t, color: DOORC[0], glowC: GOLD }); ring(g, E.W * 0.2, E.H * 0.43, 60, 6, GOLD);
  const look = Math.sin(t * 1.8); hero(g, { x: E.W * 0.42, y: E.H * 1.0, s: 2.2, facing: look > 0 ? 1 : -1, t, pose: POSES.think, expr: 'thinking', look: [1, -0.2] });
  const q = ease.outBack(prog(t, 1.4, 1.8)); if (q > 0) qmark(g, E.W * 0.47, E.H * 0.3, 160 * q, 1, GOLD);
} });

// d06 — the 99% liquid: every open door drains its glow into the one door the host skipped
registerShot('d06', { draw(g, t) {
  const cam = { z: 1.0, x: 0, y: 0 }; bg(g);
  layer(g, cam, 1, (g) => { const at = wall(g, t, (i) => (i === 0 || i === FAR ? 0 : 1), {}); const [tx, ty] = at(FAR); const [hx, hy] = at(0);
    const k = ease.inOut(prog(t, 0.4, 2.4));
    for (let i = 1; i < 100; i++) { if (i === FAR) continue; const [x, y] = at(i), d = clamp((k * 1.6 - ((i * 37) % 100) / 160)); const px = lerp(x, tx, ease.inOut(d)), py = lerp(y - 37, ty - 37, ease.inOut(d)) - Math.sin(d * Math.PI) * 120; if (d < 1) circle(g, px, py, 10, alpha(GOLD, 0.8)); }
    SH.blob(g, tx, ty - 37, 40 + 80 * k, k > 0.6 ? '99%' : '', GOLD, t); SH.blob(g, hx, hy - 37, 30, '', CYAN, t); lbl(g, '1%', hx - 80, hy - 10, 1, 56, CYAN, 'right'); });
} });

// d07 — back to three doors: a 1/3 bubble on door 1, a 2/3 cloud over doors 2 and 3
registerShot('d07', { draw(g, t) {
  const cam = { z: 1.15, x: 0, y: -20 }; SH.studio(g, t, cam, { audience: false });
  const DX = [E.W * 0.3, E.W * 0.52, E.W * 0.72];
  layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, 230, 380, { n: i + 1, t }));
    const a = ease.outBack(prog(t, 0.3, 0.8)), b = ease.outBack(prog(t, 1.2, 1.7));
    SH.blob(g, DX[0], E.H * 0.27, 80 * a, '1/3', CYAN, t);
    if (b > 0) { g.strokeStyle = alpha(GOLD, 0.8); g.lineWidth = 8; g.beginPath(); g.moveTo(DX[1] - 120, E.H * 0.42); g.lineTo(DX[1] - 120, E.H * 0.39); g.lineTo(DX[2] + 120, E.H * 0.39); g.lineTo(DX[2] + 120, E.H * 0.42); g.stroke(); SH.blob(g, (DX[1] + DX[2]) / 2, E.H * 0.25, 110 * b, '2/3', GOLD, t); }
  });
} });

// d08 — door 3 opens (goat); the whole 2/3 pours like liquid into door 2
registerShot('d08', { draw(g, t) {
  const cam = { z: 1.15 + 0.05 * t, x: 0, y: -20 }; SH.studio(g, t, cam, { audience: false });
  const DX = [E.W * 0.3, E.W * 0.52, E.W * 0.72], op = ease.inOut(prog(t, 0.2, 0.9)), fl = ease.inOut(prog(t, 1.0, 2.4));
  layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, 230, 380, { n: i + 1, t, open: i === 2 ? op : 0, glowC: i === 1 ? GOLD : '#fff3c4', inside: (g, cx, cy) => SH.goat(g, cx - 10, cy, 1.05, { t, f: -1 }) }));
    SH.blob(g, DX[0], E.H * 0.27, 80, '1/3', CYAN, t);
    const cx = lerp((DX[1] + DX[2]) / 2, DX[1], fl), cy = lerp(E.H * 0.25, E.H * 0.27, fl);
    for (let i = 0; i < 14; i++) { const d = clamp(fl * 1.4 - i / 20), px = lerp(DX[2], DX[1], d), py = E.H * 0.27 - Math.sin(d * Math.PI) * 80 + i * 2; if (fl > 0 && d < 1) circle(g, px, py, 14, alpha(GOLD, 0.8)); }
    SH.blob(g, cx, cy, 110 + 20 * fl, '2/3', GOLD, t); if (fl > 0.95) glow(g, DX[1], SH.SGY() - 240, 300, GOLD, 0.35); });
} });

// d09 — the hero's big face: aha, 2/3 reflected in the eyes
registerShot('d09', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); ambient(g, t, { color: GOLD, gears: false, motes: 40 });
  const r = V(300, 320) * (1 + 0.04 * t); bigFace(g, E.W * 0.38, E.H * 0.62, r, { outfit: HERO, expr: t > 0.6 ? 'awe' : 'surprised', look: [1, -0.1], rimColor: GOLD, rimSide: 1 });
  SH.blob(g, E.W * 0.76, E.H * 0.42, 140 * ease.outBack(prog(t, 0.2, 0.7)), '2/3', GOLD, t); FX.sparkle(g, E.W * 0.84, E.H * 0.26, 40, '#ffffff', 0.8 * prog(t, 0.6, 1));
} });

// y01 — "Let's play. A thousand times." The hero rolls up his sleeves at a big lever; a goat assistant hands him a clipboard
registerShot('y01', { draw(g, t) {
  const cam = { z: 1.08 - 0.04 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a3a6a', '#f2a07a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.sun(g, E.W * 0.5, E.H * 0.7, 60, '#fff0d8', '#ffb07a', 4); FX.hills(g, { y: E.H * 0.74, color: '#5a4a5a' }); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#4a3a3a'; g.fillRect(-E.W, E.H * 0.82, E.W * 3, E.H);
    rr(g, E.W * 0.52, E.H * 0.82 - 300, 300, 300, 20); g.fillStyle = '#3a3450'; g.fill(); for (let k = 0; k < 3; k++) circle(g, E.W * 0.52 + 70 + k * 80, E.H * 0.82 - 230, 22, (Math.floor(t * 4) % 3) === k ? GOLD : '#5a5470');
    const lv = ease.inOut(prog(t, 1.4, 1.9)); seg(g, [[E.W * 0.52 + 260, E.H * 0.82 - 140], [E.W * 0.52 + 260 + 120 * Math.sin(-0.6 + lv * 1.2), E.H * 0.82 - 140 - 120 * Math.cos(-0.6 + lv * 1.2)]], 14, '#cfd3e0'); circle(g, E.W * 0.52 + 260 + 120 * Math.sin(-0.6 + lv * 1.2), E.H * 0.82 - 140 - 120 * Math.cos(-0.6 + lv * 1.2), 26, PINK);
    const roll = Math.sin(t * 10) * 10 * (1 - prog(t, 0.8, 1.2)); hero(g, { x: E.W * 0.36, y: E.H * 0.84, s: 2.0, facing: 1, t, pose: posesAt(t, [[0, P('crossArms', { hF: [20 + roll, -140], hB: [-20 - roll, -140] })], [1.2, POSES.reach]]), expr: 'determined', look: [1, 0] });
    SH.goat(g, E.W * 0.16, E.H * 0.84, 1.1, { t, f: 1 }); rr(g, E.W * 0.16 + 70, E.H * 0.84 - 190, 70, 90, 6); g.fillStyle = '#f4efe6'; g.fill(); });
  lbl(g, '× 1 000', E.W * 0.06, E.H * 0.14, ease.outBack(prog(t, 0.2, 0.6)), 120, GOLD);
} });

// y02 — two garages fill up: stay (=) vs switch (⇄); counters race to 353 and 647
const GSTAY = '#3a5a9a', GSW = '#7a4a8a';
function garages(g, t, k, burst = 0) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a3a6a', '#f2a07a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.sun(g, E.W * 0.5, E.H * 0.6, 50, '#fff0d8', '#ffb07a', 4); g.fillStyle = '#4a3a3a'; g.fillRect(-E.W, E.H * 0.82, E.W * 3, E.H);
  const nS = Math.round(353 * k), nW = Math.round(647 * k);
  [[0.27, GSTAY, nS, '='], [0.73, GSW, nW, '⇄']].forEach(([fx, c, n, sym], j) => { const x = E.W * fx, cars = Math.floor(n / 50);
    SH.garage(g, x, E.H * 0.82, 560, 400, { color: c, inside: (g) => { for (let i = 0; i < cars; i++) SH.car(g, x - 190 + (i % 4) * 126, E.H * 0.82 - 10 - Math.floor(i / 4) * 92, 0.4, { t, color: DOORC[i % 3], shine: 0 }); } });
    lbl(g, `${n}`, x, E.H * 0.16, 1, 110, j ? GOLD : CYAN, 'center'); text(g, sym, x, E.H * 0.82 - 440, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: '#ffffff', stroke: 6, strokeColor: '#0c1430' }); });
  if (burst > 0) { const r = rng(3); for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.2, d = burst * (300 + r() * 300); SH.car(g, E.W * 0.73 + Math.cos(a) * d, E.H * 0.5 + Math.sin(a) * d + 600 * burst * burst, 0.3, { t, color: DOORC[i % 3], shine: 0 }); } FX.sparkle(g, E.W * 0.73, E.H * 0.4, 80 * (1 - burst), '#ffffff', 1); }
}
registerShot('y02', { draw(g, t) { garages(g, t, ease.inOut(prog(t, 0.3, 3.4))); } });
// y03 — the switch garage overflows: cars pop out of the roof; the hero cheers
registerShot('y03', { draw(g, t) {
  garages(g, t, 1, prog(t, 0.2, 1.6));
  hero(g, { x: E.W * 0.5, y: E.H * 0.9, s: 1.8, facing: 1, t, pose: POSES.cheer, expr: 'joy', look: [1, -0.5] });
  lbl(g, '647 > 353', E.W * 0.5, E.H * 0.34, ease.outBack(prog(t, 0.8, 1.2)), 90, '#ffffff', 'center');
} });
