// shots/03_morning.js — morning discovery: the cracked bottle, confusion, the magnifier dives into the ice.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, linGrad, text } from '/engine/core.js';
import { POSES, walkPose, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { kitchen, KGY, FRIDGE, COUNTER_TOP, freezerInside } from '../sets/kitchen.js';
import { bottle, molecule, magnifier, qmark } from '../props.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';

const HS = 2.3, CRACKED = { crack: 1, ice: 1, frost: 1, mush: 1, bulge: 0.6 };

// m01 — golden morning, hero strolls in with a mug
registerShot('m01', { draw(g, t) {
  const cam = { z: 1.12, x: lerp(-60, 80, ease.inOut(t / 3.6)), y: -30 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0 });
  const walking = t < 2.6, x = lerp(-120, 980, ease.out(prog(t, 0, 2.6)));
  layer(g, cam, 1, (g) => {
    const pose = walking ? { ...walkPose(t * 1.5 * Math.PI * 2), eF: [20, -140], hF: [30, -150] } : P('holdFront', { hF: [34, -160], eF: [22, -134] });
    hero(g, { x, y: KGY(), s: HS, facing: 1, pose, t: walking ? null : t, breathe: !walking, expr: 'happy', prop: 'cup', rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
  });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 });
  FX.lensStreak(g, 500, 420, E.W * 1.1, '#ffe0b0', 0.2);
} });

// m02 — the freezer opens, mist rolls out
registerShot('m02', { draw(g, t) {
  const fz = ease.out(prog(t, 0.1, 0.7)), cam = { z: 1.45 + 0.05 * t, x: 330, y: -130 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0, freezer: fz, inside: freezerInside(CRACKED) });
  layer(g, cam, 1, (g) => {
    const pose = posesAt(t, [[0, P('reach', { hF: [70, -250], eF: [40, -205] })], [0.8, P('relaxed', { hF: [24, -110] })]]);
    hero(g, { x: FRIDGE.x - 150, y: KGY(), s: HS, facing: 1, t, pose, expr: t > 0.8 ? 'surprised' : 'happy', rim: { color: fz > 0.3 ? '#bff4ff' : M.rim, dir: [1, -0.3], w: 5 } });
  });
  FX.dust(g, t, { count: 50, color: '#eafaff', a: 0.4 });
} });

// m03 — giant shocked face (callback to the cold open), golden + cold rim
registerShot('m03', { draw(g, t) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.9, x: 300, y: -220 }, { mood: 'golden', lamp: 0, freezer: 1, inside: freezerInside(CRACKED) })); veil(g, '#1a0e14', 0.3);
  const z = 1 + 0.12 * ease.out(prog(t, 0, 0.3)), r = V(300, 330) * z;
  const [sx, sy] = shake(t, 5, 20);
  bigFace(g, E.W / 2 + sx, E.H * 0.6 + sy, r, { outfit: HERO, expr: 'shocked', rimColor: '#bff4ff', rimSide: 1, face: { sweat: true } });
  FX.rings(g, E.W / 2, E.H * 0.6, t, { count: 3, r0: r * 1.1, r1: r * 1.8, color: '#fff3e0', a: 0.35 * (1 - prog(t, 0, 1.5)) });
  for (const s of [-1, 1]) { const x = E.W / 2 + s * r * 1.25, y = E.H * 0.6 - r * 0.9; for (let i = 0; i < 3; i++) seg(g, [[x, y], [x + s * (40 + i * 12), y - 50 + i * 40]], 10, alpha('#ffd95a', ease.out(prog(t, 0.05, 0.3)))); }
} });

// m04 — hero lifts the cracked bottle into the light: the ice has pushed the cap off the neck
registerShot('m04', { draw(g, t) {
  const cam = { z: 1.9 + 0.06 * t, x: 60, y: -70, r: -0.015 + 0.008 * t };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0 });
  layer(g, cam, 1, (g) => {
    const lift = ease.out(prog(t, 0, 0.8));
    const pose = P('holdFront', { hF: [52, lerp(-150, -215, lift)], eF: [30, lerp(-140, -170, lift)] });
    const h = hero(g, { x: 940, y: KGY(), s: HS, facing: 1, t, pose, expr: 'awe', look: [0.6, -0.5], rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    bottle(g, h.hand[0] + 10, h.hand[1] + 70, { s: 0.55, ...CRACKED, rim: '#ffe2b0', tilt: 0.12 });
    for (let i = 0; i < 4; i++) { const a = t * 1.5 + i * 1.6; FX.sparkle(g, h.hand[0] + 10 + Math.cos(a) * 70, h.hand[1] - 40 + Math.sin(a) * 90, 14 + 6 * Math.sin(t * 5 + i), '#ffffff', 0.8); }
  });
  FX.godRays(g, 300, 200, { angle: Math.PI * 0.25, spread: 0.5, len: 1800, color: '#ffd9a0', a: 0.07, t });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 });
} });

