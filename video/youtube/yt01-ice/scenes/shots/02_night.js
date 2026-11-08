// shots/02_night.js — the night before: bottle filled to the brim, into the freezer, lights out, the slow freeze, CRACK.
import { E, V, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text, measure } from '/engine/core.js';
import { POSES, walkPose, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, KGY, FRIDGE, SINK_X, COUNTER_TOP, freezerInside } from '../sets/kitchen.js';
import { bottle, thermometer, ICE, WATER } from '../props.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { shards } from './01_open.js';

const HS = 2.3, FZX = FRIDGE.x + FRIDGE.w / 2;
const lbl = (g, str, x, y, a = 1, size = V(64, 72), color = '#ffffff', align = 'left') => {
  if (E.crop) { const w = measure(g, str, size, 'Nunito', 900), L = align === 'left' ? x : align === 'right' ? x - w : x - w / 2, L2 = clamp(L, E.crop[0] + 30, E.crop[1] - 30 - w); x += L2 - L; }   // keep labels inside a 9:16 re-frame
  text(g, str, x, y, { size, font: 'Nunito', weight: 900, align, color, stroke: 7, strokeColor: '#0c1430', alpha: a });
};
export { lbl };

// n01 — the city at night, push in on one warm window
registerShot('n01', { draw(g, t) {
  const k = ease.inOut(t / 4), cam = { z: lerp(1, 1.9, k), x: lerp(0, 260, k), y: lerp(0, -40, k) };
  const M = mood('night');
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#050a1e', '#111a44', '#2a2f66']); FX.stars(g, t, { count: 180, area: [-400, -300, E.W + 800, E.H * 0.7] }); FX.moon(g, E.W * 0.2, E.H * 0.18, 40, '#eef2ff'); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: E.H * 0.75, w: E.W * 3, minH: 120, maxH: 420, color: '#0e1430', windowColor: '#ffc870', lit: 0.25, seed: 21 }));
  layer(g, cam, 0.6, (g) => FX.skyline(g, { x: -E.W, y: E.H * 0.95, w: E.W * 3, minH: 200, maxH: 520, color: '#0a0e24', windowColor: '#ffb860', lit: 0.3, seed: 33, minW: 80, maxW: 160 }));
  layer(g, cam, 1, (g) => {
    const bx = 860, bw = 640, top = 260; // hero's apartment block
    g.fillStyle = linGrad(g, bx, 0, bx + bw, 0, ['#1c2048', '#262a58', '#161a3c']); g.fillRect(bx, top, bw, E.H * 2);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
      const wx = bx + 50 + i * 150, wy = top + 50 + j * 130, isHero = i === 2 && j === 1, on = isHero || ((i * 7 + j * 3) % 5 === 0);
      rr(g, wx, wy, 90, 80, 4); g.fillStyle = on ? (isHero ? '#ffd27a' : '#e8a050') : '#0c1028'; g.fill();
      if (on) glow(g, wx + 45, wy + 40, isHero ? 160 : 90, '#ffc870', isHero ? 0.45 : 0.2);
      if (isHero) { seg(g, [[wx + 45, wy], [wx + 45, wy + 80]], 4, '#3a2a30'); seg(g, [[wx, wy + 40], [wx + 90, wy + 40]], 4, '#3a2a30');
        // tiny silhouette crossing the window
        const px = wx + 10 + ((t * 30) % 70); circle(g, px, wy + 38, 9, '#1a1020'); rr(g, px - 9, wy + 46, 18, 34, 6); g.fillStyle = '#c99a1a'; g.fill(); }
    }
    g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(bx, top, 6, E.H * 2);
  });
  FX.fog(g, E.H * 0.7, 300, '#3a4270', 0.25);
} });

