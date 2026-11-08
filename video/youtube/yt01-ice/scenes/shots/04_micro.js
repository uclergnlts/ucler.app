// shots/04_micro.js — inside the ice: liquid molecules jostle, slow down, snap into hexagons with empty space → +9 % volume.
import { E, V, registerShot, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { molecule, bottle, thermometer, drop, snowflake, ICE } from '../props.js';
import { HERO } from '../cast.js';
import { lattice } from './03_morning.js';
import { lbl } from './02_night.js';

export function microBg(g, t, warm = 0) {
  g.fillStyle = radGrad(g, E.W / 2, E.H / 2, 0, E.W * 0.8, [mix('#12204a', '#3a1e3a', warm), mix('#0a1230', '#1e1028', warm), '#05081a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = rng(77); for (let i = 0; i < 40; i++) { const x = (r() * E.W + t * 12 * (r() - 0.5)), y = r() * E.H; glow(g, x, y, 20 + r() * 50, mix('#6fa8ff', '#ff9a7a', warm), 0.08); }
}
// lattice vertices (pointy-top honeycomb), sorted from the centre outwards
function vertices(cx, cy, d, R) {
  const out = [];
  for (let j = -8; j <= 8; j++) for (let i = -8; i <= 8; i++) {
    const hx = cx + (i + (j & 1) * 0.5) * d * 1.732, hy = cy + j * d * 1.5;
    for (const [vx, vy] of [[0, -d], [d * 0.866, -d * 0.5]]) { const x = hx + vx, y = hy + vy; if (Math.hypot((x - cx) / 1.6, y - cy) < R) out.push([x, y]); }
  }
  return out.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy));
}
function hexCentres(cx, cy, d, R) { const out = []; for (let j = -8; j <= 8; j++) for (let i = -8; i <= 8; i++) { const x = cx + (i + (j & 1) * 0.5) * d * 1.732, y = cy + j * d * 1.5; if (Math.hypot((x - cx) / 1.6, y - cy) < R - d) out.push([x, y]); } return out; }
const D = 74, CX = 960, CY = 560, RAD = 330;
const VERTS = vertices(CX, CY, D, RAD), N = VERTS.length;
// liquid home positions: random, a bit denser than the lattice
const HOME = (() => { const r = rng(5); return VERTS.map(() => { const a = r() * Math.PI * 2, rr2 = Math.sqrt(r()) * RAD * 0.92; return [CX + Math.cos(a) * rr2 * 1.6, CY + Math.sin(a) * rr2]; }); })();
function liquidPos(i, ph) { const [x, y] = HOME[i]; return [x + noise(ph + i * 3.1, i) * 70, y + noise(ph + i * 3.1, i + 40) * 70]; }
const SP = (t) => lerp(1.3, 0.25, ease.inOut(prog(t, 0.1, 3.6)));
function phaseX02(t) { let p = 4.4 * 1.3; const n = 80, dt = t / n; for (let k = 0; k < n; k++) p += SP((k + 0.5) * dt) * dt; return p; }
const PH_END = phaseX02(4.0);
function drawLiquid(g, ph, warm, t) {
  const P = HOME.map((_, i) => liquidPos(i, ph));
  // flickering hydrogen bonds between close neighbours
  g.lineWidth = 3; g.setLineDash([6, 8]);
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d < 95) { const f = 0.5 + 0.5 * Math.sin(ph * 7 + i * 7 + j); g.strokeStyle = alpha('#9fe8ff', 0.25 * f); g.beginPath(); g.moveTo(...P[i]); g.lineTo(...P[j]); g.stroke(); } }
  g.setLineDash([]);
  P.forEach((p, i) => molecule(g, p[0], p[1], 22, ph * 2.2 + i, { glowC: warm > 0.5 ? '#ff9a7a' : null }));
  return P;
}

// x01 — liquid water at 20 °C: molecules tumble and slide past each other
registerShot('x01', { draw(g, t) {
  const cam = { z: 1.15 - 0.04 * t, r: 0.01 * Math.sin(t) };
  microBg(g, t, 0.7);
  layer(g, cam, 1, (g) => drawLiquid(g, t * 1.3, 0.7, t));
  lbl(g, '20 °C', E.W - V(110, 80), V(160, 230), ease.out(prog(t, 0.3, 0.7)), V(80, 86), '#ff9a7a', 'right');
  drop(g, V(150, 100), V(170, 240), 34, '#5fc0ff');
} });

// x02 — cooling: 20 → 0 °C, the dance slows down
registerShot('x02', { draw(g, t) {
  const k = ease.inOut(prog(t, 0.1, 3.6)), temp = Math.round(lerp(20, 0, k)), ph = phaseX02(t);
  microBg(g, t, 0.7 * (1 - k));
  layer(g, { z: 1.11 + 0.02 * t }, 1, (g) => drawLiquid(g, ph, 0.7 * (1 - k), t));
  thermometer(g, V(150, 110), E.H - 140, 520, 1 - k * 0.6, { color: temp > 4 ? '#ff6a5a' : '#5fd0ff' });
  lbl(g, `${temp} °C`, E.W - V(110, 80), V(160, 230), 1, V(80, 86), mix('#ff9a7a', '#9fe8ff', k), 'right');
  if (temp === 0) FX.rings(g, E.W - V(220, 160), V(160, 230), t, { count: 2, r0: 40, r1: 180, color: '#9fe8ff', a: 0.5 });
} });

