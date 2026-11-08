// shots/06_lake.js — the winter lake (ice is a lid; fish live in 4 °C water below) and "what if ice sank?".
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, walkPose, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { lake, drifts, section, school, LGY } from '../sets/lake.js';
import { glass, iceCube, fish, breath, snowflake, qmark, ICE } from '../props.js';
import { hero, P, rightX } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl } from './02_night.js';

const WHERO = { ...HERO, head: 'hood' };
const HY = () => E.H * 0.9;
function bucket(g, x, y, s) { poly(g, [[x - 28 * s, y - 60 * s], [x + 28 * s, y - 60 * s], [x + 22 * s, y], [x - 22 * s, y]], '#3a6ea5'); seg(g, [[x - 28 * s, y - 60 * s], [x + 28 * s, y - 60 * s]], 5 * s, '#5a8ec5'); }
function hole(g, x, y, s) { g.fillStyle = '#1a3a6a'; g.beginPath(); g.ellipse(x, y, 46 * s, 12 * s, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 4 * s; g.stroke(); }
// sitting angler at (x,y) with rod; bend 0..1; returns rod tip
function angler(g, t, x, y, s, o = {}) {
  bucket(g, x, y, s);
  const pose = o.pose || P('sit', { hF: [46, -120], eF: [26, -112] });
  const h = hero(g, { x, y: y - 58 * s, s, facing: 1, t, pose, outfit: WHERO, expr: o.expr || 'smile', look: o.look || [0.6, 0.5], rim: { color: o.rim || '#ffc68a', dir: [0.8, -0.5], w: 4 } });
  const bend = o.bend || 0, tip = [h.hand[0] + 150 * s, h.hand[1] - (40 - 70 * bend) * s];
  g.strokeStyle = '#2a1a14'; g.lineWidth = 5 * s; g.beginPath(); g.moveTo(h.hand[0], h.hand[1]); g.quadraticCurveTo(h.hand[0] + 90 * s, h.hand[1] - 50 * s + 40 * bend * s, tip[0], tip[1]); g.stroke();
  breath(g, h.head[0] + 34 * s, h.head[1] + 6 * s, t, 1, 0.35);
  return { tip, h };
}

// l01 — establishing: frozen lake at dusk, snow
registerShot('l01', { draw(g, t) {
  const k = ease.inOut(t / 4.8), cam = { z: 1.0 + 0.06 * k, x: lerp(-80, 80, k), y: 0 };
  lake(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { hole(g, 1180, E.H * 0.84, 0.7); bucket(g, 1100, E.H * 0.84, 0.7); });
  drifts(g, cam); FX.snow(g, t, { count: 140, speed: 50 });
  FX.lensStreak(g, E.W * 0.68, LGY() - 40, E.W * 1.2, '#ffd0a0', 0.25);
} });

// l02 — hero walks onto the ice with rod and bucket; breath vapour
registerShot('l02', { draw(g, t) {
  const cam = { z: 1.35, x: lerp(-200, 40, ease.inOut(t / 4)), y: 120 };
  lake(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => {
    const x = lerp(300, 980, prog(t, 0, 4)), pose = { ...walkPose(t * 1.1 * Math.PI * 2, { stride: 22 }), eF: [16, -136], hF: [28, -150] };
    const h = hero(g, { x, y: HY(), s: 1.6, facing: 1, pose, outfit: WHERO, expr: 'happy', rim: { color: '#ffc68a', dir: [0.8, -0.5], w: 4 } });
    seg(g, [h.hand, [h.hand[0] + 160, h.hand[1] - 120]], 5, '#2a1a14');
    bucket(g, h.handB[0] - 4, h.handB[1] + 60, 0.9); seg(g, [[h.handB[0] - 25, h.handB[1] + 6], h.handB, [h.handB[0] + 17, h.handB[1] + 6]], 3, '#222');
    breath(g, h.head[0] + 40, h.head[1] + 8, t, 1, 0.4);
  });
  drifts(g, cam); FX.snow(g, t, { count: 160, speed: 60 });
} });

// l03 — calm: fishing through the hole
registerShot('l03', { draw(g, t) {
  const cam = { z: 1.7 + 0.04 * t, x: 40, y: 230 };
  lake(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { const hx = 1150, hy = HY(); hole(g, hx, hy + 6, 1); const a = angler(g, t, 900, hy, 1.4, {}); seg(g, [a.tip, [hx + 4, hy + 4]], 1.5, 'rgba(255,255,255,.7)'); });
  FX.snow(g, t, { count: 120, speed: 40 });
} });

// l04 — the camera sinks through the ice: 0 °C under the lid, 4 °C at the bottom, fish alive
registerShot('l04', { draw(g, t) {
  const k = ease.inOut(prog(t, 0.1, 2.2)), iceY = lerp(E.H * 0.92, 390, k);
  const sec = section(g, t, { iceY, iceH: 70 });
  // surface world above the ice (small, silhouetted against the sky)
  FX.pine(g, 200, iceY - 10, 0.8, '#1c1838'); FX.pine(g, 300, iceY - 10, 0.6, '#1c1838'); FX.pine(g, 1700, iceY - 10, 0.9, '#1c1838');
  const hx = 1030; g.fillStyle = '#1a3a6a'; g.fillRect(hx - 30, iceY - 10, 60, 80);
  const a = angler(g, t, 820, iceY - 8, 1.0, { rim: '#ffc68a' });
  seg(g, [a.tip, [hx, iceY + 10], [hx + 6, iceY + 300 + Math.sin(t * 2) * 6]], 1.5, 'rgba(255,255,255,.6)');
  school(g, t, [0, iceY + 160, E.W, sec.bottom - iceY - 320], 7, { seed: 5 });
  FX.drops(g, t * 0.3, { count: 30, color: '#bfe8ff', rMax: 5, drift: 6, area: [0, iceY + 80, E.W, E.H] });
  const a1 = ease.out(prog(t, 2.4, 2.8)), a2 = ease.out(prog(t, 3.4, 3.8));
  lbl(g, '0 °C', E.W - V(110, 70), iceY + 130, a1, V(70, 74), '#dff8ff', 'right');
  lbl(g, '4 °C', E.W - V(110, 70), E.H - 150, a2, V(70, 74), '#ffd95a', 'right');
} });

// l05 — blueprint of the lake: −20 °C air, ice lid, 0 °C, 4 °C water (densest) at the bottom
registerShot('l05', { draw(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.07 }); const c = '#8fd8ff';
  const L = 360, R = E.W - 360, top = 320, iceH = 60, bot = E.H - 130;
  // basin outline
  g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.moveTo(L - 80, top); g.quadraticCurveTo(L, bot + 40, E.W / 2, bot); g.quadraticCurveTo(R, bot + 40, R + 80, top); g.stroke();
  g.save(); g.beginPath(); g.moveTo(L - 80, top); g.quadraticCurveTo(L, bot + 40, E.W / 2, bot); g.quadraticCurveTo(R, bot + 40, R + 80, top); g.closePath(); g.clip();
  g.fillStyle = linGrad(g, 0, top, 0, bot, [alpha('#9fe0ff', 0.25), alpha('#2a6ac0', 0.45)]); g.fillRect(0, top, E.W, bot - top + 60);
  const ik = ease.out(prog(t, 0.3, 1.0)); g.fillStyle = alpha('#eafaff', 0.85 * ik); g.fillRect(0, top, E.W, iceH * ik);
  // sinking 4 °C water arrows
  for (let i = 0; i < 5; i++) { const x = L + 120 + i * 210, ph = (t * 0.5 + i * 0.2) % 1, y = lerp(top + 120, bot - 80, ph); const a = Math.sin(ph * Math.PI) * prog(t, 1.2, 1.6); seg(g, [[x, y - 40], [x, y + 20]], 8, alpha('#ffd95a', a)); poly(g, [[x, y + 46], [x - 18, y + 16], [x + 18, y + 16]], alpha('#ffd95a', a)); }
  g.restore();
  snowflake(g, E.W / 2, 190, 44, '#dff8ff', 7, t * 0.4);
  lbl(g, '−20 °C', E.W / 2 + 90, 190, ease.out(prog(t, 0.2, 0.6)), V(60, 64), '#dff8ff', 'left');
  lbl(g, '0 °C', R - 40, top + 110, ease.out(prog(t, 1.0, 1.4)), V(56, 60), '#dff8ff', 'right');
  lbl(g, '4 °C', R - 140, bot - 70, ease.out(prog(t, 1.6, 2.0)), V(56, 60), '#ffd95a', 'right');
  school(g, t, [L + 100, bot - 240, R - L - 200, 120], 3, { seed: 9 });
  // the lid keeps the water liquid: shield arcs over the fish
  const sh = ease.out(prog(t, 2.8, 3.4)); if (sh > 0) { g.strokeStyle = alpha('#5fe0a8', 0.7 * sh); g.lineWidth = 6; g.beginPath(); g.arc(E.W / 2, top + iceH + 20, 360 * sh, 0.15, Math.PI - 0.15); g.stroke(); }
} });