// n02 — night kitchen, hero walks in carrying the full bottle
registerShot('n02', { draw(g, t) {
  const cam = { z: 1.08, x: lerp(-40, 60, ease.inOut(t / 4.2)), y: -20 };
  const { M } = kitchen(g, t, cam, { mood: 'night', lamp: 1 });
  const walk = prog(t, 0, 2.9), x = lerp(-120, 820, ease.out(walk)), walking = t < 2.9;
  layer(g, cam, 1, (g) => {
    const pose = walking ? walkPose(t * 1.4 * Math.PI * 2) : posesAt(t - 2.9, [[0, POSES.stand], [0.3, P('holdFront', { hF: [40, -150] })]]);
    const pz = { ...pose, eF: [18, -138], hF: [34, -122] };
    const h = hero(g, { x, y: KGY(), s: HS, facing: 1, pose: walking ? pz : pose, t: walking ? null : t, breathe: !walking, expr: t > 3.2 ? 'smile' : 'neutral', rim: { color: M.practical, dir: [-0.6, -0.8], w: 4 } });
    bottle(g, h.hand[0] + 6, h.hand[1] + 50, { s: 0.42, fill: 1 });
  });
} });

// n03 — close-up at the sink: water up to the very top, cap twisted on, 1.00 L
registerShot('n03', { draw(g, t) {
  const ct = COUNTER_TOP(), cam = { z: 4.4 + 0.15 * t, x: SINK_X + 10 - 960, y: ct - 70 - 540 };
  blurLayer(g, 4, (g) => kitchen(g, t, cam, { mood: 'night', lamp: 1 }));
  layer(g, cam, 1, (g) => {
    const bx = SINK_X + 10, by = ct - 12, fill = lerp(0.82, 1, ease.out(prog(t, 0, 1.3)));
    if (t < 1.3) seg(g, [[SINK_X + 10, ct - 92], [bx, by - 120]], 7, alpha('#8fd0ff', 0.75));
    const capY = lerp(-90, 0, ease.out(prog(t, 1.5, 2.2))), turn = prog(t, 1.8, 2.6);
    const b = bottle(g, bx, by, { s: 0.42, fill, capOff: true, rim: '#ffd59a' });
    // cap held by fingers, twisting
    const cx = bx, cy = b.top + capY; rr(g, cx - 10, cy - 10, 20, 10, 2.5); g.fillStyle = '#e5466f'; g.fill(); for (let i = 0; i < 4; i++) g.fillRect(cx - 9 + ((i * 5 + turn * 20) % 18), cy - 9, 1.5, 8);
    seg(g, [[cx + 14, cy - 8], [cx + 60, cy - 50], [cx + 140, cy - 60]], 14, '#0c0b18'); seg(g, [[cx + 70, cy - 54], [cx + 160, cy - 64]], 20, HERO.color);
    circle(g, cx + 12, cy - 8, 8, '#0c0b18'); circle(g, cx - 12, cy - 8, 6, '#0c0b18');
    const a = ease.out(prog(t, 2.5, 2.9));
    if (a > 0) { UI.dimension(g, t, { x1: bx - 40, y1: by - 4, x2: bx - 40, y2: b.top + 4, str: '', start: 2.5, color: '#ffd95a' }); }
  });
  const a = ease.out(prog(t, 2.6, 3.0)); if (a > 0) lbl(g, '1.00 L', E.W * 0.5 - V(330, 260), E.H * 0.5, a, V(84, 88), '#ffd95a', 'right');
  FX.dust(g, t, { count: 20, color: '#ffe9c0', a: 0.3 });
} });

// n04 — hero opens the freezer; cold light on his face
registerShot('n04', { draw(g, t) {
  const fz = ease.out(prog(t, 0.3, 0.9)), cam = { z: 1.6, x: 300, y: -150 };
  const { M } = kitchen(g, t, cam, { mood: 'night', lamp: 1, freezer: fz, inside: freezerInside({ hide: true }) });
  layer(g, cam, 1, (g) => {
    const pose = posesAt(t, [[0, P('reach', { hF: [70, -250], eF: [40, -205] })], [1.0, P('holdFront', { hF: [56, -170], eF: [30, -140] })]]);
    const h = hero(g, { x: FRIDGE.x - 150, y: KGY(), s: HS, facing: 1, t, pose, expr: t > 0.7 ? 'surprised' : 'neutral', look: [0.6, -0.2], rim: { color: fz > 0.3 ? '#bff4ff' : M.practical, dir: [1, -0.3], w: 5 } });
    if (t > 1.0) bottle(g, h.hand[0] + 4, h.hand[1] + 50, { s: 0.42, fill: 1 });
    if (fz > 0) FX.lightCone(g, FRIDGE.x + 40, KGY() - FRIDGE.h + 140, { angle: Math.PI * 0.95, spread: 0.6, len: 700, color: '#bff4ff', a: 0.22 * fz });
  });
  FX.dust(g, t, { count: 40, color: '#e8fbff', a: 0.3 });
} });