// x03 — at 0 °C each molecule locks into place: hexagons appear
function snapState(t, i) { const st = 0.5 + (i / N) * 3.9; return ease.outBack(prog(t, st, st + 0.35)); }
function drawFreezing(g, t, frozenPh = PH_END) {
  const pos = VERTS.map((v, i) => { const k = snapState(t, i), l = liquidPos(i, frozenPh + 0.25 * Math.min(t, 4)); return [lerp(l[0], v[0], k), lerp(l[1], v[1], k), k]; });
  // hexagon edges when both ends have landed
  g.lineWidth = 6; g.lineCap = 'round';
  for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) { const d = Math.hypot(VERTS[a][0] - VERTS[b][0], VERTS[a][1] - VERTS[b][1]); if (Math.abs(d - D) < 2) { const k = Math.min(pos[a][2], pos[b][2]); if (k > 0.9) { g.strokeStyle = alpha('#9fe8ff', 0.55 * prog(k, 0.9, 1)); g.beginPath(); g.moveTo(pos[a][0], pos[a][1]); g.lineTo(pos[b][0], pos[b][1]); g.stroke(); } } }
  pos.forEach((p, i) => { molecule(g, p[0], p[1], 22, i * 1.7 + (1 - p[2]) * 3, {}); const st = 0.5 + (i / N) * 3.9; if (t > st + 0.2 && t < st + 0.7) ring(g, p[0], p[1], 22 + (t - st - 0.2) * 120, 3, alpha('#dff8ff', 1 - (t - st - 0.2) * 2)); });
}
registerShot('x03', { draw(g, t) {
  const cam = { z: 1.13 - 0.03 * t };
  microBg(g, t, 0);
  layer(g, cam, 1, (g) => drawFreezing(g, t));
  lbl(g, '0 °C', E.W - V(110, 80), V(160, 230), 1, V(80, 86), '#9fe8ff', 'right');
  snowflake(g, V(150, 100), V(170, 240), 38, '#dff8ff', 6, t * 0.5);
} });

// x04 — pull out: the crystal is full of empty hexagonal holes
registerShot('x04', { draw(g, t) {
  const z = lerp(1.0, 0.62, ease.inOut(prog(t, 0, 2.6)));
  microBg(g, t, 0);
  layer(g, { z }, 1, (g) => {
    const d = D; lattice(g, CX, CY, d, 0, { cols: 14, rows: 10, alpha: 1 });
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    for (let j = -10; j <= 10; j++) for (let i = -14; i <= 14; i++) { const x = CX + (i + (j & 1) * 0.5) * d * 1.732, y = CY + j * d * 1.5; const k = prog(t, 1.2 + Math.hypot(i, j) * 0.08, 1.8 + Math.hypot(i, j) * 0.08);
      if (k > 0) { g.beginPath(); for (let q = 0; q <= 6; q++) { const a = -Math.PI / 2 + q * Math.PI / 3; g.lineTo(x + Math.cos(a) * d * 0.6, y + Math.sin(a) * d * 0.6); } g.fillStyle = alpha('#5fe8ff', 0.4 * k * (0.6 + 0.4 * pulse)); g.fill(); } }
  });
  if (t > 1.6) for (let i = 0; i < 6; i++) FX.sparkle(g, E.W * (0.2 + i * 0.13), E.H * (0.3 + (i % 3) * 0.2), 20, '#dff8ff', 0.7 * (0.5 + 0.5 * Math.sin(t * 5 + i)));
} });