// l06 — a bite! hero pulls a fish, cheers, lets it go
registerShot('l06', { draw(g, t) {
  const cam = { z: 1.7, x: 40, y: 230 };
  lake(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => {
    const hx = 1150, hy = HY(); hole(g, hx, hy + 6, 1);
    const bend = t < 0.6 ? 0 : t < 1.6 ? 0.6 + 0.3 * Math.sin(t * 25) : Math.max(0, 0.6 - (t - 1.6) * 2);
    const cheer = t > 2.0 && t < 3.2, pose = cheer ? P('sit', { hF: [30, -230], eF: [24, -190], hB: [-24, -230], eB: [-20, -190] }) : P('sit', { hF: [46, -120 - 20 * bend], eF: [26, -112] });
    const a = angler(g, t, 900, hy, 1.4, { bend, pose, expr: cheer ? 'joy' : t > 0.6 ? 'surprised' : 'smile' });
    const fk = prog(t, 1.6, 2.3), fx = lerp(hx, hx - 40, fk), fy = hy - Math.sin(fk * Math.PI) * 260 - fk * 80;
    if (t > 1.6 && t < 3.0) { seg(g, [a.tip, [fx, fy - 20]], 1.5, 'rgba(255,255,255,.7)'); fish(g, fx, fy, 70, -1, t * 3, { color: '#ff9a4a' }); }
    else if (t >= 3.0) { const k = prog(t, 3.0, 3.4); if (k < 1) fish(g, hx, lerp(fy, hy, k), 70, 1, t * 3, { color: '#ff9a4a' }); FX.rings(g, hx, hy + 6, t - 3.3, { count: 2, r0: 20, r1: 90, color: '#ffffff', a: 0.6 * (1 - prog(t, 3.3, 3.8)) }); }
    else seg(g, [a.tip, [hx + 4, hy + 4]], 1.5, 'rgba(255,255,255,.7)');
  });
  FX.snow(g, t, { count: 120, speed: 40 });
} });