// n05 — inside the freezer: the bottle goes in, the door shuts, darkness
function freezerClose(g, t, o = {}) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#eafaff', '#a8dcf0', '#5e9fc0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = rng(6); for (let i = 0; i < 120; i++) { const x = r() * E.W, y = r() < 0.5 ? r() * 120 : E.H - r() * 120; circle(g, x, y, 3 + r() * 9, 'rgba(255,255,255,.75)'); }
  rr(g, -100, E.H * 0.86, E.W + 200, 30, 6); g.fillStyle = 'rgba(255,255,255,.7)'; g.fill();
  rr(g, 180, E.H * 0.86 - 220, 300, 220, 14); g.fillStyle = '#3f9a5a'; g.fill(); circle(g, 330, E.H * 0.86 - 110, 60, '#8fe08a');
  rr(g, 1400, E.H * 0.86 - 70, 360, 70, 10); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill();
}
registerShot('n05', { draw(g, t) {
  const cam = { z: 1.05 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    freezerClose(g, t);
    const slide = ease.out(prog(t, 0, 0.7)), bx = lerp(-200, E.W * 0.55, slide), by = E.H * 0.86;
    bottle(g, bx, by, { s: 2.1, fill: 1 });
    if (t < 1.0) { const hx = bx - 100, hy = by - 300; seg(g, [[hx, hy], [-400, hy + 200]], 90, HERO.color); circle(g, hx + 40, hy, 60, '#0c0b18'); }
  });
  // door sweeps closed from the right: light narrows to a slit, then black
  const c = ease.inOut(prog(t, 1.2, 2.0)), x = lerp(E.W + 40, 0, c);
  g.fillStyle = '#0a0c18'; g.fillRect(x, -100, E.W * 2, E.H + 200);
  if (c > 0 && c < 1) { g.fillStyle = 'rgba(200,240,255,.6)'; g.fillRect(x - 6, -100, 6, E.H + 200); }
  if (t > 2.0) { g.fillStyle = '#05060c'; g.fillRect(-100, -100, E.W + 200, E.H + 200); const a = 0.35 * (1 - prog(t, 2.0, 2.6)); seg(g, [[0, E.H * 0.5], [E.W, E.H * 0.5]], 3, alpha('#bff4ff', a)); }
} });

// n06 — sleepy hero stretches, switches the lamp off
registerShot('n06', { draw(g, t) {
  const lamp = t < 2.2 ? 1 : Math.max(0, 1 - (t - 2.2) * 12), cam = { z: 1.35, x: 200, y: -90 };
  const { M } = kitchen(g, t, cam, { mood: 'night', lamp, switchOn: lamp });
  layer(g, cam, 1, (g) => {
    const pose = posesAt(t, [[0, POSES.relaxed], [0.25, POSES.cheer], [1.4, POSES.relaxed], [1.75, P('reach', { hF: [70, -205], eF: [40, -180] })]]);
    hero(g, { x: 1070, y: KGY(), s: HS, facing: 1, t, pose, expr: t < 1.5 ? 'sleepy' : 'neutral', face: t > 0.2 && t < 1.4 ? { mouth: 'oBig' } : null, rim: { color: lamp > 0.5 ? M.practical : '#a9b8ff', dir: [-0.7, -0.6], w: 4 } });
  });
} });