// m05 — confused: scratches head, a ? pops above
registerShot('m05', { draw(g, t) {
  const cam = { z: 1.7, x: 60, y: -90 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0 });
  layer(g, cam, 1, (g) => {
    const ct = COUNTER_TOP();
    bottle(g, 1150, ct - 12, { s: 0.5, ...CRACKED, rim: '#ffe2b0' });
    const pose = posesAt(t, [[0, POSES.relaxed], [0.4, P('think', { hF: [22, -226], eF: [34, -186] })]]);
    const scratch = t > 0.4 ? Math.sin(t * 14) * 5 : 0; pose.hF = [pose.hF[0] + scratch, pose.hF[1]];
    const h = hero(g, { x: 900, y: KGY(), s: HS, facing: 1, t, pose, expr: 'confused', look: [0.8, 0.3], rim: { color: M.rim, dir: [-0.8, -0.5], w: 5 } });
    const pop = ease.outBack(prog(t, 0.9, 1.3)); if (pop > 0) { g.save(); g.translate(h.head[0] + 30, h.head[1] - 150); g.scale(pop, pop); qmark(g, 0, 0, 150); g.restore(); }
    const pop2 = ease.outBack(prog(t, 1.15, 1.5)); if (pop2 > 0) { g.save(); g.translate(h.head[0] + 140, h.head[1] - 100); g.scale(pop2 * 0.6, pop2 * 0.6); g.rotate(0.3); qmark(g, 0, 0, 150, 0.8); g.restore(); }
  });
} });

// m06 — the magnifier slides over the ice … and dives in
export function lattice(g, cx, cy, d, t, o = {}) {
  const cols = o.cols || 14, rows = o.rows || 10, rr2 = d * 0.3;
  for (let j = -rows; j <= rows; j++) for (let i = -cols; i <= cols; i++) {
    // two molecules per hex cell centre (pointy-top hex lattice vertices)
    const hx = cx + (i + (j & 1) * 0.5) * d * 1.732, hy = cy + j * d * 1.5;
    for (const [vx, vy] of [[0, -d], [d * 0.866, -d * 0.5]]) {
      const px = hx + vx, py = hy + vy; if (o.clip && Math.hypot(px - cx, py - cy) > o.clip) continue;
      molecule(g, px, py, rr2, (i * 1.3 + j) % 6 + t * 0.2, { alpha: o.alpha ?? 1 });
    }
  }
  if (o.bonds !== false) { g.strokeStyle = alpha('#9fe8ff', 0.35 * (o.alpha ?? 1)); g.lineWidth = d * 0.06;
    for (let j = -rows; j <= rows; j++) for (let i = -cols; i <= cols; i++) { const hx = cx + (i + (j & 1) * 0.5) * d * 1.732, hy = cy + j * d * 1.5; if (o.clip && Math.hypot(hx - cx, hy - cy) > o.clip + d) continue;
      g.beginPath(); for (let k = 0; k <= 6; k++) { const a = -Math.PI / 2 + k * Math.PI / 3; const px = hx + Math.cos(a) * d, py = hy + Math.sin(a) * d; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); } }
}
registerShot('m06', { draw(g, t) {
  const ct = COUNTER_TOP(), cam = { z: 3.2, x: 1150 - 960, y: ct - 150 - 540 };
  blurLayer(g, 3, (g) => kitchen(g, t, cam, { mood: 'golden', lamp: 0 }));
  layer(g, cam, 1, (g) => bottle(g, 1150, ct - 12, { s: 0.5, ...CRACKED, rim: '#ffe2b0' }));
  const slide = ease.out(prog(t, 0, 1.2)), dive = ease.in(prog(t, 2.2, 3.8));
  const lx = lerp(E.W + 300, E.W / 2 + 40, slide), ly = lerp(E.H * 0.6, E.H * 0.42, slide), R = lerp(V(190, 170), E.W * 0.9, dive);
  magnifier(g, lx, ly, R, (g) => {
    g.fillStyle = '#0a1a36'; g.fillRect(lx - R, ly - R, R * 2, R * 2);
    lattice(g, lx, ly, lerp(26, 70, dive), t, { cols: 10, rows: 8 });
    glow(g, lx, ly, R, '#9fe8ff', 0.2);
  });
  if (dive > 0.9) { g.fillStyle = alpha('#0a1a36', (dive - 0.9) * 10); g.fillRect(0, 0, E.W, E.H); }
} });