// x05 — same molecules, two boxes: liquid 1.00 L vs ice 1.09 L
function box(g, x, y, w, h, col) { g.strokeStyle = col; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w, y - h); g.stroke(); }
registerShot('x05', { draw(g, t) {
  microBg(g, t, 0.2);
  const by = E.H - 170, w = 520, h0 = 600, grow = ease.inOut(prog(t, 2.2, 3.6)), h1 = h0 * (1 + 0.09 * grow);
  const lx = V(260, 60), rx = E.W - V(260, 60) - w;
  const inA = ease.out(prog(t, 0, 0.6));
  g.save(); g.globalAlpha *= inA;
  // left: liquid, packed randomly
  g.fillStyle = alpha('#3f9ad6', 0.18); g.fillRect(lx, by - h0, w, h0); box(g, lx, by, w, h0, '#8fd8ff');
  const r = rng(12); for (let i = 0; i < 30; i++) { const x = lx + 45 + r() * (w - 90) + noise(t + i, i) * 18, y = by - 45 - r() * (h0 - 90) + noise(t + i, i + 9) * 18; molecule(g, x, y, 20, r() * 6 + t * 2); }
  // right: ice lattice — same number of molecules, but with holes
  g.fillStyle = alpha('#cfefff', 0.14); g.fillRect(rx, by - h1, w, h1); box(g, rx, by, w, h1, '#dff8ff');
  g.save(); g.beginPath(); g.rect(rx, by - h1, w, h1); g.clip();
  lattice(g, rx + w / 2, by - h1 / 2, 58 * (1 + 0.09 * grow * 0.5), 0, { cols: 4, rows: 4 }); g.restore();
  g.restore();
  drop(g, lx + w / 2, by - h0 - 90, 40, '#5fc0ff'); snowflake(g, rx + w / 2, by - h1 - 90, 46, '#dff8ff', 7, t * 0.3);
  // reference line at the liquid height
  g.setLineDash([16, 12]); seg(g, [[lx, by - h0], [rx + w + 30, by - h0]], 3, alpha('#ffffff', 0.5 * inA)); g.setLineDash([]);
  if (grow > 0) { g.fillStyle = alpha('#ffd95a', 0.35 * grow); g.fillRect(rx, by - h1, w, h1 - h0); }
  const vis = (x) => (E.crop ? clamp(1 - Math.max(0, E.crop[0] - x, x - E.crop[1]) / 120) : 1);   // in a 9:16 re-frame, show only the box in view
  lbl(g, '1.00 L', lx + w / 2, by + 70, inA * vis(lx + w / 2), V(64, 70), '#8fd8ff', 'center');
  lbl(g, (1 + 0.09 * grow).toFixed(2) + ' L', rx + w / 2, by + 70, inA * vis(rx + w / 2), V(64, 70), '#dff8ff', 'center');
  const pop = ease.outBack(prog(t, 3.6, 4.0)); if (pop > 0) { g.save(); g.translate(E.W / 2, E.H * 0.42); g.scale(pop, pop); lbl(g, '+9%', 0, 0, 1, V(150, 140), '#ffd95a', 'center'); g.restore(); FX.rings(g, E.W / 2, E.H * 0.42, t - 3.6, { count: 2, r0: 80, r1: 300, color: '#ffd95a', a: 0.4 * (1 - prog(t, 3.6, 4.6)) }); }
} });

// x06 — back in the bottle: no room to grow → walls bulge, the neck pushes out, the plastic splits
registerShot('x06', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.08 });
  const k = ease.inOut(prog(t, 0.3, 2.9)), cr = ease.out(prog(t, 3.0, 3.25));
  const [sx, sy] = t > 3 ? shake(t, 10 * (1 - prog(t, 3, 3.8)), 30) : [0, 0];
  layer(g, { z: 1.02 + 0.03 * t, x: sx, y: sy }, 1, (g) => {
    const bx = E.W / 2, by = E.H - 90;
    glow(g, bx, by - 300, 420, '#8fd8ff', 0.12 + 0.12 * k);
    bottle(g, bx, by, { s: 2.3, fill: 1, ice: k, frost: k * 0.6, bulge: k, mush: k * 0.7, crack: cr });
    const a = prog(t, 0.6, 1.2);
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) { const y = by - 120 - i * 140, x = bx + side * (150 + 30 * k);
      seg(g, [[x, y], [x + side * 90, y]], 12, alpha('#ffd95a', a)); poly(g, [[x + side * 120, y], [x + side * 82, y - 26], [x + side * 82, y + 26]], alpha('#ffd95a', a)); }
    const up = prog(t, 1.4, 2.0); seg(g, [[bx + 90, by - 600], [bx + 90, by - 720]], 12, alpha('#ffd95a', up)); poly(g, [[bx + 90, by - 750], [bx + 64, by - 712], [bx + 116, by - 712]], alpha('#ffd95a', up));
  });
  lbl(g, '+9%', V(260, 180), E.H * 0.45, ease.out(prog(t, 0.6, 1.0)), V(110, 110), '#ffd95a', 'center');
  if (t > 3.0 && t < 3.2) { g.fillStyle = `rgba(255,255,255,${0.8 * (1 - (t - 3) / 0.2)})`; g.fillRect(0, 0, E.W, E.H); }
} });

// x07 — hero's giant face: awe, the honeycomb reflected in his eyes
registerShot('x07', { draw(g, t) {
  blurLayer(g, 10, (g) => { microBg(g, t, 0); lattice(g, CX, CY, 60, t, { cols: 16, rows: 10, alpha: 0.7 }); });
  veil(g, '#05081a', 0.35);
  const r = V(300, 330) * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.6;
  bigFace(g, cx, cy, r, { outfit: HERO, expr: 'awe', rimColor: '#9fe8ff', rimSide: -1, look: [0, -0.2] });
  for (const s of [-1, 1]) { const ex = cx + s * r * 0.34, ey = cy - r * 0.16; g.strokeStyle = alpha('#9fe8ff', 0.9); g.lineWidth = 3; g.beginPath(); for (let q = 0; q <= 6; q++) { const a = -Math.PI / 2 + q * Math.PI / 3 + t * 0.4; g.lineTo(ex + Math.cos(a) * r * 0.1, ey + Math.sin(a) * r * 0.1); } g.stroke(); }
  for (let i = 0; i < 5; i++) { const a = t * 0.8 + i * 1.25; FX.sparkle(g, cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r * 0.9, 18, '#dff8ff', 0.6); }
} });