// w01 — glitch: what if ice SANK?
function glitch(g, t, amt) { if (E.crop) return; const r = rng(Math.floor(t * 20)); for (let i = 0; i < 8; i++) { const y = r() * E.H, h = 6 + r() * 40, dx = (r() - 0.5) * 120 * amt; g.drawImage(g.canvas, 0, y * E.PX, g.canvas.width, h * E.PX, dx, y, E.W, h); } }
registerShot('w01', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0a1e', '#3a1028']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const gx = E.W / 2, gy = E.H - 60, h = 820, wl = 0.75, wTop = gy - h * wl;
  const sink = ease.inOut(prog(t, 0.3, 1.5)), cy = lerp(wTop + 70, gy - 100, sink) + (t > 1.5 ? Math.sin((t - 1.5) * 20) * 6 * Math.exp(-(t - 1.5) * 5) : 0);
  glass(g, gx, gy, h, wl, (g) => iceCube(g, gx, cy, 95, { rot: 0.1 }));
  for (const [dx, col] of [[-8, 'rgba(255,40,90,.25)'], [8, 'rgba(40,220,255,.25)']]) { g.save(); g.globalCompositeOperation = 'lighter'; g.translate(dx, 0); rr(g, gx - 95, cy - 95, 190, 190, 26); g.fillStyle = col; g.fill(); g.restore(); }
  const qa = ease.outBack(prog(t, 1.6, 2.0)); if (qa > 0) { g.save(); g.translate(Math.min(gx + 360, rightX(200)), E.H * 0.35); g.scale(qa, qa); g.rotate(Math.sin(t * 3) * 0.1); qmark(g, 0, 0, 260, 1, '#ff5a7a'); g.restore(); }
  glitch(g, t, t < 0.4 ? 1 : 0.15);
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,40,90,.3)'; g.fillRect(0, 0, E.W, E.H); g.restore();
} });