// n07 — time-lapse: the clock spins forward, the moon crosses the window, the kitchen sleeps
registerShot('n07', { draw(g, t) {
  const k = ease.inOut(prog(t, 0.2, 4.0)), cam = { z: 1.45, x: -120, y: -190 };
  kitchen(g, t * 6, cam, { mood: 'night', lamp: 0, clockT: k * 8 * 3600, skyT: k });
  layer(g, cam, 1, (g) => { const a = 0.5 + 0.5 * Math.sin(t * 9); glow(g, FZX, KGY() - FRIDGE.h + FRIDGE.fz, 160, '#9fe8ff', 0.15 * a); });
  FX.dust(g, t * 4, { count: 40, color: '#9fb4ff', a: 0.25 });
  lbl(g, '+' + Math.round(k * 8) + ' h', E.W - V(110, 80), V(160, 230), 1, V(72, 80), '#ffd95a', 'right');
} });

// n08 — x-ray: thermometer falls 20 → −18 °C, frost grows on the bottle
function xrayFridge(g, t) {
  UI.blueprint(g, { grid: 60, a: 0.08 }); const c = alpha('#8fd8ff', 0.6);
  g.strokeStyle = c; g.lineWidth = 4; rr(g, E.W * 0.32, 70, 620, 980, 30); g.stroke(); g.beginPath(); g.moveTo(E.W * 0.32, 580); g.lineTo(E.W * 0.32 + 620, 580); g.stroke();
  g.setLineDash([12, 12]); rr(g, E.W * 0.32 + 30, 95, 560, 460, 16); g.stroke(); g.setLineDash([]);
}
registerShot('n08', { draw(g, t) {
  const cam = { z: 0.96 + 0.04 * t };
  const k = ease.inOut(prog(t, 0.2, 3.4)), temp = Math.round(lerp(20, -18, k));
  layer(g, cam, 1, (g) => {
    xrayFridge(g, t);
    const bx = E.W * 0.32 + 310, by = 545, iceK = prog(temp, 0, -18);
    glow(g, bx, by - 150, 300, '#8fd8ff', 0.15 + 0.2 * iceK);
    bottle(g, bx, by, { s: 1.5, fill: 1, frost: iceK, ice: iceK * 0.8, bulge: iceK * 0.4 });
    thermometer(g, E.W * 0.82, 900, 640, 1 - k, { color: temp > 0 ? '#ff6a5a' : '#5fd0ff' });
    if (temp <= 0) for (let i = 0; i < 5; i++) { const a = i * 1.26 + t; FX.sparkle(g, bx + Math.cos(a) * 140, by - 150 + Math.sin(a) * 200, 18, '#dff8ff', 0.6); }
  });
  lbl(g, `${temp < 0 ? '−' : ''}${Math.abs(temp)} °C`, E.W * 0.82 - 70, 260, 1, V(84, 90), temp > 0 ? '#ff8a7a' : '#8fe8ff', 'right');
  if (temp <= 0 && temp > -6) UI.badge(g, { str: '0 °C', x: E.W * 0.2, y: E.H * 0.5, size: V(70, 76), color: '#ffffff' });
} });

// n09 — macro: crystals grow inward, the plastic creaks and bulges
registerShot('n09', { draw(g, t) {
  const k = ease.inOut(t / 3), [sx, sy] = shake(t, 2 + 4 * prog(t, 2, 3), 30);
  const cam = { z: 1 + 0.08 * k, x: sx, y: sy };
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a1830', '#122a4a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    bottle(g, E.W * 0.5, E.H * 1.75, { s: 5.2, fill: 1, ice: 0.5 + 0.5 * k, frost: 1, bulge: 0.4 + 0.6 * k });
    // inward-growing dendrites
    const r = rng(14); g.strokeStyle = 'rgba(235,252,255,.85)'; g.lineWidth = 3;
    for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1, y = E.H * 0.5 + r() * E.H * 0.45, L = (120 + r() * 300) * (0.3 + 0.7 * k), x0 = E.W / 2 + side * 260 * (1 + 0.12 * k);
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 - side * L, y + (r() - 0.5) * 40); g.stroke();
      for (let j = 1; j < 4; j++) { const bx = x0 - side * L * j / 4; g.beginPath(); g.moveTo(bx, y); g.lineTo(bx - side * 30, y - 30); g.moveTo(bx, y); g.lineTo(bx - side * 30, y + 30); g.stroke(); } }
  });
  // pressure arrows on the walls
  const a = prog(t, 0.8, 1.6);
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) { const y = E.H * (0.3 + i * 0.2), x = E.W / 2 + side * (300 + 40 * Math.sin(t * 8) * a);
    seg(g, [[x - side * 60, y], [x + side * 40, y]], 10, alpha('#ffd95a', a)); poly(g, [[x + side * 70, y], [x + side * 30, y - 24], [x + side * 30, y + 24]], alpha('#ffd95a', a)); }
} });