// w02 — storm: every winter the ice sinks and piles up — the lake freezes from the bottom
registerShot('w02', { draw(g, t) {
  const iceY = 300, bottom = E.H + 40, k = ease.inOut(prog(t, 0.3, 5.6)), stackH = k * (bottom - iceY - 60);
  const sec = section(g, t, { iceY, iceH: 40, bottom, mood: 'storm' });
  if (t > 3.0 && t < 3.25) FX.lightning(g, { seed: 4, x1: E.W * 0.7, y1: -20, x2: E.W * 0.6, y2: iceY - 10, a: 1 });
  // the stack of sunken ice
  g.fillStyle = linGrad(g, 0, bottom - stackH, 0, bottom, ['#cfefff', '#8fc0dc']); g.fillRect(-E.W, bottom - stackH, E.W * 3, stackH + 400);
  for (let j = 0; j < 8; j++) { const y = bottom - stackH * (j / 8); seg(g, [[-100, y], [E.W + 100, y]], 4, 'rgba(255,255,255,.7)'); for (let i = 0; i < 9; i++) { const x = ((i * 240 + j * 120) % (E.W + 240)) - 120; seg(g, [[x, y], [x, y - stackH / 8]], 3, 'rgba(90,140,170,.5)'); } }
  g.fillStyle = 'rgba(30,60,90,.25)'; g.fillRect(-E.W, bottom - stackH, E.W * 3, stackH + 400);
  // slab currently sinking
  const ph = (t % 1.0), sy = lerp(iceY + 40, bottom - stackH - 40, ease.in(ph));
  if (stackH < bottom - iceY - 100) { rr(g, E.W * 0.15, sy, E.W * 0.7, 40, 10); g.fillStyle = alpha('#eafaff', 0.9); g.fill(); }
  const free = Math.max(80, bottom - stackH - iceY - 160);
  school(g, t, [0, iceY + 80, E.W, free], Math.max(1, Math.round(6 * (1 - k * 0.8))), { seed: 5 });
  FX.rain(g, t, { count: 160, area: [-100, -100, E.W + 200, iceY + 100], a: 0.25 });
  snowflake(g, V(120, 90), V(170, 230), 34, '#dff8ff', 6, t);
  lbl(g, '× ' + (1 + Math.floor(k * 4.99)), V(180, 150), V(170, 230), 1, V(70, 74), '#dff8ff', 'left');
} });

// w03 — a fish trapped in solid ice
registerShot('w03', { draw(g, t) {
  const cam = { z: 1.0 + 0.06 * t };
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#8fc0dc', '#4a7a9a', '#22445e']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    const r = rng(3); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { let x = r() * E.W, y = r() * E.H; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 200; y += (r() - 0.5) * 200; g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 40; i++) circle(g, r() * E.W, r() * E.H, 3 + r() * 8, 'rgba(255,255,255,.5)');
    fish(g, E.W / 2, E.H / 2, 360, 1, 0, { color: '#b87a5a' });
    g.fillStyle = 'rgba(200,235,255,.35)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 5; i++) circle(g, E.W / 2 + 200 + i * 14, E.H / 2 - 80 - i * 40, 8 + i * 2, 'rgba(255,255,255,.75)');
  });
  veil(g, '#05101e', 0.25 + 0.15 * prog(t, 0, 3.4));
} });

// w04 — hero's giant face: scared, storm light
registerShot('w04', { draw(g, t) {
  backdrop(g, ['#070a1a', '#141c3a']);
  const fl = (t > 0.8 && t < 0.95) || (t > 1.1 && t < 1.2);
  if (fl) { g.fillStyle = 'rgba(220,230,255,.35)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  const r = V(300, 330) * (1 + 0.05 * t), [sx, sy] = shake(t, 3, 20);
  bigFace(g, E.W / 2 + sx, E.H * 0.6 + sy, r, { outfit: WHERO, expr: 'scared', rimColor: fl ? '#ffffff' : '#a9b8ff', rimSide: -1, face: { sweat: true } });
  FX.rain(g, t, { count: 200, a: 0.18 });
} });

// w05 — the whole planet ices over, pole to pole
registerShot('w05', { draw(g, t) {
  backdrop(g, ['#02030a', '#060a1a']); FX.stars(g, t, { count: 220, area: [0, 0, E.W, E.H] });
  const cx = E.W / 2, cy = E.H / 2 + 20, R = V(360, 380) * (1 + 0.03 * t), k = ease.inOut(prog(t, 0.3, 3.6));
  glow(g, cx, cy, R * 1.35, mix('#4aa0ff', '#dff8ff', k), 0.35);
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
  g.fillStyle = radGrad(g, cx - R * 0.3, cy - R * 0.3, R * 0.1, R * 1.2, ['#4aa8e8', '#1f5aa8', '#0a2050']); g.fillRect(cx - R, cy - R, R * 2, R * 2);
  for (let i = 0; i < 9; i++) { const ax = cx + ((i * 173 + t * 40) % (R * 3)) - R * 1.5, ay = cy + Math.sin(i * 2.3) * R * 0.5; g.fillStyle = '#3f8a4a'; g.beginPath(); g.ellipse(ax, ay, R * (0.18 + (i % 3) * 0.08), R * (0.12 + (i % 2) * 0.08), i, 0, Math.PI * 2); g.fill(); }
  const cap = R * (0.25 + 0.8 * k);
  g.fillStyle = '#f2fbff'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx - R, cy + s * R); for (let x = -R; x <= R; x += 20) g.lineTo(cx + x, cy + s * (R - cap) + s * noise(x * 0.02 + t, s + 3) * 30); g.lineTo(cx + R, cy + s * R); g.closePath(); g.fill(); }
  g.fillStyle = radGrad(g, cx + R * 0.4, cy + R * 0.4, R * 0.2, R * 1.1, ['rgba(0,0,0,0)', 'rgba(0,0,10,.6)']); g.fillRect(cx - R, cy - R, R * 2, R * 2);
  g.restore(); ring(g, cx, cy, R, 4, alpha('#bfe8ff', 0.6));
} });

// w06 — back to reality: ice floats, the fish are fine
registerShot('w06', { draw(g, t) {
  const sec = section(g, t, { iceY: 390, iceH: 70 });
  FX.pine(g, 200, 380, 0.8, '#1c1838'); FX.pine(g, 1700, 380, 0.9, '#1c1838');
  const a = angler(g, t, 820, 382, 0.9, { expr: 'happy' });
  school(g, t, [0, 540, E.W, E.H - 660], 8, { seed: 11 });
  const ck = ease.outBack(prog(t, 0.6, 1.1));
  if (ck > 0) { g.save(); g.translate(rightX(V(200, 150)), V(190, 260)); g.scale(ck, ck); circle(g, 0, 0, 70, '#5fe0a8'); seg(g, [[-32, 2], [-8, 26], [36, -24]], 16, '#ffffff'); g.restore(); }
} });