// n10 — CRACK
registerShot('n10', { draw(g, t) {
  const [sx, sy] = shake(t, 22 * (1 - prog(t, 0, 0.8)), 40), cam = { z: 1.15 - 0.05 * t, x: sx, y: sy };
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a1830', '#16345a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    const bx = E.W / 2, by = E.H * 0.95;
    bottle(g, bx, by, { s: 2.4, fill: 1, ice: 1, frost: 1, bulge: 1, crack: ease.out(prog(t, 0, 0.15)) });
    shards(g, bx + 30, by - 380, t * 2, 14, 0.4 + 1.6 * ease.out(prog(t, 0, 0.8)), 8);
    FX.rings(g, bx + 30, by - 380, t, { count: 3, r0: 60, r1: 700, speed: 1.4, color: '#dff8ff', a: 0.6 * (1 - prog(t, 0, 1.2)) });
  });
  if (t < 0.25) { g.fillStyle = `rgba(255,255,255,${0.9 * (1 - t / 0.25)})`; g.fillRect(-100, -100, E.W + 200, E.H + 200); }
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.6, count: 50, a: 0.3 * (1 - prog(t, 0, 0.7)), color: '#dff8ff' });
} });

// n11 — bedroom: asleep, an eye opens at the sound, closes again
registerShot('n11', { draw(g, t) {
  backdrop(g, ['#0a0e26', '#141a3e']);
  // window with moonlight
  FX.windowFrame(g, { x: 1280, y: 120, w: 420, h: 480, cols: 2, rows: 2, frame: '#0a0c20', bar: 12 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#050a1e', '#1a2250']); g.fillRect(x, y, w, h); FX.stars(g, t, { area: [x, y, w, h], count: 40 }); FX.moon(g, x + w * 0.6, y + h * 0.3, 34); });
  FX.lightCone(g, 1500, 200, { angle: Math.PI * 0.8, spread: 0.5, len: 1300, color: '#9fb4ff', a: 0.1 });
  const cy = E.H * 0.62, r = 230;
  rr(g, 260, cy - 120, 900, 300, 120); g.fillStyle = '#d8dcf4'; g.fill();                       // pillow
  const open = t > 0.7 && t < 2.2;
  bigFace(g, 640, cy - 30, r, { outfit: { ...HERO, top: 'none' }, expr: open ? 'neutral' : 'sleepy', look: [0.8, -0.4], tilt: -0.3, rimColor: '#a9b8ff', rimSide: 1, face: open ? { eyes: 'ring' } : null });
  g.fillStyle = linGrad(g, 0, cy + 60, 0, E.H, ['#3a4a9a', '#22306a']); rr(g, 120, cy + 70, 1500, 600, 80); g.fill();   // blanket
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(300 + i * 280, cy + 90); g.quadraticCurveTo(380 + i * 280, cy + 250, 320 + i * 280, E.H); g.stroke(); }
  if (!open) for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; text(g, 'z', 900 + ph * 160 + i * 20, cy - 260 - ph * 220, { size: 40 + ph * 50, color: alpha('#cfd8ff', 1 - ph), font: 'Nunito', weight: 900 }); }
  veil(g, '#060a20', 0.2);
} });
